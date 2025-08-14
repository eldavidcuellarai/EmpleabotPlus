import os
import logging
import json
from pathlib import Path
from flask import Flask, render_template, request, jsonify, session
from werkzeug.utils import secure_filename
from openai import AzureOpenAI
from utils.pdf_processor import extract_text_from_pdf
from dotenv import load_dotenv

# Load .env next to this file (robust on Windows)
dotenv_path = Path(__file__).resolve().parent / ".env"
load_dotenv(dotenv_path=dotenv_path, override=False)

# Configure logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

app = Flask(__name__)
app.secret_key = os.environ.get("SESSION_SECRET", "dev_secret_change_me")

# OpenAI client configuration with local-dev fallback
def first_nonempty(*values):
    for v in values:
        if v and str(v).strip():
            return str(v).strip()
    return ""

AZURE_OPENAI_KEY = first_nonempty(
    os.environ.get("AZURE_OPENAI_KEY"),
    os.environ.get("AZURE_OPENAI_API_KEY"),
    os.environ.get("OPENAI_API_KEY"),
)
AZURE_OPENAI_ENDPOINT = first_nonempty(
    os.environ.get("AZURE_OPENAI_ENDPOINT"),
    os.environ.get("OPENAI_API_BASE"),
)
AZURE_OPENAI_ASSISTANT_ID = first_nonempty(
    os.environ.get("AZURE_OPENAI_ASSISTANT_ID"),
)
LOCAL_DEV = (os.environ.get("LOCAL_DEV", "true") or "").lower().strip() in {"1", "true", "yes"}

client = None
if AZURE_OPENAI_KEY and AZURE_OPENAI_ENDPOINT and AZURE_OPENAI_ASSISTANT_ID:
    client = AzureOpenAI(
        api_key=AZURE_OPENAI_KEY,
        azure_endpoint=AZURE_OPENAI_ENDPOINT,
        api_version="2024-02-15-preview"
    )
    LOCAL_DEV = False
else:
    logger.warning("Running in LOCAL_DEV mode: Azure OpenAI env vars not fully configured. Responses will be simulated.")
    logger.info(
        "Azure config present? key=%s endpoint=%s assistant_id=%s",
        bool(AZURE_OPENAI_KEY), bool(AZURE_OPENAI_ENDPOINT), bool(AZURE_OPENAI_ASSISTANT_ID)
    )

UPLOAD_FOLDER = os.path.join(os.getcwd(), 'uploads')
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

        if LOCAL_DEV:
            # Simple inline HTML for artifact preview
            sample_html = (
                "<!doctype html><html><head><meta charset='utf-8'><title>CV</title>"
                "<style>body{font-family:Arial;margin:24px;}h1{color:#21825C;margin:0;}"
                "h2{margin:8px 0 0;} .section{margin-top:14px;} .item{margin:6px 0;}</style>"
                "</head><body>"
                f"<h1>Nombre Apellido</h1><p>Resumen profesional breve. PDF extraído: {bool(pdf_content)}</p>"
                "<div class='section'><h2>Experiencia</h2><div class='item'><strong>Rol</strong> — Empresa (2022-2024)</div></div>"
                "<div class='section'><h2>Educación</h2><div class='item'>Licenciatura — Universidad</div></div>"
                "<div class='section'><h2>Habilidades</h2><div class='item'>Python, Excel, Comunicación</div></div>"
                "</body></html>"
            )
            artifacts_block = (
                "---ARTIFACTS-START---\n" 
                + json.dumps({
                    "artifacts": [
                        {"id": "cv-general", "type": "html", "title": "CV optimizado (General)", "content": sample_html}
                    ]
                }) 
                + "\n---ARTIFACTS-END---"
            )
            simulated = (
                "Gracias por tu mensaje. Estoy en modo local.\n\n"
                "Debajo encontrarás un artifact con un CV de ejemplo.\n\n"
                + artifacts_block +
                "\n\n---\n**Sugerencias:**\n"
                "- [¿Cómo mejorar mi CV?](acción:mejorar-cv)\n"
                "- [¿Consejos para entrevistas?](acción:entrevistas)\n"
                "- [¿Cursos recomendados?](acción:cursos)\n"
            )
            return jsonify({'response': simulated})

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
            assistant_id=AZURE_OPENAI_ASSISTANT_ID
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
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 5000)), debug=True)

@app.route('/health')
def health():
    try:
        return jsonify({
            'status': 'ok',
            'local_dev': LOCAL_DEV,
            'azure_configured': bool(AZURE_OPENAI_KEY and AZURE_OPENAI_ENDPOINT and AZURE_OPENAI_ASSISTANT_ID),
            'uploads_dir': app.config.get('UPLOAD_FOLDER'),
        })
    except Exception as e:
        logger.error(f"Health check error: {e}")
        return jsonify({'status': 'error', 'detail': str(e)}), 500