"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";

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
const WALL_COLORS  = ["#e8e0f0","#fef9f0","#e0f0f0","#f0e8e0","#e0e8f0","#f5f5f5","#2d2d3a","#4a3728"];
const FLOOR_COLORS = ["#f5f0e8","#e8d5b0","#c8b89a","#d4c4b0","#f0ebe0","#e8e0d8","#5c4a32","#3a3028"];

let _uid = 1;
function uid()    { return `f_${_uid++}`; }
function mToPx(m) { return parseFloat(m) * SCALE; }

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
      <label style={{ cursor:"pointer", fontSize:11, color:"#9b93b8", userSelect:"none" }} title="Pick custom colour">
        ✎
        <input type="color" value={value} onChange={e => onChange(e.target.value)}
          style={{ opacity:0, width:0, height:0, position:"absolute" }} />
      </label>
    </div>
  );
}

function FurniturePreview({ item }) {
  const c = item.color;
  const dark = c + "cc";
  const light = "rgba(255,255,255,0.45)";
  const type = item.type;

  if (type.startsWith("sofa-1") || type === "chair-a") {
    return (
      <svg width={52} height={44} viewBox="0 0 52 44" fill="none">
        <rect x="8" y="10" width="36" height="24" rx="5" fill={c} opacity="0.9"/>
        <rect x="8" y="7" width="36" height="9" rx="4" fill={dark}/>
        <rect x="5" y="10" width="7" height="18" rx="3" fill={dark}/>
        <rect x="40" y="10" width="7" height="18" rx="3" fill={dark}/>
        <rect x="12" y="14" width="28" height="8" rx="3" fill={light}/>
      </svg>
    );
  }
  if (type.startsWith("sofa-")) {
    return (
      <svg width={52} height={44} viewBox="0 0 52 44" fill="none">
        <rect x="5" y="12" width="42" height="20" rx="5" fill={c} opacity="0.9"/>
        <rect x="5" y="8" width="42" height="9" rx="4" fill={dark}/>
        <rect x="3" y="12" width="6" height="15" rx="3" fill={dark}/>
        <rect x="43" y="12" width="6" height="15" rx="3" fill={dark}/>
        <line x1="26" y1="13" x2="26" y2="31" stroke={light} strokeWidth="1.5"/>
        <rect x="9" y="13" width="34" height="6" rx="2" fill={light}/>
      </svg>
    );
  }
  if (type.startsWith("bed-")) {
    return (
      <svg width={52} height={44} viewBox="0 0 52 44" fill="none">
        <rect x="5" y="10" width="42" height="28" rx="4" fill={c} opacity="0.9"/>
        <rect x="5" y="7" width="42" height="8" rx="4" fill={dark}/>
        {type === "bed-k" ? (
          <>
            <rect x="9"  y="16" width="14" height="9" rx="3" fill={light}/>
            <rect x="29" y="16" width="14" height="9" rx="3" fill={light}/>
          </>
        ) : (
          <rect x="13" y="16" width="26" height="9" rx="3" fill={light}/>
        )}
        <rect x="5" y="30" width="42" height="5" rx="2" fill={dark} opacity="0.5"/>
      </svg>
    );
  }
  if (type === "chair-d") {
    return (
      <svg width={52} height={44} viewBox="0 0 52 44" fill="none">
        <rect x="14" y="10" width="24" height="22" rx="4" fill={c} opacity="0.9"/>
        <rect x="14" y="8" width="24" height="6" rx="3" fill={dark}/>
        <rect x="18" y="14" width="16" height="8" rx="2" fill={light}/>
      </svg>
    );
  }
  if (type === "chair-o") {
    return (
      <svg width={52} height={44} viewBox="0 0 52 44" fill="none">
        {[0,72,144,216,288].map((angle, i) => {
          const rad = (angle - 90) * Math.PI / 180;
          return <line key={i} x1="26" y1="22" x2={26 + Math.cos(rad)*14} y2={22 + Math.sin(rad)*14} stroke={dark} strokeWidth="2.5" strokeLinecap="round"/>;
        })}
        <circle cx="26" cy="22" r="12" fill={c} opacity="0.9"/>
        <circle cx="26" cy="22" r="7" fill={light}/>
      </svg>
    );
  }
  if (type === "table-c") {
    return (
      <svg width={52} height={44} viewBox="0 0 52 44" fill="none">
        <rect x="6" y="12" width="40" height="20" rx="10" fill={c} opacity="0.9"/>
        <rect x="6" y="12" width="40" height="20" rx="10" fill="none" stroke={dark} strokeWidth="1.5"/>
        <rect x="12" y="16" width="28" height="12" rx="6" fill={light}/>
      </svg>
    );
  }
  if (type === "table-d") {
    return (
      <svg width={52} height={44} viewBox="0 0 52 44" fill="none">
        <rect x="5" y="10" width="42" height="24" rx="3" fill={c} opacity="0.9"/>
        <rect x="5" y="10" width="42" height="24" rx="3" fill="none" stroke={dark} strokeWidth="1.5"/>
        <rect x="7"  y="12" width="5" height="5" rx="1.5" fill={dark}/>
        <rect x="40" y="12" width="5" height="5" rx="1.5" fill={dark}/>
        <rect x="7"  y="27" width="5" height="5" rx="1.5" fill={dark}/>
        <rect x="40" y="27" width="5" height="5" rx="1.5" fill={dark}/>
        <rect x="12" y="14" width="28" height="16" rx="2" fill={light}/>
      </svg>
    );
  }
  if (type === "table-s") {
    return (
      <svg width={52} height={44} viewBox="0 0 52 44" fill="none">
        <rect x="13" y="10" width="26" height="24" rx="4" fill={c} opacity="0.9"/>
        <rect x="13" y="10" width="26" height="24" rx="4" fill="none" stroke={dark} strokeWidth="1.5"/>
        <circle cx="26" cy="22" r="8" fill={light}/>
      </svg>
    );
  }
  return (
    <svg width={52} height={44} viewBox="0 0 52 44" fill="none">
      <rect x="6" y="7" width="40" height="30" rx="6" fill={c} opacity="0.85"/>
      <rect x="6" y="7" width="40" height="30" rx="6" fill="none" stroke={dark} strokeWidth="1.2"/>
      <rect x="10" y="11" width="18" height="10" rx="3" fill={light}/>
    </svg>
  );
}

