"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, Environment } from "@react-three/drei";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { TestModel, LoadingFallback } from "@/components/canvas/3d/ModelLoader";

const TEMP_ROOM = {
  name: "My Space",
  width: 5,
  height: 4,
  wallColor: "#e8e0f0",
  floorColor: "#f5f0e8",
};

function Room3D({ config }) {
  const w = config.width;
  const h = config.height;
  const wallHeight = 2.8;

  return (
    <group>
      {/* FLOOR */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[w, h]} />
        <meshStandardMaterial color={config.floorColor} roughness={0.8} />
      </mesh>

      {/* WALLS */}
      <mesh position={[0, wallHeight / 2, -h / 2]} receiveShadow>
        <boxGeometry args={[w, wallHeight, 0.1]} />
        <meshStandardMaterial color={config.wallColor} />
      </mesh>

      <mesh position={[0, wallHeight / 2, h / 2]} receiveShadow>
        <boxGeometry args={[w, wallHeight, 0.1]} />
        <meshStandardMaterial color={config.wallColor} transparent opacity={0.3} />
      </mesh>

      <mesh position={[-w / 2, wallHeight / 2, 0]} receiveShadow>
        <boxGeometry args={[0.1, wallHeight, h]} />
        <meshStandardMaterial color={config.wallColor} />
      </mesh>

      <mesh position={[w / 2, wallHeight / 2, 0]} receiveShadow>
        <boxGeometry args={[0.1, wallHeight, h]} />
        <meshStandardMaterial color={config.wallColor} />
      </mesh>
    </group>
  );
}

function Lights() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[5, 8, 5]}
        intensity={1}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <pointLight position={[-3, 4, -3]} intensity={0.4} color="#ffd4a3" />
    </>
  );
}

export default function Editor3D() {
  const router = useRouter();

  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Afacad:wght@400;500;600;700&display=swap');
    *,*::before,*::after { box-sizing:border-box; margin:0; padding:0; }
    @keyframes shimmer {
      0%   { background-position:-300% center }
      100% { background-position: 300% center }
    }
    @keyframes floatA {
      0%,100% { transform:translateY(0) }
      50%     { transform:translateY(-16px) }
    }
  `;

  return (
    <div style={{
      display: "flex", flexDirection: "column", height: "100vh",
      fontFamily: "'Afacad',sans-serif",
      background: "linear-gradient(135deg,#f0eaff 0%,#e8f4ff 50%,#f0e8ff 100%)",
      overflow: "hidden", position: "relative",
    }}>
      <style dangerouslySetInnerHTML={{ __html: css }} />

      {/* Background orbs */}
      <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", overflow: "hidden" }}>
        <div style={{
          position: "absolute", top: "-10%", left: "-6%", width: 400, height: 400, borderRadius: "50%",
          background: "radial-gradient(circle,rgba(167,139,250,0.22) 0%,transparent 68%)",
          animation: "floatA 9s ease-in-out infinite"
        }} />
      </div>

      {/* TOP BAR */}
      <motion.header
        initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 120, damping: 18 }}
        style={{
          height: 52, display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "0 20px", position: "relative", zIndex: 30,
          background: "rgba(255,255,255,0.18)", backdropFilter: "blur(24px)",
          borderBottom: "1px solid rgba(255,255,255,0.45)", flexShrink: 0,
        }}
      >
        <span style={{ fontSize: 18, fontWeight: 700, color: "#2d1f4e", cursor: "pointer" }}>
          Mauve Studio<span style={{ color: "#8b5cf6" }}>.</span>
        </span>

        <div style={{
          display: "flex", gap: 4, background: "rgba(255,255,255,0.35)",
          border: "1px solid rgba(255,255,255,0.6)", borderRadius: 50, padding: "3px",
        }}>
          <button onClick={() => router.push("/editor/2d")}
            style={{ padding: "5px 20px", borderRadius: 50, border: "none",
              background: "transparent", fontSize: 13, fontWeight: 600,
              color: "#6b5b95", cursor: "pointer" }}>2D Plan</button>
          <div style={{
            padding: "5px 20px", borderRadius: 50,
            background: "linear-gradient(135deg,#8b5cf6,#6d28d9)",
            fontSize: 13, fontWeight: 700, color: "#fff",
          }}>3D View</div>
        </div>
      </motion.header>

      {/* 3D CANVAS */}
      <div style={{ flex: 1, position: "relative", zIndex: 10 }}>
        <Canvas shadows>
          <Suspense fallback={<LoadingFallback />}>
            <PerspectiveCamera makeDefault position={[4, 3, 4]} fov={60} />
            <OrbitControls enableDamping dampingFactor={0.05} />
            <Lights />
            <Room3D config={TEMP_ROOM} />
            
            {/* Load the downloaded 3D model */}
            <TestModel position={[0, 0.5, 0]} scale={0.5} />
            
            <Environment preset="apartment" />
          </Suspense>
        </Canvas>

        {/* Controls */}
        <div style={{
          position: "absolute", bottom: 20, left: 20, zIndex: 20,
          padding: "12px 18px", borderRadius: 16,
          background: "rgba(255,255,255,0.25)", backdropFilter: "blur(20px)",
          border: "1px solid rgba(255,255,255,0.6)",
          fontSize: 12, color: "#6b5b95", fontWeight: 600,
        }}>
          <div>Drag to rotate • Scroll to zoom</div>
          <div style={{ marginTop: 4, fontSize: 11, color: "#9b93b8" }}>
            3D Model loaded: test.glb
          </div>
        </div>
      </div>
    </div>
  );
}
