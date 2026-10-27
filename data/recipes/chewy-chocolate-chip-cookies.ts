// data/recipes/chewy-chocolate-chip-cookies.ts
import type { RecipeInput } from './_types';

const recipe: RecipeInput = {
  title: 'Chewy Chocolate Chip Cookies',
  featuredIngredients: ['butter'],
  category: 'dessert',
  difficulty: 'Easy',
  servings: 16,
  time: { active: 45, total: 240, resting: 120 },
  yield: '16 large cookies',
  tags: ['baking', 'treat', 'vegetarian', 'comfort food'],

  ingredients: [
    {
      heading: 'The butter and sugar',
      items: [
        { name: 'unsalted butter', amount: 170, unit: 'g', note: 1 },
        { name: 'dark brown soft sugar', amount: 175, unit: 'g', note: 2 },
        { name: 'caster sugar', amount: 75, unit: 'g' },
        { name: 'large egg, at room temperature', amount: 1, unit: '' },
        { name: 'large egg yolk, at room temperature', amount: 1, unit: '' },
        { name: 'vanilla extract', amount: 2, unit: 'tsp', note: 3 },
      ],
    },
    {
      heading: 'The dry mix',
      items: [
        { name: 'plain flour', amount: 280, unit: 'g', note: 4 },
        { name: 'cornflour', amount: 2, unit: 'tsp', note: 5 },
        { name: 'bicarbonate of soda, level', amount: 1, unit: 'tsp' },
        { name: 'fine sea salt', amount: 0.75, unit: 'tsp' },
      ],
    },
    {
      heading: 'The chocolate',
      items: [
        { name: 'dark chocolate bar, 55 to 70% cocoa, chopped', amount: 150, unit: 'g', note: 6 },
        { name: 'dark chocolate chips', amount: 100, unit: 'g', note: 6 },
        { name: 'flaky sea salt, to finish', amount: 0, unit: '' },
      ],
    },
  ],

  steps: [
    {
      heading: 'Before you start',
      items: [
        'Take the egg out of the fridge about 30 minutes ahead, or sit it in a bowl of warm tap water for 5 minutes. A cold egg firms the warm butter back into greasy little lumps instead of blending into it.',
        'Chop the chocolate bar on a board with a big knife into rough chunks, anything from almond-sized pieces down to shards and dust. Keep all of it, dust included, because the fine bits streak through the dough. Set aside a small handful of the biggest chunks, about 30g, for the tops.',
      ],
    },
    {
      heading: 'Melt, whisk, rest',
      items: [
        'Melt the butter in a small pan over low heat, or in the microwave in 30 second bursts, then pour it into a large mixing bowl. Leave it to cool for about 10 minutes, until it feels warm rather than hot when you dip a finger in. Hot butter makes a thin, greasy dough that spreads too far, and it can start to cook the egg.',
        'While it cools, whisk the flour, cornflour, bicarbonate of soda and fine salt together in a second bowl, so the bicarb is spread evenly and nothing tastes soapy.',
        'Add both sugars to the warm butter and whisk until no lumps of brown sugar are left, about 30 seconds. Add the egg, the yolk and the vanilla and whisk for 30 seconds more, until smooth.',
        'Now leave the bowl alone for 3 minutes, then whisk again for 30 seconds. Do this twice more, three rests in all, about 10 minutes. The mixture goes from grainy and greasy to thick, smooth and shiny, the colour of caramel. That pause lets the sugar dissolve, and dissolved sugar is what bakes into a crisp, glassy edge while the middle stays soft.',
      ],
    },
    {
      heading: 'The dough',
      items: [
        'Tip the dry mix into the bowl and fold it in with a spatula until only a few dry streaks remain. Add the chopped chocolate (not the chunks you set aside) and the chips, and fold until no flour shows, then stop. The dough will be soft, glossy and quite loose.',
        'Cover the bowl and chill for 30 minutes, until the dough is firm enough to roll without feeling greasy. If it still slumps and smears on your hands, give it 15 minutes more.',
      ],
    },
    {
      heading: 'Shape, then chill',
      items: [
        'Line a tray or a large plate that fits in your fridge with baking paper. Divide the dough into 16 even pieces of about 63g, weighing each on the scales so they bake at the same rate (or halve the dough, halve each half, and keep halving until you have 16). Roll each into a ball, then stand it up and nudge it a little taller than it is wide, like a short, fat cylinder. Tall balls bake into thick cookies with soft middles; flat ones spread thin and crisp right through.',
        'Press two or three of the reserved chocolate chunks into the top of each ball, so they melt into pools on the surface. Set the balls close together on the lined tray, cover, and chill for 90 minutes or longer. They can stay in the fridge for up to 3 days, and the flavour gets deeper the longer they wait.',
      ],
    },
    {
      heading: 'Bake',
      items: [
        'About 20 minutes before you want to bake, heat the oven to 180°C (160°C fan) with a shelf in the middle, and line two baking trays, about 30 by 40cm, with baking paper.',
        'Set 6 cold balls on a lined tray in two rows of three, with about 8cm of space between them, because each spreads to around 10cm. Keep the rest in the fridge until their turn. If the balls have been in the fridge overnight or longer, let them sit on the tray at room temperature for 10 minutes first, so they spread properly instead of staying domed.',
        'Bake one tray at a time on the middle shelf for 12 to 14 minutes. Ovens vary a lot, so start checking at 10 minutes and keep checking every minute or so: the moment from just right to overbaked can be very short. Take them out when they look underbaked: the edges are set and golden brown in a band about 1cm wide, the tops have puffed and cracked, and the middles are still pale, soft and shiny-wet in the cracks, with a slight wobble if you nudge the tray. They finish setting on the hot tray. If the middles look dry and matt all over, they have gone too far, so take the next tray out a minute or two sooner.',
        'Straight away, while the tops are soft, scatter a few flakes of salt over each cookie so they stick. If any have spread out of round, nudge their edges back in with a spatula now, while they are still soft.',
        'Leave them on the tray for 10 minutes, until they are set enough to lift without bending, then move them to a wire rack. Give them about 20 minutes on the rack for the edges to crisp and the middles to settle into their chew.',
        'As soon as the first tray comes out, set the next 6 cold balls from the fridge on the second tray and bake them the same way. The last 4 go on the first tray once its cookies are on the rack: it must be cool, because a warm tray starts melting the butter before the oven does and the cookies spread thin. If it still feels warm, slide the paper off, run the tray under the cold tap, dry it and reline it.',
      ],
    },
  ],

  nutrition: { calories: 290, protein: 3, carbs: 37, fat: 15 },
  flavorProfile: { sweet: 5, salty: 2, sour: 0, bitter: 1, umami: 0, spicy: 0 },

  isVegetarian: true,
  isVegan: false,
  isGlutenFree: false,
  isDairyFree: false,

  quote:
    'A crisp, toffee-brown edge, a thick middle that bends instead of snapping, and pools of dark chocolate under a few flakes of salt.',
  description:
    'This is the chewy kind of chocolate chip cookie, the kind I prefer: a crisp edge, a soft middle that bends, and real pools of dark chocolate. Everything in the method leans that way. The butter is melted rather than creamed, so no air gets whipped in to make them cakey, and an extra egg yolk adds richness and chew. Most of the sugar is dark brown, which brings a deep butterscotch flavour and keeps the middles moist, and a ten-minute whisk-and-rest at the start dissolves the sugar so the edges bake crisp and glassy. A chopped bar alongside the chips is what gives you the puddles of chocolate. The dough needs two hours in the fridge, longer if you can wait, and the shaped balls keep for three days, so you can bake six at a time and eat them warm.',
  attribution: 'A Nieves\'s Kitchen take on the chewy chocolate chip cookie',

  headnoteIngredients:
    'Dark brown soft sugar is the backbone. Its molasses is where the butterscotch flavour comes from, and it holds on to moisture, which is what keeps the middles chewy. Light brown works too, with a milder, paler cookie. The smaller share of caster sugar is there for the crisp edge, and the spoonful of cornflour keeps the middle tender. Use unsalted butter so the salt is yours to set. For the chocolate, use both a bar and chips: the chips keep their shape, while the chopped bar melts into pools and its shards streak through the dough.',
  headnoteInstructions:
    'Weigh everything, the flour above all. A cup of flour can vary by a fifth, and extra flour is the usual reason cookies come out puffy and cakey. Three moments decide the texture: let the butter cool until it is warm, not hot; do the whisk-and-rest, which takes ten minutes and gives the edges their crunch; and take the cookies out while the middles still look underbaked, because they finish setting on the hot tray. The dough needs at least two hours in the fridge, and with three trays baked one after another it is about four hours from the first whisk to the last cookie cooled, so start in the morning for an afternoon bake, or make the dough the day before.',

  tips: [
    'Pull them early. When the edges are golden and set but the middles look pale, puffed and a little wet, they are done. A cookie that looks finished in the oven will be crisp right through once it cools.',
    'Give the dough a night if you can. Rested overnight, or up to 3 days, the flour soaks up the liquid, the flavour turns deeper and more like butterscotch, and the cookies brown more evenly. Two hours works; a night is better.',
    'Always put the dough on a cool tray. A warm one starts melting the butter before the oven does, and the cookies spread thin and lose their soft middles.',
    'Read the first tray. If the cookies spread thin and lacy, the dough was too warm: chill the rest for 30 minutes more and shape them a little taller. If they stayed domed and barely spread, let the next balls sit out for 10 minutes before baking, and check the flour weight.',
    'If the bottoms brown before the edges set, the tray is sitting too low or is very dark. Move it to the middle shelf, or slide a second tray underneath as a shield.',
    'Level the bicarbonate of soda, never heaped. A little too much tastes soapy and makes the cookies spread and darken too fast.',
  ],

  notes: [
    'Butter: with salted butter, cut the fine salt to a pinch and go easy with the flakes on top.',
    'Brown sugar: light brown soft sugar in place of dark gives a milder, paler cookie with slightly less chew.',
    'Vanilla: check the label on your vanilla extract.',
    'Gluten-free: a gluten-free plain flour blend works weight for weight. The cookies are a little more fragile and less chewy, and benefit most from the full overnight rest.',
    'No cornflour? Leave it out. The middles will be very slightly less tender.',
    'Chocolate: milk chocolate, or half milk and half dark, in place of the dark gives sweeter cookies with softer pools.',
  ],

  variations: [
    'Brown butter, for a deeper, toffee-like cookie. Melt the 170g of butter in a light-coloured pan over medium heat, then keep cooking it, swirling, for 3 to 5 minutes more, as it foams and the specks on the bottom turn hazelnut brown and it smells of toasted nuts. Scrape it into the bowl, every brown fleck included, stir in 1 tablespoon of milk to make up for the water that cooked off, and let it cool for about 15 minutes until warm, not hot. Then carry on exactly as written.',
    'Chewier still: swap 140g of the plain flour for strong white bread flour. Its extra protein gives a bendier, more elastic chew and slightly thicker cookies.',
    'Pan-banged, for wide, rippled cookies with fudgy middles. Put only 4 balls on each tray, since they spread further. Bake for 8 minutes, then lift one side of the tray about 10cm and let it drop back onto the shelf so the puffed middles collapse. Drop it again 2 minutes later, and once more 2 minutes after that. Take them out when the edges are golden, about 13 to 14 minutes in all. Use oven gloves for every drop.',
    'Stuffed. Before you make the dough, spoon 16 heaped teaspoons of chocolate hazelnut spread or Biscoff spread onto baking paper and freeze until solid, about 1 hour. When you shape the balls, flatten each piece of dough in your palm, set a frozen dollop in the middle, wrap the dough up around it and pinch it closed, then shape it tall as usual. Bake for 1 to 2 minutes longer.',
  ],

  storage:
    'Keep the cookies in an airtight tin at room temperature for up to 4 days. They firm up a little by the second day; a slice of bread in the tin keeps them soft, or warm them for 3 to 4 minutes in a 160°C (140°C fan) oven to bring back the soft middles and melting chocolate. Baked cookies freeze for up to 3 months. The shaped, unbaked balls keep covered in the fridge for 3 days, or freeze them on a tray, then bag them, for up to 3 months. Bake from frozen, adding 2 to 3 minutes.',

  dropcap: true,

  image: 'https://images.unsplash.com/photo-1719384980808-0f3b833a2468?w=1200&q=80',
  imageIsStock: true,
};

export default recipe;
