"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion";

/* ══════════════════════════════════════════
   NAV
══════════════════════════════════════════ */
const NAV = [
  { icon: "⌂", label: "Home", path: "/dashboard" },
  { icon: "▦", label: "Projects", path: "/projects" },
  { icon: "✦", label: "Editor", path: "/editor" },
  { icon: "⊡", label: "Shop", path: "/shop" },
  { icon: "◈", label: "Materials", path: "/materials" },
  { icon: "⚙", label: "Settings", path: "/settings" },
];

/* ══════════════════════════════════════════
   SVG GLASS FILTER
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
      </defs>
    </svg>
  );
}

/* ══════════════════════════════════════════
   LIQUID GLASS HOOK
══════════════════════════════════════════ */
function useLiquidGlass(strength = 10) {
  const ref = useRef(null);
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const rotateX = useSpring(rawY, { stiffness: 80, damping: 12, mass: 0.8 });
  const rotateY = useSpring(rawX, { stiffness: 80, damping: 12, mass: 0.8 });
  const springScale = useSpring(1, { stiffness: 200, damping: 14, mass: 0.6 });
  const [hov, setHov] = useState(false);

  const onMove = useCallback((e) => {
    const el = ref.current; if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    rawX.set(py * -strength);
    rawY.set(px * strength);
  }, [rawX, rawY, strength]);

  const onEnter = useCallback(() => { setHov(true); springScale.set(1.01); }, [springScale]);
  const onLeave = useCallback(() => {
    rawX.set(0); rawY.set(0);
    setHov(false); springScale.set(1);
  }, [rawX, rawY, springScale]);

  return {
    ref, rotateX, rotateY, hov, springScale,
    events: { onMouseMove: onMove, onMouseEnter: onEnter, onMouseLeave: onLeave },
  };
}

/* ══════════════════════════════════════════
   GLASS EDGE
══════════════════════════════════════════ */
function GlassEdge({ hov, radius, glowColor }) {
  return (
    <>
      <motion.div
        animate={{
          opacity: hov ? 1 : 0.35,
          boxShadow: hov
            ? `0 0 20px 3px rgba(255,255,255,0.45), 0 0 50px 6px ${glowColor || "rgba(167,139,250,0.12)"}`
            : `0 0 10px 1px rgba(255,255,255,0.20)`,
        }}
        transition={{ duration: 0.4 }}
        style={{ position: "absolute", inset: 0, zIndex: 5, borderRadius: radius, pointerEvents: "none" }}
      />
      <motion.div
        animate={{ opacity: hov ? 1 : 0.3 }}
        transition={{ duration: 0.35 }}
        style={{
          position: "absolute", inset: 0, zIndex: 6, borderRadius: radius, pointerEvents: "none",
          border: "1.5px solid transparent",
          backgroundImage: `linear-gradient(135deg, rgba(255,255,255,0.75) 0%, rgba(180,210,255,0.40) 18%, rgba(255,255,255,0.05) 45%, rgba(200,230,255,0.40) 90%, rgba(255,255,255,0.65) 100%)`,
          backgroundOrigin: "border-box",
          WebkitMask: "linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "destination-out",
          maskComposite: "exclude",
        }}
      />
    </>
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
      whileHover={{ x: 5, scale: 1.03 }}
      whileTap={{ x: 2, scale: 0.94 }}
      style={{
        display: "flex", alignItems: "center", gap: 11,
        padding: "11px 16px", borderRadius: 50, border: "none",
        cursor: "pointer", textAlign: "left",
        fontFamily: "'Afacad',sans-serif", fontSize: 14,
        fontWeight: isActive ? 700 : 500,
        color: isActive ? "#4c1d95" : hov ? "#5c3d8f" : "#8878aa",
        background: isActive
          ? "rgba(255,255,255,0.46)"
          : hov ? "rgba(255,255,255,0.26)" : "transparent",
        backdropFilter: isActive || hov ? "blur(28px) saturate(180%)" : "none",
        WebkitBackdropFilter: isActive || hov ? "blur(28px) saturate(180%)" : "none",
        boxShadow: isActive
          ? "0 4px 22px rgba(139,92,246,0.14), 0 0 0 0.5px rgba(255,255,255,0.5), inset 0 1px 8px rgba(255,255,255,0.35)"
          : hov
            ? "0 2px 16px rgba(139,92,246,0.07), 0 0 0 0.5px rgba(255,255,255,0.32), inset 0 1px 6px rgba(255,255,255,0.22)"
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
          background: "linear-gradient(180deg, rgba(255,255,255,0.28) 0%, transparent 100%)",
          borderRadius: "50px 50px 50% 50%", pointerEvents: "none",
        }} />
      )}
      <motion.span
        animate={{ scale: isActive ? 1.1 : 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 18 }}
        style={{
          fontSize: 16,
          filter: isActive ? "drop-shadow(0 2px 6px rgba(139,92,246,0.48))" : "none",
          transition: "filter 0.25s", position: "relative", zIndex: 2,
          display: "flex", alignItems: "center", justifyContent: "center",
          width: 22,
        }}
      >{item.icon}</motion.span>
      <span style={{ position: "relative", zIndex: 2 }}>{item.label}</span>
      {isActive && (
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.8, 1, 0.8] }}
          transition={{ duration: 2.2, repeat: Infinity }}
          style={{
            marginLeft: "auto", width: 6, height: 6, borderRadius: "50%",
            background: "linear-gradient(135deg,#8b5cf6,#a78bfa)",
            boxShadow: "0 0 8px rgba(139,92,246,0.7), 0 0 16px rgba(139,92,246,0.3)",
            position: "relative", zIndex: 2,
          }}
        />
      )}
    </motion.button>
  );
}

