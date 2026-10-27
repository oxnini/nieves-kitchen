// data/recipes/halal-full-english.ts
import type { RecipeInput } from './_types';

const recipe: RecipeInput = {
  title: 'Halal Full English',
  country: 'United Kingdom',
  featuredIngredients: ['eggs'],
  category: 'main',
  difficulty: 'Medium',
  servings: 2,
  time: { active: 40, total: 50 },
  yield: 'Serves 2, two eggs and three rashers each',
  tags: ['comfort food', 'weekend feast', 'high-protein'],

  region: 'Western Europe',
  coordinates: { lat: 51.5074, lng: -0.1278 },

  ingredients: [
    {
      heading: 'Air fryer hash browns',
      items: [
        { name: 'floury potatoes, such as Maris Piper or King Edward, peeled', amount: 300, unit: 'g', note: 1 },
        { name: 'neutral oil (2 tbsp if you pan-fry them instead)', amount: 2, unit: 'tsp' },
        { name: 'fine salt', amount: 0.5, unit: 'tsp' },
        { name: 'onion granules (optional)', amount: 0.25, unit: 'tsp' },
        { name: 'black pepper', amount: 0, unit: '' },
      ],
    },
    {
      heading: 'The fry-up',
      items: [
        { name: 'halal turkey rashers', amount: 6, unit: '', note: 2 },
        { name: 'halal beef sausages, one each', amount: 2, unit: '', note: 3 },
        { name: 'or halal sujuk in place of the sausages, sliced into 5mm rounds', amount: 80, unit: 'g' },
        { name: 'chestnut mushrooms, halved, or quartered if large', amount: 200, unit: 'g' },
        { name: 'ripe tomatoes, halved', amount: 2, unit: '' },
        { name: 'baked beans, one small tin', amount: 200, unit: 'g' },
        { name: 'butter, for the mushrooms', amount: 5, unit: 'g' },
        { name: 'neutral oil, for the tomatoes and rashers', amount: 1, unit: 'tsp' },
        { name: 'salt and black pepper', amount: 0, unit: '' },
      ],
    },
    {
      heading: 'Eggs and toast',
      items: [
        { name: 'eggs', amount: 4, unit: '' },
        { name: 'butter, for the eggs', amount: 5, unit: 'g' },
        { name: 'thick slices of bread, white or wholemeal', amount: 2, unit: '', note: 4 },
        { name: 'ketchup or brown sauce, to serve', amount: 0, unit: '' },
      ],
    },
  ],

  steps: [
    {
      heading: 'The running order',
      items: [
        'Read this once before you start. The oven roasts the sausages and tomatoes while the air fryer does the hash browns, and in the meantime one large frying pan does the mushrooms, then the rashers. When the sausages come out, the oven turns down low and becomes a warming cupboard for everything, and a small pan warms the beans. The eggs and toast go last, because they are the only things on the plate that will not wait. Start to finish, it takes about 50 minutes.',
      ],
    },
    {
      heading: 'Oven on, potatoes grated',
      items: [
        'Heat the oven to 200°C (180°C fan) with a roasting tin inside. If you are using sujuk instead of sausages, still heat it: the tomatoes roast in it, and it holds everything warm later.',
        'Grate the potatoes on the coarse side of a box grater. Tip them into a bowl of cold water and swish them around with your hand until the water turns cloudy, then drain. Rinsing washes off the loose surface starch, so the strands crisp up separately instead of gluing into a gummy mass.',
        'Pile the potato into the middle of a clean tea towel, gather the corners and twist it hard over the sink until no more water drips out. Loosen it, then twist again. It should feel dry and fluffy, and noticeably lighter than when you started. This is the step that decides whether the hash browns crisp or steam. Switch the air fryer on to heat to 200°C while you squeeze.',
        'Tip the potato into a dry bowl and toss it with the 2 teaspoons of oil, the salt, the onion granules if using and a good grind of pepper. (If you are pan-frying rather than air frying, leave the oil out here: it goes into the pan instead.) Season it now, right before it cooks: hash browns seasoned only at the end taste flat, and salted potato left sitting starts to weep water again.',
      ],
    },
    {
      heading: 'Oven and air fryer, side by side',
      items: [
        'Put the sausages into the hot roasting tin and roast for 25 minutes, turning them halfway, until browned all over and 71°C in the middle. No thermometer? Cut into the fattest one: there should be no pink at the centre and the juices should run clear.',
        'At the same time, spread the potato loosely in the hot air fryer basket, no more than about 3cm deep, and cook at 200°C for 20 to 25 minutes, shaking the basket every 5 minutes so the strands on top get their turn at the bottom. They are done when they are deep golden and crisp, with a few darker edges. If your basket is too small to keep them that shallow, cook them in two batches: start the first as soon as the potato is seasoned and put the sausages in when the second batch goes in, then tip the first batch back in on top for the last 3 minutes to crisp up again.',
        'No air fryer? Pan-fry them instead. Do this straight after the sausages go in, before the mushrooms. Heat 2 tablespoons of oil in your large frying pan over medium-high heat, spread the potato over the whole pan in an even layer about 1cm thick and press it down with a spatula. Leave it alone for 6 to 8 minutes, until the underside is deep golden, then cut it into quarters in the pan, flip each one and cook for another 5 to 6 minutes. Slide them onto a baking tray and into the oven beside the sausages, where the extra minutes only crisp them further, then wipe out the pan.',
        'When the sausages have had 10 minutes, set the tomato halves cut side up in the tin beside them, brush with half the oil and season with salt and pepper. Roast for 15 minutes, until soft, wrinkled and just starting to collapse. Without sausages, put the tomatoes in 10 minutes after the hash browns start and roast them for the same time.',
      ],
    },
    {
      heading: 'One frying pan, one thing at a time',
      items: [
        'When the tomatoes go in (or, if you pan-fried the hash browns, as soon as the pan is free), set the large frying pan over medium-high heat and add the 5g of butter for the mushrooms. When it foams, add the mushrooms in a single layer, cut side down, and leave them completely alone for 3 minutes, until browned underneath. Toss them and cook for another 3 to 4 minutes, until golden and any liquid has cooked away. Salt them only now, then tip them into an ovenproof dish and set it beside the hob.',
        'Put the frying pan back over medium heat with the rest of the oil. If you are using sujuk, fry the slices first, for about 1 minute a side, until the edges curl and they give up a puddle of red, spiced fat. Lift them onto the mushroom dish and leave the fat in the pan.',
        'Lay the rashers in the pan, in two batches if they will not all lie flat, and fry them for 2 to 3 minutes a side, until browned and crisp at the edges. Turkey rashers have almost no fat of their own, so keep the heat at medium: any hotter and they go from tender to leathery. Add them to the mushroom dish and take the pan off the heat.',
        'By now the sausages and tomatoes should be done. Take the tin out and turn the oven down to 100°C (80°C fan). Leave the door open for a minute to let it cool, then put back the tin and the dish of mushrooms and rashers, with your two plates on the bottom shelf to warm. When the hash browns are ready, spread them on a baking tray and add them too, uncovered, so they stay crisp. Covered, they steam and go soft.',
        'Tip the beans into a small pan over low heat and warm them for about 5 minutes, stirring now and then, until just bubbling at the edges. Do not let them boil hard, or the sauce thickens and catches on the bottom.',
      ],
    },
    {
      heading: 'Last, the eggs and toast',
      items: [
        'While the beans warm, set the frying pan over low heat and add the 5g of butter for the eggs (if you fried sujuk, its fat can stand in for some of it). Once the butter has melted but before it foams, crack in the eggs, two at a time if your pan will not hold four without crowding.',
        'Cover the pan with a lid and cook for 3 to 4 minutes, until the whites are completely set and the yolks still wobble. The trapped steam cooks the top of the white, so there is no need to flip or baste. Season with a pinch of salt and pepper.',
        'Put the bread in the toaster as the eggs go into the pan. It needs no butter: the egg yolk and the bean sauce do that job.',
        'Take everything out of the oven. Divide the hash browns, sausages or sujuk, rashers, tomatoes and mushrooms between the warm plates, spoon on the beans, and set the eggs on top. Toast alongside, ketchup or brown sauce on the side, and eat straight away.',
      ],
    },
  ],

  nutrition: { calories: 785, protein: 47, carbs: 67, fat: 37 },
  flavorProfile: { sweet: 2, salty: 4, sour: 1, bitter: 0, umami: 4, spicy: 0 },

  isVegetarian: false,
  isVegan: false,
  isGlutenFree: false,
  isDairyFree: false,

  quote:
    'A tangle of golden hash brown strands straight from the air fryer, crisp turkey rashers, mushrooms browned hard in butter and two runny-yolked eggs, all on the plate hot at the same moment.',
  description:
    'A full English is a plate of small, simple things that all have to arrive hot at once, and that timing is the whole trick of it. This is the halal version. Turkey rashers stand in for pork bacon, and there is one halal beef sausage each when I can find them. When I cannot, a few slices of sujuk take their place, bringing a little spice and the best fat there is for frying an egg. The hash browns are homemade. I grate the potatoes, wring them out in a tea towel until they are properly dry, season them, and let them crisp in the air fryer with a shake every few minutes, so they come out as a loose, crunchy pile of golden strands rather than a neat patty. The oven, the air fryer and one frying pan share the work, and the running order gets everything to the table together.',
  attribution: 'A Nieves\'s Kitchen take on the British fry-up',

  headnoteIngredients:
    'Buy halal-certified rashers, and sausages or sujuk. Turkey rashers are very lean, which is why they get a little oil in the pan. Black pudding is left off the plate.',
  headnoteInstructions:
    'Everything here is easy. The only skill is the order, so read the running order once before you light anything. The potatoes need about 10 minutes of grating and squeezing while the oven heats, and after that the oven and air fryer do most of the work while you move one frying pan from mushrooms to rashers to eggs.',

  equipment: [
    'An air fryer for the hash browns. A large frying pan does them well too, and the method gives you that version step by step.',
  ],

  tips: [
    'Squeeze the potato harder than feels necessary, then squeeze it again. Any water left in the strands turns to steam, and steamed potato never crisps.',
    'Do not pile the air fryer basket too deep. More than about 3cm and the middle steams while the top dries out. Two batches are better than one crowded one, and the first holds well in the low oven.',
    'Leave the mushrooms alone for the first few minutes and salt them at the end. Moved too early or salted too soon, they release their water and stew instead of browning.',
    'Keep turkey rashers at medium heat. With so little fat of their own, they dry out fast on a high flame.',
    'A lid on the eggs is the easiest way to a set white and a runny yolk, with no flipping and no basting.',
    'The nutrition figures include one sausage each. Sujuk in their place comes out about the same.',
  ],

  notes: [
    'Potatoes: floury ones crisp outside and stay fluffy inside, where waxy ones turn rubbery. Short on time? Frozen hash brown patties go in the air fryer at 200°C for 12 to 15 minutes, turned once. Not the same as loose homemade strands, but they work.',
    'Rashers: halal beef rashers work in place of turkey; they render more fat, so you will not need the oil. For a vegetarian plate, leave out the meat and fry thick slices of halloumi (check for a vegetarian rennet) for 1 to 2 minutes a side instead.',
    'Sausages: buy halal-certified, since a beef sausage from an ordinary butcher can still be in a pork casing.',
    'Gluten-free: use gluten-free bread and check the sausages, since many contain rusk. The hash browns themselves are gluten-free.',
  ],

  variations: [
    'Scrambled eggs instead of fried: melt the 5g of butter over low heat, add four beaten eggs with a pinch of salt, and stir slowly with a spatula for 3 to 4 minutes. Take them off while they still look a little wet, because they keep cooking on the plate.',
    'Poached eggs, for a lighter plate: simmer them in a wide pan of water with a splash of vinegar for 2 to 3 minutes, until the whites are set and the yolks runny.',
    'Doctored beans: stir a knob of butter, plenty of black pepper and a dash of Worcestershire sauce into the beans as they warm.',
    'Bubble and squeak instead of hash browns: fry leftover mash mixed with leftover cabbage or sprouts in a hot buttered pan, pressed flat, for about 5 minutes a side until a dark crust forms.',
    'A spoon of chili oil over the eggs, or a pinch of chili flakes into the sujuk fat before the eggs go in, gives the whole plate a warm kick.',
  ],

  storage:
    'Best eaten the moment it is plated. Leftover hash browns keep in the fridge for up to 2 days and crisp up again in the air fryer at 200°C for 3 to 4 minutes. To get ahead, grate the potatoes the night before and keep them covered in cold water in the fridge, then drain and squeeze them in the morning.',

  dropcap: true,

  image: '/recipes/halal-full-english-hero.webp',
  imageIsStock: false,
  images: [
    {
      url: '/recipes/halal-full-english-plate.webp',
      caption: 'Another morning\'s plate: rashers, roasted cherry tomatoes, mushrooms browned hard, beans and two fried eggs',
      width: 1200,
      height: 1600,
    },
  ],
};

export default recipe;
