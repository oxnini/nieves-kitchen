# Nieves Kitchen — Pre-Launch Design Critique

**Date:** 2026-05-17
**Scope:** Full app UX and design review for ship-readiness
**Method:** Independent LLM design review + automated detector scan (`npx impeccable --json app components`)

---

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|------:|-----------|
| 1 | Visibility of System Status | 3 | Map zoom changes are silent; no "searching…" state on `MapSearch` |
| 2 | Match System / Real World | 4 | Passport metaphor (visa, stamp, № 03/12, "Culinary Diplomat") is fully earned |
| 3 | User Control and Freedom | 3 | `RecipeModal` close calls `router.back()` — deep-linked users get popped off the site |
| 4 | Consistency and Standards | 3 | `FilterPanel` slide-out and `/recipes` inline search/sort duplicate filtering UIs |
| 5 | Error Prevention | 3 | Servings stepper has no upper bound; ingredient amounts will overflow at high N |
| 6 | Recognition Rather Than Recall | 3 | Icon-only controls on `WorldMap` sidebar (RotateCcw, ChevronRight, X) |
| 7 | Flexibility and Efficiency | 2 | No keyboard shortcuts beyond Esc and map ±; no saved filter combos; no recent searches |
| 8 | Aesthetic and Minimalist Design | 4 | Editorial restraint is the strongest dimension — Cutive kickers, dotted ledger rules, drop caps that actually render |
| 9 | Error Recovery | 2 | Silent fallbacks: failed stamp images, topology fetch errors, stale favorited slugs all degrade quietly |
| 10 | Help and Documentation | 2 | `PassportHelpModal` exists but is buried at the leading edge of the chip strip; world map has only a one-shot hint |
| **Total** | | **29/40** | Upper "real interface" band — ship-capable, not yet exemplary |

## Anti-Patterns Verdict

**Not AI-generated.** Both assessments agree, independently:

- **Deterministic scan**: `npx impeccable --json app components` → empty findings array, exit 0. Zero matches across all 25 detected patterns (gradient text, glassmorphism, dark glows, hero metrics, generic card grids, etc.) across 65 component files.
- **LLM review**: Tight five-color OKLCH-tuned warm palette, deliberate font picks (Cutive Mono specifically because it only ships at 400, Courier Prime to complement), `text-wrap: balance/pretty` globally, tabular figures on every count, `mix-blend-multiply` stamp compositing with a non-multiplied cancellation overlay — these are fingerprints of an actual designer, not a generator.

The few AI-shaped patterns that exist (rounded-2xl cards, four-pill nutrition stats, lucide icons) appear in their *editorial cookbook* register, not their SaaS register.

## Overall Impression

This ships. It does not yet *land* the way it could. The passport overlay, the choropleth + zoom-banded label crossfades, the `/about` page, and the recipe detail layout all sit at "publication-grade." But the `/recipes` index header reads like a Notion query result, the WorldMap's icon-only sidebar will trip first-timers, and the highest-stakes button in the app — the Cooked stamp button — uses a dashed border that universally signals "placeholder." Three medium-effort fixes would move the score from 29 to a confident 34+.

**The single biggest opportunity:** the map and the passport never visually acknowledge each other on the main screen. The choropleth shows the *world's* recipe density; nothing shows *your* personal density. The two signature systems live in separate rooms.

## What's Working

1. **Stamp compositing** (`CountryStampSlot.tsx`). `mix-blend-multiply` on the stamp button + a non-multiplied cancellation layer with seeded jitter — the kind of detail you only get after fighting a real visual bug. Reads as printed matter, not CSS.
2. **The choropleth legend** (`ChoroplethLegend.tsx`). 24-stop gradient, animated `scaleX` hairline rule on mount, cross-faded subtitle when the zoom band changes, italic Literata at the 0/max ends, postal "FEWER … MORE" caps below. Would survive a print-design crit.
3. **Typography discipline.** Global `text-wrap: balance/pretty`, tabular figures everywhere counts appear, consistent 10–11px / 0.18–0.3em postal kicker tracking. `/about`'s 3.2rem terracotta Literata drop cap is a real editorial device that actually renders.

## Priority Issues

