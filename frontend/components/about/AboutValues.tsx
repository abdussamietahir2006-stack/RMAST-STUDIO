'use client';

import { useRef, useState, useCallback } from 'react';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';

export interface AboutValuesCMSData {
  data?: Record<string, string>;
  images?: Record<string, string>;
}

interface ValueData {
  title: string;
  icon: string;
  accent: string;
  accentDim: string;
  desc: string;
  tags: string[];
}

function ValueCard({ v, i }: { v: ValueData; i: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(true);
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
  const boxShadow = useTransform([shadowX, shadowY], ([sx, sy]: number[]) =>
    `${sx}px ${sy}px 50px rgba(0,0,0,0.65), 0 0 0 1px ${v.accent}22`);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    rawX.set((e.clientX - rect.left) / rect.width - 0.5);
    rawY.set((e.clientY - rect.top) / rect.height - 0.5);
    if (Math.random() > 0.75) {
      const id = Date.now() + Math.random();
      setParticles(p => [...p.slice(-5), { id, x: e.clientX - rect.left, y: e.clientY - rect.top }]);
      setTimeout(() => setParticles(p => p.filter(pt => pt.id !== id)), 700);
    }
  }, [rawX, rawY]);

  const handleLeave = useCallback(() => { rawX.set(0); rawY.set(0); setHovered(false); setParticles([]); }, [rawX, rawY]);

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
        style={{ rotateX, rotateY, boxShadow, transformStyle: 'preserve-3d', position: 'relative', borderRadius: '20px', background: 'rgba(11,15,14,0.8)', border: `1px solid ${v.accent}22`, backdropFilter: 'blur(12px)', overflow: 'hidden', cursor: 'crosshair', padding: '36px 30px' }}
      >
        <motion.div animate={{ scaleX: hovered ? 1 : 0.2, opacity: hovered ? 1 : 0.4 }}
          style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: `linear-gradient(90deg, ${v.accent}, transparent)`, transformOrigin: 'left' }} />

        <motion.div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 3,
          background: useTransform([glareX, glareY], ([gx, gy]: number[]) =>
            `radial-gradient(circle at ${gx}% ${gy}%, rgba(255,255,255,0.09) 0%, transparent 55%)`),
          opacity: hovered ? 1 : 0, transition: 'opacity 0.3s',
        }} />

        <motion.div animate={{ opacity: hovered ? 1 : 0 }}
          style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: `radial-gradient(ellipse 80% 60% at 50% 110%, ${v.accentDim}, transparent 65%)` }} />

        <motion.div
          animate={{ y: hovered ? '100%' : '-5%', opacity: hovered ? [0, 0.4, 0] : 0 }}
          transition={{ duration: 1.4, ease: 'linear', repeat: hovered ? Infinity : 0, repeatDelay: 1 }}
          style={{ position: 'absolute', left: 0, right: 0, height: '2px', zIndex: 4, background: `linear-gradient(90deg, transparent, ${v.accent}, transparent)` }}
        />

        {/* Top row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
          <motion.div
            animate={{ scale: hovered ? 1.15 : 1, rotate: hovered ? 8 : 0, filter: hovered ? `drop-shadow(0 0 10px ${v.accent})` : 'none' }}
            transition={{ type: 'spring', stiffness: 300, damping: 14 }}
            style={{ fontSize: '32px' }}
          >{v.icon}</motion.div>
          <motion.span animate={{ color: hovered ? v.accent : 'rgba(255,255,255,0.1)', fontSize: '13px' }}
            style={{ fontWeight: 800, letterSpacing: '2px' }}>{String(i + 1).padStart(2, '0')}</motion.span>
        </div>

        <motion.h3 animate={{ color: hovered ? v.accent : '#c8ead6' }} transition={{ duration: 0.3 }}
          style={{ fontSize: '1.2rem', fontWeight: 800, margin: '0 0 10px', letterSpacing: '-0.3px' }}>{v.title}</motion.h3>

        <motion.div animate={{ width: hovered ? '40px' : '0px' }} transition={{ duration: 0.4 }}
          style={{ height: '2px', background: `linear-gradient(90deg, ${v.accent}, transparent)`, borderRadius: '2px', marginBottom: '14px' }} />

        <p style={{ color: 'rgba(232,245,236,0.6)', lineHeight: 1.75, fontSize: '0.88rem', margin: '0 0 20px' }}>{v.desc}</p>

        {/* Tags — reveal on hover */}
        <motion.div animate={{ opacity: hovered ? 1 : 0, height: hovered ? 'auto' : 0 }} transition={{ duration: 0.35 }}
          style={{ overflow: 'hidden', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {v.tags.map(tag => (
            <motion.span key={tag} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: hovered ? 1 : 0, scale: hovered ? 1 : 0.8 }}
              transition={{ duration: 0.25 }}
              style={{ padding: '4px 12px', borderRadius: '100px', fontSize: '11px', fontWeight: 600, background: v.accentDim, border: `1px solid ${v.accent}33`, color: v.accent, letterSpacing: '0.5px' }}>
              {tag}
            </motion.span>
          ))}
        </motion.div>

        <AnimatePresence>
          {particles.map(pt => (
            <motion.div key={pt.id}
              initial={{ opacity: 1, scale: 1, x: pt.x - 4, y: pt.y - 4 }}
              animate={{ opacity: 0, scale: 3, x: pt.x - 4, y: pt.y - 40 }}
              exit={{ opacity: 0 }} transition={{ duration: 0.7, ease: 'easeOut' }}
              style={{ position: 'absolute', width: 7, height: 7, borderRadius: '50%', background: v.accent, boxShadow: `0 0 10px 3px ${v.accent}88`, zIndex: 10, pointerEvents: 'none' }}
            />
          ))}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

