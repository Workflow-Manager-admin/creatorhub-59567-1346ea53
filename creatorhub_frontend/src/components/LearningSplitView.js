import React, { useState } from "react";

/**
 * PUBLIC_INTERFACE
 * Split view for learning pages: left = chapters/topics, right = content preview.
 * Glassmorphic styling, electric blue/coral accents, rounded corners.
 */
function LearningSplitView({
  chapters = [
    { id: 1, title: "Introduction", preview: "Welcome to the course! Start here." },
    { id: 2, title: "Getting Started", preview: "Set up your dev environment and explore tools." },
    { id: 3, title: "API Usage", preview: "Learn to use the API tools provided in CreatorHub." },
    { id: 4, title: "Advanced Tips", preview: "Speed up content creation with advanced features." }
  ],
  renderContent,
  accentGradient = "var(--accent-gradient)",
}) {
  const [selected, setSelected] = useState(0);

  // For demo: show right column content, or placeholder if not provided
  const Content = renderContent || (() => (
    <div style={{
      fontSize: "1.13em",
      color: "var(--text-color)",
      padding: "30px 16px"
    }}>
      <b>{chapters[selected]?.title}</b>
      <div style={{ marginTop: 14 }}>
        {chapters[selected]?.preview}
      </div>
      {/* Accent callout demo */}
      <div
        style={{
          background: "var(--accent-gradient)",
          color: "var(--text-inverse)",
          fontWeight: 600,
          padding: "17px 18px",
          borderRadius: 20,
          margin: "40px 0 0 0",
          maxWidth: 400,
          // Use --shadow-hover, not hardcoded shadow color
          filter: "var(--shadow-hover, drop-shadow(0 7px 14px var(--accent-secondary)))"
        }}
      >
        Try the interactive exercise!
      </div>
    </div>
  ));

  return (
    <section
      className="learning-split-root"
      style={{
        display: "flex",
        width: "100%",
        minHeight: "78vh",
        background: "var(--background-main)",
        borderRadius: "var(--container-radius, 36px)",
        // Use CSS variable for shadow if available, else fallback:
        boxShadow: "var(--shadow-card, 0 7px 32px 0 rgba(44,62,112,0.14))",
        marginTop: 30,
        overflow: "hidden",
      }}
    >
      {/* Left: Chapters/topics nav */}
      <nav
        style={{
          flex: "0 0 260px",
          minWidth: 150,
          maxWidth: 310,
          background: "var(--background-secondary)",
          borderRight: "1.4px solid var(--border-color)",
          padding: "30px 0 20px 0",
          display: "flex",
          flexDirection: "column",
          backdropFilter: "blur(14px) saturate(130%)"
        }}
        aria-label="Chapters navigation"
      >
        <div style={{
          fontWeight: 700,
          color: "var(--accent)",
          fontSize: "1.08em",
          marginBottom: 17,
          marginLeft: 27,
        }}>
          Chapters
        </div>
        <ul style={{
          listStyle: "none",
          padding: 0,
          margin: 0,
          flex: 1
        }}>
          {chapters.map((c, i) => (
            <li key={c.id}
              style={{
                background: i === selected ? "var(--accent-gradient)" : "none",
                color: i === selected ? "var(--text-inverse)" : "var(--text-color)",
                fontWeight: i === selected ? 800 : 500,
                padding: "11px 23px 11px 29px",
                borderRadius: "18px 0 0 18px",
                margin: "0 0 6px 0",
                boxShadow: i === selected ? "var(--shadow-hover, 0 1.5px 12px #A178DF36)" : "none",
                cursor: "pointer",
                transition: "background .15s, color .12s, font-weight .09s, box-shadow .22s",
                outline: "none",
                border: "none"
              }}
              tabIndex={0}
              aria-current={i === selected ? "page" : undefined}
              onClick={() => setSelected(i)}
              onKeyDown={e => { if (e.key === "Enter") setSelected(i); }}
            >
              <span style={{ marginRight: 9 }}>🧩</span>
              {c.title}
            </li>
          ))}
        </ul>
      </nav>
      {/* Right: Content preview */}
      <div
        style={{
          flex: "1 1 0",
          minWidth: 0,
          padding: "0 0",
          background: "var(--card-bg)",
          display: "flex",
          flexDirection: "column",
          borderRadius: "0 var(--container-radius,36px) var(--container-radius,36px) 0",
        }}>
        <Content />
      </div>
    </section>
  );
}

export default LearningSplitView;
