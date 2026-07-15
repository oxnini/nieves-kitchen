/**
 * /dev/redesign/v2 — shared static content for the three new design languages
 * (Sunwashed · Azulejo · Gourmet Press).
 *
 * Static on purpose: the sandbox renders without Supabase, captcha, or network.
 * Images are real recipe/pantry assets already in public/.
 *
 * The `Rich` type lets recipe prose carry inline navigation: a paragraph is an
 * array of plain strings and `{ text, to }` links, so the same authored content
 * renders in every variation's own link styling. This is the "the writing is the
 * navigation" idea — tap a country to open the Atlas, an ingredient to open the
 * Pantry, a tag to open a Collection.
 */

export type NavTo =
  | { kind: 'atlas'; country?: string }
  | { kind: 'pantry'; slug: string }
  | { kind: 'recipes' }
  | { kind: 'collection'; slug: string }
  | { kind: 'about' }
  | { kind: 'recipe'; slug: string };

/** A segment of prose: plain text, or a word/phrase that navigates. */
export type Seg = string | { text: string; to: NavTo };
/** A run of prose (one paragraph, one step, one ingredient line). */
export type Rich = Seg[];

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
      'Soft-poached eggs over warm, garlicky yoghurt, finished with paprika butter. A fast Istanbul breakfast.',
  },
  {
    slug: 'classic-lasagna',
    title: 'Lasagna al Forno',
    country: 'Italy',
    region: 'Southern Europe',
    timeTotal: '2 hr 30',
    timeActive: '1 hr',
    serves: '8',
    img: '/recipes/classic-lasagna-hero.webp',
    blurb:
      'Slow ragù, silky béchamel, and pasta layered the Emilian way. A Sunday dish for a full table.',
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
      'Cumin lamb and onion parcels from western China, steamed then pan-crisped.',
  },
  {
    slug: 'dumpling-lasagna',
    title: 'Dumpling Lasagna',
    country: 'Crossover',
    region: 'The kitchen experiments',
    timeTotal: '1 hr 20',
    timeActive: '50 min',
    serves: '6',
    img: '/recipes/dumpling-lasagna-hero.webp',
    blurb: 'Dumpling filling, lasagna layers. A crossover that somehow works.',
  },
];

export const SAMPLE_COLLECTIONS = [
  { slug: 'high-protein', title: 'High protein', count: 6, blurb: 'Dishes that fill you up.' },
  { slug: 'sides', title: 'Sides', count: 4, blurb: 'Easy things on the side.' },
  { slug: 'travels', title: 'From my travels', count: 9, blurb: 'Picked up on trips.' },
  { slug: 'sunnah', title: 'From the Prophet’s ﷺ table', count: 5, blurb: 'Foods with a story behind them.' },
];

/** Two-tone ink art already shipped for the pantry. */
export const INK_ART = [
  { src: '/pantry/honey.webp', label: 'Honey', slug: 'honey' },
  { src: '/pantry/garlic.webp', label: 'Garlic', slug: 'garlic' },
  { src: '/pantry/olive-oil.webp', label: 'Olive oil', slug: 'olive-oil' },
  { src: '/pantry/yoghurt.webp', label: 'Yoghurt', slug: 'yoghurt' },
  { src: '/pantry/dates.webp', label: 'Dates', slug: 'dates' },
  { src: '/pantry/butter.webp', label: 'Butter', slug: 'butter' },
];

/** A fully-authored recipe detail, with prose that navigates. Shared by all three. */
export type SampleDetail = {
  recipe: SampleRecipe;
  intro: Rich;
  ingredients: { group: string; items: Rich[] }[];
  steps: Rich[];
  gallery: { src: string; caption: string }[];
  related: { slug: string; title: string; country: string; img: string }[];
};

export const TURKISH_EGGS_DETAIL: SampleDetail = {
  recipe: SAMPLE_RECIPES[0],
  intro: [
    'A Turkish breakfast from ',
    { text: 'Türkiye', to: { kind: 'atlas', country: 'Türkiye' } },
    '. Soft-poached eggs sit over warm, garlicky ',
    { text: 'yoghurt', to: { kind: 'pantry', slug: 'yoghurt' } },
    ', finished with paprika ',
    { text: 'butter', to: { kind: 'pantry', slug: 'butter' } },
    '. Quick to make, hard to stop eating. It’s on the ',
    { text: 'From my travels', to: { kind: 'collection', slug: 'travels' } },
    ' list.',
  ],
  ingredients: [
    {
      group: 'For the yoghurt base',
      items: [
        [{ text: 'Strained yoghurt', to: { kind: 'pantry', slug: 'yoghurt' } }, ', 250g, cold from the fridge'],
        [{ text: 'Garlic', to: { kind: 'pantry', slug: 'garlic' } }, ', 1 small clove, grated'],
        ['Fine sea salt, a pinch'],
      ],
    },
    {
      group: 'To finish',
      items: [
        [{ text: 'Eggs', to: { kind: 'pantry', slug: 'eggs' } }, ', 2, very fresh'],
        [{ text: 'Butter', to: { kind: 'pantry', slug: 'butter' } }, ', 40g'],
        [{ text: 'Olive oil', to: { kind: 'pantry', slug: 'olive-oil' } }, ', 1 tsp'],
        ['Aleppo pepper or sweet paprika, 1 tsp'],
        ['Warm flatbread, to serve'],
      ],
    },
  ],
  steps: [
    [
      'Stir the ',
      { text: 'yoghurt', to: { kind: 'pantry', slug: 'yoghurt' } },
      ' with the grated ',
      { text: 'garlic', to: { kind: 'pantry', slug: 'garlic' } },
      ' and a little salt. Leave it out so it isn’t fridge-cold.',
    ],
    [
      'Bring a wide pan of water to a low simmer. Slip in the ',
      { text: 'eggs', to: { kind: 'pantry', slug: 'eggs' } },
      ' and poach until the whites set, about three minutes.',
    ],
    [
      'Melt the ',
      { text: 'butter', to: { kind: 'pantry', slug: 'butter' } },
      ' with the paprika and a little ',
      { text: 'olive oil', to: { kind: 'pantry', slug: 'olive-oil' } },
      ' until it foams and turns red.',
    ],
    [
      'Spread the yoghurt on plates, add the eggs, and spoon the butter over. Serve with bread. For more like it, see ',
      { text: 'From my travels', to: { kind: 'collection', slug: 'travels' } },
      ', or open ',
      { text: 'the map', to: { kind: 'atlas' } },
      '.',
    ],
  ],
  gallery: [
    { src: '/recipes/turkish-eggs-hero.webp', caption: 'Plated and ready for the butter.' },
  ],
  related: [
    { slug: 'classic-lasagna', title: 'Lasagna al Forno', country: 'Italy', img: '/recipes/classic-lasagna-hero.webp' },
    { slug: 'xinjiang-lamb-dumplings', title: 'Xinjiang Lamb Dumplings', country: 'China', img: '/recipes/xinjiang-lamb-dumplings-hero.webp' },
    { slug: 'dumpling-lasagna', title: 'Dumpling Lasagna', country: 'Crossover', img: '/recipes/dumpling-lasagna-hero.webp' },
  ],
};
