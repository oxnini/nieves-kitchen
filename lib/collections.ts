import type { Recipe } from './types';

/**
 * Minimum per-serving protein (grams) for the quiet protein chip and the
 * high-protein collection. One tunable constant, per the 2026-07-03 spec.
 */
export const PROTEIN_CHIP_THRESHOLD = 25;

export interface Collection {
  slug: string;
  title: string;
  /** One line under the title. User-facing: no em dashes. */
  description: string;
  /** Where the banner links. */
  href: string;
  /** Membership predicate; null when the collection is a lens elsewhere (atlas). */
  includes: ((r: Recipe) => boolean) | null;
  /** Margin-voice copy for an empty collection grid. */
  emptyCopy?: string;
}

/**
 * Order is deliberate: the Prophet's ﷺ table is always last. Sunnah is a
 * thread, not a headline (spec §3).
 */
export const COLLECTIONS: Collection[] = [
  {
    slug: 'high-protein',
    title: 'High protein, honest macros',
    description: 'Meals that pull their weight: 25g of protein or more per serving.',
    href: '/recipes?collection=high-protein',
    includes: (r) => r.nutrition.protein >= PROTEIN_CHIP_THRESHOLD,
    emptyCopy: 'Nothing here yet. The kitchen is working on it.',
  },
  {
    slug: 'sides',
    title: 'Sides to mix and match',
    description: 'Small dishes that finish a plate: pickled things, marinated eggs, and friends.',
    href: '/recipes?collection=sides',
    includes: (r) => r.category === 'side',
    emptyCopy: 'The first sides are on their way to the table.',
  },
  {
    slug: 'travels',
    title: 'From my travels',
    description: 'Dishes with a passport. Browse them on the atlas.',
    href: '/atlas',
    includes: null,
  },
  {
    slug: 'sunnah',
    title: 'From the Prophet’s ﷺ table',
    description: 'Dishes he loved, cooked with care and cited with sources.',
    href: '/recipes?collection=sunnah',
    includes: (r) => r.isSunnah,
    emptyCopy: 'Talbina is coming to the table soon, insha’Allah.',
  },
];

export function collectionBySlug(slug: string): Collection | undefined {
  return COLLECTIONS.find((c) => c.slug === slug);
}

/**
 * Per-collection accent classes, shared by the home chapter cards and the
 * /recipes shelf header. Literal class names so Tailwind sees them.
 */
export const COLLECTION_ACCENTS: Record<
  string,
  { bar: string; hover: string; edge: string; borderL: string }
> = {
  'high-protein': {
    bar: 'bg-terracotta',
    hover: 'group-hover:text-terracotta',
    edge: 'hover:border-terracotta/40',
    borderL: 'border-terracotta',
  },
  sides: {
    bar: 'bg-sage',
    hover: 'group-hover:text-sage',
    edge: 'hover:border-sage/50',
    borderL: 'border-sage',
  },
  travels: {
    bar: 'bg-teal',
    hover: 'group-hover:text-teal',
    edge: 'hover:border-teal/50',
    borderL: 'border-teal',
  },
  sunnah: {
    bar: 'bg-turmeric',
    hover: 'group-hover:text-turmeric',
    edge: 'hover:border-turmeric/60',
    borderL: 'border-turmeric',
  },
};
