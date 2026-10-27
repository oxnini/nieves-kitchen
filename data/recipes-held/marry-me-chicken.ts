// data/recipes-held/marry-me-chicken.ts
import type { RecipeInput } from '../recipes/_types';

const recipe: RecipeInput = {
  title: 'Marry Me Chicken',
  country: 'Italy',
  featuredIngredients: ['chicken'],
  category: 'main',
  difficulty: 'Easy',
  servings: 4,
  time: { active: 40, total: 45 },
  yield: 'Serves 4, two thin cutlets each over pasta',
  tags: ['high-protein', 'comfort food'],

  region: 'Western Europe',
  coordinates: { lat: 41.9028, lng: 12.4964 },
  influences: ['Italy', 'United States of America'],

  ingredients: [
    {
      heading: 'The chicken',
      items: [
        { name: 'small skinless chicken breasts, about 600g in all', amount: 4, unit: '' },
        { name: 'fine salt', amount: 0.75, unit: 'tsp' },
        { name: 'black pepper, to taste', amount: 0, unit: '' },
        { name: 'plain flour, for dusting', amount: 3, unit: 'tbsp' },
        { name: 'oil from the sun-dried tomato jar', amount: 2, unit: 'tbsp' },
      ],
    },
    {
      heading: 'The sauce',
      items: [
        { name: 'banana shallot (or half a small onion), finely chopped', amount: 1, unit: '' },
        { name: 'garlic cloves, finely chopped', amount: 4, unit: '' },
        { name: 'tomato purée', amount: 1, unit: 'tbsp' },
        { name: 'dried oregano', amount: 1, unit: 'tsp' },
        { name: 'dried thyme', amount: 0.5, unit: 'tsp' },
        { name: 'chili flakes', amount: 0.5, unit: 'tsp' },
        { name: 'hot chicken stock, made with 1 halal chicken stock cube', amount: 300, unit: 'ml' },
        { name: 'double cream', amount: 150, unit: 'ml' },
        { name: 'sun-dried tomatoes in oil, drained and roughly chopped', amount: 80, unit: 'g' },
        { name: 'vegetarian Italian-style hard cheese, finely grated', amount: 60, unit: 'g' },
        { name: 'baby spinach, 2 big handfuls (optional)', amount: 80, unit: 'g' },
        { name: 'fresh basil, a handful of leaves, torn', amount: 0, unit: '' },
      ],
    },
    {
      heading: 'The pasta',
      items: [
        { name: 'dried pasta, such as rigatoni, penne or tagliatelle', amount: 250, unit: 'g' },
        { name: 'salt, for the pasta water', amount: 1, unit: 'tbsp' },
      ],
    },
  ],

  steps: [
    {
      heading: 'Before the pan goes on',
      items: [
        'Put a large pot of water on to boil for the pasta, about 3 litres, with the tablespoon of salt. It takes a while, so start it first.',
        'Lay each breast flat and, with your hand pressed on top, slice it in half horizontally into two thin cutlets. Put them between two sheets of baking paper or in a large freezer bag and press or tap the thicker ends with a rolling pin or the base of a small pan until every cutlet is an even 1cm thick. Even thickness is the whole secret to juicy chicken here: the cutlets all cook through at the same moment, so none dry out waiting for the thick end.',
        'Pat the cutlets dry and season them on both sides with the fine salt and some black pepper.',
        'Chop the shallot, garlic and sun-dried tomatoes, grate the cheese finely, and make up the stock. Once the chicken is in the pan there is no time to chop.',
      ],
    },
    {
      heading: 'Sear the chicken',
      items: [
        'Spread the flour on a plate and press each cutlet into it, then shake off the excess so it is only a thin dusting. The flour helps the cutlets brown, and what is left in the pan later thickens the sauce so it clings.',
        'Spoon the oil from the top of the jar, leaving the herb bits behind, since they burn in a hot pan. Heat 1 tablespoon of it in a wide frying pan over medium-high heat until it shimmers. Lay in 4 cutlets and leave them alone for 2 minutes, until golden underneath, then turn and cook for 1 to 2 minutes more, until the second side is golden too. They will not be cooked through yet, and that is what you want. Lift them onto a plate.',
        'Add the second tablespoon of oil and sear the other 4 cutlets the same way. If the pan is darkening fast, turn the heat down a notch.',
      ],
    },
    {
      heading: 'Build the sauce',
      items: [
        'Turn the heat down to medium. There should be about a tablespoon of fat left in the pan; if there is much more, spoon some out, because extra oil is what makes this sauce greasy. Add the shallot and cook, stirring, for 3 minutes, until soft and translucent.',
        'Add the garlic, tomato purée, oregano, thyme and chili flakes and stir for 1 minute, until the garlic smells sweet and the purée has darkened to a brick red. Keep it moving so the garlic does not brown.',
        'Pour in the stock and scrape up every browned bit from the bottom of the pan. That is where most of the flavour is. Let it bubble for 2 minutes, until it has reduced a little. Drop the pasta into its boiling water now and set a timer for 1 minute less than the packet says. If your pasta cooks in under 9 minutes, such as tagliatelle, wait and drop it in when the chicken goes back into the sauce.',
        'Stir in the cream and the sun-dried tomatoes and bring back to a gentle simmer. Cook for 2 to 3 minutes, stirring now and then, until it has thickened slightly, to about the consistency of single cream. Do not take it further: it keeps thickening while the chicken finishes, and again when the cheese and pasta go in.',
      ],
    },
    {
      heading: 'Finish the chicken in the sauce',
      items: [
        'Lay the cutlets back in the sauce with any juices from the plate; a little overlap is fine. Turn the heat to low so the sauce only just bubbles, and cook for 2 to 4 minutes, turning them once, until the thickest cutlet reads 74°C on a probe thermometer. Start checking after 2 minutes, because thin cutlets go from juicy to dry quickly. Without one, cut into the thickest: the juices should run clear and there should be no pink.',
        'Lift the chicken onto a board to rest. It stays juicy while you finish the pasta.',
        'Before you drain the pasta, scoop out a mugful, about 250ml, of its cooking water.',
      ],
    },
    {
      heading: 'Cheese off the heat, then the pasta',
      items: [
        'Take the pan off the heat. Stir in the spinach, if using, until it wilts, then add the cheese a handful at a time, stirring until each melts in. If it clumps instead of melting, set the pan over the lowest heat for a few seconds, stirring, and take it off again before it bubbles. Boiling cheese is what makes it go grainy and stringy and pushes the fat out, so the pan stays off the heat from here on.',
        'Drain the pasta and tip it into the sauce with 4 tablespoons of the pasta water. Toss for 1 minute, until every piece is glossy and coated. The starch in the water is what binds the sauce and makes it cling. Keep adding pasta water a splash at a time until the sauce flows loosely around the pasta rather than sticking to it, as it tightens on the plate; a splash also brings it back together if it ever looks oily.',
        'Taste and season with salt and pepper. Slice each cutlet into thick strips, lay them over the pasta, spoon over any sauce left in the pan, and scatter with the basil. Serve straight away.',
      ],
    },
  ],

  nutrition: { calories: 752, protein: 52, carbs: 57, fat: 35 },
  flavorProfile: { sweet: 2, salty: 3, sour: 2, bitter: 0, umami: 4, spicy: 1 },

  isVegetarian: false,
  isVegan: false,
  isGlutenFree: false,
  isDairyFree: false,

  quote:
    'Thin golden cutlets finished in a creamy sauce that is rich but sharp with sun-dried tomato, over pasta that holds on to every drop.',
  description:
    'Marry Me Chicken is an Italian-American skillet dinner: golden chicken in a sauce of cream, garlic, chili, grated hard cheese and sun-dried tomatoes, with the jar\'s own oil used to sear the meat. It is rich, but the tomatoes keep it sharp enough that you want the next forkful. This version is built so it cannot go wrong. The breasts are halved into thin, even cutlets that cook through together and stay juicy, the cheese goes in off the heat so the sauce stays smooth instead of splitting, and the pasta is tossed through with its starchy water so the sauce clings rather than pooling. There is no wine anywhere: the stock lifts the browned bits off the pan and carries the flavour on its own.',
  attribution: 'A Nieves\'s Kitchen take on an Italian-American favourite',

  headnoteIngredients:
    'Parmigiano Reggiano and Grana Padano are always made with calf rennet, so use a vegetarian Italian-style hard cheese or a halal-certified one: it grates and melts the same way. Grate it yourself, finely, since the powdery ready-grated kind does not melt smoothly. For the stock, buy halal-certified cubes, or check the ingredients for anything animal-derived; vegetarian cubes are a good bet, but still check them for alcohol. Use double cream rather than single: its higher fat is what lets it simmer with the tomatoes without curdling.',
  headnoteInstructions:
    'Start the pasta water before anything else and do all the chopping first, because once the chicken is seared the sauce moves quickly. Three things keep it foolproof: cutlets of an even thickness, only a tablespoon of fat in the pan when the sauce starts, and the cheese stirred in off the heat. The pasta goes into its water as the stock goes into the pan, so both are ready together.',

  equipment: [
    'A wide frying pan or sauté pan, 28 to 30cm, with sides deep enough to toss the pasta in. A smaller pan works if you sear in three batches and toss the pasta back in its own pot with the sauce.',
    'A probe thermometer, the surest way to catch the chicken at 74°C. Without one, cut into the thickest cutlet and check the juices run clear.',
  ],

  tips: [
    'Even thickness matters more than anything. Halving the breasts and tapping the thick ends flat means every cutlet is done at the same moment, and none goes dry waiting for the others.',
    'Sear for colour, not to cook through. The cutlets finish gently in the sauce, which is what keeps them juicy, so pull them while they are still underdone in the middle.',
    'Measure the jar oil instead of pouring a glug, and spoon off any excess before the shallot goes in. Too much oil in a cream sauce is what floats to the top as a greasy slick.',
    'If the sauce ever looks oily or starts to split, take it off the heat and stir in a splash of pasta water or stock. It comes back smooth in seconds.',
    'Taste before you season. The stock cube and the cheese both bring salt. If the sauce tastes a little sharp from the tomatoes, a few drops of honey round it out.',
    'Salting ahead pays off if you think of it. Season the cutlets in the morning and leave them uncovered in the fridge for up to a day, then pat dry and flour as normal. They will be seasoned all the way through.',
  ],

  substitutions: [
    'Chicken thighs: use 6 boneless, skinless thighs, about 700g, opened out flat. They are juicier and more forgiving. Sear them for 3 to 4 minutes a side, then simmer in the sauce for 5 to 6 minutes, until they read 74°C.',
    'Lighter sauce: swap half the double cream for evaporated milk. It holds up to simmering without splitting and saves about 55 kcal a serving, though the sauce is a little less silky.',
    'No sun-dried tomato oil? Use olive oil, and add a little extra tomato purée for depth.',
    'For gluten-free, dust the chicken in cornflour instead of plain flour and use a gluten-free pasta. Check the stock cube, as some contain wheat.',
  ],

  variations: [
    'Orzo cooked in the sauce, in one pan: after the cutlets come out to rest, stir 250g orzo, 500ml more hot stock and 150ml water into the sauce. Simmer gently for 10 to 12 minutes, stirring often so it does not stick, until the orzo is tender and creamy, adding a splash of water if it gets thick. Take it off the heat, stir in the cheese, then lay the sliced chicken on top.',
    'With mash: skip the pasta and serve the cutlets and sauce over buttery mashed potato. Leave out the pasta water and loosen the sauce with a splash of stock instead if it gets thick.',
    'With crusty bread: serve the chicken in its sauce straight from the pan, with bread for wiping it up.',
    'Roasted red peppers: stir 2 jarred roasted red peppers, drained and sliced, into the sauce with the sun-dried tomatoes. They bring a sweet, smoky note.',
    'Lemon: grate the zest of half a lemon over the finished plates. It cuts the richness without making the sauce sour.',
  ],

  storage:
    'Keeps in a sealed container in the fridge for up to 2 days. Reheat gently in a pan over a low heat with a splash of water or stock, stirring, until hot all the way through. Do not let it boil, or the sauce can split. It does not freeze well, as the cream sauce turns grainy when thawed.',

  dropcap: true,

  image: 'https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?w=1200&q=80',
  imageIsStock: true,
};

export default recipe;
