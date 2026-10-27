// data/recipes/banana-bread.ts
import type { RecipeInput } from './_types';

const recipe: RecipeInput = {
  title: 'Brown Butter Banana Bread',
  featuredIngredients: ['butter'],
  category: 'dessert',
  difficulty: 'Easy',
  servings: 10,
  time: { active: 30, total: 145, resting: 45 },
  yield: '1 loaf, 10 slices',
  tags: ['baking', 'treat', 'vegetarian', 'comfort food'],

  ingredients: [
    {
      heading: 'The loaf',
      items: [
        { name: 'unsalted butter', amount: 115, unit: 'g', note: 1 },
        { name: 'very ripe bananas, peeled weight (about 3 large)', amount: 380, unit: 'g', note: 2 },
        { name: 'dark brown soft sugar', amount: 110, unit: 'g' },
        { name: 'caster or granulated sugar', amount: 55, unit: 'g' },
        { name: 'large eggs, at room temperature', amount: 2, unit: '' },
        { name: 'vanilla extract', amount: 2, unit: 'tsp', note: 3 },
        { name: 'plain flour', amount: 220, unit: 'g', note: 4 },
        { name: 'bicarbonate of soda, level', amount: 1, unit: 'tsp' },
        { name: 'ground cinnamon', amount: 1, unit: 'tsp' },
        { name: 'fine salt', amount: 0.75, unit: 'tsp' },
        { name: 'dark chocolate (70%), chopped into chunks', amount: 90, unit: 'g', note: 5 },
      ],
    },
    {
      heading: 'The top',
      items: [
        { name: 'dark chocolate (70%), chopped into chunks', amount: 30, unit: 'g' },
        { name: 'pecans, toasted and chopped', amount: 25, unit: 'g', note: 6 },
        { name: 'demerara or granulated sugar', amount: 1, unit: 'tbsp' },
        { name: 'a little soft butter, for the tin', amount: 0, unit: '' },
      ],
    },
  ],

  steps: [
    {
      heading: 'Get ready',
      items: [
        'Heat the oven to 180°C (160°C fan) with a shelf in the middle. Grease a 900g (2lb) loaf tin, about 23 x 13cm, right into the corners, then line the base and both long sides with one strip of baking paper that hangs over the edges, so you can lift the loaf out later. Take the eggs out of the fridge, or sit them in a bowl of warm tap water for 5 minutes.',
        'Spread the 25g of pecans on a small tray and toast them in the oven as it heats, for 6 to 8 minutes, until they smell nutty and are a shade darker, then cool and chop roughly. They all go on top, where they toast again in the oven. Untoasted nuts taste of very little, so do not skip this.',
      ],
    },
    {
      heading: 'Brown the butter',
      items: [
        'Melt the 115g of butter in a small, light-coloured pan over medium heat, swirling often. It foams and crackles, goes quiet, then brown flecks appear on the bottom and it smells nutty, after 5 to 8 minutes. Pour it straight into a large bowl, scraping in every brown bit, because that is where the flavour is. Leave it for 10 minutes, until warm rather than hot, so it will not cook the eggs.',
        'Meanwhile, mash the bananas with a fork until mostly smooth, with a few small lumps left for texture. Chop the chocolate into chunks, keeping 30g of the biggest pieces for the top.',
      ],
    },
    {
      heading: 'The batter',
      items: [
        'Whisk both sugars into the warm brown butter, leave it for a minute, then whisk again until glossy. Beat in the eggs one at a time, then the vanilla, then stir in the mashed bananas.',
        'In another bowl, whisk the flour, bicarbonate of soda, cinnamon and salt together. Tip them into the wet mix and fold with a spatula until there are no dry streaks left, then stop: overmixing makes the loaf tough. Fold in the 90g of chocolate with the last couple of turns.',
      ],
    },
    {
      heading: 'Top and bake',
      items: [
        'Scrape the batter into the tin and level the top. Scatter the reserved chocolate and pecans over it and pat them down gently, so they sit about halfway into the batter. Sprinkle the demerara over the whole surface for a crackly crust.',
        'Bake on the middle shelf. Most ovens take 50 to 65 minutes, but ovens vary a lot, so start checking at 45 minutes and keep checking every 3 to 5 minutes. Push a skewer or toothpick into the centre, missing the chocolate: the moment it comes out mostly clean, with a few moist crumbs, take the loaf out. Going from sticky to dry can take seconds or minutes, so do not wander off. If the top is already deep brown at 35 minutes, lay a sheet of foil loosely over it.',
        'Cool the loaf in the tin for 15 minutes, then lift it out by the paper onto a rack. Leave it at least 30 minutes more before slicing, or it will tear. Warm, not hot, is the best moment to eat it. Cut it into 10 slices with a serrated knife.',
      ],
    },
  ],

  nutrition: { calories: 375, protein: 6, carbs: 49, fat: 18 },
  flavorProfile: { sweet: 4, salty: 1, sour: 0, bitter: 1, umami: 0, spicy: 0 },

  isVegetarian: true,
  isVegan: false,
  isGlutenFree: false,
  isDairyFree: false,

  quote:
    'Brown butter, dark sugar and very ripe bananas baked into a deep, toffee-edged loaf, with chocolate and toasted pecans pressed into a crackly sugar top.',
  description:
    'This is the rich kind of banana bread: brown butter, dark brown sugar, chunks of dark chocolate and toasted pecans, under a crackly sugar top. Browning the butter first gives the whole loaf a toffee, toasted-nut depth that plain melted butter never does, and the dark sugar holds on to moisture and tastes of caramel. There is no sour cream or yogurt: the butter, sugar and bananas carry all the moisture. The pecans and some of the chocolate go on top, pressed halfway into the batter, so they toast in the oven and every slice has some. It is the easy kind of bake: two bowls, a small pan, no mixer.',
  attribution: 'A Nieves\'s Kitchen take on the classic banana loaf',

  headnoteIngredients:
    'Use bananas with heavily freckled to mostly black skins: they are sweeter and softer, and mash into the batter instead of sitting in it as starchy lumps. Weigh them peeled, because three bananas can mean anything from 300g to 450g. If yours are still yellow, the air fryer or oven will ripen them (see note 2). A 70% dark chocolate keeps the loaf from tasting too sweet.',
  headnoteInstructions:
    'Brown the butter first and do everything else while it cools. The batter takes ten minutes. The two things that decide the crumb are folding the flour in gently and taking the loaf out the moment a skewer comes out mostly clean. Let it cool for at least 45 minutes before you slice.',

  equipment: [
    'A 900g (2lb) loaf tin, about 23 x 13cm. If the batter comes more than three quarters of the way up, bake the extra in a ramekin and check it at 20 minutes.',
  ],

  tips: [
    'Weigh the bananas. Too little banana gives a dry, bready loaf and too much a heavy, damp one. 380g peeled is what this loaf is balanced for; up to 20g either side is fine.',
    'The usual reason banana bread turns out dry is overbaking. Check early and often, and take it out as soon as the skewer shows moist crumbs rather than wet batter.',
    'If you have time, leave the batter in the bowl for 20 to 30 minutes before it goes into the tin. The flour soaks up the liquid and the loaf bakes with a better dome. Skip it if you are in a hurry.',
    'Using frozen bananas? Thaw them in a sieve over a bowl, weigh 380g of the drained flesh, and leave the watery liquid out, or the loaf turns gummy.',
    'It slices most cleanly the next day. Once it is completely cool, wrap it tightly and leave it at room temperature overnight.',
  ],

  notes: [
    'Butter: unsalted lets you set the salt. With salted butter, cut the fine salt to ¼ teaspoon.',
    'Bananas not ripe enough: air-fry them whole in their skins at about 150°C for about 12 minutes (or roast at 180°C (160°C fan) for 15 to 20 minutes), until the skins are black and the flesh is soft, then cool and scoop out the flesh with any juice. Bananas ripened this way are less sweet than ones that blackened on their own, so add 1 extra tablespoon of dark brown sugar.',
    'Vanilla: check the label on your vanilla extract.',
    'Gluten-free: a gluten-free plain flour blend works weight for weight; add ¼ teaspoon of xanthan gum if the blend has none. Let it cool completely before slicing, as the crumb is more fragile.',
    'Chocolate: a chopped bar melts into pools, chips hold their shape. Either works, or use 55% to 70% if you like it less bitter.',
    'Pecans: walnuts work the same way. For a nut-free loaf, leave them out (about 355 kcal a slice).',
  ],

  variations: [
    'Plain banana bread. Leave out the chocolate and pecans and just scatter the demerara over the top. About 285 kcal a slice.',
    'Banana on top. In place of the chocolate and pecan topping, halve a just-ripe banana lengthways and lay the halves cut side up along the top, with a 2cm gap down the middle so the loaf can rise and crack there, then scatter over the demerara. Test in the crack, not through the banana, which stays wet however long it bakes.',
    'Crumble top. Rub 30g of cold butter into 40g of plain flour, 30g of light brown sugar and ½ teaspoon of cinnamon until it forms clumps, and scatter it over the batter in place of the topping. Lay foil over it if it is deep brown by 30 minutes.',
  ],

  storage:
    'Wrap it well and keep it at room temperature for 3 to 4 days. The fridge dries it out. To freeze, wrap slices individually and freeze for up to 3 months; thaw at room temperature for an hour, or toast from frozen.',

  dropcap: true,

  image: 'https://images.unsplash.com/photo-1767065888045-8fb06df78e55?w=1200&q=80',
  imageIsStock: true,
};

export default recipe;
