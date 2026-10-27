// data/recipes/shakshuka.ts
import type { RecipeInput } from './_types';

const recipe: RecipeInput = {
  title: 'Shakshuka',
  country: 'Tunisia',
  featuredIngredients: ['eggs'],
  category: 'main',
  difficulty: 'Easy',
  servings: 2,
  time: { active: 25, total: 50 },
  yield: 'Serves 2, two eggs each',
  tags: ['vegetarian', 'one-pot', 'comfort food', 'budget-friendly'],

  region: 'North Africa',
  coordinates: { lat: 36.8065, lng: 10.1815 },

  ingredients: [
    {
      heading: 'The pepper and tomato sauce',
      items: [
        { name: 'olive oil', amount: 2, unit: 'tbsp' },
        { name: 'onion, thinly sliced', amount: 1, unit: '' },
        { name: 'red peppers, deseeded and thinly sliced', amount: 2, unit: '', note: 1 },
        { name: 'garlic cloves, thinly sliced', amount: 3, unit: '' },
        { name: 'tomato purée', amount: 1, unit: 'tbsp' },
        { name: 'harissa, from a jar', amount: 2, unit: 'tsp', note: 2 },
        { name: 'ground cumin', amount: 1, unit: 'tsp' },
        { name: 'sweet paprika', amount: 1, unit: 'tsp' },
        { name: 'tin of chopped tomatoes, or whole plum tomatoes', amount: 400, unit: 'g', note: 3 },
        { name: 'sugar, or a little honey', amount: 0.5, unit: 'tsp' },
        { name: 'salt, plus a pinch for the eggs', amount: 0.5, unit: 'tsp' },
        { name: 'black pepper', amount: 0, unit: '' },
      ],
    },
    {
      heading: 'The eggs, and to finish',
      items: [
        { name: 'eggs', amount: 4, unit: '' },
        { name: 'coriander and parsley, a small handful each, roughly chopped', amount: 0, unit: '' },
        { name: 'fresh green chili, thinly sliced (optional)', amount: 1, unit: '' },
        { name: 'khubz or other flatbread, or crusty bread, warmed, to serve', amount: 0, unit: '', note: 4 },
      ],
    },
  ],

  steps: [
    {
      heading: 'Before you start',
      items: [
        'Thinly slice the onion, peppers and garlic, and find the lid for your frying pan. Once the sauce is simmering there is time to chop the herbs and the chili.',
      ],
    },
    {
      heading: 'Sweet peppers first',
      items: [
        'Warm the olive oil in a frying pan about 24 to 26cm across over medium heat. Add the onion and peppers with a pinch of the salt and cook for 12 minutes, stirring every couple of minutes, until they are floppy, sweet and catching brown at the edges in places. Do not rush this. It is where the sauce gets its sweetness.',
      ],
    },
    {
      heading: 'The sauce',
      items: [
        'Turn the heat to medium-low and add the garlic. Stir for 1 minute, until soft and fragrant, without letting it brown.',
        'Add the tomato purée, harissa, cumin and paprika and stir for 2 minutes, until the purée darkens a shade and the oil turns brick red. Blooming the spices in the oil like this is what carries their flavour through the whole pan.',
        'Tip in the tomatoes, crushing whole ones against the pan with your spoon, then add the sugar and the rest of the half teaspoon of salt. Bring to a gentle bubble and simmer for 8 to 10 minutes, stirring now and then, until the sauce is thick: a spoon dragged across the bottom of the pan should leave a trail that holds for a second before the sauce slides back. A watery sauce is the main reason egg whites never set, so give it the time.',
        'Taste and season with more salt and some black pepper. If you want more heat, stir in a little more harissa now.',
      ],
    },
    {
      heading: 'The eggs',
      items: [
        'Turn the heat down to low. With the back of a spoon, make four wells in the sauce, spaced out so the eggs are not touching. Crack each egg into a cup, then slide it into a well.',
        'With the tip of a teaspoon, gently draw some of the thick white away from each yolk and out into the sauce, taking care not to break the yolk. The thick white hugging the yolk is always the last part to set, so spreading it thinner means the white is done before the yolk goes hard. Spoon a little sauce over the edges of the whites, leaving the yolks bare, and season each egg with a pinch of salt and pepper.',
        'Cover with the lid and cook on low heat for 5 to 10 minutes. Go by the sauce, not the dial: it should keep up a lazy blip around the eggs. If it stops bubbling altogether, turn the heat up a notch; if it bubbles hard, turn it down. How long the eggs take depends on your hob and how cold they were, so start checking at 5 minutes. They are ready when the whites are opaque right up to the yolk and nothing clear and jelly-like wobbles around the yolk when you nudge the pan, while the yolks still wobble when you give the pan a gentle shake and feel soft when you touch one lightly with the back of a teaspoon. If the outer whites are set but a ring of clear white still clings to a yolk, spoon a little hot sauce over just that ring, put the lid back on and check again after 1 minute.',
        'While the eggs cook, warm the bread for about 30 seconds a side in a hot dry pan.',
        'Take the pan off the heat, lift off the lid and leave it for 2 minutes. The heat of the pan finishes the last of the whites while the yolks stay runny.',
      ],
    },
    {
      heading: 'To the table',
      items: [
        'Pile the coriander, parsley and green chili over the top and take the pan straight to the table, with warm flatbread or bread for scooping up the sauce and breaking into the yolks.',
      ],
    },
  ],

  nutrition: { calories: 420, protein: 19, carbs: 28, fat: 25 },
  flavorProfile: { sweet: 2, salty: 2, sour: 2, bitter: 0, umami: 3, spicy: 2 },

  isVegetarian: true,
  isVegan: false,
  isGlutenFree: false,
  isDairyFree: true,

  quote:
    'Red peppers and onion cooked down with harissa into a thick, brick-red sauce, four eggs set gently on top, and the yolks left to run into the bread.',
  description:
    'Shakshuka is eggs cooked in a pan of peppers, onion and tomatoes, made right across North Africa and known in Tunisia as chakchouka. The name is usually taken to mean a mixture, and it is a forgiving one, but a few things make the difference between a good pan and a watery one. Here the peppers cook slowly until they are properly sweet, the harissa and spices go into hot oil before the tomatoes, and the sauce simmers until it is thick enough to hold the eggs in place. Then the eggs set gently under a lid and come off the heat while the yolks still run. It uses plain harissa from a jar, two teaspoons of it for a steady warmth, keeps feta out of the pan, and finishes with a pile of coriander, parsley and fresh green chili. Bring flatbread for scooping.',
  attribution: 'A Nieves\'s Kitchen take on a Tunisian classic',

  headnoteIngredients:
    'Ordinary jarred harissa is all you need, and two teaspoons gives a steady, gentle heat. Brands vary a lot, though, so taste a little from the jar first and go up or down from there. Red peppers rather than green make the sauce sweeter. Whole plum tomatoes break down into a softer sauce than chopped ones, which tend to hold their shape, but either works. Use the freshest eggs you have: their whites stay neat in the wells instead of spreading thin across the pan.',
  headnoteInstructions:
    'The whole dish comes down to two things: a thick sauce and a gentle heat. Cook the peppers until they are soft and sweet, then reduce the sauce until a spoon leaves a trail before any egg goes in. After that it is low heat, a lid, and taking the pan off the heat while the yolks still look soft.',

  equipment: [
    'A frying pan about 24 to 26cm across, with a lid. The lid traps steam to set the tops of the egg whites; a large plate or a baking tray laid over the pan works just as well.',
  ],

  tips: [
    'Reduce the sauce until it is thick before the eggs go in. If a spoon dragged through it does not leave a trail, give it a few more minutes. In a watery sauce the whites spread out and take so long to set that the yolks overcook.',
    'Crack each egg into a cup first. It is easier to slide it neatly into its well, and if a yolk breaks you can keep that egg for something else.',
    'Spread the thick white away from the yolk with the tip of a spoon. It is the part that takes longest to set, and thinning it out is the most reliable way to get set whites and runny yolks together.',
    'Keep the heat low once the eggs are in, just enough for the sauce to blip gently under the lid, and judge by the whites, not the clock. Opaque right up to the yolk, with no clear wobble, means done. Take the pan off then, because the yolks keep firming during the 2-minute rest.',
    'Season the eggs themselves. The sauce is seasoned, but the eggs are not, and a pinch of salt on each makes all the difference.',
    'Want a saucier pan, with more to mop up? Use two tins of tomatoes in a 28cm pan and simmer it 5 minutes longer.',
  ],

  notes: [
    'Peppers: yellow or orange work just like red. Green peppers taste more savoury and a little bitter, good as one of the two.',
    'Harissa: rose harissa gives a softer, more floral heat; use a little more of it. No harissa? Use half a teaspoon of chili flakes with an extra half teaspoon of paprika.',
    'Fresh tomatoes: in summer, use 500g of ripe tomatoes, chopped, in place of the tin. They hold more water, so simmer for 15 to 20 minutes, until thick.',
    'Gluten-free: the shakshuka itself has no gluten, so serve it with gluten-free bread.',
  ],

  variations: [
    'With feta: crumble 40 to 60g over the sauce just before the lid goes on. Check the label for microbial or vegetable rennet, or buy a halal-certified one.',
    'Fire-roasted tinned tomatoes in place of plain give a smokier, deeper sauce for no extra work.',
    'Finish with lemon: a squeeze of lemon juice, or a spoonful of finely chopped preserved lemon rind, scattered over with the herbs. It lifts the whole pan.',
    'Labneh and zhoug: blitz a big handful each of coriander and parsley with 2 green chilies, 1 garlic clove, half a teaspoon of ground cumin, 3 tablespoons of olive oil, a squeeze of lemon and a pinch of salt. Spoon it over the finished pan with a few dollops of labneh or thick yogurt.',
    'With spiced beef meatballs: make the saucier two-tin version in a 28cm pan (see the tips), so there is room for the meatballs and the eggs. Mix 250g beef mince with a grated garlic clove, half a teaspoon each of ground cumin and salt, and a little chopped parsley, and roll into 12 small balls. Brown them all over in the oil before the onion and peppers go in, about 5 minutes, then lift them out and carry on with the recipe. Nestle them back into the sauce for its last 5 minutes of simmering, and check that the middle of one reaches 71°C, or shows no pink, before the eggs go in.',
    'Green shakshuka: in place of the peppers and tomatoes, wilt 300g spinach or chard with sliced spring onions, garlic and cumin, stir through a handful of chopped coriander and parsley and a squeeze of lemon, then cook the eggs in it the same way. Finish with feta or yogurt.',
    'A Tunisian touch: add half a teaspoon of ground caraway with the cumin.',
  ],

  storage:
    'Best eaten as soon as the eggs are set, since reheated eggs turn rubbery. The sauce on its own keeps in the fridge for 3 days and freezes for up to 3 months, so it is worth making a double batch. Bring it back to a gentle bubble in the pan, make the wells and cook fresh eggs in it.',

  dropcap: true,

  image: 'https://images.unsplash.com/photo-1682622110419-b671026a4536?w=1200&q=80',
  imageIsStock: true,
};

export default recipe;
