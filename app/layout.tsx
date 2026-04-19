import type { Metadata } from 'next';
import { Figtree, Literata, Cutive_Mono } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Providers from '@/components/Providers';

const figtree = Figtree({
  subsets: ['latin'],
  variable: '--font-figtree',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

const literata = Literata({
  subsets: ['latin'],
  variable: '--font-literata',
  weight: ['400', '600', '700'],
  display: 'swap',
});

const cutiveMono = Cutive_Mono({
  subsets: ['latin'],
  variable: '--font-cutive',
  weight: ['400'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Nieves' Kitchen",
  description: 'Globally inspired halal recipes for the health-conscious foodie.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${figtree.variable} ${literata.variable} ${cutiveMono.variable}`}>
      <body className="min-h-screen bg-parchment overflow-x-hidden">
        <Providers>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:bg-terracotta focus:text-white focus:px-4 focus:py-2 focus:rounded-full focus:text-sm focus:font-medium focus:shadow-lg"
          >
            Skip to content
          </a>
          <Navbar />
          <main id="main">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
