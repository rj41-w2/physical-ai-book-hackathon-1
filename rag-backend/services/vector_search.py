"""Backward-compatible import for the RAG retrieval service."""

from services.rag.retrieval import RetrievedChunk, VectorSearchService, vector_search_service

__all__ = ["RetrievedChunk", "VectorSearchService", "vector_search_service"]
