from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Multimodal AI Note-Taker"
    PROJECT_VERSION: str = "0.1.0"
    PROJECT_DESCRIPTION: str = "AI-powered note taking assistant"
    
    # Google Gemini
    GEMINI_API_KEY: str = ""

    # Database
    MONGODB_URL: str = "mongodb://localhost:27017"
    DATABASE_NAME: str = "ai_notes"

    class Config:
        env_file = ".env"

settings = Settings()
