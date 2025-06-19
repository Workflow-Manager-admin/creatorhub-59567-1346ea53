// modal.js
import React, { useEffect, useRef } from "react";
import ReactDOM from 'react-dom'; // Import ReactDOM for portals

// PUBLIC_INTERFACE
/**
 * Floating modal overlay: always centered, with standardized CreatorHub styles & guaranteed above all content.
 * Appends modal and backdrop to the document body for global stacking context using React Portals.
 *
 * Props:
 * - open: boolean, controls visibility.
 * - onClose: function, callback when modal needs to close.
 * - children: ReactNode, content to display inside the modal.
 * - blur: boolean, if true, applies a blur effect to the background content.
 */
function Modal({ open, onClose, children, blur }) {
  const modalBackdropRef = useRef(null); // Ref for the backdrop div
  const modalContentRef = useRef(null); // Ref for the actual modal content div

  // Store previously focused element to return focus after modal closes
  const previouslyFocusedElement = useRef(null);

  // Effect for handling focus management, ESC key, and initial focus
  useEffect(() => {
    if (open) {
      // Store the element that was focused before the modal opened
      previouslyFocusedElement.current = document.activeElement;

      // Use setTimeout to ensure the modal content is rendered and then focus it
      const timer = setTimeout(() => {
        if (modalContentRef.current) {
          modalContentRef.current.focus();
        }
      }, 0); // Small delay to ensure content is painted

      const handleKeydown = (event) => {
        if (event.key === "Escape") {
          onClose();
        }
        // Basic focus trap: prevents tabbing out of the modal
        if (event.key === 'Tab' && modalContentRef.current) {
          const focusableElements = modalContentRef.current.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          );
          const firstElement = focusableElements[0];
          const lastElement = focusableElements[focusableElements.length - 1];

          if (!event.shiftKey && document.activeElement === lastElement) {
            firstElement.focus();
            event.preventDefault();
          } else if (event.shiftKey && document.activeElement === firstElement) {
            lastElement.focus();
            event.preventDefault();
          }
        }
      };

      document.addEventListener("keydown", handleKeydown);

      // Cleanup function for when the modal closes or component unmounts
      return () => {
        clearTimeout(timer);
        document.removeEventListener("keydown", handleKeydown);
        // Return focus to the element that was focused before the modal opened
        if (previouslyFocusedElement.current) {
          previouslyFocusedElement.current.focus();
        }
      };
    }
  }, [open, onClose]); // Dependencies: open and onClose

  // Click outside to close (backdrop click)
  useEffect(() => {
    if (!open) return; // Only attach listener when modal is open

    const handleClickOutside = (event) => {
      // Check if the click occurred directly on the backdrop, not on the modal content itself
      if (modalBackdropRef.current && event.target === modalBackdropRef.current) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open, onClose]); // Dependencies: open and onClose

  if (!open) {
    // If not open, do not render anything
    return null;
  }

  // Use React Portal to render the modal's DOM directly into the 'modal-root' div
  return ReactDOM.createPortal(
    <div
      ref={modalBackdropRef} // Attach ref to the backdrop for click-outside
      className={`ch-modal-backdrop ${open ? "active" : ""}`}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 2300, // Explicit z-index to ensure it's on top
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: blur ? "rgba(28,29,37,0.29)" : "rgba(15,16,22,0.31)",
        backdropFilter: blur ? "blur(8px) saturate(120%)" : "none",
        transition: "background 0.23s, backdrop-filter 0.29s",
        animation: "modal-fade-in 0.18s linear forwards", // 'forwards' keeps the end state of the animation
        pointerEvents: "auto",
      }}
      tabIndex={-1} // Make backdrop tabbable for accessibility if needed, though click outside is primary interaction
      aria-modal="true"
      role="dialog"
    >
      <div
        ref={modalContentRef} // Attach ref to the modal content for focus management
        className="ch-modal"
        style={{
          minWidth: 340,
          minHeight: 175,
          maxWidth: "95vw",
          maxHeight: "86vh",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start",
          outline: "none", // Remove default focus outline
          zIndex: 2303, // Ensure content is above backdrop but within portal
          animation: "modal-zoom-in 0.18s ease-out forwards", // Example zoom animation
          // Add backdrop-filter directly to the modal content if it needs its own specific blur,
          // otherwise it will inherit from the backdrop. If it's a floating glass effect, put it here.
          // backdropFilter: "blur(5px)", // Example for a "glassmorphism" effect on the modal itself
        }}
        tabIndex={0} // Make the modal content itself focusable
        onClick={e => e.stopPropagation()} // Prevent clicks on modal content from bubbling to backdrop
        role="document"
        aria-live="polite" // Announce changes to assistive technologies
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
    </div>,
    document.getElementById('modal-root') // The target DOM node for the portal
  );
}

export default Modal;