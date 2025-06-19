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
  tags,
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
      // Ensure the button itself does not have conflicting inline styles if the Button prop
      // already has a className like "ch-info-btn". Rely on CSS for these.
      style: {
        // Only keep truly unique or overriding styles here if necessary,
        // otherwise let the Button's className control its appearance.
        // The original inline styles here are often redundant with ch-info-btn
        // For instance, background, margin-top, color are handled by ch-info-btn.
        // Remove 'background', 'marginTop', 'color' from here if ch-info-btn is the sole source of truth.
      }
    });
  }

  return (
    <Card title={title}>
      <div style={{ display: "flex", alignItems: "flex-start" }}>
        <SmallToolCardIconPlaceholder iconType={iconType} /> {/* Use the new helper component */}
        <div style={{ flex: 1 }}>
          <div style={{
            marginBottom: 4,
            color: "var(--text-secondary)",
            fontSize: "1.09em"
          }}>
            {desc}
          </div>
          <div style={{ marginTop: 9, marginBottom: 10 }}>
            {tags && tags.map(tag =>
              <span
                className="ch-card-tag"
                key={tag.label}
                style={{
                  // Only apply accent specific background/color, rest handled by .ch-card-tag
                  background: tag.accent === "tool" ? "var(--accent-gradient)" : "var(--background-secondary)", // Use CSS var for default bg
                  color: tag.accent === "tool" ? "var(--palette-primary)" : "var(--accent)", // Use CSS var for default color
                  // Removed other redundant styles like borderRadius, fontSize, marginRight, fontWeight, verticalAlign
                  // as they are handled by .ch-card-tag
                }}>#{tag.label}</span>
            )}
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