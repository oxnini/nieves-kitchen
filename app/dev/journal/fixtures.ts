/**
 * Fixture data for `/dev/journal`. Hand-authored `Stamp[]` (ascending by
 * `cooked_at`, matching what `useCookedStamps` would hand to
 * `buildJournalEntries`) plus the `metaBySlug` map it needs to resolve
 * titles/regions/sunnah status.
 *
 * The sequence below is built to exercise every margin-note branch in
 * `lib/journal.ts#buildJournalEntries` at least once:
 *   - first-ever dish
 *   - first-sunnah (also the origin-less / null-country case)
 *   - first-from-country (x2: a custom-stamp country and a procedural one)
 *   - re-cook, 2nd time ("cooked again")
 *   - re-cook, 3rd time ("your 3rd time at this dish")
 *   - re-cook, 4th time ("your 4th time at this dish")
 *   - Nth-from-region (not a first-country or re-cook)
 *
 * Do NOT wire this route to Supabase / `useCookedStamps` — it is fixture-only.
 */

import type { Stamp } from '@/lib/passport';
import type { JournalRecipeMeta } from '@/lib/journal';
import type { CulinaryRegion, Recipe } from '@/lib/types';
import type { CancellationInput } from '@/components/passport/CountryStampSlot';

// Turkey has a custom-stamp WebP (see CUSTOM_STAMPS in lib/passport-stamps.ts).
// Iraq does not, so it exercises the procedural stamp branch.
// Brazil also has a custom stamp, giving a second first-from-country example.

const s1: Stamp = {
  id: 's1',
  recipe_slug: 'shakshuka',
  recipe_country: 'Turkey',
  recipe_title: 'Shakshuka',
  cooked_at: '2026-01-01T09:00:00.000Z',
};

const s2: Stamp = {
  id: 's2',
  recipe_slug: 'talbina',
  recipe_country: null,
  recipe_title: 'Talbina',
  cooked_at: '2026-01-05T09:00:00.000Z',
};

const s3: Stamp = {
  id: 's3',
  recipe_slug: 'feijoada',
  recipe_country: 'Brazil',
  recipe_title: 'Feijoada',
  cooked_at: '2026-01-10T09:00:00.000Z',
};

const s4: Stamp = {
  id: 's4',
  recipe_slug: 'shakshuka',
  recipe_country: 'Turkey',
  recipe_title: 'Shakshuka',
  cooked_at: '2026-01-15T09:00:00.000Z',
};

const s5: Stamp = {
  id: 's5',
  recipe_slug: 'masgouf',
  recipe_country: 'Iraq',
  recipe_title: 'Masgouf',
  cooked_at: '2026-01-20T09:00:00.000Z',
};

const s6: Stamp = {
  id: 's6',
  recipe_slug: 'baklava',
  recipe_country: 'Turkey',
  recipe_title: 'Baklava',
  cooked_at: '2026-01-25T09:00:00.000Z',
};

const s7: Stamp = {
  id: 's7',
  recipe_slug: 'shakshuka',
  recipe_country: 'Turkey',
  recipe_title: 'Shakshuka',
  cooked_at: '2026-02-01T09:00:00.000Z',
};

const s8: Stamp = {
  id: 's8',
  recipe_slug: 'shakshuka',
  recipe_country: 'Turkey',
  recipe_title: 'Shakshuka',
  cooked_at: '2026-02-05T09:00:00.000Z',
};

/** Ascending by `cooked_at`, mirrors the full fixture set. */
export const MANY: Stamp[] = [s1, s2, s3, s4, s5, s6, s7, s8];

export const EMPTY: Stamp[] = [];
export const ONE: Stamp[] = [s1];
export const THREE: Stamp[] = [s1, s2, s3];

export const metaBySlug: Map<string, JournalRecipeMeta> = new Map([
  ['shakshuka', { title: 'Shakshuka', isSunnah: false, region: 'Middle East' }],
  ['talbina', { title: 'Talbina', isSunnah: true, region: null }],
  ['feijoada', { title: 'Feijoada', isSunnah: false, region: 'South America' }],
  ['masgouf', { title: 'Masgouf', isSunnah: false, region: 'Middle East' }],
  ['baklava', { title: 'Baklava', isSunnah: false, region: 'Middle East' }],
]);

