import React, { useState } from "react";
import SmallToolCard from "./SmallToolCard";
import HashtagGenerator from "./HashtagGenerator";
import CaptionGenerator from "./CaptionGenerator";
import HookGenerator from "./HookGenerator";

/**
 * DashboardQuickCards – renders the set of three core quick access tool cards,
 * each with "Open Tool" and "Learn More" buttons, now using centralized modal control.
 */
// PUBLIC_INTERFACE
function DashboardQuickCards({ onLearnMore }) {
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
          onLearnMore={onLearnMore}
          accent="tool"
        />
      ))}
    </div>
  );
}

export default DashboardQuickCards;
