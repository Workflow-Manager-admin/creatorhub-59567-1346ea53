import React, { useEffect, useState } from "react";
import { fetchYoutubeContent } from "../api/youtube";
import { fetchDevToContent } from "../api/devto";
import Card from "./Card";
import SkeletonLoader from "./SkeletonLoader";

// PUBLIC_INTERFACE
/**
 * TutorialsTab - Fetches and displays YouTube videos and Dev.to articles relating to the provided tool/topic name.
 * Shows each resource as a card: thumbnail, title, author/source, snippet.
 * Displays up to 3–5 results for each, plus a 'View All' external link per source.
 * 
 * @param {Object} props
 * @param {string} props.topicName - Tool or topic name to search for (if omitted, uses "creator" as demo)
 */
function TutorialsTab({ topicName = "creator" }) {
  const [ytVideos, setYtVideos] = useState([]);
  const [ytLoading, setYtLoading] = useState(true);
  const [ytErr, setYtErr] = useState(null);

  const [devtoArticles, setDevtoArticles] = useState([]);
  const [devtoLoading, setDevtoLoading] = useState(true);
  const [devtoErr, setDevtoErr] = useState(null);

  // Fetch YouTube - mimic using topicName as the "search"
  useEffect(() => {
    setYtLoading(true);
    setYtErr(null);
    fetchYoutubeContent(topicName)
      .then(arr => setYtVideos((arr || []).slice(0, 5)))
      .catch(() => setYtErr("Failed to fetch YouTube videos."))
      .finally(() => setYtLoading(false));
  }, [topicName]);

  // Fetch Dev.to - mimic using topicName as the "tag"
  useEffect(() => {
    setDevtoLoading(true);
    setDevtoErr(null);
    fetchDevToContent(topicName)
      .then(arr => setDevtoArticles((arr || []).slice(0, 5)))
      .catch(() => setDevtoErr("Failed to fetch Dev.to articles."))
      .finally(() => setDevtoLoading(false));
  }, [topicName]);

  // YouTube 'View All' link
  const ytViewAllUrl =
    "https://www.youtube.com/results?search_query=" +
    encodeURIComponent(topicName);
  // Dev.to 'View All' link (by tag or search)
  const devtoViewAllUrl =
    "https://dev.to/search?q=" + encodeURIComponent(topicName);

  function renderVideoCard(video, idx) {
    return (
      <Card title={video.title} key={"yt-" + (video.id || idx)}>
        <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
          {/* Thumbnail */}
          <a
            href={video.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              minWidth: 92,
              maxWidth: 92,
              borderRadius: 8,
              overflow: "hidden",
              display: "block",
              boxShadow: "0 1px 10px #23284580",
              marginRight: 10
            }}
            aria-label="Watch on YouTube"
          >
            <img
              src={video.thumbnail}
              alt="YouTube thumbnail"
              style={{ width: 92, height: 64, objectFit: "cover", borderRadius: 8 }}
            />
          </a>
          <div style={{ flex: 1 }}>
            <div style={{ color: "var(--text-secondary)", fontSize: ".99em", fontWeight: 500 }}>
              By {video.channel}
            </div>
            <div style={{ fontSize: ".98em", color: "#A6567B" }}>
              {video.published_at}
            </div>
            <div style={{ marginTop: 6, fontSize: ".97em", color: "var(--text-secondary)" }}>
              {video.description?.slice(0, 86) || ""}
              {video.description && video.description.length > 86 ? "..." : ""}
            </div>
            <div style={{ marginTop: 8 }}>
              <a
                href={video.url}
                className="ch-info-btn"
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontWeight: 700, fontSize: ".98em" }}
              >
                Watch Video
              </a>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  function renderDevtoCard(article, idx) {
    return (
      <Card title={article.title} key={"devto-" + (article.id || idx)}>
        <div style={{ color: "var(--text-secondary)", fontSize: ".99em", fontWeight: 500 }}>
          {article.author ? <>By {article.author}</> : "Dev.to Article"}
        </div>
        <div style={{ fontSize: ".98em", color: "#A6567B" }}>
          {article.published_at}
        </div>
        <div style={{ marginTop: 6, fontSize: ".97em", color: "var(--text-secondary)" }}>
          {Array.isArray(article.tags) && article.tags.length > 0
            ? article.tags.map((tag) => (
                <span className="ch-card-tag" key={tag} style={{ marginRight: 7 }}>
                  #{tag}
                </span>
              ))
            : null}
        </div>
        <div style={{ marginTop: 7 }}>
          <a
            href={article.url}
            className="ch-info-btn"
            target="_blank"
            rel="noopener noreferrer"
            style={{ fontWeight: 700, fontSize: ".99em" }}
          >
            Read Article
          </a>
        </div>
      </Card>
    );
  }

  return (
    <section
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        minHeight: 350,
        width: "100%",
        maxWidth: 1200,
        margin: "0 auto",
        padding: "10px 0"
      }}
      aria-label="Tutorials"
    >
      {/* YouTube Section */}
      <div style={{ width: "100%", marginBottom: 36 }}>
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            marginBottom: 14,
            gap: 8
          }}
        >
          <div
            className="ch-card-title"
            style={{
              color: "#E87A41",
              fontWeight: 800,
              fontSize: "1.23rem",
              marginBottom: 0
            }}
          >
            YouTube Tutorials
          </div>
          <a
            href={ytViewAllUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="ch-info-btn"
            style={{
              background: "linear-gradient(90deg,#FD3A69 0%,#FF7E5F 100%)",
              color: "#fff",
              fontWeight: 700,
              fontSize: ".97em"
            }}
          >
            View All
          </a>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(380px,1fr))",
            gap: 18
          }}
        >
          {ytLoading
            ? [0, 1, 2].map((i) => (
                <Card title={<SkeletonLoader width={100} />} key={"yt-sk-" + i}>
                  <SkeletonLoader width={88} height={62} />
                  <SkeletonLoader width="70%" height={18} />
                  <SkeletonLoader width="80%" height={16} />
                  <SkeletonLoader width={95} height={32} />
                </Card>
              ))
            : ytErr
            ? <div style={{ color: "#EF6A6A" }}>{ytErr}</div>
            : ytVideos.map(renderVideoCard)}
        </div>
      </div>
      {/* Dev.to Section */}
      <div style={{ width: "100%", marginBottom: 30 }}>
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            marginBottom: 14,
            gap: 8
          }}
        >
          <div
            className="ch-card-title"
            style={{
              color: "#A178DF",
              fontWeight: 800,
              fontSize: "1.23rem",
              marginBottom: 0
            }}
          >
            Dev.to Articles
          </div>
          <a
            href={devtoViewAllUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="ch-info-btn"
            style={{
              background: "linear-gradient(90deg,#232845 0%,#A178DF 100%)",
              color: "#fff",
              fontWeight: 700,
              fontSize: ".97em"
            }}
          >
            View All
          </a>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(380px,1fr))",
            gap: 18
          }}
        >
          {devtoLoading
            ? [0, 1, 2].map((i) => (
                <Card title={<SkeletonLoader width={110} />} key={"devto-sk-" + i}>
                  <SkeletonLoader width="80%" height={18} />
                  <SkeletonLoader width="60%" height={18} />
                  <SkeletonLoader width={95} height={32} />
                </Card>
              ))
            : devtoErr
            ? <div style={{ color: "#EF6A6A" }}>{devtoErr}</div>
            : devtoArticles.map(renderDevtoCard)}
        </div>
      </div>
    </section>
  );
}

export default TutorialsTab;
