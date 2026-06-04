'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';

/* CMS Data Types */
export interface WhoIHelpCMSData {
  data?:   Record<string, string>;
  images?: Record<string, string>;
}

/* Default content — matches live website exactly */
const CLIENTS_DEFAULT = [
  {
    title: 'Startups & Founders', subtitle: 'Zero → One',
    desc: 'Launch fast, validate ideas, and build a strong digital presence from day one.',
    img: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1200&fit=crop',
    stat: '48hr', statLabel: 'avg. kickoff time',
    accent: '#52b788', accentDim: 'rgba(82,183,136,0.18)', icon: '🚀', number: '01',
  },
  {
    title: 'Businesses', subtitle: 'Scale & Automate',
    desc: 'Scale your brand with modern systems, automation, and high-performance platforms.',
    img: 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1200&fit=crop',
    stat: '10×', statLabel: 'productivity gains',
    accent: '#00e5ff', accentDim: 'rgba(0,229,255,0.14)', icon: '📈', number: '02',
  },
  {
    title: 'Creators', subtitle: 'Build Authority',
    desc: 'Build authority, showcase your work, and grow your personal brand online.',
    img: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?q=80&w=1200&fit=crop',
    stat: '3×', statLabel: 'audience growth',
    accent: '#ffca28', accentDim: 'rgba(255,202,40,0.14)', icon: '✨', number: '03',
  },
];

/* Merge CMS data over defaults */
function buildClientsData(
  data:   Record<string, string>,
  images: Record<string, string>,
) {
  return CLIENTS_DEFAULT.map((def, i) => {
    const n = i + 1;
    return {
      ...def,
      title:    data[`whoHelp${n}Title`]    || def.title,
      subtitle: data[`whoHelp${n}Subtitle`] || def.subtitle,
      desc:     data[`whoHelp${n}Desc`]     || def.desc,
      stat:     data[`whoHelp${n}Stat`]     || def.stat,
      statLabel:data[`whoHelp${n}StatLabel`]|| def.statLabel,
      img:      images[`whoHelp${n}Image`]  || def.img,
    };
  });
}

// Replaced by buildClientsData — see above

