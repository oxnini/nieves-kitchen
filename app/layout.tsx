import type { Metadata } from 'next';
import { Karla, Fraunces, Cutive_Mono, Courier_Prime } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Providers from '@/components/Providers';

// Courtyard body / UI face. Karla is variable; load the discrete weights the
// design language uses (400/500/600/700).
const karla = Karla({
  subsets: ['latin'],
  variable: '--font-karla',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

// Courtyard display face. Fraunces is variable — include the optical-size axis
// so it optically adapts across hero and body sizes (font-optical-sizing: auto).
// Italic is loaded for the single-emphasised-word display treatment + wordmark.
const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  axes: ['opsz'],
  style: ['normal', 'italic'],
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
  title: "Nieves's Kitchen",
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
    <html lang="en" className={`${karla.variable} ${fraunces.variable} ${cutiveMono.variable} ${courierPrime.variable}`} suppressHydrationWarning>
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
          {/* Top padding clears the fixed Courtyard nav band on routes whose
              content starts at the top of <main>. The band is 64px on mobile
              and 88px (5.5rem) from sm up; the mobile 4.5rem keeps clearance
              over the 64px band and matches the WorldMapMobile chrome offset,
              a single repo-wide constant. The atlas page (/atlas) uses
              position:fixed for its WorldMap, so the padding is invisible there. */}
          <main
            id="main"
            className="pt-[calc(4.5rem+env(safe-area-inset-top))] sm:pt-[5.5rem]"
          >
            {children}
          </main>
          <Footer />
          {modal}
        </Providers>
      </body>
    </html>
  );
}
