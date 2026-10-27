# buttermilk-pancakes (draft b-pancakes)

File: /Users/nievesyang/Documents/GitHub/nieves-kitchen/data/recipes/buttermilk-pancakes.ts
Lint: clean apart from two info lines for "alcohol-free vanilla extract" (intended). `npx tsc --noEmit` exit 0, no errors.

## Sources
- **Sally's Baking Addiction, Fluffy Buttermilk Pancakes** (the draft's source; read in full from the page's recipe data). 281g flour, 67g sugar, 1¼ tsp baking powder + ½ tsp bicarb, ¼ tsp salt, 2 eggs, 480ml buttermilk, 85g melted butter, cooled slightly. Thick batter, "a few lumps are fine". Medium heat, about 190°C surface. Water test: drops that just sizzle and vanish mean the pan is not ready; drops that dance mean it is. Flip on *holes*, not bubbles, edges set, about 2 min, then 1 to 2 min. Hold in a 93°C oven. Contributed: the flour weight (thicker batter), the water-drop test and its reading, "holes not bubbles", the keep-warm oven.
- **Cook's Illustrated / ATK, Best Buttermilk Pancakes (2013)** (via a faithful reprint; the ATK listing confirms flour weight, rest and holding). 283g flour, 2 tbsp sugar, 1 tsp baking powder + ½ tsp bicarb, ½ tsp salt, 480ml buttermilk + 60g sour cream, 2 eggs, 3 tbsp (42g) butter. "Lumpy with a few streaks of flour. Do not overmix." Rest 10 min. Oil wiped out to a thin film. 2 to 3 min then 1 to 2 min. Hold on a **wire rack** in a 93°C oven so they don't steam soft. Notes: lower-protein flour preferred. The draft is essentially this recipe without the sour cream. Contributed: the base ratio, the wipe-thin fat film, the rack in the oven, plain (not strong) flour.
- **King Arthur Baking, Buttermilk Pancakes**. 240g flour, 35g sugar, 1 tsp baking powder + 1 tsp bicarb, ½ tsp salt, 1 egg, 454g buttermilk, 28g butter. Stir "until fairly smooth; small lumps are fine". Rest **15 min uncovered**. Pan ready "when a water droplet skitters across it". No-buttermilk swap: plain Greek yogurt + milk to 2 cups. Extra-fluffy: whipped whites folded in just before cooking. Contributed: the 15 min rest, the skitter cue, the yogurt-plus-milk substitute, the whipped-white variation method.
- **Cook's Illustrated, Light and Fluffy Pancakes** (via reprint). No-buttermilk note: milk + vinegar or lemon "will be thinner, so the pancakes will be thinner too". Contributed: the honest comparison for the soured-milk substitute.
- **Just One Cookbook, Fluffy Japanese Soufflé Pancakes**. 2 eggs separated, whites frozen 15 min, stiff glossy meringue, fold in thirds, lowest heat (~150°C) under a lid with 1 tbsp water, 6 to 7 min then 4 to 5 min, extra scoop on top at 2 min. Contributed: the soufflé variation (scaled to plain flour, alcohol-free vanilla).
- **Just One Cookbook, Buttermilk Pancakes**. Keeps the batter slightly lumpy, medium heat, flip when many bubbles show. Cross-check only.
- British thin pancakes: the draft's own fork ratio (100g flour, 2 eggs, 300ml milk, pinch salt), which is the standard UK pancake-day ratio; I added 1 tbsp melted butter so they don't stick.
- Serious Eats (Kenji) and Felicity Cloake were both blocked (bot wall / domain not accessible); not used.

## Ratio check (flour = 100)
| Source | Flour | Liquid dairy | Egg | Butter | Sugar | Baking powder | Bicarb | Salt | Rest |
|---|---|---|---|---|---|---|---|---|---|
| Sally | 281g | 171% | 2 (~36%) | 30% | 24% | 1¼ tsp | ½ tsp | ¼ tsp | none |
| CI Best | 283g | 191% (incl. sour cream) | 2 (~35%) | 15% | 9% | 1 tsp | ½ tsp | ½ tsp | 10 min |
| King Arthur | 240g | 189% | 1 (~21%) | 12% | 15% | 1 tsp | 1 tsp | ½ tsp | 15 min |
| Draft | 250g | 196% | 2 (~40%) | 18% | ~10% | **2 tsp** | ½ tsp | ½ tsp | 10 min |
| **This recipe** | **280g** | 175% | 2 (~36%) | 16% | 11% | **1½ tsp** | ½ tsp | ½ tsp | 10 to 15 min |

