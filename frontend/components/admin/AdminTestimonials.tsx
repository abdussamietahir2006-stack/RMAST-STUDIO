'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/lib/api';

interface Testimonial { _id: string; name: string; role?: string; company?: string; quote: string; service?: string; rating: number; metric?: string; metricLabel?: string; avatarImage?: string; approved: boolean; createdAt: string; showOnWebsite?: boolean; }

const fmt = (d: string) => new Date(d).toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric' });

export default function AdminTestimonials() {
  const [items, setItems]             = useState<Testimonial[]>([]);
  const [loading, setLoading]         = useState(true);
  const [filter, setFilter]           = useState('all');
  const [selected, setSelected]       = useState<Testimonial | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const fetch_ = async () => {
    setLoading(true);
    try {
      const param = filter === 'all' ? {} : { approved: filter === 'approved' };
      const res = await api.get('/api/testimonials', { params: param });
      setItems(res.data.data?.testimonials || []);
    } catch { setItems([]); } finally { setLoading(false); }
  };

  useEffect(() => { fetch_(); }, [filter]);

  const toggleApprove = async (id: string, approved: boolean) => {
    await api.patch(`/api/testimonials/${id}/approve`, { approved });
    fetch_(); setSelected(null);
  };
 
  const toggleShowOnWebsite = async (id: string, showOnWebsite: boolean) => {
    await api.patch(`/api/testimonials/${id}/approve`, { showOnWebsite });
    fetch_(); setSelected(null);
  };

  const deleteItem = async (id: string) => {
    await api.delete(`/api/testimonials/${id}`);
    setDeleteConfirm(null); setSelected(null); fetch_();
  };

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:'20px' }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:'12px' }}>
        <div>
          <h1 style={{ fontFamily:"'Syne',sans-serif", color:'#e8f5ec', fontSize:'1.4rem', fontWeight:800, margin:'0 0 2px' }}>Testimonials</h1>
          <p style={{ color:'rgba(232,245,236,0.3)', fontSize:'12px', margin:0 }}>Client reviews — approve before they appear on site</p>
        </div>
        <div style={{ display:'flex', gap:'8px' }}>
          {['all','pending','approved'].map(f=>(
            <button key={f} onClick={()=>setFilter(f)}
              style={{ padding:'6px 14px', borderRadius:'8px', border:`1px solid ${filter===f?'rgba(82,183,136,0.5)':'rgba(82,183,136,0.12)'}`, background:filter===f?'rgba(82,183,136,0.12)':'transparent', color:filter===f?'#52b788':'rgba(232,245,236,0.35)', fontSize:'11px', fontWeight:700, cursor:'pointer', textTransform:'capitalize', transition:'all 0.2s' }}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(120px,1fr))', gap:'12px' }}>
        {[
          { label:'Total',    value:items.length,                            color:'#e8f5ec' },
          { label:'Pending',  value:items.filter(t=>!t.approved).length,    color:'#ffca28' },
          { label:'Approved', value:items.filter(t=>t.approved).length,     color:'#52b788' },
          { label:'5-Star',   value:items.filter(t=>t.rating===5).length,   color:'#76ff03' },
        ].map((s,i)=>(
          <div key={i} style={{ padding:'14px', borderRadius:'12px', background:'rgba(11,20,16,0.85)', border:'1px solid rgba(82,183,136,0.07)', textAlign:'center' }}>
            <p style={{ color:s.color, fontSize:'1.6rem', fontFamily:"'Syne',sans-serif", fontWeight:800, margin:'0 0 2px' }}>{s.value}</p>
            <p style={{ color:'rgba(232,245,236,0.3)', fontSize:'11px', margin:0 }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Cards Grid */}
      {loading ? (
        <p style={{ color:'rgba(232,245,236,0.2)', fontSize:'13px', textAlign:'center', padding:'40px' }}>Loading...</p>
      ) : items.length===0 ? (
        <p style={{ color:'rgba(232,245,236,0.2)', fontSize:'13px', textAlign:'center', padding:'40px' }}>No testimonials found.</p>
      ) : (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(320px,1fr))', gap:'16px' }}>
          {items.map((t,i)=>(
            <motion.div key={t._id} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:i*0.05}}
              style={{ padding:'20px', borderRadius:'16px', background:'rgba(11,20,16,0.85)', border:`1px solid ${t.approved?'rgba(82,183,136,0.2)':'rgba(255,202,40,0.15)'}`, position:'relative', overflow:'hidden' }}>
              {/* Status bar */}
              <div style={{ position:'absolute', top:0, left:0, right:0, height:'2px', background:t.approved?'linear-gradient(90deg,#52b788,transparent)':'linear-gradient(90deg,#ffca28,transparent)' }} />

              {/* Header */}
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'12px' }}>
                <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
                  {t.avatarImage ? (
                    <img src={t.avatarImage} alt={t.name} style={{ width:38, height:38, borderRadius:'50%', objectFit:'cover', border:'2px solid rgba(82,183,136,0.3)' }} />
                  ) : (
                    <div style={{ width:38, height:38, borderRadius:'50%', background:'rgba(82,183,136,0.1)', border:'1px solid rgba(82,183,136,0.25)', display:'flex', alignItems:'center', justifyContent:'center', color:'#52b788', fontWeight:800, fontSize:'13px' }}>
                      {t.name.slice(0,2).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <p style={{ color:'#e8f5ec', fontSize:'13px', fontWeight:700, margin:'0 0 1px' }}>{t.name}</p>
                    <p style={{ color:'rgba(232,245,236,0.3)', fontSize:'11px', margin:0 }}>{t.role}{t.company?`, ${t.company}`:''}</p>
                  </div>
                </div>
                <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:'4px' }}>
                  <span style={{ padding:'3px 8px', borderRadius:'6px', background:t.approved?'rgba(82,183,136,0.1)':'rgba(255,202,40,0.1)', color:t.approved?'#52b788':'#ffca28', fontSize:'10px', fontWeight:700, border:`1px solid ${t.approved?'rgba(82,183,136,0.25)':'rgba(255,202,40,0.25)'}` }}>
                    {t.approved?'✓ Approved':'⏳ Pending'}
                  </span>
                  <span style={{ color:'#ffca28', fontSize:'11px' }}>{'★'.repeat(t.rating)}</span>
                </div>
              </div>

              {/* Quote */}
              <p style={{ color:'rgba(232,245,236,0.6)', fontSize:'12px', lineHeight:1.7, margin:'0 0 12px', fontStyle:'italic', display:'-webkit-box', WebkitLineClamp:3, WebkitBoxOrient:'vertical', overflow:'hidden' }}>
                &ldquo;{t.quote}&rdquo;
              </p>

              {/* Tags */}
              <div style={{ display:'flex', gap:'6px', flexWrap:'wrap', marginBottom:'12px' }}>
                {t.service && <span style={{ padding:'2px 8px', borderRadius:'6px', background:'rgba(82,183,136,0.07)', color:'#52b788', fontSize:'10px', fontWeight:600 }}>{t.service}</span>}
                {t.metric && <span style={{ padding:'2px 8px', borderRadius:'6px', background:'rgba(0,229,255,0.07)', color:'#00e5ff', fontSize:'10px', fontWeight:700 }}>{t.metric} {t.metricLabel}</span>}
                <span style={{ padding:'2px 8px', borderRadius:'6px', background:'rgba(232,245,236,0.04)', color:'rgba(232,245,236,0.3)', fontSize:'10px' }}>{fmt(t.createdAt)}</span>
              </div>

              {/* Show on Website Toggle */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', background: 'rgba(82,183,136,0.02)', padding: '6px 12px', borderRadius: '10px', border: '1px solid rgba(82,183,136,0.05)' }}>
                <span style={{ color: 'rgba(232,245,236,0.45)', fontSize: '11px', fontWeight: 600 }}>Show on Website</span>
                <button
                  onClick={() => toggleShowOnWebsite(t._id, t.showOnWebsite !== false ? false : true)}
                  style={{
                    border: 'none',
                    background: t.showOnWebsite !== false ? 'rgba(82,183,136,0.12)' : 'rgba(255,107,107,0.08)',
                    color: t.showOnWebsite !== false ? '#52b788' : '#ff6b6b',
                    padding: '3px 8px',
                    borderRadius: '6px',
                    fontSize: '10px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  {t.showOnWebsite !== false ? '✓ Yes' : '✕ No'}
                </button>
              </div>

              {/* Actions */}
              <div style={{ display:'flex', gap:'8px' }}>
                <button onClick={()=>setSelected(t)}
                  style={{ flex:1, padding:'8px', borderRadius:'9px', border:'1px solid rgba(82,183,136,0.18)', background:'transparent', color:'rgba(232,245,236,0.45)', fontSize:'12px', cursor:'pointer' }}>
                  View
                </button>
                <button onClick={()=>toggleApprove(t._id, !t.approved)}
                  style={{ flex:2, padding:'8px', borderRadius:'9px', border:`1px solid ${t.approved?'rgba(255,107,107,0.25)':'rgba(82,183,136,0.35)'}`, background:t.approved?'rgba(255,107,107,0.08)':'rgba(82,183,136,0.1)', color:t.approved?'#ff6b6b':'#52b788', fontSize:'12px', fontWeight:700, cursor:'pointer' }}>
                  {t.approved?'Reject':'Approve'}
                </button>
                <button onClick={()=>setDeleteConfirm(t._id)}
                  style={{ padding:'8px 12px', borderRadius:'9px', border:'1px solid rgba(255,107,107,0.2)', background:'rgba(255,107,107,0.06)', color:'#ff6b6b', fontSize:'12px', cursor:'pointer' }}>
                  🗑
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* View Modal */}
      <AnimatePresence>
        {selected && (
          <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.8)', backdropFilter:'blur(10px)', zIndex:50, display:'flex', alignItems:'center', justifyContent:'center', padding:'20px' }}
            onClick={e=>{if(e.target===e.currentTarget)setSelected(null);}}>
            <motion.div initial={{opacity:0,scale:0.95}} animate={{opacity:1,scale:1}} exit={{opacity:0,scale:0.95}}
              style={{ background:'rgba(5,12,9,0.99)', border:'1px solid rgba(82,183,136,0.2)', borderRadius:'20px', padding:'32px', maxWidth:'520px', width:'100%', maxHeight:'88vh', overflowY:'auto', position:'relative' }}>
              <div style={{ position:'absolute', top:0, left:0, right:0, height:'2px', background:'linear-gradient(90deg,transparent,#52b788,transparent)', borderRadius:'20px 20px 0 0' }} />
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'20px' }}>
                <h3 style={{ color:'#e8f5ec', fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:'1.1rem', margin:0 }}>Testimonial Details</h3>
                <button onClick={()=>setSelected(null)} style={{ background:'none', border:'none', color:'rgba(232,245,236,0.35)', fontSize:'20px', cursor:'pointer' }}>×</button>
              </div>
              <div style={{ display:'flex', alignItems:'center', gap:'12px', marginBottom:'20px', padding:'16px', background:'rgba(82,183,136,0.04)', borderRadius:'12px' }}>
                {selected.avatarImage ? (
                  <img src={selected.avatarImage} alt={selected.name} style={{ width:52, height:52, borderRadius:'50%', objectFit:'cover', border:'2px solid rgba(82,183,136,0.3)' }} />
                ) : (
                  <div style={{ width:52, height:52, borderRadius:'50%', background:'rgba(82,183,136,0.12)', border:'1px solid rgba(82,183,136,0.3)', display:'flex', alignItems:'center', justifyContent:'center', color:'#52b788', fontWeight:800, fontSize:'16px' }}>
                    {selected.name.slice(0,2).toUpperCase()}
                  </div>
                )}
                <div>
                  <p style={{ color:'#e8f5ec', fontWeight:700, fontSize:'14px', margin:'0 0 2px' }}>{selected.name}</p>
                  <p style={{ color:'rgba(232,245,236,0.4)', fontSize:'12px', margin:0 }}>{selected.role}{selected.company?`, ${selected.company}`:''}</p>
                  <span style={{ color:'#ffca28', fontSize:'13px' }}>{'★'.repeat(selected.rating)}</span>
                </div>
              </div>
              {[
                ['Service', selected.service || '—'],
                ['Metric', selected.metric ? `${selected.metric} ${selected.metricLabel}` : '—'],
                ['Status', selected.approved ? 'Approved' : 'Pending Approval'],
                ['Show on Website', selected.showOnWebsite !== false ? 'Yes' : 'No'],
                ['Date', fmt(selected.createdAt)]
              ].map(([l,v],i)=>(
                <div key={i} style={{ display:'flex', justifyContent:'space-between', padding:'9px 0', borderBottom:'1px solid rgba(82,183,136,0.05)' }}>
                  <span style={{ color:'rgba(232,245,236,0.3)', fontSize:'12px' }}>{l}</span>
                  <span style={{ color:'#e8f5ec', fontSize:'12px', fontWeight:600 }}>{v}</span>
                </div>
              ))}
              <div style={{ marginTop:'14px' }}>
                <p style={{ color:'rgba(232,245,236,0.3)', fontSize:'11px', marginBottom:'8px' }}>Full Review</p>
                <p style={{ color:'rgba(232,245,236,0.7)', fontSize:'13px', lineHeight:1.8, fontStyle:'italic', background:'rgba(82,183,136,0.04)', borderRadius:'10px', padding:'14px', margin:0 }}>&ldquo;{selected.quote}&rdquo;</p>
              </div>
              <div style={{ display:'flex', gap:'10px', marginTop:'20px' }}>
                <button onClick={()=>toggleApprove(selected._id,!selected.approved)}
                  style={{ flex:2, padding:'12px', borderRadius:'12px', background:selected.approved?'rgba(255,107,107,0.1)':'rgba(82,183,136,0.15)', border:`1px solid ${selected.approved?'rgba(255,107,107,0.25)':'rgba(82,183,136,0.35)'}`, color:selected.approved?'#ff6b6b':'#52b788', fontWeight:700, fontSize:'13px', cursor:'pointer' }}>
                  {selected.approved?'Reject Review':'Approve Review'}
                </button>
                <button onClick={()=>toggleShowOnWebsite(selected._id, selected.showOnWebsite !== false ? false : true)}
                  style={{ flex:2, padding:'12px', borderRadius:'12px', background:selected.showOnWebsite !== false ? 'rgba(255,107,107,0.1)' : 'rgba(82,183,136,0.15)', border:`1px solid ${selected.showOnWebsite !== false ? 'rgba(255,107,107,0.25)' : 'rgba(82,183,136,0.35)'}`, color:selected.showOnWebsite !== false ? '#ff6b6b' : '#52b788', fontWeight:700, fontSize:'13px', cursor:'pointer' }}>
                  {selected.showOnWebsite !== false ? 'Hide from Site' : 'Show on Site'}
                </button>
                <button onClick={()=>{setSelected(null);setDeleteConfirm(selected._id);}}
                  style={{ flex:1, padding:'12px', borderRadius:'12px', background:'rgba(255,107,107,0.08)', border:'1px solid rgba(255,107,107,0.2)', color:'#ff6b6b', fontSize:'13px', cursor:'pointer' }}>Delete</button>
                <button onClick={()=>setSelected(null)}
                  style={{ flex:1, padding:'12px', borderRadius:'12px', border:'1px solid rgba(82,183,136,0.15)', background:'transparent', color:'rgba(232,245,236,0.4)', fontSize:'13px', cursor:'pointer' }}>Close</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {deleteConfirm && (
          <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.8)', backdropFilter:'blur(10px)', zIndex:50, display:'flex', alignItems:'center', justifyContent:'center', padding:'20px' }}>
            <motion.div initial={{opacity:0,scale:0.95}} animate={{opacity:1,scale:1}} exit={{opacity:0,scale:0.95}}
              style={{ background:'rgba(5,12,9,0.99)', border:'1px solid rgba(255,107,107,0.2)', borderRadius:'20px', padding:'32px', maxWidth:'360px', width:'100%', textAlign:'center' }}>
              <p style={{ fontSize:'40px', margin:'0 0 14px' }}>🗑</p>
              <h3 style={{ color:'#e8f5ec', fontWeight:800, margin:'0 0 8px' }}>Delete Testimonial?</h3>
              <p style={{ color:'rgba(232,245,236,0.35)', fontSize:'13px', margin:'0 0 20px' }}>This cannot be undone.</p>
              <div style={{ display:'flex', gap:'10px' }}>
                <button onClick={()=>deleteItem(deleteConfirm)} style={{ flex:1, padding:'12px', borderRadius:'12px', background:'#ff6b6b', border:'none', color:'#fff', fontWeight:700, fontSize:'13px', cursor:'pointer' }}>Delete</button>
                <button onClick={()=>setDeleteConfirm(null)} style={{ flex:1, padding:'12px', borderRadius:'12px', border:'1px solid rgba(82,183,136,0.15)', background:'transparent', color:'rgba(232,245,236,0.4)', fontSize:'13px', cursor:'pointer' }}>Cancel</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}