// src/components/AuthForm.js
import React, { useState } from "react";
import { signUp, signIn } from "../firebaseAuthService"; // Import our auth functions

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