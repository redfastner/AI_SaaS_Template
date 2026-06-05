from fastapi import HTTPException, Security
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from supabase import create_client, Client
from app.core.config import settings

# --- RESILIENT INITIALIZATION ---
supabase: Client = None

if settings.SUPABASE_URL and settings.SUPABASE_SERVICE_KEY:
    try:
        supabase = create_client(settings.SUPABASE_URL, settings.SUPABASE_SERVICE_KEY)
    except Exception as e:
        print(f"CRITICAL: Supabase init failed: {e}")
else:
    print("WARNING: Supabase credentials missing. Server will boot but DB features will fail.")

supabase_admin = supabase
security = HTTPBearer()

def get_current_user(credentials: HTTPAuthorizationCredentials = Security(security)):
    if not supabase:
        raise HTTPException(status_code=500, detail="Database connection not initialized")
    
    token = credentials.credentials
    try:
        # Note: In production, we call the sync wrapper to verify the token
        user_response = supabase.auth.get_user(token)
        if not user_response or not user_response.user:
             raise HTTPException(status_code=401, detail="Invalid Authentication")
        return user_response.user
    except Exception as e:
        print(f"Auth Error: {e}")
        raise HTTPException(status_code=401, detail="Invalid Authentication Token")

def get_user_id(credentials: HTTPAuthorizationCredentials = Security(security)) -> str:
    user = get_current_user(credentials)
    return user.id