from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_chat_endpoint():
    response = client.post("/chat", json={"message": "Hello, how can I ensure safety in the plant?"})
    assert response.status_code == 200
    assert "response" in response.json()  # Ensure the response contains a 'response' key
    assert isinstance(response.json()["response"], str)  # Ensure the response is a string

def test_chat_endpoint_invalid_input():
    response = client.post("/chat", json={"message": ""})
    assert response.status_code == 400  # Bad request for empty message
    assert "detail" in response.json()  # Ensure the response contains a 'detail' key
    assert response.json()["detail"] == "Message cannot be empty."  # Check the error message