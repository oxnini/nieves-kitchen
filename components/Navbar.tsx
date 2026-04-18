'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UtensilsCrossed, Map, BookOpen, Info, Heart, Stamp } from 'lucide-react';
import { useFavorites } from '@/hooks/useFavorites';
import { useCookedStamps } from '@/hooks/useCookedStamps';

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
    <nav className="sticky top-0 z-50 bg-parchment/90 backdrop-blur-md border-b border-brown-light/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[72px]">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <UtensilsCrossed size={28} className="text-terracotta" />
            <div className="text-left">
              <h1 className="text-2xl font-bold text-brown-dark leading-tight font-heading">
                Nieves&#39; Kitchen
              </h1>
              <p className="text-xs text-brown-medium leading-tight tracking-wide hidden sm:block">
                Globally inspired halal recipes for the health-conscious foodie
              </p>
            </div>
          </Link>

          <div className="flex items-center gap-1">
            {links.map(({ href, label, icon: Icon }) => {
              const active = href === '/' ? pathname === '/' : pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-base font-medium transition-all ${
                    active
                      ? 'bg-terracotta text-white shadow-md'
                      : 'text-brown-medium hover:bg-parchment-dark hover:text-brown-dark'
                  }`}
                >
                  <Icon size={18} />
                  <span className="hidden sm:inline">{label}</span>
                  {href === '/favorites' && favCount > 0 && (
                    <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full leading-none ${
                      active ? 'bg-white/20 text-white' : 'bg-terracotta text-white'
                    }`}>
                      {favCount}
                    </span>
                  )}
                  {href === '/passport' && stampCount > 0 && (
                    <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full leading-none ${
                      active ? 'bg-white/20 text-white' : 'bg-turmeric text-brown-dark'
                    }`}>
                      {stampCount}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
