# marry-me-chicken (m-marry-me)

File: /Users/nievesyang/Documents/GitHub/nieves-kitchen/data/recipes/marry-me-chicken.ts

## Sources
- **Delish original (2016, Lindsay Funston, first called "Sicilian Chicken Skillet")**: delish.com blocks fetching, and the Boston Globe reprint is paywalled, so this is from search summaries and what I already knew about the recipe. The core is breasts, stock rather than wine, cream, Parmesan, sun-dried tomatoes, thyme, chili flakes and basil, with no butter. It confirms the stock-only, no-wine base.
- **America's Test Kitchen, Marry Me Chicken (17861)**: the aromatics cook in the fat left in the skillet, with no added butter. The stock and cream are reduced about 5 minutes before the cheese, and the **cheese is whisked in off the heat**. The chicken goes back only to finish. Its chicken-only figure of 798 kcal showed how rich the dish runs.
- **ATK Sautéed Chicken Cutlets (8288)**: halve the breasts horizontally and pound them even, then sear hard on one side and briefly on the other. ATK's salting guidance (search summary of their articles): salt boneless breasts 6 to 24 h ahead. That became the optional salt-ahead tip.
- **Once Upon a Chef, Marry Me Chicken**: thin cutlets and a flour dredge. It uses **tomato paste** in the sauce (I cook it to brick red with the garlic) and a small onion. It also offers pecorino as a choice of cheese.
- **BBC Good Food, 'Marry me' chicken**: sears in the jar oil, has a red onion base and uses a **lighter ratio of 150ml double cream to 250ml stock** for 4. Its flour coating thickens the sauce. That ratio is the basis for my 150ml cream / 300ml stock.
- **Budget Bytes, Marry Me Chicken**: pounds the chicken to an even thickness, cooks to 74°C (165°F) and serves it over rigatoni. It is a check on the pasta pairing and the portion.
- **RecipeTin Eats, Chicken with Creamy Sun Dried Tomato Sauce**: halves the breasts into thin steaks. **Finely grate the cheese yourself; sandy ready-grated won't melt.** Its jar-oil sear is fine, but a reader tip (Olive & Mango, via search) warns that too much jar oil plus cream breaks the sauce. That is where the "measure the oil, spoon off excess" step comes from.
- Pasta-water emulsifying, and the fix with a splash of water when the sauce looks oily, is standard and agreed across the pasta versions found in search (House of Nash Eats, Carlsbad Cravings). Serious Eats and the Guardian were blocked or had no version.

## Draft applied
- Fork `serve` = **pasta** (opts[0]). It is the main recipe: 300g dried pasta tossed in the sauce with pasta water, the chicken sliced on top.
- No `yourNote` on this dish.
- Draft ingredients kept: breasts halved horizontally, flour dust, jar oil, garlic, oregano, thyme, chili flakes, stock, double cream, grated hard cheese, sun-dried tomatoes, basil and optional spinach.
- The draft's "(or 6 thighs)" and the un-ticked **thighs** tweak became a substitution, re-timed.
- The un-ticked **lighter** tweak (half the cream as evaporated milk) became a substitution.
- The un-ticked **peppers** and **lemon zest** tweaks became variations.
- The other fork options (**orzo cooked in the sauce**, **mash**, **crusty bread**) all became variations, with a full orzo method.

## What makes it not bog-standard
1. **Even 1cm cutlets.** The breasts are halved, then the thick ends are tapped flat (ATK, Budget Bytes, RecipeTin). Every piece is done at the same moment, so none dries out.
2. **Sear for colour only, then finish gently in the sauce to 74°C, then rest** while the pasta is tossed. This combines ATK's two-stage method with the cook's 74°C, and keeps the chicken juicy.
3. **Cheese off the heat, after the chicken comes out** (ATK). The draft simmered the cheese with the chicken for 5 to 8 min, which is the classic way to turn it grainy and greasy. I reordered the method: reduce, chicken in, chicken out, then cheese off the heat.
4. **Fat control and a pasta-water finish.** The jar oil is measured, excess is spooned off, there is no extra butter, and the pasta is tossed with starchy water. The sauce clings instead of pooling, and the same move is the rescue if it ever looks oily.
5. **Tomato purée cooked to brick red** with the garlic and dried herbs (adapted from Once Upon a Chef), plus a shallot (Once Upon a Chef, BBC, Budget Bytes). Both add depth and body that the wine-less sauce would otherwise lack.

