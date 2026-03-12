"use client";

import { Suspense, useEffect, useState, useRef, useCallback } from "react";
import React from "react";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, useGLTF } from "@react-three/drei";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import * as THREE from "three";

function getModelPath(type) {
  const map = {
    "sofa-2":"/models/loungeSofa.glb","sofa-3":"/models/loungeSofaLong.glb",
    "sofa-l":"/models/loungeSofaCorner.glb","sofa-1":"/models/loungeChair.glb",
    "sofa-ottoman":"/models/loungeSofaOttoman.glb",
    "bed-s":"/models/bedSingle.glb","bed-d":"/models/bedDouble.glb","bed-k":"/models/bedDouble.glb",
    "bed-bunk":"/models/bedBunk.glb",
    "chair-a":"/models/loungeChair.glb","chair-d":"/models/chair.glb",
    "chair-o":"/models/chairDesk.glb","chair":"/models/chair.glb",
    "chair-cushion":"/models/chairCushion.glb","chair-modern":"/models/chairModernCushion.glb",
    "chair-rounded":"/models/chairRounded.glb",
    "table-c":"/models/tableCoffee.glb","table-d":"/models/table.glb",
    "table-s":"/models/sideTable.glb","table-glass":"/models/tableGlass.glb",
    "table-round":"/models/tableRound.glb","table-cross":"/models/tableCross.glb",
    "ward":"/models/bookcaseClosedWide.glb","book":"/models/bookcaseOpen.glb",
    "bookcase-closed":"/models/bookcaseClosed.glb","dress":"/models/cabinetBed.glb",
    "cabinet-tv":"/models/cabinetTelevision.glb",
    "plant":"/models/pottedPlant.glb","plant-s1":"/models/plantSmall1.glb",
    "plant-s2":"/models/plantSmall2.glb","plant-s3":"/models/plantSmall3.glb",
    "lamp":"/models/lampRoundFloor.glb","lamp-table-r":"/models/lampRoundTable.glb",
    "lamp-sq-f":"/models/lampSquareFloor.glb","lamp-sq-t":"/models/lampSquareTable.glb",
    "rug":"/models/rugRectangle.glb","rug-round":"/models/rugRound.glb",
    "rug-square":"/models/rugSquare.glb","rug-doormat":"/models/rugDoormat.glb",
    "pillow":"/models/pillow.glb","books":"/models/books.glb",
    "speaker":"/models/speaker.glb","bench":"/models/bench.glb",
    "stool-bar":"/models/stoolBar.glb","desk":"/models/desk.glb",
    "desk-corner":"/models/deskCorner.glb","laptop":"/models/laptop.glb",
    "coat-rack":"/models/coatRack.glb","coat-stand":"/models/coatRackStanding.glb",
    "kitchen-sink":"/models/kitchenSink.glb","kitchen-stove":"/models/kitchenStove.glb",
    "kitchen-fridge":"/models/kitchenFridge.glb","kitchen-micro":"/models/kitchenMicrowave.glb",
    "kitchen-cabinet":"/models/kitchenCabinet.glb","kitchen-bar":"/models/kitchenBar.glb",
    "bath-sink":"/models/bathroomSink.glb","bathtub":"/models/bathtub.glb",
    "toilet":"/models/toilet.glb","shower":"/models/shower.glb",
    "tv-modern":"/models/televisionModern.glb","tv-vintage":"/models/televisionVintage.glb",
    "washer":"/models/washer.glb","dryer":"/models/dryer.glb","trashcan":"/models/trashcan.glb",
  };
  return map[type] || "/models/chair.glb";
}

const PX_PER_METRE = 80;
const WALL_H = 2.8;

