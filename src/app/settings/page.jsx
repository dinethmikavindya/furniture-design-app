"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

// Liquid glass hook (3D tilt effect)
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

// Glass edge component
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

// Main Settings Page
export default function SettingsPage() {
    const [theme, setTheme] = useState("light");
    const [gridEnabled, setGridEnabled] = useState(true);
    const [gridSize, setGridSize] = useState(20);
    const [snapToGrid, setSnapToGrid] = useState(false);
    const [measurementSystem, setMeasurementSystem] = useState("metric");
    const [ceilingHeight, setCeilingHeight] = useState(240);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");

    const userId = "f9cb7339-fd63-43ea-933d-de84aa0cd524";

    const unitsCard = useLiquidGlass(8);
    const editorCard = useLiquidGlass(8);
    const interfaceCard = useLiquidGlass(8);

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
            setSnapToGrid(data.preferences?.snapToGrid ?? false);
            setMeasurementSystem(data.preferences?.measurementSystem || "metric");
            setCeilingHeight(data.preferences?.ceilingHeight || 240);

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
                    preferences: {
                        gridEnabled,
                        gridSize,
                        snapToGrid,
                        measurementSystem,
                        ceilingHeight
                    },
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
    @keyframes shimmer{0%{background-position:-300% center}100%{background-position:300% center}}
    @keyframes floatA{0%,100%{transform:translateY(0)}50%{transform:translateY(-22px)}}
    @keyframes floatB{0%,100%{transform:translateY(0)}50%{transform:translateY(18px)}}
    :root {
      --bg-gradient: linear-gradient(135deg,#f0eaff 0%,#e8f4ff 50%,#f0e8ff 100%);
      --text-primary: #1e1040;
      --text-secondary: #9b93b8;
      --accent: #8b5cf6;
    }
    [data-theme="dark"] {
      --bg-gradient: linear-gradient(135deg,#1a0f2e 0%,#0f1419 50%,#1a0f2e 100%);
      --text-primary: #e8e0ff;
      --text-secondary: #a99bc8;
      --accent: #a78bfa;
    }
  `;

    return (
        <div style={{
            minHeight: "100vh",
            fontFamily: "'Afacad','Helvetica Neue',sans-serif",
            background: "var(--bg-gradient)",
            padding: "40px 20px",
            position: "relative",
            overflow: "hidden",
            transition: "background 0.5s ease",
        }}>
            <style dangerouslySetInnerHTML={{ __html: css }} />

            {/* Background orbs */}
            <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}>
                <div style={{
                    position: "absolute", top: "-10%", right: "-5%", width: 400, height: 400, borderRadius: "50%",
                    background: "radial-gradient(circle,rgba(167,139,250,0.25) 0%,transparent 70%)",
                    animation: "floatA 10s ease-in-out infinite",
                }} />
                <div style={{
                    position: "absolute", bottom: "-8%", left: "-6%", width: 350, height: 350, borderRadius: "50%",
                    background: "radial-gradient(circle,rgba(96,165,250,0.20) 0%,transparent 70%)",
                    animation: "floatB 12s ease-in-out infinite",
                }} />
            </div>

            <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, type: "spring" }}
                style={{ maxWidth: "700px", margin: "0 auto", position: "relative", zIndex: 10 }}
            >
                {/* Header */}
                <div style={{ marginBottom: 40, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                        <h1 style={{
                            fontSize: 36,
                            fontWeight: 700,
                            color: "var(--text-primary)",
                            marginBottom: 8,
                        }}>
                            Settings{" "}
                            <span style={{
                                background: "linear-gradient(90deg,#8b5cf6,#ec4899,#60a5fa)",
                                backgroundSize: "200% auto",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                                animation: "shimmer 3s linear infinite",
                            }}>✦</span>
                        </h1>
                        <p style={{ color: "var(--text-secondary)", fontSize: 14, fontWeight: 500 }}>
                            Customise your workspace preferences.
                        </p>
                    </div>

                    {/* Save Button */}
                    <motion.button
                        onClick={saveSettings}
                        disabled={saving}
                        whileHover={!saving ? { scale: 1.05, y: -2 } : {}}
                        whileTap={!saving ? { scale: 0.95 } : {}}
                        style={{
                            padding: "13px 32px",
                            borderRadius: 50,
                            border: "none",
                            fontFamily: "'Afacad',sans-serif",
                            fontSize: 14,
                            fontWeight: 700,
                            cursor: saving ? "not-allowed" : "pointer",
                            color: "#fff",
                            background: saving
                                ? "rgba(200,200,200,0.3)"
                                : "linear-gradient(135deg,#8b5cf6 0%,#6d28d9 100%)",
                            backdropFilter: "blur(28px) saturate(180%)",
                            WebkitBackdropFilter: "blur(28px) saturate(180%)",
                            boxShadow: saving
                                ? "none"
                                : "0 12px 36px rgba(109,40,217,0.45), inset 0 1px 10px rgba(255,255,255,0.20)",
                            position: "relative",
                            overflow: "hidden",
                            transition: "all 0.3s cubic-bezier(0.22,1,0.36,1)",
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                        }}
                    >
                        <span></span>
                        {saving ? "Saving..." : "Save Changes"}
                    </motion.button>
                </div>

                {/* Message */}
                {message && (
                    <motion.div
                        initial={{ y: -10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{
                            padding: "12px 20px",
                            marginBottom: 24,
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

                {/* Units & Measurements Card */}
                <motion.div
                    ref={unitsCard.ref}
                    {...unitsCard.events}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1, duration: 0.5 }}
                    style={{
                        marginBottom: 24,
                        padding: "28px 32px",
                        borderRadius: 26,
                        background: "rgba(255,255,255,0.22)",
                        backdropFilter: "blur(32px) saturate(200%) brightness(1.08)",
                        WebkitBackdropFilter: "blur(32px) saturate(200%) brightness(1.08)",
                        boxShadow: unitsCard.hov
                            ? "0 22px 60px rgba(167,139,250,0.20), 0 0 0 0.5px rgba(255,255,255,0.3)"
                            : "0 8px 28px rgba(120,80,220,0.05), 0 0 0 0.5px rgba(255,255,255,0.18)",
                        position: "relative",
                        rotateX: unitsCard.rotateX,
                        rotateY: unitsCard.rotateY,
                        scale: unitsCard.springScale,
                        transformStyle: "preserve-3d",
                        transformPerspective: 800,
                        transition: "box-shadow 0.3s cubic-bezier(0.22,1,0.36,1)",
                    }}
                >
                    <GlassEdge hov={unitsCard.hov} radius={26} glowColor="rgba(139,92,246,0.3)" />

                    <h2 style={{
                        fontSize: 18,
                        fontWeight: 700,
                        color: "var(--text-primary)",
                        marginBottom: 24,
                        position: "relative",
                        zIndex: 7,
                    }}>
                        Units & Measurements
                    </h2>

                    {/* Measurement System */}
                    <div style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: 28,
                        paddingBottom: 20,
                        borderBottom: "1px solid rgba(155,147,184,0.15)",
                        position: "relative",
                        zIndex: 7,
                    }}>
                        <div>
                            <div style={{ fontWeight: 600, color: "var(--text-primary)", marginBottom: 4 }}>
                                Measurement System
                            </div>
                            <div style={{ fontSize: 13, color: "var(--text-secondary)" }}>
                                Choose between Metric and Imperial units
                            </div>
                        </div>

                        {/* Metric/Imperial Toggle */}
                        <div style={{ display: "flex", gap: 8 }}>
                            <motion.button
                                onClick={() => setMeasurementSystem("metric")}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                style={{
                                    padding: "8px 20px",
                                    borderRadius: 20,
                                    border: "none",
                                    fontSize: 13,
                                    fontWeight: 600,
                                    cursor: "pointer",
                                    background: measurementSystem === "metric" ? "#8b5cf6" : "rgba(255,255,255,0.3)",
                                    color: measurementSystem === "metric" ? "#fff" : "var(--text-primary)",
                                    boxShadow: measurementSystem === "metric"
                                        ? "0 4px 14px rgba(139,92,246,0.35)"
                                        : "0 2px 8px rgba(0,0,0,0.05)",
                                    transition: "all 0.3s",
                                }}
                            >
                                Metric (cm)
                            </motion.button>
                            <motion.button
                                onClick={() => setMeasurementSystem("imperial")}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                style={{
                                    padding: "8px 20px",
                                    borderRadius: 20,
                                    border: "none",
                                    fontSize: 13,
                                    fontWeight: 600,
                                    cursor: "pointer",
                                    background: measurementSystem === "imperial" ? "#8b5cf6" : "rgba(255,255,255,0.3)",
                                    color: measurementSystem === "imperial" ? "#fff" : "var(--text-primary)",
                                    boxShadow: measurementSystem === "imperial"
                                        ? "0 4px 14px rgba(139,92,246,0.35)"
                                        : "0 2px 8px rgba(0,0,0,0.05)",
                                    transition: "all 0.3s",
                                }}
                            >
                                Imperial (ft)
                            </motion.button>
                        </div>
                    </div>

                    {/* Default Ceiling Height */}
                    <div style={{
                        position: "relative",
                        zIndex: 7,
                    }}>
                        <div style={{
                            display: "flex",
                            justifyContent: "space-between",
                            marginBottom: 12,
                        }}>
                            <label style={{ fontWeight: 600, color: "var(--text-primary)" }}>
                                Default Ceiling Height
                            </label>
                            <span style={{
                                fontSize: 16,
                                fontWeight: 700,
                                color: "#8b5cf6",
                            }}>
                                {ceilingHeight} cm
                            </span>
                        </div>

                        <div style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 12 }}>
                            Standard height for new rooms
                        </div>

                        <input
                            type="range"
                            min="200"
                            max="500"
                            step="10"
                            value={ceilingHeight}
                            onChange={(e) => setCeilingHeight(Number(e.target.value))}
                            style={{
                                width: "100%",
                                height: 8,
                                borderRadius: 4,
                                cursor: "pointer",
                                accentColor: "#8b5cf6",
                            }}
                        />

                        <div style={{
                            display: "flex",
                            justifyContent: "space-between",
                            marginTop: 8,
                            fontSize: 12,
                            color: "var(--text-secondary)",
                        }}>
                            <span>Low (200cm)</span>
                            <span>High (500cm)</span>
                        </div>
                    </div>
                </motion.div>

                {/* Editor Preferences Card */}
                <motion.div
                    ref={editorCard.ref}
                    {...editorCard.events}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    style={{
                        marginBottom: 24,
                        padding: "28px 32px",
                        borderRadius: 26,
                        background: "rgba(255,255,255,0.22)",
                        backdropFilter: "blur(32px) saturate(200%) brightness(1.08)",
                        WebkitBackdropFilter: "blur(32px) saturate(200%) brightness(1.08)",
                        boxShadow: editorCard.hov
                            ? "0 22px 60px rgba(96,165,250,0.20), 0 0 0 0.5px rgba(255,255,255,0.3)"
                            : "0 8px 28px rgba(120,80,220,0.05), 0 0 0 0.5px rgba(255,255,255,0.18)",
                        position: "relative",
                        rotateX: editorCard.rotateX,
                        rotateY: editorCard.rotateY,
                        scale: editorCard.springScale,
                        transformStyle: "preserve-3d",
                        transformPerspective: 800,
                        transition: "box-shadow 0.3s cubic-bezier(0.22,1,0.36,1)",
                    }}
                >
                    <GlassEdge hov={editorCard.hov} radius={26} glowColor="rgba(96,165,250,0.3)" />

                    <h2 style={{
                        fontSize: 18,
                        fontWeight: 700,
                        color: "var(--text-primary)",
                        marginBottom: 24,
                        position: "relative",
                        zIndex: 7,
                    }}>
                        Editor Preferences
                    </h2>

                    {/* Show Grid Toggle */}
                    <div style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: 28,
                        paddingBottom: 20,
                        borderBottom: "1px solid rgba(155,147,184,0.15)",
                        position: "relative",
                        zIndex: 7,
                    }}>
                        <div>
                            <div style={{ fontWeight: 600, color: "var(--text-primary)", marginBottom: 4 }}>
                                Show Grid
                            </div>
                            <div style={{ fontSize: 13, color: "var(--text-secondary)" }}>
                                Display grid lines on the canvas
                            </div>
                        </div>

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

                    {/* Snap to Grid Toggle */}
                    <div style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: 28,
                        paddingBottom: 20,
                        borderBottom: "1px solid rgba(155,147,184,0.15)",
                        position: "relative",
                        zIndex: 7,
                    }}>
                        <div>
                            <div style={{ fontWeight: 600, color: "var(--text-primary)", marginBottom: 4 }}>
                                Snap to Grid
                            </div>
                            <div style={{ fontSize: 13, color: "var(--text-secondary)" }}>
                                Automatically align objects to grid points
                            </div>
                        </div>

                        <motion.button
                            onClick={() => setSnapToGrid(!snapToGrid)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            style={{
                                width: 44,
                                height: 26,
                                borderRadius: 13,
                                border: "none",
                                backgroundColor: snapToGrid ? "#8b5cf6" : "#e5e5e7",
                                position: "relative",
                                cursor: "pointer",
                                transition: "background-color 0.3s",
                                boxShadow: snapToGrid
                                    ? "0 4px 14px rgba(139,92,246,0.35), inset 0 1px 0 rgba(255,255,255,0.2)"
                                    : "0 2px 6px rgba(0,0,0,0.08)",
                            }}
                        >
                            <motion.div
                                animate={{ left: snapToGrid ? "21px" : "3px" }}
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

                    {/* Grid Size Slider */}
                    <div style={{
                        opacity: gridEnabled ? 1 : 0.4,
                        transition: "opacity 0.3s",
                        position: "relative",
                        zIndex: 7,
                    }}>
                        <div style={{
                            display: "flex",
                            justifyContent: "space-between",
                            marginBottom: 12,
                        }}>
                            <label style={{ fontWeight: 600, color: "var(--text-primary)" }}>
                                Grid Size
                            </label>
                            <span style={{
                                fontSize: 16,
                                fontWeight: 700,
                                color: "#8b5cf6",
                            }}>
                                {gridSize} cm
                            </span>
                        </div>

                        <div style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 12 }}>
                            Spacing between grid lines
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
                                height: 8,
                                borderRadius: 4,
                                cursor: gridEnabled ? "pointer" : "not-allowed",
                                accentColor: "#8b5cf6",
                            }}
                        />

                        <div style={{
                            display: "flex",
                            justifyContent: "space-between",
                            marginTop: 8,
                            fontSize: 12,
                            color: "var(--text-secondary)",
                        }}>
                            <span>Small (10cm)</span>
                            <span>Large (50cm)</span>
                        </div>
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
                        padding: "28px 32px",
                        borderRadius: 26,
                        background: "rgba(255,255,255,0.22)",
                        backdropFilter: "blur(32px) saturate(200%) brightness(1.08)",
                        WebkitBackdropFilter: "blur(32px) saturate(200%) brightness(1.08)",
                        boxShadow: interfaceCard.hov
                            ? "0 22px 60px rgba(167,139,250,0.20), 0 0 0 0.5px rgba(255,255,255,0.3)"
                            : "0 8px 28px rgba(120,80,220,0.05), 0 0 0 0.5px rgba(255,255,255,0.18)",
                        position: "relative",
                        rotateX: interfaceCard.rotateX,
                        rotateY: interfaceCard.rotateY,
                        scale: interfaceCard.springScale,
                        transformStyle: "preserve-3d",
                        transformPerspective: 800,
                        transition: "box-shadow 0.3s cubic-bezier(0.22,1,0.36,1)",
                    }}
                >
                    <GlassEdge hov={interfaceCard.hov} radius={26} glowColor="rgba(167,139,250,0.3)" />

                    <h2 style={{
                        fontSize: 18,
                        fontWeight: 700,
                        color: "var(--text-primary)",
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
                            <div style={{ fontWeight: 600, color: "var(--text-primary)", marginBottom: 4 }}>
                                Dark Mode
                            </div>
                            <div style={{ fontSize: 13, color: "var(--text-secondary)" }}>
                                Switch to dark appearance
                            </div>
                        </div>

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
            </motion.div>
        </div>
    );
}