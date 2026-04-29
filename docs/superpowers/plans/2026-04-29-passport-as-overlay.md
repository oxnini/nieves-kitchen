# Passport as Overlay Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Lift the Passport out of the navbar's section-tab row and turn it into a personal control that opens as a full-viewport overlay over the current page, while keeping `/passport` as a real, deep-linkable URL.

**Architecture:** A new `PassportAffordance` component replaces the `/passport` tab in `Navbar`. Clicking it captures the affordance's screen position into a tiny module-level store and routes to `/passport`. A Next.js parallel + intercepting route (`app/@modal/(.)passport/page.tsx`) intercepts in-app navigation and renders the existing `PassportBooklet` inside a new `PassportModal` shell with origin-scale + cross-fade motion. Direct visits to `/passport` still load `app/passport/page.tsx` unchanged.

**Tech Stack:** Next.js 15 App Router (parallel + intercepting routes), React 19, TypeScript, Tailwind v4, Lucide icons. No new dependencies. No test suite is configured in this project (per CLAUDE.md), so each task ends with a manual verification step in the dev server (`npm run dev`) before commit.

**Spec:** `docs/superpowers/specs/2026-04-29-passport-as-overlay-design.md`

---

## File Structure

**New files:**
- `lib/passport-origin.ts` — module-level store for the affordance's last-known screen position. Written by the affordance on click, read by the modal on mount. Plain TS module, no React state.
- `components/passport/PassportAffordance.tsx` — navbar button (icon + count + frame, press feedback, captures origin, navigates to `/passport`).
- `components/passport/PassportModal.tsx` — overlay shell (backdrop, content surface, close handling, focus trap, body-scroll lock, origin-scale motion).
- `app/@modal/default.tsx` — returns `null` so the slot is empty on non-modal routes.
- `app/@modal/(.)passport/page.tsx` — intercepting route; renders `<PassportModal><PassportBooklet /></PassportModal>`.

**Modified files:**
- `app/layout.tsx` — accept and render the `@modal` parallel slot.
- `components/Navbar.tsx` — remove `/passport` from the `links` array; render `<PassportAffordance />` in the right cluster between the tabs and `<ThemeToggle />`.

**Unchanged:**
- `app/passport/page.tsx` and `components/passport/PassportBooklet.tsx`.

---

## Task 1: Origin store

**Files:**
- Create: `lib/passport-origin.ts`

- [ ] **Step 1: Create the module**

```typescript
// lib/passport-origin.ts
export type PassportOrigin = {
  x: number;
  y: number;
  width: number;
  height: number;
};

let origin: PassportOrigin | null = null;

export function setPassportOrigin(next: PassportOrigin | null): void {
  origin = next;
}

export function getPassportOrigin(): PassportOrigin | null {
  return origin;
}
```

- [ ] **Step 2: Verify it compiles**

Run: `npx tsc --noEmit`
Expected: no new errors introduced by `lib/passport-origin.ts`.

- [ ] **Step 3: Commit**

```bash
git add lib/passport-origin.ts
git commit -m "feat(passport): add module-level origin store for affordance position"
```

---

## Task 2: PassportAffordance component

**Files:**
- Create: `components/passport/PassportAffordance.tsx`

- [ ] **Step 1: Write the component**

```tsx
// components/passport/PassportAffordance.tsx
'use client';

import { useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Stamp } from 'lucide-react';

import { useCookedStamps } from '@/hooks/useCookedStamps';
import { setPassportOrigin } from '@/lib/passport-origin';

export default function PassportAffordance() {
  const router = useRouter();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { summary } = useCookedStamps();
  const stampCount = summary.totalStamps;
  const displayCount = stampCount > 99 ? '99+' : String(stampCount);

  function handleClick() {
    const el = buttonRef.current;
    if (el) {
      const rect = el.getBoundingClientRect();
      setPassportOrigin({
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
        width: rect.width,
        height: rect.height,
      });
    }
    router.push('/passport');
  }

  return (
    <button
      ref={buttonRef}
      type="button"
      onClick={handleClick}
      title="Passport"
      aria-label={
        stampCount > 0
          ? `Passport, ${stampCount} stamp${stampCount !== 1 ? 's' : ''}`
          : 'Passport'
      }
      className="
        inline-flex items-center justify-center gap-1.5
        min-w-[44px] h-10 px-2.5
        rounded-md border border-terracotta/70 bg-parchment
        text-brown-dark
        transition-transform duration-75
        active:scale-[0.94] active:shadow-inner
        hover:border-terracotta
      "
    >
      <Stamp size={18} strokeWidth={1.6} />
      {stampCount > 0 && (
        <span className="font-stamp text-sm text-terracotta nums-tabular tracking-[0.04em]">
          {displayCount}
        </span>
      )}
    </button>
  );
}
```

