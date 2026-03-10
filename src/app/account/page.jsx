"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  motion,
  useMotionValue,
  useSpring,
  AnimatePresence,
} from "framer-motion";
import { useAuth } from "@/context/AuthContext";

/* ══════════════════════════════════════════
   NAV
══════════════════════════════════════════ */
const NAV = [
  { icon: "⌂", label: "Home",      path: "/dashboard" },
  { icon: "▦", label: "Projects",  path: "/projects" },
  { icon: "✦", label: "Editor",    path: "/editor" },
  { icon: "⊡", label: "Shop",      path: "/shop" },
  { icon: "◈", label: "Materials", path: "/materials" },
  { icon: "⚙", label: "Settings",  path: "/settings" },
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
          opacity: hov ? 1 : 0.4,
          boxShadow: hov
            ? `0 0 20px 3px rgba(255,255,255,0.45), 0 0 50px 6px ${glowColor || "rgba(167,139,250,0.12)"}, inset 0 1px 18px rgba(255,255,255,0.28)`
            : `0 0 10px 1px rgba(255,255,255,0.20), inset 0 1px 10px rgba(255,255,255,0.15)`,
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
          backgroundImage: `linear-gradient(135deg, rgba(255,255,255,0.80) 0%, rgba(180,210,255,0.45) 15%, rgba(255,255,255,0.08) 35%, rgba(255,200,240,0.15) 55%, rgba(255,255,255,0.04) 70%, rgba(200,230,255,0.50) 88%, rgba(255,255,255,0.70) 100%)`,
          backgroundOrigin: "border-box",
          WebkitMask: "linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "destination-out",
          maskComposite: "exclude",
        }}
      />
    </>
  );
}

/* ══════════════════════════════════════════
   GLASS NAV ITEM
══════════════════════════════════════════ */
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
        background: isActive ? "rgba(255,255,255,0.46)" : hov ? "rgba(255,255,255,0.26)" : "transparent",
        backdropFilter: isActive || hov ? "blur(28px) saturate(180%)" : "none",
        WebkitBackdropFilter: isActive || hov ? "blur(28px) saturate(180%)" : "none",
        boxShadow: isActive
          ? "0 4px 22px rgba(139,92,246,0.14), 0 0 0 0.5px rgba(255,255,255,0.5), inset 0 1px 8px rgba(255,255,255,0.35)"
          : hov ? "0 2px 16px rgba(139,92,246,0.07), 0 0 0 0.5px rgba(255,255,255,0.32)" : "none",
        transition: "all 0.25s cubic-bezier(0.22,1,0.36,1)",
        position: "relative", overflow: "hidden",
      }}
    >
      {(isActive || hov) && (
        <div style={{
          position: "absolute", inset: 0, borderRadius: 50, pointerEvents: "none",
          border: "1px solid transparent",
          backgroundImage: `linear-gradient(135deg, rgba(255,255,255,0.75) 0%, rgba(180,210,255,0.35) 20%, rgba(255,255,255,0.05) 45%, rgba(255,200,240,0.12) 65%, rgba(200,230,255,0.40) 90%, rgba(255,255,255,0.65) 100%)`,
          backgroundOrigin: "border-box",
          WebkitMask: "linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "destination-out",
          maskComposite: "exclude",
        }} />
      )}
      <motion.span
        animate={{ scale: isActive ? 1.1 : 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 18 }}
        style={{
          fontSize: 16, filter: isActive ? "drop-shadow(0 2px 6px rgba(139,92,246,0.48))" : "none",
          transition: "filter 0.25s", position: "relative", zIndex: 2,
          display: "flex", alignItems: "center", justifyContent: "center", width: 22,
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
            boxShadow: "0 0 8px rgba(139,92,246,0.7)", position: "relative", zIndex: 2,
          }}
        />
      )}
    </motion.button>
  );
}

