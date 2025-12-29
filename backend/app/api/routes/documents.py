from fastapi import APIRouter, HTTPException
from typing import List
from app.schemas.document import DocumentCreate, DocumentResponse
from app.services.document_service import DocumentService

router = APIRouter()
document_service = DocumentService()

@router.post("/", response_model=DocumentResponse)
async def create_document(document: DocumentCreate):
    try:
        return await document_service.create_document(document)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/", response_model=List[DocumentResponse])
async def get_documents():
    try:
        return await document_service.get_all_documents()
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/{document_id}", response_model=DocumentResponse)
async def get_document(document_id: int):
    try:
        return await document_service.get_document_by_id(document_id)
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.delete("/{document_id}", response_model=dict)
async def delete_document(document_id: int):
    try:
        await document_service.delete_document(document_id)
        return {"message": "Document deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))