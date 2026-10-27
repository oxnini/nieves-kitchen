// data/recipes/lemon-loaf.ts
import type { RecipeInput } from './_types';

const recipe: RecipeInput = {
  title: 'Lemon Loaf',
  category: 'dessert',
  difficulty: 'Easy',
  servings: 8,
  time: { active: 30, total: 170, resting: 100 },
  yield: 'One 900g (2lb) loaf tin, 8 slices',
  tags: ['baking', 'treat', 'vegetarian'],

  ingredients: [
    {
      heading: 'The loaf',
      items: [
        { name: 'large lemons, for the zest and all the juice', amount: 2, unit: '', note: 1 },
        { name: 'granulated or caster sugar', amount: 140, unit: 'g' },
        { name: 'large eggs, at room temperature', amount: 2, unit: '' },
        { name: 'lemon juice', amount: 20, unit: 'ml' },
        { name: 'sunflower or vegetable oil', amount: 80, unit: 'ml', note: 2 },
        { name: 'plain full-fat yogurt', amount: 120, unit: 'g', note: 3 },
        { name: 'plain flour', amount: 130, unit: 'g', note: 4 },
        { name: 'baking powder', amount: 0.75, unit: 'tsp' },
        { name: 'bicarbonate of soda', amount: 0.125, unit: 'tsp' },
        { name: 'fine salt', amount: 0.5, unit: 'tsp' },
        { name: 'a little oil or butter, for the tin', amount: 0, unit: '' },
      ],
    },
    {
      heading: 'The syrup',
      items: [
        { name: 'lemon juice', amount: 30, unit: 'ml' },
        { name: 'granulated or caster sugar', amount: 20, unit: 'g' },
      ],
    },
    {
      heading: 'The icing',
      items: [
        { name: 'icing sugar', amount: 85, unit: 'g' },
        { name: 'lemon juice', amount: 20, unit: 'ml' },
      ],
    },
  ],

  steps: [
    {
      heading: 'Get ready',
      items: [
        'Heat the oven to 180°C (160°C fan) with a shelf in the middle. Grease a 900g (2lb) loaf tin, then line the base and both long sides with one strip of baking paper that hangs over the edges, so you can lift the loaf out later. Take the eggs out of the fridge if you have not already, or sit them in warm tap water for 5 minutes.',
        'Zest both lemons into a large bowl, taking only the yellow and none of the bitter white pith. Then juice them: you need 20ml for the batter, 30ml for the syrup and 20ml for the icing.',
      ],
    },
    {
      heading: 'The batter',
      items: [
        'Add the 140g of sugar to the zest and rub it together with your fingertips for 1 to 2 minutes, until the sugar is damp, pale yellow and smells strongly of lemon. This is where most of the lemon flavour comes from.',
        'Add the eggs and whisk hard for about 1 minute, until paler, thicker and a bit airy. Whisk in the 20ml of lemon juice, then pour in the oil slowly while whisking. Add the yogurt and whisk until smooth.',
        'In a second bowl, whisk the flour, baking powder, bicarbonate of soda and salt together. Fold half into the wet mix with a spatula, then the rest, only until you cannot see dry flour. Stop there: overmixing makes it tough. Pour into the tin and level the top.',
      ],
    },
    {
      heading: 'Bake and soak',
      items: [
        'Bake on the middle shelf. Most ovens take 35 to 45 minutes, but ovens vary a lot, so start checking at 30 minutes and keep checking every 3 to 5 minutes. Push a skewer or toothpick into the centre: the moment it comes out mostly clean, with a few moist crumbs, and the top springs back, take it out. Going from sticky to dry can take seconds or minutes. If the top is browning too fast, lay a sheet of foil loosely over it.',
        'While it bakes, make the syrup. Warm the 30ml of lemon juice and 20g of sugar in a small pan over low heat, stirring, until the sugar dissolves and it just starts to bubble, 1 to 2 minutes. Take it off the heat.',
        'Let the loaf sit in the tin for 10 minutes, then lift it out by the paper onto a rack or plate and peel the paper back. Poke holes all over the top with a skewer and brush the warm syrup over the top and sides until it is all used.',
      ],
    },
    {
      heading: 'Cool, then ice',
      items: [
        'Leave it until completely cool, at least 1 hour. Icing on a warm cake just melts and slides off.',
        'Whisk the 85g of icing sugar with most of the 20ml of lemon juice, then add the rest a few drops at a time. You want it thick, like toothpaste loosened slightly, so it spreads but does not run. Pour it over the top, nudge it to the edges and let it set for about 30 minutes before slicing.',
      ],
    },
  ],

  nutrition: { calories: 300, protein: 4, carbs: 45, fat: 11 },
  flavorProfile: { sweet: 4, salty: 1, sour: 3, bitter: 0, umami: 0, spicy: 0 },

  isVegetarian: true,
  isVegan: false,
  isGlutenFree: false,
  isDairyFree: false,

  quote:
    'A moist, very lemony loaf soaked in warm lemon syrup, then finished with a thick lemon icing once it is cold.',
  description:
    'A coffee-shop lemon loaf in a smaller, two-egg size: a moist crumb from oil and yogurt, a lemon syrup soaked in while it is warm, and a thick lemon icing on top once it is cold. There is no extract, only real lemon. The zest of both lemons is rubbed into the sugar before anything else, so the crumb tastes of lemon rather than only of sourness, and the syrup makes it sharp right down to the base. It is mixed by hand in two bowls and bakes in an ordinary 2lb loaf tin, where it comes out a little shorter than a full-size loaf. The same recipe makes an orange loaf too (see the variations).',
  attribution: 'A Nieves\'s Kitchen take on the coffee-shop lemon loaf',

  headnoteIngredients:
    'Two large lemons give the zest for the loaf and about 70ml of juice for the batter, syrup and icing. Use freshly squeezed juice, not bottled, which tastes flat. Plain full-fat yogurt gives the softest crumb, and fat-free works too with a spoonful more oil (see note 3).',
  headnoteInstructions:
    'One rule to remember: the syrup goes on warm, the icing goes on cold. Ten minutes after the loaf comes out of the oven it gets the syrup; an hour or so later, once it is cool right through, it gets the icing. It also keeps well overnight, so you can bake it the day before and ice it on the day.',

  equipment: [
    'A 900g (2lb) loaf tin, about 23 x 13cm. The loaf comes out fairly short in it. A 450g (1lb) tin gives a taller loaf: start checking it at 40 minutes.',
  ],

  tips: [
    'Syrup on the warm loaf, icing on the cold one. A warm crumb drinks the syrup right down; a cold loaf keeps the icing thick and white.',
    'Rub the zest in properly. The sugar should look damp and pale yellow and smell strongly of lemon before the eggs go in.',
    'Zest the lemons before you squeeze them, since a squeezed half is almost impossible to grate. Rolling each lemon firmly on the counter first gives more juice.',
    'For a stronger bakery-style lemon taste, add ½ teaspoon of lemon extract or flavouring with the juice. Check the label.',
    'If the middle is gummy, the loaf was underbaked or cut while warm. Test in the very centre and let it cool fully before slicing.',
  ],

  notes: [
    'Lemons: unwaxed if you can, since you eat the zest; scrub waxed ones under hot water and dry them. If your lemons are small, buy a third for the juice.',
    'Oil: any neutral oil works. Vegetable oil topped up with a light olive oil is good too; extra virgin adds a fruity note that suits the orange version.',
    'Yogurt: fat-free yogurt works too, but use 95ml of oil (80ml plus 1 tablespoon); everything else stays the same. Greek yogurt or sour cream also work, and a thick plant-based yogurt makes it dairy-free.',
    'Flour: self-raising flour works in place of plain; leave out the baking powder and keep the bicarbonate of soda. A gluten-free plain blend works weight for weight, with ¼ teaspoon of xanthan gum if it has none.',
  ],

  variations: [
    'Orange loaf. Zest 2 large oranges (or 3 medium) into the bowl in place of the lemons, keeping a small pinch of zest for the top, then juice the oranges and 1 lemon into separate cups. Simmer 120ml of the orange juice in a small pan until only about 2 tablespoons are left, 6 to 8 minutes, and let it cool. Make the batter as written, using the cooled reduced orange juice and 1 teaspoon of lemon juice in place of the 20ml of lemon juice, with 120g of fat-free yogurt and 95ml of oil (vegetable oil topped up with olive oil is good here). Bake it the same way. For the syrup, warm 2 tablespoons of orange juice, 1 teaspoon of lemon juice and 20g of sugar until the sugar dissolves, and brush it over the warm loaf. Ice the cold loaf with 85g of icing sugar whisked with about 1 tablespoon of orange juice, added a few drops at a time until thick but spreadable, and scatter the saved zest on top.',
    'Crunchy drizzle, the classic British way. Skip the syrup and the icing. Instead stir 70g of granulated sugar into 40ml of lemon juice without heating it, and spoon it over the holes in the loaf as soon as it comes out of the oven. It sets into a white, crackly crust as it cools.',
    'Lemon and poppy seed: whisk 1 tablespoon of poppy seeds into the flour.',
    'Lemon and blueberry: toss 100g of blueberries in 1 teaspoon of the measured flour and fold them in at the very end. Allow 5 to 10 minutes longer in the oven and test in the middle. Frozen berries work straight from the freezer.',
  ],

  storage:
    'Keeps 3 to 4 days in an airtight tin at room temperature. To freeze, wrap the syruped loaf before icing, whole or in slices, for up to 3 months. Thaw it in its wrapping and ice it once it is at room temperature.',

  dropcap: true,

  image: 'https://images.unsplash.com/photo-1508432310926-5712bcb79944?w=1200&q=80',
  imageIsStock: true,
};

export default recipe;
