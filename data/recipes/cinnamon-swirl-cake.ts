// data/recipes/cinnamon-swirl-cake.ts
import type { RecipeInput } from './_types';

const recipe: RecipeInput = {
  title: 'Cinnamon Swirl Cake',
  featuredIngredients: ['butter'],
  category: 'dessert',
  difficulty: 'Easy',
  servings: 15,
  time: { active: 25, total: 95, resting: 35 },
  yield: 'One 23 x 33cm tray cake, cut into 15 pieces',
  tags: ['baking', 'treat', 'vegetarian', 'comfort food'],

  ingredients: [
    {
      heading: 'The cake',
      items: [
        { name: 'plain flour', amount: 375, unit: 'g', note: 1 },
        { name: 'caster or granulated sugar', amount: 200, unit: 'g' },
        { name: 'baking powder', amount: 4, unit: 'tsp' },
        { name: 'fine salt', amount: 0.5, unit: 'tsp' },
        { name: 'whole milk, at room temperature', amount: 360, unit: 'ml' },
        { name: 'large eggs, at room temperature', amount: 2, unit: '' },
        { name: 'vanilla extract', amount: 2, unit: 'tsp', note: 2 },
        { name: 'unsalted butter, melted and cooled', amount: 85, unit: 'g', note: 3 },
        { name: 'a little butter or oil, for the tin', amount: 0, unit: '' },
      ],
    },
    {
      heading: 'The cinnamon layer',
      items: [
        { name: 'unsalted butter, soft', amount: 200, unit: 'g', note: 3 },
        { name: 'light brown soft sugar', amount: 180, unit: 'g', note: 4 },
        { name: 'plain flour', amount: 2, unit: 'tbsp' },
        { name: 'ground cinnamon', amount: 1, unit: 'tbsp' },
      ],
    },
    {
      heading: 'The glaze',
      items: [
        { name: 'icing sugar', amount: 200, unit: 'g' },
        { name: 'whole milk', amount: 4, unit: 'tbsp' },
        { name: 'vanilla extract', amount: 1, unit: 'tsp', note: 2 },
      ],
    },
  ],

  steps: [
    {
      heading: 'Get ready',
      items: [
        'Set the 200g of butter for the cinnamon layer out about an hour ahead so it softens, and take the eggs and milk out of the fridge. In a hurry, cube the butter and microwave it in 5 second bursts until a fingertip sinks in easily, and warm the milk for about 15 seconds until just lukewarm. Cold milk and eggs set the melted butter in the batter into greasy flecks.',
        'Heat the oven to 180°C (160°C fan) with a shelf in the middle. Grease a 23 x 33cm baking tin, then line the base and the two long sides with one strip of baking paper that hangs over the edges. Melt the 85g of butter for the cake and let it cool for 10 minutes.',
      ],
    },
    {
      heading: 'The cinnamon layer',
      items: [
        'Beat the soft butter, brown sugar, 2 tablespoons of flour and cinnamon together in a bowl until smooth, about 1 minute. You want a thick, soft paste, like smooth peanut butter. If it looks shiny and runny, the butter was too warm: chill it for 10 minutes so it stays in ribbons instead of sinking.',
      ],
    },
    {
      heading: 'The cake',
      items: [
        'In a large bowl, whisk the flour, sugar, baking powder and salt together. Add the milk, eggs and 2 teaspoons of vanilla and whisk until smooth, about 30 seconds; a few small lumps are fine. Stir in the melted butter, then pour the batter into the tin and spread it into the corners.',
        'Drop the cinnamon paste over the batter in heaped teaspoons, spread evenly in rows, until it is all used. Push a table knife about halfway down into the batter and drag it the length of the tin in a gentle zigzag, through each row once, then stop. You want dark ribbons with pale cake between them; if the top turns an even beige, it has been swirled too much.',
      ],
    },
    {
      heading: 'Bake and glaze',
      items: [
        'Bake on the middle shelf. Most ovens take 25 to 35 minutes, but ovens vary a lot, so start checking at 22 minutes and keep checking every 3 minutes. Push a skewer or toothpick into a pale patch of cake near the centre, not a swirl, which stays sticky: the moment it comes out mostly clean, with a few moist crumbs, take it out. Going from sticky to dry can take seconds or minutes. If the top is browning too fast, lay foil loosely over it.',
        'While it bakes, whisk the icing sugar with 3 tablespoons of the milk and the teaspoon of vanilla until smooth. Add the last tablespoon of milk only if it is too stiff to pour: it should fall from the whisk in a thick ribbon.',
        'Let the cake cool in the tin for 10 minutes, then drizzle the glaze over the warm cake and spread it gently to the edges. Leave it for 20 to 30 minutes to set, then cut it into 15 pieces (2 cuts along the length, 4 across). It is best still a little warm.',
      ],
    },
  ],

  nutrition: { calories: 410, protein: 5, carbs: 59, fat: 17 },
  flavorProfile: { sweet: 5, salty: 1, sour: 0, bitter: 0, umami: 0, spicy: 0 },

  isVegetarian: true,
  isVegan: false,
  isGlutenFree: false,
  isDairyFree: false,

  quote:
    'A soft vanilla tray cake swirled with a buttery brown sugar and cinnamon layer, glazed while it is still warm so the icing sinks into every ripple.',
  description:
    'All the flavour of a tray of cinnamon rolls, with no yeast, no rolling and no proving. A plain vanilla batter goes into a tray, a buttery brown sugar and cinnamon paste is dotted over it and dragged through with a knife, and a vanilla glaze goes over the cake while it is warm. The cinnamon layer is generous with butter, so it bakes into gooey, caramel ripples, and the warm glaze melts down into them. The cake mixes in one bowl, takes about 25 minutes of work and is cut into fifteen pieces.',
  attribution: 'A Nieves\'s Kitchen take on the cinnamon roll cake',

  headnoteIngredients:
    'Everything is everyday baking cupboard: flour, sugar, milk, eggs, butter, cinnamon and icing sugar. Use unsalted butter so the salt is yours to set, and let the butter for the cinnamon layer soften properly, so it beats into a smooth paste.',
  headnoteInstructions:
    'Weigh the flour: a cup of flour can vary by a fifth, and extra flour makes a dry cake. Three things decide whether this works: get the cinnamon paste thick enough to sit in a mound, swirl only once through each row so the ribbons stay ribbons, and glaze the cake 10 minutes after it comes out, while it is still warm.',

  equipment: [
    'A 23 x 33cm (9 x 13 inch) baking tin. A roasting tin of a similar size works, and a glass or ceramic dish does too if you allow 5 to 10 minutes longer, since it heats more slowly.',
  ],

  tips: [
    'Swirl less than you think. One pass through each row, with the knife only halfway down, is enough. Every extra pass blends the paste into the batter.',
    'Test the cake, not the swirl. A skewer through a cinnamon ribbon always comes out sticky, so push it into a pale patch near the centre.',
    'A few dips where the cinnamon layer has sunk are normal and welcome: that is where the warm glaze pools.',
    'Glaze it warm, not hot. On a hot cake the glaze turns to a clear syrup and vanishes; on a cold one it just sits on top.',
  ],

  notes: [
    'Flour: a gluten-free plain blend with xanthan gum works weight for weight, in both the cake and the cinnamon layer. The crumb is a little more delicate.',
    'Vanilla: check the label on your vanilla extract.',
    'Butter: with salted butter, leave out the ½ teaspoon of salt. For a dairy-free cake, use a plant-based baking block for both lots of butter and oat milk in the cake and glaze.',
    'Brown sugar: dark brown soft sugar gives a deeper, more toffee-like ripple.',
  ],

  variations: [
    'Cream cheese frosting, closer to a cinnamon roll. Skip the glaze and let the cake cool completely, about 1 hour. Beat 150g of full-fat cream cheese with 50g of soft unsalted butter until smooth, then beat in 200g of icing sugar and ½ teaspoon of vanilla extract until light, about 1 minute; do not overbeat, or it turns runny. Spread it over the cooled cake and keep it in the fridge.',
    'Brown butter glaze, nutty and deeper. Melt 30g of unsalted butter in a small light-coloured pan over medium heat and keep cooking, swirling, for 2 to 3 minutes, until the specks on the bottom turn hazelnut brown and it smells of toasted nuts. Scrape it into the icing sugar with only 2 tablespoons of milk and the vanilla, whisk until smooth, adding a few more drops if it is too stiff, and glaze the warm cake as written.',
    'Cardamom, like a Swedish bun: beat 1 teaspoon of ground cardamom into the cinnamon paste.',
    'As a loaf. Make half of every amount (1 egg). Line a 900g (2lb) loaf tin, spread in half the batter, dot over half the paste, cover with the rest of the batter and dot the rest of the paste on top. Swirl through the depth in a zigzag along the length. Bake at 180°C (160°C fan), starting to check at 40 minutes and taking it out as soon as a skewer through the cake comes out mostly clean (usually 45 to 55 minutes), with foil over the top if it browns fast. Cool for 15 minutes in the tin, lift it out and glaze it while warm.',
  ],

  storage:
    'Keep the glazed cake covered, in its tin or an airtight box, at room temperature for up to 3 days. Warm a piece in the microwave for 10 to 15 seconds to soften the swirl again. To freeze, cool the unglazed cake completely, wrap it well and freeze it for up to 3 months. Thaw it at room temperature, warm it in a 160°C (140°C fan) oven for about 10 minutes, then glaze it.',

  dropcap: true,

  image: 'https://images.unsplash.com/photo-1771537841015-38ce5eb33a8c?w=1200&q=80',
  imageIsStock: true,
};

export default recipe;
