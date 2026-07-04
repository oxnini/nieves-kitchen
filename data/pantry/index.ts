// data/pantry/index.ts
//
// The assembled pantry shelf. Unlike `data/recipes/` (whose seed loader globs
// files at build time), the pantry is imported by client code, so it uses an
// explicit static import list.
//
// `PANTRY` is in shelf order: `KIND_ORDER` group order, and within a group the
// design §2 order.

import type { PantryEntry } from './_types';
import barley from './barley';
import dates from './dates';
import honey from './honey';
import eggs from './eggs';
import yoghurt from './yoghurt';
import butter from './butter';
import garlic from './garlic';
import oliveOil from './olive-oil';
import lamb from './lamb';

export type { PantryEntry, PantryKind } from './_types';
export { KIND_ORDER } from './_types';

export const PANTRY: PantryEntry[] = [
  barley,
  dates,
  honey,
  eggs,
  yoghurt,
  butter,
  garlic,
  oliveOil,
  lamb,
];

const BY_SLUG = new Map(PANTRY.map(entry => [entry.slug, entry]));

export function pantryBySlug(slug: string): PantryEntry | undefined {
  return BY_SLUG.get(slug);
}
