"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import SidebarLayout from "../../components/layout/SidebarLayout";
import Image from "next/image";

// Sofa SVG illustrations in different colors
function SofaIllustration({ color = "#d4d0cc", small = false }) {
    const scale = small ? 0.6 : 1;
    const w = small ? 120 : 320;
    const h = small ? 70 : 200;
    return (
        <svg viewBox="0 0 320 200" fill="none" xmlns="http://www.w3.org/2000/svg" width={w} height={h}>
            {/* Main body */}
            <rect x="60" y="70" width="200" height="80" rx="14" fill={color} />
            {/* Back cushion left */}
            <rect x="62" y="42" width="90" height="50" rx="10" fill={color} style={{ filter: "brightness(0.95)" }} />
            {/* Back cushion right */}
            <rect x="168" y="42" width="90" height="50" rx="10" fill={color} style={{ filter: "brightness(0.95)" }} />
            {/* Left arm */}
            <rect x="38" y="82" width="30" height="58" rx="12" fill={color} style={{ filter: "brightness(0.90)" }} />
            {/* Right arm */}
            <rect x="252" y="82" width="30" height="58" rx="12" fill={color} style={{ filter: "brightness(0.90)" }} />
            {/* Seat cushion left */}
            <rect x="62" y="112" width="90" height="32" rx="6" fill={color} style={{ filter: "brightness(0.88)" }} />
            {/* Seat cushion right */}
            <rect x="168" y="112" width="90" height="32" rx="6" fill={color} style={{ filter: "brightness(0.88)" }} />
            {/* Left leg */}
            <rect x="78" y="148" width="14" height="30" rx="4" fill="#2a2a2e" />
            {/* Right leg */}
            <rect x="228" y="148" width="14" height="30" rx="4" fill="#2a2a2e" />
            {/* Subtle highlight line */}
            <rect x="62" y="110" width="196" height="2" rx="1" fill="rgba(255,255,255,0.35)" />
        </svg>
    );
}

function SmallSofaIllustration({ color = "#6a9a8a" }) {
    return (
        <svg viewBox="0 0 160 90" fill="none" xmlns="http://www.w3.org/2000/svg" width="110" height="65">
            <rect x="20" y="30" width="120" height="40" rx="9" fill={color} />
            <rect x="22" y="15" width="52" height="26" rx="7" fill={color} style={{ filter: "brightness(0.92)" }} />
            <rect x="86" y="15" width="52" height="26" rx="7" fill={color} style={{ filter: "brightness(0.92)" }} />
            <rect x="10" y="40" width="18" height="30" rx="8" fill={color} style={{ filter: "brightness(0.85)" }} />
            <rect x="132" y="40" width="18" height="30" rx="8" fill={color} style={{ filter: "brightness(0.85)" }} />
            <rect x="30" y="66" width="10" height="16" rx="3" fill="#2a2a2e" />
            <rect x="120" y="66" width="10" height="16" rx="3" fill="#2a2a2e" />
        </svg>
    );
}

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

const defaultColorOptions = [
    { id: "black", color: "#1a1a1a", sofaColor: "#2a2a2e", label: "Charcoal" },
    { id: "cream", color: "#d4cfc8", sofaColor: "#d4d0cc", label: "Cream", selected: true },
    { id: "gold", color: "#b8860b", sofaColor: "#c8a84a", label: "Golden Oak" },
];

const relatedProducts = [
    { id: 1, name: "Wooden Leg Sofa", category: "Sofa", price: "Rs.150,000", colors: ["#1a1a1a", "#8b7355", "#c4a882"], sofaColor: "#5a8a7a" },
    { id: 2, name: "Wooden Leg Sofa", category: "Sofa", price: "Rs.150,000", colors: ["#1a1a1a", "#8b7355", "#c4a882"], sofaColor: "#4a8a7a" },
];

const carouselItems = [
    { id: "prev-gray", sofaColor: "#8a8a8e", position: "left" },
    { id: "main", sofaColor: "#d4d0cc", position: "center" },
    { id: "next-cream", sofaColor: "#e8e0c8", position: "right" },
];

