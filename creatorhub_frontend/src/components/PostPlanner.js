import React, { useState } from "react";

// PUBLIC_INTERFACE
/**
 * PostPlanner board component
 * - Save/organize/schedule content ideas.
 * - Display as sortable board (by columns) or list.
 * - Tagging and status (Scheduled/Posted/Archived) support.
 * - Add/save new ideas.
 * - Optional mini-calendar for date scheduling (logic stub).
 * - Minimal dependencies, matches CreatorHub minimalist card UI.
 */
const STATUSES = [
  { value: "scheduled", label: "Scheduled" },
  { value: "posted", label: "Posted" },
  { value: "archived", label: "Archived" },
];

const DEFAULT_TAGS = [
  "Inspiration",
  "AI",
  "Tutorial",
  "Personal",
  "Announcement",
  "News",
];

function genId() {
  // Generate a very simple unique ID (stub)
  return (
    "idea_" +
    Math.random().toString(36).substring(2, 8) +
    "_" +
    Date.now().toString(36)
  );
}

function defaultIdeas() {
  // Demo stub: 5 sample ideas with tags/status/dates.
  return [
    {
      id: genId(),
      text: "Weekly coding tips roundup",
      tags: ["Inspiration", "Tutorial"],
      status: "scheduled",
      date: new Date().toISOString().slice(0, 10),
    },
    {
      id: genId(),
      text: "Try this new AI productivity tool review",
      tags: ["AI", "News"],
      status: "posted",
      date: new Date(Date.now() - 86400000 * 2).toISOString().slice(0, 10),
    },
    {
      id: genId(),
      text: "What motivates your creative process?",
      tags: ["Personal"],
      status: "archived",
      date: new Date(Date.now() - 86400000 * 6).toISOString().slice(0, 10),
    },
    {
      id: genId(),
      text: "Launching our new community Discord!",
      tags: ["Announcement"],
      status: "scheduled",
      date: new Date(Date.now() + 86400000 * 6).toISOString().slice(0, 10),
    },
    {
      id: genId(),
      text: "Three lessons from 100 days of content",
      tags: ["Personal", "Inspiration"],
      status: "posted",
      date: new Date(Date.now() - 86400000 * 1).toISOString().slice(0, 10),
    },
  ];
}

function tagColor(tag) {
  // Pick gradient/accent color based on tag.
  // Minimal stub for demo purpose.
  if (tag === "AI") return "var(--info-bg)";
  if (tag === "Personal") return "var(--success-bg)";
  if (tag === "Announcement") return "var(--accent-gradient)";
  if (tag === "News") return "var(--danger-bg)";
  if (tag === "Tutorial") return "var(--warning-bg)";
  return "var(--card-bg, #232845)";
}

function statusColor(status) {
  if (status === "scheduled") return { background: "var(--info-bg)", color: "var(--info)" };
  if (status === "posted") return { background: "var(--success-bg)", color: "var(--success)" };
  if (status === "archived") return { background: "var(--danger-bg)", color: "var(--danger)" };
  return {};
}

// Simple Tag badge
function Tag({ children }) {
  return (
    <span
      className="ch-card-tag"
      style={{
        background: tagColor(children),
        color: children === "Announcement" ? "#fff" : undefined,
        marginRight: 7,
        marginBottom: 3,
        borderRadius: 13,
        fontSize: "0.97em",
        fontWeight: 600,
        padding: "3px 11px",
        verticalAlign: "middle",
        display: "inline-block",
      }}
    >
      {children}
    </span>
  );
}

// Editable input for tags (simple comma-separated or type-to-add mode)
function TagInput({ tags = [], setTags, allTags = DEFAULT_TAGS }) {
  const [input, setInput] = useState("");
  const filtered = allTags.filter(t => !tags.includes(t));
  const addTag = t => {
    if (!tags.includes(t)) setTags([...tags, t]);
    setInput("");
  };
  return (
    <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 7 }}>
      {tags.map(tag => (
        <Tag key={tag}>
          {tag}
          <button
            onClick={() => setTags(tags.filter(t => t !== tag))}
            style={{
              background: "none", border: "none", color: "#E87A41", marginLeft: 2, fontWeight: 700, fontSize: "1.03em", cursor: "pointer", padding: 0
            }}
            aria-label="Remove tag"
            type="button"
            tabIndex={0}
          >
            ×
          </button>
        </Tag>
      ))}
      <input
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="Add tag..."
        style={{
          width: 83,
          border: "none",
          outline: "none",
          background: "transparent",
          color: "var(--accent)",
          fontSize: "0.98em"
        }}
        onKeyDown={e => {
          if ((e.key === "Enter" || e.key === ",") && input.trim()) {
            addTag(input.trim());
          }
        }}
        list="tag-list"
      />
      <datalist id="tag-list">
        {filtered.map(tag => <option key={tag} value={tag} />)}
      </datalist>
      {filtered.length > 0 && (
        <select
          onChange={e => { if (e.target.value) addTag(e.target.value); }}
          value=""
          style={{ background: "#242b46", color: "var(--accent)", border: "none", borderRadius: 10, fontSize: ".97em" }}
        >
          <option value="">+ Tag</option>
          {filtered.map(tag => <option key={tag} value={tag}>{tag}</option>)}
        </select>
      )}
    </div>
  );
}

