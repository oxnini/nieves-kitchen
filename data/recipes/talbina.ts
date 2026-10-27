// data/recipes/talbina.ts
import type { RecipeInput } from './_types';

const recipe: RecipeInput = {
  title: 'Talbina',
  country: 'Saudi Arabia',
  isSunnah: true,
  featuredIngredients: ['barley', 'milk', 'dates'],
  category: 'dessert',
  difficulty: 'Easy',
  servings: 2,
  time: { active: 15, total: 20 },
  yield: 'Serves 2, a small bowl each',
  tags: ['quick', 'vegetarian', 'comfort food', 'budget-friendly'],

  region: 'Middle East',
  coordinates: { lat: 24.4672, lng: 39.6111 },

  ingredients: [
    {
      heading: 'Talbina',
      items: [
        { name: 'barley flour (about 3 rounded tablespoons)', amount: 30, unit: 'g', note: 1 },
        { name: 'cold water', amount: 100, unit: 'ml' },
        { name: 'semi-skimmed milk, plus a splash more to loosen', amount: 250, unit: 'ml', note: 2 },
        { name: 'ground cinnamon', amount: 1, unit: 'tsp', note: 3 },
        { name: 'salt, a small pinch', amount: 0, unit: '' },
        { name: 'date syrup', amount: 1, unit: 'tbsp', note: 4 },
      ],
    },
    {
      heading: 'To finish',
      items: [
        { name: 'Medjool dates, pitted and chopped', amount: 2, unit: '' },
        { name: 'pistachios or almonds, roughly chopped', amount: 15, unit: 'g', note: 5 },
        { name: 'ground cinnamon, for dusting', amount: 0.5, unit: 'tsp' },
        { name: 'a little more date syrup, to drizzle (optional)', amount: 0, unit: '' },
      ],
    },
  ],

  steps: [
    {
      heading: 'Before you start',
      items: [
        'Chop the dates and nuts, measure the cold water into a jug, and set a mixing bowl and a whisk beside the hob. Once the flour is toasting you will be stirring the whole time, so get the toppings out of the way first.',
      ],
    },
    {
      heading: 'Toast the flour',
      items: [
        'Put the barley flour in a small, dry, heavy-based saucepan over medium-low heat. Stir it constantly with a whisk or wooden spoon for 3 to 4 minutes, until it smells nutty, like toasted biscuits, and has turned one shade darker, from pale sand to light beige. Keep it moving. Once it starts to colour at the edges it can scorch quickly, and dark brown flour tastes bitter.',
        'Take the pan off the heat and tip the toasted flour straight into the mixing bowl, so it stops cooking. Pour in about 2 tablespoons of the cold water and whisk to a thick, smooth paste, pressing out any dry pockets against the side of the bowl. Then whisk in the rest of the water a little at a time, until the paste is smooth and runny. This is what keeps it free of lumps. Whisk the teaspoon of cinnamon into the paste too, so it spreads evenly instead of floating in clumps.',
      ],
    },
    {
      heading: 'Cook it through',
      items: [
        'Pour the milk into the saucepan, then whisk in the barley paste and the pinch of salt. Set it over medium heat and keep whisking, reaching into the corners where it thickens first. For the first 3 to 4 minutes very little happens, then as it nears a simmer it thickens quite suddenly.',
        'When it starts to bubble, turn the heat down to low and keep cooking, stirring, for 3 minutes. This cooks the flour through, so it tastes of toasted grain rather than raw flour. It is ready when it coats the back of a spoon thickly and a finger drawn through it leaves a clean line, like a loose custard or a soft porridge that still pours. If it gets thicker than that, whisk in a splash more milk.',
        'Take the pan off the heat and fold in the date syrup with a few turns of the spoon, until it streaks through and turns the talbina a shade deeper, the colour of milky tea. Taste, and add a little more date syrup if you like it sweeter.',
      ],
    },
    {
      heading: 'To the bowl',
      items: [
        'Pour into two small bowls and leave for 2 minutes, so it settles and firms slightly. Dust each bowl with a quarter teaspoon of cinnamon, enough to cover most of the surface, then top with the chopped dates and nuts and a thin drizzle of date syrup if you like. Eat it warm, with a spoon.',
      ],
    },
  ],

  nutrition: { calories: 270, protein: 8, carbs: 49, fat: 6 },
  flavorProfile: { sweet: 3, salty: 1, sour: 0, bitter: 0, umami: 1, spicy: 0 },

  isVegetarian: true,
  isVegan: false,
  isGlutenFree: false,
  isDairyFree: false,

  quote:
    'Barley flour toasted until it smells of biscuits, simmered in milk with plenty of cinnamon until soft and smooth, with date syrup folded through and chopped dates on top.',
  description:
    'Talbina is a soft porridge of barley flour cooked in milk, and a dish the Prophet ﷺ spoke of. Aisha, may Allah be pleased with her, would order talbina for the grieving and the sick, and related that the Prophet ﷺ called it a soother for the sick heart that carries away some of the sorrow (Sahih al-Bukhari 5689). Its name comes from laban, the Arabic for milk, for its pale, milky look. This version toasts the flour first, which takes away the raw, floury taste and makes the whole bowl nutty, then whisks it to a smooth, spoonable porridge in semi-skimmed milk, with a generous amount of cinnamon cooked right through it. It is sweetened with date syrup folded through at the end rather than honey, which gives it a deeper, almost caramel sweetness, and finished with more cinnamon dusted over the top, chopped dates and a few nuts for something to bite. It takes about twenty minutes and one small pan.',
  attribution: 'A Nieves\'s Kitchen take on a dish the Prophet ﷺ spoke of',

  headnoteIngredients:
    'Barley flour is the one thing you may need to hunt for. Semi-skimmed milk keeps it light and still makes a creamy bowl. Be generous with the cinnamon: a full teaspoon cooked in and another half teaspoon dusted over the two bowls is what gives this talbina its warmth, without tipping into bitterness. Barley contains gluten, so this is not one for a gluten-free table.',
  headnoteInstructions:
    'Three things make talbina smooth: toast the flour dry until it smells nutty, whisk it into cold water before it meets the milk, and keep whisking until it has simmered for a few minutes. Take it off the heat while it still pours. It keeps thickening as it cools, so a bowl that looks a little loose in the pan is right by the time you sit down.',

  tips: [
    'Toast by smell and colour, not the clock. You want nutty and one shade darker, light beige rather than brown. Scorched flour tastes bitter and there is no rescuing it, so if your hob runs hot, turn it down and give it an extra minute.',
    'Cold water first, every time. A smooth paste of flour and cold water cannot clump. If a few lumps sneak through anyway, whisk hard off the heat for 30 seconds, or pour it through a sieve into the bowls.',
    'Give it the full 3 minutes after it thickens. Barley flour that has only just thickened still tastes chalky and raw. A few minutes at a gentle bubble is what turns it sweet and rounded.',
    'Pull it while it still pours. Talbina sets as it cools: warm in the bowl it is a soft porridge, at room temperature it holds the shape of the spoon, and cold from the fridge it is a pudding.',
    'Fold the date syrup in off the heat. It is thick and sugary and catches easily on the hot base of the pan, and off the heat its caramel flavour stays bright.',
  ],

  notes: [
    'Barley flour: health food shops and online grocers sell it, and South Asian shops often stock it as jau ka atta. No barley flour? Blitz pearl barley to a fine powder in a spice grinder and sieve it. Use the same weight.',
    'Milk: whole milk makes a richer, creamier bowl. Any other milk works too: oat milk makes it dairy-free and keeps it creamy, though plant milks are thinner, so start with a little less water and loosen at the end if needed.',
    'Cinnamon: a cinnamon stick can go into the milk in place of the ground cinnamon in the paste. Lift it out before the date syrup goes in. It gives a softer warmth, so still dust ground cinnamon on top.',
    'Date syrup: look for one made from dates alone; some are blended with glucose syrup and taste flatter. Honey works too: 2 teaspoons, stirred in off the heat. It is lighter and more floral.',
    'Nuts: walnuts work in place of the pistachios or almonds, or a spoonful of toasted sesame seeds.',
  ],

  variations: [
    'Water only: use 350ml water and no milk for a lighter talbina, closer to a barley broth. It tastes plainer, so be a little more generous with the date syrup.',
    'Cardamom and rose water: add a pinch of ground cardamom to the flour for the last 30 seconds of toasting, then stir a few drops of rose water in with the date syrup. Go easy on the rose water, a few drops is plenty.',
    'Figs on top: sliced fresh figs, or chopped dried ones, alongside the dates.',
    'Chilled pudding: use 40g of barley flour to the same liquid, so it sets firmer. Pour into small glasses, cool, cover and chill for at least 2 hours, then top with the dates, nuts and date syrup just before serving.',
    'To drink: whisk in up to 150ml more warm milk at the end for a pourable talbina you can sip from a cup.',
  ],

  storage:
    'Best eaten warm and fresh. It keeps, covered, in the fridge for up to 2 days, where it sets firm. Eat it cold as a pudding, or warm it gently in a small pan with a splash of milk, whisking until smooth again. Add the toppings after reheating.',

  dropcap: true,

  image: 'https://images.unsplash.com/photo-1708782343229-b58f8e0b7020?w=1200&q=80',
  imageIsStock: true,
};

export default recipe;
