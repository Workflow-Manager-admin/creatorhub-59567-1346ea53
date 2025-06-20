// src/components/AuthForm.js
import React, { useState } from "react";
import { signUp, signIn, signInWithGoogle } from "../firebaseAuthService";

function AuthForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false); // Toggle between signup and signin
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null); // For success messages
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);

    try {
      if (isSignUp) {
        await signUp(email, password);
        setMessage("Sign up successful! You are now logged in.");
      } else {
        await signIn(email, password);
        setMessage("Sign in successful!");
      }
      setEmail("");
      setPassword("");
    } catch (err) {
      // Firebase error codes are descriptive
      let errorMessage = "An unknown error occurred.";
      switch (err.code) {
        case "auth/email-already-in-use":
          errorMessage = "This email is already in use.";
          break;
        case "auth/invalid-email":
          errorMessage = "The email address is not valid.";
          break;
        case "auth/operation-not-allowed":
          errorMessage = "Email/password login is not enabled (check Firebase console).";
          break;
        case "auth/weak-password":
          errorMessage = "Password should be at least 6 characters.";
          break;
        case "auth/user-not-found":
        case "auth/wrong-password":
          errorMessage = "Invalid email or password.";
          break;
        default:
          errorMessage = err.message;
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Google Sign-In Handler
  const handleGoogleSignIn = async () => {
    setError(null);
    setMessage(null); // Clear any previous messages
    setLoading(true);
    try {
      await signInWithGoogle();
      setMessage("Signed in with Google successfully!"); // Optional: Success message for Google SSO
      // Firebase's onAuthStateChanged listener in App.js will handle setting the user
    } catch (err) {
      // Improve error messages for Google SSO specific issues
      let errorMessage = "Error signing in with Google.";
      if (err.code === "auth/popup-closed-by-user") {
        errorMessage = "Google sign-in popup was closed.";
      } else if (err.code === "auth/cancelled-popup-request") {
        errorMessage = "Another sign-in request was already pending.";
      } else {
        errorMessage = err.message;
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: '20px auto', border: '1px solid var(--border-color)', borderRadius: '12px', background: 'var(--card-bg)' }}>
      <h3 style={{ textAlign: 'center', marginBottom: '20px', color: 'var(--text-primary)' }}>
        {isSignUp ? "Sign Up" : "Sign In"}
      </h3>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div>
          <label htmlFor="email" style={{ display: 'block', marginBottom: '5px', color: 'var(--text-secondary)' }}>Email:</label>
          <input
            type="email"
            id="email"
            className="input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@example.com"
            required
            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--background-secondary)', color: 'var(--text-color)' }}
          />
        </div>
        <div>
          <label htmlFor="password" style={{ display: 'block', marginBottom: '5px', color: 'var(--text-secondary)' }}>Password:</label>
          <input
            type="password"
            id="password"
            className="input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="min 6 characters"
            required
            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--background-secondary)', color: 'var(--text-color)' }}
          />
        </div>

        {error && <div style={{ color: 'var(--danger)', marginTop: '5px', textAlign: 'center' }}>{error}</div>}
        {message && <div style={{ color: 'var(--success)', marginTop: '5px', textAlign: 'center' }}>{message}</div>}

        <button
          type="submit"
          className="btn"
          disabled={loading}
          style={{ width: '100%', padding: '12px', borderRadius: '8px', background: 'var(--accent-gradient)', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '1em', fontWeight: 'bold' }}
        >
          {loading ? "Processing..." : (isSignUp ? "Sign Up" : "Sign In")}
        </button>
      </form>

      {/* Separator or just spacing */}
      <div style={{ margin: '20px 0', textAlign: 'center', color: 'var(--text-secondary)' }}>— OR —</div>

      {/* NEW: Google Sign-In Button */}
      <button
        onClick={handleGoogleSignIn}
        disabled={loading}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "10px",
          width: '100%',
          padding: "12px",
          borderRadius: "8px",
          background: "#4285F4", // Google Blue
          color: "#fff",
          border: "none",
          cursor: loading ? "not-allowed" : "pointer",
          fontSize: "1em",
          fontWeight: "bold",
          transition: "background 0.2s"
        }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12.0003 12.75C13.8828 12.75 15.5186 12.0526 16.7328 10.9701L20.089 14.3263C18.0165 16.2751 15.2289 17.5 12.0003 17.5C8.98188 17.5 6.27743 16.1436 4.31494 13.9161L7.79401 11.1097C8.61863 11.6669 9.38206 12.1158 10.0898 12.4468C10.7975 12.7779 11.4116 12.75 12.0003 12.75Z" fill="#FBBC05"/>
            <path d="M3.75 10.0001C3.75 9.09706 3.86475 8.21739 4.09104 7.37519L0.640991 4.54228C0.211794 5.92621 0 7.42065 0 9.0001C0 10.5796 0.211794 12.074 0.640991 13.458L3.75 10.0001Z" fill="#F4B400"/>
            <path d="M12.0003 4.25C13.2503 4.25 14.3986 4.67512 15.3402 5.5173L18.6652 2.1923C16.7928 0.617302 14.5085 0 12.0003 0C8.77169 0 5.98408 1.22487 3.91159 3.17366L7.26778 6.52985C8.482 5.44733 10.1178 4.75 12.0003 4.75V4.25Z" fill="#EA4335"/>
            <path d="M23.7493 9.0001C23.7493 8.35411 23.6843 7.72149 23.5543 7.10626L23.4793 6.67104H12.0003V10.0001H19.6453C19.5353 10.5796 19.3303 11.1435 19.0403 11.6798C18.6553 12.3923 18.2303 13.0645 17.6593 13.6896C17.0883 14.3147 16.4059 14.8872 15.6322 15.3982L19.0822 18.2311C20.9072 16.1436 22.1902 13.6702 23.0032 11.0001L23.7493 9.0001Z" fill="#4285F4"/>
        </svg>
        Sign in with Google
      </button>

      <div style={{ textAlign: 'center', marginTop: '15px' }}>
        <button
          type="button"
          onClick={() => {
            setIsSignUp(!isSignUp);
            setError(null);
            setMessage(null);
          }}
          style={{ background: 'none', border: 'none', color: 'var(--info)', textDecoration: 'underline', cursor: 'pointer', fontSize: '0.9em' }}
        >
          {isSignUp ? "Already have an account? Sign In" : "Need an account? Sign Up"}
        </button>
      </div>
    </div>
  );
}

export default AuthForm;