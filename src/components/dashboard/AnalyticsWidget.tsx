'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';

interface DesignStats {
  total: number;
  thisWeek: number;
  thisMonth: number;
}

interface FurnitureStats {
  totalFurniture: number;
  mostUsed: { furniture_type: string; usage_count: number }[];
}

interface RecentProject {
  id: string;
  name: string;
  updated_at: string;
}

export default function AnalyticsWidget() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [designStats, setDesignStats] = useState<DesignStats | null>(null);
  const [furnitureStats, setFurnitureStats] = useState<FurnitureStats | null>(null);
  const [recentProjects, setRecentProjects] = useState<RecentProject[]>([]);

  useEffect(() => {
    if (!user || !user.id) return;

    const fetchAnalytics = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/analytics?userId=${encodeURIComponent(user.id)}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to fetch analytics');
        setDesignStats(data.designStats || null);
        setFurnitureStats(data.furnitureStats || null);
        setRecentProjects(data.recentProjects || []);
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [user]);

  if (!user) return null;

  return (
    <div style={{ width: '100%', maxWidth: 960, margin: '12px auto', zIndex: 2 }}>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 12 }}>
        <h3 style={{ margin: 0, fontSize: 18 }}>Analytics</h3>
        {loading && <span style={{ color: '#999', marginLeft: 8 }}>Loading...</span>}
        {error && <span style={{ color: 'crimson', marginLeft: 8 }}>{error}</span>}
      </div>

      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 220px', padding: 12, borderRadius: 8, background: 'rgba(255,255,255,0.65)' }}>
          <div style={{ fontSize: 12, color: '#6b7280' }}>Projects</div>
          <div style={{ fontSize: 20, fontWeight: 600 }}>{designStats ? designStats.total : '—'}</div>
          <div style={{ fontSize: 12, color: '#6b7280' }}>This week: {designStats ? designStats.thisWeek : '—'}</div>
          <div style={{ fontSize: 12, color: '#6b7280' }}>This month: {designStats ? designStats.thisMonth : '—'}</div>
        </div>

        <div style={{ flex: '1 1 220px', padding: 12, borderRadius: 8, background: 'rgba(255,255,255,0.65)' }}>
          <div style={{ fontSize: 12, color: '#6b7280' }}>Furniture items</div>
          <div style={{ fontSize: 20, fontWeight: 600 }}>{furnitureStats ? furnitureStats.totalFurniture : '—'}</div>
          <div style={{ fontSize: 12, color: '#6b7280' }}>Top used:</div>
          <ul style={{ margin: '6px 0 0 14px', padding: 0 }}>
            {furnitureStats && furnitureStats.mostUsed && furnitureStats.mostUsed.length > 0 ? (
              furnitureStats.mostUsed.map((f, i: number) => (
                <li key={i} style={{ fontSize: 12 }}>{f.furniture_type} ({f.usage_count})</li>
              ))
            ) : (
              <li style={{ fontSize: 12 }}>—</li>
            )}
          </ul>
        </div>

        <div style={{ flex: '2 1 360px', padding: 12, borderRadius: 8, background: 'rgba(255,255,255,0.65)' }}>
          <div style={{ fontSize: 12, color: '#6b7280' }}>Recent Projects</div>
          <ul style={{ margin: '6px 0 0 14px', padding: 0 }}>
            {recentProjects && recentProjects.length > 0 ? (
              recentProjects.map((p) => (
                <li key={p.id} style={{ fontSize: 13, marginBottom: 6 }}>
                  <strong>{p.name}</strong>
                  <div style={{ fontSize: 11, color: '#6b7280' }}>{new Date(p.updated_at).toLocaleString()}</div>
                </li>
              ))
            ) : (
              <li style={{ fontSize: 12 }}>No recent projects</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