## Decisions I made for the cook
- **Dropped the draft's 1 tbsp butter.** The pan already holds the jar oil from searing, and butter on top of 48% cream is the most common cause of a greasy slick. Delish, ATK and RecipeTin all cook the aromatics in the leftover fat. This also brings the dish under 800 kcal (with butter it was about 814).
- **Cream 150ml, not 200ml, with 300ml stock instead of 250ml.** This follows BBC's tested ratio. It is plenty for 4 with pasta once the pasta water goes in, and it is less likely to split.
- **Cheese 50g instead of 60g**, finely grated. Combined with the flour and the pasta water, it is enough to make the sauce cling.
- **Added 1 banana shallot.** Three of the sources use onion. It adds sweetness and body, which matters because there is no wine.
- **About 150g of raw chicken a head (600g in all), so two thin cutlets each, with 75g dried pasta each.** These are standard UK portions.
- Salt: 3/4 tsp on the chicken, nothing in the sauce until tasting, because the cube and cheese are salty.
- Gave the stock-cube label line in the cook's own guidance (halal-certified, or check for animal-derived ingredients; vegetarian cubes are a good bet but check for alcohol). It goes in `headnoteIngredients` next to the one-line cheese rennet statement.
- Jarred sun-dried tomatoes often list wine vinegar. I added no label line, because the house already uses balsamic vinegar without a caveat (kung pao chicken, crispy chili beef). I did not invent a ruling.
- Left out Dijon mustard (RecipeTin uses it to thicken and sharpen) because many Dijons contain white wine. It would add a label hazard for a small gain.
- Tags: high-protein, comfort food. Not `quick`, since it takes 45 min in total. Difficulty is Easy.
- Region Western Europe; coordinates Rome; influences Italy then United States of America (both checked against the geojson).
- featuredIngredients ['chicken'], matching the other chicken mains.

## Questions for the cook
(none)

## Nutrition arithmetic (whole recipe, then ÷4)
| item | kcal | P | C | F |
|---|---|---|---|---|
| chicken breast 600g raw (106/100g, P24, F1.1) | 636 | 144 | 0 | 6.6 |
| plain flour 2 tbsp, 16g (all counted) | 54 | 1.6 | 12 | 0.2 |
| jar oil 2 tbsp, 27g | 243 | 0 | 0 | 27 |
| shallot 50g | 36 | 1 | 8 | 0 |
| garlic 4 cloves, 12g | 18 | 0.8 | 4 | 0 |
| tomato purée 1 tbsp, 16g | 13 | 0.7 | 2.5 | 0 |
| stock cube | 20 | 0 | 2 | 1 |
| double cream 150ml (449/100ml, F48) | 674 | 2.6 | 4 | 72 |
| sun-dried tomatoes in oil, drained, 80g (213/100g) | 170 | 4 | 18.6 | 11.3 |
| vegetarian hard cheese 50g (390/100g, P32, F29) | 195 | 16 | 0 | 14.5 |
| spinach 80g | 18 | 2.3 | 1 | 0 |
| dried pasta 300g (356/100g, P12.5, C71, F1.5) | 1068 | 37.5 | 213 | 4.5 |
| **total** | **3145** | **210.5** | **265** | **137.1** |
| **per serving (÷4)** | **786** | **53** | **66** | **34** |

Check: 53×4 + 66×4 + 34×9 = 212 + 264 + 306 = 782, against 786. Consistent.
Salt per serving is about 3.4g: cube about 4.9g, chicken 4.5g and cheese about 1.6g, plus what the pasta absorbs (about 4g), all divided by 4.

## FLAGs
- **FLAG: close to the 800 limit.** It is 786 kcal and under the filter, but only because the draft's butter was dropped and the cream set at 150ml. The draft as written (200ml cream, 60g cheese and the butter) plus pasta comes to about 870, which would be hidden.
- **Label checks:** vegetarian or halal-certified hard cheese (Parmigiano Reggiano and Grana Padano always use calf rennet). Stock cube, in the cook's own wording.
- **FLAG: the image is a loose match.** It shows creamy chicken penne, not marry me chicken.

## Image
https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?w=1200&q=80 (Unsplash aeESmmFKH0M, "sauced penne pasta dish on bowl", Pixzolo Photography, free licence). It shows penne in a creamy sauce with chicken pieces, red and green pepper and a mint sprig, in a white square bowl, with no faces. Unsplash has no free marry me or sun-dried tomato chicken photo. I also rejected a chicken parmesan with piped mash and a creamy fettuccine with a diner's torso in shot. The HEAD check returns 200, and the lint finds no duplicate.

