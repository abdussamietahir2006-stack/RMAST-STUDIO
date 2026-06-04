'use client';

import { useRef, useState, useCallback } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

interface StatItem {
  value: string;
  label: string;
  icon: string;
  accent: string;
  accentDim: string;
}

function StatCard({ stat, index }: { stat: StatItem; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const sp = { stiffness: 220, damping: 22, mass: 0.6 };
  const rotateX = useSpring(useTransform(rawY, [-0.5, 0.5], [10, -10]), sp);
  const rotateY = useSpring(useTransform(rawX, [-0.5, 0.5], [-10, 10]), sp);
  const shadowX = useSpring(useTransform(rawX, [-0.5, 0.5], [-16, 16]), sp);
  const shadowY = useSpring(useTransform(rawY, [-0.5, 0.5], [-16, 16]), sp);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    rawX.set((e.clientX - rect.left) / rect.width - 0.5);
    rawY.set((e.clientY - rect.top) / rect.height - 0.5);
  }, [rawX, rawY]);

  const boxShadow = useTransform(
    [shadowX, shadowY],
    ([sx, sy]: number[]) =>
      `${sx}px ${sy}px 40px rgba(0,0,0,0.6), 0 0 0 1px ${stat.accent}22`
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: false, margin: '-30px' }}
      transition={{ delay: index * 0.1, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      style={{ perspective: '800px' }}
    >
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => { rawX.set(0); rawY.set(0); setHovered(false); }}
        style={{
          rotateX, rotateY, boxShadow,
          transformStyle: 'preserve-3d',
          position: 'relative', borderRadius: '18px',
          background: 'rgba(11,15,14,0.8)',
          border: `1px solid ${stat.accent}22`,
          backdropFilter: 'blur(12px)',
          overflow: 'hidden', cursor: 'default',
          padding: '32px 28px', textAlign: 'center',
        }}
      >
        {/* Accent bar */}
        <motion.div
          animate={{ scaleX: hovered ? 1 : 0.25, opacity: hovered ? 1 : 0.35 }}
          transition={{ duration: 0.4 }}
          style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: '3px',
            background: `linear-gradient(90deg, ${stat.accent}, transparent)`,
            transformOrigin: 'left',
          }}
        />

        {/* Bloom */}
        <motion.div
          animate={{ opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.4 }}
          style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            background: `radial-gradient(ellipse 70% 60% at 50% 110%, ${stat.accentDim}, transparent 65%)`,
          }}
        />

        {/* Icon */}
        <motion.div
          animate={{
            scale: hovered ? 1.2 : 1,
            rotate: hovered ? 8 : 0,
            filter: hovered ? `drop-shadow(0 0 10px ${stat.accent})` : 'none',
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 14 }}
          style={{ fontSize: '28px', marginBottom: '14px', position: 'relative', zIndex: 1 }}
        >
          {stat.icon}
        </motion.div>

        {/* Value */}
        <motion.div
          animate={{ color: hovered ? stat.accent : '#e8f5ec' }}
          transition={{ duration: 0.3 }}
          style={{
            fontFamily: "'Syne', sans-serif", fontSize: '2.4rem',
            fontWeight: 800, lineHeight: 1, marginBottom: '8px',
            position: 'relative', zIndex: 1,
          }}
        >
          {stat.value}
        </motion.div>

        {/* Underline */}
        <motion.div
          animate={{ width: hovered ? '36px' : '0px' }}
          transition={{ duration: 0.35 }}
          style={{
            height: '2px', background: `linear-gradient(90deg, ${stat.accent}, transparent)`,
            borderRadius: '2px', margin: '0 auto 10px', position: 'relative', zIndex: 1,
          }}
        />

        <p style={{
          color: 'rgba(232,245,236,0.4)', fontSize: '11px',
          fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase',
          margin: 0, position: 'relative', zIndex: 1,
        }}>
          {stat.label}
        </p>
      </motion.div>
    </motion.div>
  );
}

export default function ProjectStats({ data = {} }: { data?: Record<string, string> }) {
  const statsList: StatItem[] = [
    { value: data.projectStat1Value || '50+', label: data.projectStat1Label || 'Projects Delivered', icon: data.projectStat1Icon || '⚡', accent: '#52b788', accentDim: 'rgba(82,183,136,0.15)' },
    { value: data.projectStat2Value || '30+', label: data.projectStat2Label || 'Happy Clients', icon: data.projectStat2Icon || '🤝', accent: '#00e5ff', accentDim: 'rgba(0,229,255,0.12)' },
    { value: data.projectStat3Value || '98+', label: data.projectStat3Label || 'Avg Lighthouse Score', icon: data.projectStat3Icon || '🎯', accent: '#ffca28', accentDim: 'rgba(255,202,40,0.12)' },
    { value: data.projectStat4Value || '99.9%', label: data.projectStat4Label || 'Uptime SLA', icon: data.projectStat4Icon || '🛡️', accent: '#76ff03', accentDim: 'rgba(118,255,3,0.1)' },
  ];

  return (
    <section style={{
      padding: '3rem 6vw',
      background: '#0b0f0e',
      position: 'relative',
    }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px',
        maxWidth: '1200px',
        margin: '0 auto',
      }}>
        {statsList.map((stat, i) => (
          <StatCard key={i} stat={stat} index={i} />
        ))}
      </div>
    </section>
  );
}