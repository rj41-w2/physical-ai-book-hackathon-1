# Physical AI & Humanoid Robotics Course Website

This is a production-grade documentation platform for a Physical AI course, featuring a built-in RAG (Retrieval-Augmented Generation) Chatbot and personalized learning experiences.

## Features

- **Docusaurus Frontend**: Clean, fast, and modern documentation UI.
- **RAG Chatbot**: An AI assistant that answers questions based specifically on the book's content using Qdrant (Vector DB) and Groq (LLM).
- **User Authentication**: Secure Signup/Signin with Neon Postgres.
- **Personalization**: AI responses tailored to your software and hardware background.
- **Chat History**: Persistent conversation history for logged-in users.
- **Markdown & Syntax Highlighting**: Beautiful rendering of technical explanations and code blocks.

---

## Project Structure

- `/docs`: MDX files for the book chapters.
- `/src`: Docusaurus frontend components and custom logic.
- `/rag-backend`: FastAPI backend, Vector search, and Relational database logic.

---

## Quick Start

### 1. Frontend Setup
```bash
# Install dependencies
npm install

# Start development server
npm start
```

### 2. Backend Setup
Detailed instructions can be found in the [Backend README](./rag-backend/README.md).

1. Set up your `.env` file in `/rag-backend`.
2. Install Python dependencies: `pip install -r rag-backend/requirements.txt`
3. Initialize the database: `python rag-backend/init_db.py`
4. Ingest book data: `python rag-backend/ingest_book.py`
5. Start the API: `python rag-backend/main.py`

---

## Deployment

- **Frontend**: Can be deployed to Vercel, Netlify, or GitHub Pages.
- **Backend**: Can be deployed to Render, Railway, or any VPS.
- **Database**: Use [Neon.tech](https://neon.tech) for Postgres and [Qdrant Cloud](https://qdrant.tech) for Vector search.

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📜 License

This project is open-source. See the LICENSE file for details.
