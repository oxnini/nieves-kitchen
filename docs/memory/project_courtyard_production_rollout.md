---
name: project_courtyard_production_rollout
description: "Approved 7-phase plan to roll the Courtyard design language into production, done one small phase per chat"
metadata: 
  node_type: memory
  type: project
  originSessionId: 8964526c-11ec-4720-98f8-84197a253250
---

Courtyard (the chosen brand, from [[project_redesign_language_exploration]]) is being rolled into
production in **7 small phases, one commit + one fresh-chat handoff per phase**. Plan approved
2026-07-14; plan file: `/Users/nievesyang/.claude/plans/parallel-moseying-wigderson.md`.

**Two Claude Design projects (same system, via DesignSync/claude_design MCP):**
- `52fdbdaa-c980-4996-895a-5b964c213c0b` — "Nieves's Kitchen Design System" = Courtyard formalized
  into `tokens/*.css` (canonical values) + component lib + ui_kit. Readme confirms it IS Courtyard.
- `3c37e9f7-3f12-40ce-8806-cdedff20bebb` — landing wireframes: **1A "The Spread"** (chosen) and
  **1B "The Tile Wall"** (declined — its country tile-wall is the deferred atlas).

**Locked decisions:**
- Tokens: **remap `--color-*` VALUES in place** in `app/globals.css` @theme, keep the names (~1,000
  call sites); add new cobalt/brass/olive/cream/ink tokens. Same trick as the Teal & Ember swap.
- Fonts: Literata/Figtree → **Fraunces (display) + Karla (body)**; keep Cutive/Courier for stamps.
- Dark mode: **keep** the theme system, reskin `sepia` to "courtyard at night" (cobalt-deep). Not removed.
- Home: **rebuild to 1A**; 1B's hand-drawn pantry band earmarked for later.
- Canonical palette: cream #F4ECDC / creamDeep #EBE0C8 / cobalt #20406B / cobaltDeep #16324F /
  terracotta #C4623C / brass #C69A4E / olive #6F7A47 / ink #2A2A2E.

**Phases:** 1 tokens+fonts (light) · 2 dark reskin · 3 brand-name sweep ("Nieves' Kitchen" →
"Nieves's Kitchen", see [[project_brand_name]]) + bold cobalt Navbar + footer · 4 shared primitives
(Arch/Tile/TileGrid/StepTile/Filmstrip/Eyebrow/DropCap/Chip) · 5 home = 1A · 6 recipe pages reskin
(arch hero, drop cap, step tiles; keep all features) · 7 consistency sweep.

**Deferred (do NOT start):** atlas-as-tiled-map, passport stamps→tiles (the journal), font
self-hosting, more recipe photography (only ~4 real dishes).

