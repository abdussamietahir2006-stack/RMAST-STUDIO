'use client';

import Link from 'next/link';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaGithub, FaTwitter } from 'react-icons/fa';

// ── Magnetic Social Button ────────────────────────────────────────────────────
function MagneticSocial({ Icon, href, label }: { Icon: React.ElementType; href: string; label: string }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 350, damping: 20 });
  const sy = useSpring(y, { stiffness: 350, damping: 20 });
  const [hov, setHov] = useState(false);

  const handleMove = (e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set((e.clientX - rect.left - rect.width / 2) * 0.4);
    y.set((e.clientY - rect.top - rect.height / 2) * 0.4);
  };
  const handleLeave = () => { x.set(0); y.set(0); setHov(false); };

  return (
    <motion.a
      ref={ref}
      href={href}
      aria-label={label}
      target="_blank" rel="noreferrer"
      onMouseMove={handleMove}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={handleLeave}
      style={{ x: sx, y: sy, display: 'inline-flex' }}
    >
      <motion.div
        animate={{
          background: hov ? 'rgba(82,183,136,0.15)' : 'rgba(255,255,255,0.04)',
          borderColor: hov ? 'rgba(82,183,136,0.5)' : 'rgba(255,255,255,0.1)',
          boxShadow: hov ? '0 0 24px rgba(82,183,136,0.3)' : '0 0 0 rgba(0,0,0,0)',
        }}
        transition={{ duration: 0.2 }}
        style={{
          width: 44, height: 44, borderRadius: '50%',
          border: '1px solid rgba(255,255,255,0.1)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer',
        }}
      >
        <motion.div animate={{ color: hov ? '#52b788' : 'rgba(232,245,236,0.45)', scale: hov ? 1.2 : 1 }} transition={{ duration: 0.2 }}>
          <Icon size={16} />
        </motion.div>
      </motion.div>
    </motion.a>
  );
}

// ── Animated footer link ──────────────────────────────────────────────────────
function FooterLink({ href, label }: { href: string; label: string }) {
  const [hov, setHov] = useState(false);
  return (
    <Link href={href}>
      <motion.span
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}
      >
        <motion.span
          animate={{ width: hov ? 14 : 0, opacity: hov ? 1 : 0 }}
          transition={{ duration: 0.2 }}
          style={{ display: 'inline-block', height: '1px', background: '#52b788', borderRadius: '2px', flexShrink: 0 }}
        />
        <motion.span
          animate={{ color: hov ? '#52b788' : 'rgba(232,245,236,0.45)', x: hov ? 4 : 0 }}
          transition={{ duration: 0.22 }}
          style={{ fontSize: '0.88rem', fontWeight: 500 }}
        >
          {label}
        </motion.span>
      </motion.span>
    </Link>
  );
}

