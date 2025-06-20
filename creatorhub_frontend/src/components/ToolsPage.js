// ToolsPage.js
import React from "react";
import SelfContainedToolCard from "./SelfContainedToolCard"; // New wrapper component
import HashtagGenerator from "./HashtagGenerator"; // Import actual tool components
import CaptionGenerator from "./CaptionGenerator";
import HookGenerator from "./HookGenerator";
import PostPlanner from "./PostPlanner";
import ContentIdeaGenerator from "./ContentIdeaGenerator";

function ToolsPage() {
  const toolsData = [
    {
      title: "Hashtag Generator",
      description: "Suggested hashtags for engagement & trending topics.",
      iconType: "lottie", // Or specify "icon"
      ToolComponent: HashtagGenerator, // Pass the component itself
    },
    {
      title: "Caption Generator",
      description: "Type a topic and pick a tone for fresh caption ideas.",
      iconType: "icon",
      ToolComponent: CaptionGenerator,
    },
    {
      title: "Content Idea Generator",
      description: "Brainstorm winning content ideas for any topic or audience, powered by AI.",
      iconType: "lottie",
      ToolComponent: ContentIdeaGenerator,
    },
    {
      title: "Hook Generator",
      description: "Get attention-grabbing hooks for Reels, Shorts, TikToks, and more.",
      iconType: "lottie",
      ToolComponent: HookGenerator,
    },
    {
      title: "Post Planner",
      description: "Get a full weekly post plan based on your content goal.",
      iconType: "icon",
      ToolComponent: PostPlanner,
    },
  ];

  return (
    <section style={{ width: "100%" }}>
      <div style={{ /* ... your titles ... */ }}>Tools & Generators</div>
      <div style={{ /* ... your sub-titles ... */ }}>A unified place for all CreatorHub tools and quick generators</div>
      <div
        className="dashboard-tool-card-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(319px, 1fr))",
          gap: 32,
          alignItems: "stretch",
          justifyContent: "center",
          maxWidth: 1080,
          width: "100%",
          margin: "0 auto",
          padding: "0 13px"
        }}
      >
        {toolsData.map((tool, index) => (
          <SelfContainedToolCard
            key={tool.title || index} // Use title as key if unique, otherwise index
            title={tool.title}
            description={tool.description}
            iconType={tool.iconType}
            ToolComponent={tool.ToolComponent}
          />
        ))}
      </div>
    </section>
  );
}

export default ToolsPage;