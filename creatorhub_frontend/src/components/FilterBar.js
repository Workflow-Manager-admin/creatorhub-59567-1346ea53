import React from "react";

// PUBLIC_INTERFACE
/**
 * FilterBar component for displaying filter/search/filtering options horizontally.
 * Accepts an array of filters (buttons, dropdowns, etc.), a value for controlled inputs, and onChange for filter actions.
 * Children may be used instead of filters prop for maximum composability.
 */
function FilterBar({ filters, children, style, className = "", ...props }) {
  // If `filters` prop is provided, render those, else render children directly.
  return (
    <div
      className={`ch-filterbar ${className}`}
      style={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        gap: "1rem",
        background: "var(--primary)",
        padding: "12px 18px",
        borderRadius: "8px",
        marginBottom: "24px",
        ...style,
      }}
      {...props}
    >
      {filters
        ? filters.map((filter, idx) => (
            <span key={idx} style={{ display: "flex", alignItems: "center" }}>
              {filter}
            </span>
          ))
        : children}
    </div>
  );
}

export default FilterBar;
