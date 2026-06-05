# Contributing to Physical AI & Humanoid Robotics

Thank you for your interest in contributing to this project! We welcome contributions of all kinds, including content corrections, additions, code improvements, security patches, and issue reports.

---

## Code of Conduct

By participating in this project, you agree to abide by our Code of Conduct:
- Be respectful, welcoming, and collaborative.
- Keep discussions focused, constructive, and based on technical facts.
- Respect the copyright and licensing of open-source resources.

---

## How to Contribute

### 1. Report Bugs or Request Features
- Check if the issue already exists in the GitHub Issues tracker.
- If not, open a new issue with a clear description, reproduction steps, and screenshots if applicable.

### 2. Submit a Pull Request (PR)
- Fork the repository and create your branch from `main`.
- Implement your changes, ensuring you follow the guidelines below.
- Verify that tests pass and the frontend builds successfully.
- Submit a PR with a clear summary of your changes.

---

## Development Workflow

This project is divided into two main parts:
1. **Docusaurus Frontend** (Root directory): Static site generator for rendering course contents.
2. **RAG Backend** (`/rag-backend`): FastAPI server handling vector searches, authentication, and chat history.

### Spec-Driven Development (SDD) for Content
We follow a strict Spec-Driven Development approach inspired by **Spec-Kit Plus** for all content updates:
- **Principles & Memory**: Check `.specify/memory/constitution.md` for core project principles.
- **Specification First**: Do not write book chapters directly. Always create a specification file at `.specify/specs/[module-name]/spec.md` first.
- **Templates**: Use `.specify/templates/spec.md` as the template for all new specifications.
- **Docusaurus Mapping**: The `.specify/specs` folder is mounted as a Docusaurus documentation instance at the `/specs` route.

---

## Setup & Testing Instructions

### Frontend Setup
```bash
# Install dependencies
npm install

# Start local server (available at http://localhost:3000)
npm run start

# Build static production files to check for errors
npm run build
```

### Backend Setup
Detailed setup instructions are located in the [Backend README](./rag-backend/README.md).

```bash
cd rag-backend
# Set up virtual environment and install packages
python -m venv venv
source venv/Scripts/activate  # On macOS/Linux: source venv/bin/activate
pip install -r requirements.txt

# Run database initializations
python init_db.py
```

### Running Tests
Before submitting any pull request that affects the backend, make sure all tests pass:
```bash
cd rag-backend
python -m pytest -v
```

---

## Coding Standards

### Backend (Python)
- Use standard PEP 8 coding style.
- Validate incoming requests with Pydantic schemas.
- Ensure all new API endpoints are fully covered by tests in `rag-backend/tests/`.
- **Security**: Never hardcode API keys or database secrets. Use environment variables via `.env`.

### Frontend (React/TypeScript)
- Use functional React components with hooks.
- Avoid inline styling where possible; use CSS Modules.
- Keep components modular and reusable.
- Verify that Docusaurus links and sidebar configurations do not break.
