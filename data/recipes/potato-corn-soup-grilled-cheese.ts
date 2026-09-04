// data/recipes/potato-corn-soup-grilled-cheese.ts
import type { RecipeInput } from './_types';

const recipe: RecipeInput = {
  title: 'Potato, Leek and Corn Soup with Chorizo Grilled Cheese',
  country: 'France',
  category: 'main',
  difficulty: 'Medium',
  servings: 4,
  time: { active: 50, total: 65 },
  yield: 'Serves 4, a deep bowl of soup and a whole grilled cheese each',
  tags: ['comfort food', 'budget-friendly', 'high-protein'],

  region: 'Western Europe',
  coordinates: { lat: 48.8566, lng: 2.3522 },
  influences: ['France', 'United States of America'],

  ingredients: [
    {
      heading: 'Soup',
      items: [
        { name: 'leeks, trimmed and sliced 1cm', amount: 3, unit: '' },
        { name: 'floury potatoes (Maris Piper or King Edward), peeled, 3cm chunks', amount: 800, unit: 'g' },
        { name: 'corn on the cob, each cut into 4 rounds', amount: 2, unit: '' },
        { name: 'onion, chopped', amount: 1, unit: '' },
        { name: 'garlic cloves, crushed', amount: 2, unit: '' },
        { name: 'butter', amount: 50, unit: 'g' },
        { name: 'chicken or vegetable stock', amount: 800, unit: 'ml' },
        { name: 'bay leaf', amount: 1, unit: '' },
        { name: 'dried thyme', amount: 0.5, unit: 'tsp' },
        { name: 'white pepper', amount: 0.5, unit: 'tsp' },
        { name: 'salt, plus more at the end', amount: 1, unit: 'tsp' },
        { name: 'whole milk', amount: 150, unit: 'ml' },
        { name: 'lemon juice, to taste (optional)', amount: 0, unit: '' },
        { name: 'chives, chopped', amount: 2, unit: 'tbsp' },
      ],
    },
    {
      heading: 'Chorizo and caramelised onion grilled cheese',
      items: [
        { name: 'large sourdough slices, about 80g each, halved', amount: 4, unit: '' },
        { name: 'shredded mozzarella, out of the fridge 15 minutes beforehand', amount: 400, unit: 'g' },
        { name: 'halal chorizo, sliced thin or diced small', amount: 160, unit: 'g' },
        { name: 'onions, halved and sliced thin', amount: 2, unit: '' },
        { name: 'mayonnaise (full fat)', amount: 4, unit: 'tbsp' },
        { name: 'butter, softened', amount: 40, unit: 'g' },
        { name: 'garlic cloves, crushed', amount: 2, unit: '' },
        { name: 'dried oregano', amount: 0.5, unit: 'tsp' },
        { name: 'black pepper', amount: 0.5, unit: 'tsp' },
        { name: 'olive oil, if needed', amount: 2, unit: 'tsp' },
      ],
    },
  ],

  steps: [
    {
      heading: 'The soup base',
      items: [
        'Wash the leeks properly. Slice them, then dump them into a bowl of cold water and swish hard. Grit sits between the layers and sinks to the bottom. Lift the leeks out with your hands rather than pouring them into a colander, or the grit comes straight back with them. Drain.',
        'Melt the butter in a large heavy pot over medium-low heat, then add the leeks, onion and salt. Ten minutes, stirring now and then, until completely soft and collapsed but not browned. A splash of water if they start to colour. This soup wants sweetness, not caramelisation.',
        'Add the garlic, thyme and white pepper and give it one minute.',
        'Tip in the potatoes, stock and bay leaf. Stir and scrape the base clean so nothing catches, bring it up to a boil, then drop it to a gentle simmer and put the lid on.',
      ],
    },
    {
      heading: 'The simmer, and the fillings while it cooks',
      items: [
        'Simmer covered for 10 minutes, then tuck the corn rounds in among the potatoes and give it another 8 to 10, until a knife goes into a chunk of potato with no resistance at all. The corn goes in late on purpose. It only needs those eight minutes or so, and it turns bland and papery if it sits in the pot from the start.',
        'While that happens, render the chorizo. Dry frying pan on medium, 3 to 4 minutes, until the edges crisp and the fat runs out red. Scoop it onto kitchen paper and leave the fat in the pan.',
        'Caramelise the onions in that chorizo fat with a pinch of salt, adding the olive oil only if the pan looks dry. Medium-low, 12 to 15 minutes, until soft and jammy. Do not rush it on high heat. Tip them onto a plate, then wipe the pan clean. The leftover red fat is too heavily seasoned to fry the crust in and will burn bitter.',
        'Mash the garlic into the softened butter with a pinch of salt. Separately, toss the mozzarella with the oregano and black pepper, then set a large handful of cheese aside. That handful is for the pan, not the sandwich.',
      ],
    },
    {
      heading: 'Finish the soup',
      items: [
        'Lift the corn rounds out with tongs onto a plate and fish out the bay leaf. You cannot mash around them, and you will splinter cob into the soup trying.',
        'Mash by hand, straight in the pot, 15 to 20 presses, moving around as you go. Stop while there are still recognisable pieces of potato. Do not beat it. Soft-cooked potato turns gluey the moment the starch is overworked. For a silkier body, push one ladleful through a sieve and stir it back in.',
        'Take the pot off the heat and let it stop bubbling, then stir in the milk. Now taste and salt it properly. Potato soaks salt up and the soup will taste flat until you have added more than feels reasonable. Lemon only if it still tastes heavy, and always before or separately from the milk.',
        'Slide the corn rounds back in and scatter with chives.',
      ],
    },
    {
      heading: 'Build and fry the sandwiches',
      items: [
        'Spread the garlic butter thinly on the inside face of every slice. It is a moisture barrier as much as a flavour, and it is what keeps the bread from going soft under the filling.',
        'Onto four of the halves, layer half the cheese, then the onions, then the chorizo, then the rest of the cheese. Cheese top and bottom is what welds the filling in place. Close each one and press with your palm.',
        'Spread the mayonnaise over the outside top face, edge to edge. Each slice ends up with butter on one side and mayo on the other, never both on the same face.',
        'Clean pan, medium-low, no fat at all. Scatter the reserved cheese in patches the size of the bread, wait 30 seconds until it starts to melt, then set each sandwich mayo side down onto a patch. Mayo the faces now looking up. Cover with a lid and leave it 4 minutes without moving anything. Work in batches if the pan will not take them all with room to spare.',
        'Flip, then press down with a spatula. Now, not before, or the filling squeezes out while it is still solid. Lid back on for 3 to 4 minutes, to deep golden.',
        'One minute on a board to settle, then cut on the diagonal and serve alongside the soup.',
      ],
    },
  ],

  nutrition: { calories: 1150, protein: 44, carbs: 98, fat: 61 },
  flavorProfile: { sweet: 2, salty: 3, sour: 0, bitter: 0, umami: 3, spicy: 1 },

  isVegetarian: false,
  isVegan: false,
  isGlutenFree: false,
  isDairyFree: false,

  quote:
    'A potato and leek soup that never sees a blender, with corn left on the cob so you pick it out of the bowl with your fingers, and a grilled cheese fried onto a lace crust of its own cheese.',
  description:
    'Potage parmentier is the spine of this, potato and leek softened in butter until sweet, but two things pull it somewhere else. The corn goes in as cob rounds rather than loose kernels, so it leaks a milky sweetness into the broth and then sits up out of the bowl to be picked up and eaten with your fingers. And the soup is thickened by hand with a masher rather than a blender, which leaves recognisable pieces of potato instead of a smooth puree. Alongside it goes a grilled cheese fried onto a scattered patch of its own cheese, so the outside shatters. The timing is the quiet pleasure of the whole thing. The soup looks after itself under a lid for twenty minutes, which is exactly long enough to render the chorizo and caramelise the onions, so nothing ever waits on anything else.',
  attribution: "A Nieves's Kitchen original",

  headnoteIngredients:
    'Floury potatoes are not negotiable here. Maris Piper or King Edward break down under the masher and give the soup its body, where a waxy potato stays stubbornly whole and leaves you with watery soup around intact chunks. On the chorizo, most halal versions are closer to a beef salami than a Spanish chorizo, leaner and milder, and they render almost nothing. That is good for the sandwich, because the mozzarella is not drowned out, but it means the onions have no fat to cook in, so reach for the olive oil. Bread is the biggest variable in the whole recipe: a bakery sourdough slice can weigh 80g where a supermarket slice is 40g, which is a 200 kcal difference per sandwich on its own. Worth weighing rather than assuming.',
  headnoteInstructions:
    'Read the whole thing before you start, because the two halves are meant to overlap. Once the potatoes go in, the soup simmers under a lid for about twenty minutes with almost nothing asked of you, and the chorizo, onions and garlic butter all fit neatly inside that window. Do them there and the sandwiches go into the pan the moment the soup is seasoned. Do them afterwards and you will be eating cold soup.',

  equipment: [
    'A potato masher, which is the whole method here. The soup is thickened by hand and never sees a blender, so the pieces stay recognisable',
    'A frying pan with a lid, or any bowl large enough to invert over the sandwiches. The trapped heat is what melts the cheese through before the crust goes too far',
  ],

  tips: [
    'The single best upgrade to a mild-cheese sandwich is frying it onto a scattered patch of the same cheese. It costs nothing and gives you a shattering lace crust that a plain buttered slice never will.',
    'Leave the soup looser than seems right. It thickens as it sits, and thick soup clinging to corn you are eating with your fingers is a mess.',
    'Salt the soup harder than feels sensible. Potato absorbs it and the whole pot reads flat until you have gone past the point you would normally stop.',
    'Shredded bagged mozzarella carries a starch anti-caking coating and melts slightly matte. Fifteen minutes out of the fridge before it goes in makes a visible difference to how it pulls.',
    'Light mayonnaise browns weakly, because it is mostly water and thickener. If that is all there is in the fridge, butter the outside instead. Better result.',
    'Cutting cob rounds: snap the pointed tip off first, stand the cob on its end, then rock a heavy knife through rather than pressing straight down.',
    'The bread is where the calories live. Dropping from an 80g bakery slice to a 40g supermarket one takes roughly 200 kcal off each sandwich, far more than switching chorizo ever will.',
  ],

  substitutions: [
    'Waxy potatoes will not work here. They stay whole under the masher and the soup ends up watery around them.',
    'Chorizo is the easiest thing in the recipe to swap. Salami, pepperoni or a Turkish sucuk all do the same job, which is a salty cured note against mild cheese and sweet onion. Sucuk in particular renders more fat than most halal chorizo does, so hold back the olive oil at the onion stage.',
    'Frozen sweetcorn can replace the cobs but it loses the point, since the cobs are what leak that milky sweetness into the broth. If you go frozen, skip the corn stage entirely, then stir the kernels in after mashing and give them 3 to 4 minutes over a low heat.',
    'Cured firm chorizo and soft cooking chorizo both work. The soft kind throws off far more fat, so pour some off before the onions go in and keep about a tablespoon back.',
    'Vegetable stock in place of chicken makes the soup itself vegetarian, though the sandwich alongside is not.',
    'A pressure cooker does the soup with less watching, if you have one. Sweat the leeks on the sauté setting exactly as written, then add the potatoes, stock and bay leaf and tuck the corn rounds in straight away rather than holding them back. That is the one real difference: the whole thing runs 5 minutes on high, which is short enough that the corn can go in from the start. Let it come down on its own for about 15 minutes rather than venting it, and do not leave it sitting on a keep-warm setting afterwards, since it carries on softening the corn. Then lift the corn out and mash exactly as below.',
  ],

  variations: [
    'Harissa, a teaspoon swirled into one bowl with a little olive oil, so the other bowl stays plain and you can compare them.',
    'A thin smear of ketchup on one inner slice of the sandwich. Tomato, chorizo and mozzarella all agree with each other.',
    'No chorizo at all: the plain version with just garlic butter, oregano and pepper is still very good, and the caramelised onion is worth doing either way.',
    'Cream instead of milk, 100ml single cream in place of the 150ml. Richer, and far less likely to split when you reheat it.',
  ],

  storage:
    'The soup keeps 4 days in the fridge. Reheat it gently, because whole milk splits if you bring it to a rolling boil, and loosen it with a splash of stock or milk as it goes. To freeze, do it before the milk goes in and take the corn out first, since cob rounds do not survive freezing and reheating. The sandwich does not keep at all. It is good for about five minutes after it leaves the pan.',

  dropcap: true,

  image: '/recipes/potato-corn-soup-grilled-cheese-hero.webp',
  imageIsStock: false,
  images: [
    {
      url: '/recipes/potato-corn-soup-grilled-cheese-soup.webp',
      caption: 'Corn left as cob rounds so it sits up out of the bowl, chives over the top',
      width: 1086,
      height: 1448,
    },
  ],
};

export default recipe;
