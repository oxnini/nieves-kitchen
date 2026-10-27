// data/recipes/kung-pao-chicken.ts
import type { RecipeInput } from './_types';

const recipe: RecipeInput = {
  title: 'Kung Pao Chicken',
  country: 'China',
  featuredIngredients: ['chicken'],
  category: 'main',
  difficulty: 'Easy',
  servings: 2,
  time: { active: 25, total: 35 },
  yield: 'Serves 2 with rice, or 3 to 4 as one of several dishes',
  tags: ['high-protein', 'spicy', 'quick', 'budget-friendly'],

  region: 'East Asia',
  coordinates: { lat: 30.66, lng: 104.07 },

  ingredients: [
    {
      heading: 'The chicken',
      items: [
        { name: 'boneless, skinless chicken thighs, cut into 1.5cm cubes', amount: 350, unit: 'g', note: 1 },
        { name: 'light soy sauce', amount: 1, unit: 'tsp', note: 2 },
        { name: 'fine salt', amount: 0.5, unit: 'tsp' },
        { name: 'cornflour', amount: 1.5, unit: 'tsp', note: 3 },
        { name: 'cold water', amount: 1, unit: 'tbsp' },
        { name: 'neutral oil', amount: 1, unit: 'tsp' },
      ],
    },
    {
      heading: 'The sauce',
      items: [
        { name: 'caster sugar', amount: 1, unit: 'tbsp' },
        { name: 'Chinkiang black vinegar', amount: 1, unit: 'tbsp', note: 4 },
        { name: 'light soy sauce', amount: 1, unit: 'tsp', note: 2 },
        { name: 'dark soy sauce', amount: 1, unit: 'tsp', note: 2 },
        { name: 'cornflour', amount: 1, unit: 'tsp', note: 3 },
        { name: 'toasted sesame oil', amount: 1, unit: 'tsp' },
        { name: 'water', amount: 2, unit: 'tbsp', note: 5 },
      ],
    },
    {
      heading: 'The stir-fry',
      items: [
        { name: 'roasted unsalted peanuts', amount: 75, unit: 'g' },
        { name: 'neutral oil, such as groundnut or vegetable', amount: 2, unit: 'tbsp' },
        { name: 'large dried red chilies (8 to 12), plus a few spare in case the first lot catches', amount: 10, unit: '', note: 6 },
        { name: 'Sichuan peppercorns', amount: 1, unit: 'tsp', note: 7 },
        { name: 'garlic cloves, thinly sliced', amount: 3, unit: '' },
        { name: 'fresh ginger, peeled and thinly sliced (about as much as the garlic)', amount: 10, unit: 'g' },
        { name: 'spring onions, whites cut into 1cm pieces, greens thinly sliced and kept apart', amount: 5, unit: '' },
      ],
    },
    {
      heading: 'To serve',
      items: [
        { name: 'steamed jasmine rice', amount: 0, unit: '' },
      ],
    },
  ],

  steps: [
    {
      heading: 'Before the wok goes on',
      items: [
        'Get the rice cooking first. Once the wok is hot the stir-fry takes under 10 minutes and never pauses, so the rice should be ready and waiting when it is.',
        'Put the chicken cubes in a bowl with the light soy sauce, salt, cornflour and the tablespoon of cold water. Massage it in with your fingers for about 30 seconds, until the liquid has disappeared and the pieces feel tacky. Then stir in the teaspoon of oil, which keeps the cubes from clumping together in the wok. Leave it for 15 minutes while you do everything else, or up to 2 hours in the fridge.',
        'Toast the peanuts in the dry wok over medium heat for 3 to 4 minutes, stirring all the time, until they turn a shade darker and smell toasty. Tip them onto a plate, where they crisp up further as they cool, and take the wok off the heat so it has cooled to just warm by the time you need it.',
        'Snip the chilies into 2cm pieces with scissors and shake out as many seeds as you can. Put them in a small bowl with the Sichuan peppercorns. Slice the garlic and ginger and cut the spring onions, keeping the whites and greens in separate piles.',
        'Stir all the sauce ingredients together in a small bowl until the sugar and cornflour have dissolved. Line everything up by the hob in the order it goes in. Set a small metal sieve over a heatproof bowl and put an empty saucer beside it for the chilies, with the plate of peanuts within reach.',
      ],
    },
    {
      heading: 'The chili oil',
      items: [
        'Pour the 2 tablespoons of oil into the cool wok and add the chilies and Sichuan peppercorns. Set it over medium heat and stir. After 1 to 2 minutes they start to sizzle gently. Keep stirring, and over the next 30 seconds to 1 minute the chilies turn from bright red to a deep, glossy burgundy, the oil goes orange and the kitchen smells toasty and peppery. Go by the colour, not the clock: that is the moment.',
        'Pull the wok off the heat straight away and tip the oil, chilies and peppercorns into the sieve over the bowl. Shake the chilies and peppercorns onto the saucer, then pour the red oil back into the wok. Straining catches every peppercorn, so none are left behind to scorch while the chicken cooks.',
        'If any chilies have gone black, or the smoke smells sharp and acrid, they are burnt, and that bitterness would run through the whole dish. Leave that oil in the bowl to cool and throw it away later, wipe the wok with kitchen paper and start again with fresh oil and the spare chilies. It costs a minute and saves the dish.',
      ],
    },
    {
      heading: 'The chicken',
      items: [
        'Put the wok back on high heat. When the oil shimmers and gives off its first wisp of smoke, after 30 seconds to 1 minute, add the chicken and spread it out in one layer. Leave it alone for 30 seconds so it takes a little colour underneath, then stir-fry, breaking up any clumps, until the cubes have separated and turned mostly white, about 1 minute.',
        'Add the garlic, ginger and spring onion whites and stir-fry for 1 to 2 minutes more, until the garlic smells sweet and the chicken is cooked through. Cut the biggest cube in half to check: no pink, clear juices, or 74°C in the middle on a probe thermometer.',
      ],
    },
    {
      heading: 'Sauce and peanuts',
      items: [
        'Tip the chilies and peppercorns back into the wok. Give the sauce a stir, since the cornflour sinks to the bottom, and pour it in. Toss over high heat for 30 seconds to 1 minute, until it thickens, turns dark and glossy, and clings to every piece with almost nothing pooling in the wok. If it tightens too far and starts to catch, add a splash of water.',
        'Take the wok off the heat. Tip in the peanuts and most of the spring onion greens, toss a couple of times, scatter over the rest of the greens and serve straight away with the rice. The chilies are there to flavour the oil: eat them if you like the heat, or leave them on the side of your plate.',
      ],
    },
  ],

  nutrition: { calories: 685, protein: 43, carbs: 21, fat: 48 },
  flavorProfile: { sweet: 2, salty: 3, sour: 2, bitter: 0, umami: 3, spicy: 3 },

  isVegetarian: false,
  isVegan: false,
  isGlutenFree: false,
  isDairyFree: true,

  quote:
    'Small cubes of chicken thigh in an oil scorched with dried chilies and Sichuan pepper, a glossy sauce that is sweet and sour at once, and peanuts tossed in at the last second so they still crunch.',
  description:
    'Gong bao ji ding is the Sichuan dish behind the takeaway kung pao. There are no peppers and no thick gloopy sauce: just small cubes of chicken stir-fried in oil scorched with dried chilies and Sichuan pepper, with garlic, ginger and spring onion, a spoonful of glossy sauce and a handful of peanuts. The sauce balances sugar against dark Chinkiang vinegar in equal measure, for the gentle sweet and sour the Sichuanese call lychee flavour, and everything is cut to roughly the same size so each mouthful catches a little of all of it. This version keeps those classic proportions and builds in the moves that make it hard to get wrong. Thigh stays juicy where breast dries out. The chilies start in cool oil so they darken slowly, then come out before the chicken goes in, so they cannot burn. The peanuts are toasted first and go in last, off the heat, so they crunch at the table. Ginger goes in right alongside the garlic, and the spring onion greens finish it fresh.',
  attribution: 'A Nieves\'s Kitchen take on a Sichuan classic',

  headnoteIngredients:
    'Two ingredients make the dish, the dried chilies and the Sichuan peppercorns, and both are worth a trip to a Chinese grocer, along with the black vinegar. The nutrition is for the stir-fry alone, without the rice.',
  headnoteInstructions:
    'Everything is cut, mixed and sitting in small bowls by the hob before the wok goes on, with the rice already cooking, because from the chilies to the plate is under 10 minutes without a pause. Toast the peanuts while the chicken marinates so the wok has time to cool. The one moment that needs your full attention is the chilies. Starting them in cool oil gives you a wide window to catch them at deep burgundy, and straining them out before the chicken goes in means they cannot carry on darkening while it cooks.',

  equipment: [
    'A wok, or the widest frying pan you have (28cm or more), so the chicken sears in a single layer rather than stewing in its own juices.',
  ],

  tips: [
    'Taste a sliver of one chili before you start. Dried chilies vary enormously in heat from brand to brand, so if yours is fierce, use fewer and leave them in bigger pieces. They are there to perfume the oil, not to be a challenge.',
    'Shake the seeds out. They scorch before the skins do and carry most of the heat, so loose seeds are the usual reason a kung pao tastes harsh or bitter.',
    'Cool oil is the safety net. Chilies dropped into smoking oil go from perfect to burnt in a few seconds; started cool over medium heat, they give you 30 seconds to a minute to catch them at deep burgundy.',
    'Cut everything to match. Chicken in 1.5cm cubes and spring onion whites as long as they are wide means each spoonful picks up chicken, peanut and onion together, and cubes that small cook through in the 3 minutes the wok needs.',
    'The sauce should coat, not pool, and taste savoury first, then gently sweet and sour, never sharp. Taste a piece at the end: if it needs salt, add a few drops of light soy; if it tastes a little flat, a few drops more black vinegar off the heat brings it up.',
    'Serve it the moment it is done. The peanuts soften in the sauce within about 10 minutes, so if you are cooking with leftovers in mind, keep a portion of peanuts back and add them when you reheat.',
  ],

  notes: [
    'Chicken breast: works too. Cut it to the same size, add a pinch (⅛ teaspoon) of bicarbonate of soda to the marinade to keep it tender, and stop cooking the moment the biggest cube is white all the way through.',
    'Soy sauces: check the labels. For gluten-free, use tamari in place of both.',
    'Cornflour: potato starch swaps one for one, in both the marinade and the sauce.',
    'Chinkiang black vinegar: a dark, malty vinegar brewed from rice with wheat bran; the best have a short ingredient list. No Chinkiang, or cooking gluten-free? Use 2 teaspoons of rice vinegar and 1 teaspoon of balsamic vinegar together.',
    'Water: halal chicken stock in place of the water in the sauce gives a rounder, more savoury finish.',
    'Dried chilies: look for large, fairly mild Sichuan or Chinese ones (often sold as facing heaven chilies), which give colour and fragrance more than fire. If all you can find are small, fiery ones, use 5 or 6 and leave them in bigger pieces.',
    'Sichuan peppercorns: they should be reddish brown and smell sharp and citrusy when you crush one; old, dusty ones give almost nothing. None? Leave them out, and add a pinch of ground white pepper to the sauce for warmth, though not the tingle.',
  ],

  variations: [
    'Takeaway style, with vegetables and more sauce: dice 1 red pepper, 1 small courgette and 1 celery stick to the same 1.5cm as the chicken. Make the sauce with 1½ tablespoons of sugar, 2 teaspoons of light soy, 2 teaspoons of cornflour and 100ml of water, keeping the rest of it the same. Once the strained chili oil is back in the wok, stir-fry the vegetables in it over high heat for 2 minutes, until bright and only just tender, and tip them onto a plate. Add 1 more tablespoon of oil, cook the chicken as written, and return the vegetables with the chilies and sauce. Cooking them apart stops a home hob from stewing the chicken. The bigger sauce takes about a minute to thicken.',
    'Fry your own peanuts: put 75g of raw, skinned peanuts in the wok with the 2 tablespoons of oil while both are cold, then set it over medium-low heat and stir often for 5 to 7 minutes, until golden. Lift them out onto a plate, where they crisp and darken a little more as they cool. Let the oil cool off the heat for 3 minutes, then use it for the chilies. Fresher and crunchier than anything from a bag, and the oil picks up a nutty flavour.',
    'Kung pao prawns: use 350g of raw, peeled king prawns, patted dry, with the same marinade minus the water. Sear for 30 seconds, stir-fry until mostly pink, about 1 minute, then add the garlic, ginger and spring onion and cook for 1 minute more, until the thickest prawn is just opaque in the middle.',
    'Cashews instead of peanuts: the same weight of roasted unsalted cashews, toasted the same way. Richer and a little sweeter, with a softer crunch.',
    'Hotter: use up to 15 or 20 chilies, and fry 1 tablespoon of Sichuan chili bean paste (doubanjiang) in the oil for 30 seconds once the chicken has separated, until the oil turns red. Halve the salt in the marinade, since the paste is salty, and check the label.',
    'More tingle: toast another half teaspoon of Sichuan peppercorns in a dry pan until fragrant, grind them, and sprinkle them over the finished dish.',
    'Not traditional, but very good: a handful of chopped coriander and a sliced fresh green chili over the top, or a spoonful of crispy chili oil stirred through with the peanuts. Some chili oils contain meat, so check the label.',
  ],

  storage:
    'Best eaten straight away, while the peanuts still crunch. Leftovers keep in a sealed container in the fridge for up to 2 days. Reheat in a hot wok or frying pan with a splash of water for 2 to 3 minutes, until piping hot all the way through, and add a small handful of fresh peanuts if you kept some back.',

  dropcap: true,

  image: 'https://images.unsplash.com/photo-1632022777952-0e4e0baf636d?w=1200&q=80',
  imageIsStock: true,
};

export default recipe;
