'use client';

import { useState } from 'react';
import ProjectsViewToggle from './ProjectsViewToggle';
import ProjectsFilter from './ProjectsFilter';
import ProjectsGrid from './ProjectsGrid';
import Projects3DView from './Projects3DView';

type ViewMode = 'grid' | '3d';

export default function ProjectsPageClient() {
  const [view, setView] = useState<ViewMode>('grid');
  const [filter, setFilter] = useState<string>('All');

  return (
    <>
      <ProjectsViewToggle view={view} setView={setView} />
      <ProjectsFilter filter={filter} setFilter={setFilter} />

      {view === 'grid' ? (
        <ProjectsGrid filter={filter} />
      ) : (
        <Projects3DView />
      )}
    </>
  );
}
