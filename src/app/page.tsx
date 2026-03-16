'use client';
import { useEffect, useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { motion, useScroll, useTransform, useSpring, useMotionValue, AnimatePresence } from 'framer-motion';

/* ── Magnetic Button ── */
function MagneticButton({ children, style, onClick, href }) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 15 });
  const sy = useSpring(y, { stiffness: 200, damping: 15 });

  const onMove = (e) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    x.set((e.clientX - cx) * 0.35);
    y.set((e.clientY - cy) * 0.35);
  };
  const onLeave = () => { x.set(0); y.set(0); };

  const el = (
    <motion.button
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      onClick={onClick}
      style={{ ...style, x: sx, y: sy }}
      whileTap={{ scale: 0.95 }}
    >
      {children}
    </motion.button>
  );
  return href ? <Link href={href}>{el}</Link> : el;
}

/* ── Scroll reveal wrapper ── */
function Reveal({ children, delay = 0, y = 40, once = true }) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: '-80px' }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

/* ── Split text word reveal ── */
function SplitReveal({ text, style, delay = 0, stagger = 0.045 }) {
  const words = text.split(' ');
  return (
    <div style={{ ...style, overflow: 'hidden' }}>
      <motion.span style={{ display: 'flex', flexWrap: 'wrap', gap: '0 0.28em' }}>
        {words.map((word, i) => (
          <motion.span
            key={i}
            initial={{ y: '110%', opacity: 0 }}
            whileInView={{ y: '0%', opacity: 1 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.65, delay: delay + i * stagger, ease: [0.22, 1, 0.36, 1] }}
            style={{ display: 'inline-block' }}
          >
            {word}
          </motion.span>
        ))}
      </motion.span>
    </div>
  );
}

/* ── 3D Tilt Card ── */
function TiltCard({ children, style }) {
  const ref = useRef(null);
  const rotX = useSpring(useMotionValue(0), { stiffness: 120, damping: 18 });
  const rotY = useSpring(useMotionValue(0), { stiffness: 120, damping: 18 });
  const [hov, setHov] = useState(false);

  const onMove = (e) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    rotX.set(py * -12);
    rotY.set(px * 12);
  };
  const onLeave = () => { rotX.set(0); rotY.set(0); setHov(false); };

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={onLeave}
      style={{
        ...style,
        rotateX: rotX,
        rotateY: rotY,
        transformStyle: 'preserve-3d',
        transformPerspective: 800,
        transition: 'box-shadow 0.3s',
        boxShadow: hov ? '0 32px 70px rgba(139,92,246,0.22)' : style?.boxShadow || '0 8px 28px rgba(120,80,220,0.07)',
      }}
    >
      {children}
    </motion.div>
  );
}

/* ── Noise texture overlay ── */
function Noise() {
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 999, pointerEvents: 'none',
      opacity: 0.028,
      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
      backgroundRepeat: 'repeat',
      backgroundSize: '128px 128px',
    }} />
  );
}

/* ── Scroll progress bar ── */
function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  return (
    <motion.div
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, height: 2.5,
        background: 'linear-gradient(90deg,#8b5cf6,#ec4899,#60a5fa)',
        scaleX, transformOrigin: '0%',
        zIndex: 9999,
      }}
    />
  );
}

