'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import api from '@/lib/api';

export default function ForgotPassword() {
  const [email, setEmail]   = useState('');
  const [status, setStatus] = useState<'idle'|'loading'|'sent'|'error'>('idle');
  const [resetToken, setResetToken] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    try {
      const res = await api.post('/api/auth/forgot-password', { email });
      setStatus('sent');
      if (res.data.data?.resetToken) setResetToken(res.data.data.resetToken);
    } catch { setStatus('error'); }
  };

  return (
    <div style={{ minHeight:'100vh', background:'#07130f', display:'flex', alignItems:'center', justifyContent:'center', padding:'0 6vw', position:'relative', overflow:'hidden' }}>
      <div style={{ position:'absolute', inset:0, pointerEvents:'none', backgroundImage:`linear-gradient(rgba(82,183,136,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(82,183,136,0.04) 1px,transparent 1px)`, backgroundSize:'48px 48px' }} />
      <motion.div animate={{scale:[1,1.1,1],opacity:[0.12,0.2,0.12]}} transition={{duration:8,repeat:Infinity}}
        style={{position:'absolute',top:'-200px',left:'-200px',width:'600px',height:'600px',borderRadius:'50%',background:'radial-gradient(circle,rgba(82,183,136,0.15),transparent 70%)',filter:'blur(60px)',pointerEvents:'none'}} />

      <motion.div initial={{opacity:0,y:40}} animate={{opacity:1,y:0}} transition={{duration:0.7,ease:[0.22,1,0.36,1]}}
        style={{position:'relative',zIndex:1,width:'100%',maxWidth:'420px'}}>

        <div style={{textAlign:'center',marginBottom:'2.5rem'}}>
          <h1 style={{fontFamily:"'Syne',sans-serif",fontSize:'2.2rem',fontWeight:800,letterSpacing:'0.22em',margin:'0 0 6px',background:'linear-gradient(135deg,#52b788,#00e5ff)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text'}}>RMAST</h1>
          <p style={{color:'rgba(232,245,236,0.3)',fontSize:'10px',letterSpacing:'4px',textTransform:'uppercase',margin:0}}>Reset Password</p>
        </div>

        <div style={{borderRadius:'24px',background:'rgba(11,20,16,0.9)',border:'1px solid rgba(82,183,136,0.15)',backdropFilter:'blur(24px)',padding:'40px 36px',boxShadow:'0 40px 80px rgba(0,0,0,0.5)',position:'relative',overflow:'hidden'}}>
          <div style={{position:'absolute',top:0,left:0,right:0,height:'2px',background:'linear-gradient(90deg,transparent,#52b788,#00e5ff,transparent)',borderRadius:'24px 24px 0 0'}} />

          <h2 style={{color:'#e8f5ec',fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:'1.5rem',margin:'0 0 6px'}}>Forgot Password?</h2>
          <p style={{color:'rgba(232,245,236,0.35)',fontSize:'13px',margin:'0 0 28px'}}>Enter your admin email and we&apos;ll send a reset link.</p>

          <AnimatePresence>
            {status==='sent' && (
              <motion.div initial={{opacity:0,y:-8}} animate={{opacity:1,y:0}} exit={{opacity:0}}
                style={{background:'rgba(82,183,136,0.08)',border:'1px solid rgba(82,183,136,0.2)',borderRadius:'10px',padding:'12px 14px',color:'#52b788',fontSize:'13px',marginBottom:'20px'}}>
                ✓ Reset link sent! Check your email or the server console.
              </motion.div>
            )}
            {status==='error' && (
              <motion.div initial={{opacity:0,y:-8}} animate={{opacity:1,y:0}} exit={{opacity:0}}
                style={{background:'rgba(255,107,107,0.08)',border:'1px solid rgba(255,107,107,0.2)',borderRadius:'10px',padding:'12px 14px',color:'#ff6b6b',fontSize:'13px',marginBottom:'20px'}}>
                Error sending reset email. Please try again.
              </motion.div>
            )}
          </AnimatePresence>

          {status !== 'sent' && (
            <form onSubmit={handleSubmit} style={{display:'flex',flexDirection:'column',gap:'16px'}}>
              <div>
                <label style={{display:'block',color:'rgba(232,245,236,0.35)',fontSize:'10px',fontWeight:700,letterSpacing:'2px',textTransform:'uppercase',marginBottom:'8px'}}>Email Address</label>
                <input type="email" required value={email} onChange={e=>setEmail(e.target.value)} placeholder="admin@rmast.dev"
                  style={{width:'100%',background:'rgba(82,183,136,0.04)',border:'1px solid rgba(82,183,136,0.15)',borderRadius:'12px',padding:'12px 16px',color:'#e8f5ec',fontSize:'14px',outline:'none',boxSizing:'border-box'}}
                  onFocus={e=>e.target.style.borderColor='rgba(82,183,136,0.5)'} onBlur={e=>e.target.style.borderColor='rgba(82,183,136,0.15)'} />
              </div>
              <motion.button type="submit" disabled={status==='loading'}
                whileHover={{scale:1.02}} whileTap={{scale:0.98}}
                style={{padding:'14px',borderRadius:'12px',background:'linear-gradient(135deg,#52b788,#2d6a4f)',border:'none',color:'#07130f',fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:'14px',cursor:status==='loading'?'not-allowed':'pointer',opacity:status==='loading'?0.7:1}}>
                {status==='loading'?'Sending...':'Send Reset Link →'}
              </motion.button>
            </form>
          )}

          {/* Dev helper — show link in dev */}
          {status==='sent' && resetToken && (
            <div style={{marginTop:'16px',padding:'12px',borderRadius:'10px',background:'rgba(82,183,136,0.04)',border:'1px solid rgba(82,183,136,0.1)'}}>
              <p style={{color:'rgba(232,245,236,0.3)',fontSize:'10px',margin:'0 0 6px',letterSpacing:'1px',textTransform:'uppercase'}}>Dev — direct reset link</p>
              <Link href={`/admin/reset-password?token=${resetToken}&email=${encodeURIComponent(email)}`}
                style={{color:'#52b788',fontSize:'12px',wordBreak:'break-all'}}>
                Click here to reset password →
              </Link>
            </div>
          )}
        </div>

        <div style={{textAlign:'center',marginTop:'20px'}}>
          <Link href="/admin" style={{color:'rgba(232,245,236,0.25)',fontSize:'12px',textDecoration:'none'}}>← Back to Login</Link>
        </div>
      </motion.div>
    </div>
  );
}