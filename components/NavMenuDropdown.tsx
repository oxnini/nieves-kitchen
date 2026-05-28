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
  /** The trigger button — used to ignore its own clicks for outside-click detection and to return focus on close. */
  triggerRef: React.RefObject<HTMLElement | null>;
}

export default function NavMenuDropdown({ open, onClose, triggerRef }: Props) {
  const pathname = usePathname();
  const [favorites] = useFavorites();
  const favCount = favorites.size;

  const firstRowRef = useRef<HTMLAnchorElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);

  // Focus first row on open; return focus to trigger on close
  useEffect(() => {
    if (open) {
      const id = requestAnimationFrame(() => firstRowRef.current?.focus());
      return () => cancelAnimationFrame(id);
    } else {
      triggerRef.current?.focus();
    }
  }, [open, triggerRef]);

  // Escape closes; basic focus trap (Tab cycles within card)
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== 'Tab' || !cardRef.current) return;
      const focusables = cardRef.current.querySelectorAll<HTMLElement>(
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

  // Outside pointerdown closes (ignoring the trigger so its toggle handler isn't double-fired)
  useEffect(() => {
    if (!open) return;
    function onPointerDown(e: PointerEvent) {
      const target = e.target as Node | null;
      if (!target) return;
      if (cardRef.current?.contains(target)) return;
      if (triggerRef.current?.contains(target)) return;
      onClose();
    }
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [open, onClose, triggerRef]);

  return (
    <div
      ref={cardRef}
      role="menu"
      aria-label="Site navigation"
      aria-hidden={!open}
      // Pill height ≈ 44px + 0.75rem top margin + safe-area-inset-top + 6px gap.
      // Anchored to the right edge of the pill (right-3 matches the nav).
      style={{
        top: 'calc(0.75rem + env(safe-area-inset-top) + 44px + 6px)',
        transformOrigin: 'top right',
      }}
      className={`fixed right-3 z-[55] w-56 rounded-2xl bg-parchment/95 backdrop-blur-md border border-brown-light/30 shadow-[0_12px_28px_-10px_rgba(60,40,20,0.22)] p-1 transition-[opacity,transform] duration-150 ease-out motion-reduce:transition-none ${
        open
          ? 'opacity-100 scale-100 pointer-events-auto'
          : 'opacity-0 scale-95 pointer-events-none'
      }`}
    >
      <ul>
        {LINKS.map(({ href, label, icon: Icon }, i) => {
          const isActive = href === '/' ? pathname === '/' : pathname.startsWith(href);
          return (
            <li key={href}>
              <Link
                ref={i === 0 ? firstRowRef : undefined}
                href={href}
                onClick={onClose}
                role="menuitem"
                aria-current={isActive ? 'page' : undefined}
                tabIndex={open ? 0 : -1}
                className={`relative flex items-center gap-3 min-h-[44px] px-3 rounded-xl transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta ${
                  isActive
                    ? 'bg-terracotta/10 text-brown-dark'
                    : 'text-brown-medium hover:bg-brown-light/15 hover:text-brown-dark'
                }`}
              >
                {isActive && (
                  <span
                    aria-hidden="true"
                    className="absolute left-1 top-2.5 bottom-2.5 w-[2px] rounded-full bg-terracotta"
                  />
                )}
                <Icon size={18} strokeWidth={1.7} className="shrink-0" aria-hidden="true" />
                <span className="flex-1 text-sm font-medium">{label}</span>
                {href === '/favorites' && favCount > 0 && (
                  <span
                    aria-label={`${favCount} favorite${favCount !== 1 ? 's' : ''}`}
                    className="text-sm font-bold text-terracotta nums-tabular"
                  >
                    {favCount > 99 ? '99+' : favCount}
                  </span>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
