"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
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
    { type: "sofa-2", label: "2-Seat Sofa", w: 160, h: 80, color: "#c4b5fd" },
    { type: "sofa-3", label: "3-Seat Sofa", w: 220, h: 85, color: "#a78bfa" },
    { type: "sofa-l", label: "L-Shape Sofa", w: 200, h: 160, color: "#8b5cf6" },
    { type: "sofa-1", label: "Armchair", w: 90, h: 85, color: "#ddd6fe" },
  ],
  Beds: [
    { type: "bed-s", label: "Single Bed", w: 100, h: 200, color: "#bfdbfe" },
    { type: "bed-d", label: "Double Bed", w: 140, h: 200, color: "#93c5fd" },
    { type: "bed-k", label: "King Bed", w: 180, h: 210, color: "#60a5fa" },
  ],
  Chairs: [
    { type: "chair-a", label: "Armchair", w: 80, h: 80, color: "#d8b4fe" },
    { type: "chair-d", label: "Dining Chair", w: 50, h: 50, color: "#e9d5ff" },
    { type: "chair-o", label: "Office Chair", w: 60, h: 60, color: "#c4b5fd" },
  ],
  Tables: [
    { type: "table-c", label: "Coffee Table", w: 120, h: 60, color: "#fde68a" },
    { type: "table-d", label: "Dining Table", w: 160, h: 90, color: "#fcd34d" },
    { type: "table-s", label: "Side Table", w: 50, h: 50, color: "#fef3c7" },
  ],
};

const CATEGORIES = Object.keys(FURNITURE_CATALOG);
const SCALE = 80;
const ITEM_COLORS = ["#c4b5fd", "#a78bfa", "#93c5fd", "#6ee7b7", "#fde68a", "#fbcfe8", "#fca5a5", "#d1fae5"];

let _uid = 1;
function uid() { return `f_${_uid++}`; }
function mToPx(m) { return parseFloat(m) * SCALE; }

function FurniturePreview({ item }) {
  return (
    <svg width={52} height={44} viewBox="0 0 52 44" fill="none">
      <rect x="3" y="5" width="46" height="34" rx="5" fill={item.color} opacity="0.85" />
      <rect x="3" y="5" width="46" height="34" rx="5" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="1.2" />
      <rect x="7" y="9" width="16" height="10" rx="3" fill="rgba(255,255,255,0.30)" />
    </svg>
  );
}

