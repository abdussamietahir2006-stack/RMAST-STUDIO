'use client';

import { useRef, useState, useCallback } from 'react';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';

interface Service {
  num: string;
  title: string;
  subtitle: string;
  icon: string;
  accent: string;
  accentDim: string;
  desc: string;
  details: string[];
  tag: string | null;
}

const defaultServices: Service[] = [
  {
    num: '01',
    title: 'Web Development',
    subtitle: 'Full-Stack',
    icon: '⚡',
    accent: '#52b788',
    accentDim: 'rgba(82,183,136,0.12)',
    desc: 'High-performance, scalable web apps built with precision and clean architecture. Next.js, MongoDB, and robust APIs.',
    details: [
      'Next.js + TypeScript frontend',
      'MongoDB Atlas + API routes',
      'Admin CMS & dashboards',
      'REST & GraphQL APIs',
      'VPS deployment (Nginx + PM2)',
    ],
    tag: 'Most Popular',
  },
  {
    num: '02',
    title: 'UI/UX Design',
    subtitle: 'Interface Design',
    icon: '🎨',
    accent: '#00e5ff',
    accentDim: 'rgba(0,229,255,0.12)',
    desc: 'Elegant, user-focused interfaces designed for clarity, beauty, and conversion. Pixel-perfect execution every time.',
    details: [
      'Figma wireframes & prototypes',
      'Design systems & brand tokens',
      'Micro-interaction design',
      'Responsive & mobile-first',
      'User journey mapping',
    ],
    tag: null,
  },
  {
    num: '03',
    title: '3D & Motion',
    subtitle: 'Immersive Visuals',
    icon: '🌐',
    accent: '#ffca28',
    accentDim: 'rgba(255,202,40,0.12)',
    desc: 'Cinematic 3D visuals, product animations, and immersive digital storytelling that leaves visitors in awe.',
    details: [
      'Three.js & WebGL shaders',
      'Blender 3D modelling',
      'GSAP & Framer Motion',
      'Spline interactive scenes',
      'Performance-optimised',
    ],
    tag: null,
  },
  {
    num: '04',
    title: 'AI Automation',
    subtitle: 'Intelligent Systems',
    icon: '🤖',
    accent: '#76ff03',
    accentDim: 'rgba(118,255,3,0.1)',
    desc: 'Smart workflows that eliminate repetition, reduce costs, and scale your operations with intelligence baked in.',
    details: [
      'Custom AI chatbots & agents',
      'n8n & Zapier automation',
      'OpenAI & LangChain pipelines',
      'Data scraping & processing',
      'CRM & tool integrations',
    ],
    tag: 'New',
  },
];

