import os
from qdrant_client import QdrantClient
from sentence_transformers import SentenceTransformer
from dotenv import load_dotenv

load_dotenv()

class QdrantService:
    def __init__(self):
        self.client = QdrantClient(
            url=os.getenv("QDRANT_URL"),
            api_key=os.getenv("QDRANT_API_KEY")
        )
        self.collection_name = "physical_ai_book"
        self.model = SentenceTransformer('all-MiniLM-L6-v2')

    def search(self, query_text: str, limit: int = 3):
        # 1. Embed the query
        query_vector = self.model.encode(query_text).tolist()

        # 2. Query Qdrant
        results = self.client.query_points(
            collection_name=self.collection_name,
            query=query_vector,
            limit=limit
        ).points

        # 3. Format results
        context_chunks = [res.payload["text"] for res in results]
        return "\n---\n".join(context_chunks)

# Singleton instance
qdrant_service = QdrantService()
