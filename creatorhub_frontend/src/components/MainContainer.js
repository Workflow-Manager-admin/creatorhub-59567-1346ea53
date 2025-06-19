import React from "react";

// PUBLIC_INTERFACE
function MainContainer({ children }) {
  /** Main app layout container */
  return (
    <div className="main-container">
      {/* Sidebar, Topbar, Filters, etc, will be added here */}
      {children}
    </div>
  );
}

export default MainContainer;
