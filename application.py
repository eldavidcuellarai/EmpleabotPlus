import os
import logging
from flask import Flask, send_from_directory, render_template_string, request, jsonify, session
from werkzeug.utils import secure_filename
from openai import AzureOpenAI

# Configure logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

app = Flask(__name__, static_folder='.', static_url_path='')
app.secret_key = os.environ.get("SESSION_SECRET", "default_secret_key")

# OpenAI client configuration
client = AzureOpenAI(
    api_key=os.environ.get("AZURE_OPENAI_KEY"),
    azure_endpoint=os.environ.get("AZURE_OPENAI_ENDPOINT"),
    api_version="2024-02-15-preview"  # Azure OpenAI API version
)

# Configuración para carga de archivos
UPLOAD_FOLDER = '/tmp/uploads'
ALLOWED_EXTENSIONS = {'pdf'}

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def extract_text_from_pdf(file_path):
    """
    Extract text content from a PDF file.
    Requires PyPDF2 package.
    """
    try:
        import PyPDF2
        text = ""
        with open(file_path, 'rb') as file:
            pdf_reader = PyPDF2.PdfReader(file)
            
            for page in pdf_reader.pages:
                text += page.extract_text() + "\n"
                
        return text.strip()
    except ImportError:
        logger.error("PyPDF2 not installed. Unable to process PDF files.")
        return "Error: PyPDF2 not installed. Unable to process PDF files."
    except Exception as e:
        logger.error(f"Error extracting text from PDF: {str(e)}")
        return f"Error extracting text from PDF: {str(e)}"

def get_or_create_thread():
    """Get existing thread ID from session or create new one"""
    thread_id = session.get('thread_id')
    if not thread_id:
        thread = client.beta.threads.create()
        session['thread_id'] = thread.id
        return thread.id
    return thread_id

@app.route('/')
def index():
    try:
        with open('index.html', 'r', encoding='utf-8') as f:
            html_content = f.read()
        return render_template_string(html_content)
    except Exception as e:
        logger.error(f"Error serving index.html: {str(e)}")
        return f"Error: {str(e)}", 500

@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory('.', path)

@app.route('/chat', methods=['POST'])
def chat():
    try:
        # Handle file upload if included in the request
        pdf_content = ""
        if 'file' in request.files:
            file = request.files['file']
            if file and allowed_file(file.filename):
                filename = secure_filename(file.filename)
                filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
                file.save(filepath)
                # Extract text from PDF
                pdf_content = extract_text_from_pdf(filepath)
                os.remove(filepath)  # Clean up the file after processing
                logger.debug(f"Processed PDF with content length: {len(pdf_content)}")

        # Get the message from form data
        user_message = request.form.get('message', '')
        logger.debug(f"Received message: {user_message}")
        
        # If we have PDF content, prepend it to the message
        if pdf_content:
            user_message = f"PDF Content: {pdf_content}\n\nUser Question: {user_message}"
        elif not user_message:
            return jsonify({'error': 'No message provided'}), 400

        # Get or create thread
        thread_id = get_or_create_thread()
        logger.debug(f"Using thread ID: {thread_id}")

        # Add the user's message to the thread
        client.beta.threads.messages.create(
            thread_id=thread_id,
            role="user",
            content=user_message
        )

        # Run the assistant using the provided Assistant ID
        assistant_id = os.environ.get("AZURE_OPENAI_ASSISTANT_ID")
        logger.debug(f"Using assistant ID: {assistant_id}")
        
        run = client.beta.threads.runs.create(
            thread_id=thread_id,
            assistant_id=assistant_id
        )

        # Wait for the run to complete
        run = client.beta.threads.runs.retrieve(thread_id=thread_id, run_id=run.id)
        while run.status in ["queued", "in_progress"]:
            logger.debug(f"Run status: {run.status}")
            run = client.beta.threads.runs.retrieve(thread_id=thread_id, run_id=run.id)

        # Get the latest message
        messages = client.beta.threads.messages.list(thread_id=thread_id)
        if not messages.data:
            logger.error("No messages returned from API")
            return jsonify({'error': 'No response received'}), 500

        latest_message = messages.data[0]
        response_text = latest_message.content[0].text.value if latest_message.content else ""

        if not response_text:
            logger.error("Empty response text")
            return jsonify({'error': 'Empty response received'}), 500
        
        logger.debug(f"Raw response from assistant, length: {len(response_text)}")
        
        # The response_text from the assistant, which includes the suggestion block,
        # is now passed directly to the frontend. The JS will handle the parsing.
        
        return jsonify({'response': response_text})

    except Exception as e:
        logger.error(f"Error in chat endpoint: {str(e)}")
        return jsonify({'error': str(e)}), 500

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000) 