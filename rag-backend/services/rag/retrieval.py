from dataclasses import dataclass
from functools import cached_property

from models.schema import BookChunk
from services.rag.config import EMBEDDING_MODEL


@dataclass(frozen=True)
class RetrievedChunk:
    text: str
    source: str
    similarity: float


class VectorSearchService:
    """Embeds a question and retrieves its nearest book passages from pgvector."""

    def __init__(self, model_name: str = EMBEDDING_MODEL, encoder=None):
        self.model_name = model_name
        self._encoder = encoder

    @cached_property
    def encoder(self):
        if self._encoder is None:
            from sentence_transformers import SentenceTransformer

            self._encoder = SentenceTransformer(self.model_name)
        return self._encoder

    def search(self, db, query_text: str, limit: int = 4) -> list[RetrievedChunk]:
        if not query_text.strip():
            return []
        query_vector = self.encoder.encode(query_text).tolist()
        distance = BookChunk.embedding.cosine_distance(query_vector)
        rows = db.query(BookChunk, distance.label("distance")).order_by(distance).limit(limit).all()
        return [
            RetrievedChunk(text=row.text, source=row.source, similarity=max(0.0, 1.0 - float(score)))
            for row, score in rows
        ]

    @staticmethod
    def format_context(chunks: list[RetrievedChunk]) -> str:
        return "\n\n".join(f"[{chunk.source}]\n{chunk.text}" for chunk in chunks)


vector_search_service = VectorSearchService()
