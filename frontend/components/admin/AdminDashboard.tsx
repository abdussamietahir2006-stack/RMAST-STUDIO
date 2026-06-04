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
  const [chartMode, setChartMode] = useState<'stacked' | 'grouped' | 'leads' | 'bookings' | 'subscribers' | 'testimonials'>('stacked');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h3 style={{ color: '#e8f5ec', fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '15px', margin: '0 0 3px' }}>Weekly Activity</h3>
            <p style={{ color: 'rgba(232,245,236,0.25)', fontSize: '12px', margin: 0 }}>Leads, bookings, subscribers & testimonials — last 7 days</p>
          </div>
          <div style={{ display: 'flex', gap: '4px', background: 'rgba(232,245,236,0.02)', padding: '3px', borderRadius: '8px', border: '1px solid rgba(82,183,136,0.04)', overflowX: 'auto', maxWidth: '100%' }}>
            {(['stacked', 'grouped', 'leads', 'bookings', 'subscribers', 'testimonials'] as const).map((mode) => {
              const isActive = chartMode === mode;
              const label = mode === 'stacked' ? 'Stacked' : mode === 'grouped' ? 'Grouped' : mode.charAt(0).toUpperCase() + mode.slice(1);
              const color =
                mode === 'stacked' || mode === 'grouped' ? '#52b788' :
                mode === 'leads' ? '#52b788' :
                mode === 'bookings' ? '#00e5ff' :
                mode === 'subscribers' ? '#ffca28' : '#76ff03';
              return (
                <button
                  key={mode}
                  onClick={() => setChartMode(mode)}
                  style={{
                    border: 'none',
                    background: isActive ? 'rgba(82,183,136,0.1)' : 'transparent',
                    color: isActive ? color : 'rgba(232,245,236,0.35)',
                    padding: '5px 10px',
                    borderRadius: '6px',
                    fontSize: '11px',
                    fontWeight: isActive ? 700 : 500,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.2s',
                  }}
                >
                  {label}
                </button>
              );
            })}
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
        ) : (() => {
          const maxVal = chartMode === 'stacked'
            ? Math.max(...chartData.map(d => d.leads + d.bookings + d.subscribers + d.testimonials), 1)
            : chartMode === 'grouped'
            ? Math.max(...chartData.flatMap(d => [d.leads, d.bookings, d.subscribers, d.testimonials]), 1)
            : Math.max(...chartData.map(d => (d[chartMode as 'leads' | 'bookings' | 'subscribers' | 'testimonials'] ?? 0)), 1);

          const roundedMax = Math.ceil(maxVal / 5) * 5 || Math.ceil(maxVal / 2) * 2 || 2;
          const divisions = 4;
          const tickStep = roundedMax / divisions;
          const ticks = Array.from({ length: divisions + 1 }, (_, i) => Math.round(roundedMax - i * tickStep));

          return (
            <div>
              <div style={{ position: 'relative', height: '240px', marginTop: '40px', marginBottom: '10px', overflow: 'visible' }}>
                {/* Y-Axis Grid Lines */}
                {Array.from({ length: 5 }, (_, i) => {
                  const ratio = i / 4;
                  return (
                    <div key={i} style={{
                      position: 'absolute',
                      left: '40px',
                      right: '0',
                      bottom: `${ratio * 100}%`,
                      borderBottom: '1px dashed rgba(232, 245, 236, 0.07)',
                      pointerEvents: 'none'
                    }} />
                  );
                })}

                {/* Y-Axis Labels */}
                {ticks.map((tick, i) => {
                  const ratio = (ticks.length - 1 - i) / (ticks.length - 1);
                  return (
                    <div key={i} style={{
                      position: 'absolute',
                      left: '0',
                      bottom: `calc(${ratio * 100}% - 6px)`,
                      width: '32px',
                      textAlign: 'right',
                      color: 'rgba(232,245,236,0.3)',
                      fontSize: '10px',
                      fontWeight: 500,
                      fontFamily: 'monospace'
                    }}>
                      {tick}
                    </div>
                  );
                })}

                {/* Tooltip */}
                {hoveredIndex !== null && chartData[hoveredIndex] && (
                  <div style={{
                    position: 'absolute',
                    top: '-120px',
                    left: `${((hoveredIndex + 0.5) / chartData.length) * 100}%`,
                    transform: 'translateX(-50%)',
                    zIndex: 10,
                    pointerEvents: 'none',
                    transition: 'left 0.15s ease-out',
                  }}>
                    <div style={{
                      background: 'rgba(5,12,9,0.98)',
                      border: '1px solid rgba(82,183,136,0.25)',
                      borderRadius: '10px',
                      padding: '8px 12px',
                      boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '3px',
                    }}>
                      <p style={{ color: '#52b788', fontSize: '10px', fontWeight: 800, margin: '0 0 2px', whiteSpace: 'nowrap' }}>
                        {chartData[hoveredIndex].label} {chartData[hoveredIndex].isToday ? '• Today' : ''}
                      </p>
                      {[
                        { label: 'Leads', value: chartData[hoveredIndex].leads, color: '#52b788' },
                        { label: 'Bookings', value: chartData[hoveredIndex].bookings, color: '#00e5ff' },
                        { label: 'Subscribers', value: chartData[hoveredIndex].subscribers, color: '#ffca28' },
                        { label: 'Testimonials', value: chartData[hoveredIndex].testimonials, color: '#76ff03' }
                      ].map(item => (
                        <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', gap: '20px', fontSize: '10px', color: 'rgba(232,245,236,0.7)', whiteSpace: 'nowrap' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <span style={{ width: 5, height: 5, borderRadius: '50%', background: item.color }} />
                            {item.label}
                          </span>
                          <strong style={{ color: item.color }}>{item.value}</strong>
                        </div>
                      ))}
                      <div style={{ height: '1px', background: 'rgba(82,183,136,0.15)', margin: '3px 0' }} />
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', fontWeight: 700, color: '#e8f5ec', whiteSpace: 'nowrap' }}>
                        <span>Total</span>
                        <span>{chartData[hoveredIndex].leads + chartData[hoveredIndex].bookings + chartData[hoveredIndex].subscribers + chartData[hoveredIndex].testimonials}</span>
                      </div>
                    </div>
                    {/* Tooltip arrow */}
                    <div style={{
                      position: 'absolute',
                      bottom: '-4px',
                      left: '50%',
                      transform: 'translateX(-50%) rotate(45deg)',
                      width: '8px',
                      height: '8px',
                      background: 'rgba(5,12,9,0.98)',
                      borderRight: '1px solid rgba(82,183,136,0.25)',
                      borderBottom: '1px solid rgba(82,183,136,0.25)',
                    }} />
                  </div>
                )}

                {/* Chart Columns */}
                <div style={{
                  position: 'absolute',
                  left: '45px',
                  right: '0',
                  top: '0',
                  bottom: '0',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-end',
                }}>
                  {chartData.map((day, idx) => {
                    const total = day.leads + day.bookings + day.subscribers + day.testimonials;
                    const isStacked = chartMode === 'stacked';
                    const isGrouped = chartMode === 'grouped';

                    return (
                      <div
                        key={idx}
                        onMouseEnter={() => setHoveredIndex(idx)}
                        onMouseLeave={() => setHoveredIndex(null)}
                        style={{
                          flex: 1,
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'flex-end',
                          alignItems: 'center',
                          position: 'relative',
                          cursor: 'pointer',
                        }}
                      >
                        {/* Hover column background highlight */}
                        <div style={{
                          position: 'absolute',
                          top: 0,
                          bottom: 0,
                          left: '2px',
                          right: '2px',
                          borderRadius: '6px',
                          background: hoveredIndex === idx ? 'rgba(82, 183, 136, 0.03)' : 'transparent',
                          transition: 'background 0.2s',
                          pointerEvents: 'none',
                        }} />

                        {/* Today indicator */}
                        {day.isToday && (
                          <div style={{
                            position: 'absolute',
                            top: '4px',
                            width: '6px',
                            height: '6px',
                            borderRadius: '50%',
                            background: '#52b788',
                            boxShadow: '0 0 8px #52b788',
                          }} />
                        )}

                        {/* Bars rendering */}
                        <div style={{
                          width: '100%',
                          height: '100%',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'flex-end',
                          paddingBottom: '4px',
                        }}>
                          {isStacked && (
                            total > 0 ? (
                              <motion.div
                                initial={{ height: 0 }}
                                animate={{ height: `${(total / roundedMax) * 100}%` }}
                                transition={{ type: 'spring', stiffness: 100, damping: 18 }}
                                style={{
                                  width: '14px',
                                  borderRadius: '4px',
                                  overflow: 'hidden',
                                  display: 'flex',
                                  flexDirection: 'column-reverse',
                                  background: 'rgba(232,245,236,0.03)',
                                  boxShadow: hoveredIndex === idx ? '0 0 10px rgba(82,183,136,0.2)' : 'none',
                                  transition: 'box-shadow 0.2s',
                                }}
                              >
                                {day.leads > 0 && <div style={{ height: `${(day.leads / total) * 100}%`, background: '#52b788' }} />}
                                {day.bookings > 0 && <div style={{ height: `${(day.bookings / total) * 100}%`, background: '#00e5ff' }} />}
                                {day.subscribers > 0 && <div style={{ height: `${(day.subscribers / total) * 100}%`, background: '#ffca28' }} />}
                                {day.testimonials > 0 && <div style={{ height: `${(day.testimonials / total) * 100}%`, background: '#76ff03' }} />}
                              </motion.div>
                            ) : (
                              <div style={{ width: '14px', height: '3px', background: 'rgba(232,245,236,0.08)', borderRadius: '1.5px' }} />
                            )
                          )}

                          {isGrouped && (
                            <div style={{ display: 'flex', gap: '2px', alignItems: 'flex-end', height: '100%' }}>
                              {[
                                { val: day.leads, col: '#52b788' },
                                { val: day.bookings, col: '#00e5ff' },
                                { val: day.subscribers, col: '#ffca28' },
                                { val: day.testimonials, col: '#76ff03' }
                              ].map((item, i) => {
                                const valPercent = item.val > 0 ? `${(item.val / roundedMax) * 100}%` : '3px';
                                const bg = item.val > 0 ? item.col : 'rgba(232,245,236,0.04)';
                                return (
                                  <motion.div
                                    key={i}
                                    initial={{ height: 0 }}
                                    animate={{ height: valPercent }}
                                    transition={{ type: 'spring', stiffness: 100, damping: 18, delay: i * 0.03 }}
                                    style={{
                                      width: '3px',
                                      background: bg,
                                      borderRadius: '1.5px 1.5px 0 0',
                                      boxShadow: hoveredIndex === idx && item.val > 0 ? `0 0 6px ${item.col}55` : 'none',
                                      transition: 'box-shadow 0.2s',
                                    }}
                                  />
                                );
                              })}
                            </div>
                          )}

                          {!isStacked && !isGrouped && (() => {
                            const val = day[chartMode as 'leads' | 'bookings' | 'subscribers' | 'testimonials'] ?? 0;
                            const heightPercent = val > 0 ? `${(val / roundedMax) * 100}%` : '3px';
                            const color =
                              chartMode === 'leads' ? '#52b788' :
                              chartMode === 'bookings' ? '#00e5ff' :
                              chartMode === 'subscribers' ? '#ffca28' : '#76ff03';
                            return (
                              <motion.div
                                key={chartMode}
                                initial={{ height: 0 }}
                                animate={{ height: heightPercent }}
                                transition={{ type: 'spring', stiffness: 100, damping: 18 }}
                                style={{
                                  width: '14px',
                                  background: val > 0 ? color : 'rgba(232,245,236,0.04)',
                                  borderRadius: '4px 4px 0 0',
                                  boxShadow: hoveredIndex === idx && val > 0 ? `0 0 10px ${color}55` : 'none',
                                  transition: 'box-shadow 0.2s',
                                }}
                              />
                            );
                          })()}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* X-Axis Labels */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                paddingLeft: '45px',
                marginTop: '8px',
                borderTop: '1px solid rgba(82,183,136,0.08)',
                paddingTop: '8px',
              }}>
                {chartData.map((day, idx) => {
                  const dayName = day.label.split(', ')[0];
                  const dateNum = day.label.split(', ')[1];
                  return (
                    <div key={idx} style={{
                      flex: 1,
                      textAlign: 'center',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                    }}>
                      <span style={{
                        color: day.isToday ? '#52b788' : 'rgba(232,245,236,0.45)',
                        fontSize: '11px',
                        fontWeight: day.isToday ? 700 : 500
                      }}>
                        {dayName}
                      </span>
                      <span style={{
                        color: 'rgba(232,245,236,0.2)',
                        fontSize: '9px',
                        marginTop: '1px'
                      }}>
                        {dateNum}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Legend & Details */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px', flexWrap: 'wrap', gap: '12px', borderTop: '1px solid rgba(82,183,136,0.04)', paddingTop: '12px' }}>
                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                  {[['#52b788','Leads'],['#00e5ff','Bookings'],['#ffca28','Subscribers'],['#76ff03','Testimonials']].map(([c,l]) => (
                    <span key={l} style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'rgba(232,245,236,0.35)', fontSize: '11px' }}>
                      <span style={{ width: 8, height: 8, borderRadius: '2px', background: c, display: 'inline-block' }} />{l}
                    </span>
                  ))}
                </div>
                {chartData.length > 0 && (
                  <span style={{ color: 'rgba(232,245,236,0.2)', fontSize: '11px' }}>
                    Today: <span style={{ color: '#52b788', fontWeight: 600 }}>{chartData.find(d => d.isToday)?.label ?? '—'}</span>
                  </span>
                )}
              </div>
            </div>
          );
        })()}
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