function WelcomeHeader() {
    return (
        <motion.div
            initial={{ y: -12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.08, duration: 0.4 }}
            style={{ marginBottom: 28 }}
        >
            <h1 style={{ fontSize: 36, fontWeight: 700, color: "#1e1040", lineHeight: 1.2, marginBottom: 7 }}>
                Material{" "}
                <span style={{
                    background: "linear-gradient(90deg,#8b5cf6,#ec4899,#60a5fa,#8b5cf6)",
                    backgroundSize: "300% auto",
                    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                    animation: "shimmer 3s linear infinite",
                }}>Library</span>
            </h1>
            <p style={{ color: "#9b93b8", fontSize: 14, fontWeight: 500 }}>
                Browse high-quality textures and materials
            </p>
        </motion.div>
    );
}

function ProductCarousel({ selectedColor, setSelectedColor, colorOptions, category }) {
    const [activeIdx, setActiveIdx] = useState(1);

    const sofaColor = colorOptions.find(c => c.id === selectedColor)?.sofaColor || "#d4d0cc";
    const imageSrc = categoryImages[category?.toLowerCase()] || categoryImages[category] || categoryImages["Sofas"];

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.5 }}
            style={{
                position: "relative",
                background: "#f2f2f0",
                borderRadius: 28,
                padding: "48px 80px 40px",
                marginBottom: 36,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                overflow: "hidden",
                minHeight: 420,
            }}
        >
            {/* Peaking items on sides */}
            <div style={{
                position: "absolute",
                left: -20,
                top: "50%",
                transform: "translateY(-60%)",
                opacity: 0.55,
                filter: "blur(2px)",
                width: 250,
                height: 180,
            }}>
                <Image src={imageSrc} alt="Prev item" fill style={{ objectFit: 'contain' }} />
            </div>
            <div style={{
                position: "absolute",
                right: -20,
                top: "50%",
                transform: "translateY(-60%)",
                opacity: 0.55,
                filter: "blur(2px)",
                width: 250,
                height: 180,
            }}>
                <Image src={imageSrc} alt="Next item" fill style={{ objectFit: 'contain' }} />
            </div>

            {/* Nav arrows */}
            <button style={{
                position: "absolute", left: 22, top: "42%",
                width: 38, height: 38, borderRadius: "50%",
                border: "1.5px solid #c8c4be", background: "rgba(255,255,255,0.75)",
                cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 16, color: "#4a4a5a", backdropFilter: "blur(8px)", zIndex: 10,
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            }}>‹</button>
            <button style={{
                position: "absolute", right: 22, top: "42%",
                width: 38, height: 38, borderRadius: "50%",
                border: "1.5px solid #c8c4be", background: "rgba(255,255,255,0.75)",
                cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 16, color: "#4a4a5a", backdropFilter: "blur(8px)", zIndex: 10,
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            }}>›</button>

            {/* Main image */}
            <motion.div
                key={selectedColor}
                initial={{ opacity: 0.8, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                style={{
                    position: "relative",
                    zIndex: 5,
                    marginBottom: 20,
                    width: "80%",
                    maxWidth: 500,
                    height: 300,
                }}
            >
                <Image
                    src={imageSrc}
                    alt="Product Image"
                    fill
                    style={{
                        objectFit: "contain",
                        filter: selectedColor === "cream" ? "none" : "grayscale(80%) brightness(1.2)",
                    }}
                />

                {/* Dynamic color tint overlay */}
                {selectedColor !== "cream" && (
                    <div
                        style={{
                            position: "absolute",
                            inset: 0,
                            backgroundColor: sofaColor,
                            mixBlendMode: "multiply",
                            opacity: 0.85,
                            transition: "background-color 0.3s ease",
                            pointerEvents: "none",
                            WebkitMaskImage: `url(${imageSrc})`,
                            WebkitMaskSize: "contain",
                            WebkitMaskPosition: "center",
                            WebkitMaskRepeat: "no-repeat",
                            maskImage: `url(${imageSrc})`,
                            maskSize: "contain",
                            maskPosition: "center",
                            maskRepeat: "no-repeat",
                        }}
                    />
                )}
            </motion.div>
            {/* Color swatches */}
            <div style={{ display: "flex", gap: 32, alignItems: "center", marginTop: 8, position: "relative", zIndex: 5 }}>
                {colorOptions.map((opt) => (
                    <motion.button
                        key={opt.id}
                        onClick={() => setSelectedColor(opt.id)}
                        whileHover={{ scale: 1.12 }}
                        whileTap={{ scale: 0.95 }}
                        style={{
                            width: 44, height: 44, borderRadius: "50%",
                            background: opt.color,
                            border: selectedColor === opt.id
                                ? `2.5px solid #7c3aed`
                                : "2.5px solid transparent",
                            cursor: "pointer",
                            boxShadow: selectedColor === opt.id ? "0 0 0 3px rgba(124,58,237,0.15)" : "none",
                            transition: "all 0.2s",
                            position: "relative",
                            outline: "none",
                        }}
                    >
                    </motion.button>
                ))}
            </div>
        </motion.div>
    );
}

