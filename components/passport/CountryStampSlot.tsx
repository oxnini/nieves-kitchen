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
import CancellationMark from './CancellationMark';
import {
  getCenterGlyph,
  getCancellationInkVar,
} from '@/lib/cancellation-traits';

/**
 * One cancellation = one unique recipe cooked from this country (SPEC §3).
 *
 * All fields are derived in `useCookedStamps`:
 *   - `recipeTitle` joined from `recipes.title` via `recipe_slug`.
 *   - `cookDate` is the earliest `cooked_at` for that recipe (first-cook date).
 *   - `rotation` is the ±12° jitter, seeded from `(country, slug)`.
 *   - `center` is the postmark centre in `%` of the visa box, seeded from
 *     `(country, slug)`. Optional — the `/dev/cancellation` scratch route
 *     hand-crafts cancellations without a centre and we fall back to an
 *     evenly-spaced 5-point ring (see `fallbackCenter`).
 *
 * All seeded values are per-recipe and **independent of other recipes**:
 * adding, undoing, or re-cooking a recipe never moves any other postmark.
 */
export interface CancellationInput {
  recipeTitle: string;
  cookDate: Date;
  /** Rotation jitter in degrees (±12° per SPEC §4). */
  rotation: number;
  /** Postmark centre in `%` of the visa's bounding box; visa centre is (50, 50). */
  center?: { x: number; y: number };
}

interface Props {
  country: string;
  stamps: StampRow[];
  onClick: () => void;
  /**
   * Optional cancellations to composite on top of the visa.
   *
   * Each entry produces one circular postmark sized at ~46% of the visa's
   * longest edge (SPEC §3) at its seeded perimeter position (SPEC §4).
   * Compositing is normal-blend at 88% opacity — the cancellation does
   * NOT participate in the visa's multiply (SPEC §7).
   */
  cancellations?: CancellationInput[];
}

function formatMonth(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    month: 'short',
    year: 'numeric',
  }).toUpperCase();
}

/**
 * Fallback postmark centres for `CancellationInput` rows that arrive
 * without a `center` (only the `/dev/cancellation` scratch route — the
 * production hook always seeds a per-recipe centre).
 *
 * Evenly-spaced 5-point ring at R = 40% from visa centre, starting at
 * NE. Mirrors the radial range used by the production seeder so the
 * scratch route's visual is representative of the real composite.
 */
function fallbackCenter(i: number): { x: number; y: number } {
  const angle = ((i * 72 + 45) * Math.PI) / 180;
  return {
    x: 50 + 40 * Math.cos(angle),
    y: 50 - 40 * Math.sin(angle),
  };
}

/** Cancellation size as a fraction of the visa's longest edge (SPEC §3). */
const CANCELLATION_FRACTION = 0.46;

/* ── Main component ──────────────────────────────────────────── */

export default function CountryStampSlot({
  country, stamps, onClick, cancellations,
}: Props) {
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
  const IMAGE_STAMP_SIDE = 1.4; // side length of the equivalent square in --stamp-size units
  let sizeStyle: React.CSSProperties;
  let longestSideUnits: number; // in --stamp-size units — used to size cancellations
  if (useImage) {
    const aspect = customMeta.aspect; // w / h
    const w = IMAGE_STAMP_SIDE * Math.sqrt(aspect);
    const h = IMAGE_STAMP_SIDE / Math.sqrt(aspect);
    sizeStyle = {
      width: `calc(var(--stamp-size) * ${w.toFixed(4)})`,
      height: `calc(var(--stamp-size) * ${h.toFixed(4)})`,
    };
    longestSideUnits = Math.max(w, h);
  } else {
    const w = mult * aw;
    const h = mult * ah;
    sizeStyle = {
      width: `calc(var(--stamp-size) * ${w})`,
      height: `calc(var(--stamp-size) * ${h})`,
    };
    longestSideUnits = Math.max(w, h);
  }

  const cancellationDim = `calc(var(--stamp-size) * ${(longestSideUnits * CANCELLATION_FRACTION).toFixed(4)})`;
  const inkVar = getCancellationInkVar(country);
  const centerGlyph = getCenterGlyph(country);
  const hasCancellations = !!cancellations && cancellations.length > 0;

  // SPEC §7 compositing. The visa needs to multiply onto the parchment
  // beneath; the cancellations need to sit on top *without* multiplying.
  //
  // Why the visa-multiply stays on the button itself (not on an inner
  // wrapper):
  //
  //   `mix-blend-mode` blends an element with its parent stacking
  //   context's backdrop. The button creates a stacking context (it has
  //   both `filter` and `contain: paint`), so any `mix-blend-multiply`
  //   *child* of the button would only blend against other content
  //   *inside* the filter/contain context — which is transparent —
  //   producing the visual bug "visa stopped multiplying and showed its
  //   opaque white edges". Putting multiply on the button itself works
  //   because the button's *composited* output is multiplied against its
  //   own parent (the page parchment).
  //
  // Cancellations therefore can't live inside the button — they would
  // get dragged into the visa's multiply. Instead they sit as a sibling
  // of the button under a non-stacking-context wrapper, with their own
  // filter pass for the paper-bleed/grain texture. Group-hover keeps the
  // two layers scaled together on hover.
  const btnClass =
    'absolute inset-0 flex items-center justify-center ' +
    'transition-transform focus:outline-none focus-visible:ring-2 ' +
    'focus-visible:ring-terracotta cursor-pointer ' +
    '[filter:url(#stamp-ink)] motion-reduce:[filter:none] ' +
    'group-hover:scale-[1.03] mix-blend-multiply [contain:layout_style_paint]';

  return (
    <div className="relative group" style={sizeStyle}>
      <button
        type="button"
        onClick={onClick}
        aria-label={`${country} — cooked ${stamps.length} time${stamps.length === 1 ? '' : 's'}. Open cooked recipes.`}
        className={btnClass}
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

      {hasCancellations && (
        <div className="absolute inset-0 pointer-events-none [filter:url(#stamp-ink)] motion-reduce:[filter:none] transition-transform group-hover:scale-[1.03]">
          {cancellations!.map((c, i) => {
            // Postmark *centre* in % of visa box. Position the wrapper's
            // top-left at (cx%, cy%) of the visa's bounding box and shift
            // back by half the cancellation's own dimensions via translate.
            // This stays correct for non-square visas — subtracting 23%
            // would only work when the visa box is square, because % top
            // resolves against the parent's height while the cancellation
            // itself is a square sized off the longest edge.
            const cx = c.center?.x ?? fallbackCenter(i).x;
            const cy = c.center?.y ?? fallbackCenter(i).y;
            return (
              <div
                key={i}
                className="absolute opacity-[0.88]"
                style={{
                  width: cancellationDim,
                  height: cancellationDim,
                  left: `${cx.toFixed(2)}%`,
                  top: `${cy.toFixed(2)}%`,
                  transform: 'translate(-50%, -50%)',
                }}
              >
                <CancellationMark
                  recipeTitle={c.recipeTitle}
                  cookDate={c.cookDate}
                  inkVar={inkVar}
                  centerGlyph={centerGlyph}
                  rotation={c.rotation}
                  className="w-full h-full"
                />
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
