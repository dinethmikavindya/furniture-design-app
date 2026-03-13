"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import GlassSidebar from "@/components/GlassSidebar";
import Image from "next/image";

const categoryImages = {
    Sofas: "/assets/images/furniture/sofa.png",
    sofa: "/assets/images/furniture/sofa.png",
    Beds: "/assets/images/furniture/bed.png",
    bed: "/assets/images/furniture/bed.png",
    Chairs: "/assets/images/furniture/chair.png",
    chair: "/assets/images/furniture/chair.png",
    Tables: "/assets/images/furniture/table.png",
    table: "/assets/images/furniture/table.png",
    Storage: "/assets/images/furniture/storage.png",
    storage: "/assets/images/furniture/storage.png",
    Decor: "/assets/images/furniture/lamp.png",
    decor: "/assets/images/furniture/lamp.png",
};

const publicImages = {
    home: "/assets/images/home.jpeg",
    one: "/assets/images/1.png",
    two: "/assets/images/2.png",
    three: "/assets/images/3.png",
    four: "/assets/images/4.png",
};

const categories = ["Sofas", "Beds", "Chairs", "Tables", "Storage", "Decor"];

const PRICES = {
    "2-Seat Sofa": "Rs.85,000", "3-Seat Sofa": "Rs.120,000", "L-Shape Sofa": "Rs.150,000", "Armchair": "Rs.45,000",
    "Single Bed": "Rs.65,000", "Double Bed": "Rs.95,000", "Bunk Bed": "Rs.110,000",
    "Desk Chair": "Rs.35,000", "Dining Chair": "Rs.18,000", "Bench": "Rs.28,000",
    "Coffee Table": "Rs.42,000", "Dining Table": "Rs.78,000", "Side Table": "Rs.22,000",
    "Bookcase": "Rs.55,000", "TV Cabinet": "Rs.68,000",
    "Floor Lamp": "Rs.15,000", "Potted Plant": "Rs.8,000", "Rug": "Rs.32,000",
};

function CategoryRow({ active, setActive }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.4 }}
            style={{
                display: "flex", gap: 0, marginBottom: 40,
                borderBottom: "1px solid #f0ece8", paddingBottom: 0,
            }}
        >
            {categories.map((cat) => (
                <motion.button
                    key={cat} onClick={() => setActive(cat)} whileHover={{ y: -2 }}
                    style={{
                        flex: 1, display: "flex", flexDirection: "column", alignItems: "center",
                        gap: 10, padding: "16px 8px 14px", background: "none", border: "none",
                        borderBottom: active === cat ? "2px solid #7c3aed" : "2px solid transparent",
                        cursor: "pointer", transition: "all 0.2s", marginBottom: -1,
                    }}
                >
                    <div style={{ height: 56, width: 64, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                        <Image src={categoryImages[cat]} alt={cat} fill style={{ objectFit: "contain", filter: "brightness(0.9)" }} />
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 500, color: active === cat ? "#7c3aed" : "#1a1a2e", fontFamily: "'Georgia', serif", letterSpacing: 0.2 }}>
                        {cat}
                    </span>
                </motion.button>
            ))}
        </motion.div>
    );
}

function ProductCard({ product, index }) {
    const [hov, setHov] = useState(false);
    const router = useRouter();
    const catKey = product.category?.toLowerCase();
    const imgSrc = categoryImages[catKey] || categoryImages[product.category] || categoryImages["sofa"];
    const colors = product.available_colors || product.colors || ["#c4b5fd"];

    return (
        <motion.div
            onClick={() => router.push(`/materials?id=${product.id}&name=${encodeURIComponent(product.name)}&category=${product.category}&price=${encodeURIComponent(PRICES[product.name] || "Rs.50,000")}&colors=${encodeURIComponent(JSON.stringify(colors))}`)}
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + index * 0.06, duration: 0.4 }}
            onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
            style={{
                background: "rgba(255,255,255,0.5)", backdropFilter: "blur(20px)", borderRadius: 12, border: "1px solid rgba(255,255,255,0.7)",
                padding: "16px 16px 18px", cursor: "pointer", transition: "box-shadow 0.2s, transform 0.2s",
                boxShadow: hov ? "0 8px 28px rgba(0,0,0,0.09)" : "0 2px 8px rgba(0,0,0,0.04)",
                transform: hov ? "translateY(-3px)" : "translateY(0)", minWidth: 0,
            }}
        >
            <div style={{ background: "rgba(255,255,255,0.4)", borderRadius: 8, height: 120, marginBottom: 14, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                <div style={{ position: "relative", width: "100%", height: "100%" }}>
                    <Image src={imgSrc} alt={product.name} fill
                        style={{ objectFit: "contain", padding: "12px", filter: colors[0] === "cream" ? "none" : "grayscale(80%) brightness(1.2)" }} />
                    {colors[0] !== "cream" && (
                        <div style={{
                            position: "absolute", inset: 0, backgroundColor: colors[0],
                            mixBlendMode: "multiply", opacity: 0.85, pointerEvents: "none",
                            WebkitMaskImage: `url(${imgSrc})`, WebkitMaskSize: "contain",
                            WebkitMaskPosition: "center", WebkitMaskRepeat: "no-repeat",
                            maskImage: `url(${imgSrc})`, maskSize: "contain",
                            maskPosition: "center", maskRepeat: "no-repeat",
                        }} />
                    )}
                </div>
            </div>
            <div style={{ display: "flex", gap: 5, marginBottom: 10 }}>
                {colors.slice(0, 5).map((c, ci) => (
                    <div key={ci} style={{ width: 14, height: 14, borderRadius: "50%", background: c, border: ci === 0 ? "2px solid #7c3aed" : "2px solid #e5e0d8" }} />
                ))}
            </div>
            <div style={{ fontSize: 14, fontWeight: 600, color: "#1a1a2e", marginBottom: 3, fontFamily: "'Georgia', serif" }}>{product.name}</div>
            <div style={{ fontSize: 12, color: "#9b93b8", marginBottom: 6, fontWeight: 500 }}>{product.category}</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#1a1a2e", fontFamily: "'Georgia', serif" }}>{PRICES[product.name] || "Rs.50,000"}</div>
        </motion.div>
    );
}

