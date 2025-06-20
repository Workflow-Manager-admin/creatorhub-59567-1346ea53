import React, { useState } from "react";
// Removed: import { GoogleGenerativeAI } from "@google/generative-ai"; // No longer needed for RapidAPI fetch
import Modal from './Modal'; // Import your Modal component

// PUBLIC_INTERFACE
/**
 * HookGenerator - generates engaging video hooks using the Gemini 1.5 Pro API via RapidAPI.
 * This component now also handles its own modal display and acts as the tool card on the dashboard.
 */
function HookGenerator() {
  const [videoTopic, setVideoTopic] = useState("");
  const [platform, setPlatform] = useState("TikTok");
  const [hooks, setHooks] = useState([]); // To store multiple generated hooks
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control this tool's modal

  // --- RapidAPI Configuration (Use your RapidAPI Key here) ---
  // IMPORTANT: Ensure this is your RapidAPI key, NOT your direct Google API key.
  const RAPIDAPI_KEY = '6d105ed8cfmsh977c9a021254071p16d2e4jsndadd8381e47f'; // Your RapidAPI Key
  const RAPIDAPI_HOST = "gemini-2-5-pro.p.rapidapi.com"; // Confirmed working host for Gemini 1.5 Pro via RapidAPI
  const RAPIDAPI_ENDPOINT = `https://${RAPIDAPI_HOST}/`;

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  async function generateHooks() {
    if (!videoTopic.trim()) {
      setError("Please provide a video topic for the hooks.");
      return;
    }
    setLoading(true);
    setError(null);
    setHooks([]); // Clear previous hooks

    try {
      // --- Construct the Prompt for Hook Generation ---
      let prompt = `Generate 5 attention-grabbing video hooks for a "${platform}" video about: "${videoTopic}".
      Make them concise, engaging, and suitable for the platform.
      Each hook should be on a new line, numbered (e.g., "1. Your hook here.").`;

      console.log("Sending prompt to Gemini 1.5 Pro (via RapidAPI) for hooks:", prompt);

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
          // temperature and maxOutputTokens are omitted from here,
          // as per previous debugging for ContentIdeaGenerator to avoid 500 errors.
          // The RapidAPI proxy will use its default generation settings.
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
      console.log("Raw API Response Text (Hooks):", responseText);

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
      
      console.log("Parsed API Data (Hooks):", data);

      let generatedText = '';
      if (data?.candidate?.content?.parts?.[0]?.text) {
        generatedText = data.candidate.content.parts[0].text.trim();
      } else if (data?.choices?.[0]?.message?.content) {
        generatedText = data.choices[0].message.content.trim();
      } else if (data?.error) {
        setError(`Gemini 1.5 Pro API error: ${data.error.message || "Unknown error"}. Check API response in console for details.`);
        console.error("Gemini 1.5 Pro API returned an error object:", data.error);
      }

      console.log("Extracted generatedText (Hooks):", generatedText);

      if (generatedText) {
        // Split hooks by new line and clean them up (remove numbering/bullets)
        const parsedHooks = generatedText
          .split('\n')
          .map(line => line.replace(/^\d+\.\s*|-\s*|\*\s*/, '').trim()) // Remove common list prefixes
          .filter(line => line.length > 5); // Basic filter for valid hooks (min length to avoid empty strings)

        if (parsedHooks.length === 0) {
            setError("The API generated text, but no distinct hooks could be parsed. Try regenerating or adjusting your prompt.");
        }
        setHooks(parsedHooks);
      } else {
        setHooks([]);
        setError("No hooks were generated. Please try again with a different topic.");
      }
    } catch (err) {
      console.error('Network/API error generating hooks with Gemini API:', err);
      setError(`Failed to generate hooks: ${err.message || 'An unknown network error occurred.'}`);
    } finally {
      setLoading(false);
    }
  }

  function handleCopyAllHooks() {
    const allHooksText = hooks.join('\n\n'); // Join with double newline for readability
    if (allHooksText) {
      navigator.clipboard.writeText(allHooksText).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1100);
      }).catch(err => {
        console.error("Failed to copy hooks:", err);
        setError("Failed to copy hooks to clipboard.");
      });
    }
  }

  function handleRegenerate() {
    generateHooks();
    setCopied(false);
  }

  const isGenerateDisabled = loading || !videoTopic.trim();

  return (
    <div className="tool-card" onClick={openModal}>
      <h4 className="tool-title">Hook Generator</h4>
      <p className="tool-description">Generate attention-grabbing video hooks.</p>
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
      <div className="info-icon" onClick={(e) => { e.stopPropagation(); alert('Hook Generator Info: Creates compelling opening lines for your videos to capture viewer attention immediately.'); }}>
        ⓘ
      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal} title="Video Hook Generator (Gemini AI)">
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
            Video Hook Generator (Gemini AI)
          </div>
          <form
            onSubmit={(e) => { e.preventDefault(); generateHooks(); }}
            style={{ display: "flex", flexDirection: "column", gap: 13, marginBottom: 14 }}
          >
            <label htmlFor="video-topic" style={{ fontSize: ".98em", color: "var(--text-secondary)" }}>
              Video Topic:
            </label>
            <input
              id="video-topic"
              type="text"
              value={videoTopic}
              placeholder="e.g., How to get fit at home, Best travel hacks for budget travelers"
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
              onChange={(e) => setVideoTopic(e.target.value)}
            />

            <label htmlFor="hook-platform" style={{ fontSize: ".98em", color: "var(--text-secondary)" }}>
              Select Platform:
            </label>
            <select
              id="hook-platform"
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              className="ch-search input"
              style={{
                background: "#181d26",
                color: "var(--text-color)",
                border: "1.2px solid var(--border-color)",
                borderRadius: 15,
                fontSize: ".98em",
                fontWeight: 500,
                padding: "10px 16px",
                appearance: 'none',
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='%23A178DF' class='bi bi-chevron-down' viewBox='0 0 16 16'%3E%3Cpath fill-rule='evenodd' d='M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z'/%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 12px center',
                paddingRight: '30px',
              }}
            >
              <option value="TikTok">TikTok</option>
              <option value="YouTube Shorts">YouTube Shorts</option>
              <option value="Instagram Reels">Instagram Reels</option>
              <option value="General Video">General Video</option>
              <option value="YouTube Long-form">YouTube Long-form</option> {/* Added a long-form option */}
            </select>

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
              {loading ? "Generating..." : "Generate Hooks"}
            </button>
          </form>

          {error && <div style={{ color: "var(--danger)", margin: "8px 0" }}>{error}</div>}

          <div>
            {loading ? (
              <div className="ch-loader" style={{ marginTop: 12, marginBottom: 15 }}>Generating hooks...</div>
            ) : (
              hooks.length > 0 && (
                <>
                  <div style={{ fontSize: ".98em", color: "var(--text-secondary)", marginBottom: 10 }}>
                    Generated Hooks:
                  </div>
                  {hooks.map((hook, index) => (
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
                      {hook}
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
              onClick={handleCopyAllHooks}
              disabled={loading || hooks.length === 0}
              aria-label="Copy all hooks"
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
              aria-label="Regenerate hooks"
            >
              Regenerate
            </button>
          </div>
          <div style={{ fontSize: ".93em", color: "var(--text-secondary)", marginTop: 16 }}>
            Compelling hooks crafted to grab your audience's attention.
          </div>
          <div style={{ fontSize: ".89em", color: "var(--success)", marginTop: 5, fontWeight: 500 }}>
            Pro tip: Test different hooks to see what resonates most with your viewers!
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default HookGenerator;