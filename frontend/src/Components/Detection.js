import React, { useState } from "react";
import axios from "axios";
import "../App.css";

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

    const res = await axios.post("http://localhost:5000/predict", formData, {
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
      treatment: {
        chemical: ["N/A"],
        biological: ["N/A"],
        prevention: ["N/A"],
      },
      similar_images: [],
    });
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="app-container">
      <h1>🌱 AI Crop Disease Detection</h1>

      <div className="upload-card">
        <input type="file" onChange={handleFileChange} />
        <button onClick={handleUpload} disabled={!file || loading}>
          {loading ? "Detecting..." : "Detect Disease"}
        </button>
      </div>

      {result && (
        <div className="result-card">
          <h2>Disease: {result.disease}</h2>
          <p>
            <b>Probability:</b> {(result.probability * 100).toFixed(2)}%
          </p>
          <p>
            <b>Description:</b> {result.description}
          </p>

          <h3>Treatment:</h3>
          <p>
            <b>Chemical:</b> {result.treatment?.chemical?.join(", ") || "N/A"}
          </p>
          <p>
            <b>Biological:</b> {result.treatment?.biological?.join(", ")|| "N/A"}
          </p>
          <p>
            <b>Prevention:</b> {result.treatment?.prevention?.join(", ")|| "N/A"}
          </p>

          <h3>Similar Images:</h3>
          <div className="similar-images">
            {result.similar_images.length > 0 ? (
              result.similar_images.map((url, idx) => (
                <img key={idx} src={url} alt="similar" width="150" />
              ))
            ) : (
              <p>No similar images available</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Detection;