function drawFurnitureShape(ctx, item, isSelected, isDark) {
  const { w, h, color, type } = item;
  const dark = color + "cc";
  const light = "rgba(255,255,255,0.40)";

  ctx.fillStyle = color;

  if (type?.startsWith("sofa-") || type === "chair-a") {
    roundRect(ctx, 0, h * 0.2, w, h * 0.8, 6);
    ctx.fillStyle = color; ctx.fill();
    ctx.fillStyle = dark;
    roundRect(ctx, 0, 0, w, h * 0.28, 5); ctx.fill();
    roundRect(ctx, 0, h * 0.2, w * 0.1, h * 0.6, 4); ctx.fill();
    roundRect(ctx, w * 0.9, h * 0.2, w * 0.1, h * 0.6, 4); ctx.fill();
    ctx.fillStyle = light;
    roundRect(ctx, w * 0.12, h * 0.32, w * 0.76, h * 0.22, 3); ctx.fill();
    if (w > 150) {
      ctx.strokeStyle = "rgba(255,255,255,0.3)";
      ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(w/2, h*0.2); ctx.lineTo(w/2, h); ctx.stroke();
    }
  } else if (type?.startsWith("bed-")) {
    ctx.fillStyle = color;
    roundRect(ctx, 0, h*0.18, w, h*0.82, 5); ctx.fill();
    ctx.fillStyle = dark;
    roundRect(ctx, 0, 0, w, h*0.22, 5); ctx.fill();
    ctx.fillStyle = light;
    if (type === "bed-k") {
      roundRect(ctx, w*0.08, h*0.26, w*0.36, h*0.22, 4); ctx.fill();
      roundRect(ctx, w*0.56, h*0.26, w*0.36, h*0.22, 4); ctx.fill();
    } else {
      roundRect(ctx, w*0.15, h*0.26, w*0.7, h*0.22, 4); ctx.fill();
    }
    ctx.fillStyle = dark + "88";
    roundRect(ctx, 0, h*0.78, w, h*0.22, 3); ctx.fill();
  } else if (type === "chair-d") {
    ctx.fillStyle = color;
    roundRect(ctx, 0, h*0.18, w, h*0.82, 5); ctx.fill();
    ctx.fillStyle = dark;
    roundRect(ctx, 0, 0, w, h*0.24, 4); ctx.fill();
    ctx.fillStyle = light;
    roundRect(ctx, w*0.12, h*0.28, w*0.76, h*0.3, 3); ctx.fill();
  } else if (type === "chair-o") {
    ctx.strokeStyle = dark;
    ctx.lineWidth = 3;
    for (let i = 0; i < 5; i++) {
      const angle = (i * 72 - 90) * Math.PI / 180;
      ctx.beginPath();
      ctx.moveTo(w/2, h/2);
      ctx.lineTo(w/2 + Math.cos(angle)*w*0.45, h/2 + Math.sin(angle)*h*0.45);
      ctx.stroke();
    }
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(w/2, h/2, Math.min(w,h)*0.38, 0, Math.PI*2);
    ctx.fill();
    ctx.fillStyle = light;
    ctx.beginPath();
    ctx.arc(w/2, h/2, Math.min(w,h)*0.22, 0, Math.PI*2);
    ctx.fill();
  } else if (type === "table-c") {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.ellipse(w/2, h/2, w*0.48, h*0.42, 0, 0, Math.PI*2);
    ctx.fill();
    ctx.strokeStyle = dark;
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.fillStyle = light;
    ctx.beginPath();
    ctx.ellipse(w/2, h/2, w*0.34, h*0.28, 0, 0, Math.PI*2);
    ctx.fill();
  } else if (type === "table-d") {
    ctx.fillStyle = color;
    roundRect(ctx, 0, 0, w, h, 4); ctx.fill();
    ctx.strokeStyle = dark; ctx.lineWidth = 1.5;
    ctx.strokeRect(2, 2, w-4, h-4);
    ctx.fillStyle = dark;
    [[3,3],[w-9,3],[3,h-9],[w-9,h-9]].forEach(([lx,ly]) => {
      roundRect(ctx, lx, ly, 7, 7, 2); ctx.fill();
    });
    ctx.fillStyle = light;
    roundRect(ctx, w*0.12, h*0.15, w*0.76, h*0.7, 3); ctx.fill();
  } else if (type === "table-s") {
    ctx.fillStyle = color;
    roundRect(ctx, 0, 0, w, h, 5); ctx.fill();
    ctx.strokeStyle = dark; ctx.lineWidth = 1.5;
    ctx.strokeRect(2, 2, w-4, h-4);
    ctx.fillStyle = light;
    ctx.beginPath();
    ctx.arc(w/2, h/2, Math.min(w,h)*0.32, 0, Math.PI*2);
    ctx.fill();
  } else {
    ctx.fillStyle = color;
    roundRect(ctx, 0, 0, w, h, 6); ctx.fill();
    ctx.fillStyle = light;
    roundRect(ctx, 5, 5, w-10, (h-10)*0.45, 3); ctx.fill();
  }

  // Selection border
  ctx.strokeStyle = isSelected ? "#8b5cf6" : "rgba(255,255,255,0.6)";
  ctx.lineWidth   = isSelected ? 3 : 1.5;
  roundRect(ctx, 0, 0, w, h, 6);
  ctx.stroke();

  // Label — white text with shadow for visibility in both modes
  ctx.fillStyle = "#ffffff";
  ctx.font      = "700 11px Afacad, sans-serif";
  ctx.textAlign = "center";
  ctx.shadowColor = "rgba(0,0,0,0.7)";
  ctx.shadowBlur  = 6;
  ctx.fillText(item.label, w / 2, h / 2 + 4);
  ctx.shadowBlur  = 0;
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.arcTo(x + w, y, x + w, y + r, r);
  ctx.lineTo(x + w, y + h - r);
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
  ctx.lineTo(x + r, y + h);
  ctx.arcTo(x, y + h, x, y + h - r, r);
  ctx.lineTo(x, y + r);
  ctx.arcTo(x, y, x + r, y, r);
  ctx.closePath();
}

