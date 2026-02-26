"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";          
import {
  motion,
  useMotionValue,
  useSpring,
  AnimatePresence,                                  
} from "framer-motion";

import AnalyticsWidget from '../../components/dashboard/AnalyticsWidget';

const NAV = [
  { icon: "⌂", label: "Home",      path: "/dashboard" },  
  { icon: "▦", label: "Projects",  path: "/projects" },
  { icon: "✦", label: "Editor",    path: "/editor" },
  { icon: "⊡", label: "Shop",      path: "/shop" },
  { icon: "◈", label: "Materials", path: "/materials" },
  { icon: "⚙", label: "Settings",  path: "/settings" },
];

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

// Replace your existing TEMPLATES array with this one
// Drop-in replacement — everything else stays the same

const TEMPLATES = [
  {
    id: 1,
    name: "Nordic Living",
    glow: "rgba(167,139,250,0.5)",
    bg: "linear-gradient(145deg,#ede9fe,#c4b5fd)",
    svg: (
      <svg viewBox="0 0 64 64" width="54" height="54" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Floor */}
        <rect x="6" y="44" width="52" height="6" rx="2" fill="rgba(255,255,255,0.5)" />
        {/* Sofa body */}
        <rect x="10" y="30" width="44" height="16" rx="5" fill="rgba(255,255,255,0.75)" />
        {/* Sofa back */}
        <rect x="10" y="22" width="44" height="11" rx="4" fill="rgba(255,255,255,0.55)" />
        {/* Left arm */}
        <rect x="8" y="28" width="7" height="18" rx="3" fill="rgba(255,255,255,0.65)" />
        {/* Right arm */}
        <rect x="49" y="28" width="7" height="18" rx="3" fill="rgba(255,255,255,0.65)" />
        {/* Left leg */}
        <rect x="13" y="46" width="4" height="5" rx="1.5" fill="rgba(255,255,255,0.5)" />
        {/* Right leg */}
        <rect x="47" y="46" width="4" height="5" rx="1.5" fill="rgba(255,255,255,0.5)" />
        {/* Cushion 1 */}
        <rect x="13" y="31" width="17" height="10" rx="3" fill="rgba(167,139,250,0.45)" />
        {/* Cushion 2 */}
        <rect x="34" y="31" width="17" height="10" rx="3" fill="rgba(167,139,250,0.45)" />
        {/* Side table */}
        <rect x="2" y="36" width="8" height="8" rx="2" fill="rgba(255,255,255,0.45)" />
        {/* Lamp */}
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
        {/* Counter top */}
        <rect x="4" y="34" width="56" height="5" rx="2" fill="rgba(255,255,255,0.65)" />
        {/* Counter body */}
        <rect x="4" y="39" width="56" height="14" rx="2" fill="rgba(255,255,255,0.45)" />
        {/* Cabinet left */}
        <rect x="4" y="10" width="24" height="20" rx="3" fill="rgba(255,255,255,0.55)" />
        {/* Cabinet right */}
        <rect x="32" y="10" width="28" height="20" rx="3" fill="rgba(255,255,255,0.55)" />
        {/* Cabinet handles */}
        <rect x="14" y="19" width="6" height="2" rx="1" fill="rgba(52,211,153,0.7)" />
        <rect x="40" y="19" width="6" height="2" rx="1" fill="rgba(52,211,153,0.7)" />
        {/* Sink */}
        <rect x="8" y="36" width="18" height="2" rx="1" fill="rgba(52,211,153,0.5)" />
        {/* Tap */}
        <rect x="15" y="31" width="2" height="5" rx="1" fill="rgba(255,255,255,0.7)" />
        <rect x="12" y="31" width="8" height="2" rx="1" fill="rgba(255,255,255,0.7)" />
        {/* Hob / stove burners */}
        <circle cx="38" cy="37" r="3" stroke="rgba(255,255,255,0.8)" strokeWidth="1.5" />
        <circle cx="48" cy="37" r="3" stroke="rgba(255,255,255,0.8)" strokeWidth="1.5" />
        <circle cx="38" cy="44" r="2" stroke="rgba(255,255,255,0.6)" strokeWidth="1.2" />
        <circle cx="48" cy="44" r="2" stroke="rgba(255,255,255,0.6)" strokeWidth="1.2" />
        {/* Pot */}
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
        {/* Bath tub outer */}
        <rect x="6" y="22" width="52" height="28" rx="10" fill="rgba(255,255,255,0.60)" />
        {/* Bath tub inner (water) */}
        <rect x="11" y="27" width="42" height="20" rx="7" fill="rgba(244,114,182,0.25)" />
        {/* Water shimmer lines */}
        <line x1="16" y1="34" x2="26" y2="34" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="30" y1="38" x2="42" y2="38" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="18" y1="41" x2="28" y2="41" stroke="rgba(255,255,255,0.5)" strokeWidth="1" strokeLinecap="round" />
        {/* Tap */}
        <rect x="27" y="14" width="10" height="10" rx="3" fill="rgba(255,255,255,0.65)" />
        <rect x="30" y="10" width="4" height="6" rx="2" fill="rgba(255,255,255,0.55)" />
        {/* Left handle */}
        <rect x="20" y="15" width="8" height="3" rx="1.5" fill="rgba(255,255,255,0.6)" />
        {/* Right handle */}
        <rect x="36" y="15" width="8" height="3" rx="1.5" fill="rgba(255,255,255,0.6)" />
        {/* Drain */}
        <circle cx="32" cy="46" r="2.5" fill="rgba(244,114,182,0.4)" />
        <circle cx="32" cy="46" r="1" fill="rgba(255,255,255,0.6)" />
        {/* Left foot */}
        <rect x="10" y="48" width="5" height="4" rx="2" fill="rgba(255,255,255,0.5)" />
        {/* Right foot */}
        <rect x="49" y="48" width="5" height="4" rx="2" fill="rgba(255,255,255,0.5)" />
        {/* Candle left */}
        <rect x="3" y="34" width="3" height="7" rx="1" fill="rgba(255,255,255,0.55)" />
        <ellipse cx="4.5" cy="33" rx="1.5" ry="2" fill="rgba(251,191,36,0.7)" />
        {/* Candle right */}
        <rect x="58" y="34" width="3" height="7" rx="1" fill="rgba(255,255,255,0.55)" />
        <ellipse cx="59.5" cy="33" rx="1.5" ry="2" fill="rgba(251,191,36,0.7)" />
      </svg>
    ),
  },
];


