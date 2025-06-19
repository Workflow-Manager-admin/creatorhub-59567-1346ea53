import React from "react";
import Topbar from "./Topbar";
import Sidebar from "./Sidebar";

// PUBLIC_INTERFACE
function Layout({ children }) {
  /** Main layout with topbar/sidebar */
  return (
    <div className="ch-layout">
      <Topbar />
      <div className="ch-layout-main">
        <Sidebar />
        <main className="ch-content-area">{children}</main>
      </div>
    </div>
  );
}

export default Layout;
