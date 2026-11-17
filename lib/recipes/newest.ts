import type { Recipe } from '@/lib/types';

const DAY_MS = 86_400_000;

/** Monday-aligned week number (the epoch fell on a Thursday). */
function weekOf(iso: string): number {
  return Math.floor((Date.parse(iso) + 3 * DAY_MS) / (7 * DAY_MS));
}

/**
 * "Newest first", with one nudge (audit S1): within the same week, recipes
 * that have their photo come ahead of those still waiting for one, so the
 * first screen of the catalogue is never a row of empty plates. Across weeks
 * it is plain newest first.
 */
export function compareNewest(a: Recipe, b: Recipe): number {
  const week = weekOf(b.createdAt) - weekOf(a.createdAt);
  if (week !== 0) return week;
  const photo = Number(!!b.image) - Number(!!a.image);
  if (photo !== 0) return photo;
  return b.createdAt.localeCompare(a.createdAt);
}
