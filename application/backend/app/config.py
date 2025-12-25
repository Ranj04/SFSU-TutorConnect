"""
config.py
---------
Loads environment variables and provides application settings like
database URLs and CORS configuration.

Contributors: Ranjiv Jithendran
"""
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

class Settings:
    """Application settings loaded from environment variables."""
    
    # Database
    DATABASE_URL: str = os.getenv("DATABASE_URL")
    
    def __init__(self):
        """Validate required environment variables on initialization."""
        if not self.DATABASE_URL:
            raise ValueError(
                "DATABASE_URL environment variable is required. "
                "Please copy .env.example to .env and set your database credentials."
            )
    
    # API Configuration
    API_ENV: str = os.getenv("API_ENV", "development")
    API_DEBUG: bool = os.getenv("API_DEBUG", "True").lower() in ("true", "1", "yes")
    
    # CORS Settings
    # Add production domain from environment variable if set
    _cors_origins = [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:5175",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5174",
        "http://127.0.0.1:5175",
    ]
    
    # Add production domain if specified
    _prod_domain = os.getenv("PROD_DOMAIN")
    if _prod_domain:
        _cors_origins.extend([
            f"https://{_prod_domain}",
            f"http://{_prod_domain}",
        ])
    
    CORS_ORIGINS: list = _cors_origins
    
    @property
    def is_production(self) -> bool:
        """Check if running in production environment."""
        return self.API_ENV == "production"
    
    @property
    def is_development(self) -> bool:
        """Check if running in development environment."""
        return self.API_ENV == "development"

# Global settings instance
settings = Settings()

