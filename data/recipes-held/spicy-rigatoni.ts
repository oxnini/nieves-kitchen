// data/recipes-held/spicy-rigatoni.ts
import type { RecipeInput } from '../recipes/_types';

const recipe: RecipeInput = {
  title: 'Spicy Rigatoni',
  country: 'Italy',
  category: 'main',
  difficulty: 'Easy',
  servings: 3,
  time: { active: 25, total: 30 },
  yield: 'Serves 3, or 2 very generous bowls',
  tags: ['quick', 'spicy', 'comfort food', 'vegetarian'],

  region: 'Western Europe',
  coordinates: { lat: 39.0, lng: 16.5 },
  influences: ['Italy', 'United States of America'],

  ingredients: [
    {
      heading: 'Pasta',
      items: [
        { name: 'rigatoni, ideally bronze-cut', amount: 250, unit: 'g' },
        { name: 'fine salt, for the pasta water', amount: 1, unit: 'tbsp' },
        { name: 'reserved pasta water', amount: 0, unit: '' },
      ],
    },
    {
      heading: 'Sauce',
      items: [
        { name: 'olive oil', amount: 2, unit: 'tbsp' },
        { name: 'onion, chopped as finely as you can', amount: 0.5, unit: '' },
        { name: 'garlic cloves, grated or crushed', amount: 2, unit: '' },
        { name: 'Calabrian chili paste (1 tbsp for a gentle warmth, 2 for real heat)', amount: 1.5, unit: 'tbsp' },
        { name: 'tomato paste (double-concentrated tomato purée)', amount: 80, unit: 'g' },
        { name: 'double cream', amount: 150, unit: 'ml' },
        { name: 'salt, to taste', amount: 0, unit: '' },
      ],
    },
    {
      heading: 'To finish',
      items: [
        { name: 'unsalted butter, cold, cut into small cubes', amount: 30, unit: 'g' },
        { name: 'vegetarian Italian-style hard cheese or a halal-certified hard cheese, finely grated', amount: 40, unit: 'g' },
        { name: 'basil leaves, a small handful, torn', amount: 0, unit: '' },
        { name: 'lemon juice, optional, only if the sauce tastes heavy', amount: 0, unit: '' },
      ],
    },
  ],

  steps: [
    {
      heading: 'Before the pan goes on',
      items: [
        'Bring about 2.5 litres of water to the boil in a medium-large pot and add the tablespoon of salt. That is less water and less salt than you might use for plain pasta, on purpose: less water gives you starchier water to build the sauce with, and the water ends up in a sauce that already has salty chili paste and cheese in it.',
        'While it heats, chop the onion as finely as you can, grate the garlic and the cheese, and cut the butter into small cubes. Put the butter back in the fridge until the very end. Cold butter is what makes the final sauce glossy rather than oily.',
      ],
    },
    {
      heading: 'Onion, chili and brick-red tomato paste',
      items: [
        'Once the water is boiling, heat the olive oil in a wide frying pan or sauté pan over medium heat. It needs to be big enough to toss all the pasta later, about 28cm across. Add the onion with a pinch of salt and cook for 5 minutes, stirring often, until it is soft and see-through but not browned.',
        'Now drop the rigatoni into the boiling water and stir it for the first minute so it does not stick. Set a timer for 2 minutes less than the packet time. It will finish cooking in the sauce. Rigatoni usually takes 11 to 13 minutes; if your packet says 10 minutes or less, hold the pasta back and drop it in when the tomato paste goes into the pan, so it is not ready before the sauce.',
        'Back in the frying pan, add the garlic and the Calabrian chili paste and cook for 1 minute, stirring, until the garlic smells sweet and the oil turns orange-red.',
        'Add the tomato paste and spread it across the base of the pan. Fry it for 4 to 5 minutes, stirring and scraping every 30 seconds or so, until it darkens from bright tomato red to a deep brick red, smells sweet rather than sharp, and leaves a rusty film on the bottom of the pan. That film is flavour, so let it build. If any of it starts to turn black, turn the heat down a little.',
        'Ladle about 100ml of water from the pasta pot into the pan. The pasta has been in for a few minutes, so the water is already cloudy with starch. It will hiss. Scrape up every bit of the rusty film with a wooden spoon and stir for about 1 minute, until you have a thick, smooth, dark red paste.',
      ],
    },
    {
      heading: 'Cream, then the emulsion',
      items: [
        'Turn the heat down to medium-low and pour in the cream a little at a time, stirring as it goes in, until the sauce is an even, deep salmon-orange with no red streaks. Let it bubble gently for 2 minutes, until it coats the back of a spoon. If the pasta still has a few minutes to go, turn the sauce to its lowest heat and let it wait.',
        'When the timer goes, scoop out a mugful (about 250ml) of the pasta water and set it by the hob. Drain the rigatoni, or lift it straight from the pot with a slotted spoon, and tip it into the sauce with 4 tablespoons of the reserved water. Toss and stir over medium heat for 1 to 2 minutes, until the pasta is just al dente and the sauce has tightened around it.',
        'Take the pan off the heat. Add the cold butter, then the cheese a handful at a time, with another 2 tablespoons of pasta water, tossing and stirring hard for about a minute until the butter has vanished and the sauce turns glossy and clings to every ridge. Do not put it back on a high heat once the cheese is in: boiling now is what makes cheese go stringy and the fat split out.',
        'Look at the surface. If you see beads of orange oil or the sauce looks grainy, it is too tight: add a splash more pasta water off the heat and toss hard, and it will come back together. If it looks thin, return it to a low heat for 30 seconds, tossing all the time. It should be a little looser than you think, because rigatoni keeps drinking sauce on the way to the table.',
        'Taste and add salt only if it needs it. If it tastes rich but a little flat, stir in a few drops of lemon juice, starting with half a teaspoon: it sharpens the tomato and cuts through the cream. Scatter the torn basil over and serve straight away in warm bowls.',
      ],
    },
  ],

  nutrition: { calories: 790, protein: 17, carbs: 68, fat: 49 },
  flavorProfile: { sweet: 1, salty: 3, sour: 1, bitter: 0, umami: 3, spicy: 3 },

  isVegetarian: true,
  isVegan: false,
  isGlutenFree: false,
  isDairyFree: false,

  quote:
    'Tomato paste fried to a deep brick red, Calabrian chili, and a cream and butter sauce tossed with starchy pasta water until it clings to every ridge of the rigatoni.',
  description:
    'Spicy rigatoni is the Italian-American cousin of penne alla vodka: onion, garlic and Calabrian chili, tomato paste, cream, butter and cheese, tossed with short ridged pasta until the sauce turns a glossy coral orange. There is no vodka in this one, and it does not need any. The flavour comes from frying the tomato paste hard, until it turns brick red and catches on the pan, then lifting all of that with a ladle of starchy pasta water. The same water, with cold butter and grated cheese stirred in off the heat, is what makes the sauce cling to the pasta instead of sliding off it or turning greasy. It is a fast weeknight bowl with proper heat, and everything lands in the pan at the same moment.',
  attribution: 'A Nieves\'s Kitchen take on an Italian-American classic',

  headnoteIngredients:
    'Calabrian chili paste is crushed Calabrian chilies preserved in oil with salt and a little vinegar, sold in jars in Italian delis and larger supermarkets. It brings a fruity, salty heat that dried flakes alone do not, and the substitutions cover what to do without it. Many jars are made with wine vinegar, so read the label and pick one made with plain vinegar, or just chilies, oil and salt, if you avoid it. Use double-concentrated tomato paste, since it is the backbone of the sauce, and double cream, which holds together at a simmer where single cream can split. Parmigiano Reggiano and Grana Padano are always made with animal rennet, so use a vegetarian Italian-style hard cheese or a halal-certified one, and grate it yourself on the finest side of the grater.',
  headnoteInstructions:
    'Get the water on first. The onion starts once it boils and the pasta goes in when the onion is soft, so the sauce and the pasta are ready together. Two moments decide the dish: frying the tomato paste until it is brick red, not just warmed through, and finishing the pasta off the heat with cold butter, cheese and pasta water, tossing hard until it turns glossy.',

  tips: [
    'Brick red is a colour, not a time. Tomato pastes vary, so keep frying until the paste has gone a shade darker, smells sweet and leaves a rusty film on the pan. Undercooked paste tastes sharp and tinny, and that is the flatness people blame on leaving out the vodka.',
    'Use the pasta water early as well as late. Deglazing with starchy water instead of plain water lifts the browned paste off the pan and starts thickening the sauce straight away, so the emulsion is half built before the pasta goes in.',
    'Keep the butter cold and the pan off the heat when the butter and cheese go in. They melt slowly into the starchy sauce and stay suspended in it. In a boiling pan the fat separates and the cheese clumps into strings.',
    'If the sauce looks greasy or grainy at any point, it is almost always too thick or too hot. A splash of pasta water and a hard toss off the heat brings it back.',
    'Grate the cheese yourself. Ready-grated cheese is coated in anti-caking starch and melts into a grainy sauce.',
    'Leave the sauce slightly loose in the pan. Rigatoni keeps soaking it up, and a sauce that looks perfect on the hob is often stiff by the time it reaches the table.',
  ],

  substitutions: [
    'No Calabrian chili paste? Stir 1 to 1.5 teaspoons of dried chili flakes into the oil with the garlic, add 1 teaspoon of sweet paprika with the tomato paste (paprika scorches if it goes in earlier), and add half a teaspoon of cider vinegar and a pinch of salt with the pasta water you deglaze with. The vinegar and salt bring back the tang and seasoning the jarred chilies are packed in. A tablespoon of harissa also works in place of the paste, added with the garlic: warmer and a little more cumin-led, but very good.',
    'Paccheri, mezze maniche or penne all work in place of rigatoni. Anything short and hollow with a rough surface catches the sauce.',
    'Whipping cream works in place of double cream. Single cream is more likely to split, so if that is all you have, keep it at a bare simmer and add it off the heat.',
    'A banana shallot, finely chopped, can stand in for the half onion and melts into the sauce even more smoothly.',
    'Gluten-free pasta works. Its water carries less starch, so add the water a spoonful at a time at the end and lean on the cold butter to give the sauce its gloss.',
  ],

  variations: [
    'A little brightness: toss in 1 teaspoon of lemon juice with the butter and cheese. It gives the sauce the sharp edge vodka is usually there for.',
    'Burrata on top: tear a ball of burrata over the bowls just before serving, so it melts slowly into the hot sauce. Check the label for vegetarian or microbial rennet, or buy a halal-certified one.',
    'With halal beef sausage: squeeze 200g of halal beef sausages out of their skins and brown the meat in the pan with 1 tablespoon of the olive oil over medium-high heat for 5 to 6 minutes, breaking it into small pieces, until browned and cooked through. Lift it out with a slotted spoon, cook the onion in the fat it leaves with the remaining tablespoon of oil, then stir the sausage back in with the pasta.',
    'Gochujang rigatoni: swap the Calabrian chili paste for 1.5 tablespoons of halal-certified gochujang (several brands list alcohol, so check the label). Add it after the tomato paste has gone brick red and stir it for only 30 seconds before the pasta water goes in, since the sugar in it catches quickly. A Korean-Italian bowl with a deeper, rounder heat.',
    'Hotter: slice a fresh green chili over the finished bowls, or add an extra half tablespoon of the chili paste with the garlic.',
  ],

  storage:
    'Best straight from the pan. Leftovers keep in a sealed container in the fridge for up to 2 days. The pasta drinks the sauce as it sits, so reheat it in a pan over a low heat with 2 to 3 tablespoons of water, stirring, until it loosens and turns glossy again. It does not freeze well, since the cream sauce turns grainy.',

  dropcap: true,

  image: 'https://images.unsplash.com/photo-1709201417368-f0f779f3b8d8?w=1200&q=80',
  imageIsStock: true,
};

export default recipe;
