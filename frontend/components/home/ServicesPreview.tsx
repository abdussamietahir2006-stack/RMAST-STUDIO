'use client';

import { motion, useMotionValue, useSpring, useTransform, AnimatePresence, type Variants } from 'framer-motion';
import { useRef, useState, useEffect, useMemo } from 'react';
import Link from 'next/link';

/* ════════════════════════
   CMS DATA TYPES
════════════════════════ */
export interface ServicesPreviewCMSData {
  data?: Record<string, string>;
}

/* ════════════════════════
   STATIC SERVICE COLOURS & ICONS (design tokens — not CMS)
════════════════════════ */
const SERVICE_DESIGN = [
  {
    num: '01', short: 'DEV',
    accent: '#00ffb3', accentDim: 'rgba(0,255,179,0.12)', glow: 'rgba(0,255,179,0.35)',
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <rect x="1" y="5" width="30" height="22" rx="3" stroke="currentColor" strokeWidth="1.2"/>
        <path d="M1 11h30" stroke="currentColor" strokeWidth="1.2"/>
        <circle cx="6" cy="8" r="1" fill="currentColor"/>
        <circle cx="10" cy="8" r="1" fill="currentColor" fillOpacity="0.5"/>
        <circle cx="14" cy="8" r="1" fill="currentColor" fillOpacity="0.25"/>
        <polyline points="8,21 12,17 16,21 22,14" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      </svg>
    ),
  },
  {
    num: '02', short: 'UX',
    accent: '#7b61ff', accentDim: 'rgba(123,97,255,0.12)', glow: 'rgba(123,97,255,0.35)',
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <circle cx="11" cy="12" r="6" stroke="currentColor" strokeWidth="1.2"/>
        <circle cx="21" cy="12" r="6" stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.5"/>
        <circle cx="16" cy="20" r="6" stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.25"/>
        <circle cx="16" cy="14" r="2.2" fill="currentColor"/>
      </svg>
    ),
  },
  {
    num: '03', short: '3D',
    accent: '#ff6b35', accentDim: 'rgba(255,107,53,0.12)', glow: 'rgba(255,107,53,0.35)',
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <path d="M16 2L30 10V22L16 30L2 22V10L16 2Z" stroke="currentColor" strokeWidth="1.2"/>
        <path d="M16 2V30M2 10L30 10M2 22L30 22" stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.3"/>
        <circle cx="16" cy="16" r="3.5" stroke="currentColor" strokeWidth="1" fill="currentColor" fillOpacity="0.15"/>
      </svg>
    ),
  },
  {
    num: '04', short: 'AI',
    accent: '#ffdd00', accentDim: 'rgba(255,221,0,0.1)', glow: 'rgba(255,221,0,0.35)',
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <circle cx="16" cy="16" r="5" stroke="currentColor" strokeWidth="1.2"/>
        {[0, 90, 180, 270].map(a => {
          const rad = (a * Math.PI) / 180;
          const x1 = 16 + Math.cos(rad) * 9, y1 = 16 + Math.sin(rad) * 9;
          const x2 = 16 + Math.cos(rad) * 12, y2 = 16 + Math.sin(rad) * 12;
          return <g key={a}>
            <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="currentColor" strokeWidth="1"/>
            <circle cx={x2} cy={y2} r="2" stroke="currentColor" strokeWidth="1"/>
          </g>;
        })}
      </svg>
    ),
  },
];

/* Default text content — matches live website exactly */
const SERVICE_DEFAULTS = [
  {
    title: 'Web Development',
    desc: 'High-performance, scalable web applications built with obsessive attention to clean architecture and measurable outcomes.',
    stack: ['Next.js', 'React', 'Node.js', 'MongoDB', 'REST & GraphQL APIs'],
    metric: { label: 'Avg load time', value: '<1.2s' },
  },
  {
    title: 'UI / UX Design',
    desc: "Interfaces that don't just look beautiful — they guide, persuade, and convert. Every pixel is purposeful.",
    stack: ['Figma', 'Framer', 'Motion Design', 'Design Systems', 'Prototyping'],
    metric: { label: 'Conversion lift', value: '+38%' },
  },
  {
    title: '3D & Motion',
    desc: 'Cinematic, immersive visuals that stop the scroll. From WebGL shaders to Blender animations — real-time 3D for the web.',
    stack: ['Three.js', 'Blender', 'GSAP', 'Spline', 'WebGL Shaders'],
    metric: { label: 'Dwell time boost', value: '+4.2×' },
  },
  {
    title: 'AI Automation',
    desc: 'Intelligent workflows that eliminate repetitive work, slash costs, and scale your operations while you sleep.',
    stack: ['LangChain', 'OpenAI API', 'n8n', 'Zapier', 'Custom AI Pipelines'],
    metric: { label: 'Time saved / wk', value: '20h+' },
  },
];

