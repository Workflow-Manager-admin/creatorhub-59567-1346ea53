import React from "react";
import Card from "./Card";
import Loader from "./Loader";
import SkeletonLoader from "./SkeletonLoader";
import useFetchWithSkeleton from "../hooks/useFetchWithSkeleton";
import { fetchYoutubeContent } from "../api/youtube";
import { fetchDevToContent } from "../api/devto";
import { fetchRapidAPIContent } from "../api/rapidapi";
import { fetchGeminiContent } from "../api/gemini";

// PUBLIC_INTERFACE
function MainContainer({ children }) {
  /**
   * Main content area for dashboards, API tools, etc.
   * Demonstrates fast load with skeletons/loaders and API stub integration.
   */
  // Example: Load stubbed YouTube API data using async fetch and show skeleton/Loader
  const [ytData, ytLoading, ytError] = useFetchWithSkeleton(fetchYoutubeContent, []);
  const [devtoData, devtoLoading, devtoError] = useFetchWithSkeleton(fetchDevToContent, []);
  const [rapidData, rapidLoading, rapidError] = useFetchWithSkeleton(fetchRapidAPIContent, []);
  const [geminiData, geminiLoading, geminiError] = useFetchWithSkeleton(fetchGeminiContent, []);

  return (
    <div className="ch-main-container">
      {/* Example 1: Async load YouTube card skeleton */}
      <Card title="Featured YouTube Video">
        {ytLoading && <SkeletonLoader width="90%" height={32} />}
        {!ytLoading && ytError && <div style={{ color: "#E87A41" }}>Failed to load: {ytError.message || String(ytError)}</div>}
        {!ytLoading && ytData && (
          <div>
            <b>{ytData[0]?.title || "No Data"}</b>
            <div style={{ fontSize: "0.97em", marginTop: 8, color: "var(--text-secondary)"}}>
              Example simulating async API content load w/ skeleton state.
            </div>
          </div>
        )}
      </Card>

      {/* Example 2: Dev.to Card with loader spinner instead of skeleton */}
      <Card title="Dev.to Articles">
        {devtoLoading && <Loader />}
        {!devtoLoading && devtoData && (
          <ul style={{ margin: 0, paddingLeft: 20 }}>
            {devtoData.map(article => (
              <li key={article.id}>{article.title}</li>
            ))}
          </ul>
        )}
        {!devtoLoading && devtoError && <div style={{ color: "#E87A41" }}>Error loading Dev.to: {devtoError.message || String(devtoError)}</div>}
      </Card>

      {/* Example 3: More Cards with skeleton */}
      <Card title="RapidAPI Integrations">
        {rapidLoading ? (
          <SkeletonLoader width="100%" height={26} />
        ) : rapidError ? (
          <div style={{ color: "#E87A41" }}>Failed to load: {rapidError.message || String(rapidError)}</div>
        ) : (
          rapidData && <div>{rapidData[0]?.title || "No integrations loaded"}</div>
        )}
      </Card>

      <Card title="Gemini AI">
        {geminiLoading && (
          <>
            <SkeletonLoader width="70%" height={18} />
            <SkeletonLoader width="50%" height={18} style={{marginTop: 7}} />
          </>
        )}
        {!geminiLoading && geminiError && <div style={{ color: "#E87A41" }}>Error: {geminiError.message || String(geminiError)}</div>}
        {!geminiLoading && geminiData && (
          <span>{geminiData[0]?.title || "No Gemini data"}</span>
        )}
      </Card>

      {/* Any additional child cards/components, for full flexibility */}
      {children}
    </div>
  );
}

export default MainContainer;
