// data/recipes/sunday-roast-chicken.ts
import type { RecipeInput } from './_types';

const recipe: RecipeInput = {
  title: 'Sunday Roast Chicken',
  country: 'United Kingdom',
  featuredIngredients: ['chicken'],
  category: 'main',
  difficulty: 'Medium',
  servings: 4,
  time: { active: 60, total: 135, resting: 25 },
  yield: 'Serves 4, with roast potatoes, peas, gravy and Yorkshire puddings',
  tags: ['weekend feast', 'comfort food', 'high-protein'],

  region: 'Western Europe',
  coordinates: { lat: 51.5074, lng: -0.1278 },

  ingredients: [
    {
      heading: 'The chicken',
      items: [
        { name: 'whole halal chicken, 1.6 to 1.8kg', amount: 1, unit: '' },
        { name: 'fine salt', amount: 2, unit: 'tsp' },
        { name: 'black pepper', amount: 0, unit: '' },
        { name: 'lemon, halved', amount: 1, unit: '' },
        { name: 'head of garlic, halved across the middle', amount: 1, unit: '' },
        { name: 'thyme and rosemary, a few sprigs of each', amount: 0, unit: '' },
        { name: 'soft butter', amount: 30, unit: 'g' },
        { name: 'onion, cut into thick wedges', amount: 1, unit: '' },
        { name: 'carrots, cut into large chunks', amount: 2, unit: '' },
      ],
    },
    {
      heading: 'Roast potatoes',
      items: [
        { name: 'Maris Piper or King Edward potatoes, peeled and cut into large chunks', amount: 1200, unit: 'g' },
        { name: 'salt, for the cooking water', amount: 1, unit: 'tbsp' },
        { name: 'neutral oil or beef dripping', amount: 4, unit: 'tbsp', note: 1 },
        { name: 'rosemary sprigs', amount: 2, unit: '' },
        { name: 'flaky salt, to finish', amount: 0, unit: '' },
      ],
    },
    {
      heading: 'Gravy',
      items: [
        { name: 'plain flour', amount: 2, unit: 'tbsp', note: 2 },
        { name: 'halal chicken stock, hot', amount: 500, unit: 'ml', note: 3 },
        { name: 'soy sauce or Worcestershire sauce', amount: 1, unit: 'tsp', note: 4 },
        { name: 'butter or oil, only if the tin has little fat of its own', amount: 1, unit: 'tbsp' },
        { name: 'salt and black pepper', amount: 0, unit: '' },
      ],
    },
    {
      heading: 'Peas and Yorkshires',
      items: [
        { name: 'frozen peas', amount: 400, unit: 'g', note: 5 },
        { name: 'butter', amount: 15, unit: 'g' },
        { name: 'salt and black pepper', amount: 0, unit: '' },
        { name: 'store-bought Yorkshire puddings', amount: 8, unit: '', note: 6 },
      ],
    },
  ],

  steps: [
    {
      heading: 'The night before, if you can',
      items: [
        'This step is optional and is not counted in the time, but it gives you the crispest skin and the best-seasoned meat. Take the chicken out of its packaging and pat it dry all over with kitchen paper, inside and out. Do not rinse it: washing raw chicken only splashes bacteria around the sink, and the paper does the job. Sprinkle the 2 teaspoons of fine salt evenly over the whole bird, a little more on the thick breast and legs, and a pinch inside the cavity.',
        'Sit it on a rack over a tray, or on a plate, and leave it uncovered on the bottom shelf of the fridge for at least 8 hours and up to 24. The salt seasons the meat right through, and the cold air dries the skin. When it is ready the skin looks dry, taut and a little translucent. On the day, skip the salting step.',
      ],
    },
    {
      heading: 'The running order',
      items: [
        'One oven does everything. The chicken goes in first, at 220°C (200°C fan), and the potatoes join it about half an hour later on the shelf above. When the chicken comes out to rest, the oven goes up a notch so the potatoes finish extra crunchy, and the Yorkshire puddings go in for their final few minutes, while the gravy is made on the hob in the chicken tin. The 25 minute rest is exactly long enough for all of it. From taking the chicken out of the fridge to sitting down, allow about 2 hours 15 minutes.',
      ],
    },
    {
      heading: 'Into the oven',
      items: [
        'About 30 minutes before you want to start roasting, take the chicken out of the fridge to lose its chill, and heat the oven to 220°C (200°C fan), with a shelf in the middle and one above it.',
        'If you did not salt the chicken the night before, do it now. Pat it dry all over with kitchen paper, inside and out, without rinsing it, then sprinkle the 2 teaspoons of fine salt evenly over the whole bird, a little more on the breast and legs, and a pinch inside the cavity.',
        'While the oven heats, peel the potatoes and cut them into large chunks about the size of an egg, aiming for flat faces, since every flat side that touches the tin becomes a crunchy one. Put them in a large pan, cover with cold water and add the tablespoon of salt.',
        'Scatter the onion and carrots in the middle of a roasting tin to make a bed for the chicken. Push the lemon halves, the garlic and the thyme and rosemary into the cavity. Rub the soft butter over the breast and legs and grind over some black pepper. It needs no more salt.',
        'Sit the chicken on the vegetables and roast it on the middle shelf for 65 to 75 minutes, nearer 65 for a 1.6kg bird and nearer 75 for 1.8kg.',
      ],
    },
    {
      heading: 'The potatoes',
      items: [
        'As soon as the chicken is in, put the pan of potatoes over a high heat and bring it to the boil.',
        'Once the water boils, cook them for 8 to 10 minutes, until a knife slides into the edges easily but the middles still resist. While they boil, put the oil or dripping into a second roasting tin and put it on the top shelf of the oven to get very hot, for at least 10 minutes.',
        'Drain the potatoes and leave them in the colander for 2 minutes to steam dry. Tip them back into the empty pan, put the lid on and shake hard a few times, so the edges go fluffy and almost mashed. Those ragged edges are what turn into the crust.',
        'Take the tin of fat out of the oven and set it on a heatproof surface. Carefully tip in the potatoes. They should sizzle loudly the moment they hit the fat; if they do not, put the tin back for 5 minutes before you try again. Turn each one with a spoon so it is coated all over, spread them out with space between them, and roast on the top shelf.',
        'Leave the potatoes completely alone for the first 25 minutes. They stick if turned too early, then release once the crust has formed. After that, turn them over, tuck in the rosemary sprigs and keep roasting.',
        'While you are at the oven, look at the vegetables under the chicken. If they are blackening or the tin looks dry, pour in a small splash of water. Burnt bits make bitter gravy.',
      ],
    },
    {
      heading: 'Rest the chicken',
      items: [
        'Start checking the chicken at 60 minutes. It is done when the thickest part of the thigh, not touching the bone, reads 74°C on a thermometer. Without one, pierce that spot with a skewer: the juices should run clear, with no trace of pink, and the leg should feel loose when you wiggle it. Give it more time in 10 minute stretches if it needs it.',
        'Tilt the chicken over the tin so the juices from the cavity run into it, then lift it onto a board. Lay a sheet of foil loosely over the top, without tucking it in, and leave it to rest for 25 minutes. Resting lets the juices settle back into the meat, and the bird stays hot. Wrap it tightly and the skin steams soft.',
        'The potatoes stay in. By now they have had about 40 minutes. Turn the oven up to 230°C (210°C fan) and give them another 15 to 20 minutes, turning them once more, until they are deep golden and crunchy all over. If they are ready before everything else, move them down to the bottom shelf, where they stay hot and crisp without catching.',
      ],
    },
    {
      heading: 'Gravy, peas and Yorkshires',
      items: [
        'Tip the chicken tin to one side so the juices pool in a corner. Spoon off most of the clear fat that floats on top, leaving about 2 tablespoons behind with all the dark juices and the vegetables. If the tin gave up very little fat or juice, which happens with a small or lean bird, add the tablespoon of butter or oil so there are about 2 tablespoons of fat for the flour to cook in: the stock will carry the flavour. Fish a few of the soft roasted garlic cloves out of the bird and squeeze them into the tin.',
        'Set the tin over a medium heat on the hob. If yours cannot go on the hob, scrape everything into a wide saucepan. Sprinkle in the flour and stir it into the fat and juices for 1 to 2 minutes, mashing the soft vegetables and scraping up every brown bit stuck to the bottom.',
        'Pour in a ladle of the hot stock and stir until smooth, then add the rest a little at a time, stirring as you go. Let it bubble for 5 to 8 minutes, until it coats the back of a spoon. If the tin was nearly dry, give it a few minutes more, since the reducing is what deepens the flavour. Strain it through a sieve into a small pan, pressing hard on the vegetables to get every drop out, and keep it warm on a low heat.',
        'When the chicken has rested for about 20 minutes, put the Yorkshire puddings on a baking tray on the middle shelf. Heat them as the packet says. In an oven this hot most need only 3 to 4 minutes, so watch that the tops do not scorch.',
        'Put a pan of salted water on to boil while the gravy simmers. When the Yorkshires go in, add the peas and cook for 3 minutes, until bright green and just tender. Drain, toss with the butter and season with salt and pepper.',
      ],
    },
    {
      heading: 'To the table',
      items: [
        'Carve the chicken while the Yorkshires heat and the peas cook: take off the legs, separate thighs from drumsticks, then slice the breasts off the bone. Pour any juices that have collected on the board into the gravy along with the soy or Worcestershire sauce, then taste before you season. A salted bird and the stock may have done most of the work already, so add pepper and only as much salt as it needs.',
        'Scatter flaky salt over the potatoes and serve everything at once: chicken, roast potatoes, peas, Yorkshire puddings and a full jug of hot gravy.',
      ],
    },
  ],

  nutrition: { calories: 1120, protein: 71, carbs: 85, fat: 54 },
  flavorProfile: { sweet: 1, salty: 3, sour: 1, bitter: 0, umami: 4, spicy: 0 },

  isVegetarian: false,
  isVegan: false,
  isGlutenFree: false,
  isDairyFree: false,

  quote:
    'A chicken salted and roasted hot until its skin is crisp and deep gold, craggy roast potatoes, sweet peas, warm Yorkshire puddings and a jug of gravy made in the roasting tin.',
  description:
    'This is how I do a Sunday roast: the English Sunday lunch, made halal. A whole roast chicken, crunchy roast potatoes with plenty of gravy, a bowl of peas, and store-bought Yorkshire puddings warmed in the oven at the end, because there is no shame in letting someone else make those. The chicken is well salted and roasted hot, and if there is time to salt it the night before and leave it uncovered in the fridge, the meat is seasoned right through and the skin roasts even crisper. The potatoes are parboiled, shaken until their edges go ragged and tipped into very hot fat. The gravy is made in the roasting tin while the chicken rests, from the juices, the softened onion and carrot and good halal chicken stock. It all comes out of one oven, and the order is what makes it work: the chicken comes out to rest just as the potatoes need their last stretch and the Yorkshires need warming, and the rest is exactly long enough to make the gravy.',
  attribution: 'A Nieves\'s Kitchen take on the British Sunday roast',

  headnoteIngredients:
    'Floury potatoes such as Maris Piper or King Edward give the fluffiest insides and the craggiest crust. Check the labels on the stock, the dripping if you use it, and the Yorkshire puddings.',
  headnoteInstructions:
    'If you can, salt the chicken the night before. It takes five minutes and gives crisper skin, but it is a bonus, not a must. On the day it takes about 2 hours 15 minutes, nearly all of it in one oven, and the timings are built around the chicken. Trust the thermometer more than the clock: birds and ovens both vary, and the chicken is ready when the thigh reads 74°C, not when the timer says so.',

  equipment: [
    'Two roasting tins, one for the chicken and one for the potatoes. A sturdy baking tray works for the potatoes.',
    'A meat thermometer, if you have one. Without it, pierce the thickest part of the thigh and check that the juices run clear.',
  ],

  tips: [
    'Salting the night before is the one upgrade worth planning for. It seasons the meat all the way through rather than just the surface, and leaving the bird uncovered dries the skin, and dry skin is crisp skin. Salted on the day, it is still a very good roast.',
    'Get the fat properly hot before the potatoes go in. If they do not sizzle as they land, the oil will soak in instead of frying the outside, and they go greasy rather than crunchy.',
    'For an even craggier crust, add half a teaspoon of bicarbonate of soda to the potato water. It breaks down the outside of the potatoes a little faster, so they rough up into more of the starchy fluff that crisps in the oven.',
    'Before you drain the potatoes, scoop out a mug of the cooking water. If the gravy ends up thicker than you like, a splash of it loosens it without diluting the flavour.',
    'Do not skip the rest. Twenty-five minutes under loose foil keeps the chicken hot and lets the juices settle, so they end up in the meat rather than on the board. It is also exactly the time the gravy and peas need.',
    'If the gravy goes lumpy, whisk it hard or push it through the sieve again. If it tastes flat, a little more soy or a pinch of salt brings it forward.',
  ],

  notes: [
    'Beef dripping: it makes wonderful roast potatoes, but check that the tub says halal. A neutral oil works perfectly well.',
    'Gluten-free: thicken the gravy with 1 tablespoon of cornflour mixed with 2 tablespoons of cold water, stirred in once the stock is simmering, in place of the flour. Use gluten-free Yorkshire puddings or leave them out, and check the soy or Worcestershire sauce.',
    'Stock: check the label, or buy halal-certified stock or cubes. Homemade stock from the carcass of your last roast chicken makes the best gravy of all.',
    'Soy or Worcestershire sauce: check the label.',
    'Peas: fresh peas need 4 to 5 minutes in the boiling water. Green beans, tenderstem broccoli or carrots all work alongside or instead.',
    'Yorkshire puddings: check the label. Some are made with beef dripping, so pick one marked halal or suitable for vegetarians.',
  ],

  variations: [
    'Spatchcock it: cut out the backbone with kitchen scissors, press the bird flat and roast it on the vegetables at the same temperature for 45 to 50 minutes, until the thigh reads 74°C. Since it cooks faster, put it in at the same time as the potatoes rather than half an hour before them.',
    'Herb butter under the skin: mash the 30g of butter with 2 crushed garlic cloves and a tablespoon of chopped thyme and rosemary. Loosen the breast skin with your fingers and push most of the butter underneath, then rub the rest on top.',
    'Semolina on the potatoes: after draining, sprinkle 2 tablespoons of semolina over the potatoes before you shake them in the pan. It gives a thicker, extra crunchy crust.',
    'A different Sunday: mix 2 tablespoons of harissa with 1 tablespoon of honey and 1 tablespoon of oil, and brush it over the chicken for the last 15 minutes of roasting.',
  ],

  storage:
    'Cool leftovers and get them into the fridge within 2 hours. The chicken keeps for up to 3 days and is excellent cold in sandwiches. Reheat roast potatoes in a hot oven or the air fryer at 200°C for 5 to 8 minutes, until crisp again. The gravy keeps for 3 days in the fridge or 3 months in the freezer, and the carcass makes a good stock for next time.',

  dropcap: true,

  image: 'https://images.unsplash.com/photo-1768238907887-023b7ac9f450?w=1200&q=80',
  imageIsStock: true,
};

export default recipe;
