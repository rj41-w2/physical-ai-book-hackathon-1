import pytest
from jose import jwt
from services.auth_service import SECRET_KEY, ALGORITHM

def test_signup_short_password(client):
    # Passwords under 8 characters should fail with 400 Bad Request
    response = client.post(
        "/api/auth/signup",
        json={
            "email": "test@example.com",
            "password": "short",
            "full_name": "Test User",
            "software_background": "beginner",
            "hardware_background": "none"
        }
    )
    assert response.status_code == 400
    assert "Password must be at least 8 characters long" in response.json()["detail"]

def test_signup_success(client):
    # Standard signup should return 200/201 and access token
    response = client.post(
        "/api/auth/signup",
        json={
            "email": "test@example.com",
            "password": "strongpassword123",
            "full_name": "Test User",
            "software_background": "beginner",
            "hardware_background": "none"
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"
    assert data["email"] == "test@example.com"
    assert data["full_name"] == "Test User"
    assert data["software_background"] == "beginner"
    assert data["hardware_background"] == "none"

    # Decode token to verify
    payload = jwt.decode(data["access_token"], SECRET_KEY, algorithms=[ALGORITHM])
    assert payload.get("sub") == "test@example.com"

def test_signup_duplicate_email(client):
    # Setup first user
    client.post(
        "/api/auth/signup",
        json={
            "email": "test@example.com",
            "password": "strongpassword123",
            "full_name": "Test User",
            "software_background": "beginner",
            "hardware_background": "none"
        }
    )
    # Signup again with same email
    response = client.post(
        "/api/auth/signup",
        json={
            "email": "test@example.com",
            "password": "strongpassword123",
            "full_name": "Test User 2",
            "software_background": "intermediate",
            "hardware_background": "hobbyist"
        }
    )
    assert response.status_code == 400
    assert "Email already registered" in response.json()["detail"]

def test_signin_success(client):
    # Setup user
    client.post(
        "/api/auth/signup",
        json={
            "email": "test@example.com",
            "password": "strongpassword123",
            "full_name": "Test User",
            "software_background": "advanced",
            "hardware_background": "professional"
        }
    )
    # Sign in
    response = client.post(
        "/api/auth/signin",
        json={
            "email": "test@example.com",
            "password": "strongpassword123"
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["email"] == "test@example.com"
    assert data["full_name"] == "Test User"
    assert data["software_background"] == "advanced"
    assert data["hardware_background"] == "professional"

def test_signin_invalid_credentials(client):
    # Setup user
    client.post(
        "/api/auth/signup",
        json={
            "email": "test@example.com",
            "password": "strongpassword123",
            "full_name": "Test User",
            "software_background": "beginner",
            "hardware_background": "none"
        }
    )
    # Bad password
    response = client.post(
        "/api/auth/signin",
        json={
            "email": "test@example.com",
            "password": "wrongpassword"
        }
    )
    assert response.status_code == 401
    
    # Non-existent user
    response = client.post(
        "/api/auth/signin",
        json={
            "email": "nobody@example.com",
            "password": "strongpassword123"
        }
    )
    assert response.status_code == 401
