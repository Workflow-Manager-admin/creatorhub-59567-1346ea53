import React, { useState } from "react";
import Modal from './Modal'; // Import your Modal component

// PUBLIC_INTERFACE
/**
 * CaptionGenerator - generates social media captions using the Gemini 1.5 Pro API via RapidAPI.
 * This component now also handles its own modal display and acts as the tool card on the dashboard.
 */
function CaptionGenerator() {
  const [promptInput, setPromptInput] = useState("");
  const [tone, setTone] = useState("creative"); // Default tone
  const [captions, setCaptions] = useState([]); // Changed to an array to store individual captions
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control this tool's modal

  // --- RapidAPI Configuration ---
  const RAPIDAPI_KEY = '6d105ed8cfmsh977c9a021254071p16d2e4jsndadd8381e47f'; // Your RapidAPI Key
  const RAPIDAPI_HOST = "gemini-2-5-pro.p.rapidapi.com";
  const RAPIDAPI_ENDPOINT = `https://${RAPIDAPI_HOST}/`;

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  async function generateCaptions() {
    if (!promptInput.trim()) {
      setError("Please describe your post or product to generate captions.");
      return;
    }
    setLoading(true);
    setError(null);
    setCaptions([]); // Clear previous captions

    try {
      const prompt = `Generate 5 social media captions for a post about "${promptInput}".
                      The tone should be ${tone}.
                      Each caption should be on a new line, numbered (e.g., "1. Your caption here.").`;

      console.log("Sending prompt to Gemini 1.5 Pro (via RapidAPI) for captions:", prompt);

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
        setError(`Failed to generate captions: ${errorMessage}`);
        return;
      }

      const responseText = await response.text();
      console.log("Raw API Response Text (Captions):", responseText);

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
      
      console.log("Parsed API Data (Captions):", data);

      let generatedText = '';
      if (data?.candidate?.content?.parts?.[0]?.text) {
        generatedText = data.candidate.content.parts[0].text.trim();
      } else if (data?.choices?.[0]?.message?.content) {
        generatedText = data.choices[0].message.content.trim();
      } else if (data?.error) {
        setError(`Gemini 1.5 Pro API error: ${data.error.message || "Unknown error"}. Check API response in console for details.`);
        console.error("Gemini 1.5 Pro API returned an error object:", data.error);
      }

      console.log("Extracted generatedText (Captions):", generatedText);

      if (generatedText) {
        // Split captions by new line and clean them up
        const newCaptions = generatedText
          .split('\n')
          .map(line => line.trim())
          .filter(line => line.length > 0 && !/^\d+\.\s*$/.test(line)) // Filter out empty lines and just numbers
          .map(line => line.replace(/^\d+\.\s*/, '')); // Remove numbering (e.g., "1. ")

        if (newCaptions.length === 0) {
            setError("The API generated text, but no distinct captions could be parsed. Try regenerating or adjusting your prompt.");
        }
        setCaptions(newCaptions);
      } else {
        setCaptions([]);
        setError("No captions were generated. Please try again.");
      }
    } catch (err) {
      console.error('Error generating captions with Gemini API:', err);
      setError(`Failed to generate captions: ${err.message || 'An unknown error occurred.'}`);
    } finally {
      setLoading(false);
    }
  }

  function handleCopyAllCaptions() {
    const allCaptionsText = captions.join('\n\n'); // Join with double newline for readability
    if (allCaptionsText) {
      navigator.clipboard.writeText(allCaptionsText).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1100);
      }).catch(err => {
        console.error("Failed to copy captions:", err);
        setError("Failed to copy captions to clipboard.");
      });
    }
  }

  function handleRegenerate() {
    generateCaptions();
    setCopied(false);
  }

  const isGenerateDisabled = loading || !promptInput.trim();

  return (
    <div className="tool-card" onClick={openModal}>
      <h4 className="tool-title">Caption Generator</h4>
      <p className="tool-description">Generate engaging social media captions.</p>
      <button
        className="open-tool-button"
        onClick={(e) => {
          e.stopPropagation(); // Prevents the div's onClick from firing
          openModal();
        }}
      >
        Open Tool
      </button>
      <div className="info-icon" onClick={(e) => { e.stopPropagation(); alert('Caption Generator Info: Creates engaging captions for your social media posts based on your input and desired tone.'); }}>
        ⓘ
      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal} title="Caption Generator (Gemini AI)">
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
            Caption Generator (Gemini AI)
          </div>
          <form
            onSubmit={(e) => { e.preventDefault(); generateCaptions(); }}
            style={{ display: "flex", flexDirection: "column", gap: 13, marginBottom: 14 }}
          >
            <label htmlFor="caption-prompt" style={{ fontSize: ".98em", color: "var(--text-secondary)" }}>
              Describe your post or product:
            </label>
            <input
              id="caption-prompt"
              type="text"
              value={promptInput}
              placeholder="e.g. New coffee blend, sunset beach photo, workout routine"
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
              onChange={(e) => setPromptInput(e.target.value)}
            />

            <label htmlFor="caption-tone" style={{ fontSize: ".98em", color: "var(--text-secondary)" }}>
              Choose a tone:
            </label>
            <select
              id="caption-tone"
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              className="ch-search input" // Reusing input styling for consistency
              style={{
                background: "#181d26",
                color: "var(--text-color)",
                border: "1.2px solid var(--border-color)",
                borderRadius: 15,
                fontSize: ".98em",
                fontWeight: 500,
                padding: "10px 16px",
                appearance: 'none', // Remove default select arrow
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='%23A178DF' class='bi bi-chevron-down' viewBox='0 0 16 16'%3E%3Cpath fill-rule='evenodd' d='M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z'/%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 12px center',
                paddingRight: '30px', // Make space for the arrow
              }}
            >
              <option value="creative">Creative</option>
              <option value="professional">Professional</option>
              <option value="funny">Funny</option>
              <option value="inspirational">Inspirational</option>
              <option value="informative">Informative</option>
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
              {loading ? "Generating..." : "Generate"}
            </button>
          </form>

          {error && <div style={{ color: "var(--danger)", margin: "8px 0" }}>{error}</div>}

          <div>
            {loading ? (
              <div className="ch-loader" style={{ marginTop: 12, marginBottom: 15 }}>Generating captions...</div>
            ) : (
              captions.length > 0 && (
                <>
                  <div style={{ fontSize: ".98em", color: "var(--text-secondary)", marginBottom: 10 }}>
                    Generated Captions:
                  </div>
                  {captions.map((cap, index) => (
                    <div
                      key={index}
                      style={{
                        marginBottom: 10,
                        background: "var(--card-bg, rgba(43,48,70,0.82))", // Use a generic background
                        borderRadius: 13,
                        padding: "13px 16px",
                        boxShadow: "0 2.5px 11px rgba(161,120,223,0.16)",
                        fontSize: ".95em",
                        color: "var(--text-color)",
                      }}
                    >
                      {cap}
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
              onClick={handleCopyAllCaptions}
              disabled={loading || captions.length === 0}
              aria-label="Copy all captions"
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
              aria-label="Regenerate captions"
            >
              Regenerate
            </button>
          </div>
          <div style={{ fontSize: ".93em", color: "var(--text-secondary)", marginTop: 16 }}>
            Captions generated for your social media posts. Click "Copy All" to save them.
          </div>
          <div style={{ fontSize: ".89em", color: "var(--success)", marginTop: 5, fontWeight: 500 }}>
            Pro tip: Select the best fit or mix and match for optimal engagement!
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default CaptionGenerator;