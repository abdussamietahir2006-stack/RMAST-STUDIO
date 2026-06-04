'use client';

import { useRef, useState, useEffect, FormEvent } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import toast from 'react-hot-toast';

const services = ['Web Development', 'UI/UX Design', '3D Expert', 'AI Automations', 'Multiple Services'];

// ── Animated Field ────────────────────────────────────────────────────────────
function Field({
  label, name, value, onChange, placeholder, type = 'text', required = false, delay = 0,
}: {
  label: string; name: string; value: string; onChange: (v: string) => void;
  placeholder: string; type?: string; required?: boolean; delay?: number;
}) {
  const [focused, setFocused] = useState(false);
  const valid = value.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24, filter: 'blur(4px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: false }}
      transition={{ delay, duration: 0.5 }}
      style={{ position: 'relative' }}
    >
      {/* Floating label */}
      <motion.label
        animate={{
          color: focused ? '#52b788' : valid ? 'rgba(82,183,136,0.6)' : 'rgba(232,245,236,0.25)',
          y: 0,
        }}
        style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '10px', fontWeight: 700, letterSpacing: '2.5px', textTransform: 'uppercase', marginBottom: 10, transition: 'color 0.2s' }}
      >
        {label}
        {required && <span style={{ color: '#52b788', fontSize: 16 }}>*</span>}
        {valid && !focused && (
          <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} style={{ color: '#52b788', fontSize: 12 }}>✓</motion.span>
        )}
      </motion.label>

      <div style={{ position: 'relative' }}>
        <motion.input
          type={type}
          name={name}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          required={required}
          animate={{
            borderColor: focused ? '#52b788' : valid ? 'rgba(82,183,136,0.35)' : 'rgba(255,255,255,0.07)',
            boxShadow: focused ? '0 0 28px rgba(82,183,136,0.2), inset 0 0 20px rgba(82,183,136,0.03)' : valid ? '0 0 12px rgba(82,183,136,0.08)' : 'none',
            background: focused ? 'rgba(82,183,136,0.04)' : 'rgba(255,255,255,0.02)',
          }}
          transition={{ duration: 0.25 }}
          style={{
            width: '100%', padding: '15px 20px', borderRadius: 14,
            border: '1px solid rgba(255,255,255,0.07)',
            color: '#e8f5ec', fontFamily: "'DM Sans', sans-serif",
            fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box',
          }}
        />
        {/* Focus underline */}
        <motion.div
          animate={{ scaleX: focused ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          style={{ position: 'absolute', bottom: -1, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg, #52b788, #00e5ff, transparent)', borderRadius: 2, transformOrigin: 'left' }}
        />
      </div>
    </motion.div>
  );
}

// ── Service selector ──────────────────────────────────────────────────────────
function ServiceSelect({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  const accents = ['#52b788', '#00e5ff', '#ffca28', '#76ff03', '#52b788'];

  return (
    <motion.div
      initial={{ opacity: 0, y: 24, filter: 'blur(4px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: false }}
      transition={{ delay: 0.25 }}
      style={{ position: 'relative', zIndex: 10 }}
    >
      <label style={{ display: 'block', color: 'rgba(232,245,236,0.25)', fontSize: '10px', fontWeight: 700, letterSpacing: '2.5px', textTransform: 'uppercase', marginBottom: 10 }}>
        Service Needed
      </label>
      <motion.button
        type="button"
        onClick={() => setOpen(o => !o)}
        animate={{
          borderColor: open ? '#52b788' : value ? 'rgba(82,183,136,0.35)' : 'rgba(255,255,255,0.07)',
          boxShadow: open ? '0 0 28px rgba(82,183,136,0.2)' : 'none',
        }}
        style={{ width: '100%', padding: '15px 20px', borderRadius: 14, border: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.02)', color: value ? '#e8f5ec' : 'rgba(232,245,236,0.3)', fontFamily: "'DM Sans', sans-serif", fontSize: '0.95rem', textAlign: 'left', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
      >
        {value || 'Select a service...'}
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.3 }} style={{ color: '#52b788' }}>▼</motion.span>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.22 }}
            style={{ position: 'absolute', top: '100%', left: 0, right: 0, marginTop: 6, borderRadius: 14, background: 'rgba(9,14,12,0.97)', border: '1px solid rgba(82,183,136,0.2)', backdropFilter: 'blur(20px)', overflow: 'hidden', boxShadow: '0 24px 60px rgba(0,0,0,0.5)' }}
          >
            {services.map((s, i) => (
              <motion.div
                key={s}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => { onChange(s); setOpen(false); }}
                whileHover={{ background: 'rgba(82,183,136,0.08)' }}
                style={{ padding: '13px 20px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12, borderBottom: i < services.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}
              >
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: accents[i], flexShrink: 0 }} />
                <span style={{ color: value === s ? '#52b788' : 'rgba(232,245,236,0.65)', fontSize: '0.9rem', fontWeight: value === s ? 700 : 400 }}>{s}</span>
                {value === s && <span style={{ marginLeft: 'auto', color: '#52b788', fontSize: 12 }}>✓</span>}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ── Submit particles ──────────────────────────────────────────────────────────
function SuccessParticles() {
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i, angle: (i / 20) * 360,
    color: ['#52b788', '#00e5ff', '#ffca28', '#76ff03'][i % 4],
  }));
  return (
    <div style={{ position: 'absolute', top: '50%', left: '50%', pointerEvents: 'none', zIndex: 10 }}>
      {particles.map(p => (
        <motion.div
          key={p.id}
          initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
          animate={{
            x: Math.cos(p.angle * Math.PI / 180) * 120,
            y: Math.sin(p.angle * Math.PI / 180) * 120,
            scale: 0, opacity: 0,
          }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
          style={{ position: 'absolute', width: 8, height: 8, borderRadius: '50%', background: p.color, boxShadow: `0 0 10px ${p.color}` }}
        />
      ))}
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function ContactForm({ data = {} }: { data?: Record<string, string> }) {
  const formRef = useRef<HTMLFormElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth < 768);
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const sp = { stiffness: 160, damping: 22 };
  const rotX = useSpring(useTransform(rawY, [-0.5, 0.5], [4, -4]), sp);
  const rotY = useSpring(useTransform(rawX, [-0.5, 0.5], [-4, 4]), sp);
  const glX  = useSpring(useTransform(rawX, [-0.5, 0.5], [15, 85]), sp);
  const glY  = useSpring(useTransform(rawY, [-0.5, 0.5], [15, 85]), sp);

  const [form, setForm] = useState({ name: '', email: '', phone: '', service: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [focusMsg, setFocusMsg] = useState(false);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = containerRef.current?.getBoundingClientRect();
    if (!r) return;
    rawX.set((e.clientX - r.left) / r.width - 0.5);
    rawY.set((e.clientY - r.top) / r.height - 0.5);
  };
  const onLeave = () => { rawX.set(0); rawY.set(0); };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/leads', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setSubmitted(true);
        setForm({ name: '', email: '', phone: '', service: '', message: '' });
        toast.success("Message sent! I'll get back to you soon.");
        setTimeout(() => setSubmitted(false), 4000);
      } else {
        toast.error(data.error || "Failed to send message");
      }
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
      console.error(err);
    }
    finally { setLoading(false); }
  };

  const contactItems = [
    { icon: '📧', label: 'Email', val: data.email || 'hello@rmast.dev', accent: '#52b788' },
    { icon: '💬', label: 'Phone', val: data.phone || '+1 (000) 000-0000', accent: '#00e5ff' },
    { icon: '⏱', label: 'Response', val: data.responseTime || 'Within 24 hours', accent: '#ffca28' },
    { icon: '📍', label: 'Availability', val: data.availability || 'Mon–Sat, Available 24 Hours', accent: '#76ff03' },
  ];

  return (
    <section id="form" style={{ padding: isMobile ? '5rem 4vw' : '9rem 6vw', background: '#0b0f0e', position: 'relative', overflow: 'hidden' }}>

      {/* BG */}
      <div style={{ position: 'absolute', inset: 0, backgroundImage: `linear-gradient(rgba(82,183,136,0.022) 1px, transparent 1px), linear-gradient(90deg, rgba(82,183,136,0.022) 1px, transparent 1px)`, backgroundSize: '60px 60px', pointerEvents: 'none' }} />
      <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.05, 0.12, 0.05] }} transition={{ duration: 12, repeat: Infinity }}
        style={{ position: 'absolute', top: '20%', right: '5%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(82,183,136,0.2), transparent 70%)', filter: 'blur(80px)', pointerEvents: 'none' }} />

      <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1.15fr', gap: isMobile ? 32 : 60, alignItems: 'start', position: 'relative', zIndex: 1 }}>

        {/* Left info panel */}
        <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: false }} transition={{ duration: 0.8 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: 'rgba(82,183,136,0.07)', border: '1px solid rgba(82,183,136,0.2)', padding: '7px 20px', borderRadius: 100, marginBottom: 28 }}>
            <motion.span animate={{ opacity: [1, 0.3, 1], scale: [1, 1.5, 1] }} transition={{ duration: 1.8, repeat: Infinity }} style={{ width: 7, height: 7, borderRadius: '50%', background: '#52b788', boxShadow: '0 0 8px #52b788', flexShrink: 0 }} />
            <span style={{ color: '#52b788', fontSize: '11px', fontWeight: 700, letterSpacing: '2.5px', textTransform: 'uppercase' }}>Send a Message</span>
          </div>

          <h2 style={{ fontFamily: "'Syne', sans-serif", color: '#e8f5ec', fontSize: 'clamp(2rem,3.5vw,3rem)', fontWeight: 800, letterSpacing: '-1px', lineHeight: 1.1, marginBottom: 20 }}>
            Have a project<br />
            <span style={{ background: 'linear-gradient(90deg, #52b788, #00e5ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>in mind?</span>
          </h2>
          <p style={{ color: 'rgba(232,245,236,0.45)', lineHeight: 1.8, marginBottom: 44, fontSize: '0.95rem' }}>
            Tell me about your project and I&apos;ll get back to you within a few hours with my thoughts and a rough timeline.
          </p>

          {/* Contact items */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {contactItems.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: false }}
                transition={{ delay: 0.3 + i * 0.08 }}
                whileHover={{ x: 6 }}
                style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '14px 18px', borderRadius: 14, background: 'rgba(9,14,12,0.6)', border: '1px solid rgba(255,255,255,0.06)', backdropFilter: 'blur(8px)', cursor: 'default' }}
              >
                <div style={{ width: 40, height: 40, borderRadius: 12, background: `${item.accent}14`, border: `1px solid ${item.accent}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>{item.icon}</div>
                <div>
                  <p style={{ color: `${item.accent}88`, fontSize: '9px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', margin: '0 0 3px' }}>{item.label}</p>
                  <p style={{ color: 'rgba(232,245,236,0.6)', fontSize: '0.88rem', margin: 0 }}>{item.val}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Right: 3D Form card */}
        <motion.div
          ref={containerRef}
          onMouseMove={onMove}
          onMouseLeave={onLeave}
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 0.8, delay: 0.15 }}
          style={{ rotateX: rotX, rotateY: rotY, transformStyle: 'preserve-3d', perspective: 1000 }}
        >
          <div style={{ position: 'relative', borderRadius: 24, background: 'rgba(9,14,12,0.9)', border: '1px solid rgba(82,183,136,0.15)', backdropFilter: 'blur(20px)', overflow: 'hidden', boxShadow: '0 40px 80px rgba(0,0,0,0.4)' }}>

            {/* Top accent bar */}
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: 'linear-gradient(90deg, #52b788, #00e5ff, #ffca28, transparent)' }} />
            {/* Glare */}
            <motion.div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 3, background: useTransform([glX, glY], ([gx, gy]: number[]) => `radial-gradient(circle at ${gx}% ${gy}%, rgba(255,255,255,0.06) 0%, transparent 55%)`) }} />
            {/* Bloom */}
            <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'radial-gradient(ellipse 80% 50% at 50% 120%, rgba(82,183,136,0.1), transparent 65%)' }} />

            {/* Success state */}
            <AnimatePresence>
              {submitted && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  style={{ position: 'absolute', inset: 0, background: 'rgba(9,14,12,0.97)', zIndex: 20, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderRadius: 24 }}
                >
                  <SuccessParticles />
                  <motion.div animate={{ scale: [0, 1.4, 1], rotate: [0, 20, 0] }} transition={{ duration: 0.7 }} style={{ fontSize: '5rem', marginBottom: 20 }}>✅</motion.div>
                  <h3 style={{ fontFamily: "'Syne', sans-serif", color: '#52b788', fontSize: '1.6rem', fontWeight: 800, margin: '0 0 10px' }}>Message Sent!</h3>
                  <p style={{ color: 'rgba(232,245,236,0.5)', fontSize: '0.9rem', margin: 0 }}>I&apos;ll get back to you within 12 hours.</p>
                </motion.div>
              )}
            </AnimatePresence>

            <form ref={formRef} onSubmit={handleSubmit} style={{ padding: isMobile ? '24px' : '40px', position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', gap: 20 }}>

              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 16 }}>
                <Field label="Full Name" name="name" value={form.name} onChange={v => setForm(f => ({ ...f, name: v }))} placeholder="Raja Ahmed" required delay={0.05} />
                <Field label="Email" name="email" value={form.email} onChange={v => setForm(f => ({ ...f, email: v }))} placeholder="you@email.com" type="email" required delay={0.1} />
              </div>

              <Field label="Phone (optional)" name="phone" value={form.phone} onChange={v => setForm(f => ({ ...f, phone: v }))} placeholder="+92 300 000 0000" delay={0.15} />

              <ServiceSelect value={form.service} onChange={v => setForm(f => ({ ...f, service: v }))} />

              {/* Message textarea */}
              <motion.div
                initial={{ opacity: 0, y: 24, filter: 'blur(4px)' }}
                whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                viewport={{ once: false }}
                transition={{ delay: 0.3 }}
                style={{ position: 'relative' }}
              >
                <motion.label animate={{ color: focusMsg ? '#52b788' : 'rgba(232,245,236,0.25)' }}
                  style={{ display: 'block', fontSize: '10px', fontWeight: 700, letterSpacing: '2.5px', textTransform: 'uppercase', marginBottom: 10, transition: 'color 0.2s' }}>
                  Message <span style={{ color: '#52b788' }}>*</span>
                </motion.label>
                <motion.textarea
                  name="message"
                  value={form.message}
                  onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                  placeholder="Tell me about your project — what are you building, what's the timeline, what's your budget range?"
                  required
                  rows={5}
                  onFocus={() => setFocusMsg(true)}
                  onBlur={() => setFocusMsg(false)}
                  animate={{
                    borderColor: focusMsg ? '#52b788' : form.message ? 'rgba(82,183,136,0.35)' : 'rgba(255,255,255,0.07)',
                    boxShadow: focusMsg ? '0 0 28px rgba(82,183,136,0.2)' : 'none',
                  }}
                  style={{ width: '100%', padding: '15px 20px', borderRadius: 14, border: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.02)', color: '#e8f5ec', fontFamily: "'DM Sans', sans-serif", fontSize: '0.95rem', outline: 'none', resize: 'vertical', boxSizing: 'border-box' }}
                />
                <motion.div animate={{ scaleX: focusMsg ? 1 : 0 }} transition={{ duration: 0.3 }}
                  style={{ position: 'absolute', bottom: -1, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg, #52b788, #00e5ff, transparent)', borderRadius: 2, transformOrigin: 'left' }} />
              </motion.div>

              {/* Submit */}
              <motion.button
                type="submit"
                disabled={loading || !form.name || !form.email || !form.message}
                whileHover={(!loading && form.name && form.email && form.message) ? { scale: 1.03, boxShadow: '0 0 40px rgba(82,183,136,0.4)' } : {}}
                whileTap={{ scale: 0.97 }}
                animate={{
                  background: (!loading && form.name && form.email && form.message) ? '#52b788' : 'rgba(82,183,136,0.1)',
                  color: (!loading && form.name && form.email && form.message) ? '#060d0b' : 'rgba(232,245,236,0.2)',
                }}
                style={{ padding: '16px', borderRadius: 14, border: 'none', fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: '14px', letterSpacing: '2px', textTransform: 'uppercase', cursor: (!loading && form.name && form.email && form.message) ? 'pointer' : 'not-allowed' }}
              >
                {loading
                  ? <motion.span animate={{ opacity: [1, 0.4, 1] }} transition={{ duration: 1, repeat: Infinity }}>⏳ Sending...</motion.span>
                  : '📨 Send Message →'
                }
              </motion.button>
            </form>
          </div>
        </motion.div>
      </div>
    </section>
  );
}