const TIPS = [
  { icon: "", title: "Lighting Basics",  desc: "Layer ambient, task & accent lighting for depth.", glow: "rgba(167,139,250,0.35)", col: "#ede7f6" },
  { icon: "", title: "Color Theory",     desc: "Build cohesive palettes from a single anchor hue.", glow: "rgba(52,211,153,0.35)", col: "#d1fae5" },
  { icon: "", title: "Space Planning",   desc: "Video: optimising flow in small spaces.",           glow: "rgba(251,191,36,0.35)", col: "#fef9c3" },
];


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
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -8"
            result="goo" />
          <feBlend in="SourceGraphic" in2="goo" />
        </filter>
        <filter id="liquid-lens" x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.015" numOctaves="2" seed="3" result="warp" />
          <feDisplacementMap in="SourceGraphic" in2="warp" scale="8" xChannelSelector="R" yChannelSelector="G" />
        </filter>
        <filter id="chromatic" x="-5%" y="-5%" width="110%" height="110%">
          <feOffset in="SourceGraphic" dx="0.6" dy="0" result="red" />
          <feOffset in="SourceGraphic" dx="-0.6" dy="0" result="blue" />
          <feBlend in="red" in2="blue" mode="screen" />
        </filter>
      </defs>
    </svg>
  );
}


function useLiquidGlass(strength = 14) {
  const ref    = useRef(null);
  const rawX   = useMotionValue(0);
  const rawY   = useMotionValue(0);
  const rotateX    = useSpring(rawY, { stiffness: 80, damping: 12, mass: 0.8 });
  const rotateY    = useSpring(rawX, { stiffness: 80, damping: 12, mass: 0.8 });
  const springScale = useSpring(1,  { stiffness: 200, damping: 14, mass: 0.6 });
  const [hov,   setHov]   = useState(false);
  const [press, setPress] = useState(false);

  const onMove = useCallback((e) => {
    const el = ref.current; if (!el) return;
    const r  = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width  - 0.5;
    const py = (e.clientY - r.top)  / r.height - 0.5;
    rawX.set(py * -strength);
    rawY.set(px *  strength);
  }, [rawX, rawY, strength]);

  const onEnter = useCallback(() => {
    setHov(true);
    springScale.set(1.025);
  }, [springScale]);

  const onLeave = useCallback(() => {
    rawX.set(0); rawY.set(0);
    setHov(false); setPress(false);
    springScale.set(1);
  }, [rawX, rawY, springScale]);

  const filterState = press ? "gf-press" : hov ? "gf-hover" : "gf-idle";

  return {
    ref, rotateX, rotateY, hov, press, filterState, springScale,
    events: {
      onMouseMove:  onMove,
      onMouseEnter: onEnter,
      onMouseLeave: onLeave,
      onMouseDown:  () => { setPress(true);  springScale.set(0.97); },
      onMouseUp:    () => { setPress(false); springScale.set(1.025); },
    },
  };
}


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
            rgba(255,255,255,0.80) 0%, 
            rgba(180,210,255,0.45) 15%, 
            rgba(255,255,255,0.08) 35%, 
            rgba(255,200,240,0.15) 55%, 
            rgba(255,255,255,0.04) 70%, 
            rgba(200,230,255,0.50) 88%, 
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

/* ══════ PROJECT CARD ══════ */
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
        rotateX, rotateY,
        scale: springScale,
        transformStyle: "preserve-3d",
        transformPerspective: 900,
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
      <motion.div
        animate={{ opacity: hov ? 1 : 0 }}
        transition={{ duration: 0.35 }}
        style={{ position: "absolute", inset: -1, zIndex: 2, borderRadius: 27, pointerEvents: "none",
          boxShadow: `inset 0 0 24px ${p.glow}` }}
      />
      <motion.div
        animate={{ opacity: hov ? 0.5 : 0 }}
        transition={{ duration: 0.4 }}
        style={{
          position: "absolute", inset: 0, zIndex: 1, borderRadius: 26, pointerEvents: "none",
          background: p.preview, filter: "url(#liquid-lens) blur(12px)", transform: "scale(1.05)",
        }}
      />
      <div style={{ background: p.preview, height: 148, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, filter: "url(#gooey)" }}>
          <motion.div
            animate={{ x: hov?[0,14,0]:0, y: hov?[0,-12,0]:0, scale: hov?[1,1.13,1]:1 }}
            transition={{ duration: 2.2, repeat: hov?Infinity:0, ease: "easeInOut" }}
            style={{ position:"absolute",top:20,left:18,width:90,height:62,background:p.blob1,borderRadius:14,opacity:0.82 }}
          />
          <motion.div
            animate={{ x: hov?[0,-10,0]:0, y: hov?[0,14,0]:0, scale: hov?[1,1.2,1]:1 }}
            transition={{ duration: 2.6, repeat: hov?Infinity:0, ease: "easeInOut", delay: 0.35 }}
            style={{ position:"absolute",top:44,left:68,width:62,height:52,background:p.blob2,borderRadius:"50%",opacity:0.62 }}
          />
          <motion.div
            animate={{ scale: hov?[1,1.35,1]:1 }}
            transition={{ duration: 1.9, repeat: hov?Infinity:0, ease: "easeInOut", delay: 0.6 }}
            style={{ position:"absolute",bottom:22,right:28,width:30,height:30,background:p.blob1,borderRadius:"50%",opacity:0.5 }}
          />
        </div>
        <motion.div
          animate={{ left: hov ? "160%" : "-55%" }}
          transition={{ duration: 0.75, ease: "easeInOut" }}
          style={{ position:"absolute",top:0,width:"45%",height:"100%",
            background:"linear-gradient(90deg,transparent,rgba(255,255,255,0.55),transparent)",pointerEvents:"none" }}
        />
        <div style={{ position:"absolute",inset:0,pointerEvents:"none",
          background:"linear-gradient(135deg,rgba(255,255,255,0.22) 0%,transparent 55%,rgba(255,255,255,0.06) 100%)" }}/>
        <motion.div
          animate={{ scale: hov ? 1.06 : 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 18 }}
          style={{
            position:"absolute",bottom:10,right:12,
            background:"rgba(255,255,255,0.30)",
            backdropFilter:"blur(20px) saturate(180%)",
            WebkitBackdropFilter:"blur(20px) saturate(180%)",
            padding:"3px 12px",borderRadius:50,
            fontSize:10,fontWeight:700,color:"#4c1d95",letterSpacing:"0.4px",
            boxShadow:"0 4px 14px rgba(0,0,0,0.05), 0 0 0 0.5px rgba(255,255,255,0.4), inset 0 1px 4px rgba(255,255,255,0.35)",
          }}
        >{p.label}</motion.div>
      </div>
      <motion.div
        animate={{ background: hov ? "rgba(255,255,255,0.16)" : "rgba(255,255,255,0.08)" }}
        transition={{ duration: 0.35 }}
        style={{ padding:"14px 18px 18px", position: "relative", zIndex: 7 }}
      >
        <div style={{ fontSize:14,fontWeight:700,color:"#2d1f4e",marginBottom:4 }}>{p.name}</div>
        <div style={{ fontSize:11,color:"#9b93b8",fontWeight:500 }}>{p.sub}</div>
      </motion.div>
    </motion.div>
  );
}

