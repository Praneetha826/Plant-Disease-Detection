from google.auth.transport import requests
from google.oauth2 import id_token

from app.core.config import settings


async def verify_google_token(token: str):
    try:
        payload = id_token.verify_oauth2_token(
            token,
            requests.Request(),
            settings.google_client_id or None,
        )
    except ValueError:
        return None

    return {
        "email": payload.get("email"),
        "name": payload.get("name"),
        "picture": payload.get("picture"),
        "provider": "google",
    }
