import React, { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai"; // Import Gemini SDK

// PUBLIC_INTERFACE
/**
 * ContentIdeaGenerator - generates content ideas for creators using the Gemini API.
 */
function ContentIdeaGenerator() {
  const [topic, setTopic] = useState(""); // Renamed 'input' to 'topic' for clarity
  const [platform, setPlatform] = useState("Blog"); // Added platform/format option
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // --- Gemini API Configuration ---
  // IMPORTANT: Replace 'YOUR_GEMINI_API_HERE' with your actual API key.
  // For production, consider storing this securely (e.g., environment variables)
  // and routing API calls through a backend to avoid exposing it client-side.
  const GEMINI_API_KEY = 'AIzaSyACx37UXHYLpnkMw0wZbWuYKECWU8negfo';
  const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro-latest' }); // Using a capable model

  // PUBLIC_INTERFACE
  /**
   * Calls the Gemini API to generate content ideas.
   */
  async function generateIdeas() {
    if (!topic.trim()) {
      setError("Please enter a topic or niche.");
      return;
    }
    setLoading(true);
    setError(null);
    setIdeas([]); // Clear previous ideas

    try {
      // --- Construct the Prompt for Content Idea Generation ---
      let prompt = `Brainstorm 5 unique content ideas for a ${platform} about: "${topic}".
      For each idea, provide a catchy title and a brief, one-sentence description.
      Present them as a numbered list.`;

      const result = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.9, // Higher temperature for more creative ideas
          maxOutputTokens: 300, // Allow more tokens for 5 ideas with descriptions
        },
      });

      const response = await result.response;
      const generatedText = response.text();

      if (generatedText) {
        // Simple parsing: split by newlines and filter out empty lines, then trim
        const parsedIdeas = generatedText
          .split('\n')
          .filter(line => line.trim().length > 0)
          .map(line => line.replace(/^\d+\.\s*/, '').trim()); // Remove numbering like "1."

        setIdeas(parsedIdeas);
      } else {
        setIdeas(["No ideas were generated. Please try again with a different topic."]);
      }
    } catch (err) {
      console.error('Error generating content ideas with Gemini API:', err);
      setError(`Failed to generate ideas: ${err.message || 'An unknown error occurred.'}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: '15px' }}>
      <h3 style={{ marginBottom: '15px', color: 'var(--text-primary)' }}>Content Idea Generator (Gemini AI)</h3>

      {/* Topic/Niche Input */}
      <div style={{ marginBottom: '10px' }}>
        <label htmlFor="topic" style={{ display: 'block', marginBottom: '5px', color: 'var(--text-secondary)', fontSize: '0.9em' }}>
          Enter a topic or niche:
        </label>
        <textarea
          id="topic"
          className="input"
          placeholder="e.g., Sustainable living, Beginner guitar lessons, Modern minimalist decor..."
          value={topic}
          autoFocus
          onChange={(e) => setTopic(e.target.value)}
          rows="3"
          style={{ marginBottom: 8, width: "98%", resize: 'vertical' }}
        />
      </div>

      {/* Platform/Format Selection */}
      <div style={{ marginBottom: '10px' }}>
        <label htmlFor="platform" style={{ display: 'block', marginBottom: '5px', color: 'var(--text-secondary)', fontSize: '0.9em' }}>
          Select Platform/Format:
        </label>
        <select
          id="platform"
          className="input"
          value={platform}
          onChange={(e) => setPlatform(e.target.value)}
          style={{ width: "calc(98% + 2px)" }}
        >
          <option value="Blog">Blog Post</option>
          <option value="YouTube">YouTube Video</option>
          <option value="TikTok">TikTok/Short Video</option>
          <option value="Podcast">Podcast Episode</option>
          <option value="Instagram">Instagram Post/Reel</option>
          {/* Add more platforms if you wish */}
        </select>
      </div>

      <button
        className="btn"
        style={{ width: 160 }}
        onClick={generateIdeas}
        disabled={loading || !topic.trim()}
      >
        {loading ? "Generating..." : "Get Ideas"}
      </button>

      {error && <div style={{ color: "var(--danger)", margin: "15px 0 0" }}>{error}</div>}

      {ideas.length > 0 && (
        <div style={{ marginTop: '20px', border: '1px solid var(--border-color)', padding: '15px', borderRadius: '8px', background: 'var(--background-secondary)' }}>
          <h4 style={{ marginBottom: '10px', color: 'var(--text-primary)' }}>Generated Ideas:</h4>
          <ul style={{ listStyleType: 'disc', paddingLeft: '20px', margin: 0 }}>
            {ideas.map((idea, i) => (
              <li key={i} style={{ marginBottom: '8px', color: 'var(--text-secondary)' }}>
                {idea}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default ContentIdeaGenerator;