//
// Post Planner Stub API
// This is a local-only mock for use in development/integration, not production!
//
// Usage: Import and call postPlannerStubApi.getPlannedPosts(), postPlannerStubApi.createPlannedPost(postData)
// Example: const posts = await postPlannerStubApi.getPlannedPosts();
//

/**
 * Fake planned posts data (any shape you want to use in the frontend)
 */
const examplePlannedPosts = [
  {
    id: "plan-1",
    title: "Launch Announcement",
    content: "We're excited to announce our new app! 🚀",
    date: "2024-06-30",
    platform: "Twitter",
    status: "scheduled",
  },
  {
    id: "plan-2",
    title: "Dev Blog",
    content: "How we built our creator hub with React!",
    date: "2024-07-02",
    platform: "Dev.to",
    status: "draft",
  },
];

// Helper to create a unique ID for mock posts
function generateId() {
  return `plan-${Math.floor(Math.random() * 1000000)}`;
}

// Posts "database" - local only, reset on browser refresh!
let mockPlannedPosts = [...examplePlannedPosts];

// PUBLIC_INTERFACE
/**
 * Simulate GET planned posts (async)
 * @returns {Promise<Array>} List of planned post objects.
 */
function getPlannedPosts() {
  // Simulate network/request delay
  return new Promise((resolve) => setTimeout(() => resolve([...mockPlannedPosts]), 300));
}

// PUBLIC_INTERFACE
/**
 * Simulate POST (create) a new planned post (async)
 * @param {Object} plannerData - Data for the new planned post.
 * @returns {Promise<Object>} The new planned post object as stored.
 */
function createPlannedPost(plannerData) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newPost = {
        ...plannerData,
        id: generateId(),
        status: plannerData.status || "scheduled",
      };
      mockPlannedPosts.push(newPost);
      resolve(newPost);
    }, 300);
  });
}

// PUBLIC_INTERFACE
/**
 * Simulate clearing/refreshing the planned post list (for testing)
 */
function resetPlannedPosts() {
  mockPlannedPosts = [...examplePlannedPosts];
}

const postPlannerStubApi = {
  getPlannedPosts,
  createPlannedPost,
  resetPlannedPosts,
};

export default postPlannerStubApi;
