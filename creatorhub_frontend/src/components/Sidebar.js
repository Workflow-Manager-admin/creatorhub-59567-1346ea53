import React from "react";

/**
 * Sidebar component for CreatorHub
 * 
 * This sidebar features a modern, minimal look and includes a custom SVG 'CH' badge logo at the top.
 * 
 * ----- LOGO SWAP INSTRUCTIONS -----
 * The SVG-based 'CH' badge serves as a branded placeholder.
 * 
 * To replace this logo with a custom image or SVG:
 *   1. Swap the <CHBadgeLogo /> element below with your logo asset (e.g., <img src={logoAsset} ... /> or your SVG JSX).
 *   2. Ensure your asset fits the existing container (see .sidebar__logo styles) or update styles as needed.
 *   3. For consistent appearance, keep max width/height (48px) and margin.
 * 
 * You may also import and use a dedicated logo component or image:
 *   // import AppLogo from '../assets/logo.svg';
 *   // <img src={AppLogo} alt="CreatorHub logo" style={{maxWidth: 48, maxHeight: 48, ...}} />
 * 
 * The rest of the sidebar layout will remain compatible—a block or inline logo works seamlessly.
 * ----------------------------------
 */

// PUBLIC_INTERFACE
function Sidebar({ menuItems = [], selected, onSelect }) {
  return (
    <aside className="sidebar" style={sidebarStyle}>
      {/* Logo area (top) */}
      <div style={logoContainerStyle} className="sidebar__logo">
        {/* 
          SVG 'CH' badge—replace this <CHBadgeLogo /> with your logo as needed.
        */}
        <CHBadgeLogo />
      </div>
      {/* Navigation / menu items */}
      <nav className="sidebar__nav" style={navStyle}>
        {menuItems.map(item => (
          <button
            key={item.key}
            onClick={() => onSelect(item.key)}
            className={`sidebar__nav-item${selected === item.key ? " selected" : ""}`}
            style={{
              ...navItemStyle,
              ...(selected === item.key ? navItemSelectedStyle : {}),
            }}
          >
            {item.icon && <span style={{ marginRight: 10 }}>{item.icon}</span>}
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
}

// PUBLIC_INTERFACE
function CHBadgeLogo() {
  /**
   * SVG badge logo for CreatorHub ("CH")
   * - Replace with branded asset as needed
   * - Preserves layout/spacing for future logo swaps
   */
  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 48 48"
      aria-label="CreatorHub Logo"
      style={{
        display: "block",
        margin: "0 auto",
        background: "var(--kavia-dark, #1A1A1A)",
        borderRadius: "12px",
        boxShadow: "0 1px 6px 0 rgba(60,60,60,0.09)",
      }}
    >
      <rect
        x="0" y="0" width="48" height="48"
        rx="12"
        fill="var(--kavia-dark, #1A1A1A)"
        stroke="var(--kavia-orange, #E87A41)"
        strokeWidth="2"
      />
      <text
        x="50%"
        y="54%"
        textAnchor="middle"
        dominantBaseline="middle"
        fill="var(--kavia-orange, #E87A41)"
        fontFamily="'Inter', 'Segoe UI', Arial, sans-serif"
        fontWeight="bold"
        fontSize="22"
        letterSpacing="4"
      >
        CH
      </text>
    </svg>
  );
}

/* ---- Inline styles for sidebar ---- */

const sidebarStyle = {
  width: 80,
  minWidth: 80,
  background: "var(--kavia-dark, #1A1A1A)",
  color: "var(--text-color, #fff)",
  borderRight: "1.5px solid var(--border-color, rgba(255,255,255,0.10))",
  height: "100vh",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: "16px 0",
  boxSizing: "border-box",
  flexShrink: 0,
  zIndex: 40,
};

const logoContainerStyle = {
  marginBottom: 32,
  width: "100%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const navStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: 12,
  width: "100%",
};

const navItemStyle = {
  background: "none",
  border: "none",
  color: "inherit",
  font: "inherit",
  padding: "12px 8px",
  cursor: "pointer",
  borderRadius: 8,
  transition: "background 0.16s",
  display: "flex",
  alignItems: "center",
  width: "80%",
  justifyContent: "flex-start",
  textAlign: "left",
};

const navItemSelectedStyle = {
  background: "var(--kavia-orange, #E87A41)",
  color: "#fff",
};

/* ---- END OF STYLES ---- */

export default Sidebar;
