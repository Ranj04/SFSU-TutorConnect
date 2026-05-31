"""
config.py
---------
Loads environment variables and provides application settings like
database URLs and CORS configuration.

Contributors: Ranjiv Jithendran
"""
import os
import secrets
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

def _normalize_database_url(url: str) -> str:
    """
    Normalize a database URL to a SQLAlchemy-compatible driver string.

    Managed MySQL providers (Railway, etc.) hand out URLs like
    `mysql://user:pass@host:port/db`. SQLAlchemy would try the default MySQLdb
    driver for the bare `mysql://` scheme, which is not installed; we ship
    PyMySQL, so rewrite the scheme to `mysql+pymysql://`. URLs that already
    specify a driver (e.g. `mysql+pymysql://`) are returned unchanged.
    """
    if not url:
        return url
    if url.startswith("mysql://"):
        return "mysql+pymysql://" + url[len("mysql://"):]
    return url


class Settings:
    """Application settings loaded from environment variables."""

    # Database
    DATABASE_URL: str = _normalize_database_url(os.getenv("DATABASE_URL"))

    # Authentication: lifetime of an issued access token (default 7 days).
    ACCESS_TOKEN_EXPIRE_SECONDS: int = int(
        os.getenv("ACCESS_TOKEN_EXPIRE_SECONDS", str(7 * 24 * 3600))
    )

    def __init__(self):
        """Validate required environment variables on initialization."""
        # Re-read at instantiation so tests / runtime env changes are honored.
        self.DATABASE_URL = _normalize_database_url(os.getenv("DATABASE_URL"))
        if not self.DATABASE_URL:
            raise ValueError(
                "DATABASE_URL environment variable is required. "
                "Please copy .env.example to .env and set your database credentials."
            )

        # Secret key used to sign authentication tokens. REQUIRED in production;
        # in development we fall back to an ephemeral key (tokens are invalidated
        # whenever the server restarts).
        self.SECRET_KEY = os.getenv("SECRET_KEY", "")
        if not self.SECRET_KEY:
            if self.is_production:
                raise ValueError(
                    "SECRET_KEY environment variable is required in production. "
                    'Generate one with: python -c "import secrets; print(secrets.token_hex(32))"'
                )
            self.SECRET_KEY = secrets.token_hex(32)

        # Build the CORS allowlist. In development we permit the local Vite/CRA
        # dev servers; in production those are excluded and only the configured
        # production domain (https only) is allowed.
        origins = []
        if not self.is_production:
            origins.extend([
                "http://localhost:3000",
                "http://localhost:5173",
                "http://localhost:5174",
                "http://localhost:5175",
                "http://127.0.0.1:3000",
                "http://127.0.0.1:5173",
                "http://127.0.0.1:5174",
                "http://127.0.0.1:5175",
            ])
        prod_domain = os.getenv("PROD_DOMAIN")
        if prod_domain:
            origins.append(f"https://{prod_domain}")
        self.CORS_ORIGINS = origins
    
    # API Configuration
    API_ENV: str = os.getenv("API_ENV", "development")
    # Default to False so production never leaks stack traces / SQL echo unless
    # explicitly enabled. Developers should set API_DEBUG=True in their local .env.
    API_DEBUG: bool = os.getenv("API_DEBUG", "False").lower() in ("true", "1", "yes")
    
    # CORS_ORIGINS is computed in __init__ so it can be environment-aware
    # (localhost dev origins are excluded in production, and the production
    # domain is only allowed over https).
    CORS_ORIGINS: list = []

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