- [ ] **Step 2: Verify it compiles**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add components/passport/PassportAffordance.tsx
git commit -m "feat(passport): add navbar affordance with press feedback and origin capture"
```

---

## Task 3: Update Navbar — remove Passport tab, add affordance

**Files:**
- Modify: `components/Navbar.tsx`

- [ ] **Step 1: Remove `/passport` from `links` and remove the Stamp import**

Replace the `links` array and the import line with:

```tsx
import { Map, BookOpen, Heart, Info } from 'lucide-react';

import { useFavorites } from '@/hooks/useFavorites';
import ThemeToggle from './ThemeToggle';
import PassportAffordance from './passport/PassportAffordance';

const links = [
  { href: '/',          label: 'Explore',     icon: Map      },
  { href: '/recipes',   label: 'All Recipes', icon: BookOpen },
  { href: '/favorites', label: 'Favorites',   icon: Heart    },
  { href: '/about',     label: 'About',       icon: Info     },
] as const;
```

- [ ] **Step 2: Remove the `useCookedStamps` import and `stampCount` lookup**

Delete these lines from the body of `Navbar`:

```tsx
import { useCookedStamps } from '@/hooks/useCookedStamps';
// ...
const { summary } = useCookedStamps();
const stampCount = summary.totalStamps;
```

- [ ] **Step 3: Remove the passport-specific count rendering inside the link map**

Delete this block from inside the `links.map(...)`:

```tsx
{href === '/passport' && stampCount > 0 && (
  <span
    aria-label={`${stampCount} stamp${stampCount !== 1 ? 's' : ''}`}
    className="text-base font-bold text-terracotta nums-tabular"
  >
    {stampCount > 99 ? '99+' : stampCount}
  </span>
)}
```

- [ ] **Step 4: Render the affordance in the right cluster**

In the `<div className="flex items-center gap-0.5 sm:gap-1">` row, immediately after the `links.map(...)` block and immediately before `<ThemeToggle />`, insert:

```tsx
<div className="ml-1 sm:ml-2">
  <PassportAffordance />
</div>
```

- [ ] **Step 5: Verify visually**

Run: `npm run dev`
Open `http://localhost:3000`. Expected:
- The navbar shows four section tabs: Explore, All Recipes, Favorites, About.
- Passport is no longer in the tab row.
- A bordered stamp affordance appears between the last tab and the theme toggle. If you have stamps, the count appears beside the icon in Cutive.
- Pressing the affordance briefly scales it down (~94%) — feels like an ink stamp.
- Clicking the affordance navigates to `/passport` (existing full page; modal route comes later).

- [ ] **Step 6: Commit**

```bash
git add components/Navbar.tsx
git commit -m "feat(navbar): remove Passport tab, add PassportAffordance in right cluster"
```

---

## Task 4: PassportModal component

**Files:**
- Create: `components/passport/PassportModal.tsx`

- [ ] **Step 1: Write the component**

