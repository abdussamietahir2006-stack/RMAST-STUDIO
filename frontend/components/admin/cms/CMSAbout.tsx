'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
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
  // Hero Section
  heroBadge: 'About',
  heroHeadingLine1: 'The Mind Behind',
  heroHeadingLine2: 'RMAST',
  heroRoles: 'Full-Stack Developer, UI/UX Designer, 3D Expert, AI Automation Engineer',
  heroDescription: "I'm Raja Muhammad Abdussamie Tahir — a digital craftsman who transforms ideas into high-performance digital products.",
  heroLogoBadge: 'RMAST',
  heroStat1Val: '50+', heroStat1Lab: 'Projects Shipped',
  heroStat2Val: '30+', heroStat2Lab: 'Happy Clients',
  heroStat3Val: '3+',  heroStat3Lab: 'Years Active',
  heroStat4Val: '100%', heroStat4Lab: 'Satisfaction',
  heroCtaLabel1: 'View My Work', heroCtaHref1: '#work',
  heroCtaLabel2: 'Get In Touch', heroCtaHref2: '/contact',

  // Story Milestones
  storyEyebrow: 'Origin Story',
  storyTitle1: 'How We',
  storyTitle2: 'Got Here',
  storyDesc: 'Every great studio has an origin. Mine started with curiosity, grew through obsession, and is now driven by purpose. Hover the cards to explore the journey.',
  milestone1Year:'2021', milestone1Title:'First Line of Code',     milestone1Desc:'Started with HTML & CSS — built my first landing page and fell in love with the craft.',
  milestone2Year:'2022', milestone2Title:'Full-Stack Jump',        milestone2Desc:'Mastered React, Node.js, and MongoDB. Built 10+ client projects end-to-end.',
  milestone3Year:'2023', milestone3Title:'Design & 3D Era',        milestone3Desc:'Picked up Figma, Blender and Three.js — started creating cinematic digital experiences.',
  milestone4Year:'2024', milestone4Title:'AI Automation',          milestone4Desc:'Integrated LLM pipelines, n8n workflows, and custom AI agents into client products.',
  milestone5Year:'2025', milestone5Title:'RMAST Studio',           milestone5Desc:'Launched as a solo digital studio — delivering premium full-service solutions globally.',

  // Mission & Vision
  mvEyebrow: 'Purpose',
  mvTitle1: 'Mission &',
  mvTitle2: 'Vision',
  mvDesc: 'Purpose-driven work starts with knowing exactly why you do it. These are the principles that get me out of bed and behind the keyboard every single day.',
  missionHeading:'Elevate Every Brand We Touch',
  missionText:'Our mission is to bridge the gap between visionary ideas and world-class digital execution. We partner with founders, startups, and businesses to build products that don\'t just work — they inspire, engage, and grow.',
  missionPoint1:'Deliver measurable ROI on every engagement',
  missionPoint2:'Build with performance and scalability from day one',
  missionPoint3:'Treat every project as if it were our own startup',
  missionPoint4:'Never compromise on quality, never miss a deadline',

  visionHeading:'The Future-Ready Digital Studio',
  visionText:'We envision a world where every business — regardless of size — has access to enterprise-grade design, development, and AI capabilities. RMAST will be the studio that makes that possible, one product at a time.',
  visionPoint1:'Pioneer AI-native product design methodologies',
  visionPoint2:'Create an ecosystem of reusable, open-source tools',
  visionPoint3:'Build a team of world-class digital specialists',
  visionPoint4:'Become the benchmark for quality in our region',

  // Values
  valuesEyebrow: 'Core Values',
  valuesTitle1: 'What We Stand',
  valuesTitle2: 'For',
  valuesDesc: "These aren't just buzzwords on a wall. They're the principles behind every decision, every pixel, and every product I ship. Hover to explore each one.",
  value1Title:'Precision',      value1Desc:'Every pixel, every line of code is intentional. I don\'t ship until it\'s right — not just functional, but exceptional in every measurable way.',     value1Tags:'Pixel-perfect, Clean code, QA tested',
  value2Title:'Creativity',     value2Desc:'Design is not decoration — it\'s strategy made visible. I craft interfaces that communicate, captivate, and convert at the same time.',                   value2Tags:'Bold visuals, Original, Intentional',
  value3Title:'Innovation',     value3Desc:'Technology moves fast. I stay ahead — integrating AI, automation, and emerging tools so your product is built for tomorrow, not yesterday.',             value3Tags:'AI-powered, Future-ready, Cutting-edge',
  value4Title:'Consistency',    value4Desc:'Quality isn\'t a one-time event. Every project gets the same obsessive attention to detail, regardless of scope, budget, or complexity.',                 value4Tags:'On-time, Reliable, World-class',
  value5Title:'Transparency',   value5Desc:'No hidden costs, no vague timelines. You get clear communication, daily progress updates, and a partner you can actually count on.',                     value5Tags:'Open comms, No surprises, Honest',
  value6Title:'Impact',         value6Desc:'I don\'t build for the sake of building. Every decision is tied to your growth — more traffic, better conversions, smarter operations.',                 value6Tags:'Results-driven, ROI-focused, Scalable',

  // Stats
  statsEyebrow: 'By The Numbers',
  statsTitle1: 'The',
  statsTitle2: 'Numbers',
  statsTitle3: 'Speak',
  statsDesc: "Three years of consistent delivery, measurable results, and clients who keep coming back. Here's the proof.",
  stat1Value:'50+',  stat1Label:'Projects Shipped',     stat1Sub:'Across 6 industries',
  stat2Value:'30+',  stat2Label:'Happy Clients',         stat2Sub:'Worldwide partnerships',
  stat3Value:'3+',   stat3Label:'Years Experience',      stat3Sub:'Continuous learning',
  stat4Value:'100%', stat4Label:'Satisfaction Rate',     stat4Sub:'Zero dissatisfied clients',
  stat5Value:'15K+', stat5Label:'Lines of Code',         stat5Sub:'Written with intention',
  stat6Value:'4',    stat6Label:'Core Services',         stat6Sub:'Dev · Design · 3D · AI',

  // Team Section
  teamEyebrow: 'The Team',
  teamTitle1: 'The',
  teamTitle2: 'Mind',
  teamTitle3: 'Behind It',
  teamDesc: 'One focused developer. One quality standard. World-class outcomes.',
  teamRole: 'Founder & Developer',
  teamName1: 'Abdus Samie',
  teamName2: 'Tahir',
  teamBio: "Full-stack developer obsessed with clean code, pixel-perfect design, and building products that actually move the needle. I don't just write code — I craft systems.",
  teamLinkedin: 'https://linkedin.com',

  // CTA Section
  ctaEyebrow: 'Open to Projects',
  ctaTitle1: "Let's Build",
  ctaTitle2: 'Something',
  ctaTitle3: 'Great Together',
  ctaDesc: "Ready to turn your idea into a world-class product? I'm taking on select projects — let's make yours the next success story.",
  ctaButtonLabel: 'Start a Project →',
  ctaButtonHref: '/contact',
  ctaButtonLabel2: 'View Portfolio',
  ctaButtonHref2: '/projects',
  ctaStat1Val: '< 48h', ctaStat1Lab: 'Response Time',
  ctaStat2Val: '5★', ctaStat2Lab: 'Client Rating',
  ctaStat3Val: '∞', ctaStat3Lab: 'Revisions',

  cvUrl: '', cvFileName: '',
};

