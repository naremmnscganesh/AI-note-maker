from pydantic import BaseModel
from typing import List, Optional

class NoteResponse(BaseModel):
    id: str
    title: str
    content: str
    summary: str
    keywords: List[str]

class UploadResponse(BaseModel):
    job_id: str
    status: str
    message: str
