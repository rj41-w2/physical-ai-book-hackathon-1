from types import SimpleNamespace

import main


def test_chat_does_not_invent_book_facts_when_retrieval_is_empty(client, monkeypatch):
    captured = {}

    async def allow_request(_identity):
        return None

    async def complete(**kwargs):
        captured.update(kwargs)
        return SimpleNamespace(choices=[SimpleNamespace(message=SimpleNamespace(content="Book material mein iska jawab maujood nahi hai."))])

    monkeypatch.setattr(main, "enforce_rate_limit", allow_request)
    monkeypatch.setattr(main.vector_search_service, "search", lambda *_args, **_kwargs: [])
    monkeypatch.setattr(main.vector_search_service, "format_context", lambda chunks: "")
    monkeypatch.setattr(main.client.chat.completions, "create", complete)

    response = client.post("/api/chat", json={"message": "Is book mein kitne chapters hain?"})

    assert response.status_code == 200
    assert response.json()["sources"] == []
    assert response.json()["context_used"] == ""
    assert "No book excerpts were retrieved" in captured["messages"][0]["content"]
    assert "Do not guess" in captured["messages"][0]["content"]
