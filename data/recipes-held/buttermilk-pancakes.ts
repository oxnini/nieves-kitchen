// data/recipes-held/buttermilk-pancakes.ts
import type { RecipeInput } from '../recipes/_types';

const recipe: RecipeInput = {
  title: 'Fluffy Buttermilk Pancakes',
  featuredIngredients: ['milk'],
  category: 'dessert',
  difficulty: 'Easy',
  servings: 4,
  time: { active: 40, total: 55, resting: 15 },
  yield: 'About 14 pancakes, 11cm across; serves 4',
  tags: ['treat', 'vegetarian', 'comfort food', 'budget-friendly'],

  ingredients: [
    {
      heading: 'The dry mix',
      items: [
        { name: 'plain flour', amount: 280, unit: 'g' },
        { name: 'caster sugar', amount: 30, unit: 'g' },
        { name: 'baking powder', amount: 1.5, unit: 'tsp' },
        { name: 'bicarbonate of soda, level', amount: 0.5, unit: 'tsp' },
        { name: 'fine salt', amount: 0.5, unit: 'tsp' },
      ],
    },
    {
      heading: 'The wet mix',
      items: [
        { name: 'unsalted butter, melted', amount: 45, unit: 'g' },
        { name: 'buttermilk', amount: 480, unit: 'ml' },
        { name: 'large eggs', amount: 2, unit: '' },
        { name: 'alcohol-free vanilla extract', amount: 1, unit: 'tsp' },
        { name: 'milk, only if the batter needs loosening', amount: 0, unit: '' },
      ],
    },
    {
      heading: 'To cook and serve',
      items: [
        { name: 'butter, for the pan', amount: 2, unit: 'tbsp' },
        { name: 'butter, maple syrup or honey, to serve', amount: 0, unit: '' },
      ],
    },
  ],

  steps: [
    {
      heading: 'Before you start',
      items: [
        'Heat the oven to 110°C (90°C fan), or its lowest setting, with a wire rack set over a baking tray on the middle shelf. This is where the finished pancakes wait, so the whole batch reaches the table hot.',
        'If you think of it, take the buttermilk and eggs out of the fridge 30 minutes ahead. Fridge-cold batter is fine, but cool-room batter keeps the melted butter liquid and cooks through to the middle a little more evenly before the outside darkens.',
        'Melt the 45g of butter in a small pan over low heat, or in the microwave in 20 second bursts, and leave it to cool for 5 minutes, until warm rather than hot.',
      ],
    },
    {
      heading: 'Mix, then leave it alone',
      items: [
        'In a large bowl, whisk the flour, sugar, baking powder, bicarbonate of soda and salt together for 30 seconds, so the raising agents are spread evenly and no pancake gets a bitter pocket of bicarb.',
        'In a jug or second bowl, whisk the buttermilk, eggs and vanilla until the yolks disappear, then whisk in the warm melted butter. If the buttermilk is fridge-cold, the butter firms into small flecks. That is fine: they melt into the pancakes as they cook.',
        'Pour the wet mix into the dry and fold it together with a spatula or a whisk, about 12 to 15 strokes, scraping the bottom of the bowl once, just until there are no pockets of dry flour. Stop there, with lumps the size of peas still in the batter. Every extra stir works the gluten and makes the pancakes tough and flat.',
        'Leave the batter to rest, uncovered, for 10 to 15 minutes, while the pan heats. Do not stir it again. In that time the flour soaks up the liquid and the batter turns thick and puffy, with bubbles on the surface from the buttermilk and bicarb already at work.',
      ],
    },
    {
      heading: 'Heat the pan',
      items: [
        'About 5 minutes into the rest, set a large non-stick frying pan (28cm is ideal) or a flat griddle over medium heat and let it heat, empty, for 3 to 5 minutes. Even heat across the whole pan matters more than high heat.',
        'Test it: flick a few drops of water onto the pan. If they sit and fizz away slowly, it is not ready, so give it another minute. When they bead up and skitter across the surface before vanishing, the pan is ready. If the butter browns at once and smokes when it goes in, the pan is too hot: lift it off the heat for 30 seconds and turn the heat down a notch.',
      ],
    },
    {
      heading: 'The test pancake',
      items: [
        'Add a small knob of the pan butter and wipe it around with a folded piece of kitchen paper, leaving a thin, shiny film. Too much butter fries the pancakes in patches instead of browning them evenly.',
        'Scoop up 60ml of batter (a quarter-cup measure, or a ladle about two thirds full), taking it from the side of the bowl, and pour it onto the middle of the pan in one go from just above the surface. Do not spread it. It should slowly settle into a thick round about 11cm across.',
        'Cook until bubbles rise, pop and leave little open holes that stay open, starting around the edge, and the edge looks dry and matt, about 2 minutes. Lift one edge with a thin spatula and peek: the underside should be evenly golden brown. Then slide the spatula right under the middle and flip it in one quick, low move, keeping it close to the pan so it lands flat. Cook the second side for 1 to 1½ minutes, until it has puffed and the middle springs back when you press it lightly.',
        'Now read it, then taste it. Pale and flat after 2 minutes: turn the heat up a little. Dark brown before the bubbles reach the middle, or raw in the centre: turn it down. If it stayed domed and did not spread at all, stir 1 to 2 tablespoons of milk gently into the batter. The first one tells you exactly how to cook the rest.',
      ],
    },
    {
      heading: 'Cook the batch',
      items: [
        'Wipe on another thin film of butter and cook the pancakes 2 or 3 at a time, with at least 3cm between them, in the same way. A 28cm pan fits 3 only just, because they spread to about 11cm, so if the third would touch the others, cook 2. Cook them about 2 minutes on the first side, until the holes stay open and the underside is deep golden, then 1 to 1½ minutes on the second. Flip each one once only, and never press it down with the spatula, which squeezes out the air you have been protecting.',
        'As each batch is done, move the pancakes to the rack in the oven, uncovered and side by side. When the rack fills, overlap the later ones by a third, like roof tiles, rather than stacking them flat: stacking or covering traps steam and turns them soft and heavy. They hold well like this for about 20 minutes, which is roughly how long the whole batch takes. Re-butter the pan with a wipe of kitchen paper before every batch, and wipe out any dark specks so they do not burn onto the next round.',
        'The pan keeps building heat as you go, so if the later batches brown faster than the first, turn the heat down slightly. You should get about 14 pancakes. Serve them as soon as the last batch is off, stacked, with butter and maple syrup or honey.',
      ],
    },
  ],

  nutrition: { calories: 470, protein: 15, carbs: 69, fat: 16 },
  flavorProfile: { sweet: 3, salty: 1, sour: 1, bitter: 0, umami: 0, spicy: 0 },

  isVegetarian: true,
  isVegan: false,
  isGlutenFree: false,
  isDairyFree: false,

  quote:
    'Thick, tender pancakes with a soft tang from the buttermilk, golden on both sides and tall enough to soak up a slow pour of syrup.',
  description:
    'These are the thick, fluffy American kind: a stack of soft, tangy pancakes with a deep golden face, for a slow weekend breakfast. Nothing here is complicated, but each step is there to stop the usual problems. The batter is barely mixed and then left alone for a quarter of an hour, which keeps the pancakes tender and gives them their height. Buttermilk brings the tang and a light, open crumb, because its acid works with the bicarbonate of soda. The pan is judged with a few drops of water rather than a thermometer, and one test pancake tells you how to set the heat before the rest go in. Finished pancakes wait in a low oven on a rack, so everyone eats them hot at the same time. Maple syrup is the classic finish; a drizzle of honey over a knob of butter is just as good.',
  attribution: 'A Nieves\'s Kitchen take on American buttermilk pancakes',

  headnoteIngredients:
    'Buttermilk is what makes these taste like proper pancakes rather than plain batter: its gentle sourness gives the tang, and its acid reacts with the bicarbonate of soda to lift the pancakes and help them brown. Look for cartons of cultured buttermilk near the cream. If you have none, plain yogurt thinned with milk is the best stand-in (see substitutions). Ordinary plain flour is right here; strong or bread flour makes them chewy. Use baking powder and bicarbonate of soda opened within the last six months, since old raising agents are the quiet reason for flat pancakes. The vanilla must be alcohol-free; supermarkets and baking shops sell it beside the usual extract, or use the seeds of a vanilla pod. The nutrition covers the pancakes and the butter in the pan, not the syrup or butter on top.',
  headnoteInstructions:
    'Weigh the flour if you can: a little too much makes the batter stiff and the pancakes dry, and a little too little makes them spread thin. Then three things decide the result. Leave the lumps, because a smooth, well-beaten batter makes tough, flat pancakes. Rest the batter for 10 to 15 minutes without stirring it again. And get the pan evenly hot before the first pancake, using the water drop test, then let the test pancake tell you whether to nudge the heat up or down. After that it is just a steady rhythm of pour, wait for the holes, flip once.',

  tips: [
    'Treat the first pancake as a test, not a failure. It shows you the heat, the thickness of the batter and the seasoning, and it is the cook\'s to eat.',
    'Flip on holes, not bubbles. Bubbles appear early; it is ready when they pop and leave small open holes that stay open, and the edge looks dry and matt.',
    'Flip once, and never press down with the spatula. Pressing squeezes out the air and leaves you with a dense, flat pancake.',
    'Ladle from the side of the bowl without stirring. The rested batter is full of small bubbles, and stirring it knocks them out.',
    'If the pancakes are golden outside but gummy in the middle, the heat is too high or the batter too thick: turn the heat down a notch and pour slightly smaller pancakes.',
    'Butter in the pan, wiped thin, gives the lacy golden edge. For an even paler, smoother face, wipe the pan with a neutral oil instead.',
  ],

  substitutions: [
    'No buttermilk? The best stand-in is 160g plain yogurt (natural or Greek) whisked with 320ml milk until smooth. It is thick and tangy like buttermilk, and the pancakes come out very close to the real thing.',
    'Or stir 2 tablespoons of lemon juice or white vinegar into 480ml milk and leave it for 10 minutes until it thickens slightly. It works, but it is thinner and less tangy than buttermilk, so the pancakes spread a little more and come out slightly flatter and paler. Hold back 30ml of it and add only if the batter needs it.',
    'Do not use plain milk with no acid: the bicarbonate of soda has nothing to react with, so the pancakes stay flat and can taste soapy.',
    'Self-raising flour in place of plain: leave out the baking powder, keep the bicarbonate of soda. They rise a touch higher and taste very slightly less tangy.',
    'A gluten-free plain flour blend works weight for weight (add ¼ teaspoon xanthan gum if the blend has none). The pancakes are a little more fragile, so make them slightly smaller and flip with a wide spatula.',
    'Neutral oil, such as sunflower, can replace the melted butter in the batter. The pancakes taste less rich but stay just as fluffy.',
  ],

  variations: [
    'Extra fluffy, with whipped whites. Separate the eggs: whisk the yolks into the buttermilk, and in a clean, grease-free bowl whisk the whites to soft peaks that just hold their shape and droop at the tip. Make and rest the batter as written, then fold in the whites in two goes with a spatula, gently, until only a few white streaks remain. Cook straight away, before the whites start to sink. The pancakes come out taller and lighter, a little more cake-like.',
    'Blueberry. Do not stir the berries into the batter, which turns it grey and makes them sink and burn. Instead, pour each pancake, then drop 6 to 8 blueberries (about 150g for the batch) onto the wet top. Cook the first side 30 seconds longer and the second over slightly lower heat, so the berries burst without catching.',
    'Banana and cinnamon. Whisk 1 teaspoon of ground cinnamon into the dry mix. Thinly slice 2 ripe bananas and press 4 or 5 slices onto each pancake just after pouring. When you flip, the slices caramelise against the pan, so give the second side a little longer over slightly lower heat, about 1½ to 2 minutes.',
    'Honey butter, to serve. Beat 60g of soft salted butter with 1½ tablespoons of honey and a pinch of flaky salt until pale and fluffy, about 1 minute. Spread a spoonful over the hot stack and let it melt in.',
    'Make-ahead dry mix. Weigh four batches of the dry mix into one big bowl (1120g flour, 120g caster sugar, 6 teaspoons baking powder, 2 teaspoons bicarbonate of soda, 2 teaspoons fine salt), whisk well and store in an airtight jar for up to 3 months. Each batch is 322g of mix: whisk or shake the jar before weighing, since the raising agents can settle, then carry on from the wet mix.',
    'British thin pancakes, for rolling with lemon and sugar. Whisk 100g plain flour, 2 large eggs, 300ml milk, 1 tablespoon of melted butter and a pinch of salt into a smooth batter, with no lumps this time. Rest it for 30 minutes if you can. Heat a 20cm frying pan over medium-high heat, wipe it with butter, pour in about 45ml of batter and swirl at once to coat the base thinly. Cook for about 1 minute, until the edge lifts and the underside is lacy gold, then flip and cook for 30 seconds. Makes about 8. Squeeze over lemon, scatter with caster sugar and roll up.',
    'Japanese soufflé pancakes, tall and wobbly (makes 3, for 1). Separate 2 large eggs and put the whites in the freezer for 15 minutes. Whisk the yolks with 1½ tablespoons of milk and ¼ teaspoon alcohol-free vanilla extract until pale, then whisk in 30g plain flour and ½ teaspoon baking powder until smooth. Whisk the chilled whites until foamy, add 25g caster sugar in three goes and whisk to stiff, glossy peaks that stand upright. Fold the meringue into the yolk mix in three additions, gently, until no white streaks show. Heat a non-stick pan with a lid over the lowest heat, wipe it with oil, and spoon in 3 tall mounds. Add 1 tablespoon of water to the gaps in the pan, cover, and cook for 6 to 7 minutes; at the 2 minute mark, add a last spoonful of batter to the top of each mound and cover again. Flip gently, add another tablespoon of water, cover and cook for 4 to 5 minutes, until the sides feel set. Eat straight away, before they sink.',
  ],

  storage:
    'Pancakes are best straight from the pan, and the cooked batch holds in the low oven for up to 20 minutes. Leftovers keep in an airtight box in the fridge for 3 days. To freeze, cool them on the rack, lay them flat with baking paper between them and bag them for up to 2 months. Reheat from frozen in a toaster, or on a tray in a 180°C (160°C fan) oven for 8 to 10 minutes; the microwave works too, but leaves them softer. The batter is best cooked within 30 minutes of mixing. Leftover batter keeps covered in the fridge overnight, but the raising agents tire, so the pancakes come out flatter.',

  dropcap: true,

  image: 'https://images.unsplash.com/photo-1650134973809-d8c3a2da59ba?w=1200&q=80',
  imageIsStock: true,
};

export default recipe;
