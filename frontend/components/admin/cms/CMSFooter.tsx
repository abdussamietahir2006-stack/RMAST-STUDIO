'use client';
import { useState, useEffect, useCallback, Fragment } from 'react';
import api from '@/lib/api';

function Field({ label, name, value, onChange, multiline=false }: { label:string; name:string; value:string; onChange:(n:string,v:string)=>void; multiline?:boolean }) {
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
  logo:'RMAST',
  tagline:'Full-Stack Developer · Designer · AI Automation',
  description:'Building world-class digital experiences — from stunning interfaces and 3D visualizations to AI-powered automations that actually move the needle.',
  email:'hello@rmast.dev',
  phone:'+1 (000) 000-0000',
  location:'Available Worldwide · Remote First',
  link1Label:'Home',     link1Href:'/',
  link2Label:'About',    link2Href:'/about',
  link3Label:'Services', link3Href:'/services',
  link4Label:'Projects', link4Href:'/projects',
  link5Label:'Contact',  link5Href:'/contact',
  githubUrl:'https://github.com',
  linkedinUrl:'https://linkedin.com',
  twitterUrl:'https://twitter.com',
  instagramUrl:'https://instagram.com',
  facebookUrl:'https://facebook.com',
  copyright:'RMAST. All rights reserved.',
};

export default function CMSFooter() {
  const [form,    setForm]    = useState(defaultForm);
  const [saved,   setSaved]   = useState(false);
  const [saving,  setSaving]  = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/api/cms/footer')
      .then(res => { if (res.data.data?.content) setForm(p=>({...p,...res.data.data.content})); })
      .catch(()=>{}).finally(()=>setLoading(false));
  }, []);

  const set = useCallback((name:string, value:string) => setForm(f=>({...f,[name]:value})), []);

  const save = async () => {
    setSaving(true);
    try { await api.put('/api/cms/footer', { content: form }); setSaved(true); setTimeout(()=>setSaved(false),3000); }
    catch { alert('Save failed.'); } finally { setSaving(false); }
  };

  const SaveBtn = () => (
    <button onClick={save} disabled={saving}
      style={{ padding:'10px 24px', borderRadius:'10px', background:saved?'rgba(82,183,136,0.2)':'linear-gradient(135deg,#52b788,#2d6a4f)', border:saved?'1px solid rgba(82,183,136,0.4)':'none', color:saved?'#52b788':'#07130f', fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:'13px', cursor:saving?'not-allowed':'pointer', opacity:saving?0.7:1 }}>
      {saving?'Saving...':saved?'✓ Saved!':'Save Changes'}
    </button>
  );

  if (loading) return <p style={{ color:'rgba(232,245,236,0.3)', fontSize:'13px' }}>Loading...</p>;

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:'24px', maxWidth:'800px' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:'12px' }}>
        <div>
          <h1 style={{ fontFamily:"'Syne',sans-serif", color:'#e8f5ec', fontSize:'1.4rem', fontWeight:800, margin:'0 0 4px' }}>Edit Footer</h1>
          <p style={{ color:'rgba(232,245,236,0.3)', fontSize:'12px', margin:0 }}>Changes reflect live on the website</p>
        </div>
        <SaveBtn />
      </div>

      <Section title="Brand">
        <Field label="Logo Text"   name="logo"        value={form.logo}        onChange={set} />
        <Field label="Tagline"     name="tagline"     value={form.tagline}     onChange={set} />
        <Field label="Description" name="description" value={form.description} onChange={set} multiline />
      </Section>

      <Section title="Contact Info">
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px' }}>
          <Field label="Email"    name="email"    value={form.email}    onChange={set} />
          <Field label="Phone"    name="phone"    value={form.phone}    onChange={set} />
          <Field label="Location" name="location" value={form.location} onChange={set} />
        </div>
      </Section>

      <Section title="Quick Links">
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px' }}>
          {[1,2,3,4,5].map(n=>(
            <Fragment key={n}>
              <Field label={`Link ${n} Label`} name={`link${n}Label`} value={(form as any)[`link${n}Label`]} onChange={set} />
              <Field label={`Link ${n} URL`}   name={`link${n}Href`}  value={(form as any)[`link${n}Href`]}  onChange={set} />
            </Fragment>
          ))}
        </div>
      </Section>

      <Section title="Social Media URLs">
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px' }}>
          <Field label="GitHub URL"    name="githubUrl"    value={form.githubUrl}    onChange={set} />
          <Field label="LinkedIn URL"  name="linkedinUrl"  value={form.linkedinUrl}  onChange={set} />
          <Field label="Twitter URL"   name="twitterUrl"   value={form.twitterUrl}   onChange={set} />
          <Field label="Instagram URL" name="instagramUrl" value={form.instagramUrl} onChange={set} />
          <Field label="Facebook URL"  name="facebookUrl"  value={form.facebookUrl}  onChange={set} />
        </div>
      </Section>

      <Section title="Copyright">
        <Field label="Copyright Text" name="copyright" value={form.copyright} onChange={set} />
      </Section>

      <div style={{ display:'flex', justifyContent:'flex-end' }}><SaveBtn /></div>
    </div>
  );
}