/* Build the SERVICES array by merging CMS data over defaults */
function buildServices(data: Record<string, string>) {
  return SERVICE_DEFAULTS.map((def, i) => {
    const n = i + 1;
    const stackRaw = data[`service${n}Stack`];
    const detail = stackRaw
      ? stackRaw.split(',').map(s => s.trim()).filter(Boolean)
      : def.stack;
    return {
      ...SERVICE_DESIGN[i],
      title:  data[`service${n}Title`]        || def.title,
      desc:   data[`service${n}Desc`]         || def.desc,
      detail,
      metric: {
        label: data[`service${n}MetricLabel`] || def.metric.label,
        value: data[`service${n}MetricValue`] || def.metric.value,
      },
    };
  });
}

/* ─── STATIC PARTICLE DATA ─── */
const PARTICLES = Array.from({ length: 28 }, (_, i) => ({
  x: (i * 67 + 13) % 100,
  y: (i * 89 + 41) % 100,
  size: 1 + (i % 3) * 0.6,
  dur: 5 + (i % 7) * 1.5,
  delay: (i % 9) * 0.6,
  opacity: 0.1 + (i % 4) * 0.08,
}));

/* ─── GRID CIRCUIT LINES ─── */
const HLINES = [18, 34, 52, 68, 84];
const VLINES = [15, 32, 50, 68, 85];

function CircuitGrid() {
  return (
    <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', opacity: 0.06 }}
      xmlns="http://www.w3.org/2000/svg">
      {HLINES.map(y => (
        <motion.line key={`h${y}`} x1="0%" y1={`${y}%`} x2="100%" y2={`${y}%`}
          stroke="#52b788" strokeWidth="0.5"
          strokeDasharray="4 8"
          animate={{ strokeDashoffset: [0, -60] }}
          transition={{ duration: 8 + y * 0.1, repeat: Infinity, ease: 'linear' }}
        />
      ))}
      {VLINES.map(x => (
        <motion.line key={`v${x}`} x1={`${x}%`} y1="0%" x2={`${x}%`} y2="100%"
          stroke="#52b788" strokeWidth="0.5"
          strokeDasharray="4 8"
          animate={{ strokeDashoffset: [0, -60] }}
          transition={{ duration: 10 + x * 0.08, repeat: Infinity, ease: 'linear' }}
        />
      ))}
      {/* Junction dots */}
      {HLINES.flatMap(y => VLINES.map(x => (
        <motion.circle key={`j${x}${y}`} cx={`${x}%`} cy={`${y}%`} r="1.5" fill="#52b788"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 3 + ((x + y) % 5), repeat: Infinity, delay: (x * y) % 4 }}
        />
      )))}
    </svg>
  );
}

/* ─── DATA STREAM BARS ─── */
function DataStream({ accent }: { accent: string }) {
  const bars = Array.from({ length: 8 }, (_, i) => ({
    delay: i * 0.18,
    height: 20 + (i % 4) * 18,
  }));
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '3px', height: '36px' }}>
      {bars.map((b, i) => (
        <motion.div key={i}
          animate={{ height: [`${b.height}%`, `${(b.height + 40) % 100}%`, `${b.height}%`] }}
          transition={{ duration: 1.4, delay: b.delay, repeat: Infinity, ease: 'easeInOut' }}
          style={{ width: '3px', background: accent, borderRadius: '2px', opacity: 0.7, minHeight: '3px' }}
        />
      ))}
    </div>
  );
}

/* ─── SCAN LINE ─── */
function ScanLine({ active, accent }: { active: boolean; accent: string }) {
  return (
    <motion.div
      animate={{ y: active ? '110%' : '-5%', opacity: active ? [0, 0.6, 0] : 0 }}
      transition={{ duration: 1.3, ease: 'linear', repeat: active ? Infinity : 0, repeatDelay: 0.6 }}
      style={{
        position: 'absolute', left: 0, right: 0, height: '1.5px', zIndex: 8, pointerEvents: 'none',
        background: `linear-gradient(90deg, transparent 0%, ${accent} 30%, ${accent} 70%, transparent 100%)`,
        boxShadow: `0 0 8px ${accent}`,
      }}
    />
  );
}

