import React, { useState } from "react";

// PUBLIC_INTERFACE
/**
 * CaptionGenerator component
 * Features:
 * - Topic input (text)
 * - Tone selection (dropdown)
 * - Generates 1–3 caption suggestions (local stub logic)
 * - "Copy" and "Regenerate" buttons for each suggestion
 * - All logic local/stub (AI integration later)
 *
 * KAVIA modern card, minimalist, accessible, supports dark/light mode.
 */
const TONES = [
  { value: "friendly", label: "Friendly" },
  { value: "professional", label: "Professional" },
  { value: "funny", label: "Funny" },
  { value: "persuasive", label: "Persuasive" },
];

// Demo/local stub caption generation logic
function generateCaptions(topic, tone) {
  const base =
    (topic || "your brand/message")
      .trim()
      .replace(/^[a-z]/, m => m.toUpperCase());
  let prefix = "";
  switch (tone) {
    case "friendly":
      prefix = "Let's connect! ";
      break;
    case "professional":
      prefix = "Discover insights: ";
      break;
    case "funny":
      prefix = "Did you know? ";
      break;
    case "persuasive":
      prefix = "Don't miss out: ";
      break;
    default:
      prefix = "";
  }
  // Return up to 3 demos
  return [
    `${prefix}${base} — join the conversation!`,
    `${base} is trending. ${
      tone === "funny" ? "😂" : tone === "persuasive" ? "👉" : "✨"
    }`,
    `${prefix}${base}${
      tone === "friendly"
        ? " 😊"
        : tone === "professional"
        ? " 🚀"
        : tone === "funny"
        ? " 😅"
        : " 💡"
    }`,
  ];
}

function CaptionGenerator() {
  const [topic, setTopic] = useState("");
  const [tone, setTone] = useState("friendly");
  const [captions, setCaptions] = useState(generateCaptions("", "friendly"));
  const [loading, setLoading] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState(null);

  function handleGenerate(e) {
    if (e) e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setCaptions(generateCaptions(topic, tone).slice(0, Math.floor(Math.random() * 3) + 1));
      setLoading(false);
      setCopiedIdx(null);
    }, 750);
  }

  function handleCopy(idx) {
    if (captions[idx]) {
      navigator.clipboard.writeText(captions[idx]).then(() => {
        setCopiedIdx(idx);
        setTimeout(() => setCopiedIdx(null), 1100);
      });
    }
  }

  function handleRegenerate() {
    handleGenerate();
    setCopiedIdx(null);
  }

  return (
    <div
      className="ch-card"
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
        Caption Generator
      </div>
      <form
        onSubmit={handleGenerate}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 13,
          marginBottom: 16,
        }}
        aria-label="Caption prompt input"
      >
        <label htmlFor="caption-topic" style={{ fontSize: ".98em", color: "var(--text-secondary)" }}>
          Topic or keyword:
        </label>
        <input
          id="caption-topic"
          type="text"
          value={topic}
          placeholder="e.g. Summer sale, AI, Motivation"
          maxLength={40}
          className="ch-search"
          style={{
            background: "#181d26",
            color: "var(--text-color)",
            border: "1.2px solid var(--border-color)",
            borderRadius: 15,
            fontSize: ".99em",
            fontWeight: 500,
            padding: "10px 16px",
          }}
          onChange={e => setTopic(e.target.value)}
        />
        <label htmlFor="caption-tone" style={{ fontSize: ".98em", color: "var(--text-secondary)", marginTop: 2 }}>
          Pick a tone:
        </label>
        <select
          id="caption-tone"
          value={tone}
          className="ch-search"
          style={{
            background: "#242b46",
            color: "var(--accent)",
            fontWeight: 600,
            fontSize: "1em",
            border: "1.2px solid var(--border-color)",
            borderRadius: 15,
            padding: "8px 10px",
            marginBottom: 2,
            maxWidth: 220,
          }}
          onChange={e => setTone(e.target.value)}
        >
          {TONES.map(t => (
            <option value={t.value} key={t.value}>{t.label}</option>
          ))}
        </select>
        <button
          type="submit"
          className="ch-info-btn"
          disabled={loading}
          style={{
            marginTop: 6,
            fontWeight: 700,
            alignSelf: "flex-start",
            minWidth: 98,
            background: "var(--accent-gradient)",
            color: "#fff",
          }}
        >
          {loading ? "Generating…" : "Generate"}
        </button>
      </form>
      <div>
        {loading ? (
          <div className="ch-loader" style={{ margin: "17px 0 14px 0" }}>
            Generating captions…
          </div>
        ) : (
          captions && captions.length > 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 15 }}>
              {captions.map((cap, idx) => (
                <div
                  key={idx}
                  style={{
                    background: "var(--info-bg)",
                    color: "var(--info)",
                    borderRadius: 13,
                    padding: "14px 15px 13px",
                    marginBottom: 0,
                    boxShadow: "0 2.5px 11px #82C4EC2c",
                    position: "relative",
                  }}
                >
                  <div style={{ fontWeight: 600, fontSize: "1.04em", color: "var(--text-color)", marginBottom: 7 }}>
                    Suggestion {idx + 1}
                  </div>
                  <div style={{
                    fontWeight: 500, fontSize: "1.10em", color: "var(--accent)", marginBottom: 11
                  }}>
                    {cap}
                  </div>
                  <div style={{ display: "flex", gap: 9 }}>
                    <button
                      type="button"
                      className="ch-info-btn"
                      onClick={() => handleCopy(idx)}
                      style={{
                        background: "var(--accent-gradient-focus)",
                        color: "#fff",
                        fontWeight: 700,
                        minWidth: 72,
                        boxShadow: "0 1.1px 7px #ce6d8740",
                      }}
                      aria-label={`Copy caption ${idx + 1}`}
                    >
                      {copiedIdx === idx ? "Copied!" : "Copy"}
                    </button>
                    <button
                      type="button"
                      className="ch-info-btn"
                      style={{
                        background: "var(--info-bg)",
                        color: "var(--info)",
                        fontWeight: 600,
                        minWidth: 108,
                        boxShadow: "0 1.1px 6px #82C4EC20",
                      }}
                      onClick={handleRegenerate}
                      disabled={loading}
                      aria-label="Regenerate captions"
                    >
                      Regenerate
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )
        )}
      </div>
      <div style={{ fontSize: ".98em", color: "var(--text-secondary)", marginTop: 19 }}>
        1–3 caption suggestions. You can copy or regenerate each time for new ideas.
      </div>
      <div style={{ fontSize: ".92em", color: "var(--success)", marginTop: 5, fontWeight: 500 }}>
        Pro tip: Pair a catchy caption with hashtags for best engagement!
      </div>
    </div>
  );
}

export default CaptionGenerator;
