'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { regionSlug } from '@/lib/passport-pack';
import type { SpreadDescriptor } from './usePassportSpreads';

const FLIP_MS = 150;
const COVER_FLIP_MS = 150;
const SWIPE_THRESHOLD = 50;

export interface BookletNav {
  index: number;
  isFlipping: boolean;
  direction: 1 | -1;
  canPrev: boolean;
  canNext: boolean;
  flipNext: () => void;
  flipPrev: () => void;
  jumpTo: (index: number) => void;
  bindSwipe: React.HTMLAttributes<HTMLDivElement>;
}

/** Return the URL slug for a spread, or null for non-region spreads. */
function slugForSpread(s: SpreadDescriptor): string | null {
  if (s.kind !== 'region') return null;
  // Only primary spreads get their own slug in the URL; continuations share the base slug.
  return s.continuationIndex === 0 ? regionSlug(s.region) : null;
}

export function useBookletNav(spreads: SpreadDescriptor[]): BookletNav {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const [index, setIndex] = useState(0);
  const [isFlipping, setFlipping] = useState(false);
  const [direction, setDirection] = useState<1 | -1>(1);
  const lockRef = useRef(false);

  useEffect(() => {
    const slug = params.get('spread');
    if (!slug) return;
    const targetIdx = spreads.findIndex(
      s => s.kind === 'region' && s.continuationIndex === 0 && regionSlug(s.region) === slug,
    );
    if (targetIdx >= 0) setIndex(targetIdx);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spreads.length]);

  const syncUrl = useCallback(
    (nextIdx: number) => {
      const s = spreads[nextIdx];
      const slug = s ? slugForSpread(s) : null;
      const next = new URLSearchParams(params.toString());
      if (slug) {
        next.set('spread', slug);
      } else {
        next.delete('spread');
      }
      const qs = next.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [spreads, params, router, pathname],
  );

  const flipTo = useCallback(
    (nextIdx: number) => {
      if (lockRef.current) return;
      if (nextIdx < 0 || nextIdx >= spreads.length) return;
      if (nextIdx === index) return;

      lockRef.current = true;
      setFlipping(true);
      setDirection(nextIdx > index ? 1 : -1);

      const duration =
        spreads[index]?.kind === 'cover' ||
        spreads[nextIdx]?.kind === 'cover' ||
        spreads[index]?.kind === 'back-cover' ||
        spreads[nextIdx]?.kind === 'back-cover'
          ? COVER_FLIP_MS
          : FLIP_MS;

      setIndex(nextIdx);
      syncUrl(nextIdx);

      window.setTimeout(() => {
        lockRef.current = false;
        setFlipping(false);
      }, duration);
    },
    [index, spreads, syncUrl],
  );

  const flipNext = useCallback(() => flipTo(index + 1), [flipTo, index]);
  const flipPrev = useCallback(() => flipTo(index - 1), [flipTo, index]);
  const jumpTo = useCallback((i: number) => flipTo(i), [flipTo]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target?.closest('input, textarea, [contenteditable="true"], [role="dialog"]')) return;
      if (e.key === 'ArrowRight') { e.preventDefault(); flipNext(); }
      if (e.key === 'ArrowLeft')  { e.preventDefault(); flipPrev(); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [flipNext, flipPrev]);

  const touchStart = useRef<number | null>(null);
  const bindSwipe: React.HTMLAttributes<HTMLDivElement> = {
    onTouchStart: e => { touchStart.current = e.touches[0].clientX; },
    onTouchEnd: e => {
      if (touchStart.current == null) return;
      const dx = e.changedTouches[0].clientX - touchStart.current;
      touchStart.current = null;
      if (dx <= -SWIPE_THRESHOLD) flipNext();
      else if (dx >= SWIPE_THRESHOLD) flipPrev();
    },
  };

  return {
    index,
    isFlipping,
    direction,
    canPrev: index > 0,
    canNext: index < spreads.length - 1,
    flipNext,
    flipPrev,
    jumpTo,
    bindSwipe,
  };
}
