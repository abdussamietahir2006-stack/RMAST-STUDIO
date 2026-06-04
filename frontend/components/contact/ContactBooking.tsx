'use client';

import { useRef, useState, useCallback } from 'react';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

type Step = 1 | 2 | 3;

// ── Holographic step card wrapper ─────────────────────────────────────────────
function HoloCard({ children, accent = '#52b788' }: { children: React.ReactNode; accent?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const sp = { stiffness: 200, damping: 22 };
  const rotX = useSpring(useTransform(rawY, [-0.5, 0.5], [6, -6]), sp);
  const rotY = useSpring(useTransform(rawX, [-0.5, 0.5], [-6, 6]), sp);
  const glX  = useSpring(useTransform(rawX, [-0.5, 0.5], [15, 85]), sp);
  const glY  = useSpring(useTransform(rawY, [-0.5, 0.5], [15, 85]), sp);

  const onMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    rawX.set((e.clientX - r.left) / r.width - 0.5);
    rawY.set((e.clientY - r.top) / r.height - 0.5);
  }, [rawX, rawY]);
  const onLeave = useCallback(() => { rawX.set(0); rawY.set(0); }, [rawX, rawY]);

  return (
    <motion.div ref={ref} onMouseMove={onMove} onMouseLeave={onLeave}
      style={{
        rotateX: rotX, rotateY: rotY, transformStyle: 'preserve-3d',
        position: 'relative', borderRadius: 24,
        background: 'rgba(9,14,12,0.9)', backdropFilter: 'blur(20px)',
        border: `1px solid ${accent}25`,
        boxShadow: `0 40px 80px rgba(0,0,0,0.5), 0 0 0 1px ${accent}12`,
        overflow: 'hidden',
      }}
    >
      {/* Top accent bar */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${accent}, transparent)` }} />
      {/* Glare */}
      <motion.div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 3,
        background: useTransform([glX, glY], ([gx, gy]: number[]) =>
          `radial-gradient(circle at ${gx}% ${gy}%, rgba(255,255,255,0.07) 0%, transparent 55%)`),
      }} />
      {/* Bloom */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: `radial-gradient(ellipse 80% 50% at 50% 120%, ${accent}18, transparent 65%)`,
      }} />
      <div style={{ position: 'relative', zIndex: 2 }}>{children}</div>
    </motion.div>
  );
}

// ── Magnetic time slot button ─────────────────────────────────────────────────
function TimeSlot({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) {
  const ref = useRef<HTMLButtonElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 300, damping: 18 });
  const sy = useSpring(y, { stiffness: 300, damping: 18 });

  const onMove = (e: React.MouseEvent) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    x.set((e.clientX - r.left - r.width / 2) * 0.3);
    y.set((e.clientY - r.top - r.height / 2) * 0.3);
  };

  return (
    <motion.button
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      onClick={onClick}
      whileTap={{ scale: 0.94 }}
      animate={{
        background: selected ? 'rgba(82,183,136,0.18)' : 'rgba(255,255,255,0.02)',
        borderColor: selected ? '#52b788' : 'rgba(82,183,136,0.2)',
        boxShadow: selected ? '0 0 28px rgba(82,183,136,0.3), inset 0 0 20px rgba(82,183,136,0.05)' : 'none',
        color: selected ? '#52b788' : 'rgba(232,245,236,0.6)',
      }}
      transition={{ duration: 0.2 }}
      style={{
        padding: '16px', borderRadius: 16, border: '1px solid rgba(82,183,136,0.2)',
        fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '14px',
        cursor: 'pointer', letterSpacing: '0.5px', x: sx, y: sy,
      }}
    >
      {selected && (
        <motion.span
          initial={{ scale: 0 }} animate={{ scale: 1 }}
          style={{ display: 'block', fontSize: 9, color: '#52b788', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: 4 }}
        >
          ✓ Selected
        </motion.span>
      )}
      {label}
    </motion.button>
  );
}

// ── Step indicator ────────────────────────────────────────────────────────────
function StepIndicator({ step }: { step: Step }) {
  const labels = ['Choose Date', 'Pick Time', 'Your Info'];
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0, marginBottom: 40 }}>
      {([1, 2, 3] as Step[]).map((s, i) => (
        <div key={s} style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
            <motion.div
              animate={{
                scale: step === s ? 1.15 : 1,
                background: step > s ? '#52b788' : step === s ? 'rgba(82,183,136,0.2)' : 'rgba(255,255,255,0.04)',
                borderColor: step >= s ? '#52b788' : 'rgba(255,255,255,0.1)',
                boxShadow: step === s ? '0 0 24px rgba(82,183,136,0.5)' : 'none',
              }}
              transition={{ duration: 0.4 }}
              style={{
                width: 44, height: 44, borderRadius: '50%',
                border: '1px solid rgba(255,255,255,0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              {step > s
                ? <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} style={{ color: '#060d0b', fontWeight: 800, fontSize: 16 }}>✓</motion.span>
                : <span style={{ color: step === s ? '#52b788' : 'rgba(232,245,236,0.25)', fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 14 }}>{s}</span>
              }
            </motion.div>
            <span style={{ fontSize: '10px', color: step === s ? '#52b788' : 'rgba(232,245,236,0.25)', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
              {labels[i]}
            </span>
          </div>
          {i < 2 && (
            <div style={{ width: 80, margin: '0 8px', position: 'relative', bottom: 10 }}>
              <div style={{ height: 1, background: 'rgba(255,255,255,0.06)' }} />
              <motion.div
                animate={{ scaleX: step > s ? 1 : 0 }}
                transition={{ duration: 0.5 }}
                style={{ position: 'absolute', inset: 0, height: 1, background: '#52b788', transformOrigin: 'left' }}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ── Animated input ────────────────────────────────────────────────────────────
function AnimInput({ label, value, onChange, placeholder, type = 'text', delay = 0 }: {
  label: string; value: string; onChange: (v: string) => void;
  placeholder: string; type?: string; delay?: number;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, x: -28 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.4 }}
      style={{ position: 'relative', marginBottom: 16 }}
    >
      <label style={{ display: 'block', color: focused ? '#52b788' : 'rgba(232,245,236,0.35)', fontSize: '10px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: 8, transition: 'color 0.2s' }}>
        {label}
      </label>
      <motion.input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        animate={{
          borderColor: focused ? '#52b788' : 'rgba(82,183,136,0.18)',
          boxShadow: focused ? '0 0 24px rgba(82,183,136,0.2), inset 0 0 12px rgba(82,183,136,0.03)' : 'none',
        }}
        style={{
          width: '100%', padding: '14px 18px', borderRadius: 14,
          border: '1px solid rgba(82,183,136,0.18)', background: 'rgba(255,255,255,0.025)',
          color: '#e8f5ec', fontFamily: "'DM Sans', sans-serif", fontSize: '0.95rem',
          outline: 'none', boxSizing: 'border-box',
        }}
      />
      <motion.div
        animate={{ scaleX: focused ? 1 : 0, opacity: focused ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        style={{ position: 'absolute', bottom: -2, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg, #52b788, transparent)', transformOrigin: 'left', borderRadius: 2 }}
      />
    </motion.div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function ContactBooking() {
  const [step, setStep] = useState<Step>(1);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [form, setForm] = useState({ name: '', email: '', whatsapp: '', service: '', reason: '' });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const times = ['9:00 AM', '11:00 AM', '1:00 PM', '3:00 PM', '5:00 PM', '7:00 PM'];

  const handleSubmit = async () => {
    if (!form.name || !form.email) {
      toast.error('Please fill in all required fields');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, date, time }),
      });
      const data = await res.json();
      if (res.ok) {
        setSubmitted(true);
        toast.success("Booking confirmed! I'll reach out within 24 hours.");
        setTimeout(() => {
          setStep(1); setDate(''); setTime('');
          setForm({ name: '', email: '', whatsapp: '', service: '', reason: '' });
          setSubmitted(false);
        }, 3500);
      } else {
        toast.error(data.error || "Failed to confirm booking");
      }
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
      console.error(err);
    }
    finally { setLoading(false); }
  };

  const slide = {
    enter: (d: number) => ({ opacity: 0, x: d * 60, scale: 0.96 }),
    center: { opacity: 1, x: 0, scale: 1 },
    exit: (d: number) => ({ opacity: 0, x: d * -60, scale: 0.96 }),
  };

  return (
    <section id="booking" style={{ padding: '8rem 6vw', background: '#0b0f0e', position: 'relative', overflow: 'hidden', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>

      {/* Background */}
      <div style={{ position: 'absolute', inset: 0, backgroundImage: `linear-gradient(rgba(82,183,136,0.022) 1px, transparent 1px), linear-gradient(90deg, rgba(82,183,136,0.022) 1px, transparent 1px)`, backgroundSize: '60px 60px', pointerEvents: 'none' }} />
      <motion.div
        animate={{ scale: [1, 1.3, 1], opacity: [0.06, 0.14, 0.06] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
        style={{ position: 'absolute', top: '10%', left: '5%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(82,183,136,0.2), transparent 70%)', filter: 'blur(80px)', pointerEvents: 'none' }}
      />
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.05, 0.1, 0.05] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut', delay: 5 }}
        style={{ position: 'absolute', bottom: '10%', right: '5%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,229,255,0.15), transparent 70%)', filter: 'blur(100px)', pointerEvents: 'none' }}
      />

      <motion.div
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false }}
        transition={{ duration: 0.8 }}
        style={{ maxWidth: 660, width: '100%', position: 'relative', zIndex: 1 }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <motion.div initial={{ opacity: 0, scale: 0.7 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: false }}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: 'rgba(82,183,136,0.07)', border: '1px solid rgba(82,183,136,0.2)', padding: '7px 20px', borderRadius: 100, marginBottom: 24 }}>
            <motion.span animate={{ opacity: [1, 0.3, 1], scale: [1, 1.5, 1] }} transition={{ duration: 1.8, repeat: Infinity }} style={{ width: 7, height: 7, borderRadius: '50%', background: '#52b788', boxShadow: '0 0 8px #52b788', flexShrink: 0 }} />
            <span style={{ color: '#52b788', fontSize: '11px', fontWeight: 700, letterSpacing: '2.5px', textTransform: 'uppercase' }}>Schedule Consultation</span>
          </motion.div>
          <motion.h2 initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false }}
            style={{ fontFamily: "'Syne', sans-serif", color: '#e8f5ec', fontSize: 'clamp(2rem,4vw,3rem)', fontWeight: 800, letterSpacing: '-1px', marginBottom: 12 }}>
            Book a <span style={{ background: 'linear-gradient(90deg, #52b788, #00e5ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Free Call</span>
          </motion.h2>
          <p style={{ color: 'rgba(232,245,236,0.4)', fontSize: '0.95rem' }}>30-minute strategy session — no strings attached.</p>
        </div>

        <StepIndicator step={step} />

        {/* Success */}
        <AnimatePresence>
          {submitted && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8 }}
              style={{ padding: '3rem', borderRadius: 24, background: 'rgba(82,183,136,0.1)', border: '1px solid rgba(82,183,136,0.3)', textAlign: 'center', marginBottom: 24 }}
            >
              <motion.div animate={{ scale: [0, 1.3, 1], rotate: [0, 20, 0] }} transition={{ duration: 0.6 }} style={{ fontSize: '4rem', marginBottom: 20 }}>🚀</motion.div>
              <h3 style={{ fontFamily: "'Syne', sans-serif", color: '#52b788', fontSize: '1.6rem', fontWeight: 800, margin: '0 0 8px' }}>Booking Confirmed!</h3>
              <p style={{ color: 'rgba(232,245,236,0.6)', margin: 0 }}>I&apos;ll send a confirmation to <strong style={{ color: '#52b788' }}>{form.email}</strong> shortly.</p>
              <p style={{ color: 'rgba(232,245,236,0.35)', fontSize: '0.85rem', marginTop: 8 }}>{date} at {time}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Steps */}
        <AnimatePresence mode="wait" custom={1}>
          {step === 1 && !submitted && (
            <motion.div key="s1" custom={1} variants={slide} initial="enter" animate="center" exit="exit" transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}>
              <HoloCard>
                <div style={{ padding: '36px 40px' }}>
                  <p style={{ color: '#52b788', fontSize: '11px', fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', marginBottom: 24 }}>📅 Select Date</p>
                  <motion.input
                    type="date"
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    whileFocus={{ borderColor: '#52b788', boxShadow: '0 0 24px rgba(82,183,136,0.25)' }}
                    style={{
                      width: '100%', padding: '16px 20px', borderRadius: 14,
                      border: '1px solid rgba(82,183,136,0.2)', background: 'rgba(255,255,255,0.03)',
                      color: '#e8f5ec', fontSize: '1rem', outline: 'none',
                      boxSizing: 'border-box', marginBottom: 28, cursor: 'pointer',
                      colorScheme: 'dark',
                    }}
                  />
                  {date && (
                    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                      style={{ padding: '12px 18px', borderRadius: 12, background: 'rgba(82,183,136,0.08)', border: '1px solid rgba(82,183,136,0.2)', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ color: '#52b788', fontSize: 16 }}>📆</span>
                      <span style={{ color: 'rgba(232,245,236,0.7)', fontSize: '0.9rem' }}>
                        Selected: <strong style={{ color: '#52b788' }}>{new Date(date + 'T00:00').toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</strong>
                      </span>
                    </motion.div>
                  )}
                  <motion.button
                    onClick={() => date && setStep(2)}
                    disabled={!date}
                    whileHover={date ? { scale: 1.03, boxShadow: '0 0 32px rgba(82,183,136,0.35)' } : {}}
                    whileTap={date ? { scale: 0.96 } : {}}
                    style={{
                      width: '100%', padding: '15px', borderRadius: 14,
                      background: date ? '#52b788' : 'rgba(82,183,136,0.1)',
                      color: date ? '#060d0b' : 'rgba(232,245,236,0.25)',
                      border: 'none', fontFamily: "'Syne', sans-serif", fontWeight: 800,
                      fontSize: '13px', letterSpacing: '2px', textTransform: 'uppercase',
                      cursor: date ? 'pointer' : 'not-allowed',
                    }}
                  >
                    Continue → Pick a Time
                  </motion.button>
                </div>
              </HoloCard>
            </motion.div>
          )}

          {step === 2 && !submitted && (
            <motion.div key="s2" custom={1} variants={slide} initial="enter" animate="center" exit="exit" transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}>
              <HoloCard accent="#00e5ff">
                <div style={{ padding: '36px 40px' }}>
                  <p style={{ color: '#00e5ff', fontSize: '11px', fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', marginBottom: 24 }}>🕐 Select Time Slot</p>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 28 }}>
                    {times.map(t => (
                      <TimeSlot key={t} label={t} selected={time === t} onClick={() => setTime(t)} />
                    ))}
                  </div>
                  <div style={{ display: 'flex', gap: 12 }}>
                    <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.96 }} onClick={() => setStep(1)}
                      style={{ flex: 1, padding: '14px', borderRadius: 14, border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: 'rgba(232,245,236,0.5)', fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '13px', cursor: 'pointer' }}>
                      ← Back
                    </motion.button>
                    <motion.button onClick={() => time && setStep(3)} disabled={!time}
                      whileHover={time ? { scale: 1.03, boxShadow: '0 0 32px rgba(0,229,255,0.3)' } : {}}
                      whileTap={time ? { scale: 0.96 } : {}}
                      style={{ flex: 2, padding: '14px', borderRadius: 14, background: time ? '#00e5ff' : 'rgba(0,229,255,0.08)', color: time ? '#060d0b' : 'rgba(232,245,236,0.2)', border: 'none', fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: '13px', letterSpacing: '1.5px', textTransform: 'uppercase', cursor: time ? 'pointer' : 'not-allowed' }}>
                      Your Details →
                    </motion.button>
                  </div>
                </div>
              </HoloCard>
            </motion.div>
          )}

          {step === 3 && !submitted && (
            <motion.div key="s3" custom={1} variants={slide} initial="enter" animate="center" exit="exit" transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}>
              <HoloCard accent="#ffca28">
                <div style={{ padding: '36px 40px' }}>
                  <p style={{ color: '#ffca28', fontSize: '11px', fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', marginBottom: 24 }}>👤 Your Details</p>

                  {/* Summary */}
                  <div style={{ display: 'flex', gap: 10, marginBottom: 28 }}>
                    {[`📅 ${date}`, `🕐 ${time}`].map((s, i) => (
                      <div key={i} style={{ flex: 1, padding: '10px 14px', borderRadius: 10, background: 'rgba(255,202,40,0.06)', border: '1px solid rgba(255,202,40,0.18)' }}>
                        <span style={{ color: 'rgba(232,245,236,0.5)', fontSize: '12px' }}>{s}</span>
                      </div>
                    ))}
                  </div>

                  <AnimInput label="Full Name" value={form.name} onChange={v => setForm(f => ({ ...f, name: v }))} placeholder="Raja Muhammad..." delay={0.05} />
                  <AnimInput label="Email" value={form.email} onChange={v => setForm(f => ({ ...f, email: v }))} placeholder="you@example.com" type="email" delay={0.1} />
                  <AnimInput label="WhatsApp (optional)" value={form.whatsapp} onChange={v => setForm(f => ({ ...f, whatsapp: v }))} placeholder="+92 300 000 0000" delay={0.15} />
                  <AnimInput label="Service Needed" value={form.service} onChange={v => setForm(f => ({ ...f, service: v }))} placeholder="Web Development, UI/UX, etc." delay={0.2} />

                  <motion.div initial={{ opacity: 0, x: -28 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} style={{ marginBottom: 28 }}>
                    <label style={{ display: 'block', color: 'rgba(232,245,236,0.35)', fontSize: '10px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: 8 }}>About Your Project</label>
                    <motion.textarea
                      value={form.reason}
                      onChange={e => setForm(f => ({ ...f, reason: e.target.value }))}
                      placeholder="Tell me about your project — what are you building?"
                      rows={4}
                      whileFocus={{ borderColor: '#ffca28', boxShadow: '0 0 20px rgba(255,202,40,0.15)' }}
                      style={{ width: '100%', padding: '14px 18px', borderRadius: 14, border: '1px solid rgba(255,202,40,0.15)', background: 'rgba(255,255,255,0.025)', color: '#e8f5ec', fontFamily: "'DM Sans', sans-serif", fontSize: '0.9rem', outline: 'none', resize: 'vertical', boxSizing: 'border-box' }}
                    />
                  </motion.div>

                  <div style={{ display: 'flex', gap: 12 }}>
                    <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.96 }} onClick={() => setStep(2)}
                      style={{ flex: 1, padding: '14px', borderRadius: 14, border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: 'rgba(232,245,236,0.5)', fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '13px', cursor: 'pointer' }}>
                      ← Back
                    </motion.button>
                    <motion.button onClick={handleSubmit} disabled={loading || !form.name || !form.email}
                      whileHover={(!loading && form.name && form.email) ? { scale: 1.03, boxShadow: '0 0 40px rgba(255,202,40,0.3)' } : {}}
                      whileTap={{ scale: 0.96 }}
                      style={{ flex: 2, padding: '14px', borderRadius: 14, background: (!loading && form.name && form.email) ? '#ffca28' : 'rgba(255,202,40,0.1)', color: (!loading && form.name && form.email) ? '#060d0b' : 'rgba(232,245,236,0.25)', border: 'none', fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: '13px', letterSpacing: '1.5px', textTransform: 'uppercase', cursor: (!loading && form.name && form.email) ? 'pointer' : 'not-allowed' }}>
                      {loading
                        ? <motion.span animate={{ opacity: [1, 0.5, 1] }} transition={{ duration: 1, repeat: Infinity }}>⏳ Confirming...</motion.span>
                        : '🚀 Confirm Booking'}
                    </motion.button>
                  </div>
                </div>
              </HoloCard>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}