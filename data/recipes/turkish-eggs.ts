// data/recipes/turkish-eggs.ts
import type { RecipeInput } from './_types';

const recipe: RecipeInput = {
  title: 'Turkish Eggs',
  country: 'Turkey',
  category: 'main',
  difficulty: 'Easy',
  servings: 2,
  time: { active: 25, total: 30 },
  yield: 'Serves 2, with 2 poached eggs each',
  tags: ['quick', 'comfort food', 'high-protein', 'vegetarian', 'budget-friendly'],

  region: 'Middle East',
  coordinates: { lat: 39.0, lng: 35.0 },

  ingredients: [
    {
      heading: 'Garlic yogurt',
      items: [
        { name: 'full-fat yogurt, at room temperature', amount: 250, unit: 'g' },
        { name: 'garlic clove, grated or crushed', amount: 1, unit: '' },
        { name: 'salt, to taste', amount: 0, unit: '' },
      ],
    },
    {
      heading: 'Tomato and onion base',
      items: [
        { name: 'good olive oil', amount: 2, unit: 'tbsp' },
        { name: 'onions, thinly sliced', amount: 2, unit: '' },
        { name: 'cherry tomatoes, halved', amount: 250, unit: 'g' },
        { name: 'harissa', amount: 1, unit: 'tbsp' },
        { name: 'chili flakes (pul biber if you have it)', amount: 1, unit: 'tsp' },
        { name: 'salt and black pepper, to taste', amount: 0, unit: '' },
      ],
    },
    {
      heading: 'To poach and finish',
      items: [
        { name: 'eggs', amount: 4, unit: '' },
        { name: 'white vinegar or apple cider vinegar (for the poaching water)', amount: 1, unit: 'tbsp' },
        { name: 'butter', amount: 1.5, unit: 'tbsp' },
        { name: 'sweet paprika', amount: 0.5, unit: 'tsp' },
        { name: 'chili flakes (pul biber if you have it)', amount: 0.5, unit: 'tsp' },
        { name: 'cayenne pepper, a pinch (optional, for more heat)', amount: 0, unit: '' },
        { name: 'fresh dill, chopped (optional)', amount: 0, unit: '' },
        { name: 'freshly cracked black pepper, to finish', amount: 0, unit: '' },
      ],
    },
    {
      heading: 'To serve',
      items: [
        { name: 'crusty sourdough bread', amount: 0, unit: '' },
      ],
    },
  ],

  steps: [
    {
      heading: 'Before you start',
      items: [
        'Take the yogurt out of the fridge so it comes to room temperature. Cold yogurt under hot eggs is the one thing to avoid here, so give it a head start while you cook.',
        'Thinly slice the onions, halve the cherry tomatoes, and grate or crush the garlic.',
      ],
    },
    {
      heading: 'Garlic yogurt',
      items: [
        'Stir the room-temperature yogurt together with the grated garlic and a good pinch of salt. Set it aside on the counter so it stays cool but not fridge-cold.',
      ],
    },
    {
      heading: 'Tomato and onion base',
      items: [
        'Warm the olive oil in a frying pan over medium-low heat. Add the sliced onions with a pinch of salt and cook them down slowly, stirring now and then, until soft, sweet, and lightly golden. Take your time here. The slow sauté is what gives the base its depth, so let it go 10 to 15 minutes rather than rushing the colour.',
        'Add the halved cherry tomatoes and cook until they slump and break down into the onions, releasing their juice.',
        'Stir in the harissa and chili flakes and cook for another minute or two until the base smells fragrant and looks jammy rather than watery. Season with salt and pepper to taste, then keep it warm in the pan.',
      ],
    },
    {
      heading: 'Poach the eggs',
      items: [
        'Bring a wide saucepan of water to a gentle simmer and add the vinegar. Crack each egg into a small cup first.',
        'Stir the water with a spoon to create a gentle vortex, then slide one egg into the middle. Poach for about 2 to 3 minutes, until the white is set but the yolk is still runny, then lift it out with a slotted spoon onto a piece of kitchen paper. Repeat with the rest, one or two at a time.',
      ],
    },
    {
      heading: 'The spiced drizzle',
      items: [
        'In a small pan, melt the butter over medium-low heat, then stir in the paprika and chili flakes. Let it foam and turn fragrant, swirling so the spices bloom into the butter and turn it a deep rust-red, without letting them catch. Add a pinch of cayenne here too if you want more heat.',
      ],
    },
    {
      heading: 'Assemble',
      items: [
        'Spread the garlic yogurt across the base of two shallow bowls or plates.',
        'Spoon the warm tomato and onion base over the yogurt, then nestle two poached eggs into each.',
        'Drizzle the spiced butter over the top, scatter with dill if using, and finish with plenty of freshly cracked black pepper. Serve straight away with crusty sourdough for scooping and breaking into the runny yolks.',
      ],
    },
  ],

  nutrition: { calories: 440, protein: 21, carbs: 16, fat: 33 },
  flavorProfile: { sweet: 2, salty: 2, sour: 3, bitter: 1, umami: 3, spicy: 3 },

  isVegetarian: true,
  isVegan: false,
  isGlutenFree: false,
  isDairyFree: false,

  quote:
    'Cool, garlicky yogurt under a jammy tangle of slow-cooked onions and tomatoes, with two runny-yolked eggs to break over the top.',
  description:
    'This is my take on Turkish eggs. The classic version, çılbır, is poached eggs over cold garlic yogurt with a spiced butter drizzle, and that runny-yolk-meets-tangy-yogurt idea is the heart of it. I build on it with a slow-cooked base of onions and cherry tomatoes, somewhere between çılbır and menemen, so every spoonful has sweetness and warmth alongside the cool yogurt. It comes together fast once the onions are down, and a piece of good sourdough makes it.',
  attribution: 'A Nieves Kitchen take on Turkish çılbır',

  headnoteIngredients:
    'The yogurt does a lot of work, so use a good full-fat one and let it come to room temperature first. For lighter eating a low-fat yogurt works too. The paprika in the spiced butter is what gives the drizzle its warm colour and depth, so do not leave it out, and add a pinch of cayenne if you like more heat. If you can find pul biber (Aleppo pepper), it gives a milder, fruitier heat than ordinary chili flakes, but either is good. The harissa is optional but I really encourage it.',
  headnoteInstructions:
    'The only thing that needs patience is the onions. Cook them low and slow until they are soft and sweet, and the rest of the dish falls into place quickly around them.',

  tips: [
    'Bring the yogurt to room temperature before you start. Cold yogurt against hot eggs is the classic mistake with this dish.',
    'Give the onions time. A slow sauté until they are soft and golden is what builds the depth of the base, so resist turning the heat up.',
    'For neat poached eggs, add a splash of vinegar to the simmering water and stir a gentle vortex before sliding the egg into the middle.',
    'Pull the eggs at 2 to 3 minutes so the yolks stay runny. They keep cooking a little once out of the water.',
    'Do not skip the spiced butter drizzle. Blooming the paprika and chili in foaming butter for a moment gives it that warm rust-red colour and carries the spice across the whole bowl.',
  ],

  substitutions: [
    'Swap the full-fat yogurt for a low-fat one for a lighter version. It will be a touch less rich but still works.',
    'No harissa? Lean on the chili flakes alone, or use a little rose harissa for a softer, more floral heat.',
    'For a dairy-lighter finish, drizzle good olive oil bloomed with the chili instead of the butter.',
    'The dish itself is gluten-free if you serve it without the bread, or swap in a gluten-free loaf.',
  ],

  variations: [
    'For a purist çılbır, skip the tomato and onion base entirely and serve the poached eggs straight on the garlic yogurt with just the spiced butter.',
    'Swap the dill for fresh mint or parsley, or use a mix.',
  ],

  storage:
    'Best eaten fresh, while the eggs are runny and the butter is warm. If you want to get ahead, the tomato and onion base keeps in the fridge for 2 to 3 days. Reheat it gently, then poach the eggs and stir up the garlic yogurt fresh when you are ready to eat.',

  dropcap: true,

  image: '/recipes/turkish-eggs-hero.webp',
  imageIsStock: false,
  images: [
    {
      url: '/recipes/turkish-eggs-hero.webp',
      caption: 'Poached eggs over garlic yogurt, under slow-cooked onions and tomatoes, with sourdough to scoop',
      width: 1038,
      height: 1300,
    },
  ],
};

export default recipe;
