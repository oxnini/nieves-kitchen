// data/recipes-held/massaman-beef-curry.ts
import type { RecipeInput } from '../recipes/_types';

const recipe: RecipeInput = {
  title: 'Massaman Beef Curry',
  country: 'Thailand',
  featuredIngredients: ['beef'],
  category: 'main',
  difficulty: 'Medium',
  servings: 6,
  time: { active: 60, total: 190, resting: 10 },
  yield: 'Serves 6 with jasmine rice (or 4, with two portions left for tomorrow)',
  tags: ['high-protein', 'comfort food', 'meal-prep friendly', 'weekend feast'],

  region: 'Southeast Asia',
  coordinates: { lat: 7.0084, lng: 100.4747 },
  influences: ['Thailand'],

  ingredients: [
    {
      heading: 'The beef braise',
      items: [
        { name: 'halal beef chuck (or braising steak), in 4cm cubes', amount: 1000, unit: 'g' },
        { name: 'neutral oil, for browning', amount: 1, unit: 'tbsp' },
        { name: 'cinnamon stick', amount: 1, unit: '' },
        { name: 'star anise', amount: 2, unit: '' },
        { name: 'green cardamom pods, lightly crushed', amount: 6, unit: '' },
        { name: 'dried bay leaves', amount: 3, unit: '' },
        { name: 'massaman curry paste (one 114g tin), divided: 1 tbsp for the braise, the rest for the curry', amount: 6, unit: 'tbsp' },
        { name: 'water', amount: 300, unit: 'ml' },
        { name: 'full-fat coconut milk, shaken (the first tin)', amount: 400, unit: 'ml' },
      ],
    },
    {
      heading: 'The curry',
      items: [
        { name: 'waxy potatoes, such as Charlotte or Maris Peer, peeled and cut into 3 to 4cm chunks', amount: 500, unit: 'g' },
        { name: 'large onion, cut into 8 wedges through the root', amount: 1, unit: '' },
        { name: 'neutral oil, for the potatoes', amount: 1, unit: 'tbsp' },
        { name: 'full-fat coconut milk, unshaken (the second tin)', amount: 400, unit: 'ml' },
        { name: 'garlic cloves, finely grated', amount: 3, unit: '' },
        { name: 'fresh ginger, finely grated', amount: 1, unit: 'tbsp' },
        { name: 'lemongrass paste (or the tender core of 1 fresh stalk, very finely chopped)', amount: 1, unit: 'tbsp' },
        { name: 'palm sugar, grated or chopped (or soft light brown sugar), divided: 2 tbsp for the pot, up to 1 more to taste', amount: 3, unit: 'tbsp' },
        { name: 'fish sauce, divided: 1 tbsp for the pot, the rest to taste', amount: 3, unit: 'tbsp' },
        { name: 'tamarind paste, the pourable Thai kind (see note), divided: 2 tbsp for the pot, up to 1 more to taste', amount: 3, unit: 'tbsp' },
        { name: 'roasted unsalted peanuts, divided: 40g whole for the pot, 20g chopped for the top', amount: 60, unit: 'g' },
      ],
    },
    {
      heading: 'To serve',
      items: [
        { name: 'jasmine rice, cooked', amount: 0, unit: '' },
        { name: 'fresh coriander, a big handful, roughly chopped', amount: 0, unit: '' },
        { name: 'fresh green chili, thinly sliced', amount: 0, unit: '' },
      ],
    },
  ],

  steps: [
    {
      heading: 'Toast the spices and brown the beef',
      items: [
        'Take the beef out of the fridge while you get everything else ready and pat the cubes dry with kitchen paper. Dry meat browns; wet meat steams. Put the second tin of coconut milk in the fridge without shaking it, so its cream sets thick on top for cracking later.',
        'Set a large heavy pot over medium heat with nothing in it. Add the cinnamon stick, star anise, cardamom pods and bay leaves and toast them for 1 to 2 minutes, shaking the pot, until they smell warm and sweet and the cardamom has a few golden spots. Tip them onto a plate.',
        'Turn the heat up to medium-high and add the tablespoon of oil. Brown the beef in three batches, adding a drizzle more oil if the pot looks dry, so the cubes have space and sear rather than stew. Leave each batch alone for 2 to 3 minutes until it releases from the base, then turn and give it another 2 minutes, until deep brown on at least two sides. Lift each batch onto a plate as it is done.',
      ],
    },
    {
      heading: 'The braise',
      items: [
        'Turn the heat down to medium. Stir 1 tablespoon of the curry paste into the fat in the pot for about 30 seconds, until it smells toasty, then pour in the 300ml water and scrape up every browned bit from the base. Those bits are a lot of the flavour.',
        'Return the beef with any juices, the toasted spices and the shaken tin of coconut milk. The liquid should come almost to the top of the beef; add a splash more water if it does not.',
        'Bring it to a gentle simmer, then turn the heat to low, put the lid on and simmer for 90 minutes, with just a few lazy bubbles breaking the surface. A hard boil toughens the beef and can make the coconut milk catch. Stir once or twice and top up with a little water if the liquid drops well below the meat.',
        'After 90 minutes, check a cube. You want a fork to slide in with little resistance while the cube still holds its shape, because it gets another 25 minutes in the curry. Most chuck needs 1½ to 2 hours in all, so give it up to 30 minutes more if it is still firm.',
        'Short on time? Use a pressure cooker instead. Toast the spices and brown the beef in the cooker on its sauté or browning setting, as above, in three or four batches, since the base is smaller than a pot. Fry the tablespoon of paste for 30 seconds, then pour in just 150ml of the water, not 300ml, because nothing evaporates under pressure, and scrape the base completely clean: anything left stuck can scorch and trip the burn warning. Add the beef with its juices and the spices, then pour the shaken coconut milk over the top and do not stir, so the thick milk is not sitting on the hot base. Lock the lid and cook at high pressure for 30 minutes, then let the pressure come down naturally for 10 minutes before releasing the rest. That is a little less than you might expect, because the beef still has 25 minutes in the curry. Check a cube as above, and if it is still firm, give it 5 more minutes at high pressure. Brown the potatoes and fry the paste in the frying pan while it cooks, then finish the curry in the cooker (see Bring it together). It takes the whole recipe from a little over 3 hours down to about 2¼.',
      ],
    },
    {
      heading: 'Golden potatoes and onion',
      items: [
        'Start these while the beef simmers, about 70 minutes into the braise, so they are ready around the time you check it. If the beef needs longer, the potatoes and paste can wait off the heat. Pat the potato chunks dry. Heat the tablespoon of oil in a large frying pan (non-stick is easiest) or wok over medium-high heat and add the potatoes in a single layer. Fry them for 6 to 8 minutes, turning once or twice, until golden in patches on two or three sides. They do not need to cook through. The crust, and a waxy potato, are what keep them whole through the simmer.',
        'Push the potatoes to one side, add the onion wedges and fry for about 2 minutes, until they catch at the edges. Tip the potatoes and onion onto a plate and keep the pan.',
      ],
    },
    {
      heading: 'Crack the cream and fry the paste',
      items: [
        'Open the unshaken tin and spoon the thick cream off the top, roughly the top third of the tin, into the same pan over medium heat. Let it bubble, stirring now and then, for 4 to 6 minutes, until it splits: clear oil pools around the edges and the white solids look curdled and start to sizzle. Keep the thin coconut milk left in the tin. If your tin has not separated at all, measure out 150ml and let it boil, stirring, until it has reduced by half and looks oily at the edges, then carry on.',
        'Turn the heat down to medium-low. Add the rest of the curry paste with the garlic, ginger and lemongrass and fry, stirring all the time, for 4 to 5 minutes, until the paste darkens a shade to a deep brick red, red oil seeps out around it and it smells rich and toasty rather than raw. If it starts to stick before then, loosen it with a spoonful of the thin coconut milk. Keep your face back from the pan, as the fumes catch the throat.',
        'Pour the rest of the thin coconut milk into the pan and stir until the paste dissolves into it.',
      ],
    },
    {
      heading: 'Bring it together',
      items: [
        'Scrape the paste mixture into the pot of beef and stir gently. Add the potatoes and onion, 2 tablespoons of the palm sugar, 1 tablespoon of the fish sauce and 2 tablespoons of the tamarind, and nudge the potatoes down so they are mostly under the sauce. Seasoning now means the potatoes soak it up as they cook.',
        'Bring it back to a gentle simmer and cook with the lid off for 20 to 25 minutes, stirring carefully now and then so the beef stays in cubes, until a knife slides easily into the potatoes and the sauce has thickened slightly, with a layer of red oil on top. Stir in the 40g of whole peanuts for the last 10 minutes. Cook the jasmine rice while it simmers.',
        'Using a pressure cooker? Finish in the cooker with the lid off. Set it to sauté, stir in everything as above, bring it to a bubble, then turn the sauté setting down to low so it just simmers for 20 to 25 minutes, with the peanuts in for the last 10. Stir right down to the base every few minutes, as a cooker base runs hotter than a pot and coconut sauce catches there. The sauce reduces to about the same point as on the hob; if it is still thin once the potatoes are tender, give it 5 more minutes on the normal setting, stirring gently. Then taste and season as below.',
        'Turn off the heat and taste a spoonful of the sauce with a piece of potato, since that is how it will be eaten. It should taste rich and gently sweet first, then tangy, then salty, with the warm spices underneath. Adjust in that order, a teaspoon at a time, stirring and tasting after each: more palm sugar if it tastes sharp or thin, more fish sauce if it tastes flat, then more tamarind if it tastes heavy or too sweet. Many pots take another tablespoon or two of fish sauce, because the curry is seasoned lightly at first and pastes vary a lot in salt. If you overshoot on salt, a splash of water with a little more sugar and tamarind brings it back.',
        'Fish out the cinnamon stick, star anise and bay leaves, or warn everyone they are in there. The cardamom pods can stay; just push them aside as you eat. Leave the curry to rest for 10 minutes off the heat, so the sauce settles and thickens a little.',
      ],
    },
    {
      heading: 'To the table',
      items: [
        'Spoon the curry over jasmine rice and pile the chopped peanuts, plenty of coriander and sliced green chili on top.',
      ],
    },
  ],

  nutrition: { calories: 780, protein: 41, carbs: 35, fat: 53 },
  flavorProfile: { sweet: 3, salty: 3, sour: 2, bitter: 0, umami: 3, spicy: 2 },

  isVegetarian: false,
  isVegan: false,
  isGlutenFree: true,
  isDairyFree: true,

  quote:
    'Beef braised soft with toasted cinnamon, cardamom and star anise, then folded into a brick-red paste fried in cracked coconut cream, with golden potatoes, peanuts and a sweet, sour, salty finish.',
  description:
    'Massaman is the gentlest and most spiced of the Thai curries: less heat, and far more cinnamon, cardamom and star anise. Its name is usually traced to an old word for Muslim and its spices to the Persian and Muslim traders who carried them, so it sits naturally with halal beef. This version starts from a good shop-bought paste and does the things that make a jar taste homemade. The whole spices are toasted before the beef goes in, a spoonful of the paste seasons the braise so the beef tastes of it all the way through, and the rest is fried slowly in cracked coconut cream with fresh garlic, ginger and lemongrass until it turns deep brick red. The potatoes and onion are browned first so they hold their shape, and the sweet, sour and salty balance is set at the end, by taste, the way Thai cooks do it. A pile of coriander and sliced green chili finishes it, and a pressure cooker can cut the braise to 30 minutes.',
  attribution: 'A Nieves\'s Kitchen take on a Thai classic',

  headnoteIngredients:
    'Use a good Thai massaman paste. Maesri and Mae Ploy are both good, and a 114g tin of Maesri is about the 6 tablespoons here, so use the whole tin. Shrimp paste is the usual savoury base and that is fine; check the label for anything else, or buy a tub with a halal mark, which many Thai brands carry. The paste and fish sauce are normally gluten-free, but a few brands add wheat, so check if that matters to you. Buy the beef from a halal butcher and ask for chuck. Full-fat coconut milk is a must, and the second tin stays unshaken so the cream sits on top for cracking. For the tamarind, use the brown, pourable Thai paste, often labelled tamarind concentrate. A thick, black Indian concentrate is far stronger, so use a third as much: 2 teaspoons in the pot and up to 1 more to taste. The nutrition is for the curry alone, without the rice, since everyone eats a different amount.',
  headnoteInstructions:
    'Toast, brown and braise, then use the braising time: the potatoes and the paste are done in a frying pan in the last 20 minutes or so, so everything meets at once. On the hob it takes a little over 3 hours, most of it a simmer you can leave alone, and a pressure cooker brings it down to about 2¼. Like most braises, it is even better the next day.',

  equipment: [
    'A large heavy-based pot with a lid, about 24cm across, such as a casserole dish or Dutch oven. A thick base keeps the coconut milk from catching on the long simmer, and it needs room for the potatoes later.',
  ],

  tips: [
    'Stop the braise a little early. The beef should be tender but still holding together when the potatoes go in, because it gets another 25 minutes in the curry. Braise it until it falls apart and you end up with shreds.',
    'Cracked coconut cream looks wrong the first time: oily, curdled, sizzling. That is exactly right, and frying the paste in that oil is what turns a jar into a curry. If the cream will not split, which happens with brands that add emulsifiers, add 1 tablespoon of oil and fry the paste in that until thick and fragrant.',
    'Fry the paste low and slow and keep it moving. It should darken a shade and smell toasty, never scorched. A burnt paste turns bitter, and there is no fixing it.',
    'Waxy potatoes, browned first, stay in chunks. Floury potatoes dissolve into the sauce.',
    'Season at the end and taste between each addition, in the order sweet, salty, sour. Massaman should lean a little sweet and tangy, with the salt behind them.',
    'Leave the red oil on top. That sheen is the sign of a well-fried paste, not a mistake to skim off.',
  ],

  substitutions: [
    'Short ribs make an even richer massaman. Use 1.5kg bone-in (or 1kg boneless), brown them the same way and give them 2 to 2½ hours, or 40 minutes at high pressure.',
    'Yellow or white-fleshed sweet potato in place of the potatoes is a common Thai choice. It cooks a little faster, so start checking after 15 minutes.',
    'Eight small shallots, peeled and left whole, in place of the onion wedges.',
    'Low-salt beef stock in place of the water gives a deeper braise. Buy a halal-certified stock or stock cubes, since not every brand is, and taste before adding any more fish sauce.',
    'Block tamarind works well. Soak 20g of the pulp in 60ml of hot water for 10 minutes, squeeze it through your fingers, then sieve it and use the liquid spoon for spoon in place of the paste.',
    'Only have salted peanuts? Use them, and hold back the extra fish sauce until you have tasted. Raw peanuts need toasting first: 5 minutes in a dry frying pan over medium heat, shaken often, until golden.',
    'Cassia bark in place of the cinnamon stick gives a richer, deeper spice.',
  ],

  variations: [
    'Make it a day ahead. Stop after the braise, cool the beef in its liquid and refrigerate it overnight. The next day, lift off the set fat if you like, bring it back to a gentle simmer and carry on with the potatoes and paste. The flavour deepens overnight, and the potatoes are cooked fresh, so they stay whole.',
    'Chicken massaman: use 8 skin-on, bone-in chicken thighs. Brown them skin side down for 6 to 8 minutes until golden, braise them as above for just 20 minutes, then add the potatoes and paste and simmer for 25 minutes more, until the potatoes are tender and the chicken reaches 74°C at the bone and pulls away easily.',
    'Lamb shank massaman: brown 4 lamb shanks all over and braise them for 2½ to 3 hours, turning them now and then, until the meat is falling from the bone (or 45 minutes at high pressure). Then carry on with the potatoes and paste. Serves 4.',
    'Crispy shallots on top. Slice 3 shallots paper-thin, toss with a teaspoon of oil and a pinch of salt and air fry at 120°C for about 25 minutes, shaking every 5 minutes, until deep golden. They crisp further as they cool. Shop-bought crispy shallots are fine too.',
    'From-scratch paste in place of the jar: soak 8 large dried red chilies in hot water for 20 minutes, then seed them. Char 4 shallots, 5 unpeeled garlic cloves and a 3cm piece of galangal in a dry pan for 2 minutes, and toast 1 tsp coriander seeds, 1 tsp cumin seeds, the seeds of 4 cardamom pods and 3 cloves for 30 seconds. Blitz it all with a stalk of chopped lemongrass, ½ tsp ground cinnamon, 1 tsp shrimp paste, ½ tsp salt and 3 to 4 tbsp water until smooth. It makes about the same 6 tablespoons; fry it for 8 to 10 minutes in the cracked cream, as the water has to cook off first, and skip the extra garlic, ginger and lemongrass.',
  ],

  storage:
    'Keeps in a sealed container in the fridge for up to 4 days and tastes even better on the second. Reheat it gently, covered, with a splash of water, and do not boil it hard or the potatoes will break up. It freezes well for up to 3 months, though the potatoes turn a little grainy; if you are cooking to freeze, freeze the beef and sauce and add freshly browned potatoes when you reheat.',

  dropcap: true,

  image: 'https://images.unsplash.com/photo-1672933036331-e27ffae157bd?w=1200&q=80',
  imageIsStock: true,
};

export default recipe;
