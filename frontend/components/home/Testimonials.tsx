'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import Image from 'next/image';
import toast from 'react-hot-toast';

const FALLBACK_TESTIMONIALS = [
  {
    _id: 's1',
    quote: 'Working with RMAST was a game changer. The level of detail and execution is unmatched. Our platform is now lightning-fast and absolutely beautiful. Every feature we asked for was delivered beyond our expectations.',
    name: 'Sarah Ahmed',
    role: 'CEO',
    company: 'TechFlow',
    avatarInitials: 'SA',
    avatarImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=96&h=96&fit=crop&crop=face',
    accent: '#52b788',
    accentDim: 'rgba(82,183,136,0.12)',
    stars: 5,
    tag: 'Web Development',
    metric: '+240%',
    metricLabel: 'user engagement',
  },
  {
    _id: 's2',
    quote: 'The 3D animations he built increased our conversion rate by 40%. This is creative excellence meeting technical perfection. I have worked with many developers — RMAST operates on a completely different level.',
    name: 'James Okafor',
    role: 'Founder',
    company: 'LuxeStore',
    avatarInitials: 'JO',
    avatarImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=96&h=96&fit=crop&crop=face',
    accent: '#00e5ff',
    accentDim: 'rgba(0,229,255,0.10)',
    stars: 5,
    tag: '3D & UI/UX',
    metric: '+40%',
    metricLabel: 'conversion rate',
  },
  {
    _id: 's3',
    quote: 'Saved us 20+ hours per week with AI automation. Not only is he talented but he deeply understands business problems. A true partner who thinks about your growth, not just the task list.',
    name: 'Layla Hassan',
    role: 'Operations Lead',
    company: 'StartupX',
    avatarInitials: 'LH',
    avatarImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=96&h=96&fit=crop&crop=face',
    accent: '#ffca28',
    accentDim: 'rgba(255,202,40,0.10)',
    stars: 5,
    tag: 'AI Automations',
    metric: '20hr',
    metricLabel: 'saved per week',
  },
  {
    _id: 's4',
    quote: 'From wireframe to live product in 3 weeks. The admin dashboard alone was worth every penny — full CMS, booking system, leads management. We run our entire business through it now.',
    name: 'Omar Khalid',
    role: 'Director',
    company: 'Nexora Agency',
    avatarInitials: 'OK',
    avatarImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=96&h=96&fit=crop&crop=face',
    accent: '#76ff03',
    accentDim: 'rgba(118,255,3,0.08)',
    stars: 5,
    tag: 'Full Stack',
    metric: '3wk',
    metricLabel: 'zero to live',
  },
];

type Testimonial = typeof FALLBACK_TESTIMONIALS[0];

const SERVICE_TAGS = ['Web Development', 'UI/UX Design', '3D & Motion', 'AI Automation', 'Full Stack', 'Other'];

// ── Avatar Component ──────────────────────────────────────────────────────────
function Avatar({
  src,
  initials,
  accent,
  accentDim,
  size = 48,
}: {
  src?: string;
  initials: string;
  accent: string;
  accentDim: string;
  size?: number;
}) {
  const [imgError, setImgError] = useState(false);

  if (src && !imgError) {
    return (
      <div
        style={{
          width: size,
          height: size,
          borderRadius: '50%',
          overflow: 'hidden',
          border: `2px solid ${accent}44`,
          flexShrink: 0,
          position: 'relative',
        }}
      >
        <Image
          src={src}
          alt={initials}
          width={size}
          height={size}
          style={{ objectFit: 'cover', width: '100%', height: '100%' }}
          onError={() => setImgError(true)}
          unoptimized
        />
      </div>
    );
  }

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: `linear-gradient(135deg, ${accentDim}, rgba(0,0,0,0.4))`,
        border: `2px solid ${accent}44`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'Syne', sans-serif",
        fontWeight: 800,
        fontSize: size * 0.29,
        color: accent,
        flexShrink: 0,
      }}
    >
      {initials}
    </div>
  );
}

