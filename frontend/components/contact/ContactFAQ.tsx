'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';

const faqs = [
  {
    q: 'How long does a project typically take?',
    a: 'Small to medium projects (landing pages, portfolio sites, simple apps) take 2–4 weeks. Full-stack applications with custom CMS, bookings, and admin panels typically take 4–10 weeks. Complex platforms (e-commerce, SaaS) can range from 8–16 weeks. I always provide a detailed timeline during our discovery call before any work begins.',
    icon: '⏱',
    accent: '#52b788',
  },
  {
    q: 'Do you work with international clients?',
    a: 'Absolutely — I work with clients globally across the US, Europe, Middle East, and beyond. Communication happens via Slack, WhatsApp, email, and scheduled video calls. I\'m highly responsive and provide daily/weekly progress updates regardless of time zone. Remote collaboration is my default mode.',
    icon: '🌍',
    accent: '#00e5ff',
  },
  {
    q: 'What technologies do you specialise in?',
    a: 'My core stack is Next.js + TypeScript + MongoDB Atlas + Cloudinary, deployed on VPS with Nginx and PM2. For design I use Figma, for 3D I use Blender and Three.js/React Three Fiber, and for AI automations I build with n8n, OpenAI API, and custom pipelines. I also work with Tailwind CSS, Framer Motion, and various third-party APIs.',
    icon: '⚡',
    accent: '#ffca28',
  },
  {
    q: 'How does pricing work?',
    a: 'I offer three models: fixed-price (ideal for defined scopes), hourly rate (for ongoing work or MVPs), and monthly retainer (for continuous feature development and support). Every project starts with a free 30-minute discovery call. After that I provide a detailed proposal with timeline and cost breakdown — no surprises.',
    icon: '💰',
    accent: '#76ff03',
  },
  {
    q: 'Do you provide post-launch support?',
    a: 'Yes — all projects come with a 30-day post-launch support window at no extra cost. After that, many clients choose a monthly retainer for ongoing updates, performance optimisation, new features, and security patches. I also provide full handover documentation and admin training so you\'re never dependent on me for basic changes.',
    icon: '🛡',
    accent: '#52b788',
  },
];

// ── Tilt FAQ Item ─────────────────────────────────────────────────────────────
interface FAQType {
  q: string;
  a: string;
  icon: string;
  accent: string;
}

