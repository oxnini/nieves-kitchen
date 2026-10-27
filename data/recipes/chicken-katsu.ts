// data/recipes/chicken-katsu.ts
import type { RecipeInput } from './_types';

const recipe: RecipeInput = {
  title: 'Chicken Katsu Curry',
  country: 'Japan',
  featuredIngredients: ['chicken'],
  category: 'main',
  difficulty: 'Easy',
  servings: 2,
  time: { active: 50, total: 65 },
  yield: 'Serves 2, one cutlet each with curry and rice',
  tags: ['high-protein', 'comfort food'],

  // Tokyo, where the yoshoku cutlet became katsu.
  region: 'East Asia',
  coordinates: { lat: 35.67, lng: 139.77 },

  ingredients: [
    {
      heading: 'The chicken',
      items: [
        { name: 'skinless chicken breasts, about 150g each', amount: 2, unit: '', note: 1 },
        { name: 'fine salt', amount: 0.5, unit: 'tsp' },
        { name: 'ground white or black pepper', amount: 0.25, unit: 'tsp' },
      ],
    },
    {
      heading: 'The crumb',
      items: [
        { name: 'plain flour', amount: 30, unit: 'g' },
        { name: 'large egg', amount: 1, unit: '' },
        { name: 'water, for the egg', amount: 1, unit: 'tbsp' },
        { name: 'panko breadcrumbs', amount: 60, unit: 'g', note: 2 },
      ],
    },
    {
      heading: 'To cook',
      items: [
        { name: 'neutral oil, for shallow frying', amount: 450, unit: 'ml' },
        { name: 'or, for the air fryer: neutral oil, to toast the panko', amount: 1, unit: 'tbsp' },
        { name: 'and, for the air fryer: oil spray', amount: 0, unit: '' },
      ],
    },
    {
      heading: 'Curry sauce',
      items: [
        { name: 'neutral oil', amount: 1, unit: 'tsp' },
        { name: 'onion, thinly sliced', amount: 1, unit: '' },
        { name: 'small carrot, coarsely grated', amount: 1, unit: '' },
        { name: 'garlic clove, grated', amount: 1, unit: '' },
        { name: 'fresh ginger, grated', amount: 1, unit: 'tsp' },
        { name: 'water', amount: 350, unit: 'ml' },
        { name: 'Japanese curry roux', amount: 40, unit: 'g', note: 3 },
      ],
    },
    {
      heading: 'To serve',
      items: [
        { name: 'short-grain (sushi) rice', amount: 120, unit: 'g', note: 4 },
        { name: 'water, for the rice', amount: 160, unit: 'ml' },
        { name: 'white or pointed cabbage, finely shredded', amount: 100, unit: 'g' },
      ],
    },
  ],

  steps: [
    {
      heading: 'Before you start',
      items: [
        'Get the rice on first. Rinse it in a sieve until the water runs almost clear, then put it in a small lidded pan with the 160ml of water. Bring it to the boil over medium-high heat, cover, turn the heat to its lowest and cook for 12 minutes, then take it off the heat and leave it, lid on, for 10 minutes. It holds, covered, while you fry.',
        'Lay a chicken breast flat and, holding the knife level with the board, slice into the thick side, stopping about 1cm short of the far edge, and open it out like a book. Cover with baking paper and pound it with a rolling pin until it is an even 1.5cm all over. Repeat with the second breast. An even cutlet cooks through just as the crumb turns golden.',
        'Season both sides with the salt and pepper and leave them on a plate while you make the curry. The salt seasons the meat right through.',
      ],
    },
    {
      heading: 'The curry sauce',
      items: [
        'Warm the teaspoon of oil in a medium saucepan over medium heat. Add the onion and cook, stirring now and then, for 8 to 10 minutes, until soft and golden. Add a splash of water if it starts to catch. Stir in the carrot, garlic and ginger and cook for 2 minutes.',
        'Pour in the 350ml of water, bring it to the boil and simmer for 5 minutes. Take the pan off the heat, break in the curry roux and stir until it melts. Put it back on low heat and simmer, stirring, for 5 minutes, until it thickens and coats the back of a spoon. Too thick? Loosen it with a splash of water. Keep it warm on the lowest heat.',
        'While the curry simmers, drop the shredded cabbage into a bowl of iced water so it crisps up.',
      ],
    },
    {
      heading: 'The crumb',
      items: [
        'Using the air fryer? Toast the panko first: warm the tablespoon of oil in a frying pan over medium heat, add the panko and stir for 3 to 5 minutes, until most of it is light golden. Tip it straight onto a plate to cool. Frying in the pan? Skip this.',
        'Set out three shallow dishes: the flour, the egg beaten with the tablespoon of water, and the panko. Pat the chicken dry with kitchen paper.',
        'One cutlet at a time, turn it in the flour and shake off every bit of excess. Dip it in the egg and let the extra drip away, then press it firmly into the panko on both sides and round the edges.',
        'Leave the coated cutlets on a plate for 10 minutes, so the crumb sets and stays on in the pan.',
      ],
    },
    {
      heading: 'Fry in the pan',
      items: [
        'While the cutlets rest, pour the oil into a large, heavy frying pan, about 1cm deep, and heat it over medium heat to 170°C, about 5 minutes. Never leave hot oil unattended. No thermometer? Drop in a pinch of panko: it should sizzle at once and turn golden in about 30 seconds.',
        'Lay the cutlets in, away from you, one at a time if both will not fit with space between them. Fry for 3 to 4 minutes without moving them, until deep golden underneath, then turn once and fry the second side for 3 to 4 minutes. If the crumb darkens too fast, turn the heat down a notch.',
        'The thickest part should read 74°C, or show white meat all the way through with clear juices. Not there yet? Turn the heat to medium-low and give each side another 1 to 2 minutes. Rest the cutlets on a wire rack for 3 minutes.',
      ],
    },
    {
      heading: 'Or cook them in the air fryer',
      items: [
        'Air fryer instead? Heat it to 200°C for 3 to 5 minutes while the cutlets rest. Spray the basket with oil, lay in the cutlets coated in the toasted panko, with space between them, and spray the tops so no dry crumb shows.',
        'Air fry for 6 to 7 minutes, turn, spray the new top side and cook for another 6 to 8 minutes, until deep golden and 74°C in the thickest part. If the crumb is getting dark before the middle is done, drop to 180°C for the last few minutes. Rest them on a rack for 3 minutes.',
      ],
    },
    {
      heading: 'To the plate',
      items: [
        'Cut each cutlet into strips about 2cm wide, pressing straight down in one firm stroke so the crumb stays on. Drain the cabbage and pat it dry.',
        'Fluff the rice and put a mound on each plate. Lay the sliced katsu beside it, spoon the curry over the rice and alongside the katsu rather than over the top, so the crumb stays crisp, and add a pile of cabbage. Eat straight away.',
      ],
    },
  ],

  nutrition: { calories: 785, protein: 47, carbs: 93, fat: 25 },
  flavorProfile: { sweet: 2, salty: 3, sour: 0, bitter: 0, umami: 3, spicy: 1 },

  isVegetarian: false,
  isVegan: false,
  isGlutenFree: false,
  isDairyFree: false,

  quote:
    'A chicken cutlet pounded flat and even, pressed into panko and fried until it crackles, beside rice and a pool of glossy, gently spiced curry sauce.',
  description:
    'Katsu curry is Japanese comfort food at its most generous: a golden breaded cutlet, a mound of short-grain rice and a thick, mellow curry sauce that is more sweet and savoury than hot. This version keeps the sauce simple. A block of Japanese curry roux does the seasoning and the thickening in one go, and an onion cooked slowly until golden, a grated carrot, garlic and ginger give it body and sweetness of its own. The chicken breast is butterflied and pounded to an even 1.5cm, so it cooks through at the moment the crumb turns deep gold, and the coating gets ten minutes to set before it goes near any heat, which is what stops it slipping off. It shallow-fries in a centimetre of oil, with the air fryer written out right beside it. The curry goes on the rice and beside the katsu, never over it, so every bite still crackles.',
  attribution: 'A Nieves\'s Kitchen take on Japanese katsu curry',

  headnoteIngredients:
    'Panko is what makes katsu: its big, airy flakes fry up light and crunchy. Japanese curry roux comes in blocks, mild, medium or hot, and is sold in supermarkets and Asian shops. A pointed cabbage shreds finer and tastes sweeter than a white one, but either works.',
  headnoteInstructions:
    'Put the rice on, salt the chicken, then make the curry while the chicken sits: the sauce holds happily on the lowest heat. Decide on the pan or the air fryer before you crumb, because the air fryer needs its panko toasted first.',

  equipment: [
    'A wire rack set over a tray, for resting the cutlets. A plate works, but a rack keeps the underside crisp.',
    'A cooking thermometer if you have one, for the oil and to check the chicken has reached 74°C.',
    'An air fryer, only if you go that way. A heavy frying pan does the job just as well.',
  ],

  tips: [
    'Shake the flour off properly. A thick layer turns gluey under the egg, and the crumb then lifts away in one piece.',
    'Do not skip the 10-minute rest after coating. It is what keeps the crumb stuck to the chicken in the hot oil.',
    'Keep the oil steady at around 170°C. Too hot and the panko burns before the middle is cooked, too cool and the crumb drinks oil and turns greasy.',
    'Rest the cutlets on a rack, not on kitchen paper. Paper traps steam and softens the bottom.',
    'Take the roux off the heat before you add it. It melts smoothly instead of clumping.',
  ],

  notes: [
    'Chicken: boneless, skinless thighs are juicier and harder to overcook. Use 4, opened out flat and pounded even, and fry for about 3 minutes a side, still to 74°C. They add about 60 kcal a plate.',
    'Panko: no panko? Blitz day-old white bread, crusts off, into coarse crumbs. It browns faster and is a little less crunchy, so keep an eye on the heat.',
    'Curry roux: check the label and choose a halal-certified one. 40g is usually 2 to 3 squares; if your pack gives a different amount of water for that weight, follow the pack. Some roux contain milk, so check that too for a dairy-free plate.',
    'Rice: 60g each makes a good mound beside the cutlet and keeps the plate under 800 kcal. Hungrier? Cook 75g each with 200ml water, about 55 kcal more a plate. Jasmine or basmati are fine too.',
  ],

  variations: [
    'Curry sauce from scratch, no roux: cook the onion, carrot, garlic and ginger as above in 1 tbsp oil, then stir in 2 tbsp plain flour, 1 tbsp mild curry powder and 1 tsp garam masala for 1 minute. Whisk in 400ml hot stock made with 1 halal stock cube (check the label), a splash at a time, then add 1 tsp honey and 1 tsp soy sauce. Simmer gently for 10 to 15 minutes, until it coats the back of a spoon.',
    'Plain katsu with tonkatsu sauce: skip the curry and stir together 3 tbsp ketchup, 2 tbsp Worcestershire sauce, 1 tbsp oyster sauce, 1 tsp honey and 1 tsp soy sauce (check the labels on the oyster and soy sauce). Serve the sliced katsu with the cabbage, rice, a lemon wedge and the sauce for spooning over.',
    'Katsu sando: pound the cutlets to about 1cm and fry for 2 to 3 minutes a side. Spread 4 slices of soft white bread thinly with mayonnaise, brush the hot katsu with the tonkatsu sauce above, sandwich it with a handful of cabbage, press under a plate for 5 minutes, then trim off the crusts and cut in half.',
    'Double crumb for a thicker, crunchier crust: after the first coat of panko, dip each cutlet back into egg and then panko again. You will need a second egg and about 30g more panko.',
  ],

  storage:
    'Best eaten straight away. Leftover katsu keeps, covered, for up to 2 days in the fridge. Re-crisp it in the air fryer at 180°C for 4 to 5 minutes, or on a rack in the oven at 200°C (180°C fan) for about 10 minutes, until piping hot. The curry sauce keeps 3 days in the fridge or 3 months in the freezer; reheat it with a splash of water. Coated, uncooked cutlets freeze well, flat on a tray and then bagged, for up to a month. Thaw them overnight in the fridge and cook as normal.',

  dropcap: true,

  image: 'https://images.unsplash.com/photo-1784955725783-76d170a05619?w=1200&q=80',
  imageIsStock: true,
};

export default recipe;
