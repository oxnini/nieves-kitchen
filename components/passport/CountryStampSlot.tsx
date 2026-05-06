'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { Stamp as StampRow } from '@/lib/passport';
import {
  getStampTraits,
  sizeMultiplier,
  stampColorValue,
} from '@/lib/stamp-traits';
import {
  getDesign,
  getSubtitle,
  designAspect,
  renderStampDesign,
} from './stamps';
import { getCustomStampMeta } from '@/lib/passport-stamps';

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
  const firstDate = stamps[0]?.cooked_at;
  const date = firstDate ? formatMonth(firstDate) : null;
  const mult = sizeMultiplier(traits.sizeBucket);
  const color = stampColorValue(traits.color);
  const design = getDesign(country);
  const [aw, ah] = designAspect(design);
  const subtitle = getSubtitle(country);

  const customMeta = !imgFailed ? getCustomStampMeta(country) : null;
  const useImage = !!customMeta;

  // Image stamps are sized for constant visual area: width and height are
  // derived from the source aspect ratio so a portrait stamp (e.g. China)
  // and a landscape one (e.g. Hong Kong) cover the same on-screen area as
  // a square one (e.g. Japan). Tall stamps therefore look just as "big" as
  // wide ones rather than getting squeezed inside a fixed square box.
  const IMAGE_STAMP_SIDE = 1.25; // side length of the equivalent square in --stamp-size units
  let sizeStyle: React.CSSProperties;
  if (useImage) {
    const aspect = customMeta.aspect; // w / h
    const w = IMAGE_STAMP_SIDE * Math.sqrt(aspect);
    const h = IMAGE_STAMP_SIDE / Math.sqrt(aspect);
    sizeStyle = {
      width: `calc(var(--stamp-size) * ${w.toFixed(4)})`,
      height: `calc(var(--stamp-size) * ${h.toFixed(4)})`,
    };
  } else {
    sizeStyle = {
      width: `calc(var(--stamp-size) * ${mult * aw})`,
      height: `calc(var(--stamp-size) * ${mult * ah})`,
    };
  }

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
      style={sizeStyle}
    >
      {useImage ? (
        <Image
          src={`/stamps/${customMeta.file}.webp`}
          alt={country}
          width={400}
          height={400}
          sizes="(max-width: 640px) 100px, 140px"
          className="w-full h-full object-contain"
          draggable={false}
          unoptimized
          onError={() => setImgFailed(true)}
        />
      ) : (
        renderStampDesign(design, { country, date, count: stamps.length, color, subtitle })
      )}
    </button>
  );
}
