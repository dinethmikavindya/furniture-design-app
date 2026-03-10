"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

/* ─────────────────────────────────────────
   TEMPORARY ROOM DATA
   (replace with API call later)
───────────────────────────────────────── */
const TEMP_ROOM = {
  name:       "My Space",
  shape:      "Rectangle",
  width:      5,
  height:     4,
  wallColor:  "#e8e0f0",
  floorColor: "#f5f0e8",
};

/* ─────────────────────────────────────────
   FURNITURE CATALOG
   ⚠ TEMPORARY — replace with:
   const res = await fetch("http://localhost:3001/api/furniture")
   const data = await res.json()
   when backend is ready
───────────────────────────────────────── */
const FURNITURE_CATALOG = {
  Sofas: [
    { type:"sofa-2",  label:"2-Seat Sofa",  w:160, h:80,  color:"#c4b5fd" },
    { type:"sofa-3",  label:"3-Seat Sofa",  w:220, h:85,  color:"#a78bfa" },
    { type:"sofa-l",  label:"L-Shape Sofa", w:200, h:160, color:"#8b5cf6" },
    { type:"sofa-1",  label:"Armchair Sofa",w:90,  h:85,  color:"#ddd6fe" },
  ],
  Beds: [
    { type:"bed-s",   label:"Single Bed",   w:100, h:200, color:"#bfdbfe" },
    { type:"bed-d",   label:"Double Bed",   w:140, h:200, color:"#93c5fd" },
    { type:"bed-k",   label:"King Bed",     w:180, h:210, color:"#60a5fa" },
  ],
  Chairs: [
    { type:"chair-a", label:"Armchair",     w:80,  h:80,  color:"#d8b4fe" },
    { type:"chair-d", label:"Dining Chair", w:50,  h:50,  color:"#e9d5ff" },
    { type:"chair-o", label:"Office Chair", w:60,  h:60,  color:"#c4b5fd" },
  ],
  Tables: [
    { type:"table-c", label:"Coffee Table", w:120, h:60,  color:"#fde68a" },
    { type:"table-d", label:"Dining Table", w:160, h:90,  color:"#fcd34d" },
    { type:"table-s", label:"Side Table",   w:50,  h:50,  color:"#fef3c7" },
  ],
  Storage: [
    { type:"ward",    label:"Wardrobe",     w:180, h:60,  color:"#d1fae5" },
    { type:"book",    label:"Bookcase",     w:100, h:30,  color:"#a7f3d0" },
    { type:"dress",   label:"Dresser",      w:120, h:50,  color:"#6ee7b7" },
  ],
  Decor: [
    { type:"plant",   label:"Plant",        w:40,  h:40,  color:"#86efac" },
    { type:"lamp",    label:"Floor Lamp",   w:35,  h:35,  color:"#fde68a" },
    { type:"rug",     label:"Rug",          w:160, h:120, color:"#fbcfe8" },
  ],
};

const CATEGORIES   = Object.keys(FURNITURE_CATALOG);
const SCALE        = 80; // 1 metre = 80px
const ITEM_COLORS  = ["#c4b5fd","#a78bfa","#93c5fd","#6ee7b7","#fde68a","#fbcfe8","#fca5a5","#d1fae5"];

let _uid = 1;
function uid() { return `f_${_uid++}_${Date.now()}`; }
function mToPx(m) { return parseFloat(m) * SCALE; }

/* ─────────────────────────────────────────
   FURNITURE PREVIEW SVG (left panel)
───────────────────────────────────────── */
function FurniturePreview({ item }) {
  const c = item.color;
  return (
    <svg width={52} height={44} viewBox="0 0 52 44" fill="none">
      <rect x="3" y="5" width="46" height="34" rx="5" fill={c} opacity="0.85"/>
      <rect x="3" y="5" width="46" height="34" rx="5"
        fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="1.2"/>
      <rect x="7" y="9" width="16" height="10" rx="3"
        fill="rgba(255,255,255,0.30)"/>
      <rect x="7" y="28" width="38" height="4" rx="2"
        fill="rgba(0,0,0,0.08)"/>
    </svg>
  );
}

