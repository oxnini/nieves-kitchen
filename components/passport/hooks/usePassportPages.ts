'use client';

import { useMemo } from 'react';
import {
  COUNTRY_TO_SUBREGION,
  SUB_REGION_ORDER,
  SUB_REGION_PARENT,
} from '@/lib/regions';
import type { SubCulinaryRegion, CulinaryRegion, Recipe } from '@/lib/types';
import type { PassportSummary } from '@/lib/passport';

export type PageDescriptor =
  | { kind: 'cover' }
  | { kind: 'inside-front' }
  | { kind: 'sub-region'; subRegion: SubCulinaryRegion; countries: string[] }
  | { kind: 'back-cover' };

interface Input {
  recipes: Recipe[];
  summary: PassportSummary;
}

export function usePassportPages({ recipes, summary }: Input): PageDescriptor[] {
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

    const pages: PageDescriptor[] = [
      { kind: 'cover' },
      { kind: 'inside-front' },
    ];

    for (const sub of SUB_REGION_ORDER) {
      const countries = countriesForSubRegion(sub);
      if (countries.length > 0) {
        pages.push({ kind: 'sub-region', subRegion: sub, countries });
      }
    }

    pages.push({ kind: 'back-cover' });
    return pages;
  }, [recipes, summary]);
}
