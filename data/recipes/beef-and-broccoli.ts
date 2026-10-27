// data/recipes/beef-and-broccoli.ts
import type { RecipeInput } from './_types';

const recipe: RecipeInput = {
  title: 'Beef and Broccoli',
  country: 'China',
  featuredIngredients: ['beef'],
  category: 'main',
  difficulty: 'Easy',
  servings: 3,
  time: { active: 35, total: 65 },
  yield: 'Serves 3 with rice',
  tags: ['high-protein', 'comfort food'],

  region: 'East Asia',
  coordinates: { lat: 22.25, lng: 112.79 },
  influences: ['China', 'United States of America'],

  ingredients: [
    {
      heading: 'The beef',
      items: [
        { name: 'flank (bavette) or rump steak, in one piece, trimmed of any thick fat', amount: 450, unit: 'g', note: 1 },
        { name: 'bicarbonate of soda, level', amount: 0.5, unit: 'tsp', note: 2 },
        { name: 'cold water', amount: 3, unit: 'tbsp' },
        { name: 'light soy sauce', amount: 2, unit: 'tsp', note: 3 },
        { name: 'cornflour', amount: 2, unit: 'tsp' },
        { name: 'neutral oil', amount: 1, unit: 'tbsp' },
      ],
    },
    {
      heading: 'The broccoli',
      items: [
        { name: 'broccoli (about 1 large head), florets plus the peeled stalk', amount: 400, unit: 'g', note: 4 },
        { name: 'salt, for the blanching water', amount: 2, unit: 'tsp' },
      ],
    },
    {
      heading: 'The sauce',
      items: [
        { name: 'oyster sauce', amount: 3, unit: 'tbsp', note: 3 },
        { name: 'light soy sauce', amount: 1, unit: 'tbsp', note: 3 },
        { name: 'dark soy sauce', amount: 1, unit: 'tbsp', note: 3 },
        { name: 'light brown soft sugar', amount: 1, unit: 'tbsp', note: 5 },
        { name: 'rice vinegar', amount: 1, unit: 'tsp' },
        { name: 'toasted sesame oil', amount: 1, unit: 'tsp' },
        { name: 'white pepper', amount: 0.25, unit: 'tsp' },
        { name: 'cornflour', amount: 1, unit: 'tbsp' },
        { name: 'low-salt beef stock, cool', amount: 120, unit: 'ml', note: 6 },
      ],
    },
    {
      heading: 'The stir-fry',
      items: [
        { name: 'neutral oil, for cooking', amount: 3, unit: 'tbsp' },
        { name: 'garlic cloves, finely chopped', amount: 5, unit: '' },
        { name: 'fresh ginger, finely grated', amount: 1, unit: 'tbsp' },
      ],
    },
    {
      heading: 'To finish',
      items: [
        { name: 'toasted sesame seeds', amount: 1, unit: 'tsp' },
        { name: 'sliced fresh green chili and coriander, optional', amount: 0, unit: '' },
        { name: 'chili oil, to serve (optional)', amount: 0, unit: '', note: 7 },
        { name: 'steamed jasmine rice, to serve', amount: 0, unit: '' },
      ],
    },
  ],

  steps: [
    {
      heading: 'Before you start',
      items: [
        'Put the steak in the freezer for 30 minutes, until it feels firm at the edges but still gives a little in the middle. Half-frozen beef holds still under the knife, so even an ordinary kitchen knife cuts clean, thin slices. Do the next three steps while it firms up.',
        'If you are making the stock from a cube, make it up with twice the water the packet says, measure out 120ml and leave it to cool.',
        'Cut the broccoli into florets about 4cm across, splitting any big ones down through the stalk so they are all a similar size. Peel the tough skin off the main stalk and slice it on an angle into 5mm coins, so it cooks in the same time as the florets. Finely chop the garlic, grate the ginger, and keep them together in a small bowl.',
        'Stir all the sauce ingredients except the stock together in a jug until no lumps of cornflour remain, then stir in the stock. It must be cool or barely warm: cornflour stirred into hot stock sets into lumps.',
      ],
    },
    {
      heading: 'Slice and velvet the beef',
      items: [
        'Look closely at the steak and you will see fine parallel lines running through it: that is the grain. On flank it runs the length of the steak, so first cut the steak along those lines into strips about 5cm wide. Then turn each strip and slice straight across the lines, with the knife angled slightly, into slices about 5mm thick. Cutting across the grain is what makes it tender to bite. On rump the grain can change direction, so turn the piece as you go to keep cutting across it.',
        'Put the slices in a bowl with the bicarbonate of soda and the 3 tablespoons of cold water, and massage them with your fingers for about 30 seconds, until the water has been absorbed. Leave for 15 minutes. The bicarb is what keeps takeaway beef so silky.',
        'While the beef sits, bring about 2 litres of water to the boil in a large pan with the 2 teaspoons of salt, and get the rice cooking so it is ready when the stir-fry is.',
        'After the 15 minutes, mix in the 2 teaspoons of light soy and the 2 teaspoons of cornflour until every slice has a thin, even coat, then stir in the tablespoon of oil, which stops the slices clumping in the pan.',
      ],
    },
    {
      heading: 'Blanch the broccoli',
      items: [
        'When the water is at a rolling boil, tip in the broccoli and boil it for 1 minute, until it turns bright green and the tip of a knife slides into a piece of stalk with a little resistance. Drain it well in a colander.',
        'Spread the broccoli out on a tray or a large plate in a single layer and leave it to steam dry for 2 to 3 minutes. Do not cool it under the tap: water clinging to the florets runs into the sauce and thins it.',
      ],
    },
    {
      heading: 'Sear hard, in batches',
      items: [
        'Line up the broccoli, the beef, the garlic and ginger, the sauce and a large empty bowl beside the hob. Set a wok or your largest frying pan over the highest heat with 1 teaspoon of the cooking oil. When the oil shimmers, add the broccoli and toss it for about 1 minute, until it is dry and catching brown in a few spots. Tip it into the large bowl.',
        'Add 1 tablespoon of the oil to the pan, still on the highest heat, and wait until it is smoking. Lay in half the beef, separating the slices so they lie flat in one layer with a little space between them, and leave them completely alone for about 2 minutes, until the undersides are deep brown and the edges have gone crisp. Turn them and cook for 30 seconds more, then tip them into the bowl with the broccoli.',
        'Leave the empty pan on the highest heat for about 1 minute, until it smokes again, then sear the rest of the beef the same way with another tablespoon of oil. Crowded beef lets out its juices and stews grey instead of crisping, so if your pan is smaller than 28cm across or the slices will not fit in one layer, use three batches and a little extra oil. If dark bits of marinade start to burn on the pan, wipe it out with a wad of kitchen paper held in tongs before the next batch.',
      ],
    },
    {
      heading: 'Sauce and toss',
      items: [
        'Turn the heat down to medium. On an electric or induction hob, lift the pan off the heat for 30 seconds if it is still smoking. Add the last 2 teaspoons of oil, then the garlic and ginger, and stir for 20 to 30 seconds, until they smell fragrant and are only just turning pale gold.',
        'Stir the sauce again, because the cornflour sinks to the bottom, and pour it in. Keep stirring as it bubbles for about 1 minute, until it turns from cloudy to glossy and coats the back of a spoon.',
        'Turn the heat back up to high, tip in the beef and broccoli with every drop of juice from the bowl, and toss for about 30 seconds, just until everything is hot and coated, so the beef keeps its crisp edges. The sauce should cling to each piece, with only a little left glossing the pan. If it looks thick and gluey, loosen it with a tablespoon or two of water.',
        'Serve straight away over rice, scattered with the sesame seeds, with green chili and coriander piled on top and chili oil on the side if you like.',
      ],
    },
  ],

  nutrition: { calories: 540, protein: 37, carbs: 22, fat: 33 },
  flavorProfile: { sweet: 2, salty: 4, sour: 1, bitter: 1, umami: 5, spicy: 1 },

  isVegetarian: false,
  isVegan: false,
  isGlutenFree: false,
  isDairyFree: true,

  quote:
    'Silky beef seared hard until its edges crisp, bright, just-tender broccoli and a dark, glossy garlic and oyster sauce that clings to every piece and leaves nothing pooling on the plate.',
  description:
    'Beef and broccoli is the American takeaway\'s version of the Cantonese stir-fry of beef with gai lan, made with the round-headed broccoli that was far easier to buy in America. Done well it is three things at once: beef that is silky inside with crisp, browned edges, broccoli that is bright green with a little bite left in it, and a dark, glossy, garlicky sauce that coats every piece instead of sitting in a puddle underneath. This version is built so none of those is left to luck. The steak is half-frozen so it slices thin, velveted with a pinch of bicarbonate of soda and a little cornflour, then seared hard in a smoking pan, in batches and left alone, until the edges catch and crisp. The broccoli gets one minute in boiling water, steams dry, then a minute in the hot wok. The sauce leans on oyster sauce and two soy sauces, with a splash of rice vinegar for brightness and only as much stock as it takes to coat. Ginger goes in alongside the garlic, and green chili, coriander and a spoon of chili oil go on top for anyone who wants them.',
  attribution: 'A Nieves\'s Kitchen take on a Chinese-American takeaway classic',

  headnoteIngredients:
    'Oyster sauce carries this dish, with light and dark soy alongside it. Dark soy sauce is thicker and less salty than light, and it gives the sauce its deep mahogany colour and gloss. The nutrition is for the stir-fry alone, without the rice or chili oil.',
  headnoteInstructions:
    'Everything that takes time happens before the pan goes on. The beef firms up in the freezer while you cut the broccoli and mix the sauce, then sits in its bicarb while the water comes to the boil and the rice cooks. The cooking itself takes about 10 minutes and does not pause, so have everything lined up by the hob first. Sear on the highest heat your hob has, in batches, leaving the beef alone until the edges crisp, and turn the heat down only for the garlic.',

  equipment: [
    'A wok or a large, heavy frying pan, 28cm or wider, so half the beef fits in one layer. Carbon steel, cast iron and stainless steel hold the most heat for searing, though a good nonstick pan works too as long as you heat it with its oil in, never empty.',
  ],

  tips: [
    'Half-freezing is the whole trick to thin slices. Thirty minutes firms the steak enough that it stops sliding about, and then any sharp knife cuts even 5mm slices. Forgot? Even 15 minutes helps.',
    'For crisp edges, the pan must be smoking, the slices in one layer with space around them, and your hands off for the first 2 minutes. Stirred or crowded beef never browns, which is why it goes in batches with a minute for the pan to get its heat back in between.',
    'Dry broccoli makes a sauce that clings. Water left on blanched broccoli runs into the sauce and thins it, so drain it well, spread it out to steam dry, and skip the cold-water rinse.',
    'The sauce is ready when it turns from cloudy to glossy. Cornflour needs a proper bubble to thicken and lose its raw taste, and the sauce tightens a little more on the plate, so slightly loose in the pan is right.',
    'Velvet the beef ahead if it suits you. Once the soy, cornflour and oil are mixed in, it keeps covered in the fridge overnight, and dinner is then 10 minutes of cooking.',
  ],

  notes: [
    'Steak: flank, sold as bavette, has a long grain that is easy to see and slice across. Rump, sirloin or skirt work too, sliced the same way; avoid stewing cuts like chuck, which stay chewy in a fast stir-fry.',
    'Bicarbonate of soda: not baking powder. Measure it level, because more turns the beef spongy and soapy.',
    'Oyster and soy sauces: check the labels. No dark soy? Use 2 more teaspoons of light soy and half a teaspoon more sugar. For gluten-free, use tamari and a gluten-free oyster sauce.',
    'Broccoli: Tenderstem works too. Blanch it for 1 minute and carry on exactly the same way.',
    'Sugar: honey works, a tablespoon for a tablespoon, and gives an even glossier sauce. It catches faster, so keep the sauce moving.',
    'Stock: use a low-salt halal stock, or a halal cube made up at half strength, since the sauces already bring the salt. Water works too, a little less rounded.',
    'Chili oil: my favourite is Lee Kum Kee chili oil, which is spicier with a great flavour; Lao Gan Ma chili crisp is good too. Some chili oils contain meat, so check the label.',
  ],

  variations: [
    'Mongolian beef: velvet the beef the same way, then toss it in 3 tablespoons of cornflour instead of 2 teaspoons. Heat 1cm of oil in a frying pan to 180°C, when a cube of bread browns in 30 seconds, and shallow fry the beef in three batches for about 2 minutes each, until crisp at the edges. Drain on a rack. Make the sauce with 3 tablespoons of brown sugar instead of 1 and 80ml of stock instead of 120ml, fry 6 dried red chilies with the garlic and ginger, and swap the broccoli for a bunch of spring onions cut into 5cm lengths. Toss the crisp beef through the sauce off the heat so the coating stays crunchy.',
    'One pan for the broccoli: skip the blanching. Heat 1 tablespoon of oil in the wok over high heat, toss the broccoli in it for 1 minute, then add 4 tablespoons of water and cover for 1 to 2 minutes, until bright green and a knife meets a little resistance in the stalk. Uncover, let any water boil away, tip it into the bowl and carry on with the beef. Slightly less even, but one pan fewer to wash.',
    'Gai lan (Chinese broccoli) in place of broccoli, closer to the Cantonese original and pleasantly bitter. Use 400g: trim the dry ends, peel any stems thicker than your thumb, and cut into 5cm lengths, keeping stems and leaves apart. Blanch the stems for 1 minute, adding the leaves for the last 20 seconds, with a teaspoon of oil in the water to keep them glossy, then carry on as written.',
    'Black bean: rinse 1 tablespoon of fermented black beans, crush them roughly and fry them with the garlic and ginger. They are salty, so cut the light soy in the sauce down to 2 teaspoons.',
    'Hotter in the pan: fry a sliced red chili with the garlic and ginger.',
  ],

  storage:
    'Best straight from the pan, while the broccoli is bright and the beef edges are crisp. Leftovers keep covered in the fridge for up to 2 days. Reheat in a hot pan with a splash of water for 2 to 3 minutes, tossing until steaming; the broccoli will be softer and darker but it still tastes good. It does not freeze well, as the broccoli turns soggy. The mixed sauce keeps in a covered jar in the fridge for 2 days; stir it well before using.',

  dropcap: true,

  image: 'https://images.unsplash.com/photo-1783375175952-705a0600e05c?w=1200&q=80',
  imageIsStock: true,
};

export default recipe;
