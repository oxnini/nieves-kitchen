# Nieves' Kitchen — Reminders

A running list of things to come back to. Check items off as they're done.

**Status markers:** `[ ]` open · `[x]` done · `[~]` shipped, awaiting sign-off · `[retired]` the surface it targets is no longer live, kept for context only.

> **Before picking work off this list, check the entry against the current code.** Entries accumulate here as work happens and are not re-validated; some have gone stale (a fix landed and nobody ticked it) and some target surfaces that were later retired. The passport entries below are both. Retired surfaces are documented in `docs/retired/`.

---

## Pantry (phase 2 of the Table · Pantry · Atlas revamp)

- [x] **Pantry phase 2 shipped** (2026-07-05): `/pantry` route + entry overlay, navbar link, home teaser, FilterPanel collection chips, and seed-time `featuredIngredients` validation. The shelf/teaser show only entries whose ink art has landed (`lib/pantry/landed.ts`), so the pantry launched partial and fills in as renders arrive.
- [x] ~~**Owed pantry art**~~ — **DONE 2026-07-05.** All three landed in `a42cd2f` ("ingest final three pantry assets (honey, garlic, lamb) — 9/9"), seventeen minutes after this entry was written at 01:52. `public/pantry/` now holds all 9 (honey 146K, lamb 91K, garlic 48K). Never ticked; verified 2026-09-03.
- [~] **Second-batch pantry entries** — *partly done, list out of date.* `pumpkin.ts` is authored; **vinegar, black seed and milk are not**. Separately, `beef.ts`, `cucumber.ts` and `figs.ts` were added beyond the original nine, so `data/pantry/` now holds 15 entries and this list no longer describes the shelf. Re-derive the wanted set before working it. Verified 2026-09-03.

---

## About Page — Recipe Links

Once the recipe exists on the site, update the place name link to point to the actual recipe page (`/recipes/[slug]`) instead of the map coordinates.

> **Reviewed 2026-09-03.** Still accurate but nearly all-negative: the live catalogue is 7 founder-cooked recipes across Italy, China, South Korea and Turkey, so only `xinjiang-lamb-dumplings` exists and it is still unlinked (`app/about/page.tsx` sends every place name to `/atlas?…`). The other 10 rows describe dishes that may never be written as listed. **Actionable today: the two Uyghur lamb dumpling rows.** The rest is a watch-list, not work.

| Dish mentioned | Location in text | Current link target | Recipe exists? | Recipe slug |
|---|---|---|---|---|
| Uyghur lamb dumplings | Intro paragraph | Map → Xinjiang | Yes | `xinjiang-lamb-dumplings` |
| Seafood paella | Intro paragraph | Map → Spain | No | — |
| Korean street food | Intro paragraph | Map → South Korea | No | — |
| Bun cha | Intro paragraph | Map → Vietnam | No | — |
| Seafood salad | Intro paragraph | Map → Thailand | No | — |
| Uyghur lamb dumplings (Reddit story) | Full story dropdown | Not linked | Yes | `xinjiang-lamb-dumplings` |
| Seafood paella (Costa Brava) | Full story dropdown | Not linked | No | — |
| Bun cha | Full story dropdown | Map → Vietnam | No | — |
| Seafood salad | Full story dropdown | Map → Thailand | No | — |
| Somali food with banana | Full story dropdown | Map → Somalia | No | — |
| Vietnamese coffee | Full story dropdown | Not linked | No | — |

---

## Other Reminders

