import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'RMAST Admin',
  description: 'RMAST Portfolio Admin Dashboard',
};

// This layout completely overrides the root layout for all /admin routes
// so Navbar and Footer from root layout never render here
export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return children;
}