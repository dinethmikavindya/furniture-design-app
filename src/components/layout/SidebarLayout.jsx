"use client";
import GlassSidebar from "@/components/GlassSidebar";

export default function SidebarLayout({ children }) {
  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden", background: "linear-gradient(135deg,#f0eaff 0%,#e8f4ff 50%,#f0e8ff 100%)" }}>
      <GlassSidebar />
      <div style={{ flex: 1, overflowY: "auto" }}>
        {children}
      </div>
    </div>
  );
}
