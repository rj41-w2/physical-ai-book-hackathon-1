# RAG Chatbot Backend

This is the FastAPI backend for the Physical AI & Robotics Course. It handles Vector search (Qdrant), relational data (Neon Postgres), and LLM generation (Groq).

## Tech Stack

- **FastAPI**: High-performance Python framework.
- **Qdrant**: Vector database for RAG.
- **Neon Postgres**: Serverless relational database for users and chat history.
- **Groq (Llama 3.3)**: Lightning-fast inference for the AI assistant.
- **SQLAlchemy**: ORM for database management.
- **Sentence Transformers**: Local embedding generation (`all-MiniLM-L6-v2`).

---

## ⚙️ Configuration

1. Create a `.env` file in this directory (use `.env.example` as a template).
2. Fill in the following:
   - `GROQ_API_KEY`: Get from [Groq Console](https://console.groq.com/).
   - `QDRANT_URL` & `QDRANT_API_KEY`: Get from [Qdrant Cloud](https://qdrant.tech/).
   - `NEON_DATABASE_URL`: Get from [Neon.tech](https://neon.tech/).
   - `JWT_SECRET_KEY`: Any long random string.
   - `FRONTEND_URL`: URL of your frontend (default: `http://localhost:3000`).

---

## Setup Instructions

### 1. Install Dependencies
It is recommended to use a virtual environment.
```bash
python -m venv venv
source venv/bin/activate  # On Windows use `venv\Scripts\activate`
pip install -r requirements.txt
```

### 2. Initialize Database
Create the necessary tables in Neon Postgres.
```bash
python init_db.py
```

### 3. Ingest Book Data
Convert your `.mdx` files into vectors and upload them to Qdrant.
```bash
python ingest_book.py
```

### 4. Start the Server
```bash
python main.py
```
The API will be available at `http://localhost:8000`.

---

## API Endpoints

- `POST /api/auth/signup`: Create a new user account.
- `POST /api/auth/signin`: Login and receive a JWT.
- `POST /api/chat`: Send a message and get a RAG-augmented response.
- `GET /api/chat/history`: Retrieve chat history (Authenticated).
- `DELETE /api/chat/history`: Clear chat history (Authenticated).
- `POST /api/user/preferences`: Update user background profile (Authenticated).

---

## 🔒 Security

- Passwords are hashed using **bcrypt**.
- Authenticated routes are protected using **JWT Bearer tokens**.
- CORS is restricted to the specified `FRONTEND_URL`.
