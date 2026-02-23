"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, useMotionValue, useSpring } from "framer-motion";

const NAV = [
    { icon: "⌂", label: "Home", path: "/dashboard" },
    { icon: "▦", label: "Projects", path: "/projects" },
    { icon: "✦", label: "Editor", path: "/editor" },
    { icon: "◈", label: "Materials", path: "/materials" },
    { icon: "⚙", label: "Settings", path: "/settings" },
    { icon: "⊡", label: "Shop", path: "/shop" },
    { icon: "⊙", label: "Account", path: "/account" },
];

// Liquid glass hook
function useLiquidGlass(strength = 10) {
    const ref = useRef(null);
    const rawX = useMotionValue(0);
    const rawY = useMotionValue(0);
    const rotateX = useSpring(rawY, { stiffness: 80, damping: 12, mass: 0.8 });
    const rotateY = useSpring(rawX, { stiffness: 80, damping: 12, mass: 0.8 });
    const springScale = useSpring(1, { stiffness: 200, damping: 14, mass: 0.6 });
    const [hov, setHov] = useState(false);

    const onMove = useCallback((e) => {
        const el = ref.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        rawX.set(py * -strength);
        rawY.set(px * strength);
    }, [rawX, rawY, strength]);

    const onEnter = useCallback(() => {
        setHov(true);
        springScale.set(1.01);
    }, [springScale]);

    const onLeave = useCallback(() => {
        rawX.set(0);
        rawY.set(0);
        setHov(false);
        springScale.set(1);
    }, [rawX, rawY, springScale]);

    return {
        ref, rotateX, rotateY, hov, springScale,
        events: { onMouseMove: onMove, onMouseEnter: onEnter, onMouseLeave: onLeave },
    };
}

// Glass edge
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

// Glass Nav Item
function GlassNavItem({ item, isActive, onClick, index }) {
    const [hov, setHov] = useState(false);

    return (
        <motion.button
            onClick={onClick}
            onMouseEnter={() => setHov(true)}
            onMouseLeave={() => setHov(false)}
            initial={{ x: -22, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: index * 0.06 + 0.15, type: "spring", stiffness: 130, damping: 18 }}
            whileHover={{ x: 5, scale: 1.03 }}
            whileTap={{ x: 2, scale: 0.95 }}
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
                        ? "0 2px 16px rgba(139,92,246,0.06), 0 0 0 0.5px rgba(255,255,255,0.30)"
                        : "none",
                transition: "all 0.25s cubic-bezier(0.22,1,0.36,1)",
                position: "relative", overflow: "hidden",
            }}
        >
            <span style={{ fontSize: 17 }}>{item.icon}</span>
            <span>{item.label}</span>
        </motion.button>
    );
}

// Glass User Card
function GlassUserCard({ onNavigate }) {
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
                    ? "0 12px 36px rgba(120,80,220,0.10), 0 0 0 0.5px rgba(255,255,255,0.45)"
                    : "0 8px 28px rgba(120,80,220,0.05), 0 0 0 0.5px rgba(255,255,255,0.25)",
                display: "flex", alignItems: "center", justifyContent: "space-between",
                cursor: "pointer", transition: "all 0.3s ease",
            }}
        >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{
                    width: 36, height: 36, borderRadius: "50%",
                    background: "linear-gradient(135deg,#8b5cf6,#6d28d9)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "#fff", fontSize: 12, fontWeight: 700,
                    boxShadow: "0 4px 16px rgba(109,40,217,0.35)",
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
            <span style={{ fontSize: 16, color: "#9b93b8" }}>→</span>
        </motion.div>
    );
}

