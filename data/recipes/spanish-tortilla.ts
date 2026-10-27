// data/recipes/spanish-tortilla.ts
import type { RecipeInput } from './_types';

const recipe: RecipeInput = {
  title: 'Spanish Tortilla',
  country: 'Spain',
  featuredIngredients: ['eggs', 'olive-oil'],
  category: 'main',
  difficulty: 'Medium',
  servings: 4,
  time: { active: 35, total: 75, resting: 10 },
  yield: 'One thick 20cm tortilla, 4 wedges as a meal or 8 as tapas',
  tags: ['vegetarian', 'budget-friendly', 'comfort food', 'meal-prep friendly'],

  region: 'Western Europe',
  coordinates: { lat: 40.0, lng: -3.7 },

  ingredients: [
    {
      heading: 'Potatoes and onion',
      items: [
        { name: 'all-rounder potatoes', amount: 600, unit: 'g', note: 1 },
        { name: 'onion, about 150g, halved and thinly sliced', amount: 1, unit: '', note: 2 },
        { name: 'mild olive oil', amount: 300, unit: 'ml', note: 3 },
        { name: 'fine salt, for the potatoes', amount: 0.5, unit: 'tsp' },
      ],
    },
    {
      heading: 'The tortilla',
      items: [
        { name: 'large eggs, ideally at room temperature', amount: 6, unit: '' },
        { name: 'fine salt, for the eggs', amount: 0.75, unit: 'tsp' },
      ],
    },
  ],

  steps: [
    {
      heading: 'Before you start',
      items: [
        'Peel the potatoes, cut each one lengthways into quarters (halves if they are small), then slice across as thinly as you can, about 3mm. Small, thin pieces pack together tightly, so the tortilla holds its shape and cuts cleanly. Do not rinse them: the starch on the surface helps everything bind.',
        'Halve and thinly slice the onion. Set a colander over a heatproof bowl next to the hob, ready to catch the oil, and crack the eggs into a bowl big enough to hold everything. If you plan to skip the flip and finish it in the oven, heat the oven to 180°C (160°C fan) now.',
      ],
    },
    {
      heading: 'Poach the potatoes and onion in oil',
      items: [
        'Pour the oil into a deep frying pan or wide saucepan, about 24cm across, and set it over medium heat. When a slice of onion dropped in sizzles gently, add all the onion and cook for 8 minutes, stirring now and then, until soft and translucent.',
        'Add the potatoes, turn them through the oil and lower the heat to medium-low. The oil will not cover them completely, and that is fine: turn them over every few minutes so every slice takes its turn underneath. Cook for 20 to 25 minutes, with lazy bubbles rather than a fierce fry, until the potatoes are completely tender and a slice breaks apart when you press it with the edge of a spoon. A few golden edges are good; if they start to brown properly or the oil starts to crackle and spit, turn the heat down. If you have a thermometer, keep the oil at about 100 to 120°C, far below frying heat: the potatoes should soften, not crisp.',
        'Tip everything into the colander over the bowl and leave it to drain for 2 minutes, giving it one shake. Scatter the half teaspoon of salt over the hot potatoes while they drain. Keep the oil: you need 3 tablespoons of it for the pan, and the rest is for another day.',
      ],
    },
    {
      heading: 'Soak in the egg',
      items: [
        'Beat the eggs with the three quarters of a teaspoon of salt until there are no streaks of white left, without whisking them frothy. Tip in the hot potatoes and onion and fold them through, gently crushing a few slices with the back of the spoon so they break up a little without turning to mash.',
        'Leave it to sit for 10 minutes. The heat of the potatoes starts to thicken the egg and the potatoes soak it up, so the mixture turns from runny to a thick, loose custard. This is what makes the tortilla creamy all the way through.',
      ],
    },
    {
      heading: 'Cook the first side',
      items: [
        'Heat 2 tablespoons of the kept oil in a 20cm non-stick frying pan over medium-high heat until it shimmers, about 1 to 2 minutes. Give the mixture a last stir and pour it in: it should sizzle at the edges. For the first 30 seconds, stir gently and shake the pan, drawing the setting edges in towards the middle like soft scrambled eggs, then smooth the top flat. It will come up high, about 4cm: if your pan is shallow and the mixture reaches within 1cm of the rim, move it to a 24cm pan (see the tips) rather than risk the flip.',
        'Turn the heat down to medium-low and cook for 4 to 5 minutes, running a spatula around the edge now and then to round it off, until the edge is set and the base is golden when you lift it. The middle should still be loose. Shake the pan: the tortilla should slide around as one disc. If any of it clings, loosen it with the spatula before you flip.',
      ],
    },
    {
      heading: 'The flip',
      items: [
        'Wet a flat plate a little wider than the pan, shake off the water, and lay it upside down over the pan. Stand over the sink, hold the plate flat with one hand and the handle with the other (a tea towel over it if it is hot), and turn the whole thing over in one quick, confident move. Hesitating is what spills it, so commit. Lift the pan away.',
        'Put the pan back over medium-low heat with 1 more tablespoon of the kept oil. Slide the tortilla back in, uncooked side down, and scrape any egg left on the plate over the top. Use the spatula to tuck the edges under so they round off neatly.',
        'Cook for 1 to 2 minutes for a jugosa tortilla, golden outside and soft in the very middle, or 3 to 4 minutes for one that is set all the way through. Press the centre gently: jugosa gives like a soft cushion, set feels springy. Or slip a thin knife into the middle: for jugosa it comes out with a little creamy egg on it, for set it comes out just moist. It keeps cooking as it rests, so take it off a touch softer than you want it. Slide it out onto a board or plate.',
        'Rather not flip? Use a lid instead. After the first side, cover the pan with a lid or a large plate, turn the heat to its very lowest and cook for 5 to 7 minutes, until the top is just set but still trembles in the middle. Slide it out pale side up, or, now that nothing on top can run, turn it out onto a plate so the golden base is on top. If your pan has an ovenproof handle, 8 to 10 minutes in the oven you heated at the start does the same job. Either way the tortilla comes out a little firmer than a flipped one, and nothing lands on the floor.',
      ],
    },
    {
      heading: 'Rest and serve',
      items: [
        'Leave the tortilla to rest for 10 minutes before cutting, so the middle settles. Serve it warm or at room temperature, cut into wedges, with a green salad or a hunk of bread.',
      ],
    },
  ],

  nutrition: { calories: 455, protein: 14, carbs: 30, fat: 31 },
  flavorProfile: { sweet: 2, salty: 2, sour: 0, bitter: 0, umami: 2, spicy: 0 },

  isVegetarian: true,
  isVegan: false,
  isGlutenFree: true,
  isDairyFree: true,

  quote:
    'Potatoes poached slowly in olive oil until they almost melt, soaked in beaten egg, and set into a thick golden round that is still soft in the middle.',
  description:
    'Tortilla de patatas is the dish Spain eats every day: eggs, potatoes, olive oil and salt, with onion if you are on that side of the argument, and this version is. The potatoes and onion are poached gently in olive oil rather than fried, so they turn soft and sweet instead of crisp, and then they go into the beaten egg while still hot and sit there for ten minutes. That soak is the whole secret, because it is what makes the tortilla custardy all the way through instead of an omelette with potatoes in it. It is cooked jugosa, golden outside and soft in the very centre, with timings for a firm one too. Nothing is wasted, since the oil is strained and saved for the next one, and if the flip makes you nervous there is a lid method that skips it entirely.',
  attribution: 'A Nieves\'s Kitchen take on a Spanish classic',

  headnoteIngredients:
    'Three ingredients do all the work, so it is worth getting them right. All-rounder potatoes like Maris Piper or Yukon Gold soften at the edges and help the tortilla bind while still keeping their shape. The 300ml of olive oil looks alarming, but most of it comes back out and keeps for the next tortilla, so use a mild, everyday olive oil rather than your best bottle. Large eggs at room temperature blend into the hot potatoes more smoothly than cold ones straight from the fridge.',
  headnoteInstructions:
    'This is low heat and patience, then ten seconds of nerve. The potatoes poach slowly, the egg soak cannot be rushed, and the first side cooks on low. The flip is the only tricky moment, and if you would rather avoid it, the lid method gives you a slightly firmer tortilla with no turning at all.',

  equipment: [
    'A 20cm non-stick frying pan with sides at least 5cm deep for the tortilla, plus a flat plate a little wider than it for the flip. The pan size sets the thickness, so with a 24cm pan you get a thinner tortilla and should shorten both sides by about a minute. A well-seasoned cast-iron or carbon steel pan works just as well if it is slick.',
  ],

  tips: [
    'Do not skip the 10-minute soak. Hot potatoes warm the egg and start to thicken it while they drink it in, so the tortilla cooks faster, more evenly and comes out creamy rather than rubbery.',
    'Poach, do not fry. The potatoes should bubble lazily in the oil and come out soft enough to break with a spoon, with barely any colour. Crisp, browned potatoes make a dry, crumbly tortilla.',
    'Keep the oil. Once it has cooled, strain it through a fine sieve into a clean jar and keep it somewhere cool and dark. It has a gentle onion flavour that is lovely in the next tortilla, for frying eggs or for roast potatoes, and it is good for two or three more uses, until it darkens or smells stale.',
    'Salt the potatoes as they come out of the oil, not in it. The salt clings to hot potatoes and the oil stays clean for next time.',
    'Match the pan to the eggs. Six eggs and 600g of potatoes in a 20cm pan gives a proper tall tortilla, about 4cm thick, so the pan needs sides at least 5cm deep. A 24cm pan gives a tortilla about 3cm thick that is easier to flip: cook each side about a minute less. To double the recipe, use a 26 to 28cm pan and give the first side an extra 3 to 4 minutes on low before flipping.',
    'If the flip goes wrong, do not worry. Slide it back into the pan, push the pieces together with the spatula and tuck the edges in: the runny egg glues it back together within a minute. If you are nervous, slide the tortilla out onto the plate first, cooked side down, then turn the empty pan upside down over it and flip plate and pan together.',
    'A jugosa tortilla has a soft, barely set centre. If anyone at the table avoids soft-cooked eggs, cook it the full 3 to 4 minutes after the flip so it is set all the way through.',
  ],

  notes: [
    'Potatoes: all-rounders such as Maris Piper or Yukon Gold. Waxy ones such as Charlotte keep their slices more distinct, floury ones such as King Edward break down into a softer tortilla; any of them works.',
    'Onion: a white or sweet Spanish onion gives the sweetest result. A red onion works too, with a slightly sharper edge.',
    'Olive oil: most of it comes back out and keeps, so use a mild everyday one, a light olive oil, or half olive oil and half sunflower. If you have a peppery extra virgin oil, use it for the 3 tablespoons in the pan, where you will actually taste it.',
  ],

  variations: [
    'Sin cebolla: leave out the onion for the purist version and add an extra 100g of potatoes in its place, poaching them for the full 25 minutes.',
    'For a tortilla to pack for lunch or a picnic, cook it set: 3 to 4 minutes after the flip, then let it cool completely before wrapping. It slices more neatly cold.',
    'Crisp tortilla: lightly crush a 125g bag of plain salted crisps into the 6 beaten eggs, leave out the salt, and let them soak for 5 to 10 minutes until soft. Then cook it exactly as above. It is ready in about 15 minutes and tastes surprisingly close to the real thing.',
    'Halal beef chorizo: dice 100g and fry it in a dry pan for 3 to 4 minutes until its red oil runs, then fold it into the egg with the potatoes. Fry it separately rather than in the poaching oil, so the oil stays clean to keep.',
    'Pincho de tortilla: serve a wedge on a slice of toasted bread with a spoonful of garlic aioli and a strip of roasted red pepper, the way it turns up on bar counters all over Spain.',
    'Not Spanish at all, but very good: fold a sliced fresh green chili through the egg and scatter chopped coriander over the finished tortilla.',
  ],

  storage:
    'Once cool, the tortilla keeps covered in the fridge for up to 3 days, though a jugosa one is best eaten within 2. Take it out 30 minutes before eating, since it tastes best at room temperature, or warm slices gently in a pan with a little oil. It does not freeze well, as the potatoes turn grainy and the egg weeps.',

  dropcap: true,

  image: 'https://images.unsplash.com/photo-1639669794539-952631b44515?w=1200&q=80',
  imageIsStock: true,
};

export default recipe;