/* ─── TYPEWRITER TEXT ─── */
function TypewriterText({ text, active, accent }: { text: string; active: boolean; accent: string }) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!active) { setDisplayed(''); setDone(false); return; }
    let i = 0;
    setDone(false);
    const t = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) { clearInterval(t); setDone(true); }
    }, 18);
    return () => clearInterval(t);
  }, [active, text]);

  return (
    <span style={{ color: accent, fontFamily: 'monospace', fontSize: '0.7rem', letterSpacing: '0.05em' }}>
      {displayed}
      {!done && active && (
        <motion.span animate={{ opacity: [1, 0] }} transition={{ duration: 0.5, repeat: Infinity, repeatType: 'reverse' }}
          style={{ borderRight: `1px solid ${accent}`, marginLeft: '1px' }} />
      )}
    </span>
  );
}

/* ─── HOLOGRAPHIC CARD ─── */
function ServiceCard({ s, i }: { s: any; i: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  const [flipped, setFlipped] = useState(false);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const spX = useSpring(mx, { stiffness: 180, damping: 22 });
  const spY = useSpring(my, { stiffness: 180, damping: 22 });
  const rotX = useTransform(spY, [-0.5, 0.5], [16, -16]);
  const rotY = useTransform(spX, [-0.5, 0.5], [-16, 16]);
  const glX = useTransform(spX, [-0.5, 0.5], ['5%', '95%']);
  const glY = useTransform(spY, [-0.5, 0.5], ['5%', '95%']);
  const shX = useTransform(spX, [-0.5, 0.5], [-28, 28]);
  const shY = useTransform(spY, [-0.5, 0.5], [-28, 28]);
  const boxShadow = useTransform([shX, shY], ([sx, sy]: number[]) =>
    hovered
      ? `${sx}px ${sy}px 70px rgba(0,0,0,0.7), 0 0 60px ${s.glow}, inset 0 0 0 1px ${s.accent}22`
      : `0 12px 40px rgba(0,0,0,0.5)`
  );

  const handleMouse = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = cardRef.current?.getBoundingClientRect();
    if (!r) return;
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };
  const handleLeave = () => { mx.set(0); my.set(0); setHovered(false); };

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 80, scale: 0.88, rotateX: -20 },
    visible: {
      opacity: 1, y: 0, scale: 1, rotateX: 0,
      transition: { duration: 0.9, delay: i * 0.14, ease: [0.16, 1, 0.3, 1] as const },
    },
  };

  return (
    <motion.div variants={cardVariants} initial="hidden" whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      style={{ perspective: '1200px' }}
    >
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouse}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={handleLeave}
        onClick={() => setFlipped(f => !f)}
        style={{
          rotateX: hovered ? rotX : 0,
          rotateY: hovered ? rotY : 0,
          transformStyle: 'preserve-3d',
          boxShadow,
          cursor: 'pointer',
          position: 'relative',
        }}
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
      >

        {/* ══ FRONT ══ */}
        <div style={{
          backfaceVisibility: 'hidden',
          borderRadius: '20px',
          overflow: 'hidden',
          background: 'rgba(4,10,8,0.92)',
          border: `1px solid ${hovered ? s.accent + '40' : 'rgba(255,255,255,0.06)'}`,
          backdropFilter: 'blur(24px)',
          minHeight: '320px',
          display: 'flex', flexDirection: 'column',
          position: 'relative',
          transition: 'border-color 0.3s',
        }}>
          {/* Holographic glare */}
          <motion.div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 4,
            background: useTransform([glX, glY], ([gx, gy]: string[]) =>
              `radial-gradient(circle at ${gx} ${gy}, rgba(255,255,255,0.09) 0%, transparent 50%)`),
            opacity: hovered ? 1 : 0, transition: 'opacity 0.3s', borderRadius: '20px',
          }} />

          {/* Scan line */}
          <ScanLine active={hovered} accent={s.accent} />

          {/* Accent top bar — full neon line */}
          <motion.div animate={{ scaleX: hovered ? 1 : 0, opacity: hovered ? 1 : 0 }}
            transition={{ duration: 0.5 }}
            style={{
              position: 'absolute', top: 0, left: 0, right: 0, height: '2px', zIndex: 5,
              background: `linear-gradient(90deg, transparent, ${s.accent}, transparent)`,
              boxShadow: `0 0 16px ${s.accent}`,
              transformOrigin: 'center',
            }}
          />

          {/* Bloom */}
          <motion.div animate={{ opacity: hovered ? 1 : 0 }} transition={{ duration: 0.5 }}
            style={{
              position: 'absolute', bottom: 0, left: 0, right: 0, height: '200px', pointerEvents: 'none',
              background: `radial-gradient(ellipse 100% 100% at 50% 100%, ${s.accentDim}, transparent 70%)`,
            }}
          />

          {/* Content */}
          <div style={{ padding: '28px 28px 24px', display: 'flex', flexDirection: 'column', flexGrow: 1, position: 'relative', zIndex: 2 }}>

            {/* TOP ROW */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '22px' }}>
              {/* Icon box */}
              <motion.div
                animate={{ rotate: hovered ? 8 : 0, scale: hovered ? 1.08 : 1, color: hovered ? s.accent : 'rgba(255,255,255,0.4)' }}
                transition={{ duration: 0.4 }}
                style={{
                  width: '56px', height: '56px', borderRadius: '14px',
                  background: hovered ? `${s.accent}12` : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${hovered ? s.accent + '30' : 'rgba(255,255,255,0.08)'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'background 0.3s, border-color 0.3s',
                  flexShrink: 0,
                }}
              >
                {s.icon}
              </motion.div>

              {/* Number + live indicator */}
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.15)', letterSpacing: '0.2em', fontWeight: 700, marginBottom: '6px' }}>{s.num}</div>
                <AnimatePresence>
                  {hovered && (
                    <motion.div initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.7 }}
                      style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <motion.div animate={{ opacity: [1, 0.2, 1] }} transition={{ duration: 1, repeat: Infinity }}
                        style={{ width: '5px', height: '5px', borderRadius: '50%', background: s.accent, boxShadow: `0 0 6px ${s.accent}` }} />
                      <span style={{ fontSize: '9px', color: s.accent, letterSpacing: '1.5px', fontWeight: 700 }}>LIVE</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* TITLE */}
            <motion.h3
              animate={{ color: hovered ? s.accent : '#f0faf4' }}
              transition={{ duration: 0.3 }}
              style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: '1.15rem',
                fontWeight: 700,
                margin: '0 0 6px',
                letterSpacing: '-0.3px',
                lineHeight: 1.2,
              }}
            >
              {s.title}
            </motion.h3>

            {/* ANIMATED UNDERLINE */}
            <motion.div animate={{ width: hovered ? '36px' : '0px', opacity: hovered ? 1 : 0 }}
              transition={{ duration: 0.4 }}
              style={{ height: '1.5px', background: s.accent, boxShadow: `0 0 8px ${s.accent}`, borderRadius: '2px', marginBottom: '14px' }}
            />

            {/* DESC */}
            <p style={{ fontSize: '0.82rem', color: 'rgba(230,250,240,0.55)', lineHeight: 1.78, margin: '0 0 20px', flexGrow: 1 }}>
              {s.desc}
            </p>

            {/* METRIC CHIP */}
            <motion.div
              animate={{ opacity: hovered ? 1 : 0.4, borderColor: hovered ? `${s.accent}44` : 'rgba(255,255,255,0.06)' }}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                padding: '7px 14px', borderRadius: '100px',
                border: '1px solid', background: hovered ? `${s.accent}08` : 'rgba(255,255,255,0.02)',
                marginBottom: '20px', width: 'fit-content', transition: 'background 0.3s',
              }}
            >
              <DataStream accent={s.accent} />
              <div>
                <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.3)', letterSpacing: '1px', textTransform: 'uppercase' }}>{s.metric.label}</div>
                <div style={{ fontSize: '1rem', fontWeight: 800, color: s.accent, lineHeight: 1.1 }}>{s.metric.value}</div>
              </div>
            </motion.div>

            {/* BOTTOM: tech tag preview + flip hint */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: '5px' }}>
                {s.detail.slice(0, 2).map((t: string) => (
                  <motion.span key={t}
                    animate={{ color: hovered ? s.accent : 'rgba(255,255,255,0.25)', borderColor: hovered ? `${s.accent}33` : 'rgba(255,255,255,0.06)' }}
                    style={{ fontSize: '9px', fontWeight: 700, border: '1px solid', padding: '2px 8px', borderRadius: '5px', letterSpacing: '0.5px' }}
                  >{t}</motion.span>
                ))}
              </div>
              <motion.span animate={{ opacity: hovered ? 0.7 : 0.2, x: hovered ? 0 : 3 }}
                style={{ fontSize: '9px', color: s.accent, letterSpacing: '1.5px', fontWeight: 700 }}>
                FLIP →
              </motion.span>
            </div>
          </div>

          {/* Corner accent brackets */}
          {[['bottom', 'left'], ['top', 'right']].map(([v, h]) => (
            <motion.div key={`${v}${h}`}
              animate={{ opacity: hovered ? 1 : 0, scale: hovered ? 1 : 0.6 }}
              transition={{ duration: 0.35 }}
              style={{
                position: 'absolute', width: '20px', height: '20px',
                ...(v === 'top' ? { top: '12px' } : { bottom: '12px' }),
                ...(h === 'left' ? { left: '12px' } : { right: '12px' }),
                borderTop: v === 'top' ? `1.5px solid ${s.accent}60` : 'none',
                borderBottom: v === 'bottom' ? `1.5px solid ${s.accent}60` : 'none',
                borderLeft: h === 'left' ? `1.5px solid ${s.accent}60` : 'none',
                borderRight: h === 'right' ? `1.5px solid ${s.accent}60` : 'none',
              }}
            />
          ))}
        </div>

        {/* ══ BACK ══ */}
        <div style={{
          position: 'absolute', inset: 0,
          backfaceVisibility: 'hidden', transform: 'rotateY(180deg)',
          borderRadius: '20px', overflow: 'hidden',
          background: `linear-gradient(145deg, rgba(4,10,8,0.96) 0%, ${s.accentDim} 100%)`,
          border: `1px solid ${s.accent}44`,
          backdropFilter: 'blur(24px)',
          boxShadow: `0 0 80px ${s.glow}`,
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
          padding: '32px 28px', gap: '0',
        }}>
          {/* Circuit corner decoration */}
          <svg style={{ position: 'absolute', top: 0, left: 0, width: '100px', height: '100px', opacity: 0.15 }} viewBox="0 0 100 100">
            <path d="M0 0 L40 0 L40 10 L10 10 L10 40 L0 40 Z" fill={s.accent} />
          </svg>
          <svg style={{ position: 'absolute', bottom: 0, right: 0, width: '100px', height: '100px', opacity: 0.15, transform: 'rotate(180deg)' }} viewBox="0 0 100 100">
            <path d="M0 0 L40 0 L40 10 L10 10 L10 40 L0 40 Z" fill={s.accent} />
          </svg>

          <div style={{ fontSize: '9px', color: s.accent, letterSpacing: '3px', textTransform: 'uppercase', fontWeight: 700, marginBottom: '20px', opacity: 0.8 }}>
            {'>'} STACK_LOADED
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '28px' }}>
            {s.detail.map((tech: string, j: number) => (
              <motion.div key={tech}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: j * 0.07, duration: 0.4 }}
                style={{ display: 'flex', alignItems: 'center', gap: '12px' }}
              >
                <div style={{ width: '20px', height: '1px', background: s.accent, opacity: 0.5 }} />
                <span style={{ fontSize: '0.92rem', color: '#e8f5ec', fontWeight: 500 }}>{tech}</span>
                <motion.div
                  animate={{ width: [0, (j + 1) * 14 + 20, (j + 1) * 14 + 20] }}
                  transition={{ duration: 0.6, delay: j * 0.08 + 0.2 }}
                  style={{ height: '2px', background: `linear-gradient(90deg, ${s.accent}, transparent)`, borderRadius: '2px', maxWidth: '80px' }}
                />
              </motion.div>
            ))}
          </div>

          {/* Typewriter readout */}
          <div style={{ padding: '10px 14px', background: 'rgba(0,0,0,0.35)', borderRadius: '8px', border: `1px solid ${s.accent}22` }}>
            <TypewriterText text={`> system.ready("${s.short}")`} active={flipped} accent={s.accent} />
          </div>

          <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.2)', letterSpacing: '1.5px', marginTop: '20px', textAlign: 'right' }}>
            CLICK TO EXIT
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─── CONNECTOR LINES between cards ─── */
function ConnectorLines() {
  return (
    <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0 }}>
      {/* Horizontal connector at mid-height */}
      {[30, 50, 70].map(y => (
        <motion.line key={y} x1="5%" y1={`${y}%`} x2="95%" y2={`${y}%`}
          stroke="rgba(82,183,136,0.08)" strokeWidth="1"
          strokeDasharray="6 12"
          animate={{ strokeDashoffset: [0, -90] }}
          transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
        />
      ))}
    </svg>
  );
}