// Glass Sidebar
function GlassSidebar({ active, setActive, onNavigate }) {
    const [hov, setHov] = useState(false);
    return (
        <motion.aside
            onMouseEnter={() => setHov(true)}
            onMouseLeave={() => setHov(false)}
            initial={{ x: -44, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.75, type: "spring", stiffness: 90, damping: 18 }}
            style={{
                width: 225, minWidth: 225, zIndex: 20, position: "relative",
                display: "flex", flexDirection: "column", padding: "28px 0 20px",
                margin: "14px 0 14px 14px", borderRadius: 32,
                background: hov ? "rgba(255,255,255,0.28)" : "rgba(255,255,255,0.20)",
                backdropFilter: "blur(48px) saturate(220%) brightness(1.06)",
                WebkitBackdropFilter: "blur(48px) saturate(220%) brightness(1.06)",
                boxShadow: hov
                    ? `0 20px 60px rgba(120,80,220,0.10), 0 0 0 0.5px rgba(255,255,255,0.35)`
                    : `0 12px 52px rgba(120,80,220,0.06), 0 0 0 0.5px rgba(255,255,255,0.22)`,
                transition: "all 0.35s ease",
            }}
        >
            <div style={{ padding: "0 24px 34px" }}>
                <span style={{ fontSize: 22, fontWeight: 700, color: "#2d1f4e" }}>
                    Mauve Studio
                </span>
                <span style={{
                    fontSize: 22, fontWeight: 700,
                    background: "linear-gradient(90deg,#8b5cf6,#60a5fa,#ec4899)",
                    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                }}>.</span>
            </div>

            <nav style={{ flex: 1, display: "flex", flexDirection: "column", gap: 3, padding: "0 10px" }}>
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

            <GlassUserCard onNavigate={onNavigate} />
        </motion.aside>
    );
}

