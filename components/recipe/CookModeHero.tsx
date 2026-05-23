'use client';

import { X } from 'lucide-react';

interface Props {
  title: string;
  country: string;
  onExit: () => void;
  inModal?: boolean;
}

/**
 * 56px sticky ribbon shown in cook mode, replacing the editorial hero. Sits at
 * the top of the recipe scroll surface (page or modal scroll container).
 * Title is reduced to a single line; the country sits beside it in mono.
 */
export default function CookModeHero({ title, country, onExit, inModal = false }: Props) {
  return (
    <div
      className={`sticky ${inModal ? 'top-0' : 'top-16'} z-30 -mx-4 sm:-mx-6 lg:-mx-8 mb-6 h-14 px-4 sm:px-6 lg:px-8 flex items-center justify-between bg-parchment/95 backdrop-blur-sm border-b border-brown-light/20`}
    >
      <div className="flex items-baseline gap-3 min-w-0">
        <h1 className="font-heading text-base sm:text-lg font-semibold text-brown-dark truncate">
          {title}
        </h1>
        <span className="font-stamp text-[10px] tracking-[0.28em] text-brown-medium shrink-0">
          {country}
        </span>
      </div>
      <button
        type="button"
        onClick={onExit}
        aria-label="Exit cook mode"
        className="p-1.5 rounded-full text-brown-medium hover:text-brown-dark hover:bg-parchment-dark transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta"
      >
        <X size={18} />
      </button>
    </div>
  );
}
