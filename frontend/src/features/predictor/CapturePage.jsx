import { useEffect, useRef, useState } from "react";
import { Camera, Upload } from "lucide-react";
import { Section } from "../../components/common/Section.jsx";

export function CapturePage({ navigate }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [captured, setCaptured] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let stream;
    async function startCamera() {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) videoRef.current.srcObject = stream;
      } catch {
        setError("Camera access is unavailable. You can still upload an image from the upload page.");
      }
    }
    startCamera();
    return () => stream?.getTracks().forEach((track) => track.stop());
  }, []);

  function captureImage() {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0);
    setCaptured(canvas.toDataURL("image/jpeg"));
  }

  return (
    <Section className="capture-page">
      <h2>Capture and Upload</h2>
      <p>Capture a leaf photo with your webcam, then continue to the upload diagnosis flow.</p>
      {error && <p className="error-message">{error}</p>}
      <video ref={videoRef} autoPlay playsInline muted className="webcam-preview" />
      <canvas ref={canvasRef} hidden />
      <div className="capture-actions">
        <button type="button" className="info-btn" onClick={captureImage}><Camera size={18} />Capture</button>
        <button type="button" className="info-btn" onClick={() => navigate("/upload")}><Upload size={18} />Upload</button>
      </div>
      {captured && <img className="captured-image" src={captured} alt="Captured leaf preview" />}
    </Section>
  );
}
