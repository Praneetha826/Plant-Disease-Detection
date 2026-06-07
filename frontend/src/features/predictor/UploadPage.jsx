import { useState } from "react";
import { AlertTriangle, CheckCircle, LoaderCircle } from "lucide-react";
import { Section } from "../../components/common/Section.jsx";
import { predictDisease } from "../../services/api.js";

function normalizePrediction(data) {
  return {
    label: data.label ?? data.diseaseLabel ?? "Unknown",
    confidence: data.score ?? data.confidence ?? 0,
    diseaseDetails: data.diseaseDetails ?? {},
    warning: data.warning ?? [],
    guardrailConfidence: data.guardrail_confidence,
  };
}

function saveLocalHistory(result) {
  const history = JSON.parse(localStorage.getItem("plantpulse:history") ?? "[]");
  localStorage.setItem(
    "plantpulse:history",
    JSON.stringify([
      {
        diseaseLabel: result.label,
        confidence: result.confidence,
        timestamp: new Date().toISOString(),
      },
      ...history,
    ])
  );
}

export function UploadPage() {
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [warning, setWarning] = useState([]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setWarning([]);
    setResult(null);

    if (!file) {
      setError("Please upload an image before diagnosing.");
      return;
    }

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setError("Please upload a valid image in JPG, PNG, or WEBP format.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("File size exceeds 5MB. Please upload a smaller file.");
      return;
    }

    setLoading(true);
    try {
      const data = await predictDisease(file);
      const normalized = normalizePrediction(data);
      setResult(normalized);
      setWarning(normalized.warning);
      saveLocalHistory(normalized);
    } catch (err) {
      setError(err.response?.data?.detail ?? "Something went wrong with the diagnosis.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Section id="diagnostic">
        <h2>Upload & Diagnose</h2>
        <p>
          Use the form below to upload an image of your plant for diagnosis. Make sure the
          image is clear, well-lit, and focused on the affected areas of the plant.
        </p>
        <form className="diagnose-form" onSubmit={handleSubmit}>
          <input
            type="file"
            accept="image/*"
            onChange={(event) => setFile(event.target.files?.[0] ?? null)}
          />
          <button type="submit" className="info-btn" disabled={loading}>
            {loading ? "Diagnosing..." : "Diagnose"}
          </button>
        </form>

        {error && <p className="error-message"><AlertTriangle size={18} />{error}</p>}

        <h5>DISCLAIMER</h5>
        <ul className="disclaimer">
          <li>Upload a clear image of the plant leaf for accurate results.</li>
          <li>The model may take time to process; please wait and avoid clicking multiple times.</li>
          <li>Results are AI-based and may not always be accurate. Use at your own risk.</li>
        </ul>
      </Section>

      <Section id="result">
        <h2>Diagnosis Results</h2>
        {!loading && !result && <p>Upload an image and click Diagnose to see the results here.</p>}
        {loading && (
          <div className="loading-box">
            <LoaderCircle className="spin" size={42} />
            <p>Processing your image... Please wait.</p>
          </div>
        )}
        {result && (
          <div className="diagnosis-result">
            <h3><CheckCircle size={22} /> Diagnosis Result</h3>
            <p><strong>Disease:</strong> {result.label}</p>
            <p><strong>Confidence:</strong> {(result.confidence * 100).toFixed(2)}%</p>
            {typeof result.guardrailConfidence === "number" && (
              <p><strong>Leaf Check:</strong> {(result.guardrailConfidence * 100).toFixed(2)}%</p>
            )}
            <p><strong>Description:</strong> {result.diseaseDetails.description || "No description available."}</p>
            <p><strong>Possible Steps:</strong> {result.diseaseDetails.possibleSteps || "No steps provided yet."}</p>
            {result.diseaseDetails.imageUrl && (
              <img className="disease-image" src={result.diseaseDetails.imageUrl} alt={result.label} />
            )}
            <h4>Supplements</h4>
            {result.diseaseDetails.supplements?.length ? (
              <ul className="supplement-list">
                {result.diseaseDetails.supplements.map((supplement) => (
                  <li key={supplement.name}>
                    <strong>{supplement.name}</strong>
                    <img src={supplement.image} alt={supplement.name} />
                    <a href={supplement.buyLink} target="_blank" rel="noreferrer">Buy Now</a>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No supplements available for this disease.</p>
            )}
          </div>
        )}
      </Section>

      {warning.length > 0 && (
        <div className="legacy-container warning-list">
          {warning.map((item) => <p key={item}>{item}</p>)}
        </div>
      )}
    </>
  );
}
