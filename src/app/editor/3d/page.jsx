"use client";

import { Suspense, useEffect, useState, useRef } from "react";
import React from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, Environment, useGLTF, Grid } from "@react-three/drei";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import * as THREE from "three";

function getModelPath(type) {
  const map = {
    "sofa-2":"/models/loungeSofa.glb","sofa-3":"/models/loungeSofaLong.glb",
    "sofa-l":"/models/loungeSofaCorner.glb","sofa-1":"/models/loungeChair.glb",
    "sofa-design":"/models/loungeDesignSofa.glb","sofa-ottoman":"/models/loungeSofaOttoman.glb",
    "lounge-chair":"/models/loungeChair.glb","lounge-relax":"/models/loungeChairRelax.glb",
    "bed-s":"/models/bedSingle.glb","bed-d":"/models/bedDouble.glb",
    "bed-k":"/models/bedDouble.glb","bed-bunk":"/models/bedBunk.glb",
    "chair-a":"/models/loungeChair.glb","chair-d":"/models/chair.glb",
    "chair-o":"/models/chairDesk.glb","chair":"/models/chair.glb",
    "chair-cushion":"/models/chairCushion.glb","chair-modern":"/models/chairModernCushion.glb",
    "chair-rounded":"/models/chairRounded.glb",
    "table-c":"/models/tableCoffee.glb","table-d":"/models/table.glb",
    "table-s":"/models/sideTable.glb","table-side-d":"/models/sideTableDrawers.glb",
    "table-coffee-g":"/models/tableCoffeeGlass.glb","table-coffee-sq":"/models/tableCoffeeSquare.glb",
    "table-glass":"/models/tableGlass.glb","table-round":"/models/tableRound.glb",
    "table-cross":"/models/tableCross.glb","table-cloth":"/models/tableCloth.glb",
    "ward":"/models/bookcaseClosedWide.glb","book":"/models/bookcaseOpen.glb",
    "bookcase-closed":"/models/bookcaseClosed.glb","bookcase-doors":"/models/bookcaseClosedDoors.glb",
    "bookcase-low":"/models/bookcaseOpenLow.glb","dress":"/models/cabinetBed.glb",
    "cabinet-bed-d":"/models/cabinetBedDrawer.glb","cabinet-tv":"/models/cabinetTelevision.glb",
    "cabinet-tv-d":"/models/cabinetTelevisionDoors.glb",
    "plant":"/models/pottedPlant.glb","plant-s1":"/models/plantSmall1.glb",
    "plant-s2":"/models/plantSmall2.glb","plant-s3":"/models/plantSmall3.glb",
    "lamp":"/models/lampRoundFloor.glb","lamp-table-r":"/models/lampRoundTable.glb",
    "lamp-sq-f":"/models/lampSquareFloor.glb","lamp-sq-t":"/models/lampSquareTable.glb",
    "lamp-wall":"/models/lampWall.glb",
    "rug":"/models/rugRectangle.glb","rug-round":"/models/rugRound.glb",
    "rug-rounded":"/models/rugRounded.glb","rug-square":"/models/rugSquare.glb",
    "rug-doormat":"/models/rugDoormat.glb",
    "pillow":"/models/pillow.glb","pillow-blue":"/models/pillowBlue.glb",
    "pillow-long":"/models/pillowLong.glb","books":"/models/books.glb",
    "bear":"/models/bear.glb","radio":"/models/radio.glb",
    "speaker":"/models/speaker.glb","speaker-sm":"/models/speakerSmall.glb",
    "bench":"/models/bench.glb","bench-cushion":"/models/benchCushion.glb",
    "bench-low":"/models/benchCushionLow.glb",
    "stool-bar":"/models/stoolBar.glb","stool-bar-sq":"/models/stoolBarSquare.glb",
    "desk":"/models/desk.glb","desk-corner":"/models/deskCorner.glb",
    "computer":"/models/computerScreen.glb","keyboard":"/models/computerKeyboard.glb",
    "laptop":"/models/laptop.glb","coat-rack":"/models/coatRack.glb",
    "coat-stand":"/models/coatRackStanding.glb",
    "kitchen-sink":"/models/kitchenSink.glb","kitchen-stove":"/models/kitchenStove.glb",
    "kitchen-fridge":"/models/kitchenFridge.glb","kitchen-fridge-l":"/models/kitchenFridgeLarge.glb",
    "kitchen-fridge-s":"/models/kitchenFridgeSmall.glb","kitchen-micro":"/models/kitchenMicrowave.glb",
    "kitchen-cabinet":"/models/kitchenCabinet.glb","kitchen-cab-d":"/models/kitchenCabinetDrawer.glb",
    "kitchen-cab-u":"/models/kitchenCabinetUpper.glb","kitchen-bar":"/models/kitchenBar.glb",
    "kitchen-blender":"/models/kitchenBlender.glb","kitchen-coffee":"/models/kitchenCoffeeMachine.glb",
    "kitchen-toaster":"/models/toaster.glb","hood-large":"/models/hoodLarge.glb",
    "bath-cabinet":"/models/bathroomCabinet.glb","bath-mirror":"/models/bathroomMirror.glb",
    "bath-sink":"/models/bathroomSink.glb","bathtub":"/models/bathtub.glb",
    "toilet":"/models/toilet.glb","shower":"/models/shower.glb","shower-round":"/models/showerRound.glb",
    "tv-modern":"/models/televisionModern.glb","tv-antenna":"/models/televisionAntenna.glb",
    "tv-vintage":"/models/televisionVintage.glb","ceiling-fan":"/models/ceilingFan.glb",
    "washer":"/models/washer.glb","dryer":"/models/dryer.glb",
    "washer-dryer":"/models/washerDryerStacked.glb","trashcan":"/models/trashcan.glb",
  };
  return map[type] || "/models/chair.glb";
}

