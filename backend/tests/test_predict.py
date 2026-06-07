from app.ml.predictor import DiseasePredictor


def test_predictor_returns_label_and_confidence():
    result = DiseasePredictor().predict(b"placeholder")

    assert result.label
    assert 0 <= result.confidence <= 1
