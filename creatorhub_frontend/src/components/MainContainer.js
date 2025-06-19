import React from "react";

// PUBLIC_INTERFACE
function MainContainer({ children }) {
  /** Main content area for dashboards, API tools, etc. Handles content stacking for mobile/desktop */
  return (
    <div className="ch-main-container">
      {children}
    </div>
  );
}

export default MainContainer;
