import React, { useState } from "react";
import "./App.css";
import AppShell from "./components/AppShell";
import DashboardView from "./components/DashboardView";
import LearningSplitView from "./components/LearningSplitView";
import ToolsPage from "./components/ToolsPage";

// PUBLIC_INTERFACE
/**
 * Main App root: wrapped in new AppShell with modern sidebar/topbar design.
 */
function App() {
  // Handles the current page (Dashboard, Tools, Learning)
  const [view, setView] = useState("dashboard");
  let content;
  if (view === "dashboard") {
    content = <DashboardView user={{ name: "Alex" }} />;
  } else if (view === "tools") {
    content = <ToolsPage />;
  } else if (view === "learning") {
    content = <LearningSplitView />;
  } else {
    content = <DashboardView user={{ name: "Alex" }} />;
  }
  return (
    <AppShell view={view} setView={setView}>
      {content}
    </AppShell>
  );
}

export default App;