// Idea card component
function PlannerCard({ idea, onEdit, onRemove, onStatusChange, draggableProps, dragHandleProps, editing = false }) {
  const [editMode, setEditMode] = useState(editing);
  const [text, setText] = useState(idea.text);
  const [tags, setTags] = useState(idea.tags || []);
  const [date, setDate] = useState(idea.date || "");

  // Callbacks for save/remove
  function handleSave() {
    onEdit({ ...idea, text, tags, date });
    setEditMode(false);
  }
  function handleStatusChange(e) {
    const status = e.target.value;
    onStatusChange({ ...idea, status });
  }
  if (editMode) {
    return (
      <div className="ch-card" style={{ marginBottom: 13, boxShadow: "var(--shadow-card)", border: "1.2px dashed var(--accent)", padding: 22, background: "var(--card-bg)", ...draggableProps?.style }}>
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          style={{ width: "100%", borderRadius: 7, fontSize: "1em", padding: 8, marginBottom: 8, border: "1.1px solid var(--border-color)" }}
          rows={2}
          placeholder="Content idea..."
        />
        <TagInput tags={tags} setTags={setTags} />
        <div style={{ display: "flex", alignItems: "center", gap: 13, marginTop: 8 }}>
          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            style={{ background: "#181d26", color: "var(--info)", border: "1.2px solid var(--border-color)", borderRadius: 8, padding: "4px 8px" }}
          />
          <select
            value={idea.status}
            onChange={handleStatusChange}
            style={{ borderRadius: 11, border: "1.1px solid var(--border-color)", color: statusColor(idea.status).color, background: statusColor(idea.status).background, minWidth: 88, fontWeight: 600, padding: "6px 10px" }}
          >
            {STATUSES.map(s => <option value={s.value} key={s.value}>{s.label}</option>)}
          </select>
          <button onClick={handleSave} className="ch-info-btn" style={{ minWidth: 77, background: "var(--accent-gradient)", color: "#fff" }}>Save</button>
          <button onClick={() => setEditMode(false)} className="ch-info-btn" style={{ minWidth: 68, background: "var(--danger-bg)", color: "var(--danger)" }}>Cancel</button>
          {onRemove && (
            <button onClick={() => onRemove(idea.id)} className="ch-info-btn" style={{ minWidth: 68, background: "var(--danger)", color: "#fff" }}>Delete</button>
          )}
        </div>
      </div>
    );
  }
  return (
    <div className="ch-card"
      style={{
        marginBottom: 14, boxShadow: "var(--shadow-card)",
        cursor: draggableProps ? "grab" : "default",
        opacity: draggableProps && draggableProps["aria-grabbed"] ? 0.6 : 1,
        ...draggableProps?.style
      }}
      tabIndex={0}
      {...(draggableProps || {})}
      {...(dragHandleProps || {})}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ fontWeight: 700, fontSize: "1.07em", color: "var(--accent)", flex: 1 }}>
          {idea.text}
        </div>
        <div>
          <span style={{ ...statusColor(idea.status), borderRadius: 9, fontWeight: 700, fontSize: ".93em", padding: "4px 10px", marginLeft: 11 }}>
            {STATUSES.find(s => s.value === idea.status)?.label || idea.status}
          </span>
        </div>
      </div>
      <div style={{ marginTop: 7, marginBottom: 5, display: "flex", gap: 7, flexWrap: "wrap" }}>
        {idea.tags && idea.tags.map(tag => <Tag key={tag}>{tag}</Tag>)}
      </div>
      <div style={{ color: "var(--text-secondary)", fontSize: ".98em", margin: "4px 0" }}>
        Scheduled for: {idea.date || "N/A"}
      </div>
      <div style={{ display: "flex", gap: 10, marginTop: 11 }}>
        <button type="button" className="ch-info-btn" style={{ background: "var(--accent-gradient)", color: "#fff", minWidth: 67 }} onClick={() => setEditMode(true)}>
          Edit
        </button>
        {onRemove && (
          <button type="button" className="ch-info-btn" style={{ background: "var(--danger-bg)", color: "var(--danger)", minWidth: 68 }} onClick={() => onRemove(idea.id)}>
            Delete
          </button>
        )}
        <select
          value={idea.status}
          onChange={handleStatusChange}
          style={{ borderRadius: 9, border: "1.1px solid var(--border-color)", color: statusColor(idea.status).color, background: statusColor(idea.status).background, minWidth: 98, fontWeight: 600, padding: "5px 9px" }}
        >
          {STATUSES.map(s => <option value={s.value} key={s.value}>{s.label}</option>)}
        </select>
      </div>
    </div>
  );
}

