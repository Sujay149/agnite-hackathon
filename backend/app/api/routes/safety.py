from fastapi import APIRouter, HTTPException
from typing import List
from ..schemas.safety import SafetyIncident, SafetyIncidentCreate
from ..services.safety_service import SafetyService

router = APIRouter()
safety_service = SafetyService()

@router.post("/incidents/", response_model=SafetyIncident)
async def create_incident(incident: SafetyIncidentCreate):
    try:
        return await safety_service.create_incident(incident)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/incidents/", response_model=List[SafetyIncident])
async def get_incidents():
    try:
        return await safety_service.get_incidents()
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/incidents/{incident_id}", response_model=SafetyIncident)
async def get_incident(incident_id: int):
    try:
        incident = await safety_service.get_incident(incident_id)
        if not incident:
            raise HTTPException(status_code=404, detail="Incident not found")
        return incident
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))