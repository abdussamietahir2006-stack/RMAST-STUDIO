import { getPageContent } from '@/lib/cms';
import ServicesHero from '../../components/services/ServicesHero';
import ServicesGrid from '../../components/services/ServicesGrid';
import ServicesDetails from '../../components/services/ServicesDetails';
import ServicesCTA from '../../components/services/ServicesCTA';

export const revalidate = 60;

export default async function ServicesPage() {
  const { content, images } = await getPageContent('services');

  return (
    <>
      <ServicesHero data={content} />
      <ServicesGrid data={content} />
      <ServicesDetails data={content} images={images} />
      <ServicesCTA data={content} />
    </>
  );
}