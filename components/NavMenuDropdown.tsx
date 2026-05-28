'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Map, BookOpen, Heart, Info } from 'lucide-react';

import { useFavorites } from '@/hooks/useFavorites';

const LINKS = [
  { href: '/',          label: 'Explore',     icon: Map      },
  { href: '/recipes',   label: 'All Recipes', icon: BookOpen },
  { href: '/favorites', label: 'Favorites',   icon: Heart    },
  { href: '/about',     label: 'About',       icon: Info     },
] as const;

interface Props {
  open: boolean;
  onClose: () => void;
  /** Element to return focus to when the sheet closes (the ☰ trigger). */
  returnFocusRef?: React.RefObject<HTMLElement | null>;
}

export default function NavMenuSheet({ open, onClose, returnFocusRef }: Props) {
  const pathname = usePathname();
  const [favorites] = useFavorites();
  const favCount = favorites.size;

  const firstRowRef = useRef<HTMLAnchorElement | null>(null);
  const sheetRef = useRef<HTMLDivElement | null>(null);

  // Lock body scroll while open and restore on close
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  // Focus the first nav row on open; return focus to trigger on close
  useEffect(() => {
    if (open) {
      const id = requestAnimationFrame(() => firstRowRef.current?.focus());
      return () => cancelAnimationFrame(id);
    } else {
      returnFocusRef?.current?.focus();
    }
  }, [open, returnFocusRef]);

  // Escape closes; basic focus trap (Tab cycles within sheet)
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== 'Tab' || !sheetRef.current) return;
      const focusables = sheetRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled])'
      );
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  return (
    <>
      {/* Backdrop */}
      <div
        aria-hidden="true"
        onClick={onClose}
        className={`fixed inset-0 z-[60] bg-brown-dark/30 transition-opacity duration-200 ease-out ${
          open ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* Sheet */}
      <div
        ref={sheetRef}
        role="dialog"
        aria-modal="true"
        aria-label="Site navigation"
        className={`fixed bottom-0 inset-x-0 z-[70] bg-parchment border-t border-brown-light/30 rounded-t-2xl shadow-[0_-12px_32px_-12px_rgba(60,40,20,0.25)] transition-transform duration-[250ms] ease-out motion-reduce:transition-none ${
          open ? 'translate-y-0' : 'translate-y-full'
        }`}
        style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}
      >
        {/* Drag handle (decorative in v1) */}
        <div className="flex justify-center pt-2 pb-1" aria-hidden="true">
          <span className="block w-9 h-1 rounded-full bg-brown-light/60" />
        </div>

        <nav aria-label="Primary">
          <ul className="px-2 py-2">
            {LINKS.map(({ href, label, icon: Icon }, i) => {
              const isActive = href === '/' ? pathname === '/' : pathname.startsWith(href);
              return (
                <li key={href}>
                  <Link
                    ref={i === 0 ? firstRowRef : undefined}
                    href={href}
                    onClick={onClose}
                    aria-current={isActive ? 'page' : undefined}
                    className={`relative flex items-center gap-3 min-h-[56px] px-4 rounded-xl transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta ${
                      isActive
                        ? 'bg-terracotta/10 text-brown-dark'
                        : 'text-brown-medium hover:bg-brown-light/15 hover:text-brown-dark'
                    }`}
                  >
                    {isActive && (
                      <span
                        aria-hidden="true"
                        className="absolute left-0 top-3 bottom-3 w-[3px] rounded-full bg-terracotta"
                      />
                    )}
                    <Icon size={20} strokeWidth={1.6} className="shrink-0" aria-hidden="true" />
                    <span className="flex-1 text-base font-medium">{label}</span>
                    {href === '/favorites' && favCount > 0 && (
                      <span
                        aria-label={`${favCount} favorite${favCount !== 1 ? 's' : ''}`}
                        className="text-base font-bold text-terracotta nums-tabular"
                      >
                        {favCount > 99 ? '99+' : favCount}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </>
  );
}
