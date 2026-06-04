'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import api from '@/lib/api';

interface Stats {
  totalLeads: number; newLeads: number;
  totalBookings: number; pendingBookings: number;
  totalSubscribers: number;
  totalTestimonials: number; pendingTestimonials: number;
  totalProjects: number; pagesManaged: number;
}

interface ChartDay { label: string; leads: number; bookings: number; subscribers: number; testimonials: number; isToday: boolean; }

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: { name: string; value: number; color: string }[]; label?: string }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: 'rgba(5,12,9,0.97)', border: '1px solid rgba(82,183,136,0.2)', borderRadius: '12px', padding: '10px 14px', boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}>
      <p style={{ color: '#52b788', fontSize: '11px', fontWeight: 700, margin: '0 0 6px' }}>{label}</p>
      {payload.map((e, i) => (
        <p key={i} style={{ fontSize: '11px', color: e.color, margin: '2px 0' }}>{e.name}: <strong>{e.value}</strong></p>
      ))}
    </div>
  );
};

const quickLinks = [
  { label: 'Home Page',    href: '/admin/dashboard/cms/home',     icon: '🏠', desc: 'Hero, stats, services' },
  { label: 'About Page',   href: '/admin/dashboard/cms/about',    icon: '👤', desc: 'Story, values, team' },
  { label: 'Services',     href: '/admin/dashboard/cms/services', icon: '⚡', desc: 'Service details' },
  { label: 'Projects CMS', href: '/admin/dashboard/cms/projects', icon: '🚀', desc: 'Featured project' },
  { label: 'Contact',      href: '/admin/dashboard/cms/contact',  icon: '✉', desc: 'Contact info, FAQ' },
  { label: 'Navbar',       href: '/admin/dashboard/cms/navbar',   icon: '🔗', desc: 'Links, CTA button' },
  { label: 'Footer',       href: '/admin/dashboard/cms/footer',   icon: '📌', desc: 'Footer content & links' },
];