function ServiceCard({ service, index }: { service: Service; index: number }) {
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
    ([sx, sy]: number[]) => `${sx}px ${sy}px 60px rgba(0,0,0,0.7), 0 0 0 1px ${service.accent}22`
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
          border: `1px solid ${service.accent}22`,
          backdropFilter: 'blur(12px)',
          overflow: 'hidden',
          cursor: 'crosshair',
          willChange: 'transform',
        }}
      >
        {/* Top accent bar */}
        <motion.div
          animate={{ scaleX: hovered ? 1 : 0.3, opacity: hovered ? 1 : 0.4 }}
          transition={{ duration: 0.4 }}
          style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: '3px',
            background: `linear-gradient(90deg, ${service.accent}, transparent)`,
            transformOrigin: 'left',
          }}
        />

        {/* Glare */}
        <motion.div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 3,
          background: useTransform([glareX, glareY], ([gx, gy]: number[]) =>
            `radial-gradient(circle at ${gx}% ${gy}%, rgba(255,255,255,0.09) 0%, transparent 55%)`),
          opacity: hovered ? 1 : 0,
          transition: 'opacity 0.3s',
        }} />

        {/* Bloom */}
        <motion.div
          animate={{ opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.4 }}
          style={{
            position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 1,
            background: `radial-gradient(ellipse 80% 60% at 50% 120%, ${service.accentDim}, transparent 65%)`,
          }}
        />

        {/* Scan line */}
        <motion.div
          animate={{ y: hovered ? '100%' : '-5%', opacity: hovered ? [0, 0.5, 0] : 0 }}
          transition={{ duration: 1.4, ease: 'linear', repeat: hovered ? Infinity : 0, repeatDelay: 1.2 }}
          style={{
            position: 'absolute', left: 0, right: 0, height: '2px', zIndex: 4, pointerEvents: 'none',
            background: `linear-gradient(90deg, transparent, ${service.accent}, transparent)`,
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
                  filter: hovered ? `drop-shadow(0 0 10px ${service.accent})` : 'none',
                }}
                transition={{ type: 'spring', stiffness: 300, damping: 14 }}
                style={{ fontSize: '32px' }}
              >
                {service.icon}
              </motion.div>
              <div>
                <motion.p
                  animate={{ color: hovered ? service.accent : 'rgba(232,245,236,0.25)' }}
                  style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', margin: 0 }}
                >
                  {service.subtitle}
                </motion.p>
                <motion.span
                  animate={{ color: hovered ? service.accent : 'rgba(232,245,236,0.12)' }}
                  style={{ fontFamily: "'Syne', sans-serif", fontSize: '13px', fontWeight: 800, letterSpacing: '2px' }}
                >
                  {service.num}
                </motion.span>
              </div>
            </div>

            {/* Tag / hover badge */}
            <AnimatePresence mode="wait">
              {hovered ? (
                <motion.div
                  key="hover-badge"
                  initial={{ opacity: 0, scale: 0.6, x: 10 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.6, x: 10 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 18 }}
                  style={{
                    background: service.accent, color: '#0b0f0e',
                    borderRadius: '10px', padding: '6px 14px',
                    fontSize: '11px', fontWeight: 700, whiteSpace: 'nowrap',
                  }}
                >
                  Explore →
                </motion.div>
              ) : service.tag ? (
                <motion.div
                  key="tag"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  style={{
                    background: `${service.accent}18`, border: `1px solid ${service.accent}44`,
                    color: service.accent, borderRadius: '10px', padding: '5px 12px',
                    fontSize: '10px', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase',
                  }}
                >
                  {service.tag}
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>

          {/* Title */}
          <h3 style={{
            fontFamily: "'Syne', sans-serif",
            color: '#e8f5ec', fontSize: '1.6rem', fontWeight: 800,
            margin: '0 0 14px', letterSpacing: '-0.5px', lineHeight: 1.1,
          }}>
            {service.title}
          </h3>

          {/* Animated underline */}
          <motion.div
            animate={{ width: hovered ? '48px' : '0px' }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            style={{ height: '2px', background: `linear-gradient(90deg, ${service.accent}, transparent)`, borderRadius: '2px', marginBottom: '16px' }}
          />

          {/* Description */}
          <p style={{ color: 'rgba(232,245,236,0.65)', lineHeight: 1.75, fontSize: '0.92rem', margin: '0 0 24px' }}>
            {service.desc}
          </p>

          {/* Checklist */}
          <motion.div
            animate={{ opacity: hovered ? 1 : 0, height: hovered ? 'auto' : 0 }}
            transition={{ duration: 0.38 }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
              {service.details.map((d, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: hovered ? 1 : 0, x: hovered ? 0 : -12 }}
                  transition={{ delay: i * 0.05 + 0.1, duration: 0.3 }}
                  style={{ display: 'flex', alignItems: 'center', gap: '10px' }}
                >
                  <span style={{ color: service.accent, fontSize: '13px', fontWeight: 700, flexShrink: 0 }}>✓</span>
                  <span style={{ color: 'rgba(232,245,236,0.75)', fontSize: '13px' }}>{d}</span>
                </motion.div>
              ))}
            </div>

            {/* CTA row */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              padding: '12px 16px', borderRadius: '12px',
              background: service.accentDim, border: `1px solid ${service.accent}33`,
            }}>
              <span style={{ fontSize: '14px' }}>🚀</span>
              <span style={{ fontSize: '12px', color: service.accent, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>
                Ready to start a project
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
                borderRadius: '50%', background: service.accent,
                boxShadow: `0 0 12px 4px ${service.accent}88`,
                zIndex: 10, pointerEvents: 'none',
              }}
            />
          ))}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

