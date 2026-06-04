import { getPageContent } from '@/lib/cms';
import ProjectsHero from '../../components/projects/ProjectsHero';
import ProjectStats from '../../components/projects/ProjectStats';
import ProjectShowcase from '../../components/projects/ProjectShowcase';
import ProjectsPageClient from '../../components/projects/ProjectsPageClient';
import ProjectCTA from '../../components/projects/ProjectCTA';

export const revalidate = 60;

export default async function ProjectsPage() {
  const { content, images } = await getPageContent('projects-page');

  return (
    <>
      <ProjectsHero data={content} />
      <ProjectStats data={content} />
      <ProjectShowcase data={content} images={images} />
      <ProjectsPageClient />
      <ProjectCTA data={content} />
    </>
  );
}