Changes from the draft, and why:
- Flour 250g → 280g: the draft's liquid ratio (196%) was the loosest of all; Sally and CI both use ~281 to 283g with 480ml. A thicker batter holds its height in the pan, which is the whole point of the fluffy default. Escape hatch built in: test pancake + "stir in 1 to 2 tbsp milk if it stays domed".
- Baking powder 2 tsp → 1½ tsp: every source uses 1 to 1¼ tsp with ½ to 1 tsp bicarb. Too much powder rises fast then collapses and can taste bitter. 1½ tsp suits the extra flour.
- Sugar ~25g → 30g (lands between CI and King Arthur; pancakes are served with syrup).
- Butter 45g, eggs 2, bicarb ½ tsp, salt ½ tsp: draft already matched CI, kept.

## Draft applied
- Fork `style` default **fluffy American**: the main recipe.
- No `yourNote` on this dish.
- Draft method kept: dry and wet separately, mix until just combined with lumps, rest 10 min (now 10 to 15), butter the pan, medium heat, 60ml per pancake, flip at popped bubbles/set edges ~2 min, 1 min more (now 1 to 1½).
- Fork `thin` (British) → variation, with the draft's ratio plus 1 tbsp melted butter.
- Fork `souffle` → variation (JOC method).
- Tweak `whites` → variation (KA method: whites at soft peaks, folded after the rest, cook at once).
- Tweak `blueberry` → variation (dropped onto the poured pancake, not stirred in, as drafted).
- Tweak `banana` → variation (cinnamon in the dry mix, slices pressed on).
- Tweak `honeybutter` → variation (the cook loves honey; also "maple syrup or honey" in the serving line).
- Tweak `mix` → variation (4-batch jar, 322g per batch, shake before weighing).

## What makes it not bog-standard
1. **A thicker, Sally/CI-weight batter with a measured leavening** (ratio check above): taller pancakes, no metallic or collapsing over-lift.
2. **The test pancake as a diagnostic step**, with three explicit readings (pale and flat → hotter; dark before holes or raw middle → cooler; domed and unspread → loosen with milk). Brief asked for it; no source spells out the fixes this clearly.
3. **Water-drop pan test with all three readings** (Sally + King Arthur): fizz slowly = wait; bead and skitter = ready; butter smokes = too hot, off the heat 30 s. No thermometer needed.
4. **Flip on holes, not bubbles; never press; flip once; ladle from the side without re-stirring** (Sally, CI): the common ways people flatten good batter.
5. **Hold on a wire rack in a low oven, single layer, uncovered** (CI): no soggy, steamed stack, everyone eats hot pancakes at once.

