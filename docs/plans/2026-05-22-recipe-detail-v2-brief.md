# Design Brief — Recipe Detail Page (v2)

Status: FINAL, signed off 2026-05-22.
Source: `/shape` discovery session.

## 1. Feature Summary

The recipe detail page is the spine of Nieves Kitchen — the single surface where browsing turns into cooking. v2 evolves the existing cookbook spread to handle real, detailed recipes (intro paragraph, attribution, equipment, dietary metadata, ingredient groups, step groups with headnotes, variations, multiple time fields) and adds a Read ↔ Cook toggle so the same page works for both relaxed evening browsing and hands-on counter-cooking. Schema is designed to tolerate messy input from mixed authoring (hand-written, AI-assisted drafts, transcribed cookbook recipes) while the rendered output stays editorial.

## 2. Primary User Action

Read the recipe well enough to commit to cooking it — and then actually cook from it. Every other action (favorite, copy, log a stamp, scale servings, set a timer) is secondary to that arc.

## 3. Design Direction

Anchored in the brand's three pillars (editorial cookbook · passport-postal accents · Nordic restraint) — leans hardest on **editorial cookbook**:

- **Voice in three layers:** italic pull-quote (Literata) → editorial intro paragraph (description, 2–4 sentences, optional drop cap) → optional section headnotes above Ingredients and above Instructions (Literata italic, indented).
- **Attribution as a postal line:** Cutive Mono small caps, single line beneath the intro. The only place the postal palette touches this page.
- **Two-column spread preserved:** Ingredients (340px column, left) and Instructions (fluid, right) remain the heart. Ingredient sub-groups and step groups layer into the rhythm, they don't restructure it.
- **Cook mode is a quieted version of the same page,** not a different one. Same hero shrinks to a sticky ribbon, editorial chrome hides, type scales up (~1.25×), wake-lock activates, and a sticky bottom step-card houses the current step + the page timer.

Warm restraint throughout. Sepia mode locks the page to leather-bound-book tones; parchment stays the default for browsing.

## 4. Layout Strategy

```
┌──────────────────────────────────────────────────┐
│  ◂ All Recipes                                   │
├──────────────────────────────────────────────────┤
│  [ HERO IMAGE — 320–420px ]                      │
│  FUSION · Country · Inspired by …                │
│  Title                          [Copy] [♥]       │
├──────────────────────────────────────────────────┤
│  "Italic pull-quote in Literata."                │
│                                                  │
│  Drop-cap intro paragraph (description),         │
│  2–4 sentences, max-prose, generous leading.     │
│  ─── Adapted from Claudia Roden · 1968 ───       │
├──────────────────────────────────────────────────┤
│  [ INFO STRIP ]                                  │
│   Active 30m · Total 2h · Rest 1h · Hard         │
│   Yield: 12 dumplings · Serves 4                 │
│   ◦ Vegetarian  ◦ Gluten-Free                    │
│                                                  │
│  ┌─ Nutrition (per serving) ─┐  ┌─ Flavor ──┐    │
│  │  cal · pro · carb · fat   │  │ compass   │    │
│  └──────────────────────────┘  └───────────┘    │
│   tag · tag · tag                                │
├──────────────────────────────────────────────────┤
│  [ EQUIPMENT ]  (only when populated)            │
│   Tagine · Mortar & pestle · Fine-mesh sieve     │
├──────────────────────────────────────────────────┤
│ ── headnote: ingredients sourcing tip ──         │
│                                                  │
│  INGREDIENTS  [US/Metric] [− 4 +]   INSTRUCTIONS │
│                                                  │
│  For the dough                       Make the dough
│   ☐ 300 g flour                       ☐ 1. … (20 minutes)
│   ☐ …                                 ☐ 2. …    │
│                                                  │
│  For the filling                     Sear        │
│   ☐ …                                 ☐ 3. …    │
│                                       ☐ 4. …    │
│  [Copy ingredients]                  Braise      │
│                                       ☐ 5. … (1 hour)
│                                                  │
│ ── headnote: method framing ──                   │
├──────────────────────────────────────────────────┤
│  [ Variations ]    [ Substitutions ]             │
│  [          Storage & Reheating         ]        │
│  [               Tips                   ]        │
├──────────────────────────────────────────────────┤
│            [ I cooked this ]                     │
└──────────────────────────────────────────────────┘
```

