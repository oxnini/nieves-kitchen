// data/recipes/gochujang-fried-chicken.ts
import type { RecipeInput } from './_types';

const recipe: RecipeInput = {
  title: 'Gochujang Double-Fried Chicken',
  country: 'South Korea',
  category: 'main',
  difficulty: 'Medium',
  servings: 2,
  time: { active: 40, total: 50 },
  yield: 'Serves 2 as a main, or 3 to 4 as part of a Korean spread',
  tags: ['high-protein', 'spicy', 'comfort food'],

  region: 'East Asia',
  coordinates: { lat: 37.5665, lng: 126.978 },
  featuredIngredients: ['chicken', 'garlic', 'honey'],

  ingredients: [
    {
      heading: 'Chicken and coating',
      items: [
        { name: 'chicken breast, cut into 1-inch chunks', amount: 450, unit: 'g' },
        { name: 'salt', amount: 0.5, unit: 'tsp' },
        { name: 'black pepper', amount: 0.25, unit: 'tsp' },
        { name: 'large egg', amount: 1, unit: '' },
        { name: 'cornstarch', amount: 2, unit: 'tbsp' },
        { name: 'potato starch (or more cornstarch)', amount: 2, unit: 'tbsp' },
        { name: 'baking powder', amount: 0.5, unit: 'tsp' },
        { name: 'neutral oil, for shallow frying (about 1/3 cup)', amount: 80, unit: 'ml' },
      ],
    },
    {
      heading: 'Gochujang ginger glaze',
      items: [
        { name: 'neutral oil', amount: 1, unit: 'tsp' },
        { name: 'garlic cloves, minced', amount: 3, unit: '' },
        { name: 'fresh ginger, grated', amount: 1, unit: 'tsp' },
        { name: 'gochujang (halal-certified)', amount: 2, unit: 'tbsp' },
        { name: 'gochugaru (Korean chili flakes)', amount: 1, unit: 'tbsp' },
        { name: 'honey', amount: 1, unit: 'tbsp' },
        { name: 'rice syrup or corn syrup', amount: 1, unit: 'tbsp' },
        { name: 'soy sauce (halal-certified)', amount: 1, unit: 'tbsp' },
        { name: 'dark soy sauce, for colour (optional)', amount: 1, unit: 'tsp' },
        { name: 'rice vinegar', amount: 1, unit: 'tbsp' },
        { name: 'toasted sesame oil', amount: 1, unit: 'tsp' },
        { name: 'water', amount: 1, unit: 'tbsp' },
      ],
    },
    {
      heading: 'To finish',
      items: [
        { name: 'toasted sesame seeds', amount: 0, unit: '' },
        { name: 'spring onions, thinly sliced', amount: 2, unit: '' },
      ],
    },
  ],

  steps: [
    {
      heading: 'Season and coat the chicken',
      items: [
        'Cut the chicken breast into even, bite-sized chunks, roughly 1 inch, so they cook through at the same rate. Toss with the salt and black pepper.',
        'In a bowl, whisk the egg. Add the cornstarch, potato starch, and baking powder and mix into a thick, shaggy coating that clings to the whisk.',
        'Add the chicken and turn it until every piece is coated. Lift each piece out and shake off the excess so you get a thin, even shell rather than heavy clumps.',
      ],
    },
    {
      heading: 'First fry and rest',
      items: [
        'Heat the oil in a wide pan over medium-high heat. To check it is ready, drop in a little of the batter: it should sizzle up straight away with a lively crackle. If it sinks and sits quietly, give it another minute.',
        'Fry the chicken in two batches so you never crowd the pan. Cook, turning, until each piece is pale gold and just cooked through, a few minutes. Do not overcook it here, it finishes on the second fry and breast dries out fast.',
        'Lift the chicken onto a wire rack to rest for a few minutes while the oil comes back up to temperature.',
      ],
    },
    {
      heading: 'The gochujang ginger glaze',
      items: [
        'While the chicken rests, warm the teaspoon of oil in a separate pan over low heat. Add the minced garlic and grated ginger and cook gently until fragrant, about a minute, without letting them colour.',
        'Add the gochujang and gochugaru and fry for 30 to 60 seconds, stirring, until the paste darkens a shade and smells toasty rather than raw.',
        'Stir in the honey, syrup, soy sauce, dark soy if using, rice vinegar, sesame oil, and water. Let it bubble gently, stirring, until glossy and slightly thickened. Turn off the heat and leave it in the pan.',
      ],
    },
    {
      heading: 'Second fry, glaze, and serve',
      items: [
        'Bring the oil back up, a touch hotter than the first fry, then fry all the chicken again, about a minute to a minute and a half per side, until deep golden and crisp. Drain on the rack.',
        'Working quickly while everything is hot, tip the chicken into the glaze and toss just until every piece is coated, only a few seconds. Sit it in the sauce any longer and the crust turns soggy.',
        'Scatter over the sesame seeds and spring onions and serve right away, while the crust still shatters.',
      ],
    },
  ],

  nutrition: { calories: 540, protein: 48, carbs: 32, fat: 24 },
  flavorProfile: { sweet: 3, salty: 3, sour: 2, bitter: 0, umami: 3, spicy: 3 },

  isVegetarian: false,
  isVegan: false,
  isGlutenFree: false,
  isDairyFree: true,

  quote:
    'Double-fried until it shatters, then tossed fast in a glossy gochujang glaze so it never has a chance to lose its crunch.',
  description:
    'This is my take on Korean fried chicken, the yangnyeom kind lacquered in a sweet, spicy gochujang glaze. The crust is the whole point, so it leans on two things: a light potato-starch coating with a little baking powder for lift, and a double fry that sets it crisp enough to stand up to the sauce. I fry the gochujang with garlic and ginger before it ever meets the glaze, which cooks out the raw edge and gives the whole thing more depth than a straight stir-together sauce. Toss it quick, eat it quicker.',
  attribution: 'A Nieves\'s Kitchen original',

  headnoteIngredients:
    'Use a halal-certified gochujang and soy sauce. Potato starch is what gives the shell its glassy, long-lasting crunch under the glaze, but an all-cornstarch coating still works well. Rice or corn syrup gives the glossiest lacquer; all honey is fine too.',
  headnoteInstructions:
    'Everything lands fast at the end, so have the glaze made and your garnish sliced before the second fry. The toss takes seconds, then you eat.',

  equipment: [
    'A wire rack set over a tray, for resting the chicken between and after frying (a paper-towel-lined plate works, but a rack keeps the bottoms from going soft)',
    'A cooking thermometer if you have one, to hold the oil steady, though the batter-drop test in the steps works fine without one',
  ],

  tips: [
    'Fresh ginger, grated, tastes far better here than powdered or the jarred kind. It is worth the small effort.',
    'Potato starch, or a 50/50 mix with cornstarch, fries lighter and stays crisp longer than flour or cornstarch alone. The pinch of baking powder lifts the crust and helps it brown.',
    'Get the oil properly hot before each fry. Drop in a little batter: a lively, immediate crackle means it is ready.',
    'Do not crowd the pan. Frying in two batches keeps the oil hot so the chicken crisps instead of steaming.',
    'The second fry is the one that makes it shatter. Let the oil come back a touch hotter than the first fry and give each piece just a minute or so until deep gold.',
    'Toss the chicken in the glaze for only a few seconds while it is still hot. Left to sit in the sauce, even the best crust goes soft, and crisp is the whole point.',
    'Go easy on the first fry so the breast does not overcook. It finishes on the second one, and dry chicken is the main risk with breast.',
  ],

  substitutions: [
    'A halal-certified gochujang and soy sauce keep the dish halal. Tamari stands in for soy sauce and skips the wheat.',
    'No potato starch? An all-cornstarch coating still gives a good, light crunch.',
    'All honey works in place of the honey and syrup blend, you just lose a little of the lacquered shine.',
    'Chicken thigh in place of breast is more forgiving and juicier, just fry it a little longer.',
    'Rice vinegar can be swapped for apple cider vinegar.',
  ],

  variations: [
    'Pile a quick pa-muchim over the top: toss thinly sliced spring onion with a pinch of gochugaru, a little sesame oil, sesame seeds, and a splash of rice vinegar. It is the classic Korean fried-chicken pairing, and I like stirring a handful of sliced spring onion whites straight into the glaze too.',
    'Serve it banban, half and half: toss only half the chicken in glaze and leave the rest bare, so some pieces stay at their absolute crispest.',
    'For extra gloss and richness, swirl a small knob of butter into the finished glaze off the heat. This makes it no longer dairy-free.',
    'Scatter crushed roasted peanuts over the top for a dakgangjeong-style crunch.',
  ],

  storage:
    'This is really a right-away dish, best within minutes of tossing while the crust still shatters. If you do have leftovers, keep the chicken and glaze separate in the fridge for up to 2 days, then re-crisp the chicken in a hot oven or air fryer before tossing it in warmed glaze. Chicken that has already sat in sauce will not crisp back up.',

  dropcap: true,

  image: 'https://images.unsplash.com/photo-1575932444877-5106bee2a599?w=1200&q=80',
  imageIsStock: true,
};

export default recipe;
