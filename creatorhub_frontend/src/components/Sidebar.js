import React from "react";

/**
 * Sidebar navigation for the app shell. 
 * This renders the CreatorHub logo and navigation links. (Restored version with prior logo)
 */
const navLinks = [
  { label: "Dashboard", icon: "🏠", view: "dashboard" },
  { label: "Tools", icon: "🛠️", view: "tools" },
  { label: "Learning", icon: "📚", view: "learning" },
  { label: "Profile", icon: "👤", view: "profile" }
];

// PUBLIC_INTERFACE
function Sidebar({ view, setView }) {
  return (
    <aside
      style={{
        width: "220px",
        minWidth: "180px",
        background: "var(--kavia-dark)",
        color: "var(--text-color)",
        borderRight: "1px solid var(--border-color)",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingTop: "24px",
        position: "relative",
        zIndex: 2
      }}
      data-testid="sidebar"
    >
      {/* Logo/logo-text (restored) */}
      <div
        style={{
          fontFamily: "'Montserrat', 'Arial', sans-serif",
          fontWeight: 900,
          letterSpacing: "0.02em",
          fontSize: "2.2rem",
          color: "var(--kavia-orange)",
          marginBottom: "32px",
          display: "flex",
          alignItems: "center",
          userSelect: "none"
        }}
      >
        {/* If there was a logo image before, restore it here. Otherwise, restore the styled text logo */}
        Creator
        <span style={{ color: "#fff", fontWeight: 700, marginLeft: "4px" }}>
          Hub
        </span>
      </div>

      {/* Navigation Links */}
      <nav
        style={{
          width: "100%",
          flex: 1,
          display: "flex",
          flexDirection: "column",
          gap: "6px"
        }}
      >
        {navLinks.map((item) => (
          <button
            key={item.view}
            onClick={() => setView(item.view)}
            style={{
              display: "flex",
              alignItems: "center",
              width: "100%",
              background:
                view === item.view
                  ? "rgba(255,255,255,0.07)"
                  : "transparent",
              border: "none",
              outline: "none",
              color: "inherit",
              cursor: "pointer",
              padding: "14px 24px",
              fontSize: "1.04em",
              fontWeight: view === item.view ? 700 : 400,
              borderRadius: "0 32px 32px 0",
              transition: "background 0.17s"
            }}
            aria-current={view === item.view ? "page" : undefined}
          >
            <span style={{ fontSize: "1.18em", marginRight: "11px" }}>
              {item.icon}
            </span>
            {item.label}
          </button>
        ))}
      </nav>
      <div style={{ flex: 0, minHeight: "40px" }} />
    </aside>
  );
}

export default Sidebar;
