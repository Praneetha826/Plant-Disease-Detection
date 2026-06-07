import { useState } from "react";
import { Upload } from "lucide-react";
import { api } from "../../services/api.js";

export function PredictorForm() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    if (!file) return;

    setLoading(true);
    setError("");
    setResult(null);

    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await api.post("/predict", formData);
      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.detail ?? "Prediction failed. Try another image.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="panel" onSubmit={handleSubmit}>
      <label className="dropzone">
        <Upload size={34} aria-hidden="true" />
        <strong>Choose a plant or leaf image</strong>
        <input
          type="file"
          accept="image/png,image/jpeg,image/webp"
          onChange={(event) => setFile(event.target.files?.[0] ?? null)}
        />
      </label>

      <button className="primary-button" type="submit" disabled={!file || loading}>
        {loading ? "Checking..." : "Predict Disease"}
      </button>

      {result && (
        <div className="result">
          <strong>{result.label}</strong>
          <p>Confidence: {(result.confidence * 100).toFixed(1)}%</p>
        </div>
      )}

      {error && <p className="error">{error}</p>}
    </form>
  );
}
