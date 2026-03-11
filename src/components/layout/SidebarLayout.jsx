"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion";

export const NAV = [
    { icon: "⌂", label: "Home", path: "/dashboard" },
    { icon: "▦", label: "Projects", path: "/projects" },
    { icon: "✦", label: "Editor", path: "/editor" },
    { icon: "⊡", label: "Shop", path: "/shop" },
    { icon: "◈", label: "Materials", path: "/materials" },
    { icon: "⚙", label: "Settings", path: "/settings" },
];

export function GlassFilter() {
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

/* ══════ GLASS NAV ITEM ══════ */
export function GlassNavItem({ item, isActive, onClick, index }) {
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

/* ══════ GLASS USER CARD ══════ */
export function GlassUserCard({ onNavigate }) {
    const [hov, setHov] = useState(false);
    return (
        <motion.div
            onMouseEnter={() => setHov(true)}
            onMouseLeave={() => setHov(false)}
            onClick={() => onNavigate("/account")}
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
export function GlassSidebar({ active, setActive, onNavigate }) {
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
                    ?`0 20px 60px rgba(120,80,220,0.10), 0 0 0 0.5px rgba(255,255,255,0.35), inset 0 1px 14px rgba(255,255,255,0.22)`
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
            onClick={() => onNavigate(item.path)}
            index={i}
          />
        ))}
      </nav>
      <div style={{ position: "relative", zIndex: 2 }}>
        <GlassUserCard onNavigate={onNavigate} />
      </div>
    </motion.aside>
  );
}

export default function SidebarLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [active, setActive] = useState("Home");

  useEffect(() => {
    // Determine active item based on pathname
    const currentNavItem = NAV.find(n => pathname.startsWith(n.path));
    if (currentNavItem) {
      setActive(currentNavItem.label);
    }
  }, [pathname]);

  const onNavigate = (path) => {
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
      display: "flex", height: "100vh", width: "100vw",
      fontFamily: "'Afacad','Helvetica Neue',sans-serif",
      background: "linear-gradient(135deg,#f0eaff 0%,#e8f4ff 50%,#f0e8ff 100%)",
      overflow: "hidden", position: "relative",
    }}>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <GlassFilter />

      {/* Background orbs */}
      <div style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none", overflow: "hidden" }}>
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

      <GlassSidebar active={active} setActive={setActive} onNavigate={onNavigate} />

      <motion.main
        initial={{ y: -22, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.65, delay: 0.1, type: "spring", stiffness: 90, damping: 18 }}
        style={{ flex: 1, overflowY: "auto", padding: "14px 28px 28px 18px", position: "relative", zIndex: 10, display: "flex", flexDirection: "column" }}
      >
        {children}
      </motion.main>
    </div>
  );
}