/* ══════ TEMPLATE CARD ══════ */
function TemplateCard({ t, delay, onNavigate }) {
  const { ref, rotateX, rotateY, hov, filterState, events, springScale } = useLiquidGlass(10);

  return (
    <motion.div
      ref={ref} {...events}
      onClick={() => onNavigate(`/editor?template=${t.id}`)}
      initial={{ y: 24, opacity: 0, scale: 0.94 }}
      animate={{ y: 0, opacity: 1, scale: 1 }}
      transition={{ delay: delay/1000, duration: 0.5, type:"spring", stiffness:120, damping:16 }}
      style={{
        flex:1, minWidth:0, borderRadius:24, overflow:"hidden", cursor:"pointer",
        position:"relative",
        rotateX, rotateY, scale: springScale,
        transformStyle:"preserve-3d", transformPerspective:800,
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
      <motion.div animate={{ opacity: hov?1:0 }} transition={{ duration:0.35 }}
        style={{ position:"absolute",inset:-1,zIndex:1,borderRadius:25,pointerEvents:"none",
          boxShadow:`inset 0 0 22px ${t.glow}` }} />
      <div style={{ background:t.bg,height:104,display:"flex",alignItems:"center",justifyContent:"center",position:"relative",overflow:"hidden" }}>
        <motion.div
  animate={{ scale: hov ? 1.22 : 1, rotate: hov ? -8 : 0 }}
  transition={{ type: "spring", stiffness: 260, damping: 18 }}
  style={{
    display: "flex", alignItems: "center", justifyContent: "center",
    filter: hov
      ? "drop-shadow(0 8px 18px rgba(0,0,0,0.14))"
      : "drop-shadow(0 2px 6px rgba(0,0,0,0.07))",
  }}
>
  {t.svg}
</motion.div>
        <motion.div
          animate={{ left: hov?"160%":"-55%" }}
          transition={{ duration:0.65,ease:"easeInOut" }}
          style={{ position:"absolute",top:0,width:"40%",height:"100%",
            background:"linear-gradient(90deg,transparent,rgba(255,255,255,0.6),transparent)",pointerEvents:"none" }}
        />
      </div>
      <motion.div
        animate={{ background: hov ? "rgba(255,255,255,0.14)" : "rgba(255,255,255,0.06)" }}
        transition={{ duration: 0.3 }}
        style={{ padding:"12px 16px 16px", position: "relative", zIndex: 7 }}
      >
        <div style={{ fontSize:13,fontWeight:700,color:"#2d1f4e" }}>{t.name}</div>
      </motion.div>
    </motion.div>
  );
}

/* ══════ TIP CARD ══════ */
function TipCard({ tip, delay }) {
  const { ref, rotateX, rotateY, hov, filterState, events, springScale } = useLiquidGlass(8);

  return (
    <motion.div
      ref={ref} {...events}
      initial={{y:18,opacity:0}} animate={{y:0,opacity:1}}
      transition={{delay:delay/1000,duration:0.5,type:"spring",stiffness:120,damping:16}}
      whileHover={{y:-6}}
      whileTap={{scale:0.96,y:-2}}
      style={{
        flex:1,minWidth:0,borderRadius:22,padding:"16px 18px",
        display:"flex",alignItems:"flex-start",gap:14,cursor:"pointer",
        position:"relative",
        rotateX, rotateY, scale: springScale,
        transformStyle:"preserve-3d", transformPerspective:700,
        background: "rgba(255,255,255,0.22)",
        backdropFilter: "blur(32px) saturate(200%) brightness(1.08)",
        WebkitBackdropFilter: "blur(32px) saturate(200%) brightness(1.08)",
        boxShadow: hov
          ? `0 18px 50px ${tip.glow},0 4px 20px rgba(0,0,0,0.04), 0 0 0 0.5px rgba(255,255,255,0.3)`
          : `0 6px 22px rgba(120,80,220,0.04),0 2px 8px rgba(0,0,0,0.02), 0 0 0 0.5px rgba(255,255,255,0.18)`,
        transition:"box-shadow 0.3s cubic-bezier(0.22,1,0.36,1)",
      }}
    >
      <GlassEdge hov={hov} radius={22} filterState={filterState} glowColor={tip.glow} />
      <motion.div
        animate={{ rotate:hov?-12:0, scale:hov?1.18:1 }}
        transition={{ type:"spring",stiffness:260,damping:16 }}
        style={{
          width:42,height:42,borderRadius:14,flexShrink:0,
          background: `linear-gradient(135deg, ${tip.col}, rgba(255,255,255,0.5))`,
          backdropFilter:"blur(16px)",
          display:"flex",alignItems:"center",justifyContent:"center",
          fontSize:20,position:"relative",zIndex:7,
          boxShadow: hov
            ? "0 8px 22px rgba(0,0,0,0.08), 0 0 0 0.5px rgba(255,255,255,0.5), inset 0 1px 6px rgba(255,255,255,0.4)"
            : "0 6px 16px rgba(0,0,0,0.04), 0 0 0 0.5px rgba(255,255,255,0.3), inset 0 1px 4px rgba(255,255,255,0.25)",
        }}
      >{tip.icon}</motion.div>
      <div style={{ position:"relative",zIndex:7 }}>
        <div style={{fontSize:13,fontWeight:700,color:"#2d1f4e",marginBottom:5}}>{tip.title}</div>
        <div style={{fontSize:11.5,color:"#9b93b8",lineHeight:1.55,fontWeight:500}}>{tip.desc}</div>
      </div>
    </motion.div>
  );
}

/* ══════ GLASS NAV ITEM ══════ */
function GlassNavItem({ item, isActive, onClick, index }) {
  const [hov, setHov] = useState(false);

  return (
    <motion.button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      initial={{ x: -22, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: index * 0.06 + 0.25, type: "spring", stiffness: 130, damping: 18 }}
      whileHover={{ x: 5, scale: 1.04 }}
      whileTap={{ x: 2, scale: 0.93 }}
      style={{
        display: "flex", alignItems: "center", gap: 11,
        padding: "11px 16px", borderRadius: 50, border: "none",
        cursor: "pointer", textAlign: "left",
        fontFamily: "'Afacad',sans-serif", fontSize: 14,
        fontWeight: isActive ? 700 : 500,
        color: isActive ? "#4c1d95" : "#6b5b95",
        background: isActive
          ? "rgba(255,255,255,0.42)"
          : hov ? "rgba(255,255,255,0.24)" : "transparent",
        backdropFilter: isActive || hov ? "blur(28px) saturate(180%)" : "none",
        WebkitBackdropFilter: isActive || hov ? "blur(28px) saturate(180%)" : "none",
        boxShadow: isActive
          ? "0 4px 22px rgba(139,92,246,0.12), 0 0 0 0.5px rgba(255,255,255,0.45), inset 0 1px 8px rgba(255,255,255,0.30)"
          : hov
          ? "0 2px 16px rgba(139,92,246,0.06), 0 0 0 0.5px rgba(255,255,255,0.30), inset 0 1px 6px rgba(255,255,255,0.20)"
          : "none",
        transition: "all 0.25s cubic-bezier(0.22,1,0.36,1)",
        position: "relative", overflow: "hidden",
      }}
    >
      {(isActive || hov) && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          style={{
            position: "absolute", inset: 0, borderRadius: 50, pointerEvents: "none",
            border: "1px solid transparent",
            backgroundImage: `linear-gradient(135deg, 
              rgba(255,255,255,0.75) 0%, rgba(180,210,255,0.35) 20%, 
              rgba(255,255,255,0.05) 45%, rgba(255,200,240,0.12) 65%, 
              rgba(200,230,255,0.40) 90%, rgba(255,255,255,0.65) 100%)`,
            backgroundOrigin: "border-box",
            WebkitMask: "linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)",
            WebkitMaskComposite: "destination-out",
            maskComposite: "exclude",
          }}
        />
      )}
      {(isActive || hov) && (
        <div style={{
          position: "absolute", top: 0, left: "10%", right: "10%", height: "45%",
          background: "linear-gradient(180deg, rgba(255,255,255,0.25) 0%, transparent 100%)",
          borderRadius: "50px 50px 50% 50%", pointerEvents: "none",
        }} />
      )}
      <span style={{
        fontSize: 17,
        filter: isActive ? "drop-shadow(0 2px 6px rgba(139,92,246,0.48))" : "none",
        transition: "filter 0.25s", position: "relative", zIndex: 2,
      }}>{item.icon}</span>
      <span style={{ position: "relative", zIndex: 2 }}>{item.label}</span>
      {isActive && (
        <motion.div
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ duration: 1.9, repeat: Infinity }}
          style={{
            marginLeft: "auto", width: 7, height: 7, borderRadius: "50%",
            background: "#8b5cf6", boxShadow: "0 0 8px #8b5cf6, 0 0 16px rgba(139,92,246,0.3)",
            position: "relative", zIndex: 2,
          }}
        />
      )}
    </motion.button>
  );
}