// ── Main Footer ───────────────────────────────────────────────────────────────
export default function Footer({ data = {} }: { data?: Record<string, string> }) {
  const year = new Date().getFullYear();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth < 768);
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  // CMS variables with fallbacks
  const logo = data.logo || 'RMAST';
  const tagline = data.tagline || 'Raja Muhammad Abdussamie Tahir';
  const description = data.description || 'Crafting bold digital experiences — combining design, development, and AI automation into one seamless system.';
  const email = data.email || 'abdu.ssamietahir2006@gmail.com';
  const phone = data.phone || '+92 316 531 9973';
  const location = data.location || 'Pakistan (Remote Worldwide)';
  const copyright = data.copyright || 'RMAST — Raja Muhammad Abdussamie Tahir.';

  // Links
  const quickLinks = [
    { label: data.link1Label || 'Home', href: data.link1Href || '/' },
    { label: data.link2Label || 'About', href: data.link2Href || '/about' },
    { label: data.link3Label || 'Services', href: data.link3Href || '/services' },
    { label: data.link4Label || 'Projects', href: data.link4Href || '/projects' },
    { label: data.link5Label || 'Contact', href: data.link5Href || '/contact' },
  ];

  // Socials
  const githubUrl    = data.githubUrl    || 'https://github.com';
  const linkedinUrl  = data.linkedinUrl  || 'https://linkedin.com';
  const instagramUrl = data.instagramUrl || 'https://instagram.com';
  const twitterUrl   = data.twitterUrl   || 'https://twitter.com';
  const facebookUrl  = data.facebookUrl  || 'https://facebook.com';

  return (
    <footer style={{ background: '#070b0a', position: 'relative', overflow: 'hidden', borderTop: '1px solid rgba(82,183,136,0.08)' }}>

      {/* Ambient glow */}
      <div style={{
        position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
        width: 800, height: 400, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(82,183,136,0.06) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Grid texture */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: `linear-gradient(rgba(82,183,136,0.018) 1px, transparent 1px), linear-gradient(90deg, rgba(82,183,136,0.018) 1px, transparent 1px)`,
        backgroundSize: '60px 60px',
      }} />

      {/* ── CTA Banner ── */}
      <div style={{ position: 'relative', zIndex: 1, padding: isMobile ? '60px 6vw' : '80px 6vw', borderBottom: '1px solid rgba(82,183,136,0.08)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: isMobile ? 'stretch' : 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '28px', textAlign: isMobile ? 'center' : 'left' }}>
          <div style={{ flex: isMobile ? '1 1 auto' : undefined }}>
            <p style={{ color: 'rgba(82,183,136,0.7)', fontSize: '11px', fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '12px' }}>
              ✦ Ready to build?
            </p>
            <h2 style={{
              fontFamily: "'Syne', sans-serif", fontWeight: 800,
              fontSize: 'clamp(1.8rem, 3.5vw, 3rem)', color: '#e8f5ec',
              letterSpacing: '-1px', lineHeight: 1.1, margin: 0,
            }}>
              Let&apos;s create something<br />
              <span style={{ background: 'linear-gradient(90deg, #52b788, #00e5ff 60%, #ffca28)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                extraordinary together.
              </span>
            </h2>
          </div>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: isMobile ? 'center' : 'flex-start', width: isMobile ? '100%' : 'auto' }}>
            <Link href="/contact" style={{ width: isMobile ? '100%' : 'auto' }}>
              <motion.div
                whileHover={{ scale: 1.04, boxShadow: '0 0 40px rgba(82,183,136,0.35)' }}
                whileTap={{ scale: 0.97 }}
                style={{
                  padding: '14px 32px', borderRadius: '100px',
                  background: '#52b788', color: '#070b0a',
                  fontFamily: "'Syne', sans-serif", fontWeight: 800,
                  fontSize: '15px', cursor: 'pointer', letterSpacing: '0.5px',
                }}
              >
                Start a Project →
              </motion.div>
            </Link>
            <Link href="/projects" style={{ width: isMobile ? '100%' : 'auto' }}>
              <motion.div
                whileHover={{ scale: 1.04, borderColor: 'rgba(82,183,136,0.5)' }}
                whileTap={{ scale: 0.97 }}
                style={{
                  padding: '14px 32px', borderRadius: '100px',
                  background: 'transparent', color: 'rgba(232,245,236,0.7)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  fontFamily: "'Syne', sans-serif", fontWeight: 700,
                  fontSize: '15px', cursor: 'pointer',
                  transition: 'border-color 0.2s',
                  width: '100%',
                  textAlign: 'center',
                }}
              >
                See My Work
              </motion.div>
            </Link>
          </div>
        </div>
      </div>

      {/* ── Main Grid ── */}
      <div style={{ position: 'relative', zIndex: 1, padding: '72px 6vw 0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))', gap: '48px' }}>

          {/* Brand column */}
          <div>
            {/* LOGO — cinematic font */}
            <motion.div
              whileHover={{ scale: 1.03 }}
              style={{ marginBottom: '24px', display: 'inline-block' }}
            >
              <div style={{ position: 'relative' }}>
                <h2 style={{
                  fontFamily: "'Syne', sans-serif",
                  fontSize: '2.6rem',
                  fontWeight: 800,
                  letterSpacing: '0.18em',
                  margin: 0,
                  lineHeight: 1,
                  background: 'linear-gradient(135deg, #52b788 0%, #00e5ff 55%, #ffca28 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  filter: 'drop-shadow(0 0 20px rgba(82,183,136,0.4))',
                }}>
                  {logo}
                </h2>
                <div style={{
                  height: '2px', marginTop: '6px',
                  background: 'linear-gradient(90deg, #52b788, #00e5ff, transparent)',
                  borderRadius: '2px',
                }} />
                <p style={{ color: 'rgba(82,183,136,0.55)', fontSize: '9px', fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', marginTop: '6px', margin: '6px 0 0' }}>
                  {tagline}
                </p>
              </div>
            </motion.div>

            <p style={{ color: 'rgba(232,245,236,0.45)', lineHeight: 1.8, fontSize: '0.88rem', maxWidth: '280px', marginBottom: '28px' }}>
              {description}
            </p>

            <p style={{ fontSize: '0.75rem', color: 'rgba(82,183,136,0.5)', fontStyle: 'italic', marginBottom: '28px' }}>
              &ldquo;Built with precision. Designed for impact.&rdquo;
            </p>

            {/* Socials */}
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <MagneticSocial Icon={FaGithub}    href={githubUrl}    label="GitHub" />
              <MagneticSocial Icon={FaLinkedinIn} href={linkedinUrl}  label="LinkedIn" />
              <MagneticSocial Icon={FaInstagram}  href={instagramUrl} label="Instagram" />
              <MagneticSocial Icon={FaTwitter}    href={twitterUrl}   label="Twitter" />
              <MagneticSocial Icon={FaFacebookF}  href={facebookUrl}  label="Facebook" />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ fontFamily: "'Syne', sans-serif", color: '#e8f5ec', fontWeight: 700, fontSize: '14px', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '24px' }}>
              Navigation
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {quickLinks.map((link, idx) => (
                <FooterLink key={idx} href={link.href} label={link.label} />
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 style={{ fontFamily: "'Syne', sans-serif", color: '#e8f5ec', fontWeight: 700, fontSize: '14px', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '24px' }}>
              Services
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {['Web Development', 'UI/UX Design', '3D Expert', 'AI Automations'].map(s => (
                <FooterLink key={s} href="/services" label={s} />
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 style={{ fontFamily: "'Syne', sans-serif", color: '#e8f5ec', fontWeight: 700, fontSize: '14px', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '24px' }}>
              Contact Info
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {[
                { icon: '📧', label: 'Email', val: email },
                { icon: '📞', label: 'Phone', val: phone },
                { icon: '📍', label: 'Location', val: location },
              ].map(({ icon, label, val }) => (
                <div key={label} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <span style={{ fontSize: '14px', marginTop: '2px', flexShrink: 0 }}>{icon}</span>
                  <div>
                    <p style={{ color: 'rgba(82,183,136,0.6)', fontSize: '10px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', margin: '0 0 2px' }}>{label}</p>
                    <p style={{ color: 'rgba(232,245,236,0.55)', fontSize: '13px', margin: 0 }}>{val}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Divider ── */}
      <div style={{ maxWidth: '1200px', margin: '56px auto 0', padding: '0 6vw' }}>
        <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent, rgba(82,183,136,0.2), transparent)' }} />
      </div>

      {/* ── Bottom bar ── */}
      <div style={{ position: 'relative', zIndex: 1, padding: '24px 6vw 32px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', alignItems: isMobile ? 'flex-start' : 'center', flexWrap: 'wrap', gap: '14px' }}>
          <p style={{ fontSize: '12px', color: 'rgba(232,245,236,0.22)', letterSpacing: '0.5px', width: isMobile ? '100%' : 'auto' }}>
             {year} {copyright} 
          </p>
          <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: isMobile ? 'flex-start' : 'center', gap: '14px', width: isMobile ? '100%' : 'auto' }}>
            <span style={{ fontSize: '12px', color: 'rgba(232,245,236,0.2)' }}>.</span>
            <motion.span
              role="button"
              tabIndex={0}
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { window.scrollTo({ top: 0, behavior: 'smooth' }); } }}
              whileHover={{ scale: 1.15, borderColor: 'rgba(82,183,136,0.5)', boxShadow: '0 0 20px rgba(82,183,136,0.2)' }}
              whileTap={{ scale: 0.9 }}
              style={{
                width: 40, height: 40, borderRadius: '50%',
                border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(82,183,136,0.06)',
                color: '#52b788', cursor: 'pointer', fontSize: '16px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'border-color 0.2s, box-shadow 0.2s',
                userSelect: 'none',
              }}
            >
              ↑
            </motion.span>
          </div>
        </div>
      </div>
    </footer>
  );
}