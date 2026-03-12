'use client';
import { loginUser } from '@/lib/api';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const { login, isLoading } = useAuth();
  const router = useRouter();

  /* ── ALL ORIGINAL LOGIC — UNTOUCHED ── */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    try {
      const data = await loginUser(email, password);
      if (data.success) {
        await login(email, password);
        router.push('/dashboard');
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Connection failed';
      setError(errorMessage);
    }
  };

  /* ── STYLES ── */
  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Afacad:ital,wght@0,400;0,500;0,600;0,700&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    @keyframes shimmer {
      0%   { background-position: -300% center }
      100% { background-position:  300% center }
    }
    @keyframes floatA {
      0%,100% { transform: translateY(0) scale(1) }
      50%     { transform: translateY(-24px) scale(1.04) }
    }
    @keyframes floatB {
      0%,100% { transform: translateY(0) }
      50%     { transform: translateY(18px) }
    }
    @keyframes fadeUp {
      from { opacity:0; transform: translateY(20px); }
      to   { opacity:1; transform: translateY(0); }
    }

    .login-input {
      width: 100%;
      padding: 14px 18px;
      border-radius: 16px;
      border: 1.5px solid rgba(255,255,255,0.55);
      background: rgba(255,255,255,0.35);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      font-family: 'Afacad', sans-serif;
      font-size: 15px;
      font-weight: 500;
      color: #2d1f4e;
      outline: none;
      transition: all 0.25s cubic-bezier(0.22,1,0.36,1);
      box-shadow: 0 2px 12px rgba(120,80,220,0.06), inset 0 1px 0 rgba(255,255,255,0.8);
    }
    .login-input::placeholder { color: #b8aed0; }
    .login-input:focus {
      border-color: rgba(139,92,246,0.5);
      background: rgba(255,255,255,0.55);
      box-shadow: 0 0 0 3px rgba(139,92,246,0.12), 0 4px 20px rgba(120,80,220,0.10), inset 0 1px 0 rgba(255,255,255,0.9);
    }

    .login-link {
      color: #8b5cf6;
      font-weight: 600;
      text-decoration: none;
      transition: color 0.2s;
    }
    .login-link:hover { color: #6d28d9; }
  `;

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'Afacad', 'Helvetica Neue', sans-serif",
      background: 'linear-gradient(135deg,#f0eaff 0%,#e8f4ff 50%,#f0e8ff 100%)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <style dangerouslySetInnerHTML={{ __html: css }} />

      {/* ── Background orbs ── */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', top: '-14%', left: '-10%',
          width: 560, height: 560, borderRadius: '50%',
          background: 'radial-gradient(circle,rgba(167,139,250,0.30) 0%,transparent 68%)',
          animation: 'floatA 9s ease-in-out infinite',
        }} />
        <div style={{
          position: 'absolute', bottom: '-8%', right: '-8%',
          width: 480, height: 480, borderRadius: '50%',
          background: 'radial-gradient(circle,rgba(96,165,250,0.22) 0%,transparent 68%)',
          animation: 'floatB 11s ease-in-out infinite',
        }} />
        <div style={{
          position: 'absolute', top: '40%', left: '30%',
          width: 320, height: 320, borderRadius: '50%',
          background: 'radial-gradient(circle,rgba(244,114,182,0.12) 0%,transparent 68%)',
          animation: 'floatA 13s ease-in-out infinite 2s',
        }} />
        {/* Grid */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'linear-gradient(rgba(139,92,246,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(139,92,246,0.03) 1px,transparent 1px)',
          backgroundSize: '44px 44px',
        }} />
      </div>

      {/* ── Glass card ── */}
      <motion.div
        initial={{ y: 32, opacity: 0, scale: 0.96 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 120, damping: 20, mass: 0.8 }}
        style={{
          width: 420,
          maxWidth: '92vw',
          position: 'relative',
          zIndex: 10,
          borderRadius: 32,
          background: 'rgba(255,255,255,0.28)',
          backdropFilter: 'blur(48px) saturate(220%) brightness(1.06)',
          WebkitBackdropFilter: 'blur(48px) saturate(220%) brightness(1.06)',
          border: '1.5px solid rgba(255,255,255,0.72)',
          boxShadow: '0 32px 80px rgba(109,40,217,0.14), 0 0 0 0.5px rgba(255,255,255,0.4), inset 0 2px 0 rgba(255,255,255,0.85)',
          padding: '40px 36px 36px',
          overflow: 'hidden',
        }}
      >
        {/* Glass rim highlight */}
        <div style={{
          position: 'absolute', inset: 0, borderRadius: 32, pointerEvents: 'none',
          border: '1.5px solid transparent',
          backgroundImage: `linear-gradient(135deg,
            rgba(255,255,255,0.82) 0%, rgba(180,210,255,0.40) 18%,
            rgba(255,255,255,0.06) 38%, rgba(255,200,240,0.14) 58%,
            rgba(255,255,255,0.04) 72%, rgba(200,230,255,0.45) 90%,
            rgba(255,255,255,0.72) 100%)`,
          backgroundOrigin: 'border-box',
          WebkitMask: 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'destination-out',
          maskComposite: 'exclude',
        }} />
        {/* Top specular line */}
        <div style={{
          position: 'absolute', top: 0, left: '10%', right: '10%', height: 2,
          background: 'linear-gradient(90deg,transparent,rgba(255,255,255,0.9),transparent)',
          pointerEvents: 'none',
        }} />

        {/* ── Logo ── */}
        <motion.div
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1, type: 'spring', stiffness: 120, damping: 18 }}
          style={{ textAlign: 'center', marginBottom: 28 }}
        >
          <div style={{ fontSize: 26, fontWeight: 700, color: '#2d1f4e', letterSpacing: '-0.4px', lineHeight: 1 }}>
            Mauve Studio
            <span style={{
              background: 'linear-gradient(90deg,#8b5cf6,#60a5fa,#ec4899,#8b5cf6)',
              backgroundSize: '300% auto',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              animation: 'shimmer 2.8s linear infinite',
            }}>.</span>
          </div>
          <div style={{ marginTop: 6, fontSize: 13, color: '#9b93b8', fontWeight: 500 }}>
            Sign in to your workspace
          </div>
        </motion.div>

        {/* ── Form — ALL ORIGINAL LOGIC KEPT ── */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Email */}
          <motion.div
            initial={{ y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.15, type: 'spring', stiffness: 120, damping: 18 }}
          >
            <label htmlFor="email" style={{
              display: 'block', fontSize: 11, fontWeight: 700,
              color: '#9b93b8', marginBottom: 7,
              textTransform: 'uppercase', letterSpacing: '0.5px',
            }}>Email</label>
            <input
              className="login-input"
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setFocusedField('email')}
              onBlur={() => setFocusedField(null)}
              placeholder="you@example.com"
              required
            />
          </motion.div>

          {/* Password */}
          <motion.div
            initial={{ y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 120, damping: 18 }}
          >
            <label htmlFor="password" style={{
              display: 'block', fontSize: 11, fontWeight: 700,
              color: '#9b93b8', marginBottom: 7,
              textTransform: 'uppercase', letterSpacing: '0.5px',
            }}>Password</label>
            <input
              className="login-input"
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setFocusedField('password')}
              onBlur={() => setFocusedField(null)}
              placeholder="••••••••"
              required
            />
          </motion.div>

          {/* Error message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
              style={{
                padding: '10px 14px', borderRadius: 12,
                background: 'rgba(254,226,226,0.70)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(252,165,165,0.5)',
                fontSize: 13, color: '#dc2626', fontWeight: 500,
              }}
            >{error}</motion.div>
          )}

          {/* Submit button */}
          <motion.div
            initial={{ y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.25, type: 'spring', stiffness: 120, damping: 18 }}
          >
            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={!isLoading ? { scale: 1.03, y: -2 } : {}}
              whileTap={!isLoading ? { scale: 0.97, y: 1 } : {}}
              style={{
                width: '100%', padding: '14px',
                borderRadius: 50, border: 'none',
                fontFamily: "'Afacad',sans-serif",
                fontSize: 15, fontWeight: 700, color: '#fff',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                background: isLoading
                  ? 'linear-gradient(135deg,#c4b5fd,#a78bfa)'
                  : 'linear-gradient(135deg,#8b5cf6 0%,#6d28d9 100%)',
                boxShadow: isLoading
                  ? 'none'
                  : '0 10px 32px rgba(109,40,217,0.40), inset 0 1px 0 rgba(255,255,255,0.22)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                position: 'relative', overflow: 'hidden',
                transition: 'background 0.3s ease, box-shadow 0.3s ease',
              }}
            >
              {/* Top specular */}
              <div style={{
                position: 'absolute', top: 0, left: '15%', right: '15%', height: '50%',
                background: 'linear-gradient(180deg,rgba(255,255,255,0.18) 0%,transparent 100%)',
                borderRadius: '50px 50px 50% 50%', pointerEvents: 'none',
              }} />
              <span style={{ position: 'relative', zIndex: 2 }}>
                {isLoading ? 'Signing in…' : 'Sign In'}
              </span>
              {!isLoading && (
                <span style={{ position: 'relative', zIndex: 2, fontSize: 18 }}>→</span>
              )}
            </motion.button>
          </motion.div>
        </form>

        {/* ── Links — ALL ORIGINAL hrefs KEPT ── */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
          style={{ marginTop: 22, display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center' }}
        >
          <Link href="/forgot-password" className="login-link" style={{ fontSize: 13 }}>
            Forgot your password?
          </Link>

          <div style={{
            width: '100%', height: 1, margin: '4px 0',
            background: 'linear-gradient(90deg,transparent,rgba(196,181,253,0.4),transparent)',
          }} />

          <div style={{ fontSize: 13, color: '#9b93b8', fontWeight: 500 }}>
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="login-link">
              Sign up
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}