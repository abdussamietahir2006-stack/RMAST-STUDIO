'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import ImageDropZone from './ImageDropZone';
import api from '@/lib/api';

function Field({ label, name, value, onChange, multiline=false, placeholder='' }: {
  label: string; name: string; value: string;
  onChange: (n: string, v: string) => void;
  multiline?: boolean; placeholder?: string;
}) {
  return (
    <div>
      <label style={{ display:'block', color:'rgba(232,245,236,0.35)', fontSize:'10px', fontWeight:700, letterSpacing:'2px', textTransform:'uppercase', marginBottom:'7px' }}>{label}</label>
      {multiline ? (
        <textarea value={value} onChange={e=>onChange(name,e.target.value)} rows={3} placeholder={placeholder}
          style={{ width:'100%', background:'rgba(82,183,136,0.04)', border:'1px solid rgba(82,183,136,0.15)', borderRadius:'10px', padding:'11px 14px', color:'#e8f5ec', fontSize:'13px', outline:'none', resize:'vertical', boxSizing:'border-box', fontFamily:'inherit', transition:'border-color 0.2s' }}
          onFocus={e=>e.target.style.borderColor='rgba(82,183,136,0.45)'} onBlur={e=>e.target.style.borderColor='rgba(82,183,136,0.15)'} />
      ) : (
        <input value={value} onChange={e=>onChange(name,e.target.value)} placeholder={placeholder}
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

/**
 * IMPORTANT: defaultForm values must EXACTLY match the hardcoded content
 * in the live website components. This ensures the CMS shows the same
 * content as the website on first load (before any MongoDB data exists).
 *
 * Hero.tsx  → heroLine1 / heroLine2 / heroLine3 / heroTagline / heroDescription
 * ServicesPreview.tsx → service{n}* fields
 * WhoIHelp.tsx → whoHelp{n}* fields
 * Process.tsx → processStep{n}* fields
 * Newsletter.tsx → newsletter* fields
 */
const defaultForm = {
  // ── Hero ──────────────────────────────────────────────────────────────────
  heroTagline:     'Nature-Inspired Digital Craft',
  heroLine1:       'Your Digital',
  heroLine2:       'Creative',
  heroLine3:       'Advantage',
  heroDescription: 'I build immersive, organic digital systems — blending design, development, and intelligent automation to help brands grow naturally.',
  heroBadge:       'Available for work',
  heroYearsExp:    '3+',
  heroProjects:    '50+',

  // Hero stats bar
  heroStat1Num:    '3',   heroStat1Suffix: '+', heroStat1Label: 'Years Exp.',
  heroStat2Num:    '50',  heroStat2Suffix: '+', heroStat2Label: 'Projects',
  heroStat3Num:    '100', heroStat3Suffix: '%', heroStat3Label: 'Satisfaction',

  // Hero CTA buttons
  heroCtaLabel1: 'Explore Work', heroCtaHref1: '/projects',
  heroCtaLabel2: 'Download CV',
  heroCtaLabel3: 'Contact',      heroCtaHref3: '/contact',

  // Social links (set # until you have real URLs)
  heroGithubUrl:   '#',
  heroLinkedinUrl: '#',
  heroTwitterUrl:  '#',
  heroDribbbleUrl: '#',

  // ── Services Preview ──────────────────────────────────────────────────────
  serviceSectionHeading:  'Four Ways We',
  serviceSectionItalic:   'Build Your',
  serviceSectionHighlight:'Digital Advantage',
  serviceSectionSubtext:  'Each service is a precision instrument. Together, they form a complete system for building, designing, and scaling — all under one roof. Click any card to see the tech stack.',

  service1Title:       'Web Development',
  service1Desc:        'High-performance, scalable web applications built with obsessive attention to clean architecture and measurable outcomes.',
  service1Stack:       'Next.js, React, Node.js, MongoDB, REST & GraphQL APIs',
  service1MetricLabel: 'Avg load time',
  service1MetricValue: '<1.2s',

  service2Title:       'UI / UX Design',
  service2Desc:        "Interfaces that don't just look beautiful — they guide, persuade, and convert. Every pixel is purposeful.",
  service2Stack:       'Figma, Framer, Motion Design, Design Systems, Prototyping',
  service2MetricLabel: 'Conversion lift',
  service2MetricValue: '+38%',

  service3Title:       '3D & Motion',
  service3Desc:        'Cinematic, immersive visuals that stop the scroll. From WebGL shaders to Blender animations — real-time 3D for the web.',
  service3Stack:       'Three.js, Blender, GSAP, Spline, WebGL Shaders',
  service3MetricLabel: 'Dwell time boost',
  service3MetricValue: '+4.2×',

  service4Title:       'AI Automation',
  service4Desc:        'Intelligent workflows that eliminate repetitive work, slash costs, and scale your operations while you sleep.',
  service4Stack:       'LangChain, OpenAI API, n8n, Zapier, Custom AI Pipelines',
  service4MetricLabel: 'Time saved / wk',
  service4MetricValue: '20h+',

  // ── Who I Help ────────────────────────────────────────────────────────────
  whoHelpHeading: 'Who We',
  whoHelpHighlight: 'Work With',
  whoHelpSubtext: 'I partner with ambitious people ready to build something real.',

  whoHelp1Title:    'Startups & Founders',
  whoHelp1Subtitle: 'Zero → One',
  whoHelp1Desc:     'Launch fast, validate ideas, and build a strong digital presence from day one.',
  whoHelp1Stat:     '48hr',
  whoHelp1StatLabel:'avg. kickoff time',

  whoHelp2Title:    'Businesses',
  whoHelp2Subtitle: 'Scale & Automate',
  whoHelp2Desc:     'Scale your brand with modern systems, automation, and high-performance platforms.',
  whoHelp2Stat:     '10×',
  whoHelp2StatLabel:'productivity gains',

  whoHelp3Title:    'Creators',
  whoHelp3Subtitle: 'Build Authority',
  whoHelp3Desc:     'Build authority, showcase your work, and grow your personal brand online.',
  whoHelp3Stat:     '3×',
  whoHelp3StatLabel:'audience growth',

  // ── Process ───────────────────────────────────────────────────────────────
  processHeading: 'How We',
  processHighlight: 'Work',
  processSubtext: 'A refined process built for consistent, world-class results — every single time.',

  processStep1Title:    'Discovery',
  processStep1Subtitle: 'Deep Dive',
  processStep1Desc:     'We start by understanding your vision, goals, and challenges inside out. I ask the right questions to uncover the true problem — not just the surface request.',
  processStep1Duration: '1–2 days',
  processStep1Deliverable: 'Project Brief',
  processStep1Detail1: 'In-depth strategy call (60–90 min)',
  processStep1Detail2: 'Competitor & market analysis',
  processStep1Detail3: 'User persona & journey mapping',
  processStep1Detail4: 'Technical feasibility assessment',
  processStep1Detail5: 'Scope, timeline & budget alignment',

  processStep2Title:    'Strategy',
  processStep2Subtitle: 'Blueprint Phase',
  processStep2Desc:     'Every pixel and every API route is planned before a single line of code is written. Architecture, UX flow, and automation logic all defined upfront.',
  processStep2Duration: '2–4 days',
  processStep2Deliverable: 'Figma Prototype',
  processStep2Detail1: 'Information architecture design',
  processStep2Detail2: 'Wireframes & low-fi prototypes',
  processStep2Detail3: 'Tech stack & database schema',
  processStep2Detail4: 'API & automation workflow design',
  processStep2Detail5: 'Design system & brand tokens',

  processStep3Title:    'Execution',
  processStep3Subtitle: 'Build Phase',
  processStep3Desc:     'Code written with obsessive attention to quality — clean architecture, pixel-perfect UI, and robust backend. Daily updates so you always know where we stand.',
  processStep3Duration: '1–4 weeks',
  processStep3Deliverable: 'Staging Build',
  processStep3Detail1: 'Next.js frontend + TypeScript',
  processStep3Detail2: 'MongoDB Atlas + API routes',
  processStep3Detail3: 'Admin CMS & dashboard',
  processStep3Detail4: 'Cloudinary media management',
  processStep3Detail5: 'Daily progress check-ins',

  processStep4Title:    'Delivery',
  processStep4Subtitle: 'Launch & Scale',
  processStep4Desc:     'Launch is just the beginning. I deploy on your VPS, hand over full admin access, and stick around for optimisation, feature additions, and growth support.',
  processStep4Duration: '1–2 days',
  processStep4Deliverable: 'Live Product',
  processStep4Detail1: 'VPS deployment (Nginx + PM2)',
  processStep4Detail2: 'Performance & SEO audit',
  processStep4Detail3: 'Full admin handover & training',
  processStep4Detail4: '30-day post-launch support',
  processStep4Detail5: 'Analytics & growth tracking',

  // ── Newsletter ────────────────────────────────────────────────────────────
  newsletterHeading: 'Stay Updated',
  newsletterSubtext: 'Get insights, updates, and new projects delivered to your inbox.',
};

const defaultImages = {
  heroImage:    '',
  whoHelp1Image:'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1200&fit=crop',
  whoHelp2Image:'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1200&fit=crop',
  whoHelp3Image:'https://images.unsplash.com/photo-1559136555-9303baea8ebd?q=80&w=1200&fit=crop',
};

export default function CMSHome() {
  const [form,         setForm]         = useState(defaultForm);
  const [images,       setImages]       = useState(defaultImages);
  const [saved,        setSaved]        = useState(false);
  const [saving,       setSaving]       = useState(false);
  const [loading,      setLoading]      = useState(true);
  const [uploadingKey, setUploadingKey] = useState<string|null>(null);

  useEffect(() => {
    api.get('/api/cms/home')
      .then(res => {
        if (res.data.data?.content) setForm(p=>({...p,...res.data.data.content}));
        if (res.data.data?.images)  setImages(p=>({...p,...res.data.data.images}));
      })
      .catch(()=>{}).finally(()=>setLoading(false));
  }, []);

  const set = useCallback((name: string, value: string) => setForm(f=>({...f,[name]:value})), []);

  const handleImageChange = useCallback((key: string) => async (_url: string, file: File) => {
    setUploadingKey(key);
    try {
      const fd = new FormData(); fd.append('image', file);
      const res = await api.post('/api/cms/upload/image', fd, { headers:{'Content-Type':'multipart/form-data'} });
      const url = res.data.data?.url;
      if (url) setImages(p=>({...p,[key]:url}));
    } catch { alert('Image upload failed. Check Cloudinary credentials.'); }
    finally { setUploadingKey(null); }
  }, []);

  const save = async () => {
    setSaving(true);
    try {
      await api.put('/api/cms/home', { content: form, images });
      setSaved(true); setTimeout(()=>setSaved(false), 3000);
    } catch { alert('Save failed.'); } finally { setSaving(false); }
  };

  const SaveBtn = () => (
    <button onClick={save} disabled={saving||!!uploadingKey}
      style={{ padding:'10px 24px', borderRadius:'10px', background:saved?'rgba(82,183,136,0.2)':'linear-gradient(135deg,#52b788,#2d6a4f)', border:saved?'1px solid rgba(82,183,136,0.4)':'none', color:saved?'#52b788':'#07130f', fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:'13px', cursor:(saving||!!uploadingKey)?'not-allowed':'pointer', opacity:(saving||!!uploadingKey)?0.7:1 }}>
      {uploadingKey?'Uploading Image...':saving?'Saving...':saved?'✓ Saved!':'Save Changes'}
    </button>
  );

  const ImgZone = ({ imgKey, label, aspect }: { imgKey: keyof typeof images; label: string; aspect:'landscape'|'portrait'|'square'|'logo' }) => (
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

  const g2 = { display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px' } as const;
  const g3 = { display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'12px' } as const;

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:'24px', maxWidth:'800px' }}>
      {/* Header */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:'12px' }}>
        <div>
          <h1 style={{ fontFamily:"'Syne',sans-serif", color:'#e8f5ec', fontSize:'1.4rem', fontWeight:800, margin:'0 0 4px' }}>Edit Home Page</h1>
          <p style={{ color:'rgba(232,245,236,0.3)', fontSize:'12px', margin:0 }}>Changes reflect live on the website after saving</p>
        </div>
        <SaveBtn />
      </div>

      {/* ── HERO ─────────────────────────────────────────────── */}
      <Section title="Hero Section">
        <p style={{ color:'rgba(232,245,236,0.3)', fontSize:'11px', margin:0 }}>
          The hero heading is split into 3 visual lines: Line 1 glitches, Line 2 is italic, Line 3 is plain.
        </p>
        <div style={g3}>
          <Field label="Line 1 (Glitch)"   name="heroLine1"  value={form.heroLine1}  onChange={set} placeholder="Your Digital" />
          <Field label="Line 2 (Italic)"   name="heroLine2"  value={form.heroLine2}  onChange={set} placeholder="Creative" />
          <Field label="Line 3 (Bold)"     name="heroLine3"  value={form.heroLine3}  onChange={set} placeholder="Advantage" />
        </div>
        <Field label="Small Eyebrow Tagline" name="heroTagline" value={form.heroTagline} onChange={set} placeholder="Nature-Inspired Digital Craft" />
        <Field label="Description Paragraph" name="heroDescription" value={form.heroDescription} onChange={set} multiline />
        <div style={g2}>
          <Field label="Badge Text"  name="heroBadge"   value={form.heroBadge}   onChange={set} placeholder="Available for work" />
          <Field label="Years Badge" name="heroYearsExp" value={form.heroYearsExp} onChange={set} placeholder="3+" />
        </div>
        <ImgZone imgKey="heroImage" label="Hero Profile / Background Image (optional)" aspect="portrait" />
      </Section>

      {/* ── HERO STATS ───────────────────────────────────────── */}
      <Section title="Hero Stats Bar">
        {[1,2,3].map(n=>(
          <div key={n} style={g3}>
            <Field label={`Stat ${n} Number`} name={`heroStat${n}Num`}    value={(form as Record<string,string>)[`heroStat${n}Num`]}    onChange={set} />
            <Field label={`Stat ${n} Suffix`} name={`heroStat${n}Suffix`} value={(form as Record<string,string>)[`heroStat${n}Suffix`]} onChange={set} placeholder="+ or %" />
            <Field label={`Stat ${n} Label`}  name={`heroStat${n}Label`}  value={(form as Record<string,string>)[`heroStat${n}Label`]}  onChange={set} />
          </div>
        ))}
      </Section>

      {/* ── HERO BUTTONS ─────────────────────────────────────── */}
      <Section title="Hero CTA Buttons">
        <div style={g2}>
          <Field label="Button 1 Label" name="heroCtaLabel1" value={form.heroCtaLabel1} onChange={set} />
          <Field label="Button 1 URL"   name="heroCtaHref1"  value={form.heroCtaHref1}  onChange={set} />
        </div>
        <div style={g2}>
          <Field label="Button 3 Label" name="heroCtaLabel3" value={form.heroCtaLabel3} onChange={set} />
          <Field label="Button 3 URL"   name="heroCtaHref3"  value={form.heroCtaHref3}  onChange={set} />
        </div>
      </Section>

      {/* ── SOCIAL LINKS ─────────────────────────────────────── */}
      <Section title="Social Links">
        <div style={g2}>
          <Field label="GitHub URL"    name="heroGithubUrl"   value={form.heroGithubUrl}   onChange={set} placeholder="https://github.com/..." />
          <Field label="LinkedIn URL"  name="heroLinkedinUrl" value={form.heroLinkedinUrl} onChange={set} placeholder="https://linkedin.com/in/..." />
          <Field label="Twitter URL"   name="heroTwitterUrl"  value={form.heroTwitterUrl}  onChange={set} placeholder="https://twitter.com/..." />
          <Field label="Dribbble URL"  name="heroDribbbleUrl" value={form.heroDribbbleUrl} onChange={set} placeholder="https://dribbble.com/..." />
        </div>
      </Section>

      {/* ── SERVICES PREVIEW ─────────────────────────────────── */}
      <Section title="Services Preview Section">
        <div style={g2}>
          <Field label="Section Heading"  name="serviceSectionHeading"   value={form.serviceSectionHeading}   onChange={set} />
          <Field label="Heading Italic"   name="serviceSectionItalic"    value={form.serviceSectionItalic}    onChange={set} />
        </div>
        <Field label="Heading Highlight (gradient)" name="serviceSectionHighlight" value={form.serviceSectionHighlight} onChange={set} />
        <Field label="Section Subtext" name="serviceSectionSubtext" value={form.serviceSectionSubtext} onChange={set} multiline />
        {[1,2,3,4].map(n=>(
          <div key={n} style={{ paddingBottom:'16px', borderBottom:n<4?'1px solid rgba(82,183,136,0.06)':'none', display:'flex', flexDirection:'column', gap:'12px' }}>
            <p style={{ color:'rgba(82,183,136,0.6)', fontSize:'11px', fontWeight:700, margin:0, textTransform:'uppercase', letterSpacing:'1.5px' }}>Service {n}</p>
            <div style={g2}>
              <Field label="Title" name={`service${n}Title`} value={(form as Record<string,string>)[`service${n}Title`]} onChange={set} />
              <Field label="Metric Value" name={`service${n}MetricValue`} value={(form as Record<string,string>)[`service${n}MetricValue`]} onChange={set} />
            </div>
            <Field label="Description" name={`service${n}Desc`} value={(form as Record<string,string>)[`service${n}Desc`]} onChange={set} multiline />
            <div style={g2}>
              <Field label="Tech Stack (comma-separated)" name={`service${n}Stack`} value={(form as Record<string,string>)[`service${n}Stack`]} onChange={set} />
              <Field label="Metric Label" name={`service${n}MetricLabel`} value={(form as Record<string,string>)[`service${n}MetricLabel`]} onChange={set} />
            </div>
          </div>
        ))}
      </Section>

      {/* ── WHO I HELP ───────────────────────────────────────── */}
      <Section title="Who I Help Section">
        <div style={g2}>
          <Field label="Section Heading" name="whoHelpHeading"   value={form.whoHelpHeading}   onChange={set} />
          <Field label="Heading Highlight" name="whoHelpHighlight" value={form.whoHelpHighlight} onChange={set} />
        </div>
        <Field label="Section Subtext" name="whoHelpSubtext" value={form.whoHelpSubtext} onChange={set} multiline />
        {[1,2,3].map(n=>(
          <div key={n} style={{ paddingBottom:'16px', borderBottom:n<3?'1px solid rgba(82,183,136,0.06)':'none', display:'flex', flexDirection:'column', gap:'12px' }}>
            <p style={{ color:'rgba(82,183,136,0.6)', fontSize:'11px', fontWeight:700, margin:0, textTransform:'uppercase', letterSpacing:'1.5px' }}>Card {n}</p>
            <ImgZone imgKey={`whoHelp${n}Image` as keyof typeof images} label={`Who I Help ${n} Image`} aspect="portrait" />
            <div style={g2}>
              <Field label="Title"    name={`whoHelp${n}Title`}    value={(form as Record<string,string>)[`whoHelp${n}Title`]}    onChange={set} />
              <Field label="Subtitle" name={`whoHelp${n}Subtitle`} value={(form as Record<string,string>)[`whoHelp${n}Subtitle`]} onChange={set} />
            </div>
            <Field label="Description" name={`whoHelp${n}Desc`} value={(form as Record<string,string>)[`whoHelp${n}Desc`]} onChange={set} multiline />
            <div style={g2}>
              <Field label="Stat Value" name={`whoHelp${n}Stat`}      value={(form as Record<string,string>)[`whoHelp${n}Stat`]}      onChange={set} />
              <Field label="Stat Label" name={`whoHelp${n}StatLabel`} value={(form as Record<string,string>)[`whoHelp${n}StatLabel`]} onChange={set} />
            </div>
          </div>
        ))}
      </Section>

      {/* ── PROCESS ──────────────────────────────────────────── */}
      <Section title="Process Steps">
        <div style={g2}>
          <Field label="Section Heading"   name="processHeading"   value={form.processHeading}   onChange={set} />
          <Field label="Heading Highlight" name="processHighlight" value={form.processHighlight} onChange={set} />
        </div>
        <Field label="Section Subtext" name="processSubtext" value={form.processSubtext} onChange={set} multiline />
        {[1,2,3,4].map(n=>(
          <div key={n} style={{ paddingBottom:'16px', borderBottom:n<4?'1px solid rgba(82,183,136,0.06)':'none', display:'flex', flexDirection:'column', gap:'12px' }}>
            <p style={{ color:'rgba(82,183,136,0.6)', fontSize:'11px', fontWeight:700, margin:0, textTransform:'uppercase', letterSpacing:'1.5px' }}>Step {n}</p>
            <div style={g3}>
              <Field label="Title"    name={`processStep${n}Title`}    value={(form as Record<string,string>)[`processStep${n}Title`]}    onChange={set} />
              <Field label="Subtitle" name={`processStep${n}Subtitle`} value={(form as Record<string,string>)[`processStep${n}Subtitle`]} onChange={set} />
              <Field label="Duration" name={`processStep${n}Duration`} value={(form as Record<string,string>)[`processStep${n}Duration`]} onChange={set} />
            </div>
            <Field label="Description" name={`processStep${n}Desc`} value={(form as Record<string,string>)[`processStep${n}Desc`]} onChange={set} multiline />
            <Field label="Deliverable" name={`processStep${n}Deliverable`} value={(form as Record<string,string>)[`processStep${n}Deliverable`]} onChange={set} />
            <div style={{ display:'flex', flexDirection:'column', gap:'8px' }}>
              <p style={{ color:'rgba(82,183,136,0.4)', fontSize:'10px', fontWeight:700, margin:0, textTransform:'uppercase', letterSpacing:'1.5px' }}>Detail Bullets (shown on hover)</p>
              {[1,2,3,4,5].map(d=>(
                <Field key={d} label={`Bullet ${d}`} name={`processStep${n}Detail${d}`} value={(form as Record<string,string>)[`processStep${n}Detail${d}`]} onChange={set} />
              ))}
            </div>
          </div>
        ))}
      </Section>

      {/* ── NEWSLETTER ───────────────────────────────────────── */}
      <Section title="Newsletter Section">
        <Field label="Heading" name="newsletterHeading" value={form.newsletterHeading} onChange={set} />
        <Field label="Subtext" name="newsletterSubtext" value={form.newsletterSubtext} onChange={set} multiline />
      </Section>

      <div style={{ display:'flex', justifyContent:'flex-end' }}><SaveBtn /></div>
    </div>
  );
}