# Map Recipe Modal Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make recipe clicks from the Explorer map open a centered modal overlay (with the map preserved underneath) instead of navigating away, with one-click dismiss and an explicit "Open full recipe" affordance for committed reading.

**Architecture:** Next.js parallel + intercepting routes. A new `@modal` slot in the root layout receives an intercepted `(.)recipes/[slug]` route. Direct visits to `/recipes/[slug]` (refresh, share) bypass the interceptor and render the existing full page. Sidebar item clicks remain `router.push` from a fresh `/`, but use `router.replace` if the modal is already open to keep history clean. Map gets `inert` while the modal is open.

**Tech Stack:** Next.js 15 (App Router), React 19, framer-motion, Tailwind v4, lucide-react. No test framework — verification is via `npm run lint`, `npm run build`, and manual browser checks against `npm run dev`.

**Spec:** `docs/superpowers/specs/2026-05-02-map-recipe-modal-design.md`

---

## File Plan

| File | Action | Responsibility |
|---|---|---|
| `lib/recipes/get.ts` | Create | Shared `getRecipe(slug)` server util used by full page and modal route |
| `app/recipes/[slug]/page.tsx` | Modify | Import `getRecipe` from shared util |
| `app/@modal/default.tsx` | Create | Returns `null` — required default for the parallel slot |
| `app/@modal/(.)recipes/[slug]/page.tsx` | Create | Server component: fetch recipe, render `<RecipeModal>` wrapping `<RecipeDetail>` |
| `components/RecipeModal.tsx` | Create | Client modal shell: backdrop, dismissal, focus trap, motion, "Open full recipe" link |
| `app/layout.tsx` | Modify | Accept and render the `@modal` parallel slot |
| `components/WorldMap.tsx` | Modify | `replace`-vs-`push` for recipe nav; apply `inert` to map container while modal open |

Each task below produces a self-contained change with a commit at the end.

---

### Task 1: Extract `getRecipe` to shared util

**Files:**
- Create: `lib/recipes/get.ts`
- Modify: `app/recipes/[slug]/page.tsx`

- [ ] **Step 1: Create the shared util**

Create `lib/recipes/get.ts`:

```ts
import { cache } from 'react';
import { createClient } from '@/lib/supabase/server';
import type { DbRecipe } from '@/lib/types';

export const getRecipe = cache(async (slug: string) => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('recipes')
    .select('*')
    .eq('slug', slug)
    .single();

  if (!data || error) return null;
  return data as DbRecipe;
});
```

- [ ] **Step 2: Refactor the full-page route to use it**

In `app/recipes/[slug]/page.tsx`, replace the inline `cache(...)` definition with an import from the new util. Final file:

```tsx
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { dbToRecipe } from '@/lib/types';
import { getRecipe } from '@/lib/recipes/get';
import RecipeDetail from '@/components/RecipeDetail';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const data = await getRecipe(slug);

  if (!data) return {};

  return {
    title: `${data.title} — Nieves' Kitchen`,
    description: data.quote,
    openGraph: {
      title: `${data.title} — Nieves' Kitchen`,
      description: data.quote,
    },
  };
}

export default async function RecipePage({ params }: Props) {
  const { slug } = await params;
  const data = await getRecipe(slug);

  if (!data) notFound();

  const recipe = dbToRecipe(data);
  return <RecipeDetail recipe={recipe} />;
}
```

- [ ] **Step 3: Verify lint and build**

Run: `npm run lint`
Expected: no errors.

Run: `npm run build`
Expected: build succeeds, `/recipes/[slug]` route compiles.

- [ ] **Step 4: Manually verify the full page still works**

Run: `npm run dev`
Visit: `http://localhost:3000/recipes/<any-existing-slug>` (use a slug from the recipes table, e.g. visit the map and copy a real slug into the URL).
Expected: recipe detail page renders identically to before.

- [ ] **Step 5: Commit**

```bash
git add lib/recipes/get.ts app/recipes/[slug]/page.tsx
git commit -m "Extract getRecipe to shared util"
```

