# Passport chrome redesign

Date: 2026-05-03
Status: Draft — pending review

## Problem

Three pieces of chrome around the passport booklet feel bolted-on rather than part of the booklet. They also have functional problems:

1. **Bottom page indicator** (`components/passport/PageIndicator.tsx`) — low-contrast dots that nearly disappear, 24×24 buttons holding 8×8 dots (poor touch targets), a help-button focus/active artifact that reads as a bug, and on mobile it degrades to plain "1 / 13" text with no jump UI at all.
2. **Close button** (`components/passport/PassportModal.tsx:137–145`) — a circular Lucide X with a parchment background, border, and shadow, anchored *outside* the booklet on desktop. Looks like a UI element bolted onto the booklet rather than part of it.
3. **Prev/next chevrons** (`components/passport/NavChevrons.tsx`) — large circular `bg-parchment` buttons with shadow + border around small Lucide chevrons. The button chrome eats whitespace and reads as floating widgets, not page-turn affordances.

A separate but load-bearing bug needs to ship with this work: arrow-key navigation inside the booklet is broken because `useBookletNav.ts:103` early-returns when the keyboard event target is inside any `[role="dialog"]`, and the passport modal sets exactly that role.

## Goals

- Replace the three chrome elements with a unified, minimal "ink mark" visual language so they feel like part of the page material.
- Make the bottom strip useful: readable in both parchment and sepia themes, proper touch targets, and matched to the passport's mental model (regions, not page numbers).
- Fix arrow-key navigation inside the booklet without breaking it for child modals stacked on top.
- Each piece must be implementable and visually verifiable in isolation, on a temporary dev route.
- Avoid the previous-attempt pitfall: no shared primitive that bakes positioning into its base classes.

## Non-goals

- No change to the booklet's content, spreads, or stamp grid.
- No change to swipe handling, transitions, or the modal lifecycle (open/close animation, focus trap, body scroll lock, escape-to-close).
- No new pages or features in the passport beyond the chrome rework.
- No theme or token changes outside what's required to make the chip strip readable.

## Visual language

A single shared treatment for all three controls: **inked marks on the page material.** Hairline strokes drawn in `--color-brown-dark` at low resting opacity, no fills, no surrounding shapes. They feel hand-stamped onto the paper.

| Mark | Glyph | Position | Approx. size |
|---|---|---|---|
| Close | × (two crossed hairlines) | `top-4 right-4` of booklet | 14–16px |
| Help | ? (hairline) | `top-4 left-4` of booklet | 14–16px |
| Prev | ‹ (hairline chevron) | `bottom-4 left-4` of booklet | 18–22px |
| Next | › (hairline chevron) | `bottom-4 right-4` of booklet | 18–22px |

The four marks form a symmetric corner quartet. Same insets across all positions; consistent visual weight.

Shared properties:

- Hairline weight: `strokeWidth={1.25}` on Lucide icons (`X`, `HelpCircle` replaced with a plain `?` glyph or `CircleHelp` rendered hairline, `ChevronLeft`/`ChevronRight`).
- Resting opacity: `0.35`.
- Hover/focus opacity: `0.85`.
- Disabled opacity: `0.15`, `pointer-events: none`.
- Focus ring: `--color-terracotta`, applied via `focus-visible:ring-2 focus-visible:ring-terracotta`.
- Hit area: 40–44px invisible square behind the visible mark (achieved with padding on the button so the visible mark sits centered in a larger tap target).
- No background, no border, no shadow at any state.
- Transitions on opacity respect `prefers-reduced-motion: reduce` (no transition under reduced motion).

## Region chip strip (replaces page indicator)

Replaces the dot-per-spread row with a section-level wayfinding strip.

### Sections

Derived once via `useMemo` from the existing `spreads: SpreadDescriptor[]` array. Walk the array and emit one chip per unique `(kind, region)` pair in encounter order. For region spreads, sections are keyed on the region only — continuation spreads (`continuationIndex > 0`) collapse into the same chip as their primary.

Resulting chips for the typical booklet:

> Cover · Profile · Africa · Americas · Asia · Europe · Oceania · Summary

