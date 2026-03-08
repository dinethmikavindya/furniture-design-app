"use client";

import React from 'react';
import Link from 'next/link';

export default function EditorPage() {
  return (
    <div style={{ padding: '40px', fontFamily: 'Arial, sans-serif', textAlign: 'center' }}>
      <h1 style={{ color: '#333' }}>Furniture Design Editor</h1>
      <p style={{ color: '#666', marginBottom: '20px' }}>
        Welcome to the Editor! You can customize your furniture designs here.
      </p>

      {/* Placeholder for the 3D/Design Canvas */}
      <div style={{ 
        width: '100%', 
        height: '400px', 
        backgroundColor: '#f9f9f9', 
        border: '2px dashed #bbb', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        marginBottom: '20px',
        borderRadius: '10px'
      }}>
        <p style={{ color: '#999' }}>Editor Canvas Area (Furniture Models will load here)</p>
      </div>

      {/* Navigation for Testing and HCI Evaluation */}
      <div style={{ marginTop: '30px' }}>
        <Link href="/dashboard" style={{
          padding: '12px 24px',
          backgroundColor: '#0070f3',
          color: 'white',
          textDecoration: 'none',
          borderRadius: '5px',
          fontWeight: 'bold'
        }}>
          Return to Dashboard
        </Link>
      </div>
    </div>
  );
}