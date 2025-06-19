import React, { useState } from "react";
import { generateContentIdeas as apiGenerateIdeas } from "../api/rapidapi";

// PUBLIC_INTERFACE
/**
 * ContentIdeaGenerator - generates content ideas for creators using a real backend/service API.
 */
function ContentIdeaGenerator() {
  const [input, setInput] = useState("");
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // PUBLIC_INTERFACE
  /**
   * Calls the real backend API to generate content ideas.
   */
  async function generateIdeas() {
    if (!input.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const result = await apiGenerateIdeas(input.trim());
      setIdeas(result?.ideas || []);
    } catch (err) {
      setError("Failed to generate ideas. Please try again.");
      setIdeas([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h3>Content Idea Generator</h3>
      <input
        type="text"
        className="input"
        placeholder="Enter a topic or audience..."
        value={input}
        autoFocus
        onChange={(e) => setInput(e.target.value)}
        style={{ marginBottom: 8, width: "98%" }}
      />
      <button className="btn" style={{ width: 160 }} onClick={generateIdeas} disabled={loading || !input.trim()}>
        {loading ? "Generating..." : "Get Ideas"}
      </button>
      {error && <div style={{ color: "#f44", margin: "8px 0" }}>{error}</div>}
      <ul style={{ marginTop: 18 }}>
        {ideas.map((h, i) => (
          <li key={i} style={{ marginBottom: 7 }}>
            {h}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ContentIdeaGenerator;