// Sun simulation — given hour 0-24 returns all lighting params
function getSunParams(hour) {
  // Sun arc: rises at 6, sets at 20
  const sunAngle = ((hour - 6) / 14) * Math.PI; // 0=east, PI/2=overhead, PI=west
  const isDay = hour >= 6 && hour <= 20;
  const isDawn = hour >= 5 && hour < 8;
  const isDusk = hour >= 18 && hour <= 21;
  const isNight = hour < 5 || hour > 21;

  // Sun position on arc
  const arcRadius = 20;
  const sunX = Math.cos(Math.PI - sunAngle) * arcRadius;
  const sunY = Math.max(0.1, Math.sin(sunAngle) * arcRadius);
  const sunZ = -arcRadius * 0.3;

  // Light intensity
  let ambient, dirIntensity;
  if (isNight) { ambient = 0.2; dirIntensity = 0.25; }
  else if (isDawn || isDusk) { ambient = 0.7; dirIntensity = 0.9; }
  else { ambient = 1.3; dirIntensity = 1.6; }

  // Sun color
  let r, g, b;
  if (isNight) { r = 0.15; g = 0.2; b = 0.5; }
  else if (hour >= 5 && hour < 7) { r = 0.95; g = 0.78; b = 0.58; } // soft sunrise
  else if (hour >= 7 && hour < 10) { r = 1.0; g = 0.75; b = 0.45; } // morning gold
  else if (hour >= 10 && hour < 16) { r = 1.0; g = 0.97; b = 0.9; } // midday white
  else if (hour >= 16 && hour < 19) { r = 1.0; g = 0.65; b = 0.25; } // afternoon gold
  else if (hour >= 19 && hour < 21) { r = 0.88; g = 0.62; b = 0.42; } // muted sunset
  else { r = 0.15; g = 0.2; b = 0.5; }

  // Background sky gradient
  let bg;
  if (isNight) bg = "#1a1a28";
  else if (hour >= 5 && hour < 7) bg = "linear-gradient(180deg,#d8cfc8 0%,#e8ddd4 100%)";
  else if (hour >= 7 && hour < 9) bg = "linear-gradient(180deg,#dde4ea 0%,#eae4dc 100%)";
  else if (hour >= 9 && hour < 17) bg = "linear-gradient(180deg,#e8eef4 0%,#edeaf4 100%)";
  else if (hour >= 17 && hour < 19) bg = "linear-gradient(180deg,#d4cac0 0%,#c8b8a8 100%)";
  else if (hour >= 19 && hour < 21) bg = "linear-gradient(180deg,#282030 0%,#201828 100%)";
  else bg = "#1a1a28";

  const timeLabel = `${String(Math.floor(hour)).padStart(2,'0')}:${String(Math.round((hour%1)*60)).padStart(2,'0')}`;

  return { sunX, sunY, sunZ, ambient, dirIntensity, r, g, b, bg, isNight, timeLabel };
}

function CameraController({ topDown, roomWidth, roomDepth, orbitRef }) {
  const { camera } = useThree();
  const targetPos = useRef(new THREE.Vector3());
  const animating = useRef(false);

  useEffect(() => {
    const maxDim = Math.max(roomWidth, roomDepth);
    if (topDown) {
      targetPos.current.set(0, maxDim * 2.2, 0.001);
      if (orbitRef.current) orbitRef.current.enabled = false;
    } else {
      targetPos.current.set(maxDim * 1.2, maxDim * 1.0, maxDim * 1.2);
      if (orbitRef.current) orbitRef.current.enabled = true;
    }
    animating.current = true;
  }, [topDown, roomWidth, roomDepth]);

  useFrame(() => {
    if (!animating.current) return;
    camera.position.lerp(targetPos.current, 0.1);
    if (camera.position.distanceTo(targetPos.current) < 0.01) {
      camera.position.copy(targetPos.current);
      animating.current = false;
    }
    camera.lookAt(0, 0.5, 0);
    camera.updateProjectionMatrix();
  });

  return null;
}

// Invisible floor plane for raycasting drag
function DragPlane({ onPointerMove, onPointerUp }) {
  return (
    <mesh
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, 0.01, 0]}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      visible={false}
    >
      <planeGeometry args={[200, 200]} />
      <meshBasicMaterial />
    </mesh>
  );
}

