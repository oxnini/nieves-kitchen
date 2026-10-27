// data/recipes/beef-chow-mein.ts
import type { RecipeInput } from './_types';

const recipe: RecipeInput = {
  title: 'Beef Chow Mein',
  country: 'China',
  featuredIngredients: ['beef'],
  category: 'main',
  difficulty: 'Easy',
  servings: 3,
  time: { active: 25, total: 40 },
  yield: 'Serves 3, or 2 very hungry people',
  tags: ['high-protein', 'comfort food'],

  region: 'East Asia',
  coordinates: { lat: 23.1291, lng: 113.2644 },

  ingredients: [
    {
      heading: 'The beef',
      items: [
        { name: 'flank or rump steak, thinly sliced across the grain', amount: 250, unit: 'g', note: 1 },
        { name: 'bicarbonate of soda', amount: 0.25, unit: 'tsp' },
        { name: 'water', amount: 1, unit: 'tbsp' },
        { name: 'light soy sauce', amount: 1, unit: 'tsp', note: 2 },
        { name: 'cornflour', amount: 2, unit: 'tsp' },
        { name: 'neutral oil', amount: 1, unit: 'tsp' },
      ],
    },
    {
      heading: 'The noodles',
      items: [
        { name: 'fresh thin egg noodles', amount: 250, unit: 'g', note: 3 },
        { name: 'neutral oil', amount: 1, unit: 'tsp' },
      ],
    },
    {
      heading: 'The sauce',
      items: [
        { name: 'oyster sauce', amount: 1.5, unit: 'tbsp', note: 2 },
        { name: 'dark soy sauce', amount: 2, unit: 'tsp', note: 2 },
        { name: 'sugar', amount: 1, unit: 'tsp' },
        { name: 'white pepper', amount: 0.25, unit: 'tsp' },
        { name: 'water', amount: 2, unit: 'tbsp' },
        { name: 'light soy sauce, kept separate for the rim of the wok', amount: 1, unit: 'tbsp', note: 2 },
      ],
    },
    {
      heading: 'The stir-fry',
      items: [
        { name: 'neutral oil', amount: 3, unit: 'tbsp' },
        { name: 'onion, sliced', amount: 1, unit: '' },
        { name: 'red pepper, cut into strips', amount: 0.5, unit: '', note: 4 },
        { name: 'garlic cloves, minced', amount: 2, unit: '' },
        { name: 'fresh ginger, grated', amount: 1, unit: 'tsp' },
        { name: 'beansprouts, rinsed and drained well', amount: 150, unit: 'g' },
        { name: 'spring onions, cut into 5cm lengths', amount: 3, unit: '' },
      ],
    },
    {
      heading: 'To finish',
      items: [
        { name: 'toasted sesame oil', amount: 1, unit: 'tsp' },
        { name: 'chili crisp, about 2 tsp per plate', amount: 2, unit: 'tbsp', note: 5 },
      ],
    },
  ],

  steps: [
    {
      heading: 'Before you start',
      items: [
        'Toss the beef with the bicarbonate of soda and the tablespoon of water, massaging it until the water has been absorbed. Mix in the teaspoon of light soy, the cornflour and the teaspoon of oil, and leave it for 20 minutes. This velveting is what keeps the beef silky through a fierce sear.',
        'Bring a large pan of water to the boil. Cook fresh noodles for 1 minute, stirring to loosen them, or dried noodles for 1 minute less than the packet says. Drain, rinse under cold water and drain again really well, shaking the colander hard. Spread them out on a tray or a clean tea towel for a few minutes so the surface water steams off, then toss them with the teaspoon of oil. Dry noodles crisp; wet ones only steam.',
        'Stir the oyster sauce, dark soy, sugar, white pepper and water together in a small bowl. Keep the tablespoon of light soy separate, in a little cup by the hob. Slice the onion and pepper, mince the garlic, grate the ginger and cut the spring onions, so everything is within reach before the wok goes on.',
      ],
    },
    {
      heading: 'Crisp the noodles',
      items: [
        'Heat a wok or your largest frying pan over high heat until it just starts to smoke. Add 1 tablespoon of the oil and swirl it round, then turn the heat down to medium-high. (A non-stick pan should not be heated empty: put the oil in first and wait until it shimmers.) Spread the noodles out in a thin, even layer. If your pan is smaller than 30cm across, do this in two batches, splitting the oil between them, because a heap of noodles steams instead of crisping.',
        'Leave them completely alone for 2 to 3 minutes, until golden and crisp underneath when you lift an edge. Flip them in sections, drizzle another half tablespoon of oil round the edge of the pan, and give them 2 minutes more. Patchy is right: some strands crisp and toasty, some still soft. Tip them onto a plate.',
      ],
    },
    {
      heading: 'Sear the beef',
      items: [
        'Put the pan back over high heat until it smokes again and add 1 tablespoon of the oil. Lay the beef in a single layer, working in two batches if it will not fit without overlapping, and leave it for 30 to 45 seconds, until browned underneath. Turn it and give it 30 seconds more. It should still be pink in places, since it finishes cooking in the final toss. Lift it into a bowl, not onto the noodles, so its juices do not soften the crisp bits.',
      ],
    },
    {
      heading: 'Bring it together',
      items: [
        'Add the last half tablespoon of oil to the pan over high heat. Stir-fry the onion and pepper for 1 minute, until just softening at the edges, then add the garlic and ginger for 30 seconds, until fragrant.',
        'Tip in the noodles and the beef with any juices, and toss for 30 seconds, breaking up the noodles, until everything is hot.',
        'Push everything into the middle so a ring of bare, hot metal shows round the edge of the pan. Drizzle the tablespoon of light soy round that ring, the rim of the wok or the outer edge of a frying pan, not straight onto the noodles. It should hiss and bubble the moment it lands; if it does not, give the pan another 30 seconds on high before you pour. Toss straight away. Then pour the sauce over and keep lifting and folding for 30 to 45 seconds, until every strand is evenly brown and nothing pools in the bottom of the pan.',
        'Add the beansprouts and spring onions and toss for 30 to 60 seconds, just until the sprouts are hot but still crunchy. Take the pan off the heat and toss through the sesame oil.',
        'Pile onto plates and spoon about 2 teaspoons of chili crisp over each one, crunchy bits and oil together, to stir in at the table.',
      ],
    },
  ],

  nutrition: { calories: 660, protein: 30, carbs: 64, fat: 31 },
  flavorProfile: { sweet: 2, salty: 4, sour: 0, bitter: 0, umami: 4, spicy: 2 },

  isVegetarian: false,
  isVegan: false,
  isGlutenFree: false,
  isDairyFree: true,

  quote:
    'Noodles left alone in a hot wok until their edges turn crisp and toasty, tossed with silky beef and a splash of soy that sizzles down the rim, with a spoon of chili crisp on top.',
  description:
    'Chow mein simply means fried noodles, and the Cantonese way with them is a hot wok, very little sauce and noodles that pick up crisp, toasty edges rather than turning soft and slippery. This version keeps to that. The beef is velveted with a pinch of bicarb and a little cornflour, so it stays silky through a hard sear. The noodles are boiled for just a minute, dried properly and left alone in the pan until they crisp in patches. The light soy goes round the hot rim of the wok, where it sizzles and catches before it reaches the noodles, which gives a smokier edge than pouring it straight in, and ginger goes in alongside the garlic. To finish, a spoonful of chili crisp over each plate adds heat, crunch and a little more oil to bind it all.',
  attribution: 'A Nieves\'s Kitchen take on a Cantonese classic',

  headnoteInstructions:
    'Once the wok is hot it all happens in about 10 minutes, in stages that reuse the same pan: noodles, then beef, then vegetables, then everything back together. Have every bowl and cup lined up by the hob before you start, and use the 20 minutes the beef sits to cook and dry the noodles.',

  equipment: [
    'A wok, or the largest frying pan you have, ideally 30cm or more, so the noodles can spread out thinly enough to crisp. In a smaller pan, crisp the noodles in two batches.',
  ],

  tips: [
    'Dry noodles are the whole trick. After rinsing, shake them hard and let them sit spread out for a few minutes. Any water left on them turns the crisping stage into steaming.',
    'Leave the noodles alone. Stirring is what stops them crisping, so let them sit until they are golden underneath before you flip, and do not worry about turning them in one piece.',
    'The soy round the rim is worth the extra second. It lands on bare, hot metal instead of on the noodles, sizzles and caramelises as it runs in, and gives the noodles a smoky, restaurant-wok taste that a home hob rarely gets otherwise. Poured straight on, it only makes them wet.',
    'Sear the beef in one layer and take it out while it is still pink in places. It goes back in at the end and finishes cooking in the final toss.',
    'A quarter teaspoon of bicarb is plenty for this much beef. Any more and it can taste faintly soapy.',
    'If you are cooking for two, this makes two very generous plates, at about 990 kcal each rather than 660 for three.',
  ],

  notes: [
    'Beef: sirloin works in place of flank or rump. Boneless chicken thigh works too, velveted the same way; make sure it reaches 74°C inside.',
    'Soy and oyster sauce: check the labels. No suitable oyster sauce? A mushroom-based vegetarian stir-fry sauce does the same job, with the same body and gloss.',
    'Noodles: look for thin fresh egg noodles labelled Hong Kong style or chow mein in the chiller of a Chinese supermarket. Or use 200g dried thin egg noodles, or about 450g ready-to-wok noodles (three 150g pouches): skip the boiling, loosen them under the hot tap, drain and let them dry for a few minutes.',
    'Red pepper: a carrot in matchsticks, or any crunchy vegetable sliced thin, works in its place.',
    'Chili crisp: the classic Lao Gan Ma Spicy Chili Crisp is meat-free, but some jars in the same range contain beef or chicken, so check the label.',
  ],

  variations: [
    'Crispy noodle cake, the Hong Kong way: fry all the noodles as one round cake, about 3 minutes a side with a little extra oil, until crisp on both faces. Slide it onto a plate, stir-fry the beef and vegetables with the sauce plus 3 tablespoons of water and half a teaspoon of cornflour, and pour it over the top.',
    'Soft, lo mein style: skip the crisping, and toss the boiled noodles straight in with the beef and vegetables. Softer and saucier.',
    'More greens: halve 2 heads of pak choi, or cut a bunch of choy sum into lengths, and add them with the onion.',
    'Black pepper beef: add a teaspoon of coarse black pepper to the beef as it marinates and another to the sauce.',
    'Pile on sliced fresh green chili and a handful of coriander with the chili crisp.',
  ],

  storage:
    'Best eaten straight from the wok, while the noodles still have their crisp edges. Leftovers keep in the fridge for up to 2 days. Reheat them in a hot wok or frying pan with a splash of water, tossing until hot through; the noodles will be softer the second time. Add the chili crisp fresh.',

  dropcap: true,

  image: 'https://images.unsplash.com/photo-1666613710166-91a0cb67fad9?w=1200&q=80',
  imageIsStock: true,
};

export default recipe;