function FAQItem({ faq, index, isOpen, onToggle }: {
  faq: FAQType; index: number; isOpen: boolean; onToggle: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const sp = { stiffness: 220, damping: 22 };
  const rotX = useSpring(useTransform(rawY, [-0.5, 0.5], [4, -4]), sp);
  const rotY = useSpring(useTransform(rawX, [-0.5, 0.5], [-4, 4]), sp);

  const onMove = (e: React.MouseEvent) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    rawX.set((e.clientX - r.left) / r.width - 0.5);
    rawY.set((e.clientY - r.top) / r.height - 0.5);
  };
  const onLeave = () => { rawX.set(0); rawY.set(0); };

  return (
    <motion.div
      initial={{ opacity: 0, x: -40, scale: 0.96 }}
      whileInView={{ opacity: 1, x: 0, scale: 1 }}
      viewport={{ once: false, margin: '-30px' }}
      transition={{ delay: index * 0.09, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      style={{ perspective: 800, marginBottom: 12 }}
    >
      <motion.div
        ref={ref}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        style={{
          rotateX: rotX, rotateY: rotY, transformStyle: 'preserve-3d',
          position: 'relative', borderRadius: 18, overflow: 'hidden',
          cursor: 'pointer', border: '1px solid rgba(255,255,255,0.07)',
        }}
        animate={{
          borderColor: isOpen ? `${faq.accent}44` : 'rgba(255,255,255,0.07)',
          background: isOpen ? 'rgba(9,14,12,0.95)' : 'rgba(9,14,12,0.7)',
          boxShadow: isOpen ? `0 20px 60px rgba(0,0,0,0.4), 0 0 0 1px ${faq.accent}22` : '0 4px 20px rgba(0,0,0,0.2)',
        }}
        transition={{ duration: 0.35 }}
        onClick={onToggle}
      >
        {/* Accent left border */}
        <motion.div
          animate={{ scaleY: isOpen ? 1 : 0, opacity: isOpen ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 3, background: `linear-gradient(to bottom, ${faq.accent}, transparent)`, transformOrigin: 'top', borderRadius: '0 2px 2px 0' }}
        />

        {/* Top accent bar */}
        <motion.div
          animate={{ scaleX: isOpen ? 1 : 0, opacity: isOpen ? 1 : 0 }}
          transition={{ duration: 0.4 }}
          style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${faq.accent}, transparent)`, transformOrigin: 'left' }}
        />

        {/* Bloom */}
        <motion.div
          animate={{ opacity: isOpen ? 1 : 0 }}
          style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse 80% 60% at 50% 110%, ${faq.accent}12, transparent 65%)`, pointerEvents: 'none' }}
        />

        {/* Scan line */}
        {isOpen && (
          <motion.div
            animate={{ y: ['0%', '100%'], opacity: [0, 0.4, 0] }}
            transition={{ duration: 1.8, ease: 'linear', repeat: Infinity, repeatDelay: 1.5 }}
            style={{ position: 'absolute', left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, ${faq.accent}, transparent)`, zIndex: 4, pointerEvents: 'none' }}
          />
        )}

        {/* Question row */}
        <div style={{ padding: '22px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20, position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
            <motion.div
              animate={{ scale: isOpen ? 1.2 : 1, filter: isOpen ? `drop-shadow(0 0 8px ${faq.accent})` : 'none', rotate: isOpen ? 10 : 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 14 }}
              style={{ fontSize: 22, flexShrink: 0 }}
            >
              {faq.icon}
            </motion.div>
            <motion.p
              animate={{ color: isOpen ? '#e8f5ec' : 'rgba(232,245,236,0.7)' }}
              style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '1rem', margin: 0, letterSpacing: '-0.2px', lineHeight: 1.3 }}
            >
              {faq.q}
            </motion.p>
          </div>

          <motion.div
            animate={{ rotate: isOpen ? 135 : 0, background: isOpen ? faq.accent : 'rgba(255,255,255,0.05)', color: isOpen ? '#060d0b' : 'rgba(232,245,236,0.4)' }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            style={{ width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0, fontWeight: 300 }}
          >
            +
          </motion.div>
        </div>

        {/* Answer */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
              style={{ overflow: 'hidden' }}
            >
              <motion.div
                initial={{ y: -12 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.3, delay: 0.05 }}
                style={{ padding: '0 28px 24px 68px', position: 'relative', zIndex: 2 }}
              >
                {/* Animated divider */}
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.5 }}
                  style={{ height: 1, background: `linear-gradient(90deg, ${faq.accent}44, transparent)`, marginBottom: 16, transformOrigin: 'left' }}
                />
                <p style={{ color: 'rgba(232,245,236,0.65)', lineHeight: 1.8, fontSize: '0.92rem', margin: 0 }}>
                  {faq.a}
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function ContactFAQ({ data = {} }: { data?: Record<string, string> }) {
  const [open, setOpen] = useState<number | null>(null);

  const cmsFaqs: FAQType[] = [];
  for (let n = 1; n <= 6; n++) {
    const q = data[`faq${n}Q`];
    const a = data[`faq${n}A`];
    if (q) {
      const defaultIcon = n === 1 ? '⏱' : n === 2 ? '🌍' : n === 3 ? '⚡' : n === 4 ? '💰' : n === 5 ? '🛡' : '💬';
      const defaultAccent = n === 1 ? '#52b788' : n === 2 ? '#00e5ff' : n === 3 ? '#ffca28' : n === 4 ? '#76ff03' : n === 5 ? '#52b788' : '#00e5ff';
      cmsFaqs.push({
        q,
        a: a || '',
        icon: defaultIcon,
        accent: defaultAccent,
      });
    }
  }

  const finalFaqs = cmsFaqs.length > 0 ? cmsFaqs : faqs;

  return (
    <section style={{ padding: '9rem 6vw', background: '#0b0f0e', position: 'relative', overflow: 'hidden' }}>

      <div style={{ position: 'absolute', inset: 0, backgroundImage: `linear-gradient(rgba(82,183,136,0.022) 1px, transparent 1px), linear-gradient(90deg, rgba(82,183,136,0.022) 1px, transparent 1px)`, backgroundSize: '60px 60px', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 70% 50% at 50% 50%, rgba(82,183,136,0.04) 0%, transparent 70%)', pointerEvents: 'none' }} />

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 48 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false }} transition={{ duration: 0.85 }}
        style={{ textAlign: 'center', marginBottom: '5.5rem', position: 'relative', zIndex: 1 }}>
        <motion.div initial={{ opacity: 0, scale: 0.7 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: false }}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: 'rgba(82,183,136,0.07)', border: '1px solid rgba(82,183,136,0.2)', padding: '7px 20px', borderRadius: 100, marginBottom: 28 }}>
          <motion.span animate={{ opacity: [1, 0.3, 1], scale: [1, 1.5, 1] }} transition={{ duration: 1.8, repeat: Infinity }} style={{ width: 7, height: 7, borderRadius: '50%', background: '#52b788', boxShadow: '0 0 8px #52b788', flexShrink: 0 }} />
          <span style={{ color: '#52b788', fontSize: '11px', fontWeight: 700, letterSpacing: '2.5px', textTransform: 'uppercase' }}>FAQ</span>
        </motion.div>

        <motion.h2 initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false }} transition={{ delay: 0.1 }}
          style={{ fontFamily: "'Syne', sans-serif", color: '#e8f5ec', fontSize: 'clamp(2.2rem,5.5vw,4rem)', fontWeight: 800, letterSpacing: '-1.5px', lineHeight: 1.05, marginBottom: 18 }}>
          Questions<br />
          <span style={{ background: 'linear-gradient(90deg, #52b788, #ffca28)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            Answered
          </span>
        </motion.h2>
        <p style={{ color: 'rgba(232,245,236,0.4)', fontSize: '1rem', maxWidth: 420, margin: '0 auto' }}>
          Got questions? Here are the ones I hear most — answered honestly.
        </p>
      </motion.div>

      {/* Grid: FAQs + Sidebar */}
      <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))', gap: 48, position: 'relative', zIndex: 1 }}>

        {/* FAQ List */}
        <div>
          {finalFaqs.map((faq, i) => (
            <FAQItem key={i} faq={faq} index={i} isOpen={open === i} onToggle={() => setOpen(open === i ? null : i)} />
          ))}
        </div>

        {/* Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: false }}
          transition={{ delay: 0.4, duration: 0.7 }}
          style={{ display: 'flex', flexDirection: 'column', gap: 20 }}
        >
          {/* Still have questions card */}
          <div style={{ padding: '32px 28px', borderRadius: 20, background: 'rgba(9,14,12,0.8)', border: '1px solid rgba(82,183,136,0.15)', position: 'relative', overflow: 'hidden', backdropFilter: 'blur(12px)' }}>
            <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 80% 60% at 50% 120%, rgba(82,183,136,0.1), transparent 65%)', pointerEvents: 'none' }} />
            <div style={{ position: 'relative', zIndex: 1 }}>
              <span style={{ fontSize: 28, display: 'block', marginBottom: 14 }}>💬</span>
              <h4 style={{ fontFamily: "'Syne', sans-serif", color: '#e8f5ec', fontSize: '1.1rem', fontWeight: 700, marginBottom: 10 }}>Still have questions?</h4>
              <p style={{ color: 'rgba(232,245,236,0.45)', fontSize: '0.88rem', lineHeight: 1.7, marginBottom: 20 }}>
                Can&apos;t find what you&apos;re looking for? Send me a message and I&apos;ll get back to you within a few hours.
              </p>
              <motion.a
                href="#form"
                whileHover={{ scale: 1.04, boxShadow: '0 0 28px rgba(82,183,136,0.35)' }}
                whileTap={{ scale: 0.96 }}
                style={{ display: 'block', textAlign: 'center', padding: '12px', borderRadius: 100, background: '#52b788', color: '#060d0b', fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: '13px', letterSpacing: '1px', textDecoration: 'none', textTransform: 'uppercase' }}
              >
                Send a Message →
              </motion.a>
            </div>
          </div>

          {/* Quick facts */}
          <div style={{ padding: '28px', borderRadius: 20, background: 'rgba(9,14,12,0.8)', border: '1px solid rgba(255,255,255,0.07)', backdropFilter: 'blur(12px)' }}>
            <h4 style={{ fontFamily: "'Syne', sans-serif", color: 'rgba(232,245,236,0.35)', fontSize: '10px', fontWeight: 700, letterSpacing: '2.5px', textTransform: 'uppercase', marginBottom: 20 }}>Quick Facts</h4>
            {[
              { icon: '⚡', label: 'Response time', val: '< 12 hours' },
              { icon: '🌍', label: 'Works remotely', val: 'Worldwide' },
              { icon: '📅', label: 'Free discovery', val: '30-min call' },
              { icon: '🔒', label: 'NDA available', val: 'On request' },
            ].map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: false }}
                transition={{ delay: 0.5 + i * 0.07 }}
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: i < 3 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'rgba(232,245,236,0.45)', fontSize: '0.85rem' }}>
                  <span>{f.icon}</span>{f.label}
                </span>
                <span style={{ color: '#52b788', fontSize: '0.85rem', fontWeight: 700 }}>{f.val}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}