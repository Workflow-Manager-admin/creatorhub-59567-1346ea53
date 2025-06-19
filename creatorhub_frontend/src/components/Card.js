import React from "react";

// PUBLIC_INTERFACE
function Card({ title, children }) {
  /** Basic reusable card for tools or tutorials */
  return (
    <div className="ch-card">
      <div className="ch-card-title">{title}</div>
      <div className="ch-card-content">{children}</div>
    </div>
  );
}

export default Card;
