// data/recipes/yam-talay.ts
import type { RecipeInput } from './_types';

const recipe: RecipeInput = {
  title: 'Yam Talay',
  country: 'Thailand',
  category: 'main',
  difficulty: 'Easy',
  servings: 2,
  time: { active: 40, total: 50 },
  yield: 'Serves 2 as a main with jasmine rice or glass noodles, or 4 to share as part of a Thai meal',
  tags: ['spicy', 'high-protein'],

  region: 'Southeast Asia',
  coordinates: { lat: 13.3611, lng: 100.9847 },

  ingredients: [
    {
      heading: 'The seafood',
      items: [
        { name: 'raw king prawns, peeled and deveined (about 250g shell-on)', amount: 200, unit: 'g', note: 1 },
        { name: 'squid, cleaned tubes and tentacles', amount: 200, unit: 'g', note: 2 },
      ],
    },
    {
      heading: 'The poaching water',
      items: [
        { name: 'water', amount: 1000, unit: 'ml' },
        { name: 'salt', amount: 1, unit: 'tsp' },
      ],
    },
    {
      heading: 'The dressing',
      items: [
        { name: 'bird\'s eye chilies, a mix of red and green', amount: 4, unit: '', note: 3 },
        { name: 'small garlic cloves (or 2 large)', amount: 3, unit: '' },
        { name: 'coriander roots, scraped clean', amount: 2, unit: '', note: 4 },
        { name: 'palm sugar, finely chopped or grated, packed', amount: 1, unit: 'tbsp', note: 5 },
        { name: 'fish sauce, plus a little more to taste', amount: 2.5, unit: 'tbsp', note: 6 },
        { name: 'fresh lime juice, from 2 to 3 limes', amount: 4, unit: 'tbsp' },
        { name: 'Thai chili jam (nam prik pao), optional', amount: 1, unit: 'tbsp', note: 7 },
      ],
    },
    {
      heading: 'The salad',
      items: [
        { name: 'small red onion, halved and sliced thinly from root to tip', amount: 1, unit: '', note: 8 },
        { name: 'lemongrass stalk', amount: 1, unit: '' },
        { name: 'inner celery sticks with their leaves', amount: 2, unit: '', note: 9 },
        { name: 'cherry tomatoes, halved', amount: 150, unit: 'g' },
        { name: 'spring onions, cut into 3cm lengths', amount: 2, unit: '' },
        { name: 'coriander, leaves and tender stems, roughly chopped', amount: 30, unit: 'g' },
        { name: 'mint leaves', amount: 10, unit: 'g' },
      ],
    },
    {
      heading: 'To serve',
      items: [
        { name: 'jasmine rice', amount: 150, unit: 'g', note: 10 },
        { name: 'water, for the rice', amount: 250, unit: 'ml' },
        { name: 'fresh green chili, thinly sliced, to finish (optional)', amount: 0, unit: '' },
      ],
    },
  ],

  steps: [
    {
      heading: 'Before you start',
      items: [
        'If your prawns or squid are frozen, thaw them first: overnight in the fridge, or sealed in a food bag and sunk in a bowl of cold water for about 30 minutes.',
        'Put the rice on, because everything else is quick. Rinse the jasmine rice in a sieve until the water runs almost clear, then tip it into a small pan with the 250ml of water. Bring it to the boil, put the lid on, turn the heat to its lowest setting and cook for 12 minutes. Take it off the heat and leave it to rest, lid on, for 10 minutes. A rice cooker works just as well. Having glass noodles instead? Skip the rice and put the noodles to soak now (see note 10).',
      ],
    },
    {
      heading: 'Prepare the seafood',
      items: [
        'Put the litre of water and the salt into a medium saucepan (about 20cm), cover it and set it over a low heat.',
        'The prawns. If they have heads, twist them off. Peel the shell away from the underside, starting at the legs, and pinch off the tail or leave it on for looks. Drop every head and shell into the saucepan as you go: they turn the water into a quick prawn stock. To devein raw prawns, run a small sharp knife about 3mm deep along the curved back and lift out any dark thread. Pat the prawns dry and keep them in the fridge. Cooked prawns are peeled the same way, without heating them (see note 1).',
        'Once all the shells are in, turn the heat up and bring the pan to the boil, then turn it down so it bubbles gently, lid on. Leave it simmering while you do everything else, at least 10 minutes and up to 30. The longer it goes, the more it tastes of prawn.',
        'The squid, if you bought it whole. Pull the head away from the body: the tentacles and most of the insides come with it. Cut the tentacles off just in front of the eyes so they stay joined in a ring, and squeeze out the small hard beak from the middle. Pull the clear quill out of the body, rinse the inside, and peel off the speckled skin and the two fins (slice the fins and cook them with the rest). If you bought cleaned tubes, start from the next step.',
        'Score the squid. Slice each tube down one side, open it out flat, inside facing up, and pat it dry. With a sharp knife at a slight angle, cut diagonal lines 5mm apart across the inside, about halfway through, then the other way to make a criss-cross. Cut into pieces about 4cm by 5cm, and halve the tentacles if they are large. Scored squid stays tender, curls into little pine cones as it cooks, and the grooves hold the dressing.',
      ],
    },
    {
      heading: 'The dressing',
      items: [
        'Roughly chop the coriander roots and chilies, then pound them in a mortar with the garlic to a rough paste, about 1 minute. Add the palm sugar and pound until it melts in, then stir in the fish sauce and lime juice, and the chili jam if you are using it. No mortar? Grate the garlic, chop the chilies and roots as finely as you can, and stir everything together until the sugar dissolves.',
        'Scrape the dressing into a large mixing bowl and taste it. On its own it should be almost too strong: sour first, then salty, then hot, with the sweetness only rounding it off. Do not adjust it yet; the real tasting happens on the seafood.',
      ],
    },
    {
      heading: 'Slice the salad',
      items: [
        'Peel the tough outer layers off the lemongrass and trim the root. Slice the pale bottom third into paper-thin rounds. Bash the green top with the back of your knife, cut it in two and drop it into the simmering pan.',
        'Add the sliced onion and lemongrass to the dressing in the bowl, where they soften a little while the seafood cooks.',
        'Slice the celery thinly on an angle, leaves and all, and put it in a separate bowl with the tomatoes, spring onions, coriander and mint. These go in last, so they stay crisp and bright.',
      ],
    },
    {
      heading: 'Cook the seafood, one kind at a time',
      items: [
        'By now the water should be faintly orange and smell of prawns. Lift out the shells, heads and lemongrass with a slotted spoon or a small sieve. No shells? Simmer the water with the lemongrass top for 5 minutes instead, then lift it out. Turn the heat to high and bring the pan to a rolling boil. If you are serving glass noodles, boil them now (see note 10).',
        'The prawns go in first. Tip them in, stir once and turn the heat off straight away. Leave them in the hot water for 2 to 3 minutes (smaller prawns 1 to 2), until they are pink all over and curled into a loose C. Cut the biggest one in half: it should be opaque white right through. A tight O means they have gone too far. Lift them out with the slotted spoon and drop them straight into the dressing. Toss. Using cooked prawns? Do not heat them: add them to the dressing now and go straight on to the squid.',
        'Turn the heat back to high and let the water come back to a full rolling boil. Add the squid and cook for 30 to 60 seconds (thin tubes nearer 30), only until it turns from see-through to opaque white and the scored pieces curl. Lift it out at once and into the dressing. A faintly glassy centre is fine: it finishes in the warm bowl, and overcooked squid turns to rubber.',
        'Spoon 3 tablespoons of the cooking water into the mortar, swirl it round to catch the last of the paste, and pour it into the bowl (no mortar? Spoon it straight in). It loosens the dressing and carries the taste of the seafood back into it.',
      ],
    },
    {
      heading: 'Toss and serve',
      items: [
        'Toss everything in the bowl and leave it for 2 minutes, so the warm seafood drinks up the dressing. Then add the celery, tomatoes, spring onions and most of the herbs, and toss gently.',
        'Taste a piece of prawn with a little onion and dressing. Flat? Add a squeeze more lime. Not salty enough? A splash of fish sauce. Too sharp or too hot? A pinch more sugar. Not hot enough? Another chili, chopped fine. It should taste bright and sour-led, with salt, heat and a little sweetness holding it together.',
        'Eat it now, still warm, or cover the bowl and chill it in the fridge for at least 30 minutes, where it keeps soaking up the dressing. Either way, pile it onto a plate with all its dressing, scatter over the rest of the herbs and the sliced green chili, and serve with the rice, spooning the dressing over it as you go.',
      ],
    },
  ],

  nutrition: { calories: 540, protein: 42, carbs: 86, fat: 3 },
  flavorProfile: { sweet: 1, salty: 3, sour: 4, bitter: 0, umami: 3, spicy: 4 },

  isVegetarian: false,
  isVegan: false,
  isGlutenFree: true,
  isDairyFree: true,

  quote:
    'Prawns and squid, each cooked for its own few seconds and tossed while still warm in a sharp lime, chili and fish sauce dressing, with lemongrass, celery and a heap of fresh herbs.',
  description:
    'This is my favourite dish ever. Yam talay is a Thai seafood salad: yam is the family of Thai salads dressed with lime, fish sauce, chili and a little sugar, and talay means the sea. There are no leaves in it. The seafood is the salad, with crisp celery, tomatoes, onion and a pile of herbs for freshness, and it is eaten with rice or glass noodles to catch the dressing. This version keeps the dressing clear and sour-led, with a spoon of Thai chili jam as an option if you want it richer. The prawns and squid are cooked one at a time, each for its own few seconds, in water flavoured with the prawn shells and lemongrass, then dropped hot into the dressing so they soak it up. I like it best cold, made ahead and left in the fridge, and it finishes the way I like most things, with fresh green chili and coriander piled on top.',
  attribution: 'A Nieves\'s Kitchen take on a Thai classic',

  headnoteIngredients:
    'Good seafood is the whole dish, so buy the best prawns and squid you can, and frozen is no compromise for either. Shell-on prawns give you the shells for the poaching water. The heat here suits a sour-led salad with a proper kick, but heat is personal, so set the chilies to your taste. The nutrition is for the salad with jasmine rice.',
  headnoteInstructions:
    'Get the rice on first, then do all the prep: the seafood cleaned, the dressing pounded and the salad sliced. After that the cooking takes about ten minutes. Let the prawn shells simmer in the pot while you prep, so the poaching water becomes a light stock. Cook each seafood on its own, take it out a little early rather than late, and let it go straight into the dressing while it is hot. It is good warm, and even better chilled.',

  equipment: [
    'A mortar and pestle for the dressing, which pounds the garlic, chilies and coriander roots into a paste that flavours every drop. No mortar? Grate the garlic and chop the rest as finely as you can, and it works almost as well.',
  ],

  tips: [
    'Taste the dressing on a piece of seafood, not from the spoon. On its own it should be too strong; once it coats prawns, onion and tomato it settles. Adjust only after that first bite.',
    'Pull the seafood early. Prawns are done the moment they curl into a loose C, and squid the moment it turns opaque and curls. Both keep cooking in the warm bowl, and an extra 30 seconds is the difference between tender and tough.',
    'Let the water come back to a full rolling boil before the squid goes in. Seafood that sits in water that is merely hot cooks slowly and unevenly.',
    'Make it ahead if you like. Chilled for 30 minutes or more, the seafood soaks up more of the dressing and the flavours settle. Keep back a handful of herbs and add them just before serving, so they are still bright.',
    'Lemongrass is only tender in its pale bottom third. Slice that part paper-thin, so it reads as fragrance rather than fibre, and put the woody top in the pot instead of the bin.',
  ],

  notes: [
    'Prawns: raw prawns cook in the poaching water and soak up the dressing best. Good-quality cooked prawns are fine too: buy them shell-on if you can, peel them without heating them, and add them straight to the dressing (their shells still go in the pot).',
    'Squid: look for white to pale ivory squid that smells clean of the sea; small tubes, 10 to 15cm long, are the most tender. No squid? Use cuttlefish, cleaned the same way (it has a flat white bone where squid has its quill), scored and cooked for up to 1 minute 30 seconds, until opaque.',
    'Chilies: 4 gives a sour-led salad with a proper kick, and up to 6 makes it fiery. For less heat, scrape out the seeds and pith rather than using fewer, so you keep the chili flavour.',
    'Coriander roots: they come with the bunches sold in Asian grocers. No roots? Use 1 tablespoon of finely chopped coriander stems.',
    'Palm sugar: light brown sugar works in the same amount, or 2 teaspoons of honey.',
    'Fish sauce: a good one lists little more than anchovies and salt. Some contain wheat, so check the label if you need the dish gluten-free.',
    'Chili jam (nam prik pao): optional. A spoonful makes the dressing richer, slightly sweeter and reddish; without it you have the classic clear lime and fish sauce dressing. It is sold in jars at Asian shops; check the label.',
    'Red onion: 3 shallots give a sweeter, gentler bite, as they would in Thailand.',
    'Celery: the pale inner sticks of ordinary celery, with their leaves, are thinner and leafier than the outer stalks and close to Chinese celery. If you find Chinese celery, use a small handful.',
    'Glass noodles: to serve instead of rice, soak 80g dried glass (mung bean) noodles in room-temperature water for at least 10 minutes while you prep, then drain and snip them shorter. Boil them in the poaching water for 1 minute, until clear, lift them out with tongs or a sieve, and toss them into the dressing before the seafood, adding an extra 2 tablespoons of lime juice and 1 tablespoon of fish sauce, since they drink it up.',
  ],

  variations: [
    'Other seafood. Scallops take about 1 minute in the boiling water. Cubes of firm white fish take about 2 minutes; toss them in last and gently, so they do not break up.',
    'With clams. Soak 500g of live clams in cold, well-salted water for 30 minutes so they spit out any sand, then rinse. Steam them in a pan with 2.5cm of boiling water, lid on, for 1 to 2 minutes, until they open, and throw away any that stay shut. Use 3 tablespoons of their briny cooking liquid in place of the poaching water in the dressing, and Thai basil in place of the mint.',
    'Toasted rice powder for a nutty crunch. Toast 1 tablespoon of sticky or jasmine rice in a dry pan over medium-low heat for 5 to 8 minutes, shaking often, until deep golden. Grind it in the mortar to the texture of fine sand and scatter a couple of teaspoons over the finished salad.',
    'Crispy garlic on top. Slice 4 garlic cloves thinly, put them in a cold small pan with 3 tablespoons of neutral oil and cook over medium-low heat for 3 to 5 minutes, stirring, until pale gold. Lift them onto kitchen paper straight away and scatter over just before serving. Ready-made fried garlic from Asian shops is fine too; check the label says vegetable oil.',
    'Grilled squid, for smoke. Score the opened-out tubes but leave them whole, pat them very dry and toss them with a teaspoon of oil. Sear them on a smoking-hot griddle or heavy frying pan for about 1 minute a side, until charred at the edges, then cut them into pieces and toss them into the dressing in place of blanching.',
    'If you have makrut lime leaves, roll 2 or 3 up tightly, slice them hair-thin and toss them through with the herbs.',
  ],

  storage:
    'Good warm and even better cold. Covered in the fridge, the dressed salad keeps for up to 1 day; the herbs soften, so add a few fresh ones before serving. Eat it cold rather than reheating it, which toughens the seafood. To get further ahead, the dressing keeps in a jar in the fridge for 2 to 3 days, and the seafood can be cleaned and scored in the morning and kept covered in the fridge.',

  dropcap: true,

  image: 'https://images.unsplash.com/photo-1781639250755-f49e6120a78d?w=1200&q=80',
  imageIsStock: true,
};

export default recipe;
