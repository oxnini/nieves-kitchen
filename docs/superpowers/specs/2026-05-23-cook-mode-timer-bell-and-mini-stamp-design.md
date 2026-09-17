# Cook-Mode Timer: Real Bell Sample + Mini Floating Stamp

**Date:** 2026-05-23
**Status:** Design — awaiting implementation plan
**Touches:** TODO items 1 (cook-mode timer bell) and 2 (timer panel visible while scrolling)

---

## Goals

1. Replace the synthesised ~1.6s sine-bell at timer completion with a real warm brass/temple-bell sample (~3s natural decay), rung **three times at 1.2 s spacing**, so the cue carries across a kitchen even if the cook has stepped into another room.
2. Keep the active timer's remaining time visible while the user scrolls anywhere in the recipe page — without permanently occupying screen space.
3. Stay quiet when there is nothing to show (idle timer, panel in view, read mode).

## Non-goals

- Redesigning the expanded timer UI. TODO #4 (recipe-aware analog dial) is a separate future project. The mini stamp deliberately does not constrain it.
- Adding a global timer that persists across recipes or page reloads. Single timer per page, lives in `usePageTimer`.
- Multi-timer stacking. The data model is one active timer per recipe; the mini stamp represents *the* timer.
- Drag-to-reposition (a la YouTube PiP). Overkill for cooking.

## Decisions made during brainstorm

- **Bell source**: real sample (not extended synth).
- **Bell character**: soft brass / temple-bell, warm metallic with long gentle decay.
- **Floating element shape**: stamp-like pill (~84×44px rounded rectangle with faint perforation), not a circle. Real postage stamps are rectangular; rectangles accommodate `h:mm:ss` for long braises.
- **Anchor**: top-right of viewport (standalone) / top-right of modal scroll container (modal).
- **Tap behavior**: **always non-destructive** — tap = smooth-scroll back to the expanded panel, in every state. Dismiss lives only on the expanded panel. (Revised after critique: state-dependent tap was unsafe — destroyed the done state if user tapped intending to scroll back.)
- **Content**: time-only readout in running/paused; in done, the readout is replaced with a checkmark + the word "Done" (see Done state below). No embedded controls.
- **Availability**: all layouts (mobile sheet, tablet, desktop, standalone and modal). Not gated on two-column vs single-column.
- **Per-state glyphs**: each state gets a distinct leading glyph so it's never ambiguous at a glance (`◷` running, `⏸` paused, `✓` done).

---

## Architecture

### Bell — real sample with synth fallback, rung three times

Asset: `public/sfx/timer-bell.m4a` — a CC0 soft "ding" bell sample (Freesound `149268__organicmanpl__ding-3`), trimmed to 3.1 s and encoded to AAC mono at 96 kbps. ~38 KB.

**Triple-ring contract.** A single ding is easy to miss if the cook has stepped into another room. Each "play" of the bell schedules **three** rings spaced 1.2 s apart (so the perceived sequence is `ding... ding... ding` over ~3.5 s of attacks plus the trailing decay of the third ring). The interval is short enough that the third ring is unambiguously part of the same event but long enough that the strikes don't blur together. Both the sample path and the synth fallback use the same triple-strike pattern so behaviour is consistent regardless of which path runs.

`hooks/usePageTimer.ts` gains:

- A module-scoped `bellBufferCache: AudioBuffer | null` so subsequent recipes don't re-decode.
- A `loadBell(ctx)` function that fetches `/sfx/timer-bell.m4a`, decodes with `ctx.decodeAudioData`, stores in the cache. Idempotent — second call resolves immediately.
- `loadBell` is invoked lazily on the **first `start()` press** (not on mount), inside the same user gesture that resumes the suspended `AudioContext`. This keeps initial bundle weight unchanged and respects autoplay policy.
- Two small constants drive the strike pattern: `BELL_RING_COUNT = 3`, `BELL_RING_INTERVAL_S = 1.2`.
- `playBell()` is rewritten:
  1. If `bellBufferCache` is populated, loop `i = 0..RING_COUNT-1` and for each `i` create an `AudioBufferSourceNode`, connect to a `GainNode` at 1.0, route to destination, and call `src.start(ctx.currentTime + i * RING_INTERVAL_S)`. WebAudio handles the scheduling sample-accurately; no `setTimeout`.
  2. If cache is empty (decode hasn't finished, asset missing, or `decodeAudioData` threw), schedule the existing two-partial synth implementation three times with the same `i * RING_INTERVAL_S` offset on every `osc.frequency.setValueAtTime`, `g.gain.*`, and `osc.start/stop` call.
- No regression: short timers (e.g. 1 s) that fire before decode completes still get audible feedback via the (now also triple-ring) synth path.

Failure modes handled silently:
- Asset 404 → fetch rejects → cache stays null → synth fallback.
- `decodeAudioData` rejects (unsupported codec on some browser) → cache stays null → synth fallback.
- `AudioContext` unavailable → existing early-return in `playBell` covers it.

### Two-state timer

The existing `components/recipe/TimerPanel.tsx` is the **expanded state**. It stays in its current flow position inside the ingredients column. **No `position: sticky` is applied.** The expanded panel's design is unchanged by this spec.

A new `components/recipe/MiniTimerStamp.tsx` is the **collapsed state**. It renders when, and only when, all three conditions hold:

1. Cook mode is active (already true wherever `TimerPanel` mounts).
2. `timer.status` is `running | paused | done` (not `idle`).
3. The expanded panel is out of the user's viewport.

When any condition becomes false, the stamp fades out (200 ms). When all become true, it fades in.

### Visibility detection

New hook: `hooks/useElementInViewport.ts`.

Signature:
```ts
function useElementInViewport(
  ref: RefObject<HTMLElement | null>,
  options?: { root?: Element | null; rootMargin?: string },
): boolean
```

Wraps `IntersectionObserver`. The `root` option lets the caller pass the modal's scroll container; default `null` means viewport. `rootMargin: '-72px 0px 0px 0px'` is the default so the stamp doesn't flicker at the threshold as the panel slides under the navbar.

The `TimerPanel` exposes its root `<section>` ref through `PageTimerContext`. `MiniTimerStamp` reads that ref plus a `scrollRoot` ref (modal's overflow container, if present) and feeds both into `useElementInViewport`.

### Modal vs standalone

- **Standalone**: pill is `position: fixed; top: 96px; right: 16px; z-index: 30` (above content, below navbar `z-50`, below modals `z-[70]`).
- **Modal**: pill is `position: absolute; top: 52px; right: 16px` inside the modal's `overflow-y-auto` scroll container (so it scrolls *with* the modal but visually pins below the floating close button at the modal's top).

`MiniTimerStamp` accepts an `inModal: boolean` prop and a `scrollContainerRef` prop. `RecipeDetail` passes both. The component picks position/anchor accordingly.

### Tap behavior (always non-destructive)

Tap on the stamp, in **any** state, calls:

```ts
panelRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
```

In the modal, `scrollIntoView` walks up to the nearest scroll ancestor automatically, so no special handling is needed.

**Why not state-dependent**: an earlier draft made the `done` state's tap dismiss the timer. Critique caught the failure mode: a user who taps habitually expecting "scroll to panel" will silently destroy the done state, with no undo. The stamp is a passive readout — dismiss lives only on the expanded panel, which is the single source of truth for write actions.

### Visual specification

Shape: rounded rectangle, 84 × 44 px, `border-radius: 10px`. Faint perforation suggestion via a subtle radial-gradient stroke mask on the border (akin to `RegionChip`-style postal hint) — not literal cut-outs. On mobile (< 640 px), height grows to 48 px for damp-thumb tap accuracy.

Typography: `font-stamp` (Cutive Mono), 16 px, slight letter-spacing for stamp feel.

Time format:
- < 10 min: `m:ss` (e.g. `4:32`)
- 10 min – < 1 h: `mm:ss` (e.g. `12:34`)
- ≥ 1 h: `h:mm:ss` (e.g. `1:23:45`)

Per-state glyph (leading, with a hair of space before the readout):
- **Running**: `◷` (clock-face) — establishes "this is a timer" on first encounter without microcopy.
- **Paused**: `⏸` (pause bar) — universal symbol, unambiguous.
- **Done**: `✓` (checkmark) — paired with the word "Done" replacing the time readout.

State styling:

**Running**
- Layout: `◷ 12:34`
- Fill: parchment; text: terracotta; border: terracotta hairline at 40 % alpha.
- Opacity 1.0.

**Paused**
- Layout: `⏸ 12:34`
- Same palette as Running.
- Opacity 1.0 (no dim — the glyph carries the state cue; dimming was redundant and risked being misread as "running but stale").

**Done** — the milestone moment
- Layout: `✓ Done` (no time; the timer's *value* at done is the completion itself, not a `0:00` reading).
- **Color inverts**: `bg-terracotta` fill, parchment-cream text, no border (the solid fill is the boundary).
- **Slight tilt**: 2.5° rotation, so it looks freshly hand-pressed onto the page rather than printed.
- **Entry "stamp" animation** (single, on entering done): scale 0.9 → 1.05 → 1.0 + rotation 0° → 2.5° over 280 ms with a quick ease-out — reads as a *thunk* press.
- **Sustained heartbeat** (until panel scrolls back into view): scale 1.0 → 1.03 → 1.0 every 4 s, very gentle ease-in-out. Reads as "alive, still here," not as a notification.
- Persists indefinitely while the user is scrolled away. Disappears (fade-out, 200 ms) when the expanded panel scrolls back into view — at which point the expanded panel's own done UI takes over.

Theme stability: the inverted done palette (`bg-terracotta` + parchment text) is theme-stable. In parchment mode the terracotta block reads as ink stamped on cream; in sepia mode the terracotta pops against the dark warm-brown page — sepia actually makes it more visible, not less. No theme-specific overrides for done state.

Palette (running and paused):

| Token | Parchment theme | Sepia theme |
|---|---|---|
| Fill | `bg-parchment` | `bg-parchment-dark` |
| Border (1.5 px) | `border-terracotta/40` | `border-terracotta/60` |
| Text + glyph | `text-terracotta` | `text-terracotta` |
| Shadow | `shadow-[0_2px_8px_rgba(120,60,30,0.12)]` | `shadow-[0_2px_10px_rgba(50,25,10,0.35)]` |

Palette (done):

| Token | Both themes |
|---|---|
| Fill | `bg-terracotta` |
| Text + glyph | parchment-cream (`text-parchment`) |
| Border | none (solid fill is the boundary) |
| Shadow | `shadow-[0_3px_12px_rgba(180,80,40,0.35)]` (slightly stronger to lift the inverted block) |

Motion: 200 ms fade-in / fade-out (opacity + 4 px translateY for entry into running). The done state's entry-stamp + heartbeat are described above.

### Accessibility

- Rendered as `<button>`.
- `aria-label` includes status + time, varying by state:
  - Running: `"Timer running, 12 minutes 34 seconds remaining. Activate to view full timer."`
  - Paused: `"Timer paused at 12 minutes 34 seconds. Activate to view full timer."`
  - Done: `"Timer finished. Activate to view full timer."`
- Recomputed when status or minute changes (not every second — too noisy).
- `aria-live="off"` on the visible mm:ss readout (screen readers should not be hammered at 1 Hz).
- Tap target: full 84 × 44 px — exceeds the 44 px minimum.
- `prefers-reduced-motion: reduce`: fade-in becomes instant; **done entry-stamp becomes a single 120 ms opacity blink with the tilt held statically; sustained heartbeat is suppressed entirely** (the color invert + word change are enough cue without motion); smooth-scroll becomes an instant jump.
- Focus ring uses the same `focus-visible:ring-2 focus-visible:ring-terracotta` pattern as other interactive elements in the app.

### Defensive: passport overlay

If `usePassportOverlay().isOpen` is true, `MiniTimerStamp` returns `null` regardless of other conditions. Cook mode + passport overlay co-occurring shouldn't happen in practice (passport is opened from the navbar, which the user has to reach), but a cheap safety check avoids the stamp peeking over the booklet.

---

## File changes

- **Modified**: `hooks/usePageTimer.ts` — add `loadBell`, module-scoped buffer cache, swap `playBell` to prefer buffered sample with synth fallback. Wire `loadBell` into the first `start()` press path.
- **New**: `public/sfx/timer-bell.m4a` — sample asset. User sources CC0 sample; encoded to AAC ~96 kbps mono during implementation.
- **New**: `hooks/useElementInViewport.ts` — IntersectionObserver hook, supports custom root.
- **Modified**: `components/recipe/PageTimerContext.tsx` — extend context shape with `expandedPanelRef: RefObject<HTMLElement | null>` and a setter so `TimerPanel` can register on mount.
- **Modified**: `components/recipe/TimerPanel.tsx` — register its root `<section>` ref into context on mount; no visual change.
- **New**: `components/recipe/MiniTimerStamp.tsx` — the floating stamp; reads timer + panel ref + scroll container ref + passport overlay state; handles tap-state branching.
- **Modified**: `components/RecipeDetail.tsx` — render `<MiniTimerStamp inModal={inModal} scrollContainerRef={...} />` next to `<TimerPanel />` when `isCook`. For the modal path, `RecipeModal` exposes its scroll container via a ref passed through props or via a small context.
- **Possibly modified**: `components/RecipeModal.tsx` — expose the scroll container ref to children that need it. Smallest change: thread `scrollContainerRef` via a new prop on `children` clone, or add a tiny `ModalScrollContext`. The modal context approach is cleaner and used elsewhere in the codebase.

## Risks and mitigations

| Risk | Mitigation |
|---|---|
| Bell sample 404 in production | Synth fallback already handles it (also rings 3×); verify the public/ asset is present in build output. |
| Triple rings layering into mush | Each ring is 3.1 s but the loud attack portion is the first ~0.5 s. 1.2 s spacing leaves the attacks clearly separable; the tail of ring 1 is already quiet by the time ring 2 strikes, so they layer like natural decay rather than smearing. |
| Decode latency on first-ever start press makes the very first bell synth-only | Acceptable. Most recipes have multi-minute timers; second+ recipes hit the cache. |
| IntersectionObserver thrash on rapid scroll | Default `rootMargin: '-72px 0px 0px 0px'` plus the observer's built-in debouncing. Browser native — not a real perf concern. |
| Mini stamp appears mid-cook-mode-entry animation | Render gate also checks that the panel has mounted (ref is non-null); the IO callback runs after first paint, so transient false-positives are bounded to one paint cycle. |
| Sepia contrast for terracotta text on `parchment-dark` | Specified palette tested manually during implementation against the sepia background; adjust border opacity if AA contrast not met. |
| z-index regression with future overlays | All overlays document their z-index; pill sits at `z-30`, well below the established `z-[70]` modal floor. |

## Out of scope

- Recipe-aware analog dial (TODO #4) — separate spec.
- Persistent / cross-recipe timer state.
- Multiple concurrent timers.
- Drag-to-reposition.
- One-time discovery tooltip ("Timer pinned to corner") — trust users to notice the fade-in.
- Time-format localization (the format above is fixed; the app currently has no i18n layer).

---

## Critique-driven revisions

After applying the `critique` skill (Nielsen heuristics + persona red flags) the spec was revised in four places:

1. **Tap behavior** changed from state-dependent to **always non-destructive**. The earlier draft's `done` → dismiss was an unsafe destructive action with no undo. Fix: stamp is always passive; dismiss lives only on the expanded panel.
2. **Done state** went from a single 1.2 s pulse + `0:00` readout to a **persistent inverted milestone moment**: color invert (terracotta fill, parchment text), content swap (`✓ Done`), 2.5° tilt, sharp entry-stamp animation, gentle sustained heartbeat. The earlier "pulse and settle" was easy to miss for a user returning from across the kitchen — exactly the cook-mode persona scenario.
3. **Paused state** dropped the dim + underline (risked being misread as italic/link) for an unambiguous `⏸` glyph at full opacity.
4. **First-time discoverability** gained a `◷` clock glyph in the running state so the stamp reads as "a timer thing" on first encounter without needing microcopy or a tooltip.

## Spec self-review

- **Placeholder scan**: no TBDs, no unspecified values. Bell asset is user-sourced before implementation begins (single dependency, called out).
- **Internal consistency**: file list matches architecture; visibility conditions, tap behavior, and per-state visuals are coherent across sections.
- **Scope check**: one feature surface (cook-mode timer), two coordinated changes (bell + mini stamp). Single implementation plan can cover both without decomposition.
- **Ambiguity check**: tap behavior is uniform across states (always scroll back). Palette values are spelled out per theme and per state. Time-format thresholds are explicit. Position is explicit per layout. Per-state glyphs are explicit. Done-state motion has reduced-motion fallback specified.
