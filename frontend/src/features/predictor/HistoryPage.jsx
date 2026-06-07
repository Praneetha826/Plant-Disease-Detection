import { useEffect, useState } from "react";
import { Section } from "../../components/common/Section.jsx";
import { fetchHistory } from "../../services/api.js";

export function HistoryPage({ user }) {
  const [history, setHistory] = useState([]);
  const [status, setStatus] = useState("Loading...");

  useEffect(() => {
    async function loadHistory() {
      try {
        const uploads = await fetchHistory();
        setHistory(Array.isArray(uploads) ? uploads : uploads.data ?? []);
        setStatus("");
      } catch {
        const localHistory = JSON.parse(localStorage.getItem("plantpulse:history") ?? "[]");
        setHistory(localHistory);
        setStatus(localHistory.length ? "" : "No history available yet.");
      }
    }
    loadHistory();
  }, []);

  return (
    <Section id="history-container" className="history-page">
      <h2>History</h2>
      <h3>User: {user?.username ?? user?.email ?? "Guest"}</h3>
      {status && <p>{status}</p>}
      <ul id="historyList">
        {history.map((upload, index) => (
          <li key={upload._id ?? index}>
            <strong>Uploaded Image:</strong>
            {upload.imagePath ? <img src={upload.imagePath} alt="Uploaded" /> : <span>No image stored locally</span>}
            <strong>Diagnosis:</strong> {upload.diseaseLabel ?? upload.label}
            <strong>Confidence:</strong> {(((upload.confidence ?? upload.score) || 0) * 100).toFixed(2)}%
            <strong>Date:</strong> {new Date(upload.timestamp ?? upload.createdAt ?? Date.now()).toLocaleString()}
          </li>
        ))}
      </ul>
    </Section>
  );
}
