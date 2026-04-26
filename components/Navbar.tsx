'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UtensilsCrossed, Map, Info, Stamp } from 'lucide-react';

function FavoritesIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 11.5C20 16.5681 14.0282 19.9702 12.4037 20.8018C12.1468 20.9334 11.8532 20.9334 11.5963 20.8018C9.97178 19.9702 4 16.5681 4 11.5C4 7 7.87627 4 12 4C16.2667 4 20 7 20 11.5Z" stroke="currentColor" strokeWidth="1.4" />
      <path d="M8.97014 11.8107L11.7687 14.7565C11.8614 14.8541 11.9078 14.9029 11.9641 14.9142C11.9878 14.919 12.0122 14.919 12.0359 14.9142C12.0922 14.9029 12.1386 14.8541 12.2313 14.7565L15.0299 11.8107C15.6002 11.2103 15.6894 10.2991 15.2463 9.5995C14.5085 8.43441 12.7899 8.4922 12.132 9.70422L12.0624 9.83247C12.0355 9.88195 11.9645 9.88195 11.9376 9.83247L11.868 9.70422C11.2101 8.4922 9.49154 8.43441 8.75365 9.5995C8.31058 10.2991 8.3998 11.2103 8.97014 11.8107Z" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

function RecipesBookIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 346.229 346.229" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M48.927,8v289.376c0,4.418-3.582,8-8,8c-4.418,0-8-3.582-8-8V8c0-4.418,3.582-8,8-8C45.345,0,48.927,3.582,48.927,8z M313.302,13.248v278.881c0,4.418-3.582,8-8,8H157.681v38.1c0,2.71-1.372,5.236-3.646,6.711c-2.273,1.475-5.139,1.699-7.615,0.594 l-19.782-8.829l-19.799,8.83c-1.041,0.464-2.152,0.694-3.258,0.694c-1.523,0-3.039-0.435-4.355-1.289 c-2.273-1.476-3.645-4.001-3.645-6.711v-38.1H72.9c-4.418,0-8-3.582-8-8V13.248c0-4.418,3.582-8,8-8h232.402 C309.72,5.248,313.302,8.829,313.302,13.248z M141.681,300.128h-30.1v25.773l11.801-5.263c2.074-0.925,4.443-0.926,6.519,0.001 l11.78,5.258V300.128z M297.302,21.248H80.9v262.881h68.782h147.621V21.248z M118.631,138.656c0-17.121,13.929-31.049,31.05-31.049 c2.759,0,5.481,0.363,8.106,1.071c5.423-9.374,15.479-15.388,26.85-15.388c11.161,0,21.324,6.118,26.799,15.402 c2.64-0.717,5.379-1.085,8.156-1.085c17.121,0,31.05,13.929,31.05,31.049c0,17.121-13.929,31.05-31.05,31.05 c-0.649,0-1.295-0.02-1.937-0.059v34.44c0,4.418-3.582,8-8,8h-50.034c-4.418,0-8-3.582-8-8v-34.44 c-0.643,0.04-1.29,0.059-1.94,0.059C132.56,169.706,118.631,155.777,118.631,138.656z M134.631,138.656 c0,8.298,6.751,15.05,15.05,15.05c2.275,0,4.456-0.492,6.483-1.463c2.479-1.188,5.394-1.02,7.72,0.445 c2.326,1.465,3.737,4.021,3.737,6.77v36.63h34.034v-36.63c0-2.749,1.412-5.305,3.738-6.77c2.326-1.464,5.242-1.632,7.72-0.444 c2.025,0.971,4.205,1.463,6.479,1.463c8.299,0,15.05-6.751,15.05-15.05s-6.751-15.049-15.05-15.049 c-2.899,0-5.712,0.825-8.135,2.385c-2.197,1.416-4.946,1.669-7.366,0.677c-2.418-0.991-4.2-3.101-4.772-5.651 c-1.524-6.795-7.699-11.728-14.682-11.728c-6.98,0-13.156,4.933-14.684,11.73c-0.573,2.549-2.355,4.658-4.773,5.648 c-2.418,0.991-5.167,0.738-7.364-0.677c-2.422-1.56-5.235-2.385-8.135-2.385C141.382,123.606,134.631,130.357,134.631,138.656z" />
    </svg>
  );
}

import { useFavorites } from '@/hooks/useFavorites';
import { useCookedStamps } from '@/hooks/useCookedStamps';
import ThemeToggle from './ThemeToggle';

const links = [
  { href: '/',          label: 'Explore',     icon: Map       },
  { href: '/recipes',   label: 'All Recipes', icon: RecipesBookIcon },
  { href: '/favorites', label: 'Favorites',   icon: FavoritesIcon },
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
                  <Icon size={(Icon === FavoritesIcon || Icon === RecipesBookIcon) ? 24 : 18} />
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
