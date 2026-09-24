// data/recipes/uyghur-lamb-polo.ts
import type { RecipeInput } from './_types';

const recipe: RecipeInput = {
  title: 'Uyghur Lamb Polo',
  country: 'China',
  featuredIngredients: ['lamb'],
  category: 'main',
  difficulty: 'Medium',
  servings: 4,
  time: { active: 45, total: 180, resting: 10 },
  yield: 'One large platter, generous for 4',
  tags: ['high-protein', 'one-pot', 'comfort food', 'weekend feast'],

  region: 'East Asia',
  coordinates: { lat: 39.47, lng: 75.99 },

  ingredients: [
    {
      heading: 'The lamb',
      items: [
        { name: 'bone-in lamb shoulder, cut into 4 to 5cm chunks', amount: 1, unit: 'kg' },
        { name: 'onions, sliced into half moons (one of them red, if you have it)', amount: 4, unit: '' },
        { name: 'whole cumin seeds', amount: 2, unit: 'tsp' },
        { name: 'white pepper', amount: 1, unit: 'tsp' },
        { name: 'black pepper', amount: 0.5, unit: 'tsp' },
        { name: 'salt', amount: 1.5, unit: 'tsp' },
        { name: 'vegetable stock cube', amount: 0.5, unit: '' },
        { name: 'water', amount: 700, unit: 'ml' },
      ],
    },
    {
      heading: 'The rice',
      items: [
        { name: 'jasmine rice', amount: 350, unit: 'g' },
        { name: 'large carrots, cut into thick 1cm matchsticks (half go in with the lamb, half with the rice)', amount: 3, unit: '' },
        { name: 'whole garlic bulb, loose skin removed, top trimmed', amount: 1, unit: '' },
        { name: 'of the strained, skimmed broth', amount: 400, unit: 'ml' },
      ],
    },
    {
      heading: 'To finish',
      items: [
        { name: 'whole cumin seeds, for toasting over the top', amount: 0.5, unit: 'tsp' },
      ],
    },
  ],

  steps: [
    {
      heading: 'Before anything else',
      items: [
        'Rinse the jasmine rice in a sieve until the water runs clear. Do not soak it. Leave it draining while everything else happens, which is the whole of its preparation.',
      ],
    },
    {
      heading: 'Build the broth',
      items: [
        'Set a wide frying pan over medium-high heat with no oil at all. Lay the lamb in fat side down and let it render for a minute or two, then sear in batches until deeply coloured. Give the pieces room, because a crowded pan steams instead of browning. Move each finished batch into your heavy pot.',
        'In the same pan, cook the onions in the rendered lamb fat until soft and properly golden. Four onions takes a while and it is worth every minute, because this is where all the sweetness in the finished dish comes from. Add the 2 tsp of cumin seeds and stir for 30 seconds until fragrant, then tip the lot into the pot.',
        'Splash a little of the water into the hot frying pan and scrape up every brown bit stuck to the base. Pour that into the pot too.',
        'Add the rest of the water, half the white pepper, all the black pepper, the salt and the half stock cube. Bring to a boil, then drop the heat until the surface is barely moving and put the lid on.',
        'Braise for about 1 hour 45 minutes, checking once or twice that it is still at a bare simmer and has not gone dry. A piece of lamb from the middle should give with almost no resistance. If it still resists, give it another 20 minutes.',
        'With about 30 minutes left, stir in half the carrots. These are the ones that go soft and sweet and give themselves up to the broth, which is where a lot of the finished sweetness comes from.',
      ],
    },
    {
      heading: 'Skim, then measure',
      items: [
        'Lift the lamb out and set it aside. Skim the fat off the surface of the broth first, then ladle the broth into a jug. Skimming before measuring is not fussiness: fat floating on top makes the volume read higher than the liquid the rice can actually absorb, and that is how polo turns out wet.',
        'Keep 400ml. If you have more, reduce it down; if you have less, top up with water. Now taste it. It should be noticeably saltier than you would want to drink, because the rice is about to dilute it. This is your only chance to adjust the seasoning of the whole dish, so take it seriously.',
        'Stir the remaining half of the white pepper into the measured broth. Its aroma is volatile and the long braise flattens it, so this late addition is what you will actually taste.',
      ],
    },
    {
      heading: 'Layer and steam',
      items: [
        'Pour the broth back into the pot. Return the lamb, scatter the remaining raw carrots over it, and push the garlic bulb into the middle. Spread the drained rice evenly on top and press it level. Do not stir any of it together, the layers are the point.',
        'Lid on, lowest heat your hob will hold, 12 minutes.',
        'Take the pot off the heat entirely and leave it, lid still on and undisturbed, for 10 minutes. The rice finishes in its own steam here. Lifting the lid early costs you the fluffiness you just spent three hours earning.',
      ],
    },
    {
      heading: 'Serve',
      items: [
        'While the rice rests, toast the remaining ½ tsp of cumin seeds dry in the frying pan for under a minute, until they smell nutty, then crush them roughly.',
        'Lift out the garlic bulb. Fold the rice gently up through the carrots with a fork, pile it onto a platter, lamb on top, garlic in the middle for people to squeeze over their own plate. Scatter the toasted cumin across the lot.',
      ],
    },
  ],

  nutrition: { calories: 720, protein: 39, carbs: 81, fat: 25 },
  flavorProfile: { sweet: 2, salty: 3, sour: 1, bitter: 1, umami: 4, spicy: 2 },

  isVegetarian: false,
  isVegan: false,
  isGlutenFree: true,
  isDairyFree: true,

  quote:
    'Lamb shoulder braised down into its own broth, then carrots and rice laid on top and left alone. The only step that decides whether this comes out fluffy or wet is measuring the broth.',
  description:
    'Xinjiang style polo, the one-pot cousin of Uzbek plov, and the dish I reach for when I want the house to smell like cumin for the rest of the day. Bone-in lamb shoulder goes into a long slow braise until it gives up everything it has to the liquid around it, and that liquid is what cooks the rice. Whole cumin seeds and a heavy hand with white pepper do all the flavouring, no ground spice at all. The rice comes out fragrant and separate rather than sticky, because the broth is measured before it ever goes near it.',
  attribution: 'A Nieves\'s Kitchen original',
  headnoteIngredients:
    'No oil anywhere in this recipe. A fatty shoulder renders more than enough to sear itself and to cook the onions afterwards, and that rendered fat is half the flavour.',
  headnoteInstructions:
    'The frying pan gets the colour, the pot gets the tenderness. Searing in the pot you will braise in is tempting and it does not work: the sides are too tall, the surface too cool, and the lamb ends up grey.',

  equipment: [
    'A heavy pot with a well-fitting lid, so the rice can steam without drying out (a casserole or any deep pan that seals properly)',
    'A wide frying pan for searing, separate from the pot, because the colour comes from a hot open surface',
    'A measuring jug, which sounds trivial until you read the broth step',
  ],

  tips: [
    'Taste the broth before the rice goes on and make it saltier than you would want to drink. The rice dilutes it, and after this point there is nothing you can do.',
    'Skim the fat before you measure, never after. Fat on the surface makes the volume read high and the rice comes out wet.',
    'Give the lamb room in the pan and sear it in batches. A crowded pan steams, and steamed lamb has no colour to give the broth.',
    'If the rice comes out a little dry for your taste, nudge up to 450ml of broth next time rather than jumping to a full 1:1 with the rice.',
    'Splitting the carrots is worth the small extra step. The half that braises with the lamb goes soft and sweet and disappears into the broth, while the half laid under the rice at the end keeps a real bite against the soft grains. Two textures out of one ingredient.',
    'Serve it with a sharp salad of tomato, raw red onion and green chilli. The dish is rich and it wants something bright next to it.',
  ],

  substitutions: [
    'Pressure cooker instead of a pot: 45 minutes under pressure with a full natural release, and start with 500ml of water rather than 700ml because almost nothing escapes. For the rice stage, use only 250ml of broth, 4 minutes under pressure, then a full natural release without venting. Never fill the pot past half full once rice is involved.',
    'Rice cooker for the rice stage: braise the lamb in a pot or pressure cooker as written, then layer the broth, lamb, carrots, garlic and rinsed rice into the rice cooker exactly as you would the pot and run a standard white rice cycle. Leave it on warm for 10 minutes afterwards rather than opening it straight away. Use the same 400ml of measured broth and ignore the fill markings inside the bowl, because those assume plain rice and plain water, and the lamb and carrots here add moisture of their own. You want a large cooker for this, a 1.8 litre or 10 cup, since a small one will not hold the lamb as well as the rice.',
    'Boneless shoulder: 800g, and about 1 hour 20 minutes of braising. Bone-in makes a noticeably better broth, which matters more here than usual because the broth becomes the rice.',
    'Basmati instead of jasmine: give it 14 minutes rather than 12, and start with 450ml of broth.',
    'No stock cube: the lamb broth stands up perfectly well on its own, just salt a little harder and taste before the rice goes on.',
    'Cooking gluten free: lamb, rice and vegetables are all naturally safe here, but check your stock cube, as many contain wheat. Leaving it out entirely is the simplest answer.',
  ],

  variations: [
    'Faster, in a rice cooker: swap the bone-in shoulder for 500g of boneless leg or shoulder steak cut into 2cm pieces. Sear them hard, cook the onions golden in the same pan as usual, then layer everything into the rice cooker with 400ml of well seasoned chicken or lamb stock in place of the braising broth and run a standard cycle. About 50 minutes start to finish. It is a genuinely good weeknight pilaf, though the full version carries a richness that comes from shoulder collagen breaking down over the long braise.',
    'Yellow carrots if you can find them, which is what both Xinjiang and Uzbek cooks traditionally use. They are less sweet than orange ones and hold their shape better through the steam.',
    'Raisins or drained chickpeas scattered in with the carrots, both traditional and both good.',
    'Toasted flaked almonds over the top at the end, for something to bite against the soft rice.',
  ],

  storage:
    'Keeps 3 days in the fridge, and it is genuinely excellent reheated, which is not something you can say about most rice dishes. Tip it into a hot frying pan and leave it alone for a few minutes: the bottom catches and crisps, the lamb browns at its edges, and you get something closer to a fried rice than to leftovers. If you would rather keep it soft, reheat it covered on the hob with a splash of water over low heat so the rice steams back to life instead. Any leftover broth is worth keeping too: refrigerate and use within 3 days or freeze it, and it makes an excellent base for a noodle soup or for the next batch of rice you cook. The skimmed lamb fat deserves a jar as well. Its best use is roast potatoes, the tray smoking hot before the parboiled potatoes go in. It carries the cumin with it, so save it for something that wants to taste of this.',

  dropcap: true,

  image: '/recipes/uyghur-lamb-polo-hero.webp',
  imageIsStock: false,
  images: [
    {
      url: '/recipes/uyghur-lamb-polo-layered.webp',
      caption: 'The rice spread over the lamb and carrots, still unstirred',
      width: 1086,
      height: 1448,
    },
    {
      url: '/recipes/uyghur-lamb-polo-folded.webp',
      caption: 'Folded gently up through the carrots with a fork',
      width: 1448,
      height: 1086,
    },
  ],
};

export default recipe;
