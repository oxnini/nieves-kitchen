---
name: addpantry
description: Use when adding or replacing an ingredient in the nieves-kitchen Pantry — authoring a data/pantry/<slug>.ts entry, ingesting its ink art to public/pantry/<slug>.webp, and wiring any recipe that features it. Triggered by phrases like "add X to the pantry", "new pantry ingredient", "I rendered the honey art", or `/addpantry`.
---

# addpantry

## Overview

Turns a pantry ingredient (a name, an ink-art render, and — for a beloved food —
a verified prophetic citation) into a validated `data/pantry/<slug>.ts` plus its
ingested `public/pantry/<slug>.webp`, wired to any recipe the ingredient
defines, ending where the cook just does a browser check. Sits on top of the
phase-2 Pantry (`docs/superpowers/specs/2026-07-04-pantry-design.md`,
`docs/plans/2026-07-04-pantry-plan.md`).

The shelf and the home teaser both read `lib/pantry/landed.ts`, which shows an
entry **only once its `<slug>.webp` exists on disk**. So a data entry with no art
is invisible (safe to write ahead), and dropping the art in is what makes the
card appear — no wiring step reveals it.

**Core principle — reference sources of truth, never snapshot them.** Read the
live source at runtime; never hardcode the kind list, the slug vocabulary, or the
field shape into this file.

| Need | Read at runtime (never copy) |
|------|------------------------------|
| Kind vocabulary + shelf order | `KIND_ORDER` in `data/pantry/_types.ts` |
| Field shape / trust rule | `PantryEntry` in `data/pantry/_types.ts` |
| Existing slugs + `PANTRY` order | `data/pantry/index.ts` |
| Voice: prophetic vs plain | `data/pantry/barley.ts` / `data/pantry/eggs.ts` |
| Recipe wiring vocabulary | `featuredIngredients` across `data/recipes/*.ts` |
| Art prompt grammar | `docs/plans/2026-07-04-pantry-art-prompts.md` |

## When to use

- `/addpantry`, or "add <X> to the pantry", "new pantry ingredient", "I rendered
  the <X> art", "replace the <X> pantry art".

