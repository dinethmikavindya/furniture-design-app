"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import GlassSidebar from "@/components/GlassSidebar";

export default function AccountPage() {
  const { user, logout } = useAuth();

  const [currentPw, setCurrentPw]     = useState("");
  const [newPw, setNewPw]             = useState("");
  const [confirmPw, setConfirmPw]     = useState("");
  const [pwLoading, setPwLoading]     = useState(false);
  const [pwSuccess, setPwSuccess]     = useState("");
  const [pwError, setPwError]         = useState("");
  const [showDelete, setShowDelete]   = useState(false);
  const [deleteEmail, setDeleteEmail] = useState("");
  const [deleteError, setDeleteError] = useState("");

  const getInitials = (name) => {
    if (!name) return "U";
    const p = name.trim().split(" ");
    return p.length >= 2 ? (p[0][0] + p[1][0]).toUpperCase() : p[0].slice(0,2).toUpperCase();
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPwError(""); setPwSuccess("");
    if (newPw !== confirmPw) { setPwError("Passwords don't match."); return; }
    if (newPw.length < 8) { setPwError("Password must be at least 8 characters."); return; }
    setPwLoading(true);
    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ currentPassword: currentPw, newPassword: newPw }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setPwSuccess("Password updated successfully.");
        setCurrentPw(""); setNewPw(""); setConfirmPw("");
      } else {
        setPwError(data.error || "Failed to update password.");
      }
    } catch { setPwError("Connection error."); }
    setPwLoading(false);
  };

  const handleDeleteAccount = async () => {
    if (deleteEmail !== user?.email) { setDeleteError("Email doesn't match."); return; }
    try {
      await fetch("/api/auth/delete-account", { method: "DELETE", credentials: "include" });
      await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
      logout();
      window.location.href = "/login";
    } catch { setDeleteError("Connection error."); }
  };

  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Afacad:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    @keyframes floatA { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-18px)} }
    @keyframes floatB { 0%,100%{transform:translateY(0)} 50%{transform:translateY(14px)} }
    @keyframes pulse  { 0%,100%{opacity:1} 50%{opacity:0.5} }
    .acc-input {
      width: 100%; padding: 12px 16px; border-radius: 14px;
      border: 1.5px solid rgba(255,255,255,0.65);
      background: rgba(255,255,255,0.35);
      font-size: 14px; font-family: 'Afacad', sans-serif; color: #2d1f4e;
      outline: none; transition: border 0.2s, background 0.2s;
    }
    .acc-input:focus { border-color: rgba(139,92,246,0.6); background: rgba(255,255,255,0.55); }
    .acc-input::placeholder { color: #b0a0cc; }
    ::-webkit-scrollbar { width: 4px; }
    ::-webkit-scrollbar-thumb { background: rgba(139,92,246,0.3); border-radius: 4px; }
  `;

  return (
    <div style={{
      display: "flex",
      minHeight: "100vh",
      fontFamily: "'Afacad', sans-serif",
      background: "linear-gradient(145deg,#f0eaff 0%,#e8f4ff 45%,#f0e8ff 100%)",
    }}>
      <style suppressHydrationWarning dangerouslySetInnerHTML={{ __html: css }} />

      {/* BG orbs */}
      <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}>
        <div style={{ position: "absolute", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle,rgba(167,139,250,0.18) 0%,transparent 70%)", top: "-15%", right: "-8%", animation: "floatA 18s ease-in-out infinite" }} />
        <div style={{ position: "absolute", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle,rgba(96,165,250,0.12) 0%,transparent 70%)", bottom: "-10%", left: "-6%", animation: "floatB 22s ease-in-out infinite" }} />
      </div>

      {/* Sidebar */}
      <GlassSidebar />

      {/* Main — fills everything after sidebar */}
      <div style={{
        marginLeft: 240,
        flex: 1,
        padding: "40px 48px",
        position: "relative",
        zIndex: 1,
        overflowY: "auto",
        minHeight: "100vh",
      }}>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 32 }}>
          <div style={{ fontSize: 26, fontWeight: 800, color: "#2d1f4e", letterSpacing: "-0.3px" }}>Account</div>
          <div style={{ fontSize: 14, color: "#9b93b8", marginTop: 4 }}>Manage your profile and preferences</div>
        </motion.div>

        {/* Two-column grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>

          {/* Profile card */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            style={{ borderRadius: 20, background: "rgba(255,255,255,0.22)", backdropFilter: "blur(32px)", border: "1.5px solid rgba(255,255,255,0.65)", boxShadow: "0 8px 32px rgba(120,80,220,0.08)", padding: "28px 32px" }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#2d1f4e", marginBottom: 20 }}>Profile</div>

            {/* Avatar row */}
            <div style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 24 }}>
              <div style={{ position: "relative", flexShrink: 0 }}>
                <div style={{ position: "absolute", inset: -4, borderRadius: "50%", background: "linear-gradient(135deg,#8b5cf6,#60a5fa,#ec4899)", animation: "pulse 3s ease-in-out infinite" }} />
                <div style={{ width: 64, height: 64, borderRadius: "50%", background: "linear-gradient(135deg,#8b5cf6,#6d28d9)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, fontWeight: 800, color: "#fff", position: "relative" }}>
                  {getInitials(user?.name || "")}
                </div>
              </div>
              <div>
                <div style={{ fontSize: 18, fontWeight: 700, color: "#2d1f4e" }}>{user?.name || "User"}</div>
                <div style={{ fontSize: 13, color: "#9b93b8", marginTop: 2 }}>{user?.email || ""}</div>
                <div style={{ display: "inline-block", marginTop: 6, padding: "3px 12px", borderRadius: 50, background: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.2)", fontSize: 11, fontWeight: 700, color: "#8b5cf6" }}>Free Plan</div>
              </div>
            </div>

            {/* Info grid */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {[
                { label: "Full Name",      value: user?.name  || "—" },
                { label: "Email Address",  value: user?.email || "—" },
                { label: "Member Since",   value: "March 2026" },
                { label: "Account ID",     value: user?.id ? user.id.slice(0,8) + "…" : "—" },
              ].map(({ label, value }) => (
                <div key={label} style={{ padding: "12px 14px", borderRadius: 12, background: "rgba(255,255,255,0.35)", border: "1px solid rgba(255,255,255,0.6)" }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: "#9b93b8", letterSpacing: "0.5px", textTransform: "uppercase", marginBottom: 4 }}>{label}</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#2d1f4e", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{value}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Change Password card */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
            style={{ borderRadius: 20, background: "rgba(255,255,255,0.22)", backdropFilter: "blur(32px)", border: "1.5px solid rgba(255,255,255,0.65)", boxShadow: "0 8px 32px rgba(120,80,220,0.08)", padding: "28px 32px" }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#2d1f4e", marginBottom: 20 }}>Change Password</div>

            <form onSubmit={handleChangePassword} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#9b93b8", letterSpacing: "0.6px", textTransform: "uppercase", marginBottom: 6 }}>Current Password</div>
                <input type="password" value={currentPw} onChange={e => setCurrentPw(e.target.value)} placeholder="Enter current password" required className="acc-input" />
              </div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#9b93b8", letterSpacing: "0.6px", textTransform: "uppercase", marginBottom: 6 }}>New Password</div>
                <input type="password" value={newPw} onChange={e => setNewPw(e.target.value)} placeholder="Min 8 characters" required className="acc-input" />
              </div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#9b93b8", letterSpacing: "0.6px", textTransform: "uppercase", marginBottom: 6 }}>Confirm New Password</div>
                <input type="password" value={confirmPw} onChange={e => setConfirmPw(e.target.value)} placeholder="Repeat new password" required className="acc-input" />
              </div>

              <AnimatePresence>
                {pwError && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ padding: "10px 14px", borderRadius: 12, background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)", color: "#dc2626", fontSize: 13, fontWeight: 600 }}>{pwError}</motion.div>}
                {pwSuccess && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ padding: "10px 14px", borderRadius: 12, background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.25)", color: "#059669", fontSize: 13, fontWeight: 600 }}>{pwSuccess}</motion.div>}
              </AnimatePresence>

              <motion.button type="submit" disabled={pwLoading} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                style={{ width: "100%", padding: "12px", borderRadius: 50, border: "none", cursor: pwLoading ? "not-allowed" : "pointer", background: pwLoading ? "rgba(139,92,246,0.4)" : "linear-gradient(135deg,#8b5cf6,#6d28d9)", color: "#fff", fontSize: 13, fontWeight: 700, fontFamily: "'Afacad', sans-serif", boxShadow: "0 4px 16px rgba(109,40,217,0.3)", marginTop: 4 }}>
                {pwLoading ? "Updating…" : "Update Password"}
              </motion.button>
            </form>
          </motion.div>
        </div>

        {/* Danger Zone — full width */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          style={{ borderRadius: 20, background: "rgba(255,240,240,0.18)", backdropFilter: "blur(32px)", border: "1.5px solid rgba(239,68,68,0.2)", boxShadow: "0 8px 32px rgba(120,80,220,0.08)", padding: "28px 32px" }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: "#dc2626", marginBottom: 16 }}>Danger Zone</div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: "#2d1f4e", marginBottom: 4 }}>Delete Account</div>
              <div style={{ fontSize: 13, color: "#9b93b8" }}>Permanently delete your account and all your projects. This cannot be undone.</div>
            </div>
            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => setShowDelete(true)}
              style={{ padding: "10px 24px", borderRadius: 50, border: "1.5px solid rgba(239,68,68,0.4)", background: "rgba(239,68,68,0.08)", color: "#dc2626", cursor: "pointer", fontSize: 13, fontWeight: 700, fontFamily: "'Afacad', sans-serif", flexShrink: 0 }}>
              Delete Account
            </motion.button>
          </div>
        </motion.div>

      </div>

      {/* Delete modal */}
      <AnimatePresence>
        {showDelete && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowDelete(false)}
            style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(45,31,78,0.4)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0 }} onClick={e => e.stopPropagation()}
              style={{ width: "100%", maxWidth: 400, borderRadius: 24, background: "rgba(255,255,255,0.9)", backdropFilter: "blur(40px)", border: "1.5px solid rgba(255,255,255,0.8)", boxShadow: "0 32px 80px rgba(120,80,220,0.2)", padding: "32px" }}>
              <div style={{ fontSize: 18, fontWeight: 800, color: "#dc2626", marginBottom: 10 }}>Delete Account</div>
              <div style={{ fontSize: 14, color: "#6b5b95", marginBottom: 20, lineHeight: 1.6 }}>This will permanently delete your account. Type your email to confirm.</div>
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#9b93b8", letterSpacing: "0.6px", textTransform: "uppercase", marginBottom: 6 }}>Your Email</div>
                <input type="email" value={deleteEmail} onChange={e => { setDeleteEmail(e.target.value); setDeleteError(""); }} placeholder={user?.email || "your@email.com"} className="acc-input" />
              </div>
              {deleteError && <div style={{ marginBottom: 14, color: "#dc2626", fontSize: 13, fontWeight: 600 }}>{deleteError}</div>}
              <div style={{ display: "flex", gap: 10 }}>
                <button onClick={() => { setShowDelete(false); setDeleteEmail(""); setDeleteError(""); }}
                  style={{ flex: 1, padding: "11px", borderRadius: 50, border: "1.5px solid rgba(139,92,246,0.3)", background: "transparent", color: "#6b5b95", cursor: "pointer", fontSize: 13, fontWeight: 700, fontFamily: "'Afacad', sans-serif" }}>
                  Cancel
                </button>
                <button onClick={handleDeleteAccount}
                  style={{ flex: 1, padding: "11px", borderRadius: 50, border: "none", background: "linear-gradient(135deg,#ef4444,#dc2626)", color: "#fff", cursor: "pointer", fontSize: 13, fontWeight: 700, fontFamily: "'Afacad', sans-serif" }}>
                  Delete Forever
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
