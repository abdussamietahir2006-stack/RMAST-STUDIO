'use client';
import { useState, useEffect, useCallback, Fragment } from 'react';
import api from '@/lib/api';

function Field({ label, name, value, onChange, multiline = false }: { label:string; name:string; value:string; onChange:(n:string,v:string)=>void; multiline?:boolean }) {
  return (
    <div>
      <label style={{ display:'block', color:'rgba(232,245,236,0.35)', fontSize:'10px', fontWeight:700, letterSpacing:'2px', textTransform:'uppercase', marginBottom:'7px' }}>{label}</label>
      {multiline ? (
        <textarea value={value} onChange={e=>onChange(name,e.target.value)} rows={3}
          style={{ width:'100%', background:'rgba(82,183,136,0.04)', border:'1px solid rgba(82,183,136,0.15)', borderRadius:'10px', padding:'11px 14px', color:'#e8f5ec', fontSize:'13px', outline:'none', resize:'vertical', boxSizing:'border-box', fontFamily:'inherit', transition:'border-color 0.2s' }}
          onFocus={e=>e.target.style.borderColor='rgba(82,183,136,0.45)'} onBlur={e=>e.target.style.borderColor='rgba(82,183,136,0.15)'} />
      ) : (
        <input value={value} onChange={e=>onChange(name,e.target.value)}
          style={{ width:'100%', background:'rgba(82,183,136,0.04)', border:'1px solid rgba(82,183,136,0.15)', borderRadius:'10px', padding:'11px 14px', color:'#e8f5ec', fontSize:'13px', outline:'none', boxSizing:'border-box', transition:'border-color 0.2s' }}
          onFocus={e=>e.target.style.borderColor='rgba(82,183,136,0.45)'} onBlur={e=>e.target.style.borderColor='rgba(82,183,136,0.15)'} />
      )}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ background:'rgba(11,20,16,0.85)', border:'1px solid rgba(82,183,136,0.07)', borderRadius:'16px', padding:'24px', display:'flex', flexDirection:'column', gap:'16px' }}>
      <h2 style={{ color:'#e8f5ec', fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:'14px', margin:0, display:'flex', alignItems:'center', gap:'8px' }}>
        <span style={{ width:6, height:6, borderRadius:'50%', background:'#52b788', display:'inline-block', boxShadow:'0 0 6px #52b788' }} />{title}
      </h2>
      {children}
    </div>
  );
}

const defaultForm = {
  logo: 'RMAST',
  link1Label:'Home',     link1Href:'/',
  link2Label:'About',    link2Href:'/about',
  link3Label:'Services', link3Href:'/services',
  link4Label:'Projects', link4Href:'/projects',
  ctaLabel:'Hire Me', ctaHref:'/contact',
};

export default function CMSNavbar() {
  const [form,    setForm]    = useState(defaultForm);
  const [saved,   setSaved]   = useState(false);
  const [saving,  setSaving]  = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/api/cms/navbar')
      .then(res => { if (res.data.data?.content) setForm(p=>({...p,...res.data.data.content})); })
      .catch(()=>{}).finally(()=>setLoading(false));
  }, []);

  const set = useCallback((name:string, value:string) => setForm(f=>({...f,[name]:value})), []);

  const save = async () => {
    setSaving(true);
    try { await api.put('/api/cms/navbar', { content: form }); setSaved(true); setTimeout(()=>setSaved(false),3000); }
    catch { alert('Save failed.'); } finally { setSaving(false); }
  };

  const SaveBtn = ({ cls='' }: { cls?:string }) => (
    <button onClick={save} disabled={saving}
      style={{ padding:'10px 24px', borderRadius:'10px', background:saved?'rgba(82,183,136,0.2)':'linear-gradient(135deg,#52b788,#2d6a4f)', border:saved?'1px solid rgba(82,183,136,0.4)':'none', color:saved?'#52b788':'#07130f', fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:'13px', cursor:saving?'not-allowed':'pointer', opacity:saving?0.7:1, transition:'all 0.3s' }}>
      {saving?'Saving...':saved?'✓ Saved!':'Save Changes'}
    </button>
  );

  if (loading) return <p style={{ color:'rgba(232,245,236,0.3)', fontSize:'13px' }}>Loading...</p>;

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:'24px', maxWidth:'800px' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:'12px' }}>
        <div>
          <h1 style={{ fontFamily:"'Syne',sans-serif", color:'#e8f5ec', fontSize:'1.4rem', fontWeight:800, margin:'0 0 4px' }}>Edit Navbar</h1>
          <p style={{ color:'rgba(232,245,236,0.3)', fontSize:'12px', margin:0 }}>Changes reflect live on the website</p>
        </div>
        <SaveBtn />
      </div>

      <Section title="Logo">
        <Field label="Logo Text" name="logo" value={form.logo} onChange={set} />
      </Section>

      <Section title="Navigation Links">
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px' }}>
          {[1,2,3,4].map(n=>(
            <Fragment key={n}>
              <Field label={`Link ${n} Label`} name={`link${n}Label`} value={(form as any)[`link${n}Label`]} onChange={set} />
              <Field label={`Link ${n} URL`}   name={`link${n}Href`}  value={(form as any)[`link${n}Href`]}  onChange={set} />
            </Fragment>
          ))}
        </div>
      </Section>

      <Section title="CTA Button">
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px' }}>
          <Field label="Button Label" name="ctaLabel" value={form.ctaLabel} onChange={set} />
          <Field label="Button URL"   name="ctaHref"  value={form.ctaHref}  onChange={set} />
        </div>
      </Section>

      <div style={{ display:'flex', justifyContent:'flex-end' }}><SaveBtn /></div>
    </div>
  );
}