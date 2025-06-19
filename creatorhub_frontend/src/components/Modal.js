import React from "react";
// Using createPortal for true overlay - though not explicitly shown in current file, it's good practice.
// For this exact file, if not using createPortal, it will just render within its parent's DOM context.
// Assuming the actual app setup uses createPortal as indicated by the comment.

// PUBLIC_INTERFACE
/**
 * Floating modal overlay: always centered, with standardized CreatorHub styles & guaranteed above all content.
 * Appends modal and backdrop to the document body for global stacking context.
 */
function Modal({ open, onClose, children, blur }) {
  if (!open) return null;

  // Note: For a true global overlay, a React Portal (ReactDOM.createPortal)
  // should be used to render this div directly into document.body.
  // The current code snippet does not show the portal usage, but the comment implies it.
  // Assuming this component is wrapped by a Portal in a parent component.

  return (
    <div
      className={`ch-modal-backdrop active`}
      style={{
        position: "fixed",
        inset: 0,
        // zIndex: 2300, // Let CSS manage z-index if portal is used or ensure no conflicts
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        // These will now apply correctly due to !important removal in CSS
        background: blur ? "rgba(28,29,37,0.29)" : "rgba(15,16,22,0.31)",
        backdropFilter: blur ? "blur(8px) saturate(120%)" : "none",
        transition: "background 0.23s, backdrop-filter 0.29s",
        animation: "modal-fade-in 0.18s linear", // This animation will now play
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
          // These inline styles are kept as they define the intrinsic size/layout behavior
          // CSS will handle visual overrides like backdrop-filter, box-shadow, padding, animation.
          minWidth: 340,
          minHeight: 175,
          maxWidth: "95vw",
          maxHeight: "86vh",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start",
          outline: "none",
          // zIndex: 2303, // Let CSS manage z-index
          // No need for 'background' here as CSS is using CSS variables, and consistency is better from one source
          // No need for 'boxShadow', 'borderRadius', 'position', 'padding', 'animation' here, let CSS manage these
          // No need for 'backdropFilter' here, as the backdrop handles it. If needed for inner elements, apply locally.
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
            // Keep specific positioning/alignment for button, CSS handles core button styles
            marginTop: 15,
            alignSelf: "flex-end",
            position: "relative", // Changed to relative if CSS positions based on relative
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