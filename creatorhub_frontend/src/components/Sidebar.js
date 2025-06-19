import React, { useState, useEffect } from "react";

// PUBLIC_INTERFACE
function Sidebar() {
  /** Responsive sidebar that collapses to topbar for mobile */
  const [mobile, setMobile] = useState(window.innerWidth <= 800);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Listen for resize to detect mobile/desktop breakpoint
    function onResize() {
      setMobile(window.innerWidth <= 800);
      if (window.innerWidth > 800) setOpen(false);
    }
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Mobile: show hamburger, collapsible sidebar as drawer (top)
  if (mobile) {
    return (
      <>
        <button
          className="ch-sidebar-toggle"
          aria-label="Show sidebar"
          onClick={() => setOpen(v => !v)}
          style={{
            background: "var(--primary)",
            color: "var(--accent)",
            border: "none",
            borderRadius: 4,
            padding: "9px 13px",
            fontWeight: 600,
            cursor: "pointer",
            margin: "10px"
          }}
        >
          ☰ Menu
        </button>
        {open && (
          <aside className="ch-sidebar" style={{ position: "absolute", top: 64, width: "100vw", left: 0, zIndex: 110, paddingTop: 12, borderBottom: "1px solid var(--border-color)", borderRight: "none" }}>
            <div>
              <b>Sidebar/Filters</b>
            </div>
            <button
              className="ch-sidebar-toggle"
              aria-label="Hide sidebar"
              onClick={() => setOpen(false)}
              style={{
                background: "var(--accent)", color: "var(--primary)",
                border: "none", borderRadius: 4, padding: "6px 18px",
                fontWeight: 500, marginTop: 12, cursor: "pointer"
              }}
            >
              Close
            </button>
          </aside>
        )}
      </>
    );
  }

  // Desktop: persistent sidebar
  return (
    <aside className="ch-sidebar">
      <div><b>Sidebar/Filters</b></div>
      <div style={{ marginTop: 32, color: "var(--text-secondary)" }}>
        {/* Add sidebar nav links or filters here */}
        <ul style={{ listStyle: "none", padding: 0, margin: 0, fontSize: "1rem" }}>
          <li style={{ marginBottom: "1.3rem" }}>🏠 Dashboard</li>
          <li style={{ marginBottom: "1.3rem" }}>🛠 Tools</li>
          <li style={{ marginBottom: "1.3rem" }}>📚 Tutorials</li>
        </ul>
      </div>
    </aside>
  );
}

export default Sidebar;
