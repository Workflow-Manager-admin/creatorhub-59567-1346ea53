import React from "react";
import Card from "./Card";
import SkeletonLoader from "./SkeletonLoader";

// Helper: Tag badge
function CategoryTag({ children, accent }) {
  // accent: ("tool"|"guide"|"new"|...)
  let style = {
    background: "#232845",
    color: "var(--accent)",
    borderRadius: 16,
    fontSize: "0.98em",
    padding: "4px 14px",
    fontWeight: 600,
    marginRight: 8,
    marginBottom: 3,
    display: "inline-block",
    letterSpacing: ".01em",
    boxShadow: "0 1px 10px #f98b8030",
    verticalAlign: "middle"
  };
  if (accent === "guide") style.background = "linear-gradient(89deg,#1E90FF20,#1E90FF55)";
  if (accent === "tool") style.background = "linear-gradient(90deg,#FF7E5F88,#FD3A6942)";
  if (accent === "new") style.background = "var(--accent-gradient)";
  return (
    <span className="ch-card-tag" style={style}>{children}</span>
  );
}
// Placeholder for icon/lottie
function IconLottiePlaceholder({ type = "lottie", size = 48 }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        background: "radial-gradient(circle at 65% 15%, #333be0 20%, #232845 95%)",
        boxShadow: "0 2px 16px #20225333",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 20,
        marginBottom: 10,
      }}
      aria-label="Animated illustration placeholder"
    >
      {type === "lottie" ? (
        // A shimmer or animated dots as Lottie placeholder
        <div style={{ width: 26, height: 26, borderRadius: 13, background: "linear-gradient(135deg,#1E90FF 60%,#FF7E5F 110%)", filter: "blur(1px) brightness(1.1)", opacity: 0.93, animation: "bounce 1.6s infinite alternate" }} />
      ) : (
        <svg width={size - 22} height={size - 22} viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="#FF7E5F" strokeWidth="3" /></svg>
      )}
      <style>
        {`@keyframes bounce {0% {transform: scale(0.93);} 70% {transform: scale(1.08);} 100% {transform: scale(1.0);} }`}
      </style>
    </div>
  );
}
// Single glassmorphic tool card
function ToolCard({ title, desc, tags, accent, loading, Button, iconType, onClick }) {
  return (
    <Card title={title}>
      <div style={{ display: "flex", alignItems: "flex-start" }}>
        {loading ? (
          <SkeletonLoader width={48} height={48} />
        ) : (
          <IconLottiePlaceholder type={iconType} />
        )}
        <div style={{ flex: 1 }}>
          <div style={{ marginBottom: 4, color: "var(--text-secondary)", fontSize: "1.065em" }}>
            {desc}
          </div>
          <div style={{ marginTop: 10, marginBottom: 12 }}>
            {tags &&
              tags.map(tag => (
                <CategoryTag key={tag.label} accent={tag.accent}>
                  #{tag.label}
                </CategoryTag>
              ))}
          </div>
          {Button ? Button : null}
        </div>
      </div>
    </Card>
  );
}

// PUBLIC_INTERFACE
/**
 * The new main dashboard view for CreatorHub: Centered greeting, vibrant tool cards, glassmorphic design, microinteractions.
 */
function DashboardView({ user = { name: "Alex" }, loading = false, tools = [] }) {
  // Demo card data if empty
  if (!tools || tools.length < 1) {
    tools = [
      {
        id: "tool-ai",
        accent: "tool",
        title: "AI Text Generator",
        desc: "Generate content instantly with AI.",
        tags: [{ label: "Tool", accent: "tool" }, { label: "New", accent: "new" }],
        Button: <button className="ch-info-btn" style={{ background: "var(--accent-gradient)", marginTop: 10 }}>Launch</button>,
        iconType: "lottie"
      },
      {
        id: "tool-tutorial",
        accent: "guide",
        title: "React Mastery Guide",
        desc: "Level up with interactive chapters and code labs.",
        tags: [{ label: "Guide", accent: "guide" }],
        Button: <button className="ch-info-btn" style={{ background: "linear-gradient(90deg,#1E90FF,#FD3A69)", marginTop: 10 }}>Start</button>,
        iconType: "icon"
      },
      {
        id: "tool-api",
        accent: "tool",
        title: "API Playground",
        desc: "Explore live API endpoints with docs.",
        tags: [{ label: "Tool", accent: "tool" }, { label: "Beta", accent: "new" }],
        Button: <button className="ch-info-btn" style={{ background: "var(--accent-gradient)", marginTop: 10 }}>Try Demo</button>,
        iconType: "icon"
      }
    ];
    // Loading shimmer
    if (loading) {
      tools = tools.map(x => ({ ...x, loading: true }));
    }
  }
  // Responsive grid: 1/2/3 cols
  return (
    <section style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "flex-start",
      minHeight: "86vh",
      width: "100%",
      marginTop: 32
    }}>
      {/* Greeting */}
      <div
        className="dashboard-greeting"
        style={{
          fontSize: "2.07rem",
          fontWeight: 800,
          marginBottom: 12,
          color: "var(--accent, #1E90FF)",
          letterSpacing: "-0.01em",
          textAlign: "center",
          textShadow: "0 2px 40px #1e90ff54,0 1px 8px #fd3a6921"
        }}>
        Welcome back, {user.name} <span role="img" aria-label="wave">👋</span>
      </div>
      <div
        style={{
          fontSize: "1.22em",
          color: "var(--text-secondary)",
          fontWeight: 400,
          marginBottom: 28,
          textAlign: "center"
        }}>
        Your creative toolbox: Explore, learn, and build.
      </div>
      {/* Tool cards */}
      <div
        className="dashboard-tool-card-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))",
          gap: 32,
          alignItems: "stretch",
          justifyContent: "center",
          maxWidth: 1100,
          width: "100%",
          margin: "0 auto",
          padding: "0 12px"
        }}
      >
        {tools.map(tool =>
          <ToolCard
            key={tool.id}
            title={tool.title}
            desc={tool.desc}
            tags={tool.tags}
            accent={tool.accent}
            loading={tool.loading}
            Button={tool.Button}
            iconType={tool.iconType}
          />
        )}
      </div>
    </section>
  );
}

export default DashboardView;