function CanvasEditor({ roomConfig, furniture, selectedId, onSelect, onDragEnd, onResize, zoom, dark }) {
  const canvasRef    = useRef(null);
  const containerRef = useRef(null);
  const [dragging,   setDragging]   = useState(null);
  const [resizing,   setResizing]   = useState(null);
  const [canvasSize, setCanvasSize] = useState({ w:800, h:600 });

  const roomW   = mToPx(roomConfig.width);
  const roomH   = mToPx(roomConfig.height);
  const offsetX = Math.max(60, (canvasSize.w / zoom - roomW) / 2);
  const offsetY = Math.max(60, (canvasSize.h / zoom - roomH) / 2);

  useEffect(() => {
    if (!containerRef.current) return;
    const obs = new ResizeObserver(([entry]) => {
      setCanvasSize({ w: entry.contentRect.width, h: entry.contentRect.height });
    });
    obs.observe(containerRef.current);
    return () => obs.disconnect();
  }, []);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.scale(zoom, zoom);

    // Canvas background
    ctx.fillStyle = dark ? "#0f0a1a" : "#e8e4f0";
    ctx.fillRect(0, 0, canvas.width / zoom, canvas.height / zoom);

    // Floor
    ctx.fillStyle = roomConfig.floorColor;
    roundRect(ctx, offsetX, offsetY, roomW, roomH, 4);
    ctx.fill();

    // Grid
    ctx.strokeStyle = dark ? "rgba(139,92,246,0.18)" : "rgba(139,92,246,0.1)";
    ctx.lineWidth   = 1;
    for (let x = SCALE; x < roomW; x += SCALE) {
      ctx.beginPath();
      ctx.moveTo(offsetX + x, offsetY);
      ctx.lineTo(offsetX + x, offsetY + roomH);
      ctx.stroke();
    }
    for (let y = SCALE; y < roomH; y += SCALE) {
      ctx.beginPath();
      ctx.moveTo(offsetX,         offsetY + y);
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

      ctx.save();
      ctx.shadowColor = "rgba(0,0,0,0.18)";
      ctx.shadowBlur  = 10;
      ctx.shadowOffsetX = 3;
      ctx.shadowOffsetY = 4;
      ctx.fillStyle = "transparent";
      roundRect(ctx, 0, 0, item.w, item.h, 6);
      ctx.fill();
      ctx.restore();

      drawFurnitureShape(ctx, item, isSelected, dark);

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
  }, [furniture, selectedId, roomConfig, roomW, roomH, zoom, offsetX, offsetY, dark]);

  useEffect(() => { draw(); }, [draw, canvasSize]);

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

