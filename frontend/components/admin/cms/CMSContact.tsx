'use client';
import { useState, useEffect, useCallback } from 'react';
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
  heroHeading:"Let's Work Together",
  heroSubtext:"Ready to build something extraordinary? Send a message or book a discovery call. I respond within 24 hours.",
  email:'hello@rmast.dev',
  phone:'+1 (000) 000-0000',
  responseTime:'Within 24 hours',
  availability:'Mon–Sat, Available 24 Hours',
  faq1Q:"What services do you offer?",         faq1A:"I offer full-stack web development, UI/UX design, 3D & motion work, and AI automation solutions.",
  faq2Q:"How long does a project take?",       faq2A:"Most projects range from 2–6 weeks depending on scope. I'll give you a clear timeline upfront.",
  faq3Q:"Do you work with international clients?", faq3A:"Yes! I work with clients worldwide — fully remote, any timezone.",
  faq4Q:"What tools and technologies do you use?", faq4A:"Next.js, TypeScript, MongoDB, Three.js, Framer Motion, n8n, OpenAI and many more.",
  faq5Q:"Do you offer ongoing support?",       faq5A:"Yes, I offer maintenance packages after launch for bug fixes and feature updates.",
  faq6Q:"How do we get started?",              faq6A:"Book a free discovery call or send a message. I'll review your project and send a proposal within 24 hours.",
};

export default function CMSContact() {
  const [form,    setForm]    = useState(defaultForm);
  const [saved,   setSaved]   = useState(false);
  const [saving,  setSaving]  = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/api/cms/contact')
      .then(res => { if (res.data.data?.content) setForm(p=>({...p,...res.data.data.content})); })
      .catch(()=>{}).finally(()=>setLoading(false));
  }, []);

  const set = useCallback((name:string, value:string) => setForm(f=>({...f,[name]:value})), []);

  const save = async () => {
    setSaving(true);
    try { await api.put('/api/cms/contact', { content: form }); setSaved(true); setTimeout(()=>setSaved(false),3000); }
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
          <h1 style={{ fontFamily:"'Syne',sans-serif", color:'#e8f5ec', fontSize:'1.4rem', fontWeight:800, margin:'0 0 4px' }}>Edit Contact Page</h1>
          <p style={{ color:'rgba(232,245,236,0.3)', fontSize:'12px', margin:0 }}>Changes reflect live on the website</p>
        </div>
        <SaveBtn />
      </div>

      <Section title="Hero Section">
        <Field label="Heading" name="heroHeading" value={form.heroHeading} onChange={set} />
        <Field label="Subtext" name="heroSubtext" value={form.heroSubtext} onChange={set} multiline />
      </Section>

      <Section title="Contact Information">
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px' }}>
          <Field label="Email Address" name="email"        value={form.email}        onChange={set} />
          <Field label="Phone Number"  name="phone"        value={form.phone}        onChange={set} />
          <Field label="Response Time" name="responseTime" value={form.responseTime} onChange={set} />
          <Field label="Availability"  name="availability" value={form.availability} onChange={set} />
        </div>
      </Section>

      <Section title="FAQ Section">
        {[1,2,3,4,5,6].map(n=>(
          <div key={n} style={{ display:'flex', flexDirection:'column', gap:'10px', paddingBottom:'16px', borderBottom:n<6?'1px solid rgba(82,183,136,0.06)':'none' }}>
            <p style={{ color:'rgba(82,183,136,0.6)', fontSize:'11px', fontWeight:700, margin:0, textTransform:'uppercase', letterSpacing:'1.5px' }}>FAQ {n}</p>
            <Field label="Question" name={`faq${n}Q`} value={(form as any)[`faq${n}Q`]} onChange={set} />
            <Field label="Answer"   name={`faq${n}A`} value={(form as any)[`faq${n}A`]} onChange={set} multiline />
          </div>
        ))}
      </Section>

      <div style={{ display:'flex', justifyContent:'flex-end' }}><SaveBtn /></div>
    </div>
  );
}