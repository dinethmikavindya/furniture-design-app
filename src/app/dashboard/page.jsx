"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import GlassSidebar from "@/components/GlassSidebar";
import {
  motion,
  useMotionValue,
  useSpring,
  AnimatePresence,
} from "framer-motion";
import { useAuth } from '@/context/AuthContext';

/* ══════════════════════════════════════════
   DATA
   (NAV array deleted — GlassSidebar has its own)
══════════════════════════════════════════ */
const RECENT = [
  {
    id: 1, name: "Modern Loft Living", sub: "2 hours ago · Living Room",
    preview: "linear-gradient(145deg,#ede0ff,#d4c5f9,#c4b5fd)",
    glow: "rgba(167,139,250,0.45)", label: "Living Room",
    blob1: "#c4b5fd", blob2: "#99f6e4",
  },
  {
    id: 2, name: "Sunny Bedroom", sub: "Yesterday · Bedroom",
    preview: "linear-gradient(145deg,#fff3e0,#fed7aa,#fca5a5)",
    glow: "rgba(251,146,60,0.4)", label: "Bedroom",
    blob1: "#fcd34d", blob2: "#fca5a5",
  },
  {
    id: 3, name: "Home Office Setup", sub: "3 days ago · Office",
    preview: "linear-gradient(145deg,#e0f2fe,#bae6fd,#c4b5fd)",
    glow: "rgba(99,102,241,0.4)", label: "Office",
    blob1: "#93c5fd", blob2: "#d8b4fe",
  },
];

const TEMPLATES = [
  {
    id: 1,
    name: "Nordic Living",
    glow: "rgba(167,139,250,0.5)",
    bg: "linear-gradient(145deg,#ede9fe,#c4b5fd)",
    svg: (
      <svg viewBox="0 0 64 64" width="54" height="54" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="6" y="44" width="52" height="6" rx="2" fill="rgba(255,255,255,0.5)" />
        <rect x="10" y="30" width="44" height="16" rx="5" fill="rgba(255,255,255,0.75)" />
        <rect x="10" y="22" width="44" height="11" rx="4" fill="rgba(255,255,255,0.55)" />
        <rect x="8" y="28" width="7" height="18" rx="3" fill="rgba(255,255,255,0.65)" />
        <rect x="49" y="28" width="7" height="18" rx="3" fill="rgba(255,255,255,0.65)" />
        <rect x="13" y="46" width="4" height="5" rx="1.5" fill="rgba(255,255,255,0.5)" />
        <rect x="47" y="46" width="4" height="5" rx="1.5" fill="rgba(255,255,255,0.5)" />
        <rect x="13" y="31" width="17" height="10" rx="3" fill="rgba(167,139,250,0.45)" />
        <rect x="34" y="31" width="17" height="10" rx="3" fill="rgba(167,139,250,0.45)" />
        <rect x="2" y="36" width="8" height="8" rx="2" fill="rgba(255,255,255,0.45)" />
        <rect x="4" y="28" width="4" height="8" rx="1" fill="rgba(255,255,255,0.4)" />
        <ellipse cx="6" cy="27" rx="5" ry="3" fill="rgba(255,255,255,0.5)" />
      </svg>
    ),
  },
  {
    id: 2,
    name: "Cozy Kitchen",
    glow: "rgba(52,211,153,0.45)",
    bg: "linear-gradient(145deg,#d1fae5,#6ee7b7)",
    svg: (
      <svg viewBox="0 0 64 64" width="54" height="54" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="4" y="34" width="56" height="5" rx="2" fill="rgba(255,255,255,0.65)" />
        <rect x="4" y="39" width="56" height="14" rx="2" fill="rgba(255,255,255,0.45)" />
        <rect x="4" y="10" width="24" height="20" rx="3" fill="rgba(255,255,255,0.55)" />
        <rect x="32" y="10" width="28" height="20" rx="3" fill="rgba(255,255,255,0.55)" />
        <rect x="14" y="19" width="6" height="2" rx="1" fill="rgba(52,211,153,0.7)" />
        <rect x="40" y="19" width="6" height="2" rx="1" fill="rgba(52,211,153,0.7)" />
        <rect x="8" y="36" width="18" height="2" rx="1" fill="rgba(52,211,153,0.5)" />
        <rect x="15" y="31" width="2" height="5" rx="1" fill="rgba(255,255,255,0.7)" />
        <rect x="12" y="31" width="8" height="2" rx="1" fill="rgba(255,255,255,0.7)" />
        <circle cx="38" cy="37" r="3" stroke="rgba(255,255,255,0.8)" strokeWidth="1.5" />
        <circle cx="48" cy="37" r="3" stroke="rgba(255,255,255,0.8)" strokeWidth="1.5" />
        <circle cx="38" cy="44" r="2" stroke="rgba(255,255,255,0.6)" strokeWidth="1.2" />
        <circle cx="48" cy="44" r="2" stroke="rgba(255,255,255,0.6)" strokeWidth="1.2" />
        <rect x="34" y="29" width="10" height="5" rx="2" fill="rgba(255,255,255,0.5)" />
        <rect x="32" y="30" width="3" height="2" rx="1" fill="rgba(255,255,255,0.5)" />
      </svg>
    ),
  },
  {
    id: 3,
    name: "Zen Bath",
    glow: "rgba(244,114,182,0.45)",
    bg: "linear-gradient(145deg,#fce7f3,#f9a8d4)",
    svg: (
      <svg viewBox="0 0 64 64" width="54" height="54" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="6" y="22" width="52" height="28" rx="10" fill="rgba(255,255,255,0.60)" />
        <rect x="11" y="27" width="42" height="20" rx="7" fill="rgba(244,114,182,0.25)" />
        <line x1="16" y1="34" x2="26" y2="34" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="30" y1="38" x2="42" y2="38" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="18" y1="41" x2="28" y2="41" stroke="rgba(255,255,255,0.5)" strokeWidth="1" strokeLinecap="round" />
        <rect x="27" y="14" width="10" height="10" rx="3" fill="rgba(255,255,255,0.65)" />
        <rect x="30" y="10" width="4" height="6" rx="2" fill="rgba(255,255,255,0.55)" />
        <rect x="20" y="15" width="8" height="3" rx="1.5" fill="rgba(255,255,255,0.6)" />
        <rect x="36" y="15" width="8" height="3" rx="1.5" fill="rgba(255,255,255,0.6)" />
        <circle cx="32" cy="46" r="2.5" fill="rgba(244,114,182,0.4)" />
        <circle cx="32" cy="46" r="1" fill="rgba(255,255,255,0.6)" />
        <rect x="10" y="48" width="5" height="4" rx="2" fill="rgba(255,255,255,0.5)" />
        <rect x="49" y="48" width="5" height="4" rx="2" fill="rgba(255,255,255,0.5)" />
        <rect x="3" y="34" width="3" height="7" rx="1" fill="rgba(255,255,255,0.55)" />
        <ellipse cx="4.5" cy="33" rx="1.5" ry="2" fill="rgba(251,191,36,0.7)" />
        <rect x="58" y="34" width="3" height="7" rx="1" fill="rgba(255,255,255,0.55)" />
        <ellipse cx="59.5" cy="33" rx="1.5" ry="2" fill="rgba(251,191,36,0.7)" />
      </svg>
    ),
  },
];

