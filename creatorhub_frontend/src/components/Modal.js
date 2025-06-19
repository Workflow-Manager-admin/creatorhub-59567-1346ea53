import React from "react";

// PUBLIC_INTERFACE
/**
 * Modal component renders children in a modal overlay only when `open` is true.
 * The modal backdrop is only present in the DOM when open.
 */
function Modal({ open = false, children, onClose }) {
  // If not open, don't render anything in DOM
  if (!open) return null;
  return (
    <div className="ch-modal-backdrop" onClick={onClose}>
      <div
        className="ch-modal"
        onClick={e => {
          e.stopPropagation(); // Prevent closing when clicking inside modal
        }}
      >
        {children}
        <button className="ch-modal-close" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}

export default Modal;