---

### Task 2: Add `@modal` parallel slot to root layout

**Files:**
- Create: `app/@modal/default.tsx`
- Modify: `app/layout.tsx`

- [ ] **Step 1: Create the slot's default fallback**

Create `app/@modal/default.tsx`:

```tsx
export default function ModalDefault() {
  return null;
}
```

This is required by Next.js: when no route is matched in the slot, it renders this default. Without it, navigation between routes that don't have a corresponding modal route will throw.

- [ ] **Step 2: Wire the slot into the root layout**

Modify `app/layout.tsx` to accept and render the `modal` slot. Replace the `RootLayout` function (line 33-59) with:

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

- [ ] **Step 3: Verify build**

Run: `npm run build`
Expected: build succeeds. Next.js detects the `@modal` slot and the `default.tsx` fallback.

- [ ] **Step 4: Manually verify nothing visually changed**

Run: `npm run dev`
Visit: `http://localhost:3000/`, `/recipes`, `/recipes/<slug>`, `/about`.
Expected: every page renders exactly as before. The `@modal` slot is rendering `null` everywhere so far.

- [ ] **Step 5: Commit**

```bash
git add app/@modal/default.tsx app/layout.tsx
git commit -m "Add @modal parallel slot to root layout"
```

---

### Task 3: Build the `RecipeModal` shell

**Files:**
- Create: `components/RecipeModal.tsx`

This is the largest task — the modal shell with backdrop, dismissal, motion, focus management, and the "Open full recipe" affordance. The shell wraps the `RecipeDetail` content as children.

- [ ] **Step 1: Create the modal component**

Create `components/RecipeModal.tsx`:

```tsx
'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Maximize2 } from 'lucide-react';

const TRANSITION = {
  duration: 0.25,
  ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number],
};

const DESKTOP_VARIANTS = {
  initial: { opacity: 0, scale: 0.96 },
  animate: { opacity: 1, scale: 1 },
  exit:    { opacity: 0, scale: 0.96 },
};

const MOBILE_VARIANTS = {
  initial: { y: '100%' },
  animate: { y: 0 },
  exit:    { y: '100%' },
};

export default function RecipeModal({
  slug,
  children,
}: {
  slug: string;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previousActiveRef = useRef<HTMLElement | null>(null);

  function close() {
    router.back();
  }

  // Capture the previously focused element on mount and restore on unmount.
  // Focus the close button on open.
  useEffect(() => {
    previousActiveRef.current = document.activeElement as HTMLElement | null;
    closeButtonRef.current?.focus();
    return () => {
      const prev = previousActiveRef.current;
      if (prev && document.contains(prev)) {
        prev.focus();
      } else {
        document.body.focus();
      }
    };
  }, []);

  // Escape key dismisses
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.preventDefault();
        close();
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AnimatePresence>
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={TRANSITION}
        onClick={close}
        aria-hidden="true"
        className="fixed inset-0 z-[60] bg-brown-dark/55 backdrop-blur-sm"
      />

      {/* Desktop: centered card */}
      <motion.div
        key="dialog-desktop"
        role="dialog"
        aria-modal="true"
        aria-label="Recipe detail"
        variants={DESKTOP_VARIANTS}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={TRANSITION}
        onClick={(e) => e.stopPropagation()}
        className="fixed inset-0 z-[70] hidden sm:flex items-center justify-center p-6 pointer-events-none"
      >
        <div className="relative bg-parchment border border-brown-light/20 rounded-2xl shadow-2xl w-full max-w-[880px] max-h-[90vh] overflow-y-auto pointer-events-auto">
          <ModalHeader closeRef={closeButtonRef} slug={slug} onClose={close} />
          {children}
        </div>
      </motion.div>

      {/* Mobile: bottom sheet */}
      <motion.div
        key="dialog-mobile"
        role="dialog"
        aria-modal="true"
        aria-label="Recipe detail"
        variants={MOBILE_VARIANTS}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={TRANSITION}
        onClick={(e) => e.stopPropagation()}
        className="fixed inset-x-0 bottom-0 z-[70] sm:hidden"
      >
        <div className="relative bg-parchment border-t border-brown-light/20 rounded-t-2xl shadow-2xl max-h-[92vh] overflow-y-auto">
          <div className="sticky top-0 z-10 bg-parchment pt-2 pb-1 flex justify-center">
            <div className="h-1 w-10 rounded-full bg-brown-light/40" aria-hidden="true" />
          </div>
          <ModalHeader closeRef={closeButtonRef} slug={slug} onClose={close} />
          {children}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

function ModalHeader({
  closeRef,
  slug,
  onClose,
}: {
  closeRef: React.RefObject<HTMLButtonElement | null>;
  slug: string;
  onClose: () => void;
}) {
  return (
    <div className="absolute top-3 right-3 z-20 flex items-center gap-1">
      <a
        href={`/recipes/${slug}`}
        title="Open full recipe"
        aria-label="Open full recipe"
        className="p-2 rounded-full text-brown-medium hover:text-brown-dark hover:bg-parchment-dark transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta bg-parchment/85 backdrop-blur-sm"
      >
        <Maximize2 size={16} aria-hidden="true" />
      </a>
      <button
        ref={closeRef}
        onClick={onClose}
        aria-label="Close recipe"
        className="p-2 rounded-full text-brown-medium hover:text-brown-dark hover:bg-parchment-dark transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta bg-parchment/85 backdrop-blur-sm"
      >
        <X size={16} aria-hidden="true" />
      </button>
    </div>
  );
}
```

