// data/recipes/cumin-lamb.ts
import type { RecipeInput } from './_types';

const recipe: RecipeInput = {
  title: 'Cumin Lamb',
  country: 'China',
  featuredIngredients: ['lamb'],
  category: 'main',
  difficulty: 'Easy',
  servings: 3,
  time: { active: 45, total: 100 },
  yield: 'Serves 3 with rice',
  tags: ['high-protein', 'spicy'],

  region: 'East Asia',
  coordinates: { lat: 34.34, lng: 108.94 },

  ingredients: [
    {
      heading: 'The lamb',
      items: [
        { name: 'boneless lamb shoulder (or a pack of diced shoulder)', amount: 450, unit: 'g', note: 1 },
        { name: 'light soy sauce', amount: 1, unit: 'tbsp', note: 2 },
        { name: 'dark soy sauce', amount: 1, unit: 'tsp', note: 2 },
        { name: 'ground cumin', amount: 1, unit: 'tsp' },
        { name: 'water', amount: 1, unit: 'tbsp' },
        { name: 'cornflour', amount: 1, unit: 'tbsp' },
        { name: 'neutral oil', amount: 1, unit: 'tbsp' },
      ],
    },
    {
      heading: 'The spice mix',
      items: [
        { name: 'cumin seeds', amount: 2, unit: 'tbsp' },
        { name: 'Sichuan peppercorns', amount: 1, unit: 'tsp', note: 3 },
        { name: 'chili flakes, ideally Korean or Sichuan', amount: 2, unit: 'tsp', note: 4 },
        { name: 'salt', amount: 0.5, unit: 'tsp' },
        { name: 'sugar', amount: 0.5, unit: 'tsp' },
      ],
    },
    {
      heading: 'The stir-fry',
      items: [
        { name: 'neutral oil', amount: 2, unit: 'tbsp' },
        { name: 'dried red chilies, snipped in half, seeds shaken out', amount: 6, unit: '', note: 5 },
        { name: 'garlic cloves, thinly sliced', amount: 4, unit: '' },
        { name: 'fresh ginger, finely chopped', amount: 1, unit: 'tbsp' },
        { name: 'red onion, halved and cut into 1cm slices', amount: 1, unit: '', note: 6 },
        { name: 'long green peppers, cut on the diagonal into 2cm pieces', amount: 3, unit: '', note: 7 },
        { name: 'spring onions, cut into 4cm lengths', amount: 4, unit: '' },
      ],
    },
    {
      heading: 'To finish',
      items: [
        { name: 'coriander, a large bunch, stems finely chopped and leaves roughly chopped', amount: 40, unit: 'g' },
        { name: 'fresh green finger chilies, thinly sliced (seeds scraped out for less heat)', amount: 2, unit: '' },
        { name: 'toasted sesame seeds', amount: 1, unit: 'tsp' },
        { name: 'chili oil, to serve (optional)', amount: 0, unit: '', note: 8 },
      ],
    },
    {
      heading: 'Rice',
      items: [
        { name: 'jasmine rice', amount: 200, unit: 'g' },
        { name: 'water', amount: 310, unit: 'ml' },
      ],
    },
  ],

  steps: [
    {
      heading: 'Slice and marinate the lamb',
      items: [
        'Put the lamb in the freezer for 30 to 45 minutes, until it feels firm at the edges but is not frozen through, so it slices thin and clean. A pack of diced shoulder needs only about 20 minutes.',
        'Cut away any thick seams of hard white fat and any tough, silvery sinew, but leave the thinner streaks of fat, which keep shoulder juicy in a hot pan. Slice across the lines of muscle, about 4mm thick, turning the piece as you go since shoulder is several muscles running different ways, then cut any large slices into pieces about 4cm long. Diced shoulder: slice each cube into slabs about 4mm thick.',
        'In a bowl, stir together the light soy sauce, dark soy sauce, ground cumin and the tablespoon of water. Add the lamb and work it with your hands for about a minute, until the liquid has disappeared into the meat. Sprinkle over the cornflour and mix until every piece has a thin, even coat, then stir in the tablespoon of oil. Leave it for 30 minutes at room temperature, or covered in the fridge for up to 8 hours.',
      ],
    },
    {
      heading: 'While the lamb marinates',
      items: [
        'Start the rice. Rinse the jasmine rice in a sieve under the cold tap until the water runs almost clear, then drain it well. Put it in a small pot with a tight lid, add the 310ml of water and bring it to the boil over high heat. Stir once, cover, turn the heat to its lowest and cook for 12 minutes. Take it off the heat and leave it covered for at least 10 minutes; it will sit happily like that until the lamb is ready. A rice cooker works too.',
        'Put the cumin seeds and Sichuan peppercorns in a dry frying pan over medium heat. Shake the pan for 2 to 3 minutes, until the cumin turns a shade darker, smells warm and nutty, and the first few seeds start to crackle. Tip them straight onto a plate so they stop cooking. If any seeds have gone black or the smell turns sharp and acrid, start again: burnt cumin would flavour the whole dish.',
        'Once they are cool, crush all the Sichuan pepper and half the cumin seeds to a coarse powder, in a mortar and pestle, a spice grinder, or with a rolling pin over a freezer bag. Mix them with the rest of the whole cumin seeds, the chili flakes, salt and sugar in a small bowl, and set it by the hob.',
        'Prepare the vegetables and set them out by the hob in the order they go in, because the cooking takes about 15 minutes with no pause: the dried chilies, garlic and ginger together in one bowl, the onion and green peppers in another, then the spring onions, the coriander, the green chilies and the sesame seeds.',
      ],
    },
    {
      heading: 'Sear the lamb, hot and in three batches',
      items: [
        'Open a window or turn on the extractor. Set your largest heavy frying pan (28cm or wider) over the highest heat for 2 to 3 minutes, until it just starts to smoke. Add 2 teaspoons of the oil, swirl it round, then add a third of the lamb and spread it into a single layer with a little space between the pieces. A third looks like very little; that is right, because crowded lamb stews grey instead of browning. It should hiss loudly the whole time. Leave it completely alone for 1 minute, until the underside is deep brown and crisp at the edges, then flip and toss it for 30 seconds to 1 minute, until there is no raw red left on the outside but the middle is still a little pink. Lift it onto a plate.',
        'Let the pan heat back up until it smokes again, about 1 minute, then sear the second and third batches the same way, adding 1 teaspoon of oil before a batch only if the pan looks dry. In a wok or a pan smaller than 28cm, use four batches. If anything on the bottom of the pan has turned black between batches, wipe it out with a wad of kitchen paper held in tongs.',
      ],
    },
    {
      heading: 'Bring it together',
      items: [
        'Take the pan off the heat for 30 seconds to let it drop below smoking, then set it back on medium and add the rest of the oil, about 2 teaspoons. Add the dried chilies, garlic and ginger and stir for 20 to 30 seconds, until the garlic smells sweet and is only just turning pale gold, and the chilies darken a shade.',
        'Turn the heat back up to high. Add the red onion and green peppers and stir-fry for 1 to 2 minutes, until the onion is just softening at the edges and the peppers have blistered in spots but both still snap when you bite one. They get another minute with the lamb, so stop here.',
        'Tip the lamb back in with any juices from the plate and scatter the spice mix over everything. Toss and stir constantly for 1 minute, scraping the bottom of the pan, until the juices have sizzled away, every piece is coated, and the cumin smells toasted rather than raw. If the chili flakes start to look dark brown or the smell turns sharp, take the pan off the heat at once. Taste a piece and add a pinch more salt if it needs it.',
        'Turn off the heat. Add the spring onions and most of the coriander and toss for 10 to 15 seconds, just until they wilt. Pile it onto a warm plate, scatter over the rest of the coriander, the green chilies and the sesame seeds, and serve straight away with the rice, and chili oil on the side if you like.',
      ],
    },
  ],

  nutrition: { calories: 775, protein: 36, carbs: 71, fat: 38 },
  flavorProfile: { sweet: 1, salty: 3, sour: 0, bitter: 1, umami: 3, spicy: 4 },

  isVegetarian: false,
  isVegan: false,
  isGlutenFree: false,
  isDairyFree: true,

  quote:
    'Thin slices of lamb shoulder seared hard in a smoking pan, then tossed with toasted cumin, Sichuan pepper, dried chili, crisp green peppers and a whole bunch of coriander.',
  description:
    'Cumin lamb, ziran yangrou, comes from the Muslim cooking of China\'s northwest, Uyghur and Hui, where lamb, cumin and chili have long gone together, on skewers over coals and in the wok. It is a dry stir-fry: no sauce, just slices of lamb seared until their edges crisp, then coated in toasted cumin, Sichuan pepper and chili and tossed with red onion and long green peppers. This version is built so an ordinary hob can do what a restaurant burner does. It uses shoulder rather than leg, because its fat keeps it juicy; the meat is partly frozen so it slices thin, then seared hard in batches so it browns instead of stewing. Cumin goes in three ways, ground into the marinade, toasted and crushed, and toasted and left whole, and the spice mix gets a full minute in the hot pan so it never tastes raw. Ginger goes in alongside the garlic, and a whole bunch of coriander and fresh green chili are piled on at the end.',
  attribution: 'A Nieves\'s Kitchen take on a classic of China\'s northwest',

  headnoteIngredients:
    'Shoulder is the cut to buy: ask a halal butcher for about 450g boneless, or use a supermarket pack of diced shoulder. The spice mix is the heart of the dish, so it is worth having fresh cumin seeds and Sichuan peppercorns rather than an old jar of each.',
  headnoteInstructions:
    'Freeze, slice and marinate: that is most of the waiting. While the lamb marinates, start the rice, toast and crush the spices and prepare the vegetables, and set everything out by the hob, because from the moment the pan goes on it is about 15 minutes to the table. Use your widest, heaviest frying pan rather than a wok if your hob is an ordinary one, and sear in three small batches even though two would fit at a squeeze: a home hob cannot keep a crowded pan hot.',

  tips: [
    'Use shoulder and slice it thin. Its streaks of fat baste the meat as it sears, so it stays juicy even if it has a few seconds too long, and slicing it thin and across the grain makes it tender in two minutes.',
    'Listen to the pan. A loud, steady hiss means the lamb is searing. If the noise drops to a bubble and grey liquid pools around the meat, the pan is crowded or not hot enough: lift some out, let the liquid boil away, and sear the rest in another batch.',
    'Leave the meat alone for the first minute, so the crust can form. Take it out while the middle is still slightly pink, because it gets another minute when it goes back in with the spices.',
    'Toast the cumin only until it darkens a shade, and give the spice mix its full minute in the hot pan at the end: that is what stops it tasting raw and dusty.',
    'Be generous with the coriander and use the stems as well as the leaves, since the stems carry the most flavour. Adding it off the heat keeps it bright green against the cumin.',
    'Searing this hot makes smoke, and dried chilies in hot oil can make you cough. Get a window open and the extractor going before the pan goes on.',
  ],

  notes: [
    'Lamb: shoulder stays juicy in a very hot pan where leaner leg dries out. Leg works if that is what you have: cut it a little thicker, about 5mm, and lift it from the pan as soon as the outside has lost its raw colour.',
    'Soy sauces: check the labels. For gluten-free, use tamari in place of both.',
    'Sichuan peppercorns: they give the tingle that makes this dish, so do not skip them. Look for reddish brown ones that smell sharp and citrusy when you crush one; Chinese grocers and most supermarkets sell them.',
    'Chili flakes: Korean or Sichuan flakes are mild and red; if yours are the hot supermarket kind, use 1 teaspoon. Thai chili flakes work too but are much hotter, so start with half a teaspoon and taste.',
    'Dried chilies: they are there for fragrance, not to be eaten, so mild ones such as Kashmiri are ideal. None? Leave them out and add an extra half teaspoon of chili flakes to the spice mix.',
    'Onion: a white or brown onion works in place of the red.',
    'Long green peppers: the mild Turkish sivri kind, sold in Turkish and Middle Eastern grocers and many supermarkets. A green bell or Romano pepper, cut into 2cm strips, works too; for more heat, swap one pepper for an extra green chili or two.',
    'Chili oil: my favourite is Lee Kum Kee chili oil, which is spicier with a great flavour; Lao Gan Ma chili crisp adds crunch as well as heat. Some chili oils contain meat, so check the label.',
  ],

  variations: [
    'Biang biang style, with noodles: cook 300g dried wide wheat noodles (or fresh hand-pulled noodles) as the packet says, drain them and keep a mug of the cooking water. When the lamb and spice mix go back into the pan, add the noodles with an extra tablespoon of light soy sauce and 2 tablespoons of the noodle water, and toss over high heat for 1 to 2 minutes until glossy. A spoonful of chili oil over the top suits it well.',
    'Rou jia mo style, in bread: chop the finished lamb roughly and stuff it into warm, split flatbreads with extra coriander and green chili. Khubz or any soft round flatbread works; warm it in a dry pan for 30 seconds a side first.',
    'Cumin beef: use 450g flank, skirt or rump steak, sliced 3mm thick across the grain, in place of the lamb. Everything else stays exactly the same.',
    'Skewers, or chuan\'r: cut 450g lamb shoulder into 2cm cubes, keeping some of the fat on, toss with 1 tablespoon of oil and thread onto skewers (soak wooden ones in water for 30 minutes first). Grill on a very hot barbecue or under a hot grill for 8 to 10 minutes, turning every 2 minutes, scattering half the spice mix over halfway through and the rest at the end. In an air fryer, cook them at 200°C for 8 to 10 minutes, turning once, with the spice mix added the same way.',
  ],

  storage:
    'Best eaten straight from the pan, while the edges are still crisp. Leftovers keep in a sealed container in the fridge for up to 3 days. Reheat them in a very hot, dry pan for 1 to 2 minutes, tossing, rather than in the microwave, which steams the lamb and toughens it, and add fresh coriander. It does not freeze well. The toasted spice mix keeps in a jar for a couple of weeks, so it is worth making double.',

  dropcap: true,

  image: 'https://images.unsplash.com/photo-1710508836763-870d58493662?w=1200&q=80',
  imageIsStock: true,
};

export default recipe;
