import React, { useState } from "react";
import HashtagGenerator from "./HashtagGenerator";
import CaptionGenerator from "./CaptionGenerator";
import ContentIdeaGenerator from "./ContentIdeaGenerator";
import HookGenerator from "./HookGenerator";
import PostPlanner from "./PostPlanner";

// PUBLIC_INTERFACE
/**
 * ToolsPage - Shows suite of creator tools as modern cards, matching palette.
 * Integrates Hashtag, Caption, Hook, Content Idea Generators, and Post Planner.
 */
function ToolsPage() {
  // control which tool is open in modal, or show all grid as cards
  const [modalTool, setModalTool] = useState(null);

  // Simple mapping of tool keys to UI and descriptions
  const tools = [
    {
      key: "hashtag",
      title: "Hashtag Generator",
      desc: "Suggested hashtags grouped for engagement, trending, evergreen. Tailor for your topic.",
      accent: "tool",
      render: () => <HashtagGenerator />,
    },
    {
      key: "caption",
      title: "Caption Generator",
      desc: "AI-inspired captions–pick a tone and get fresh ideas for your posts.",
      accent: "tool",
      render: () => <CaptionGenerator />,
    },
    {
      key: "hook",
      title: "Hook Generator",
      desc: "First-line 'hooks' to boost attention for Reels, Shorts, TikToks, and more.",
      accent: "tool",
      render: () => <HookGenerator />,
    },
    {
      key: "idea",
      title: "Content Idea Generator",
      desc: "Generate content ideas for your niche. Save and favorite the ones you love.",
      accent: "tool",
      render: () => <ContentIdeaGenerator />,
    },
    {
      key: "planner",
      title: "Post Planner",
      desc: "Organize, tag, and schedule your content ideas. Move from 'idea' to 'posted'.",
      accent: "tool",
      render: () => <PostPlanner />,
    },
  ];

  // Card layout for each tool (click to expand in modal), except PostPlanner--always expanded below
  return (
    <section
      style={{
        width: "100%",
        minHeight: "80vh",
        margin: "0 auto",
        padding: "0 0 30px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <div
        className="title"
        style={{
          fontSize: "2.35em",
          fontWeight: 800,
          letterSpacing: "-0.02em",
          marginBottom: 13,
          color: "var(--accent)",
          textShadow: "0 2px 28px #ce6d8729",
        }}
      >
        Creator Tools
      </div>
      <div
        className="description"
        style={{
          color: "var(--text-secondary)",
          fontSize: "1.16em",
          marginBottom: 11,
          textAlign: "center",
          maxWidth: 610,
        }}
      >
        Tools to accelerate your content journey.<br />
        Try hashtag, caption, hook, idea generation, and organize everything with the Post Planner.
      </div>

      {/* Tool Cards Grid */}
      <div
        className="dashboard-tool-card-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(330px,1fr))",
          gap: 33,
          width: "100%",
          maxWidth: 1020,
          margin: "19px auto 0",
          marginBottom: 34,
        }}
      >
        {tools.map((tool, idx) =>
          tool.key !== "planner" ? (
            <div
              tabIndex={0}
              key={tool.key}
              className="ch-card"
              style={{
                minHeight: 180,
                cursor: "pointer",
                outline: "none",
                borderRadius: 28,
                boxShadow: "var(--shadow-card)",
                position: "relative",
                background: "var(--card-bg,rgba(44,48,80,0.9))",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                transition: "box-shadow .16s, transform .17s, background .21s",
              }}
              onClick={() => setModalTool(tool.key)}
              onKeyDown={e => {
                if (e.key === "Enter" || e.key === " ") setModalTool(tool.key);
              }}
              aria-label={`${tool.title} (open tool)`}
            >
              <div style={{ display: "flex", flexDirection: "column" }}>
                <div className="ch-card-title" style={{ color: "var(--accent)", fontWeight: 800, fontSize: "1.17em" }}>
                  {tool.title}
                </div>
                <div style={{ color: "var(--text-secondary)", fontSize: ".99em", marginBottom: 13 }}>
                  {tool.desc}
                </div>
              </div>
              <button
                className="ch-info-btn"
                style={{
                  alignSelf: "flex-start",
                  margin: "9px 0 0 2px",
                  minWidth: 96,
                  fontWeight: 700,
                  background: "var(--accent-gradient-focus)",
                  color: "#fff",
                  fontSize: ".99em",
                }}
                tabIndex={-1}
              >
                Open Tool
              </button>
              <div
                aria-hidden="true"
                style={{
                  position: "absolute",
                  bottom: 17,
                  right: 23,
                  opacity: 0.13,
                  fontSize: "2.0em",
                  pointerEvents: "none",
                  userSelect: "none"
                }}
              >
                {tool.key === "hashtag" && "🔗"}
                {tool.key === "caption" && "✍️"}
                {tool.key === "hook" && "✨"}
                {tool.key === "idea" && "💡"}
              </div>
            </div>
          ) : null
        )}
      </div>

      {/* Modal for 4 pop-up tools */}
      {modalTool && (
        <div
          className="ch-modal-backdrop active"
          onClick={() => setModalTool(null)}
          style={{
            position: "fixed",
            left: 0,
            top: 0,
            right: 0,
            bottom: 0,
            zIndex: 220,
            background: "rgba(26,28,46,0.65)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            animation: "modal-fade-in .17s",
          }}
        >
          <div
            className="ch-modal"
            onClick={e => e.stopPropagation()}
            style={{
              minWidth: 380,
              maxWidth: "95vw",
              maxHeight: "95vh",
              overflowY: "auto",
              borderRadius: 26,
              boxShadow: "0 7px 32px 0 rgba(44,62,112,0.21)",
            }}
          >
            {tools.find(t => t.key === modalTool)?.render()}
            <button
              className="ch-modal-close"
              onClick={() => setModalTool(null)}
              style={{
                float: "right",
                marginTop: 24,
                marginBottom: 0,
                minWidth: 66,
                background: "var(--danger-bg)",
                color: "var(--danger)",
                fontWeight: 700,
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Post Planner is always visible and expanded, below other cards */}
      <div style={{ width: "100%", maxWidth: 900, marginTop: 37 }}>
        <PostPlanner />
      </div>
    </section>
  );
}

export default ToolsPage;
