import React, { useState, useEffect, useRef } from "react";
import GeminiInsightsModal from "./GeminiInsightsModal";
import Card from "./Card";
import SkeletonLoader from "./SkeletonLoader";
import DashboardQuickCards from "./DashboardQuickCards";
import { fetchYoutubeContent } from "../api/youtube";
import { fetchDevToContent } from "../api/devto";
import { fetchGeminiContent } from "../api/gemini";

// PUBLIC_INTERFACE
/**
 * DashboardView – displays dashboard carousels for guides and tools, plus quick tool cards.
 * Filter/search bar is removed. Two horizontally-scrollable carousels (Guides, Tools) show 3 cards at a time
 * with navigation arrows and smoothly scrollable, visually accessible layout and styling.
 */
function DashboardView({ user = { name: "Alex" } }) {
  // ----- State for tools fetched from APIs -----
  const [toolCards, setToolCards] = useState([]);
  const [loading, setLoading] = useState(true);

  // ----- Modal state for Gemini Insights -----
  const [insightsModal, setInsightsModal] = useState({
    open: false,
    toolName: "",
    category: "Other"
  });

  // Fetch API tools/resources on mount
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
      setLoading(false);
    });
    return () => { isMounted = false; };
  }, []);

  // ----- Carousel section helpers -----
  function CarouselSection({ title, items, CardComp, accent }) {
    // Carousel scroll index state
    const [scrollIdx, setScrollIdx] = useState(0);
    const rowRef = useRef();
    const CARDS_VISIBLE = 3;
    const canScrollLeft = scrollIdx > 0;
    const canScrollRight = scrollIdx + CARDS_VISIBLE < items.length;

    function scrollTo(newIdx) {
      setScrollIdx(newIdx);
      if (rowRef.current) {
        const node = rowRef.current.children[newIdx];
        if (node?.scrollIntoView) {
          node.scrollIntoView({ behavior: "smooth", inline: "start" });
        }
      }
    }

    function handleLeft() {
      if (canScrollLeft) scrollTo(scrollIdx - 1);
    }
    function handleRight() {
      if (canScrollRight) scrollTo(scrollIdx + 1);
    }

    return (
      <div style={{ width: "100%", margin: "0 0 30px 0", maxWidth: 1200 }}>
        <div style={{ display: "flex", alignItems: "center", marginBottom: 9 }}>
          <div style={{
            fontWeight: 800,
            fontSize: "1.22rem",
            color: accent === "guide" ? "var(--accent)" : accent === "tool" ? "#FF7E5F" : "var(--accent)",
            flex: 1,
            letterSpacing: "-0.02em"
          }}>
            {title}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
            <button
              aria-label={`Scroll ${title} left`}
              onClick={handleLeft}
              disabled={!canScrollLeft}
              style={{
                background: "none",
                border: "none",
                color: canScrollLeft ? "var(--accent)" : "#8889",
                cursor: canScrollLeft ? "pointer" : "default",
                fontSize: "2.1rem",
                transition: "color 0.13s",
                outline: canScrollLeft ? "var(--focus-outline)" : "none",
                marginRight: 2
              }}
              tabIndex={0}
              type="button"
            >
              <svg width={33} height={33} viewBox="0 0 28 28" fill="none"><path d="M17.4 19.15 12.23 14c-.13-.13-.2-.26-.2-.41 0-.15.07-.28.2-.41l5.17-5.16a.58.58 0 0 0 0-.82.594.594 0 0 0-.82 0L10.6 13.18a.58.58 0 0 0 0 .82l5.99 5.98a.594.594 0 0 0 .82 0 .58.58 0 0 0 0-.82Z" fill="currentColor"/></svg>
            </button>
            <button
              aria-label={`Scroll ${title} right`}
              onClick={handleRight}
              disabled={!canScrollRight}
              style={{
                background: "none",
                border: "none",
                color: canScrollRight ? "var(--accent)" : "#8889",
                cursor: canScrollRight ? "pointer" : "default",
                fontSize: "2.1rem",
                transition: "color 0.13s",
                outline: canScrollRight ? "var(--focus-outline)" : "none"
              }}
              tabIndex={0}
              type="button"
            >
              <svg width={33} height={33} viewBox="0 0 28 28" fill="none"><path d="M10.6 8.85 15.77 14c.13.13.2.26.2.41 0 .15-.07.28-.2.41l-5.17 5.16a.58.58 0 0 0 0 .82c.23.23.6.23.82 0l5.99-5.98a.58.58 0 0 0 0-.82l-5.99-5.98a.594.594 0 0 0-.82 0 .58.58 0 0 0 0 .82Z" fill="currentColor"/></svg>
            </button>
          </div>
        </div>
        <div
          style={{
            overflowX: "auto",
            scrollbarWidth: "none",
            WebkitOverflowScrolling: "touch",
            position: "relative",
            paddingBottom: 7
          }}
          tabIndex={0}
        >
          <div
            ref={rowRef}
            style={{
              display: "flex",
              flexDirection: "row",
              gap: 28,
              transition: "transform 0.33s cubic-bezier(.47, .12, .18, 1.1)",
              willChange: "transform",
              transform: `translateX(-${scrollIdx * 340}px)`,
              minHeight: 176
            }}
          >
            {items.map((item, idx) => (
              <div key={item.id || item.title || idx} style={{ minWidth: 340, maxWidth: 340, flex: "0 0 340px" }}>
                <CardComp {...item} />
              </div>
            ))}
            {items.length < CARDS_VISIBLE &&
              Array.from({ length: CARDS_VISIBLE - items.length }).map((_, idx) => (
                <div key={"pad" + idx} style={{ minWidth: 340, maxWidth: 340, flex: "0 0 340px" }} />
              ))
            }
          </div>
        </div>
      </div>
    );
  }

  // ToolCard
  function ToolCard({ title, desc, accent, loading, Button, iconType, onLearnMore }) {
    let geminiCategory = "Other";
    if (accent === "guide") geminiCategory = "Guide";
    if (accent === "tool") geminiCategory = "Tool";

    // Minimalist icon/graphic
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

    return (
      <Card title={title}>
        <div style={{ display: "flex", alignItems: "flex-start", position: "relative" }}>
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
                className="dashboard-card-info-icon"
                style={{
                  position: "absolute",
                  bottom: "1rem",
                  right: "1rem",
                  color: "#ccc",
                  background: "transparent",
                  border: "none",
                  fontSize: "1.5rem",
                  padding: 0,
                  cursor: "pointer"
                }}
                type="button"
                onClick={e => {
                  e.preventDefault();
                  onLearnMore && onLearnMore(title, geminiCategory);
                }}
                tabIndex={0}
                aria-label={`Show AI insights for ${title}`}
                title="Show AI insights"
              >
                <svg
                  width="25"
                  height="25"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                  focusable="false"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <rect
                    x="11"
                    y="10"
                    width="2"
                    height="6"
                    rx="1"
                    fill="currentColor"
                  />
                  <rect
                    x="11"
                    y="7"
                    width="2"
                    height="2"
                    rx="1"
                    fill="currentColor"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  // Classify dashboard cards for "Guides" and "Tools" carousels
  const guides = toolCards.filter(card => card.accent === "guide");
  const tools = toolCards.filter(card => card.accent === "tool");

  // Modal handler
  const handleOpenInsightsModal = (toolName, cat) => {
    setInsightsModal({
      open: true,
      toolName,
      category: cat || "Other",
    });
  };
  const handleCloseInsightsModal = () => {
    setInsightsModal(cur => ({ ...cur, open: false }));
  };

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
      {/* Carousels */}
      {loading ? (
        <>
          <div style={{ width: "100%", maxWidth: 1200 }}>
            <div style={{ fontWeight: 800, fontSize: "1.22rem", color: "var(--accent)", marginBottom: 9 }}>Guides</div>
            <div style={{ display: "flex", gap: 28 }}>
              {[1, 2, 3].map(idx => (
                <div key={"sk-gd-" + idx} style={{ minWidth: 340, maxWidth: 340, flex: "0 0 340px" }}>
                  <Card title={<SkeletonLoader width={120} />}>
                    <SkeletonLoader width="96%" height={46} style={{ marginBottom: 13 }} />
                    <SkeletonLoader width="100%" height={22} />
                  </Card>
                </div>
              ))}
            </div>
          </div>
          <div style={{ width: "100%", maxWidth: 1200, marginTop: 20 }}>
            <div style={{ fontWeight: 800, fontSize: "1.22rem", color: "#FD3A69", marginBottom: 9 }}>Tools</div>
            <div style={{ display: "flex", gap: 28 }}>
              {[1, 2, 3].map(idx => (
                <div key={"sk-tl-" + idx} style={{ minWidth: 340, maxWidth: 340, flex: "0 0 340px" }}>
                  <Card title={<SkeletonLoader width={110} />}>
                    <SkeletonLoader width="80%" height={32} />
                    <SkeletonLoader width="70%" height={26} />
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <>
          <CarouselSection
            title="Guides"
            items={guides}
            CardComp={props => (
              <ToolCard
                {...props}
                accent="guide"
                onLearnMore={handleOpenInsightsModal}
                loading={false}
              />
            )}
            accent="guide"
          />
          <CarouselSection
            title="Tools"
            items={tools}
            CardComp={props => (
              <ToolCard
                {...props}
                accent="tool"
                onLearnMore={handleOpenInsightsModal}
                loading={false}
              />
            )}
            accent="tool"
          />
        </>
      )}
      {/* Quick access tool cards in grid below carousels */}
      {!loading && (
        <div style={{ width: "100%", maxWidth: 1200, marginBottom: 40 }}>
          <DashboardQuickCards onLearnMore={handleOpenInsightsModal} />
        </div>
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
