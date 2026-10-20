from pathlib import Path
from types import SimpleNamespace

from services.rag.ingestion import clean_mdx, discover_documents, split_documents
from services.rag.prompting import build_system_prompt
from services.rag.retrieval import RetrievedChunk, VectorSearchService


def test_ingestion_discovers_intro_and_nested_mdx(tmp_path):
    docs = tmp_path / "docs"
    (docs / "modules").mkdir(parents=True)
    (docs / "intro.mdx").write_text("---\ntitle: Intro\n---\nimport Widget from './x';\n# Four modules\n<Widget />\nThe book has four modules.", encoding="utf-8")
    (docs / "modules" / "one.mdx").write_text("# ROS 2\n\nNodes communicate using topics.", encoding="utf-8")

    paths = discover_documents(docs)
    chunks = split_documents(docs, chunk_size=200, chunk_overlap=10)

    assert [p.relative_to(docs).as_posix() for p in paths] == ["intro.mdx", "modules/one.mdx"]
    assert {source for source, _, _ in chunks} == {"intro.mdx", "modules/one.mdx"}
    assert "four modules" in next(text.lower() for source, _, text in chunks if source == "intro.mdx")
    assert "import Widget" not in clean_mdx((docs / "intro.mdx").read_text())


def test_ingestion_rejects_empty_corpus(tmp_path):
    try:
        split_documents(tmp_path)
    except ValueError as exc:
        assert "No non-empty .mdx" in str(exc)
    else:
        raise AssertionError("empty corpus should fail clearly")


def test_retrieval_returns_sources_and_similarity(monkeypatch):
    class FakeDistance:
        def label(self, _):
            return self

    class FakeEmbedding:
        def cosine_distance(self, _):
            return FakeDistance()

    class FakeChunk:
        embedding = FakeEmbedding()

    class FakeQuery:
        def order_by(self, _):
            return self

        def limit(self, _):
            return self

        def all(self):
            return [(SimpleNamespace(text="ROS nodes use topics.", source="modules/ros.mdx"), 0.12)]

    class FakeDB:
        def query(self, *_):
            return FakeQuery()

    import services.rag.retrieval as retrieval
    monkeypatch.setattr(retrieval, "BookChunk", FakeChunk)
    service = VectorSearchService(encoder=SimpleNamespace(encode=lambda _: SimpleNamespace(tolist=lambda: [0.1])))

    chunks = service.search(FakeDB(), "What are ROS topics?")

    assert chunks == [RetrievedChunk("ROS nodes use topics.", "modules/ros.mdx", 0.88)]
    assert "[modules/ros.mdx]" in service.format_context(chunks)


def test_prompt_forbids_unsupported_claims_when_context_missing():
    prompt = build_system_prompt("")
    assert "No book excerpts were retrieved" in prompt
    assert "Do not guess" in prompt
    assert "Latin letters" in prompt


def test_prompt_requires_citations_for_retrieved_context():
    prompt = build_system_prompt("[intro.mdx]\nThe book has four modules.")
    assert "Cite each factual book claim" in prompt
    assert "[intro.mdx]" in prompt


def test_prompt_preserves_module_vs_chapter_and_roman_urdu_script():
    prompt = build_system_prompt("[intro.mdx]\nThis textbook is divided into four core modules.")
    assert 'a "module" is not automatically a "chapter"' in prompt
    assert "plain ASCII square brackets" in prompt
    assert "Latin letters only" in prompt
    assert "never use Devanagari" in prompt
