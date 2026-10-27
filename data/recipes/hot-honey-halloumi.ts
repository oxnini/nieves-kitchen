// data/recipes/hot-honey-halloumi.ts
import type { RecipeInput } from './_types';

const recipe: RecipeInput = {
  title: 'Hot Honey Halloumi',
  country: 'Cyprus',
  featuredIngredients: ['honey'],
  category: 'side',
  difficulty: 'Easy',
  servings: 2,
  time: { active: 15, total: 25 },
  yield: 'Serves 2 as a side, or fills 2 wraps',
  tags: ['vegetarian', 'quick', 'high-protein', 'spicy'],

  region: 'Middle East',
  coordinates: { lat: 35.1856, lng: 33.3823 },

  ingredients: [
    {
      heading: 'The halloumi',
      items: [
        { name: 'halloumi', amount: 250, unit: 'g', note: 1 },
        { name: 'olive oil', amount: 1, unit: 'tsp' },
      ],
    },
    {
      heading: 'The hot honey',
      items: [
        { name: 'runny honey', amount: 2, unit: 'tbsp' },
        { name: 'dried chili flakes, such as Thai', amount: 0.5, unit: 'tsp', note: 2 },
        { name: 'lemon juice', amount: 1, unit: 'tsp', note: 3 },
      ],
    },
    {
      heading: 'To finish',
      items: [
        { name: 'a few mint or coriander leaves', amount: 0, unit: '' },
        { name: 'fresh red or green chili, thinly sliced (optional)', amount: 0, unit: '' },
      ],
    },
    {
      heading: 'For wraps (optional)',
      items: [
        { name: 'flatbreads or soft wraps', amount: 2, unit: '', note: 4 },
        { name: 'thick Greek yogurt', amount: 4, unit: 'tbsp' },
        { name: 'tomato, sliced', amount: 1, unit: '' },
        { name: 'cucumber, sliced', amount: 0.25, unit: '' },
      ],
    },
  ],

  steps: [
    {
      heading: 'Soak',
      items: [
        'Cut the halloumi into 8 slices about 1cm thick. Put them in a bowl, cover with water from a just-boiled kettle cut with a little cold tap water, so it is very hot but not boiling, and leave for 10 minutes. The soak warms the cheese right through, so the middle is soft by the time the outside is golden, and it draws out some of the salt.',
        'While it soaks, stir the honey, chili flakes and lemon juice together in a small cup and leave the chili to steep. If your honey is thick or set, warm it for a few seconds first so it pours. Making wraps? Slice the tomato and cucumber now, and warm the flatbreads in your dry frying pan for 30 seconds a side, then keep them wrapped in a clean tea towel.',
      ],
    },
    {
      heading: 'Fry and glaze',
      items: [
        'Drain the halloumi and pat each slice very dry between sheets of kitchen paper, pressing firmly. Wet slices spit and steam instead of browning.',
        'Heat the oil in a large non-stick or cast-iron frying pan over medium-high heat for 1 minute. Lay in the slices in one layer and leave them alone for 2 to 3 minutes, until the undersides are deep golden. Turn them and cook for 2 minutes more, until golden on the second side.',
        'Turn the heat down to very low and wait 30 seconds, then pour the hot honey over the slices. It will bubble. Turn the slices in it for about 30 seconds, until glossy and sticky. Keep the heat very low: honey burns quickly.',
      ],
    },
    {
      heading: 'Serve',
      items: [
        'As a side: lift the halloumi onto a plate, spoon over the honey left in the pan and scatter over the herbs and fresh chili, if using. Eat straight away, while the middle is still soft.',
        'In wraps: spread each warm flatbread with half the yogurt, add the tomato, cucumber and herbs, then 4 slices of hot halloumi and a drizzle of the pan honey. Roll up and eat.',
      ],
    },
  ],

  nutrition: { calories: 485, protein: 27, carbs: 20, fat: 34 },
  flavorProfile: { sweet: 3, salty: 4, sour: 1, bitter: 0, umami: 2, spicy: 2 },

  isVegetarian: true,
  isVegan: false,
  isGlutenFree: true,
  isDairyFree: false,

  quote: 'Golden, crisp-edged halloumi with a soft middle, glossed in honey that bites back.',
  description:
    'Halloumi is the grilling cheese of Cyprus, firm enough to fry without melting into the pan. Here a single pack is sliced, soaked in hot water for 10 minutes, fried to a deep gold and turned in honey sharpened with chili flakes and lemon. The soak is what makes this version: it warms the cheese through so the middle stays soft rather than rubbery, and it takes the edge off the salt, so the sweet heat of the honey comes through. Serve it as a side for two, or roll it into warm flatbreads with tomato, cucumber and yogurt for a quick lunch.',
  attribution: 'A Nieves\'s Kitchen take on Cypriot fried halloumi',

  headnoteIngredients:
    'One ordinary pack of halloumi serves two as a side. Any runny honey works. The chili flakes give a steady warmth through the honey; the fresh chili on top is for anyone who wants more.',
  headnoteInstructions:
    'Three things make it work: a hot-water soak, so the middle is soft by the time the outside is golden; very dry slices, so they brown instead of steaming; and the honey added over very low heat at the very end, so it glazes without burning.',

  tips: [
    'Do not skip the drying. Even a little water left on the slices makes them spit and steam, and they come out pale.',
    'Leave the slices alone for the first 2 minutes. Once a crust has formed they release from the pan by themselves; if one sticks, give it another 30 seconds.',
    'Taste the honey before it goes in. Want more heat? Add another pinch of flakes. Too sweet? A few more drops of lemon.',
    'Cook it last, just before you eat. Halloumi firms up and turns squeaky as it cools.',
  ],

  notes: [
    'Halloumi: any 225 to 250g pack. Check the label for the rennet: many brands use microbial (vegetarian) rennet.',
    'Chili flakes: dried chilies vary a lot in heat, so start with half a teaspoon, taste the honey and add more if you like it hotter. Aleppo or Urfa pepper flakes are milder and fruitier, so use 1 tsp. Or swap the flakes for 1 fresh red chili, finely chopped.',
    'Lemon juice: a teaspoon of cider vinegar does the same job.',
    'Flatbreads: khubz, pitta or soft tortilla wraps all work. Use gluten-free wraps to keep it gluten-free.',
  ],

  variations: [
    'Sesame crunch: scatter a teaspoon of toasted sesame seeds over with the herbs.',
    'Chili oil honey: in place of the flakes, stir 1 to 2 teaspoons of crispy chili oil into the honey (check the label).',
    'Air fryer: soak and dry the slices, brush them with the oil and air fry at 200°C for 8 to 10 minutes, turning halfway, until golden. Toss them with the hot honey in a bowl.',
    'As a salad: serve the slices over rocket, tomato and cucumber with a squeeze of lemon, using the honey from the pan as the dressing.',
  ],

  storage:
    'Best eaten straight from the pan. Leftovers keep in the fridge for 2 days; warm them in a dry frying pan for a minute a side rather than in the microwave, which makes them rubbery.',

  dropcap: true,

  image: '/recipes/hot-honey-halloumi-hero.webp',
  imageIsStock: false,
  images: [
    {
      url: '/recipes/hot-honey-halloumi-pan.webp',
      caption: 'In the pan, golden on both sides and flecked with chili, just before the hot honey goes in',
      width: 1265,
      height: 1244,
    },
  ],
};

export default recipe;
