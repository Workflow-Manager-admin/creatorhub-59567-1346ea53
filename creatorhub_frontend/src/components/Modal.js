import React from "react";

// PUBLIC_INTERFACE
function Modal({ open, children, onClose }) {
  /** Simple modal overlay */
  if (!open) return null;
  return (
    <div className="ch-modal-backdrop" onClick={onClose}>
      <div className="ch-modal" onClick={e => e.stopPropagation()}>
        {children}
        <button className="ch-modal-close" onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

export default Modal;
