# EmpleabotPlus

A modern Flask web application with integrated OpenAI chatbot for employment assistance. Optimized for RunPod deployment.

## Features

- 🤖 OpenAI-powered employment chatbot
- 📄 PDF CV analysis and processing
- 🎨 Responsive web interface
- 🔄 Session-based conversations
- 🏥 Health monitoring endpoints
- 🚀 RunPod deployment ready

## Project Structure

```
EmpleabotPlus/
├── app/                    # Main Flask application
│   ├── config/            # Configuration
│   ├── routes/            # API routes
│   ├── services/          # OpenAI integration
│   ├── static/            # CSS, JS, images
│   ├── templates/         # HTML templates
│   └── utils/             # PDF processing
├── docs/                  # Documentation
├── attached_assets/       # Application assets
├── run.py                # Entry point
└── requirements.txt      # Dependencies
```

## Quick Start

1. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Create `.env` file:**
   ```env
   OPENAI_API_KEY=your_key_here
   OPENAI_ASSISTANT_ID=your_assistant_id_here
   SESSION_SECRET=your_secret_key
   DEBUG=True
   ```

3. **Run the application:**
   ```bash
   python run.py
   ```

4. **Access:** http://localhost:8000

## Deployment

### RunPod Deployment

This application is optimized for RunPod deployment:

1. **Create RunPod Template:**
   - Use Python 3.11+ base image
   - Set container disk to at least 5GB
   - Configure ports: expose port 8000

2. **Environment Variables:**
   Configure these in RunPod environment:
   ```env
   OPENAI_API_KEY=your_openai_api_key
   OPENAI_ASSISTANT_ID=your_assistant_id
   SESSION_SECRET=your_secure_secret
   PORT=8000
   DEBUG=false
   ```

3. **Startup Command:**
   ```bash
   gunicorn --bind=0.0.0.0:8000 --workers=4 --timeout=120 run:app
   ```

### Alternative Deployment (Docker)

```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
EXPOSE 8000
CMD ["gunicorn", "--bind=0.0.0.0:8000", "--workers=4", "run:app"]
```

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `OPENAI_API_KEY` | OpenAI API key | ✅ |
| `OPENAI_ASSISTANT_ID` | OpenAI Assistant ID for chat | ✅ |
| `SESSION_SECRET` | Flask session secret key | ✅ |
| `PORT` | Application port (default: 8000) | ❌ |
| `DEBUG` | Debug mode (false for production) | ❌ |
| `WORKERS` | Number of Gunicorn workers (default: 4) | ❌ |
| `CORS_ENABLED` | Enable CORS (default: false) | ❌ |

## License

MIT License