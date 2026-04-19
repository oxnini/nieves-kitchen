import type { Recipe } from './types';
import type { PassportSummary } from './passport';

export type RecommendationReason = 'new-region' | 'new-country' | 'revisit';

export interface Recommendation {
  recipe: Recipe;
  reason: RecommendationReason;
}

/**
 * Pick up to `limit` recipes to suggest on the back cover.
 *
 * Selection tiers (in order):
 *   1. "new-region"  — recipes from regions the user has not touched; one per region.
 *   2. "new-country" — recipes from countries the user has not cooked, in regions they've already touched; one per country.
 *   3. "revisit"     — recipes from already-cooked countries, countries with the fewest stamps first.
 *
 * Deterministic: sorted by region → country → recipe title so reloads don't reshuffle.
 */
export function recommendNextRecipes(
  recipes: Recipe[],
  summary: PassportSummary,
  limit = 3,
): Recommendation[] {
  const cooked = new Set<string>(
    [...summary.stampsPerCountry.entries()]
      .filter(([, stamps]) => stamps.length > 0)
      .map(([country]) => country),
  );
  const touchedRegions = summary.regionsTouched;

  const sortRecipes = (a: Recipe, b: Recipe) => {
    if (a.region !== b.region) return a.region.localeCompare(b.region);
    if (a.country !== b.country) return a.country.localeCompare(b.country);
    return a.name.localeCompare(b.name);
  };

  const sorted = [...recipes].sort(sortRecipes);

  const picked: Recommendation[] = [];
  const pickedCountries = new Set<string>();
  const pickedRegions = new Set<string>();

  // Pool 1: new regions — one recipe per untouched region.
  for (const r of sorted) {
    if (picked.length >= limit) break;
    if (touchedRegions.has(r.region)) continue;
    if (pickedRegions.has(r.region)) continue;
    picked.push({ recipe: r, reason: 'new-region' });
    pickedRegions.add(r.region);
    pickedCountries.add(r.country);
  }

  // Pool 2: new countries in already-touched regions — one per country.
  if (picked.length < limit) {
    for (const r of sorted) {
      if (picked.length >= limit) break;
      if (cooked.has(r.country)) continue;
      if (pickedCountries.has(r.country)) continue;
      if (!touchedRegions.has(r.region)) continue; // would belong to Pool 1 but we already ran it
      picked.push({ recipe: r, reason: 'new-country' });
      pickedCountries.add(r.country);
    }
  }

  // Pool 3: revisit — cooked countries, fewest stamps first, then by region/country/name.
  if (picked.length < limit) {
    const stampsFor = (country: string) =>
      summary.stampsPerCountry.get(country)?.length ?? 0;

    const revisitPool = sorted
      .filter(r => cooked.has(r.country) && !pickedCountries.has(r.country))
      .sort((a, b) => {
        const da = stampsFor(a.country);
        const db = stampsFor(b.country);
        if (da !== db) return da - db;
        return sortRecipes(a, b);
      });

    for (const r of revisitPool) {
      if (picked.length >= limit) break;
      if (pickedCountries.has(r.country)) continue;
      picked.push({ recipe: r, reason: 'revisit' });
      pickedCountries.add(r.country);
    }
  }

  return picked;
}
