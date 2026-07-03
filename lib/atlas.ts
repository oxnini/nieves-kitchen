import type { CulinaryRegion, Recipe } from './types';

/** Recipe narrowed to the fields the atlas requires. */
export type AtlasRecipe = Recipe & {
  country: string;
  region: CulinaryRegion;
  coordinates: { lat: number; lng: number };
};

export function hasPlace(r: Recipe): r is AtlasRecipe {
  return r.country !== null && r.region !== null && r.coordinates !== null;
}

/**
 * Expand recipes so each appears once per influence (spec §9: the atlas is
 * honest about plural influences; dumpling lasagna shows under China AND
 * Italy). An influence copy borrows the region + coordinates of a native
 * recipe of that country so markers stay put; influence-only countries
 * (no native recipe to anchor a marker) are skipped for now — revisit in
 * phase 1.5 if a real country-centroid table is added.
 */
export function expandByInfluences(recipes: AtlasRecipe[]): AtlasRecipe[] {
  const nativeByCountry = new Map<string, AtlasRecipe>();
  for (const r of recipes) {
    if (!nativeByCountry.has(r.country)) nativeByCountry.set(r.country, r);
  }
  const out: AtlasRecipe[] = [...recipes];
  for (const r of recipes) {
    for (const influence of r.influences) {
      if (influence === r.country) continue;
      const anchor = nativeByCountry.get(influence);
      if (!anchor) continue;
      out.push({
        ...r,
        country: influence,
        region: anchor.region,
        coordinates: anchor.coordinates,
      });
    }
  }
  return out;
}
