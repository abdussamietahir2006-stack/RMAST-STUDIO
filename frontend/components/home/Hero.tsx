'use client';

import {
  motion, useMotionValue, useTransform, useSpring,
  AnimatePresence, type Variants,
} from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState, useCallback } from 'react';
import LogoAnimation from './LogoAnimation';

/* ══════════════════════════════════════════════════════
   CMS DATA TYPES
══════════════════════════════════════════════════════ */
export interface HeroCMSData {
  data?:   Record<string, string>;
  images?: Record<string, string>;
}

/* ══════════════════════════════════════════════════════
   CONSTANTS (non-CMS — animation/design specifics)
══════════════════════════════════════════════════════ */
const ROLES = ['Web Developer', 'UI/UX Designer', '3D Expert', 'AI Automator'];

const PARTICLE_SIZES = [3, 4.5, 2.5, 3.8, 2, 4, 3.2, 2.8, 4.2, 3.5, 2.2, 3.9, 2.6, 4.1];
const PARTICLE_POSITIONS = [
  { top: '15%', left: '5%' }, { top: '20.5%', left: '11.5%' }, { top: '26%', left: '18%' },
  { top: '31.5%', left: '24.5%' }, { top: '37%', left: '31%' }, { top: '42.5%', left: '37.5%' },
  { top: '48%', left: '44%' }, { top: '53.5%', left: '50.5%' }, { top: '59%', left: '57%' },
  { top: '64.5%', left: '63.5%' }, { top: '70%', left: '70%' }, { top: '75.5%', left: '76.5%' },
  { top: '81%', left: '83%' }, { top: '86.5%', left: '89.5%' },
];

const SKILLS = [
  { label: 'Next.js', x: '-60px', y: '15%', delay: 0 },
  { label: 'MongoDB', x: '-80px', y: '55%', delay: 0.5 },
  { label: 'Figma', x: '108%', y: '20%', delay: 1 },
  { label: 'Three.js', x: '105%', y: '65%', delay: 1.5 },
  { label: 'AI / LLMs', x: '20%', y: '-50px', delay: 0.8 },
];

/* ══════════════════════════════════════════════════════
   ANIMATED COUNTER
══════════════════════════════════════════════════════ */
function Counter({ to, suffix = '', delay = 600 }: { to: number; suffix?: string; delay?: number }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const duration = 1800;
    let rafId: number;
    const timer = setTimeout(() => {
      const start = performance.now();
      const tick = (now: number) => {
        const p = Math.min((now - start) / duration, 1);
        const ease = 1 - Math.pow(1 - p, 4);
        setCount(Math.round(ease * to));
        if (p < 1) { rafId = requestAnimationFrame(tick); }
        else { setCount(to); }
      };
      rafId = requestAnimationFrame(tick);
    }, delay);
    return () => { clearTimeout(timer); cancelAnimationFrame(rafId); };
  }, [to, delay]);
  return <>{count}{suffix}</>;
}

/* ══════════════════════════════════════════════════════
   ORBITING RING
══════════════════════════════════════════════════════ */
function OrbitRing({ radius, speed, dotColor, dashArray, opacity = 0.18 }: {
  radius: number; speed: number; dotColor: string; dashArray: string; opacity?: number;
}) {
  const size = radius * 2;
  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: speed, repeat: Infinity, ease: 'linear' }}
      style={{
        position: 'absolute',
        width: size, height: size,
        top: '50%', left: '50%',
        marginTop: -radius, marginLeft: -radius,
        borderRadius: '50%',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle
          cx={radius} cy={radius} r={radius - 2}
          fill="none"
          stroke="rgba(82,183,136,0.15)"
          strokeWidth="0.8"
          strokeDasharray={dashArray}
          opacity={opacity}
        />
        {/* Orbiting dot */}
        <circle cx={radius * 2 - 4} cy={radius} r={3} fill={dotColor}
          style={{ filter: `drop-shadow(0 0 6px ${dotColor})` }} />
      </svg>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════
   MAGNETIC CURSOR BLOB
══════════════════════════════════════════════════════ */
function CursorBlob({ sectionRef, isMobile }: { sectionRef: React.RefObject<HTMLElement | null>; isMobile?: boolean }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 60, damping: 20 });
  const springY = useSpring(y, { stiffness: 60, damping: 20 });
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const move = (e: MouseEvent) => { x.set(e.clientX - 200); y.set(e.clientY - 200); };
    el.addEventListener('mousemove', move);
    return () => el.removeEventListener('mousemove', move);
  }, [x, y, sectionRef]);
  return (
    <motion.div style={{
      position: 'fixed', left: springX, top: springY,
      width: isMobile ? 220 : 400, height: isMobile ? 220 : 400,
      background: 'radial-gradient(circle, rgba(82,183,136,0.1), transparent 70%)',
      borderRadius: '50%', pointerEvents: 'none', zIndex: 0,
      filter: 'blur(40px)', mixBlendMode: 'screen',
    }} />
  );
}

