//
// PUBLIC_INTERFACE
// API stub for Dev.to articles; returns a mock payload after an artificial delay.
/**
 * Returns mock Dev.to article data, simulating an async network call.
 */
export async function fetchDevToContent(/*query*/) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: "devto01",
          title: "10 Tips for Productive Coding",
          author: "devJane",
          url: "https://dev.to/devJane/10-tips",
          published_at: "2024-05-07",
          comments_count: 7,
          tags: ["productivity", "coding", "devto"],
        },
        {
          id: "devto02",
          title: "React Hooks: A Practical Guide",
          author: "devAlex",
          url: "https://dev.to/devAlex/react-hooks-guide",
          published_at: "2024-04-25",
          comments_count: 12,
          tags: ["react", "hooks", "javascript"],
        },
      ]);
    }, 700 + Math.random() * 900); // between 0.7s - 1.6s
  });
}
