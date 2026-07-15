// data/recipes/chinese-prawn-spaghetti.ts
import type { RecipeInput } from './_types';

const recipe: RecipeInput = {
  title: 'Spring Onion Oil Prawn Spaghetti',
  country: 'Italy',
  featuredIngredients: ['garlic'],
  category: 'main',
  difficulty: 'Medium',
  servings: 2,
  time: { active: 25, total: 30 },
  yield: '2 generous plates',
  tags: ['fusion', 'high-protein', 'quick', 'spicy'],

  region: 'Western Europe',
  coordinates: { lat: 40.85, lng: 14.27 },

  isFusion: true,
  inspiredBy: ['China'],
  influences: ['Italy', 'China'],

  ingredients: [
    {
      heading: 'The base',
      items: [
        { name: 'spaghetti or linguine, bronze-cut if you can (e.g. De Cecco)', amount: 200, unit: 'g' },
        { name: 'large prawns, head-on if possible', amount: 350, unit: 'g' },
        { name: 'neutral oil', amount: 3, unit: 'tbsp' },
        { name: 'tomato paste', amount: 1, unit: 'tbsp' },
      ],
    },
    {
      heading: 'Aromatics and sauce',
      items: [
        { name: 'spring onions, sliced', amount: 4, unit: '' },
        { name: 'garlic cloves, minced', amount: 4, unit: '' },
        { name: 'fresh ginger, grated (optional)', amount: 1, unit: 'tsp' },
        { name: 'light soy sauce', amount: 2, unit: 'tbsp' },
        { name: 'dark soy sauce (highly recommended, for colour)', amount: 1, unit: 'tsp' },
        { name: 'toasted sesame oil', amount: 2, unit: 'tsp' },
        { name: 'chili flakes, to taste', amount: 1, unit: 'tsp' },
        { name: 'salt and black pepper, to taste', amount: 0, unit: '' },
      ],
    },
  ],

  steps: [
    {
      heading: 'Before you start',
      items: [
        'Bring a large pot of well-salted water to the boil for the pasta.',
        'Slice the spring onions and put them in a small heatproof bowl. Mince the garlic and grate the ginger if using.',
        'If your prawns are head-on, pull off the heads and shells and keep them, setting the peeled bodies aside. If you are using frozen peeled prawns, just thaw them and skip ahead.',
      ],
    },
    {
      heading: 'Build the flavour',
      items: [
        'Heat the neutral oil in a pan until shimmering. If you have prawn heads and shells, fry them over medium-high heat for 5 to 10 minutes, pressing down with a spoon to squeeze out the sweet orange juices, until deep red and toasty. Scoop out and discard the shells, leaving that flavoured oil behind in the pan.',
        'Spoon a tablespoon or two of the hot oil over the sliced spring onions so they sizzle and soften into a fragrant spring onion oil. Set the bowl aside.',
        'Return the pan to the heat, add the tomato paste and fry for a minute until it darkens and smells sweet. Stir in the garlic, ginger and chili flakes and cook until fragrant, about 30 seconds.',
      ],
    },
    {
      heading: 'Cook and bring together',
      items: [
        'Meanwhile, cook the pasta until just al dente. Scoop out about half a cup of the starchy pasta water before you drain it.',
        'Add the prawns to the pan and cook for 2 to 3 minutes, until just pink and opaque. Do not let them go further or they turn rubbery.',
        'Pour in the light soy, and the dark soy if using. Add the drained pasta with a splash of the reserved pasta water, then toss hard so the starchy water emulsifies the soy and prawn oil into a glossy sauce that clings to every strand. Loosen with a little more pasta water if it looks dry.',
        'Take the pan off the heat and finish with the sesame oil and most of the spring onion oil, tossing to coat. Taste, then season with salt and pepper. Serve straight away, scattered with the last of the spring onions.',
      ],
    },
  ],

  nutrition: { calories: 640, protein: 42, carbs: 70, fat: 22 },
  flavorProfile: { sweet: 2, salty: 4, sour: 1, bitter: 1, umami: 5, spicy: 2 },

  isVegetarian: false,
  isVegan: false,
  isGlutenFree: false,
  isDairyFree: true,

  quote:
    'A plate that lives between two kitchens: bronze-cut spaghetti tossed in soy, sesame, and the sweet oil pressed from prawn heads.',
  description:
    'This is my weeknight fusion of an Italian pasta and a Chinese wok dinner. The whole dish turns on one move, frying the prawn heads until their sweet orange oil releases and then building everything in that same pan, so a small amount of soy and sesame goes a long way. Seek out a rough, bronze-cut spaghetti or linguine if you can, because there is not much sauce here and you want every strand to hold onto it.',
  attribution: 'A Nieves\'s Kitchen original',

  headnoteIngredients:
    'Head-on prawns make the dish, but peeled frozen prawns work too. Go for bigger prawns rather than small shrimp.',

  tips: [
    'Head-on prawns are worth it: frying the heads and pressing out their orange oil is where the deep, sweet seafood flavour comes from. No heads is fine, frozen peeled prawns still make a good dish, just a leaner one.',
    'Reserve the starchy pasta water. Since there is so little sauce, that splash is what emulsifies the soy and oil into a glossy coat rather than a dry toss.',
    'Choose a rough, bronze-cut pasta (De Cecco is easy to find). The textured surface grips the light sauce far better than a smooth, slick spaghetti.',
    'Sesame oil goes in off the heat, at the very end. It is a finishing oil and turns bitter if you fry with it.',
    'Chili flakes are to taste. Start with a teaspoon and add more if you like real heat.',
    'Soy sauce is the one thing to check: traditionally brewed soy sauces carry a trace of fermentation alcohol, so reach for a halal-certified soy sauce to keep the dish fully halal. Many supermarket brands are certified.',
  ],

  substitutions: [
    'No dark soy sauce? Use all light soy. You lose a little colour and depth, but the dish still works.',
    'Linguine, bucatini, or thick wheat noodles all stand in for spaghetti, as long as they have some texture to hold the sauce.',
  ],

  variations: [
    'Add a handful of greens (spinach or choi sum) to wilt in with the pasta for a one-bowl meal.',
  ],

  storage:
    'Best eaten straight away, while the prawns are juicy and the pasta glossy. Leftovers keep in the fridge for a day; reheat gently with a splash of water, knowing the prawns will firm up the second time around.',

  dropcap: true,

  image: 'https://images.unsplash.com/photo-1673789274287-5441868398cc?w=2400&q=85',
  imageIsStock: true,
};

export default recipe;
