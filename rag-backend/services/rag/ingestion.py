import re
from pathlib import Path

from langchain_text_splitters import RecursiveCharacterTextSplitter

from services.rag.config import CHUNK_OVERLAP, CHUNK_SIZE


IMPORT_LINE = re.compile(r"^\s*import\s+.+?;?\s*$", re.MULTILINE)
JSX_TAG = re.compile(r"</?[A-Za-z][^>]*>")
FRONTMATTER = re.compile(r"\A---\s*\n.*?\n---\s*\n", re.DOTALL)


def clean_mdx(content: str) -> str:
    content = FRONTMATTER.sub("", content)
    content = IMPORT_LINE.sub("", content)
    return JSX_TAG.sub("", content).strip()


def discover_documents(docs_dir: Path) -> list[Path]:
    return sorted(path for path in docs_dir.rglob("*.mdx") if path.is_file())


def split_documents(docs_dir: Path, chunk_size: int = CHUNK_SIZE, chunk_overlap: int = CHUNK_OVERLAP):
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=chunk_size,
        chunk_overlap=chunk_overlap,
        separators=["\n\n", "\n", ". ", " ", ""],
    )
    chunks = []
    for path in discover_documents(docs_dir):
        text = clean_mdx(path.read_text(encoding="utf-8"))
        source = path.relative_to(docs_dir).as_posix()
        chunks.extend((source, index, chunk) for index, chunk in enumerate(splitter.split_text(text)) if chunk.strip())
    if not chunks:
        raise ValueError(f"No non-empty .mdx documents found under {docs_dir}")
    return chunks
