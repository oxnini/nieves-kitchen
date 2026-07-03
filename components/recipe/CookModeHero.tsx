'use client';

import { X } from 'lucide-react';

import { useHideOnScroll } from '@/hooks/useHideOnScroll';
import { useModalScrollRef } from './ModalScrollContext';

interface Props {
  title: string;
  /** Null for origin-less recipes — the mono country label is simply omitted. */
  country: string | null;
  onExit: () => void;
  inModal?: boolean;
}

/**
 * 56px sticky ribbon shown in cook mode, replacing the editorial hero. Sits at
 * the top of the recipe scroll surface (page or modal scroll container).
 * Title is reduced to a single line; the country sits beside it in mono.
 *
 * Once the cook is reading, the ribbon slides up out of view on scroll-down and
 * returns on scroll-up (same affordance as the navbar pill) so the recipe gets
 * the full surface and no content peeks through above the pinned ribbon.
 */
export default function CookModeHero({ title, country, onExit, inModal = false }: Props) {
  // Inside the modal, content scrolls in the modal's overflow container rather
  // than the window, so watch that ref when present.
  const modalScrollRef = useModalScrollRef();
  const hidden = useHideOnScroll(64, inModal ? modalScrollRef : null);

  return (
    <div
      className={`sticky ${inModal ? 'top-0' : 'top-16'} z-30 -mx-4 sm:-mx-6 lg:-mx-8 mb-6 h-14 px-4 sm:px-6 lg:px-8 flex items-center justify-between bg-parchment/95 backdrop-blur-sm border-b border-brown-light/20 transition-transform duration-300 ${
        hidden ? '-translate-y-[calc(100%+5rem)]' : 'translate-y-0'
      }`}
    >
      <div className="flex items-baseline gap-3 min-w-0">
        {/* Inline line-height: the global `h1` rule (line-height: 1.15) is
            unlayered, so it beats a `leading-*` utility. `truncate` clips with
            overflow:hidden, and 1.15 is too tight to contain Literata's
            descenders, so they get cut off (g, p). A looser line box fixes it. */}
        <h1
          className="font-heading text-lg sm:text-xl font-semibold text-brown-dark truncate"
          style={{ lineHeight: 1.5 }}
        >
          {title}
        </h1>
        {country && (
          <span className="font-stamp text-[10px] tracking-[0.28em] text-brown-medium shrink-0">
            {country}
          </span>
        )}
      </div>
      <button
        type="button"
        onClick={onExit}
        aria-label="Exit cook mode"
        className="p-1.5 rounded-full text-brown-medium bg-parchment-dark/30 hover:bg-parchment-dark hover:text-brown-dark transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta"
      >
        <X size={18} />
      </button>
    </div>
  );
}