// ─────────────────────────────────────────────────────────────────────────────
// 3D Tilt Card
// ─────────────────────────────────────────────────────────────────────────────
interface ClientCard {
  title: string; subtitle: string; desc: string; img: string;
  stat: string; statLabel: string;
  accent: string; accentDim: string; icon: string; number: string;
}
function TiltCard({ client, index }: { client: ClientCard; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  const [particles, setParticles] = useState<{ id: number; x: number; y: number }[]>([]);

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);

  const springCfg = { stiffness: 180, damping: 18, mass: 0.7 };
  const rotateX  = useSpring(useTransform(rawY, [-0.5, 0.5], [14, -14]), springCfg);
  const rotateY  = useSpring(useTransform(rawX, [-0.5, 0.5], [-14, 14]), springCfg);
  const shadowX  = useSpring(useTransform(rawX, [-0.5, 0.5], [-28, 28]), springCfg);
  const shadowY  = useSpring(useTransform(rawY, [-0.5, 0.5], [-28, 28]), springCfg);
  const glareX   = useSpring(useTransform(rawX, [-0.5, 0.5], [10, 90]),  springCfg);
  const glareY   = useSpring(useTransform(rawY, [-0.5, 0.5], [10, 90]),  springCfg);
  const imgX     = useSpring(useTransform(rawX, [-0.5, 0.5], [-14, 14]), springCfg);
  const imgY     = useSpring(useTransform(rawY, [-0.5, 0.5], [-14, 14]), springCfg);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = (e.clientX - rect.left) / rect.width  - 0.5;
    const y = (e.clientY - rect.top)  / rect.height - 0.5;
    rawX.set(x);
    rawY.set(y);

    // Particle trail
    if (Math.random() > 0.65) {
      const id = Date.now() + Math.random();
      const px = e.clientX - rect.left;
      const py = e.clientY - rect.top;
      setParticles(prev => [...prev.slice(-10), { id, x: px, y: py }]);
      setTimeout(() => setParticles(prev => prev.filter(p => p.id !== id)), 900);
    }
  }, [rawX, rawY]);

  const handleMouseLeave = useCallback(() => {
    rawX.set(0);
    rawY.set(0);
    setHovered(false);
    setParticles([]);
  }, [rawX, rawY]);

  const boxShadow = useTransform(
    [shadowX, shadowY],
    ([sx, sy]: number[]) =>
      `${sx}px ${sy}px 70px rgba(0,0,0,0.75), 0 0 0 1px ${client.accent}22, inset 0 0 40px rgba(0,0,0,0.2)`
  );

  const glareGradient = useTransform(
    [glareX, glareY],
    ([gx, gy]: number[]) =>
      `radial-gradient(circle at ${gx}% ${gy}%, rgba(255,255,255,0.14) 0%, transparent 55%)`
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 90, scale: 0.92 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: false, margin: '-50px' }}
      transition={{ delay: index * 0.15, duration: 1, ease: [0.22, 1, 0.36, 1] }}
      style={{ perspective: '900px', perspectiveOrigin: '50% 50%', position: 'relative' }}
    >
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={handleMouseLeave}
        whileHover={{ scale: 1.02 }}
        transition={{ type: 'spring', stiffness: 280, damping: 22 }}
        style={{
          rotateX,
          rotateY,
          boxShadow,
          transformStyle: 'preserve-3d',
          position: 'relative',
          height: '420px',
          borderRadius: '22px',
          overflow: 'hidden',
          cursor: 'none',
          border: `1px solid ${client.accent}28`,
          willChange: 'transform',
        }}
      >
        {/* Parallax image */}
        <motion.div style={{ position: 'absolute', inset: '-14px', x: imgX, y: imgY }}>
          <img
            src={client.img}
            alt={client.title}
            style={{
              width: '100%', height: '100%', objectFit: 'cover',
              filter: hovered
                ? 'brightness(0.3) saturate(1.3) contrast(1.1)'
                : 'brightness(0.52) saturate(0.85)',
              transition: 'filter 0.6s ease',
              display: 'block',
            }}
          />
        </motion.div>

        {/* Holographic glare */}
        <motion.div style={{
          position: 'absolute', inset: 0,
          background: glareGradient,
          opacity: hovered ? 1 : 0,
          transition: 'opacity 0.3s',
          pointerEvents: 'none', zIndex: 4,
        }} />

        {/* Bottom gradient */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none',
          background: `linear-gradient(to top,
            rgba(0,0,0,0.97) 0%,
            rgba(0,0,0,0.55) 38%,
            rgba(0,0,0,0.12) 65%,
            transparent 100%)`,
        }} />

        {/* Accent bloom */}
        <motion.div
          animate={{ opacity: hovered ? 1 : 0, scale: hovered ? 1 : 0.8 }}
          transition={{ duration: 0.5 }}
          style={{
            position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none',
            background: `radial-gradient(ellipse 80% 60% at 50% 115%, ${client.accentDim} 0%, transparent 65%)`,
          }}
        />

        {/* Scanning line on hover */}
        <motion.div
          animate={{ y: hovered ? '420px' : '-10px', opacity: hovered ? [0, 0.6, 0] : 0 }}
          transition={{ duration: 1.2, ease: 'linear', repeat: hovered ? Infinity : 0, repeatDelay: 1.5 }}
          style={{
            position: 'absolute', left: 0, right: 0, height: '2px',
            background: `linear-gradient(90deg, transparent, ${client.accent}, transparent)`,
            zIndex: 5, pointerEvents: 'none',
          }}
        />

        {/* Top bar */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0,
          padding: '24px 28px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
          zIndex: 6,
        }}>
          <motion.span
            animate={{ color: hovered ? client.accent : 'rgba(255,255,255,0.18)' }}
            transition={{ duration: 0.35 }}
            style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: '11px', fontWeight: 800,
              letterSpacing: '3px', textTransform: 'uppercase',
            }}
          >
            {client.number}
          </motion.span>
          <motion.span
            animate={{
              scale:  hovered ? 1.4 : 1,
              rotate: hovered ? 20  : 0,
              filter: hovered ? `drop-shadow(0 0 12px ${client.accent})` : 'none',
            }}
            transition={{ type: 'spring', stiffness: 320, damping: 14 }}
            style={{ fontSize: '24px', display: 'block' }}
          >
            {client.icon}
          </motion.span>
        </div>

        {/* Stat badge */}
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5, rotate: -10, y: -8 }}
              animate={{ opacity: 1, scale: 1,   rotate:  0,  y:  0 }}
              exit={{   opacity: 0, scale: 0.5, rotate:  10, y: -8 }}
              transition={{ type: 'spring', stiffness: 420, damping: 18 }}
              style={{
                position: 'absolute', top: '60px', right: '24px',
                background: client.accent, color: '#0b0f0e',
                borderRadius: '14px', padding: '10px 16px',
                zIndex: 7, textAlign: 'center',
              }}
            >
              <div style={{ fontFamily: "'Syne', sans-serif", fontSize: '24px', fontWeight: 800, lineHeight: 1 }}>
                {client.stat}
              </div>
              <div style={{ fontSize: '9px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', opacity: 0.65, marginTop: '4px' }}>
                {client.statLabel}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom content */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          padding: '28px 28px 32px', zIndex: 6,
        }}>
          {/* Subtitle */}
          <motion.p
            animate={{ opacity: hovered ? 1 : 0.5, y: hovered ? 0 : 5 }}
            transition={{ duration: 0.3 }}
            style={{
              color: client.accent,
              fontSize: '10px', fontWeight: 700,
              textTransform: 'uppercase', letterSpacing: '3px',
              margin: '0 0 8px',
            }}
          >
            {client.subtitle}
          </motion.p>

          {/* Title — always visible */}
          <h3 style={{
            color: '#f0faf4',
            fontSize: '1.55rem',
            fontFamily: "'Syne', sans-serif",
            fontWeight: 800,
            margin: '0 0 14px',
            lineHeight: 1.1,
            letterSpacing: '-0.5px',
            textShadow: '0 2px 24px rgba(0,0,0,0.9)',
          }}>
            {client.title}
          </h3>

          {/* Animated underline */}
          <motion.div
            animate={{ width: hovered ? '52px' : '0px' }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            style={{
              height: '2px',
              background: `linear-gradient(90deg, ${client.accent}, transparent)`,
              borderRadius: '2px',
              marginBottom: '14px',
              overflow: 'hidden',
            }}
          />

          {/* Description */}
          <motion.p
            animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 14, height: hovered ? 'auto' : 0 }}
            transition={{ duration: 0.38, delay: hovered ? 0.06 : 0 }}
            style={{
              color: 'rgba(232,245,236,0.8)',
              fontSize: '0.88rem', lineHeight: 1.7, margin: 0,
              overflow: 'hidden',
            }}
          >
            {client.desc}
          </motion.p>
        </div>

        {/* Mouse trail particles */}
        <AnimatePresence>
          {particles.map(pt => (
            <motion.div
              key={pt.id}
              initial={{ opacity: 1, scale: 1, x: pt.x - 4, y: pt.y - 4 }}
              animate={{ opacity: 0, scale: 3, x: pt.x - 4, y: pt.y - 50 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.75, ease: 'easeOut' }}
              style={{
                position: 'absolute', width: 8, height: 8,
                borderRadius: '50%',
                background: client.accent,
                boxShadow: `0 0 12px 4px ${client.accent}88`,
                zIndex: 10, pointerEvents: 'none',
              }}
            />
          ))}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Export
