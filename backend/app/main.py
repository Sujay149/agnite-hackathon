"""Main FastAPI application"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import logging
import os
from pathlib import Path

# Add the app directory to Python path
import sys
sys.path.insert(0, str(Path(__file__).parent))

# Import our modules
try:
    from config import Settings
    from ai_service import AIService
    from sample_sops import get_sop_list, get_sop_content
except ImportError:
    from app.config import Settings
    from app.ai_service import AIService
    from app.sample_sops import get_sop_list, get_sop_content

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize settings
settings = Settings()

# Initialize FastAPI app
app = FastAPI(
    title="Manufacturing SOP & Safety Explainer Bot",
    description="AI-powered explanation system for manufacturing SOPs and safety procedures",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173", 
        "http://127.0.0.1:5173", 
        "http://localhost:5174",
        "http://127.0.0.1:5174",
        "http://localhost:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize AI service
ai_service = AIService()


# Request/Response Models
class ChatRequest(BaseModel):
    """Chat request model"""
    question: str
    sop_id: Optional[str] = None


class ChatResponse(BaseModel):
    """Chat response model"""
    response: str
    safe: bool
    filtered: bool = False


class SOPInfo(BaseModel):
    """SOP information model"""
    id: str
    title: str


@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "Manufacturing SOP & Safety Explainer Bot",
        "version": "1.0.0"
    }


@app.get("/api/sops", response_model=list[SOPInfo])
async def get_sops():
    """Get list of available SOPs"""
    try:
        sops = get_sop_list()
        return sops
    except Exception as e:
        logger.error(f"Error fetching SOPs: {str(e)}")
        raise HTTPException(status_code=500, detail="Error fetching SOPs")


@app.post("/api/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """
    Process chat request and return AI-generated explanation
    
    This endpoint:
    1. Validates the request
    2. Applies safety filtering
    3. Retrieves relevant SOP content (if provided)
    4. Calls AI service for explanation
    5. Returns safe, educational response
    """
    try:
        # Validate question
        if not request.question or len(request.question.strip()) == 0:
            raise HTTPException(status_code=400, detail="Question cannot be empty")
        
        if len(request.question) > 1000:
            raise HTTPException(status_code=400, detail="Question too long (max 1000 characters)")
        
        # Get SOP content if provided
        sop_context = None
        if request.sop_id:
            sop_context = get_sop_content(request.sop_id)
            if not sop_context:
                logger.warning(f"Invalid SOP ID provided: {request.sop_id}")
        
        # Generate explanation
        result = await ai_service.generate_explanation(
            user_query=request.question,
            sop_context=sop_context
        )
        
        return ChatResponse(
            response=result["response"],
            safe=result["safe"],
            filtered=result.get("filtered", False)
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error processing chat request: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="An error occurred processing your request. Please try again."
        )


@app.get("/api/health")
async def health_check():
    """Detailed health check endpoint"""
    return {
        "status": "healthy",
        "api_configured": bool(settings.OPENROUTER_API_KEY),
        "model": settings.MODEL_NAME,
        "available_sops": len(get_sop_list())
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=settings.BACKEND_PORT,
        reload=True
    )