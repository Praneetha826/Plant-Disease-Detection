import time
from hashlib import sha256

from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import JSONResponse


class IdempotencyMiddleware(BaseHTTPMiddleware):
    def __init__(self, app, ttl_seconds: int = 300):
        super().__init__(app)
        self.ttl_seconds = ttl_seconds
        self._seen = {}

    async def dispatch(self, request, call_next):
        if request.method.upper() not in {"POST", "PUT", "PATCH"}:
            return await call_next(request)

        key = request.headers.get("X-Idempotency-Key")
        if not key:
            return await call_next(request)

        now = time.time()
        self._seen = {
            item_key: expires_at
            for item_key, expires_at in self._seen.items()
            if expires_at > now
        }

        fingerprint = sha256(f"{request.method}:{request.url.path}:{key}".encode()).hexdigest()
        if fingerprint in self._seen:
            return JSONResponse(
                status_code=409,
                content={"detail": "Duplicate request blocked by idempotency key"},
            )

        self._seen[fingerprint] = now + self.ttl_seconds
        return await call_next(request)
