# `writerecipe` Skill Design

**Date:** 2026-06-13
**Status:** Design approved, pending spec review

## Problem

Adding a real recipe today is an ad-hoc, rediscover-it-every-time task. The
pipeline already exists (`data/recipes/<slug>.ts` → `seed:recipes` → Supabase,
designed in `2026-06-03-real-recipe-pipeline-design.md`), but the *operating
procedure* for the per-recipe loop lives only in Claude's head, CLAUDE.md, and
scattered memories. That has two costs:

1. **Silent-broken recipes.** Several failure modes pass a casual eye and even
   pass `recipes:check`, yet ship a recipe that is invisible or degraded in the
   app: a `country` that doesn't exactly match the GeoJSON name (no map marker),
   a `tag` outside `ALL_TAGS` (unfilterable), a hallucinated Unsplash photo ID
   (broken image), a TS-level error that `tsx` transpiles straight past.
2. **Rediscovery after gaps.** The cook adds recipes in bursts (sometimes 3 in a
   week) separated by multi-week gaps. After a gap, the procedure is re-derived
   from scratch, inconsistently.

A skill codifies the mechanical checks (so the silent failures become
non-optional gates) and survives the gaps. This is justified by **correctness**,
not speed.

## Goals

- One predictable entry point to turn a raw recipe into a validated, seeded
  `data/recipes/<slug>.ts`, ending where the cook just does a browser check.
- Make the four silent-failure modes **impossible to skip**.
- Handle a burst: intake several recipes, seed once at the end.
- Draft editorial in the Nieves voice with the house constraints baked in.

## Non-goals

