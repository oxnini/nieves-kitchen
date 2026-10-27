// data/recipes/egg-fried-rice.ts
import type { RecipeInput } from './_types';

const recipe: RecipeInput = {
  title: 'Egg Fried Rice with a Crispy Fried Egg',
  country: 'China',
  featuredIngredients: ['eggs'],
  category: 'main',
  difficulty: 'Easy',
  servings: 2,
  time: { active: 25, total: 25 },
  yield: 'Serves 2, each with a crispy fried egg on top',
  tags: ['quick', 'vegetarian', 'budget-friendly', 'comfort food', 'spicy'],

  region: 'East Asia',
  coordinates: { lat: 32.3942, lng: 119.4129 },

  ingredients: [
    {
      heading: 'The rice',
      items: [
        { name: 'cooked jasmine rice, made the day before and fridge-cold (from about 200g raw rice)', amount: 500, unit: 'g', note: 1 },
      ],
    },
    {
      heading: 'The eggs',
      items: [
        { name: 'eggs, for frying on top', amount: 2, unit: '' },
        { name: 'neutral oil, for frying the eggs', amount: 2, unit: 'tbsp' },
        { name: 'eggs, for scrambling through the rice', amount: 3, unit: '' },
        { name: 'salt, for the beaten eggs', amount: 0.25, unit: 'tsp' },
      ],
    },
    {
      heading: 'Aromatics and seasoning',
      items: [
        { name: 'neutral oil, for the rice', amount: 1, unit: 'tbsp' },
        { name: 'garlic cloves, finely chopped', amount: 3, unit: '' },
        { name: 'fresh ginger, finely chopped (about a 3cm piece)', amount: 1, unit: 'tbsp' },
        { name: 'spring onions, sliced, whites and greens kept separate', amount: 3, unit: '' },
        { name: 'frozen peas, thawed (optional)', amount: 75, unit: 'g' },
        { name: 'light soy sauce', amount: 1, unit: 'tbsp', note: 2 },
        { name: 'dark soy sauce, for colour', amount: 0.5, unit: 'tsp', note: 2 },
        { name: 'sugar', amount: 0.5, unit: 'tsp' },
        { name: 'white pepper', amount: 0.25, unit: 'tsp' },
        { name: 'MSG (optional)', amount: 0.25, unit: 'tsp', note: 3 },
        { name: 'toasted sesame oil', amount: 1, unit: 'tsp' },
        { name: 'salt, a pinch for the fried eggs and to taste', amount: 0, unit: '' },
      ],
    },
    {
      heading: 'To finish',
      items: [
        { name: 'green chilies, thinly sliced', amount: 3, unit: '' },
        { name: 'coriander, roughly chopped, a big handful', amount: 20, unit: 'g' },
        { name: 'chili crisp, a spoonful per bowl', amount: 2, unit: 'tbsp', note: 4 },
      ],
    },
  ],

  steps: [
    {
      heading: 'The rice, the day before',
      items: [
        'Cook the rice the day before. Spread it out on a tray or a wide plate to cool, get it into the fridge within an hour, and leave it uncovered for the first hour so the surface dries, then cover it for the night.',
        'Forgot? Use the same-day trick instead. Cook the rice with a little less water than usual, spread it thinly on a tray and let the steam come off for 10 minutes, then chill it uncovered in the fridge for at least 1 hour. It will not be quite as firm as day-old rice, but it fries.',
      ],
    },
    {
      heading: 'Before the wok goes on',
      items: [
        'Break up the cold rice with your fingers until there are no clumps left and every grain is loose. Damp hands stop it sticking to you. Any lump that goes into the wok cold comes out as a lump.',
        'Beat the 3 eggs for scrambling with the quarter teaspoon of salt until no streaks of white remain. Crack the 2 eggs for frying into two separate small cups.',
        'Finely chop the garlic and ginger, slice the spring onions and keep the whites and greens apart, slice the green chilies and chop the coriander. Stir the light soy, dark soy, sugar, white pepper and MSG, if using, together in a small bowl until the sugar dissolves, so they go in at once. If you are using peas, tip them into a sieve and run hot water over them for a minute to thaw, then shake them dry. Straight from frozen they cool the wok and steam the rice. Have everything by the hob. Once the wok is hot there is no time to chop.',
      ],
    },
    {
      heading: 'The crispy eggs',
      items: [
        'Heat the wok over high heat for about 1 minute, add the 2 tablespoons of oil and swirl it round, then wait until the oil shimmers and gives off the first wisp of smoke. (In a non-stick pan, use medium-high heat and never heat it empty.) Slide in one egg from its cup. It will spit and puff up straight away, which is exactly what you want.',
        'Tilt the wok so the oil pools to one side and spoon it over the white, but not the yolk, for about 30 seconds, until the white sets and blisters. Then leave it alone until the edges are deep brown and lacy, about 1 to 2 minutes in all. Lift it onto a plate with a slotted spatula, sprinkle it with a pinch of salt, and fry the second egg the same way. In a wide frying pan both eggs fit at once.',
        'Leave the fried eggs uncovered while you make the rice. Covered, they steam and the edges go soft. If you like your yolk set rather than runny, put a lid on the wok for the last 30 seconds of frying.',
      ],
    },
    {
      heading: 'The scrambled egg',
      items: [
        'Keep the oil from the fried eggs in the wok, scooping out any loose crispy bits, and turn the heat down to medium-high. Pour in the beaten eggs and let them puff for about 10 seconds, then push them round in big, soft folds until they are only just set and still a little wet in places, about 30 seconds. Tip them into a bowl. They finish cooking in the rice.',
      ],
    },
    {
      heading: 'Fry the rice',
      items: [
        'Turn the heat back up to high and add the tablespoon of oil. Add the garlic, ginger and spring onion whites and stir for 20 to 30 seconds, until they smell sweet and are only just turning pale gold. Do not let the garlic brown.',
        'Add the rice, and the thawed peas if you are using them. Toss everything through the oil, then press the rice flat against the wok and leave it for 20 to 30 seconds before tossing again. Keep pressing and tossing for 3 to 4 minutes, until the rice is steaming hot all the way through, the grains jump in the pan and a few have toasted golden.',
        'Pour the soy mixture around the hot sides of the wok rather than straight onto the rice, so it sizzles and catches for a second before you toss it in. Toss for about 1 minute, until every grain is evenly coloured.',
        'Tip the scrambled egg back in with the spring onion greens and break it into big pieces as you toss, for about 30 seconds. Take the wok off the heat, drizzle over the sesame oil and stir through most of the green chili and coriander, keeping a little back for the top. Taste, and add a pinch of salt only if it needs it.',
      ],
    },
    {
      heading: 'To the bowl',
      items: [
        'Divide the rice between two bowls and sit a crispy egg on each. Spoon the chili crisp over the eggs and scatter over the last of the green chili and coriander. Break the yolk into the rice as you eat, and it becomes the sauce.',
      ],
    },
  ],

  nutrition: { calories: 865, protein: 28, carbs: 92, fat: 42 },
  flavorProfile: { sweet: 1, salty: 3, sour: 0, bitter: 0, umami: 4, spicy: 3 },

  isVegetarian: true,
  isVegan: false,
  isGlutenFree: false,
  isDairyFree: true,

  quote:
    'Day-old rice fried hot with garlic and ginger, buried in green chili and coriander, with a lacy-edged fried egg and a spoon of chili crisp sliding off the top.',
  description:
    'Egg fried rice is the quickest proper dinner there is, and this is the version that turns it from a side into a main. The base is the classic one: day-old rice fried hard so the grains stay separate and a few of them toast, soft curds of egg folded back through, and a splash of soy hissed round the hot sides of the wok. Ginger goes in alongside the garlic for warmth, and once the wok is off the heat a big handful of sliced green chili and coriander goes through it, so it tastes as fresh as it does savoury. Then each bowl gets a fried egg with crisp, lacy edges and a runny yolk, and a spoonful of chili crisp over the top. There is also a keema masala version in the variations, which I tried once and loved.',
  attribution: 'A Nieves\'s Kitchen take on Chinese egg fried rice',

  headnoteIngredients:
    'The rice is the whole recipe. Use long-grain rice cooked the day before and kept in the fridge: about 200g of raw jasmine gives the 500g of cooked rice you need.',
  headnoteInstructions:
    'Fried rice moves fast, so get everything chopped, measured and next to the hob before you turn it on. The crispy eggs are fried first. That way they are done and out of the way, and the oil they leave behind scrambles the eggs and fries the rice. After that it is about 7 minutes of steady tossing.',

  equipment: [
    'A wok, or the widest frying pan you have (28cm or more), so the rice spreads out and fries instead of piling up and steaming.',
  ],

  tips: [
    'Day-old rice fries because a night in the fridge firms the grains and dries their surface. Fresh, warm rice is soft and wet, so it steams and clumps together in the pan.',
    'Treat cooked rice with care. Cool it quickly and get it into the fridge within an hour of cooking, then fry it within a day. Spreading it on a tray is what makes the quick cooling easy.',
    'Do not double the recipe in one go. 500g of rice is about as much as a home wok or a big frying pan can fry rather than steam. For four, cook it in two batches.',
    'Take the scrambled egg out while it still looks slightly underdone. It goes back into a hot wok and finishes there. Cooked through the first time, it ends up dry and rubbery.',
    'For a crispy fried egg the oil has to be properly hot before the egg goes in, and there has to be enough to spoon over it. Baste the white, not the yolk, and the edges go lacy and brown while the yolk stays runny.',
    'The green chili and coriander go in off the heat so they stay fresh and sharp against the soy. Be generous. This is meant to taste green.',
  ],

  notes: [
    'Rice: any long-grain rice works. Leftover basmati fries beautifully, and brown rice works too, it just stays chewier.',
    'Soy sauce: check the labels. No dark soy? Leave it out; it is there for colour, and the rice will simply be paler. For gluten-free, use tamari in place of the light soy and skip the dark.',
    'MSG: leave it out if you prefer, and taste for salt at the end instead.',
    'Chili crisp: pick a plain one and check the label, since some jars in the same range are made with meat. No chili crisp? A spoonful of chili oil, or crispy fried onions and a pinch of chili flakes for the crunch.',
  ],

  variations: [
    'Keema masala fried rice. Once the garlic, ginger and spring onion whites have had their 20 seconds, turn the heat down to medium and add 1 tablespoon of keema masala (the Pakistani spice mix for minced meat, sold in packets) with an extra teaspoon of oil. Stir for 15 to 20 seconds, until it darkens a shade and smells toasty. Add the rice straight away so the spices do not scorch, turn the heat back up to high and carry on as above. The mix already carries salt and chili, so cut the light soy to 2 teaspoons, leave out the dark soy, and taste before adding any salt. Keep every bit of the green chili and coriander. They belong with it even more.',
    'Crispy garlic: before the eggs, fry 4 thinly sliced garlic cloves in the 2 tablespoons of oil over medium-low heat, stirring, until pale gold, 3 to 4 minutes. Lift them onto kitchen paper, where they crisp as they cool, then fry the eggs in the garlic oil and scatter the crisp garlic over the bowls at the end.',
    'Special fried rice: toss in 150g small cooked prawns and 100g diced cooked chicken with the rice, until hot through. The halal take on the takeaway classic.',
    'Any vegetables you have: diced carrot, sweetcorn, chopped green beans or shredded cabbage. Give the harder ones a minute in the oil before the rice goes in, and keep it to a couple of handfuls so the rice still fries.',
    'Golden fried rice: instead of scrambling the 3 eggs, stir them into the cold rice before it goes into the wok, so every grain fries up coated and gold. The egg disappears into the rice rather than sitting in curds.',
  ],

  storage:
    'Best eaten straight away, while the fried egg is still crisp. Leftover rice, without the fried egg, should be cooled and in the fridge within an hour and eaten within a day. Reheat it once only, in a hot pan with a splash of water, until it is steaming hot all the way through.',

  dropcap: true,

  image: 'https://images.unsplash.com/photo-1600688654899-379ec76aca42?w=1200&q=80',
  imageIsStock: true,
};

export default recipe;