/* ─────────────────────────────────────────
   KONVA CANVAS — full editor canvas
───────────────────────────────────────── */
function RoomCanvas({
  roomConfig, zoom, stageRef,
  furniture, selectedId,
  onSelect, onDragEnd, onTransformEnd,
  onStageClick,
}) {
  const containerRef   = useRef(null);
  const transformerRef = useRef(null);
  const [size, setSize] = useState({ w:800, h:600 });
  const [K,    setK]    = useState(null);

  /* measure container */
  useEffect(() => {
    if (!containerRef.current) return;
    const obs = new ResizeObserver(entries => {
      const { width, height } = entries[0].contentRect;
      setSize({ w: width, h: height });
    });
    obs.observe(containerRef.current);
    return () => obs.disconnect();
  }, []);

  /* dynamic import — no SSR */
  useEffect(() => {
    import("react-konva").then(m => setK({
      Stage: m.Stage, Layer: m.Layer, Rect: m.Rect,
      Line: m.Line, Text: m.Text, Group: m.Group,
      Arrow: m.Arrow, Transformer: m.Transformer,
    }));
  }, []);

  /* attach transformer to selected node */
  useEffect(() => {
    if (!K || !transformerRef.current || !stageRef.current) return;
    if (selectedId) {
      const node = stageRef.current.findOne(`#${selectedId}`);
      if (node) {
        transformerRef.current.nodes([node]);
        transformerRef.current.getLayer()?.batchDraw();
      }
    } else {
      transformerRef.current.nodes([]);
      transformerRef.current.getLayer()?.batchDraw();
    }
  }, [selectedId, furniture, K]);

  if (!K) {
    return (
      <div ref={containerRef} style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center" }}>
        <div style={{ fontSize:13, color:"rgba(139,92,246,0.4)", fontWeight:600 }}>Loading canvas…</div>
      </div>
    );
  }

  const { Stage, Layer, Rect, Line, Text, Group, Arrow, Transformer } = K;

  const roomW    = mToPx(roomConfig.width);
  const roomH    = mToPx(roomConfig.height);
  const offsetX  = (size.w / zoom - roomW) / 2;
  const offsetY  = (size.h / zoom - roomH) / 2;
  const WALL     = 8;
  const gridStep = SCALE * 0.5;

  /* grid lines */
  const gridLines = [];
  for (let x = gridStep; x < roomW; x += gridStep) {
    const isMetre = Number.isInteger(x / SCALE);
    gridLines.push(<Line key={`gx${x}`} points={[x,0,x,roomH]}
      stroke={isMetre ? "rgba(139,92,246,0.10)" : "rgba(139,92,246,0.05)"}
      strokeWidth={isMetre ? 0.8 : 0.5} />);
  }
  for (let y = gridStep; y < roomH; y += gridStep) {
    const isMetre = Number.isInteger(y / SCALE);
    gridLines.push(<Line key={`gy${y}`} points={[0,y,roomW,y]}
      stroke={isMetre ? "rgba(139,92,246,0.10)" : "rgba(139,92,246,0.05)"}
      strokeWidth={isMetre ? 0.8 : 0.5} />);
  }

  /* tick labels */
  const ticks = [];
  for (let x = SCALE; x < roomW; x += SCALE)
    ticks.push(<Text key={`tx${x}`} x={x-10} y={-18} text={`${x/SCALE}m`}
      fontSize={10} fill="#b0a0cc" fontFamily="'Afacad',sans-serif"/>);
  for (let y = SCALE; y < roomH; y += SCALE)
    ticks.push(<Text key={`ty${y}`} x={-26} y={y-7} text={`${y/SCALE}m`}
      fontSize={10} fill="#b0a0cc" fontFamily="'Afacad',sans-serif"/>);

  const wallFill = roomConfig.wallColor === "#ffffff" ? "#c0b0d8" : roomConfig.wallColor;

  return (
    <div ref={containerRef} style={{ flex:1, position:"relative", overflow:"hidden" }}>
      <Stage
        ref={stageRef}
        width={size.w} height={size.h}
        scaleX={zoom} scaleY={zoom}
        onClick={onStageClick}
        onTap={onStageClick}
        style={{ display:"block" }}
      >
        <Layer>
          {/* shadow */}
          <Rect x={offsetX+4} y={offsetY+6} width={roomW} height={roomH}
            fill="rgba(120,80,220,0.08)" cornerRadius={4} listening={false}/>

          {/* floor */}
          <Rect x={offsetX} y={offsetY} width={roomW} height={roomH}
            fill={roomConfig.floorColor} cornerRadius={2} listening={false}/>

          {/* wood texture */}
          {Array.from({ length: Math.floor(roomH/18) }).map((_,i) => (
            <Line key={`wd${i}`}
              points={[offsetX+2, offsetY+i*18+9, offsetX+roomW-2, offsetY+i*18+9]}
              stroke="rgba(0,0,0,0.025)" strokeWidth={1} listening={false}/>
          ))}

          {/* grid */}
          <Group x={offsetX} y={offsetY} listening={false}>{gridLines}</Group>
          <Group x={offsetX} y={offsetY} listening={false}>{ticks}</Group>

          {/* walls */}
          {[
            { x:offsetX-WALL/2, y:offsetY-WALL/2,       w:roomW+WALL, h:WALL },
            { x:offsetX-WALL/2, y:offsetY+roomH-WALL/2, w:roomW+WALL, h:WALL },
            { x:offsetX-WALL/2, y:offsetY-WALL/2,       w:WALL, h:roomH+WALL },
            { x:offsetX+roomW-WALL/2, y:offsetY-WALL/2, w:WALL, h:roomH+WALL },
          ].map((wall, i) => (
            <Rect key={`wall${i}`}
              x={wall.x} y={wall.y} width={wall.w} height={wall.h}
              fill={wallFill} cornerRadius={2} listening={false}/>
          ))}

          {/* dimension arrows */}
          <Arrow points={[offsetX, offsetY-32, offsetX+roomW, offsetY-32]}
            stroke="#8b5cf6" strokeWidth={1.5} fill="#8b5cf6"
            pointerLength={6} pointerWidth={5} pointerAtBeginning listening={false}/>
          <Text x={offsetX+roomW/2-16} y={offsetY-44}
            text={`${roomConfig.width}m`} fontSize={12} fill="#8b5cf6"
            fontFamily="'Afacad',sans-serif" fontStyle="bold" listening={false}/>
          <Arrow points={[offsetX-32, offsetY, offsetX-32, offsetY+roomH]}
            stroke="#8b5cf6" strokeWidth={1.5} fill="#8b5cf6"
            pointerLength={6} pointerWidth={5} pointerAtBeginning listening={false}/>
          <Text x={offsetX-52} y={offsetY+roomH/2-8}
            text={`${roomConfig.height}m`} fontSize={12} fill="#8b5cf6"
            fontFamily="'Afacad',sans-serif" fontStyle="bold" listening={false}/>

          {/* empty state hint */}
          {furniture.length === 0 && (
            <Text
              x={offsetX + roomW/2 - 110}
              y={offsetY + roomH/2 - 12}
              text="← Click furniture to place it on the canvas"
              fontSize={12} fill="rgba(139,92,246,0.28)"
              fontFamily="'Afacad',sans-serif" listening={false}/>
          )}

          {/* ── FURNITURE ITEMS
               FIX: all items live inside one Group at offsetX/offsetY
               so the Transformer knows exactly where they are ── */}
          <Group x={offsetX} y={offsetY}>
            {furniture.map(item => {
              const isSelected = item.id === selectedId;

              return (
                <Group
                  key={item.id}
                  id={item.id}
                  x={item.x} y={item.y}
                  rotation={item.rotation || 0}
                  draggable
                  onClick={e => { e.cancelBubble = true; onSelect(item.id); }}
                  onTap={e => { e.cancelBubble = true; onSelect(item.id); }}
                  onDragEnd={e => onDragEnd(item.id, e.target.x(), e.target.y())}
                  onTransformEnd={e => onTransformEnd(item.id, e)}
                >
                  {/* Drop shadow */}
                  <Rect x={3} y={4} width={item.w} height={item.h}
                    fill="rgba(0,0,0,0.10)" cornerRadius={5} listening={false}/>

                  {/* Main body */}
                  <Rect
                    width={item.w} height={item.h}
                    fill={item.color} opacity={0.90} cornerRadius={5}
                    stroke={isSelected ? "#8b5cf6" : "rgba(255,255,255,0.7)"}
                    strokeWidth={isSelected ? 2.5 : 1.2}
                    shadowColor={isSelected ? "#8b5cf6" : "transparent"}
                    shadowBlur={isSelected ? 14 : 0}
                  />

                  {/* Inner detail */}
                  <Rect x={5} y={5} width={item.w-10} height={item.h-10}
                    fill="rgba(255,255,255,0.18)" cornerRadius={3} listening={false}/>

                  {/* Label */}
                  <Text
                    text={item.label}
                    fontSize={item.w > 80 ? 11 : 9}
                    fill="#2d1f4e"
                    fontFamily="'Afacad',sans-serif"
                    fontStyle="600"
                    width={item.w}
                    align="center"
                    y={item.h/2 - 7}
                    listening={false}
                  />
                </Group>
              );
            })}
          </Group>

          {/* ── TRANSFORMER ── */}
          <Transformer
            ref={transformerRef}
            boundBoxFunc={(oldBox, newBox) => {
              if (newBox.width < 20 || newBox.height < 20) return oldBox;
              return newBox;
            }}
            rotateEnabled={true}
            borderStroke="#8b5cf6"
            borderStrokeWidth={1.5}
            anchorStroke="#8b5cf6"
            anchorFill="#fff"
            anchorSize={9}
            anchorCornerRadius={3}
            rotationSnaps={[0,45,90,135,180,225,270,315]}
          />
        </Layer>
      </Stage>
    </div>
  );
}

