from fastapi import Security, HTTPException
from fastapi.security import APIKeyHeader
from typing import Optional

API_KEY = "your_api_key"  # Replace with your actual API key
API_KEY_NAME = "X-API-Key"
api_key_header = APIKeyHeader(name=API_KEY_NAME, auto_error=False)

def get_api_key(api_key: str = Security(api_key_header)) -> str:
    if api_key is None or api_key != API_KEY:
        raise HTTPException(
            status_code=403,
            detail="Could not validate API key"
        )
    return api_key