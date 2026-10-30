// data/recipes/chicken-gyros.ts
import type { RecipeInput } from './_types';

const recipe: RecipeInput = {
  title: 'Chicken Gyros',
  country: 'Greece',
  featuredIngredients: ['chicken', 'yoghurt'],
  category: 'main',
  difficulty: 'Easy',
  servings: 4,
  time: { active: 35, total: 75, resting: 30 },
  yield: 'Makes 4 wraps, dinner for two',
  tags: ['high-protein', 'comfort food'],

  region: 'Eastern Europe',
  coordinates: { lat: 37.9838, lng: 23.7275 },

  ingredients: [
    {
      heading: 'The chicken and its marinade',
      items: [
        { name: 'boneless, skinless chicken thigh fillets', amount: 600, unit: 'g', note: 1 },
        { name: 'full-fat Greek yogurt', amount: 3, unit: 'tbsp', note: 4 },
        { name: 'lemon juice', amount: 2, unit: 'tbsp' },
        { name: 'cider vinegar (optional)', amount: 1, unit: 'tbsp', note: 5 },
        { name: 'olive oil, plus a little for the pan', amount: 1, unit: 'tbsp' },
        { name: 'garlic cloves, finely grated', amount: 3, unit: '' },
        { name: 'fine salt', amount: 1, unit: 'tsp' },
        { name: 'black pepper, a few good grinds', amount: 0, unit: '' },
      ],
    },
    {
      heading: 'The spice mix, or one gyros seasoning packet',
      items: [
        { name: 'dried oregano', amount: 1.5, unit: 'tbsp' },
        { name: 'sweet paprika', amount: 2, unit: 'tsp' },
        { name: 'garlic powder', amount: 1, unit: 'tsp' },
        { name: 'onion powder', amount: 1, unit: 'tsp' },
        { name: 'ground cumin', amount: 1, unit: 'tsp' },
        { name: 'ground coriander', amount: 1, unit: 'tsp' },
        { name: 'dried thyme', amount: 0.5, unit: 'tsp' },
        { name: 'ground fenugreek (optional)', amount: 0.25, unit: 'tsp' },
        { name: 'ground cinnamon', amount: 0.25, unit: 'tsp' },
        { name: 'harissa powder (optional)', amount: 1, unit: 'tsp', note: 3 },
        { name: 'or: one 20g gyros seasoning packet instead of all of the above', amount: 0, unit: '', note: 2 },
      ],
    },
    {
      heading: 'Chips (highly recommended)',
      items: [
        { name: 'frozen chips', amount: 400, unit: 'g', note: 8 },
      ],
    },
    {
      heading: 'Sumac salad',
      items: [
        { name: 'tomatoes, diced', amount: 2, unit: '' },
        { name: 'cucumber, diced', amount: 0.5, unit: '' },
        { name: 'small red onion, finely sliced', amount: 1, unit: '' },
        { name: 'fresh coriander, a large handful, chopped', amount: 0, unit: '' },
        { name: 'sumac', amount: 1, unit: 'tsp' },
        { name: 'olive oil, a drizzle', amount: 0, unit: '' },
        { name: 'lemon, a squeeze', amount: 0, unit: '' },
        { name: 'salt and black pepper', amount: 0, unit: '' },
      ],
    },
    {
      heading: 'To build',
      items: [
        { name: 'pitas or flatbreads', amount: 4, unit: '', note: 6 },
        { name: 'shop-bought tzatziki', amount: 200, unit: 'g', note: 7 },
        { name: 'chili flakes, to finish (optional)', amount: 0, unit: '' },
      ],
    },
  ],

  steps: [
    {
      heading: 'Marinate',
      items: [
        'Stir the yogurt, lemon juice, vinegar, olive oil, grated garlic, salt, pepper and all the spices together in a bowl. If you are using a seasoning packet, stir in just half of it and keep the other half for the pan (see note 2).',
        'Add the thigh fillets whole and turn them until every one is coated. Cover and put in the fridge for at least 30 minutes. A morning is even better.',
      ],
    },
    {
      heading: 'Salad and chips',
      items: [
        'Toss the tomatoes, cucumber, red onion and coriander with the sumac, a pinch of salt, some black pepper, a drizzle of olive oil and a squeeze of lemon. Leave it to sit while everything else cooks, so the onion softens and the juices gather.',
        'Put the chips in the air fryer at 200°C in a single layer for 15 to 20 minutes, shaking the basket every 5 minutes. Start them now and they will be ready just as the chicken comes out of the pan.',
      ],
    },
    {
      heading: 'Sear',
      items: [
        'Heat a large stainless or cast-iron frying pan over medium-high heat with a little oil until it shimmers.',
        'Lift each fillet out of the marinade and scrape off the excess with the back of a knife, especially any bits of fresh garlic, which burn in a hot pan and turn bitter. Lay the fillets in flat, in two batches if they would crowd the pan.',
        'Cook for 5 to 6 minutes a side without moving them, until deep golden with dark edges and cooked through. Cut into the thickest fillet: it should be steaming hot all the way through with no pink, or 75°C on a probe thermometer.',
      ],
    },
    {
      heading: 'Rest, slice, back in the pan',
      items: [
        'Rest the fillets on a board, loosely covered with foil, for 5 minutes. Meanwhile give the chips 2 more minutes in the air fryer if they have cooled, then warm the pitas for 30 seconds in the air fryer or a dry pan.',
        'Slice the chicken into thin strips. Put the pan back on high heat, tip in the strips with any juices from the board, and toss for 1 minute so the edges crisp. If you used a seasoning packet, scatter the other half over the chicken now as you toss it.',
      ],
    },
    {
      heading: 'Build',
      items: [
        'Spread tzatziki down each warm pita, then add salad, chicken and a few chips. Finish with more tzatziki and chili flakes if you like the heat. Roll each one tightly in a square of baking paper or foil, the way the gyros shops do, and eat straight away.',
      ],
    },
  ],

  nutrition: { calories: 550, protein: 37, carbs: 38, fat: 27 },
  flavorProfile: { sweet: 1, salty: 3, sour: 3, bitter: 1, umami: 3, spicy: 1 },

  isVegetarian: false,
  isVegan: false,
  isGlutenFree: false,
  isDairyFree: false,

  quote:
    'Lemony, oregano-heavy chicken thighs seared to a dark crust, sliced thin and rolled into warm pitas with tzatziki, sumac salad and a few chips tucked inside, the way the gyros shops in Athens do it.',
  description:
    'This is the gyros you buy from a Greek takeaway, made in a frying pan. Thigh fillets marinate in yogurt, lemon and a big handful of oregano, then sear whole until the outside is dark and crusted while the inside stays juicy. Sliced thin and tossed back into the hot pan for a minute, the strips get the crisp edges a spit gives them. Chips go inside the wrap, as they do in Greece, alongside shop-bought tzatziki and a sharp salad of tomato, cucumber and red onion with sumac and coriander. Everything is ready in about 45 minutes once the chicken has marinated.',
  attribution: "A Nieves's Kitchen take on RecipeTin Eats' Greek chicken gyros",

  headnoteIngredients:
    'Use thigh rather than breast: it stays juicy through a hard sear and forgives a minute too long in the pan. The spice list is a gyros seasoning packet written out, with cinnamon and thyme added, plus a pinch of fenugreek if you have it, for the warm, savoury note that makes it taste like the takeaway. A packet is a perfectly good shortcut. Do not skip the chips. Tucked into the wrap they are half the point.',
  headnoteInstructions:
    'Marinate first, then make the salad and start the chips before the chicken goes in the pan, so everything lands at the same time. The two things that make it are a properly hot pan and scraping the marinade off before searing: wet marinade steams instead of browning, and fresh garlic burns.',

  tips: [
    'Scrape, then sear. Too much marinade in the pan steams the chicken instead of browning it, and bits of garlic or cucumber burn black long before the chicken is done.',
    'Leave the fillets alone for the full 5 minutes. They release from the pan on their own once the crust has formed.',
    'If one fillet is much thicker than the rest, open it out flat with a cut along its thickest side, so they all cook in the same time.',
    'Colour is not proof the chicken is cooked. Check the thickest piece: steaming hot all the way through with no pink, or 75°C on a probe. That is the Food Standards Agency guidance.',
    'The final minute back in the pan is what makes it taste like gyros rather than sliced grilled chicken. It catches the resting juices and crisps the edges.',
  ],

  notes: [
    'Chicken: thigh fillets from a halal butcher. Breast works, but cut 1 minute off each side and expect it to be drier.',
    'Seasoning packet: Schwartz The Real Greek Chicken Gyros Wrap Recipe Mix (20g) is a good one and replaces the whole spice list. Stir half of it into the marinade with the yogurt and keep the other half to scatter over the sliced chicken in the pan. Its ingredients are spices, herbs, rice flour, dried pepper, citric acid and a natural flavouring, and there is no halal mark on the packet, so check the label yourself.',
    'Harissa powder: optional, for a gentle warmth. A pinch of chili flakes does the same job.',
    'No yogurt? Use 2 tablespoons of the tzatziki instead. Spoon it into the marinade bowl before the tub goes anywhere near raw chicken, and pick out the cucumber pieces, since they burn in the pan. Scrape any that cling off the chicken, along with the garlic, before it goes in.',
    'Vinegar: optional. It sharpens the marinade, but another tablespoon of lemon juice, or nothing at all, is fine.',
    'Pitas: most shop pitas are just flour, water, yeast and oil, but check the label.',
    'Tzatziki: Sainsbury\'s own works well. Check the label, as with any shop-bought sauce.',
    'Chips: most frozen chips are just potato and vegetable oil, but some coated ones contain flavourings, so check the label. They are not included in the nutrition, which is for one wrap.',
  ],

  variations: [
    'As a plate: serve the chicken over the chips with the salad, tzatziki and a warm pita on the side, the way Greek tavernas do a gyros merida.',
    'Lamb: use boneless lamb shoulder steaks, sliced thin after searing.',
  ],

  storage:
    'The cooked chicken keeps in a sealed container in the fridge for up to 3 days. Reheat it in a hot dry pan for 2 to 3 minutes until steaming hot all the way through. The salad is best on the day, since the cucumber goes watery.',

  dropcap: true,

  image: '/recipes/chicken-gyros-hero.webp',
  imageIsStock: false,
  images: [
    {
      url: '/recipes/chicken-gyros-seared.webp',
      caption: 'Thigh fillets seared whole until the crust goes deep and dark',
      width: 1122,
      height: 1402,
    },
    {
      url: '/recipes/chicken-gyros-sliced.webp',
      caption: 'Sliced thin and tossed back in the hot pan to crisp the edges',
      width: 1122,
      height: 1402,
    },
    {
      url: '/recipes/chicken-gyros-salad.webp',
      caption: 'The sumac salad: tomato, cucumber, red onion and coriander',
      width: 880,
      height: 1100,
    },
  ],
};

export default recipe;
