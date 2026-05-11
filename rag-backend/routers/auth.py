from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr
from database.neon_db import get_db
from models.schema import User
from services.auth_service import get_password_hash, verify_password, create_access_token

router = APIRouter(prefix="/api/auth", tags=["auth"])

from models.schema import User, UserPreference

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    full_name: str = None
    software_background: str = None
    hardware_background: str = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str
    email: str
    full_name: str = None

@router.post("/signup", response_model=Token)
def signup(user_data: UserCreate, db: Session = Depends(get_db)):
    # Check if user exists
    db_user = db.query(User).filter(User.email == user_data.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create new user
    hashed_password = get_password_hash(user_data.password)
    new_user = User(
        email=user_data.email, 
        full_name=user_data.full_name, 
        hashed_password=hashed_password
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    # Create user preferences
    background_combined = f"software:{user_data.software_background}, hardware:{user_data.hardware_background}"
    new_prefs = UserPreference(user_id=new_user.id, background=background_combined)
    db.add(new_prefs)
    db.commit()
    
    # Generate token
    access_token = create_access_token(data={"sub": new_user.email})
    return {
        "access_token": access_token, 
        "token_type": "bearer", 
        "email": new_user.email,
        "full_name": new_user.full_name
    }

@router.post("/signin", response_model=Token)
def signin(user_data: UserLogin, db: Session = Depends(get_db)):
    # Authenticate user
    user = db.query(User).filter(User.email == user_data.email).first()
    if not user or not verify_password(user_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Generate token
    access_token = create_access_token(data={"sub": user.email})
    return {
        "access_token": access_token, 
        "token_type": "bearer", 
        "email": user.email,
        "full_name": user.full_name
    }
