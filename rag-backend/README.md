# RAG Chatbot Backend

This is the FastAPI backend for the Physical AI & Robotics Course. It handles vector search and relational data in Neon Postgres, rate limiting with Upstash Redis, and LLM generation with Groq.

## Tech Stack

- **FastAPI**: High-performance Python framework.
- **Neon Postgres + pgvector**: Serverless relational and vector database for book chunks, users, and chat history.
- **Upstash Redis**: Shared rate limits for chat requests (10 requests per minute per user or IP).
- **Groq (GPT-OSS 120B)**: Inference for the AI assistant.
- **SQLAlchemy**: ORM for database management.
- **Sentence Transformers**: Local embedding generation (`all-MiniLM-L6-v2`).

---

## ⚙️ Configuration

1. Copy `.env.example` to `.env` in this directory and add your credentials. Never commit `.env` or put secret values in chat.
2. Fill in the following:
   - `GROQ_API_KEY`: Get from [Groq Console](https://console.groq.com/).
   - `GROQ_MODEL`: Required model ID; `.env.example` uses `openai/gpt-oss-120b`.
   - `NEON_DATABASE_URL`: Get from [Neon.tech](https://neon.tech/).
   - `UPSTASH_REDIS_REST_URL` & `UPSTASH_REDIS_REST_TOKEN`: Get from [Upstash](https://upstash.com/).
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
Create the schema and pgvector extension, then recursively ingest all `.mdx` files under `../docs` (including the introduction and every module) into Neon.
```bash
python init_db.py
python ingest_book.py
```

RAG components live in `services/rag/`: `ingestion.py` discovers and cleans MDX documents, `retrieval.py` searches pgvector and returns source scores, and `prompting.py` keeps answers grounded and concise. To diagnose an empty or stale book index, rerun ingestion and check the printed chunk total. `POST /api/chat` also returns the retrieved `sources` and similarity scores for debugging.

### 4. Start the Server
```bash
python main.py
```
The API will be available at `http://localhost:8000`.

### 5. Running Tests
Run the automated test suite with pytest:
```bash
python -m pytest -v
```

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
