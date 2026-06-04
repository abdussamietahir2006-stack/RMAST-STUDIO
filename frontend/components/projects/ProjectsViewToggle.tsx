'use client';

import { motion } from 'framer-motion';
import React from 'react';

type ViewMode = 'grid' | '3d';

type Props = {
  view: ViewMode;
  setView: React.Dispatch<React.SetStateAction<ViewMode>>;
};

export default function ProjectsViewToggle({ view, setView }: Props) {
  return (
    <section style={{ textAlign: 'center', marginBottom: '3rem' }}>
      <div
        style={{
          position: 'relative',
          display: 'inline-flex',
          padding: '6px',
          borderRadius: '16px',
          background: 'rgba(10, 25, 20, 0.6)',
          backdropFilter: 'blur(14px)',
          border: '1px solid rgba(82,183,136,0.2)',
          boxShadow: '0 10px 40px rgba(0,0,0,0.6)',
          overflow: 'hidden',
        }}
      >
        {/* 🔥 Animated Sliding Background */}
        <motion.div
          layout
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          style={{
            position: 'absolute',
            top: 6,
            bottom: 6,
            left: view === 'grid' ? 6 : '50%',
            right: view === 'grid' ? '50%' : 6,
            borderRadius: '12px',
            background: `
              linear-gradient(135deg, #52b788, #00e5ff)
            `,
            boxShadow: '0 0 20px rgba(82,183,136,0.5)',
          }}
        />

        {/* BUTTON: GRID */}
        <button
          onClick={() => setView('grid')}
          style={{
            position: 'relative',
            zIndex: 2,
            padding: '0.7rem 1.8rem',
            borderRadius: '12px',
            border: 'none',
            cursor: 'pointer',
            fontSize: '0.8rem',
            letterSpacing: '0.12em',
            fontWeight: 700,
            background: 'transparent',
            color: view === 'grid' ? '#02120c' : 'rgba(220,255,240,0.6)',
            transition: 'all 0.3s ease',
          }}
        >
          SIMPLE VIEW
        </button>

        {/* BUTTON: 3D */}
        <button
          onClick={() => setView('3d')}
          style={{
            position: 'relative',
            zIndex: 2,
            padding: '0.7rem 1.8rem',
            borderRadius: '12px',
            border: 'none',
            cursor: 'pointer',
            fontSize: '0.8rem',
            letterSpacing: '0.12em',
            fontWeight: 700,
            background: 'transparent',
            color: view === '3d' ? '#02120c' : 'rgba(220,255,240,0.6)',
            transition: 'all 0.3s ease',
          }}
        >
          3D VIEW
        </button>
      </div>

      {/* ✨ Subtle Glow Line */}
      <div
        style={{
          marginTop: '1rem',
          height: '2px',
          width: '120px',
          marginInline: 'auto',
          background:
            'linear-gradient(90deg, transparent, rgba(82,183,136,0.6), transparent)',
          filter: 'blur(1px)',
        }}
      />
    </section>
  );
}