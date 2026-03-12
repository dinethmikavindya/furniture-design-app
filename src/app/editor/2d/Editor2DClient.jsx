"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";

const TEMP_ROOM = {
  name: "My Space",
  width: 5,
  height: 4,
  wallColor: "#e8e0f0",
  floorColor: "#f5f0e8",
};

const FURNITURE_CATALOG = {
  Sofas: [
    { type: "sofa-2", label: "2-Seat Sofa", w: 160, h: 80,  color: "#c4b5fd" },
    { type: "sofa-3", label: "3-Seat Sofa", w: 220, h: 85,  color: "#a78bfa" },
    { type: "sofa-l", label: "L-Shape Sofa",w: 200, h: 160, color: "#8b5cf6" },
    { type: "sofa-1", label: "Armchair",    w: 90,  h: 85,  color: "#ddd6fe" },
  ],
  Beds: [
    { type: "bed-s", label: "Single Bed", w: 100, h: 200, color: "#bfdbfe" },
    { type: "bed-d", label: "Double Bed", w: 140, h: 200, color: "#93c5fd" },
    { type: "bed-k", label: "King Bed",   w: 180, h: 210, color: "#60a5fa" },
  ],
  Chairs: [
    { type: "chair-a", label: "Armchair",     w: 80, h: 80, color: "#d8b4fe" },
    { type: "chair-d", label: "Dining Chair", w: 50, h: 50, color: "#e9d5ff" },
    { type: "chair-o", label: "Office Chair", w: 60, h: 60, color: "#c4b5fd" },
  ],
  Tables: [
    { type: "table-c", label: "Coffee Table", w: 120, h: 60, color: "#fde68a" },
    { type: "table-d", label: "Dining Table", w: 160, h: 90, color: "#fcd34d" },
    { type: "table-s", label: "Side Table",   w: 50,  h: 50, color: "#fef3c7" },
  ],
};

const CATEGORIES  = Object.keys(FURNITURE_CATALOG);
const SCALE       = 80;
const ITEM_COLORS = ["#c4b5fd","#a78bfa","#93c5fd","#6ee7b7","#fde68a","#fbcfe8","#fca5a5","#d1fae5"];

// Preset swatches for wall & floor
const WALL_COLORS  = ["#e8e0f0","#fef9f0","#e0f0f0","#f0e8e0","#e0e8f0","#f5f5f5","#2d2d3a","#4a3728"];
const FLOOR_COLORS = ["#f5f0e8","#e8d5b0","#c8b89a","#d4c4b0","#f0ebe0","#e8e0d8","#5c4a32","#3a3028"];

let _uid = 1;
function uid()    { return `f_${_uid++}`; }
function mToPx(m) { return parseFloat(m) * SCALE; }

/* ── tiny colour swatch picker ── */
function ColorRow({ colors, value, onChange }) {
  return (
    <div style={{ display:"flex", gap:6, flexWrap:"wrap", alignItems:"center" }}>
      {colors.map(c => (
        <button key={c} onClick={() => onChange(c)} style={{
          width:24, height:24, borderRadius:6, border:"none",
          background: c, cursor:"pointer",
          boxShadow: value === c ? "0 0 0 2.5px #8b5cf6" : "0 1px 4px rgba(0,0,0,0.15)",
          flexShrink: 0,
        }} />
      ))}
      {/* native colour picker as a last option */}
      <label style={{ cursor:"pointer", fontSize:11, color:"#9b93b8", userSelect:"none" }}
        title="Pick custom colour">
        ✎
        <input type="color" value={value} onChange={e => onChange(e.target.value)}
          style={{ opacity:0, width:0, height:0, position:"absolute" }} />
      </label>
    </div>
  );
}

function FurniturePreview({ item }) {
  return (
    <svg width={52} height={44} viewBox="0 0 52 44" fill="none">
      <rect x="3" y="5" width="46" height="34" rx="5" fill={item.color} opacity="0.85"/>
      <rect x="3" y="5" width="46" height="34" rx="5" fill="none"
        stroke="rgba(255,255,255,0.7)" strokeWidth="1.2"/>
      <rect x="7" y="9" width="16" height="10" rx="3" fill="rgba(255,255,255,0.30)"/>
    </svg>
  );
}

