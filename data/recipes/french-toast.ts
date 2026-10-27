// data/recipes/french-toast.ts
import type { RecipeInput } from './_types';

const recipe: RecipeInput = {
  title: 'French Toast',
  featuredIngredients: ['eggs', 'milk'],
  category: 'dessert',
  difficulty: 'Easy',
  servings: 3,
  time: { active: 25, total: 25 },
  yield: '6 thick slices, serves 3',
  tags: ['treat', 'vegetarian', 'comfort food'],

  ingredients: [
    {
      heading: 'The bread',
      items: [
        { name: 'thick slices of brioche, 2.5 to 3cm thick (about 350g in all)', amount: 6, unit: '', note: 1 },
      ],
    },
    {
      heading: 'The egg mix',
      items: [
        { name: 'large eggs', amount: 4, unit: '' },
        { name: 'whole milk', amount: 200, unit: 'ml', note: 2 },
        { name: 'light brown soft sugar', amount: 1, unit: 'tbsp' },
        { name: 'vanilla extract', amount: 1, unit: 'tsp', note: 3 },
        { name: 'ground cinnamon', amount: 0.5, unit: 'tsp' },
        { name: 'fine salt, a pinch', amount: 0, unit: '' },
      ],
    },
    {
      heading: 'For the pan',
      items: [
        { name: 'unsalted butter', amount: 30, unit: 'g' },
        { name: 'sunflower or other neutral oil', amount: 1, unit: 'tbsp' },
      ],
    },
    {
      heading: 'Your toppings',
      items: [
        { name: 'maple syrup or honey', amount: 0, unit: '' },
        { name: 'fresh fruit, such as berries or sliced banana', amount: 0, unit: '' },
        { name: 'chocolate hazelnut spread, such as Nutella (optional)', amount: 0, unit: '' },
        { name: 'icing sugar, to dust (optional)', amount: 0, unit: '' },
      ],
    },
  ],

  steps: [
    {
      heading: 'The egg mix',
      items: [
        'Cut the brioche into 6 slices, 2.5 to 3cm thick, if it is not already sliced. Thinner slices go soggy right through.',
        'In a shallow dish wide enough to hold 3 slices flat, stir the sugar, cinnamon and salt together with a fork, so the cinnamon does not float in specks. Crack in the eggs, add the vanilla and whisk hard until there are no streaks of clear white left, then whisk in the milk.',
      ],
    },
    {
      heading: 'Soak and fry',
      items: [
        'Set a large non-stick frying pan, about 28cm across, over medium-low heat and add half the butter and half the oil. Let it melt and foam, about 1 minute.',
        'Lay 3 slices in the egg mix for about 15 seconds, turn them and give them 15 seconds more, until they feel heavy and soaked but still hold together when lifted. A firmer or drier loaf may need up to 30 seconds a side. Let the excess drip off, then lay them in the pan.',
        'Cook without pressing them down for 3 to 4 minutes, until the underside is an even, deep golden brown, then turn and cook the other side for 3 to 4 minutes. If they colour within 2 minutes, turn the heat down a touch. Press the middle of a slice: it should feel springy, with no liquid egg seeping out. If it still feels wet, turn the heat to low, cover the pan and give it 2 minutes more.',
        'Move the slices to a wire rack or warm plate. Wipe out the pan with kitchen paper, add the rest of the butter and oil, stir the egg mix and cook the last 3 slices the same way.',
      ],
    },
    {
      heading: 'To the table',
      items: [
        'Serve 2 slices each, with whatever toppings you like: a drizzle of maple syrup or honey, fresh fruit, a spoonful of chocolate hazelnut spread, or a dusting of icing sugar.',
      ],
    },
  ],

  nutrition: { calories: 760, protein: 22, carbs: 88, fat: 35 },
  flavorProfile: { sweet: 4, salty: 1, sour: 0, bitter: 0, umami: 1, spicy: 0 },

  isVegetarian: true,
  isVegan: false,
  isGlutenFree: false,
  isDairyFree: false,

  quote:
    'Thick slices of brioche, soaked and fried slowly in butter until deep golden outside and soft in the middle, then piled with whatever you love.',
  description:
    'Good French toast is caramel-brown and buttery on the outside and soft and set on the inside, with no wet, eggy middle and no burnt edges. It comes down to two things: thick bread and a gentle pan. Slices 2.5 to 3cm thick soak up enough egg to stay soft, and medium-low heat gives the middle time to set before the crust goes too dark. The egg mix is only lightly sweetened, because sugar burns in the pan, so the sweetness goes on at the end with your favourite toppings: maple syrup, honey, fruit or a spoonful of chocolate spread.',
  attribution: 'A Nieves\'s Kitchen take on French toast',

  headnoteIngredients:
    'Brioche gives the softest, richest toast, but challah or a thick white loaf works too (see note 1). Day-old bread is best, since it soaks up the egg without falling apart. The toppings are entirely up to you.',
  headnoteInstructions:
    'Keep the soak short and the pan at medium-low. Each side takes 3 to 4 minutes, and if the butter browns before the toast does, the pan is too hot. Cook in two batches of three, wiping the pan in between.',

  tips: [
    'If the butter starts to brown before the toast has coloured, the pan is too hot. Lift it off the heat for half a minute, turn it down, and carry on.',
    'Treat the first batch as your test. Cut into one slice: if the middle is still wet, soak the next batch a few seconds less, or cook it a minute longer on slightly lower heat.',
    'Never press the slices down in the pan. It squeezes the egg out and leaves the toast flat and dense.',
    'To serve everyone at once, keep the first batch warm on a rack in a 120°C (100°C fan) oven. On a stacked plate the crust steams and goes soft.',
  ],

  notes: [
    'Bread: brioche, challah or a thick white loaf, cut from an unsliced loaf. Day-old is best; if yours is very fresh and soft, leave the slices out on a rack for an hour first. With packaged brioche, check the label.',
    'Milk: for a richer middle, swap 100ml of the milk for double cream. For dairy-free, use oat milk and fry in oil.',
    'Vanilla: check the label on your vanilla extract.',
  ],

  variations: [
    'Stuffed. Cut the brioche into 3 slices 4cm thick instead of 6. Cut a deep pocket into each from one side, without cutting through, and fill it with a tablespoon of chocolate hazelnut spread, or cream cheese and a teaspoon of jam. Press the opening closed, soak for 20 seconds a side and fry on the low side of medium-low for 4 to 5 minutes a side, so the filling warms through.',
    'Crunchy cornflake coat. Crush 60g of cornflakes in a freezer bag into coarse crumbs and tip them onto a plate. Soak the bread for only 10 seconds a side, press each side firmly into the cornflakes, then fry on the low side of medium-low for 2 to 3 minutes a side, since the coating browns faster.',
    'Hong Kong French toast. Spread 1 tablespoon of smooth peanut butter between two slices of soft white sandwich bread, trim off the crusts and press the edges together. Dip it in 1 egg beaten with a pinch of salt. Heat 2cm of oil in a small frying pan to 140°C (a cube of bread sizzles gently), fry for 2 minutes a side, spooning oil over the top, until puffed and golden. Serve with a knob of butter and a drizzle of condensed milk or golden syrup.',
    'Savoury eggy bread. Leave the sugar, vanilla and cinnamon out of the egg mix and season it with black pepper and a pinch of chili flakes. As the second side cooks, scatter about 20g of grated cheddar (check the label for animal rennet) over each slice and cover the pan for the last 2 minutes so it melts. Serve with harissa, fresh green chili and plenty of coriander.',
  ],

  storage:
    'Best straight from the pan. Leftover slices keep in the fridge, covered, for up to 2 days, or freeze them between sheets of baking paper for up to 1 month. Reheat in a 180°C (160°C fan) oven for 8 to 10 minutes, or in an air fryer at 180°C for 4 to 5 minutes, until crisp and hot through.',

  dropcap: true,

  image: 'https://images.unsplash.com/photo-1620921575116-fb8902865f81?w=1200&q=80',
  imageIsStock: true,
};

export default recipe;
