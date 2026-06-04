'use client';

import Link from 'next/link';
import { useRef, useState, useCallback } from 'react';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';

export default function ServicesCTA({ data = {} }: { data?: Record<string, string> }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  const [particles, setParticles] = useState<{ id: number; x: number; y: number }[]>([]);

  const accent = '#52b788';
  const accentDim = 'rgba(82,183,136,0.15)';

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const sp = { stiffness: 200, damping: 20, mass: 0.7 };
  const rotateX = useSpring(useTransform(rawY, [-0.5, 0.5], [8, -8]), sp);
  const rotateY = useSpring(useTransform(rawX, [-0.5, 0.5], [-8, 8]), sp);
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
      `${sx}px ${sy}px 60px rgba(0,0,0,0.7), 0 0 0 1px ${accent}22`
  );

  const rawHeading = data.ctaHeading || "Let's Build Something Great";
  const headingWords = rawHeading.split(' ');
  const lastWord = headingWords.pop() || '';
  const remainingHeading = headingWords.join(' ');

  return (
    <section style={{ padding: '6rem 6vw', background: '#0b0f0e', position: 'relative', overflow: 'hidden' }}>

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
        style={{ textAlign: 'center', marginBottom: '3.5rem', position: 'relative', zIndex: 1 }}
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
          <span style={{
            width: 7, height: 7, borderRadius: '50%', background: accent,
            boxShadow: `0 0 8px ${accent}`, animation: 'pulseDot 1.8s ease infinite', flexShrink: 0,
            display: 'inline-block',
          }} />
          <span style={{ color: accent, fontSize: '11px', fontWeight: 700, letterSpacing: '2.5px', textTransform: 'uppercase' }}>
            Ready to Start
          </span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ delay: 0.1, duration: 0.7 }}
          style={{
            fontFamily: "'Syne', sans-serif",
            color: '#e8f5ec',
            fontSize: 'clamp(2.2rem, 5.5vw, 4rem)',
            fontWeight: 800, letterSpacing: '-1.5px', lineHeight: 1.05, marginBottom: '18px',
          }}
        >
          {remainingHeading}{' '}
          <span style={{
            background: 'linear-gradient(90deg, #52b788, #00e5ff)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          }}>
            {lastWord}
          </span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: false }}
          transition={{ delay: 0.2 }}
          style={{ color: 'rgba(232,245,236,0.45)', maxWidth: '400px', margin: '0 auto', fontSize: '1rem', lineHeight: 1.75 }}
        >
          {data.ctaSubtext || "Ready to turn your ideas into reality?"}
        </motion.p>
      </motion.div>

      {/* CTA Card */}
      <motion.div
        initial={{ opacity: 0, y: 70, scale: 0.92 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: false, margin: '-40px' }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        style={{ perspective: '900px', maxWidth: '560px', margin: '0 auto', position: 'relative', zIndex: 1 }}
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
            border: `1px solid ${accent}22`,
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
              background: `linear-gradient(90deg, ${accent}, transparent)`,
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

          {/* Content */}
          <div style={{ padding: '48px 40px', position: 'relative', zIndex: 2, textAlign: 'center' }}>

            {/* Icon */}
            <motion.div
              animate={{
                scale: hovered ? 1.15 : 1,
                rotate: hovered ? 8 : 0,
                filter: hovered ? `drop-shadow(0 0 14px ${accent})` : 'none',
              }}
              transition={{ type: 'spring', stiffness: 300, damping: 14 }}
              style={{ fontSize: '40px', marginBottom: '20px' }}
            >
              🚀
            </motion.div>

            <p style={{ color: 'rgba(232,245,236,0.65)', lineHeight: 1.75, fontSize: '0.95rem', margin: '0 0 32px' }}>
              Have a project in mind? Let's collaborate and bring your vision to life with clean code, stunning design, and real results.
            </p>

            {/* Animated underline */}
            <motion.div
              animate={{ width: hovered ? '60px' : '0px' }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              style={{
                height: '2px',
                background: `linear-gradient(90deg, ${accent}, transparent)`,
                borderRadius: '2px', marginBottom: '28px', margin: '0 auto 28px',
              }}
            />

            {/* Deliverable row */}
            <AnimatePresence>
              {hovered && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.3 }}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: '10px',
                    padding: '10px 18px', borderRadius: '12px',
                    background: accentDim, border: `1px solid ${accent}33`,
                    marginBottom: '24px',
                  }}
                >
                  <span style={{ fontSize: '14px' }}>📦</span>
                  <span style={{ fontSize: '12px', color: accent, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>
                    Available for new projects
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* CTA Button */}
            <Link href={data.ctaButtonHref || "/contact"} style={{ display: 'block' }}>
              <motion.button
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.97 }}
                animate={{
                  background: hovered
                    ? `linear-gradient(135deg, ${accent}, #00e5ff)`
                    : accent,
                  boxShadow: hovered
                    ? `0 0 28px ${accent}66, 0 8px 32px rgba(0,0,0,0.4)`
                    : '0 4px 16px rgba(0,0,0,0.3)',
                }}
                transition={{ duration: 0.35 }}
                style={{
                  padding: '0.95rem 2.4rem',
                  borderRadius: '12px',
                  color: '#0b0f0e',
                  fontWeight: 800,
                  fontSize: '0.95rem',
                  letterSpacing: '0.5px',
                  border: 'none',
                  cursor: 'pointer',
                  width: '100%',
                  fontFamily: "'Syne', sans-serif",
                }}
              >
                {data.ctaButtonLabel || "Contact Me →"}
              </motion.button>
            </Link>
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
          50%       { opacity: 0.35; transform: scale(1.6); }
        }
      `}</style>
    </section>
  );
}