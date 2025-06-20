import React, { useState } from "react";
import Modal from './Modal'; // Import your Modal component

// PUBLIC_INTERFACE
/**
 * ContentIdeaGenerator - generates content ideas using the Gemini 1.5 Pro API via RapidAPI.
 * This component now also handles its own modal display and acts as the tool card on the dashboard.
 */
function ContentIdeaGenerator() {
  const [niche, setNiche] = useState("");
  const [audience, setAudience] = useState("");
  const [contentIdeas, setContentIdeas] = useState([]); // Changed to an array to store individual ideas
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

  async function generateContentIdeas() {
    if (!niche.trim() || !audience.trim()) {
      setError("Please enter both a niche and your target audience.");
      return;
    }
    setLoading(true);
    setError(null);
    setContentIdeas([]); // Clear previous ideas

    try {
      const prompt = `Generate 5 unique content ideas for a "${niche}" niche, targeting a "${audience}" audience.
                      Provide each idea on a new line, numbered (e.g., "1. Idea title - Short description.").`;

      console.log("Sending prompt to Gemini 1.5 Pro (via RapidAPI) for content ideas:", prompt);

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
        setError(`Failed to generate ideas: ${errorMessage}`);
        return;
      }

      const responseText = await response.text();
      console.log("Raw API Response Text (Content Ideas):", responseText);

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
      
      console.log("Parsed API Data (Content Ideas):", data);

      let generatedText = '';
      if (data?.candidate?.content?.parts?.[0]?.text) {
        generatedText = data.candidate.content.parts[0].text.trim();
      } else if (data?.choices?.[0]?.message?.content) {
        generatedText = data.choices[0].message.content.trim();
      } else if (data?.error) {
        setError(`Gemini 1.5 Pro API error: ${data.error.message || "Unknown error"}. Check API response in console for details.`);
        console.error("Gemini 1.5 Pro API returned an error object:", data.error);
      }

      console.log("Extracted generatedText (Content Ideas):", generatedText);

      if (generatedText) {
        // Split ideas by new line and clean them up
        const newIdeas = generatedText
          .split('\n')
          .map(line => line.trim())
          .filter(line => line.length > 0 && !/^\d+\.\s*$/.test(line)) // Filter out empty lines and just numbers
          .map(line => line.replace(/^\d+\.\s*/, '')); // Remove numbering (e.g., "1. ")

        if (newIdeas.length === 0) {
            setError("The API generated text, but no distinct content ideas could be parsed. Try regenerating or adjusting your prompt.");
        }
        setContentIdeas(newIdeas);
      } else {
        setContentIdeas([]);
        setError("No content ideas were generated. Please try again.");
      }
    } catch (err) {
      console.error('Error generating content ideas with Gemini API:', err);
      setError(`Failed to generate content ideas: ${err.message || 'An unknown error occurred.'}`);
    } finally {
      setLoading(false);
    }
  }

  function handleCopyAllIdeas() {
    const allIdeasText = contentIdeas.join('\n\n'); // Join with double newline for readability
    if (allIdeasText) {
      navigator.clipboard.writeText(allIdeasText).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1100);
      }).catch(err => {
        console.error("Failed to copy ideas:", err);
        setError("Failed to copy ideas to clipboard.");
      });
    }
  }

  function handleRegenerate() {
    generateContentIdeas();
    setCopied(false);
  }

  const isGenerateDisabled = loading || !niche.trim() || !audience.trim();

  return (
    <div className="tool-card" onClick={openModal}>
      <h4 className="tool-title">Content Idea Generator</h4>
      <p className="tool-description">Brainstorm fresh content ideas for any niche.</p>
      <button
        className="open-tool-button"
        onClick={(e) => {
          e.stopPropagation(); // Prevents the div's onClick from firing
          openModal();
        }}
      >
        Open Tool
      </button>
      <div className="info-icon" onClick={(e) => { e.stopPropagation(); alert('Content Idea Generator Info: Provides creative content ideas tailored to your niche and target audience.'); }}>
        ⓘ
      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal} title="Content Idea Generator (Gemini AI)">
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
            Content Idea Generator (Gemini AI)
          </div>
          <form
            onSubmit={(e) => { e.preventDefault(); generateContentIdeas(); }}
            style={{ display: "flex", flexDirection: "column", gap: 13, marginBottom: 14 }}
          >
            <label htmlFor="content-niche" style={{ fontSize: ".98em", color: "var(--text-secondary)" }}>
              Enter your niche:
            </label>
            <input
              id="content-niche"
              type="text"
              value={niche}
              placeholder="e.g. Sustainable fashion, AI ethics, Vegan cooking"
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
              onChange={(e) => setNiche(e.target.value)}
            />

            <label htmlFor="content-audience" style={{ fontSize: ".98em", color: "var(--text-secondary)" }}>
              Target Audience:
            </label>
            <input
              id="content-audience"
              type="text"
              value={audience}
              placeholder="e.g. Gen Z, small business owners, new parents"
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
              onChange={(e) => setAudience(e.target.value)}
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
              <div className="ch-loader" style={{ marginTop: 12, marginBottom: 15 }}>Generating ideas...</div>
            ) : (
              contentIdeas.length > 0 && (
                <>
                  <div style={{ fontSize: ".98em", color: "var(--text-secondary)", marginBottom: 10 }}>
                    Generated Content Ideas:
                  </div>
                  {contentIdeas.map((idea, index) => (
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
                      {idea}
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
              onClick={handleCopyAllIdeas}
              disabled={loading || contentIdeas.length === 0}
              aria-label="Copy all content ideas"
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
              aria-label="Regenerate content ideas"
            >
              Regenerate
            </button>
          </div>
          <div style={{ fontSize: ".93em", color: "var(--text-secondary)", marginTop: 16 }}>
            Fresh content ideas tailored to your niche and audience.
          </div>
          <div style={{ fontSize: ".89em", color: "var(--success)", marginTop: 5, fontWeight: 500 }}>
            Pro tip: Develop a content calendar based on your favorite ideas!
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default ContentIdeaGenerator;