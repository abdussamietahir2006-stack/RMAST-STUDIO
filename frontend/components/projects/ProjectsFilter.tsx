'use client';

import { motion, AnimatePresence } from 'framer-motion';

type Props = {
  filter: string;
  setFilter: (value: string) => void;
};

const filters = [
  { label: 'All', icon: '✦' },
  { label: 'Web', icon: '⚡' },
  { label: '3D', icon: '🌐' },
  { label: 'AI', icon: '🤖' },
];

export default function ProjectsFilter({ filter, setFilter }: Props) {
  return (
    <section style={{
      padding: '2rem 6vw',
      textAlign: 'center',
      background: '#0b0f0e',
      position: 'relative',
      zIndex: 2,
    }}>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        style={{
          display: 'inline-flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center',
          background: 'rgba(82,183,136,0.04)',
          border: '1px solid rgba(82,183,136,0.12)',
          padding: '8px', borderRadius: '16px',
        }}
      >
        {filters.map((f) => {
          const active = filter === f.label;
          return (
            <motion.button
              key={f.label}
              onClick={() => setFilter(f.label)}
              whileHover={{ scale: active ? 1 : 1.06 }}
              whileTap={{ scale: 0.96 }}
              style={{
                position: 'relative',
                padding: '8px 20px',
                borderRadius: '10px',
                border: 'none',
                cursor: 'pointer',
                fontFamily: "'Syne', sans-serif",
                fontSize: '12px', fontWeight: 700,
                letterSpacing: '1.5px', textTransform: 'uppercase',
                background: 'transparent',
                color: active ? '#0b0f0e' : 'rgba(232,245,236,0.4)',
                transition: 'color 0.2s',
                overflow: 'hidden',
                zIndex: 1,
              }}
            >
              {/* Active bg pill */}
              <AnimatePresence>
                {active && (
                  <motion.span
                    layoutId="filterPill"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 28 }}
                    style={{
                      position: 'absolute', inset: 0, borderRadius: '10px',
                      background: 'linear-gradient(135deg, #52b788, #00e5ff)',
                      zIndex: -1,
                    }}
                  />
                )}
              </AnimatePresence>
              <span style={{ marginRight: '6px', fontSize: '13px' }}>{f.icon}</span>
              {f.label}
            </motion.button>
          );
        })}
      </motion.div>
    </section>
  );
}