/* ─────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────── */
export default function Editor2D() {
  const router      = useRouter();
  const stageRef    = useRef(null);

  const [activeCategory, setActiveCategory] = useState("Sofas");
  const [roomConfig,     setRoomConfig]     = useState(TEMP_ROOM);
  const [zoom,           setZoom]           = useState(1);
  const [focusMode,      setFocusMode]      = useState(false);

  /* furniture on canvas */
  const [furniture,  setFurniture]  = useState([]);
  const [selectedId, setSelectedId] = useState(null);

  /* ── zoom ── */
  const zoomIn  = () => setZoom(z => Math.min(+(z+0.1).toFixed(1), 3));
  const zoomOut = () => setZoom(z => Math.max(+(z-0.1).toFixed(1), 0.3));
  const zoomFit = () => setZoom(1);

  /* ── place furniture ── */
  const placeFurniture = (item) => {
    const roomW = mToPx(roomConfig.width);
    const roomH = mToPx(roomConfig.height);
    const x = Math.max(10, roomW/2 - item.w/2);
    const y = Math.max(10, roomH/2 - item.h/2);
    const newItem = {
      id: uid(), type: item.type, label: item.label,
      x, y, w: item.w, h: item.h, color: item.color, rotation: 0,
    };
    setFurniture(prev => [...prev, newItem]);
    setSelectedId(newItem.id);
  };

  /* ── drag end ── */
  const handleDragEnd = (id, x, y) => {
    setFurniture(prev => prev.map(f =>
      f.id === id ? { ...f, x, y } : f
    ));
  };

  /* ── FIX: transform end — read scale BEFORE resetting it ── */
  const handleTransformEnd = (id, e) => {
    const node   = e.target;
    const scaleX = node.scaleX();
    const scaleY = node.scaleY();
    // reset scale to 1 immediately so Konva doesn't double-apply it
    node.scaleX(1);
    node.scaleY(1);
    setFurniture(prev => prev.map(f => {
      if (f.id !== id) return f;
      return {
        ...f,
        x:        node.x(),
        y:        node.y(),
        w:        Math.max(20, Math.round(f.w * scaleX)),
        h:        Math.max(20, Math.round(f.h * scaleY)),
        rotation: node.rotation(),
      };
    }));
  };

  /* ── deselect on empty canvas click ── */
  const handleStageClick = (e) => {
    if (e.target === e.target.getStage()) setSelectedId(null);
  };

  /* ── delete ── */
  const deleteSelected = () => {
    setFurniture(prev => prev.filter(f => f.id !== selectedId));
    setSelectedId(null);
  };

  const selectedItem = furniture.find(f => f.id === selectedId) || null;

  const updateSelected = (key, val) => {
    setFurniture(prev => prev.map(f =>
      f.id === selectedId ? { ...f, [key]: val } : f
    ));
  };

  /* ── undo ── */
  const undo = () => {
    setFurniture(prev => { const next = [...prev]; next.pop(); return next; });
    setSelectedId(null);
  };

  /* ─── CSS ─── */
  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Afacad:ital,wght@0,400;0,500;0,600;0,700&display=swap');
    *,*::before,*::after { box-sizing:border-box; margin:0; padding:0; }
    @keyframes shimmer {
      0%   { background-position:-300% center }
      100% { background-position: 300% center }
    }
    @keyframes floatA {
      0%,100% { transform:translateY(0) }
      50%     { transform:translateY(-16px) }
    }
    ::-webkit-scrollbar { width:4px; }
    ::-webkit-scrollbar-track { background:transparent; }
    ::-webkit-scrollbar-thumb { background:rgba(196,176,240,0.4); border-radius:4px; }
    input[type=number]::-webkit-inner-spin-button,
    input[type=number]::-webkit-outer-spin-button { -webkit-appearance:none; }
  `;

  const glassPanel = {
    borderRadius:   20,
    background:     "rgba(255,255,255,0.22)",
    backdropFilter: "blur(32px) saturate(200%) brightness(1.06)",
    WebkitBackdropFilter: "blur(32px) saturate(200%) brightness(1.06)",
    border:         "1.5px solid rgba(255,255,255,0.65)",
    boxShadow:      "0 8px 32px rgba(120,80,220,0.08), inset 0 1.5px 0 rgba(255,255,255,0.9)",
    overflow:       "hidden",
  };

  const toolBtn = {
    width:34, height:34, borderRadius:50, border:"none",
    background:"rgba(255,255,255,0.45)", backdropFilter:"blur(12px)",
    cursor:"pointer", fontSize:15, color:"#6b5b95",
    display:"flex", alignItems:"center", justifyContent:"center",
    boxShadow:"0 2px 10px rgba(120,80,220,0.06), 0 0 0 0.5px rgba(255,255,255,0.6)",
  };

  const inputStyle = {
    width:"100%", padding:"8px 12px", borderRadius:12,
    border:"1px solid rgba(255,255,255,0.6)",
    background:"rgba(255,255,255,0.55)", backdropFilter:"blur(12px)",
    fontFamily:"'Afacad',sans-serif", fontSize:13,
    color:"#2d1f4e", fontWeight:700, outline:"none",
    boxShadow:"inset 0 1px 0 rgba(255,255,255,0.8)",
  };

  const labelStyle = {
    fontSize:10, color:"#b0a0cc", marginBottom:4,
    fontWeight:600, display:"block", textTransform:"uppercase", letterSpacing:"0.4px",
  };

  return (
    <div style={{
      display:"flex", flexDirection:"column", height:"100vh",
      fontFamily:"'Afacad','Helvetica Neue',sans-serif",
      background:"linear-gradient(135deg,#f0eaff 0%,#e8f4ff 50%,#f0e8ff 100%)",
      overflow:"hidden", position:"relative",
    }}>
      <style dangerouslySetInnerHTML={{ __html: css }} />

      {/* orbs */}
      <div style={{ position:"fixed", inset:0, zIndex:0, pointerEvents:"none", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:"-10%", left:"-6%", width:400, height:400, borderRadius:"50%",
          background:"radial-gradient(circle,rgba(167,139,250,0.22) 0%,transparent 68%)", animation:"floatA 9s ease-in-out infinite" }}/>
        <div style={{ position:"absolute", bottom:"-5%", right:"-4%", width:360, height:360, borderRadius:"50%",
          background:"radial-gradient(circle,rgba(96,165,250,0.18) 0%,transparent 68%)", animation:"floatA 11s ease-in-out infinite 1s" }}/>
        <div style={{ position:"absolute", inset:0,
          backgroundImage:"linear-gradient(rgba(139,92,246,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(139,92,246,0.03) 1px,transparent 1px)",
          backgroundSize:"40px 40px" }}/>
      </div>

      {/* ══ TOP BAR ══ */}
      <motion.header
        initial={{ y:-20, opacity:0 }} animate={{ y:0, opacity:1 }}
        transition={{ type:"spring", stiffness:120, damping:18 }}
        style={{
          height:52, display:"flex", alignItems:"center",
          justifyContent:"space-between", padding:"0 20px",
          position:"relative", zIndex:30,
          background:"rgba(255,255,255,0.18)",
          backdropFilter:"blur(24px) saturate(180%)",
          borderBottom:"1px solid rgba(255,255,255,0.45)",
          boxShadow:"0 2px 20px rgba(120,80,220,0.06)", flexShrink:0,
        }}
      >
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <span onClick={() => router.push("/dashboard")}
            style={{ fontSize:18, fontWeight:700, color:"#2d1f4e", cursor:"pointer", letterSpacing:"-0.3px" }}>
            Mauve Studio
            <span style={{
              background:"linear-gradient(90deg,#8b5cf6,#60a5fa,#ec4899,#8b5cf6)",
              backgroundSize:"300% auto", WebkitBackgroundClip:"text",
              WebkitTextFillColor:"transparent", animation:"shimmer 2.8s linear infinite",
            }}>.</span>
          </span>
          <span style={{ color:"#c4b5fd", fontSize:16 }}>›</span>
          <span style={{ fontSize:14, fontWeight:600, color:"#6b5b95" }}>{roomConfig.name}</span>
          {furniture.length > 0 && (
            <span style={{
              fontSize:11, fontWeight:700, padding:"2px 10px", borderRadius:50,
              background:"rgba(139,92,246,0.12)", color:"#8b5cf6",
            }}>{furniture.length} item{furniture.length !== 1 ? "s" : ""}</span>
          )}
        </div>

        <div style={{
          display:"flex", gap:4,
          background:"rgba(255,255,255,0.35)", backdropFilter:"blur(20px)",
          border:"1px solid rgba(255,255,255,0.6)", borderRadius:50, padding:"3px",
          boxShadow:"0 4px 16px rgba(120,80,220,0.08), inset 0 1px 0 rgba(255,255,255,0.8)",
        }}>
          <div style={{ padding:"5px 20px", borderRadius:50,
            background:"linear-gradient(135deg,#8b5cf6,#6d28d9)",
            fontSize:13, fontWeight:700, color:"#fff",
            boxShadow:"0 4px 14px rgba(109,40,217,0.35)" }}>2D Plan</div>
          <motion.div whileHover={{ scale:1.04 }} whileTap={{ scale:0.96 }}
            onClick={() => router.push("/editor/3d")}
            style={{ padding:"5px 20px", borderRadius:50, fontSize:13, fontWeight:600, color:"#6b5b95", cursor:"pointer" }}>
            3D View
          </motion.div>
        </div>

        <motion.button whileHover={{ scale:1.05, y:-1 }} whileTap={{ scale:0.95 }}
          style={{
            padding:"7px 22px", borderRadius:50, border:"none",
            fontFamily:"'Afacad',sans-serif", fontSize:13, fontWeight:700,
            color:"#fff", cursor:"pointer",
            background:"linear-gradient(135deg,#8b5cf6,#6d28d9)",
            boxShadow:"0 6px 20px rgba(109,40,217,0.35)",
            display:"flex", alignItems:"center", gap:6,
          }}>
          <span>⊡</span> Save
        </motion.button>
      </motion.header>

      {/* ══ BODY ══ */}
      <div style={{
        flex:1, display:"flex", gap:12, padding:"12px",
        overflow:"hidden", position:"relative", zIndex:10,
      }}>

        {/* ══ LEFT PANEL ══ */}
        <motion.div
          initial={{ x:-30, opacity:0 }} animate={{ x:0, opacity:1 }}
          transition={{ type:"spring", stiffness:100, damping:18, delay:0.1 }}
          style={{
            display:"flex", flexDirection:"column", ...glassPanel,
            maxWidth: focusMode ? 0 : 280,
            minWidth: focusMode ? 0 : 280,
            opacity:  focusMode ? 0 : 1,
            transition:"all 0.45s cubic-bezier(0.22,1,0.36,1)",
            pointerEvents: focusMode ? "none" : "all",
            overflow:"hidden",
          }}
        >
          <div style={{ padding:"14px 18px 10px", borderBottom:"1px solid rgba(255,255,255,0.5)", flexShrink:0 }}>
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:12 }}>
              <span style={{ fontSize:16 }}>🛋️</span>
              <span style={{ fontSize:15, fontWeight:700, color:"#2d1f4e" }}>Furniture</span>
              <span style={{ fontSize:11, color:"#9b93b8", fontWeight:500, marginLeft:"auto" }}>click to place</span>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:5 }}>
              {CATEGORIES.map(cat => (
                <motion.button key={cat} onClick={() => setActiveCategory(cat)}
                  whileHover={{ scale:1.04 }} whileTap={{ scale:0.95 }}
                  style={{
                    padding:"6px 4px", borderRadius:10, border:"none", cursor:"pointer",
                    fontFamily:"'Afacad',sans-serif", fontSize:11,
                    fontWeight: activeCategory===cat ? 700 : 500,
                    color:      activeCategory===cat ? "#4c1d95" : "#9b93b8",
                    background: activeCategory===cat ? "rgba(255,255,255,0.70)" : "rgba(255,255,255,0.28)",
                    backdropFilter:"blur(12px)",
                    boxShadow: activeCategory===cat
                      ? "0 4px 14px rgba(139,92,246,0.12), 0 0 0 0.5px rgba(255,255,255,0.6)"
                      : "none",
                    transition:"all 0.2s cubic-bezier(0.22,1,0.36,1)",
                  }}
                >{cat}</motion.button>
              ))}
            </div>
          </div>

          <div style={{ flex:1, overflowY:"auto", padding:"10px 12px" }}>
            {FURNITURE_CATALOG[activeCategory].map((item, i) => (
              <motion.div key={item.type}
                initial={{ x:-10, opacity:0 }}
                animate={{ x:0, opacity:1 }}
                transition={{ delay:i*0.05, type:"spring", stiffness:140, damping:18 }}
                onClick={() => placeFurniture(item)}
                whileHover={{ x:4, background:"rgba(255,255,255,0.50)" }}
                whileTap={{ scale:0.97 }}
                style={{
                  display:"flex", alignItems:"center", gap:12,
                  padding:"9px 12px", borderRadius:14, marginBottom:7,
                  background:"rgba(255,255,255,0.28)",
                  border:"1px solid rgba(255,255,255,0.55)",
                  cursor:"pointer", transition:"all 0.2s",
                }}
              >
                <div style={{ width:52, height:44, borderRadius:10, flexShrink:0, overflow:"hidden", border:"1px solid rgba(255,255,255,0.6)" }}>
                  <FurniturePreview item={item}/>
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:13, fontWeight:600, color:"#2d1f4e", marginBottom:2, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>
                    {item.label}
                  </div>
                  <div style={{ fontSize:11, color:"#9b93b8" }}>{item.w} × {item.h} cm</div>
                </div>
                <span style={{ fontSize:16, color:"#c4b5fd", flexShrink:0 }}>+</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ══ CANVAS ══ */}
        <motion.div
          initial={{ y:20, opacity:0 }} animate={{ y:0, opacity:1 }}
          transition={{ type:"spring", stiffness:100, damping:18, delay:0.15 }}
          style={{
            flex:1, display:"flex", flexDirection:"column",
            borderRadius:24, overflow:"hidden",
            background:"rgba(255,255,255,0.30)",
            backdropFilter:"blur(24px) saturate(180%)",
            WebkitBackdropFilter:"blur(24px) saturate(180%)",
            border:"1.5px solid rgba(255,255,255,0.65)",
            boxShadow:"0 8px 32px rgba(120,80,220,0.08), inset 0 1.5px 0 rgba(255,255,255,0.9)",
          }}
        >
          <RoomCanvas
            roomConfig={roomConfig}
            zoom={zoom}
            stageRef={stageRef}
            furniture={furniture}
            selectedId={selectedId}
            onSelect={setSelectedId}
            onDragEnd={handleDragEnd}
            onTransformEnd={handleTransformEnd}
            onStageClick={handleStageClick}
          />

          {/* toolbar */}
          <div style={{
            height:52, borderTop:"1px solid rgba(255,255,255,0.5)",
            display:"flex", alignItems:"center", justifyContent:"center",
            gap:8, padding:"0 16px",
            background:"rgba(255,255,255,0.18)", flexShrink:0,
          }}>
            <motion.button title="Undo" whileHover={{ scale:1.1 }} whileTap={{ scale:0.9 }}
              onClick={undo} style={toolBtn}>↩</motion.button>

            <div style={{ width:1, height:20, background:"rgba(200,190,230,0.4)", margin:"0 2px" }}/>

            <motion.button title="Fit to screen" whileHover={{ scale:1.1 }} whileTap={{ scale:0.9 }}
              onClick={zoomFit} style={toolBtn}>⤢</motion.button>

            <motion.button
              title={focusMode ? "Exit presentation" : "Presentation view"}
              whileHover={{ scale:1.1 }} whileTap={{ scale:0.9 }}
              onClick={() => setFocusMode(f => !f)}
              style={{
                ...toolBtn,
                background: focusMode ? "linear-gradient(135deg,#8b5cf6,#6d28d9)" : "rgba(255,255,255,0.45)",
                color:      focusMode ? "#fff" : "#6b5b95",
                boxShadow:  focusMode ? "0 4px 14px rgba(109,40,217,0.35)" : toolBtn.boxShadow,
              }}>⛶</motion.button>

            <div style={{ width:1, height:20, background:"rgba(200,190,230,0.4)", margin:"0 2px" }}/>

            <motion.button title="Zoom out" whileHover={{ scale:1.1 }} whileTap={{ scale:0.9 }}
              onClick={zoomOut} style={toolBtn}>−</motion.button>

            <div style={{
              padding:"5px 14px", borderRadius:50,
              background:"rgba(255,255,255,0.45)", backdropFilter:"blur(12px)",
              fontSize:12, fontWeight:700, color:"#6b5b95",
              boxShadow:"0 2px 10px rgba(120,80,220,0.06), 0 0 0 0.5px rgba(255,255,255,0.6)",
              minWidth:58, textAlign:"center",
            }}>{Math.round(zoom*100)}%</div>

            <motion.button title="Zoom in" whileHover={{ scale:1.1 }} whileTap={{ scale:0.9 }}
              onClick={zoomIn} style={toolBtn}>+</motion.button>

            {selectedId && (
              <motion.button
                initial={{ scale:0, opacity:0 }} animate={{ scale:1, opacity:1 }}
                title="Delete selected"
                whileHover={{ scale:1.1 }} whileTap={{ scale:0.9 }}
                onClick={deleteSelected}
                style={{
                  ...toolBtn,
                  background:"rgba(254,226,226,0.70)",
                  color:"#dc2626",
                  boxShadow:"0 2px 10px rgba(220,38,38,0.10), 0 0 0 0.5px rgba(252,165,165,0.5)",
                  marginLeft:4,
                }}>🗑</motion.button>
            )}
          </div>
        </motion.div>

        {/* ══ RIGHT PANEL ══ */}
        <motion.div
          initial={{ x:30, opacity:0 }} animate={{ x:0, opacity:1 }}
          transition={{ type:"spring", stiffness:100, damping:18, delay:0.2 }}
          style={{
            display:"flex", flexDirection:"column", gap:10,
            maxWidth: focusMode ? 0 : 260,
            minWidth: focusMode ? 0 : 260,
            opacity:  focusMode ? 0 : 1,
            transition:"all 0.45s cubic-bezier(0.22,1,0.36,1)",
            pointerEvents: focusMode ? "none" : "all",
            overflow: focusMode ? "hidden" : "auto",
          }}
        >
          {/* ── PROPERTIES ── */}
          <div style={glassPanel}>
            <div style={{
              display:"flex", alignItems:"center", justifyContent:"space-between",
              padding:"13px 16px 10px", borderBottom:"1px solid rgba(255,255,255,0.5)",
            }}>
              <div style={{ display:"flex", alignItems:"center", gap:7 }}>
                <span style={{ fontSize:15 }}>⚙</span>
                <span style={{ fontSize:14, fontWeight:700, color:"#2d1f4e" }}>Properties</span>
              </div>
              {selectedItem && (
                <motion.button whileHover={{ scale:1.1 }} whileTap={{ scale:0.9 }}
                  onClick={deleteSelected}
                  style={{ background:"none", border:"none", cursor:"pointer", fontSize:16, color:"#fca5a5" }}>
                  🗑
                </motion.button>
              )}
            </div>

            <div style={{ padding:"14px 16px" }}>
              {selectedItem ? (
                <div style={{ display:"flex", flexDirection:"column", gap:13 }}>

                  <div>
                    <span style={labelStyle}>Selected Item</span>
                    <div style={{
                      padding:"8px 12px", borderRadius:12,
                      background:"rgba(139,92,246,0.08)",
                      border:"1px solid rgba(139,92,246,0.15)",
                      fontSize:13, fontWeight:700, color:"#4c1d95",
                      display:"flex", alignItems:"center", gap:8,
                    }}>
                      <div style={{ width:14, height:14, borderRadius:4, background:selectedItem.color, flexShrink:0 }}/>
                      {selectedItem.label}
                    </div>
                  </div>

                  <div style={{ display:"flex", gap:8 }}>
                    <div style={{ flex:1 }}>
                      <span style={labelStyle}>Width (cm)</span>
                      <input type="number" min="20" max="500" step="5"
                        value={Math.round(selectedItem.w)}
                        onChange={e => updateSelected("w", Math.max(20, +e.target.value))}
                        style={inputStyle}/>
                    </div>
                    <div style={{ flex:1 }}>
                      <span style={labelStyle}>Depth (cm)</span>
                      <input type="number" min="20" max="500" step="5"
                        value={Math.round(selectedItem.h)}
                        onChange={e => updateSelected("h", Math.max(20, +e.target.value))}
                        style={inputStyle}/>
                    </div>
                  </div>

                  <div>
                    <span style={labelStyle}>Rotation  <span style={{ color:"#c4b5fd", fontWeight:400 }}>{Math.round(selectedItem.rotation || 0)}°</span></span>
                    <input type="range" min="0" max="360" step="1"
                      value={Math.round(selectedItem.rotation || 0)}
                      onChange={e => updateSelected("rotation", +e.target.value)}
                      style={{ width:"100%", accentColor:"#8b5cf6", cursor:"pointer" }}/>
                    <div style={{ display:"flex", justifyContent:"space-between", fontSize:10, color:"#c4b5fd", marginTop:3 }}>
                      <span>0°</span><span>90°</span><span>180°</span><span>270°</span><span>360°</span>
                    </div>
                  </div>

                  <div>
                    <span style={labelStyle}>Colour</span>
                    <div style={{ display:"flex", gap:7, flexWrap:"wrap" }}>
                      {ITEM_COLORS.map(c => (
                        <motion.button key={c}
                          whileHover={{ scale:1.15 }} whileTap={{ scale:0.92 }}
                          onClick={() => updateSelected("color", c)}
                          style={{
                            width:28, height:28, borderRadius:8, border:"none",
                            background:c, cursor:"pointer",
                            boxShadow: selectedItem.color === c
                              ? "0 0 0 2.5px #8b5cf6, 0 3px 10px rgba(139,92,246,0.3)"
                              : "0 2px 6px rgba(0,0,0,0.10), 0 0 0 1px rgba(255,255,255,0.7)",
                            transition:"box-shadow 0.18s",
                          }}/>
                      ))}
                    </div>
                  </div>

                  <div style={{ display:"flex", gap:8 }}>
                    <div style={{ flex:1 }}>
                      <span style={labelStyle}>X pos</span>
                      <div style={{ ...inputStyle, color:"#9b93b8", fontWeight:500 }}>
                        {Math.round(selectedItem.x)} px
                      </div>
                    </div>
                    <div style={{ flex:1 }}>
                      <span style={labelStyle}>Y pos</span>
                      <div style={{ ...inputStyle, color:"#9b93b8", fontWeight:500 }}>
                        {Math.round(selectedItem.y)} px
                      </div>
                    </div>
                  </div>

                </div>
              ) : (
                <div style={{
                  textAlign:"center", padding:"20px 0",
                  fontSize:12, color:"#c4b5fd", fontWeight:500, lineHeight:1.6,
                }}>
                  <div style={{ fontSize:28, marginBottom:8 }}>◈</div>
                  Click a furniture item<br/>on the canvas to<br/>see its properties
                </div>
              )}
            </div>
          </div>

          {/* ── ROOM SETTINGS ── */}
          <div style={glassPanel}>
            <div style={{
              display:"flex", alignItems:"center",
              padding:"13px 16px 10px", borderBottom:"1px solid rgba(255,255,255,0.5)",
            }}>
              <span style={{ fontSize:15, marginRight:7 }}>◫</span>
              <span style={{ fontSize:14, fontWeight:700, color:"#2d1f4e" }}>Room Settings</span>
            </div>
            <div style={{ padding:"14px 16px", display:"flex", flexDirection:"column", gap:14 }}>

              <div>
                <div style={{ fontSize:11, fontWeight:600, color:"#9b93b8", marginBottom:8, textTransform:"uppercase", letterSpacing:"0.5px" }}>Flooring</div>
                <select value={roomConfig.floorColor}
                  onChange={e => setRoomConfig(r => ({ ...r, floorColor:e.target.value }))}
                  style={{ width:"100%", padding:"9px 12px", borderRadius:12,
                    border:"1px solid rgba(255,255,255,0.6)",
                    background:"rgba(255,255,255,0.45)", backdropFilter:"blur(12px)",
                    fontFamily:"'Afacad',sans-serif", fontSize:13, color:"#2d1f4e",
                    outline:"none", cursor:"pointer",
                    boxShadow:"inset 0 1px 0 rgba(255,255,255,0.8)" }}>
                  <option value="#f5f0e8">Warm White</option>
                  <option value="#d4a96a">Oak Wood</option>
                  <option value="#c8a96e">Honey Oak</option>
                  <option value="#a0785a">Dark Walnut</option>
                  <option value="#e8e0d8">Light Stone</option>
                  <option value="#d0c8c0">Grey Tile</option>
                </select>
              </div>

              <div>
                <div style={{ fontSize:11, fontWeight:600, color:"#9b93b8", marginBottom:8, textTransform:"uppercase", letterSpacing:"0.5px" }}>Wall Colour</div>
                <div style={{ display:"flex", gap:7, flexWrap:"wrap" }}>
                  {[
                    { color:"#ffffff", label:"White"    },
                    { color:"#f5f0e8", label:"Cream"    },
                    { color:"#e8e0f0", label:"Lavender" },
                    { color:"#d4e8d4", label:"Sage"     },
                    { color:"#e0e8f0", label:"Sky"      },
                    { color:"#f0e0e0", label:"Blush"    },
                  ].map(w => (
                    <motion.button key={w.color}
                      whileHover={{ scale:1.12 }} whileTap={{ scale:0.95 }}
                      onClick={() => setRoomConfig(r => ({ ...r, wallColor:w.color }))}
                      title={w.label}
                      style={{
                        width:32, height:32, borderRadius:10, border:"none",
                        background:w.color, cursor:"pointer",
                        boxShadow: roomConfig.wallColor === w.color
                          ? "0 0 0 2.5px #8b5cf6, 0 4px 12px rgba(139,92,246,0.25)"
                          : "0 2px 8px rgba(0,0,0,0.08), 0 0 0 1px rgba(255,255,255,0.8)",
                        transition:"box-shadow 0.2s",
                      }}/>
                  ))}
                </div>
              </div>

              <div>
                <div style={{ fontSize:11, fontWeight:600, color:"#9b93b8", marginBottom:8, textTransform:"uppercase", letterSpacing:"0.5px" }}>Dimensions</div>
                <div style={{ display:"flex", gap:8 }}>
                  {[
                    { key:"width",  label:"WIDTH"  },
                    { key:"height", label:"HEIGHT" },
                  ].map(d => (
                    <div key={d.key} style={{ flex:1 }}>
                      <div style={{ fontSize:10, color:"#b0a0cc", marginBottom:4, fontWeight:600 }}>{d.label}</div>
                      <div style={{ position:"relative" }}>
                        <input type="number" min="1" max="20" step="0.5"
                          value={roomConfig[d.key]}
                          onChange={e => setRoomConfig(r => ({ ...r, [d.key]: parseFloat(e.target.value)||1 }))}
                          style={{ ...inputStyle, paddingRight:28 }}/>
                        <span style={{
                          position:"absolute", right:10, top:"50%", transform:"translateY(-50%)",
                          fontSize:11, color:"#9b93b8", fontWeight:600, pointerEvents:"none",
                        }}>m</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}