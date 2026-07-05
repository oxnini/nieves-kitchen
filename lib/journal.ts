import type { Stamp } from './passport';
import type { PassportSummary } from './passport';
import type { CulinaryRegion } from './types';

export interface JournalRecipeMeta {
  title: string;
  isSunnah: boolean;
  region: CulinaryRegion | null;
}

export interface JournalEntry {
  /** passport_stamps.id */
  id: string;
  slug: string;
  title: string;
  country: string | null;
  region: CulinaryRegion | null;
  cookedAt: string;
  /** True when this is the 2nd+ cook of the same recipe. Styles lightly. */
  isReCook: boolean;
  /** Derived per-entry note in the author's voice; '' means render nothing. */
  marginNote: string;
}

function ordinal(n: number): string {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] ?? s[v] ?? s[0]);
}

/**
 * One derived line per entry. Highest-priority applicable rule wins
 * (brief §5.1). Claims are about the cook's own history only.
 */
export function buildJournalEntries(
  ascendingStamps: Stamp[],
  metaBySlug: Map<string, JournalRecipeMeta>,
): JournalEntry[] {
  const seenCountries = new Set<string>();
  const recipeCount = new Map<string, number>();
  const regionCount = new Map<CulinaryRegion, number>();
  let anySunnahYet = false;
  let anyCookYet = false;

  const out: JournalEntry[] = [];

  for (const s of ascendingStamps) {
    const meta = metaBySlug.get(s.recipe_slug);
    const title = meta?.title ?? s.recipe_title ?? s.recipe_slug;
    const region = meta?.region ?? null;
    const isSunnah = meta?.isSunnah ?? false;

    const priorTimes = recipeCount.get(s.recipe_slug) ?? 0;
    const nthTime = priorTimes + 1;
    const isReCook = priorTimes >= 1;

    const isFirstEver = !anyCookYet;
    const isFirstCountry =
      s.recipe_country !== null && !seenCountries.has(s.recipe_country);
    const isFirstSunnah = isSunnah && !anySunnahYet;

    const regionN = region ? (regionCount.get(region) ?? 0) + 1 : 0;

    let marginNote = '';
    if (isFirstEver) {
      marginNote = 'your first dish.';
    } else if (isFirstCountry) {
      marginNote = `your first from ${s.recipe_country}.`;
    } else if (isFirstSunnah) {
      marginNote = 'your first from the Prophet’s ﷺ table.';
    } else if (nthTime >= 2) {
      marginNote =
        nthTime === 2 ? 'cooked again.' : `your ${ordinal(nthTime)} time at this dish.`;
    } else if (region && regionN >= 2) {
      marginNote = `your ${ordinal(regionN)} from ${region}.`;
    }

    out.push({
      id: s.id,
      slug: s.recipe_slug,
      title,
      country: s.recipe_country,
      region,
      cookedAt: s.cooked_at,
      isReCook,
      marginNote,
    });

    // advance accumulators AFTER deriving this entry
    anyCookYet = true;
    if (s.recipe_country !== null) seenCountries.add(s.recipe_country);
    if (isSunnah) anySunnahYet = true;
    recipeCount.set(s.recipe_slug, nthTime);
    if (region) regionCount.set(region, regionN);
  }

  return out.reverse(); // newest first for display
}

/**
 * Distinct `recipe_slug` count over the full enriched stamp list,
 * including origin-less (null-country) cooks. `summary.stampsPerCountry`
 * cannot be used for this: it only holds country-bearing cooks.
 */
export function buildDishCount(stamps: Stamp[]): number {
  const dishes = new Set<string>();
  for (const s of stamps) dishes.add(s.recipe_slug);
  return dishes.size;
}

export function journalStats(summary: PassportSummary): {
  meals: number;
  corners: number;
} {
  return {
    meals: summary.mealsCooked,
    corners: summary.regionsTouched.size,
  };
}
