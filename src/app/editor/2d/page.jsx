"use client";

import dynamic from 'next/dynamic';

// NO SSR - Konva only loads in browser
const Editor2D = dynamic(() => import('./Editor2DClient'), {
  ssr: false,
  loading: () => (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      fontFamily: "'Afacad', sans-serif",
      fontSize: 14,
      fontWeight: 600,
      color: '#8b5cf6',
      background: 'linear-gradient(135deg,#f0eaff 0%,#e8f4ff 50%,#f0e8ff 100%)',
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 24, marginBottom: 12 }}>🎨</div>
        <div>Loading 2D Editor...</div>
      </div>
    </div>
  ),
});

export default function Page() {
  return <Editor2D />;
}
