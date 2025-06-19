import React, { useState } from "react";
// Import the GoogleGenerativeAI SDK
import { GoogleGenerativeAI } from "@google/generative-ai";

// PUBLIC_INTERFACE
/**
 * CaptionGenerator - generates social captions using the Gemini API.
 */
function CaptionGenerator() {
  // Renamed 'input' to 'description' for clarity and added 'tone' and 'keywords'
  const [description, setDescription] = useState("");
  const [tone, setTone] = useState("neutral"); // Default tone
  const [keywords, setKeywords] = useState(""); // For comma-separated keywords
  const [caption, setCaption] = useState(""); // Changed from 'captions' array to a single 'caption' string
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // --- Gemini API Configuration ---
  // IMPORTANT: For production, this key MUST be handled on a backend server
  // (e.g., using process.env.REACT_APP_GEMINI_API_KEY for a React app,
  // but the actual call to Gemini should be from your server).
  const GEMINI_API_KEY = 'AIzaSyDfR-hi5UrN9BD4olYleIT-ELn0wXh0g4g'; // <<< REPLACE THIS with your actual API key

  // Initialize the Generative Model
  // Ensure 'gemini-pro' is the correct model for text generation based on your project's access
  const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro-latest' });

  // PUBLIC_INTERFACE
  /**
   * Calls the Gemini API to generate a caption based on user input.
   */
  async function generateCaptions() {
    if (!description.trim()) {
      setError("Please provide a description for the caption.");
      return;
    }

    setLoading(true);
    setError(null);
    setCaption(""); // Clear previous caption

    try {
      // --- Construct the Prompt for Gemini ---
      // This is where you tell Gemini exactly what you want
      let prompt = `Generate a social media caption based on the following description: "${description}".`;

      if (tone && tone !== 'neutral') {
        prompt += ` The tone should be ${tone}.`;
      }
      if (keywords.trim()) {
        prompt += ` Include these keywords: ${keywords}.`;
      }
      prompt += ` Keep it concise and engaging.`;

      // Make the API call to Gemini
      const result = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7, // Controls creativity: 0.0 (less creative) to 1.0 (more creative)
          maxOutputTokens: 150, // Max length of the generated caption
        },
        // You can also add safetySettings here if needed, for example:
        // safetySettings: [
        //   {
        //     category: 'HARM_CATEGORY_HARASSMENT',
        //     threshold: 'BLOCK_MEDIUM_AND_ABOVE',
        //   },
        // ],
      });

      // Get the plain text response from Gemini
      const response = await result.response;
      const generatedText = response.text();

      if (generatedText) {
        setCaption(generatedText.trim());
      } else {
        setCaption("No caption was generated. Please try again with a different description.");
      }

    } catch (err) {
      console.error('Error generating caption with Gemini API:', err);
      // Provide more specific error messages based on common Gemini API errors
      if (err.message.includes('API key not valid')) {
        setError('Invalid Gemini API Key. Please check your key.');
      } else if (err.message.includes('Quota exceeded')) {
        setError('API quota exceeded for the selected model. Please check your usage limits.');
      } else if (err.message.includes('429')) { // Too Many Requests
        setError('Too many requests. Please wait a moment and try again.');
      } else {
        setError(`Failed to generate caption: ${err.message || 'An unknown error occurred.'}`);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: '15px' }}> {/* Added some padding for better spacing within the modal */}
      <h3 style={{ marginBottom: '15px', color: 'var(--text-primary)' }}>Caption Generator (Gemini AI)</h3>

      {/* Description Input (now a textarea) */}
      <div style={{ marginBottom: '10px' }}>
        <label htmlFor="description" style={{ display: 'block', marginBottom: '5px', color: 'var(--text-secondary)', fontSize: '0.9em' }}>
          Describe your post or image:
        </label>
        <textarea
          id="description"
          className="input" // Reusing your existing styling class
          placeholder="e.g., A sunny beach day with friends, New product launch for eco-friendly bags..."
          value={description}
          autoFocus
          onChange={(e) => setDescription(e.target.value)}
          rows="4" // Make it a textarea for longer descriptions
          style={{ width: "98%", resize: 'vertical' }} // Allow vertical resizing
        />
      </div>

      {/* Tone Selection (New) */}
      <div style={{ marginBottom: '10px' }}>
        <label htmlFor="tone" style={{ display: 'block', marginBottom: '5px', color: 'var(--text-secondary)', fontSize: '0.9em' }}>
          Select Tone:
        </label>
        <select
          id="tone"
          className="input" // Reusing your existing styling class for dropdown
          value={tone}
          onChange={(e) => setTone(e.target.value)}
          style={{ width: "calc(98% + 2px)" }} // Adjust width to visually align with textarea/input
        >
          <option value="neutral">Neutral</option>
          <option value="funny">Funny</option>
          <option value="inspirational">Inspirational</option>
          <option value="professional">Professional</option>
          <option value="witty">Witty</option>
          <option value="casual">Casual</option>
          <option value="sarcastic">Sarcastic</option>
          {/* Add more tones as you find useful */}
        </select>
      </div>

      {/* Keywords Input (New) */}
      <div style={{ marginBottom: '15px' }}>
        <label htmlFor="keywords" style={{ display: 'block', marginBottom: '5px', color: 'var(--text-secondary)', fontSize: '0.9em' }}>
          Keywords (comma-separated, optional):
        </label>
        <input
          id="keywords"
          type="text"
          className="input" // Reusing your existing styling class
          placeholder="e.g., summer, beachlife, friendship, #travel"
          value={keywords}
          onChange={(e) => setKeywords(e.target.value)}
          style={{ width: "98%" }}
        />
      </div>

      <button
        className="btn" // Reusing your existing styling class
        style={{ width: 170 }}
        onClick={generateCaptions}
        disabled={loading || !description.trim()} // Disable if loading or description is empty
      >
        {loading ? "Generating..." : "Generate Caption"}
      </button>

      {error && <div style={{ color: "var(--danger)", margin: "15px 0 0" }}>{error}</div>}

      {caption && (
        <div style={{ marginTop: '20px', border: '1px solid var(--border-color)', padding: '15px', borderRadius: '8px', background: 'var(--background-secondary)' }}>
          <h4 style={{ marginBottom: '10px', color: 'var(--text-primary)' }}>Generated Caption:</h4>
          <p style={{ color: 'var(--text-secondary)', whiteSpace: 'pre-wrap', fontFamily: 'monospace' }}>{caption}</p>
        </div>
      )}
    </div>
  );
}

export default CaptionGenerator;