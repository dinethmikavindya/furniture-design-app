'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { motion, useMotionValue, useSpring } from 'framer-motion';

// Liquid glass hook
function useLiquidGlass(strength = 10) {
  const ref = useRef(null);
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const rotateX = useSpring(rawY, { stiffness: 80, damping: 12, mass: 0.8 });
  const rotateY = useSpring(rawX, { stiffness: 80, damping: 12, mass: 0.8 });
  const springScale = useSpring(1, { stiffness: 200, damping: 14, mass: 0.6 });
  const [hov, setHov] = useState(false);

  const onMove = useCallback((e) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    rawX.set(py * -strength);
    rawY.set(px * strength);
  }, [rawX, rawY, strength]);

  const onEnter = useCallback(() => {
    setHov(true);
    springScale.set(1.02);
  }, [springScale]);

  const onLeave = useCallback(() => {
    rawX.set(0);
    rawY.set(0);
    setHov(false);
    springScale.set(1);
  }, [rawX, rawY, springScale]);

  return {
    ref, rotateX, rotateY, hov, springScale,
    events: { onMouseMove: onMove, onMouseEnter: onEnter, onMouseLeave: onLeave },
  };
}

function GlassEdge({ hov, radius }) {
  return (
    <>
      <motion.div
        animate={{
          opacity: hov ? 1 : 0.35,
          boxShadow: hov
            ? '0 0 20px 3px rgba(255,255,255,0.45), 0 0 50px 6px rgba(139,92,246,0.12)'
            : '0 0 10px 1px rgba(255,255,255,0.20)',
        }}
        transition={{ duration: 0.4 }}
        style={{ position: 'absolute', inset: 0, zIndex: 5, borderRadius: radius, pointerEvents: 'none' }}
      />
      <motion.div
        animate={{ opacity: hov ? 1 : 0.3 }}
        transition={{ duration: 0.35 }}
        style={{
          position: 'absolute', inset: 0, zIndex: 6, borderRadius: radius, pointerEvents: 'none',
          border: '1.5px solid transparent',
          backgroundImage: 'linear-gradient(135deg, rgba(255,255,255,0.75) 0%, rgba(180,210,255,0.40) 18%, rgba(255,255,255,0.05) 45%, rgba(200,230,255,0.40) 90%, rgba(255,255,255,0.65) 100%)',
          backgroundOrigin: 'border-box',
          WebkitMask: 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'destination-out',
          maskComposite: 'exclude',
        }}
      />
    </>
  );
}

