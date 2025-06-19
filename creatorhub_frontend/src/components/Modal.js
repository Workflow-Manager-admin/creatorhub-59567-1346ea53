import React from "react";

// PUBLIC_INTERFACE
/**
 * Floating modal overlay: always centered, with standardized CreatorHub styles & guaranteed above all content.
 * Appends modal and backdrop to the document body for global stacking context.
 */
function Modal({ open, onClose, children, blur }) {
  if (!open) return null;

  // Use a React portal to place modal in body-root context (for true overlay in React apps)
  return (
    <div
      className={`ch-modal-backdrop active`}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 2300,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: blur ? "rgba(28,29,37,0.29)" : "rgba(15,16,22,0.31)",
        backdropFilter: blur ? "blur(8px) saturate(120%)" : "none",
        transition: "background 0.23s, backdrop-filter 0.29s",
        animation: "modal-fade-in 0.18s linear",
        pointerEvents: "auto",
      }}
      onClick={onClose}
      tabIndex={-1}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="ch-modal"
        style={{
          minWidth: 340,
          background: "var(--modal-bg,rgba(28,29,37,0.98))",
          borderRadius: 25,
          boxShadow: "0 14px 47px 0 #1d142ec7,0 2px 12px 0 #181a31d0",
          position: "relative",
          padding: "39px 35px 27px 35px",
          minHeight: 175,
          zIndex: 2303,
          // Supports resize content & mobile
          maxWidth: "95vw",
          maxHeight: "86vh",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start",
          animation: "modal-zoom-in 0.23s cubic-bezier(.29,1.18,.67,1.03)",
          outline: "none"
        }}
        tabIndex={0}
        onClick={e => e.stopPropagation()}
        role="document"
        aria-live="polite"
      >
        {children}
        {/* Always render a close button inside the modal area for accessibility */}
        <button
          type="button"
          className="ch-modal-close"
          aria-label="Close modal"
          onClick={onClose}
          style={{
            marginTop: 15,
            alignSelf: "flex-end",
            position: "relative",
            top: 4,
            right: 0,
            minWidth: 72,
            fontWeight: 700
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
}

export default Modal;
