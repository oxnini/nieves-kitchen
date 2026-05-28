'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Map, BookOpen, Heart, Info } from 'lucide-react';

import Navbar from '@/components/Navbar';
import { useFavorites } from '@/hooks/useFavorites';
import ThemeToggle from '@/components/ThemeToggle';
import PassportAffordance from '@/components/passport/PassportAffordance';

const LEGACY_LINKS = [
  { href: '/',          label: 'Explore',     icon: Map      },
  { href: '/recipes',   label: 'All Recipes', icon: BookOpen },
  { href: '/favorites', label: 'Favorites',   icon: Heart    },
  { href: '/about',     label: 'About',       icon: Info     },
] as const;

/** Frozen copy of the pre-2026-05-26 sticky navbar, for visual A/B only. */
function LegacyNavbar() {
  const [favorites] = useFavorites();
  const favCount = favorites.size;
  return (
    <nav className="sticky top-0 z-50 bg-parchment/70 sm:bg-parchment backdrop-blur-md sm:backdrop-blur-none border-b border-brown-dark/15">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link
            href="/"
            aria-label="Nieves' Kitchen, home"
            className="flex items-baseline shrink-0 hover:opacity-80 transition-opacity"
          >
            <span className="font-heading font-semibold text-3xl sm:text-4xl text-brown-dark leading-none tracking-tight">
              Nieves<span className="text-terracotta">&#39;</span> Kitchen
            </span>
          </Link>
          <div className="flex items-center gap-0.5 sm:gap-1">
            {LEGACY_LINKS.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                title={label}
                className="relative flex items-center justify-center gap-1.5 min-w-[44px] h-16 px-2 sm:px-4 text-base font-medium text-brown-medium hover:text-brown-dark transition-colors"
              >
                <Icon size={18} strokeWidth={1.6} />
                <span className="hidden sm:inline">{label}</span>
                {href === '/favorites' && favCount > 0 && (
                  <span className="text-base font-bold text-terracotta nums-tabular">
                    {favCount > 99 ? '99+' : favCount}
                  </span>
                )}
              </Link>
            ))}
            <div className="ml-1 sm:ml-2"><PassportAffordance /></div>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
}

export default function FloatingNavbarPreviewPage() {
  const [variant, setVariant] = useState<'new' | 'current'>('new');

  return (
    <div className="fixed inset-0 bg-map-base">
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 30% 30%, rgba(196,150,108,0.35), transparent 40%), ' +
            'radial-gradient(circle at 70% 60%, rgba(160,120,90,0.28), transparent 45%), ' +
            'radial-gradient(circle at 50% 85%, rgba(120,90,70,0.22), transparent 50%)',
        }}
      />

      {variant === 'current' ? <LegacyNavbar /> : <Navbar />}

      <button
        type="button"
        onClick={() => setVariant(v => (v === 'new' ? 'current' : 'new'))}
        className="fixed bottom-4 right-4 z-[100] px-4 py-2 rounded-full bg-brown-dark text-parchment text-sm font-medium shadow-lg"
      >
        Showing: {variant === 'new' ? 'NEW' : 'CURRENT'} (tap to swap)
      </button>
    </div>
  );
}
