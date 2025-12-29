from pydantic_settings import BaseSettings
from typing import List
import os
from pathlib import Path


class Settings(BaseSettings):
    """Application settings loaded from environment variables"""
    
    OPENROUTER_API_KEY: str = "sk-or-v1-demo"  # Default demo key
    BACKEND_PORT: int = 8000
    FRONTEND_URL: str = "http://localhost:5173"
    
    # OpenRouter API Configuration
    OPENROUTER_API_URL: str = "https://openrouter.ai/api/v1/chat/completions"
    MODEL_NAME: str = "openai/gpt-3.5-turbo"
    
    # CORS Settings
    ALLOWED_ORIGINS: List[str] = [
        "http://localhost:5173", 
        "http://127.0.0.1:5173", 
        "http://localhost:5174",
        "http://127.0.0.1:5174",
        "http://localhost:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3001"
    ]
    
    class Config:
        env_file = str(Path(__file__).parent.parent / ".env")
        case_sensitive = True


settings = Settings()
