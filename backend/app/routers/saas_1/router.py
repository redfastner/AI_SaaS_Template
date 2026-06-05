from fastapi import APIRouter

router = APIRouter()

@router.get("/")
async def root():
    return {"message": "Welcome to SaaS 1 API", "status": "active"}

@router.get("/health")
async def health_check():
    return {"status": "healthy", "service": "saas-1"}