/* ══════════════════════════════════════════
   CANVAS EDITOR
══════════════════════════════════════════ */
function CanvasEditor({ roomConfig, furniture, selectedId, onSelect, onDragEnd, onResize, zoom }) {
  const canvasRef    = useRef(null);
  const containerRef = useRef(null);
  const [dragging,   setDragging]   = useState(null);
  const [resizing,   setResizing]   = useState(null);
  const [canvasSize, setCanvasSize] = useState({ w:800, h:600 });

  const roomW   = mToPx(roomConfig.width);
  const roomH   = mToPx(roomConfig.height);
  const offsetX = Math.max(60, (canvasSize.w / zoom - roomW) / 2);
  const offsetY = Math.max(60, (canvasSize.h / zoom - roomH) / 2);

  /* watch container size */
  useEffect(() => {
    if (!containerRef.current) return;
    const obs = new ResizeObserver(([entry]) => {
      setCanvasSize({ w: entry.contentRect.width, h: entry.contentRect.height });
    });
    obs.observe(containerRef.current);
    return () => obs.disconnect();
  }, []);

  /* draw everything */
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.scale(zoom, zoom);

    // Floor
    ctx.fillStyle = roomConfig.floorColor;
    ctx.fillRect(offsetX, offsetY, roomW, roomH);

    // Grid lines (1 m = SCALE px)
    ctx.strokeStyle = "rgba(139,92,246,0.1)";
    ctx.lineWidth   = 1;
    for (let x = SCALE; x < roomW; x += SCALE) {
      ctx.beginPath();
      ctx.moveTo(offsetX + x, offsetY);
      ctx.lineTo(offsetX + x, offsetY + roomH);
      ctx.stroke();
    }
    for (let y = SCALE; y < roomH; y += SCALE) {
      ctx.beginPath();
      ctx.moveTo(offsetX,       offsetY + y);
      ctx.lineTo(offsetX + roomW, offsetY + y);
      ctx.stroke();
    }

    // Walls
    ctx.strokeStyle = roomConfig.wallColor;
    ctx.lineWidth   = 8;
    ctx.strokeRect(offsetX, offsetY, roomW, roomH);

    // Furniture
    furniture.forEach(item => {
      const isSelected = item.id === selectedId;
      const x = offsetX + item.x;
      const y = offsetY + item.y;

      ctx.save();
      ctx.translate(x + item.w / 2, y + item.h / 2);
      ctx.rotate((item.rotation || 0) * Math.PI / 180);
      ctx.translate(-item.w / 2, -item.h / 2);

      // shadow
      ctx.fillStyle = "rgba(0,0,0,0.10)";
      ctx.fillRect(3, 4, item.w, item.h);

      // body
      ctx.fillStyle = item.color;
      ctx.fillRect(0, 0, item.w, item.h);

      // border
      ctx.strokeStyle = isSelected ? "#8b5cf6" : "rgba(255,255,255,0.7)";
      ctx.lineWidth   = isSelected ? 3 : 1.5;
      ctx.strokeRect(0, 0, item.w, item.h);

      // inner gloss
      ctx.fillStyle = "rgba(255,255,255,0.18)";
      ctx.fillRect(5, 5, item.w - 10, item.h - 10);

      // label
      ctx.fillStyle = "#2d1f4e";
      ctx.font      = "600 11px Afacad, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(item.label, item.w / 2, item.h / 2 + 4);

      // resize handles
      if (isSelected) {
        ctx.fillStyle = "#8b5cf6";
        const hs = 8;
        [-1,1].forEach(dx => [-1,1].forEach(dy => {
          ctx.fillRect(
            dx > 0 ? item.w - hs/2 : -hs/2,
            dy > 0 ? item.h - hs/2 : -hs/2,
            hs, hs
          );
        }));
      }
      ctx.restore();
    });

    ctx.restore();
  }, [furniture, selectedId, roomConfig, roomW, roomH, zoom, offsetX, offsetY]);

  useEffect(() => { draw(); }, [draw, canvasSize]);

  /* mouse helpers */
  const getMousePos = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left) / zoom - offsetX,
      y: (e.clientY - rect.top)  / zoom - offsetY,
    };
  };

  const handleMouseDown = (e) => {
    const pos = getMousePos(e);
    for (let i = furniture.length - 1; i >= 0; i--) {
      const item = furniture[i];
      if (pos.x >= item.x && pos.x <= item.x + item.w &&
          pos.y >= item.y && pos.y <= item.y + item.h) {
        onSelect(item.id);
        const hs = 8 / zoom;
        const corners = [
          { x: item.x,        y: item.y,        cursor:"nw" },
          { x: item.x+item.w, y: item.y,        cursor:"ne" },
          { x: item.x,        y: item.y+item.h, cursor:"sw" },
          { x: item.x+item.w, y: item.y+item.h, cursor:"se" },
        ];
        for (const c of corners) {
          if (Math.abs(pos.x - c.x) < hs && Math.abs(pos.y - c.y) < hs) {
            setResizing({ id:item.id, corner:c.cursor, startX:pos.x, startY:pos.y,
              startW:item.w, startH:item.h, startItemX:item.x, startItemY:item.y });
            return;
          }
        }
        setDragging({ id:item.id, offsetX:pos.x-item.x, offsetY:pos.y-item.y });
        return;
      }
    }
    onSelect(null);
  };

  const handleMouseMove = (e) => {
    const pos = getMousePos(e);
    if (dragging) {
      onDragEnd(dragging.id, pos.x - dragging.offsetX, pos.y - dragging.offsetY);
    } else if (resizing) {
      const dx = pos.x - resizing.startX;
      const dy = pos.y - resizing.startY;
      let nW = resizing.startW, nH = resizing.startH;
      let nX = resizing.startItemX, nY = resizing.startItemY;
      if (resizing.corner.includes("e")) nW += dx;
      if (resizing.corner.includes("w")) { nW -= dx; nX += dx; }
      if (resizing.corner.includes("s")) nH += dy;
      if (resizing.corner.includes("n")) { nH -= dy; nY += dy; }
      onResize(resizing.id, Math.max(30, nW), Math.max(30, nH), nX, nY);
    }
  };

  const handleMouseUp = () => { setDragging(null); setResizing(null); };

  return (
    <div ref={containerRef} style={{ flex:1, overflow:"hidden" }}>
      <canvas
        ref={canvasRef}
        width={canvasSize.w}
        height={canvasSize.h}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{ display:"block", cursor: dragging ? "grabbing" : "default" }}
      />
    </div>
  );
}

