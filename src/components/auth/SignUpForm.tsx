'use client';

import { signupUser } from '@/lib/api';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function SignUpForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const { signup, isLoading } = useAuth();
  const router = useRouter();

  /* ── ALL ORIGINAL LOGIC — UNTOUCHED ── */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (!email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }
    if (!name.trim()) {
      setError('Name is required');
      return;
    }

    try {
      const data = await signupUser(name, email, password);
      if (data.success) {
        await signup(email, password, name);
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setName('');
        router.push('/dashboard');
      } else {
        setError(data.message || 'Signup failed');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Connection failed';
      setError(errorMessage);
    }
  };

  /* ── STYLES ── */
  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Afacad:ital,wght@0,400;0,500;0,600;0,700;0,800&display=swap');
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
    @keyframes gradientShift {
      0%   { background-position: 0% 50% }
      50%  { background-position: 100% 50% }
      100% { background-position: 0% 50% }
    }

    .signup-input {
      width: 100%;
      padding: 13px 18px;
      border-radius: 16px;
      border: 1.5px solid rgba(255,255,255,0.60);
      background: rgba(255,255,255,0.40);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      font-family: 'Afacad', sans-serif;
      font-size: 15px;
      font-weight: 500;
      color: #2d1f4e;
      outline: none;
      transition: all 0.25s cubic-bezier(0.22,1,0.36,1);
      box-shadow: 0 2px 12px rgba(120,80,220,0.06), inset 0 1.5px 0 rgba(255,255,255,0.85);
    }
    .signup-input::placeholder { color: #c4b5fd; }
    .signup-input:focus {
      border-color: rgba(139,92,246,0.55);
      background: rgba(255,255,255,0.60);
      box-shadow: 0 0 0 4px rgba(139,92,246,0.10), 0 4px 20px rgba(120,80,220,0.10), inset 0 1.5px 0 rgba(255,255,255,0.9);
      transform: translateY(-1px);
    }
    .signup-input:hover:not(:focus) {
      border-color: rgba(196,181,253,0.60);
      background: rgba(255,255,255,0.50);
    }

    .signup-link {
      color: #8b5cf6;
      font-weight: 700;
      text-decoration: none;
      transition: color 0.2s;
      background: linear-gradient(90deg,#8b5cf6,#6d28d9);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .signup-link:hover { opacity: 0.8; }

    ::-webkit-scrollbar { width: 4px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: rgba(196,176,240,0.4); border-radius: 4px; }
  `;

  const labelStyle = {
    display: 'block',
    fontSize: 11,
    fontWeight: 700,
    color: '#9b93b8',
    marginBottom: 7,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.6px',
  };

  const fields = [
    { id: 'name',            label: 'Full Name',        type: 'text',     value: name,            set: setName,            placeholder: 'Alex Johnson',    delay: 0.15, icon: '◯' },
    { id: 'email',           label: 'Email',            type: 'email',    value: email,           set: setEmail,           placeholder: 'you@example.com', delay: 0.20, icon: '✉' },
    { id: 'password',        label: 'Password',         type: 'password', value: password,        set: setPassword,        placeholder: 'Min. 6 characters', delay: 0.25, minLength: 6, icon: '⬡' },
    { id: 'confirmPassword', label: 'Confirm Password', type: 'password', value: confirmPassword, set: setConfirmPassword, placeholder: 'Repeat password', delay: 0.30, minLength: 6, icon: '⬡' },
  ];

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
      padding: '24px 0',
    }}>
      <style dangerouslySetInnerHTML={{ __html: css }} />

      {/* ── Background orbs ── */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', top: '-14%', left: '-10%',
          width: 560, height: 560, borderRadius: '50%',
          background: 'radial-gradient(circle,rgba(167,139,250,0.28) 0%,transparent 68%)',
          animation: 'floatA 9s ease-in-out infinite',
        }} />
        <div style={{
          position: 'absolute', bottom: '-8%', right: '-8%',
          width: 480, height: 480, borderRadius: '50%',
          background: 'radial-gradient(circle,rgba(96,165,250,0.20) 0%,transparent 68%)',
          animation: 'floatB 11s ease-in-out infinite',
        }} />
        <div style={{
          position: 'absolute', top: '35%', left: '28%',
          width: 300, height: 300, borderRadius: '50%',
          background: 'radial-gradient(circle,rgba(244,114,182,0.11) 0%,transparent 68%)',
          animation: 'floatA 13s ease-in-out infinite 2s',
        }} />
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
          width: 440,
          maxWidth: '92vw',
          position: 'relative',
          zIndex: 10,
          borderRadius: 32,
          background: 'rgba(255,255,255,0.28)',
          backdropFilter: 'blur(48px) saturate(220%) brightness(1.06)',
          WebkitBackdropFilter: 'blur(48px) saturate(220%) brightness(1.06)',
          border: '1.5px solid rgba(255,255,255,0.72)',
          boxShadow: '0 32px 80px rgba(109,40,217,0.14), 0 0 0 0.5px rgba(255,255,255,0.4), inset 0 2px 0 rgba(255,255,255,0.85)',
          overflow: 'hidden',
        }}
      >


        <div style={{ padding: '32px 36px 36px' }}>

          {/* Glass rim */}
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

          {/* ── Logo ── */}
          <motion.div
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.08, type: 'spring', stiffness: 120, damping: 18 }}
            style={{ textAlign: 'center', marginBottom: 28 }}
          >
            {/* Logo icon */}
            <div style={{
              width: 52, height: 52, borderRadius: 16, margin: '0 auto 14px',
              background: 'linear-gradient(135deg,#8b5cf6,#6d28d9)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 8px 24px rgba(109,40,217,0.32), inset 0 1px 0 rgba(255,255,255,0.22)',
              fontSize: 22,
            }}>
              <span style={{ filter: 'brightness(0) invert(1)' }}>✦</span>
            </div>

            <div style={{ fontSize: 26, fontWeight: 800, color: '#2d1f4e', letterSpacing: '-0.5px', lineHeight: 1 }}>
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
              Join Mauve Studio today
            </div>
          </motion.div>

          {/* ── Form — ALL ORIGINAL LOGIC KEPT ── */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

            {fields.map(f => (
              <motion.div key={f.id}
                initial={{ y: 16, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: f.delay, type: 'spring', stiffness: 120, damping: 18 }}
              >
                <label htmlFor={f.id} style={labelStyle}>{f.label}</label>
                <input
                  className="signup-input"
                  type={f.type}
                  id={f.id}
                  value={f.value}
                  onChange={(e) => f.set(e.target.value)}
                  placeholder={f.placeholder}
                  required
                  minLength={f.minLength}
                />
              </motion.div>
            ))}

            {/* Error */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
                style={{
                  padding: '11px 16px', borderRadius: 14,
                  background: 'rgba(254,226,226,0.70)',
                  backdropFilter: 'blur(12px)',
                  border: '1px solid rgba(252,165,165,0.5)',
                  fontSize: 13, color: '#dc2626', fontWeight: 600,
                  display: 'flex', alignItems: 'center', gap: 8,
                }}
              >
                <span style={{ fontSize: 16 }}>⚠</span> {error}
              </motion.div>
            )}

            {/* Submit */}
            <motion.div
              initial={{ y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.35, type: 'spring', stiffness: 120, damping: 18 }}
              style={{ marginTop: 6 }}
            >
              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={!isLoading ? { scale: 1.03, y: -2 } : {}}
                whileTap={!isLoading ? { scale: 0.97, y: 1 } : {}}
                style={{
                  width: '100%', padding: '15px',
                  borderRadius: 50, border: 'none',
                  fontFamily: "'Afacad',sans-serif",
                  fontSize: 15, fontWeight: 800, color: '#fff',
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
                  letterSpacing: '0.2px',
                }}
              >
                {/* Button shine */}
                <div style={{
                  position: 'absolute', top: 0, left: '10%', right: '10%', height: '50%',
                  background: 'linear-gradient(180deg,rgba(255,255,255,0.20) 0%,transparent 100%)',
                  borderRadius: '50px 50px 50% 50%', pointerEvents: 'none',
                }} />
                <span style={{ position: 'relative', zIndex: 2 }}>
                  {isLoading ? 'Creating account…' : 'Join Mauve Studio'}
                </span>
                {!isLoading && (
                  <span style={{ position: 'relative', zIndex: 2, fontSize: 18 }}>✦</span>
                )}
              </motion.button>
            </motion.div>
          </form>

          {/* ── Divider + Login link ── */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: 0.42 }}
            style={{ marginTop: 22, textAlign: 'center' }}
          >
            <div style={{
              display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16,
            }}>
              <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg,transparent,rgba(196,181,253,0.4))' }} />
              <span style={{ fontSize: 11, color: '#c4b5fd', fontWeight: 600, letterSpacing: '0.5px' }}>OR</span>
              <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg,rgba(196,181,253,0.4),transparent)' }} />
            </div>
            <div style={{ fontSize: 13, color: '#9b93b8', fontWeight: 500 }}>
              Already have an account?{' '}
              <Link href="/login" className="signup-link">Log in</Link>
            </div>
          </motion.div>

        </div>
      </motion.div>
    </div>
  );
}