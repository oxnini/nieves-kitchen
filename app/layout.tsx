import type { Metadata } from 'next';
import { Figtree, Literata, Cutive_Mono, Courier_Prime } from 'next/font/google';
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
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

const cutiveMono = Cutive_Mono({
  subsets: ['latin'],
  variable: '--font-cutive',
  weight: ['400'],
  display: 'swap',
});

// Used by passport cancellation postmarks — needs a real bold weight
// (Cutive Mono only ships at 400) so the date/title read at small sizes.
const courierPrime = Courier_Prime({
  subsets: ['latin'],
  variable: '--font-stamp-cancel',
  weight: ['400', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Nieves' Kitchen",
  description: 'Globally inspired halal recipes for the health-conscious foodie.',
};

export default function RootLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${figtree.variable} ${literata.variable} ${cutiveMono.variable} ${courierPrime.variable}`} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `try{if(localStorage.getItem('nieves-theme')==='sepia')document.documentElement.dataset.theme='sepia'}catch(e){}`,
          }}
        />
      </head>
      <body className="min-h-[100dvh] bg-parchment overflow-x-hidden overscroll-none">
        <Providers>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:bg-terracotta focus:text-white focus:px-4 focus:py-2 focus:rounded-full focus:text-sm focus:font-medium focus:shadow-lg"
          >
            Skip to content
          </a>
          <Navbar />
          {/* Top padding clears the floating navbar pill on routes whose
              content starts at the top of <main>. The map page (/) uses
              position:fixed for its WorldMap, so the padding here is
              invisible there. 4.5rem matches the WorldMapMobile chrome
              band offset, keeping a single repo-wide constant. */}
          <main
            id="main"
            className="pt-[calc(4.5rem+env(safe-area-inset-top))] sm:pt-[4.5rem]"
          >
            {children}
          </main>
          {modal}
        </Providers>
      </body>
    </html>
  );
}
