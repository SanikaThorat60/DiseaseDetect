import React, { useState } from "react";
import axios from "axios";
import "../App.css";
import API_BASE_URL from "../config";

function Detection() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setResult(null);
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("image", file);

      const res = await axios.post(`${API_BASE_URL}/predict`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("Prediction result:", res.data);
      setResult(res.data);
    } catch (err) {
      console.error("Error uploading file:", err);
      setResult({
        disease: "Unknown",
        probability: 0,
        description: "Failed to detect disease. Please try again.",

      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <h1>AI Crop Disease Detection</h1>

      <div className="upload-card">
        <input type="file" onChange={handleFileChange} />
        <button onClick={handleUpload} disabled={!file || loading}>
          {loading ? (
            <div className="loading-container">
              <div className="spinner"></div>
              <span>Detecting...</span>
            </div>
          ) : (
            "Detect Disease"
          )}
        </button>
      </div>

      {result && (
        <div className="result-card fade-in">
          <h2>Disease: {result.disease}</h2>
          <p>
            <b>Probability:</b> {(result.probability * 100).toFixed(2)}%
          </p>

        </div>
      )}
    </div>
  );
}

export default Detection;
