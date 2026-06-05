from fastapi import APIRouter, Depends, HTTPException
from app.core.supabase import get_user_id

router = APIRouter()

@router.get("/user_stats")
async def get_user_stats(user_id: str = Depends(get_user_id)):
    """
    Returns user credits and usage history.
    MOCKED for template purposes.
    """
    return {
        "credits": 100,
        "scene_generations": 0,
        "ad_generations": 0
    }
