'use client';
import { useState, useEffect, useCallback, Fragment } from 'react';
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
  // Hero
  heroHeading:'Selected Projects',
  heroSubtext:'A collection of my best work — blending design, code, and innovation into experiences that actually move the needle.',
  heroBadge:'Selected Works',

  // Hero Stats
  heroStat1Value:'50+', heroStat1Label:'Projects',
  heroStat2Value:'30+', heroStat2Label:'Clients',
  heroStat3Value:'99+', heroStat3Label:'Lighthouse',

  // Project Stats section
  projectStat1Value:'50+',  projectStat1Label:'Projects Delivered', projectStat1Icon:'⚡',
  projectStat2Value:'30+',  projectStat2Label:'Happy Clients',      projectStat2Icon:'🤝',
  projectStat3Value:'98+',  projectStat3Label:'Avg Lighthouse',     projectStat3Icon:'🎯',
  projectStat4Value:'99.9%',projectStat4Label:'Uptime SLA',         projectStat4Icon:'🛡️',

  // Featured Project Showcase
  showcaseTitle:'Nexus E-Commerce Platform',
  showcaseSubtitle:'Full-Stack · Web',
  showcaseDesc:'A performance-obsessed storefront built for a D2C fashion brand — real-time inventory, AI-powered recommendations, custom CMS, Stripe checkout, and a Lighthouse score of 99. Launched in 6 weeks.',
  showcaseYear:'2024',
  showcaseLink:'#',
  showcaseStack:'Next.js, TypeScript, MongoDB Atlas, Stripe, Cloudinary, Nginx + PM2',
  showcaseMetric1Value:'99',   showcaseMetric1Label:'Lighthouse',
  showcaseMetric2Value:'< 1s', showcaseMetric2Label:'Load Time',
  showcaseMetric3Value:'+42%', showcaseMetric3Label:'Conversion',
  showcaseMetric4Value:'99.9%',showcaseMetric4Label:'Uptime',

  // CTA
  ctaBadge:'Open for Work',
  ctaHeading:'Have a Project in Mind?',
  ctaSubtext:"Let's collaborate and turn your vision into something extraordinary.",
  ctaButtonLabel:"Let's Talk →",
  ctaButtonHref:'/contact',
};

const defaultImages = {
  showcaseImage:'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=1200&q=85',
};