```tsx
// components/passport/PassportModal.tsx
'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { X } from 'lucide-react';

import { getPassportOrigin } from '@/lib/passport-origin';

const OPEN_MS = 220;
const CLOSE_MS = 180;

export default function PassportModal({ children }: { children: ReactNode }) {
  const router = useRouter();
  const overlayRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);
  const [closing, setClosing] = useState(false);

  // Compute transform-origin from captured affordance position; fallback to top-right.
  const origin = typeof window === 'undefined' ? null : getPassportOrigin();
  const transformOrigin = origin
    ? `${origin.x}px ${origin.y}px`
    : 'top right';

  // Detect reduced motion.
  const reducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Body scroll lock.
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  // Focus management.
  useEffect(() => {
    previouslyFocused.current = document.activeElement as HTMLElement | null;
    closeButtonRef.current?.focus();
    return () => {
      previouslyFocused.current?.focus?.();
    };
  }, []);

  // Escape to close.
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.preventDefault();
        startClose();
      }
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, []);

  function startClose() {
    if (closing) return;
    setClosing(true);
    window.setTimeout(
      () => router.back(),
      reducedMotion ? 60 : CLOSE_MS,
    );
  }

  function onBackdropClick(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === e.currentTarget) startClose();
  }

  // Trap focus within the overlay.
  function onKeyDownTrap(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key !== 'Tab') return;
    const root = overlayRef.current;
    if (!root) return;
    const focusables = root.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"]), input, select, textarea',
    );
    if (focusables.length === 0) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  const baseDuration = reducedMotion ? 120 : closing ? CLOSE_MS : OPEN_MS;
  const useTransform = !reducedMotion;
  const scale = closing ? 0.96 : 1;
  const opacity = closing ? 0 : 1;

  return (
    <div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-label="Passport"
      onKeyDown={onKeyDownTrap}
      onClick={onBackdropClick}
      className="fixed inset-0 z-[60] flex items-start justify-center"
    >
      {/* Backdrop */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-brown-dark/40 backdrop-blur-sm transition-opacity"
        style={{
          opacity,
          transitionDuration: `${baseDuration}ms`,
          transitionTimingFunction: 'ease-out',
        }}
      />

      {/* Surface */}
      <div
        className="relative w-full h-full overflow-y-auto bg-parchment"
        style={{
          opacity,
          transform: useTransform ? `scale(${closing ? scale : 1})` : undefined,
          transformOrigin,
          transition: useTransform
            ? `opacity ${baseDuration}ms ease-out, transform ${baseDuration}ms ease-out`
            : `opacity ${baseDuration}ms ease-out`,
          // Initial state for opening animation: start small, fade in.
          animation: closing
            ? undefined
            : useTransform
              ? `passport-open ${OPEN_MS}ms ease-out`
              : `passport-fade ${baseDuration}ms ease-out`,
        }}
      >
        <div className="sticky top-0 z-10 flex justify-end p-3 sm:p-4">
          <button
            ref={closeButtonRef}
            type="button"
            onClick={startClose}
            aria-label="Close passport"
            className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-parchment/90 border border-brown-dark/15 text-brown-dark hover:border-brown-dark/30 transition-colors"
          >
            <X size={20} strokeWidth={1.6} />
          </button>
        </div>
        <div className="px-4 sm:px-6 pb-10">
          <div className="max-w-5xl mx-auto">{children}</div>
        </div>
      </div>

      <style jsx>{`
        @keyframes passport-open {
          from {
            opacity: 0;
            transform: scale(0.92);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        @keyframes passport-fade {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
```

- [ ] **Step 2: Verify it compiles**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add components/passport/PassportModal.tsx
git commit -m "feat(passport): add modal shell with origin-scale motion, focus trap, and scroll lock"
```

---

## Task 5: Add @modal parallel slot to root layout

**Files:**
- Modify: `app/layout.tsx`
- Create: `app/@modal/default.tsx`

- [ ] **Step 1: Create the default slot file**

```tsx
// app/@modal/default.tsx
export default function Default() {
  return null;
}
```

- [ ] **Step 2: Update `RootLayout` to accept and render `modal`**

Replace the `RootLayout` function in `app/layout.tsx` with:

```tsx
export default function RootLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${figtree.variable} ${literata.variable} ${cutiveMono.variable}`} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `try{if(localStorage.getItem('nieves-theme')==='sepia')document.documentElement.dataset.theme='sepia'}catch(e){}`,
          }}
        />
      </head>
      <body className="min-h-screen bg-parchment overflow-x-hidden">
        <Providers>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:bg-terracotta focus:text-white focus:px-4 focus:py-2 focus:rounded-full focus:text-sm focus:font-medium focus:shadow-lg"
          >
            Skip to content
          </a>
          <Navbar />
          <main id="main">
            {children}
          </main>
          {modal}
        </Providers>
      </body>
    </html>
  );
}
```

- [ ] **Step 3: Verify it compiles and existing routes still render**

Run: `npm run dev`
Open `http://localhost:3000`, `/recipes`, `/favorites`, `/about`, `/passport` directly. Expected:
- All routes render normally.
- No console errors about missing parallel slots.
- Direct visit to `/passport` still loads the existing full page.

