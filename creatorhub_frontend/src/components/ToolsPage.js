import React from "react";
import SmallToolCard from "./SmallToolCard";
import HashtagGenerator from "./HashtagGenerator";
import CaptionGenerator from "./CaptionGenerator";
import HookGenerator from "./HookGenerator";
import PostPlanner from "./PostPlanner";
import ContentIdeaGenerator from "./ContentIdeaGenerator";

/**
 * PUBLIC_INTERFACE
 * ToolsPage - Displays all peer tool cards, each launches a modal overlay using the unified Dashboard modal (Modal.js).
 * Ensures all modals (for tool launching and AI insights) use the exact same structure/component as the Dashboard.
 */
function ToolsPage() {
  // Array of available tools (components shown inside modal)
  const tools = [
    {
      id: "hashtag",
      title: "Hashtag Generator",
      desc: "Suggests hashtags for trending, engagement, or targeted content.",
      tags: [{ label: "Generator", accent: "tool" }],
      iconType: "lottie",
      toolContent: <HashtagGenerator />
    },
    {
      id: "caption",
      title: "Caption Generator",
      desc: "Type a topic + pick a tone for a fresh caption.",
      tags: [{ label: "Generator", accent: "tool" }],
      iconType: "icon",
      toolContent: <CaptionGenerator />
    },
    {
      id: "contentidea",
      title: "Content Idea Generator",
      desc: "Brainstorm winning content ideas for any topic or audience, powered by AI.",
      tags: [{ label: "Generator", accent: "tool" }],
      iconType: "lottie",
      toolContent: <ContentIdeaGenerator />
    },
    {
      id: "hook",
      title: "Hook Generator",
      desc: "Get scroll-stopping hooks for Reels, Shorts, TikToks.",
      tags: [{ label: "Generator", accent: "tool" }],
      iconType: "lottie",
      toolContent: <HookGenerator />
    },
    {
      id: "postplanner",
      title: "Post Planner",
      desc: "Get a full weekly post plan based on your content goal.",
      tags: [{ label: "Planner", accent: "tool" }],
      iconType: "icon",
      toolContent: <PostPlanner />
    }
  ];

  return (
    <section style={{ width: "100%" }}>
      <div style={{
        fontSize: "2.05rem",
        fontWeight: 800,
        marginBottom: 12,
        marginTop: 22,
        color: "var(--palette-primary)",
        letterSpacing: "-0.01em",
        textAlign: "center",
        textShadow: "0 2px 30px #1e90ff44,0 1px 8px #fd3a6921"
      }}>
        Tools & Generators
      </div>
      <div style={{
        fontSize: "1.19em",
        color: "var(--text-secondary)",
        fontWeight: 400,
        marginBottom: 22,
        textAlign: "center"
      }}>
        A unified place for all CreatorHub tools and quick generators
      </div>
      <div
        className="dashboard-tool-card-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(319px, 1fr))",
          gap: 32,
          alignItems: "stretch",
          justifyContent: "center",
          maxWidth: 1080,
          width: "100%",
          margin: "0 auto",
          padding: "0 13px"
        }}
      >
        {tools.map(tool => (
          <SmallToolCard
            key={tool.id}
            title={tool.title}
            desc={tool.desc}
            tags={tool.tags}
            iconType={tool.iconType}
            Button={
              <a
                href="#"
                className="ch-info-btn"
                tabIndex={0}
                aria-label={`Open ${tool.title}`}
                // DO NOT assign style/variant here; Modal/SmallToolCard ensure style/structure.
                // All modal overlays are managed in SmallToolCard using Modal.js for consistency.
                onClick={e => {
                  e.preventDefault();
                }}
              >
                Open Tool
              </a>
            }
            toolContent={tool.toolContent}
            // infoIconButton below will always use same styling, letting SmallToolCard's unified modal pattern control appearance and behavior.
            infoIconButton={
              <button
                className="dashboard-card-info-icon"
                style={{
                  position: "absolute",
                  bottom: "1rem",
                  right: "1rem",
                  color: "#ccc",
                  background: "transparent",
                  border: "none",
                  fontSize: "1.5rem",
                  padding: 0,
                  cursor: "pointer"
                }}
                type="button"
                onClick={e => {
                  e.preventDefault();
                  // All modals (primary and info) are managed via Modal.js in SmallToolCard,
                  // so this just triggers the true modal structure used everywhere.
                  // Info logic is handled in SmallToolCard using its consistent modal style.
                  // Leave this as a stub, unified UX managed above.
                }}
                tabIndex={0}
                aria-label={`Show AI insights for ${tool.title}`}
                title="Show AI insights"
              >
                <svg
                  width="25"
                  height="25"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                  focusable="false"
                >
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                  <rect x="11" y="10" width="2" height="6" rx="1" fill="currentColor" />
                  <rect x="11" y="7" width="2" height="2" rx="1" fill="currentColor" />
                </svg>
              </button>
            }
          />
        ))}
      </div>
    </section>
  );
}

export default ToolsPage;
