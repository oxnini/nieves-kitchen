/**
 * Fixture data for `/dev/journal`. Hand-authored `Stamp[]` (ascending by
 * `cooked_at`, matching what `useCookedStamps` would hand to
 * `buildJournalEntries`) plus the `metaBySlug` map it needs to resolve
 * titles/regions/sunnah status.
 *
 * The sequence below is built to exercise every margin-note branch in
 * `lib/journal.ts#buildJournalEntries` at least once:
 *   - first-ever dish
 *   - first-sunnah (also the origin-less / null-country case)
 *   - first-from-country (x2: a custom-stamp country and a procedural one)
 *   - re-cook, 2nd time ("cooked again")
 *   - re-cook, 3rd time ("your 3rd time at this dish")
 *   - re-cook, 4th time ("your 4th time at this dish")
 *   - Nth-from-region (not a first-country or re-cook)
 *
 * Do NOT wire this route to Supabase / `useCookedStamps` — it is fixture-only.
 */

import type { Stamp } from '@/lib/passport';
import type { JournalRecipeMeta } from '@/lib/journal';

// Turkey has a custom-stamp WebP (see CUSTOM_STAMPS in lib/passport-stamps.ts).
// Iraq does not, so it exercises the procedural stamp branch.
// Brazil also has a custom stamp, giving a second first-from-country example.

const s1: Stamp = {
  id: 's1',
  recipe_slug: 'shakshuka',
  recipe_country: 'Turkey',
  recipe_title: 'Shakshuka',
  cooked_at: '2026-01-01T09:00:00.000Z',
};

const s2: Stamp = {
  id: 's2',
  recipe_slug: 'talbina',
  recipe_country: null,
  recipe_title: 'Talbina',
  cooked_at: '2026-01-05T09:00:00.000Z',
};

const s3: Stamp = {
  id: 's3',
  recipe_slug: 'feijoada',
  recipe_country: 'Brazil',
  recipe_title: 'Feijoada',
  cooked_at: '2026-01-10T09:00:00.000Z',
};

const s4: Stamp = {
  id: 's4',
  recipe_slug: 'shakshuka',
  recipe_country: 'Turkey',
  recipe_title: 'Shakshuka',
  cooked_at: '2026-01-15T09:00:00.000Z',
};

const s5: Stamp = {
  id: 's5',
  recipe_slug: 'masgouf',
  recipe_country: 'Iraq',
  recipe_title: 'Masgouf',
  cooked_at: '2026-01-20T09:00:00.000Z',
};

const s6: Stamp = {
  id: 's6',
  recipe_slug: 'baklava',
  recipe_country: 'Turkey',
  recipe_title: 'Baklava',
  cooked_at: '2026-01-25T09:00:00.000Z',
};

const s7: Stamp = {
  id: 's7',
  recipe_slug: 'shakshuka',
  recipe_country: 'Turkey',
  recipe_title: 'Shakshuka',
  cooked_at: '2026-02-01T09:00:00.000Z',
};

const s8: Stamp = {
  id: 's8',
  recipe_slug: 'shakshuka',
  recipe_country: 'Turkey',
  recipe_title: 'Shakshuka',
  cooked_at: '2026-02-05T09:00:00.000Z',
};

/** Ascending by `cooked_at`, mirrors the full fixture set. */
export const MANY: Stamp[] = [s1, s2, s3, s4, s5, s6, s7, s8];

export const EMPTY: Stamp[] = [];
export const ONE: Stamp[] = [s1];
export const THREE: Stamp[] = [s1, s2, s3];

export const metaBySlug: Map<string, JournalRecipeMeta> = new Map([
  ['shakshuka', { title: 'Shakshuka', isSunnah: false, region: 'Middle East' }],
  ['talbina', { title: 'Talbina', isSunnah: true, region: null }],
  ['feijoada', { title: 'Feijoada', isSunnah: false, region: 'South America' }],
  ['masgouf', { title: 'Masgouf', isSunnah: false, region: 'Middle East' }],
  ['baklava', { title: 'Baklava', isSunnah: false, region: 'Middle East' }],
]);
