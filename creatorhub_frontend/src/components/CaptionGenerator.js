import React, { useState } from "react";
import { generateCaptions as apiGenerateCaptions } from "../api/rapidapi";

// PUBLIC_INTERFACE
/**
 * CaptionGenerator - generates social captions using a real backend/service API.
 */
function CaptionGenerator() {
  const [input, setInput] = useState("");
  const [captions, setCaptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // PUBLIC_INTERFACE
  /**
   * Calls the real backend API to generate captions.
   */
  async function generateCaptions() {
    if (!input.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const result = await apiGenerateCaptions(input.trim());
      setCaptions(result?.captions || []);
    } catch (err) {
      setError("Failed to generate captions. Please try again.");
      setCaptions([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h3>Caption Generator</h3>
      <input
        type="text"
        className="input"
        placeholder="Describe the post or image..."
        value={input}
        autoFocus
        onChange={(e) => setInput(e.target.value)}
        style={{ marginBottom: 8, width: "98%" }}
      />
      <button className="btn" style={{ width: 170 }} onClick={generateCaptions} disabled={loading || !input.trim()}>
        {loading ? "Generating..." : "Generate Captions"}
      </button>
      {error && <div style={{ color: "#f44", margin: "8px 0" }}>{error}</div>}
      <ul style={{ marginTop: 18 }}>
        {captions.map((h, i) => (
          <li key={i} style={{ marginBottom: 7 }}>
            {h}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CaptionGenerator;
