import React, { useState } from "react";
import Topbar from "./Topbar";
import Sidebar from "./Sidebar";

/**
 * PUBLIC_INTERFACE
 * AppShell - wraps the entire app, provides sidebar, topbar, and content area.
 * Handles sidebar collapse, active tab, and shell styling.
 */
function AppShell({ children, view, setView }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className={`app-shell${sidebarCollapsed ? " sidebar-collapsed" : ""}`}>
      <Topbar
        sidebarCollapsed={sidebarCollapsed}
        setSidebarCollapsed={setSidebarCollapsed}
      />
      <div className="app-shell-body">
        <Sidebar
          collapsed={sidebarCollapsed}
          activeTab={view}
          setActiveTab={setView}
        />
        <main className="main-content">
          {children}
        </main>
      </div>
    </div>
  );
}

export default AppShell;