/* ══════════════════════════════════════════
   GLASS BUTTON
══════════════════════════════════════════ */
function GlassButton({ children, variant = "secondary", style: btnStyle, onClick, disabled }) {
  const [hov, setHov] = useState(false);
  const [press, setPress] = useState(false);
  const isPrimary = variant === "primary";
  const isDanger  = variant === "danger";

  return (
    <motion.button
      onMouseEnter={() => !disabled && setHov(true)}
      onMouseLeave={() => { setHov(false); setPress(false); }}
      onMouseDown={() => !disabled && setPress(true)}
      onMouseUp={() => setPress(false)}
      onClick={!disabled ? onClick : undefined}
      animate={{ scale: press ? 0.94 : hov ? 1.04 : 1, y: press ? 1 : hov ? -2 : 0 }}
      transition={{ type: "spring", stiffness: 320, damping: 20, mass: 0.6 }}
      style={{
        padding: isPrimary ? "11px 28px" : "10px 20px",
        borderRadius: 50, border: "none",
        fontFamily: "'Afacad',sans-serif", fontSize: 13.5, fontWeight: 700,
        cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.55 : 1,
        color: isDanger ? "#b91c1c" : isPrimary ? "#fff" : "#4c1d95",
        background: isDanger
          ? hov ? "rgba(254,202,202,0.65)" : "rgba(254,202,202,0.38)"
          : isPrimary
            ? disabled ? "rgba(200,200,200,0.3)" : hov ? "linear-gradient(135deg,#9d6fff,#7c3aed)" : "linear-gradient(135deg,#8b5cf6,#6d28d9)"
            : hov ? "rgba(255,255,255,0.55)" : "rgba(255,255,255,0.35)",
        backdropFilter: "blur(32px) saturate(200%)",
        WebkitBackdropFilter: "blur(32px) saturate(200%)",
        boxShadow: isPrimary && !disabled
          ? "0 8px 28px rgba(109,40,217,0.38), 0 0 0 1px rgba(255,255,255,0.18)"
          : isDanger
            ? "0 4px 16px rgba(185,28,28,0.08), 0 0 0 1px rgba(255,200,200,0.35)"
            : "0 4px 16px rgba(120,80,220,0.07), 0 0 0 1px rgba(255,255,255,0.35)",
        display: "flex", alignItems: "center", gap: 8,
        position: "relative", overflow: "hidden",
        transition: "background 0.2s ease, box-shadow 0.25s cubic-bezier(0.22,1,0.36,1)",
        ...btnStyle,
      }}
    >
      <motion.div
        animate={{ left: hov ? "160%" : "-60%" }}
        transition={{ duration: 0.55, ease: "easeInOut" }}
        style={{
          position: "absolute", top: 0, width: "38%", height: "100%",
          background: "linear-gradient(90deg,transparent,rgba(255,255,255,0.38),transparent)",
          pointerEvents: "none",
        }}
      />
      <span style={{ position: "relative", zIndex: 2, display: "flex", alignItems: "center", gap: 8 }}>
        {children}
      </span>
    </motion.button>
  );
}

