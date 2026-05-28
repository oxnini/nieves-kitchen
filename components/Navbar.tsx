'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Map, BookOpen, Heart, Info, Menu, X } from 'lucide-react';

import { useFavorites } from '@/hooks/useFavorites';
import ThemeToggle from './ThemeToggle';
import PassportAffordance from './passport/PassportAffordance';
import NavMenuDropdown from './NavMenuDropdown';

const LINKS = [
  { href: '/',          label: 'Explore',     icon: Map      },
  { href: '/recipes',   label: 'All Recipes', icon: BookOpen },
  { href: '/favorites', label: 'Favorites',   icon: Heart    },
  { href: '/about',     label: 'About',       icon: Info     },
] as const;

export default function Navbar() {
  const pathname = usePathname();
  const [favorites] = useFavorites();
  const favCount = favorites.size;
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  return (
    <>
      <nav
        aria-label="Primary"
        className="fixed left-3 right-3 z-50 flex items-center gap-1 bg-parchment/95 backdrop-blur-md border border-brown-light/25 rounded-full shadow-[0_8px_24px_-8px_rgba(60,40,20,0.18)] px-3 py-1 sm:py-1.5"
        style={{ top: 'calc(0.75rem + env(safe-area-inset-top))' }}
      >
        {/* Brand */}
        <Link
          href="/"
          aria-label="Nieves' Kitchen, home"
          className="shrink-0 px-1 sm:px-2 hover:opacity-80 transition-opacity"
        >
          <span className="font-heading font-semibold text-lg sm:text-xl text-brown-dark leading-none tracking-tight">
            Nieves<span className="text-terracotta">&#39;</span> Kitchen
          </span>
        </Link>

        <div className="flex-1" />

        {/* Desktop: inline nav routes */}
        <div className="hidden sm:flex items-center gap-1">
          {LINKS.map(({ href, label, icon: Icon }) => {
            const active = href === '/' ? pathname === '/' : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                title={label}
                aria-current={active ? 'page' : undefined}
                className={`relative flex items-center gap-1.5 h-9 px-3 rounded-full text-sm font-medium transition-colors ${
                  active
                    ? 'text-brown-dark bg-brown-light/15'
                    : 'text-brown-medium hover:text-brown-dark hover:bg-brown-light/10'
                }`}
              >
                <Icon size={16} strokeWidth={1.7} aria-hidden="true" />
                <span>{label}</span>
                {href === '/favorites' && favCount > 0 && (
                  <span
                    aria-label={`${favCount} favorite${favCount !== 1 ? 's' : ''}`}
                    className="text-sm font-bold text-terracotta nums-tabular"
                  >
                    {favCount > 99 ? '99+' : favCount}
                  </span>
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

        {/* Always-visible utility cluster */}
        <div className="flex items-center gap-0.5 sm:gap-1 ml-0.5 sm:ml-2">
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
