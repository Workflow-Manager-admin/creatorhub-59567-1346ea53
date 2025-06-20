// SelfContainedToolCard.js
import React, { useState } from "react";
import Modal from "./Modal"; // Assuming Modal is in the same directory or accessible
import Card from "./Card";   // Assuming Card is in the same directory or accessible

// You'll need the IconLottiePlaceholder from DashboardView if you want icons
function IconLottiePlaceholder({ type = "lottie", size = 48 }) {
    return (
        <div
            style={{
                width: size,
                height: size,
                borderRadius: size / 2,
                background: "radial-gradient(circle at 65% 15%, #333be0 20%, #232845 95%)",
                boxShadow: "0 2px 16px #20225333",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginRight: 20,
                marginBottom: 10,
            }}
            aria-label="Animated illustration placeholder"
        >
            {type === "lottie" ? (
                <div style={{ width: 26, height: 26, borderRadius: 13, background: "linear-gradient(135deg,#1E90FF 60%,#FF7E5F 110%)", filter: "blur(1px) brightness(1.1)", opacity: 0.93, animation: "bounce 1.6s infinite alternate" }} />
            ) : (
                <svg width={size - 22} height={size - 22} viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="#FF7E5F" strokeWidth="3" /></svg>
            )}
            <style>
                {`@keyframes bounce {0% {transform: scale(0.93);} 70% {transform: scale(1.08);} 100% {transform: scale(1.0);} }`}
            </style>
        </div>
    );
}


function SelfContainedToolCard({ title, description, iconType, ToolComponent }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  return (
    <>
      <Card title={title} style={{ minHeight: '176px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div style={{ display: "flex", alignItems: "flex-start", position: "relative" }}>
          {iconType && <IconLottiePlaceholder type={iconType} />}
          <div style={{ flex: 1 }}>
            <div style={{ marginBottom: 4, color: "var(--text-secondary)", fontSize: "1.065em" }}>
              {description}
            </div>
            <div style={{ marginTop: 10, display: "flex", flexWrap: "wrap", gap: 7 }}>
              <button
                className="ch-info-btn" // Re-use the existing button class
                onClick={handleOpen}
                style={{
                    background: 'linear-gradient(135deg, #1E90FF 0%, #68b8f7 100%)',
                    color: 'white',
                    border: 'none',
                    padding: '10px 15px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    fontSize: '0.9rem',
                    boxShadow: '0 4px 10px rgba(30,144,255,0.2)',
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': { // Note: this won't work in inline style, needs actual CSS or styled-components
                        transform: 'translateY(-2px)',
                        boxShadow: '0 6px 15px rgba(30,144,255,0.3)',
                    }
                }}
              >
                Open Tool
              </button>
            </div>
          </div>
        </div>
      </Card>

      {isOpen && (
        <Modal isOpen={isOpen} onClose={handleClose} title={title}>
          {/* Render the actual tool component passed as a prop */}
          <ToolComponent />
        </Modal>
      )}
    </>
  );
}

export default SelfContainedToolCard;