// ── Drag & Drop Image Uploader ────────────────────────────────────────────────
function ImageDropzone({
  value,
  onChange,
}: {
  value: string;
  onChange: (dataUrl: string) => void;
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const processFile = (file: File) => {
    setError('');
    if (!file.type.startsWith('image/')) {
      setError('Only image files are accepted.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be under 5 MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        onChange(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div style={{ width: '100%' }}>
      {value ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{
            position: 'relative',
            width: 90,
            height: 90,
            borderRadius: '50%',
            overflow: 'visible',
          }}
        >
          <div
            style={{
              width: 90,
              height: 90,
              borderRadius: '50%',
              overflow: 'hidden',
              border: '3px solid rgba(82,183,136,0.5)',
              boxShadow: '0 0 24px rgba(82,183,136,0.25)',
            }}
          >
            <img
              src={value}
              alt="Preview"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
          <motion.button
            type="button"
            onClick={handleRemove}
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.9 }}
            style={{
              position: 'absolute',
              top: -4,
              right: -4,
              width: 26,
              height: 26,
              borderRadius: '50%',
              background: '#ff6b6b',
              border: '2px solid rgba(11,15,14,0.9)',
              color: '#fff',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              lineHeight: 1,
            }}
          >
            ×
          </motion.button>
        </motion.div>
      ) : (
        <motion.div
          onClick={() => inputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          animate={{
            borderColor: isDragging ? 'rgba(82,183,136,0.8)' : 'rgba(82,183,136,0.2)',
            background: isDragging ? 'rgba(82,183,136,0.07)' : 'rgba(232,245,236,0.02)',
          }}
          style={{
            width: '100%',
            padding: '28px 20px',
            borderRadius: '16px',
            border: '1.5px dashed rgba(82,183,136,0.3)',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '10px',
            transition: 'all 0.2s',
            userSelect: 'none',
          }}
        >
          <motion.div
            animate={{ y: isDragging ? -6 : 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            style={{
              width: 48,
              height: 48,
              borderRadius: '50%',
              background: 'rgba(82,183,136,0.08)',
              border: '1px solid rgba(82,183,136,0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '22px',
            }}
          >
            {isDragging ? '⬇' : '📷'}
          </motion.div>

          <div style={{ textAlign: 'center' }}>
            <p
              style={{
                color: isDragging ? '#52b788' : 'rgba(232,245,236,0.6)',
                fontSize: '13px',
                fontWeight: 600,
                margin: '0 0 4px',
                letterSpacing: '0.3px',
                transition: 'color 0.2s',
              }}
            >
              {isDragging ? 'Drop your photo here' : 'Drag & drop your photo'}
            </p>
            <p style={{ color: 'rgba(232,245,236,0.25)', fontSize: '11px', margin: 0 }}>
              or <span style={{ color: '#52b788', textDecoration: 'underline' }}>click to browse</span> · JPG, PNG, WEBP · max 5 MB
            </p>
          </div>

          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            onChange={handleFileInput}
            style={{ display: 'none' }}
          />
        </motion.div>
      )}

      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            style={{
              color: '#ff6b6b',
              fontSize: '11px',
              marginTop: '8px',
              padding: '8px 12px',
              background: 'rgba(255,107,107,0.07)',
              borderRadius: '8px',
              border: '1px solid rgba(255,107,107,0.2)',
            }}
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── 3D Tilt Card ─────────────────────────────────────────────────────────────
function TestimonialCard({ t, isActive }: { t: Testimonial; isActive: boolean }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const sp = { stiffness: 180, damping: 22 };
  const rotateX = useSpring(useTransform(rawY, [-0.5, 0.5], [8, -8]), sp);
  const rotateY = useSpring(useTransform(rawX, [-0.5, 0.5], [-8, 8]), sp);
  const glareX  = useSpring(useTransform(rawX, [-0.5, 0.5], [15, 85]), sp);
  const glareY  = useSpring(useTransform(rawY, [-0.5, 0.5], [15, 85]), sp);

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    rawX.set((e.clientX - rect.left) / rect.width - 0.5);
    rawY.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMove}
      onMouseLeave={() => { rawX.set(0); rawY.set(0); }}
      style={{
        rotateX: isActive ? rotateX : 0,
        rotateY: isActive ? rotateY : 0,
        transformStyle: 'preserve-3d',
        position: 'relative',
        borderRadius: '24px',
        background: 'rgba(11,15,14,0.85)',
        border: `1px solid ${t.accent}28`,
        backdropFilter: 'blur(16px)',
        padding: '48px 44px',
        overflow: 'hidden',
        cursor: 'crosshair',
        boxShadow: isActive
          ? `0 40px 100px rgba(0,0,0,0.6), 0 0 0 1px ${t.accent}18, 0 0 60px ${t.accentDim}`
          : 'none',
      }}
    >
      {/* Glare */}
      {isActive && (
        <motion.div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 3,
          background: useTransform([glareX, glareY], ([gx, gy]: number[]) =>
            `radial-gradient(circle at ${gx}% ${gy}%, rgba(255,255,255,0.08) 0%, transparent 55%)`),
        }} />
      )}

      {/* Top accent bar */}
      <div style={{
        position: 'absolute', top: 0, left: 0, width: '80px', height: '3px',
        background: `linear-gradient(90deg, ${t.accent}, transparent)`,
      }} />

      {/* Bloom */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: `radial-gradient(ellipse 90% 60% at 50% 120%, ${t.accentDim}, transparent 65%)`,
      }} />

      {/* Scan line */}
      {isActive && (
        <motion.div
          animate={{ y: ['0%', '100%'], opacity: [0, 0.45, 0] }}
          transition={{ duration: 2.5, ease: 'linear', repeat: Infinity, repeatDelay: 2 }}
          style={{
            position: 'absolute', left: 0, right: 0, height: '2px',
            background: `linear-gradient(90deg, transparent, ${t.accent}, transparent)`,
            zIndex: 4, pointerEvents: 'none',
          }}
        />
      )}

      {/* Giant quote mark */}
      <div style={{
        position: 'absolute', top: 20, right: 32,
        fontFamily: 'Georgia, serif', fontSize: '140px', lineHeight: 1,
        color: t.accent, opacity: 0.06, pointerEvents: 'none', userSelect: 'none', fontWeight: 900,
      }}>"</div>

      <div style={{ position: 'relative', zIndex: 2 }}>
        {/* Tag + stars */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: t.accentDim, border: `1px solid ${t.accent}30`,
            padding: '5px 14px', borderRadius: '100px',
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: t.accent, flexShrink: 0 }} />
            <span style={{ color: t.accent, fontSize: '11px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase' }}>
              {t.tag}
            </span>
          </div>
          <div style={{ display: 'flex', gap: '3px' }}>
            {Array.from({ length: t.stars }).map((_, i) => (
              <motion.span key={i}
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: i * 0.08 + 0.2, type: 'spring', stiffness: 400 }}
                style={{ color: '#ffca28', fontSize: '14px' }}
              >★</motion.span>
            ))}
          </div>
        </div>

        {/* Quote */}
        <p style={{ color: 'rgba(232,245,236,0.85)', fontSize: '1.05rem', lineHeight: 1.8, fontStyle: 'italic', marginBottom: '36px', letterSpacing: '0.01em' }}>
          &ldquo;{t.quote}&rdquo;
        </p>

        {/* Divider */}
        <div style={{ height: '1px', background: `linear-gradient(90deg, ${t.accent}44, transparent)`, marginBottom: '28px' }} />

        {/* Author row with real photo */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>

            {/* ── Person image / initials fallback ── */}
            <Avatar
              src={t.avatarImage}
              initials={t.avatarInitials}
              accent={t.accent}
              accentDim={t.accentDim}
              size={52}
            />

            <div>
              <p style={{
                color: '#e8f5ec', fontWeight: 700, fontSize: '1rem',
                margin: '0 0 3px', fontFamily: "'Syne', sans-serif",
              }}>
                {t.name}
              </p>
              <p style={{ color: 'rgba(232,245,236,0.45)', fontSize: '0.82rem', margin: 0 }}>
                {t.role}, {t.company}
              </p>
            </div>
          </div>

          {t.metric && (
            <div style={{ textAlign: 'right' }}>
              <p style={{
                fontFamily: "'Syne', sans-serif", fontSize: '1.8rem',
                fontWeight: 800, color: t.accent, margin: '0 0 2px', lineHeight: 1,
              }}>
                {t.metric}
              </p>
              <p style={{
                color: 'rgba(232,245,236,0.35)', fontSize: '10px',
                textTransform: 'uppercase', letterSpacing: '1.5px', margin: 0,
              }}>
                {t.metricLabel}
              </p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ── Star Picker ───────────────────────────────────────────────────────────────
function StarPicker({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div style={{ display: 'flex', gap: '6px' }}>
      {[1, 2, 3, 4, 5].map(n => (
        <motion.button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          onMouseEnter={() => setHovered(n)}
          onMouseLeave={() => setHovered(0)}
          whileTap={{ scale: 0.85 }}
          style={{
            background: 'none', border: 'none', cursor: 'pointer', padding: '2px',
            fontSize: '28px',
            color: n <= (hovered || value) ? '#ffca28' : 'rgba(232,245,236,0.15)',
            filter: n <= (hovered || value) ? 'drop-shadow(0 0 6px #ffca28)' : 'none',
            transition: 'color 0.15s, filter 0.15s',
          }}
        >★</motion.button>
      ))}
    </div>
  );
}

// ── Submit Form ───────────────────────────────────────────────────────────────
function SubmitForm({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const [form, setForm] = useState({
    name: '',
    role: '',
    company: '',
    quote: '',
    tag: SERVICE_TAGS[0],
    metric: '',
    metricLabel: '',
    stars: 5,
    avatarImage: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');

  const set = (k: string, v: string | number) => setForm(f => ({ ...f, [k]: v }));

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '13px 16px',
    borderRadius: '12px',
    background: 'rgba(232,245,236,0.04)',
    border: '1px solid rgba(82,183,136,0.2)',
    color: '#e8f5ec',
    fontSize: '0.9rem',
    outline: 'none',
    fontFamily: 'inherit',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s',
  };

  const labelStyle: React.CSSProperties = {
    color: 'rgba(232,245,236,0.45)',
    fontSize: '11px',
    fontWeight: 700,
    letterSpacing: '2px',
    textTransform: 'uppercase',
    display: 'block',
    marginBottom: '8px',
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.role || !form.company || !form.quote) {
      setError('Please fill in all required fields.');
      return;
    }
    if (form.quote.length < 20) {
      setError('Quote must be at least 20 characters.');
      return;
    }
    setStatus('loading');
    setError('');

    try {
      const res = await fetch('/api/testimonials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ error: 'Submission failed' }));
        throw new Error(errorData.error || 'Submission failed');
      }
      setStatus('success');
      setTimeout(() => { onSuccess(); onClose(); }, 2200);
    } catch (err: unknown) {
      setStatus('error');
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed', inset: 0, zIndex: 100,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '20px',
        background: 'rgba(7,11,10,0.85)', backdropFilter: 'blur(12px)',
      }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <motion.div
        initial={{ opacity: 0, y: 60, scale: 0.92 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 40, scale: 0.95 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '600px',
          maxHeight: '90vh',
          overflowY: 'auto',
          borderRadius: '24px',
          background: 'rgba(11,15,14,0.97)',
          border: '1px solid rgba(82,183,136,0.2)',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 40px 100px rgba(0,0,0,0.7), 0 0 60px rgba(82,183,136,0.08)',
        }}
      >
        {/* Top accent bar */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '3px',
          background: 'linear-gradient(90deg, #52b788, #00e5ff, transparent)',
          borderRadius: '24px 24px 0 0',
        }} />

        {/* Bloom */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none', borderRadius: '24px',
          background: 'radial-gradient(ellipse 80% 50% at 50% 110%, rgba(82,183,136,0.08), transparent 65%)',
        }} />

        <div style={{ padding: '44px 40px', position: 'relative', zIndex: 1 }}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '36px' }}>
            <div>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                background: 'rgba(82,183,136,0.07)', border: '1px solid rgba(82,183,136,0.2)',
                padding: '5px 14px', borderRadius: '100px', marginBottom: '16px',
              }}>
                <span style={{
                  width: 6, height: 6, borderRadius: '50%',
                  background: '#52b788', boxShadow: '0 0 6px #52b788',
                  animation: 'pulseDot 1.8s ease infinite',
                }} />
                <span style={{ color: '#52b788', fontSize: '10px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase' }}>
                  Share Your Experience
                </span>
              </div>
              <h3 style={{
                fontFamily: "'Syne', sans-serif", color: '#e8f5ec',
                fontSize: '1.8rem', fontWeight: 800, margin: 0, letterSpacing: '-0.5px',
              }}>
                Leave a{' '}
                <span style={{
                  background: 'linear-gradient(90deg, #52b788, #00e5ff)',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                }}>
                  Review
                </span>
              </h3>
            </div>
            <motion.button
              onClick={onClose}
              whileHover={{ scale: 1.1, background: 'rgba(232,245,236,0.1)' }}
              whileTap={{ scale: 0.9 }}
              style={{
                width: 38, height: 38, borderRadius: '50%',
                border: '1px solid rgba(232,245,236,0.12)',
                background: 'rgba(0,0,0,0)', color: 'rgba(232,245,236,0.5)',
                fontSize: '18px', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}
            >×</motion.button>
          </div>

          {status === 'success' ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{ textAlign: 'center', padding: '40px 0' }}
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1], rotate: [0, 10, 0] }}
                transition={{ duration: 0.6 }}
                style={{ fontSize: '56px', marginBottom: '24px' }}
              >🎉</motion.div>
              <h4 style={{
                fontFamily: "'Syne', sans-serif", color: '#52b788',
                fontSize: '1.4rem', fontWeight: 800, marginBottom: '12px',
              }}>
                Thank You!
              </h4>
              <p style={{ color: 'rgba(232,245,236,0.55)', lineHeight: 1.7, maxWidth: '340px', margin: '0 auto' }}>
                Your review has been submitted and will appear after a quick review. We appreciate your feedback!
              </p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

              {/* ── Profile Photo Upload ── */}
              <div>
                <label style={{ ...labelStyle, marginBottom: '12px' }}>
                  Profile Photo{' '}
                  <span style={{ color: 'rgba(232,245,236,0.25)', textTransform: 'none', letterSpacing: 0, fontSize: '11px' }}>
                    (optional)
                  </span>
                </label>

                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                  {/* Live preview */}
                  <div style={{ flexShrink: 0 }}>
                    <Avatar
                      src={form.avatarImage}
                      initials={form.name ? form.name.slice(0, 2).toUpperCase() : 'YO'}
                      accent="#52b788"
                      accentDim="rgba(82,183,136,0.12)"
                      size={64}
                    />
                    <p style={{
                      color: 'rgba(232,245,236,0.2)', fontSize: '10px',
                      textAlign: 'center', marginTop: '6px', letterSpacing: '0.5px',
                    }}>
                      preview
                    </p>
                  </div>

                  {/* Drop zone */}
                  <div style={{ flex: 1 }}>
                    <ImageDropzone
                      value={form.avatarImage}
                      onChange={(dataUrl) => set('avatarImage', dataUrl)}
                    />
                  </div>
                </div>
              </div>

              {/* Separator */}
              <div style={{
                height: '1px',
                background: 'linear-gradient(90deg, transparent, rgba(82,183,136,0.15), transparent)',
              }} />

              {/* Name + Role row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={labelStyle}>Name *</label>
                  <input
                    style={inputStyle}
                    placeholder="Sarah Ahmed"
                    value={form.name}
                    onChange={e => set('name', e.target.value)}
                    onFocus={e => (e.target.style.borderColor = 'rgba(82,183,136,0.6)')}
                    onBlur={e => (e.target.style.borderColor = 'rgba(82,183,136,0.2)')}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Role *</label>
                  <input
                    style={inputStyle}
                    placeholder="CEO"
                    value={form.role}
                    onChange={e => set('role', e.target.value)}
                    onFocus={e => (e.target.style.borderColor = 'rgba(82,183,136,0.6)')}
                    onBlur={e => (e.target.style.borderColor = 'rgba(82,183,136,0.2)')}
                  />
                </div>
              </div>

              {/* Company */}
              <div>
                <label style={labelStyle}>Company *</label>
                <input
                  style={inputStyle}
                  placeholder="TechFlow Inc."
                  value={form.company}
                  onChange={e => set('company', e.target.value)}
                  onFocus={e => (e.target.style.borderColor = 'rgba(82,183,136,0.6)')}
                  onBlur={e => (e.target.style.borderColor = 'rgba(82,183,136,0.2)')}
                />
              </div>

              {/* Service Tag */}
              <div>
                <label style={labelStyle}>Service Used *</label>
                <select
                  style={{ ...inputStyle, cursor: 'pointer' }}
                  value={form.tag}
                  onChange={e => set('tag', e.target.value)}
                  onFocus={e => (e.target.style.borderColor = 'rgba(82,183,136,0.6)')}
                  onBlur={e => (e.target.style.borderColor = 'rgba(82,183,136,0.2)')}
                >
                  {SERVICE_TAGS.map(t => (
                    <option key={t} value={t} style={{ background: '#0b0f0e' }}>{t}</option>
                  ))}
                </select>
              </div>

              {/* Stars */}
              <div>
                <label style={labelStyle}>Rating *</label>
                <StarPicker value={form.stars} onChange={n => set('stars', n)} />
              </div>

              {/* Quote */}
              <div>
                <label style={labelStyle}>Your Review *</label>
                <textarea
                  style={{ ...inputStyle, minHeight: '120px', resize: 'vertical', lineHeight: 1.7 }}
                  placeholder="Share your experience working with RMAST..."
                  value={form.quote}
                  onChange={e => set('quote', e.target.value)}
                  onFocus={e => (e.target.style.borderColor = 'rgba(82,183,136,0.6)')}
                  onBlur={e => (e.target.style.borderColor = 'rgba(82,183,136,0.2)')}
                />
                <p style={{ color: 'rgba(232,245,236,0.2)', fontSize: '11px', marginTop: '6px', letterSpacing: '0.5px' }}>
                  {form.quote.length} / 500 characters
                </p>
              </div>

              {/* Optional metric */}
              <div>
                <label style={{ ...labelStyle, marginBottom: '4px' }}>
                  Result Metric{' '}
                  <span style={{ color: 'rgba(232,245,236,0.25)' }}>(optional)</span>
                </label>
                <p style={{ color: 'rgba(232,245,236,0.3)', fontSize: '11px', marginBottom: '10px', letterSpacing: '0.3px' }}>
                  Add a key result number that will display on your card
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <input
                    style={inputStyle}
                    placeholder="+40%"
                    value={form.metric}
                    onChange={e => set('metric', e.target.value)}
                    onFocus={e => (e.target.style.borderColor = 'rgba(82,183,136,0.6)')}
                    onBlur={e => (e.target.style.borderColor = 'rgba(82,183,136,0.2)')}
                  />
                  <input
                    style={inputStyle}
                    placeholder="conversion rate"
                    value={form.metricLabel}
                    onChange={e => set('metricLabel', e.target.value)}
                    onFocus={e => (e.target.style.borderColor = 'rgba(82,183,136,0.6)')}
                    onBlur={e => (e.target.style.borderColor = 'rgba(82,183,136,0.2)')}
                  />
                </div>
              </div>

              {/* Error */}
              <AnimatePresence>
                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    style={{
                      color: '#ff6b6b', fontSize: '13px', padding: '12px 16px',
                      background: 'rgba(255,107,107,0.08)', border: '1px solid rgba(255,107,107,0.2)',
                      borderRadius: '10px', margin: 0,
                    }}
                  >
                    {error}
                  </motion.p>
                )}
              </AnimatePresence>

              {/* Submit */}
              <motion.button
                type="submit"
                disabled={status === 'loading'}
                whileHover={{ scale: status === 'loading' ? 1 : 1.02, boxShadow: '0 0 40px rgba(82,183,136,0.35)' }}
                whileTap={{ scale: 0.97 }}
                style={{
                  padding: '16px 32px', borderRadius: '100px', border: 'none',
                  background: status === 'loading'
                    ? 'rgba(82,183,136,0.3)'
                    : 'linear-gradient(135deg, #52b788, #2d6a4f)',
                  color: '#0b0f0e', fontWeight: 800, fontSize: '0.95rem',
                  fontFamily: "'Syne', sans-serif", letterSpacing: '0.5px',
                  cursor: status === 'loading' ? 'not-allowed' : 'pointer',
                  position: 'relative', overflow: 'hidden', marginTop: '4px',
                }}
              >
                {status === 'loading' ? (
                  <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                      style={{
                        display: 'inline-block', width: 16, height: 16,
                        border: '2px solid #0b0f0e', borderTopColor: 'transparent', borderRadius: '50%',
                      }}
                    />
                    Submitting...
                  </span>
                ) : (
                  <>
                    <motion.span
                      animate={{ x: ['-100%', '200%'] }}
                      transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 2 }}
                      style={{
                        position: 'absolute', inset: 0,
                        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                        pointerEvents: 'none',
                      }}
                    />
                    Submit Review →
                  </>
                )}
              </motion.button>
            </form>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Main Section ──────────────────────────────────────────────────────────────
