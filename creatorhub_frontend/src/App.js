// src/App.js

import React, { useState, useEffect } from "react";
import "./App.css";
import AppShell from "./components/AppShell";
import DashboardView from "./components/DashboardView";
import LearningSplitView from "./components/LearningSplitView";
import ToolsPage from "./components/ToolsPage";
// NEW IMPORTS FOR AUTHENTICATION
import AuthForm from "./components/AuthForm";
// IMPORTANT: ADD saveUserContent HERE
import { logout, subscribeToAuthChanges, saveUserContent } from "./firebaseAuthService";

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

  // NEW HANDLER TO SAVE TEST CONTENT
  const handleSaveTestContent = async () => {
      try {
          await saveUserContent({
              title: `My Test Content ${new Date().toLocaleString()}`,
              type: "test",
              description: "This is a test content item saved from the app.",
              // You can add more fields here if needed for testing
          });
          alert("Test content saved successfully!");
      } catch (error) {
          console.error("Failed to save test content:", error);
          alert("Failed to save test content. Check console for details.");
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
      content = <DashboardView user={user} />;
    } else if (view === "tools") {
      content = <ToolsPage />;
    } else if (view === "learning") {
      content = <LearningSplitView />;
    } else {
      content = <DashboardView user={user} />;
    }
  }

  return (
    <>
      {user ? (
        <AppShell view={view} setView={setView}>
          {/* Display welcome, logout, AND THE NEW SAVE BUTTON if logged in */}
          <div style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            zIndex: 100,
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
                background: 'var(--danger)',
                color: '#fff',
                border: 'none',
                cursor: 'pointer',
                fontSize: '0.85em',
                fontWeight: 'bold',
              }}
            >
              Log Out
            </button>
            {/* START OF NEW BUTTON ADDITION */}
            <button
                onClick={handleSaveTestContent}
                style={{
                    padding: '6px 12px',
                    borderRadius: '6px',
                    background: 'var(--accent)', // Assuming you have an accent color defined in your CSS
                    color: '#fff',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '0.85em',
                    fontWeight: 'bold',
                }}
            >
                Save Test Content
            </button>
            {/* END OF NEW BUTTON ADDITION */}
          </div>
          {content}
        </AppShell>
      ) : (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          background: 'var(--background-color)',
          padding: '20px'
        }}>
          {content}
        </div>
      )}
    </>
  );
}

export default App;