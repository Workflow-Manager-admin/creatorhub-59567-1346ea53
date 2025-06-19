import React, { useState, useEffect, useMemo } from "react";
import Card from "./Card";
import SkeletonLoader from "./SkeletonLoader";
import GeminiInsightsModal from "./GeminiInsightsModal";
// Import Generator components directly, as they will be passed as content
import HashtagGenerator from "./HashtagGenerator";
import CaptionGenerator from "./CaptionGenerator";
import HookGenerator from "./HookGenerator";
import ContentIdeaGenerator from "./ContentIdeaGenerator";
import PostPlanner from "./PostPlanner";

// Removed FilterBar, DashboardQuickCards, SmallToolCard imports
// import FilterBar from "./FilterBar";
// import DashboardQuickCards from "./LsmallToolCard"; // Typo fixed if it was there
// import SmallToolCard from "./SmallToolCard"; // Typo fixed if it was there

import { fetchYoutubeContent } from "../api/youtube";
import { fetchDevToContent } from "../api/devto";
import { fetchGeminiContent } from "../api/gemini";

// Helper: Placeholder for icon/lottie (remains mostly the same)
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
 * ToolCard component - now simplified and passed onLearnMore prop
 * and a direct Button prop.
 */
function ToolCard({ title, desc, accent, loading, Button, iconType, onLearnMore }) {
  // Decide Gemini modal category by accent (default "Other")
  let geminiCategory = "Other";
  if (accent === "guide") geminiCategory = "Guide";
  if (accent === "tool") geminiCategory = "Tool";

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
            {/* Learn More button now opens the central GeminiInsightsModal */}
            <button
              className="dashboard-card-info-icon" // Re-using the class for styling simplicity
              style={{
                position: "absolute", // Position it bottom-right of the card
                bottom: "1rem",
                right: "1rem",
                color: "#ccc",
                background: "transparent",
                border: "none",
                fontSize: "1.5rem",
                padding: 0,
                cursor: "pointer",
                // Ensure visibility and interaction
                zIndex: 1
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
              {/* Info icon */}
              <svg
                width="25"
                height="25"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
                focusable="false"
              >
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                <rect x="11" y="10" width="2" height="6" rx="1" fill="currentColor" />
                <rect x="11" y="7" width="2" height="2" rx="1" fill="currentColor" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </Card>
  );
}

/**
 * CarouselSection component (re-integrated from previous version)
 * Handles horizontal scrolling with navigation arrows.
 */
function CarouselSection({ title, items, CardComp, accent }) {
  const [scrollIdx, setScrollIdx] = useState(0);
  const CARD_WIDTH = 340; // Original card width
  const GAP_WIDTH = 28;   // Original gap width
  const TOTAL_CARD_SPACE = CARD_WIDTH + GAP_WIDTH; // 368px
  const CARDS_VISIBLE = 3;

  // Clamp scrollIdx so we never go out of bounds
  useEffect(() => {
    // Max scroll index: total items minus visible cards.
    // If items.length is less than CARDS_VISIBLE, maxScrollIdx will be 0 or negative, clamped to 0.
    const maxScrollIdx = Math.max(0, items.length - CARDS_VISIBLE);
    if (scrollIdx > maxScrollIdx) {
      setScrollIdx(maxScrollIdx);
    }
  }, [items.length, scrollIdx, CARDS_VISIBLE]);

  const canScrollLeft = scrollIdx > 0;
  const canScrollRight = scrollIdx + CARDS_VISIBLE < items.length;

  function handleLeft() {
    if (canScrollLeft) setScrollIdx(prevIdx => prevIdx - 1);
  }
  function handleRight() {
    if (canScrollRight) setScrollIdx(prevIdx => prevIdx + 1);
  }

  return (
    <div style={{ width: "100%", margin: "0 0 30px 0", maxWidth: 1200 }}>
      <div style={{
        display: "flex",
        alignItems: "center",
        marginBottom: 9,
        justifyContent: "space-between"
      }}>
        <div style={{
          fontWeight: 800,
          fontSize: "1.22rem",
          // Dynamic color based on accent type
          color: accent === "guide" ? "var(--accent)" : accent === "tool" ? "#FF4500" : "var(--accent)", // Red for tools
          flex: 1,
          letterSpacing: "-0.02em"
        }}>
          {title}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 9, marginLeft: 13 }}>
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
              // outline: "none", // Explicitly ensure no outline
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
              // outline: "none" // Explicitly ensure no outline
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
          overflow: "hidden",
          position: "relative",
          paddingBottom: 7,
          // Total width for 3 cards + 2 gaps
          width: (CARD_WIDTH * CARDS_VISIBLE) + (GAP_WIDTH * (CARDS_VISIBLE - 1)), // 340*3 + 28*2 = 1020 + 56 = 1076px
          maxWidth: "100%",
          margin: "0 auto"
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: GAP_WIDTH, // Use GAP_WIDTH constant
            transition: "transform 0.33s cubic-bezier(.47, .12, .18, 1.1)",
            willChange: "transform",
            transform: `translateX(-${scrollIdx * TOTAL_CARD_SPACE}px)`, // Use TOTAL_CARD_SPACE
            minHeight: 176,
            // Adjust overall width of the inner container to accommodate all items with gaps
            width: items.length * TOTAL_CARD_SPACE,
            boxSizing: "content-box"
          }}
        >
          {items.map((item, idx) => (
            <div
              key={item.id || item.title || idx}
              style={{
                minWidth: CARD_WIDTH, // Use CARD_WIDTH constant
                maxWidth: CARD_WIDTH, // Use CARD_WIDTH constant
                flex: `0 0 ${CARD_WIDTH}px`
              }}
            >
              <CardComp {...item} />
            </div>
          ))}
          {/* Add empty padding divs if there are less than CARDS_VISIBLE items */}
          {items.length < CARDS_VISIBLE &&
            Array.from({ length: CARDS_VISIBLE - items.length }).map((_, idx) => (
              <div key={"pad" + idx} style={{ minWidth: CARD_WIDTH, maxWidth: CARD_WIDTH, flex: `0 0 ${CARD_WIDTH}px` }} />
            ))
          }
        </div>
      </div>
    </div>
  );
}


