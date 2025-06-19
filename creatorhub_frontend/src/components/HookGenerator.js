import React, { useState } from "react";
import { generateHooks as apiGenerateHooks } from "../api/rapidapi";

// PUBLIC_INTERFACE
/**
 * HookGenerator - generates content hooks for creators using a real API.
 */
function HookGenerator() {
  const [input, setInput] = useState("");
  const [hooks, setHooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // PUBLIC_INTERFACE
  /**
   * Calls the real backend API to generate hooks from a topic input.
   */
  async function generateHooks() {
    if (!input.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const result = await apiGenerateHooks(input.trim());
      setHooks(result?.hooks || []);
    } catch (err) {
      setError("Failed to generate hooks. Please try again.");
      setHooks([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h3>Hook Generator</h3>
      <input
        type="text"
        className="input"
        placeholder="Describe your content topic..."
        value={input}
        autoFocus
        onChange={(e) => setInput(e.target.value)}
        style={{ marginBottom: 8, width: "98%" }}
      />
      <button className="btn" style={{ width: 180 }} onClick={generateHooks} disabled={loading || !input.trim()}>
        {loading ? "Generating..." : "Generate Hooks"}
      </button>
      {error && <div style={{ color: "#f44", margin: "8px 0" }}>{error}</div>}
      <ul style={{ marginTop: 18 }}>
        {hooks.map((h, i) => (
          <li key={i} style={{ marginBottom: 7 }}>
            {h}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default HookGenerator;
