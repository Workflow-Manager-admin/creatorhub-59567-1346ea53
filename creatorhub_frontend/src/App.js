 // src/App.js
import React, { useState, useEffect } from "react";
import "./App.css";
import AppShell from "./components/AppShell";
import DashboardView from "./components/DashboardView";
import ToolsPage from "./components/ToolsPage";
// NEW IMPORTS FOR AUTHENTICATION
import AuthForm from "./components/AuthForm";
// IMPORTANT: ADD ProfileView HERE
import ProfileView from "./components/ProfileView"; // <--- NEW IMPORT

// IMPORTANT: ADD saveUserContent HERE
import { logout, subscribeToAuthChanges, saveUserContent } from "./firebaseAuthService";

/**
 * Main App root: wrapped in new AppShell with modern sidebar/topbar design.
 */
function App() {
  const [view, setView] = useState("dashboard"); // Default view
  const [user, setUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true); // New loading state for auth

  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges((currentUser) => {
      setUser(currentUser);
      setLoadingAuth(false); // Auth state determined
      // If user logs out, go back to dashboard/auth form (or login page)
      if (!currentUser) {
        setView("dashboard"); // Or 'auth' if you have a specific auth page view
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      console.log("Logged out successfully.");
    } catch (error) {
      alert("Error logging out: " + error.message);
    }
  };

  const handleSaveTestContent = async () => {
    if (user) { // Ensure user is logged in before saving
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
    } else {
      alert("Please log in to save content.");
    }
  };


  if (loadingAuth) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: 'var(--background-color)',
        color: 'var(--text-color)',
        fontSize: '1.5em'
      }}>
        Loading application...
      </div>
    );
  }

  let content;
  if (!user) {
    // If no user is logged in, show the authentication form
    content = <AuthForm />;
  } else {
    // If a user is logged in, render the regular app content based on the 'view' state
    if (view === "dashboard") {
      content = <DashboardView user={user} />;
    } else if (view === "tools") {
      content = <ToolsPage />;
    } else if (view === "profile") { // <--- NEW PROFILE VIEW CASE
      content = <ProfileView user={user} />; // Pass the user object to ProfileView
    } else {
      content = <DashboardView user={user} />; // Default to dashboard if view is unknown
    }
  }

  return (
    <>
      {user ? (
        <AppShell view={view} setView={setView}>
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
            <button
                onClick={handleSaveTestContent}
                style={{
                    padding: '6px 12px',
                    borderRadius: '6px',
                    background: 'var(--accent)',
                    color: '#fff',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '0.85em',
                    fontWeight: 'bold',
                }}
            >
                Save Test Content
            </button>
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