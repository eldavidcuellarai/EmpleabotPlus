from flask import Flask
from app.config.settings import get_config
import logging
import os

def create_app():
    config = get_config()
    app = Flask(__name__, static_folder=os.path.abspath('static'), template_folder=os.path.abspath('templates'))
    app.config.from_object(config)
    config.setup_logging()

    # Register blueprints
    from app.routes.chat import chat_bp
    from app.routes.health import health_bp
    app.register_blueprint(chat_bp)
    app.register_blueprint(health_bp)

    # Additional setup (CORS, security headers, etc.)
    if config.CORS_ENABLED:
        from flask_cors import CORS
        CORS(app, resources={r"/*": config.get_cors_config()})

    if config.SECURE_HEADERS:
        from flask_talisman import Talisman
        Talisman(app)

    return app
