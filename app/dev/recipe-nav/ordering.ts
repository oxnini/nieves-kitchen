import { CULINARY_REGION_ORDER, type Recipe } from '@/lib/types';

/* Prev/next ordering for /dev/recipe-nav. Pure: a catalogue and the current
   recipe in, the two neighbours out. Nothing here knows about rendering, so
   whichever option the user picks can move to lib/ unchanged. */

export type Order = 'region' | 'country' | 'all';
/** What happens at the ends of the set. `handover` walks on into the next
 *  region or country (atlas order), so it never runs out while the catalogue
 *  has more than one recipe. */
export type Ends = 'wrap' | 'handover' | 'stop';
export type AllSort = 'atlas' | 'az';

export type Neighbour = {
  recipe: Recipe;
  /** Set when this step leaves the current set: the new region or country. */
  crossesInto: string | null;
};

export type NavResult = {
  /** The recipes in the current set, in order. */
  set: Recipe[];
  /** "East Asia", "China", or "all recipes". */
  setLabel: string;
  index: number;
  prev: Neighbour | null;
  next: Neighbour | null;
  /** The whole catalogue in walking order (for the lab's sequence strip). */
  sequence: Recipe[];
};

const regionRank = (r: Recipe) => {
  const i = r.region ? CULINARY_REGION_ORDER.indexOf(r.region) : -1;
  return i === -1 ? CULINARY_REGION_ORDER.length : i;
};

/** Atlas order: region (CULINARY_REGION_ORDER), then country, then title. */
export function atlasOrder(recipes: Recipe[]): Recipe[] {
  return [...recipes].sort(
    (a, b) =>
      regionRank(a) - regionRank(b) ||
      (a.country ?? '~').localeCompare(b.country ?? '~') ||
      a.name.localeCompare(b.name),
  );
}

export function setKey(r: Recipe, order: Order): string {
  if (order === 'region') return r.region ?? 'Elsewhere';
  if (order === 'country') return r.country ?? 'Elsewhere';
  return 'all recipes';
}

export function neighbours(
  catalogue: Recipe[], currentId: string, order: Order, ends: Ends, allSort: AllSort = 'atlas',
): NavResult {
  const sequence =
    order === 'all' && allSort === 'az'
      ? [...catalogue].sort((a, b) => a.name.localeCompare(b.name))
      : atlasOrder(catalogue);
  const current = sequence.find((r) => r.id === currentId) ?? sequence[0];
  const key = current ? setKey(current, order) : '';
  const set = sequence.filter((r) => setKey(r, order) === key);
  const index = Math.max(0, set.findIndex((r) => r.id === current?.id));
  const base = { set, setLabel: key, index, sequence };

  if (!current || sequence.length < 2) return { ...base, prev: null, next: null };

  // "All" is one set, so handing over has nowhere to go: treat it as wrap.
  const mode: Ends = order === 'all' && ends === 'handover' ? 'wrap' : ends;
  const n = set.length;
  const inSet = (r: Recipe | undefined): Neighbour | null => (r ? { recipe: r, crossesInto: null } : null);

  let prev: Neighbour | null = null;
  let next: Neighbour | null = null;

  if (mode === 'stop') {
    prev = inSet(set[index - 1]);
    next = inSet(set[index + 1]);
  } else if (mode === 'wrap') {
    if (n > 1) {
      prev = inSet(set[(index - 1 + n) % n]);
      next = inSet(set[(index + 1) % n]);
    }
  } else {
    // Hand over: step through the whole atlas sequence, looping at the very
    // end, and flag the step that leaves the set.
    const i = sequence.findIndex((r) => r.id === current.id);
    const len = sequence.length;
    const step = (r: Recipe): Neighbour => ({
      recipe: r,
      crossesInto: setKey(r, order) === key ? null : setKey(r, order),
    });
    prev = step(sequence[(i - 1 + len) % len]);
    next = step(sequence[(i + 1) % len]);
  }

  // With two recipes in a wrapping set, previous and next are the same dish.
  // Showing it twice reads as a mistake, so keep only "next".
  if (prev && next && prev.recipe.id === next.recipe.id) prev = null;

  return { ...base, prev, next };
}
