// data/recipes/zemiakove-placky.ts
import type { RecipeInput } from './_types';

const recipe: RecipeInput = {
  title: 'Zemiakové Placky',
  country: 'Slovakia',
  category: 'side',
  difficulty: 'Easy',
  servings: 4,
  time: { active: 45, total: 55 },
  yield: 'Makes 12 to 14 thin placky, 3 or so each',
  tags: ['comfort food', 'budget-friendly'],

  region: 'Eastern Europe',
  coordinates: { lat: 49.2231, lng: 18.7394 },

  ingredients: [
    {
      heading: 'The batter',
      items: [
        { name: 'floury potatoes, weighed before peeling', amount: 800, unit: 'g', note: 1 },
        { name: 'garlic cloves, finely grated or crushed', amount: 5, unit: '' },
        { name: 'eggs', amount: 2, unit: '' },
        { name: 'plain flour (about 4 heaped tablespoons), plus a little more if needed', amount: 60, unit: 'g', note: 2 },
        { name: 'dried marjoram', amount: 1, unit: 'tbsp', note: 3 },
        { name: 'fine salt', amount: 1, unit: 'tsp' },
        { name: 'black pepper', amount: 0.5, unit: 'tsp' },
      ],
    },
    {
      heading: 'To fry',
      items: [
        { name: 'sunflower oil', amount: 350, unit: 'ml', note: 4 },
        { name: 'salt, for the hot placky', amount: 0, unit: '' },
      ],
    },
    {
      heading: 'To serve',
      items: [
        { name: 'Slovak beef goulash, made ahead, a generous ladle each', amount: 0, unit: '' },
        { name: 'red onion, very thinly sliced', amount: 0.5, unit: '' },
        { name: 'fresh green chili, sliced, and coriander leaves, optional', amount: 0, unit: '' },
      ],
    },
  ],

  steps: [
    {
      heading: 'Before you start',
      items: [
        'Set the goulash over a low heat with the lid on, stirring now and then and adding a splash of water only if it starts to catch, so it is properly hot by the time the first placky come out of the pan. You want it on the thick side here, so it sits on the placky rather than flooding the plate. If it looks brothy, take the lid off for the last 10 minutes and let it bubble down.',
        'Heat the oven to 120°C (100°C fan) and set a wire rack over a tray inside it. This is where the finished placky stay crisp while you fry the rest.',
      ],
    },
    {
      heading: 'The batter',
      items: [
        'Line a bowl with a clean tea towel. Peel the potatoes and grate them on the fine side of a box grater, the small round holes rather than the spiky rasp, straight onto the towel. A food processor with its fine grating disc is quicker. Keep going steadily, because grated potato starts to grey as soon as it meets the air.',
        'Gather up the corners of the towel (see note 5) and twist it hard over the bowl, wringing the potato until barely another drop comes out. Be ruthless, it should feel almost dry and fluffy. Tip the squeezed potato into a clean mixing bowl and leave the liquid where it is.',
        'Leave the potato liquid to stand for 5 minutes so its starch can settle. Meanwhile, pour oil into a large, heavy frying pan to a depth of about 5mm, roughly 250ml in a 28cm pan, set it over a medium heat to warm up, and grate the garlic.',
        'Carefully pour the brown water off the potato liquid. A firm layer of white starch is left at the bottom. Scrape it into the potato, then add the garlic, eggs, flour, salt and pepper, and the marjoram rubbed between your palms to wake it up. Mix well with a fork. You want a thick, sticky batter that sits up on a spoon. If liquid pools around it in the bowl, stir in another tablespoon of flour.',
      ],
    },
    {
      heading: 'Fry them thin',
      items: [
        'Turn the heat under the oil up to medium-high. It is ready when a single shred of potato dropped in sizzles hard straight away, about 180°C if you have a thermometer.',
        'Fry one small spoonful first and taste it. Add more salt, garlic or marjoram to the batter now if it needs it, because this is your only chance.',
        'Drop in 2 heaped tablespoons of batter for each placka, 3 at a time in a 28cm pan, laying the batter in away from you. Straight away spread each one with the back of the spoon into a thin round about 10cm across, no thicker than 5mm and thinner still at the edges. Thin is the whole point. The edges go lacy and crisp, and the middle cooks through before the outside burns.',
        'Leave them alone for about 3 minutes, until the underside is a deep golden brown and the edges are lacy and dark. Flip them with a spatula, steadied with a fork, and fry the second side for 2 to 3 minutes, until it matches. If they colour in under 2 minutes, turn the heat down a notch. Break the first one open: the middle should be soft and cooked through, with no raw, crunchy shreds. If it is not, spread the next ones thinner.',
        'Lift them onto the rack in the oven, never onto kitchen paper, and salt them while they are hot. Fish out any stray shreds before they burn, top the pan up with oil to keep it at about 5mm, and let it come back to temperature before the next batch. Give the batter a stir each time, since it weeps as it sits, and leave behind any liquid that collects at the bottom of the bowl.',
      ],
    },
    {
      heading: 'To the plate',
      items: [
        'Lay three placky, overlapping, in each warm shallow bowl or rimmed plate, and ladle the beef and its thick sauce across the middle, leaving the edges uncovered so they stay crisp. Scatter over the red onion, plus green chili and coriander if you like. Eat straight away, while there is still a crunch at the rim to set against the soft middle soaking up the sauce.',
      ],
    },
  ],

  nutrition: { calories: 375, protein: 8, carbs: 43, fat: 19 },
  flavorProfile: { sweet: 1, salty: 3, sour: 0, bitter: 0, umami: 2, spicy: 1 },

  isVegetarian: false,
  isVegan: false,
  isGlutenFree: false,
  isDairyFree: true,

  quote:
    'Grated potato wrung dry and fried thin until the edges turn to lace, then laid under a ladle of paprika-red goulash with only the crisp rim showing.',
  description:
    'Zemiakové placky are what a Slovak kitchen does with a bag of potatoes: grated fine, wrung dry, bound with egg and a little flour, seasoned with plenty of garlic and dried marjoram, then fried thin in hot oil until the edges go lacy and brown. In Slovakia they are eaten hot from the pan on their own, or with something saucy alongside. I pair them with my goulash, ladled over the top so the middle softens into the paprika sauce while the rim stays crunchy, which makes a plain side into a proper Slovak dinner. The batter turns on one small step most recipes rush. Let the potato water stand for five minutes and a layer of pure white starch settles at the bottom. Stir that back in and the placky hold together on less flour, so they fry thinner, crisper and lighter.',
  attribution: "A Nieves's Kitchen take on Slovak zemiakové placky",

  headnoteIngredients:
    'Use floury potatoes. Their starch is what binds the batter, and waxy or new potatoes give you placky that fall apart in the pan. Dried marjoram is the taste of placky in Slovakia and the Czech Republic, so be generous, and rub it between your palms as it goes in. Slovak cooks often fry these in lard. Sunflower oil gives just as good a crunch and keeps them halal. The nutrition here is for the placky alone, so count the goulash on top separately.',
  headnoteInstructions:
    'The goulash is a recipe of its own and takes a few hours, so make it a day or two ahead, when it tastes better anyway. On the night, get it warming before you touch a potato, because once the batter is mixed it needs to go straight into the pan: it greys and weeps as it sits. Then it is ten minutes of grating and wringing, five minutes for the starch to settle while the oil warms and you deal with the garlic, and about half an hour at the pan in batches of three, with the first batches holding crisp in a low oven.',

  equipment: [
    'A wire rack set over a tray, for draining and keeping the placky warm. Kitchen paper steams the underside soft. The rack from your grill pan works just as well.',
  ],

  tips: [
    'Wring the potatoes harder than feels necessary. Water is what turns placky soggy and makes the oil spit, and a properly squeezed potato needs far less flour to hold together.',
    'Keep the starch. That white paste at the bottom of the potato water is free binder, and it is the reason this batter gets away with only 60g of flour.',
    'Spread them thin. A thick placka stays pale and greasy in the middle while the outside burns. About 5mm, with ragged edges, is what you want.',
    'Get the oil properly hot before each batch. If the batter does not sizzle hard the moment it lands, the placky drink the oil instead of frying in it.',
    'Fry a test spoonful before the first real batch. Garlic, salt and marjoram are easy to fix in the bowl and impossible to fix on the plate.',
    'Salt them the moment they come out of the pan, while the surface is still glistening, so the salt sticks.',
  ],

  notes: [
    'Potatoes: floury ones such as Maris Piper or King Edward.',
    'Gluten-free: swap the flour for 3 tablespoons of potato starch or cornflour and let the batter sit for 5 minutes before frying. The goulash itself has no gluten.',
    'Marjoram: fresh works too. Use about 2 tablespoons, chopped, in place of the tablespoon of dried.',
    'Oil: rapeseed or any neutral vegetable oil works just as well as sunflower. Skip extra virgin olive oil, whose peppery taste fights the marjoram.',
    'Muslin instead of a tea towel: wrap the grated potato in muslin, twist it closed around the handle of a wooden spoon and keep turning the spoon. It gives you far more squeezing power than your hands alone.',
  ],

  variations: [
    'On their own, the simple way: rub each placka with a cut clove of garlic the moment it comes out of the pan, salt it, and eat it standing at the stove.',
    'The pub version: spread the batter right across the pan to make one large, thin placka per person, fry it the same way, turning it with two spatulas, then fold it in half around a ladle of thick goulash.',
    'Smoky: stir 60g of grated smoked cheese into the batter. Check the label for vegetarian or microbial rennet.',
    'Shreddier and crunchier: grate half the potatoes on the coarse side of the grater and half on the fine side.',
    'Half a teaspoon of caraway seeds in the batter, for a more old-fashioned flavour that echoes the caraway in the goulash.',
  ],

  storage:
    'Placky are at their best within minutes of leaving the pan, and the batter does not keep, since it greys and goes watery. Cooked placky keep in the fridge for 2 days. Revive them on a rack in the oven at 220°C (200°C fan) for 6 to 8 minutes, or in an air fryer at 200°C for 3 to 4 minutes, until they crackle again. Never the microwave, which turns them rubbery. They also freeze well, laid flat between sheets of baking paper, for up to a month. Reheat them straight from frozen in the air fryer at 200°C for 6 to 8 minutes.',

  dropcap: true,

  image: 'https://images.unsplash.com/photo-1678684277720-8032257415bc?w=1200&q=80',
  imageIsStock: true,
};

export default recipe;