/**
 * DashboardView – displays dashboard carousels for guides and tools, plus quick tool cards.
 * Filter/search bar is removed. Two horizontally-scrollable carousels (Guides, Tools) show 3 cards at a time
 * with navigation arrows and smoothly scrollable, visually accessible layout and styling.
 */
function DashboardView({ user = { name: "Alex" } }) {
  // ----- State for combined tools/guides data -----
  const [allContentCards, setAllContentCards] = useState([]);
  const [loading, setLoading] = useState(true);

  // ----- Modal state for Gemini Insights (centralized) -----
  const [insightsModal, setInsightsModal] = useState({
    open: false,
    toolName: "",
    category: "Other"
  });

  // ----- Modal state for opening actual tools (like generators) -----
  const [toolModal, setToolModal] = useState({
    open: false,
    title: "",
    content: null // This will hold the React component for the tool (e.g., <HashtagGenerator />)
  });

  // Fetch API content and prepare all cards
  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    const quickAccessTools = [
      {
        id: "hashtag-gen",
        accent: "tool",
        title: "Hashtag Generator",
        desc: "Suggested hashtags for engagement & trending topics.",
        iconType: "lottie",
        Button: (
          <button
            className="ch-info-btn"
            onClick={() => setToolModal({ open: true, title: "Hashtag Generator", content: <HashtagGenerator /> })}
          >
            Open Tool
          </button>
        ),
      },
      {
        id: "caption-gen",
        accent: "tool",
        title: "Caption Generator",
        desc: "Type a topic and pick a tone for fresh caption ideas.",
        iconType: "icon",
        Button: (
          <button
            className="ch-info-btn"
            onClick={() => setToolModal({ open: true, title: "Caption Generator", content: <CaptionGenerator /> })}
          >
            Open Tool
          </button>
        ),
      },
      {
        id: "hook-gen",
        accent: "tool",
        title: "Hook Generator",
        desc: "Get attention-grabbing hooks for Reels, Shorts, TikToks, and more.",
        iconType: "lottie",
        Button: (
          <button
            className="ch-info-btn"
            onClick={() => setToolModal({ open: true, title: "Hook Generator", content: <HookGenerator /> })}
          >
            Open Tool
          </button>
        ),
      },
      {
        id: "content-idea-gen",
        accent: "tool",
        title: "Content Idea Generator",
        desc: "Brainstorm winning content ideas for any topic or audience, powered by AI.",
        iconType: "lottie",
        Button: (
          <button
            className="ch-info-btn"
            onClick={() => setToolModal({ open: true, title: "Content Idea Generator", content: <ContentIdeaGenerator /> })}
          >
            Open Tool
          </button>
        ),
      },
      {
        id: "post-planner",
        accent: "tool",
        title: "Post Planner",
        desc: "Get a full weekly post plan based on your content goal.",
        iconType: "icon",
        Button: (
          <button
            className="ch-info-btn"
            onClick={() => setToolModal({ open: true, title: "Post Planner", content: <PostPlanner /> })}
          >
            Open Tool
          </button>
        ),
      }
    ];

    Promise.all([
      fetchYoutubeContent(),
      fetchDevToContent(),
      fetchGeminiContent()
    ]).then(([youtubeArr, devtoArr, geminiArr]) => {
      if (!isMounted) return;

      const fetchedGuides = [];

      // YouTube video (guide)
      if (youtubeArr && youtubeArr[0]) {
        fetchedGuides.push({
          id: youtubeArr[0].id || "yt-guide-1",
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

      // Instagram guide (manual static card)
      fetchedGuides.push({
        id: "instagram-creator-guide",
        accent: "guide",
        title: "Instagram Best Practices for Creators",
        desc: "Boost your reach, engage your audience, and master Instagram features.",
        iconType: "icon",
        Button: (
          <a
            href="https://help.instagram.com/366992426735657"
            className="ch-info-btn"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram Creator Guide Help Center"
          >
            Visit Guide
          </a>
        ),
      });

      // Dev.to articles (guides)
      if (devtoArr && devtoArr.length) {
        devtoArr.forEach(article => {
          fetchedGuides.push({
            id: article.id || `devto-guide-${Math.random()}`, // Ensure unique ID
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

      // Gemini AI content (guides) - assuming these are informational/text-based
      if (geminiArr && geminiArr.length) {
        geminiArr.forEach(item => {
          fetchedGuides.push({
            id: item.id || `gemini-guide-${Math.random()}`, // Ensure unique ID
            accent: "guide",
            title: item.title,
            desc: item.result || "Gemini AI Demo (Text Generation)", // Refined desc
            iconType: "lottie",
            // Assuming these Gemini items don't "open a tool" but provide info
            Button: (
              <button className="ch-info-btn" disabled>
                View Content
              </button>
            ),
          });
        });
      }

      // Combine all content: Quick Access Tools (red) + Fetched Guides (blue)
      // The order here defines which category gets which accent based on previous discussions.
      setAllContentCards([...quickAccessTools, ...fetchedGuides]);
      setLoading(false);
    });
    return () => { isMounted = false; };
  }, []); // Empty dependency array means this runs once on mount

  // Classify content for carousels using useMemo for performance
  const guides = useMemo(() => allContentCards.filter(card => card.accent === "guide"), [allContentCards]);
  const tools = useMemo(() => allContentCards.filter(card => card.accent === "tool"), [allContentCards]);


  // Modal handlers
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

  const handleCloseToolModal = () => {
    setToolModal({ open: false, title: "", content: null });
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
          {/* Skeleton Loaders for Guides Carousel */}
          <div style={{ width: "100%", maxWidth: 1200, margin: "0 0 30px 0" }}>
            <div style={{ fontWeight: 800, fontSize: "1.22rem", color: "var(--accent)", marginBottom: 9 }}>Guides</div>
            <div style={{ display: "flex", gap: 28, minHeight: 176 }}>
              {[1, 2, 3].map(idx => (
                <div key={"sk-gd-" + idx} style={{ minWidth: 340, maxWidth: 340, flex: "0 0 340px" }}>
                  <Card title={<SkeletonLoader width={120} />}>
                    <SkeletonLoader width="96%" height={46} style={{ marginBottom: 13 }} />
                    <SkeletonLoader width="100%" height={22} />
                    <div style={{ marginTop: 10, display: "flex", gap: 7 }}>
                      <SkeletonLoader width={95} height={36} />
                      <SkeletonLoader width={95} height={36} />
                    </div>
                  </Card>
                </div>
              ))}
            </div>
          </div>

          {/* Skeleton Loaders for Tools Carousel */}
          <div style={{ width: "100%", maxWidth: 1200, margin: "0 0 30px 0" }}>
            <div style={{ fontWeight: 800, fontSize: "1.22rem", color: "#FF4500", marginBottom: 9 }}>Tools</div>
            <div style={{ display: "flex", gap: 28, minHeight: 176 }}>
              {[1, 2, 3].map(idx => (
                <div key={"sk-tl-" + idx} style={{ minWidth: 340, maxWidth: 340, flex: "0 0 340px" }}>
                  <Card title={<SkeletonLoader width={110} />}>
                    <SkeletonLoader width="80%" height={32} />
                    <SkeletonLoader width="70%" height={26} />
                    <div style={{ marginTop: 10, display: "flex", gap: 7 }}>
                      <SkeletonLoader width={95} height={36} />
                      <SkeletonLoader width={95} height={36} />
                    </div>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Guides Carousel */}
          {guides.length > 0 && ( // Only render if there are guides
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
          )}

          {/* Tools Carousel */}
          {tools.length > 0 && ( // Only render if there are tools
            <CarouselSection
              title="Tools"
              items={tools}
              CardComp={props => (
                <ToolCard
                  {...props}
                  accent="tool"
                  onLearnMore={handleOpenInsightsModal} // Tools can also have insights
                  loading={false}
                />
              )}
              accent="tool"
            />
          )}
        </>
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

      {/* Central Tool Modal for Hashtag/Caption/Hook Generators */}
      {toolModal.open && (
        <GeminiInsightsModal // Re-using GeminiInsightsModal for consistency, but passing direct content
          open={toolModal.open}
          onClose={handleCloseToolModal}
          toolName={toolModal.title}
          category="Tool" // Explicitly "Tool" category for these
          // Pass the actual component as children for render inside the modal
          children={toolModal.content}
          isGenerator={true} // Add a prop to distinguish if it's a generator, for conditional rendering inside modal
        />
      )}
    </section>
  );
}

export default DashboardView;