Key choices reflected in the code:
- The "Open full recipe" link is a plain `<a href>` so it triggers a hard navigation that escapes the interceptor.
- Close button calls `router.back()` per the spec — this works because the modal route was opened via `router.push`.
- Backdrop click bubbles to the backdrop element (which has `onClick={close}`); `e.stopPropagation()` on the dialog wrappers prevents inside-clicks from closing.
- Two motion variants (centered fade-scale on desktop, slide-up on mobile) using the same `TRANSITION` cubic-bezier as the existing `SIDEBAR_TRANSITION` in `WorldMap.tsx`.
- Focus is sent to the close button on open and restored to the original active element on unmount.

- [ ] **Step 2: Verify lint**

Run: `npm run lint`
Expected: no errors.

- [ ] **Step 3: Verify build**

Run: `npm run build`
Expected: build succeeds. The component is unused so far — that's fine; Tasks 4–5 wire it up.

- [ ] **Step 4: Commit**

```bash
git add components/RecipeModal.tsx
git commit -m "Add RecipeModal shell component"
```

---

### Task 4: Add the intercepted modal route

**Files:**
- Create: `app/@modal/(.)recipes/[slug]/page.tsx`

- [ ] **Step 1: Create the intercepted route**

Create `app/@modal/(.)recipes/[slug]/page.tsx`:

```tsx
import { notFound } from 'next/navigation';
import { dbToRecipe } from '@/lib/types';
import { getRecipe } from '@/lib/recipes/get';
import RecipeDetail from '@/components/RecipeDetail';
import RecipeModal from '@/components/RecipeModal';

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function InterceptedRecipePage({ params }: Props) {
  const { slug } = await params;
  const data = await getRecipe(slug);

  if (!data) notFound();

  const recipe = dbToRecipe(data);
  return (
    <RecipeModal slug={slug}>
      <RecipeDetail recipe={recipe} />
    </RecipeModal>
  );
}
```

The `(.)` segment tells Next.js to intercept `/recipes/[slug]` from the same routing level (root). Since the slot lives at `app/@modal/`, `(.)recipes/[slug]` matches `/recipes/[slug]` when navigated from a page that renders this slot — i.e. `/`, `/recipes`, `/about`, etc. Direct URL visits or page reloads bypass the interceptor and render `app/recipes/[slug]/page.tsx` (the full page).

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: build succeeds. Output should list both `/recipes/[slug]` (full page) and the intercepted route as parallel routes.

