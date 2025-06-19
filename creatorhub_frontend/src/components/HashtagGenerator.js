import React, { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai"; // Import Gemini SDK

// PUBLIC_INTERFACE
/**
 * HashtagGenerator - generates grouped hashtags using the Gemini API.
 */
function HashtagGenerator() {
  const [topic, setTopic] = useState("");
  // Initial state for groups will be empty; populate after Gemini call
  const [groups, setGroups] = useState({
    "High Engagement": [],
    "Trending": [],
    "Evergreen": [],
  });
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(null); // Added error state

  // --- Gemini API Configuration ---
  // IMPORTANT: Replace 'YOUR_GEMINI_API_HERE' with your actual API key.
  // For production, consider storing this securely (e.g., environment variables)
  // and routing API calls through a backend to avoid exposing it client-side.
  const GEMINI_API_KEY = 'AIzaSyACx37UXHYLpnkMw0wZbWuYKECWU8negfo';
  const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro-latest' }); // Using a capable model

  // Function to call Gemini API for hashtags
  async function generateHashtags() { // Renamed from handleGenerate
    if (!topic.trim()) {
      setError("Please enter a topic or niche to generate hashtags.");
      return;
    }
    setLoading(true);
    setError(null);
    setGroups({ "High Engagement": [], "Trending": [], "Evergreen": [] }); // Clear previous groups

    try {
      // --- Construct the Prompt for Hashtag Generation ---
      // This prompt explicitly asks for grouped hashtags
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
          temperature: 0.7, // Keep it moderate for relevant tags
          maxOutputTokens: 250, // Enough tokens for ~15 hashtags + categories
        },
      });

      const response = await result.response;
      const generatedText = response.text();

      if (generatedText) {
        // --- Complex Parsing for Grouped Hashtags ---
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
            // If the line starts with # and we are in a group context (for multi-line outputs)
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
    generateHashtags(); // Call the Gemini-powered function
    setCopied(false);
  }

  // Ensure topic is not empty before allowing generation
  const isGenerateDisabled = loading || !topic.trim();

  return (
    <div
      className="ch-card" // Assuming this is your card styling class
      style={{
        maxWidth: 490,
        margin: "0 auto",
        borderRadius: 24,
        boxShadow: "var(--shadow-card)",
        padding: 30,
        background: "var(--card-bg,rgba(36,38,50,0.92))",
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
        Hashtag Generator (Gemini AI)
      </div>
      <form
        onSubmit={(e) => { e.preventDefault(); generateHashtags(); }} // Changed onSubmit handler
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
          maxLength={60} // Increased max length for better prompts
          className="ch-search" // Assuming this is your input style class
          style={{
            background: "#181d26",
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
          className="ch-info-btn" // Assuming this is your button style class
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
                      : "var(--card-bg,rgba(43,48,70,0.82))",
                borderRadius: 13,
                padding: "13px 16px 10px 16px",
                boxShadow: "0 2.5px 11px #a178df2a",
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
                  textShadow: groupName === "High Engagement" ? "0 1.5px 9px #58D89A22" : undefined,
                }}
              >
                {groupName}
              </div>
              <div>
                {groups[groupName].length > 0 ? (
                  groups[groupName].map((tag, idx) => (
                    <span
                      key={`${groupName}-${idx}-${tag}`} // Unique key
                      className="ch-card-tag"
                      style={{
                        marginRight: 8,
                        background:
                          groupName === "Trending"
                            ? "var(--accent-gradient)"
                            : groupName === "High Engagement"
                              ? "var(--success-bg)"
                              : "rgba(48,54,81,0.92)",
                        color: groupName === "Trending"
                          ? "#fff"
                          : groupName === "High Engagement"
                            ? "var(--success)"
                            : "var(--text-color)",
                        display: 'inline-block', // Ensure tags wrap correctly
                        marginBottom: '5px', // Spacing between tags if they wrap
                        padding: '4px 8px', // Adjust padding for better look
                        borderRadius: '6px', // Rounded corners for tags
                        fontSize: '.85em', // Smaller font size for tags
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
          className="ch-info-btn"
          style={{
            background: "var(--accent-gradient-focus)",
            color: "#fff",
            fontWeight: 700,
            minWidth: 83,
            boxShadow: "0 1.1px 9px #ce6d8740",
          }}
          onClick={handleCopy}
          disabled={loading || Object.values(groups).flat().length === 0} // Disable if loading or no tags
          aria-label="Copy all hashtags"
        >
          {copied ? "Copied!" : "Copy"}
        </button>
        <button
          type="button"
          className="ch-info-btn"
          style={{
            background: "var(--info-bg)",
            color: "var(--info)",
            fontWeight: 600,
            minWidth: 115,
            boxShadow: "0 1.1px 8px #82C4EC20",
          }}
          onClick={handleRegenerate}
          disabled={isGenerateDisabled} // Use the same disabled logic as generate button
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
  );
}

export default HashtagGenerator;