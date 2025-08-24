# EmpleabotPlus

A modern Flask web application with integrated Azure OpenAI chatbot for employment assistance.

## Features

- 🤖 Azure OpenAI-powered employment chatbot
- 📄 PDF CV analysis and processing
- 🎨 Responsive web interface
- 🔄 Session-based conversations
- 🏥 Health monitoring endpoints

## Project Structure

```
EmpleabotPlus/
├── app/                    # Main Flask application
│   ├── config/            # Configuration
│   ├── routes/            # API routes
│   ├── services/          # Azure OpenAI integration
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
   AZURE_OPENAI_KEY=your_key_here
   AZURE_OPENAI_ENDPOINT=your_endpoint_here
   AZURE_OPENAI_ASSISTANT_ID=your_assistant_id_here
   FLASK_DEBUG=True
   ```

3. **Run the application:**
   ```bash
   python run.py
   ```

4. **Access:** http://localhost:5000

## Deployment

### GitHub Secrets Setup

Before deploying, configure GitHub repository secrets for Azure deployment:

1. **Go to your GitHub repository**
2. **Navigate to Settings** → **Secrets and variables** → **Actions**
3. **Click "New repository secret"** and add:

**Azure Publish Profile:**
- **Name:** `AZUREAPPSERVICE_PUBLISHPROFILE_915236A76C684F54A84128102148EFC3`
- **Value:** Download publish profile from Azure App Service → Overview → "Get publish profile"

**Environment Variables (Optional for GitHub Actions):**
- **Name:** `AZURE_OPENAI_KEY` | **Value:** Your Azure OpenAI API key
- **Name:** `AZURE_OPENAI_ENDPOINT` | **Value:** Your Azure OpenAI endpoint
- **Name:** `AZURE_OPENAI_ASSISTANT_ID` | **Value:** Your assistant ID

> **Note:** Environment variables should be configured in Azure App Service settings rather than GitHub secrets for better security.

### Azure App Service

1. Create Azure Web App with Python 3.12 runtime
2. Set startup command: `gunicorn --bind=0.0.0.0 --workers=4 run:app`
3. Configure environment variables in Azure portal
4. Deploy using GitHub Actions (workflow already configured)

### Environment Variables

| Variable | Description |
|----------|-------------|
| `AZURE_OPENAI_KEY` | Azure OpenAI API key |
| `AZURE_OPENAI_ENDPOINT` | Azure OpenAI endpoint URL |
| `AZURE_OPENAI_ASSISTANT_ID` | Assistant ID for chat |
| `FLASK_DEBUG` | Debug mode (False for production) |

## License

MIT License