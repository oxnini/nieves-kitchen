# Passport Booklet Redesign — Design

**Status:** Draft pending user review
**Date:** 2026-04-18
**Area:** `app/passport/*`, `components/passport/*`, `lib/regions.ts`, `app/recipes/page.tsx`

## Goal

Replace the current flat stacked-card passport page with a booklet metaphor: a physical-looking passport rendered in the center of the screen, with chevron controls that flip pages. Each spread represents a culinary sub-region and contains stamp slots for every country in that sub-region — ink-stamp visuals for cooked countries, pale dashed placeholders for uncooked ones. Aesthetic: indie, rustic, grainy, hand-crafted, not a glossy magazine.

## Non-goals

- No realistic curved page-peel animation (rigid-hinge flip is the intended look; matches passport, not magazine).
- No per-user server-side passport persistence beyond what `useCookedStamps` already provides.
- No sub-region column in the Supabase `recipes` table; taxonomy stays in code.
- No in-booklet recipe browsing UI — clicking an uncooked stamp deep-links to `/recipes` with the country filter applied.
- No authentication changes.

## Approach chosen

**Framer Motion DIY** over `react-pageflip`, `flipping-pages`, or other off-the-shelf flip libraries. Rationale:
- `framer-motion` is already in `package.json`; zero new runtime deps.
- Full control over every DOM node means grain, deckle edges, stitching, ink-stamp textures, and embossing can be layered without fighting a library's rendering engine.
- React 19 + Next.js App Router clean; no `legacy-peer-deps` drama, no `next/dynamic({ ssr: false })` escape hatches.
- A rigid hinge flip reads as "passport" (stitched spine); a curl-peel reads as "magazine" and would undercut the aesthetic.
- Every flip-book library we evaluated styles the paper itself and resists aggressive re-skinning. See research log in brainstorming transcript.

## Architecture

### File layout

```
components/passport/
  PassportBooklet.tsx        — top-level container; owns page state, URL sync, keyboard/swipe
  BookletShell.tsx           — cover, spine, paper texture, page edges (pure visual chrome)
  Page.tsx                   — single page w/ framer-motion rotateY flip; handles front/back faces
  Spread.tsx                 — composes two Pages into a left/right spread (desktop)
  CoverPage.tsx              — front-cover content (title, crest, current title)
  InsideFrontSpread.tsx      — stats panel (left) + table of contents (right)
  SubRegionSpread.tsx        — sub-region header + stamp grid flowing across both pages
  BackCoverSpread.tsx        — highlights + "keep exploring" CTA
  CountryStampSlot.tsx       — one slot: ink-stamp if cooked, pale dashed placeholder if not
  StampedRecipesModal.tsx    — modal opened on cooked-stamp click
  NavChevrons.tsx            — left/right chevrons outside booklet edges
  PageIndicator.tsx          — "3 / 18" clickable dots/scrubber
  hooks/
    usePassportPages.ts      — builds ordered page list from recipes + sub-region map
    useBookletNav.ts         — current index, flip forward/back, URL sync, keyboard/swipe
```

Each component has one responsibility and a narrow props shape. `PassportBooklet` is the only stateful root; everything beneath receives props or reads the same hooks.

### Existing files touched

- `lib/regions.ts` — add `SubCulinaryRegion`, `COUNTRY_TO_SUBREGION`, `SUB_REGION_PARENT`, `SUB_REGION_ORDER`, `SUB_REGION_SLUG`.
- `app/passport/page.tsx` — simplify to `<PassportBooklet />`. Drop direct rendering of old cover / region sections.
- `app/recipes/page.tsx` — hydrate `Filters` from `useSearchParams` on mount; sync URL on filter change via `router.replace`.

### Files deleted

The current flat passport UI is removed in the same PR:
- `components/PassportCover.tsx`
- `components/PassportRegionSection.tsx`
- `components/CountryStamp.tsx`
- `components/PassportRecipeCard.tsx`

Grep confirms these are only referenced by each other and by `app/passport/page.tsx`; no external consumers.

## Data model

### Sub-region taxonomy (added to `lib/regions.ts`)