/* ─── AMBIENT ENERGY BLOBS ─── */
function EnergyBlobs() {
  const blobs = useMemo(() => [
    { x: '-5%', y: '10%', color: 'rgba(0,255,179,0.07)', size: 500, dur: 22 },
    { x: '70%', y: '-5%', color: 'rgba(123,97,255,0.06)', size: 450, dur: 28 },
    { x: '30%', y: '70%', color: 'rgba(255,107,53,0.05)', size: 400, dur: 20 },
    { x: '80%', y: '60%', color: 'rgba(255,221,0,0.05)', size: 380, dur: 25 },
  ], []);

  return (
    <>
      {blobs.map((b, i) => (
        <motion.div key={i}
          animate={{ scale: [1, 1.25, 0.9, 1], x: [0, 40, -20, 0], y: [0, -30, 20, 0] }}
          transition={{ duration: b.dur, repeat: Infinity, ease: 'easeInOut', delay: i * 2 }}
          style={{
            position: 'absolute', left: b.x, top: b.y,
            width: b.size, height: b.size, borderRadius: '50%',
            background: `radial-gradient(circle, ${b.color}, transparent 70%)`,
            filter: 'blur(80px)', pointerEvents: 'none',
          }}
        />
      ))}
    </>
  );
}

/* ─── HEADER NUMBER COUNTER ─── */
function CountUp({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [val, setVal] = useState(0);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    if (!seen) return;
    let start = 0;
    const step = Math.ceil(target / 30);
    const t = setInterval(() => {
      start = Math.min(start + step, target);
      setVal(start);
      if (start >= target) clearInterval(t);
    }, 40);
    return () => clearInterval(t);
  }, [seen, target]);
  return (
    <motion.span onViewportEnter={() => setSeen(true)}>
      {val}{suffix}
    </motion.span>
  );
}

