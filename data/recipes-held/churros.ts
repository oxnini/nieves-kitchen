// data/recipes-held/churros.ts
import type { RecipeInput } from '../recipes/_types';

const recipe: RecipeInput = {
  title: 'Churros with Thick Spanish Chocolate',
  country: 'Spain',
  category: 'dessert',
  difficulty: 'Medium',
  servings: 4,
  time: { active: 60, total: 65 },
  yield: 'About 20 to 24 churros, 12cm long, and 4 small cups of chocolate',
  tags: ['treat', 'vegetarian', 'comfort food'],

  region: 'Western Europe',
  coordinates: { lat: 40.4168, lng: -3.7038 },

  ingredients: [
    {
      heading: 'Thick chocolate',
      items: [
        { name: 'whole milk', amount: 250, unit: 'ml' },
        { name: 'cornflour', amount: 2, unit: 'tsp' },
        { name: 'caster sugar', amount: 1, unit: 'tbsp' },
        { name: 'fine salt, a pinch', amount: 0, unit: '' },
        { name: 'dark chocolate, 60 to 70% cocoa, finely chopped', amount: 100, unit: 'g' },
      ],
    },
    {
      heading: 'Churro dough',
      items: [
        { name: 'water', amount: 250, unit: 'ml' },
        { name: 'unsalted butter', amount: 30, unit: 'g' },
        { name: 'caster sugar', amount: 1, unit: 'tbsp' },
        { name: 'fine salt', amount: 0.5, unit: 'tsp' },
        { name: 'plain flour', amount: 150, unit: 'g' },
        { name: 'large egg, at room temperature', amount: 1, unit: '' },
        { name: 'alcohol-free vanilla extract', amount: 0.5, unit: 'tsp' },
      ],
    },
    {
      heading: 'To fry and coat',
      items: [
        { name: 'sunflower oil, for frying (enough for 3cm in the pan)', amount: 1000, unit: 'ml' },
        { name: 'caster sugar', amount: 100, unit: 'g' },
        { name: 'ground cinnamon', amount: 1.5, unit: 'tsp' },
        { name: 'unsalted butter, melted (air-fryer route only)', amount: 20, unit: 'g' },
      ],
    },
  ],

  steps: [
    {
      heading: 'Before you start',
      items: [
        'Stir the 100g of caster sugar and the cinnamon together in a wide, shallow dish. Line a tray with a double layer of kitchen paper and set both beside the hob.',
        'Fit a sturdy piping bag with a closed star nozzle about 1cm across. If you only have disposable bags, use two, one inside the other, because this dough is stiff enough to split a single one. Set it upright in a tall glass, with the top folded over the rim, ready to fill.',
        'Beat the egg and the vanilla together in a small bowl with a fork.',
      ],
    },
    {
      heading: 'The chocolate, first',
      items: [
        'In a cup, whisk the cornflour with 3 tablespoons of the cold milk until there are no lumps.',
        'Pour the rest of the milk into a small saucepan with the tablespoon of sugar and the pinch of salt, and warm it over medium heat until it steams, about 3 minutes. Take it off the heat, add the chopped chocolate, leave it for 1 minute, then whisk until smooth.',
        'Whisk the cornflour mix again, pour it in, and put the pan back over medium-low heat. Whisk constantly, getting into the corners where it catches, until it bubbles and thickens, 2 to 3 minutes, then let it bubble gently for 1 minute more so the cornflour loses its raw taste. It is ready when it coats the back of a spoon thickly and a finger drawn through it leaves a clear line. Turn off the heat and put a lid on. It thickens further as it stands, which is what you want.',
      ],
    },
    {
      heading: 'Get the oil going, safely',
      items: [
        'Use a heavy saucepan about 20 to 22cm across and at least 10cm deep, and make sure it and everything that will touch the oil is completely dry, since a drop of water makes hot oil spit hard. Pour in oil to 3cm deep, about 1 litre. It must come no more than a third of the way up the pan, because the oil rises and bubbles up when the dough goes in.',
        'Clip on a thermometer if you have one, and set the pan over medium heat. It takes about 15 minutes to reach 180°C, roughly the time the dough takes, so make the dough now but stay in the kitchen. Keep a lid or a baking tray within reach: if the oil ever smokes, take it off the heat, and if it ever catches, turn off the heat and slide the lid over it. Never put water on it.',
      ],
    },
    {
      heading: 'The dough',
      items: [
        'Put the water, butter, tablespoon of sugar and half teaspoon of salt in a medium saucepan over medium-high heat. Bring it to a full rolling boil with the butter completely melted. A proper boil matters: the flour needs to cook the instant it lands.',
        'Turn the heat to low and tip in all the flour at once. Beat hard with a wooden spoon. It looks lumpy for a few seconds, then within about 30 seconds comes together into a smooth ball that pulls away from the sides. Keep pressing and turning it over the low heat for 1 minute more, until a thin film coats the base of the pan. This dries and cooks the paste, and a drier paste is what fries up cooked through instead of gummy.',
        'Tip the dough into a bowl and spread it out with the spoon so it cools evenly. Leave it for 5 to 10 minutes, until it is 55 to 60°C: still very warm, but you can press a finger into it and hold it there for a couple of seconds. Any hotter and it cooks the egg into scraps; much cooler and it gets too stiff to pipe.',
        'Add the egg in two goes, beating hard after each. It looks slippery and separated at first. Keep beating for about 1 minute and it comes back together into a smooth, glossy, stiff dough that holds a firm peak.',
        'Spoon it into the piping bag, pressing each spoonful down with a spatula so there are no air pockets, then twist the top shut. Trapped air is the other thing, after a smooth nozzle, that makes churros burst in the oil. Squeeze a little out into the bowl to push out any air left in the nozzle. It pipes most easily while still warm, so start frying as soon as the oil is ready.',
      ],
    },
    {
      heading: 'Fry, in small batches',
      items: [
        'Check the oil is at 180°C. With no thermometer, drop in a pea-sized piece of dough: it should sizzle at once with a lively ring of bubbles and float up within a few seconds. If it sinks and sits there quietly, the oil is too cool. If it darkens within 15 seconds, it is too hot, so take the pan off the heat for a couple of minutes.',
        'Fry one test churro first. Hold the nozzle just above the surface of the oil, so the dough has no distance to fall and splash, and squeeze out a 12cm length. It comes out a little fatter than the nozzle and puffs to about 1.5cm thick in the oil. Snip it off at the nozzle with scissors dipped in the hot oil. If piping over hot oil makes you nervous, pipe each length onto a small square of baking paper instead and lower it in, paper and all, with tongs; after about 20 seconds the paper floats free and you lift it out. Fry for 3 to 4 minutes, turning it halfway with tongs, until deep golden all over with crisp, darker ridges.',
        'Lift it onto the kitchen paper, wait 1 minute, then break it in half. The inside should be soft, airy and set, like a cooked eclair, with no wet, glossy dough in the middle. If the centre is wet, the oil is too hot and browned the outside first: lower it to 175°C and give the next ones a minute longer. If the churro is pale and greasy, the oil is too cool, so turn it up a little.',
        'Now fry the rest in batches of 3 or 4, no more, a few centimetres apart. Crowding drops the oil temperature and gives you heavy, oily churros. Fry each batch for 3 to 4 minutes, turning halfway, and let the oil come back to 180°C, about 1 minute, before the next one.',
        'Drain each batch on the kitchen paper for 30 seconds, then roll them straight away in the cinnamon sugar while they are hot. The thin film of hot oil is what holds the sugar, and it slides off a cold churro. Pile them on a plate and carry on until the dough is used up.',
        'Turn off the heat under the oil as soon as the last batch is out, and leave the pan on a back burner until the oil is completely cold, at least an hour, before you move it.',
        'Rather not deep fry? Use an air fryer instead of the oil and the frying steps above. As soon as the dough is in the bag, pipe 10cm lengths onto a tray lined with baking paper and freeze for 30 minutes, so they hold their ridges. Heat the air fryer to 190°C for 3 minutes. Peel the churros off the paper, lay them in the basket in a single layer with space between them, and brush or spray them all over with sunflower oil, since any dry patch stays pale and floury. Cook for 10 to 12 minutes, turning halfway, until deep golden. Break one open, and give them 2 minutes more if the middle is still wet. Brush with 20g melted butter while hot, then roll in the cinnamon sugar. Honestly, they come out crisp-shelled but drier and lighter, more like a crunchy choux finger than a fried churro, with shallower ridges, and the crust softens within about 10 minutes. Very good for a small batch with no pan of oil to deal with; for the real thing, fry.',
      ],
    },
    {
      heading: 'To serve',
      items: [
        'Warm the chocolate over low heat for 1 to 2 minutes, whisking, and loosen it with a splash of water or milk if it has set too thick to dip. Pour it into small cups or bowls and serve with the churros straight away, while they still crackle.',
      ],
    },
  ],

  nutrition: { calories: 620, protein: 10, carbs: 66, fat: 36 },
  flavorProfile: { sweet: 4, salty: 1, sour: 0, bitter: 2, umami: 0, spicy: 0 },

  isVegetarian: true,
  isVegan: false,
  isGlutenFree: false,
  isDairyFree: false,

  quote:
    'Ridged churros, crackling under a coat of cinnamon sugar, dunked in a dark chocolate thick enough to cling to every ridge.',
  description:
    'Churros con chocolate is the Spanish late breakfast or after-midnight snack: piped lengths of fried dough, crisp at every ridge, dunked in a hot chocolate so thick it is closer to a dip than a drink. This version uses the dough with egg, which fries up crisp outside with a soft, airy middle. The method is built so it works the first time. The flour paste is cooked until it films the pan, so the inside sets instead of staying gummy. The dough goes into the bag at a set warmth, with the air pressed out. A closed star nozzle gives deep ridges that crisp and let steam escape, so nothing bursts. You fry one test churro and break it open before the rest. The chocolate is made first and holds happily while you fry. An air-fryer step sits beside the frying for a small batch without a pan of oil, and the variations cover the plain Spanish eggless dough and churros frozen ahead to fry from frozen.',
  attribution: 'A Nieves\'s Kitchen take on Spanish churros con chocolate',

  headnoteIngredients:
    'Plain flour, not self-raising: the egg and the steam do the lifting. One egg gives a softer, more tender middle than the plain Spanish flour-and-water dough while staying firm enough to pipe with sharp ridges. Room temperature matters for the egg, because a cold one stiffens the warm dough before it blends in. For the chocolate, use a plain dark bar of 60 to 70% cocoa and whole milk. Read the chocolate label, since a few bars, especially flavoured or filled ones, carry alcohol-based flavourings; most plain dark chocolate lists none. The vanilla must be alcohol-free, which supermarkets sell next to the usual extract. Sunflower oil is neutral and takes the heat well.',
  headnoteInstructions:
    'Make the chocolate first, because it holds and only needs warming at the end. Put the oil on next: it takes about as long to heat as the dough takes to make. After that the frying is a steady rhythm of pipe, snip, turn, lift and sugar. Break open the first churro before you fry the rest. It tells you whether the oil is right, and it is the one step that guarantees no raw middles. If you are using the air fryer instead, skip the oil entirely and read its step at the end of the frying before you start, because the piped churros need 30 minutes in the freezer.',

  equipment: [
    'A piping bag with a closed star nozzle about 1cm across. Its deep ridges let steam out and give the crisp edges, so a round nozzle or a snipped bag will not do here. Two disposable bags, one inside the other, work if you have no reusable bag.',
    'A heavy saucepan about 20 to 22cm across and at least 10cm deep, so 3cm of oil fills it no more than a third of the way.',
    'A cooking thermometer for the oil, ideally one that clips to the pan. Without one, the dough test in the method gets you close.',
  ],

  tips: [
    'The nozzle must be a closed star. A smooth tube of dough seals over in the hot oil while steam builds inside, and it can burst in the pan or when you bite into it. Ridges give the steam somewhere to escape and give you more edges to crisp.',
    'Break open the first churro, every time. It costs you one churro and tells you exactly how to set the oil for the rest, so you never serve a raw middle.',
    'Hold the oil at 180°C. Too hot browns the outside before the middle sets; too cool soaks oil into the dough. Batches of 3 or 4 and a minute of recovery between them keep it steady.',
    'Keep them about 12cm long and piped straight from a 1cm nozzle, so they fry to about 1.5cm thick. Fatter churros brown on the outside before the centre is cooked.',
    'Sugar them within a minute of leaving the oil. Once they cool, the sugar will not stick.',
    'To keep the first batches warm while you fry the rest, set them on a rack over a tray in a 120°C (100°C fan) oven. They hold well for 15 minutes.',
  ],

  substitutions: [
    'Salted butter in place of unsalted: leave out the half teaspoon of salt in the dough.',
    'Vegetable, rapeseed or groundnut oil all fry as well as sunflower. Light olive oil works too, and some Spanish churrerías use it. Avoid extra virgin, which smokes at this heat and tastes bitter.',
    'For a sweeter, milder chocolate, use a 50 to 55% dark chocolate and leave out the tablespoon of sugar.',
    'Semi-skimmed milk makes a slightly thinner chocolate. Add an extra half teaspoon of cornflour to make up for it.',
    'No vanilla? Leave it out. It is a small background note and the churros are still very good.',
  ],

  variations: [
    'Spanish eggless churros: crisper, chewier and plainer, the way most Madrid churrerías make them. Boil 250ml water with half a teaspoon of salt and 1 tablespoon of sunflower oil (no butter or sugar), turn the heat to low, tip in 150g plain flour and beat for 1 minute into a smooth, very stiff dough. Skip the cooling and the egg. Pipe it while still warm, holding the bag in a tea towel. It is hard work through a piping bag, so a churrera (a churro press) makes it easier. Fry at 180°C for 3 to 4 minutes. For a slightly lighter middle, whisk 1 teaspoon of baking powder into the flour first. Made this way, the dough is dairy-free and egg-free.',
    'Freeze ahead: pipe 12cm lengths onto a tray lined with baking paper and freeze until solid, about 1 hour, then bag them for up to 1 month. Fry from frozen, brushing off any frost first, at 175°C for 4 to 5 minutes, turning halfway. The slightly lower oil lets the middle thaw and cook before the outside darkens, and lowering ready-shaped churros into the oil is the calmest way to fry them.',
    'Dulce de leche dip, instead of the chocolate or alongside it: warm 200g dulce de leche with 2 to 3 tablespoons of milk and a pinch of flaky salt, whisking until it pours.',
    'Cardamom sugar: add a quarter teaspoon of ground cardamom to the cinnamon sugar. It is warm and floral with the chocolate.',
  ],

  storage:
    'Churros are best within 15 minutes of frying. Leftovers keep for a day in an airtight box at room temperature (the fridge makes them soft). Bring them back in a 180°C (160°C fan) oven for 5 minutes, or the air fryer at 180°C for 3 minutes, until crisp. The chocolate keeps covered in the fridge for 3 days and sets firm; warm it gently with a splash of milk, whisking. Once cold, the frying oil can be strained through kitchen paper and used once or twice more for sweet frying.',

  dropcap: true,

  image: 'https://images.unsplash.com/photo-1515579171902-e0c5f918b32b?w=1200&q=80',
  imageIsStock: true,
};

export default recipe;