## Decisions I made for the cook
- Title "Fluffy Buttermilk Pancakes" (the draft name was just "Pancakes"; slug as briefed).
- Category dessert, no country/region/coordinates/influences, no baking tag (per brief).
- Tags: treat, vegetarian, comfort food, budget-friendly. Not `quick` (50 min total with the rest).
- featuredIngredients: `milk`. Buttermilk is the defining ingredient and it is a milk product; drop it if that feels like a stretch.
- Keep-warm oven at 110°C (90°C fan) or the lowest setting: sources use 93°C, which many UK ovens can't hold.
- 28cm pan, 3 pancakes per batch at 60ml each, about 14 pancakes, serves 4.
- Pan fat: butter wiped thin (cook's crispy-edge preference); oil offered in a tip.
- Best buttermilk substitute named as yogurt + milk (closest), soured milk second with an honest "thinner, flatter, paler", and a warning against plain milk.
- No equipment field: a frying pan, rack and tray are everyday kit.
- No air-fryer route: the draft offered none and it does not suit pancakes.

## Questions for the cook
(none)

## Nutrition arithmetic (per serving, 4 servings; toppings excluded)
| Ingredient | kcal | P | F | C |
|---|---|---|---|---|
| Plain flour 280g (341/100g; P 9.4, F 1.3, C 77.7) | 955 | 26.3 | 3.6 | 217.6 |
| Caster sugar 30g | 120 | 0 | 0 | 30 |
| Baking powder, bicarb, salt | 5 | 0 | 0 | 1.5 |
| Buttermilk 480ml (~495g; 45/100g; P 3.5, F 1, C 5) | 223 | 17.3 | 5.0 | 24.8 |
| 2 large eggs (~116g edible; 143/100g) | 166 | 14.6 | 11.6 | 0.8 |
| Unsalted butter 45g (717/100g) | 323 | 0.4 | 36.5 | 0 |
| Alcohol-free vanilla 1 tsp (glycerine base) | 10 | 0 | 0 | 2.5 |
| Pan butter, ~10g absorbed of the 1 tbsp | 72 | 0.1 | 8.1 | 0 |
| **Total** | **1874** | **58.7** | **64.8** | **277.2** |
| **Per serving (/4)** | **469** | **14.7** | **16.2** | **69.3** |

Set as 470 kcal, P 15, C 69, F 16 (macros give 480 kcal, within 2%). Syrup/butter on top excluded, and the headnote says so. Well under 800.

## FLAG
- No over-800 flag.
- Halal: vanilla is alcohol-free everywhere (ingredient, headnote, soufflé variation). No other label risks (buttermilk, baking powder and maple syrup are fine).
- Image is a close match (fluffy buttermilk-style stack), though it is dressed with blueberries, which is one of the variations rather than the plain default.

## Image
https://images.unsplash.com/photo-1650134973809-d8c3a2da59ba?w=1200&q=80 (Unsplash krqTbKwuFgw, Unsplash License, free). A tall stack of thick, golden pancakes on a white plate, maple syrup running down the sides, blueberries on top and around. No faces. Returns 200; not used by any other recipe. Rejected: vfl6y292kSI (honest but a plain phone shot on a kitchen counter), UBvMCte4IIo (dark, wholemeal-looking stack with mixed berries).

## Verification
No partial verifier edits or notes were found from the earlier run that was cut off. This pass started from the file as the author left it.

Ratio cross-check: King Arthur (240g flour : 454g buttermilk : 1 egg : 28g butter : 1 tsp powder + 1 tsp bicarb, rest 15 min, 14 to 16 pancakes at 10cm) and Cook's Illustrated/ATK (283g flour, 2 eggs, lumpy batter, rest 10 min) both bracket this recipe's 280g : 480ml : 2 eggs : 45g : 1½ tsp + ½ tsp. The ratio passes. The yield of about 14 at 11cm is consistent with King Arthur's yield from a smaller batch.

1. Batch size: three 11cm pancakes with 4cm gaps do not fit the flat base of a 28cm pan, which is about 23cm across. The step now says 2 or 3 at a time with at least 3cm between them, and to cook 2 if a third would touch.
2. Keep-warm rack: 14 pancakes cannot sit in a single layer on one rack over a tray. Later ones now overlap by a third, like roof tiles, never stacked flat. Added that they hold for about 20 minutes.
3. Time: with 2 to 3 per batch, cooking takes about 25 to 30 minutes. Active time went from 35 to 40 minutes and total from 50 to 55.
4. Pan butter went from 1 to 2 tbsp. Six or more wipe-ons with kitchen paper would run 1 tbsp short. Nutrition is unchanged, since the absorbed amount (about 10g) is what was counted.
5. Added an optional "take the buttermilk and eggs out 30 minutes ahead" line, with the reason (bake rule on ingredient temperature). It is optional, so it is not counted in the total time.
6. First flip: added a peek cue (lift an edge and check for even golden brown) and how to flip (spatula fully under the middle, a low quick move so it lands flat).
7. Soured-milk substitute: lemon or vinegar went from 1½ to 2 tbsp per 480ml, the standard 1 tbsp per 240ml.

Checked and left alone: leavening, salt, rest, water-drop test, test-pancake readings, nutrition (1874 kcal / 4 = 469, honest), flavour profile, dietary flags, variation quantities (dry mix 322g per batch, blueberry 150g), copy (no dashes, alcohol-free vanilla). The image returns 200 and shows a plausible stack with no faces. It carries blueberries, which belong to a variation; that is acceptable.

FLAGs: none over 800 kcal. Halal: vanilla is alcohol-free throughout.

Questions for the cook: none.
