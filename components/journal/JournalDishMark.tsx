import Image from 'next/image';
import { getCustomStampMeta } from '@/lib/passport-stamps';
import { getDesign, getSubtitle, renderStampDesign } from '@/components/passport/stamps';
import { getStampTraits, stampColorValue } from '@/lib/stamp-traits';
import { ForkKnife } from '@/components/passport/stamps/shared';

export interface JournalDishMarkProps {
  /** world-atlas country name, or null for an origin-less (e.g. prophetic) dish. */
  country: string | null;
  /** Accessible name lives on the title link elsewhere; this mark is decorative. */
  title: string;
  /** Tile side length in px. Default 56. */
  size?: number;
}

/** Shared filter + blend treatment so every branch inks onto the parchment beneath. */
const INK_BLEND_CLASS =
  '[filter:url(#stamp-ink)] motion-reduce:[filter:none] mix-blend-multiply w-full h-full flex items-center justify-center';

/**
 * A single dish's mark in the journal margin: the same visual grammar as a
 * passport stamp, scaled down and locked to `passport-light` parchment so it
 * reads correctly in both themes.
 *
 * Three branches, mirroring `CountryStampSlot`:
 *  - custom-WebP country -> the shipped stamp art
 *  - procedural country -> the deterministic SVG design
 *  - null country -> a quiet, plainer ink seal (weeknight cooking still
 *    earns a mark, but reads as non-country)
 */
export default function JournalDishMark({ country, title, size = 56 }: JournalDishMarkProps) {
  const customMeta = country ? getCustomStampMeta(country) : null;

  let mark: React.ReactNode;

  if (country && customMeta) {
    mark = (
      <Image
        src={`/stamps/${customMeta.file}.webp`}
        alt=""
        width={200}
        height={200}
        sizes={`${size}px`}
        className="w-full h-full object-contain p-1.5"
        unoptimized
      />
    );
  } else if (country) {
    const traits = getStampTraits(country);
    mark = renderStampDesign(getDesign(country), {
      country,
      date: null,
      count: 1,
      color: stampColorValue(traits.color),
      subtitle: getSubtitle(country),
    });
  } else {
    // Quiet non-country seal: a plain ring + crossed fork/knife, deliberately
    // plainer than a country stamp so it doesn't compete for attention.
    mark = (
      <svg viewBox="0 0 100 100" className="w-4/5 h-4/5" aria-hidden>
        <circle
          cx={50}
          cy={50}
          r={42}
          stroke="var(--stamp-ink-charcoal)"
          strokeWidth={1.5}
          fill="none"
          opacity={0.35}
        />
        <ForkKnife cx={50} cy={50} size={20} color="var(--stamp-ink-charcoal)" />
      </svg>
    );
  }

  return (
    <div
      className="passport-light bg-parchment flex items-center justify-center rounded-sm shrink-0 overflow-hidden"
      style={{ width: size, height: size, ['--stamp-size' as string]: `${size}px` }}
      aria-hidden
    >
      <div className={INK_BLEND_CLASS}>{mark}</div>
    </div>
  );
}