function NewArrivalsSection({ products = [], loading }) {
    return (
        <section style={{ marginBottom: 40 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <h2 style={{ fontSize: 22, fontWeight: 700, color: "#1a1a2e", fontFamily: "'Georgia', serif" }}>New Arrivals</h2>
                <div style={{ display: "flex", gap: 8 }}>
                    {["←", "→"].map((arrow, i) => (
                        <button key={i} style={{ width: 36, height: 36, borderRadius: "50%", border: "1px solid #e0dbd5", background: i === 1 ? "#fff" : "transparent", cursor: "pointer", fontSize: 14, color: i === 1 ? "#1a1a2e" : "#b0a898", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 600 }}>{arrow}</button>
                    ))}
                </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 14, minHeight: 250 }}>
                {loading ? (
                    <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: 40, color: '#9b93b8' }}>Loading collection...</div>
                ) : products.length === 0 ? (
                    <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: 40, color: '#9b93b8' }}>No items found for this category.</div>
                ) : (
                    products.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)
                )}
            </div>
        </section>
    );
}

function PromoBanners() {
    return (
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.5 }}
            style={{ display: "flex", gap: 16, marginTop: 20, height: 440, fontFamily: "'Outfit', sans-serif" }}>
            <div style={{ flex: "0 0 270px", background: "linear-gradient(180deg, #fefbef 0%, #e0d4f6 100%)", position: "relative", display: "flex", flexDirection: "column", alignItems: "center", padding: "60px 20px 40px", clipPath: "path('M 0,0 L 270,0 L 270,440 Q 135,360 0,440 Z')" }}>
                <div style={{ width: "100%", height: 160, position: "relative", marginBottom: 30 }}>
                    <img src={categoryImages["bed"]} alt="Bed" style={{ width: "100%", height: "100%", objectFit: "contain", filter: "drop-shadow(0 10px 10px rgba(0,0,0,0.1))" }} />
                </div>
                <h3 style={{ fontSize: 24, fontWeight: 600, color: "#000", margin: "0 0 8px 0", textAlign: "center" }}>Unique Lighting</h3>
                <p style={{ fontSize: 15, color: "#888", margin: "0 0 24px 0", textAlign: "center" }}>Four-Way Lighting</p>
                <button style={{ background: "none", border: "none", padding: 0, cursor: "pointer", fontSize: 14, fontWeight: 600, color: "#000", borderBottom: "2px solid #8b5cf6", paddingBottom: 2 }}>Shop Now</button>
            </div>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 16 }}>
                <div style={{ display: "flex", gap: 16, height: "calc(50% - 8px)" }}>
                    <div style={{ flex: 1, background: "linear-gradient(90deg, #fefbef 0%, #e0d4f6 100%)", display: "flex", alignItems: "center", padding: "0 40px" }}>
                        <div style={{ flex: "0 0 50%", paddingRight: 20 }}>
                            <img src={categoryImages["sofa"]} alt="Sofa" style={{ width: "100%", maxHeight: 160, objectFit: "contain", filter: "drop-shadow(0 10px 10px rgba(0,0,0,0.1))" }} />
                        </div>
                        <div style={{ flex: "0 0 50%", textAlign: "left", paddingLeft: 20 }}>
                            <h3 style={{ fontSize: 26, fontWeight: 600, color: "#000", margin: "0 0 8px 0" }}>Trending Sofa</h3>
                            <p style={{ fontSize: 15, color: "#888", margin: "0 0 24px 0" }}>Timber Nest Furnishing</p>
                            <button style={{ background: "none", border: "none", padding: 0, cursor: "pointer", fontSize: 14, fontWeight: 600, color: "#000", borderBottom: "2px solid #8b5cf6", paddingBottom: 2 }}>Shop Now</button>
                        </div>
                    </div>
                    <div style={{ flex: "0 0 200px", backgroundColor: "#000", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                        <h3 style={{ fontSize: 28, fontWeight: 500, color: "#fff", margin: "0 0 12px 0" }}>Up to 50%</h3>
                        <p style={{ fontSize: 10, color: "#888", margin: "0 0 30px 0", letterSpacing: 0.5 }}>Year Ending Sale</p>
                        <button style={{ background: "none", border: "none", padding: 0, cursor: "pointer", fontSize: 14, fontWeight: 500, color: "#fff", borderBottom: "2px solid #8b5cf6", paddingBottom: 2 }}>Shop Now</button>
                    </div>
                </div>
                <div style={{ display: "flex", height: "calc(50% - 8px)", backgroundColor: "#e0d4f6", position: "relative", overflow: "hidden" }}>
                    <div style={{ flex: "0 0 50%", display: "flex", alignItems: "center", justifyContent: "center", padding: "16px", position: "relative", zIndex: 2 }}>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gridTemplateRows: "1fr 1fr", gap: 16, width: 180, height: 180 }}>
                            {[publicImages.one, publicImages.two, publicImages.three, publicImages.four].map((src, i) => (
                                <div key={i} style={{ backgroundColor: "#fff", display: "flex", alignItems: "center", justifyContent: "center", padding: 12 }}>
                                    <img src={src} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                                </div>
                            ))}
                        </div>
                    </div>
                    <div style={{ flex: "0 0 50%", position: "relative", display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 40px" }}>
                        <div style={{ position: "absolute", inset: 0, backgroundImage: `url(${publicImages.home})`, backgroundSize: "cover", backgroundPosition: "center", opacity: 0.35, mixBlendMode: "luminosity" }} />
                        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, rgba(224,212,246,1) 0%, rgba(224,212,246,0.2) 50%, rgba(224,212,246,0) 100%)" }} />
                        <div style={{ position: "relative", zIndex: 3, paddingLeft: 30 }}>
                            <h3 style={{ fontSize: 26, fontWeight: 600, color: "#000", margin: "0 0 8px 0" }}>Unique Lighting</h3>
                            <p style={{ fontSize: 15, color: "#666", margin: "0 0 24px 0" }}>Four-Way Lighting</p>
                            <button style={{ background: "none", border: "none", padding: 0, cursor: "pointer", fontSize: 14, fontWeight: 600, color: "#000", borderBottom: "2px solid #8b5cf6", paddingBottom: 2 }}>Shop Now</button>
                        </div>
                    </div>
                </div>
            </div>
        </motion.section>
    );
}

