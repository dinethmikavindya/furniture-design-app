"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";

/* ══════════════════════════════════════════
   NAV CONFIG — one place, all pages use this
══════════════════════════════════════════ */
const NAV = [
  { icon: "⌂", label: "Home",      path: "/dashboard" },
  { icon: "▦", label: "Projects",  path: "/projects"  },
  { icon: "✦", label: "Editor",    path: "/editor"    },
  { icon: "⊡", label: "Shop",      path: "/shop"      },
  { icon: "◈", label: "Materials", path: "/materials" },
  { icon: "⚙", label: "Settings",  path: "/settings"  },
];

/* ══════════════════════════════════════════
   TOGGLE BUTTON — the open/close arrow
   sits on the right edge of the sidebar
══════════════════════════════════════════ */
function ToggleButton({ isOpen, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <motion.button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      whileHover={{ scale: 1.12 }}
      whileTap={{ scale: 0.92 }}
      style={{
        position: "absolute",
        top: 28,
        right: -16,          /* peeks out past the sidebar edge */
        zIndex: 50,
        width: 32,
        height: 32,
        borderRadius: "50%",
        border: "none",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 15,
        background: hov
          ? "rgba(255,255,255,0.95)"
          : "rgba(255,255,255,0.80)",
        backdropFilter: "blur(20px) saturate(180%)",
        WebkitBackdropFilter: "blur(20px) saturate(180%)",
        boxShadow: hov
          ? "0 6px 22px rgba(139,92,246,0.28), 0 0 0 1.5px rgba(139,92,246,0.40)"
          : "0 4px 16px rgba(120,80,220,0.14), 0 0 0 1px rgba(255,255,255,0.9)",
        color: "#8b5cf6",
        transition: "background 0.2s, box-shadow 0.2s",
      }}
    >
      {/* Arrow rotates to show direction */}
      <motion.span
        animate={{ rotate: isOpen ? 0 : 180 }}
        transition={{ type: "spring", stiffness: 260, damping: 22 }}
        style={{ display: "flex", alignItems: "center", lineHeight: 1, marginTop: -1 }}
      >
        ‹
      </motion.span>
    </motion.button>
  );
}

/* ══════════════════════════════════════════
   GLASS NAV ITEM
══════════════════════════════════════════ */
function GlassNavItem({ item, isActive, onClick, index, isOpen }) {
  const [hov, setHov] = useState(false);

  return (
    <motion.button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      initial={{ x: -22, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: index * 0.05 + 0.1, type: "spring", stiffness: 130, damping: 18 }}
      whileHover={{ x: isOpen ? 5 : 0, scale: 1.03 }}
      whileTap={{ scale: 0.94 }}
      title={!isOpen ? item.label : undefined}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: isOpen ? "flex-start" : "center",
        gap: 11,
        padding: isOpen ? "11px 16px" : "11px 0",
        borderRadius: 50,
        border: "none",
        cursor: "pointer",
        width: "100%",
        fontFamily: "'Afacad', sans-serif",
        fontSize: 14,
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
          ? "0 2px 16px rgba(139,92,246,0.07), 0 0 0 0.5px rgba(255,255,255,0.32)"
          : "none",
        transition: "all 0.25s cubic-bezier(0.22,1,0.36,1)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Glass shimmer border */}
      {(isActive || hov) && (
        <div style={{
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
        }} />
      )}

      {/* Icon — always visible */}
      <motion.span
        animate={{ scale: isActive ? 1.1 : 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 18 }}
        style={{
          fontSize: 16,
          filter: isActive ? "drop-shadow(0 2px 6px rgba(139,92,246,0.48))" : "none",
          position: "relative", zIndex: 2,
          display: "flex", alignItems: "center", justifyContent: "center",
          width: 22, flexShrink: 0,
        }}
      >
        {item.icon}
      </motion.span>

      {/* Label — slides away when sidebar closes */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.span
            key="label"
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: "auto" }}
            exit={{ opacity: 0, width: 0 }}
            transition={{ duration: 0.18 }}
            style={{ position: "relative", zIndex: 2, overflow: "hidden", whiteSpace: "nowrap" }}
          >
            {item.label}
          </motion.span>
        )}
      </AnimatePresence>

      {/* Active dot */}
      {isActive && isOpen && (
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.8, 1, 0.8] }}
          transition={{ duration: 2.2, repeat: Infinity }}
          style={{
            marginLeft: "auto", width: 6, height: 6, borderRadius: "50%",
            background: "linear-gradient(135deg,#8b5cf6,#a78bfa)",
            boxShadow: "0 0 8px rgba(139,92,246,0.7)",
            position: "relative", zIndex: 2, flexShrink: 0,
          }}
        />
      )}
    </motion.button>
  );
}

