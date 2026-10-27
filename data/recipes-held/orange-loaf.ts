// data/recipes-held/orange-loaf.ts
import type { RecipeInput } from '../recipes/_types';

const recipe: RecipeInput = {
  title: 'Orange Loaf',
  featuredIngredients: ['yoghurt'],
  category: 'dessert',
  difficulty: 'Easy',
  servings: 10,
  time: { active: 40, total: 300, resting: 205 },
  yield: 'One 900g loaf, 10 slices',
  tags: ['baking', 'treat', 'vegetarian'],

  ingredients: [
    {
      heading: 'The oranges',
      items: [
        { name: 'large oranges, unwaxed if you can find them (for the zest and all the juice)', amount: 3, unit: '' },
      ],
    },
    {
      heading: 'The loaf',
      items: [
        { name: 'caster sugar', amount: 180, unit: 'g' },
        { name: 'finely grated orange zest (all of it from the 3 oranges, less 1 tsp)', amount: 2, unit: 'tbsp' },
        { name: 'large eggs, at room temperature', amount: 3, unit: '' },
        { name: 'full-fat Greek yogurt, at room temperature', amount: 170, unit: 'g' },
        { name: 'light olive oil or sunflower oil, plus a little for the tin', amount: 120, unit: 'ml' },
        { name: 'fresh orange juice', amount: 100, unit: 'ml' },
        { name: 'plain flour', amount: 210, unit: 'g' },
        { name: 'baking powder', amount: 2, unit: 'tsp' },
        { name: 'fine salt', amount: 0.25, unit: 'tsp' },
      ],
    },
    {
      heading: 'The syrup',
      items: [
        { name: 'fresh orange juice', amount: 60, unit: 'ml' },
        { name: 'caster sugar', amount: 40, unit: 'g' },
      ],
    },
    {
      heading: 'The glaze',
      items: [
        { name: 'icing sugar, plus a spoonful extra in case', amount: 120, unit: 'g' },
        { name: 'fresh orange juice (start with 1.5 tbsp)', amount: 2, unit: 'tbsp' },
        { name: 'finely grated orange zest', amount: 1, unit: 'tsp' },
      ],
    },
  ],

  steps: [
    {
      heading: 'Before you start',
      items: [
        'An hour before baking, set the eggs and the yogurt out on the counter (in a hurry, the eggs can warm in a bowl of warm tap water for 5 minutes). Cold, they chill the whole batter, so the outside of the loaf sets while the middle is still heating up: you get a tall, cracked peak over a dense, damp seam. At room temperature, the eggs also whisk up lighter and the batter bakes evenly through.',
        'Set a shelf in the middle of the oven and heat it to 170°C (150°C fan). Brush a 900g (2lb) loaf tin, about 23 by 13cm across the top and 7cm deep, with a little oil. Cut a strip of baking paper as wide as the base and long enough to run across the bottom and up both long sides with about 3cm hanging over each edge, and press it in. The short ends just stay oiled. The overhang is your handle for lifting the soaked loaf out later. A paper loaf-tin liner does the same job.',
        'Wash and dry the oranges. Grate the zest finely from all three, taking only the thin orange layer and stopping as soon as you see white, because the pith underneath is bitter. You should have 2 to 3 tbsp. Put 1 tsp in a small covered bowl for the glaze; all the rest goes in the loaf.',
        'Now halve and squeeze the oranges and strain the juice. Measure out 100ml for the batter, 60ml for the syrup and 2 tbsp for the glaze. Three large oranges give enough, with a little to spare.',
      ],
    },
    {
      heading: 'The batter',
      items: [
        'Put the 180g of caster sugar and the zest in a large bowl and rub them together between your fingertips for 1 to 2 minutes, until the sugar looks like damp, pale orange sand and the bowl smells strongly of orange. The sugar crystals tear the zest and pull its oils out into the sugar, which carries the flavour through the whole crumb. Orange juice is milder than lemon juice, so the zest has to do more of the work.',
        'Crack in the eggs and whisk hard by hand for 1 minute, until the mixture is a shade paler, and a little frothy, with the sugar starting to dissolve. Whisk in the yogurt until smooth.',
        'Keep whisking while you pour in the oil in a thin, steady stream, until the batter is glossy and no oil is pooling on the surface, then whisk in the 100ml of orange juice. It will look thin at this stage; that is right.',
        'In a second bowl, whisk the flour, baking powder and salt together so the baking powder is evenly spread. Tip it into the wet mix and fold with a spatula, scraping right across the bottom of the bowl, just until no dry flour shows, about 15 to 20 strokes. A few small lumps are fine. Beating it now makes a tough, tunnelled loaf.',
        'Scrape the batter into the lined tin and level the top. It should come a little over halfway up. Tap the tin firmly on the counter twice to knock out any large air bubbles.',
      ],
    },
    {
      heading: 'Bake',
      items: [
        'Bake on the middle shelf for 50 to 60 minutes. Keep the door shut for the first 35 minutes, then have a look: if the top is already a deep golden brown, lay a sheet of foil loosely over the tin, without tucking it in, and carry on baking. A batter rich in sugar and juice colours quickly, and the foil lets the middle catch up without the top going dark.',
        'It is done when it has risen with a crack along the top, the inside of the crack looks dry and matt rather than shiny and wet, and the top springs back when you press it lightly. Push a skewer into the middle of the crack, right to the bottom: it should come out clean or with a few moist crumbs, but no wet batter. A probe thermometer in the centre should read 95 to 98°C. If it is not there yet, give it 5 minutes more and test again.',
        'While the loaf has its last 10 minutes, make the syrup. Put the 60ml of orange juice and the 40g of caster sugar in a small pan over medium-low heat and stir until the sugar has dissolved and the liquid turns clear, about 2 minutes. Let it bubble gently for 2 minutes more, until it has reduced a little and looks slightly syrupy, then take it off the heat. Orange juice is thin and mild, so this short simmer concentrates it and thickens it just enough to cling and sink in slowly rather than run straight to the base of the tin. Keep it to 2 minutes: a long boil makes it taste of marmalade rather than fresh orange.',
      ],
    },
    {
      heading: 'Soak while warm',
      items: [
        'Set the tin on a wire rack and leave the loaf in it for 10 minutes. Then poke holes all over the top with a skewer, about 2cm apart, pushing each one three quarters of the way down.',
        'Warm the syrup again for a few seconds if it has cooled, then brush or spoon it over the loaf a little at a time, letting each lot sink in before you add the next, and paying attention to the edges and corners, which dry out first. Use all of it; it takes about 5 minutes. A warm crumb drinks warm syrup right down into the middle; on a cold loaf it would sit on top as a sticky layer.',
        'Leave the loaf in the tin for another 30 minutes, so the syrup spreads through and the crumb firms up. Then lift it out by the paper overhang, peel the paper away and leave it on the rack until completely cold, 1.5 to 2 hours. Touch the base: it must not feel even slightly warm before the glaze goes on.',
      ],
    },
    {
      heading: 'Glaze when cold',
      items: [
        'Sift the 120g of icing sugar into a bowl and add the reserved teaspoon of zest and 1.5 tbsp of the orange juice. Stir with a spoon until smooth. You want it very thick, like cold honey: lift the spoon and the ribbon that falls back should sit on the surface for a few seconds before it sinks in. If it is too stiff to move, add the last of the juice half a teaspoon at a time. Go slowly, because a few drops take it from thick to runny. If you overshoot, sift in the spare spoonful of icing sugar to thicken it again.',
        'Set the rack over a tray or a sheet of baking paper to catch the drips. Spoon the glaze along the top of the loaf and nudge it out to the edges with the back of the spoon, so that a few thick drips run down the sides. Leave it for 30 minutes to 1 hour, until the glaze has set to a matt shell that does not stick to your finger. Slice with a serrated knife, about 2cm thick.',
      ],
    },
  ],

  nutrition: { calories: 365, protein: 6, carbs: 53, fat: 14 },
  flavorProfile: { sweet: 4, salty: 0, sour: 2, bitter: 1, umami: 0, spicy: 0 },

  isVegetarian: true,
  isVegan: false,
  isGlutenFree: false,
  isDairyFree: false,

  quote:
    'A soft, golden loaf that tastes of orange three times over: in the crumb, in the warm syrup it drinks, and in the thick glaze that sets on top.',
  description:
    'This orange loaf puts the fruit in three places. Zest from three oranges is rubbed into the sugar so its oils perfume the whole crumb, a warm orange syrup is brushed over the loaf straight out of the oven so it soaks right through, and a thick orange glaze goes on once it has cooled, setting to a sweet, sharp shell. Oil and Greek yogurt in place of butter give a fine, tender crumb that stays soft for days rather than firming up overnight, and light olive oil sits well with orange without tasting of itself. It is a one-bowl, whisk-by-hand bake with no mixer, and it is even better on the second day. For a bittersweet, marmalade-like loaf, there is a whole blended orange version below.',
  attribution: 'A Nieves\'s Kitchen take on the orange yogurt loaf',

  headnoteIngredients:
    'Oranges carry most of their flavour in the oils of the peel rather than in the juice, which is sweet and mild, so this loaf leans on the zest of three of them. Unwaxed oranges are best since you eat the peel; if yours are waxed, scrub them in warm water and dry them well before grating. Any large, thin-skinned orange works, and navels are easy to zest and juice. Use full-fat Greek yogurt: its fat and thickness are what keep the crumb soft, and plain full-fat Greek yogurt is normally just milk and cultures, but check the label for gelatine, which turns up in some low-fat and set yogurts. Light olive oil (the mild, pale kind, not extra virgin) or sunflower oil both work; the oil stays liquid at room temperature, which is why the loaf never goes hard the way a butter cake does.',
  headnoteInstructions:
    'Weigh the flour and sugar: a loaf is less forgiving of guesswork than a stew. The two timings that make this loaf are the syrup going on while the loaf is warm, so it soaks in, and the glaze going on only once the loaf is completely cold, so it sets thick and opaque instead of melting and running off. Allow about 5 hours from start to slicing, most of it cooling, plus an hour beforehand for the eggs and yogurt to lose their chill, or bake it the day before. If the top browns before the middle is cooked, foil is the fix, not a lower oven.',

  equipment: [
    'A 900g (2lb) loaf tin, about 23 by 13cm across the top. A 20cm square cake tin works too: bake for 35 to 40 minutes and use the same tests.',
  ],

  tips: [
    'Zest the oranges before you juice them. Grating a squeezed orange half is slow and messy, and you lose half the zest.',
    'Syrup on warm, glaze on cold. The warm loaf soaks up the syrup; a cold loaf holds the glaze. Glaze a warm loaf and it turns thin and see-through and slides off.',
    'If the top colours too fast, lay foil loosely over it at the 35 minute check and carry on. A dark metal tin browns faster, so start checking 5 minutes early if yours is one.',
    'Fold, do not beat, once the flour goes in. Stop as soon as the last streak of flour disappears.',
    'If your oranges do not give 190ml of juice between them, top up with fresh chilled orange juice from a carton (not from concentrate).',
    'Taste a drop of the juice before you make the syrup. If your oranges are very sweet, add 1 tbsp of lemon juice to the syrup, so the soak tastes bright and sharp against the sweet glaze.',
    'Make it a day ahead if you can. Overnight, the syrup settles evenly through the crumb and the orange flavour deepens.',
  ],

  substitutions: [
    'Sunflower or rapeseed oil in place of light olive oil, for a cleaner, plainer taste. A mild, fruity extra virgin olive oil also works; a strong, peppery one will taste bitter here.',
    'Natural full-fat yogurt instead of Greek: it is thinner, so cut the orange juice in the batter to 80ml.',
    'Self-raising flour: use 210g and leave out the baking powder.',
    'Clementines or satsumas: use the zest and juice of about 6 for a softer, sweeter orange flavour. Blood oranges in winter turn the glaze pink.',
    'A gluten-free plain flour blend works weight for weight. The crumb is a little more fragile, so let it cool fully before slicing.',
    'For a dairy-free loaf, use a thick, unsweetened soya or coconut yogurt in place of the Greek yogurt.',
  ],

  variations: [
    'Whole blended orange, for a bittersweet, marmalade-like loaf. You need 1 thin-skinned navel orange, about 220g, plus 2 more oranges for the syrup and glaze. Wash the navel orange, slice off both ends, cut it into quarters lengthways, and cut away the white core and any seeds. Where the white pith is thicker than about 5mm, slice some of it off, but keep the peel. Blend the pieces with the 120ml of oil in a blender or food processor for about 1 minute, scraping down once, until you have a smooth, flecked purée with no bits bigger than a lentil. Skip the zest-rubbing step and use only 100g of Greek yogurt, and no juice, in the batter: whisk the sugar and eggs for 1 minute, whisk in the yogurt, then the orange purée, and fold in the dry ingredients as written. Bake with the same tests; it may need 5 to 10 minutes longer. Juice and zest the other 2 oranges for the syrup and glaze as usual.',
    'Orange and cardamom: whisk 1/2 tsp ground cardamom (or the seeds of 6 green pods, ground) into the flour, and add a small pinch to the glaze. Cardamom and orange share the same floral, slightly resinous note.',
    'Orange and almond: swap 70g of the flour for 70g of ground almonds. The crumb turns denser and even moister, and the loaf keeps a day longer. It may need 5 minutes more in the oven; use the same tests.',
    'Jaffa: toss 100g of dark chocolate chips in 1 tsp of the flour and fold them in with the dry ingredients. Skip the glaze and, once the loaf is cold, drizzle over 50g of dark chocolate melted in short bursts in the microwave. Read the chocolate label, since a few brands add alcohol-based flavourings.',
    'Orange blossom glaze: stir 1/4 tsp of orange blossom water into the glaze. Brands vary a lot in strength, so add a few drops, taste, then add more. It should smell of blossom, not soap.',
    'Candied orange slices for the top: slice 1 orange into rounds about 3mm thick and pick out any seeds. Bring 200ml of water and 100g of sugar to a simmer in a wide pan, lay the slices in, and simmer very gently for 30 to 40 minutes, turning once, until the peel is translucent. Drain them on a rack for 1 hour, then press them into the glaze while it is still wet.',
  ],

  storage:
    'Keep it in an airtight tin or wrapped at room temperature for up to 5 days; the crumb stays soft all week. Do not refrigerate it: the fridge dries the crumb and makes the glaze weep. To freeze, soak the loaf with the syrup, cool it completely and wrap it well without the glaze, for up to 3 months. Thaw it at room temperature in its wrapping, then make the glaze fresh. Slices freeze well too, wrapped individually.',

  dropcap: true,

  image: 'https://images.unsplash.com/photo-1676822100416-c96e27b2db5b?w=1200&q=80',
  imageIsStock: true,
};

export default recipe;
