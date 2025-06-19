import React from "react";

// PUBLIC_INTERFACE
function Topbar() {
  /** Top navigation bar: fixed at top, always visible for mobile and desktop, login button on the right */
  return (
    <header className="ch-topbar" style={{ position: "fixed", top: 0, width: "100vw", zIndex: 120 }}>
      <div className="ch-logo">CreatorHub</div>
      <input
        className="ch-search"
        type="text"
        placeholder="Search tools or tutorials..."
      />
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <button className="ch-login-btn">Login</button>
      </div>
    </header>
  );
}

export default Topbar;
