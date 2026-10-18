// data/recipes/golden-tofu-soba-bowl.ts
import type { RecipeInput } from './_types';

const recipe: RecipeInput = {
  title: 'Golden Tofu and Soba Bowl',
  country: 'Japan',
  category: 'main',
  difficulty: 'Easy',
  servings: 2,
  time: { active: 25, total: 30 },
  yield: '2 bowls',
  tags: ['vegetarian', 'high-protein', 'quick', 'fusion'],

  // Nagano, home of Shinshu soba.
  region: 'East Asia',
  coordinates: { lat: 36.65, lng: 138.18 },

  isFusion: true,
  inspiredBy: ['China'],
  influences: ['Japan', 'China'],

  ingredients: [
    {
      heading: 'The tofu',
      items: [
        { name: 'small block of firm tofu', amount: 280, unit: 'g' },
        { name: 'light soy sauce', amount: 0.5, unit: 'tbsp' },
        { name: 'sweet potato starch (or potato starch, or cornflour)', amount: 1, unit: 'tbsp' },
        { name: 'salt', amount: 0, unit: '' },
        { name: 'a light spray of oil, optional', amount: 0, unit: '' },
      ],
    },
    {
      heading: 'The soba dressing',
      items: [
        { name: 'fresh ginger, finely grated', amount: 1, unit: 'tsp' },
        { name: 'garlic, finely grated', amount: 1, unit: 'tsp' },
        { name: 'Chinese rice vinegar', amount: 1, unit: 'tbsp' },
        { name: 'honey (or sugar, stirred until dissolved)', amount: 1.5, unit: 'tsp' },
        { name: 'light soy sauce', amount: 1, unit: 'tbsp' },
        { name: 'toasted sesame oil', amount: 1, unit: 'tsp' },
        { name: 'chili oil', amount: 1, unit: 'tsp' },
        { name: 'a big handful of coriander, chopped', amount: 0, unit: '' },
        { name: 'spring onions, finely sliced', amount: 2, unit: '' },
      ],
    },
    {
      heading: 'The bowl',
      items: [
        { name: 'dried soba noodles (70g each)', amount: 140, unit: 'g' },
        { name: 'eggs, at fridge temperature', amount: 2, unit: '' },
        { name: 'mangetout (snow peas)', amount: 150, unit: 'g' },
        { name: 'shelled edamame, optional but very good', amount: 100, unit: 'g' },
        { name: 'small avocado (or half a large one), diced', amount: 1, unit: '' },
        { name: 'lime, cut into wedges', amount: 1, unit: '' },
        { name: 'toasted sesame seeds', amount: 2, unit: 'tsp' },
      ],
    },
  ],

  steps: [
    {
      heading: 'Before you start',
      items: [
        'Tofu can be quite watery. Wrap the block in a clean tea towel or a few sheets of kitchen paper and press down on it firmly for a moment to squeeze out what you can. No need to weigh it down for ages. The drier the tofu, the crisper it gets.',
        'Fill a bowl with cold water and plenty of ice and set it by the hob. The egg, the mangetout and the noodles all go into it in turn.',
        'Make the dressing in the bowl you will toss the noodles in: stir the ginger, garlic, rice vinegar, honey, soy sauce, sesame oil and chili oil together until the honey dissolves. Stir in most of the coriander and spring onions, keeping a little of each back for the top.',
      ],
    },
    {
      heading: 'The golden tofu',
      items: [
        'Cut the tofu into bite-sized cubes of about 2cm. Cutting releases a little more water, so pat the cubes dry with kitchen paper. Toss them with the soy sauce and a pinch of salt until every side is coated, then sprinkle over the sweet potato starch and toss again, gently, until no dry patches are left.',
        'Spread the cubes in the air fryer basket in a single layer with a little space between them, and give them a light spray of oil if you like. Air fry at 200°C for 12 to 15 minutes, shaking the basket halfway, until golden and crisp on every side. Get the pot of water on while they cook.',
      ],
    },
    {
      heading: 'One pot, three things',
      items: [
        'Bring a pan of water to the boil. Lower in the eggs and cook for exactly 6 minutes 30 seconds, then lift them straight into the ice water. That keeps the yolks gooey in the middle.',
        'If using edamame, drop it into the same water for 2 minutes first. Then add the mangetout for 45 seconds more, and lift everything into the ice water with the eggs. The mangetout should still snap.',
        'Add the soba to the same pot and cook for about 4 minutes, or as the packet says, stirring once so it does not stick together. Drain into a sieve and wash them under cold running water, rubbing the noodles between your hands to take off the starch. Then into the ice water with the eggs and mangetout for a moment, and drain well. Rinsed soba stays springy and separate instead of turning gummy.',
      ],
    },
    {
      heading: 'To the bowl',
      items: [
        'Peel and halve the eggs. Tip the well-drained noodles into the dressing and toss until every strand is glossy and flecked with green.',
        'Divide the noodles between two bowls and arrange the tofu, mangetout, avocado and egg halves on top. Finish with the reserved coriander and spring onion, a scatter of sesame seeds and a lime wedge to squeeze over just before you eat.',
      ],
    },
  ],

  nutrition: { calories: 730, protein: 39, carbs: 72, fat: 31 },
  flavorProfile: { sweet: 2, salty: 3, sour: 2, bitter: 0, umami: 4, spicy: 2 },

  isVegetarian: true,
  isVegan: false,
  isGlutenFree: false,
  isDairyFree: true,

  quote:
    'Cold, springy soba tossed in ginger, garlic and chili oil, under golden tofu, a jammy egg and the crunch of barely blanched mangetout.',
  description:
    'This is the bowl I make when I want something fresh that still feels like a proper meal. Soba is Japanese through and through, cooked for a few minutes and then washed in ice water until it turns springy, but the dressing leans towards China: rice vinegar, chili oil, a little toasted sesame oil and a lot of fresh ginger and garlic, with handfuls of coriander and spring onion stirred straight in. The tofu gets a coat of sweet potato starch before it goes into the air fryer, which turns it crisp and golden with almost no oil. Everything else is about timing. The egg gets exactly six and a half minutes so the yolk stays soft, and the mangetout gets forty-five seconds so it still snaps when you bite it.',
  attribution: 'A Nieves\'s Kitchen original',

  headnoteIngredients:
    'Sweet potato starch is what makes the tofu shatter, and you will find it in most Asian supermarkets, though potato starch or cornflour also work. Most soba is part buckwheat and part wheat, so check the packet if that matters to you.',
  headnoteInstructions:
    'Start the tofu first. While it is in the air fryer, one pot of boiling water does the egg, the mangetout and the noodles one after another, and it all goes into the same bowl of ice water.',

  equipment: [
    'An air fryer for the tofu. An oven at 220°C (200°C fan) works too: spread the cubes on a lined tray and give them 25 to 30 minutes, turning once.',
  ],

  tips: [
    'Toss the tofu in the soy sauce first and the starch second. The soy gives the starch something to cling to, and you get an even, crackly coat rather than powdery patches.',
    'Do not crowd the basket. Tofu that touches steams instead of crisping, so cook it in two batches if your air fryer is small.',
    'Wash the soba, do not just cool it. Rubbing the noodles under cold water takes off the surface starch, and that is what keeps them from clumping into one cold lump.',
    'Leave the salt out of the noodle water. The dressing and the tofu bring plenty, and some soba is already salted.',
    'Dress the noodles just before you eat. Soba drinks up its dressing, so if it sits for long the bowl turns dry.',
    'Soy sauce is the one thing to check: traditionally brewed soy sauces carry a trace of fermentation alcohol, so reach for a halal-certified soy sauce to keep the dish fully halal. Many supermarket brands are certified.',
  ],

  substitutions: [
    'Lemon instead of lime is completely fine. It is a little softer and just as good.',
    'Sugar works in place of honey, as long as you stir until it dissolves. With sugar and no egg, the bowl is vegan.',
    'Tamari works anywhere the recipe says soy sauce, if you have no soy sauce in or you are cooking gluten-free. For a fully gluten-free bowl, pair it with 100% buckwheat soba (sometimes sold as juwari). The starch is already gluten-free.',
    'Sugar snap peas or green beans can stand in for mangetout. Give green beans about 2 minutes in the water.',
    'No Chinese rice vinegar? Any rice vinegar works, or a squeeze more lime.',
  ],

  variations: [
    'Add edamame. A handful blanched in the same pot as the mangetout makes the bowl even greener and adds a good few grams of protein.',
    'For more heat, spoon some of the chili oil sediment over the eggs, the way it is in the photo.',
  ],

  storage:
    'Best eaten straight away, while the tofu is crisp. For lunch the next day, keep the dressed noodles, the tofu and the vegetables apart in the fridge, cut the avocado fresh, and crisp the tofu again in the air fryer for 3 to 4 minutes.',

  dropcap: true,

  image: '/recipes/golden-tofu-soba-bowl-hero.webp',
  imageIsStock: false,
};

export default recipe;