/* ── Floating cursor dot ── */
function CursorDot() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 300, damping: 28 });
  const sy = useSpring(y, { stiffness: 300, damping: 28 });
  const [visible, setVisible] = useState(false);
  const [big, setBig] = useState(false);

  useEffect(() => {
    const onMove = (e) => { x.set(e.clientX); y.set(e.clientY); setVisible(true); };
    const onLeave = () => setVisible(false);
    const onOver = (e) => setBig(!!e.target.closest('button,a,[data-cursor]'));
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseleave', onLeave);
    window.addEventListener('mouseover', onOver);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseleave', onLeave);
      window.removeEventListener('mouseover', onOver);
    };
  }, []);

  return (
    <motion.div
      style={{
        position: 'fixed', zIndex: 9998, pointerEvents: 'none',
        x: sx, y: sy,
        translateX: '-50%', translateY: '-50%',
        width: big ? 40 : 10,
        height: big ? 40 : 10,
        borderRadius: '50%',
        background: big ? 'transparent' : 'rgba(139,92,246,0.8)',
        border: big ? '1.5px solid rgba(139,92,246,0.7)' : 'none',
        opacity: visible ? 1 : 0,
        mixBlendMode: 'multiply',
        transition: 'width 0.2s, height 0.2s, background 0.2s, border 0.2s',
      }}
    />
  );
}

/* ── Animated counter ── */
function Counter({ to, suffix = '' }) {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  const seen = useRef(false);

  useEffect(() => {
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !seen.current) {
        seen.current = true;
        let start = 0;
        const dur = 1400;
        const step = (ts) => {
          if (!start) start = ts;
          const p = Math.min((ts - start) / dur, 1);
          setVal(Math.floor(p * to));
          if (p < 1) requestAnimationFrame(step);
          else setVal(to);
        };
        requestAnimationFrame(step);
      }
    }, { threshold: 0.5 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [to]);

  return <span ref={ref}>{val}{suffix}</span>;
}

