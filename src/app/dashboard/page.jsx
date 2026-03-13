"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import GlassSidebar from "@/components/GlassSidebar";
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion";
import { useAuth } from '@/context/AuthContext';

function GlassFilter() {
  return (
    <svg style={{ position: "absolute", width: 0, height: 0, overflow: "hidden" }} aria-hidden>
      <defs>
        <filter id="gf-idle" x="-20%" y="-20%" width="140%" height="140%"><feTurbulence type="fractalNoise" baseFrequency="0.9 0.9" numOctaves="4" seed="2" result="noise" /><feDisplacementMap in="SourceGraphic" in2="noise" scale="5" xChannelSelector="R" yChannelSelector="G" /></filter>
        <filter id="gf-hover" x="-20%" y="-20%" width="140%" height="140%"><feTurbulence type="fractalNoise" baseFrequency="0.75 0.75" numOctaves="4" seed="5" result="noise" /><feDisplacementMap in="SourceGraphic" in2="noise" scale="14" xChannelSelector="R" yChannelSelector="G" /></filter>
        <filter id="gf-press" x="-20%" y="-20%" width="140%" height="140%"><feTurbulence type="fractalNoise" baseFrequency="0.6 0.6" numOctaves="3" seed="8" result="noise" /><feDisplacementMap in="SourceGraphic" in2="noise" scale="26" xChannelSelector="R" yChannelSelector="G" /></filter>
        <filter id="gooey"><feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" /><feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -8" result="goo" /><feBlend in="SourceGraphic" in2="goo" /></filter>
      </defs>
    </svg>
  );
}

function useLiquidGlass(strength = 14) {
  const ref = useRef(null);
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const rotateX = useSpring(rawY, { stiffness: 80, damping: 12, mass: 0.8 });
  const rotateY = useSpring(rawX, { stiffness: 80, damping: 12, mass: 0.8 });
  const springScale = useSpring(1, { stiffness: 200, damping: 14, mass: 0.6 });
  const [hov, setHov] = useState(false);
  const [press, setPress] = useState(false);
  const onMove = useCallback((e) => {
    const el = ref.current; if (!el) return;
    const r = el.getBoundingClientRect();
    rawX.set(((e.clientX - r.left) / r.width - 0.5) * -strength);
    rawY.set(((e.clientY - r.top) / r.height - 0.5) * strength);
  }, [rawX, rawY, strength]);
  const onEnter = useCallback(() => { setHov(true); springScale.set(1.025); }, [springScale]);
  const onLeave = useCallback(() => { rawX.set(0); rawY.set(0); setHov(false); setPress(false); springScale.set(1); }, [rawX, rawY, springScale]);
  return { ref, rotateX, rotateY, hov, press, filterState: press ? "gf-press" : hov ? "gf-hover" : "gf-idle", springScale, events: { onMouseMove: onMove, onMouseEnter: onEnter, onMouseLeave: onLeave, onMouseDown: () => { setPress(true); springScale.set(0.97); }, onMouseUp: () => { setPress(false); springScale.set(1.025); } } };
}

function GlassEdge({ hov, radius, filterState, glowColor }) {
  return (
    <>
      <motion.div animate={{ opacity: hov ? 1 : 0.4, boxShadow: hov ? `0 0 20px 3px rgba(255,255,255,0.45), 0 0 50px 6px ${glowColor||"rgba(167,139,250,0.12)"}, inset 0 1px 18px rgba(255,255,255,0.28)` : `0 0 10px 1px rgba(255,255,255,0.20), inset 0 1px 10px rgba(255,255,255,0.15)` }} transition={{ duration: 0.45 }} style={{ position: "absolute", inset: 0, zIndex: 5, borderRadius: radius, pointerEvents: "none" }} />
      <motion.div animate={{ opacity: hov ? 1 : 0.35 }} transition={{ duration: 0.4 }} style={{ position: "absolute", inset: 0, zIndex: 6, borderRadius: radius, pointerEvents: "none", border: "1.5px solid transparent", backgroundImage: `linear-gradient(135deg, rgba(255,255,255,0.80) 0%, rgba(180,210,255,0.45) 15%, rgba(255,255,255,0.08) 35%, rgba(255,200,240,0.15) 55%, rgba(255,255,255,0.04) 70%, rgba(200,230,255,0.50) 88%, rgba(255,255,255,0.70) 100%)`, backgroundOrigin: "border-box", WebkitMask: "linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)", WebkitMaskComposite: "destination-out", maskComposite: "exclude", filter: `url(#${filterState})` }} />
    </>
  );
}

