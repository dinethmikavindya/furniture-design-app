"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import GlassSidebar from "@/components/GlassSidebar";

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
        }}>{value}{unit}</span>
      </div>
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
        <span>{min}{unit}</span><span>{max}{unit}</span>
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
   GLASS CARD
══════════════════════════════════════════ */
function GlassCard({ children, style, glowColor }) {
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 100, damping: 18 }}
      style={{
        borderRadius: 26, position: "relative",
        background: "rgba(255,255,255,0.30)",
        backdropFilter: "blur(40px) saturate(200%) brightness(1.08)",
        WebkitBackdropFilter: "blur(40px) saturate(200%) brightness(1.08)",
        boxShadow: `0 8px 32px rgba(120,80,220,0.07), 0 0 0 0.5px rgba(255,255,255,0.28)`,
        padding: 28,
        ...style,
      }}
    >
      {children}
    </motion.div>
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
   MAIN SETTINGS PAGE
══════════════════════════════════════════ */
export default function SettingsPage() {
  const [theme, setTheme] = useState("light");
  const [gridEnabled, setGridEnabled] = useState(true);
  const [gridSize, setGridSize] = useState(20);
  const [snapToGrid, setSnapToGrid] = useState(false);
  const [measurementSystem, setMeasurementSystem] = useState("metric");
  const [ceilingHeight, setCeilingHeight] = useState(240);
  const [defaultView, setDefaultView] = useState("3D");
  const [autoSave, setAutoSave] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const userId = "f9cb7339-fd63-43ea-933d-de84aa0cd524";

  const applyTheme = (t) => {
    if (t === "dark") {
      document.body.style.background = "linear-gradient(135deg,#0f0f1a,#1a1030,#0f1a1a)";
      document.body.style.color = "#e8e0ff";
    } else {
      document.body.style.background = "linear-gradient(135deg,#f0eaff,#eaf0ff,#f5eaff)";
      document.body.style.color = "#2d1f4e";
    }
  };

  useEffect(() => {
    const saved = localStorage.getItem("mauve_theme") || "light";
    setTheme(saved);
    applyTheme(saved);
  }, []);

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
      showMessage("Settings saved! ✨");
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
    localStorage.setItem("mauve_theme", newTheme);
    applyTheme(newTheme);
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
      display: "flex",
      height: "100vh",
      overflow: "hidden",
      fontFamily: "'Afacad','Helvetica Neue',sans-serif",
      background: "linear-gradient(145deg,#f0eaff 0%,#e8f4ff 45%,#f0e8ff 100%)",
    }}>
      <style dangerouslySetInnerHTML={{ __html: css }} />

      {/* ── SHARED SIDEBAR ── */}
      <GlassSidebar />

      {/* ── MAIN CONTENT ── */}
      <main style={{
        flex: 1,
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
        padding: "28px 28px 40px 18px",
        gap: 20,
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
              Customise your workspace, editor &amp; interface preferences
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
              boxShadow: saving ? "none" : "0 12px 36px rgba(109,40,217,0.40)",
              display: "flex", alignItems: "center", gap: 8,
              transition: "all 0.3s",
            }}
          >
            {saving ? "Saving…" : "💾 Save Changes"}
          </motion.button>
        </motion.div>

        {/* TOAST */}
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

        {/* ROW 1: Units & Editor */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
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

        {/* ROW 2: Interface & About */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
          <GlassCard glowColor="rgba(167,139,250,0.3)">
            <SectionHeader title="Interface" subtitle="Appearance and theme" />
            <SettingRow label="Dark Mode" description="Switch to dark appearance">
              <ToggleSwitch value={theme === "dark"} onChange={handleThemeToggle} />
            </SettingRow>
            <SettingRow label="Reduce Motion" description="Minimize animations throughout the UI" last>
              <ToggleSwitch value={reducedMotion} onChange={setReducedMotion} />
            </SettingRow>
          </GlassCard>

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

        {/* DANGER ZONE */}
        <GlassCard glowColor="rgba(239,68,68,0.2)" style={{ padding: 24 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#1e1040", marginBottom: 4 }}>Reset &amp; Danger Zone</div>
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
