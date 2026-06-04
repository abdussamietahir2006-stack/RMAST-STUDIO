'use client';

import Image from 'next/image';
import { useRef, useState, useCallback, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';

interface ServiceDetail {
  num: string;
  title: string;
  subtitle: string;
  icon: string;
  accent: string;
  accentDim: string;
  desc: string;
  stack: string[];
  highlights: { label: string; value: string }[];
  side: 'left' | 'right';
  image: string;
  imageAlt: string;
}

const defaultServiceData: ServiceDetail[] = [
  {
    num: '01',
    title: 'Web Development',
    subtitle: 'Full-Stack Engineering',
    icon: '⚡',
    accent: '#52b788',
    accentDim: 'rgba(82,183,136,0.12)',
    desc: 'I build fast, scalable, and modern web applications using Next.js, Node.js, and MongoDB with clean architecture and performance in mind. Every project is engineered to grow with your business.',
    stack: ['Next.js', 'TypeScript', 'Node.js', 'MongoDB Atlas', 'Nginx + PM2', 'REST & GraphQL'],
    highlights: [
      { label: 'Avg. Load Time', value: '< 1.2s' },
      { label: 'Lighthouse Score', value: '98+' },
      { label: 'Uptime SLA', value: '99.9%' },
    ],
    side: 'left',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80',
    imageAlt: 'Web development code on a dark screen',
  },
  {
    num: '02',
    title: 'UI/UX Design',
    subtitle: 'Interface & Experience',
    icon: '🎨',
    accent: '#00e5ff',
    accentDim: 'rgba(0,229,255,0.12)',
    desc: 'Designing elegant interfaces with obsessive attention to detail, user experience, and visual storytelling. Every interaction is deliberate — from micro-animations to the full user journey.',
    stack: ['Figma', 'Framer', 'Design Systems', 'Prototyping', 'Motion Design', 'Brand Tokens'],
    highlights: [
      { label: 'Designs Delivered', value: '80+' },
      { label: 'Avg. Conversion Lift', value: '+34%' },
      { label: 'Revision Rounds', value: 'Unlimited' },
    ],
    side: 'right',
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80',
    imageAlt: 'UI/UX design wireframes and colour palette on screen',
  },
  {
    num: '03',
    title: '3D & Motion',
    subtitle: 'Immersive Experiences',
    icon: '🌐',
    accent: '#ffca28',
    accentDim: 'rgba(255,202,40,0.12)',
    desc: 'Creating immersive 3D web experiences using Three.js for next-level interaction and engagement. From product configurators to full WebGL scenes — if you can imagine it, I can build it.',
    stack: ['Three.js', 'WebGL Shaders', 'Blender', 'GSAP', 'Spline', 'Framer Motion'],
    highlights: [
      { label: 'Frame Rate Target', value: '60 FPS' },
      { label: 'Mobile Optimised', value: 'Always' },
      { label: 'Scene Complexity', value: 'No Limits' },
    ],
    side: 'left',
    image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80',
    imageAlt: 'Abstract 3D render with glowing geometric shapes',
  },
  {
    num: '04',
    title: 'AI Automation',
    subtitle: 'Intelligent Workflows',
    icon: '🤖',
    accent: '#76ff03',
    accentDim: 'rgba(118,255,3,0.1)',
    desc: 'Building AI-powered systems including chatbots, automation tools, and intelligent workflows to save time and scale operations. I turn repetitive tasks into elegant, self-running machines.',
    stack: ['OpenAI API', 'LangChain', 'n8n', 'Zapier', 'Custom Agents', 'Data Pipelines'],
    highlights: [
      { label: 'Time Saved / Week', value: '20+ hrs' },
      { label: 'Automation Accuracy', value: '99%+' },
      { label: 'Integration Support', value: '100+' },
    ],
    side: 'right',
    image: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=800&q=80',
    imageAlt: 'AI neural network visualisation with glowing nodes',
  },
];

function ServiceDetailCard({ service, index, isMobile }: { service: ServiceDetail; index: number; isMobile: boolean }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  const [particles, setParticles] = useState<{ id: number; x: number; y: number }[]>([]);

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const sp = { stiffness: 160, damping: 22, mass: 0.8 };
  const rotateX = useSpring(useTransform(rawY, [-0.5, 0.5], [8, -8]), sp);
  const rotateY = useSpring(useTransform(rawX, [-0.5, 0.5], [-8, 8]), sp);
  const glareX  = useSpring(useTransform(rawX, [-0.5, 0.5], [10, 90]), sp);
  const glareY  = useSpring(useTransform(rawY, [-0.5, 0.5], [10, 90]), sp);
  const shadowX = useSpring(useTransform(rawX, [-0.5, 0.5], [-28, 28]), sp);
  const shadowY = useSpring(useTransform(rawY, [-0.5, 0.5], [-28, 28]), sp);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    rawX.set((e.clientX - rect.left) / rect.width - 0.5);
    rawY.set((e.clientY - rect.top) / rect.height - 0.5);
    if (Math.random() > 0.78) {
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
    ([sx, sy]: number[]) => `${sx}px ${sy}px 70px rgba(0,0,0,0.75), 0 0 0 1px ${service.accent}18`
  );

  const isLeft = service.side === 'left';

  return (
    <motion.div
      initial={{ opacity: 0, x: isLeft ? -60 : 60 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: false, margin: '-80px' }}
      transition={{ delay: 0.1, duration: 1, ease: [0.22, 1, 0.36, 1] }}
      style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
        gap: isMobile ? '32px' : '48px',
        alignItems: 'center',
        maxWidth: '1100px',
        width: '100%',
        margin: '0 auto',
        direction: isMobile ? 'ltr' : (isLeft ? 'ltr' : 'rtl'),
      }}
    >
      {/* Text side */}
      <div style={{ direction: 'ltr' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <motion.div
              whileHover={{ scale: 1.2, rotate: 10 }}
              style={{ fontSize: '36px', filter: `drop-shadow(0 0 12px ${service.accent})` }}
            >
              {service.icon}
            </motion.div>
            <div>
              <p style={{ color: service.accent, fontSize: '10px', fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', margin: 0 }}>
                {service.subtitle}
              </p>
              <span style={{ color: 'rgba(232,245,236,0.2)', fontFamily: "'Syne', sans-serif", fontSize: '13px', fontWeight: 800, letterSpacing: '2px' }}>
                {service.num}
              </span>
            </div>
          </div>

          <h2 style={{
            fontFamily: "'Syne', sans-serif",
            color: '#e8f5ec', fontSize: 'clamp(1.6rem, 3.5vw, 2.8rem)',
            fontWeight: 800, letterSpacing: '-1px', lineHeight: 1.05, marginBottom: '16px',
          }}>
            {service.title}
          </h2>

          <div style={{ height: '2px', width: '40px', background: `linear-gradient(90deg, ${service.accent}, transparent)`, borderRadius: '2px', marginBottom: '20px' }} />

          <p style={{ color: 'rgba(232,245,236,0.65)', lineHeight: 1.8, fontSize: '0.95rem', marginBottom: '28px', maxWidth: isMobile ? '100%' : '420px' }}>
            {service.desc}
          </p>

          {/* Highlights row */}
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginBottom: '28px' }}>
            {service.highlights.map((h, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false }}
                transition={{ delay: 0.3 + i * 0.1 }}
                style={{
                  padding: '12px 18px', borderRadius: '12px',
                  background: service.accentDim, border: `1px solid ${service.accent}33`,
                  textAlign: 'center',
                }}
              >
                <div style={{ fontFamily: "'Syne', sans-serif", color: service.accent, fontSize: '1.3rem', fontWeight: 800, lineHeight: 1 }}>
                  {h.value}
                </div>
                <div style={{ color: 'rgba(232,245,236,0.4)', fontSize: '10px', letterSpacing: '1.5px', textTransform: 'uppercase', marginTop: '4px' }}>
                  {h.label}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Card side */}
      <div style={{ direction: 'ltr', perspective: '900px' }}>
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
            background: 'rgba(11,15,14,0.85)',
            border: `1px solid ${service.accent}22`,
            backdropFilter: 'blur(14px)',
            overflow: 'hidden',
            cursor: 'crosshair',
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

          {/* ── Service Image ── */}
          <div style={{ position: 'relative', width: '100%', height: '200px', overflow: 'hidden' }}>
            <Image
              src={service.image}
              alt={service.imageAlt}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              style={{
                objectFit: 'cover',
                filter: 'brightness(0.55) saturate(0.8)',
                transition: 'filter 0.4s ease',
              }}
              onMouseEnter={e => (e.currentTarget.style.filter = 'brightness(0.7) saturate(1)')}
              onMouseLeave={e => (e.currentTarget.style.filter = 'brightness(0.55) saturate(0.8)')}
            />
            {/* Accent tint overlay */}
            <div style={{
              position: 'absolute', inset: 0,
              background: `linear-gradient(180deg, transparent 40%, rgba(11,15,14,0.95) 100%), linear-gradient(180deg, ${service.accent}18 0%, transparent 60%)`,
              zIndex: 1,
            }} />
            {/* Service number watermark */}
            <span style={{
              position: 'absolute', top: '12px', right: '16px', zIndex: 2,
              fontFamily: "'Syne', sans-serif", fontSize: '11px', fontWeight: 800,
              color: service.accent, letterSpacing: '2px', opacity: 0.7,
            }}>
              {service.num}
            </span>
          </div>

          <div style={{ padding: '32px', position: 'relative', zIndex: 2 }}>
            <p style={{ color: 'rgba(232,245,236,0.25)', fontSize: '10px', fontWeight: 700, letterSpacing: '2.5px', textTransform: 'uppercase', marginBottom: '18px' }}>
              Tech Stack
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '28px' }}>
              {service.stack.map((tech, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: false }}
                  transition={{ delay: i * 0.06 + 0.2, type: 'spring', stiffness: 400, damping: 16 }}
                  whileHover={{ scale: 1.08, y: -2 }}
                  style={{
                    padding: '7px 14px', borderRadius: '8px',
                    background: `${service.accent}12`, border: `1px solid ${service.accent}30`,
                    color: service.accent, fontSize: '12px', fontWeight: 600,
                    letterSpacing: '0.5px', cursor: 'default',
                  }}
                >
                  {tech}
                </motion.div>
              ))}
            </div>

            {/* Animated underline on hover */}
            <motion.div
              animate={{ width: hovered ? '100%' : '0%' }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              style={{
                height: '1px',
                background: `linear-gradient(90deg, ${service.accent}66, transparent)`,
                borderRadius: '1px', marginBottom: '20px',
              }}
            />

            {/* Bottom CTA */}
            <AnimatePresence>
              {hovered && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.3 }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '10px',
                    padding: '12px 16px', borderRadius: '12px',
                    background: service.accentDim, border: `1px solid ${service.accent}33`,
                  }}
                >
                  <span style={{ fontSize: '14px' }}>📦</span>
                  <span style={{ fontSize: '12px', color: service.accent, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>
                    Available for projects
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
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
      </div>
    </motion.div>
  );
}

