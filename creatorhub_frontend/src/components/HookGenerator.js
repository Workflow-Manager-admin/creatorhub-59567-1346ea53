import React, { useState } from "react";

// PUBLIC_INTERFACE
/**
 * HookGenerator component
 * Features:
 * - Content Type dropdown (Reels, Shorts, TikTok, Twitter/X, Podcast, Blog)
 * - Generates 3-5 engaging hook/first lines (local stub logic)
 * - "Copy" and "Use in Caption" buttons for each suggestion
 * - Modern card UI, accessible, theme-matching
 * - Uses deterministic local stub (not API) for line generation
 */

const CONTENT_TYPES = [
  { value: "reels", label: "Instagram Reels" },
  { value: "shorts", label: "YouTube Shorts" },
  { value: "tiktok", label: "TikTok Video" },
  { value: "twitter", label: "Twitter/X Post" },
  { value: "podcast", label: "Podcast" },
  { value: "blog", label: "Blog" }
];

// Demo stub logic: Generates hooks based on content type for demo
function generateHooks(contentType) {
  const name = (CONTENT_TYPES.find(c => c.value === contentType)?.label || "Content").replace(/^./, m => m.toUpperCase());
  const demoLines = {
    reels: [
      "Stop scrolling: This could change your day!",
      "Here's what nobody told you about success…",
      "Wait for it—something crazy happens at the end!",
      "Unlock your creative side in 10 seconds.",
      "If you're a creator, you NEED to see this!"
    ],
    shorts: [
      "You won't believe this: [Reveal] in 10 seconds!",
      "Here's a shortcut for instant results.",
      "Stay till the end for a big surprise.",
      "Learning made fun—watch this!",
      "This 1 trick blew my mind!"
    ],
    tiktok: [
      "Ready to have your mind blown?",
      "I tried this so you don’t have to!",
      "POV: You’re about to learn something wild.",
      "Before you scroll, listen to THIS.",
      "Get comfy—this is binge-worthy!"
    ],
    twitter: [
      "Hot take: Everyone’s missing THIS.",
      "I was today years old when I learned…",
      "🧵 Here’s a story you won’t wanna miss:",
      "What if I told you success is simpler than you think?",
      "3 hard truths nobody told me…"
    ],
    podcast: [
      "Stay tuned for today’s jaw-dropping insight.",
      "Let's bust the biggest myth in our industry.",
      "Our guest's story starts with a single unexpected moment…",
      "You’re one conversation away from breakthrough.",
      "Turn up the volume—this is gold."
    ],
    blog: [
      "Everything you know about X is about to change.",
      "This 5-step guide will save you hours.",
      "What if you could double your results with half the effort?",
      "Start here if you want real answers.",
      "The key lesson I wish I’d learned sooner."
    ]
  };
  if (demoLines[contentType]) {
    // Shuffle and pick 3–5 items randomly
    let lines = [...demoLines[contentType]];
    // Shuffle array simple algorithm
    for (let i = lines.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [lines[i], lines[j]] = [lines[j], lines[i]];
    }
    const n = 3 + Math.floor(Math.random() * 3); // 3–5
    return lines.slice(0, n);
  }
  // Fallback: generic
  return [
    `Grab attention fast in your next ${name}!`,
    `This is not your average ${name.toLowerCase()}…`,
    `Want results? Start with this hook.`,
    `Ever wondered how top creators open? Now you know!`
  ];
}

function HookGenerator({ onUseInCaption }) {
  const [contentType, setContentType] = useState("reels");
  const [hooks, setHooks] = useState(generateHooks("reels"));
  const [loading, setLoading] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState(null);

  function handleGenerate(e) {
    if (e) e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setHooks(generateHooks(contentType));
      setLoading(false);
      setCopiedIdx(null);
    }, 700);
  }

  function handleCopy(idx) {
    if (hooks[idx]) {
      navigator.clipboard.writeText(hooks[idx]).then(() => {
        setCopiedIdx(idx);
        setTimeout(() => setCopiedIdx(null), 1100);
      });
    }
  }

  function handleUse(idx) {
    // Allow parent to access the selected hook (if provided), e.g. for caption prefilling
    if (onUseInCaption && hooks[idx]) {
      onUseInCaption(hooks[idx]);
    }
  }

  return (
    <div
      className="ch-card"
      style={{
        maxWidth: 510,
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
          fontSize: "1.23em",
          marginBottom: 13,
          color: "var(--accent,#A178DF)",
          textShadow: "0 2px 11px #a178df1b",
        }}
      >
        Hook Generator
      </div>
      <form
        onSubmit={handleGenerate}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 13,
          marginBottom: 15,
        }}
        aria-label="Hook generation input"
      >
        <label htmlFor="hook-content-type" style={{ fontSize: ".98em", color: "var(--text-secondary)" }}>
          Content type:
        </label>
        <select
          id="hook-content-type"
          value={contentType}
          className="ch-search"
          style={{
            background: "#242b46",
            color: "var(--accent)",
            fontWeight: 600,
            fontSize: "1em",
            border: "1.2px solid var(--border-color)",
            borderRadius: 15,
            padding: "9px 10px",
            marginBottom: 4,
            maxWidth: 260,
          }}
          onChange={e => setContentType(e.target.value)}
        >
          {CONTENT_TYPES.map(t => (
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
            minWidth: 97,
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
            Generating hooks…
          </div>
        ) : (
          hooks && hooks.length > 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 15 }}>
              {hooks.map((line, idx) => (
                <div
                  key={idx}
                  style={{
                    background: "var(--success-bg)",
                    color: "var(--success)",
                    borderRadius: 13,
                    padding: "13px 15px 10px",
                    boxShadow: "0 2.5px 10px #58D89A19",
                    position: "relative",
                  }}
                >
                  <div style={{ fontWeight: 600, fontSize: "1.02em", color: "var(--text-color)", marginBottom: 7 }}>
                    Hook {idx + 1}
                  </div>
                  <div style={{
                    fontWeight: 500, fontSize: "1.13em", color: "var(--accent)", marginBottom: 9
                  }}>
                    {line}
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
                      aria-label={`Copy hook ${idx + 1}`}
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
                        minWidth: 134,
                        boxShadow: "0 1.1px 7px #82C4EC20",
                      }}
                      onClick={() => handleUse(idx)}
                      aria-label={`Use this hook in caption`}
                    >
                      Use in Caption
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )
        )}
      </div>
      <div style={{ fontSize: ".98em", color: "var(--text-secondary)", marginTop: 17 }}>
        3–5 hooks for engaging first lines. "Use in Caption" lets you insert it directly.
      </div>
      <div style={{ fontSize: ".91em", color: "var(--success)", marginTop: 5, fontWeight: 500 }}>
        Pro tip: A strong hook = more watch time!
      </div>
    </div>
  );
}

export default HookGenerator;
