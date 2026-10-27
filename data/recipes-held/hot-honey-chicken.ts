// data/recipes-held/hot-honey-chicken.ts
import type { RecipeInput } from '../recipes/_types';

const recipe: RecipeInput = {
  title: 'Hot Honey Chicken',
  country: 'United States of America',
  featuredIngredients: ['chicken', 'honey'],
  category: 'main',
  difficulty: 'Medium',
  servings: 4,
  time: { active: 60, total: 310 },
  yield: 'Serves 4, two or three crisp thighs each',
  tags: ['high-protein', 'spicy', 'comfort food', 'treat'],

  region: 'North America',
  coordinates: { lat: 36.1627, lng: -86.7816 },
  influences: ['United States of America'],

  ingredients: [
    {
      heading: 'The buttermilk brine',
      items: [
        { name: 'boneless, skinless chicken thighs', amount: 800, unit: 'g' },
        { name: 'buttermilk', amount: 250, unit: 'ml' },
        { name: 'fine salt', amount: 1.5, unit: 'tsp' },
        { name: 'paprika', amount: 1, unit: 'tsp' },
        { name: 'garlic powder', amount: 1, unit: 'tsp' },
        { name: 'thin, vinegary hot sauce, such as a cayenne pepper sauce', amount: 1, unit: 'tbsp' },
      ],
    },
    {
      heading: 'The coating',
      items: [
        { name: 'plain flour', amount: 150, unit: 'g' },
        { name: 'cornflour', amount: 50, unit: 'g' },
        { name: 'baking powder', amount: 1, unit: 'tsp' },
        { name: 'fine salt', amount: 1, unit: 'tsp' },
        { name: 'paprika, sweet or smoked', amount: 2, unit: 'tsp' },
        { name: 'garlic powder', amount: 1, unit: 'tsp' },
        { name: 'onion powder', amount: 1, unit: 'tsp' },
        { name: 'black pepper, freshly ground', amount: 1, unit: 'tsp' },
        { name: 'cayenne pepper', amount: 0.5, unit: 'tsp' },
      ],
    },
    {
      heading: 'To fry',
      items: [
        { name: 'neutral oil with a high smoke point, such as groundnut or sunflower', amount: 1.5, unit: 'l' },
        { name: 'or, for the air fryer: oil spray, for the basket and the coating', amount: 0, unit: '' },
      ],
    },
    {
      heading: 'The hot honey',
      items: [
        { name: 'runny honey', amount: 120, unit: 'g' },
        { name: 'chili flakes (1 tsp for gentle, 2 tsp for fierce)', amount: 1.5, unit: 'tsp' },
        { name: 'thin, vinegary hot sauce, such as a cayenne pepper sauce', amount: 1, unit: 'tbsp' },
        { name: 'cider vinegar', amount: 1, unit: 'tsp' },
        { name: 'cold unsalted butter, cut into small cubes', amount: 20, unit: 'g' },
        { name: 'salt, a pinch', amount: 0, unit: '' },
      ],
    },
    {
      heading: 'To serve',
      items: [
        { name: 'flaky sea salt', amount: 0, unit: '' },
        { name: 'fresh green chili, thinly sliced (optional)', amount: 0, unit: '' },
        { name: 'coleslaw and dill pickles (optional)', amount: 0, unit: '' },
      ],
    },
  ],

  steps: [
    {
      heading: 'Brine, at least 4 hours ahead',
      items: [
        'Whisk the buttermilk, the 1½ teaspoons of salt, the paprika, garlic powder and hot sauce together in a bowl or a large food bag.',
        'Trim off any large lumps of fat from the thighs. If one is much bigger than the rest, cut it in half, so every piece is roughly the same size and they all cook in the same time. Turn them in the buttermilk until coated, cover, and refrigerate for at least 4 hours, or overnight, but no longer than 24 hours. The salt seasons the meat right through and the buttermilk keeps it juicy.',
      ],
    },
    {
      heading: 'Start the hot honey, then coat the chicken',
      items: [
        'About an hour before you want to eat, take the chicken out of the fridge. Put the honey and chili flakes in a small saucepan over low heat for 2 to 3 minutes, stirring, until the honey runs like water and tiny bubbles just appear at the edge. Do not let it boil: boiled honey turns bitter and sets stiff as it cools. Take it off the heat and leave it to steep while you cook.',
        'The steeping time sets the heat. Taste a little on a cooled spoon between batches of chicken: about 15 minutes gives a gentle warmth, 30 minutes a proper kick, and an hour is fierce. When it is as hot as you like it, pour it through a small sieve into a bowl to stop it getting hotter, then pour it back into the pan.',
        'Heat the oven to 150°C (130°C fan) for keeping the chicken warm, and set a wire rack over a baking tray ready for the fried pieces.',
        'In a wide dish, whisk together the flour, cornflour, baking powder, the teaspoon of salt, the paprika, garlic powder, onion powder, black pepper and cayenne. Drizzle 3 tablespoons of the buttermilk from the chicken over the flour and rub it in with your fingertips until the flour is full of small clumps, like coarse breadcrumbs. Those clumps are what fry into a craggy crust.',
        'Lift out one thigh at a time, let the excess buttermilk drip off for a few seconds, then lay it in the flour. Pile flour and clumps on top and press down firmly with your palm, turn it over and press again, so the clumps stick. Shake off the loose flour and set the thigh on a plate or tray, not touching the others, or the coatings stick together and tear when you pull them apart. Coat the rest the same way, then leave them for 10 to 15 minutes, until the coating looks damp in patches rather than dry and powdery. This short rest is what glues the coating on, so it does not fall off in the oil.',
      ],
    },
    {
      heading: 'Fry',
      items: [
        'While the chicken rests, pour the oil into a large, heavy, deep pot, such as a casserole dish, so it is about 3cm deep and fills no more than a third of the pot: it bubbles up when the chicken goes in. Heat it over medium heat to 180°C, which takes 10 to 15 minutes. With no thermometer, drop in a pinch of the floury clumps: at the right heat they sizzle hard straight away and float. If they sink and sit quietly, wait. If the oil ever smokes, turn off the heat and let it cool down. Keep a lid or a baking tray beside the hob: if the oil ever catches fire, turn off the heat and slide it over the pot, and never use water. Never leave hot oil on the hob unattended.',
        'Lower 3 or 4 thighs into the oil one at a time, laying each one away from you so the oil does not splash towards you. The oil temperature will drop to about 160°C: adjust the heat to keep it between 160°C and 170°C. Leave them alone for 3 minutes, until the underside is set and golden, then turn them with tongs. Fry for 7 to 9 minutes in total, turning once or twice more, until deep golden brown all over and at least 74°C in the thickest part. Thighs stay juicy well past that, so a few degrees more does no harm.',
        'Lift them onto the wire rack, sprinkle with a pinch of flaky salt straight away, and put the tray in the oven to keep warm. If a thick piece is deep brown before it reaches 74°C, leave it on the rack in the oven for 5 minutes and check again. Let the oil come back up to 180°C, then fry the rest the same way.',
      ],
    },
    {
      heading: 'Or cook them in the air fryer',
      items: [
        'Air fryer instead? Coat and rest the chicken exactly as above, and skip the pot of oil. Heat the air fryer to 200°C for 3 to 5 minutes. Spray the basket with oil and lay in 3 or 4 thighs in a single layer, not touching. Spray every bit of the coating with oil until there are no dry white patches left, because any dry flour stays pale and powdery. Cook for 10 minutes, turn them, spray any pale patches again, then cook for 8 to 10 minutes more, until deep golden and crisp and 74°C in the thickest part. Sprinkle with flaky salt and keep each batch warm on the rack in the oven while you cook the rest. The crust is a shade less craggy than fried, but properly crisp.',
      ],
    },
    {
      heading: 'Finish the honey and serve',
      items: [
        'When the last batch is nearly done, set the strained honey over low heat for about a minute, just until it is warm and runny again. It should feel warm, not hot, and should not bubble. Take it off the heat and whisk in the cider vinegar, hot sauce and a pinch of salt.',
        'Now whisk in the cold butter a few cubes at a time, letting each lot melt in before adding the next, until the honey turns glossy and a little thicker and coats the back of a spoon. If the butter melts into a greasy layer on top instead, the honey was too hot: let it cool for a minute and keep whisking.',
        'Pile the chicken on a board or platter with the crust facing up. Just before it goes to the table, spoon about two thirds of the hot honey over the tops, so it runs into the cracks rather than pooling underneath. Scatter over a little flaky salt and the green chili, if using, and put the rest of the honey in a small jug on the table. Serve straight away, with coleslaw and pickles on the side if you like.',
      ],
    },
  ],

  nutrition: { calories: 650, protein: 39, carbs: 49, fat: 33 },
  flavorProfile: { sweet: 3, salty: 3, sour: 1, bitter: 0, umami: 2, spicy: 3 },

  isVegetarian: false,
  isVegan: false,
  isGlutenFree: false,
  isDairyFree: false,

  quote:
    'Buttermilk-brined thighs fried into a craggy, deep gold crust, with chili-steeped honey spooned over at the very last moment so every crack catches it.',
  description:
    'Hot honey chicken is Southern fried chicken with a sweet, fiery finish: crisp, juicy thighs and honey that has had chili steeped in it. This version is built so the crust is still crunchy when the honey goes on. The thighs sit in seasoned buttermilk for at least four hours, which seasons them all the way through and keeps them juicy. A few spoonfuls of that buttermilk get rubbed into the flour, so the coating fries up shaggy and full of crags, and a little cornflour and baking powder keep it light. The honey is warmed with chili flakes and left to steep, so you decide how hot it gets simply by how long you leave it. Cold butter whisked in at the end turns it glossy enough to cling instead of running off. It goes on at the table, not before. Fry it in a pot of oil, or use the air fryer, which has its own full method alongside.',
  attribution: 'A Nieves\'s Kitchen take on Southern hot honey fried chicken',

  headnoteIngredients:
    'Thighs are the cut to use: they stay juicy through the frying and have far more flavour than breast. Use a thin, vinegary hot sauce in both the brine and the honey. A thick one like sriracha makes the honey too heavy to drizzle. Any ordinary runny honey works, and it is better than an expensive one with a strong flavour of its own. If your honey has crystallised, sit the jar in warm water until it runs clear. No buttermilk? Yogurt thinned with milk does the same job (see the substitutions).',
  headnoteInstructions:
    'Brine the chicken in the morning or the night before. On the day, start the honey first so it steeps while you coat and fry, and taste it between batches. A probe thermometer makes frying close to foolproof, because it tells you the oil temperature and when the chicken is done. Frying three batches takes 30 to 40 minutes. In the air fryer, each batch takes about 20 minutes, so plan for longer and keep the finished pieces warm in the oven.',

  equipment: [
    'A large, heavy, deep pot, such as a casserole dish, for frying. A thick base holds the oil temperature steady. You do not need this if you use the air fryer.',
    'A digital probe thermometer, for the oil and for the chicken. The clump test in the steps works without one, but a thermometer takes the guesswork out of it.',
    'A wire rack set over a baking tray, so the fried chicken drains without its underside going soft. A plate lined with kitchen paper is the second best option.',
  ],

  tips: [
    'Rub a few spoonfuls of the brine into the flour before you dredge. The small clumps it makes are what fry into a craggy, extra-crunchy crust, so press them on firmly.',
    'Do not skip the 10 to 15 minute rest after coating. The flour soaks up moisture from the chicken and sets like a glue, so the coating stays on in the oil instead of coming away in patches.',
    'Keep the oil between 160°C and 170°C once the chicken is in. Hotter, and the crust burns before the inside cooks. Cooler, and the chicken soaks up oil and goes greasy. Fry 3 or 4 pieces at a time and let the oil come back to 180°C before each batch.',
    'Drain the chicken on a rack, not on kitchen paper. On paper, the steam has nowhere to go and the underside goes soft.',
    'Warm the honey gently and never let it boil. Whisk the butter in when the honey is just warm, not hot. Too hot, and the butter melts into a greasy layer instead of thickening it into a glossy glaze.',
    'Gone too hot? Stir a spoonful or two of plain honey into the hot honey and taste again. Too mild? Leave a few flakes steeping longer, or add an extra dash of hot sauce with the vinegar.',
    'The honey goes on at the very last moment, spooned over the tops. Never toss the chicken in it or let it sit. Hot chicken and warm honey stay crunchy for the first 10 minutes or so, and that is when you want to eat it.',
  ],

  substitutions: [
    'No buttermilk? Use 170g plain yogurt thinned with 80ml milk, or stir 1 tablespoon of lemon juice into 250ml milk and leave it for 10 minutes.',
    'Fresh red chilies instead of flakes: slice 2 and steep them in the honey the same way, then lift them out with a fork when the honey is hot enough.',
    'Potato starch can replace the cornflour and gives an even crisper, glassier crust.',
    'For a gluten-free version, use a gluten-free plain flour blend in place of the plain flour and check that your baking powder is gluten-free.',
    'Any neutral oil with a high smoke point works for frying, such as vegetable, rapeseed or sunflower.',
  ],

  variations: [
    'Pickle brine: replace 60ml of the buttermilk with the brine from a jar of dill pickles. It seasons the chicken more deeply and adds a sharp, savoury tang.',
    'Tenders: use 800g chicken breast cut lengthways into strips about 2cm thick, or chicken mini fillets. Brine for 2 to 4 hours, not overnight, since breast turns spongy if brined too long. Fry for 4 to 5 minutes at 160°C to 170°C, until 74°C inside. In the air fryer, give them 12 to 14 minutes at 200°C, turning halfway.',
    'Wings: use 1kg chicken wings, split at the joint. Coat them the same way and fry for 10 to 12 minutes at 160°C to 165°C, a little cooler so the inside cooks before the crust darkens. In the air fryer, give them 22 to 25 minutes at 200°C, turning halfway. Bone-in pieces are done at 74°C, measured near the bone without touching it.',
    'Bone-in, skin-on thighs: use 8 thighs (about 1.2kg) and brine them overnight. Fry 3 at a time at 160°C to 165°C for 12 to 15 minutes, turning every few minutes, until 74°C measured next to the bone without touching it. If the crust is deep brown before then, finish them on the rack in a 190°C (170°C fan) oven for 10 to 15 minutes.',
    'In the oven: spray the coated thighs all over with oil, set them on a wire rack over a tray, and bake at 220°C (200°C fan) for 25 to 30 minutes, turning halfway, until golden and 74°C inside. The crust is less craggy than fried but still crisp.',
    'Hot honey chicken burger: put one fried thigh in a toasted brioche bun with crunchy coleslaw and dill pickles, then spoon over the honey just before you close the bun.',
    'Gochujang hot honey: leave out the hot sauce in the honey and whisk in 1 tablespoon of halal-certified gochujang along with the vinegar, before the butter. Check the label, because several common gochujang brands list alcohol.',
    'Hot honey halloumi, as a side: fry 1cm slices of halloumi in a dry non-stick pan over medium-high heat for 2 minutes a side, until golden, then spoon the honey over. Choose a halloumi labelled vegetarian or halal-certified, since some are made with animal rennet.',
  ],

  storage:
    'Best eaten straight away, while the crust is at its crispest. Leftover chicken keeps in a sealed container in the fridge for up to 3 days, ideally without honey on it. Re-crisp it in the air fryer at 180°C for 5 to 6 minutes, or on a rack in the oven at 200°C (180°C fan) for 10 to 12 minutes, until piping hot, then spoon over warm honey. The hot honey keeps in a jar in the fridge for a week. The butter makes it set firm, so warm it gently until runny before using.',

  dropcap: true,

  image: 'https://images.unsplash.com/photo-1647724394693-2c93af726785?w=1200&q=80',
  imageIsStock: true,
};

export default recipe;
