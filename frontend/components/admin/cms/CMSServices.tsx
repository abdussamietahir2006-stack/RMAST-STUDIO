'use client';
import { useState, useEffect, useCallback } from 'react';
import ImageDropZone from './ImageDropZone';
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
  heroHeading:'World-Class Digital Services',
  heroSubtext:'Crafting high-end digital systems that blend development, design, immersive 3D, and intelligent AI automation — built to move the needle.',

  service1Title:'Full-Stack Web Development', service1Desc:'End-to-end web applications built for speed, scale, and stunning user experience.',
  service1Bullet1:'Custom web apps & landing pages', service1Bullet2:'Next.js, React, TypeScript',
  service1Bullet3:'REST & GraphQL APIs', service1Bullet4:'Database design & optimization',

  service2Title:'UI/UX & Product Design', service2Desc:'Interfaces that don\'t just look good — they convert, retain, and delight users.',
  service2Bullet1:'Figma wireframes & prototypes', service2Bullet2:'Design systems & component libraries',
  service2Bullet3:'Mobile-first responsive design', service2Bullet4:'User research & usability testing',

  service3Title:'3D & Motion Graphics', service3Desc:'Immersive WebGL experiences and cinematic animations that make your brand unforgettable.',
  service3Bullet1:'Three.js & WebGL development', service3Bullet2:'Scroll-driven animations',
  service3Bullet3:'3D product configurators', service3Bullet4:'Particle systems & shaders',

  service4Title:'AI Automation & Workflows', service4Desc:'Intelligent automation pipelines that save your team 20+ hours per week.',
  service4Bullet1:'n8n & Make.com workflows', service4Bullet2:'LLM integration (GPT-4, Claude)',
  service4Bullet3:'Custom AI chatbots & agents', service4Bullet4:'CRM & tool integrations',

  service5Title:'E-Commerce Solutions', service5Desc:'High-converting online stores with real-time inventory and seamless checkout.',
  service5Bullet1:'Custom storefront development', service5Bullet2:'Stripe & payment integration',
  service5Bullet3:'Inventory management', service5Bullet4:'Admin dashboard & analytics',

  service6Title:'Performance & SEO', service6Desc:'Lighthouse 99 scores, sub-second load times, and SEO that drives organic growth.',
  service6Bullet1:'Core Web Vitals optimization', service6Bullet2:'Technical SEO audit & fixes',
  service6Bullet3:'CDN & caching setup', service6Bullet4:'Image & asset optimization',

  ctaHeading:"Let's Build Something Great",
  ctaSubtext:'Ready to turn your ideas into reality? I\'m currently available for new projects.',
  ctaButtonLabel:'Contact Me →',
  ctaButtonHref:'/contact',
};

const defaultImages: Record<string,string> = {
  service1Image:'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80',
  service2Image:'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=800&q=80',
  service3Image:'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80',
  service4Image:'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=800&q=80',
  service5Image:'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&q=80',
  service6Image:'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
};