export interface ServicesGridCMSData {
  data?: Record<string, string>;
}

export default function ServicesGrid({ data = {} }: ServicesGridCMSData) {
  const offerEyebrow = data.offerEyebrow || 'What I Offer';
  const offerHeading = data.offerHeading || 'Services That Deliver';
  const offerSubtext = data.offerSubtext || 'Hover to explore — every service comes with the full Process treatment.';

  // Map CMS data
  const cmsServices: Service[] = [];
  for (let n = 1; n <= 6; n++) {
    const title = data[`service${n}Title`];
    if (title) {
      const details = [
        data[`service${n}Bullet1`],
        data[`service${n}Bullet2`],
        data[`service${n}Bullet3`],
        data[`service${n}Bullet4`],
      ].filter(Boolean);
      
      const defaultIcon = n === 1 ? '⚡' : n === 2 ? '🎨' : n === 3 ? '🌐' : n === 4 ? '🤖' : n === 5 ? '🛒' : '📈';
      const defaultSubtitle = n === 1 ? 'Full-Stack' : n === 2 ? 'Interface Design' : n === 3 ? 'Immersive Visuals' : n === 4 ? 'Intelligent Systems' : n === 5 ? 'E-Commerce' : 'SEO & Performance';
      const defaultAccent = n === 1 ? '#52b788' : n === 2 ? '#00e5ff' : n === 3 ? '#ffca28' : n === 4 ? '#76ff03' : n === 5 ? '#ff6b6b' : '#c77dff';
      const defaultAccentDim = n === 1 ? 'rgba(82,183,136,0.12)' : n === 2 ? 'rgba(0,229,255,0.12)' : n === 3 ? 'rgba(255,202,40,0.12)' : n === 4 ? 'rgba(118,255,3,0.1)' : n === 5 ? 'rgba(255,107,107,0.12)' : 'rgba(199,125,255,0.12)';
      const defaultTag = n === 1 ? 'Most Popular' : n === 4 ? 'New' : null;

      cmsServices.push({
        num: String(n).padStart(2, '0'),
        title,
        subtitle: defaultSubtitle,
        icon: defaultIcon,
        accent: defaultAccent,
        accentDim: defaultAccentDim,
        desc: data[`service${n}Desc`] || '',
        details: details.length > 0 ? details : (defaultServices[n-1]?.details || []),
        tag: defaultTag,
      });
    }
  }

  const finalServices = cmsServices.length > 0 ? cmsServices : defaultServices;

  const headingWords = offerHeading.split(' ');
  const lastWord = headingWords.pop() || '';
  const firstPart = headingWords.join(' ');

  return (
    <section style={{ padding: '6rem 6vw 9rem', background: '#0b0f0e', position: 'relative', overflow: 'hidden' }}>

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
        background: 'radial-gradient(ellipse 70% 50% at 50% 50%, rgba(82,183,136,0.04) 0%, transparent 70%)',
      }} />

      {/* Section header */}
      <motion.div
        initial={{ opacity: 0, y: 48 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false }}
        transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
        style={{ textAlign: 'center', marginBottom: '5rem', position: 'relative', zIndex: 1 }}
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
          <span style={{ color: '#52b788', fontSize: '11px', fontWeight: 700, letterSpacing: '2.5px', textTransform: 'uppercase' }}>{offerEyebrow}</span>
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
          {firstPart}{' '}
          <span style={{ background: 'linear-gradient(90deg, #52b788, #00e5ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            {lastWord}
          </span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: false }} transition={{ delay: 0.2 }}
          style={{ color: 'rgba(232,245,236,0.45)', maxWidth: '440px', margin: '0 auto', fontSize: '1rem', lineHeight: 1.75 }}
        >
          {offerSubtext}
        </motion.p>
      </motion.div>

      {/* Cards grid */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '24px', maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1,
      }}>
        {finalServices.map((service, i) => (
          <ServiceCard key={i} service={service} index={i} />
        ))}
      </div>

      <style>{`
        @keyframes pulseDot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.35; transform: scale(1.6); }
        }
      `}</style>
    </section>
  );
}