import React, { useEffect, useRef } from "react";

/**
 * Modal Component – CreatorHub enhanced version
 * Features:
 *  - Modern dark theme: CreatorHub color palette (primary: #2C3E70, secondary: #1E1E2F, accent: #C9B22D)
 *  - Accessibility: ARIA roles/labels, keyboard (ESC/tab) navigation, focus trap, close on background click
 *  - Smooth transitions for fade/scale in/out
 *  - Responsive and visually modern layout
 *  - Focus ring for keyboard users
 *  - Dismissal via overlay/ESC/close button
 */

// PUBLIC_INTERFACE
function Modal({ isOpen, onClose, title, children }) {
  const modalRef = useRef(null);
  const lastFocused = useRef(null);

  // Focus trap & return focus when modal closes
  useEffect(() => {
    if (isOpen) {
      lastFocused.current = document.activeElement;
      // Focus the modal container (or first focusable)
      setTimeout(() => {
        if (modalRef.current) {
          const focusable = modalRef.current.querySelector(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          );
          (focusable || modalRef.current).focus();
        }
      }, 10);

      // Prevent background scroll
      document.body.style.overflow = "hidden";
    } else {
      // Restore background scroll and focus
      document.body.style.overflow = "";
      if (lastFocused.current) lastFocused.current.focus();
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Keyboard: close on ESC, trap tab focus
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
      if (e.key === "Tab") {
        // Focus trap
        const focusEls = modalRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const focusArray = Array.prototype.slice.call(focusEls);
        if (!focusArray.length) return;
        const firstEl = focusArray[0];
        const lastEl = focusArray[focusArray.length - 1];

        if (!e.shiftKey && document.activeElement === lastEl) {
          e.preventDefault();
          firstEl.focus();
        } else if (e.shiftKey && document.activeElement === firstEl) {
          e.preventDefault();
          lastEl.focus();
        }
      }
    };
    document.addEventListener("keydown", handleKeyDown, true);
    return () => document.removeEventListener("keydown", handleKeyDown, true);
    // eslint-disable-next-line
  }, [isOpen]);

  // Prevent render if not open for transitions
  if (!isOpen) return null;

  // Handle click overlay to close, but not modal content
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      aria-modal="true"
      role="dialog"
      tabIndex="-1"
      className="ch-modal-overlay ch-modal-fade-in"
      onClick={handleOverlayClick}
      style={{
        position: "fixed",
        zIndex: 1200,
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(26,28,47,0.90)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "background 0.25s",
        /* For high contrast: fallback */
      }}
      data-testid="modal-overlay"
    >
      <div
        className="ch-modal-content ch-modal-zoom-in"
        ref={modalRef}
        tabIndex={-1}
        aria-label={title}
        style={{
          width: "95vw",
          maxWidth: 420,
          background: "#1E1E2F",
          color: "#fff",
          borderRadius: 16,
          boxShadow:
            "0 8px 24px 0 rgba(44,62,112,0.12), 0 0 0 1.5px #2C3E70",
          padding: "2.4rem 1.5rem 1.4rem 1.5rem",
          position: "relative",
          outline: "none",
          display: "flex",
          flexDirection: "column",
          animation: "ch-modal-zoom-in 0.28s cubic-bezier(.61,-0.02,.31,1.09)",
          fontFamily: "'Inter',sans-serif",
        }}
      >
        <button
          aria-label="Close modal"
          className="ch-modal-close-btn"
          onClick={onClose}
          tabIndex={0}
          style={{
            position: "absolute",
            top: 18,
            right: 22,
            width: 32,
            height: 32,
            background: "transparent",
            border: "none",
            color: "#C9B22D",
            fontSize: 28,
            cursor: "pointer",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "background 0.13s",
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              onClose();
            }
          }}
        >
          <span style={{fontWeight:'bold',fontSize:28,lineHeight:'28px'}}>×</span>
        </button>
        {title && (
          <h2
            className="ch-modal-title"
            style={{
              color: "#C9B22D",
              fontWeight: 700,
              fontSize: "1.25rem",
              margin: 0,
              marginBottom: 16,
              letterSpacing: "0.01em",
              lineHeight: 1.2,
              textAlign: "left",
            }}
            id="modal-title"
          >
            {title}
          </h2>
        )}
        <div
          className="ch-modal-body"
          style={{
            color: "#eee",
            fontSize: "1rem",
            lineHeight: 1.6,
            maxHeight: "56vh",
            overflowY: "auto",
            marginBottom: "5px"
          }}
        >
          {children}
        </div>
      </div>
      {/* Inline styles for transitions/responsiveness, plus keyframes */}
      <style>{`
        .ch-modal-fade-in {
          animation: ch-modal-fade-in 0.23s cubic-bezier(.68,-0.15,.32,1.25);
        }
        @keyframes ch-modal-fade-in {
          from { opacity: 0 }
          to   { opacity: 1 }
        }
        .ch-modal-zoom-in {
          animation: ch-modal-zoom-in 0.24s cubic-bezier(.69,-0.18,.32,1.12);
        }
        @keyframes ch-modal-zoom-in {
          0% {
            transform: scale(0.93);
            opacity: 0.2;
          }
          65% {
            transform: scale(1.04);
            opacity: 1;
          }
          100% {
            transform: scale(1.00);
            opacity: 1;
          }
        }
        .ch-modal-content:focus, 
        .ch-modal-content:focus-visible, 
        .ch-modal-close-btn:focus-visible {
          outline: 2px solid #C9B22D;
          box-shadow: 0 0 0 3px rgba(201,178,45,0.23);
        }
        @media (max-width: 650px) {
          .ch-modal-content {
            max-width: 98vw;
            padding: 1.1rem 0.8rem !important;
          }
        }
      `}</style>
    </div>
  );
}

export default Modal;
