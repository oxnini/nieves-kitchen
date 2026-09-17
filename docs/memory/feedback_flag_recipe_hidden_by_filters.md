---
name: flag-recipe-hidden-by-filters
description: Warn at authoring/seed time when a recipe's nutrition or time will make it invisible under DEFAULT_FILTERS
metadata:
  type: feedback
---
When authoring or seeding a recipe, check its `nutrition.calories` against `DEFAULT_FILTERS.maxCalories` (currently 800 in `lib/filters.ts`) and tell the user **before they go looking for it** if the recipe will be filtered out of `/recipes` and `/atlas` on first paint.

**Why:** The potato/leek/corn soup was seeded at 1150 kcal on 2026-09-03 and silently vanished from every browse surface. The user spent time wondering whether the upload had failed. In their words: "instead of just not showing it on the page, it would be helpful if you could just let me know that it's going to be false if the recipe is more than 800 calories... because then I'm just wondering why it's not showing up on the website, and you never really told me that it wouldn't show up."

Two things make this failure silent and worth guarding against:
- `countActiveFilters` only counts the calorie filter when it is *below* 800, so the FilterPanel badge reads "0 active filters" while the recipe is being excluded.
- The slider is `min={100} max={800}` in `components/FilterPanel.tsx`, so 800 is the ceiling and the user cannot drag it high enough to reveal an over-cap recipe through the UI at all.

**How to apply:** After authoring nutrition and before/at seed, if `calories > 800` say so explicitly and offer the choices (re-scope the nutrition, or raise the cap). Same check for `time.total` if `maxTime` ever gains a non-null default. Relates to [[nutrition-convention]] (nutrition is per-serving) and [[seed-for-the-cook]].
