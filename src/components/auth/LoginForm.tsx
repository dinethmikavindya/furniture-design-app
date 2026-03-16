'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import { loginUser } from '@/lib/api';

/* ─── Architectural Pendant Lamp ─── */
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
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', userSelect: 'none', paddingTop: 0 }}>
      {/* Ceiling mount */}
      <div style={{ width: 28, height: 4, background: isOn ? 'rgba(200,185,220,0.5)' : 'rgba(80,60,120,0.5)', borderRadius: '0 0 3px 3px', transition: 'background 1s' }} />

      {/* Fixture arm */}
      <motion.div style={{ x: swingX, display: 'flex', flexDirection: 'column', alignItems: 'center', transformOrigin: 'top center' }}>
        {/* Thin wire */}
        <div style={{ width: 1, height: 28, background: isOn ? 'rgba(160,140,200,0.45)' : 'rgba(60,40,100,0.6)', transition: 'background 1s' }} />

        {/* Pendant shade — minimal cone */}
        <div style={{ position: 'relative' }}>
          {/* Light halo */}
          <AnimatePresence>
            {isOn && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6 }}
                style={{
                  position: 'absolute', top: '30%', left: '50%',
                  transform: 'translate(-50%,-50%)',
                  width: 80, height: 80, borderRadius: '50%',
                  background: 'radial-gradient(circle,rgba(255,245,210,0.5) 0%,transparent 70%)',
                  pointerEvents: 'none', zIndex: 0,
                }}
              />
            )}
          </AnimatePresence>

          <svg width="64" height="50" viewBox="0 0 64 50" fill="none" style={{ position: 'relative', zIndex: 1, display: 'block' }}>
            {/* Shade body — clean minimal cone */}
            <path d="M 22 6 L 4 46 L 60 46 L 42 6 Z"
              fill={isOn ? 'rgba(255,252,240,0.92)' : 'rgba(28,18,55,0.88)'}
              stroke={isOn ? 'rgba(200,185,160,0.5)' : 'rgba(100,80,160,0.4)'}
              strokeWidth="1"
              style={{ transition: 'fill 1s, stroke 1s' }}
            />
            {/* Inner shade gradient */}
            <path d="M 23 9 L 7 44 L 57 44 L 41 9 Z"
              fill={isOn ? 'rgba(255,248,220,0.4)' : 'rgba(50,30,90,0.4)'}
              style={{ transition: 'fill 1s' }}
            />
            {/* Top rim */}
            <rect x="20" y="3" width="24" height="5" rx="2.5"
              fill={isOn ? 'rgba(180,160,120,0.7)' : 'rgba(80,60,140,0.7)'}
              style={{ transition: 'fill 1s' }}
            />
            {/* Bottom rim */}
            <rect x="2" y="44" width="60" height="4" rx="2"
              fill={isOn ? 'rgba(160,140,100,0.5)' : 'rgba(80,60,140,0.5)'}
              style={{ transition: 'fill 1s' }}
            />
            {/* Bulb visible inside */}
            <circle cx="32" cy="28" r="6"
              fill={isOn ? 'rgba(255,240,180,0.95)' : 'rgba(60,40,100,0.6)'}
              style={{ transition: 'fill 0.8s' }}
            />
            {isOn && (
              <circle cx="32" cy="28" r="9"
                fill="rgba(255,245,200,0.22)"
              />
            )}
            {/* Filament detail */}
            <path d="M 29 26 Q 32 24 35 26 Q 32 30 29 26 Z"
              stroke={isOn ? 'rgba(255,200,80,0.9)' : 'rgba(100,80,160,0.4)'}
              strokeWidth="0.8" fill="none"
              style={{ transition: 'stroke 0.8s' }}
            />
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
            animate={{
              boxShadow: isOn ? '0 0 0 2px rgba(200,160,60,0.4)' : '0 0 0 2px rgba(139,92,246,0.3)',
            }}
            transition={{ duration: 0.5 }}
            whileHover={{ scale: 1.3 }}
          >
            <div style={{
              width: 8, height: 8, borderRadius: '50%',
              background: isOn ? '#c8a840' : '#6d28d9',
              transition: 'background 0.8s',
            }} />
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Light cone projection */}
      <AnimatePresence>
        {isOn && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            style={{
              position: 'absolute', top: 58, left: '50%', transform: 'translateX(-50%)',
              width: 220, height: 200, pointerEvents: 'none', zIndex: 0,
              background: 'conic-gradient(from 260deg at 50% 0%, transparent 0deg, rgba(255,245,200,0.12) 20deg, rgba(255,245,200,0.06) 40deg, transparent 40deg)',
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Main ─── */
export default function LoginForm() {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError]       = useState('');
  const [lampOn, setLampOn]     = useState(false);
  const [hintDone, setHintDone] = useState(false);
  const { login, isLoading }    = useAuth();
  const router                  = useRouter();

  useEffect(() => { if (lampOn) setHintDone(true); }, [lampOn]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const data = await loginUser(email, password);
      if (data.success) {
        await login(email, password);
        router.push('/dashboard');
      } else {
        setError(data.message || data.error || 'Login failed');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Connection failed';
      setError(msg);
    }
  };

  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Afacad:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap');
    *,*::before,*::after { box-sizing:border-box; margin:0; padding:0; }
    @keyframes floatA { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-18px)} }
    @keyframes floatB { 0%,100%{transform:translateY(0)} 50%{transform:translateY(14px)} }
    @keyframes shimmer { 0%{background-position:-300% center} 100%{background-position:300% center} }
    @keyframes fadeUp { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
    .login-input {
      width:100%; padding:13px 16px; border-radius:10px;
      font-size:14px; font-family:'Afacad',sans-serif;
      outline:none; transition:all 0.22s; box-sizing:border-box;
    }
    .login-input::placeholder { color:rgba(155,147,184,0.6); }
  `;

  const light = lampOn;

  const cardBg      = light ? 'rgba(255,255,255,0.32)'  : 'rgba(12,8,28,0.72)';
  const cardBorder  = light ? 'rgba(255,255,255,0.75)'  : 'rgba(80,60,140,0.35)';
  const cardShadow  = light ? '0 40px 100px rgba(120,80,220,0.12), 0 1px 0 rgba(255,255,255,0.9) inset'
                             : '0 40px 100px rgba(0,0,0,0.5), 0 1px 0 rgba(100,80,160,0.2) inset';
  const textPrimary = light ? '#1a0f3c' : '#ede8ff';
  const textSecond  = light ? '#7b6da8' : '#6b5b95';
  const labelColor  = light ? '#9b93b8' : '#6b5b95';
  const inputBg     = light ? 'rgba(255,255,255,0.45)' : 'rgba(20,12,50,0.55)';
  const inputBorder = light ? 'rgba(200,185,230,0.6)'  : 'rgba(80,60,140,0.4)';
  const inputColor  = light ? '#1a0f3c' : '#ede8ff';

  return (
    <div style={{
      minHeight: '100vh', display: 'flex',
      fontFamily: "'Afacad',sans-serif",
      position: 'relative', overflow: 'hidden',
      transition: 'background 1.4s cubic-bezier(0.4,0,0.2,1)',
      background: light
        ? 'linear-gradient(145deg,#f0eaff 0%,#e8f4ff 45%,#f0e8ff 100%)'
        : 'linear-gradient(145deg,#0c0820 0%,#080514 50%,#0c0820 100%)',
    }}>
      <style suppressHydrationWarning dangerouslySetInnerHTML={{ __html: css }} />

      {/* ── Background ── */}
      <div style={{ position:'fixed', inset:0, zIndex:0, pointerEvents:'none', overflow:'hidden' }}>
        {/* Orbs */}
        <motion.div animate={{ opacity: light ? 1 : 0.12 }} transition={{ duration: 1.4 }}>
          <div style={{ position:'absolute', width:700, height:700, borderRadius:'50%', background:'radial-gradient(circle,rgba(167,139,250,0.2) 0%,transparent 70%)', top:'-15%', right:'-10%', animation:'floatA 20s ease-in-out infinite' }} />
          <div style={{ position:'absolute', width:500, height:500, borderRadius:'50%', background:'radial-gradient(circle,rgba(96,165,250,0.14) 0%,transparent 70%)', bottom:'-10%', left:'-8%', animation:'floatB 24s ease-in-out infinite' }} />
        </motion.div>

        {/* Stars — only when dark */}
        <AnimatePresence>
          {!light && (
            <motion.div
              initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
              transition={{ duration:1 }}
              style={{ position:'absolute', inset:0 }}
            >
              {Array.from({ length: 35 }).map((_, i) => (
                <motion.div
                  key={i}
                  animate={{ opacity: [0.2, 0.7, 0.2] }}
                  transition={{ duration: 2 + Math.random() * 2, repeat: Infinity, delay: Math.random() * 4 }}
                  style={{
                    position:'absolute',
                    width: Math.random() < 0.2 ? 2 : 1,
                    height: Math.random() < 0.2 ? 2 : 1,
                    borderRadius:'50%', background:'#fff',
                    top:`${Math.random() * 70}%`,
                    left:`${Math.random() * 100}%`,
                  }}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Subtle grid */}
        <motion.div
          animate={{ opacity: light ? 0.022 : 0.05 }}
          transition={{ duration: 1.2 }}
          style={{ position:'absolute', inset:0, backgroundImage:'linear-gradient(rgba(120,90,200,1) 1px,transparent 1px),linear-gradient(90deg,rgba(120,90,200,1) 1px,transparent 1px)', backgroundSize:'56px 56px' }}
        />

        {/* Warm floor pool when on */}
        <AnimatePresence>
          {light && (
            <motion.div
              initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
              transition={{ duration:1.2 }}
              style={{ position:'absolute', bottom:0, left:'50%', transform:'translateX(-50%)', width:700, height:280, background:'radial-gradient(ellipse at bottom center,rgba(255,240,180,0.07) 0%,transparent 65%)' }}
            />
          )}
        </AnimatePresence>
      </div>

      {/* ── Left panel — editorial copy ── */}
      <motion.div
        initial={{ opacity:0, x:-24 }}
        animate={{ opacity:1, x:0 }}
        transition={{ duration:0.7, delay:0.3, ease:[0.22,1,0.36,1] }}
        style={{
          flex:1, display:'flex', flexDirection:'column', justifyContent:'center',
          padding:'60px 64px', position:'relative', zIndex:5,
          borderRight: light ? '1px solid rgba(200,185,230,0.2)' : '1px solid rgba(80,60,140,0.18)',
          transition: 'border 1.2s',
        }}
        className="hide-on-small"
      >
        <div style={{ maxWidth:360 }}>
          {/* Brand */}
          <div style={{ fontSize:22, fontWeight:800, letterSpacing:'-0.4px', color: light?'#1a0f3c':'#ede8ff', marginBottom:48, transition:'color 1s' }}>
            Mauve<span style={{ color:'#8b5cf6' }}>.</span>
          </div>

          {/* Editorial headline */}
          <div style={{ overflow:'hidden', marginBottom:16 }}>
            <motion.h2
              initial={{ y:'100%', opacity:0 }}
              animate={{ y:0, opacity:1 }}
              transition={{ delay:0.5, duration:0.7, ease:[0.22,1,0.36,1] }}
              style={{ fontSize:'clamp(28px,3vw,40px)', fontWeight:700, lineHeight:1.16, letterSpacing:'-1px', color: light?'#1a0f3c':'#ede8ff', margin:0, transition:'color 1s' }}
            >
              Design rooms<br/>
              <span style={{ background:'linear-gradient(90deg,#8b5cf6,#60a5fa)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
                that feel like home.
              </span>
            </motion.h2>
          </div>

          <motion.p
            initial={{ opacity:0, y:12 }}
            animate={{ opacity:1, y:0 }}
            transition={{ delay:0.65, duration:0.6 }}
            style={{ fontSize:15, color: light?'#7b6da8':'#6b5b95', lineHeight:1.8, margin:'0 0 48px', transition:'color 1s' }}
          >
            Plan in 2D, walk through in 3D, shop real pieces — all in one workspace built for serious designers.
          </motion.p>

          {/* Feature list */}
          {['2D floor planning with snap grid', '3D real-time walkthrough', 'Curated furniture catalog'].map((item, i) => (
            <motion.div
              key={item}
              initial={{ opacity:0, x:-12 }}
              animate={{ opacity:1, x:0 }}
              transition={{ delay:0.7 + i * 0.1, duration:0.5 }}
              style={{ display:'flex', alignItems:'center', gap:10, marginBottom:12 }}
            >
              <div style={{ width:5, height:5, borderRadius:'50%', background:'linear-gradient(135deg,#8b5cf6,#60a5fa)', flexShrink:0 }} />
              <span style={{ fontSize:13.5, color: light?'#6b5b9a':'#6b5b95', fontWeight:500, transition:'color 1s' }}>{item}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* ── Right panel — login card ── */}
      <div style={{ width:'min(100%,480px)', display:'flex', alignItems:'center', justifyContent:'center', padding:'40px 32px', position:'relative', zIndex:10, flexShrink:0 }}>

        <div style={{ width:'100%', maxWidth:400 }}>
          {/* Lamp hangs above the card */}
          <div style={{ display:'flex', flexDirection:'column', alignItems:'center', marginBottom: -2, position:'relative', zIndex:15 }}>
            <PendantLamp isOn={lampOn} onToggle={() => setLampOn(v => !v)} />

            {/* Pull hint */}
            <AnimatePresence>
              {!hintDone && (
                <motion.div
                  initial={{ opacity:0, y:-4 }}
                  animate={{ opacity:1, y:0 }}
                  exit={{ opacity:0, y:-4 }}
                  transition={{ delay:1.4, duration:0.5 }}
                  style={{ marginTop:8, display:'flex', alignItems:'center', gap:6 }}
                >
                  <div style={{ width:16, height:1, background:'rgba(139,92,246,0.35)', borderRadius:4 }} />
                  <span style={{ fontSize:10, fontWeight:600, letterSpacing:'1.2px', textTransform:'uppercase', color: light?'#9b93b8':'#5b4d80', transition:'color 1s' }}>
                    pull to illuminate
                  </span>
                  <div style={{ width:16, height:1, background:'rgba(139,92,246,0.35)', borderRadius:4 }} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Card */}
          <motion.div
            initial={{ opacity:0, y:24 }}
            animate={{ opacity:1, y:0 }}
            transition={{ type:'spring', stiffness:180, damping:24, delay:0.25 }}
            style={{
              width:'100%', borderRadius:20,
              background:cardBg, backdropFilter:'blur(48px) saturate(200%)',
              WebkitBackdropFilter:'blur(48px) saturate(200%)',
              border:`1px solid ${cardBorder}`,
              boxShadow:cardShadow,
              padding:'32px 32px 28px',
              transition:'background 1.2s, border 1.2s, box-shadow 1.2s',
            }}
          >
            {/* Card header */}
            <div style={{ marginBottom:24 }}>
              <div style={{ fontSize:20, fontWeight:800, letterSpacing:'-0.4px', color:textPrimary, marginBottom:5, transition:'color 1s' }}>
                Welcome back
                <span style={{ background:'linear-gradient(90deg,#8b5cf6,#60a5fa,#ec4899,#8b5cf6)', backgroundSize:'300% auto', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', animation:'shimmer 3s linear infinite' }}>.</span>
              </div>
              <div style={{ fontSize:13, color:textSecond, fontWeight:400, transition:'color 1s' }}>
                {light ? 'Sign in to your workspace' : 'Turn on the light to continue'}
              </div>
            </div>

            {/* Divider */}
            <div style={{ height:1, background: light?'rgba(200,185,230,0.25)':'rgba(80,60,140,0.2)', marginBottom:22, transition:'background 1s' }} />

            {/* Form */}
            <motion.div animate={{ opacity: light?1:0.42, filter: light?'none':'blur(0.3px)' }} transition={{ duration:0.9 }}>
              <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:14 }}>
                {/* Email */}
                <div>
                  <div style={{ fontSize:10.5, fontWeight:700, color:labelColor, marginBottom:6, letterSpacing:'1px', textTransform:'uppercase', transition:'color 1s' }}>Email</div>
                  <input
                    type="email" value={email} onChange={e => setEmail(e.target.value)}
                    placeholder="you@example.com" required className="login-input"
                    style={{ background:inputBg, border:`1.5px solid ${inputBorder}`, color:inputColor, backdropFilter:'blur(12px)' }}
                  />
                </div>

                {/* Password */}
                <div>
                  <div style={{ fontSize:10.5, fontWeight:700, color:labelColor, marginBottom:6, letterSpacing:'1px', textTransform:'uppercase', transition:'color 1s' }}>Password</div>
                  <div style={{ position:'relative' }}>
                    <input
                      type={showPass?'text':'password'} value={password} onChange={e => setPassword(e.target.value)}
                      placeholder="••••••••" required className="login-input"
                      style={{ paddingRight:56, background:inputBg, border:`1.5px solid ${inputBorder}`, color:inputColor, backdropFilter:'blur(12px)' }}
                    />
                    <button type="button" onClick={() => setShowPass(v => !v)}
                      style={{ position:'absolute', right:14, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', color:'#9b93b8', fontSize:11, fontFamily:"'Afacad',sans-serif", fontWeight:600, letterSpacing:'0.5px' }}>
                      {showPass?'HIDE':'SHOW'}
                    </button>
                  </div>
                </div>

                {/* Error */}
                {error && (
                  <motion.div initial={{ opacity:0, scale:0.97 }} animate={{ opacity:1, scale:1 }}
                    style={{ padding:'10px 14px', borderRadius:10, background:'rgba(239,68,68,0.07)', border:'1px solid rgba(239,68,68,0.2)', color:'#dc2626', fontSize:13, fontWeight:600 }}>
                    {error}
                  </motion.div>
                )}

                {/* Submit */}
                <motion.button type="submit" disabled={isLoading}
                  whileHover={{ scale:1.015, y:-1 }} whileTap={{ scale:0.985 }}
                  style={{
                    width:'100%', padding:'13px', borderRadius:10, border:'none',
                    background: isLoading ? 'rgba(139,92,246,0.4)' : 'linear-gradient(135deg,#8b5cf6,#6d28d9)',
                    color:'#fff', fontSize:14, fontWeight:700, fontFamily:"'Afacad',sans-serif",
                    cursor: isLoading?'not-allowed':'pointer',
                    boxShadow: light ? '0 6px 20px rgba(109,40,217,0.30)' : '0 4px 14px rgba(109,40,217,0.18)',
                    marginTop:4, letterSpacing:'0.2px', transition:'box-shadow 1s',
                  }}>
                  {isLoading ? 'Signing in…' : 'Sign In'}
                </motion.button>
              </form>
            </motion.div>

            {/* Footer */}
            <div style={{ marginTop:20, paddingTop:18, borderTop: light?'1px solid rgba(200,185,230,0.2)':'1px solid rgba(80,60,140,0.15)', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:8, transition:'border 1s' }}>
              <Link href="/forgot-password" style={{ color:'#8b5cf6', fontSize:12.5, fontWeight:600, textDecoration:'none', letterSpacing:'0.1px' }}>
                Forgot password?
              </Link>
              <div style={{ fontSize:12.5, color:textSecond, transition:'color 1s' }}>
                New here?{' '}
                <Link href="/signup" style={{ color:'#8b5cf6', fontWeight:700, textDecoration:'none' }}>
                  Create account
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Lamp state label below card */}
          <motion.div
            animate={{ opacity: hintDone?0:0 }}
            style={{ textAlign:'center', marginTop:16 }}
          >
            <span style={{ fontSize:11, color:light?'#c4b5fd':'#4a3870', fontWeight:500, letterSpacing:'0.5px', transition:'color 1s' }}>
              {light ? '— workspace illuminated —' : '— pull the cord above —'}
            </span>
          </motion.div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) { .hide-on-small { display: none !important; } }
      `}</style>
    </div>
  );
}