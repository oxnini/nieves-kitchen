# churros (draft b-churros)

File: /Users/nievesyang/Documents/GitHub/nieves-kitchen/data/recipes/churros.ts
Lint: clean apart from the info line for "alcohol-free vanilla extract" (intended). `npx tsc --noEmit`: no errors in churros.ts.

## Sources
- **RecipeTin Eats, Spanish churros** (the draft's base). Eggless: 1 cup (~150g) plain flour, 1 cup boiling water, 1 tbsp oil, 1 tsp baking powder, pinch salt. 5cm oil at 170°C (bread cube golden in 20 s). 8mm star tip; 15cm lengths snipped close to the oil surface; 3 to 4 at a time, 2 to 3 min. Make ahead: no sugar, reheat 5 min at 180°C, then sugar. Contributed: the water : flour ratio (250ml : 150g), snipping close to the surface, the baking-powder option in the eggless variation, the reheat method.
- **King Arthur Baking, churros** (choux with egg). 227g water, 113g butter, 150g flour, 4 eggs; cool the paste 5 to 10 min to **below 52°C (125°F)**, "a finger in it for a few seconds"; oil 1.3 to 1.9cm deep at 190°C; 2 min a side; **freeze-first option** (20 to 30 min, then 2.5 min a side); reheat 10 min at 175°C. Contributed: the dough-temperature cue before the egg, the freeze-ahead variation, the reheat timing.
- **Olivia Potts, The Spectator** (egg dough: 240ml water, 90g butter, 125g flour, 2 eggs). 180°C, pan **no more than half full**, 2 min per side, 4 at a time; dip the scissors in hot oil to snip; the egg "looks separated at first, keep beating"; too hot = raw inside, too cool = greasy; never leave oil unattended. Contributed: the separated-then-smooth cue, oiled scissors, the safety rules, too hot / too cool diagnosis.
- **Great British Chefs (Kate Doran)**. Eggless with bicarb; 180°C held with a thermometer; bread cube golden in 15 s; 1.5 to 2cm star nozzle; small batches to protect the temperature. Contributed: confirmation of 180°C and batching.
- **Pati Jinich, churros** (Mexican, eggless). 175°C, 3.8cm oil, start the oil before the dough because it takes a while; 3 to 4 min, flip once. Contributed: putting the oil on before the dough.
- **Moro (Sam and Sam Clark) churros con chocolate**. Egg dough cooked 1.5 min after the flour; oil 3cm deep; star nozzle; the sizzle test for oil. Contributed: cooking the paste on after it balls, 3cm oil depth.
- **Thick Spanish chocolate**: Bernard Laurance (chocolate con churros: 15 to 20g cornflour per 600ml liquid with 120g dark chocolate, boiled to thicken), the San Ginés-style recipe on Food Network (1 tbsp cornflour, thickens over about 5 min), Omar Allibhoy (whisk constantly so it does not scorch, dark chocolate for body). Contributed: the slurry-then-boil method and the cornflour ratio.
- **Bursting**: several recipe sources (and the widely shared "why do churros explode" coverage) agree a smooth round tip lets the skin set while steam builds inside; ridges vent steam and cook more evenly; trapped air pockets add to it; overly hot oil makes it worse.
- **Air fryer**: Binky's Culinary Carnival (egg dough, chill/freeze piped churros, spray with oil, flip halfway, cut one open to check), Milk Street air-fryer churros (a reviewer found them underdone at 175°C and fixed it at 190°C), Preppy Kitchen's "cut one open, add 2 min if wet" (via search summary), and a tester noting they are lighter and airier than fried.
- Felicity Cloake's Guardian column and Serious Eats could not be fetched (both block the fetcher).

## Ratio check (dough)
| Source | Water | Flour | Fat | Egg | Water+egg : flour |
|---|---|---|---|---|---|
| RecipeTin (eggless) | 250ml | ~150g | 1 tbsp oil | 0 | 1.67 |
| GBC (eggless) | 320ml | 225g | 40g butter | 0 | 1.42 |
| Spectator | 240ml | 125g | 90g butter | 2 (~100g) | 2.7 |
| King Arthur (choux) | 227g | 150g | 113g butter | 4 (~200g) | 2.85 |
| **Draft = this recipe** | 250ml | 150g | 30g butter | 1 (~50g) | 2.0 (less ~20ml lost cooking the paste) |

The draft sits between the stiff Spanish eggless dough and a full choux. That is right for the brief: stiff enough to hold sharp closed-star ridges and to burst less than a loose choux, while the egg gives the fluffier middle. Kept as drafted. Chocolate: Laurance is ~3g cornflour per 100ml liquid; San Ginés ~3.5g per 100ml for a dunking chocolate. The draft's 1 tsp (3g) for 200ml is about half that, so I raised it to 2 tsp (6g) for 250ml (2.4g per 100ml) because 100g chocolate (40% of the milk weight) adds a lot of body on top. Result: thick, spoon-coating, sets further as it stands.

## Draft applied
- Fork `dough` default **with egg**: main recipe. Fork option `eggless` → full variation (flour, water, salt, oil; baking powder optional per RecipeTin).
- No `yourNote` on this dish.
- Draft ingredients kept: 250ml water, 30g butter, 1 tbsp sugar, 1/2 tsp salt, 150g plain flour, 1 egg, 1/2 tsp alcohol-free vanilla, sunflower oil, 100g caster sugar + 1.5 tsp cinnamon, 100g dark chocolate, 1 tbsp sugar, pinch salt. Changed: milk 200 → 250ml and cornflour 1 → 2 tsp (thicker, see ratio check); oil specified as 3cm (about 1 litre) instead of "2 to 3cm".
- Draft steps kept: boil, flour all at once, stir a minute more, cool 5 min, egg in, pipe 12cm lengths into 180°C oil, 3 to 4 min, roll in cinnamon sugar hot, chocolate over low heat.
- Nozzle: the draft said "large open star"; the dish notes ask for a **closed star** (deeper, tighter ridges), so the recipe says closed star, about 1cm.
- Tweaks → variations: `freeze` (fry from frozen at 175°C), `dulce` (dulce de leche dip), `cardamom` (cardamom sugar), `air` (air fryer churros, written honestly).

## What makes it not bog-standard
1. **Cook the paste until it films the pan** (Moro, King Arthur): drives off water and gelatinises the flour, so the centre sets instead of staying gummy. Directly targets the "cooked, not doughy" brief.
2. **Dough temperature before the egg, ~60°C, finger test** (King Arthur): too hot scrambles the egg, too cold will not pipe. Plus: pipe within 30 min while warm.
3. **Air-free piping bag + closed star nozzle, with the why** (recipe consensus on bursting): the two causes of bursting addressed in one place.
4. **One test churro, broken open, with a diagnosis table** (Spectator's too hot / too cool, made into an action): wet middle → 175°C and a minute longer; pale and greasy → hotter. Makes it foolproof regardless of the hob or thermometer.
5. **Chocolate first, cornflour slurry boiled for a minute** (Laurance, San Ginés): a properly thick dip with no raw-starch taste, made ahead so the frying has your full attention.

## Decisions I made for the cook
- Servings 4 (5 churros each plus a small cup of chocolate); about 20 churros as drafted.
- Oil 180°C throughout (Spectator, GBC; between RecipeTin's 170 and King Arthur's 190), 3cm deep in a 20 to 22cm pan at least 10cm deep, so no more than a third full (dish notes).
- No-thermometer test uses a pea of the dough (not a bread cube) so nothing outside the ingredient list is needed; the test churro is the real calibrator.
- Thickness ~1.5cm from a 1cm nozzle, 12cm long, 3 to 4 min, turned halfway.
- Air fryer: judged to genuinely work for an egg dough (several tested recipes), so it is in, frozen first, 190°C (the draft's temperature, and the Milk Street reviewer's fix), 8 to 10 min, butter brush so sugar sticks, and an honest line: drier, lighter, more like a crunchy choux finger, softens in 10 minutes. Placed in `variations` as the dish notes ask, not as a method step.
- Tags: treat, vegetarian, comfort food. No `baking` tag (per brief). No featuredIngredients (nothing in the pantry defines churros).
- Equipment: closed star nozzle and bag, the deep pan sizing, a thermometer (with the no-thermometer fallback).
- Title "Churros with Thick Spanish Chocolate" so the dip is in the name; slug stays `churros`.

## Questions for the cook
(none)

## Nutrition arithmetic (per serving, 4 servings)
| Item | kcal | P | C | F |
|---|---|---|---|---|
| Plain flour 150g | 546 | 15.0 | 114.0 | 2.0 |
| Butter 30g | 215 | 0.3 | 0 | 24.0 |
| Sugar in dough 12g | 48 | 0 | 12.0 | 0 |
| Egg 50g | 72 | 6.3 | 0.4 | 4.8 |
| Oil absorbed, est. 60g (about 15% of the fried weight; fried churros run 20 to 25% fat) | 530 | 0 | 0 | 60.0 |
| Cinnamon sugar that sticks, est. 60g of the 100g + cinnamon | 250 | 0 | 63.0 | 0 |
| Dark chocolate 70%, 100g | 598 | 7.8 | 45.9 | 42.6 |
| Whole milk 250ml | 160 | 8.5 | 12.0 | 9.0 |
| Cornflour 6g + sugar 12g | 71 | 0 | 17.5 | 0 |
| **Total** | **2490** | **37.9** | **264.8** | **142.4** |
| **Per serving (/4)** | **623** | **9.5** | **66** | **35.6** |

Written as 620 kcal, P10 C66 F36 (macros give 628). Under 800, no flag.

## FLAGs
- Label check: chocolate (one line in headnoteIngredients) and alcohol-free vanilla. No other label risks.
- Image is a close but not exact match: the churros in the photo are plain (no cinnamon sugar), served Spanish-style beside a cup of chocolate.

## Image
https://images.unsplash.com/photo-1515579171902-e0c5f918b32b?w=1200&q=80 (Oscar Nord, free Unsplash License, unsplash.com/photos/5CPn8_NE2Tc, shot in Palma). A plate of plain golden ridged churros beside a white cup of thick hot chocolate on a marble café table. No faces. Returns 200; not used by any other recipe.

## Verification
Second cook, walked through in real time. Dough ratio (250ml water : 150g flour : 30g butter : 1 egg, liquid 2.0x flour) sits between the stiff eggless Spanish dough and full choux: pipes, holds closed-star ridges. Kept. Chocolate (6g cornflour + 100g chocolate per 250ml milk) sits between ZoëBakes (~4g cornflour, 100g choc per 240ml) and Textual Chef / Delish Globe (~8g cornflour, 100 to 115g choc per 240ml): kept. Oil 3cm in a 20 to 22cm pan = 0.94 to 1.14 litres, a third of a 10cm pan: correct. 620 kcal counts only ~60g absorbed oil (13% of ~470g dough; consistent with fried churros at ~20 to 25% fat minus the dough's own 29g fat): kept. Vanilla is alcohol-free.

1. Times 45/55 to 60/65: prep 5 + chocolate 8 + dough 17 (oil heats alongside) + test churro 5 + ~5 batches x 5 min + serve, nearly all hands-on.
2. Yield "about 20" to "20 to 24": ~470g dough at ~20g per 12cm length from a 1cm nozzle.
3. Dough cooling: 5 to 10 min to 55 to 60°C, finger cue made consistent (60°C plus "hold a finger for a few seconds" contradicted; King Arthur says below 52°C).
4. Thickness clarified: piped from a 1cm nozzle, puffs to ~1.5cm in the oil (the old step asked for 1.5cm from a 1cm nozzle). Tip matched.
5. Added the baking-paper-square way to lower churros into the oil, for anyone nervous of piping over hot oil.
6. Dropped "pipe within 30 minutes" (frying ~22 churros takes about that long, so it set an impossible clock); now "start frying as soon as the oil is ready".
7. Air fryer moved from variations to a visible alternative step in the frying group (house pattern, cook owns an air fryer), headnote says to skip the oil and freeze 30 min first; time 8 to 10 to 10 to 12 min from frozen (homemade air-fryer sources give 10 to 14 at 190°C); peel off paper before the basket; 20g butter added to the ingredient list (marked air-fryer route only). Honest "drier, lighter, softens in 10 minutes" line kept.
8. Serve step: loosen with water or milk (all the milk is already used).
9. Quote: "thick enough to hold a spoon" overclaimed; now "cling to every ridge". Description updated for the air-fryer move.

FLAGs: none over 800 kcal. Label checks unchanged (chocolate, alcohol-free vanilla). Image verified 200, plain churros + cup of chocolate, no faces; fine.

### Questions for the cook
(none)