const PX_PER_METRE = 80;

function AutoCamera({ roomWidth, roomDepth }) {
  const { camera } = useThree();
  useEffect(() => {
    const maxDim = Math.max(roomWidth, roomDepth);
    const distance = maxDim * 1.4;
    const height = maxDim * 0.9;
    camera.position.set(distance * 0.8, height, distance * 0.8);
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
  }, [roomWidth, roomDepth, camera]);
  return null;
}

function FurnitureModelInner({ item, roomWidth, roomHeight, isSelected, onClick }) {
  const { scene } = useGLTF(getModelPath(item.type));
  const cloned = scene.clone(true);
  const box = new THREE.Box3().setFromObject(cloned);
  const nativeSize = new THREE.Vector3();
  box.getSize(nativeSize);
  const targetW = item.w / PX_PER_METRE;
  const targetD = item.h / PX_PER_METRE;
  const scaleX = nativeSize.x > 0 ? targetW / nativeSize.x : 1;
  const scaleZ = nativeSize.z > 0 ? targetD / nativeSize.z : 1;
  const scaleY = (scaleX + scaleZ) / 2;
  const x3d = item.x / PX_PER_METRE - roomWidth / 2 + targetW / 2;
  const z3d = item.y / PX_PER_METRE - roomHeight / 2 + targetD / 2;
  cloned.scale.set(scaleX, scaleY, scaleZ);
  const scaledBox = new THREE.Box3().setFromObject(cloned);
  const yOffset = -scaledBox.min.y;

  if (isSelected) {
    cloned.traverse((child) => {
      if (child.isMesh) {
        child.material = child.material.clone();
        child.material.emissive = new THREE.Color("#8b5cf6");
        child.material.emissiveIntensity = 0.35;
      }
    });
  }

  return (
    <primitive
      object={cloned}
      position={[x3d, yOffset, z3d]}
      rotation={[0, ((item.rotation || 0) * Math.PI) / 180, 0]}
      onClick={(e) => { e.stopPropagation(); onClick(item.id); }}
    />
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
      <meshStandardMaterial color={item.color || "#c4b5fd"} opacity={0.7} transparent />
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

function FurnitureModel({ item, roomWidth, roomHeight, isSelected, onClick }) {
  return (
    <FurnitureErrorBoundary item={item} roomWidth={roomWidth} roomHeight={roomHeight}>
      <Suspense fallback={<FurnitureFallback item={item} roomWidth={roomWidth} roomHeight={roomHeight} />}>
        <FurnitureModelInner
          item={item} roomWidth={roomWidth} roomHeight={roomHeight}
          isSelected={isSelected} onClick={onClick}
        />
      </Suspense>
    </FurnitureErrorBoundary>
  );
}

function Room3D({ config }) {
  const w = config.width;
  const d = config.height;
  const wallH = 2.8;
  const wallT = 0.12;
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[w, d]} />
        <meshStandardMaterial color={config.floorColor} roughness={0.85} metalness={0.0} />
      </mesh>
      <Grid
        position={[0, 0.001, 0]} args={[w, d]}
        cellSize={1} cellThickness={0.4} cellColor="rgba(0,0,0,0.07)"
        sectionSize={0} fadeDistance={30} fadeStrength={1} infiniteGrid={false}
      />
      <mesh position={[0, wallH / 2, -d / 2 - wallT / 2]} receiveShadow castShadow>
        <boxGeometry args={[w + wallT * 2, wallH, wallT]} />
        <meshStandardMaterial color={config.wallColor} roughness={0.9} />
      </mesh>
      <mesh position={[-w / 2 - wallT / 2, wallH / 2, 0]} receiveShadow castShadow>
        <boxGeometry args={[wallT, wallH, d]} />
        <meshStandardMaterial color={config.wallColor} roughness={0.9} />
      </mesh>
      <mesh position={[w / 2 + wallT / 2, wallH / 2, 0]} receiveShadow castShadow>
        <boxGeometry args={[wallT, wallH, d]} />
        <meshStandardMaterial color={config.wallColor} roughness={0.9} />
      </mesh>
      <mesh position={[0, wallH / 2, d / 2 + wallT / 2]}>
        <boxGeometry args={[w + wallT * 2, wallH, wallT]} />
        <meshStandardMaterial color={config.wallColor} transparent opacity={0.12} roughness={0.9} />
      </mesh>
      {[
        { pos: [0, 0.05, -d/2], size: [w, 0.1, 0.02] },
        { pos: [-w/2, 0.05, 0], size: [0.02, 0.1, d] },
        { pos: [w/2, 0.05, 0],  size: [0.02, 0.1, d] },
      ].map((s, i) => (
        <mesh key={i} position={s.pos}>
          <boxGeometry args={s.size} />
          <meshStandardMaterial color="#d0c8e0" roughness={0.6} />
        </mesh>
      ))}
    </group>
  );
}

