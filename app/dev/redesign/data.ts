/**
 * /dev/redesign — shared sample content for the two direction previews.
 *
 * Static on purpose: the sandbox must render without Supabase, captcha,
 * or network. Images are local recipe/pantry assets already in public/.
 */

export type SampleRecipe = {
  slug: string;
  title: string;
  country: string;
  region: string;
  timeTotal: string;
  timeActive: string;
  serves: string;
  img: string;
  blurb: string;
};

export const SAMPLE_RECIPES: SampleRecipe[] = [
  {
    slug: 'turkish-eggs',
    title: 'Çılbır, Turkish Eggs',
    country: 'Türkiye',
    region: 'Middle East',
    timeTotal: '25 min',
    timeActive: '15 min',
    serves: '2',
    img: '/recipes/turkish-eggs-hero.webp',
    blurb:
      'Poached eggs over garlicky strained yoghurt, finished with paprika butter. An Istanbul breakfast that eats like a quiet luxury.',
  },
  {
    slug: 'classic-lasagna',
    title: 'Classic Lasagna al Forno',
    country: 'Italy',
    region: 'Southern Europe',
    timeTotal: '2 hr 30',
    timeActive: '1 hr',
    serves: '8',
    img: '/recipes/classic-lasagna-hero.webp',
    blurb:
      'Slow ragù, silky besciamella, and pasta sheets layered the Emilian way. Sunday cooking for a table of people you like.',
  },
  {
    slug: 'xinjiang-lamb-dumplings',
    title: 'Xinjiang Lamb Dumplings',
    country: 'China',
    region: 'East Asia',
    timeTotal: '1 hr 45',
    timeActive: '1 hr 10',
    serves: '4',
    img: '/recipes/xinjiang-lamb-dumplings-hero.webp',
    blurb:
      'Cumin-heavy lamb and onion parcels from the far west of China, steamed then pan-crisped. The Silk Road in one bite.',
  },
];

export const SAMPLE_COLLECTIONS = [
  { slug: 'high-protein', title: 'High protein, honest macros', count: 6 },
  { slug: 'sides', title: 'Sides to mix and match', count: 4 },
  { slug: 'travels', title: 'From my travels', count: 9 },
  { slug: 'sunnah', title: 'From the Prophet’s ﷺ table', count: 5 },
];

/** Two-tone ink art already shipped for the pantry. */
export const INK_ART = [
  { src: '/pantry/honey.webp', label: 'Honey' },
  { src: '/pantry/garlic.webp', label: 'Garlic' },
  { src: '/pantry/olive-oil.webp', label: 'Olive oil' },
];