/* ═════════ MAIN ═════════ */
export default function ServicesPreview({ data = {} }: ServicesPreviewCMSData) {
  const SERVICES = useMemo(() => buildServices(data), [data]);

  const sectionHeading  = data.serviceSectionHeading   || 'Four Ways We';
  const sectionItalic   = data.serviceSectionItalic    || 'Build Your';
  const sectionHighlight= data.serviceSectionHighlight || 'Digital Advantage';
  const sectionSubtext  = data.serviceSectionSubtext   || 'Each service is a precision instrument. Together, they form a complete system for building, designing, and scaling — all under one roof. Click any card to see the tech stack.';

  const headerVariants: Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.85, ease: [0.16, 1, 0.3, 1] as const } },
  };

  return (
    <section style={{
      position: 'relative',
      padding: '10rem 6vw 8rem',
      background: 'linear-gradient(180deg, #020906 0%, #040d08 50%, #030a06 100%)',
      overflow: 'hidden',
    }}>

      {/* ── CIRCUIT GRID BACKGROUND ── */}
      <CircuitGrid />

      {/* ── ENERGY BLOBS ── */}
      <EnergyBlobs />

      {/* ── FLOATING PARTICLES ── */}
      {PARTICLES.map((p, i) => (
        <motion.div key={i}
          animate={{ y: [0, -(30 + i * 5), 0], opacity: [0, p.opacity, 0] }}
          transition={{ duration: p.dur, delay: p.delay, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute', left: `${p.x}%`, top: `${p.y}%`,
            width: `${p.size}px`, height: `${p.size}px`,
            borderRadius: '50%', background: '#52b788',
            boxShadow: `0 0 ${p.size * 4}px #52b788`, pointerEvents: 'none',
          }}
        />
      ))}

      {/* ── HEADER ── */}
      <motion.div variants={headerVariants} initial="hidden" whileInView="visible"
        viewport={{ once: true }}
        style={{ textAlign: 'center', maxWidth: '760px', margin: '0 auto 7rem', position: 'relative', zIndex: 2 }}
      >
        {/* Eyebrow pill */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }} transition={{ duration: 0.6 }}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '10px',
            background: 'rgba(82,183,136,0.06)', border: '1px solid rgba(82,183,136,0.18)',
            padding: '8px 22px', borderRadius: '100px', marginBottom: '2rem',
          }}
        >
          <motion.span animate={{ opacity: [1, 0.2, 1] }} transition={{ duration: 1.5, repeat: Infinity }}
            style={{ width: 6, height: 6, borderRadius: '50%', background: '#52b788', boxShadow: '0 0 8px #52b788', display: 'inline-block' }} />
          <span style={{ fontSize: '10px', color: '#52b788', letterSpacing: '3px', fontWeight: 700, textTransform: 'uppercase' }}>
            Core Services
          </span>
        </motion.div>

        {/* Heading */}
        <h2 style={{
          fontFamily: "'Syne', sans-serif",
          fontSize: 'clamp(2.4rem, 5.5vw, 4.2rem)',
          fontWeight: 800,
          letterSpacing: '-2px',
          lineHeight: 1.02,
          color: '#f0faf5',
          marginBottom: '1.4rem'
        }}>
          {sectionHeading}{' '}
          <span style={{
            fontFamily: "'Syne', sans-serif",
            fontStyle: 'italic',
            fontWeight: 300,
            color: '#52b788'
          }}>{sectionItalic}</span>
          <br />
          <span style={{
            fontFamily: "'Syne', sans-serif",
            background: 'linear-gradient(90deg, #52b788 0%, #00e5ff 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            {sectionHighlight}
          </span>
        </h2>

        <p style={{ color: 'rgba(200,240,220,0.45)', fontSize: '0.95rem', lineHeight: 1.85 }}>
          {sectionSubtext}
        </p>

        {/* Stat strip */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '2.5rem', marginTop: '2.5rem', flexWrap: 'wrap' }}>
          {[{ val: 50, suffix: '+', label: 'Projects' }, { val: 100, suffix: '%', label: 'Satisfaction' }, { val: 3, suffix: '+', label: 'Years' }].map(s => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#52b788', lineHeight: 1 }}>
                <CountUp target={s.val} suffix={s.suffix} />
              </div>
              <div style={{ fontSize: '10px', color: 'rgba(200,240,220,0.3)', letterSpacing: '1.5px', textTransform: 'uppercase', marginTop: '4px' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* ── CARDS ── */}
      <div style={{ position: 'relative', zIndex: 2 }}>
        <ConnectorLines />
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))',
          gap: '20px',
          maxWidth: '1200px',
          margin: '0 auto',
        }}>
          {SERVICES.map((s, i) => <ServiceCard key={i} s={s} i={i} />)}
        </div>
      </div>

      {/* ── BOTTOM CTA ── */}
      <motion.div
        initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.4 }}
        style={{ textAlign: 'center', marginTop: '6rem', position: 'relative', zIndex: 2 }}
      >
        {/* Decorative divider */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginBottom: '2rem' }}>
          <div style={{ height: '1px', width: '60px', background: 'linear-gradient(90deg, transparent, rgba(82,183,136,0.3))' }} />
          <span style={{ fontSize: '9px', color: 'rgba(82,183,136,0.4)', letterSpacing: '3px', textTransform: 'uppercase' }}>ready to build</span>
          <div style={{ height: '1px', width: '60px', background: 'linear-gradient(90deg, rgba(82,183,136,0.3), transparent)' }} />
        </div>

        <Link href="/services" passHref legacyBehavior>
          <motion.a
            whileHover={{ scale: 1.04, boxShadow: '0 0 50px rgba(82,183,136,0.2), 0 0 100px rgba(82,183,136,0.08)' }}
            whileTap={{ scale: 0.96 }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              textDecoration: 'none',
              padding: '1rem 3rem', borderRadius: '100px',
              background: 'linear-gradient(135deg, rgba(82,183,136,0.12), rgba(0,229,255,0.12))',
              border: '1px solid rgba(82,183,136,0.25)',
              color: '#e8f5ec', fontSize: '0.9rem', fontWeight: 700,
              letterSpacing: '0.08em', cursor: 'pointer',
              position: 'relative', overflow: 'hidden',
              textTransform: 'uppercase',
            }}
          >
            <motion.div
              animate={{ x: ['-100%', '200%'] }}
              transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 2.5 }}
              style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(90deg, transparent, rgba(82,183,136,0.15), transparent)',
                pointerEvents: 'none',
              }}
            />
            Explore All Services →
          </motion.a>
        </Link>
      </motion.div>
    </section>
  );
}