import React, { useState, useEffect, useMemo } from "react";
import GeminiInsightsModal from "./GeminiInsightsModal";
import Card from "./Card";
import SkeletonLoader from "./SkeletonLoader";
import FilterBar from "./FilterBar";
import DashboardQuickCards from "./DashboardQuickCards";
import { fetchYoutubeContent } from "../api/youtube";
import { fetchDevToContent } from "../api/devto";
import { fetchGeminiContent } from "../api/gemini";

// PUBLIC_INTERFACE
/**
 * DashboardView – displays dashboard widgets, tool cards, and quick access generators.
 * Every card (including quick access tools) now includes a 'Learn More' button which triggers
 * the GeminiInsightsModal, with modal state, handlers, and event propagation managed at this level.
 */
function DashboardView({ user = { name: "Alex" } }) {
  // ----- State for tools fetched from APIs -----
  const [toolCards, setToolCards] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search/filter state for tools
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [allCategories, setAllCategories] = useState([{ label: "All", value: "all" }]);

  // ----- Modal state for Gemini Insights -----
  const [insightsModal, setInsightsModal] = useState({
    open: false,
    toolName: "",
    category: "Other"
  });

  // ----- Fetch API tools/resources on mount -----
  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    Promise.all([
      fetchYoutubeContent(),
      fetchDevToContent(),
      fetchGeminiContent()
    ]).then(([youtubeArr, devtoArr, geminiArr]) => {
      if (!isMounted) return;
      const result = [];

      // YouTube video (guide, 1st one)
      if (youtubeArr && youtubeArr[0]) {
        result.push({
          id: youtubeArr[0].id || "yt",
          accent: "guide",
          title: youtubeArr[0].title,
          desc: youtubeArr[0].description,
          iconType: "lottie",
          Button: (
            <a
              href={youtubeArr[0].url}
              className="ch-info-btn"
              target="_blank"
              rel="noopener noreferrer"
            >
              Watch
            </a>
          ),
        });
      }

      // Dev.to articles (guides)
      if (devtoArr && devtoArr.length) {
        devtoArr.forEach(article => {
          result.push({
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
            ),
          });
        });
      }

      // Gemini stub demos (tool category)
      if (geminiArr && geminiArr.length) {
        geminiArr.forEach(item => {
          result.push({
            id: item.id,
            accent: "tool",
            title: item.title,
            desc: item.result || "Gemini AI Demo",
            iconType: "lottie",
            Button: (
              <button className="ch-info-btn" disabled>
                Demo
              </button>
            ),
          });
        });
      }

      setToolCards(result);
      // Collect unique tags/categories if present for filter (stub logic)
      setAllCategories([{ label: "All", value: "all" }]);
      setLoading(false);
    });
    return () => { isMounted = false; };
  }, []);

  // ----- Filtering logic -----
  const filteredTools = useMemo(() => {
    let tools = toolCards;
    if (category && category !== "all") {
      // No actual tag support in mock, but ready for future
      tools = tools.filter(t => t.accent === category);
    }
    if (search && search.trim()) {
      const lower = search.trim().toLowerCase();
      tools = tools.filter(t =>
        (t.title && t.title.toLowerCase().includes(lower)) ||
        (t.desc && t.desc.toLowerCase().includes(lower))
      );
    }
    return tools;
  }, [toolCards, search, category]);

  // ----- Gemini modal handlers at DashboardView level -----
  // PUBLIC_INTERFACE
  const handleOpenInsightsModal = (toolName, cat) => {
    setInsightsModal({
      open: true,
      toolName,
      category: cat || "Other",
    });
  };
  // PUBLIC_INTERFACE
  const handleCloseInsightsModal = () => {
    setInsightsModal(cur => ({ ...cur, open: false }));
  };

  // ----- Card implementations -----
  // Inline Icon/Lottie placeholder (glassmorphic)
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
          <div style={{
            width: 26, height: 26, borderRadius: 13,
            background: "linear-gradient(135deg,#1E90FF 60%,#FF7E5F 110%)",
            filter: "blur(1px) brightness(1.1)",
            opacity: 0.93,
            animation: "bounce 1.6s infinite alternate"
          }} />
        ) : (
          <svg width={size - 22} height={size - 22} viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="#FF7E5F" strokeWidth="3" />
          </svg>
        )}
        <style>
          {`@keyframes bounce {
              0% {transform: scale(0.93);}
              70% {transform: scale(1.08);}
              100% {transform: scale(1.0);}
            }`
          }
        </style>
      </div>
    );
  }

  // ToolCard – canonical for dashboard fetched cards (guides/tools)
  function ToolCard({ title, desc, accent, loading, Button, iconType, onLearnMore }) {
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
                  onLearnMore && onLearnMore(title, geminiCategory);
                }}
                tabIndex={0}
                aria-label={`Learn more about ${title}`}
              >
                <span
                  aria-hidden="true"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    marginRight: 6,
                    fontSize: "1.11em"
                  }}
                >
                  <svg width="19" height="19" viewBox="0 0 20 20" fill="none">
                    <path d="M3 4C3 3.44772 3.44772 3 4 3H14C14.5523 3 15 3.44772 15 4V16C15 16.5523 14.5523 17 14 17H4C3.44772 17 3 16.5523 3 16V4Z" stroke="#fff" strokeWidth="1.6" />
                    <path d="M5 6H13" stroke="#fff" strokeWidth="1.2" strokeLinecap="round" />
                  </svg>
                </span>
                Learn More
              </button>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  // ----- Render -----
  return (
    <section
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        minHeight: "86vh",
        width: "100%",
        marginTop: 32,
      }}
    >
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
        }}
      >
        Welcome back, {user.name} <span role="img" aria-label="wave">👋</span>
      </div>
      <div
        style={{
          fontSize: "1.22em",
          color: "var(--text-secondary)",
          fontWeight: 400,
          marginBottom: 18,
          textAlign: "center"
        }}
      >
        Your creative toolbox: Explore, learn, and build.
      </div>
      {/* Filters */}
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

      {/* Loader when fetching */}
      {loading && (
        <div className="dashboard-tool-card-grid"
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
          {[1, 2, 3].map(idx => (
            <Card title={<SkeletonLoader width={120} />} key={"sk-" + idx}>
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

      {/* Main tool/resource cards (all include 'Learn More') */}
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
            padding: "0 12px",
            marginBottom: 27,
          }}
        >
          {filteredTools.map(tool => (
            <ToolCard
              key={tool.id || tool.title}
              title={tool.title}
              desc={tool.desc}
              accent={tool.accent}
              loading={false}
              Button={tool.Button}
              iconType={tool.iconType}
              onLearnMore={handleOpenInsightsModal}
            />
          ))}
        </div>
      )}

      {/* Quick access tool cards (Hashtag/Caption/Hook Generators) – pass modal control */}
      {!loading && (
        <DashboardQuickCards
          onLearnMore={handleOpenInsightsModal}
        />
      )}

      {/* Central Gemini InsightsModal for any card */}
      {insightsModal.open && (
        <GeminiInsightsModal
          open={insightsModal.open}
          onClose={handleCloseInsightsModal}
          toolName={insightsModal.toolName}
          category={insightsModal.category}
        />
      )}
    </section>
  );
}

export default DashboardView;
