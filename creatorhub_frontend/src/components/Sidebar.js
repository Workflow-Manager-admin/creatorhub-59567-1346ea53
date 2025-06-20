import React from "react";

// Sidebar styles for layout and dark theme
const sidebarStyle = {
  height: "100vh",
  width: "232px",
  background: "var(--kavia-dark, #1A1A1A)",
  color: "var(--text-color, #fff)",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  paddingTop: "32px",
  borderRight: "1px solid var(--border-color, rgba(255,255,255,0.05))",
  boxSizing: "border-box",
  minWidth: "180px",
};

const logoContainerStyle = {
  marginBottom: "40px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  width: "100%",
};

const svgLogoStyle = {
  width: "64px",
  height: "64px",
  borderRadius: "18px",
  background: "var(--accent, #C9B22D)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  boxShadow: "0 2px 8px rgba(0,0,0,0.14)",
};

// PUBLIC_INTERFACE
function Sidebar({ children }) {
  return (
    <aside style={sidebarStyle}>
      <div style={logoContainerStyle}>
        {/* 
          Placeholder SVG logo for CreatorHub. 
          --------------------------------------------------------------
          Replace this <svg> block with your real logo image or SVG when ready.
          To use an image file instead, replace this with:
            <img src={require('path/to/logo.png')} alt="App Logo" style={...} />
          or with an <img> tag matching your asset path.
          --------------------------------------------------------------
        */}
        <svg
          style={svgLogoStyle}
          viewBox="0 0 64 64"
          xmlns="http://www.w3.org/2000/svg"
          aria-label="CreatorHub Logo"
        >
          <rect width="64" height="64" rx="18" fill="var(--accent, #C9B22D)" />
          <text
            x="50%"
            y="54%"
            textAnchor="middle"
            fontWeight="700"
            fontSize="2.2em"
            fill="#282828"
            fontFamily="Inter,Arial,sans-serif"
            letterSpacing="1.5px"
            dominantBaseline="middle"
          >CH</text>
        </svg>
      </div>
      {/* Add your navigation and sidebar content below */}
      <nav style={{ width: "100%", flex: 1 }}>
        {children}
      </nav>
    </aside>
  );
}

export default Sidebar;
