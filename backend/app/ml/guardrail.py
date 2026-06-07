from dataclasses import dataclass
from io import BytesIO

import numpy as np
from PIL import Image, ImageStat


@dataclass
class GuardrailResult:
    is_leaf: bool
    confidence: float


class LeafGuardrail:
    def validate(self, image_bytes: bytes) -> GuardrailResult:
        try:
            image = Image.open(BytesIO(image_bytes)).convert("RGB").resize((224, 224))
        except Exception:
            return GuardrailResult(is_leaf=False, confidence=0.0)

        pixels = np.asarray(image) / 255.0
        green_pixels = (pixels[:, :, 1] > pixels[:, :, 0]) & (pixels[:, :, 1] > pixels[:, :, 2])
        green_score = float(np.mean(green_pixels))
        brightness = ImageStat.Stat(image.convert("L")).mean[0] / 255.0
        confidence = min(1.0, (green_score * 0.8) + (brightness * 0.2))

        return GuardrailResult(is_leaf=confidence >= 0.18, confidence=confidence)
