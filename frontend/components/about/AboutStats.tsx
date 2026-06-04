'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';

export interface AboutStatsCMSData {
  data?: Record<string, string>;
  images?: Record<string, string>;
}

interface StatData {
  value: number;
  suffix: string;
  label: string;
  sub: string;
  icon: string;
  accent: string;
  accentDim: string;
}

function useCounter(target: number, inView: boolean) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = Math.ceil(target / 40);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(start);
    }, 35);
    return () => clearInterval(timer);
  }, [inView, target]);
  return count;
}

function StatCard({ stat, i }: { stat: StatData; i: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  const [inView, setInView] = useState(false);
  const [particles, setParticles] = useState<{ id: number; x: number; y: number }[]>([]);
  const count = useCounter(stat.value, inView);

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const sp = { stiffness: 200, damping: 20, mass: 0.7 };
  const rotateX = useSpring(useTransform(rawY, [-0.5, 0.5], [12, -12]), sp);
  const rotateY = useSpring(useTransform(rawX, [-0.5, 0.5], [-12, 12]), sp);
  const glareX  = useSpring(useTransform(rawX, [-0.5, 0.5], [10, 90]), sp);
  const glareY  = useSpring(useTransform(rawY, [-0.5, 0.5], [10, 90]), sp);
  const shadowX = useSpring(useTransform(rawX, [-0.5, 0.5], [-20, 20]), sp);
  const shadowY = useSpring(useTransform(rawY, [-0.5, 0.5], [-20, 20]), sp);
  const boxShadow = useTransform([shadowX, shadowY], ([sx, sy]: number[]) =>
    `${sx}px ${sy}px 50px rgba(0,0,0,0.65), 0 0 0 1px ${stat.accent}22`);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    rawX.set((e.clientX - rect.left) / rect.width - 0.5);
    rawY.set((e.clientY - rect.top) / rect.height - 0.5);
    if (Math.random() > 0.75) {
      const id = Date.now() + Math.random();
      setParticles(p => [...p.slice(-6), { id, x: e.clientX - rect.left, y: e.clientY - rect.top }]);
      setTimeout(() => setParticles(p => p.filter(pt => pt.id !== id)), 700);
    }
  }, [rawX, rawY]);

  const handleLeave = useCallback(() => {
    rawX.set(0); rawY.set(0); setHovered(false); setParticles([]);
  }, [rawX, rawY]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 60, scale: 0.92 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      onViewportEnter={() => setInView(true)}
      viewport={{ once: false, margin: '-40px' }}
      transition={{ delay: i * 0.1, duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
      style={{ perspective: '900px' }}
    >
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={handleLeave}
        style={{
          rotateX, rotateY, boxShadow, transformStyle: 'preserve-3d',
          position: 'relative', borderRadius: '20px', background: 'rgba(11,15,14,0.8)',
          border: `1px solid ${stat.accent}22`, backdropFilter: 'blur(12px)',
          overflow: 'hidden', cursor: 'crosshair', padding: '36px 28px',
        }}
      >
        {/* Accent top bar */}
        <motion.div animate={{ scaleX: hovered ? 1 : 0.2, opacity: hovered ? 1 : 0.4 }}
          style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: `linear-gradient(90deg, ${stat.accent}, transparent)`, transformOrigin: 'left' }} />

        {/* Glare */}
        <motion.div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 3,
          background: useTransform([glareX, glareY], ([gx, gy]: number[]) =>
            `radial-gradient(circle at ${gx}% ${gy}%, rgba(255,255,255,0.09) 0%, transparent 55%)`),
          opacity: hovered ? 1 : 0, transition: 'opacity 0.3s',
        }} />

        {/* Bloom */}
        <motion.div animate={{ opacity: hovered ? 1 : 0 }}
          style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: `radial-gradient(ellipse 80% 60% at 50% 110%, ${stat.accentDim}, transparent 65%)` }} />

        {/* Scan line */}
        <motion.div
          animate={{ y: hovered ? '100%' : '-5%', opacity: hovered ? [0, 0.4, 0] : 0 }}
          transition={{ duration: 1.4, ease: 'linear', repeat: hovered ? Infinity : 0, repeatDelay: 1 }}
          style={{ position: 'absolute', left: 0, right: 0, height: '2px', zIndex: 4, background: `linear-gradient(90deg, transparent, ${stat.accent}, transparent)` }}
        />

        {/* Top row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
          <motion.div
            animate={{ scale: hovered ? 1.15 : 1, rotate: hovered ? 8 : 0, filter: hovered ? `drop-shadow(0 0 10px ${stat.accent})` : 'none' }}
            transition={{ type: 'spring', stiffness: 300, damping: 14 }}
            style={{ fontSize: '28px' }}
          >{stat.icon}</motion.div>
          <AnimatePresence>
            {hovered && (
              <motion.div initial={{ opacity: 0, scale: 0.6, x: 10 }} animate={{ opacity: 1, scale: 1, x: 0 }} exit={{ opacity: 0, scale: 0.6, x: 10 }}
                transition={{ type: 'spring', stiffness: 400, damping: 18 }}
                style={{ background: stat.accent, color: '#0b0f0e', borderRadius: '8px', padding: '4px 12px', fontSize: '10px', fontWeight: 700, whiteSpace: 'nowrap' }}
              >✦ LIVE</motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Counter */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '2px', marginBottom: '8px' }}>
          <motion.span animate={{ color: hovered ? stat.accent : '#c8ead6' }} transition={{ duration: 0.3 }}
            style={{ fontSize: '3rem', fontWeight: 900, lineHeight: 1, letterSpacing: '-2px' }}>
            {count}
          </motion.span>
          <motion.span animate={{ color: hovered ? stat.accent : 'rgba(200,234,214,0.4)' }}
            style={{ fontSize: '1.6rem', fontWeight: 800 }}>{stat.suffix}</motion.span>
        </div>

        {/* Underline */}
        <motion.div animate={{ width: hovered ? '40px' : '0px' }} transition={{ duration: 0.4 }}
          style={{ height: '2px', background: `linear-gradient(90deg, ${stat.accent}, transparent)`, borderRadius: '2px', marginBottom: '10px' }} />

        <p style={{ color: '#c8ead6', fontSize: '0.95rem', fontWeight: 700, margin: '0 0 4px' }}>{stat.label}</p>
        <p style={{ color: 'rgba(200,234,214,0.4)', fontSize: '0.75rem', margin: 0 }}>{stat.sub}</p>

        {/* Particles */}
        <AnimatePresence>
          {particles.map(pt => (
            <motion.div key={pt.id}
              initial={{ opacity: 1, scale: 1, x: pt.x - 4, y: pt.y - 4 }}
              animate={{ opacity: 0, scale: 3, x: pt.x - 4, y: pt.y - 40 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              style={{ position: 'absolute', width: 7, height: 7, borderRadius: '50%', background: stat.accent, boxShadow: `0 0 10px 3px ${stat.accent}88`, zIndex: 10, pointerEvents: 'none' }}
            />
          ))}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

export default function AboutStats({ data = {}, images = {} }: AboutStatsCMSData) {
  // CMS values with exact fallbacks
  const statsEyebrow = data.statsEyebrow || 'By The Numbers';
  const statsTitle1  = data.statsTitle1  || 'The';
  const statsTitle2  = data.statsTitle2  || 'Numbers';
  const statsTitle3  = data.statsTitle3  || 'Speak';
  const statsDesc    = data.statsDesc    || "Three years of consistent delivery, measurable results, and clients who keep coming back. Here's the proof.";

  const getStat = (valStr: string | undefined, defaultVal: number, defaultSuffix: string) => {
    if (!valStr) return { value: defaultVal, suffix: defaultSuffix };
    const num = parseInt(valStr) || 0;
    const suffix = valStr.replace(/^[0-9]+/, '');
    return { value: num, suffix };
  };

  const stat1 = getStat(data.stat1Value, 50, '+');
  const stat2 = getStat(data.stat2Value, 30, '+');
  const stat3 = getStat(data.stat3Value, 3, '+');
  const stat4 = getStat(data.stat4Value, 100, '%');
  const stat5 = getStat(data.stat5Value, 15, 'K+');
  const stat6 = getStat(data.stat6Value, 4, '');

  const statsList: StatData[] = [
    { value: stat1.value, suffix: stat1.suffix, label: data.stat1Label || 'Projects Shipped', sub: data.stat1Sub || 'Across 6 industries', icon: '🚀', accent: '#52b788', accentDim: 'rgba(82,183,136,0.12)' },
    { value: stat2.value, suffix: stat2.suffix, label: data.stat2Label || 'Happy Clients', sub: data.stat2Sub || 'Worldwide partnerships', icon: '🤝', accent: '#00e5ff', accentDim: 'rgba(0,229,255,0.12)' },
    { value: stat3.value, suffix: stat3.suffix, label: data.stat3Label || 'Years Experience', sub: data.stat3Sub || 'Continuous learning', icon: '📅', accent: '#ffca28', accentDim: 'rgba(255,202,40,0.12)' },
    { value: stat4.value, suffix: stat4.suffix, label: data.stat4Label || 'Satisfaction Rate', sub: data.stat4Sub || 'Zero dissatisfied clients', icon: '⭐', accent: '#76ff03', accentDim: 'rgba(118,255,3,0.1)' },
    { value: stat5.value, suffix: stat5.suffix, label: data.stat5Label || 'Lines of Code', sub: data.stat5Sub || 'Written with intention', icon: '💻', accent: '#ff6b6b', accentDim: 'rgba(255,107,107,0.12)' },
    { value: stat6.value, suffix: stat6.suffix, label: data.stat6Label || 'Core Services', sub: data.stat6Sub || 'Dev · Design · 3D · AI', icon: '⚡', accent: '#c77dff', accentDim: 'rgba(199,125,255,0.12)' },
  ];

  return (
    <section style={{ padding: '9rem 6vw', background: '#060e0b', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', backgroundImage: `linear-gradient(rgba(82,183,136,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(82,183,136,0.025) 1px, transparent 1px)`, backgroundSize: '64px 64px' }} />
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'radial-gradient(ellipse 70% 50% at 50% 50%, rgba(82,183,136,0.05), transparent 70%)' }} />

      <motion.div initial={{ opacity: 0, y: 48 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false }}
        transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
        style={{ textAlign: 'center', marginBottom: '5.5rem', position: 'relative', zIndex: 1 }}
      >
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', background: 'rgba(82,183,136,0.07)', border: '1px solid rgba(82,183,136,0.2)', padding: '7px 20px', borderRadius: '100px', marginBottom: '28px' }}>
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#52b788', boxShadow: '0 0 8px #52b788', display: 'inline-block', animation: 'pulseDot 1.8s ease infinite' }} />
          <span style={{ color: '#52b788', fontSize: '11px', fontWeight: 700, letterSpacing: '2.5px', textTransform: 'uppercase' }}>{statsEyebrow}</span>
        </div>
        <h2 style={{ fontWeight: 800, letterSpacing: '-1.5px', lineHeight: 1.05, marginBottom: '18px', color: '#e8f5ec', fontSize: 'clamp(2.2rem, 5.5vw, 4rem)' }}>
          {statsTitle1}{' '}
          <span style={{ background: 'linear-gradient(90deg, #52b788, #00e5ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>{statsTitle2}</span>
          {' '}{statsTitle3}
        </h2>
        <p style={{ color: 'rgba(232,245,236,0.45)', maxWidth: '440px', margin: '0 auto', fontSize: '1rem', lineHeight: 1.75 }}>
          {statsDesc}
        </p>
      </motion.div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        {statsList.map((s, i) => <StatCard key={i} stat={s} i={i} />)}
      </div>
      <style>{`@keyframes pulseDot { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.35;transform:scale(1.6)} }`}</style>
    </section>
  );
}