```ts
export type SubCulinaryRegion =
  | 'Northern Europe' | 'Western Europe' | 'Mediterranean' | 'Eastern Europe'
  | 'East Asia' | 'Southeast Asia' | 'South Asia' | 'Central Asia' | 'West Asia'
  | 'North Africa' | 'West Africa' | 'East Africa' | 'Southern Africa'
  | 'North America' | 'Central America & Caribbean' | 'South America'
  | 'Oceania';

export const COUNTRY_TO_SUBREGION: Record<string, SubCulinaryRegion>;
export const SUB_REGION_PARENT: Record<SubCulinaryRegion, CulinaryRegion>;
export const SUB_REGION_ORDER: SubCulinaryRegion[];        // fixed travel order west → east
export const SUB_REGION_SLUG: Record<SubCulinaryRegion, string>;  // e.g. 'east-asia'
```

A default country → sub-region mapping will be drafted by the implementer using standard culinary/geographic groupings; the user will review and tweak during spec review.

### Page sequence (produced by `usePassportPages`)

1. **Page 0** — Front cover (single page; only the right face is visible when "closed").
2. **Spread 1** — Inside-front. Left: stats (`totalStamps`, `uniqueCountries.size`, `regionsTouched.size`, current title, next-tier progress). Right: table of contents listing visible sub-regions with cooked/total counters, clickable to jump.
3. **Spreads 2 … N+1** — One spread per **visible** sub-region, in `SUB_REGION_ORDER`. Visible iff its **parent `CulinaryRegion`** has ≥1 recipe in the DB. Stamps flow across both pages as one grid; sub-region title + cooked/total counter sit at the top-left of the left page; grid fills remaining left page + all of right page. Grid is 4 columns across the full spread on desktop, 3 columns on mobile single-page mode.
4. **Spread N+2** — Back cover. Left: "Highlights" — 3–5 most-recently-cooked stamps with date, country, recipe title. Right: closing blurb + "Browse more recipes" button → `/recipes`.

**Empty parent region:** if no recipes exist in any sub-region of a parent `CulinaryRegion` (e.g. Oceania with no recipes), all of that parent's sub-regions are hidden — no dead spreads. Once a single recipe from any Oceanian country is added, all Oceanian sub-regions become visible with their full placeholder slots.

**Countries on a sub-region spread** = every country in `COUNTRY_TO_SUBREGION` whose sub-region matches the spread **and** that has ≥1 recipe anywhere in the DB. Countries with no recipes at all do not render a placeholder — this keeps placeholder density tied to what the user can actually cook.

## Visual design

### Booklet chrome

- **Paper:** `parchment` base + layered SVG `<feTurbulence>` grain at ~6–8% opacity via a reusable `<PaperTexture>` filter component.
- **Deckle/torn page edges:** a second filter combining `feTurbulence` + `feDisplacementMap` applied to page outer edges.
- **Cover:** dark `brown-dark` leather-ish gradient, `mix-blend-mode: overlay` grain, embossed title "Culinary Passport" via stacked text-shadows, small `turmeric` crest SVG centered, current `ExplorerTitle` embossed at the bottom in smaller caps.
- **Spine:** vertical strip between pages with `<line stroke-dasharray>` stitch in `brown-medium`. Hidden on mobile single-page mode; replaced by a subtle left-edge shadow.
- **Page inner edge:** soft shadow near the spine to sell depth.

### Stamps

- **Cooked slot:** circular ink-stamp — `paprika`/`terracotta` tone, rotated ±6° with angle seeded by country name so it is stable across renders, country name in uppercase serif along the top arc, date centered below, outer double-ring border, `mix-blend-mode: multiply` over paper, small noise overlay so ink looks uneven. Multi-stamp countries show a small count badge in the corner. Date = `toLocaleDateString` with `month: 'short'`, `year: 'numeric'`.
- **Uncooked slot:** same circular footprint, dashed `brown-light/50` border, country name in faint centered caps, dotted placeholder where the date would be. Hover: border darkens to `brown-medium`, cursor pointer.

### Flip animation

- Framer Motion `rotateY` with `perspective: 2000px` on the booklet wrapper and `transform-style: preserve-3d` on pages.
- Duration ~600ms, easing `[0.22, 1, 0.36, 1]` with slight overshoot for weight.
- During flip: a dynamic shadow overlay `motion.div` over the flipping page, darker at the fold, opacity tied to flip progress.
- **Cover-open animation:** first forward flip from the closed cover runs at ~900ms with its own easing to sell the "opening the passport" moment.
- **Reduced motion:** `prefers-reduced-motion` replaces flips with a 200ms opacity cross-fade — no rotate, no 3D.

