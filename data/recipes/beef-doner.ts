// data/recipes/beef-doner.ts
import type { RecipeInput } from './_types';

const recipe: RecipeInput = {
  title: 'Homemade Beef Döner',
  country: 'Turkey',
  featuredIngredients: ['beef'],
  category: 'main',
  difficulty: 'Easy',
  servings: 4,
  time: { active: 55, total: 75 },
  yield: 'Serves 4, one loaded flatbread each',
  tags: ['high-protein', 'comfort food', 'meal-prep friendly'],

  region: 'Middle East',
  coordinates: { lat: 40.1885, lng: 29.061 },

  ingredients: [
    {
      heading: 'The döner',
      items: [
        { name: 'beef mince, 15 to 20% fat', amount: 800, unit: 'g', note: 1 },
        { name: 'small onion, for its juice', amount: 1, unit: '' },
        { name: 'garlic cloves, finely grated', amount: 3, unit: '' },
        { name: 'harissa paste from a jar', amount: 2, unit: 'tbsp' },
        { name: 'full-fat Greek yogurt', amount: 2, unit: 'tbsp' },
        { name: 'fine salt', amount: 1.5, unit: 'tsp' },
        { name: 'ground cumin', amount: 1.5, unit: 'tsp' },
        { name: 'ground coriander', amount: 1, unit: 'tsp' },
        { name: 'sweet paprika', amount: 1, unit: 'tsp' },
        { name: 'dried oregano', amount: 1, unit: 'tsp' },
        { name: 'black pepper', amount: 0.5, unit: 'tsp' },
        { name: 'chili flakes (pul biber if you have it)', amount: 0.5, unit: 'tsp' },
      ],
    },
    {
      heading: 'The tray of peppers and onions',
      items: [
        { name: 'large onions, cut into wedges', amount: 2, unit: '' },
        { name: 'red pepper, cut into wide strips', amount: 1, unit: '' },
        { name: 'long green peppers, left whole', amount: 8, unit: '', note: 2 },
        { name: 'olive oil', amount: 2, unit: 'tbsp' },
        { name: 'salt, a large pinch', amount: 0, unit: '' },
      ],
    },
    {
      heading: 'Garlic yogurt sauce',
      items: [
        { name: 'full-fat Greek yogurt', amount: 200, unit: 'g' },
        { name: 'mayonnaise', amount: 1, unit: 'tbsp' },
        { name: 'garlic clove, finely grated', amount: 1, unit: '' },
        { name: 'lemon juice', amount: 2, unit: 'tsp' },
        { name: 'dried mint', amount: 0.5, unit: 'tsp' },
        { name: 'salt, a pinch', amount: 0, unit: '' },
      ],
    },
    {
      heading: 'Chili sauce',
      items: [
        { name: 'honey', amount: 1, unit: 'tsp' },
        { name: 'Lao Gan Ma chili crisp, or half as much for a milder sauce', amount: 1, unit: 'tbsp', note: 3 },
        { name: 'rice or cider vinegar, or lemon juice', amount: 1, unit: 'tbsp', note: 4 },
        { name: 'ketchup', amount: 1, unit: 'tbsp' },
        { name: 'water, or as much as it takes to loosen it', amount: 1, unit: 'tbsp' },
      ],
    },
    {
      heading: 'To serve',
      items: [
        { name: 'khubz (Arabic flatbreads), or pittas', amount: 4, unit: '', note: 5 },
        { name: 'tomatoes, sliced', amount: 2, unit: '' },
        { name: 'shredded lettuce, a couple of handfuls', amount: 0, unit: '' },
        { name: 'coriander or parsley, chopped', amount: 0, unit: '' },
        { name: 'pickled chilies or sliced fresh green chili (optional)', amount: 0, unit: '' },
      ],
    },
  ],

  steps: [
    {
      heading: 'Before you touch the mince',
      items: [
        'Put one oven shelf just above the middle and another at the top, about 10cm below the grill, then heat the oven to 220°C (200°C fan). Tear off five sheets of baking paper, each about 40cm long: four to roll the meat up in, and one to lay on top while you roll it out.',
        'Make the garlic yogurt first, so the garlic has time to mellow into it. Stir the yogurt, mayonnaise, grated garlic, lemon juice, dried mint and a pinch of salt together, then put it in the fridge.',
        'For the chili sauce, stir the honey, chili oil, vinegar or lemon juice and ketchup together in a small bowl. Add the water a little at a time until it is as loose as you like it, and set it aside. It makes about 4 tablespoons, a good spoonful per wrap, so double it if you like plenty of sauce.',
        'Cut each large onion into 8 wedges, keeping a little of the root on each so the layers hold together. Cut the red pepper into strips about 3cm wide and leave the long green peppers whole.',
      ],
    },
    {
      heading: 'The meat paste',
      items: [
        'Grate the small onion over a large mixing bowl, then squeeze the pulp hard in your fist so the juice runs into the bowl. You should get about 2 tablespoons. Throw the pulp away: the juice carries the onion flavour into the meat, while the pulp would tear the thin sheets.',
        'Add the mince, garlic, harissa, yogurt, salt, spices and oregano to the onion juice. Knead hard with one hand for about 5 minutes, squeezing and folding, until it stops looking like strands of mince and turns into a smooth, sticky paste that clings to your fingers. A food processor does the same in about 1 minute of pulsing. It is ready when a walnut-sized lump pressed onto your palm stays put when you turn your hand over.',
        'To check the seasoning, fry a teaspoon of the paste in a dry pan for about 1 minute, taste it, and add a pinch more salt to the bowl if it needs it. If you have time, cover the bowl and chill it for 30 minutes, which makes the paste roll out a little more cleanly. If not, carry straight on.',
      ],
    },
    {
      heading: 'Roll it thin, roll it up',
      items: [
        'Divide the paste into 4 equal portions, a little over 200g each. Put one portion on a sheet of baking paper towards one short end, flatten it with your palm, lay the spare sheet over it and roll it out with a rolling pin into a rectangle about 25 by 30cm and about 3mm thick. Leave a bare strip of paper about 10cm long at the far end. Ragged edges are fine: they become the crispiest bits.',
        'Peel off the top sheet slowly, keeping it low and close to the meat so it does not tear the paste, and keep it for the next portion. Starting at the short end with the meat, roll the meat up together with its paper into a snug roll, so the paper spirals between the layers of meat. The bare strip of paper wraps round the outside and holds it shut. The paper keeps the layers apart, so the heat gets into every one of them and they unroll later as clean sheets.',
        'Lay the roll seam side down on your largest baking tray (the big tray that came with your oven is ideal), then repeat with the other three portions, leaving a little space between the rolls.',
      ],
    },
    {
      heading: 'Roast, then grill',
      items: [
        'Arrange the onion wedges, red pepper and green peppers around the rolls. Drizzle the vegetables with the olive oil, scatter over a large pinch of salt and toss them with your hands so they are coated. If they will not fit around the rolls in a single layer, put the rest on a second tray on the top shelf: crowded peppers steam instead of charring.',
        'Roast on the shelf above the middle for 20 minutes, until the rolls feel firm all the way along when you press them and the onions are soft and starting to colour at the tips. While they roast, warm the flatbreads in a dry frying pan for about 20 seconds a side and stack them in a clean tea towel, then slice the tomatoes and shred the lettuce.',
        'Take the tray out and turn the grill to high. Lift the rolls onto a board with tongs and unroll them carefully, because hot fat and steam are trapped inside. The meat comes away from the paper as a cooked sheet. Throw the paper away. The innermost turn may still be a little pink after 20 minutes. That is fine, because the grill finishes it, as long as those pieces go on top of the pile.',
        'If you used two trays, tip all the vegetables together onto the bigger one. They have shrunk as they roasted and will fit now that the rolls are off it.',
        'Stack the sheets two at a time and cut them into ribbons about 2cm wide with a large knife, or tear them into strips. Pile them loosely over the vegetables along with any juices from the board, with the ribbons from the middle of the rolls on top. Do not press them flat: the bits that stick up are the bits that crisp.',
        'Slide the tray onto the top shelf and grill for 3 to 5 minutes, until the edges of the meat are crisp, browned and a little dried out and the peppers are blistered in places. Watch it from about 3 minutes on, because the edges go from crisp to burnt quickly. Minced beef must be cooked right through: there should be no pink left anywhere, or 71°C on a probe thermometer.',
      ],
    },
    {
      heading: 'Build the wraps',
      items: [
        'Spread a good spoonful of garlic yogurt over each warm flatbread. Pile on lettuce and tomato, then the meat, onions and peppers. Stir the chili sauce, since the oil settles, and spoon it over. Scatter with coriander or parsley, add pickled chilies or fresh green chili if you like, roll up tightly and eat straight away.',
      ],
    },
  ],

  nutrition: { calories: 890, protein: 51, carbs: 69, fat: 44 },
  flavorProfile: { sweet: 2, salty: 3, sour: 2, bitter: 1, umami: 4, spicy: 3 },

  isVegetarian: false,
  isVegan: false,
  isGlutenFree: false,
  isDairyFree: false,

  quote:
    'Spiced beef rolled out paper-thin, rolled up inside its baking paper and roasted beside peppers and onions, then flashed under the grill until every edge crisps.',
  description:
    'This is döner made at home with no spit and no loaf tin. Beef mince is seasoned, kneaded to a smooth paste, rolled out thin between sheets of baking paper and then rolled up inside the paper like a Swiss roll. The paper spirals between the layers, so after 20 minutes in a hot oven every layer has set and unrolls as a thin sheet of meat. Long green peppers, onion wedges and red pepper roast on the same tray, then the meat is cut into ribbons and goes under the grill with them for a few minutes, until the edges turn crisp and dry the way they do on a spit. Harissa from a jar goes into the mince for colour and warmth. The chili sauce is built on Lao Gan Ma chili oil, sharpened with vinegar and rounded with a little honey and ketchup, and it sits against a cool garlic yogurt. I usually wrap it in khubz, the soft Arabic flatbread, though pitta is good too.',
  attribution: 'A Nieves\'s Kitchen take on Turkish döner',

  headnoteIngredients:
    'Use beef mince with 15 to 20% fat. Lean mince dries out in sheets this thin and loses the juiciness döner should have. Ideally, add the harissa: a jarred one is all you need, and it brings colour, warmth and a little garlic in one spoonful. Two large onions on the tray sounds like a lot for four, but they shrink as they roast and end up as soft, sweet strands in every wrap.',
  headnoteInstructions:
    'Make both sauces and cut the vegetables before you touch the mince. After that it is kneading, rolling and 20 minutes in the oven, with the bread warmed while you wait. The kneading matters more than anything else: it is what turns mince into döner rather than a crumbly burger.',

  equipment: [
    'Non-stick baking paper, enough for five sheets about 40cm long. The meat is rolled up inside it, so it needs to be the silicone-coated kind: greaseproof paper and foil both stick to the meat.',
    'A rolling pin, or any smooth, straight-sided jar or bottle, to roll the meat out thin.',
  ],

  tips: [
    'Knead until it is a paste. Mince that is only mixed cooks into crumbly strands that fall apart when you unroll it. Kneaded properly, it sets into a sheet that holds together and slices like döner.',
    'Roll it thinner than seems sensible. At about 3mm the rolls are all but cooked in 20 minutes, the grill finishes them, and the meat eats like shaved döner. Any thicker and it is closer to a flat burger.',
    'Juice the onion, do not grate it in. The juice seasons the meat, while the pulp leaves wet pockets that tear the sheets as you unroll them.',
    'Fry a little of the paste and taste it before you roll anything. Once the meat is rolled up in paper, it is too late to fix the salt.',
    'Keep the root on the onion wedges. They hold together on the tray and char at the tips, rather than falling into thin strands that burn under the grill.',
    'Stay by the grill. Three minutes is often enough, and the crisp, dried edges you want are only a minute away from burnt.',
  ],

  notes: [
    'Mince: lamb mince, or half lamb and half beef, works exactly the same way for a richer, more traditional döner.',
    'Long green peppers: the Turkish sivri kind, sold in Turkish and Middle Eastern grocers. No luck? A handful of Padrón peppers, or 2 green peppers cut into wide strips, roast the same way.',
    'Chili crisp: the classic Lao Gan Ma Spicy Chili Crisp is meat-free, but some jars in the range contain meat, so check the label. No chili crisp? Use 1 tablespoon of harissa for a smokier, North African chili sauce.',
    'Vinegar or lemon: both do the same job. Lemon tastes fresher and vinegar tastes sharper.',
    'Gluten-free: skip the bread and serve the meat, vegetables and garlic yogurt over rice or a big salad, and check the chili crisp label.',
  ],

  variations: [
    'Döner fries: pile the crisp meat and roasted vegetables over a tray of hot chips and spoon both sauces over the top.',
    'İskender style: cut warm flatbread into squares and cover with the meat. Spoon over a quick tomato sauce, made by simmering a tablespoon of tomato paste with a knob of butter and a splash of water for 2 to 3 minutes, then add garlic yogurt on the side and a drizzle of melted butter over everything.',
    'As a bowl: serve the meat and vegetables over rice with both sauces, lettuce and tomato, and plenty of coriander.',
  ],

  storage:
    'The cooked meat keeps in a sealed container in the fridge for up to 3 days. Reheat it in a hot dry frying pan, or in the air fryer at 200°C for 3 to 4 minutes, until the edges crisp again. To freeze, spread the cooked ribbons flat in a freezer bag and freeze for up to 2 months, then crisp them straight from frozen in a hot pan for a fast wrap. The garlic yogurt keeps for 2 days in the fridge and the chili sauce for 3 to 4.',

  dropcap: true,

  image: 'https://images.unsplash.com/photo-1699728088614-7d1d4277414b?w=1200&q=80',
  imageIsStock: true,
};

export default recipe;
