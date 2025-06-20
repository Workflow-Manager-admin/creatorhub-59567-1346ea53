import React, { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai"; // Import Gemini SDK
import Modal from '../Modal'; // Import your Modal component

// PUBLIC_INTERFACE
/**
 * HashtagGenerator - generates grouped hashtags using the Gemini API.
 * This component now also handles its own modal display and acts as the tool card on the dashboard.
 */
function HashtagGenerator() {
  const [topic, setTopic] = useState("");
  const [groups, setGroups] = useState({
    "High Engagement": [],
    "Trending": [],
    "Evergreen": [],
  });
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control this tool's modal

  // --- Gemini API Configuration ---
  const GEMINI_API_KEY = 'AIzaSyACx37UXHYLpnkMw0wZbWuYKECWU8negfo'; // Your API key
  const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro-latest' });

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  async function generateHashtags() {
    if (!topic.trim()) {
      setError("Please enter a topic or niche to generate hashtags.");
      return;
    }
    setLoading(true);
    setError(null);
    setGroups({ "High Engagement": [], "Trending": [], "Evergreen": [] });

    try {
      let prompt = `Generate social media hashtags for a topic about: "${topic}".
      Please categorize them into three groups:
      1. High Engagement: 5 hashtags that drive interaction.
      2. Trending: 5 currently popular hashtags.
      3. Evergreen: 5 timeless and always relevant hashtags.

      Format the output clearly, with each group name followed by its hashtags,
      e.g.,
      High Engagement: #tag1 #tag2 #tag3 #tag4 #tag5
      Trending: #tagA #tagB #tagC #tagD #tagE
      Evergreen: #tagX #tagY #tagZ #tagAA #tagBB`;

      const result = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 250,
        },
      });

      const response = await result.response;
      const generatedText = response.text();

      if (generatedText) {
        const newGroups = {
          "High Engagement": [],
          "Trending": [],
          "Evergreen": [],
        };

        const lines = generatedText.split('\n').map(line => line.trim()).filter(line => line.length > 0);
        let currentGroup = "";

        lines.forEach(line => {
          if (line.toLowerCase().startsWith("high engagement:")) {
            currentGroup = "High Engagement";
            newGroups[currentGroup] = line.substring("High Engagement:".length).split(' ').filter(tag => tag.startsWith('#') && tag.length > 1);
          } else if (line.toLowerCase().startsWith("trending:")) {
            currentGroup = "Trending";
            newGroups[currentGroup] = line.substring("Trending:".length).split(' ').filter(tag => tag.startsWith('#') && tag.length > 1);
          } else if (line.toLowerCase().startsWith("evergreen:")) {
            currentGroup = "Evergreen";
            newGroups[currentGroup] = line.substring("Evergreen:".length).split(' ').filter(tag => tag.startsWith('#') && tag.length > 1);
          } else if (currentGroup && line.startsWith('#')) {
            newGroups[currentGroup].push(...line.split(' ').filter(tag => tag.startsWith('#') && tag.length > 1));
          }
        });
        setGroups(newGroups);

      } else {
        setGroups({
          "High Engagement": [],
          "Trending": [],
          "Evergreen": [],
        });
      }
    } catch (err) {
      console.error('Error generating hashtags with Gemini API:', err);
      setError(`Failed to generate hashtags: ${err.message || 'An unknown error occurred.'}`);
    } finally {
      setLoading(false);
    }
  }

  function handleCopy() {
    const allTags = Object.values(groups).flat().join(" ");
    navigator.clipboard.writeText(allTags).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1100);
    });
  }

  function handleRegenerate() {
    generateHashtags();
    setCopied(false);
  }

  const isGenerateDisabled = loading || !topic.trim();

  return (
    // This is the dashboard card view for the Hashtag Generator
    <div className="tool-card" onClick={openModal}> {/* Make the whole card clickable */}
      <h4 className="tool-title">Hashtag Generator</h4>
      <p className="tool-description">Generate grouped hashtags (High Engagement, Trending, Evergreen).</p>
      <button className="open-tool-button" onClick={openModal}>Open Tool</button>
      <div className="info-icon" onClick={(e) => { e.stopPropagation(); alert('Hashtag Generator Info: Provides categorized hashtags for your content.'); }}>
          ⓘ
      </div>

      {/* This is the Modal that opens when the card is clicked */}
      <Modal isOpen={isModalOpen} onClose={closeModal} title="Hashtag Generator (Gemini AI)">
        {/* Content of the modal: your original HashtagGenerator form and results */}
        <div
          className="ch-card" // This specific card styling might not be needed INSIDE the modal if modal has its own
          // However, keeping it for now to preserve original layout you provided for the form.
          // Adjust inline styles from original ch-card if they conflict with modal styling.
          // It's better to remove these inline styles if modal has proper padding/background.
          style={{
            maxWidth: 490, // Max width is less relevant inside a modal with its own width
            margin: "0 auto",
            borderRadius: 24, // Modal already has border-radius
            boxShadow: "none", // Remove shadow inside modal, modal has its own shadow
            padding: 20, // Reduced padding to let modal's padding handle it
            background: "transparent", // Use transparent as modal provides background
          }}
        >
          <div
            className="ch-card-title"
            style={{
              fontWeight: 800,
              fontSize: "1.24em",
              marginBottom: 13,
              color: "var(--accent,#A178DF)", // Use CreatorHub accent here if preferred, or modal title handles it
              textShadow: "0 2px 11px #a178df1b",
            }}
          >
            Hashtag Generator (Gemini AI) {/* This title is redundant with modal title, consider removing */}
          </div>
          <form
            onSubmit={(e) => { e.preventDefault(); generateHashtags(); }}
            style={{ display: "flex", flexDirection: "column", gap: 13, marginBottom: 14 }}
          >
            <label htmlFor="hashtag-topic" style={{ fontSize: ".98em", color: "var(--text-secondary)" }}>
              Enter a topic or niche:
            </label>
            <input
              id="hashtag-topic"
              type="text"
              value={topic}
              placeholder="e.g. Fitness, AI, Travel"
              maxLength={60}
              className="ch-search input" // Added 'input' class for global styling
              style={{
                background: "#181d26", // Specific background from your original code
                color: "var(--text-color)",
                border: "1.2px solid var(--border-color)",
                borderRadius: 15,
                fontSize: ".98em",
                fontWeight: 500,
                padding: "10px 16px",
              }}
              onChange={(e) => setTopic(e.target.value)}
            />
            <button
              type="submit"
              className="ch-info-btn btn" // Added 'btn' class for global styling
              disabled={isGenerateDisabled}
              style={{
                marginTop: 2,
                fontWeight: 700,
                alignSelf: "flex-start",
                minWidth: 95,
                background: "var(--accent-gradient)", // Keep this if you use gradients specific to buttons
                color: "#fff"
              }}
            >
              {loading ? "Generating..." : "Generate"}
            </button>
          </form>

          {error && <div style={{ color: "var(--danger)", margin: "8px 0" }}>{error}</div>}

          <div>
            {loading ? (
              <div className="ch-loader" style={{ marginTop: 12, marginBottom: 15 }}>Generating hashtags...</div>
            ) : (
              Object.keys(groups).map((groupName) => (
                <div
                  key={groupName}
                  style={{
                    marginBottom: 13,
                    background:
                      groupName === "High Engagement"
                        ? "var(--success-bg)"
                        : groupName === "Trending"
                          ? "var(--info-bg)"
                          : "var(--card-bg,rgba(43,48,70,0.82))", // Use a generic background if 'card-bg' not defined
                    borderRadius: 13,
                    padding: "13px 16px 10px 16px",
                    boxShadow: "0 2.5px 11px rgba(161,120,223,0.16)", // Updated shadow for consistency
                  }}
                >
                  <div
                    style={{
                      fontWeight: 700,
                      color:
                        groupName === "High Engagement"
                          ? "var(--success)"
                          : groupName === "Trending"
                            ? "var(--info)"
                            : "var(--text-color)",
                      fontSize: ".98em",
                      marginBottom: 6,
                      letterSpacing: ".02em",
                      textShadow: groupName === "High Engagement" ? "0 1.5px 9px rgba(88,216,154,0.13)" : undefined, // Updated shadow color
                    }}
                  >
                    {groupName}
                  </div>
                  <div>
                    {groups[groupName].length > 0 ? (
                      groups[groupName].map((tag, idx) => (
                        <span
                          key={`${groupName}-${idx}-${tag}`}
                          className="ch-card-tag"
                          style={{
                            marginRight: 8,
                            background:
                              groupName === "Trending"
                                ? "var(--accent-gradient)" // This gradient is for the trending tags
                                : groupName === "High Engagement"
                                  ? "var(--success-bg)"
                                  : "rgba(48,54,81,0.92)", // Generic tag background
                            color: groupName === "Trending"
                              ? "#fff"
                              : groupName === "High Engagement"
                                ? "var(--success)"
                                : "var(--text-color)",
                            display: 'inline-block',
                            marginBottom: '5px',
                            padding: '4px 8px',
                            borderRadius: '6px',
                            fontSize: '.85em',
                          }}
                        >
                          {tag}
                        </span>
                      ))
                    ) : (
                      <span style={{ color: "var(--text-secondary)", fontSize: '.85em' }}>No hashtags generated for this group.</span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
          {/* Actions */}
          <div style={{ display: "flex", gap: 11, marginTop: 20 }}>
            <button
              type="button"
              className="ch-info-btn btn" // Added 'btn' class
              style={{
                background: "var(--accent-gradient-focus)",
                color: "#fff",
                fontWeight: 700,
                minWidth: 83,
                boxShadow: "0 1.1px 9px rgba(206,109,135,0.25)", // Updated shadow color
              }}
              onClick={handleCopy}
              disabled={loading || Object.values(groups).flat().length === 0}
              aria-label="Copy all hashtags"
            >
              {copied ? "Copied!" : "Copy"}
            </button>
            <button
              type="button"
              className="ch-info-btn btn" // Added 'btn' class
              style={{
                background: "var(--info-bg)",
                color: "var(--info)",
                fontWeight: 600,
                minWidth: 115,
                boxShadow: "0 1.1px 8px rgba(130,196,236,0.13)", // Updated shadow color
              }}
              onClick={handleRegenerate}
              disabled={isGenerateDisabled}
              aria-label="Regenerate hashtags"
            >
              Regenerate
            </button>
          </div>
          <div style={{ fontSize: ".93em", color: "var(--text-secondary)", marginTop: 16 }}>
            Hashtags grouped for optimal reach. Click "Copy" to use all; "Regenerate" for new picks.
          </div>
          <div style={{ fontSize: ".89em", color: "var(--success)", marginTop: 5, fontWeight: 500 }}>
            Pro tip: Use 2-3 per group for best results!
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default HashtagGenerator;