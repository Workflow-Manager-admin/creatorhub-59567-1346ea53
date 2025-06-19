import React from "react";

// PUBLIC_INTERFACE
function SkeletonLoader({ width = "100%", height = 24 }) {
  /** Visual placeholder while loading data */
  return (
    <div
      className="ch-skeleton-loader"
      style={{ width, height, background: "var(--skeleton-bg, #444)" }}
    />
  );
}

export default SkeletonLoader;