export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(FALLBACK_TESTIMONIALS);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const total = testimonials.length;

  const refetchTestimonials = useCallback(async () => {
    setFetchLoading(true);
    try {
      const res = await fetch('/api/testimonials?approved=true');
      if (!res.ok) {
        return; // silently fail, keep using fallback testimonials
      }
      const data = await res.json();
      const list = data.data?.testimonials || data.data;
      if (data.success && Array.isArray(list) && list.length > 0) {
        const mapped = list.map((t: any, i: number) => ({
          _id: t._id || `live-${i}`,
          quote: t.quote,
          name: t.name,
          role: t.company ? `${t.role}, ${t.company}` : t.role,
          company: t.company || '',
          avatarInitials: t.avatar || (t.name ? t.name.slice(0, 2).toUpperCase() : 'NN'),
          avatarImage: t.avatarImage || '',
          accent: t.accent || FALLBACK_TESTIMONIALS[i % FALLBACK_TESTIMONIALS.length].accent,
          accentDim: t.accentDim || FALLBACK_TESTIMONIALS[i % FALLBACK_TESTIMONIALS.length].accentDim,
          stars: t.rating || 5,
          tag: t.service || 'Other',
          metric: t.metric || '',
          metricLabel: t.metricLabel || '',
        }));
        setTestimonials(mapped);
      }
    } catch (error) {
      console.error('Failed to fetch testimonials:', error);
    } finally {
      setFetchLoading(false);
    }
  }, []);

  useEffect(() => {
    refetchTestimonials();
  }, [refetchTestimonials]);

  // Auto-rotate
  useEffect(() => {
    if (showForm) return;
    const id = setInterval(() => {
      setDirection(1);
      setActive(a => (a + 1) % total);
    }, 4500);
    return () => clearInterval(id);
  }, [total, showForm]);

  const goTo = useCallback((i: number) => {
    setDirection(i > active ? 1 : -1);
    setActive(i);
  }, [active]);

  const variants = {
    enter:  (d: number) => ({ opacity: 0, x: d * 80,  scale: 0.92, rotateY: d * 12 }),
    center:              ({ opacity: 1, x: 0,       scale: 1,    rotateY: 0 }),
    exit:   (d: number) => ({ opacity: 0, x: d * -80, scale: 0.92, rotateY: d * -12 }),
  };

  const t = testimonials[active] ?? testimonials[0];

  return (
    <>
      <section style={{ padding: '9rem 6vw', background: '#0b0f0e', position: 'relative', overflow: 'hidden' }}>

        {/* Grid bg */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage: `
            linear-gradient(rgba(82,183,136,0.022) 1px, transparent 1px),
            linear-gradient(90deg, rgba(82,183,136,0.022) 1px, transparent 1px)
          `,
          backgroundSize: '64px 64px',
        }} />

        {/* Animated ambient bg */}
        {t && (
          <motion.div
            animate={{ background: [
              `radial-gradient(ellipse 60% 50% at 30% 50%, ${t.accentDim}, transparent 65%)`,
              `radial-gradient(ellipse 60% 50% at 70% 50%, ${t.accentDim}, transparent 65%)`,
            ]}}
            transition={{ duration: 4, ease: 'easeInOut', repeat: Infinity, repeatType: 'reverse' }}
            style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
          />
        )}

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 48 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
          style={{ textAlign: 'center', marginBottom: '5rem', position: 'relative', zIndex: 1 }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.7 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '10px',
              background: 'rgba(82,183,136,0.07)', border: '1px solid rgba(82,183,136,0.2)',
              padding: '7px 20px', borderRadius: '100px', marginBottom: '28px',
            }}
          >
            <span style={{
              width: 7, height: 7, borderRadius: '50%', background: '#52b788',
              boxShadow: '0 0 8px #52b788', animation: 'pulseDot 1.8s ease infinite', flexShrink: 0,
            }} />
            <span style={{ color: '#52b788', fontSize: '11px', fontWeight: 700, letterSpacing: '2.5px', textTransform: 'uppercase' }}>
              Testimonials
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            style={{
              fontFamily: "'Syne', sans-serif", color: '#e8f5ec',
              fontSize: 'clamp(2.2rem, 5.5vw, 4rem)', fontWeight: 800,
              letterSpacing: '-1.5px', lineHeight: 1.05, marginBottom: '16px',
            }}
          >
            What Clients{' '}
            <span style={{
              background: 'linear-gradient(90deg, #52b788, #ffca28)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>
              Say
            </span>
          </motion.h2>

          <p style={{ color: 'rgba(232,245,236,0.4)', fontSize: '1rem', marginBottom: '0' }}>
            Real words from real partners.
          </p>
        </motion.div>

        {/* Carousel */}
        <div style={{ maxWidth: '820px', margin: '0 auto', position: 'relative', zIndex: 1 }}>

          {/* Name tabs */}
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '36px', flexWrap: 'wrap' }}>
            {testimonials.map((item, i) => (
              <motion.button
                key={item._id}
                onClick={() => goTo(i)}
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  padding: '8px 20px', borderRadius: '100px',
                  border: `1px solid ${i === active ? item.accent : 'rgba(255,255,255,0.08)'}`,
                  background: i === active ? item.accentDim : 'rgba(0,0,0,0)',
                  color: i === active ? item.accent : 'rgba(232,245,236,0.35)',
                  fontSize: '12px', fontWeight: 700, cursor: 'pointer',
                  letterSpacing: '1px', textTransform: 'uppercase',
                  transition: 'all 0.3s',
                  display: 'flex', alignItems: 'center', gap: '8px',
                }}
              >
                {/* Mini avatar in tab */}
                {item.avatarImage ? (
                  <div style={{
                    width: 20, height: 20, borderRadius: '50%', overflow: 'hidden',
                    flexShrink: 0, opacity: i === active ? 1 : 0.5,
                    transition: 'opacity 0.3s',
                  }}>
                    <img
                      src={item.avatarImage}
                      alt={item.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                ) : (
                  <div style={{
                    width: 20, height: 20, borderRadius: '50%',
                    background: i === active ? item.accentDim : 'rgba(255,255,255,0.06)',
                    border: `1px solid ${i === active ? item.accent + '44' : 'transparent'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '8px', fontWeight: 800,
                    color: i === active ? item.accent : 'rgba(232,245,236,0.3)',
                    flexShrink: 0,
                  }}>
                    {item.avatarInitials.slice(0, 1)}
                  </div>
                )}
                {item.name.split(' ')[0]}
              </motion.button>
            ))}
          </div>

          {/* Card */}
          <div style={{ position: 'relative', perspective: '1200px' }}>
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={active}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                style={{ transformStyle: 'preserve-3d' }}
              >
                {t && <TestimonialCard t={t} isActive />}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Nav row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '36px', justifyContent: 'center' }}>
            <motion.button
              onClick={() => goTo((active - 1 + total) % total)}
              whileHover={{ scale: 1.12, borderColor: t?.accent }}
              whileTap={{ scale: 0.9 }}
              style={{
                width: 42, height: 42, borderRadius: '50%',
                border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(0,0,0,0)',
                color: 'rgba(232,245,236,0.6)', fontSize: '16px', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'border-color 0.2s',
              }}
            >←</motion.button>

            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              {testimonials.map((item, i) => (
                <motion.button
                  key={item._id}
                  onClick={() => goTo(i)}
                  animate={{
                    width: i === active ? 32 : 8,
                    background: i === active ? item.accent : 'rgba(255,255,255,0.15)',
                  }}
                  transition={{ duration: 0.35 }}
                  style={{ height: 8, borderRadius: '4px', border: 'none', cursor: 'pointer' }}
                />
              ))}
            </div>

            <motion.button
              onClick={() => goTo((active + 1) % total)}
              whileHover={{ scale: 1.12, borderColor: t?.accent }}
              whileTap={{ scale: 0.9 }}
              style={{
                width: 42, height: 42, borderRadius: '50%',
                border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(0,0,0,0)',
                color: 'rgba(232,245,236,0.6)', fontSize: '16px', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'border-color 0.2s',
              }}
            >→</motion.button>
          </div>

          {/* Progress bar */}
          <div style={{ height: '2px', background: 'rgba(255,255,255,0.06)', borderRadius: '2px', marginTop: '20px', overflow: 'hidden' }}>
            <motion.div
              key={active}
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: 4.5, ease: 'linear' }}
              style={{ height: '100%', background: t?.accent ?? '#52b788', borderRadius: '2px' }}
            />
          </div>
          <p style={{ textAlign: 'center', color: 'rgba(232,245,236,0.2)', fontSize: '11px', marginTop: '10px', letterSpacing: '1px' }}>
            {active + 1} / {total}
          </p>
        </div>

        {/* ── Leave a Review CTA ── */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          style={{ textAlign: 'center', marginTop: '5rem', position: 'relative', zIndex: 1 }}
        >
          <div style={{
            display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: '16px',
            padding: '40px 52px', borderRadius: '24px',
            background: 'rgba(11,15,14,0.6)', border: '1px solid rgba(82,183,136,0.12)',
            backdropFilter: 'blur(12px)',
          }}>
            <p style={{ color: 'rgba(232,245,236,0.45)', fontSize: '0.92rem', margin: 0 }}>
              Worked with me? I&apos;d love to hear from you.
            </p>
            <motion.button
              onClick={() => setShowForm(true)}
              whileHover={{ scale: 1.04, boxShadow: '0 0 40px rgba(82,183,136,0.35)' }}
              whileTap={{ scale: 0.97 }}
              style={{
                padding: '14px 36px', borderRadius: '100px', border: 'none',
                background: 'linear-gradient(135deg, #52b788, #2d6a4f)',
                color: '#0b0f0e', fontWeight: 800, fontSize: '0.9rem',
                fontFamily: "'Syne', sans-serif", letterSpacing: '0.5px',
                cursor: 'pointer', position: 'relative', overflow: 'hidden',
              }}
            >
              <motion.span
                animate={{ x: ['-100%', '200%'] }}
                transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 3 }}
                style={{
                  position: 'absolute', inset: 0,
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                  pointerEvents: 'none',
                }}
              />
              ✦ Leave a Review
            </motion.button>

            {submitted && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{ color: '#52b788', fontSize: '13px', fontWeight: 600, margin: 0 }}
              >
                ✓ Review submitted — thank you! It will appear after review.
              </motion.p>
            )}
          </div>
        </motion.div>

      </section>

      {/* Form modal */}
      <AnimatePresence>
        {showForm && (
          <SubmitForm
            onClose={() => setShowForm(false)}
            onSuccess={() => { setSubmitted(true); setTimeout(() => setSubmitted(false), 6000); }}
          />
        )}
      </AnimatePresence>

      <style>{`
        @keyframes pulseDot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.35; transform: scale(1.6); }
        }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(82,183,136,0.3); border-radius: 4px; }
      `}</style>
    </>
  );
}