- [ ] **Step 4: Commit**

```bash
git add app/layout.tsx app/@modal/default.tsx
git commit -m "feat(layout): add @modal parallel slot to root layout"
```

---

## Task 6: Intercepting route — render passport in modal on in-app nav

**Files:**
- Create: `app/@modal/(.)passport/page.tsx`

- [ ] **Step 1: Create the intercepting page**

```tsx
// app/@modal/(.)passport/page.tsx
'use client';

import { Suspense } from 'react';
import PassportBooklet from '@/components/passport/PassportBooklet';
import PassportModal from '@/components/passport/PassportModal';

export default function InterceptedPassportPage() {
  return (
    <PassportModal>
      <Suspense
        fallback={
          <div className="py-10 text-center text-brown-medium">
            Opening your passport…
          </div>
        }
      >
        <PassportBooklet />
      </Suspense>
    </PassportModal>
  );
}
```

- [ ] **Step 2: Verify the overlay flow end-to-end**

Run: `npm run dev`
Open `http://localhost:3000` and:
1. Click the passport affordance in the navbar.
   Expected: the passport opens as a full-viewport overlay, scaling out from the affordance's position; the underlying page is dimmed; the URL changes to `/passport`.
2. Press `Escape`.
   Expected: the overlay scales back toward the affordance and closes; URL returns to `/`.
3. Open the overlay again, then click the close button (top-right X).
   Expected: same close behavior.
4. Open the overlay again, then click outside the surface (on the dimmed backdrop).
   Expected: same close behavior.
5. Open the overlay, then press the browser back button.
   Expected: overlay closes.
6. With the overlay open, refresh the page.
   Expected: the full `/passport` page renders (no overlay) — confirms direct-URL fallback.
7. From the homepage, open the overlay, click an in-modal link that navigates elsewhere (e.g., a recipe link inside a stamp, if present).
   Expected: navigation proceeds and the overlay is gone after navigation.
8. Reload `http://localhost:3000` and tab through the navbar to the affordance, press `Enter`.
   Expected: overlay opens and focus moves to the close button. Tab cycles within the overlay. Closing returns focus to the affordance.

If `prefers-reduced-motion` is enabled in the OS, repeat step 1 — expected: opacity-only fade, no scale.

- [ ] **Step 3: Commit**

```bash
git add app/@modal/(.)passport/page.tsx
git commit -m "feat(passport): intercept in-app /passport navigation, render as overlay"
```

---

## Task 7: Polish pass

**Files:**
- Modify (as needed): `components/passport/PassportAffordance.tsx`, `components/passport/PassportModal.tsx`

- [ ] **Step 1: Visual polish check**

Run: `npm run dev`. With and without stamps in the passport, in both `parchment` and `sepia` themes:
- Affordance border, fill, and count contrast read clearly.
- Affordance height aligns visually with the section tabs (h-16 row, affordance h-10 centered).
- Overlay close button is visible and reachable on top of any sticky content inside the booklet.
- Backdrop blur isn't excessive on lower-powered devices (consider dropping `backdrop-blur-sm` if the device feels sluggish — opacity dim alone is acceptable).

Make targeted adjustments only if something is visibly off; do not refactor.

- [ ] **Step 2: Lint**

Run: `npm run lint`
Expected: no new lint errors introduced by any new file.

- [ ] **Step 3: Build**

Run: `npm run build`
Expected: build succeeds, no type errors, no missing-route warnings.

- [ ] **Step 4: Commit any polish edits**

```bash
git add -A
git commit -m "chore(passport): polish affordance and modal after manual QA"
```

If no edits were needed, skip this commit.

---

## Done Criteria

- The navbar shows four section tabs (no Passport tab) and a distinct stamp affordance with a Cutive count.
- Clicking the affordance opens a full-viewport passport overlay that scales out from the affordance's screen position.
- Escape, the close button, the backdrop, and the browser back button all close the overlay.
- Direct visits to `/passport` (typed URL or refresh) load the existing full page unchanged.
- `prefers-reduced-motion` users get an opacity-only fade.
- `npm run lint` and `npm run build` pass.
