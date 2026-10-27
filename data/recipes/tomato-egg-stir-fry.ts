// data/recipes/tomato-egg-stir-fry.ts
import type { RecipeInput } from './_types';

const recipe: RecipeInput = {
  title: 'Tomato and Egg Stir-Fry',
  country: 'China',
  featuredIngredients: ['eggs'],
  category: 'main',
  difficulty: 'Easy',
  servings: 2,
  time: { active: 20, total: 30 },
  yield: 'Serves 2, spooned over rice',
  tags: ['quick', 'vegetarian', 'budget-friendly', 'comfort food'],

  region: 'East Asia',
  coordinates: { lat: 39.9042, lng: 116.4074 },

  ingredients: [
    {
      heading: 'The rice',
      items: [
        { name: 'jasmine rice', amount: 150, unit: 'g' },
        { name: 'water, for the rice', amount: 240, unit: 'ml' },
      ],
    },
    {
      heading: 'The eggs',
      items: [
        { name: 'eggs', amount: 4, unit: '' },
        { name: 'salt, for the eggs', amount: 0.25, unit: 'tsp' },
        { name: 'toasted sesame oil', amount: 0.25, unit: 'tsp' },
        { name: 'white pepper, a pinch', amount: 0, unit: '' },
        { name: 'water, for the eggs', amount: 1, unit: 'tbsp' },
        { name: 'neutral oil, for the eggs', amount: 2, unit: 'tbsp' },
      ],
    },
    {
      heading: 'The tomatoes',
      items: [
        { name: 'ripe tomatoes, about 4 medium, cut into wedges', amount: 500, unit: 'g', note: 1 },
        { name: 'spring onions, sliced, whites and greens kept separate', amount: 2, unit: '' },
        { name: 'garlic clove, finely chopped', amount: 1, unit: '' },
        { name: 'neutral oil, for the tomatoes', amount: 1, unit: 'tbsp' },
        { name: 'tomato ketchup', amount: 1, unit: 'tbsp', note: 2 },
        { name: 'salt, for the tomatoes', amount: 0.5, unit: 'tsp' },
        { name: 'water, for the sauce', amount: 60, unit: 'ml' },
        { name: 'Chinese black vinegar', amount: 0.5, unit: 'tsp', note: 3 },
        { name: 'sugar, to top up the sweetness (optional)', amount: 1, unit: 'tsp', note: 4 },
        { name: 'cornflour, mixed with 1 tbsp cold water (optional)', amount: 1, unit: 'tsp', note: 5 },
      ],
    },
  ],

  steps: [
    {
      heading: 'Rice first',
      items: [
        'Rinse the rice in a sieve until the water runs almost clear, then tip it into a small pan with the 240ml of water. Bring it to the boil, put the lid on, turn the heat to its lowest and cook for 12 minutes. Take it off the heat and leave it covered for 10 minutes. The stir-fry takes about 10 minutes, so do the prep while the rice cooks and start cooking once it is resting.',
      ],
    },
    {
      heading: 'Prep',
      items: [
        'Cut each tomato in half through the stem, cut out the hard core at the top, then cut each half into 4 wedges. Leave the seeds and jelly in. They hold the wedges together and turn into the sauce.',
        'Crack the eggs into a bowl with the quarter teaspoon of salt, the sesame oil, the white pepper and the tablespoon of water. Beat hard with chopsticks or a fork for about a minute, until the eggs are frothy and completely smooth, with no streaks of white. The air and the water are what make the curds puffy and soft.',
        'Slice the spring onions, keeping the whites and greens apart, and finely chop the garlic. If you are using the cornflour, stir it into its tablespoon of cold water and leave it by the hob.',
      ],
    },
    {
      heading: 'The eggs',
      items: [
        'Heat a wok over high heat for about 1 minute (in a large non-stick frying pan, use medium-high heat and do not heat it empty). Add the 2 tablespoons of oil, swirl it round and wait until it shimmers. Pour in the eggs. They should sizzle and puff at the edges straight away. Wait about 5 seconds, then push the set edges into the middle in big, slow folds, letting the runny egg flow out onto the hot pan.',
        'After about 30 seconds, when the eggs are in large, soft curds but still wet and glossy in places, about three-quarters cooked, tip them straight back into their bowl. They finish cooking in the sauce, so take them out sooner than feels right.',
      ],
    },
    {
      heading: 'The tomatoes',
      items: [
        'Keep the pan over high heat and add the last tablespoon of oil, the spring onion whites and the garlic. Stir for 15 seconds, until fragrant, then add the tomatoes. Stir-fry for 1 to 2 minutes, until the skins start to wrinkle and lift and the juices begin to run. Press a few wedges with the back of the spatula to help them along.',
        'Add the tablespoon of ketchup, the half teaspoon of salt and the 60ml of water. Bring it to a bubble, cover with a lid (a large baking tray will do on a wok) and cook for 2 minutes, until the tomatoes have softened right through. About half the wedges should still hold their shape and the rest should have slumped into a loose red sauce. If they are still firm, take the lid off and let it bubble for another 1 to 2 minutes, pressing a few more wedges. If the pan cooks dry before that, add another splash of water.',
        'Taste the sauce. It should taste sweet first, with the tomatoes\' tang close behind. If it tastes more sour than sweet, stir in the sugar a pinch at a time, up to the teaspoon, and add a pinch of salt if it tastes flat. Drizzle the black vinegar around the hot edge of the pan and stir it in: it should lift the sweetness, never taste of vinegar. If the sauce looks thin and watery, stir the cornflour mixture and add it a little at a time, until the sauce just turns glossy but still runs.',
      ],
    },
    {
      heading: 'Bring it together',
      items: [
        'Tip the eggs back in with any liquid from the bowl and fold them gently through the sauce for about 30 seconds, breaking them only into big pieces. Take the pan off the heat while the eggs still look soft.',
        'Fluff the rice, spoon it into two bowls and pile the tomato and egg on top with every bit of its sauce. Scatter over the spring onion greens and eat straight away.',
      ],
    },
  ],

  nutrition: { calories: 670, protein: 21, carbs: 76, fat: 32 },
  flavorProfile: { sweet: 3, salty: 2, sour: 3, bitter: 0, umami: 3, spicy: 0 },

  isVegetarian: true,
  isVegan: false,
  isGlutenFree: false,
  isDairyFree: true,

  quote:
    'Big, soft curds of egg folded through tomatoes cooked just long enough to slump into a sweet and sour sauce, all of it spooned over a bowl of rice.',
  description:
    'Tomato and egg is one of the first dishes many Chinese home cooks learn, and it earns its place: two main ingredients, ten minutes at the hob, and a sauce that turns a bowl of plain rice into dinner. The eggs are beaten hard and cooked fast in a very hot pan, so they puff into big, soft curds, then lifted out while they are still underdone. The tomatoes go in as wedges and cook only until about half of them collapse. They are sweetened with a spoon of ketchup rather than a heap of sugar, the modern home cook\'s trick, which gives a deeper red and a sauce with more body, with a little sugar to top it up only if the tomatoes need it. Half a teaspoon of black vinegar at the very end sharpens all that sweetness so it tastes bright rather than sugary. The eggs go back in at the very end, so they finish cooking in the sauce and stay soft.',
  attribution: 'A Nieves\'s Kitchen take on a Chinese home-cooking classic',

  headnoteIngredients:
    'The tomatoes make or break this, so buy the ripest, reddest ones you can find, on the vine if possible. Four medium tomatoes weigh about 500g. A tablespoon of ketchup does the sweetening here in place of most of the sugar, and it deepens both the colour and the flavour, which matters most when tomatoes are out of season and pale. Keep a little sugar to hand to top it up if your tomatoes are tart. Half a teaspoon of Chinese black vinegar at the end makes the sweetness taste bright.',
  headnoteInstructions:
    'Put the rice on first. The stir-fry itself takes about 10 minutes and moves quickly once the pan is hot, so have the eggs beaten, the tomatoes cut and everything else measured before you start.',

  tips: [
    'Take the eggs out at about three-quarters cooked. They go back into a hot sauce, and eggs cooked through the first time end up firm and dry instead of soft.',
    'Use the full 2 tablespoons of oil and a very hot pan for the eggs. That is what makes them puff into big, fluffy curds rather than setting into a flat omelette, so this is not the place to cut back.',
    'Beat the eggs for a whole minute, not a quick stir. The air you beat in is what makes the curds light.',
    'Pale, hard supermarket tomatoes usually want the ketchup and the full teaspoon of sugar. Very ripe summer tomatoes may need no sugar at all, so taste before you add any.',
    'Go easy with the black vinegar. Drizzled around the hot edge of the pan it sizzles and mellows, and half a teaspoon is enough to make the sweetness taste bright. Too much and the dish tastes sour.',
    'Stop when about half the tomatoes have collapsed. Cooked longer, the whole thing turns to purée. Cooked less, there is no sauce for the rice.',
  ],

  notes: [
    'Tomatoes: in winter, a 400g tin of whole plum tomatoes, roughly broken up, works in place of fresh. Leave out the water, since the tin brings its own juice, and simmer a minute or two longer.',
    'Ketchup: no ketchup? A teaspoon of tomato purée gives the same deeper colour. Add the full teaspoon of sugar, and a pinch more if needed.',
    'Black vinegar: a dark, mellow vinegar such as Chinkiang, sold in Chinese and Asian shops. It is brewed with wheat, so for a gluten-free bowl use a few drops of rice vinegar instead.',
    'Sugar: light brown sugar in place of white gives a rounder sweetness.',
    'Cornflour: potato starch works in the same amount.',
  ],

  variations: [
    'Green chili: add 1 or 2 sliced green chilies with the garlic, and scatter a handful of chopped coriander over the top with the spring onion greens.',
    'Ginger: a few thin slices of fresh ginger, cut into matchsticks and fried with the garlic, add a gentle warmth that rounds off the sharpness of the tomatoes.',
    'Chili oil: a spoonful over each bowl for heat. Check the label, as some chili oils contain meat.',
    'Tomato and egg noodle soup: once the tomatoes have softened, add 400ml of halal chicken or vegetable stock (check the label) and simmer for 3 minutes, leaving out the cornflour. Fold in the eggs and ladle it over two bowls of cooked noodles instead of rice.',
  ],

  storage:
    'Best straight from the pan, while the eggs are soft. Leftovers keep covered in the fridge for a day. Reheat gently, just until hot, so the eggs do not toughen. Cool any leftover rice quickly, get it into the fridge within an hour, and reheat it once only, until steaming hot.',

  dropcap: true,

  image: 'https://images.unsplash.com/photo-1660883495709-125336a5462f?w=1200&q=80',
  imageIsStock: true,
};

export default recipe;
