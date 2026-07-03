---
name: writerecipe
description: Use when adding or replacing a real recipe in nieves-kitchen — authoring a data/recipes/<slug>.ts file and seeding it to Supabase. Triggered by phrases like "write up this recipe", "add a recipe for X", "I made X, let's add it", or `/writerecipe`.
---

# writerecipe

## Overview

Turns a raw recipe (rough notes, a wall of text, a photo) into a validated,
seeded `data/recipes/<slug>.ts` in the v2 shape, ending where the cook just does
a browser check. Sits on top of the pipeline designed in
`docs/superpowers/specs/2026-06-03-real-recipe-pipeline-design.md`.

This skill exists for **correctness**, not speed: four failure modes pass a
casual eye (and even `recipes:check`) yet ship a broken recipe — a `country`
that doesn't exactly match the GeoJSON name, a `tag` outside `ALL_TAGS`, a
hallucinated image URL, a TS-level error `tsx` transpiles past. The phases below
make those gates non-optional.

**Core principle — reference sources of truth, never snapshot them.** Read the
live source at runtime; never hardcode country names, the tag list, or the field
shape into this file.

| Need | Read at runtime (never copy) |
|------|------------------------------|
| Valid country names | `public/countries-110m.json` → `objects.countries.geometries[].properties.name` |
| Valid tags | `ALL_TAGS` in `lib/filters.ts` |
| Field shape / tiers | `data/recipes/_types.ts` (`RecipeInput`) |
| Allowed image domain | `next.config.ts` `images.remotePatterns` + CSP `img-src` |
| Voice + structure example | `data/recipes/classic-lasagna.ts` |
| Stamp status | `scripts/lib/stamp-coverage.ts#stampStatusForCountry` |

## When to use

- `/writerecipe`, or "write up this recipe", "add a recipe for <X>", "I made <X>,
  let's add it", "replace the <X> recipe".

