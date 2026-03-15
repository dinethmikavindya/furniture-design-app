"use client";
import React from 'react';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <div style={{ padding: '50px', textAlign: 'center' }}>
      <h1>Login Page</h1>
      <form style={{ display: 'inline-block', textAlign: 'left', border: '1px solid #ccc', padding: '20px' }}>
        <input type="email" placeholder="Email" style={{ display: 'block', marginBottom: '10px', padding: '8px' }} />
        <input type="password" placeholder="Password" style={{ display: 'block', marginBottom: '10px', padding: '8px' }} />
        <button type="button" style={{ padding: '10px 20px', backgroundColor: '#0070f3', color: 'white', border: 'none' }}>Login</button>
      </form>
      <p>Need an account? <Link href="/signup">Sign up</Link></p>
    </div>
  );
}