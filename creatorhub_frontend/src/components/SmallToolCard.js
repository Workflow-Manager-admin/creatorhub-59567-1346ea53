import React, { useState } from "react";
import Modal from "./Modal";
import Card from "./Card";
import GeminiInsightsModal from "./GeminiInsightsModal";

// Helper: Consistent Icon Placeholder for SmallToolCard
function SmallToolCardIconPlaceholder({ iconType = "lottie" }) {
  if (iconType === "lottie") {
    return (
      <div style={{
        width: 42,
        height: 42,
        borderRadius: 21,
        // Using CSS variables for consistency
        background: "radial-gradient(circle at 60% 28%, var(--accent) 20%, var(--background-secondary) 100%)",
        boxShadow: "0 2px 14px var(--shadow-hover)", // Using a general shadow variable
        marginRight: 16,
        marginBottom: 8,
        display: "flex", // Added for centering content if any
        alignItems: "center",
        justifyContent: "center",
      }}>
        {/* Inner animated element if needed, similar to DashboardView's IconLottiePlaceholder */}
        <div style={{ width: 20, height: 20, borderRadius: 10, background: "linear-gradient(135deg, var(--accent) 60%, var(--danger) 110%)", filter: "blur(0.5px) brightness(1.1)", opacity: 0.93, animation: "bounce 1.6s infinite alternate" }} />
      </div>
    );
  } else { // type === "icon"
    return (
      <span style={{
        width: 36,
        height: 36,
        borderRadius: 18,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        // Consistent icon background, similar to lottie but perhaps lighter
        background: "radial-gradient(circle at 50% 50%, var(--accent-secondary) 15%, var(--background-secondary) 90%)",
        boxShadow: "0 1px 8px var(--shadow-card)",
        marginRight: 16, // Ensure consistent spacing
        marginBottom: 8,
      }}>
        <svg width={28} height={28} viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="var(--accent)" strokeWidth="3" /> {/* Use CSS variable for stroke */}
        </svg>
      </span>
    );
  }
}

/**
 * SmallToolCard - dashboard/tools grid card; launches modal overlay above all content, always centered.
 * Now supports "Learn More" (Gemini Insights) button and modal.
 * Accepts optional 'learnMoreBtn' to render a custom Gemini Insights button/modal handler for greater state control.
 */
function SmallToolCard({
  title,
  desc,
  iconType = "lottie",
  Button,
  toolContent,
  learnMoreBtn, // optional: parent-provided custom button
  onLearnMore, // optional: parent-level handler for Learn More (e.g. for DashboardView central modal)
  accent = "tool",
}) {
  const [modalOpen, setModalOpen] = useState(false);
  // Gemini modal state is only local if NOT provided from above
  const [insightsOpen, setInsightsOpen] = useState(false);

  // Intercept Button clicks and propagate correct modal logic everywhere
  let LaunchButton = null;
  if (Button) {
    LaunchButton = React.cloneElement(Button, {
      onClick: e => {
        if (Button.props.onClick) Button.props.onClick(e);
        if (e && e.preventDefault) e.preventDefault();
        setModalOpen(true);
      },
      style: {}
    });
  }

  // Calculate category for modal
  let geminiCategory = "Tool";
  if (accent === "guide") geminiCategory = "Guide";
  if (accent === "tool") geminiCategory = "Tool";

  // If parent provided a handler, "Learn More" is delegated up
  const mergedLearnMoreBtn =
    learnMoreBtn ||
    (onLearnMore ? (
      <button
        className="ch-info-btn"
        style={{
          background: "var(--btn-gradient-orange-red-focus)",
          color: "#fff",
          fontWeight: 700,
          marginLeft: 8,
          minWidth: 98,
          marginTop: 10,
        }}
        onClick={e => {
          e.preventDefault();
          onLearnMore(title, geminiCategory);
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
    ) : (
      <button
        className="ch-info-btn"
        style={{
          background: "var(--btn-gradient-orange-red-focus)",
          color: "#fff",
          fontWeight: 700,
          marginLeft: 8,
          minWidth: 98,
          marginTop: 10,
        }}
        onClick={e => {
          e.preventDefault();
          setInsightsOpen(true);
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
    ));

  return (
    <Card title={<span style={{ color: '#FF0000' }}>{title}</span>}>
      <div style={{ display: "flex", alignItems: "flex-start" }}>
        <SmallToolCardIconPlaceholder iconType={iconType} />
        <div style={{ flex: 1 }}>
          <div style={{
            marginBottom: 4,
            color: "var(--text-secondary)",
            fontSize: "1.09em"
          }}>
            {desc}
          </div>
          <div style={{ marginTop: 9, marginBottom: 10 }} />
          <div style={{ display: "flex", gap: 7 }}>
            {LaunchButton}
            {/* "Learn More" button always present, handler delegated if parent controls */}
            {mergedLearnMoreBtn}
          </div>
        </div>
      </div>
      {/* Modal for actual tool */}
      {modalOpen && (
        <Modal open={modalOpen} onClose={() => setModalOpen(false)} blur={true}>
          {toolContent}
        </Modal>
      )}
      {/* Gemini Insights modal: only if *not* delegated to parent */}
      {!onLearnMore && !learnMoreBtn && insightsOpen && (
        <GeminiInsightsModal
          open={insightsOpen}
          onClose={() => setInsightsOpen(false)}
          toolName={title}
          category={geminiCategory}
        />
      )}
    </Card>
  );
}

export default SmallToolCard;
