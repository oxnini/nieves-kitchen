// data/recipes-held/sweet-and-sour-chicken.ts
import type { RecipeInput } from '../recipes/_types';

const recipe: RecipeInput = {
  title: 'Sweet and Sour Chicken',
  country: 'China',
  featuredIngredients: ['chicken', 'vinegar'],
  category: 'main',
  difficulty: 'Medium',
  servings: 4,
  time: { active: 60, total: 70 },
  yield: 'Serves 4 with rice',
  tags: ['high-protein', 'comfort food', 'treat'],

  region: 'East Asia',
  coordinates: { lat: 22.32, lng: 114.17 },
  influences: ['China'],

  ingredients: [
    {
      heading: 'The chicken',
      items: [
        { name: 'boneless, skinless chicken thighs, trimmed and cut into 2.5cm pieces', amount: 600, unit: 'g' },
        { name: 'light soy sauce (halal-certified)', amount: 1, unit: 'tsp' },
        { name: 'salt', amount: 0.5, unit: 'tsp' },
        { name: 'ground white pepper', amount: 0.25, unit: 'tsp' },
        { name: 'toasted sesame oil', amount: 1, unit: 'tsp' },
        { name: 'large egg white', amount: 1, unit: '' },
        { name: 'cornflour, for coating (you will have some left over)', amount: 120, unit: 'g' },
        { name: 'neutral oil, such as sunflower or groundnut, for deep frying (enough to come 3cm up the pan)', amount: 1, unit: 'l' },
        { name: 'oil in a mister or spray bottle, only if you are air frying', amount: 0, unit: '' },
      ],
    },
    {
      heading: 'The sauce',
      items: [
        { name: 'pineapple juice, from the tin (top up with water if you are short)', amount: 150, unit: 'ml' },
        { name: 'tomato ketchup', amount: 4, unit: 'tbsp' },
        { name: 'rice vinegar, plain, not seasoned (3 for the sauce, 1 to finish)', amount: 4, unit: 'tbsp' },
        { name: 'white sugar', amount: 2, unit: 'tbsp' },
        { name: 'light soy sauce (halal-certified)', amount: 1, unit: 'tbsp' },
        { name: 'cornflour', amount: 4, unit: 'tsp' },
        { name: 'water', amount: 4, unit: 'tbsp' },
      ],
    },
    {
      heading: 'The stir-fry',
      items: [
        { name: 'neutral oil (fresh, or a spoonful of the frying oil)', amount: 1, unit: 'tbsp' },
        { name: 'onion, cut into 2.5cm squares, layers separated', amount: 1, unit: '' },
        { name: 'red pepper, cut into 2.5cm squares', amount: 1, unit: '' },
        { name: 'green pepper, cut into 2.5cm squares', amount: 1, unit: '' },
        { name: 'garlic cloves, finely chopped', amount: 2, unit: '' },
        { name: 'fresh ginger, finely chopped', amount: 10, unit: 'g' },
        { name: 'tinned pineapple chunks in juice (not syrup), drained and patted dry', amount: 200, unit: 'g' },
      ],
    },
    {
      heading: 'To finish',
      items: [
        { name: 'spring onions, thinly sliced', amount: 2, unit: '' },
        { name: 'toasted sesame seeds', amount: 1, unit: 'tsp' },
        { name: 'sliced fresh green chili and coriander, optional', amount: 0, unit: '' },
        { name: 'steamed jasmine rice, to serve', amount: 0, unit: '' },
      ],
    },
  ],

  steps: [
    {
      heading: 'Before you start',
      items: [
        'Put the chicken in a bowl with the teaspoon of soy sauce, the salt, white pepper and sesame oil, and work it with your hand until the seasoning has disappeared into the meat. Leave it for 15 minutes, or cover it and keep it in the fridge for up to a day.',
        'While it sits, get everything else ready, because once the oil is hot it runs straight through to the plate. Drain the pineapple over a jug to catch the juice, measure out 150ml of it, and pat the chunks dry on kitchen paper. Whisk the pineapple juice, ketchup, 3 tablespoons of the rice vinegar, the sugar, the tablespoon of soy sauce, the 4 teaspoons of cornflour and the water together until the sugar and cornflour have dissolved. Keep the last tablespoon of vinegar to one side. Have the onion, peppers, garlic and ginger cut and next to the hob, set a wire rack over a tray, and start the rice now so it is ready when the chicken is.',
      ],
    },
    {
      heading: 'Coat the chicken',
      items: [
        'Stir the egg white into the chicken until every piece is slick and a little frothy.',
        'Sprinkle 2 tablespoons of the coating cornflour over the chicken and stir until it vanishes into a thin, sticky paste on each piece. This first layer is the glue that holds the next one on.',
        'Tip the rest of the coating cornflour into a wide bowl. Toss the chicken through it a handful at a time, pressing so every side is thickly covered, then shake off the loose powder and lay the pieces on a tray in a single layer.',
        'Leave them for 10 minutes while the oil (or the air fryer) heats. The coating turns from chalky white to slightly damp in patches, and that is what you want: a powdery coat flakes off in the oil and leaves white specks, while a damp one fries into a single hard shell.',
      ],
    },
    {
      heading: 'Fry twice',
      items: [
        'Pour the frying oil into a deep, heavy saucepan about 20cm across, or a wok sitting steady on the hob, so it is at least 3cm deep and the pan is no more than a third full. A wider 24cm pot needs about 1.5 litres for the same depth. Set it on a back ring with the handle turned in, and keep a lid or a baking tray beside the hob: if the oil ever catches, turn off the heat and slide the lid over it, and never use water. Heat the oil over medium-high heat to 170°C, about 8 to 10 minutes. Without a thermometer, dip in a dry wooden chopstick: a steady stream of small bubbles means it is ready. If the oil starts to smoke, it is far too hot, so turn the heat down. Stay with the pan the whole time it is on the heat.',
        'Fry the chicken in three batches, lowering the pieces in one at a time, close to the surface of the oil and away from you, so they do not splash or land in a heap, because the coating glues touching pieces together. Nudge them apart with chopsticks in the first 30 seconds, then fry for 4 minutes, turning once or twice, until the coating is set and pale gold. Lift onto the rack, and let the oil climb back to 170°C before the next batch. Cut the biggest piece of the last batch in half: the meat should be white all the way through, or 74°C on a thermometer. If it is not, give that batch another minute.',
        'Turn the heat up and bring the oil to 190°C, when the chopstick bubbles hard straight away. The few minutes this takes are the rest the chicken needs, as moisture from inside works out into the coating. Fry all the chicken again, in the same three batches so the oil stays hot, for 1 to 2 minutes each, letting it come back up to 190°C between them, until deep golden and properly crisp. The pieces rattle against the spoon when they are ready. Back onto the rack, not onto kitchen paper, so steam escapes from underneath. Turn the heat off under the oil and leave it well alone to cool.',
        'Rather not deep fry? Use an air fryer instead. Heat it to 200°C for 3 minutes and brush or mist the basket with oil. Lay the coated chicken in a single layer with a little space around each piece, which means two batches in a large basket and three in a small one, then mist it with oil until no dry white cornflour shows, since any powdery patch stays chalky. Air fry for 10 to 14 minutes, shaking the basket (or turning the pieces with tongs if they cling) and misting any pale, dry spots again halfway through, until deep golden, crisp at the edges and 74°C inside. Start checking at 10 minutes: thighs forgive a little extra time, but the coating darkens fast at the end. Repeat with the rest, then put the earlier batches back in for the last 2 minutes so everything is hot. The crust is thinner and less glassy than deep fried and softens sooner under the sauce, so keep the final toss below as short as you can.',
      ],
    },
    {
      heading: 'Sauce and toss',
      items: [
        'Heat the tablespoon of oil in a second wok or a large frying pan over the highest heat until it shimmers. If you fried in the wok, use your largest frying pan for this instead, and never try to pour out or move a pan of hot oil. Add the onion and peppers and stir-fry for 1 minute, no longer, until the edges blister and the colours brighten but they are still crisp in the middle. Tip them onto a plate. They go back in at the very end, so they never sit simmering in the sauce.',
        'Turn the heat down to medium. Add the garlic and ginger to the oil left in the pan and stir for 20 to 30 seconds, until fragrant but not coloured. Whisk the sauce again, since the cornflour settles, and pour it in. Let it bubble, stirring all the time, for 1 to 2 minutes, until it turns from cloudy to glossy and translucent, and a spatula dragged through it leaves a trail that holds for a moment. A thick sauce coats the crust; a thin one soaks straight into it. If it goes gluey, loosen it with a splash of water. Add the pineapple for the last 30 seconds, just to warm it.',
        'Turn off the heat and stir in the last tablespoon of vinegar. Boiling drives off the sharp, fresh edge of vinegar, and this spoonful puts it back, which is what keeps the sauce bright rather than cloying. Tip in the peppers and onion, then the chicken, and toss fast, for 15 seconds, just until every piece is lacquered. Scatter over the spring onions and sesame seeds, and the green chili and coriander if you like, and get it to the table straight away with rice.',
      ],
    },
  ],

  nutrition: { calories: 530, protein: 32, carbs: 46, fat: 24 },
  flavorProfile: { sweet: 3, salty: 2, sour: 3, bitter: 0, umami: 2, spicy: 0 },

  isVegetarian: false,
  isVegan: false,
  isGlutenFree: false,
  isDairyFree: true,

  quote:
    'Chicken fried twice into a hard golden shell, thrown through a glossy, tangy pineapple sauce off the heat, with peppers and onion that still snap.',
  description:
    'Sweet and sour comes from Cantonese cooking, and the Hong Kong style is the one with ketchup in the sauce and pineapple in the pan: a thin egg white and cornflour crust, a sauce that is balanced rather than sugary, and vegetables that are barely cooked. This version is built so the crunch survives the sauce. The coated chicken rests until the cornflour turns damp, so it fries into one even shell, then fries twice, the second time hotter, to drive the moisture out. Pineapple juice from the tin does much of the sweetening, so the sauce needs only two tablespoons of sugar, and a last spoonful of rice vinegar goes in off the heat to keep it bright. Ginger goes in alongside the garlic. The peppers and onion get one minute in a very hot pan and come out again before the sauce goes in, and everything meets for fifteen seconds on its way to the table. If you would rather not deep fry, the air fryer route sits right alongside the main method.',
  attribution: 'A Nieves\'s Kitchen take on a Cantonese classic, Hong Kong style',

  headnoteIngredients:
    'Thighs rather than breast: they stay juicy through two fries and taste of more. Buy pineapple chunks in juice, not syrup, because the juice is half the sauce and syrup makes it cloying; a 432g tin gives you both the 200g of chunks and the 150ml of juice, with a few chunks to spare. Use plain rice vinegar, since seasoned rice vinegar is already sweetened, and white sugar rather than brown, which pulls the sauce towards caramel. The ketchup gives all the colour, so there is no food colouring here. Buy a halal-certified light soy sauce, since some brewed soy sauces list alcohol.',
  headnoteInstructions:
    'Whisk the sauce and cut everything while the chicken marinates. From the moment the oil is hot it runs straight through to the plate, and the crust is at its best in the first few minutes after the toss. Fry in a saucepan and make the sauce in a wok or frying pan, and you never have to move hot oil. Everything after the frying is about keeping time in the heat short: the vegetables get one minute, the pineapple thirty seconds and the chicken fifteen, and nothing ever simmers in the sauce. The air fryer route takes a little longer, two or three batches of 10 to 14 minutes, but there is no hot oil to deal with.',

  equipment: [
    'A deep, heavy saucepan or a wok for the frying. A round-bottomed wok needs its ring so it cannot rock on the hob. A cooking thermometer makes the two temperatures easy, though the chopstick test in the steps gets you there without one.',
    'A wire rack over a tray for draining, so the crust stays crisp underneath. A plate lined with kitchen paper works if you have nothing else.',
    'An air fryer, only if you take that route instead of deep frying.',
  ],

  tips: [
    'Let the coating go damp before it fries. Ten minutes on the tray turns the cornflour from powdery to tacky, and a tacky coat fries into one shell instead of flaking off into the oil.',
    'The second fry is what lets the crust stand up to the sauce. The first sets the coating and cooks the chicken, the pause lets moisture move out to the surface, and the hotter second fry drives it off.',
    'Cook the sauce thick before the chicken goes anywhere near it. It is the single thing that decides whether the crust survives. Drag a spatula through it: if the line holds for a moment, it is ready.',
    'Taste the sauce once the last spoonful of vinegar is in. It should hit sour first and finish sweet. Ketchups and vinegars vary, so if yours tastes flat, add another teaspoon of vinegar, and if it makes you wince, a teaspoon of sugar.',
    'Keep the vegetables out of the simmer. One minute over the highest heat and straight out again is what keeps the peppers and onion crunchy, and they warm through again in the toss.',
    'The clock starts when the sauce hits. Even a double-fried crust softens within about 5 minutes under sauce, so call everyone to the table before you toss.',
  ],

  substitutions: [
    'Potato starch works in place of the cornflour, in the same amounts for both the coating and the sauce. It fries to a glassier, crunchier shell, but it is stickier, so keep the pieces well apart in the oil.',
    'Chicken breast instead of thighs: cut it a little bigger, about 3cm, and start checking after 3 minutes of the first fry so it stays juicy. It is done at 74°C.',
    'Fresh pineapple instead of tinned: use 200g of fresh chunks, and 150ml of pineapple juice from a carton, or 150ml of water with an extra tablespoon of sugar.',
    'No rice vinegar? Cider vinegar works in the same amounts. Distilled white vinegar is sharper, so use 3 tablespoons in all, 2 in the sauce and 1 to finish.',
    'Honey instead of sugar: 1½ tablespoons gives a rounder sauce. It catches more easily, so keep stirring while the sauce bubbles.',
    'For a gluten-free version, use tamari in place of both soy sauces and check the ketchup label.',
  ],

  variations: [
    'Charred fresh pineapple: use 200g of fresh pineapple in 2cm chunks, with the juice swap in the substitutions. Before the peppers go in, sear the chunks in the hot pan with a teaspoon of oil for 2 to 3 minutes, moving them as little as possible, until browned at the edges, then lift them out and add them back with the vegetables. The caramelised edges give the sauce a deeper, toastier sweetness.',
    'Plum sauce: whisk 1 tablespoon of Chinese plum sauce into the sauce and drop the sugar to 1 tablespoon. It adds a fruity depth without tipping into sweet.',
    'Sweet and sour prawns: use 500g of large raw peeled prawns, patted very dry, in place of the chicken. Marinate and coat them the same way, then fry for 1 to 2 minutes at 170°C, just until they turn pink and curl, and for 30 to 45 seconds at 190°C. In the air fryer, give them 6 to 8 minutes at 200°C.',
    'British takeaway chicken balls, with the sauce on the side: season the chicken as in the first step but leave out the egg white and the coating. Toss the pieces in 1 tablespoon of plain flour. Whisk 70g of plain flour, 60g of cornflour, 2 teaspoons of baking powder and half a teaspoon of salt with 200ml of ice-cold sparkling water into a batter about as thick as double cream. Dip the pieces in the batter and fry them at 170°C in batches of about 10 for 5 to 6 minutes, turning, until puffed, golden and 74°C inside. Make the vegetables and sauce exactly as above and serve them in a bowl alongside for dipping.',
    'More heat: add a sliced red chili with the garlic and ginger, or spoon a little crispy chili oil, such as Lao Gan Ma, over the finished plate. Check the jar, since some varieties contain meat.',
  ],

  storage:
    'Best eaten straight away, while the crust still crackles. Leftovers keep in the fridge for up to 2 days. Re-crisp them in the air fryer at 200°C for 3 to 4 minutes, or in a hot oven, knowing the crust will not be quite what it was. To get ahead, the whisked sauce keeps in a jar in the fridge for 3 days, and the chicken can have its first fry an hour or two before you eat, leaving only the second fry and the toss for the last minutes.',

  dropcap: true,

  image: 'https://images.unsplash.com/photo-1623689046286-01d812cc8bad?w=1200&q=80',
  imageIsStock: true,
};

export default recipe;
