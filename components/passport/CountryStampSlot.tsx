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
  // ±3 degrees — tighter than the previous ±6 so the stamp doesn't clip
  // outside its grid cell at 25% scale.
  return ((Math.abs(h) % 61) - 30) / 10;
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

  const base =
    'relative aspect-square flex items-center justify-center rounded-full ' +
    'transition-transform focus:outline-none focus-visible:ring-2 ' +
    'focus-visible:ring-terracotta cursor-pointer';

  // Size lives in a single source of truth: the shell's --stamp-size var.
  const sizeStyle: React.CSSProperties = {
    width: 'var(--stamp-size)',
    height: 'var(--stamp-size)',
    fontSize: 'calc(var(--stamp-size) * 0.11)',
  };

  if (!cooked) {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-label={`${country} — not cooked yet. Browse recipes from ${country}`}
        className={
          base +
          ' border-2 border-dashed border-brown-light/60 text-brown-light ' +
          'hover:border-brown-medium hover:text-brown-medium'
        }
        style={sizeStyle}
      >
        <span className="font-body uppercase tracking-wide text-center px-[0.4em] leading-tight">
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
        base +
        ' text-paprika/90 [filter:url(#stamp-ink)] hover:scale-[1.03] mix-blend-multiply'
      }
      style={{ ...sizeStyle, transform: `rotate(${angle}deg)` }}
    >
      <span className="absolute inset-0 rounded-full border-[0.16em] border-current" />
      <span className="absolute inset-[6%] rounded-full border-[0.06em] border-current/70" />

      <span className="flex flex-col items-center justify-center px-[0.4em]">
        <span className="font-heading font-bold uppercase tracking-[0.15em] leading-none">
          {country}
        </span>
        {firstDate && (
          <span
            className="mt-[0.4em] font-body uppercase tracking-wider opacity-80"
            style={{ fontSize: '0.75em' }}
          >
            {formatMonth(firstDate)}
          </span>
        )}
        {stamps.length > 1 && (
          <span
            className="mt-[0.2em] font-body opacity-70"
            style={{ fontSize: '0.65em' }}
          >
            ×{stamps.length}
          </span>
        )}
      </span>
    </button>
  );
}
