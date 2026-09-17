# Real-Recipe Authoring & Seed Pipeline

**Date:** 2026-06-03
**Status:** Design approved, pending spec review

## Problem

The catalog is currently mock recipes. Some (classic lasagna, dumpling lasagna,
garlic prawn spaghetti, honey garlic salmon) correspond to recipes the cook
actually makes, but their ingredients/steps/details are wrong. The cook wants to
replace these with real recipes so the site can be shared publicly, while:

- staying organized as the catalog grows to many recipes,
- doing as little manual work per recipe as possible (ideally just hand over the
  raw recipe text),
- automating everything that can be automated,
- working within the existing Supabase-backed architecture.

## Decisions (locked)

| Decision | Choice |
|----------|--------|
| Source of truth | Recipe files live in the repo (git); a seed script upserts them to Supabase. |
| Editorial voice | Claude drafts all editorial fields in the brand voice; the cook approves/tweaks. |
| Nutrition | Claude estimates per-serving values from ingredients; UI gains an "approx." label. |
| Photos | Stock images now (remote Unsplash URLs); swap to the cook's own photos later. Seed prints a backfill list. |
| File structure | One TypeScript file per recipe (`data/recipes/<slug>.ts`), typed via `RecipeInput`. |
| Hand-off style | One recipe at a time, conversationally; Claude produces the file, cook reviews. |
| Build timing | Build the pipeline now and convert one real recipe end-to-end as proof. |
| Stamp coverage | Every recipe's country must have an approved (`[x]`) custom stamp. The seed script reports coverage and can hard-block publishing via `--require-stamps`. |

## Field ownership reference

Every recipe is one row in `public.recipes`. Fields split three ways:

**Core (only the cook can provide):** `title`, `country` (must match `world-atlas`
`properties.name`), `category`, `ingredients` (grouped), `steps` (grouped),
`time_active`/`time_total`/`time_resting`, `servings`, `yield`, `difficulty`,
`tags`.

**Derived (Claude computes):** `region` (one of 11, DB CHECK-constrained),
`coordinates`, `nutrition` (per-serving estimate), `flavor_profile`, the four
dietary booleans, `slug` (from filename), `image_url` (stock for now).

**Editorial (Claude drafts, cook approves):** `quote` (required pull-quote),
`description`, `attribution`, `headnote_ingredients`, `headnote_instructions`,
`equipment` (this is the "materials" section the cook remembered — it is
`EquipmentList`, rendered conditionally and simply never populated on the flat
mocks), `tips`, `substitutions`, `variations`, `storage`, `dropcap`,
`is_fusion`, `inspired_by`.

## Architecture

### 1. `data/recipes/` folder

- `data/recipes/_types.ts` — defines `RecipeInput` (camelCase, mirrors the app
  `Recipe` shape minus `id`/`slug`/`created_at`). Editorial and optional fields
  are optional; required fields are required so `typecheck` enforces them.
- `data/recipes/<slug>.ts` — one per recipe, `export default { ... } satisfies RecipeInput`.
  Slug is derived from the filename and is the single source of the slug.
- `_`-prefixed files are helpers, skipped by the loader.

`RecipeInput` (camelCase) is converted to the snake_case DB row by an
`inputToRow(slug, input)` function (co-located in `_types.ts` or the seed
script), which also applies DB defaults (`dropcap: false`, `time.resting ?? 0`,
`imageIsStock` defaulting to `true`, nullable fields coalesced).

`imageIsStock?: boolean` (default `true`) marks recipes still using a stock
placeholder so the seed can report which need real photos.

### 2. `scripts/seed-recipes.ts` (npm `seed:recipes`)

Mirrors `seed:mock`: `tsx scripts/seed-recipes.ts`, reads `.env.local`, requires
`SUPABASE_SERVICE_ROLE_KEY`. Steps:

1. Read every `data/recipes/*.ts` (skip `_`-prefixed), dynamic-import each,
   filename → slug.
2. `inputToRow(slug, input)` → snake_case row with defaults applied.
3. Validate each row through the existing `DbRecipeSchema` (zod, `lib/types.ts`).
   On any failure: print the offending file + zod error and **abort before any
   write** (no partial seed).
4. `upsert(rows, { onConflict: 'slug' })` — idempotent; re-running updates.
5. Print summary count + a "needs real photo" list (every recipe where
   `imageIsStock !== false`).

