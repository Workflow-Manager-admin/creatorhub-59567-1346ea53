// src/App.js

import React, { useState, useEffect } from "react"; // <-- Import useEffect
import "./App.css";
import AppShell from "./components/AppShell";
import DashboardView from "./components/DashboardView";
import LearningSplitView from "./components/LearningSplitView";
import ToolsPage from "./components/ToolsPage";
// NEW IMPORTS FOR AUTHENTICATION
import AuthForm from "./components/AuthForm"; // Make sure AuthForm.js is in src/components
import { logout, subscribeToAuthChanges } from "./firebaseAuthService"; // Make sure firebaseAuthService.js is in src

// PUBLIC_INTERFACE
/**
 * Main App root: wrapped in new AppShell with modern sidebar/topbar design.
 */
function App() {
  // Handles the current page (Dashboard, Tools, Learning)
  const [view, setView] = useState("dashboard");
  // NEW STATE FOR AUTHENTICATED USER
  const [user, setUser] = useState(null);

  // NEW EFFECT HOOK TO LISTEN FOR AUTH STATE CHANGES
  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges((currentUser) => {
      setUser(currentUser); // Update user state
      console.log("Auth state changed:", currentUser ? currentUser.uid : "No user");
    });

    // Clean up the subscription when the component unmounts
    return () => unsubscribe();
  }, []); // Empty dependency array means this runs once on mount

  // NEW LOGOUT HANDLER
  const handleLogout = async () => {
    try {
      await logout();
      // No need to manually setUser(null); onAuthStateChanged will handle it
    } catch (error) {
      console.error("Failed to log out:", error);
      alert("Failed to log out. Please try again.");
    }
  };

  let content;
  // CONDITIONAL RENDERING BASED ON AUTH STATE
  if (!user) {
    // If no user is logged in, show the authentication form
    content = <AuthForm />;
  } else {
    // If a user is logged in, render the regular app content based on the 'view' state
    if (view === "dashboard") {
      // Pass the user object to DashboardView if it needs user-specific data
      content = <DashboardView user={user} />; // Changed from user={{ name: "Alex" }}
    } else if (view === "tools") {
      content = <ToolsPage />;
    } else if (view === "learning") {
      content = <LearningSplitView />;
    } else {
      content = <DashboardView user={user} />; // Changed from user={{ name: "Alex" }}
    }
  }

  return (
    // Only render AppShell if a user is logged in, otherwise just render the content (AuthForm)
    // You can adjust the styling of the AuthForm's container if it's not wrapped by AppShell
    <>
      {user ? (
        <AppShell view={view} setView={setView}>
          {/* Display welcome and logout if logged in within AppShell's header/toolbar */}
          <div style={{
            position: 'absolute',
            top: '20px', // Adjust as needed to fit your AppShell's header
            right: '20px',
            zIndex: 100, // Ensure it's above other elements
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            color: 'var(--text-primary)'
          }}>
            Welcome, {user.email}
            <button
              onClick={handleLogout}
              style={{
                padding: '6px 12px',
                borderRadius: '6px',
                background: 'var(--danger)', // Assuming you have a --danger CSS variable
                color: '#fff',
                border: 'none',
                cursor: 'pointer',
                fontSize: '0.85em',
                fontWeight: 'bold',
              }}
            >
              Log Out
            </button>
          </div>
          {content}
        </AppShell>
      ) : (
        // Render only the AuthForm if not logged in.
        // You might want to wrap AuthForm in a simple div for basic styling if it looks off.
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh', // Take full viewport height
          background: 'var(--background-color)', // Match your app's background
          padding: '20px'
        }}>
          {content}
        </div>
      )}
    </>
  );
}

export default App;