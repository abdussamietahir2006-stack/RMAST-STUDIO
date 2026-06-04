import { getPageContent } from '@/lib/cms';
import AboutHero from '../../components/about/AboutHero';
import AboutStory from '../../components/about/AboutStory';
import AboutMissionVision from '../../components/about/AboutMissionVision';
import AboutValues from '../../components/about/AboutValues';
import AboutStats from '../../components/about/AboutStats';
import AboutTeam from '../../components/about/AboutTeam';
import AboutCTA from '../../components/about/AboutCTA';

export const revalidate = 60;

export default async function AboutPage() {
  const { content, images } = await getPageContent('about');

  return (
    <>
      <AboutHero data={content} images={images} />
      <AboutStory data={content} images={images} />
      <AboutMissionVision data={content} images={images} />
      <AboutValues data={content} images={images} />
      <AboutStats data={content} images={images} />
      <AboutTeam data={content} images={images} />
      <AboutCTA data={content} images={images} />
    </>
  );
}