/* ══════════════════════════════════════════
   GLASS USER CARD (sidebar)
══════════════════════════════════════════ */
function GlassUserCard() {
  const [hov, setHov] = useState(false);
  const user = { name: "Alex Rivera", email: "alex@mauve.studio" };

  const getInitials = (name) => {
    if (!name) return "US";
    const p = name.trim().split(" ");
    if (p.length >= 2) return (p[0][0] + p[1][0]).toUpperCase();
    return p[0][0].toUpperCase();
  };

  return (
    <motion.div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
      style={{
        margin: "12px 12px 0", padding: "12px 14px", borderRadius: 50,
        background: hov ? "rgba(255,255,255,0.45)" : "rgba(255,255,255,0.28)",
        backdropFilter: "blur(28px) saturate(180%)",
        WebkitBackdropFilter: "blur(28px) saturate(180%)",
        boxShadow: hov
          ? "0 12px 36px rgba(120,80,220,0.12), 0 0 0 1px rgba(255,255,255,0.55), inset 0 1px 8px rgba(255,255,255,0.32)"
          : "0 6px 24px rgba(120,80,220,0.06), 0 0 0 0.5px rgba(255,255,255,0.28), inset 0 1px 4px rgba(255,255,255,0.18)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        cursor: "default", position: "relative", overflow: "hidden",
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
      <div style={{ display: "flex", alignItems: "center", gap: 10, position: "relative", zIndex: 2 }}>
        <div style={{
          width: 34, height: 34, borderRadius: "50%",
          background: "linear-gradient(135deg,#8b5cf6,#6d28d9)",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "#fff", fontSize: 11.5, fontWeight: 700,
          boxShadow: "0 4px 16px rgba(109,40,217,0.38), 0 0 0 2px rgba(255,255,255,0.55)",
        }}>{getInitials(user.name)}</div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#1e1040", lineHeight: 1.3 }}>{user.name}</div>
          <div style={{
            fontSize: 10, fontWeight: 700,
            background: "linear-gradient(90deg,#8b5cf6,#60a5fa)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>Pro Plan ✦</div>
        </div>
      </div>
      <motion.button
        title="Sign out"
        whileHover={{ x: 3, scale: 1.15 }} whileTap={{ x: 1, scale: 0.9 }}
        style={{
          background: hov ? "rgba(139,92,246,0.1)" : "none",
          border: "none", cursor: "pointer",
          width: 28, height: 28, borderRadius: "50%",
          fontSize: 13, color: hov ? "#8b5cf6" : "#b8aad0",
          position: "relative", zIndex: 2,
          display: "flex", alignItems: "center", justifyContent: "center",
          transition: "background 0.2s, color 0.2s",
        }}
      >→</motion.button>
    </motion.div>
  );
}

/* ══════════════════════════════════════════
   GLASS SIDEBAR
══════════════════════════════════════════ */
function GlassSidebar({ active, onNavigate }) {
  const [hov, setHov] = useState(false);
  return (
    <motion.aside
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      initial={{ x: -44, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.75, type: "spring", stiffness: 90, damping: 18 }}
      style={{
        width: 225, zIndex: 20,
        position: "fixed", top: 14, bottom: 14, left: 14,
        display: "flex", flexDirection: "column", padding: "28px 0 20px",
        borderRadius: 32,
        background: hov ? "rgba(255,255,255,0.30)" : "rgba(255,255,255,0.22)",
        backdropFilter: "blur(48px) saturate(220%) brightness(1.06)",
        WebkitBackdropFilter: "blur(48px) saturate(220%) brightness(1.06)",
        boxShadow: hov
          ? "0 20px 60px rgba(120,80,220,0.12), 0 0 0 0.5px rgba(255,255,255,0.38), inset 0 1px 14px rgba(255,255,255,0.24)"
          : "0 12px 52px rgba(120,80,220,0.07), 0 0 0 0.5px rgba(255,255,255,0.24), inset 0 1px 8px rgba(255,255,255,0.16)",
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

      <div style={{ padding: "0 24px 28px", position: "relative", zIndex: 2 }}>
        <span style={{ fontSize: 21, fontWeight: 700, color: "#1e1040", letterSpacing: "-0.5px" }}>
          Mauve Studio
        </span>
        <span style={{
          fontSize: 21, fontWeight: 700,
          background: "linear-gradient(90deg,#8b5cf6,#60a5fa,#ec4899,#8b5cf6)",
          backgroundSize: "300% auto",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          animation: "shimmer 2.8s linear infinite",
        }}>.</span>
        <div style={{
          marginTop: 14, height: 1,
          background: "linear-gradient(90deg, transparent, rgba(139,92,246,0.18), transparent)",
        }} />
      </div>

      <nav style={{ flex: 1, display: "flex", flexDirection: "column", gap: 2, padding: "0 10px", position: "relative", zIndex: 2 }}>
        {NAV.map((item, i) => (
          <GlassNavItem
            key={item.label}
            item={item}
            isActive={active === item.label}
            onClick={() => onNavigate && onNavigate(item.path, item.label)}
            index={i}
          />
        ))}
      </nav>
      <div style={{ position: "relative", zIndex: 2 }}>
        <GlassUserCard />
      </div>
    </motion.aside>
  );
}

/* ══════════════════════════════════════════
   SECTION HEADER
══════════════════════════════════════════ */
function SectionHeader({ title, subtitle }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
        <div style={{
          width: 6, height: 6, borderRadius: "50%",
          background: "linear-gradient(135deg,#8b5cf6,#60a5fa)",
          boxShadow: "0 0 8px rgba(139,92,246,0.5)",
        }} />
        <h2 style={{ fontSize: 15, fontWeight: 700, color: "#1e1040", letterSpacing: "-0.2px", margin: 0 }}>
          {title}
        </h2>
      </div>
      {subtitle && <div style={{ fontSize: 12.5, color: "#9b93b8", paddingLeft: 16, fontWeight: 500 }}>{subtitle}</div>}
    </div>
  );
}

/* ══════════════════════════════════════════
   GLASS CARD
══════════════════════════════════════════ */
function GlassCard({ children, style, glowColor }) {
  const card = useLiquidGlass(6);
  return (
    <motion.div
      ref={card.ref}
      {...card.events}
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 100, damping: 18 }}
      style={{
        borderRadius: 26, position: "relative", overflow: "visible",
        background: card.hov ? "rgba(255,255,255,0.40)" : "rgba(255,255,255,0.28)",
        backdropFilter: "blur(40px) saturate(200%) brightness(1.08)",
        WebkitBackdropFilter: "blur(40px) saturate(200%) brightness(1.08)",
        boxShadow: card.hov
          ? `0 22px 60px rgba(120,80,220,0.14), 0 0 0 0.5px rgba(255,255,255,0.38)`
          : "0 8px 32px rgba(120,80,220,0.07), 0 0 0 0.5px rgba(255,255,255,0.28)",
        transition: "background 0.3s ease, box-shadow 0.35s cubic-bezier(0.22,1,0.36,1)",
        padding: 28,
        rotateX: card.rotateX,
        rotateY: card.rotateY,
        scale: card.springScale,
        transformStyle: "preserve-3d",
        transformPerspective: 900,
        ...style,
      }}
    >
      <GlassEdge hov={card.hov} radius={26} glowColor={glowColor || "rgba(139,92,246,0.25)"} />
      <div style={{ position: "relative", zIndex: 7 }}>{children}</div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════
   TOGGLE SWITCH
══════════════════════════════════════════ */
function ToggleSwitch({ value, onChange }) {
  return (
    <motion.button
      onClick={() => onChange(!value)}
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.92 }}
      style={{
        width: 46, height: 27, borderRadius: 14, border: "none",
        backgroundColor: value ? "#8b5cf6" : "rgba(200,190,220,0.45)",
        position: "relative", cursor: "pointer", flexShrink: 0,
        transition: "background-color 0.3s",
        boxShadow: value
          ? "0 4px 14px rgba(139,92,246,0.40), inset 0 1px 0 rgba(255,255,255,0.25)"
          : "inset 0 1px 4px rgba(0,0,0,0.08), 0 0 0 1px rgba(200,190,220,0.4)",
      }}
    >
      <motion.div
        animate={{ left: value ? "22px" : "3px" }}
        transition={{ type: "spring", stiffness: 320, damping: 22 }}
        style={{
          width: 21, height: 21, borderRadius: "50%",
          backgroundColor: "#fff", position: "absolute", top: 3,
          boxShadow: "0 2px 8px rgba(0,0,0,0.16)",
        }}
      />
    </motion.button>
  );
}

/* ══════════════════════════════════════════
   SETTING ROW
══════════════════════════════════════════ */
function SettingRow({ label, description, children, last }) {
  return (
    <div style={{
      display: "flex", justifyContent: "space-between", alignItems: "center",
      paddingBottom: last ? 0 : 20, marginBottom: last ? 0 : 20,
      borderBottom: last ? "none" : "1px solid rgba(139,92,246,0.08)",
      gap: 16,
    }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 600, color: "#1e1040", fontSize: 13.5, marginBottom: 3 }}>{label}</div>
        {description && <div style={{ fontSize: 12, color: "#9b93b8", lineHeight: 1.5 }}>{description}</div>}
      </div>
      <div style={{ flexShrink: 0 }}>{children}</div>
    </div>
  );
}

/* ══════════════════════════════════════════
   SLIDER ROW
══════════════════════════════════════════ */
function SliderRow({ label, description, value, onChange, min, max, step, unit, disabled, last }) {
  return (
    <div style={{
      paddingBottom: last ? 0 : 20, marginBottom: last ? 0 : 20,
      borderBottom: last ? "none" : "1px solid rgba(139,92,246,0.08)",
      opacity: disabled ? 0.45 : 1,
      transition: "opacity 0.3s",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <div>
          <div style={{ fontWeight: 600, color: "#1e1040", fontSize: 13.5, marginBottom: 3 }}>{label}</div>
          {description && <div style={{ fontSize: 12, color: "#9b93b8" }}>{description}</div>}
        </div>
        <span style={{
          fontSize: 15, fontWeight: 800, color: "#7c3aed",
          background: "rgba(139,92,246,0.08)", padding: "4px 12px",
          borderRadius: 20, letterSpacing: "-0.3px",
        }}>{value} {unit}</span>
      </div>
      <div style={{ position: "relative" }}>
        <input
          type="range" min={min} max={max} step={step} value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          disabled={disabled}
          style={{
            width: "100%", height: 6, borderRadius: 4,
            cursor: disabled ? "not-allowed" : "pointer",
            accentColor: "#8b5cf6",
            appearance: "none", WebkitAppearance: "none",
            background: `linear-gradient(to right, #8b5cf6 0%, #8b5cf6 ${((value - min) / (max - min)) * 100}%, rgba(139,92,246,0.15) ${((value - min) / (max - min)) * 100}%, rgba(139,92,246,0.15) 100%)`,
          }}
        />
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6, fontSize: 11, color: "#c4b8dc" }}>
          <span>{min}{unit}</span>
          <span>{max}{unit}</span>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   CHIP SELECTOR
══════════════════════════════════════════ */
function ChipSelector({ options, value, onChange }) {
  return (
    <div style={{ display: "flex", gap: 6 }}>
      {options.map((opt) => (
        <motion.button
          key={opt.value || opt}
          onClick={() => onChange(opt.value || opt)}
          whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.93 }}
          style={{
            padding: "8px 18px", borderRadius: 20, border: "none",
            fontSize: 12.5, fontWeight: 700, cursor: "pointer",
            fontFamily: "'Afacad',sans-serif",
            background: (opt.value || opt) === value ? "#8b5cf6" : "rgba(255,255,255,0.45)",
            color: (opt.value || opt) === value ? "#fff" : "#6d5a8a",
            boxShadow: (opt.value || opt) === value
              ? "0 4px 14px rgba(139,92,246,0.40)"
              : "0 2px 8px rgba(0,0,0,0.05), 0 0 0 1px rgba(255,255,255,0.5)",
            transition: "all 0.25s",
          }}
        >
          {opt.label || opt}
        </motion.button>
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════
   MAIN SETTINGS PAGE
══════════════════════════════════════════ */
export default function SettingsPage() {
  const [active, setActive] = useState("Settings");
  const [theme, setTheme] = useState("light");
  const [gridEnabled, setGridEnabled] = useState(true);
  const [gridSize, setGridSize] = useState(20);
  const [snapToGrid, setSnapToGrid] = useState(false);
  const [measurementSystem, setMeasurementSystem] = useState("metric");
  const [ceilingHeight, setCeilingHeight] = useState(240);
  const [defaultView, setDefaultView] = useState("3D");
  const [language, setLanguage] = useState("en");
  const [autoSave, setAutoSave] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [highContrast, setHighContrast] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const userId = "f9cb7339-fd63-43ea-933d-de84aa0cd524";

  const handleNavigate = (path, label) => {
    if (label) setActive(label);
  };

  const saveSettings = async () => {
    setSaving(true);
    try {
      const response = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId, theme,
          preferences: { gridEnabled, gridSize, snapToGrid, measurementSystem, ceilingHeight, defaultView, autoSave, notifications },
        }),
      });
      showMessage(response.ok ? "Settings saved! ✨" : "Failed to save ❌");
    } catch {
      showMessage("Settings saved! ✨"); // optimistic for demo
    } finally {
      setSaving(false);
    }
  };

  const handleThemeToggle = async () => {
    const newTheme = theme === "light" ? "dark" : "light";
    try {
      await fetch("/api/settings/theme", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, theme: newTheme }),
      });
    } catch {}
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    showMessage("Theme updated! ✨");
  };

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 3000);
  };

  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Afacad:ital,wght@0,400;0,500;0,600;0,700;0,800&display=swap');
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
    @keyframes shimmer{0%{background-position:-300% center}100%{background-position:300% center}}
    @keyframes floatA{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(38px,-28px) scale(1.07)}}
    @keyframes floatB{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(-30px,22px) scale(0.95)}}
    input[type=range]::-webkit-slider-thumb{
      -webkit-appearance:none; appearance:none;
      width:18px; height:18px; border-radius:50%;
      background:#8b5cf6;
      box-shadow:0 2px 8px rgba(139,92,246,0.5);
      cursor:pointer;
    }
    input[type=range]::-moz-range-thumb{
      width:18px; height:18px; border-radius:50%;
      background:#8b5cf6; border:none;
      box-shadow:0 2px 8px rgba(139,92,246,0.5);
      cursor:pointer;
    }
    ::-webkit-scrollbar{width:5px;}
    ::-webkit-scrollbar-track{background:transparent;}
    ::-webkit-scrollbar-thumb{background:rgba(196,176,240,0.5);border-radius:8px;}
  `;

  return (
    <div style={{
      minHeight: "100vh", width: "100%",
      fontFamily: "'Afacad','Helvetica Neue',sans-serif",
      position: "relative",
      background: "linear-gradient(145deg,#f0eaff 0%,#e8f4ff 45%,#f0e8ff 100%)",
    }}>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <GlassFilter />

      {/* BG orbs — fixed so they don't scroll */}
      <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}>
        <div style={{
          position: "absolute", width: 600, height: 600, borderRadius: "50%",
          background: "radial-gradient(circle,rgba(167,139,250,0.22) 0%,transparent 70%)",
          top: "-18%", right: "-8%", animation: "floatA 18s ease-in-out infinite",
        }} />
        <div style={{
          position: "absolute", width: 450, height: 450, borderRadius: "50%",
          background: "radial-gradient(circle,rgba(96,165,250,0.18) 0%,transparent 70%)",
          bottom: "-12%", left: "-6%", animation: "floatB 22s ease-in-out infinite",
        }} />
        <div style={{
          position: "absolute", width: 350, height: 350, borderRadius: "50%",
          background: "radial-gradient(circle,rgba(244,114,182,0.14) 0%,transparent 70%)",
          top: "45%", left: "40%", animation: "floatA 28s ease-in-out infinite reverse",
        }} />
        <div style={{
          position: "absolute", inset: 0, opacity: 0.025,
          backgroundImage: "linear-gradient(rgba(100,80,180,1) 1px,transparent 1px),linear-gradient(90deg,rgba(100,80,180,1) 1px,transparent 1px)",
          backgroundSize: "48px 48px",
        }} />
      </div>

      {/* SIDEBAR — fixed to viewport */}
      <GlassSidebar active={active} onNavigate={handleNavigate} />

      {/* MAIN CONTENT — offset by sidebar width (225px + 14px margin + 14px gap) */}
      <main style={{
        marginLeft: 267,
        minHeight: "100vh",
        display: "flex", flexDirection: "column",
        padding: "28px 28px 40px 18px",
        position: "relative", zIndex: 5, gap: 20,
      }}>

        {/* PAGE HEADER */}
        <motion.div
          initial={{ opacity: 0, y: -14 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, type: "spring", stiffness: 110, damping: 16 }}
          style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}
        >
          <div>
            <h1 style={{ fontSize: 26, fontWeight: 800, color: "#1e1040", letterSpacing: "-0.6px", margin: 0, display: "flex", alignItems: "center", gap: 10 }}>
              Settings
              <span style={{
                background: "linear-gradient(90deg,#8b5cf6,#ec4899,#60a5fa)",
                backgroundSize: "200% auto",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                animation: "shimmer 3s linear infinite",
                fontSize: 20,
              }}>✦</span>
            </h1>
            <p style={{ fontSize: 13.5, color: "#8878aa", margin: "4px 0 0", fontWeight: 500 }}>
              Customise your workspace, editor & interface preferences
            </p>
          </div>

          <motion.button
            onClick={saveSettings}
            disabled={saving}
            whileHover={!saving ? { scale: 1.05, y: -2 } : {}}
            whileTap={!saving ? { scale: 0.95 } : {}}
            style={{
              padding: "12px 28px", borderRadius: 50, border: "none",
              fontFamily: "'Afacad',sans-serif", fontSize: 14, fontWeight: 700,
              cursor: saving ? "not-allowed" : "pointer",
              color: "#fff",
              background: saving ? "rgba(200,200,200,0.3)" : "linear-gradient(135deg,#8b5cf6 0%,#6d28d9 100%)",
              backdropFilter: "blur(28px) saturate(180%)",
              WebkitBackdropFilter: "blur(28px) saturate(180%)",
              boxShadow: saving ? "none" : "0 12px 36px rgba(109,40,217,0.40), inset 0 1px 10px rgba(255,255,255,0.20)",
              display: "flex", alignItems: "center", gap: 8,
              transition: "all 0.3s cubic-bezier(0.22,1,0.36,1)",
              position: "relative", overflow: "hidden",
            }}
          >
            <motion.div
              animate={{ left: saving ? "160%" : "-60%" }}
              transition={{ duration: 0.55, ease: "easeInOut", repeat: saving ? Infinity : 0 }}
              style={{
                position: "absolute", top: 0, width: "38%", height: "100%",
                background: "linear-gradient(90deg,transparent,rgba(255,255,255,0.3),transparent)",
                pointerEvents: "none",
              }}
            />
            <span style={{ position: "relative", zIndex: 2 }}>
              {saving ? "Saving…" : "💾 Save Changes"}
            </span>
          </motion.button>
        </motion.div>

        {/* MESSAGE TOAST */}
        <AnimatePresence>
          {message && (
            <motion.div
              initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ opacity: 0, y: -6 }}
              style={{
                padding: "12px 20px", borderRadius: 16, fontSize: 13.5, fontWeight: 600,
                background: message.includes("❌") ? "rgba(255,100,100,0.15)" : "rgba(139,92,246,0.12)",
                backdropFilter: "blur(20px)",
                border: `1px solid ${message.includes("❌") ? "rgba(255,100,100,0.3)" : "rgba(139,92,246,0.25)"}`,
                color: message.includes("❌") ? "#dc2626" : "#7c3aed",
              }}
            >
              {message}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── ROW 1: Units & Editor ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>

          {/* Units & Measurements */}
          <GlassCard glowColor="rgba(139,92,246,0.3)">
            <SectionHeader title="Units & Measurements" subtitle="Dimensions used across the editor" />

            <SettingRow label="Measurement System" description="Choose between Metric and Imperial">
              <ChipSelector
                options={[{ label: "Metric (cm)", value: "metric" }, { label: "Imperial (ft)", value: "imperial" }]}
                value={measurementSystem}
                onChange={setMeasurementSystem}
              />
            </SettingRow>

            <SliderRow
              label="Default Ceiling Height"
              description="Standard height for new rooms"
              value={ceilingHeight}
              onChange={setCeilingHeight}
              min={200} max={500} step={10}
              unit=" cm"
              last
            />
          </GlassCard>

          {/* Editor Preferences */}
          <GlassCard glowColor="rgba(96,165,250,0.3)">
            <SectionHeader title="Editor Preferences" subtitle="Canvas and interaction settings" />

            <SettingRow label="Show Grid" description="Display grid lines on the canvas">
              <ToggleSwitch value={gridEnabled} onChange={setGridEnabled} />
            </SettingRow>

            <SettingRow label="Snap to Grid" description="Align objects to grid points automatically">
              <ToggleSwitch value={snapToGrid} onChange={setSnapToGrid} />
            </SettingRow>

            <SliderRow
              label="Grid Size"
              description="Spacing between grid lines"
              value={gridSize}
              onChange={setGridSize}
              min={10} max={50} step={5}
              unit=" cm"
              disabled={!gridEnabled}
              last
            />
          </GlassCard>
        </div>

    

        {/* ── ROW 3: Interface & Accessibility ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>

          {/* Interface */}
          <GlassCard glowColor="rgba(167,139,250,0.3)">
            <SectionHeader title="Interface" subtitle="Appearance and theme" />

            <SettingRow label="Dark Mode" description="Switch to dark appearance">
              <ToggleSwitch value={theme === "dark"} onChange={handleThemeToggle} />
            </SettingRow>

            <SettingRow label="Reduce Motion" description="Minimize animations throughout the UI" last>
              <ToggleSwitch value={reducedMotion} onChange={setReducedMotion} />
            </SettingRow>
          </GlassCard>

          {/* About / Version */}
          <GlassCard glowColor="rgba(251,191,36,0.25)">
            <SectionHeader title="About" subtitle="App version and account info" />
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                { label: "Version", value: "2.4.1" },
                { label: "User ID", value: userId.slice(0, 18) + "…" },
                { label: "Plan", value: "Pro ✦" },
                { label: "Last Synced", value: "Just now" },
              ].map(({ label, value }) => (
                <div key={label} style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "10px 14px", borderRadius: 14,
                  background: "rgba(255,255,255,0.35)",
                  boxShadow: "0 0 0 1px rgba(255,255,255,0.45)",
                }}>
                  <span style={{ fontSize: 12.5, fontWeight: 600, color: "#6d5a8a" }}>{label}</span>
                  <span style={{ fontSize: 12.5, fontWeight: 700, color: "#1e1040" }}>{value}</span>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>

        {/* ── DANGER ZONE ── */}
        <GlassCard glowColor="rgba(239,68,68,0.2)" style={{ padding: 24 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#1e1040", marginBottom: 4 }}>Reset & Danger Zone</div>
              <div style={{ fontSize: 12.5, color: "#9b93b8" }}>
                Reset all settings to default, or permanently delete your account.
              </div>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <motion.button
                whileHover={{ scale: 1.04, y: -1 }} whileTap={{ scale: 0.94 }}
                style={{
                  padding: "10px 22px", borderRadius: 50, border: "none", cursor: "pointer",
                  fontFamily: "'Afacad',sans-serif", fontSize: 13, fontWeight: 700, color: "#4c1d95",
                  background: "rgba(255,255,255,0.5)", backdropFilter: "blur(20px)",
                  boxShadow: "0 4px 16px rgba(120,80,220,0.08), 0 0 0 1px rgba(255,255,255,0.45)",
                }}
              >Reset to Defaults</motion.button>
              <motion.button
                whileHover={{ scale: 1.04, y: -1 }} whileTap={{ scale: 0.94 }}
                style={{
                  padding: "10px 22px", borderRadius: 50, border: "none", cursor: "pointer",
                  fontFamily: "'Afacad',sans-serif", fontSize: 13, fontWeight: 700, color: "#b91c1c",
                  background: "rgba(254,202,202,0.45)", backdropFilter: "blur(20px)",
                  boxShadow: "0 4px 16px rgba(185,28,28,0.10), 0 0 0 1px rgba(255,200,200,0.45)",
                }}
              >Delete Account</motion.button>
            </div>
          </div>
        </GlassCard>

      </main>
    </div>
  );
}