function FurnitureModelInner({ item, roomWidth, roomHeight, isSelected, onSelect, onMove, isDragging, setIsDragging, orbitRef }) {
  const { scene } = useGLTF(getModelPath(item.type));
  const meshRef = useRef();
  const didDrag = useRef(false);
  const pointerDownPos = useRef(null);

  const cloned = useRef(null);
  if (!cloned.current) {
    cloned.current = scene.clone(true);
    cloned.current.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        const src = child.material;
        const rawColor = src?.color instanceof THREE.Color ? src.color.clone() : new THREE.Color(0.8, 0.8, 0.8);
        child.material = new THREE.MeshStandardMaterial({
          color: new THREE.Color(
            Math.pow(rawColor.r, 1 / 2.2),
            Math.pow(rawColor.g, 1 / 2.2),
            Math.pow(rawColor.b, 1 / 2.2)
          ),
          roughness: src?.roughness ?? 0.8,
          metalness: src?.metalness ?? 0.0,
          map: src?.map || null,
        });
      }
    });
  }

  useEffect(() => {
    if (!cloned.current) return;
    cloned.current.traverse((child) => {
      if (child.isMesh && child.material) {
        child.material.emissive = isSelected ? new THREE.Color(0.3, 0.1, 0.7) : new THREE.Color(0, 0, 0);
        child.material.emissiveIntensity = isSelected ? 0.3 : 0;
        child.material.needsUpdate = true;
      }
    });
  }, [isSelected]);

  const box = new THREE.Box3().setFromObject(cloned.current);
  const nativeSize = new THREE.Vector3();
  box.getSize(nativeSize);
  const targetW = item.w / PX_PER_METRE;
  const targetD = item.h / PX_PER_METRE;
  const scaleX = nativeSize.x > 0 ? targetW / nativeSize.x : 1;
  const scaleZ = nativeSize.z > 0 ? targetD / nativeSize.z : 1;
  const scaleY = (scaleX + scaleZ) / 2;
  cloned.current.scale.set(scaleX, scaleY, scaleZ);
  const scaledBox = new THREE.Box3().setFromObject(cloned.current);
  const yOffset = -scaledBox.min.y;
  const x3d = item.x / PX_PER_METRE - roomWidth / 2 + targetW / 2;
  const z3d = item.y / PX_PER_METRE - roomHeight / 2 + targetD / 2;

  const handlePointerDown = (e) => {
    e.stopPropagation();
    pointerDownPos.current = { x: e.clientX, y: e.clientY };
    didDrag.current = false;
    if (isSelected) {
      // start drag — disable orbit
      setIsDragging(item.id);
      if (orbitRef.current) orbitRef.current.enabled = false;
    }
  };

  const handlePointerUp = (e) => {
    e.stopPropagation();
    if (!didDrag.current) {
      onSelect(item.id);
    }
    setIsDragging(null);
    if (orbitRef.current) orbitRef.current.enabled = true;
  };

  return (
    <group ref={meshRef} position={[x3d, yOffset, z3d]} rotation={[0, ((item.rotation || 0) * Math.PI) / 180, 0]}>
      <primitive
        object={cloned.current}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
      />
      {isSelected && (
        <mesh position={[0, -yOffset + 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[targetW + 0.1, targetD + 0.1]} />
          <meshBasicMaterial color="#8b5cf6" transparent opacity={0.2} depthWrite={false} />
        </mesh>
      )}
    </group>
  );
}

function FurnitureFallback({ item, roomWidth, roomHeight }) {
  const targetW = item.w / PX_PER_METRE;
  const targetD = item.h / PX_PER_METRE;
  const x3d = item.x / PX_PER_METRE - roomWidth / 2 + targetW / 2;
  const z3d = item.y / PX_PER_METRE - roomHeight / 2 + targetD / 2;
  return (
    <mesh position={[x3d, 0.25, z3d]}>
      <boxGeometry args={[targetW, 0.5, targetD]} />
      <meshStandardMaterial color="#c4b5fd" opacity={0.7} transparent />
    </mesh>
  );
}

class FurnitureErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { hasError: false }; }
  static getDerivedStateFromError() { return { hasError: true }; }
  render() {
    if (this.state.hasError) return <FurnitureFallback {...this.props} />;
    return this.props.children;
  }
}

