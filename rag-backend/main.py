import os
from fastapi import FastAPI, Depends, Header, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from openai import AsyncOpenAI
from dotenv import load_dotenv
from pydantic import BaseModel
from sqlalchemy.orm import Session

from database.neon_db import get_db
from models.schema import ChatHistory, User
from services.qdrant_service import qdrant_service
from services.auth_service import decode_access_token
from routers import auth, chat, user

load_dotenv()

from fastapi.responses import JSONResponse
import traceback

app = FastAPI(title="RAG Chatbot Backend")

@app.on_event("startup")
async def startup_event():
    secret_key = os.getenv("JWT_SECRET_KEY")
    if secret_key in ("your-secret-key-change-this-in-production", "your_jwt_secret_key_here", None):
        print("\n" + "="*80)
        print("SECURITY WARNING: JWT_SECRET_KEY is set to a default or weak secret.")
        print("Please change this in your production environment to protect user sessions!")
        print("="*80 + "\n")

# Global Error Handler to catch 500s and return JSON
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    error_msg = traceback.format_exc()
    print(f"CRITICAL ERROR: {error_msg}") # This will show in HF Logs
    return JSONResponse(
        status_code=500,
        content={"error": "Internal Server Error", "detail": str(exc)},
    )

# Proxy-aware Middleware for Hugging Face
@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    try:
        response = await call_next(request)
        return response
    except Exception as exc:
        return await global_exception_handler(request, exc)

# CORS middleware - Secure Whitelist
frontend_url = os.getenv("FRONTEND_URL", "http://localhost:3000")
origins = [
    "http://localhost:3000", # Local development
    "http://localhost:8000",
    frontend_url,            # Production Vercel URL
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Groq Client using OpenAI SDK
client = AsyncOpenAI(
    base_url="https://api.groq.com/openai/v1",
    api_key=os.environ.get("GROQ_API_KEY")
)

# Include Routers
app.include_router(auth.router)
app.include_router(chat.router)
app.include_router(user.router)

class ChatRequest(BaseModel):
    message: str

@app.get("/")
async def root():
    return {"message": "RAG Chatbot API is running"}

@app.post("/api/chat")
async def chat(request: ChatRequest, db: Session = Depends(get_db), authorization: str = Header(None)):
    try:
        # 1. Optional Authentication & Personalization
        current_user = None
        personalization_context = ""
        
        if authorization and authorization.startswith("Bearer "):
            token = authorization.split(" ")[1]
            payload = decode_access_token(token)
            if payload:
                email = payload.get("sub")
                current_user = db.query(User).filter(User.email == email).first()
                if current_user and current_user.preferences:
                    personalization_context = f"\nUSER PROFILE: The user has indicated their background is: {current_user.preferences.background}. Please adjust your technical depth accordingly."

        # 2. Retrieve relevant context from Qdrant
        context = qdrant_service.search(request.message)

        # 3. Build the augmented prompt
        system_prompt = f"""
You are the AI assistant for the "Physical AI & Humanoid Robotics" book.
Use the following context from the book to answer the user's question.
If the answer is not in the context, be honest and say you don't know based on the book, but offer a general robotics explanation.
{personalization_context}

CONTEXT:
{context}
"""
        
        response = await client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": request.message}
            ]
        )
        
        assistant_response = response.choices[0].message.content

        # 4. Save to history if logged in
        if current_user:
            user_msg = ChatHistory(user_id=current_user.id, message_role="user", message_content=request.message)
            assistant_msg = ChatHistory(user_id=current_user.id, message_role="assistant", message_content=assistant_response)
            db.add(user_msg)
            db.add(assistant_msg)
            db.commit()

        return {
            "response": assistant_response,
            "context_used": context[:200] + "..." 
        }
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(
            status_code=500,
            detail="An error occurred while processing your chat request. Please try again later."
        )

@app.post("/api/chat-test")
async def chat_test(request: ChatRequest):
    try:
        response = await client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": "You are the AI assistant for a robotics book. Be helpful and concise."},
                {"role": "user", "content": request.message}
            ]
        )
        return {"response": response.choices[0].message.content}
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(
            status_code=500,
            detail="An error occurred while processing your test request. Please try again later."
        )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
