// data/recipes/xinjiang-lamb-dumplings.ts
import type { RecipeInput } from './_types';

const recipe: RecipeInput = {
  title: 'Xinjiang Lamb Dumplings',
  country: 'China',
  featuredIngredients: ['lamb'],
  category: 'main',
  difficulty: 'Easy',
  servings: 3,
  time: { active: 40, total: 55 },
  yield: 'About 25 dumplings',
  tags: ['high-protein', 'budget-friendly', 'meal-prep friendly', 'comfort food'],

  region: 'East Asia',
  coordinates: { lat: 43.83, lng: 87.62 },

  ingredients: [
    {
      heading: 'Filling',
      items: [
        { name: 'lamb mince', amount: 200, unit: 'g' },
        { name: 'shop-bought dumpling wrappers', amount: 25, unit: '' },
        { name: 'carrot, grated', amount: 0.5, unit: '' },
        { name: 'onion, finely minced', amount: 0.5, unit: '' },
        { name: 'spring onions, chopped', amount: 2, unit: '' },
        { name: 'coriander, chopped', amount: 1, unit: 'handful' },
      ],
    },
    {
      heading: 'Seasoning',
      items: [
        { name: 'soy sauce', amount: 1, unit: 'tbsp' },
        { name: 'dark soy sauce (optional, recommended)', amount: 1, unit: 'tbsp' },
        { name: 'sesame oil', amount: 1, unit: 'tsp' },
        { name: 'ground cumin', amount: 1.5, unit: 'tsp' },
        { name: 'chili flakes (optional)', amount: 0.5, unit: 'tsp' },
        { name: 'white pepper (or black pepper)', amount: 1, unit: 'tsp' },
        { name: 'salt', amount: 0.5, unit: 'tsp' },
        { name: 'ginger, grated', amount: 1, unit: 'tsp' },
        { name: 'water', amount: 1, unit: 'tbsp' },
      ],
    },
    {
      heading: 'To serve',
      items: [
        { name: 'soy sauce, black vinegar, chili oil, and chopped coriander, to taste', amount: 0, unit: '' },
      ],
    },
  ],

  steps: [
    {
      heading: 'Make the filling',
      items: [
        'Grate the carrot, finely mince the onion, chop the spring onions, and roughly chop the coriander. Add them to a large bowl with the lamb mince.',
        'Add the soy sauce, dark soy, sesame oil, cumin, white pepper, salt, grated ginger, the chili flakes if using, and the tablespoon of water. Mix firmly in one direction until the filling turns slightly sticky and holds together. That stickiness is what keeps it juicy and stops it falling apart in the wrapper.',
      ],
    },
    {
      heading: 'Wrap',
      items: [
        'Set out a small bowl of water. Place about a tablespoon of filling in the centre of a wrapper, keeping it clear of the edges. Try not to overpack it, a fuller wrapper is much harder to seal and more likely to split.',
        'Run a wet finger around the rim of the wrapper, fold it over the filling, and press the edges to seal, pleating along the top if you like. Any fold works as long as it is sealed shut. Set each finished dumpling on a lightly floured tray so they do not stick.',
      ],
    },
    {
      heading: 'To steam (my preference)',
      items: [
        'Use a steamer basket with holes and either lay down a liner or brush the base with a little oil, so the dumplings do not stick. Arrange them with a little space between each one.',
        'Steam over boiling water for about 12 minutes, until cooked through.',
      ],
    },
    {
      heading: 'To pan-fry',
      items: [
        'Heat a thin layer of oil in a pan over medium-high heat and set the dumplings in flat side down. Cook until the bottoms are golden and crisp.',
        'Pour in about 8 tablespoons of chicken stock, enough to steam them but not drown them, and cover with a lid straight away. Let them steam until the liquid has evaporated.',
        'Lift the lid and cook for another minute or two so the bottoms crisp back up, then lift them out.',
      ],
    },
    {
      heading: 'To serve',
      items: [
        'Stir together a dipping sauce of soy sauce, black vinegar, chili oil, and a little chopped coriander, adjusting each to taste. Serve the dumplings hot with the sauce alongside.',
      ],
    },
  ],

  nutrition: { calories: 450, protein: 24, carbs: 46, fat: 16 },
  flavorProfile: { sweet: 1, salty: 3, sour: 1, bitter: 1, umami: 4, spicy: 1 },

  isVegetarian: false,
  isVegan: false,
  isGlutenFree: false,
  isDairyFree: true,

  quote:
    'Shop-bought wrappers and a cumin-heavy lamb filling: this is my easy weeknight way into Xinjiang dumplings, steamed if I want them light or pan-fried for a crisp base.',
  description:
    'These are my Xinjiang style lamb dumplings, built around cumin, ginger, and plenty of spring onion and coriander. I keep them easy by using shop-bought wrappers from the Chinese supermarket, which are cheap and come in generous packs, so the only real work is the filling and the folding. One filling, two ways to finish: steam them for something lighter, or pan-fry them for a golden, crisp base. Either way they freeze well, so I usually make a big batch.',
  attribution: 'A Nieves\'s Kitchen original',
  headnoteInstructions:
    'The filling and folding are the same either way. When it comes to cooking, pick one method: steaming keeps them lighter, pan-frying gives you a crisp base.',

  equipment: [
    'Something to steam in (a basket, a colander or sieve over a pot, or a heatproof plate on a trivet)',
    'A lidded frying pan, if you want to crisp the bottoms',
  ],

  tips: [
    'Use lamb mince that is not too lean. A little fat keeps the filling juicy, though leaner mince still tastes good.',
    'Mix the filling until it feels slightly sticky and tacky. That is the sign it will hold together and stay juicy.',
    'Do not overfill. A heaped tablespoon is plenty, and a fuller wrapper is much harder to seal cleanly.',
    'For steaming, either line the basket or brush it with a little oil. Skipping this is how dumplings weld themselves to the steamer.',
    'No white pepper? Black pepper works in its place.',
  ],

  variations: [
    'Leave out the chili flakes for a milder filling, or add more if you like heat.',
    'Dark soy is optional, but I recommend it for a deeper colour and savouriness.',
  ],

  storage:
    'These freeze beautifully, so it is worth making a big batch. Freeze the raw dumplings in a single layer on a tray until solid, then tip them into a bag. Cook them straight from frozen, adding a couple of extra minutes. Cooked dumplings keep in the fridge for 2 to 3 days.',

  dropcap: true,

  image: '/recipes/xinjiang-lamb-dumplings-hero.webp',
  imageIsStock: false,
  images: [
    {
      url: '/recipes/xinjiang-lamb-dumplings-steaming.webp',
      caption: 'Steaming over boiling water until cooked through',
      width: 1448,
      height: 1086,
    },
    {
      url: '/recipes/xinjiang-lamb-dumplings-cooked.webp',
      caption: 'Steamed and pan-fried, golden underneath',
      width: 1086,
      height: 1448,
    },
    {
      url: '/recipes/xinjiang-lamb-dumplings-pan-fried.webp',
      caption: 'Pan-fried to a crisp, golden base',
      width: 1086,
      height: 1448,
    },
  ],
};

export default recipe;
