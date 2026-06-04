'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';

// ── Magnetic Nav Link ─────────────────────────────────────────────────────────
function NavLink({ href, label, isActive }: { href: string; label: string; isActive: boolean }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const [hov, setHov] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const handleMove = (e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    setPos({
      x: (e.clientX - rect.left - rect.width / 2) * 0.25,
      y: (e.clientY - rect.top - rect.height / 2) * 0.25,
    });
  };
  const handleLeave = () => { setPos({ x: 0, y: 0 }); setHov(false); };

  return (
    <motion.a
      ref={ref}
      href={href}
      onMouseMove={handleMove}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={handleLeave}
      animate={{ x: pos.x, y: pos.y }}
      transition={{ type: 'spring', stiffness: 350, damping: 22 }}
      style={{
        position: 'relative',
        display: 'inline-flex', flexDirection: 'column', alignItems: 'center',
        gap: '4px', textDecoration: 'none', cursor: 'pointer',
        padding: '8px 14px',
      }}
    >
      <motion.span
        animate={{
          color: isActive ? '#52b788' : hov ? '#e8f5ec' : 'rgba(232,245,236,0.45)',
          letterSpacing: hov ? '0.2em' : '0.15em',
        }}
        transition={{ duration: 0.22 }}
        style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}
      >
        {label}
      </motion.span>

      {/* Active underline */}
      <motion.div
        animate={{ scaleX: isActive ? 1 : hov ? 0.6 : 0, opacity: isActive ? 1 : hov ? 0.6 : 0 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: 'absolute', bottom: 2, left: 14, right: 14,
          height: '1.5px',
          background: 'linear-gradient(90deg, transparent, #52b788, transparent)',
          transformOrigin: 'center', borderRadius: '2px',
        }}
      />
    </motion.a>
  );
}

