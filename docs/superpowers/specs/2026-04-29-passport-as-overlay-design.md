# Passport as Overlay — Design Spec

**Date:** 2026-04-29
**Status:** Approved (brainstorm)
**Scope:** Navbar + Passport access pattern

---

## Problem

The Passport is the signature feature of Nieves' Kitchen — the user's collected stamps from cooking globally. Today it sits in the navbar as one of five equal section tabs (`Explore`, `All Recipes`, `Favorites`, `Passport`, `About`). This treatment doesn't reflect what the Passport actually is or how users relate to it.

Two mismatches:

1. **Mental model.** Users do not navigate to the Passport to *do* something (browse recipes, find content). They check it occasionally, mostly after cooking, to see what they've collected. It is achievement and status, not a section of the site.
2. **Brand voice.** The navbar is otherwise correct (parchment, terracotta accent, Lucide icons, clean rule beneath) but it carries no piece of the passport vocabulary that defines the rest of the app. The chrome is generic; the soul of the product is invisible in it.

## Goal

Treat the Passport as something the user *carries* — accessible from anywhere, opens in place without losing context, and visually distinct in the navbar so the chrome itself starts hinting at the soul of the product.

## Non-Goals

- Adding new content or features to the Passport itself. The booklet's contents stay exactly as they are today.
- Redesigning the rest of the navbar. The four section tabs (Explore, All Recipes, Favorites, About) keep their current treatment.
- Replacing the existing `/passport` route. It must continue to work as a real, deep-linkable URL.
- Adding a passport widget to other pages (e.g., the Explore map). That was considered and rejected — discoverability through the navbar affordance is enough.

---

## Design

### 1. Navbar changes

**Remove** the `/passport` link from the section-tabs lineup in `components/Navbar.tsx`. The `links` array drops to four entries: Explore, All Recipes, Favorites, About.

**Add** a distinct passport affordance in the navbar's right cluster, sitting between the favorites count and the `ThemeToggle`. The affordance is *not* styled as a tab — it is a personal control with its own visual vocabulary.

**Affordance treatment (Q1, option B):**
- Lucide `Stamp` icon inside a subtle rounded-rect / postmark-shaped frame
- 1px `terracotta` border, `parchment` fill, `rounded-md`
- Stamp count rendered beside the icon in `font-stamp` (Cutive), tracking +0.04em, terracotta
- Tooltip via `title="Passport"` for first-timer recognition
- Min tap target 44×44px

This is a placeholder treatment. The user will design custom stamp/postmark artwork later and swap it into this slot. The component should be structured so the visual treatment is easy to replace without touching the routing or open/close behavior.

### 2. Routing — passport as overlay

The `/passport` route stays. Add a parallel + intercepting modal slot so navigation from inside the app opens the passport as an overlay, while direct URL hits still load the full page.

File structure:

```
app/
  layout.tsx              # add @modal slot to children
  passport/
    page.tsx              # existing — full page, unchanged content
  @modal/
    default.tsx           # returns null
    (.)passport/
      page.tsx            # renders <PassportBooklet /> inside <PassportModal />
```

- `app/layout.tsx` is updated to accept and render the `@modal` parallel slot alongside `children`.
- `@modal/default.tsx` returns `null` so non-modal routes render nothing in the slot.
- `(.)passport/page.tsx` intercepts navigation to `/passport` from inside the app and renders the same `PassportBooklet` content inside a new `PassportModal` shell.
- Direct visits to `/passport` (typed URL, refresh, external link) bypass interception and render `app/passport/page.tsx` as today.

The existing `<PassportBooklet />` component is already extracted (see `app/passport/page.tsx`), so the same component can be reused inside the modal with no refactor of the passport content itself.

### 3. PassportModal component

A new client component, `components/passport/PassportModal.tsx`, owns the overlay shell:

