# backend/app/api/routes/__init__.py

from fastapi import APIRouter

router = APIRouter()

from . import auth, chat, documents, safety

router.include_router(auth.router, prefix="/auth", tags=["auth"])
router.include_router(chat.router, prefix="/chat", tags=["chat"])
router.include_router(documents.router, prefix="/documents", tags=["documents"])
router.include_router(safety.router, prefix="/safety", tags=["safety"])