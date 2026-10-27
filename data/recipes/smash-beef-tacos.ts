// data/recipes/smash-beef-tacos.ts
import type { RecipeInput } from './_types';

const recipe: RecipeInput = {
  title: 'Smash Beef Tacos',
  country: 'Mexico',
  category: 'main',
  difficulty: 'Easy',
  servings: 4,
  time: { active: 60, total: 65 },
  yield: 'Makes 12 small tacos, three each',
  tags: ['high-protein', 'comfort food', 'weekend feast'],

  region: 'North America',
  coordinates: { lat: 19.4326, lng: -99.1332 },
  influences: ['Mexico', 'United States of America'],
  featuredIngredients: ['beef'],

  ingredients: [
    {
      heading: 'Quick pickled red onions',
      items: [
        { name: 'red onion, halved and sliced very thinly from root to tip', amount: 1, unit: '' },
        { name: 'salt', amount: 0.5, unit: 'tsp' },
        { name: 'sugar', amount: 0.5, unit: 'tsp' },
        { name: 'lime juice, from about 2 limes', amount: 60, unit: 'ml' },
      ],
    },
    {
      heading: 'Smash beef',
      items: [
        { name: 'beef mince, about 15% fat, fridge-cold', amount: 500, unit: 'g', note: 1 },
        { name: 'mild chili powder', amount: 2, unit: 'tsp', note: 2 },
        { name: 'ground cumin', amount: 1.5, unit: 'tsp' },
        { name: 'smoked paprika', amount: 1, unit: 'tsp' },
        { name: 'garlic powder', amount: 1, unit: 'tsp' },
        { name: 'onion powder', amount: 1, unit: 'tsp' },
        { name: 'dried oregano, Mexican if you can find it', amount: 1, unit: 'tsp' },
        { name: 'cayenne pepper', amount: 0.25, unit: 'tsp' },
        { name: 'fine salt', amount: 0.75, unit: 'tsp' },
        { name: 'black pepper', amount: 0.25, unit: 'tsp' },
        { name: 'small flour tortillas, about 15cm across', amount: 12, unit: '', note: 3 },
        { name: 'neutral oil', amount: 2, unit: 'tsp' },
        { name: 'mature cheddar, grated from a block', amount: 100, unit: 'g', note: 4 },
      ],
    },
    {
      heading: 'Guacamole',
      items: [
        { name: 'white onion, finely chopped (red works too)', amount: 3, unit: 'tbsp' },
        { name: 'large ripe avocados', amount: 2, unit: '' },
        { name: 'salt', amount: 0.5, unit: 'tsp' },
        { name: 'lime juice, plus more to taste', amount: 1, unit: 'tbsp' },
        { name: 'ripe tomato, seeds scooped out, finely diced', amount: 1, unit: '' },
        { name: 'fresh green chili, finely chopped', amount: 1, unit: '', note: 5 },
        { name: 'coriander, a small handful, chopped', amount: 0, unit: '' },
      ],
    },
    {
      heading: 'To serve',
      items: [
        { name: 'fresh green chili, thinly sliced', amount: 1, unit: '', note: 5 },
        { name: 'coriander leaves', amount: 0, unit: '' },
        { name: 'iceberg lettuce, finely shredded (optional)', amount: 0, unit: '' },
        { name: 'hot sauce', amount: 0, unit: '' },
        { name: 'lime, cut into wedges', amount: 1, unit: '' },
      ],
    },
  ],

  steps: [
    {
      heading: 'Start the onions first',
      items: [
        'Put the sliced red onion in a bowl with the salt and sugar and scrunch it with your fingers for about 30 seconds, until the slices soften and look glossy. Pour over the lime juice, press the onions down so they sit in it, and leave them for 20 minutes, stirring once halfway. They are ready when they have turned bright pink and lost their raw bite. Everything else happens while they sit.',
      ],
    },
    {
      heading: 'The beef, onto the tortillas',
      items: [
        'Stir all the spices, the salt and the pepper together in a small bowl, then work them into the cold mince with a fork or your fingers for about 30 seconds, until there are no streaks of plain meat. Mix it only until even. You are seasoning it, not kneading a sausage.',
        'Divide the beef into 12 pieces of about 40g. To keep them even without weighing, halve the mince, halve each half again, then split each quarter into three.',
        'Put a piece in the middle of a tortilla and press it out with your fingertips into a thin, even layer of 2 to 3mm, about the thickness of a pound coin, right to the very edge with no gaps. Thin is what makes it crisp, and any bare rim of tortilla will scorch in the pan. Stack the topped tortillas on a plate with a square of baking paper between each one and keep them in the fridge until the pan is hot. Cold beef going into a hot pan crusts better.',
      ],
    },
    {
      heading: 'The guacamole',
      items: [
        'Put the chopped white onion in a sieve and rinse it under cold running water for about 30 seconds, then shake it dry. This takes the harsh edge off, so it tastes fresh rather than sharp.',
        'Halve the avocados, scoop the flesh into a bowl and mash it roughly with a fork, leaving plenty of chunks. Add the salt and the tablespoon of lime juice and stir gently, then fold in the onion, tomato, chopped chili and coriander. Taste, and add more lime or salt until it tastes bright. Press cling film onto the surface so it does not brown.',
        'Slice the chili for serving, pick the coriander leaves, shred the lettuce if you are using it and cut the lime into wedges, so everything is waiting before the first taco goes in.',
      ],
    },
    {
      heading: 'Smash and crisp',
      items: [
        'If you want to bring them all to the table together rather than eat in rounds, heat the oven to 120°C (100°C fan) now and set a wire rack over a baking tray inside.',
        'Put a heavy frying pan over medium-high heat for 3 to 4 minutes, until a drop of water skitters and vanishes the moment it lands (see note 6). A 28cm pan holds one taco at a time, so if you have a second pan, run both. Add a teaspoon of the oil to each pan and swirl it round. Only the first round needs it; after that the beef renders plenty of fat of its own.',
        'Lay a tortilla in the pan beef side down. Straight away, press down hard all over for about 10 seconds with a stiff metal spatula, working across it in two or three places, or with the flat base of a small saucepan, so every bit of the beef is flat against the pan. The tortilla sits between the press and the meat, so nothing sticks.',
        'Now leave it alone for 2 to 3 minutes. It should sizzle loudly the whole time. It is ready when the beef showing at the rim has gone deep brown and lacy, and a corner lifted with the spatula shows a dark, crisp crust underneath, not grey. If it is still pale, give it another 30 seconds to a minute. If the pan is smoking hard or the spices smell acrid, turn the heat down a notch.',
        'Slide the spatula firmly under the beef, scraping against the pan so the whole crust comes up with it, and flip. Scatter about 8g of the cheese over the hot meat, a twelfth of the pile.',
        'The tortilla is now down in the beef fat. Press it flat with the spatula for a few seconds, then cook it for 1 to 2 minutes, pressing once or twice more, until it is golden with crisp brown blisters and the cheese has melted. If the tortilla is colouring faster than the cheese is melting, set a lid on the pan for the last 30 seconds.',
        'Cut the first taco in half to check it: the beef should be browned right through, with no pink left against the tortilla. At this thinness it always is once the crust is dark, well past the 71°C that minced beef needs, so from then on you can trust the crust.',
        'Lift each taco onto a wire rack rather than a plate, so the underside stays crisp, and carry on with the rest. If burnt bits of spice build up in the pan, wipe it out carefully with a thick wad of kitchen paper, leaving a thin film of fat behind. They are best eaten in rounds as they come out of the pan, but you can keep the finished ones on the rack in the warm oven while you cook the rest. They hold well there for up to 30 minutes.',
      ],
    },
    {
      heading: 'Build and eat',
      items: [
        'Spoon guacamole over the beef, then add a tangle of pickled onions lifted out of their juice with a fork, the sliced chili, coriander and lettuce if you are using it. Finish with hot sauce and a squeeze of lime. Fold them while they are still warm, when the tortilla bends rather than cracks, or eat them open.',
      ],
    },
  ],

  nutrition: { calories: 795, protein: 41, carbs: 61, fat: 44 },
  flavorProfile: { sweet: 1, salty: 3, sour: 3, bitter: 0, umami: 4, spicy: 2 },

  isVegetarian: false,
  isVegan: false,
  isGlutenFree: false,
  isDairyFree: false,

  quote:
    'Spiced beef pressed paper-thin onto a flour tortilla and fried meat side down until it crackles, then flipped so the tortilla crisps in the fat it left behind.',
  description:
    'A smash taco is a smash burger that skipped the bun. Raw, spiced mince is pressed thin onto a small flour tortilla and laid meat side down in a hot pan, so the whole face of the beef turns to crust while the tortilla on top does the job of the press. Then it is flipped, and the tortilla fries in the fat the beef has just given up. I like it this way rather than in a fried shell: the tortilla stays warm and soft in the middle but crisps in blisters where it is pressed against the pan, so there is still a proper crunch. The seasoning is a homemade taco spice worked straight into the meat, a little cheddar melts over the top in the last minute, and against all that heat and fat go two cold, sharp things: red onions quick-pickled in lime, and a chunky guacamole with fresh green chili.',
  attribution: "A Nieves's Kitchen take on the smash taco",

  headnoteIngredients:
    'Use small flour tortillas, about 15cm across, often sold as mini wraps or taco-size tortillas. Flour holds together through the press and the flip, and it crisps beautifully in beef fat. Mince at around 15% fat gives off enough to fry both the crust and the tortilla without leaving them greasy. For the guacamole, the avocados should give easily when you press near the stem.',
  headnoteInstructions:
    'Start the onions before anything else, since they need their 20 minutes, and make the guacamole while they sit. Have every topping ready before the first taco goes in, because each one takes only about 4 minutes and the pan never gets a rest. A 28cm pan fits one taco at a time, so the timing assumes two pans running side by side, about 25 minutes of cooking for all 12. With one pan, allow about 25 minutes more and eat them in rounds as they come off, which is the best way to eat them anyway, or hold them in a low oven.',

  equipment: [
    'A heavy frying pan that can take real heat, such as cast iron, carbon steel or thick stainless steel. Two pans, or a large flat griddle that fits two tortillas, halves the cooking time.',
    'A stiff, thin metal spatula, for pressing the tacos flat and scraping the crust up in one piece.',
  ],

  tips: [
    'Spread the beef thinner than looks right, and all the way to the edge. A thin layer crisps through before it has a chance to steam.',
    'On the beef side, press once, hard, in the first ten seconds, then leave it. Moving it or pressing again later breaks the crust and squeezes the juice out onto the pan. Pressing is for the tortilla side.',
    'Trust the rim. When the beef showing at the edge of the tortilla is deep brown and lacy, the underside is ready. Grey means it needs longer.',
    'Medium-high, not flat out. The beef needs a few minutes against the pan to crust, and the spices scorch and turn bitter on a pan that is smoking hard.',
    'Rest the cooked tacos on a rack, not a plate. On a plate the steam softens the underside you have just crisped.',
    'Lift the onions out of their lime with a fork before they go on, so the juice does not soak into the tortilla.',
    'Mince at 20% fat crisps a touch harder still and is very good here. It adds about 40 kcal a serving.',
  ],

  notes: [
    'Mince: lamb mince is very good in place of beef, with a pinch more cumin.',
    'Spice mix: about 2 tbsp of shop-bought taco seasoning can replace it. Taste a pinch first, since many are salty, and cut the added salt to match.',
    'Corn tortillas: they work and taste more of masa, but they are fragile. Warm them in a dry pan for a few seconds a side so they bend without cracking, spread the beef gently, and expect a crisper finish. They also make the tacos gluten-free.',
    'Cheese: check the label for "suitable for vegetarians", or buy a halal-certified one. Monterey Jack or Red Leicester melt just as well as cheddar.',
    'Chili: any fresh green chili works. Jalapeño is the mildest, serrano or a bird\'s eye chili hotter.',
    'Non-stick pan: a heavy one works, with a slightly lighter crust. Put the oil in before you heat it, keep it to medium-high, and use a firm nylon fish slice instead of the metal spatula.',
  ],

  variations: [
    'For smoky heat, work 1 tbsp of finely chopped chipotle in adobo into the beef along with the spices.',
    'Finish with a spoonful of salsa macha, Mexico\'s own crunchy chili oil, or the chili crisp you already keep in the cupboard, as long as it is one of the meat-free kinds.',
    'Busy night: skip the guacamole and lay thin slices of avocado over the beef with a squeeze of lime and a pinch of salt.',
  ],

  storage:
    'Best straight from the pan. The pickled onions keep in a jar in the fridge for up to a week and are even better on day two, so it is worth making extra. Guacamole keeps for a day with cling film pressed onto its surface, though it dulls. Cooked tacos lose their crunch in the fridge but come back well in a dry pan over medium heat for 2 to 3 minutes a side, or in an air fryer at 180°C for 3 to 4 minutes. You can also spread the beef onto the tortillas up to 2 hours ahead and keep them stacked between baking paper in the fridge. Much longer and the tortillas soften under the raw meat and can tear on the flip.',

  dropcap: true,

  image: 'https://images.unsplash.com/photo-1765100214386-917b0ce6db9e?w=1200&q=80',
  imageIsStock: true,
};

export default recipe;
