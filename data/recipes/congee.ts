// data/recipes/congee.ts
import type { RecipeInput } from './_types';

const recipe: RecipeInput = {
  title: 'Congee',
  country: 'China',
  category: 'main',
  difficulty: 'Easy',
  servings: 4,
  time: { active: 15, total: 50 },
  yield: 'Serves 4, or two big bowls with seconds',
  tags: ['one-pot', 'comfort food', 'budget-friendly'],

  region: 'East Asia',
  coordinates: { lat: 23.1291, lng: 113.2644 },

  ingredients: [
    {
      heading: 'The congee base',
      items: [
        { name: 'day-old cooked jasmine rice, fridge cold', amount: 400, unit: 'g' },
        { name: 'water', amount: 1200, unit: 'ml' },
        { name: 'chicken stock, optional, or use all water', amount: 400, unit: 'ml' },
        { name: 'ginger, cut into thick coins and smashed', amount: 4, unit: '' },
        { name: 'salt, plus more to taste at the end', amount: 1, unit: 'tsp' },
        { name: 'hot water, held back to loosen at the end', amount: 200, unit: 'ml' },
      ],
    },
    {
      heading: 'To finish',
      items: [
        { name: 'boneless, skinless chicken thighs, thinly sliced', amount: 400, unit: 'g' },
        { name: 'light soy sauce (halal-certified)', amount: 1, unit: 'tsp' },
        { name: 'white pepper', amount: 0.5, unit: 'tsp' },
        { name: 'cornflour', amount: 1, unit: 'tsp' },
      ],
    },
    {
      heading: 'To garnish, take what you like',
      items: [
        { name: 'light soy sauce (halal-certified), per bowl', amount: 1, unit: 'tbsp' },
        { name: 'toasted sesame oil, per bowl', amount: 1, unit: 'tsp' },
        { name: 'spring onions, finely sliced', amount: 3, unit: '' },
        { name: 'coriander, roughly chopped, a big handful', amount: 0, unit: '' },
        { name: 'ginger, finely julienned', amount: 0, unit: '' },
        { name: 'white pepper, plenty of it', amount: 0, unit: '' },
        { name: 'chilli crisp such as Lao Gan Ma, the plain soybean one, to taste', amount: 0, unit: '' },
        { name: 'crispy fried shallots or fried garlic slices', amount: 0, unit: '' },
        { name: 'roasted peanuts, roughly chopped', amount: 0, unit: '' },
        { name: 'zha cai (pickled mustard stem), finely chopped', amount: 0, unit: '' },
        { name: 'salt, to taste', amount: 0, unit: '' },
      ],
    },
  ],

  steps: [
    {
      heading: 'Before you start',
      items: [
        'Take the rice out of the fridge and break up the clumps with your fingers or the back of a spoon. Cold rice comes out of the container as one solid brick, and any lump you leave in now will still be a lump at the end.',
        'Cut the ginger into thick coins and flatten each one under the side of a knife. Smashing it opens it up so it gives more to the pot than a clean slice would.',
        'Slice the chicken thin, then toss it with the teaspoon of soy sauce, the white pepper and the cornflour. Leave it to sit while the congee cooks. The cornflour is what keeps it silky when it hits the hot pot.',
      ],
    },
    {
      heading: 'The congee',
      items: [
        'Put the rice, water, stock if you are using it, ginger and salt into a heavy pot. It will look like far too much liquid for that much rice. It is not.',
        'Bring it up to a boil. Put the lid on if you want it to get there faster, then take the lid off and leave it off for the rest of the cook.',
        'Turn it down to a steady simmer and cook uncovered for about 35 minutes, stirring every five to ten minutes and dragging the spoon right across the bottom of the pot each time.',
        'Around the 25 minute mark it stops looking like rice sitting in water and starts looking like porridge. From there it thickens quickly. Go longer if you want it smoother and more dissolved, stop earlier if you want the grains still holding their shape.',
        'Taste it now, before anything else goes in, and salt it properly. This is the seasoning that matters.',
      ],
    },
    {
      heading: 'Add the chicken',
      items: [
        'Scatter the chicken in a piece at a time so it does not land as one clump, and simmer for 4 to 5 minutes, just until the pink is gone. It goes from tender to stringy quickly, so pull it off the heat as soon as it is cooked through.',
        'Check the consistency. It should fall off the spoon in a slow ribbon. Loosen it with the hot water a splash at a time until it does, remembering that it tightens again in the bowl as it cools.',
        'Fish out the ginger coins now if you like, or leave them in for whoever finds them.',
      ],
    },
    {
      heading: 'Build the bowl',
      items: [
        'Ladle into bowls. Start with the soy sauce and sesame oil, roughly a tablespoon of soy and a teaspoon of oil per bowl, and stir them through.',
        'Pile on the soft things: coriander, spring onion, julienned ginger, a heavy hand of white pepper, and chilli crisp if you want the heat.',
        'Add the crunch last so it stays crunchy. Fried shallots, fried garlic slices, chopped peanuts, zha cai. Eat it hot.',
      ],
    },
  ],

  nutrition: { calories: 370, protein: 24, carbs: 31, fat: 16 },
  flavorProfile: { sweet: 1, salty: 3, sour: 0, bitter: 0, umami: 4, spicy: 1 },

  isVegetarian: false,
  isVegan: false,
  isGlutenFree: false,
  isDairyFree: true,

  quote: 'The best possible thing to do with last night\'s rice, and the thing you want most when you are cold, tired, or coming down with something.',
  description:
    'Congee is what a pot of rice becomes when you give it far more water than seems reasonable and most of an hour to think about it. Every rice-eating country keeps its own version. Cantonese jook sits at the silkiest end of the scale, where the grains dissolve away entirely, Teochew muay keeps them loose and separate in a thin broth, and the same idea turns up as okayu in Japan, juk in Korea and lugaw in the Philippines. This is the weeknight one, built on day-old rice from the back of the fridge, which brings it down to about 35 minutes of mostly ignoring a pot. It is traditionally breakfast, and it is very good as breakfast, but it is just as welcome at eleven at night. Mostly it is the answer to leftover rice on the evenings you cannot face making fried rice again.',
  attribution: 'A Nieves\'s Kitchen staple',

  headnoteIngredients:
    'The base is rice, water, ginger and salt. Everything below that line is a decision you make standing at the pot, so read the garnish list as a menu rather than a shopping list and use whatever is already in the fridge.',
  headnoteInstructions:
    'Nothing here needs watching closely. Stir it whenever you walk past the pot and let the rice do the work.',

  equipment: [
    'A heavy pot with a thick base. Congee settles and scorches in a thin pan, so the heavier the base, the less you have to stand over it.',
  ],

  tips: [
    'Cook it uncovered. A lid is useful to hurry the first boil along, but take it off after that or the pot will climb over the sides the moment your back is turned.',
    'Stir every five to ten minutes and scrape the base of the pot each time. Starch sinks, catches and burns, and burnt congee is not something you can season your way out of.',
    'Hold back a mug of hot water for the end. It sets much thicker in the bowl than it looks in the pot, and cold tap water knocks the heat out of the whole thing.',
    'Salt the pot, not just the bowl. Soy sauce at the table seasons the top spoonful and nothing underneath it.',
    'White pepper, not black. They are not interchangeable here. White is warm and faintly floral and belongs in this bowl. Black just turns it muddy.',
    'Use ginger twice: thick smashed coins in the pot for warmth, then a little raw julienne on top for the bite.',
    'Starting from raw rice instead? Freeze it first. Rinse it, freeze it in a bag, then cook it straight from frozen. The ice cracks the grains open and cuts the simmer down to 10 or 15 minutes.',
  ],

  substitutions: [
    'No stock, no problem. Water, enough salt and plenty of ginger is the version most people actually make at home, and it is the one in the photograph.',
    'Chilli crisp such as Lao Gan Ma is the classic spoonful here, but check the jar before you buy. The plain soybean one is what you want. The range also includes a beef version, and that beef is not halal-slaughtered.',
    'Any long-grain white rice works. Jasmine breaks down the most kindly, but leftover basmati or plain long-grain will get you there.',
    'Swap the soy sauce for tamari and the whole bowl is gluten free.',
  ],

  variations: [
    'Chicken: the traditional one, and the easiest, because it does not depend on you having cooked something else first. Sliced thigh tossed with soy, white pepper and cornflour, into the pot for the last four or five minutes. This is the version written above.',
    'Leftover meatballs: my favourite of the lot, better than the chicken if I am honest about it. Drop leftover [Gochujang Beef Meatballs](/recipes/gochujang-beef-meatballs) in whole for the last five minutes and let them warm through and give a little of their glaze back to the pot.',
    'Minced beef: season it first, then crumble it in raw over the last five minutes, breaking it up as it goes in so it stays loose rather than setting into lumps.',
    'An egg: crack one straight into the pot four or five minutes before you take it off the heat and then leave it completely alone. It sets soft with a runny middle. Give it longer if you like it firm.',
    'From raw rice: 1 part rice to 8 parts liquid by volume, simmered for an hour to an hour and a half. More fragrant than the leftover version, and a different sort of afternoon entirely.',
    'Century egg: the most classic Cantonese bowl there is. Quartered and stirred through at the end, it turns the whole pot deep and savoury. It is an acquired taste, so this one is for you only if you already know you love it.',
    'Sweet potato or pumpkin: leftover roasted chunks stirred in near the end melt down into the rice and lend a low sweetness that plays beautifully against the soy and the white pepper. Still very much a savoury bowl.',
  ],

  storage:
    'Best on the day, which is usually how it goes anyway. Anything left over sets almost solid in the fridge, and that is normal rather than a sign something went wrong. It keeps covered for 3 days, and comes back with a splash of hot water over a low heat, stirred until it loosens.',

  dropcap: true,

  image: '/recipes/congee-hero.webp',
  imageIsStock: false,

  images: [
    {
      url: '/recipes/congee-chicken.webp',
      caption: 'The chicken version, loose in the grain, with more coriander and spring onion than looks sensible.',
      width: 1200,
      height: 1600,
    },
    {
      url: '/recipes/congee-meatball-egg.webp',
      caption: 'Leftover meatballs, an egg cracked in near the end, and a good spoonful of chilli crisp.',
      width: 1200,
      height: 1600,
    },
  ],
};

export default recipe;
