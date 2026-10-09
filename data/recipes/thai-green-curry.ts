// data/recipes/thai-green-curry.ts
import type { RecipeInput } from './_types';

const recipe: RecipeInput = {
  title: 'Thai Green Curry',
  country: 'Thailand',
  category: 'main',
  difficulty: 'Easy',
  servings: 4,
  time: { active: 45, total: 55 },
  yield: 'Serves 4, with jasmine rice',
  tags: ['spicy', 'high-protein', 'one-pot', 'meal-prep friendly'],

  region: 'Southeast Asia',
  coordinates: { lat: 13.7563, lng: 100.5018 },
  featuredIngredients: ['chicken'],

  ingredients: [
    {
      heading: 'The rice',
      items: [
        { name: 'jasmine rice, about 75g a person, more or less to taste', amount: 300, unit: 'g' },
        { name: 'salt', amount: 0.5, unit: 'tsp' },
        { name: 'neutral oil (optional)', amount: 1, unit: 'tsp' },
      ],
    },
    {
      heading: 'The chicken',
      items: [
        { name: 'halal chicken mini fillets', amount: 500, unit: 'g' },
        { name: 'bicarbonate of soda', amount: 0.5, unit: 'tsp' },
      ],
    },
    {
      heading: 'Crispy shallots',
      items: [
        { name: 'shallots', amount: 3, unit: '' },
        { name: 'neutral oil, plus a little spray oil', amount: 1, unit: 'tsp' },
        { name: 'salt, a good pinch', amount: 0, unit: '' },
      ],
    },
    {
      heading: 'Tofu (optional)',
      items: [
        { name: 'firm tofu', amount: 200, unit: 'g' },
        { name: 'neutral oil', amount: 1.5, unit: 'tbsp' },
      ],
    },
    {
      heading: 'The curry',
      items: [
        { name: 'Thai green curry paste (I use Mae Ploy)', amount: 4, unit: 'tbsp' },
        { name: 'full-fat coconut milk, unshaken', amount: 400, unit: 'ml' },
        { name: 'vegetable or halal chicken stock, low salt', amount: 200, unit: 'ml' },
        { name: 'fish sauce, plus more to taste', amount: 0.5, unit: 'tbsp' },
        { name: 'soft light brown sugar', amount: 1, unit: 'tsp' },
        { name: 'white sugar', amount: 1, unit: 'tsp' },
        { name: 'makrut lime leaves, torn (highly recommended)', amount: 6, unit: '' },
      ],
    },
    {
      heading: 'The vegetables',
      items: [
        { name: 'red pepper, sliced', amount: 1, unit: '' },
        { name: 'baby corn, halved lengthways', amount: 100, unit: 'g' },
        { name: 'broccoli, in small florets', amount: 200, unit: 'g' },
        { name: 'mangetout or sugar snap peas', amount: 100, unit: 'g' },
        { name: 'Thai basil leaves, a handful (recommended)', amount: 0, unit: '' },
      ],
    },
    {
      heading: 'To serve',
      items: [
        { name: 'lime, cut into wedges', amount: 1, unit: '' },
        { name: 'fresh coriander, lots of it', amount: 0, unit: '' },
        { name: 'fresh red or green chilli, sliced (optional)', amount: 0, unit: '' },
      ],
    },
  ],

  steps: [
    {
      heading: 'Rice and chicken',
      items: [
        'Rinse the rice until the water runs clear, then cook it the way you normally would, in a rice cooker or on the hob, with the salt and the oil, if using.',
        'Pull the tough white tendon out of each chicken fillet. Grip its end with a piece of kitchen paper and run the back of a knife along it, and it slides out. Cut each fillet into three strips.',
        'Rub the bicarbonate of soda all over the chicken and leave it for exactly 15 minutes. Then rinse it very, very well under cold water, rubbing the strips as you go, and pat them dry. Any bicarb left on will taste soapy.',
      ],
    },
    {
      heading: 'Crispy shallots',
      items: [
        'While the chicken sits, slice the shallots as thinly as you can, ideally on a mandoline. Separate the slices into rings by tossing them between your hands, then toss them with the teaspoon of oil and the salt.',
        'Spread them in the air fryer basket and give the top a light spray of oil. Air fry at 120°C, never hotter, for about 25 minutes, shaking the basket every 5 minutes so they brown evenly. About halfway through, turn it down to 115°C, or 110°C if they are colouring quickly. They burn very easily, and they will crisp up at a low heat. Every machine runs differently, so watch them closely towards the end and take them out when they are deep golden.',
        'They will look after themselves while you make the curry. Tip them onto kitchen paper when they are done and they crisp up further as they cool.',
      ],
    },
    {
      heading: 'Crisp the tofu (optional)',
      items: [
        'If you are adding tofu, pat it dry and cut it into cubes or large rectangles.',
        'Heat the oil in a wide pan over medium-high heat. Fry the tofu, turning it, until every side is crisp and browned, about 8 minutes. Lift it onto a plate and leave the oil in the pan.',
      ],
    },
    {
      heading: 'Crack the cream and fry the paste',
      items: [
        'Open the coconut milk without shaking it. Spoon the thick cream from the top, about a quarter of the can, into the same wide pan over medium heat. Let it bubble until it splits: the oil separates out around the edges and it starts to smell toasty and nutty. This takes 3 to 5 minutes.',
        'Turn the heat down low, lower still in a stainless steel pan, and add the curry paste. Fry it slowly, stirring all the time so it does not catch, until it darkens a little and smells deeply fragrant. Give it a good 4 to 5 minutes. This is where the flavour of the whole curry comes from. Keep your face back from the pan, as the chilli fumes are strong.',
      ],
    },
    {
      heading: 'Build the sauce',
      items: [
        'Pour in the rest of the coconut milk and the stock and stir until the paste has dissolved into it. Add the lime leaves, the fish sauce and both sugars. If you are using green beans, trim and halve them and add them now.',
        'Bring it to a gentle simmer for about 5 minutes, then taste. If it tastes a bit flat, add a pinch more sugar and up to 1 tsp more fish sauce. If it is too hot, loosen it with a splash of water.',
      ],
    },
    {
      heading: 'Chicken and vegetables',
      items: [
        'Add the chicken and keep the heat low, so only small bubbles break the surface. Cook for 5 to 6 minutes, until it is just cooked through. A hard boil toughens chicken breast.',
        'Add the red pepper and baby corn, and return the tofu to the pan if you made it. Cook for 2 minutes.',
        'Add the broccoli and the mangetout and cook for 2 to 3 minutes more, so they stay bright and crunchy. Add vegetables later rather than earlier: they keep softening as the curry sits, and again when it is reheated.',
      ],
    },
    {
      heading: 'Finish and serve',
      items: [
        'Take the pan off the heat and stir through the Thai basil, if you have it. Taste once more, adding a splash of water if it is too spicy or a little salt if it needs it.',
        'Serve beside the rice with the crispy shallots piled on top, lots of coriander, sliced chilli, and a wedge of lime on each plate to squeeze over just before you eat.',
      ],
    },
  ],

  nutrition: { calories: 420, protein: 35, carbs: 18, fat: 23 },
  flavorProfile: { sweet: 2, salty: 3, sour: 2, bitter: 0, umami: 3, spicy: 4 },

  isVegetarian: false,
  isVegan: false,
  isGlutenFree: false,
  isDairyFree: true,

  quote:
    'Silky chicken in a fragrant, creamy green curry, piled with crispy shallots, lots of coriander and a squeeze of lime at the table.',
  description:
    'Green curry is the one I come back to most. It is quick enough for a weeknight and it never feels like a compromise. This is how I make it now: the chicken velveted so even breast stays silky, the paste fried slowly in cracked coconut cream until the whole kitchen smells of it, and a pile of crispy shallots made in the air fryer while it simmers. The vegetables are whatever is in the fridge, added late so they keep their bite, and if there is leftover tofu, it goes in too.',
  attribution: 'A Nieves\'s Kitchen staple',

  headnoteIngredients:
    'The paste does most of the work, so use a good one. I use Mae Ploy, which is properly hot: 4 tablespoons makes a spicy curry, so start with 2 or 3 if you are unsure. Do not shake the coconut milk, because you want the thick cream at the top of the can. The two sugars sound fussy, but the brown one adds a little caramel and the white one keeps it clean, and together they taste better than either. Makrut lime leaves and Thai basil can be hard to find. I highly recommend both, because they make it taste like the curry you get in Thailand, but it is still a very good curry without them. The nutrition is for the curry and shallots alone, without the rice or tofu, since everyone eats a different amount of rice.',
  headnoteInstructions:
    'Three habits make this work. Velvet the chicken. Let the coconut cream split and fry the paste in it low and slow, before any other liquid goes in. Then add the vegetables late and taste as you go.',

  equipment: [
    'A mandoline for slicing the shallots paper-thin. A sharp knife works too, it just takes longer.',
    'An air fryer for the crispy shallots. You can deep-fry them in a small pan instead, or buy them ready made.',
  ],

  tips: [
    'Crispy shallots go from golden to burnt very quickly. Keep the heat at 120°C or below, shake the basket every 5 minutes, and pull them a shade lighter than you think, because they keep darkening as they cool.',
    'Make extra shallots. They keep for a few days in an airtight jar and are good on rice, eggs and noodles.',
    'Velveting is what keeps the chicken silky. The bicarbonate of soda stops the meat tightening as it cooks, so it stays tender even as lean breast. Keep it to 15 minutes and rinse it off thoroughly.',
    'Cracking the coconut cream means frying the thick top of the can until the oil separates out. The paste then fries in that oil, which gives a rounder, nuttier flavour than frying it in plain oil.',
    'Fry the paste on low heat and keep it moving, especially in stainless steel. It should darken a shade and smell deeply fragrant, never scorch.',
    'Use a good paste. Mae Ploy, Maesri and Aroy-D are all good. Thai Kitchen is much milder, so if it is all you have, you will need about twice as much.',
    'Freshen up jarred paste by frying a grated garlic clove, a little grated ginger and a spoonful of lemongrass paste with it.',
    'Keep a spoonful of the thick coconut cream back and drizzle it over each bowl at the end, the way many Thai restaurants finish it.',
    'Squeeze the lime over your own plate rather than into the pot. It tastes brighter just before you eat it, and leftovers keep better without it.',
  ],

  substitutions: [
    'Using chicken thighs? Skip the velveting entirely. Slice them and give them 7 to 8 minutes at a gentle simmer.',
    'No time to velvet? Use plain chicken breast strips and add them at the very end, at the lowest simmer, for just a couple of minutes until they are cooked through.',
    'Pick your protein. Chicken, tofu and prawns are the usual choices, alone or together. Add raw prawns in the last 3 minutes, just until they turn pink.',
    'Short on time? Shop-bought crispy shallots are absolutely fine. Most Asian supermarkets sell them in tubs.',
    'No air fryer? Deep-fry the shallots instead. Put the rings in a small pan with enough oil to cover them, start from cold over medium heat and stir often for 10 to 15 minutes, until pale golden. Lift them onto kitchen paper straight away, as they keep darkening in the heat they hold.',
    'No makrut lime leaves? Add a strip of lime zest with the coconut milk and take it out before serving.',
    'No Thai basil? Use ordinary basil, or simply more coriander at the end.',
    'Palm sugar is the traditional sweetener and does the job of both sugars on its own. Use 2 teaspoons.',
    'Stock is flexible: vegetable, halal chicken, or water with salt added as you taste. Whichever you use, make sure it is not too salty, because the paste and fish sauce already are.',
  ],

  variations: [
    'Use what is in your fridge, and add it by how long it needs. Green beans go in with the liquid. Aubergine, Thai eggplant and bamboo shoots go in with the chicken. Baby corn and peppers come next, and broccoli, mangetout and peas go in last.',
  ],

  storage:
    'Keeps in an airtight container in the fridge for 3 to 4 days. Reheat it gently rather than boiling it. If you are cooking for leftovers, add fewer vegetables at first, then add fresh ones to the sauce when you reheat the next batch so they are crunchy again. Make fresh rice to serve.',

  dropcap: true,

  image: '/recipes/thai-green-curry-hero.webp',
  imageIsStock: false,
  images: [
    {
      url: '/recipes/thai-green-curry-pan.webp',
      caption: 'Still in the pan, the sauce loose and creamy around broccoli, snap peas, baby corn and tofu',
      width: 1448,
      height: 1086,
    },
    {
      url: '/recipes/thai-green-curry-garnishes.webp',
      caption: 'Lime, coriander, green chilli and crispy shallots, set out for everyone to finish their own bowl',
      width: 1447,
      height: 1087,
    },
    {
      url: '/recipes/thai-green-curry-bowl.webp',
      caption: 'Served beside jasmine rice, with crispy shallots on the rice and a wedge of lime',
      width: 1448,
      height: 1086,
    },
  ],
};

export default recipe;