/* ══════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════ */
export default function Editor2DClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const projectId = searchParams.get("projectId");
  const [activeCategory, setActiveCategory] = useState("Sofas");
  const [roomConfig, setRoomConfig] = useState(TEMP_ROOM);
  const [zoom, setZoom] = useState(1);
  const [furniture, setFurniture] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [saved, setSaved] = useState(false);
  const [dbLoaded, setDbLoaded] = useState(false);
  const saveTimerRef = useRef(null);

  // Load from DB if projectId, else localStorage
  useEffect(() => {
    if (projectId) {
      fetch(`/api/projects/${projectId}`, { credentials: 'include' })
        .then(r => r.json())
        .then(data => {
          if (data.project) {
            const rc = data.project.room_config;
            const fi = data.project.furniture_items;
            if (rc && typeof rc === 'object') {
              const width  = rc.width  > 50 ? rc.width  / SCALE : rc.width;
              const height = rc.height > 50 ? rc.height / SCALE : rc.height;
              setRoomConfig({ ...TEMP_ROOM, ...rc, width, height });
            }
            if (Array.isArray(fi)) {
              // Normalize: other team members use width/depth, we use w/h
              const normalized = fi.map((item, i) => ({
                id: item.id || `f_${i}`,
                type: item.type || item.furniture_type || 'chair-d',
                label: item.label || item.name || 'Furniture',
                x: item.x ?? item.position_x ?? 50 + i * 20,
                y: item.y ?? item.position_y ?? 50 + i * 20,
                w: item.w ?? item.width ?? 80,
                h: item.h ?? item.depth ?? item.height ?? 80,
                color: item.color || '#c4b5fd',
                rotation: item.rotation ?? 0,
              }));
              setFurniture(normalized);
            }
          }
          setDbLoaded(true);
        })
        .catch(() => setDbLoaded(true));
    } else {
      try {
        const savedRoom = localStorage.getItem("mauve_room");
        const savedFurniture = localStorage.getItem("mauve_furniture");
        if (savedRoom) setRoomConfig(JSON.parse(savedRoom));
        if (savedFurniture) setFurniture(JSON.parse(savedFurniture));
      } catch {}
      setDbLoaded(true);
    }
  }, [projectId]);
  const canvasContainerRef = useRef(null);

  /* ── Auto-fit zoom so room fills the canvas nicely on load ── */
  useEffect(() => {
    const fit = () => {
      if (!canvasContainerRef.current) return;
      const { width: cw, height: ch } = canvasContainerRef.current.getBoundingClientRect();
      const roomW = mToPx(roomConfig.width);
      const roomH = mToPx(roomConfig.height);
      const padding = 120; // breathing room around the room
      const zoomX = (cw - padding) / roomW;
      const zoomY = (ch - padding) / roomH;
      const fitted = Math.min(zoomX, zoomY, 2); // cap at 200%
      setZoom(parseFloat(fitted.toFixed(2)));
    };
    // slight delay so the container has rendered
    const t = setTimeout(fit, 100);
    return () => clearTimeout(t);
  // only recalculate when room dimensions change
  }, [roomConfig.width, roomConfig.height]);

  const zoomIn  = () => setZoom(z => Math.min(+(z + 0.1).toFixed(1), 3));
  const zoomOut = () => setZoom(z => Math.max(+(z - 0.1).toFixed(1), 0.3));
  const zoomFit = () => {
    if (!canvasContainerRef.current) return;
    const { width: cw, height: ch } = canvasContainerRef.current.getBoundingClientRect();
    const roomW = mToPx(roomConfig.width);
    const roomH = mToPx(roomConfig.height);
    const fitted = Math.min((cw - 120) / roomW, (ch - 120) / roomH, 2);
    setZoom(parseFloat(fitted.toFixed(2)));
  };

  /* ── Auto-save to localStorage ── */
  useEffect(() => {
    localStorage.setItem("mauve_furniture", JSON.stringify(furniture));
    localStorage.setItem("mauve_room",      JSON.stringify(roomConfig));
  }, [furniture, roomConfig]);

  const handleSave = () => {
    if (projectId) {
      fetch(`/api/projects/${projectId}`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roomConfig, furnitureItems: furniture }),
      }).then(r => r.json()).then(d => console.log("Manual save:", d)).catch(console.error);
    } else {
      localStorage.setItem("mauve_furniture", JSON.stringify(furniture));
      localStorage.setItem("mauve_room", JSON.stringify(roomConfig));
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const placeFurniture = (item) => {
    const newItem = {
      id: uid(), type: item.type, label: item.label,
      x: mToPx(roomConfig.width)  / 2 - item.w / 2,
      y: mToPx(roomConfig.height) / 2 - item.h / 2,
      w: item.w, h: item.h, color: item.color, rotation: 0,
    };
    setFurniture(prev => [...prev, newItem]);
    setSelectedId(newItem.id);
  };

  const handleDragEnd = (id, x, y) =>
    setFurniture(prev => prev.map(f => f.id === id ? { ...f, x, y } : f));

  const handleResize = (id, w, h, x, y) =>
    setFurniture(prev => prev.map(f => f.id === id ? { ...f, w, h, x, y } : f));

  const deleteSelected = () => {
    setFurniture(prev => prev.filter(f => f.id !== selectedId));
    setSelectedId(null);
  };

  const selectedItem  = furniture.find(f => f.id === selectedId);
  const updateSelected = (key, val) =>
    setFurniture(prev => prev.map(f => f.id === selectedId ? { ...f, [key]: val } : f));

  /* ── shared glass style ── */
  const glass = {
    borderRadius: 20,
    background: "rgba(255,255,255,0.22)",
    backdropFilter: "blur(32px)",
    border: "1.5px solid rgba(255,255,255,0.65)",
    boxShadow: "0 8px 32px rgba(120,80,220,0.08)",
    overflow: "hidden",
  };

  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Afacad:wght@400;500;600;700&display=swap');
    *,*::before,*::after { box-sizing:border-box; margin:0; padding:0; }
    @keyframes shimmer { 0%{background-position:-300% center} 100%{background-position:300% center} }
    input[type=number]::-webkit-inner-spin-button { opacity:0.5; }
    ::-webkit-scrollbar { width:4px; }
    ::-webkit-scrollbar-thumb { background:rgba(139,92,246,0.25); border-radius:4px; }
  `;

  const labelSt = { fontSize:11, color:"#9b93b8", marginBottom:5, fontWeight:600,
    letterSpacing:"0.4px", textTransform:"uppercase" };
  const inputSt = {
    width:"100%", padding:"8px 10px", borderRadius:12,
    border:"1px solid rgba(255,255,255,0.6)",
    background:"rgba(255,255,255,0.55)", fontSize:13, fontFamily:"'Afacad',sans-serif",
  };

  return (
    <div style={{ display:"flex", flexDirection:"column", height:"100vh",
      fontFamily:"'Afacad',sans-serif",
      background:"linear-gradient(135deg,#f0eaff 0%,#e8f4ff 50%,#f0e8ff 100%)" }}>
      <style dangerouslySetInnerHTML={{ __html: css }} />

      {/* ── TOP BAR ── */}
      <header style={{
        height:52, display:"flex", alignItems:"center", justifyContent:"space-between",
        padding:"0 20px", background:"rgba(255,255,255,0.18)", backdropFilter:"blur(24px)",
        borderBottom:"1px solid rgba(255,255,255,0.45)", flexShrink:0,
      }}>
        <span style={{ fontSize:18, fontWeight:700, color:"#2d1f4e", cursor:"pointer" }}
          onClick={() => router.push("/dashboard")}>
          Mauve Studio<span style={{ color:"#8b5cf6" }}>.</span>
        </span>

        <div style={{ display:"flex", gap:4, background:"rgba(255,255,255,0.35)",
          border:"1px solid rgba(255,255,255,0.6)", borderRadius:50, padding:"3px" }}>
          <div style={{ padding:"5px 20px", borderRadius:50,
            background:"linear-gradient(135deg,#8b5cf6,#6d28d9)",
            fontSize:13, fontWeight:700, color:"#fff" }}>2D Plan</div>
          <button onClick={() => { handleSave(); router.push("/editor/3d"); }}
            style={{ padding:"5px 20px", borderRadius:50, border:"none",
              background:"transparent", cursor:"pointer", fontSize:13, fontWeight:600, color:"#6b5b95" }}>
            3D View
          </button>
        </div>

        <motion.button whileHover={{ scale:1.05 }} whileTap={{ scale:0.95 }} onClick={handleSave}
          style={{
            padding:"7px 22px", borderRadius:50, border:"none",
            fontFamily:"'Afacad',sans-serif", fontSize:13, fontWeight:700,
            color:"#fff", cursor:"pointer",
            background: saved ? "linear-gradient(135deg,#10b981,#059669)"
                               : "linear-gradient(135deg,#8b5cf6,#6d28d9)",
            boxShadow:"0 6px 20px rgba(109,40,217,0.35)", transition:"background 0.3s",
          }}>
          {saved ? "✓ Saved!" : "⊡ Save"}
        </motion.button>
      </header>

      {/* ── BODY ── */}
      <div style={{ flex:1, display:"flex", gap:12, padding:12, overflow:"hidden" }}>

        {/* ── LEFT: Furniture panel ── */}
        <div style={{ ...glass, width:260, display:"flex", flexDirection:"column" }}>
          <div style={{ padding:14, borderBottom:"1px solid rgba(255,255,255,0.5)", flexShrink:0 }}>
            <div style={{ fontSize:15, fontWeight:700, color:"#2d1f4e", marginBottom:10 }}>🛋️ Furniture</div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:5 }}>
              {CATEGORIES.map(cat => (
                <button key={cat} onClick={() => setActiveCategory(cat)} style={{
                  padding:"6px", borderRadius:10, border:"none", cursor:"pointer",
                  fontFamily:"'Afacad',sans-serif", fontSize:11,
                  background: activeCategory===cat ? "rgba(255,255,255,0.70)" : "rgba(255,255,255,0.28)",
                  fontWeight: activeCategory===cat ? 700 : 500,
                  color:      activeCategory===cat ? "#4c1d95" : "#9b93b8",
                }}>{cat}</button>
              ))}
            </div>
          </div>
          <div style={{ flex:1, overflowY:"auto", padding:10 }}>
            {FURNITURE_CATALOG[activeCategory].map(item => (
              <div key={item.type} onClick={() => placeFurniture(item)} style={{
                display:"flex", alignItems:"center", gap:10, padding:"8px 10px",
                borderRadius:14, marginBottom:6, background:"rgba(255,255,255,0.28)",
                border:"1px solid rgba(255,255,255,0.55)", cursor:"pointer",
              }}>
                <div style={{ width:52, height:44, borderRadius:10, overflow:"hidden", flexShrink:0 }}>
                  <FurniturePreview item={item} />
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:13, fontWeight:600, color:"#2d1f4e" }}>{item.label}</div>
                  <div style={{ fontSize:11, color:"#9b93b8" }}>{item.w} × {item.h} cm</div>
                </div>
                <span style={{ fontSize:16, color:"#c4b5fd" }}>+</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── CENTRE: Canvas ── */}
        <div style={{ ...glass, flex:1, display:"flex", flexDirection:"column" }}>
          {/* attach ref here so auto-fit can measure it */}
          <div ref={canvasContainerRef} style={{ flex:1, overflow:"hidden", display:"flex" }}>
            <CanvasEditor
              roomConfig={roomConfig} furniture={furniture}
              selectedId={selectedId} onSelect={setSelectedId}
              onDragEnd={handleDragEnd} onResize={handleResize}
              zoom={zoom}
            />
          </div>

          {/* Bottom toolbar */}
          <div style={{
            height:52, borderTop:"1px solid rgba(255,255,255,0.5)",
            display:"flex", alignItems:"center", justifyContent:"center",
            gap:8, background:"rgba(255,255,255,0.18)", flexShrink:0,
          }}>
            <button onClick={zoomOut} style={{ width:34, height:34, borderRadius:50, border:"none",
              background:"rgba(255,255,255,0.45)", cursor:"pointer", fontSize:15 }}>−</button>

            <div style={{ padding:"5px 14px", borderRadius:50, background:"rgba(255,255,255,0.45)",
              fontSize:12, fontWeight:700, color:"#6b5b95", minWidth:58, textAlign:"center" }}>
              {Math.round(zoom * 100)}%
            </div>

            <button onClick={zoomIn} style={{ width:34, height:34, borderRadius:50, border:"none",
              background:"rgba(255,255,255,0.45)", cursor:"pointer", fontSize:15 }}>+</button>

            {/* Fit button */}
            <button onClick={zoomFit} title="Fit to screen"
              style={{ height:34, padding:"0 14px", borderRadius:50, border:"none",
                background:"rgba(139,92,246,0.12)", cursor:"pointer",
                fontSize:11, fontWeight:700, color:"#8b5cf6" }}>⊞ Fit</button>

            {selectedId && (
              <button onClick={deleteSelected} style={{ width:34, height:34, borderRadius:50, border:"none",
                background:"rgba(254,226,226,0.70)", color:"#dc2626", cursor:"pointer", fontSize:15 }}>🗑</button>
            )}

            {furniture.length > 0 && (
              <div style={{ fontSize:11, fontWeight:700, padding:"4px 12px", borderRadius:50,
                background:"rgba(139,92,246,0.12)", color:"#8b5cf6" }}>
                {furniture.length} item{furniture.length!==1?"s":""}
              </div>
            )}
          </div>
        </div>

        {/* ── RIGHT: Properties + Room ── */}
        <div style={{ ...glass, width:260, padding:16, overflowY:"auto", display:"flex", flexDirection:"column", gap:0 }}>

          {/* Item properties */}
          <div style={{ fontSize:14, fontWeight:700, color:"#2d1f4e", marginBottom:12 }}>⚙ Properties</div>
          {selectedItem ? (
            <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
              <div>
                <div style={labelSt}>SELECTED</div>
                <div style={{ padding:"8px 12px", borderRadius:12,
                  background:"rgba(139,92,246,0.08)", fontSize:13, fontWeight:700, color:"#4c1d95" }}>
                  {selectedItem.label}
                </div>
              </div>
              <div style={{ display:"flex", gap:8 }}>
                {[{k:"w",l:"WIDTH"},{k:"h",l:"DEPTH"}].map(d => (
                  <div key={d.k} style={{ flex:1 }}>
                    <div style={labelSt}>{d.l}</div>
                    <input type="number" min="30" value={Math.round(selectedItem[d.k])}
                      onChange={e => updateSelected(d.k, +e.target.value)} style={inputSt} />
                  </div>
                ))}
              </div>
              <div>
                <div style={labelSt}>COLOUR</div>
                <ColorRow colors={ITEM_COLORS} value={selectedItem.color}
                  onChange={c => updateSelected("color", c)} />
              </div>
              <div>
                <div style={labelSt}>ROTATION</div>
                <div style={{ display:"flex", gap:6 }}>
                  {[0,90,180,270].map(deg => (
                    <button key={deg} onClick={() => updateSelected("rotation", deg)} style={{
                      flex:1, padding:"6px 0", borderRadius:10, border:"none", cursor:"pointer",
                      fontFamily:"'Afacad',sans-serif", fontSize:11, fontWeight:700,
                      background: selectedItem.rotation===deg ? "rgba(139,92,246,0.18)" : "rgba(255,255,255,0.40)",
                      color: selectedItem.rotation===deg ? "#6d28d9" : "#9b93b8",
                    }}>{deg}°</button>
                  ))}
                </div>
              </div>
              <button onClick={deleteSelected} style={{
                padding:"8px", borderRadius:12, border:"none",
                background:"rgba(254,226,226,0.70)", color:"#dc2626",
                cursor:"pointer", fontFamily:"'Afacad',sans-serif", fontSize:13, fontWeight:700,
              }}>🗑 Delete</button>
            </div>
          ) : (
            <div style={{ textAlign:"center", padding:"20px 10px", fontSize:12, color:"#c4b5fd", lineHeight:1.6 }}>
              <div style={{ fontSize:28, marginBottom:8 }}>◈</div>
              Click furniture on the canvas to see its properties
            </div>
          )}

          {/* ── Room settings ── */}
          <div style={{ marginTop:20, paddingTop:16, borderTop:"1px solid rgba(255,255,255,0.4)",
            display:"flex", flexDirection:"column", gap:14 }}>
            <div style={{ fontSize:14, fontWeight:700, color:"#2d1f4e" }}>◫ Room</div>

            {/* Width + Depth */}
            <div style={{ display:"flex", gap:8 }}>
              {[{key:"width",label:"W (m)"},{key:"height",label:"D (m)"}].map(d => (
                <div key={d.key} style={{ flex:1 }}>
                  <div style={labelSt}>{d.label}</div>
                  <input type="number" min="1" max="20" step="0.5"
                    value={roomConfig[d.key]}
                    onChange={e => setRoomConfig(r => ({ ...r, [d.key]: parseFloat(e.target.value)||1 }))}
                    style={inputSt} />
                </div>
              ))}
            </div>

            {/* Wall colour */}
            <div>
              <div style={labelSt}>WALL COLOUR</div>
              {/* preview swatch */}
              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6 }}>
                <div style={{ width:32, height:22, borderRadius:6, background:roomConfig.wallColor,
                  border:"1px solid rgba(0,0,0,0.08)", flexShrink:0 }}/>
                <span style={{ fontSize:11, color:"#9b93b8" }}>{roomConfig.wallColor}</span>
              </div>
              <ColorRow colors={WALL_COLORS} value={roomConfig.wallColor}
                onChange={c => setRoomConfig(r => ({ ...r, wallColor:c }))} />
            </div>

            {/* Floor colour */}
            <div>
              <div style={labelSt}>FLOOR COLOUR</div>
              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6 }}>
                <div style={{ width:32, height:22, borderRadius:6, background:roomConfig.floorColor,
                  border:"1px solid rgba(0,0,0,0.08)", flexShrink:0 }}/>
                <span style={{ fontSize:11, color:"#9b93b8" }}>{roomConfig.floorColor}</span>
              </div>
              <ColorRow colors={FLOOR_COLORS} value={roomConfig.floorColor}
                onChange={c => setRoomConfig(r => ({ ...r, floorColor:c }))} />
            </div>
          </div>

        </div>{/* end right panel */}
      </div>
    </div>
  );
}