const PROJECT_COLORS = [
  { preview: "linear-gradient(145deg,#ede0ff,#d4c5f9,#c4b5fd)", glow: "rgba(167,139,250,0.45)", blob1: "#c4b5fd", blob2: "#99f6e4" },
  { preview: "linear-gradient(145deg,#fff3e0,#fed7aa,#fca5a5)", glow: "rgba(251,146,60,0.4)", blob1: "#fcd34d", blob2: "#fca5a5" },
  { preview: "linear-gradient(145deg,#e0f2fe,#bae6fd,#c4b5fd)", glow: "rgba(99,102,241,0.4)", blob1: "#93c5fd", blob2: "#d8b4fe" },
  { preview: "linear-gradient(145deg,#d1fae5,#6ee7b7,#a7f3d0)", glow: "rgba(52,211,153,0.4)", blob1: "#6ee7b7", blob2: "#60a5fa" },
];

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  const hrs = Math.floor(mins / 60);
  const days = Math.floor(hrs / 24);
  if (days > 0) return `${days} day${days > 1 ? "s" : ""} ago`;
  if (hrs > 0) return `${hrs} hour${hrs > 1 ? "s" : ""} ago`;
  if (mins > 0) return `${mins} min ago`;
  return "Just now";
}

function ProjectCard({ project, index, delay, onClick }) {
  const { ref, rotateX, rotateY, hov, filterState, events, springScale } = useLiquidGlass(12);
  const colors = PROJECT_COLORS[index % PROJECT_COLORS.length];
  return (
    <motion.div ref={ref} {...events} onClick={onClick} initial={{ y: 30, opacity: 0, scale: 0.93 }} animate={{ y: 0, opacity: 1, scale: 1 }} transition={{ delay: delay / 1000, duration: 0.55, type: "spring", stiffness: 120, damping: 16 }}
      style={{ flex: 1, minWidth: 0, borderRadius: 26, overflow: "hidden", cursor: "pointer", position: "relative", rotateX, rotateY, scale: springScale, transformStyle: "preserve-3d", transformPerspective: 900, background: "rgba(255,255,255,0.22)", backdropFilter: "blur(32px) saturate(200%)", boxShadow: hov ? `0 28px 70px ${colors.glow}` : `0 10px 36px rgba(120,80,220,0.06)`, transition: "box-shadow 0.35s" }}>
      <GlassEdge hov={hov} radius={26} filterState={filterState} glowColor={colors.glow} />
      <div style={{ background: colors.preview, height: 148, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, filter: "url(#gooey)" }}>
          <motion.div animate={{ x: hov ? [0,14,0] : 0, y: hov ? [0,-12,0] : 0 }} transition={{ duration: 2.2, repeat: hov ? Infinity : 0, ease: "easeInOut" }} style={{ position: "absolute", top: 20, left: 18, width: 90, height: 62, background: colors.blob1, borderRadius: 14, opacity: 0.82 }} />
          <motion.div animate={{ x: hov ? [0,-10,0] : 0, y: hov ? [0,14,0] : 0 }} transition={{ duration: 2.6, repeat: hov ? Infinity : 0, ease: "easeInOut", delay: 0.35 }} style={{ position: "absolute", top: 44, left: 68, width: 62, height: 52, background: colors.blob2, borderRadius: "50%", opacity: 0.62 }} />
        </div>
        <div style={{ position: "absolute", bottom: 12, right: 12, background: "rgba(255,255,255,0.55)", backdropFilter: "blur(24px)", padding: "4px 13px", borderRadius: 50, fontSize: 10.5, fontWeight: 700, color: "#4c1d95", textTransform: "uppercase", letterSpacing: "0.6px" }}>{project.name}</div>
      </div>
      <div style={{ padding: "15px 18px 18px", position: "relative", zIndex: 7 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#1e1040", marginBottom: 4 }}>{project.name}</div>
            <div style={{ fontSize: 11, color: "#a99cc0", fontWeight: 500 }}>{timeAgo(project.updated_at)}</div>
          </div>
          <motion.div animate={{ opacity: hov ? 1 : 0, x: hov ? 0 : -6 }} style={{ width: 28, height: 28, borderRadius: "50%", background: "rgba(139,92,246,0.12)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, color: "#8b5cf6" }}>→</motion.div>
        </div>
      </div>
    </motion.div>
  );
}

const TEMPLATE_BG = ["linear-gradient(145deg,#ede9fe,#c4b5fd)","linear-gradient(145deg,#d1fae5,#6ee7b7)","linear-gradient(145deg,#fef9c3,#fcd34d)","linear-gradient(145deg,#e0f2fe,#93c5fd)","linear-gradient(145deg,#fce7f3,#f9a8d4)","linear-gradient(145deg,#f3e8ff,#d8b4fe)"];
const TEMPLATE_GLOW = ["rgba(167,139,250,0.5)","rgba(52,211,153,0.45)","rgba(251,191,36,0.45)","rgba(99,179,237,0.45)","rgba(236,72,153,0.4)","rgba(167,139,250,0.4)"];

function TemplateCard({ template, index, delay, onUse }) {
  const { ref, rotateX, rotateY, hov, filterState, events, springScale } = useLiquidGlass(10);
  const bg = TEMPLATE_BG[index % TEMPLATE_BG.length];
  const glow = TEMPLATE_GLOW[index % TEMPLATE_GLOW.length];
  return (
    <motion.div ref={ref} {...events} onClick={() => onUse(template)} initial={{ y: 24, opacity: 0, scale: 0.94 }} animate={{ y: 0, opacity: 1, scale: 1 }} transition={{ delay: delay / 1000, duration: 0.5, type: "spring", stiffness: 120, damping: 16 }}
      style={{ flex: 1, minWidth: 0, borderRadius: 24, overflow: "hidden", cursor: "pointer", position: "relative", rotateX, rotateY, scale: springScale, transformStyle: "preserve-3d", background: "rgba(255,255,255,0.22)", backdropFilter: "blur(32px) saturate(200%)", boxShadow: hov ? `0 22px 60px ${glow}` : `0 8px 28px rgba(120,80,220,0.05)`, transition: "box-shadow 0.3s" }}>
      <GlassEdge hov={hov} radius={24} filterState={filterState} glowColor={glow} />
      <div style={{ background: bg, height: 104, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
        <svg viewBox="0 0 64 64" width="48" height="48" fill="none"><rect x="8" y="36" width="48" height="6" rx="2" fill="rgba(255,255,255,0.5)" /><rect x="8" y="22" width="48" height="16" rx="5" fill="rgba(255,255,255,0.75)" /><rect x="6" y="26" width="7" height="12" rx="3" fill="rgba(255,255,255,0.65)" /><rect x="51" y="26" width="7" height="12" rx="3" fill="rgba(255,255,255,0.65)" /></svg>
        <motion.div animate={{ opacity: hov ? 1 : 0, y: hov ? 0 : 6 }} style={{ position: "absolute", bottom: 10, left: "50%", transform: "translateX(-50%)", background: "rgba(255,255,255,0.65)", backdropFilter: "blur(16px)", padding: "4px 14px", borderRadius: 50, fontSize: 10, fontWeight: 700, color: "#4c1d95", whiteSpace: "nowrap" }}>Use template →</motion.div>
      </div>
      <div style={{ padding: "13px 16px 15px", position: "relative", zIndex: 7 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#1e1040" }}>{template.name}</div>
        {template.category && <div style={{ fontSize: 11, color: "#a99cc0", marginTop: 3 }}>{template.category}</div>}
      </div>
    </motion.div>
  );
}

const TIPS = [
  { icon: "💡", title: "Lighting Basics", desc: "Layer ambient, task and accent lighting for depth.", glow: "rgba(167,139,250,0.35)", col: "#ede7f6" },
  { icon: "🎨", title: "Color Theory", desc: "Build cohesive palettes from a single anchor hue.", glow: "rgba(52,211,153,0.35)", col: "#d1fae5" },
  { icon: "📐", title: "Space Planning", desc: "Leave at least 90cm between furniture for good flow.", glow: "rgba(251,191,36,0.35)", col: "#fef9c3" },
];

function TipCard({ tip, delay }) {
  const { ref, rotateX, rotateY, hov, filterState, events, springScale } = useLiquidGlass(8);
  return (
    <motion.div ref={ref} {...events} initial={{ y: 18, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: delay / 1000, duration: 0.5, type: "spring", stiffness: 120, damping: 16 }}
      style={{ flex: 1, minWidth: 0, borderRadius: 22, padding: "18px", display: "flex", alignItems: "flex-start", gap: 14, position: "relative", rotateX, rotateY, scale: springScale, transformStyle: "preserve-3d", background: "rgba(255,255,255,0.22)", backdropFilter: "blur(32px) saturate(200%)", boxShadow: hov ? `0 18px 50px ${tip.glow}` : `0 6px 22px rgba(120,80,220,0.04)` }}>
      <GlassEdge hov={hov} radius={22} filterState={filterState} glowColor={tip.glow} />
      <div style={{ width: 44, height: 44, borderRadius: 14, flexShrink: 0, background: `linear-gradient(135deg,${tip.col},rgba(255,255,255,0.5))`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, position: "relative", zIndex: 7 }}>{tip.icon}</div>
      <div style={{ position: "relative", zIndex: 7, paddingTop: 2 }}>
        <div style={{ fontSize: 13.5, fontWeight: 700, color: "#1e1040", marginBottom: 5 }}>{tip.title}</div>
        <div style={{ fontSize: 11.5, color: "#a99cc0", lineHeight: 1.6 }}>{tip.desc}</div>
      </div>
    </motion.div>
  );
}

function GlassButton({ children, variant = "secondary", onClick }) {
  const [hov, setHov] = useState(false);
  const isPrimary = variant === "primary";
  return (
    <motion.button onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} onClick={onClick} whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.94 }}
      style={{ padding: isPrimary ? "11px 28px" : "11px 22px", borderRadius: 50, border: "none", fontFamily: "'Afacad',sans-serif", fontSize: 13.5, fontWeight: 700, cursor: "pointer", color: isPrimary ? "#fff" : "#4c1d95", background: isPrimary ? (hov ? "linear-gradient(135deg,#9d6fff,#7c3aed)" : "linear-gradient(135deg,#8b5cf6,#6d28d9)") : (hov ? "rgba(255,255,255,0.55)" : "rgba(255,255,255,0.35)"), backdropFilter: "blur(32px)", boxShadow: isPrimary ? "0 8px 28px rgba(109,40,217,0.38)" : "0 4px 16px rgba(120,80,220,0.07), 0 0 0 1px rgba(255,255,255,0.35)", display: "flex", alignItems: "center", gap: 8 }}
    >{children}</motion.button>
  );
}

function SectionHeader({ title, action }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 6, height: 6, borderRadius: "50%", background: "linear-gradient(135deg,#8b5cf6,#60a5fa)", boxShadow: "0 0 8px rgba(139,92,246,0.5)" }} />
        <h2 style={{ fontSize: 15, fontWeight: 700, color: "#1e1040" }}>{title}</h2>
      </div>
      {action}
    </div>
  );
}

function GlassLink({ children, onClick }) {
  return (
    <motion.button onClick={onClick} whileHover={{ x: 2, scale: 1.03 }} whileTap={{ scale: 0.96 }}
      style={{ background: "rgba(255,255,255,0.16)", backdropFilter: "blur(20px)", border: "none", cursor: "pointer", fontSize: 12.5, fontWeight: 600, color: "#8b5cf6", fontFamily: "'Afacad',sans-serif", padding: "6px 15px", borderRadius: 50 }}
    >{children}</motion.button>
  );
}

const ROOM_SHAPES = [
  { id: "Rectangle", svg: <svg viewBox="0 0 48 48" width="32" height="32" fill="none"><rect x="6" y="12" width="36" height="24" rx="2.5" stroke="currentColor" strokeWidth="2.2" /></svg> },
  { id: "Square", svg: <svg viewBox="0 0 48 48" width="32" height="32" fill="none"><rect x="9" y="9" width="30" height="30" rx="2.5" stroke="currentColor" strokeWidth="2.2" /></svg> },
  { id: "L-Shape", svg: <svg viewBox="0 0 48 48" width="32" height="32" fill="none"><path d="M7 7 H26 V22 H41 V41 H7 Z" stroke="currentColor" strokeWidth="2.2" fill="none" /></svg> },
  { id: "Open Plan", svg: <svg viewBox="0 0 48 48" width="32" height="32" fill="none"><rect x="5" y="5" width="38" height="38" rx="2.5" stroke="currentColor" strokeWidth="2.2" /><line x1="5" y1="22" x2="24" y2="22" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /><line x1="24" y1="22" x2="24" y2="43" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg> },
];

function NewSpaceModal({ onClose, templates }) {
  const router = useRouter();
  const [spaceName, setSpaceName] = useState("");
  const [shape, setShape] = useState("Rectangle");
  const [width, setWidth] = useState("4");
  const [height, setHeight] = useState("4");
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [creating, setCreating] = useState(false);
  const [focused, setFocused] = useState(null);

  const labelStyle = { fontSize: 10.5, fontWeight: 700, color: "#9b93b8", marginBottom: 8, letterSpacing: "0.8px", textTransform: "uppercase" };

  const handleCreate = async () => {
    if (!spaceName.trim()) return;
    setCreating(true);
    try {
      if (selectedTemplate) {
        const res = await fetch('/api/projects/from-template', { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ templateId: selectedTemplate.id, projectName: spaceName.trim() }) });
        const data = await res.json();
        if (data.project?.id) { onClose(); router.push(`/editor/2d?projectId=${data.project.id}`); return; }
      }
      const res = await fetch('/api/projects', { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: spaceName.trim() }) });
      const data = await res.json();
      if (data.project?.id) { onClose(); router.push(`/editor/2d?projectId=${data.project.id}`); }
    } catch (e) { console.error(e); }
    setCreating(false);
  };

  const Stepper = ({ value, onChange, field }) => (
    <div style={{ display: "flex", alignItems: "center", background: "rgba(255,255,255,0.35)", border: focused === field ? "1.5px solid rgba(139,92,246,0.40)" : "1.5px solid rgba(255,255,255,0.65)", borderRadius: 18, overflow: "hidden" }}>
      <button onClick={() => onChange(v => String(Math.max(1, parseFloat(v) - 0.5)))} style={{ width: 36, height: 42, border: "none", background: "transparent", cursor: "pointer", fontSize: 18, color: "#8b5cf6", borderRight: "1px solid rgba(255,255,255,0.5)" }}>−</button>
      <input value={value} onChange={e => onChange(() => e.target.value)} onFocus={() => setFocused(field)} onBlur={() => setFocused(null)} style={{ flex: 1, textAlign: "center", border: "none", outline: "none", background: "transparent", fontFamily: "'Afacad',sans-serif", fontSize: 14, fontWeight: 600, color: "#1e1040" }} />
      <span style={{ fontSize: 10, color: "#9b93b8", paddingRight: 4 }}>m</span>
      <button onClick={() => onChange(v => String(Math.min(50, parseFloat(v) + 0.5)))} style={{ width: 36, height: 42, border: "none", background: "transparent", cursor: "pointer", fontSize: 18, color: "#8b5cf6", borderLeft: "1px solid rgba(255,255,255,0.5)" }}>+</button>
    </div>
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}
      style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(80,50,150,0.18)", backdropFilter: "blur(24px)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <motion.div initial={{ y: 70, opacity: 0, scale: 0.93 }} animate={{ y: 0, opacity: 1, scale: 1 }} exit={{ y: 55, opacity: 0, scale: 0.95 }} transition={{ type: "spring", stiffness: 240, damping: 26 }} onClick={e => e.stopPropagation()}
        style={{ width: 520, maxWidth: "94vw", maxHeight: "90vh", display: "flex", flexDirection: "column", borderRadius: 32, background: "rgba(240,232,255,0.70)", backdropFilter: "blur(56px) saturate(210%)", border: "1.5px solid rgba(255,255,255,0.80)", boxShadow: "0 48px 100px rgba(109,40,217,0.22)", overflow: "hidden" }}>
        <div style={{ padding: "28px 28px 0", display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexShrink: 0 }}>
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: "#1e1040", marginBottom: 5 }}>Create New Space</h2>
            <p style={{ fontSize: 13, color: "#a99cc0" }}>Set up your room to get started</p>
          </div>
          <motion.button onClick={onClose} whileHover={{ scale: 1.1, rotate: 90 }} style={{ width: 34, height: 34, borderRadius: "50%", border: "none", background: "rgba(255,255,255,0.50)", cursor: "pointer", fontSize: 18, color: "#6b5b95", display: "flex", alignItems: "center", justifyContent: "center" }}>×</motion.button>
        </div>
        <div style={{ overflowY: "auto", padding: "20px 28px 28px", display: "flex", flexDirection: "column", gap: 20 }}>
          <div>
            <div style={labelStyle}>Space name</div>
            <input placeholder="e.g. Living Room Refresh" value={spaceName} onChange={e => setSpaceName(e.target.value)} onFocus={() => setFocused("name")} onBlur={() => setFocused(null)}
              style={{ width: "100%", padding: "14px 18px", background: focused === "name" ? "rgba(255,255,255,0.55)" : "rgba(255,255,255,0.35)", border: focused === "name" ? "1.5px solid rgba(139,92,246,0.40)" : "1.5px solid rgba(255,255,255,0.65)", borderRadius: 18, outline: "none", fontFamily: "'Afacad',sans-serif", fontSize: 15, fontWeight: 500, color: "#1e1040" }} />
          </div>
          {templates.length > 0 && (
            <div>
              <div style={labelStyle}>Start from Template <span style={{ fontWeight: 400, textTransform: "none", fontSize: 10 }}>(optional)</span></div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8 }}>
                {templates.map(t => (
                  <motion.button key={t.id} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} onClick={() => setSelectedTemplate(selectedTemplate?.id === t.id ? null : t)}
                    style={{ border: selectedTemplate?.id === t.id ? "2px solid #8b5cf6" : "1.5px solid rgba(139,92,246,0.20)", background: selectedTemplate?.id === t.id ? "rgba(139,92,246,0.10)" : "rgba(255,255,255,0.55)", borderRadius: 14, padding: "10px 8px", cursor: "pointer", fontFamily: "'Afacad',sans-serif", fontSize: 11, fontWeight: 700, color: selectedTemplate?.id === t.id ? "#6d28d9" : "#6b5b95" }}>
                    {t.name}
                  </motion.button>
                ))}
              </div>
            </div>
          )}
          <div>
            <div style={labelStyle}>Room shape</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10 }}>
              {ROOM_SHAPES.map(s => {
                const active = shape === s.id;
                return (
                  <motion.button key={s.id} onClick={() => setShape(s.id)} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                    style={{ border: "none", cursor: "pointer", borderRadius: 18, padding: "14px 8px 11px", display: "flex", flexDirection: "column", alignItems: "center", gap: 8, fontFamily: "'Afacad',sans-serif", fontSize: 11, fontWeight: active ? 700 : 600, color: active ? "#5b21b6" : "#8878aa", background: active ? "rgba(255,255,255,0.70)" : "rgba(255,255,255,0.30)", boxShadow: active ? "0 8px 28px rgba(139,92,246,0.20), 0 0 0 1.5px rgba(139,92,246,0.30)" : "0 0 0 1px rgba(255,255,255,0.55)" }}>
                    {s.svg}{s.id}
                  </motion.button>
                );
              })}
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <div><div style={labelStyle}>Width</div><Stepper value={width} onChange={setWidth} field="width" /></div>
            <div><div style={labelStyle}>Height</div><Stepper value={height} onChange={setHeight} field="height" /></div>
          </div>
          <motion.button whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.97 }} onClick={handleCreate} disabled={creating || !spaceName.trim()}
            style={{ width: "100%", padding: "17px 28px", borderRadius: 50, border: "none", fontFamily: "'Afacad',sans-serif", fontSize: 16, fontWeight: 700, color: "#fff", cursor: spaceName.trim() ? "pointer" : "not-allowed", background: spaceName.trim() ? "linear-gradient(135deg,#8b5cf6,#6d28d9)" : "rgba(139,92,246,0.4)", boxShadow: spaceName.trim() ? "0 14px 40px rgba(109,40,217,0.46)" : "none", display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
            {creating ? "Creating..." : "Create Space"}
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [projects, setProjects] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const firstName = user?.name ? user.name.split(" ")[0] : "there";

  useEffect(() => {
    Promise.all([
      fetch("/api/projects", { credentials: "include" }).then(r => r.json()).catch(() => ({ projects: [] })),
      fetch("/api/templates").then(r => r.json()).catch(() => ({ templates: [] })),
    ]).then(([pData, tData]) => {
      setProjects((pData.projects || []).slice(0, 3));
      setTemplates(tData.templates || []);
      setLoading(false);
    });
  }, []);

  const handleUseTemplate = async (template) => {
    const res = await fetch("/api/projects/from-template", { method: "POST", credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ templateId: template.id, projectName: template.name + " Copy" }) });
    const data = await res.json();
    if (data.project?.id) router.push(`/editor/2d?projectId=${data.project.id}`);
  };

  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Afacad:ital,wght@0,400;0,500;0,600;0,700&display=swap');
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
    @keyframes shimmer{0%{background-position:-300% center}100%{background-position:300% center}}
    ::-webkit-scrollbar{width:5px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:rgba(196,176,240,0.5);border-radius:3px}
  `;

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden", fontFamily: "'Afacad','Helvetica Neue',sans-serif", background: "linear-gradient(135deg,#f0eaff 0%,#e8f4ff 50%,#f0e8ff 100%)" }}>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <GlassFilter />
      <GlassSidebar />
      <motion.main initial={{ y: -22, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.65, type: "spring", stiffness: 90, damping: 18 }}
        style={{ flex: 1, overflowY: "auto", padding: "14px 30px 30px 18px", position: "relative", zIndex: 10 }}>

        {/* Header */}
        <motion.div initial={{ y: -16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1, duration: 0.5, type: "spring" }}
          style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 34, padding: "22px 8px" }}>
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 12px", borderRadius: 50, marginBottom: 12, background: "rgba(255,255,255,0.35)", border: "1px solid rgba(255,255,255,0.55)", fontSize: 11, fontWeight: 600, color: "#9b93b8" }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#8b5cf6", display: "inline-block" }} />
              {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
            </div>
            <h1 style={{ fontSize: 34, fontWeight: 700, color: "#1e1040", lineHeight: 1.18, marginBottom: 8, letterSpacing: "-0.5px" }}>
              Welcome back,{" "}
              <span style={{ background: "linear-gradient(90deg,#8b5cf6,#ec4899,#60a5fa,#8b5cf6)", backgroundSize: "300% auto", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", animation: "shimmer 3s linear infinite" }}>{firstName}!</span>
            </h1>
            <p style={{ color: "#b0a4cc", fontSize: 13.5, fontWeight: 500 }}>Ready to design your dream space today?</p>
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
            <GlassButton variant="secondary" onClick={() => router.push("/projects")}>Browse Projects</GlassButton>
            <GlassButton variant="primary" onClick={() => setShowModal(true)}><span style={{ fontSize: 18 }}>+</span> New Space</GlassButton>
          </div>
        </motion.div>

        {/* Recent */}
        <section style={{ marginBottom: 30 }}>
          <SectionHeader title="Recent Spaces" action={<GlassLink onClick={() => router.push("/projects")}>View all →</GlassLink>} />
          {loading ? (
            <div style={{ color: "#a99cc0", fontSize: 13, padding: "20px 0" }}>Loading your spaces...</div>
          ) : projects.length === 0 ? (
            <div style={{ padding: "32px 0", textAlign: "center" }}>
              <div style={{ fontSize: 13, color: "#a99cc0", marginBottom: 14 }}>No spaces yet. Create your first one!</div>
              <GlassButton variant="primary" onClick={() => setShowModal(true)}><span>+</span> Create Space</GlassButton>
            </div>
          ) : (
            <div style={{ display: "flex", gap: 14 }}>
              {projects.map((p, i) => <ProjectCard key={p.id} project={p} index={i} delay={300 + i * 90} onClick={() => router.push(`/editor/2d?projectId=${p.id}`)} />)}
            </div>
          )}
        </section>

        {/* Templates */}
        {templates.length > 0 && (
          <section style={{ marginBottom: 30 }}>
            <SectionHeader title="Start with a Template" action={<GlassLink onClick={() => router.push("/projects")}>All templates →</GlassLink>} />
            <div style={{ display: "flex", gap: 14 }}>
              {templates.slice(0, 3).map((t, i) => <TemplateCard key={t.id} template={t} index={i} delay={500 + i * 90} onUse={handleUseTemplate} />)}
            </div>
          </section>
        )}

        {/* Tips */}
        <section>
          <SectionHeader title="Design Tips" />
          <div style={{ display: "flex", gap: 14 }}>
            {TIPS.map((tip, i) => <TipCard key={tip.title} tip={tip} delay={700 + i * 90} />)}
          </div>
        </section>
      </motion.main>

      <AnimatePresence>
        {showModal && <NewSpaceModal onClose={() => setShowModal(false)} templates={templates} />}
      </AnimatePresence>
    </div>
  );
}
