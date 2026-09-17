---
name: pot-first-method-authoring
description: "Cook's raw notes are written for their pressure cooker; recipes must be authored pot-first with the appliance kept as an optional substitution"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: f2e8fad9-3160-4a6a-8376-451aba3c8e3b
  modified: 2026-09-03T23:59:29.429Z
---

**Rule (2026-09-04):** The cook's source notes in `~/Desktop/meals/made/` are written against their own machine (a Tefal Turbo Cuisine CY7548: "Brown programme", "Soup programme", "HEAt", "HOt", the bottom-left stopwatch button, max fill line). Recipes on the site must be authored **pot-first**: the default method is a regular pot or pan on the hob, with no appliance named anywhere in the copy. The appliance then goes back in as an **optional** entry under `substitutions`, phrased "if you have one", never in `equipment` (listing it there reads as a requirement).

**Why:** "This is just like a regular recipe that could use a pot, to be honest." A reader should never feel they need to buy a machine to cook the dish. But deleting the option outright throws away a genuinely useful, already-tested path, so the answer is optional, not absent. Pairs with [[feedback_equipment_list_convention]], which is about the equipment *list*; this one is about the *method*.

**How to apply:**
1. Translate machine vocabulary to generic technique (sauté setting to medium-low heat in a heavy pot, programme to simmer covered). Keep generic pressure-cooking terms (natural release, high pressure) only inside the optional substitution.
2. **Re-time the method, do not just re-word it.** Pressure and simmering are not interchangeable schedules. On the potato/leek/corn soup the corn went in at the start under pressure (whole run 5 min), but in a pot the potatoes need ~20 min and the corn would go bland, exactly the failure the cook's own notes warn about. Fixed by simmering potatoes 10 min alone, then corn for the last 8 to 10. Always check whether an ingredient's placement in the sequence depended on the appliance's short run time.
3. Re-check `time.active`/`time.total` after the switch: dropping come-up-to-pressure and natural release cut this recipe from 45/80 to 50/65.
4. State the timing difference explicitly in the substitution, or a reader will apply the pot sequence to the appliance and get it wrong.
5. Keep the cook's hard-won machine observations in generic form (do not leave it on keep-warm, it carries on softening the corn) since those come from having actually made it.

Recipe notes also carry sections the site does not use verbatim: "Machine notes" (drop entirely), "Notes from the first cook" and "Next time" (mine for tips, never invent the taste notes the cook marked as still to add). See [[feedback_seed_for_the_cook]] for the reseed step after editing.
