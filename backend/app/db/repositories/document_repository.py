from sqlalchemy.orm import Session
from app.models.document import Document
from app.schemas.document import DocumentCreate, DocumentUpdate

class DocumentRepository:
    def __init__(self, db: Session):
        self.db = db

    def create_document(self, document: DocumentCreate) -> Document:
        db_document = Document(**document.dict())
        self.db.add(db_document)
        self.db.commit()
        self.db.refresh(db_document)
        return db_document

    def get_document(self, document_id: int) -> Document:
        return self.db.query(Document).filter(Document.id == document_id).first()

    def get_documents(self) -> list[Document]:
        return self.db.query(Document).all()

    def update_document(self, document_id: int, document: DocumentUpdate) -> Document:
        db_document = self.get_document(document_id)
        if db_document:
            for key, value in document.dict(exclude_unset=True).items():
                setattr(db_document, key, value)
            self.db.commit()
            self.db.refresh(db_document)
        return db_document

    def delete_document(self, document_id: int) -> bool:
        db_document = self.get_document(document_id)
        if db_document:
            self.db.delete(db_document)
            self.db.commit()
            return True
        return False