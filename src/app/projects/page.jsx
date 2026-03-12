
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import GlassSidebar from "@/components/GlassSidebar";

/* ─── ACCENT COLORS for DB projects ─── */
const ACCENTS = ["#c4b5fd","#93c5fd","#86efac","#fcd34d","#f9a8d4","#d8b4fe","#67e8f9","#fde68a"];
const THUMBS  = ["#e8e0f0","#dce8f0","#e8f0dc","#f0e8dc","#f0dce8","#e8dcf0","#dce8e8","#f0f0dc"];

function formatRelative(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins} mins ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hr ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days} days ago`;
  return new Date(dateStr).toLocaleDateString();
}

function dbToUi(p, i) {
  const rc = p.room_config || {};
  const items = Array.isArray(p.furniture_items) ? p.furniture_items.length : 0;
  return {
    id: p.id,
    name: p.name,
    date: new Date(p.created_at).toLocaleDateString(),
    items,
    lastEdited: formatRelative(p.updated_at || p.created_at),
    thumb: THUMBS[i % THUMBS.length],
    accent: ACCENTS[i % ACCENTS.length],
    shape: "Rectangle",
    w: rc.width ? (rc.width / 80) : 5,
    h: rc.height ? (rc.height / 80) : 4,
    tag: "Draft",
  };
}


const TAG_COLORS = {
  "In Progress": { bg: "rgba(139,92,246,0.12)", color: "#7c3aed", border: "rgba(139,92,246,0.20)" },
  "Draft":       { bg: "rgba(251,191,36,0.12)",  color: "#b45309", border: "rgba(251,191,36,0.25)" },
  "Complete":    { bg: "rgba(52,211,153,0.12)",  color: "#047857", border: "rgba(52,211,153,0.25)" },
};

/* ─── MINI ROOM PREVIEW SVG ─── */
function RoomPreview({ shape, w, h, accent, selected }) {
  const scale = 36;
  const pw = Math.min(w * scale, 120);
  const ph = Math.min(h * scale, 90);
  const cx = 80, cy = 55;
  const rx = cx - pw / 2, ry = cy - ph / 2;

  return (
    <svg width="160" height="110" viewBox="0 0 160 110" fill="none">
      {/* Floor shadow */}
      <rect x={rx + 3} y={ry + 3} width={pw} height={ph} rx={3}
        fill="rgba(100,60,200,0.07)" />
      {/* Floor */}
      <rect x={rx} y={ry} width={pw} height={ph} rx={2}
        fill={selected ? "rgba(139,92,246,0.08)" : "rgba(245,240,232,0.9)"}
        stroke={selected ? accent : "rgba(200,190,220,0.5)"} strokeWidth={selected ? 1.5 : 1} />
      {/* Wood lines */}
      {Array.from({ length: Math.floor(ph / 10) }).map((_, i) => (
        <line key={i} x1={rx + 2} y1={ry + i * 10 + 5} x2={rx + pw - 2} y2={ry + i * 10 + 5}
          stroke="rgba(0,0,0,0.04)" strokeWidth={0.8} />
      ))}
      {/* Walls */}
      <rect x={rx - 2} y={ry - 2} width={pw + 4} height={4} rx={1}
        fill={accent} opacity={0.5} />
      <rect x={rx - 2} y={ry - 2} width={4} height={ph + 4} rx={1}
        fill={accent} opacity={0.4} />
      {/* Dimension label */}
      <text x={cx} y={ry - 8} textAnchor="middle" fontSize="8" fill="#9b93b8"
        fontFamily="Afacad,sans-serif" fontWeight="600">{w}m × {h}m</text>
    </svg>
  );
}

/* ─── PROJECT CARD ─── */
function ProjectCard({ project, selected, onClick, view }) {
  const tagStyle = TAG_COLORS[project.tag];
  const isGrid = view === "grid";

  if (!isGrid) {
    return (
      <motion.div
        layout
        onClick={onClick}
        whileHover={{ x: 3 }}
        whileTap={{ scale: 0.99 }}
        style={{
          display: "flex", alignItems: "center", gap: 16,
          padding: "14px 18px",
          borderRadius: 16,
          background: selected
            ? "rgba(139,92,246,0.10)"
            : "rgba(255,255,255,0.32)",
          border: selected
            ? "1.5px solid rgba(139,92,246,0.35)"
            : "1.5px solid rgba(255,255,255,0.65)",
          cursor: "pointer",
          transition: "all 0.22s cubic-bezier(0.22,1,0.36,1)",
          boxShadow: selected
            ? "0 4px 24px rgba(139,92,246,0.12)"
            : "0 2px 12px rgba(120,80,220,0.05)",
        }}
      >
        {/* Mini thumb */}
        <div style={{
          width: 56, height: 44, borderRadius: 10, flexShrink: 0,
          background: project.thumb,
          border: "1px solid rgba(255,255,255,0.7)",
          display: "flex", alignItems: "center", justifyContent: "center",
          overflow: "hidden",
        }}>
          <svg width="50" height="38" viewBox="0 0 50 38" fill="none">
            <rect x="8" y="8" width="34" height="22" rx="2" fill="rgba(245,240,232,0.9)"
              stroke={project.accent} strokeWidth="1" />
            <rect x="6" y="6" width="34" height="3" rx="1" fill={project.accent} opacity="0.5" />
            <rect x="6" y="6" width="3" height="22" rx="1" fill={project.accent} opacity="0.4" />
          </svg>
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#2d1f4e", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {project.name}
          </div>
          <div style={{ fontSize: 11, color: "#9b93b8", marginTop: 2 }}>{project.date} · {project.items} items</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4, flexShrink: 0 }}>
          <span style={{
            fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 20,
            background: tagStyle.bg, color: tagStyle.color, border: `1px solid ${tagStyle.border}`,
          }}>{project.tag}</span>
          <span style={{ fontSize: 10, color: "#c4b5fd" }}>Edited {project.lastEdited}</span>
        </div>

        {selected && (
          <div style={{
            width: 6, height: 6, borderRadius: "50%", flexShrink: 0,
            background: "linear-gradient(135deg,#8b5cf6,#6d28d9)",
          }} />
        )}
      </motion.div>
    );
  }

  return (
    <motion.div
      layout
      onClick={onClick}
      whileHover={{ y: -4, boxShadow: "0 16px 40px rgba(120,80,220,0.15)" }}
      whileTap={{ scale: 0.98 }}
      style={{
        borderRadius: 20,
        background: selected ? "rgba(139,92,246,0.08)" : "rgba(255,255,255,0.32)",
        backdropFilter: "blur(24px)",
        border: selected
          ? "1.5px solid rgba(139,92,246,0.35)"
          : "1.5px solid rgba(255,255,255,0.70)",
        cursor: "pointer",
        overflow: "hidden",
        transition: "border 0.22s, background 0.22s",
        boxShadow: selected
          ? "0 8px 32px rgba(139,92,246,0.14)"
          : "0 4px 20px rgba(120,80,220,0.06)",
      }}
    >
      {/* Preview area */}
      <div style={{
        height: 130,
        background: `linear-gradient(135deg, ${project.thumb} 0%, rgba(255,255,255,0.6) 100%)`,
        display: "flex", alignItems: "center", justifyContent: "center",
        borderBottom: "1px solid rgba(255,255,255,0.5)",
        position: "relative",
      }}>
        <RoomPreview shape={project.shape} w={project.w} h={project.h}
          accent={project.accent} selected={selected} />

        {/* Tag */}
        <div style={{
          position: "absolute", top: 10, right: 10,
          fontSize: 9, fontWeight: 700, padding: "3px 8px", borderRadius: 20,
          background: tagStyle.bg, color: tagStyle.color,
          border: `1px solid ${tagStyle.border}`,
          backdropFilter: "blur(8px)",
        }}>{project.tag}</div>

        {selected && (
          <div style={{
            position: "absolute", top: 10, left: 10,
            width: 18, height: 18, borderRadius: "50%",
            background: "linear-gradient(135deg,#8b5cf6,#6d28d9)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 10, color: "#fff", fontWeight: 700,
          }}>✓</div>
        )}
      </div>

      {/* Info */}
      <div style={{ padding: "12px 14px" }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: "#2d1f4e", marginBottom: 2,
          whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {project.name}
        </div>
        <div style={{ fontSize: 11, color: "#9b93b8", marginBottom: 8 }}>
          {project.date} · {project.shape}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{
            fontSize: 11, fontWeight: 600, color: "#6b5b95",
            background: "rgba(139,92,246,0.08)", padding: "3px 8px",
            borderRadius: 20, border: "1px solid rgba(139,92,246,0.12)",
          }}>{project.items} items</span>
          <span style={{ fontSize: 10, color: "#c4b5fd" }}>Edited {project.lastEdited}</span>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── MAIN PAGE ─── */
export default function ProjectsPage() {
  const router = useRouter();
  const [projects, setProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [selected, setSelected] = useState(null);
  const [view, setView] = useState("grid");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [showNew, setShowNew] = useState(false);
  const [newName, setNewName] = useState("");
  const [creating, setCreating] = useState(false);
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  useEffect(() => {
    fetch('/api/templates')
      .then(r => r.json())
      .then(data => setTemplates(data.templates || []))
      .catch(console.error);
  }, []);
  const [hoverNav, setHoverNav] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetch('/api/projects', { credentials: 'include' })
      .then(r => r.json())
      .then(data => {
        const uiProjects = (data.projects || []).map(dbToUi);
        setProjects(uiProjects);
        if (uiProjects.length > 0) setSelected(uiProjects[0].id);
      })
      .catch(console.error)
      .finally(() => setLoadingProjects(false));
  }, []);

  const handleCreate = async () => {
    if (!newName.trim()) return;
    setCreating(true);
    try {
      let data;
      if (selectedTemplate) {
        const res = await fetch('/api/projects/from-template', {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ templateId: selectedTemplate.id, projectName: newName.trim() }),
        });
        data = await res.json();
      } else {
        const res = await fetch('/api/projects', {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: newName.trim() }),
        });
        data = await res.json();
      }
      if (data.project) {
        const newUi = dbToUi(data.project, projects.length);
        setProjects(prev => [newUi, ...prev]);
        setSelected(newUi.id);
        setShowNew(false);
        setNewName("");
        setSelectedTemplate(null);
        router.push(`/editor/2d?projectId=${data.project.id}`);
      }
    } catch(e) { console.error(e); }
    setCreating(false);
  };

  const handleDelete = async () => {
    if (!selected) return;
    setDeleting(true);
    try {
      await fetch(`/api/projects/${selected}`, {
        method: 'DELETE', credentials: 'include',
      });
      const remaining = projects.filter(p => p.id !== selected);
      setProjects(remaining);
      setSelected(remaining.length > 0 ? remaining[0].id : null);
      setShowDeleteConfirm(false);
    } catch(e) { console.error(e); }
    setDeleting(false);
  };

  const selectedProject = projects.find(p => p.id === selected);

  const filtered = projects.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "All" || p.tag === filter;
    return matchSearch && matchFilter;
  });

  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Afacad:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap');
    *,*::before,*::after { box-sizing:border-box; margin:0; padding:0; }
    @keyframes shimmer {
      0%   { background-position: -300% center }
      100% { background-position:  300% center }
    }
    @keyframes floatA {
      0%,100% { transform:translateY(0) }
      50%     { transform:translateY(-18px) }
    }
    @keyframes floatB {
      0%,100% { transform:translateY(0) rotate(0deg) }
      50%     { transform:translateY(-12px) rotate(3deg) }
    }
    @keyframes fadeIn {
      from { opacity:0; transform:translateY(8px) }
      to   { opacity:1; transform:translateY(0) }
    }
    ::-webkit-scrollbar { width:4px; height:4px; }
    ::-webkit-scrollbar-track { background:transparent; }
    ::-webkit-scrollbar-thumb { background:rgba(196,176,240,0.4); border-radius:4px; }
    input[type=number]::-webkit-inner-spin-button { -webkit-appearance:none; }
    input::placeholder { color:rgba(155,147,184,0.7); }
  `;

  const glass = {
    background: "rgba(255,255,255,0.22)",
    backdropFilter: "blur(32px) saturate(200%) brightness(1.06)",
    WebkitBackdropFilter: "blur(32px) saturate(200%) brightness(1.06)",
    border: "1.5px solid rgba(255,255,255,0.65)",
    boxShadow: "0 8px 32px rgba(120,80,220,0.08), inset 0 1.5px 0 rgba(255,255,255,0.9)",
  };

  return (
    <div style={{
      display: "flex", height: "100vh", overflow: "hidden",
      fontFamily: "'Afacad','Helvetica Neue',sans-serif",
      background: "linear-gradient(135deg,#f0eaff 0%,#eaf0ff 50%,#f5eaff 100%)",
      position: "relative",
    }}>
      <GlassSidebar active="Projects" />

      {/* ══ MAIN CONTENT ══ */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", zIndex: 10, position: "relative" }}>

        {/* ── TOP BAR ── */}
        <motion.header
          initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 120, damping: 18 }}
          style={{
            flexShrink: 0, height: 68,
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "0 28px",
            background: "rgba(255,255,255,0.18)",
            backdropFilter: "blur(24px) saturate(180%)",
            borderBottom: "1px solid rgba(255,255,255,0.45)",
            boxShadow: "0 2px 20px rgba(120,80,220,0.06)",
          }}
        >
          <div>
            <h1 style={{ fontSize: 26, fontWeight: 800, color: "#2d1f4e", letterSpacing: "-0.5px", lineHeight: 1 }}>
              Your Spaces
            </h1>
            <p style={{ fontSize: 12, color: "#9b93b8", marginTop: 2 }}>
              {projects.length} projects
            </p>
          </div>

          {/* Action buttons — appear when something is selected */}
          <AnimatePresence>
            {selectedProject && (
              <motion.div
                key="actions"
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                style={{ display: "flex", gap: 8, alignItems: "center" }}
              >
                {[
                  { label: "Open / Edit", icon: "✏", action: () => router.push(`/editor/2d?projectId=${selected}`) },
                  { label: "Duplicate",   icon: "⊕", action: null },
                  { label: "Export",      icon: "↑", action: null },
                ].map(btn => (
                  <motion.button key={btn.label}
                    whileHover={{ scale: 1.04, y: -1 }} whileTap={{ scale: 0.96 }}
                    onClick={btn.action || undefined}
                    style={{
                      display: "flex", alignItems: "center", gap: 6,
                      padding: "8px 16px", borderRadius: 50, border: "none",
                      fontFamily: "'Afacad',sans-serif", fontSize: 13, fontWeight: 600,
                      cursor: "pointer",
                      background: "rgba(255,255,255,0.55)",
                      backdropFilter: "blur(12px)",
                      color: "#6b5b95",
                      border: "1px solid rgba(255,255,255,0.70)",
                      boxShadow: "0 2px 12px rgba(120,80,220,0.06)",
                      transition: "all 0.2s",
                    }}>
                    <span style={{ fontSize: 14 }}>{btn.icon}</span>
                    {btn.label}
                  </motion.button>
                ))}

                <motion.button
                  whileHover={{ scale: 1.04, y: -1 }} whileTap={{ scale: 0.96 }}
                  onClick={() => setShowDeleteConfirm(true)}
                  style={{
                    display: "flex", alignItems: "center", gap: 6,
                    padding: "8px 18px", borderRadius: 50, border: "none",
                    fontFamily: "'Afacad',sans-serif", fontSize: 13, fontWeight: 700,
                    cursor: "pointer",
                    background: "linear-gradient(135deg,#ef4444,#dc2626)",
                    color: "#fff",
                    boxShadow: "0 4px 16px rgba(220,38,38,0.28)",
                  }}>
                  ✕ Delete
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.header>

        {/* ── BODY ── */}
        <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>

          {/* Projects list/grid area */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", padding: "20px 20px 20px 24px" }}>

            {/* Toolbar */}
            <motion.div
              initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.15 }}
              style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 18, flexShrink: 0 }}
            >
              {/* Search */}
              <div style={{
                flex: 1, position: "relative", maxWidth: 320,
              }}>
                <span style={{
                  position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)",
                  fontSize: 14, color: "#c4b5fd",
                }}>⌕</span>
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search spaces…"
                  style={{
                    width: "100%", padding: "9px 14px 9px 34px",
                    borderRadius: 50, border: "1.5px solid rgba(255,255,255,0.65)",
                    background: "rgba(255,255,255,0.45)", backdropFilter: "blur(16px)",
                    fontFamily: "'Afacad',sans-serif", fontSize: 13, color: "#2d1f4e",
                    outline: "none",
                    boxShadow: "0 2px 12px rgba(120,80,220,0.06), inset 0 1px 0 rgba(255,255,255,0.8)",
                  }}
                />
              </div>

              {/* Filter pills */}
              <div style={{ display: "flex", gap: 6 }}>
                {["All", "In Progress", "Draft", "Complete"].map(f => (
                  <motion.button key={f}
                    whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.95 }}
                    onClick={() => setFilter(f)}
                    style={{
                      padding: "7px 14px", borderRadius: 50, border: "none", cursor: "pointer",
                      fontFamily: "'Afacad',sans-serif", fontSize: 12, fontWeight: 600,
                      background: filter === f
                        ? "linear-gradient(135deg,#8b5cf6,#6d28d9)"
                        : "rgba(255,255,255,0.45)",
                      color: filter === f ? "#fff" : "#6b5b95",
                      backdropFilter: "blur(12px)",
                      border: filter === f ? "none" : "1px solid rgba(255,255,255,0.65)",
                      boxShadow: filter === f
                        ? "0 4px 16px rgba(109,40,217,0.28)"
                        : "0 2px 8px rgba(120,80,220,0.04)",
                      transition: "all 0.2s",
                    }}
                  >{f}</motion.button>
                ))}
              </div>

              {/* Spacer */}
              <div style={{ flex: 1 }} />

              {/* View toggle */}
              <div style={{
                display: "flex", gap: 2,
                background: "rgba(255,255,255,0.45)", backdropFilter: "blur(12px)",
                border: "1px solid rgba(255,255,255,0.65)", borderRadius: 50, padding: "3px",
                boxShadow: "0 2px 10px rgba(120,80,220,0.06)",
              }}>
                {[{ icon: "⊞", v: "grid" }, { icon: "≡", v: "list" }].map(t => (
                  <motion.button key={t.v}
                    whileTap={{ scale: 0.92 }}
                    onClick={() => setView(t.v)}
                    style={{
                      width: 30, height: 30, borderRadius: 50, border: "none",
                      fontFamily: "'Afacad',sans-serif", fontSize: 16,
                      cursor: "pointer",
                      background: view === t.v
                        ? "linear-gradient(135deg,#8b5cf6,#6d28d9)"
                        : "transparent",
                      color: view === t.v ? "#fff" : "#9b93b8",
                      transition: "all 0.2s",
                    }}
                  >{t.icon}</motion.button>
                ))}
              </div>

              {/* New project button */}
              <motion.button
                whileHover={{ scale: 1.04, y: -1 }} whileTap={{ scale: 0.96 }}
                onClick={() => setShowNew(true)}
                style={{
                  display: "flex", alignItems: "center", gap: 6,
                  padding: "9px 20px", borderRadius: 50, border: "none",
                  fontFamily: "'Afacad',sans-serif", fontSize: 13, fontWeight: 700,
                  cursor: "pointer",
                  background: "linear-gradient(135deg,#8b5cf6,#6d28d9)",
                  color: "#fff",
                  boxShadow: "0 6px 20px rgba(109,40,217,0.32)",
                }}
              >
                <span style={{ fontSize: 17, lineHeight: 1 }}>+</span> New Space
              </motion.button>
            </motion.div>

            {/* Grid / List */}
            <motion.div
              layout
              style={{
                flex: 1, overflowY: "auto",
                display: view === "grid" ? "grid" : "flex",
                gridTemplateColumns: view === "grid" ? "repeat(auto-fill, minmax(220px, 1fr))" : undefined,
                flexDirection: "column",
                gap: 12,
                paddingBottom: 16,
                paddingRight: 4,
              }}
            >
              <AnimatePresence mode="popLayout">
                {filtered.map((project, i) => (
                  <motion.div
                    key={project.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: i * 0.04, type: "spring", stiffness: 140, damping: 22 }}
                  >
                    <ProjectCard
                      project={project}
                      selected={selected === project.id}
                      onClick={() => setSelected(project.id)}
                      view={view}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>

              {filtered.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  style={{
                    gridColumn: "1/-1",
                    textAlign: "center", padding: "60px 20px",
                    color: "#c4b5fd", fontSize: 14,
                  }}
                >
                  <div style={{ fontSize: 40, marginBottom: 12 }}>◈</div>
                  No spaces match your search
                </motion.div>
              )}
            </motion.div>
          </div>

          {/* ── RIGHT DETAIL PANEL ── */}
          <AnimatePresence>
            {selectedProject && (
              <motion.aside
                key="detail"
                initial={{ x: 40, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 40, opacity: 0 }}
                transition={{ type: "spring", stiffness: 140, damping: 22 }}
                style={{
                  width: 300, flexShrink: 0, display: "flex", flexDirection: "column",
                  margin: "20px 24px 20px 0", borderRadius: 24, overflow: "hidden",
                  ...glass,
                }}
              >
                {/* Preview */}
                <div style={{
                  height: 180, flexShrink: 0,
                  background: `linear-gradient(135deg,${selectedProject.thumb} 0%,rgba(255,255,255,0.7) 100%)`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  borderBottom: "1px solid rgba(255,255,255,0.55)",
                  position: "relative",
                }}>
                  <svg width="220" height="160" viewBox="0 0 220 160" fill="none">
                    {/* Room floor */}
                    <rect x="35" y="25" width={selectedProject.w * 18} height={selectedProject.h * 18}
                      rx="3" fill="rgba(245,240,232,0.95)"
                      stroke={selectedProject.accent} strokeWidth="1.5" />
                    {/* Wood lines */}
                    {Array.from({ length: Math.floor(selectedProject.h * 18 / 10) }).map((_, i) => (
                      <line key={i}
                        x1="37" y1={25 + i * 10 + 5}
                        x2={35 + selectedProject.w * 18 - 2} y2={25 + i * 10 + 5}
                        stroke="rgba(0,0,0,0.05)" strokeWidth={1} />
                    ))}
                    {/* Walls */}
                    <rect x="33" y="23" width={selectedProject.w * 18 + 4} height={5}
                      rx="1.5" fill={selectedProject.accent} opacity="0.55" />
                    <rect x="33" y="23" width={5} height={selectedProject.h * 18 + 4}
                      rx="1.5" fill={selectedProject.accent} opacity="0.45" />
                    {/* Grid lines */}
                    {Array.from({ length: Math.floor(selectedProject.w) - 1 }).map((_, i) => (
                      <line key={`gx${i}`}
                        x1={35 + (i + 1) * 18} y1="25"
                        x2={35 + (i + 1) * 18} y2={25 + selectedProject.h * 18}
                        stroke="rgba(139,92,246,0.08)" strokeWidth={0.7} />
                    ))}
                    {Array.from({ length: Math.floor(selectedProject.h) - 1 }).map((_, i) => (
                      <line key={`gy${i}`}
                        x1="35" y1={25 + (i + 1) * 18}
                        x2={35 + selectedProject.w * 18} y2={25 + (i + 1) * 18}
                        stroke="rgba(139,92,246,0.08)" strokeWidth={0.7} />
                    ))}
                    {/* Dimension labels */}
                    <text x={35 + selectedProject.w * 9} y="18" textAnchor="middle"
                      fontSize="9" fill="#8b5cf6" fontFamily="Afacad,sans-serif" fontWeight="bold">
                      {selectedProject.w}m
                    </text>
                    <text x="20" y={25 + selectedProject.h * 9} textAnchor="middle"
                      fontSize="9" fill="#8b5cf6" fontFamily="Afacad,sans-serif" fontWeight="bold">
                      {selectedProject.h}m
                    </text>
                  </svg>

                  {/* Tag badge */}
                  <div style={{
                    position: "absolute", top: 12, right: 12,
                    fontSize: 10, fontWeight: 700, padding: "4px 10px", borderRadius: 20,
                    background: TAG_COLORS[selectedProject.tag].bg,
                    color: TAG_COLORS[selectedProject.tag].color,
                    border: `1px solid ${TAG_COLORS[selectedProject.tag].border}`,
                    backdropFilter: "blur(8px)",
                  }}>{selectedProject.tag}</div>
                </div>

                {/* Details */}
                <div style={{ padding: "18px 20px", flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 16 }}>
                  <div>
                    <h2 style={{ fontSize: 18, fontWeight: 800, color: "#2d1f4e", marginBottom: 4 }}>
                      {selectedProject.name}
                    </h2>
                    <p style={{ fontSize: 12, color: "#9b93b8" }}>Created {selectedProject.date}</p>
                  </div>

                  {/* Stats row */}
                  <div style={{ display: "flex", gap: 8 }}>
                    {[
                      { label: "Items", value: selectedProject.items },
                      { label: "Shape", value: selectedProject.shape },
                      { label: "Size", value: `${selectedProject.w}×${selectedProject.h}m` },
                    ].map(s => (
                      <div key={s.label} style={{
                        flex: 1, padding: "10px 0", borderRadius: 14, textAlign: "center",
                        background: "rgba(255,255,255,0.45)", border: "1px solid rgba(255,255,255,0.70)",
                        boxShadow: "0 2px 8px rgba(120,80,220,0.04)",
                      }}>
                        <div style={{ fontSize: 14, fontWeight: 800, color: "#2d1f4e" }}>{s.value}</div>
                        <div style={{ fontSize: 9, fontWeight: 600, color: "#9b93b8", textTransform: "uppercase", letterSpacing: "0.5px" }}>{s.label}</div>
                      </div>
                    ))}
                  </div>

                  {/* Last edited */}
                  <div style={{
                    display: "flex", alignItems: "center", gap: 8,
                    padding: "10px 14px", borderRadius: 12,
                    background: "rgba(139,92,246,0.06)", border: "1px solid rgba(139,92,246,0.12)",
                  }}>
                    <span style={{ fontSize: 16 }}>🕐</span>
                    <span style={{ fontSize: 12, color: "#6b5b95", fontWeight: 500 }}>
                      Last edited <strong>{selectedProject.lastEdited}</strong>
                    </span>
                  </div>

                  {/* Quick actions */}
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    <motion.button
                      whileHover={{ scale: 1.02, y: -1 }} whileTap={{ scale: 0.98 }}
                      onClick={() => router.push(`/editor/2d?projectId=${selected}`)}
                      style={{
                        width: "100%", padding: "13px", borderRadius: 14, border: "none",
                        fontFamily: "'Afacad',sans-serif", fontSize: 14, fontWeight: 700,
                        cursor: "pointer",
                        background: "linear-gradient(135deg,#8b5cf6,#6d28d9)",
                        color: "#fff",
                        boxShadow: "0 6px 20px rgba(109,40,217,0.32)",
                        display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                      }}
                    >
                      <span>✏</span> Open in Editor
                    </motion.button>

                    <div style={{ display: "flex", gap: 8 }}>
                      {[
                        { label: "Rename", icon: "⟳" },
                        { label: "Share", icon: "↗" },
                        { label: "Export", icon: "↑" },
                      ].map(btn => (
                        <motion.button key={btn.label}
                          whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.95 }}
                          style={{
                            flex: 1, padding: "9px 4px", borderRadius: 12, border: "none",
                            fontFamily: "'Afacad',sans-serif", fontSize: 12, fontWeight: 600,
                            cursor: "pointer",
                            background: "rgba(255,255,255,0.55)",
                            color: "#6b5b95",
                            border: "1px solid rgba(255,255,255,0.70)",
                            boxShadow: "0 2px 8px rgba(120,80,220,0.05)",
                            display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
                          }}
                        >
                          <span style={{ fontSize: 15 }}>{btn.icon}</span>
                          {btn.label}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.aside>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ══ NEW SPACE MODAL ══ */}
      <AnimatePresence>
        {showNew && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{
              position: "fixed", inset: 0, zIndex: 100,
              background: "rgba(30,15,60,0.35)", backdropFilter: "blur(12px)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
            onClick={e => { if (e.target === e.currentTarget) setShowNew(false); }}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              transition={{ type: "spring", stiffness: 160, damping: 22 }}
              style={{
                width: 520, borderRadius: 28,
                background: "rgba(255,255,255,0.75)",
                backdropFilter: "blur(40px) saturate(200%)",
                border: "1.5px solid rgba(255,255,255,0.80)",
                boxShadow: "0 24px 80px rgba(80,40,160,0.18)",
                overflow: "hidden",
                maxHeight: "90vh", display: "flex", flexDirection: "column",
              }}
            >
              {/* Modal header */}
              <div style={{
                padding: "22px 26px 18px",
                borderBottom: "1px solid rgba(200,190,230,0.30)",
                background: "linear-gradient(135deg,rgba(245,235,255,0.6) 0%,rgba(235,245,255,0.6) 100%)",
              }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div>
                    <h3 style={{ fontSize: 20, fontWeight: 800, color: "#2d1f4e" }}>Create New Space</h3>
                    <p style={{ fontSize: 12, color: "#9b93b8", marginTop: 2 }}>Set up your room to get started</p>
                  </div>
                  <motion.button whileTap={{ scale: 0.9 }} onClick={() => setShowNew(false)}
                    style={{
                      width: 32, height: 32, borderRadius: 50, border: "none",
                      background: "rgba(255,255,255,0.55)", cursor: "pointer",
                      fontSize: 16, color: "#9b93b8",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>✕</motion.button>
                </div>
              </div>

              <div style={{ padding: "22px 26px", overflowY: "auto", flex: 1 }}>
                {/* Room name */}
                <div style={{ marginBottom: 18 }}>
                  <label style={{ fontSize: 11, fontWeight: 700, color: "#9b93b8", textTransform: "uppercase", letterSpacing: "0.5px", display: "block", marginBottom: 8 }}>
                    Space Name
                  </label>
                  <input
                    autoFocus
                    placeholder="e.g. Living Room Refresh"
                    value={newName}
                    onChange={e => setNewName(e.target.value)}
                    style={{
                      width: "100%", padding: "11px 16px", borderRadius: 14,
                      border: "1.5px solid rgba(139,92,246,0.25)",
                      background: "rgba(255,255,255,0.70)", backdropFilter: "blur(12px)",
                      fontFamily: "'Afacad',sans-serif", fontSize: 15, color: "#2d1f4e",
                      outline: "none",
                      boxShadow: "0 2px 12px rgba(139,92,246,0.06), inset 0 1px 0 rgba(255,255,255,0.8)",
                    }}
                  />
                </div>

                {/* Shape selector */}
                <div style={{ marginBottom: 20 }}>
                  <label style={{ fontSize: 11, fontWeight: 700, color: "#9b93b8", textTransform: "uppercase", letterSpacing: "0.5px", display: "block", marginBottom: 8 }}>
                    Room Shape
                  </label>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8 }}>
                    {[
                      { label: "Rectangle", svg: <rect x="4" y="8" width="24" height="16" rx="1" fill="none" stroke="currentColor" strokeWidth="1.5"/> },
                      { label: "Square", svg: <rect x="6" y="6" width="20" height="20" rx="1" fill="none" stroke="currentColor" strokeWidth="1.5"/> },
                      { label: "L-Shape", svg: <path d="M4 4h10v10h10v10H4V4z" fill="none" stroke="currentColor" strokeWidth="1.5"/> },
                    ].map(s => (
                      <motion.button key={s.label}
                        whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                        style={{
                          padding: "14px 8px", borderRadius: 14, border: "1.5px solid rgba(139,92,246,0.20)",
                          background: "rgba(255,255,255,0.55)", cursor: "pointer",
                          fontFamily: "'Afacad',sans-serif", fontSize: 12, fontWeight: 600, color: "#6b5b95",
                          display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
                          transition: "all 0.2s",
                        }}
                      >
                        <svg width="32" height="32" viewBox="0 0 32 32" color="#8b5cf6">{s.svg}</svg>
                        {s.label}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Dimensions */}
                <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
                  {["Width", "Height"].map(dim => (
                    <div key={dim} style={{ flex: 1 }}>
                      <label style={{ fontSize: 11, fontWeight: 700, color: "#9b93b8", textTransform: "uppercase", letterSpacing: "0.5px", display: "block", marginBottom: 8 }}>
                        {dim}
                      </label>
                      <div style={{ position: "relative" }}>
                        <input type="number" defaultValue={4} min={1} max={20} step={0.5}
                          style={{
                            width: "100%", padding: "10px 32px 10px 14px", borderRadius: 14,
                            border: "1.5px solid rgba(139,92,246,0.20)",
                            background: "rgba(255,255,255,0.60)", backdropFilter: "blur(12px)",
                            fontFamily: "'Afacad',sans-serif", fontSize: 15, fontWeight: 700, color: "#2d1f4e",
                            outline: "none",
                          }} />
                        <span style={{
                          position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
                          fontSize: 12, color: "#9b93b8", fontWeight: 600,
                        }}>m</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Template picker */}
                {templates.length > 0 && (
                  <div style={{ marginBottom: 20 }}>
                    <label style={{ fontSize: 11, fontWeight: 700, color: "#9b93b8", textTransform: "uppercase", letterSpacing: "0.5px", display: "block", marginBottom: 8 }}>
                      Start from Template <span style={{ fontWeight: 400, textTransform: "none", fontSize: 10 }}>(optional)</span>
                    </label>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8, maxHeight: 180, overflowY: "auto" }}>
                      {templates.map(t => (
                        <motion.button key={t.id}
                          whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                          onClick={() => setSelectedTemplate(selectedTemplate?.id === t.id ? null : t)}
                          style={{
                            padding: "10px 8px", borderRadius: 12,
                            border: selectedTemplate?.id === t.id ? "2px solid #8b5cf6" : "1.5px solid rgba(139,92,246,0.20)",
                            background: selectedTemplate?.id === t.id ? "rgba(139,92,246,0.10)" : "rgba(255,255,255,0.55)",
                            cursor: "pointer", fontFamily: "'Afacad',sans-serif",
                            fontSize: 11, fontWeight: 700, color: selectedTemplate?.id === t.id ? "#6d28d9" : "#6b5b95",
                            textAlign: "center", transition: "all 0.2s",
                          }}
                        >
                          <div style={{ fontSize: 18, marginBottom: 4 }}>
                            {t.category === "Living Room" ? "🛋️" : t.category === "Bedroom" ? "🛏️" : t.category === "Office" ? "💼" : t.category === "Dining Room" ? "🍽️" : t.category === "Studio" ? "🏠" : "🧸"}
                          </div>
                          {t.name}
                          <div style={{ fontSize: 9, color: "#9b93b8", marginTop: 2 }}>{t.category}</div>
                        </motion.button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Create button */}
                <motion.button
                  whileHover={{ scale: 1.02, y: -1 }} whileTap={{ scale: 0.98 }}
                  onClick={handleCreate}
                  disabled={creating || !newName.trim()}
                  style={{
                    width: "100%", padding: "14px", borderRadius: 16, border: "none",
                    fontFamily: "'Afacad',sans-serif", fontSize: 15, fontWeight: 800,
                    cursor: creating ? "not-allowed" : "pointer",
                    background: "linear-gradient(135deg,#8b5cf6,#6d28d9)",
                    color: "#fff",
                    boxShadow: "0 8px 24px rgba(109,40,217,0.35)",
                    letterSpacing: "0.2px",
                    opacity: creating || !newName.trim() ? 0.6 : 1,
                  }}
                >
                  {creating ? "Creating…" : "✦ Create Space"}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══ DELETE CONFIRM MODAL ══ */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{
              position: "fixed", inset: 0, zIndex: 100,
              background: "rgba(30,15,60,0.40)", backdropFilter: "blur(12px)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            <motion.div
              initial={{ scale: 0.9, y: 16, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 180, damping: 24 }}
              style={{
                width: 360, borderRadius: 24, padding: "28px",
                background: "rgba(255,255,255,0.80)",
                backdropFilter: "blur(40px)",
                border: "1.5px solid rgba(255,255,255,0.80)",
                boxShadow: "0 20px 60px rgba(80,40,160,0.16)",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: 40, marginBottom: 12 }}>🗑</div>
              <h3 style={{ fontSize: 18, fontWeight: 800, color: "#2d1f4e", marginBottom: 6 }}>
                Delete "{selectedProject?.name}"?
              </h3>
              <p style={{ fontSize: 13, color: "#9b93b8", marginBottom: 24, lineHeight: 1.5 }}>
                This action can't be undone. Your room design and all furniture will be permanently removed.
              </p>
              <div style={{ display: "flex", gap: 10 }}>
                <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  onClick={() => setShowDeleteConfirm(false)}
                  style={{
                    flex: 1, padding: "12px", borderRadius: 14, border: "1.5px solid rgba(200,190,230,0.4)",
                    fontFamily: "'Afacad',sans-serif", fontSize: 14, fontWeight: 700, color: "#6b5b95",
                    background: "rgba(255,255,255,0.60)", cursor: "pointer",
                  }}>Cancel</motion.button>
                <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  onClick={() => setShowDeleteConfirm(false)}
                  style={{
                    flex: 1, padding: "12px", borderRadius: 14, border: "none",
                    fontFamily: "'Afacad',sans-serif", fontSize: 14, fontWeight: 700, color: "#fff",
                    background: "linear-gradient(135deg,#ef4444,#dc2626)",
                    boxShadow: "0 6px 18px rgba(220,38,38,0.30)", cursor: "pointer",
                  }}>Delete Forever</motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