Notes:
- **Ingredient groups:** small Literata heading per group ("For the dough") with subtle rule beneath. Single ungrouped recipes render with no heading at all.
- **Step groups:** group heading above the numbered steps within that group. Extra vertical space between groups for rhythm.
- **Headnotes:** italic Literata, indented, sit above the column header.
- **Info strip:** consolidates Active/Total/Rest time, yield, servings, dietary badges (quiet circle + label), nutrition, flavor compass, tags. Rest chip omitted if 0. Dietary badges only render for `true` flags.
- **Equipment:** compact inline list ("Tagine · Mortar · Sieve") above Ingredients. Hidden when empty so simple recipes don't get padding.
- **Tappable durations in step prose:** mentions like "5 minutes", "20–30 minutes", "1 hour" get a subtle dotted underline. Cook mode only — in read mode they render as plain text. Tap → seeds the page timer with the lower bound of the range and starts it.
- **Variations** mirrors Substitutions in a sibling 2-up grid. Storage and Tips remain full-width below.
- **Read↔Cook toggle:** sticky pill, top-right of the spread, becomes visible after scrolling past the info strip.

## 5. Key States

| State | What renders |
|---|---|
| **Default (read mode, full)** | Everything above. |
| **Sparse recipe** (no intro, no attribution, no equipment, no headnotes, no groups, no variations) | Collapses cleanly. No empty cards, no empty headings, no placeholders. |
| **Cook mode** | Hero collapses to 56px sticky ribbon (title + country + ✕). Quote, intro, attribution, info strip, equipment, supplementary cards all hidden. Ingredients + Instructions remain, scaled up. Sticky bottom card houses [current step text · timer · ✓ Done · Next →]. Wake-lock active. Tappable durations active. |
| **Timer running** | Sticky bottom card shows mm:ss countdown + pause + reset. Visual flash + sound when finished; "Timer done" state persists until acknowledged. Setting a new timer replaces the running one. |
| **Mid-cook (checkboxes ticked)** | Existing strike-through + opacity dim. State persists via `useCookProgress`. |
| **Modal context** (intercepting route) | Same component, `inModal=true`. Cook toggle still works inside the modal. |
| **Loading / Not found / Sepia** | Existing patterns hold. |

## 6. Interaction Model

**Reading flow:** scroll through hero → quote → intro → attribution → info → equipment → spread → supplementary → cooked-button. Servings stepper (1–24) rescales ingredients AND nutrition live. US/Metric toggle persists. Copy Recipe preserves group headings and step groups. Checkboxes scoped per-recipe. Favorite (♥) + "I cooked this" unchanged.

**Cook-mode flow:**
- Toggle pill → 250ms cross-fade, no jump.
- Wake-lock on enter, released on exit/navigation/visibility-hide.
- Sticky bottom card shows the current uncompleted step. [Done] checks + advances; [Next] advances without checking.
- **Page timer** lives inside the sticky card. Quick presets (1m, 5m, 10m, 15m, 30m, 1h) + custom. Start/pause/reset. One timer at a time; setting a new one replaces.
- **Tappable durations** in step prose seed the timer on tap and start it immediately. Subtle dotted underline indicates tappability. Hidden in read mode.
- Auto-surface the "I cooked this" stamp prompt as the sticky card once the final step is checked.
- Exit cook mode via toggle / ESC / browser back. State persists.

**Discovery:** Cook toggle visible only after scrolling past the info strip. First-time users meet the page as a cookbook, not a tool.

## 7. Content Requirements

**New schema fields:**

| Field | Shape | Required | Notes |
|---|---|---|---|
| `description` | text, 2–4 sentences | optional | Editorial intro, distinct from `quote`. |
| `attribution` | text, single line | optional | "Adapted from X · Year" or "From my grandmother". |
| `time.active` | int (minutes) | required | Hands-on time. Defaults to existing prep+cook on migration. |
| `time.total` | int (minutes) | required | Wall-clock. |
| `time.resting` | int (minutes) | optional | Inactive time. Omitted from UI if 0. |
| `yield` | text, free-form | optional | "12 dumplings", "1 loaf", "750 ml". Falls back to `${servings} servings`. |
| `equipment` | text[] | optional | Non-obvious tools. Hidden when empty. |
| `isVegetarian` `isVegan` `isGlutenFree` `isDairyFree` | boolean | required (default false) | Quiet badges in info strip. Source of truth for filtering. |
| `ingredients` | `{ heading?: string, items: Ingredient[] }[]` | required | Migration: existing flat arrays → single group with no heading. |
| `steps` | `{ heading?: string, headnote?: string, items: string[] }[]` | required | Same migration shape. |
| `headnoteIngredients` | text | optional | Italic note above Ingredients column. |
| `headnoteInstructions` | text | optional | Italic note above Instructions column. |
| `variations` | text[] | optional | Card sibling to Substitutions. |