export default function ShopPage() {
    const [activeCategory, setActiveCategory] = useState("Sofas");
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        fetch(`/api/furniture?category=${activeCategory}`)
            .then(res => res.json())
            .then(data => { setProducts(data.furniture || []); setLoading(false); })
            .catch(() => { setProducts([]); setLoading(false); });
    }, [activeCategory]);

    return (
        <div style={{ display: "flex", height: "100vh", overflow: "hidden", background: "#faf8f5", fontFamily: "'Afacad','Helvetica Neue',sans-serif" }}>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&display=swap');
                @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&display=swap');
                * { box-sizing: border-box; }
                ::-webkit-scrollbar{width:5px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:rgba(196,176,240,0.5);border-radius:3px}
                @keyframes shimmer { 0%{background-position:0% center} 100%{background-position:300% center} }
            `}</style>
            <GlassSidebar />
            <div style={{ flex: 1, overflowY: "auto", padding: "28px 32px", maxWidth: 1200 }}>
                <motion.div initial={{ y: -12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1, duration: 0.4 }} style={{ marginBottom: 28 }}>
                    <h1 style={{ fontSize: 36, fontWeight: 700, color: "#1e1040", lineHeight: 1.2, marginBottom: 7 }}>
                        <span style={{ background: "linear-gradient(90deg,#8b5cf6,#ec4899,#60a5fa,#8b5cf6)", backgroundSize: "300% auto", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", animation: "shimmer 3s linear infinite" }}>Shop</span>
                    </h1>
                    <p style={{ color: "#9b93b8", fontSize: 14, fontWeight: 500 }}>Discover our latest collections</p>
                </motion.div>
                <CategoryRow active={activeCategory} setActive={setActiveCategory} />
                <NewArrivalsSection products={products} loading={loading} />
                <PromoBanners />
            </div>
        </div>
    );
}