**Phase 1 SHIPPED 2026-07-14** on branch `feat/courtyard-phase-1-foundations` (commit c555422, not
yet merged to main). Touched only `app/globals.css` @theme + `app/layout.tsx`. typecheck + build
pass; every route skimmed in parchment, coherent. Two non-obvious decisions worth reusing:
- **sage got a soft olive TINT (#ABAD8A), not the canonical #6F7A47 olive.** sage is used almost
  entirely as a FILL with `text-brown-dark` (difficulty "Easy" badges, filter chips); full-olive
  would be dark-on-dark (~2.2:1). The tint keeps ~4.4:1 (≥ old sage). Canonical #6F7A47 lives in the
  new `--color-olive` token. paprika → #B4432E. brown-medium #4A6076, brown-light #7C8CA0.
- **Legacy font-var aliases in :root:** `--font-figtree`→Karla, `--font-literata`→Fraunces. ~15
  map-SVG + passport-stamp components reference those vars directly (not --font-heading/-body), so
  aliasing = zero call-site churn (same keep-the-name trick as the colors). Fraunces loaded with
  `axes:['opsz']` + `style:['normal','italic']`.
- **Known deferral:** atlas choropleth is still teal (`lib/regions.ts` CHOROPLETH_BASE = rgb 14,115,133,
  outside @theme). That is the Phase 7 atlas light-reskin, not a Phase 1 miss.

**RE-SEQUENCED 2026-07-14** (user wants the new home page soon, asked mid-rollout). New order:
**Phase 3 (bold cobalt Navbar + footer + "Nieves's Kitchen" name) → Phase 4 (primitives) →
Phase 5 (home)**, THEN loop back for **Phase 2 (dark reskin)** and **Phase 6 (recipe pages)**.
Deferring dark is safe (sepia still works on old Teal & Ember values). The
`[data-theme="sepia"]` block still holds old values — leave it until Phase 2.

**Phase 3 SHIPPED 2026-07-14** on branch `feat/courtyard-phase-3-nav-footer` (commit ab55181,
branched off phase-1, NOT merged to main). Delivered: brand sweep (see [[project_brand_name]]),
bold cobalt `Navbar.tsx`, new global `components/Footer.tsx`. **Phase 4 (primitives) is next.**
Non-obvious decisions worth reusing:
- Nav/footer built from **FIXED cobalt/cobalt-deep/brass/cream tokens**, CTA pinned to literal
  `#C4623C` (the `terracotta` token lifts to ember in sepia) → band is theme-stable, already correct
  for Phase 2. Do NOT rebuild these from parchment/brown-* aliases.
- Band height **88px desktop / 64px mobile**; `<main>` padding is `pt-[4.5rem] sm:pt-[5.5rem]`
  (mobile kept at 4.5rem to preserve the WorldMapMobile chrome offset constant). Inline nav shows at
  **lg** (7 tabs + CTA don't fit at sm); below lg the existing `NavMenuDropdown` carries all routes
  (its top anchor was bumped to 70px/94px).
- Passport icon (dark raster) + ThemeToggle sit on a **fixed-cream utility pod** so they read on
  cobalt; ThemeToggle gained an `onPod` fixed-ink prop. Footer hidden on `/atlas` (fixed map).
- **Screenshot gotcha:** headless `--window-size` is NOT honored by `--headless=new --screenshot`
  (renders ~500px, crops to the requested width → fake "clipping"). Verify mobile widths via CDP
  `Emulation.setDeviceMetricsOverride` (drive Chrome `--remote-debugging-port` with a Node CDP
  script) — the nav actually fits fine at 360/390.

**Phase 6 SHIPPED 2026-07-14** on branch `feat/courtyard-phase-6-recipe` (commit 74d003f, cut off
`feat/courtyard-phase-2-dark`, NOT merged). Recipe pages reskin, not a rebuild. Touched
`components/RecipeDetail.tsx`, `recipe/DescriptionBlock.tsx`, `recipe/InstructionGroupList.tsx`.
Non-obvious decisions:
- **Full page vs @modal split by the existing `heroBleed` flag.** Full page (heroBleed=false) got the
  new masthead: photo inside the `Arch` (brass keystone) + Fraunces title + country/fusion `Eyebrow`
  + copy/favorite **on the page paper** (restyled scrim chips → paper chips: `bg-surface border
  border-brown-light/20`). The intercepting modal (heroBleed=true) **KEEPS its bleed-photo hero
  unchanged** because `RecipeModal`'s close/expand controls are white-on-scrim and rest on that photo;
  arching it would strand them on parchment. Body is shared, so BOTH surfaces still get DropCap +
  StepTile. Don't try to arch the modal without also restyling `ModalControls`.
- DropCap: `DescriptionBlock` now renders the terracotta Courtyard `DropCap` when `recipe.dropcap`;
  the old neutral `.dropcap` CSS class STAYS (still used by `/about`, a Phase 7 surface).
- StepTile wrapped in `<span aria-hidden>` so the `<ol>` still conveys step order to SR.
- Verified parchment+sepia, desktop + true 390 mobile, full page AND @modal (drive the intercept by
  soft-clicking the card link, wait ~4s, capture — the modal is slow to mount).
**Recipe hero: arch → banner (2026-07-15, commit 21b36d7 on the phase-7 branch).** The user
rejected the Phase-6 arch on the recipe FULL page ("doesn't fill the space nicely") and gave a
banner reference. Full page now = full-width banner: photo fills the column, eyebrow (place ·
attribution) + Fraunces title + italic quote over a scrim (from-scrim/85 via/45), then a meta bar
(time/difficulty pills + Copy/favorite) below. Threaded `showQuote` (DescriptionBlock) + `showTimes`
(InfoStrip), both keyed off `heroBleed`, so the @modal keeps its unchanged bleed-photo hero + quote +
attribution line + InfoStrip times. The `Arch` primitive is now used only on the HOME hero, not the
recipe page (this partially reverses the design-language doc §9 "arch for recipe imagery" — the doc
was not updated; the owner overrode it for the recipe page). StepTile + terracotta DropCap stay.
KNOWN NIT: the hero eyebrow shows "A NIEVES KITCHEN ORIGINAL" (no possessive) because recipe
`attribution` strings in the DB/data files still say "A Nieves Kitchen ..." — see [[project_brand_name]];
fixing needs data-file edits + a Supabase re-seed, deferred.

**Phase 7 SHIPPED 2026-07-14** on branch `feat/courtyard-phase-7-sweep` (commit ce7cb82, cut off
phase-6, NOT merged). **ALL 7 PHASES NOW COMPLETE.** The sweep found the whole app already coherent
from earlier phases; the ONE substantive fix was the atlas choropleth, which shaded density in TEAL
because its constants live in `lib/regions.ts` OUTSIDE the `@theme` block and the Phase-1 remap
missed them. Retuned `CHOROPLETH_BASE` teal(14,115,133)→cobalt #20406B (+ pale cobalt LIGHT, warm
EMPTY kept) and the sepia ramp to cobalt-night (lifted cobalt base, deep-cobalt floor also hardcoded
in `hooks/useChoroplethFill.ts` getChoroplethColor). `ChoroplethLegend` derives swatches from the
same fill fn, so it followed automatically. Non-obvious findings from the sweep:
- FilterPanel active chips (`bg-teal text-parchment`) are NOT a regression — an existing Phase-2
  override (`[data-theme=sepia] .bg-teal.text-parchment` → cream on #264C7D, globals.css ~L253)
  holds them at ~7:1. Looks low-contrast at low zoom but is fine.
- The old home components `CoverHero/CoverRail/CoverTableCard/WhereNext` are NOT dead — still imported
  by `/dev/home-cover` + `/dev/palettes`, so they were left in place (deleting breaks the dev build).
  CoverTableCard's hardcoded old teal/ember (#1E4854/#CE6B39) only renders on those dev routes now.
- ~~All 7 branches are STACKED and ALL merged to main via PR #5 (2026-07)~~ **MERGED to main 2026-07-15** via PR #5
  (merge commit `52d83f3`). `main` now IS Courtyard: cobalt/brass tokens live in `app/globals.css`
  @theme (names kept: `brown-dark`=cobalt ink, `turmeric`=brass, `teal`/`--color-cobalt`=cobalt;
  new `--color-cobalt`/`-deep`/`--color-brass`/`--color-olive`), plus the sepia "courtyard at night"
  dark theme. Build any new UI (e.g. the pantry redesign) against these tokens, not inline hex, and
  check it in both light + cobalt-night.

**Home decision changed:** home = 1A "The Spread" **plus the 1B tile wall dropped in the middle**
("Pick a tile, pick a place" glazed zellige country grid, between hero and This Week). Partially
reverses the old "1B declined" call. Scope contained: **curated static tiles linking to
/recipes?country= and /atlas**, NOT the interactive glaze-on-cook atlas (still deferred). Wire
tiles to real recipe data in a later pass. 1B's hand-drawn pantry band still deferred.

Design imported from claude_design project 3c37e9f7 file "Nieves's Kitchen Landing.dc.html" via
DesignSync — its "try next" line literally suggests this exact 1A-hero + 1B-tile-wall hybrid.
Related: [[project_palette_exploration]], [[project_home_cover_redesign]], [[feedback_no_em_dashes]],
[[project_lint_script_broken]], [[feedback_visual_iteration_workflow]].
