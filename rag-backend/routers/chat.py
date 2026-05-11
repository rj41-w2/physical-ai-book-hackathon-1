from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from pydantic import BaseModel
from datetime import datetime
from database.neon_db import get_db
from models.schema import ChatHistory, User
from services.auth_service import get_current_user

router = APIRouter(prefix="/api/chat", tags=["chat"])

class ChatHistorySchema(BaseModel):
    message_role: str
    message_content: str
    timestamp: datetime

    class Config:
        from_attributes = True

@router.get("/history", response_model=List[ChatHistorySchema])
def get_chat_history(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    history = db.query(ChatHistory).filter(ChatHistory.user_id == current_user.id).order_by(ChatHistory.timestamp.asc()).all()
    return history

@router.delete("/history")
def clear_chat_history(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    db.query(ChatHistory).filter(ChatHistory.user_id == current_user.id).delete()
    db.commit()
    return {"message": "Chat history cleared successfully"}
