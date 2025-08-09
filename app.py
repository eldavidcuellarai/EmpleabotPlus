import os
import logging
from flask import Flask, render_template, request, jsonify, session
from werkzeug.utils import secure_filename
from openai import AzureOpenAI
from utils.pdf_processor import extract_text_from_pdf

# Configure logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

app = Flask(__name__)
app.secret_key = os.environ.get("SESSION_SECRET")

# OpenAI client configuration
client = AzureOpenAI(
    api_key=os.environ.get("AZURE_OPENAI_KEY"),
    azure_endpoint=os.environ.get("AZURE_OPENAI_ENDPOINT"),
    api_version="2024-02-15-preview"  # Azure OpenAI API version
)

UPLOAD_FOLDER = '/tmp/uploads'
ALLOWED_EXTENSIONS = {'pdf'}

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

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
    return render_template('index.html')

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

        # Get the message from form data
        user_message = request.form.get('message', '')

        # If we have PDF content, prepend it to the message
        if pdf_content:
            user_message = f"PDF Content: {pdf_content}\n\nUser Question: {user_message}"
        elif not user_message:
            return jsonify({'error': 'No message provided'}), 400

        # Get or create thread
        thread_id = get_or_create_thread()

        # Add the user's message to the thread
        client.beta.threads.messages.create(
            thread_id=thread_id,
            role="user",
            content=user_message
        )

        # Run the assistant using the provided Assistant ID
        run = client.beta.threads.runs.create(
            thread_id=thread_id,
            assistant_id=os.environ.get("AZURE_OPENAI_ASSISTANT_ID")
        )

        # Wait for the run to complete
        run = client.beta.threads.runs.retrieve(thread_id=thread_id, run_id=run.id)
        while run.status in ["queued", "in_progress"]:
            run = client.beta.threads.runs.retrieve(thread_id=thread_id, run_id=run.id)

        # Get the latest message
        messages = client.beta.threads.messages.list(thread_id=thread_id)
        if not messages.data:
            return jsonify({'error': 'No response received'}), 500

        latest_message = messages.data[0]
        response_text = latest_message.content[0].text.value if latest_message.content else ""

        if not response_text:
            return jsonify({'error': 'Empty response received'}), 500

        return jsonify({'response': response_text})

    except Exception as e:
        logger.error(f"Error in chat endpoint: {str(e)}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)