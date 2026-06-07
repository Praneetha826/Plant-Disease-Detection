from dataclasses import dataclass


@dataclass
class PredictionResult:
    label: str
    confidence: float


class DiseasePredictor:
    def __init__(self):
        self.labels = [
            "Healthy",
            "Early Blight",
            "Late Blight",
            "Leaf Spot",
            "Powdery Mildew",
        ]

    def predict(self, image_bytes: bytes) -> PredictionResult:
        # Replace this placeholder with a trained PlantVillage model later.
        return PredictionResult(label="Healthy", confidence=0.72)
