'use client';

import { useRef, useState, useCallback } from 'react';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

export interface AboutCtaCMSData {
  data?: Record<string, string>;
  images?: Record<string, string>;
}

// ── Magnetic Button ───────────────────────────────────────────────────────────
function MagneticButton({ children, accent = '#52b788' }: { children: React.ReactNode; accent?: string }) {
  const btnRef = useRef<HTMLButtonElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 350, damping: 18 });
  const springY = useSpring(y, { stiffness: 350, damping: 18 });
  const [hovered, setHovered] = useState(false);
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = btnRef.current?.getBoundingClientRect();
    if (!rect) return;
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    x.set((e.clientX - cx) * 0.35);
    y.set((e.clientY - cy) * 0.35);
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = btnRef.current?.getBoundingClientRect();
    if (!rect) return;
    const id = Date.now();
    setRipples(r => [...r, { id, x: e.clientX - rect.left, y: e.clientY - rect.top }]);
    setTimeout(() => setRipples(r => r.filter(ri => ri.id !== id)), 700);
  };

  return (
    <motion.button
      ref={btnRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { x.set(0); y.set(0); setHovered(false); }}
      onClick={handleClick}
      style={{
        x: springX, y: springY,
        position: 'relative',
        overflow: 'hidden',
        cursor: 'pointer',
        border: 'none',
        padding: '18px 42px',
        borderRadius: '100px',
        background: hovered
          ? `linear-gradient(135deg, ${accent}, #00e5ff)`
          : `linear-gradient(135deg, ${accent}22, ${accent}11)`,
        color: hovered ? '#0b0f0e' : accent,
        fontSize: '15px',
        fontWeight: 700,
        letterSpacing: '0.5px',
        fontFamily: "'Syne', sans-serif",
        outline: `1.5px solid ${accent}44`,
        transition: 'background 0.35s, color 0.35s',
        boxShadow: hovered ? `0 0 40px ${accent}55, 0 0 80px ${accent}22` : 'none',
      }}
    >
      {children}
      <AnimatePresence>
        {ripples.map(r => (
          <motion.span
            key={r.id}
            initial={{ width: 0, height: 0, opacity: 0.5, x: r.x, y: r.y, translateX: '-50%', translateY: '-50%' }}
            animate={{ width: 300, height: 300, opacity: 0 }}
            exit={{}}
            transition={{ duration: 0.65, ease: 'easeOut' }}
            style={{
              position: 'absolute', borderRadius: '50%',
              background: 'rgba(255,255,255,0.25)', pointerEvents: 'none',
            }}
          />
        ))}
      </AnimatePresence>
    </motion.button>
  );
}

