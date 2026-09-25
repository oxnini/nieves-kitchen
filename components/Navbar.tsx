'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Heart, Menu, Search, X } from 'lucide-react';

import { useFavorites } from '@/hooks/useFavorites';
import { useHideOnScroll } from '@/hooks/useHideOnScroll';
import { useJournalPrefetch } from '@/hooks/useJournalPrefetch';
import ThemeToggle from './ThemeToggle';
import NavMenuDropdown from './NavMenuDropdown';

/**
 * The lg+ inline nav only, in the configurator's order (spec §5). The mobile
 * menu (`NavMenuDropdown`) keeps its own list: the same set plus Home and
 * Favorites.
 *
 * Home is absent on purpose: the wordmark to its left already links to `/`.
 * Favorites is absent because it is a personal shelf, not an editorial
 * destination; it lives in the icon cluster as a heart with its count. The
 * halal promise lives in the footer. Journal is a plain text link now (the
 * passport-stamp icon left the nav) and keeps the journal asset prefetch.
 */
const LINKS = [
  { href: '/recipes', label: 'Recipes' },
  { href: '/atlas',   label: 'Atlas'   },
  { href: '/pantry',  label: 'Pantry'  },
  { href: '/journal', label: 'Journal' },
  { href: '/about',   label: 'About'   },
] as const;

/** The shared 36px hit area for the three icons at the far end. At 19px
 *  glyphs, 36px boxes set flush put ~17px of air between glyphs, the
 *  configurator's 18px icon gap. */
const ICON_BTN =
  'inline-flex items-center justify-center min-w-9 h-9 rounded-full text-brown-dark hover:bg-brown-light/15 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal';

export default function Navbar() {
  const pathname = usePathname();
  const [favorites] = useFavorites();
  const favCount = favorites.size;
  const [menuOpen, setMenuOpen] = useState(false);
  const [focusWithin, setFocusWithin] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const journalPrefetch = useJournalPrefetch();

  // Hide the band while scrolling down; reveal on scroll-up. Keep it visible
  // whenever the mobile menu is open or *keyboard* focus is inside the nav, so
  // keyboard users can always tab back to it. We gate the focus reveal on
  // :focus-visible — a mouse click on a nav link also fires focus, and since the
  // nav is mounted once in the root layout that focus would otherwise stay
  // pinned across client navigation and stop the bar ever hiding.
  const scrolledAway = useHideOnScroll();
  const hidden = scrolledAway && !menuOpen && !focusWithin;

  // A light paper band: theme-aware `surface` + a hairline `line` shadow (not
  // a border, so it takes no layout space and the band stays 64px/88px), so
  // it reads as the same page as the content beneath it rather than a fixed
  // dark chrome strip. It follows the theme on purpose now — parchment by
  // day, the dark night-teal surface at night — using the same adaptive
  // tokens as the rest of the app instead of the old fixed cobalt/brass/cream
  // literals.

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
        className={`fixed top-0 inset-x-0 z-50 bg-surface/95 backdrop-blur shadow-[0_1px_0_var(--color-line)] transition-transform duration-300 ease-out motion-reduce:transition-none ${
          hidden ? '-translate-y-full' : 'translate-y-0'
        }`}
        style={{ paddingTop: 'env(safe-area-inset-top)' }}
      >
        {/* The band stays full-bleed; its content sits in the configurator's
            centred container (max 1160px, 40px sides, 20px on phones). The
            inner row carries the band height; the wrapper's top padding
            extends the band into the safe-area (notch) without squeezing it. */}
        <div className="mx-auto max-w-[1160px] px-5 sm:px-10 flex items-center gap-3.5 lg:gap-9 min-h-16 sm:min-h-[88px]">
          {/* Brand wordmark */}
          <Link
            href="/"
            aria-label="Nieves's Kitchen, home"
            className="min-w-0 rounded-sm hover:opacity-90 transition-opacity focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal"
          >
            <span className="block truncate font-heading font-normal text-xl sm:text-3xl text-brown-dark leading-none tracking-[0.005em]">
              Nieves&#39;s <span className="italic text-brown-medium">Kitchen</span>
            </span>
          </Link>

          {/* Inline links (lg+), directly after the wordmark. Each link runs
              the full band height so its active underline sits on the band's
              bottom edge, just above the hairline. */}
          <ul className="hidden lg:flex self-stretch items-stretch gap-7">
            {LINKS.map(({ href, label }) => {
              // No '/' entry, so a plain prefix test is enough (and correctly
              // marks Recipes active on /recipes/[slug]).
              const active = pathname.startsWith(href);
              return (
                <li key={href} className="flex">
                  <Link
                    href={href}
                    aria-current={active ? 'page' : undefined}
                    {...(href === '/journal' ? journalPrefetch : {})}
                    className={`relative flex items-center font-body text-[15px] font-normal transition-colors focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-teal ${
                      active ? 'text-brown-dark' : 'text-brown-medium hover:text-brown-dark'
                    }`}
                  >
                    {label}
                    {active && (
                      <span
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-x-0 bottom-0 h-[2px] bg-terracotta"
                      />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Icons at the far end: search, favourites (with count), theme.
              All three at every width; they fit beside the wordmark and the
              menu toggle at 390px. */}
          <div className="ml-auto flex items-center">
            <Link
              href="/recipes?focus=search"
              aria-label="Search recipes"
              title="Search recipes"
              className={ICON_BTN}
            >
              <Search size={19} strokeWidth={1.6} aria-hidden="true" />
            </Link>
            <Link
              href="/favorites"
              aria-label={
                favCount > 0
                  ? `Favorites, ${favCount} saved recipe${favCount !== 1 ? 's' : ''}`
                  : 'Favorites'
              }
              aria-current={pathname.startsWith('/favorites') ? 'page' : undefined}
              title="Favorites"
              className={`${ICON_BTN} px-1`}
            >
              <Heart
                size={19}
                strokeWidth={1.6}
                aria-hidden="true"
                className={pathname.startsWith('/favorites') ? 'fill-terracotta text-terracotta' : ''}
              />
              {favCount > 0 && (
                <span
                  aria-hidden="true"
                  className="font-stamp font-bold text-xs text-terracotta nums-tabular tracking-[0.04em] ml-0.5"
                >
                  {favCount > 99 ? '99+' : favCount}
                </span>
              )}
            </Link>
            <ThemeToggle onPod />
          </div>

          {/* Mobile / tablet: menu toggle (☰ ↔ ✕), below lg only. It sits
              last, as in the configurator's left layout at phone width
              (`.menu { order: 3 }`), which also keeps NavMenuDropdown's
              top-right anchoring true. */}
          <button
            ref={menuButtonRef}
            type="button"
            onClick={() => setMenuOpen(v => !v)}
            aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            className={`lg:hidden -ml-3 ${ICON_BTN}`}
          >
            {menuOpen ? (
              <X size={19} strokeWidth={1.6} aria-hidden="true" />
            ) : (
              <Menu size={19} strokeWidth={1.6} aria-hidden="true" />
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
