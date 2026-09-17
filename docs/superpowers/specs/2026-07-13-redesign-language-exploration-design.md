# Redesign language exploration — 3 directions

Date: 2026-07-13
Route: `/dev/redesign` (scratch sandbox, no Supabase)

## Purpose

Produce 3 refined, genuinely distinct **design languages** for Nieves Kitchen so the
user can pick ONE to become the brand going forward. The previous 6 sandbox
variations were rejected as "too postcard-forward" (postmarks / stickers / airmail
chrome sprayed everywhere) and "not refined enough." This round prioritizes
**intuitive, visible usability equally with design**, and adds two interactions the
user asked for: a **swipeable recipe filmstrip** and a **cookbook-style recipe page
whose prose is navigation**.

Grounded in the user's `~/Desktop/inspo for NK` folder, which clusters into three
threads: (1) blue-and-white azulejo/Iznik tile, (2) bold editorial poster
(GOURMET / SALADS covers + saturated food photography), (3) sun-washed hand-
illustration (the palette swatch + watercolor postcards + painterly tables).

## Shared UX spine (constant across all 3 — the "usability" layer)

Only the visual skin changes between variations; the spine is identical so the user
can compare languages fairly.

- Always-visible top nav with plain labels: **Recipes · Atlas · Pantry · About**.
- A **filmstrip carousel** of recipes front-and-center: horizontal snap-scroll,
  2–3 cards visible, driven by drag + arrow buttons + keyboard, reduced-motion aware.
  Ends with a "Browse all recipes" CTA card.
- A **cookbook recipe page** where the prose itself navigates: inline links in the
  intro/steps go to Atlas (country), Pantry (ingredient), or a Collection (tag);
  ingredient list items link to the Pantry; a margin/rail of related-recipe
  thumbnails enables quick jumping.
- Large tap targets, visible keyboard focus, obvious CTAs. No literal postmark chrome.

Each variation ships two screens — **Home** and **Recipe** — toggled in the dev bar.

## Direction 1 — Sunwashed (illustrative, warm-minimal — NOT sparse)

- **Color:** Almond Cream `#F0EAD8` · Coastal Sage `#99ABA6` · Golden Chamomile
  `#D2BF81` · Olive Grove `#6F6C43` · Burgundy `#5A0A28` (from the user's swatch).
- **Type:** Fraunces (soft optical serif display) + Karla (humanist body); occasional
  handwritten accent used once.
- **Layout:** generous but populated — layered illustrated recipe cards, soft arched
  "sun-window" frames, painterly color washes. Watercolor/ink spot-art (pantry
  drawings) stands in for photography.
- **Signature:** the arched sun-window frame + watercolor spot-art, warm wash grounds.

## Direction 2 — Azulejo (editorial tile, medium-bold)

- **Color:** Cream `#F4ECDC` · Cobalt ink `#20406B` · Terracotta `#C4623C` · Brass
  `#C69A4E` · Olive `#6F7A47`.
- **Type:** DM Serif Display (high-contrast cookbook serif) + Karla body.
- **Layout:** a real **drawn tile-border system** — cobalt SVG azulejo motifs used
  structurally as frames, dividers, and section corners, not decoration pasted on.
- **Signature:** the azulejo frame system in flat cobalt line on cream + terracotta pops.

## Direction 3 — Gourmet Press (bold imagery, loud poster)

- **Color:** Cream `#F3ECDD` · Navy/ink `#141B34` · Hot coral `#F2685E` · Marigold
  `#E8A22B` · Emerald `#1F6B4E`.
- **Type:** Anton (massive condensed display, incl. vertical wordmarks) + Figtree body.
- **Layout:** type-as-architecture over full-bleed saturated food photography;
  color-blocked panels; big, direct controls.
- **Signature:** oversized/vertical type + a circular press "seal" mark.

## Build

- `app/dev/redesign/v2/content.ts` — rich static sample data: recipes (4 real dishes
  from `public/recipes/`), one fully-authored recipe detail with inline-nav prose
  segments (`Rich = (string | { text; to })[]`), related recipes, gallery.
- `app/dev/redesign/v2/shared.tsx` — `Filmstrip` carousel, `NavText` inline-nav
  renderer, `useNavFlash`/`NavFlash` ephemeral "would open →" pill.
- `app/dev/redesign/v2/Sunwashed.tsx`, `Azulejo.tsx`, `GourmetPress.tsx` — each
  `({ screen })` renders Home or Recipe in its own scoped tokens/fonts.
- `app/dev/redesign/page.tsx` — 3 new primary tabs + Home/Recipe screen toggle; the
  old 6 kept reachable but demoted.

Validation: `npm run typecheck`; visual review on the dev route.