const TIPS = [
  { icon: "💡", title: "Lighting Basics", desc: "Layer ambient, task & accent lighting for depth.", glow: "rgba(167,139,250,0.35)", col: "#ede7f6" },
  { icon: "🎨", title: "Color Theory", desc: "Build cohesive palettes from a single anchor hue.", glow: "rgba(52,211,153,0.35)", col: "#d1fae5" },
  { icon: "📐", title: "Space Planning", desc: "Video: optimising flow in small spaces.", glow: "rgba(251,191,36,0.35)", col: "#fef9c3" },
];

/* ══════════════════════════════════════════
   SVG GLASS FILTERS
   (kept here because ProjectCard / GlassEdge use them)
══════════════════════════════════════════ */
function GlassFilter() {
  return (
    <svg style={{ position: "absolute", width: 0, height: 0, overflow: "hidden" }} aria-hidden>
      <defs>
        <filter id="gf-idle" x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9 0.9" numOctaves="4" seed="2" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="5" xChannelSelector="R" yChannelSelector="G" />
        </filter>
        <filter id="gf-hover" x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence type="fractalNoise" baseFrequency="0.75 0.75" numOctaves="4" seed="5" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="14" xChannelSelector="R" yChannelSelector="G" />
        </filter>
        <filter id="gf-press" x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence type="fractalNoise" baseFrequency="0.6 0.6" numOctaves="3" seed="8" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="26" xChannelSelector="R" yChannelSelector="G" />
        </filter>
        <filter id="gooey">
          <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
          <feColorMatrix in="blur" mode="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -8" result="goo" />
          <feBlend in="SourceGraphic" in2="goo" />
        </filter>
        <filter id="liquid-lens" x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.015" numOctaves="2" seed="3" result="warp" />
          <feDisplacementMap in="SourceGraphic" in2="warp" scale="8" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </defs>
    </svg>
  );
}

/* ══════════════════════════════════════════
   LIQUID GLASS HOOK
══════════════════════════════════════════ */
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
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    rawX.set(py * -strength);
    rawY.set(px * strength);
  }, [rawX, rawY, strength]);

  const onEnter = useCallback(() => { setHov(true); springScale.set(1.025); }, [springScale]);
  const onLeave = useCallback(() => {
    rawX.set(0); rawY.set(0);
    setHov(false); setPress(false);
    springScale.set(1);
  }, [rawX, rawY, springScale]);

  const filterState = press ? "gf-press" : hov ? "gf-hover" : "gf-idle";

  return {
    ref, rotateX, rotateY, hov, press, filterState, springScale,
    events: {
      onMouseMove: onMove,
      onMouseEnter: onEnter,
      onMouseLeave: onLeave,
      onMouseDown: () => { setPress(true); springScale.set(0.97); },
      onMouseUp:   () => { setPress(false); springScale.set(1.025); },
    },
  };
}

/* ══════════════════════════════════════════
   GLASS EDGE
══════════════════════════════════════════ */
function GlassEdge({ hov, radius, filterState, glowColor }) {
  return (
    <>
      <motion.div
        animate={{
          opacity: hov ? 1 : 0.4,
          boxShadow: hov
            ? `0 0 20px 3px rgba(255,255,255,0.45), 0 0 50px 6px ${glowColor || "rgba(167,139,250,0.12)"}, inset 0 1px 18px rgba(255,255,255,0.28), inset 0 -1px 12px rgba(255,255,255,0.10)`
            : `0 0 10px 1px rgba(255,255,255,0.20), inset 0 1px 10px rgba(255,255,255,0.15), inset 0 -1px 6px rgba(255,255,255,0.06)`,
        }}
        transition={{ duration: 0.45 }}
        style={{ position: "absolute", inset: 0, zIndex: 5, borderRadius: radius, pointerEvents: "none" }}
      />
      <motion.div
        animate={{ opacity: hov ? 1 : 0.35 }}
        transition={{ duration: 0.4 }}
        style={{
          position: "absolute", inset: 0, zIndex: 6, borderRadius: radius, pointerEvents: "none",
          border: "1.5px solid transparent",
          backgroundImage: `linear-gradient(135deg,
            rgba(255,255,255,0.80) 0%, rgba(180,210,255,0.45) 15%,
            rgba(255,255,255,0.08) 35%, rgba(255,200,240,0.15) 55%,
            rgba(255,255,255,0.04) 70%, rgba(200,230,255,0.50) 88%,
            rgba(255,255,255,0.70) 100%)`,
          backgroundOrigin: "border-box",
          WebkitMask: "linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "destination-out",
          maskComposite: "exclude",
          filter: `url(#${filterState})`,
          transition: "filter 0.25s ease",
        }}
      />
      <motion.div
        animate={{ opacity: hov ? 0.75 : 0.30 }}
        transition={{ duration: 0.35 }}
        style={{
          position: "absolute", inset: 0, zIndex: 3, borderRadius: radius, pointerEvents: "none",
          background: `linear-gradient(172deg, rgba(255,255,255,0.32) 0%, rgba(255,255,255,0.0) 38%, rgba(255,255,255,0.0) 65%, rgba(255,255,255,0.06) 100%)`,
        }}
      />
    </>
  );
}

