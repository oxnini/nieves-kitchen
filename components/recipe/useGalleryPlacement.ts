'use client';

import { useLayoutEffect, useRef, useState } from 'react';
import type { RecipeImage } from '@/lib/types';

/* Height model for one MarginGallery entry — mirrors that component's
   styles (eyebrow line, space-y-5 gaps, max-h-80 figure cap, stamp caption). */
const EYEBROW_HEIGHT = 16;
const ITEM_GAP = 20;
/** MarginGallery's own mt-6 — outside its offsetHeight, so tracked separately. */
const GALLERY_TOP_MARGIN = 24;
/** Parchment kept clear below the last figure so the column never looks stuffed. */
const BREATHING_ROOM = 24;
/* Caption model: 11px stamp type with wide tracking wraps at roughly 36
   characters per column line; each line ~17px plus the mt-2 above the block. */
const CAPTION_CHARS_PER_LINE = 36;
const CAPTION_LINE_HEIGHT = 17;
const CAPTION_MARGIN_TOP = 8;

/* Figure size ladder. Full size first; if the full set doesn't fit, retry
   smaller so ALL extras can leave the band — a complete margin gallery at a
   smaller size beats a split one. Class must be a literal for Tailwind. */
const SIZE_STEPS = [
  { cap: 320, className: 'max-h-80' },
  { cap: 288, className: 'max-h-72' },
  { cap: 256, className: 'max-h-64' },
  { cap: 224, className: 'max-h-56' },
] as const;
/** When shrinking to fit the whole set, the column may run slightly past the
    instructions column bottom — the user prefers a full margin over a band. */
const FULL_FIT_OVERSHOOT = 120;

function captionHeight(caption: string | undefined): number {
  if (!caption) return 0;
  const lines = Math.max(1, Math.ceil(caption.length / CAPTION_CHARS_PER_LINE));
  return CAPTION_MARGIN_TOP + lines * CAPTION_LINE_HEIGHT;
}

function figureHeight(img: RecipeImage, colWidth: number, cap: number): number {
  const h = Math.min(cap, (img.height / img.width) * colWidth);
  return h + captionHeight(img.caption);
}

function countThatFits(
  images: RecipeImage[],
  colWidth: number,
  cap: number,
  budget: number,
): number {
  let used = GALLERY_TOP_MARGIN + EYEBROW_HEIGHT;
  let count = 0;
  for (const img of images) {
    used += ITEM_GAP + figureHeight(img, colWidth, cap);
    if (used > budget) break;
    count += 1;
  }
  return count;
}

/**
 * Decides how many of a recipe's extra photos fit in the white space under
 * the Ingredients column (beside the taller Instructions column) instead of
 * the band below the spread. Measures both columns and greedily promotes
 * photos, in order, while they fit.
 *
 * The base column height subtracts the margin gallery's own rendered height,
 * so the decision is stable — promoting photos doesn't change its input.
 * Server render and stacked (sub-md) layouts keep the static rule:
 * a single extra lives in the margin, two or more go to the band.
 */
export function useGalleryPlacement(images: RecipeImage[], enabled: boolean) {
  const ingredientsRef = useRef<HTMLElement | null>(null);
  const instructionsRef = useRef<HTMLElement | null>(null);
  const marginGalleryRef = useRef<HTMLDivElement | null>(null);
  const [placement, setPlacement] = useState<{
    marginCount: number;
    maxHeightClass: string;
  }>({
    marginCount: images.length === 1 ? 1 : 0,
    maxHeightClass: SIZE_STEPS[0].className,
  });

  useLayoutEffect(() => {
    if (!enabled || images.length === 0) return;
    const ing = ingredientsRef.current;
    const ins = instructionsRef.current;
    if (!ing || !ins) return;

    const apply = (marginCount: number, maxHeightClass: string) => {
      setPlacement(prev =>
        prev.marginCount === marginCount && prev.maxHeightClass === maxHeightClass
          ? prev
          : { marginCount, maxHeightClass },
      );
    };

    const compute = () => {
      if (!window.matchMedia('(min-width: 768px)').matches) {
        apply(images.length === 1 ? 1 : 0, SIZE_STEPS[0].className);
        return;
      }
      const gallery = marginGalleryRef.current;
      const galleryHeight = gallery ? gallery.offsetHeight + GALLERY_TOP_MARGIN : 0;
      const base = ing.offsetHeight - galleryHeight;
      const available = ins.offsetHeight - base - BREATHING_ROOM;
      const colWidth = ing.offsetWidth;

      // Full size first. If the whole set fits, done.
      const fullSizeCount = countThatFits(images, colWidth, SIZE_STEPS[0].cap, available);
      if (fullSizeCount < images.length) {
        // Walk the size ladder looking for a step where EVERY extra fits
        // (allowing a slight overshoot); a complete margin gallery at a
        // smaller size beats leaving stragglers in the band.
        for (const step of SIZE_STEPS) {
          const fits = countThatFits(
            images, colWidth, step.cap, available + FULL_FIT_OVERSHOOT,
          );
          if (fits === images.length) {
            apply(images.length, step.className);
            return;
          }
        }
      }
      // A single extra keeps its home in the margin even when space is
      // tight, matching the pre-measurement behavior.
      apply(images.length === 1 ? 1 : fullSizeCount, SIZE_STEPS[0].className);
    };

    compute();
    const ro = new ResizeObserver(compute);
    ro.observe(ing);
    ro.observe(ins);
    return () => ro.disconnect();
  }, [images, enabled]);

  return { ingredientsRef, instructionsRef, marginGalleryRef, ...placement };
}
