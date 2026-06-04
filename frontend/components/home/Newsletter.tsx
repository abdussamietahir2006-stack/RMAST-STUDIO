'use client';

import { motion } from 'framer-motion';
import { useState, FormEvent } from 'react';
import toast from 'react-hot-toast';

export interface NewsletterCMSData {
  data?: Record<string, string>;
}

export default function Newsletter({ data = {} }: NewsletterCMSData) {
  const newsletterHeading = data.newsletterHeading || 'Stay Updated';
  const newsletterSubtext = data.newsletterSubtext || 'Get insights, updates, and new projects delivered to your inbox.';
  const [email, setEmail] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubscribe = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loading) return;
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      toast.error('Please enter a valid email');
      return;
    }
    setLoading(true);
    //

    try {
      const res = await fetch('/api/subscribers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: trimmedEmail, source: 'newsletter' }),
      });

      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        toast.success("You're subscribed! Check your inbox.");
        setEmail('');
      } else {
        toast.error(data.error || 'Failed to subscribe');
      }
    } catch (err) {
      toast.error('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      style={{
        padding: '6rem 6vw',
        background:
          'radial-gradient(circle at 50% 50%, rgba(82,183,136,0.08), transparent 70%), #0b0f0e',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Animated gradient blobs */}
      <motion.div
        animate={{ y: [0, -30, 0], opacity: [0.1, 0.2, 0.1] }}
        transition={{ duration: 10, repeat: Infinity }}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '300px',
          background:
            'radial-gradient(circle at 20% 50%, rgba(82,183,136,0.15), transparent 60%)',
          filter: 'blur(80px)',
          zIndex: 0,
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false }}
        transition={{ duration: 0.8 }}
        style={{
          position: 'relative',
          zIndex: 1,
          maxWidth: '700px',
          margin: '0 auto',
        }}
      >
        <motion.p
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: false }}
          style={{
            color: '#52b788',
            letterSpacing: '0.25em',
            fontSize: '0.7rem',
            textTransform: 'uppercase',
            marginBottom: '1rem',
            fontWeight: 600,
          }}
        >
          Newsletter
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ delay: 0.1 }}
          style={{
            color: '#e8f5ec',
            marginBottom: '1rem',
            fontSize: 'clamp(2rem, 5vw, 3rem)',
            fontWeight: 700,
          }}
        >
          {newsletterHeading}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ delay: 0.2 }}
          style={{
            color: 'rgba(232,245,236,0.7)',
            marginBottom: '2rem',
            lineHeight: 1.6,
          }}
        >
          {newsletterSubtext}
        </motion.p>

        <motion.form
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ delay: 0.3 }}
          onSubmit={handleSubscribe}
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '1rem',
            flexWrap: 'wrap',
            marginBottom: '2rem',
          }}
        >
          <motion.input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            type="email"
            required
            disabled={loading}
            whileFocus={{
              borderColor: '#52b788',
              boxShadow: '0 0 20px rgba(82,183,136,0.2)',
            }}
            style={{
              flex: 1,
              minWidth: '250px',
              padding: '0.9rem 1.2rem',
              borderRadius: '12px',
              border: '1px solid rgba(82,183,136,0.3)',
              background: 'rgba(255,255,255,0.05)',
              color: '#e8f5ec',
              backdropFilter: 'blur(10px)',
              fontSize: '0.95rem',
              outline: 'none',
              transition: 'all 0.3s',
            }}
          />

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={loading}
            style={{
              padding: '0.9rem 1.8rem',
              borderRadius: '12px',
              background: '#52b788',
              color: '#07130f',
              border: 'none',
              fontWeight: 700,
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              fontSize: '0.95rem',
            }}
          >
            {loading ? 'Subscribing...' : 'Subscribe'}
          </motion.button>
        </motion.form>
        {/* message UI removed, only toast notifications remain */}
      </motion.div>
    </section>
  );
}