import { getPageContent } from '@/lib/cms';
import ContactHero from '../../components/contact/ContactHero';
import ContactForm from '../../components/contact/ContactForm';
import ContactBooking from '../../components/contact/ContactBooking';
import ContactFAQ from '../../components/contact/ContactFAQ';

export const revalidate = 60;

export const metadata = {
  title: 'Contact',
  description:
    'Get in touch with RMAST Studio. Book a discovery call, start a project, or ask about web development, design, and AI automation services.',
  alternates: { canonical: '/contact' },
}

export default async function ContactPage() {
  const { content } = await getPageContent('contact');

  return (
    <>
      <ContactHero data={content} />
      <ContactForm data={content} />
      <ContactBooking />
      <ContactFAQ data={content} />
    </>
  );
}