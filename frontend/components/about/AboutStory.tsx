'use client';

import { useRef, useState, useCallback } from 'react';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';

export interface AboutStoryCMSData {
  data?: Record<string, string>;
  images?: Record<string, string>;
}

interface Milestone {
  year: string;
  title: string;
  desc: string;
  accent: string;
}

function MilestoneCard({ m, i }: { m: Milestone; i: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  const [particles, setParticles] = useState<{ id: number; x: number; y: number }[]>([]);

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const sp = { stiffness: 200, damping: 20, mass: 0.7 };
  const rotateX = useSpring(useTransform(rawY, [-0.5, 0.5], [12, -12]), sp);
  const rotateY = useSpring(useTransform(rawX, [-0.5, 0.5], [-12, 12]), sp);
  const glareX  = useSpring(useTransform(rawX, [-0.5, 0.5], [10, 90]), sp);
  const glareY  = useSpring(useTransform(rawY, [-0.5, 0.5], [10, 90]), sp);
  const shadowX = useSpring(useTransform(rawX, [-0.5, 0.5], [-20, 20]), sp);
  const shadowY = useSpring(useTransform(rawY, [-0.5, 0.5], [-20, 20]), sp);

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

  const boxShadow = useTransform([shadowX, shadowY], ([sx, sy]: number[]) =>
    `${sx}px ${sy}px 50px rgba(0,0,0,0.6), 0 0 0 1px ${m.accent}22`);

  return (
    <motion.div
      initial={{ opacity: 0, y: 60, scale: 0.92 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
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
          rotateX, rotateY, boxShadow,
          transformStyle: 'preserve-3d', position: 'relative',
          borderRadius: '20px', background: 'rgba(11,15,14,0.8)',
          border: `1px solid ${m.accent}22`, backdropFilter: 'blur(12px)',
          overflow: 'hidden', cursor: 'crosshair', padding: '32px 28px',
        }}
      >
        {/* Accent top bar */}
        <motion.div animate={{ scaleX: hovered ? 1 : 0.2, opacity: hovered ? 1 : 0.3 }}
          style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: `linear-gradient(90deg, ${m.accent}, transparent)`, transformOrigin: 'left' }} />

        {/* Glare */}
        <motion.div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 3,
          background: useTransform([glareX, glareY], ([gx, gy]: number[]) =>
            `radial-gradient(circle at ${gx}% ${gy}%, rgba(255,255,255,0.09) 0%, transparent 55%)`),
          opacity: hovered ? 1 : 0, transition: 'opacity 0.3s',
        }} />

        {/* Bloom */}
        <motion.div animate={{ opacity: hovered ? 1 : 0 }} transition={{ duration: 0.4 }}
          style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: `radial-gradient(ellipse 80% 60% at 50% 110%, ${m.accent}15, transparent 65%)` }} />

        {/* Scan line */}
        <motion.div
          animate={{ y: hovered ? '100%' : '-5%', opacity: hovered ? [0, 0.4, 0] : 0 }}
          transition={{ duration: 1.4, ease: 'linear', repeat: hovered ? Infinity : 0, repeatDelay: 1 }}
          style={{ position: 'absolute', left: 0, right: 0, height: '2px', zIndex: 4, background: `linear-gradient(90deg, transparent, ${m.accent}, transparent)` }}
        />

        {/* Year badge */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <motion.div
            animate={{ background: hovered ? m.accent : `${m.accent}22`, color: hovered ? '#0b0f0e' : m.accent }}
            transition={{ duration: 0.3 }}
            style={{ padding: '5px 14px', borderRadius: '100px', fontSize: '11px', fontWeight: 800, letterSpacing: '2px', border: `1px solid ${m.accent}44` }}
          >
            {m.year}
          </motion.div>
          <motion.div animate={{ filter: hovered ? `drop-shadow(0 0 8px ${m.accent})` : 'none', rotate: hovered ? 15 : 0 }}
            style={{ fontSize: '20px', opacity: 0.6 }}>✦</motion.div>
        </div>

        {/* Title */}
        <motion.h3 animate={{ color: hovered ? m.accent : '#c8ead6' }} transition={{ duration: 0.3 }}
          style={{ fontSize: '1.15rem', fontWeight: 800, margin: '0 0 10px', letterSpacing: '-0.3px' }}>
          {m.title}
        </motion.h3>

        {/* Underline */}
        <motion.div animate={{ width: hovered ? '40px' : '0px' }} transition={{ duration: 0.4 }}
          style={{ height: '2px', background: `linear-gradient(90deg, ${m.accent}, transparent)`, borderRadius: '2px', marginBottom: '14px' }} />

        {/* Desc */}
        <p style={{ color: 'rgba(232,245,236,0.6)', lineHeight: 1.75, fontSize: '0.88rem', margin: 0 }}>{m.desc}</p>

        {/* Particles */}
        <AnimatePresence>
          {particles.map(pt => (
            <motion.div key={pt.id}
              initial={{ opacity: 1, scale: 1, x: pt.x - 4, y: pt.y - 4 }}
              animate={{ opacity: 0, scale: 3, x: pt.x - 4, y: pt.y - 40 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              style={{ position: 'absolute', width: 7, height: 7, borderRadius: '50%', background: m.accent, boxShadow: `0 0 10px 3px ${m.accent}88`, zIndex: 10, pointerEvents: 'none' }}
            />
          ))}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

export default function AboutStory({ data = {}, images = {} }: AboutStoryCMSData) {
  // CMS values with exact fallbacks
  const storyEyebrow = data.storyEyebrow || 'Origin Story';
  const storyTitle1  = data.storyTitle1  || 'How We';
  const storyTitle2  = data.storyTitle2  || 'Got Here';
  const storyDesc    = data.storyDesc    || 'Every great studio has an origin. Mine started with curiosity, grew through obsession, and is now driven by purpose. Hover the cards to explore the journey.';

  const storyMilestones: Milestone[] = [
    {
      year: data.milestone1Year || '2021',
      title: data.milestone1Title || 'First Line of Code',
      desc: data.milestone1Desc || 'Started with HTML & CSS — built my first landing page and fell in love with the craft.',
      accent: '#52b788'
    },
    {
      year: data.milestone2Year || '2022',
      title: data.milestone2Title || 'Full-Stack Jump',
      desc: data.milestone2Desc || 'Mastered React, Node.js, and MongoDB. Built 10+ client projects end-to-end.',
      accent: '#00e5ff'
    },
    {
      year: data.milestone3Year || '2023',
      title: data.milestone3Title || 'Design & 3D Era',
      desc: data.milestone3Desc || 'Picked up Figma, Blender and Three.js — started creating cinematic digital experiences.',
      accent: '#ffca28'
    },
    {
      year: data.milestone4Year || '2024',
      title: data.milestone4Title || 'AI Automation',
      desc: data.milestone4Desc || 'Integrated LLM pipelines, n8n workflows, and custom AI agents into client products.',
      accent: '#76ff03'
    },
    {
      year: data.milestone5Year || '2025',
      title: data.milestone5Title || 'RMAST Studio',
      desc: data.milestone5Desc || 'Launched as a solo digital studio — delivering premium full-service solutions globally.',
      accent: '#52b788'
    },
  ];

  return (
    <section style={{ padding: '9rem 6vw', background: '#0b0f0e', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', backgroundImage: `linear-gradient(rgba(82,183,136,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(82,183,136,0.025) 1px, transparent 1px)`, backgroundSize: '64px 64px' }} />
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(82,183,136,0.05), transparent 70%)' }} />

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 48 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false }}
        transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
        style={{ textAlign: 'center', marginBottom: '5.5rem', position: 'relative', zIndex: 1 }}
      >
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', background: 'rgba(82,183,136,0.07)', border: '1px solid rgba(82,183,136,0.2)', padding: '7px 20px', borderRadius: '100px', marginBottom: '28px' }}>
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#52b788', boxShadow: '0 0 8px #52b788', display: 'inline-block', animation: 'pulseDot 1.8s ease infinite' }} />
          <span style={{ color: '#52b788', fontSize: '11px', fontWeight: 700, letterSpacing: '2.5px', textTransform: 'uppercase' }}>{storyEyebrow}</span>
        </div>
        <h2 style={{ fontWeight: 800, letterSpacing: '-1.5px', lineHeight: 1.05, marginBottom: '18px', color: '#e8f5ec', fontSize: 'clamp(2.2rem, 5.5vw, 4rem)' }}>
          {storyTitle1}{' '}
          <span style={{ background: 'linear-gradient(90deg, #52b788, #00e5ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>{storyTitle2}</span>
        </h2>
        <p style={{ color: 'rgba(232,245,236,0.45)', maxWidth: '480px', margin: '0 auto', fontSize: '1rem', lineHeight: 1.75 }}>
          {storyDesc}
        </p>
      </motion.div>

      {/* Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px', maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        {storyMilestones.map((m, i) => <MilestoneCard key={i} m={m} i={i} />)}
      </div>

      <style>{`@keyframes pulseDot { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.35;transform:scale(1.6)} }`}</style>
    </section>
  );
}