function FurnitureModel(props) {
  return (
    <FurnitureErrorBoundary item={props.item} roomWidth={props.roomWidth} roomHeight={props.roomHeight}>
      <Suspense fallback={<FurnitureFallback item={props.item} roomWidth={props.roomWidth} roomHeight={props.roomHeight} />}>
        <FurnitureModelInner {...props} />
      </Suspense>
    </FurnitureErrorBoundary>
  );
}

function SceneContent({ furniture, roomConfig, selectedId, onSelect, onMove, isDragging, setIsDragging, orbitRef, envPreset }) {
  const maxDim = Math.max(roomConfig.width, roomConfig.height);
  const sun = getSunParams(envPreset);
  const w = roomConfig.width;
  const d = roomConfig.height;
  const wallT = 0.1;
  const gridColor = new THREE.Color(0.72, 0.69, 0.75);

  const handleDragPlaneMove = (e) => {
    if (!isDragging) return;
    const item = furniture.find(f => f.id === isDragging);
    if (!item) return;
    const targetW = item.w / PX_PER_METRE;
    const targetD = item.h / PX_PER_METRE;
    const px = e.point.x;
    const pz = e.point.z;
    const newX = Math.max(0, Math.min(w * PX_PER_METRE - item.w, (px + w / 2 - targetW / 2) * PX_PER_METRE));
    const newZ = Math.max(0, Math.min(d * PX_PER_METRE - item.h, (pz + d / 2 - targetD / 2) * PX_PER_METRE));
    onMove(isDragging, newX, newZ);
  };

  const handleDragPlaneUp = () => {
    setIsDragging(null);
    if (orbitRef.current) orbitRef.current.enabled = true;
  };

  return (
    <>
      <ambientLight intensity={sun.ambient} color={sun.isNight ? "#1a2050" : "#ffffff"} />
      <directionalLight
        position={[sun.sunX, sun.sunY, sun.sunZ]}
        intensity={sun.dirIntensity}
        color={new THREE.Color(sun.r, sun.g, sun.b)}
        castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048}
        shadow-camera-left={-15} shadow-camera-right={15} shadow-camera-top={15} shadow-camera-bottom={-15} shadow-bias={-0.001}
      />
      <directionalLight position={[-maxDim * 0.5, maxDim * 0.3, maxDim * 0.5]} intensity={sun.ambient * 0.25} color="#c8d8ff" />
      <pointLight position={[0, WALL_H * 0.85, 0]} intensity={sun.isNight ? 0.8 : 0.3} color={sun.isNight ? "#ffd4a0" : "#fff8f0"} distance={maxDim * 4} />
      {/* Visible sun/moon sphere in the sky */}
      <mesh position={[sun.sunX, sun.sunY, sun.sunZ]}>
        <sphereGeometry args={[0.35, 16, 16]} />
        <meshBasicMaterial color={new THREE.Color(sun.r, sun.g, sun.b)} />
      </mesh>
      {/* Sun glow halo */}
      {!sun.isNight && (
        <mesh position={[sun.sunX, sun.sunY, sun.sunZ]}>
          <sphereGeometry args={[0.65, 16, 16]} />
          <meshBasicMaterial color={new THREE.Color(sun.r, sun.g, sun.b)} transparent opacity={0.18} />
        </mesh>
      )}

      {/* Room */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[w, d]} />
        <meshStandardMaterial color={new THREE.Color(roomConfig.floorColor)} roughness={0.9} />
      </mesh>
      {Array.from({ length: Math.ceil(w) + 1 }).map((_, i) => (
        <mesh key={"gx" + i} position={[-w / 2 + i, 0.003, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.008, d]} /><meshBasicMaterial color={gridColor} transparent opacity={0.4} />
        </mesh>
      ))}
      {Array.from({ length: Math.ceil(d) + 1 }).map((_, i) => (
        <mesh key={"gz" + i} position={[0, 0.003, -d / 2 + i]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[w, 0.008]} /><meshBasicMaterial color={gridColor} transparent opacity={0.4} />
        </mesh>
      ))}
      <mesh position={[0, WALL_H / 2, -d / 2 - wallT / 2]} castShadow receiveShadow>
        <boxGeometry args={[w + wallT * 2, WALL_H, wallT]} /><meshStandardMaterial color={new THREE.Color(roomConfig.wallColor)} roughness={0.92} />
      </mesh>
      <mesh position={[-w / 2 - wallT / 2, WALL_H / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[wallT, WALL_H, d]} /><meshStandardMaterial color={new THREE.Color(roomConfig.wallColor)} roughness={0.92} />
      </mesh>
      <mesh position={[w / 2 + wallT / 2, WALL_H / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[wallT, WALL_H, d]} /><meshStandardMaterial color={new THREE.Color(roomConfig.wallColor)} roughness={0.92} />
      </mesh>
      <mesh position={[0, WALL_H / 2, d / 2 + wallT / 2]}>
        <boxGeometry args={[w + wallT * 2, WALL_H, wallT]} /><meshStandardMaterial color={new THREE.Color(roomConfig.wallColor)} transparent opacity={0.08} roughness={0.92} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, WALL_H, 0]}>
        <planeGeometry args={[w, d]} /><meshStandardMaterial color={new THREE.Color(roomConfig.wallColor)} roughness={1} side={THREE.BackSide} />
      </mesh>

      {/* Drag plane — only active when dragging */}
      {isDragging && <DragPlane onPointerMove={handleDragPlaneMove} onPointerUp={handleDragPlaneUp} />}

      {furniture.map(item => (
        <FurnitureModel
          key={item.id} item={item}
          roomWidth={roomConfig.width} roomHeight={roomConfig.height}
          isSelected={item.id === selectedId}
          isDragging={isDragging}
          setIsDragging={setIsDragging}
          onSelect={onSelect}
          onMove={onMove}
          orbitRef={orbitRef}
        />
      ))}
    </>
  );
}

