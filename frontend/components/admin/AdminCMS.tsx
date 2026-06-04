'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';

const pages = [
  { title:'Home Page',     href:'/admin/dashboard/cms/home',     desc:'Edit hero heading, stats, services list, newsletter section.', fields:['Hero Heading','Subtext','Stats','Services','Newsletter'], color:'rgba(82,183,136,0.18)', border:'rgba(82,183,136,0.3)', icon:'🏠' },
  { title:'About Page',    href:'/admin/dashboard/cms/about',    desc:'Edit story, milestones, mission, vision, values and stats.',   fields:['Story','Milestones','Mission','Vision','Values','Stats'],  color:'rgba(0,229,255,0.1)',   border:'rgba(0,229,255,0.25)',  icon:'👤' },
  { title:'Services Page', href:'/admin/dashboard/cms/services', desc:'Edit all service titles, descriptions and bullet points.',     fields:['Hero','Service 1–6','Bullets','CTA'],                      color:'rgba(255,202,40,0.1)',  border:'rgba(255,202,40,0.25)', icon:'⚡' },
  { title:'Projects Page', href:'/admin/dashboard/cms/projects', desc:'Edit featured project showcase section content.',              fields:['Featured Project','Metrics','Stack','CTA'],                color:'rgba(118,255,3,0.08)', border:'rgba(118,255,3,0.22)',  icon:'🚀' },
  { title:'Contact Page',  href:'/admin/dashboard/cms/contact',  desc:'Edit contact info, FAQ questions and availability.',           fields:['Hero','Email','Phone','Availability','FAQ 1–6'],           color:'rgba(199,125,255,0.1)', border:'rgba(199,125,255,0.25)',icon:'✉' },
  { title:'Navbar',        href:'/admin/dashboard/cms/navbar',   desc:'Edit logo text, navigation links and CTA button.',             fields:['Logo','Nav Links','CTA Button'],                           color:'rgba(255,107,107,0.08)',border:'rgba(255,107,107,0.22)',icon:'🔗' },
  { title:'Footer',        href:'/admin/dashboard/cms/footer',   desc:'Edit footer description, contact info, links and socials.',   fields:['Logo','Description','Phone','Email','Links','Social'],     color:'rgba(82,183,136,0.06)', border:'rgba(82,183,136,0.18)', icon:'🔻' },
];

export default function AdminCMS() {
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:'24px' }}>
      <div>
        <h1 style={{ fontFamily:"'Syne',sans-serif", color:'#e8f5ec', fontSize:'1.4rem', fontWeight:800, margin:'0 0 4px' }}>Content Management</h1>
        <p style={{ color:'rgba(232,245,236,0.3)', fontSize:'12px', margin:0 }}>Select a page to edit its content — changes reflect live on the site</p>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))', gap:'16px' }}>
        {pages.map((page,i)=>(
          <motion.div key={i} initial={{opacity:0,y:28}} animate={{opacity:1,y:0}} transition={{delay:i*0.08}}>
            <Link href={page.href} style={{ textDecoration:'none' }}>
              <motion.div whileHover={{ scale:1.02, y:-3 }}
                style={{ padding:'24px', borderRadius:'16px', background:`rgba(11,20,16,0.85)`, border:`1px solid ${page.border}`, cursor:'pointer', position:'relative', overflow:'hidden', height:'100%', boxSizing:'border-box' }}>
                {/* Glow */}
                <div style={{ position:'absolute', inset:0, background:`radial-gradient(circle at 80% 20%, ${page.color}, transparent 60%)`, pointerEvents:'none' }} />
                {/* Bottom shine */}
                <div style={{ position:'absolute', bottom:0, left:0, right:0, height:'2px', background:`linear-gradient(90deg, transparent, ${page.border}, transparent)`, opacity:0.6 }} />

                <div style={{ position:'relative', zIndex:1 }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'12px' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
                      <span style={{ fontSize:'22px' }}>{page.icon}</span>
                      <h3 style={{ color:'#e8f5ec', fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:'1rem', margin:0 }}>{page.title}</h3>
                    </div>
                    <span style={{ color:'rgba(232,245,236,0.2)', fontSize:'16px' }}>→</span>
                  </div>

                  <p style={{ color:'rgba(232,245,236,0.4)', fontSize:'12px', lineHeight:1.6, margin:'0 0 16px' }}>{page.desc}</p>

                  <div style={{ display:'flex', flexWrap:'wrap', gap:'6px' }}>
                    {page.fields.map((f,j)=>(
                      <span key={j} style={{ padding:'3px 9px', borderRadius:'100px', background:'rgba(232,245,236,0.04)', border:'1px solid rgba(232,245,236,0.08)', color:'rgba(232,245,236,0.35)', fontSize:'10px', fontWeight:600 }}>{f}</span>
                    ))}
                  </div>
                </div>
              </motion.div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}