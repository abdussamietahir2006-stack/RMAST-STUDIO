'use client';

import { useRef, useState, useCallback } from 'react';
import { useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import AboutLogoAnimation from './AboutLogoAnimation';

export interface AboutHeroCMSData {
  data?: Record<string, string>;
  images?: Record<string, string>;
}

const DEFAULT_ROLES = ['Full-Stack Developer', 'UI/UX Designer', '3D Expert', 'AI Automation Engineer'];

/* ── Typewriter ── */
function Typewriter({ roles }: { roles: string[] }) {
  const [idx, setIdx] = useState(0);
  const [text, setText] = useState('');
  const [deleting, setDeleting] = useState(false);

  // useEffect — only runs client-side, no SSR mismatch
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const tick = useCallback(() => {
    const activeRoles = roles.length > 0 ? roles : DEFAULT_ROLES;
    const word = activeRoles[idx % activeRoles.length];
    if (!deleting && text.length < word.length) {
      setText(word.slice(0, text.length + 1));
    } else if (!deleting && text.length === word.length) {
      setTimeout(() => setDeleting(true), 1800);
      return;
    } else if (deleting && text.length > 0) {
      setText(text.slice(0, -1));
    } else {
      setDeleting(false);
      setIdx(i => (i + 1) % activeRoles.length);
    }
  }, [text, deleting, idx, roles]);

  useEffect(() => {
    const t = setTimeout(tick, deleting ? 45 : 80);
    return () => clearTimeout(t);
  }, [tick]);

  return (
    <span style={{ color: '#52b788' }}>
      {text}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.5, repeat: Infinity, repeatType: 'reverse' }}
        style={{ borderRight: '2px solid #52b788', marginLeft: '2px' }}
      />
    </span>
  );
}

/* ── Logo Holder ── */
function LogoHolder({ logoText }: { logoText: string }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const sp = { stiffness: 180, damping: 22 };
  const rotateX = useSpring(useTransform(rawY, [-0.5, 0.5], [14, -14]), sp);
  const rotateY = useSpring(useTransform(rawX, [-0.5, 0.5], [-14, 14]), sp);
  const glareX  = useSpring(useTransform(rawX, [-0.5, 0.5], [10, 90]), sp);
  const glareY  = useSpring(useTransform(rawY, [-0.5, 0.5], [10, 90]), sp);
  const [hovered, setHovered] = useState(false);

  const handleMouse = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    rawX.set((e.clientX - rect.left) / rect.width - 0.5);
    rawY.set((e.clientY - rect.top) / rect.height - 0.5);
  };
  const handleLeave = () => { rawX.set(0); rawY.set(0); setHovered(false); };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 40 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
      style={{ perspective: '800px', display: 'inline-block' }}
    >
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouse}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={handleLeave}
        style={{
          rotateX, rotateY,
          transformStyle: 'preserve-3d',
          width: '360px', height: '360px',
          borderRadius: '40px',
          background: 'rgba(11,15,14,0.85)',
          border: '1px solid rgba(82,183,136,0.2)',
          backdropFilter: 'blur(16px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          position: 'relative', overflow: 'hidden', cursor: 'crosshair',
          boxShadow: '0 20px 60px rgba(0,0,0,0.6), 0 0 40px rgba(82,183,136,0.1)',
        }}
        animate={{ boxShadow: hovered ? '0 30px 80px rgba(0,0,0,0.7), 0 0 60px rgba(82,183,136,0.25)' : '0 20px 60px rgba(0,0,0,0.6), 0 0 40px rgba(82,183,136,0.1)' }}
      >
        {/* Glare */}
        <motion.div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 3, borderRadius: '40px',
          background: useTransform([glareX, glareY], ([gx, gy]: number[]) =>
            `radial-gradient(circle at ${gx}% ${gy}%, rgba(255,255,255,0.12) 0%, transparent 55%)`),
        }} />

        {/* Accent top bar */}
        <motion.div
          animate={{ scaleX: hovered ? 1 : 0.2, opacity: hovered ? 1 : 0.3 }}
          style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg, #52b788, transparent)', transformOrigin: 'left' }}
        />

        {/* Scan line */}
        <motion.div
          animate={{ y: hovered ? '100%' : '-5%', opacity: hovered ? [0, 0.4, 0] : 0 }}
          transition={{ duration: 1.4, ease: 'linear', repeat: hovered ? Infinity : 0, repeatDelay: 1 }}
          style={{ position: 'absolute', left: 0, right: 0, height: '2px', zIndex: 4, pointerEvents: 'none', background: 'linear-gradient(90deg, transparent, #52b788, transparent)' }}
        />

        {/* 3D Canvas Logo Animation */}
        <AboutLogoAnimation width={360} height={360} />

        {/* Corner brackets */}
        {[['top', 'left'], ['top', 'right'], ['bottom', 'left'], ['bottom', 'right']].map(([v, h]) => (
          <div key={`${v}-${h}`} style={{
            position: 'absolute', width: '16px', height: '16px',
            zIndex: 5,
            ...(v === 'top' ? { top: '16px' } : { bottom: '16px' }),
            ...(h === 'left' ? { left: '16px' } : { right: '16px' }),
            borderTop: v === 'top' ? '1.5px solid rgba(82,183,136,0.3)' : 'none',
            borderBottom: v === 'bottom' ? '1.5px solid rgba(82,183,136,0.3)' : 'none',
            borderLeft: h === 'left' ? '1.5px solid rgba(82,183,136,0.3)' : 'none',
            borderRight: h === 'right' ? '1.5px solid rgba(82,183,136,0.3)' : 'none',
          }} />
        ))}
      </motion.div>

      {/* Floating badge */}
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute', bottom: '-14px', right: '-14px',
          background: 'rgba(11,15,14,0.9)', backdropFilter: 'blur(12px)',
          border: '1px solid rgba(82,183,136,0.25)', borderRadius: '12px',
          padding: '6px 12px', display: 'flex', alignItems: 'center', gap: '6px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
        }}
      >
        <motion.div animate={{ scale: [1, 1.4, 1] }} transition={{ duration: 2, repeat: Infinity }}
          style={{ width: '6px', height: '6px', background: '#52b788', borderRadius: '50%', boxShadow: '0 0 8px #52b788' }}
        />
        <span style={{ fontSize: '10px', color: '#a8e6cf', letterSpacing: '0.1em', fontWeight: 600 }}>{logoText || 'RMAST'}</span>
      </motion.div>
    </motion.div>
  );
}

