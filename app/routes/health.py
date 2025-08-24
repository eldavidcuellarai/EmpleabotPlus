from flask import Blueprint, jsonify, current_app

health_bp = Blueprint('health', __name__)

@health_bp.route('/health')
def health():
    config = current_app.config
    try:
        return jsonify({
            'status': 'ok',
            'local_dev': config.get('LOCAL_DEV', False),
            'azure_configured': config.get('AZURE_OPENAI_KEY') and config.get('AZURE_OPENAI_ENDPOINT') and config.get('AZURE_OPENAI_ASSISTANT_ID'),
            'uploads_dir': config.get('UPLOAD_FOLDER'),
        })
    except Exception as e:
        current_app.logger.error(f"Health check error: {e}")
        return jsonify({'status': 'error', 'detail': str(e)}), 500
