from fastapi import HTTPException
import requests

class AIService:
    def __init__(self, api_key: str, api_url: str):
        self.api_key = api_key
        self.api_url = api_url

    def get_ai_response(self, user_input: str) -> str:
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
        payload = {
            "input": user_input
        }
        response = requests.post(self.api_url, headers=headers, json=payload)

        if response.status_code != 200:
            raise HTTPException(status_code=response.status_code, detail="Error communicating with AI service")

        return response.json().get("response", "No response from AI")