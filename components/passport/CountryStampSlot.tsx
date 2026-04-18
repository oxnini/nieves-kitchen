'use client';

import type { Stamp as StampRow } from '@/lib/passport';

interface Props {
  country: string;
  stamps: StampRow[];
  onClick: () => void;
}

function angleForCountry(name: string): number {
  let h = 0;
  for (let i = 0; i < name.length; i++) {
    h = (h * 31 + name.charCodeAt(i)) | 0;
  }
  return ((Math.abs(h) % 121) - 60) / 10;
}

function formatMonth(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    month: 'short',
    year: 'numeric',
  });
}

export default function CountryStampSlot({ country, stamps, onClick }: Props) {
  const cooked = stamps.length > 0;
  const angle = angleForCountry(country);
  const firstDate = stamps[0]?.cooked_at;

  const baseClasses =
    'relative aspect-square w-full flex items-center justify-center ' +
    'rounded-full transition-transform focus:outline-none ' +
    'focus-visible:ring-2 focus-visible:ring-terracotta';

  if (!cooked) {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-label={`${country} — not cooked yet. Browse recipes from ${country}`}
        className={
          baseClasses +
          ' border-2 border-dashed border-brown-light/60 text-brown-light ' +
          'hover:border-brown-medium hover:text-brown-medium cursor-pointer'
        }
      >
        <span className="text-[10px] sm:text-xs font-body uppercase tracking-wide text-center px-1 leading-tight">
          {country}
        </span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`${country} — cooked ${stamps.length} time${stamps.length === 1 ? '' : 's'}. Open cooked recipes.`}
      className={
        baseClasses +
        ' text-paprika/90 [filter:url(#stamp-ink)] ' +
        'hover:scale-[1.03] mix-blend-multiply cursor-pointer'
      }
      style={{ transform: `rotate(${angle}deg)` }}
    >
      <span className="absolute inset-0 rounded-full border-[2.5px] border-current" />
      <span className="absolute inset-[6%] rounded-full border border-current/70" />

      <span className="flex flex-col items-center justify-center px-1.5">
        <span className="font-heading text-[10px] sm:text-xs font-bold uppercase tracking-[0.15em] leading-none">
          {country}
        </span>
        {firstDate && (
          <span className="mt-1 font-body text-[9px] uppercase tracking-wider opacity-80">
            {formatMonth(firstDate)}
          </span>
        )}
        {stamps.length > 1 && (
          <span className="mt-0.5 font-body text-[8px] opacity-70">
            ×{stamps.length}
          </span>
        )}
      </span>
    </button>
  );
}