function RelatedProductCard({ product, index }) {
    const [hov, setHov] = useState(false);
    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + index * 0.1, duration: 0.4 }}
            onMouseEnter={() => setHov(true)}
            onMouseLeave={() => setHov(false)}
            style={{
                background: "#fff",
                borderRadius: 14,
                border: "1px solid #ede9e4",
                padding: "16px",
                cursor: "pointer",
                transition: "box-shadow 0.2s, transform 0.2s",
                boxShadow: hov ? "0 6px 24px rgba(0,0,0,0.09)" : "0 2px 8px rgba(0,0,0,0.04)",
                transform: hov ? "translateY(-2px)" : "none",
                flex: 1,
            }}
        >
            <div style={{
                background: "#f0ece8",
                borderRadius: 10,
                height: 100,
                marginBottom: 12,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                overflow: "hidden"
            }}>
                <Image
                    src={categoryImages[product.category?.toLowerCase()] || categoryImages[product.category] || categoryImages["Sofas"]}
                    alt={product.name}
                    fill
                    style={{ objectFit: "contain", padding: "10px", filter: product.colors?.[0] === "cream" ? "none" : "grayscale(80%) brightness(1.2)" }}
                />
                {product.colors && product.colors[0] !== "cream" && (
                    <div style={{
                        position: "absolute",
                        inset: 0,
                        backgroundColor: product.colors[0],
                        mixBlendMode: "multiply",
                        opacity: 0.85,
                        pointerEvents: "none",
                        WebkitMaskImage: `url(${categoryImages[product.category?.toLowerCase()] || categoryImages[product.category] || categoryImages["Sofas"]})`,
                        WebkitMaskSize: "contain",
                        WebkitMaskPosition: "center",
                        WebkitMaskRepeat: "no-repeat",
                        maskImage: `url(${categoryImages[product.category?.toLowerCase()] || categoryImages[product.category] || categoryImages["Sofas"]})`,
                        maskSize: "contain",
                        maskPosition: "center",
                        maskRepeat: "no-repeat",
                    }} />
                )}
            </div>
            <div style={{ display: "flex", gap: 5, marginBottom: 8 }}>
                {product.colors.map((c, ci) => (
                    <div key={ci} style={{
                        width: 12, height: 12, borderRadius: "50%",
                        background: c,
                        border: "1.5px solid #e5e0d8",
                    }} />
                ))}
            </div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#1a1a2e", marginBottom: 2, fontFamily: "'Georgia', serif" }}>
                {product.name}
            </div>
            <div style={{ fontSize: 11, color: "#9b93b8", marginBottom: 5 }}>{product.category}</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#1a1a2e" }}>{product.price}</div>
        </motion.div>
    );
}

