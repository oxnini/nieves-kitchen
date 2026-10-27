// data/recipes-held/mango-sticky-rice.ts
import type { RecipeInput } from '../recipes/_types';

const recipe: RecipeInput = {
  title: 'Mango Sticky Rice',
  country: 'Thailand',
  category: 'dessert',
  difficulty: 'Easy',
  servings: 4,
  time: { active: 35, total: 335, resting: 280 },
  yield: 'Serves 4 generously',
  tags: ['vegetarian', 'treat'],

  region: 'Southeast Asia',
  coordinates: { lat: 13.7563, lng: 100.5018 },

  ingredients: [
    {
      heading: 'The rice',
      items: [
        { name: 'Thai glutinous rice (also sold as sticky rice or sweet rice)', amount: 300, unit: 'g' },
      ],
    },
    {
      heading: 'Sweet coconut, for soaking the rice',
      items: [
        { name: 'full-fat coconut milk', amount: 250, unit: 'ml' },
        { name: 'white caster or granulated sugar', amount: 100, unit: 'g' },
        { name: 'fine salt', amount: 0.75, unit: 'tsp' },
        { name: 'pandan leaf, fresh or frozen, tied in a knot (optional)', amount: 1, unit: '' },
      ],
    },
    {
      heading: 'Salted coconut topping',
      items: [
        { name: 'coconut cream', amount: 120, unit: 'ml' },
        { name: 'fine salt', amount: 0.25, unit: 'tsp' },
        { name: 'white sugar', amount: 1, unit: 'tsp' },
        { name: 'rice flour or cornflour', amount: 0.5, unit: 'tsp' },
        { name: 'cold water, for the flour', amount: 1, unit: 'tbsp' },
      ],
    },
    {
      heading: 'To serve',
      items: [
        { name: 'ripe honey (Ataulfo) or Alphonso mangoes, or 2 large ripe mangoes', amount: 3, unit: '' },
        { name: 'white sesame seeds', amount: 1, unit: 'tbsp' },
      ],
    },
  ],

  steps: [
    {
      heading: 'The night before, or that morning: wash and soak',
      items: [
        'Put the rice in a large bowl and cover it with cold water. Swish it around hard with your hand, pour off the cloudy water, and repeat 4 or 5 times, until the water runs almost clear. This washes off the loose starch that would otherwise make the rice gummy.',
        'Cover the rice with fresh room-temperature water by about 5cm, because it swells, and leave it to soak for 4 hours or overnight. When it is ready, the grains will look brighter white and crush easily between your fingers. Handle them gently from here, since soaked grains are brittle.',
      ],
    },
    {
      heading: 'Set up the steamer',
      items: [
        'About 1½ hours before you want to eat, set up the steamer. If you are improvising, use a metal sieve or colander (never plastic) that sits snugly on the rim of a saucepan. Hold it against the outside of the pan to see how far down it hangs, then pour in water to about 2.5cm below that point, so the rice sits in the steam and never touches the water, even when it bubbles hard. You want 4 to 5cm of water; if your sieve hangs so low that you get less than 3cm, use a deeper pan. Put the lid on the pan and bring the water to a rolling boil over high heat. Boil the kettle too, for topping up later.',
        'Meanwhile, tip the soaked rice into a sieve and drain it very well. Shake it, then leave it for 5 minutes until it has stopped dripping. Water left in the rice runs to the bottom while it steams and makes a soggy layer.',
        'Wet the muslin or tea towel and wring it out hard, so it is damp but not dripping. Line the steamer, sieve or colander with it, leaving the edges hanging over. Spread the rice on the cloth in an even layer no more than about 3cm deep (in a round sieve, spread it up the sides into a bowl shape), keeping it a little in from the edge so steam can rise around it, then push a hole through the middle with your finger, right down to the cloth, so there is no thick centre to undercook. Fold the overhanging cloth loosely over the top and tuck in the corners, so no cloth hangs down outside the pan towards the heat.',
      ],
    },
    {
      heading: 'Steam the rice, and warm the sweet coconut',
      items: [
        'Set the rice over the boiling water, put the lid on (or cover the sieve tightly with foil if no lid fits) and steam over high heat for 25 to 30 minutes, keeping the water at a rolling boil the whole time. Check the water once, halfway through, and keep it at least 2cm deep: with a steamer, pour boiling water from the kettle in around the edge; with a sieve, lift it off onto a plate with oven gloves, top up the pan and put it back.',
        'While the rice steams, shake the tin of coconut milk well (or stir it in the tin) so the thick cream on top is mixed back in, then measure 250ml into a small pan with the sugar, ¾ teaspoon of salt and the knotted pandan leaf, if using. Set it over medium heat and stir until the sugar has dissolved, about 3 minutes. Take it off the heat as soon as it starts to bubble at the edge, and cover it. Do not let it boil or reduce: the rice needs every drop of that liquid, and hard boiling can split the coconut milk.',
        'Taste the sweet coconut. It should taste clearly salty as well as sweet, a bit like salted caramel. That is right: the salt softens once it is spread through the rice and set against the mango.',
        'At 25 minutes, lift the lid away from you, since the steam burns, and take a few grains from the thickest part with a spoon. Cooked sticky rice turns from chalky white to glossy and translucent all the way through, with no opaque white dot in the middle. Bite one. It should be soft and chewy, with no hard core. If some grains are still chalky, sprinkle 1 to 2 tablespoons of water over them, put the lid back on, steam for 5 minutes more and test again.',
      ],
    },
    {
      heading: 'The coconut soak',
      items: [
        'When the rice is done, turn off the heat under it and leave the lid on, so it stays hot while you put the sweet coconut back over medium heat. Stir until it is steaming and just starting to bubble at the edge, 1 to 2 minutes, then take it off the heat.',
        'With oven gloves, lift the steamer or sieve off the pan. Pick up the cloth by its corners, which are hot, so keep the gloves on or use tongs, and turn the rice straight into a heatproof bowl, peeling the cloth away and scraping off any grains that cling. Pour over all the hot sweet coconut, pandan leaf and all, and fold it through gently with a spatula, breaking up any clumps without mashing the grains. It will look soupy. That is exactly right.',
        'Cover the bowl with a plate and leave it for 20 minutes without peeking, while the rice drinks up the coconut. Make the topping and toast the sesame in the meantime.',
      ],
    },
    {
      heading: 'While the rice drinks: the topping and the sesame',
      items: [
        'Stir the ½ teaspoon of rice flour or cornflour into the tablespoon of cold water until there are no lumps. Put the coconut cream (stir it smooth first if it has separated), the ¼ teaspoon of salt and the teaspoon of sugar in a small pan, then stir in the flour mixture.',
        'Set the pan over medium heat and stir constantly until it comes to a gentle bubble and thickens to the consistency of double cream, coating the back of the spoon and running off it in a slow ribbon, about 2 to 3 minutes. Take it off the heat straight away and pour it into a small bowl. It thickens a little more as it cools. If it ends up too thick to drizzle, stir in a teaspoon of water; if it is still as thin as milk, mix another ¼ teaspoon of flour with a teaspoon of water, stir it in and bring it back to a bubble.',
        'Toast the sesame seeds in a dry frying pan over medium-low heat, shaking the pan often, until golden and starting to pop, about 2 to 3 minutes. Tip them onto a plate at once so they stop cooking.',
      ],
    },
    {
      heading: 'Fold, cut the mango and serve',
      items: [
        'When the 20 minutes are up, fold the rice from the bottom up to the top, because the coconut sinks, then cover it again and leave it for another 20 minutes. It is ready when it looks plump and glossy and has drunk up almost all the liquid: tip the bowl and you should see no more than a thin slick of coconut at the bottom, not a pool. If there is still a pool, fold once more and give it 10 minutes.',
        'Cut the mangoes during this second rest, so they are fresh and juicy. Stand one on its end on a board, stalk up, with a narrow edge facing you: the flat stone runs through the middle like a blade. Leave the skin on, since it gives you a grip. Slice straight down about 1cm to one side of the stalk to take off one cheek; if the knife hits the stone, move it a few millimetres further out. Do the same on the other side. Slide a large spoon between the skin and the flesh of each cheek, close to the skin, to scoop it out in one piece, then lay it flat side down and cut it across into slices about 1.5cm thick. Trim the flesh from around the stones and keep it for the cook.',
        'Take out the pandan leaf. Rinse a small cup or ramekin with cold water so the rice slides out, pack a quarter of the rice into it and turn it out onto each plate as a neat dome, or simply spoon it on. Lay the mango slices alongside, spoon about 2 tablespoons of the salted topping over each mound of rice, and scatter with the toasted sesame seeds. Serve while the rice is still warm, or at room temperature.',
      ],
    },
  ],

  nutrition: { calories: 670, protein: 8, carbs: 110, fat: 22 },
  flavorProfile: { sweet: 4, salty: 2, sour: 1, bitter: 0, umami: 0, spicy: 0 },

  isVegetarian: true,
  isVegan: true,
  isGlutenFree: true,
  isDairyFree: true,

  quote:
    'Chewy, glossy rice that has drunk a whole pan of warm sweet coconut, a ripe mango alongside, and a spoonful of salted coconut cream to keep all that sweetness in check.',
  description:
    'Khao niao mamuang is Thailand\'s best-loved dessert, and a favourite of mine: glutinous rice steamed until chewy, then left to soak up warm coconut milk sweetened with sugar and seasoned with more salt than you would expect, served with ripe mango and a spoonful of salted coconut cream. Nothing in it is difficult, but each stage has one thing that decides it, so this version is written for a first go. It tells you which rice to buy and how to recognise it, how to steam it with a sieve and a tea towel if you have no steamer, how to tell when it is cooked, and why the hot rice and the hot coconut have to meet the moment the rice is done. The salt in both the rice and the topping is what keeps it from tasting like rice pudding with fruit on the side, and a scatter of toasted sesame gives it some crunch.',
  attribution: 'A Nieves\'s Kitchen take on a Thai classic',

  headnoteIngredients:
    'Buy the right rice, because nothing else works. Look for Thai glutinous rice, also sold as sticky rice or sweet rice, in the world food aisle or an Asian grocer. The raw grains are long and an opaque, chalky white, like tiny porcelain beads, not see-through like jasmine or basmati, and it is not sushi rice or short, round Chinese or Japanese glutinous rice. Buy the grains, not the glutinous rice flour that often sits beside them. Despite the name it has no gluten. Use a full-fat tinned coconut milk with a high coconut content (Thai brands such as Aroy-D or Chaokoh are good), never a light one or the coconut drink sold in cartons for cereal. For the topping, buy coconut cream in a tin or carton, not the hard block of creamed coconut. White sugar keeps the rice white. Then the mango, which makes or breaks the dish: honey (Ataulfo) or Alphonso are the best you can find in the UK, and big supermarket mangoes work too if they are properly ripe. Shop mangoes are rarely ready, so buy them several days to a week ahead and leave them in a paper bag at room temperature. Go by feel and smell rather than colour, since some stay green when ripe. Ripe means they give slightly when pressed, smell sweet at the stalk end, and honey mangoes may wrinkle a little. Avoid hard, scentless ones. Pandan leaves, sold frozen in Asian grocers, add a soft, nutty, vanilla-like scent, but the dish is very good without them.',
  headnoteInstructions:
    'Start the night before or that morning: the rice needs at least 4 hours in water. That long soak is what lets it steam through evenly and stay chewy rather than going mushy once the coconut goes in. After that it is about 1½ hours, most of it waiting. Warm the sweet coconut while the rice steams; then, while the rice spends 40 minutes drinking it up, make the salted topping, toast the sesame and cut the mango, so everything is ready at once.',

  equipment: [
    'A way to steam the rice. A bamboo or metal steamer over a pan is ideal, but a metal sieve or colander that sits snugly on a saucepan, with a lid that fits over it, does the same job, as long as the water stays below it. If no lid fits over it, cover it tightly with foil.',
    'A piece of muslin or a thin, clean cotton tea towel (not a fluffy one) to line it, so the grains cannot stick or fall through.',
  ],

  tips: [
    'Never boil glutinous rice in a pan of water like ordinary rice, and do not swap in jasmine, sushi or pudding rice. Glutinous rice takes so little water that boiling turns it to paste, and other rice never goes properly chewy.',
    'Drain the soaked rice until it stops dripping, and keep the cloth damp rather than wet. Extra water is the one thing that turns the bottom layer mushy.',
    'The rice must go straight from the steamer into the hot coconut. Freshly steamed grains soak the coconut up into themselves; rice that has sat and cooled only gets coated in it, and stays slick and firm.',
    'Do the fold after the first 20 minutes. The coconut sinks, and without it the bottom of the bowl ends up wet while the top stays dry.',
    'Keep the finished rice out of the fridge until it is eaten. Chilled sticky rice goes hard; it is at its best warm or at room temperature, within a couple of hours of making.',
    'For warm rice against cool mango, put the mangoes in the fridge for an hour before you cut them.',
    'If you like it less sweet, cut the sugar in the sweet coconut to 80g, but keep the salt. It is what balances the dish.',
  ],

  substitutions: [
    'One tin for everything: open a 400ml tin of coconut milk without shaking it. If a thick layer of cream has set on top, spoon 120ml of it into the topping pan in place of the coconut cream, then stir what is left in the tin and measure out the 250ml for the rice.',
    'No coconut cream? Make the topping with 120ml of coconut milk instead, and thicken it with 1 teaspoon of rice flour or cornflour rather than ½, since coconut milk is thinner.',
    'No steamer, sieve or colander that fits? Microwave the rice instead, and skip the long soak. Cover the washed rice with just-boiled water by about 1cm, stir, and leave it for 15 minutes. Drain, rinse with cold water and drain very well. Put it in a wide glass or ceramic bowl with 180ml of cold water, which should come roughly level with the rice, cover with a plate and microwave on full power for 3 minutes. Stir, turning the bottom up to the top, then microwave in 2-minute bursts, stirring between each, until the water has been absorbed and nearly all the grains are translucent, usually 3 or 4 bursts for this much rice. Cover and leave it for 5 minutes. If it is still chalky, stir in 1 to 2 tablespoons of water and microwave for 1 minute more. Microwaved rice comes out a little softer, so fold the coconut through gently.',
    'Potato starch or tapioca starch thicken the topping just as well as rice flour or cornflour.',
  ],

  variations: [
    'Crispy mung beans, the crunchy topping Thai street vendors use, in place of the sesame. Rinse 2 tablespoons of split, skinless yellow mung beans (sold as moong dal) and put them in a small pan with about 500ml of water. Bring to a simmer over medium heat, then take the pan off the heat at once, cover it and leave it for 10 minutes only, or they turn soft. Drain, rinse in cold water and pat dry on kitchen paper. Toast them in a frying pan with a few drops of oil over medium-high heat, stirring often, until dry, crunchy and pale golden, about 5 to 10 minutes. They keep in a jar for a month.',
    'Green pandan rice: blend 75g of pandan leaves with 360ml of water until fine, strain it through a fine sieve, and use this instead of plain water to soak the rice, topping it up with plain water if the rice is not covered. Keep the knotted leaf in the sweet coconut as well. The rice takes on a pale green colour and a stronger pandan scent; a couple of drops of green food colouring brighten it if you want it vivid. If you soak it for longer than 4 hours, keep it in the fridge.',
    'Blue swirl rice: steep 20 dried butterfly pea flowers in 120ml of just-boiled water for 15 minutes, strain, then add 120ml of cold water and let it cool to room temperature. Soak half the rice in this blue water and half in plain water, keeping them in separate bowls. Steam them side by side on the same cloth without touching, then tip both into the bowl and fold them together only lightly as they soak, so the blue stays in swirls. If you soak longer than 4 hours, keep the blue rice in the fridge.',
    'With coconut ice cream: a small scoop alongside the warm rice is very good. Many are dairy-free, but check the label for gelatine and for alcohol-based flavourings.',
  ],

  storage:
    'The rice is best eaten the day it is made, within a couple of hours. Cover and refrigerate leftovers and eat them within a day. To reheat, cover the rice with a damp piece of kitchen paper and microwave it until piping hot, breaking it up halfway, then let it cool to warm before eating: it only goes soft again once it is fully hot. The salted topping keeps for up to 3 days in a sealed jar in the fridge; warm it gently or let it come to room temperature. Cut mango keeps for a day, covered, in the fridge.',

  dropcap: true,

  image: 'https://images.unsplash.com/photo-1705234384751-84081009588e?w=1200&q=80',
  imageIsStock: true,
};

export default recipe;
