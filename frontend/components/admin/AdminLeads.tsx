'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/lib/api';

interface Lead { _id: string; name: string; email: string; company?: string; phone?: string; message: string; source: string; status: string; createdAt: string; service?: string; }

const statusColor = (s: string) => ({ new:'#52b788', contacted:'#00e5ff', qualified:'#ffca28', converted:'#76ff03', lost:'#ff6b6b' }[s] || 'rgba(232,245,236,0.3)');
const fmt = (d: string) => new Date(d).toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric' });

export default function AdminLeads() {
  const [leads, setLeads]             = useState<Lead[]>([]);
  const [loading, setLoading]         = useState(true);
  const [filter, setFilter]           = useState('all');
  const [selected, setSelected]       = useState<Lead | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const fetch_ = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/leads', { params: { status: filter === 'all' ? undefined : filter, limit: 50 } });
      setLeads(res.data.data?.leads || []);
    } catch { setLeads([]); } finally { setLoading(false); }
  };

  useEffect(() => { fetch_(); }, [filter]);

  const markStatus = async (id: string, status: string) => {
    await api.patch(`/api/leads/${id}/status`, { status });
    fetch_(); setSelected(null);
  };

  const deleteLead = async (id: string) => {
    await api.delete(`/api/leads/${id}`);
    setDeleteConfirm(null); setSelected(null); fetch_();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontFamily:"'Syne',sans-serif", color:'#e8f5ec', fontSize:'1.4rem', fontWeight:800, margin:'0 0 2px' }}>Leads</h1>
          <p style={{ color:'rgba(232,245,236,0.3)', fontSize:'12px', margin:0 }}>All contact form submissions</p>
        </div>
        <div style={{ display:'flex', gap:'8px', flexWrap:'wrap' }}>
          {['all','new','contacted','qualified','converted','lost'].map(f => (
            <button key={f} onClick={()=>setFilter(f)}
              style={{ padding:'6px 14px', borderRadius:'8px', border:`1px solid ${filter===f?'rgba(82,183,136,0.5)':'rgba(82,183,136,0.12)'}`, background:filter===f?'rgba(82,183,136,0.12)':'transparent', color:filter===f?'#52b788':'rgba(232,245,236,0.35)', fontSize:'11px', fontWeight:700, cursor:'pointer', textTransform:'capitalize', transition:'all 0.2s' }}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(120px, 1fr))', gap:'12px' }}>
        {[
          { label:'Total', value:leads.length, color:'#e8f5ec' },
          { label:'New', value:leads.filter(l=>l.status==='new').length, color:'#52b788' },
          { label:'Contacted', value:leads.filter(l=>l.status==='contacted').length, color:'#00e5ff' },
          { label:'Converted', value:leads.filter(l=>l.status==='converted').length, color:'#76ff03' },
        ].map((s,i) => (
          <div key={i} style={{ padding:'14px', borderRadius:'12px', background:'rgba(11,20,16,0.85)', border:'1px solid rgba(82,183,136,0.07)', textAlign:'center' }}>
            <p style={{ color:s.color, fontSize:'1.6rem', fontFamily:"'Syne',sans-serif", fontWeight:800, margin:'0 0 2px' }}>{s.value}</p>
            <p style={{ color:'rgba(232,245,236,0.3)', fontSize:'11px', margin:0 }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div style={{ borderRadius:'16px', background:'rgba(11,20,16,0.85)', border:'1px solid rgba(82,183,136,0.07)', overflow:'hidden' }}>
        <div style={{ overflowX:'auto' }}>
          <table style={{ width:'100%', borderCollapse:'collapse' }}>
            <thead>
              <tr style={{ borderBottom:'1px solid rgba(82,183,136,0.07)' }}>
                {['Name','Email','Service / Source','Date','Status','Actions'].map(h=>(
                  <th key={h} style={{ padding:'12px 16px', textAlign:'left', color:'rgba(232,245,236,0.2)', fontSize:'10px', fontWeight:700, letterSpacing:'2px', textTransform:'uppercase', whiteSpace:'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} style={{ padding:'48px', textAlign:'center', color:'rgba(232,245,236,0.2)', fontSize:'13px' }}>Loading...</td></tr>
              ) : leads.length===0 ? (
                <tr><td colSpan={6} style={{ padding:'48px', textAlign:'center', color:'rgba(232,245,236,0.2)', fontSize:'13px' }}>No leads found.</td></tr>
              ) : leads.map((lead,i) => (
                <motion.tr key={lead._id} initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{delay:i*0.03}}
                  style={{ borderBottom:'1px solid rgba(82,183,136,0.04)' }}>
                  <td style={{ padding:'12px 16px' }}>
                    <p style={{ color:'#e8f5ec', fontSize:'13px', fontWeight:600, margin:'0 0 1px' }}>{lead.name}</p>
                    <p style={{ color:'rgba(232,245,236,0.25)', fontSize:'11px', margin:0 }}>{lead.company||'—'}</p>
                  </td>
                  <td style={{ padding:'12px 16px', color:'rgba(232,245,236,0.45)', fontSize:'13px' }}>{lead.email}</td>
                  <td style={{ padding:'12px 16px' }}>
                    <p style={{ margin: 0, fontSize:'13px', color: '#e8f5ec' }}>{lead.service || '—'}</p>
                    <p style={{ margin: 0, color:'rgba(232,245,236,0.25)', fontSize:'11px' }}>Source: {lead.source}</p>
                  </td>
                  <td style={{ padding:'12px 16px', color:'rgba(232,245,236,0.25)', fontSize:'12px', whiteSpace:'nowrap' }}>{fmt(lead.createdAt)}</td>
                  <td style={{ padding:'12px 16px' }}>
                    <span style={{ padding:'3px 9px', borderRadius:'6px', background:`${statusColor(lead.status)}12`, color:statusColor(lead.status), fontSize:'10px', fontWeight:700, border:`1px solid ${statusColor(lead.status)}28`, textTransform:'capitalize' }}>{lead.status}</span>
                  </td>
                  <td style={{ padding:'12px 16px' }}>
                    <div style={{ display:'flex', gap:'6px' }}>
                      <button onClick={()=>setSelected(lead)} style={{ padding:'5px 10px', borderRadius:'7px', border:'1px solid rgba(82,183,136,0.18)', background:'transparent', color:'rgba(232,245,236,0.45)', fontSize:'11px', cursor:'pointer' }}>View</button>
                      {lead.status==='new' && <button onClick={()=>markStatus(lead._id,'contacted')} style={{ padding:'5px 10px', borderRadius:'7px', border:'1px solid rgba(82,183,136,0.3)', background:'rgba(82,183,136,0.08)', color:'#52b788', fontSize:'11px', cursor:'pointer' }}>Contacted</button>}
                      <button onClick={()=>setDeleteConfirm(lead._id)} style={{ padding:'5px 10px', borderRadius:'7px', border:'1px solid rgba(255,107,107,0.2)', background:'rgba(255,107,107,0.06)', color:'#ff6b6b', fontSize:'11px', cursor:'pointer' }}>Delete</button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Modal */}
      <AnimatePresence>
        {selected && (
          <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.75)', backdropFilter:'blur(8px)', zIndex:50, display:'flex', alignItems:'center', justifyContent:'center', padding:'20px' }}
            onClick={e=>{ if(e.target===e.currentTarget) setSelected(null); }}>
            <motion.div initial={{opacity:0,scale:0.95}} animate={{opacity:1,scale:1}} exit={{opacity:0,scale:0.95}}
              style={{ background:'rgba(5,12,9,0.99)', border:'1px solid rgba(82,183,136,0.2)', borderRadius:'20px', padding:'32px', maxWidth:'480px', width:'100%', position:'relative' }}>
              <div style={{ position:'absolute', top:0, left:0, right:0, height:'2px', background:'linear-gradient(90deg, transparent, #52b788, transparent)', borderRadius:'20px 20px 0 0' }} />
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'20px' }}>
                <h3 style={{ color:'#e8f5ec', fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:'1.1rem', margin:0 }}>Lead Details</h3>
                <button onClick={()=>setSelected(null)} style={{ background:'none', border:'none', color:'rgba(232,245,236,0.35)', fontSize:'20px', cursor:'pointer', lineHeight:1 }}>×</button>
              </div>
              {[
                ['Name', selected.name],
                ['Email', selected.email],
                ['Phone', selected.phone || '—'],
                ['Company', selected.company || '—'],
                ['Service Needed', selected.service || '—'],
                ['Source', selected.source],
                ['Status', selected.status],
                ['Date Received', fmt(selected.createdAt)]
              ].map(([l,v],i)=>(
                <div key={i} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'9px 0', borderBottom:'1px solid rgba(82,183,136,0.05)' }}>
                  <span style={{ color:'rgba(232,245,236,0.3)', fontSize:'12px' }}>{l}</span>
                  <span style={{ color:'#e8f5ec', fontSize:'12px', fontWeight:600, textTransform: l === 'Email' ? 'none' : 'capitalize' }}>{v}</span>
                </div>
              ))}
              <div style={{ marginTop:'14px' }}>
                <p style={{ color:'rgba(232,245,236,0.3)', fontSize:'11px', marginBottom:'8px' }}>Message</p>
                <p style={{ color:'rgba(232,245,236,0.65)', fontSize:'13px', lineHeight:1.7, background:'rgba(82,183,136,0.04)', borderRadius:'10px', padding:'12px', margin:0 }}>{selected.message}</p>
              </div>
              <div style={{ display:'flex', gap:'10px', marginTop:'20px' }}>
                {selected.status==='new' && <button onClick={()=>markStatus(selected._id,'contacted')} style={{ flex:1, padding:'11px', borderRadius:'12px', background:'#52b788', border:'none', color:'#07130f', fontWeight:700, fontSize:'13px', cursor:'pointer' }}>Mark Contacted</button>}
                <button onClick={()=>{setSelected(null);setDeleteConfirm(selected._id);}} style={{ flex:1, padding:'11px', borderRadius:'12px', background:'rgba(255,107,107,0.08)', border:'1px solid rgba(255,107,107,0.2)', color:'#ff6b6b', fontSize:'13px', cursor:'pointer' }}>Delete</button>
                <button onClick={()=>setSelected(null)} style={{ flex:1, padding:'11px', borderRadius:'12px', border:'1px solid rgba(82,183,136,0.15)', background:'transparent', color:'rgba(232,245,236,0.4)', fontSize:'13px', cursor:'pointer' }}>Close</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirm */}
      <AnimatePresence>
        {deleteConfirm && (
          <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.75)', backdropFilter:'blur(8px)', zIndex:50, display:'flex', alignItems:'center', justifyContent:'center', padding:'20px' }}>
            <motion.div initial={{opacity:0,scale:0.95}} animate={{opacity:1,scale:1}} exit={{opacity:0,scale:0.95}}
              style={{ background:'rgba(5,12,9,0.99)', border:'1px solid rgba(255,107,107,0.2)', borderRadius:'20px', padding:'32px', maxWidth:'360px', width:'100%', textAlign:'center' }}>
              <p style={{ fontSize:'40px', margin:'0 0 14px' }}>🗑</p>
              <h3 style={{ color:'#e8f5ec', fontWeight:800, margin:'0 0 8px' }}>Delete Lead?</h3>
              <p style={{ color:'rgba(232,245,236,0.35)', fontSize:'13px', margin:'0 0 20px' }}>This action cannot be undone.</p>
              <div style={{ display:'flex', gap:'10px' }}>
                <button onClick={()=>deleteLead(deleteConfirm)} style={{ flex:1, padding:'12px', borderRadius:'12px', background:'#ff6b6b', border:'none', color:'#fff', fontWeight:700, fontSize:'13px', cursor:'pointer' }}>Yes, Delete</button>
                <button onClick={()=>setDeleteConfirm(null)} style={{ flex:1, padding:'12px', borderRadius:'12px', border:'1px solid rgba(82,183,136,0.15)', background:'transparent', color:'rgba(232,245,236,0.4)', fontSize:'13px', cursor:'pointer' }}>Cancel</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}