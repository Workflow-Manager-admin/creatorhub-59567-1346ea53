import React, { useEffect } from "react";

// PUBLIC_INTERFACE
/**
 * Modal component renders children in a modal overlay only when `open` is true.
 * The modal backdrop is only present in the DOM when open.
 * Overlay is fixed to the viewport, with full-screen coverage and centering.
 */
function Modal({ open = false, children, onClose, blur = true }) {
  // Prevent background scroll while modal is open
  useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original || "";
    };
  }, [open]);

  // If not open, don't render anything in DOM
  if (!open) return null;

  // Render: modal with fixed, viewport-aligned overlay and correct z-index, blur, and accessibility
  return (
    <div
      className={`ch-modal-backdrop${open ? " active" : ""}`}
      style={{
        position: "fixed",
        inset: 0,
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 190,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(26, 27, 36, 0.73)",
        // Blur overlay if enabled
        backdropFilter: blur ? "blur(17px) saturate(135%)" : "none",
        WebkitBackdropFilter: blur ? "blur(17px) saturate(135%)" : "none",
        transition: "backdrop-filter 0.24s, background 0.21s",
        animation: "modal-fade-in 0.13s",
        willChange: "backdrop-filter,opacity"
      }}
      tabIndex={-1}
      aria-modal="true"
      role="dialog"
      onClick={onClose}
    >
      <div
        className="ch-modal"
        tabIndex={0}
        style={{
          minWidth: 340,
          maxWidth: "93vw",
          maxHeight: "92vh",
          overflowY: "auto",
          outline: "none",
          borderRadius: 26,
          background: "var(--modal-bg,rgba(28,29,37,0.96))",
          zIndex: 194,
          position: "relative",
          pointerEvents: "auto",
          boxShadow: "0 18px 56px 0 rgba(23,19,40,0.27),0 2px 16px #19182639"
        }}
        onClick={e => {
          e.stopPropagation(); // Prevent closing when clicking inside modal
        }}
      >
        {children}
        <button className="ch-modal-close" onClick={onClose} tabIndex={0} autoFocus>
          Close
        </button>
      </div>
    </div>
  );
}

export default Modal;
