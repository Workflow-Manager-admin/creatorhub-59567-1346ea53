import React, { useState } from "react";

// PUBLIC_INTERFACE
/**
 * ContentIdeaGenerator
 * Lets user select a content niche (dropdown), generates 5–10 content ideas, and allows user to favorite/save ideas.
 * Features:
 * - Niche/topic dropdown (e.g. Fitness, AI, Marketing, Travel, Cooking, Wellness)
 * - Stubbed local logic for idea generation (demo/randomized)
 * - Displays 5–10 idea cards per run (each card: idea text, optional tag, favorite/save toggle)
 * - Responsive, modern card layout, matches rest of CreatorHub UI
 * - All logic local (can replace with API integration later)
 */

const NICHES = [
  { value: "fitness", label: "Fitness" },
  { value: "ai", label: "Artificial Intelligence" },
  { value: "marketing", label: "Marketing" },
  { value: "travel", label: "Travel" },
  { value: "cooking", label: "Cooking" },
  { value: "wellness", label: "Wellness" },
  { value: "finance", label: "Personal Finance" },
  { value: "fashion", label: "Fashion" },
  { value: "parenting", label: "Parenting" },
];

function stubIdeaPool(niche) {
  // Add more ideas as needed. These are shuffled and picked for 5–10 output ideas.
  const pool = {
    fitness: [
      "5-minute desk workouts anyone can do!",
      "Why daily stretching improves creativity.",
      "Morning vs. evening workouts — what’s best?",
      "How to stay motivated on your fitness journey.",
      "Deskercise: Staying active at work.",
      "Small daily habits for a healthier you.",
      "How to meal prep as a busy professional.",
      "Underrated fitness tips for beginners.",
      "Myth-busting: Cardio vs. strength for fat loss.",
      "Apps that helped me stay accountable.",
      "Fitness gadgets actually worth buying.",
    ],
    ai: [
      "AI tools every creator should try in 2024.",
      "Prompt engineering: Getting better results.",
      "Top 3 free AI image generators (demo/review).",
      "How to add AI to your workflow.",
      "The future of AI in content creation.",
      "AI myths busted for beginners.",
      "Video: What is generative AI — simply explained.",
      "Day in the life with AI automation.",
      "How safe is your data with AI tools?",
      "What ChatGPT can and can’t do.",
      "Coolest open-source AI resources online.",
    ],
    marketing: [
      "Email vs. social media: Which wins in 2024?",
      "Branding checklist for new creators.",
      "How I planned a viral campaign (step-by-step).",
      "Repurposing old content for new platforms.",
      "3 influencer outreach templates that convert.",
      "Video breakdown: My highest-ROI ad.",
      "Content calendars: My template secrets.",
      "Micro vs. macro influencers — what brands miss.",
      "How to A/B test your content ideas.",
      "Why storytelling matters in digital marketing.",
      "Marketing tools that actually save time.",
    ],
    travel: [
      "Travel hacks for digital creators on the move.",
      "Hidden gems: Destinations you never considered.",
      "How to work remotely while traveling.",
      "Packing minimalist for long trips.",
      "How to capture video content on the go.",
      "Affordable travel: Budget breakdown.",
      "Best apps for solo travelers in 2024.",
      "Travel day essentials in my creator kit.",
      "How I edit travel photos fast.",
      "Travel and content: Tips for seamless workflow.",
      "Staying safe as a solo traveler.",
    ],
    cooking: [
      "Recipes you can make in under 15 minutes.",
      "How meal prepping saves time and money.",
      "Behind the scenes: Recipe video setup.",
      "One-pot wonders for busy nights.",
      "How to get perfect food photography lighting.",
      "Weekly meal plan template + examples.",
      "Essential tools for home chefs (2024).",
      "Cooking for picky eaters: My hacks.",
      "Budget-friendly grocery hauls.",
      "My favorite quick healthy snacks.",
      "Food myths everyone believes.",
    ],
    wellness: [
      "How I journal for better focus.",
      "Simple mindfulness tips for a busy creator.",
      "Nightly routines that improve sleep quality.",
      "How to handle burnout (real talk).",
      "My top wellness podcasts.",
      "5 self-care rituals for every week.",
      "Book review: Life-changing wellness reads.",
      "Wellness swaps: Small changes, big impact.",
      "Daily affirmations I use for courage.",
      "What I learned from a digital detox.",
    ],
    finance: [
      "How I track expenses as a freelancer.",
      "My go-to invoicing tools.",
      "Budget breakdown: Monthly creator income.",
      "How to save on taxes (creator edition).",
      "Passive income ideas for beginners.",
      "Top investment apps in 2024.",
      "How to price your creative work.",
      "Money mindset shifts that helped me.",
      "Side hustle: Is it right for you?",
      "Emergency fund tips explained.",
    ],
    fashion: [
      "Outfit ideas for creators on camera.",
      "How to find your personal style (worksheet).",
      "Thrift shopping: Best finds this season.",
      "Secrets to effortless photo shoots.",
      "Wardrobe staples you’ll wear all year.",
      "How I plan fashion content on a budget.",
      "Must-have accessories for shoots.",
      "Color theory for personal branding.",
      "Making style moodboards with AI.",
      "Sustainable fashion tips for modern creators.",
    ],
    parenting: [
      "Balancing content creation with parenthood.",
      "Easy crafts for kids (video ideas).",
      "Screen time: Realistic strategies.",
      "Tips for working from home with toddlers.",
      "Routines that save our mornings.",
      "Parenting fails that turned into wins.",
      "Family vlogs: Dos and don’ts.",
      "How to include your kids safely on camera.",
      "Self-care when life gets chaotic.",
      "Best family-friendly productivity apps.",
    ]
  };
  // fallback: generic creative ideas
  const fallback = [
    "How to boost your productivity this week.",
    "Top 3 lessons from my creative journey.",
    "Tools I wish I knew when starting out.",
    "Secrets to growing your audience in 2024.",
    "Mistakes I made (and how you can avoid them).",
    "My creative routine: What works for me.",
    "Beginner tips for building your brand.",
  ];
  return pool[niche] || fallback;
}

