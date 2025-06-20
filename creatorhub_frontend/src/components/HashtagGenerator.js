import React, { useState } from "react";
import Modal from './Modal';

// PUBLIC_INTERFACE
/**
 * HashtagGenerator - generates grouped hashtags using the Gemini 1.5 Pro API via RapidAPI.
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
  const [isModalOpen, setIsModalOpen] = useState(false);

  // --- RapidAPI Configuration (Use your RapidAPI Key here) ---
  // IMPORTANT: Ensure this is your RapidAPI key, NOT your direct Google API key.
  const RAPIDAPI_KEY = '6d105ed8cfmsh977c9a021254071p16d2e4jsndadd8381e47f'; // Your RapidAPI Key
  const RAPIDAPI_HOST = "gemini-2-5-pro.p.rapidapi.com";
  const RAPIDAPI_ENDPOINT = `https://${RAPIDAPI_HOST}/`;

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

      console.log("Sending prompt to Gemini 1.5 Pro (via RapidAPI):", prompt);

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

        if (response.status === 429) {
          setError("Rate limit exceeded. Please wait and try again after a few moments.");
        } else if (response.status === 403 || response.status === 401) {
          setError(`Authentication error: Invalid RapidAPI key or subscription. Details: ${errorMessage}`);
        } else if (response.status === 400) {
          setError(`Bad request: The API expected a different input format or has a validation error. Details: ${errorMessage}`);
        } else if (response.status === 500) {
          setError(`Server error (500): The API encountered an internal problem. Details: ${errorMessage}. Please try again later.`);
        } else {
          setError(`Server error: ${errorMessage}`);
        }
        return;
      }

      const responseText = await response.text();
      console.log("Raw API Response Text:", responseText); // Debugging: See the raw response

      if (!responseText || responseText.trim().length < 5) {
          console.error("RapidAPI returned a 200 OK but with an empty or extremely minimal response body:", responseText);
          setError("RapidAPI responded with an empty or invalid response. This might indicate a server-side issue. Please double-check your RapidAPI subscription details.");
          setLoading(false);
          return;
      }

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (jsonParseError) {
        console.error("Failed to parse RapidAPI response as JSON:", responseText, jsonParseError);
        setError("Received an invalid response from RapidAPI (not valid JSON). Please check your RapidAPI subscription or contact support.");
        setLoading(false);
        return;
      }
      
      console.log("Parsed API Data (from Gemini 1.5 Pro via RapidAPI):", data);

      let generatedText = '';
      if (data?.candidate?.content?.parts?.[0]?.text) {
        generatedText = data.candidate.content.parts[0].text.trim();
      } else if (data?.choices?.[0]?.message?.content) { // Fallback for other common LLM API formats
        generatedText = data.choices[0].message.content.trim();
      } else if (data?.error) {
        setError(`Gemini 1.5 Pro API error: ${data.error.message || "Unknown error"}. Check API response in console for details.`);
        console.error("Gemini 1.5 Pro API returned an error object:", data.error);
      }

      console.log("Extracted generatedText:", generatedText); // Debugging: See the final text to be parsed

      if (generatedText) {
        const newGroups = {
          "High Engagement": [],
          "Trending": [],
          "Evergreen": [],
        };

        const lines = generatedText.split('\n').map(line => line.trim()).filter(line => line.length > 0);
        console.log("Lines after splitting and trimming:", lines); // Debugging: See individual lines

        let currentGroup = "";
        const hashtagRegex = /#\w+/g; // Matches # followed by one or more word characters

        lines.forEach(line => {
          const lowerLine = line.toLowerCase();
          if (lowerLine.includes("high engagement")) { // Use includes for more flexibility
            currentGroup = "High Engagement";
          } else if (lowerLine.includes("trending")) { // Use includes for more flexibility
            currentGroup = "Trending";
          } else if (lowerLine.includes("evergreen")) { // Use includes for more flexibility
            currentGroup = "Evergreen";
          }

          // Extract all hashtags from the current line using regex
          const foundHashtags = line.match(hashtagRegex);
          if (foundHashtags && currentGroup) {
            // Filter out empty or too short tags, and add them to the current group
            newGroups[currentGroup].push(...foundHashtags.filter(tag => tag.length > 1));
          }
        });

        // Remove duplicates within each group if any
        newGroups["High Engagement"] = [...new Set(newGroups["High Engagement"])];
        newGroups["Trending"] = [...new Set(newGroups["Trending"])];
        newGroups["Evergreen"] = [...new Set(newGroups["Evergreen"])];

        setGroups(newGroups);
        console.log("Final newGroups before setting state:", newGroups); // Debugging: See the structured groups

        // Add a check if no hashtags were actually generated/parsed
        if (Object.values(newGroups).flat().length === 0) {
            setError("The API returned a response, but no hashtags could be parsed from it. The format might be unexpected. Please try regenerating or refining your topic.");
        }

      } else {
        setGroups({
          "High Engagement": [],
          "Trending": [],
          "Evergreen": [],
        });
        setError("The API did not return any readable text for hashtags. This might indicate an issue with the API response.");
      }
    } catch (err) {
      console.error('Network/API error generating hashtags with Gemini API:', err);
      setError(`Failed to generate hashtags: ${err.message || 'An unknown network error occurred.'}`);
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
      <div className="info-icon" onClick={(e) => { e.stopPropagation(); alert('Hashtag Generator Info: Provides categorized hashtags for your content.'); }}>
          ⓘ
      </div>

      {/* This is the Modal that opens when the card is clicked */}
      <Modal isOpen={isModalOpen} onClose={closeModal} title="Hashtag Generator (Gemini AI)">
        {/* Content of the modal: your original HashtagGenerator form and results */}
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
            Hashtag Generator (Gemini AI)
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
              onChange={(e) => setTopic(e.target.value)}
            />
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
                    boxShadow: "0 2.5px 11px rgba(161,120,223,0.16)", 
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
                      textShadow: groupName === "High Engagement" ? "0 1.5px 9px rgba(88,216,154,0.13)" : undefined, 
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
                                ? "var(--accent-gradient)" 
                                : groupName === "High Engagement"
                                  ? "var(--success-bg)"
                                  : "rgba(48,54,81,0.92)", 
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
              className="ch-info-btn btn" 
              style={{
                background: "var(--accent-gradient-focus)",
                color: "#fff",
                fontWeight: 700,
                minWidth: 83,
                boxShadow: "0 1.1px 9px rgba(206,109,135,0.25)", 
              }}
              onClick={handleCopy}
              disabled={loading || Object.values(groups).flat().length === 0}
              aria-label="Copy all hashtags"
            >
              {copied ? "Copied!" : "Copy"}
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