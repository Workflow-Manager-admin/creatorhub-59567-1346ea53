import React, { useState, useMemo } from "react";
import Card from "./Card";
import Loader from "./Loader"; // Not used, can be removed if not planned for future use
import SkeletonLoader from "./SkeletonLoader";
import Modal from "./Modal";
import FilterBar from "./FilterBar";
import useFetchWithSkeleton from "../hooks/useFetchWithSkeleton";
import { fetchYoutubeContent } from "../api/youtube";
import { fetchDevToContent } from "../api/devto";
import { fetchGeminiContent } from "../api/gemini";

// PUBLIC_INTERFACE
function MainContainer({ children }) {
  /**
   * Main content area for dashboards, API tools, etc.
   * Demonstrates fast load with skeletons/loaders and API stub integration.
   * Adds: filter/search, modal, dark mode demonstration, all features wired for professional UX.
   */
  // Load stub APIs
  const [ytData, ytLoading, ytError] = useFetchWithSkeleton(fetchYoutubeContent, []);
  const [devtoData, devtoLoading, devtoError] = useFetchWithSkeleton(fetchDevToContent, []);
  const [geminiData, geminiLoading, geminiError] = useFetchWithSkeleton(fetchGeminiContent, []);
  // Modal state demo
  const [modalOpen, setModalOpen] = useState(false);

  // Filtering by source or tag (for demo, sources: youtube/devto/gemini; tags for devto)
  const [filter, setFilter] = useState("all");
  const [textFilter, setTextFilter] = useState("");

  // Get all loaded cards as a flat list for filtering (simulate a unified resource board)
  const allCards = useMemo(() => {
    // Card format: { id, source, title, extra... }
    const cards = [];
    if (ytData && ytData.length)
      cards.push({
        id: ytData[0].id,
        source: "youtube",
        title: ytData[0].title,
        description: ytData[0].description,
        url: ytData[0].url,
        channel: ytData[0].channel,
        thumbnail: ytData[0].thumbnail
      });
    if (devtoData && devtoData.length) {
      devtoData.forEach(article =>
        cards.push({
          id: article.id,
          source: "devto",
          title: article.title,
          author: article.author,
          url: article.url,
          published_at: article.published_at,
          tags: article.tags
        })
      );
    }
    // rapidapi content loading is now replaced by direct API component use (see DashboardView and tools)
    // Removed rapidData from dependency array as it's not used.
    if (geminiData && geminiData.length) {
      geminiData.forEach(item =>
        cards.push({
          id: item.id,
          source: "gemini",
          title: item.title,
          result: item.result || "",
          type: item.type,
          prompt: item.prompt
        })
      );
    }
    return cards;
  }, [ytData, devtoData, geminiData]); // Removed rapidData from dependency array

  // All tags (flat uniq, for filter option)
  const allTags = useMemo(() => {
    const tags = new Set();
    if (devtoData && devtoData.length) {
      devtoData.forEach(a => a.tags && a.tags.forEach(tag => tags.add(tag)));
    }
    // Could extend to Gemini later if needed
    return Array.from(tags);
  }, [devtoData]);

  // Cards to display, filtered
  const filteredCards = useMemo(() => {
    let cards = allCards;
    if (filter !== "all") {
      if (["youtube", "devto", "gemini"].includes(filter)) { // Removed "rapidapi"
        cards = cards.filter(c => c.source === filter);
      } else {
        // treat as tag filter
        cards = cards.filter(c => c.tags && c.tags.includes(filter));
      }
    }
    if (textFilter.trim()) {
      const lower = textFilter.trim().toLowerCase();
      cards = cards.filter(
        c =>
          (c.title && c.title.toLowerCase().includes(lower)) ||
          (c.description && c.description.toLowerCase().includes(lower)) ||
          (c.author && c.author.toLowerCase().includes(lower)) ||
          (c.channel && c.channel.toLowerCase().includes(lower)) ||
          (c.tags && c.tags.some(tag => tag.toLowerCase().includes(lower))) // Added tag filtering for text search
      );
    }
    return cards;
  }, [allCards, filter, textFilter]);

  // Loading/skeleton control: Is any source still loading?
  const isAnyLoading = ytLoading || devtoLoading || geminiLoading; // Removed rapidLoading

  // FilterBar UI controls
  const filterButtons = [
    <button
      onClick={() => setFilter("all")}
      className={filter === "all" ? "active" : ""}
      key="all"
    >
      All
    </button>,
    ...["youtube", "devto", "gemini"].map(src => ( // Removed "rapidapi"
      <button
        key={src}
        onClick={() => setFilter(src)}
        className={filter === src ? "active" : ""}
      >
        {src.charAt(0).toUpperCase() + src.slice(1)}
      </button>
    )),
    ...(allTags.length > 0
      ? [
          <select
            key="tag-filter"
            onChange={e => setFilter(e.target.value)}
            // Removed redundant inline styles as they are now handled by app.css
            value={["youtube", "devto", "gemini"].includes(filter) ? "all" : filter} // Removed "rapidapi"
          >
            <option value="all">Tags</option>
            {allTags.map(tag => (
              <option value={tag} key={tag}>{tag}</option>
            ))}
          </select>
        ]
      : []),
    <input
      key="search"
      type="text"
      placeholder="Filter by title/author..."
      // Removed redundant inline styles as they are now handled by app.css
      className="ch-search" // Apply existing search class
      value={textFilter}
      onChange={e => setTextFilter(e.target.value)}
    />,
    <button
      key="modal-demo"
      className="ch-info-btn"
      type="button"
      tabIndex={0}
      aria-label="Open info modal"
      onClick={() => setModalOpen(true)}
    >
      {/* Inline SVG icon for an info button, for crisp modern look */}
      <span aria-hidden="true" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", marginRight: "5px" }}>
        <svg height="1.14em" width="1.14em" viewBox="0 0 20 20" fill="none" focusable="false" aria-hidden="true"><circle cx="10" cy="10" r="8.7" stroke="currentColor" strokeWidth="2.1" opacity="0.77"/><rect x="9.3" y="8.35" width="1.4" height="5.2" rx=".7" fill="currentColor"/><rect x="9.3" y="5.1" width="1.4" height="1.4" rx=".7" fill="currentColor"/></svg>
      </span>
      Info
    </button>
  ];

  // Modal overlay demo
  const modalContent = (
    <div>
      <div style={{ fontWeight: 700, fontSize: "1.17em", marginBottom: 10 }}>Welcome to CreatorHub</div>
      <div>
        This is a <b>modal dialog demo</b>—triggered from the main filter bar.<br />
        <ul style={{ paddingLeft: 20, margin: "10px 0" }}>
          <li>Responsive layout and sidebar (try resizing)</li>
          <li>Dark mode toggle available in the top right</li>
          <li>Loading/skeletons and seamless transitions</li>
          <li>Filter sources/tags with the bar above</li>
        </ul>
      </div>
      <div style={{ color: "var(--text-secondary)", marginTop: 8 }}>
        Build by combining API stubs, fast UX, and polished UI!
      </div>
    </div>
  );

  return (
    <div className="ch-main-container">
      {/* FilterBar: shows all filter controls, also demo modal open */}
      <FilterBar filters={filterButtons} />
      {/* Modal overlay demo, closes by click-outside or button */}
      {modalOpen && (
        <Modal open={modalOpen} onClose={() => setModalOpen(false)} blur={true}> {/* Added blur={true} */}
          {modalContent}
        </Modal>
      )}
      {/* All cards, filtered, show skeleton or loaders during fetch */}
      {isAnyLoading && (
        <>
          <SkeletonLoader width="90%" height={32} style={{ marginBottom: 16 }} />
          <SkeletonLoader width="100%" height={24} style={{ marginBottom: 14 }} />
          <SkeletonLoader width="80%" height={26} style={{ marginBottom: 11 }} />
          <SkeletonLoader width="70%" height={20} style={{ marginBottom: 15 }} />
        </>
      )}
      {!isAnyLoading && filteredCards.length === 0 && (
        <div style={{ color: "#E87A41", fontWeight: 500, margin: "34px 0" }}>
          No content matches these filters.
        </div>
      )}
      {/* Render a Card for each resource, slightly customize for each source */}
      {!isAnyLoading &&
        filteredCards.map(card => {
          if (card.source === "youtube") {
            return (
              <Card title={card.title} key={card.id}>
                <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
                  <img
                    src={card.thumbnail}
                    alt="thumbnail"
                    style={{ width: 90, borderRadius: 9, boxShadow: "0 1px 10px #2b3150" }}
                  />
                  <div>
                    <div style={{ fontWeight: 500 }}>By {card.channel}</div>
                    <a
                      href={card.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: "var(--accent)", textDecoration: "underline" }}
                    >
                      Watch on YouTube
                    </a>
                    <div style={{ marginTop: 6, fontSize: "0.97em", color: "var(--text-secondary)" }}>{card.description}</div>
                  </div>
                </div>
              </Card>
            );
          } else if (card.source === "devto") {
            // Use the official Dev.to link when valid, fallback to Dev.to homepage if not
            const devtoLink =
              card.url && /^https:\/\/dev\.to\//.test(card.url)
                ? card.url
                : "https://dev.to/";
            return (
              <Card title={card.title} key={card.id}>
                <div>
                  <div style={{ fontWeight: 500 }}>By {card.author}</div>
                  <div style={{ color: "var(--text-secondary)", fontSize: ".97em" }}>
                    Published: {card.published_at}
                  </div>
                  <a href={devtoLink} target="_blank" rel="noopener noreferrer"
                    style={{ color: "var(--accent)" }}>
                    View article
                  </a>
                  <div style={{ marginTop: 5 }}>
                    {card.tags &&
                      card.tags.map(tag => (
                        <span className="ch-card-tag" key={tag}>
                          #{tag}
                        </span>
                      ))}
                  </div>
                </div>
              </Card>
            );
          } else if (card.source === "gemini") { // Removed rapidapi case
            return (
              <Card title={card.title} key={card.id}>
                <div>
                  <div>
                    <span style={{ fontWeight: 500 }}>Prompt:</span>{" "}
                    <span style={{ fontStyle: "italic", color: "var(--text-secondary)" }}>
                      {card.prompt}
                    </span>
                  </div>
                  <div style={{ marginTop: 6 }}>
                    <span style={{ fontWeight: 500 }}>Completion:</span>{" "}
                    <span>{card.result || <em>–</em>}</span>
                  </div>
                </div>
              </Card>
            );
          }
          // fallback
          return (
            <Card title={card.title || "Card"} key={card.id}>
              {JSON.stringify(card)}
            </Card>
          );
        })}
      {/* Any additional child cards/components, for full flexibility */}
      {children}
    </div>
  );
}

export default MainContainer;