/* ══════════════════════════════════════════
   PROJECT CARD
══════════════════════════════════════════ */
function ProjectCard({ p, delay }) {
  const { ref, rotateX, rotateY, hov, filterState, events, springScale } = useLiquidGlass(12);
  return (
    <motion.div
      ref={ref} {...events}
      initial={{ y: 30, opacity: 0, scale: 0.93 }}
      animate={{ y: 0, opacity: 1, scale: 1 }}
      transition={{ delay: delay / 1000, duration: 0.55, type: "spring", stiffness: 120, damping: 16 }}
      style={{
        flex: 1, minWidth: 0, borderRadius: 26, overflow: "hidden",
        cursor: "pointer", position: "relative",
        rotateX, rotateY, scale: springScale,
        transformStyle: "preserve-3d", transformPerspective: 900,
        background: "rgba(255,255,255,0.22)",
        backdropFilter: "blur(32px) saturate(200%) brightness(1.08)",
        WebkitBackdropFilter: "blur(32px) saturate(200%) brightness(1.08)",
        boxShadow: hov
          ? `0 28px 70px ${p.glow}, 0 8px 32px rgba(0,0,0,0.08), 0 0 0 0.5px rgba(255,255,255,0.3)`
          : `0 10px 36px rgba(120,80,220,0.06), 0 2px 10px rgba(0,0,0,0.03), 0 0 0 0.5px rgba(255,255,255,0.18)`,
        transition: "box-shadow 0.35s cubic-bezier(0.22,1,0.36,1)",
      }}
    >
      <GlassEdge hov={hov} radius={26} filterState={filterState} glowColor={p.glow} />
      <motion.div animate={{ opacity: hov ? 1 : 0 }} transition={{ duration: 0.35 }}
        style={{ position: "absolute", inset: -1, zIndex: 2, borderRadius: 27, pointerEvents: "none", boxShadow: `inset 0 0 24px ${p.glow}` }} />
      <motion.div animate={{ opacity: hov ? 0.5 : 0 }} transition={{ duration: 0.4 }}
        style={{ position: "absolute", inset: 0, zIndex: 1, borderRadius: 26, pointerEvents: "none", background: p.preview, filter: "url(#liquid-lens) blur(12px)", transform: "scale(1.05)" }} />
      <div style={{ background: p.preview, height: 148, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, filter: "url(#gooey)" }}>
          <motion.div
            animate={{ x: hov ? [0,14,0] : 0, y: hov ? [0,-12,0] : 0, scale: hov ? [1,1.13,1] : 1 }}
            transition={{ duration: 2.2, repeat: hov ? Infinity : 0, ease: "easeInOut" }}
            style={{ position: "absolute", top: 20, left: 18, width: 90, height: 62, background: p.blob1, borderRadius: 14, opacity: 0.82 }}
          />
          <motion.div
            animate={{ x: hov ? [0,-10,0] : 0, y: hov ? [0,14,0] : 0, scale: hov ? [1,1.2,1] : 1 }}
            transition={{ duration: 2.6, repeat: hov ? Infinity : 0, ease: "easeInOut", delay: 0.35 }}
            style={{ position: "absolute", top: 44, left: 68, width: 62, height: 52, background: p.blob2, borderRadius: "50%", opacity: 0.62 }}
          />
          <motion.div
            animate={{ scale: hov ? [1,1.35,1] : 1 }}
            transition={{ duration: 1.9, repeat: hov ? Infinity : 0, ease: "easeInOut", delay: 0.6 }}
            style={{ position: "absolute", bottom: 22, right: 28, width: 30, height: 30, background: p.blob1, borderRadius: "50%", opacity: 0.5 }}
          />
        </div>
        <motion.div animate={{ left: hov ? "160%" : "-55%" }} transition={{ duration: 0.75, ease: "easeInOut" }}
          style={{ position: "absolute", top: 0, width: "45%", height: "100%", background: "linear-gradient(90deg,transparent,rgba(255,255,255,0.55),transparent)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", background: "linear-gradient(135deg,rgba(255,255,255,0.22) 0%,transparent 55%,rgba(255,255,255,0.06) 100%)" }} />
        <motion.div
          animate={{ scale: hov ? 1.06 : 1, y: hov ? -1 : 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 18 }}
          style={{
            position: "absolute", bottom: 12, right: 12,
            background: "rgba(255,255,255,0.55)", backdropFilter: "blur(24px) saturate(200%)",
            WebkitBackdropFilter: "blur(24px) saturate(200%)",
            padding: "4px 13px", borderRadius: 50,
            fontSize: 10.5, fontWeight: 700, color: "#4c1d95",
            letterSpacing: "0.6px", textTransform: "uppercase",
            boxShadow: "0 4px 16px rgba(0,0,0,0.07), 0 0 0 1px rgba(255,255,255,0.6), inset 0 1px 4px rgba(255,255,255,0.5)",
          }}
        >{p.label}</motion.div>
      </div>
      <motion.div
        animate={{ background: hov ? "rgba(255,255,255,0.18)" : "rgba(255,255,255,0.09)" }}
        transition={{ duration: 0.35 }}
        style={{ padding: "15px 18px 18px", position: "relative", zIndex: 7 }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#1e1040", marginBottom: 4, letterSpacing: "-0.1px" }}>{p.name}</div>
            <div style={{ fontSize: 11, color: "#a99cc0", fontWeight: 500 }}>{p.sub}</div>
          </div>
          <motion.div animate={{ opacity: hov ? 1 : 0, x: hov ? 0 : -6 }} transition={{ duration: 0.22 }}
            style={{ width: 28, height: 28, borderRadius: "50%", background: "rgba(139,92,246,0.12)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, color: "#8b5cf6", boxShadow: "0 0 0 1px rgba(139,92,246,0.2)" }}>→</motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════
   TEMPLATE CARD
══════════════════════════════════════════ */
function TemplateCard({ t, delay, onNavigate }) {
  const { ref, rotateX, rotateY, hov, filterState, events, springScale } = useLiquidGlass(10);
  return (
    <motion.div
      ref={ref} {...events}
      onClick={() => onNavigate(`/editor?template=${t.id}`)}
      initial={{ y: 24, opacity: 0, scale: 0.94 }}
      animate={{ y: 0, opacity: 1, scale: 1 }}
      transition={{ delay: delay / 1000, duration: 0.5, type: "spring", stiffness: 120, damping: 16 }}
      style={{
        flex: 1, minWidth: 0, borderRadius: 24, overflow: "hidden", cursor: "pointer",
        position: "relative", rotateX, rotateY, scale: springScale,
        transformStyle: "preserve-3d", transformPerspective: 800,
        background: "rgba(255,255,255,0.22)",
        backdropFilter: "blur(32px) saturate(200%) brightness(1.08)",
        WebkitBackdropFilter: "blur(32px) saturate(200%) brightness(1.08)",
        boxShadow: hov
          ? `0 22px 60px ${t.glow}, 0 6px 24px rgba(0,0,0,0.06), 0 0 0 0.5px rgba(255,255,255,0.3)`
          : `0 8px 28px rgba(120,80,220,0.05), 0 2px 8px rgba(0,0,0,0.02), 0 0 0 0.5px rgba(255,255,255,0.18)`,
        transition: "box-shadow 0.3s cubic-bezier(0.22,1,0.36,1)",
      }}
    >
      <GlassEdge hov={hov} radius={24} filterState={filterState} glowColor={t.glow} />
      <motion.div animate={{ opacity: hov ? 1 : 0 }} transition={{ duration: 0.35 }}
        style={{ position: "absolute", inset: -1, zIndex: 1, borderRadius: 25, pointerEvents: "none", boxShadow: `inset 0 0 22px ${t.glow}` }} />
      <div style={{ background: t.bg, height: 104, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>
        <motion.div
          animate={{ scale: hov ? 1.22 : 1, rotate: hov ? -8 : 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 18 }}
          style={{ display: "flex", alignItems: "center", justifyContent: "center", filter: hov ? "drop-shadow(0 8px 18px rgba(0,0,0,0.14))" : "drop-shadow(0 2px 6px rgba(0,0,0,0.07))" }}
        >{t.svg}</motion.div>
        <motion.div animate={{ left: hov ? "160%" : "-55%" }} transition={{ duration: 0.65, ease: "easeInOut" }}
          style={{ position: "absolute", top: 0, width: "40%", height: "100%", background: "linear-gradient(90deg,transparent,rgba(255,255,255,0.6),transparent)", pointerEvents: "none" }} />
        <motion.div animate={{ opacity: hov ? 1 : 0, y: hov ? 0 : 6 }} transition={{ duration: 0.22 }}
          style={{ position: "absolute", bottom: 10, left: "50%", transform: "translateX(-50%)", background: "rgba(255,255,255,0.65)", backdropFilter: "blur(16px)", padding: "4px 14px", borderRadius: 50, fontSize: 10, fontWeight: 700, color: "#4c1d95", letterSpacing: "0.4px", boxShadow: "0 4px 14px rgba(0,0,0,0.08), 0 0 0 1px rgba(255,255,255,0.7)", whiteSpace: "nowrap" }}>Use template →</motion.div>
      </div>
      <motion.div animate={{ background: hov ? "rgba(255,255,255,0.16)" : "rgba(255,255,255,0.07)" }} transition={{ duration: 0.3 }}
        style={{ padding: "13px 16px 15px", position: "relative", zIndex: 7 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#1e1040", letterSpacing: "-0.1px" }}>{t.name}</div>
      </motion.div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════
   TIP CARD
══════════════════════════════════════════ */
function TipCard({ tip, delay }) {
  const { ref, rotateX, rotateY, hov, filterState, events, springScale } = useLiquidGlass(8);
  return (
    <motion.div
      ref={ref} {...events}
      initial={{ y: 18, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
      transition={{ delay: delay / 1000, duration: 0.5, type: "spring", stiffness: 120, damping: 16 }}
      whileHover={{ y: -6 }} whileTap={{ scale: 0.96, y: -2 }}
      style={{
        flex: 1, minWidth: 0, borderRadius: 22, padding: "18px 18px",
        display: "flex", alignItems: "flex-start", gap: 14, cursor: "pointer",
        position: "relative", rotateX, rotateY, scale: springScale,
        transformStyle: "preserve-3d", transformPerspective: 700,
        background: "rgba(255,255,255,0.22)",
        backdropFilter: "blur(32px) saturate(200%) brightness(1.08)",
        WebkitBackdropFilter: "blur(32px) saturate(200%) brightness(1.08)",
        boxShadow: hov
          ? `0 18px 50px ${tip.glow},0 4px 20px rgba(0,0,0,0.04), 0 0 0 0.5px rgba(255,255,255,0.3)`
          : `0 6px 22px rgba(120,80,220,0.04),0 2px 8px rgba(0,0,0,0.02), 0 0 0 0.5px rgba(255,255,255,0.18)`,
        transition: "box-shadow 0.3s cubic-bezier(0.22,1,0.36,1)",
      }}
    >
      <GlassEdge hov={hov} radius={22} filterState={filterState} glowColor={tip.glow} />
      <motion.div
        animate={{ rotate: hov ? -12 : 0, scale: hov ? 1.18 : 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 16 }}
        style={{
          width: 44, height: 44, borderRadius: 14, flexShrink: 0,
          background: `linear-gradient(135deg, ${tip.col}, rgba(255,255,255,0.5))`,
          backdropFilter: "blur(16px)", display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 20, position: "relative", zIndex: 7,
          boxShadow: hov ? "0 8px 22px rgba(0,0,0,0.08), 0 0 0 1px rgba(255,255,255,0.55), inset 0 1px 6px rgba(255,255,255,0.4)" : "0 6px 16px rgba(0,0,0,0.04), 0 0 0 1px rgba(255,255,255,0.35), inset 0 1px 4px rgba(255,255,255,0.25)",
        }}
      >{tip.icon}</motion.div>
      <div style={{ position: "relative", zIndex: 7, paddingTop: 2 }}>
        <div style={{ fontSize: 13.5, fontWeight: 700, color: "#1e1040", marginBottom: 5, letterSpacing: "-0.1px" }}>{tip.title}</div>
        <div style={{ fontSize: 11.5, color: "#a99cc0", lineHeight: 1.6, fontWeight: 500 }}>{tip.desc}</div>
      </div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════
   GLASS BUTTON
══════════════════════════════════════════ */
function GlassButton({ children, variant = "secondary", style: btnStyle, onClick, ...props }) {
  const [hov, setHov] = useState(false);
  const [press, setPress] = useState(false);
  const isPrimary = variant === "primary";
  return (
    <motion.button
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => { setHov(false); setPress(false); }}
      onMouseDown={() => setPress(true)}
      onMouseUp={() => setPress(false)}
      onClick={onClick}
      animate={{ scale: press ? 0.94 : hov ? 1.04 : 1, y: press ? 1 : hov ? -2 : 0 }}
      transition={{ type: "spring", stiffness: 320, damping: 20, mass: 0.6 }}
      style={{
        padding: isPrimary ? "11px 28px" : "11px 22px",
        borderRadius: 50, border: "none",
        fontFamily: "'Afacad',sans-serif", fontSize: 13.5, fontWeight: 700,
        cursor: "pointer",
        color: isPrimary ? "#fff" : "#4c1d95",
        background: isPrimary
          ? hov ? "linear-gradient(135deg,#9d6fff 0%,#7c3aed 100%)" : "linear-gradient(135deg,#8b5cf6 0%,#6d28d9 100%)"
          : hov ? "rgba(255,255,255,0.55)" : "rgba(255,255,255,0.35)",
        backdropFilter: "blur(32px) saturate(200%)",
        WebkitBackdropFilter: "blur(32px) saturate(200%)",
        boxShadow: isPrimary
          ? press ? "0 4px 18px rgba(109,40,217,0.30), 0 0 0 1px rgba(255,255,255,0.15)"
            : hov ? "0 14px 40px rgba(109,40,217,0.50), 0 2px 8px rgba(109,40,217,0.25), 0 0 0 1px rgba(255,255,255,0.25), inset 0 1px 0 rgba(255,255,255,0.3)"
            : "0 8px 28px rgba(109,40,217,0.38), 0 2px 8px rgba(109,40,217,0.18), 0 0 0 1px rgba(255,255,255,0.18), inset 0 1px 0 rgba(255,255,255,0.22)"
          : press ? "0 2px 10px rgba(120,80,220,0.08), 0 0 0 1px rgba(255,255,255,0.35)"
            : hov ? "0 8px 28px rgba(120,80,220,0.14), 0 0 0 1px rgba(255,255,255,0.55), inset 0 1px 8px rgba(255,255,255,0.38)"
            : "0 4px 16px rgba(120,80,220,0.07), 0 0 0 1px rgba(255,255,255,0.35), inset 0 1px 4px rgba(255,255,255,0.22)",
        display: "flex", alignItems: "center", gap: 8,
        position: "relative", overflow: "hidden",
        letterSpacing: isPrimary ? "0.1px" : "0px",
        transition: "background 0.2s ease, box-shadow 0.25s cubic-bezier(0.22,1,0.36,1)",
        ...btnStyle,
      }}
      {...props}
    >
      <motion.div animate={{ opacity: hov ? 1 : isPrimary ? 0.5 : 0.35 }} transition={{ duration: 0.25 }}
        style={{ position: "absolute", inset: 0, borderRadius: 50, pointerEvents: "none", border: "1px solid transparent",
          backgroundImage: isPrimary
            ? `linear-gradient(135deg, rgba(255,255,255,0.45) 0%, rgba(200,180,255,0.20) 30%, rgba(255,255,255,0.04) 55%, rgba(210,230,255,0.22) 82%, rgba(255,255,255,0.36) 100%)`
            : `linear-gradient(135deg, rgba(255,255,255,0.82) 0%, rgba(180,210,255,0.38) 22%, rgba(255,255,255,0.06) 48%, rgba(255,200,240,0.14) 68%, rgba(200,230,255,0.48) 90%, rgba(255,255,255,0.72) 100%)`,
          backgroundOrigin: "border-box",
          WebkitMask: "linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "destination-out", maskComposite: "exclude" }} />
      <div style={{ position: "absolute", top: 0, left: "18%", right: "18%", height: isPrimary ? "44%" : "52%",
        background: isPrimary ? "linear-gradient(180deg, rgba(255,255,255,0.22) 0%, transparent 100%)" : "linear-gradient(180deg, rgba(255,255,255,0.38) 0%, transparent 100%)",
        borderRadius: "50px 50px 50% 50%", pointerEvents: "none" }} />
      <motion.div animate={{ left: hov ? "160%" : "-60%" }} transition={{ duration: 0.55, ease: "easeInOut" }}
        style={{ position: "absolute", top: 0, width: "38%", height: "100%", background: "linear-gradient(90deg,transparent,rgba(255,255,255,0.38),transparent)", pointerEvents: "none" }} />
      <span style={{ position: "relative", zIndex: 2, display: "flex", alignItems: "center", gap: 8 }}>{children}</span>
    </motion.button>
  );
}

/* ══════════════════════════════════════════
   SECTION HEADER
══════════════════════════════════════════ */
function SectionHeader({ title, action }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 6, height: 6, borderRadius: "50%", background: "linear-gradient(135deg,#8b5cf6,#60a5fa)", boxShadow: "0 0 8px rgba(139,92,246,0.5)" }} />
        <h2 style={{ fontSize: 15, fontWeight: 700, color: "#1e1040", letterSpacing: "-0.2px" }}>{title}</h2>
      </div>
      {action}
    </div>
  );
}

/* ══════════════════════════════════════════
   GLASS LINK
══════════════════════════════════════════ */
function GlassLink({ children, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <motion.button
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      onClick={onClick}
      whileHover={{ x: 3, scale: 1.03 }} whileTap={{ scale: 0.96 }}
      style={{
        background: hov ? "rgba(255,255,255,0.38)" : "rgba(255,255,255,0.16)",
        backdropFilter: "blur(20px) saturate(160%)", WebkitBackdropFilter: "blur(20px) saturate(160%)",
        border: "none", cursor: "pointer", fontSize: 12.5, fontWeight: 600, color: "#8b5cf6",
        fontFamily: "'Afacad',sans-serif", padding: "6px 15px", borderRadius: 50,
        boxShadow: hov ? "0 4px 16px rgba(139,92,246,0.12), 0 0 0 1px rgba(255,255,255,0.50), inset 0 1px 6px rgba(255,255,255,0.26)" : "0 0 0 0.5px rgba(255,255,255,0.22)",
        position: "relative", overflow: "hidden", transition: "background 0.22s ease, box-shadow 0.28s ease", letterSpacing: "0.1px",
      }}
    >
      {hov && (
        <div style={{ position: "absolute", inset: 0, borderRadius: 50, pointerEvents: "none", border: "1px solid transparent",
          backgroundImage: `linear-gradient(135deg, rgba(255,255,255,0.70) 0%, rgba(180,210,255,0.25) 30%, rgba(255,255,255,0.05) 55%, rgba(200,230,255,0.30) 85%, rgba(255,255,255,0.55) 100%)`,
          backgroundOrigin: "border-box", WebkitMask: "linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)", WebkitMaskComposite: "destination-out", maskComposite: "exclude" }} />
      )}
      <span style={{ position: "relative", zIndex: 2 }}>{children}</span>
    </motion.button>
  );
}

/* ══════════════════════════════════════════
   ROOM SHAPES
══════════════════════════════════════════ */
const ROOM_SHAPES = [
  { id: "Rectangle", label: "Rectangle", svg: (<svg viewBox="0 0 48 48" width="36" height="36" fill="none"><rect x="6" y="12" width="36" height="24" rx="2.5" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round" /></svg>) },
  { id: "Square",    label: "Square",    svg: (<svg viewBox="0 0 48 48" width="36" height="36" fill="none"><rect x="9" y="9" width="30" height="30" rx="2.5" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round" /></svg>) },
  { id: "L-Shape",   label: "L-Shape",   svg: (<svg viewBox="0 0 48 48" width="36" height="36" fill="none"><path d="M7 7 H26 V22 H41 V41 H7 Z" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round" fill="none" /></svg>) },
  { id: "Open Plan", label: "Open Plan", svg: (<svg viewBox="0 0 48 48" width="36" height="36" fill="none"><rect x="5" y="5" width="38" height="38" rx="2.5" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round" /><line x1="5" y1="22" x2="24" y2="22" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /><line x1="24" y1="22" x2="24" y2="43" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>) },
];

/* ══════════════════════════════════════════
   NEW SPACE MODAL
══════════════════════════════════════════ */
function NewSpaceModal({ onClose, onNavigate }) {
  const [spaceName,    setSpaceName]    = useState("");
  const [shape,        setShape]        = useState("Rectangle");
  const [width,        setWidth]        = useState("4");
  const [height,       setHeight]       = useState("4");
  const [focusedField, setFocusedField] = useState(null);

  const labelStyle = { fontSize: 10.5, fontWeight: 700, color: "#9b93b8", marginBottom: 10, letterSpacing: "0.8px", textTransform: "uppercase" };

  const glassInput = (field) => ({
    width: "100%", padding: "14px 18px",
    background: focusedField === field ? "rgba(255,255,255,0.55)" : "rgba(255,255,255,0.35)",
    backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
    border: focusedField === field ? "1.5px solid rgba(139,92,246,0.40)" : "1.5px solid rgba(255,255,255,0.65)",
    borderRadius: 18, outline: "none", fontFamily: "'Afacad',sans-serif", fontSize: 15, fontWeight: 500, color: "#1e1040",
    boxShadow: focusedField === field ? "0 4px 20px rgba(139,92,246,0.12), 0 0 0 3.5px rgba(139,92,246,0.07), inset 0 1px 0 rgba(255,255,255,0.9)" : "0 2px 10px rgba(120,80,220,0.04), inset 0 1px 0 rgba(255,255,255,0.8)",
    transition: "all 0.22s ease",
  });

  const Stepper = ({ value, onChange, field }) => (
    <div style={{ display: "flex", alignItems: "center", background: "rgba(255,255,255,0.35)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", border: focusedField === field ? "1.5px solid rgba(139,92,246,0.40)" : "1.5px solid rgba(255,255,255,0.65)", borderRadius: 18, boxShadow: focusedField === field ? "0 4px 20px rgba(139,92,246,0.12), 0 0 0 3.5px rgba(139,92,246,0.07)" : "0 2px 10px rgba(120,80,220,0.04)", overflow: "hidden", transition: "all 0.22s ease" }}>
      <motion.button whileHover={{ background: "rgba(139,92,246,0.10)" }} whileTap={{ scale: 0.88 }} onClick={() => onChange(v => String(Math.max(1, parseFloat(v) - 0.5)))} style={{ width: 22, height: 34, border: "none", background: "transparent", cursor: "pointer", fontSize: 14, color: "#8b5cf6", fontWeight: 300, display: "flex", alignItems: "center", justifyContent: "center", borderRight: "1px solid rgba(255,255,255,0.5)", transition: "background 0.15s", fontFamily: "'Afacad',sans-serif" }}>−</motion.button>
      <input value={value} onChange={(e) => onChange(() => e.target.value)} onFocus={() => setFocusedField(field)} onBlur={() => setFocusedField(null)} style={{ flex: 1, textAlign: "center", border: "none", outline: "none", background: "transparent", fontFamily: "'Afacad',sans-serif", fontSize: 13, fontWeight: 600, color: "#1e1040", padding: "0 2px", minWidth: 0 }} />
      <span style={{ fontSize: 10, fontWeight: 600, color: "#9b93b8", paddingRight: 5, letterSpacing: "0.3px" }}>m</span>
      <motion.button whileHover={{ background: "rgba(139,92,246,0.10)" }} whileTap={{ scale: 0.88 }} onClick={() => onChange(v => String(Math.min(50, parseFloat(v) + 0.5)))} style={{ width: 22, height: 34, border: "none", background: "transparent", cursor: "pointer", fontSize: 14, color: "#8b5cf6", fontWeight: 300, display: "flex", alignItems: "center", justifyContent: "center", borderLeft: "1px solid rgba(255,255,255,0.5)", transition: "background 0.15s", fontFamily: "'Afacad',sans-serif" }}>+</motion.button>
    </div>
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.28 }} onClick={onClose}
      style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(80,50,150,0.18)", backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <motion.div initial={{ y: 70, opacity: 0, scale: 0.93 }} animate={{ y: 0, opacity: 1, scale: 1 }} exit={{ y: 55, opacity: 0, scale: 0.95 }} transition={{ type: "spring", stiffness: 240, damping: 26, mass: 0.85 }} onClick={(e) => e.stopPropagation()}
        style={{ width: 480, maxWidth: "94vw", borderRadius: 32, background: "rgba(240,232,255,0.70)", backdropFilter: "blur(56px) saturate(210%) brightness(1.08)", WebkitBackdropFilter: "blur(56px) saturate(210%) brightness(1.08)", border: "1.5px solid rgba(255,255,255,0.80)", boxShadow: "0 48px 100px rgba(109,40,217,0.22), 0 0 0 0.5px rgba(255,255,255,0.5), inset 0 2px 0 rgba(255,255,255,0.92)", overflow: "hidden", position: "relative" }}>
        <div style={{ position: "absolute", inset: 0, borderRadius: 32, pointerEvents: "none", zIndex: 10, border: "1.5px solid transparent", backgroundImage: `linear-gradient(135deg, rgba(255,255,255,0.88) 0%, rgba(180,210,255,0.44) 18%, rgba(255,255,255,0.06) 40%, rgba(255,200,240,0.16) 60%, rgba(255,255,255,0.04) 74%, rgba(200,230,255,0.50) 90%, rgba(255,255,255,0.78) 100%)`, backgroundOrigin: "border-box", WebkitMask: "linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)", WebkitMaskComposite: "destination-out", maskComposite: "exclude" }} />
        <div style={{ position: "absolute", top: 0, left: "12%", right: "12%", height: 2, background: "linear-gradient(90deg,transparent,rgba(255,255,255,0.95),transparent)", pointerEvents: "none", zIndex: 11 }} />
        <div style={{ padding: "28px 28px 0", display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: "#1e1040", letterSpacing: "-0.4px", marginBottom: 5 }}>Create New Space</h2>
            <p style={{ fontSize: 13, color: "#a99cc0", fontWeight: 500 }}>Set up your room to get started</p>
          </div>
          <motion.button onClick={onClose} whileHover={{ scale: 1.1, rotate: 90 }} whileTap={{ scale: 0.9 }} style={{ width: 34, height: 34, borderRadius: "50%", border: "none", background: "rgba(255,255,255,0.50)", backdropFilter: "blur(12px)", cursor: "pointer", fontSize: 16, color: "#6b5b95", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 14px rgba(0,0,0,0.07), 0 0 0 1px rgba(255,255,255,0.70)", transition: "background 0.2s", flexShrink: 0 }}>×</motion.button>
        </div>
        <div style={{ margin: "20px 28px 0", height: 1, background: "linear-gradient(90deg, transparent, rgba(139,92,246,0.15), transparent)" }} />
        <div style={{ padding: "24px 28px 28px", display: "flex", flexDirection: "column", gap: 22 }}>
          <div>
            <div style={labelStyle}>Space name</div>
            <input placeholder="e.g. Living Room Refresh" value={spaceName} onChange={(e) => setSpaceName(e.target.value)} onFocus={() => setFocusedField("name")} onBlur={() => setFocusedField(null)} style={{ ...glassInput("name") }} />
          </div>
          <div>
            <div style={labelStyle}>Room shape</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
              {ROOM_SHAPES.map((s) => {
                const active = shape === s.id;
                return (
                  <motion.button key={s.id} onClick={() => setShape(s.id)} whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.96 }}
                    style={{ border: "none", cursor: "pointer", borderRadius: 18, padding: "16px 8px 13px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10, fontFamily: "'Afacad',sans-serif", fontSize: 12, fontWeight: active ? 700 : 600, color: active ? "#5b21b6" : "#8878aa", position: "relative", overflow: "hidden", background: active ? "rgba(255,255,255,0.70)" : "rgba(255,255,255,0.30)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", boxShadow: active ? "0 8px 28px rgba(139,92,246,0.20), 0 0 0 1.5px rgba(139,92,246,0.30), inset 0 1px 0 rgba(255,255,255,0.95)" : "0 4px 14px rgba(120,80,220,0.06), 0 0 0 1px rgba(255,255,255,0.55), inset 0 1px 0 rgba(255,255,255,0.8)", transition: "all 0.22s cubic-bezier(0.22,1,0.36,1)" }}>
                    {active && (<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ position: "absolute", inset: 0, borderRadius: 18, pointerEvents: "none", border: "1.5px solid transparent", backgroundImage: `linear-gradient(135deg, rgba(255,255,255,0.90) 0%, rgba(180,200,255,0.50) 25%, rgba(255,255,255,0.06) 50%, rgba(255,210,255,0.30) 75%, rgba(255,255,255,0.80) 100%)`, backgroundOrigin: "border-box", WebkitMask: "linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)", WebkitMaskComposite: "destination-out", maskComposite: "exclude" }} />)}
                    <div style={{ position: "absolute", top: 0, left: "15%", right: "15%", height: "40%", background: "linear-gradient(180deg, rgba(255,255,255,0.35) 0%, transparent 100%)", borderRadius: "18px 18px 50% 50%", pointerEvents: "none" }} />
                    <motion.span animate={{ color: active ? "#7c3aed" : "#9b8fbb" }} transition={{ duration: 0.2 }} style={{ display: "block", position: "relative", zIndex: 2, lineHeight: 1 }}>{s.svg}</motion.span>
                    <span style={{ position: "relative", zIndex: 2, letterSpacing: "0.1px" }}>{s.label}</span>
                    {active && (<motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 400, damping: 18 }} style={{ position: "absolute", top: 8, right: 8, width: 8, height: 8, borderRadius: "50%", background: "linear-gradient(135deg,#8b5cf6,#6d28d9)", boxShadow: "0 0 8px rgba(139,92,246,0.6)" }} />)}
                  </motion.button>
                );
              })}
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <div><div style={labelStyle}>Width</div><Stepper value={width} onChange={setWidth} field="width" /></div>
            <div><div style={labelStyle}>Height</div><Stepper value={height} onChange={setHeight} field="height" /></div>
          </div>
          <motion.button whileHover={{ scale: 1.025, y: -2 }} whileTap={{ scale: 0.97, y: 1 }} onClick={() => { onClose(); onNavigate("/editor"); }}
            style={{ width: "100%", padding: "17px 28px", borderRadius: 50, border: "none", fontFamily: "'Afacad',sans-serif", fontSize: 16, fontWeight: 700, color: "#fff", cursor: "pointer", background: "linear-gradient(135deg,#8b5cf6 0%,#6d28d9 100%)", boxShadow: "0 14px 40px rgba(109,40,217,0.46), 0 2px 10px rgba(109,40,217,0.22), inset 0 1px 0 rgba(255,255,255,0.28)", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, position: "relative", overflow: "hidden", letterSpacing: "0.1px", marginTop: 4 }}>
            <div style={{ position: "absolute", top: 0, left: "20%", right: "20%", height: "50%", background: "linear-gradient(180deg, rgba(255,255,255,0.24) 0%, transparent 100%)", borderRadius: "50px 50px 50% 50%", pointerEvents: "none" }} />
            <span style={{ fontSize: 20, lineHeight: 1, position: "relative", zIndex: 2 }}>✦</span>
            <span style={{ position: "relative", zIndex: 2 }}>Create Space</span>
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════
   WELCOME HEADER
══════════════════════════════════════════ */
function WelcomeHeader({ onOpenModal }) {
  const { user } = useAuth();
  const firstName = user?.name ? user.name.split(' ')[0] : 'User';
  return (
    <motion.div
      initial={{ y: -16, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.1, duration: 0.5, type: "spring", stiffness: 110, damping: 18 }}
      style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 34, padding: "22px 8px 22px 8px" }}
    >
      <div>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 12px", borderRadius: 50, marginBottom: 12, background: "rgba(255,255,255,0.35)", backdropFilter: "blur(16px)", border: "1px solid rgba(255,255,255,0.55)", fontSize: 11, fontWeight: 600, color: "#9b93b8", letterSpacing: "0.3px", boxShadow: "0 2px 10px rgba(120,80,220,0.05)" }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#8b5cf6", display: "inline-block", boxShadow: "0 0 6px rgba(139,92,246,0.6)" }} />
          {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
        </div>
        <h1 style={{ fontSize: 34, fontWeight: 700, color: "#1e1040", lineHeight: 1.18, marginBottom: 8, letterSpacing: "-0.5px" }}>
          Welcome back,{" "}
          <span style={{ background: "linear-gradient(90deg,#8b5cf6,#ec4899,#60a5fa,#8b5cf6)", backgroundSize: "300% auto", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", animation: "shimmer 3s linear infinite" }}>{firstName}!</span>
        </h1>
        <p style={{ color: "#b0a4cc", fontSize: 13.5, fontWeight: 500 }}>Ready to design your dream space today? ✨</p>
      </div>
      <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
        <GlassButton variant="secondary">Browse Templates</GlassButton>
        <GlassButton variant="primary" onClick={onOpenModal}><span style={{ fontSize: 18, lineHeight: 1 }}>+</span> New Space</GlassButton>
      </div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════
   MAIN PAGE
   Changes from original:
   ✅ Removed: const NAV = [...]
   ✅ Removed: const [active, setActive] = useState("Home")
   ✅ Removed: onNavigate label/setActive logic
   ✅ Removed: <GlassSidebar active=... setActive=... onNavigate=.../>
   ✅ Removed: background orb divs
   ✅ Removed: floatA / floatB keyframes from css
   ✅ Kept:    shimmer keyframe (used by WelcomeHeader)
   ✅ Kept:    GlassFilter (used by ProjectCard / GlassEdge)
   ✅ New:     <GlassSidebar /> with zero props
══════════════════════════════════════════ */
export default function HomeScreen() {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);

  /* onNavigate is still used by NewSpaceModal + GlassLink — kept simple */
  const onNavigate = (path) => router.push(path);

  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Afacad:ital,wght@0,400;0,500;0,600;0,700&display=swap');
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
    @keyframes shimmer{0%{background-position:-300% center}100%{background-position:300% center}}
    ::-webkit-scrollbar{width:5px}
    ::-webkit-scrollbar-track{background:transparent}
    ::-webkit-scrollbar-thumb{background:rgba(196,176,240,0.5);border-radius:3px}
    select option { background: #f0eaff; color: #1e1040; }
  `;

  return (
    <div style={{
      display: "flex",
      height: "100vh",           /* fixed height — sidebar never scrolls */
      overflow: "hidden",        /* outer shell never scrolls */
      fontFamily: "'Afacad','Helvetica Neue',sans-serif",
      background: "linear-gradient(135deg,#f0eaff 0%,#e8f4ff 50%,#f0e8ff 100%)",
      position: "relative",
    }}>
      <style dangerouslySetInnerHTML={{ __html: css }} />

      {/* GlassFilter SVG — required by ProjectCard / GlassEdge */}
      <GlassFilter />

      {/* ✅ NEW: single import, zero props — sidebar handles everything */}
      <GlassSidebar />

      {/* Page content — this is the only thing that scrolls */}
      <motion.main
        initial={{ y: -22, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.65, delay: 0.1, type: "spring", stiffness: 90, damping: 18 }}
        style={{ flex: 1, overflowY: "auto", padding: "14px 30px 30px 18px", position: "relative", zIndex: 10 }}
      >
        <WelcomeHeader onOpenModal={() => setShowModal(true)} />

        <section style={{ marginBottom: 30 }}>
          <SectionHeader
            title="Recent Spaces"
            action={<GlassLink onClick={() => onNavigate("/projects")}>View all →</GlassLink>}
          />
          <div style={{ display: "flex", gap: 14 }}>
            {RECENT.map((p, i) => <ProjectCard key={p.id} p={p} delay={300 + i * 90} />)}
          </div>
        </section>

        <section style={{ marginBottom: 30 }}>
          <SectionHeader
            title="Start with a Template"
            action={<GlassLink>All templates →</GlassLink>}
          />
          <div style={{ display: "flex", gap: 14 }}>
            {TEMPLATES.map((t, i) => <TemplateCard key={t.id} t={t} delay={500 + i * 90} onNavigate={onNavigate} />)}
          </div>
        </section>

        <section>
          <SectionHeader title="Quick Tips" />
          <div style={{ display: "flex", gap: 14 }}>
            {TIPS.map((tip, i) => <TipCard key={tip.title} tip={tip} delay={700 + i * 90} />)}
          </div>
        </section>
      </motion.main>

      <AnimatePresence>
        {showModal && (
          <NewSpaceModal
            onClose={() => setShowModal(false)}
            onNavigate={onNavigate}
          />
        )}
      </AnimatePresence>
    </div>
  );
}