//
// PUBLIC_INTERFACE
// API stub for Gemini (AI) integration, returns mock payload after artificial async delay.
/**
 * Returns mock Gemini completion/response data, simulating network delay.
 */
export async function fetchGeminiContent(/*query*/) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: "gemini01",
          title: "Gemini AI Text Generation",
          result: "This is an example response from Gemini's text generation API.",
          type: "completion",
          prompt: "Write a welcome message for CreatorHub.",
        },
      ]);
    }, 1100 + Math.random() * 600); // ~1.1-1.7s
  });
}
