'use client';

import { useRef, useState, useCallback } from 'react';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';

/* CMS Data Types */
export interface ProcessCMSData {
  data?: Record<string, string>;
}

/* Default content — matches live website exactly */
const STEPS_DEFAULT = [
  {
    num: '01', title: 'Discovery', subtitle: 'Deep Dive', icon: '🔍',
    accent: '#52b788', accentDim: 'rgba(82,183,136,0.15)',
    desc: 'We start by understanding your vision, goals, and challenges inside out. I ask the right questions to uncover the true problem — not just the surface request.',
    details: ['In-depth strategy call (60–90 min)', 'Competitor & market analysis', 'User persona & journey mapping', 'Technical feasibility assessment', 'Scope, timeline & budget alignment'],
    duration: '1–2 days', deliverable: 'Project Brief',
  },
  {
    num: '02', title: 'Strategy', subtitle: 'Blueprint Phase', icon: '🗺️',
    accent: '#00e5ff', accentDim: 'rgba(0,229,255,0.12)',
    desc: 'Every pixel and every API route is planned before a single line of code is written. Architecture, UX flow, and automation logic all defined upfront.',
    details: ['Information architecture design', 'Wireframes & low-fi prototypes', 'Tech stack & database schema', 'API & automation workflow design', 'Design system & brand tokens'],
    duration: '2–4 days', deliverable: 'Figma Prototype',
  },
  {
    num: '03', title: 'Execution', subtitle: 'Build Phase', icon: '⚡',
    accent: '#ffca28', accentDim: 'rgba(255,202,40,0.12)',
    desc: 'Code written with obsessive attention to quality — clean architecture, pixel-perfect UI, and robust backend. Daily updates so you always know where we stand.',
    details: ['Next.js frontend + TypeScript', 'MongoDB Atlas + API routes', 'Admin CMS & dashboard', 'Cloudinary media management', 'Daily progress check-ins'],
    duration: '1–4 weeks', deliverable: 'Staging Build',
  },
  {
    num: '04', title: 'Delivery', subtitle: 'Launch & Scale', icon: '🚀',
    accent: '#76ff03', accentDim: 'rgba(118,255,3,0.1)',
    desc: 'Launch is just the beginning. I deploy on your VPS, hand over full admin access, and stick around for optimisation, feature additions, and growth support.',
    details: ['VPS deployment (Nginx + PM2)', 'Performance & SEO audit', 'Full admin handover & training', '30-day post-launch support', 'Analytics & growth tracking'],
    duration: '1–2 days', deliverable: 'Live Product',
  },
];

/* Merge CMS data over defaults */
function buildSteps(data: Record<string, string>) {
  return STEPS_DEFAULT.map((def, i) => {
    const n = i + 1;
    const details = [1,2,3,4,5].map(d => data[`processStep${n}Detail${d}`] || def.details[d-1]);
    return {
      ...def,
      title:       data[`processStep${n}Title`]       || def.title,
      subtitle:    data[`processStep${n}Subtitle`]    || def.subtitle,
      desc:        data[`processStep${n}Desc`]        || def.desc,
      duration:    data[`processStep${n}Duration`]    || def.duration,
      deliverable: data[`processStep${n}Deliverable`] || def.deliverable,
      details,
    };
  });
}

// Replaced by buildSteps — see above

