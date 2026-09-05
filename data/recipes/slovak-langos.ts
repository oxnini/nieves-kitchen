// data/recipes/slovak-langos.ts
import type { RecipeInput } from './_types';

const recipe: RecipeInput = {
  title: 'Slovak Lángos with Garlic Water',
  country: 'Slovakia',
  category: 'main',
  difficulty: 'Medium',
  servings: 5,
  time: { active: 30, total: 90, resting: 60 },
  yield: 'Makes 5 lángos, one each',
  tags: ['vegetarian', 'treat', 'comfort food', 'budget-friendly'],

  region: 'Eastern Europe',
  coordinates: { lat: 48.1486, lng: 17.1077 },
  influences: ['Slovakia', 'Hungary'],
  featuredIngredients: ['garlic'],

  ingredients: [
    {
      heading: 'Dough',
      items: [
        { name: 'plain flour, plus extra for dusting', amount: 300, unit: 'g' },
        { name: 'fast-action dried yeast (one full sachet)', amount: 7, unit: 'g' },
        { name: 'fine sea salt', amount: 0.5, unit: 'tsp' },
        { name: 'caster sugar', amount: 1, unit: 'tsp' },
        { name: 'whole milk, lukewarm', amount: 200, unit: 'ml' },
      ],
    },
    {
      heading: 'Garlic water',
      items: [
        { name: 'garlic cloves', amount: 6, unit: '' },
        { name: 'fine sea salt', amount: 0.5, unit: 'tsp' },
        { name: 'warm water', amount: 90, unit: 'ml' },
      ],
    },
    {
      heading: 'To fry and serve',
      items: [
        { name: 'sunflower or rapeseed oil, for deep frying', amount: 1, unit: 'l' },
        { name: 'ketchup, to serve', amount: 4, unit: 'tbsp' },
      ],
    },
  ],

  steps: [
    {
      heading: 'Garlic water, first',
      items: [
        'Grate the garlic to a fine paste, crush the salt into it, then stir it into the warm water. Set it aside at room temperature. It needs about an hour for the raw bite to mellow, so make it now and forget about it. It will separate as it stands, which is normal. Stir it before it goes anywhere near the bread.',
      ],
    },
    {
      heading: 'The dough',
      items: [
        'Whisk the flour, yeast, salt and sugar together in a large bowl until evenly combined. Fingers are fine for this. Getting the yeast properly dispersed now is what gives you an even rise later.',
        'Make a well and pour in about 180ml of the milk, mixing with a wooden spoon until it comes together as a shaggy, messy mass. Add the rest a splash at a time. You are aiming for distinctly sticky and soft, not smooth. It should cling to your fingers and slump slightly rather than hold a ball. This will feel wrong if you have made bread before. It is right. If you badly overshoot, add flour a tablespoon at a time.',
        'Knead in the bowl or on a lightly oiled surface, oil rather than flour so you do not stiffen it. Push away with the heel of your hand, fold back, quarter turn, repeat. It stays tacky throughout, so resist adding flour. It is done when it is cohesive and springy and stops tearing as you fold it.',
        'Dust a clean bowl with flour, drop the dough in, cover with clingfilm or a damp tea towel, and leave somewhere warm and draught-free for about an hour. It should roughly double and look puffy and airy. Judge it by size, not by the clock. A cold kitchen will take the full hour and more.',
      ],
    },
    {
      heading: 'Shape and fry',
      items: [
        'Tip the dough onto a floured surface and press down gently to release only the largest bubbles. Divide into 5 pieces and roll each into a ball by cupping your hand over it and circling against the worktop. Cover with a tea towel and leave them to relax, or they will spring straight back when you try to stretch them.',
        'Pour the oil into a deep, heavy pot to a depth of at least 3cm and no more than a third full. Bring it to 180 to 190C over medium heat. It takes longer than you expect. Set a wire rack over a tray beside the hob and lightly oil your hands.',
        'Working with one ball at a time, flatten it with your fingertips, then lift and stretch it between your hands, rotating as you go and letting gravity pull it down. Aim for a rough 14cm disc, thin and almost see-through in the middle, thicker at the rim. Poke a small hole in the centre so it cooks evenly. Uneven and rustic is correct. Stretch each one immediately before it goes in, because a waiting disc shrinks back and dries at the edges.',
        'Lower it into the oil away from you, thin side down. It should sizzle at once and start to puff and blister. Fry until deep gold underneath, about a minute, then flip it with tongs and do the other side. One at a time, because crowding drops the oil temperature. Straight onto the rack, never onto kitchen paper and never stacked. Let the oil climb back to temperature before the next one goes in.',
        'Stir the garlic water and brush it generously over each lángos while it is still hot. Hot bread drinks it in, cooled bread just wears it. Serve straight away, with ketchup.',
      ],
    },
  ],

  nutrition: { calories: 380, protein: 8, carbs: 51, fat: 15 },
  flavorProfile: { sweet: 1, salty: 3, sour: 0, bitter: 0, umami: 2, spicy: 1 },

  isVegetarian: true,
  isVegan: false,
  isGlutenFree: false,
  isDairyFree: false,

  quote:
    'Fried bread the size of your hand, brushed with garlic water while it is still too hot to hold. No potato, no cheese, no ceremony.',
  description:
    'Lángos is Hungarian by birth. The name comes from láng, meaning flame, and it travelled with the old Austro-Hungarian empire until it was just as much at home in Slovakia, where my husband grew up eating it. This is his father’s version, scaled down for a home kitchen, and it is the plain one: no potato in the dough, no blanket of sour cream and grated cheese. Just a slack, sticky dough stretched thin by hand and fried hot and fast so it puffs and blisters, then brushed while it is still steaming with garlic crushed into salted water rather than oil. The garlic water is the whole thing. It soaks in rather than sitting on top, and an hour of standing takes the raw edge off it. Small pieces, one at a time, eaten standing up in the kitchen before anyone thinks to sit down.',
  attribution: "My father-in-law's recipe, scaled down for a home kitchen",

  headnoteIngredients:
    'The milk quantity is a guide and the feel is the recipe. Sticky and slack is right. Smooth and firm means it is too dry, and the lángos will come out dense and bready rather than light. Use the full sachet of yeast, because a dough enriched with milk wants the push. On the oil, a litre sounds like a lot for five pieces, but you need the depth for them to float and puff rather than sit on the base and fry flat, and once it has cooled it strains through a coffee filter and goes again two or three times, so very little of it is actually spent. This is a fried bread and there is no getting around what that means, roughly 380 calories a piece once you count what the dough takes on in the pot. It is tagged as a treat for exactly that reason.',
  headnoteInstructions:
    'Almost all of the ninety minutes is waiting. Make the garlic water first, because it needs an hour standing at room temperature to lose its raw edge, and that hour runs alongside the dough rise rather than after it. Then it is about fifteen minutes of mixing and kneading, an hour of leaving it alone, and twenty minutes at the pot. Do not stretch the discs ahead of time. They shrink back and dry at the edges, so each one gets shaped in the moment before it goes into the oil.',

  equipment: [
    'A deep, heavy pot. Depth matters more than width, since the dough needs room to float and puff rather than sitting on the base, and a heavy pan holds its temperature when a cold disc goes in',
    'A wire rack set over a tray. Kitchen paper steams the underside soft and undoes the crust you just made',
    'A thermometer, if you have one. The dough-scrap test below does the same job if you do not',
  ],

  tips: [
    'No thermometer? Drop in a small scrap of dough. It should sink briefly, then rise and sizzle steadily within about a second. Instant furious bubbling means the oil is too hot, sluggish means too cool.',
    'Never a rolling pin. It presses out the air the rise created, which is the entire reason the dough was left to prove.',
    'Oil your hands rather than flouring the worktop when you are stretching. Extra flour at this stage stiffens the dough and fights you.',
    'Brush them while they are hot, not warm. Hot bread drinks the garlic water in, cooled bread just wears it.',
    'The garlic water separates as it stands. That is normal, it is not broken, just stir it before you use it.',
    'Once it has cooled, strain the frying oil through a coffee filter and keep it. It will do this again two or three times.',
  ],

  substitutions: [
    'Whole milk gives the softest crumb, but semi-skimmed works and water alone still makes a perfectly good lángos, just a plainer one.',
    'Sunflower and rapeseed are both right here, neutral with a high smoke point. Olive oil is not. It burns well below frying temperature and its flavour fights the garlic.',
    'Fast-action yeast is what this is written around. If you only have active dried, wake it in the lukewarm milk with the sugar for ten minutes first, then carry on as written.',
    'No garlic in the house, or cooking for someone who will not eat it raw: salt the bread straight out of the pot instead, which is how children usually want it anyway.',
  ],

  variations: [
    'The dressed version, which is what most people in Hungary would picture: garlic water first, then sour cream spread over the hot bread, then a heap of grated cheese.',
    'Grated sheep cheese and a spoon of thick soured milk, which is the way it leans in parts of Slovakia.',
    'Sweet, for the last one of the batch: skip the garlic water and dust it with icing sugar while it is still hot.',
  ],

  storage:
    'Lángos is at its best within about ten minutes of leaving the pot and it does not keep in any way that does it justice. If one survives, it revives better than you would expect in a hot dry pan for a minute a side, though never in a microwave, which turns it to leather. The dough is the part worth making ahead: after kneading it will sit covered in the fridge overnight, then come back to room temperature for an hour before you shape it. The garlic water keeps 2 days in the fridge.',

  dropcap: true,

  image: '/recipes/slovak-langos-hero.webp',
  imageIsStock: false,
  images: [
    {
      url: '/recipes/slovak-langos-plated.webp',
      caption: 'The batch done, thin and almost translucent in the middle, puffed and chewy at the rim',
      width: 1086,
      height: 1448,
    },
  ],
};

export default recipe;
