from fastapi import APIRouter, HTTPException
from app.schemas import NoteResponse
import os

router = APIRouter()
UPLOAD_DIR = "uploads"

@router.get("/{job_id}", response_model=NoteResponse)
async def get_note(job_id: str):
    # Check if processing is done
    output_path = os.path.join(UPLOAD_DIR, f"{job_id}_notes.md")
    
    if not os.path.exists(output_path):
        # Check if job exists at all (files present)
        # For MVP returning 404 or specific status
        raise HTTPException(status_code=404, detail="Notes not found or still processing")
        
    with open(output_path, "r", encoding="utf-8") as f:
        content = f.read()
        
    # Return dummy structure for now as content is just markdown string
    return NoteResponse(
        id=job_id,
        title="Generated Notes",
        content=content,
        summary="Summary pending...",
        keywords=[]
    )
