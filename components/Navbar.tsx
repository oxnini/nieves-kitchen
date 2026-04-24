'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UtensilsCrossed, Map, BookOpen, Info, Heart, Stamp } from 'lucide-react';
import { useFavorites } from '@/hooks/useFavorites';
import { useCookedStamps } from '@/hooks/useCookedStamps';
import ThemeToggle from './ThemeToggle';

const links = [
  { href: '/',          label: 'Explore',     icon: Map       },
  { href: '/recipes',   label: 'All Recipes', icon: BookOpen  },
  { href: '/favorites', label: 'Favorites',   icon: Heart     },
  { href: '/passport',  label: 'Passport',    icon: Stamp     },
  { href: '/about',     label: 'About',       icon: Info      },
] as const;

export default function Navbar() {
  const pathname = usePathname();
  const [favorites] = useFavorites();
  const favCount = favorites.size;
  const { summary } = useCookedStamps();
  const stampCount = summary.totalStamps;

  return (
    <nav className="sticky top-0 z-50 bg-[#1A7A8A] backdrop-blur-md border-b border-teal/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[72px]">
          <Link href="/" className="flex items-center gap-2 sm:gap-3 hover:opacity-80 transition-opacity shrink-0">
            <UtensilsCrossed size={28} className="text-terracotta" />
            <div className="text-left">
              <h1 className="text-lg sm:text-2xl font-semibold text-parchment leading-tight font-heading">
                Nieves&#39; Kitchen
              </h1>
              <p className="text-xs text-parchment/70 leading-snug tracking-wide hidden sm:block">
                Globally inspired halal recipes for the health-conscious foodie
              </p>
            </div>
          </Link>

          <div className="flex items-center gap-0.5 sm:gap-1">
            {links.map(({ href, label, icon: Icon }) => {

              const active = href === '/' ? pathname === '/' : pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  aria-label={label}
                  title={label}
                  className={`flex items-center justify-center gap-1.5 min-w-[44px] min-h-[44px] px-2 sm:px-4 py-2 text-base font-medium transition-all ${
                    active
                      ? 'text-parchment font-bold underline underline-offset-4 decoration-2 decoration-parchment'
                      : 'text-parchment/50 hover:text-parchment/80'
                  }`}
                >
                  <Icon size={18} />
                  <span className="hidden sm:inline" aria-hidden="true">{label}</span>
                  {href === '/favorites' && favCount > 0 && (
                    <span
                      aria-label={`${favCount} favorite${favCount !== 1 ? 's' : ''}`}
                      className="text-xs font-bold px-1.5 py-0.5 rounded-full leading-none nums-tabular bg-parchment/15 text-parchment/70"
                    >
                      {favCount > 99 ? '99+' : favCount}
                    </span>
                  )}
                  {href === '/passport' && stampCount > 0 && (
                    <span
                      aria-label={`${stampCount} stamp${stampCount !== 1 ? 's' : ''}`}
                      className="text-xs font-bold px-1.5 py-0.5 rounded-full leading-none nums-tabular bg-parchment/15 text-parchment/70"
                    >
                      {stampCount > 99 ? '99+' : stampCount}
                    </span>
                  )}
                </Link>
              );
            })}
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
}
