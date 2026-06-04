'use client';

import { motion, AnimatePresence } from 'framer-motion';
import ProjectCard from './ProjectCard';
import { useState, useEffect } from 'react';

type Project = {
  title?: string;
  desc?: string;
  category?: string;
  image?: string;
  stack?: string[];
  link?: string;
  year?: string;
};

type Props = {
  filter: string;
};

export default function ProjectsGrid({ filter }: Props) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/projects')
      .then(r => r.json())
      .then(res => { if (res && res.success && Array.isArray(res.data)) setProjects(res.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter === 'All' ? projects : projects.filter(p => p.category === filter);

  return (
    <section style={{
      padding: '2rem 6vw 4rem',
      background: '#0b0f0e',
      position: 'relative',
    }}>
      <AnimatePresence mode="wait">
        <motion.div
          key={filter + (loading ? '-loading' : '-loaded')}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '20px',
            maxWidth: '1200px',
            margin: '0 auto',
          }}
        >
          {loading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div key={i} style={{
                  height: 320,
                  borderRadius: 18,
                  background: '#0b1f18',
                  opacity: 0.5,
                  animation: 'pulseDot 1.2s ease-in-out infinite',
                }} />
              ))
            : filtered.length === 0 ? (
                <div style={{
                  gridColumn: '1 / -1',
                  textAlign: 'center',
                  padding: '4rem 2rem',
                  border: '1px dashed rgba(82,183,136,0.2)',
                  borderRadius: 18,
                  background: 'rgba(10,24,18,0.2)',
                }}>
                  <p style={{ color: '#52b788', fontSize: '1.2rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                    No Projects Found
                  </p>
                  <p style={{ color: 'rgba(232,245,236,0.4)', fontSize: '0.85rem' }}>
                    Add some projects from your admin dashboard to showcase them here.
                  </p>
                </div>
              )
            : filtered.map((project, i) => (
                <ProjectCard key={project.title} project={project} index={i} />
              ))}
        </motion.div>
      </AnimatePresence>
    </section>
  );
}