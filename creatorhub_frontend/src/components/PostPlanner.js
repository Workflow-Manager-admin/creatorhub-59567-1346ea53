import React, { useState } from "react";
// Removed: import { generatePostPlan as apiGeneratePostPlan } from "../api/rapidapi"; // No longer needed
import Modal from './Modal'; // Import your Modal component

// PUBLIC_INTERFACE
/**
 * PostPlanner - Suggests a weekly post plan for creators using Gemini 1.5 Pro via RapidAPI,
 * allowing users to specify desired posting days.
 */
function PostPlanner() {
  const [contentGoal, setContentGoal] = useState(""); // Renamed 'input' for clarity
  const [plan, setPlan] = useState([]);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control this tool's modal
  const [selectedDays, setSelectedDays] = useState([]); // Array to store selected days (0-6 for Sun-Sat)

  // Day names for display and selection
  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  // --- RapidAPI Configuration ---
  const RAPIDAPI_KEY = '6d105ed8cfmsh977c9a021254071p16d2e4jsndadd8381e47f'; // Your RapidAPI Key
  const RAPIDAPI_HOST = "gemini-2-5-pro.p.rapidapi.com";
  const RAPIDAPI_ENDPOINT = `https://${RAPIDAPI_HOST}/`;

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // Helper to toggle day selection
  const toggleDay = (dayIndex) => {
    setSelectedDays(prevDays =>
      prevDays.includes(dayIndex)
        ? prevDays.filter(d => d !== dayIndex)
        : [...prevDays, dayIndex].sort((a, b) => a - b) // Keep days sorted
    );
  };

  async function generatePlan() {
    if (!contentGoal.trim()) {
      setError("Please describe your content goal/theme.");
      return;
    }
    if (selectedDays.length === 0) {
      setError("Please select at least one day for your post plan.");
      return;
    }

    setLoading(true);
    setError(null);
    setPlan([]); // Clear previous plan

    try {
      const selectedDayNames = selectedDays.map(index => dayNames[index]);
      const daysString = selectedDayNames.join(", ");

      let prompt = `Generate a weekly content post plan for the following content goal/theme: "${contentGoal}".
      Provide a specific post idea for each of these days: ${daysString}.
      For each day, suggest a concise post topic/idea.
      Format the output as:
      Day: Idea
      Day: Idea
      ...`;

      console.log("Sending prompt to Gemini 1.5 Pro (via RapidAPI) for post plan:", prompt);

      const response = await fetch(RAPIDAPI_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-RapidAPI-Key": RAPIDAPI_KEY,
          "X-RapidAPI-Host": RAPIDAPI_HOST,
        },
        body: JSON.stringify({
          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],
          model: "gemini-2-5-pro",
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("API error response (raw):", errorText);
        let errorMessage = `API request failed with status ${response.status}.`;
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.message || errorData.error?.message || errorMessage;
        } catch (e) {
          errorMessage = errorText;
        }
        setError(`Failed to generate plan: ${errorMessage}`);
        return;
      }

      const responseText = await response.text();
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (jsonParseError) {
        console.error("Failed to parse RapidAPI response as JSON:", responseText, jsonParseError);
        setError("Received an invalid response from RapidAPI (not valid JSON). Please check your RapidAPI subscription or contact support.");
        return;
      }
      
      console.log("Parsed API Data (Post Plan):", data);

      let generatedText = '';
      if (data?.candidate?.content?.parts?.[0]?.text) {
        generatedText = data.candidate.content.parts[0].text.trim();
      } else if (data?.choices?.[0]?.message?.content) {
        generatedText = data.choices[0].message.content.trim();
      } else if (data?.error) {
        setError(`Gemini 1.5 Pro API error: ${data.error.message || "Unknown error"}. Check API response in console for details.`);
        console.error("Gemini 1.5 Pro API returned an error object:", data.error);
      }


      if (generatedText) {
        // Parse the generated plan
        const lines = generatedText.split('\n').filter(line => line.trim().length > 0);
        const parsedPlan = lines.map(line => {
          const parts = line.split(':');
          if (parts.length >= 2) {
            return { day: parts[0].trim(), topic: parts.slice(1).join(':').trim() };
          }
          return { day: "Unknown", topic: line.trim() }; // Fallback for unparseable lines
        });
        setPlan(parsedPlan);
      } else {
        setPlan([]);
        setError("No post plan was generated. Please try again with a different goal/theme.");
      }
    } catch (err) {
      console.error('Network/API error generating post plan with Gemini API:', err);
      setError(`Failed to generate plan: ${err.message || 'An unknown network error occurred.'}`);
    } finally {
      setLoading(false);
    }
  }

  function handleCopyAllPlan() {
    const allPlanText = plan.map(item => `${item.day}: ${item.topic}`).join('\n\n');
    if (allPlanText) {
      navigator.clipboard.writeText(allPlanText).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1100);
      }).catch(err => {
        console.error("Failed to copy plan:", err);
        setError("Failed to copy plan to clipboard.");
      });
    }
  }

  function handleRegenerate() {
    generatePlan();
    setCopied(false);
  }

  const isGenerateDisabled = loading || !contentGoal.trim() || selectedDays.length === 0;

  return (
    // This outer div is the tool card that appears on the dashboard and ToolsPage
    <div
      className="tool-card"
      onClick={openModal}
      style={{
          background: "var(--card-bg, rgba(43,48,70,0.82))",
          borderRadius: 13,
          padding: "20px",
          boxShadow: "0 2.5px 11px rgba(161,120,223,0.16)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          minHeight: "250px", // Adjust height as needed for your grid
          border: "1px solid var(--border-color)",
          cursor: "pointer",
          transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
      }}
    >
      <h4 className="tool-title">Post Planner</h4>
      <p className="tool-description">Get a full weekly post plan based on your content goal, tailored to your chosen days.</p>
      {/* FIX: Add e.stopPropagation() to prevent click bubbling from button to parent div */}
      <button
        className="open-tool-button"
        onClick={(e) => {
          e.stopPropagation(); // Prevents the div's onClick from firing
          openModal();
        }}
      >
        Open Tool
      </button>
      <div className="info-icon" onClick={(e) => { e.stopPropagation(); alert('Post Planner Info: Generates a strategic weekly post plan for your content goals, letting you pick the days.'); }}>
        ⓘ
      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal} title="Post Planner (Gemini AI)">
        <div
          className="ch-card"
          style={{
            maxWidth: 490,
            margin: "0 auto",
            borderRadius: 24,
            boxShadow: "none",
            padding: 20,
            background: "transparent",
          }}
        >
          <div
            className="ch-card-title"
            style={{
              fontWeight: 800,
              fontSize: "1.24em",
              marginBottom: 13,
              color: "var(--accent,#A178DF)",
              textShadow: "0 2px 11px #a178df1b",
            }}
          >
            Post Planner (Gemini AI)
          </div>
          <form
            onSubmit={(e) => { e.preventDefault(); generatePlan(); }}
            style={{ display: "flex", flexDirection: "column", gap: 13, marginBottom: 14 }}
          >
            <label htmlFor="content-goal" style={{ fontSize: ".98em", color: "var(--text-secondary)" }}>
              Content Goal / Theme:
            </label>
            <input
              id="content-goal"
              type="text"
              value={contentGoal}
              placeholder="e.g., Increase engagement on TikTok, Grow YouTube subscribers"
              maxLength={100}
              className="ch-search input"
              style={{
                background: "#181d26",
                color: "var(--text-color)",
                border: "1.2px solid var(--border-color)",
                borderRadius: 15,
                fontSize: ".98em",
                fontWeight: 500,
                padding: "10px 16px",
              }}
              onChange={(e) => setContentGoal(e.target.value)}
            />

            <label style={{ fontSize: ".98em", color: "var(--text-secondary)", marginTop: 5 }}>
              Select Posting Days:
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '8px', marginBottom: '10px' }}>
              {dayNames.map((day, index) => (
                <div key={index} style={{ display: 'flex', alignItems: 'center' }}>
                  <input
                    type="checkbox"
                    id={`day-${day}`}
                    checked={selectedDays.includes(index)}
                    onChange={() => toggleDay(index)}
                    style={{ marginRight: '8px', accentColor: 'var(--accent, #A178DF)' }}
                  />
                  <label htmlFor={`day-${day}`} style={{ color: 'var(--text-color)', fontSize: '0.9em' }}>{day}</label>
                </div>
              ))}
            </div>

            <button
              type="submit"
              className="ch-info-btn btn"
              disabled={isGenerateDisabled}
              style={{
                marginTop: 2,
                fontWeight: 700,
                alignSelf: "flex-start",
                minWidth: 95,
                background: "var(--accent-gradient)",
                color: "#fff"
              }}
            >
              {loading ? "Generating..." : "Plan My Posts"}
            </button>
          </form>

          {error && <div style={{ color: "var(--danger)", margin: "8px 0" }}>{error}</div>}

          <div>
            {loading ? (
              <div className="ch-loader" style={{ marginTop: 12, marginBottom: 15 }}>Generating plan...</div>
            ) : (
              plan.length > 0 && (
                <>
                  <div style={{ fontSize: ".98em", color: "var(--text-secondary)", marginBottom: 10 }}>
                    Generated Post Plan:
                  </div>
                  {plan.map((item, index) => (
                    <div
                      key={index}
                      style={{
                        marginBottom: 10,
                        background: "var(--card-bg, rgba(43,48,70,0.82))",
                        borderRadius: 13,
                        padding: "13px 16px",
                        boxShadow: "0 2.5px 11px rgba(161,120,223,0.16)",
                        fontSize: ".95em",
                        color: "var(--text-color)",
                      }}
                    >
                      <strong>{item.day}:</strong> {item.topic}
                    </div>
                  ))}
                </>
              )
            )}
          </div>
          {/* Actions */}
          <div style={{ display: "flex", gap: 11, marginTop: 20 }}>
            <button
              type="button"
              className="ch-info-btn btn"
              style={{
                background: "var(--accent-gradient-focus)",
                color: "#fff",
                fontWeight: 700,
                minWidth: 83,
                boxShadow: "0 1.1px 9px rgba(206,109,135,0.25)",
              }}
              onClick={handleCopyAllPlan}
              disabled={loading || plan.length === 0}
              aria-label="Copy all plan items"
            >
              {copied ? "Copied!" : "Copy All"}
            </button>
            <button
              type="button"
              className="ch-info-btn btn"
              style={{
                background: "var(--info-bg)",
                color: "var(--info)",
                fontWeight: 600,
                minWidth: 115,
                boxShadow: "0 1.1px 8px rgba(130,196,236,0.13)",
              }}
              onClick={handleRegenerate}
              disabled={isGenerateDisabled}
              aria-label="Regenerate plan"
            >
              Regenerate
            </button>
          </div>
          <div style={{ fontSize: ".93em", color: "var(--text-secondary)", marginTop: 16 }}>
            Get a tailored weekly post plan designed for your content strategy.
          </div>
          <div style={{ fontSize: ".89em", color: "var(--success)", marginTop: 5, fontWeight: 500 }}>
            Pro tip: Consistency is key! Stick to your plan for best results.
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default PostPlanner;