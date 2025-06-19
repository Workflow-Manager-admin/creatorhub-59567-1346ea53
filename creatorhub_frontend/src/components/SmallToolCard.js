import React from "react";
import Card from "./Card";
import SkeletonLoader from "./SkeletonLoader";

// PUBLIC_INTERFACE
/**
 * A compact tool card variant matching the Tools page layout, supporting a title, description, tags, icon, 'Open Tool' button, and optional content area for embedded generators.
 */
function SmallToolCard({
  title,
  desc,
  tags,
  iconType = "lottie",
  Button,
  toolContent, // For embedded generator, e.g., <HashtagGenerator />
  loading = false
}) {
  // For visual parity we can inline icon logic or optionally import from DashboardView if structure is similar. Here, inline minimal icon option.
  function Icon({ type = "lottie", size = 40 }) {
    if (loading)
      return <SkeletonLoader width={size} height={size} />;
    if (type === "lottie")
      return (
        <div style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          background: "radial-gradient(circle at 65% 15%, #333be0 20%, #232845 95%)",
          boxShadow: "0 2px 16px #20225333",
          display: "flex", alignItems: "center", justifyContent: "center",
          marginRight: 16,
          marginBottom: 4
        }}>
          <div style={{
            width: 18, height: 18, borderRadius: 11,
            background: "linear-gradient(135deg,#1E90FF 60%,#FF7E5F 110%)",
            filter: "blur(1px) brightness(1.08)", opacity: 0.93,
            animation: "bounce 1.2s infinite alternate"
          }} />
          <style>
            {`@keyframes bounce {0% {transform: scale(0.93);} 70% {transform: scale(1.08);} 100% {transform: scale(1.0);} }`}
          </style>
        </div>
      );
    // icon fallback
    return (
      <svg width={size - 14} height={size - 14} viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" stroke="#FF7E5F" strokeWidth="3" />
      </svg>
    );
  }
  // Tag~badge in small format
  function Chip({ accent, children }) {
    let style = {
      background: "#232845",
      color: "var(--accent)",
      borderRadius: 13,
      fontSize: "0.95em",
      padding: "3px 13px",
      fontWeight: 600,
      marginRight: 7,
      marginBottom: 1,
      letterSpacing: ".01em",
      verticalAlign: "middle"
    };
    if (accent === "tool") style.background = "linear-gradient(90deg,#FF7E5F88,#FD3A6942)";
    if (accent === "guide") style.background = "linear-gradient(89deg,#1E90FF20,#1E90FF55)";
    if (accent === "new") style.background = "var(--accent-gradient)";
    return <span className="ch-card-tag" style={style}>{children}</span>;
  }

  return (
    <Card title={title}>
      <div style={{ display: "flex", alignItems: "flex-start" }}>
        <Icon type={iconType} />
        <div style={{ flex: 1 }}>
          <div style={{ marginBottom: 4, color: "var(--text-secondary)", fontSize: "1.03em" }}>
            {desc}
          </div>
          <div style={{ marginTop: 7, marginBottom: 8 }}>
            {tags && tags.map(tag =>
              <Chip accent={tag.accent} key={tag.label}>{'#' + tag.label}</Chip>
            )}
          </div>
          {Button ? <div style={{ marginBottom: toolContent ? 11 : 0 }}>{Button}</div> : null}
          {toolContent ? (
            <div style={{ marginTop: 0 }}>
              {toolContent}
            </div>
          ) : null}
        </div>
      </div>
    </Card>
  );
}

export default SmallToolCard;