// ─────────────────────────────────────────────────────────────────────────────
export default function WhoIHelp({ data = {}, images = {} }: WhoIHelpCMSData) {
  const clientsData = buildClientsData(data, images);
  const whoHelpHeading   = data.whoHelpHeading   || 'Who We';
  const whoHelpHighlight = data.whoHelpHighlight  || 'Work With';
  const whoHelpSubtext   = data.whoHelpSubtext    || 'I partner with ambitious people ready to build something real.';
  const sectionRef = useRef<HTMLElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const handleMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    };
    el.addEventListener('mousemove', handleMove);
    return () => el.removeEventListener('mousemove', handleMove);
  }, []);

  const orbX = useSpring(mousePos.x, { stiffness: 50, damping: 18 });
  const orbY = useSpring(mousePos.y, { stiffness: 50, damping: 18 });

  return (
    <section
      ref={sectionRef}
      style={{ padding: '9rem 6vw', background: '#0b0f0e', position: 'relative', overflow: 'hidden' }}
    >
      {/* Ambient mouse orb */}
      <motion.div style={{
        position: 'absolute',
        width: 700, height: 700, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(82,183,136,0.06) 0%, transparent 70%)',
        x: useTransform(orbX, v => v - 350),
        y: useTransform(orbY, v => v - 350),
        pointerEvents: 'none', zIndex: 0,
      }} />

      {/* Static bg gradient */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: `
          radial-gradient(ellipse 60% 50% at 15% 80%, rgba(82,183,136,0.07) 0%, transparent 55%),
          radial-gradient(ellipse 50% 40% at 85% 15%, rgba(0,229,255,0.04) 0%, transparent 55%)
        `,
      }} />

      {/* Grid pattern */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0,
        backgroundImage: `
          linear-gradient(rgba(82,183,136,0.025) 1px, transparent 1px),
          linear-gradient(90deg, rgba(82,183,136,0.025) 1px, transparent 1px)
        `,
        backgroundSize: '64px 64px',
      }} />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 48 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false }}
        transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
        style={{ textAlign: 'center', marginBottom: '5.5rem', position: 'relative', zIndex: 1 }}
      >
        {/* Eyebrow badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.7 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: false }}
          transition={{ duration: 0.5 }}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '10px',
            background: 'rgba(82,183,136,0.07)',
            border: '1px solid rgba(82,183,136,0.2)',
            padding: '7px 20px', borderRadius: '100px', marginBottom: '28px',
          }}
        >
          <span style={{
            width: 7, height: 7, borderRadius: '50%',
            background: '#52b788', boxShadow: '0 0 8px #52b788',
            animation: 'pulseDot 1.8s ease infinite',
            flexShrink: 0,
          }} />
          <span style={{
            color: '#52b788', fontSize: '11px', fontWeight: 700,
            letterSpacing: '2.5px', textTransform: 'uppercase',
          }}>
            Clients
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
            fontWeight: 800, letterSpacing: '-1.5px',
            lineHeight: 1.05, marginBottom: '20px',
          }}
        >
          {whoHelpHeading}{' '}
          <span style={{
            background: 'linear-gradient(90deg, #52b788 0%, #00e5ff 60%, #ffca28 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          }}>
            {whoHelpHighlight}
          </span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: false }}
          transition={{ delay: 0.2 }}
          style={{
            color: 'rgba(232,245,236,0.5)', maxWidth: '440px',
            margin: '0 auto', fontSize: '1rem', lineHeight: 1.75,
          }}
        >
          {whoHelpSubtext}
        </motion.p>
      </motion.div>

      {/* Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '28px',
        maxWidth: '1100px', margin: '0 auto',
        position: 'relative', zIndex: 1,
      }}>
        {clientsData.map((client, i) => (
          <TiltCard key={i} client={client} index={i} />
        ))}
      </div>

      {/* Bottom CTA */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: false }}
        transition={{ delay: 0.55, duration: 0.6 }}
        style={{ textAlign: 'center', marginTop: '5rem', position: 'relative', zIndex: 1 }}
      >
        <p style={{ color: 'rgba(232,245,236,0.3)', fontSize: '0.85rem', letterSpacing: '0.5px' }}>
          Sound like you?{' '}
          <a href="/contact" style={{
            color: '#52b788', fontWeight: 600,
            borderBottom: '1px solid rgba(82,183,136,0.35)',
            paddingBottom: '2px',
          }}>
            Let&apos;s talk →
          </a>
        </p>
      </motion.div>

    </section>
  );
}