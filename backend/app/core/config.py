"""
Executive Summary: Central configuration manager. 
Loads environment variables from .env and provides application-wide settings (API keys, global flags).
"""
import os
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

class Settings:
    # Application Mode / Debug
    ENV = os.getenv("ENV", "development")
    # SECURITY: Default to False. Developers must explicitly set DEBUG=True.
    # Debug mode enables verbose errors and relaxes some security guards.
    DEBUG = os.getenv("DEBUG", "False").lower() in ("true", "1", "yes")

    # CORS Configuration
    CORS_ORIGINS_RAW = os.getenv("CORS_ORIGINS", "")
    ALLOWED_ORIGINS = [origin.strip() for origin in CORS_ORIGINS_RAW.split(",") if origin.strip()] if CORS_ORIGINS_RAW else [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://127.0.0.1:3000",
    ]

    # BFL Configuration
    STRIPE_WEBHOOK_SECRET = os.getenv("STRIPE_WEBHOOK_SECRET")
    BFL_API_KEY = os.getenv("BLACK_FOREST_KEY")
    
    if not BFL_API_KEY:
         print("WARNING: BLACK_FOREST_KEY not found in .env")

    # Supabase Configuration
    SUPABASE_URL = os.getenv("SUPABASE_URL")
    SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_KEY") # Use Service Role for Backend Admin
    
    # Stripe Configuration
    STRIPE_SECRET_KEY = os.getenv("STRIPE_SECRET_KEY")
    STRIPE_PUBLISHABLE_KEY = os.getenv("NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY")
    FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000")

    # Data Persistence
    # Default to local 'data' folder relative to project root if not set
    # Project root is assumed to be 3 levels up from this config file (backend/app/core/config.py -> backend/)
    # Actually config.py is in backend/app/core. So parent.parent is backend.
    BASE_DIR = Path(__file__).resolve().parent.parent.parent
    DATA_DIR = os.getenv("DATA_DIR", str(BASE_DIR / "data"))

settings = Settings()