- Re-designing the pipeline (that's the 2026-06-03 doc; this sits on top of it).
- Generating stamps (that's `ingeststamp`).
- Committing to git, or the launch cutover (`delete from recipes where slug like
  'mock-%'`). Out of scope.
- Real photography or real nutrition measurement (stock + estimates, as decided).

## Locked decisions (from the brainstorm)

| Decision | Choice |
|----------|--------|
| Name | `writerecipe` (one word, sibling convention to `ingeststamp`) |
| Handoff mode | **Hybrid** — accept a freeform dump, structure what's there, interview only for missing/ambiguous Core fields |
| Editorial autonomy | **Draft-all, single approval** — Claude drafts every editorial field in voice, presents the whole file for one approval pass |
| Halal | **Auto-flag + substitute** — scan for alcohol/pork/non-halal, flag and propose halal swaps before writing; never silently ship non-halal |
| Missing stamp | **Seed anyway, but report loudly + durably** — validate with `recipes:check` (not `--require-stamps`), seed, then (a) end the run with an unmissable ⚠️ STAMP NEEDED banner and (b) record the gap in `docs/stamps/CHECKLIST.md` so it survives chat-skimming. Authoring is never blocked mid-flow, but the cook's "every recipe needs a stamp" rule is enforced by visibility + a durable record, not by hoping the cook reads scrollback. |
| Tags | **Propose-from-the-13 + explicit approval line** — read `ALL_TAGS` live, propose only on-list tags, surface them as their own approval line (not buried in the file). A missing concept is flagged as a deliberate `TAG_GROUPS` extension, never an off-list tag. |
| Image | **Claude picks an `images.unsplash.com` URL**, verified to resolve, `imageIsStock: true` |
| Burst handling | Batch intake, single seed pass at the end |

## Core design principle: reference sources of truth, never snapshot them

The skill's biggest risk is staleness — if it copies the tag list, the country
names, or the field tiers inline, it will confidently mislead the day any of
those change. So the skill **reads the live source at runtime** and never
hardcodes the values:

| What the skill needs | Source of truth it reads (never copies) |
|----------------------|------------------------------------------|
| Valid country names | `public/countries-110m.json` → `objects.countries.geometries[].properties.name` |
| Valid tags | `ALL_TAGS` in `lib/filters.ts` |
| Field shape / tiers | `data/recipes/_types.ts` (`RecipeInput`) |
| Allowed image domain | `next.config.ts` `images.remotePatterns` + CSP `img-src` |
| Voice & constraints | the memories + `data/recipes/classic-lasagna.ts` as the gold-standard example |
| Stamp status | `scripts/lib/stamp-coverage.ts#stampStatusForCountry` (already used by the seed) |

This is the single most important structural choice: the skill is a *procedure*
that points at truth, not a *copy* of truth.

## The procedure

### Phase 0 — Batch check
If the cook hands over more than one recipe, run Phases 1–5 per recipe (writing
one file each), then do Phase 6 (seed) **once** at the end. `seed:recipes`
upserts the whole `data/recipes/` directory in a single call, so a burst costs
one seed, not N.

### Phase 1 — Intake (hybrid)
Accept whatever form the recipe arrives in (rough notes, a wall of text, a
photo). Parse it into the **Core** tier as defined in `_types.ts`
(`RecipeInput`): `title`, `country`, `category`, `difficulty`, `servings`,
`time` (`active`/`total`/`resting`), `yield`, `tags`, `ingredients` (grouped),
`steps` (grouped). Then interview **only for missing or ambiguous Core fields**.
Never re-ask what was already given.

### Phase 2 — Halal pass
Scan ingredients and steps for alcohol (wine, mirin, cooking sake, vanilla
*extract*, beer batter, etc.), pork/lard, and other non-halal items. Flag each
and propose a halal swap (see `feedback_halal_no_alcohol`,
`feedback_halal_trust_voice`). Do not write the file until each flag is
resolved. Never silently ship non-halal.

### Phase 3 — Derive (Claude computes), with hard gates
- **`country` — HARD GATE.** Read `public/countries-110m.json` at runtime and
  require an **exact** match against a `properties.name`. Do not trust memory of
  country names: the US is `"United States of America"` (NOT "United States" or
  "USA"); the UK is `"United Kingdom"`. On no match, surface the closest names
  from the file and stop. This is the single biggest silent failure (no map
  marker, country never resolves).
- **`tags` — closed vocabulary, explicitly approved.** Read `ALL_TAGS` from
  `lib/filters.ts` live (currently 13, grouped Dietary/Style/Occasion); every
  tag must come from it or it is unfilterable. Propose only on-list tags that
  genuinely fit, honoring any tags the cook explicitly stated. Surface the
  proposed set as **its own labelled approval line** in Phase 4/5 (e.g.
  `Tags: vegetarian, high-protein, budget-friendly, one-pot — approve?`), never
  buried inside the file dump, so the cook can approve/cut/add deliberately. If a
  genuinely-needed concept is missing from the 13, do NOT invent an off-list tag
  — flag extending `TAG_GROUPS` in `lib/filters.ts` as a deliberate, separate
  edit and confirm with the cook first.
- `region` — one of the 11 `CulinaryRegion` values (DB CHECK-constrained;
  `recipes:check` will catch a bad one, but pick correctly from the country).
- `coordinates` — `{ lat, lng }`, sanity-checked to fall within the country.
- `nutrition` — **per-serving** estimate (UI multiplies by servings; never give
  totals). See `project_nutrition_convention`.
- `flavorProfile` — integer **0–5** per axis (sweet/salty/sour/bitter/umami/spicy).
- dietary booleans — derived from the *final, halal-resolved* ingredients.
- **time sanity** — `time.total >= time.active`; resting (if any) fits within total.

### Phase 4 — Editorial draft (voice), single approval
Draft `quote` (required pull-quote), `description`, `attribution`,
`headnoteIngredients`, `headnoteInstructions`, `equipment`, `tips`,
`substitutions`, `variations`, `storage`, `dropcap`, and `isFusion`/`inspiredBy`
when relevant. Match `classic-lasagna.ts` for structure and register. Voice:
warm, considered, well-traveled (CLAUDE.md Design Context). Constraints:
- **No em dashes** in any user-facing string (`feedback_no_em_dashes`). Em
  dashes are fine in this spec / comments / commits, never in recipe copy.
- Halal trust voice: confident, sell the taste, never fabricate a ruling.

### Phase 5 — Slug + file write, with collision branch
- **`slug` — collision branch.** Propose a slug (descriptive, not necessarily
  title-kebab: `classic-lasagna` for "Tomato and Beef Lasagna"). Check
  `data/recipes/*.ts` for an existing file with that slug. Seeding is `upsert`
  on conflict slug, so a reused slug **silently overwrites** a live recipe.
  - New slug → write a new `data/recipes/<slug>.ts`.
  - Existing slug → confirm this is an intentional edit/replace, then `Edit` the
    existing file rather than blindly overwriting.
- **Image.** Pick an `images.unsplash.com` URL (`?w=1200&q=80`, the only
  allowlisted domain in `next.config.ts` + CSP). **Verify it resolves** (HEAD
  request) before writing, because a hallucinated photo ID 404s silently. If it
  can't be verified, fall back to asking the cook for a URL. `imageIsStock: true`.
- **Authoring conventions** (match the gold-standard files):
  - Author amounts in metric base weights (`g`, `ml`) plus standard spoon/cup
    units. Do **not** hand-set `metricAmount`/`metricUnit` — `lib/units.ts`
    converts. "to taste" / count items use `{ amount: 0, unit: '' }` and
    `{ amount: 1, unit: '' }` respectively (see `classic-lasagna.ts`).
  - `export default recipe satisfies RecipeInput` (or typed const), matching the
    existing file shape.
- Present the whole file for one approval pass; the cook edits inline.

### Phase 6 — Seed for the cook
After approval, Claude runs this itself (service key is in `.env.local`, per
`feedback_seed_for_the_cook`). Run once per session, after the last file:
1. `npm run typecheck` — the real correctness gate; catches TS-level errors that
   `tsx` (used by `recipes:check`) transpiles straight past, and matches CI.
2. `npm run recipes:check` — offline validation through `DbRecipeSchema`
   (abort-on-failure, no partial write).
3. `npm run seed:recipes` — upsert on conflict slug.
4. `npm run recipes:check` again — idempotency confirmation.
5. Read **stamp coverage** (`approved` / `needs-replacing` / `missing`) from the
   seed output. Missing/needs-replacing does **not** block (the recipe is live
   with the procedural fallback), but it triggers the two-part alert below.

### Phase 6.5 — Stamp gap: loud + durable (only if any recipe is not approved)
The cook's firm rule is that every recipe must have a stamp, and they may not
re-read the chat. So a missing/needs-replacing stamp is surfaced two ways:
1. **Durable record first.** Ensure each affected country is tracked in
   `docs/stamps/CHECKLIST.md` as outstanding (`[ ]` if missing, `[~]` if it
   exists but isn't the approved version). If the country has no line, add one
   under the appropriate section. This is the permanent record that survives
   chat-skimming and that `--require-stamps` reads.
2. **Unmissable banner last.** End the run with a clearly delimited block that is
   hard to skim past, listing every affected recipe + country + status and the
   exact next step, e.g.:

   > ⚠️ **STAMP NEEDED — recipe is live but has no approved stamp**
   > • <Recipe> → **<Country>** (status: missing)
   > Run `/ingeststamp` for <Country> before launch. Recorded in CHECKLIST.md.

### Phase 7 — Handoff
Report what was written + seeded, then the "needs real photo" list, then (if
applicable) the Phase 6.5 stamp banner **last** so it is the final thing on
screen. Hand the **browser check** to the cook. Never `git add`/`commit` unless
asked.

## Skill file structure

Single `SKILL.md` at `.claude/skills/writerecipe/SKILL.md`, matching the
`ingeststamp` house style:
- frontmatter `name` + `description` (with trigger phrases)
- Overview + When to use / When NOT to use
- The phase pipeline (Phases 0–7 above)
- A quick-reference table (phase → action → gate)
- A common-mistakes table
- Related context (links to `_types.ts`, `seed-recipes.ts`, the pipeline design
  doc, the relevant memories, `ingeststamp`)

## Quick-reference table (for the skill)

| Phase | Action | Hard gate |
|-------|--------|-----------|
| 0 | Batch? run 1–5 per recipe, seed once | — |
| 1 | Intake freeform → structure Core, interview gaps | — |
| 2 | Halal scan | No non-halal in final file |
| 3 | Derive region/coords/nutrition/flavor/diet | `country` exact-matches `countries-110m.json`; tags ∈ `ALL_TAGS`; `total >= active` |
| 4 | Draft editorial in voice + propose tags | No em dashes; halal trust voice; tags shown as own approval line |
| 5 | Slug + write file + image | Slug-collision confirmed; image domain `images.unsplash.com` + URL resolves |
| 6 | typecheck → check → seed → check | typecheck + check pass before seed |
| 6.5 | If stamp not approved: record in CHECKLIST.md + loud banner | Durable record written before reporting |
| 7 | Report + handoff browser check (stamp banner last) | No commit unless asked |

## Common mistakes (for the skill)

| Mistake | Symptom | Fix |
|---------|---------|-----|
| Trusted memory for `country` | No map marker; country never resolves | Match exactly against `countries-110m.json` (US = "United States of America") |
| Off-list tag | Recipe not filterable | Use only `ALL_TAGS`; extend `TAG_GROUPS` deliberately if needed |
| Hallucinated Unsplash ID | Broken image | HEAD-verify the URL before writing; else ask the cook |
| Skipped `typecheck` | Type error ships; `recipes:check` missed it | Always run `typecheck` before seeding |
| Reused a slug | Silently overwrote a live recipe | Check `data/recipes/*.ts` first; confirm edit vs. new |
| Hand-set `metricAmount` | Double-converted units | Author metric base; let `lib/units.ts` convert |
| Em dash in copy | Off-brand text | No em dashes in user-facing strings |
| Gave total nutrition | Inflated macros (UI multiplies) | Per-serving only |
| Stamp gap only mentioned mid-chat | Cook skims past it; recipe ships stampless | Record in `CHECKLIST.md` + loud banner as the last thing on screen |
| Tags buried in the file dump | Cook can't easily review/approve them | Surface proposed tags as their own labelled approval line |

## Validation & correctness

- Compile-time: `satisfies RecipeInput` + `npm run typecheck`.
- Seed-time: `DbRecipeSchema.safeParse` per row, abort-on-failure (no partial seed).
- Read-time: the app re-validates at the Supabase boundary (`useRecipes`).
- Skill-specific gates: country exact-match, tag membership, image-URL resolve,
  slug-collision confirm, halal scan — none of which the schema enforces.

## Open questions / future

- If recipe volume grows large, a one-line "seed N recipes" batch summary could
  replace per-recipe chatter. Deferred until the burst pattern proves it out.
