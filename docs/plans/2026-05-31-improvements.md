# Nieves Kitchen — Improvements Plan, May 2026

> Source: multi-agent audit pass run on 2026-05-31. The non-feature work (perf, CI, image re-encode, schema migration, data-layer bug fix) shipped that same day. This doc captures the **feature** ideas the audit surfaced. Each entry is a brief, not an implementation plan — when a feature gets greenlit, it earns its own dated plan doc next to this one.
>
> Order below is a recommended ship order, not a contract. Read top-to-bottom for the rationale.

---

## TL;DR — what to ship next, and why

| # | Feature | Effort | Why it lands first |
|---|---------|--------|--------------------|
| 1 | Stamp-press celebration | S | All primitives exist; the single largest "soul of the product" moment in the codebase, unshipped. |
| 2 | Cold-start passport invitation | S | Without it, a zero-stamp user opens the booklet to a void. Pairs naturally with #1. |
| 3 | Region essays | M (writing-bound) | Fills the largest dead surface in the booklet (`EmptyRegionSpread`) with the brand's actual editorial voice. |
| 4 | Recipe hero editorial polish | S | Removes the most SaaS-looking surface in the app. Pure styling pass. |
| 5 | Passport affordance redesign | S | Elevates the soul-feature out of icon-equivalence with the theme toggle. |
| 6 | Servings scaler + mise-en-place | M | The two practical features Cook Mode is missing. Closes the loop on already-shipped infra. |
| 7 | Unify map ↔ catalogue filter state via URL | M | Closes the biggest journey gap. Less viscerally exciting than 1–3 but every other feature gets cheaper after this lands. |
| 8 | `WorldMapDesktop.tsx` split (refactor, not feature) | L | Pulled out of the audit-day execution because of regression risk without tests. Recommended after CI proves green for a couple of weeks. |

Deferred for now: Visa Patina, Year in Stamps, Margin Notes, Postcard OG, Region Seals + Diplomat's Suggestion. Notes at the end.

---

## Locked design principles (apply to every entry below)

1. **No em dashes in user-facing strings.** Doc/comment/commit em dashes are fine; UI copy uses commas, colons, periods, or two-word recasts.
2. **Voice is "thoughtful friend with a linen-bound book."** Never SaaS, never food-delivery, never AI-sous-chef-chatbot. Every microcopy decision passes the "would this read OK in a printed cookbook" sniff test.
3. **Delight at milestones, calm everywhere else.** Confetti, motion, postal flourish are reserved for the moments that matter. The rest of the app stays editorial-quiet.
4. **No faces in any generated image or stamp.** Use silhouettes, abstract forms, or omit.
5. **The passport is the soul.** When a feature can touch the passport without being kitsch, prefer that placement over a new surface.

---

## 1. Stamp-press celebration

**Pitch.** When `useLogCook` returns `tier === 'new_country'`, the passport overlay opens to that country's spread and animates the country's ink-impression onto the page with a kinetic stamp-press: scale 1.6 → 1.0, rotate ~+4° → 0°, opacity 0 → 1, with a brief shadow burst and a quiet confetti pop in the country's stamp palette.

**Why it fits.** This is the moment a curious cook becomes a collector. Every primitive already exists: `useLogCook` returns the tier; `PassportOverlayProvider.open()` accepts an origin; `PassportBooklet` can jump to a region/country spread; `canvas-confetti` is already in deps; the country stamps are already rendered transparently. This is an assembly job, not a build.

**Surface area.**
- `components/CookedButton.tsx` — call `passportOverlay.open()` on `new_country` tier success.
- `components/passport/PassportOverlay.tsx` — accept an optional `initialFocus: { country: string; animateStamp: boolean }` so the overlay opens to the right page and signals the spread.
- `components/passport/Spread.tsx` (or `CountryStampSlot.tsx`) — when the stamp-press signal is live, render the stamp with a framer-motion keyframe instead of the default static fade.
- `hooks/usePassportOverlay.ts` — add an `openAt(country)` variant; the existing `open()` stays the default.
- `lib/passport-origin.ts` — already stores click origin; extend to also carry the spread target.