/* ══════════════════════════════════════════
   GLASS USER CARD
══════════════════════════════════════════ */
function GlassUserCard({ isOpen }) {
  const [hov, setHov] = useState(false);
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async (e) => {
    e.stopPropagation(); // prevent card click
    await logout();
    router.push("/login");
  };

  const handleNavigate = () => {
    router.push("/account");
  };

  const getInitials = (name) => {
    if (!name) return "US";
    const p = name.trim().split(" ");
    if (p.length >= 2) return (p[0][0] + p[1][0]).toUpperCase();
    if (p[0].length >= 2) return (p[0][0] + p[0][1]).toUpperCase();
    return p[0][0].toUpperCase();
  };

  return (
    <motion.div
      onClick={handleNavigate}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      style={{
        margin: isOpen ? "12px 12px 0" : "12px 6px 0",
        padding: isOpen ? "12px 14px" : "10px",
        borderRadius: 50,
        background: hov ? "rgba(255,255,255,0.45)" : "rgba(255,255,255,0.28)",
        backdropFilter: "blur(28px) saturate(180%)",
        WebkitBackdropFilter: "blur(28px) saturate(180%)",
        boxShadow: hov
          ? "0 12px 36px rgba(120,80,220,0.12), 0 0 0 1px rgba(255,255,255,0.55)"
          : "0 6px 24px rgba(120,80,220,0.06), 0 0 0 0.5px rgba(255,255,255,0.28)",
        display: "flex",
        alignItems: "center",
        justifyContent: isOpen ? "space-between" : "center",
        cursor: "pointer",
        position: "relative",
        overflow: "hidden",
        transition: "all 0.3s cubic-bezier(0.22,1,0.36,1)",
      }}
    >
      {/* Avatar */}
      <div
        style={{
          width: 34,
          height: 34,
          borderRadius: "50%",
          flexShrink: 0,
          background: "linear-gradient(135deg,#8b5cf6,#6d28d9)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
          fontSize: 11.5,
          fontWeight: 700,
          boxShadow:
            "0 4px 16px rgba(109,40,217,0.38), 0 0 0 2px rgba(255,255,255,0.55)",
        }}
      >
        {getInitials(user?.name)}
      </div>

      {/* Name */}
      {isOpen && (
        <div
          style={{
            overflow: "hidden",
            whiteSpace: "nowrap",
            marginLeft: 10,
            flex: 1,
          }}
        >
          <div
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: "#1e1040",
              lineHeight: 1.3,
            }}
          >
            {user?.name || "User"}
          </div>
          <div
            style={{
              fontSize: 10,
              fontWeight: 600,
              color: "#9b93b8",
            }}
          >
            Account
          </div>
        </div>
      )}

      {/* Logout Button */}
      {isOpen && (
        <button
          onClick={handleLogout}
          title="Sign out"
          style={{
            background: hov ? "rgba(139,92,246,0.1)" : "none",
            border: "none",
            cursor: "pointer",
            width: 28,
            height: 28,
            borderRadius: "50%",
            fontSize: 13,
            color: hov ? "#8b5cf6" : "#b8aad0",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          →
        </button>
      )}
    </motion.div>
  );
}


