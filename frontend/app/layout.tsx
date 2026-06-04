import './globals.css';
import { ReactNode } from 'react';
import { Syne } from 'next/font/google';
import { headers } from 'next/headers';
import { getPageContent } from '@/lib/cms';
import type { Metadata } from 'next';

import Navbar from '../components/navbar';
import Footer from '../components/footer';

const syne = Syne({ subsets: ['latin'], variable: '--font-syne' });

export const metadata: Metadata = {
  title: {
    default: 'RMAST Studio — Digital Products for Founders & Brands',
    template: '%s | RMAST Studio',
  },
  description:
    'RMAST Studio builds end-to-end digital products for founders, brands, and startups worldwide. Web development, UI/UX design, 3D & motion, and AI automation.',
  keywords: [
    'full stack developer',
    'web development',
    'UI UX design',
    'AI automation',
    'Next.js developer',
    'React developer',
    'digital studio',
    'RMAST Studio',
    'portfolio',
    'freelance developer Pakistan',
  ],
  metadataBase: new URL('https://rmast-studio.vercel.app'),
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  verification: {
    google: 'Ppcrnfwlb1GkxnOQjEXx82s7rO2obmAhbOXlpBXtLBA',
  },
  openGraph: {
    type: 'website',
    url: 'https://rmast-studio.vercel.app',
    siteName: 'RMAST Studio',
    title: 'RMAST Studio — Digital Products for Founders & Brands',
    description:
      'End-to-end digital products for founders, brands, and startups worldwide. Web dev, UI/UX, 3D & motion, AI automation.',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RMAST Studio — Digital Products for Founders & Brands',
    description:
      'End-to-end digital products for founders, brands, and startups worldwide.',
  },
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const headersList = await headers();
  const pathname = headersList.get('x-pathname') || '';
  const isAdmin = pathname.startsWith('/admin');

  const { content: navbarContent } = isAdmin ? { content: {} } : await getPageContent('navbar');
  const { content: footerContent } = isAdmin ? { content: {} } : await getPageContent('footer');

  return (
    <html lang="en" className={syne.variable}>
      <body>
        {isAdmin ? (
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