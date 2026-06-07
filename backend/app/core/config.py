from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "Plant Disease Detection API"
    environment: str = "development"
    frontend_origin: str = "http://localhost:5173"
    google_client_id: str = ""
    rate_limit: str = "20/minute"

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")


settings = Settings()
