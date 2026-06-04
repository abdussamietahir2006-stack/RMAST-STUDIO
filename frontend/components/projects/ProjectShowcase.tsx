'use client';

import { useRef, useState, useCallback } from 'react';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';

export default function ProjectShowcase({ data = {}, images = {} }: { data?: Record<string, string>; images?: Record<string, string> }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  const [particles, setParticles] = useState<{ id: number; x: number; y: number }[]>([]);

  const accent = '#52b788';
  const accentDim = 'rgba(82,183,136,0.15)';

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const sp = { stiffness: 160, damping: 22, mass: 0.8 };
  const rotateX = useSpring(useTransform(rawY, [-0.5, 0.5], [6, -6]), sp);
  const rotateY = useSpring(useTransform(rawX, [-0.5, 0.5], [-6, 6]), sp);
  const glareX  = useSpring(useTransform(rawX, [-0.5, 0.5], [10, 90]), sp);
  const glareY  = useSpring(useTransform(rawY, [-0.5, 0.5], [10, 90]), sp);
  const shadowX = useSpring(useTransform(rawX, [-0.5, 0.5], [-32, 32]), sp);
  const shadowY = useSpring(useTransform(rawY, [-0.5, 0.5], [-32, 32]), sp);

  const title = data.showcaseTitle || 'Nexus E-Commerce Platform';
  const subtitle = data.showcaseSubtitle || 'Full-Stack · Web';
  const desc = data.showcaseDesc || 'A performance-obsessed storefront built for a D2C fashion brand — real-time inventory, AI-powered recommendations, custom CMS, Stripe checkout, and a Lighthouse score of 99. Launched in 6 weeks.';
  const image = images.showcaseImage || 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=1200&q=85';
  const year = data.showcaseYear || '2024';
  const link = data.showcaseLink || '#';

  const stack = data.showcaseStack 
    ? data.showcaseStack.split(',').map(s => s.trim()).filter(Boolean) 
    : ['Next.js', 'TypeScript', 'MongoDB Atlas', 'Stripe', 'Cloudinary', 'Nginx + PM2'];

  const metricsList = [
    { value: data.showcaseMetric1Value || '99', label: data.showcaseMetric1Label || 'Lighthouse' },
    { value: data.showcaseMetric2Value || '< 1s', label: data.showcaseMetric2Label || 'Load Time' },
    { value: data.showcaseMetric3Value || '+42%', label: data.showcaseMetric3Label || 'Conversion' },
    { value: data.showcaseMetric4Value || '99.9%', label: data.showcaseMetric4Label || 'Uptime' },
  ];

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    rawX.set((e.clientX - rect.left) / rect.width - 0.5);
    rawY.set((e.clientY - rect.top) / rect.height - 0.5);
    if (Math.random() > 0.75) {
      const id = Date.now() + Math.random();
      setParticles(p => [...p.slice(-6), { id, x: e.clientX - rect.left, y: e.clientY - rect.top }]);
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
      `${sx}px ${sy}px 80px rgba(0,0,0,0.8), 0 0 0 1px ${accent}22`
  );

  return (
    <section style={{
      padding: '2rem 6vw 5rem',
      background: '#0b0f0e',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Section label */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        style={{ textAlign: 'center', marginBottom: '2.5rem' }}
      >
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '10px',
          background: 'rgba(82,183,136,0.07)', border: '1px solid rgba(82,183,136,0.2)',
          padding: '7px 20px', borderRadius: '100px',
        }}>
          <span style={{
            width: 7, height: 7, borderRadius: '50%', background: '#52b788',
            boxShadow: '0 0 8px #52b788', display: 'inline-block',
            animation: 'pulseDot 1.8s ease infinite', flexShrink: 0,
          }} />
          <span style={{ color: '#52b788', fontSize: '11px', fontWeight: 700, letterSpacing: '2.5px', textTransform: 'uppercase' }}>
            Featured Project
          </span>
        </div>
      </motion.div>

      {/* 3D Showcase card */}
      <motion.div
        initial={{ opacity: 0, y: 60, scale: 0.94 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: false, margin: '-60px' }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        style={{ perspective: '1000px', maxWidth: '1100px', margin: '0 auto' }}
      >
        <motion.div
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={handleLeave}
          style={{
            rotateX, rotateY, boxShadow,
            transformStyle: 'preserve-3d',
            position: 'relative', borderRadius: '24px',
            background: 'rgba(11,15,14,0.85)',
            border: `1px solid ${accent}22`,
            backdropFilter: 'blur(14px)',
            overflow: 'hidden', cursor: 'crosshair',
          }}
        >
          {/* Accent top bar */}
          <motion.div
            animate={{ scaleX: hovered ? 1 : 0.3, opacity: hovered ? 1 : 0.4 }}
            transition={{ duration: 0.4 }}
            style={{
              position: 'absolute', top: 0, left: 0, right: 0, height: '3px',
              background: `linear-gradient(90deg, ${accent}, #00e5ff, transparent)`,
              transformOrigin: 'left', zIndex: 5,
            }}
          />

          {/* Glare */}
          <motion.div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 3,
            background: useTransform([glareX, glareY], ([gx, gy]: number[]) =>
              `radial-gradient(circle at ${gx}% ${gy}%, rgba(255,255,255,0.08) 0%, transparent 55%)`),
            opacity: hovered ? 1 : 0, transition: 'opacity 0.3s',
          }} />

          {/* Bloom */}
          <motion.div
            animate={{ opacity: hovered ? 1 : 0 }}
            transition={{ duration: 0.4 }}
            style={{
              position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 1,
              background: `radial-gradient(ellipse 80% 50% at 50% 110%, ${accentDim}, transparent 65%)`,
            }}
          />

          {/* Scan line */}
          <motion.div
            animate={{ y: hovered ? '100%' : '-5%', opacity: hovered ? [0, 0.4, 0] : 0 }}
            transition={{ duration: 1.6, ease: 'linear', repeat: hovered ? Infinity : 0, repeatDelay: 1.5 }}
            style={{
              position: 'absolute', left: 0, right: 0, height: '2px', zIndex: 4, pointerEvents: 'none',
              background: `linear-gradient(90deg, transparent, ${accent}, #00e5ff, transparent)`,
            }}
          />

          {/* Two-col layout */}
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))',
            minHeight: '420px',
          }}>
            {/* Left: image */}
            <div style={{ position: 'relative', overflow: 'hidden', minHeight: '420px' }}>
              <motion.img
                src={image}
                alt={title}
                animate={{ scale: hovered ? 1.06 : 1 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  width: '100%', height: '100%', objectFit: 'cover',
                  filter: hovered ? 'brightness(0.65)' : 'brightness(0.45) saturate(0.8)',
                  transition: 'filter 0.5s ease',
                  display: 'block',
                }}
              />
              <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(90deg, transparent 60%, rgba(11,15,14,0.95) 100%), linear-gradient(180deg, transparent 60%, rgba(11,15,14,0.6) 100%)',
              }} />
              {/* Year badge */}
              <div style={{
                position: 'absolute', bottom: '20px', left: '20px',
                fontFamily: "'Syne', sans-serif", color: accent,
                fontSize: '11px', fontWeight: 800, letterSpacing: '2px',
                opacity: 0.7,
              }}>
                {year}
              </div>
            </div>

            {/* Right: content */}
            <div style={{ padding: '44px 40px', position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              {/* Subtitle */}
              <motion.p
                animate={{ color: hovered ? accent : 'rgba(232,245,236,0.3)' }}
                style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', margin: '0 0 14px' }}
              >
                {subtitle}
              </motion.p>

              <h2 style={{
                fontFamily: "'Syne', sans-serif",
                color: '#e8f5ec', fontSize: 'clamp(1.6rem, 2.5vw, 2.2rem)',
                fontWeight: 800, letterSpacing: '-0.8px', lineHeight: 1.1, margin: '0 0 14px',
              }}>
                {title}
              </h2>

              <motion.div
                animate={{ width: hovered ? '56px' : '0px' }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                style={{ height: '2px', background: `linear-gradient(90deg, ${accent}, transparent)`, borderRadius: '2px', marginBottom: '18px' }}
              />

              <p style={{ color: 'rgba(232,245,236,0.6)', lineHeight: 1.75, fontSize: '0.9rem', margin: '0 0 24px', maxWidth: '380px' }}>
                {desc}
              </p>

              {/* Metrics */}
              <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', marginBottom: '24px' }}>
                {metricsList.map((m, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 14 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false }}
                    transition={{ delay: i * 0.08 + 0.2 }}
                    style={{
                      padding: '10px 16px', borderRadius: '12px',
                      background: accentDim, border: `1px solid ${accent}33`,
                      textAlign: 'center',
                    }}
                  >
                    <div style={{ fontFamily: "'Syne', sans-serif", color: accent, fontSize: '1.15rem', fontWeight: 800, lineHeight: 1 }}>
                      {m.value}
                    </div>
                    <div style={{ color: 'rgba(232,245,236,0.35)', fontSize: '9px', letterSpacing: '1.5px', textTransform: 'uppercase', marginTop: '4px' }}>
                      {m.label}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Stack */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '28px' }}>
                {stack.map((tech, i) => (
                  <motion.span
                    key={i}
                    whileHover={{ scale: 1.08, y: -2 }}
                    style={{
                      padding: '5px 12px', borderRadius: '7px',
                      background: `${accent}10`, border: `1px solid ${accent}28`,
                      color: accent, fontSize: '11px', fontWeight: 600,
                      letterSpacing: '0.5px', cursor: 'default',
                    }}
                  >
                    {tech}
                  </motion.span>
                ))}
              </div>

              {/* CTA */}
              <AnimatePresence>
                {hovered && (
                  <motion.a
                    href={link}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.3 }}
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: '8px',
                      background: `linear-gradient(135deg, ${accent}, #00e5ff)`,
                      color: '#0b0f0e', padding: '12px 24px', borderRadius: '12px',
                      fontFamily: "'Syne', sans-serif", fontWeight: 800,
                      fontSize: '12px', letterSpacing: '1.5px', textTransform: 'uppercase',
                      textDecoration: 'none', alignSelf: 'flex-start',
                      boxShadow: `0 0 28px ${accent}55`,
                    }}
                  >
                    View Case Study →
                  </motion.a>
                )}
              </AnimatePresence>
            </div>
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
                  borderRadius: '50%', background: accent,
                  boxShadow: `0 0 12px 4px ${accent}88`,
                  zIndex: 10, pointerEvents: 'none',
                }}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      </motion.div>

      <style>{`
        @keyframes pulseDot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.35; transform: scale(1.6); }
        }
        @media (max-width: 768px) {
          .showcase-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}