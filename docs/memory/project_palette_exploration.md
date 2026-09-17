---
name: palette-exploration
description: Site-wide colour palette redesign in progress — /dev/palettes route previews candidates A/D/E/F on real components; no winner picked yet
metadata: 
  node_type: memory
  type: project
  originSessionId: d2ee33c8-d2d2-4609-bfc2-8b6b55496ec5
---

**DECIDED 2026-07-10: Option D "Teal & Ember" SHIPPED site-wide** (committed 2026-07-11 as `8ec0305`). Ink lightened per user (#17383E felt "almost black" → #1E4854); dark paper lifted to #142A30. Token NAMES kept (`brown-dark` now holds teal ink; possible later rename cleanup). Migrated: `@theme` + sepia block + hardcoded sepia overrides in `app/globals.css`, `CHOROPLETH_*` in `lib/regions.ts`, sepia blend endpoint in `hooks/useChoroplethFill.ts`, confetti fallback in `CookedButton.tsx`. Passport stays parchment-locked by design. `/dev/palettes` "Old (brown)" pill = before/after comparison.

Open follow-ups from this session:
1. ~~Pantry ink art on dark~~ → SHIPPED 2026-07-11 (plinth treatment), see [[home-cover-redesign]].
2. ~~Home page redesign~~ → SHIPPED 2026-07-11 (variant E "card on the table" hero), see [[home-cover-redesign]].

Earlier exploration (superseded):

- Diagnosis: dullness comes from brown ink/neutrals (`brown-dark/medium/light`) + brown-adjacent terracotta lead, not the accents.
- Candidates (all keep parchment except F which shifts to blush):
  - **A Kitchen Garden** — forest ink #253B2F, tomato lead #C94F30, honey gold (user likes)
  - **D Teal & Ember** — deep teal ink #17383E, teal lead #0E7385, ember #CE6B39 (user likes)
  - **E Market Garden** — pine ink #22423A, marigold lead #B67D14, radish (user finds "pretty nice")
  - **F Rose & Fig** — fig-plum ink #43303D, dusty rose lead #A85D66, eucalyptus/honey (requested dusty pink, not yet reviewed)
  - B Saffron & Indigo / C Azure & Olive were earlier artifact-only moodboards (artifact: https://claude.ai/code/artifact/31a98781-2276-46be-ae4d-c862a3a3da78)
- Preview route: `app/dev/palettes/` — overrides `--color-*` tokens on a wrapper (`data-theme="sepia"` for dark) around REAL components (home sections, choropleth atlas via useMapTopology, RecipeDetail). Full token sets incl. per-palette dark modes and choropleth bases live in `PalettePreview.tsx`.
- Once a winner is picked: write design spec, then migrate `@theme` tokens + sepia block in `app/globals.css`, `CHOROPLETH_*` constants in `lib/regions.ts`, hardcoded sepia overrides (cream text-white, pinned `.bg-teal.text-parchment`), and review stamp inks (`lib/stamp-traits.ts`).

See [[visual-iteration-workflow]].