function CanvasEditor({ roomConfig, furniture, selectedId, onSelect, onDragEnd, onResize, zoom }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [dragging, setDragging] = useState(null);
  const [resizing, setResizing] = useState(null);
  const [canvasSize, setCanvasSize] = useState({ w: 800, h: 600 });

  const roomW = mToPx(roomConfig.width);
  const roomH = mToPx(roomConfig.height);
  const offsetX = 50;
  const offsetY = 50;

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
    const ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.scale(zoom, zoom);

    // Floor
    ctx.fillStyle = roomConfig.floorColor;
    ctx.fillRect(offsetX, offsetY, roomW, roomH);

    // Grid
    ctx.strokeStyle = 'rgba(139,92,246,0.1)';
    ctx.lineWidth = 1;
    for (let x = SCALE; x < roomW; x += SCALE) {
      ctx.beginPath();
      ctx.moveTo(offsetX + x, offsetY);
      ctx.lineTo(offsetX + x, offsetY + roomH);
      ctx.stroke();
    }
    for (let y = SCALE; y < roomH; y += SCALE) {
      ctx.beginPath();
      ctx.moveTo(offsetX, offsetY + y);
      ctx.lineTo(offsetX + roomW, offsetY + y);
      ctx.stroke();
    }

    // Walls
    ctx.strokeStyle = roomConfig.wallColor;
    ctx.lineWidth = 8;
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

      // Shadow
      ctx.fillStyle = 'rgba(0,0,0,0.1)';
      ctx.fillRect(3, 4, item.w, item.h);

      // Body
      ctx.fillStyle = item.color;
      ctx.fillRect(0, 0, item.w, item.h);

      // Border
      ctx.strokeStyle = isSelected ? '#8b5cf6' : 'rgba(255,255,255,0.7)';
      ctx.lineWidth = isSelected ? 3 : 1.5;
      ctx.strokeRect(0, 0, item.w, item.h);

      // Inner detail
      ctx.fillStyle = 'rgba(255,255,255,0.18)';
      ctx.fillRect(5, 5, item.w - 10, item.h - 10);

      // Label
      ctx.fillStyle = '#2d1f4e';
      ctx.font = '600 11px Afacad, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(item.label, item.w / 2, item.h / 2 + 4);

      // Resize handles if selected
      if (isSelected) {
        ctx.fillStyle = '#8b5cf6';
        const handleSize = 8;
        // Corners
        [-1, 1].forEach(dx => {
          [-1, 1].forEach(dy => {
            ctx.fillRect(
              dx > 0 ? item.w - handleSize / 2 : -handleSize / 2,
              dy > 0 ? item.h - handleSize / 2 : -handleSize / 2,
              handleSize, handleSize
            );
          });
        });
      }

      ctx.restore();
    });

    ctx.restore();
  }, [furniture, selectedId, roomConfig, roomW, roomH, zoom]);

  useEffect(() => {
    draw();
  }, [draw]);

  const getMousePos = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left) / zoom - offsetX,
      y: (e.clientY - rect.top) / zoom - offsetY,
    };
  };

  const handleMouseDown = (e) => {
    const pos = getMousePos(e);

    // Check furniture (reverse order for top item first)
    for (let i = furniture.length - 1; i >= 0; i--) {
      const item = furniture[i];
      const inBounds = pos.x >= item.x && pos.x <= item.x + item.w &&
        pos.y >= item.y && pos.y <= item.y + item.h;

      if (inBounds) {
        onSelect(item.id);

        // Check resize handles
        const handleSize = 8 / zoom;
        const corners = [
          { x: item.x, y: item.y, cursor: 'nw' },
          { x: item.x + item.w, y: item.y, cursor: 'ne' },
          { x: item.x, y: item.y + item.h, cursor: 'sw' },
          { x: item.x + item.w, y: item.y + item.h, cursor: 'se' },
        ];

        for (const corner of corners) {
          if (Math.abs(pos.x - corner.x) < handleSize && Math.abs(pos.y - corner.y) < handleSize) {
            setResizing({ id: item.id, corner: corner.cursor, startX: pos.x, startY: pos.y, startW: item.w, startH: item.h, startItemX: item.x, startItemY: item.y });
            return;
          }
        }

        setDragging({ id: item.id, offsetX: pos.x - item.x, offsetY: pos.y - item.y });
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

      let newW = resizing.startW;
      let newH = resizing.startH;
      let newX = resizing.startItemX;
      let newY = resizing.startItemY;

      if (resizing.corner.includes('e')) newW += dx;
      if (resizing.corner.includes('w')) { newW -= dx; newX += dx; }
      if (resizing.corner.includes('s')) newH += dy;
      if (resizing.corner.includes('n')) { newH -= dy; newY += dy; }

      onResize(resizing.id, Math.max(30, newW), Math.max(30, newH), newX, newY);
    }
  };

  const handleMouseUp = () => {
    setDragging(null);
    setResizing(null);
  };

  return (
    <div ref={containerRef} style={{ flex: 1, overflow: 'hidden' }}>
      <canvas
        ref={canvasRef}
        width={canvasSize.w}
        height={canvasSize.h}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{ display: 'block', cursor: dragging ? 'grabbing' : 'default' }}
      />
    </div>
  );
}

