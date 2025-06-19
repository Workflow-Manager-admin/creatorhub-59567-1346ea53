import React, { useState, useEffect, useMemo } from "react";
import GeminiInsightsModal from "./GeminiInsightsModal";
import Card from "./Card";
import SkeletonLoader from "./SkeletonLoader";
import FilterBar from "./FilterBar";
import HashtagGenerator from "./HashtagGenerator";
import CaptionGenerator from "./CaptionGenerator";
import HookGenerator from "./HookGenerator";
import SmallToolCard from "./SmallToolCard";
import DashboardQuickCards from "./DashboardQuickCards";
import { fetchYoutubeContent } from "../api/youtube";
import { fetchDevToContent } from "../api/devto";
import { fetchGeminiContent } from "../api/gemini";

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

/**
 * Single glassmorphic tool card, now with Gemini Insights support.
 * This component must be at the top level for hooks/imports.
 */
function ToolCard({ title, desc, accent, loading, Button, iconType }) {
  const [insightsOpen, setInsightsOpen] = useState(false);

  // Decide Gemini modal category by accent (default "Guide" for guides/resources, "Tool" for AI/gen)
  let geminiCategory = "Other";
  if (accent === "guide") geminiCategory = "Guide";
  if (accent === "tool") geminiCategory = "Tool";

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
          <div style={{ marginTop: 10, display: "flex", flexWrap: "wrap", gap: 7 }}>
            {Button ? Button : null}
            <button
              className="ch-info-btn"
              style={{
                background: "var(--btn-gradient-orange-red-focus)",
                color: "#fff",
                fontWeight: 700,
                minWidth: 95,
              }}
              type="button"
              onClick={e => {
                e.preventDefault();
                setInsightsOpen(true);
              }}
              tabIndex={0}
              aria-label={`Learn more about ${title}`}
            >
              <span aria-hidden="true" style={{ display: "inline-flex", alignItems: "center", marginRight: 6, fontSize: "1.11em" }}>
                <svg width="19" height="19" viewBox="0 0 20 20" fill="none"><path d="M3 4C3 3.44772 3.44772 3 4 3H14C14.5523 3 15 3.44772 15 4V16C15 16.5523 14.5523 17 14 17H4C3.44772 17 3 16.5523 3 16V4Z" stroke="#fff" strokeWidth="1.6" /><path d="M5 6H13" stroke="#fff" strokeWidth="1.2" strokeLinecap="round" /></svg>
              </span>
              Learn More
            </button>
          </div>
        </div>
      </div>
      {insightsOpen && (
        <GeminiInsightsModal
          open={insightsOpen}
          onClose={() => setInsightsOpen(false)}
          toolName={title}
          category={geminiCategory}
        />
      )}
    </Card>
  );
}

/**
 * PUBLIC_INTERFACE
 * DashboardView – displays dashboard widgets, tool cards, and quick access generators for core CreatorHub tools.
 */
function DashboardView({ user = { name: "Alex" } }) {
  // --- API data and loader state
  const [tools, setTools] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search and filter states
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

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
      const compiledTools = [];
      if (yt && yt[0]) {
        compiledTools.push({
          id: yt[0].id,
          accent: "guide",
          title: yt[0].title,
          desc: yt[0].description,
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
          (t.desc && t.desc.toLowerCase().includes(lower))
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
          color: "#FF0000",
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
        <DashboardQuickCards />
      )}
    </section>
  );
}

export default DashboardView;