### [P0] `/recipes` header reads as SaaS filter-result, not publication
- **Why**: This is the front door to your catalog. The H1 ("All Recipes") plus the inline result string ("23 recipes found for 'lamb' in *Western Europe* clear · 3 filters active") undercuts the editorial promise the rest of the app makes.
- **Fix**: Magazine-style title block — editorial standfirst, count as a small kicker, removable filter chips below the title instead of inline `clear` underlines.
- **Command**: `/layout`

### [P0] WorldMap sidebar uses unlabeled icons
- **Why**: `RotateCcw`, `ChevronRight`, `X` carry critical navigation (reset zoom, back to region, close sidebar) with no labels. The map is the first screen most users see; if they can't tell these apart without hovering, they bounce.
- **Fix**: Add a 12px Cutive-Mono label under at least reset-zoom and back, or pair them with an inline region breadcrumb so the icons become recognition cues.
- **Command**: `/clarify`

### [P0] Servings stepper has no upper bound
- **Why**: `RecipeDetail.tsx:249` — `onClick={() => setServings(servings + 1)}` with no clamp. A user can crank it past reasonable values and ingredient strings overflow to "248.5 tbsp," breaking the layout. Reads as unfinished.
- **Fix**: Clamp to 12, round amounts to whole units or simple fractions at scale, format with `Intl.NumberFormat`.
- **Command**: `/harden`

### [P1] `CookedButton` reads as draft/disabled
- **Why**: `border-2 border-dashed border-brown-medium/40` is the most important CTA in the entire app (every passport stamp anchors here). Dashed borders universally signal placeholder, empty state, or drag target. The highest-stakes button looks the *least* like a button.
- **Direction chosen**: Real stamp artifact — notched corners / perforated-edge silhouette, not just solid border.
- **Command**: `/bolder` then `/polish`

### [P1] `RecipeModal` close strands deep-link users
- **Why**: `router.back()` on close (`RecipeModal.tsx:38`) pops the user off the site entirely if the modal was the first navigation after landing.
- **Fix**: Only `router.back()` if `window.history.length > 1`; otherwise route to the parent (`/` or `/recipes`).
- **Command**: `/harden`

### [P1] FilterPanel tags are unbounded and ungrouped
- **Why**: `{ALL_TAGS.map(...)}` renders every tag as a flat list of equal-weight chips. No grouping (Dietary / Occasion / Style), no progressive disclosure. Cognitive-load failure: >4 visible options without hierarchy.
- **Fix**: Group into 2–3 named sections within the same fieldset; hide tags beyond the first 8 behind a "More" disclosure.
- **Command**: `/distill`

### [P2] First-visit empty Passport doesn't earn the moment
- **Why**: A passport with zero stamps shows the same cover art as a Culinary Diplomat. The user's first opening of the signature feature is identical to a seasoned cook's, except for a small "New Explorer" title chip.
- **Fix**: When `summary.totalStamps === 0`, swap the cover subtitle to a one-line invitation in italic Literata, dim the stamp art to ~70%. The Contents spread's `NextChapter` block already nails this tone — bring it to the cover.
- **Command**: `/delight`

### [P2] Map and passport never acknowledge each other on the main screen
- **Why**: The choropleth shows *content* density; nothing shows the user's *personal* density. The two signature systems are siloed.
- **Fix**: Render a tiny visa-ink dot on country markers for stamped countries, or a 1.5px terracotta hairline on the country path.
- **Command**: `/delight` (then `/polish`)

## Persona Red Flags

**Jordan (First-Timer, lands on `/`)**
- Choropleth tints all read as variants of café-au-lait until they grok the legend (bottom-left, easy to miss).
- WorldMap sidebar's `RotateCcw` icon is unlabeled — clicks "back" expecting "reset zoom."
- `CookedButton`'s dashed border reads as "placeholder, not active yet."
- First time opening the passport: cover and tier ledger look identical to an experienced cook's. No "you are about to start something" register.

**Sam (Returning Weekend Cook — target user from CLAUDE.md)**
- No keyboard shortcuts beyond Esc — wants `f` to focus search, `[` `]` to flip passport pages, `/` for global search.
- Map markers don't show which countries she's already stamped, so she has to open the passport to remember.
- No "saved filter combos" — has to rebuild "lamb + 30min + Middle East" every week.
- Favoriting and cooking feel like two parallel ladders; would expect favorited recipes to appear as faint pre-stamp outlines inside the passport.