export default function AboutValues({ data = {}, images = {} }: AboutValuesCMSData) {
  // CMS values with exact fallbacks
  const valuesEyebrow = data.valuesEyebrow || 'Core Values';
  const valuesTitle1  = data.valuesTitle1  || 'What We Stand';
  const valuesTitle2  = data.valuesTitle2  || 'For';
  const valuesDesc    = data.valuesDesc    || "These aren't just buzzwords on a wall. They're the principles behind every decision, every pixel, and every product I ship. Hover to explore each one.";

  const valuesList: ValueData[] = [
    {
      title: data.value1Title || 'Precision',
      icon: '🎯',
      accent: '#52b788',
      accentDim: 'rgba(82,183,136,0.12)',
      desc: data.value1Desc || "Every pixel, every line of code is intentional. I don't ship until it's right — not just functional, but exceptional in every measurable way.",
      tags: (data.value1Tags || 'Pixel-perfect, Clean code, QA tested').split(',').map((t: string) => t.trim()).filter(Boolean),
    },
    {
      title: data.value2Title || 'Creativity',
      icon: '🎨',
      accent: '#00e5ff',
      accentDim: 'rgba(0,229,255,0.12)',
      desc: data.value2Desc || "Design is not decoration — it's strategy made visible. I craft interfaces that communicate, captivate, and convert at the same time.",
      tags: (data.value2Tags || 'Bold visuals, Original, Intentional').split(',').map((t: string) => t.trim()).filter(Boolean),
    },
    {
      title: data.value3Title || 'Innovation',
      icon: '⚡',
      accent: '#ffca28',
      accentDim: 'rgba(255,202,40,0.12)',
      desc: data.value3Desc || "Technology moves fast. I stay ahead — integrating AI, automation, and emerging tools so your product is built for tomorrow, not yesterday.",
      tags: (data.value3Tags || 'AI-powered, Future-ready, Cutting-edge').split(',').map((t: string) => t.trim()).filter(Boolean),
    },
    {
      title: data.value4Title || 'Consistency',
      icon: '🔁',
      accent: '#76ff03',
      accentDim: 'rgba(118,255,3,0.1)',
      desc: data.value4Desc || "Quality isn't a one-time event. Every project gets the same obsessive attention to detail, regardless of scope, budget, or complexity.",
      tags: (data.value4Tags || 'On-time, Reliable, World-class').split(',').map((t: string) => t.trim()).filter(Boolean),
    },
    {
      title: data.value5Title || 'Transparency',
      icon: '🔍',
      accent: '#ff6b6b',
      accentDim: 'rgba(255,107,107,0.12)',
      desc: data.value5Desc || "No hidden costs, no vague timelines. You get clear communication, daily progress updates, and a partner you can actually count on.",
      tags: (data.value5Tags || 'Open comms, No surprises, Honest').split(',').map((t: string) => t.trim()).filter(Boolean),
    },
    {
      title: data.value6Title || 'Impact',
      icon: '🚀',
      accent: '#c77dff',
      accentDim: 'rgba(199,125,255,0.12)',
      desc: data.value6Desc || "I don't build for the sake of building. Every decision is tied to your growth — more traffic, better conversions, smarter operations.",
      tags: (data.value6Tags || 'Results-driven, ROI-focused, Scalable').split(',').map((t: string) => t.trim()).filter(Boolean),
    },
  ];

  return (
    <section style={{ padding: '9rem 6vw', background: '#0b0f0e', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', backgroundImage: `linear-gradient(rgba(82,183,136,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(82,183,136,0.025) 1px, transparent 1px)`, backgroundSize: '64px 64px' }} />
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'radial-gradient(ellipse 70% 50% at 50% 50%, rgba(82,183,136,0.05), transparent 70%)' }} />

      <motion.div initial={{ opacity: 0, y: 48 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false }}
        transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
        style={{ textAlign: 'center', marginBottom: '5.5rem', position: 'relative', zIndex: 1 }}
      >
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', background: 'rgba(82,183,136,0.07)', border: '1px solid rgba(82,183,136,0.2)', padding: '7px 20px', borderRadius: '100px', marginBottom: '28px' }}>
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#52b788', boxShadow: '0 0 8px #52b788', display: 'inline-block', animation: 'pulseDot 1.8s ease infinite' }} />
          <span style={{ color: '#52b788', fontSize: '11px', fontWeight: 700, letterSpacing: '2.5px', textTransform: 'uppercase' }}>{valuesEyebrow}</span>
        </div>
        <h2 style={{ fontWeight: 800, letterSpacing: '-1.5px', lineHeight: 1.05, marginBottom: '18px', color: '#e8f5ec', fontSize: 'clamp(2.2rem, 5.5vw, 4rem)' }}>
          {valuesTitle1}{' '}
          <span style={{ background: 'linear-gradient(90deg, #52b788, #00e5ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>{valuesTitle2}</span>
        </h2>
        <p style={{ color: 'rgba(232,245,236,0.45)', maxWidth: '460px', margin: '0 auto', fontSize: '1rem', lineHeight: 1.75 }}>
          {valuesDesc}
        </p>
      </motion.div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: '20px', maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        {valuesList.map((v, i) => <ValueCard key={i} v={v} i={i} />)}
      </div>
      <style>{`@keyframes pulseDot { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.35;transform:scale(1.6)} }`}</style>
    </section>
  );
}