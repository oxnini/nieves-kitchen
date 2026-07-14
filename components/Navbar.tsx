'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';

import { useFavorites } from '@/hooks/useFavorites';
import { useHideOnScroll } from '@/hooks/useHideOnScroll';
import ThemeToggle from './ThemeToggle';
import PassportAffordance from './passport/PassportAffordance';
import NavMenuDropdown from './NavMenuDropdown';

const LINKS = [
  { href: '/',          label: 'Home'        },
  { href: '/recipes',   label: 'All Recipes' },
  { href: '/pantry',    label: 'Pantry'      },
  { href: '/atlas',     label: 'Atlas'       },
  { href: '/favorites', label: 'Favorites'   },
  { href: '/promise',   label: 'Halal'       },
  { href: '/about',     label: 'About'       },
] as const;

export default function Navbar() {
  const pathname = usePathname();
  const [favorites] = useFavorites();
  const favCount = favorites.size;
  const [menuOpen, setMenuOpen] = useState(false);
  const [focusWithin, setFocusWithin] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  // Hide the band while scrolling down; reveal on scroll-up. Keep it visible
  // whenever the mobile menu is open or *keyboard* focus is inside the nav, so
  // keyboard users can always tab back to it. We gate the focus reveal on
  // :focus-visible — a mouse click on a nav link also fires focus, and since the
  // nav is mounted once in the root layout that focus would otherwise stay
  // pinned across client navigation and stop the bar ever hiding.
  const scrolledAway = useHideOnScroll();
  const hidden = scrolledAway && !menuOpen && !focusWithin;

  // The bold Courtyard cobalt band. Built from the FIXED cobalt/brass/cream
  // tokens (never the theme-swapping parchment/brown-* aliases) so it reads the
  // same in parchment and sepia. The lone terracotta CTA is pinned to the
  // literal #C4623C for the same reason — the `terracotta` token lifts toward
  // ember in sepia, which would drift the band between themes.

  return (
    <>
      <nav
        aria-label="Primary"
        onFocusCapture={(e) => {
          if (e.target instanceof Element && e.target.matches(':focus-visible')) {
            setFocusWithin(true);
          }
        }}
        onBlurCapture={() => setFocusWithin(false)}
        className={`fixed top-0 inset-x-0 z-50 bg-cobalt transition-transform duration-300 ease-out motion-reduce:transition-none ${
          hidden ? '-translate-y-full' : 'translate-y-0'
        }`}
        style={{ paddingTop: 'env(safe-area-inset-top)' }}
      >
        {/* Inner row carries the band height; the wrapper's top padding extends
            the cobalt into the safe-area (notch) without squeezing the row. */}
        <div className="flex items-center gap-1 sm:gap-3 min-h-16 sm:min-h-[88px] px-4 sm:px-8 lg:px-14">
          {/* Brand wordmark */}
          <Link
            href="/"
            aria-label="Nieves's Kitchen, home"
            className="min-w-0 rounded-sm hover:opacity-90 transition-opacity focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brass"
          >
            <span className="block truncate font-heading font-medium text-xl sm:text-3xl text-cream leading-none tracking-[0.005em]">
              Nieves&#39;s <span className="italic text-brass">Kitchen</span>
            </span>
          </Link>

          <div className="flex-1" />

          {/* Desktop inline nav (lg+): the wireframe style, full route list kept */}
          <div className="hidden lg:flex items-center gap-6 xl:gap-8">
            {LINKS.map(({ href, label }) => {
              const active = href === '/' ? pathname === '/' : pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  title={label}
                  aria-current={active ? 'page' : undefined}
                  className={`relative flex items-center gap-1.5 pb-[3px] font-body text-base font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brass ${
                    active ? 'text-cream' : 'text-cream/80 hover:text-cream'
                  }`}
                >
                  <span>{label}</span>
                  {href === '/favorites' && favCount > 0 && (
                    <span
                      aria-label={`${favCount} favorite${favCount !== 1 ? 's' : ''}`}
                      className="text-sm font-bold text-brass nums-tabular"
                    >
                      {favCount > 99 ? '99+' : favCount}
                    </span>
                  )}
                  {active && (
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-x-0 -bottom-px h-[3px] bg-brass"
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Divider between primary nav and the utility cluster (lg+) */}
          <span aria-hidden="true" className="hidden lg:block w-px h-6 bg-cream/25 mx-1" />

          {/* Utility pod: the passport icon (fixed dark ink) and ThemeToggle are
              designed for a light surface, so seat them on a fixed-cream chip to
              stay legible on the cobalt band in both themes. */}
          <div className="flex items-center gap-0.5 rounded-full bg-cream/95 px-1 py-0.5 ring-1 ring-cobalt-deep/15 shadow-sm">
            <PassportAffordance compact />
            <ThemeToggle onPod />
          </div>

          {/* Start cooking — the one loud accent. Literal #C4623C keeps the band
              theme-stable (see the note above). Shown from sm up; below that the
              action lives in the menu. */}
          <Link
            href="/recipes"
            className="hidden sm:inline-flex items-center rounded-md bg-[#C4623C] px-4 lg:px-5 py-2.5 font-body text-sm font-bold text-cream transition-transform duration-200 hover:-translate-y-0.5 motion-reduce:transition-none motion-reduce:hover:translate-y-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cream"
          >
            Start cooking
          </Link>

          {/* Mobile / tablet: menu toggle (☰ ↔ ✕), shown below lg */}
          <button
            ref={menuButtonRef}
            type="button"
            onClick={() => setMenuOpen(v => !v)}
            aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            className="lg:hidden flex items-center justify-center w-9 h-9 rounded-full text-cream/85 hover:text-cream hover:bg-cream/10 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brass"
          >
            {menuOpen ? (
              <X size={19} strokeWidth={1.8} aria-hidden="true" />
            ) : (
              <Menu size={19} strokeWidth={1.8} aria-hidden="true" />
            )}
          </button>
        </div>
      </nav>

      <NavMenuDropdown
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        triggerRef={menuButtonRef}
      />
    </>
  );
}
