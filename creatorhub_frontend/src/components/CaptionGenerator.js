import React, { useState } from "react";
import Modal from './Modal'; // <--- Make sure this path is correct for your Modal.js file

// PUBLIC_INTERFACE
/**
 * CaptionGenerator - Generates social captions using the Gemini API via RapidAPI.
 * This component now also handles its own modal display and acts as the tool card on the dashboard.
 */
function CaptionGenerator() {
  const [description, setDescription] = useState("");
  const [tone, setTone] = useState("neutral");
  const [keywords, setKeywords] = useState("");
  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control this tool's modal

  // Function to open the modal
  const openModal = () => {
    console.log("openModal called. Setting isModalOpen to true for CaptionGenerator.");
    setIsModalOpen(true);
  };

  // Function to close the modal
  const closeModal = () => {
    console.log("closeModal called. Setting isModalOpen to false for CaptionGenerator.");
    setIsModalOpen(false);
  };

  // ⚠️ Use environment variables in production
  const RAPIDAPI_KEY = '6d105ed8cfmsh977c9a021254071p16d2e4jsndadd8381e47f'; // Make sure this key is correct
  const RAPIDAPI_HOST = "gemini-pro-ai.p.rapidapi.com";
  // CONFIRMED: The endpoint is just the host, no /text path needed.
  const RAPIDAPI_ENDPOINT = `https://${RAPIDAPI_HOST}/`;

  async function generateCaptions() {
    if (!description.trim()) {
      setError("Please provide a description for the caption.");
      return;
    }

    setLoading(true);
    setError(null);
    setCaption("");

    // Build prompt string
    let prompt = `Generate a social media caption based on: "${description}".`;
    if (tone !== "neutral") prompt += ` Tone: ${tone}.`;
    if (keywords.trim()) prompt += ` Include these keywords: ${keywords}.`;
    prompt += " Keep it concise and engaging.";

    try {
      const response = await fetch(RAPIDAPI_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-RapidAPI-Key": RAPIDAPI_KEY,
          "X-RapidAPI-Host": RAPIDAPI_HOST,
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("API error response (raw):", errorText);
        let errorMessage = "Unknown API error occurred.";
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.message || errorData.error?.message || errorMessage;
        } catch (e) {
          errorMessage = errorText;
        }

        if (response.status === 429) {
          setError("Rate limit exceeded. Please wait and try again.");
        } else if (response.status === 403 || response.status === 401) {
          setError("Invalid API key or subscription issue. " + errorMessage);
        } else if (response.status === 400 && errorMessage.includes("contents")) {
           setError("Bad request: Issue with request format. Ensure 'contents' is correctly structured.");
        }
        else {
          setError(`API error: ${errorMessage}`);
        }
        return;
      }

      const data = await response.json();
      console.log("API Full Response Data:", data);

      if (data?.candidate?.content?.parts?.[0]?.text) {
        setCaption(data.candidate.content.parts[0].text.trim());
      } else {
        setCaption("No caption generated. Try refining your input or check console for response details.");
        console.warn("Unexpected response format or no caption in expected path:", data);
      }

    } catch (err) {
      console.error("Network/API error:", err);
      setError(`Network error: ${err.message || "Unknown issue"}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    // This is the dashboard card view for the Caption Generator
    <div
      className="tool-card"
      onClick={openModal} // Clicking anywhere on the card opens the modal
      style={{ cursor: 'pointer' }} // Visual cue that it's clickable
    >
      <h4 className="tool-title">Caption Generator</h4>
      <p className="tool-description">Type a topic and pick a tone for fresh caption ideas.</p>
      {/* The "Open Tool" button */}
      <button
        className="open-tool-button"
        onClick={(e) => {
          e.stopPropagation(); // Prevents the parent card's onClick from firing again
          openModal();
        }}
      >
        Open Tool
      </button>
      {/* The "i" info button */}
      <div
        className="info-icon"
        onClick={(e) => {
          e.stopPropagation(); // Prevents the parent card's onClick from firing
          alert('Caption Generator Info: Generates creative captions for your social media posts!');
        }}
      >
        ⓘ
      </div>

      {/* The Modal component, rendered only when isModalOpen is true */}
      <Modal isOpen={isModalOpen} onClose={closeModal} title="Caption Generator (Gemini AI)">
        {/*
          This is the content that will appear inside the modal.
          It's the full UI and logic for your Caption Generator tool.
        */}
        <div style={{ padding: "15px" }}> {/* Added padding to align with modal structure */}
          <h3 style={{ marginBottom: "15px", color: "var(--text-primary)" }}>
            Caption Generator (Gemini AI via RapidAPI)
          </h3>

          {/* Description */}
          <div style={{ marginBottom: "10px" }}>
            <label htmlFor="description" style={labelStyle}>Describe your post or image:</label>
            <textarea
              id="description"
              className="input" // Using the global 'input' class from App.css
              placeholder="e.g., A sunny beach day with friends..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="4"
              style={textareaStyle}
            />
          </div>

          {/* Tone Selector */}
          <div style={{ marginBottom: "10px" }}>
            <label htmlFor="tone" style={labelStyle}>Select Tone:</label>
            <select
              id="tone"
              className="input custom-select-arrow" // Added 'custom-select-arrow' for custom styling
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              style={selectStyle}
            >
              {["neutral", "funny", "inspirational", "professional", "witty", "casual", "sarcastic"].map((t) => (
                <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
              ))}
            </select>
          </div>

          {/* Keywords */}
          <div style={{ marginBottom: "15px" }}>
            <label htmlFor="keywords" style={labelStyle}>Keywords (comma-separated):</label>
            <input
              id="keywords"
              type="text"
              className="input" // Using the global 'input' class from App.css
              placeholder="e.g., summer, beachlife, #travel"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              style={{ width: "98%" }}
            />
          </div>

          {/* Generate Button */}
          <button
            className="btn" // Using the global 'btn' class from App.css
            style={{ width: 170 }}
            onClick={generateCaptions}
            disabled={loading || !description.trim()}
          >
            {loading ? "Generating..." : "Generate Caption"}
          </button>

          {/* Error */}
          {error && <div style={{ color: "var(--danger)", marginTop: "15px" }}>{error}</div>}

          {/* Result */}
          {caption && (
            <div style={resultBoxStyle}>
              <h4 style={{ marginBottom: "10px", color: "var(--text-primary)" }}>Generated Caption:</h4>
              <p style={captionStyle}>{caption}</p>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}

// 🔧 Inline Styles (These styles are for the form elements within the modal content)
const labelStyle = {
  display: "block",
  marginBottom: "5px",
  color: "var(--text-secondary)",
  fontSize: "0.9em",
};

const textareaStyle = {
  width: "98%",
  resize: "vertical",
};

const selectStyle = {
  width: "calc(98% + 2px)", // Adjust to make sure it fills like other inputs
};

const resultBoxStyle = {
  marginTop: "20px",
  border: "1px solid var(--border-color)",
  padding: "15px",
  borderRadius: "8px",
  background: "var(--background-secondary)",
};

const captionStyle = {
  color: "var(--text-secondary)",
  whiteSpace: "pre-wrap",
  fontFamily: "monospace",
};

export default CaptionGenerator;