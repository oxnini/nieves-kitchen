import type { SubCulinaryRegion } from './types';

export const HALF_CAPACITY = 16;
export const SMALL_THRESHOLD = 8;

export interface RegionBlock {
  subRegion: SubCulinaryRegion;
  countries: string[];
  isContinuation: boolean;
}

export interface RegionHalfDescriptor {
  kind: 'region-half';
  blocks: RegionBlock[];
}

export interface BlankHalfDescriptor {
  kind: 'blank';
}

export type HalfDescriptor = RegionHalfDescriptor | BlankHalfDescriptor;

export interface RegionSpread {
  kind: 'region';
  left: HalfDescriptor;
  right: HalfDescriptor;
}

export interface RegionInput {
  subRegion: SubCulinaryRegion;
  countries: string[];
}

export function packRegions(regions: RegionInput[]): RegionSpread[] {
  const halves: HalfDescriptor[] = [];

  let i = 0;
  while (i < regions.length) {
    const r = regions[i];
    const n = r.countries.length;

    if (n === 0) {
      i += 1;
      continue;
    }

    // Large: overflow across halves.
    if (n > HALF_CAPACITY) {
      let remaining = r.countries;
      let isContinuation = false;
      while (remaining.length > 0) {
        const slice = remaining.slice(0, HALF_CAPACITY);
        halves.push({
          kind: 'region-half',
          blocks: [{ subRegion: r.subRegion, countries: slice, isContinuation }],
        });
        remaining = remaining.slice(HALF_CAPACITY);
        isContinuation = true;
      }
      i += 1;
      continue;
    }

    // Small: try to pair with the next small region.
    if (n <= SMALL_THRESHOLD) {
      const next = regions[i + 1];
      if (
        next &&
        next.countries.length > 0 &&
        next.countries.length <= SMALL_THRESHOLD &&
        n + next.countries.length <= HALF_CAPACITY
      ) {
        halves.push({
          kind: 'region-half',
          blocks: [
            { subRegion: r.subRegion, countries: r.countries, isContinuation: false },
            { subRegion: next.subRegion, countries: next.countries, isContinuation: false },
          ],
        });
        i += 2;
        continue;
      }
    }

    // Medium (or lonely small): own half.
    halves.push({
      kind: 'region-half',
      blocks: [{ subRegion: r.subRegion, countries: r.countries, isContinuation: false }],
    });
    i += 1;
  }

  // Ensure even number of halves so every spread has two.
  if (halves.length % 2 === 1) halves.push({ kind: 'blank' });

  const spreads: RegionSpread[] = [];
  for (let j = 0; j < halves.length; j += 2) {
    spreads.push({ kind: 'region', left: halves[j], right: halves[j + 1] });
  }
  return spreads;
}
