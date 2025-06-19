import React, { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai"; // Import Gemini SDK

// PUBLIC_INTERFACE
/**
 * HookGenerator - generates engaging video hooks using the Gemini API.
 */
function HookGenerator() {
  const [videoTopic, setVideoTopic] = useState(""); // Renamed 'input' for clarity
  const [platform, setPlatform] = useState("TikTok"); // Added platform selection
  const [hooks, setHooks] = useState([]); // To store multiple generated hooks
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // --- Gemini API Configuration ---
  // IMPORTANT: Replace 'YOUR_GEMINI_API_HERE' with your actual API key.
  // For production, consider storing this securely (e.g., environment variables)
  // and routing API calls through a backend to avoid exposing it client-side.
  const GEMINI_API_KEY = 'AIzaSyDfR-hi5UrN9BD4olYleIT-ELn0wXh0g4g
';
  const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro-latest' }); // Using a capable model

  // PUBLIC_INTERFACE
  /**
   * Calls the Gemini API to generate content hooks.
   */
  async function generateHooks() {
    if (!videoTopic.trim()) {
      setError("Please provide a video topic for the hooks.");
      return;
    }
    setLoading(true);
    setError(null);
    setHooks([]); // Clear previous hooks

    try {
      // --- Construct the Prompt for Hook Generation ---
      let prompt = `Generate 3 attention-grabbing video hooks for a ${platform} video about: "${videoTopic}".
      Make them concise, engaging, and suitable for the platform.
      Present them as a numbered list.`;

      const result = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.8, // Slightly higher temperature for more creative hooks
          maxOutputTokens: 200, // Allow more tokens for 3 hooks
        },
      });

      const response = await result.response;
      const generatedText = response.text();

      if (generatedText) {
        // Simple parsing: split by newlines, remove numbering/bullets, and filter out empty lines
        const parsedHooks = generatedText
          .split('\n')
          .map(line => line.replace(/^\d+\.\s*|-\s*|\*\s*/, '').trim()) // Remove common list prefixes
          .filter(line => line.length > 5); // Basic filter for valid hooks

        setHooks(parsedHooks);
      } else {
        setHooks(["No hooks were generated. Try a different topic."]);
      }
    } catch (err) {
      console.error('Error generating hooks with Gemini API:', err);
      setError(`Failed to generate hooks: ${err.message || 'An unknown error occurred.'}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: '15px' }}>
      <h3 style={{ marginBottom: '15px', color: 'var(--text-primary)' }}>Video Hook Generator (Gemini AI)</h3>

      {/* Video Topic Input */}
      <div style={{ marginBottom: '10px' }}>
        <label htmlFor="videoTopic" style={{ display: 'block', marginBottom: '5px', color: 'var(--text-secondary)', fontSize: '0.9em' }}>
          Video Topic:
        </label>
        <textarea
          id="videoTopic"
          className="input"
          placeholder="e.g., How to grow houseplants, Easy healthy meal prep..."
          value={videoTopic}
          autoFocus
          onChange={(e) => setVideoTopic(e.target.value)}
          rows="3"
          style={{ marginBottom: 8, width: "98%", resize: 'vertical' }}
        />
      </div>

      {/* Platform Selection */}
      <div style={{ marginBottom: '10px' }}>
        <label htmlFor="platform" style={{ display: 'block', marginBottom: '5px', color: 'var(--text-secondary)', fontSize: '0.9em' }}>
          Select Platform:
        </label>
        <select
          id="platform"
          className="input"
          value={platform}
          onChange={(e) => setPlatform(e.target.value)}
          style={{ width: "calc(98% + 2px)" }}
        >
          <option value="TikTok">TikTok</option>
          <option value="YouTube Shorts">YouTube Shorts</option>
          <option value="Instagram Reels">Instagram Reels</option>
          <option value="General Video">General Video</option>
          {/* Add more platforms if you like */}
        </select>
      </div>

      <button
        className="btn"
        style={{ width: 180 }}
        onClick={generateHooks}
        disabled={loading || !videoTopic.trim()}
      >
        {loading ? "Generating..." : "Generate Hooks"}
      </button>

      {error && <div style={{ color: "var(--danger)", margin: "15px 0 0" }}>{error}</div>}

      {hooks.length > 0 && (
        <div style={{ marginTop: '20px', border: '1px solid var(--border-color)', padding: '15px', borderRadius: '8px', background: 'var(--background-secondary)' }}>
          <h4 style={{ marginBottom: '10px', color: 'var(--text-primary)' }}>Generated Hooks:</h4>
          <ul style={{ listStyleType: 'disc', paddingLeft: '20px', margin: 0 }}>
            {hooks.map((hook, i) => (
              <li key={i} style={{ marginBottom: '8px', color: 'var(--text-secondary)' }}>
                {hook}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default HookGenerator;