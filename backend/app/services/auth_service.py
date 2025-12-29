from fastapi import HTTPException, Depends
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models.user import User
from app.schemas.user import UserCreate, UserOut
from app.core.security import hash_password, verify_password

class AuthService:
    def __init__(self, db: Session):
        self.db = db

    def register_user(self, user: UserCreate) -> UserOut:
        db_user = self.db.query(User).filter(User.email == user.email).first()
        if db_user:
            raise HTTPException(status_code=400, detail="Email already registered")
        hashed_password = hash_password(user.password)
        new_user = User(email=user.email, password=hashed_password)
        self.db.add(new_user)
        self.db.commit()
        self.db.refresh(new_user)
        return UserOut(email=new_user.email)

    def authenticate_user(self, email: str, password: str) -> UserOut:
        user = self.db.query(User).filter(User.email == email).first()
        if not user or not verify_password(password, user.password):
            raise HTTPException(status_code=401, detail="Invalid credentials")
        return UserOut(email=user.email)

def get_auth_service(db: Session = Depends(get_db)) -> AuthService:
    return AuthService(db)