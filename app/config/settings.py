import os
import logging
from pathlib import Path
from typing import Optional
from dotenv import load_dotenv

class Config:
    """Base configuration class with Azure App Service optimizations"""
    
    def __init__(self):
        # Load environment variables
        dotenv_path = Path(__file__).resolve().parent.parent.parent / ".env"
        load_dotenv(dotenv_path=dotenv_path, override=False)
        
        # Basic Flask configuration
        self.SECRET_KEY = self._get_required_env("SESSION_SECRET", "dev_secret_change_me")
        self.DEBUG = self._get_bool_env("DEBUG", False)
        
        # Azure OpenAI Configuration
        self.AZURE_OPENAI_KEY = self._first_nonempty(
            os.getenv("AZURE_OPENAI_KEY"),
            os.getenv("AZURE_OPENAI_API_KEY"),
            os.getenv("OPENAI_API_KEY"),
        )
        self.AZURE_OPENAI_ENDPOINT = self._first_nonempty(
            os.getenv("AZURE_OPENAI_ENDPOINT"),
            os.getenv("OPENAI_API_BASE"),
        )
        self.AZURE_OPENAI_ASSISTANT_ID = os.getenv("AZURE_OPENAI_ASSISTANT_ID")
        self.AZURE_OPENAI_API_VERSION = os.getenv("AZURE_OPENAI_API_VERSION", "2024-02-15-preview")
        
        # App Service Configuration
        self.PORT = int(os.getenv("PORT", 8000))
        self.HOST = os.getenv("HOST", "0.0.0.0")
        self.WORKERS = int(os.getenv("WORKERS", 4))
        
        # File Upload Configuration
        self.UPLOAD_FOLDER = os.path.join(os.getcwd(), 'uploads')
        self.MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16MB max file size
        self.ALLOWED_EXTENSIONS = {'pdf'}
        
        # Logging Configuration
        self.LOG_LEVEL = os.getenv("LOG_LEVEL", "INFO").upper()
        self.AZURE_INSIGHTS_KEY = os.getenv("APPINSIGHTS_INSTRUMENTATIONKEY")
        
        # Security Configuration
        self.SECURE_HEADERS = self._get_bool_env("SECURE_HEADERS", True)
        self.CORS_ENABLED = self._get_bool_env("CORS_ENABLED", False)
        
        # Feature Flags
        self.LOCAL_DEV = self._get_bool_env("LOCAL_DEV", not self.is_azure_configured())
        
        # Validate required configuration
        self._validate_config()
    
    def _get_required_env(self, key: str, default: str = None) -> str:
        """Get required environment variable with optional default"""
        value = os.getenv(key, default)
        if not value:
            raise ValueError(f"Required environment variable {key} is not set")
        return value
    
    def _get_bool_env(self, key: str, default: bool = False) -> bool:
        """Get boolean environment variable"""
        value = os.getenv(key, str(default)).lower().strip()
        return value in {"1", "true", "yes", "on"}
    
    def _first_nonempty(self, *values) -> Optional[str]:
        """Return first non-empty string from values"""
        for v in values:
            if v and str(v).strip():
                return str(v).strip()
        return None
    
    def is_azure_configured(self) -> bool:
        """Check if Azure OpenAI is properly configured"""
        return all([
            self.AZURE_OPENAI_KEY,
            self.AZURE_OPENAI_ENDPOINT,
            self.AZURE_OPENAI_ASSISTANT_ID
        ])
    
    def _validate_config(self):
        """Validate critical configuration"""
        if not self.LOCAL_DEV and not self.is_azure_configured():
            # Don't crash the whole application on startup in hosted environments.
            # Log a clear warning and fall back to LOCAL_DEV so diagnostics and
            # health endpoints remain available. Production behavior still
            # requires setting the Azure OpenAI environment variables.
            logging.getLogger(__name__).warning(
                "Azure OpenAI configuration is incomplete for production deployment. "
                "Falling back to LOCAL_DEV mode so the app can start. "
                "Set AZURE_OPENAI_KEY, AZURE_OPENAI_ENDPOINT, and "
                "AZURE_OPENAI_ASSISTANT_ID in the App Service configuration to enable production mode."
            )
            # allow the app to start for diagnostics; callers can check is_azure_configured()
            self.LOCAL_DEV = True
    
    def setup_logging(self):
        """Configure logging for Azure App Service"""
        log_format = '[%(asctime)s] %(levelname)s in %(module)s: %(message)s'
        
        logging.basicConfig(
            level=getattr(logging, self.LOG_LEVEL),
            format=log_format,
            handlers=[
                logging.StreamHandler(),  # For Azure App Service logs
            ]
        )
        
        # Disable noisy loggers
        logging.getLogger('urllib3').setLevel(logging.WARNING)
        logging.getLogger('requests').setLevel(logging.WARNING)
        logging.getLogger('azure').setLevel(logging.WARNING)
        
        return logging.getLogger(__name__)
    
    def get_cors_config(self) -> dict:
        """Get CORS configuration"""
        if not self.CORS_ENABLED:
            return {}
            
        return {
            'origins': os.getenv('CORS_ORIGINS', '*').split(','),
            'methods': ['GET', 'POST', 'OPTIONS'],
            'allow_headers': ['Content-Type', 'Authorization']
        }

class DevelopmentConfig(Config):
    """Development configuration"""
    
    def __init__(self):
        super().__init__()
        self.DEBUG = True
        self.LOCAL_DEV = True

class ProductionConfig(Config):
    """Production configuration for Azure App Service"""
    
    def __init__(self):
        super().__init__()
        self.DEBUG = False
        self.LOCAL_DEV = False
        self.SECURE_HEADERS = True

def get_config() -> Config:
    """Factory function to get appropriate configuration"""
    env = os.getenv('FLASK_ENV', 'production').lower()
    
    if env == 'development':
        return DevelopmentConfig()
    else:
        return ProductionConfig()