**Do NOT use for:**
- Generating a country stamp (that's `ingeststamp`).
- The launch cutover (`delete from recipes where slug like 'mock-%'`).
- Committing — never `git add`/`commit` unless the user asks.

## The procedure

### Phase 0 — Batch check
If the cook hands over more than one recipe, run Phases 1–5 per recipe (one file
each), then run Phase 6 (seed) **once** at the end. `seed:recipes` upserts the
whole `data/recipes/` directory in one call, so a burst costs one seed.

### Phase 1 — Intake (hybrid)
Accept whatever form the recipe arrives in. Read `data/recipes/_types.ts` and
parse what's given into the **Core** tier: `title`, `country`, `category`,
`difficulty`, `servings`, `time` (`active`/`total`/`resting`), `yield`, `tags`,
`ingredients` (grouped), `steps` (grouped). Then interview **only for missing or
ambiguous Core fields**. Never re-ask what was already given.

### Phase 2 — Halal pass
Scan ingredients and steps for alcohol (wine, mirin, cooking sake, vanilla
*extract*, beer batter, etc.), pork/lard, and other non-halal items. Flag each
and propose a halal swap. Do not write the file until every flag is resolved.
Never silently ship non-halal. Voice: confident, sell the taste, never fabricate
a ruling.

### Phase 3 — Derive (you compute), with hard gates

- **`country` — HARD GATE.** Validate against the actual GeoJSON, do not trust
  memory:
  ```bash
  node -e "const t=require('./public/countries-110m.json'); const names=t.objects.countries.geometries.map(g=>g.properties.name); const c=process.argv[1]; console.log(names.includes(c) ? 'OK '+c : 'NO MATCH. Closest: '+names.filter(n=>n.toLowerCase().includes(c.toLowerCase().slice(0,4))).join(', '))" "<Country>"
  ```
  Require an exact match. The US is `"United States of America"` (NOT "United
  States"/"USA"); the UK is `"United Kingdom"`. On no match, surface the closest
  names and stop — a non-matching country has no map marker and never resolves.

- **`tags` — closed vocabulary, explicitly approved.** Read the live list:
  ```bash
  node -e "const m=require('fs').readFileSync('lib/filters.ts','utf8'); console.log(m.match(/tags: \[[^\]]*\]/g).join('\n'))"
  ```
  Propose only on-list tags that genuinely fit (honor any tags the cook stated).
  Surface them as their own approval line in Phase 4/5, e.g.
  `Tags: vegetarian, high-protein, budget-friendly, one-pot — approve?`. Never an
  off-list tag; if a concept is missing, flag extending `TAG_GROUPS` in
  `lib/filters.ts` as a deliberate separate edit and confirm first.

- `region` — one of the 11 `CulinaryRegion` values (DB CHECK-constrained).
- `coordinates` — `{ lat, lng }` inside the country.
- `nutrition` — **per-serving** estimate (the UI multiplies by servings; never
  give totals).
- `flavorProfile` — integer **0–5** per axis (sweet/salty/sour/bitter/umami/spicy).
- dietary booleans — from the *final, halal-resolved* ingredients.
- **time sanity** — `time.total >= time.active`; resting fits within total.

### Place and influences (post-2026-07-03 pivot)

- `country`/`region`/`coordinates` are now OPTIONAL, but all-or-nothing:
  provide all three (a dish with a home; `country` is the PRIMARY influence
  and earns the passport stamp) or none (an origin-less everyday recipe —
  it will not appear on the atlas and never stamps a country, by design).
- `influences?: string[]` — every country that shaped the dish, world-atlas
  names, primary first. Defaults to `[country]`. Set explicitly for fusion
  dishes (e.g. `['China', 'Italy']` for dumpling lasagna). The atlas shows
  the recipe under every influence; only `country` stamps.
- `isSunnah?: boolean` — ONLY for dishes from the Prophet's ﷺ table with a
  real citable source (never guess; see the halal sourcing rules).
- `featuredIngredients?: string[]` — pantry-entry slugs (phase 2 consumer);
  leave off until the pantry exists.

### Phase 4 — Editorial draft (voice), single approval
Draft `quote` (required), `description`, `attribution`, `headnoteIngredients`,
`headnoteInstructions`, `equipment`, `tips`, `substitutions`, `variations`,
`storage`, `dropcap`, and `isFusion`/`inspiredBy` when relevant. Match
`data/recipes/classic-lasagna.ts` for structure and register. Voice: warm,
considered, well-traveled. **No em dashes in any user-facing string** (fine in
this skill / comments / commits, never in recipe copy).

### Phase 5 — Slug + file write, with collision branch
- **`slug` — collision branch.** Propose a descriptive slug (not necessarily
  title-kebab). Check for an existing file:
  ```bash
  ls data/recipes/<slug>.ts 2>/dev/null && echo "EXISTS — confirm edit/replace" || echo "new slug"
  ```
  Seeding is `upsert` on conflict slug, so a reused slug **silently overwrites** a
  live recipe. New slug → write a new file. Existing → confirm intentional
  edit/replace, then `Edit` the existing file.
- **Image.** Pick an `images.unsplash.com` URL (`?w=1200&q=80`, the only
  allowlisted domain). Verify it resolves before writing:
  ```bash
  curl -sI -o /dev/null -w "%{http_code}" "<url>"
  ```
  Expect `200`. If not, ask the cook for a URL. Set `imageIsStock: true`.
- **Authoring conventions** (match the gold-standard file): author amounts in
  metric base weights (`g`, `ml`) + standard spoon/cup units; do NOT hand-set
  `metricAmount`/`metricUnit` (`lib/units.ts` converts). "to taste" →
  `{ amount: 0, unit: '' }`; count items → `{ amount: 1, unit: '' }`. End with
  `export default recipe;` typed `const recipe: RecipeInput = { ... }`.
- Present the whole file for one approval pass.

### Phase 6 — Seed for the cook
After approval, run this yourself (service key is in `.env.local`). Once per
session, after the last file:
1. `npm run typecheck` — the real correctness gate (`tsx` transpiles past TS
   errors; this catches them, and matches CI).
2. `npm run recipes:check` — offline validation through `DbRecipeSchema`.
3. `npm run seed:recipes` — upsert on conflict slug.
4. `npm run recipes:check` — idempotency confirmation.
5. Read the stamp-coverage report from the seed output.

### Phase 6.5 — Stamp gap: loud + durable (only if any recipe is not approved)
Every recipe must have a stamp, and the cook may not re-read the chat. So a
missing/needs-replacing stamp is surfaced two ways:
1. **Durable record first.** Ensure each affected country is tracked in
   `docs/stamps/CHECKLIST.md` as outstanding (`[ ]` missing, `[~]` exists but not
   approved). Add a line under the right section if absent. This is the permanent
   record `--require-stamps` reads.
2. **Unmissable banner last** (see Phase 7).

### Phase 7 — Handoff
Report what was written + seeded, then the "needs real photo" list, then — if any
stamp is not approved — the banner **last** so it is the final thing on screen:

> ⚠️ **STAMP NEEDED — recipe is live but has no approved stamp**
> • <Recipe> → **<Country>** (status: missing)
> Run `/ingeststamp` for <Country> before launch. Recorded in CHECKLIST.md.

Hand the browser check to the cook. Never `git add`/`commit` unless asked.

## Quick reference

| Phase | Action | Hard gate |
|-------|--------|-----------|
| 0 | Batch? run 1–5 per recipe, seed once | — |
| 1 | Intake freeform → Core, interview gaps | — |
| 2 | Halal scan | No non-halal in final file |
| 3 | Derive region/coords/nutrition/flavor/diet | `country` exact-matches `countries-110m.json`; tags ∈ `ALL_TAGS`; `total >= active` |
| 4 | Draft editorial + propose tags | No em dashes; tags as own approval line |
| 5 | Slug + write file + image | Slug-collision confirmed; image `images.unsplash.com` + `200` |
| 6 | typecheck → check → seed → check | typecheck + check pass before seed |
| 6.5 | If stamp not approved: CHECKLIST.md + banner | Durable record before reporting |
| 7 | Report + handoff (stamp banner last) | No commit unless asked |

## Common mistakes

| Mistake | Symptom | Fix |
|---------|---------|-----|
| Trusted memory for `country` | No map marker; never resolves | Match exactly against `countries-110m.json` (US = "United States of America") |
| Off-list tag | Not filterable | Use only `ALL_TAGS`; extend `TAG_GROUPS` deliberately |
| Hallucinated image URL | Broken image | `curl -sI` expect `200`; else ask the cook |
| Skipped `typecheck` | Type error ships | Always typecheck before seeding |
| Reused a slug | Silently overwrote a live recipe | Check `data/recipes/*.ts` first; confirm edit vs. new |
| Hand-set `metricAmount` | Double-converted units | Author metric base; let `lib/units.ts` convert |
| Em dash in copy | Off-brand text | No em dashes in user-facing strings |
| Gave total nutrition | Inflated macros | Per-serving only |
| Stamp gap only mid-chat | Cook skims past; ships stampless | CHECKLIST.md record + banner last |

## Related context

- Pipeline design: `docs/superpowers/specs/2026-06-03-real-recipe-pipeline-design.md`
- Skill design: `docs/superpowers/specs/2026-06-13-writerecipe-skill-design.md`
- Field shape: `data/recipes/_types.ts`; gold-standard: `data/recipes/classic-lasagna.ts`, `data/recipes/xinjiang-lamb-dumplings.ts`
- Seed + flags: `scripts/seed-recipes.ts` (`recipes:check`, `recipes:verify`)
- Stamp status: `scripts/lib/stamp-coverage.ts`, `docs/stamps/CHECKLIST.md`, `lib/passport-stamps.ts`
- Stamp creation: `ingeststamp` skill
- Memories: `feedback_halal_no_alcohol`, `feedback_halal_trust_voice`, `feedback_no_em_dashes`, `project_nutrition_convention`, `feedback_seed_for_the_cook`