export default function AdminDashboard() {
  const [stats, setStats]       = useState<Stats | null>(null);
  const [chartData, setChartData] = useState<ChartDay[]>([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/api/dashboard/stats'),
      api.get('/api/dashboard/weekly-chart'),
    ]).then(([s, c]) => {
      setStats(s.data.data);
      setChartData(c.data.data);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const statCards = [
    { label: 'Total Leads',     value: stats?.totalLeads ?? 0,        sub: `${stats?.newLeads ?? 0} new`,                  color: '#52b788', href: '/admin/dashboard/leads' },
    { label: 'Bookings',        value: stats?.totalBookings ?? 0,      sub: `${stats?.pendingBookings ?? 0} pending`,        color: '#00e5ff', href: '/admin/dashboard/bookings' },
    { label: 'Subscribers',     value: stats?.totalSubscribers ?? 0,   sub: 'newsletter',                                   color: '#ffca28', href: '/admin/dashboard/subscribers' },
    { label: 'Testimonials',    value: stats?.totalTestimonials ?? 0,  sub: `${stats?.pendingTestimonials ?? 0} pending`,    color: '#76ff03', href: '/admin/dashboard/testimonials' },
    { label: 'Projects',        value: stats?.totalProjects ?? 0,      sub: 'in portfolio',                                 color: '#c77dff', href: '/admin/dashboard/projects' },
    { label: 'Pages Managed',   value: stats?.pagesManaged ?? 7,       sub: 'via CMS',                                      color: '#ff6b6b', href: '/admin/dashboard/cms' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

      {/* Welcome */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 style={{ fontFamily: "'Syne', sans-serif", color: '#e8f5ec', fontSize: '1.8rem', fontWeight: 800, margin: '0 0 4px', letterSpacing: '-0.5px' }}>
          Welcome back,{' '}
          <span style={{ background: 'linear-gradient(90deg, #52b788, #00e5ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            RMAST
          </span>
        </h1>
        <p style={{ color: 'rgba(232,245,236,0.3)', fontSize: '13px', margin: 0 }}>Here&apos;s your portfolio dashboard for today.</p>
      </motion.div>

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px' }}>
        {statCards.map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
            <Link href={s.href} style={{ textDecoration: 'none' }}>
              <motion.div whileHover={{ scale: 1.02, y: -2 }}
                style={{ padding: '20px', borderRadius: '16px', background: 'rgba(11,20,16,0.85)', border: `1px solid ${s.color}18`, cursor: 'pointer', position: 'relative', overflow: 'hidden', transition: 'border-color 0.3s' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: `linear-gradient(90deg, ${s.color}, transparent)` }} />
                <div style={{ position: 'absolute', bottom: 0, right: 0, width: '60px', height: '60px', background: `radial-gradient(circle, ${s.color}0a, transparent 70%)`, borderRadius: '50%' }} />
                <p style={{ color: s.color, fontSize: '2.4rem', fontFamily: "'Syne', sans-serif", fontWeight: 900, margin: '0 0 4px', lineHeight: 1 }}>
                  {loading ? <span style={{ color: 'rgba(232,245,236,0.1)' }}>—</span> : s.value}
                </p>
                <p style={{ color: '#e8f5ec', fontSize: '13px', fontWeight: 600, margin: '0 0 2px' }}>{s.label}</p>
                <p style={{ color: 'rgba(232,245,236,0.25)', fontSize: '11px', margin: 0 }}>{s.sub}</p>
              </motion.div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Chart */}
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
        style={{ padding: '24px', borderRadius: '16px', background: 'rgba(11,20,16,0.85)', border: '1px solid rgba(82,183,136,0.07)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h3 style={{ color: '#e8f5ec', fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '15px', margin: '0 0 3px' }}>Weekly Activity</h3>
            <p style={{ color: 'rgba(232,245,236,0.25)', fontSize: '12px', margin: 0 }}>Leads, bookings, subscribers & testimonials — last 7 days</p>
          </div>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            {[['#52b788','Leads'],['#00e5ff','Bookings'],['#ffca28','Subscribers'],['#76ff03','Testimonials']].map(([c,l]) => (
              <span key={l} style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'rgba(232,245,236,0.35)', fontSize: '11px' }}>
                <span style={{ width: 10, height: 10, borderRadius: '3px', background: c, display: 'inline-block' }} />{l}
              </span>
            ))}
          </div>
        </div>

        {loading ? (
          <div style={{ height: 260, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ display: 'flex', gap: '6px' }}>
              {[0,1,2].map(i => (
                <motion.div key={i} animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0.8, 0.3] }}
                  transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                  style={{ width: 8, height: 8, borderRadius: '50%', background: '#52b788' }} />
              ))}
            </div>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '16px' }}>
            {chartData.map((day, idx) => {
              const maxValue = Math.max(...chartData.flatMap(d => [d.leads, d.bookings, d.subscribers, d.testimonials]), 1);
              const entries = [
                { label: 'Leads', value: day.leads, color: '#52b788' },
                { label: 'Bookings', value: day.bookings, color: '#00e5ff' },
                { label: 'Subscribers', value: day.subscribers, color: '#ffca28' },
                { label: 'Testimonials', value: day.testimonials, color: '#76ff03' },
              ];

              return (
                <div key={idx} style={{ display: 'grid', gap: '10px', padding: '10px 0', borderBottom: idx < chartData.length - 1 ? '1px solid rgba(82,183,136,0.08)' : 'none' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', alignItems: 'center' }}>
                    <span style={{ color: '#e8f5ec', fontSize: '12px', fontWeight: 600 }}>{day.label.split(', ')[0]}</span>
                    <span style={{ color: 'rgba(232,245,236,0.35)', fontSize: '11px' }}>Total: {day.leads + day.bookings + day.subscribers + day.testimonials}</span>
                  </div>
                  <div style={{ display: 'grid', gap: '8px' }}>
                    {entries.map((entry) => (
                      <div key={entry.label} style={{ display: 'grid', gap: '4px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'rgba(232,245,236,0.45)' }}>
                          <span>{entry.label}</span>
                          <span>{entry.value}</span>
                        </div>
                        <div style={{ height: '8px', borderRadius: '999px', background: 'rgba(232,245,236,0.08)' }}>
                          <div style={{ width: `${(entry.value / maxValue) * 100}%`, height: '100%', borderRadius: '999px', background: entry.color }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {chartData.length > 0 && (
          <p style={{ textAlign: 'center', color: 'rgba(232,245,236,0.15)', fontSize: '11px', marginTop: '10px' }}>
            Today: <span style={{ color: '#52b788' }}>{chartData.find(d => d.isToday)?.label ?? '—'}</span>
          </p>
        )}
      </motion.div>

      {/* Quick CMS */}
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
        style={{ padding: '24px', borderRadius: '16px', background: 'rgba(11,20,16,0.85)', border: '1px solid rgba(82,183,136,0.07)' }}>
        <h3 style={{ color: '#e8f5ec', fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '15px', margin: '0 0 16px' }}>Quick CMS Access</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '10px' }}>
          {quickLinks.map((l, i) => (
            <Link key={i} href={l.href} style={{ textDecoration: 'none' }}>
              <motion.div whileHover={{ scale: 1.03, borderColor: 'rgba(82,183,136,0.25)' }}
                style={{ padding: '14px', borderRadius: '12px', background: 'rgba(82,183,136,0.03)', border: '1px solid rgba(82,183,136,0.08)', cursor: 'pointer', transition: 'border-color 0.2s' }}>
                <p style={{ fontSize: '20px', margin: '0 0 7px' }}>{l.icon}</p>
                <p style={{ color: '#e8f5ec', fontSize: '12px', fontWeight: 700, margin: '0 0 2px' }}>{l.label}</p>
                <p style={{ color: 'rgba(232,245,236,0.25)', fontSize: '11px', margin: 0 }}>{l.desc}</p>
              </motion.div>
            </Link>
          ))}
        </div>
      </motion.div>
    </div>
  );
}