'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { Stamp as StampRow } from '@/lib/passport';
import {
  getStampTraits,
  sizeMultiplier,
  stampAngle,
  stampColorValue,
} from '@/lib/stamp-traits';
import {
  getDesign,
  getSubtitle,
  designAspect,
  renderStampDesign,
} from './stamps';

/* ── Custom stamp images ───────────────────────────────────────
   Maps country names (lowercase) to filenames in /public/stamps/.
   Countries not listed here fall back to the generated SVG designs.
   ───────────────────────────────────────────────────────────── */

const CUSTOM_STAMPS: Record<string, string> = {
  spain: 'spain',
  china: 'china',
  japan: 'japan',
  turkey: 'turkey',
  morocco: 'morocco',
  thailand: 'thailand',
  india: 'india',
  greece: 'greece',
  mexico: 'mexico',
  italy: 'italy',
  portugal: 'portugal',
  belgium: 'belgium',
  hungary: 'hungary',
  vietnam: 'vietnam',
  indonesia: 'indonesia',
  egypt: 'egypt',
  slovakia: 'slovakia',
  'united states': 'united-states',
  taiwan: 'taiwan',
  'hong kong': 'hong-kong',
  'south korea': 'south-korea',
  france: 'france',
  lebanon: 'lebanon',
  poland: 'poland',
  iran: 'iran',
  'sri lanka': 'sri-lanka',
  ethiopia: 'ethiopia',
  'south africa': 'south-africa',
  jamaica: 'jamaica',
  peru: 'peru',
  croatia: 'croatia',
};

function getCustomStampSrc(country: string): string | null {
  const key = country.toLowerCase();
  const file = CUSTOM_STAMPS[key];
  return file ? `/stamps/${file}.png` : null;
}

interface Props {
  country: string;
  stamps: StampRow[];
  onClick: () => void;
}

function formatMonth(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    month: 'short',
    year: 'numeric',
  }).toUpperCase();
}

/* ── Main component ──────────────────────────────────────────── */

export default function CountryStampSlot({ country, stamps, onClick }: Props) {
  const [imgFailed, setImgFailed] = useState(false);
  const traits = getStampTraits(country);
  const angle = stampAngle(country);
  const firstDate = stamps[0]?.cooked_at;
  const date = firstDate ? formatMonth(firstDate) : null;
  const mult = sizeMultiplier(traits.sizeBucket);
  const color = stampColorValue(traits.color);
  const design = getDesign(country);
  const [aw, ah] = designAspect(design);
  const subtitle = getSubtitle(country);

  const customSrc = !imgFailed ? getCustomStampSrc(country) : null;
  const useImage = !!customSrc;

  const sizeStyle: React.CSSProperties = useImage
    ? { width: `calc(var(--stamp-size) * ${mult * 1.15})`, height: 'auto' }
    : { width: `calc(var(--stamp-size) * ${mult * aw})`, height: `calc(var(--stamp-size) * ${mult * ah})` };

  const btnClass =
    'relative flex items-center justify-center ' +
    'transition-transform focus:outline-none focus-visible:ring-2 ' +
    'focus-visible:ring-terracotta cursor-pointer ' +
    '[filter:url(#stamp-ink)] motion-reduce:[filter:none] ' +
    'hover:scale-[1.03] mix-blend-multiply [contain:layout_style_paint]';

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`${country} — cooked ${stamps.length} time${stamps.length === 1 ? '' : 's'}. Open cooked recipes.`}
      className={btnClass}
      style={{
        ...sizeStyle,
        transform: `rotate(${angle}deg)`,
      }}
    >
      {useImage ? (
        <Image
          src={customSrc}
          alt={country}
          width={400}
          height={400}
          className="w-full h-auto"
          draggable={false}
          onError={() => setImgFailed(true)}
        />
      ) : (
        renderStampDesign(design, { country, date, count: stamps.length, color, subtitle })
      )}
    </button>
  );
}