export default function CMSServices() {
  const [form,         setForm]         = useState(defaultForm);
  const [images,       setImages]       = useState(defaultImages);
  const [saved,        setSaved]        = useState(false);
  const [saving,       setSaving]       = useState(false);
  const [loading,      setLoading]      = useState(true);
  const [uploadingKey, setUploadingKey] = useState<string|null>(null);

  useEffect(() => {
    api.get('/api/cms/services')
      .then(res => {
        if (res.data.data?.content) setForm(p=>({...p,...res.data.data.content}));
        if (res.data.data?.images)  setImages(p=>({...p,...res.data.data.images}));
      })
      .catch(()=>{}).finally(()=>setLoading(false));
  }, []);

  const set = useCallback((name:string, value:string) => setForm(f=>({...f,[name]:value})), []);

  const handleImageChange = useCallback((key:string) => async (_url:string, file:File) => {
    setUploadingKey(key);
    try {
      const fd = new FormData(); fd.append('image', file);
      const res = await api.post('/api/cms/upload/image', fd, { headers:{'Content-Type':'multipart/form-data'} });
      const url = res.data.data?.url;
      if (url) setImages(p=>({...p,[key]:url}));
    } catch { alert('Image upload failed.'); }
    finally { setUploadingKey(null); }
  }, []);

  const save = async () => {
    setSaving(true);
    try { await api.put('/api/cms/services', { content: form, images }); setSaved(true); setTimeout(()=>setSaved(false),3000); }
    catch { alert('Save failed.'); } finally { setSaving(false); }
  };

  const SaveBtn = () => (
    <button onClick={save} disabled={saving||!!uploadingKey}
      style={{ padding:'10px 24px', borderRadius:'10px', background:saved?'rgba(82,183,136,0.2)':'linear-gradient(135deg,#52b788,#2d6a4f)', border:saved?'1px solid rgba(82,183,136,0.4)':'none', color:saved?'#52b788':'#07130f', fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:'13px', cursor:(saving||!!uploadingKey)?'not-allowed':'pointer', opacity:(saving||!!uploadingKey)?0.7:1 }}>
      {uploadingKey?'Uploading...':saving?'Saving...':saved?'✓ Saved!':'Save Changes'}
    </button>
  );

  const ImgZone = ({ imgKey, label }: { imgKey:string; label:string }) => (
    <div style={{ position:'relative' }}>
      <ImageDropZone label={label} currentImage={images[imgKey]} onImageChange={handleImageChange(imgKey)} aspectRatio="landscape" />
      {uploadingKey===imgKey && (
        <div style={{ position:'absolute', inset:0, background:'rgba(7,19,15,0.7)', borderRadius:'14px', display:'flex', alignItems:'center', justifyContent:'center' }}>
          <p style={{ color:'#52b788', fontSize:'12px', fontWeight:700 }}>Uploading...</p>
        </div>
      )}
    </div>
  );

  if (loading) return <p style={{ color:'rgba(232,245,236,0.3)', fontSize:'13px' }}>Loading...</p>;

  const serviceNames = ['Full-Stack Web Dev','UI/UX Design','3D & Motion','AI Automation','E-Commerce','Performance & SEO'];

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:'24px', maxWidth:'800px' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:'12px' }}>
        <div>
          <h1 style={{ fontFamily:"'Syne',sans-serif", color:'#e8f5ec', fontSize:'1.4rem', fontWeight:800, margin:'0 0 4px' }}>Edit Services Page</h1>
          <p style={{ color:'rgba(232,245,236,0.3)', fontSize:'12px', margin:0 }}>Changes reflect live on the website</p>
        </div>
        <SaveBtn />
      </div>

      {/* Hero */}
      <Section title="Hero Section">
        <Field label="Heading" name="heroHeading" value={form.heroHeading} onChange={set} />
        <Field label="Subtext" name="heroSubtext" value={form.heroSubtext} onChange={set} multiline />
      </Section>

      {/* 6 Service Blocks */}
      {[1,2,3,4,5,6].map(n=>(
        <Section key={n} title={`Service ${n} — ${serviceNames[n-1]}`}>
          <ImgZone imgKey={`service${n}Image`} label={`Service ${n} Image`} />
          <Field label="Service Title"       name={`service${n}Title`}   value={(form as any)[`service${n}Title`]}   onChange={set} />
          <Field label="Service Description" name={`service${n}Desc`}    value={(form as any)[`service${n}Desc`]}    onChange={set} multiline />
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px' }}>
            {[1,2,3,4].map(b=>(
              <Field key={b} label={`Bullet ${b}`} name={`service${n}Bullet${b}`} value={(form as any)[`service${n}Bullet${b}`]} onChange={set} />
            ))}
          </div>
        </Section>
      ))}

      {/* CTA */}
      <Section title="CTA Section">
        <Field label="Heading"      name="ctaHeading"     value={form.ctaHeading}     onChange={set} />
        <Field label="Subtext"      name="ctaSubtext"     value={form.ctaSubtext}     onChange={set} multiline />
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px' }}>
          <Field label="Button Label" name="ctaButtonLabel" value={form.ctaButtonLabel} onChange={set} />
          <Field label="Button URL"   name="ctaButtonHref"  value={form.ctaButtonHref}  onChange={set} />
        </div>
      </Section>

      <div style={{ display:'flex', justifyContent:'flex-end' }}><SaveBtn /></div>
    </div>
  );
}