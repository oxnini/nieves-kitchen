// data/recipes/crispy-chili-beef.ts
import type { RecipeInput } from './_types';

const recipe: RecipeInput = {
  title: 'Crispy Chili Beef',
  country: 'China',
  featuredIngredients: ['beef'],
  category: 'main',
  difficulty: 'Medium',
  servings: 4,
  time: { active: 40, total: 60 },
  yield: 'Serves 4 with rice',
  tags: ['high-protein', 'spicy', 'comfort food', 'treat'],

  region: 'East Asia',
  coordinates: { lat: 22.54, lng: 114.06 },
  influences: ['China', 'United Kingdom'],

  ingredients: [
    {
      heading: 'The beef',
      items: [
        { name: 'rump or sirloin steak, trimmed and sliced across the grain into 5mm strips', amount: 400, unit: 'g', note: 1 },
        { name: 'bicarbonate of soda', amount: 0.25, unit: 'tsp' },
        { name: 'water', amount: 1, unit: 'tbsp' },
        { name: 'light soy sauce', amount: 1, unit: 'tbsp', note: 2 },
        { name: 'egg, beaten', amount: 1, unit: '' },
        { name: 'potato starch, for coating (you will have some left over)', amount: 80, unit: 'g', note: 3 },
        { name: 'neutral oil, for deep frying', amount: 750, unit: 'ml' },
        { name: 'oil spray, only if you are air frying', amount: 0, unit: '' },
      ],
    },
    {
      heading: 'The sauce',
      items: [
        { name: 'light soy sauce', amount: 1.5, unit: 'tbsp', note: 2 },
        { name: 'dark soy sauce', amount: 1, unit: 'tsp', note: 2 },
        { name: 'tomato ketchup', amount: 3, unit: 'tbsp' },
        { name: 'sweet chili sauce', amount: 3, unit: 'tbsp', note: 4 },
        { name: 'honey', amount: 1.5, unit: 'tbsp' },
        { name: 'Chinkiang black vinegar', amount: 2, unit: 'tbsp', note: 5 },
        { name: 'chili flakes', amount: 1, unit: 'tsp' },
        { name: 'water', amount: 2, unit: 'tbsp' },
        { name: 'potato starch', amount: 1, unit: 'tsp', note: 3 },
      ],
    },
    {
      heading: 'The stir-fry',
      items: [
        { name: 'neutral oil (fresh, or a spoonful of the frying oil)', amount: 1, unit: 'tbsp' },
        { name: 'small onion, sliced', amount: 1, unit: '' },
        { name: 'red pepper, cut into thin strips', amount: 1, unit: '' },
        { name: 'carrot, cut into matchsticks', amount: 1, unit: '' },
        { name: 'garlic cloves, thinly sliced', amount: 3, unit: '' },
        { name: 'fresh ginger, cut into fine matchsticks', amount: 15, unit: 'g' },
        { name: 'red chilies, sliced', amount: 2, unit: '' },
        { name: 'spring onions, cut into 4cm lengths', amount: 4, unit: '' },
      ],
    },
    {
      heading: 'To finish',
      items: [
        { name: 'toasted sesame seeds', amount: 1, unit: 'tsp' },
        { name: 'sliced fresh green chili and coriander, optional', amount: 0, unit: '' },
        { name: 'steamed rice, to serve', amount: 0, unit: '' },
      ],
    },
  ],

  steps: [
    {
      heading: 'Before you start',
      items: [
        'Put the beef strips in a bowl with the bicarbonate of soda and the tablespoon of water, toss until the water has disappeared into the meat, and leave them for 15 minutes. The bicarb loosens the fibres, so the strips stay tender under a hard crust.',
        'While the beef sits, get everything else ready, because once the frying starts it runs to the end without a pause. Slice the onion, pepper, garlic, red chilies and spring onions, and cut the carrot and ginger into matchsticks. Whisk all the sauce ingredients together in a jug until the starch has dissolved. Set a wire rack over a tray next to the hob, and get the rice cooking now so it is ready when the beef is.',
      ],
    },
    {
      heading: 'Coat the beef',
      items: [
        'Stir the soy sauce into the beef, then the beaten egg, until every strip is slick.',
        'Tip the potato starch into a wide bowl. Lift the strips out a handful at a time, letting the excess egg drip back, and press each one into the starch until it is completely covered. Shake off the loose powder and lay the strips on a tray in a single layer.',
        'Leave them for 5 to 10 minutes while the oil (or the air fryer) heats. The coating turns from chalky white to slightly damp, and that is what keeps it from flaking off in the oil.',
      ],
    },
    {
      heading: 'Fry twice',
      items: [
        'Pour the frying oil into a deep, heavy saucepan or a wok sitting steady on the hob, no more than a third full, and heat it over medium-high heat to 170°C, about 8 to 10 minutes. Without a thermometer, dip in a dry wooden chopstick: a steady stream of small bubbles means it is ready. Stay with the pan the whole time it is on the heat.',
        'Fry half the beef (a third at a time if your pan is narrower than about 22cm), dropping the strips in one by one or in a loose scatter so they do not land in a heap, because potato starch glues touching strips together. Nudge them apart with chopsticks in the first 30 seconds, then fry for 2 to 3 minutes, until the coating is set and pale gold. Lift onto the rack. Give the oil a minute or two to climb back to 170°C, then fry the rest the same way.',
        'Turn the heat up and bring the oil to 190°C, when the chopstick bubbles hard straight away. Fry all the beef again in two batches for 1 to 2 minutes, letting the oil come back up to heat between them, until deep golden brown and properly crisp. The strips rattle against the spoon when they are ready. Back onto the rack, not onto kitchen paper, so steam escapes from underneath. Turn the heat off under the oil and leave it well alone to cool.',
        'Rather not deep fry? Use an air fryer instead. Heat it to 200°C for 3 minutes and spray the basket with oil. Lay the coated strips in a single layer with a little space between them, which means two batches in a large basket and three in a small one, then spray them until no dry white starch shows, since any powdery patch stays chalky. Air fry for 10 to 12 minutes, shaking the basket (or turning the strips with tongs if they cling) and spraying any pale, dry spots again after 4 minutes and after 8 minutes, until deep golden and crisp at the edges. Repeat with the rest, then put the earlier batches back in for the last 2 minutes so everything is hot. The crust is a little less glassy than deep fried but very good, for a fraction of the oil, and the sauce below works exactly the same way.',
      ],
    },
    {
      heading: 'Sauce and toss',
      items: [
        'Heat the tablespoon of oil in a second wok or a large frying pan over high heat. Never try to pour out a pan of oil that is still hot: if you have only the one wok, let the oil cool for 10 minutes, ladle it into a heatproof bowl, then wipe the wok and carry on, and the beef will keep its crunch on the rack in the meantime. Stir-fry the onion, pepper and carrot for 2 minutes, until softened at the edges but still crunchy. Add the garlic, ginger and red chilies and stir-fry for 30 seconds, until fragrant.',
        'Turn the heat down to medium. Stir the sauce again, since the starch settles, and pour it in. Let it bubble, stirring all the time so the honey and ketchup do not catch, for about 1 minute, until thick and glossy. It should cling to the vegetables and leave a trail when you drag a spatula through it, rather than pool in the pan. A thick sauce coats the crust; a thin one soaks straight into it. If it goes gluey, loosen it with a splash of water.',
        'Turn off the heat. Tip in the beef and spring onions and toss fast, for 15 to 20 seconds, just until every strip is lacquered. Scatter over the sesame seeds, and the green chili and coriander if you like, and get it to the table straight away with rice.',
      ],
    },
  ],

  nutrition: { calories: 470, protein: 26, carbs: 38, fat: 24 },
  flavorProfile: { sweet: 3, salty: 3, sour: 2, bitter: 0, umami: 3, spicy: 3 },

  isVegetarian: false,
  isVegan: false,
  isGlutenFree: false,
  isDairyFree: true,

  quote:
    'Strips of beef fried twice until they shatter, then thrown through a glossy, malty black vinegar chili sauce in the last few seconds before they reach the table.',
  description:
    'Crispy chili beef belongs to the British Chinese takeaway more than to China itself: thin strips of beef in a hard, crackling coat, tossed with peppers and onion in a sticky sweet, sour and hot sauce. This version is built so the crunch survives the sauce. A pinch of bicarb keeps the beef tender, potato starch gives a glassier crust than flour or cornflour, and a double fry drives out the moisture that would otherwise soften it. Chinkiang black vinegar replaces the usual plain vinegar, for a deeper, malty sourness that tastes more like a good restaurant than a takeaway, and a spoonful of honey rounds it off. The sauce is cooked thick before the beef goes anywhere near it, then everything is tossed off the heat and eaten at once. If you would rather not deep fry, the air fryer route sits right alongside the main method.',
  attribution: 'A Nieves\'s Kitchen take on a British Chinese takeaway classic',

  headnoteIngredients:
    'Rump or sirloin, trimmed of its fat, is tender enough to fry in thin strips.',
  headnoteInstructions:
    'Do all the chopping and whisk the sauce while the beef sits in the bicarb. From the moment the oil is hot it runs straight through to the plate, and the crust is at its best in the first few minutes after the toss. Fry in a saucepan and make the sauce in a wok or frying pan, and you never have to move hot oil. The air fryer route takes a little longer, two or three batches of about 12 minutes, but there is no hot oil to deal with.',

  equipment: [
    'A deep, heavy saucepan or a wok for the frying. A round-bottomed wok needs its ring so it cannot rock on the hob. A cooking thermometer makes the two temperatures easy, though the chopstick test in the steps gets you there without one.',
    'A wire rack over a tray for draining, so the crust stays crisp underneath. A plate lined with kitchen paper works if you have nothing else.',
    'An air fryer, only if you take that route instead of deep frying.',
  ],

  tips: [
    'Thin slicing is easier than it sounds. Put the steak in the freezer for 20 to 30 minutes first, until it is firm but not frozen, and a sharp knife will cut clean 5mm strips across the grain.',
    'Keep the strips apart as they go into the oil. Potato starch is sticky, and strips that land touching fuse into one crisp raft. Drop them in loosely and nudge them apart in the first few seconds.',
    'The second fry is what makes it shatter. The first sets the coating and cooks the beef, the short rest lets moisture move to the surface, and the hotter second fry drives it off.',
    'Cook the sauce thick before the beef goes in. It is the single thing that decides whether the crust survives. Drag a spatula through it: if the line holds for a moment, it is ready.',
    'In the air fryer, spray until no dry starch shows. Any patch left powdery stays chalky, however long it cooks.',
    'The clock starts when the sauce hits. Toss off the heat for no more than 20 seconds and serve at once, and keep any extra beef out of the sauce until the second helping.',
  ],

  notes: [
    'Steak: flank or skirt works instead of rump, sliced very thinly across the grain.',
    'Soy sauce: check the labels. For gluten-free, use tamari for both.',
    'Potato starch: sold at Asian grocers and in the world food aisle, and it is what makes the crust glassy and long-lasting. Cornflour works in the same amounts for the coating and the sauce; the crust is a little less glassy but still crisp.',
    'Sweet chili sauce: check the label. None? Use an extra tablespoon of honey, another half teaspoon of chili flakes and an extra teaspoon of vinegar.',
    'Chinkiang black vinegar: a dark, malty brewed rice vinegar; look for one that lists just water, glutinous rice, wheat bran, salt and sugar. No Chinkiang? Use 1 tablespoon each of rice vinegar and balsamic. It is brewed with wheat bran, so use rice vinegar for gluten-free.',
  ],

  variations: [
    'Honey chili beef: swap the sweet chili sauce for 2 more tablespoons of honey and 1 tablespoon of hoisin (check the label), and finish with a heavier scatter of sesame seeds. Stickier and sweeter.',
    'Sichuan pepper salt: toast 1 teaspoon of Sichuan peppercorns in a dry pan until fragrant, grind them with half a teaspoon of salt, and pinch it over the finished plate for a tingling edge.',
    'Crispy chili chicken: use boneless chicken thigh in thin strips, give it 3 to 4 minutes on the first fry, and make sure it reaches 74°C inside.',
  ],

  storage:
    'Best eaten straight away, while the crust still crackles. Leftovers keep in the fridge for up to 2 days. Re-crisp them in the air fryer at 200°C for 3 to 4 minutes, or in a hot oven, knowing the crust will not be quite what it was. The whisked sauce keeps in a jar in the fridge for a week, so you can make a double batch.',

  dropcap: true,

  image: 'https://images.unsplash.com/photo-1702705487239-10a1ca715454?w=1200&q=80',
  imageIsStock: true,
};

export default recipe;
