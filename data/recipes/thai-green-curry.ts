// data/recipes/thai-green-curry.ts
import type { RecipeInput } from './_types';

const recipe: RecipeInput = {
  title: 'Thai Green Curry',
  country: 'Thailand',
  category: 'main',
  difficulty: 'Easy',
  servings: 4,
  time: { active: 30, total: 40 },
  yield: 'Serves 4, with jasmine rice',
  tags: ['spicy', 'high-protein', 'one-pot', 'meal-prep friendly'],

  region: 'Southeast Asia',
  coordinates: { lat: 13.7563, lng: 100.5018 },
  featuredIngredients: ['chicken'],

  ingredients: [
    {
      heading: 'The paste',
      items: [
        { name: 'neutral oil', amount: 2, unit: 'tbsp' },
        { name: 'Thai green curry paste (I use Mae Ploy)', amount: 3, unit: 'tbsp' },
        { name: 'garlic cloves, grated', amount: 2, unit: '' },
        { name: 'fresh ginger, finely grated', amount: 2, unit: 'tsp' },
        { name: 'lemongrass paste (optional)', amount: 1, unit: 'tbsp' },
      ],
    },
    {
      heading: 'The sauce',
      items: [
        { name: 'full-fat coconut milk', amount: 400, unit: 'ml' },
        { name: 'halal chicken stock, low salt', amount: 250, unit: 'ml' },
        { name: 'makrut (kaffir) lime leaves, torn (if you can find them)', amount: 6, unit: '' },
        { name: 'fish sauce, plus more to taste', amount: 1, unit: 'tsp' },
        { name: 'palm sugar or brown sugar, plus more to taste', amount: 1, unit: 'tsp' },
      ],
    },
    {
      heading: 'Chicken and vegetables',
      items: [
        { name: 'boneless, skinless chicken thighs, thinly sliced', amount: 500, unit: 'g' },
        { name: 'aubergine or Thai eggplant, cut into bite-sized pieces', amount: 250, unit: 'g' },
        { name: 'peas or snow peas', amount: 150, unit: 'g' },
        { name: 'Thai basil leaves, a handful (if you can find them)', amount: 0, unit: '' },
        { name: 'lime, juice of half', amount: 0.5, unit: '' },
      ],
    },
    {
      heading: 'To serve',
      items: [
        { name: 'steamed jasmine rice', amount: 0, unit: '' },
        { name: 'lime wedges', amount: 0, unit: '' },
        { name: 'fresh coriander', amount: 0, unit: '' },
        { name: 'fresh red or green chilli, sliced', amount: 0, unit: '' },
      ],
    },
  ],

  steps: [
    {
      heading: 'Before you start',
      items: [
        'Put the rice on so it is ready when the curry is.',
        'Slice the chicken thighs thinly, about 1cm thick, so they cook through quickly and stay tender. Cut the aubergine into bite-sized pieces and grate the garlic and ginger.',
      ],
    },
    {
      heading: 'Fry the paste',
      items: [
        'Heat the oil in a heavy pot or deep frying pan over medium-high heat. Add the curry paste with the garlic, ginger and lemongrass paste, if using.',
        'Fry for 2 to 3 minutes, stirring all the time, until the paste dries out, darkens a little and smells deeply fragrant. You may see the oil start to separate from it. This is where the flavour of the whole curry comes from, so give it the full time. Keep your face back from the pan, as the chilli fumes are strong.',
      ],
    },
    {
      heading: 'Build the sauce',
      items: [
        'Pour in the stock and coconut milk and stir until the paste has dissolved into the liquid.',
        'Add the lime leaves, 1 tsp fish sauce and 1 tsp sugar. Season lightly here, because the paste is already salty. Bring to a simmer and taste it.',
      ],
    },
    {
      heading: 'Chicken and vegetables',
      items: [
        'Add the chicken, spread it out, and turn the heat down to medium so the sauce bubbles gently. Cook for 7 minutes.',
        'Add the aubergine and cook for about 5 minutes, until it is soft and has soaked up some of the sauce.',
        'Taste again. Add a splash more fish sauce for saltiness, a pinch more sugar to round it off, or more lime for brightness.',
        'Add the peas and cook for 2 minutes, just until they are bright green and tender.',
      ],
    },
    {
      heading: 'Finish and serve',
      items: [
        'Take the pot off the heat and stir through the Thai basil, if using, and the lime juice. The sauce should still be fairly loose, not thick. Do not keep simmering it, or it will darken and lose its fresh green colour.',
        'Spoon over jasmine rice and finish with fresh coriander, sliced chilli and lime wedges on the side for squeezing.',
      ],
    },
  ],

  nutrition: { calories: 500, protein: 28, carbs: 15, fat: 36 },
  flavorProfile: { sweet: 2, salty: 3, sour: 2, bitter: 1, umami: 3, spicy: 4 },

  isVegetarian: false,
  isVegan: false,
  isGlutenFree: false,
  isDairyFree: true,

  quote:
    'Fragrant, spicy and creamy, with tender chicken in a loose coconut sauce and plenty of lime, coriander and chilli on top.',
  description:
    'Green curry is the one I come back to most. It is quick enough for a weeknight and it never feels like a compromise. The secret is not a long list of ingredients but two habits: frying the paste properly before anything else goes in, and tasting as you go. I keep the vegetables flexible. Aubergine and peas are my default, but this is also how I use up whatever is left in the fridge.',
  attribution: 'A Nieves\'s Kitchen staple',

  headnoteIngredients:
    'The paste matters more than anything else, so use a good brand. I use Mae Ploy, which is properly hot, so 3 tablespoons gives a medium heat; start with less if you are cooking for people who do not like spice. Use full-fat coconut milk, as the light kind makes a thin, bland sauce. Makrut lime leaves and Thai basil can be hard to find. Add them if you can, because they make it taste like the curry you get in Thailand, but it is still a very good curry without them.',
  headnoteInstructions:
    'Two things make this work. Fry the paste until it smells deeply fragrant before any liquid goes in, and taste the sauce at every stage so you can balance salt, sweet and sour as you go.',

  tips: [
    'Use a good paste. I like Mae Ploy. Maesri and Aroy-D are also good. Thai Kitchen brand is much weaker, so if it is all you have, you will need about twice as much.',
    'Freshen jarred paste by frying it with a little fresh garlic, ginger and lemongrass. It brings back the aroma that gets lost in the jar.',
    'Fry the paste until it dries out and the oil starts to separate, before the liquid goes in. This is where the flavour of the whole curry comes from.',
    'Use chicken thighs. They stay juicy as they simmer, where breast can dry out.',
    'Season lightly at first. Jarred paste is already salty, so start with a teaspoon each of fish sauce and sugar and adjust at the end.',
    'Taste as you go. Check the sauce after the coconut milk, again once the vegetables are in, and once more before serving.',
  ],

  substitutions: [
    'No Thai eggplant? Ordinary aubergine works well. Cut it into bite-sized chunks so it softens in the same 5 minutes.',
    'No makrut lime leaves? Leave them out, or add a strip of lime zest with the coconut milk and take it out before serving.',
    'No Thai basil? Use ordinary basil or more coriander at the end. Thai basil has a gentle aniseed note, so the flavour will be a little different.',
    'Using chicken breast? Slice it thinly and add it with the aubergine instead of before, so it does not overcook.',
    'Any sugar works: palm, light brown or white.',
  ],

  variations: [
    'Use what is in your fridge. Mushrooms, broccoli and green beans all work: add firmer vegetables with the aubergine and softer ones with the peas.',
  ],

  storage:
    'Keeps in an airtight container in the fridge for 3 to 4 days. The aubergine softens further when reheated, so warm it gently on the hob or in the microwave rather than boiling it. Make fresh rice to serve.',

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