function getRandomIdeas(niche) {
  // Shuffle, pick 5–10 ideas
  const list = stubIdeaPool(niche);
  const arr = [...list];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  const n = 5 + Math.floor(Math.random() * 6); // 5–10
  return arr.slice(0, n);
}

function ContentIdeaGenerator() {
  const [niche, setNiche] = useState(NICHES[0].value);
  const [ideas, setIdeas] = useState(getRandomIdeas(NICHES[0].value));
  const [loading, setLoading] = useState(false);
  const [favorited, setFavorited] = useState({}); // idea idx: true
  // Optionally store "saved" ideas in localStorage or in-state array in the future.

  function handleGenerate(e) {
    e && e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setIdeas(getRandomIdeas(niche));
      setLoading(false);
      setFavorited({}); // Reset favorites for new batch
    }, 750);
  }

  function toggleFavorite(idx) {
    setFavorited(fav => ({ ...fav, [idx]: !fav[idx] }));
  }

  return (
    <div
      className="ch-card"
      style={{
        maxWidth: 530,
        margin: "0 auto",
        borderRadius: 24,
        boxShadow: "var(--shadow-card)",
        padding: 30,
        background: "var(--card-bg,rgba(36,38,50,0.92))",
      }}
    >
      <div
        className="ch-card-title"
        style={{
          fontWeight: 800,
          fontSize: "1.22em",
          marginBottom: 13,
          color: "var(--accent,#A178DF)",
          textShadow: "0 2px 11px #a178df1b",
        }}
      >
        Content Idea Generator
      </div>
      <form
        onSubmit={handleGenerate}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 13,
          marginBottom: 20,
        }}
        aria-label="Content niche input"
      >
        <label htmlFor="content-niche" style={{ fontSize: ".98em", color: "var(--text-secondary)" }}>
          Select a niche:
        </label>
        <select
          id="content-niche"
          value={niche}
          className="ch-search"
          style={{
            background: "#242b46",
            color: "var(--accent)",
            fontWeight: 600,
            fontSize: "1em",
            border: "1.2px solid var(--border-color)",
            borderRadius: 15,
            padding: "9px 10px",
            marginBottom: 4,
            maxWidth: 260,
          }}
          onChange={e => setNiche(e.target.value)}
        >
          {NICHES.map(t => (
            <option value={t.value} key={t.value}>{t.label}</option>
          ))}
        </select>
        <button
          type="submit"
          className="ch-info-btn"
          disabled={loading}
          style={{
            marginTop: 6,
            fontWeight: 700,
            alignSelf: "flex-start",
            minWidth: 98,
            background: "var(--accent-gradient)",
            color: "#fff",
          }}
        >
          {loading ? "Generating…" : "Generate Ideas"}
        </button>
      </form>
      <div>
        {loading ? (
          <div className="ch-loader" style={{ margin: "17px 0 14px 0" }}>
            Generating content ideas…
          </div>
        ) : (
          ideas && ideas.length > 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {ideas.map((idea, idx) => (
                <div
                  key={idx}
                  style={{
                    background: favorited[idx]
                      ? "var(--success-bg)"
                      : "var(--info-bg)",
                    color: favorited[idx] ? "var(--success)" : "var(--info)",
                    borderRadius: 13,
                    padding: "15px 15px 12px",
                    boxShadow: favorited[idx]
                      ? "0 2.5px 10px #58D89A21"
                      : "0 2.5px 10px #82C4EC28",
                    position: "relative",
                  }}
                >
                  <div style={{ fontWeight: 600, fontSize: ".99em", color: "var(--text-color)", marginBottom: 7 }}>
                    Idea {idx + 1}
                  </div>
                  <div style={{
                    fontWeight: 500, fontSize: "1.10em", color: "var(--accent)", marginBottom: 10
                  }}>
                    {idea}
                  </div>
                  <button
                    type="button"
                    className="ch-info-btn"
                    aria-label={favorited[idx] ? "Unfavorite idea" : "Favorite idea"}
                    onClick={() => toggleFavorite(idx)}
                    style={{
                      background: favorited[idx]
                        ? "var(--success)"
                        : "var(--accent-gradient-focus)",
                      color: "#fff",
                      fontWeight: 700,
                      minWidth: 84,
                      boxShadow: favorited[idx]
                        ? "0 1.1px 7px #58d89a66"
                        : "0 1.1px 7px #ce6d8740",
                      border: favorited[idx] ? "1.2px solid var(--success)" : undefined,
                    }}
                  >
                    <span
                      style={{
                        marginRight: 5,
                        verticalAlign: "middle",
                        fontWeight: "bold",
                        fontSize: "1em",
                        filter: favorited[idx] ? "drop-shadow(0 1.5px 9px #58D89A44)" : undefined
                      }}
                    >
                      {favorited[idx] ? "★" : "☆"}
                    </span>
                    {favorited[idx] ? "Saved" : "Save"}
                  </button>
                </div>
              ))}
            </div>
          )
        )}
      </div>
      <div style={{ fontSize: ".98em", color: "var(--text-secondary)", marginTop: 19 }}>
        5–10 unique content ideas generated per run. Tap the star to save your favorites.
      </div>
      <div style={{ fontSize: ".93em", color: "var(--success)", marginTop: 5, fontWeight: 500 }}>
        Pro tip: Use these ideas for posts, videos, blogs, or inspiration!
      </div>
    </div>
  );
}

export default ContentIdeaGenerator;
