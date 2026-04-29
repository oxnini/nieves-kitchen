'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Map, BookOpen, Heart, Info } from 'lucide-react';

import { useFavorites } from '@/hooks/useFavorites';
import ThemeToggle from './ThemeToggle';
import PassportAffordance from './passport/PassportAffordance';

const links = [
  { href: '/',          label: 'Explore',     icon: Map      },
  { href: '/recipes',   label: 'All Recipes', icon: BookOpen },
  { href: '/favorites', label: 'Favorites',   icon: Heart    },
  { href: '/about',     label: 'About',       icon: Info     },
] as const;

export default function Navbar() {
  const pathname = usePathname();
  const [favorites] = useFavorites();
  const favCount = favorites.size;

  return (
    <nav className="sticky top-0 z-50 bg-parchment border-b border-brown-dark/15">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link
            href="/"
            aria-label="Nieves' Kitchen — home"
            className="flex items-baseline shrink-0 hover:opacity-80 transition-opacity"
          >
            <span className="font-heading font-semibold text-3xl sm:text-4xl text-brown-dark leading-none tracking-tight">
              Nieves<span className="text-terracotta">&#39;</span> Kitchen
            </span>
          </Link>

          <div className="flex items-center gap-0.5 sm:gap-1">
            {links.map(({ href, label, icon: Icon }) => {
              const active = href === '/' ? pathname === '/' : pathname.startsWith(href);
              const showLabel = true;
              return (
                <Link
                  key={href}
                  href={href}
                  {...(showLabel ? {} : { 'aria-label': label })}
                  title={label}
                  className={`relative flex items-center justify-center gap-1.5 min-w-[44px] h-16 px-2 sm:px-4 text-base font-medium transition-colors ${
                    active
                      ? 'text-brown-dark'
                      : 'text-brown-medium hover:text-brown-dark'
                  }`}
                >
                  <Icon size={18} strokeWidth={1.6} />
                  <span className="hidden sm:inline">{label}</span>
                  {href === '/favorites' && favCount > 0 && (
                    <span
                      aria-label={`${favCount} favorite${favCount !== 1 ? 's' : ''}`}
                      className="text-base font-bold text-terracotta nums-tabular"
                    >
                      {favCount > 99 ? '99+' : favCount}
                    </span>
                  )}
                  {active && (
                    <span
                      aria-hidden="true"
                      className="absolute -bottom-px left-3 right-3 sm:left-4 sm:right-4 h-[3px] bg-terracotta"
                    />
                  )}
                </Link>
              );
            })}
            <div className="ml-1 sm:ml-2">
              <PassportAffordance />
            </div>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
}
