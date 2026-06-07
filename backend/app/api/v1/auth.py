from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.core.security import verify_google_token

router = APIRouter()


class OAuthTokenRequest(BaseModel):
    token: str


@router.post("/google")
async def google_login(payload: OAuthTokenRequest):
    user = await verify_google_token(payload.token)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid or expired OAuth token")
    return user