/* ══════════════════════════════════════════════════════
   PARTICLE
══════════════════════════════════════════════════════ */
function Particle({ i }: { i: number }) {
  const size = PARTICLE_SIZES[i] ?? 3;
  const pos = PARTICLE_POSITIONS[i] ?? { top: '50%', left: '50%' };
  return (
    <motion.div
      animate={{
        y: [0, -(30 + i * 8), 0],
        x: [0, (i % 2 === 0 ? 1 : -1) * (10 + i * 3), 0],
        opacity: [0, 0.8, 0],
        scale: [0.5, 1.2, 0.5],
      }}
      transition={{ duration: 4 + i * 0.5, repeat: Infinity, delay: i * 0.35, ease: 'easeInOut' }}
      style={{
        position: 'absolute', width: size, height: size,
        background: i % 3 === 0 ? '#a8e6cf' : i % 3 === 1 ? '#52b788' : '#95d5b2',
        borderRadius: '50%',
        top: pos.top, left: pos.left,
        boxShadow: `0 0 ${size * 3}px currentColor`,
        filter: 'blur(0.5px)', pointerEvents: 'none', zIndex: 1,
      }}
    />
  );
}

/* ══════════════════════════════════════════════════════
   SKILL TAG
══════════════════════════════════════════════════════ */
function SkillTag({ skill }: { skill: typeof SKILLS[0] }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: 1, scale: 1, y: [0, -8, 0] }}
      transition={{
        opacity: { delay: skill.delay + 0.8, duration: 0.5 },
        scale: { delay: skill.delay + 0.8, duration: 0.5 },
        y: { delay: skill.delay + 0.8, duration: 3 + skill.delay, repeat: Infinity, ease: 'easeInOut' },
      }}
      style={{
        position: 'absolute', left: skill.x, top: skill.y,
        background: 'rgba(10,24,18,0.9)', backdropFilter: 'blur(20px)',
        border: '1px solid rgba(82,183,136,0.2)', borderRadius: '10px',
        padding: '0.45rem 0.9rem', fontSize: '0.68rem',
        color: 'rgba(232,245,236,0.7)', letterSpacing: '0.08em',
        whiteSpace: 'nowrap', boxShadow: '0 4px 20px rgba(0,0,0,0.3)', zIndex: 5,
      }}
    >
      <span style={{ color: '#52b788', marginRight: '0.4rem' }}>✦</span>{skill.label}
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════
   TYPEWRITER
══════════════════════════════════════════════════════ */
function Typewriter() {
  const [idx, setIdx] = useState(0);
  const [text, setText] = useState('');
  const [deleting, setDeleting] = useState(false);
  useEffect(() => {
    const word = ROLES[idx];
    let t: ReturnType<typeof setTimeout>;
    if (!deleting && text.length < word.length)
      t = setTimeout(() => setText(word.slice(0, text.length + 1)), 80);
    else if (!deleting && text.length === word.length)
      t = setTimeout(() => setDeleting(true), 1800);
    else if (deleting && text.length > 0)
      t = setTimeout(() => setText(text.slice(0, -1)), 45);
    else { setDeleting(false); setIdx(i => (i + 1) % ROLES.length); }
    return () => clearTimeout(t);
  }, [text, deleting, idx]);
  return (
    <span style={{ color: '#52b788', display: 'inline-block', minWidth: '220px' }}>
      {text}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.6, repeat: Infinity, repeatType: 'reverse' }}
        style={{ borderRight: '2px solid #52b788', marginLeft: '2px' }}
      />
    </span>
  );
}

