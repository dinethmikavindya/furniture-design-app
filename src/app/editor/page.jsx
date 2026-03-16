"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
export default function EditorPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/editor/2d");
  }, []);
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", fontFamily: "sans-serif", color: "#9b93b8" }}>
      Opening editor...
    </div>
  );
}