function Lights({ roomWidth, roomDepth }) {
  const height = Math.max(roomWidth, roomDepth) * 1.2;
  return (
    <>
      <ambientLight intensity={0.55} color="#f8f4ff" />
      <directionalLight
        position={[roomWidth * 0.4, height, roomDepth * 0.2]}
        intensity={1.1} color="#fff8f0" castShadow
        shadow-mapSize-width={2048} shadow-mapSize-height={2048}
        shadow-camera-left={-10} shadow-camera-right={10}
        shadow-camera-top={10} shadow-camera-bottom={-10}
        shadow-bias={-0.001}
      />
      <directionalLight
        position={[-roomWidth * 0.5, height * 0.5, -roomDepth * 0.5]}
        intensity={0.35} color="#ffd4a3"
      />
      <pointLight
        position={[0, 0.3, 0]} intensity={0.15} color="#e8e0ff"
        distance={Math.max(roomWidth, roomDepth) * 2}
      />
    </>
  );
}

export default function Editor3D() {
  const router = useRouter();
  const [furniture, setFurniture] = useState([]);
  const [roomConfig, setRoomConfig] = useState({
    name: "My Space", width: 5, height: 4,
    wallColor: "#e8e0f0", floorColor: "#f5f0e8",
  });
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState(null);
  const [screenshotMsg, setScreenshotMsg] = useState(false);

  useEffect(() => {
    try {
      const f = localStorage.getItem("mauve_furniture");
      const r = localStorage.getItem("mauve_room");
      if (f) setFurniture(JSON.parse(f));
      if (r) setRoomConfig(JSON.parse(r));
    } catch (e) { console.error("Could not load layout", e); }
    setLoading(false);
  }, []);

  const handleScreenshot = () => {
    const canvas = document.querySelector("canvas");
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = `mauve-room-${Date.now()}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
    setScreenshotMsg(true);
    setTimeout(() => setScreenshotMsg(false), 2500);
  };

  const selectedItem = furniture.find(f => f.id === selectedId);

  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Afacad:wght@400;500;600;700&display=swap');
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
    @keyframes shimmer{0%{background-position:-300% center}100%{background-position:300% center}}
    @keyframes floatA{0%,100%{transform:translateY(0)}50%{transform:translateY(-16px)}}
    @keyframes spin{to{transform:rotate(360deg)}}
  `;

  return (
    <div style={{
      display:"flex", flexDirection:"column", height:"100vh",
      fontFamily:"'Afacad',sans-serif",
      background:"linear-gradient(135deg,#f0eaff 0%,#e8f4ff 50%,#f0e8ff 100%)",
      overflow:"hidden", position:"relative",
    }}>
      <style dangerouslySetInnerHTML={{ __html: css }} />

      <div style={{ position:"fixed", inset:0, zIndex:0, pointerEvents:"none", overflow:"hidden" }}>
        <div style={{
          position:"absolute", top:"-10%", left:"-6%",
          width:400, height:400, borderRadius:"50%",
          background:"radial-gradient(circle,rgba(167,139,250,0.22) 0%,transparent 68%)",
          animation:"floatA 9s ease-in-out infinite",
        }}/>
      </div>

      <motion.header
        initial={{ y:-20, opacity:0 }} animate={{ y:0, opacity:1 }}
        transition={{ type:"spring", stiffness:120, damping:18 }}
        style={{
          height:52, display:"flex", alignItems:"center", justifyContent:"space-between",
          padding:"0 20px", position:"relative", zIndex:30,
          background:"rgba(255,255,255,0.18)", backdropFilter:"blur(24px)",
          borderBottom:"1px solid rgba(255,255,255,0.45)", flexShrink:0,
        }}
      >
        <span onClick={() => router.push("/dashboard")}
          style={{ fontSize:18, fontWeight:700, color:"#2d1f4e", cursor:"pointer" }}>
          Mauve Studio
          <span style={{
            background:"linear-gradient(90deg,#8b5cf6,#60a5fa,#ec4899,#8b5cf6)",
            backgroundSize:"300% auto",
            WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent",
            animation:"shimmer 2.8s linear infinite",
          }}>.</span>
        </span>

        <div style={{
          display:"flex", gap:4, background:"rgba(255,255,255,0.35)",
          border:"1px solid rgba(255,255,255,0.6)", borderRadius:50, padding:"3px",
        }}>
          <button onClick={() => router.push("/editor/2d")} style={{
            padding:"5px 20px", borderRadius:50, border:"none",
            background:"transparent", fontSize:13, fontWeight:600, color:"#6b5b95", cursor:"pointer",
          }}>2D Plan</button>
          <div style={{
            padding:"5px 20px", borderRadius:50,
            background:"linear-gradient(135deg,#8b5cf6,#6d28d9)",
            fontSize:13, fontWeight:700, color:"#fff",
            boxShadow:"0 4px 14px rgba(109,40,217,0.35)",
          }}>3D View</div>
        </div>

        <div style={{ display:"flex", gap:8, alignItems:"center" }}>
          <motion.button
            whileHover={{ scale:1.05 }} whileTap={{ scale:0.95 }}
            onClick={handleScreenshot}
            style={{
              padding:"7px 18px", borderRadius:50, border:"1px solid rgba(139,92,246,0.2)",
              fontFamily:"'Afacad',sans-serif", fontSize:13, fontWeight:700,
              color:"#6d28d9", cursor:"pointer", background:"rgba(139,92,246,0.12)",
            }}>
            {screenshotMsg ? "✓ Saved!" : "📸 Screenshot"}
          </motion.button>

          <div style={{
            display:"flex", gap:8, alignItems:"center",
            fontSize:12, fontWeight:600, color:"#8b5cf6",
            padding:"6px 16px", borderRadius:50,
            background:"rgba(139,92,246,0.10)",
            border:"1px solid rgba(139,92,246,0.15)",
          }}>
            <div style={{ width:10, height:10, borderRadius:3, background:roomConfig.wallColor,
              border:"1px solid rgba(0,0,0,0.12)", flexShrink:0 }}/>
            <div style={{ width:10, height:10, borderRadius:3, background:roomConfig.floorColor,
              border:"1px solid rgba(0,0,0,0.12)", flexShrink:0 }}/>
            {roomConfig.width}×{roomConfig.height}m
            {furniture.length > 0 && ` · ${furniture.length} item${furniture.length!==1?"s":""}`}
          </div>
        </div>
      </motion.header>

      <div style={{ flex:1, position:"relative", zIndex:10 }}>
        {loading ? (
          <div style={{ display:"flex", alignItems:"center", justifyContent:"center",
            height:"100%", fontSize:14, color:"#8b5cf6", fontWeight:600 }}>
            <div style={{ textAlign:"center" }}>
              <div style={{
                width:32, height:32, borderRadius:"50%",
                border:"3px solid rgba(139,92,246,0.2)", borderTopColor:"#8b5cf6",
                animation:"spin 0.8s linear infinite", margin:"0 auto 12px",
              }}/>
              Loading your layout…
            </div>
          </div>
        ) : (
          <Canvas shadows gl={{ antialias:true, preserveDrawingBuffer:true }}
            onClick={() => setSelectedId(null)}>
            <Suspense fallback={null}>
              <PerspectiveCamera makeDefault fov={55} near={0.1} far={100} />
              <AutoCamera roomWidth={roomConfig.width} roomDepth={roomConfig.height} />
              <OrbitControls enableDamping dampingFactor={0.06}
                minDistance={1} maxDistance={40} target={[0, 0.5, 0]} />
              <Lights roomWidth={roomConfig.width} roomDepth={roomConfig.height} />
              <Room3D config={roomConfig} />
              {furniture.map(item => (
                <FurnitureModel
                  key={item.id} item={item}
                  roomWidth={roomConfig.width} roomHeight={roomConfig.height}
                  isSelected={item.id === selectedId}
                  onClick={(id) => setSelectedId(prev => prev === id ? null : id)}
                />
              ))}
              <Environment preset="apartment" />
            </Suspense>
          </Canvas>
        )}

        {selectedItem && (
          <motion.div
            initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }}
            style={{
              position:"absolute", top:16, right:16, zIndex:20,
              padding:"14px 18px", borderRadius:16,
              background:"rgba(255,255,255,0.30)", backdropFilter:"blur(24px)",
              border:"1px solid rgba(255,255,255,0.7)",
              boxShadow:"0 8px 32px rgba(120,80,220,0.12)",
              fontSize:13, color:"#2d1f4e", fontWeight:600, minWidth:160,
            }}>
            <div style={{ fontSize:11, color:"#9b93b8", marginBottom:4, textTransform:"uppercase", letterSpacing:"0.4px" }}>Selected</div>
            <div style={{ fontSize:15, fontWeight:700, color:"#4c1d95", marginBottom:8 }}>{selectedItem.label}</div>
            <div style={{ display:"flex", gap:6, alignItems:"center" }}>
              <div style={{ width:10, height:10, borderRadius:3, background:selectedItem.color, border:"1px solid rgba(0,0,0,0.1)" }}/>
              <span style={{ fontSize:12, color:"#6b5b95" }}>{selectedItem.w}×{selectedItem.h}cm</span>
            </div>
            <button onClick={() => setSelectedId(null)}
              style={{ marginTop:10, width:"100%", padding:"5px", borderRadius:8, border:"none",
                background:"rgba(139,92,246,0.10)", color:"#8b5cf6", fontSize:11, fontWeight:700, cursor:"pointer" }}>
              Deselect
            </button>
          </motion.div>
        )}

        <div style={{
          position:"absolute", bottom:20, left:20, zIndex:20,
          padding:"12px 18px", borderRadius:16,
          background:"rgba(255,255,255,0.25)", backdropFilter:"blur(20px)",
          border:"1px solid rgba(255,255,255,0.6)",
          fontSize:12, color:"#6b5b95", fontWeight:600, lineHeight:1.7,
        }}>
          🖱 Drag to rotate · Scroll to zoom · Right-click to pan
          <br/>
          <span style={{ fontSize:11, color:"#9b93b8" }}>Click any furniture to select it</span>
          {furniture.length === 0 && (
            <div style={{ marginTop:5, fontSize:11, color:"#9b93b8" }}>
              Go to 2D Plan → place furniture → come back
            </div>
          )}
        </div>

        <motion.button
          whileHover={{ scale:1.05, y:-2 }} whileTap={{ scale:0.95 }}
          onClick={() => router.push("/editor/2d")}
          style={{
            position:"absolute", bottom:20, right:20, zIndex:20,
            padding:"11px 24px", borderRadius:50, border:"none",
            fontFamily:"'Afacad',sans-serif", fontSize:13, fontWeight:700,
            color:"#fff", cursor:"pointer",
            background:"linear-gradient(135deg,#8b5cf6,#6d28d9)",
            boxShadow:"0 8px 24px rgba(109,40,217,0.35)",
          }}>
          ← Edit in 2D
        </motion.button>
      </div>
    </div>
  );
}
ENDOFFILEcat > src/app/editor/3d/page.jsx << 'ENDOFFILE'
"use client";

