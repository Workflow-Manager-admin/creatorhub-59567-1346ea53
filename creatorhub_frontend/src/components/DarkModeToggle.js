import React from "react";

// PUBLIC_INTERFACE
function DarkModeToggle({ checked, onToggle }) {
  /** Toggle dark/light mode */
  return (
    <button className="ch-dark-toggle" onClick={onToggle}>
      {checked ? "🌙" : "☀️"}
    </button>
  );
}

export default DarkModeToggle;
