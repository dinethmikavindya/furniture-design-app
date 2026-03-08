"use client";

import React from 'react';
import Link from 'next/link';

export default function AccountPage() {
  return (
    <div style={{ padding: '40px', fontFamily: 'Arial, sans-serif' }}>
      <h1>User Account Profile</h1>
      <p>Welcome to your profile settings. Here you can manage your account details.</p>
      
      <div style={{ marginTop: '20px', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
        <p><strong>Name:</strong> Test User</p>
        <p><strong>Email:</strong> testuser@example.com</p>
        <button style={{ padding: '10px', cursor: 'pointer' }}>Edit Profile</button>
      </div>

      <div style={{ marginTop: '30px' }}>
        <Link href="/dashboard" style={{ color: '#0070f3', fontWeight: 'bold' }}>
          ← Back to Dashboard
        </Link>
      </div>
    </div>
  );
}