import { Suspense, useEffect, useState, useRef } from "react";
import React from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, Environment, useGLTF, Grid } from "@react-three/drei";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import * as THREE from "three";

function getModelPath(type) {
  const map = {
    "sofa-2":"/models/loungeSofa.glb","sofa-3":"/models/loungeSofaLong.glb",
    "sofa-l":"/models/loungeSofaCorner.glb","sofa-1":"/models/loungeChair.glb",
    "sofa-design":"/models/loungeDesignSofa.glb","sofa-ottoman":"/models/loungeSofaOttoman.glb",
    "lounge-chair":"/models/loungeChair.glb","lounge-relax":"/models/loungeChairRelax.glb",
    "bed-s":"/models/bedSingle.glb","bed-d":"/models/bedDouble.glb",
    "bed-k":"/models/bedDouble.glb","bed-bunk":"/models/bedBunk.glb",
    "chair-a":"/models/loungeChair.glb","chair-d":"/models/chair.glb",
    "chair-o":"/models/chairDesk.glb","chair":"/models/chair.glb",
    "chair-cushion":"/models/chairCushion.glb","chair-modern":"/models/chairModernCushion.glb",
    "chair-rounded":"/models/chairRounded.glb",
    "table-c":"/models/tableCoffee.glb","table-d":"/models/table.glb",
    "table-s":"/models/sideTable.glb","table-side-d":"/models/sideTableDrawers.glb",
    "table-coffee-g":"/models/tableCoffeeGlass.glb","table-coffee-sq":"/models/tableCoffeeSquare.glb",
    "table-glass":"/models/tableGlass.glb","table-round":"/models/tableRound.glb",
    "table-cross":"/models/tableCross.glb","table-cloth":"/models/tableCloth.glb",
    "ward":"/models/bookcaseClosedWide.glb","book":"/models/bookcaseOpen.glb",
    "bookcase-closed":"/models/bookcaseClosed.glb","bookcase-doors":"/models/bookcaseClosedDoors.glb",
    "bookcase-low":"/models/bookcaseOpenLow.glb","dress":"/models/cabinetBed.glb",
    "cabinet-bed-d":"/models/cabinetBedDrawer.glb","cabinet-tv":"/models/cabinetTelevision.glb",
    "cabinet-tv-d":"/models/cabinetTelevisionDoors.glb",
    "plant":"/models/pottedPlant.glb","plant-s1":"/models/plantSmall1.glb",
    "plant-s2":"/models/plantSmall2.glb","plant-s3":"/models/plantSmall3.glb",
    "lamp":"/models/lampRoundFloor.glb","lamp-table-r":"/models/lampRoundTable.glb",
    "lamp-sq-f":"/models/lampSquareFloor.glb","lamp-sq-t":"/models/lampSquareTable.glb",
    "lamp-wall":"/models/lampWall.glb",
    "rug":"/models/rugRectangle.glb","rug-round":"/models/rugRound.glb",
    "rug-rounded":"/models/rugRounded.glb","rug-square":"/models/rugSquare.glb",
    "rug-doormat":"/models/rugDoormat.glb",
    "pillow":"/models/pillow.glb","pillow-blue":"/models/pillowBlue.glb",
    "pillow-long":"/models/pillowLong.glb","books":"/models/books.glb",
    "bear":"/models/bear.glb","radio":"/models/radio.glb",
    "speaker":"/models/speaker.glb","speaker-sm":"/models/speakerSmall.glb",
    "bench":"/models/bench.glb","bench-cushion":"/models/benchCushion.glb",
    "bench-low":"/models/benchCushionLow.glb",
    "stool-bar":"/models/stoolBar.glb","stool-bar-sq":"/models/stoolBarSquare.glb",
    "desk":"/models/desk.glb","desk-corner":"/models/deskCorner.glb",
    "computer":"/models/computerScreen.glb","keyboard":"/models/computerKeyboard.glb",
    "laptop":"/models/laptop.glb","coat-rack":"/models/coatRack.glb",
    "coat-stand":"/models/coatRackStanding.glb",
    "kitchen-sink":"/models/kitchenSink.glb","kitchen-stove":"/models/kitchenStove.glb",
    "kitchen-fridge":"/models/kitchenFridge.glb","kitchen-fridge-l":"/models/kitchenFridgeLarge.glb",
    "kitchen-fridge-s":"/models/kitchenFridgeSmall.glb","kitchen-micro":"/models/kitchenMicrowave.glb",
    "kitchen-cabinet":"/models/kitchenCabinet.glb","kitchen-cab-d":"/models/kitchenCabinetDrawer.glb",
    "kitchen-cab-u":"/models/kitchenCabinetUpper.glb","kitchen-bar":"/models/kitchenBar.glb",
    "kitchen-blender":"/models/kitchenBlender.glb","kitchen-coffee":"/models/kitchenCoffeeMachine.glb",
    "kitchen-toaster":"/models/toaster.glb","hood-large":"/models/hoodLarge.glb",
    "bath-cabinet":"/models/bathroomCabinet.glb","bath-mirror":"/models/bathroomMirror.glb",
    "bath-sink":"/models/bathroomSink.glb","bathtub":"/models/bathtub.glb",
    "toilet":"/models/toilet.glb","shower":"/models/shower.glb","shower-round":"/models/showerRound.glb",
    "tv-modern":"/models/televisionModern.glb","tv-antenna":"/models/televisionAntenna.glb",
    "tv-vintage":"/models/televisionVintage.glb","ceiling-fan":"/models/ceilingFan.glb",
    "washer":"/models/washer.glb","dryer":"/models/dryer.glb",
    "washer-dryer":"/models/washerDryerStacked.glb","trashcan":"/models/trashcan.glb",
  };
  return map[type] || "/models/chair.glb";
}

