// data/recipes/spaghetti-aglio-e-olio.ts
import type { RecipeInput } from './_types';

const recipe: RecipeInput = {
  title: 'Spaghetti Aglio e Olio',
  country: 'Italy',
  category: 'main',
  difficulty: 'Easy',
  servings: 2,
  time: { active: 20, total: 25 },
  yield: '2 generous bowls',
  tags: ['quick', 'spicy', 'budget-friendly', 'vegetarian'],

  region: 'Western Europe',
  coordinates: { lat: 41.9, lng: 12.5 },

  ingredients: [
    {
      heading: 'Garlic chili oil',
      items: [
        { name: 'garlic cloves, thinly sliced', amount: 6, unit: '' },
        { name: 'good extra virgin olive oil', amount: 6, unit: 'tbsp' },
        { name: 'dried chili flakes (peperoncino)', amount: 1, unit: 'tsp' },
      ],
    },
    {
      heading: 'Pasta',
      items: [
        { name: 'dried spaghetti or linguine, ideally bronze-cut', amount: 200, unit: 'g' },
        { name: 'salt for the pasta water, to taste', amount: 0, unit: '' },
        { name: 'reserved pasta water', amount: 0, unit: '' },
      ],
    },
    {
      heading: 'To finish (protein optional)',
      items: [
        { name: 'prawns, peeled (optional)', amount: 200, unit: 'g' },
        { name: 'fresh coriander or flat-leaf parsley, chopped', amount: 3, unit: 'tbsp' },
        { name: 'salt and black pepper, to taste', amount: 0, unit: '' },
      ],
    },
  ],

  steps: [
    {
      heading: 'Boil the pasta',
      items: [
        'Bring a large pot of water to a rolling boil and salt it generously, so it tastes properly seasoned. This is where most of the pasta gets its seasoning, so do not be shy.',
        'Add the spaghetti and cook to just under al dente, a minute or two short of the package time, since it will finish cooking in the pan. You really do not want to overcook it.',
        'Right when the pasta has finished cooking, when the water is at its starchiest, scoop out a decent mugful and set it aside before you drain. You will use anywhere from a few tablespoons to half a cup of it later, and that starch is what makes the sauce.',
      ],
    },
    {
      heading: 'Make the garlic chili oil',
      items: [
        'While the pasta cooks, put the sliced garlic and olive oil together in a large pan and set it over low heat. Use a generous amount of oil, since it becomes the sauce. Let the garlic gently sizzle and soften without browning, so it stays sweet rather than bitter.',
        'Once the garlic is pale gold and the oil smells fragrant, stir in the chili flakes. Adding them after the garlic has already infused the oil keeps the heat gentle, so the dish does not turn harshly spicy.',
        'Let it simmer for another minute so the chili warms through, then scrape the garlic chili oil into a small bowl and set it aside. Keep the pan, you will use it again.',
      ],
    },
    {
      heading: 'Optional: sear the protein',
      items: [
        'If you want a little more balance in the meal, fry your protein now. Prawns are my go-to, but a sliced chicken breast works just as well.',
        'In the same pan over medium-high heat, sear the prawns (or chicken) until almost cooked through. Keep the seasoning simple and in the same family as the pasta: a little garlic, chili, salt, and pepper, nothing more.',
        'When the protein is nearly done, pour the garlic chili oil back into the pan so it heats up again around it.',
      ],
    },
    {
      heading: 'Bring it together',
      items: [
        'If you skipped the protein, simply warm the garlic chili oil back in the pan over low heat.',
        'Add the drained al dente pasta straight into the pan along with a few tablespoons of the reserved pasta water. Toss it vigorously and keep it moving so the oil and starchy water emulsify into a glossy sauce that clings to every strand.',
        'Add more pasta water a splash at a time only if you need it. The flavor comes from the garlic oil, not the water, so it should not turn runny. You want a sauce that coats the pasta and clings, still emulsified but never watery.',
        'Toss the chopped coriander or parsley through the pasta in the last moments of cooking rather than scattering it on at the end. Warming it in the pan draws out more of its flavor.',
        'Taste, adjust the salt and pepper, and serve straight away while it is hot and glossy.',
      ],
    },
  ],

  nutrition: { calories: 620, protein: 13, carbs: 74, fat: 30 },
  flavorProfile: { sweet: 1, salty: 3, sour: 0, bitter: 1, umami: 2, spicy: 2 },

  isVegetarian: true,
  isVegan: true,
  isGlutenFree: false,
  isDairyFree: true,

  quote: 'The pantry pasta I make when there is nothing in the house: good oil, a lot of garlic, a little chili, and whatever protein keeps the plate balanced.',
  description:
    'Aglio e olio is proof that almost nothing can become dinner. Spaghetti tossed in a slow, golden garlic oil with a whisper of chili, emulsified with a splash of pasta water until it clings to every strand. I keep the classic version meatless, but I usually add prawns to keep the plate a little more balanced. Chicken works too. Either way the seasoning stays simple, because the garlic oil is the whole point.',
  attribution: 'A Nieves Kitchen take on a Neapolitan classic',

  headnoteIngredients:
    'The oil is the sauce here, so use an extra virgin you would happily taste on its own, ideally one with a peppery bite. If you can, buy bronze-cut pasta. Its rough, matte surface grips the oil far better than smooth supermarket pasta, so the sauce clings instead of sliding off. Slice the garlic thinly so it infuses evenly and softens without catching.',
  headnoteInstructions:
    'Two things make or break this: do not let the garlic brown, and finish the pasta in the pan with its starchy water so the oil emulsifies instead of sliding off.',

  tips: [
    'Garlic burns in a heartbeat and turns bitter, taking the whole dish with it. Cook it on very low heat for a little longer rather than rushing it on high, and pull it the moment it is pale gold.',
    'The emulsion step is what makes or breaks this. Keep tossing the pasta with the oil and starchy water so the two actually combine into a glossy sauce that clings to every strand, but work quickly so the pasta does not overcook.',
    'Never drain all the water. Reserve a decent mugful, and scoop it out right when the pasta has finished cooking, when it is at its starchiest. That starch is what lets the oil emulsify into a sauce.',
    'Be generous with the black pepper. It is one of the few seasonings in the dish, and a good amount of it makes a real difference here.',
    'Use good extra virgin olive oil with a peppery bite. It is the sauce, so it is worth the better bottle.',
    'Cook the pasta a minute short of al dente. It finishes in the pan, and aglio e olio is unforgiving of soft, mushy spaghetti.',
    'If you can, buy bronze-cut pasta (look for "trafilata al bronzo" or "bronze die" on the box). Its rough, matte, slightly chalky surface grips the oil far better than the smooth, glossy kind, so the sauce clings instead of sliding off. Brands I trust: De Cecco, Rummo, and La Molisana.',
    'Add the chili only after the garlic has infused the oil. Going in late keeps the heat gentle and the oil garlic-forward rather than fiery.',
    'Stir the herbs in during the last moments in the pan, not after plating. A little warmth coaxes out more flavor.',
  ],

  substitutions: [
    'Prawns are my default protein, but a sliced chicken breast keeps the meal just as balanced. Season it simply with garlic, chili, salt, and pepper so it stays in the same flavor family.',
    'Parsley is the traditional garnish, but I prefer chopped coriander. Use whichever you like.',
    'No fresh chili needed: dried chili flakes or Italian peperoncino do the work.',
  ],

  variations: [
    'Leave out the protein entirely for the true classic, a fast meatless pantry pasta.',
    'For more heat, hold a little extra chili back and scatter it over at the table.',
    'For a lighter, more macro-friendly plate, cut the oil back to 3 or 4 tablespoons and lean harder on the starchy pasta water to emulsify. You lose the calories, not the silky cling. Adding prawns or chicken, and a handful of greens or cherry tomatoes, makes it eat fuller for fewer calories per bite.',
  ],

  storage:
    'Aglio e olio is best eaten the moment it is tossed, while the sauce is hot and glossy. It does not keep well, since the emulsion breaks and the pasta dries as it sits. Make only what you will eat.',

  dropcap: true,

  image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=1200&q=80',
  imageIsStock: true,
};

export default recipe;