/* ══════ GLASS BUTTON ══════ */
function GlassButton({ children, variant = "secondary", style: btnStyle, ...props }) {
  const [hov,   setHov]   = useState(false);
  const [press, setPress] = useState(false);
  const isPrimary = variant === "primary";

  return (
    <motion.button
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => { setHov(false); setPress(false); }}
      onMouseDown={() => setPress(true)}
      onMouseUp={() => setPress(false)}
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.93, y: 2 }}
      style={{
        padding: isPrimary ? "11px 26px" : "11px 22px",
        borderRadius: 50, border: "none",
        fontFamily: "'Afacad',sans-serif", fontSize: 13,
        fontWeight: isPrimary ? 700 : 600,
        cursor: "pointer",
        color: isPrimary ? "#fff" : "#5c3d8f",
        background: isPrimary
          ? "linear-gradient(135deg,#8b5cf6 0%,#6d28d9 100%)"
          : hov ? "rgba(255,255,255,0.48)" : "rgba(255,255,255,0.30)",
        backdropFilter: "blur(28px) saturate(180%)",
        WebkitBackdropFilter: "blur(28px) saturate(180%)",
        boxShadow: isPrimary
          ? hov
            ? "0 12px 36px rgba(109,40,217,0.45), 0 0 0 0.5px rgba(255,255,255,0.25), inset 0 1px 10px rgba(255,255,255,0.20)"
            : "0 8px 28px rgba(109,40,217,0.35), 0 0 0 0.5px rgba(255,255,255,0.15), inset 0 1px 6px rgba(255,255,255,0.12)"
          : hov
            ? "0 8px 28px rgba(120,80,220,0.12), 0 0 0 0.5px rgba(255,255,255,0.45), inset 0 1px 8px rgba(255,255,255,0.30)"
            : "0 4px 18px rgba(120,80,220,0.06), 0 0 0 0.5px rgba(255,255,255,0.30), inset 0 1px 4px rgba(255,255,255,0.18)",
        display: "flex", alignItems: "center", gap: 7,
        position: "relative", overflow: "hidden",
        filter: `url(#${press ? "gf-press" : "gf-idle"})`,
        transition: "background 0.25s ease, box-shadow 0.3s cubic-bezier(0.22,1,0.36,1), filter 0.25s ease",
        ...btnStyle,
      }}
      {...props}
    >
      <motion.div
        animate={{ opacity: hov ? 1 : 0.4 }}
        transition={{ duration: 0.25 }}
        style={{
          position: "absolute", inset: 0, borderRadius: 50, pointerEvents: "none",
          border: "1px solid transparent",
          backgroundImage: isPrimary
            ? `linear-gradient(135deg, rgba(255,255,255,0.40) 0%, rgba(200,180,255,0.15) 30%, rgba(255,255,255,0.03) 50%, rgba(200,220,255,0.20) 80%, rgba(255,255,255,0.30) 100%)`
            : `linear-gradient(135deg, rgba(255,255,255,0.80) 0%, rgba(180,210,255,0.35) 20%, rgba(255,255,255,0.05) 45%, rgba(255,200,240,0.12) 65%, rgba(200,230,255,0.45) 90%, rgba(255,255,255,0.70) 100%)`,
          backgroundOrigin: "border-box",
          WebkitMask: "linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "destination-out",
          maskComposite: "exclude",
        }}
      />
      <div style={{
        position: "absolute", top: 0, left: "15%", right: "15%", height: "50%",
        background: isPrimary
          ? "linear-gradient(180deg, rgba(255,255,255,0.18) 0%, transparent 100%)"
          : "linear-gradient(180deg, rgba(255,255,255,0.30) 0%, transparent 100%)",
        borderRadius: "50px 50px 50% 50%", pointerEvents: "none",
      }} />
      <motion.div
        animate={{ left: hov ? "160%" : "-60%" }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        style={{
          position: "absolute", top: 0, width: "40%", height: "100%",
          background: "linear-gradient(90deg,transparent,rgba(255,255,255,0.45),transparent)",
          pointerEvents: "none",
        }}
      />
      <span style={{ position: "relative", zIndex: 2, display: "flex", alignItems: "center", gap: 7 }}>
        {children}
      </span>
    </motion.button>
  );
}