// ── 3D Tilt Card ─────────────────────────────────────────────────────────────
interface ProcessStep {
  num: string; title: string; subtitle: string; icon: string;
  accent: string; accentDim: string;
  desc: string; details: string[]; duration: string; deliverable: string;
}
function ProcessCard({ step, index }: { step: ProcessStep; index: number }) {
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
  const shadowX = useSpring(useTransform(rawX, [-0.5, 0.5], [-24, 24]), sp);
  const shadowY = useSpring(useTransform(rawY, [-0.5, 0.5], [-24, 24]), sp);

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

  const handleLeave = useCallback(() => {
    rawX.set(0); rawY.set(0);
    setHovered(false); setParticles([]);
  }, [rawX, rawY]);

  const boxShadow = useTransform(
    [shadowX, shadowY],
    ([sx, sy]: number[]) =>
      `${sx}px ${sy}px 60px rgba(0,0,0,0.7), 0 0 0 1px ${step.accent}22`
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 70, scale: 0.92 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: false, margin: '-40px' }}
      transition={{ delay: index * 0.13, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      style={{ perspective: '900px' }}
    >
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={handleLeave}
        style={{
          rotateX, rotateY, boxShadow,
          transformStyle: 'preserve-3d',
          position: 'relative',
          borderRadius: '20px',
          background: 'rgba(11,15,14,0.8)',
          border: `1px solid ${step.accent}22`,
          backdropFilter: 'blur(12px)',
          overflow: 'hidden',
          cursor: 'crosshair',
          willChange: 'transform',
        }}
      >
        {/* Accent top bar */}
        <motion.div
          animate={{ scaleX: hovered ? 1 : 0.3, opacity: hovered ? 1 : 0.4 }}
          transition={{ duration: 0.4 }}
          style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: '3px',
            background: `linear-gradient(90deg, ${step.accent}, transparent)`,
            transformOrigin: 'left',
          }}
        />

        {/* Glare */}
        <motion.div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 3,
          background: useTransform([glareX, glareY], ([gx, gy]: number[]) =>
            `radial-gradient(circle at ${gx}% ${gy}%, rgba(255,255,255,0.1) 0%, transparent 55%)`),
          opacity: hovered ? 1 : 0,
          transition: 'opacity 0.3s',
        }} />

        {/* Bloom */}
        <motion.div
          animate={{ opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.4 }}
          style={{
            position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 1,
            background: `radial-gradient(ellipse 80% 60% at 50% 120%, ${step.accentDim}, transparent 65%)`,
          }}
        />

        {/* Scan line */}
        <motion.div
          animate={{ y: hovered ? '100%' : '-5%', opacity: hovered ? [0, 0.5, 0] : 0 }}
          transition={{ duration: 1.4, ease: 'linear', repeat: hovered ? Infinity : 0, repeatDelay: 1.2 }}
          style={{
            position: 'absolute', left: 0, right: 0, height: '2px', zIndex: 4, pointerEvents: 'none',
            background: `linear-gradient(90deg, transparent, ${step.accent}, transparent)`,
          }}
        />

        {/* Content */}
        <div style={{ padding: '36px 32px', position: 'relative', zIndex: 2 }}>

          {/* Top row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <motion.div
                animate={{
                  scale: hovered ? 1.15 : 1,
                  rotate: hovered ? 8 : 0,
                  filter: hovered ? `drop-shadow(0 0 10px ${step.accent})` : 'none',
                }}
                transition={{ type: 'spring', stiffness: 300, damping: 14 }}
                style={{ fontSize: '32px' }}
              >
                {step.icon}
              </motion.div>
              <div>
                <motion.p
                  animate={{ color: hovered ? step.accent : 'rgba(255,255,255,0.25)' }}
                  style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', margin: 0 }}
                >
                  {step.subtitle}
                </motion.p>
                <motion.span
                  animate={{ color: hovered ? step.accent : 'rgba(255,255,255,0.12)' }}
                  style={{ fontFamily: "'Syne', sans-serif", fontSize: '13px', fontWeight: 800, letterSpacing: '2px' }}
                >
                  {step.num}
                </motion.span>
              </div>
            </div>

            {/* Duration badge */}
            <AnimatePresence>
              {hovered && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.6, x: 10 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.6, x: 10 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 18 }}
                  style={{
                    background: step.accent, color: '#0b0f0e',
                    borderRadius: '10px', padding: '6px 14px',
                    fontSize: '11px', fontWeight: 700,
                    textAlign: 'center', whiteSpace: 'nowrap',
                  }}
                >
                  ⏱ {step.duration}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Title */}
          <h3 style={{
            fontFamily: "'Syne', sans-serif",
            color: '#e8f5ec', fontSize: '1.6rem', fontWeight: 800,
            margin: '0 0 14px', letterSpacing: '-0.5px', lineHeight: 1.1,
          }}>
            {step.title}
          </h3>

          {/* Animated underline */}
          <motion.div
            animate={{ width: hovered ? '48px' : '0px' }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            style={{ height: '2px', background: `linear-gradient(90deg, ${step.accent}, transparent)`, borderRadius: '2px', marginBottom: '16px' }}
          />

          {/* Description */}
          <p style={{ color: 'rgba(232,245,236,0.65)', lineHeight: 1.75, fontSize: '0.92rem', margin: '0 0 24px' }}>
            {step.desc}
          </p>

          {/* Checklist — reveals on hover */}
          <motion.div
            animate={{ opacity: hovered ? 1 : 0, height: hovered ? 'auto' : 0 }}
            transition={{ duration: 0.38 }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
              {step.details.map((d, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: hovered ? 1 : 0, x: hovered ? 0 : -12 }}
                  transition={{ delay: i * 0.05 + 0.1, duration: 0.3 }}
                  style={{ display: 'flex', alignItems: 'center', gap: '10px' }}
                >
                  <span style={{ color: step.accent, fontSize: '13px', fontWeight: 700, flexShrink: 0 }}>✓</span>
                  <span style={{ color: 'rgba(232,245,236,0.75)', fontSize: '13px' }}>{d}</span>
                </motion.div>
              ))}
            </div>

            {/* Deliverable */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              padding: '12px 16px', borderRadius: '12px',
              background: step.accentDim, border: `1px solid ${step.accent}33`,
            }}>
              <span style={{ fontSize: '14px' }}>📦</span>
              <span style={{ fontSize: '12px', color: step.accent, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>
                Deliverable: {step.deliverable}
              </span>
            </div>
          </motion.div>
        </div>

        {/* Particles */}
        <AnimatePresence>
          {particles.map(pt => (
            <motion.div key={pt.id}
              initial={{ opacity: 1, scale: 1, x: pt.x - 4, y: pt.y - 4 }}
              animate={{ opacity: 0, scale: 3, x: pt.x - 4, y: pt.y - 45 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.75, ease: 'easeOut' }}
              style={{
                position: 'absolute', width: 8, height: 8,
                borderRadius: '50%', background: step.accent,
                boxShadow: `0 0 12px 4px ${step.accent}88`,
                zIndex: 10, pointerEvents: 'none',
              }}
            />
          ))}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

// ── Main ─────────────────────────────────────────────────────────────────────
export default function Process({ data = {} }: ProcessCMSData) {
  const processSteps = buildSteps(data);
  const processHeading   = data.processHeading   || 'How We';
  const processHighlight = data.processHighlight  || 'Work';
  const processSubtext   = data.processSubtext    || 'A refined process built for consistent, world-class results — every single time.';
  return (
    <section style={{ padding: '9rem 6vw', background: '#0b0f0e', position: 'relative', overflow: 'hidden' }}>

      {/* Grid bg */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: `
          linear-gradient(rgba(82,183,136,0.025) 1px, transparent 1px),
          linear-gradient(90deg, rgba(82,183,136,0.025) 1px, transparent 1px)
        `,
        backgroundSize: '64px 64px',
      }} />
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse 70% 50% at 50% 50%, rgba(82,183,136,0.05) 0%, transparent 70%)',
      }} />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 48 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false }}
        transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
        style={{ textAlign: 'center', marginBottom: '5.5rem', position: 'relative', zIndex: 1 }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.7 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: false }}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '10px',
            background: 'rgba(82,183,136,0.07)', border: '1px solid rgba(82,183,136,0.2)',
            padding: '7px 20px', borderRadius: '100px', marginBottom: '28px',
          }}
        >
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#52b788', boxShadow: '0 0 8px #52b788', animation: 'pulseDot 1.8s ease infinite', flexShrink: 0 }} />
          <span style={{ color: '#52b788', fontSize: '11px', fontWeight: 700, letterSpacing: '2.5px', textTransform: 'uppercase' }}>Process</span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ delay: 0.1, duration: 0.7 }}
          style={{
            fontFamily: "'Syne', sans-serif", color: '#e8f5ec',
            fontSize: 'clamp(2.2rem, 5.5vw, 4rem)',
            fontWeight: 800, letterSpacing: '-1.5px', lineHeight: 1.05, marginBottom: '18px',
          }}
        >
          {processHeading}{' '}
          <span style={{ background: 'linear-gradient(90deg, #52b788, #00e5ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            {processHighlight}
          </span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: false }} transition={{ delay: 0.2 }}
          style={{ color: 'rgba(232,245,236,0.45)', maxWidth: '440px', margin: '0 auto', fontSize: '1rem', lineHeight: 1.75 }}
        >
          {processSubtext}
        </motion.p>
      </motion.div>

      {/* Grid */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '24px', maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1,
      }}>
        {processSteps.map((step, i) => (
          <ProcessCard key={i} step={step} index={i} />
        ))}
      </div>

      <style>{`
        @keyframes pulseDot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.35; transform: scale(1.6); }
        }
      `}</style>
    </section>
  );
}