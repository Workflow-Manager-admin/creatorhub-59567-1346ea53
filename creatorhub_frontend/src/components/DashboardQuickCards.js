import React from "react";
import Card from "./Card";

// PUBLIC_INTERFACE
const guides = [
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
  // Add more content creation guides as needed!
];

// PUBLIC_INTERFACE
function DashboardQuickCards() {
  return (
    <div className="dashboard-quick-cards" style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(270px, 1fr))",
      gap: "1.3rem",
      marginTop: 25,
      width: "100%"
    }}>
      {guides.map((card, idx) => (
        <Card
          key={idx}
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