/* ══════ GLASS USER CARD ══════ */
function GlassUserCard({ onNavigate }) {                              // ← ADDED onNavigate prop
  const [hov, setHov] = useState(false);
  return (
    <motion.div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onClick={() => onNavigate("/account")}                          // ← ADDED onClick
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      style={{
        margin: "12px 12px 0", padding: "13px 14px", borderRadius: 50,
        background: hov ? "rgba(255,255,255,0.42)" : "rgba(255,255,255,0.28)",
        backdropFilter: "blur(28px) saturate(180%)",
        WebkitBackdropFilter: "blur(28px) saturate(180%)",
        boxShadow: hov
          ? "0 12px 36px rgba(120,80,220,0.10), 0 0 0 0.5px rgba(255,255,255,0.45), inset 0 1px 8px rgba(255,255,255,0.28)"
          : "0 8px 28px rgba(120,80,220,0.05), 0 0 0 0.5px rgba(255,255,255,0.25), inset 0 1px 4px rgba(255,255,255,0.16)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        cursor: "pointer", position: "relative", overflow: "hidden",
        transition: "background 0.3s ease, box-shadow 0.35s cubic-bezier(0.22,1,0.36,1)",
      }}
    >
      <motion.div
        animate={{ opacity: hov ? 1 : 0.35 }} transition={{ duration: 0.3 }}
        style={{
          position: "absolute", inset: 0, borderRadius: 50, pointerEvents: "none",
          border: "1px solid transparent",
          backgroundImage: `linear-gradient(135deg, rgba(255,255,255,0.75) 0%, rgba(180,210,255,0.30) 20%, rgba(255,255,255,0.05) 50%, rgba(255,200,240,0.10) 70%, rgba(200,230,255,0.35) 90%, rgba(255,255,255,0.60) 100%)`,
          backgroundOrigin: "border-box",
          WebkitMask: "linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "destination-out",
          maskComposite: "exclude",
        }}
      />
      <div style={{
        position: "absolute", top: 0, left: "10%", right: "10%", height: "50%",
        background: "linear-gradient(180deg, rgba(255,255,255,0.22) 0%, transparent 100%)",
        borderRadius: "50px 50px 50% 50%", pointerEvents: "none",
      }} />
      <motion.div
        animate={{ left: hov ? "160%" : "-60%" }} transition={{ duration: 0.7, ease: "easeInOut" }}
        style={{
          position: "absolute", top: 0, width: "40%", height: "100%",
          background: "linear-gradient(90deg,transparent,rgba(255,255,255,0.40),transparent)",
          pointerEvents: "none",
        }}
      />
      <div style={{ display: "flex", alignItems: "center", gap: 10, position: "relative", zIndex: 2 }}>
        <div style={{
          width: 36, height: 36, borderRadius: "50%",
          background: "linear-gradient(135deg,#8b5cf6,#6d28d9)",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "#fff", fontSize: 12, fontWeight: 700,
          boxShadow: "0 4px 16px rgba(109,40,217,0.35), 0 0 0 0.5px rgba(255,255,255,0.25)",
        }}>AL</div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#2d1f4e" }}>Alex L.</div>
          <div style={{
            fontSize: 10, fontWeight: 700,
            background: "linear-gradient(90deg,#8b5cf6,#60a5fa)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>Pro Plan ✦</div>
        </div>
      </div>
      <motion.button whileHover={{ x: 4 }} whileTap={{ x: 1 }}
        style={{ background: "none", border: "none", cursor: "pointer", fontSize: 16, color: "#9b93b8", position: "relative", zIndex: 2 }}
      >→</motion.button>
    </motion.div>
  );
}

/* ══════ GLASS SIDEBAR ══════ */
function GlassSidebar({ active, onNavigate }) {           // ← ADDED onNavigate prop
  const [hov, setHov] = useState(false);
  return (
    <motion.aside
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      initial={{ x: -44, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.75, type: "spring", stiffness: 90, damping: 18 }}
      style={{
        width: 225, minWidth: 225, zIndex: 20, position: "relative",
        display: "flex", flexDirection: "column", padding: "28px 0 20px",
        margin: "14px 0 14px 14px", borderRadius: 32,
        background: hov ? "rgba(255,255,255,0.28)" : "rgba(255,255,255,0.20)",
        backdropFilter: "blur(48px) saturate(220%) brightness(1.06)",
        WebkitBackdropFilter: "blur(48px) saturate(220%) brightness(1.06)",
        boxShadow: hov
          ? `0 20px 60px rgba(120,80,220,0.10), 0 0 0 0.5px rgba(255,255,255,0.35), inset 0 1px 14px rgba(255,255,255,0.22)`
          : `0 12px 52px rgba(120,80,220,0.06), 0 0 0 0.5px rgba(255,255,255,0.22), inset 0 1px 8px rgba(255,255,255,0.14)`,
        transition: "background 0.35s ease, box-shadow 0.4s cubic-bezier(0.22,1,0.36,1)",
        overflow: "hidden",
      }}
    >
      <motion.div
        animate={{ opacity: hov ? 1 : 0.45 }} transition={{ duration: 0.35 }}
        style={{
          position: "absolute", inset: 0, borderRadius: 32, pointerEvents: "none",
          border: "1.5px solid transparent",
          backgroundImage: `linear-gradient(180deg, rgba(255,255,255,0.70) 0%, rgba(180,210,255,0.30) 15%, rgba(255,255,255,0.06) 35%, rgba(255,200,240,0.08) 55%, rgba(255,255,255,0.04) 70%, rgba(200,230,255,0.25) 88%, rgba(255,255,255,0.55) 100%)`,
          backgroundOrigin: "border-box",
          WebkitMask: "linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "destination-out",
          maskComposite: "exclude",
          zIndex: 10,
        }}
      />
      <div style={{
        position: "absolute", top: 0, left: "8%", right: "8%", height: 80,
        background: "linear-gradient(180deg,rgba(255,255,255,0.24) 0%,transparent 100%)",
        borderRadius: "32px 32px 50% 50%", pointerEvents: "none", zIndex: 1,
      }} />

      <div style={{ padding: "0 24px 34px", position: "relative", zIndex: 2 }}>
        <span style={{ fontSize: 22, fontWeight: 700, color: "#2d1f4e", letterSpacing: "-0.4px" }}>
          Mauve Studio
        </span>
        <span style={{
          fontSize: 22, fontWeight: 700,
          background: "linear-gradient(90deg,#8b5cf6,#60a5fa,#ec4899,#8b5cf6)",
          backgroundSize: "300% auto",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          animation: "shimmer 2.8s linear infinite",
        }}>.</span>
      </div>

      <nav style={{ flex: 1, display: "flex", flexDirection: "column", gap: 3, padding: "0 10px", position: "relative", zIndex: 2 }}>
        {NAV.map((item, i) => (
          <GlassNavItem
            key={item.label}
            item={item}
            isActive={active === item.label}
            onClick={() => onNavigate(item.path)}                     // ← CHANGED: navigate on click
            index={i}
          />
        ))}
      </nav>
      <div style={{ position: "relative", zIndex: 2 }}>
        <GlassUserCard onNavigate={onNavigate} />                     {/* ← ADDED onNavigate */}
      </div>
    </motion.aside>
  );
}

/* ══════ SECTION HEADER ══════ */
function SectionHeader({ title, action }) {
  const [hov, setHov] = useState(false);
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
      <motion.h2
        onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
        whileHover={{ scale: 1.02, x: 3 }}
        style={{
          fontSize: 16, fontWeight: 700, color: "#2d1f4e",
          padding: "6px 16px", borderRadius: 50, cursor: "default",
          background: hov ? "rgba(255,255,255,0.30)" : "rgba(255,255,255,0.12)",
          backdropFilter: hov ? "blur(20px) saturate(160%)" : "blur(12px)",
          WebkitBackdropFilter: hov ? "blur(20px) saturate(160%)" : "blur(12px)",
          boxShadow: hov
            ? "0 4px 18px rgba(120,80,220,0.08), 0 0 0 0.5px rgba(255,255,255,0.35), inset 0 1px 6px rgba(255,255,255,0.22)"
            : "0 0 0 0.5px rgba(255,255,255,0.15)",
          transition: "all 0.3s cubic-bezier(0.22,1,0.36,1)",
          position: "relative", overflow: "hidden",
        }}
      >
        {hov && (
          <div style={{
            position: "absolute", inset: 0, borderRadius: 50, pointerEvents: "none",
            border: "1px solid transparent",
            backgroundImage: `linear-gradient(135deg, rgba(255,255,255,0.65) 0%, rgba(180,210,255,0.25) 30%, rgba(255,255,255,0.04) 60%, rgba(200,230,255,0.30) 90%, rgba(255,255,255,0.50) 100%)`,
            backgroundOrigin: "border-box",
            WebkitMask: "linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)",
            WebkitMaskComposite: "destination-out",
            maskComposite: "exclude",
          }} />
        )}
        <span style={{ position: "relative", zIndex: 2 }}>{title}</span>
      </motion.h2>
      {action}
    </div>
  );
}

/* ══════ GLASS LINK ══════ */
function GlassLink({ children, onClick }) {                           // ← ADDED onClick prop
  const [hov, setHov] = useState(false);
  return (
    <motion.button
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      onClick={onClick}                                               // ← ADDED onClick
      whileHover={{ x: 4, scale: 1.04 }} whileTap={{ scale: 0.95 }}
      style={{
        background: hov ? "rgba(255,255,255,0.32)" : "rgba(255,255,255,0.12)",
        backdropFilter: "blur(20px) saturate(160%)", WebkitBackdropFilter: "blur(20px) saturate(160%)",
        border: "none", cursor: "pointer",
        fontSize: 13, fontWeight: 600, color: "#8b5cf6",
        fontFamily: "'Afacad',sans-serif",
        padding: "6px 16px", borderRadius: 50,
        boxShadow: hov
          ? "0 4px 16px rgba(139,92,246,0.10), 0 0 0 0.5px rgba(255,255,255,0.40), inset 0 1px 6px rgba(255,255,255,0.22)"
          : "0 0 0 0.5px rgba(255,255,255,0.18)",
        position: "relative", overflow: "hidden",
        transition: "background 0.25s ease, box-shadow 0.3s ease",
      }}
    >
      {hov && (
        <div style={{
          position: "absolute", inset: 0, borderRadius: 50, pointerEvents: "none",
          border: "1px solid transparent",
          backgroundImage: `linear-gradient(135deg, rgba(255,255,255,0.70) 0%, rgba(180,210,255,0.25) 30%, rgba(255,255,255,0.05) 55%, rgba(200,230,255,0.30) 85%, rgba(255,255,255,0.55) 100%)`,
          backgroundOrigin: "border-box",
          WebkitMask: "linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "destination-out",
          maskComposite: "exclude",
        }} />
      )}
      {hov && (
        <div style={{
          position: "absolute", top: 0, left: "15%", right: "15%", height: "50%",
          background: "linear-gradient(180deg, rgba(255,255,255,0.25) 0%, transparent 100%)",
          borderRadius: "50px 50px 50% 50%", pointerEvents: "none",
        }} />
      )}
      <span style={{ position: "relative", zIndex: 2 }}>{children}</span>
    </motion.button>
  );
}

/* ══════════════════════════════════════════════
   NEW SPACE MODAL  ← ADDED ENTIRELY NEW COMPONENT
══════════════════════════════════════════════ */
function NewSpaceModal({ onClose, onNavigate }) {
  const [shape,  setShape]  = useState("Rectangle");
  const [width,  setWidth]  = useState("4.5");
  const [height, setHeight] = useState("3.2");
  const [wall,   setWall]   = useState("Soft White (#FEFEFE)");
  const [floor,  setFloor]  = useState("Warm Oak");

  const inputStyle = {
    width: "100%", padding: "14px 18px",
    background: "rgba(255,255,255,0.22)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    border: "1px solid rgba(255,255,255,0.55)",
    borderRadius: 16,
    fontFamily: "'Afacad',sans-serif",
    fontSize: 14, fontWeight: 500, color: "#2d1f4e",
    outline: "none",
    boxShadow: "0 2px 12px rgba(120,80,220,0.06), inset 0 1px 0 rgba(255,255,255,0.8)",
    transition: "border-color 0.2s, box-shadow 0.2s",
  };

  const labelStyle = {
    fontSize: 12, fontWeight: 600,
    color: "#9b93b8", marginBottom: 8,
    letterSpacing: "0.4px", textTransform: "uppercase",
  };

  return (
    /* ── Backdrop: blurred overlay glides in ── */
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 100,
        background: "rgba(100,80,180,0.18)",
        backdropFilter: "blur(18px)",
        WebkitBackdropFilter: "blur(18px)",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}
    >
      {/* ── Modal panel: glides up from below ── */}
      <motion.div
        initial={{ y: 80, opacity: 0, scale: 0.94 }}
        animate={{ y: 0,  opacity: 1, scale: 1 }}
        exit={{ y: 60, opacity: 0, scale: 0.95 }}
        transition={{ type: "spring", stiffness: 220, damping: 24, mass: 0.9 }}
        onClick={(e) => e.stopPropagation()}
        style={{
          width: 820, maxWidth: "92vw",
          borderRadius: 32,
          background: "rgba(230,220,255,0.55)",
          backdropFilter: "blur(48px) saturate(200%) brightness(1.06)",
          WebkitBackdropFilter: "blur(48px) saturate(200%) brightness(1.06)",
          border: "1.5px solid rgba(255,255,255,0.72)",
          boxShadow: "0 40px 100px rgba(109,40,217,0.22), 0 0 0 0.5px rgba(255,255,255,0.4), inset 0 2px 0 rgba(255,255,255,0.85)",
          overflow: "hidden",
          position: "relative",
        }}
      >
        {/* Chromatic glass rim on modal */}
        <div style={{
          position: "absolute", inset: 0, borderRadius: 32, pointerEvents: "none", zIndex: 10,
          border: "1.5px solid transparent",
          backgroundImage: `linear-gradient(135deg,
            rgba(255,255,255,0.82) 0%, rgba(180,210,255,0.40) 18%,
            rgba(255,255,255,0.06) 38%, rgba(255,200,240,0.14) 58%,
            rgba(255,255,255,0.04) 72%, rgba(200,230,255,0.45) 90%,
            rgba(255,255,255,0.72) 100%)`,
          backgroundOrigin: "border-box",
          WebkitMask: "linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "destination-out",
          maskComposite: "exclude",
        }} />

        {/* Top specular */}
        <div style={{
          position: "absolute", top: 0, left: "10%", right: "10%", height: 2,
          background: "linear-gradient(90deg,transparent,rgba(255,255,255,0.9),transparent)",
          pointerEvents: "none", zIndex: 11,
        }} />

        {/* Close button */}
        <motion.button
          onClick={onClose}
          whileHover={{ scale: 1.12, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
          style={{
            position: "absolute", top: 20, right: 20, zIndex: 20,
            width: 32, height: 32, borderRadius: "50%", border: "none",
            background: "rgba(255,255,255,0.45)",
            backdropFilter: "blur(12px)",
            cursor: "pointer", fontSize: 16, color: "#6b5b95",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 4px 14px rgba(0,0,0,0.08), 0 0 0 0.5px rgba(255,255,255,0.6)",
            transition: "background 0.2s",
          }}
        >×</motion.button>

        <div style={{ display: "flex", gap: 0, padding: 0 }}>
          {/* ── LEFT: Canvas preview ── */}
          <div style={{ width: 320, padding: "32px 24px 32px 32px", borderRight: "1px solid rgba(255,255,255,0.4)" }}>
            <div style={{ marginBottom: 6 }}>
              <span style={{ fontSize: 18, fontWeight: 700, color: "#2d1f4e" }}>Mauve Studio</span>
              <span style={{
                fontSize: 18, fontWeight: 700,
                background: "linear-gradient(90deg,#8b5cf6,#60a5fa,#ec4899)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              }}>.</span>
            </div>
            <div style={{ fontSize: 14, color: "#8b5cf6", fontWeight: 600, marginBottom: 20 }}>
              › New Space
            </div>

            {/* Canvas area */}
            <motion.div
              whileHover={{ scale: 1.01 }}
              style={{
                width: "100%", height: 260,
                background: "rgba(255,255,255,0.60)",
                backdropFilter: "blur(16px)",
                border: "1.5px solid rgba(255,255,255,0.80)",
                borderRadius: 18,
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "crosshair",
                boxShadow: "0 8px 32px rgba(120,80,220,0.08), inset 0 1px 0 rgba(255,255,255,0.9)",
                position: "relative", overflow: "hidden",
              }}
            >
              <div style={{ position: "absolute", inset: 0,
                backgroundImage: "linear-gradient(rgba(139,92,246,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(139,92,246,0.04) 1px,transparent 1px)",
                backgroundSize: "24px 24px"
              }} />
              <div style={{ fontSize: 28, color: "rgba(139,92,246,0.35)", fontWeight: 300 }}>+</div>
            </motion.div>
          </div>

          {/* ── RIGHT: Form fields ── */}
          <div style={{ flex: 1, padding: "32px 32px 28px 28px", display: "flex", flexDirection: "column", gap: 20 }}>

            {/* Space shape */}
            <div>
              <div style={labelStyle}>Space shape</div>
              <select
                value={shape} onChange={(e) => setShape(e.target.value)}
                style={{ ...inputStyle, cursor: "pointer", appearance: "none" }}
              >
                <option>Rectangle</option>
                <option>L-Shape</option>
                <option>Square</option>
                <option>Open Plan</option>
              </select>
            </div>

            {/* Width + Height */}
            <div style={{ display: "flex", gap: 14 }}>
              <div style={{ flex: 1 }}>
                <div style={labelStyle}>Space width</div>
                <input
                  value={`${width} m`}
                  onChange={(e) => setWidth(e.target.value.replace(" m", ""))}
                  style={inputStyle}
                />
              </div>
              <div style={{ flex: 1 }}>
                <div style={labelStyle}>Space height</div>
                <input
                  value={`${height} m`}
                  onChange={(e) => setHeight(e.target.value.replace(" m", ""))}
                  style={inputStyle}
                />
              </div>
            </div>

            {/* Wall colour */}
            <div>
              <div style={labelStyle}>Wall colour</div>
              <input value={wall} onChange={(e) => setWall(e.target.value)} style={inputStyle} />
            </div>

            {/* Floor colour */}
            <div>
              <div style={labelStyle}>Floor colour</div>
              <input value={floor} onChange={(e) => setFloor(e.target.value)} style={inputStyle} />
            </div>

            {/* Create button */}
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 4 }}>
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.94, y: 2 }}
                onClick={() => { onClose(); onNavigate("/editor"); }}  // ← goes to editor after create
                style={{
                  padding: "13px 32px", borderRadius: 50, border: "none",
                  fontFamily: "'Afacad',sans-serif", fontSize: 14, fontWeight: 700,
                  color: "#fff", cursor: "pointer",
                  background: "linear-gradient(135deg,#8b5cf6 0%,#6d28d9 100%)",
                  boxShadow: "0 10px 32px rgba(109,40,217,0.42), inset 0 1px 0 rgba(255,255,255,0.22)",
                  display: "flex", alignItems: "center", gap: 8,
                  position: "relative", overflow: "hidden",
                }}
              >
                <div style={{
                  position: "absolute", top: 0, left: "15%", right: "15%", height: "50%",
                  background: "linear-gradient(180deg, rgba(255,255,255,0.20) 0%, transparent 100%)",
                  borderRadius: "50px 50px 50% 50%", pointerEvents: "none",
                }} />
                <span style={{ fontSize: 18 }}>+</span>
                <span style={{ position: "relative", zIndex: 2 }}>Create</span>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
/* ══════ END NEW SPACE MODAL ══════ */


/* ══════ WELCOME HEADER ══════ */
function WelcomeHeader({ onOpenModal }) {                             // ← ADDED onOpenModal prop
  return (
    <motion.div
      initial={{ y: -16, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.1, duration: 0.5, type: "spring", stiffness: 110, damping: 18 }}
      style={{
        display: "flex", alignItems: "flex-start", justifyContent: "space-between",
        marginBottom: 32, padding: "24px 28px 24px 8px",
      }}
    >
      <div>
        <h1 style={{ fontSize: 36, fontWeight: 700, color: "#1e1040", lineHeight: 1.2, marginBottom: 7 }}>
          Welcome back,{" "}
          <span style={{
            background: "linear-gradient(90deg,#8b5cf6,#ec4899,#60a5fa,#8b5cf6)",
            backgroundSize: "300% auto",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            animation: "shimmer 3s linear infinite",
          }}>Dinithi!</span>
        </h1>
        <p style={{ color: "#9b93b8", fontSize: 14, fontWeight: 500 }}>
          Ready to design your dream space today? ✨
        </p>
      </div>
      <div style={{ display: "flex", gap: 12, marginTop: 6 }}>
        <GlassButton variant="secondary">Browse Templates</GlassButton>
        <GlassButton variant="primary" onClick={onOpenModal}>        {/* ← ADDED onClick */}
          <span style={{ fontSize: 19, lineHeight: 1 }}>+</span> New Space
        </GlassButton>
      </div>
    </motion.div>
  );
}

/* ══════ MAIN HOME SCREEN ══════ */
export default function HomeScreen() {
  const router = useRouter();                                         // ← ADDED
  const [active, setActive] = useState("Home");
  const [showModal, setShowModal] = useState(false);                  // ← ADDED

  /* Navigate helper — updates active nav highlight + pushes route */
  const onNavigate = (path) => {                                      // ← ADDED
    const label = NAV.find(n => n.path === path)?.label || "Home";
    setActive(label);
    router.push(path);
  };

  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Afacad:ital,wght@0,400;0,500;0,600;0,700&display=swap');
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
    @keyframes shimmer{0%{background-position:-300% center}100%{background-position:300% center}}
    @keyframes floatA{0%,100%{transform:translateY(0) scale(1)}50%{transform:translateY(-22px) scale(1.05)}}
    @keyframes floatB{0%,100%{transform:translateY(0)}50%{transform:translateY(16px)}}
    ::-webkit-scrollbar{width:5px}
    ::-webkit-scrollbar-track{background:transparent}
    ::-webkit-scrollbar-thumb{background:rgba(196,176,240,0.5);border-radius:3px}
  `;

  return (
    <div style={{
      display: "flex", height: "100vh",
      fontFamily: "'Afacad','Helvetica Neue',sans-serif",
      background: "linear-gradient(135deg,#f0eaff 0%,#e8f4ff 50%,#f0e8ff 100%)",
      overflow: "hidden", position: "relative",
    }}>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <GlassFilter />

      <AnalyticsWidget />

      {/* Background orbs */}
      <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "-12%", left: "-8%", width: 520, height: 520, borderRadius: "50%",
          background: "radial-gradient(circle,rgba(167,139,250,0.28) 0%,transparent 68%)", animation: "floatA 8s ease-in-out infinite" }} />
        <div style={{ position: "absolute", bottom: "0", right: "-6%", width: 440, height: 440, borderRadius: "50%",
          background: "radial-gradient(circle,rgba(96,165,250,0.22) 0%,transparent 68%)", animation: "floatB 10s ease-in-out infinite" }} />
        <div style={{ position: "absolute", top: "38%", left: "28%", width: 340, height: 340, borderRadius: "50%",
          background: "radial-gradient(circle,rgba(244,114,182,0.14) 0%,transparent 68%)", animation: "floatA 12s ease-in-out infinite 2s" }} />
        <div style={{ position: "absolute", inset: 0,
          backgroundImage: "linear-gradient(rgba(139,92,246,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(139,92,246,0.03) 1px,transparent 1px)",
          backgroundSize: "44px 44px" }} />
      </div>

      <GlassSidebar active={active} setActive={setActive} onNavigate={onNavigate} />  {/* ← ADDED onNavigate */}

      <motion.main
        initial={{ y: -22, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.65, delay: 0.1, type: "spring", stiffness: 90, damping: 18 }}
        style={{ flex: 1, overflowY: "auto", padding: "14px 28px 28px 18px", position: "relative", zIndex: 10 }}
      >
        <WelcomeHeader onOpenModal={() => setShowModal(true)} />      {/* ← ADDED onOpenModal */}

        <section style={{ marginBottom: 32 }}>
          <SectionHeader
            title="Recent Spaces"
            action={<GlassLink onClick={() => onNavigate("/projects")}>View all →</GlassLink>} 
          />
          <div style={{ display: "flex", gap: 16 }}>
            {RECENT.map((p, i) => <ProjectCard key={p.id} p={p} delay={300 + i * 90} />)}
          </div>
        </section>

        <section style={{ marginBottom: 32 }}>
          <SectionHeader title="Start with a Template" />
          <div style={{ display: "flex", gap: 16 }}>
            {TEMPLATES.map((t, i) => <TemplateCard key={t.id} t={t} delay={500 + i * 90} onNavigate={onNavigate} />)}
          </div>
        </section>

        <section>
          <SectionHeader title="Quick Tips" />
          <div style={{ display: "flex", gap: 16 }}>
            {TIPS.map((tip, i) => <TipCard key={tip.title} tip={tip} delay={700 + i * 90} />)}
          </div>
        </section>
      </motion.main>

      {/* ── New Space Modal (AnimatePresence = glide in/out) ── */}   {/* ← ADDED */}
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