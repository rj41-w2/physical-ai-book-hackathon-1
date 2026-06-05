import pytest
from models.schema import ChatHistory, User

def test_chat_history_unauthenticated(client):
    # History endpoint should fail with 401 for unauthenticated requests
    response = client.get("/api/chat/history")
    assert response.status_code == 401

def test_clear_chat_history_unauthenticated(client):
    # Clear history endpoint should fail with 401 for unauthenticated requests
    response = client.delete("/api/chat/history")
    assert response.status_code == 401

def test_chat_history_and_clear_authenticated(client, db):
    # 1. Sign up and login to get token
    signup_response = client.post(
        "/api/auth/signup",
        json={
            "email": "chatuser@example.com",
            "password": "strongpassword123",
            "full_name": "Chat User",
            "software_background": "beginner",
            "hardware_background": "none"
        }
    )
    token = signup_response.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # 2. Check history (should be empty initially)
    history_response = client.get("/api/chat/history", headers=headers)
    assert history_response.status_code == 200
    assert history_response.json() == []

    # 3. Simulate adding chat messages in database manually (or via API if mocked)
    # We can fetch the user ID from signup to insert into db
    # We'll use the client's db session to write mock messages
    # In our override, the db session is managed by conftest
    db_session = db
    
    user = db_session.query(User).filter(User.email == "chatuser@example.com").first()
    assert user is not None
    
    msg1 = ChatHistory(user_id=user.id, message_role="user", message_content="Hello book!")
    msg2 = ChatHistory(user_id=user.id, message_role="assistant", message_content="Hi! I am your AI assistant.")
    db_session.add(msg1)
    db_session.add(msg2)
    db_session.commit()

    # 4. Check history again (should contain our inserted messages)
    history_response = client.get("/api/chat/history", headers=headers)
    assert history_response.status_code == 200
    messages = history_response.json()
    assert len(messages) == 2
    assert messages[0]["message_role"] == "user"
    assert messages[0]["message_content"] == "Hello book!"
    assert messages[1]["message_role"] == "assistant"
    assert messages[1]["message_content"] == "Hi! I am your AI assistant."

    # 5. Clear history
    clear_response = client.delete("/api/chat/history", headers=headers)
    assert clear_response.status_code == 200
    assert clear_response.json()["message"] == "Chat history cleared successfully"

    # 6. Verify history is empty again
    history_response = client.get("/api/chat/history", headers=headers)
    assert history_response.status_code == 200
    assert history_response.json() == []
