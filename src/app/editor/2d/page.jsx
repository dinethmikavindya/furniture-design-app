"use client";

import { useState, useRef, useEffect, useCallback } from "react";
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

const CATEGORIES = ["Sofas", "Beds", "Chairs", "Tables", "Storage", "Decor"];
const SCALE = 80; // 1 metre = 80px

function mToPx(m) { return parseFloat(m) * SCALE; }

/* ─────────────────────────────────────────
   KONVA CANVAS COMPONENT
   Must be a separate component so we can
   dynamically import it (no SSR)
───────────────────────────────────────── */
function RoomCanvas({ roomConfig, zoom, onZoomChange, stageRef }) {
  const containerRef = useRef(null);
  const [size, setSize] = useState({ w: 800, h: 600 });

  /* ── measure container so canvas fills it ── */
  useEffect(() => {
    if (!containerRef.current) return;
    const obs = new ResizeObserver(entries => {
      const { width, height } = entries[0].contentRect;
      setSize({ w: width, h: height });
    });
    obs.observe(containerRef.current);
    return () => obs.disconnect();
  }, []);

  /* ── dynamically import Konva only in browser ── */
  const [KonvaComponents, setKonvaComponents] = useState(null);

  useEffect(() => {
    import("react-konva").then(m => {
      setKonvaComponents({
        Stage:       m.Stage,
        Layer:       m.Layer,
        Rect:        m.Rect,
        Line:        m.Line,
        Text:        m.Text,
        Group:       m.Group,
        Arrow:       m.Arrow,
      });
    });
  }, []);

  if (!KonvaComponents) {
    return (
      <div ref={containerRef} style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center" }}>
        <div style={{ fontSize:13, color:"rgba(139,92,246,0.4)", fontWeight:600 }}>Loading canvas…</div>
      </div>
    );
  }

  const { Stage, Layer, Rect, Line, Text, Group, Arrow } = KonvaComponents;

  const roomW   = mToPx(roomConfig.width);
  const roomH   = mToPx(roomConfig.height);

  /* centre the room in the canvas */
  const offsetX = (size.w / zoom - roomW) / 2;
  const offsetY = (size.h / zoom - roomH) / 2;

  /* grid lines every 0.5m inside the room */
  const gridLines = [];
  const gridStep  = SCALE * 0.5;
  for (let x = gridStep; x < roomW; x += gridStep) {
    const isMetre = Math.round(x / SCALE) === x / SCALE;
    gridLines.push(
      <Line
        key={`gx${x}`}
        points={[x, 0, x, roomH]}
        stroke={isMetre ? "rgba(139,92,246,0.10)" : "rgba(139,92,246,0.05)"}
        strokeWidth={isMetre ? 0.8 : 0.5}
      />
    );
  }
  for (let y = gridStep; y < roomH; y += gridStep) {
    const isMetre = Math.round(y / SCALE) === y / SCALE;
    gridLines.push(
      <Line
        key={`gy${y}`}
        points={[0, y, roomW, y]}
        stroke={isMetre ? "rgba(139,92,246,0.10)" : "rgba(139,92,246,0.05)"}
        strokeWidth={isMetre ? 0.8 : 0.5}
      />
    );
  }

  /* metre tick labels along edges */
  const tickLabels = [];
  for (let x = SCALE; x < roomW; x += SCALE) {
    tickLabels.push(
      <Text
        key={`tx${x}`}
        x={x - 10} y={-18}
        text={`${x / SCALE}m`}
        fontSize={10} fill="#b0a0cc"
        fontFamily="'Afacad',sans-serif"
      />
    );
  }
  for (let y = SCALE; y < roomH; y += SCALE) {
    tickLabels.push(
      <Text
        key={`ty${y}`}
        x={-26} y={y - 7}
        text={`${y / SCALE}m`}
        fontSize={10} fill="#b0a0cc"
        fontFamily="'Afacad',sans-serif"
      />
    );
  }

  /* wall thickness */
  const WALL = 8;

  return (
    <div ref={containerRef} style={{ flex:1, position:"relative" }}>
      <Stage
        ref={stageRef}
        width={size.w}
        height={size.h}
        scaleX={zoom}
        scaleY={zoom}
        style={{ display:"block" }}
      >
        <Layer>

          {/* ── Outer shadow behind room ── */}
          <Rect
            x={offsetX + 4}
            y={offsetY + 6}
            width={roomW}
            height={roomH}
            fill="rgba(120,80,220,0.08)"
            cornerRadius={4}
            listening={false}
          />

          {/* ── Floor fill ── */}
          <Rect
            x={offsetX}
            y={offsetY}
            width={roomW}
            height={roomH}
            fill={roomConfig.floorColor}
            cornerRadius={2}
            listening={false}
          />

          {/* ── Floor texture lines (wood effect) ── */}
          {Array.from({ length: Math.floor(roomH / 18) }).map((_, i) => (
            <Line
              key={`wood${i}`}
              points={[offsetX + 2, offsetY + i * 18 + 9, offsetX + roomW - 2, offsetY + i * 18 + 9]}
              stroke="rgba(0,0,0,0.03)"
              strokeWidth={1}
              listening={false}
            />
          ))}

          {/* ── Grid inside room ── */}
          <Group x={offsetX} y={offsetY} listening={false}>
            {gridLines}
          </Group>

          {/* ── Tick labels ── */}
          <Group x={offsetX} y={offsetY} listening={false}>
            {tickLabels}
          </Group>

          {/* ── Wall — bottom (thicker, cast shadow) ── */}
          <Rect
            x={offsetX - WALL / 2}
            y={offsetY + roomH - WALL / 2}
            width={roomW + WALL}
            height={WALL}
            fill={roomConfig.wallColor === "#ffffff" ? "#d0c0e0" : roomConfig.wallColor}
            cornerRadius={2}
            listening={false}
          />
          {/* ── Wall — right ── */}
          <Rect
            x={offsetX + roomW - WALL / 2}
            y={offsetY - WALL / 2}
            width={WALL}
            height={roomH + WALL}
            fill={roomConfig.wallColor === "#ffffff" ? "#d0c0e0" : roomConfig.wallColor}
            cornerRadius={2}
            listening={false}
          />
          {/* ── Wall — top ── */}
          <Rect
            x={offsetX - WALL / 2}
            y={offsetY - WALL / 2}
            width={roomW + WALL}
            height={WALL}
            fill={roomConfig.wallColor === "#ffffff" ? "#c0b0d8" : roomConfig.wallColor}
            cornerRadius={2}
            listening={false}
          />
          {/* ── Wall — left ── */}
          <Rect
            x={offsetX - WALL / 2}
            y={offsetY - WALL / 2}
            width={WALL}
            height={roomH + WALL}
            fill={roomConfig.wallColor === "#ffffff" ? "#c0b0d8" : roomConfig.wallColor}
            cornerRadius={2}
            listening={false}
          />

          {/* ── Dimension arrows + labels ── */}
          {/* Width arrow along top */}
          <Arrow
            points={[offsetX, offsetY - 32, offsetX + roomW, offsetY - 32]}
            stroke="#8b5cf6" strokeWidth={1.5}
            fill="#8b5cf6" pointerLength={6} pointerWidth={5}
            pointerAtBeginning listening={false}
          />
          <Text
            x={offsetX + roomW / 2 - 16}
            y={offsetY - 44}
            text={`${roomConfig.width}m`}
            fontSize={12} fill="#8b5cf6"
            fontFamily="'Afacad',sans-serif"
            fontStyle="bold"
            listening={false}
          />

          {/* Height arrow along left */}
          <Arrow
            points={[offsetX - 32, offsetY, offsetX - 32, offsetY + roomH]}
            stroke="#8b5cf6" strokeWidth={1.5}
            fill="#8b5cf6" pointerLength={6} pointerWidth={5}
            pointerAtBeginning listening={false}
          />
          <Text
            x={offsetX - 52}
            y={offsetY + roomH / 2 - 8}
            text={`${roomConfig.height}m`}
            fontSize={12} fill="#8b5cf6"
            fontFamily="'Afacad',sans-serif"
            fontStyle="bold"
            listening={false}
          />

          {/* ── Empty state message (disappears when furniture added) ── */}
          <Text
            x={offsetX + roomW / 2 - 90}
            y={offsetY + roomH / 2 - 12}
            text="Click furniture on the left to place it here"
            fontSize={12}
            fill="rgba(139,92,246,0.30)"
            fontFamily="'Afacad',sans-serif"
            fontStyle="600"
            listening={false}
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
  const [selectedItem,   setSelectedItem]   = useState(null);
  const [roomConfig,     setRoomConfig]     = useState(TEMP_ROOM);
  const [zoom,           setZoom]           = useState(1);
  const [focusMode, setFocusMode] = useState(false);

  /* ── Zoom helpers ── */
  const zoomIn  = () => setZoom(z => Math.min(+(z + 0.1).toFixed(1), 3));
  const zoomOut = () => setZoom(z => Math.max(+(z - 0.1).toFixed(1), 0.3));
  const zoomFit = () => setZoom(1);

  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Afacad:ital,wght@0,400;0,500;0,600;0,700&display=swap');
    *,*::before,*::after { box-sizing:border-box; margin:0; padding:0; }
    @keyframes shimmer {
      0%   { background-position: -300% center }
      100% { background-position:  300% center }
    }
    @keyframes floatA {
      0%,100% { transform: translateY(0) }
      50%     { transform: translateY(-16px) }
    }
    ::-webkit-scrollbar { width: 4px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: rgba(196,176,240,0.4); border-radius: 4px; }
  `;

  /* ── Shared panel styles ── */
  const glassPanel = {
    borderRadius:    20,
    background:      "rgba(255,255,255,0.22)",
    backdropFilter:  "blur(32px) saturate(200%) brightness(1.06)",
    WebkitBackdropFilter: "blur(32px) saturate(200%) brightness(1.06)",
    border:          "1.5px solid rgba(255,255,255,0.65)",
    boxShadow:       "0 8px 32px rgba(120,80,220,0.08), inset 0 1.5px 0 rgba(255,255,255,0.9)",
    overflow:        "hidden",
  };

  const toolBtn = {
    width:34, height:34, borderRadius:50, border:"none",
    background:"rgba(255,255,255,0.45)",
    backdropFilter:"blur(12px)",
    cursor:"pointer", fontSize:15, color:"#6b5b95",
    display:"flex", alignItems:"center", justifyContent:"center",
    boxShadow:"0 2px 10px rgba(120,80,220,0.06), 0 0 0 0.5px rgba(255,255,255,0.6)",
  };

  return (
    <div style={{
      display:"flex", flexDirection:"column", height:"100vh",
      fontFamily:"'Afacad','Helvetica Neue',sans-serif",
      background:"linear-gradient(135deg,#f0eaff 0%,#e8f4ff 50%,#f0e8ff 100%)",
      overflow:"hidden", position:"relative",
    }}>
      <style dangerouslySetInnerHTML={{ __html: css }} />

      {/* Background orbs */}
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
          boxShadow:"0 2px 20px rgba(120,80,220,0.06)",
          flexShrink:0,
        }}
      >
        {/* Logo + breadcrumb */}
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <span onClick={() => router.push("/dashboard")}
            style={{ fontSize:18, fontWeight:700, color:"#2d1f4e", cursor:"pointer", letterSpacing:"-0.3px" }}>
            Mauve Studio
            <span style={{
              background:"linear-gradient(90deg,#8b5cf6,#60a5fa,#ec4899,#8b5cf6)",
              backgroundSize:"300% auto",
              WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent",
              animation:"shimmer 2.8s linear infinite",
            }}>.</span>
          </span>
          <span style={{ color:"#c4b5fd", fontSize:16 }}>›</span>
          <span style={{ fontSize:14, fontWeight:600, color:"#6b5b95" }}>{roomConfig.name}</span>
        </div>

        {/* 2D / 3D toggle */}
        <div style={{
          display:"flex", gap:4,
          background:"rgba(255,255,255,0.35)", backdropFilter:"blur(20px)",
          border:"1px solid rgba(255,255,255,0.6)", borderRadius:50, padding:"3px",
          boxShadow:"0 4px 16px rgba(120,80,220,0.08), inset 0 1px 0 rgba(255,255,255,0.8)",
        }}>
          <div style={{ padding:"5px 20px", borderRadius:50,
            background:"linear-gradient(135deg,#8b5cf6,#6d28d9)",
            fontSize:13, fontWeight:700, color:"#fff",
            boxShadow:"0 4px 14px rgba(109,40,217,0.35)" }}>
            2D Plan
          </div>
          <motion.div whileHover={{ scale:1.04 }} whileTap={{ scale:0.96 }}
            onClick={() => router.push("/editor/3d")}
            style={{ padding:"5px 20px", borderRadius:50, fontSize:13, fontWeight:600, color:"#6b5b95", cursor:"pointer" }}>
            3D View
          </motion.div>
        </div>

        {/* Save */}
        <motion.button whileHover={{ scale:1.05, y:-1 }} whileTap={{ scale:0.95 }}
          style={{
            padding:"7px 22px", borderRadius:50, border:"none",
            fontFamily:"'Afacad',sans-serif", fontSize:13, fontWeight:700,
            color:"#fff", cursor:"pointer",
            background:"linear-gradient(135deg,#8b5cf6,#6d28d9)",
            boxShadow:"0 6px 20px rgba(109,40,217,0.35)",
            display:"flex", alignItems:"center", gap:6,
          }}>
          <span style={{ fontSize:15 }}>⊡</span> Save
        </motion.button>
      </motion.header>

      <div style={{
  flex:1, display:"flex", gap:12, padding:"12px",
  overflow:"hidden", position:"relative", zIndex:10,
}}>

        {/* ── LEFT PANEL ── */}
        <motion.div
  initial={{ x:-30, opacity:0 }} animate={{ x:0, opacity:1 }}
  transition={{ type:"spring", stiffness:100, damping:18, delay:0.1 }}
  style={{
    width:280, minWidth:280, display:"flex", flexDirection:"column", ...glassPanel,
    overflow: focusMode ? "hidden" : "hidden",
    maxWidth: focusMode ? 0 : 280,
    minWidth: focusMode ? 0 : 280,
    opacity:  focusMode ? 0 : 1,
    padding:  focusMode ? 0 : undefined,
    transition: "all 0.45s cubic-bezier(0.22,1,0.36,1)",
    pointerEvents: focusMode ? "none" : "all",
  }}
>
          {/* Header */}
          <div style={{ padding:"14px 18px 10px", borderBottom:"1px solid rgba(255,255,255,0.5)", flexShrink:0 }}>
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:12 }}>
              <span style={{ fontSize:16 }}>🛒</span>
              <span style={{ fontSize:15, fontWeight:700, color:"#2d1f4e" }}>Furniture</span>
            </div>
            {/* Category tabs */}
            <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:6 }}>
              {CATEGORIES.map(cat => (
                <motion.button key={cat} onClick={() => setActiveCategory(cat)}
                  whileHover={{ scale:1.04 }} whileTap={{ scale:0.95 }}
                  style={{
                    padding:"7px 4px", borderRadius:12, border:"none", cursor:"pointer",
                    fontFamily:"'Afacad',sans-serif", fontSize:12,
                    fontWeight: activeCategory===cat ? 700 : 500,
                    color:      activeCategory===cat ? "#4c1d95" : "#9b93b8",
                    background: activeCategory===cat ? "rgba(255,255,255,0.70)" : "rgba(255,255,255,0.30)",
                    backdropFilter:"blur(12px)",
                    boxShadow: activeCategory===cat
                      ? "0 4px 14px rgba(139,92,246,0.12), 0 0 0 0.5px rgba(255,255,255,0.6), inset 0 1px 0 rgba(255,255,255,0.9)"
                      : "none",
                    transition:"all 0.2s cubic-bezier(0.22,1,0.36,1)",
                  }}
                >{cat}</motion.button>
              ))}
            </div>
          </div>

          {/* Furniture list */}
          <div style={{ flex:1, overflowY:"auto", padding:"10px 12px" }}>
            {[1,2,3,4].map(n => (
              <motion.div key={n}
                whileHover={{ x:3, background:"rgba(255,255,255,0.45)" }}
                style={{
                  display:"flex", alignItems:"center", gap:12,
                  padding:"10px 12px", borderRadius:14, marginBottom:8,
                  background:"rgba(255,255,255,0.28)",
                  border:"1px solid rgba(255,255,255,0.55)",
                  cursor:"pointer", transition:"all 0.2s",
                }}
              >
                <div style={{
                  width:52, height:44, borderRadius:10, flexShrink:0,
                  background:"linear-gradient(135deg,rgba(196,181,253,0.6),rgba(167,139,250,0.4))",
                  border:"1px solid rgba(255,255,255,0.6)",
                }}/>
                <div>
                  <div style={{ fontSize:13, fontWeight:600, color:"#2d1f4e", marginBottom:2 }}>
                    {activeCategory} Item {n}
                  </div>
                  <div style={{ fontSize:11, color:"#9b93b8" }}>120 × 80 cm</div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ── CENTRE: REAL CANVAS ── */}
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
          {/* ── Konva canvas fills this area ── */}
          <RoomCanvas
            roomConfig={roomConfig}
            zoom={zoom}
            onZoomChange={setZoom}
            stageRef={stageRef}
          />

          {/* ── Bottom toolbar ── */}
          <div style={{
            height:52, borderTop:"1px solid rgba(255,255,255,0.5)",
            display:"flex", alignItems:"center", justifyContent:"center",
            gap:8, padding:"0 16px",
            background:"rgba(255,255,255,0.18)", flexShrink:0,
          }}>
            {/* Action buttons */}
            {[
              { icon:"↩", tip:"Undo",    fn: () => {} },
              { icon:"↪", tip:"Redo",    fn: () => {} },
            ].map(btn => (
              <motion.button key={btn.tip} title={btn.tip}
                whileHover={{ scale:1.1 }} whileTap={{ scale:0.9 }}
                onClick={btn.fn} style={toolBtn}>
                {btn.icon}
              </motion.button>
            ))}

            <div style={{ width:1, height:20, background:"rgba(200,190,230,0.4)", margin:"0 4px" }}/>

            {/* Fit + fullscreen */}
            <motion.button title="Fit to screen"
              whileHover={{ scale:1.1 }} whileTap={{ scale:0.9 }}
              onClick={zoomFit} style={toolBtn}>⤢</motion.button>

            <motion.button title={focusMode ? "Exit presentation" : "Presentation view"}
  whileHover={{ scale:1.1 }} whileTap={{ scale:0.9 }}
  onClick={() => setFocusMode(f => !f)} 
  style={{
    ...toolBtn,
    background: focusMode 
      ? "linear-gradient(135deg,#8b5cf6,#6d28d9)" 
      : "rgba(255,255,255,0.45)",
    color: focusMode ? "#fff" : "#6b5b95",
    boxShadow: focusMode
      ? "0 4px 14px rgba(109,40,217,0.35)"
      : toolBtn.boxShadow,
  }}>⛶</motion.button>

            <div style={{ width:1, height:20, background:"rgba(200,190,230,0.4)", margin:"0 4px" }}/>

            {/* Zoom controls — these work now! */}
            <motion.button title="Zoom out"
              whileHover={{ scale:1.1 }} whileTap={{ scale:0.9 }}
              onClick={zoomOut} style={toolBtn}>−</motion.button>

            <div style={{
              padding:"5px 14px", borderRadius:50,
              background:"rgba(255,255,255,0.45)", backdropFilter:"blur(12px)",
              fontSize:12, fontWeight:700, color:"#6b5b95",
              boxShadow:"0 2px 10px rgba(120,80,220,0.06), 0 0 0 0.5px rgba(255,255,255,0.6)",
              minWidth:58, textAlign:"center",
            }}>
              {Math.round(zoom * 100)}%
            </div>

            <motion.button title="Zoom in"
              whileHover={{ scale:1.1 }} whileTap={{ scale:0.9 }}
              onClick={zoomIn} style={toolBtn}>+</motion.button>
          </div>
        </motion.div>

        {/* ── RIGHT PANEL ── */}
        <motion.div
  initial={{ x:30, opacity:0 }} animate={{ x:0, opacity:1 }}
  transition={{ type:"spring", stiffness:100, damping:18, delay:0.2 }}
  style={{
    width:260, minWidth:260, display:"flex", flexDirection:"column", gap:10, overflowY:"auto",
    maxWidth: focusMode ? 0 : 260,
    minWidth: focusMode ? 0 : 260,
    opacity:  focusMode ? 0 : 1,
    transition: "all 0.45s cubic-bezier(0.22,1,0.36,1)",
    pointerEvents: focusMode ? "none" : "all",
    overflow: focusMode ? "hidden" : "auto",
  }}
>
          {/* Properties card */}
          <div style={glassPanel}>
            <div style={{
              display:"flex", alignItems:"center", justifyContent:"space-between",
              padding:"13px 16px 10px", borderBottom:"1px solid rgba(255,255,255,0.5)",
            }}>
              <div style={{ display:"flex", alignItems:"center", gap:7 }}>
                <span style={{ fontSize:15 }}>⚙</span>
                <span style={{ fontSize:14, fontWeight:700, color:"#2d1f4e" }}>Properties</span>
              </div>
            </div>
            <div style={{ padding:"14px 16px" }}>
              <div style={{
                textAlign:"center", padding:"20px 0",
                fontSize:12, color:"#c4b5fd", fontWeight:500, lineHeight:1.6,
              }}>
                <div style={{ fontSize:28, marginBottom:8 }}>◈</div>
                Click a furniture item<br/>to see its properties
              </div>
            </div>
          </div>

          {/* Room Settings card */}
          <div style={glassPanel}>
            <div style={{
              display:"flex", alignItems:"center", justifyContent:"space-between",
              padding:"13px 16px 10px", borderBottom:"1px solid rgba(255,255,255,0.5)",
            }}>
              <div style={{ display:"flex", alignItems:"center", gap:7 }}>
                <span style={{ fontSize:15 }}>◫</span>
                <span style={{ fontSize:14, fontWeight:700, color:"#2d1f4e" }}>Room Settings</span>
              </div>
            </div>
            <div style={{ padding:"14px 16px", display:"flex", flexDirection:"column", gap:14 }}>

              {/* Floor */}
              <div>
                <div style={{ fontSize:11, fontWeight:600, color:"#9b93b8", marginBottom:8, textTransform:"uppercase", letterSpacing:"0.5px" }}>Flooring</div>
                <select
                  value={roomConfig.floorColor}
                  onChange={e => setRoomConfig(r => ({ ...r, floorColor: e.target.value }))}
                  style={{
                    width:"100%", padding:"9px 12px", borderRadius:12,
                    border:"1px solid rgba(255,255,255,0.6)",
                    background:"rgba(255,255,255,0.45)", backdropFilter:"blur(12px)",
                    fontFamily:"'Afacad',sans-serif", fontSize:13, color:"#2d1f4e",
                    outline:"none", cursor:"pointer",
                    boxShadow:"inset 0 1px 0 rgba(255,255,255,0.8)",
                  }}
                >
                  <option value="#f5f0e8">Warm White</option>
                  <option value="#d4a96a">Oak Wood</option>
                  <option value="#c8a96e">Honey Oak</option>
                  <option value="#a0785a">Dark Walnut</option>
                  <option value="#e8e0d8">Light Stone</option>
                  <option value="#d0c8c0">Grey Tile</option>
                </select>
              </div>

              {/* Wall colour */}
              <div>
                <div style={{ fontSize:11, fontWeight:600, color:"#9b93b8", marginBottom:8, textTransform:"uppercase", letterSpacing:"0.5px" }}>Wall Colour</div>
                <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                  {[
                    { color:"#ffffff", label:"White" },
                    { color:"#f5f0e8", label:"Cream" },
                    { color:"#e8e0f0", label:"Lavender" },
                    { color:"#d4e8d4", label:"Sage" },
                    { color:"#e0e8f0", label:"Sky" },
                    { color:"#f0e0e0", label:"Blush" },
                  ].map(w => (
                    <motion.button key={w.color}
                      whileHover={{ scale:1.12 }} whileTap={{ scale:0.95 }}
                      onClick={() => setRoomConfig(r => ({ ...r, wallColor: w.color }))}
                      title={w.label}
                      style={{
                        width:32, height:32, borderRadius:10, border:"none",
                        background:w.color, cursor:"pointer",
                        boxShadow: roomConfig.wallColor === w.color
                          ? "0 0 0 2.5px #8b5cf6, 0 4px 12px rgba(139,92,246,0.25)"
                          : "0 2px 8px rgba(0,0,0,0.08), 0 0 0 1px rgba(255,255,255,0.8)",
                        transition:"box-shadow 0.2s",
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Dimensions */}
              {/* Dimensions */}
<div>
  <div style={{ fontSize:11, fontWeight:600, color:"#9b93b8", marginBottom:8, textTransform:"uppercase", letterSpacing:"0.5px" }}>Dimensions</div>
  <div style={{ display:"flex", gap:8 }}>
    {/* Width input */}
    <div style={{ flex:1 }}>
      <div style={{ fontSize:10, color:"#b0a0cc", marginBottom:4, fontWeight:600 }}>WIDTH</div>
      <div style={{ position:"relative" }}>
        <input
          type="number"
          min="1" max="20" step="0.5"
          value={roomConfig.width}
          onChange={e => setRoomConfig(r => ({ ...r, width: parseFloat(e.target.value) || 1 }))}
          style={{
            width:"100%", padding:"8px 28px 8px 12px",
            borderRadius:12, border:"1px solid rgba(255,255,255,0.6)",
            background:"rgba(255,255,255,0.55)",
            backdropFilter:"blur(12px)",
            fontFamily:"'Afacad',sans-serif",
            fontSize:13, color:"#2d1f4e", fontWeight:700,
            outline:"none",
            boxShadow:"inset 0 1px 0 rgba(255,255,255,0.8)",
          }}
        />
        <span style={{
          position:"absolute", right:10, top:"50%",
          transform:"translateY(-50%)",
          fontSize:11, color:"#9b93b8", fontWeight:600,
          pointerEvents:"none",
        }}>m</span>
      </div>
    </div>

    {/* Height input */}
    <div style={{ flex:1 }}>
      <div style={{ fontSize:10, color:"#b0a0cc", marginBottom:4, fontWeight:600 }}>HEIGHT</div>
      <div style={{ position:"relative" }}>
        <input
          type="number"
          min="1" max="20" step="0.5"
          value={roomConfig.height}
          onChange={e => setRoomConfig(r => ({ ...r, height: parseFloat(e.target.value) || 1 }))}
          style={{
            width:"100%", padding:"8px 28px 8px 12px",
            borderRadius:12, border:"1px solid rgba(255,255,255,0.6)",
            background:"rgba(255,255,255,0.55)",
            backdropFilter:"blur(12px)",
            fontFamily:"'Afacad',sans-serif",
            fontSize:13, color:"#2d1f4e", fontWeight:700,
            outline:"none",
            boxShadow:"inset 0 1px 0 rgba(255,255,255,0.8)",
          }}
        />
        <span style={{
          position:"absolute", right:10, top:"50%",
          transform:"translateY(-50%)",
          fontSize:11, color:"#9b93b8", fontWeight:600,
          pointerEvents:"none",
        }}>m</span>
      </div>
    </div>
  </div>
</div>

            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}