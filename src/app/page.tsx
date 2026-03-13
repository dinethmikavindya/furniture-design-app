'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function LandingPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (user) router.replace('/dashboard');
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, [user]);

  return (
    <div style={{ fontFamily: "'Afacad','Helvetica Neue',sans-serif", background: 'linear-gradient(145deg,#f0eaff 0%,#e8f4ff 45%,#f0e8ff 100%)', color: '#1e1040', overflowX: 'hidden', minHeight: '100vh' }}>
      <style suppressHydrationWarning>{`
        @import url('https://fonts.googleapis.com/css2?family=Afacad:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
        html{scroll-behavior:smooth;}
        ::-webkit-scrollbar{width:5px}::-webkit-scrollbar-thumb{background:#c4b5fd;border-radius:3px}
        @keyframes floatA{0%,100%{transform:translateY(0) scale(1)}50%{transform:translateY(-22px) scale(1.04)}}
        @keyframes floatB{0%,100%{transform:translateY(0) scale(1)}50%{transform:translateY(18px) scale(0.97)}}
        @keyframes floatC{0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)}}
      `}</style>

      {/* FIXED BG ORBS */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', width: 700, height: 700, borderRadius: '50%', background: 'radial-gradient(circle,rgba(167,139,250,0.22) 0%,transparent 70%)', top: '-15%', right: '-10%', animation: 'floatA 18s ease-in-out infinite' }} />
        <div style={{ position: 'absolute', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle,rgba(96,165,250,0.16) 0%,transparent 70%)', bottom: '-10%', left: '-8%', animation: 'floatB 22s ease-in-out infinite' }} />
        <div style={{ position: 'absolute', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle,rgba(244,114,182,0.12) 0%,transparent 70%)', top: '40%', left: '35%', animation: 'floatA 28s ease-in-out infinite reverse' }} />
        <div style={{ position: 'absolute', inset: 0, opacity: 0.025, backgroundImage: 'linear-gradient(rgba(100,80,180,1) 1px,transparent 1px),linear-gradient(90deg,rgba(100,80,180,1) 1px,transparent 1px)', backgroundSize: '48px 48px' }} />

      </div>

      {/* NAV */}
      <motion.nav animate={{ background: scrolled ? 'rgba(240,234,255,0.85)' : 'transparent', backdropFilter: scrolled ? 'blur(20px)' : 'none', borderBottomColor: scrolled ? 'rgba(196,181,253,0.3)' : 'transparent' }}
        style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, borderBottom: '1px solid transparent', padding: '0 60px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontSize: 20, fontWeight: 700, color: '#1e1040', letterSpacing: '-0.3px' }}>
          Mauve<span style={{ color: '#8b5cf6' }}>.</span>
        </div>
        <div style={{ display: 'flex', gap: 36 }}>
          {['Features', 'Shop', 'About'].map(l => (
            <a key={l} href={`#${l.toLowerCase()}`} style={{ fontSize: 15, color: '#6b5b9a', fontWeight: 500, textDecoration: 'none', transition: 'color 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#1e1040')}
              onMouseLeave={e => (e.currentTarget.style.color = '#6b5b9a')}>{l}</a>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <Link href="/login">
            <button style={{ padding: '9px 22px', borderRadius: 12, border: '1.5px solid rgba(139,92,246,0.3)', background: 'rgba(255,255,255,0.5)', fontSize: 14, fontWeight: 500, color: '#1e1040', cursor: 'pointer', backdropFilter: 'blur(8px)' }}>
              Sign in
            </button>
          </Link>
          <Link href="/signup">
            <button style={{ padding: '9px 22px', borderRadius: 12, border: 'none', background: 'linear-gradient(135deg,#8b5cf6,#6d28d9)', fontSize: 14, fontWeight: 600, color: '#fff', cursor: 'pointer', boxShadow: '0 4px 16px rgba(109,40,217,0.35)' }}>
              Get started
            </button>
          </Link>
        </div>
      </motion.nav>

      {/* HERO */}
      <section style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '100px 24px 60px', position: 'relative', zIndex: 1 }}>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.25)', borderRadius: 50, padding: '6px 18px', fontSize: 12, fontWeight: 600, color: '#7c3aed', marginBottom: 36, letterSpacing: '0.5px' }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#8b5cf6', display: 'inline-block' }} />
          NOW IN BETA — FREE TO USE
        </motion.div>

        <div style={{ lineHeight: 0.88, textAlign: 'center', userSelect: 'none', marginBottom: 28 }}>
          {/* MAUVE — each letter animates in */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 0 }}>
            {['M','A','U','V','E'].map((letter, i) => (
              <motion.span key={i}
                initial={{ opacity: 0, y: 80, rotateX: -90, scale: 0.5 }}
                animate={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
                transition={{ delay: 0.1 + i * 0.08, duration: 0.6, type: 'spring', stiffness: 120, damping: 14 }}
                style={{
                  fontSize: 'clamp(90px,16vw,200px)', fontWeight: 900, letterSpacing: '-4px',
                  color: 'transparent', display: 'inline-block',
                  backgroundImage: 'url(https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1400&q=80)',
                  backgroundSize: '500px 300px',
                  backgroundPositionX: `${-i * 80}px`,
                  backgroundPositionY: 'center',
                  WebkitBackgroundClip: 'text', backgroundClip: 'text',
                  transformOrigin: 'bottom center',
                }}>{letter}</motion.span>
            ))}
          </div>
          {/* STUDIO — each letter animates in with slight delay after MAUVE */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 0 }}>
            {['S','T','U','D','I','O'].map((letter, i) => (
              <motion.span key={i}
                initial={{ opacity: 0, y: -80, rotateX: 90, scale: 0.5 }}
                animate={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
                transition={{ delay: 0.5 + i * 0.08, duration: 0.6, type: 'spring', stiffness: 120, damping: 14 }}
                style={{
                  fontSize: 'clamp(90px,16vw,200px)', fontWeight: 900, letterSpacing: '-4px',
                  color: 'transparent', display: 'inline-block',
                  backgroundImage: 'url(https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=1400&q=80)',
                  backgroundSize: '600px 300px',
                  backgroundPositionX: `${-i * 90}px`,
                  backgroundPositionY: 'center',
                  WebkitBackgroundClip: 'text', backgroundClip: 'text',
                  transformOrigin: 'top center',
                }}>{letter}</motion.span>
            ))}
          </div>
        </div>

        <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.25 }}
          style={{ fontSize: 18, color: '#6b5b9a', maxWidth: 520, lineHeight: 1.75, marginBottom: 44, fontWeight: 400 }}>
          Plan your room in 2D, visualize in 3D, and shop real furniture — all in your browser. No downloads, no installs.
        </motion.p>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.35 }}
          style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
          <Link href="/signup">
            <motion.button whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }}
              style={{ padding: '14px 36px', borderRadius: 14, border: 'none', background: 'linear-gradient(135deg,#8b5cf6,#6d28d9)', color: '#fff', fontSize: 15, fontWeight: 700, cursor: 'pointer', boxShadow: '0 8px 28px rgba(109,40,217,0.4)' }}>
              Start designing — free
            </motion.button>
          </Link>
          <Link href="/login">
            <motion.button whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }}
              style={{ padding: '14px 36px', borderRadius: 14, border: '1.5px solid rgba(139,92,246,0.3)', background: 'rgba(255,255,255,0.6)', color: '#1e1040', fontSize: 15, fontWeight: 600, cursor: 'pointer', backdropFilter: 'blur(12px)' }}>
              Sign in
            </motion.button>
          </Link>
        </motion.div>

        {/* Stats */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
          style={{ display: 'flex', gap: 56, marginTop: 72, flexWrap: 'wrap', justifyContent: 'center' }}>
          {[['18+', 'Furniture pieces'], ['3D', 'Visualization'], ['Free', 'To get started']].map(([val, label]) => (
            <div key={label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 30, fontWeight: 700, color: '#1e1040', letterSpacing: '-1px' }}>{val}</div>
              <div style={{ fontSize: 13, color: '#9b92c8', marginTop: 4 }}>{label}</div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* GLASS IMAGE CARDS STRIP */}
      <section style={{ padding: '0 60px 100px', position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16 }}>
          {[
            'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80',
            'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=600&q=80',
            'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&q=80',
            'https://images.unsplash.com/photo-1567016432779-094069958ea5?w=600&q=80',
          ].map((src, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.6 }}
              whileHover={{ y: -8, boxShadow: '0 28px 60px rgba(139,92,246,0.2)' }}
              style={{ borderRadius: 24, overflow: 'hidden', aspectRatio: '4/3', background: 'rgba(255,255,255,0.3)', backdropFilter: 'blur(20px)', border: '1.5px solid rgba(255,255,255,0.6)', boxShadow: '0 8px 32px rgba(120,80,220,0.08)', transition: 'box-shadow 0.3s' }}>
              <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </motion.div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" style={{ padding: '80px 60px 100px', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ textAlign: 'center', marginBottom: 64 }}>
            <p style={{ fontSize: 12, fontWeight: 600, letterSpacing: '2px', color: '#8b5cf6', textTransform: 'uppercase', marginBottom: 16 }}>Features</p>
            <h2 style={{ fontSize: 'clamp(32px,4.5vw,52px)', fontWeight: 700, letterSpacing: '-1.5px', color: '#1e1040' }}>Everything you need.</h2>
          </motion.div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(230px,1fr))', gap: 20 }}>
            {[
              { num: '01', title: '2D Floor Planning', desc: 'Draw your room, snap furniture to a precise grid, set exact dimensions.' },
              { num: '02', title: '3D Walkthrough', desc: 'Switch to 3D instantly. Orbit and zoom through your room in real time.' },
              { num: '03', title: 'Furniture Shop', desc: 'Browse real pieces, customize colors, drag straight into your design.' },
              { num: '04', title: 'Save and Share', desc: 'Cloud-saved projects. Share with clients or collaborators in one click.' },
            ].map((f, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                whileHover={{ y: -6, boxShadow: '0 24px 56px rgba(139,92,246,0.16)' }}
                style={{ padding: '36px 28px', borderRadius: 24, background: 'rgba(255,255,255,0.45)', backdropFilter: 'blur(24px)', border: '1.5px solid rgba(255,255,255,0.7)', boxShadow: '0 8px 28px rgba(120,80,220,0.07)', transition: 'all 0.3s', cursor: 'default' }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#c4b5fd', letterSpacing: '1.5px', marginBottom: 20 }}>{f.num}</div>
                <h3 style={{ fontSize: 17, fontWeight: 600, color: '#1e1040', marginBottom: 12, letterSpacing: '-0.2px' }}>{f.title}</h3>
                <p style={{ fontSize: 14, color: '#6b5b9a', lineHeight: 1.75 }}>{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ padding: '0 60px 100px', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ textAlign: 'center', marginBottom: 64 }}>
            <p style={{ fontSize: 12, fontWeight: 600, letterSpacing: '2px', color: '#8b5cf6', textTransform: 'uppercase', marginBottom: 16 }}>How it works</p>
            <h2 style={{ fontSize: 'clamp(32px,4.5vw,52px)', fontWeight: 700, letterSpacing: '-1.5px', color: '#1e1040' }}>Three steps to your dream room.</h2>
          </motion.div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20 }}>
            {[
              { n: '1', title: 'Set up your room', desc: 'Enter dimensions. Start blank or pick a template.' },
              { n: '2', title: 'Add furniture', desc: 'Browse the shop, pick colors, drag pieces into your layout.' },
              { n: '3', title: 'View and share', desc: 'Switch to 3D, save your project, share the link.' },
            ].map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }}
                style={{ padding: '44px 36px', borderRadius: 24, background: i === 1 ? 'linear-gradient(135deg,rgba(139,92,246,0.85),rgba(109,40,217,0.9))' : 'rgba(255,255,255,0.45)', backdropFilter: 'blur(24px)', border: '1.5px solid rgba(255,255,255,0.6)', boxShadow: i === 1 ? '0 20px 50px rgba(109,40,217,0.35)' : '0 8px 28px rgba(120,80,220,0.07)', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 20, right: 28, fontSize: 64, fontWeight: 900, color: i === 1 ? 'rgba(255,255,255,0.08)' : 'rgba(139,92,246,0.1)', lineHeight: 1 }}>{s.n}</div>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '1.5px', color: i === 1 ? 'rgba(255,255,255,0.5)' : '#c4b5fd', textTransform: 'uppercase', marginBottom: 20 }}>Step {s.n}</div>
                <h3 style={{ fontSize: 20, fontWeight: 600, color: i === 1 ? '#fff' : '#1e1040', marginBottom: 12 }}>{s.title}</h3>
                <p style={{ fontSize: 14, color: i === 1 ? 'rgba(255,255,255,0.65)' : '#6b5b9a', lineHeight: 1.75 }}>{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '0 60px 120px', position: 'relative', zIndex: 1 }}>
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          style={{ maxWidth: 1100, margin: '0 auto', borderRadius: 32, background: 'rgba(255,255,255,0.4)', backdropFilter: 'blur(32px)', border: '1.5px solid rgba(255,255,255,0.7)', boxShadow: '0 16px 56px rgba(120,80,220,0.1)', padding: '80px 60px', textAlign: 'center' }}>
          <p style={{ fontSize: 12, fontWeight: 600, letterSpacing: '2px', color: '#8b5cf6', textTransform: 'uppercase', marginBottom: 24 }}>Get started today</p>
          <h2 style={{ fontSize: 'clamp(32px,4.5vw,56px)', fontWeight: 700, letterSpacing: '-1.5px', color: '#1e1040', marginBottom: 20 }}>
            Ready to design your dream space?
          </h2>
          <p style={{ fontSize: 17, color: '#6b5b9a', marginBottom: 44, lineHeight: 1.7 }}>
            No credit card. No downloads. Start in seconds, completely free.
          </p>
          <Link href="/signup">
            <motion.button whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }}
              style={{ padding: '15px 44px', borderRadius: 14, border: 'none', background: 'linear-gradient(135deg,#8b5cf6,#6d28d9)', color: '#fff', fontSize: 16, fontWeight: 700, cursor: 'pointer', boxShadow: '0 10px 32px rgba(109,40,217,0.4)' }}>
              Create your free account
            </motion.button>
          </Link>
        </motion.div>
      </section>

      {/* FOOTER */}
      <footer style={{ padding: '36px 60px', borderTop: '1px solid rgba(196,181,253,0.25)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16, position: 'relative', zIndex: 1 }}>
        <div style={{ fontSize: 18, fontWeight: 700, color: '#1e1040' }}>Mauve<span style={{ color: '#8b5cf6' }}>.</span></div>
        <p style={{ fontSize: 13, color: '#9b92c8' }}>2026 Mauve Studio. All rights reserved.</p>
        <div style={{ display: 'flex', gap: 28 }}>
          {['Privacy', 'Terms', 'Contact'].map(l => (
            <a key={l} href="#" style={{ fontSize: 13, color: '#9b92c8', textDecoration: 'none' }}>{l}</a>
          ))}
        </div>
      </footer>
    </div>
  );
}
