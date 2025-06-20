// src/components/Sidebar.js
import React, { useState, useEffect } from "react";

/**
 * PUBLIC_INTERFACE
 * Sidebar - Modern, animated, compact, gradient/blur sidebar with icons. Collapsible & mobile-friendly.
 */
function Sidebar({ collapsed, activeTab, setActiveTab }) {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 800);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Nav links config
  const links = [
    {
      key: "dashboard",
      icon: (
        // Lucide Home Icon
        <svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round"><path d="M3 11V19a2 2 0 0 0 2 2h3m8 0h3a2 2 0 0 0 2-2v-8m-9-7 7 7-7-7zm0 0-7 7 7-7zm0 0V3 3z"/><path d="M9 22V12h6v10"/></svg>
      ),
      label: "Dashboard",
    },
    {
      key: "tools",
      icon: (
        // Lucide Wrench Icon
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round"><path d="M21.6 20.3a2.4 2.4 0 0 1-3.5 0l-4.2-4.2a7 7 0 0 1-6.1-1.9 7 7 0 0 1-1.9-6.1l4.2-4.2a2.4 2.4 0 1 1 3.5-3.5l4.2 4.2a7 7 0 0 1 1.9 6.1 7 7 0 0 1-6.1 1.9z"/><path d="M18 22h0"/></svg>
      ),
      label: "Tools",
    },
    {
      key: "learning",
      icon: (
        // Phosphor Book Icon
        <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round"><path d="M3 19.5V6a2 2 0 0 1 2-2h11.5"/><path d="M9 7h7.5A2.5 2.5 0 0 1 19 9.5v11.5"/><path d="M3.27 20h17.46"/><path d="M7 17l2-2 2 2 2-2 2 2"/></svg>
      ),
      label: "Learning",
    },
    {
      key: "profile",
      icon: (
        // Lucide User Icon
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
      ),
      label: "Profile",
    },
  ];

  // Responsive: listen for width change
  useEffect(() => {
    function onResize() {
      setIsMobile(window.innerWidth <= 800);
      if (window.innerWidth > 800) setDrawerOpen(false);
    }
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Mobile sidebar: overlay drawer
  if (isMobile) {
    return (
      <>
        <button
          className="ch-sidebar-toggle"
          aria-label="Show sidebar"
          type="button"
          style={{
            background: "var(--primary)",
            color: "var(--accent)",
            border: "none",
            borderRadius: 99,
            padding: "9px 17px",
            fontWeight: 700,
            cursor: "pointer",
            margin: "10px",
            position: "relative",
            zIndex: 221,
            boxShadow: "0 1.5px 10px rgba(44,62,112,0.13)"
          }}
          onClick={() => setDrawerOpen((v) => !v)}
        >
          {/* Lucide Menu Icon */}
          <svg width="21" height="21" viewBox="0 0 20 20" fill="none"><rect y="3.6" width="20" height="2.5" rx="1.14" fill="currentColor" /><rect y="8.5" width="20" height="2.5" rx="1.16" fill="currentColor" /><rect y="13.4" width="20" height="2.5" rx="1.12" fill="currentColor" /></svg>
        </button>
        {drawerOpen && (
          <aside
            className="ch-sidebar"
            tabIndex={0}
            style={{
              position: "absolute",
              top: 64,
              left: 0,
              width: "100vw",
              background: "rgba(60,68,112,0.96)",
              borderRadius: "0 0 25px 25px",
              zIndex: 222,
              animation: "fade-in 0.31s",
              boxShadow: "0 12px 60px 0 #151b2fd9"
            }}
          >
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {links.map((link, idx) => (
                <li
                  key={link.key}
                  tabIndex={0}
                  onClick={() => {
                    setActiveTab && setActiveTab(link.key);
                    setDrawerOpen(false);
                  }}
                  onKeyDown={e => { if (e.key === "Enter") { setActiveTab && setActiveTab(link.key); setDrawerOpen(false); } }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 13,
                    fontWeight: 600,
                    fontSize: "1.13em",
                    padding: "13px 13px",
                    margin: "0 0 13px 0",
                    borderRadius: 15,
                    color: activeTab === link.key ? "#fff" : "var(--text-secondary)",
                    background: activeTab === link.key // <--- CHANGED HERE
                      ? "var(--button-blaze-orange)" // <--- NEW COLOR VARIABLE
                      : "none",
                    boxShadow: activeTab === link.key ? "0 3px 18px #fd3a6929" : "none", // Keep existing shadow or update
                    cursor: "pointer",
                    transition: "background .15s, color .17s,box-shadow .19s",
                    outline: "none"
                  }}
                  aria-current={activeTab === link.key ? "page" : undefined}
                >
                  <span style={{
                    display: "flex",
                    alignItems: "center",
                  }}>{link.icon}</span>
                  <span>{link.label}</span>
                  {activeTab === link.key && (
                    <span
                      aria-hidden="true"
                      style={{
                        background: "var(--accent-gradient)", // Keep accent gradient for the small indicator
                        borderRadius: "7px",
                        width: 8, height: 8,
                        marginLeft: "auto"
                      }}
                    />
                  )}
                </li>
              ))}
            </ul>
          </aside>
        )}
      </>
    );
  }

  // Desktop sidebar
  return (
    <aside
      className={`ch-sidebar modern-sidebar${collapsed ? " sidebar-collapsed" : ""}`}
      tabIndex={0}
      style={{
        minWidth: collapsed ? 64 : 178,
        width: collapsed ? 66 : undefined,
        transition: "min-width 0.25s, width 0.25s"
      }}
    >
      <ul
        style={{
          listStyle: "none",
          padding: 0,
          margin: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: collapsed ? "center" : "flex-start",
          gap: 7
        }}
      >
        {links.map((link, idx) => (
          <li
            key={link.key}
            tabIndex={0}
            onClick={() => setActiveTab && setActiveTab(link.key)}
            onKeyDown={e => { if (e.key === "Enter") setActiveTab && setActiveTab(link.key); }}
            className={`sidebar-link${activeTab === link.key ? " active" : ""}`}
            aria-current={activeTab === link.key ? "page" : undefined}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              borderRadius: collapsed ? "17px" : "19px",
              fontWeight: activeTab === link.key ? 700 : 500,
              color: activeTab === link.key ? "#fff" : "var(--text-secondary)",
              background: activeTab === link.key // <--- CHANGED HERE
                ? "var(--button-blaze-orange)" // <--- NEW COLOR VARIABLE
                : "none",
              position: "relative",
              padding: collapsed ? "14px 0" : "14px 22px 14px 13px",
              marginBottom: "7px",
              minWidth: collapsed ? 44 : 138,
              cursor: "pointer",
              overflow: "visible",
              transition:
                "background 0.22s, color .17s, font-weight .14s, box-shadow .19s, padding 0.18s, min-width 0.18s"
            }}
          >
            <span
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minWidth: 22
              }}
              aria-hidden="true"
            >
              {link.icon}
            </span>
            {!collapsed && <span>{link.label}</span>}
            {activeTab === link.key && (
              <span
                aria-hidden="true"
                style={{
                  position: "absolute",
                  right: collapsed ? -2 : 4,
                  height: 28,
                  width: 4,
                  top: "50%",
                  transform: "translateY(-50%)",
                  borderRadius: 4,
                  background: "linear-gradient(92deg,#FF7E5F 26%,#FD3A69 100%)", // Keep this gradient for the side indicator
                  boxShadow: "0 2.5px 12px #ef943d23"
                }}
              />
            )}
          </li>
        ))}
      </ul>
    </aside>
  );
}

export default Sidebar;