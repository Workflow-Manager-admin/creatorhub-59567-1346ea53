/**
 * PUBLIC_INTERFACE
 * DashboardView – displays dashboard widgets, tool cards, and quick access generators for core CreatorHub tools.
 */
import React, { useState, useEffect, useMemo } from "react";
import Card from "./Card";
import SkeletonLoader from "./SkeletonLoader";
import FilterBar from "./FilterBar";
import HashtagGenerator from "./HashtagGenerator";
import CaptionGenerator from "./CaptionGenerator";
import HookGenerator from "./HookGenerator";
import SmallToolCard from "./SmallToolCard";
import { fetchYoutubeContent } from "../api/youtube";
import { fetchDevToContent } from "../api/devto";
import { fetchGeminiContent } from "../api/gemini";

// Helper: Tag badge - COMMENTING OUT THIS ENTIRE COMPONENT
/*
function CategoryTag({ children, accent }) {
  // accent: ("tool"|"guide"|"new"|...)
  let style = {}; // Start with an empty style object
  // These styles are handled by .ch-card-tag. Only accent-specific overrides remain.
  if (accent === "guide") {
    // Updated to bright red and vibrant gradient
    style.background = "linear-gradient(89deg, #FF634720, #FF634755)"; // Tomato red gradient
    style.color = "#FF6347"; // Tomato red
  }
  if (accent === "tool") {
    // Updated to bright red and vibrant gradient
    style.background = "linear-gradient(90deg, #FF450088, #CD5C5C42)"; // OrangeRed to IndianRed gradient
    style.color = "#FF4500"; // OrangeRed
  }
  if (accent === "new") {
    style.background = "var(--accent-gradient)"; // Keep original accent gradient
    style.color = "#FF0000"; // Bright Red
  }
  return (
    <span className="ch-card-tag" style={style}>{children}</span>
  );
}
*/
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
function ToolCard({ title, desc, /* tags, REMOVED */ accent, loading, Button, iconType, onClick }) {
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
          {/* REMOVED THE TAG RENDERING BLOCK */}
          {/*
          <div style={{ marginTop: 10, marginBottom: 12 }}>
            {tags &&
              tags.map(tag => (
                <CategoryTag key={tag.label} accent={tag.accent}>
                  #{tag.label}
                </CategoryTag>
              ))}
          </div>
          */}
          {/* Button is passed as a React element, its styles should be handled by its own className */}
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
      fetchGeminiContent()
    ]).then(([yt, devto, gemini]) => {
      if (!mounted) return;
      // Flatten all sources to "tools" cards array
      const compiledTools = [];
      if (yt && yt[0]) {
        compiledTools.push({
          id: yt[0].id,
          accent: "guide",
          title: yt[0].title,
          desc: yt[0].description,
          // tags: [{ label: "YouTube", accent: "guide" }], // REMOVED
          iconType: "lottie",
          Button: (
            <a
              href={yt[0].url}
              className="ch-info-btn"
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
            // tags: [ // REMOVED
            //   { label: "DevTo", accent: "guide" },
            //   ...(article.tags || []).map(t => ({ label: t, accent: "guide" }))
            // ],
            iconType: "icon",
            Button: (
              <a
                href={
                  article.url && /^https:\/\/dev\.to\//.test(article.url)
                    ? article.url
                    : "https://dev.to/"
                }
                className="ch-info-btn"
                target="_blank"
                rel="noopener noreferrer"
              >
                Read
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
            // tags: [ { label: "AI", accent: "tool" } ], // REMOVED
            iconType: "lottie",
            Button: (
              <button
                className="ch-info-btn"
                disabled
              >
                Demo
              </button>
            )
          })
        );
      }
      setTools(compiledTools);
      // Flatten tags - This can also be removed if tags are not used for filtering anymore
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

  // Filtered tools per search and category - Adjusted to remove tag filtering
  const filteredTools = useMemo(() => {
    let out = tools;
    if (category && category !== "all") {
      // If you're no longer using tags, this category filtering logic might need adjustment
      // to filter by source type (youtube, devto, gemini) if desired.
      // For now, I'm keeping it as is, assuming 'category' might still refer to source.
      // If categories were solely based on "tags", this part will need a re-think if tags are gone.
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
          (t.desc && t.desc.toLowerCase().includes(lower))
          // || (t.tags && t.tags.some(tt => tt.label.toLowerCase().includes(lower))) // REMOVED tag filtering from text search
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
          color: "#FF0000", // Changed to bright red
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
      {!loading && (
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
          {/* Quick Access Tools as peer cards - unified small card layout */}
          <SmallToolCard
            title="Hashtag Generator"
            desc="Suggested hashtags for engagement & trending topics. Enter your niche!"
            // tags={[{ label: "Generator", accent: "tool" }]} // REMOVED
            iconType="lottie"
            Button={
              <a
                href="#"
                className="ch-info-btn"
                onClick={e => { e.preventDefault(); }}
                tabIndex={0}
                aria-label="Open Hashtag Generator"
              >
                Open Tool
              </a>
            }
            toolContent={<HashtagGenerator />}
          />
          <SmallToolCard
            title="Caption Generator"
            desc="Type a topic and pick a tone for fresh caption ideas."
            // tags={[{ label: "Generator", accent: "tool" }]} // REMOVED
            iconType="icon"
            Button={
              <a
                href="#"
                className="ch-info-btn"
                onClick={e => { e.preventDefault(); }}
                tabIndex={0}
                aria-label="Open Caption Generator"
              >
                Open Tool
              </a>
            }
            toolContent={<CaptionGenerator />}
          />
          <SmallToolCard
            title="Hook Generator"
            desc="Get attention-grabbing hooks for Reels, Shorts, TikToks, and more."
            // tags={[{ label: "Generator", accent: "tool" }]} // REMOVED
            iconType="lottie"
            Button={
              <a
                href="#"
                className="ch-info-btn"
                onClick={e => { e.preventDefault(); }}
                tabIndex={0}
                aria-label="Open Hook Generator"
              >
                Open Tool
              </a>
            }
            toolContent={<HookGenerator />}
          />
          {/* Resource Tool Cards */}
          {filteredTools.length > 0 ? (
            filteredTools.map(tool =>
              <ToolCard
                key={tool.id}
                title={tool.title}
                desc={tool.desc}
                // tags={tool.tags} // REMOVED
                accent={tool.accent}
                loading={tool.loading}
                Button={tool.Button}
                iconType={tool.iconType}
              />
            )
          ) : null}
        </div>
      )}
    </section>
  );
}

export default DashboardView;