/**
 * Country -> region for the fixture countries only (Turkey, Iraq, Brazil).
 * Mirrors what `useCookedStamps`'s `countryToRegion` would look like for
 * this slice of the catalogue, so `summarizeStamps`/`JournalStamps` can
 * group fixture stamps without touching Supabase.
 */
export const countryToRegion: Map<string, CulinaryRegion> = new Map([
  ['Turkey', 'Middle East'],
  ['Iraq', 'Middle East'],
  ['Brazil', 'South America'],
]);

/**
 * Minimal-but-complete `Recipe` objects for the fixture route. Only
 * id/name/country/region matter to `recommendNextRecipes`; the rest are
 * inert defaults so the shape typechecks without a Supabase row.
 */
function fixtureRecipe(
  id: string,
  name: string,
  country: string | null,
  region: CulinaryRegion | null,
): Recipe {
  return {
    id,
    name,
    country,
    region,
    coordinates: null,
    influences: [],
    isSunnah: false,
    featuredIngredients: [],
    createdAt: '2026-01-01T00:00:00.000Z',
    category: 'main',
    tags: [],
    isFusion: false,
    quote: '',
    image: '',
    time: { active: 0, total: 0 },
    servings: 2,
    difficulty: 'Easy',
    isVegetarian: false,
    isVegan: false,
    isGlutenFree: false,
    isDairyFree: false,
    ingredients: [],
    instructions: [],
    nutrition: { calories: 0, protein: 0, carbs: 0, fat: 0 },
    flavorProfile: { sweet: 0, salty: 0, sour: 0, bitter: 0, umami: 0, spicy: 0 },
  };
}

/** A small catalogue for the where-next card: cooked countries + untouched ones. */
export const FIXTURE_RECIPES: Recipe[] = [
  fixtureRecipe('shakshuka', 'Shakshuka', 'Turkey', 'Middle East'),
  fixtureRecipe('masgouf', 'Masgouf', 'Iraq', 'Middle East'),
  fixtureRecipe('feijoada', 'Feijoada', 'Brazil', 'South America'),
  fixtureRecipe('bibimbap', 'Bibimbap', 'South Korea', 'East Asia'),
  fixtureRecipe('pho', 'Pho', 'Vietnam', 'Southeast Asia'),
  fixtureRecipe('injera', 'Injera & Doro Wat', 'Ethiopia', 'Sub-Saharan Africa'),
];

/**
 * Minimal per-country `CancellationInput[]` for the fixture stamps, deduped
 * by recipe (earliest cook keeps the postmark, matching the real hook's
 * SPEC §3 rule). No seeded `center`/`rotation` — `CountryStampSlot` falls
 * back to its evenly-spaced ring, which is enough to prove cancellations
 * render on `/dev/journal`; the real placement math lives in
 * `useCookedStamps`, untouched by this fixture.
 */
export function buildFixtureCancellations(stamps: Stamp[]): Map<string, CancellationInput[]> {
  const byCountry = new Map<string, Stamp[]>();
  for (const s of stamps) {
    if (s.recipe_country === null) continue;
    const arr = byCountry.get(s.recipe_country) ?? [];
    arr.push(s);
    byCountry.set(s.recipe_country, arr);
  }

  const result = new Map<string, CancellationInput[]>();
  for (const [country, countryStamps] of byCountry) {
    const seenSlug = new Set<string>();
    const cancellations: CancellationInput[] = [];
    for (const s of countryStamps) {
      if (seenSlug.has(s.recipe_slug)) continue;
      seenSlug.add(s.recipe_slug);
      cancellations.push({
        recipeTitle: s.recipe_title ?? s.recipe_slug,
        cookDate: new Date(s.cooked_at),
        rotation: 0,
      });
    }
    result.set(country, cancellations);
  }
  return result;
}