export default function Editor3D() {
  const router = useRouter();
  const orbitRef = useRef();
  const [furniture, setFurniture] = useState([]);
  const [roomConfig, setRoomConfig] = useState({ name: "My Space", width: 5, height: 4, wallColor: "#e8e0f0", floorColor: "#f5f0e8" });
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState(null);
  const [draggingId, setDraggingId] = useState(null);
  const [screenshotMsg, setScreenshotMsg] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [topDown, setTopDown] = useState(false);
  const [timeOfDay, setTimeOfDay] = useState(12);

  useEffect(() => {
    setMounted(true);
    try {
      const f = localStorage.getItem("mauve_furniture");
      const r = localStorage.getItem("mauve_room");
      if (f) setFurniture(JSON.parse(f));
      if (r) setRoomConfig(JSON.parse(r));
    } catch (e) { console.error(e); }
    setLoading(false);
  }, []);

  const saveToStorage = (updated) => {
    setFurniture(updated);
    try { localStorage.setItem("mauve_furniture", JSON.stringify(updated)); } catch (e) {}
  };

  const handleMove = useCallback((id, x, y) => {
    setFurniture(prev => prev.map(f => f.id === id ? { ...f, x, y } : f));
  }, []);

  const handleSelect = useCallback((id) => {
    setSelectedId(prev => prev === id ? null : id);
  }, []);

  const handleRotate = () => {
    if (!selectedId) return;
    saveToStorage(furniture.map(f => f.id === selectedId ? { ...f, rotation: ((f.rotation || 0) + 90) % 360 } : f));
  };

  const handleDelete = () => {
    if (!selectedId) return;
    saveToStorage(furniture.filter(f => f.id !== selectedId));
    setSelectedId(null);
  };

  const handleScreenshot = () => {
    const canvas = document.querySelector("canvas");
    if (!canvas) return;
    try {
      const link = document.createElement("a");
      link.download = `mauve-room-${Date.now()}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
      setScreenshotMsg(true);
      setTimeout(() => setScreenshotMsg(false), 2500);
    } catch (e) { console.error(e); }
  };

  const selectedItem = furniture.find(f => f.id === selectedId);
  const sunParams = getSunParams(timeOfDay);
  const isEvening = timeOfDay < 7 || timeOfDay > 19;
  if (!mounted) return null;

  return (
    <div style={{
      display: "flex", flexDirection: "column", height: "100vh",
      fontFamily: "system-ui, sans-serif",
      background: sunParams.bg,
      overflow: "hidden", transition: "background 0.8s ease",
    }}>
      <motion.header
        initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 120, damping: 18 }}
        style={{
          height: 52, display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "0 20px", zIndex: 30,
          background: isEvening ? "rgba(20,10,40,0.55)" : "rgba(255,255,255,0.18)",
          backdropFilter: "blur(24px)",
          borderBottom: isEvening ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(255,255,255,0.45)",
          flexShrink: 0,
        }}
      >
        <span onClick={() => router.push("/dashboard")}
          style={{ fontSize: 18, fontWeight: 700, color: isEvening ? "#e0d0ff" : "#2d1f4e", cursor: "pointer" }}>
          Mauve Studio<span style={{ color: "#8b5cf6" }}>.</span>
        </span>
        <div style={{
          display: "flex", gap: 4,
          background: isEvening ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.35)",
          border: isEvening ? "1px solid rgba(255,255,255,0.15)" : "1px solid rgba(255,255,255,0.6)",
          borderRadius: 50, padding: "3px",
        }}>
          <button onClick={() => router.push("/editor/2d")} style={{
            padding: "5px 20px", borderRadius: 50, border: "none", background: "transparent",
            fontSize: 13, fontWeight: 600, color: isEvening ? "#b8a0d8" : "#6b5b95", cursor: "pointer",
          }}>2D Plan</button>
          <div style={{
            padding: "5px 20px", borderRadius: 50,
            background: "linear-gradient(135deg,#8b5cf6,#6d28d9)",
            fontSize: 13, fontWeight: 700, color: "#fff", boxShadow: "0 4px 14px rgba(109,40,217,0.35)",
          }}>3D View</div>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleScreenshot}
            style={{
              padding: "7px 16px", borderRadius: 50, border: "1px solid rgba(139,92,246,0.3)",
              fontFamily: "system-ui, sans-serif", fontSize: 12, fontWeight: 700,
              color: isEvening ? "#c4b5fd" : "#6d28d9", cursor: "pointer",
              background: isEvening ? "rgba(139,92,246,0.2)" : "rgba(139,92,246,0.12)",
            }}>
            {screenshotMsg ? "Saved!" : "Screenshot"}
          </motion.button>
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setTopDown(v => !v)}
            style={{
              padding: "7px 16px", borderRadius: 50,
              border: topDown ? "1px solid #8b5cf6" : "1px solid rgba(139,92,246,0.3)",
              fontFamily: "system-ui, sans-serif", fontSize: 12, fontWeight: 700,
              color: topDown ? "#fff" : (isEvening ? "#c4b5fd" : "#6d28d9"), cursor: "pointer",
              background: topDown ? "linear-gradient(135deg,#8b5cf6,#6d28d9)" : (isEvening ? "rgba(139,92,246,0.2)" : "rgba(139,92,246,0.12)"),
            }}>
            {topDown ? "3D View" : "Top View"}
          </motion.button>
          <div style={{
            display: "flex", gap: 6, alignItems: "center", fontSize: 12, fontWeight: 600,
            color: isEvening ? "#c4b5fd" : "#8b5cf6", padding: "6px 14px", borderRadius: 50,
            background: isEvening ? "rgba(139,92,246,0.2)" : "rgba(139,92,246,0.10)",
            border: isEvening ? "1px solid rgba(139,92,246,0.3)" : "1px solid rgba(139,92,246,0.15)",
          }}>
            <div style={{ width: 9, height: 9, borderRadius: 2, background: roomConfig.wallColor, border: "1px solid rgba(255,255,255,0.3)" }} />
            <div style={{ width: 9, height: 9, borderRadius: 2, background: roomConfig.floorColor, border: "1px solid rgba(255,255,255,0.3)" }} />
            {roomConfig.width}x{roomConfig.height}m
            {furniture.length > 0 && ` · ${furniture.length} item${furniture.length !== 1 ? "s" : ""}`}
          </div>
        </div>
      </motion.header>

      <div style={{ flex: 1, position: "relative", zIndex: 10 }}>
        {loading ? (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", fontSize: 14, color: "#8b5cf6", fontWeight: 600 }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", border: "3px solid rgba(139,92,246,0.2)", borderTopColor: "#8b5cf6", margin: "0 auto 12px" }} />
              Loading your layout...
            </div>
          </div>
        ) : (
          <Canvas shadows
            gl={{ antialias: true, preserveDrawingBuffer: true, toneMapping: THREE.LinearToneMapping, toneMappingExposure: 1.0, outputColorSpace: THREE.SRGBColorSpace }}
            onPointerMissed={() => { if (!draggingId) setSelectedId(null); }}
          >
            <Suspense fallback={null}>
              <PerspectiveCamera makeDefault fov={52} near={0.1} far={200} />
              <CameraController topDown={topDown} roomWidth={roomConfig.width} roomDepth={roomConfig.height} orbitRef={orbitRef} />
              <OrbitControls ref={orbitRef} enableDamping dampingFactor={0.06} minDistance={1} maxDistance={60} target={[0, 0.5, 0]} maxPolarAngle={Math.PI / 2} />
              <SceneContent
                furniture={furniture} roomConfig={roomConfig}
                selectedId={selectedId} onSelect={handleSelect} onMove={handleMove}
                isDragging={draggingId} setIsDragging={setDraggingId}
                orbitRef={orbitRef} envPreset={timeOfDay}
              />
            </Suspense>
          </Canvas>
        )}

        <AnimatePresence>
          {selectedItem && (
            <motion.div key="panel" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 16 }}
              style={{
                position: "absolute", top: 16, right: 16, zIndex: 20, padding: "16px 18px", borderRadius: 18,
                background: isEvening ? "rgba(20,10,50,0.7)" : "rgba(255,255,255,0.32)", backdropFilter: "blur(24px)",
                border: isEvening ? "1px solid rgba(139,92,246,0.3)" : "1px solid rgba(255,255,255,0.7)", minWidth: 180,
              }}>
              <div style={{ fontSize: 10, color: isEvening ? "#9b8db8" : "#9b93b8", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.5px" }}>Selected</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: isEvening ? "#e0d0ff" : "#4c1d95", marginBottom: 4 }}>{selectedItem.label}</div>
              <div style={{ fontSize: 11, color: isEvening ? "#9b8db8" : "#6b5b95", marginBottom: 10 }}>{selectedItem.w}x{selectedItem.h}cm · {selectedItem.rotation || 0}deg</div>
              <div style={{ fontSize: 10, color: isEvening ? "#7b6da8" : "#a0a0c0", marginBottom: 10, padding: "6px 10px", borderRadius: 8, background: isEvening ? "rgba(139,92,246,0.15)" : "rgba(139,92,246,0.08)" }}>
                Drag the furniture to move it
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleRotate}
                  style={{ flex: 1, padding: "7px 0", borderRadius: 10, border: "none", cursor: "pointer", background: isEvening ? "rgba(139,92,246,0.3)" : "rgba(139,92,246,0.12)", color: isEvening ? "#c4b5fd" : "#6d28d9", fontSize: 12, fontWeight: 700 }}>
                  Rotate 90
                </motion.button>
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleDelete}
                  style={{ flex: 1, padding: "7px 0", borderRadius: 10, border: "none", cursor: "pointer", background: isEvening ? "rgba(220,50,50,0.25)" : "rgba(239,68,68,0.10)", color: isEvening ? "#fca5a5" : "#dc2626", fontSize: 12, fontWeight: 700 }}>
                  Delete
                </motion.button>
              </div>
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} onClick={() => setSelectedId(null)}
                style={{ marginTop: 8, width: "100%", padding: "6px", borderRadius: 10, border: "none", background: "transparent", color: isEvening ? "#7b6da8" : "#9b93b8", fontSize: 11, cursor: "pointer" }}>
                Deselect
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        <div style={{ position: "absolute", bottom: 20, left: 20, zIndex: 20 }}>
          <div style={{
              padding: "12px 16px", borderRadius: 16, minWidth: 220,
              background: isEvening ? "rgba(10,5,30,0.75)" : "rgba(255,255,255,0.28)",
              backdropFilter: "blur(20px)", boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
              border: isEvening ? "1px solid rgba(139,92,246,0.3)" : "1px solid rgba(255,255,255,0.6)",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: isEvening ? "#9b8db8" : "#6b5b95", textTransform: "uppercase", letterSpacing: "0.5px" }}>Time of Day</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: isEvening ? "#e0d0ff" : "#4c1d95", fontVariantNumeric: "tabular-nums" }}>{sunParams.timeLabel}</span>
              </div>
              {/* Sun arc visual */}
              <div style={{ position: "relative", height: 36, marginBottom: 8 }}>
                <svg width="100%" height="36" viewBox="0 0 200 36" style={{ position: "absolute", top: 0, left: 0 }}>
                  <path d="M 10 32 Q 100 -10 190 32" stroke={isEvening ? "rgba(255,255,255,0.15)" : "rgba(139,92,246,0.2)"} strokeWidth="1.5" fill="none" strokeDasharray="4,3" />
                  {(() => {
                    const t = Math.max(0, Math.min(1, (timeOfDay - 6) / 14));
                    const x = 10 + t * 180;
                    const y = 32 - Math.sin(t * Math.PI) * 42;
                    const isUp = timeOfDay >= 6 && timeOfDay <= 20;
                    return isUp ? (
                      <circle cx={x} cy={Math.max(2, y)} r="7" fill={`rgb(${Math.round(sunParams.r*255)},${Math.round(sunParams.g*255)},${Math.round(sunParams.b*255)})`}
                        style={{ filter: "drop-shadow(0 0 6px rgba(255,200,50,0.8))" }} />
                    ) : (
                      <circle cx={timeOfDay < 6 ? 10 : 190} cy="32" r="5" fill="#8ab4f8" style={{ filter: "drop-shadow(0 0 4px rgba(100,150,255,0.6))" }} />
                    );
                  })()}
                  <line x1="10" y1="33" x2="190" y2="33" stroke={isEvening ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"} strokeWidth="1" />
                </svg>
              </div>
              <input
                type="range" min="0" max="24" step="0.25"
                value={timeOfDay}
                onChange={(e) => setTimeOfDay(parseFloat(e.target.value))}
                style={{ width: "100%", accentColor: "#8b5cf6", cursor: "pointer" }}
              />
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4, fontSize: 10, color: isEvening ? "#6b5b95" : "#9b93b8" }}>
                <span>00:00</span><span>06:00</span><span>12:00</span><span>18:00</span><span>24:00</span>
              </div>
            </div>
        </div>

        <div style={{
          position: "absolute", bottom: 20, left: "50%", transform: "translateX(-50%)", zIndex: 20,
          padding: "8px 16px", borderRadius: 50,
          background: isEvening ? "rgba(20,10,50,0.6)" : "rgba(255,255,255,0.22)", backdropFilter: "blur(16px)",
          border: isEvening ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(255,255,255,0.5)",
          fontSize: 11, color: isEvening ? "#9b8db8" : "#6b5b95", fontWeight: 600, whiteSpace: "nowrap",
          pointerEvents: "none",
        }}>
          {selectedId ? "Drag furniture to move it · Rotate or Delete in panel" : "Click furniture to select · Drag to orbit · Scroll to zoom"}
        </div>

        <motion.button whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }} onClick={() => router.push("/editor/2d")}
          style={{
            position: "absolute", bottom: 20, right: 20, zIndex: 20, padding: "11px 24px", borderRadius: 50, border: "none",
            fontFamily: "system-ui, sans-serif", fontSize: 13, fontWeight: 700, color: "#fff", cursor: "pointer",
            background: "linear-gradient(135deg,#8b5cf6,#6d28d9)", boxShadow: "0 8px 24px rgba(109,40,217,0.35)",
          }}>
          Edit in 2D
        </motion.button>
      </div>
    </div>
  );
}
