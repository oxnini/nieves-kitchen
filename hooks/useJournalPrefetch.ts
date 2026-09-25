'use client';

import { useCallback, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';

import { useCookedStamps } from '@/hooks/useCookedStamps';
import { getCustomStampSrc } from '@/lib/passport-stamps';
import { prefetchOne } from '@/lib/passport-prefetch';

/**
 * Warms what `/journal` actually renders, for whichever link leads there (the
 * navbar's "Journal" text link today).
 *
 * The only raster art the journal paints is the custom country stamp WebPs —
 * `JournalStamps` → `CountryStampSlot` and `JournalLog` → `JournalEntryRow` → `JournalDishMark`,
 * both `unoptimized`, so the raw `/stamps/<file>.webp` URL is what the browser
 * requests. Only the cook's own cooked countries are drawn, so only those are
 * warmed. Procedural stamps are inline SVG (nothing to fetch), and the journal
 * shows no tier badges. The retired booklet's cover and region wallpapers are
 * deliberately NOT here: nothing live renders them.
 *
 * Two triggers, as before on `PassportAffordance`:
 *  - on idle after mount (requestIdleCallback, 1.5s timeout fallback);
 *  - on pointerenter/focus of the link, which also prefetches the route chunk
 *    so a quick click still gets a head start.
 *
 * Returns the handlers to spread onto the link.
 */
export function useJournalPrefetch() {
  const router = useRouter();
  const { summary } = useCookedStamps();

  const stampUrls = useMemo(
    () =>
      Array.from(summary.stampsPerCountry.keys())
        .map((country) => getCustomStampSrc(country))
        .filter((u): u is string => u !== null),
    [summary.stampsPerCountry],
  );

  useEffect(() => {
    if (stampUrls.length === 0) return;
    const run = () => {
      for (const s of stampUrls) prefetchOne(s);
    };
    const w = window as Window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };
    if (typeof w.requestIdleCallback === 'function') {
      const id = w.requestIdleCallback(run, { timeout: 2000 });
      return () => w.cancelIdleCallback?.(id);
    }
    const t = window.setTimeout(run, 1500);
    return () => window.clearTimeout(t);
  }, [stampUrls]);

  const prefetchNow = useCallback(() => {
    for (const s of stampUrls) prefetchOne(s);
    router.prefetch('/journal');
  }, [stampUrls, router]);

  return { onPointerEnter: prefetchNow, onFocus: prefetchNow };
}
