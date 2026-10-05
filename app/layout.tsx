import type { Metadata } from 'next';
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from '@/lib/site';
import { Newsreader, Hanken_Grotesk, Cutive_Mono, Courier_Prime } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Providers from '@/components/Providers';
import SiteGround from '@/components/SiteGround';

// Body / UI face. Hanken Grotesk is variable; load the whole weight axis so
// in-between weights render true (the navbar links are 450).
const hanken = Hanken_Grotesk({
  subsets: ['latin'],
  variable: '--font-hanken',
  display: 'swap',
});

// Display face. Newsreader is variable with an optical-size axis, so display
// sizes get the tighter display cut automatically (font-optical-sizing: auto).
const newsreader = Newsreader({
  subsets: ['latin'],
  variable: '--font-newsreader',
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

// Share image, favicon and apple icon come from the file conventions beside
// this layout (opengraph-image.jpg, icon.png, favicon.ico, apple-icon.png);
// recipes override the share image with their own dish photo.
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: SITE_NAME,
  description: SITE_DESCRIPTION,
  openGraph: {
    type: 'website',
    siteName: SITE_NAME,
    locale: 'en_GB',
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  },
  twitter: { card: 'summary_large_image' },
};

export default function RootLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${hanken.variable} ${newsreader.variable} ${cutiveMono.variable} ${courierPrime.variable}`} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `try{if(localStorage.getItem('nieves-theme')==='sepia')document.documentElement.dataset.theme='sepia'}catch(e){}`,
          }}
        />
      </head>
      {/* relative + isolate: the frosted ground (SiteGround, z -1) paints
          above the body's own page colour and below everything else, and by
          day stretches down the whole page. */}
      <body className="relative isolate min-h-[100dvh] bg-parchment overflow-x-hidden overscroll-none">
        <SiteGround />
        <Providers>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:bg-terracotta focus:text-white focus:px-4 focus:py-2 focus:rounded-full focus:text-sm focus:font-medium focus:shadow-lg"
          >
            Skip to content
          </a>
          <Navbar />
          {/* Top padding clears the fixed Courtyard nav band on routes whose
              content starts at the top of <main>. --nav-h (globals.css) is
              the band's 64px on mobile plus room (4.5rem, which also matches
              the WorldMapMobile chrome offset) and 80px (5rem) from sm up.
              The home hero pulls itself back up by the same amount so it runs
              under the navbar. The atlas page (/atlas) uses position:fixed
              for its WorldMap, so the padding is invisible there. */}
          <main id="main" className="pt-[var(--nav-h)]">
            {children}
          </main>
          <Footer />
          {modal}
        </Providers>
      </body>
    </html>
  );
}
