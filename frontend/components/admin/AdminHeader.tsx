'use client';
import { usePathname } from 'next/navigation';

const pageTitles: Record<string, string> = {
  '/admin/dashboard':                      'Dashboard Overview',
  '/admin/dashboard/leads':                'Leads',
  '/admin/dashboard/bookings':             'Bookings',
  '/admin/dashboard/subscribers':          'Subscribers',
  '/admin/dashboard/testimonials':         'Testimonials',
  '/admin/dashboard/projects':             'Projects',
  '/admin/dashboard/cms':                  'Content Management',
  '/admin/dashboard/cms/home':             'CMS — Home Page',
  '/admin/dashboard/cms/about':            'CMS — About Page',
  '/admin/dashboard/cms/services':         'CMS — Services Page',
  '/admin/dashboard/cms/projects':         'CMS — Projects Page',
  '/admin/dashboard/cms/contact':          'CMS — Contact Page',
  '/admin/dashboard/cms/navbar':           'CMS — Navbar',
  '/admin/dashboard/cms/footer':           'CMS — Footer',
};

export default function AdminHeader() {
  const pathname = usePathname();
  const title = pageTitles[pathname] || 'Admin';

  return (
    <header style={{
      position: 'fixed', top: 0, left: '240px', right: 0, height: '60px',
      background: 'rgba(5,12,9,0.97)', borderBottom: '1px solid rgba(82,183,136,0.08)',
      backdropFilter: 'blur(24px)', display: 'flex', alignItems: 'center',
      justifyContent: 'space-between', padding: '0 28px', zIndex: 30,
    }}>
      <h2 style={{ color: '#e8f5ec', fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '15px', margin: 0, letterSpacing: '0.02em' }}>
        {title}
      </h2>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '7px', padding: '5px 14px', borderRadius: '100px', background: 'rgba(82,183,136,0.07)', border: '1px solid rgba(82,183,136,0.15)' }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#52b788', boxShadow: '0 0 6px #52b788', display: 'inline-block', animation: 'pulseDot 1.8s ease infinite' }} />
          <span style={{ color: '#52b788', fontSize: '11px', fontWeight: 600 }}>Live</span>
        </div>
        <span style={{ color: 'rgba(232,245,236,0.2)', fontSize: '12px' }}>
          {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
        </span>
      </div>
      <style>{`@keyframes pulseDot{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.35;transform:scale(1.6)}}`}</style>
    </header>
  );
}