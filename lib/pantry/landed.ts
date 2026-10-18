import 'server-only';
import fs from 'node:fs';
import path from 'node:path';
import { PANTRY, type PantryEntry, type PantryPlate } from '@/data/pantry';

/**
 * The pantry entries whose ink art actually exists in `public/pantry/`, in
 * shelf order. Both the /pantry shelf and the home teaser draw from this one
 * check so they can never disagree about which entries have shipped.
 *
 * No placeholder assets ship (phase 1 amendment precedent): an entry surfaces
 * only once the file its `artSrc` names lands, so the pantry can launch partial
 * and fill in as renders arrive. Replacement art takes a new filename
 * (`lamb-2.webp`), since optimised images are cached for 31 days. Server-only:
 * it reads the filesystem at build/request time.
 */
export function landedPantryEntries(): PantryEntry[] {
  const dir = path.join(process.cwd(), 'public', 'pantry');
  let landed: Set<string>;
  try {
    landed = new Set(fs.readdirSync(dir));
  } catch {
    landed = new Set();
  }
  return PANTRY.filter((e) => landed.has(path.basename(e.artSrc)));
}

/**
 * A recipe's "From the pantry" plates: its `featuredIngredients` that have
 * landed, in the recipe's own order. Entries with no art yet (beef) are left
 * out rather than drawn as a gap. Trimmed to what the plate draws, so the
 * notes and citations don't travel to the recipe page.
 */
export function landedPantryPlates(slugs: string[]): PantryPlate[] {
  const landed = new Map(landedPantryEntries().map((e) => [e.slug, e]));
  return slugs.flatMap((slug) => {
    const e = landed.get(slug);
    return e ? [{ slug: e.slug, name: e.name, artSrc: e.artSrc }] : [];
  });
}