// ── Floating Stat ──────────────────────────────────────────────────────────────
function FloatingStat({ value, label, delay, accent }: { value: string; label: string; delay: number; accent: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false }}
      transition={{ delay, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      style={{
        textAlign: 'center',
        padding: '0 28px',
      }}
    >
      <div style={{
        fontFamily: "'Syne', sans-serif",
        fontSize: 'clamp(2rem, 4vw, 3rem)',
        fontWeight: 800,
        background: `linear-gradient(135deg, ${accent}, #e8f5ec)`,
        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
        lineHeight: 1,
        marginBottom: '8px',
      }}>
        {value}
      </div>
      <div style={{ color: 'rgba(232,245,236,0.35)', fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', fontWeight: 600 }}>
        {label}
      </div>
    </motion.div>
  );
}

// ── CTA Card ──────────────────────────────────────────────────────────────────
function CTACard({ data }: { data: Record<string, string> }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; color: string }[]>([]);

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);

  const sp = { stiffness: 160, damping: 24, mass: 0.9 };
  const rotateX = useSpring(useTransform(rawY, [-0.5, 0.5], [7, -7]), sp);
  const rotateY = useSpring(useTransform(rawX, [-0.5, 0.5], [-7, 7]), sp);
  const glareX  = useSpring(useTransform(rawX, [-0.5, 0.5], [10, 90]), sp);
  const glareY  = useSpring(useTransform(rawY, [-0.5, 0.5], [10, 90]), sp);
  const shadowX = useSpring(useTransform(rawX, [-0.5, 0.5], [-32, 32]), sp);
  const shadowY = useSpring(useTransform(rawY, [-0.5, 0.5], [-32, 32]), sp);

  const ACCENT_COLORS = ['#52b788', '#00e5ff', '#76ff03', '#ffca28'];

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    rawX.set((e.clientX - rect.left) / rect.width - 0.5);
    rawY.set((e.clientY - rect.top) / rect.height - 0.5);
    if (Math.random() > 0.8) {
      const id = Date.now() + Math.random();
      const color = ACCENT_COLORS[Math.floor(Math.random() * ACCENT_COLORS.length)];
      setParticles(p => [...p.slice(-5), { id, x: e.clientX - rect.left, y: e.clientY - rect.top, color }]);
      setTimeout(() => setParticles(p => p.filter(pt => pt.id !== id)), 800);
    }
  }, [rawX, rawY]);

  const boxShadow = useTransform(
    [shadowX, shadowY],
    ([sx, sy]: number[]) =>
      `${sx}px ${sy}px 80px rgba(0,0,0,0.8), 0 0 0 1px rgba(82,183,136,0.12), 0 0 120px rgba(82,183,136,0.08)`
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 90, scale: 0.88 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: false, margin: '-40px' }}
      transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
      style={{ perspective: '1100px', maxWidth: '860px', margin: '0 auto' }}
    >
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => { rawX.set(0); rawY.set(0); setHovered(false); setParticles([]); }}
        style={{
          rotateX, rotateY, boxShadow,
          transformStyle: 'preserve-3d',
          position: 'relative',
          borderRadius: '28px',
          background: 'rgba(11,15,14,0.9)',
          border: '1px solid rgba(82,183,136,0.15)',
          backdropFilter: 'blur(20px)',
          overflow: 'hidden',
          cursor: 'crosshair',
        }}
      >
        {/* Multi-color top accent */}
        <motion.div
          animate={{ scaleX: hovered ? 1 : 0.15, opacity: hovered ? 1 : 0.3 }}
          transition={{ duration: 0.5 }}
          style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: '3px',
            background: 'linear-gradient(90deg, #52b788, #00e5ff, #76ff03, transparent)',
            transformOrigin: 'left',
          }}
        />

        {/* Glare */}
        <motion.div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 3,
          background: useTransform([glareX, glareY], ([gx, gy]: number[]) =>
            `radial-gradient(circle at ${gx}% ${gy}%, rgba(255,255,255,0.07) 0%, transparent 55%)`),
          opacity: hovered ? 1 : 0,
          transition: 'opacity 0.3s',
        }} />

        {/* Dual bloom */}
        <motion.div
          animate={{ opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.5 }}
          style={{
            position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 1,
            background: `
              radial-gradient(ellipse 50% 40% at 20% 110%, rgba(82,183,136,0.1), transparent 60%),
              radial-gradient(ellipse 50% 40% at 80% 110%, rgba(0,229,255,0.08), transparent 60%)
            `,
          }}
        />

        {/* Corner decorations */}
        {['top-left', 'top-right', 'bottom-left', 'bottom-right'].map((corner, i) => (
          <motion.div
            key={corner}
            animate={{ opacity: hovered ? 0.6 : 0, scale: hovered ? 1 : 0 }}
            transition={{ delay: i * 0.05, duration: 0.3 }}
            style={{
              position: 'absolute',
              ...(corner.includes('top') ? { top: '16px' } : { bottom: '16px' }),
              ...(corner.includes('left') ? { left: '16px' } : { right: '16px' }),
              width: '20px', height: '20px',
              borderTop: corner.includes('top') ? '1.5px solid rgba(82,183,136,0.5)' : 'none',
              borderBottom: corner.includes('bottom') ? '1.5px solid rgba(82,183,136,0.5)' : 'none',
              borderLeft: corner.includes('left') ? '1.5px solid rgba(82,183,136,0.5)' : 'none',
              borderRight: corner.includes('right') ? '1.5px solid rgba(82,183,136,0.5)' : 'none',
              pointerEvents: 'none', zIndex: 4,
            }}
          />
        ))}

        {/* Scan line */}
        <motion.div
          animate={{ y: hovered ? '100%' : '-5%', opacity: hovered ? [0, 0.35, 0] : 0 }}
          transition={{ duration: 2, ease: 'linear', repeat: hovered ? Infinity : 0, repeatDelay: 2 }}
          style={{
            position: 'absolute', left: 0, right: 0, height: '2px', zIndex: 4, pointerEvents: 'none',
            background: 'linear-gradient(90deg, transparent, #52b788, #00e5ff, transparent)',
          }}
        />

        {/* Content */}
        <div style={{ padding: '64px 52px', position: 'relative', zIndex: 2, textAlign: 'center' }}>

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.7 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: false }}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '10px',
              background: 'rgba(82,183,136,0.07)', border: '1px solid rgba(82,183,136,0.2)',
              padding: '7px 20px', borderRadius: '100px', marginBottom: '36px',
            }}
          >
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#52b788', boxShadow: '0 0 8px #52b788', animation: 'pulseDot 1.8s ease infinite', flexShrink: 0 }} />
            <span style={{ color: '#52b788', fontSize: '11px', fontWeight: 700, letterSpacing: '2.5px', textTransform: 'uppercase' }}>
              {data.ctaEyebrow || 'Open to Projects'}
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h2
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ delay: 0.1, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            style={{
              fontFamily: "'Syne', sans-serif",
              color: '#e8f5ec',
              fontSize: 'clamp(2.4rem, 6vw, 4.5rem)',
              fontWeight: 800,
              letterSpacing: '-2px',
              lineHeight: 1.0,
              margin: '0 0 20px',
            }}
          >
            {data.ctaTitle1 || "Let's Build"}{' '}
            <span style={{
              background: 'linear-gradient(90deg, #52b788, #00e5ff)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>
              {data.ctaTitle2 || 'Something'}
            </span>
            <br />
            <span style={{ color: 'rgba(232,245,236,0.4)' }}>{data.ctaTitle3 || 'Great Together'}</span>
          </motion.h2>

          {/* Animated underline */}
          <motion.div
            animate={{ width: hovered ? '80px' : '0px' }}
            transition={{ duration: 0.45 }}
            style={{
              height: '2px',
              background: 'linear-gradient(90deg, #52b788, #00e5ff)',
              borderRadius: '2px',
              margin: '0 auto 28px',
            }}
          />

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: false }}
            transition={{ delay: 0.25 }}
            style={{
              color: 'rgba(232,245,236,0.45)',
              maxWidth: '460px',
              margin: '0 auto 48px',
              fontSize: '1rem',
              lineHeight: 1.8,
            }}
          >
            {data.ctaDesc || "Ready to turn your idea into a world-class product? I'm taking on select projects — let's make yours the next success story."}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ delay: 0.35, duration: 0.6 }}
            style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '56px' }}
          >
            <Link href={data.ctaButtonHref || '/contact'} style={{ textDecoration: 'none' }}>
              <MagneticButton accent="#52b788">
                {data.ctaButtonLabel || 'Start a Project →'}
              </MagneticButton>
            </Link>
            <Link href={data.ctaButtonHref2 || '/projects'} style={{ textDecoration: 'none' }}>
              <MagneticButton accent="rgba(232,245,236,0.4)">
                {data.ctaButtonLabel2 || 'View Portfolio'}
              </MagneticButton>
            </Link>
          </motion.div>

          {/* Stats divider */}
          <div style={{
            borderTop: '1px solid rgba(82,183,136,0.08)',
            paddingTop: '40px',
            display: 'flex',
            justifyContent: 'center',
            gap: '0',
            flexWrap: 'wrap',
          }}>
            {[
              { value: data.ctaStat1Val || '< 48h', label: data.ctaStat1Lab || 'Response Time', accent: '#52b788' },
              { value: data.ctaStat2Val || '5★', label: data.ctaStat2Lab || 'Client Rating', accent: '#ffca28' },
              { value: data.ctaStat3Val || '∞', label: data.ctaStat3Lab || 'Revisions', accent: '#00e5ff' },
            ].map((s, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
                <FloatingStat {...s} delay={0.4 + i * 0.1} />
                {i < 2 && (
                  <div style={{ width: '1px', height: '40px', background: 'rgba(82,183,136,0.08)' }} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Particles */}
        <AnimatePresence>
          {particles.map(pt => (
            <motion.div key={pt.id}
              initial={{ opacity: 1, scale: 1, x: pt.x - 4, y: pt.y - 4 }}
              animate={{ opacity: 0, scale: 3.5, x: pt.x - 4, y: pt.y - 55 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.75, ease: 'easeOut' }}
              style={{
                position: 'absolute', width: 8, height: 8,
                borderRadius: '50%', background: pt.color,
                boxShadow: `0 0 14px 5px ${pt.color}88`,
                zIndex: 10, pointerEvents: 'none',
              }}
            />
          ))}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

// ── Section ────────────────────────────────────────────────────────────────────
export default function AboutCTA({ data = {}, images = {} }: AboutCtaCMSData) {
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

      {/* Center bloom */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(82,183,136,0.04) 0%, transparent 65%)',
      }} />

      {/* Floating orbs */}
      <motion.div
        animate={{ y: [0, -40, 0], rotate: [0, 10, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute', top: '10%', left: '3%', width: '350px', height: '350px',
          borderRadius: '50%', background: 'radial-gradient(circle, rgba(82,183,136,0.03) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />
      <motion.div
        animate={{ y: [0, 35, 0], rotate: [0, -8, 0] }}
        transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
        style={{
          position: 'absolute', bottom: '10%', right: '3%', width: '400px', height: '400px',
          borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,229,255,0.025) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* Card */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        <CTACard data={data} />
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