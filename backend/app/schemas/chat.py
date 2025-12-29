from pydantic import BaseModel
from typing import List, Optional

class ChatMessage(BaseModel):
    user_id: str
    message: str
    timestamp: str

class ChatResponse(BaseModel):
    messages: List[ChatMessage]
    response: str
    error: Optional[str] = None

class ChatRequest(BaseModel):
    user_id: str
    message: str