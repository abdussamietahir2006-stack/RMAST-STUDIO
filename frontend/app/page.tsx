import { getPageContent } from '@/lib/cms';
import Hero from '../components/home/Hero';
import ServicesPreview from '../components/home/ServicesPreview';
import WhoIHelp from '../components/home/WhoIHelp';
import Process from '../components/home/Process';
import Testimonials from '../components/home/Testimonials';
import Newsletter from '../components/home/Newsletter';

export const revalidate = 60;

export const metadata = {
  title: 'RMAST Studio — Digital Products for Founders & Brands',
  description:
    'RMAST Studio is a full-stack digital studio building end-to-end web products, UI/UX designs, 3D experiences, and AI automation for founders and brands worldwide.',
  alternates: { canonical: '/' },
}

export default async function Home() {
  const { content, images } = await getPageContent('home');

  return (
    <>
      <Hero     data={content} images={images} />
      <ServicesPreview data={content} />
      <WhoIHelp data={content} images={images} />
      <Process  data={content} />
      <Testimonials />
      <Newsletter data={content} />
    </>
  );
}