/* ══════════════════════════════════════════════════════
   SOCIAL LINKS
══════════════════════════════════════════════════════ */
function SocialLinks({ isMobile, github, linkedin, twitter, dribbble }: {
  isMobile?: boolean;
  github?: string; linkedin?: string; twitter?: string; dribbble?: string;
}) {
  const links = [
    { label: 'GH', href: github   || '#', title: 'GitHub' },
    { label: 'LI', href: linkedin || '#', title: 'LinkedIn' },
    { label: 'TW', href: twitter  || '#', title: 'Twitter' },
    { label: 'DR', href: dribbble || '#', title: 'Dribbble' },
  ];
  if (isMobile) return null;
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 1.5, duration: 0.6 }}
      style={{
        position: 'absolute', left: '-2.5rem', top: '50%',
        transform: 'translateY(-50%)',
        display: 'flex', flexDirection: 'column', gap: '0.8rem', zIndex: 5,
      }}
    >
      {links.map((link, i) => (
        <motion.a
          key={link.label} href={link.href} title={link.title}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.6 + i * 0.1 }}
          whileHover={{ x: 4, color: '#52b788', borderColor: 'rgba(82,183,136,0.5)', background: 'rgba(82,183,136,0.08)' }}
          style={{
            width: 32, height: 32,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            borderRadius: 8, border: '1px solid rgba(82,183,136,0.15)',
            background: 'rgba(10,24,18,0.6)', color: 'rgba(232,245,236,0.4)',
            fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.02em',
            textDecoration: 'none', backdropFilter: 'blur(12px)',
          }}
        >
          {link.label}
        </motion.a>
      ))}
      <motion.div
        initial={{ scaleY: 0 }} animate={{ scaleY: 1 }}
        transition={{ delay: 2, duration: 0.6 }}
        style={{ width: 1, height: 40, background: 'rgba(82,183,136,0.15)', margin: '0 auto', transformOrigin: 'top' }}
      />
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════
   DATA STREAM (vertical code rain stripe)
══════════════════════════════════════════════════════ */
const STREAM_CHARS = '01アイウエオカキクケコ∑∂∆πΩ'.split('');

function DataStream({ x, delay }: { x: string; delay: number }) {
  const chars = Array.from({ length: 12 }, (_, i) =>
    STREAM_CHARS[Math.floor((i * 7 + delay * 3) % STREAM_CHARS.length)]
  );
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 0.6, 0] }}
      transition={{ duration: 4, delay, repeat: Infinity, repeatDelay: Math.random() * 6 + 2 }}
      style={{
        position: 'absolute', left: x, top: 0, bottom: 0,
        display: 'flex', flexDirection: 'column', gap: '4px',
        pointerEvents: 'none', zIndex: 0,
      }}
    >
      {chars.map((c, i) => (
        <motion.span key={i}
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 0.4, delay: i * 0.08 + delay, repeat: Infinity, repeatDelay: 4 }}
          style={{
            fontFamily: 'monospace', fontSize: '10px',
            color: i === 0 ? '#a8e6cf' : 'rgba(82,183,136,0.3)',
            lineHeight: 1.4,
          }}
        >
          {c}
        </motion.span>
      ))}
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════
   GLITCH TEXT
