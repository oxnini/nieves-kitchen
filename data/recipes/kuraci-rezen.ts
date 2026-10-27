// data/recipes/kuraci-rezen.ts
import type { RecipeInput } from './_types';

const recipe: RecipeInput = {
  title: 'Kurací Rezeň',
  country: 'Slovakia',
  featuredIngredients: ['chicken'],
  category: 'main',
  difficulty: 'Medium',
  servings: 4,
  time: { active: 65, total: 220, resting: 120 },
  yield: 'Serves 4, one large schnitzel each with potato salad',
  tags: ['high-protein', 'comfort food', 'weekend feast'],

  region: 'Eastern Europe',
  coordinates: { lat: 48.7164, lng: 21.2611 },
  influences: ['Slovakia', 'Austria'],

  ingredients: [
    {
      heading: 'Slovak potato salad',
      items: [
        { name: 'waxy potatoes, scrubbed but not peeled', amount: 800, unit: 'g', note: 1 },
        { name: 'carrots, peeled and left whole', amount: 2, unit: '' },
        { name: 'frozen peas', amount: 100, unit: 'g' },
        { name: 'small onion, very finely chopped', amount: 1, unit: '' },
        { name: 'sweet-sour pickled gherkins, about 120g, finely diced', amount: 4, unit: '' },
        { name: 'brine from the gherkin jar, plus a splash more to loosen', amount: 4, unit: 'tbsp' },
        { name: 'mayonnaise', amount: 150, unit: 'g', note: 2 },
        { name: 'mild mustard', amount: 2, unit: 'tsp', note: 3 },
        { name: 'sugar', amount: 0.25, unit: 'tsp' },
        { name: 'salt and black pepper, to taste', amount: 0, unit: '' },
      ],
    },
    {
      heading: 'Schnitzel',
      items: [
        { name: 'small halal chicken breasts, about 600g in all', amount: 4, unit: '', note: 4 },
        { name: 'fine salt, plus a pinch for the cooked schnitzels', amount: 1, unit: 'tsp' },
        { name: 'black pepper', amount: 0.5, unit: 'tsp' },
        { name: 'plain flour', amount: 60, unit: 'g', note: 5 },
        { name: 'eggs', amount: 2, unit: '' },
        { name: 'water', amount: 1, unit: 'tbsp', note: 6 },
        { name: 'sunflower oil, for the egg', amount: 1, unit: 'tbsp' },
        { name: 'fine dried breadcrumbs, not panko', amount: 150, unit: 'g', note: 5 },
        { name: 'sunflower oil, for frying', amount: 600, unit: 'ml' },
        { name: 'lemon, cut into wedges', amount: 1, unit: '' },
      ],
    },
  ],

  steps: [
    {
      heading: 'The potato salad, ideally the day before',
      items: [
        'Put the whole unpeeled potatoes and the whole carrots in a large pan, cover with cold water by about 2cm and salt it well. Bring to the boil, then turn down to a steady simmer. Lift the carrots out after 15 to 20 minutes, once a knife slides in easily. Give the potatoes 20 to 25 minutes from when the water boils, until a knife meets just a little resistance at the very centre. They should hold their shape when sliced, not crumble. Drain and leave them to steam dry for 15 minutes, until you can handle them.',
        'While they cook, put the chopped onion in a large bowl with 2 tablespoons of the gherkin brine, the sugar and a pinch of salt. Twenty minutes in the brine takes the harsh edge off raw onion. Put the frozen peas in a small bowl, cover them with boiling water from the kettle, leave for 2 minutes and drain.',
        'Peel the potatoes while they are still warm, when the skins slip off easily, and slice them into 5mm half-moons. Dice the carrots small. Add both to the onion bowl, pour over the remaining 2 tablespoons of brine and toss gently. Warm potatoes drink up the brine, which seasons them all the way through. Leave them to cool completely, about 30 minutes. Mayonnaise turns oily on warm potatoes.',
        'Add the gherkins, peas, mayonnaise and mustard and fold everything together gently, so the slices stay whole. Season with salt and pepper. It should be creamy and a little loose. If it looks stiff, add a splash more brine from the jar. Cover and chill for at least 2 hours, ideally overnight.',
      ],
    },
    {
      heading: 'Prepare the chicken',
      items: [
        'Take the potato salad out of the fridge so it loses its hard chill while you cook. Lay a chicken breast flat and slice into it horizontally from the thick side, almost all the way through, then open it out like a book. Put it between two sheets of cling film or baking paper and pound it with a rolling pin or the base of a heavy pan, working from the middle outwards, to an even 5mm all over. Repeat with the rest. Even thickness is what lets the meat cook through in the time it takes the crust to brown.',
        'Set out three wide plates in a row. Put the flour on the first. On the second, beat the eggs with the water and the tablespoon of oil, just until combined. Put the breadcrumbs on the third. Heat the oven to 120°C (100°C fan) and set a wire rack over a tray beside the hob, ready to slide into the oven with the cooked schnitzels.',
        'Pour the frying oil into a large, deep frying pan to a depth of about 1cm and heat it over medium-high heat to 170 to 175°C. Without a thermometer, drop in a pinch of breadcrumbs: they should fizz at once and float, and turn golden in about 30 seconds. If it climbs past 180°C or starts to smoke, take the pan off the heat for a minute.',
      ],
    },
    {
      heading: 'Coat and fry',
      items: [
        'Season the cutlets on both sides with the salt and pepper now, not earlier, since salt left to sit draws out moisture and the coating slides off. Coat each one only when the pan is ready for it. Turn it through the flour and shake off the excess, then through the egg, letting the extra drip back onto the plate. Lay it in the crumbs, scatter more crumbs over the top and pat them on lightly with your palm, just enough to cling, then lift it and give it a shake. Do not press. A loose coat is the one that puffs.',
        'Lay the schnitzel in the oil, away from you. Straight away start swirling the pan gently in small circles, or spoon hot oil over the top, so the oil keeps washing over the upper side. Within a minute the crumb blisters and lifts away from the meat in golden waves. Fry for 2 to 3 minutes, until the underside is deep golden.',
        'Turn it carefully with a fish slice and tongs, never a fork, which pierces the crust and lets the steam out. Fry the second side for about 2 minutes, still swirling, until it matches. The chicken is done when the thickest part reads 74°C on a probe thermometer, or when a small cut shows white meat right through with clear juices.',
        'Lift it out, let the oil drip off for a moment, then lay it on the rack, sprinkle it with a pinch of salt and slide the tray into the oven while you fry the rest. A 28cm pan takes one cutlet at a time; fry two only if your pan is big enough for both to float without overlapping. Coat the next cutlet while the one before it fries. Between batches, skim out any dark crumbs so they do not burn and speckle the next one, and let the oil come back to temperature.',
      ],
    },
    {
      heading: 'To the plate',
      items: [
        'Taste the potato salad once more, since cold dulls the seasoning, and add a pinch of salt or a splash of brine if it needs it. Serve each schnitzel straight away with a wedge of lemon and a generous spoonful of the potato salad alongside. Squeeze the lemon over the schnitzel just before eating.',
      ],
    },
  ],

  nutrition: { calories: 870, protein: 47, carbs: 57, fat: 49 },
  flavorProfile: { sweet: 1, salty: 3, sour: 3, bitter: 0, umami: 3, spicy: 0 },

  isVegetarian: false,
  isVegan: false,
  isGlutenFree: false,
  isDairyFree: true,

  quote:
    'Chicken beaten thin and fried in swirling oil until the crumb lifts away in golden waves, with lemon and a cold, tangy potato salad made the day before.',
  description:
    'Kurací rezeň is a Slovak Sunday lunch: chicken breast beaten thin, coated in flour, egg and fine breadcrumbs, then fried, and served with lemon and a bowl of cold potato salad. It came over the border from Vienna, and this version borrows the Viennese technique for the crust. The crumbs are laid on loosely and never pressed, there is a spoonful of oil in the egg, and plenty of hot oil is swirled over the top as it fries, so the coating puffs away from the meat into a crisp, airy shell while the chicken inside stays juicy. The salad is the classic Slovak kind, the same one that sits beside fried carp on Christmas Eve, with carrots, peas, gherkins and mayonnaise, brightened with a little of the gherkin brine. It tastes best made the day before, which also leaves only the schnitzel to cook when everyone is hungry.',
  attribution: "A Nieves's Kitchen take on a Slovak classic",

  headnoteIngredients:
    'Buy the chicken from a halal butcher. Use fine dried breadcrumbs, the plain sandy kind, not panko. Fine crumbs make a compact shell that traps steam and puffs, while panko gives a spikier, flatter crust. For the salad you want waxy potatoes, which hold a clean slice, and the sweet-sour gherkins sold in jars. Viennese kitchens traditionally fry in clarified butter, which you will find in the variations. Sunflower oil gives just as good a crust for far less. This is a generous Sunday plate, and most of the calories are in the mayonnaise. Light mayonnaise in the salad lowers the total a good deal.',
  headnoteInstructions:
    'Make the potato salad first, ideally the day before. It needs at least 2 hours in the fridge, and it is better after a night. The schnitzel takes about 40 minutes: pound the chicken, set up the three plates, get the oil hot, then coat each cutlet only just before it goes into the pan. Breaded cutlets left waiting glue their crumbs down flat and will not puff.',

  equipment: [
    'A large, deep frying pan or a wide, shallow casserole, so the cutlet can float in oil about 1cm deep with room to swirl. A heavy base holds its heat when a cold cutlet goes in.',
    'A wire rack set over a tray. Kitchen paper steams the underside soft. The rack from your grill pan works just as well.',
  ],

  tips: [
    'Pound the chicken to an even 5mm. A thick middle and thin edges means dry edges or a raw centre, never both right.',
    'Do not press the crumbs on. They should only just cling. A loose coat, with a little oil in the egg to keep it supple, is what lets steam lift it off the meat into those waves.',
    'Keep the pan moving. Hot oil washing over the top sets the upper crumb while the underside fries, and that is what makes the whole coat puff, not just the bottom.',
    'Use enough oil for the schnitzel to float. In a thin film the crumb sticks to the pan and tears when you turn it.',
    'Coat each cutlet just before it goes in. Breaded cutlets left to sit glue their crumbs down and fry flat.',
    'Dress the warm potatoes with brine and add the mayonnaise only once they are cold. Warm potatoes soak up the brine, and cold ones keep the mayonnaise creamy.',
  ],

  notes: [
    'Potatoes: waxy ones of a similar size, such as Charlotte, cook evenly and hold a clean slice.',
    'Lighter salad: light mayonnaise brings a plate down from about 870 to about 715 calories, and with the brine and mustard you hardly miss the difference.',
    'Mustard: check the label, and pick a mild one made with vinegar.',
    'Chicken: turkey breast steaks or halal veal escalopes work the same way; veal makes it a true Wiener schnitzel. Chicken thigh fillets, opened out and pounded, give a juicier schnitzel: allow about a minute longer on each side.',
    'Gluten-free: use a gluten-free plain flour and gluten-free breadcrumbs. The salad needs no change, but check the mustard and mayonnaise labels.',
    'Milk instead of water: many Slovak kitchens use milk in the egg. It browns a touch deeper, but the dish is then no longer dairy-free.',
  ],

  variations: [
    'Fry in ghee (clarified butter) instead of oil, or add a knob of butter to the oil for the last minute, for the nutty, buttery Viennese flavour. It colours faster, so keep the heat a notch lower.',
    'Rezeň v cestíčku, a very Slovak way to skip the crumbs: whisk 2 eggs, 4 tablespoons of flour, 4 tablespoons of milk, a crushed garlic clove and a handful of grated cheese into a thick batter, dip the floured cutlets in it and fry over medium heat for 3 to 4 minutes a side. Choose a cheese made with vegetarian or microbial rennet.',
    'For extra crunch, swap the breadcrumbs for crushed cornflakes. It will not puff, but it shatters.',
    'Oven or air fryer: coat as above, spray both sides well with oil and bake on a rack at 220°C (200°C fan) for 18 to 20 minutes, or air fry at 200°C for 10 to 12 minutes, turning once. You lose the puff but keep the crunch, with far less oil.',
    'For an everyday lunch, serve it with buttery mashed potatoes instead of the salad. For something lighter, try a thin cucumber salad dressed with vinegar, water, a little sugar and salt.',
  ],

  storage:
    'The potato salad keeps in a covered bowl in the fridge for 3 days and is at its best on the second. Cooked schnitzels keep for 2 days in the fridge. Reheat them on a rack in the oven at 200°C (180°C fan) for 8 to 10 minutes, or in an air fryer at 190°C for 4 to 5 minutes, never in the microwave. A cold schnitzel in a soft roll is also a classic Slovak food to take on a long journey.',

  dropcap: true,

  image: 'https://images.unsplash.com/photo-1665056511905-1ca20935db27?w=1200&q=80',
  imageIsStock: true,
};

export default recipe;