export interface ServicesDetailsCMSData {
  data?: Record<string, string>;
  images?: Record<string, string>;
}

export default function ServiceDetails({ data = {}, images = {} }: ServicesDetailsCMSData) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth < 768);
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  // Map CMS data
  const cmsServiceData: ServiceDetail[] = [];
  for (let n = 1; n <= 6; n++) {
    const title = data[`service${n}Title`];
    if (title) {
      const bullets = [
        data[`service${n}Bullet1`],
        data[`service${n}Bullet2`],
        data[`service${n}Bullet3`],
        data[`service${n}Bullet4`],
      ].filter(Boolean);

      const defaultIcon = n === 1 ? '⚡' : n === 2 ? '🎨' : n === 3 ? '🌐' : n === 4 ? '🤖' : n === 5 ? '🛒' : '📈';
      const defaultSubtitle = n === 1 ? 'Full-Stack Engineering' : n === 2 ? 'Interface & Experience' : n === 3 ? 'Immersive Experiences' : n === 4 ? 'Intelligent Workflows' : n === 5 ? 'E-Commerce Solutions' : 'SEO & Performance Optimization';
      const defaultAccent = n === 1 ? '#52b788' : n === 2 ? '#00e5ff' : n === 3 ? '#ffca28' : n === 4 ? '#76ff03' : n === 5 ? '#ff6b6b' : '#c77dff';
      const defaultAccentDim = n === 1 ? 'rgba(82,183,136,0.12)' : n === 2 ? 'rgba(0,229,255,0.12)' : n === 3 ? 'rgba(255,202,40,0.12)' : n === 4 ? 'rgba(118,255,3,0.1)' : n === 5 ? 'rgba(255,107,107,0.12)' : 'rgba(199,125,255,0.12)';
      const defaultImage = n === 1
        ? 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80'
        : n === 2
        ? 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80'
        : n === 3
        ? 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80'
        : n === 4
        ? 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=800&q=80'
        : n === 5
        ? 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&q=80'
        : 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80';

      const defaultHighlights = n === 1
        ? [
            { label: 'Avg. Load Time', value: '< 1.2s' },
            { label: 'Lighthouse Score', value: '98+' },
            { label: 'Uptime SLA', value: '99.9%' },
          ]
        : n === 2
        ? [
            { label: 'Designs Delivered', value: '80+' },
            { label: 'Avg. Conversion Lift', value: '+34%' },
            { label: 'Revision Rounds', value: 'Unlimited' },
          ]
        : n === 3
        ? [
            { label: 'Frame Rate Target', value: '60 FPS' },
            { label: 'Mobile Optimised', value: 'Always' },
            { label: 'Scene Complexity', value: 'No Limits' },
          ]
        : n === 4
        ? [
            { label: 'Time Saved / Week', value: '20+ hrs' },
            { label: 'Automation Accuracy', value: '99%+' },
            { label: 'Integration Support', value: '100+' },
          ]
        : n === 5
        ? [
            { label: 'Avg Ticket Lift', value: '+22%' },
            { label: 'Secure Checkout', value: 'Stripe' },
            { label: 'Admin Dashboard', value: 'Included' },
          ]
        : [
            { label: 'Lighthouse Score', value: '99/100' },
            { label: 'Search Traffic', value: '+50%' },
            { label: 'Indexation Time', value: '< 24h' },
          ];

      cmsServiceData.push({
        num: String(n).padStart(2, '0'),
        title,
        subtitle: defaultSubtitle,
        icon: defaultIcon,
        accent: defaultAccent,
        accentDim: defaultAccentDim,
        desc: data[`service${n}Desc`] || '',
        stack: bullets.length > 0 ? bullets : (defaultServiceData[n-1]?.stack || []),
        highlights: defaultHighlights,
        side: n % 2 === 1 ? 'left' : 'right',
        image: images[`service${n}Image`] || defaultImage,
        imageAlt: title,
      });
    }
  }

  const finalServiceData = cmsServiceData.length > 0 ? cmsServiceData : defaultServiceData;

  return (
    <section style={{ padding: '4rem 6vw 7rem', background: '#0b0f0e', position: 'relative', overflow: 'hidden' }}>

      {/* Grid bg */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: `
          linear-gradient(rgba(82,183,136,0.025) 1px, transparent 1px),
          linear-gradient(90deg, rgba(82,183,136,0.025) 1px, transparent 1px)
        `,
        backgroundSize: '64px 64px',
      }} />

      <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? '72px' : '100px', position: 'relative', zIndex: 1 }}>
        {finalServiceData.map((service, i) => (
          <ServiceDetailCard key={i} service={service} index={i} isMobile={isMobile} />
        ))}
      </div>

      <style>{`
        @media (max-width: 768px) {
          .service-detail-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}