from pydantic import BaseModel
from typing import Optional

class Document(BaseModel):
    id: Optional[int]
    title: str
    content: str
    created_at: Optional[str]
    updated_at: Optional[str]