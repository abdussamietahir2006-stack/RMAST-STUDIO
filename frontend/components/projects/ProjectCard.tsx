'use client';

import { useRef, useState, useCallback } from 'react';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';

type Project = {
  title?: string;
  desc?: string;
  category?: string;
  image?: string;
  accent?: string;
  accentDim?: string;
  stack?: string[];
  link?: string;
  github?: string;
  year?: string;
};

type Props = {
  project: Project;
  index?: number;
};

const CATEGORY_ACCENTS: Record<string, { accent: string; accentDim: string }> = {
  Web: { accent: '#52b788', accentDim: 'rgba(82,183,136,0.15)' },
  '3D': { accent: '#ffca28', accentDim: 'rgba(255,202,40,0.12)' },
  AI: { accent: '#76ff03', accentDim: 'rgba(118,255,3,0.1)' },
  General: { accent: '#00e5ff', accentDim: 'rgba(0,229,255,0.12)' },
};

export default function ProjectCard({ project, index = 0 }: Props) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  const [particles, setParticles] = useState<{ id: number; x: number; y: number }[]>([]);

  const safe = {
    title: project?.title || 'Untitled',
    desc: project?.desc || 'No description available.',
    category: project?.category || 'General',
    image: project?.image || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80',
    stack: project?.stack || [],
    link: project?.link || '',
    github: project?.github || '',
    year: project?.year || '2024',
  };

  const colors = CATEGORY_ACCENTS[safe.category] || CATEGORY_ACCENTS['General'];
  const accent = project?.accent || colors.accent;
  const accentDim = project?.accentDim || colors.accentDim;

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
      `${sx}px ${sy}px 60px rgba(0,0,0,0.75), 0 0 0 1px ${accent}22`
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 70, scale: 0.92 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: false, margin: '-40px' }}
      transition={{ delay: index * 0.1, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
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
          borderRadius: '18px',
          background: 'rgba(6,12,9,0.88)',
          border: `1px solid ${accent}22`,
          backdropFilter: 'blur(20px)',
          overflow: 'hidden',
          cursor: 'crosshair',
          willChange: 'transform',
          height: '100%',
          width: '280px',
          margin: '0 auto',
        }}
      >
        {/* Accent top bar */}
        <motion.div
          animate={{ scaleX: hovered ? 1 : 0.3, opacity: hovered ? 1 : 0.4 }}
          transition={{ duration: 0.4 }}
          style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: '3px',
            background: `linear-gradient(90deg, ${accent}, transparent)`,
            transformOrigin: 'left', zIndex: 5,
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
            background: `radial-gradient(ellipse 80% 60% at 50% 120%, ${accentDim}, transparent 65%)`,
          }}
        />

        {/* Scan line */}
        <motion.div
          animate={{ y: hovered ? '100%' : '-5%', opacity: hovered ? [0, 0.5, 0] : 0 }}
          transition={{ duration: 1.4, ease: 'linear', repeat: hovered ? Infinity : 0, repeatDelay: 1.2 }}
          style={{
            position: 'absolute', left: 0, right: 0, height: '2px', zIndex: 4, pointerEvents: 'none',
            background: `linear-gradient(90deg, transparent, ${accent}, transparent)`,
          }}
        />

        {/* Project Image */}
        <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', overflow: 'hidden' }}>
          <motion.img
            src={safe.image}
            alt={safe.title}
            animate={{ scale: hovered ? 1.07 : 1 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            style={{
              width: '100%', height: '100%', objectFit: 'cover',
              filter: hovered ? 'brightness(0.65) saturate(1.1)' : 'brightness(0.5) saturate(0.8)',
              transition: 'filter 0.4s ease',
              display: 'block',
            }}
          />
          {/* Fade overlay */}
          <div style={{
            position: 'absolute', inset: 0,
            background: `linear-gradient(180deg, transparent 35%, rgba(11,15,14,0.98) 100%), linear-gradient(180deg, ${accent}18 0%, transparent 60%)`,
            zIndex: 1,
          }} />
          {/* Year + category badge */}
          <div style={{
            position: 'absolute', top: '12px', left: '14px', right: '14px',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 2,
          }}>
            <span style={{
              background: accentDim, border: `1px solid ${accent}44`,
              color: accent, fontSize: '9px', fontWeight: 700,
              letterSpacing: '2px', textTransform: 'uppercase',
              padding: '4px 10px', borderRadius: '6px',
            }}>
              {safe.category}
            </span>
            <span style={{
              color: 'rgba(232,245,236,0.35)', fontSize: '10px',
              fontFamily: "'Syne', sans-serif", fontWeight: 700, letterSpacing: '1px',
            }}>
              {safe.year}
            </span>
          </div>

          {/* Hover CTA overlay */}
          <AnimatePresence>
            {hovered && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                style={{
                  position: 'absolute', inset: 0, zIndex: 3,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: 'rgba(5, 9, 7, 0.5)',
                  backdropFilter: 'blur(5px)',
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center', width: '100%', padding: '0 24px' }}>
                  {safe.link && safe.link !== '#' && (
                    <motion.a
                      href={safe.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      initial={{ scale: 0.7, y: 10 }}
                      animate={{ scale: 1, y: 0 }}
                      exit={{ scale: 0.7, y: 10 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 18 }}
                      whileHover={{ scale: 1.05, boxShadow: `0 0 20px ${accent}` }}
                      style={{
                        background: accent, color: '#0b0f0e',
                        padding: '9px 22px', borderRadius: '10px',
                        fontFamily: "'Syne', sans-serif", fontWeight: 800,
                        fontSize: '11px', letterSpacing: '1.5px', textTransform: 'uppercase',
                        textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px',
                        boxShadow: `0 0 24px ${accent}44`,
                        width: '140px', justifyContent: 'center', boxSizing: 'border-box'
                      }}
                    >
                      <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="13" width="13" xmlns="http://www.w3.org/2000/svg"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                      Live Demo
                    </motion.a>
                  )}
                  {safe.github && safe.github !== '#' && (
                    <motion.a
                      href={safe.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      initial={{ scale: 0.7, y: 10 }}
                      animate={{ scale: 1, y: 0 }}
                      exit={{ scale: 0.7, y: 10 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 18, delay: 0.05 }}
                      whileHover={{ scale: 1.05, background: 'rgba(255, 255, 255, 0.08)' }}
                      style={{
                        background: 'rgba(11,15,14,0.85)', color: '#e8f5ec',
                        border: '1px solid rgba(232, 245, 236, 0.2)',
                        padding: '9px 22px', borderRadius: '10px',
                        fontFamily: "'Syne', sans-serif", fontWeight: 800,
                        fontSize: '11px', letterSpacing: '1.5px', textTransform: 'uppercase',
                        textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px',
                        width: '140px', justifyContent: 'center', boxSizing: 'border-box'
                      }}
                    >
                      <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 1024 1024" height="14" width="14" xmlns="http://www.w3.org/2000/svg"><path d="M511.6 76.3C264.3 76.2 64 276.4 64 523.5 64 721 192 888.4 369.6 947.4c22.4 4.1 30.6-9.7 30.6-21.6 0-10.7-.4-39-.4-76.6-124.5 27-150.8-60-150.8-60-20.4-51.8-49.7-65.6-49.7-65.6-40.6-27.8 3.1-27.3 3.1-27.3 44.9 3.2 68.6 46.1 68.6 46.1 40 68.5 104.9 48.7 130.5 37.2 4.1-29 15.6-48.7 28.4-59.9-99.4-11.3-203.9-49.7-203.9-221.2 0-48.8 17.4-88.8 46-119.9-4.6-11.3-20-56.7 4.4-118.2 0 0 37.5-12 123 45.8A427.3 427.3 0 0 1 512 282.8c28.9.1 57.9 3.9 85.3 11.5 85.4-57.8 122.9-45.8 122.9-45.8 24.4 61.5 9 106.9 4.4 118.2 28.7 31.1 46 71.1 46 119.9 0 171.9-104.6 209.7-204.3 220.8 16.1 13.8 30.5 41.2 30.5 83 0 59.9-.5 108.2-.5 123 0 12 8.1 25.9 30.8 21.5C832.1 888.3 960 720.9 960 523.5 960 276.4 759.7 76.3 511.6 76.3z"></path></svg>
                      GitHub
                    </motion.a>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Content */}
        <div style={{ padding: '14px 16px 18px', position: 'relative', zIndex: 2 }}>
          {/* Title */}
          <h3 style={{
            fontFamily: "'Syne', sans-serif",
            color: '#e8f5ec', fontSize: '0.95rem', fontWeight: 800,
            margin: '0 0 6px', letterSpacing: '-0.2px', lineHeight: 1.2,
          }}>
            {safe.title}
          </h3>

          {/* Animated underline */}
          <motion.div
            animate={{ width: hovered ? '40px' : '0px' }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            style={{
              height: '2px', background: `linear-gradient(90deg, ${accent}, transparent)`,
              borderRadius: '2px', marginBottom: '12px',
            }}
          />

          <p style={{
            color: 'rgba(200,234,214,0.45)',
            lineHeight: 1.65,
            fontSize: '0.71rem',
            margin: '0 0 12px',
            position: 'relative',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}>
            {safe.desc}
          </p>

          {/* Stack tags */}
          {safe.stack.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '7px' }}>
              {safe.stack.map((tech, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: false }}
                  transition={{ delay: i * 0.04, type: 'spring', stiffness: 400, damping: 18 }}
                  whileHover={{ scale: 1.08, y: -2 }}
                  style={{
                    padding: '2px 8px', borderRadius: '5px',
                    background: `${accent}12`, border: `1px solid ${accent}28`,
                    color: accent, fontSize: '9px', fontWeight: 700,
                    letterSpacing: '0.3px', cursor: 'default',
                  }}
                >
                  {tech}
                </motion.span>
              ))}
            </div>
          )}
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
  );
}