export default function LandingPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  const feature1 = useLiquidGlass(8);
  const feature2 = useLiquidGlass(8);
  const feature3 = useLiquidGlass(8);

  useEffect(() => {
    if (user && !loading) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f0eaff 0%, #e8f4ff 50%, #f0e8ff 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          style={{
            fontSize: 20,
            fontWeight: 600,
            background: 'linear-gradient(90deg, #8b5cf6, #ec4899, #60a5fa)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Loading...
        </motion.div>
      </div>
    );
  }

  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Afacad:wght@400;500;600;700;800;900&display=swap');
    * { box-sizing: border-box; margin: 0; padding: 0; }
    @keyframes shimmer { 0% { background-position: -300% center } 100% { background-position: 300% center } }
    @keyframes floatA { 0%, 100% { transform: translateY(0) rotate(0deg) } 50% { transform: translateY(-22px) rotate(3deg) } }
    @keyframes floatB { 0%, 100% { transform: translateY(0) rotate(0deg) } 50% { transform: translateY(18px) rotate(-3deg) } }
  `;

  return (
    <div style={{
      fontFamily: "'Afacad', 'Helvetica Neue', sans-serif",
      background: '#fafafa',
    }}>
      <style dangerouslySetInnerHTML={{ __html: css }} />

      {/* Minimal Nav */}
      <nav style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        background: 'rgba(255,255,255,0.95)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(0,0,0,0.05)',
      }}>
        <div style={{
          maxWidth: 1400,
          margin: '0 auto',
          padding: '0 60px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          height: 70,
        }}>
          <div style={{
            fontSize: 16,
            fontWeight: 700,
            color: '#8b5cf6',
            letterSpacing: '0.5px',
          }}>
            MAUVE
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <Link href="/login">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  padding: '10px 24px',
                  borderRadius: 50,
                  border: '1px solid #e0e0e0',
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: 'pointer',
                  color: '#333',
                  background: '#fff',
                  transition: 'all 0.2s',
                }}
              >
                Login
              </motion.button>
            </Link>
            <Link href="/signup">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  padding: '10px 28px',
                  borderRadius: 50,
                  border: 'none',
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: 'pointer',
                  color: '#fff',
                  background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)',
                  boxShadow: '0 4px 16px rgba(139,92,246,0.3)',
                  transition: 'all 0.2s',
                }}
              >
                Get Started
              </motion.button>
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO: MAUVE STUDIO with Image Through Text */}
      <section style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        paddingTop: 70,
      }}>
        {/* Background gradient */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(135deg, #f0eaff 0%, #e8f4ff 50%, #f0e8ff 100%)',
        }} />

        {/* Floating orbs */}
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
          <div style={{
            position: 'absolute', top: '10%', right: '10%', width: 400, height: 400, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(167,139,250,0.15) 0%, transparent 70%)',
            animation: 'floatA 12s ease-in-out infinite',
          }} />
          <div style={{
            position: 'absolute', bottom: '15%', left: '15%', width: 350, height: 350, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(96,165,250,0.12) 0%, transparent 70%)',
            animation: 'floatB 14s ease-in-out infinite',
          }} />
        </div>

        {/* TEXT WITH IMAGE MASK - BIGGER! */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, type: 'spring' }}
          style={{
            position: 'relative',
            zIndex: 10,
            textAlign: 'center',
          }}
        >
          <h1 style={{
            fontSize: 'clamp(100px, 16vw, 220px)', // MUCH BIGGER!
            fontWeight: 900,
            letterSpacing: '-0.04em',
            lineHeight: 0.85,
            
            // IMAGE SHOWS THROUGH TEXT
            background: 'url(https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1600&q=80) center/cover',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            
            // Text stroke for definition
            WebkitTextStroke: '3px rgba(139,92,246,0.15)',
            
            position: 'relative',
          }}>
            MAUVE
            <br />
            STUDIO
          </h1>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            style={{
              fontSize: 20,
              fontWeight: 500,
              color: '#9b93b8',
              marginTop: 50,
              maxWidth: 600,
              marginLeft: 'auto',
              marginRight: 'auto',
              lineHeight: 1.6,
            }}
          >
            Where creativity meets functionality. Design stunning furniture layouts with our intuitive 3D tool.
          </motion.p>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            style={{ marginTop: 40 }}
          >
            <Link href="/signup">
              <motion.button
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  padding: '18px 48px',
                  borderRadius: 50,
                  border: 'none',
                  fontSize: 18,
                  fontWeight: 700,
                  cursor: 'pointer',
                  color: '#fff',
                  background: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
                  boxShadow: '0 12px 36px rgba(109,40,217,0.4), inset 0 1px 0 rgba(255,255,255,0.2)',
                  transition: 'all 0.3s',
                }}
              >
                Start Creating
              </motion.button>
            </Link>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{
              position: 'absolute',
              bottom: -200,
              left: '50%',
              transform: 'translateX(-50%)',
              fontSize: 12,
              color: '#9b93b8',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <span>Scroll to explore</span>
            <span>↓</span>
          </motion.div>
        </motion.div>
      </section>

      {/* ABOUT US SECTION */}
      <section style={{
        padding: '120px 60px',
        background: '#fff',
        position: 'relative',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            style={{ textAlign: 'center', marginBottom: 80 }}
          >
            <h2 style={{
              fontSize: 'clamp(36px, 6vw, 56px)',
              fontWeight: 800,
              color: '#1e1040',
              marginBottom: 20,
            }}>
              About{' '}
              <span style={{
                background: 'linear-gradient(90deg, #8b5cf6, #ec4899)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
                Mauve Studio
              </span>
            </h2>
            <p style={{
              fontSize: 18,
              color: '#9b93b8',
              maxWidth: 700,
              margin: '0 auto',
              lineHeight: 1.7,
            }}>
              We're passionate about making interior design accessible to everyone. Our powerful 3D tool helps you visualize, plan, and create beautiful spaces with ease.
            </p>
          </motion.div>

          {/* Image Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 24,
          }}>
            {[
              'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800',
              'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800',
              'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800',
              'https://images.unsplash.com/photo-1567016432779-094069958ea5?w=800',
              'https://images.unsplash.com/photo-1540574163026-643ea20ade25?w=800',
              'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=800',
            ].map((img, i) => (
              <motion.div
                key={i}
                initial={{ y: 40, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                whileHover={{ scale: 1.05, y: -5 }}
                style={{
                  borderRadius: 20,
                  overflow: 'hidden',
                  aspectRatio: '4/3',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                }}
              >
                <img
                  src={img}
                  alt={`Furniture ${i + 1}`}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section style={{
        padding: '120px 60px',
        background: 'linear-gradient(135deg, #f0eaff 0%, #e8f4ff 100%)',
        position: 'relative',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <motion.h2
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            style={{
              fontSize: 'clamp(36px, 6vw, 56px)',
              fontWeight: 800,
              textAlign: 'center',
              color: '#1e1040',
              marginBottom: 80,
            }}
          >
            Powerful{' '}
            <span style={{
              background: 'linear-gradient(90deg, #8b5cf6, #60a5fa)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              Features
            </span>
          </motion.h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: 32,
          }}>
            {/* Feature 1 */}
            <motion.div
              ref={feature1.ref}
              {...feature1.events}
              initial={{ y: 40, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.6 }}
              style={{
                padding: 40,
                borderRadius: 24,
                background: 'rgba(255,255,255,0.6)',
                backdropFilter: 'blur(28px) saturate(180%)',
                boxShadow: feature1.hov
                  ? '0 22px 60px rgba(139,92,246,0.2)'
                  : '0 8px 28px rgba(120,80,220,0.08)',
                position: 'relative',
                rotateX: feature1.rotateX,
                rotateY: feature1.rotateY,
                scale: feature1.springScale,
                transformStyle: 'preserve-3d',
                transformPerspective: 800,
                transition: 'box-shadow 0.3s',
              }}
            >
              <GlassEdge hov={feature1.hov} radius={24} />
              <h3 style={{
                fontSize: 24,
                fontWeight: 700,
                color: '#1e1040',
                marginBottom: 16,
                position: 'relative',
                zIndex: 7,
              }}>
                3D Visualization
              </h3>
              <p style={{
                fontSize: 16,
                lineHeight: 1.7,
                color: '#9b93b8',
                position: 'relative',
                zIndex: 7,
              }}>
                Create realistic 3D furniture layouts with our intuitive drag-and-drop interface. See your designs come to life in real-time.
              </p>
            </motion.div>

            {/* Feature 2 */}
            <motion.div
              ref={feature2.ref}
              {...feature2.events}
              initial={{ y: 40, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.6 }}
              style={{
                padding: 40,
                borderRadius: 24,
                background: 'rgba(255,255,255,0.6)',
                backdropFilter: 'blur(28px) saturate(180%)',
                boxShadow: feature2.hov
                  ? '0 22px 60px rgba(96,165,250,0.2)'
                  : '0 8px 28px rgba(120,80,220,0.08)',
                position: 'relative',
                rotateX: feature2.rotateX,
                rotateY: feature2.rotateY,
                scale: feature2.springScale,
                transformStyle: 'preserve-3d',
                transformPerspective: 800,
                transition: 'box-shadow 0.3s',
              }}
            >
              <GlassEdge hov={feature2.hov} radius={24} />
              <h3 style={{
                fontSize: 24,
                fontWeight: 700,
                color: '#1e1040',
                marginBottom: 16,
                position: 'relative',
                zIndex: 7,
              }}>
                Precise Measurements
              </h3>
              <p style={{
                fontSize: 16,
                lineHeight: 1.7,
                color: '#9b93b8',
                position: 'relative',
                zIndex: 7,
              }}>
                Work with accurate dimensions to ensure your designs fit perfectly in any space. Customize every detail.
              </p>
            </motion.div>

            {/* Feature 3 */}
            <motion.div
              ref={feature3.ref}
              {...feature3.events}
              initial={{ y: 40, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.6 }}
              style={{
                padding: 40,
                borderRadius: 24,
                background: 'rgba(255,255,255,0.6)',
                backdropFilter: 'blur(28px) saturate(180%)',
                boxShadow: feature3.hov
                  ? '0 22px 60px rgba(236,72,153,0.2)'
                  : '0 8px 28px rgba(120,80,220,0.08)',
                position: 'relative',
                rotateX: feature3.rotateX,
                rotateY: feature3.rotateY,
                scale: feature3.springScale,
                transformStyle: 'preserve-3d',
                transformPerspective: 800,
                transition: 'box-shadow 0.3s',
              }}
            >
              <GlassEdge hov={feature3.hov} radius={24} />
              <h3 style={{
                fontSize: 24,
                fontWeight: 700,
                color: '#1e1040',
                marginBottom: 16,
                position: 'relative',
                zIndex: 7,
              }}>
                Save & Share
              </h3>
              <p style={{
                fontSize: 16,
                lineHeight: 1.7,
                color: '#9b93b8',
                position: 'relative',
                zIndex: 7,
              }}>
                Save your projects and share them with clients or collaborate with your team seamlessly.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section style={{
        padding: '120px 60px',
        background: '#fff',
        textAlign: 'center',
      }}>
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          style={{ maxWidth: 800, margin: '0 auto' }}
        >
          <h2 style={{
            fontSize: 'clamp(36px, 6vw, 56px)',
            fontWeight: 800,
            color: '#1e1040',
            marginBottom: 24,
          }}>
            Ready to Design Your{' '}
            <span style={{
              background: 'linear-gradient(90deg, #8b5cf6, #ec4899)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              Dream Space?
            </span>
          </h2>
          <p style={{
            fontSize: 20,
            color: '#9b93b8',
            marginBottom: 48,
            lineHeight: 1.7,
          }}>
            Join thousands of designers, architects, and homeowners who trust Mauve Studio.
          </p>
          <Link href="/signup">
            <motion.button
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.95 }}
              style={{
                padding: '18px 48px',
                borderRadius: 50,
                border: 'none',
                fontSize: 18,
                fontWeight: 700,
                cursor: 'pointer',
                color: '#fff',
                background: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
                boxShadow: '0 12px 36px rgba(109,40,217,0.4), inset 0 1px 0 rgba(255,255,255,0.2)',
                transition: 'all 0.3s',
              }}
            >
              Get Started for Free
            </motion.button>
          </Link>
        </motion.div>
      </section>

      {/* FOOTER */}
      <footer style={{
        padding: '60px',
        background: '#1e1040',
        color: '#fff',
        textAlign: 'center',
      }}>
        <div style={{ fontSize: 24, fontWeight: 700, marginBottom: 16 }}>
          MAUVE STUDIO
        </div>
        <p style={{ color: '#a99bc8', fontSize: 14 }}>
          © 2026 Mauve Studio. Designing the future of interiors.
        </p>
      </footer>
    </div>
  );
}
