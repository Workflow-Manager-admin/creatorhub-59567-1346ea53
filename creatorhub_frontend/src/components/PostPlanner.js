import React, { useState } from "react";
import { generatePostPlan as apiGeneratePostPlan } from "../api/rapidapi";

// PUBLIC_INTERFACE
/**
 * PostPlanner - Suggests a weekly post plan for creators using a real backend/service API.
 */
function PostPlanner() {
  const [input, setInput] = useState("");
  const [plan, setPlan] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // PUBLIC_INTERFACE
  /**
   * Calls the real backend/service API to provide a post plan.
   */
  async function generatePlan() {
    if (!input.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const result = await apiGeneratePostPlan(input.trim());
      setPlan(result?.plan || []);
    } catch (err) {
      setError("Failed to generate post plan. Please try again.");
      setPlan([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h3>Post Planner</h3>
      <input
        type="text"
        className="input"
        placeholder="Describe your content goal/theme..."
        value={input}
        autoFocus
        onChange={(e) => setInput(e.target.value)}
        style={{ marginBottom: 8, width: "98%" }}
      />
      <button className="btn" style={{ width: 150 }} onClick={generatePlan} disabled={loading || !input.trim()}>
        {loading ? "Generating..." : "Plan My Posts"}
      </button>
      {error && <div style={{ color: "#f44", margin: "8px 0" }}>{error}</div>}
      <ul style={{ marginTop: 18 }}>
        {plan.map((item, i) => (
          <li key={i} style={{ marginBottom: 7 }}>
            <b>{item.day}:</b> {item.topic}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PostPlanner;