const PX_PER_METRE = 80;

function AutoCamera({ roomWidth, roomDepth }) {
  const { camera } = useThree();
  useEffect(() => {
    const maxDim = Math.max(roomWidth, roomDepth);
    const distance = maxDim * 1.4;
    const height = maxDim * 0.9;
    camera.position.set(distance * 0.8, height, distance * 0.8);
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
  }, [roomWidth, roomDepth, camera]);
  return null;
}

function FurnitureModelInner({ item, roomWidth, roomHeight, isSelected, onClick }) {
  const { scene } = useGLTF(getModelPath(item.type));
  const cloned = scene.clone(true);
  const box = new THREE.Box3().setFromObject(cloned);
  const nativeSize = new THREE.Vector3();
  box.getSize(nativeSize);
  const targetW = item.w / PX_PER_METRE;
  const targetD = item.h / PX_PER_METRE;
  const scaleX = nativeSize.x > 0 ? targetW / nativeSize.x : 1;
  const scaleZ = nativeSize.z > 0 ? targetD / nativeSize.z : 1;
  const scaleY = (scaleX + scaleZ) / 2;
  const x3d = item.x / PX_PER_METRE - roomWidth / 2 + targetW / 2;
  const z3d = item.y / PX_PER_METRE - roomHeight / 2 + targetD / 2;
  cloned.scale.set(scaleX, scaleY, scaleZ);
  const scaledBox = new THREE.Box3().setFromObject(cloned);
  const yOffset = -scaledBox.min.y;

  if (isSelected) {
    cloned.traverse((child) => {
      if (child.isMesh) {
        child.material = child.material.clone();
        child.material.emissive = new THREE.Color("#8b5cf6");
        child.material.emissiveIntensity = 0.35;
      }
    });
  }

  return (
    <primitive
      object={cloned}
      position={[x3d, yOffset, z3d]}
      rotation={[0, ((item.rotation || 0) * Math.PI) / 180, 0]}
      onClick={(e) => { e.stopPropagation(); onClick(item.id); }}
    />
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
      <meshStandardMaterial color={item.color || "#c4b5fd"} opacity={0.7} transparent />
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

function FurnitureModel({ item, roomWidth, roomHeight, isSelected, onClick }) {
  return (
    <FurnitureErrorBoundary item={item} roomWidth={roomWidth} roomHeight={roomHeight}>
      <Suspense fallback={<FurnitureFallback item={item} roomWidth={roomWidth} roomHeight={roomHeight} />}>
        <FurnitureModelInner
          item={item} roomWidth={roomWidth} roomHeight={roomHeight}
          isSelected={isSelected} onClick={onClick}
        />
      </Suspense>
    </FurnitureErrorBoundary>
  );
}

function Room3D({ config }) {
  const w = config.width;
  const d = config.height;
  const wallH = 2.8;
  const wallT = 0.12;
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[w, d]} />
        <meshStandardMaterial color={config.floorColor} roughness={0.85} metalness={0.0} />
      </mesh>
      <Grid
        position={[0, 0.001, 0]} args={[w, d]}
        cellSize={1} cellThickness={0.4} cellColor="rgba(0,0,0,0.07)"
        sectionSize={0} fadeDistance={30} fadeStrength={1} infiniteGrid={false}
      />
      <mesh position={[0, wallH / 2, -d / 2 - wallT / 2]} receiveShadow castShadow>
        <boxGeometry args={[w + wallT * 2, wallH, wallT]} />
        <meshStandardMaterial color={config.wallColor} roughness={0.9} />
      </mesh>
      <mesh position={[-w / 2 - wallT / 2, wallH / 2, 0]} receiveShadow castShadow>
        <boxGeometry args={[wallT, wallH, d]} />
        <meshStandardMaterial color={config.wallColor} roughness={0.9} />
      </mesh>
      <mesh position={[w / 2 + wallT / 2, wallH / 2, 0]} receiveShadow castShadow>
        <boxGeometry args={[wallT, wallH, d]} />
        <meshStandardMaterial color={config.wallColor} roughness={0.9} />
      </mesh>
      <mesh position={[0, wallH / 2, d / 2 + wallT / 2]}>
        <boxGeometry args={[w + wallT * 2, wallH, wallT]} />
        <meshStandardMaterial color={config.wallColor} transparent opacity={0.12} roughness={0.9} />
      </mesh>
      {[
        { pos: [0, 0.05, -d/2], size: [w, 0.1, 0.02] },
        { pos: [-w/2, 0.05, 0], size: [0.02, 0.1, d] },
        { pos: [w/2, 0.05, 0],  size: [0.02, 0.1, d] },
      ].map((s, i) => (
        <mesh key={i} position={s.pos}>
          <boxGeometry args={s.size} />
          <meshStandardMaterial color="#d0c8e0" roughness={0.6} />
        </mesh>
      ))}
    </group>
  );
}

