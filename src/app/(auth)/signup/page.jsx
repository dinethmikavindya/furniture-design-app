"use client";
import React from 'react';
import Link from 'next/link';

export default function SignupPage() {
  return (
    <div style={{ padding: '50px', textAlign: 'center' }}>
      <h1>Sign Up Page</h1>
      <form style={{ display: 'inline-block', textAlign: 'left', border: '1px solid #ccc', padding: '20px' }}>
        <input type="text" placeholder="Full Name" style={{ display: 'block', marginBottom: '10px', padding: '8px' }} />
        <input type="email" placeholder="Email" style={{ display: 'block', marginBottom: '10px', padding: '8px' }} />
        <input type="password" placeholder="Password" style={{ display: 'block', marginBottom: '10px', padding: '8px' }} />
        <button type="button" style={{ padding: '10px 20px', backgroundColor: '#28a745', color: 'white', border: 'none' }}>Register</button>
      </form>
      <p>Have an account? <Link href="/login">Login</Link></p>
    </div>
  );
}