**Constraints.**
- `prefers-reduced-motion`: shorten the keyframe to a 1.0 → 1.0 cross-fade (no scale, no rotate), no confetti. Already a project-wide pattern (`globals.css:432`).
- The celebration must not fire on `tier === 'new_recipe'` or `'repeat'`. Those are quieter moments; over-firing destroys the scarcity.
- If the user is already in the passport overlay when they cook from a different surface, the spread should animate in place (don't close/reopen).

**Effort: S** (1–2 days end-to-end with the verification pass).

**Verification.**
- Cook a recipe from a country you've never cooked from → overlay opens to that spread, stamp presses onto the page, confetti fires once, focus traps inside overlay.
- Cook a second recipe from the same country → no celebration, normal toast.
- Toggle `prefers-reduced-motion` → no kinetic animation, just appears.

---

## 2. Cold-start passport invitation

**Pitch.** A zero-stamp user who opens the passport today sees an empty cover. Instead, the cover spread shows a one-line invitation in `font-stamp` ("Stamp #1: cook anything tonight") and a single recommended recipe card drawn from `recommendNextRecipes()`. One affordance, one path forward.

**Why it fits.** First impression of "the soul of the product" should be a story-starter, not a void. `lib/passport-recommend.ts` already exists and handles the empty-state case; we just don't surface it on the cover.

**Surface area.**
- `components/passport/CoverSpread.tsx` — branch on `summary.totalStamps === 0` to render the invitation block.
- `components/passport/InsideFrontSpread.tsx` — possible alternate home for the invitation; pick whichever feels more like the spread you actually open to first.
- `lib/passport-recommend.ts` — extend if needed to return the seed pick deterministically (so refreshing the booklet shows the same suggestion until the user cooks).

**Constraints.**
- The recommended recipe must be clickable from inside the booklet and open in the intercepting modal route (`@modal/(.)recipes/[slug]`) — the booklet stays open, the recipe layers on top. If that nesting is awkward, accept that clicking the recommendation closes the booklet first.
- Copy: no em dashes. "Stamp #1: cook anything tonight." or "Your first stamp is one recipe away."
- Once `totalStamps >= 1`, this invitation never appears again. Don't gamify the transition.

**Effort: S** (1 day).

**Verification.**
- Anonymous session with no stamps → open passport → see invitation + one recipe pick.
- Cook that recipe → close and reopen passport → invitation gone, normal cover renders.

---

## 3. Region essays

**Pitch.** A 250–350-word signed editorial essay per `CulinaryRegion` (11 total), rendered on the empty region spread (replacing `EmptyRegionSpread`'s placeholder text) and accessible from a small "About this region" affordance on filled region spreads.

**Why it fits.** The brand brief literally demands editorial depth ("publication, not product"). Empty spreads are the largest dead surface in the booklet. This is also the cheapest way to make the booklet feel like a *book* rather than a tracker.

**Surface area.**
- `lib/region-essays.ts` (new) — `Record<CulinaryRegion, { kicker: string; body: string; signedBy?: string }>`. Body is plain string (single paragraph) or array of paragraphs.
- `components/passport/EmptyRegionSpread.tsx` — render the essay if present.
- `components/passport/Spread.tsx` — add a small `font-stamp` "About this region" link in the corner; tapping flips to a sub-spread or opens a quiet sheet.
- `app/about/page.tsx` — possible secondary surface (a "Regions" section that lists all 11 with their essays); skip if it clutters About.

**Constraints.**
- Voice: thoughtful friend with margin notes. Not Wikipedia. Not blog-post. Two to four sentences per paragraph.
- No em dashes. Many essays will want them — use commas, semicolons, or recast.
- Signed by "Nieves" or an editorial pseudonym. Single signature across all 11 — the voice is one person.
- Essays should reference at least one recipe in the region by name (gives the user a thread to pull).

**Effort: M** (writing-bound; engineering is ~half a day, the 11 essays are the cost).

**Dependencies.** None — this is the most independent feature in the doc.

**Verification.** Open every region spread (empty and filled) and confirm the essay or affordance reads as intended.

---

## 4. Recipe hero editorial polish

**Pitch.** Strip the SaaS-style overlay pill buttons (`bg-[#1A1210]/30 backdrop-blur-sm` for Copy Recipe and Favorite) off the recipe hero. Move both actions into a quieter `font-stamp` postal-stub treatment under the AttributionLine, where they read as marginalia rather than CTAs.

**Why it fits.** The brief explicitly rejects "food-delivery / aggressive CTA" surfaces. The recipe hero is the moment of truth for a curious cook — it should let photography, title, and country carry the weight, the way a cookbook spread does. Today's pill buttons are exactly the anti-reference.

**Surface area.**
- `components/RecipeDetail.tsx` — remove the floating pill cluster (~lines 229–260 area; verify).
- `components/recipe/AttributionLine.tsx` — extend to host the Copy + Favorite affordances inline as quiet links.
- New treatment: stamp-mono small caps, hairline rule, terracotta hover. Match the postmark visual grammar without being literal.
- `useFavorites` is already the cross-component shared store as of the May 31 work, so the heart state will mirror anywhere it's shown.

**Constraints.**
- Copy/favorite must still be discoverable at the same screen-real-estate level — don't bury them three sections down. Postal-stub doesn't mean "hidden."
- Mobile: don't reintroduce the pill on small screens. The marginalia treatment must work in both layouts.
- Sepia mode: arbitrary hex (`#1A1210`) gets replaced with `brown-dark/parchment` tokens so the sepia override block in `globals.css` actually applies.

**Effort: S** (1–2 days including microcopy review).

**Verification.**
- Recipe page in parchment: no overlay pills, Copy + Favorite read as quiet inline links under attribution.
- Same in sepia: same treatment, no contrast regressions.
- Mobile (`useIsMobile` viewport): no pill buttons. Affordances reachable.

---

## 5. Passport affordance redesign

**Pitch.** Replace the 36-px icon next to ThemeToggle with a "folded paper corner peek" affordance: a small triangular paper-fold suggestion in the navbar, with the user's tier title set in `font-stamp` beside it ("Wanderer", "Curious Cook", etc.). The whole thing reads as "your passport is tucked here" rather than "settings."

**Why it fits.** Today the soul-feature has the same visual weight as a settings toggle. Tier titles already exist (`lib/passport.ts#EXPLORER_TITLES`); they're just unsurfaced. The redesign gives the user something subtly to be proud of in their permanent UI chrome.

**Surface area.**
- `components/passport/PassportAffordance.tsx` — primary file. The icon-only render becomes a folded-corner SVG + a stamped-mono label.
- `components/Navbar.tsx` — possibly reorder so the affordance gets a slightly more prominent slot, demoting Favorites to a hover/secondary group.
- The existing origin-scale open animation stays; lean into it, don't replace it.

**Constraints.**
- Mobile: must remain compact. The folded-corner can survive without the label on small screens; show only the title prefix.
- Anonymous-zero-stamp users: hide the tier label (no "New Explorer" yelling next to the icon when there are no stamps); show only the affordance, let the cold-start invitation (feature #2) do the storytelling once they open.
- Don't break the existing prefetch-on-hover behavior for `PassportBooklet` and the static stamp assets.

**Effort: S** (1–2 days).

**Verification.** Manual eyeball pass; the only "regression" is aesthetic. Confirm prefetch still fires.

---

## 6. Servings scaler + mise-en-place mode

**Pitch.** Two practical features Cook Mode is missing:

- **Servings scaler:** scale-to-1/2/4/6/8 at the top of the ingredients list. Quantities re-amount live; steps highlight any token (`2 tbsp`, `1/2 tsp`) that scales so the cook can see what changed.
- **Mise en place mode:** before "Begin Cooking," a one-screen pre-flight: every ingredient as a checklist, units pre-flipped to the user's `useUnitPref`. The Cook Mode entry button is disabled until the cook acknowledges the list.

**Why it fits.** Cook Mode is already built. These are the two omissions that keep the existing infrastructure from being end-to-end usable. Servings scaling is the most-requested feature in any recipe app; mise-en-place is the cookbook discipline the editorial voice should embody.

**Surface area.**
- `lib/recipes/amount-detect.ts` (new) — sibling of `lib/recipes/duration-detect.ts`. Detects `quantity + unit` tokens for both highlighting and scaling.
- `lib/recipes/scale.ts` (new) — pure functions: scale ingredient quantities, format fractions cleanly (1/2, 3/4, 1 1/3), respect the unit pref.
- `components/recipe/IngredientGroupList.tsx` — render scaled amounts.
- `components/recipe/InstructionGroupList.tsx` — render token highlights.
- `components/recipe/ServingsScaler.tsx` (new) — the segmented control above ingredients.
- `components/recipe/MisePlaceCheck.tsx` (new) — the pre-flight checklist.
- `components/recipe/CookModeToggle.tsx` — gate Cook Mode entry behind mise completion (or "skip" affordance).
- `hooks/useMisePlaceState.ts` (new) — sessionStorage-keyed per slug; cleared when Cook Mode ends.

**Constraints.**
- Scaling must respect the schema's grouped shape (Phase 1 of the recipe-detail-v2 plan landed this).
- Don't auto-scale nutrition — that's per-serving and would mislead.
- "Skip mise" must be available, but require an explicit interaction (one tap). The point is to add discipline, not friction.
- Half-amounts of "1 egg" should round up with a note ("1 large egg (recipe halves cleanly except eggs)"), not display "0.5 egg."

**Effort: M** (3–5 days; the amount detector is the trickier half).

**Verification.**
- Open a recipe, scale to 4x, ingredients amounts visibly update, step tokens highlight.
- Enter Cook Mode without checking mise → see the checklist, can't proceed until acknowledged.
- Skip mise → proceed normally.
- Refresh in the middle of mise → state persists per slug via sessionStorage.

---

## 7. Unify map ↔ catalogue filter state via URL

**Pitch.** Today the homepage (map) and `/recipes` (catalogue) each have their own filter state. Carrying a country/region across pages throws filters away and feels broken. Move `Filters` to a serialised URL query and let both surfaces read from it.

**Why it fits.** This is the journey gap audit-flagged as "the biggest hand-off break in the app." It's also a foundation: every later feature that wants to deep-link into a filtered view (Year in Stamps, shareable searches, recommended-region links) becomes free.

**Surface area.**
- `lib/filters.ts` — add `filtersToQuery(f)` and `queryToFilters(q)` round-trip functions; defaults stay implicit (omitted keys).
- `hooks/useFilters.ts` (new) — wraps `useSearchParams` + `useRouter.replace`; returns the same `[Filters, setFilters]` API consumers use today.
- `app/page.tsx`, `app/recipes/page.tsx`, `components/FilterPanel.tsx` — switch to the new hook.
- `MapSearch.tsx` and the catalogue search box — share the `search` query param.
- Active-chip strips on both pages link to one another (a chip on `/recipes` becomes a "show on map" link; a sidebar header on `/` becomes "see all from {country}" → `/recipes?country=…` which already works partially).

**Constraints.**
- The URL must stay short and human-readable. Use kebab-case region keys, comma-separated tag lists. No JSON-in-URL.
- `useRouter.replace` (not `push`) on filter changes so the browser back button still goes back to wherever the user came from.
- Mobile: don't fight the bottom-sheet's existing UX; the URL becomes the source of truth, the sheet just renders it.

**Effort: M** (3–4 days including the chip cross-linking).

**Verification.**
- Filter on `/recipes` → copy URL → open in incognito → same view loads.
- Click country marker on map → navigate to `/recipes` via navbar → country filter pre-applied.
- Browser back button behaves as expected through several filter changes.

---

## 8. Split `WorldMapDesktop.tsx`

**Pitch.** Not a feature — a 1,364-LOC refactor to split the map component into focused hooks: `useWorldMapPanZoom`, `useRegionDrill`, `useMarkerLayer`, `useChoroplethBand` (already half-extracted). The file currently does pan/zoom state, region drill, marker culling, choropleth fill, search wiring, and sidebar interaction in one render function.

**Why it fits.** Every map change today requires re-reading 1,400 lines. This is the single largest impedance to future map work. Pulled out of audit-day execution because the lack of test coverage made a refactor of this size risky.

**Surface area.**
- `components/WorldMapDesktop.tsx` — shrinks to ~300–400 LOC of orchestration.
- New: `hooks/map/usePanZoom.ts`, `hooks/map/useRegionDrill.ts`, `hooks/map/useMarkerLayer.ts`, `components/map/MarkerLayer.tsx`, `components/map/SidebarPanel.tsx`.
- `WorldMapMobile.tsx` is a totally different implementation; it's out of scope.

**Constraints.**
- Zero behavioural change. Visuals identical, pan/zoom feel identical.
- Land *after* the GitHub Actions typecheck workflow has been green for at least a week — the safety net is the only reason this isn't terrifying.
- Land in one commit, not a string of refactor commits, so it's easy to revert if a regression slips through.

**Effort: L** (1 week with thorough manual testing).

**Verification.** Same as the May 31 inline edits: tsc clean, build green, manual pan/zoom across all zoom bands, sidebar interaction at desktop and at the desktop-mobile breakpoint.

---

## Deferred (not in this plan)

These came up in the audit and are good ideas, but earn their slot only after the above lands. Captured here so they're not lost.

- **Visa Patina** — earned overprints (faint secondary ink wash at 3 unique recipes, hairline border at 5). Ship after Region Seals or it muddies the repetition signal.
- **Region Seals + Diplomat's Suggestion** — completion mark on regions; recommender prioritises "closest to completing." Both depend on the essays (#3) being in place so completion feels like finishing a chapter.
- **Margin Notes** — optional 140-char journal entry attached to a cancellation. Schema change + popover; lovely but the smallest scope-fit gain of any feature here.
- **Year in Stamps** — annual auto-generated spread. Seasonal; revisit in Q4.
- **Postcard OG images** — `@vercel/og` recipe-share card with stamp + cookbook typography. Free distribution channel; cheap to add but probably not the #1 thing to pull forward.
- **Tonight's Flight** — a curated three-recipe theme on the homepage. Cheap to ship but raises the question "what *is* the homepage?" — defer until after #7 lands and the map/catalogue handoff is clean.
- **Compass Match** — flavor-vector similarity recommendations. Strongest tie to existing data (`flavor_profile`); waits for #3 + #6 to land so the recipe page is editorial enough to host it.

## Out of scope forever (call-outs from the audit, not features)

- **Voice sous-chef / AI narration.** The brand voice is a person, not a service. Pre-rendered TTS is a year-3 conversation at earliest.
- **Printed PDF export of the passport.** Beautiful idea, but the content needs to be much richer (essays, journal notes, completion seals) before the export is worth opening.
- **Any "social" features.** No comments, no follows, no public profiles. Shareable artifacts (postcard OGs, year-in-stamps PNG) are the only social touchpoint.

---

## Working notes for whoever implements first

- `npm run lint` is broken (Next 15 + no eslint config). Use `npm run typecheck` and `npm run build` for verification.
- Use the design-skill set when the work is visual: `/shape` for pre-code planning, `/critique` for sanity-checking the result.
- No em dashes in user-facing strings. Every feature here has draftable copy that will tempt one; resist.
- Mobile (`WorldMapMobile.tsx`, `BookletShell` mobile mode) is a separate code path for the map and a shared one for the booklet. Audit each feature for mobile parity before claiming done.
- The May 31 data-layer work made `useFavorites` a shared store, fixed the silent region-tier bug in `useLogCook`, and added zod validation in `useRecipes` + `lib/recipes/get.ts`. New features should trust this contract: cooked-tier returns are accurate, favorites are live across components.
