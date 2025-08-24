from flask import Blueprint, request, jsonify, session, current_app
from app.services.openai_service import get_or_create_thread, process_user_message
from werkzeug.utils import secure_filename
from app.utils.pdf_processor import extract_text_from_pdf
import os

chat_bp = Blueprint('chat', __name__)

@chat_bp.route('/chat', methods=['POST'])
def chat():
    config = current_app.config
    pdf_content = ""
    if 'file' in request.files:
        file = request.files['file']
        if file and '.' in file.filename and file.filename.rsplit('.', 1)[1].lower() in config['ALLOWED_EXTENSIONS']:
            filename = secure_filename(file.filename)
            filepath = os.path.join(config['UPLOAD_FOLDER'], filename)
            file.save(filepath)
            pdf_content = extract_text_from_pdf(filepath)
            os.remove(filepath)
    user_message = request.form.get('message', '')
    if pdf_content:
        user_message = f"PDF Content: {pdf_content}\n\nUser Question: {user_message}"
    elif not user_message:
        return jsonify({'error': 'No message provided'}), 400
    try:
        response = process_user_message(user_message, session)
        return jsonify({'response': response})
    except Exception as e:
        current_app.logger.error(f"Error in chat endpoint: {str(e)}")
        return jsonify({'error': str(e)}), 500