function Lights({ roomWidth, roomDepth }) {
  const height = Math.max(roomWidth, roomDepth) * 1.2;
  return (
    <>
      <ambientLight intensity={0.55} color="#f8f4ff" />
      <directionalLight
        position={[roomWidth * 0.4, height, roomDepth * 0.2]}
        intensity={1.1} color="#fff8f0" castShadow
        shadow-mapSize-width={2048} shadow-mapSize-height={2048}
        shadow-camera-left={-10} shadow-camera-right={10}
        shadow-camera-top={10} shadow-camera-bottom={-10}
        shadow-bias={-0.001}
      />
      <directionalLight
        position={[-roomWidth * 0.5, height * 0.5, -roomDepth * 0.5]}
        intensity={0.35} color="#ffd4a3"
      />
      <pointLight
        position={[0, 0.3, 0]} intensity={0.15} color="#e8e0ff"
        distance={Math.max(roomWidth, roomDepth) * 2}
      />
    </>
  );
}

export default function Editor3D() {
  const router = useRouter();
  const [furniture, setFurniture] = useState([]);
  const [roomConfig, setRoomConfig] = useState({
    name: "My Space", width: 5, height: 4,
    wallColor: "#e8e0f0", floorColor: "#f5f0e8",
  });
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState(null);
  const [screenshotMsg, setScreenshotMsg] = useState(false);

  useEffect(() => {
    try {
      const f = localStorage.getItem("mauve_furniture");
      const r = localStorage.getItem("mauve_room");
      if (f) setFurniture(JSON.parse(f));
      if (r) setRoomConfig(JSON.parse(r));
    } catch (e) { console.error("Could not load layout", e); }
    setLoading(false);
  }, []);

  const handleScreenshot = () => {
    const canvas = document.querySelector("canvas");
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = `mauve-room-${Date.now()}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
    setScreenshotMsg(true);
    setTimeout(() => setScreenshotMsg(false), 2500);
  };

  const selectedItem = furniture.find(f => f.id === selectedId);

  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Afacad:wght@400;500;600;700&display=swap');
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
    @keyframes shimmer{0%{background-position:-300% center}100%{background-position:300% center}}
    @keyframes floatA{0%,100%{transform:translateY(0)}50%{transform:translateY(-16px)}}
    @keyframes spin{to{transform:rotate(360deg)}}
  `;

  return (
    <div style={{
      display:"flex", flexDirection:"column", height:"100vh",
      fontFamily:"'Afacad',sans-serif",
      background:"linear-gradient(135deg,#f0eaff 0%,#e8f4ff 50%,#f0e8ff 100%)",
      overflow:"hidden", position:"relative",
    }}>
      <style dangerouslySetInnerHTML={{ __html: css }} />

      <div style={{ position:"fixed", inset:0, zIndex:0, pointerEvents:"none", overflow:"hidden" }}>
        <div style={{
          position:"absolute", top:"-10%", left:"-6%",
          width:400, height:400, borderRadius:"50%",
          background:"radial-gradient(circle,rgba(167,139,250,0.22) 0%,transparent 68%)",
          animation:"floatA 9s ease-in-out infinite",
        }}/>
      </div>

      <motion.header
        initial={{ y:-20, opacity:0 }} animate={{ y:0, opacity:1 }}
        transition={{ type:"spring", stiffness:120, damping:18 }}
        style={{
          height:52, display:"flex", alignItems:"center", justifyContent:"space-between",
          padding:"0 20px", position:"relative", zIndex:30,
          background:"rgba(255,255,255,0.18)", backdropFilter:"blur(24px)",
          borderBottom:"1px solid rgba(255,255,255,0.45)", flexShrink:0,
        }}
      >
        <span onClick={() => router.push("/dashboard")}
          style={{ fontSize:18, fontWeight:700, color:"#2d1f4e", cursor:"pointer" }}>
          Mauve Studio
          <span style={{
            background:"linear-gradient(90deg,#8b5cf6,#60a5fa,#ec4899,#8b5cf6)",
            backgroundSize:"300% auto",
            WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent",
            animation:"shimmer 2.8s linear infinite",
          }}>.</span>
        </span>

        <div style={{
          display:"flex", gap:4, background:"rgba(255,255,255,0.35)",
          border:"1px solid rgba(255,255,255,0.6)", borderRadius:50, padding:"3px",
        }}>
          <button onClick={() => router.push("/editor/2d")} style={{
            padding:"5px 20px", borderRadius:50, border:"none",
            background:"transparent", fontSize:13, fontWeight:600, color:"#6b5b95", cursor:"pointer",
          }}>2D Plan</button>
          <div style={{
            padding:"5px 20px", borderRadius:50,
            background:"linear-gradient(135deg,#8b5cf6,#6d28d9)",
            fontSize:13, fontWeight:700, color:"#fff",
            boxShadow:"0 4px 14px rgba(109,40,217,0.35)",
          }}>3D View</div>
        </div>

        <div style={{ display:"flex", gap:8, alignItems:"center" }}>
          <motion.button
            whileHover={{ scale:1.05 }} whileTap={{ scale:0.95 }}
            onClick={handleScreenshot}
            style={{
              padding:"7px 18px", borderRadius:50, border:"1px solid rgba(139,92,246,0.2)",
              fontFamily:"'Afacad',sans-serif", fontSize:13, fontWeight:700,
              color:"#6d28d9", cursor:"pointer", background:"rgba(139,92,246,0.12)",
            }}>
            {screenshotMsg ? "✓ Saved!" : "📸 Screenshot"}
          </motion.button>

          <div style={{
            display:"flex", gap:8, alignItems:"center",
            fontSize:12, fontWeight:600, color:"#8b5cf6",
            padding:"6px 16px", borderRadius:50,
            background:"rgba(139,92,246,0.10)",
            border:"1px solid rgba(139,92,246,0.15)",
          }}>
            <div style={{ width:10, height:10, borderRadius:3, background:roomConfig.wallColor,
              border:"1px solid rgba(0,0,0,0.12)", flexShrink:0 }}/>
            <div style={{ width:10, height:10, borderRadius:3, background:roomConfig.floorColor,
              border:"1px solid rgba(0,0,0,0.12)", flexShrink:0 }}/>
            {roomConfig.width}×{roomConfig.height}m
            {furniture.length > 0 && ` · ${furniture.length} item${furniture.length!==1?"s":""}`}
          </div>
        </div>
      </motion.header>

      <div style={{ flex:1, position:"relative", zIndex:10 }}>
        {loading ? (
          <div style={{ display:"flex", alignItems:"center", justifyContent:"center",
            height:"100%", fontSize:14, color:"#8b5cf6", fontWeight:600 }}>
            <div style={{ textAlign:"center" }}>
              <div style={{
                width:32, height:32, borderRadius:"50%",
                border:"3px solid rgba(139,92,246,0.2)", borderTopColor:"#8b5cf6",
                animation:"spin 0.8s linear infinite", margin:"0 auto 12px",
              }}/>
              Loading your layout…
            </div>
          </div>
        ) : (
          <Canvas shadows gl={{ antialias:true, preserveDrawingBuffer:true }}
            onClick={() => setSelectedId(null)}>
            <Suspense fallback={null}>
              <PerspectiveCamera makeDefault fov={55} near={0.1} far={100} />
              <AutoCamera roomWidth={roomConfig.width} roomDepth={roomConfig.height} />
              <OrbitControls enableDamping dampingFactor={0.06}
                minDistance={1} maxDistance={40} target={[0, 0.5, 0]} />
              <Lights roomWidth={roomConfig.width} roomDepth={roomConfig.height} />
              <Room3D config={roomConfig} />
              {furniture.map(item => (
                <FurnitureModel
                  key={item.id} item={item}
                  roomWidth={roomConfig.width} roomHeight={roomConfig.height}
                  isSelected={item.id === selectedId}
                  onClick={(id) => setSelectedId(prev => prev === id ? null : id)}
                />
              ))}
              <Environment preset="apartment" />
            </Suspense>
          </Canvas>
        )}

        {selectedItem && (
          <motion.div
            initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }}
            style={{
              position:"absolute", top:16, right:16, zIndex:20,
              padding:"14px 18px", borderRadius:16,
              background:"rgba(255,255,255,0.30)", backdropFilter:"blur(24px)",
              border:"1px solid rgba(255,255,255,0.7)",
              boxShadow:"0 8px 32px rgba(120,80,220,0.12)",
              fontSize:13, color:"#2d1f4e", fontWeight:600, minWidth:160,
            }}>
            <div style={{ fontSize:11, color:"#9b93b8", marginBottom:4, textTransform:"uppercase", letterSpacing:"0.4px" }}>Selected</div>
            <div style={{ fontSize:15, fontWeight:700, color:"#4c1d95", marginBottom:8 }}>{selectedItem.label}</div>
            <div style={{ display:"flex", gap:6, alignItems:"center" }}>
              <div style={{ width:10, height:10, borderRadius:3, background:selectedItem.color, border:"1px solid rgba(0,0,0,0.1)" }}/>
              <span style={{ fontSize:12, color:"#6b5b95" }}>{selectedItem.w}×{selectedItem.h}cm</span>
            </div>
            <button onClick={() => setSelectedId(null)}
              style={{ marginTop:10, width:"100%", padding:"5px", borderRadius:8, border:"none",
                background:"rgba(139,92,246,0.10)", color:"#8b5cf6", fontSize:11, fontWeight:700, cursor:"pointer" }}>
              Deselect
            </button>
          </motion.div>
        )}

        <div style={{
          position:"absolute", bottom:20, left:20, zIndex:20,
          padding:"12px 18px", borderRadius:16,
          background:"rgba(255,255,255,0.25)", backdropFilter:"blur(20px)",
          border:"1px solid rgba(255,255,255,0.6)",
          fontSize:12, color:"#6b5b95", fontWeight:600, lineHeight:1.7,
        }}>
          🖱 Drag to rotate · Scroll to zoom · Right-click to pan
          <br/>
          <span style={{ fontSize:11, color:"#9b93b8" }}>Click any furniture to select it</span>
          {furniture.length === 0 && (
            <div style={{ marginTop:5, fontSize:11, color:"#9b93b8" }}>
              Go to 2D Plan → place furniture → come back
            </div>
          )}
        </div>

        <motion.button
          whileHover={{ scale:1.05, y:-2 }} whileTap={{ scale:0.95 }}
          onClick={() => router.push("/editor/2d")}
          style={{
            position:"absolute", bottom:20, right:20, zIndex:20,
            padding:"11px 24px", borderRadius:50, border:"none",
            fontFamily:"'Afacad',sans-serif", fontSize:13, fontWeight:700,
            color:"#fff", cursor:"pointer",
            background:"linear-gradient(135deg,#8b5cf6,#6d28d9)",
            boxShadow:"0 8px 24px rgba(109,40,217,0.35)",
          }}>
          ← Edit in 2D
        </motion.button>
      </div>
    </div>
  );
}
