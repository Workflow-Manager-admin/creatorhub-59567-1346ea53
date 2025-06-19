import React, { useState } from "react";
import SmallToolCard from "./SmallToolCard";
import HashtagGenerator from "./HashtagGenerator";
import CaptionGenerator from "./CaptionGenerator";
import HookGenerator from "./HookGenerator";
import GeminiInsightsModal from "./GeminiInsightsModal";

/**
 * DashboardQuickCards – renders the set of three core quick access tool cards,
 * each with "Open Tool" and "Learn More" buttons, with its own GeminiInsightsModal.
 */
function DashboardQuickCards() {
  // For modal state: control which tool (if any) has its Gemini modal open.
  const [insightsModal, setInsightsModal] = useState({
    open: false,
    toolName: "",
  });

  // Handler: open GeminiInsightsModal for a tool
  const handleOpenInsights = (toolName) => {
    setInsightsModal({ open: true, toolName });
  };
  const handleCloseInsights = () => {
    setInsightsModal({ open: false, toolName: "" });
  };

  // The three core tools for dashboard quick access
  const cards = [
    {
      title: "Hashtag Generator",
      desc: "Suggested hashtags for engagement & trending topics. Enter your niche!",
      iconType: "lottie",
      toolContent: <HashtagGenerator />,
    },
    {
      title: "Caption Generator",
      desc: "Type a topic and pick a tone for fresh caption ideas.",
      iconType: "icon",
      toolContent: <CaptionGenerator />,
    },
    {
      title: "Hook Generator",
      desc: "Get attention-grabbing hooks for Reels, Shorts, TikToks, and more.",
      iconType: "lottie",
      toolContent: <HookGenerator />,
    },
  ];

  return (
    <div
      className="dashboard-tool-card-grid"
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))",
        gap: 32,
        alignItems: "stretch",
        justifyContent: "center",
        maxWidth: 1100,
        width: "100%",
        margin: "0 auto",
        padding: "0 12px"
      }}
    >
      {cards.map(({ title, desc, iconType, toolContent }) => (
        <SmallToolCard
          key={title}
          title={title}
          desc={desc}
          iconType={iconType}
          Button={
            <a
              href="#"
              className="ch-info-btn"
              onClick={e => { e.preventDefault(); }}
              tabIndex={0}
              aria-label={`Open ${title}`}
            >
              Open Tool
            </a>
          }
          toolContent={toolContent}
          // Pass custom Learn More button as needed to open modal
          learnMoreBtn={
            <button
              className="ch-info-btn"
              style={{
                background: "var(--btn-gradient-orange-red-focus)",
                color: "#fff",
                fontWeight: 700,
                minWidth: 98,
                marginLeft: 8,
                marginTop: 10
              }}
              onClick={e => {
                e.preventDefault();
                handleOpenInsights(title);
              }}
              type="button"
              tabIndex={0}
              aria-label={`Learn more about ${title}`}
            >
              <span aria-hidden="true" style={{ display: "inline-flex", alignItems: "center", marginRight: 6, fontSize: "1.11em" }}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M3 4C3 3.44772 3.44772 3 4 3H14C14.5523 3 15 3.44772 15 4V16C15 16.5523 14.5523 17 14 17H4C3.44772 17 3 16.5523 3 16V4Z" stroke="#fff" strokeWidth="1.6" /><path d="M5 6H13" stroke="#fff" strokeWidth="1.2" strokeLinecap="round" /></svg>
              </span>
              Learn More
            </button>
          }
        />
      ))}

      {/* Render Gemini InsightsModal if needed */}
      {insightsModal.open && (
        <GeminiInsightsModal
          open={insightsModal.open}
          onClose={handleCloseInsights}
          toolName={insightsModal.toolName}
          category="Tool"
        />
      )}
    </div>
  );
}

export default DashboardQuickCards;
