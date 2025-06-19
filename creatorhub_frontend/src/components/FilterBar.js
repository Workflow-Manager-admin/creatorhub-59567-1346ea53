import React from "react";

// PUBLIC_INTERFACE
/**
 * FilterBar component for displaying filter/search/filtering options horizontally.
 * Accepts an array of filters (buttons, dropdowns, etc.), a value for controlled inputs, and onChange for filter actions.
 * Children may be used instead of filters prop for maximum composability.
 */
function FilterBar({ filters, children, className = "", ...props }) {
  // If `filters` prop is provided, render those, else render children directly.
  // Use class-based styling for all advanced design effects and accessibility.
  return (
    <div
      className={`ch-filterbar ${className}`}
      role="toolbar"
      aria-label="Content filters"
      tabIndex={0}
      {...props}
    >
      {filters
        ? filters.map((filter, idx) => (
            <span key={idx} className="ch-filterbar-item">
              {filter}
            </span>
          ))
        : children}
    </div>
  );
}

export default FilterBar;
