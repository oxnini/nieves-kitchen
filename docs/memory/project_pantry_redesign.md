---
name: project_pantry_redesign
description: "Pantry redesign shipped on a branch — two modes (accordion shelf + cook-from-what-I-have), benefits, new Sunnah ingredients; art + final citation checks still open"
metadata: 
  node_type: memory
  type: project
  originSessionId: 2b2de41d-cb7b-41da-ac53-99d9b716bf3f
---

Pantry redesign built 2026-07-15 and **MERGED to main** via PR #6 (merge commit
`c1fda4d`; branch `feat/pantry-redesign`). Chosen via the Claude Design mocks (project `028dddfb-...`, "Pantry
Directions.dc.html" = variants 1a drawer / 1b market-list / 1c tiled). User picked the
**1B backbone + accordion browse (variant A)**. Spec (local-only, `docs/superpowers/`
is gitignored): `docs/superpowers/specs/2026-07-15-pantry-redesign-design.md`.

**What shipped (code + data):**
- `components/pantry/PantryShelf.tsx` rebuilt: two modes via a top toggle. **The
  shelf** = accordion index (one `KIND_ORDER` group open at a time, so the list never
  runs endlessly) + in-place reading spread; on mobile the spread is a portal overlay.
  **Cook from what I have** = a pantry checklist matched against each recipe's
  `featuredIngredients` → ranked results (Ready badge / "1 more: X" near-miss / X of Y).
- Reading spread order: note + standalone plinth art → **Good for you** benefit chips →
  **From the Prophet's ﷺ table** hadith card (`bg-cobalt-deep`/`text-cream`, theme-stable
  so it holds in cobalt-night) → **Cook with it** recipes.
- Data model (`data/pantry/_types.ts`): added `PantryEntry.benefits?: string[]` and a new
  `PantryKind` **`'vegetables & greens'`** (2nd in `KIND_ORDER`).
- `benefits` added to existing entries; **lamb promoted to Sunnah** (shoulder hadith,
  Sahih al-Bukhari 5408). Uses the brass **keystone** as the Sunnah marker (not the old
  `PropheticSeal` rosette).

**Art-gated, authored but NOT yet visible** (production shows only entries with real
`public/pantry/<slug>.webp` via `landedPantryEntries`, no placeholders): **figs, pumpkin,
cucumber, beef** (pomegranate art landed; chicken added later with art). They light up once art is rendered via the `/addpantry`
flow. figs/pumpkin/cucumber = new Sunnah; pomegranate = promoted (Quran); beef = plain
(do NOT mark Sunnah — weak "beef is disease" narration).

**OPEN before merge/ship:**
1. Ink art for the 5 art-less entries (`/addpantry`).
2. **Final verbatim citation check on sunnah.com / quran.com.** All citations are
   corroborated via WebSearch (with hadith numbers) but sunnah.com was Cloudflare-blocked,
   so verbatim wording is unconfirmed. Refs used: figs Qur'an 95:1; pumpkin Bukhari 5433;
   cucumber Bukhari 5440 / Muslim 2043; pomegranate Qur'an 6:99 & 55:68; lamb Bukhari 5408;
   barley (already live) talbina Bukhari 5689/5417.
3. Cook-mode matching is on the curated `featuredIngredients`, not a full inventory — by
   design; confirm recipes carry enough featured slugs.

Related: [[project_table_pantry_atlas_revamp]] (this is that plan's Pantry phase, now
unblocked), [[feedback_halal_trust_voice]], [[project_courtyard_production_rollout]]
(Courtyard is now MERGED to main), [[feedback_visual_iteration_workflow]].