/* ══════════════════════════════════════════
   GLASS TOGGLE
══════════════════════════════════════════ */
function GlassToggle({ value, onChange }) {
  return (
    <motion.button
      onClick={() => onChange(!value)}
      whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
      style={{
        width: 44, height: 26, borderRadius: 13, border: "none",
        backgroundColor: value ? "#8b5cf6" : "#e5e5e7",
        position: "relative", cursor: "pointer",
        transition: "background-color 0.3s", flexShrink: 0,
        boxShadow: value
          ? "0 4px 14px rgba(139,92,246,0.35), inset 0 1px 0 rgba(255,255,255,0.2)"
          : "0 2px 6px rgba(0,0,0,0.08)",
      }}
    >
      <motion.div
        animate={{ left: value ? "21px" : "3px" }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        style={{
          width: 20, height: 20, borderRadius: "50%", backgroundColor: "#fff",
          position: "absolute", top: 3,
          boxShadow: "0 2px 6px rgba(0,0,0,0.12)",
        }}
      />
    </motion.button>
  );
}

/* ══════════════════════════════════════════
   GLASS USER CARD (sidebar)
══════════════════════════════════════════ */
function GlassUserCard({ onNavigate }) {
  const [hov, setHov] = useState(false);
  const { user, logout } = useAuth();
  const router = useRouter();
  const handleLogout = async () => { await logout(); router.push("/login"); };
  const getInitials = (name) => {
    if (!name) return "US";
    const p = name.trim().split(" ");
    if (p.length >= 2) return (p[0][0] + p[1][0]).toUpperCase();
    if (p[0].length >= 2) return (p[0][0] + p[0][1]).toUpperCase();
    return p[0][0].toUpperCase();
  };
  return (
    <motion.div
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
      style={{
        margin: "12px 12px 0", padding: "12px 14px", borderRadius: 50,
        background: hov ? "rgba(255,255,255,0.45)" : "rgba(255,255,255,0.28)",
        backdropFilter: "blur(28px) saturate(180%)", WebkitBackdropFilter: "blur(28px) saturate(180%)",
        boxShadow: hov
          ? "0 12px 36px rgba(120,80,220,0.12), 0 0 0 1px rgba(255,255,255,0.55)"
          : "0 6px 24px rgba(120,80,220,0.06), 0 0 0 0.5px rgba(255,255,255,0.28)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        cursor: "default", position: "relative", overflow: "hidden",
        transition: "background 0.3s ease, box-shadow 0.35s cubic-bezier(0.22,1,0.36,1)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10, position: "relative", zIndex: 2 }}>
        <div style={{
          width: 34, height: 34, borderRadius: "50%",
          background: "linear-gradient(135deg,#8b5cf6,#6d28d9)",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "#fff", fontSize: 11.5, fontWeight: 700,
          boxShadow: "0 4px 16px rgba(109,40,217,0.38), 0 0 0 2px rgba(255,255,255,0.55)",
        }}>{getInitials(user?.name)}</div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#1e1040", lineHeight: 1.3 }}>{user?.name || "User"}</div>
          <div style={{ fontSize: 10, fontWeight: 600, color: "#9b93b8" }}>Account</div>
        </div>
      </div>
      <motion.button
        onClick={handleLogout} title="Sign out"
        whileHover={{ x: 3, scale: 1.15 }} whileTap={{ x: 1, scale: 0.9 }}
        style={{
          background: hov ? "rgba(139,92,246,0.1)" : "none", border: "none", cursor: "pointer",
          width: 28, height: 28, borderRadius: "50%", fontSize: 13,
          color: hov ? "#8b5cf6" : "#b8aad0",
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
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      initial={{ x: -44, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.75, type: "spring", stiffness: 90, damping: 18 }}
      style={{
        width: 225, minWidth: 225, zIndex: 20, position: "relative",
        display: "flex", flexDirection: "column", padding: "28px 0 20px",
        margin: "14px 0 14px 14px", borderRadius: 32,
        background: hov ? "rgba(255,255,255,0.30)" : "rgba(255,255,255,0.22)",
        backdropFilter: "blur(48px) saturate(220%) brightness(1.06)",
        WebkitBackdropFilter: "blur(48px) saturate(220%) brightness(1.06)",
        boxShadow: hov
          ? "0 20px 60px rgba(120,80,220,0.12), 0 0 0 0.5px rgba(255,255,255,0.38)"
          : "0 12px 52px rgba(120,80,220,0.07), 0 0 0 0.5px rgba(255,255,255,0.24)",
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
          WebkitMaskComposite: "destination-out", maskComposite: "exclude", zIndex: 10,
        }}
      />
      <div style={{ padding: "0 24px 28px", position: "relative", zIndex: 2 }}>
        <span style={{ fontSize: 21, fontWeight: 700, color: "#1e1040", letterSpacing: "-0.5px" }}>Mauve Studio</span>
        <span style={{
          fontSize: 21, fontWeight: 700,
          background: "linear-gradient(90deg,#8b5cf6,#60a5fa,#ec4899,#8b5cf6)",
          backgroundSize: "300% auto", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          animation: "shimmer 2.8s linear infinite",
        }}>.</span>
        <div style={{ marginTop: 14, height: 1, background: "linear-gradient(90deg, transparent, rgba(139,92,246,0.18), transparent)" }} />
      </div>
      <nav style={{ flex: 1, display: "flex", flexDirection: "column", gap: 2, padding: "0 10px", position: "relative", zIndex: 2 }}>
        {NAV.map((item, i) => (
          <GlassNavItem key={item.label} item={item} isActive={active === item.label}
            onClick={() => onNavigate(item.path)} index={i} />
        ))}
      </nav>
      <div style={{ position: "relative", zIndex: 2 }}>
        <GlassUserCard onNavigate={onNavigate} />
      </div>
    </motion.aside>
  );
}

/* ══════════════════════════════════════════
   SECTION HEADER
══════════════════════════════════════════ */
function SectionHeader({ title }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
      <div style={{
        width: 6, height: 6, borderRadius: "50%",
        background: "linear-gradient(135deg,#8b5cf6,#60a5fa)",
        boxShadow: "0 0 8px rgba(139,92,246,0.5)",
      }} />
      <h2 style={{ fontSize: 15, fontWeight: 700, color: "#1e1040", margin: 0 }}>{title}</h2>
    </div>
  );
}

/* ══════════════════════════════════════════
   GLASS INPUT
══════════════════════════════════════════ */
function GlassInput({ label, value, onChange, type = "text", readOnly, placeholder }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
      <label style={{ fontSize: 11.5, fontWeight: 700, color: "#8878aa", letterSpacing: "0.6px", textTransform: "uppercase" }}>
        {label}
      </label>
      <div style={{
        borderRadius: 14, overflow: "hidden",
        background: readOnly ? "rgba(255,255,255,0.14)" : "rgba(255,255,255,0.28)",
        backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
        boxShadow: focused
          ? "0 0 0 2px rgba(139,92,246,0.45), 0 4px 16px rgba(139,92,246,0.10)"
          : "0 0 0 1px rgba(255,255,255,0.35), inset 0 1px 4px rgba(255,255,255,0.18)",
        transition: "box-shadow 0.2s ease",
      }}>
        <input
          type={type} value={value} onChange={onChange}
          readOnly={readOnly} placeholder={placeholder}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          style={{
            width: "100%", padding: "11px 16px", border: "none", outline: "none",
            background: "transparent", fontFamily: "'Afacad',sans-serif",
            fontSize: 14, fontWeight: 600,
            color: readOnly ? "#9b93b8" : "#1e1040",
            cursor: readOnly ? "default" : "text", boxSizing: "border-box",
          }}
        />
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   AVATAR RING
══════════════════════════════════════════ */
function AvatarRing({ initials, size = 80 }) {
  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      <div style={{
        position: "absolute", inset: -4, borderRadius: "50%",
        background: "linear-gradient(135deg,#8b5cf6,#60a5fa,#ec4899)",
        opacity: 0.55, filter: "blur(8px)",
      }} />
      <div style={{ position: "absolute", inset: -2, borderRadius: "50%", background: "linear-gradient(135deg,#8b5cf6,#60a5fa,#ec4899)" }} />
      <div style={{
        position: "absolute", inset: 2, borderRadius: "50%",
        background: "linear-gradient(135deg,#8b5cf6,#6d28d9)",
        display: "flex", alignItems: "center", justifyContent: "center",
        color: "#fff", fontSize: size * 0.3, fontWeight: 700,
        boxShadow: "inset 0 2px 8px rgba(255,255,255,0.20)",
      }}>{initials}</div>
    </div>
  );
}

/* ══════════════════════════════════════════
   STAT PILL
══════════════════════════════════════════ */
function StatPill({ label, value, color }) {
  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
      padding: "14px 22px", borderRadius: 18,
      background: "rgba(255,255,255,0.28)", backdropFilter: "blur(20px)",
      WebkitBackdropFilter: "blur(20px)",
      boxShadow: "0 2px 12px rgba(120,80,220,0.06), 0 0 0 1px rgba(255,255,255,0.35)",
      flex: 1, minWidth: 0,
    }}>
      <span style={{ fontSize: 22, fontWeight: 800, color: color || "#1e1040" }}>{value}</span>
      <span style={{ fontSize: 11, fontWeight: 600, color: "#9b93b8" }}>{label}</span>
    </div>
  );
}

/* ══════════════════════════════════════════
   SETTING ROW
══════════════════════════════════════════ */
function SettingRow({ label, sub, children, noBorder }) {
  return (
    <div style={{
      display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16,
      paddingBottom: noBorder ? 0 : 20, marginBottom: noBorder ? 0 : 20,
      borderBottom: noBorder ? "none" : "1px solid rgba(155,147,184,0.15)",
      position: "relative", zIndex: 7,
    }}>
      <div>
        <div style={{ fontWeight: 600, color: "#1e1040", marginBottom: 3, fontSize: 14 }}>{label}</div>
        {sub && <div style={{ fontSize: 12.5, color: "#9b93b8" }}>{sub}</div>}
      </div>
      {children}
    </div>
  );
}

/* ══════════════════════════════════════════
   ACCOUNT PAGE
══════════════════════════════════════════ */
export default function AccountPage() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [active, setActive] = useState("Account");

  // ── Profile (from DB via useAuth) ──
  const [name,          setName]          = useState("");
  const [email,         setEmail]         = useState("");
  const [profileSaved,  setProfileSaved]  = useState(false);
  const [profileBusy,   setProfileBusy]   = useState(false);

  // ── Preferences (synced with SettingsPage /api/settings) ──
  const [theme,             setTheme]             = useState("light");
  const [gridEnabled,       setGridEnabled]       = useState(true);
  const [gridSize,          setGridSize]          = useState(20);
  const [snapToGrid,        setSnapToGrid]        = useState(false);
  const [measurementSystem, setMeasurementSystem] = useState("metric");
  const [ceilingHeight,     setCeilingHeight]     = useState(240);
  const [prefBusy,          setPrefBusy]          = useState(false);
  const [prefMsg,           setPrefMsg]           = useState("");

  // ── Logout confirm ──
  const [showLogout, setShowLogout] = useState(false);

  // ── Liquid glass cards ──
  const profileCard = useLiquidGlass(8);
  const prefCard    = useLiquidGlass(8);
  const secCard     = useLiquidGlass(8);

  /* Pre-fill profile from auth user (set during sign-up/login) */
  useEffect(() => {
    if (user) {
      setName(user.name   || "");
      setEmail(user.email || "");
    }
  }, [user]);

  /* Load preferences from the same API as SettingsPage */
  useEffect(() => {
    if (!user?.id) return;
    fetch(`/api/settings?userId=${user.id}`)
      .then((r) => r.json())
      .then((data) => {
        setTheme(data.theme || "light");
        setGridEnabled(data.preferences?.gridEnabled       ?? true);
        setGridSize(data.preferences?.gridSize             ?? 20);
        setSnapToGrid(data.preferences?.snapToGrid         ?? false);
        setMeasurementSystem(data.preferences?.measurementSystem || "metric");
        setCeilingHeight(data.preferences?.ceilingHeight   ?? 240);
      })
      .catch(console.error);
  }, [user?.id]);

  const getInitials = (n) => {
    if (!n) return "US";
    const p = n.trim().split(" ");
    if (p.length >= 2) return (p[0][0] + p[1][0]).toUpperCase();
    if (p[0].length >= 2) return (p[0][0] + p[0][1]).toUpperCase();
    return p[0][0].toUpperCase();
  };

  const handleNavigate = (path) => {
    const match = NAV.find((n) => n.path === path);
    if (match) setActive(match.label);
    router.push(path);
  };

  /* Save profile to DB */
  const handleSaveProfile = async () => {
    setProfileBusy(true);
    try {
      await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user?.id, name, email }),
      });
      setProfileSaved(true);
      setTimeout(() => setProfileSaved(false), 2400);
    } catch (err) {
      console.error("Profile save failed:", err);
    } finally {
      setProfileBusy(false);
    }
  };

  /* Save preferences — identical payload to SettingsPage */
  const handleSavePreferences = async () => {
    setPrefBusy(true);
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user?.id,
          theme,
          preferences: { gridEnabled, gridSize, snapToGrid, measurementSystem, ceilingHeight },
        }),
      });
      setPrefMsg(res.ok ? "Saved! ✨" : "Failed ❌");
    } catch {
      setPrefMsg("Failed ❌");
    } finally {
      setPrefBusy(false);
      setTimeout(() => setPrefMsg(""), 3000);
    }
  };

  /* Theme toggle — same logic as SettingsPage */
  const handleThemeToggle = async () => {
    const next = theme === "light" ? "dark" : "light";
    try {
      const res = await fetch("/api/settings/theme", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user?.id, theme: next }),
      });
      if (res.ok) {
        setTheme(next);
        document.documentElement.setAttribute("data-theme", next);
      }
    } catch (err) {
      console.error("Theme toggle failed:", err);
    }
  };

  const handleLogout = async () => { await logout(); router.push("/login"); };

  const joinDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })
    : null;

  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Afacad:wght@400;500;600;700;800&display=swap');
    @keyframes shimmer{from{background-position:0% center}to{background-position:200% center}}
    @keyframes floatA{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(38px,-28px) scale(1.07)}}
    @keyframes floatB{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(-30px,22px) scale(0.95)}}
    *{box-sizing:border-box;}
    ::-webkit-scrollbar{width:5px;}
    ::-webkit-scrollbar-track{background:transparent;}
    ::-webkit-scrollbar-thumb{background:rgba(196,176,240,0.5);border-radius:8px;}
  `;

  const glassCard = (glass, extra = {}) => ({
    borderRadius: 26, position: "relative", overflow: "hidden",
    background: glass.hov ? "rgba(255,255,255,0.32)" : "rgba(255,255,255,0.22)",
    backdropFilter: "blur(32px) saturate(200%) brightness(1.08)",
    WebkitBackdropFilter: "blur(32px) saturate(200%) brightness(1.08)",
    boxShadow: glass.hov
      ? "0 22px 60px rgba(167,139,250,0.18), 0 0 0 0.5px rgba(255,255,255,0.38)"
      : "0 8px 28px rgba(120,80,220,0.06), 0 0 0 0.5px rgba(255,255,255,0.18)",
    rotateX: glass.rotateX, rotateY: glass.rotateY, scale: glass.springScale,
    transformStyle: "preserve-3d", transformPerspective: 800,
    transition: "background 0.3s ease, box-shadow 0.35s cubic-bezier(0.22,1,0.36,1)",
    padding: 28, ...extra,
  });

  return (
    <div style={{
      minHeight: "100vh", width: "100%", display: "flex",
      fontFamily: "'Afacad',sans-serif", position: "relative", overflow: "hidden",
      background: "linear-gradient(145deg,#f3eeff 0%,#e8f4ff 45%,#fce8f8 100%)",
    }}>
      <style>{css}</style>
      <GlassFilter />

      {/* BG orbs */}
      <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}>
        <div style={{ position: "absolute", width: 700, height: 700, borderRadius: "50%", background: "radial-gradient(circle,rgba(167,139,250,0.22) 0%,transparent 70%)", top: "-18%", left: "-8%", animation: "floatA 18s ease-in-out infinite" }} />
        <div style={{ position: "absolute", width: 550, height: 550, borderRadius: "50%", background: "radial-gradient(circle,rgba(96,165,250,0.18) 0%,transparent 70%)", bottom: "-14%", right: "-6%", animation: "floatB 22s ease-in-out infinite" }} />
        <div style={{ position: "absolute", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle,rgba(244,114,182,0.16) 0%,transparent 70%)", top: "40%", left: "55%", animation: "floatA 26s ease-in-out infinite reverse" }} />
        <div style={{ position: "absolute", inset: 0, opacity: 0.035, backgroundImage: "linear-gradient(rgba(100,80,180,1) 1px,transparent 1px),linear-gradient(90deg,rgba(100,80,180,1) 1px,transparent 1px)", backgroundSize: "48px 48px" }} />
      </div>

      <GlassSidebar active={active} onNavigate={handleNavigate} />

      <main style={{
        flex: 1, display: "flex", flexDirection: "column",
        padding: "28px 28px 28px 18px", overflowY: "auto",
        position: "relative", zIndex: 5, gap: 20,
      }}>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: -14 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, type: "spring", stiffness: 110, damping: 16 }}
        >
          <h1 style={{ fontSize: 26, fontWeight: 800, color: "#1e1040", letterSpacing: "-0.6px", margin: 0 }}>My Account</h1>
          <p style={{ fontSize: 13.5, color: "#8878aa", margin: "4px 0 0", fontWeight: 500 }}>
            Manage your profile and workspace preferences
          </p>
        </motion.div>

        {/* ══ PROFILE CARD ══ */}
        <motion.div
          ref={profileCard.ref} {...profileCard.events}
          initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05, type: "spring", stiffness: 100, damping: 18 }}
          style={glassCard(profileCard)}
        >
          <GlassEdge hov={profileCard.hov} radius={26} glowColor="rgba(139,92,246,0.3)" />
          <div style={{ position: "relative", zIndex: 7 }}>

            {/* Hero row */}
            <div style={{ display: "flex", alignItems: "center", gap: 22, flexWrap: "wrap", marginBottom: 28 }}>
              <AvatarRing initials={getInitials(user?.name)} />
              <div style={{ flex: 1, minWidth: 160 }}>
                <div style={{ fontSize: 21, fontWeight: 800, color: "#1e1040", letterSpacing: "-0.5px" }}>
                  {user?.name || "—"}
                </div>
                <div style={{ fontSize: 13.5, color: "#8878aa", marginTop: 4 }}>{user?.email || "—"}</div>
                {joinDate && <div style={{ fontSize: 12, color: "#b8aad0", marginTop: 3 }}>Member since {joinDate}</div>}
              </div>
              <div style={{ display: "flex", gap: 12 }}>
                <StatPill label="Projects" value={user?.projectCount ?? "—"} color="#7c3aed" />
                <StatPill label="Designs"  value={user?.designCount  ?? "—"} color="#0ea5e9" />
                <StatPill label="Saved"    value={user?.savedCount   ?? "—"} color="#ec4899" />
              </div>
            </div>

            {/* Editable fields */}
            <SectionHeader title="Profile Details" />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
              <GlassInput label="Display Name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your full name" />
              <GlassInput label="Email Address" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
            </div>
            <GlassInput label="Account ID" value={user?.id || "—"} readOnly />
            <div style={{ marginTop: 18 }}>
              <GlassButton variant="primary" onClick={handleSaveProfile} disabled={profileBusy}>
                {profileSaved ? "✓ Saved!" : profileBusy ? "Saving..." : "Save Profile"}
              </GlassButton>
            </div>
          </div>
        </motion.div>

        {/* ══ PREFERENCES CARD (mirrors SettingsPage) ══ */}
        <motion.div
          ref={prefCard.ref} {...prefCard.events}
          initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12, type: "spring", stiffness: 100, damping: 18 }}
          style={glassCard(prefCard)}
        >
          <GlassEdge hov={prefCard.hov} radius={26} glowColor="rgba(96,165,250,0.3)" />
          <div style={{ position: "relative", zIndex: 7 }}>

            {/* Header row with save */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: "linear-gradient(135deg,#8b5cf6,#60a5fa)", boxShadow: "0 0 8px rgba(139,92,246,0.5)" }} />
                <h2 style={{ fontSize: 15, fontWeight: 700, color: "#1e1040", margin: 0 }}>Preferences</h2>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                {prefMsg && (
                  <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    style={{ fontSize: 12.5, fontWeight: 600, color: prefMsg.includes("❌") ? "#ef4444" : "#7c3aed" }}>
                    {prefMsg}
                  </motion.span>
                )}
                <GlassButton variant="primary" onClick={handleSavePreferences} disabled={prefBusy}
                  style={{ padding: "9px 22px", fontSize: 13 }}>
                  {prefBusy ? "Saving..." : "Save"}
                </GlassButton>
              </div>
            </div>

            {/* ── Units & Measurements ── */}
            <div style={{ fontSize: 11.5, fontWeight: 700, color: "#9b93b8", letterSpacing: "0.7px", textTransform: "uppercase", marginBottom: 14 }}>Units &amp; Measurements</div>

            <SettingRow label="Measurement System" sub="Choose between Metric and Imperial units">
              <div style={{ display: "flex", gap: 8 }}>
                {[["metric","Metric (cm)"],["imperial","Imperial (ft)"]].map(([opt, label]) => (
                  <motion.button key={opt} onClick={() => setMeasurementSystem(opt)}
                    whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    style={{
                      padding: "8px 18px", borderRadius: 20, border: "none",
                      fontSize: 13, fontWeight: 600, cursor: "pointer",
                      background: measurementSystem === opt ? "#8b5cf6" : "rgba(255,255,255,0.3)",
                      color: measurementSystem === opt ? "#fff" : "#4c1d95",
                      boxShadow: measurementSystem === opt ? "0 4px 14px rgba(139,92,246,0.35)" : "0 2px 8px rgba(0,0,0,0.05)",
                      transition: "all 0.25s", fontFamily: "'Afacad',sans-serif",
                    }}>{label}</motion.button>
                ))}
              </div>
            </SettingRow>

            <SettingRow label="Default Ceiling Height" sub="Standard height for new rooms" noBorder>
              <span style={{ fontSize: 15, fontWeight: 700, color: "#8b5cf6", minWidth: 70, textAlign: "right" }}>
                {ceilingHeight} cm
              </span>
            </SettingRow>
            <input type="range" min="200" max="500" step="10" value={ceilingHeight}
              onChange={(e) => setCeilingHeight(Number(e.target.value))}
              style={{ width: "100%", height: 8, borderRadius: 4, cursor: "pointer", accentColor: "#8b5cf6", marginBottom: 6, position: "relative", zIndex: 7 }} />
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#9b93b8", marginBottom: 24, paddingBottom: 24, borderBottom: "1px solid rgba(155,147,184,0.15)" }}>
              <span>Low (200 cm)</span><span>High (500 cm)</span>
            </div>

            {/* ── Editor ── */}
            <div style={{ fontSize: 11.5, fontWeight: 700, color: "#9b93b8", letterSpacing: "0.7px", textTransform: "uppercase", marginBottom: 14 }}>Editor</div>

            <SettingRow label="Show Grid" sub="Display grid lines on the canvas">
              <GlassToggle value={gridEnabled} onChange={setGridEnabled} />
            </SettingRow>
            <SettingRow label="Snap to Grid" sub="Automatically align objects to grid points">
              <GlassToggle value={snapToGrid} onChange={setSnapToGrid} />
            </SettingRow>

            <div style={{ opacity: gridEnabled ? 1 : 0.4, transition: "opacity 0.3s" }}>
              <SettingRow label="Grid Size" sub="Spacing between grid lines" noBorder>
                <span style={{ fontSize: 15, fontWeight: 700, color: "#8b5cf6", minWidth: 60, textAlign: "right" }}>{gridSize} cm</span>
              </SettingRow>
              <input type="range" min="10" max="50" step="5" value={gridSize}
                onChange={(e) => setGridSize(Number(e.target.value))} disabled={!gridEnabled}
                style={{ width: "100%", height: 8, borderRadius: 4, cursor: gridEnabled ? "pointer" : "not-allowed", accentColor: "#8b5cf6", marginBottom: 6 }} />
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#9b93b8", marginBottom: 24, paddingBottom: 24, borderBottom: "1px solid rgba(155,147,184,0.15)" }}>
                <span>Small (10 cm)</span><span>Large (50 cm)</span>
              </div>
            </div>

            {/* ── Interface ── */}
            <div style={{ fontSize: 11.5, fontWeight: 700, color: "#9b93b8", letterSpacing: "0.7px", textTransform: "uppercase", marginBottom: 14 }}>Interface</div>
            <SettingRow label="Dark Mode" sub="Switch to dark appearance" noBorder>
              <GlassToggle value={theme === "dark"} onChange={handleThemeToggle} />
            </SettingRow>
          </div>
        </motion.div>

        {/* ══ SECURITY CARD ══ */}
        <motion.div
          ref={secCard.ref} {...secCard.events}
          initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18, type: "spring", stiffness: 100, damping: 18 }}
          style={glassCard(secCard)}
        >
          <GlassEdge hov={secCard.hov} radius={26} glowColor="rgba(244,114,182,0.25)" />
          <div style={{ position: "relative", zIndex: 7 }}>
            <SectionHeader title="Security" />
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                { label: "Password",        sub: "Last changed 30 days ago", cta: "Change",  variant: "secondary" },
                { label: "Two-factor Auth", sub: "Not enabled",              cta: "Enable",  variant: "primary"   },
                { label: "Active Sessions", sub: "2 devices",                cta: "Manage",  variant: "secondary" },
              ].map(({ label, sub, cta, variant }) => (
                <div key={label} style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "12px 16px", borderRadius: 14,
                  background: "rgba(255,255,255,0.32)",
                  boxShadow: "0 0 0 1px rgba(255,255,255,0.38)",
                }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#1e1040" }}>{label}</div>
                    <div style={{ fontSize: 11.5, color: "#9b93b8", marginTop: 2 }}>{sub}</div>
                  </div>
                  <GlassButton variant={variant} style={{ padding: "7px 16px", fontSize: 12.5 }}>{cta}</GlassButton>
                </div>
              ))}
            </div>

            {/* Sign out row */}
            <div style={{
              marginTop: 20, paddingTop: 20,
              borderTop: "1px solid rgba(155,147,184,0.15)",
              display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 14,
            }}>
              <div>
                <div style={{ fontSize: 13.5, fontWeight: 700, color: "#1e1040" }}>Session</div>
                <div style={{ fontSize: 12.5, color: "#9b93b8", marginTop: 2 }}>Sign out of your current session.</div>
              </div>
              <GlassButton variant="secondary" onClick={() => setShowLogout(true)}>Sign Out →</GlassButton>
            </div>
          </div>
        </motion.div>
      </main>

      {/* ══ LOGOUT MODAL ══ */}
      <AnimatePresence>
        {showLogout && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{
              position: "fixed", inset: 0, zIndex: 100,
              background: "rgba(30,16,64,0.35)", backdropFilter: "blur(12px)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
            onClick={() => setShowLogout(false)}
          >
            <motion.div
              initial={{ scale: 0.88, opacity: 0, y: 24 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.88, opacity: 0, y: 24 }}
              transition={{ type: "spring", stiffness: 200, damping: 22 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                width: 380, borderRadius: 28,
                background: "rgba(255,255,255,0.72)",
                backdropFilter: "blur(48px) saturate(200%)",
                WebkitBackdropFilter: "blur(48px) saturate(200%)",
                boxShadow: "0 32px 80px rgba(30,16,64,0.22), 0 0 0 1px rgba(255,255,255,0.55)",
                padding: "32px 32px 28px", textAlign: "center",
              }}
            >
              <div style={{ fontSize: 36, marginBottom: 14 }}>👋</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: "#1e1040", marginBottom: 8 }}>
                Sign out of Mauve Studio?
              </div>
              <div style={{ fontSize: 13.5, color: "#8878aa", marginBottom: 28, lineHeight: 1.6 }}>
                Your projects are saved. You can sign back in any time.
              </div>
              <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
                <GlassButton variant="secondary" onClick={() => setShowLogout(false)}>Stay</GlassButton>
                <GlassButton variant="primary"   onClick={handleLogout}>Sign Out →</GlassButton>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}