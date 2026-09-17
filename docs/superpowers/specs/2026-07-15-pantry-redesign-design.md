# Pantry redesign — design spec

**Date:** 2026-07-15
**Status:** design locked (via `/dev/pantry-v2` prototype), pending implementation
**Prototype:** `app/dev/pantry-v2/page.tsx` (mock data, inline hex; the real build uses theme tokens)

## Goal

The current pantry (`components/pantry/PantryShelf.tsx`) is a minimal grid of etched
cards + a detail overlay. Make it more engaging, intuitive, and useful, and add a
second job: **cook from what I have**. The pantry should let a cook (a) browse
ingredients and read about them, especially Sunnah foods, and (b) select the
ingredients they own and get the recipes they can make.

## Structure: one page, two modes

A header band (cobalt, brass italic "Pantry") with a two-chip toggle:

- **The shelf** — browse ingredients (default)
- **Cook from what I have** — checklist → ranked recipe matches

A "The Prophet's ﷺ table" filter (brass keystone) narrows to Sunnah foods; it appears
in both modes.

## Browse — variant A (accordion + in-place reading spread)

Chosen over a full-width tile grid (variant C) because it stays fast (live swap, no
open/close) and the accordion caps list height as the pantry grows, so it never
becomes an endless left column with an empty right pane.

- **Left index (~300px):** ingredients grouped by shelf kind, rendered as an
  **accordion** — one group expanded at a time, each header showing its count. A
  brass keystone marks Sunnah rows. **No `tag` subheadings** (e.g. no "the quick
  answer").
- **Right reading spread:** the selected ingredient, updated in place.

### Reading spread — content, in order

1. Kind eyebrow + name (Fraunces display)
2. **Note** (existing margin-note voice) + **standalone plinth art** (current
   treatment, NOT an arch), side by side
3. **Good for you** — 2–3 short labelled benefit points (pill chips). Shown for
   ANY ingredient when there is something genuinely worth saying; omitted otherwise.
4. **From the Prophet's ﷺ table** — set-apart hadith/Qur'an block (Sunnah foods
   only). Label carries the ﷺ glyph.
5. **Cook with it** — recipe cards that feature this ingredient.

## Cook from what I have — checklist

- **Left:** the same ingredient list with checkboxes, grouped by kind, plus a
  "N ticked" counter and Clear.
- **Right:** ranked results as compact, scannable rows: recipe + "you have X of Y",
  a **Ready** badge when all featured items are owned, and a "1 more: <name>"
  near-miss line otherwise. Empty state and no-match state as in the prototype.
- **Matching basis:** each recipe's `featuredIngredients` (the pantry items a recipe
  leans on), because the pantry tracks ~a dozen-plus ingredients, not a full
  inventory. This answers "what can I lean on my pantry to cook," not "do I own
  literally every ingredient." Do not over-promise it as a full inventory match.

## Data model changes (`data/pantry/_types.ts`)

- Add `benefits?: string[]` to `PantryEntry` (2–3 short strings; present only when
  worth saying).
- Add a new `PantryKind`: **`'vegetables & greens'`** (houses cucumber, pumpkin),
  inserted into `KIND_ORDER` after `'grains & staples'`.
- `prophetic` stays `{ note; citation }`; an optional short `quote` may be added if
  we want the pull-quote treatment from the prototype (decide at build).

## Ingredients

New this round (author `data/pantry/<slug>.ts`, then ink art via `/addpantry`):

| Ingredient | Kind | Sunnah? | Basis (verify verbatim on sunnah.com/quran.com before ship) |
|---|---|---|---|
| Figs | fruits & sweetness | yes | Qur'an, Surah at-Tin 95:1 ("By the fig and the olive") |
| Pumpkin (gourd) | vegetables & greens | yes | Anas, Sahih al-Bukhari ~5433 (the Prophet ﷺ loved gourd/dubbā') |
| Cucumber | vegetables & greens | yes | Abdullah ibn Ja'far, Bukhari 5440 / Muslim 2043 (ate with fresh dates) |
| Beef | meat & fish | no | Plain staple. Do NOT mark Sunnah (a weak "beef is disease" narration exists) |

Existing entries to re-check at ship time and likely **promote to Sunnah**:

- **Pomegranate** — named in the Qur'an (e.g. al-An'am 6:99/6:141, ar-Rahman 55:68);
  verify references, then add a Qur'an block.
- **Lamb** — hadith basis for the Prophet ﷺ favouring the shoulder/foreleg of
  sheep; verify the narration, then add a hadith block.

Barley is already treated as Sunnah via **talbina** (Aisha, Sahih al-Bukhari 5417);
frame it as the barley in talbina, not barley grain generically.

## Palette / theming

Courtyard is merged to `main` (PR #5). Build against the existing theme tokens
(`bg-parchment`, `text-brown-dark` = cobalt, `text-terracotta`, `turmeric` = brass,
`--color-cobalt`/`-deep`, `--color-olive`), NOT inline hex, and verify in both the
light theme and the sepia "courtyard at night" dark theme.

## Trust & content rules (non-negotiable)

- ﷺ on every "Prophet's table" label and after "the Prophet"/"his" inline; no
  parenthesised/English-expanded variant.
- Every Sunnah citation verified verbatim against sunnah.com / quran.com before it
  ships; never invent or reword a narration (see `_types.ts` trust rule +
  `lib/halal.ts` discipline).
- `benefits` must be factually accurate and plain — no health hype.
- No em dashes in any user-facing string.

## Mobile

The two-column layouts stack: the index/checklist is the default view; selecting an
ingredient opens the reading spread as a full-screen overlay (reuse the existing
overlay pattern). Cook mode: checklist first, results below.

## Out of scope (YAGNI)

No full-inventory pantry, no quantities, no shopping-list export, no per-recipe
nutrition tables. Just browse + cook-from-what-you-lean-on.

## Open items before ship

1. Ink art for the 7 art-less ingredients (figs, pumpkin, cucumber, beef, bulgur,
   pomegranate, sumac) via the `/addpantry` flow — production shows only entries with
   real art on disk (`landedPantryEntries`).
2. Final sunnah.com / quran.com verbatim verification for every Sunnah entry,
   including the pomegranate + lamb promotions.
3. Confirm `featuredIngredients` coverage on existing recipes so cook-mode matching
   has enough to work with.