- Full-viewport modal: backdrop (`bg-brown-dark/40` + subtle blur) + content surface (`bg-parchment`, max content width, vertical scroll inside).
- Close affordances: dedicated close button (top-right), Escape key, click on backdrop, browser back button (handled by the route — `router.back()` on close).
- Focus trap inside the modal while open. Returns focus to the affordance on close.
- Sets `aria-modal="true"`, `role="dialog"`, `aria-labelledby` pointing at the booklet's title.
- Locks body scroll while open.
- Mobile: same full-viewport sheet — no separate mobile drawer.

### 4. Motion (Q2 combined: D + E.press)

Two-part motion, scoped tightly to the affordance and the overlay open/close.

**Affordance press feedback** (lives on the navbar button, fires on every click):
- `active:scale-[0.94]` with brief inset shadow shift, ~80ms
- Reads as an ink stamp being pressed
- Available even before overlay routing is wired (cheap, isolated)

**Overlay open — origin scale:**
- The overlay scales out *from* the affordance's screen position to full viewport
- Implementation: capture the affordance's `getBoundingClientRect()` on click, set the modal's CSS `transform-origin` to that point, animate `opacity 0→1` and `transform: scale(0.92)→scale(1)` over ~220ms with `ease-out`
- Backdrop fades in alongside (`opacity 0→1`, same duration)

**Overlay close:**
- Reverses: `opacity 1→0` and `transform: scale(1)→scale(0.96)` over ~180ms, with the same `transform-origin` so it visually retreats toward the affordance
- Backdrop fades out alongside
- After animation completes, route changes (`router.back()`)

**Reduced motion:** if `prefers-reduced-motion: reduce`, drop both transforms and use only opacity fade (~120ms).

### 5. Edge cases

- **Click a recipe link from inside the overlay.** The intercepted route closes (overlay animates out) and navigation proceeds to the recipe page.
- **Direct visit to `/passport` while another modal pattern is in use.** Not applicable — there are no other intercepted modals.
- **Refresh while overlay is open.** The URL is `/passport`, so the user lands on the full page version. Acceptable.
- **Navigate via browser back from inside the overlay.** `router.back()` closes the overlay and returns to the prior page. Already handled by the intercepting route pattern.
- **Open overlay, then click another navbar tab.** The new route navigation closes the overlay and proceeds to the chosen section.

### 6. Accessibility

- Affordance has `title="Passport"`, an `aria-label` (because the visible content is icon + numeral, not the word "Passport"), and the count uses an `aria-label` of the form `"N stamps"` already established for the Favorites count.
- Modal has `role="dialog"`, `aria-modal="true"`, `aria-labelledby` pointing to the booklet's title element.
- Focus moves to the close button when the modal opens; focus returns to the affordance on close.
- Escape closes. Tab cycles within the modal.
- Body scroll locked while modal open.

---

## Files Touched

**Modified:**
- `components/Navbar.tsx` — remove `/passport` from `links`; add affordance in right cluster.
- `app/layout.tsx` — accept and render `@modal` parallel slot.

**New:**
- `components/passport/PassportAffordance.tsx` — the navbar button (icon + count + frame, press feedback, click handler that captures origin and routes to `/passport`).
- `components/passport/PassportModal.tsx` — overlay shell (backdrop, content surface, close handling, focus trap, motion).
- `app/@modal/default.tsx` — returns `null`.
- `app/@modal/(.)passport/page.tsx` — renders `<PassportModal><PassportBooklet /></PassportModal>`.

**Unchanged:**
- `app/passport/page.tsx` — direct-URL full-page view.
- `components/passport/PassportBooklet.tsx` and all passport content components.

## Out of Scope

- Final visual treatment of the affordance artwork (user will design and replace).
- Changes to passport content, regions, stamp logic, or any data layer.
- Changes to other navbar tabs.
- Onboarding cue / first-time tooltip for the affordance — possible future enhancement, not in this spec.

## Trade-offs Acknowledged

- **Engineering cost.** Intercepting routes plus a new modal component is moderate work, accepted as worth it.
- **Affordance design risk.** Placeholder is acceptable; user will refine artwork later.
- **First-timer recognition.** Mitigated by tooltip + visible count; not eliminated.
- **Mixed navbar behavior.** Four tabs navigate, one button overlays. The visual difference between the affordance and the tabs is intentional and signals the behavioral difference.
