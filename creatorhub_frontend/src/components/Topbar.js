import React from "react";

// PUBLIC_INTERFACE
function Topbar() {
  /** Top navigation bar with logo, search, login buttons */
  return (
    <header className="ch-topbar">
      <div className="ch-logo">CreatorHub</div>
      <input
        className="ch-search"
        type="text"
        placeholder="Search tools or tutorials..."
      />
      <button className="ch-login-btn">Login</button>
    </header>
  );
}

export default Topbar;
