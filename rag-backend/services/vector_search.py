from sentence_transformers import SentenceTransformer
from models.schema import BookChunk


class VectorSearchService:
    def __init__(self):
        self.model = SentenceTransformer("all-MiniLM-L6-v2")

    def search(self, db, query_text: str, limit: int = 3):
        query_vector = self.model.encode(query_text).tolist()
        results = (
            db.query(BookChunk)
            .order_by(BookChunk.embedding.cosine_distance(query_vector))
            .limit(limit)
            .all()
        )
        return "\n---\n".join(chunk.text for chunk in results)


vector_search_service = VectorSearchService()
