import google.generativeai as genai
from app.core.config import settings
import os
import asyncio

# Configure at module level, will rely on ENV
if settings.GEMINI_API_KEY:
    genai.configure(api_key=settings.GEMINI_API_KEY)

class GeminiService:
    def __init__(self):
        # We instantiate lazily or check api key
        self.model_name = 'gemini-2.5-flash-preview-09-2025'

    async def generate_notes(self, audio_path: str = None, image_paths: list[str] = [], user_notes: str = "") -> str:
        if not settings.GEMINI_API_KEY:
            return "Error: Gemini API Key not configured."
            
        model = genai.GenerativeModel(self.model_name)
        
        content_parts = [
            "You are an expert academic assistant. Generate clear, structured, and comprehensive notes from the provided material.",
            "Output format: Markdown."
        ]
        
        # Audio
        if audio_path and os.path.exists(audio_path):
            print(f"Uploading audio: {audio_path}")
            audio_file = genai.upload_file(path=audio_path)
            # Wait for processing? Audio usually needs processing state check
            # For now assume small files or wait logic needed
            content_parts.append(audio_file)
            
        # Images
        for img_path in image_paths:
            if os.path.exists(img_path):
                 print(f"Uploading image: {img_path}")
                 img_file = genai.upload_file(path=img_path)
                 content_parts.append(img_file)
        
        # Text
        if user_notes:
            content_parts.append(f"Additional Student Notes: {user_notes}")
            
        content_parts.append("Please synthesize the above inputs into a single cohesive set of notes.")

        try:
            # Run in executor to avoid blocking event loop
            loop = asyncio.get_running_loop()
            response = await loop.run_in_executor(None, lambda: model.generate_content(content_parts))
            return response.text
        except Exception as e:
            print(f"Gemini Error: {e}")
            return f"Error generating notes: {str(e)}"

gemini_service = GeminiService()
