// data/recipes/kimchi-fried-rice.ts
import type { RecipeInput } from './_types';

const recipe: RecipeInput = {
  title: 'Kimchi Fried Rice',
  country: 'South Korea',
  category: 'main',
  difficulty: 'Easy',
  servings: 2,
  time: { active: 30, total: 30 },
  yield: 'Serves 2 as a main',
  tags: ['quick', 'spicy', 'comfort food', 'budget-friendly'],

  region: 'East Asia',
  coordinates: { lat: 37.5665, lng: 126.978 },
  influences: ['South Korea'],

  ingredients: [
    {
      heading: 'The rice',
      items: [
        { name: 'cooked short-grain rice, made the day before and fridge-cold', amount: 500, unit: 'g', note: 1 },
      ],
    },
    {
      heading: 'The kimchi',
      items: [
        { name: 'well-fermented, sour kimchi, chopped into 1.5cm pieces', amount: 250, unit: 'g', note: 2 },
        { name: 'kimchi juice, squeezed from the chopped kimchi and topped up from the jar', amount: 4, unit: 'tbsp' },
        { name: 'sugar', amount: 1, unit: 'tsp' },
      ],
    },
    {
      heading: 'The base',
      items: [
        { name: 'neutral oil', amount: 1, unit: 'tbsp' },
        { name: 'unsalted butter, used in two halves', amount: 2, unit: 'tbsp', note: 3 },
        { name: 'onion, diced', amount: 0.5, unit: '' },
        { name: 'spring onions, sliced, whites and greens kept separate', amount: 4, unit: '' },
        { name: 'garlic cloves, finely chopped', amount: 2, unit: '' },
        { name: 'gochujang', amount: 1, unit: 'tbsp', note: 4 },
        { name: 'gochugaru, Korean chili flakes (optional)', amount: 1, unit: 'tsp', note: 5 },
        { name: 'light soy sauce', amount: 1, unit: 'tbsp', note: 4 },
        { name: 'toasted sesame oil', amount: 1, unit: 'tsp', note: 6 },
      ],
    },
    {
      heading: 'To finish',
      items: [
        { name: 'eggs', amount: 2, unit: '' },
        { name: 'neutral oil, for frying the eggs', amount: 1, unit: 'tbsp' },
        { name: 'roasted seaweed, crumbled', amount: 5, unit: 'g', note: 7 },
        { name: 'toasted sesame seeds', amount: 1, unit: 'tsp' },
        { name: 'green chilies, thinly sliced', amount: 2, unit: '' },
        { name: 'coriander, a small handful (optional)', amount: 0, unit: '' },
      ],
    },
  ],

  steps: [
    {
      heading: 'The day before',
      items: [
        'Cook about 225g of short-grain rice (sushi rice is ideal) the way you usually do, or keep back 500g from a rice dinner. Let it steam off in a shallow, open container for 10 minutes, then into the fridge it goes, well inside an hour of cooking, with the lid on once it is cold. A night in the fridge firms the grains enough to drink up the kimchi juice and still crisp against the pan. Rice cooked the same day goes pasty instead.',
      ],
    },
    {
      heading: 'Prep, before the pan goes on',
      items: [
        'Snip the kimchi into 1.5cm pieces with scissors in a bowl. Tip it into a sieve set over a bowl and press down hard with a spoon, or squeeze it in your fist, to get out as much juice as you can. Measure the juice and top it up to 4 tablespoons from the liquid in the jar. If the jar is dry too, make up the rest with water.',
        'Toss the squeezed kimchi with the sugar. Stir 2 teaspoons of the soy sauce into the kimchi juice and keep the last teaspoon of soy to one side for tasting at the end.',
        'Dice the onion, slice the spring onions with the whites and greens in separate piles, chop the garlic, slice the green chilies and crumble the seaweed. Measure the gochujang, gochugaru and sesame oil and put them by the hob.',
        'Take the rice out of the fridge. If it has set into a hard block, microwave it for 30 to 60 seconds, then loosen it gently with your fingers so the grains come apart without being crushed.',
      ],
    },
    {
      heading: 'Cook the kimchi down',
      items: [
        'Put a large non-stick frying pan or wok over medium heat with the oil and 1 tablespoon of the butter. When the butter foams, add the onion and spring onion whites and cook, stirring, for 2 to 3 minutes, until soft and translucent. Add the garlic and stir for 30 seconds, until it smells sweet.',
        'Turn the heat up to medium-high and add the sugared kimchi. Fry it, stirring every 30 seconds or so, for 5 to 6 minutes, until all its liquid has gone. You will hear the pan change from a wet bubble to a dry sizzle, the cabbage will turn translucent and a deeper red, and a few edges will catch and go sticky and brown. This is where the sourness softens and turns sweet, so give it the full time.',
        'Turn the heat down to medium. Add the second tablespoon of butter, the gochujang and the gochugaru, if using. Stir for about 1 minute, until the butter has melted red, the paste has loosened and coated every piece of kimchi, and it smells toasty rather than raw. Gochujang has sugar in it and catches quickly, so keep it moving.',
      ],
    },
    {
      heading: 'The rice, and the crust',
      items: [
        'Turn the heat up to medium-high, add the rice and fold it through the kimchi for about 2 minutes, breaking up any clumps with the edge of the spatula, until it is warm and evenly mixed.',
        'Drizzle the kimchi juice and soy over the rice and toss for 2 to 3 minutes, until every grain is stained red, the pan is dry again with no liquid pooling and the rice is steaming hot. Only then is it frying rather than steaming. Taste a spoonful. Kimchi varies a lot in salt, so add the last teaspoon of soy only if it tastes flat.',
        'Turn the heat down to medium. Press the rice into an even layer with the back of the spatula and leave it completely alone for 3 to 5 minutes, until it crackles and an edge lifted with the spatula shows a golden-brown crust underneath. If it smells like it is burning rather than toasting, turn the heat down a notch.',
        'While the rice crisps, heat the tablespoon of oil for the eggs in a small non-stick frying pan over medium-high heat until it shimmers. Crack in both eggs and fry for 2 to 3 minutes, until the edges are brown and frilly and the bases are crisp. Put a lid on for the last 30 seconds so the white over the yolk sets while the yolk stays runny.',
      ],
    },
    {
      heading: 'To the bowl',
      items: [
        'Take the rice off the heat, drizzle over the sesame oil and fold it through in big turns, so the crust breaks into chunks rather than crumbs. Divide between two bowls with the crispiest pieces on top.',
        'Sit a fried egg on each bowl and scatter over the seaweed and sesame seeds. Then pile on the spring onion greens and green chili, and the coriander if you are using it. Eat it straight away, mixing the soft yolk down into the red rice and the crackly bits from the bottom.',
      ],
    },
  ],

  nutrition: { calories: 765, protein: 18, carbs: 91, fat: 37 },
  flavorProfile: { sweet: 1, salty: 3, sour: 3, bitter: 0, umami: 4, spicy: 3 },

  isVegetarian: false,
  isVegan: false,
  isGlutenFree: false,
  isDairyFree: false,

  quote:
    'Sour kimchi fried in butter until it turns sticky and sweet, rice pressed into the pan until the bottom crackles, and a runny-yolked egg to break over the lot.',
  description:
    'Kimchi bokkeumbap is what Korean home cooks make when the kimchi in the fridge has gone properly sour and there is rice left over from yesterday. It is built from leftovers and tastes nothing like it. In this version the kimchi is squeezed before it goes in, so it fries in butter instead of stewing in its own brine, and it cooks until every drop of liquid has gone and the edges turn sticky and dark. The juice you squeezed out goes back in raw with the rice, bringing back the sharp, bright kimchi flavour that the long frying cooks away. A spoon of gochujang melts into a second knob of butter, then the rice is pressed flat and left alone until the bottom turns into a crackling crust. It finishes the Korean way, with a fried egg, crumbled roasted seaweed and sesame, and then a generous heap of spring onion greens and sliced green chili, the fresh, green finish this kitchen puts on almost everything.',
  attribution: 'A Nieves\'s Kitchen take on Korean kimchi bokkeumbap',

  headnoteIngredients:
    'Old, sour kimchi is the whole point, so this is the recipe for the jar that has been open a few weeks.',
  headnoteInstructions:
    'The only forward planning is the rice, which needs a night in the fridge. On the day, squeeze the kimchi and chop everything before you start, because the kimchi needs your attention once it is in the pan. The cooking runs in one direction: kimchi down until dry, butter and gochujang, rice and juice, then a few minutes of leaving it alone to crisp, which is exactly when you fry the eggs in a second pan.',

  equipment: [
    'A large non-stick frying pan, about 28cm, or a well-seasoned wok or cast-iron pan. The crust only forms, and only lets go, when the rice can sit in a thin layer on a surface it will not weld itself to.',
  ],

  tips: [
    'Properly sour kimchi smells sharp, the cabbage has gone soft and translucent, and the jar may fizz when you open it. A new, crunchy jar tastes flat in this dish. Either add 1 teaspoon of rice vinegar to the kimchi juice to make up the missing sourness, or leave the jar out of the fridge with the lid loosened for a day or two to get it going.',
    'Squeezing the kimchi is what lets it caramelise. Straight from the jar it is so wet that it boils for the first few minutes before it can fry. The juice is not wasted: it goes in raw with the rice, which is what keeps the finished dish tasting bright rather than only deep.',
    'The butter goes in two halves for a reason. A whole pan of butter would brown and then scorch over the kimchi\'s six minutes on the heat, so only half goes in early, with oil to protect it. The second half melts in with the gochujang and turns into a red, rounded sauce that coats every grain and takes the sharpest edge off the sourness.',
    'Want it hotter? Add more gochugaru or another sliced green chili, not more gochujang. Extra paste adds salt and sugar faster than it adds heat.',
    'The crust needs three things: a pan the rice will not stick to, a thin layer and your patience. A layer much deeper than 2cm traps its own steam and stays soft underneath, so for four people run two pans side by side, or make it in two rounds and keep the first warm in a low oven.',
  ],

  notes: [
    'Rice: about 225g of raw rice cooks up to the 500g you need. Any leftover rice works, jasmine and basmati included; short-grain simply gives the best crust.',
    'Kimchi: most kimchi is made with fish sauce or salted shrimp. If you are cooking for a vegetarian, look for a vegan kimchi.',
    'Butter: salted butter is fine, but taste before you reach for the last of the soy. For a dairy-free bowl, use oil for both halves and add a pinch more sugar with the kimchi.',
    'Gochujang and soy sauce: check the labels. For a gluten-free bowl, use tamari and a gluten-free gochujang.',
    'Gochugaru: no gochugaru? A pinch of ordinary chili flakes, or leave it out. It is mainly there for colour.',
    'Sesame oil: perilla oil works too. It is grassier and nuttier, and very Korean. Use the same teaspoon.',
    'Seaweed: the little packs of salted Korean roasted seaweed (gim) are perfect, or crumble a sheet of nori.',
  ],

  variations: [
    'Tinned tuna, the most Korean of the add-ins. Drain a 145g tin of tuna in oil and break it into flakes. Add it with the second half of the butter and the gochujang, and fry for 1 to 2 minutes so it picks up the colour before the rice goes in.',
    'Beef mince. Before the onion, heat the oil over high heat and fry 200g of beef mince, breaking it up, for 4 to 5 minutes, until browned all over with no pink left (71°C if you are checking). Season it with a pinch of salt, turn the heat down to medium, add the first half of the butter and carry on with the onion as written.',
    'Halal chicken or beef luncheon meat: use a halal-certified tin (never Spam, which is pork). Cut 150g into 1cm cubes and fry in the oil over medium-high heat for 3 to 4 minutes, until browned and crisp on a few sides. Turn the heat down to medium, add the first half of the butter and carry on with the onion as written. Luncheon meat is salty, so do not stir any soy into the kimchi juice; taste the rice at the end and add soy only if it needs it.',
    'Melted mozzarella, snack-bar style. Let the pressed rice crisp uncovered for 3 minutes first, so the crust has set. Then scatter over 60g of grated low-moisture mozzarella and put a lid on the pan for 1 to 2 minutes, until the cheese has melted. A lid on for the whole time traps steam and softens the crust. Eggs on top as usual. Choose a mozzarella made with microbial or vegetarian rennet, or a halal-certified one.',
  ],

  storage:
    'Not one for leftovers. The rice was cooked a day ago and the frying is its one reheat, so make only what you will eat tonight. To get ahead, cook the kimchi base up to the gochujang stage and keep it in the fridge for up to 3 days. On the night it is a ten minute dinner: warm the base through, then add the rice and carry on.',

  dropcap: true,

  image: 'https://images.unsplash.com/photo-1580442151529-343f2f6e0e27?w=1200&q=80',
  imageIsStock: true,
};

export default recipe;
