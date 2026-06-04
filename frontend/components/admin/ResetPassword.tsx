'use client';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import api from '@/lib/api';

export default function ResetPassword() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const token        = searchParams.get('token');
  const email        = searchParams.get('email');

  const [password,        setPassword]        = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPw,          setShowPw]          = useState(false);
  const [status,          setStatus]          = useState<'validating'|'idle'|'loading'|'success'|'error'>('validating');
  const [message,         setMessage]         = useState('');

  useEffect(() => {
    if (!token || !email) {
      Promise.resolve().then(() => {
        setStatus('error');
        setMessage('Invalid reset link.');
      });
      return;
    }
    api.post('/api/auth/validate-reset-token', { token, email })
      .then(() => setStatus('idle'))
      .catch(() => { setStatus('error'); setMessage('Invalid or expired reset link.'); });
  }, [token, email]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) { setMessage('Passwords do not match.'); setStatus('error'); return; }
    if (password.length < 6) { setMessage('Password must be at least 6 characters.'); setStatus('error'); return; }
    setStatus('loading');
    try {
      await api.post('/api/auth/reset-password', { token, email, newPassword: password });
      setStatus('success');
      setMessage('Password reset successful! Redirecting to login...');
      setTimeout(() => router.push('/admin'), 2500);
    } catch (err: unknown) {
      setStatus('error');
      const error = err as { response?: { data?: { message?: string } } };
      setMessage(error.response?.data?.message || 'Error resetting password.');
    }
  };

  if (status === 'validating') {
    return (
      <div style={{ minHeight:'100vh', background:'#07130f', display:'flex', alignItems:'center', justifyContent:'center' }}>
        <div style={{ display:'flex', gap:'8px' }}>
          {[0,1,2].map(i => (
            <motion.div key={i} animate={{ scale:[1,1.5,1], opacity:[0.3,1,0.3] }} transition={{ duration:1, repeat:Infinity, delay:i*0.2 }}
              style={{ width:8, height:8, borderRadius:'50%', background:'#52b788' }} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight:'100vh', background:'#07130f', display:'flex', alignItems:'center', justifyContent:'center', padding:'0 6vw', position:'relative', overflow:'hidden' }}>
      <div style={{ position:'absolute', inset:0, pointerEvents:'none', backgroundImage:`linear-gradient(rgba(82,183,136,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(82,183,136,0.04) 1px,transparent 1px)`, backgroundSize:'48px 48px' }} />
      <motion.div animate={{ scale:[1,1.1,1], opacity:[0.12,0.2,0.12] }} transition={{ duration:8, repeat:Infinity }}
        style={{ position:'absolute', top:'-200px', left:'-200px', width:'600px', height:'600px', borderRadius:'50%', background:'radial-gradient(circle,rgba(82,183,136,0.15),transparent 70%)', filter:'blur(60px)', pointerEvents:'none' }} />

      <motion.div initial={{ opacity:0, y:40 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.7, ease:[0.22,1,0.36,1] }}
        style={{ position:'relative', zIndex:1, width:'100%', maxWidth:'420px' }}>

        <div style={{ textAlign:'center', marginBottom:'2.5rem' }}>
          <h1 style={{ fontFamily:"'Syne',sans-serif", fontSize:'2.2rem', fontWeight:800, letterSpacing:'0.22em', margin:'0 0 6px', background:'linear-gradient(135deg,#52b788,#00e5ff)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>RMAST</h1>
          <p style={{ color:'rgba(232,245,236,0.3)', fontSize:'10px', letterSpacing:'4px', textTransform:'uppercase', margin:0 }}>Create New Password</p>
        </div>

        <div style={{ borderRadius:'24px', background:'rgba(11,20,16,0.9)', border:'1px solid rgba(82,183,136,0.15)', backdropFilter:'blur(24px)', padding:'40px 36px', boxShadow:'0 40px 80px rgba(0,0,0,0.5)', position:'relative', overflow:'hidden' }}>
          <div style={{ position:'absolute', top:0, left:0, right:0, height:'2px', background:'linear-gradient(90deg,transparent,#52b788,#00e5ff,transparent)', borderRadius:'24px 24px 0 0' }} />

          <h2 style={{ color:'#e8f5ec', fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:'1.5rem', margin:'0 0 6px' }}>Reset Password</h2>
          <p style={{ color:'rgba(232,245,236,0.35)', fontSize:'13px', margin:'0 0 28px' }}>Enter your new password below.</p>

          <AnimatePresence>
            {status === 'success' && (
              <motion.div initial={{ opacity:0, y:-8 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}
                style={{ background:'rgba(82,183,136,0.08)', border:'1px solid rgba(82,183,136,0.2)', borderRadius:'10px', padding:'12px 14px', color:'#52b788', fontSize:'13px', marginBottom:'20px' }}>
                ✓ {message}
              </motion.div>
            )}
            {status === 'error' && (
              <motion.div initial={{ opacity:0, y:-8 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}
                style={{ background:'rgba(255,107,107,0.08)', border:'1px solid rgba(255,107,107,0.2)', borderRadius:'10px', padding:'12px 14px', color:'#ff6b6b', fontSize:'13px', marginBottom:'20px' }}>
                {message}
              </motion.div>
            )}
          </AnimatePresence>

          {status !== 'success' && (
            <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:'16px' }}>
              {['New Password', 'Confirm Password'].map((label, i) => (
                <div key={i}>
                  <label style={{ display:'block', color:'rgba(232,245,236,0.35)', fontSize:'10px', fontWeight:700, letterSpacing:'2px', textTransform:'uppercase', marginBottom:'8px' }}>{label}</label>
                  <div style={{ position:'relative' }}>
                    <input
                      type={showPw ? 'text' : 'password'} required
                      value={i === 0 ? password : confirmPassword}
                      onChange={e => i === 0 ? setPassword(e.target.value) : setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      style={{ width:'100%', background:'rgba(82,183,136,0.04)', border:'1px solid rgba(82,183,136,0.15)', borderRadius:'12px', padding:'12px 44px 12px 16px', color:'#e8f5ec', fontSize:'14px', outline:'none', boxSizing:'border-box' }}
                      onFocus={e => e.target.style.borderColor='rgba(82,183,136,0.5)'}
                      onBlur={e => e.target.style.borderColor='rgba(82,183,136,0.15)'} />
                    {i === 0 && (
                      <button type="button" onClick={() => setShowPw(s => !s)}
                        style={{ position:'absolute', right:'14px', top:'50%', transform:'translateY(-50%)', background:'none', border:'none', color:'rgba(232,245,236,0.3)', cursor:'pointer', fontSize:'13px', padding:0 }}>
                        {showPw ? '🙈' : '👁'}
                      </button>
                    )}
                  </div>
                </div>
              ))}

              <motion.button type="submit" disabled={status === 'loading'}
                whileHover={{ scale:1.02 }} whileTap={{ scale:0.98 }}
                style={{ padding:'14px', borderRadius:'12px', background:'linear-gradient(135deg,#52b788,#2d6a4f)', border:'none', color:'#07130f', fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:'14px', cursor:status==='loading'?'not-allowed':'pointer', opacity:status==='loading'?0.7:1 }}>
                {status === 'loading' ? 'Resetting...' : 'Reset Password →'}
              </motion.button>
            </form>
          )}
        </div>

        <div style={{ textAlign:'center', marginTop:'20px' }}>
          <Link href="/admin" style={{ color:'rgba(232,245,236,0.25)', fontSize:'12px', textDecoration:'none' }}>← Back to Login</Link>
        </div>
      </motion.div>
    </div>
  );
}