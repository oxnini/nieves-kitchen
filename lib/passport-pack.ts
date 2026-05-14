import type { CulinaryRegion } from './types';

// Cap each half at 4 cooked countries. The visual grid is 3-wide, but
// image visas are ~1.4× the column unit and wrap to 2-per-row in flex,
// so anything past 4 stamps spills below the page edge. A 5th cooked
// country flows to the right half; past 8, into a continuation spread.
export const HALF_CAPACITY = 4;
export const SPREAD_CAPACITY = HALF_CAPACITY * 2; // 8

export interface RegionSpread {
  kind: 'region';
  region: CulinaryRegion;
  /** Stable slug for deep-linking. First spread = region slug; continuations append `-2`, `-3`, ... */
  slug: string;
  /** 0 for the first (primary) spread in a region, 1+ for continuations. */
  continuationIndex: number;
  /** Up to HALF_CAPACITY countries, in cooked order. May be empty on an empty primary spread. */
  leftCountries: string[];
  /** Up to HALF_CAPACITY countries, in cooked order. May be empty. */
  rightCountries: string[];
}

export function regionSlug(region: CulinaryRegion): string {
  return region
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Pack an ordered list of cooked countries for a single top-level region
 * into one or more spreads of 24 slots (12 per half).
 *
 * An empty list still produces a single primary spread (empty) — the booklet
 * always shows all 10 regions.
 */
export function packRegion(
  region: CulinaryRegion,
  orderedCountries: string[],
): RegionSpread[] {
  const base = regionSlug(region);
  if (orderedCountries.length === 0) {
    return [{
      kind: 'region',
      region,
      slug: base,
      continuationIndex: 0,
      leftCountries: [],
      rightCountries: [],
    }];
  }

  const spreads: RegionSpread[] = [];
  let offset = 0;
  let continuationIndex = 0;
  while (offset < orderedCountries.length) {
    const leftCountries = orderedCountries.slice(offset, offset + HALF_CAPACITY);
    const rightCountries = orderedCountries.slice(
      offset + HALF_CAPACITY,
      offset + SPREAD_CAPACITY,
    );
    spreads.push({
      kind: 'region',
      region,
      slug: continuationIndex === 0 ? base : `${base}-${continuationIndex + 1}`,
      continuationIndex,
      leftCountries,
      rightCountries,
    });
    offset += SPREAD_CAPACITY;
    continuationIndex += 1;
  }
  return spreads;
}
