import './globals.css';
import { ReactNode } from 'react';
import { Syne } from 'next/font/google';
import { headers } from 'next/headers';
import { getPageContent } from '@/lib/cms';

import Navbar from '../components/navbar';
import Footer from '../components/footer';

const syne = Syne({ subsets: ['latin'], variable: '--font-syne' });

export const metadata = {
  title: 'RMAST STUDIO – Portfolio',
  description: 'Full-Stack Developer · Designer · AI Automation',
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const headersList = await headers();
  const pathname = headersList.get('x-pathname') || '';
  const isAdmin = pathname.startsWith('/admin');

  // Fetch CMS Navbar & Footer content for non-admin pages
  const { content: navbarContent } = isAdmin ? { content: {} } : await getPageContent('navbar');
  const { content: footerContent } = isAdmin ? { content: {} } : await getPageContent('footer');

  return (
    <html lang="en" className={syne.variable}>
      <body>
        {isAdmin ? (
          // Admin routes: render nothing but children — AdminRootLayout handles it
          children
        ) : (
          <div className="layout">
            <Navbar data={navbarContent} />
            <main className="main">{children}</main>
            <Footer data={footerContent} />
          </div>
        )}
      </body>
    </html>
  );
}