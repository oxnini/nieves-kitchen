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
  { href: '/',          label: 'Explore'     },
  { href: '/recipes',   label: 'All Recipes' },
  { href: '/favorites', label: 'Favorites'   },
  { href: '/about',     label: 'About'       },
] as const;

export default function Navbar() {
  const pathname = usePathname();
  const [favorites] = useFavorites();
  const favCount = favorites.size;
  const [menuOpen, setMenuOpen] = useState(false);
  const [focusWithin, setFocusWithin] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  // Hide the floating pill while scrolling down; reveal on scroll-up. Keep it
  // visible whenever the mobile menu is open or *keyboard* focus is inside the
  // nav, so keyboard users can always tab back to it. We gate the focus reveal
  // on :focus-visible — a mouse click on a nav link also fires focus, and since
  // the nav is mounted once in the root layout that focus would otherwise stay
  // pinned across client navigation and stop the bar ever hiding.
  const scrolledAway = useHideOnScroll();
  const hidden = scrolledAway && !menuOpen && !focusWithin;

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
        className={`fixed left-3 right-3 z-50 flex items-center gap-1 bg-parchment border border-brown-light/25 rounded-full shadow-[0_2px_8px_rgba(60,40,20,0.08)] px-3 py-1 sm:py-1.5 transition-transform duration-300 ease-out motion-reduce:transition-none ${
          hidden ? '-translate-y-[calc(100%+1.5rem)]' : 'translate-y-0'
        }`}
        style={{ top: 'calc(0.75rem + env(safe-area-inset-top))' }}
      >
        {/* Brand */}
        <Link
          href="/"
          aria-label="Nieves' Kitchen, home"
          className="shrink-0 px-1 sm:px-2 rounded-sm hover:opacity-80 transition-opacity focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta"
        >
          <span className="font-heading font-semibold text-lg sm:text-xl lg:text-2xl text-brown-dark leading-none tracking-tight">
            Nieves<span className="text-terracotta">&#39;</span> Kitchen
          </span>
        </Link>

        <div className="flex-1" />

        {/* Desktop: inline nav routes */}
        <div className="hidden sm:flex items-center gap-1">
          {LINKS.map(({ href, label }) => {
            const active = href === '/' ? pathname === '/' : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                title={label}
                aria-current={active ? 'page' : undefined}
                className={`relative flex items-center gap-1.5 h-9 px-3 rounded-full font-heading text-[13px] uppercase tracking-[0.14em] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta ${
                  active
                    ? 'text-brown-dark'
                    : 'text-brown-medium hover:text-brown-dark'
                }`}
              >
                <span>{label}</span>
                {href === '/favorites' && favCount > 0 && (
                  <span
                    aria-label={`${favCount} favorite${favCount !== 1 ? 's' : ''}`}
                    className="text-sm font-semibold text-terracotta nums-tabular normal-case tracking-normal"
                  >
                    {favCount > 99 ? '99+' : favCount}
                  </span>
                )}
                {active && (
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute left-3 right-3 bottom-[5px] h-px bg-terracotta"
                  />
                )}
              </Link>
            );
          })}
        </div>

        {/* Mobile: menu toggle (☰ ↔ ✕) */}
        <button
          ref={menuButtonRef}
          type="button"
          onClick={() => setMenuOpen(v => !v)}
          aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-haspopup="menu"
          aria-expanded={menuOpen}
          className="sm:hidden flex items-center justify-center w-9 h-9 rounded-full text-brown-medium hover:text-brown-dark hover:bg-brown-light/15 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta"
        >
          {menuOpen ? (
            <X size={18} strokeWidth={1.8} aria-hidden="true" />
          ) : (
            <Menu size={18} strokeWidth={1.8} aria-hidden="true" />
          )}
        </button>

        {/* Section break between primary nav and utility cluster (desktop only) */}
        <span
          aria-hidden="true"
          className="hidden sm:block w-px h-5 bg-brown-light/30 mx-1"
        />

        {/* Always-visible utility cluster */}
        <div className="flex items-center gap-0.5 sm:gap-1 ml-0.5 sm:ml-0">
          <PassportAffordance compact />
          <ThemeToggle />
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
