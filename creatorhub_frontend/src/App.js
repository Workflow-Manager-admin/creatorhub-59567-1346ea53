import React from "react";
import "./App.css";
import Layout from "./components/Layout";
import MainContainer from "./components/MainContainer";
import Card from "./components/Card";
import SkeletonLoader from "./components/SkeletonLoader";
import DarkModeToggle from "./components/DarkModeToggle";
import useDarkMode from "./hooks/useDarkMode";

/**
 * PUBLIC_INTERFACE
 * Main App root that wraps CreatorHub layout, includes responsive design, dark mode, and basic cards.
 */
function App() {
  const [dark, toggleDark] = useDarkMode();
  return (
    <div className="app">
      <DarkModeToggle checked={dark} onToggle={toggleDark} />
      <Layout>
        <MainContainer>
          {/* Example starter: replace with real content, data loaders, cards, etc */}
          <Card title="Welcome to CreatorHub">
            <div>Modern web app for creators and developers. Dark mode is <b>{dark ? "ON" : "OFF"}</b>.</div>
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