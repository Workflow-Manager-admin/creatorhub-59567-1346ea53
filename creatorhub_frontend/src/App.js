import React from "react";
import "./App.css";
import Layout from "./components/Layout";
import MainContainer from "./components/MainContainer";
import Card from "./components/Card";
import SkeletonLoader from "./components/SkeletonLoader";

/**
 * PUBLIC_INTERFACE
 * Main App root that wraps CreatorHub layout, includes responsive design, dark mode, and basic cards.
 */
function App() {
  // No need to render DarkModeToggle here (it is handled in Topbar)
  return (
    <div className="app">
      <Layout>
        <MainContainer>
          {/* Example starter: replace with real content, data loaders, cards, etc */}
          <Card title="Welcome to CreatorHub">
            <div>Modern web app for creators and developers. Dark mode is <b>{document.body.classList.contains("dark-mode") ? "ON" : "OFF"}</b>.</div>
            <SkeletonLoader width="100%" height={32} />
          </Card>
          <Card title="Get Started">
            This area will show tools, tutorials & API integrations. The UI is now scaffolded!
          </Card>
        </MainContainer>
      </Layout>
    </div>
  );
}

export default App;