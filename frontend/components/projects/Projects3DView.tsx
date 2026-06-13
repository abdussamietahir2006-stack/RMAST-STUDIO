'use client';

import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import { useRef, useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

/* ─── DATA MAPPING ─── */
const getOrbitalProject = (p: any, i: number, total: number) => {
  const category = p.category || 'Web';
  
  // Pick accent color
  const accent = category === 'Web' ? '#52d9d4' : category === '3D' ? '#95d5b2' : category === 'AI' ? '#00e5ff' : '#74c69d';
  
  const radius = 215 + i * 50;
  const speed = 0.0003 - (i * 0.00003);
  const startAngle = total > 0 ? (i * Math.PI * 2) / total : 0;
  const tilt = (i % 2 === 0 ? 1 : -1) * (8 + (i * 6) % 15);
  
  return {
    id: p._id || i,
    title: p.title || '',
    category: category,
    tag: category.toUpperCase(),
    tech: p.stack || [],
    desc: p.desc || '',
    img: p.image || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&h=400&fit=crop&q=80',
    accent,
    accentDim: `${accent}26`,
    year: p.year || '2024',
    orbit: { radius, speed, startAngle, tilt }
  };
};

const FILTERS = ['All', 'Web', '3D', 'AI'];

/* ── STATIC STARFIELD DATA (no Math.random at render) ── */
const STARS = Array.from({ length: 120 }, (_, i) => ({
  x: (i * 73 + 17) % 100,
  y: (i * 97 + 31) % 100,
  size: 0.8 + (i % 4) * 0.35,
  opacity: 0.15 + (i % 6) * 0.08,
  dur: 2 + (i % 6),
  delay: (i % 8) * 0.4,
}));

function Starfield() {
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      {STARS.map((s, i) => (
        <motion.div key={i}
          animate={{ opacity: [s.opacity, s.opacity * 0.2, s.opacity] }}
          transition={{ duration: s.dur, delay: s.delay, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute', left: `${s.x}%`, top: `${s.y}%`,
            width: `${s.size}px`, height: `${s.size}px`,
            borderRadius: '50%', background: '#fff',
          }}
        />
      ))}
    </div>
  );
}

function Nebula() {
  const clouds = [
    { x: '12%', y: '18%', w: 500, h: 300, color: 'rgba(82,183,136,0.04)', dur: 28, delay: 0 },
    { x: '62%', y: '8%',  w: 400, h: 250, color: 'rgba(0,229,255,0.03)',    dur: 35, delay: 5 },
    { x: '4%',  y: '58%', w: 350, h: 300, color: 'rgba(149,213,178,0.04)', dur: 22, delay: 10 },
    { x: '68%', y: '62%', w: 450, h: 280, color: 'rgba(82,183,178,0.03)',  dur: 40, delay: 3 },
  ];
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
      {clouds.map((n, i) => (
        <motion.div key={i}
          animate={{ scale: [1, 1.3, 0.9, 1], x: [0, 30, -20, 0], y: [0, -20, 15, 0] }}
          transition={{ duration: n.dur, delay: n.delay, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute', left: n.x, top: n.y,
            width: n.w, height: n.h, borderRadius: '50%',
            background: `radial-gradient(ellipse, ${n.color}, transparent 70%)`,
            filter: 'blur(60px)',
          }}
        />
      ))}
    </div>
  );
}

/* ── ORBITAL TRACK SVG ── */
function OrbitalTrack({ radius, tilt }: { radius: number; tilt: number }) {
  const ry = radius * Math.abs(Math.cos((tilt * Math.PI) / 180));
  return (
    <div style={{
      position: 'absolute', top: '50%', left: '50%',
      width: radius * 2, height: radius * 2,
      marginTop: -radius, marginLeft: -radius,
      pointerEvents: 'none',
    }}>
      <svg width={radius * 2} height={radius * 2} style={{ position: 'absolute', inset: 0, opacity: 0.07 }}>
        <ellipse cx={radius} cy={radius} rx={radius - 1} ry={Math.max(ry - 1, 1)}
          fill="none" stroke="#52b788" strokeWidth="0.5"
          strokeDasharray={`${radius * 0.12} ${radius * 0.06}`}
        />
      </svg>
    </div>
  );
}

