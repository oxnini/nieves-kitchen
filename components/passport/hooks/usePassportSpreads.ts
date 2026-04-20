'use client';

import { useMemo } from 'react';
import { CULINARY_REGION_ORDER, type CulinaryRegion, type Recipe } from '@/lib/types';
import type { PassportSummary } from '@/lib/passport';
import { packRegion, type RegionSpread } from '@/lib/passport-pack';

export type SpreadDescriptor =
  | { kind: 'cover' }
  | { kind: 'inside-front' }
  | RegionSpread
  | { kind: 'back-cover' };

interface Input {
  recipes: Recipe[];
  summary: PassportSummary;
}

/**
 * Build the passport's spread sequence:
 *   cover → inside-front → one or more spreads per region (all 10 always present)
 *   → back-cover.
 *
 * Stamp ordering within a region is by each country's first cooked_at
 * timestamp ascending, with country-name alphabetical as a tiebreak.
 */
export function usePassportSpreads({ recipes, summary }: Input): SpreadDescriptor[] {
  return useMemo(() => {
    // country → top-level region (derived from the recipe list — every cooked
    // country has at least one recipe, so this lookup is total for our inputs).
    const countryToRegion = new Map<string, CulinaryRegion>();
    for (const r of recipes) {
      if (!countryToRegion.has(r.country)) {
        countryToRegion.set(r.country, r.region);
      }
    }

    // For each region, collect cooked countries and their first cooked_at.
    const perRegion = new Map<CulinaryRegion, { country: string; firstAt: string }[]>();
    for (const region of CULINARY_REGION_ORDER) perRegion.set(region, []);

    for (const [country, stamps] of summary.stampsPerCountry) {
      if (stamps.length === 0) continue;
      const region = countryToRegion.get(country);
      if (!region || !perRegion.has(region)) continue;
      // Stamps arrive ordered ascending by cooked_at from useCookedStamps.
      const firstAt = stamps[0].cooked_at;
      perRegion.get(region)!.push({ country, firstAt });
    }

    // Order: first cooked_at ascending, country name ascending as tiebreak.
    const orderedPerRegion = new Map<CulinaryRegion, string[]>();
    for (const region of CULINARY_REGION_ORDER) {
      const arr = perRegion.get(region)!;
      arr.sort((a, b) => {
        if (a.firstAt !== b.firstAt) return a.firstAt < b.firstAt ? -1 : 1;
        return a.country.localeCompare(b.country);
      });
      orderedPerRegion.set(region, arr.map(x => x.country));
    }

    const regionSpreads: RegionSpread[] = [];
    for (const region of CULINARY_REGION_ORDER) {
      regionSpreads.push(...packRegion(region, orderedPerRegion.get(region)!));
    }

    return [
      { kind: 'cover' as const },
      { kind: 'inside-front' as const },
      ...regionSpreads,
      { kind: 'back-cover' as const },
    ];
  }, [recipes, summary]);
}