- [ ] **Step 3: Smoke-test the modal opens**

Run: `npm run dev`

Test 3a — modal opens from the map:
1. Visit `http://localhost:3000/`
2. Zoom into a continent → region → country with at least one recipe (e.g. France → Ratatouille)
3. Click the country, then click a recipe in the sidebar
   - Expected: URL becomes `/recipes/<slug>`. Modal appears centered over the map. The map is still visible behind the dim backdrop.

Test 3b — dismissal:
1. Click the dim backdrop → modal closes, URL returns to `/`. Map state preserved.
2. Open another recipe, then press `Escape` → modal closes.
3. Open another recipe, click the X button → modal closes.

Test 3c — full-page fallback:
1. Open a recipe modal
2. Refresh the browser
   - Expected: full recipe page renders (no modal), URL is `/recipes/<slug>`. This is correct fallback behavior.

Test 3d — direct visit:
1. Open a new tab, go directly to `/recipes/<slug>`
   - Expected: full page renders.

If any of 3a–3d fails, stop and debug before moving on.

- [ ] **Step 4: Commit**

```bash
git add "app/@modal/(.)recipes/[slug]/page.tsx"
git commit -m "Add intercepted recipe modal route"
```

---

### Task 5: History-clean recipe swaps + `inert` on the map

**Files:**
- Modify: `components/WorldMap.tsx`

This task does two things in `WorldMap.tsx`:

1. Swap `router.push('/recipes/<id>')` to `router.replace(...)` when the modal is already open (path starts with `/recipes/`). This keeps the back button clean across multiple recipe peeks.
2. Apply the `inert` attribute to the map container while the modal is open.

- [ ] **Step 1: Add `usePathname` import**

In `components/WorldMap.tsx`, find the navigation import (line 4):

```tsx
import { useRouter } from 'next/navigation';
```

Replace with:

```tsx
import { useRouter, usePathname } from 'next/navigation';
```

- [ ] **Step 2: Read pathname inside the component**

Find the line near the top of the `WorldMap` component (line 385):

```tsx
  const router = useRouter();
```

Add immediately after:

```tsx
  const pathname = usePathname();
  const isModalOpen = pathname?.startsWith('/recipes/') ?? false;
```

- [ ] **Step 3: Add a navigation helper**

Still inside the component, immediately after the `isModalOpen` line, add:

```tsx
  const navigateToRecipe = useCallback((id: string) => {
    const target = `/recipes/${id}`;
    if (isModalOpen) router.replace(target);
    else router.push(target);
  }, [router, isModalOpen]);
```

(`useCallback` is already imported on line 3.)

- [ ] **Step 4: Use the helper in `handleSearchSelect`**

Find `handleSearchSelect` (lines 790-806). The `result.recipeId` branch currently does:

```tsx
    if (result.recipeId) {
      // Fly to country, then navigate to recipe detail
      zoomTo({
        coordinates: [result.coordinates.lng, result.coordinates.lat],
        zoom: Math.max(zoom, ZOOM.COUNTRY_FULL),
      });
      router.push(`/recipes/${result.recipeId}`);
    } else {
```

Replace `router.push(...)` with the helper:

```tsx
    if (result.recipeId) {
      // Fly to country, then navigate to recipe detail
      zoomTo({
        coordinates: [result.coordinates.lng, result.coordinates.lat],
        zoom: Math.max(zoom, ZOOM.COUNTRY_FULL),
      });
      navigateToRecipe(result.recipeId);
    } else {
```

- [ ] **Step 5: Use the helper in the sidebar recipe button**

Find the recipe button in the sidebar `.map(...)` (lines 1259-1263):

```tsx
                {countryRecipes.map(recipe => (
                  <button
                    key={recipe.id}
                    onClick={() => router.push(`/recipes/${recipe.id}`)}
                    className="w-full bg-parchment rounded-xl overflow-hidden text-left hover:shadow-md transition-shadow group focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta"
                  >
```

