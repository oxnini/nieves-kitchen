import type { CulinaryRegion } from './types';

export interface Stamp {
  id: string;
  recipe_slug: string;
  recipe_country: string;
  cooked_at: string;
}

export type ExplorerTitle =
  | 'New Explorer'
  | 'Curious Cook'
  | 'Wanderer'
  | 'Globetrotter'
  | 'Culinary Diplomat';

export interface TitleTier {
  title: ExplorerTitle;
  minStamps: number;
  minRegions: number;
}

export const EXPLORER_TITLES: TitleTier[] = [
  { title: 'New Explorer',       minStamps: 0,  minRegions: 0 },
  { title: 'Curious Cook',       minStamps: 1,  minRegions: 1 },
  { title: 'Wanderer',           minStamps: 5,  minRegions: 2 },
  { title: 'Globetrotter',       minStamps: 10, minRegions: 4 },
  { title: 'Culinary Diplomat',  minStamps: 20, minRegions: 10 },
];

export function computeTitle(totalStamps: number, regionsTouched: number): ExplorerTitle {
  let current: ExplorerTitle = 'New Explorer';
  for (const tier of EXPLORER_TITLES) {
    if (totalStamps >= tier.minStamps && regionsTouched >= tier.minRegions) {
      current = tier.title;
    }
  }
  return current;
}

export function nextTitleTier(totalStamps: number, regionsTouched: number): TitleTier | null {
  for (const tier of EXPLORER_TITLES) {
    if (totalStamps < tier.minStamps || regionsTouched < tier.minRegions) {
      return tier;
    }
  }
  return null;
}

export interface PassportSummary {
  totalStamps: number;
  uniqueCountries: Set<string>;
  regionsTouched: Set<CulinaryRegion>;
  stampsPerCountry: Map<string, Stamp[]>;
  title: ExplorerTitle;
  nextTier: TitleTier | null;
}

/**
 * Describes what's needed to reach the next tier, e.g. "3 stamps and 1 region".
 * Returns 'one cook' when both requirements are already met (edge case for
 * the very last cook needed).
 */
export function progressToNextTier(
  stamps: number,
  regions: number,
  minStamps: number,
  minRegions: number,
): string {
  const s = Math.max(0, minStamps - stamps);
  const r = Math.max(0, minRegions - regions);
  const parts: string[] = [];
  if (s > 0) parts.push(`${s} stamp${s === 1 ? '' : 's'}`);
  if (r > 0) parts.push(`${r} region${r === 1 ? '' : 's'}`);
  return parts.length ? parts.join(' and ') : 'one cook';
}

export function summarizeStamps(
  stamps: Stamp[],
  countryToRegion: Map<string, CulinaryRegion>,
): PassportSummary {
  const uniqueCountries = new Set<string>();
  const regionsTouched = new Set<CulinaryRegion>();
  const stampsPerCountry = new Map<string, Stamp[]>();

  for (const s of stamps) {
    uniqueCountries.add(s.recipe_country);
    const region = countryToRegion.get(s.recipe_country);
    if (region) regionsTouched.add(region);
    const arr = stampsPerCountry.get(s.recipe_country) ?? [];
    arr.push(s);
    stampsPerCountry.set(s.recipe_country, arr);
  }

  const title = computeTitle(stamps.length, regionsTouched.size);
  const nextTier = nextTitleTier(stamps.length, regionsTouched.size);

  return {
    totalStamps: stamps.length,
    uniqueCountries,
    regionsTouched,
    stampsPerCountry,
    title,
    nextTier,
  };
}
