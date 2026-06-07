from io import BytesIO

from PIL import Image

from app.ml.guardrail import LeafGuardrail


def test_guardrail_rejects_invalid_bytes():
    result = LeafGuardrail().validate(b"not-an-image")

    assert result.is_leaf is False
    assert result.confidence == 0.0


def test_guardrail_accepts_greenish_image():
    image = Image.new("RGB", (224, 224), color=(30, 160, 60))
    buffer = BytesIO()
    image.save(buffer, format="PNG")

    result = LeafGuardrail().validate(buffer.getvalue())

    assert result.is_leaf is True
