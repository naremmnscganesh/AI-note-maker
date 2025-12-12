from fastapi import APIRouter, UploadFile, File, Form, BackgroundTasks
from typing import List, Optional
from app.schemas import UploadResponse
import shutil
import os
import uuid

router = APIRouter()

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

from app.services.gemini_service import gemini_service

async def process_upload(job_id: str, notes: Optional[str]):
    print(f"Starting processing for job {job_id}...")
    
    # Identify files for this job
    # In a real app, query DB. Here, scan directory for simplicity
    try:
        files = os.listdir(UPLOAD_DIR)
        audio_files = [f for f in files if f.startswith(job_id) and f.endswith(('.mp3', '.wav', '.m4a'))]
        image_files = [f for f in files if f.startswith(job_id) and f.endswith(('.jpg', '.png', '.jpeg'))]
        
        audio_path = os.path.join(UPLOAD_DIR, audio_files[0]) if audio_files else None
        image_paths = [os.path.join(UPLOAD_DIR, img) for img in image_files]
        
        print(f"Found audio: {audio_path}, images: {len(image_paths)}")
        
        generated_notes = await gemini_service.generate_notes(
            audio_path=audio_path, 
            image_paths=image_paths, 
            user_notes=notes or ""
        )
        
        # Save result to file
        output_path = os.path.join(UPLOAD_DIR, f"{job_id}_notes.md")
        with open(output_path, "w", encoding="utf-8") as f:
            f.write(generated_notes)
            
        print(f"Job {job_id} completed. Saved to {output_path}")
        
    except Exception as e:
        print(f"Error processing job {job_id}: {e}")

@router.post("/upload", response_model=UploadResponse)
async def upload_files(
    background_tasks: BackgroundTasks,
    audio: Optional[UploadFile] = File(None),
    images: List[UploadFile] = File(None),
    notes: Optional[str] = Form(None)
):
    job_id = str(uuid.uuid4())
    
    # Save files
    if audio:
        audio_path = f"{UPLOAD_DIR}/{job_id}_{audio.filename}"
        with open(audio_path, "wb") as buffer:
            shutil.copyfileobj(audio.file, buffer)
            
    if images:
        for img in images:
            img_path = f"{UPLOAD_DIR}/{job_id}_{img.filename}"
            with open(img_path, "wb") as buffer:
                shutil.copyfileobj(img.file, buffer)
    
    # Trigger background processing
    background_tasks.add_task(process_upload, job_id, notes)

    return UploadResponse(
        job_id=job_id,
        status="processing",
        message="Upload received and processing started"
    )