function ProductDetails({ productDetails }) {
    const router = useRouter();
    const { id, name, price, category, colors } = productDetails;

    const handleEditIn3D = () => {
        const query = new URLSearchParams({
            id: id || "",
            name: name || "Original Living Sofa",
            category: category || "Sofas",
            colors: JSON.stringify(colors || [])
        }).toString();
        router.push(`/editor?${query}`);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            style={{ display: "flex", gap: 32, alignItems: "flex-start" }}
        >
            {/* Left: description */}
            <div style={{ flex: 1.4 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 16 }}>
                    <h2 style={{ fontSize: 26, fontWeight: 700, color: "#1a1a2e", fontFamily: "'Georgia', serif" }}>
                        {name || "Original Living Sofa"}
                    </h2>
                    <span style={{ fontSize: 18, fontWeight: 600, color: "#1a1a2e", fontFamily: "'Georgia', serif" }}>
                        {price || "Rs.150,000"}
                    </span>
                </div>

                <p style={{ fontSize: 14, lineHeight: 1.75, color: "#4a4a5e", marginBottom: 22, maxWidth: 480 }}>
                    Customize this {category || 'item'} to perfectly match your space. Change materials, dimensions, and configure it directly in our 3D Editor.
                </p>

                <button
                    onClick={handleEditIn3D}
                    style={{
                        background: "#1a1a2e",
                        color: "#fff",
                        border: "none",
                        borderRadius: 8,
                        padding: "14px 28px",
                        fontSize: 15,
                        fontWeight: 600,
                        cursor: "pointer",
                        boxShadow: "0 4px 14px rgba(0,0,0,0.15)",
                        transition: "transform 0.2s, background 0.2s",
                        marginBottom: 28,
                        display: "flex",
                        alignItems: "center",
                        gap: 10
                    }}
                    onMouseOver={(e) => e.currentTarget.style.transform = "translateY(-2px)"}
                    onMouseOut={(e) => e.currentTarget.style.transform = "translateY(0)"}
                >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                        <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                        <line x1="12" y1="22.08" x2="12" y2="12"></line>
                    </svg>
                    Customize in 3D Editor
                </button>

                <div style={{ marginBottom: 8 }}>
                    <p style={{ fontSize: 14, fontWeight: 600, color: "#1a1a2e", marginBottom: 10 }}>Key Specifications</p>
                    <ul style={{ listStyle: "disc", paddingLeft: 18, margin: 0 }}>
                        {[
                            "Seating Capacity: 3-seater.",
                            "Dimensions: W220 × D95 × H85 cm",
                            "Frame: Solid hardwood with reinforced joints",
                            "Upholstery: Premium woven fabric — Beige",
                            "Legs: Metal with matte black finish",
                        ].map((spec, i) => (
                            <li key={i} style={{ fontSize: 14, color: "#4a4a5e", marginBottom: 5, lineHeight: 1.6 }}>
                                {spec}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Right: related products */}
            <div style={{ flex: 1, display: "flex", gap: 14, flexDirection: "column" }}>
                <div style={{ display: "flex", gap: 14 }}>
                    {relatedProducts.map((p, i) => (
                        <RelatedProductCard key={p.id} product={p} index={i} />
                    ))}
                </div>
            </div>
        </motion.div>
    );
}

function MaterialsContent() {
    const searchParams = useSearchParams();

    const idParam = searchParams.get('id');
    const nameParam = searchParams.get('name');
    const priceParam = searchParams.get('price');
    const categoryParam = searchParams.get('category');
    const colorsParam = searchParams.get('colors');

    const colorsList = colorsParam ? JSON.parse(colorsParam) : [];

    const dynamicColorOptions = colorsList.length > 0 ? colorsList.map((c, i) => ({
        id: `color-${i}`,
        color: c,
        sofaColor: c,
        label: `Color ${i + 1}`
    })) : defaultColorOptions;

    // Fallback selected to first colour, or the original default option if empty list parsing
    const [selectedColor, setSelectedColor] = useState(dynamicColorOptions[0]?.id || "cream");

    return (
        <div style={{ padding: "28px 32px", maxWidth: 1100, margin: "0 auto" }}>
            <WelcomeHeader />
            <ProductCarousel
                selectedColor={selectedColor}
                setSelectedColor={setSelectedColor}
                colorOptions={dynamicColorOptions}
                category={categoryParam}
            />
            <ProductDetails
                productDetails={{
                    id: idParam,
                    name: nameParam,
                    price: priceParam,
                    category: categoryParam,
                    colors: colorsList
                }}
            />
        </div>
    );
}

export default function MaterialsPage() {
    return (
        <SidebarLayout>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&display=swap');
                * { box-sizing: border-box; }
            `}</style>
            <Suspense fallback={<div style={{ padding: "40px", textAlign: "center" }}>Loading...</div>}>
                <MaterialsContent />
            </Suspense>
        </SidebarLayout>
    );
}