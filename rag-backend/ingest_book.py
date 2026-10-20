import glob
import os

from dotenv import load_dotenv
from langchain_text_splitters import RecursiveCharacterTextSplitter
from sentence_transformers import SentenceTransformer
from tqdm import tqdm

from database.neon_db import Base, SessionLocal, engine
from models.schema import BookChunk

load_dotenv()

DOCS_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "docs", "modules", "*.mdx")


def ingest_docs():
    print("Loading embedding model...")
    model = SentenceTransformer("all-MiniLM-L6-v2")
    Base.metadata.create_all(bind=engine)

    print(f"Reading documents from {DOCS_PATH}...")
    files = glob.glob(DOCS_PATH)
    if not files:
        print("No MDX files found!")
        return

    splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=100,
        separators=["\n\n", "\n", " ", ""],
    )
    chunks = []
    for file_path in files:
        with open(file_path, "r", encoding="utf-8") as file:
            for index, chunk in enumerate(splitter.split_text(file.read())):
                chunks.append((os.path.basename(file_path), index, chunk))

    print(f"Generated {len(chunks)} chunks. Generating embeddings and storing in Neon...")
    db = SessionLocal()
    try:
        db.query(BookChunk).delete()
        for source, index, content in tqdm(chunks):
            db.add(BookChunk(
                source=source,
                chunk_index=index,
                text=content,
                embedding=model.encode(content).tolist(),
            ))
        db.commit()
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()

    print(f"Successfully ingested {len(chunks)} chunks into Neon Postgres.")


if __name__ == "__main__":
    ingest_docs()