### 3. Per-recipe loop (the cook's workflow)

1. Cook pastes a recipe: title, country, ingredients, steps, tags (photo optional).
2. Claude writes `data/recipes/<slug>.ts`: structures groups, looks up region +
   coordinates, estimates nutrition + flavor profile, sets dietary flags, drafts
   editorial copy in the brand voice, attaches a stock image.
3. Claude runs `npm run typecheck` to confirm it compiles.
4. Cook reviews the file (or `npm run dev` to see it rendered) and tweaks copy.
5. Claude checks stamp coverage for the recipe's country. If it's not an
   approved `[x]` stamp, that's flagged so a stamp is rendered/ingested (via the
   `ingeststamp` skill) before the recipe is considered launch-ready.
6. When a batch is ready: `npm run seed:recipes` (or `--require-stamps` to gate
   on approved stamps).
7. Photo swap later: drop a WebP in (`public/recipes/` via the image pipeline, or
   a Supabase storage bucket), set `image` + `imageIsStock: false`, re-seed.

### 4. Coexistence + launch cutover

Real recipes use real slugs (no `mock-` prefix), so they coexist with the seeded
mocks without collision. `seed:mock` and `NEXT_PUBLIC_USE_MOCK_DATA` stay
untouched for local dev. Launch cutover is one SQL statement run against
Supabase: `delete from recipes where slug like 'mock-%';`.

### 5. Stamp coverage (passport guarantee)

Stamps are keyed by **country**, not recipe (`lib/passport-stamps.ts#CUSTOM_STAMPS`),
so all recipes from one country share its stamp. The cook's hard requirement: no
recipe may reach the public site whose country lacks an approved stamp.

Status of a country is derived from two sources:
- `CUSTOM_STAMPS` — whether a custom WebP asset is registered at all.
- `docs/stamps/CHECKLIST.md` — `[x]` (approved, current look), `[~]` (exists but
  pre-redesign / not the wanted version), `[ ]` (none).

A recipe's country resolves to one of:
- **APPROVED** — in `CUSTOM_STAMPS` and `[x]` in the checklist.
- **NEEDS REPLACING** — in `CUSTOM_STAMPS` but `[~]` (or `[ ]`) in the checklist.
- **MISSING** — not in `CUSTOM_STAMPS` (only the procedural fallback renders).

`scripts/lib/stamp-coverage.ts` parses the checklist and reads `CUSTOM_STAMPS`,
exposing `stampStatusForCountry(country)`. The seed script prints a coverage
report grouped by these three states. A `--require-stamps` flag makes the seed
**abort** if any recipe is not APPROVED — the gate to run before the public
launch cutover. Default (no flag) warns but proceeds, so recipes can be authored
before their stamp is finalized.

Country-name matching is case-insensitive and trimmed. A recipe whose country
matches no checklist entry or `CUSTOM_STAMPS` key is reported as MISSING for
manual review (handles e.g. world-atlas's "United States of America" vs the
`united states` stamp key). New stamps are produced/ingested via the existing
`ingeststamp` skill, which also flips the checklist.

### 6. Follow-ups (separate, non-blocking)

- **"approx." nutrition label** in the UI wherever nutrition renders (`InfoStrip`,
  recipe card). Small additive change, honest framing of estimates.
- **Photo backfill** is surfaced by the seed script output; no separate tracking
  file needed.

## Validation & correctness

- Compile-time: `satisfies RecipeInput` + `npm run typecheck` catches shape errors
  per recipe before runtime.
- Runtime/seed-time: `DbRecipeSchema.safeParse` per row, abort-on-failure, so a
  malformed recipe can never partially seed or reach the app (the app also
  re-validates at the Supabase read boundary via `useRecipes`).

## Out of scope

- No Markdown-with-frontmatter authoring (ingredient-string parsing is lossy).
- No bulk/spreadsheet import (hand-off is one-at-a-time conversational).
- No admin UI for recipe editing.
- Real nutrition measurement (estimates only, labeled).
- Real photography (stock placeholders; backfill later).

## First implementation slice

Build `data/recipes/_types.ts`, `scripts/seed-recipes.ts`, the npm script, then
convert one real recipe end-to-end (e.g. classic lasagna) as proof. The real
recipe content must come from the cook, since the existing mock details are
known to be wrong.