**Alex (Power User, deep-linked from a friend's share)**
- Opens `/recipes/lamb-shawarma` directly → modal renders → closes → `router.back()` exits the site. Worst possible introduction.
- `?country=XX` URL param gets silently consumed into `filters.regions`, so the URL no longer reflects state — can't bookmark a country filter.

## Minor Observations

- `MapSearch` dropdown is fixed `w-72`; can clip below viewport on small phones. Needs `max-w-[calc(100vw-2rem)]`.
- `RecipeCard` `BLUR_PLACEHOLDER` is a single shared blur for every card; per-region tint blurs would be a brand flex.
- Navbar underline indicator is missing from passport affordance and theme toggle — small inconsistency.
- `RecipeDetail` Substitutions/Storage/Tips stack three different accent colors (sage/teal/turmeric) — the only place in the app where multiple accents pile up. Reads slightly more "feature cards" than editorial.
- `ThemeToggle` icon is inverted from web convention (shows the *target* state, not the current state).
- Cutive Mono is everywhere — likely overspent. Audit call sites and prune ~30% so the remaining ones land harder.
- `1338-line WorldMap.tsx` is structurally fragile; not a UX issue but a ship-quality flag if a hotfix is needed mid-launch.
- Back cover of the passport offers no "you've reached the end" copy.
- Confetti: 140 particles at velocity 45 reads a touch carnival for the editorial voice; 80–100 with gravity 0.8 would land more grown-up.

## Questions to Consider

1. The map and passport never talk on the main screen — what if a stamped country had a tiny visa-ink dot on its marker?
2. Favoriting and cooking are two emotional ladders. What if "favorited" became a pre-stamp outline inside the passport, making the journey legible?
3. `/passport` exists as a route but the in-app experience is always an overlay. Delete the route or commit to it as `/passport/[user]` for sharing — the current dual-mount is doing neither job cleanly.
4. "Curate the journey" is the FilterPanel subtitle. Filters are about *removing*, not curating. Is there a "Trip Planner" framing where sliders become "How much time tonight?" and regions become "Which corner of the world?"
5. Cutive Mono appears on № 03/12, postal kickers, ledger labels, colophon, region tags, RecapRow counts. Where does it stop being signature accent and start being body copy?

---

## Action Plan

### Round 1 — shipped 2026-05-17

Scope: Top 3 P0 ship-blockers, plus the modal-close fix bundled with the servings clamp, plus a /polish pass.

- [x] **P0 · `/layout`** — Reworked `/recipes` header into magazine title block. Postal kicker, editorial H1 ("Recipes from everywhere"), italic standfirst, full-container-width hairline rule, prominent count (`text-base sm:text-lg` Cutive Mono), removable filter chips covering all 8 filter dimensions. `FilterChip` helper added matching FilterPanel's `rounded-[3px]` postal-stub vocabulary. Removed inline `clear` text-links and the unused `activeRegion` / `clearRegion` derived state.
- [x] **P0 · `/clarify`** — Converted the Reset zoom button in `components/WorldMap.tsx` from icon-only circle into icon + "Reset" pill (Cutive Mono 10px). Shape change visually distinguishes "discrete reset" from "continuous +/− zoom". Added `title="Close"` hover tooltip to the sidebar X.
- [x] **P0 · `/harden`** — Clamped servings stepper to `MIN_SERVINGS=1` / `MAX_SERVINGS=24` in `components/RecipeDetail.tsx`. Both ± buttons show disabled state at the cap (opacity 35, no-hover bg). Initial `useState` also clamps so a malformed `recipe.servings` can't escape the range. Bundled P1: `RecipeModal` `close()` now guards on `window.history.length <= 1` and falls through to `/recipes` instead of popping the user off-site.
- [x] **`/polish`** — Consistency pass verified across all four changed files; TypeScript clean.

**Mid-round adjustments** (from user feedback during round 1):
- [x] Standfirst em dash replaced with colon ("globally-inspired halal recipes: tried, tested, and personally loved").
- [x] Count typography enlarged from 11px to `text-base sm:text-lg`, color bumped to `text-brown-dark`, tracking tightened from 0.28em to 0.22em.
- [x] Meta row (rule + count + chips) moved out of the `max-w-3xl` header into a sibling of the search-bar container so the hairline rule spans the same width as the search input.

### Round 2 — queued

Recommended order:

- [x] **P1 · `/bolder`** — `CookedButton` rebuilt as a real perforated postal-stamp silhouette in `components/CookedButton.tsx`. CSS-mask perforated edge (5px bite × 11px tile, four-edge `mask-composite: subtract`), inner ink frame inset 9px from the perforations, terracotta wash + parchment ink on stamped state with three SVG wavy cancellation marks sweeping across (`pathLength` 0→1 staggered ~60ms). Rubber-stamp press on tap (`scale 0.96, rotate -2.4°`), gentle thunk on success (`rotate -1.6°, scale 1.015`). Removed `border-dashed`; focus ring is a 2px turmeric outline at 6px offset so it tracks the bounding box outside the perforations. Three states preserved: idle / `LOGGING…` / `STAMPED`. `/polish` pass still queued.
  - **Revision (same day, post-feedback)**: dropped lucide icons entirely (ChefHat / Check / Loader read as generic UI), dropped the fake `№ 01` / `KITCHEN` corner marks (no meaning), replaced with a three-line editorial stack — top kicker `PASSPORT ENTRY` (9px, 0.42em), hero `I COOKED THIS` bumped to 19px Cutive Mono with 0.18em tracking, bottom postmark band rendered as today's date (`17 · MAY · 2026`) which doubles as the cancellation date on the stamped state. Toast now delayed 1000ms so the stamp animation can finish before the floating toast covers it. Hover wash uses a flat low-alpha turmeric overlay instead of `mix-blend-multiply` so it works in both parchment and sepia. Date uses `suppressHydrationWarning` to avoid SSR/client timezone drift warnings.
  - **Revision 2 (same day, post-feedback)**: model change — **one stamp per recipe**, enforced at the UI. `useCookedStamps` is now read inside the component; `isStamped` is derived from whether a row exists for `recipe.id`, with a local `justStamped` optimistic flag bridging the mutation round-trip. Tapping a stamped button is a no-op (`disabled`). This aligns with `useCookedStamps.ts:142` / SPEC §3 which already treats stamps as one-cancellation-per-unique-recipe, eliminates the rapid-spam Supabase rate-limit error the user hit, and removes the entire `repeat` tier from user-facing strings (toast title/body for `repeat` are gone; mutation tier still computed for confetti gating). Stamped state redesigned: dropped the wavy SVG cancellation marks (read as "active" not "done"), permanent `-2.5°` tilt, deeper terracotta ink (`oklch(0.56 0.14 32)`) with a darker top-left inner ink-bleed radial suggesting where the stamp first kissed paper, parchment-cream text, hero label changes from `I COOKED THIS` → `COOKED` (past tense reads as completed record, not active CTA), postmark date band shows the actual `cooked_at` from the stored stamp. Toast still appears for `new_country` / `new_recipe` celebrations (with confetti). Toast's `Undo` button moved to a quiet inline `UNDO STAMP` link below the stamp — always available while stamped, not only for ~6s. Inner ink frame tightened: inset `9px` → `7px`. Content padding tightened: `py-6 px-8` → `py-4 px-6`. Min-height `104px` → `88px`. `initial={false}` on the motion.button so an already-stamped recipe doesn't animate-in on page load.
  - **Revision 3 (same day, post-feedback)**: stamped state pared back further — user found the terracotta wash + permanent `-2.5°` tilt + ink-bleed too dramatic for what should read as a quiet "this has been recorded" state. Now the background stays parchment-dark in both states (same paper, no wash), no tilt, no ink-bleed gradient. The signal is exclusively: (a) hero label changes to `COOKED` in terracotta ink, (b) inner frame picks up a faint terracotta tint (`oklch(0.55 0.13 35 / 0.45)`), (c) date band opacity lifts from 0.5 → 0.7 since it's now a real cancellation date. Editorial restraint: the stamp acknowledges it's marked without shouting.
- [x] **Celebration mechanic — reverted to confetti only, no success toast.** Two prior attempts at a celebratory toast (the `bg-brown-dark rounded-2xl` SaaS card and then the perforated `CelebrationTicket` stub) both landed on top of other UI no matter where they were positioned (bottom: covers the stamp; top: covers the navbar / recipe title). User concluded the celebration shouldn't be a floating popup at all — the stamp itself is the visual record, and the moment can be carried by the stamp transition plus a quick confetti burst. Final state:
  - `CelebrationTicket`, `TICKET_MASK_STYLE`, `StampSparkles`, `SPARKLE_GLYPHS`, `Sparkle`, `makeSparkles`, `viewPassport`, and related imports (`useRouter`, `usePassportOverlay`, `regionSlug`, `useMemo`) all removed.
  - `ToastData` collapsed to `ErrorToast { message: string }` — toast infrastructure is now error-only. The bottom-centered `bg-paprika` error card is preserved (still needed when a cook log or undo fails).
  - `fireConfetti` is back (`canvas-confetti`, original 140-particle / velocity-45 behavior for `new_country`, 50-particle / velocity-30 for `new_recipe`, three-burst sequence for `new_country` preserved).
  - **Color change**: dropped paprika from the palette (its hot red read "party store" against the warm parchment of the rest of the site) and added brown-medium for warm earth grounding. New palette pulled from CSS tokens via `getConfettiColors`: terracotta, turmeric, sage, brown-medium. Auto-themes between parchment and sepia. Fallback hex array updated to match.
  - **Tuning pass (2026-05-18)**: confetti made more noticeable + more on-brand. Spread widened (`90 → 120` main, `120 → 140` side bursts) for more presence. Particle counts bumped (`140 → 160` main, `50 → 70` recipe, `60 → 70` side bursts). Editorial defaults added to the shared `base` config: `gravity: 0.8` (slower fall — paper drifting down, not rain), `ticks: 280` (particles linger ~3–4s instead of flashing by), `scalar: 1.1` (~10% bigger so each piece reads as printed matter, not a speck), `shapes: ['square']` (paper-confetti aesthetic, no mixed circles), `disableForReducedMotion: true` (respects `prefers-reduced-motion`). Together these address the audit's "carnival" critique while keeping the confetti as the celebration mechanic the user wanted.
  - `canvas-confetti` package re-active in the bundle (it was never removed from `package.json`; the prior "unused dep" note is now stale).
- [x] **P2 · `/delight`** — Empty-passport first-visit cover treatment in `components/passport/CoverPage.tsx`. When `summary.totalStamps === 0`, the seal dims to `opacity-70` and the subtitle swaps to `"Cook a recipe to earn your first stamp."` in italic Literata (`font-heading italic text-brown-dark/75`). Pulls the `NextChapter` tone forward to the cover.
- [x] **P2 · `/delight`** — Map and passport now acknowledge each other on `/`, and the same indicator extends to `/recipes`. Built via the `/dev/cooked-indicator` scratch route: user compared four map treatments (outline / fill tint / hatch / corner dot) and four card marks (border / corner glyph / ribbon / wash), locked in **diagonal hatch on the map** and **wavy cancellation glyph on cards**, both in `var(--stamp-ink-terracotta)`.
  - **Map (`components/WorldMap.tsx`)**: added an SVG `<pattern id="cooked-hatch">` (3.6×3.6 user-space tile, 0.6px line rotated 45°, opacity 0.6) and a second `Geographies` layer that fills every country in `passportSummary.uniqueCountries` with `url(#cooked-hatch)`. `stroke="none"`, `pointerEvents: 'none'`. Pattern lives inside `ComposableMap` so it sits in the projected coordinate space and scales naturally with zoom — the cartographic "visited territory" convention. Replaces the earlier terracotta hairline outline (too bright in parchment mode).
  - **Cards (`components/RecipeCard.tsx`, `app/recipes/page.tsx`)**: new `components/CookedStampMark.tsx` — three wavy ink strokes + Cutive Mono "COOKED" caption, tilted -8°, no enclosing shape, sized to a 62px width on cards. Rendered top-left of the card image overlay; when both `isCooked` and `isFusion` are set, the FUSION pill shifts to `top-14` so the stamp owns the top corner. `/recipes` derives `cookedRecipeSlugs` from `useCookedStamps` and passes `isCooked` per card.
  - `--stamp-ink-terracotta` (`oklch(0.45 0.09 35)`) chosen over the brighter `--color-terracotta` for a quieter "ink on paper" register that holds up against food photography and the warm choropleth.
  - `/polish` pass (entry animation when a stamp is newly added, contrast helper for the stamp on dark food photos) still queued.
- [x] **P1 · `/distill`** — `FilterPanel` tags grouped via `TAG_GROUPS` (Dietary / Style / Occasion) with subgroup labels; tags beyond the first 8 hidden behind a `+ N more` / `Show fewer` disclosure (`components/FilterPanel.tsx:133,273-309`).
- [x] **Em-dash sweep** of user-facing website text. Verified clean: `grep "—"` across `app/`, `components/`, `lib/mock-recipes.ts` returns only code comments and the `/dev/*` scratch routes — no user-facing strings. Per the no-em-dashes-in-website-text rule (2026-05-17).

### Round 3 — minor observations

Bundle into one polish pass once the above is done:
- [x] `MapSearch` dropdown can clip below viewport on small phones; needs `max-w-[calc(100vw-2rem)]`. *(Shipped 2026-05-18: added to the dropdown classes at `components/MapSearch.tsx:238`.)*
- [ ] Navbar underline indicator missing on passport affordance and theme toggle.
- [ ] `RecipeDetail` Substitutions/Storage/Tips stack three different accent colors (sage/teal/turmeric); only place in the app where multiple accents pile up. Reads slightly more "feature cards" than editorial.
- [ ] `ThemeToggle` icon is inverted from web convention (shows target state, not current).
- [ ] Cutive Mono likely overspent. Audit call sites and prune ~30%. *(Deferred post-launch — refactor.)*
- [x] Back cover of passport offers no "you've reached the end" copy. *(Shipped 2026-05-18: one-line italic Literata closer "End of journal. Begin a new volume?" added under the title cartouche in `components/passport/BackCoverSpread.tsx`, theme-locked via the parent `passport-cover` class.)*
- [x] Confetti at 140 particles / velocity 45 reads a touch carnival for the editorial voice; try 80–100 / gravity 0.8. *(Shipped in the 2026-05-18 tuning pass — `gravity: 0.8`, `ticks: 280`, `scalar: 1.1`, `shapes: ['square']`, particle counts retuned. Verified in `components/CookedButton.tsx:251-277`. Note: the audit suggested lowering particle count; the actual tuning kept counts up but slowed gravity + extended ticks, which addresses the "carnival" critique through duration and shape vocabulary rather than density.)*
- [ ] `components/WorldMap.tsx` is 1338 lines; structurally fragile if a hotfix is needed mid-launch. Not a UX issue but a ship-quality flag. *(Deferred post-launch — refactor.)*

### Round 3 — shipped 2026-05-18

Scope: the cheap, visible minor observations that could land before launch. Two structural refactors (Cutive Mono prune, `WorldMap.tsx` split) explicitly deferred post-launch.

- [x] **MapSearch viewport clip** — dropdown now caps at `max-w-[calc(100vw-2rem)]` so it stays inside the viewport on ~<320px widths (`components/MapSearch.tsx:238`).
- [x] **Passport back-cover closer** — added a single italic Literata line ("End of journal. Begin a new volume?") below the title cartouche in `components/passport/BackCoverSpread.tsx`, matching the editorial tone of `NextChapter` and the `/about` voice. Theme-locked via the parent `passport-cover` class (parchment regardless of theme).
- [x] **Stale checkbox cleanup** — Round 2 entries for empty-passport cover treatment, FilterPanel distill grouping, and the em-dash sweep were already shipped in earlier sessions and are now reflected in the Action Plan.
- [x] **Confetti tuning bullet** — reflected against the actual 2026-05-18 tuning pass (gravity / ticks / scalar / square shapes); explanatory note added so future readers can reconcile the audit's "lower count" suggestion against the shipped approach.

### Verification

Re-run `/critique` after each round to verify the score moves from 29/40 → 34+ → 36+.
