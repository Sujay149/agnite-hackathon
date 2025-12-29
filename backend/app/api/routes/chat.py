from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List
from app.services.ai_service import AIService

router = APIRouter()

class ChatRequest(BaseModel):
    user_id: str
    message: str

class ChatResponse(BaseModel):
    response: str

@router.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    try:
        ai_service = AIService()
        response = await ai_service.get_response(request.user_id, request.message)
        return ChatResponse(response=response)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))