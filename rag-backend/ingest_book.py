import os
import glob
from dotenv import load_dotenv
from langchain_text_splitters import RecursiveCharacterTextSplitter
from sentence_transformers import SentenceTransformer
from qdrant_client import QdrantClient
from qdrant_client.http import models
from tqdm import tqdm

# Load environment variables
load_dotenv()

QDRANT_URL = os.getenv("QDRANT_URL")
QDRANT_API_KEY = os.getenv("QDRANT_API_KEY")
COLLECTION_NAME = "physical_ai_book"
DOCS_PATH = os.path.join("..", "docs", "modules", "*.mdx")

def ingest_docs():
    # 1. Initialize Sentence Transformer model
    print("Loading embedding model...")
    model = SentenceTransformer('all-MiniLM-L6-v2')
    vector_size = model.get_sentence_embedding_dimension()

    # 2. Initialize Qdrant Client
    print(f"Connecting to Qdrant at {QDRANT_URL}...")
    client = QdrantClient(url=QDRANT_URL, api_key=QDRANT_API_KEY)

    # 3. Create collection if it doesn't exist
    collections = client.get_collections().collections
    exists = any(c.name == COLLECTION_NAME for c in collections)
    
    if not exists:
        print(f"Creating collection: {COLLECTION_NAME}")
        client.create_collection(
            collection_name=COLLECTION_NAME,
            vectors_config=models.VectorParams(size=vector_size, distance=models.Distance.COSINE),
        )
    else:
        print(f"Collection {COLLECTION_NAME} already exists.")

    # 4. Read and Chunk Documents
    print(f"Reading documents from {DOCS_PATH}...")
    files = glob.glob(DOCS_PATH)
    if not files:
        print("No MDX files found!")
        return

    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=100,
        separators=["\n\n", "\n", " ", ""]
    )

    all_chunks = []
    for file_path in files:
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()
            # Simple metadata extraction or just file name
            file_name = os.path.basename(file_path)
            chunks = text_splitter.split_text(content)
            
            for i, chunk in enumerate(chunks):
                all_chunks.append({
                    "text": chunk,
                    "metadata": {
                        "source": file_name,
                        "chunk_index": i
                    }
                })

    print(f"Generated {len(all_chunks)} chunks. Generating embeddings and upserting...")

    # 5. Generate Embeddings and Upsert
    points = []
    for i, item in enumerate(tqdm(all_chunks)):
        embedding = model.encode(item["text"]).tolist()
        points.append(models.PointStruct(
            id=i,
            vector=embedding,
            payload={
                "text": item["text"],
                "source": item["metadata"]["source"],
                "chunk_index": item["metadata"]["chunk_index"]
            }
        ))

    # Upsert in batches
    batch_size = 100
    for i in range(0, len(points), batch_size):
        batch = points[i : i + batch_size]
        client.upsert(
            collection_name=COLLECTION_NAME,
            points=batch
        )

    print(f"Successfully ingested {len(all_chunks)} chunks into '{COLLECTION_NAME}'.")

if __name__ == "__main__":
    ingest_docs()