══════════════════════════════════════════════════════ */
function GlitchName({ isMobile, text }: { isMobile?: boolean; text: string }) {
  const [glitching, setGlitching] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setGlitching(true);
      setTimeout(() => setGlitching(false), 300);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <motion.span
        animate={glitching ? { x: [-2, 2, -1, 0], skewX: [-2, 2, 0] } : {}}
        transition={{ duration: 0.15, repeat: glitching ? 2 : 0 }}
        style={{
          fontFamily: "'Syne', sans-serif",
          fontSize: isMobile ? '2.2rem' : 'clamp(2.8rem, 5.5vw, 5rem)',
          fontWeight: 800, color: '#e8f5ec',
          display: 'block', lineHeight: 1,
          textShadow: glitching
            ? '-2px 0 rgba(0,229,255,0.8), 2px 0 rgba(118,255,3,0.8)'
            : 'none',
        }}
      >
        {text}
      </motion.span>
      {glitching && (
        <>
          <span style={{
            position: 'absolute', inset: 0, color: 'rgba(0,229,255,0.5)',
            fontFamily: "'Syne', sans-serif", fontSize: isMobile ? '2.2rem' : 'clamp(2.8rem, 5.5vw, 5rem)',
            fontWeight: 800, clipPath: 'inset(30% 0 50% 0)',
            transform: 'translateX(-3px)',
            pointerEvents: 'none',
          }}>{text}</span>
          <span style={{
            position: 'absolute', inset: 0, color: 'rgba(118,255,3,0.5)',
            fontFamily: "'Syne', sans-serif", fontSize: isMobile ? '2.2rem' : 'clamp(2.8rem, 5.5vw, 5rem)',
            fontWeight: 800, clipPath: 'inset(60% 0 15% 0)',
            transform: 'translateX(3px)',
            pointerEvents: 'none',
          }}>{text}</span>
        </>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   ANIMATED GRADIENT BORDER BUTTON
══════════════════════════════════════════════════════ */
function GradientButton({ children, primary = false, href, download, fullWidth }: {
  children: React.ReactNode; primary?: boolean; href?: string; download?: boolean; fullWidth?: boolean;
}) {
  const [hovered, setHovered] = useState(false);

  const sharedStyle: React.CSSProperties = {
    position: 'relative', padding: '0.85rem 2rem',
    borderRadius: 100, border: 'none', cursor: 'pointer',
    fontSize: '0.9rem', fontWeight: 700, letterSpacing: '0.03em',
    background: primary ? 'linear-gradient(135deg, #52b788, #2d6a4f)' : 'transparent',
    color: primary ? '#07130f' : '#e8f5ec',
    overflow: 'hidden', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    width: fullWidth ? '100%' : undefined,
    textDecoration: 'none',
  };

  const inner = (
    <>
      {!primary && (
        <motion.div
          animate={{ rotate: hovered ? 360 : 0 }}
          transition={{ duration: 2, repeat: hovered ? Infinity : 0, ease: 'linear' }}
          style={{
            position: 'absolute', inset: -1, borderRadius: 100,
            background: hovered
              ? 'conic-gradient(from 0deg, #52b788, #00e5ff, #76ff03, #52b788)'
              : 'conic-gradient(from 0deg, rgba(82,183,136,0.3), rgba(82,183,136,0.1), rgba(82,183,136,0.3))',
            zIndex: -1,
          }}
        />
      )}
      {!primary && (
        <div style={{ position: 'absolute', inset: 1, borderRadius: 100, background: 'rgba(7,19,15,0.95)', zIndex: -1 }} />
      )}
      {primary && (
        <motion.span
          animate={{ x: ['-100%', '200%'] }}
          transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 2 }}
          style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)',
            pointerEvents: 'none',
          }}
        />
      )}
      {children}
    </>
  );

  if (href) {
    return (
      <motion.a
        href={href}
        download={download || undefined}
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        style={sharedStyle}
      >
        {inner}
      </motion.a>
    );
  }

  return (
    <motion.button
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.96 }}
      style={sharedStyle}
    >
      {inner}
    </motion.button>
  );
}

