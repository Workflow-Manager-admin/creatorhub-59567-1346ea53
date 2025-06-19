import React, { useState } from "react";
import "./App.css";
import AppShell from "./components/AppShell";
import DashboardView from "./components/DashboardView";
import LearningSplitView from "./components/LearningSplitView";

// PUBLIC_INTERFACE
/**
 * Main App root: wrapped in new AppShell with modern sidebar/topbar design.
 */
function App() {
  // Demo: toggles to show Dashboard or Learning page (would be router in real app)
  const [view, setView] = useState("dashboard");
  return (
    <AppShell view={view} setView={setView}>
      {view === "dashboard" ? (
        <DashboardView user={{ name: "Alex" }} />
      ) : (
        <LearningSplitView />
      )}
    </AppShell>
  );
}

export default App;