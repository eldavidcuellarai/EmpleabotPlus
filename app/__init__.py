from flask import Flask
from app.config.settings import get_config
import logging
import os

def create_app():
    config = get_config()
    app = Flask(__name__, static_folder='static', template_folder='templates')
    app.config.from_object(config)
    config.setup_logging()

    # Register blueprints
    from app.routes.chat import chat_bp
    from app.routes.health import health_bp
    from app.routes.main import main_bp
    app.register_blueprint(chat_bp)
    app.register_blueprint(health_bp)
    app.register_blueprint(main_bp)

    # Additional setup (CORS, security headers, etc.)
    if config.CORS_ENABLED:
        try:
            from flask_cors import CORS
            CORS(app, resources={r"/*": config.get_cors_config()})
        except Exception:
            # Optional dependency missing — log and continue so the app can start
            logging.getLogger(__name__).warning('flask_cors not available; skipping CORS setup')

    if config.SECURE_HEADERS:
        try:
            from flask_talisman import Talisman
            Talisman(app)
        except Exception:
            logging.getLogger(__name__).warning('flask_talisman not available; skipping secure headers')

    return app
