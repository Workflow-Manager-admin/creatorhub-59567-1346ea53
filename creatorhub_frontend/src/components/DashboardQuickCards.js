// DashboardQuickCards.js
import React from "react";
import Card from "./Card";

// PUBLIC_INTERFACE
export const staticDashboardGuides = [ // Export the guides array
  {
    title: "How to Create Engaging YouTube Videos",
    description: "Learn the essentials of YouTube video production, scripting, editing, and optimizing for growth.",
    icon: "🎥",
    link: "https://www.creatoracademy.youtube.com/page/course/engage-your-audience",
  },
  {
    title: "Blogging for Beginners",
    description: "Step-by-step tips on starting your blog, writing captivating posts, and attracting a loyal readership.",
    icon: "✍️",
    link: "https://www.problogger.com/how-to-start-a-blog/",
  },
  {
    title: "Social Media Growth Tips",
    description: "Strategies for growing your audience on Instagram, TikTok, and Twitter. Proven hacks and analytics insights.",
    icon: "📈",
    link: "https://www.socialmediaexaminer.com/social-media-marketing-strategy-how-to-grow-your-following/",
  },
  {
    id: "instagram-creator-guide", // Add an ID for consistency
    accent: "guide",
    title: "Instagram Best Practices for Creators",
    desc: "Boost your reach, engage your audience, and master Instagram features.",
    icon: "icon",
    link: "https://help.instagram.com/366992426735657",
  },
  // Add more content creation guides as needed!
];

// PUBLIC_INTERFACE (You might remove this component if it's no longer used for direct rendering)
function DashboardQuickCards() {
  return (
    <div className="dashboard-quick-cards" style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(270px, 1fr))",
      gap: "1.3rem",
      marginTop: 25,
      width: "100%"
    }}>
      {staticDashboardGuides.map((card, idx) => ( // Use the exported guides
        <Card
          key={card.id || idx} // Use ID for key if available
          title={card.title}
          description={card.description}
          icon={card.icon}
          link={card.link}
          style={{ minHeight: 142 }}
        />
      ))}
    </div>
  );
}

export default DashboardQuickCards;