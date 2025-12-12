from fastapi import APIRouter
from app.api.endpoints import upload, notes

api_router = APIRouter()
api_router.include_router(upload.router, tags=["notes"])
api_router.include_router(notes.router, prefix="/notes", tags=["notes"])
