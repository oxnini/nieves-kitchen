'use client';

import { useMemo } from 'react';
import { useRecipes } from '@/hooks/useRecipes';
import { useCookedStamps } from '@/hooks/useCookedStamps';
import { useUndoCook } from '@/hooks/useLogCook';
import type { Recipe } from '@/lib/types';
import JournalScrollView from './JournalScrollView';

/**
 * Top-level composer for `/journal` (the real route wraps this; see task 5
 * brief — the route file itself is a later task). Self-fetches via
 * `useCookedStamps` + `useRecipes` and hands the derived data straight to
 * `JournalScrollView`, the presentational body shared with the
 * `/dev/journal` fixture preview.
 *
 * `recipesByCountry` is built exactly as `PassportBooklet.tsx` does it, for
 * `StampedRecipesModal` (rendered inside `JournalScrollView`).
 *
 * Loading vs. stuck is decided by `useCookedStamps`, not here: it owns the
 * session handshake timeout, so a blocked Turnstile resolves to a `failure`
 * instead of a skeleton that never ends.
 */
export default function JournalScroll() {
  const { data: recipes = [] } = useRecipes();
  const undoCook = useUndoCook();
  const {
    summary,
    cancellationsByCountry,
    countryToRegion,
    entries,
    recap,
    recommendation,
    stats,
    isLoading,
    failure,
    retry,
    isRetrying,
  } = useCookedStamps();

  const recipesByCountry = useMemo(() => {
    const m = new Map<string, Recipe[]>();
    for (const r of recipes) {
      if (r.country === null) continue;
      const a = m.get(r.country) ?? [];
      a.push(r);
      m.set(r.country, a);
    }
    return m;
  }, [recipes]);

  return (
    <JournalScrollView
      stats={stats}
      entries={entries}
      recap={recap}
      recommendation={recommendation}
      summary={summary}
      cancellationsByCountry={cancellationsByCountry}
      regionOfCountry={countryToRegion}
      recipesByCountry={recipesByCountry}
      isLoading={isLoading}
      failure={failure}
      onRetry={retry}
      isRetrying={isRetrying}
      onRemoveStamp={id => undoCook.mutateAsync(id)}
    />
  );
}
