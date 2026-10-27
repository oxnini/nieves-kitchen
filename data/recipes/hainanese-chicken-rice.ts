// data/recipes/hainanese-chicken-rice.ts
import type { RecipeInput } from './_types';

const recipe: RecipeInput = {
  title: 'Hainanese Chicken Rice',
  country: 'Malaysia',
  featuredIngredients: ['chicken'],
  category: 'main',
  difficulty: 'Medium',
  servings: 2,
  time: { active: 45, total: 70 },
  yield: 'Serves 2, with a bowl of broth each',
  tags: ['high-protein', 'comfort food'],

  region: 'Southeast Asia',
  coordinates: { lat: 3.139, lng: 101.6869 },
  influences: ['Malaysia', 'China'],

  ingredients: [
    {
      heading: 'The chicken',
      items: [
        { name: 'small boneless, skinless chicken thighs, about 500g', amount: 6, unit: '', note: 1 },
        { name: 'fresh ginger, cut into thick coins and smashed', amount: 25, unit: 'g' },
        { name: 'spring onions, halved', amount: 2, unit: '' },
        { name: 'garlic cloves, bashed', amount: 2, unit: '' },
        { name: 'water', amount: 1200, unit: 'ml', note: 2 },
        { name: 'salt, for the poaching water', amount: 1, unit: 'tsp' },
      ],
    },
    {
      heading: 'The rice',
      items: [
        { name: 'jasmine rice', amount: 140, unit: 'g', note: 3 },
        { name: 'chicken fat or neutral oil', amount: 1, unit: 'tbsp', note: 4 },
        { name: 'garlic cloves, finely chopped', amount: 2, unit: '' },
        { name: 'shallot, finely chopped', amount: 1, unit: '' },
        { name: 'fresh ginger, finely grated', amount: 1, unit: 'tsp' },
        { name: 'hot poaching stock (200ml in a rice cooker)', amount: 240, unit: 'ml' },
        { name: 'salt', amount: 0.5, unit: 'tsp' },
        { name: 'pandan leaf, tied in a knot (optional)', amount: 1, unit: '', note: 5 },
      ],
    },
    {
      heading: 'Chili sauce',
      items: [
        { name: 'long red chilies, roughly chopped', amount: 3, unit: '' },
        { name: "bird's eye chili, for more heat (optional)", amount: 1, unit: '' },
        { name: 'garlic cloves', amount: 2, unit: '' },
        { name: 'fresh ginger, peeled and roughly chopped', amount: 15, unit: 'g' },
        { name: 'sugar', amount: 1, unit: 'tsp' },
        { name: 'salt', amount: 0.25, unit: 'tsp' },
        { name: 'lime juice', amount: 1, unit: 'tbsp' },
        { name: 'rice vinegar', amount: 0.5, unit: 'tsp' },
        { name: 'hot poaching stock', amount: 2, unit: 'tbsp' },
      ],
    },
    {
      heading: 'Ginger and spring onion sauce',
      items: [
        { name: 'fresh ginger, peeled and very finely grated', amount: 25, unit: 'g' },
        { name: 'spring onions, very finely chopped', amount: 2, unit: '' },
        { name: 'salt', amount: 0.25, unit: 'tsp' },
        { name: 'neutral oil', amount: 1, unit: 'tbsp' },
      ],
    },
    {
      heading: 'Soy drizzle',
      items: [
        { name: 'light soy sauce', amount: 1, unit: 'tbsp', note: 6 },
        { name: 'dark soy sauce', amount: 2, unit: 'tsp', note: 6 },
        { name: 'honey', amount: 1, unit: 'tsp' },
        { name: 'toasted sesame oil', amount: 1, unit: 'tsp' },
        { name: 'hot poaching stock', amount: 2, unit: 'tbsp' },
      ],
    },
    {
      heading: 'To serve',
      items: [
        { name: 'cucumber, thinly sliced', amount: 0.5, unit: '' },
        { name: 'coriander, a handful', amount: 0, unit: '' },
        { name: 'spring onion, finely sliced, for the broth', amount: 1, unit: '' },
        { name: 'white pepper, for the broth', amount: 0, unit: '' },
      ],
    },
  ],

  steps: [
    {
      heading: 'Before you start',
      items: [
        'Trim any pockets of fat from the thighs, chop them small and keep them for the rice. Rinse the rice in several changes of cold water until it runs almost clear, then leave it to drain in a sieve for at least 15 minutes.',
      ],
    },
    {
      heading: 'Poach the chicken',
      items: [
        'Put the 1.2 litres of water, the smashed ginger, bashed garlic, halved spring onions and the teaspoon of salt in a lidded pan of about 20cm. Cover and bring it to a full boil over high heat, about 8 minutes.',
        'Lower in the thighs with tongs and make sure they are all under the water. Let it come back to a gentle simmer, 2 to 3 minutes, skimming off any grey foam, then turn the heat to its lowest and put the lid on. You want a bare simmer: steam and the odd lazy bubble, never a boil, which makes the meat tough and stringy. Leave it for 12 to 15 minutes (18 to 20 if the thighs are on the bone), until the thickest part reads 74°C, or the juices run clear when you cut into it.',
      ],
    },
    {
      heading: 'The sauces, while it poaches',
      items: [
        'Chili sauce: blitz the long red chilies, the bird\'s eye chili if using, the 2 garlic cloves, the chopped ginger, sugar and quarter teaspoon of salt to a coarse paste in a mini chopper, or pound them in a mortar. Stir in the lime juice, rice vinegar and 2 tablespoons of hot stock from the pot. It should taste hot, sharp and only a little sweet.',
        'Ginger and spring onion sauce: put the grated ginger, chopped spring onions and quarter teaspoon of salt in a small heatproof bowl. Heat the tablespoon of oil in a small pan over medium-high heat for about 1 minute, until it shimmers, then pour it over. It will sizzle. Stir and leave it to cool.',
        'Soy drizzle: stir the light and dark soy, honey, sesame oil and 2 tablespoons of hot stock together until the honey dissolves.',
        'Finely chop the garlic and shallot for the rice and grate the ginger, so the rice can start as soon as the chicken comes out.',
      ],
    },
    {
      heading: 'The rice',
      items: [
        'Lift the thighs onto a plate and cover loosely with foil. Keep the stock on the lowest heat, lid on.',
        'Put the chopped fat trimmings in a small, heavy saucepan with a tight-fitting lid over medium-low heat for about 5 minutes, until they have melted down and the scraps are crisp. Lift out the scraps and top up the fat with oil to make about 1 tablespoon. No trimmings? Just use the tablespoon of fat or oil.',
        'Add the chopped garlic, shallot and grated ginger and fry for 2 minutes, stirring, until soft but not browned. Add the drained rice and stir over medium heat for 2 minutes, until every grain is glossy and smells nutty.',
        'Ladle 240ml of hot stock from the top of the pot, where the fat sits, through a sieve into a jug. Pour it over the rice, add the half teaspoon of salt and the pandan if using, and stir once. Bring it to the boil, put the lid on, turn the heat to its lowest and cook for 12 minutes without lifting the lid. Take it off the heat and leave it covered for 10 minutes, then fluff it with a fork.',
        'Rice cooker instead? Toast the rice in the pan as above, then tip it into the cooker with 200ml of the hot stock, the salt and the pandan, and run the normal white rice setting. Leave it 10 minutes on keep warm before you fluff it.',
      ],
    },
    {
      heading: 'To the table',
      items: [
        'While the rice rests, shred the chicken with two forks, pulling it off the bone if it has one. Toss it with a spoonful of the hot stock so it stays juicy.',
        'Bring the rest of the stock up to a simmer, taste it and add salt if it needs it, then ladle it into small bowls with the sliced spring onion and a pinch of white pepper.',
        'Spoon the rice onto plates and lay the shredded chicken on top. Drizzle over the soy drizzle, scatter with coriander and tuck the cucumber alongside. Serve with the chili sauce, the ginger sauce and the broth.',
      ],
    },
  ],

  nutrition: { calories: 780, protein: 58, carbs: 72, fat: 28 },
  flavorProfile: { sweet: 2, salty: 3, sour: 2, bitter: 0, umami: 4, spicy: 2 },

  isVegetarian: false,
  isVegan: false,
  isGlutenFree: false,
  isDairyFree: true,

  quote:
    'Gently poached chicken shredded over rice toasted with garlic and ginger and cooked in the poaching stock, with a soy drizzle and two sharp, hot sauces on the side.',
  description:
    'Hainanese chicken rice is one of the great hawker plates of Malaysia and Singapore, and it is simpler than it looks. Chicken is poached at the barest simmer, and the stock it leaves behind cooks the rice, after the grains are toasted with garlic, shallot and ginger. The rice is the real star, fragrant enough to eat on its own. This version is sized for two and made with small boneless, skinless thighs, which are hard to overcook and ready in about 15 minutes. With no skin to give fat to the rice, a spoonful of chicken fat or oil takes its place. The chicken is shredded and laid over the rice with a soy drizzle, and a hot chili and lime sauce, ginger and spring onion sizzled under hot oil, and a small bowl of the broth finish the plate. It belongs as much to Singapore as to Malaysia, and it lives here under Malaysia.',
  attribution: 'A Nieves\'s Kitchen take on a Hainanese hawker classic',

  headnoteIngredients:
    'Buy the best halal chicken you can: six small boneless, skinless thighs feed two generously. Long red chilies give the sauce its colour and the bird\'s eye chili its heat, so use more or less of that one.',
  headnoteInstructions:
    'Make the sauces while the chicken poaches and start the rice as soon as it comes out. The chicken is eaten warm or at room temperature, so nothing has to wait on anything else.',

  equipment: [
    'A meat thermometer, the surest way to know the thighs are at 74°C without cutting into them.',
    'A mini chopper for the chili sauce, or a mortar and pestle.',
    'A rice cooker if you have one, though a heavy pan with a tight-fitting lid does the job just as well.',
  ],

  tips: [
    'The bare simmer is the whole game. Steam and the odd lazy bubble, never a boil. Hard boiling turns poached chicken stringy.',
    'For grains that stay separate, drain the rice properly after rinsing and do not lift the lid while it cooks.',
    'Ladle the stock for the rice from the top of the pot. That is where the fat sits, and it carries most of the flavour.',
    'Keep any leftover stock. It freezes well and makes a good base for congee or noodle soup.',
  ],

  notes: [
    'Thighs: the recipe is written for boneless. Bone-in work too and give a fuller stock; give them about 5 minutes longer and pull the meat off the bone when you shred it.',
    'Stock: skinless thighs make a light stock. For a fuller one, crumble in half a halal chicken stock cube (check the label) and use only half the salt.',
    'Rice: basmati works in place of jasmine with the same amount of stock. It is less fragrant but the grains stay beautifully separate.',
    'Fat for the rice: with no skin, the rice needs its own fat. Any fat trimmed from the thighs, melted down, gives the richest rice; chicken fat skimmed from a roast works too. Otherwise neutral oil is fine.',
    'Pandan: sold frozen at Asian grocers, and it gives the rice a sweet, grassy fragrance. No pandan? Leave it out, or add a few slices of ginger.',
    'Soy sauce: check the labels on the light and dark soy. Kecap manis can stand in for the dark soy and honey. For gluten-free, use tamari and a gluten-free dark soy.',
  ],

  variations: [
    'Skin-on, the classic way: use 6 skin-on, bone-in thighs, scrub the skin with coarse salt and rinse, and poach for 20 to 25 minutes. Plunge them into iced water for 10 minutes to set the skin, then rub with a little sesame oil. Render the skin trimmings for the rice. Richer, at around 900 kcal a plate.',
    'Roast chicken rice: marinate the 6 thighs in 1 tbsp light soy, 2 tsp dark soy, 2 tsp honey, 1 tsp sesame oil and 1 tsp grated ginger, and roast at 200°C (180°C fan) for 25 to 30 minutes, or air fry at 190°C for about 18 minutes, turning halfway, until 74°C inside. With no poaching stock, make 600ml of halal chicken stock and use it wherever the recipe calls for stock.',
    'Thai khao man gai sauce, in place of the chili sauce: mix 1 tbsp fermented soybean paste (check the label) with 2 tsp grated ginger, 1 crushed garlic clove, 1 sliced bird\'s eye chili, 2 tsp rice vinegar, 1 tsp sugar and a splash of stock.',
    'Pile on sliced fresh green chili with the coriander, or put a jar of chili crisp on the table for more heat.',
  ],

  storage:
    'Get the chicken into the fridge within 2 hours and eat it within 2 days. The rice keeps 1 day in the fridge; reheat it in a covered pan with a splash of stock until steaming. The stock keeps 3 days in the fridge or 3 months in the freezer. The chili sauce and the ginger sauce each keep about a week in a jar in the fridge.',

  dropcap: true,

  image: 'https://images.unsplash.com/photo-1787329682500-04fa551dde92?w=1200&q=80',
  imageIsStock: true,
};

export default recipe;
