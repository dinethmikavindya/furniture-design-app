'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';

export default function Home() {
    const { user, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading) {
            if (user) {
                router.push('/dashboard');
            } else {
                router.push('/login');
            }
        }
    }, [user, isLoading, router]);

    // Show a blank loading state while deciding where to route
    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: '#f8fafc' // subtle background before redirect
        }}>
            <motion.div
                style={{
                    width: 40, height: 40, borderRadius: '50%',
                    border: '3px solid rgba(139,92,246,0.3)',
                    borderTopColor: '#8b5cf6',
                }}
                animate={{ rotate: 360 }}
                transition={{ duration: 1, ease: "linear", repeat: Infinity }}
            />
        </div>
    );
}
