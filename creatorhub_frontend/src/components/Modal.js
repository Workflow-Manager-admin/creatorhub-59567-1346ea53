import React from "react";

// PUBLIC_INTERFACE
/**
 * Simple floating modal overlay (always centered, highest z-index)
 */
function Modal({ open, onClose, children }) {
  if (!open) return null;
  return (
    <div
      className="modal-guard"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0,0,0,0.46)",
        zIndex: 9999, // Permanent top
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      onClick={onClose}
    >
      <div
        className="modal"
        style={{
          background: "#181933",
          borderRadius: 12,
          maxWidth: 388,
          padding: 32,
          minHeight: 160,
          position: "relative",
          boxShadow: "0 8px 32px 2px rgba(30, 20, 40, 0.42)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
        onClick={e => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}

export default Modal;
