import 'server-only';
import fs from 'node:fs';
import path from 'node:path';
import { PANTRY, type PantryEntry } from '@/data/pantry';

/**
 * The pantry entries whose ink art actually exists in `public/pantry/`, in
 * shelf order. Both the /pantry shelf and the home teaser draw from this one
 * check so they can never disagree about which entries have shipped.
 *
 * No placeholder assets ship (phase 1 amendment precedent): an entry surfaces
 * only once its `<slug>.webp` lands, so the pantry can launch partial and fill
 * in as renders arrive. Server-only: it reads the filesystem at build/request
 * time.
 */
export function landedPantryEntries(): PantryEntry[] {
  const dir = path.join(process.cwd(), 'public', 'pantry');
  let landed: Set<string>;
  try {
    landed = new Set(
      fs.readdirSync(dir)
        .filter((f) => f.endsWith('.webp'))
        .map((f) => f.slice(0, -'.webp'.length)),
    );
  } catch {
    landed = new Set();
  }
  return PANTRY.filter((e) => landed.has(e.slug));
}
