from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text, Index
from sqlalchemy.orm import relationship
from datetime import datetime
from database.neon_db import Base
from pgvector.sqlalchemy import Vector
from services.rag.config import EMBEDDING_DIMENSION

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    full_name = Column(String)
    hashed_password = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    preferences = relationship("UserPreference", back_populates="user", uselist=False)
    chat_history = relationship("ChatHistory", back_populates="user")

class UserPreference(Base):
    __tablename__ = "user_preferences"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)
    background = Column(String)  # hardware/software
    preferred_language = Column(String, default="English")

    user = relationship("User", back_populates="preferences")

class ChatHistory(Base):
    __tablename__ = "chat_history"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    message_role = Column(String)  # user/assistant
    message_content = Column(Text)
    timestamp = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="chat_history")

    __table_args__ = (Index("ix_chat_history_user_timestamp", "user_id", "timestamp"),)

class BookChunk(Base):
    __tablename__ = "book_chunks"

    id = Column(Integer, primary_key=True)
    source = Column(String, nullable=False)
    chunk_index = Column(Integer, nullable=False)
    text = Column(Text, nullable=False)
    embedding = Column(Vector(EMBEDDING_DIMENSION), nullable=False)