export default function Editor2DClient() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState("Sofas");
  const [roomConfig, setRoomConfig] = useState(TEMP_ROOM);
  const [zoom, setZoom] = useState(1);
  const [furniture, setFurniture] = useState([]);
  const [selectedId, setSelectedId] = useState(null);

  const zoomIn = () => setZoom(z => Math.min(+(z + 0.1).toFixed(1), 3));
  const zoomOut = () => setZoom(z => Math.max(+(z - 0.1).toFixed(1), 0.3));

  const placeFurniture = (item) => {
    const roomW = mToPx(roomConfig.width);
    const roomH = mToPx(roomConfig.height);
    const newItem = {
      id: uid(),
      type: item.type,
      label: item.label,
      x: roomW / 2 - item.w / 2,
      y: roomH / 2 - item.h / 2,
      w: item.w,
      h: item.h,
      color: item.color,
      rotation: 0
    };
    setFurniture(prev => [...prev, newItem]);
    setSelectedId(newItem.id);
  };

  const handleDragEnd = (id, x, y) => {
    setFurniture(prev => prev.map(f => f.id === id ? { ...f, x, y } : f));
  };

  const handleResize = (id, w, h, x, y) => {
    setFurniture(prev => prev.map(f => f.id === id ? { ...f, w, h, x, y } : f));
  };

  const deleteSelected = () => {
    setFurniture(prev => prev.filter(f => f.id !== selectedId));
    setSelectedId(null);
  };

  const selectedItem = furniture.find(f => f.id === selectedId);
  const updateSelected = (key, val) => {
    setFurniture(prev => prev.map(f => f.id === selectedId ? { ...f, [key]: val } : f));
  };

  const glassPanel = {
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
    @keyframes shimmer { 0% { background-position:-300% center } 100% { background-position:300% center } }
  `;

  return (
    <div style={{
      display: "flex", flexDirection: "column", height: "100vh", fontFamily: "'Afacad',sans-serif",
      background: "linear-gradient(135deg,#f0eaff 0%,#e8f4ff 50%,#f0e8ff 100%)"
    }}>
      <style dangerouslySetInnerHTML={{ __html: css }} />

      <header style={{
        height: 52, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 20px",
        background: "rgba(255,255,255,0.18)", backdropFilter: "blur(24px)", borderBottom: "1px solid rgba(255,255,255,0.45)"
      }}>
        <span style={{ fontSize: 18, fontWeight: 700, color: "#2d1f4e", cursor: "pointer" }}>
          Mauve Studio<span style={{ color: "#8b5cf6" }}>.</span>
        </span>
        <div style={{ display: "flex", gap: 4 }}>
          <div style={{
            padding: "5px 20px", borderRadius: 50, background: "linear-gradient(135deg,#8b5cf6,#6d28d9)",
            fontSize: 13, fontWeight: 700, color: "#fff"
          }}>2D Plan</div>
          <button onClick={() => router.push("/editor/3d")} style={{
            padding: "5px 20px", borderRadius: 50, border: "none",
            background: "rgba(255,255,255,0.3)", cursor: "pointer", fontSize: 13, fontWeight: 600, color: "#6b5b95"
          }}>3D View</button>
        </div>
      </header>

      <div style={{ flex: 1, display: "flex", gap: 12, padding: 12 }}>

        {/* Left Panel */}
        <div style={{ ...glassPanel, width: 280, display: "flex", flexDirection: "column" }}>
          <div style={{ padding: 14, borderBottom: "1px solid rgba(255,255,255,0.5)" }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#2d1f4e", marginBottom: 10 }}>🛋️ Furniture</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 5 }}>
              {CATEGORIES.map(cat => (
                <button key={cat} onClick={() => setActiveCategory(cat)} style={{
                  padding: "6px", borderRadius: 10, border: "none", cursor: "pointer", fontFamily: "'Afacad',sans-serif", fontSize: 11,
                  background: activeCategory === cat ? "rgba(255,255,255,0.70)" : "rgba(255,255,255,0.28)",
                  fontWeight: activeCategory === cat ? 700 : 500, color: activeCategory === cat ? "#4c1d95" : "#9b93b8",
                }}>{cat}</button>
              ))}
            </div>
          </div>
          <div style={{ flex: 1, overflowY: "auto", padding: 10 }}>
            {FURNITURE_CATALOG[activeCategory].map(item => (
              <div key={item.type} onClick={() => placeFurniture(item)} style={{
                display: "flex", alignItems: "center", gap: 12, padding: "9px 12px", borderRadius: 14, marginBottom: 7,
                background: "rgba(255,255,255,0.28)", border: "1px solid rgba(255,255,255,0.55)", cursor: "pointer",
              }}>
                <div style={{ width: 52, height: 44, borderRadius: 10, overflow: "hidden" }}>
                  <FurniturePreview item={item} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#2d1f4e" }}>{item.label}</div>
                  <div style={{ fontSize: 11, color: "#9b93b8" }}>{item.w} × {item.h} cm</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Canvas */}
        <div style={{ ...glassPanel, flex: 1, display: "flex", flexDirection: "column" }}>
          <CanvasEditor
            roomConfig={roomConfig}
            furniture={furniture}
            selectedId={selectedId}
            onSelect={setSelectedId}
            onDragEnd={handleDragEnd}
            onResize={handleResize}
            zoom={zoom}
          />
          <div style={{
            height: 52, borderTop: "1px solid rgba(255,255,255,0.5)", display: "flex", alignItems: "center",
            justifyContent: "center", gap: 8, background: "rgba(255,255,255,0.18)"
          }}>
            <button onClick={zoomOut} style={{
              width: 34, height: 34, borderRadius: 50, border: "none",
              background: "rgba(255,255,255,0.45)", cursor: "pointer", fontSize: 15
            }}>−</button>
            <div style={{
              padding: "5px 14px", borderRadius: 50, background: "rgba(255,255,255,0.45)",
              fontSize: 12, fontWeight: 700, color: "#6b5b95", minWidth: 58, textAlign: "center"
            }}>{Math.round(zoom * 100)}%</div>
            <button onClick={zoomIn} style={{
              width: 34, height: 34, borderRadius: 50, border: "none",
              background: "rgba(255,255,255,0.45)", cursor: "pointer", fontSize: 15
            }}>+</button>
            {selectedId && (
              <button onClick={deleteSelected} style={{
                width: 34, height: 34, borderRadius: 50, border: "none",
                background: "rgba(254,226,226,0.70)", color: "#dc2626", cursor: "pointer", fontSize: 15
              }}>🗑</button>
            )}
          </div>
        </div>

        {/* Right Panel */}
        <div style={{ ...glassPanel, width: 260, padding: 16 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#2d1f4e", marginBottom: 12 }}>⚙ Properties</div>
          {selectedItem ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div>
                <div style={{ fontSize: 11, color: "#9b93b8", marginBottom: 4 }}>SELECTED</div>
                <div style={{
                  padding: "8px 12px", borderRadius: 12, background: "rgba(139,92,246,0.08)",
                  fontSize: 13, fontWeight: 700, color: "#4c1d95"
                }}>{selectedItem.label}</div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 11, color: "#9b93b8", marginBottom: 4 }}>WIDTH</div>
                  <input type="number" min="30" value={Math.round(selectedItem.w)}
                    onChange={e => updateSelected("w", +e.target.value)}
                    style={{
                      width: "100%", padding: "8px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.6)",
                      background: "rgba(255,255,255,0.55)", fontSize: 13
                    }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 11, color: "#9b93b8", marginBottom: 4 }}>HEIGHT</div>
                  <input type="number" min="30" value={Math.round(selectedItem.h)}
                    onChange={e => updateSelected("h", +e.target.value)}
                    style={{
                      width: "100%", padding: "8px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.6)",
                      background: "rgba(255,255,255,0.55)", fontSize: 13
                    }}
                  />
                </div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: "#9b93b8", marginBottom: 4 }}>COLOR</div>
                <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
                  {ITEM_COLORS.map(c => (
                    <button key={c} onClick={() => updateSelected("color", c)}
                      style={{
                        width: 28, height: 28, borderRadius: 8, border: "none", background: c, cursor: "pointer",
                        boxShadow: selectedItem.color === c ? "0 0 0 2.5px #8b5cf6" : "0 2px 6px rgba(0,0,0,0.10)"
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: 20, fontSize: 12, color: "#c4b5fd" }}>
              Click furniture to select
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
