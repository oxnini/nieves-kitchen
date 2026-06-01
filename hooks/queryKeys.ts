/**
 * Shared TanStack Query keys. Centralised so that producers (`useRecipes`,
 * `useRecipeIndex`) and consumers reading from the cache directly
 * (`useLogCook` peeks at the cached recipe list to compute region tier
 * unlocks) cannot drift apart.
 *
 * Historical bug: `useRecipes` wrote `['recipes', 'mock'|'live']` while
 * `useLogCook` read `['recipes']`, so `regionsTouched` was always empty
 * and region-gated explorer titles never unlocked.
 */

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';

export type RecipeSource = 'mock' | 'live';

export function currentRecipeSource(): RecipeSource {
  return USE_MOCK ? 'mock' : 'live';
}

/** Full-row recipe list — used by anything that needs ingredients/steps. */
export function recipesQueryKey(source: RecipeSource = currentRecipeSource()) {
  return ['recipes', source] as const;
}

/** Slim recipe index — id/slug/title/country/region/coordinates/etc. */
export function recipeIndexQueryKey(source: RecipeSource = currentRecipeSource()) {
  return ['recipes', 'index', source] as const;
}