/* ══════════════════════════════════════════
   MAIN EXPORT
   Drop this into any page like:
     import GlassSidebar from "@/components/GlassSidebar";
     ...
     <GlassSidebar />     ← zero props needed!
══════════════════════════════════════════ */
export default function GlassSidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const [hov,    setHov]    = useState(false);
  const router   = useRouter();
  const pathname = usePathname(); // knows which page you're on automatically

  const activeLabel = NAV.find((n) => pathname.startsWith(n.path))?.label ?? "Home";

  return (
    <motion.aside
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      animate={{ width: isOpen ? 225 : 72 }}
      transition={{ type: "spring", stiffness: 260, damping: 28, mass: 0.9 }}
      style={{
        minWidth: 0,
        flexShrink: 0,
        zIndex: 20,
        position: "relative",   /* so toggle button can be positioned */
        display: "flex",
        flexDirection: "column",
        padding: "28px 0 20px",
        margin: "14px 0 14px 14px",
        borderRadius: 32,
        height: "calc(100vh - 28px)",
        background: hov ? "rgba(255,255,255,0.30)" : "rgba(255,255,255,0.22)",
        backdropFilter: "blur(48px) saturate(220%) brightness(1.06)",
        WebkitBackdropFilter: "blur(48px) saturate(220%) brightness(1.06)",
        boxShadow: hov
          ? "0 20px 60px rgba(120,80,220,0.12), 0 0 0 0.5px rgba(255,255,255,0.38)"
          : "0 12px 52px rgba(120,80,220,0.07), 0 0 0 0.5px rgba(255,255,255,0.24)",
        transition: "background 0.35s ease, box-shadow 0.4s cubic-bezier(0.22,1,0.36,1)",
        overflow: "visible",   /* IMPORTANT: lets toggle button poke out */
      }}
    >
      {/* Prismatic border */}
      <motion.div
        animate={{ opacity: hov ? 1 : 0.45 }}
        transition={{ duration: 0.35 }}
        style={{
          position: "absolute", inset: 0, borderRadius: 32, pointerEvents: "none",
          border: "1.5px solid transparent",
          backgroundImage: `linear-gradient(180deg,
            rgba(255,255,255,0.70) 0%, rgba(180,210,255,0.30) 15%,
            rgba(255,255,255,0.06) 35%, rgba(255,200,240,0.08) 55%,
            rgba(255,255,255,0.04) 70%, rgba(200,230,255,0.25) 88%,
            rgba(255,255,255,0.55) 100%)`,
          backgroundOrigin: "border-box",
          WebkitMask: "linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "destination-out",
          maskComposite: "exclude",
          zIndex: 10,
        }}
      />

      {/* ── Toggle button ── */}
      <ToggleButton isOpen={isOpen} onClick={() => setIsOpen((v) => !v)} />

      {/* ── LOGO — always visible, shrinks to "M" when closed ── */}
      <div style={{
        padding: isOpen ? "0 24px 20px" : "0 0 20px",
        display: "flex",
        alignItems: "center",
        justifyContent: isOpen ? "flex-start" : "center",
        position: "relative", zIndex: 2,
        overflow: "hidden",
        transition: "padding 0.3s cubic-bezier(0.22,1,0.36,1)",
      }}>
        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.span
              key="logotext"
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.2 }}
              style={{
                fontSize: 21, fontWeight: 700, color: "#1e1040",
                letterSpacing: "-0.5px", whiteSpace: "nowrap", overflow: "hidden",
              }}
            >
              Mauve Studio
            </motion.span>
          )}
        </AnimatePresence>

        <motion.span
          animate={{ fontSize: isOpen ? 21 : 24 }}
          transition={{ type: "spring", stiffness: 260, damping: 24 }}
          style={{
            fontWeight: 700,
            background: "linear-gradient(90deg,#8b5cf6,#60a5fa,#ec4899,#8b5cf6)",
            backgroundSize: "300% auto",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            animation: "shimmer 2.8s linear infinite",
            flexShrink: 0,
          }}
        >
          {isOpen ? "." : "M"}
        </motion.span>
      </div>

      {/* Divider */}
      <div style={{
        margin: "0 16px 12px", height: 1,
        background: "linear-gradient(90deg, transparent, rgba(139,92,246,0.18), transparent)",
        position: "relative", zIndex: 2,
      }} />

      {/* ── NAV LINKS ── */}
      <nav style={{
        flex: 1, display: "flex", flexDirection: "column",
        gap: 2,
        padding: isOpen ? "0 10px" : "0 8px",
        position: "relative", zIndex: 2,
        overflowY: "auto", overflowX: "hidden",
        transition: "padding 0.3s",
      }}>
        {NAV.map((item, i) => (
          <GlassNavItem
            key={item.label}
            item={item}
            isActive={activeLabel === item.label}
            onClick={() => router.push(item.path)}
            index={i}
            isOpen={isOpen}
          />
        ))}
      </nav>

      {/* ── USER CARD ── */}
      <div style={{ position: "relative", zIndex: 2 }}>
        <GlassUserCard isOpen={isOpen} />
      </div>

    </motion.aside>
  );
}