const defaultImages = {
  heroImage:'',
  storyImage:'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&q=80',
  teamImage:'',
};

export default function CMSAbout() {
  const [form,         setForm]         = useState(defaultForm);
  const [images,       setImages]       = useState(defaultImages);
  const [saved,        setSaved]        = useState(false);
  const [saving,       setSaving]       = useState(false);
  const [loading,      setLoading]      = useState(true);
  const [uploadingKey, setUploadingKey] = useState<string|null>(null);
  const [cvUploading,  setCvUploading]  = useState(false);
  const cvRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    api.get('/api/cms/about')
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

  const handleCVUpload = async (file: File) => {
    if (!file.name.endsWith('.pdf')) return alert('Please upload a PDF file.');
    if (file.size > 10 * 1024 * 1024) return alert('CV must be under 10MB.');
    setCvUploading(true);
    try {
      const fd = new FormData(); fd.append('image', file);
      const res = await api.post('/api/cms/upload/image', fd, { headers:{'Content-Type':'multipart/form-data'} });
      const url = res.data.data?.url;
      if (url) setForm(f=>({...f, cvUrl:url, cvFileName:file.name}));
    } catch { alert('CV upload failed.'); }
    finally { setCvUploading(false); }
  };

  const save = async () => {
    setSaving(true);
    try { await api.put('/api/cms/about', { content: form, images }); setSaved(true); setTimeout(()=>setSaved(false),3000); }
    catch { alert('Save failed.'); } finally { setSaving(false); }
  };

  const SaveBtn = () => (
    <button onClick={save} disabled={saving||!!uploadingKey||cvUploading}
      style={{ padding:'10px 24px', borderRadius:'10px', background:saved?'rgba(82,183,136,0.2)':'linear-gradient(135deg,#52b788,#2d6a4f)', border:saved?'1px solid rgba(82,183,136,0.4)':'none', color:saved?'#52b788':'#07130f', fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:'13px', cursor:(saving||!!uploadingKey||cvUploading)?'not-allowed':'pointer', opacity:(saving||!!uploadingKey||cvUploading)?0.7:1 }}>
      {(uploadingKey||cvUploading)?'Uploading...':saving?'Saving...':saved?'✓ Saved!':'Save Changes'}
    </button>
  );

  const ImgZone = ({ imgKey, label, aspect }: { imgKey:keyof typeof images; label:string; aspect:'landscape'|'portrait'|'square'|'logo' }) => (
    <div style={{ position:'relative' }}>
      <ImageDropZone label={label} currentImage={images[imgKey]} onImageChange={handleImageChange(imgKey)} aspectRatio={aspect} />
      {uploadingKey===imgKey && (
        <div style={{ position:'absolute', inset:0, background:'rgba(7,19,15,0.7)', borderRadius:'14px', display:'flex', alignItems:'center', justifyContent:'center' }}>
          <p style={{ color:'#52b788', fontSize:'12px', fontWeight:700 }}>Uploading...</p>
        </div>
      )}
    </div>
  );

  if (loading) return <p style={{ color:'rgba(232,245,236,0.3)', fontSize:'13px' }}>Loading...</p>;

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:'24px', maxWidth:'800px' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:'12px' }}>
        <div>
          <h1 style={{ fontFamily:"'Syne',sans-serif", color:'#e8f5ec', fontSize:'1.4rem', fontWeight:800, margin:'0 0 4px' }}>Edit About Page</h1>
          <p style={{ color:'rgba(232,245,236,0.3)', fontSize:'12px', margin:0 }}>Changes reflect live on the website</p>
        </div>
        <SaveBtn />
      </div>

      {/* Hero */}
      <Section title="Hero Section">
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px' }}>
          <Field label="Eyebrow Badge" name="heroBadge" value={form.heroBadge} onChange={set} />
          <Field label="Logo Badge" name="heroLogoBadge" value={form.heroLogoBadge} onChange={set} />
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px' }}>
          <Field label="Heading Line 1" name="heroHeadingLine1" value={form.heroHeadingLine1} onChange={set} />
          <Field label="Heading Line 2" name="heroHeadingLine2" value={form.heroHeadingLine2} onChange={set} />
        </div>
        <Field label="Typewriter Roles (comma-separated)" name="heroRoles" value={form.heroRoles} onChange={set} />
        <Field label="Description" name="heroDescription" value={form.heroDescription} onChange={set} multiline />
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px' }}>
          <Field label="CTA 1 Label" name="heroCtaLabel1" value={form.heroCtaLabel1} onChange={set} />
          <Field label="CTA 1 Href" name="heroCtaHref1" value={form.heroCtaHref1} onChange={set} />
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px' }}>
          <Field label="CTA 2 Label" name="heroCtaLabel2" value={form.heroCtaLabel2} onChange={set} />
          <Field label="CTA 2 Href" name="heroCtaHref2" value={form.heroCtaHref2} onChange={set} />
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:'12px', padding:'12px', background:'rgba(82,183,136,0.02)', borderRadius:'10px', border:'1px dashed rgba(82,183,136,0.1)' }}>
          <div><Field label="Stat 1 Value" name="heroStat1Val" value={form.heroStat1Val} onChange={set} /></div>
          <div><Field label="Stat 1 Label" name="heroStat1Lab" value={form.heroStat1Lab} onChange={set} /></div>
          <div><Field label="Stat 2 Value" name="heroStat2Val" value={form.heroStat2Val} onChange={set} /></div>
          <div><Field label="Stat 2 Label" name="heroStat2Lab" value={form.heroStat2Lab} onChange={set} /></div>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:'12px', padding:'12px', background:'rgba(82,183,136,0.02)', borderRadius:'10px', border:'1px dashed rgba(82,183,136,0.1)' }}>
          <div><Field label="Stat 3 Value" name="heroStat3Val" value={form.heroStat3Val} onChange={set} /></div>
          <div><Field label="Stat 3 Label" name="heroStat3Lab" value={form.heroStat3Lab} onChange={set} /></div>
          <div><Field label="Stat 4 Value" name="heroStat4Val" value={form.heroStat4Val} onChange={set} /></div>
          <div><Field label="Stat 4 Label" name="heroStat4Lab" value={form.heroStat4Lab} onChange={set} /></div>
        </div>
        <ImgZone imgKey="heroImage" label="Hero Overlay Image (optional)" aspect="landscape" />
      </Section>

      {/* Story Milestones */}
      <Section title="Origin Story — Milestones">
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px' }}>
          <Field label="Section Eyebrow" name="storyEyebrow" value={form.storyEyebrow} onChange={set} />
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px' }}>
            <Field label="Title Part 1" name="storyTitle1" value={form.storyTitle1} onChange={set} />
            <Field label="Title Part 2" name="storyTitle2" value={form.storyTitle2} onChange={set} />
          </div>
        </div>
        <Field label="Section Description" name="storyDesc" value={form.storyDesc} onChange={set} multiline />
        <ImgZone imgKey="storyImage" label="Story Section Image" aspect="landscape" />
        {[1,2,3,4,5].map(n=>(
          <div key={n} style={{ display:'flex', flexDirection:'column', gap:'10px', paddingBottom:'14px', borderBottom:n<5?'1px solid rgba(82,183,136,0.06)':'none' }}>
            <p style={{ color:'rgba(82,183,136,0.6)', fontSize:'11px', fontWeight:700, margin:0, textTransform:'uppercase', letterSpacing:'1.5px' }}>Milestone {n}</p>
            <div style={{ display:'grid', gridTemplateColumns:'120px 1fr 2fr', gap:'12px' }}>
              <Field label="Year"  name={`milestone${n}Year`}  value={(form as any)[`milestone${n}Year`]}  onChange={set} />
              <Field label="Title" name={`milestone${n}Title`} value={(form as any)[`milestone${n}Title`]} onChange={set} />
              <Field label="Description" name={`milestone${n}Desc`} value={(form as any)[`milestone${n}Desc`]} onChange={set} />
            </div>
          </div>
        ))}
      </Section>

      {/* Mission & Vision Header & Cards */}
      <Section title="Mission & Vision Section">
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px' }}>
          <Field label="Section Eyebrow" name="mvEyebrow" value={form.mvEyebrow} onChange={set} />
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px' }}>
            <Field label="Title Part 1" name="mvTitle1" value={form.mvTitle1} onChange={set} />
            <Field label="Title Part 2" name="mvTitle2" value={form.mvTitle2} onChange={set} />
          </div>
        </div>
        <Field label="Section Subtitle" name="mvDesc" value={form.mvDesc} onChange={set} multiline />
        
        <div style={{ borderTop:'1px dashed rgba(82,183,136,0.15)', paddingTop:'14px', marginTop:'10px' }}>
          <p style={{ color:'#52b788', fontWeight:700, fontSize:'12px', marginBottom:'10px' }}>01 — Mission Card</p>
          <Field label="Heading" name="missionHeading" value={form.missionHeading} onChange={set} />
          <Field label="Body Text" name="missionText" value={form.missionText} onChange={set} multiline />
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px', marginTop:'10px' }}>
            {[1,2,3,4].map(n=>(
              <Field key={n} label={`Bullet Point ${n}`} name={`missionPoint${n}`} value={(form as any)[`missionPoint${n}`]} onChange={set} />
            ))}
          </div>
        </div>

        <div style={{ borderTop:'1px dashed rgba(82,183,136,0.15)', paddingTop:'14px', marginTop:'14px' }}>
          <p style={{ color:'#52b788', fontWeight:700, fontSize:'12px', marginBottom:'10px' }}>02 — Vision Card</p>
          <Field label="Heading" name="visionHeading" value={form.visionHeading} onChange={set} />
          <Field label="Body Text" name="visionText" value={form.visionText} onChange={set} multiline />
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px', marginTop:'10px' }}>
            {[1,2,3,4].map(n=>(
              <Field key={n} label={`Bullet Point ${n}`} name={`visionPoint${n}`} value={(form as any)[`visionPoint${n}`]} onChange={set} />
            ))}
          </div>
        </div>
      </Section>

      {/* Values */}
      <Section title="Core Values Section">
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px' }}>
          <Field label="Section Eyebrow" name="valuesEyebrow" value={form.valuesEyebrow} onChange={set} />
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px' }}>
            <Field label="Title Part 1" name="valuesTitle1" value={form.valuesTitle1} onChange={set} />
            <Field label="Title Part 2" name="valuesTitle2" value={form.valuesTitle2} onChange={set} />
          </div>
        </div>
        <Field label="Section Description" name="valuesDesc" value={form.valuesDesc} onChange={set} multiline />
        {[1,2,3,4,5,6].map(n=>(
          <div key={n} style={{ display:'flex', flexDirection:'column', gap:'10px', paddingBottom:'14px', borderBottom:n<6?'1px solid rgba(82,183,136,0.06)':'none' }}>
            <p style={{ color:'rgba(82,183,136,0.6)', fontSize:'11px', fontWeight:700, margin:0, textTransform:'uppercase', letterSpacing:'1.5px' }}>Value {n}</p>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 2fr', gap:'12px' }}>
              <Field label="Title"       name={`value${n}Title`} value={(form as any)[`value${n}Title`]} onChange={set} />
              <Field label="Description" name={`value${n}Desc`}  value={(form as any)[`value${n}Desc`]}  onChange={set} />
            </div>
            <Field label="Tags (comma-separated)" name={`value${n}Tags`} value={(form as any)[`value${n}Tags`]} onChange={set} />
          </div>
        ))}
      </Section>

      {/* Stats */}
      <Section title="Stats Section">
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px' }}>
          <Field label="Section Eyebrow" name="statsEyebrow" value={form.statsEyebrow} onChange={set} />
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'8px' }}>
            <Field label="Title 1" name="statsTitle1" value={form.statsTitle1} onChange={set} />
            <Field label="Title 2" name="statsTitle2" value={form.statsTitle2} onChange={set} />
            <Field label="Title 3" name="statsTitle3" value={form.statsTitle3} onChange={set} />
          </div>
        </div>
        <Field label="Section Subtitle" name="statsDesc" value={form.statsDesc} onChange={set} multiline />
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'12px', borderTop:'1px dashed rgba(82,183,136,0.1)', paddingTop:'14px' }}>
          {[1,2,3,4,5,6].map(n=>(
            <div key={n} style={{ border:'1px solid rgba(82,183,136,0.1)', padding:'10px', borderRadius:'10px', background:'rgba(82,183,136,0.01)' }}>
              <p style={{ color:'rgba(82,183,136,0.6)', fontSize:'10px', fontWeight:700, margin:'0 0 8px', textTransform:'uppercase' }}>Stat {n}</p>
              <div style={{ display:'flex', flexDirection:'column', gap:'8px' }}>
                <Field label="Value" name={`stat${n}Value`} value={(form as any)[`stat${n}Value`]} onChange={set} />
                <Field label="Label" name={`stat${n}Label`} value={(form as any)[`stat${n}Label`]} onChange={set} />
                <Field label="Subtext" name={`stat${n}Sub`}   value={(form as any)[`stat${n}Sub`]}   onChange={set} />
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Team Section */}
      <Section title="Team Section">
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px' }}>
          <Field label="Section Eyebrow" name="teamEyebrow" value={form.teamEyebrow} onChange={set} />
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'8px' }}>
            <Field label="Title 1" name="teamTitle1" value={form.teamTitle1} onChange={set} />
            <Field label="Title 2" name="teamTitle2" value={form.teamTitle2} onChange={set} />
            <Field label="Title 3" name="teamTitle3" value={form.teamTitle3} onChange={set} />
          </div>
        </div>
        <Field label="Section Description" name="teamDesc" value={form.teamDesc} onChange={set} multiline />
        
        <div style={{ borderTop:'1px dashed rgba(82,183,136,0.15)', paddingTop:'14px', display:'flex', flexDirection:'column', gap:'12px' }}>
          <p style={{ color:'#52b788', fontWeight:700, fontSize:'12px', margin:0 }}>Founder & Developer Card</p>
          <ImgZone imgKey="teamImage" label="Founder Avatar Image" aspect="square" />
          <Field label="Role Title (Position / Rank)" name="teamRole" value={form.teamRole} onChange={set} />
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px' }}>
            <Field label="First Name" name="teamName1" value={form.teamName1} onChange={set} />
            <Field label="Last Name" name="teamName2" value={form.teamName2} onChange={set} />
          </div>
          <Field label="Bio description (2-3 lines info)" name="teamBio" value={form.teamBio} onChange={set} multiline />
          <Field label="LinkedIn URL" name="teamLinkedin" value={form.teamLinkedin || ''} onChange={set} />
        </div>
      </Section>

      {/* CV Section */}
      <Section title="CV / Resume Download">
        <div style={{ padding:'16px', borderRadius:'12px', background:'rgba(82,183,136,0.04)', border:'1px solid rgba(82,183,136,0.12)' }}>
          <p style={{ color:'rgba(232,245,236,0.5)', fontSize:'12px', lineHeight:1.7, margin:'0 0 14px' }}>
            Upload your CV as a PDF. This controls the &ldquo;Download CV&rdquo; button on the about team card.
          </p>
          {form.cvUrl ? (
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:'10px' }}>
              <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
                <span style={{ fontSize:'24px' }}>📄</span>
                <div>
                  <p style={{ color:'#52b788', fontSize:'13px', fontWeight:600, margin:'0 0 2px' }}>{form.cvFileName || 'CV Uploaded'}</p>
                  <a href={form.cvUrl} target="_blank" rel="noreferrer" style={{ color:'rgba(82,183,136,0.6)', fontSize:'11px', textDecoration:'none' }}>View uploaded PDF →</a>
                </div>
              </div>
              <div style={{ display:'flex', gap:'8px' }}>
                <button onClick={()=>cvRef.current?.click()} style={{ padding:'7px 14px', borderRadius:'8px', border:'1px solid rgba(82,183,136,0.25)', background:'rgba(82,183,136,0.08)', color:'#52b788', fontSize:'12px', cursor:'pointer' }}>Replace</button>
                <button onClick={()=>setForm(f=>({...f,cvUrl:'',cvFileName:''}))} style={{ padding:'7px 14px', borderRadius:'8px', border:'1px solid rgba(255,107,107,0.2)', background:'rgba(255,107,107,0.06)', color:'#ff6b6b', fontSize:'12px', cursor:'pointer' }}>Remove</button>
              </div>
            </div>
          ) : (
            <div
              onClick={()=>cvRef.current?.click()}
              onDragOver={e=>e.preventDefault()}
              onDrop={e=>{e.preventDefault();const f=e.dataTransfer.files[0];if(f)handleCVUpload(f);}}
              style={{ border:'1.5px dashed rgba(82,183,136,0.2)', borderRadius:'12px', padding:'28px', textAlign:'center', cursor:'pointer', transition:'all 0.2s' }}
              onMouseEnter={e=>(e.currentTarget as HTMLDivElement).style.borderColor='rgba(82,183,136,0.45)'}
              onMouseLeave={e=>(e.currentTarget as HTMLDivElement).style.borderColor='rgba(82,183,136,0.2)'}>
              {cvUploading ? (
                <p style={{ color:'#52b788', fontSize:'13px', margin:0 }}>Uploading CV...</p>
              ) : (
                <>
                  <p style={{ fontSize:'32px', margin:'0 0 10px' }}>📄</p>
                  <p style={{ color:'rgba(232,245,236,0.5)', fontSize:'13px', margin:'0 0 4px' }}>Drag &amp; drop your CV or <span style={{ color:'#52b788' }}>click to browse</span></p>
                  <p style={{ color:'rgba(232,245,236,0.2)', fontSize:'11px', margin:0 }}>PDF only — max 10MB</p>
                </>
              )}
            </div>
          )}
          <input ref={cvRef} type="file" accept=".pdf" style={{ display:'none' }} onChange={e=>{const f=e.target.files?.[0];if(f)handleCVUpload(f);}} />
          <div style={{ marginTop:'12px' }}>
            <label style={{ display:'block', color:'rgba(232,245,236,0.25)', fontSize:'10px', fontWeight:700, letterSpacing:'2px', textTransform:'uppercase', marginBottom:'7px' }}>Or paste CV URL directly</label>
            <input value={form.cvUrl} onChange={e=>setForm(f=>({...f,cvUrl:e.target.value}))} placeholder="https://drive.google.com/... or Cloudinary URL"
              style={{ width:'100%', background:'rgba(82,183,136,0.03)', border:'1px solid rgba(82,183,136,0.1)', borderRadius:'10px', padding:'10px 14px', color:'rgba(232,245,236,0.5)', fontSize:'12px', outline:'none', boxSizing:'border-box' }}
              onFocus={e=>e.target.style.borderColor='rgba(82,183,136,0.35)'} onBlur={e=>e.target.style.borderColor='rgba(82,183,136,0.1)'} />
          </div>
        </div>
      </Section>

      {/* CTA */}
      <Section title="CTA Section">
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px' }}>
          <Field label="Section Eyebrow" name="ctaEyebrow" value={form.ctaEyebrow} onChange={set} />
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'8px' }}>
            <Field label="Heading 1" name="ctaTitle1" value={form.ctaTitle1} onChange={set} />
            <Field label="Heading 2" name="ctaTitle2" value={form.ctaTitle2} onChange={set} />
            <Field label="Heading 3" name="ctaTitle3" value={form.ctaTitle3} onChange={set} />
          </div>
        </div>
        <Field label="Subtext"      name="ctaDesc"     value={form.ctaDesc}     onChange={set} multiline />
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px' }}>
          <Field label="CTA 1 Button Label" name="ctaButtonLabel" value={form.ctaButtonLabel} onChange={set} />
          <Field label="CTA 1 Button URL"   name="ctaButtonHref"  value={form.ctaButtonHref}  onChange={set} />
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px' }}>
          <Field label="CTA 2 Button Label" name="ctaButtonLabel2" value={form.ctaButtonLabel2} onChange={set} />
          <Field label="CTA 2 Button URL"   name="ctaButtonHref2"  value={form.ctaButtonHref2}  onChange={set} />
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'12px', marginTop:'8px' }}>
          {[1,2,3].map(n=>(
            <div key={n} style={{ border:'1px solid rgba(82,183,136,0.08)', padding:'8px', borderRadius:'8px' }}>
              <p style={{ color:'rgba(82,183,136,0.5)', fontSize:'9px', fontWeight:700, margin:'0 0 6px' }}>Bottom Stat {n}</p>
              <Field label="Value" name={`ctaStat${n}Val`} value={(form as any)[`ctaStat${n}Val`]} onChange={set} />
              <Field label="Label" name={`ctaStat${n}Lab`} value={(form as any)[`ctaStat${n}Lab`]} onChange={set} />
            </div>
          ))}
        </div>
      </Section>

      <div style={{ display:'flex', justifyContent:'flex-end' }}><SaveBtn /></div>
    </div>
  );
}