/* ── Main ── */
export default function LandingPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const heroRef = useRef(null);
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 600], [0, -120]);
  const heroBlobScale = useTransform(scrollY, [0, 600], [1, 1.3]);
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0]);

  useEffect(() => {
    if (user) router.replace('/dashboard');
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, [user]);

  return (
    <div style={{ fontFamily: "'Afacad','Helvetica Neue',sans-serif", background: 'linear-gradient(145deg,#f0eaff 0%,#e8f4ff 45%,#f0e8ff 100%)', color: '#1e1040', overflowX: 'hidden', minHeight: '100vh', cursor: 'none' }}>
      <style suppressHydrationWarning>{`
        @import url('https://fonts.googleapis.com/css2?family=Afacad:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
        html{scroll-behavior:smooth;}
        ::-webkit-scrollbar{width:5px}::-webkit-scrollbar-thumb{background:#c4b5fd;border-radius:3px}
        @keyframes floatA{0%,100%{transform:translateY(0) scale(1)}50%{transform:translateY(-22px) scale(1.04)}}
        @keyframes floatB{0%,100%{transform:translateY(0) scale(1)}50%{transform:translateY(18px) scale(0.97)}}
        @keyframes floatC{0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)}}
        @keyframes shimmer{0%{background-position:-300% center}100%{background-position:300% center}}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.6;transform:scale(1.08)}}
        @keyframes gradShift{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
        * { cursor: none !important; }
      `}</style>

      <CursorDot />
      <ScrollProgress />
      <Noise />

      {/* ANIMATED BG ORBS */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        <motion.div style={{ scale: heroBlobScale }} >
          <div style={{ position: 'absolute', width: 700, height: 700, borderRadius: '50%', background: 'radial-gradient(circle,rgba(167,139,250,0.22) 0%,transparent 70%)', top: '-15%', right: '-10%', animation: 'floatA 18s ease-in-out infinite' }} />
        </motion.div>
        <div style={{ position: 'absolute', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle,rgba(96,165,250,0.16) 0%,transparent 70%)', bottom: '-10%', left: '-8%', animation: 'floatB 22s ease-in-out infinite' }} />
        <div style={{ position: 'absolute', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle,rgba(244,114,182,0.12) 0%,transparent 70%)', top: '40%', left: '35%', animation: 'floatA 28s ease-in-out infinite reverse' }} />
        {/* Grid */}
        <div style={{ position: 'absolute', inset: 0, opacity: 0.025, backgroundImage: 'linear-gradient(rgba(100,80,180,1) 1px,transparent 1px),linear-gradient(90deg,rgba(100,80,180,1) 1px,transparent 1px)', backgroundSize: '48px 48px' }} />
        {/* Radial vignette */}
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, transparent 40%, rgba(240,234,255,0.4) 100%)' }} />
      </div>

      {/* NAV */}
      <motion.nav
        animate={{
          background: scrolled ? 'rgba(240,234,255,0.88)' : 'transparent',
          backdropFilter: scrolled ? 'blur(24px) saturate(180%)' : 'none',
          borderBottomColor: scrolled ? 'rgba(196,181,253,0.35)' : 'transparent',
        }}
        style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, borderBottom: '1px solid transparent', padding: '0 60px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', transition: 'all 0.4s ease' }}
      >
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: [0.22,1,0.36,1] }}
          style={{ fontSize: 20, fontWeight: 700, color: '#1e1040', letterSpacing: '-0.3px' }}
        >
          Mauve<span style={{ color: '#8b5cf6' }}>.</span>
        </motion.div>

        {/* Nav links */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          style={{ display: 'flex', gap: 36 }}
        >
          {['Features', 'Shop', 'About'].map((l, i) => (
            <motion.a
              key={l}
              href={`#${l.toLowerCase()}`}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.06 }}
              whileHover={{ color: '#1e1040' }}
              style={{ fontSize: 15, color: '#6b5b9a', fontWeight: 500, textDecoration: 'none', position: 'relative', display: 'inline-block' }}
            >
              {l}
              <motion.span
                initial={{ scaleX: 0 }}
                whileHover={{ scaleX: 1 }}
                style={{ position: 'absolute', bottom: -2, left: 0, right: 0, height: 1.5, background: 'linear-gradient(90deg,#8b5cf6,#ec4899)', transformOrigin: 'left', display: 'block', borderRadius: 4 }}
              />
            </motion.a>
          ))}
        </motion.div>

        {/* Nav CTA */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          style={{ display: 'flex', gap: 10 }}
        >
          <Link href="/login">
            <motion.button
              whileHover={{ scale: 1.04, background: 'rgba(255,255,255,0.75)' }}
              whileTap={{ scale: 0.97 }}
              style={{ padding: '9px 22px', borderRadius: 12, border: '1.5px solid rgba(139,92,246,0.3)', background: 'rgba(255,255,255,0.5)', fontSize: 14, fontWeight: 500, color: '#1e1040', cursor: 'pointer', backdropFilter: 'blur(8px)', transition: 'all 0.2s' }}
            >Sign in</motion.button>
          </Link>
          <Link href="/signup">
            <motion.button
              whileHover={{ scale: 1.04, boxShadow: '0 8px 28px rgba(109,40,217,0.5)' }}
              whileTap={{ scale: 0.97 }}
              style={{ padding: '9px 22px', borderRadius: 12, border: 'none', background: 'linear-gradient(135deg,#8b5cf6,#6d28d9)', fontSize: 14, fontWeight: 600, color: '#fff', cursor: 'pointer', boxShadow: '0 4px 16px rgba(109,40,217,0.35)', transition: 'all 0.2s' }}
            >Get started</motion.button>
          </Link>
        </motion.div>
      </motion.nav>

      {/* ── HERO ── */}
      <section ref={heroRef} style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '100px 24px 60px', position: 'relative', zIndex: 1 }}>
        {/* Beta badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22,1,0.36,1] }}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.25)', borderRadius: 50, padding: '6px 18px', fontSize: 12, fontWeight: 600, color: '#7c3aed', marginBottom: 36, letterSpacing: '0.5px' }}
        >
          <motion.span
            animate={{ scale: [1,1.4,1], opacity: [1,0.5,1] }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{ width: 6, height: 6, borderRadius: '50%', background: '#8b5cf6', display: 'inline-block' }}
          />
          NOW IN BETA — FREE TO USE
        </motion.div>

        {/* Hero title with parallax */}
        <motion.div style={{ y: heroY, opacity: heroOpacity }}>
          <div style={{ lineHeight: 0.88, textAlign: 'center', userSelect: 'none', marginBottom: 28 }}>
            {/* MAUVE */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: 0 }}>
              {['M','A','U','V','E'].map((letter, i) => (
                <motion.span key={i}
                  initial={{ opacity: 0, y: 80, rotateX: -90, scale: 0.5 }}
                  animate={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
                  transition={{ delay: 0.1 + i * 0.08, duration: 0.7, type: 'spring', stiffness: 120, damping: 14 }}
                  whileHover={{ scale: 1.08, y: -8, zIndex: 2 }}
                  style={{
                    fontSize: 'clamp(90px,16vw,200px)', fontWeight: 900, letterSpacing: '-4px',
                    color: 'transparent', display: 'inline-block', position: 'relative', zIndex: 1,
                    backgroundImage: 'url(https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1400&q=80)',
                    backgroundSize: '500px 300px',
                    backgroundPositionX: `${-i * 80}px`,
                    backgroundPositionY: 'center',
                    WebkitBackgroundClip: 'text', backgroundClip: 'text',
                    transformOrigin: 'bottom center', transition: 'filter 0.2s',
                    filter: 'drop-shadow(0 4px 20px rgba(139,92,246,0.18))',
                  }}>{letter}</motion.span>
              ))}
            </div>
            {/* STUDIO */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: 0 }}>
              {['S','T','U','D','I','O'].map((letter, i) => (
                <motion.span key={i}
                  initial={{ opacity: 0, y: -80, rotateX: 90, scale: 0.5 }}
                  animate={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
                  transition={{ delay: 0.5 + i * 0.08, duration: 0.7, type: 'spring', stiffness: 120, damping: 14 }}
                  whileHover={{ scale: 1.08, y: 8, zIndex: 2 }}
                  style={{
                    fontSize: 'clamp(90px,16vw,200px)', fontWeight: 900, letterSpacing: '-4px',
                    color: 'transparent', display: 'inline-block', position: 'relative', zIndex: 1,
                    backgroundImage: 'url(https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=1400&q=80)',
                    backgroundSize: '600px 300px',
                    backgroundPositionX: `${-i * 90}px`,
                    backgroundPositionY: 'center',
                    WebkitBackgroundClip: 'text', backgroundClip: 'text',
                    transformOrigin: 'top center',
                    filter: 'drop-shadow(0 4px 20px rgba(96,165,250,0.18))',
                  }}>{letter}</motion.span>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.1 }}
          style={{ fontSize: 18, color: '#6b5b9a', maxWidth: 520, lineHeight: 1.75, marginBottom: 44, fontWeight: 400 }}
        >
          Plan your room in 2D, visualize in 3D, and shop real furniture — all in your browser. No downloads, no installs.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}
        >
          <MagneticButton href="/signup" style={{ padding: '14px 36px', borderRadius: 14, border: 'none', background: 'linear-gradient(135deg,#8b5cf6,#6d28d9)', color: '#fff', fontSize: 15, fontWeight: 700, cursor: 'pointer', boxShadow: '0 8px 28px rgba(109,40,217,0.4)', fontFamily: "'Afacad','Helvetica Neue',sans-serif" }}>
            Start designing — free
          </MagneticButton>
          <MagneticButton href="/login" style={{ padding: '14px 36px', borderRadius: 14, border: '1.5px solid rgba(139,92,246,0.3)', background: 'rgba(255,255,255,0.6)', color: '#1e1040', fontSize: 15, fontWeight: 600, cursor: 'pointer', backdropFilter: 'blur(12px)', fontFamily: "'Afacad','Helvetica Neue',sans-serif" }}>
            Sign in
          </MagneticButton>
        </motion.div>

        {/* Stats with counting animation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3, duration: 0.6 }}
          style={{ display: 'flex', gap: 56, marginTop: 72, flexWrap: 'wrap', justifyContent: 'center' }}
        >
          {[
            { val: 18, suffix: '+', label: 'Furniture pieces' },
            { val: null, valStr: '3D', label: 'Visualization' },
            { val: null, valStr: 'Free', label: 'To get started' },
          ].map(({ val, valStr, suffix = '', label }) => (
            <motion.div
              key={label}
              whileHover={{ scale: 1.08, y: -4 }}
              style={{ textAlign: 'center', cursor: 'default' }}
            >
              <div style={{ fontSize: 30, fontWeight: 700, color: '#1e1040', letterSpacing: '-1px' }}>
                {val !== null ? <Counter to={val} suffix={suffix} /> : valStr}
              </div>
              <div style={{ fontSize: 13, color: '#9b92c8', marginTop: 4 }}>{label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8 }}
          style={{ position: 'absolute', bottom: 40, left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}
        >
          <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: '2px', color: '#c4b5fd', textTransform: 'uppercase' }}>Scroll</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
            style={{ width: 1.5, height: 32, background: 'linear-gradient(180deg,#8b5cf6,transparent)', borderRadius: 4 }}
          />
        </motion.div>
      </section>

      {/* ── IMAGE STRIP ── */}
      <section style={{ padding: '0 60px 100px', position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16 }}>
          {[
            'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80',
            'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=600&q=80',
            'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&q=80',
            'https://images.unsplash.com/photo-1567016432779-094069958ea5?w=600&q=80',
          ].map((src, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ delay: i * 0.12, duration: 0.7, ease: [0.22,1,0.36,1] }}
              whileHover={{ y: -10, scale: 1.02 }}
              style={{ borderRadius: 24, overflow: 'hidden', aspectRatio: '4/3', background: 'rgba(255,255,255,0.3)', backdropFilter: 'blur(20px)', border: '1.5px solid rgba(255,255,255,0.6)', boxShadow: '0 8px 32px rgba(120,80,220,0.08)', transition: 'box-shadow 0.3s', position: 'relative' }}
            >
              <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.6s ease', display: 'block' }}
                onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.08)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
              />
              {/* Shimmer overlay on hover */}
              <motion.div
                initial={{ opacity: 0, x: '-100%' }}
                whileHover={{ opacity: 1, x: '200%' }}
                transition={{ duration: 0.7 }}
                style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg,transparent,rgba(255,255,255,0.25),transparent)', pointerEvents: 'none' }}
              />
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" style={{ padding: '80px 60px 100px', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <Reveal>
              <p style={{ fontSize: 12, fontWeight: 600, letterSpacing: '2px', color: '#8b5cf6', textTransform: 'uppercase', marginBottom: 16 }}>Features</p>
            </Reveal>
            <div style={{ overflow: 'hidden' }}>
              <SplitReveal
                text="Everything you need."
                delay={0.1}
                style={{ fontSize: 'clamp(32px,4.5vw,52px)', fontWeight: 700, letterSpacing: '-1.5px', color: '#1e1040', justifyContent: 'center' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(230px,1fr))', gap: 20 }}>
            {[
              { num: '01', title: '2D Floor Planning', desc: 'Draw your room, snap furniture to a precise grid, set exact dimensions.' },
              { num: '02', title: '3D Walkthrough', desc: 'Switch to 3D instantly. Orbit and zoom through your room in real time.' },
              { num: '03', title: 'Furniture Shop', desc: 'Browse real pieces, customize colors, drag straight into your design.' },
              { num: '04', title: 'Save and Share', desc: 'Cloud-saved projects. Share with clients or collaborators in one click.' },
            ].map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ delay: i * 0.1, duration: 0.7, ease: [0.22,1,0.36,1] }}
              >
                <TiltCard style={{ padding: '36px 28px', borderRadius: 24, background: 'rgba(255,255,255,0.45)', backdropFilter: 'blur(24px)', border: '1.5px solid rgba(255,255,255,0.7)', cursor: 'default', height: '100%' }}>
                  {/* Number */}
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 + i * 0.1, type: 'spring', stiffness: 200 }}
                    style={{ fontSize: 11, fontWeight: 700, color: '#c4b5fd', letterSpacing: '1.5px', marginBottom: 20 }}
                  >{f.num}</motion.div>
                  <h3 style={{ fontSize: 17, fontWeight: 600, color: '#1e1040', marginBottom: 12, letterSpacing: '-0.2px' }}>{f.title}</h3>
                  <p style={{ fontSize: 14, color: '#6b5b9a', lineHeight: 1.75 }}>{f.desc}</p>
                  {/* Bottom accent line */}
                  <motion.div
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + i * 0.1, duration: 0.6 }}
                    style={{ marginTop: 24, height: 2, background: 'linear-gradient(90deg,#8b5cf6,transparent)', borderRadius: 4, transformOrigin: 'left' }}
                  />
                </TiltCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section style={{ padding: '0 60px 100px', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <Reveal>
              <p style={{ fontSize: 12, fontWeight: 600, letterSpacing: '2px', color: '#8b5cf6', textTransform: 'uppercase', marginBottom: 16 }}>How it works</p>
            </Reveal>
            <SplitReveal
              text="Three steps to your dream room."
              delay={0.1}
              style={{ fontSize: 'clamp(32px,4.5vw,52px)', fontWeight: 700, letterSpacing: '-1.5px', color: '#1e1040', justifyContent: 'center' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20 }}>
            {[
              { n: '1', title: 'Set up your room', desc: 'Enter dimensions. Start blank or pick a template.' },
              { n: '2', title: 'Add furniture', desc: 'Browse the shop, pick colors, drag pieces into your layout.' },
              { n: '3', title: 'View and share', desc: 'Switch to 3D, save your project, share the link.' },
            ].map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 60, scale: 0.93 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ delay: i * 0.15, duration: 0.75, ease: [0.22,1,0.36,1] }}
                whileHover={{ y: -8 }}
                style={{ padding: '44px 36px', borderRadius: 24, background: i === 1 ? 'linear-gradient(135deg,rgba(139,92,246,0.85),rgba(109,40,217,0.9))' : 'rgba(255,255,255,0.45)', backdropFilter: 'blur(24px)', border: '1.5px solid rgba(255,255,255,0.6)', boxShadow: i === 1 ? '0 20px 50px rgba(109,40,217,0.35)' : '0 8px 28px rgba(120,80,220,0.07)', position: 'relative', overflow: 'hidden', cursor: 'default', transition: 'box-shadow 0.3s' }}
              >
                {/* Step number watermark */}
                <motion.div
                  initial={{ opacity: 0, scale: 2, rotate: -15 }}
                  whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + i * 0.1, duration: 0.6 }}
                  style={{ position: 'absolute', top: 20, right: 28, fontSize: 64, fontWeight: 900, color: i === 1 ? 'rgba(255,255,255,0.08)' : 'rgba(139,92,246,0.1)', lineHeight: 1, pointerEvents: 'none' }}
                >{s.n}</motion.div>

                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '1.5px', color: i === 1 ? 'rgba(255,255,255,0.5)' : '#c4b5fd', textTransform: 'uppercase', marginBottom: 20 }}>Step {s.n}</div>
                <h3 style={{ fontSize: 20, fontWeight: 600, color: i === 1 ? '#fff' : '#1e1040', marginBottom: 12 }}>{s.title}</h3>
                <p style={{ fontSize: 14, color: i === 1 ? 'rgba(255,255,255,0.65)' : '#6b5b9a', lineHeight: 1.75 }}>{s.desc}</p>

                {/* Connector dots between steps */}
                {i < 2 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.6 + i * 0.2 }}
                    style={{ position: 'absolute', top: '50%', right: -32, transform: 'translateY(-50%)', display: 'flex', gap: 4, zIndex: 2 }}
                  >
                    {[0,1,2].map(d => (
                      <motion.div
                        key={d}
                        animate={{ opacity: [0.3,1,0.3] }}
                        transition={{ duration: 1.4, repeat: Infinity, delay: d * 0.25 }}
                        style={{ width: 5, height: 5, borderRadius: '50%', background: '#8b5cf6' }}
                      />
                    ))}
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: '0 60px 120px', position: 'relative', zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.97 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, ease: [0.22,1,0.36,1] }}
          style={{ maxWidth: 1100, margin: '0 auto', borderRadius: 32, background: 'rgba(255,255,255,0.4)', backdropFilter: 'blur(32px)', border: '1.5px solid rgba(255,255,255,0.7)', boxShadow: '0 16px 56px rgba(120,80,220,0.1)', padding: '80px 60px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}
        >
          {/* Animated bg blob inside CTA */}
          <motion.div
            animate={{ x: [0,30,0], y: [0,-20,0], scale: [1,1.15,1] }}
            transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
            style={{ position: 'absolute', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle,rgba(139,92,246,0.12) 0%,transparent 70%)', top: '-50%', right: '-10%', pointerEvents: 'none' }}
          />
          <motion.div
            animate={{ x: [0,-20,0], y: [0,20,0] }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
            style={{ position: 'absolute', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle,rgba(96,165,250,0.1) 0%,transparent 70%)', bottom: '-30%', left: '-5%', pointerEvents: 'none' }}
          />

          <Reveal>
            <p style={{ fontSize: 12, fontWeight: 600, letterSpacing: '2px', color: '#8b5cf6', textTransform: 'uppercase', marginBottom: 24 }}>Get started today</p>
          </Reveal>

          <SplitReveal
            text="Ready to design your dream space?"
            delay={0.1}
            style={{ fontSize: 'clamp(32px,4.5vw,56px)', fontWeight: 700, letterSpacing: '-1.5px', color: '#1e1040', marginBottom: 20, justifyContent: 'center' }}
          />

          <Reveal delay={0.2}>
            <p style={{ fontSize: 17, color: '#6b5b9a', marginBottom: 44, lineHeight: 1.7 }}>
              No credit card. No downloads. Start in seconds, completely free.
            </p>
          </Reveal>

          <Reveal delay={0.3}>
            <MagneticButton
              href="/signup"
              style={{ padding: '15px 44px', borderRadius: 14, border: 'none', background: 'linear-gradient(135deg,#8b5cf6,#6d28d9)', color: '#fff', fontSize: 16, fontWeight: 700, cursor: 'pointer', boxShadow: '0 10px 32px rgba(109,40,217,0.4)', fontFamily: "'Afacad','Helvetica Neue',sans-serif", position: 'relative', zIndex: 1 }}
            >
              Create your free account
            </MagneticButton>
          </Reveal>
        </motion.div>
      </section>

      {/* ── FOOTER ── */}
      <motion.footer
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        style={{ padding: '36px 60px', borderTop: '1px solid rgba(196,181,253,0.25)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16, position: 'relative', zIndex: 1 }}
      >
        <motion.div whileHover={{ scale: 1.06 }} style={{ fontSize: 18, fontWeight: 700, color: '#1e1040' }}>
          Mauve<span style={{ color: '#8b5cf6' }}>.</span>
        </motion.div>
        <p style={{ fontSize: 13, color: '#9b92c8' }}>2026 Mauve Studio. All rights reserved.</p>
        <div style={{ display: 'flex', gap: 28 }}>
          {['Privacy', 'Terms', 'Contact'].map(l => (
            <motion.a
              key={l} href="#"
              whileHover={{ color: '#8b5cf6', y: -2 }}
              style={{ fontSize: 13, color: '#9b92c8', textDecoration: 'none', transition: 'color 0.2s, transform 0.2s', display: 'inline-block' }}
            >{l}</motion.a>
          ))}
        </div>
      </motion.footer>
    </div>
  );
}