- [x] **Cook-mode timer bell**: Shipped — real sample at `public/sfx/timer-bell.m4a` (3x ring) loaded by `hooks/usePageTimer.ts`, with synth fallback for missing-file / autoplay-blocked cases. Volume lowered and in-flight rings stopped on dismiss.
- [x] **Cook-mode timer panel should stay visible while you scroll**: Shipped, but *not* by the solution this entry used to describe. A floating `MiniTimerStamp` did ship in `e2091b9`, and was then replaced in `be10ae7` ("Redesign cook-mode timer as co-located on-brand step-card strip"). `components/recipe/MiniTimerStamp.tsx` no longer exists — corrected 2026-09-03. The shipped answer is `components/recipe/PageTimerStrip.tsx` riding the top edge of `StickyStepCard`, which is itself docked to the bottom of the viewport, so the timer is always in the cook's eyeline without any scroll-out-of-view handoff. `PageTimerContext` is still the wiring.
- [x] **Cooked stamp on the recipe page is visually ambiguous**: **Signed off 2026-09-03**; the `/dev/cooked-button` harness has been deleted. `components/CookedButton.tsx` now moves five things between the two states instead of two: the paper takes a terracotta ink wash, the engraved rule doubles and inks, the kicker changes from PASSPORT ENTRY to ENTERED, the hero gains a check glyph plus the cook count, and the whole stamp settles at a slight angle with a cast shadow. The hero ink is mixed toward the theme ink (`STAMPED_INK`) because straight terracotta measured about 2.7:1 on the stamp face; it now lands near 3.8:1, still short of 4.5:1 for 20px text.
- [x] **Cook-mode timer: recipe-aware analog dial (replaces preset row)**: **Closed 2026-09-03, resolved as the "Inline Ring" rather than a dial.** `components/recipe/PageTimerStrip.tsx` now draws a 60px ring with the terracotta halo arc, mm:ss beside it, "of 10 min" beneath, and the transport pushed to the right edge; idle shows "Set a timer" plus the recipe's own duration pills and a `+` for custom, with no ring at all (an empty circle is decoration, and it was what made the pills sit badly). The notes below are kept for the reasoning, not as open work.
  - **Why not the dial**: `PageTimerStrip` has exactly one call site and it lives inside a bar pinned to the bottom of the viewport (`StickyStepCard.tsx`, `fixed ... bottom-0 lg:sticky lg:bottom-4`). A ~200px half-gauge plus its border plus the step text is ~380px of permanently docked bottom bar, about half a laptop viewport. A tap-to-expand overlay and moving the timer out of the step card were both considered and rejected. Do not re-litigate.
  - **Mechanic (built)**: scan step prose with `detectDurations` (`lib/recipes/duration-detect.ts`), dedupe to unique minute values, surface them as the idle pills. The dial-specific part of this plan — rim markers, a 30/60/90/120 face scale, a minute-honest hand — was dropped with the dial.
  - **Must-have from prototype Option C (Halo arc)** — *carried over into the ring*: a visible terracotta arc that fills as time elapses. This was the one piece of feedback that was unambiguously loved — elapsed-time progress must be obvious. The other two prototype variants (Modern editorial, Cookbook engraving) lacked this and felt less satisfying.
  - **Also carried over**: the readout never sits under the arc (it is beside the ring, not inside it), and the presets are full-word pill buttons sized for a flour-dusted thumb (36px min target, `10 min` not `10`) rather than small rim numbers. The dial-only aesthetic notes (parchment face, tick marks, terracotta hand, bezel treatments) died with the dial.
  - **Theme-aware stroke weights (real fix, not polish)**: sepia paints `brown-light` (#43596F) on a #1C3B5E panel, so a light-theme hairline track is near-invisible. The ring uses 2.5px / `brown-medium/45` in sepia and 1.75px / `brown-light/45` in light (`useTrack` in `PageTimerStrip.tsx`).
  - **Prototype reference — DEAD END, do not chase it.** "Restore from git history" was never possible: the prototype was reverted *before* it was ever committed, so `components/recipe/TimerDial.tsx`, `lib/recipes/recipe-markers.ts` and the original `app/dev/timer/page.tsx` exist in no commit. Only this prose describing them survived. Verified 2026-09-03.
- [x] ~~**Passport mobile layout**~~ — **DONE, then RETIRED.** Two things happened. (1) The one-page mobile layout shipped in `813abf8` on 2026-04-21, the same day this entry was written and immediately after it; the entry was simply never ticked. (2) The passport itself was retired on 2026-07-05 in favour of the Cook's Journal at `/journal`. See `docs/retired/passport.md`.
- [ ] **Recipe swipe/navigation** *(valid, not built — verified 2026-09-03)*: Add prev/next navigation on recipe detail pages so users can browse through recipes without going back to the grid. Needs its own design pass — decide ordering (same region? filtered set? all?).
- [x] **WorldMap "Maximum update depth exceeded" warning**: Shipped 2026-07-04 in the phase 1.5 pass — settle handshake in `WorldMapDesktop.tsx` + `useMobileMapPosition.ts` (RSM v3 swallows `onMoveEnd` on prop moves, so a ~2-frame timer closes the settle window; snap-back can no longer fight a flight's final frame).
- [x] **Phase 1.5 — Atlas seamlessness pass**: Shipped 2026-07-04 — van Wijk flights via `lib/map/camera.ts` (550ms cap), feedback-loop fix, gesture-cancels-flight, zoom floor = reset view (1.05), overlapping fade bands, loading skeleton, marker mount fades, `:active` press feedback, reduced motion, mobile follow. Manually verified both themes.
- [x] **Atlas drill-down: carry the three shipped desktop behaviors to mobile**: Shipped 2026-07-04 — (1) country dots visible from the world view (`M_ZOOM.DOT_FADE_IN/FULL` at/below the 0.95 floor); dot tap flies to the country and opens its sheet; (2) "See all N recipes" bridge pill above the rail bottom-right, hidden while a sheet is open; (3) region taps (rail chip, double-tap dive, land tap below label zoom) reveal a region-scoped sheet as a collapsed peek bar (expandable; region rows show the country). Verified in mobile Chrome emulation, both themes.
- [ ] **Atlas P3 stale-crumb on long manual pans** (desktop, from the 2026-07-04 critique): selection-driven breadcrumb keeps the old name until the next click. Same acceptance on mobile: a region sheet opened from a tap keeps its title while the user pans elsewhere.
- [x] **Collection shelf header design pass**: Shipped 2026-07-04 — variant B ("absorbed into the controls row") from `/dev/shelf-header`, user-tweaked: no chapter numeral, larger type, more air. Accents centralised in `lib/collections.ts` (`COLLECTION_ACCENTS`), shared with the home chapter cards.
- [retired] **Passport continuation spreads kick in sooner** (booklet-only, parked — see `docs/retired/passport.md`): After capping each half at 4 cooked countries (2026-05-13), a region now spills onto a second spread at 9 cooked countries instead of 25. No region hits this today, but once one does, `RegionChipStrip` will show more page dots per region. Watch whether the chip strip stays readable at 3+ continuation spreads in a single region; if not, consider compacting the strip or only rendering the active region's chips. File: `components/passport/RegionChipStrip.tsx`. Pack logic: `lib/passport-pack.ts` (`HALF_CAPACITY = 4`).
- [ ] **Redesign Section 10 stamps (North America)** *(valid — verified 2026-09-03: `mexico.webp` 2026-06-13 and `united-states.webp` 2026-05-01 both ship and are registered in `CUSTOM_STAMPS`; neither has been redesigned, and there is still no Canada asset)*: Current North America stamps don't reference "Nieves' Kitchen" the way other sections do — that's one reason they feel off. Take Section 10 back to the drawing board entirely (Canada, USA, Mexico, etc.) rather than tweaking the existing prompts. Source: `docs/plans/2026-05-06-stamp-final-prompts.md` §10.
- [ ] **Sort control's "Default" option is a meaningless label**: `SORT_LABELS` in `app/recipes/page.tsx` names the unsorted order "Default", which tells a reader nothing about what they are looking at. It is whatever order Supabase returns, so "Newest" would be a lie. Worth deciding what that order should actually be (newest cooked? hand-picked?) and naming it honestly, rather than renaming the label alone. Noticed during the 2026-09-02 mobile controls-row reflow; left alone because it is a content decision, not a layout one.

- [ ] **Turnstile shows a visible "Verify you are human" checkbox, and it is easy to miss**: Found while building the /journal resilience states (2026-09-02). On a plain desktop Chrome visit to the production build, Cloudflare serves an *interactive* challenge, not an invisible one: a "Verify you are human" checkbox appears in the bottom-right corner and the anonymous session is not created until someone ticks it. `appearance: 'interaction-only'` in `components/Providers.tsx` is doing what it says, but the widget is small, in the corner, and completely unexplained, so a user who does not notice it never gets a passport. The new session state machine now stops pretending to load and, after 45s, says "There is a quick browser check waiting in the bottom corner of the screen" (`awaiting-human` in `components/StampsUnavailable.tsx`), which is honest but reactive. **Better fixes to consider**: move the widget somewhere it reads as part of the page, label it, or check whether the Turnstile widget mode can be changed (Managed vs Non-Interactive vs Invisible) in the Cloudflare dashboard so most visitors never see a challenge at all. Worth measuring first: how often does the interactive challenge actually fire for real visitors?

- [ ] **Flip CSP from report-only to enforce mode** (security hardening, not urgent): The site currently sends a `Content-Security-Policy-Report-Only` header — the browser logs violations to the console but doesn't actually block anything. Once the site has run for a few days with no new CSP warnings in production (check DevTools console on `nieveskitchen.com`), it's safe to switch to enforce mode. Edit `next.config.ts:28` and change the header key from `Content-Security-Policy-Report-Only` to `Content-Security-Policy`. **Why it matters**: enforce mode is what actually protects against script-injection attacks — report-only is just a dry run. **Risk**: if any third-party script is missing from the allowlist when you flip the switch, that feature will break in production until you add it back. Mitigation: monitor the console for a week first, and if you add any new third-party service (analytics, payments, etc.) you'll need to add its domain to the relevant `*-src` directive at the same time.
- [ ] **Migrate to Supabase's new API keys, then disable the legacy ones** *(was "rotate the service-role key"; rewritten 2026-09-03 after the dashboard turned out not to support it)*

  **Background.** Vercel flagged `SUPABASE_SERVICE_ROLE_KEY` with a "Needs Attention" badge, meaning it suspects the key was exposed somewhere (committed, screenshotted, pasted in a message). It is an admin credential that bypasses every RLS policy on the database. **Partly handled on 2026-09-03:** the variable was deleted from Vercel entirely, because nothing in the deployed app reads it (verified: the only consumer in the repo is `scripts/seed-recipes.ts`, which runs locally). The key now lives only in `.env.local` on the founder's laptop. That shrinks the blast radius but does **not** invalidate the key.

  **Why the obvious fix does not exist.** The old instructions here said "Supabase → Settings → API → Reset service_role secret". **That button is gone.** Supabase no longer supports rotating the legacy `anon` / `service_role` / JWT secrets at all; the dashboard offers only Reveal, plus a "Disable legacy API keys" box. The only way to invalidate the key is to migrate to the new publishable/secret key system and deactivate the legacy pair. Supabase is retiring `anon`/`service_role` **by the end of 2026**, so this is scheduled work regardless.

  **Constraints.**
  - Deactivating legacy keys kills the `anon` key too, not just `service_role`. The live site runs on `anon`, so the migration must cover both and needs a Vercel change plus a redeploy.
  - `@supabase/supabase-js` resolves to **2.103.3**, new enough to accept the new key formats. **No code changes needed, only env values.**
  - Deactivation is reversible (the keys are disabled, not deleted), so a bad step can be rolled back from the dashboard.
  - A publishable key already exists in the project (`default`, `sb_publishable_9lYd…`). A secret key does not yet.

  **Order (steps 1-3 are behaviour-neutral; step 5 is the one with teeth):**
  1. Settings → API Keys → "Publishable and secret API keys" tab → **New secret key**. Copy it.
  2. `.env.local`: set `SUPABASE_SERVICE_ROLE_KEY` to the new `sb_secret_…`. Verify with `npm run recipes:check` (expect `7 recipe(s) valid`).
  3. `.env.local`: set `NEXT_PUBLIC_SUPABASE_ANON_KEY` to the existing `sb_publishable_…`. Verify with `npm run dev` that recipes load and `/journal` still stamps.
  4. Vercel → Settings → Environment Variables → update `NEXT_PUBLIC_SUPABASE_ANON_KEY` to the publishable key → redeploy → verify production loads recipes. **Do not re-add `SUPABASE_SERVICE_ROLE_KEY` to Vercel.**
  5. Soak for a couple of days, then Settings → API Keys → "Legacy anon, service_role API keys" tab → **Disable JWT-based API keys**. This is the step that finally kills the possibly-leaked key.

  **Open question to check at step 5, not before.** Existing visitors' anonymous sessions are expected to survive, because those JWTs are signed by the JWT *signing key*, which this migration does not touch. That is reasoned, not tested. Before walking away from step 5, load `/journal` in a real browser (localhost, per the Turnstile hostname note) and confirm existing cooked stamps still render. If they vanish, re-enable legacy keys from the same box and reassess.

  **Do not** revoke the legacy JWT secret as part of this. That is a separate, more destructive action that does sign active users out, and it is not needed to neutralise the API key.
- [x] **Recipe modal: no close affordance on Chrome mobile**: **Confirmed on a real Chrome Android device 2026-09-03.** Both fixes shipped and verified.
  (1) The sheets were capped in `vh`, so a bottom-anchored sheet pushed its overflow off the TOP, where the close
  button and the tappable backdrop live. Chrome Android's URL bar is at the top and ate them; iOS Safari's chrome is
  at the bottom so it never reproduced there. `RecipeModal` and `StampedRecipesModal` now cap in `dvh`.
  (2) Reported on device 2026-09-02: dragging the dim strip above the sheet RELOADED the page. Cause was Chrome
  Android pull-to-refresh, since nothing locked the page behind the sheet and `overscroll-behavior` was `auto`.
  `hooks/useScrollLock.ts` (reference-counted, shared with `StampedRecipesModal` and `PassportModal`) now sets
  `body { overflow: hidden }` + `html { overscroll-behavior-y: none }` while any overlay is open. The grabber pill,
  which looked draggable and did nothing, is now a real drag handle, and the backdrop drags too: past 110px or a
  downward flick dismisses, anything shorter springs back. Written with pointer events rather than framer-motion's
  `drag` prop on purpose, because `drag="y"` stamps `touch-action: pan-x` on the sheet and touch-action intersects
  down the ancestor chain, which would have killed scrolling in the recipe content.
  **Verified on device 2026-09-03** at the enlarged 144x44 grabber. The backdrop strip is only ~66px tall (92dvh
  sheet), so it stays a poor tap target even though it works; the swipe gesture is the intended escape.

- [x] **`seed:mock` could re-seed 21 fake recipes into production** — **FIXED 2026-09-03.** `scripts/seed-mock.ts` did a bare `.upsert(rows, { onConflict: 'slug' })` of 21 fabricated `mock-*` recipes against whatever project `.env.local` named, which is production. No environment guard, no confirmation, no dry-run. It was never tracked on this list, which is how it survived the 2026-09-02 catalogue purge that deleted exactly those rows. The script and its `seed:mock` package.json entry are now deleted, so **`scripts/seed-recipes.ts` is the only script in the repo that can write to `public.recipes`**, and it only writes rows that have a hand-authored source file in `data/recipes/`. `lib/mock-recipes.ts` was deliberately kept: it is two read-only fixtures behind `NEXT_PUBLIC_USE_MOCK_DATA`, it has no write path, and `app/dev/cook-mode/page.tsx` imports it directly. **Do not reintroduce a seeding script that writes rows with no source file in `data/recipes/`.**

- [x] **Mobile navbar overflow / redesign**: Shipped — `Navbar.tsx` is now a floating pill (`fixed left-3 right-3 rounded-full`) that hides on scroll-down and reveals on scroll-up via `useHideOnScroll`. See the `2026-05-26-floating-navbar` plan/spec.
- [x] **Undo / delete a cooked stamp**: Shipped. Three paths, all reversible-by-design: an Undo toast appears for 9s straight after stamping (no confirm, the toast is the confirm step); the recipe page caption offers REMOVE STAMP, which swaps to an inline REMOVE / KEEP confirm; and each dated cook inside `StampedRecipesModal`'s chronology has a bin icon with the same two-step confirm, so a single repeat cook can be removed without losing the others. `CookedButton` now targets the *latest* stamp for a recipe rather than the earliest.

---

## Prophetic Foods page (Sunnah foods)

Superseded by the Table · Pantry · Atlas revamp: see `docs/superpowers/specs/2026-07-03-table-pantry-atlas-revamp-design.md`, where this idea became **Pantry** (phase 2). The open questions from the original brainstorm (content types, filter integration, missing recipes, route placement, aesthetic) are resolved there.

Two notes that carry forward into the pantry entries:

- **Editorial / voice.** A short note per food on *why* it's beloved, ideally with a brief authentic citation (hadith reference). Keep it confident and warm, never preachy. Verify any narration before publishing — never fabricate a hadith or attribute a ruling we can't source. (See the halal trust-voice memory: sell taste + love, cite real sources.)
- **Naming note.** Respect the ﷺ (peace be upon him) convention in any user-facing copy; agree the exact rendering (Arabic glyph vs "(ﷺ)" vs "peace be upon him") during the design pass.

---

## Recipe Page Improvements (brainstorming in progress)

- [x] ~~**Checkable ingredients & steps**~~ — **DONE.** `components/recipe/IngredientGroupList.tsx` and `InstructionGroupList.tsx` both check off with `line-through` + `opacity-50`, exactly as described. Verified 2026-09-03.
- [x] ~~**Unit conversion (metric/imperial)**~~ — **DONE.** `hooks/useUnitPref.ts` (localStorage-backed) + `lib/units.ts` conversion helpers, wired into `components/RecipeDetail.tsx`. Verified 2026-09-03.
- [x] ~~**Structured substitutions**~~ — **DONE.** `substitutions` is a first-class recipe field (`data/recipes/_types.ts:73`, `lib/types.ts:109`) and renders in `components/recipe/SupplementarySections.tsx:74`. Verified 2026-09-03.
- [x] ~~**Storage & reheating notes**~~ — **DONE.** `storage` field (`data/recipes/_types.ts:75`) rendering in `components/recipe/SupplementarySections.tsx:89`. Verified 2026-09-03.
- [x] ~~**"I Cooked This" button redesign**~~ — **DONE, superseded.** `components/CookedButton.tsx` is now a perforated postage-stamp silhouette (CSS mask) with an undo toast; the remaining open question is only the idle-vs-stamped legibility work tracked in the `[~]` cooked-stamp entry above. Verified 2026-09-03.
- [ ] **Revisit: Sticky navigation for mobile** *(valid, not built — verified 2026-09-03; `components/recipe/StickyStepCard.tsx` is a sticky current-step card, a different thing)*: Evaluate adding a sticky bar with Ingredients/Steps tabs for mobile, where the sidebar stacks vertically. Decide after other features are implemented.
