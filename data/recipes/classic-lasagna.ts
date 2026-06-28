// data/recipes/classic-lasagna.ts
import type { RecipeInput } from './_types';

const recipe: RecipeInput = {
  title: 'Tomato and Beef Lasagna',
  country: 'Italy',
  category: 'main',
  difficulty: 'Medium',
  servings: 6,
  time: { active: 40, total: 75, resting: 10 },
  tags: ['comfort food', 'high-protein', 'meal-prep friendly', 'weekend feast', 'budget-friendly'],

  region: 'Western Europe',
  coordinates: { lat: 41.9, lng: 12.5 },

  ingredients: [
    {
      heading: 'Tomato and beef sauce',
      items: [
        { name: 'beef mince', amount: 800, unit: 'g' },
        { name: 'large onion, diced', amount: 1, unit: '' },
        { name: 'garlic cloves, minced', amount: 4, unit: '' },
        { name: 'tinned chopped tomatoes', amount: 800, unit: 'g' },
        { name: 'tomato sauce (passata)', amount: 500, unit: 'g' },
        { name: 'tomato paste', amount: 2, unit: 'tbsp' },
        { name: 'olive oil', amount: 2, unit: 'tbsp' },
        { name: 'sugar, to balance the tomatoes', amount: 1, unit: 'tsp' },
        { name: 'dried oregano', amount: 2, unit: 'tsp' },
        { name: 'salt and black pepper, to taste', amount: 0, unit: '' },
        { name: 'chili flakes or harissa (optional)', amount: 1, unit: 'tsp' },
      ],
    },
    {
      heading: 'To layer',
      items: [
        { name: 'dried lasagna sheets', amount: 12, unit: '' },
        { name: 'mozzarella, grated', amount: 400, unit: 'g' },
        { name: 'fresh mozzarella balls, thinly sliced (optional)', amount: 2, unit: '' },
        { name: 'dried oregano, to finish', amount: 1, unit: 'tsp' },
      ],
    },
  ],

  steps: [
    {
      heading: 'Before you start',
      items: [
        'Preheat the oven to 200°C (180°C fan / 400°F).',
        'If your lasagna sheets are the kind that need softening, slip them into a bowl of hot water now and keep them separated so they do not fuse into a lump while you prep. Lift them apart every so often.',
        'Dice the onion, mince the garlic, and grate the mozzarella.',
      ],
    },
    {
      heading: 'The tomato and beef sauce',
      items: [
        'Heat the olive oil in a large pan over medium-high heat. Add the beef mince and let it sear undisturbed for a minute before breaking it up, cooking until browned and almost cooked through. Keep the heat high enough that it sears rather than stews, so it should not release much liquid. Season with salt and pepper, then lift the beef out to a plate. Keep or spoon off the fat left in the pan, depending on your preference and nutrition goals.',
        'In the same pan, add the diced onion and cook until soft and translucent, scraping up the browned bits stuck to the pan. Stir in the garlic and cook until fragrant.',
        'Add the tomato paste and fry for a minute until it darkens and smells sweet. Stir in the chili flakes or harissa now if using.',
        'Return the beef to the pan, then pour in the tinned tomatoes and passata. Give it a gentle simmer for 5 to 10 minutes, until the sauce is thick but still loose enough that liquid easily seeps in when you press a spoon against it.',
        'Taste and balance: if the tomatoes are sharp or sour, add the sugar a pinch at a time until it rounds out. Adjust salt, pepper, and oregano. Keep the sauce warm in the pan while you assemble.',
      ],
    },
    {
      heading: 'Assemble and bake',
      items: [
        'Spread a thin layer of sauce across the bottom of a large oven-safe dish so the first sheets do not stick.',
        'Lay down a layer of lasagna sheets and smear them with a little sauce. Ladle over a generous layer of the meat sauce, then scatter a generous handful of grated mozzarella. If you like, tuck a few thin slices of fresh mozzarella between the layers here too.',
        'Repeat the layers three to four times until the ingredients run out, finishing with a layer of meat sauce.',
        'Blanket the top with a heavy layer of grated mozzarella, along with a few slices of fresh mozzarella, so it can crisp, and scatter over a little oregano.',
        'Bake in the middle of the oven for 20 to 25 minutes, until bubbling and the top is starting to crisp and turn golden.',
        'If the top has not taken colour and everything else is cooked, move the dish higher and broil (grill) for no more than 5 minutes. Stay at the oven and watch it closely; it goes from golden to burnt fast.',
        'Let the lasagna rest for about 10 minutes so it sets, finish with a last pinch of oregano, and serve.',
      ],
    },
  ],

  nutrition: { calories: 540, protein: 34, carbs: 38, fat: 27 },
  flavorProfile: { sweet: 2, salty: 3, sour: 2, bitter: 1, umami: 4, spicy: 1 },

  isVegetarian: false,
  isVegan: false,
  isGlutenFree: false,
  isDairyFree: false,

  quote: 'My lasagna for people who do not love creamy, cheesy things: no béchamel, no parmesan, just a deep tomato and beef sauce under a crisp mozzarella lid.',
  description:
    'This is my twist on lasagna. There is no béchamel and no parmesan here, because I am not a fan of really creamy, heavy bakes. Instead it leans entirely on a slow, well-balanced tomato and beef sauce, layered with just enough grated mozzarella to melt between the sheets and crisp into a golden lid on top. It is generous, comforting, and even better the next day.',
  attribution: 'A Nieves Kitchen original',

  equipment: [
    'A large oven dish, roughly 9 by 13 inches (a baking dish or roasting tin both work)',
  ],

  tips: [
    'If you soak your lasagna sheets, keep them separated as they sit, lifting them apart now and then. Left in a lump they fuse together and tear when you try to layer them.',
    'Taste the sauce and balance it with a pinch of sugar at a time if your passata is sharp or sour. Keep tasting until it is rounded, not flat.',
    'Aim for a sauce that is thick but loose enough that liquid easily seeps in when you press a spoon to it. Too dry and the lasagna bakes stiff.',
    'Pile extra mozzarella on the very top layer so it crisps into a golden lid rather than just melting.',
    'Use oregano twice: a little scattered on top before baking, and a final pinch after it comes out of the oven.',
    'Be generous with mozzarella between every layer, and tuck in a few thin slices of fresh mozzarella as you go. The cheese knitting the layers together is what helps the lasagna set and hold its shape cleanly when you slice it, rather than sliding apart.',
  ],

  variations: [
    'For gentle heat, stir a teaspoon of chili flakes or a spoonful of harissa into the sauce with the tomato paste.',
  ],

  storage:
    'This keeps and reheats beautifully, which makes it ideal for meal prep. Cover and refrigerate for up to 3 to 4 days. To reheat, add a little extra mozzarella on top and microwave it covered, or warm it in the oven if you want the crisp top back.',

  dropcap: true,

  image: '/recipes/classic-lasagna-hero.webp',
  imageIsStock: false,
};

export default recipe;
