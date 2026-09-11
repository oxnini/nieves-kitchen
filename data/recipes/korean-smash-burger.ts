// data/recipes/korean-smash-burger.ts
import type { RecipeInput } from './_types';

const recipe: RecipeInput = {
  title: 'Korean Smash Burger with Mozzarella Crisp',
  country: 'South Korea',
  category: 'main',
  difficulty: 'Easy',
  servings: 2,
  time: { active: 20, total: 25 },
  yield: 'Makes 2 burgers, one each',
  tags: ['high-protein', 'quick', 'spicy', 'fusion'],

  region: 'East Asia',
  coordinates: { lat: 37.5665, lng: 126.978 },
  influences: ['South Korea', 'United States of America'],
  featuredIngredients: ['beef'],

  ingredients: [
    {
      heading: 'Burgers',
      items: [
        { name: 'beef mince, 20% fat, loosely rolled into 2 balls', amount: 240, unit: 'g' },
        { name: 'salt', amount: 0, unit: '' },
        { name: 'black pepper', amount: 0, unit: '' },
        { name: 'sesame seed burger buns', amount: 2, unit: '' },
        { name: 'butter, for toasting the buns', amount: 10, unit: 'g' },
      ],
    },
    {
      heading: 'Toppings',
      items: [
        { name: 'spring onions, cut into 5cm lengths and split lengthways into strips', amount: 4, unit: '' },
        { name: 'kimchi, roughly chopped, juice squeezed out and saved', amount: 60, unit: 'g' },
        { name: 'low-moisture mozzarella, grated from a block', amount: 60, unit: 'g' },
      ],
    },
    {
      heading: 'Gochujang kimchi mayo',
      items: [
        { name: 'mayonnaise', amount: 2, unit: 'tbsp' },
        { name: 'gochujang (halal-certified)', amount: 1, unit: 'tbsp' },
        { name: 'kimchi juice, squeezed from the chopped kimchi', amount: 2, unit: 'tsp' },
        { name: 'rice vinegar', amount: 1, unit: 'tsp' },
        { name: 'honey', amount: 1, unit: 'tsp' },
        { name: 'toasted sesame oil', amount: 0.5, unit: 'tsp' },
      ],
    },
  ],

  steps: [
    {
      heading: 'Prep everything first',
      items: [
        'Chop the kimchi small enough to sit flat on a patty, then squeeze it firmly over a small bowl and keep the juice. Squeezing is what stops the bun going soft, and the juice you press out is the acid in your sauce.',
        'Taste your gochujang on its own before you mix anything. Brands vary enormously in heat and salt, so the amounts below are a starting point rather than a rule.',
        'Stir the mayonnaise, gochujang, reserved kimchi juice, rice vinegar, honey and sesame oil together until smooth, then leave it for ten minutes. Gochujang straight from the tub is sharp and pasty, and a short rest lets it loosen into the mayo. Taste again and adjust: more gochujang for heat, more mayo to mellow it, a few more drops of vinegar to wake it up.',
        'Cut the spring onions into 5cm lengths, then split each length into 4 long strips.',
        'Roll the beef into 2 loose balls without packing them, and put them back in the fridge. Do not salt them yet. Salt worked into raw mince turns a patty bouncy, so it goes on the outside only, once the beef is in the pan.',
        'Tear off two squares of baking parchment, a little larger than a bun. This is what you smash through.',
      ],
    },
    {
      heading: 'Two pans, two temperatures',
      items: [
        'Put your heaviest pan, cast iron or stainless, over the highest heat and leave it there for a good 3 to 4 minutes, until it is faintly smoking. Open a window or turn the extractor on now rather than later. This has to be properly, uncomfortably hot.',
        'While that heats, melt the butter in a second pan over medium heat and toast the buns cut side down until golden, 1 to 2 minutes. Set them aside.',
        'Keep that second pan on medium, no oil, and scatter 30g of grated mozzarella per burger into a flat round roughly the size of a bun. Leave them completely alone for 2 to 3 minutes, until the undersides are lacy and gold and the tops have just melted. Slide them out onto a plate. The cheese wants steady medium heat, not the fierce heat the beef needs, which is exactly why it lives in its own pan.',
      ],
    },
    {
      heading: 'Smash the patties',
      items: [
        'Take the beef straight from the fridge into the dry, screaming pan, well apart. Lay a square of parchment over each ball and smash it flat and hard within the first twenty seconds, leaning your weight on a second spatula or the base of a small saucepan, and holding the press for a slow count of ten so it does not spring back. Peel the parchment off.',
        'Smashing while the beef is still cold is the whole trick. There are no rendered juices to squeeze out yet, and every bit of the patty lands flat against the hot metal. Thinner means more crust, thicker means more juice, so smash to whatever side of that trade you like.',
        'Season the tops with salt and pepper, and do not press again. A second smash later on is what dries a burger out.',
        'Lay the spring onion strips in the beef fat alongside and turn them once or twice as they soften and char in spots.',
        'After 2 to 2 and a half minutes the edges will be deep brown and frilly. Scrape underneath firmly with a stiff metal spatula, hard enough that the whole crust comes up with the patty, and flip. Season the seared side too.',
        'Lay a mozzarella crisp on each patty, melty side down onto the beef, crisp side up. Give it one more minute: the hot patty softens the underside of the crisp while the top stays brittle, so you get melt and crunch in a single layer. Lift the spring onions out.',
      ],
    },
    {
      heading: 'Build and eat',
      items: [
        'Spread the sauce on both cut faces, the bottom bun included. The sauce on the bottom is not just for flavour, it is the layer that keeps the kimchi from soaking through.',
        'Bottom bun, patty with its crisp, kimchi, spring onion strips, top bun.',
        'Eat it straight away, standing at the hob if that is what it takes. Nothing about this burger improves with waiting.',
      ],
    },
  ],

  nutrition: { calories: 670, protein: 38, carbs: 47, fat: 37 },
  flavorProfile: { sweet: 2, salty: 3, sour: 3, bitter: 1, umami: 4, spicy: 3 },

  isVegetarian: false,
  isVegan: false,
  isGlutenFree: false,
  isDairyFree: false,

  quote:
    'A smash burger given a Korean accent, where the cheese never touches the patty until it has already turned into a crisp.',
  description:
    'The bones of this are an American smash burger, cold beef flattened into a screaming pan so the whole underside turns to crust. Everything on top of it is Korean. The onions are spring onions, cut into long strips and charred in the beef fat. The sauce is gochujang loosened with mayo and the juice squeezed out of the kimchi, and the chopped kimchi itself goes on for sourness and crunch. The mozzarella is the part I am proudest of: it is crisped separately into a lacy round, then laid on the patty melty side down, so one layer gives you both the pull of melted cheese and a shatter on top. It is a twenty minute burger that eats like something ordered at a counter.',
  attribution: 'A Nieves\'s Kitchen original',

  headnoteIngredients:
    'Use mince with a real fat content, around 20%. Fat is what renders into the pan and fries the crust, and lean beef will give you a grey, sad patty however hot the pan is. Grate the mozzarella from a block: the pre-shredded bags are dusted with anti-caking starch that stops it flowing into a proper lace. Check your gochujang label for ethyl alcohol and use one that is halal-certified.',
  headnoteInstructions:
    'The actual cooking takes about four minutes, so have the sauce mixed, the onions cut and the kimchi squeezed before any beef goes near the heat. The one thing worth waiting for is the pan. If it is not faintly smoking, it is not ready.',

  equipment: [
    'Two pans, because the beef and the cheese want completely different heats. The patties need your heaviest cast iron or stainless pan, and anything else will do for the buns and the cheese crisps.',
    'Nothing non-stick for the patties. The coating will not take this heat, and a patty that grips the pan is exactly how the crust forms in the first place.',
    'A stiff metal spatula for the flip, plus a second spatula or the base of a small saucepan to lean on when you smash.',
    'Baking parchment to smash through, so the patty releases cleanly instead of tearing in half on the spatula.',
  ],

  tips: [
    'Cold beef, hot pan. Both halves matter. Beef from the fridge into a faintly smoking pan is the only route to a proper crust.',
    'Smash within the first twenty seconds and hold the press for a count of ten. After that, hands off. Pressing a second time later just squeezes the juice out onto the pan.',
    'Do not use a non-stick pan. High heat wrecks the coating, and sticking is not the enemy here, it is the mechanism. Stainless actually grips better than cast iron.',
    'Give each patty real space. Crowding drops the pan temperature and you end up steaming the beef instead of searing it.',
    'Salt on the outside only, and on both faces. Season the top after the smash and the seared side after the flip.',
    'Grate the mozzarella yourself. Bagged pre-shredded cheese is coated in starch and will not lace properly.',
    'Do not touch the cheese while it sets. Nudging it before the underside crisps tears the round apart.',
    'Sauce the bottom bun as well as the top. It is the waterproof layer between the bun and the kimchi.',
    'Taste your gochujang before you build the sauce. Two brands can be a whole chilli apart.',
  ],

  substitutions: [
    'Gochujang varies more than you would expect, and several well-known brands list ethyl alcohol on the label. Use one that is halal-certified.',
    'Most gochujang mayo recipes reach for mirin. Rice vinegar with a little honey does the same job, brightness plus a touch of sweetness, with no alcohol involved.',
    'Choose a mozzarella made with microbial or vegetarian rennet, or one that is halal-certified. Low-moisture and grated from a block either way, since fresh mozzarella balls hold far too much water to crisp.',
    'Rice vinegar can be swapped for apple cider vinegar or a squeeze of lemon.',
    'A brioche bun works if you cannot find sesame, though you lose a little of the toast.',
    'Leaner mince will cook fine, it just browns less. Add a teaspoon of neutral oil to the pan to make up for the missing fat.',
  ],

  variations: [
    'Swap the charred spring onions for pajeori, the raw scallion salad Korean grills serve alongside rich beef. Sit the cut strips in ice water for a few minutes so they curl and lose their bite, drain them well, then toss with a pinch of gochugaru, a splash of rice vinegar, a little sesame oil and sesame seeds. Dress it at the last second, because the salt wilts it fast. Charring makes the onions sweeter, this makes them sharper, and against a fatty patty the sharper version cuts beautifully.',
    'Caramelise the kimchi instead of using it raw. Fry the chopped kimchi in the beef fat for 2 to 3 minutes until the edges catch and crisp. It goes deeper and sweeter, and cooking off the water is one more thing keeping the bun intact.',
    'Double smash: two thinner 80g patties per burger instead of one, with the mozzarella crisp on the top patty. More crust per bite, which is the whole argument for smashing in the first place.',
    'Add a fried egg with a runny yolk on top of the spring onions.',
  ],

  storage:
    'This is a cook-to-order burger. The crisp softens and the thin patty dries out on reheating, so there is no good way to keep a built one. The sauce is the exception and keeps in a sealed jar in the fridge for 3 to 4 days, getting slightly better on day two. Cut spring onions keep a day or two wrapped in damp kitchen paper.',

  dropcap: true,

  isFusion: true,
  inspiredBy: ['American smash burgers', 'Korean banchan'],

  image: '/recipes/korean-smash-burger-hero.webp',
  imageIsStock: false,

  images: [
    {
      url: '/recipes/korean-smash-burger-crisp.webp',
      caption:
        'Open, before the top bun goes on. The mozzarella crisp comes out of the pan lacy and browned at the edges, and goes on melty side down so the crunch ends up facing you.',
      width: 1086,
      height: 1448,
    },
  ],
};

export default recipe;
