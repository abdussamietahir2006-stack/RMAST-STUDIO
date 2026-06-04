'use client';
import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/lib/api';

interface Project { _id: string; title: string; desc?: string; category: string; image?: string; stack: string[]; link?: string; github?: string; year?: string; featured: boolean; order: number; }

const CATEGORIES = ['Web','3D','AI','General'];
const EMPTY: Omit<Project,'_id'> = { title:'', desc:'', category:'Web', image:'', stack:[], link:'', github:'', year:new Date().getFullYear().toString(), featured:false, order:0 };

export default function AdminProjects() {
  const [projects, setProjects]     = useState<Project[]>([]);
  const [loading, setLoading]       = useState(true);
  const [showForm, setShowForm]     = useState(false);
  const [editing, setEditing]       = useState<Project | null>(null);
  const [form, setForm]             = useState<Omit<Project,'_id'>>(EMPTY);
  const [stackInput, setStackInput] = useState('');
  const [saving, setSaving]         = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [uploading, setUploading]   = useState(false);
  const imgRef = useRef<HTMLInputElement>(null);

  const fetch_ = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/projects');
      setProjects(res.data.data || []);
    } catch { setProjects([]); } finally { setLoading(false); }
  };

  useEffect(() => { fetch_(); }, []);

  const openAdd  = () => { setEditing(null); setForm(EMPTY); setStackInput(''); setShowForm(true); };
  const openEdit = (p: Project) => { setEditing(p); setForm({ title:p.title, desc:p.desc||'', category:p.category, image:p.image||'', stack:p.stack, link:p.link||'', github:p.github||'', year:p.year||'', featured:p.featured, order:p.order }); setStackInput(p.stack.join(', ')); setShowForm(true); };

  const handleImage = async (file: File) => {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('image', file);
      const res = await api.post('/api/cms/upload/image', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      setForm(f => ({ ...f, image: res.data.data?.url || '' }));
    } catch { alert('Image upload failed. Check Cloudinary credentials.'); }
    finally { setUploading(false); }
  };

  const save = async () => {
    if (!form.title.trim()) return alert('Title is required.');
    setSaving(true);
    const payload = { ...form, stack: stackInput.split(',').map(s=>s.trim()).filter(Boolean) };
    try {
      if (editing) await api.put(`/api/projects/${editing._id}`, payload);
      else         await api.post('/api/projects', payload);
      setShowForm(false); fetch_();
    } catch { alert('Save failed.'); }
    finally { setSaving(false); }
  };

  const deleteProject = async (id: string) => {
    await api.delete(`/api/projects/${id}`);
    setDeleteConfirm(null); fetch_();
  };

  const toggleFeatured = async (p: Project) => {
    await api.put(`/api/projects/${p._id}`, { ...p, featured: !p.featured });
    fetch_();
  };

  const inp = (label: string, key: keyof typeof form, placeholder?: string, multiline?: boolean) => (
    <div>
      <label style={{ display:'block', color:'rgba(232,245,236,0.35)', fontSize:'10px', fontWeight:700, letterSpacing:'2px', textTransform:'uppercase', marginBottom:'7px' }}>{label}</label>
      {multiline ? (
        <textarea value={form[key] as string} onChange={e=>setForm(f=>({...f,[key]:e.target.value}))} placeholder={placeholder} rows={3}
          style={{ width:'100%', background:'rgba(82,183,136,0.04)', border:'1px solid rgba(82,183,136,0.15)', borderRadius:'10px', padding:'11px 14px', color:'#e8f5ec', fontSize:'13px', outline:'none', resize:'vertical', boxSizing:'border-box', fontFamily:'inherit' }}
          onFocus={e=>e.target.style.borderColor='rgba(82,183,136,0.45)'} onBlur={e=>e.target.style.borderColor='rgba(82,183,136,0.15)'} />
      ) : (
        <input value={form[key] as string} onChange={e=>setForm(f=>({...f,[key]:e.target.value}))} placeholder={placeholder}
          style={{ width:'100%', background:'rgba(82,183,136,0.04)', border:'1px solid rgba(82,183,136,0.15)', borderRadius:'10px', padding:'11px 14px', color:'#e8f5ec', fontSize:'13px', outline:'none', boxSizing:'border-box' }}
          onFocus={e=>e.target.style.borderColor='rgba(82,183,136,0.45)'} onBlur={e=>e.target.style.borderColor='rgba(82,183,136,0.15)'} />
      )}
    </div>
  );

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:'20px' }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:'12px' }}>
        <div>
          <h1 style={{ fontFamily:"'Syne',sans-serif", color:'#e8f5ec', fontSize:'1.4rem', fontWeight:800, margin:'0 0 2px' }}>Projects</h1>
          <p style={{ color:'rgba(232,245,236,0.3)', fontSize:'12px', margin:0 }}>Portfolio projects — shown on the public site</p>
        </div>
        <button onClick={openAdd}
          style={{ padding:'10px 20px', borderRadius:'10px', background:'linear-gradient(135deg,#52b788,#2d6a4f)', border:'none', color:'#07130f', fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:'13px', cursor:'pointer', display:'flex', alignItems:'center', gap:'6px' }}>
          + Add Project
        </button>
      </div>

      {/* Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(120px,1fr))', gap:'12px' }}>
        {[
          { label:'Total',    value:projects.length,                          color:'#e8f5ec' },
          { label:'Featured', value:projects.filter(p=>p.featured).length,   color:'#52b788' },
          { label:'Web',      value:projects.filter(p=>p.category==='Web').length,  color:'#00e5ff' },
          { label:'AI',       value:projects.filter(p=>p.category==='AI').length,   color:'#76ff03' },
        ].map((s,i)=>(
          <div key={i} style={{ padding:'14px', borderRadius:'12px', background:'rgba(11,20,16,0.85)', border:'1px solid rgba(82,183,136,0.07)', textAlign:'center' }}>
            <p style={{ color:s.color, fontSize:'1.6rem', fontFamily:"'Syne',sans-serif", fontWeight:800, margin:'0 0 2px' }}>{s.value}</p>
            <p style={{ color:'rgba(232,245,236,0.3)', fontSize:'11px', margin:0 }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Projects Grid */}
      {loading ? (
        <p style={{ color:'rgba(232,245,236,0.2)', fontSize:'13px', textAlign:'center', padding:'40px' }}>Loading...</p>
      ) : projects.length===0 ? (
        <div style={{ textAlign:'center', padding:'60px', borderRadius:'16px', background:'rgba(11,20,16,0.85)', border:'1px dashed rgba(82,183,136,0.15)' }}>
          <p style={{ fontSize:'36px', margin:'0 0 12px' }}>🚀</p>
          <p style={{ color:'rgba(232,245,236,0.3)', fontSize:'13px', margin:'0 0 16px' }}>No projects yet. Add your first one!</p>
          <button onClick={openAdd} style={{ padding:'10px 20px', borderRadius:'10px', background:'rgba(82,183,136,0.12)', border:'1px solid rgba(82,183,136,0.25)', color:'#52b788', fontSize:'13px', fontWeight:600, cursor:'pointer' }}>+ Add Project</button>
        </div>
      ) : (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))', gap:'16px' }}>
          {projects.map((p,i)=>(
            <motion.div key={p._id} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:i*0.05}}
              style={{ borderRadius:'16px', background:'rgba(11,20,16,0.85)', border:'1px solid rgba(82,183,136,0.1)', overflow:'hidden', position:'relative' }}>
              {/* Image */}
              <div style={{ position:'relative', height:'160px', background:'rgba(82,183,136,0.04)', overflow:'hidden' }}>
                {p.image ? (
                  <img src={p.image} alt={p.title} style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                ) : (
                  <div style={{ width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'32px', opacity:0.3 }}>🖼</div>
                )}
                <div style={{ position:'absolute', top:'10px', left:'10px', display:'flex', gap:'6px' }}>
                  <span style={{ padding:'3px 8px', borderRadius:'6px', background:'rgba(7,19,15,0.85)', color:'#52b788', fontSize:'10px', fontWeight:700, border:'1px solid rgba(82,183,136,0.3)' }}>{p.category}</span>
                  {p.featured && <span style={{ padding:'3px 8px', borderRadius:'6px', background:'rgba(255,202,40,0.15)', color:'#ffca28', fontSize:'10px', fontWeight:700, border:'1px solid rgba(255,202,40,0.3)' }}>★ Featured</span>}
                </div>
              </div>
              {/* Content */}
              <div style={{ padding:'16px' }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'6px' }}>
                  <h3 style={{ color:'#e8f5ec', fontSize:'14px', fontWeight:700, margin:0, flex:1 }}>{p.title}</h3>
                  <span style={{ color:'rgba(232,245,236,0.25)', fontSize:'11px', marginLeft:'8px' }}>{p.year}</span>
                </div>
                {p.desc && <p style={{ color:'rgba(232,245,236,0.4)', fontSize:'12px', lineHeight:1.6, margin:'0 0 10px', display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden' }}>{p.desc}</p>}
                {p.stack.length>0 && (
                  <div style={{ display:'flex', flexWrap:'wrap', gap:'5px', marginBottom:'12px' }}>
                    {p.stack.slice(0,4).map((t,j)=>(
                      <span key={j} style={{ padding:'2px 7px', borderRadius:'5px', background:'rgba(82,183,136,0.07)', color:'rgba(82,183,136,0.7)', fontSize:'10px', fontWeight:600 }}>{t}</span>
                    ))}
                    {p.stack.length>4 && <span style={{ padding:'2px 7px', borderRadius:'5px', background:'rgba(232,245,236,0.04)', color:'rgba(232,245,236,0.25)', fontSize:'10px' }}>+{p.stack.length-4}</span>}
                  </div>
                )}
                <div style={{ display:'flex', gap:'8px' }}>
                  <button onClick={()=>openEdit(p)} style={{ flex:1, padding:'8px', borderRadius:'9px', border:'1px solid rgba(82,183,136,0.2)', background:'transparent', color:'rgba(232,245,236,0.5)', fontSize:'12px', cursor:'pointer' }}>Edit</button>
                  <button onClick={()=>toggleFeatured(p)} style={{ flex:1, padding:'8px', borderRadius:'9px', border:`1px solid ${p.featured?'rgba(255,202,40,0.3)':'rgba(82,183,136,0.2)'}`, background:p.featured?'rgba(255,202,40,0.08)':'transparent', color:p.featured?'#ffca28':'rgba(232,245,236,0.4)', fontSize:'12px', cursor:'pointer' }}>
                    {p.featured?'Unfeature':'Feature'}
                  </button>
                  <button onClick={()=>setDeleteConfirm(p._id)} style={{ padding:'8px 12px', borderRadius:'9px', border:'1px solid rgba(255,107,107,0.2)', background:'rgba(255,107,107,0.06)', color:'#ff6b6b', fontSize:'12px', cursor:'pointer' }}>🗑</button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Add/Edit Form Modal */}
      <AnimatePresence>
        {showForm && (
          <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.8)', backdropFilter:'blur(10px)', zIndex:50, display:'flex', alignItems:'center', justifyContent:'center', padding:'20px' }}
            onClick={e=>{if(e.target===e.currentTarget){setShowForm(false);}}}>
            <motion.div initial={{opacity:0,scale:0.95,y:20}} animate={{opacity:1,scale:1,y:0}} exit={{opacity:0,scale:0.95}}
              style={{ background:'rgba(5,12,9,0.99)', border:'1px solid rgba(82,183,136,0.2)', borderRadius:'20px', padding:'32px', maxWidth:'560px', width:'100%', maxHeight:'90vh', overflowY:'auto', position:'relative' }}>
              <div style={{ position:'absolute', top:0, left:0, right:0, height:'2px', background:'linear-gradient(90deg,transparent,#52b788,#00e5ff,transparent)', borderRadius:'20px 20px 0 0' }} />

              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'24px' }}>
                <h3 style={{ color:'#e8f5ec', fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:'1.2rem', margin:0 }}>
                  {editing?'Edit Project':'Add New Project'}
                </h3>
                <button onClick={()=>setShowForm(false)} style={{ background:'none', border:'none', color:'rgba(232,245,236,0.35)', fontSize:'20px', cursor:'pointer' }}>×</button>
              </div>

              <div style={{ display:'flex', flexDirection:'column', gap:'16px' }}>
                {inp('Project Title','title','e.g. Portfolio Website')}
                {inp('Description','desc','Brief description of the project',true)}

                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px' }}>
                  <div>
                    <label style={{ display:'block', color:'rgba(232,245,236,0.35)', fontSize:'10px', fontWeight:700, letterSpacing:'2px', textTransform:'uppercase', marginBottom:'7px' }}>Category</label>
                    <select value={form.category} onChange={e=>setForm(f=>({...f,category:e.target.value}))}
                      style={{ width:'100%', background:'rgba(82,183,136,0.04)', border:'1px solid rgba(82,183,136,0.15)', borderRadius:'10px', padding:'11px 14px', color:'#e8f5ec', fontSize:'13px', outline:'none' }}>
                      {CATEGORIES.map(c=><option key={c} value={c} style={{background:'#07130f'}}>{c}</option>)}
                    </select>
                  </div>
                  {inp('Year','year','2024')}
                </div>

                {inp('Live URL','link','https://example.com')}
                {inp('GitHub URL','github','https://github.com/username/project')}

                {/* Tech Stack */}
                <div>
                  <label style={{ display:'block', color:'rgba(232,245,236,0.35)', fontSize:'10px', fontWeight:700, letterSpacing:'2px', textTransform:'uppercase', marginBottom:'7px' }}>Tech Stack (comma-separated)</label>
                  <input value={stackInput} onChange={e=>setStackInput(e.target.value)} placeholder="Next.js, TypeScript, MongoDB"
                    style={{ width:'100%', background:'rgba(82,183,136,0.04)', border:'1px solid rgba(82,183,136,0.15)', borderRadius:'10px', padding:'11px 14px', color:'#e8f5ec', fontSize:'13px', outline:'none', boxSizing:'border-box' }}
                    onFocus={e=>e.target.style.borderColor='rgba(82,183,136,0.45)'} onBlur={e=>e.target.style.borderColor='rgba(82,183,136,0.15)'} />
                  {stackInput && (
                    <div style={{ display:'flex', flexWrap:'wrap', gap:'5px', marginTop:'8px' }}>
                      {stackInput.split(',').map(s=>s.trim()).filter(Boolean).map((t,i)=>(
                        <span key={i} style={{ padding:'3px 8px', borderRadius:'6px', background:'rgba(82,183,136,0.08)', color:'#52b788', fontSize:'11px', fontWeight:600 }}>{t}</span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Image Upload */}
                <div>
                  <label style={{ display:'block', color:'rgba(232,245,236,0.35)', fontSize:'10px', fontWeight:700, letterSpacing:'2px', textTransform:'uppercase', marginBottom:'7px' }}>Project Image</label>
                  <div
                    onClick={()=>imgRef.current?.click()}
                    onDragOver={e=>e.preventDefault()}
                    onDrop={e=>{e.preventDefault();const f=e.dataTransfer.files[0];if(f)handleImage(f);}}
                    style={{ border:'1.5px dashed rgba(82,183,136,0.25)', borderRadius:'12px', padding:'20px', cursor:'pointer', textAlign:'center', position:'relative', overflow:'hidden', background:form.image?'transparent':'rgba(82,183,136,0.02)', transition:'border-color 0.2s' }}
                    onMouseEnter={e=>(e.currentTarget as HTMLDivElement).style.borderColor='rgba(82,183,136,0.5)'}
                    onMouseLeave={e=>(e.currentTarget as HTMLDivElement).style.borderColor='rgba(82,183,136,0.25)'}>
                    {form.image ? (
                      <div style={{ position:'relative' }}>
                        <img src={form.image} alt="preview" style={{ width:'100%', height:'140px', objectFit:'cover', borderRadius:'8px' }} />
                        <div style={{ position:'absolute', inset:0, background:'rgba(0,0,0,0)', display:'flex', alignItems:'center', justifyContent:'center', borderRadius:'8px', transition:'background 0.2s' }}
                          onMouseEnter={e=>(e.currentTarget as HTMLDivElement).style.background='rgba(0,0,0,0.5)'}
                          onMouseLeave={e=>(e.currentTarget as HTMLDivElement).style.background='rgba(0,0,0,0)'}>
                          <p style={{ color:'#fff', fontSize:'12px', fontWeight:600 }}>Click to replace</p>
                        </div>
                      </div>
                    ) : uploading ? (
                      <p style={{ color:'#52b788', fontSize:'13px', margin:0 }}>Uploading...</p>
                    ) : (
                      <>
                        <p style={{ fontSize:'28px', margin:'0 0 8px' }}>📷</p>
                        <p style={{ color:'rgba(232,245,236,0.4)', fontSize:'13px', margin:'0 0 4px' }}>Drag & drop or click to upload</p>
                        <p style={{ color:'rgba(232,245,236,0.2)', fontSize:'11px', margin:0 }}>PNG, JPG, WEBP — max 10MB</p>
                      </>
                    )}
                    <input ref={imgRef} type="file" accept="image/*" style={{ display:'none' }} onChange={e=>{const f=e.target.files?.[0];if(f)handleImage(f);}} />
                  </div>
                  {/* OR paste URL */}
                  <input value={form.image} onChange={e=>setForm(f=>({...f,image:e.target.value}))} placeholder="Or paste image URL directly..."
                    style={{ width:'100%', background:'rgba(82,183,136,0.03)', border:'1px solid rgba(82,183,136,0.1)', borderRadius:'10px', padding:'9px 14px', color:'rgba(232,245,236,0.5)', fontSize:'12px', outline:'none', boxSizing:'border-box', marginTop:'8px' }}
                    onFocus={e=>e.target.style.borderColor='rgba(82,183,136,0.35)'} onBlur={e=>e.target.style.borderColor='rgba(82,183,136,0.1)'} />
                </div>

                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px' }}>
                  <div>
                    <label style={{ display:'block', color:'rgba(232,245,236,0.35)', fontSize:'10px', fontWeight:700, letterSpacing:'2px', textTransform:'uppercase', marginBottom:'7px' }}>Display Order</label>
                    <input type="number" value={form.order} onChange={e=>setForm(f=>({...f,order:parseInt(e.target.value)||0}))}
                      style={{ width:'100%', background:'rgba(82,183,136,0.04)', border:'1px solid rgba(82,183,136,0.15)', borderRadius:'10px', padding:'11px 14px', color:'#e8f5ec', fontSize:'13px', outline:'none', boxSizing:'border-box' }} />
                  </div>
                  <div style={{ display:'flex', alignItems:'flex-end', paddingBottom:'2px' }}>
                    <label style={{ display:'flex', alignItems:'center', gap:'10px', cursor:'pointer', userSelect:'none' }}>
                      <div onClick={()=>setForm(f=>({...f,featured:!f.featured}))}
                        style={{ width:42, height:24, borderRadius:'100px', background:form.featured?'#52b788':'rgba(82,183,136,0.12)', border:`1px solid ${form.featured?'#52b788':'rgba(82,183,136,0.2)'}`, position:'relative', transition:'all 0.2s', cursor:'pointer', flexShrink:0 }}>
                        <div style={{ position:'absolute', top:2, left:form.featured?18:2, width:18, height:18, borderRadius:'50%', background:'#fff', transition:'left 0.2s', boxShadow:'0 1px 4px rgba(0,0,0,0.3)' }} />
                      </div>
                      <span style={{ color:'rgba(232,245,236,0.4)', fontSize:'12px', fontWeight:600 }}>Featured</span>
                    </label>
                  </div>
                </div>

                <div style={{ display:'flex', gap:'10px', marginTop:'8px' }}>
                  <button onClick={save} disabled={saving||uploading}
                    style={{ flex:2, padding:'13px', borderRadius:'12px', background:'linear-gradient(135deg,#52b788,#2d6a4f)', border:'none', color:'#07130f', fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:'14px', cursor:saving?'not-allowed':'pointer', opacity:saving?0.7:1 }}>
                    {saving?'Saving...':editing?'Save Changes':'Add Project'}
                  </button>
                  <button onClick={()=>setShowForm(false)}
                    style={{ flex:1, padding:'13px', borderRadius:'12px', border:'1px solid rgba(82,183,136,0.15)', background:'transparent', color:'rgba(232,245,236,0.4)', fontSize:'13px', cursor:'pointer' }}>
                    Cancel
                  </button>
                </div>
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
              <h3 style={{ color:'#e8f5ec', fontWeight:800, margin:'0 0 8px' }}>Delete Project?</h3>
              <p style={{ color:'rgba(232,245,236,0.35)', fontSize:'13px', margin:'0 0 20px' }}>This cannot be undone.</p>
              <div style={{ display:'flex', gap:'10px' }}>
                <button onClick={()=>deleteProject(deleteConfirm)} style={{ flex:1, padding:'12px', borderRadius:'12px', background:'#ff6b6b', border:'none', color:'#fff', fontWeight:700, fontSize:'13px', cursor:'pointer' }}>Delete</button>
                <button onClick={()=>setDeleteConfirm(null)} style={{ flex:1, padding:'12px', borderRadius:'12px', border:'1px solid rgba(82,183,136,0.15)', background:'transparent', color:'rgba(232,245,236,0.4)', fontSize:'13px', cursor:'pointer' }}>Cancel</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}