# Recipe Detail Page v2 — Implementation Plan

> Source brief: `docs/plans/2026-05-22-recipe-detail-v2-brief.md` (FINAL, signed off 2026-05-22). This plan executes the brief; it does not re-open design decisions.
>
> Author note: Phases are independently shippable. Phase 1 is data-only (no UI). Phase 2 ships the new read view. Phases 3 and 4 add cook mode and the timer. Each phase has its own merge boundary.

---

## Goal

Evolve `RecipeDetail` from a single read view into a two-mode cookbook page (Read ↔ Cook) backed by a richer, grouped schema, without churn. The page must keep working through every phase — at no point does a half-shipped phase block browsing or favoriting recipes.

## Architecture decisions (locked at planning time)

1. **Grouped shape is the canonical shape.** `ingredients: { heading?, items: Ingredient[] }[]` and `steps: { heading?, headnote?, items: string[] }[]`. Flat arrays no longer exist after Phase 1; single-group recipes are a group with `heading: undefined`. No dual-path code.
2. **Nutrition is per-serving.** Multiply by `servings` (not by `scale`) at render time. Existing mock data uses per-serving values already, so the migration is a JSDoc + comment change for those rows, plus a one-time semantic clarification for the seed script.
3. **`prep_time` and `cook_time` are dropped in favour of `time_active`, `time_total`, `time_resting`.** `applyFilters` switches to `time_total`. Filter UI copy already says "max time" which is total wall-clock, so semantics match user intent better than today.
4. **Cook progress is re-keyed.** Move from flat index → `{groupIndex, itemIndex}` tuple key. Storage key bumps from `nieves-cook-progress-${slug}` to `nieves-cook-progress-v2-${slug}` so old session data is ignored rather than mis-aligned.
5. **Cook mode is page state, not a route.** No history push, no URL change. Exit handlers are explicit; the modal's existing ESC handler must not be triggered while cook mode is active (cook mode catches ESC first via `event.stopPropagation` in a capture-phase listener).
6. **Sticky step-card position depends on viewport AND modal context.** Standalone page on mobile/tablet: `position: fixed` to viewport bottom. Standalone page on ≥1024px: pin to right column via `position: sticky; bottom: 16px` inside the instructions section. Inside the modal: `position: sticky` inside the modal scroll container (modal's `overflow-y-auto` breaks `position: fixed` for elements that need to sit inside the modal frame; we anchor to the scroll container instead).
7. **Tappable durations render as plain text in read mode.** The render function returns either `string` or `ReactNode[]`; in read mode it always returns `string`. There is no DOM-level rewrite triggered by the cook-mode toggle.
8. **Drop cap is opt-in per recipe via a `dropcap?: boolean` field on `Recipe`.** Default false. Implemented by wrapping the first character of `description` in a `<span class="dropcap">` — no `::first-letter` CSS (Literata renders inconsistent metrics on it across Firefox/Safari).
9. **No new postal ornament leaks onto the recipe page.** The Cutive Mono attribution line is the only postal touch. Equipment, variations, headnotes — all editorial cookbook treatment, not stamps or postmarks.

## Files touched (full inventory across phases)

| File | Phase | Action |
|---|---|---|
| `scripts/migrations/2026-05-22-recipe-detail-v2.sql` | 1 | Create |
| `scripts/schema.sql` | 1 | Modify (update reference schema to match post-migration state) |
| `scripts/seed-mock.ts` | 1 | Modify (new fields, grouped shape) |
| `lib/types.ts` | 1 | Modify (`Recipe`, `DbRecipe`, `IngredientGroup`, `StepGroup`, `dbToRecipe`, JSDoc on `Nutrition`) |
| `lib/mock-recipes.ts` | 1 | Modify (grouped shape, new defaults) |
| `lib/filters.ts` | 1 | Modify (`applyFilters` time field switch) |
| `lib/recipes/duration-detect.ts` | 4 | Create |
| `hooks/useCookProgress.ts` | 1 | Modify (grouped key shape, storage bump) |
| `hooks/useWakeLock.ts` | 3 | Create |
| `hooks/usePageTimer.ts` | 4 | Create |
| `components/RecipeDetail.tsx` | 2,3,4 | Modify (Phase 2: render new fields; Phase 3: cook mode wiring; Phase 4: timer wiring) |
| `components/recipe/AttributionLine.tsx` | 2 | Create |
| `components/recipe/InfoStrip.tsx` | 2 | Create |
| `components/recipe/IngredientGroupList.tsx` | 2 | Create |
| `components/recipe/InstructionGroupList.tsx` | 2 | Create |
| `components/recipe/EquipmentList.tsx` | 2 | Create |
| `components/recipe/VariationsCard.tsx` | 2 | Create |
| `components/recipe/DescriptionBlock.tsx` | 2 | Create (handles dropcap) |
| `components/recipe/CookModeToggle.tsx` | 3 | Create |
| `components/recipe/CookModeHero.tsx` | 3 | Create (the 56px ribbon) |
| `components/recipe/StickyStepCard.tsx` | 3 | Create |
| `components/recipe/PageTimer.tsx` | 4 | Create |
| `components/recipe/DurationToken.tsx` | 4 | Create (the tappable underlined token) |
| `app/dev/cook-mode/page.tsx` | 3 | Create (visual iteration route, kept after phase 4) |
| `app/globals.css` | 2,3 | Modify (`.dropcap` rule; cook-mode type scale CSS vars) |
| `public/sfx/timer-bell.m4a` | 4 | Add |

## Phase dependency graph

```
Phase 1 (schema + types)
   │
   ├── Phase 2 (read view v2)
   │       │
   │       └── Phase 3 (cook mode)
   │               │
   │               └── Phase 4 (timer + tappable durations)
```

Phases are strictly sequential. There is no useful Phase 3 without Phase 2's new field surfaces, and there is no Phase 4 without Phase 3's cook-mode shell + sticky step card to host the timer.

---

## Phase 1 — Schema + types (data-only, no visual change)

### Goal
The database, the types, the mock fixture, and the seed script all speak the v2 vocabulary. The existing UI continues to render correctly because the read view falls back gracefully on new fields (they are all optional or have safe defaults).

### Files touched

- Create: `scripts/migrations/2026-05-22-recipe-detail-v2.sql`
- Modify: `scripts/schema.sql`
- Modify: `scripts/seed-mock.ts`
- Modify: `lib/types.ts`
- Modify: `lib/mock-recipes.ts`
- Modify: `lib/filters.ts`
- Modify: `hooks/useCookProgress.ts`
- Modify: `components/RecipeDetail.tsx` (minimal: read from new grouped shape, treat single-group as flat)

### Subtasks (in execution order)

1. **Write the SQL migration** in `scripts/migrations/2026-05-22-recipe-detail-v2.sql`. The migration must:
   - Add columns: `description text`, `attribution text`, `time_active int`, `time_total int`, `time_resting int`, `yield text`, `equipment text[]`, `is_vegetarian bool not null default false`, `is_vegan bool not null default false`, `is_gluten_free bool not null default false`, `is_dairy_free bool not null default false`, `headnote_ingredients text`, `headnote_instructions text`, `variations text[]`, `dropcap bool not null default false`.
   - Backfill `time_active = prep_time`, `time_total = prep_time + cook_time`, `time_resting = 0` for every existing row.
   - Set `time_active` and `time_total` to `NOT NULL` after backfill (`alter column ... set not null`).
   - Convert `ingredients` jsonb from `Ingredient[]` to `[{ items: Ingredient[] }]` via an `update recipes set ingredients = jsonb_build_array(jsonb_build_object('items', ingredients))` style statement. Same for `steps` (the `items` array there is `string[]`).
   - Drop `prep_time` and `cook_time` columns (they are now replaced by `time_active` / `time_total`).
   - Be idempotent for re-running on a partially-applied DB: each `add column` uses `if not exists`; the jsonb conversion checks `jsonb_typeof(ingredients->0) = 'object' and ingredients->0 ? 'items'` before running.

2. **Update `scripts/schema.sql`** to match the post-migration shape so a fresh `psql -f scripts/schema.sql` produces the same DB as `schema.sql + migration`.

3. **Update `lib/types.ts`:**
   - Add `IngredientGroup = { heading?: string; items: Ingredient[] }`.
   - Add `StepGroup = { heading?: string; headnote?: string; items: string[] }`.
   - Change `Recipe.ingredients: IngredientGroup[]`, `Recipe.instructions: StepGroup[]`.
   - Add `Recipe.description?`, `attribution?`, `time: { active: number; total: number; resting?: number }`, `yieldText?`, `equipment?: string[]`, `isVegetarian: boolean`, `isVegan: boolean`, `isGlutenFree: boolean`, `isDairyFree: boolean`, `headnoteIngredients?`, `headnoteInstructions?`, `variations?: string[]`, `dropcap?: boolean`.
   - Remove `Recipe.prepTime`, `Recipe.cookTime` (gone). Keep `quote`, `tips`, `substitutions`, `storage` unchanged.
   - JSDoc on `Nutrition`: `"All values are per-serving. The detail page renders cumulative totals by multiplying by the current servings count."`
   - Update `DbRecipe` to match new column shape (snake_case: `time_active`, `time_total`, `time_resting`, `is_vegetarian`, etc.). Drop `prep_time`, `cook_time` from `DbRecipe`.
   - Update `dbToRecipe()` accordingly.

4. **Update `lib/mock-recipes.ts`:**
   - The `mock(...)` helper now needs to emit grouped shape: `ingredients: [{ items: [...] }]`, `instructions: [{ items: [...] }]`.
   - Add the new required fields: `time: { active: 15, total: 45, resting: 0 }`, `isVegetarian/Vegan/GlutenFree/DairyFree: false`.
   - This is the only file in Phase 1 that is *required* to compile against the new types; if it compiles, the type chain is sound.

5. **Update `scripts/seed-mock.ts`:**
   - Emit grouped shape for `ingredients` and `steps` (single group with no heading is fine).
   - Emit `time_active`, `time_total`, `time_resting` instead of `prep_time` / `cook_time` (compute `time_total = old_prep + old_cook`).
   - Emit the four dietary booleans (default false, except: `mock-ratatouille`, `mock-pierogi`, `mock-fattoush`, `mock-koshari` → vegetarian; `mock-fattoush` → also vegan if no honey).
   - Add `description` from the existing one-line descriptions in the file (already present, just map through).
   - Document at the top of the file: *"Nutrition values are per-serving."*

6. **Update `lib/filters.ts`:**
   - `applyFilters` line 37: replace `r.prepTime + r.cookTime > filters.maxTime` with `r.time.total > filters.maxTime`. No other change.

7. **Update `hooks/useCookProgress.ts`:**
   - Storage key bumps to `nieves-cook-progress-v2-${slug}`.
   - Key shape changes from flat number indices to `${groupIndex}-${itemIndex}` strings.
   - `toggle(type, groupIndex, itemIndex)` and `isChecked(type, groupIndex, itemIndex)`.
   - Old v1 keys are *not* migrated. Mid-cook users on the day of deploy lose their checkboxes once; the existing checkmark UX is mid-cook only and not persisted across sessions in a meaningful way (it's sessionStorage), so this is acceptable.

8. **Minimal `RecipeDetail.tsx` refactor:**
   - Switch over to grouped reads but render only the first group (no group headings yet). Keep the current visual treatment otherwise.
   - Switch time chips from `prepTime/cookTime` to `recipe.time.active` / `recipe.time.total` / `recipe.time.resting`. Use the brief's microcopy: `Active 30m · Total 2h · Rest 1h`, drop Rest when 0 or undefined. (This is the only user-visible change in Phase 1.)
   - Switch nutrition multiplier from `* scale` to `* servings`. Verify the current per-serving values render correctly (they should already be per-serving in mocks, but the code multiplied by `scale = servings/recipe.servings`, which today happens to equal `servings / recipe.servings * recipe.nutrition`. After fix, render is `recipe.nutrition * servings`.)
   - Update `useCookProgress` calls to pass `(type, 0, itemIndex)` since we're still rendering one group.
   - Copy text functions adapt to the grouped array (still produce the same flat output).

9. **Run `npm run lint` and `npm run build`.** Both must pass before commit.

10. **Manual DB run.** Apply migration locally via Supabase SQL editor *or* truncate + re-seed via `npm run seed:mock`. Confirm `select * from recipes limit 1` shows new columns populated.

### Hard dependencies (within phase)

- Subtask 1 (SQL) before Subtask 5 (seed script must target the new schema).
- Subtask 3 (types) before Subtask 4 (mock fixture must compile).
- Subtask 3 (types) before Subtask 8 (component reads new field names).
- Subtask 7 (cook progress signature change) before Subtask 8 (component must call the new signature).

### Anticipated failure modes

- **`useCookProgress` flat-key migration silently mismatches.** If we don't bump the storage key, a user mid-cook on deploy day sees ingredient #3 still checked while we're now reading group-0/item-3 — which happens to work for the trivial single-group case but desynchronises the moment groups exist. Fix: bumping the storage key is non-negotiable. Old keys are abandoned, not migrated.
- **`applyFilters` switch breaks the filter panel if `time` is undefined on any stale recipe.** Optional chaining is not enough — if `r.time` is `undefined`, the comparison `r.time.total > filters.maxTime` throws. After migration, `time.active` and `time.total` are NOT NULL in the DB, but `dbToRecipe` must build the `time` object unconditionally. Add a defensive default in `dbToRecipe` (`time: { active: db.time_active ?? 0, total: db.time_total ?? 0, resting: db.time_resting ?? undefined }`) so a partially-migrated row never throws.
- **The jsonb conversion in migration double-wraps if re-run.** Re-running the conversion would produce `[{ items: [{ items: [...] }] }]`. Guard with the `jsonb_typeof / ? 'items'` check listed in subtask 1.
- **`schema.sql` and the migration drift.** If a future engineer runs `schema.sql` on a fresh DB and gets a different shape than migration-applied prod, Phase 2 onward breaks in subtle ways. Subtask 2 keeps them in sync; PR review must enforce this.
- **Recipe rows in prod existed but were missed.** Brief assumes "currently no production recipes." Before running the migration on prod, run `select count(*) from recipes where slug not like 'mock-%'` and confirm zero. If non-zero, those rows need `description`, attribution, dietary flags inspected by hand, not auto-backfilled.
- **Per-serving nutrition was historically computed `* scale` (= `servings / recipe.servings`).** This is mathematically equivalent to "multiply by servings, divide by original servings, multiply by old factor" — net result today is the same number on screen because the old code happened to land on per-serving stored values divided by their own servings * new servings. The fix simplifies the formula but should produce the same on-screen values today; the meaningful change is semantic, not numeric. Verify on a known recipe (e.g. `mock-pierogi`: 420 kcal per serving at servings=4 should render `1680 kcal` when scaled to 4 servings → same as before).

### Verification

1. `npm run lint` passes.
2. `npm run build` passes.
3. Apply migration to local Supabase. `select column_name, data_type from information_schema.columns where table_name='recipes' order by ordinal_position;` shows the new columns and no `prep_time`/`cook_time`.
4. `npm run seed:mock` succeeds; `select slug, time_active, time_total, jsonb_typeof(ingredients) from recipes limit 5;` shows `array` jsonb with grouped shape (`jsonb_typeof(ingredients->0) = 'object'`).
5. `npm run dev`. Visit `/recipes/mock-ratatouille`. The page renders. Time chips read `Active 15m · Total 55m`. Nutrition numbers match the pre-change values for servings=4.
6. Visit `/recipes` and apply the "max time" filter; verify recipes are filtered against `time.total` (sanity check: setting max-time to 30 hides 2-hour stews).

### Deferrable if Phase 1 runs long

- The `dropcap` boolean — could be added in Phase 2 instead. The column adds no cost in Phase 1 but it's not blocking.
- The `equipment` column — could be added later if jsonb-fatigue sets in. The brief calls it out as cheap/high-value though, so push to include now.
- `headnoteIngredients` / `headnoteInstructions` — same: could move to Phase 2's column add. Cleaner to ship the whole schema once.

Hard floor: the grouped shape conversion of `ingredients` and `steps` MUST land in Phase 1, because every subsequent phase reads grouped data. Defer those at your peril.

---

## Phase 2 — Read view v2

### Goal
The full editorial cookbook treatment from the brief renders correctly for the richest recipe and for the sparsest recipe, in both parchment and sepia, in both the standalone page and the intercepting modal.

### Files touched

- Modify: `components/RecipeDetail.tsx`
- Create: `components/recipe/DescriptionBlock.tsx`
- Create: `components/recipe/AttributionLine.tsx`
- Create: `components/recipe/InfoStrip.tsx`
- Create: `components/recipe/IngredientGroupList.tsx`
- Create: `components/recipe/InstructionGroupList.tsx`
- Create: `components/recipe/EquipmentList.tsx`
- Create: `components/recipe/VariationsCard.tsx`
- Modify: `app/globals.css` (`.dropcap` rule)
- Modify (optional, see failure modes): `scripts/seed-mock.ts` — add one "rich" recipe with every field populated so we can see the full design

### Subtasks (in execution order)

1. **Seed a "rich" mock recipe** that exercises every new field at once: ingredient groups (3 groups: "For the dough", "For the filling", "To serve"), step groups (3 groups with one headnote), `description`, `attribution`, `equipment` (4 items), all four dietary flags (set vegetarian=true, others=false), `headnoteIngredients`, `headnoteInstructions`, `variations` (3 lines), `dropcap=true`. Pick a culturally-anchored real recipe like a Lebanese spinach fatayer or a Moroccan b'stilla. Slug: `mock-rich-fatayer` (or similar). This single recipe is the visual harness for the entire phase.

2. **Build `DescriptionBlock`.** Renders the pull-quote (existing `quote` field, Literata italic, max-prose), then the `description` paragraph with conditional `<span class="dropcap">` on the first character if `recipe.dropcap === true`. 2–4 sentence range is a content rule, not a render rule; do not truncate.

3. **Build `AttributionLine`.** Cutive Mono small caps, one line, brown-medium colour. Renders nothing if `attribution` is empty. This is the *only* postal-feeling element on the page.

4. **Build `InfoStrip`.** Consolidates:
   - Time chips: Active / Total / Rest. Rest chip hidden when 0 or undefined.
   - Yield line: `Makes {yield} · Serves {servings}` when both present; `Serves {servings}` alone otherwise.
   - Dietary badges: small filled circle + label, only for `true` flags. Order: Vegetarian, Vegan, Gluten-Free, Dairy-Free. (Vegan implies Vegetarian but render only Vegan in that case to avoid duplication — author convention, enforced in component.)
   - Nutrition card and FlavorCompass remain inside the strip exactly as today.
   - Tags row remains.
5. **Build `EquipmentList`.** Compact inline `Tagine · Mortar · Sieve` formatting (Cutive Mono is NOT used here; this is editorial body text). Renders nothing if `equipment` is empty or undefined.

6. **Build `IngredientGroupList`.** Receives `groups: IngredientGroup[]`. For each group: small Literata heading + subtle hr-style rule beneath, then the ingredient rows. If there is exactly one group with no heading, skip the heading entirely so simple recipes look unchanged from today. Headnote (`headnoteIngredients`) renders as italic Literata above the *column header*, indented.

7. **Build `InstructionGroupList`.** Receives `groups: StepGroup[]`. For each group: optional heading, optional italic headnote, then numbered steps. Step numbering is **continuous across groups** (group 1 ends at step 3, group 2 starts at step 4). This matches the brief's mockup: "1. … 2. … 3. … // Sear // 4. … 5. …". Headnote (`headnoteInstructions`) renders above the column header, like the ingredient version.

8. **Build `VariationsCard`.** Same visual treatment as `Substitutions` card today. Place as a sibling in a 2-up grid (Variations on the left, Substitutions on the right). Storage + Tips remain full-width below.

9. **Rewire `RecipeDetail.tsx`** to compose these pieces in the layout sequence from the brief's mock-up. Order top-to-bottom: hero → quote + description block + attribution → info strip → equipment → spread (with ingredient/instruction groups and their headnotes) → variations + substitutions → storage → tips → cooked button.

10. **Copy-recipe overhaul.** `copyFullRecipe` must preserve group headings and step groups. Output shape:
    ```
    {Recipe name}

    Serves {servings}{ · Makes {yield}}
    Active {active}m · Total {total}m{ · Rest {rest}m}

    --- Ingredients ---
    {Group heading or "" if none}
    - {amount} {ingredient}
    ...

    --- Instructions ---
    {Group heading}
    1. {step}
    ...
    ```
    `copyIngredients` similarly preserves headings.

11. **Sparse-recipe smoke test.** Pick an existing mock recipe (e.g. `mock-tacos`) that has no description/attribution/equipment/etc. and verify the page collapses cleanly — no empty cards, no empty headings, no `—` placeholders.

12. **Sepia parity sweep.** Toggle theme, walk through both the rich and sparse recipes. Confirm new components don't introduce contrast regressions; if any do, add a targeted override to the bottom of `app/globals.css` (per the repo convention) rather than touching call sites.

### Hard dependencies

- Phase 1 complete (grouped types and fields exist).
- Subtask 1 (rich seed) must land before Subtasks 6–10 because there's nothing to look at otherwise.

### Anticipated failure modes

- **340px ingredient column collides with servings stepper at narrow tablet widths.** The current stepper sits in the column header (`flex items-center justify-between`); with the servings adjuster + US/Metric toggle + ingredients heading in one row, the line wraps awkwardly at ~520–600px. Fix: at `<640px` stack the controls below the heading; at ≥640px keep them inline. Not "consider responsive"; this is a known break point in the existing code that the new dietary badges only worsen.
- **`first-letter` selector breaks Literata's drop-cap metrics.** That's why we're using a manual `<span class="dropcap">`. CSS: `.dropcap { float: left; font-family: var(--font-heading); font-size: 3.4em; line-height: 0.85; padding: 0.1em 0.1em 0 0; color: var(--color-brown-dark); }` — verify the float reflows correctly inside `max-w-prose` containers. Test specifically with descriptions of 1, 2, and 4 lines.
- **Step numbering across groups gets reset accidentally.** A naive `steps.map((group) => group.items.map((step, i) => i+1))` resets to 1 each group. Use an outer running counter or `flat()` the steps for numbering while still grouping for visual layout.
- **Ingredient headings break the "click to check off" pattern if they're inside the `<label>`.** Headings must sit outside the row labels, not be children of them, or clicking a heading toggles the wrong checkbox.
- **Vegan + Vegetarian both render when both are true.** Visual noise. Suppress Vegetarian when Vegan is true. (Brief is silent on this; enforce in `InfoStrip`.)
- **Gluten-Free symbol is sometimes confused with celiac certification.** Use "Gluten-Free" as plain text label; do not introduce a certification mark.
- **`max-w-prose` clamps the description but the parent container is `max-w-5xl`.** The description block needs its own `max-w-prose` wrapper or it will spread to the full 5xl width.
- **Equipment list with one item looks lonely.** Acceptable per brief ("hidden when empty"); confirm with sparse recipe.
- **Modal context: the page is narrower (max-w-880px) than the standalone page (max-w-5xl).** The two-column spread can still fit at 880px wide (340 + 12 gutter + ~520) but only just; verify the right column doesn't get crushed.
- **Variations card can look orphaned if Substitutions is empty.** When only one of the two exists, render that card full-width (`md:col-span-2`) instead of leaving a hole in the grid.
- **`copyFullRecipe` produces clipboard text with trailing whitespace per blank group heading.** Skip headings that are empty/undefined in the output.

### Verification

1. `npm run lint && npm run build` pass.
2. Visit `/recipes/mock-rich-fatayer` (or whichever rich slug you seeded). Walk top-to-bottom; every brief section is visible and styled.
3. Toggle the servings stepper from 1 → 24. Nutrition numbers and ingredient amounts both scale. No layout collapse at narrow viewports.
4. Visit `/recipes/mock-tacos`. Page collapses cleanly: no empty cards, no orphan headings.
5. Hard-refresh the recipe (full page route). Then click into it from `/recipes` (intercepting modal route). The same components render correctly in both contexts.
6. Toggle theme to sepia at both URLs. No contrast regressions.
7. `Copy Recipe` and `Copy ingredients` both produce text that preserves group headings.
8. Mobile viewport (≤640px): the ingredients-column header controls stack cleanly under the "Ingredients" heading.

### Deferrable if Phase 2 runs long

- The `dropcap` CSS — the rich recipe can ship with `dropcap: false` if the implementation gives trouble. The description still renders as a regular paragraph.
- Two-up `Variations` ↔ `Substitutions` grid: ship both as stacked full-width cards if the grid logic is fiddly. (Lose 5% of editorial polish, lose 0% of content.)
- Continuous step numbering across groups: ship with per-group restart (1, 2, 3 // 1, 2, 3) if the running-counter logic is messy. Add an inline comment so the next person fixes it.

Hard floor: every new field has to *display*. Aesthetic polish is deferrable; data visibility is not.

---

## Phase 3 — Cook mode

### Goal
A toggle pill, visible after the user scrolls past the info strip, switches the same page into a hands-on cooking surface. The hero collapses to a sticky ribbon, all editorial chrome hides, type scales up ~1.25×, the screen stays on, and a sticky bottom step-card shows the current step with Done/Next controls. ESC, browser back, and the toggle itself all exit cleanly.

### Files touched

- Create: `hooks/useWakeLock.ts`
- Create: `components/recipe/CookModeToggle.tsx`
- Create: `components/recipe/CookModeHero.tsx`
- Create: `components/recipe/StickyStepCard.tsx`
- Create: `app/dev/cook-mode/page.tsx`
- Modify: `components/RecipeDetail.tsx` (cook-mode state, conditional rendering, mode-aware layout)
- Modify: `app/globals.css` (cook-mode type-scale CSS vars on a body class or data attribute)

### Subtasks (in execution order)

1. **Build `/dev/cook-mode` first.** This route imports the same `RecipeDetail` component and renders it with a mock recipe (the rich one from Phase 2). Add an A/B preview: two recipes side-by-side at desktop (one rich, one sparse), each in its own scroll container, with a top-of-page mode selector that toggles cook mode for both. This is the visual lab for the whole phase per the memory rule on visual iteration.

2. **Build `useWakeLock` hook.** Requests `navigator.wakeLock.request('screen')` on enter, releases on exit / unmount / `visibilitychange === 'hidden'`. Handles the "device doesn't support wake lock" branch with a one-time toast hint (`"Screen may dim during cooking"`) — do not block cook mode. Re-acquires the lock when the document becomes visible again (some browsers release on visibility change without notice).

3. **Build `CookModeToggle` (the pill).** Sticky top-right of the spread. Visible only after the user has scrolled past the info strip — use `IntersectionObserver` on the info strip's bottom sentinel, not a scroll listener. The pill reads `Cook mode` in read mode, `Read mode` in cook mode. 250ms cross-fade between modes (not the pill — the whole page).

4. **Build `CookModeHero`.** A 56px sticky ribbon with the recipe title, country, and a ✕ that exits cook mode. Replaces the 320–420px hero when cook mode is on.

5. **Build `StickyStepCard`.** Three responsive placements (see Architecture decision #6):
   - `<lg` viewports, standalone page: `position: fixed; bottom: 0; left: 0; right: 0` with safe-area inset padding.
   - `≥lg` viewports, standalone page: `position: sticky; bottom: 16px;` *inside* the instructions column, so it doesn't span the whole 27" viewport.
   - Inside modal: `position: sticky; bottom: 0;` inside the modal's scroll container. Z-index above the modal content, below the modal header.
   The card always shows: current uncompleted step text, `Done` button (checks and advances), `Next →` button (advances without checking). The "current uncompleted step" is the first step whose checkbox is unchecked across all groups, walking in render order.

6. **Wire cook mode in `RecipeDetail`.**
   - Add `const [mode, setMode] = useState<'read' | 'cook'>('read')`.
   - When `mode === 'cook'`: hide quote, description, attribution, info strip, equipment, supplementary cards (variations, substitutions, storage, tips, cooked button placement). Show only ingredients + instructions (scaled up) + the sticky step card.
   - Add `data-cook-mode="true"` on the page root so `globals.css` can scale text via CSS vars (avoids re-running every component's font-size logic).
   - Cross-fade: wrap the conditionally-hidden blocks in framer-motion `AnimatePresence` with 250ms opacity transition. No layout shift — the hidden blocks unmount and the layout re-flows; that's expected and what the brief calls "no jump" because the visible content (ingredients + instructions) is in the same position.

7. **Exit handlers.**
   - Toggle: `setMode('read')`.
   - ESC: `useEffect` adds a `keydown` listener in the **capture phase** (`addEventListener('keydown', handler, { capture: true })`) that, when in cook mode and key is `Escape`, calls `e.stopPropagation()` then `setMode('read')`. This intercepts before `RecipeModal`'s own ESC handler (which would close the modal entirely). When `mode === 'read'`, the listener is a no-op so the modal's ESC behavior is unchanged.
   - Browser back: cook mode does NOT push history. The brief says "exit cook mode via toggle / ESC / browser back." Re-interpret: browser back from cook mode means "the user pressed back to dismiss the current view"; if we're in the intercepting modal, that closes the modal AND ends cook mode in one go (acceptable). If we're on the standalone page, browser back navigates away from the recipe entirely (acceptable — they wanted out of the cook surface). We do NOT add a special history entry for cook mode.
   - Visibility hide: pause-but-don't-exit cook mode. Release the wake lock; re-request on visibility return.

8. **Cooked-button promotion in cook mode.** When every step's checkbox is ticked, the sticky step card morphs (250ms) into the "I cooked this" CTA. Reuse `CookedButton` inside the card; do not duplicate the stamp logic.

9. **Visual iteration on `/dev/cook-mode`.** Before merging to `RecipeDetail`'s actual rendering path, the user reviews `/dev/cook-mode` and signs off on the look. This is the rule (memory: `feedback_visual_iteration_workflow`). Do not skip.

### Hard dependencies

- Phase 2 complete (the full editorial chrome must exist before we can conditionally hide it).
- Subtask 1 (dev route) before Subtask 9 (review).
- Subtask 2 (wake lock hook) before Subtask 6 (mode wiring imports it).
- Subtask 7 (exit handlers) requires Subtask 6 (mode state) and Subtask 5 (sticky card) since the close ✕ on the ribbon needs `setMode`.

### Anticipated failure modes

- **Modal ESC handler closes the modal instead of exiting cook mode.** Root cause: `RecipeModal` registers its own `keydown` listener on `window` and calls `router.back()` on ESC. Without capture-phase interception, cook mode can't reliably "win" the ESC. Fix: capture-phase listener inside `RecipeDetail` that `stopPropagation()` when in cook mode. Verify by entering cook mode inside the modal and pressing ESC — first press should exit cook mode (modal stays open); second press should close the modal.
- **`position: fixed` on the sticky step card inside the modal floats over the *backdrop*, outside the modal frame, looking detached.** Root cause: the modal uses `overflow-y-auto` on its inner container, which prevents `position: fixed` from anchoring to the modal frame (it anchors to the viewport regardless). Fix: inside the modal, the sticky card uses `position: sticky; bottom: 0` so it rides the modal's scroll bottom. The component reads context (`inModal` prop already exists) to pick its positioning class.
- **Wake lock silently dropped on tab switch and never re-acquired.** Browser releases the lock on visibility hide. Without a `visibilitychange` listener that re-requests on visibility return, the screen goes back to dimming as soon as the user looks at another tab and returns. Fix: listener in `useWakeLock` that re-acquires on visibility return (with the same `mode === 'cook'` guard).
- **`document.documentElement.dataset.cookMode = 'true'` collides with Tailwind's `data-*` attribute strategy.** We're already using `data-theme` for sepia. Adding `data-cook-mode` is fine; just make sure the CSS-var overrides under `[data-cook-mode="true"]` don't accidentally cascade into the modal navbar or other UI outside the recipe surface. Scope the selector to `[data-cook-mode="true"] .recipe-cookbook-spread` (or whatever wrapper class).
- **Sticky step card on desktop pinned to right column lands underneath the cooked-button when reading mode.** Cooked button is read-mode only and hidden in cook mode; non-issue. But verify that the cooked button isn't visible during the cross-fade, which would produce a flash.
- **`IntersectionObserver` for "toggle visibility after scroll" never fires inside the modal.** Default `IntersectionObserver` uses the viewport. Inside a scrollable modal, the observer needs `root: modalScrollContainerRef.current`. Pass the scroll container reference from `RecipeModal` down (or use a context). Sensible fallback: scrollY > info-strip-bottom checked via `scroll` event with rAF throttling.
- **Cross-fade unmounts ingredients on mode change because the wrapper is the AnimatePresence subject.** Make sure the *hidden* blocks are inside AnimatePresence and the *always-visible* blocks (ingredients, instructions) are outside, so they don't reflow during the transition.
- **Type-scale CSS vars don't apply because Tailwind's `text-base` etc. use fixed rem values, not `var(--foo)`.** Tailwind v4 lets you do `style={{ '--text-scale': '1.25' }}` then `[data-cook-mode] { font-size: calc(1rem * var(--text-scale)) }` only if the underlying rules use `em` not `rem`. Practical fix: scope the scaling to a single wrapper class on the spread (`.cook-mode-scale { font-size: 1.125rem; line-height: 1.7; }`) so it cascades naturally instead of trying to override every Tailwind text utility.
- **`useCookProgress` "first uncompleted step" walker is O(n²) on every keystroke if it recomputes on every render.** Memoize against `progress.steps`.

### Verification

1. Visit `/dev/cook-mode`. Toggle to cook mode. Visually compare against the brief's mockup.
2. On `/recipes/mock-rich-fatayer` standalone page: scroll past info strip, the toggle pill appears. Click it. Page cross-fades. Hero collapses to ribbon. Editorial chrome hidden. Ingredients + Instructions remain, scaled larger. Sticky step card visible at bottom (mobile) or pinned to right column bottom (desktop).
3. Tick all steps. Sticky card morphs into the "I cooked this" CTA.
4. Press ESC. Page returns to read mode. (Inside the modal: page returns to read mode, modal stays open. Press ESC again: modal closes.)
5. Lock the device while cook mode is active for >30 seconds (you'll need a real device or DevTools sensor simulation for wake-lock visibility). Wake the device. Page is still in cook mode, screen-stays-on resumes.
6. Toggle to sepia. Cook mode reads as warm leather, not as a tech dashboard.
7. Standalone vs intercepting modal: verify the sticky step card positioning behaves correctly in both.
8. Hard refresh while in cook mode: the page loads in read mode. (Cook mode is not URL state. This is correct per Architecture decision #5.)

### Deferrable if Phase 3 runs long

- The "cooked button morphs into the sticky card" celebration. Could ship Phase 3 with cook mode showing a static `"All done! Tap I cooked this above"` and putting `CookedButton` in a separate, non-sticky slot that appears below the last step. Polish in a follow-up.
- Wake-lock toast hint for unsupported devices. Could be silent in v1; users on Firefox Android will quietly experience screen dim, which is the same behaviour they get everywhere.
- Desktop "pin to right column" positioning. Could ship with `position: fixed; bottom: 16px; right: 16px; max-width: 480px` on desktop instead. Less elegant; works.

Hard floor: toggle in/out, wake lock, ESC handling, sticky step card with Done/Next, and the dev route for visual iteration. The morph-into-cooked-button is the only optional bit.

---

## Phase 4 — Page timer + tappable durations

### Goal
The sticky step card hosts a single page timer with preset durations and a custom input. Tapping a duration mention in a step's prose (cook mode only) seeds the timer with the lower bound of the duration and starts it immediately. Done state is warm and unmistakable; setting a new timer replaces the running one.

### Files touched

- Create: `hooks/usePageTimer.ts`
- Create: `lib/recipes/duration-detect.ts`
- Create: `components/recipe/PageTimer.tsx`
- Create: `components/recipe/DurationToken.tsx`
- Add: `public/sfx/timer-bell.m4a`
- Modify: `components/recipe/StickyStepCard.tsx` (host the timer; render step text via duration-detect when cook mode is on)
- Modify: `components/recipe/InstructionGroupList.tsx` (in cook mode only, use `DurationToken` rendering)
- Modify: `app/dev/cook-mode/page.tsx` (visual iteration continues here, now with the timer)

### Subtasks (in execution order)

1. **Pick the timer-bell sound.** Source a warm, short (≤1.5s) bell or wooden tone (royalty-free or CC0). Encode as M4A (AAC) at 96kbps mono — small file, broad browser support, includes Safari. Drop in `public/sfx/timer-bell.m4a`. Listen on a real device before committing; the brief explicitly forbids a "kitchen buzzer" feel.

2. **Build `usePageTimer` hook.** State: `{ status: 'idle' | 'running' | 'paused' | 'done'; remainingMs: number; totalMs: number }`. Methods: `start(ms)`, `pause()`, `resume()`, `reset()`, `dismiss()`. Uses `setInterval(..., 250)` for tick (smooth countdown without burning battery). Plays the bell + sets `status: 'done'` when remaining hits 0. Done state persists until `dismiss()` is called. `start(ms)` from any status resets and starts immediately (the "one timer at a time, setting a new one replaces" rule).

3. **Build `PageTimer` component.** UI per brief:
   - Preset row: `1m · 5m · 10m · 15m · 30m · 1h · Custom`.
   - Custom: when tapped, reveals an inline minute-input (numeric only, max 999) with Set/Cancel.
   - Running state: `mm:ss` countdown (tabular-nums), Pause, Reset.
   - Done state: subtle pulse on the card, label `Timer done, tap to dismiss`, plays sound once.
   - Visual rest: when idle, render just the preset row inside the step card — no big dead block.

4. **Build `duration-detect.ts`.** Pure module exporting:
   - `detectDurations(text: string): { start: number; end: number; lowerBoundMs: number }[]` — returns matched ranges in source-string indices and the lower-bound in milliseconds. Conservative regex per the brief:
     - Match `\d+\s?(seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h)\b` and ranges `\d+\s?[–-]\s?\d+\s?(units)`.
     - Match only when preceded by an allow-listed verb or sentence start. Allow list per brief: `for`, `cook`, `bake`, `simmer`, `roast`, `boil`, `fry`, `steam`, `rest`, `marinate`, `chill`, `proof`, `until`, `about`, `approximately`, `roughly`.
     - Reject preceded by: `before`, `after`, `every`, `each`, `in`, `within`, `over the next`.
     - For ranges, the lower bound is the timer seed.
   - Unit tests as a separate `duration-detect.test.ts` if Jest/Vitest exists in the project; otherwise inline assertions in a `scripts/check-durations.ts` script. (No test framework configured per CLAUDE.md — pragmatic choice: skip tests for now and verify by hand against a fixture string list.)
   - Fixture string list (in module doc-comment, used for manual verification): "Simmer for 25 minutes" (match 1500000ms), "Cook for 20-30 mins" (match lower 1200000ms), "Rest 1 hour" (match 3600000ms), "Every 5 minutes stir" (reject), "Within 10 minutes of removing" (reject), "About 2 hours" (match 7200000ms), "5m of bread" (reject — no allowed verb), "Bake for 12 minutes" (match), "until 1 hour passes" (match — `until` is allow-listed), "in 5 minutes" (reject), "after 10 minutes" (reject).

5. **Build `DurationToken`.** Receives `text: string; onTap: (ms: number) => void; cookMode: boolean`. In read mode: returns plain `text` (no wrapping). In cook mode: returns an array of `string | <button>` segments, with matched durations wrapped in a `<button class="duration-token">` that has a subtle dotted underline (`text-decoration: underline dotted`) and on tap calls `onTap(ms)`. Style: inherit text colour and font, no chip background, no border — it should look like text that happens to be underlined, not a chip.

6. **Wire `DurationToken` into `InstructionGroupList`.** Each step body renders via `DurationToken` with `cookMode={mode === 'cook'}` and `onTap={pageTimer.start}`. Pass `pageTimer` reference down via prop or via a context defined in `RecipeDetail` (a context is cleaner because the timer also needs to be accessed by `StickyStepCard`).

7. **Wire `PageTimer` into `StickyStepCard`.** The card now lays out: `[current step text] [timer state UI] [Done | Next →]`. On narrow viewports, stack vertically. The timer's preset row goes below the step text when idle; when running, the countdown replaces the preset row inline.

8. **Visual iteration on `/dev/cook-mode`.** Click around: preset timers, custom timer, tap a duration token in a step, finish a timer (waiting ~3 minutes is fine; or have the dev route expose a "speed up" debug switch that runs the timer at 10× for testing). Confirm the done-state pulse + sound feel warm.

9. **Replacement semantics.** Verify by hand: start a 5m timer, then tap a "20 minutes" duration in step prose — old timer is gone, new 20-minute timer starts. Then click `1m` preset — old 20m timer is gone, 1m starts.

### Hard dependencies

- Phase 3 complete (the sticky step card and cook-mode toggle must exist).
- Subtask 4 (duration-detect) before Subtask 5 (DurationToken consumes it) and Subtask 6 (instruction rendering uses it).
- Subtask 2 (timer hook) before Subtask 3 (timer UI) before Subtask 7 (mounted in step card).
- Subtask 1 (sound asset) before Subtask 8 (visual review needs the audible cue).

### Anticipated failure modes

- **Regex overmatches "5m" in "5m of flour" or "300g flour".** Without the verb allow-list gate, this trips. Two-stage detection: first find candidate spans, then check the 12-character left-context for an allow-listed word and the absence of a reject word. Keep the allow list tight; expand only after seeing false negatives on real recipes.
- **Regex matches `1h` inside `1hr30m` and seeds with 1 hour instead of 1.5 hours.** Compound durations like `1hr 30m` are out of scope for v1 (brief doesn't call them out); but defensive: require the unit to be followed by `\b` or end-of-string to avoid sub-match weirdness. Acceptable: prose-level recipes rarely write "1hr30m"; if they do, the user can still tap the preset row to set 90 minutes manually.
- **`onTap` fires twice on touch devices** because `onClick` plus a parent `onClick` bubble. Use `e.stopPropagation()` inside the token button.
- **Sound autoplay blocked.** Some browsers block sound that wasn't initiated by a user gesture. The timer was started by a gesture (tap a preset or a duration token), so the sound at completion qualifies on most browsers if the same Audio object is reused (instantiated up front and `.play()`'d on completion). Fix: pre-warm an `Audio` instance on first user interaction in the page (e.g. first preset tap), then call `.play()` at done time on the same instance. Catch the promise rejection silently.
- **Wake lock + timer combo: timer keeps ticking when tab is hidden, but `setInterval` is throttled to 1Hz minimum on hidden tabs.** Result: a 10-minute timer running while the user backgrounds the tab takes longer than 10 minutes of wall-clock. Fix: don't trust the interval; on each tick, compute `remainingMs = totalMs - (Date.now() - startedAt)`. The interval is just the *render trigger*; the math is wall-clock.
- **Pulse animation jitters on Safari.** Use `transform: scale()` rather than animating box-shadow or width.
- **Tappable duration on a hyphenated range "20-30 minutes" misses because Unicode en-dash isn't `-`.** Brief mentions `[–-]`; include both. Also confirm minus sign U+2212.
- **`DurationToken` re-renders break text selection** because the original prose is now a sequence of buttons + text. Text-select-on-button is restricted in some browsers. Acceptable trade-off for cook mode; user is unlikely to be selecting text while cooking.
- **Inside the intercepting modal, the timer keeps running after the user closes the modal.** Decision: when cook mode exits (via close, ESC, or toggle), reset the timer. This is consistent with cook mode being the timer's host: leave cook mode → leave the timer. Implement in the cook-mode exit handler.
- **Custom timer input accepts garbage / floats.** Clamp to integers, 0 < n ≤ 999, on blur and submit. Discard input on invalid.

### Verification

1. `/dev/cook-mode` in cook mode shows the preset row inside the sticky step card.
2. Tap `5m` preset. Countdown begins from `05:00`. Pause works. Reset works.
3. Tap `Custom`, enter `12`, hit Set. Countdown begins from `12:00`.
4. Start a timer; then click a different preset. Old timer is replaced.
5. In a step that says "Simmer for 25 minutes", the "25 minutes" has a dotted underline in cook mode and is plain text in read mode. Tap it; timer starts at 25:00.
6. Wait for a short timer (1m or trigger via a debug speed-up) to hit zero. Pulse animation plays; bell sounds; label reads `Timer done, tap to dismiss`. Tap to dismiss; row returns to idle preset state.
7. Background the tab during a running timer for >30 seconds. Return. Countdown reflects wall-clock elapsed, not throttled interval count.
8. Exit cook mode (toggle or ESC). Timer resets to idle.
9. Sepia mode: preset row, timer, and DurationToken underline all read correctly in warm tones.
10. Try a sparse step like "Stir gently for a moment" — no duration token rendered (no number).
11. Try the reject-list cases by hand: "Every 5 minutes stir" and "After 10 minutes" should render plain text in cook mode.

### Deferrable if Phase 4 runs long

- Custom timer input. Ship with only the 6 presets; add custom in a follow-up. Loses flexibility but presets cover the 80% case.
- Done-state pulse animation. Ship with just the sound + label change. Less celebratory.
- The visibility-throttle wall-clock fix. Most users keep the tab focused during cook mode; ship without it but file an issue. (NOT recommended — easy to fix and the bug is real.)

Hard floor: the timer must `start / pause / reset / done` correctly, and at least preset-based seeding must work. Duration tokens are technically deferrable to Phase 4.5 if the regex gives trouble, but the brief is explicit that this is part of the v1 cut.

---

## Cross-phase quality bar

- No em dashes (—) in any user-facing string. Searchable: `grep -n '—' components/recipe/ components/RecipeDetail.tsx` should return zero hits.
- All images via `next/image` with `sizes`. The recipe hero already does this; the rich recipe's hero must too.
- The only postal-feeling element on the page is `AttributionLine`. No stamps, no postmarks, no Cutive Mono headers anywhere else. (Cutive Mono CSS var stays available; just don't use it.)
- Both parchment and sepia walked end-to-end at the end of each phase.
- Standalone page AND intercepting modal walked end-to-end at the end of each phase.

## Out of scope (explicitly)

Per the brief and the user's anti-goals:
- Per-step structured timers beyond what the page timer + tappable durations provide.
- Author-level escapes for duration regex (backticks). Defer until we see false positives.
- Per-step-group headnotes. Defer; the shape supports it.
- Nested sub-recipes inside ingredient groups.
- Magazine-style full rethink. We are evolving the cookbook spread.
- A separate `/cook/[slug]` route.

If any of these come up during execution, push back and revisit the brief.