**Per-serving nutrition convention:** stored per-serving. Documented in JSDoc on `Nutrition`. Detail page multiplies by `servings` directly. Behavior change from today — need a data migration if any non-mock recipes exist (currently none).

**Microcopy:**
- Cook-mode toggle: "Cook mode" / "Read mode".
- Timer presets: "1m · 5m · 10m · 15m · 30m · 1h · Custom".
- Timer done state: "Timer done, tap to dismiss" with subtle pulse.
- Yield display: "Makes {yield} · Serves {servings}" when both present; "Serves {servings}" alone otherwise.
- Time chip format: "Active 30m · Total 2h · Rest 1h" (drop Rest when 0).
- Dietary badges: small filled circle + label ("Vegetarian", "Vegan", "Gluten-Free", "Dairy-Free").
- Empty fields render nothing, no placeholders, no "—".

**Tappable duration regex (must be accurate, conservative is better than aggressive):**

- Match: `\d+\s?(seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h)\b` and ranges `\d+\s?[–-]\s?\d+\s?(units)`.
- Match only when preceded by cooking verbs/prepositions in a small allowlist: `for`, `cook`, `bake`, `simmer`, `roast`, `boil`, `fry`, `steam`, `rest`, `marinate`, `chill`, `proof`, `until`, `about`, `approximately`, `roughly`, plus sentence-start.
- Reject when preceded by: `before`, `after`, `every`, `each`, `in`, `within`, `over the next`. These indicate positional/frequency timing, not a duration to count.
- For ranges (`20–30 minutes`), seed the timer with the **lower bound**. The cook checks visually after that; starting at the upper bound risks overcooking.
- One tap = pre-fill timer + start immediately (cook mode is a high-intent context, no preview/confirm step needed).
- Don't render any indicator in read mode. Tappability is cook-mode only.

## 8. Recommended References

- `reference/typography.md` — drop cap, Literata/Figtree/Cutive Mono distribution, attribution treatment.
- `reference/spatial-design.md` — vertical rhythm with new sections, info strip composition, group spacing.
- `reference/motion-design.md` — Read↔Cook cross-fade, sticky step-card entrance, timer states.
- `reference/interaction-design.md` — wake-lock pattern, sticky step-card, timer affordance, tappable-duration UX.
- `reference/responsive-design.md` — cook mode on phone/tablet on a counter is the dominant cook context.

## 9. Open Questions (for implementation)

1. **Schema migration mechanics.** Add new columns; convert `ingredients` and `steps` to grouped shape. Confirm no production recipes exist (all mocks) — if so, breaking change is free.
2. **Drop cap implementation.** `::first-letter` is fragile across fonts; manual `<span>` wrap controlled by a per-recipe `dropcap` boolean is safer.
3. **Tappable duration regex.** Start conservative, log false-positive complaints if any during the first 10 real recipes. Add author-level escape (backticks) only if needed.
4. **Wake-lock fallback.** iOS Safari got it recently. For older devices, show "screen may dim" hint rather than blocking cook mode.
5. **Sticky step-card on desktop.** Pinning to viewport bottom on a 27" monitor feels odd. Consider pinning to the right column on wide screens.
6. **Timer sound asset.** Pick something warm, not harsh — a soft bell or wooden tone, not a kitchen-buzzer beep. Respects the brand voice.
7. **"I cooked this" auto-surface in cook mode.** When the last step is checked, the sticky card morphs into the stamp CTA. Confirm the transition feels celebratory but not jarring.
8. **Headnotes per step-group later.** The shape `{ heading, headnote, items }` already accommodates it. Defer until you've written 10 real recipes and seen if you want them.

## Discovery decisions (for context)

- Authoring: mix of hand-written + AI-assisted + transcriptions. Schema tolerates messy input.
- Cooking from page: yes, hands-on. Cook mode is in scope.
- Editorial voice: three layers (pull-quote, intro paragraph, section headnotes).
- Headnote placement: above Ingredients AND above Instructions. Not per step-group in v1.
- Step content: prose only. No structured per-step timers.
- Page evolution: evolve the cookbook spread, not a full magazine rethink.
- Ingredient grouping: single-level groups. No nested sub-recipes.
- Cook mode shape: toggle on the same page (Read ↔ Cook). Not a separate route.
- Equipment + dietary flags: added back to v1 (cheap, high value).
- Timers: dropped chip auto-detection; ship a single page-level timer in cook mode + tappable durations in step prose that seed it.
