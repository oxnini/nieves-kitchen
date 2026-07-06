'use client';

import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { createClient } from '@/lib/supabase/client';
import { summarizeStamps, type Stamp } from '@/lib/passport';
import { buildDishCount, buildJournalEntries, type JournalRecipeMeta } from '@/lib/journal';
import { useRecipes } from './useRecipes';
import { useSessionReady } from '@/components/Providers';
import type { CulinaryRegion } from '@/lib/types';
import type { CancellationInput } from '@/components/passport/CountryStampSlot';

/**
 * FNV-1a over a seed string, normalised to [0, 1]. Nothing here is
 * security-sensitive; we just need a stable, well-distributed hash that
 * a refresh / re-mount can reproduce.
 */
function hash01(seed: string): number {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0) / 0xffffffff;
}

/**
 * Per-recipe placement on the visa, seeded purely from
 * `(country, recipe_slug)` per SPEC §4. The seed is per-recipe — not
 * per-position-in-list — so adding, undoing, or recooking another
 * recipe never shifts this recipe's postmark.
 *
 *   - **Angle**: uniform in [0°, 360°).
 *   - **Radius**: uniform in [36%, 44%] from visa centre, measured in
 *     `%` of the visa's bounding box. The postmark itself is ~46% wide
 *     (half-width ~23%), so a centre at R=44 puts the postmark edge at
 *     67% on the inward side and 67+46 = +13% off the outward edge —
 *     i.e. the postmark sits at the visa perimeter with up to a third
 *     hanging off, mimicking real over-edge postmarking. R=36 is the
 *     inner end of the band and keeps the visa's centre clear.
 *   - **Rotation**: independent seed, ±12°.
 *
 * `country.toLowerCase():slug.toLowerCase()` makes the per-country
 * fingerprint stable across casing drift.
 */
function placementFor(country: string, slug: string): {
  center: { x: number; y: number };
  rotation: number;
} {
  const key = `${country.toLowerCase()}:${slug.toLowerCase()}`;
  const a = hash01(`pos-angle:${key}`) * 2 * Math.PI;
  const rNorm = hash01(`pos-radius:${key}`);
  const radius = 36 + rNorm * 8; // [36, 44]
  const rotNorm = hash01(`rot:${key}`);
  return {
    center: {
      x: 50 + radius * Math.cos(a),
      y: 50 - radius * Math.sin(a), // CSS y is inverted
    },
    rotation: (rotNorm * 2 - 1) * 12,
  };
}

/**
 * Fallback when a stamp's `recipe_slug` no longer matches any recipe
 * (renamed, deleted). Slug → "TITLE CASE WORDS"-ish; the postmark
 * uppercases and truncates downstream so case here doesn't matter.
 */
function titleFromSlug(slug: string): string {
  return slug.replace(/[-_]+/g, ' ').trim() || slug;
}

export function useCookedStamps() {
  const sessionReady = useSessionReady();

  const stampsQuery = useQuery<Stamp[]>({
    queryKey: ['passport-stamps'],
    queryFn: async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('passport_stamps')
        .select('id, recipe_slug, recipe_country, cooked_at')
        .order('cooked_at', { ascending: true });
      if (error) throw error;
      return (data ?? []) as Stamp[];
    },
    enabled: sessionReady,
    staleTime: 1000 * 60 * 30,
    refetchOnWindowFocus: false,
  });

  const recipesQuery = useRecipes();

  const countryToRegion = useMemo(() => {
    const map = new Map<string, CulinaryRegion>();
    for (const r of recipesQuery.data ?? []) {
      if (r.country !== null && r.region !== null) map.set(r.country, r.region);
    }
    return map;
  }, [recipesQuery.data]);

  const slugToTitle = useMemo(() => {
    const map = new Map<string, string>();
    for (const r of recipesQuery.data ?? []) {
      map.set(r.id, r.name);
    }
    return map;
  }, [recipesQuery.data]);

  // Enrich the raw rows with the joined recipe_title (used by the
  // postmark's top arc). `cook_index` was here in an earlier pass but
  // the seeded-polar placement model (SPEC §4 revised) keys everything
  // off the slug, not an ordinal, so the field is no longer needed.
  const enrichedStamps = useMemo<Stamp[]>(() => {
    const rows = stampsQuery.data ?? [];
    return rows.map((s) => ({
      ...s,
      recipe_title: slugToTitle.get(s.recipe_slug) ?? titleFromSlug(s.recipe_slug),
    }));
  }, [stampsQuery.data, slugToTitle]);

  const summary = useMemo(
    () => summarizeStamps(enrichedStamps, countryToRegion),
    [enrichedStamps, countryToRegion],
  );

  const metaBySlug = useMemo(() => {
    const map = new Map<string, JournalRecipeMeta>();
    for (const r of recipesQuery.data ?? []) {
      map.set(r.id, { title: r.name, isSunnah: r.isSunnah, region: r.region });
    }
    return map;
  }, [recipesQuery.data]);

  const entries = useMemo(
    () => buildJournalEntries(enrichedStamps, metaBySlug),
    [enrichedStamps, metaBySlug],
  );

  const stats = useMemo(
    () => ({
      meals: summary.mealsCooked,
      dishes: buildDishCount(enrichedStamps),
      // Distinct countries cooked from (a stamp == a country). Origin-less
      // dishes carry no country and correctly don't count here, but still
      // count toward meals/dishes.
      countries: summary.stampsPerCountry.size,
    }),
    [summary.mealsCooked, summary.stampsPerCountry, enrichedStamps],
  );

  // Per-country `CancellationInput[]` — the shape `CountryStampSlot`'s
  // `cancellations` prop accepts.
  //
  // Per SPEC §3 (revised): **one cancellation per unique recipe**, not
  // per raw cook row. Recooking the same dish does not add a new
  // postmark — repetition lives elsewhere (the inside-front
  // `mealsCooked` count, the §5 frequent-visitor seal at 10 total
  // cooks). Deduplication happens here, keeping the earliest
  // `cooked_at` for each slug (the date the user *earned* that
  // postmark — see SPEC §3.1 table).
  //
  // Per SPEC §4 (revised): **placement is seeded per-recipe**, not by
  // ordinal. `placementFor(country, slug)` returns the postmark's
  // centre and rotation as a deterministic function of `(country,
  // slug)` only, so adding, undoing, or recooking another recipe
  // never shifts this recipe's postmark.
  const cancellationsByCountry = useMemo(() => {
    const map = new Map<string, CancellationInput[]>();
    for (const [country, stamps] of summary.stampsPerCountry) {
      const seenSlug = new Set<string>();
      const uniqueByRecipe: Stamp[] = [];
      for (const s of stamps) {
        if (seenSlug.has(s.recipe_slug)) continue;
        seenSlug.add(s.recipe_slug);
        uniqueByRecipe.push(s);
      }
      map.set(
        country,
        uniqueByRecipe.map((s) => {
          const { center, rotation } = placementFor(country, s.recipe_slug);
          return {
            recipeTitle: s.recipe_title ?? titleFromSlug(s.recipe_slug),
            cookDate: new Date(s.cooked_at),
            rotation,
            center,
          };
        }),
      );
    }
    return map;
  }, [summary.stampsPerCountry]);

  return {
    stamps: enrichedStamps,
    summary,
    cancellationsByCountry,
    countryToRegion,
    entries,
    stats,
    isLoading: stampsQuery.isLoading || recipesQuery.isLoading,
    error: stampsQuery.error ?? recipesQuery.error,
  };
}
