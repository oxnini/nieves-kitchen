import { useMemo } from 'react';
import { useCookedStamps } from '@/hooks/useCookedStamps';

/**
 * The set of recipe slugs the cook has stamped at least once, derived from
 * `useCookedStamps`'s per-country stamp map. Shared by every surface that
 * shows the Cooked badge on a `RecipeCard` (CookSomethingNew, /recipes),
 * previously duplicated inline in both places.
 */
export function useCookedRecipeSlugs(): Set<string> {
  const { summary } = useCookedStamps();
  return useMemo(() => {
    const slugs = new Set<string>();
    for (const stamps of summary.stampsPerCountry.values()) {
      for (const stamp of stamps) slugs.add(stamp.recipe_slug);
    }
    return slugs;
  }, [summary.stampsPerCountry]);
}
