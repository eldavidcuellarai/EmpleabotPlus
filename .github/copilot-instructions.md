# EmpleabotPlus Copilot Instructions

This document provides guidance for AI coding agents to effectively contribute to the EmpleabotPlus codebase.

## Architecture Overview

This project is a Flask web application with a modern frontend and an integrated AI chatbot. The backend is structured using a standard Flask application factory pattern (`create_app` in `app/__init__.py`).

The core application logic resides in the `app/` directory:
- **`app/__init__.py`**: The entry point for the application factory. It initializes Flask, registers blueprints, and sets up configurations like CORS and security headers.
- **`app/routes/`**: Defines the API endpoints. For example, `app/routes/chat.py` handles the chatbot's communication logic.
- **`app/services/`**: Contains business logic and integrations with external services. `app/services/azure_openai.py` is responsible for connecting to the Azure OpenAI service to power the chatbot.
- **`app/config/settings.py`**: Manages application configuration, pulling values from environment variables.
- **`app/utils/pdf_processor.py`**: A utility for processing PDF files, likely to extract text for the chatbot's knowledge base.
- **`static/` & `templates/`**: Standard Flask directories for serving static assets (CSS, JS, images) and HTML templates.

The frontend is built with plain HTML, CSS, and JavaScript. The main UI files are `templates/index.html` and the assets in `static/`.

## Development Workflow

### Running the Application

To run the development server, execute the main entry point:

```bash
python main.py
```

This will start the Flask development server, typically on `http://127.0.0.1:5000`. The host and port are configured in `main.py`.

### Managing Dependencies

The project uses `requirements.txt` and `pyproject.toml` to manage Python dependencies. To install or update packages, modify `requirements.txt` and then run:

```bash
pip install -r requirements.txt
```

### Key Conventions

- **Application Factory**: All application setup logic should be within the `create_app` function in `app/__init__.py`. This includes registering new blueprints, adding middleware, or configuring extensions.
- **Blueprints for Routing**: New sets of related routes should be created in their own blueprint file within the `app/routes/` directory and registered in `create_app`.
- **Service Layer**: Logic for interacting with external APIs (like Azure OpenAI) or performing complex business operations should be encapsulated in the `app/services/` directory. This keeps the route handlers in `app/routes/` clean and focused on handling HTTP requests and responses.
- **Configuration**: All configuration should be managed through `app/config/settings.py` and sourced from environment variables using `python-dotenv`. Do not hardcode credentials or configuration values.

## Chatbot Integration

The chatbot is a central feature.
- The frontend logic is in `static/js/chat.js` and `static/js/empleabot-chat.js`.
- The backend API is defined in `app/routes/chat.py`.
- The connection to the AI model is handled by `app/services/azure_openai.py`.

When working on the chatbot, you will likely need to modify files across the frontend, routing, and service layers.
python -m venv empleabot_envpython -m venv empleabot_env