// data/recipes-held/beef-yaki-udon.ts
import type { RecipeInput } from '../recipes/_types';

const recipe: RecipeInput = {
  title: 'Beef Yaki Udon',
  country: 'Japan',
  featuredIngredients: ['beef'],
  category: 'main',
  difficulty: 'Easy',
  servings: 2,
  time: { active: 25, total: 35 },
  yield: 'Serves 2, two big plates',
  tags: ['quick', 'high-protein', 'comfort food'],

  // Kokura, Kitakyushu, where yaki udon is said to have started.
  region: 'East Asia',
  coordinates: { lat: 33.88, lng: 130.88 },

  ingredients: [
    {
      heading: 'The beef',
      items: [
        { name: 'beef steak, such as sirloin, rump or bavette', amount: 250, unit: 'g' },
        { name: 'light soy sauce (halal-certified)', amount: 1, unit: 'tsp' },
        { name: 'cornflour', amount: 1, unit: 'tsp' },
        { name: 'water', amount: 1, unit: 'tbsp' },
        { name: 'neutral oil', amount: 1, unit: 'tsp' },
      ],
    },
    {
      heading: 'Noodles and vegetables',
      items: [
        { name: 'frozen udon noodles, about 200g each', amount: 2, unit: '' },
        { name: 'onion, thinly sliced', amount: 0.5, unit: '' },
        { name: 'small carrot, cut into thin batons or slices', amount: 1, unit: '' },
        { name: 'red pepper, thinly sliced', amount: 1, unit: '' },
        { name: 'white or pointed cabbage, cut into bite-sized squares', amount: 100, unit: 'g' },
        { name: 'beansprouts', amount: 100, unit: 'g' },
        { name: 'spring onions, cut into 4cm lengths, whites and greens kept apart', amount: 2, unit: '' },
        { name: 'neutral oil', amount: 2, unit: 'tbsp' },
      ],
    },
    {
      heading: 'The sauce',
      items: [
        { name: 'light soy sauce (halal-certified)', amount: 1.5, unit: 'tbsp' },
        { name: 'oyster sauce (halal-certified)', amount: 1.5, unit: 'tbsp' },
        { name: 'dark soy sauce (halal-certified)', amount: 1, unit: 'tsp' },
        { name: 'sugar', amount: 2, unit: 'tsp' },
        { name: 'rice vinegar', amount: 1, unit: 'tsp' },
        { name: 'garlic cloves, finely minced', amount: 2, unit: '' },
        { name: 'water', amount: 2, unit: 'tbsp' },
        { name: 'Worcestershire sauce (optional)', amount: 1, unit: 'tbsp' },
      ],
    },
    {
      heading: 'To finish',
      items: [
        { name: 'toasted sesame oil', amount: 1, unit: 'tsp' },
        { name: 'toasted sesame seeds', amount: 1, unit: 'tbsp' },
        { name: 'shichimi togarashi or chili flakes, to taste', amount: 0, unit: '' },
        { name: 'fresh green chili, thinly sliced (optional)', amount: 0, unit: '' },
        { name: 'pickled red ginger (beni shoga), optional', amount: 0, unit: '' },
      ],
    },
  ],

  steps: [
    {
      heading: 'Get everything ready',
      items: [
        'If you have time, put the steak in the freezer for 20 minutes first. Firm, half-frozen beef is far easier to slice thinly.',
        'Trim off any thick fat, then look for the grain: the lines of muscle fibre running along the steak. Slice straight across them, as thinly as you can, about 3mm, and cut any long slices into bite-sized pieces. Cutting across the grain shortens the fibres, and that is most of what makes the beef tender.',
        'Toss the beef with the teaspoon of soy sauce, the cornflour, the tablespoon of water and the teaspoon of oil until every slice is coated and the liquid has been absorbed. Leave it for 10 to 15 minutes while you do everything else. The thin cornflour coat holds the juices in when the beef hits the hot pan.',
        'Stir all the sauce ingredients together in a small bowl, with the Worcestershire sauce if you are using it, until the sugar dissolves.',
        'Cut the vegetables and keep them in three piles by cooking time: the onion, carrot and spring onion whites; the pepper and cabbage; the beansprouts and spring onion greens.',
        'If your sesame seeds are raw, toast them in the dry wok over medium heat for 2 to 3 minutes, shaking the pan, until golden and fragrant, then tip them out.',
        'Bring a pan of water to the boil (filling it from a just-boiled kettle is quickest) and drop in the frozen udon for about 1 minute, just until the blocks loosen into separate strands. Drain them in a colander and shake off as much water as you can. Wet noodles steam in the wok and turn the sauce watery.',
      ],
    },
    {
      heading: 'Into the wok',
      items: [
        'Heat a wok or your largest frying pan over high heat until it is just starting to smoke, then add 1 tablespoon of the oil. Lay in the beef in a single layer, in two batches if it will not all fit (let the pan get smoking hot again in between), and leave it alone for 1 minute, until browned underneath. Turn it and give it 30 seconds more, so it is still a little pink, then lift it onto a plate. It finishes cooking when it goes back in at the end, and that is what keeps it tender.',
        'Add the second tablespoon of oil to the pan, still over high heat. Add the onion, carrot and spring onion whites and stir-fry for 2 minutes, until the onion starts to soften and catch at the edges.',
        'Add the pepper and cabbage and stir-fry for 2 minutes more, until the cabbage has wilted but still has some bite.',
        'Add the drained udon, then pour the sauce around the edge of the pan so it hits the hot metal and sizzles. Toss for about 2 minutes, lifting the noodles from underneath with tongs rather than stirring so they do not break, until they have soaked up the sauce and look glossy and brown.',
        'Now spread the noodles out and leave them alone for 1 minute, so they catch and caramelise in places against the hot pan.',
        'Tip the beef back in with any juices from the plate, add the beansprouts and spring onion greens, and toss for 1 minute, until the beansprouts are hot but still crunchy and the beef has lost its pink. Taste, and add a splash more soy sauce if it needs it.',
      ],
    },
    {
      heading: 'To the plate',
      items: [
        'Take the pan off the heat and drizzle over the sesame oil. Pile the noodles onto two plates and scatter generously with the toasted sesame seeds and shichimi or chili flakes, plus fresh green chili or pickled ginger if you like. Eat straight away.',
      ],
    },
  ],

  nutrition: { calories: 700, protein: 39, carbs: 69, fat: 28 },
  flavorProfile: { sweet: 2, salty: 4, sour: 1, bitter: 0, umami: 4, spicy: 1 },

  isVegetarian: false,
  isVegan: false,
  isGlutenFree: false,
  isDairyFree: true,

  quote:
    'Thick, bouncy udon tossed hard with seared steak and a pile of vegetables in a glossy garlic and soy sauce, then left alone just long enough to catch.',
  description:
    'Yaki udon is the thick-noodle cousin of yakisoba, said to have started in Kitakyushu: chewy udon stir-fried hard with meat and vegetables in a soy-based sauce. This version uses thin slices of steak, cut across the grain and coated in a little cornflour so they stay tender, then seared fast and kept aside until the very last minute. The sauce leaves out the mirin and sake. A little sugar does their job, a teaspoon of rice vinegar keeps it bright, a teaspoon of dark soy adds colour and depth, and some minced garlic gives it punch. Worcestershire is there if you want its tang, but you will not miss it. Instead of bonito flakes on top, there are toasted sesame seeds and a shake of chili. The vegetables are whatever you have: carrot, red pepper, cabbage, onion and a handful of beansprouts are the default, but this is a good way to clear out the fridge. The one technique worth holding on to is the end, when you stop tossing and let the noodles sit against the hot pan until they caramelise in places.',
  attribution: 'A Nieves\'s Kitchen take on Japanese yaki udon',

  headnoteIngredients:
    'Frozen udon is the one to buy. It is cooked and then frozen fast, so it stays thick, chewy and bouncy, and it beats the vacuum-packed kind, though either works. Sirloin, rump or bavette all suit the beef, and the cheaper the cut, the thinner you should slice it. Buy halal-certified soy sauce and oyster sauce, since many oyster sauces list cooking wine. The vegetables are a guide: aim for about 450g in all of whatever you have. Mushrooms, mangetout, pak choi, broccoli and courgette are all good. Harder ones go in first and soft ones last.',
  headnoteInstructions:
    'Everything moves fast once the wok is hot, so have the beef marinating, the sauce mixed, the vegetables cut and the noodles drained before you turn on the heat. The beef cooks first and comes out again, the rest is built in the same pan, and the beef goes back in only for the last minute.',

  equipment: [
    'A wok, or your widest frying pan (28cm or more), so the noodles fry rather than steam. In a smaller pan, cook the vegetables in two lots.',
  ],

  tips: [
    'Get the pan properly hot before the beef goes in, and do not crowd it. Beef piled into a cooler pan stews in its own juices and turns grey and chewy. In a single layer over high heat it browns in a minute.',
    'Take the beef out while it is still a little pink. It goes back in at the end, and thin slices go from tender to tough in seconds.',
    'Using a cheaper steak? Add a quarter teaspoon of bicarbonate of soda to the marinade along with the cornflour. It tenderises the beef noticeably. Use no more than that, or the beef tastes soapy.',
    'Vacuum-packed udon needs no boiling. Put it in a bowl, pour over boiling water, loosen the strands with chopsticks for 30 seconds, then drain well.',
    'Lift and toss the noodles with tongs rather than stirring with a spatula. Udon is soft and breaks into short pieces if you push it around.',
    'If you use pickled red ginger, check the label. Some brands add alcohol as a preservative.',
  ],

  substitutions: [
    'No dark soy sauce? Leave it out and add an extra teaspoon of light soy sauce. The noodles will be paler but just as good.',
    'No rice vinegar? A squeeze of lemon or a few drops of apple cider vinegar does the same job.',
    'Dried udon works too. Cook it for a minute less than the packet says, rinse it under cold water so it does not stick, and drain it well.',
    'For a gluten-free plate, use thick rice noodles, tamari in place of both soy sauces and a gluten-free oyster sauce, and leave out the Worcestershire sauce, which is usually made with malt vinegar.',
  ],

  variations: [
    'Chicken in place of beef: slice boneless thighs thinly, marinate them the same way, and stir-fry for 3 to 4 minutes until cooked right through before lifting them out.',
    'Prawns in place of beef: skip the marinade and toss raw, peeled prawns in with the beansprouts for the last 2 minutes, until pink all over.',
    'Tofu in place of beef: cube firm tofu, fry it in the oil until golden on all sides, set it aside, and return it with the beansprouts. Use a mushroom-based vegetarian oyster sauce in place of the oyster sauce, and leave out the Worcestershire sauce, which contains anchovies.',
    'If you like ginger with your garlic, grate 1 tsp of fresh ginger into the sauce as well.',
    'Finish with a knob of butter tossed through off the heat, plus a splash more soy. Butter and soy is a very Japanese pairing, and it makes the noodles glossy and rich. It is no longer dairy-free.',
    'Top each plate with a fried egg, so the runny yolk becomes a second sauce.',
    'For heat, whisk 1 tbsp halal-certified gochujang into the sauce, or 1 tsp Japanese curry powder for a curry yaki udon.',
  ],

  storage:
    'Best eaten straight away. Leftovers keep in a sealed container in the fridge for up to 2 days. Reheat in a hot pan with a splash of water, tossing until steaming hot all the way through. The beansprouts soften, but it is still very good.',

  dropcap: true,

  image: 'https://images.unsplash.com/photo-1681011964766-9734e11ec93f?w=1200&q=80',
  imageIsStock: true,
};

export default recipe;
