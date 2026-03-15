'use client';

import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { loginUser } from '@/lib/api';

export default function LoginForm() {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError]       = useState('');
  const { login, isLoading }    = useAuth();
  const router                  = useRouter();

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
    @keyframes floatA { 0%,100%{transform:translateY(0) scale(1)} 50%{transform:translateY(-22px) scale(1.04)} }
    @keyframes floatB { 0%,100%{transform:translateY(0) scale(1)} 50%{transform:translateY(18px) scale(0.97)} }
    @keyframes shimmer { 0%{background-position:-300% center} 100%{background-position:300% center} }
    .login-input {
      width: 100%;
      padding: 13px 16px;
      border-radius: 14px;
      border: 1.5px solid rgba(255,255,255,0.65);
      background: rgba(255,255,255,0.35);
      backdrop-filter: blur(12px);
      font-size: 14px;
      font-family: 'Afacad', sans-serif;
      color: #2d1f4e;
      outline: none;
      transition: border 0.2s, background 0.2s;
      box-sizing: border-box;
    }
    .login-input:focus {
      border-color: rgba(139,92,246,0.6);
      background: rgba(255,255,255,0.55);
    }
    .login-input::placeholder { color: #b0a0cc; }
  `;

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'Afacad', sans-serif",
      background: 'linear-gradient(145deg,#f0eaff 0%,#e8f4ff 45%,#f0e8ff 100%)',
      position: 'relative',
      overflow: 'hidden',
      padding: 24,
    }}>
      <style suppressHydrationWarning dangerouslySetInnerHTML={{ __html: css }} />

      {/* Background orbs — exact match to landing page */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
        <div style={{
          position: 'absolute', width: 700, height: 700, borderRadius: '50%',
          background: 'radial-gradient(circle,rgba(167,139,250,0.22) 0%,transparent 70%)',
          top: '-15%', right: '-10%', animation: 'floatA 18s ease-in-out infinite',
        }} />
        <div style={{
          position: 'absolute', width: 500, height: 500, borderRadius: '50%',
          background: 'radial-gradient(circle,rgba(96,165,250,0.16) 0%,transparent 70%)',
          bottom: '-10%', left: '-8%', animation: 'floatB 22s ease-in-out infinite',
        }} />
        <div style={{
          position: 'absolute', width: 400, height: 400, borderRadius: '50%',
          background: 'radial-gradient(circle,rgba(244,114,182,0.12) 0%,transparent 70%)',
          top: '40%', left: '35%', animation: 'floatA 28s ease-in-out infinite reverse',
        }} />
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.025,
          backgroundImage: 'linear-gradient(rgba(100,80,180,1) 1px,transparent 1px),linear-gradient(90deg,rgba(100,80,180,1) 1px,transparent 1px)',
          backgroundSize: '48px 48px',
        }} />
      </div>

      {/* Glass Card */}
      <motion.div
        initial={{ opacity: 0, y: 32, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 22 }}
        style={{
          width: '100%',
          maxWidth: 420,
          borderRadius: 28,
          background: 'rgba(255,255,255,0.28)',
          backdropFilter: 'blur(48px) saturate(180%)',
          WebkitBackdropFilter: 'blur(48px) saturate(180%)',
          border: '1.5px solid rgba(255,255,255,0.72)',
          boxShadow: '0 32px 80px rgba(120,80,220,0.12), inset 0 1px 0 rgba(255,255,255,0.9)',
          padding: '44px 40px 36px',
          position: 'relative',
          zIndex: 10,
        }}
      >
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{ textAlign: 'center', marginBottom: 32 }}
        >
          <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.5px', color: '#1e1040' }}>
            Mauve Studio
            <span style={{
              background: 'linear-gradient(90deg,#8b5cf6,#60a5fa,#ec4899,#8b5cf6)',
              backgroundSize: '300% auto',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              animation: 'shimmer 3s linear infinite',
            }}>.</span>
          </div>
          <div style={{ fontSize: 13, color: '#9b93b8', marginTop: 6, fontWeight: 500 }}>
            Sign in to your workspace
          </div>
        </motion.div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Email */}
          <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#9b93b8', marginBottom: 7, letterSpacing: '0.6px', textTransform: 'uppercase' }}>
              Email
            </div>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="login-input"
            />
          </motion.div>

          {/* Password */}
          <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#9b93b8', marginBottom: 7, letterSpacing: '0.6px', textTransform: 'uppercase' }}>
              Password
            </div>
            <div style={{ position: 'relative' }}>
              <input
                type={showPass ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="login-input"
                style={{ paddingRight: 56 }}
              />
              <button
                type="button"
                onClick={() => setShowPass(v => !v)}
                style={{
                  position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: '#9b93b8', fontSize: 12, fontFamily: "'Afacad', sans-serif",
                  fontWeight: 600,
                }}
              >
                {showPass ? 'Hide' : 'Show'}
              </button>
            </div>
          </motion.div>

          {/* Error message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{
                padding: '10px 14px', borderRadius: 12,
                background: 'rgba(239,68,68,0.08)',
                border: '1px solid rgba(239,68,68,0.25)',
                color: '#dc2626', fontSize: 13, fontWeight: 600,
              }}
            >
              {error}
            </motion.div>
          )}

          {/* Submit button */}
          <motion.button
            type="submit"
            disabled={isLoading}
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: 50,
              border: 'none',
              background: isLoading
                ? 'rgba(139,92,246,0.4)'
                : 'linear-gradient(135deg,#8b5cf6 0%,#6d28d9 100%)',
              color: '#fff',
              fontSize: 15,
              fontWeight: 700,
              fontFamily: "'Afacad', sans-serif",
              cursor: isLoading ? 'not-allowed' : 'pointer',
              boxShadow: '0 8px 24px rgba(109,40,217,0.35)',
              marginTop: 4,
            }}
          >
            {isLoading ? 'Signing in…' : 'Sign In'}
          </motion.button>
        </form>

        {/* Footer links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 10, textAlign: 'center' }}
        >
          <Link href="/forgot-password" style={{
            color: '#8b5cf6', fontSize: 13, fontWeight: 600, textDecoration: 'none',
          }}>
            Forgot your password?
          </Link>
          <div style={{ fontSize: 13, color: '#9b93b8' }}>
            Don&apos;t have an account?{' '}
            <Link href="/signup" style={{ color: '#8b5cf6', fontWeight: 700, textDecoration: 'none' }}>
              Sign up
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