// Main Settings Page
export default function SettingsPage() {
    const router = useRouter();
    const [active, setActive] = useState("Settings");
    const [theme, setTheme] = useState("light");
    const [gridEnabled, setGridEnabled] = useState(true);
    const [gridSize, setGridSize] = useState(20);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");

    const userId = "f9cb7339-fd63-43ea-933d-de84aa0cd524";

    const editorCard = useLiquidGlass(8);
    const interfaceCard = useLiquidGlass(8);

    const onNavigate = (path) => {
        const label = NAV.find(n => n.path === path)?.label || "Home";
        setActive(label);
        router.push(path);
    };

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        try {
            const response = await fetch(`/api/settings?userId=${userId}`);
            const data = await response.json();

            setTheme(data.theme || "light");
            setGridEnabled(data.preferences?.gridEnabled ?? true);
            setGridSize(data.preferences?.gridSize || 20);

            document.documentElement.setAttribute("data-theme", data.theme || "light");
        } catch (error) {
            console.error("Failed to load settings:", error);
        }
    };

    const handleThemeToggle = async () => {
        const newTheme = theme === "light" ? "dark" : "light";

        try {
            const response = await fetch("/api/settings/theme", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId, theme: newTheme }),
            });

            if (response.ok) {
                setTheme(newTheme);
                document.documentElement.setAttribute("data-theme", newTheme);
                showMessage("Theme updated! ✨");
            }
        } catch (error) {
            showMessage("Failed to update theme ❌");
        }
    };

    const saveSettings = async () => {
        setSaving(true);

        try {
            const response = await fetch("/api/settings", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId,
                    theme,
                    preferences: { gridEnabled, gridSize },
                }),
            });

            if (response.ok) {
                showMessage("Settings saved! ✨");
            } else {
                showMessage("Failed to save ❌");
            }
        } catch (error) {
            showMessage("Failed to save ❌");
        } finally {
            setSaving(false);
        }
    };

    const showMessage = (msg) => {
        setMessage(msg);
        setTimeout(() => setMessage(""), 3000);
    };

    const css = `
    @import url('https://fonts.googleapis.com/css2?family=Afacad:ital,wght@0,400;0,500;0,600;0,700&display=swap');
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
    @keyframes floatA{0%,100%{transform:translateY(0)}50%{transform:translateY(-18px)}}
    @keyframes floatB{0%,100%{transform:translateY(0)}50%{transform:translateY(14px)}}
  `;

    return (
        <div style={{
            display: "flex",
            height: "100vh",
            fontFamily: "'Afacad','Helvetica Neue',sans-serif",
            background: "linear-gradient(135deg,#f0eaff 0%,#e8f4ff 50%,#f0e8ff 100%)",
            overflow: "hidden",
            position: "relative",
        }}>
            <style dangerouslySetInnerHTML={{ __html: css }} />

            {/* Background orbs */}
            <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}>
                <div style={{
                    position: "absolute", top: "-10%", right: "-5%", width: 380, height: 380, borderRadius: "50%",
                    background: "radial-gradient(circle,rgba(167,139,250,0.22) 0%,transparent 70%)",
                    animation: "floatA 9s ease-in-out infinite",
                }} />
                <div style={{
                    position: "absolute", bottom: "-8%", left: "-6%", width: 320, height: 320, borderRadius: "50%",
                    background: "radial-gradient(circle,rgba(96,165,250,0.18) 0%,transparent 70%)",
                    animation: "floatB 11s ease-in-out infinite",
                }} />
            </div>

            <GlassSidebar active={active} setActive={setActive} onNavigate={onNavigate} />

            <motion.main
                initial={{ y: -22, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.65, delay: 0.1 }}
                style={{
                    flex: 1,
                    overflowY: "auto",
                    padding: "14px 28px 28px 18px",
                    position: "relative",
                    zIndex: 10,
                }}
            >
                {/* Header */}
                <motion.div
                    initial={{ y: -16, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.15, duration: 0.5 }}
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        marginBottom: 32,
                        padding: "24px 28px 24px 8px",
                    }}
                >
                    <div>
                        <h1 style={{
                            fontSize: 36,
                            fontWeight: 700,
                            color: "#1e1040",
                            lineHeight: 1.2,
                            marginBottom: 7,
                        }}>
                            Settings
                        </h1>
                        <p style={{
                            color: "#9b93b8",
                            fontSize: 14,
                            fontWeight: 500,
                        }}>
                            Customise your workspace preferences.
                        </p>
                    </div>

                    {/* Save Button */}
                    <motion.button
                        onClick={saveSettings}
                        disabled={saving}
                        whileHover={!saving ? { scale: 1.05, y: -2 } : {}}
                        whileTap={!saving ? { scale: 0.93 } : {}}
                        style={{
                            padding: "11px 26px",
                            borderRadius: 50,
                            border: "none",
                            fontFamily: "'Afacad',sans-serif",
                            fontSize: 13,
                            fontWeight: 700,
                            cursor: saving ? "not-allowed" : "pointer",
                            color: "#fff",
                            background: saving
                                ? "rgba(200,200,200,0.4)"
                                : "linear-gradient(135deg,#8b5cf6 0%,#6d28d9 100%)",
                            backdropFilter: "blur(28px)",
                            boxShadow: saving
                                ? "none"
                                : "0 8px 28px rgba(109,40,217,0.35), inset 0 1px 6px rgba(255,255,255,0.12)",
                            display: "flex",
                            alignItems: "center",
                            gap: 7,
                            marginTop: 6,
                        }}
                    >
                        <span>💾</span>
                        {saving ? "Saving..." : "Save Changes"}
                    </motion.button>
                </motion.div>

                {/* Message */}
                {message && (
                    <motion.div
                        initial={{ y: -10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{
                            padding: "12px 20px",
                            marginBottom: 24,
                            marginLeft: 8,
                            background: message.includes("❌") ? "rgba(255,100,100,0.15)" : "rgba(139,92,246,0.15)",
                            backdropFilter: "blur(20px)",
                            border: `1px solid ${message.includes("❌") ? "rgba(255,100,100,0.3)" : "rgba(139,92,246,0.3)"}`,
                            borderRadius: 16,
                            fontSize: 14,
                            fontWeight: 600,
                            color: message.includes("❌") ? "#ff6b6b" : "#8b5cf6",
                        }}
                    >
                        {message}
                    </motion.div>
                )}

                {/* Editor Preferences Card */}
                <motion.div
                    ref={editorCard.ref}
                    {...editorCard.events}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    style={{
                        marginBottom: 24,
                        marginLeft: 8,
                        padding: "28px 32px",
                        borderRadius: 20,
                        background: "rgba(255,255,255,0.24)",
                        backdropFilter: "blur(32px) saturate(200%) brightness(1.08)",
                        WebkitBackdropFilter: "blur(32px) saturate(200%) brightness(1.08)",
                        boxShadow: editorCard.hov
                            ? "0 20px 50px rgba(120,80,220,0.12), 0 0 0 0.5px rgba(255,255,255,0.35)"
                            : "0 8px 28px rgba(120,80,220,0.06), 0 0 0 0.5px rgba(255,255,255,0.20)",
                        position: "relative",
                        rotateX: editorCard.rotateX,
                        rotateY: editorCard.rotateY,
                        scale: editorCard.springScale,
                        transformStyle: "preserve-3d",
                        transformPerspective: 800,
                        transition: "box-shadow 0.3s cubic-bezier(0.22,1,0.36,1)",
                    }}
                >
                    <GlassEdge hov={editorCard.hov} radius={20} glowColor="rgba(96,165,250,0.25)" />

                    <h2 style={{
                        fontSize: 18,
                        fontWeight: 700,
                        color: "#2d1f4e",
                        marginBottom: 24,
                        position: "relative",
                        zIndex: 7,
                    }}>
                        Editor Preferences
                    </h2>

                    {/* Show Grid */}
                    <div style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        paddingBottom: 20,
                        borderBottom: "1px solid rgba(155,147,184,0.15)",
                        marginBottom: 20,
                        position: "relative",
                        zIndex: 7,
                    }}>
                        <div>
                            <div style={{
                                fontSize: 15,
                                fontWeight: 600,
                                color: "#2d1f4e",
                                marginBottom: 4,
                            }}>
                                Show Grid
                            </div>
                            <div style={{
                                fontSize: 13,
                                color: "#9b93b8",
                            }}>
                                Display grid lines on the canvas
                            </div>
                        </div>

                        {/* Toggle */}
                        <motion.button
                            onClick={() => setGridEnabled(!gridEnabled)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            style={{
                                width: 44,
                                height: 26,
                                borderRadius: 13,
                                border: "none",
                                backgroundColor: gridEnabled ? "#8b5cf6" : "#e5e5e7",
                                position: "relative",
                                cursor: "pointer",
                                transition: "background-color 0.3s",
                                boxShadow: gridEnabled
                                    ? "0 4px 14px rgba(139,92,246,0.35), inset 0 1px 0 rgba(255,255,255,0.2)"
                                    : "0 2px 6px rgba(0,0,0,0.08)",
                            }}
                        >
                            <motion.div
                                animate={{ left: gridEnabled ? "21px" : "3px" }}
                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                style={{
                                    width: 20,
                                    height: 20,
                                    borderRadius: "50%",
                                    backgroundColor: "#fff",
                                    position: "absolute",
                                    top: 3,
                                    boxShadow: "0 2px 6px rgba(0,0,0,0.12)",
                                }}
                            />
                        </motion.button>
                    </div>

                    {/* Grid Size */}
                    <div style={{
                        opacity: gridEnabled ? 1 : 0.4,
                        transition: "opacity 0.3s",
                        position: "relative",
                        zIndex: 7,
                    }}>
                        <div style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: 16,
                        }}>
                            <div>
                                <div style={{
                                    fontSize: 15,
                                    fontWeight: 600,
                                    color: "#2d1f4e",
                                    marginBottom: 4,
                                }}>
                                    Grid Size
                                </div>
                                <div style={{
                                    fontSize: 13,
                                    color: "#9b93b8",
                                }}>
                                    Spacing between grid lines
                                </div>
                            </div>
                            <div style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 10,
                            }}>
                                <span style={{
                                    fontSize: 18,
                                    fontWeight: 700,
                                    color: "#8b5cf6",
                                }}>
                                    {gridSize}
                                </span>
                                <span style={{
                                    fontSize: 13,
                                    color: "#9b93b8",
                                }}>
                                    cm
                                </span>
                            </div>
                        </div>

                        <input
                            type="range"
                            min="10"
                            max="50"
                            step="5"
                            value={gridSize}
                            onChange={(e) => setGridSize(Number(e.target.value))}
                            disabled={!gridEnabled}
                            style={{
                                width: "100%",
                                height: 6,
                                borderRadius: 3,
                                cursor: gridEnabled ? "pointer" : "not-allowed",
                                accentColor: "#8b5cf6",
                            }}
                        />
                    </div>
                </motion.div>

                {/* Interface Card */}
                <motion.div
                    ref={interfaceCard.ref}
                    {...interfaceCard.events}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    style={{
                        marginLeft: 8,
                        padding: "28px 32px",
                        borderRadius: 20,
                        background: "rgba(255,255,255,0.24)",
                        backdropFilter: "blur(32px) saturate(200%) brightness(1.08)",
                        WebkitBackdropFilter: "blur(32px) saturate(200%) brightness(1.08)",
                        boxShadow: interfaceCard.hov
                            ? "0 20px 50px rgba(167,139,250,0.12), 0 0 0 0.5px rgba(255,255,255,0.35)"
                            : "0 8px 28px rgba(120,80,220,0.06), 0 0 0 0.5px rgba(255,255,255,0.20)",
                        position: "relative",
                        rotateX: interfaceCard.rotateX,
                        rotateY: interfaceCard.rotateY,
                        scale: interfaceCard.springScale,
                        transformStyle: "preserve-3d",
                        transformPerspective: 800,
                        transition: "box-shadow 0.3s cubic-bezier(0.22,1,0.36,1)",
                    }}
                >
                    <GlassEdge hov={interfaceCard.hov} radius={20} glowColor="rgba(167,139,250,0.25)" />

                    <h2 style={{
                        fontSize: 18,
                        fontWeight: 700,
                        color: "#2d1f4e",
                        marginBottom: 24,
                        position: "relative",
                        zIndex: 7,
                    }}>
                        Interface
                    </h2>

                    {/* Dark Mode */}
                    <div style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        position: "relative",
                        zIndex: 7,
                    }}>
                        <div>
                            <div style={{
                                fontSize: 15,
                                fontWeight: 600,
                                color: "#2d1f4e",
                                marginBottom: 4,
                            }}>
                                Dark Mode
                            </div>
                            <div style={{
                                fontSize: 13,
                                color: "#9b93b8",
                            }}>
                                Switch to dark appearance
                            </div>
                        </div>

                        {/* Toggle */}
                        <motion.button
                            onClick={handleThemeToggle}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            style={{
                                width: 44,
                                height: 26,
                                borderRadius: 13,
                                border: "none",
                                backgroundColor: theme === "dark" ? "#8b5cf6" : "#e5e5e7",
                                position: "relative",
                                cursor: "pointer",
                                transition: "background-color 0.3s",
                                boxShadow: theme === "dark"
                                    ? "0 4px 14px rgba(139,92,246,0.35), inset 0 1px 0 rgba(255,255,255,0.2)"
                                    : "0 2px 6px rgba(0,0,0,0.08)",
                            }}
                        >
                            <motion.div
                                animate={{ left: theme === "dark" ? "21px" : "3px" }}
                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                style={{
                                    width: 20,
                                    height: 20,
                                    borderRadius: "50%",
                                    backgroundColor: "#fff",
                                    position: "absolute",
                                    top: 3,
                                    boxShadow: "0 2px 6px rgba(0,0,0,0.12)",
                                }}
                            />
                        </motion.button>
                    </div>
                </motion.div>
            </motion.main>
        </div>
    );
}