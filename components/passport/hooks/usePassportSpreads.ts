'use client';

import { useMemo } from 'react';
import {
  COUNTRY_TO_SUBREGION,
  SUB_REGION_ORDER,
  SUB_REGION_PARENT,
} from '@/lib/regions';
import type { SubCulinaryRegion, CulinaryRegion, Recipe } from '@/lib/types';
import type { PassportSummary } from '@/lib/passport';
import { packRegions, type RegionSpread } from '@/lib/passport-pack';

export type SpreadDescriptor =
  | { kind: 'cover' }
  | { kind: 'inside-front' }
  | RegionSpread
  | { kind: 'back-cover' };

interface Input {
  recipes: Recipe[];
  summary: PassportSummary;
}

export function usePassportSpreads({ recipes, summary }: Input): SpreadDescriptor[] {
  return useMemo(() => {
    const countriesBySubRegion = new Map<SubCulinaryRegion, Set<string>>();
    const recipesPerParentRegion = new Map<CulinaryRegion, number>();

    for (const r of recipes) {
      const sub = COUNTRY_TO_SUBREGION[r.country];
      if (sub) {
        const set = countriesBySubRegion.get(sub) ?? new Set<string>();
        set.add(r.country);
        countriesBySubRegion.set(sub, set);
      }
      recipesPerParentRegion.set(
        r.region,
        (recipesPerParentRegion.get(r.region) ?? 0) + 1,
      );
    }

    const countriesForSubRegion = (sub: SubCulinaryRegion): string[] => {
      const parent = SUB_REGION_PARENT[sub];
      const parentCount = recipesPerParentRegion.get(parent) ?? 0;
      if (parentCount === 0) return [];

      const all = new Set<string>();
      for (const [country, s] of Object.entries(COUNTRY_TO_SUBREGION)) {
        if (s === sub) all.add(country);
      }
      const fromRecipes = countriesBySubRegion.get(sub);
      if (fromRecipes) for (const c of fromRecipes) all.add(c);
      return [...all].sort((a, b) => a.localeCompare(b));
    };

    const regionInputs = SUB_REGION_ORDER.map(sub => ({
      subRegion: sub,
      countries: countriesForSubRegion(sub),
    })).filter(r => r.countries.length > 0);

    const regionSpreads = packRegions(regionInputs);

    return [
      { kind: 'cover' },
      { kind: 'inside-front' },
      ...regionSpreads,
      { kind: 'back-cover' },
    ];
    // summary is included so the hook recomputes if tiers/stamps change —
    // safe even if not directly used.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recipes, summary]);
}
