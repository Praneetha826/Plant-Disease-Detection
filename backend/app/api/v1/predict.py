from fastapi import APIRouter, File, HTTPException, Request, UploadFile

from app.core.rate_limit import limiter
from app.ml.guardrail import LeafGuardrail
from app.ml.predictor import DiseasePredictor
from app.utils.circuit_breaker import CircuitBreaker

router = APIRouter()
guardrail = LeafGuardrail()
predictor = DiseasePredictor()
prediction_breaker = CircuitBreaker(failure_threshold=3, recovery_seconds=30)


@router.post("/predict")
@limiter.limit("10/minute")
async def predict_disease(request: Request, image: UploadFile = File(...)):
    if image.content_type not in {"image/jpeg", "image/png", "image/webp"}:
        raise HTTPException(status_code=415, detail="Only JPEG, PNG, and WEBP images are allowed")

    image_bytes = await image.read()
    guardrail_result = guardrail.validate(image_bytes)
    if not guardrail_result.is_leaf:
        raise HTTPException(status_code=400, detail="Please upload a clear plant or leaf photo")

    result = prediction_breaker.call(predictor.predict, image_bytes)
    return {
        "label": result.label,
        "confidence": result.confidence,
        "guardrail_confidence": guardrail_result.confidence,
    }
