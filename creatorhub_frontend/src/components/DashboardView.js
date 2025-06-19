// PUBLIC_INTERFACE
import React, { useState, useEffect, useMemo } from "react";
import Card from "./Card";
import SkeletonLoader from "./SkeletonLoader";
import FilterBar from "./FilterBar";
import { fetchYoutubeContent } from "../api/youtube";
import { fetchDevToContent } from "../api/devto";
import { fetchRapidAPIContent } from "../api/rapidapi";
import { fetchGeminiContent } from "../api/gemini";

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
  if (accent === "guide") {
    style.background = "linear-gradient(89deg,#1E90FF20,#1E90FF55)";
    style.color = "var(--palette-primary)";
  }
  if (accent === "tool") {
    style.background = "linear-gradient(90deg,#FF7E5F88,#FD3A6942)";
    style.color = "var(--palette-primary)";
  }
  if (accent === "new") {
    style.background = "var(--accent-gradient)";
    style.color = "var(--palette-primary)";
  }
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

/**
 * The new main dashboard view for CreatorHub: Centered greeting, vibrant tool cards, glassmorphic design, microinteractions.
 * Now with dynamic tool discovery, integrated search, filtering by category/tag, and loader state.
 */
function DashboardView({ user = { name: "Alex" } }) {
  // --- API data and loader state
  const [tools, setTools] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search and filter states
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all"); // category/tag

  // Category/tag options
  const [allCategories, setAllCategories] = useState([
    { label: "All", value: "all" }
  ]);

  // Fetch tool data and form cards
  useEffect(() => {
    let mounted = true;
    setLoading(true);
    Promise.all([
      fetchYoutubeContent(),
      fetchDevToContent(),
      fetchRapidAPIContent(),
      fetchGeminiContent()
    ]).then(([yt, devto, rapid, gemini]) => {
      if (!mounted) return;
      // Flatten all sources to "tools" cards array
      const compiledTools = [];
      if (yt && yt[0]) {
        compiledTools.push({
          id: yt[0].id,
          accent: "guide",
          title: yt[0].title,
          desc: yt[0].description,
          tags: [{ label: "YouTube", accent: "guide" }],
          iconType: "lottie",
          Button: (
            <a
              href={yt[0].url}
              className="ch-info-btn"
              style={{ background: "linear-gradient(90deg,#1E90FF,#FD3A69)", marginTop: 10, color: "var(--palette-primary)" }}
              target="_blank"
              rel="noopener noreferrer"
            >
              Watch
            </a>
          )
        });
      }
      if (devto && devto.length) {
        devto.forEach(article =>
          compiledTools.push({
            id: article.id,
            accent: "guide",
            title: article.title,
            desc: article.author ? `By ${article.author}` : "Dev.to Article",
            tags: [
              { label: "DevTo", accent: "guide" },
              ...(article.tags || []).map(t => ({ label: t, accent: "guide" }))
            ],
            iconType: "icon",
            Button: (
              <a
                href={article.url}
                className="ch-info-btn"
                style={{ background: "linear-gradient(90deg,#1E90FF,#FD3A69)", marginTop: 10, color: "var(--palette-primary)" }}
                target="_blank"
                rel="noopener noreferrer"
              >
                Read
              </a>
            )
          })
        );
      }
      if (rapid && rapid.length) {
        rapid.forEach(api =>
          compiledTools.push({
            id: api.id,
            accent: "tool",
            title: api.title,
            desc: api.description,
            tags: [
              { label: "API", accent: "tool" },
              ...((api.category && [ { label: api.category, accent: "tool" } ]) || [])
            ],
            iconType: "icon",
            Button: (
              <a
                href={api.url}
                className="ch-info-btn"
                style={{ background: "var(--accent-gradient)", marginTop: 10, color: "var(--palette-primary)" }}
                target="_blank"
                rel="noopener noreferrer"
              >
                Explore
              </a>
            )
          })
        );
      }
      if (gemini && gemini.length) {
        gemini.forEach(res =>
          compiledTools.push({
            id: res.id,
            accent: "tool",
            title: res.title,
            desc: res.result || "Generative AI",
            tags: [ { label: "AI", accent: "tool" } ],
            iconType: "lottie",
            Button: (
              <button
                className="ch-info-btn"
                style={{ background: "var(--accent-gradient)", marginTop: 10, color: "var(--palette-primary)" }}
                disabled
              >
                Demo
              </button>
            )
          })
        );
      }
      setTools(compiledTools);
      // Flatten tags
      const cats = [
        ...new Set([
          ...compiledTools.flatMap(tool =>
            (tool.tags || []).map(t => t.label)
          )
        ])
      ];
      setAllCategories([{ label: "All", value: "all" }, ...cats.map(c => ({ label: c, value: c }))]);
      setLoading(false);
    });
    return () => { mounted = false; };
  }, []);

  // Filtered tools per search and category
  const filteredTools = useMemo(() => {
    let out = tools;
    if (category && category !== "all") {
      out = out.filter(t =>
        t.tags &&
        t.tags.map(tt => tt.label.toLowerCase()).includes(category.toLowerCase())
      );
    }
    if (search && search.trim()) {
      const lower = search.trim().toLowerCase();
      out = out.filter(
        t =>
          (t.title && t.title.toLowerCase().includes(lower)) ||
          (t.desc && t.desc.toLowerCase().includes(lower)) ||
          (t.tags && t.tags.some(tt => tt.label.toLowerCase().includes(lower)))
      );
    }
    return out;
  }, [tools, search, category]);

  // Render
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
          color: "var(--palette-primary)",
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
          marginBottom: 18,
          textAlign: "center"
        }}>
        Your creative toolbox: Explore, learn, and build.
      </div>
      {/* Filter/search bar */}
      <FilterBar
        filters={[
          <select
            key="category"
            value={category}
            onChange={e => setCategory(e.target.value)}
            style={{
              background: "var(--background-secondary,#242b46)",
              color: "var(--accent)",
              fontWeight: 600,
              padding: "7px 16px",
              borderRadius: 16,
              border: "1.1px solid var(--border-color)",
              marginRight: 9,
              minWidth: 96
            }}
            aria-label="Filter by category"
          >
            {allCategories.map(cat =>
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            )}
          </select>,
          <input
            key="search"
            type="text"
            aria-label="Search tools"
            placeholder="Search tools…"
            maxLength={64}
            className="ch-search"
            value={search}
            style={{ background: "#1b2435", borderRadius: 18, minWidth: 178, fontSize: ".98em", marginRight: 7 }}
            onChange={e => setSearch(e.target.value)}
            autoComplete="off"
          />
        ]}
        style={{ marginBottom: 20, width: "100%" }}
      />
      {/* Loader state */}
      {loading && (
        <div className="dashboard-tool-card-grid"
          style={{
            display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))", gap: 32,
            alignItems: "stretch", justifyContent: "center", maxWidth: 1100, width: "100%",
            margin: "0 auto", padding: "0 12px"
          }}
        >
          {[1,2,3].map(idx => (
            <Card title={<SkeletonLoader width={120} />} key={"sk-"+idx}>
              <SkeletonLoader width="96%" height={46} style={{ marginBottom: 13 }} />
              <SkeletonLoader width="100%" height={22} />
              <SkeletonLoader width="80%" height={19} />
              <div style={{ marginTop: 14 }}>
                <SkeletonLoader width={66} height={21} />
                <SkeletonLoader width={39} height={21} style={{ display: "inline-block", marginLeft: 8 }} />
              </div>
            </Card>
          ))}
        </div>
      )}
      {/* No results */}
      {!loading && filteredTools.length === 0 && (
        <div style={{ color: "#E87A41", fontWeight: 500, margin: "34px 0" }}>
          No tools found. Try adjusting your search or filters.
        </div>
      )}
      {/* Tool cards */}
      {!loading && filteredTools.length > 0 && (
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
          {filteredTools.map(tool =>
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
      )}
    </section>
  );
}

export default DashboardView;