/* ── Particle static sizes ── */
const P_SIZES = [3.5, 2, 4, 2.8, 3.2, 2.4, 3.8, 2.2];
function Dot({ i }: { i: number }) {
  const size = P_SIZES[i] ?? 3;
  return (
    <motion.div
      animate={{ y: [0, -(20 + i * 6), 0], opacity: [0, 0.7, 0] }}
      transition={{ duration: 4 + i * 0.6, repeat: Infinity, delay: i * 0.4, ease: 'easeInOut' }}
      style={{
        position: 'absolute', width: `${size}px`, height: `${size}px`,
        background: i % 2 === 0 ? '#52b788' : '#a8e6cf',
        borderRadius: '50%', top: `${10 + i * 10}%`, left: `${8 + i * 11}%`,
        boxShadow: `0 0 ${size * 3}px currentColor`, pointerEvents: 'none', zIndex: 0,
      }}
    />
  );
}

/* ── Main ── */
export default function AboutHero({ data = {}, images = {} }: AboutHeroCMSData) {
  // CMS values with exact fallbacks
  const heroBadge        = data.heroBadge        || 'About';
  const heroHeadingLine1 = data.heroHeadingLine1 || 'The Mind Behind';
  const heroHeadingLine2 = data.heroHeadingLine2 || 'RMAST';
  const heroDescription  = data.heroDescription  || "I'm Raja Muhammad Abdussamie Tahir — a digital craftsman who transforms ideas into high-performance digital products.";
  const heroLogoBadge    = data.heroLogoBadge    || 'RMAST';
  const heroRoles        = data.heroRoles        || 'Full-Stack Developer, UI/UX Designer, 3D Expert, AI Automation Engineer';

  const heroStat1Val     = data.heroStat1Val     || '50+';
  const heroStat1Lab     = data.heroStat1Lab     || 'Projects Shipped';
  const heroStat2Val     = data.heroStat2Val     || '30+';
  const heroStat2Lab     = data.heroStat2Lab     || 'Happy Clients';
  const heroStat3Val     = data.heroStat3Val     || '3+';
  const heroStat3Lab     = data.heroStat3Lab     || 'Years Active';
  const heroStat4Val     = data.heroStat4Val     || '100%';
  const heroStat4Lab     = data.heroStat4Lab     || 'Satisfaction';

  const heroCtaLabel1    = data.heroCtaLabel1    || 'View My Work';
  const heroCtaHref1     = data.heroCtaHref1     || '#work';
  const heroCtaLabel2    = data.heroCtaLabel2    || 'Get In Touch';
  const heroCtaHref2     = data.heroCtaHref2     || '/contact';

  const rolesArray = (heroRoles || '').split(',').map((r: string) => r.trim()).filter(Boolean);

  const stats = [
    [heroStat1Val, heroStat1Lab],
    [heroStat2Val, heroStat2Lab],
    [heroStat3Val, heroStat3Lab],
    [heroStat4Val, heroStat4Lab],
  ];

  return (
    <section style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      padding: '9rem 6vw 6rem', position: 'relative', overflow: 'hidden',
      background: 'linear-gradient(160deg, #060f0c 0%, #07130f 60%, #060e0b 100%)',
    }}>
      {/* Grid bg */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: `linear-gradient(rgba(82,183,136,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(82,183,136,0.025) 1px, transparent 1px)`,
        backgroundSize: '64px 64px',
      }} />

      {/* Ambient glow */}
      <motion.div
        animate={{ scale: [1, 1.3, 1], opacity: [0.08, 0.2, 0.08] }}
        transition={{ duration: 20, repeat: Infinity }}
        style={{
          position: 'absolute', top: '-10%', left: '20%', width: '700px', height: '700px',
          borderRadius: '50%', background: 'radial-gradient(circle, rgba(82,183,136,0.2), transparent 70%)',
          filter: 'blur(120px)', pointerEvents: 'none',
        }}
      />
      <motion.div
        animate={{ scale: [1.2, 0.9, 1.2], opacity: [0.06, 0.15, 0.06] }}
        transition={{ duration: 25, repeat: Infinity }}
        style={{
          position: 'absolute', bottom: '-10%', right: '10%', width: '500px', height: '500px',
          borderRadius: '50%', background: 'radial-gradient(circle, rgba(52,120,90,0.2), transparent 70%)',
          filter: 'blur(100px)', pointerEvents: 'none',
        }}
      />

      {/* Particles */}
      {[...Array(8)].map((_, i) => <Dot key={i} i={i} />)}

      {/* Content */}
      <div className="about-hero-grid" style={{ maxWidth: '1200px', margin: '0 auto', width: '100%', position: 'relative', zIndex: 1,
        display: 'grid', gridTemplateColumns: '1fr auto', gap: '4rem', alignItems: 'center' }}>

        {/* Left — text */}
        <div className="about-hero-left">
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }}
            style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.5rem' }}
          >
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', background: 'rgba(82,183,136,0.07)', border: '1px solid rgba(82,183,136,0.2)', padding: '7px 20px', borderRadius: '100px' }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#52b788', boxShadow: '0 0 8px #52b788', display: 'inline-block' }} />
              <span style={{ color: '#52b788', fontSize: '11px', fontWeight: 700, letterSpacing: '2.5px', textTransform: 'uppercase' }}>{heroBadge}</span>
            </div>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            style={{ fontSize: 'clamp(2.8rem, 6vw, 5rem)', fontWeight: 800, letterSpacing: '-2px', lineHeight: 1.05, color: '#e8f5ec', marginBottom: '0.6rem' }}
          >
            {heroHeadingLine1}
            <br />
            <span style={{ background: 'linear-gradient(90deg, #52b788, #95d5b2)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              {heroHeadingLine2}
            </span>
          </motion.h1>

          {/* Typewriter */}
          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.25 }}
            style={{ fontSize: '1.1rem', color: 'rgba(232,245,236,0.5)', marginBottom: '1.8rem', fontWeight: 300 }}
          >
            I&apos;m a — <Typewriter roles={rolesArray} />
          </motion.p>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.35 }}
            className="about-hero-desc"
            style={{
              fontSize: '0.95rem', color: 'rgba(232,245,236,0.55)', lineHeight: 1.85,
              maxWidth: '560px', borderLeft: '2px solid rgba(82,183,136,0.3)', paddingLeft: '1.2rem', marginBottom: '2.5rem',
            }}
          >
            {heroDescription}
          </motion.p>

          {/* Stats row — styled like Process cards */}
          <motion.div
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.5 }}
            className="about-hero-stats"
            style={{ display: 'flex', gap: '1px', flexWrap: 'wrap' }}
          >
            {stats.map(([val, lab], i) => (
              <motion.div
                key={lab}
                whileHover={{ scale: 1.05, borderColor: 'rgba(82,183,136,0.4)', boxShadow: '0 8px 32px rgba(0,0,0,0.4), 0 0 20px rgba(82,183,136,0.15)' }}
                transition={{ duration: 0.25 }}
                style={{
                  padding: '1rem 1.4rem', background: 'rgba(11,15,14,0.8)',
                  border: '1px solid rgba(82,183,136,0.15)', backdropFilter: 'blur(12px)',
                  borderRadius: i === 0 ? '12px 0 0 12px' : i === 3 ? '0 12px 12px 0' : '0',
                }}
              >
                <p style={{ fontSize: '1.5rem', fontWeight: 800, color: '#52b788', margin: 0, lineHeight: 1 }}>{val}</p>
                <p style={{ fontSize: '0.65rem', color: 'rgba(168,230,207,0.4)', margin: '4px 0 0', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{lab}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.65 }}
            className="about-hero-ctas"
            style={{ display: 'flex', gap: '1rem', marginTop: '2.5rem', flexWrap: 'wrap' }}
          >
            <Link href={heroCtaHref1} style={{ textDecoration: 'none' }}>
              <motion.button
                whileHover={{ scale: 1.04, boxShadow: '0 0 40px rgba(82,183,136,0.4)' }}
                whileTap={{ scale: 0.96 }}
                style={{ padding: '0.85rem 2rem', borderRadius: '100px', border: 'none', background: 'linear-gradient(135deg, #52b788, #2d6a4f)', color: '#07130f', fontWeight: 700, cursor: 'pointer', fontSize: '0.9rem', letterSpacing: '0.03em', overflow: 'hidden', position: 'relative' }}
              >
                <motion.span animate={{ x: ['-100%', '200%'] }} transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 3 }}
                  style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)', pointerEvents: 'none' }} />
                {heroCtaLabel1}
              </motion.button>
            </Link>
            <Link href={heroCtaHref2} style={{ textDecoration: 'none' }}>
              <motion.button
                whileHover={{ scale: 1.04, borderColor: 'rgba(82,183,136,0.5)', background: 'rgba(82,183,136,0.07)' }}
                whileTap={{ scale: 0.96 }}
                style={{ padding: '0.85rem 2rem', borderRadius: '100px', border: '1px solid rgba(168,230,207,0.18)', background: 'transparent', color: '#e8f5ec', fontWeight: 500, cursor: 'pointer', fontSize: '0.9rem' }}
              >
                {heroCtaLabel2}
              </motion.button>
            </Link>
          </motion.div>
        </div>

        {/* Right — logo holder */}
        <div style={{ position: 'relative' }}>
          <LogoHolder logoText={heroLogoBadge} />
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }}
        style={{ position: 'absolute', bottom: '2.5rem', left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem', zIndex: 2 }}
      >
        <span style={{ fontSize: '0.6rem', letterSpacing: '0.25em', color: 'rgba(168,230,207,0.25)', textTransform: 'uppercase' }}>Scroll</span>
        <motion.div animate={{ y: [0, 12, 0] }} transition={{ duration: 1.8, repeat: Infinity }}
          style={{ width: '20px', height: '32px', border: '1px solid rgba(168,230,207,0.12)', borderRadius: '20px', display: 'flex', justifyContent: 'center', paddingTop: '5px' }}
        >
          <motion.div animate={{ y: [0, 8, 0], opacity: [1, 0.3, 1] }} transition={{ duration: 1.8, repeat: Infinity }}
            style={{ width: '3px', height: '6px', background: '#52b788', borderRadius: '2px' }} />
        </motion.div>
      </motion.div>

      <style>{`
        @keyframes pulseDot { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.35;transform:scale(1.6)} }
        
        @media (max-width: 991px) {
          .about-hero-grid {
            grid-template-columns: 1fr !important;
            gap: 3rem !important;
            justify-items: center;
          }
          .about-hero-left {
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
          }
          .about-hero-left h1 {
            text-align: center !important;
          }
          .about-hero-left p {
            text-align: center !important;
          }
          .about-hero-left div {
            justify-content: center !important;
          }
          .about-hero-desc {
            border-left: none !important;
            border-top: 2px solid rgba(82,183,136,0.3) !important;
            padding-left: 0 !important;
            padding-top: 1rem !important;
            text-align: center !important;
            max-width: 100% !important;
          }
          .about-hero-stats {
            justify-content: center !important;
          }
          .about-hero-ctas {
            justify-content: center !important;
          }
        }
      `}</style>
    </section>
  );
}