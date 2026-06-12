import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from 'react-toastify';
import "../App.css";
import API_BASE_URL from "../config";

function Detection() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);

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
      const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
      if (user) formData.append('user', JSON.stringify({ name: user.name, email: user.email }));

      const res = await axios.post(`${API_BASE_URL}/predict`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("Prediction result:", res.data);
      setResult(res.data);

      // fetch history after a successful detect
      try {
        if (user && user.email) {
          const h = await axios.get(`${API_BASE_URL}/history/${encodeURIComponent(user.email)}`);
          setHistory(h.data || []);
        }
      } catch (errFetch) {
        console.error('Error fetching history:', errFetch);
        toast.error('Failed to fetch search history');  
      }
    } catch (err) {
      console.error("Error uploading file:", err);
      toast.error("Failed to detect disease. Please try again.");
      setResult({
        disease: "Unknown",
        probability: 0,
        description: "Failed to detect disease. Please try again.",

      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    // perform actual deletion
    try {
      await axios.delete(`${API_BASE_URL}/history/${id}`);
      setHistory(prev => prev.filter(r => r._id !== id));
      toast.success('History item deleted');
    } catch (err) {
      console.error('Failed to delete history item:', err);
      toast.error('Failed to delete history item');
    }
  };

  const showDeleteConfirm = (id) => {
    const idToast = toast.info(
      <div>
        <div>Delete this history item?</div>
        <div style={{ marginTop: 8 }} className="toast-actions">
          <button className="toast-btn toast-cancel" onClick={() => toast.dismiss(idToast)}>Cancel</button>
          <button className="toast-btn toast-confirm" onClick={() => { handleDelete(id); toast.dismiss(idToast); }}>Delete</button>
        </div>
      </div>,
      { autoClose: false, closeOnClick: false }
    );
  };

  useEffect(() => {
    // load history on mount if logged in
    const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
    if (user && user.email) {
      axios.get(`${API_BASE_URL}/history/${encodeURIComponent(user.email)}`)
        .then(r => setHistory(r.data || []))
        .catch(e => {
          console.error('Failed to load history:', e);
          toast.error('Failed to load search history');
        });
    }
  }, []);

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
          <p className="probability">
            <b>Confidence Score:</b> {(result.probability * 100).toFixed(2)}%
          </p>

          <div className="result-details">
            <div className="result-section">
              <h3>Description</h3>
              <p style={{ whiteSpace: "pre-wrap" }}>{result.description}</p>
            </div>

            <div className="result-section solution">
              <h3>Treatment & Solution</h3>
              <p style={{ whiteSpace: "pre-wrap" }}>{result.treatment}</p>
            </div>
          </div>
        </div>
      )}

      {history && history.length > 0 && (
        <div className="history-section">
          <h3>Search History</h3>
          <div className="history-list">
            {history.map((rec) => (
              <div className="history-card" key={rec._id}>
                <button type="button" className="history-delete" aria-label="Delete history item" title="Delete" onClick={() => showDeleteConfirm(rec._id)}>×</button>
                {rec.imageUrl && (
                  <img src={rec.imageUrl} alt="thumb" className="history-thumb" />
                )}
                <div className="history-info">
                  {(() => {
                    const res = rec.result || {};
                    const raw = res.raw || {};
                    const fallbackName = raw?.suggestions?.[0]?.plant_name || raw?.suggestions?.[0]?.name || raw?.plant?.name || raw?.plant?.common_names?.[0] || raw?.disease_details?.name || raw?.common_names?.[0] || null;
                    const displayName = (res.disease && res.disease !== 'Unknown') ? res.disease : (res.name && res.name !== 'Unknown') ? res.name : (fallbackName || 'Unknown');
                    return <div><strong>Disease:</strong> {displayName}</div>;
                  })()}
                  <div><strong>Confidence:</strong> {((rec.result?.probability||0) * 100).toFixed(2)}%</div>
                  <div><small>{new Date(rec.createdAt).toLocaleString()}</small></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Detection;
