'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const FOOTER_LINKS = [
  { href: '/recipes', label: 'All Recipes' },
  { href: '/atlas',   label: 'Atlas'       },
  { href: '/pantry',  label: 'Pantry'      },
  { href: '/promise', label: 'Halal'       },
  { href: '/about',   label: 'About'       },
] as const;

/**
 * Global Courtyard footer: a cobalt-deep band with the wordmark, the one-line
 * tagline, quick links, and the "Halal always" brass eyebrow. Built from the
 * FIXED cobalt-deep/brass/cream tokens so it is theme-stable (identical in
 * parchment and sepia), matching the bold navbar band.
 *
 * Hidden on /atlas: that route paints a position:fixed full-screen map, so a
 * normal-flow footer would sit behind it with nothing to anchor to. Every other
 * route is normal-flow and gets the footer at the bottom of the page.
 */
export default function Footer() {
  const pathname = usePathname();
  if (pathname === '/atlas' || pathname.startsWith('/atlas/')) return null;

  return (
    <footer className="bg-cobalt-deep text-cream px-6 sm:px-10 lg:px-14 py-10 sm:py-12">
      <div className="mx-auto max-w-6xl flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Link
            href="/"
            aria-label="Nieves's Kitchen, home"
            className="inline-block rounded-sm font-heading font-medium text-2xl text-cream leading-none tracking-[0.005em] hover:opacity-90 transition-opacity focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brass"
          >
            Nieves&#39;s <span className="italic text-brass">Kitchen</span>
          </Link>
          <p className="mt-3 max-w-xs font-body text-sm leading-relaxed text-cream/70">
            Recipes from around the world, cooked at home.
          </p>
        </div>

        <div className="flex flex-col gap-5 sm:items-end">
          <nav aria-label="Footer" className="flex flex-wrap gap-x-7 gap-y-2 font-body text-[15px] font-semibold">
            {FOOTER_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="text-cream/80 hover:text-cream transition-colors rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brass"
              >
                {label}
              </Link>
            ))}
          </nav>
          <span className="font-body text-xs font-bold uppercase tracking-[0.2em] text-brass">
            Halal always
          </span>
        </div>
      </div>
    </footer>
  );
}
