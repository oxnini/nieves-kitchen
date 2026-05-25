# Nieves' Kitchen — Reminders

A running list of things to come back to. Check items off as they're done.

---

## About Page — Recipe Links

Once the recipe exists on the site, update the place name link to point to the actual recipe page (`/recipes/[slug]`) instead of the map coordinates.

| Dish mentioned | Location in text | Current link target | Recipe exists? | Recipe slug |
|---|---|---|---|---|
| Uyghur lamb dumplings | Intro paragraph | Map → Xinjiang | No | — |
| Seafood paella | Intro paragraph | Map → Spain | No | — |
| Korean street food | Intro paragraph | Map → South Korea | No | — |
| Bun cha | Intro paragraph | Map → Vietnam | No | — |
| Seafood salad | Intro paragraph | Map → Thailand | No | — |
| Uyghur lamb dumplings (Reddit story) | Full story dropdown | Not linked | No | — |
| Seafood paella (Costa Brava) | Full story dropdown | Not linked | No | — |
| Bun cha | Full story dropdown | Map → Vietnam | No | — |
| Seafood salad | Full story dropdown | Map → Thailand | No | — |
| Somali food with banana | Full story dropdown | Map → Somalia | No | — |
| Vietnamese coffee | Full story dropdown | Not linked | No | — |

---

## Other Reminders

- [x] **Cook-mode timer bell**: Shipped — real sample at `public/sfx/timer-bell.m4a` (3x ring) loaded by `hooks/usePageTimer.ts`, with synth fallback for missing-file / autoplay-blocked cases. Volume lowered and in-flight rings stopped on dismiss.
- [x] **Cook-mode timer panel should stay visible while you scroll**: Shipped via a different approach — instead of `position: sticky`, a `MiniTimerStamp` (`components/recipe/MiniTimerStamp.tsx`) appears when the expanded `TimerPanel` scrolls out of view, wired through `PageTimerContext` + `useElementInViewport` + `ModalScrollContext`.
- [ ] **Cooked stamp on the recipe page is visually ambiguous**: The "I cooked this" button / stamp at the bottom of the recipe page does not make it obvious whether the recipe has already been cooked or not — the cooked and not-cooked states look too similar. Needs a visual pass so the cooked state reads unmistakably as "stamped / done" (e.g. clear postal-stamp ink treatment, a struck-through or sealed appearance, terracotta fill, an applied stamp graphic) and the not-cooked state reads clearly as a call-to-action. Look at `components/CookedButton.tsx` and any related styling. Compare both states side-by-side before deciding the treatment.
- [ ] **Cook-mode timer: recipe-aware analog dial (replaces preset row)**: The current timer in `components/recipe/PageTimer.tsx` is a plain preset row + mm:ss countdown — functional but visually basic. Future direction: a circular dial driven by the recipe's own durations.
  - **Mechanic**: scan step prose with `detectDurations` (already exists at `lib/recipes/duration-detect.ts`), dedupe to unique minute values, place each one as a rim marker on the dial. The dial's full sweep = max(60min, longest marker) rounded up to a nice ceiling (30 / 60 / 90 / 120). Markers sit at `(minutes / scale) × 360°` clockwise from 12 o'clock. Hand is minute-honest: start a 5-minute timer on a 60-min face and the hand jumps to the "5" position then sweeps counterclockwise to 0.
  - **Must-have from prototype Option C (Halo arc)**: a visible terracotta arc that fills around the dial as time elapses. This was the one piece of feedback that was unambiguously loved — elapsed-time progress must be obvious. The other two prototype variants (Modern editorial, Cookbook engraving) lacked this and felt less satisfying.
  - **Aesthetic from prototype Options A + B**: parchment face, fine warm tick marks, terracotta hand. Either the modern editorial (clean dots + Literata labels) or the cookbook engraving (hairline double-ring bezel, italic labels) treatment is acceptable. Pick whichever reads better once combined with the arc.
  - **Fixes vs prototype**:
    - Hand currently overlaps the central mm:ss readout and covers it. Either shorten the hand so it stops outside the readout circle, raise the readout above the hand layer, or move the readout off-centre.
    - Rim numbers are too small and not tappable enough. Replace them with **larger pill-shaped buttons sitting just outside the dial perimeter**, with the duration written in full (e.g. a `60 min` pill positioned slightly above the 12 o'clock tick, a `30 min` pill at the 6 o'clock side, etc.). The pills should be the primary affordance for setting a timer; the rim ticks become decorative. Big enough to tap with a flour-dusted thumb.
  - **Prototype reference**: the three variants were prototyped under `/dev/timer` and removed in the revert. Restore from git history (last commit before the revert touched `components/recipe/TimerDial.tsx`, `lib/recipes/recipe-markers.ts`, `app/dev/timer/page.tsx`) as a starting point — the marker-derivation helper and the geometry maths are reusable.
  - **Sticky behaviour to add at the same time**: the timer panel currently scrolls with the ingredients column. Make it `position: sticky; top: 96px` on `lg+` standalone so it stays visible while scrolling the instructions on the right; inside the modal, sticky against the modal scroll container.