/* ══════════════════════════════════════════════════════
   3D HERO CARD (image holder replaced with Live Logo)
══════════════════════════════════════════════════════ */
function HeroCard({
  isMobile,
  heroBadge,
  heroYearsExp,
  heroProjects,
}: {
  isMobile?: boolean;
  heroImage?: string;
  hasImage?: boolean;
  heroBadge?: string;
  heroYearsExp?: string;
  heroProjects?: string;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springRotX = useSpring(rotateX, { stiffness: 150, damping: 25 });
  const springRotY = useSpring(rotateY, { stiffness: 150, damping: 25 });
  const glowX = useTransform(springRotY, [-25, 25], ['0%', '100%']);
  const glowY = useTransform(springRotX, [-25, 25], ['0%', '100%']);

  const handleMouse = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    const cx = (e.clientX - rect.left) / rect.width - 0.5;
    const cy = (e.clientY - rect.top) / rect.height - 0.5;
    rotateY.set(cx * 30);
    rotateX.set(-cy * 30);
  };

  const handleLeave = () => { rotateX.set(0); rotateY.set(0); };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouse}
      onMouseLeave={handleLeave}
      style={{ perspective: '1000px', cursor: 'default', position: 'relative', width: isMobile ? '100%' : undefined, maxWidth: isMobile ? 320 : undefined }}
      initial={{ opacity: 0, scale: 0.85, rotateY: 25 }}
      animate={{ opacity: 1, scale: 1, rotateY: 0 }}
      transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* ── ORBITING RINGS around card ── */}
      {!isMobile && (
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
          <OrbitRing radius={260} speed={18} dotColor="#52b788" dashArray="4 8" opacity={0.25} />
          <OrbitRing radius={300} speed={28} dotColor="#00e5ff" dashArray="2 14" opacity={0.15} />
          <OrbitRing radius={340} speed={12} dotColor="#76ff03" dashArray="6 20" opacity={0.1} />
        </div>
      )}

      {/* ── CORNER GLOW BLOBS ── */}
      {!isMobile && [
        { top: '-10%', left: '-10%', color: 'rgba(82,183,136,0.25)' },
        { top: '-10%', right: '-10%', color: 'rgba(0,229,255,0.15)' },
        { bottom: '-10%', right: '-10%', color: 'rgba(118,255,3,0.12)' },
      ].map((blob, i) => (
        <motion.div key={i}
          animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 5 + i * 2, repeat: Infinity, ease: 'easeInOut', delay: i * 1.5 }}
          style={{
            position: 'absolute', width: 180, height: 180,
            borderRadius: '50%', background: blob.color,
            filter: 'blur(60px)', pointerEvents: 'none', zIndex: 0,
            ...blob,
          }}
        />
      ))}

      {/* DATA STREAM strips flanking the card */}
      {!isMobile && (
        <>
          <div style={{ position: 'absolute', top: '5%', left: '-32px', height: '90%', overflow: 'hidden', width: 20, pointerEvents: 'none' }}>
            <DataStream x="0" delay={0} />
            <DataStream x="12px" delay={0.7} />
          </div>
          <div style={{ position: 'absolute', top: '5%', right: '-32px', height: '90%', overflow: 'hidden', width: 20, pointerEvents: 'none' }}>
            <DataStream x="0" delay={0.3} />
            <DataStream x="12px" delay={1.1} />
          </div>
        </>
      )}

      <motion.div
        style={{
          rotateX: springRotX,
          rotateY: springRotY,
          transformStyle: 'preserve-3d',
          position: 'relative',
          borderRadius: '28px',
          overflow: 'hidden',
          width: 'min(520px, 48vw)',
          aspectRatio: '34/23',
          margin: '0 auto',
          border: '1px solid rgba(168,230,207,0.25)',
          boxShadow: '0 40px 100px rgba(0,0,0,0.55), 0 0 100px rgba(82,183,136,0.2)',
          background: '#060e0a',
          zIndex: 1,
        }}
      >
        {/* Holographic glare */}
        <motion.div style={{
          position: 'absolute', inset: 0,
          background: `radial-gradient(circle at ${glowX} ${glowY}, rgba(168,230,207,0.15), transparent 60%)`,
          zIndex: 10, pointerEvents: 'none', borderRadius: '28px',
        }} />

        <LogoAnimation />

        {/* Scanline shimmer */}
        <motion.div
          animate={{ y: ['-100%', '200%'] }}
          transition={{ duration: 5, repeat: Infinity, repeatDelay: 3, ease: 'linear' }}
          style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(180deg, transparent 0%, rgba(232,245,236,0.04) 50%, transparent 100%)',
            height: '30%', zIndex: 11, pointerEvents: 'none',
          }}
        />

        {/* Inner border pulse */}
        <motion.div
          animate={{ opacity: [0, 0.4, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute', inset: 0, borderRadius: 28, zIndex: 12, pointerEvents: 'none',
            border: '1px solid rgba(82,183,136,0.4)',
          }}
        />
      </motion.div>

      {!isMobile && (
        <motion.div
          animate={{ y: [0, -10, 0], rotateZ: [0, 2, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute', bottom: '-20px', left: '-28px',
            background: 'rgba(10,24,18,0.9)', backdropFilter: 'blur(20px)',
            border: '1px solid rgba(82,183,136,0.3)', borderRadius: 16,
            padding: '0.9rem 1.3rem',
            display: 'flex', alignItems: 'center', gap: '0.6rem',
            boxShadow: '0 8px 32px rgba(0,0,0,0.4), 0 0 20px rgba(82,183,136,0.1)',
            transformStyle: 'preserve-3d', transform: 'translateZ(20px)',
            zIndex: 6,
          }}
        >
          <motion.div
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{ width: 8, height: 8, background: '#52b788', borderRadius: '50%', boxShadow: '0 0 10px #52b788' }}
          />
          <span style={{ fontSize: '0.72rem', color: '#e8f5ec', letterSpacing: '0.05em', fontWeight: 500 }}>{heroBadge}</span>
        </motion.div>
      )}

      {!isMobile && (
        <motion.div
          animate={{ y: [0, -8, 0], rotateZ: [0, -1.5, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          style={{
            position: 'absolute', top: '-18px', right: '-24px',
            background: 'rgba(10,24,18,0.9)', backdropFilter: 'blur(20px)',
            border: '1px solid rgba(82,183,136,0.2)', borderRadius: 12,
            padding: '0.65rem 1.1rem', fontSize: '0.7rem', color: 'rgba(232,245,236,0.7)',
            letterSpacing: '0.08em',
            boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
            transformStyle: 'preserve-3d', transform: 'translateZ(30px)',
            zIndex: 6,
          }}
        >
          ✦ {heroYearsExp} Years
        </motion.div>
      )}

      <motion.div
        animate={{ y: [0, 12, 0], rotateZ: [0, 1, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        style={{
          position: 'absolute', top: '38%', right: '-40px',
          background: 'rgba(10,24,18,0.9)', backdropFilter: 'blur(20px)',
          border: '1px solid rgba(82,183,136,0.15)', borderRadius: 12,
          padding: '0.65rem 1rem',
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
          transformStyle: 'preserve-3d', transform: 'translateZ(15px)',
          zIndex: 6,
        }}
      >
        <span style={{ fontSize: '1.1rem', fontWeight: 300, color: '#52b788', lineHeight: 1 }}>{heroProjects}</span>
        <span style={{ fontSize: '0.58rem', color: 'rgba(232,245,236,0.4)', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 2 }}>Projects</span>
      </motion.div>

      {/* Skill tags */}
      {!isMobile && SKILLS.map((s, i) => <SkillTag key={i} skill={s} />)}
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════
   NOISE TEXTURE OVERLAY (SVG-based, no external dep)
══════════════════════════════════════════════════════ */
function NoiseOverlay() {
  return (
    <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.035, pointerEvents: 'none', zIndex: 0 }}>
      <filter id="noise">
        <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#noise)" />
    </svg>
  );
}

/* ══════════════════════════════════════════════════════
   SCROLL INDICATOR
══════════════════════════════════════════════════════ */
function ScrollIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.5 }}
      style={{
        position: 'absolute', bottom: '2.5rem', left: '50%', transform: 'translateX(-50%)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem', zIndex: 3,
      }}
    >
      <span style={{ fontSize: '0.6rem', letterSpacing: '0.25em', color: 'rgba(232,245,236,0.25)', textTransform: 'uppercase' }}>Scroll</span>
      <motion.div
        animate={{ y: [0, 14, 0] }} transition={{ duration: 1.8, repeat: Infinity }}
        style={{
          width: 20, height: 34, border: '1px solid rgba(232,245,236,0.12)', borderRadius: 20,
          display: 'flex', justifyContent: 'center', paddingTop: 5,
        }}
      >
        <motion.div
          animate={{ y: [0, 8, 0], opacity: [1, 0.3, 1] }}
          transition={{ duration: 1.8, repeat: Infinity }}
          style={{ width: 3, height: 6, background: '#52b788', borderRadius: 2 }}
        />
      </motion.div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════
   STAT CARD (animated counter version)
══════════════════════════════════════════════════════ */
function StatItem({ num, suffix, label, delay }: { num: number; suffix: string; label: string; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
    >
      <p style={{ fontSize: '1.6rem', fontWeight: 300, color: '#52b788', lineHeight: 1 }}>
        <Counter to={num} suffix={suffix} />
      </p>
      <p style={{ fontSize: '0.7rem', color: 'rgba(232,245,236,0.25)', letterSpacing: '0.1em', marginTop: '0.3rem', textTransform: 'uppercase' }}>
        {label}
      </p>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════
   MAIN HERO
══════════════════════════════════════════════════════ */
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } },
};
const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.2 } },
};

