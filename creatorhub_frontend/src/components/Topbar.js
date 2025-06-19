import React from "react";
import useDarkMode from "../hooks/useDarkMode";

/**
 * PUBLIC_INTERFACE
 * Topbar - Modern blurred navbar with quick actions, sidebar toggle, theme toggle, and avatar.
 */
function Topbar({ sidebarCollapsed, setSidebarCollapsed }) {
  const [dark, toggleDark] = useDarkMode();

  return (
    <header className="ch-topbar" style={{
      position: "fixed",
      top: 0,
      width: "100vw",
      zIndex: 120,
      backdropFilter: "blur(18px) saturate(145%)",
      background: "rgba(46, 51, 84, 0.56)",
    }}>
      {/* Collapse sidebar button (hidden on mobile, Desktop only) */}
      <button
        className="ch-sidebar-toggle"
        aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        style={{
          marginRight: 18,
          background: "var(--accent-gradient)",
          color: "#fff",
          border: "none",
          borderRadius: 99,
          padding: "8px 13px",
          fontWeight: 700,
          fontSize: "1.13em",
          boxShadow: "0 2px 10px #e87a4130",
          transition: "filter .15s"
        }}
        onClick={() => setSidebarCollapsed(v => !v)}
        tabIndex={0}
        type="button"
      >
        {/* Lucide PanelLeft Icon */}
        <span style={{ display: "inline-flex", alignItems: "center" }}>
          {sidebarCollapsed ? (
            <svg width={23} height={23} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="3"/><line x1="9" y1="3" x2="9" y2="21"/></svg>
          ) : (
            <svg width={23} height={23} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.15" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="3"/><line x1="6" y1="3" x2="6" y2="21"/></svg>
          )}
        </span>
      </button>
      <div className="ch-logo">CreatorHub</div>
      <input
        className="ch-search"
        type="text"
        placeholder="Search tools or tutorials..."
        style={{ margin: "0 12px 0 18px" }}
      />
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
        {/* Theme toggle */}
        <button
          className="ch-dark-toggle"
          aria-label="Toggle dark mode"
          style={{
            border: "none",
            borderRadius: "99px",
            padding: "8px 13px",
            fontWeight: 700,
            fontSize: "1.04em",
            background: "var(--icon-btn-gradient, var(--accent-gradient))",
            color: "#191c27",
            cursor: "pointer"
          }}
          onClick={toggleDark}
        >
          {/* Lucide Sun/Moon */}
          <span style={{ display: "inline-flex", alignItems: "center" }}>
            {dark ? (
              // Sun
              <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.14" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><path d="M12 1v2"/><path d="M12 21v2"/><path d="M4.22 4.22l1.42 1.42"/><path d="M18.36 18.36l1.42 1.42"/><path d="M1 12h2"/><path d="M21 12h2"/><path d="M4.22 19.78l1.42-1.42"/><path d="M18.36 5.64l1.42-1.42"/></svg>
            ) : (
              // Moon
              <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.12" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a9 9 0 0 0 7.9 13.1c.17-1.05.03-2.17-.31-3.21C19 10 16 6 12 3Z"/></svg>
            )}
          </span>
        </button>
        {/* Avatar or Login */}
        <button
          className="ch-login-btn"
          style={{
            display: "flex",
            alignItems: "center",
            fontWeight: 700,
            gap: 7
          }}
        >
          {/* Heroicons User Icon */}
          <span style={{ display: "flex", alignItems: "center", fontSize: "1.06em" }}>
            <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.12" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="9" r="4"/><path d="M5.9 19a7 7 0 0112.2 0"/></svg>
          </span>
          <span>Login</span>
        </button>
      </div>
    </header>
  );
}

export default Topbar;
