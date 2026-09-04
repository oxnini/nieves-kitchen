// data/recipes/gochujang-beef-meatballs.ts
import type { RecipeInput } from './_types';

const recipe: RecipeInput = {
  title: 'Gochujang Beef Meatballs with Jasmine Rice',
  country: 'South Korea',
  category: 'main',
  difficulty: 'Easy',
  servings: 4,
  time: { active: 35, total: 45 },
  yield: 'Serves 4, ten large meatballs, two or three each',
  tags: ['high-protein', 'comfort food', 'meal-prep friendly'],

  region: 'East Asia',
  coordinates: { lat: 37.5665, lng: 126.978 },
  influences: ['South Korea', 'China'],
  featuredIngredients: ['beef', 'honey'],

  ingredients: [
    {
      heading: 'Meatballs',
      items: [
        { name: 'beef mince, 12% fat', amount: 500, unit: 'g' },
        { name: 'panko breadcrumbs', amount: 45, unit: 'g' },
        { name: 'milk', amount: 2, unit: 'tbsp' },
        { name: 'large egg', amount: 1, unit: '' },
        { name: 'garlic cloves, grated', amount: 2, unit: '' },
        { name: 'fresh ginger, grated', amount: 1, unit: 'tsp' },
        { name: 'spring onions, whites finely chopped, greens saved for the peas', amount: 3, unit: '' },
        { name: 'light soy sauce (halal-certified)', amount: 1, unit: 'tbsp' },
        { name: 'oyster sauce (halal-certified)', amount: 0.5, unit: 'tbsp' },
        { name: 'gochujang (halal-certified)', amount: 0.5, unit: 'tbsp' },
        { name: 'salt', amount: 1, unit: 'tsp' },
        { name: 'white pepper', amount: 0.5, unit: 'tsp' },
        { name: 'neutral oil, for the first batch only', amount: 1, unit: 'tsp' },
      ],
    },
    {
      heading: 'Glaze',
      items: [
        { name: 'light soy sauce (halal-certified)', amount: 80, unit: 'ml' },
        { name: 'water', amount: 80, unit: 'ml' },
        { name: 'gochujang (halal-certified)', amount: 1, unit: 'tbsp' },
        { name: 'honey', amount: 1, unit: 'tbsp' },
        { name: 'white sugar', amount: 2, unit: 'tsp' },
        { name: 'oyster sauce (halal-certified)', amount: 1, unit: 'tbsp' },
        { name: 'garlic cloves, grated', amount: 3, unit: '' },
        { name: 'fresh ginger, grated', amount: 1, unit: 'tbsp' },
        { name: 'toasted sesame oil', amount: 1, unit: 'tsp' },
        { name: 'rice vinegar', amount: 1, unit: 'tsp' },
        { name: 'cornflour, mixed with 1 tbsp cold water', amount: 1, unit: 'tsp' },
      ],
    },
    {
      heading: 'Rice',
      items: [
        { name: 'jasmine rice', amount: 270, unit: 'ml' },
        { name: 'water', amount: 270, unit: 'ml' },
        { name: 'salt', amount: 0.5, unit: 'tsp' },
      ],
    },
    {
      heading: 'Stir-fried peas',
      items: [
        { name: 'neutral oil', amount: 2, unit: 'tsp' },
        { name: 'garlic cloves, sliced thin', amount: 2, unit: '' },
        { name: 'fresh ginger, grated', amount: 1, unit: 'tsp' },
        { name: 'dried chilli flakes', amount: 0.25, unit: 'tsp' },
        { name: 'frozen peas', amount: 400, unit: 'g' },
        { name: 'light soy sauce (halal-certified)', amount: 1, unit: 'tbsp' },
        { name: 'rice vinegar', amount: 0.5, unit: 'tsp' },
        { name: 'toasted sesame oil', amount: 1, unit: 'tsp' },
        { name: 'sesame seeds, to finish (optional)', amount: 0, unit: '' },
      ],
    },
  ],

  steps: [
    {
      heading: 'Prep, all of it, before the cooker goes on',
      items: [
        'Stir the panko into the milk and leave it 5 minutes to soften. This panade is what keeps the meatballs tender rather than bouncy.',
        'Add the mince, egg, garlic, ginger, spring onion whites, soy, oyster sauce, gochujang, salt and pepper to the bowl of soaked panko. Going in that order means the wet panade is already spread through the bowl, so the mix needs less handling. Work it with your hands only until it comes together. Wet your hands and roll into 10 large balls, a little bigger than a golf ball.',
        'Whisk all the glaze ingredients except the cornflour together in a jug, working the gochujang in so there are no lumps. Mix the cornflour with its tablespoon of cold water separately and leave it by the hob.',
        'Slice the garlic for the peas and have it ready in a small bowl with the ginger, chilli flakes and the reserved spring onion greens. Once the meatballs are on you will not have time.',
        'Rinse the rice until the water runs clear. Do not soak jasmine. Drain it properly, because trapped rinse water throws the ratio off.',
      ],
    },
    {
      heading: 'The rice',
      items: [
        'Rice, water and salt into the pot, surface levelled. Lock the lid and run the rice programme for 4 minutes. It will sit coming up to pressure for 10 to 20 minutes before the countdown even starts, which is exactly the window you want for the meatballs.',
        'The moment it beeps, cancel keep-warm and leave it completely alone for a full natural release, about 10 minutes. Do not vent it. Natural release means doing nothing, there is no button for it.',
      ],
    },
    {
      heading: 'The meatballs',
      items: [
        'Nonstick pan on medium-high with the teaspoon of oil, just enough that the first few do not stick before any fat renders. Fry in two batches so they colour rather than steam. The second batch needs no oil at all, the first will have left plenty behind.',
        'Put the meatballs in and leave them alone until they release and colour, then turn. About 2 minutes a side, turning 3 or 4 times to build a crust all round, 8 to 10 minutes in total. Check the middle of one before you commit the batch.',
        'Lift them out and pour off the rendered fat. Pour the glaze into the hot pan, scrape up the browned bits and stir in the cornflour slurry.',
        'The moment it starts to bubble, turn the heat off. The pan holds more than enough heat to finish it. Return the meatballs and toss them through until glossy and sticky. This is the step that decides the dish, and the gap between glossy and dry is only a few seconds of extra heat.',
      ],
    },
    {
      heading: 'The peas, and the plate',
      items: [
        'Wok on high with the oil. Garlic, ginger and chilli flakes for 20 seconds, moving constantly, because garlic burns fast at that heat.',
        'Peas straight in from frozen and toss hard for 2 to 3 minutes, until thawed, lightly coloured, and any water has steamed off.',
        'Pour the soy round the edge of the wok so it sizzles rather than pools. Take the pan off the heat, then add the rice vinegar, sesame oil, sesame seeds and spring onion greens. The vinegar goes in off the heat so it stays bright instead of cooking away.',
        'Fluff the rice with a fork straight away. Rice into bowls, meatballs and glaze over the top, peas alongside.',
      ],
    },
  ],

  nutrition: { calories: 640, protein: 36, carbs: 78, fat: 19 },
  flavorProfile: { sweet: 3, salty: 4, sour: 1, bitter: 0, umami: 4, spicy: 2 },

  isVegetarian: false,
  isVegan: false,
  isGlutenFree: false,
  isDairyFree: false,

  quote:
    'Ten big meatballs lacquered in sticky gochujang, over jasmine rice, with sharp garlic and ginger peas cutting straight through the sweetness.',
  description:
    'The meatballs here are deliberately large, ten of them from 500g, so two or three each. Rolled that size they render enough of their own fat to need almost no frying oil, which means the fond that builds in the pan is pure beef rather than beef and oil, and the glaze is better for it. The timing is the other half of the appeal. Rice runs in the pressure cooker while the meatballs brown, the peas take three minutes at the end in a hot wok, and nothing waits on anything else. Gochujang goes into the mince as well as the glaze, half a tablespoon in each, which gives the meat its own low fermented hum rather than leaving all the flavour sitting on the outside.',
  attribution: 'A Nieves\'s Kitchen original',

  headnoteIngredients:
    'Check the gochujang, oyster sauce and soy labels. Several of the common gochujang brands list ethyl alcohol, and most supermarket oyster sauces list cooking wine, so buy halal-certified versions of all three. The rice vinegar and sugar together do the job mirin would otherwise do here, so nothing is missing. Mince at 12 to 15% fat is what makes the dry-frying work, and honey rather than more sugar is what lets the glaze coat properly on less total sweetener.',
  headnoteInstructions:
    'Do every scrap of prep before the cooker goes on, including slicing the garlic for the peas. Once the meatballs hit the pan the whole thing runs on parallel timing and there is no gap to chop in. If you want the cucumber pickle from the variations alongside the peas rather than instead of them, make it during prep and let it sit while everything else cooks.',

  equipment: [
    'An electric pressure cooker for the rice, though any rice method you already trust will do, this one just happens to run unattended while the meatballs brown',
    'A wok or a wide sauté pan, so the peas get tossed hard over high heat instead of stewing in a crowded pan',
  ],

  tips: [
    'Pull the glaze early. It keeps tightening off the heat, so slightly loose in the pan is exactly right on the plate. Left on the hob it dries out fast.',
    'Dry-frying is not a compromise. Mince at 12 to 15% gives up plenty of fat on its own, and skipping the oil means the browned bits you scrape into the glaze taste of beef and nothing else.',
    'Honey earns its place in the glaze. It has more body than sugar alone, so you can run less total sweetener and still get something that coats. It also catches faster in the pan, which is another reason to pull it the moment it turns glossy.',
    'A full teaspoon of salt in the mix, on top of the soy, is assertive, and it needs to be. The rice underneath reads plain by comparison. Drop to three quarters of a teaspoon if you are watching sodium.',
    'Do not crowd the pan. Ten large balls need room to colour rather than steam, so two batches if your pan is anything less than generous.',
    'Ten balls at 50g each rather than twenty small ones. Better texture, a nicer plate, and they still brown and cook through in 8 to 10 minutes on medium-high.',
    'For a richer version, use 15% mince, 2 tablespoons of frying oil, two rice cups and less veg. That is roughly 830 kcal a serving rather than 640, and it is very good, just a different night.',
  ],

  substitutions: [
    'No oyster sauce? A little extra soy plus a pinch of sugar. You lose some body but not much.',
    'No gochujang? 2 teaspoons of sriracha plus half a teaspoon of miso in the glaze gets you somewhere near, though not the same fermented depth.',
    'No honey? 1 and a half tablespoons of soft brown sugar, packed, in its place. Slightly less body and it takes a little longer to thicken, but it is close.',
    'Any dry breadcrumb stands in for panko, soaked in the milk the same way.',
    'Water in place of the milk in the panade works fine and makes the dish dairy-free.',
    'Basmati instead of jasmine: 6 minutes rather than 4, and a touch more water.',
  ],

  variations: [
    'Cucumber pickle instead of the peas, and honestly it cuts the sweet glaze better than anything cooked does. Halve a cucumber lengthways, scrape out the seeds and slice it thin. Toss with 2 tablespoons of rice vinegar, half a teaspoon of salt, half a teaspoon of sugar and a pinch of chilli flakes, then leave it for 20 minutes while everything else cooks and drain off the liquid it draws out. No pan, no heat, and barely any calories.',
    'Chicken thigh mince works in place of beef, but add a tablespoon of neutral oil to the pan since it renders far less.',
    'Hotter: an extra teaspoon of gochujang in the glaze, or a pinch of gochugaru over the finished plate.',
    'More veg: tenderstem broccoli or green beans, stir-fried exactly like the peas, 4 to 5 minutes instead of 3.',
    'A quarter teaspoon of Chinese five spice in the meatball mix pushes the whole thing towards the Chinese end and away from the gochujang. Good, but a different dish.',
  ],

  storage:
    'Keeps 3 days in the fridge. Reheat the meatballs and rice together in a covered pan with a splash of water over a low heat and the glaze loosens back up. The peas dull by day two but are still perfectly good. The meatballs freeze well, glazed or unglazed.',

  dropcap: true,

  image: '/recipes/gochujang-beef-meatballs-hero.webp',
  imageIsStock: false,
  images: [
    {
      url: '/recipes/gochujang-beef-meatballs-glaze.webp',
      caption: 'Off the heat at the first bubble, tossed through until glossy and sticky',
      width: 1050,
      height: 1400,
    },
  ],
};

export default recipe;
