from pydantic import BaseModel
from typing import List, Optional

class SafetyProcedure(BaseModel):
    id: int
    title: str
    description: str
    created_at: str
    updated_at: str

class SafetyIncident(BaseModel):
    id: int
    procedure_id: int
    description: str
    reported_at: str
    resolved: bool

class SafetyResponse(BaseModel):
    procedures: List[SafetyProcedure]
    incidents: List[SafetyIncident]

class SafetyReport(BaseModel):
    incident_id: int
    action_taken: str
    follow_up_date: Optional[str] = None