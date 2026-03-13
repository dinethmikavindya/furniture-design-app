"use client";
import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";

const NAV = [
  { label: "Home",      path: "/dashboard" },
  { label: "Projects",  path: "/projects"  },
  { label: "Editor",    path: "/editor"    },
  { label: "Shop",      path: "/shop"      },
  { label: "Materials", path: "/materials" },
  { label: "Settings",  path: "/settings"  },
];

export default function GlassSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const router   = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const isActive = (path) =>
    path === "/dashboard"
      ? pathname === "/dashboard"
      : pathname.startsWith(path);

  const getInitials = (name) => {
    if (!name) return "U";
    const p = name.trim().split(" ");
    return p.length >= 2 ? (p[0][0] + p[1][0]).toUpperCase() : p[0].slice(0,2).toUpperCase();
  };

  const handleLogout = async () => { await logout(); router.push("/login"); };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        .msb { font-family: 'Inter', sans-serif; }
        .msb-nav-btn { background: none; border: none; cursor: pointer; display: flex; align-items: center; width: 100%; text-align: left; transition: all 0.15s ease; border-radius: 10px; }
        .msb-nav-btn:hover { background: rgba(109,40,217,0.07); }
        .msb-nav-btn.active { background: rgba(109,40,217,0.10); }
        .msb-collapse-btn { background: none; border: 1px solid rgba(109,40,217,0.15); border-radius: 8px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.15s; }
        .msb-collapse-btn:hover { background: rgba(109,40,217,0.08); }
        .msb-logout { background: none; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; border-radius: 8px; transition: all 0.15s; color: #94a3b8; }
        .msb-logout:hover { background: rgba(239,68,68,0.08); color: #ef4444; }
      `}</style>

      <motion.aside
        className="msb"
        animate={{ width: collapsed ? 64 : 220 }}
        transition={{ type: "spring", stiffness: 320, damping: 32 }}
        style={{
          flexShrink: 0,
          height: "calc(100vh - 24px)",
          margin: "12px 0 12px 12px",
          borderRadius: 20,
          background: "#ffffff",
          borderRight: "1px solid #f1f0ff",
          boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 8px 24px rgba(109,40,217,0.06)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          position: "relative",
          zIndex: 30,
        }}
      >
        {/* Header */}
        <div style={{ padding: "18px 14px 14px", borderBottom: "1px solid #f5f3ff", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
          <AnimatePresence initial={false}>
            {!collapsed && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}
                style={{ overflow: "hidden", whiteSpace: "nowrap" }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: "#0f0a1e", letterSpacing: "-0.4px" }}>
                  Mauve Studio<span style={{ color: "#8b5cf6" }}>.</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <button className="msb-collapse-btn"
            onClick={() => setCollapsed(c => !c)}
            style={{ width: 28, height: 28, flexShrink: 0, marginLeft: collapsed ? "auto" : 0, marginRight: collapsed ? "auto" : 0 }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="2.5" strokeLinecap="round">
              <path d={collapsed ? "M9 18l6-6-6-6" : "M15 18l-6-6 6-6"} />
            </svg>
          </button>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: "10px 10px", display: "flex", flexDirection: "column", gap: 1, overflowY: "auto" }}>
          {!collapsed && (
            <div style={{ fontSize: 10, fontWeight: 600, color: "#c4b5fd", textTransform: "uppercase", letterSpacing: "0.8px", padding: "6px 10px 8px" }}>Menu</div>
          )}
          {NAV.map((item) => {
            const active = isActive(item.path);
            return (
              <button key={item.label}
                className={`msb-nav-btn${active ? " active" : ""}`}
                onClick={() => router.push(item.path)}
                title={collapsed ? item.label : undefined}
                style={{
                  padding: collapsed ? "11px 0" : "10px 12px",
                  justifyContent: collapsed ? "center" : "flex-start",
                  gap: 10,
                  color: active ? "#6d28d9" : "#64748b",
                  fontWeight: active ? 600 : 400,
                  fontSize: 13.5,
                  position: "relative",
                }}>
                {/* Active indicator */}
                {active && (
                  <span style={{ position: "absolute", left: 0, top: "15%", bottom: "15%", width: 3, borderRadius: "0 2px 2px 0", background: "#8b5cf6" }} />
                )}
                {/* Dot for collapsed active */}
                {collapsed && active && (
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#8b5cf6", display: "block" }} />
                )}
                {/* Label */}
                {!collapsed && (
                  <span style={{ letterSpacing: "-0.1px" }}>{item.label}</span>
                )}
                {/* Active dot at end */}
                {active && !collapsed && (
                  <span style={{ marginLeft: "auto", width: 6, height: 6, borderRadius: "50%", background: "#8b5cf6", flexShrink: 0 }} />
                )}
              </button>
            );
          })}
        </nav>

        {/* Divider */}
        <div style={{ margin: "0 14px", height: 1, background: "#f5f3ff" }} />

        {/* User */}
        <div style={{ padding: "10px 10px 14px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 9, padding: collapsed ? "8px 0" : "9px 10px", borderRadius: 10, justifyContent: collapsed ? "center" : "flex-start", cursor: "pointer", transition: "background 0.15s" }}
            onClick={() => router.push("/account")}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(109,40,217,0.05)"}
            onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
            {/* Avatar */}
            <div style={{ width: 30, height: 30, borderRadius: 8, background: "linear-gradient(135deg,#8b5cf6,#6d28d9)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 11, fontWeight: 700, flexShrink: 0 }}>
              {getInitials(user?.name)}
            </div>
            {!collapsed && (
              <>
                <div style={{ flex: 1, overflow: "hidden" }}>
                  <div style={{ fontSize: 12.5, fontWeight: 600, color: "#0f0a1e", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{user?.name || "User"}</div>
                  <div style={{ fontSize: 10.5, color: "#94a3b8", fontWeight: 400 }}>Account</div>
                </div>
                <button className="msb-logout" onClick={e => { e.stopPropagation(); handleLogout(); }} style={{ width: 26, height: 26, flexShrink: 0 }} title="Sign out">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
                  </svg>
                </button>
              </>
            )}
          </div>
        </div>
      </motion.aside>
    </>
  );
}
