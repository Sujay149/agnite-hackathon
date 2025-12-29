from typing import List
from fastapi import HTTPException
from ..db.repositories.document_repository import DocumentRepository
from ..models.document import Document
from ..schemas.document import DocumentCreate, DocumentUpdate

class DocumentService:
    def __init__(self, document_repository: DocumentRepository):
        self.document_repository = document_repository

    async def create_document(self, document_create: DocumentCreate) -> Document:
        document = await self.document_repository.create(document_create)
        if not document:
            raise HTTPException(status_code=400, detail="Document creation failed")
        return document

    async def get_documents(self) -> List[Document]:
        return await self.document_repository.get_all()

    async def get_document(self, document_id: int) -> Document:
        document = await self.document_repository.get_by_id(document_id)
        if not document:
            raise HTTPException(status_code=404, detail="Document not found")
        return document

    async def update_document(self, document_id: int, document_update: DocumentUpdate) -> Document:
        document = await self.document_repository.update(document_id, document_update)
        if not document:
            raise HTTPException(status_code=404, detail="Document not found")
        return document

    async def delete_document(self, document_id: int) -> None:
        success = await self.document_repository.delete(document_id)
        if not success:
            raise HTTPException(status_code=404, detail="Document not found")