// data/recipes/honey-soy-salmon.ts
import type { RecipeInput } from './_types';

const recipe: RecipeInput = {
  title: 'Honey Soy Salmon on Mash',
  featuredIngredients: ['honey'],
  category: 'main',
  difficulty: 'Easy',
  servings: 1,
  time: { active: 25, total: 35 },
  yield: '1 plate',
  tags: ['high-protein', 'single-serving', 'comfort food'],

  ingredients: [
    {
      heading: 'The salmon',
      items: [
        { name: 'skin-on salmon fillet', amount: 1, unit: '' },
        { name: 'neutral oil', amount: 1, unit: 'tbsp' },
        { name: 'garlic cloves, roughly chopped quite small', amount: 3, unit: '' },
        { name: 'fresh ginger, grated', amount: 1, unit: 'tsp' },
        { name: 'spring onions, whites and greens sliced separately', amount: 2, unit: '' },
        { name: 'salt and black pepper', amount: 0, unit: '' },
      ],
    },
    {
      heading: 'The glaze',
      items: [
        { name: 'light soy sauce', amount: 4, unit: 'tbsp' },
        { name: 'honey', amount: 1.5, unit: 'tbsp' },
        { name: 'chili oil, with some of its crispy bits', amount: 1, unit: 'tsp' },
      ],
    },
    {
      heading: 'To serve',
      items: [
        { name: 'floury potato (e.g. Maris Piper), peeled and cut into chunks', amount: 200, unit: 'g' },
        { name: 'olive oil, for the mash (or butter, or a splash of milk)', amount: 1, unit: 'tsp' },
        { name: 'broccoli, cut into florets', amount: 120, unit: 'g' },
        { name: 'toasted sesame seeds', amount: 1, unit: 'tsp' },
        { name: 'lime, cut into wedges', amount: 0.5, unit: '' },
      ],
    },
  ],

  steps: [
    {
      heading: 'Before you start',
      items: [
        'Put the potato chunks in a pan, cover with cold salted water and bring to the boil. Simmer for 15 to 20 minutes, until a knife slides straight through. They look after themselves while you do everything else.',
        'Stir the soy sauce, honey and chili oil together in a small bowl until the honey dissolves. Chop the garlic, grate the ginger, and slice the spring onions, keeping the whites and greens apart.',
        'Pat the salmon very dry, especially the skin, and season it lightly with salt and pepper. Nothing else: the flavour comes from the glaze.',
        'Fold a sheet of foil into a little dish that fits the fillet snugly, with sides high enough to hold the glaze. Heat the air fryer to 170°C, or the oven to 180°C (160°C fan).',
      ],
    },
    {
      heading: 'Sear and glaze',
      items: [
        'Heat the oil in a frying pan over medium-high heat. Lay the salmon in skin-side down, press it flat for the first 10 seconds so the skin does not curl, then leave it alone for 3 to 4 minutes, until the skin is crisp and golden.',
        'Turn the fillet to give each flesh side 30 seconds to a minute, just enough to colour it. The middle should still be underdone, around two thirds cooked. The air fryer finishes it.',
        'Turn the heat to medium and scatter the spring onion whites, garlic and ginger around the fish. Cook for about a minute, until fragrant and only just turning golden. They get another round of heat later, so do not let them brown.',
        'Pour in the glaze. It will bubble hard straight away. Let it reduce for about 2 minutes, spooning it over the salmon, until it thickens slightly, then turn off the heat.',
      ],
    },
    {
      heading: 'Finish in the air fryer',
      items: [
        'Set the salmon in its foil dish on its side, so you can see both the flesh and the skin and the skin keeps crisping. Pour every bit of the glaze, garlic, ginger and spring onion over the top.',
        'Air fry at 170°C for about 7 minutes, or give it 8 to 10 minutes in the oven. Every machine runs differently, and if yours runs hot, drop it to 150 or 160°C. The garlic on top will burn before the salmon is done otherwise, and burnt garlic is bitter. It is ready when the flesh flakes under a gentle press and the glaze has reduced again into a sticky sauce.',
        'While it cooks, drop the broccoli into a pan of boiling salted water for exactly 4 minutes, then drain. It should still be bright green with some crunch.',
      ],
    },
    {
      heading: 'To the plate',
      items: [
        'Drain the potato, let it steam dry for a minute, then mash it with the olive oil. Season lightly if at all, because the salmon and glaze bring plenty of salt.',
        'Spoon the mash onto a plate and set the salmon on top. Scrape every last drop of glaze out of the foil and over the fish, scatter over the spring onion greens and sesame seeds, and put the broccoli alongside. Squeeze the lime over just before you eat: a little sharpness is what keeps the sweet, salty glaze from getting heavy.',
      ],
    },
  ],

  nutrition: { calories: 785, protein: 42, carbs: 78, fat: 34 },
  flavorProfile: { sweet: 3, salty: 4, sour: 1, bitter: 0, umami: 5, spicy: 1 },

  isVegetarian: false,
  isVegan: false,
  isGlutenFree: false,
  isDairyFree: true,

  quote:
    'Crisp-skinned salmon under a soy and honey glaze reduced twice, then poured, every drop of it, over a soft bed of mash.',
  description:
    'This is the salmon I make when I want dinner to taste like far more effort than it was. The fish cooks twice: a hard sear in the pan for crisp skin, then a gentle finish in the air fryer under a glaze of soy, honey and chili oil, which reduces once in the pan and again around the fish. The salmon itself gets nothing but salt and pepper, because the glaze, the garlic and the spring onion do all the talking. It goes on top of a plain mash with some crunchy broccoli on the side, and the mash is really there to catch the sauce.',
  attribution: 'A Nieves\'s Kitchen original',

  headnoteIngredients:
    'Buy salmon with the skin on, because the skin is half the point. Any floury potato mashes well, and sweet potato works too.',
  headnoteInstructions:
    'Get the potato on first and it will be ready just as the salmon comes out. The pan is only there to crisp the skin, so take the salmon out of it while the middle is still underdone.',

  equipment: [
    'An air fryer or an oven to finish the salmon. Either works, the air fryer is just a little quicker.',
    'Kitchen foil, folded into a small dish that holds the salmon and its glaze. A small ovenproof dish does the same job.',
  ],

  tips: [
    'A dry fillet is a crisp fillet. Pat the skin with kitchen paper until it feels tacky before it goes in the pan.',
    'Do not cook the salmon through in the pan. It finishes in the air fryer, and fully cooked salmon that goes back into the heat turns dry and chalky.',
    'Make more glaze than you think you need. It reduces twice, the flavour is strong and good, and nobody has ever complained about too much of it on their mash.',
    'Keep the air fryer moderate. Garlic and spring onion sit right on top of the fish, and burnt garlic is the one thing that can spoil the plate.',
    'Go easy on salt in the mash. The glaze is already salty and full of umami, so the potato is there to soften it, not compete.',
    'Soy sauce is the one thing to check: traditionally brewed soy sauces carry a trace of fermentation alcohol, so reach for a halal-certified soy sauce to keep the dish fully halal. Many supermarket brands are certified.',
  ],

  substitutions: [
    'Sweet potato mashes just as well as regular potato and leans into the honey in the glaze.',
    'Olive oil, butter or a splash of milk all work in the mash. Olive oil keeps the plate dairy-free.',
    'Use tamari in place of soy sauce for a gluten-free plate.',
    'No lime? A teaspoon of rice vinegar stirred into the glaze does the same job of cutting through the honey and soy.',
    'No chili oil? A pinch of chili flakes in the glaze does the job, or leave it out for a milder plate.',
  ],

  variations: [
    'For two, double everything and fold a foil dish for each fillet, so each one keeps its share of the glaze.',
    'Save a pan: drop the broccoli into the potato water for its last 4 minutes and lift it out with a slotted spoon before you drain the potatoes.',
  ],

  storage:
    'Best eaten straight away, while the skin is crisp. Leftover salmon keeps in a sealed container in the fridge for a day. Reheat it gently, or flake it cold.',

  dropcap: true,

  image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=2400&q=85',
  imageIsStock: true,
};

export default recipe;