/* ── CENTER CORE ── */
function CenterCore() {
  return (
    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', pointerEvents: 'none' }}>
      {[80, 130, 185].map((r, i) => (
        <motion.div key={i}
          animate={{ scale: [1, 1.18, 1], opacity: [0.1, 0.03, 0.1] }}
          transition={{ duration: 4 + i * 1.5, repeat: Infinity, delay: i * 0.9, ease: 'easeInOut' }}
          style={{
            position: 'absolute', width: r * 2, height: r * 2, borderRadius: '50%',
            border: '1px solid rgba(82,183,136,0.35)',
            top: '50%', left: '50%', marginTop: -r, marginLeft: -r,
          }}
        />
      ))}
      <motion.div
        animate={{ scale: [1, 1.4, 1], opacity: [1, 0.4, 1] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute', width: 14, height: 14, borderRadius: '50%',
          background: '#52b788',
          boxShadow: '0 0 30px rgba(82,183,136,0.9), 0 0 70px rgba(82,183,136,0.4)',
          top: '50%', left: '50%', marginTop: -7, marginLeft: -7,
        }}
      />
      <motion.div animate={{ rotate: 360 }} transition={{ duration: 16, repeat: Infinity, ease: 'linear' }}
        style={{ position: 'absolute', width: 56, height: 56, top: '50%', left: '50%', marginTop: -28, marginLeft: -28 }}>
        <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: '1px', background: 'linear-gradient(90deg, transparent, rgba(82,183,136,0.5), transparent)' }} />
        <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: '1px', background: 'linear-gradient(180deg, transparent, rgba(82,183,136,0.5), transparent)' }} />
      </motion.div>
    </div>
  );
}