export default function CMSProjects() {
  const [form,         setForm]         = useState(defaultForm);
  const [images,       setImages]       = useState(defaultImages);
  const [saved,        setSaved]        = useState(false);
  const [saving,       setSaving]       = useState(false);
  const [loading,      setLoading]      = useState(true);
  const [uploadingKey, setUploadingKey] = useState<string|null>(null);

  useEffect(() => {
    api.get('/api/cms/projects-page')
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
    try { await api.put('/api/cms/projects-page', { content: form, images }); setSaved(true); setTimeout(()=>setSaved(false),3000); }
    catch { alert('Save failed.'); } finally { setSaving(false); }
  };

  const SaveBtn = () => (
    <button onClick={save} disabled={saving||!!uploadingKey}
      style={{ padding:'10px 24px', borderRadius:'10px', background:saved?'rgba(82,183,136,0.2)':'linear-gradient(135deg,#52b788,#2d6a4f)', border:saved?'1px solid rgba(82,183,136,0.4)':'none', color:saved?'#52b788':'#07130f', fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:'13px', cursor:(saving||!!uploadingKey)?'not-allowed':'pointer', opacity:(saving||!!uploadingKey)?0.7:1 }}>
      {uploadingKey?'Uploading...':saving?'Saving...':saved?'✓ Saved!':'Save Changes'}
    </button>
  );

  if (loading) return <p style={{ color:'rgba(232,245,236,0.3)', fontSize:'13px' }}>Loading...</p>;

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:'24px', maxWidth:'800px' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:'12px' }}>
        <div>
          <h1 style={{ fontFamily:"'Syne',sans-serif", color:'#e8f5ec', fontSize:'1.4rem', fontWeight:800, margin:'0 0 4px' }}>Edit Projects Page</h1>
          <p style={{ color:'rgba(232,245,236,0.3)', fontSize:'12px', margin:0 }}>Changes reflect live on the website</p>
        </div>
        <SaveBtn />
      </div>

      {/* Hero */}
      <Section title="Hero Section">
        <Field label="Badge Text"  name="heroBadge"   value={form.heroBadge}   onChange={set} />
        <Field label="Heading"     name="heroHeading" value={form.heroHeading} onChange={set} />
        <Field label="Subtext"     name="heroSubtext" value={form.heroSubtext} onChange={set} multiline />
        <p style={{ color:'rgba(82,183,136,0.5)', fontSize:'11px', fontWeight:700, margin:'4px 0 0', textTransform:'uppercase', letterSpacing:'1.5px' }}>Hero Stat Pills</p>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:'12px' }}>
          {[1,2,3].map(n=>(
            <Fragment key={n}>
              <Field label={`Stat ${n} Value`} name={`heroStat${n}Value`} value={(form as any)[`heroStat${n}Value`]} onChange={set} />
              <Field label={`Stat ${n} Label`} name={`heroStat${n}Label`} value={(form as any)[`heroStat${n}Label`]} onChange={set} />
              <div />
            </Fragment>
          ))}
        </div>
      </Section>

      {/* Project Stats Cards */}
      <Section title="Stats Cards (4 Cards Below Hero)">
        {[1,2,3,4].map(n=>(
          <div key={n} style={{ display:'grid', gridTemplateColumns:'1fr 1fr 80px', gap:'12px', paddingBottom:'12px', borderBottom:n<4?'1px solid rgba(82,183,136,0.06)':'none' }}>
            <Field label={`Stat ${n} Value`} name={`projectStat${n}Value`} value={(form as any)[`projectStat${n}Value`]} onChange={set} />
            <Field label={`Stat ${n} Label`} name={`projectStat${n}Label`} value={(form as any)[`projectStat${n}Label`]} onChange={set} />
            <Field label="Icon (emoji)" name={`projectStat${n}Icon`} value={(form as any)[`projectStat${n}Icon`]} onChange={set} />
          </div>
        ))}
      </Section>

      {/* Featured Project Showcase */}
      <Section title="Featured Project Showcase">
        <div style={{ padding:'12px', borderRadius:'10px', background:'rgba(82,183,136,0.04)', border:'1px solid rgba(82,183,136,0.1)', marginBottom:'4px' }}>
          <p style={{ color:'rgba(232,245,236,0.4)', fontSize:'12px', margin:0 }}>This is the large featured project card displayed on the Projects page. The individual projects grid is managed from the <strong style={{color:'#52b788'}}>Projects CRUD</strong> section in the sidebar.</p>
        </div>
        <div style={{ position:'relative' }}>
          <ImageDropZone label="Showcase Project Image" currentImage={images.showcaseImage} onImageChange={handleImageChange('showcaseImage')} aspectRatio="landscape" />
          {uploadingKey==='showcaseImage' && (
            <div style={{ position:'absolute', inset:0, background:'rgba(7,19,15,0.7)', borderRadius:'14px', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <p style={{ color:'#52b788', fontSize:'12px', fontWeight:700 }}>Uploading...</p>
            </div>
          )}
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px' }}>
          <Field label="Project Title"    name="showcaseTitle"    value={form.showcaseTitle}    onChange={set} />
          <Field label="Subtitle / Type"  name="showcaseSubtitle" value={form.showcaseSubtitle} onChange={set} />
          <Field label="Year"             name="showcaseYear"     value={form.showcaseYear}     onChange={set} />
          <Field label="Live URL"         name="showcaseLink"     value={form.showcaseLink}     onChange={set} />
        </div>
        <Field label="Description" name="showcaseDesc" value={form.showcaseDesc} onChange={set} multiline />
        <Field label="Tech Stack (comma-separated)" name="showcaseStack" value={form.showcaseStack} onChange={set} />
        <p style={{ color:'rgba(82,183,136,0.5)', fontSize:'11px', fontWeight:700, margin:'4px 0 0', textTransform:'uppercase', letterSpacing:'1.5px' }}>Metrics (4 metric badges)</p>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px' }}>
          {[1,2,3,4].map(n=>(
            <Fragment key={n}>
              <Field label={`Metric ${n} Value`} name={`showcaseMetric${n}Value`} value={(form as any)[`showcaseMetric${n}Value`]} onChange={set} />
              <Field label={`Metric ${n} Label`} name={`showcaseMetric${n}Label`} value={(form as any)[`showcaseMetric${n}Label`]} onChange={set} />
            </Fragment>
          ))}
        </div>
      </Section>

      {/* CTA */}
      <Section title="Project CTA Section">
        <Field label="Badge Text"   name="ctaBadge"       value={form.ctaBadge}       onChange={set} />
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