export default function Hero({ data = {}, images = {} }: HeroCMSData) {
  // CMS values with exact hardcoded fallbacks
  const heroLine1      = data.heroLine1      || 'Your Digital';
  const heroLine2      = data.heroLine2      || 'Creative';
  const heroLine3      = data.heroLine3      || 'Advantage';
  const heroTagline    = data.heroTagline    || 'Nature-Inspired Digital Craft';
  const heroDesc       = data.heroDescription|| 'I build immersive, organic digital systems — blending design, development, and intelligent automation to help brands grow naturally.';
  const heroBadge      = data.heroBadge      || 'Available for work';
  const heroYearsExp   = data.heroYearsExp   || '3+';
  const heroProjects   = data.heroProjects   || '50+';
  const stat1Num       = Number(data.heroStat1Num    || 3);
  const stat1Suffix    = data.heroStat1Suffix || '+';
  const stat1Label     = data.heroStat1Label  || 'Years Exp.';
  const stat2Num       = Number(data.heroStat2Num    || 50);
  const stat2Suffix    = data.heroStat2Suffix || '+';
  const stat2Label     = data.heroStat2Label  || 'Projects';
  const stat3Num       = Number(data.heroStat3Num    || 100);
  const stat3Suffix    = data.heroStat3Suffix || '%';
  const stat3Label     = data.heroStat3Label  || 'Satisfaction';
  const ctaLabel1      = data.heroCtaLabel1  || 'Explore Work';
  const ctaHref1       = data.heroCtaHref1   || '/projects';
  const ctaLabel2      = data.heroCtaLabel2  || 'Download CV';
  const cvUrl          = data.cvUrl          || '/cv.pdf';
  const ctaLabel3      = data.heroCtaLabel3  || 'Contact';
  const ctaHref3       = data.heroCtaHref3   || '/contact';
  const githubUrl      = data.heroGithubUrl   || '#';
  const linkedinUrl    = data.heroLinkedinUrl || '#';
  const twitterUrl     = data.heroTwitterUrl  || '#';
  const dribbbleUrl    = data.heroDribbbleUrl || '#';
  const heroImage      = images.heroImage    || '';
  const hasImage       = !!heroImage;

  const sectionRef = useRef<HTMLElement | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(typeof window !== 'undefined' && window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);
  return (
    <section
      ref={sectionRef}
      style={{
        minHeight: '100vh',
        padding: isMobile ? '100px 20px 60px' : '9rem 6vw 6rem',
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(160deg, #060f0c 0%, #091a13 50%, #07130f 100%)',
      }}
    >
      {!isMobile && <CursorBlob sectionRef={sectionRef} isMobile={isMobile} />}
      <NoiseOverlay />

      {/* ── AMBIENT MESH BLOBS ── */}
      <motion.div
        animate={{ scale: [1, 1.2, 1], x: [0, 60, 0], y: [0, 40, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute', top: '-20%', left: '-15%',
          width: 700, height: 700, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(52,120,90,0.22), transparent 70%)',
          filter: 'blur(120px)', zIndex: 0,
        }}
      />
      <motion.div
        animate={{ scale: [1, 0.85, 1], x: [0, -80, 0], y: [0, -60, 0] }}
        transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute', bottom: '-20%', right: '-15%',
          width: 800, height: 800, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(30,90,70,0.2), transparent 70%)',
          filter: 'blur(140px)', zIndex: 0,
        }}
      />
      {/* Extra accent blob — cyan tint */}
      <motion.div
        animate={{ x: [0, 100, 0], y: [0, -80, 0], scale: [1, 1.15, 1] }}
        transition={{ duration: 30, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute', top: '30%', left: '40%',
          width: 500, height: 500, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,100,100,0.08), transparent 70%)',
          filter: 'blur(100px)', zIndex: 0,
        }}
      />

      {/* ── GRID LINES ── */}
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.04, zIndex: 0, pointerEvents: 'none' }}>
        <defs>
          <pattern id="heroGrid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#52b788" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#heroGrid)" />
      </svg>

      {/* ── DIAGONAL ACCENT LINE ── */}
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: 1 }}
        transition={{ delay: 1.8, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: 'absolute', top: '18%', left: '-5%', right: '-5%', height: 1,
          background: 'linear-gradient(90deg, transparent, rgba(82,183,136,0.08), rgba(82,183,136,0.15), rgba(82,183,136,0.08), transparent)',
          transform: 'rotate(-6deg)', transformOrigin: 'left', zIndex: 0, pointerEvents: 'none',
        }}
      />
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: 1 }}
        transition={{ delay: 2.0, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: 'absolute', bottom: '25%', left: '-5%', right: '-5%', height: 1,
          background: 'linear-gradient(90deg, transparent, rgba(82,183,136,0.06), rgba(82,183,136,0.1), rgba(82,183,136,0.06), transparent)',
          transform: 'rotate(-6deg)', transformOrigin: 'right', zIndex: 0, pointerEvents: 'none',
        }}
      />

      {/* ── PARTICLES ── */}
      {!isMobile && [...Array(14)].map((_, i) => <Particle key={i} i={i} />)}

      {/* ── MAIN GRID ── */}
      <div style={{
        position: 'relative', zIndex: 2,
        display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
        gap: '2.4rem', alignItems: 'center',
        maxWidth: isMobile ? '100%' : '1400px', margin: '0 auto',
      }}>
        {/* LEFT */}
        <motion.div variants={containerVariants} initial="hidden" animate="visible" style={{ position: 'relative', textAlign: isMobile ? 'center' : 'left', padding: isMobile ? '0 0' : undefined }}>
          <SocialLinks isMobile={isMobile} github={githubUrl} linkedin={linkedinUrl} twitter={twitterUrl} dribbble={dribbbleUrl} />

          {/* Animated label */}
          <motion.div variants={fadeUp} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.4rem' }}>
            <motion.div
              animate={{ scaleX: [0, 1] }}
              transition={{ duration: 0.8, delay: 0.2 }}
              style={{ height: 1, width: 32, background: 'linear-gradient(90deg, transparent, #52b788)', display: 'inline-block' }}
            />
            <motion.span
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 3, repeat: Infinity }}
              style={{ fontSize: '0.72rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: '#52b788' }}
            >
              {heroTagline}
            </motion.span>
          </motion.div>

          {/* GLITCH Heading */}
          <motion.div variants={fadeUp}>
            <GlitchName isMobile={isMobile} text={heroLine1} />
            <motion.span style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: isMobile ? '2.2rem' : 'clamp(2.8rem, 5.5vw, 5rem)',
              fontWeight: 800, lineHeight: 1, display: 'block',
            }}>
              <em style={{ fontStyle: 'italic', fontWeight: 400, color: '#52b7b4' }}>{heroLine2}</em>
            </motion.span>
            <motion.span style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: isMobile ? '2.2rem' : 'clamp(2.8rem, 5.5vw, 5rem)',
              fontWeight: 800, color: '#e8f5ec', lineHeight: 1, display: 'block', marginBottom: '0.5rem',
            }}>
              {heroLine3}
            </motion.span>
          </motion.div>

          {/* Typewriter */}
          <motion.p variants={fadeUp} style={{ fontSize: '1.1rem', color: 'rgba(232,245,236,0.65)', marginBottom: '1.8rem', fontWeight: 300 }}>
            We are — <Typewriter />
          </motion.p>

          {/* Description with animated border */}
          <motion.div variants={fadeUp} style={{ position: 'relative', marginBottom: '2.5rem', maxWidth: isMobile ? '100%' : 480, marginLeft: isMobile ? 'auto' : undefined, marginRight: isMobile ? 'auto' : undefined }}>
            <motion.div
              animate={{ scaleY: [0, 1] }}
              transition={{ delay: 0.8, duration: 0.6 }}
              style={{
                position: 'absolute', left: 0, top: 0, bottom: 0, width: 1,
                background: 'linear-gradient(180deg, transparent, #52b788, transparent)',
                transformOrigin: 'top',
              }}
            />
            <p style={{
              fontSize: '0.95rem', color: 'rgba(232,245,236,0.65)',
              lineHeight: 1.8, paddingLeft: '1.2rem', margin: 0,
            }}>
              {heroDesc}
            </p>
          </motion.div>

          {/* BUTTONS */}
          <motion.div variants={fadeUp} style={{ display: 'flex', gap: isMobile ? '12px' : '0.8rem', flexWrap: 'wrap', flexDirection: isMobile ? 'column' : 'row' }}>
            <GradientButton primary href={ctaHref1} fullWidth={isMobile}>{ctaLabel1}</GradientButton>
            <GradientButton href={ctaHref3} fullWidth={isMobile}>{ctaLabel3}</GradientButton>
          </motion.div>

          {/* STATS with animated counters */}
          <motion.div
            variants={fadeUp}
            style={{
              display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? '1.2rem' : '2.5rem', marginTop: '3rem',
              paddingTop: '2rem', borderTop: '1px solid rgba(82,183,136,0.1)',
            }}
          >
            <StatItem num={stat1Num} suffix={stat1Suffix} label={stat1Label} delay={1.2} />
            <StatItem num={stat2Num} suffix={stat2Suffix} label={stat2Label} delay={1.35} />
            <StatItem num={stat3Num} suffix={stat3Suffix} label={stat3Label} delay={1.5} />
          </motion.div>
        </motion.div>

        {/* RIGHT */}
        <div style={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center', order: isMobile ? -1 : 0, width: isMobile ? '100%' : undefined }}>
          <HeroCard
            isMobile={isMobile}
            heroImage={heroImage}
            hasImage={hasImage}
            heroBadge={heroBadge}
            heroYearsExp={heroYearsExp}
            heroProjects={heroProjects}
          />
        </div>
      </div>

      <ScrollIndicator />
    </section>
  );
}