from pathlib import Path

from tqdm import tqdm

from database.neon_db import Base, SessionLocal, engine
from models.schema import BookChunk
from services.rag.config import EMBEDDING_MODEL
from services.rag.ingestion import split_documents

BACKEND_DIR = Path(__file__).resolve().parent
DOCS_DIR = BACKEND_DIR.parent / "docs"


def ingest_docs(docs_dir: Path = DOCS_DIR, encoder=None, db_factory=SessionLocal):
    if encoder is None:
        from sentence_transformers import SentenceTransformer

        encoder = SentenceTransformer(EMBEDDING_MODEL)

    chunks = split_documents(Path(docs_dir))
    Base.metadata.create_all(bind=engine)
    db = db_factory()
    try:
        db.query(BookChunk).delete(synchronize_session=False)
        for source, index, content in tqdm(chunks, desc="Embedding book passages"):
            db.add(BookChunk(
                source=source,
                chunk_index=index,
                text=content,
                embedding=encoder.encode(content).tolist(),
            ))
        db.commit()
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()
    return len(chunks)


if __name__ == "__main__":
    print(f"Ingested {ingest_docs()} chunks from {DOCS_DIR}")
