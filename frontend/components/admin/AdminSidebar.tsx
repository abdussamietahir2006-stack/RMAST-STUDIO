'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useState } from 'react';

const accent = '#52b788';

const navItems = [
  { label:'Dashboard',    href:'/admin/dashboard',               icon:'⚡' },
  { label:'Leads',        href:'/admin/dashboard/leads',         icon:'👤' },
  { label:'Bookings',     href:'/admin/dashboard/bookings',      icon:'📅' },
  { label:'Subscribers',  href:'/admin/dashboard/subscribers',   icon:'✉' },
  { label:'Testimonials', href:'/admin/dashboard/testimonials',  icon:'⭐' },
  { label:'Projects',     href:'/admin/dashboard/projects',      icon:'🚀' },
  {
    label:'CMS', href:'/admin/dashboard/cms', icon:'✏',
    submenu:[
      { label:'Home Page', href:'/admin/dashboard/cms/home' },
      { label:'About Page', href:'/admin/dashboard/cms/about' },
      { label:'Services', href:'/admin/dashboard/cms/services' },
      { label:'Projects', href:'/admin/dashboard/cms/projects' },
      { label:'Contact', href:'/admin/dashboard/cms/contact' },
      { label:'Navbar', href:'/admin/dashboard/cms/navbar' },
      { label:'Footer', href:'/admin/dashboard/cms/footer' },
    ],
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router   = useRouter();
  const [cmsOpen, setCmsOpen] = useState(pathname?.startsWith('/admin/dashboard/cms'));

  const logout = () => {
    localStorage.removeItem('rmastAdminToken');
    router.push('/admin');
  };

  return (
    <aside style={{ position:'fixed', left:0, top:0, height:'100vh', width:'240px', background:'rgba(5,12,9,0.98)', borderRight:'1px solid rgba(82,183,136,0.08)', backdropFilter:'blur(24px)', display:'flex', flexDirection:'column', zIndex:40 }}>
      {/* Logo */}
      <div style={{ padding:'24px 20px 20px', borderBottom:'1px solid rgba(82,183,136,0.07)' }}>
        <motion.div animate={{ opacity:[0.8,1,0.8] }} transition={{ duration:3, repeat:Infinity }}>
          <h1 style={{ fontFamily:"'Syne', sans-serif", fontSize:'1.5rem', fontWeight:800, letterSpacing:'0.22em', margin:'0 0 4px', background:'linear-gradient(135deg, #52b788, #00e5ff)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>
            RMAST
          </h1>
        </motion.div>
        <p style={{ color:'rgba(232,245,236,0.2)', fontSize:'9px', letterSpacing:'3.5px', textTransform:'uppercase', margin:0 }}>Admin Panel</p>
      </div>

      {/* Nav */}
      <nav style={{ flex:1, padding:'14px 10px', overflowY:'auto', display:'flex', flexDirection:'column', gap:'2px' }}>
        {navItems.map((item, i) => {
          const isActive = pathname === item.href || (item.href !== '/admin/dashboard' && pathname?.startsWith(item.href + '/'));
          const hasSub   = !!item.submenu;

          return (
            <div key={i}>
              {hasSub ? (
                <button onClick={()=>setCmsOpen(o=>!o)}
                  style={{ width:'100%', display:'flex', alignItems:'center', justifyContent:'space-between', gap:'10px', padding:'9px 12px', borderRadius:'10px', border:'none', cursor:'pointer', background:isActive?'rgba(82,183,136,0.1)':'transparent', color:isActive?accent:'rgba(232,245,236,0.4)', fontSize:'13px', fontWeight:600, transition:'all 0.2s', textAlign:'left' }}>
                  <span style={{ display:'flex', alignItems:'center', gap:'9px' }}>
                    <span style={{ fontSize:'14px' }}>{item.icon}</span>{item.label}
                  </span>
                  <span style={{ fontSize:'9px', transition:'transform 0.2s', transform:cmsOpen?'rotate(180deg)':'none', opacity:0.5 }}>▼</span>
                </button>
              ) : (
                <Link href={item.href} style={{ textDecoration:'none' }}>
                  <motion.div whileHover={{ x:2 }}
                    style={{ display:'flex', alignItems:'center', gap:'9px', padding:'9px 12px', borderRadius:'10px', background:isActive?'rgba(82,183,136,0.1)':'transparent', color:isActive?accent:'rgba(232,245,236,0.4)', fontSize:'13px', fontWeight:600, transition:'all 0.2s', border:isActive?`1px solid rgba(82,183,136,0.18)`:'1px solid transparent', justifyContent:'space-between' }}>
                    <span style={{ display:'flex', alignItems:'center', gap:'9px' }}>
                      <span style={{ fontSize:'14px' }}>{item.icon}</span>{item.label}
                    </span>
                    {isActive && <div style={{ width:3, height:14, background:accent, borderRadius:2 }} />}
                  </motion.div>
                </Link>
              )}

              {hasSub && cmsOpen && (
                <motion.div initial={{ opacity:0, height:0 }} animate={{ opacity:1, height:'auto' }}
                  style={{ marginLeft:'10px', paddingLeft:'14px', borderLeft:'1px solid rgba(82,183,136,0.08)', marginTop:'3px', display:'flex', flexDirection:'column', gap:'1px' }}>
                  {item.submenu!.map((sub, j) => {
                    const subActive = pathname === sub.href;
                    return (
                      <Link key={j} href={sub.href} style={{ textDecoration:'none' }}>
                        <div style={{ padding:'6px 10px', borderRadius:'8px', fontSize:'12px', color:subActive?accent:'rgba(232,245,236,0.3)', background:subActive?'rgba(82,183,136,0.07)':'transparent', fontWeight:subActive?700:400, transition:'all 0.2s' }}>
                          {sub.label}
                        </div>
                      </Link>
                    );
                  })}
                </motion.div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Bottom */}
      <div style={{ padding:'14px 10px', borderTop:'1px solid rgba(82,183,136,0.07)' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'10px', padding:'8px 12px', marginBottom:'6px' }}>
          <div style={{ width:30, height:30, borderRadius:'50%', background:'rgba(82,183,136,0.12)', border:'1px solid rgba(82,183,136,0.25)', display:'flex', alignItems:'center', justifyContent:'center', color:accent, fontWeight:800, fontSize:'12px', fontFamily:"'Syne', sans-serif" }}>R</div>
          <div>
            <p style={{ color:'#e8f5ec', fontSize:'12px', fontWeight:700, margin:0 }}>RMAST</p>
            <p style={{ color:'rgba(232,245,236,0.25)', fontSize:'10px', margin:0 }}>Portfolio Admin</p>
          </div>
        </div>
        <button onClick={logout}
          style={{ width:'100%', display:'flex', alignItems:'center', gap:'9px', padding:'9px 12px', borderRadius:'10px', border:'none', background:'transparent', color:'rgba(232,245,236,0.25)', fontSize:'13px', cursor:'pointer', transition:'all 0.2s' }}
          onMouseEnter={e=>{(e.currentTarget as HTMLButtonElement).style.color='#ff6b6b';(e.currentTarget as HTMLButtonElement).style.background='rgba(255,107,107,0.07)';}}
          onMouseLeave={e=>{(e.currentTarget as HTMLButtonElement).style.color='rgba(232,245,236,0.25)';(e.currentTarget as HTMLButtonElement).style.background='transparent';}}>
          <span style={{ fontSize:'14px' }}>🚪</span> Logout
        </button>
      </div>
    </aside>
  );
}