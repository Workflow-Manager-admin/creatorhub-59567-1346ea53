import React, { useState } from "react";
import Modal from "./Modal";
import Card from "./Card";

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
      }
    });
  }

  return (
    <Card title={title}>
      <div style={{ display: "flex", alignItems: "flex-start" }}>
        {iconType === "lottie" ? (
          <div style={{
            width: 42,
            height: 42,
            borderRadius: 21,
            background: "radial-gradient(circle at 60% 28%, #333be0 20%, #232845 100%)",
            boxShadow: "0 2px 14px #25226335",
            marginRight: 16,
            marginBottom: 8
          }} />
        ) : (
          <span style={{
            width: 36,
            height: 36,
            borderRadius: 18,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center"
          }}>
            <svg width={28} height={28} viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="#FD3A69" strokeWidth="3" />
            </svg>
          </span>
        )}
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
              <span className="ch-card-tag" key={tag.label} style={{
                background: tag.accent === "tool" ? "var(--accent-gradient)" : "#232845",
                color: "var(--accent)",
                borderRadius: 13,
                fontSize: "0.98em",
                marginRight: 7,
                fontWeight: 600,
                verticalAlign: "middle"
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
