import React from "react";
import "./App.css";
import Layout from "./components/Layout";
import MainContainer from "./components/MainContainer";

/**
 * PUBLIC_INTERFACE
 * Main App root that wraps CreatorHub layout, includes responsive design and main container content.
 */
function App() {
  // DarkModeToggle is handled in Topbar
  return (
    <div className="app">
      <Layout>
        <MainContainer />
      </Layout>
    </div>
  );
}

export default App;