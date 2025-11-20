import pytest
from fastapi.testclient import TestClient
from src.app import app

client = TestClient(app)

def test_get_activities():
    response = client.get("/activities")
    assert response.status_code == 200
    assert isinstance(response.json(), dict)


def test_signup_with_valid_email():
    """Test signup with a valid @mergington.edu email"""
    response = client.post(
        "/activities/Chess Club/signup",
        params={"email": "test@mergington.edu"}
    )
    assert response.status_code == 200
    assert "Signed up" in response.json()["message"]


def test_signup_with_invalid_email_domain():
    """Test signup with an email from wrong domain"""
    response = client.post(
        "/activities/Chess Club/signup",
        params={"email": "test@gmail.com"}
    )
    assert response.status_code == 400
    assert response.json()["detail"] == "Invalid email address"


def test_signup_with_invalid_email_format():
    """Test signup with malformed email"""
    response = client.post(
        "/activities/Chess Club/signup",
        params={"email": "not-an-email"}
    )
    assert response.status_code == 400
    assert response.json()["detail"] == "Invalid email address"


def test_signup_with_empty_email():
    """Test signup with empty email"""
    response = client.post(
        "/activities/Chess Club/signup",
        params={"email": ""}
    )
    assert response.status_code == 400
    assert response.json()["detail"] == "Invalid email address"


def test_unregister_with_valid_email():
    """Test unregister with a valid @mergington.edu email"""
    response = client.delete(
        "/activities/Chess Club/unregister",
        params={"email": "michael@mergington.edu"}
    )
    assert response.status_code == 200
    assert "Unregistered" in response.json()["message"]


def test_unregister_with_invalid_email_domain():
    """Test unregister with an email from wrong domain"""
    response = client.delete(
        "/activities/Chess Club/unregister",
        params={"email": "test@gmail.com"}
    )
    assert response.status_code == 400
    assert response.json()["detail"] == "Invalid email address"


def test_unregister_with_invalid_email_format():
    """Test unregister with malformed email"""
    response = client.delete(
        "/activities/Chess Club/unregister",
        params={"email": "not-an-email"}
    )
    assert response.status_code == 400
    assert response.json()["detail"] == "Invalid email address"


def test_unregister_with_empty_email():
    """Test unregister with empty email"""
    response = client.delete(
        "/activities/Chess Club/unregister",
        params={"email": ""}
    )
    assert response.status_code == 400
    assert response.json()["detail"] == "Invalid email address"