## Interactions

### Navigation

- **Chevrons** (`NavChevrons`): positioned outside the booklet's horizontal bounds on desktop; on mobile floats near the bottom corners. Disabled and dimmed at first / last page.
- **Keyboard:** `←` / `→` flip one spread (desktop) or one page (mobile). Ignored when focus is inside the modal or an input.
- **Swipe:** horizontal touch swipe > 50px flips; trackpad two-finger horizontal scroll also flips (debounced). Vertical scroll behavior preserved.
- **Page indicator** (`PageIndicator`): clickable dots with current-page highlight at the bottom. ≤20 total pages expected, dots are fine; if it ever exceeds 20 we switch to a compact "3 / 18" + dropdown (deferred until needed).
- **Deep link:** `/passport?spread=east-asia` opens directly to that spread on mount; flips push new URL via `router.replace` (no history spam). Invalid slug falls back to the inside-front spread.
- **Flip-in-flight protection:** `isFlipping` state blocks subsequent inputs until the animation completes.

### Stamp interactions

- **Click cooked stamp:** opens `StampedRecipesModal` with title "Cooked from {country}", list of cooked recipes (recipe title, cooked date, link to `/recipes/[slug]`). Closes on Esc / outside click / explicit close button. Focus trapped inside modal while open.
- **Click uncooked stamp:** `router.push('/recipes?country=' + encodeURIComponent(country))`. Browser back returns to the passport at the same spread (URL-driven).

### `/recipes` URL-driven filters

- On mount, `app/recipes/page.tsx` reads `useSearchParams` and seeds `filters.countries` (singleton array from `?country=X`). Future expansion to `?region=`, `?tag=` uses the same pattern.
- On filter change, calls `router.replace(pathname + '?' + params)` so URL reflects current state.
- Unknown params are ignored; invalid country silently drops.

### Edge cases

- **Loading:** booklet shell renders immediately with a shimmer placeholder in the stamp-grid area. Cover and chrome never wait.
- **No recipes at all in DB:** booklet shows cover + inside-front (zero stats + empty TOC) + back cover only. Middle section replaced by a single "Recipes coming soon" spread.
- **Zero stamps, non-empty DB:** full booklet with all placeholder slots. Inside-front shows zeros. Encourages browsing.
- **Accessibility:** after a flip, focus moves to the new spread's visually-hidden heading for screen readers. Stamps are buttons with `aria-label` describing country, cooked/uncooked, and count. Modal traps focus and restores it on close.

## Verification

No test suite is configured in this project. "Done" is a manual checklist:

- `/passport` renders cover; forward flip opens inside-front spread.
- Inside-front stats match what `useCookedStamps().summary` exposes; TOC lists only visible sub-regions and jumps on click.
- Each sub-region spread shows correct countries per `COUNTRY_TO_SUBREGION`; cooked slots are ink-stamped with date; uncooked slots are dashed placeholders.
- Empty-parent-region sub-regions hidden (Oceania case).
- Cooked-stamp click opens modal; each recipe link navigates to `/recipes/[slug]`.
- Uncooked-stamp click navigates to `/recipes?country=X` and the country filter is applied on arrival.
- Chevrons disable at ends; `←`/`→` flip; horizontal swipe flips on mobile; page indicator jumps.
- Deep link `/passport?spread=east-asia` opens that spread directly.
- URL updates on flip via `router.replace` without polluting history.
- Mobile ≤768px: single-page mode, no spine, flips one page at a time.
- `prefers-reduced-motion` disables rotate and shows opacity cross-fade.
- Zero-stamps user sees full booklet with placeholders; inside-front shows zeros.
- `npm run build` and `npm run lint` clean.
- Visual sanity at 1440, 1024, 768, 390 widths — no overflowing or overlapping stamps.

## Rollout

- Single PR.
- No feature flag — the existing passport feature is unauthenticated, low traffic, and this replaces it wholesale.
- No DB migration, no env changes, no new runtime dependency.
- Deletes four obsolete passport components after confirming no external imports.

## Open items for spec review

- User to review proposed `COUNTRY_TO_SUBREGION` mapping once drafted.
- User to confirm back-cover "Highlights" count (currently proposed as 3–5 most-recent stamps).
- Confirm cover text copy ("Culinary Passport") and whether the user's name/handle should appear on the cover — currently the design omits it since the app has no auth.
