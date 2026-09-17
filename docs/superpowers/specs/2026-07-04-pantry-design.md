# The Pantry — phase 2 design pass

**Date:** 2026-07-04
**Status: APPROVED 2026-07-04.** All picks resolved: card = **variant D "etched"** (A x C hybrid: hairline outline, corner seal, no filled surface); seal = **rosette** (confirmed after comparing seven candidates including shamsa and girih star in the specimen strip); ﷺ = inline glyph, site convention. Placeholder art quality was flagged (expected; the real flat-ink assets replace it via the Sora pipeline, lamb redrawn as a frenched chop). Ready to execute: `docs/plans/2026-07-04-pantry-plan.md`.
**Parent spec:** `2026-07-03-table-pantry-atlas-revamp-design.md` §7 (structure), §6 (data), §10 (voice). This pass decides only what §7 left open: the visual treatment, the launch content batch, and the small integration details.

## 1. What §7 already fixed (not revisited)

Shelf grouped by kind under small-caps headings; no search/filters; everyday working pantry with no prophetic curation to the top; wordless corner seal; entry view as small overlay with margin note, set-apart cited prophetic passage, and "Cook with it"; honest one-line zero-recipe state; one `.ts` file + one ink asset per entry.

## 2. Launch batch — 9 entries, 4 prophetic

| Group | Entries |
|---|---|
| grains & staples | **barley** ﷺ |
| fruits & sweetness | **dates** ﷺ, **honey** ﷺ |
| dairy & eggs | eggs, yoghurt, butter |
| aromatics & preserved | garlic, **olive oil** ﷺ |
| meat & fish | lamb |

Chosen so six of nine have at least one real "Cook with it" recipe today (garlic 3, olive oil 1, eggs/yoghurt/butter 1 each via turkish-eggs, lamb 1), and the three zero-recipe entries are exactly the prophetic staples whose stories carry their cards. Pumpkin, vinegar, black seed, and milk are strong second-batch candidates (all citable) once recipes exist to anchor them.

**Draft citations** (in `/dev/pantry`; every one must be re-verified against sunnah.com before ship — the `lib/halal.ts` rule applies):

- Barley/talbina: Sahih al-Bukhari 5689 (Aisha).
- Dates: Sahih al-Bukhari 5445 (Sa'd ibn Abi Waqqas); optionally Sahih Muslim 2046.
- Honey: Quran, an-Nahl 16:69.
- Olive oil: Jami' at-Tirmidhi 1851 + Quran, an-Nur 24:35. Verify Tirmidhi grading and narrator before publish.

## 3. Card treatment — three candidates at `/dev/pantry`

- **A · Specimen cards (recommended):** bordered card, art centred, small-caps Cutive Mono name, seal in the top-right corner. Museum-drawer feel; the seal reads exactly as "embossed mark in a card corner"; strongest tap affordance. Risk: sparse groups (one card alone) leave visible whitespace — acceptable editorially.
- **B · Ledger rows:** framed art beside name + first line of the margin note + recipe count. Densest and most editorial, but it pre-spends the entry view's content on the shelf and reads closer to a settings list than a pantry.
- **C · Loose sheets:** borderless art floating on the parchment. Maximum Nordic restraint, but the seal loses its "pressed into the card" logic and affordance is weakest.

## 4. Prophetic seal — three wordless marks

Flat brown ink at ~62% opacity, no lettering, legible as "something is special here" at shelf distance and explained only inside the entry view (label + citation).

- **Rosette (recommended):** eight-petal rosette in a thin ring — classic Islamic geometric motif, quietest of the three.
- **Octagon:** notary-style octagon with radial ticks — reads slightly more bureaucratic/passport.
- **Scallop:** blind-emboss scalloped circle — most "notary stamp", busiest at small sizes.

Deliberately avoided: crescents, mosque silhouettes, and the rub' el hizb (a Quranic division marker, not a decoration).

## 5. Entry view (single proposal)

Small centred overlay, shelf visible behind (passport instinct): kind eyebrow (Cutive Mono small caps) → name (Literata) → art → full margin note → if prophetic, a set-apart bordered passage: seal + "From the Prophet's ﷺ table" label, 1–2 sentence note, citation line in Cutive Mono → "Cook with it" with small image rows linking to recipes. Zero-recipe line: *"Nothing on the site cooks with it yet. That will not last."* Escape/backdrop closes; mobile gets the same card at full width.

## 6. ﷺ rendering (to confirm)

Keep the Arabic glyph inline after "the Prophet", exactly as already shipped on `/promise` and in the collections row ("From the Prophet's ﷺ table"). No parenthesised variant, no English expansion; the glyph is the site convention.

## 7. Integrations shipping with phase 2

- **`/pantry` route** — server page shell + client shelf; masthead headline "The Pantry" with a two-line mission note in the margin voice (draft on `/dev/pantry`).
- **Navbar** — add Pantry between Recipes and Atlas (spec §4 order), now that the route exists (no dead links rule).
- **Home pantry-shelf teaser** — 6–8 ink stamps linking to `/pantry`, prophetic ones sealed (spec §5 amendment: ships with phase 2, alongside the real art).
- **FilterPanel collections** — a "Collections" section in both FilterPanel variants: the four collections as single-select toggle chips writing the existing `?collection=` param (already handled by `/recipes`); active chip shows the collection accent. Travels chip deep-links to `/atlas` like the home banner.
- **`featuredIngredients` backfill** — set on the six real recipe files + reseed; `/writerecipe` template gains the field with the pantry-slug vocabulary.

## 8. Art pipeline

Nine flat-ink assets through the established stamp workflow (Sora render → alpha check → cwebp → `public/pantry/<slug>.webp`). Same grammar as stamps: ink impression on transparent, two-tone (brown ink + one accent), no textile/material language, no faces (the lamb is rendered as a cut, not an animal). The `/dev/pantry` inline SVGs are placeholders that also serve as composition briefs for the prompts. Prompts drafted in the implementation plan; user renders and `/ingeststamp`-style ingest follows.

## 9. Out of scope

Dedicated Sunnah page (deferred, designed-for); pantry search/filters; per-entry routes (`/pantry` is one page + overlay; revisit slugs/deep-links only if sharing demand appears); Cook's Journal (phase 3).
