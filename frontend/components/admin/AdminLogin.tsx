'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import api from '@/lib/api';

export default function AdminLogin() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [status, setStatus] = useState<'idle'|'loading'|'error'>('idle');
  const [showPw, setShowPw] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    try {
      const res = await api.post('/api/auth/login', form);
      localStorage.setItem('rmastAdminToken', res.data.data.token);
      router.push('/admin/dashboard');
    } catch { setStatus('error'); }
  };

  return (
    <div style={{ minHeight:'100vh', background:'#07130f', display:'flex', alignItems:'center', justifyContent:'center', padding:'0 6vw', position:'relative', overflow:'hidden' }}>
      {/* Grid */}
      <div style={{ position:'absolute', inset:0, pointerEvents:'none', backgroundImage:`linear-gradient(rgba(82,183,136,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(82,183,136,0.04) 1px, transparent 1px)`, backgroundSize:'48px 48px' }} />
      {/* Blobs */}
      <motion.div animate={{ scale:[1,1.1,1], opacity:[0.15,0.25,0.15] }} transition={{ duration:8, repeat:Infinity }}
        style={{ position:'absolute', top:'-200px', left:'-200px', width:'600px', height:'600px', borderRadius:'50%', background:'radial-gradient(circle, rgba(82,183,136,0.18), transparent 70%)', filter:'blur(60px)', pointerEvents:'none' }} />
      <motion.div animate={{ scale:[1,1.15,1], opacity:[0.08,0.15,0.08] }} transition={{ duration:10, repeat:Infinity, delay:3 }}
        style={{ position:'absolute', bottom:'-200px', right:'-200px', width:'600px', height:'600px', borderRadius:'50%', background:'radial-gradient(circle, rgba(0,229,255,0.1), transparent 70%)', filter:'blur(80px)', pointerEvents:'none' }} />

      <motion.div initial={{ opacity:0, y:40 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.7, ease:[0.22,1,0.36,1] }}
        style={{ position:'relative', zIndex:1, width:'100%', maxWidth:'420px' }}>

        {/* Logo */}
        <div style={{ textAlign:'center', marginBottom:'2.5rem' }}>
          <motion.h1 initial={{ opacity:0, y:-16 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.1 }}
            style={{ fontFamily:"'Syne', sans-serif", fontSize:'2.2rem', fontWeight:800, letterSpacing:'0.22em', margin:'0 0 6px',
              background:'linear-gradient(135deg, #52b788, #00e5ff)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text',
              filter:'drop-shadow(0 0 18px rgba(82,183,136,0.45))' }}>
            RMAST
          </motion.h1>
          <p style={{ color:'rgba(232,245,236,0.3)', fontSize:'10px', letterSpacing:'4px', textTransform:'uppercase', margin:0 }}>Admin Dashboard</p>
        </div>

        {/* Card */}
        <div style={{ borderRadius:'24px', background:'rgba(11,20,16,0.9)', border:'1px solid rgba(82,183,136,0.15)', backdropFilter:'blur(24px)', padding:'40px 36px', boxShadow:'0 40px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(82,183,136,0.08)', position:'relative', overflow:'hidden' }}>
          {/* Top accent line */}
          <div style={{ position:'absolute', top:0, left:0, right:0, height:'2px', background:'linear-gradient(90deg, transparent, #52b788, #00e5ff, transparent)', borderRadius:'24px 24px 0 0' }} />

          <h2 style={{ color:'#e8f5ec', fontFamily:"'Syne', sans-serif", fontWeight:800, fontSize:'1.5rem', margin:'0 0 6px', letterSpacing:'-0.5px' }}>Welcome back</h2>
          <p style={{ color:'rgba(232,245,236,0.35)', fontSize:'13px', margin:'0 0 28px' }}>Sign in to manage your portfolio.</p>

          <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:'16px' }}>
            <div>
              <label style={{ display:'block', color:'rgba(232,245,236,0.35)', fontSize:'10px', fontWeight:700, letterSpacing:'2px', textTransform:'uppercase', marginBottom:'8px' }}>Email Address</label>
              <input type="email" required value={form.email} onChange={e => setForm(p=>({...p,email:e.target.value}))}
                placeholder="admin@rmast.dev"
                style={{ width:'100%', background:'rgba(82,183,136,0.04)', border:'1px solid rgba(82,183,136,0.15)', borderRadius:'12px', padding:'12px 16px', color:'#e8f5ec', fontSize:'14px', outline:'none', boxSizing:'border-box', transition:'border-color 0.2s' }}
                onFocus={e=>e.target.style.borderColor='rgba(82,183,136,0.5)'}
                onBlur={e=>e.target.style.borderColor='rgba(82,183,136,0.15)'} />
            </div>

            <div>
              <label style={{ display:'block', color:'rgba(232,245,236,0.35)', fontSize:'10px', fontWeight:700, letterSpacing:'2px', textTransform:'uppercase', marginBottom:'8px' }}>Password</label>
              <div style={{ position:'relative' }}>
                <input type={showPw?'text':'password'} required value={form.password} onChange={e=>setForm(p=>({...p,password:e.target.value}))}
                  placeholder="••••••••"
                  style={{ width:'100%', background:'rgba(82,183,136,0.04)', border:'1px solid rgba(82,183,136,0.15)', borderRadius:'12px', padding:'12px 44px 12px 16px', color:'#e8f5ec', fontSize:'14px', outline:'none', boxSizing:'border-box', transition:'border-color 0.2s' }}
                  onFocus={e=>e.target.style.borderColor='rgba(82,183,136,0.5)'}
                  onBlur={e=>e.target.style.borderColor='rgba(82,183,136,0.15)'} />
                <button type="button" onClick={()=>setShowPw(s=>!s)}
                  style={{ position:'absolute', right:'14px', top:'50%', transform:'translateY(-50%)', background:'none', border:'none', color:'rgba(232,245,236,0.3)', cursor:'pointer', fontSize:'13px', padding:0, transition:'color 0.2s' }}
                  onMouseEnter={e=>(e.currentTarget as HTMLButtonElement).style.color='#52b788'}
                  onMouseLeave={e=>(e.currentTarget as HTMLButtonElement).style.color='rgba(232,245,236,0.3)'}>
                  {showPw?'🙈':'👁'}
                </button>
              </div>
            </div>

            <AnimatePresence>
              {status==='error' && (
                <motion.div initial={{opacity:0,y:-8}} animate={{opacity:1,y:0}} exit={{opacity:0}}
                  style={{ background:'rgba(255,107,107,0.08)', border:'1px solid rgba(255,107,107,0.2)', borderRadius:'10px', padding:'10px 14px', color:'#ff6b6b', fontSize:'13px' }}>
                  Invalid email or password. Please try again.
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button type="submit" disabled={status==='loading'}
              whileHover={{ scale:status==='loading'?1:1.02, boxShadow:'0 0 32px rgba(82,183,136,0.35)' }}
              whileTap={{ scale:0.98 }}
              style={{ padding:'14px', borderRadius:'12px', background:'linear-gradient(135deg, #52b788, #2d6a4f)', border:'none', color:'#07130f', fontFamily:"'Syne', sans-serif", fontWeight:800, fontSize:'14px', letterSpacing:'0.5px', cursor:status==='loading'?'not-allowed':'pointer', opacity:status==='loading'?0.7:1, marginTop:'4px', position:'relative', overflow:'hidden' }}>
              {status==='loading' ? (
                <span style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:'8px' }}>
                  <motion.span animate={{rotate:360}} transition={{duration:0.8,repeat:Infinity,ease:'linear'}}
                    style={{ display:'inline-block', width:14, height:14, border:'2px solid #07130f', borderTopColor:'transparent', borderRadius:'50%' }} />
                  Signing in...
                </span>
              ) : 'Sign In →'}
            </motion.button>
          </form>

          <div style={{ textAlign:'center', marginTop:'20px' }}>
            <Link href="/admin/forgot-password" style={{ color:'rgba(232,245,236,0.3)', fontSize:'12px', textDecoration:'none', transition:'color 0.2s' }}
              onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => (e.currentTarget as HTMLAnchorElement).style.color='#52b788'}
              onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => (e.currentTarget as HTMLAnchorElement).style.color='rgba(232,245,236,0.3)'}>
              Forgot password?
            </Link>
          </div>
        </div>

        <div style={{ textAlign:'center', marginTop:'24px' }}>
          <Link href="/" style={{ color:'rgba(232,245,236,0.2)', fontSize:'12px', textDecoration:'none' }}>← Back to portfolio</Link>
        </div>
      </motion.div>
    </div>
  );
}