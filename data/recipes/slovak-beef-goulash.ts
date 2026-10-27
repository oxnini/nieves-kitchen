// data/recipes/slovak-beef-goulash.ts
import type { RecipeInput } from './_types';

const recipe: RecipeInput = {
  title: 'Slovak Beef Goulash',
  country: 'Slovakia',
  featuredIngredients: ['beef'],
  category: 'main',
  difficulty: 'Medium',
  servings: 5,
  time: { active: 75, total: 270 },
  yield: '5 generous bowls',
  tags: ['high-protein', 'comfort food', 'meal-prep friendly', 'weekend feast'],

  region: 'Eastern Europe',
  coordinates: { lat: 48.7363, lng: 19.1462 },
  influences: ['Slovakia', 'Hungary'],

  ingredients: [
    {
      heading: 'The onion base',
      items: [
        { name: 'onions, about two thirds yellow and one third red, finely chopped', amount: 900, unit: 'g' },
        { name: 'neutral oil or beef dripping', amount: 2, unit: 'tbsp' },
        { name: 'red pepper, cut into thin strips', amount: 1, unit: '' },
        { name: 'green pepper, cut into thin strips', amount: 1, unit: '' },
        { name: 'tomato purée', amount: 1.5, unit: 'tbsp' },
      ],
    },
    {
      heading: 'The beef and spices',
      items: [
        { name: 'beef shin, cut into large chunks of about 5cm', amount: 1000, unit: 'g', note: 1 },
        { name: 'neutral oil, for browning', amount: 1, unit: 'tbsp' },
        { name: 'good sweet Hungarian paprika', amount: 3, unit: 'tbsp', note: 2 },
        { name: 'caraway seeds, lightly crushed', amount: 1, unit: 'tsp' },
        { name: 'dried marjoram, divided', amount: 2, unit: 'tsp' },
        { name: 'chili flakes or hot paprika, optional', amount: 0.5, unit: 'tsp' },
        { name: 'beef stock, plus a little water for topping up', amount: 750, unit: 'ml', note: 3 },
        { name: 'salt and white pepper', amount: 0, unit: '' },
      ],
    },
    {
      heading: 'To finish',
      items: [
        { name: 'garlic cloves, crushed', amount: 3, unit: '' },
        { name: 'cider vinegar', amount: 1, unit: 'tsp', note: 4 },
        { name: 'crusty baguette, sliced', amount: 1, unit: '', note: 5 },
        { name: 'red onion, very thinly sliced, to garnish', amount: 0.5, unit: '' },
        { name: 'parsley or coriander, and sliced fresh green chili, optional', amount: 0, unit: '' },
      ],
    },
  ],

  steps: [
    {
      heading: 'The onions, low and slow',
      items: [
        'Heat the 2 tablespoons of oil in a large heavy pot over medium-low heat and add all the onions with a pinch of salt. This is the long part, and the most important one. Cook them for about 45 minutes, stirring every few minutes, until they go past golden and caramelised and collapse into a soft, very dark paste. The onions are what thicken the goulash, so do not rush them.',
        'Whenever they start to catch or brown too fast on the bottom, add a splash of water, scrape up anything stuck, and let it cook off before you carry on frying. You may do this several times.',
        'When the onions have almost taken on their full colour, stir in the pepper strips and cook for another 10 minutes, until they soften.',
      ],
    },
    {
      heading: 'Brown the beef',
      items: [
        'While the onions cook, pat the beef dry. Heat the tablespoon of oil in a heavy frying pan over high heat and brown the beef in two batches, so the chunks have room and sear rather than steam. Give each side a few minutes, until deeply browned, then lift them onto a plate and salt them. Salt goes on after browning, not before.',
        'Pour a ladle of the stock into the hot pan and scrape up every browned bit from the bottom. That is a lot of the flavour. Keep this liquid for the pot.',
      ],
    },
    {
      heading: 'Paprika, then the long simmer',
      items: [
        'Stir the tomato purée into the onions and cook for a minute or two, until it darkens a shade.',
        'Turn the heat off completely, or right down to its lowest setting. Stir in the paprika, the crushed caraway and half the marjoram for about 30 seconds, no longer. Paprika scorches easily and turns bitter, so this is the one moment to be careful.',
        'Straight away, add the beef with its resting juices, the liquid from the frying pan, the chili if you are using it, and enough of the remaining stock to come up to just below the top of the meat, so only the very tops of the chunks peek out. Season with salt and white pepper.',
        'Bring it to a gentle simmer, then turn the heat to low, set the lid on slightly ajar, and let it blip away for 2½ to 3 hours, stirring now and then, until the shin is soft enough to break with a spoon. Top up with a splash of water if it drops much below the meat.',
        'Short on time? Use a pressure cooker instead. Tip everything into it at this point, with the stock at the same level, and cook at high pressure for about 45 minutes for large chunks, then let the pressure come down naturally. It takes the whole recipe from about 4½ hours down to about 2¼ (see note 6).',
        'If it still looks thin when the beef is done, take the lid off for the last 15 to 20 minutes and let it bubble gently until it reduces to a thick soup.',
      ],
    },
    {
      heading: 'To the bowl',
      items: [
        'Turn off the heat. Stir in the crushed garlic, the rest of the marjoram and the cider vinegar, then taste and season properly with salt and white pepper. A pot this size takes more salt than you might think, and it is what makes every other flavour come forward.',
        'Let it sit for 10 minutes, then ladle into bowls. Top with the raw red onion, plus parsley, coriander or fresh green chili if you like, and serve with crusty baguette for dipping.',
      ],
    },
  ],

  nutrition: { calories: 610, protein: 50, carbs: 50, fat: 22 },
  flavorProfile: { sweet: 2, salty: 3, sour: 1, bitter: 1, umami: 4, spicy: 2 },

  isVegetarian: false,
  isVegan: false,
  isGlutenFree: false,
  isDairyFree: true,

  quote:
    'Nearly a kilo of onions cooked down past caramel into a dark paste, then good Hungarian paprika, beef shin and three slow hours.',
  description:
    'This goulash came to me from my husband\'s father, who is Slovak, and the whole recipe hangs on one instruction he was very firm about: cook the onions for far longer than feels right. Nearly a kilo of them goes into the pot and comes out, about 45 minutes later, as a soft dark paste that melts into the stock and thickens everything without any flour. After that it is good Hungarian paprika, a little caraway and marjoram, peppers, and beef shin left to simmer until it falls apart. Raw garlic goes in only at the very end, so it stays sharp and fresh against all that slow-cooked sweetness. It is a thick, brothy goulash, the kind you eat from a bowl with plenty of bread to wipe it clean.',
  attribution: 'My Slovak father-in-law\'s recipe',

  headnoteIngredients:
    'The paprika matters more than anything else here. Buy a sweet Hungarian one, ideally in a tin and not old, because supermarket paprika that has sat on a shelf for a year tastes of dust. Shin is the cut to use: it is cheap, and its sinew melts into the soup over the long simmer.',
  headnoteInstructions:
    'Brown the beef while the onions are cooking, so the time the onions take is not wasted. In a pot it takes about 4½ hours, most of it a gentle simmer you can leave alone, and a pressure cooker brings that down to about 2¼. Like most stews, it tastes even better the next day.',

  equipment: [
    'A large heavy-based pot with a lid, such as a casserole dish or Dutch oven. A thick base keeps the long onion fry and the three-hour simmer from catching.',
  ],

  tips: [
    'Take the onions further than you think. Golden is not enough. They should be very dark and almost jammy before the peppers go in, because this is where the depth comes from.',
    'Bring the stock up to just below the top of the meat, no higher. Too much liquid is the easiest way to get a thin, flat-tasting goulash, and you can always add more later.',
    'Be generous with the fat. Paprika gives up its colour and flavour in fat, not water, so a properly oiled pot gives you a redder, rounder goulash.',
    'Crush the caraway with the side of a knife or in a mortar. Whole seeds can get lost, while crushed ones season the whole pot.',
    'Season at the end, once it has reduced. Salt it early and you risk over-salting as the liquid cooks down.',
  ],

  notes: [
    'Beef: cheek or chuck work in place of shin. Chuck may be tender in 2 hours, so start checking earlier.',
    'Paprika: use 2 tablespoons instead of 3 for a milder pot.',
    'Stock: check the label, or buy a halal-certified beef stock or stock cubes.',
    'Cider vinegar: no cider vinegar? A squeeze of lemon at the end does the same job of lifting the richness.',
    'Gluten-free: the goulash itself has no gluten. Serve it with boiled potatoes or gluten-free bread instead of the baguette.',
    'Pressure cooker: brown the beef in it on its browning setting instead of the frying pan, and you save a pan to wash. If the goulash looks thin once the pressure is down, simmer it with the lid off for a few minutes before you add the garlic and marjoram.',
  ],

  variations: [
    'Coriander is not traditional here, but it is one of my favourite ways to finish it. A handful scattered over the top brings a fresh, green lift to all that paprika.',
    'For more heat, add a sliced fresh green chili with the garnish, or use some hot paprika in place of part of the sweet.',
    'Serve it the Slovak way with boiled potatoes or bread dumplings in place of the baguette.',
  ],

  storage:
    'Keeps in a sealed container in the fridge for 3 to 4 days and tastes better on the second day. It also freezes well for up to 3 months. Reheat gently on the hob with a splash of water, and add a little fresh garlic again if you like it sharp.',

  dropcap: true,

  image: '/recipes/slovak-beef-goulash-hero-3.webp',
  imageIsStock: false,
};

export default recipe;
