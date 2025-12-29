import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.services.ai_service import AIService

client = TestClient(app)

@pytest.fixture
def ai_service():
    return AIService()

def test_ai_service_response(ai_service):
    query = "What are the safety protocols in the manufacturing plant?"
    response = ai_service.get_response(query)
    assert response is not None
    assert isinstance(response, str)
    assert len(response) > 0

def test_ai_service_integration():
    query = "Explain the SOP for machine operation."
    response = client.post("/chat", json={"query": query})
    assert response.status_code == 200
    assert "SOP" in response.json().get("response", "")