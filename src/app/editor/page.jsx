"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import SidebarLayout, { GlassFilter } from "../../components/layout/SidebarLayout";

// Extracted from original components but styled for Editor Page context

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

function GlassButton({ children, variant = "secondary", style: btnStyle, ...props }) {
    const [hov, setHov] = useState(false);
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
                filter: `url(#\${press ? "gf-press" : "gf-idle"})`,
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

function WelcomeHeader() {
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
          Space{" "}
          <span style={{
            background: "linear-gradient(90deg,#8b5cf6,#ec4899,#60a5fa,#8b5cf6)",
            backgroundSize: "300% auto",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            animation: "shimmer 3s linear infinite",
          }}>Editor</span>
        </h1>
        <p style={{ color: "#9b93b8", fontSize: 14, fontWeight: 500 }}>
          Create and customize your room in 3D 🛠️
        </p>
      </div>
      <div style={{ display: "flex", gap: 12, marginTop: 6 }}>
        <GlassButton variant="secondary">Save Draft</GlassButton>
        <GlassButton variant="primary">
          <span style={{ fontSize: 19, lineHeight: 1 }}>↓</span> Export
        </GlassButton>
      </div>
    </motion.div>
  );
}

export default function EditorPage() {
  return (
    <SidebarLayout>
      <WelcomeHeader />
      <section style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <SectionHeader title="Workspace" />
        
        <motion.div
            initial={{ y: 30, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6, type: "spring", stiffness: 100, damping: 18 }}
            style={{
                flex: 1,
                borderRadius: 26,
                background: "rgba(255,255,255,0.4)",
                backdropFilter: "blur(32px) saturate(200%)",
                border: "1.5px solid rgba(255,255,255,0.6)",
                boxShadow: "0 28px 70px rgba(120,80,220,0.1), 0 8px 32px rgba(0,0,0,0.04), inset 0 2px 10px rgba(255,255,255,0.4)",
                display: "flex", alignItems: "center", justifyContent: "center",
                position: "relative", overflow: "hidden"
            }}
        >
            <div style={{ position: "absolute", inset: 0,
                backgroundImage: "linear-gradient(rgba(139,92,246,0.06) 1px,transparent 1px),linear-gradient(90deg,rgba(139,92,246,0.06) 1px,transparent 1px)",
                backgroundSize: "40px 40px"
              }} />
            
            <div style={{ 
                position: "relative", zIndex: 2, textAlign: "center", 
                background: "rgba(255,255,255,0.7)", padding: "24px 40px",
                borderRadius: 20, border: "1px solid rgba(255,255,255,0.8)",
                boxShadow: "0 8px 24px rgba(0,0,0,0.05)"
            }}>
                <div style={{ fontSize: 42, marginBottom: 12 }}>🏗️</div>
                <h3 style={{ fontSize: 20, fontWeight: 700, color: "#2d1f4e", marginBottom: 8 }}>Editor Loading...</h3>
                <p style={{ fontSize: 14, color: "#6b5b95" }}>3D Canvas initialization in progress</p>
            </div>
            
        </motion.div>
      </section>
    </SidebarLayout>
  );
}