// ── Main Navbar ───────────────────────────────────────────────────────────────
export default function Navbar({ data = {} }: { data?: Record<string, string> }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, 'change', (y) => setScrolled(y > 40));

  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth < 768);
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  // CMS variables with fallbacks
  const logo = data.logo || 'RMAST';
  const ctaLabel = data.ctaLabel || 'Hire Me';
  const ctaHref = data.ctaHref || '/contact';

  const navLinks = [
    { href: data.link1Href || '/',         label: data.link1Label || 'Home' },
    { href: data.link2Href || '/about',    label: data.link2Label || 'About' },
    { href: data.link3Href || '/services', label: data.link3Label || 'Services' },
    { href: data.link4Href || '/projects', label: data.link4Label || 'Projects' },
  ];

  return (
    <>
      <motion.header
        animate={{
          backdropFilter: scrolled ? 'blur(20px)' : 'blur(10px)',
          background: scrolled ? 'rgba(5,12,10,0.88)' : 'rgba(5,12,10,0.4)',
          borderBottomColor: scrolled ? 'rgba(82,183,136,0.12)' : 'rgba(82,183,136,0.06)',
          boxShadow: scrolled ? '0 8px 40px rgba(0,0,0,0.4)' : 'none',
        }}
        transition={{ duration: 0.3 }}
        style={{
          position: 'fixed', top: 0, left: 0, width: '100%', zIndex: 1000,
          borderBottom: '1px solid rgba(82,183,136,0.06)',
        }}
      >
        <nav style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 6vw',
          height: '72px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>

          {/* ── LOGO — always left ── */}
          <Link href="/" style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
            <motion.div
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              style={{ position: 'relative', cursor: 'pointer' }}
            >
              {/* Glow pulse behind logo */}
              <motion.div
                animate={{ opacity: [0.3, 0.7, 0.3], scale: [1, 1.15, 1] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                style={{
                  position: 'absolute', inset: '-8px',
                  borderRadius: '12px',
                  background: 'radial-gradient(circle, rgba(82,183,136,0.15) 0%, transparent 70%)',
                  pointerEvents: 'none',
                }}
              />

              <h1 style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: '1.55rem',
                fontWeight: 800,
                letterSpacing: '0.15em',
                margin: 0,
                padding: 0,
                lineHeight: 1,
                background: 'linear-gradient(135deg, #52b788 0%, #00e5ff 55%, #ffca28 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                filter: 'drop-shadow(0 0 12px rgba(82,183,136,0.5))',
                position: 'relative',
                whiteSpace: 'nowrap',
              }}>
                {logo}
              </h1>

              {/* Underline accent */}
              <motion.div
                animate={{ scaleX: [0, 1, 0], opacity: [0, 0.8, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                style={{
                  position: 'absolute', bottom: -4, left: 0, right: 0,
                  height: '1.5px',
                  background: 'linear-gradient(90deg, transparent, #52b788, transparent)',
                  borderRadius: '2px', transformOrigin: 'center',
                }}
              />
            </motion.div>
          </Link>

          {/* ── Right side: links + CTA or hamburger ── */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            {!isMobile ? (
              <>
                {navLinks.map(({ href, label }) => (
                  <NavLink key={href} href={href} label={label} isActive={pathname === href} />
                ))}

                {/* CTA */}
                <Link href={ctaHref} style={{ marginLeft: '12px' }}>
                  <motion.div
                    whileHover={{ scale: 1.06, boxShadow: '0 0 30px rgba(82,183,136,0.4)' }}
                    whileTap={{ scale: 0.95 }}
                    style={{
                      padding: '10px 22px', borderRadius: '100px',
                      background: '#52b788', color: '#070b0a',
                      fontFamily: "'Syne', sans-serif", fontWeight: 800,
                      fontSize: '12px', letterSpacing: '1.5px', textTransform: 'uppercase',
                      cursor: 'pointer', whiteSpace: 'nowrap',
                    }}
                  >
                    {ctaLabel}
                  </motion.div>
                </Link>
              </>
            ) : (
              /* ── Hamburger ── */
              <button
                type="button"
                onClick={() => setMenuOpen((open) => !open)}
                aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                style={{
                  display: 'inline-flex', flexDirection: 'column',
                  justifyContent: 'space-between',
                  width: 42, height: 32, padding: '6px 8px',
                  border: '1px solid rgba(232,245,236,0.12)',
                  borderRadius: 14, background: 'rgba(11,15,14,0.85)',
                  cursor: 'pointer', boxShadow: '0 0 18px rgba(0,0,0,0.2)',
                }}
              >
                <span style={{
                  height: 2, width: '100%', borderRadius: 2,
                  background: menuOpen ? '#52b788' : 'rgba(232,245,236,0.7)',
                  transition: 'background 0.2s',
                }} />
                <span style={{
                  height: 2, width: '100%', borderRadius: 2,
                  background: menuOpen ? '#52b788' : 'rgba(232,245,236,0.7)',
                  transition: 'background 0.2s',
                }} />
                <span style={{
                  height: 2, width: '100%', borderRadius: 2,
                  background: menuOpen ? '#52b788' : 'rgba(232,245,236,0.7)',
                  transition: 'background 0.2s',
                }} />
              </button>
            )}
          </div>
        </nav>
      </motion.header>

      {/* ── Mobile Menu ── */}
      {isMobile && menuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
          style={{
            position: 'fixed', top: 72, left: 0, right: 0,
            background: 'rgba(5,12,10,0.96)',
            borderBottom: '1px solid rgba(82,183,136,0.12)',
            padding: '18px 6vw 24px',
            backdropFilter: 'blur(16px)',
            zIndex: 999,
          }}
        >
          <div style={{ display: 'grid', gap: '12px' }}>
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMenuOpen(false)}
                style={{
                  display: 'block', padding: '14px 16px', borderRadius: '16px',
                  background: pathname === href
                    ? 'rgba(82,183,136,0.13)'
                    : 'rgba(82,183,136,0.04)',
                  color: pathname === href ? '#52b788' : '#e8f5ec',
                  textDecoration: 'none', fontWeight: 700,
                  letterSpacing: '0.12em', textTransform: 'uppercase',
                }}
              >
                {label}
              </Link>
            ))}

            <Link
              href={ctaHref}
              onClick={() => setMenuOpen(false)}
              style={{ textDecoration: 'none' }}
            >
              <motion.div
                whileHover={{ scale: 1.03, boxShadow: '0 0 30px rgba(82,183,136,0.3)' }}
                whileTap={{ scale: 0.97 }}
                style={{
                  display: 'flex', justifyContent: 'center', width: '100%',
                  padding: '14px 0', borderRadius: '16px',
                  background: '#52b788', color: '#070b0a',
                  fontFamily: "'Syne', sans-serif", fontWeight: 800,
                  letterSpacing: '0.15em', textTransform: 'uppercase',
                  cursor: 'pointer',
                }}
              >
                {ctaLabel}
              </motion.div>
            </Link>
          </div>
        </motion.div>
      )}

      {/* Spacer */}
      <div style={{ height: 72 }} />
    </>
  );
}