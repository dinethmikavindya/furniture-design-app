"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function EditorPage() {
  const router = useRouter();

  useEffect(() => {
    // Try to load most recent project, else go to projects page
    fetch("/api/projects", { credentials: "include" })
      .then(r => r.json())
      .then(data => {
        const projects = data.projects || [];
        if (projects.length > 0) {
          router.replace(`/editor/2d?projectId=${projects[0].id}`);
        } else {
          router.replace("/projects");
        }
      })
      .catch(() => router.replace("/projects"));
  }, []);

  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", fontFamily: "sans-serif", color: "#9b93b8" }}>
      Opening editor...
    </div>
  );
}