/* ── DETAIL PANEL ── */
function DetailPanel({ project, onClose }: { project: any; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}
    >
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        style={{ position: 'absolute', inset: 0, background: 'rgba(2,6,5,0.88)', backdropFilter: 'blur(18px)', cursor: 'pointer' }}
      />
      <motion.div
        initial={{ scale: 0.82, y: 30 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 15 }}
        transition={{ duration: 0.48, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: 'relative', zIndex: 1, width: '100%', maxWidth: '680px',
          borderRadius: '24px', overflow: 'hidden',
          background: 'rgba(6,12,9,0.96)',
          border: `1px solid ${project.accent}44`,
          boxShadow: `0 0 80px ${project.accentDim}, 0 40px 100px rgba(0,0,0,0.9)`,
        }}
      >
        {/* Scan line */}
        <motion.div animate={{ y: ['0%', '600%'] }} transition={{ duration: 3.5, repeat: Infinity, repeatDelay: 1.5, ease: 'linear' }}
          style={{ position: 'absolute', left: 0, right: 0, height: '2px', background: `linear-gradient(90deg, transparent, ${project.accent}, transparent)`, zIndex: 5, pointerEvents: 'none' }}
        />

        <div style={{ position: 'relative', aspectRatio: '16/7', overflow: 'hidden' }}>
          <img src={project.img} alt={project.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(180deg, transparent 20%, rgba(6,12,9,1) 100%)` }} />
          <div style={{ position: 'absolute', top: '16px', left: '16px', background: `${project.accent}22`, border: `1px solid ${project.accent}55`, borderRadius: '8px', padding: '4px 14px', fontSize: '10px', fontWeight: 800, color: project.accent, letterSpacing: '2px' }}>{project.tag}</div>
          <button onClick={onClose} style={{ position: 'absolute', top: '16px', right: '16px', background: 'rgba(0,0,0,0.55)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '50%', width: '36px', height: '36px', cursor: 'pointer', color: 'rgba(255,255,255,0.6)', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)' }}>✕</button>
        </div>

        <div style={{ padding: '28px 32px 32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 900, color: '#e8f5ec', margin: 0, letterSpacing: '-1px' }}>{project.title}</h2>
            <span style={{ fontSize: '11px', color: 'rgba(200,234,214,0.3)', fontWeight: 600, letterSpacing: '1px', marginTop: '8px' }}>{project.year}</span>
          </div>
          <motion.div initial={{ width: 0 }} animate={{ width: '100%' }} transition={{ duration: 0.7, delay: 0.15 }}
            style={{ height: '1.5px', background: `linear-gradient(90deg, ${project.accent}, transparent)`, borderRadius: '2px', marginBottom: '16px' }} />
          <p style={{ color: 'rgba(200,234,214,0.6)', lineHeight: 1.8, fontSize: '0.92rem', marginBottom: '22px' }}>{project.desc}</p>
          <p style={{ fontSize: '10px', color: project.accent, letterSpacing: '2px', fontWeight: 700, textTransform: 'uppercase', marginBottom: '10px' }}>Stack</p>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '26px' }}>
            {project.tech.map((t: string) => (
              <span key={t} style={{ padding: '5px 14px', borderRadius: '8px', fontSize: '11px', fontWeight: 700, background: `${project.accent}15`, border: `1px solid ${project.accent}33`, color: project.accent, letterSpacing: '0.3px' }}>{t}</span>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <motion.a href="#" whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} style={{ padding: '10px 24px', borderRadius: '100px', background: project.accent, color: '#060f0c', fontWeight: 800, fontSize: '12px', textDecoration: 'none', letterSpacing: '0.5px', boxShadow: `0 0 24px ${project.accentDim}` }}>↗ View Live</motion.a>
            <motion.a href="#" whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} style={{ padding: '10px 24px', borderRadius: '100px', border: `1px solid rgba(200,234,214,0.15)`, color: 'rgba(200,234,214,0.65)', fontWeight: 600, fontSize: '12px', textDecoration: 'none', background: 'transparent' }}>{'< >'} Code</motion.a>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ── FLOATING CARD ── */
function FloatingCard({ project, onClick }: {
  project: any;
  onClick: () => void;
}) {
  const [pos, setPos] = useState({ x: Math.cos(project.orbit.startAngle) * project.orbit.radius, y: 0, z: 0 });
  const [hovered, setHovered] = useState(false);
  const angleRef = useRef(project.orbit.startAngle);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    let last = performance.now();
    const tick = (now: number) => {
      const dt = now - last; last = now;
      angleRef.current += project.orbit.speed * dt;
      const a = angleRef.current;
      const r = project.orbit.radius;
      const tiltRad = (project.orbit.tilt * Math.PI) / 180;
      setPos({
        x: Math.cos(a) * r,
        y: Math.sin(a) * r * Math.cos(tiltRad),
        z: Math.sin(a) * r * Math.sin(tiltRad),
      });
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [project.orbit]);

  const cardRef = useRef<HTMLDivElement>(null);
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const sp = { stiffness: 220, damping: 28 };
  const tiltX = useSpring(useTransform(rawY, [-0.5, 0.5], [16, -16]), sp);
  const tiltY = useSpring(useTransform(rawX, [-0.5, 0.5], [-16, 16]), sp);
  const glareX = useSpring(useTransform(rawX, [-0.5, 0.5], [10, 90]), sp);
  const glareY = useSpring(useTransform(rawY, [-0.5, 0.5], [10, 90]), sp);

  const handleMouse = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    rawX.set((e.clientX - rect.left) / rect.width - 0.5);
    rawY.set((e.clientY - rect.top) / rect.height - 0.5);
  };
  const handleLeave = () => { rawX.set(0); rawY.set(0); setHovered(false); };

  const normalizedZ = (pos.z + project.orbit.radius) / (project.orbit.radius * 2);
  const depthScale = 0.7 + normalizedZ * 0.5;
  const depthOpacity = 0.45 + normalizedZ * 0.55;
  const depthBlur = Math.max(0, (1 - normalizedZ) * 2.5 - 0.5);

  return (
    <div style={{
      position: 'absolute',
      left: '50%', top: '50%',
      transform: `translate(${pos.x - 140}px, ${pos.y - 95}px)`,
      zIndex: Math.round(normalizedZ * 100) + 10,
      width: '280px',
      willChange: 'transform',
    }}>
      <motion.div
        animate={{ scale: hovered ? depthScale * 1.09 : depthScale }}
        transition={{ duration: 0.3 }}
        style={{ opacity: depthOpacity, filter: depthBlur > 0.3 ? `blur(${depthBlur * 0.5}px)` : 'none' }}
      >
        <motion.div
          ref={cardRef}
          onMouseMove={handleMouse}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={handleLeave}
          onClick={onClick}
          style={{
            rotateX: hovered ? tiltX : 0,
            rotateY: hovered ? tiltY : 0,
            transformStyle: 'preserve-3d',
            cursor: 'pointer',
            borderRadius: '18px',
            overflow: 'hidden',
            background: 'rgba(6,12,9,0.88)',
            border: `1px solid ${hovered ? project.accent + '55' : project.accent + '18'}`,
            backdropFilter: 'blur(20px)',
            boxShadow: hovered
              ? `0 28px 70px rgba(0,0,0,0.75), 0 0 55px ${project.accentDim}, inset 0 0 0 1px ${project.accent}22`
              : `0 10px 36px rgba(0,0,0,0.6), 0 0 18px ${project.accentDim}`,
            transition: 'border-color 0.3s, box-shadow 0.3s',
          }}
        >
          {/* Holographic glare */}
          <motion.div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 5, borderRadius: '18px',
            background: useTransform([glareX, glareY], ([gx, gy]: number[]) =>
              `radial-gradient(circle at ${gx}% ${gy}%, rgba(255,255,255,0.13) 0%, transparent 55%)`),
            opacity: hovered ? 1 : 0, transition: 'opacity 0.3s',
          }} />

          {/* Accent bar */}
          <motion.div animate={{ scaleX: hovered ? 1 : 0.1, opacity: hovered ? 1 : 0.25 }}
            style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: `linear-gradient(90deg, ${project.accent}, transparent)`, transformOrigin: 'left', zIndex: 4 }} />

          {/* Scan line */}
          <motion.div
            animate={{ y: hovered ? '100%' : '-5%', opacity: hovered ? [0, 0.55, 0] : 0 }}
            transition={{ duration: 1.1, ease: 'linear', repeat: hovered ? Infinity : 0, repeatDelay: 0.7 }}
            style={{ position: 'absolute', left: 0, right: 0, height: '2px', background: `linear-gradient(90deg, transparent, ${project.accent}, transparent)`, zIndex: 6, pointerEvents: 'none' }}
          />

          {/* Image */}
          <div style={{ position: 'relative', aspectRatio: '16/9', overflow: 'hidden' }}>
            <motion.img src={project.img} alt={project.title}
              animate={{ scale: hovered ? 1.08 : 1 }} transition={{ duration: 0.5 }}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
            <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(180deg, transparent 15%, rgba(6,12,9,0.88) 100%)` }} />
            <div style={{ position: 'absolute', top: '10px', left: '10px', background: `${project.accent}22`, border: `1px solid ${project.accent}55`, borderRadius: '6px', padding: '3px 10px', fontSize: '9px', fontWeight: 800, color: project.accent, letterSpacing: '1.5px' }}>{project.tag}</div>
            <div style={{ position: 'absolute', top: '10px', right: '10px', fontSize: '10px', color: 'rgba(200,234,214,0.3)', fontWeight: 600 }}>{project.year}</div>
          </div>

          {/* Body */}
          <div style={{ padding: '14px 16px 18px', position: 'relative' }}>
            <motion.div animate={{ opacity: hovered ? 1 : 0 }}
              style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse at 50% 100%, ${project.accentDim}, transparent 70%)`, pointerEvents: 'none' }} />

            <motion.h3 animate={{ color: hovered ? project.accent : '#d8f3e8' }} transition={{ duration: 0.25 }}
              style={{ fontSize: '0.95rem', fontWeight: 800, margin: '0 0 6px', letterSpacing: '-0.2px', position: 'relative' }}>
              {project.title}
            </motion.h3>

            <p style={{ color: 'rgba(216,243,232,0.45)', fontSize: '0.71rem', lineHeight: 1.65, margin: '0 0 12px', position: 'relative', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
              {project.desc}
            </p>

            <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', position: 'relative' }}>
              {project.tech.map((t: string) => (
                <motion.span key={t}
                  animate={{ borderColor: hovered ? `${project.accent}44` : `${project.accent}16`, color: hovered ? project.accent : 'rgba(200,234,214,0.28)' }}
                  style={{ padding: '2px 8px', borderRadius: '5px', fontSize: '9px', fontWeight: 700, border: '1px solid', letterSpacing: '0.3px' }}
                >{t}</motion.span>
              ))}
            </div>

            <motion.div animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 5 }} transition={{ duration: 0.22 }}
              style={{ marginTop: '10px', fontSize: '9px', color: project.accent, letterSpacing: '1.5px', fontWeight: 700 }}>
              CLICK TO EXPAND →
            </motion.div>
          </div>
        </motion.div>

        {/* Shadow glow beneath */}
        <motion.div animate={{ opacity: hovered ? 0.65 : 0.18, scale: hovered ? 1.25 : 1 }}
          style={{ position: 'absolute', bottom: '-18px', left: '20px', right: '20px', height: '28px', background: `radial-gradient(ellipse, ${project.accent}88, transparent 70%)`, filter: 'blur(14px)', borderRadius: '50%' }}
        />
      </motion.div>
    </div>
  );
}

/* ── FILTER BAR ── */
function FilterBar({ active, setActive }: { active: string; setActive: (f: string) => void }) {
  return (
    <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
      {FILTERS.map(f => (
        <motion.button key={f} onClick={() => setActive(f)}
          whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.94 }}
          animate={{
            background: active === f ? '#52b788' : 'rgba(8,16,12,0.8)',
            color: active === f ? '#060f0c' : 'rgba(200,234,214,0.5)',
            borderColor: active === f ? '#52b788' : 'rgba(82,183,136,0.15)',
            boxShadow: active === f ? '0 0 22px rgba(82,183,136,0.45)' : 'none',
          }}
          style={{ padding: '7px 18px', borderRadius: '100px', border: '1px solid', fontSize: '11px', fontWeight: 700, cursor: 'pointer', letterSpacing: '0.5px', backdropFilter: 'blur(10px)' }}
        >{f}</motion.button>
      ))}
    </div>
  );
}

/* ── MAIN ── */
export default function WorkGrid() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [selected, setSelected] = useState<any | null>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/projects')
      .then(r => r.json())
      .then(res => { if (res && res.success && Array.isArray(res.data)) setProjects(res.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const orbitalProjects = projects.map((p, i) => getOrbitalProject(p, i, projects.length));

  const filtered = activeFilter === 'All'
    ? orbitalProjects
    : orbitalProjects.filter(p => p.category === activeFilter);

  if (loading) {
    return (
      <section style={{ padding: '0', background: '#020807', position: 'relative', overflow: 'hidden', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Starfield />
        <Nebula />
        <div style={{ textAlign: 'center', zIndex: 10 }}>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
            style={{
              width: 50,
              height: 50,
              borderRadius: '50%',
              border: '2px solid rgba(82,183,136,0.15)',
              borderTopColor: '#52b788',
              margin: '0 auto 1rem',
            }}
          />
          <p style={{ color: '#52b788', fontSize: '0.85rem', letterSpacing: '2px', textTransform: 'uppercase' }}>Loading Orbit...</p>
        </div>
      </section>
    );
  }

  if (orbitalProjects.length === 0) {
    return (
      <section style={{ padding: '0', background: '#020807', position: 'relative', overflow: 'hidden', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Starfield />
        <Nebula />
        
        {/* ── HEADER ── */}
        <div style={{ position: 'relative', zIndex: 20, textAlign: 'center', maxWidth: '600px', padding: '0 2rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', background: 'rgba(82,183,136,0.07)', border: '1px solid rgba(82,183,136,0.2)', padding: '7px 20px', borderRadius: '100px', marginBottom: '20px' }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#52b788', display: 'inline-block' }} />
            <span style={{ color: '#52b788', fontSize: '11px', fontWeight: 700, letterSpacing: '2.5px', textTransform: 'uppercase' }}>Orbital Portfolio</span>
          </div>

          <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3.8rem)', fontWeight: 900, letterSpacing: '-2px', color: '#e8f5ec', marginBottom: '12px', lineHeight: 1 }}>
            Empty Space
          </h2>

          <p style={{ color: 'rgba(200,234,214,0.35)', fontSize: '0.9rem', marginBottom: '2rem', lineHeight: 1.6 }}>
            There are no projects floating in orbit. Use the admin dashboard to launch your first project and populate the system!
          </p>
        </div>
      </section>
    );
  }

  return (
    <section style={{ padding: '0', background: '#020807', position: 'relative', overflow: 'hidden', minHeight: '100vh' }}>
      <Starfield />
      <Nebula />

      {/* Orbital track rings */}
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
        {filtered.map(p => (
          <OrbitalTrack key={p.id} radius={p.orbit.radius} tilt={p.orbit.tilt} />
        ))}
        <CenterCore />
      </div>

      {/* ── HEADER ── */}
      <div style={{ position: 'relative', zIndex: 20, textAlign: 'center', paddingTop: '5rem', paddingBottom: '1rem' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', background: 'rgba(82,183,136,0.07)', border: '1px solid rgba(82,183,136,0.2)', padding: '7px 20px', borderRadius: '100px', marginBottom: '20px' }}>
          <motion.span animate={{ scale: [1, 1.5, 1] }} transition={{ duration: 2, repeat: Infinity }}
            style={{ width: 7, height: 7, borderRadius: '50%', background: '#52b788', boxShadow: '0 0 10px #52b788', display: 'inline-block' }} />
          <span style={{ color: '#52b788', fontSize: '11px', fontWeight: 700, letterSpacing: '2.5px', textTransform: 'uppercase' }}>Orbital Portfolio</span>
        </motion.div>

        <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3.8rem)', fontWeight: 900, letterSpacing: '-2px', color: '#e8f5ec', marginBottom: '12px', lineHeight: 1 }}>
          Projects in{' '}
          <span style={{ background: 'linear-gradient(90deg, #52b788, #00e5ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Orbit</span>
        </h2>

        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
          style={{ color: 'rgba(200,234,214,0.35)', fontSize: '0.85rem', marginBottom: '2rem' }}>
          Projects float in real orbital paths. Click any card to explore.
        </motion.p>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <FilterBar active={activeFilter} setActive={setActiveFilter} />
        </motion.div>
      </div>

      {/* ── ORBITAL SCENE ── */}
      <div style={{ position: 'relative', height: '72vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <AnimatePresence>
          {filtered.map(p => (
            <FloatingCard key={p.id} project={p} onClick={() => setSelected(p)} />
          ))}
        </AnimatePresence>
      </div>

      {/* ── BOTTOM CTA ── */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
        style={{ position: 'relative', zIndex: 20, textAlign: 'center', paddingBottom: '4rem' }}>
        <p style={{ color: 'rgba(200,234,214,0.2)', fontSize: '0.8rem', marginBottom: '1rem', letterSpacing: '0.05em' }}>Have a project in mind? Let&apos;s build it.</p>
        <Link href="/contact" style={{ textDecoration: 'none' }}>
          <motion.button whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(82,183,136,0.4)' }} whileTap={{ scale: 0.96 }}
            style={{ padding: '0.85rem 2.2rem', borderRadius: '100px', background: 'linear-gradient(135deg, #52b788, #2d6a4f)', border: 'none', color: '#060f0c', fontWeight: 800, fontSize: '0.9rem', letterSpacing: '0.04em', cursor: 'pointer', position: 'relative', overflow: 'hidden' }}>
            <motion.span animate={{ x: ['-100%', '200%'] }} transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 3 }}
              style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)', pointerEvents: 'none' }} />
            Start Your Project →
          </motion.button>
        </Link>
      </motion.div>

      {/* ── DETAIL PANEL ── */}
      <AnimatePresence>
        {selected && <DetailPanel project={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </section>
  );
}