/**
 * This module provides wrappers for RapidAPI or similar backend APIs
 * for Hook Generator, Caption Generator, Content Idea Generator, and Post Planner.
 */
const BASE_URL = "https://your-backend-api.example.com"; // Replace with real backend endpoint

// Utility: handles fetch & basic error
async function postJSON(apiPath, body) {
  const response = await fetch(`${BASE_URL}${apiPath}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    throw new Error(`API error: ${response.statusText}`);
  }
  return await response.json();
}

// PUBLIC_INTERFACE
/**
 * Fetch YouTube channel stats.
 */
export async function getYoutubeChannelStats(channelId) {
  // Example: not used for hook/caption/content tools
  const res = await fetch(`${BASE_URL}/youtube/stats?channelId=${channelId}`);
  if (!res.ok) throw new Error("Failed to fetch channel stats.");
  return res.json();
}

// PUBLIC_INTERFACE
/**
 * Generates content hooks from a topic prompt using a real API.
 * @param {string} prompt Text describing the topic for the hook.
 * @returns {Promise<{hooks: string[]}>}
 */
export async function generateHooks(prompt) {
  // Expects: { prompt }
  return await postJSON("/hooks/generate", { prompt });
}

// PUBLIC_INTERFACE
/**
 * Generate content ideas for a topic/audience using a real API.
 * @param {string} topic
 * @returns {Promise<{ideas: string[]}>}
 */
export async function generateContentIdeas(topic) {
  // Expects: { topic }
  return await postJSON("/ideas/generate", { topic });
}

// PUBLIC_INTERFACE
/**
 * Generate social captions from a prompt using a real API.
 * @param {string} prompt
 * @returns {Promise<{captions: string[]}>}
 */
export async function generateCaptions(prompt) {
  // Expects: { prompt }
  return await postJSON("/captions/generate", { prompt });
}

// PUBLIC_INTERFACE
/**
 * Generate a weekly post plan based on a content goal using a real API.
 * @param {string} goal
 * @returns {Promise<{plan: {day: string, topic: string}[]}>}
 */
export async function generatePostPlan(goal) {
  // Expects: { goal }
  return await postJSON("/posts/plan", { goal });
}
