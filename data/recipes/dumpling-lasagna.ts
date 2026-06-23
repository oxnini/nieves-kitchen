// data/recipes/dumpling-lasagna.ts
import type { RecipeInput } from './_types';

const recipe: RecipeInput = {
  title: 'Dumpling Lasagna',
  country: 'China',
  category: 'main',
  difficulty: 'Easy',
  servings: 2,
  time: { active: 20, total: 35 },
  yield: '1 steaming bowl, 2 portions',
  tags: ['comfort food', 'high-protein', 'one-pot', 'budget-friendly', 'fusion'],

  region: 'East Asia',
  coordinates: { lat: 39.9, lng: 116.4 },

  ingredients: [
    {
      heading: 'Seasoned filling',
      items: [
        { name: 'beef mince (or lamb, or a beef and chicken mix)', amount: 400, unit: 'g' },
        { name: 'light soy sauce', amount: 1, unit: 'tbsp' },
        { name: 'dark soy sauce (optional, recommended)', amount: 0.5, unit: 'tbsp' },
        { name: 'sesame oil', amount: 1, unit: 'tsp' },
        { name: 'ginger, grated', amount: 1, unit: 'tbsp' },
        { name: 'garlic cloves, minced', amount: 3, unit: '' },
        { name: 'spring onions, chopped (plus more to garnish)', amount: 2, unit: '' },
        { name: 'coriander, chopped (plus more to garnish)', amount: 2, unit: 'tbsp' },
        { name: 'white pepper', amount: 0.5, unit: 'tsp' },
        { name: 'salt, to taste', amount: 0, unit: '' },
      ],
    },
    {
      heading: 'To layer',
      items: [
        { name: 'shop-bought dumpling wrappers (about a third of a 30-pack)', amount: 10, unit: '' },
        { name: 'Napa cabbage, shredded', amount: 300, unit: 'g' },
        { name: 'chicken or beef stock', amount: 150, unit: 'ml' },
      ],
    },
    {
      heading: 'To finish',
      items: [
        { name: 'Chinese chili oil (Lao Gan Ma, or Lee Kum Kee Chiu Chow)', amount: 1, unit: 'tbsp' },
        { name: 'light soy sauce', amount: 1, unit: 'tbsp' },
        { name: 'sesame oil', amount: 0.5, unit: 'tsp' },
        { name: 'rice vinegar (optional)', amount: 1, unit: 'tsp' },
        { name: 'fresh coriander and spring onion, chopped, to garnish', amount: 0, unit: '' },
      ],
    },
  ],

  steps: [
    {
      heading: 'Season the filling',
      items: [
        'In a bowl, combine the mince with the light soy sauce, dark soy sauce, sesame oil, grated ginger, minced garlic, chopped spring onions, chopped coriander, white pepper, and a good pinch of salt.',
        'Mix it well, stirring in one direction, until the meat tightens up and turns slightly sticky. That texture is what helps it hold together in clean layers rather than crumbling apart.',
      ],
    },
    {
      heading: 'Prep the cabbage and wrappers',
      items: [
        'Shred the Napa cabbage, either into small thin sheets or chopped fine. Both work, since it softens and melts into the meat as it steams. You can fold it through the seasoned meat now, or keep it separate to layer on top as you build. It all combines and cooks together either way.',
        'Have your dumpling wrappers ready. If you can only find wonton wrappers they will do in a pinch, but they are thinner and tend to come apart in the steam, so dumpling wrappers are worth seeking out.',
      ],
    },
    {
      heading: 'Layer it like a lasagna',
      items: [
        'Take a medium heatproof bowl. Spread a layer of the seasoned meat across the bottom, then a layer of Napa cabbage on top (or use the meat you already mixed the cabbage into).',
        'Lay a dumpling wrapper flat over the filling to cover it like a pasta sheet. Repeat the meat, cabbage, and wrapper layers about three times, building it up.',
        'Finish with a dumpling wrapper as the very top layer.',
        'Pour the stock gently down the side of the bowl until it comes at least halfway up. Add a little more if you like it brothier; the meat will release more liquid as it cooks, and the broth is half the joy of this dish.',
      ],
    },
    {
      heading: 'Steam',
      items: [
        'Set up a steamer: bring a few centimetres of water to a boil in a large pot or wok, and place a trivet or an upturned heatproof dish inside to support the bowl so it sits level and does not tilt.',
        'Lower the bowl in, cover, and steam over a steady boil for 12 to 15 minutes, until the meat is cooked through and the wrappers are tender and translucent. A taller build with more meat needs the full 15. Do not steam much longer, or the meat toughens.',
      ],
    },
    {
      heading: 'Finish and serve',
      items: [
        'Carefully lift the bowl out, it is hot and heavy. Scatter over fresh coriander and spring onion.',
        'Spoon over the chili oil, the soy sauce, and the sesame oil, along with the rice vinegar if using. Serve straight from the bowl while it is steaming hot, spooning some of the broth over each portion.',
      ],
    },
  ],

  nutrition: { calories: 560, protein: 42, carbs: 30, fat: 28 },
  flavorProfile: { sweet: 1, salty: 4, sour: 1, bitter: 0, umami: 4, spicy: 2 },

  isVegetarian: false,
  isVegan: false,
  isGlutenFree: false,
  isDairyFree: true,

  quote: 'A weeknight invention for when you want dumplings but not the hour of pleating: all the soul of a plate of jiaozi, layered up like a lasagna and steamed in its own broth.',
  description:
    'This is what I make when I am craving dumplings but cannot face folding them one by one. Seasoned beef and Napa cabbage get layered between shop-bought dumpling wrappers like a tiny lasagna, then steamed in a pour of stock until the wrappers turn silky and the whole thing sits in its own savoury broth. It comes together in one bowl, and the finishing drizzle of chili oil, soy, and sesame is what makes it sing.',
  attribution: 'A Nieves Kitchen original',

  headnoteIngredients:
    'Beef gives a cleaner broth; lamb is delicious but minced lamb is fatty, so the broth turns oilier. A beef and chicken mix is the leanest, most macro-friendly option. Reach for proper dumpling wrappers over wonton skins, which are too thin and tend to fall apart.',
  headnoteInstructions:
    'Two things matter: mix the meat until it is sticky so the layers hold, and pour the stock at least halfway up the bowl so it steams into a real broth rather than baking dry.',

  equipment: [
    'Medium heatproof bowl',
    'Large pot or wok with a lid',
    'Trivet or steamer rack to support the bowl',
    'Mixing bowl',
  ],

  tips: [
    'Beef gives a cleaner broth, lamb is richer but oilier since minced lamb carries a lot of fat. For a lighter, more macro-friendly version, use a mix of beef and chicken mince.',
    'Choose dumpling wrappers over wonton wrappers. Wonton skins are thinner and tend to come apart in the steam, while dumpling wrappers hold their shape and go pleasingly silky.',
    'Mix the seasoned meat in one direction until it feels sticky. That texture is what holds the layers together instead of letting them crumble.',
    'Pour the stock at least halfway up the bowl. The broth is half the joy here, and the meat releases more liquid as it steams, so do not be shy with it.',
    'Do not over-steam. 12 to 15 minutes is plenty. Longer just toughens the meat and turns the wrappers to mush.',
    'Use a wider, shallower bowl and keep the layers thin and even. It lets the steam reach the middle so you avoid a dense, soggy centre, and it stops you overpacking any single layer.',
    'Lay your very first layer against the bowl as cabbage rather than meat. It keeps the bottom from sticking and lifts out cleanly.',
    'Let it rest for about 5 minutes after steaming before you dig in. It settles enough to scoop or slice into neat portions instead of collapsing.',
    'The finishing drizzle is the whole personality of the dish. A good Chinese chili oil like Lao Gan Ma or Lee Kum Kee Chiu Chow, plus soy and a few drops of sesame oil, lifts it from plain to crave-worthy.',
  ],

  substitutions: [
    'Beef, lamb, or a beef and chicken mix all work. Lamb is the richest and oiliest, the mix is the leanest.',
    'No dark soy sauce is fine, though it adds colour and a deeper savoury note, so it is worth keeping if you have it.',
    'The rice vinegar is optional. It brightens the finish, but the dish is good without it.',
    'Wonton wrappers can stand in for dumpling wrappers if that is all you can find, just know they are more fragile in the steam.',
  ],

  variations: [
    'For a brothier, soup-like bowl, add more stock and serve it almost like a layered dumpling soup.',
    'For a macro-friendly version, use lean beef mince or chicken mince, which brings it well under 600 calories a serving. Lean meat carries less fat, so it can run dry, the fat is what keeps the classic juicy. Add a splash more stock and lean on the Napa cabbage for moisture to make up for it.',
    'A handful of finely chopped shiitake mushrooms folded into the filling adds moisture and a deeper savoury note, which is especially welcome when you go lean on the meat.',
  ],

  storage:
    'Best eaten fresh and steaming, while the wrappers are silky and the broth is hot. Leftovers keep covered in the fridge for a day or two. Re-steam or microwave with a splash of stock to bring the broth back, knowing the wrappers soften further as they sit.',

  dropcap: true,

  isFusion: true,
  inspiredBy: ['Chinese jiaozi (dumplings)', 'Italian lasagna'],

  image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=1200&q=80',
  imageIsStock: true,
};

export default recipe;
