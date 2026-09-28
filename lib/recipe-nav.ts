import { CULINARY_REGION_ORDER, type Recipe } from './types';

/* Previous/next between recipes (picked in /dev/recipe-nav, 2026-09-28).
   The walk is atlas order: region (CULINARY_REGION_ORDER), then country,
   then title. The cook moves through their own region first; at its end,
   next hands over to the first recipe of the next region, and after the
   last region it loops back to the first. Pure, so it can be unit-checked
   against any catalogue. */

export type RecipeNeighbour = {
  recipe: Recipe;
  /** The region this step walks into, when it leaves the current one. */
  newRegion: string | null;
};

export type RecipeNav = {
  prev: RecipeNeighbour | null;
  next: RecipeNeighbour;
  /** The current recipe's region, for "5 of 7 from East Asia". */
  region: string;
  /** 0-based position within the region, and the region's size. */
  index: number;
  regionSize: number;
};

const regionOf = (r: Recipe) => r.region ?? 'Elsewhere';

const regionRank = (r: Recipe) => {
  const i = r.region ? CULINARY_REGION_ORDER.indexOf(r.region) : -1;
  return i === -1 ? CULINARY_REGION_ORDER.length : i;
};

export function atlasOrder(recipes: Recipe[]): Recipe[] {
  return [...recipes].sort(
    (a, b) =>
      regionRank(a) - regionRank(b) ||
      (a.country ?? '~').localeCompare(b.country ?? '~') ||
      a.name.localeCompare(b.name),
  );
}

/** Null when the recipe is not in the catalogue or is the only one. */
export function recipeNav(catalogue: Recipe[], id: string): RecipeNav | null {
  const walk = atlasOrder(catalogue);
  const i = walk.findIndex((r) => r.id === id);
  if (i === -1 || walk.length < 2) return null;

  const region = regionOf(walk[i]);
  const inRegion = walk.filter((r) => regionOf(r) === region);
  const step = (r: Recipe): RecipeNeighbour => ({
    recipe: r,
    newRegion: regionOf(r) === region ? null : regionOf(r),
  });
  const prev = step(walk[(i - 1 + walk.length) % walk.length]);
  const next = step(walk[(i + 1) % walk.length]);

  return {
    // With two recipes in total, previous and next are the same dish:
    // showing it twice reads as a mistake, so keep only "next".
    prev: prev.recipe.id === next.recipe.id ? null : prev,
    next,
    region,
    index: inRegion.findIndex((r) => r.id === id),
    regionSize: inRegion.length,
  };
}
