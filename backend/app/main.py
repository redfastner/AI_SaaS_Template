"""
Executive Summary: Application entry point. 
Configures FastAPI, CORS, static file serving (for generated images), and API router integration.
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.core.config import settings
from app.routers.saas_1 import router as saas_1_router
from app.routers.saas_2 import router as saas_2_router
from app.routers.saas_3 import router as saas_3_router
from app.routers import payment, stats
import os

# SECURITY: Disable interactive API docs in production to avoid exposing
# the full API surface and schema to the public.
_docs_url = None if settings.ENV == "production" else "/docs"
_redoc_url = None if settings.ENV == "production" else "/redoc"
_openapi_url = None if settings.ENV == "production" else "/openapi.json"

app = FastAPI(
    title="Optimize Maximal AI Backend",
    version="1.0",
    docs_url=_docs_url,
    redoc_url=_redoc_url,
    openapi_url=_openapi_url,
)

# CORS (Frontend Access)
# SECURITY: Methods and headers are restricted to only what the API uses.
# Wildcard allow_methods and allow_headers are overly permissive.
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type", "stripe-signature"],
)

# Routes
app.include_router(saas_1_router, prefix="/api/v1/saas-1", tags=["SaaS 1"])
app.include_router(saas_2_router, prefix="/api/v1/saas-2", tags=["SaaS 2"])
app.include_router(saas_3_router, prefix="/api/v1/saas-3", tags=["SaaS 3"])
app.include_router(payment.router, prefix="/api/payment", tags=["Payment"])
app.include_router(stats.router, prefix="/api/stats", tags=["Stats"])

@app.get("/")
def health_check():
    return {"status": "online"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)