// Mini Calendar stub for demo (logic only, not interactive calendar UI)
function MiniCalendar({ ideasByDate }) {
  // Gather unique sorted dates (max ~10 upcoming for stub display)
  const dates = Object.keys(ideasByDate).sort().slice(0, 10);
  return (
    <div className="ch-card" style={{ maxWidth: 295, minWidth: 210, background: "var(--card-bg,rgba(36,38,50,0.82))", borderRadius: 20, padding: "22px 18px 18px 18px", marginRight: 19, boxShadow: "var(--shadow-card)" }}>
      <div className="ch-card-title" style={{ color: "var(--accent)", fontWeight: 700, fontSize: "1.08em", marginBottom: 12 }}>
        Mini Calendar (stub)
      </div>
      {dates.length === 0 && <div style={{ color: "var(--text-secondary)" }}>No scheduled ideas.</div>}
      <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
        {dates.map(date => (
          <li key={date} style={{ marginBottom: 10 }}>
            <span style={{ fontWeight: 600, color: "var(--success)" }}>{date}</span>
            <ul style={{ paddingLeft: 14, margin: "2px 0 0 0" }}>
              {ideasByDate[date].map(idea => (
                <li key={idea.id} style={{ color: "var(--text-secondary)", fontSize: ".98em" }}>{idea.text}</li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
      <div style={{ fontSize: ".93em", color: "var(--info)", marginTop: 7 }}>Upcoming scheduled posts (demo view)</div>
    </div>
  );
}

// Main PostPlanner board component
function PostPlanner({ initialIdeas }) {
  // state, with persistence stub
  const [ideas, setIdeas] = useState(() => initialIdeas || defaultIdeas());
  const [addMode, setAddMode] = useState(false);
  const [viewMode, setViewMode] = useState("board"); // or "list"
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterTag, setFilterTag] = useState("all");

  // Adding a new post idea
  const addEmptyIdea = () => ({
    id: genId(),
    text: "",
    tags: [],
    status: "scheduled",
    date: new Date().toISOString().slice(0,10),
  });

  function handleAddNew() {
    setIdeas([addEmptyIdea(), ...ideas]);
    setAddMode(true);
  }
  function handleSaveEdit(edited) {
    setIdeas(prev => prev.map(idea => idea.id === edited.id ? edited : idea));
    setAddMode(false);
  }
  function handleRemove(id) {
    setIdeas(prev => prev.filter(idea => idea.id !== id));
    setAddMode(false);
  }
  function handleStatusChange(edited) {
    setIdeas(prev => prev.map(idea => idea.id === edited.id ? edited : idea));
  }
  // Filtering/sorting
  const allTags = Array.from(new Set(ideas.flatMap(i => i.tags)));
  let filteredIdeas = ideas;
  if (filterStatus !== "all") filteredIdeas = filteredIdeas.filter(i => i.status === filterStatus);
  if (filterTag !== "all") filteredIdeas = filteredIdeas.filter(i => i.tags.includes(filterTag));

  // Board/group by status
  function groupByStatus(arr) {
    return STATUSES.map(s => ({
      status: s.value,
      label: s.label,
      ideas: arr.filter(i => i.status === s.value)
    }));
  }
  // For mini-calendar stub
  const ideasByDate = filteredIdeas.filter(i => i.status === "scheduled" && i.date).reduce((acc, i) => {
    acc[i.date] = acc[i.date] || [];
    acc[i.date].push(i);
    return acc;
  }, {});

  // Simple drag-and-drop stub (no external lib: reorder in column on dragstart/dragend)
  const [dragInfo, setDragInfo] = useState({ ideaId: null, fromStatus: null });
  function onDragStart(evt, idea) {
    setDragInfo({ ideaId: idea.id, fromStatus: idea.status });
    evt.dataTransfer.effectAllowed = "move";
  }
  function onDrop(evt, destStatus) {
    evt.preventDefault();
    if (!dragInfo.ideaId) return;
    setIdeas(prev =>
      prev.map(i =>
        i.id === dragInfo.ideaId ? { ...i, status: destStatus } : i
      )
    );
    setDragInfo({ ideaId: null, fromStatus: null });
  }

  return (
    <section style={{ width: "100%", marginTop: 19, minHeight: "67vh" }}>
      <div style={{ display: "flex", alignItems: "flex-start", marginBottom: 18, flexWrap: "wrap" }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 13, flexWrap: "wrap" }}>
            <div className="ch-card-title" style={{ fontSize: "1.31em", color: "var(--accent)", fontWeight: 800, marginBottom: 0, marginRight: 14 }}>
              Post Planner Board
            </div>
            <button className="ch-info-btn" type="button" onClick={() => setViewMode(viewMode === "board" ? "list" : "board")} style={{ minWidth: 82 }}>
              {viewMode === "board" ? "List view" : "Board view"}
            </button>
            <button className="ch-info-btn" type="button" onClick={handleAddNew} style={{ minWidth: 102, background: "var(--accent-gradient)", marginLeft: 4 }}>
              + Add Idea
            </button>
            <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={{ borderRadius: 11, minWidth: 100 }}>
              <option value="all">All Statuses</option>
              {STATUSES.map(s => <option value={s.value} key={s.value}>{s.label}</option>)}
            </select>
            <select value={filterTag} onChange={e => setFilterTag(e.target.value)} style={{ borderRadius: 11, minWidth: 102 }}>
              <option value="all">All Tags</option>
              {allTags.map(tag => <option value={tag} key={tag}>{tag}</option>)}
            </select>
          </div>
          <div className="description" style={{ fontSize: ".99em", marginTop: 7, color: "var(--text-secondary)" }}>
            Organize and schedule your content ideas. Drag across columns or edit inline.
          </div>
        </div>
        <MiniCalendar ideasByDate={ideasByDate} />
      </div>
      {/* Board layout: Kanban style */}
      {viewMode === "board" ? (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(325px,1fr))",
          gap: 32,
          alignItems: "flex-start",
          width: "100%",
          margin: "0 auto",
          marginBottom: 34,
        }}>
          {groupByStatus(filteredIdeas).map(col => (
            <div
              key={col.status}
              onDragOver={e => e.preventDefault()}
              onDrop={e => onDrop(e, col.status)}
              style={{
                background: "var(--background-secondary,#191a2fc9)",
                borderRadius: 22,
                minHeight: 280,
                padding: "10px 11px 10px 11px",
                boxShadow: "0 2.5px 14px #19182718",
              }}
            >
              <div style={{
                fontWeight: 700,
                color: "var(--accent,#A178DF)",
                fontSize: "1.08em",
                marginBottom: 8,
                marginLeft: 2,
                marginTop: 4
              }}>{col.label}</div>
              {col.ideas.length === 0 && (
                <div style={{ color: "var(--text-secondary)", fontStyle: "italic", marginBottom: 10 }}>No ideas.</div>
              )}
              {col.ideas.map(idea => (
                <div
                  key={idea.id}
                  draggable
                  aria-grabbed={dragInfo.ideaId === idea.id}
                  onDragStart={e => onDragStart(e, idea)}
                  onDragEnd={() => setDragInfo({ ideaId: null, fromStatus: null })}
                >
                  <PlannerCard
                    idea={idea}
                    onEdit={handleSaveEdit}
                    onRemove={handleRemove}
                    onStatusChange={handleStatusChange}
                    editing={addMode && col.status === "scheduled" && idea.text === ""}
                    draggableProps={{
                      style: dragInfo.ideaId === idea.id ? { opacity: 0.4 } : undefined,
                      tabIndex: 0,
                      "aria-grabbed": dragInfo.ideaId === idea.id
                    }}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      ) : (
        // List view
        <div style={{
          width: "100%",
          maxWidth: 850,
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          gap: 14,
        }}>
          {filteredIdeas.length === 0 && (
            <div style={{ color: "#E87A41", fontWeight: 500, margin: "33px 0", fontSize: "1.07em" }}>
              No ideas found.
            </div>
          )}
          {filteredIdeas.map(idea => (
            <PlannerCard
              key={idea.id}
              idea={idea}
              onEdit={handleSaveEdit}
              onRemove={handleRemove}
              onStatusChange={handleStatusChange}
              editing={addMode && idea.text === ""}
            />
          ))}
        </div>
      )}
      <div style={{ color: "var(--info)", fontSize: ".97em", marginTop: 34 }}>
        Stubbed logic: no backend/persistence – all actions in-memory. Drag-and-drop is demo only.
      </div>
    </section>
  );
}

export default PostPlanner;
