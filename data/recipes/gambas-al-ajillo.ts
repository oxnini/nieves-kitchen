// data/recipes/gambas-al-ajillo.ts
import type { RecipeInput } from './_types';

const recipe: RecipeInput = {
  title: 'Gambas al Ajillo',
  country: 'Spain',
  featuredIngredients: ['garlic', 'olive-oil'],
  category: 'main',
  difficulty: 'Easy',
  servings: 2,
  time: { active: 30, total: 30 },
  yield: 'Serves 2 as a main with bread, or 4 as a tapa',
  tags: ['quick', 'spicy', 'high-protein'],

  region: 'Western Europe',
  coordinates: { lat: 40.4168, lng: -3.7038 },

  ingredients: [
    {
      heading: 'Prawns',
      items: [
        { name: 'raw shell-on king prawns, headless (about 400g once peeled)', amount: 500, unit: 'g', note: 1 },
        { name: 'fine salt', amount: 0.5, unit: 'tsp' },
      ],
    },
    {
      heading: 'Prawn shell oil',
      items: [
        { name: 'olive oil, a good one, since you will be eating it', amount: 120, unit: 'ml' },
      ],
    },
    {
      heading: 'Garlic and chili',
      items: [
        { name: 'garlic cloves, thinly sliced', amount: 8, unit: '' },
        { name: 'dried guindilla chilies, snapped in half', amount: 4, unit: '', note: 2 },
        { name: 'sweet smoked paprika (pimentón dulce)', amount: 1, unit: 'tsp', note: 3 },
      ],
    },
    {
      heading: 'To finish',
      items: [
        { name: 'lemon juice', amount: 1, unit: 'tbsp' },
        { name: 'flat-leaf parsley or coriander, chopped', amount: 2, unit: 'tbsp', note: 4 },
        { name: 'flaky salt, to taste', amount: 0, unit: '' },
        { name: 'crusty bread, such as a baguette', amount: 200, unit: 'g', note: 5 },
      ],
    },
  ],

  steps: [
    {
      heading: 'Before you start',
      items: [
        'Peel the prawns, leaving the last little section of shell on the tail, and keep every bit of shell in a bowl. Run a small knife along the back of each prawn and pull out the dark vein. Toss the prawns with the fine salt and put them in the fridge for 10 minutes while you make the shell oil. Pat the shells dry with kitchen paper: water clinging to them, especially from frozen prawns, makes the oil spit.',
        'Slice the garlic thinly and evenly, about 2mm, so all the slices colour at the same rate. Snap the chilies in half, chop the parsley or coriander and squeeze the lemon. Set a metal sieve over a heatproof metal or ceramic bowl next to the hob (not plastic, which the hot oil can melt). Once the prawns go in, the whole thing takes two minutes and there is no time to chop.',
      ],
    },
    {
      heading: 'Make the shell oil',
      items: [
        'Put the shells and the olive oil into a wide frying pan, about 26cm, over medium heat. Once they start to sizzle, fry them for 5 minutes, stirring and pressing them with the back of a wooden spoon, until the shells turn a deep coral red, the oil goes orange and the kitchen smells of roasted prawns. If the edges of the shells start to blacken, turn the heat down.',
        'Take the pan off the heat and pour everything through the sieve into the bowl, tipping the pan away from you. Press hard on the shells with the spoon to squeeze out every drop of oil, then throw the shells away. Let the pan cool for a minute, then wipe out any stray bits of shell with a wad of kitchen paper (held in tongs if you like): left in, they burn in the next step and turn the oil bitter.',
        'While the oil cools for that minute, take the prawns out of the fridge and pat them dry with kitchen paper, so they are ready the moment the garlic is.',
      ],
    },
    {
      heading: 'Garlic and chili',
      items: [
        'Pour the prawn oil back into the pan, add the garlic and chilies and set it over medium-low heat. The oil is still warm, so the garlic starts to sizzle within a minute. Cook for 2 to 3 minutes, stirring, until the slices are soft and only just pale gold at the edges. Pale gold, not brown: the garlic keeps colouring in the hot oil after this, and browned garlic turns bitter. If it is racing ahead, lift the pan off the heat for a moment.',
      ],
    },
    {
      heading: 'The prawns',
      items: [
        'The moment the garlic is pale gold, turn the heat up to medium-high and lay the prawns in the oil in a single layer. Do not wait: the cold prawns cool the oil and stop the garlic colouring further. Cook king prawns for 1 minute, until pink underneath, then turn each one and cook for 1 minute more, until pink all over, opaque white through the thickest part and curled into a loose C. A tight O means they have gone too far. Size changes the clock: small prawns need only about 30 seconds a side and very large tiger prawns about 2 minutes, so go by the colour.',
        'Take the pan off the heat and straight away sprinkle over the smoked paprika and stir: the heat of the oil blooms it without burning it. Add the lemon juice and the parsley or coriander, then dip a piece of bread in the oil, taste it and add a pinch of flaky salt if it needs it.',
      ],
    },
    {
      heading: 'To the table',
      items: [
        'Take the pan straight to the table on a board while the oil is still sizzling, with the bread alongside. The oil is the best part, so tear the bread and mop up every last bit.',
      ],
    },
  ],

  nutrition: { calories: 835, protein: 48, carbs: 60, fat: 45 },
  flavorProfile: { sweet: 1, salty: 3, sour: 2, bitter: 1, umami: 4, spicy: 4 },

  isVegetarian: false,
  isVegan: false,
  isGlutenFree: false,
  isDairyFree: true,

  quote:
    'Prawns barely a minute a side in a hot orange oil made from their own shells, with golden garlic, a real kick of chili, and bread to mop up every drop.',
  description:
    'Gambas al ajillo is the tapa you hear before you see it: a small dish of olive oil still spitting, full of sliced garlic, dried chili and prawns, carried straight from the stove to the counter. This version starts by frying the prawn shells in the oil for five minutes and straining them out, so the oil turns orange and tastes deeply of prawn before the garlic even goes in. The chili is turned up to pil pil level, hot enough that you notice it. The shell oil gives it depth, smoked paprika warmth and a squeeze of lemon a bright edge. With plenty of crusty bread it makes dinner for two, because the oil is the best part.',
  attribution: 'A Nieves\'s Kitchen take on a Madrid tapas-bar classic',

  headnoteInstructions:
    'Have everything sliced, chopped and squeezed before the shells go in the pan. From there it is about 12 minutes: five for the shell oil, a few for the garlic and two for the prawns. Pale gold garlic and prawns pulled the moment they curl are the whole game.',

  equipment: [
    'A wide frying pan, about 26cm, so all the prawns fit in a single layer. A shallow terracotta cazuela is the traditional choice and keeps the oil sizzling at the table, but any frying pan does the job.',
  ],

  tips: [
    'Defrost frozen prawns overnight in the fridge, or in their bag in a bowl of cold water for 20 to 30 minutes, then dry them well. Wet prawns spit in the hot oil and stew instead of searing.',
    'If the garlic goes brown, do not carry on. Lift it out with a slotted spoon, let the oil cool for a minute and start again with fresh garlic. The prawn oil is still good, and bitter garlic would spoil the whole dish.',
    'Pull the prawns at a loose C. They keep cooking in the hot oil on the way to the table, and two minutes in total is all king prawns need.',
    'Dried chilies vary a lot. Snapped in half with their seeds, four guindillas give a real pil pil kick; leave them whole and they stay gentler. If you use bird\'s eye chilies, start with two, as they are much hotter.',
    'Any oil left in the pan is pure prawn and garlic flavour. Toss it through pasta the next day, or use it to fry eggs.',
  ],

  notes: [
    'Prawns: buy shell-on, since the shells make the oil; frozen raw ones are perfectly good. Head-on? Buy about 750g and fry the heads with the shells, pressing them hard. Only have peeled? Skip the shell oil, start the garlic and chilies in the olive oil from cold, and add a little more smoked paprika at the end.',
    'Guindillas: long, thin Spanish dried chilies, sold in Spanish delis and online. Any small dried red chili works, or 1 teaspoon of chili flakes stirred in for the last 30 seconds of the garlic, since flakes scorch faster.',
    'Paprika: hot smoked paprika (pimentón picante) in place of the sweet adds even more heat.',
    'Coriander: not traditional, but very good here.',
    'Gluten-free: the prawns themselves have no gluten. Serve them with gluten-free bread or with rice to soak up the oil.',
  ],

  variations: [
    'Milder, classic ajillo: use 2 chilies instead of 4 and leave them whole.',
    'Snappy prawns: toss the prawns with a quarter teaspoon of bicarbonate of soda along with the salt and leave them for 15 minutes. They come out firm, juicy and snappy.',
    'Champiñones al ajillo alongside: after straining the shell oil, fry 250g of quartered mushrooms in it over medium-high heat for 5 to 6 minutes until golden, push them to the side, then carry on with the garlic and prawns in the same pan.',
    'With spaghetti: cook 200g of spaghetti until just al dente, keep a mugful of the pasta water, then toss the drained pasta through the finished prawns and oil off the heat with a few splashes of the water until glossy. Skip the bread.',
    'Finish with a sliced fresh green chili and a handful of coriander for a greener, fresher heat on top of the dried chili.',
  ],

  storage:
    'Best eaten the moment it is made, while the oil is sizzling. Leftover prawns keep covered in the fridge for up to 1 day; warm them gently in their oil only until hot, as they toughen quickly. Leftover oil keeps in a covered jar in the fridge for up to 4 days once the garlic and chilies have been strained out.',

  dropcap: true,

  image: 'https://images.unsplash.com/photo-1782089543715-13daa38402b7?w=1200&q=80',
  imageIsStock: true,
};

export default recipe;
