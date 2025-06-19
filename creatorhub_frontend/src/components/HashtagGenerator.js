import React, { useState } from "react";

// PUBLIC_INTERFACE
/**
 * HashtagGenerator
 * - Accepts topic/niche text input
 * - Generates grouped hashtags (High Engagement, Trending, Evergreen)
 * - Provides "Copy" and "Regenerate" actions
 * - Uses simple deterministic stub logic for hashtag generation (no API integration)
 * Group styles and card layout native to CreatorHub theme
 */
function HashtagGenerator() {
  const [topic, setTopic] = useState("");
  const [groups, setGroups] = useState(generateDefaultHashtags(""));
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // Hashtag group presets (stub logic can be replaced with Gemini/OpenAI later)
  function generateDefaultHashtags(t) {
    // Normalizes and picks hashtags based on topic; returns {group: [tags]}
    const norm = (t || "").trim().toLowerCase();
    const base = norm.replace(/\s+/g, "");
    // Hardcoded for stub/demo purposes
    return {
      "High Engagement": [
        `#${base || "inspo"}`,
        `#${base ? base + "life" : "contentlife"}`,
        `#${base ? base + "community" : "creators"}`,
        "#viral",
        "#engagement",
      ],
      Trending: [
        "#trendingnow",
        "#explorepage",
        "#foryou",
        `#${base ? "trending" + base : "trendsetters"}`,
        "#featureme",
      ],
      Evergreen: [
        "#motivation",
        "#growth",
        "#mindset",
        "#creativity",
        "#contentcreator",
      ],
    };
  }

  function handleGenerate(e) {
    e && e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setGroups(generateDefaultHashtags(topic));
      setLoading(false);
    }, 600); // Simulate delay
  }

  function handleCopy() {
    // Flattens all tags and copies to clipboard
    const allTags = Object.values(groups).flat().join(" ");
    navigator.clipboard.writeText(allTags).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1100);
    });
  }

  function handleRegenerate() {
    handleGenerate();
    setCopied(false);
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
        Hashtag Generator
      </div>
      <form
        onSubmit={handleGenerate}
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
          maxLength={32}
          className="ch-search"
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
          className="ch-info-btn"
          disabled={loading}
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
                {groups[groupName].map((tag, idx) => (
                  <span
                    key={tag}
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
                          : "var(--text-color)"
                    }}
                  >
                    {tag}
                  </span>
                ))}
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
          disabled={loading}
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
          disabled={loading}
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
