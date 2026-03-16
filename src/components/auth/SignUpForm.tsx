'use client';

import { signupUser } from '@/lib/api';
import { useState, useRef, useCallback, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';

/* ─── Architectural Pendant Lamp (same as login) ─── */
function PendantLamp({ isOn, onToggle }) {
  const isDragging = useRef(false);
  const startY = useRef(0);
  const currentPull = useRef(0);
  const pullY = useMotionValue(0);
  const springY = useSpring(pullY, { stiffness: 380, damping: 28 });
  const cordLength = useTransform(springY, [0, 72], [52, 110]);
  const swingX = useSpring(useMotionValue(0), { stiffness: 60, damping: 12 });

  const onPointerDown = useCallback((e) => {
    isDragging.current = true;
    startY.current = e.clientY;
    e.currentTarget.setPointerCapture(e.pointerId);
    swingX.set(-3);
    setTimeout(() => swingX.set(0), 200);
  }, []);

  const onPointerMove = useCallback((e) => {
    if (!isDragging.current) return;
    const dy = Math.max(0, Math.min(72, e.clientY - startY.current));
    currentPull.current = dy;
    pullY.set(dy);
  }, []);

  const onPointerUp = useCallback(() => {
    if (!isDragging.current) return;
    isDragging.current = false;
    if (currentPull.current > 32) onToggle();
    pullY.set(0);
    currentPull.current = 0;
    swingX.set(4);
    setTimeout(() => swingX.set(-2), 180);
    setTimeout(() => swingX.set(1), 340);
    setTimeout(() => swingX.set(0), 500);
  }, [onToggle]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', userSelect: 'none' }}>
      {/* Ceiling mount */}
      <div style={{ width: 28, height: 4, background: isOn ? 'rgba(200,185,220,0.5)' : 'rgba(80,60,120,0.5)', borderRadius: '0 0 3px 3px', transition: 'background 1s' }} />

      <motion.div style={{ x: swingX, display: 'flex', flexDirection: 'column', alignItems: 'center', transformOrigin: 'top center' }}>
        {/* Wire */}
        <div style={{ width: 1, height: 28, background: isOn ? 'rgba(160,140,200,0.45)' : 'rgba(60,40,100,0.6)', transition: 'background 1s' }} />

        {/* Shade */}
        <div style={{ position: 'relative' }}>
          <AnimatePresence>
            {isOn && (
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.6 }}
                style={{ position: 'absolute', top: '30%', left: '50%', transform: 'translate(-50%,-50%)', width: 80, height: 80, borderRadius: '50%', background: 'radial-gradient(circle,rgba(255,245,210,0.5) 0%,transparent 70%)', pointerEvents: 'none', zIndex: 0 }}
              />
            )}
          </AnimatePresence>

          <svg width="64" height="50" viewBox="0 0 64 50" fill="none" style={{ position: 'relative', zIndex: 1, display: 'block' }}>
            <path d="M 22 6 L 4 46 L 60 46 L 42 6 Z"
              fill={isOn ? 'rgba(255,252,240,0.92)' : 'rgba(28,18,55,0.88)'}
              stroke={isOn ? 'rgba(200,185,160,0.5)' : 'rgba(100,80,160,0.4)'}
              strokeWidth="1" style={{ transition: 'fill 1s, stroke 1s' }} />
            <path d="M 23 9 L 7 44 L 57 44 L 41 9 Z"
              fill={isOn ? 'rgba(255,248,220,0.4)' : 'rgba(50,30,90,0.4)'}
              style={{ transition: 'fill 1s' }} />
            <rect x="20" y="3" width="24" height="5" rx="2.5"
              fill={isOn ? 'rgba(180,160,120,0.7)' : 'rgba(80,60,140,0.7)'}
              style={{ transition: 'fill 1s' }} />
            <rect x="2" y="44" width="60" height="4" rx="2"
              fill={isOn ? 'rgba(160,140,100,0.5)' : 'rgba(80,60,140,0.5)'}
              style={{ transition: 'fill 1s' }} />
            <circle cx="32" cy="28" r="6"
              fill={isOn ? 'rgba(255,240,180,0.95)' : 'rgba(60,40,100,0.6)'}
              style={{ transition: 'fill 0.8s' }} />
            {isOn && <circle cx="32" cy="28" r="9" fill="rgba(255,245,200,0.22)" />}
            <path d="M 29 26 Q 32 24 35 26 Q 32 30 29 26 Z"
              stroke={isOn ? 'rgba(255,200,80,0.9)' : 'rgba(100,80,160,0.4)'}
              strokeWidth="0.8" fill="none" style={{ transition: 'stroke 0.8s' }} />
          </svg>
        </div>

        {/* Pull cord */}
        <motion.div
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'ns-resize', touchAction: 'none' }}
        >
          <motion.div style={{ width: 1, background: isOn ? 'rgba(160,140,100,0.6)' : 'rgba(100,80,160,0.5)', height: cordLength, transition: 'background 1s' }} />
          <motion.div
            style={{ y: springY }}
            animate={{ boxShadow: isOn ? '0 0 0 2px rgba(200,160,60,0.4)' : '0 0 0 2px rgba(139,92,246,0.3)' }}
            transition={{ duration: 0.5 }}
            whileHover={{ scale: 1.4 }}
          >
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: isOn ? '#c8a840' : '#6d28d9', transition: 'background 0.8s' }} />
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Light cone */}
      <AnimatePresence>
        {isOn && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            style={{ position: 'absolute', top: 58, left: '50%', transform: 'translateX(-50%)', width: 220, height: 200, pointerEvents: 'none', zIndex: 0, background: 'conic-gradient(from 260deg at 50% 0%, transparent 0deg, rgba(255,245,200,0.12) 20deg, rgba(255,245,200,0.06) 40deg, transparent 40deg)' }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Main ─── */
export default function SignUpForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [lampOn, setLampOn] = useState(false);
  const [hintDone, setHintDone] = useState(false);

  const { signup, login, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => { if (lampOn) setHintDone(true); }, [lampOn]);

  /* ── ALL ORIGINAL LOGIC — UNTOUCHED ── */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) { setError('Passwords do not match'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters'); return; }
    if (!email.includes('@')) { setError('Please enter a valid email address'); return; }
    if (!name.trim()) { setError('Name is required'); return; }
    try {
      const data = await signupUser(name, email, password);
      if (data.success) {
        await login(email, password);
        setEmail(''); setPassword(''); setConfirmPassword(''); setName('');
        router.push('/dashboard');
      } else {
        setError(data.message || 'Signup failed');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Connection failed';
      setError(errorMessage);
    }
  };

  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Afacad:ital,wght@0,400;0,500;0,600;0,700;0,800&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    @keyframes shimmer { 0%{background-position:-300% center} 100%{background-position:300% center} }
    @keyframes floatA { 0%,100%{transform:translateY(0) scale(1)} 50%{transform:translateY(-24px) scale(1.04)} }
    @keyframes floatB { 0%,100%{transform:translateY(0)} 50%{transform:translateY(18px)} }

    .signup-input {
      width:100%; padding:13px 18px; border-radius:10px;
      font-family:'Afacad',sans-serif; font-size:14px; font-weight:500;
      outline:none; transition:all 0.22s; box-sizing:border-box;
    }
    .signup-input::placeholder { color:rgba(155,147,184,0.55); }
    .signup-input:focus { transform:translateY(-1px); }
    .signup-link { color:#8b5cf6; font-weight:700; text-decoration:none; }
    .signup-link:hover { opacity:0.8; }
    ::-webkit-scrollbar { width:4px; }
    ::-webkit-scrollbar-thumb { background:rgba(196,176,240,0.4); border-radius:4px; }
    @media (max-width:768px) { .hide-mobile { display:none !important; } }
  `;

  const light = lampOn;
  const cardBg      = light ? 'rgba(255,255,255,0.28)'  : 'rgba(12,8,28,0.72)';
  const cardBorder  = light ? 'rgba(255,255,255,0.75)'  : 'rgba(80,60,140,0.35)';
  const cardShadow  = light
    ? '0 40px 100px rgba(120,80,220,0.12), 0 1px 0 rgba(255,255,255,0.9) inset'
    : '0 40px 100px rgba(0,0,0,0.5), 0 1px 0 rgba(100,80,160,0.2) inset';
  const textPrimary = light ? '#1a0f3c' : '#ede8ff';
  const textSecond  = light ? '#7b6da8' : '#6b5b95';
  const labelColor  = light ? '#9b93b8' : '#6b5b95';
  const inputBg     = light ? 'rgba(255,255,255,0.45)' : 'rgba(20,12,50,0.55)';
  const inputBorder = light ? 'rgba(200,185,230,0.6)'  : 'rgba(80,60,140,0.4)';
  const inputColor  = light ? '#1a0f3c' : '#ede8ff';

  const labelStyle = {
    display: 'block' as const,
    fontSize: 10.5,
    fontWeight: 700,
    color: labelColor,
    marginBottom: 6,
    textTransform: 'uppercase' as const,
    letterSpacing: '1px',
    transition: 'color 1s',
  };

  const fields = [
    { id: 'name',            label: 'Full Name',        type: 'text',     value: name,            set: setName,            placeholder: 'Alex Johnson',      delay: 0.15, minLength: undefined },
    { id: 'email',           label: 'Email',            type: 'email',    value: email,           set: setEmail,           placeholder: 'you@example.com',   delay: 0.20, minLength: undefined },
    { id: 'password',        label: 'Password',         type: 'password', value: password,        set: setPassword,        placeholder: 'Min. 6 characters', delay: 0.25, minLength: 6 },
    { id: 'confirmPassword', label: 'Confirm Password', type: 'password', value: confirmPassword, set: setConfirmPassword, placeholder: 'Repeat password',   delay: 0.30, minLength: 6 },
  ];

  return (
    <div style={{
      minHeight: '100vh', display: 'flex',
      fontFamily: "'Afacad','Helvetica Neue',sans-serif",
      position: 'relative', overflow: 'hidden',
      transition: 'background 1.4s cubic-bezier(0.4,0,0.2,1)',
      background: light
        ? 'linear-gradient(135deg,#f0eaff 0%,#e8f4ff 50%,#f0e8ff 100%)'
        : 'linear-gradient(145deg,#0c0820 0%,#080514 50%,#0c0820 100%)',
    }}>
      <style dangerouslySetInnerHTML={{ __html: css }} />

      {/* ── Background ── */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        <motion.div animate={{ opacity: light ? 1 : 0.12 }} transition={{ duration: 1.4 }}>
          <div style={{ position: 'absolute', top: '-14%', left: '-10%', width: 560, height: 560, borderRadius: '50%', background: 'radial-gradient(circle,rgba(167,139,250,0.28) 0%,transparent 68%)', animation: 'floatA 18s ease-in-out infinite' }} />
          <div style={{ position: 'absolute', bottom: '-8%', right: '-8%', width: 480, height: 480, borderRadius: '50%', background: 'radial-gradient(circle,rgba(96,165,250,0.20) 0%,transparent 68%)', animation: 'floatB 22s ease-in-out infinite' }} />
          <div style={{ position: 'absolute', top: '35%', left: '28%', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle,rgba(244,114,182,0.11) 0%,transparent 68%)', animation: 'floatA 26s ease-in-out infinite 2s' }} />
        </motion.div>

        {/* Stars */}
        <AnimatePresence>
          {!light && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1 }} style={{ position: 'absolute', inset: 0 }}>
              {Array.from({ length: 35 }).map((_, i) => (
                <motion.div key={i}
                  animate={{ opacity: [0.2, 0.7, 0.2] }}
                  transition={{ duration: 2 + Math.random() * 2, repeat: Infinity, delay: Math.random() * 4 }}
                  style={{ position: 'absolute', width: Math.random() < 0.2 ? 2 : 1, height: Math.random() < 0.2 ? 2 : 1, borderRadius: '50%', background: '#fff', top: `${Math.random() * 70}%`, left: `${Math.random() * 100}%` }}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Grid */}
        <motion.div animate={{ opacity: light ? 0.022 : 0.05 }} transition={{ duration: 1.2 }}
          style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(139,92,246,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(139,92,246,0.03) 1px,transparent 1px)', backgroundSize: '44px 44px' }} />

        {/* Warm floor glow */}
        <AnimatePresence>
          {light && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1.2 }}
              style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: 700, height: 280, background: 'radial-gradient(ellipse at bottom center,rgba(255,240,180,0.07) 0%,transparent 65%)' }} />
          )}
        </AnimatePresence>
      </div>

      {/* ── Left panel — editorial copy ── */}
      <motion.div
        className="hide-mobile"
        initial={{ opacity: 0, x: -24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, delay: 0.3, ease: [0.22,1,0.36,1] }}
        style={{
          flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center',
          padding: '60px 64px', position: 'relative', zIndex: 5,
          borderRight: light ? '1px solid rgba(200,185,230,0.2)' : '1px solid rgba(80,60,140,0.18)',
          transition: 'border 1.2s',
        }}
      >
        <div style={{ maxWidth: 340 }}>
          <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.4px', color: light ? '#1a0f3c' : '#ede8ff', marginBottom: 48, transition: 'color 1s' }}>
            Mauve<span style={{ color: '#8b5cf6' }}>.</span>
          </div>

          <div style={{ overflow: 'hidden', marginBottom: 16 }}>
            <motion.h2
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.7, ease: [0.22,1,0.36,1] }}
              style={{ fontSize: 'clamp(26px,2.8vw,38px)', fontWeight: 700, lineHeight: 1.16, letterSpacing: '-1px', color: light ? '#1a0f3c' : '#ede8ff', margin: 0, transition: 'color 1s' }}
            >
              Your dream room<br />
              <span style={{ background: 'linear-gradient(90deg,#8b5cf6,#60a5fa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                starts here.
              </span>
            </motion.h2>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65, duration: 0.6 }}
            style={{ fontSize: 14.5, color: light ? '#7b6da8' : '#6b5b95', lineHeight: 1.8, margin: '0 0 44px', transition: 'color 1s' }}
          >
            Create your free account and start designing in minutes. No credit card required.
          </motion.p>

          {['Free to get started', 'Save unlimited projects', '2D + 3D design tools', 'Real furniture catalog'].map((item, i) => (
            <motion.div key={item}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 + i * 0.08, duration: 0.5 }}
              style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 11 }}
            >
              <div style={{ width: 5, height: 5, borderRadius: '50%', background: 'linear-gradient(135deg,#8b5cf6,#60a5fa)', flexShrink: 0 }} />
              <span style={{ fontSize: 13, color: light ? '#6b5b9a' : '#6b5b95', fontWeight: 500, transition: 'color 1s' }}>{item}</span>
            </motion.div>
          ))}

          {/* Already have account */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: 1.1 }}
            style={{ marginTop: 40, paddingTop: 24, borderTop: light ? '1px solid rgba(200,185,230,0.25)' : '1px solid rgba(80,60,140,0.2)', transition: 'border 1s' }}
          >
            <span style={{ fontSize: 13, color: light ? '#9b93b8' : '#6b5b95', transition: 'color 1s' }}>
              Already have an account?{' '}
            </span>
            <Link href="/login" style={{ color: '#8b5cf6', fontWeight: 700, textDecoration: 'none', fontSize: 13 }}>Sign in</Link>
          </motion.div>
        </div>
      </motion.div>

      {/* ── Right panel — signup card ── */}
      <div style={{ width: 'min(100%,480px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 32px', position: 'relative', zIndex: 10, flexShrink: 0 }}>
        <div style={{ width: '100%', maxWidth: 400 }}>

          {/* Lamp + hint */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: -2, position: 'relative', zIndex: 15 }}>
            <PendantLamp isOn={lampOn} onToggle={() => setLampOn(v => !v)} />
            <AnimatePresence>
              {!hintDone && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ delay: 1.4, duration: 0.5 }}
                  style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 6 }}
                >
                  <div style={{ width: 16, height: 1, background: light ? 'rgba(139,92,246,0.35)' : 'rgba(167,139,250,0.55)', borderRadius: 4 }} />
                  <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: '1.2px', textTransform: 'uppercase' as const, color: light ? '#9b93b8' : '#a78bfa', transition: 'color 1s' }}>
                    pull to illuminate
                  </span>
                  <div style={{ width: 16, height: 1, background: light ? 'rgba(139,92,246,0.35)' : 'rgba(167,139,250,0.55)', borderRadius: 4 }} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Card */}
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: 'spring', stiffness: 180, damping: 24, delay: 0.2 }}
            style={{
              width: '100%', borderRadius: 20,
              background: cardBg,
              backdropFilter: 'blur(48px) saturate(220%) brightness(1.06)',
              WebkitBackdropFilter: 'blur(48px) saturate(220%) brightness(1.06)',
              border: `1px solid ${cardBorder}`,
              boxShadow: cardShadow,
              padding: '28px 32px 28px',
              position: 'relative', overflow: 'hidden',
              transition: 'background 1.2s, border 1.2s, box-shadow 1.2s',
            }}
          >
            {/* Glass rim — only when lit */}
            <AnimatePresence>
              {light && (
                <motion.div
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  style={{ position: 'absolute', inset: 0, borderRadius: 20, pointerEvents: 'none', border: '1.5px solid transparent', backgroundImage: `linear-gradient(135deg, rgba(255,255,255,0.82) 0%, rgba(180,210,255,0.40) 18%, rgba(255,255,255,0.06) 38%, rgba(255,200,240,0.14) 58%, rgba(255,255,255,0.04) 72%, rgba(200,230,255,0.45) 90%, rgba(255,255,255,0.72) 100%)`, backgroundOrigin: 'border-box', WebkitMask: 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)', WebkitMaskComposite: 'destination-out', maskComposite: 'exclude' }}
                />
              )}
            </AnimatePresence>

            {/* Card header */}
            <div style={{ marginBottom: 20 }}>
              {/* Logo icon + name */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <div style={{ width: 34, height: 34, borderRadius: 10, background: 'linear-gradient(135deg,#8b5cf6,#6d28d9)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(109,40,217,0.32)', flexShrink: 0 }}>
                  <span style={{ color: '#fff', fontSize: 14, filter: 'brightness(0) invert(1)' }}>✦</span>
                </div>
                <div>
                  <div style={{ fontSize: 17, fontWeight: 800, letterSpacing: '-0.3px', color: textPrimary, lineHeight: 1, transition: 'color 1s' }}>
                    Create account
                    <span style={{ background: 'linear-gradient(90deg,#8b5cf6,#60a5fa,#ec4899,#8b5cf6)', backgroundSize: '300% auto', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', animation: 'shimmer 2.8s linear infinite' }}>.</span>
                  </div>
                  <div style={{ fontSize: 12, color: textSecond, fontWeight: 400, marginTop: 2, transition: 'color 1s' }}>
                    {light ? 'Join Mauve Studio today' : 'Turn on the light to begin'}
                  </div>
                </div>
              </div>
              <div style={{ height: 1, background: light ? 'rgba(200,185,230,0.25)' : 'rgba(80,60,140,0.2)', transition: 'background 1s' }} />
            </div>

            {/* Form */}
            <motion.div animate={{ opacity: light ? 1 : 0.42, filter: light ? 'none' : 'blur(0.3px)' }} transition={{ duration: 0.9 }}>
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {fields.map(f => (
                  <motion.div key={f.id}
                    initial={{ y: 14, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: f.delay, type: 'spring', stiffness: 120, damping: 18 }}
                  >
                    <label htmlFor={f.id} style={labelStyle}>{f.label}</label>
                    <input
                      className="signup-input"
                      type={f.type} id={f.id} value={f.value}
                      onChange={(e) => f.set(e.target.value)}
                      placeholder={f.placeholder} required
                      minLength={f.minLength}
                      style={{ background: inputBg, border: `1.5px solid ${inputBorder}`, color: inputColor, backdropFilter: 'blur(12px)', boxShadow: light ? '0 2px 10px rgba(120,80,220,0.06), inset 0 1px 0 rgba(255,255,255,0.8)' : '0 2px 10px rgba(0,0,0,0.15), inset 0 1px 0 rgba(100,80,160,0.1)' }}
                    />
                  </motion.div>
                ))}

                {/* Error */}
                {error && (
                  <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
                    style={{ padding: '10px 14px', borderRadius: 10, background: 'rgba(254,226,226,0.70)', backdropFilter: 'blur(12px)', border: '1px solid rgba(252,165,165,0.5)', fontSize: 13, color: '#dc2626', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 14 }}>⚠</span> {error}
                  </motion.div>
                )}

                {/* Submit */}
                <motion.div
                  initial={{ y: 14, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.35, type: 'spring', stiffness: 120, damping: 18 }}
                  style={{ marginTop: 4 }}
                >
                  <motion.button
                    type="submit" disabled={isLoading}
                    whileHover={!isLoading ? { scale: 1.015, y: -1 } : {}}
                    whileTap={!isLoading ? { scale: 0.985 } : {}}
                    style={{
                      width: '100%', padding: '13px', borderRadius: 10, border: 'none',
                      fontFamily: "'Afacad',sans-serif", fontSize: 14, fontWeight: 800, color: '#fff',
                      cursor: isLoading ? 'not-allowed' : 'pointer',
                      background: isLoading ? 'linear-gradient(135deg,#c4b5fd,#a78bfa)' : 'linear-gradient(135deg,#8b5cf6 0%,#6d28d9 100%)',
                      boxShadow: isLoading ? 'none' : (light ? '0 8px 24px rgba(109,40,217,0.35), inset 0 1px 0 rgba(255,255,255,0.22)' : '0 4px 14px rgba(109,40,217,0.18)'),
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                      position: 'relative', overflow: 'hidden', letterSpacing: '0.2px',
                      transition: 'box-shadow 1s, background 0.3s',
                    }}
                  >
                    <div style={{ position: 'absolute', top: 0, left: '10%', right: '10%', height: '50%', background: 'linear-gradient(180deg,rgba(255,255,255,0.18) 0%,transparent 100%)', borderRadius: '10px 10px 50% 50%', pointerEvents: 'none' }} />
                    <span style={{ position: 'relative', zIndex: 2 }}>
                      {isLoading ? 'Creating account…' : 'Join Mauve Studio'}
                    </span>
                    {!isLoading && <span style={{ position: 'relative', zIndex: 2, fontSize: 15 }}>✦</span>}
                  </motion.button>
                </motion.div>
              </form>
            </motion.div>

            {/* Footer */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.42 }}
              style={{ marginTop: 18, paddingTop: 16, borderTop: light ? '1px solid rgba(200,185,230,0.2)' : '1px solid rgba(80,60,140,0.15)', transition: 'border 1s' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                <div style={{ flex: 1, height: 1, background: light ? 'linear-gradient(90deg,transparent,rgba(196,181,253,0.35))' : 'linear-gradient(90deg,transparent,rgba(80,60,140,0.3))' }} />
                <span style={{ fontSize: 10, color: light ? '#c4b5fd' : '#4a3870', fontWeight: 600, letterSpacing: '0.5px', transition: 'color 1s' }}>OR</span>
                <div style={{ flex: 1, height: 1, background: light ? 'linear-gradient(90deg,rgba(196,181,253,0.35),transparent)' : 'linear-gradient(90deg,rgba(80,60,140,0.3),transparent)' }} />
              </div>
              <div style={{ textAlign: 'center', fontSize: 12.5, color: textSecond, transition: 'color 1s' }}>
                Already have an account?{' '}
                <Link href="/login" className="signup-link">Sign in</Link>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}