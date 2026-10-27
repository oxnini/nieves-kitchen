# massaman-beef-curry (draft m-massaman)

File: /Users/nievesyang/Documents/GitHub/nieves-kitchen/data/recipes/massaman-beef-curry.ts

## Sources
- **Hot Thai Kitchen (Pailin Chongchitnant), beef massaman + Instant Pot massaman** (fetched with curl, full text read). Contributed: searing the beef; a spoonful of paste in the braising liquid so the meat is seasoned from inside; reducing coconut milk and frying the paste until the oil sizzles out; potatoes, onion and peanuts added only once the beef is tender (10 to 15 min); waxy potatoes over floury; taste and adjust at the end because paste salt varies (her commenters found 2+ tbsp fish sauce too salty). Pressure cooker: beef only under pressure, 30 min high for 5cm chuck + 10 min natural release, water left out because nothing evaporates, veg finished on sauté. Per-person ratios (680g chuck + 600ml coconut milk for 4) set my portion size.
- **RecipeTin Eats (Nagi), massaman curry, current version + store-bought paste notes.** Contributed: chuck in 4cm cubes braised 1.5 to 2 hours; the shop-paste boost (fresh garlic, ginger and lemongrass fried with a whole 114g tin of Maesri, ignoring the jar's directions); balance should lean slightly more sweet and sour than salty; cinnamon quill + star anise whole in the sauce.
- **Gourmet Traveller (Lisa Featherby), beef and potato massaman.** Contributed: cracking coconut cream over medium-high for 4 to 5 min until the fat separates (and the warning that cream with thickeners will not split); dry-toasting the whole bay and cassia before they go in; seasoning order at the end: palm sugar, then fish sauce, then tamarind.
- **Grantourismo (Chef Kittichai, with David Thompson's notes).** Contributed: Thompson's preference for cassia (substitution); toasting spices; potatoes and shallots fried/roasted before they meet the curry; add about half the seasoning first and adjust.
- **Alex Rushmer on David Thompson's Thai Food.** Contributed: Thompson fries the meat, onions and potatoes before simmering, and cooks the paste slowly to a dark caramel colour without letting it catch.
- **National Geographic, "Deconstructing massaman".** Contributed: the origin framing (name traced to "Mosulman"; Persian/Muslim trade spices; debated southern vs court origin); tamarind not lime; waxy potatoes (John Chantarasak); made ahead and eaten next day.
- **Beyond Kimchee, easy beef massaman (shop paste).** Contributed: dry-toasting cinnamon, cardamom and cloves 2 to 3 min before the paste; don't rush browning the beef; paste quantity cross-check (3 tbsp Maesri per 450g beef).
- Cross-checks only: SBS Food gaeng matsaman (2 hr covered chuck braise in coconut cream), Krumpli (whole spices in the braise, potatoes + shallots for the last 30 min), Marion's Kitchen (potatoes in for the full 2 hours: rejected, they would collapse).

## Draft applied
- Default fork `paste = shop` ("Good shop paste") is the main recipe. No `yourNote` on this dish.
- Draft structure kept: beef braised in one tin of coconut milk + water + whole spices; second tin's cream cracked in a separate pan and the paste fried in it; paste, rest of the milk, onion, potatoes, fish sauce, sugar, tamarind into the beef; simmer 20 to 25 min; peanuts for the last 10 min; taste for sweet, salty, sour.
- Tweak `pressure` (named by the coordinator): written as a full visible step in the braise group ("Short on time? Use a pressure cooker instead."), re-timed: 100ml water instead of 300ml, 35 min high + 15 min natural release, potatoes/paste done in the frying pan meanwhile, finish on sauté with lid off. Whole recipe about 2¼ hours instead of 3+.
- Into `variations`: `dayahead` (with the reason: potatoes cooked fresh on the day stay whole), `chicken` (8 bone-in thighs, 20 min braise + 25 min with potatoes, 74°C at the bone, about 45 min as drafted), `lamb` (4 shanks, 2½ to 3 hours or 45 min at pressure, serves 4), `shallots` (crispy shallots, air fryer method as in the house green curry), and the non-default fork `scratch` paste written out with amounts so it is cookable.

## What makes it not bog-standard
1. **A spoonful of paste in the braise** (Hot Thai Kitchen). Plain beef simmered in coconut milk tastes bland inside; 1 tbsp of the paste in the braising liquid seasons the meat all the way through.
2. **Whole spices toasted dry before the beef** (Gourmet Traveller, Beyond Kimchee). Wakes up the cinnamon, cardamom and star anise so the braise smells of them, not of tinned paste.
3. **Shop paste fried in cracked coconut cream with fresh garlic, ginger and lemongrass, low and slow to brick red** (RecipeTin's boost + Gourmet Traveller's crack + Thompson's slow fry). This is the single biggest jar-to-homemade move. Ginger alongside garlic is also the cook's own habit.
4. **Potatoes and onion browned before they go in** (Thompson via Rushmer; Kittichai). The crust keeps waxy potatoes whole through the 25 min simmer; onion wedges cut through the root stay as wedges.
5. **Seasoning set at the end, in order, to a stated target** (Gourmet Traveller order; RecipeTin target). Sugar, fish sauce and part of the tamarind go in with the potatoes so they absorb it; the last tablespoon of fish sauce and half tablespoon of tamarind are held back for tasting, because shop pastes vary a lot in salt. Target written in the step: rich and gently sweet, then tangy, then salty.

## Decisions I made for the cook
- **Servings 6, not the draft's 4 to 5.** At 6, each person gets about 167g raw beef and 133ml coconut milk, almost exactly Hot Thai Kitchen's and RecipeTin's per-person amounts. See the FLAG below: at 5 it would be about 900 kcal.
- **Paste 6 tbsp (one 114g Maesri tin), not 4.** Every source uses more paste per tin of coconut milk than the draft did (RecipeTin a whole 114g tin for one tin of milk; HTK 5 to 6 tbsp for 600ml); 4 tbsp across 800ml of coconut milk + 300ml water would taste thin.
- **Star anise 2, not 3; cardamom 6, not 5.** Three star anise through a 2-hour braise tips into liquorice; cardamom is the spice massaman should lead with.
- **Water, not stock, for the braise.** Seared beef makes its own stock, and paste + fish sauce already bring the salt. Halal stock is in substitutions with the label line.
- **Peanuts split 40g in the pot / 20g chopped on top**, so you get both the soft simmered peanuts and some crunch.
- **Garnish: coriander and sliced green chili, piled on** (the cook's habit). No lime: tamarind is the sour, and lime is the classic mistake here.
- Region/place: draft says Southern Thai, so coordinates are Hat Yai (7.0084, 100.4747). `influences: ['Thailand']` only; I did not add Iran/Malaysia/India because the origin story is debated and it would put the dish on those countries' atlas pages.
- `isGlutenFree: true` (paste and fish sauce are normally wheat-free; headnote tells readers to check). `isDairyFree: true` (coconut milk only; the lint's "milk" note is coconut milk).
- `featuredIngredients: ['beef']`: the dish is beef massaman; nothing else in the pantry defines it.
- Difficulty Medium (two pans, cracking cream, long braise), like the goulash.

## Questions for the cook
1. Portion size: this is written as **serves 6 at about 760 kcal**. The draft said 4 to 5; at **5 servings it is about 900 kcal**, which the site's default filter would hide. Keep it at 6, or switch to 5 and accept that it is hidden by default?

## Nutrition arithmetic (whole pot, then ÷ 6)
| Ingredient | kcal | P | C | F |
|---|---|---|---|---|
| Beef chuck 1000g (175 kcal, 20g P, 10.5g F per 100g) | 1750 | 200 | 0 | 105 |
| Coconut milk 800ml full-fat (175 kcal, 1.4 P, 3 C, 17.5 F per 100ml) | 1400 | 11 | 24 | 140 |
| Oil 2 tbsp | 240 | 0 | 0 | 27 |
| Massaman paste 114g (~150 kcal/100g) | 165 | 3 | 20 | 8 |
| Garlic 3 cloves, ginger 1 tbsp, lemongrass paste 1 tbsp | 40 | 1 | 8 | 2 |
| Onion 180g | 72 | 2 | 16 | 0 |
| Waxy potatoes 500g | 375 | 9 | 85 | 0 |
| Fish sauce 2 tbsp | 10 | 2 | 1 | 0 |
| Palm sugar 2 tbsp (~26g) | 100 | 0 | 26 | 0 |
| Tamarind paste 2 tbsp (pourable) | 40 | 0 | 10 | 0 |
| Roasted peanuts 60g | 350 | 15.5 | 9 | 30 |
| **Total** | **4542** | **243.5** | **199** | **312** |
| **Per serving (÷6)** | **757 → 760** | **40.6 → 40** | **33** | **52** |

Macro check: 40×4 + 33×4 + 52×9 = 760. Rice, coriander and chili are excluded (stated in headnoteIngredients). At ÷5 the same pot is 908 kcal per serving.

## FLAG
- **Servings changed from the draft's "4 to 5" to 6.** At 5 servings it would be ~908 kcal and hidden by the default filter. I chose 6 on portion grounds (matches the per-person beef and coconut milk of the two strongest sources), not to dodge the filter, but the cook should confirm (question 1).
- Label checks written into the recipe: massaman paste (shrimp paste is fine; check the rest or buy one with a halal mark), halal-certified stock if substituted for water, gluten in paste/fish sauce for coeliacs. Beef from a halal butcher.

## Image
https://images.unsplash.com/photo-1672933036331-e27ffae157bd?w=1200&q=80 (Unsplash photo i7IcViKHK90, free Unsplash License, by Yoav Aziz). An orange-brown massaman-style curry in a white scalloped bowl with a cinnamon stick, star anise and peanuts on top and chunks of meat in the sauce; a stir-fry in the background. No faces. Good match for the dish (returns 200; not used by any other recipe). Local copy: /private/tmp/claude-501/-Users-nievesyang-Documents-GitHub-nieves-kitchen/214c2963-4b2b-4973-828d-b3d066068d43/scratchpad/tweaks2/img/massaman-beef-curry.jpg

## Checks run
- `npx tsc --noEmit`: no errors in this file.
- `npx tsx S/lint.ts massaman-beef-curry`: no `!` lines (one info line: "isDairyFree but list has milk", which is coconut milk).
- File loads: 760 kcal, time 60/190 (resting 10).

## Verification

Second cook, 2026-10-26. I cooked it through in my head for 6, re-checked the sources (Hot Thai Kitchen stovetop and Instant Pot, RecipeTin Eats' current card with its shop-paste notes), and looked up the label for Maesri massaman paste (about 3480mg sodium and 262 kcal per 100g, so salt is 8.7g per 100g).

**Is 6 portions honest?** Yes. Per person that is 167g raw boneless chuck. RecipeTin gives 175g (700g for 4), Hot Thai Kitchen's Instant Pot version 170g (680g for 4), and its stovetop version about 150g of meat (900g bone-in short rib for 4). Sauce comes to about 200ml per portion (roughly 900ml of braising liquid with the beef juices, plus about 400ml of paste and thin milk, minus what the simmer takes off), the same as both sources (about 210ml). With rice this is a full dinner plate. At 5 portions it would be about 940 kcal each.

**Changes**
1. Seasoning amounts raised and given room to taste. The pot had 2 tbsp palm sugar, 2 tbsp fish sauce (one held back) and 2 tbsp tamarind for about 1.2 litres of sauce. That is roughly half Hot Thai Kitchen's ratio (3 tbsp sugar, 2 to 3 fish sauce, 2 tamarind for about 850ml), and the salt sum came out under-seasoned: 114g Maesri (about 3970mg sodium) plus 1 tbsp fish sauce is only about 0.55% salt across the pot. The list now has **3 tbsp each**: 2 tbsp sugar, 1 tbsp fish sauce and 2 tbsp tamarind go into the pot, and the rest is added to taste.
2. The tasting step is rewritten. You taste the sauce with a piece of potato, then adjust a teaspoon at a time in the order sweet, salty, sour, each with a cue (sharp or thin, flat, heavy or too sweet). It says that many pots take another tablespoon or two of fish sauce, and it gives a fix for over-salting (a splash of water with a little sugar and tamarind).
3. Pressure cooker re-timed. Before: 35 min at high pressure with 15 min natural release. Now: **30 min with 10 min natural release**, plus 5 min more if a cube is still firm. Hot Thai Kitchen uses 30 min with natural release for bigger 5cm cubes. Ours are 4cm and still simmer 25 min in the curry, so 35 plus 15 would shred them.
4. Pressure cooker liquid is now 150ml of water, not 100ml. A covered hob braise loses only about 100 to 150ml, so 150ml in a sealed cooker ends at the same sauce level. The extra thin liquid also gives more margin against the burn warning. The coconut milk is poured over the beef and not stirred, so the thick milk does not sit on the hot base. Browning is in three or four batches, because the cooker's base is smaller.
5. The pressure-cooker finish is now its own step in Bring it together. It says sauté with the lid off, bring it to a bubble and then turn it to low for 20 to 25 minutes, with the peanuts in for the last 10. You stir the base every few minutes, because a cooker base runs hot and coconut sauce catches. It tells you how the sauce reduces and to give it 5 more minutes on the normal setting if it is still thin. Before, it only said "finish on sauté with the lid off".
6. Fallback for coconut milk that has not separated: measure out 150ml and boil it until it has halved and looks oily (Hot Thai Kitchen's method). The second tin now goes into the fridge at the start so its cream sets firm. The tip about cream that will not split (add oil) is unchanged.
7. Potatoes: they are now nudged under the sauce, so they cook evenly in the uncovered simmer. A non-stick pan is suggested for browning them. The crust claim now credits the waxy potato as well. I checked that they hold their shape: 3 to 4cm waxy chunks, browned, then 20 to 25 minutes at a gentle simmer with tamarind (acid firms the pectin) stay whole. Both sources simmer potatoes for 10 to 15 minutes only, so 20 to 25 here is the safe top end. Floury potatoes would not hold up.
8. Nutrition went from 760 to **780 kcal** (P41 C35 F53). The paste is about 299 kcal for the tin, not 165 (label: 262 kcal/100g, 15g fat, 27g carbs). I counted 2.5 tbsp each of the extra sugar and tamarind. The total for the pot is about 4707 kcal, or 785 per serving. Macro check: 41×4 + 35×4 + 53×9 = 781.
9. Smaller fixes. The headnote now says a 114g tin is "about", not "exactly", 6 tbsp. The note on Indian tamarind concentrate now says to use a third as much. The block-tamarind substitution is now spoon for spoon. The stock substitution says "before adding any more fish sauce". The description says 30 minutes at pressure. The headnote timing now says "last 20 minutes or so". The yield wording is clearer. There is also a drizzle of extra oil if the pot looks dry while browning.

**Checked and left alone:** hob timings (190 min total, 60 active), the order of work (potatoes and paste started 70 min in and ready by the beef check), pot size (24cm holds about 2.9L at the end), the halal and gluten label lines, dietary booleans, tags, the image (200, a massaman with cinnamon, star anise and peanuts, no faces, saved at S/img/verify-massaman-beef-curry.jpg), no em or en dashes. `tsc` is clean for this file, the lint shows no `!` lines (only the coconut "milk" info line), and the file loads.

**FLAGs**
- Servings are 6, not the draft's "4 to 5". The per-person amounts back this up, and at 5 it would be about 940 kcal and hidden by the default filter.
- Label checks are in the copy: the paste (beyond shrimp paste), halal stock if used, gluten in paste and fish sauce.

**Questions for the cook**
1. Portion size: keep it at **6 servings, about 780 kcal**? At 5 it is about 940 kcal and hidden by the default filter.