function BackButton({ label, onClick, dark }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display:"flex", alignItems:"center", gap:5,
        padding:"5px 12px", borderRadius:50, border:"none",
        background: hov
          ? (dark ? "rgba(139,92,246,0.25)" : "rgba(255,255,255,0.55)")
          : (dark ? "rgba(139,92,246,0.12)" : "rgba(255,255,255,0.32)"),
        cursor:"pointer", fontSize:12, fontWeight:600,
        color: hov ? (dark ? "#c4b5fd" : "#4c1d95") : (dark ? "#a78bfa" : "#6b5b95"),
        fontFamily:"'Afacad',sans-serif",
        transition:"all 0.18s",
      }}
    >
      <span style={{ fontSize:14, lineHeight:1 }}>←</span>
      {label}
    </button>
  );
}

export default function Editor2DClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const projectId = searchParams.get("projectId");
  const { dark } = useTheme();

  const [activeCategory, setActiveCategory] = useState("Sofas");
  const [roomConfig, setRoomConfig] = useState(TEMP_ROOM);
  const [zoom, setZoom] = useState(1);
  const [furniture, setFurniture] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [saved, setSaved] = useState(false);
  const [dbLoaded, setDbLoaded] = useState(false);
  const saveTimerRef = useRef(null);
  const canvasContainerRef = useRef(null);

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

  useEffect(() => {
    const fit = () => {
      if (!canvasContainerRef.current) return;
      const { width: cw, height: ch } = canvasContainerRef.current.getBoundingClientRect();
      const roomW = mToPx(roomConfig.width);
      const roomH = mToPx(roomConfig.height);
      const padding = 120;
      const zoomX = (cw - padding) / roomW;
      const zoomY = (ch - padding) / roomH;
      const fitted = Math.min(zoomX, zoomY, 2);
      setZoom(parseFloat(fitted.toFixed(2)));
    };
    const t = setTimeout(fit, 100);
    return () => clearTimeout(t);
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

  const glass = {
    borderRadius: 20,
    background: dark ? "rgba(20,12,45,0.85)" : "rgba(255,255,255,0.22)",
    backdropFilter: "blur(32px)",
    border: dark ? "1.5px solid rgba(139,92,246,0.25)" : "1.5px solid rgba(255,255,255,0.65)",
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

  const labelSt = {
    fontSize:11,
    color: dark ? "#a78bfa" : "#9b93b8",
    marginBottom:5, fontWeight:600,
    letterSpacing:"0.4px", textTransform:"uppercase"
  };

  const inputSt = {
    width:"100%", padding:"8px 10px", borderRadius:12,
    border: dark ? "1px solid rgba(139,92,246,0.25)" : "1px solid rgba(255,255,255,0.6)",
    background: dark ? "rgba(30,20,60,0.6)" : "rgba(255,255,255,0.55)",
    fontSize:13, fontFamily:"'Afacad',sans-serif",
    color: dark ? "#f0eaff" : "#2d1f4e",
  };

  const textPrimary   = dark ? "#f0eaff" : "#2d1f4e";
  const textSecondary = dark ? "#a78bfa" : "#9b93b8";
  const btnBase       = dark ? "rgba(30,20,60,0.6)" : "rgba(255,255,255,0.28)";
  const btnActive     = dark ? "rgba(139,92,246,0.25)" : "rgba(255,255,255,0.70)";
  const btnBorder     = dark ? "1px solid rgba(139,92,246,0.2)" : "1px solid rgba(255,255,255,0.55)";

  return (
    <div style={{
      display:"flex", flexDirection:"column", height:"100vh",
      fontFamily:"'Afacad',sans-serif",
      background: dark
        ? "linear-gradient(135deg,#0f0a1a 0%,#0a1020 50%,#120a1a 100%)"
        : "linear-gradient(135deg,#f0eaff 0%,#e8f4ff 50%,#f0e8ff 100%)",
    }}>
      <style dangerouslySetInnerHTML={{ __html: css }} />

      {/* ── TOP BAR ── */}
      <header style={{
        height:52, display:"flex", alignItems:"center", justifyContent:"space-between",
        padding:"0 20px",
        background: dark ? "rgba(15,10,30,0.8)" : "rgba(255,255,255,0.18)",
        backdropFilter:"blur(24px)",
        borderBottom: dark ? "1px solid rgba(139,92,246,0.2)" : "1px solid rgba(255,255,255,0.45)",
        flexShrink:0, gap:12,
      }}>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <span style={{ fontSize:17, fontWeight:700, color: dark ? "#f0eaff" : "#2d1f4e", cursor:"pointer", whiteSpace:"nowrap" }}
            onClick={() => router.push("/dashboard")}>
            Mauve Studio<span style={{ color:"#8b5cf6" }}>.</span>
          </span>
          <span style={{ color:"#c4b5fd", fontSize:14, userSelect:"none" }}>/</span>
          <BackButton label="Home" onClick={() => router.push("/dashboard")} dark={dark} />
          <span style={{ color:"#c4b5fd", fontSize:14, userSelect:"none" }}>/</span>
          <BackButton label="Projects" onClick={() => router.push("/projects")} dark={dark} />
          <span style={{ color:"#c4b5fd", fontSize:14, userSelect:"none" }}>/</span>
          <span style={{ fontSize:12, fontWeight:700, color:"#8b5cf6",
            background:"rgba(139,92,246,0.10)", padding:"4px 10px",
            borderRadius:50, whiteSpace:"nowrap" }}>
            2D Editor
          </span>
        </div>

        <div style={{
          display:"flex", gap:4,
          background: dark ? "rgba(30,20,60,0.6)" : "rgba(255,255,255,0.35)",
          border: dark ? "1px solid rgba(139,92,246,0.25)" : "1px solid rgba(255,255,255,0.6)",
          borderRadius:50, padding:"3px",
        }}>
          <div style={{ padding:"5px 20px", borderRadius:50,
            background:"linear-gradient(135deg,#8b5cf6,#6d28d9)",
            fontSize:13, fontWeight:700, color:"#fff" }}>2D Plan</div>
          <button onClick={() => { handleSave(); router.push("/editor/3d"); }}
            style={{ padding:"5px 20px", borderRadius:50, border:"none",
              background:"transparent", cursor:"pointer", fontSize:13, fontWeight:600,
              color: dark ? "#a78bfa" : "#6b5b95" }}>
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
            whiteSpace:"nowrap",
          }}>
          {saved ? "✓ Saved!" : "⊡ Save"}
        </motion.button>
      </header>

      {/* ── BODY ── */}
      <div style={{ flex:1, display:"flex", gap:12, padding:12, overflow:"hidden" }}>

        {/* ── LEFT: Furniture panel ── */}
        <div style={{ ...glass, width:260, display:"flex", flexDirection:"column" }}>
          <div style={{
            padding:14,
            borderBottom: dark ? "1px solid rgba(139,92,246,0.15)" : "1px solid rgba(255,255,255,0.5)",
            flexShrink:0,
          }}>
            <div style={{ fontSize:15, fontWeight:700, color: textPrimary, marginBottom:10 }}>🛋️ Furniture</div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:5 }}>
              {CATEGORIES.map(cat => (
                <button key={cat} onClick={() => setActiveCategory(cat)} style={{
                  padding:"6px", borderRadius:10, border:"none", cursor:"pointer",
                  fontFamily:"'Afacad',sans-serif", fontSize:11,
                  background: activeCategory===cat ? btnActive : btnBase,
                  fontWeight: activeCategory===cat ? 700 : 500,
                  color: activeCategory===cat ? (dark ? "#c4b5fd" : "#4c1d95") : textSecondary,
                  border: btnBorder,
                }}>{cat}</button>
              ))}
            </div>
          </div>
          <div style={{ flex:1, overflowY:"auto", padding:10 }}>
            {FURNITURE_CATALOG[activeCategory].map(item => (
              <div key={item.type} onClick={() => placeFurniture(item)} style={{
                display:"flex", alignItems:"center", gap:10, padding:"8px 10px",
                borderRadius:14, marginBottom:6,
                background: dark ? "rgba(30,20,60,0.5)" : "rgba(255,255,255,0.28)",
                border: dark ? "1px solid rgba(139,92,246,0.15)" : "1px solid rgba(255,255,255,0.55)",
                cursor:"pointer",
              }}>
                <div style={{ width:52, height:44, borderRadius:10, overflow:"hidden",
                  flexShrink:0, background: dark ? "rgba(20,12,45,0.6)" : "rgba(255,255,255,0.3)" }}>
                  <FurniturePreview item={item} />
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:13, fontWeight:600, color: textPrimary }}>{item.label}</div>
                  <div style={{ fontSize:11, color: textSecondary }}>{item.w} × {item.h} cm</div>
                </div>
                <span style={{ fontSize:16, color:"#c4b5fd" }}>+</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── CENTRE: Canvas ── */}
        <div style={{ ...glass, flex:1, display:"flex", flexDirection:"column" }}>
          <div ref={canvasContainerRef} style={{ flex:1, overflow:"hidden", display:"flex" }}>
            <CanvasEditor
              roomConfig={roomConfig} furniture={furniture}
              selectedId={selectedId} onSelect={setSelectedId}
              onDragEnd={handleDragEnd} onResize={handleResize}
              zoom={zoom} dark={dark}
            />
          </div>

          {/* Bottom toolbar */}
          <div style={{
            height:52,
            borderTop: dark ? "1px solid rgba(139,92,246,0.15)" : "1px solid rgba(255,255,255,0.5)",
            display:"flex", alignItems:"center", justifyContent:"center",
            gap:8,
            background: dark ? "rgba(15,10,30,0.5)" : "rgba(255,255,255,0.18)",
            flexShrink:0,
          }}>
            {[
              { action: zoomOut, label: "−" },
              { action: zoomIn,  label: "+" },
            ].map(({ action, label }) => (
              <button key={label} onClick={action} style={{
                width:34, height:34, borderRadius:50, border:"none",
                background: dark ? "rgba(139,92,246,0.2)" : "rgba(255,255,255,0.45)",
                color: dark ? "#c4b5fd" : "#6b5b95",
                cursor:"pointer", fontSize:15,
              }}>{label}</button>
            ))}

            <div style={{
              padding:"5px 14px", borderRadius:50,
              background: dark ? "rgba(139,92,246,0.15)" : "rgba(255,255,255,0.45)",
              fontSize:12, fontWeight:700,
              color: dark ? "#c4b5fd" : "#6b5b95",
              minWidth:58, textAlign:"center",
            }}>
              {Math.round(zoom * 100)}%
            </div>

            <button onClick={zoomFit} style={{
              height:34, padding:"0 14px", borderRadius:50, border:"none",
              background:"rgba(139,92,246,0.15)", cursor:"pointer",
              fontSize:11, fontWeight:700, color: dark ? "#c4b5fd" : "#8b5cf6",
            }}>⊞ Fit</button>

            {selectedId && (
              <button onClick={deleteSelected} style={{
                width:34, height:34, borderRadius:50, border:"none",
                background:"rgba(254,226,226,0.70)", color:"#dc2626",
                cursor:"pointer", fontSize:15,
              }}>🗑</button>
            )}

            {furniture.length > 0 && (
              <div style={{
                fontSize:11, fontWeight:700, padding:"4px 12px", borderRadius:50,
                background:"rgba(139,92,246,0.15)",
                color: dark ? "#c4b5fd" : "#8b5cf6",
              }}>
                {furniture.length} item{furniture.length!==1?"s":""}
              </div>
            )}
          </div>
        </div>

        {/* ── RIGHT: Properties + Room ── */}
        <div style={{ ...glass, width:260, padding:16, overflowY:"auto",
          display:"flex", flexDirection:"column", gap:0 }}>

          <div style={{ fontSize:14, fontWeight:700, color: textPrimary, marginBottom:12 }}>⚙ Properties</div>

          {selectedItem ? (
            <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
              <div>
                <div style={labelSt}>SELECTED</div>
                <div style={{
                  padding:"8px 12px", borderRadius:12,
                  background: dark ? "rgba(139,92,246,0.15)" : "rgba(139,92,246,0.08)",
                  fontSize:13, fontWeight:700,
                  color: dark ? "#c4b5fd" : "#4c1d95",
                }}>
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
                      background: selectedItem.rotation===deg
                        ? (dark ? "rgba(139,92,246,0.35)" : "rgba(139,92,246,0.18)")
                        : (dark ? "rgba(30,20,60,0.5)" : "rgba(255,255,255,0.40)"),
                      color: selectedItem.rotation===deg
                        ? (dark ? "#c4b5fd" : "#6d28d9")
                        : textSecondary,
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
            <div style={{ textAlign:"center", padding:"20px 10px", fontSize:12, color: textSecondary, lineHeight:1.6 }}>
              <div style={{ fontSize:28, marginBottom:8 }}>◈</div>
              Click furniture on the canvas to see its properties
            </div>
          )}

          {/* Room settings */}
          <div style={{
            marginTop:20, paddingTop:16,
            borderTop: dark ? "1px solid rgba(139,92,246,0.15)" : "1px solid rgba(255,255,255,0.4)",
            display:"flex", flexDirection:"column", gap:14,
          }}>
            <div style={{ fontSize:14, fontWeight:700, color: textPrimary }}>◫ Room</div>

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

            <div>
              <div style={labelSt}>WALL COLOUR</div>
              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6 }}>
                <div style={{ width:32, height:22, borderRadius:6, background:roomConfig.wallColor,
                  border:"1px solid rgba(0,0,0,0.08)", flexShrink:0 }}/>
                <span style={{ fontSize:11, color: textSecondary }}>{roomConfig.wallColor}</span>
              </div>
              <ColorRow colors={WALL_COLORS} value={roomConfig.wallColor}
                onChange={c => setRoomConfig(r => ({ ...r, wallColor:c }))} />
            </div>

            <div>
              <div style={labelSt}>FLOOR COLOUR</div>
              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6 }}>
                <div style={{ width:32, height:22, borderRadius:6, background:roomConfig.floorColor,
                  border:"1px solid rgba(0,0,0,0.08)", flexShrink:0 }}/>
                <span style={{ fontSize:11, color: textSecondary }}>{roomConfig.floorColor}</span>
              </div>
              <ColorRow colors={FLOOR_COLORS} value={roomConfig.floorColor}
                onChange={c => setRoomConfig(r => ({ ...r, floorColor:c }))} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}