**Do NOT use for:**
- Writing the Sora art prompt (that lives in the prompts doc above).
- Authoring a recipe (that's `writerecipe`).
- Committing — never `git add`/`commit` unless the user asks.

## Not the stamp pipeline

The art ingest resembles `ingeststamp` but differs in three ways that bite if you
copy it blindly:

1. **Crop on `alpha > 16`, never `alpha > 0`.** Pantry renders carry a soft
   glow/halo, so an `alpha > 0` bounding box grabs the whole canvas. (Stamps are
   hard-edged and crop `alpha > 0`.)
2. **`magick` is not installed** on this machine. Key opaque backgrounds with a
   PIL euclidean-distance key, not ImageMagick.
3. **No aspect registry.** Cards render with `next/image object-contain`; there is
   no `CUSTOM_STAMPS`-style aspect to update. You DO edit `data/pantry/index.ts`.

## The procedure

### Phase 1 — Intake

Get the name and the `kind`. Validate the kind against `KIND_ORDER` (read
`_types.ts`; do not trust memory). Ask whether the food carries a **prophetic
narration**.

- **"Prophetic" covers Quran *or* Sunnah.** A food honoured in the Quran
  qualifies just as one from a hadith does — cite whichever is real (a verse, a
  hadith, or both). `honey.ts` is Quran-only (an-Nahl 16:69); `olive-oil.ts`
  pairs a hadith with a verse; `barley.ts` is hadith-only. All three render under
  the same "From the Prophet's ﷺ table" block, so a Quran-only food still uses
  `prophetic`. The `note`'s inline `ﷺ` is only correct when the narration is
  actually his; for a Quran-only entry, phrase the note around the verse.
- **Verify the citation. HARD GATE.** Same trust rule as `lib/halal.ts`: never
  fabricate a narration or a citation, and never reword a source (verse or hadith)
  into something it does not say — the editorial `note` must not put words in the
  source's mouth either. sunnah.com Cloudflare-blocks a direct fetch; the working
  path is the Wayback Machine mirror of sunnah.com plus quran.com. If a claim
  cannot be verified against its source, cut or reword it rather than ship it on
  trust. A `prophetic` block without a real `citation` must never be written (the
  type enforces the field; you enforce the truth).

### Phase 2 — Slug + data entry

- **`slug` — one identity, three uses.** Lowercase-hyphenated. It is the data
  filename, the art filename (`public/pantry/<slug>.webp`), AND the token a recipe
  puts in `featuredIngredients`. Keep them identical. Collision check:
  ```bash
  ls data/pantry/<slug>.ts 2>/dev/null && echo "EXISTS — confirm edit/replace" || echo "new slug"
  ```
- **Write `data/pantry/<slug>.ts`** as a default-exported `PantryEntry` (match
  `barley.ts` for a prophetic entry, `eggs.ts` for a plain one): `slug`, `name`,
  `kind`, `note` (2–3 sentences, margin-notes voice, **no em dashes**), optional
  `prophetic: { note, citation }` (only with a verified citation; the `ﷺ` glyph
  follows "the Prophet" inline, no parenthesised variant), and
  `artSrc: '/pantry/<slug>.webp'`.
- **Register it in `data/pantry/index.ts`**: add the `import` and insert into the
  `PANTRY` array at the correct position — `PANTRY` is in shelf order: `KIND_ORDER`
  group order, then the design/curated order within a group (design §2), NOT
  alphabetical. With no other signal, append to the end of the entry's kind group.
  The shelf regroups by `KIND_ORDER` defensively, but keep the array honest anyway.

### Phase 3 — Art ingest (mechanical; do in order)

Skip this phase if only the data entry was requested and no render exists yet —
the entry stays invisible until art lands, which is fine.

1. **Identify the PNG** with `Read` (transparent areas render dark in the viewer;
   that is not a missing alpha channel). Confirm which file is which if ambiguous.
2. **Judge it against the prompt grammar** before ingesting: flat two-tone
   (sepia-brown ink + one terracotta accent), frameless, no lettering, no faces
   (a meat cut is a cut, never an animal). Name a bad render for a re-roll rather
   than ingest it.
3. **Check alpha:** `sips -g hasAlpha "<path>"`. `yes` is necessary but not
   sufficient — also confirm the four corners are transparent (the key step
   distinguishing native alpha from an opaque grey/white backdrop).
4. **Process** on a copy in the scratchpad (never touch the original). One PIL
   pass handles both cases:
   - If the four corners are already `alpha == 0`: native alpha, no keying.
   - Else key the backdrop: sample the four corners, average them (do NOT assume
     white — ChatGPT renders often sit on grey; Photos-library JPEGs on white),
     and set `alpha = 0` where a pixel's euclidean RGB distance to that average is
     `<= 0.08 * sqrt(3*255^2)`. If any corner stays opaque, redo at `0.12`. `0.12`
     is the ceiling — if a fringe survives it, or the backdrop is a gradient one
     flat key can't clear, treat it as a bad render and ask for a re-roll rather
     than keep raising fuzz (which starts eating the art's own edges).
   - **Crop to the `alpha > 16` bounding box, +3% margin** (never `alpha > 0`).
   ```bash
   python3 - "<src>" "<out>.png" <<'PY'
   import sys, math
   from PIL import Image
   img = Image.open(sys.argv[1]).convert("RGBA"); w,h = img.size; px = img.load()
   cs = [px[0,0], px[w-1,0], px[0,h-1], px[w-1,h-1]]
   if not all(c[3]==0 for c in cs):
       n=len(cs); bg=(sum(c[0] for c in cs)//n, sum(c[1] for c in cs)//n, sum(c[2] for c in cs)//n)
       for fuzz in (0.08, 0.12):
           thr = fuzz*math.sqrt(3*255**2)
           for y in range(h):
               for x in range(w):
                   r,g,b,a = px[x,y]
                   if math.dist((r,g,b), bg) <= thr: px[x,y]=(r,g,b,0)
           if all(px[c][3]==0 for c in [(0,0),(w-1,0),(0,h-1),(w-1,h-1)]): break
   a = img.getchannel("A"); mask = a.point(lambda v: 255 if v>16 else 0)
   bb = mask.getbbox(); m = int(0.03*max(bb[2]-bb[0], bb[3]-bb[1]))
   img.crop((max(0,bb[0]-m),max(0,bb[1]-m),min(w,bb[2]+m),min(h,bb[3]+m))).save(sys.argv[2])
   print("orig", (w,h), "-> crop", Image.open(sys.argv[2]).size)
   PY
   ```
5. **Convert:** `cwebp -q 82 -quiet "<out>.png" -o public/pantry/<slug>.webp`.
6. **Verify:** `sips -g hasAlpha public/pantry/<slug>.webp` must say `yes`. Then
   composite it on parchment (`#F5F0E4`) and look — a white-key can leave a halo,
   and `Read` on a bare webp hides it. Re-key at higher fuzz if you see a fringe.

`public/pantry/` is already in `AUTO_CONVERT_DIRS` (`.husky/pre-commit`), so no
hook change is needed for new assets.

### Phase 4 — Recipe wiring (only if a recipe is *defined* by it)

Add the slug to a recipe's `featuredIngredients` **only when the ingredient
defines the dish**, not merely appears in it (aglio e olio IS garlic and oil; the
garlic in a beef lasagna's sauce does not earn a slot). This is the same bar
`writerecipe` uses. Edit the recipe's `data/recipes/*.ts`, then reseed in Phase 5.
`scripts/seed-recipes.ts` validates every `featuredIngredient` against `PANTRY`
and aborts on an orphan, so a typo fails loudly.

### Phase 5 — Verify for the cook

Run these yourself (service key is in `.env.local`):
1. `npx tsc --noEmit` — the correctness gate (**never `npm run lint`** — it is
   broken in this repo: `next lint` is deprecated and there is no eslint config).
2. `npm run build` — catches the server/client boundary and prerender issues.
3. Only if you touched a recipe's `featuredIngredients`: `npm run seed:recipes`
   (validates slugs, then upserts).

The shelf and teaser pick up the new entry automatically once its webp exists
(`landedPantryEntries()` reads the directory at request time) — no route edit.

### Phase 6 — Report + stop

Report what was written, ingested, and wired, and that the tree is staged but not
committed. Hand the browser check to the cook. Never `git add`/`commit` unless
asked.

## Quick reference

| Phase | Action | Hard gate |
|-------|--------|-----------|
| 1 | Name + kind + is-it-prophetic | kind ∈ `KIND_ORDER`; prophetic citation verified, never fabricated |
| 2 | Write `data/pantry/<slug>.ts` + register in `index.ts` | slug = data = art = `featuredIngredients` token; no em dashes |
| 3 | Ingest art → `public/pantry/<slug>.webp` | crop `alpha > 16` (never `>0`); PIL key (no `magick`); `hasAlpha: yes` |
| 4 | Wire `featuredIngredients` (if defining) | slug ∈ `PANTRY`; only if it defines the dish |
| 5 | `tsc` → `build` (→ `seed:recipes` if wired) | never `npm run lint` |
| 6 | Report, do not commit | no commit unless asked |

## Common mistakes

| Mistake | Symptom | Fix |
|---------|---------|-----|
| Cropped `alpha > 0` | Tiny art floating in a full-canvas transparent box | Crop `alpha > 16` (+3% margin) — pantry renders have soft halos |
| Assumed white backdrop | Grey ChatGPT backdrop survives keying | Sample the actual corners; key to their average, not white |
| Trusted `hasAlpha: yes` alone | Opaque backdrop shipped as a grey/white block | Also confirm corner alpha `= 0`; else key |
| Forgot `index.ts` | Data file exists but never imports into `PANTRY` | Add the import + insert at the right `KIND_ORDER` slot |
| Hardcoded a slug list | Guidance rots as the pantry grows | Read `PANTRY` / `KIND_ORDER` live |
| Fabricated / reworded a citation | Ships a claim the source doesn't make | Verify via Wayback sunnah.com + quran.com; cut if unverifiable |
| Em dash in `note` | Off-brand copy | No em dashes in user-facing strings |
| `featuredIngredients` for a non-defining ingredient | Pantry "Cook with it" over-claims | Only when the ingredient defines the dish |
| Ran `npm run lint` | Does nothing / false confidence | `npx tsc --noEmit` + `npm run build` |
| Committed without being asked | — | Never `git add`/`commit` unless the user says so |

## Related context

- Design + plan: `docs/superpowers/specs/2026-07-04-pantry-design.md`, `docs/plans/2026-07-04-pantry-plan.md`.
- Field shape + trust rule: `data/pantry/_types.ts`; gold-standard entries: `data/pantry/barley.ts` (prophetic), `data/pantry/eggs.ts` (plain).
- Shelf order + registry: `data/pantry/index.ts` (`PANTRY`, `KIND_ORDER`).
- Landed-art gate (shared by shelf + home teaser): `lib/pantry/landed.ts`.
- Art prompt grammar: `docs/plans/2026-07-04-pantry-art-prompts.md`.
- Recipe wiring + seed validation: `data/recipes/_types.ts` (`featuredIngredients`), `scripts/seed-recipes.ts`.
- Sibling skills: `writerecipe` (recipes), `ingeststamp` (stamps — similar art pipeline, different crop threshold).
- Memories: `feedback_halal_trust_voice`, `feedback_no_em_dashes`, `feedback_magick_missing_python_key`, `feedback_stamp_crop_alpha_threshold`, `project_lint_script_broken`, `feedback_seed_for_the_cook`.
