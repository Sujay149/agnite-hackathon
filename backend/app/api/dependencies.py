from fastapi import Depends, HTTPException
from sqlalchemy.orm import Session
from ..db.database import get_db
from ..models.user import User
from ..schemas.user import UserCreate
from ..services.auth_service import AuthService

def get_current_user(db: Session = Depends(get_db), user_id: int = Depends(AuthService.get_current_user)):
    user = db.query(User).filter(User.id == user_id).first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return user

def get_user_create_data(user_create: UserCreate):
    return user_create