Replace the `onClick` with:

```tsx
                {countryRecipes.map(recipe => (
                  <button
                    key={recipe.id}
                    onClick={() => navigateToRecipe(recipe.id)}
                    className="w-full bg-parchment rounded-xl overflow-hidden text-left hover:shadow-md transition-shadow group focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta"
                  >
```

- [ ] **Step 6: Apply `inert` to the map container**

Find the outer wrapper div at the top of the JSX return (line 816):

```tsx
    <div className="relative w-full h-full">
```

Replace with:

```tsx
    <div className="relative w-full h-full" {...(isModalOpen ? { inert: '' as unknown as undefined } : {})}>
```

(React 19 supports the `inert` boolean attribute natively, but TypeScript types lag in some setups; the spread guard avoids a TS complaint while still emitting the attribute. If your TS build accepts plain `inert={isModalOpen}`, prefer that — try it first, fall back to the spread form if TypeScript complains.)

- [ ] **Step 7: Verify lint and build**

Run: `npm run lint`
Expected: no errors.

Run: `npm run build`
Expected: build succeeds.

- [ ] **Step 8: Smoke-test the full flow**

Run: `npm run dev`

Test 8a — history is clean across recipe swaps:
1. Visit `/`, navigate to a country with multiple recipes (e.g. Italy with lasagna + spaghetti).
2. Click recipe A → modal opens.
3. Close modal → click recipe B → modal opens with recipe B.
4. Press browser back once.
   - Expected: returns directly to the map (`/`). NOT to recipe A.

Test 8b — `inert` blocks map interaction:
1. Open a recipe modal.
2. Try to scroll-zoom the map through the dim backdrop, or tab into a map button.
   - Expected: no map interaction; tab order stays inside the modal.

Test 8c — "Open full recipe":
1. Open a recipe modal.
2. Click the `Maximize2` icon (top-right, left of X).
   - Expected: full page loads (brief flash is fine), URL is `/recipes/<slug>`.
3. Press browser back.
   - Expected: returns to the map.

Test 8d — search flow:
1. From the map, use the search bar to pick a recipe.
   - Expected: map flies, modal opens with the recipe.

Test 8e — confirm `/recipes` grid is unchanged:
1. Visit `/recipes`.
2. Click any recipe card.
   - Expected: navigates to the full page as before, NO modal.

If any test fails, debug before committing.

- [ ] **Step 9: Commit**

```bash
git add components/WorldMap.tsx
git commit -m "Use replace inside modal, mark map inert when modal open"
```

---

### Task 6: Final verification pass

- [ ] **Step 1: Lint and build clean**

Run: `npm run lint && npm run build`
Expected: both succeed with no errors or warnings about the new files.

- [ ] **Step 2: Mobile bottom-sheet check**

Run: `npm run dev`. In the browser, switch to a mobile viewport (e.g. Chrome DevTools → iPhone 14 Pro).

1. Visit `/`, navigate to a country, click a recipe.
   - Expected: bottom sheet slides up, max-height ~92vh, top handle visible, content scrolls inside.
2. Tap the dim backdrop above the sheet → closes.
3. Open again, scroll inside the sheet → map below does not scroll.
4. Tap the X → closes.

- [ ] **Step 3: Accessibility quick check**

Still on `/`, with a recipe modal open:
1. Tab through — focus should cycle between "Open full recipe" link, X button, and any focusable elements inside `RecipeDetail`. Should not escape into the map.
2. Press Esc → closes, focus returns to the originating sidebar item (or body if it unmounted).
3. With a screen reader (VoiceOver: Cmd+F5 on macOS), confirm the modal is announced as a dialog.

- [ ] **Step 4: Confirm `/recipes/[slug]` direct visit still works**

Visit `/recipes/<some-slug>` directly in a new tab.
Expected: full page renders. No modal artifacts.

- [ ] **Step 5: No commit needed**

This task is verification only.
