'use client';

import { motion } from 'framer-motion';

export default function ProjectsHero({ data = {} }: { data?: Record<string, string> }) {
  const rawHeading = data.heroHeading || "Selected Projects";
  const headingWords = rawHeading.split(' ');
  const lastWord = headingWords.pop() || '';
  const remainingHeading = headingWords.join(' ');

  const statPills = [
    { value: data.heroStat1Value || '50+', label: data.heroStat1Label || 'Projects' },
    { value: data.heroStat2Value || '30+', label: data.heroStat2Label || 'Clients' },
    { value: data.heroStat3Value || '98+', label: data.heroStat3Label || 'Lighthouse' },
  ];

  return (
    <section style={{
      padding: '10rem 6vw 6rem',
      textAlign: 'center',
      background: '#0b0f0e',
      position: 'relative',
      overflow: 'hidden',
    }}>

      {/* Grid bg */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: `
          linear-gradient(rgba(82,183,136,0.025) 1px, transparent 1px),
          linear-gradient(90deg, rgba(82,183,136,0.025) 1px, transparent 1px)
        `,
        backgroundSize: '64px 64px',
      }} />

      {/* Radial glow */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse 70% 60% at 50% 20%, rgba(82,183,136,0.12) 0%, transparent 70%)',
      }} />

      {/* Animated corner accents */}
      <motion.div
        animate={{ opacity: [0.3, 0.7, 0.3], scale: [1, 1.08, 1] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute', top: 60, left: 60, width: 120, height: 120,
          border: '1px solid rgba(82,183,136,0.15)', borderRadius: '4px',
          pointerEvents: 'none',
        }}
      />
      <motion.div
        animate={{ opacity: [0.3, 0.7, 0.3], scale: [1, 1.08, 1] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        style={{
          position: 'absolute', top: 60, right: 60, width: 120, height: 120,
          border: '1px solid rgba(82,183,136,0.15)', borderRadius: '4px',
          pointerEvents: 'none',
        }}
      />

      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '10px',
            background: 'rgba(82,183,136,0.07)', border: '1px solid rgba(82,183,136,0.2)',
            padding: '7px 20px', borderRadius: '100px', marginBottom: '28px',
          }}
        >
          <span style={{
            width: 7, height: 7, borderRadius: '50%', background: '#52b788',
            boxShadow: '0 0 8px #52b788', flexShrink: 0, display: 'inline-block',
            animation: 'pulseDot 1.8s ease infinite',
          }} />
          <span style={{ color: '#52b788', fontSize: '11px', fontWeight: 700, letterSpacing: '2.5px', textTransform: 'uppercase' }}>
            {data.heroBadge || "Selected Works"}
          </span>
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
          style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: 'clamp(2.8rem, 7vw, 5.5rem)',
            fontWeight: 800, letterSpacing: '-2px', lineHeight: 1.0,
            color: '#e8f5ec', marginBottom: '20px',
          }}
        >
          {remainingHeading}{' '}
          <span style={{
            background: 'linear-gradient(90deg, #52b788, #00e5ff)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          }}>
            {lastWord}
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          style={{
            color: 'rgba(232,245,236,0.45)', maxWidth: '520px',
            margin: '0 auto 2.5rem', fontSize: '1rem', lineHeight: 1.75,
          }}
        >
          {data.heroSubtext || "A collection of my best work — blending design, code, and innovation into experiences that actually move the needle."}
        </motion.p>

        {/* Stat pills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.6 }}
          style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}
        >
          {statPills.map((stat, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -4, scale: 1.04 }}
              style={{
                padding: '12px 24px', borderRadius: '14px',
                background: 'rgba(82,183,136,0.07)', border: '1px solid rgba(82,183,136,0.18)',
                textAlign: 'center', cursor: 'default',
              }}
            >
              <div style={{
                fontFamily: "'Syne', sans-serif", color: '#52b788',
                fontSize: '1.6rem', fontWeight: 800, lineHeight: 1,
              }}>
                {stat.value}
              </div>
              <div style={{ color: 'rgba(232,245,236,0.35)', fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase', marginTop: '4px' }}>
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
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