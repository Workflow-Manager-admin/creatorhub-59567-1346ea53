// SmallToolCard.js
import React, { useState } from "react";
import Modal from "./Modal";
import Card from "./Card";

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

// PUBLIC_INTERFACE
/**
 * SmallToolCard - dashboard/tools grid card; launches modal overlay above all content, always centered.
 */
function SmallToolCard({
  title,
  desc,
  // tags, // <--- YOU CAN REMOVE THIS PROP IF YOU DON'T PASS IT ANYWHERE ELSE EITHER
  iconType = "lottie",
  Button,
  toolContent
}) {
  // Track modal open/close for this tool
  const [modalOpen, setModalOpen] = useState(false);

  // Intercept Button clicks and propagate correct modal logic everywhere, even if generic Button passed
  let LaunchButton = null;
  if (Button) {
    // Force modal-open and disable navigation
    LaunchButton = React.cloneElement(Button, {
      onClick: e => {
        if (Button.props.onClick) Button.props.onClick(e);
        if (e && e.preventDefault) e.preventDefault();
        setModalOpen(true);
      },
      style: {} // Keep this empty if styles are handled by className
    });
  }

  return (
    // Assuming Card component takes a `titleStyle` prop or similar, otherwise Card.js needs to be updated.
    // If Card directly renders `props.title`, we can wrap it in a span with the desired style.
    <Card title={<span style={{ color: '#FF0000' }}>{title}</span>}> {/* Applied bright red to the title */}
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
          <div style={{ marginTop: 9, marginBottom: 10 }}>
            {/* REMOVE OR COMMENT OUT THIS WHOLE BLOCK TO GET RID OF THE TAGS */}
            {/*
            {tags && tags.map(tag =>
              <span
                className="ch-card-tag"
                key={tag.label}
                style={{
                  background: tag.accent === "tool" ? "var(--accent-gradient)" : "var(--background-secondary)",
                  color: tag.accent === "tool" ? "var(--palette-primary)" : "var(--accent)",
                }}>#{tag.label}</span>
            )}
            */}
          </div>
          {LaunchButton}
        </div>
      </div>
      {/* Modal overlay - floating/centered/guaranteed */}
      {modalOpen && (
        <Modal open={modalOpen} onClose={() => setModalOpen(false)} blur={true}>
          {toolContent}
        </Modal>
      )}
    </Card>
  );
}

export default SmallToolCard;