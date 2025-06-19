//
// PUBLIC_INTERFACE
// API stub for YouTube-related content; returns a mock payload after a simulated network delay.
/**
 * Returns mock YouTube content, simulating an async API request with delay.
 */
export async function fetchYoutubeContent(/*query*/) {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simulated mock YouTube video object, you can enhance as needed
      resolve([
        {
          id: "yt01",
          title: "Mock YouTube Video: Build a React App",
          description: "Learn how to build a modern React app from scratch.",
          thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/0.jpg",
          url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
          channel: "AwesomeCreator",
          views: 138902,
          published_at: "2024-03-15",
        },
      ]);
    }, 850 + Math.random() * 650); // ~0.85-1.5s latency
  });
}
