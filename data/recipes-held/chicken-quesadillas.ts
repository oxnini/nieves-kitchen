// data/recipes-held/chicken-quesadillas.ts
import type { RecipeInput } from '../recipes/_types';

const recipe: RecipeInput = {
  title: 'Chicken Quesadillas',
  country: 'Mexico',
  category: 'main',
  difficulty: 'Easy',
  servings: 4,
  time: { active: 70, total: 90 },
  yield: 'Makes 4 large quesadillas, one each',
  tags: ['high-protein', 'comfort food', 'meal-prep friendly'],

  region: 'North America',
  coordinates: { lat: 19.4326, lng: -99.1332 },
  influences: ['Mexico', 'United States of America'],
  featuredIngredients: ['chicken'],

  ingredients: [
    {
      heading: 'Spiced chicken',
      items: [
        { name: 'boneless, skinless chicken thighs', amount: 500, unit: 'g' },
        { name: 'neutral oil', amount: 1, unit: 'tbsp' },
        { name: 'light soy sauce (halal-certified)', amount: 2, unit: 'tsp' },
        { name: 'ground cumin', amount: 1, unit: 'tsp' },
        { name: 'smoked paprika', amount: 1, unit: 'tsp' },
        { name: 'garlic powder', amount: 1, unit: 'tsp' },
        { name: 'mild chili powder', amount: 0.5, unit: 'tsp' },
        { name: 'dried oregano', amount: 0.5, unit: 'tsp' },
        { name: 'salt', amount: 0.75, unit: 'tsp' },
        { name: 'black pepper', amount: 0.25, unit: 'tsp' },
      ],
    },
    {
      heading: 'Filling',
      items: [
        { name: 'sweetcorn, tinned and drained or frozen (optional)', amount: 150, unit: 'g' },
        { name: 'onion, thinly sliced', amount: 1, unit: '' },
        { name: 'red pepper, thinly sliced', amount: 1, unit: '' },
        { name: 'garlic cloves, finely chopped', amount: 2, unit: '' },
        { name: 'fresh green chili, finely chopped', amount: 1, unit: '' },
        { name: 'lime juice', amount: 1, unit: 'tbsp' },
        { name: 'coriander, a handful, chopped', amount: 0, unit: '' },
        { name: 'salt, a pinch for the corn and the vegetables', amount: 0, unit: '' },
      ],
    },
    {
      heading: 'Quesadillas',
      items: [
        { name: 'large flour tortillas, about 25cm across', amount: 4, unit: '' },
        { name: 'low-moisture mozzarella and mature cheddar, half and half, grated from the block and mixed', amount: 280, unit: 'g' },
        { name: 'neutral oil or melted butter, for brushing (plus a few drops for a cast-iron pan)', amount: 2, unit: 'tsp' },
      ],
    },
    {
      heading: 'To serve',
      items: [
        { name: 'salsa', amount: 0, unit: '' },
        { name: 'guacamole (optional)', amount: 0, unit: '' },
        { name: 'lime, cut into wedges', amount: 1, unit: '' },
        { name: 'extra coriander and sliced green chili', amount: 0, unit: '' },
      ],
    },
  ],

  steps: [
    {
      heading: 'Season the chicken',
      items: [
        'Pat the chicken thighs dry and trim off any large lumps of fat. In a bowl, toss them with the oil, soy sauce, all the spices, the salt and the pepper until every piece is coated. Leave them for at least 15 minutes at room temperature, or covered in the fridge for up to a day. The salt needs that time to work its way in, and it is a big part of what keeps the chicken juicy.',
        'While the chicken sits, slice the onion and pepper, chop the garlic, chili and coriander, and grate and mix the two cheeses. Weigh 80g of the cheese into a separate bowl. That is for the skirts, not the filling. If you have corn, char it now too, so it is done by the time the chicken is ready to cook.',
      ],
    },
    {
      heading: 'Char the corn, if you have some',
      items: [
        'Drain tinned sweetcorn well and pat it dry on kitchen paper; frozen can go straight in. Set a large frying pan over high heat for 1 minute with no oil (do not leave a non-stick pan heating empty for longer), tip in the corn in a single layer and leave it alone for 2 minutes, then toss and leave it again. After 5 to 6 minutes in all, or a couple of minutes longer for frozen, which has to steam off its water first, it should be blistered with dark brown spots and smell toasty. A few kernels will pop, so keep a lid nearby. Tip it into a large bowl with a pinch of salt.',
      ],
    },
    {
      heading: 'Cook the chicken',
      items: [
        'Put the same pan over medium-high heat. Lay in the thighs smooth side down in one layer and leave them alone for 5 to 6 minutes, until they release easily and are a deep, spiced brown underneath. If the spices start to blacken or smell acrid before then, turn the heat down to medium.',
        'Turn them and cook for 4 to 5 minutes more, until the thickest piece reads 75°C, or the juices run clear with no pink when you cut into it. Thighs stay juicy even a few degrees past that, which is why they are used here. Move them to a board to rest for 5 minutes, and keep the pan.',
        'Turn the heat down to medium. Add the onion and pepper to the fat left in the pan with a pinch of salt and cook for 5 to 6 minutes, stirring now and then, until soft and catching brown at the edges. Add the garlic for the last minute. If the pan looks dry, a splash of water lifts the browned bits rather than more oil. Scrape it all into the bowl with the corn.',
        'Chop the rested chicken into small pieces, about 1cm, and add them to the bowl with every drop of juice from the board. Stir in the lime juice, green chili and coriander, then taste. It should be punchy on its own, because the tortilla and cheese will soften it, so add a pinch more salt if it needs it.',
        'Spread the filling over a large plate and leave it for 10 minutes, until it is just warm. Hot filling steams the tortilla from the inside, and that is where a limp quesadilla comes from. Meanwhile, wipe the pan clean with kitchen paper, since any burnt scraps would stick to the cheese skirt.',
      ],
    },
    {
      heading: 'Fill and fold',
      items: [
        'Lay the tortillas out. Over one half of each, scatter 25g of the cheese, then a quarter of the filling, leaving a 1cm border, then another 25g of cheese. Fold the bare half over and press down firmly with your palm. Cheese above and below the filling is the glue that holds everything in.',
      ],
    },
    {
      heading: 'The cheese skirt',
      items: [
        'If you want to serve all four together, heat the oven to 120°C (100°C fan) now and set a wire rack over a baking tray inside.',
        'Put the clean pan over medium heat with no oil and give it 2 minutes. In cast iron, wipe a few drops of oil over the base first. Scatter 20g of the reserved cheese in a half-moon on the flat base of the pan, with its straight side a little off-centre, and keep most of it along the curved edge, where the frill will be. When it starts to melt and bubble, after about 30 seconds, slide the quesadilla off a board or a wide spatula on top of it, folded edge along the straight side, so a 1 to 2cm frill of cheese shows round the curved edge. Press it down gently with a spatula. A 25cm tortilla is a little wide for the flat of a 28cm pan, so the two tips of the fold will ride up the sides; that is fine.',
        'Cover with a lid and cook for 3 minutes, then take the lid off and cook for 1 to 2 minutes more, until the skirt is deep golden and lacy and the bubbling has quietened. That quiet is the sign the water has cooked out and the cheese has crisped. Slide the spatula under the edge: if the skirt is ready it lifts away in one piece with the tortilla, and if it is still soft and clinging, give it another 30 seconds.',
        'Brush the top of the quesadilla with a little of the oil or butter, then flip it over, using the folded edge as a hinge so the filling stays put. Press down firmly and cook for 2 to 3 minutes, uncovered, until the second side is deep golden and the cheese is oozing at the open edge.',
        'Slide it onto a board, skirt side up, and leave it for 1 minute, so the skirt hardens and the cheese inside settles enough not to run straight out. Cut into 3 wedges with a sharp knife or a pizza wheel.',
        'Wipe the pan and repeat with the rest. A heavy pan keeps building heat, so if a skirt is going deep golden before its 4 minutes are up, turn the heat down a notch for the next one. Eat them as they come off, or keep the finished ones on the rack in the warm oven until they are all done. Serve with salsa, guacamole if you like, lime wedges, and more coriander and green chili.',
      ],
    },
  ],

  nutrition: { calories: 760, protein: 48, carbs: 45, fat: 42 },
  flavorProfile: { sweet: 2, salty: 3, sour: 2, bitter: 0, umami: 4, spicy: 2 },

  isVegetarian: false,
  isVegan: false,
  isGlutenFree: false,
  isDairyFree: false,

  quote:
    'Spiced chicken thighs, charred corn and two melting cheeses folded into a flour tortilla, then set down on a scatter of cheese that fries into a crisp, lacy skirt.',
  description:
    'This is a chicken quesadilla built for the pan: a big flour tortilla folded around spiced chicken thighs, soft onion and pepper, fresh green chili and coriander, with cheese above and below the filling to glue it all together. The chicken sits in its seasoning, with a splash of soy for depth, before it is seared, then rests and goes back in with every drop of its juices, so the filling is juicy without being wet. It cools before the tortillas are folded, which is what keeps them crisp rather than steamed. Then comes the best part. A little cheese goes into the pan first and the quesadilla is laid on top, so the cheese fries into a crackling, lacy skirt round the edge, the same idea as the crisp cheese costra on a Mexico City taco stand. When I have sweetcorn it goes in too, charred in a dry pan until it blisters and turns sweet and smoky.',
  attribution: "A Nieves's Kitchen take on a Mexican-American favourite",

  headnoteIngredients:
    'Thighs rather than breast keep the filling juicy, even after its second cook inside the tortilla. Use low-moisture mozzarella, the firm block rather than the fresh balls, for the stretch, and mature cheddar for the flavour, both grated from the block: pre-grated bags are coated in starch that stops the skirt turning lacy. Check the labels. Cheese marked "suitable for vegetarians" is set with microbial or vegetable rennet rather than animal rennet, and halal-certified cheese is just as good. Use a halal-certified soy sauce too, since some brewed soy sauces contain alcohol. The sweetcorn is optional, but I add it whenever I have some, and tinned or frozen both work once charred.',
  headnoteInstructions:
    'The chicken wants at least 15 minutes in its seasoning, which is the time it takes to slice the vegetables, grate the cheese and char the corn. Once cooked, the filling cools for 10 minutes before it goes anywhere near a tortilla. Each quesadilla then takes about 8 minutes in the pan, so four in one pan is a good half hour; eat them in rounds, or hold them in a low oven.',

  equipment: [
    'A large frying pan, about 28cm, with a lid. Non-stick is the easiest for the cheese skirt, since it lets the crisp cheese come away with the tortilla rather than welding itself to the pan. A well-seasoned cast-iron pan works too with a few drops of oil wiped over it, as long as you wait until the skirt is crisp before you lift it. A baking tray laid over the top works in place of a lid.',
  ],

  tips: [
    'Cool the filling. It is the single biggest difference between a crisp quesadilla and a limp one.',
    'Medium heat for the quesadillas, not high. Hot enough to crisp the cheese, gentle enough that the tortilla does not scorch before the middle melts.',
    'Do not try to lift the skirt while it is still bubbling hard. Lacy, golden and quiet means crisp; furious bubbling means there is still water in it and it will tear.',
    'Season the filling until it tastes almost too punchy on its own. Tortilla and cheese mute everything.',
    'Wipe the pan between quesadillas. Scraps of burnt cheese turn bitter and stick to the next one.',
    'Flip over the folded edge, like turning a page, and the filling stays inside.',
  ],

  substitutions: [
    'Chicken breast works but dries out faster. Slice each breast in half horizontally into two thin fillets so they cook evenly, give them 3 to 4 minutes a side, and take them off as soon as they reach 75°C.',
    'Leftover roast chicken, or a halal rotisserie chicken, is the shortcut. Shred about 400g, skip the searing, and warm it in the pan for 2 minutes with the spices, soy, oil and a splash of water before mixing it with the vegetables.',
    'No soy sauce? Leave it out and add an extra pinch of salt. It is there for depth rather than any flavour of its own.',
    'Monterey Jack is the best single melting cheese if you can find it, and Red Leicester can stand in for the cheddar. The same rennet check applies.',
    'Any fresh green chili works. Jalapeño is the mildest, a bird\'s eye chili much hotter.',
  ],

  variations: [
    'Oven batch for a crowd: heat a lightly oiled baking tray in the oven at 220°C (200°C fan), lay the filled quesadillas on it and bake for 8 minutes, then flip, press down and bake for 6 to 8 minutes more, until crisp. You lose the cheese skirt, but all four are ready at once.',
    'Pickled jalapeños, a few slices tucked into each one with the filling, give sharp heat against all that cheese.',
    'For a heartier filling, add 200g of drained black beans along with the corn.',
    'Chipotle chicken: stir 1 tbsp of chopped chipotle in adobo into the filling with the lime, for smoky heat.',
  ],

  storage:
    'The filling keeps for 2 days in the fridge, so it can be made ahead. Take it out about 20 minutes before you fill the tortillas so the middle melts in time. Cooked quesadillas keep for 2 to 3 days in the fridge and reheat best in a dry pan over medium-low heat for 3 to 4 minutes a side, or in an air fryer at 180°C for 4 to 5 minutes. To freeze, fill and fold them uncooked, wrap each one, and freeze for up to 3 months. Cook from frozen over medium-low heat with the lid on, a few minutes longer on each side, until the middle is piping hot.',

  dropcap: true,

  image: 'https://images.unsplash.com/photo-1673990349292-ed2dfa7988c9?w=1200&q=80',
  imageIsStock: true,
};

export default recipe;
