import React, { useState, useEffect } from "react";
import Modal from "./Modal";
import { fetchGeminiContent } from "../api/gemini";

// A minimal markdown renderer for trusted Gemini markdown (safe for simple markdown)
// Only supports headings, bold, italics, lists, code, links.
function MarkdownRenderer({ markdown }) {
  if (!markdown) return null;

  // Basic substitutions
  let html = markdown
    .replace(/^### (.*)$/gm, '<h3>$1</h3>')
    .replace(/^## (.*)$/gm, '<h2>$1</h2>')
    .replace(/^# (.*)$/gm, '<h1>$1</h1>')
    .replace(/\*\*(.*?)\*\*/g, "<b>$1</b>")
    .replace(/\*(.*?)\*/g, "<i>$1</i>")
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    // Ordered lists
    .replace(/^\d+\.(.*)$/gm, '<li style="margin-left:18px">$1</li>')
    // Unordered lists
    .replace(/^\-\s+(.*)$/gm, '<li style="margin-left:18px">$1</li>')
    // Links [text](url)
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
    // Line breaks
    .replace(/\n\n+/g, "<br/><br/>")
    // Preserve simple line breaks
    .replace(/\n/g, "<br/>");

  // Patch loose list items into <ul>/<ol>
  html = html
    .replace(/((<li[\s\S]+?<\/li>)+)/g, '<ul>$1</ul>')
    // Remove adjacent <br/>s before/after <ul>
    .replace(/<br\/><ul>/g, "<ul>").replace(/<\/ul><br\/>/g, "</ul>");

  return (
    <div
      style={{ fontSize: "1.05em", color: "var(--text-color)" }}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

// PUBLIC_INTERFACE
/**
 * GeminiInsightsModal - Modal that fetches Gemini API insights for a tool and renders as markdown.
 * @param {object} props
 * @param {boolean} props.open - Controls modal visibility
 * @param {function} props.onClose - Modal close callback
 * @param {string} props.toolName - Name of the tool (required)
 * @param {string} props.category - Category of the tool (required)
 */
function GeminiInsightsModal({ open, onClose, toolName, category }) {
  const [loading, setLoading] = useState(false);
  const [markdown, setMarkdown] = useState("");
  const [error, setError] = useState(null);

  // Generate the Gemini prompt
  function buildPrompt(tool, cat) {
    return (
      `Gemini Insights for ${tool} (${cat}):\n` +
      `Provide the following about "${tool}" (category: ${cat}):\n` +
      "- **What it does**\n" +
      "- **Pros & Cons**\n" +
      "- **Best Use Cases**\n" +
      "- **Alternatives**\n" +
      "- **Getting Started Resources**\n\n" +
      "Format your answer in markdown. Use clear sections and bullet points where appropriate."
    );
  }

  useEffect(() => {
    if (!open) return;
    setMarkdown("");
    setError(null);
    setLoading(true);

    const prompt = buildPrompt(toolName, category);

    // Use the Gemini API stub for demo
    fetchGeminiContent(prompt)
      .then((resultArr) => {
        // If Gemini returns result as array of {result: "..."} use first
        let md =
          (Array.isArray(resultArr) && resultArr[0]?.result) ||
          (typeof resultArr === "object" && resultArr.result) ||
          "No insights found.";
        setMarkdown(md);
      })
      .catch(() => setError("Failed to fetch Gemini insights. Please try again later."))
      .finally(() => setLoading(false));
  }, [open, toolName, category]);

  return (
    <Modal open={open} onClose={onClose} blur={true}>
      <div style={{ width: 420, maxWidth: "94vw" }}>
        <div style={{ fontWeight: 800, fontSize: "1.22em", marginBottom: 10, color: "var(--accent)" }}>
          Gemini Insights: {toolName}
        </div>
        <div style={{ color: "var(--text-secondary)", marginBottom: 12 }}>Powered by Google Gemini | Category: <span style={{ color: "#E87A41", fontWeight: 600 }}>{category}</span></div>
        {loading && <div className="ch-loader" style={{ margin: "28px 0" }}>Loading insights…</div>}
        {error && <div style={{ color: "#EF6A6A", marginBottom: 15 }}>{error}</div>}
        {markdown && !loading && !error && <MarkdownRenderer markdown={markdown} />}
      </div>
    </Modal>
  );
}

export default GeminiInsightsModal;
