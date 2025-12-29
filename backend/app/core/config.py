from pydantic import BaseSettings

class Settings(BaseSettings):
    app_name: str = "Manufacturing Plant SOP & Safety Explainer Bot"
    admin_email: str
    database_url: str
    secret_key: str
    algorithm: str = "HS256"
    access_token_expires_minutes: int = 30

    class Config:
        env_file = ".env"

settings = Settings()