## Cook-through check
- The pasta water starts first, and the pasta goes in as the stock goes in. From there, the stock 3 min, cream 3 to 4 min, chicken 3 to 4 min and resting 1 to 2 min line up with pasta that cooks 1 min under the packet time (about 9 to 11 min).
- A 28 to 30cm pan holds 4 cutlets per batch. It also takes about 750g of cooked pasta plus about 350ml of sauce for tossing, and the equipment line gives an alternative for a smaller pan.
- Every ingredient in the list is used in the steps, and every step amount matches the list: oil 1+1 tbsp, pasta water 4 tbsp from the mug, and the cheese a handful at a time.
- tsc shows no errors in this file. The lint shows no `!` lines, only the info line for "wine" in the description ("There is no wine anywhere").

## Verification
Second cook, 2026-10-27. Checked against RecipeTin (185ml cream + 185ml stock + 30g Parmesan for 750g chicken, no pasta) and US pasta versions (about 240ml heavy cream + 120 to 240ml broth + 50g Parmesan per 225g dried pasta). The author's 150ml double cream over 300g pasta and 600g chicken was the leanest ratio of any I found, so the sauce risked coating the pasta thinly and tasting light.

1. Pasta 300g → 250g (about 62g a head next to 150g chicken each). This puts more sauce on every forkful, without adding cream and without going over 800 kcal. A trim made for the dish, not for the number.
2. Cheese 50g → 60g, the draft amount. It brings back savoury depth and helps the sauce cling, and it adds about 10 kcal a serving.
3. Stock reduction cut from 3 min ("by a third") to 2 min ("a little"), so more sauce volume survives for the pasta.
4. Cream simmer cut from 3 to 4 min ("clean line through it") to 2 to 3 min ("like single cream"). The old cue had it fully thick before another 3 to 4 min with the chicken, then cheese and pasta starch on top, which would end claggy.
5. Chicken finish 3 to 4 min → 2 to 4 min, with "start checking after 2 minutes". 1cm cutlets seared 2 + 1.5 min are close to done already, and this avoids overshooting 74°C. Added that a little overlap is fine, because 8 cutlets will not lie flat in the pan.
6. Cheese step now has a rescue for clumping: a few seconds on the lowest heat, never bubbling.
7. Pasta water: the amount to reserve is stated (250ml), and the toss cue is now "flows loosely, as it tightens on the plate", not only "glossy".
8. Jar oil: spoon from the top and leave the herb bits behind, since they burn at medium-high.
9. Flour 2 → 3 tbsp "for dusting". 2 tbsp is too little on a plate to dredge 8 cutlets. Only about 15g sticks, so the nutrition still counts 16g.
10. Short pasta timing: tagliatelle and similar (under 9 min) goes in when the chicken goes back, so it does not wait.
11. time.active 35 → 40. Almost all of the 45 min is hands-on.
12. Nutrition recomputed: 786/53/66/34 → 752/52/57/35 (working below).

Checked and left alone: no butter is right (the pan fat plus 48% double cream is plenty, and the butter caused the greasy slick). Cheese goes in off the heat after the chicken is out. Even 1cm cutlets, sear then finish. Salt load is about 3.3g a head. The tags, dietary flags and halal label lines are correct. A 28 to 30cm pan fits 4 cutlets per batch.

### Nutrition (revised, whole recipe)
Same lines as the author's table, except cheese 60g = 234 kcal / P19.2 / F17.4, and pasta 250g = 890 / P31.2 / C177.5 / F3.75.
Total 3006 kcal, P207, C230, F139. **Per serving 752 kcal, P52, C57, F35.** Check: 52×4 + 57×4 + 35×9 = 751.
Checked against heavier assumptions (chicken at USDA 120 kcal/100g, +21 a serving), it still comes in about 775, under 800.

### Image
I kept the current photo (photo-1555949258-eb67b1ef0ceb, creamy chicken penne). I looked at these free Unsplash photos:
- 1777333033368 (creamy tomato penne): the sauce colour is right, but there is no chicken and the photo is plain.
- 1773756606644: blackened chicken on aglio olio.
- 1748012199672 and 1748012199657: white Alfredo with broccoli.
- 1748864221145: chicken thighs with blistered cherry tomatoes, no cream.
- 1724116382285 and 1702827761984: plain Alfredo penne.
- WjEnmfiUaRM: a mole plate.
None beat the current photo. FLAG stays: the image is a loose match (the sauce is white, not the orange-pink of the dish).

### FLAGs (current)
- Under 800 kcal (752), so the earlier "close to the limit" flag is eased. To go back to 300g pasta, add about 45 kcal a serving (about 797). That is right at the limit and gives a thinner coat of sauce.
- Label checks: vegetarian or halal-certified hard cheese, and the stock cube (both already in headnoteIngredients).
- The image is a loose match.

### Questions for the cook
1. Pasta portion: 62g a head (current, saucier) or 75g (about 797 kcal, more filling, a thinner coat of sauce)?