(Region chips depend on which regions have content; absent regions don't appear.)

### Layout

A single horizontal row, anchored where `PageIndicator` is today (rendered in `PassportBooklet.tsx`, line 105 area).

- Each chip: text label, no border or fill, padded so the hit target is ≥ 44px tall.
- Separators between chips: a hairline `·` mark or thin vertical rule in `--color-brown-light/40`.
- Active chip: full `--color-brown-dark` text, plus a hand-drawn-looking under-stroke in `--color-terracotta`.
- Inactive chips: `--color-brown-medium` at full opacity (legible) — no faded states that disappear into the background.
- Strip surface inherits `passport-light` styling so contrast is identical in parchment and sepia themes (same trick the booklet already uses; see `app/globals.css` lines 118–141).

### Within-section progress

When the active chip's section spans more than one spread (a multi-spread region), a small monospace hint appears beside the active chip:

> `Asia · 2 / 4`

The hint:

- Uses `font-stamp` (Cutive) for a postal/monospace feel.
- Same color as inactive chip text.
- Appears only when relevant. Cover, Profile, and Summary never show it.

### Mobile

Strip horizontally scrolls (`overflow-x: auto`, scroll snapping to chip starts). On `nav.index` change, the active chip is auto-scrolled into view via `Element.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' })`. Smooth behavior is suppressed under reduced motion.

### Help glyph

Removed from the strip. Embedded help-as-a-tool inside a wayfinding component conflates surfaces. Help moves to a corner mark (see below).

### Click behavior

Clicking a chip jumps to that section's first spread:

- For region chips: the spread where `kind === 'region' && region === <chip> && continuationIndex === 0`.
- For Cover, Profile, Summary: the matching `kind` spread.

To navigate within a multi-spread region, users use prev/next, swipe, or arrow keys. Chip-level granularity matches the wayfinding mental model (sections, not pages).

## Close mark relocation

Today `PassportModal.tsx` renders the close button on the modal surface (anchored `top-3 right-3` mobile, `sm:-top-2 sm:-right-2` desktop) with parchment background, border, and shadow. After this change:

- `PassportModal.tsx` no longer renders a close button. Its responsibilities shrink to: backdrop, focus trap, body scroll lock, escape-to-close, transform animation, and rendering children.
- `BookletShell.tsx` renders a `CloseInkMark` at `top-4 right-4` of the booklet's outer container, inside the page material on every state (cover, open spread, back cover, mobile single page).
- `PassportModal` continues to own its 180ms close animation. To trigger that animation from a descendant (`CloseInkMark` inside `BookletShell`), `PassportModal` exposes its internal `startClose` function via a small React context (`PassportModalContext` + `usePassportModalClose` hook). `BookletShell` reads it. No prop drilling, no new files — the context lives inside `PassportModal.tsx` itself.
- Initial focus on modal open moves to `CloseInkMark` (was on the modal's own close button). `BookletShell` focuses its `CloseInkMark` ref on first render.

## Prev/next ink marks

`NavChevrons.tsx` is deleted. The four corner marks (close, help, prev, next) are all rendered directly inside `BookletShell` rather than via a `chrome` slot — `BookletShell` now owns the page-corner chrome as part of its definition.

- Left chevron: `bottom-4 left-4` of the booklet's outer container.
- Right chevron: `bottom-4 right-4`.
- Each gets `disabled` (when `!canPrev` / `!canNext`, or while `nav.isFlipping`) which applies the disabled opacity and removes pointer events.
- On the cover, only the right chevron is enabled (left becomes disabled — opacity `0.15`, no pointer events). On the back cover, only the left.
- 44×44 invisible hit zone, smaller visible mark.

The existing `chrome` prop on `BookletShell` is removed — it was only ever used by `NavChevrons`, and after this change `BookletShell` renders prev/next/close/help itself. `PassportBooklet` passes navigation handlers (`onPrev`, `onNext`, `canPrev`, `canNext`, `disabled`) and `onClose` as props.

## Help mark placement

`HelpInkMark` is rendered inside `BookletShell` at `top-4 left-4`, mirroring the close mark. It manages its own `helpOpen` state internally and renders `PassportHelpModal` colocated — same colocation pattern the old `PageIndicator` used. The mark uses `aria-haspopup="dialog"` and `aria-expanded` to advertise this to assistive tech.

## Component architecture

```
components/passport/
  InkMark.tsx                   # primitive: visible mark + invisible hit area + state styles
  CloseInkMark.tsx              # X glyph + onClose handler
  PageTurnInkMark.tsx           # ‹ / › glyph + direction + disabled handling
  HelpInkMark.tsx               # ? glyph + opens PassportHelpModal
  RegionChipStrip.tsx           # section-level wayfinding strip
  RegionChip.tsx                # single chip (label, active state, jump handler)
  PageIndicator.tsx             # DELETED
  NavChevrons.tsx               # DELETED
```

### `InkMark` primitive — the critical rule

The previous attempt failed because the shared primitive baked `position: relative` into its base classes, silently overriding the absolute positioning consumers passed via `className`. To prevent recurrence:

- `InkMark` is a `<button>` with base classes `inline-flex items-center justify-center` only.
- It does **not** accept a `position` prop and does **not** apply any `position`, `top`, `left`, `right`, or `bottom` utility in its base.
- Consumers pass `className` to add `absolute top-X right-Y` themselves.
- The component's PropTypes / TypeScript signature explicitly does not include positioning props — there is nowhere for positioning to leak in.

### `InkMark` API

```ts
interface InkMarkProps {
  glyph: ReactNode;          // The Lucide icon or SVG to render
  label: string;             // aria-label
  onClick?: () => void;
  disabled?: boolean;
  className?: string;        // consumer-controlled positioning
  size?: number;             // visible glyph size in px (default: 16)
  hitSize?: number;          // hit area size in px (default: 44)
  ariaHasPopup?: 'dialog' | 'menu' | undefined;
  ariaExpanded?: boolean;
}
```

It applies the shared opacity / focus / disabled styles internally. Consumers don't restyle these.

### Wrappers

`CloseInkMark`, `PageTurnInkMark`, `HelpInkMark` are thin: they pick the glyph, the `aria-label`, the `onClick`, and pass through any consumer `className`. They exist to keep call sites readable.

## Keyboard navigation fix

`hooks/useBookletNav.ts:103` currently:

```ts
if (target?.closest('input, textarea, [contenteditable="true"], [role="dialog"]')) return;
```

This blocks arrow keys whenever focus is inside *any* dialog, including the passport modal itself.

Fix:

1. `PassportModal.tsx` adds `data-passport-root` to its outer dialog `<div>`.
2. `useBookletNav` changes the dialog check to allow events whose closest dialog is the passport root, and block events whose closest dialog is anything else (e.g., `PassportHelpModal`, `StampedRecipesModal` stacked on top).

```ts
const target = e.target as HTMLElement | null;
if (target?.closest('input, textarea, [contenteditable="true"]')) return;
const dialog = target?.closest('[role="dialog"]');
if (dialog && !dialog.hasAttribute('data-passport-root')) return;
```

This ships as part of the same change so the chrome redesign is keyboard-accessible end-to-end.

## States to support

Each control must work in all booklet states:

| State | Cover (closed) | Open spread | Back cover | Mobile single page |
|---|---|---|---|---|
| Close | ✓ visible | ✓ visible | ✓ visible | ✓ visible |
| Help | ✓ visible | ✓ visible | ✓ visible | ✓ visible |
| Prev | disabled (no left) | enabled if `canPrev` | enabled | enabled if `canPrev` |
| Next | enabled | enabled if `canNext` | disabled | enabled if `canNext` |
| Chip strip | active = Cover | active = current section | active = Summary | same as desktop, scrolls |

While `nav.isFlipping`, both chevrons take the disabled state.

## Theming

The booklet, modal surface, and chip strip all live inside `passport-light` (see `app/globals.css` lines 118–141), which locks the parchment tokens to their light values regardless of `data-theme="sepia"`. The chip strip must inherit this so contrast is identical across themes. We add the `passport-light` class to the chip strip's outer wrapper if it isn't already inside the modal surface — verify during implementation that the wrapper inherits, otherwise add it explicitly.

The marks use `--color-brown-dark` directly (which is also locked by `passport-light` to its parchment value). No theme-conditional code paths.

## Accessibility

- All marks are real `<button>` elements with `aria-label`s.
- Focus visible: `focus-visible:ring-2 focus-visible:ring-terracotta` on every mark.
- Disabled chevrons: `aria-disabled` and `pointer-events: none`.
- Help mark: `aria-haspopup="dialog"`, `aria-expanded={helpOpen}`.
- Chip strip: `role="tablist"` retained from current implementation; chips are `role="tab"` with `aria-selected`.
- Live region announcing the active page (`aria-live="polite"` block in `PassportBooklet.tsx` line 71) is unchanged.
- Keyboard: arrow keys now work inside the booklet (per the fix above). Tab order goes through close, help, chevrons, content, chip strip in a predictable sequence.

## Reduced motion

- Mark opacity transitions: removed under reduced motion.
- Chip-strip auto-scroll: jumps instead of smooth-scrolling.
- The booklet's existing flip and modal animations are unchanged.

## Dev route for isolation

A temporary route at `app/_dev/passport-chrome/page.tsx` for visual verification before wiring into the live booklet.

### Layout

A grid: one row per control, three columns per background.

| | Parchment | Sepia | Region photo |
|---|---|---|---|
| `InkMark` (raw) | resting / hover / focus / disabled | same | same |
| `CloseInkMark` | mock booklet corner | same | same |
| `HelpInkMark` | mock booklet corner | same | same |
| `PageTurnInkMark` | mock booklet bottom corners | same | same |
| `RegionChipStrip` | full strip with active chip + within-section hint | same | same |

Each cell renders the control four times to show resting, hover (forced via class), focus (forced), and disabled states without requiring interaction.

The route is a Server Component or Client Component as needed (chip strip needs interactivity, marks don't); kept simple, no nav, just static frames.

### Screenshot checkpoints

Each subagent task ends with a screenshot capture of the relevant dev-route cell. The screenshot is the gate before merging into the booklet — visual diff against the design intent.

### Cleanup

After all controls are wired in and verified, delete `app/_dev/passport-chrome/` as the final step of the implementation plan.

## File-level changes summary

**Created:**

- `components/passport/InkMark.tsx`
- `components/passport/CloseInkMark.tsx`
- `components/passport/PageTurnInkMark.tsx`
- `components/passport/HelpInkMark.tsx`
- `components/passport/RegionChipStrip.tsx`
- `components/passport/RegionChip.tsx`
- `app/_dev/passport-chrome/page.tsx` (temporary)

**Deleted:**

- `components/passport/PageIndicator.tsx`
- `components/passport/NavChevrons.tsx`

**Modified:**

- `components/passport/PassportModal.tsx` — remove inline close button; add `data-passport-root` to outer dialog div; drop ref/focus management for the close button; preserve all other behavior.
- `components/passport/PassportBooklet.tsx` — render `RegionChipStrip` instead of `PageIndicator`; pass `onPrev`, `onNext`, `canPrev`, `canNext`, `navDisabled` to `BookletShell` as props (no `chrome` slot). `BookletShell` reads close via context, so `PassportBooklet` doesn't drill `onClose`.
- `components/passport/BookletShell.tsx` — remove `chrome` prop; render `CloseInkMark`, `HelpInkMark`, and two `PageTurnInkMark` instances at the four corners; accept the navigation props described above; read close via `usePassportModalClose()`; focus the close mark on first render.
- `components/passport/hooks/useBookletNav.ts` — update line 103 check to allow `[data-passport-root]` dialogs.
- `components/passport/PassportOverlay.tsx` — unchanged; it already passes `onClose` to `PassportModal` and that contract doesn't change.

## Implementation order

A subsequent implementation plan will sequence these as independent tasks for parallel subagent execution where possible:

1. Build `InkMark` primitive + dev route scaffold. Screenshot checkpoint.
2. Build `CloseInkMark`, `HelpInkMark`, `PageTurnInkMark` wrappers. Screenshot checkpoint per wrapper.
3. Build `RegionChipStrip` + `RegionChip`. Screenshot checkpoint.
4. Apply keyboard nav fix in `useBookletNav.ts` and add `data-passport-root` to `PassportModal`. (Can land independently.)
5. Wire `CloseInkMark` and `HelpInkMark` into `BookletShell`; remove close button from `PassportModal`; prop-drill `onClose`.
6. Wire `PageTurnInkMark` instances into `PassportBooklet` `chrome` slot; delete `NavChevrons.tsx`.
7. Wire `RegionChipStrip` into `PassportBooklet`; delete `PageIndicator.tsx`.
8. Manual smoke test of full booklet (cover → spread → back cover, mobile, both themes, keyboard arrows, escape, focus trap).
9. Delete `app/_dev/passport-chrome/` directory.

## Risks and trade-offs

- **Two corner marks always visible.** The cost of the symmetric corner pattern is that the booklet now has *two* small marks in its top corners at all times (close right, help left). Mitigated by low resting opacity (~0.35); if it still feels too much during review, we can reduce help to a single rest stop on the cover/inside-front and consider help-elsewhere later. Not blocking the spec.
- **Region chips can wrap or scroll on small viewports.** With nine sections, a phone in portrait might not fit them all. Accepted: the chip strip horizontally scrolls and snaps. We will not stack into multiple rows.
- **Section-level granularity removes per-spread jumps.** Users can no longer jump directly to "Asia spread 3". Accepted: this is the deliberate UX call from brainstorming. If user testing shows people want it, the chip strip can grow a long-press / right-click "expand to full TOC" affordance later.
- **Keyboard fix is load-bearing.** Shipping the chrome redesign without the fix would leave the booklet keyboard-inaccessible. The plan groups them so they ship together.

## Open questions

None at this time. All clarifying questions resolved during brainstorming.
