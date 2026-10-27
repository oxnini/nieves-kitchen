// data/recipes-held/salt-and-pepper-chicken.ts
import type { RecipeInput } from '../recipes/_types';

const recipe: RecipeInput = {
  title: 'Salt and Pepper Chicken',
  country: 'China',
  featuredIngredients: ['chicken'],
  category: 'main',
  difficulty: 'Medium',
  servings: 4,
  time: { active: 50, total: 70 },
  yield: 'Serves 3 to 4 with rice',
  tags: ['high-protein', 'spicy', 'comfort food', 'treat'],

  region: 'East Asia',
  coordinates: { lat: 23.13, lng: 113.26 },
  influences: ['China', 'United Kingdom'],

  ingredients: [
    {
      heading: 'The chicken',
      items: [
        { name: 'boneless, skinless chicken thighs, trimmed and cut into 2.5cm pieces', amount: 600, unit: 'g' },
        { name: 'large egg white', amount: 1, unit: '' },
        { name: 'light soy sauce (halal-certified)', amount: 1, unit: 'tsp' },
        { name: 'fine salt', amount: 0.5, unit: 'tsp' },
        { name: 'cornflour (you will have some left over)', amount: 80, unit: 'g' },
        { name: 'plain flour', amount: 20, unit: 'g' },
        { name: 'baking powder', amount: 0.5, unit: 'tsp' },
        { name: 'neutral oil, such as sunflower or groundnut, for deep frying (1.5 litres if your pan is 24cm across)', amount: 1000, unit: 'ml' },
        { name: 'oil spray, only if you are air frying', amount: 0, unit: '' },
      ],
    },
    {
      heading: 'The salt and pepper seasoning',
      items: [
        { name: 'sea salt flakes, measured as whole flakes, about 4g (or ¾ teaspoon of fine salt, never 1½)', amount: 1.5, unit: 'tsp' },
        { name: 'caster sugar', amount: 1, unit: 'tsp' },
        { name: 'ground white pepper', amount: 1, unit: 'tsp' },
        { name: 'chili flakes', amount: 0.5, unit: 'tsp' },
        { name: 'Chinese five spice', amount: 0.5, unit: 'tsp' },
        { name: 'garlic powder', amount: 0.5, unit: 'tsp' },
        { name: 'MSG (optional)', amount: 0.25, unit: 'tsp' },
      ],
    },
    {
      heading: 'The stir-fry',
      items: [
        { name: 'neutral oil (fresh, or a spoonful of the frying oil)', amount: 1, unit: 'tbsp' },
        { name: 'onion, cut into 2cm pieces', amount: 1, unit: '' },
        { name: 'green pepper, cut into 2cm pieces', amount: 1, unit: '' },
        { name: 'red chilies, sliced into rounds', amount: 2, unit: '' },
        { name: 'garlic cloves, finely chopped (not crushed)', amount: 4, unit: '' },
        { name: 'spring onions, sliced, whites and greens kept apart', amount: 4, unit: '' },
      ],
    },
    {
      heading: 'To finish',
      items: [
        { name: 'sliced fresh green chili and chopped coriander, optional', amount: 0, unit: '' },
        { name: 'steamed rice or egg fried rice, to serve', amount: 0, unit: '' },
      ],
    },
  ],

  steps: [
    {
      heading: 'Marinate, and get everything ready',
      items: [
        'Put the chicken pieces in a bowl with the egg white, soy sauce and fine salt. Mix with your hand for about 1 minute, until the egg white has turned frothy and almost disappeared into the meat. Leave it for 15 minutes, or cover and refrigerate for up to 8 hours.',
        'While the chicken sits, mix all the seasoning ingredients in a small bowl, rubbing them together with your fingertips so the salt flakes break down and nothing clumps. Cut the onion and green pepper into 2cm pieces, slice the red chilies and spring onions (keeping the whites and greens in separate piles), and finely chop the garlic. Set a wire rack over a tray next to the hob, and get the rice on now so it is ready when the chicken is.',
        'In a wide bowl, whisk together the cornflour, plain flour and baking powder.',
      ],
    },
    {
      heading: 'Coat the chicken',
      items: [
        'Lift the chicken into the flour a handful at a time, leaving any loose egg white behind in the bowl. Toss and press each piece into the flour until it is completely covered, cut sides included, then shake off the loose powder and lay the pieces on a tray in a single layer.',
        'Leave them for 10 minutes, and start heating the oil (next step) as soon as they go down, or heat the air fryer for the last 3 of those minutes. The coating turns from chalky white to slightly damp as it soaks up the egg white, and that is what stops it flaking off in the oil.',
      ],
    },
    {
      heading: 'Fry twice (or air fry)',
      items: [
        'Pour the oil into a deep, heavy saucepan 20 to 24cm across (1 litre for 20cm, 1.5 litres for 24cm), or a wok sitting steady on its ring, so it comes 3 to 4cm up the sides and the pan is no more than a third full. Turn the handle in from the edge of the hob and keep a lid or baking tray beside it. Heat it over medium-high heat to 170°C, about 8 to 10 minutes. Without a thermometer, dip in a dry wooden chopstick: a steady stream of small bubbles means it is ready. Stay with the pan the whole time it is on the heat. If the oil ever smokes, turn the heat off and let it settle; if it catches, slide the lid or tray over it and turn off the heat, and never use water.',
        'Fry the chicken in three batches (two in a wide wok), lowering the pieces in one at a time with tongs or a slotted spoon, away from you, so they do not land in a clump, and nudging them apart in the first 30 seconds. Fry for 4 to 5 minutes, turning now and then, until the coating is set and pale gold and the chicken is cooked through: 74°C in the middle of the biggest piece, or cut one open to check there is no pink. Lift onto the rack, and give the oil a minute to climb back to 170°C before the next batch.',
        'Once the last batch is out, leave all the chicken on the rack for 5 minutes. Moisture moves out of the meat towards the crust while it rests, and the second fry drives it off.',
        'Turn the heat up and bring the oil to 190°C, when the chopstick bubbles hard straight away. Fry all the chicken again in two batches for 1 to 2 minutes each, letting the oil come back up between them, until deep golden and properly crisp. The pieces rattle against the spoon when they are ready. Back onto the rack, uncovered and in a single layer. Turn off the heat under the oil and leave it well alone to cool.',
        'Rather not deep fry? Use an air fryer instead of the four steps above. Heat it to 200°C for 3 minutes and spray the basket with oil. Lay in the coated chicken in a single layer with a little space between the pieces, which means two batches in most baskets, then spray it until no dry white flour shows anywhere, since any powdery patch stays chalky however long it cooks. Air fry for 8 minutes, then shake the basket (or turn the pieces with tongs if they cling), spray any pale, dry spots again, and cook for another 6 to 8 minutes, until deep golden, crisp at the edges and 74°C in the middle of the biggest piece. Tip onto the rack, cook the second batch the same way, then put the first batch back in for the last 2 minutes so all of it goes into the wok hot.',
      ],
    },
    {
      heading: 'The toss, off the heat',
      items: [
        'Use a wok or a large frying pan for this; if you fried in your wok, use a frying pan rather than moving hot oil. Heat the tablespoon of oil over high heat until it shimmers and just starts to smoke. Add the onion and green pepper, spread them out and leave them for 30 seconds, then toss for another 1 to 1½ minutes, until the edges blister and char in spots but the pieces still snap in the middle.',
        'Turn the heat down to medium (on an electric hob, also lift the pan off for 10 seconds, since the ring stays hot) and add the garlic, red chilies and spring onion whites. Stir-fry for 30 to 45 seconds, until the garlic is pale gold and smells sweet. Do not let it brown, or it turns bitter.',
        'Turn the heat off. Tip in all the chicken, scatter over half the seasoning and toss, then scatter over the rest and toss again, 20 to 30 seconds in all, until every piece is speckled. The seasoning is measured for this much chicken, so use all of it; if you are sensitive to salt, hold back the last teaspoon, taste a piece, and add the rest only if it needs it.',
        'Toss in the spring onion greens, then tip everything onto a wide, warm platter in a loose layer rather than piling it into a deep bowl. Scatter over green chili and coriander if you like, and get it to the table straight away with the rice.',
      ],
    },
  ],

  nutrition: { calories: 430, protein: 32, carbs: 22, fat: 24 },
  flavorProfile: { sweet: 1, salty: 4, sour: 0, bitter: 0, umami: 3, spicy: 3 },

  isVegetarian: false,
  isVegan: false,
  isGlutenFree: false,
  isDairyFree: true,

  quote:
    'Crackling bites of chicken thigh thrown off the heat with blistered onion, green pepper, garlic and chili, in a white pepper seasoning measured to the spoon.',
  description:
    'Salt and pepper chicken is one of the great dishes of the British Chinese takeaway: crisp, golden pieces of chicken thrown through a hot wok with onion, green pepper, chili and garlic, then dusted with a seasoning of salt, white pepper, a little sugar and five spice. It grew out of the Cantonese salt and pepper style, where fried squid, prawns, tofu or mushrooms are tossed at the last moment with salted white pepper, garlic and chili, and the takeaways made it their own with the peppers, onion and five spice. This version is built so the crunch lasts and the salt stays in balance. The thighs sit in egg white and a little soy, then go into cornflour with a little plain flour and a pinch of baking powder, and the coating is left to set before it is fried twice. The seasoning is measured for exactly this much chicken, so all of it goes in without tipping into too salty, and it goes on with the heat off, after the vegetables have had just two hot minutes, so they stay sweet and crunchy. The air fryer route sits right beside the frying, and a handful of fresh green chili and coriander on top is very welcome.',
  attribution: 'A Nieves\'s Kitchen take on a British Chinese takeaway classic',

  headnoteIngredients:
    'Use thighs. They stay juicy through two fries and taste of more, where breast dries out quickly. White pepper is the pepper in salt and pepper, hotter and more floral than black, so buy a fresh jar if yours has been open for a year. The salt in the seasoning is sea salt flakes, measured by the spoon as whole flakes and only then crumbled fine into the mix. Flakes weigh about half as much as fine salt by the spoon, so if fine salt is all you have, use ¾ teaspoon, not 1½. The plain flour helps the crust brown and the baking powder makes it lighter. Buy a halal-certified light soy sauce, since some naturally brewed soy sauces list alcohol. MSG is optional: it adds that savoury, moreish takeaway depth, and the dish is still very good without it.',
  headnoteInstructions:
    'Chop everything, mix the seasoning and put the rice on while the chicken marinates, because from the first fry it runs straight through to the table. Fry in a saucepan and toss in a wok or frying pan, and you never have to move hot oil. The air fryer route takes about 5 minutes longer, in two batches, with no pan of oil at all. Either way, the final toss happens with the heat off and takes under a minute, which is what keeps the coating crisp and the vegetables crunchy.',

  equipment: [
    'A deep, heavy saucepan or a wok for the frying. A round-bottomed wok needs its ring so it cannot rock on the hob. A cooking thermometer makes the two temperatures easy, though the chopstick test in the steps gets you there without one.',
    'A wire rack over a tray for draining, so the crust stays crisp underneath. A plate lined with kitchen paper works if you have nothing else.',
    'An air fryer, only if you take that route instead of deep frying.',
  ],

  tips: [
    'Mind the salt swap. The seasoning is balanced for sea salt flakes, measured before you crumble them, which weigh about half as much as fine salt by the spoon. Use fine salt at the same measure and the dish turns too salty, so use ¾ teaspoon. If in doubt, weigh it: 4g.',
    'Give the coated chicken its 10 minutes before it cooks. Once the flour has gone from chalky to slightly damp it stays on in the oil, and in the air fryer it crisps instead of staying powdery.',
    'The second fry is what makes it crackle. The first fry cooks the chicken and sets the crust, the rest lets moisture creep to the surface, and the short, hotter second fry drives it off. Drain on a rack, uncovered and in one layer, because lids and piled-up pieces trap steam.',
    'Cut the onion and pepper big, into 2cm pieces, and give them no more than 2 minutes in a smoking-hot pan. They should blister at the edges and still snap in the middle, because they keep cooking in the toss.',
    'Chop the garlic, do not crush it. Chopped garlic fries into small golden, crunchy bits, while crushed garlic is wet, clumps and burns. Turn the heat down before it goes in and take it off the moment it turns pale gold.',
    'Keep the toss dry and short. No soy, no sauce and no splash of water at the end, and no more than 30 seconds of tossing. If your pan is small, do the toss in a large warmed mixing bowl instead, since it happens off the heat anyway.',
    'Make a jar of the seasoning. Triple the mix and keep it sealed for up to 3 months; about 5 teaspoons seasons this much chicken. It is very good on chips and roast potatoes too.',
  ],

  substitutions: [
    'Potato starch in place of the cornflour, at the same weight, gives an even crunchier, glassier crust. Keep the plain flour for colour.',
    'Chicken breast works. Cut it into 3cm pieces and give it 3 to 4 minutes on the first fry, or 12 to 14 minutes in all in the air fryer, as it dries out sooner than thigh.',
    'No egg? Mix 1 tablespoon of water and 1 teaspoon of cornflour into the chicken in place of the egg white. The coating clings almost as well.',
    'For a gluten-free version, use tamari in place of the soy sauce and rice flour in place of the plain flour, and check the baking powder and five spice labels.',
    'A red pepper instead of the green, or half of each. Green is the takeaway classic, slightly bitter against the sweet onion, while red is sweeter.',
  ],

  variations: [
    'In the oven: heat it to 220°C (200°C fan) with a wire rack set over a lined baking tray. Spread the coated chicken over the rack with space between the pieces, spray all over with oil until no dry flour shows, and bake for 20 to 25 minutes, turning the pieces and spraying any dry spots again halfway, until golden, crisp at the edges and 74°C in the middle. Then toss in the wok exactly as above. Not quite as crunchy as fried, but very good.',
    'Sichuan pepper salt: toast 1 teaspoon of Sichuan peppercorns in a dry pan over medium-low heat for 2 to 3 minutes, until fragrant and slightly glossy, grind them fine and sieve out the husks. Use this in place of half the white pepper for a tingling, numbing edge.',
    'Spice bag, the Irish takeaway way: cook 500g of oven chips (in the oven or the air fryer, following the packet) so they are ready with the chicken. Make the seasoning one and a half times over, toss the hot chips into the wok with the chicken and vegetables, and use the extra seasoning on them. Tip it all into a large paper bag or bowl, shake, and serve with a Chinese-style curry sauce, checking the label of any jar or sauce mix for a halal one.',
    'Salt and pepper chips: skip the chicken and toss 750g of hot, crisp oven chips with the stir-fried vegetables and the full seasoning in the same way.',
    'Salt and pepper prawns: use 400g of raw, peeled king prawns, patted very dry, with the same marinade for 10 minutes and the same coating. Deep fry for 1½ to 2 minutes, then 1 minute on the second fry, or air fry at 200°C for 7 to 9 minutes, until pink all through and crisp.',
    'For more warmth, add a thumb of fresh ginger, cut into fine matchsticks, with the garlic.',
  ],

  storage:
    'Best eaten straight away, while the coating still crackles. Leftovers keep in the fridge for up to 2 days. Re-crisp them in the air fryer at 200°C for 3 to 4 minutes, or on a rack in the oven at 220°C (200°C fan) for 8 to 10 minutes, rather than the microwave, which turns the crust soft. The seasoning keeps in a sealed jar for 3 months.',

  dropcap: true,

  image: 'https://images.unsplash.com/photo-1736239092540-14f65e425ec0?w=1200&q=80',
  imageIsStock: true,
};

export default recipe;
