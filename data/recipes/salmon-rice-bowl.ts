// data/recipes/salmon-rice-bowl.ts
import type { RecipeInput } from './_types';

const recipe: RecipeInput = {
  title: 'Salmon Rice Bowl',
  country: 'Japan',
  region: 'East Asia',
  coordinates: { lat: 35.68, lng: 139.69 },
  category: 'main',
  difficulty: 'Easy',
  servings: 1,
  time: { active: 10, total: 12 },
  yield: '1 bowl',
  tags: ['quick', 'single-serving', 'high-protein'],

  ingredients: [
    {
      heading: 'The bowl',
      items: [
        { name: 'cooked short-grain or jasmine rice, from the fridge, cooked no more than a day ago', amount: 200, unit: 'g', note: 1 },
        { name: 'leftover cooked salmon fillet (about 110g), skin removed', amount: 1, unit: '', note: 2 },
        { name: 'ice cube', amount: 1, unit: '' },
      ],
    },
    {
      heading: 'To season the rice',
      items: [
        { name: 'rice vinegar', amount: 2, unit: 'tsp' },
        { name: 'caster sugar', amount: 1, unit: 'tsp' },
        { name: 'salt, a small pinch', amount: 0, unit: '' },
      ],
    },
    {
      heading: 'The sauce',
      items: [
        { name: 'Japanese mayonnaise', amount: 1, unit: 'tbsp', note: 3 },
        { name: 'soy sauce', amount: 2, unit: 'tsp', note: 4 },
        { name: 'sriracha, plus more to taste', amount: 1, unit: 'tsp' },
      ],
    },
    {
      heading: 'To finish',
      items: [
        { name: 'ripe avocado, sliced', amount: 0.5, unit: '' },
        { name: 'kimchi, roughly chopped', amount: 2, unit: 'tbsp', note: 5 },
        { name: 'cucumber, cut into thin matchsticks', amount: 0.25, unit: '' },
        { name: 'spring onion, thinly sliced', amount: 1, unit: '' },
        { name: 'toasted sesame seeds', amount: 1, unit: 'tsp' },
        { name: 'small pack of roasted seaweed snacks (about 5g), or 2 sheets of sushi nori, quartered', amount: 1, unit: '' },
      ],
    },
  ],

  steps: [
    {
      heading: 'Before anything goes in the microwave',
      items: [
        'Stir the rice vinegar, sugar and pinch of salt together in a small cup for about 30 seconds, until the sugar has mostly dissolved. This is the seasoning for the rice.',
        'In a second small bowl, stir the Japanese mayonnaise, soy sauce and sriracha together until smooth and evenly coloured. Taste a little: it should be creamy, salty and gently hot, and a touch stronger than you would want on its own, because it is about to season a whole bowl. Add more sriracha now if you like it hotter.',
        'Slice the avocado, cut the cucumber into matchsticks, slice the spring onion and roughly chop the kimchi. Once the bowl is hot it wants eating straight away, while the seaweed still crackles, so have everything ready first.',
      ],
    },
    {
      heading: 'Reheat, gently and safely',
      items: [
        'No microwave? Use a frying pan instead (see note 6). Spread the rice in an even layer over one half of a wide, shallow microwave-safe bowl or a dinner plate, breaking up any clumps with a fork. Pull the salmon into large flakes, checking for bones as you go, and set them aside on a saucer for now. A thin, even layer of rice heats through quickly, with no cold heap in the middle.',
        'Set the ice cube on the empty half of the plate and cover loosely with a sheet of baking paper, tucking the edges under. Microwave the rice on its own on full power for 90 seconds. The rice goes in first because it needs longer than the fish.',
        'Lift the paper and stir the rice. Lay the salmon flakes in a single layer on the empty half, next to whatever is left of the ice, and cover again. Microwave for 1 minute more. Both the rice and the salmon must be steaming hot all the way through: press a fork into the middle of the rice and the thickest flake of salmon and look for steam (75°C if you have a probe). If either is only warm, give it 30 seconds more at a time. Fish out any ice that remains. Giving the salmon only the last minute or so, in the steam from the ice, is what keeps it moist.',
      ],
    },
    {
      heading: 'Season, mix and eat',
      items: [
        'Pour the vinegar seasoning over the hot rice and fold it through with the fork for about 30 seconds, lifting and turning rather than mashing. Hot rice drinks the seasoning in, so it tastes of something before the sauce arrives.',
        'Pile the salmon onto the rice, spoon over the sauce and mash it all together with the fork until every grain is coated and the salmon has broken into small flakes.',
        'Top with the avocado, kimchi, cucumber and spring onion, and scatter over the sesame seeds. Keep the seaweed on the side: take a sheet, scoop a little of everything into it, fold it round and eat. Wrapping as you go keeps every sheet crisp.',
      ],
    },
  ],

  nutrition: { calories: 790, protein: 35, carbs: 76, fat: 39 },
  flavorProfile: { sweet: 1, salty: 3, sour: 2, bitter: 0, umami: 4, spicy: 2 },

  isVegetarian: false,
  isVegan: false,
  isGlutenFree: false,
  isDairyFree: true,

  quote:
    'Yesterday\'s salmon steamed back to life over vinegar-seasoned rice, mashed with soy, Japanese mayonnaise and sriracha, and scooped up in crisp sheets of roasted seaweed.',
  description:
    'This is the salmon rice bowl that went round the internet: leftover salmon and rice warmed under an ice cube, mashed with soy, Japanese mayonnaise and sriracha, and eaten wrapped in roasted seaweed. This version keeps that ten-minute shape and fixes what makes the quick copies taste flat. The rice is seasoned the way sushi rice is, with a little rice vinegar, sugar and salt folded in while it is hot, so it has flavour of its own and a brightness that cuts through the mayonnaise. The sauce is stirred together first, in a set ratio, so every mouthful is balanced instead of one of neat soy and the next of neat sriracha. Kimchi, cucumber and spring onion bring the sharp, cold, crunchy things a rich bowl needs, and toasted sesame finishes it. A leftover fillet of honey soy salmon is ideal here.',
  attribution: 'A Nieves\'s Kitchen take on the leftover salmon rice bowl',

  headnoteIngredients:
    'Any cooked salmon works: baked, pan-fried, air-fried or glazed. Short-grain Japanese rice is softer and a little sticky, so it holds together on the seaweed, though jasmine is good too.',
  headnoteInstructions:
    'Mix the rice seasoning and the sauce and cut the toppings before anything goes in the microwave. Reheating takes under 3 minutes, and after that the bowl should be eaten at once. Give the rice a head start and then lay the salmon beside it in a thin layer rather than piling one on the other: it is what lets the rice get properly hot without the salmon drying out.',

  tips: [
    'The ice cube is a slow steamer. Ice barely takes up microwave energy, so it melts gradually from the warmth of the rice, and that water turns to steam under the paper instead of pooling. No ice? Sprinkle over a tablespoon of water instead.',
    'Hot all the way through, not just warm. Microwaves heat unevenly, which is why you stir halfway and check the middle for steam. Reheat the rice and salmon once only, so warm just what you will eat.',
    'Big flakes, one layer, covered, and in for the last minute only: that is how reheated salmon stays moist. A whole fillet takes so long to heat in the middle that the outside goes dry and chalky, while flakes are steaming hot in about a minute.',
    'Fold the seasoning into the rice while it is hot. Hot rice absorbs it, and folding rather than stirring keeps the grains whole. The amounts are a little lighter than for sushi rice, because the sauce brings salt and the mayonnaise its own tang.',
    'Keep the seaweed out of the bowl. It goes limp within a minute of touching hot rice, and the crackle is half the point.',
  ],

  notes: [
    'Rice: brown rice works too, for a nuttier, chewier bowl. Freshly cooked? Fold in the seasoning straight away while it is hot, and reheat only the salmon, covered, with the ice cube, for about 1 minute, until steaming.',
    'Salmon: a leftover fillet of honey soy salmon is ideal, since its glaze seasons the rice, but start with half the soy in the sauce. A small 105g tin of salmon, drained, stands in for a fillet; mash the soft bones in with the rest.',
    'Japanese mayonnaise: check the label and look for a halal logo. No Japanese mayonnaise? Use 1 tablespoon of ordinary mayonnaise with a quarter teaspoon of rice vinegar and a pinch of sugar stirred in.',
    'Soy sauce: check the label. For gluten-free, use tamari.',
    'Kimchi: check the label; some kimchi is thickened with wheat flour, so pick one without if you need the bowl gluten-free.',
    'No microwave: spread the rice in a small frying pan with a lid, sprinkle over 2 tablespoons of water, cover and heat over a low heat for 2 minutes. Lay the salmon flakes beside it, cover again and heat for 3 minutes more, until both are steaming hot all the way through, then season and mix in the pan.',
  ],

  variations: [
    'Fresh glazed salmon, if there are no leftovers. Pat a 120g salmon fillet dry, brush it with 1 tablespoon of soy sauce mixed with 1 teaspoon of honey, and bake at 200°C (180°C fan) for 10 to 12 minutes, until it flakes easily in the thickest part. Flake it straight onto the hot, seasoned rice, and halve the soy in the sauce, because the glaze is already salty.',
    'Crispy skin. Pat a skin-on fillet very dry and salt the skin. Heat 1 teaspoon of oil in a frying pan over medium-high heat, lay the fillet in skin side down, press it flat for 10 seconds, then leave it for 4 to 5 minutes, until the skin is crisp and the flesh has turned pale most of the way up. Turn it and cook for 1 to 2 minutes more, until it just flakes. Flake the flesh over the rice and break the skin over the top like crackling.',
    'Quick cucumber pickle. Toss the cucumber matchsticks with 1 tablespoon of rice vinegar, 1 teaspoon of sugar and a pinch of salt and leave them for 10 minutes while you do everything else. Drain before they go on the bowl.',
    'Furikake, the seaweed and sesame seasoning, scattered over the top. Check the label, or make your own by crumbling two of the seaweed sheets with the sesame seeds.',
    'Chili crisp in place of the sriracha: 1 to 2 teaspoons in the sauce, crispy bits and all. Some chili crisps contain meat, so check the label. A thinly sliced green chili on top adds fresh heat as well.',
    'Poke-style. Skip the reheated salmon and use 120g of salmon sold for eating raw (labelled sushi or sashimi grade), cut into 2cm cubes and tossed with 2 teaspoons of soy sauce and half a teaspoon of toasted sesame oil. Spoon it over the warm seasoned rice, leave out the soy in the sauce, and eat straight away. Keep raw fish cold and eat it the day you buy it.',
  ],

  storage:
    'Eat it as soon as it is made: the seaweed softens and the avocado browns. Cooked salmon keeps in a sealed container in the fridge for up to 2 days. Cooked rice should be cooled and in the fridge within an hour of cooking and eaten within a day. Reheat each once only, until steaming hot all the way through.',

  dropcap: true,

  image: 'https://images.unsplash.com/photo-1638502182261-7be714a565ce?w=1200&q=80',
  imageIsStock: true,
};

export default recipe;
