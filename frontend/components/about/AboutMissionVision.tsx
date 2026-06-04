'use client';

import { useRef, useState, useCallback } from 'react';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';

export interface AboutMvCMSData {
  data?: Record<string, string>;
  images?: Record<string, string>;
}

interface MVCardData {
  label: string;
  num: string;
  icon: string;
  accent: string;
  accentDim: string;
  headline: string;
  body: string;
  points: string[];
}

function MVCard({ card, i }: { card: MVCardData; i: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(true);
  const [particles, setParticles] = useState<{ id: number; x: number; y: number }[]>([]);

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const sp = { stiffness: 200, damping: 20, mass: 0.7 };
  const rotateX = useSpring(useTransform(rawY, [-0.5, 0.5], [10, -10]), sp);
  const rotateY = useSpring(useTransform(rawX, [-0.5, 0.5], [-10, 10]), sp);
  const glareX  = useSpring(useTransform(rawX, [-0.5, 0.5], [10, 90]), sp);
  const glareY  = useSpring(useTransform(rawY, [-0.5, 0.5], [10, 90]), sp);
  const shadowX = useSpring(useTransform(rawX, [-0.5, 0.5], [-24, 24]), sp);
  const shadowY = useSpring(useTransform(rawY, [-0.5, 0.5], [-24, 24]), sp);
  const boxShadow = useTransform([shadowX, shadowY], ([sx, sy]: number[]) =>
    `${sx}px ${sy}px 60px rgba(0,0,0,0.7), 0 0 0 1px ${card.accent}22`);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    rawX.set((e.clientX - rect.left) / rect.width - 0.5);
    rawY.set((e.clientY - rect.top) / rect.height - 0.5);
    if (Math.random() > 0.72) {
      const id = Date.now() + Math.random();
      setParticles(p => [...p.slice(-8), { id, x: e.clientX - rect.left, y: e.clientY - rect.top }]);
      setTimeout(() => setParticles(p => p.filter(pt => pt.id !== id)), 800);
    }
  }, [rawX, rawY]);

  const handleLeave = useCallback(() => { rawX.set(0); rawY.set(0); setHovered(false); setParticles([]); }, [rawX, rawY]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 70, scale: 0.92 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: false, margin: '-40px' }}
      transition={{ delay: i * 0.15, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      style={{ perspective: '900px' }}
    >
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={handleLeave}
        style={{ rotateX, rotateY, boxShadow, transformStyle: 'preserve-3d', position: 'relative', borderRadius: '24px', background: 'rgba(11,15,14,0.85)', border: `1px solid ${card.accent}22`, backdropFilter: 'blur(14px)', overflow: 'hidden', cursor: 'crosshair', padding: '44px 40px' }}
      >
        <motion.div animate={{ scaleX: hovered ? 1 : 0.2, opacity: hovered ? 1 : 0.4 }}
          style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: `linear-gradient(90deg, ${card.accent}, transparent)`, transformOrigin: 'left' }} />

        <motion.div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 3,
          background: useTransform([glareX, glareY], ([gx, gy]: number[]) =>
            `radial-gradient(circle at ${gx}% ${gy}%, rgba(255,255,255,0.1) 0%, transparent 55%)`),
          opacity: hovered ? 1 : 0, transition: 'opacity 0.3s',
        }} />

        <motion.div animate={{ opacity: hovered ? 1 : 0 }}
          style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: `radial-gradient(ellipse 80% 60% at 50% 120%, ${card.accentDim}, transparent 65%)` }} />

        <motion.div
          animate={{ y: hovered ? '100%' : '-5%', opacity: hovered ? [0, 0.4, 0] : 0 }}
          transition={{ duration: 1.4, ease: 'linear', repeat: hovered ? Infinity : 0, repeatDelay: 1.2 }}
          style={{ position: 'absolute', left: 0, right: 0, height: '2px', zIndex: 4, background: `linear-gradient(90deg, transparent, ${card.accent}, transparent)` }}
        />

        {/* Top */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <motion.div
              animate={{ scale: hovered ? 1.15 : 1, rotate: hovered ? 8 : 0, filter: hovered ? `drop-shadow(0 0 12px ${card.accent})` : 'none' }}
              transition={{ type: 'spring', stiffness: 300, damping: 14 }}
              style={{ fontSize: '36px' }}
            >{card.icon}</motion.div>
            <div>
              <motion.p animate={{ color: hovered ? card.accent : 'rgba(255,255,255,0.25)' }}
                style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', margin: 0 }}>{card.label}</motion.p>
              <motion.span animate={{ color: hovered ? card.accent : 'rgba(255,255,255,0.12)' }}
                style={{ fontSize: '13px', fontWeight: 800, letterSpacing: '2px' }}>{card.num}</motion.span>
            </div>
          </div>
          <AnimatePresence>
            {hovered && (
              <motion.div initial={{ opacity: 0, scale: 0.6, x: 10 }} animate={{ opacity: 1, scale: 1, x: 0 }} exit={{ opacity: 0, scale: 0.6, x: 10 }}
                transition={{ type: 'spring', stiffness: 400, damping: 18 }}
                style={{ background: card.accent, color: '#0b0f0e', borderRadius: '10px', padding: '6px 14px', fontSize: '11px', fontWeight: 700, whiteSpace: 'nowrap' }}
              >✦ RMAST</motion.div>
            )}
          </AnimatePresence>
        </div>

        <h3 style={{ color: '#e8f5ec', fontSize: '1.6rem', fontWeight: 800, margin: '0 0 12px', letterSpacing: '-0.5px', lineHeight: 1.15 }}>{card.headline}</h3>

        <motion.div animate={{ width: hovered ? '48px' : '0px' }} transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          style={{ height: '2px', background: `linear-gradient(90deg, ${card.accent}, transparent)`, borderRadius: '2px', marginBottom: '18px' }} />

        <p style={{ color: 'rgba(232,245,236,0.65)', lineHeight: 1.8, fontSize: '0.95rem', margin: '0 0 28px' }}>{card.body}</p>

        <motion.div animate={{ opacity: hovered ? 1 : 0, height: hovered ? 'auto' : 0 }} transition={{ duration: 0.38 }}
          style={{ overflow: 'hidden' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {card.points.map((p, j) => (
              <motion.div key={j}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: hovered ? 1 : 0, x: hovered ? 0 : -12 }}
                transition={{ delay: j * 0.06 + 0.1, duration: 0.3 }}
                style={{ display: 'flex', alignItems: 'center', gap: '10px' }}
              >
                <span style={{ color: card.accent, fontSize: '13px', fontWeight: 700, flexShrink: 0 }}>✓</span>
                <span style={{ color: 'rgba(232,245,236,0.75)', fontSize: '13px' }}>{p}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <AnimatePresence>
          {particles.map(pt => (
            <motion.div key={pt.id}
              initial={{ opacity: 1, scale: 1, x: pt.x - 4, y: pt.y - 4 }}
              animate={{ opacity: 0, scale: 3, x: pt.x - 4, y: pt.y - 45 }}
              exit={{ opacity: 0 }} transition={{ duration: 0.75, ease: 'easeOut' }}
              style={{ position: 'absolute', width: 8, height: 8, borderRadius: '50%', background: card.accent, boxShadow: `0 0 12px 4px ${card.accent}88`, zIndex: 10, pointerEvents: 'none' }}
            />
          ))}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

export default function AboutMissionVision({ data = {}, images = {} }: AboutMvCMSData) {
  // CMS values with exact fallbacks
  const mvEyebrow = data.mvEyebrow || 'Purpose';
  const mvTitle1  = data.mvTitle1  || 'Mission &';
  const mvTitle2  = data.mvTitle2  || 'Vision';
  const mvDesc    = data.mvDesc    || 'Purpose-driven work starts with knowing exactly why you do it. These are the principles that get me out of bed and behind the keyboard every single day.';

  const mvCards: MVCardData[] = [
    {
      label: 'Mission',
      num: '01',
      icon: '🎯',
      accent: '#52b788',
      accentDim: 'rgba(82,183,136,0.12)',
      headline: data.missionHeading || 'Elevate Every Brand We Touch',
      body: data.missionText || 'Our mission is to bridge the gap between visionary ideas and world-class digital execution. We partner with founders, startups, and businesses to build products that don\'t just work — they inspire, engage, and grow.',
      points: [
        data.missionPoint1 || 'Deliver measurable ROI on every engagement',
        data.missionPoint2 || 'Build with performance and scalability from day one',
        data.missionPoint3 || 'Treat every project as if it were our own startup',
        data.missionPoint4 || 'Never compromise on quality, never miss a deadline',
      ],
    },
    {
      label: 'Vision',
      num: '02',
      icon: '🔭',
      accent: '#00e5ff',
      accentDim: 'rgba(0,229,255,0.12)',
      headline: data.visionHeading || 'The Future-Ready Digital Studio',
      body: data.visionText || 'We envision a world where every business — regardless of size — has access to enterprise-grade design, development, and AI capabilities. RMAST will be the studio that makes that possible, one product at a time.',
      points: [
        data.visionPoint1 || 'Pioneer AI-native product design methodologies',
        data.visionPoint2 || 'Create an ecosystem of reusable, open-source tools',
        data.visionPoint3 || 'Build a team of world-class digital specialists',
        data.visionPoint4 || 'Become the benchmark for quality in our region',
      ],
    },
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
          <span style={{ color: '#52b788', fontSize: '11px', fontWeight: 700, letterSpacing: '2.5px', textTransform: 'uppercase' }}>{mvEyebrow}</span>
        </div>
        <h2 style={{ fontWeight: 800, letterSpacing: '-1.5px', lineHeight: 1.05, marginBottom: '18px', color: '#e8f5ec', fontSize: 'clamp(2.2rem, 5.5vw, 4rem)' }}>
          {mvTitle1}{' '}
          <span style={{ background: 'linear-gradient(90deg, #52b788, #00e5ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>{mvTitle2}</span>
        </h2>
        <p style={{ color: 'rgba(232,245,236,0.45)', maxWidth: '440px', margin: '0 auto', fontSize: '1rem', lineHeight: 1.75 }}>
          {mvDesc}
        </p>
      </motion.div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))', gap: '24px', maxWidth: '1100px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        {mvCards.map((c, i) => <MVCard key={i} card={c} i={i} />)}
      </div>
      <style>{`@keyframes pulseDot { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.35;transform:scale(1.6)} }`}</style>
    </section>
  );
}