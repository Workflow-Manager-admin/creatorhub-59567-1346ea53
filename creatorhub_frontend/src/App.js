import React, { useState } from "react";
import "./App.css";
import Layout from "./components/Layout";
import DashboardView from "./components/DashboardView";
import LearningSplitView from "./components/LearningSplitView";

/**
 * PUBLIC_INTERFACE
 * Main App root: wraps CreatorHub layout, demo of main dashboard and learning split view.
 */
function App() {
  // Demo: toggles to show Dashboard or Learning page (would be router in real app)
  const [view, setView] = useState("dashboard");
  return (
    <div className="app">
      <Layout>
        <div style={{ display: "flex", justifyContent: "center", gap: 18, marginBottom: 18 }}>
          <button 
            className="ch-info-btn"
            style={{
              background: "linear-gradient(90deg,#FF7E5F,#FD3A69)",
              color: "#fff",
              fontWeight: 700,
              borderRadius: 99,
              marginBottom: 8,
              cursor: "pointer"
            }}
            onClick={() => setView("dashboard")}
          >Dashboard</button>
          <button 
            className="ch-info-btn"
            style={{
              background: "linear-gradient(90deg,#1E90FF,#232845)",
              color: "#fff",
              fontWeight: 700,
              borderRadius: 99,
              marginBottom: 8,
              cursor: "pointer"
            }}
            onClick={() => setView("learning")}
          >Learning</button>
        </div>
        {view === "dashboard" ? (
          <DashboardView user={{ name: "Alex" }} />
        ) : (
          <LearningSplitView />
        )}
      </Layout>
    </div>
  );
}

export default App;