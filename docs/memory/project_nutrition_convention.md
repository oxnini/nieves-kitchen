---
name: Nutrition convention + future brainstorm
description: Recipe nutrition convention is per-serving; user wants a future brainstorm on macro manipulation, fractional servings, and auto-calc
type: project
originSessionId: 21913b2e-448f-4f30-9b3d-6a791890a86d
---
**Decision (2026-05-08, clarified + implemented 2026-06-23):** `recipes.nutrition` represents values **per single serving**. The displayed number must stay **constant per serving** and must NOT scale with the servings stepper. Adding people scales ingredient amounts only; a portion's macros never change.

**Why:** User's audience cares about protein/macros/calories per portion. User stated it plainly: "as you add people, the nutrition should stay per portion, not increase with it."

**How it's applied (current code):**
- `components/recipe/InfoStrip.tsx` renders `Math.round(recipe.nutrition.X)` directly — NO `* servings`, NO `* scale`. Label reads "Nutrition (per serving, approx.)". Do not reintroduce a multiplier here.
- `components/RecipeCard.tsx` was already correct (shows `recipe.nutrition.X` raw, per serving).
- The servings stepper / `scale = servings / recipe.servings` in `RecipeDetail.tsx` applies to INGREDIENT amounts only, never to nutrition.
- Earlier (pre-2026-06-23) InfoStrip multiplied by `servings`, showing whole-batch totals that inflated as you bumped servings. That was the bug the user caught; it is fixed.
- Authoring: per `writerecipe` skill, nutrition is authored as a per-serving estimate (never totals).

**Open brainstorm topics user wants to revisit later:**
1. Allow fractional / non-integer servings (e.g. 1.5x) — UX for the −/+ stepper, how to handle ingredient amounts that don't divide cleanly.
2. Per-ingredient macro contribution so users can see *which* ingredient drives protein/calories, and potentially toggle ingredients on/off to see live macro changes.
3. Auto-calculate nutrition from ingredients (USDA FoodData Central, Open Food Facts, or LLM at seed time) so the user never has to manually enter calories/protein/carbs/fat. This is the user's preferred long-term direction — they explicitly want "automatic, easier on me."

These are bigger product/UX questions, not a quick implementation task. Use brainstorming skill before designing.