- [ ] **Passport mobile layout**: Change the culinary passport on mobile to show one vertical page at a time instead of the current two-page spread. The two-page view is too cramped on small screens.
- [ ] **Recipe swipe/navigation**: Add prev/next navigation on recipe detail pages so users can browse through recipes without going back to the grid. Needs its own design pass — decide ordering (same region? filtered set? all?).
- [ ] **WorldMap "Maximum update depth exceeded" warning**: React circuit-breaker fires during programmatic zoom (continent click, search-result selection, breadcrumb click). Suspected loop: `tick()` rAF → `setControlledPos` → `<ZoomableGroup>` re-render → `onMoveEnd` → `handleMoveEnd` snap-back → new `tick()`. Investigate the snap-back guard in `handleMoveEnd` (~line 480) and the `isAnimatingRef.current` flag (~line 421) in `components/WorldMap.tsx`. Possible fixes: earlier `if (isAnimatingRef.current) return` in `handleMoveEnd`, or skip `setControlledPos` on the final tick frame. Risk: zoom logic is load-bearing for all map navigation — needs careful manual testing of continent zoom, search zoom, and breadcrumb zoom in both themes after any change. Payoff: clean console, lower CPU/battery on programmatic zoom, removes a latent infinite-loop bug. Last seen: 2026-05-02 explore-page audit (item 3, the path from 19/20 → 20/20).
- [ ] **Passport continuation spreads kick in sooner**: After capping each half at 4 cooked countries (2026-05-13), a region now spills onto a second spread at 9 cooked countries instead of 25. No region hits this today, but once one does, `RegionChipStrip` will show more page dots per region. Watch whether the chip strip stays readable at 3+ continuation spreads in a single region; if not, consider compacting the strip or only rendering the active region's chips. File: `components/passport/RegionChipStrip.tsx`. Pack logic: `lib/passport-pack.ts` (`HALF_CAPACITY = 4`).
- [ ] **Redesign Section 10 stamps (North America)**: Current North America stamps don't reference "Nieves' Kitchen" the way other sections do — that's one reason they feel off. Take Section 10 back to the drawing board entirely (Canada, USA, Mexico, etc.) rather than tweaking the existing prompts. Source: `docs/plans/2026-05-06-stamp-final-prompts.md` §10.
- [ ] **Flip CSP from report-only to enforce mode** (security hardening, not urgent): The site currently sends a `Content-Security-Policy-Report-Only` header — the browser logs violations to the console but doesn't actually block anything. Once the site has run for a few days with no new CSP warnings in production (check DevTools console on `nieveskitchen.com`), it's safe to switch to enforce mode. Edit `next.config.ts:28` and change the header key from `Content-Security-Policy-Report-Only` to `Content-Security-Policy`. **Why it matters**: enforce mode is what actually protects against script-injection attacks — report-only is just a dry run. **Risk**: if any third-party script is missing from the allowlist when you flip the switch, that feature will break in production until you add it back. Mitigation: monitor the console for a week first, and if you add any new third-party service (analytics, payments, etc.) you'll need to add its domain to the relevant `*-src` directive at the same time.
- [ ] **Rotate the Supabase service-role key** (security hygiene, not urgent): The Vercel env var `SUPABASE_SERVICE_ROLE_KEY` has a "Needs Attention" badge — Vercel suspects the key has been exposed somewhere (e.g. committed to a public repo, pasted in a screenshot, shared in a message). **What this key does**: it's an admin-level Supabase credential that bypasses all row-level-security rules. It's only used by the local `npm run seed:mock` script, never in the browser, so the bug we just fixed wasn't caused by this. But if the key really is leaked, anyone who has it can read/write/delete any row in the database. **How to fix when ready**: (1) Supabase dashboard → Project Settings → API → "Reset service_role secret"; (2) update the value in Vercel → Settings → Environment Variables; (3) update the value in your local `.env.local` so `npm run seed:mock` still works; (4) the "Needs Attention" badge in Vercel should clear within a few minutes.
- [ ] **Undo / delete a cooked stamp**: Surface a way for users to remove a `passport_stamps` row they logged by accident. Backend already supports it — `useUndoCook` in `hooks/useLogCook.ts` handles the delete with RLS. What's missing is UI. Options: an "Undo" toast on the recipe page right after the cooked button is pressed; a delete affordance inside the per-country modal in the passport (`StampedRecipesModal` already lists the recipes cooked from that country — add an X / "remove" next to each row). Confirm before deleting; deleting also removes the cancellation postmark if it was the only cook of that recipe. Cooked is the only write action in the whole app, so cleanup of stray entries matters more than it would in a heavier product.

---

## Recipe Page Improvements (brainstorming in progress)

- [ ] **Checkable ingredients & steps**: Let users check off ingredients and instruction steps as they cook. Visual strikethrough or dimming on checked items.
- [ ] **Unit conversion (metric/imperial)**: Toggle between metric and imperial units for ingredient quantities.
- [ ] **Structured substitutions**: Dedicated section or per-ingredient substitution suggestions (inspired by Minimalist Baker's approach).
- [ ] **Storage & reheating notes**: Section explaining how to store leftovers, shelf life, and reheating instructions.
- [ ] **"I Cooked This" button redesign**: Current button is buried and visually flat — needs to feel like a milestone moment, not a form submit.
- [ ] **Revisit: Sticky navigation for mobile**: Evaluate adding a sticky bar with Ingredients/Steps tabs for mobile, where the sidebar stacks vertically. Decide after other features are implemented.
