'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/lib/api';

interface Subscriber { _id: string; email: string; source: string; createdAt: string; }
const fmt = (d: string) => new Date(d).toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric' });

export default function AdminSubscribers() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading]         = useState(true);
  const [search, setSearch]           = useState('');
  const [deleteConfirm, setDeleteConfirm]   = useState<string | null>(null);
  const [deleteAllConfirm, setDeleteAllConfirm] = useState(false);

  const fetch_ = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/subscribers');
      setSubscribers(res.data.data?.subscribers || []);
    } catch { setSubscribers([]); } finally { setLoading(false); }
  };

  useEffect(() => { fetch_(); }, []);

  const filtered = subscribers.filter(s => s.email.toLowerCase().includes(search.toLowerCase()));

  const deleteSub = async (id: string) => {
    await api.delete(`/api/subscribers/${id}`);
    setDeleteConfirm(null); fetch_();
  };

  const deleteAll = async () => {
    await api.delete('/api/subscribers');
    setDeleteAllConfirm(false); fetch_();
  };

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:'20px' }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:'12px' }}>
        <div>
          <h1 style={{ fontFamily:"'Syne',sans-serif", color:'#e8f5ec', fontSize:'1.4rem', fontWeight:800, margin:'0 0 2px' }}>Subscribers</h1>
          <p style={{ color:'rgba(232,245,236,0.3)', fontSize:'12px', margin:0 }}>Newsletter email list</p>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
          <div style={{ padding:'8px 16px', borderRadius:'10px', background:'rgba(82,183,136,0.08)', border:'1px solid rgba(82,183,136,0.18)' }}>
            <span style={{ color:'#52b788', fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:'1.1rem' }}>{subscribers.length}</span>
            <span style={{ color:'rgba(232,245,236,0.3)', fontSize:'12px', marginLeft:'6px' }}>Total</span>
          </div>
          {subscribers.length > 0 && (
            <button onClick={()=>setDeleteAllConfirm(true)}
              style={{ padding:'8px 14px', borderRadius:'10px', border:'1px solid rgba(255,107,107,0.2)', background:'rgba(255,107,107,0.06)', color:'#ff6b6b', fontSize:'12px', fontWeight:600, cursor:'pointer' }}>
              Delete All
            </button>
          )}
        </div>
      </div>

      {/* Search */}
      <div style={{ position:'relative' }}>
        <span style={{ position:'absolute', left:'14px', top:'50%', transform:'translateY(-50%)', color:'rgba(82,183,136,0.4)', fontSize:'14px' }}>🔍</span>
        <input type="text" placeholder="Search by email..." value={search} onChange={e=>setSearch(e.target.value)}
          style={{ width:'100%', background:'rgba(11,20,16,0.85)', border:'1px solid rgba(82,183,136,0.12)', borderRadius:'12px', padding:'11px 16px 11px 40px', color:'#e8f5ec', fontSize:'13px', outline:'none', boxSizing:'border-box', transition:'border-color 0.2s' }}
          onFocus={e=>e.target.style.borderColor='rgba(82,183,136,0.4)'}
          onBlur={e=>e.target.style.borderColor='rgba(82,183,136,0.12)'} />
      </div>

      {/* Table */}
      <div style={{ borderRadius:'16px', background:'rgba(11,20,16,0.85)', border:'1px solid rgba(82,183,136,0.07)', overflow:'hidden' }}>
        <table style={{ width:'100%', borderCollapse:'collapse' }}>
          <thead>
            <tr style={{ borderBottom:'1px solid rgba(82,183,136,0.07)' }}>
              {['#','Email Address','Source','Subscribed','Actions'].map(h=>(
                <th key={h} style={{ padding:'12px 16px', textAlign:'left', color:'rgba(232,245,236,0.2)', fontSize:'10px', fontWeight:700, letterSpacing:'2px', textTransform:'uppercase' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} style={{ padding:'48px', textAlign:'center', color:'rgba(232,245,236,0.2)', fontSize:'13px' }}>Loading...</td></tr>
            ) : filtered.length===0 ? (
              <tr><td colSpan={5} style={{ padding:'48px', textAlign:'center', color:'rgba(232,245,236,0.2)', fontSize:'13px' }}>No subscribers found.</td></tr>
            ) : filtered.map((sub,i)=>(
              <motion.tr key={sub._id} initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{delay:i*0.03}}
                style={{ borderBottom:'1px solid rgba(82,183,136,0.04)' }}>
                <td style={{ padding:'12px 16px', color:'rgba(232,245,236,0.2)', fontSize:'12px' }}>{i+1}</td>
                <td style={{ padding:'12px 16px', color:'#e8f5ec', fontSize:'13px', fontWeight:500 }}>{sub.email}</td>
                <td style={{ padding:'12px 16px' }}>
                  <span style={{ padding:'3px 8px', borderRadius:'6px', background:'rgba(82,183,136,0.07)', color:'#52b788', fontSize:'10px', fontWeight:700 }}>{sub.source||'newsletter'}</span>
                </td>
                <td style={{ padding:'12px 16px', color:'rgba(232,245,236,0.25)', fontSize:'12px' }}>{fmt(sub.createdAt)}</td>
                <td style={{ padding:'12px 16px' }}>
                  <div style={{ display:'flex', gap:'6px' }}>
                    <a href={`mailto:${sub.email}`} style={{ padding:'5px 10px', borderRadius:'7px', border:'1px solid rgba(82,183,136,0.25)', background:'rgba(82,183,136,0.06)', color:'#52b788', fontSize:'11px', textDecoration:'none' }}>Email</a>
                    <button onClick={()=>setDeleteConfirm(sub._id)} style={{ padding:'5px 10px', borderRadius:'7px', border:'1px solid rgba(255,107,107,0.2)', background:'rgba(255,107,107,0.06)', color:'#ff6b6b', fontSize:'11px', cursor:'pointer' }}>Delete</button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {deleteConfirm && (
          <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.75)', backdropFilter:'blur(8px)', zIndex:50, display:'flex', alignItems:'center', justifyContent:'center', padding:'20px' }}>
            <motion.div initial={{opacity:0,scale:0.95}} animate={{opacity:1,scale:1}} exit={{opacity:0,scale:0.95}}
              style={{ background:'rgba(5,12,9,0.99)', border:'1px solid rgba(255,107,107,0.2)', borderRadius:'20px', padding:'32px', maxWidth:'360px', width:'100%', textAlign:'center' }}>
              <p style={{ fontSize:'40px', margin:'0 0 14px' }}>🗑</p>
              <h3 style={{ color:'#e8f5ec', fontWeight:800, margin:'0 0 8px' }}>Delete Subscriber?</h3>
              <p style={{ color:'rgba(232,245,236,0.35)', fontSize:'13px', margin:'0 0 20px' }}>This cannot be undone.</p>
              <div style={{ display:'flex', gap:'10px' }}>
                <button onClick={()=>deleteSub(deleteConfirm)} style={{ flex:1, padding:'12px', borderRadius:'12px', background:'#ff6b6b', border:'none', color:'#fff', fontWeight:700, fontSize:'13px', cursor:'pointer' }}>Delete</button>
                <button onClick={()=>setDeleteConfirm(null)} style={{ flex:1, padding:'12px', borderRadius:'12px', border:'1px solid rgba(82,183,136,0.15)', background:'transparent', color:'rgba(232,245,236,0.4)', fontSize:'13px', cursor:'pointer' }}>Cancel</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {deleteAllConfirm && (
          <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.75)', backdropFilter:'blur(8px)', zIndex:50, display:'flex', alignItems:'center', justifyContent:'center', padding:'20px' }}>
            <motion.div initial={{opacity:0,scale:0.95}} animate={{opacity:1,scale:1}} exit={{opacity:0,scale:0.95}}
              style={{ background:'rgba(5,12,9,0.99)', border:'1px solid rgba(255,107,107,0.2)', borderRadius:'20px', padding:'32px', maxWidth:'360px', width:'100%', textAlign:'center' }}>
              <p style={{ fontSize:'40px', margin:'0 0 14px' }}>⚠️</p>
              <h3 style={{ color:'#e8f5ec', fontWeight:800, margin:'0 0 8px' }}>Delete All Subscribers?</h3>
              <p style={{ color:'rgba(232,245,236,0.35)', fontSize:'13px', margin:'0 0 20px' }}>This will permanently delete all {subscribers.length} subscribers.</p>
              <div style={{ display:'flex', gap:'10px' }}>
                <button onClick={deleteAll} style={{ flex:1, padding:'12px', borderRadius:'12px', background:'#ff6b6b', border:'none', color:'#fff', fontWeight:700, fontSize:'13px', cursor:'pointer' }}>Delete All</button>
                <button onClick={()=>setDeleteAllConfirm(false)} style={{ flex:1, padding:'12px', borderRadius:'12px', border:'1px solid rgba(82,183,136,0.15)', background:'transparent', color:'rgba(232,245,236,0.4)', fontSize:'13px', cursor:'pointer' }}>Cancel</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}