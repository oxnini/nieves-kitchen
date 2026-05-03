# Passport Chrome Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the passport booklet's close button, prev/next chevrons, and bottom page indicator with a unified ink-mark vocabulary plus a region-level chip strip, while fixing keyboard arrow navigation inside the booklet's modal.

**Architecture:** A single `InkMark` primitive renders the visible glyph + invisible hit area + shared opacity/focus/disabled states; thin wrappers (`CloseInkMark`, `HelpInkMark`, `PageTurnInkMark`) pick the glyph and label. `BookletShell` becomes the owner of the four corner marks (top corners = close + help, bottom corners = prev + next) and the chip strip replaces the dot-row indicator. The `InkMark` primitive applies **zero positioning** in its base classes — consumers always control `absolute top-X right-Y` themselves.

**Tech Stack:** Next.js 15 (App Router), React 19, Tailwind v4, lucide-react, TypeScript. No test framework — verification is via `npm run lint`, `npm run build`, and visual checks at `/` (live) and `/_dev/passport-chrome` (dev route).

**Spec:** `docs/superpowers/specs/2026-05-03-passport-chrome-redesign-design.md`

---

## File Plan

| File | Action | Responsibility |
|---|---|---|
| `components/passport/InkMark.tsx` | Create | Primitive: button with visible glyph + invisible hit area + shared states. **No positioning.** |
| `components/passport/CloseInkMark.tsx` | Create | × glyph + `onClose` handler |
| `components/passport/HelpInkMark.tsx` | Create | ? glyph + manages own `helpOpen` state, renders `PassportHelpModal` |
| `components/passport/PageTurnInkMark.tsx` | Create | ‹ / › glyph + direction + disabled handling |
| `components/passport/RegionChip.tsx` | Create | Single chip: label, active state, click jump |
| `components/passport/RegionChipStrip.tsx` | Create | Section-level wayfinding strip with within-section progress hint and mobile auto-scroll |
| `components/passport/PageIndicator.tsx` | Delete | Replaced by `RegionChipStrip` |
| `components/passport/NavChevrons.tsx` | Delete | Replaced by two `PageTurnInkMark`s in `BookletShell` |
| `components/passport/PassportModal.tsx` | Modify | Remove inline close button; add `data-passport-root` to outer dialog div; preserve all other behavior |
| `components/passport/BookletShell.tsx` | Modify | Render the four corner marks; drop `chrome` prop; accept nav + close props; focus close on first render |
| `components/passport/PassportBooklet.tsx` | Modify | Pass nav handlers to `BookletShell`; render `RegionChipStrip` instead of `PageIndicator` |
| `components/passport/hooks/useBookletNav.ts` | Modify | Allow arrow keys when target's closest dialog is `[data-passport-root]` |
| `app/_dev/passport-chrome/page.tsx` | Create then delete | Temporary visual verification route |

Each task ends with `npm run lint`, screenshot or smoke check, and a commit.

---

## Task 1: Dev route scaffold + `InkMark` primitive

Build the primitive in isolation first. The route renders the primitive in resting / hover / focus / disabled states against parchment, sepia, and a region-photo background so we can visually verify before any consumer exists.

**Files:**
- Create: `components/passport/InkMark.tsx`
- Create: `app/_dev/passport-chrome/page.tsx`

- [ ] **Step 1: Create `InkMark.tsx`**

```tsx
'use client';

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';

export interface InkMarkProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  /** The glyph (Lucide icon or inline SVG) shown inside the mark. */
  glyph: ReactNode;
  /** Required accessible label. */
  label: string;
  /** Hit area square size in px. Default 44. */
  hitSize?: number;
  /** Visible glyph size in px. Default 16. */
  size?: number;
}

/**
 * Inked passport mark — minimal hairline glyph on the page material.
 *
 * IMPORTANT: This component applies NO positioning utilities in its base
 * classes. Consumers must position it themselves via `className`
 * (e.g. `absolute top-4 right-4`). Do not add `relative` / `absolute`
 * here — a previous attempt baked `relative` into the base and silently
 * broke consumers' absolute positioning.
 */
const InkMark = forwardRef<HTMLButtonElement, InkMarkProps>(function InkMark(
  { glyph, label, hitSize = 44, size = 16, className = '', disabled, ...rest },
  ref,
) {
  const style = {
    width: `${hitSize}px`,
    height: `${hitSize}px`,
  };

  return (
    <button
      ref={ref}
      type="button"
      aria-label={label}
      aria-disabled={disabled || undefined}
      disabled={disabled}
      style={style}
      className={[
        'group inline-flex items-center justify-center bg-transparent border-0 outline-none',
        'text-brown-dark cursor-pointer',
        'transition-opacity motion-reduce:transition-none duration-150',
        'opacity-[0.35] hover:opacity-[0.85] focus-visible:opacity-[0.85]',
        'focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:rounded-sm',
        'disabled:opacity-[0.15] disabled:cursor-not-allowed disabled:hover:opacity-[0.15]',
        className,
      ].join(' ')}
      {...rest}
    >
      <span
        aria-hidden
        className="inline-flex items-center justify-center"
        style={{ width: `${size}px`, height: `${size}px` }}
      >
        {glyph}
      </span>
    </button>
  );
});

export default InkMark;
```

Verify line by line: no `relative`, no `absolute`, no `top/left/right/bottom` in the base classes. The only positioning a consumer can apply is via `className`.

- [ ] **Step 2: Create the dev route scaffold**

Create `app/_dev/passport-chrome/page.tsx`:

```tsx
'use client';

import { X } from 'lucide-react';
import InkMark from '@/components/passport/InkMark';

const STROKE = 1.25;

const BACKGROUNDS = [
  {
    label: 'Parchment',
    className: 'bg-parchment passport-light',
  },
  {
    label: 'Sepia',
    className: 'bg-parchment',
    dataTheme: 'sepia' as const,
  },
  {
    label: 'Region photo',
    className: 'bg-parchment',
    image: '/passport-bg/africa.webp',
  },
];

function Frame({
  bg,
  children,
}: {
  bg: (typeof BACKGROUNDS)[number];
  children: React.ReactNode;
}) {
  return (
    <div
      data-theme={bg.dataTheme}
      className={`relative w-[260px] h-[260px] rounded-xl overflow-hidden border border-brown-light/30 ${bg.className}`}
      style={
        bg.image ? { backgroundImage: `url(${bg.image})`, backgroundSize: 'cover' } : undefined
      }
    >
      {children}
    </div>
  );
}

export default function PassportChromeDev() {
  return (
    <div className="min-h-screen bg-parchment-dark p-8 space-y-10">
      <h1 className="font-heading text-2xl text-brown-dark">Passport chrome — visual checks</h1>

      <Section title="InkMark primitive — states">
        <Row>
          {BACKGROUNDS.map(bg => (
            <Frame key={bg.label} bg={bg}>
              <Caption>{bg.label} · resting / hover / focus / disabled</Caption>
              <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 place-items-center">
                <InkMark glyph={<X strokeWidth={STROKE} size={16} />} label="Resting" />
                <InkMark
                  glyph={<X strokeWidth={STROKE} size={16} />}
                  label="Hover"
                  className="opacity-[0.85]"
                />
                <InkMark
                  glyph={<X strokeWidth={STROKE} size={16} />}
                  label="Focus"
                  className="opacity-[0.85] ring-2 ring-terracotta"
                />
                <InkMark glyph={<X strokeWidth={STROKE} size={16} />} label="Disabled" disabled />
              </div>
            </Frame>
          ))}
        </Row>
      </Section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-4">
      <h2 className="font-heading text-lg text-brown-dark">{title}</h2>
      {children}
    </section>
  );
}
function Row({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-wrap gap-6">{children}</div>;
}
function Caption({ children }: { children: React.ReactNode }) {
  return (
    <div className="absolute top-2 left-2 text-[10px] uppercase tracking-[0.2em] text-brown-medium font-stamp z-10">
      {children}
    </div>
  );
}
```

- [ ] **Step 3: Run lint and dev server**

```bash
npm run lint
npm run dev
```

Open `http://localhost:3000/_dev/passport-chrome` in a browser. Verify:
- Three frames visible (Parchment / Sepia / Region photo).
- Each frame shows four × marks in a 2×2 grid.
- Resting marks are very faint (~35% opacity).
- The "Hover" and "Focus" cells are noticeably more visible (~85%).
- The "Disabled" cell is barely visible (~15%) and shows `not-allowed` cursor on hover.
- The Sepia frame's mark is clearly visible (locked to dark brown via `passport-light` class — but note this frame uses `data-theme="sepia"` *without* `passport-light` to confirm the mark looks OK in raw sepia too).

Take a screenshot of the dev route as a checkpoint reference.

- [ ] **Step 4: Commit**

```bash
git add components/passport/InkMark.tsx app/_dev/passport-chrome/page.tsx
git commit -m "Add InkMark primitive and passport chrome dev route"
```

---

## Task 2: `CloseInkMark`, `HelpInkMark`, `PageTurnInkMark` wrappers

Three thin wrappers around `InkMark` that pick the right glyph and label.

**Files:**
- Create: `components/passport/CloseInkMark.tsx`
- Create: `components/passport/HelpInkMark.tsx`
- Create: `components/passport/PageTurnInkMark.tsx`
- Modify: `app/_dev/passport-chrome/page.tsx` (add wrapper cells)

- [ ] **Step 1: Create `CloseInkMark.tsx`**

```tsx
'use client';

import { X } from 'lucide-react';
import InkMark from './InkMark';

interface Props {
  onClose: () => void;
  className?: string;
}

export default function CloseInkMark({ onClose, className }: Props) {
  return (
    <InkMark
      glyph={<X strokeWidth={1.25} size={16} />}
      label="Close passport"
      onClick={onClose}
      className={className}
      size={16}
    />
  );
}
```

- [ ] **Step 2: Create `HelpInkMark.tsx`**

`HelpInkMark` owns its own `helpOpen` state and renders `PassportHelpModal` colocated — same pattern the old `PageIndicator` used.

```tsx
'use client';

import { useState } from 'react';
import { CircleHelp } from 'lucide-react';
import InkMark from './InkMark';
import PassportHelpModal from './PassportHelpModal';

interface Props {
  className?: string;
}

export default function HelpInkMark({ className }: Props) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <InkMark
        glyph={<CircleHelp strokeWidth={1.25} size={16} />}
        label="How your passport works"
        onClick={() => setOpen(true)}
        className={className}
        size={16}
        aria-haspopup="dialog"
        aria-expanded={open || undefined}
      />
      <PassportHelpModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
```

Note: Lucide v0.x exports `CircleHelp`. If the project's installed version uses `HelpCircle` instead, use that — check `node_modules/lucide-react/dist/lucide-react.d.ts` if unsure. The existing `PageIndicator.tsx` imports `HelpCircle`, so use `HelpCircle` to match.

- [ ] **Step 2b: Confirm icon name and adjust if needed**

```bash
grep -E "^export.*HelpCircle|^export.*CircleHelp" node_modules/lucide-react/dist/lucide-react.d.ts | head -2
```

If only `HelpCircle` is exported, change the import in `HelpInkMark.tsx` to `import { HelpCircle } from 'lucide-react'` and use `<HelpCircle ... />`.

- [ ] **Step 3: Create `PageTurnInkMark.tsx`**

```tsx
'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import InkMark from './InkMark';

interface Props {
  direction: 'prev' | 'next';
  onClick: () => void;
  disabled?: boolean;
  className?: string;
}

export default function PageTurnInkMark({ direction, onClick, disabled, className }: Props) {
  const Icon = direction === 'prev' ? ChevronLeft : ChevronRight;
  const label = direction === 'prev' ? 'Previous page' : 'Next page';
  return (
    <InkMark
      glyph={<Icon strokeWidth={1.25} size={20} />}
      label={label}
      onClick={onClick}
      disabled={disabled}
      className={className}
      size={20}
    />
  );
}
```

- [ ] **Step 4: Add wrapper cells to the dev route**

In `app/_dev/passport-chrome/page.tsx`, add three new sections after the existing `InkMark primitive — states` section:

```tsx
import CloseInkMark from '@/components/passport/CloseInkMark';
import HelpInkMark from '@/components/passport/HelpInkMark';
import PageTurnInkMark from '@/components/passport/PageTurnInkMark';
```

Then add the sections. Place them inside the `<div className="min-h-screen ...">`:

```tsx
<Section title="CloseInkMark — top-right corner">
  <Row>
    {BACKGROUNDS.map(bg => (
      <Frame key={bg.label} bg={bg}>
        <Caption>{bg.label}</Caption>
        <CloseInkMark onClose={() => {}} className="absolute top-4 right-4" />
      </Frame>
    ))}
  </Row>
</Section>

<Section title="HelpInkMark — top-left corner">
  <Row>
    {BACKGROUNDS.map(bg => (
      <Frame key={bg.label} bg={bg}>
        <Caption>{bg.label}</Caption>
        <HelpInkMark className="absolute top-4 left-4" />
      </Frame>
    ))}
  </Row>
</Section>

<Section title="PageTurnInkMark — bottom corners (left enabled, right disabled)">
  <Row>
    {BACKGROUNDS.map(bg => (
      <Frame key={bg.label} bg={bg}>
        <Caption>{bg.label}</Caption>
        <PageTurnInkMark direction="prev" onClick={() => {}} className="absolute bottom-4 left-4" />
        <PageTurnInkMark
          direction="next"
          onClick={() => {}}
          disabled
          className="absolute bottom-4 right-4"
        />
      </Frame>
    ))}
  </Row>
</Section>
```

- [ ] **Step 5: Run lint and verify in browser**

```bash
npm run lint
```

Reload `http://localhost:3000/_dev/passport-chrome`. Verify:
- Close × sits at top-right of every frame (parchment, sepia, region photo).
- Help ? sits at top-left of every frame.
- Prev ‹ sits at bottom-left, fully visible. Next › sits at bottom-right, faded (disabled).
- Tab through the buttons: focus ring (terracotta) appears around the hit area.
- Hover each: opacity steps up.
- Click `HelpInkMark`: the existing `PassportHelpModal` opens with full content.

Screenshot the dev route as the checkpoint for this task.

- [ ] **Step 6: Commit**

```bash
git add components/passport/CloseInkMark.tsx components/passport/HelpInkMark.tsx components/passport/PageTurnInkMark.tsx app/_dev/passport-chrome/page.tsx
git commit -m "Add Close/Help/PageTurn ink mark wrappers and dev route cells"
```

---

## Task 3: `RegionChip` and `RegionChipStrip`

Build the section-level wayfinding strip in isolation, render it in the dev route, then leave it ready to wire into `PassportBooklet` in Task 6.

**Files:**
- Create: `components/passport/RegionChip.tsx`
- Create: `components/passport/RegionChipStrip.tsx`
- Modify: `app/_dev/passport-chrome/page.tsx`

- [ ] **Step 1: Create `RegionChip.tsx`**

```tsx
'use client';

import { forwardRef } from 'react';

interface Props {
  label: string;
  active: boolean;
  onClick: () => void;
}

const RegionChip = forwardRef<HTMLButtonElement, Props>(function RegionChip(
  { label, active, onClick },
  ref,
) {
  return (
    <button
      ref={ref}
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={[
        'group relative inline-flex items-center justify-center px-3 py-3',
        'text-sm font-body whitespace-nowrap snap-center',
        'transition-colors duration-150 motion-reduce:transition-none',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-terracotta rounded-sm',
        active ? 'text-brown-dark' : 'text-brown-medium hover:text-brown-dark',
      ].join(' ')}
    >
      {label}
      {active && (
        <span
          aria-hidden
          className="absolute left-2 right-2 -bottom-[2px] h-[2px] bg-terracotta rounded-full"
        />
      )}
    </button>
  );
});

export default RegionChip;
```

- [ ] **Step 2: Create `RegionChipStrip.tsx`**

This component derives the section list from the existing `spreads` array, computes which section is active and (if applicable) the within-section progress hint, handles clicks, and auto-scrolls the active chip into view on mobile.

```tsx
'use client';

import { useEffect, useMemo, useRef } from 'react';
import type { SpreadDescriptor } from './hooks/usePassportSpreads';

type Section =
  | { kind: 'cover'; label: 'Cover' }
  | { kind: 'inside-front'; label: 'Profile' }
  | { kind: 'region'; label: string; region: string }
  | { kind: 'back-cover'; label: 'Summary' };

interface Props {
  spreads: SpreadDescriptor[];
  index: number;
  onJump: (i: number) => void;
}

export default function RegionChipStrip({ spreads, index, onJump }: Props) {
  // Section list: one chip per unique (kind, region).
  const sections = useMemo<Section[]>(() => {
    const out: Section[] = [];
    const seenRegions = new Set<string>();
    for (const s of spreads) {
      if (s.kind === 'cover' && !out.some(x => x.kind === 'cover')) {
        out.push({ kind: 'cover', label: 'Cover' });
      } else if (s.kind === 'inside-front' && !out.some(x => x.kind === 'inside-front')) {
        out.push({ kind: 'inside-front', label: 'Profile' });
      } else if (s.kind === 'region' && !seenRegions.has(s.region)) {
        seenRegions.add(s.region);
        out.push({ kind: 'region', label: s.region, region: s.region });
      } else if (s.kind === 'back-cover' && !out.some(x => x.kind === 'back-cover')) {
        out.push({ kind: 'back-cover', label: 'Summary' });
      }
    }
    return out;
  }, [spreads]);

  // Active section + within-section progress.
  const current = spreads[index];
  const progress = useMemo(() => {
    if (!current || current.kind !== 'region') return null;
    const sameRegion = spreads.filter(
      s => s.kind === 'region' && s.region === current.region,
    );
    if (sameRegion.length <= 1) return null;
    return { current: current.continuationIndex + 1, total: sameRegion.length };
  }, [current, spreads]);

  // Active section index — for chip highlighting and ARIA.
  const activeSectionIndex = useMemo(() => {
    if (!current) return -1;
    if (current.kind === 'cover') return sections.findIndex(s => s.kind === 'cover');
    if (current.kind === 'inside-front') return sections.findIndex(s => s.kind === 'inside-front');
    if (current.kind === 'back-cover') return sections.findIndex(s => s.kind === 'back-cover');
    return sections.findIndex(s => s.kind === 'region' && s.region === current.region);
  }, [current, sections]);

  function handleJump(s: Section) {
    const targetIdx = spreads.findIndex(spread => {
      if (s.kind === 'cover') return spread.kind === 'cover';
      if (s.kind === 'inside-front') return spread.kind === 'inside-front';
      if (s.kind === 'back-cover') return spread.kind === 'back-cover';
      return spread.kind === 'region' && spread.region === s.region && spread.continuationIndex === 0;
    });
    if (targetIdx >= 0) onJump(targetIdx);
  }

  // Auto-scroll the active chip into view (mobile).
  const stripRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (activeSectionIndex < 0) return;
    const strip = stripRef.current;
    if (!strip) return;
    const activeChip = strip.querySelectorAll('[role="tab"]')[activeSectionIndex] as HTMLElement | undefined;
    if (!activeChip) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    activeChip.scrollIntoView({
      inline: 'center',
      block: 'nearest',
      behavior: reduce ? 'auto' : 'smooth',
    });
  }, [activeSectionIndex]);

  return (
    <div className="passport-light mt-6">
      <div
        ref={stripRef}
        role="tablist"
        aria-label="Passport sections"
        className="flex items-center gap-1 overflow-x-auto snap-x snap-mandatory px-4 sm:justify-center sm:overflow-visible sm:px-0"
      >
        {sections.map((s, i) => {
          const isActive = i === activeSectionIndex;
          return (
            <span key={`${s.kind}-${s.kind === 'region' ? s.region : ''}`} className="flex items-center">
              {i > 0 && (
                <span aria-hidden className="text-brown-light/60 px-1 select-none">
                  ·
                </span>
              )}
              <ChipButton label={s.label} active={isActive} onClick={() => handleJump(s)} />
              {isActive && progress && (
                <span
                  aria-hidden
                  className="ml-2 font-stamp text-xs text-brown-medium tabular-nums whitespace-nowrap"
                >
                  {progress.current} / {progress.total}
                </span>
              )}
            </span>
          );
        })}
      </div>
    </div>
  );
}

function ChipButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={[
        'relative inline-flex items-center justify-center px-3 py-3',
        'text-sm font-body whitespace-nowrap snap-center',
        'transition-colors duration-150 motion-reduce:transition-none',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-terracotta rounded-sm',
        active ? 'text-brown-dark' : 'text-brown-medium hover:text-brown-dark',
      ].join(' ')}
    >
      {label}
      {active && (
        <span
          aria-hidden
          className="absolute left-2 right-2 -bottom-[2px] h-[2px] bg-terracotta rounded-full"
        />
      )}
    </button>
  );
}
```

Note: This file inlines the chip button rather than importing from `RegionChip.tsx`. Keep `RegionChip.tsx` as a separate exported component anyway for future reuse and for the dev route — see Step 3.

Wait — that's redundant. Instead, simplify: delete the inline `ChipButton` from `RegionChipStrip.tsx` and import from `RegionChip.tsx`. Final corrected `RegionChipStrip.tsx`:

```tsx
'use client';

import { useEffect, useMemo, useRef } from 'react';
import type { SpreadDescriptor } from './hooks/usePassportSpreads';
import RegionChip from './RegionChip';

type Section =
  | { kind: 'cover'; label: 'Cover' }
  | { kind: 'inside-front'; label: 'Profile' }
  | { kind: 'region'; label: string; region: string }
  | { kind: 'back-cover'; label: 'Summary' };

interface Props {
  spreads: SpreadDescriptor[];
  index: number;
  onJump: (i: number) => void;
}

export default function RegionChipStrip({ spreads, index, onJump }: Props) {
  const sections = useMemo<Section[]>(() => {
    const out: Section[] = [];
    const seenRegions = new Set<string>();
    for (const s of spreads) {
      if (s.kind === 'cover' && !out.some(x => x.kind === 'cover')) {
        out.push({ kind: 'cover', label: 'Cover' });
      } else if (s.kind === 'inside-front' && !out.some(x => x.kind === 'inside-front')) {
        out.push({ kind: 'inside-front', label: 'Profile' });
      } else if (s.kind === 'region' && !seenRegions.has(s.region)) {
        seenRegions.add(s.region);
        out.push({ kind: 'region', label: s.region, region: s.region });
      } else if (s.kind === 'back-cover' && !out.some(x => x.kind === 'back-cover')) {
        out.push({ kind: 'back-cover', label: 'Summary' });
      }
    }
    return out;
  }, [spreads]);

  const current = spreads[index];

  const progress = useMemo(() => {
    if (!current || current.kind !== 'region') return null;
    const sameRegion = spreads.filter(s => s.kind === 'region' && s.region === current.region);
    if (sameRegion.length <= 1) return null;
    return { current: current.continuationIndex + 1, total: sameRegion.length };
  }, [current, spreads]);

  const activeSectionIndex = useMemo(() => {
    if (!current) return -1;
    if (current.kind === 'cover') return sections.findIndex(s => s.kind === 'cover');
    if (current.kind === 'inside-front') return sections.findIndex(s => s.kind === 'inside-front');
    if (current.kind === 'back-cover') return sections.findIndex(s => s.kind === 'back-cover');
    return sections.findIndex(s => s.kind === 'region' && s.region === current.region);
  }, [current, sections]);

  function handleJump(s: Section) {
    const targetIdx = spreads.findIndex(spread => {
      if (s.kind === 'cover') return spread.kind === 'cover';
      if (s.kind === 'inside-front') return spread.kind === 'inside-front';
      if (s.kind === 'back-cover') return spread.kind === 'back-cover';
      return (
        spread.kind === 'region' && spread.region === s.region && spread.continuationIndex === 0
      );
    });
    if (targetIdx >= 0) onJump(targetIdx);
  }

  const stripRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (activeSectionIndex < 0) return;
    const strip = stripRef.current;
    if (!strip) return;
    const activeChip = strip.querySelectorAll('[role="tab"]')[activeSectionIndex] as
      | HTMLElement
      | undefined;
    if (!activeChip) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    activeChip.scrollIntoView({
      inline: 'center',
      block: 'nearest',
      behavior: reduce ? 'auto' : 'smooth',
    });
  }, [activeSectionIndex]);

  return (
    <div className="passport-light mt-6">
      <div
        ref={stripRef}
        role="tablist"
        aria-label="Passport sections"
        className="flex items-center gap-1 overflow-x-auto snap-x snap-mandatory px-4 sm:justify-center sm:overflow-visible sm:px-0"
      >
        {sections.map((s, i) => {
          const isActive = i === activeSectionIndex;
          return (
            <span
              key={`${s.kind}-${s.kind === 'region' ? s.region : ''}`}
              className="flex items-center"
            >
              {i > 0 && (
                <span aria-hidden className="text-brown-light/60 px-1 select-none">
                  ·
                </span>
              )}
              <RegionChip label={s.label} active={isActive} onClick={() => handleJump(s)} />
              {isActive && progress && (
                <span
                  aria-hidden
                  className="ml-2 font-stamp text-xs text-brown-medium tabular-nums whitespace-nowrap"
                >
                  {progress.current} / {progress.total}
                </span>
              )}
            </span>
          );
        })}
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Add a chip strip cell to the dev route**

In `app/_dev/passport-chrome/page.tsx`, import the strip and a fake spread set:

```tsx
import RegionChipStrip from '@/components/passport/RegionChipStrip';
import type { SpreadDescriptor } from '@/components/passport/hooks/usePassportSpreads';

const FAKE_SPREADS: SpreadDescriptor[] = [
  { kind: 'cover' },
  { kind: 'inside-front' },
  // Asia: 3 continuation spreads → triggers the "2 / 3" hint
  {
    kind: 'region',
    region: 'Asia',
    slug: 'asia',
    continuationIndex: 0,
    leftCountries: [],
    rightCountries: [],
  },
  {
    kind: 'region',
    region: 'Asia',
    slug: 'asia-2',
    continuationIndex: 1,
    leftCountries: [],
    rightCountries: [],
  },
  {
    kind: 'region',
    region: 'Asia',
    slug: 'asia-3',
    continuationIndex: 2,
    leftCountries: [],
    rightCountries: [],
  },
  // Europe: single spread → no hint
  {
    kind: 'region',
    region: 'Europe',
    slug: 'europe',
    continuationIndex: 0,
    leftCountries: [],
    rightCountries: [],
  },
  { kind: 'back-cover' },
];
```

Add a new section showing the strip with index = 3 (Asia spread 2 of 3) so the within-section hint is visible:

```tsx
<Section title="RegionChipStrip — Asia 2 of 3 active">
  <div className="space-y-4 max-w-3xl">
    <div className="bg-parchment passport-light p-4 rounded-xl border border-brown-light/20">
      <RegionChipStrip spreads={FAKE_SPREADS} index={3} onJump={() => {}} />
    </div>
    <div data-theme="sepia" className="bg-parchment passport-light p-4 rounded-xl border border-brown-light/20">
      <RegionChipStrip spreads={FAKE_SPREADS} index={3} onJump={() => {}} />
    </div>
  </div>
</Section>
```

- [ ] **Step 4: Run lint and verify in browser**

```bash
npm run lint
```

Reload `http://localhost:3000/_dev/passport-chrome`. Verify:
- Strip shows: `Cover · Profile · Asia · Europe · Summary`.
- "Asia" is the active chip — full dark text, with a terracotta under-stroke.
- Beside "Asia", the hint reads `2 / 3` in a monospace/Cutive style.
- Hovering an inactive chip darkens its text.
- Tabbing focuses the chips with a terracotta ring.
- Clicking inactive chips triggers `onJump` (you can `console.log` from the dev route to confirm if needed).
- The sepia version has identical contrast (because of `passport-light`).
- Resize the window narrower than ~640px: the strip becomes horizontally scrollable, and tapping a far-right chip auto-scrolls it into view.

Screenshot the dev route as the checkpoint.

- [ ] **Step 5: Commit**

```bash
git add components/passport/RegionChip.tsx components/passport/RegionChipStrip.tsx app/_dev/passport-chrome/page.tsx
git commit -m "Add RegionChipStrip and RegionChip with within-section progress hint"
```

---

## Task 4: Keyboard nav fix + `data-passport-root`

This task is independent of the chrome rework — it only touches the modal root tag and the keyboard handler. Land it as its own commit so it's easy to revert if it causes issues.

**Files:**
- Modify: `components/passport/PassportModal.tsx`
- Modify: `components/passport/hooks/useBookletNav.ts`

- [ ] **Step 1: Add `data-passport-root` to the dialog div**

In `components/passport/PassportModal.tsx`, find the outer `<div ... role="dialog" ...>` (around line 100). Add `data-passport-root` to it:

```tsx
return (
  <div
    ref={overlayRef}
    role="dialog"
    aria-modal="true"
    aria-label="Passport"
    data-passport-root
    onKeyDown={onKeyDownTrap}
    onClick={onBackdropClick}
    className="fixed inset-0 z-[60] flex items-stretch sm:items-center justify-center"
  >
    {/* … */}
  </div>
);
```

- [ ] **Step 2: Update the dialog check in `useBookletNav.ts`**

In `components/passport/hooks/useBookletNav.ts`, replace the dialog check at line 103:

**Before:**

```ts
if (target?.closest('input, textarea, [contenteditable="true"], [role="dialog"]')) return;
```

**After:**

```ts
if (target?.closest('input, textarea, [contenteditable="true"]')) return;
const dialog = target?.closest('[role="dialog"]');
if (dialog && !(dialog as HTMLElement).hasAttribute('data-passport-root')) return;
```

The full updated effect:

```ts
useEffect(() => {
  const onKey = (e: KeyboardEvent) => {
    const target = e.target as HTMLElement | null;
    if (target?.closest('input, textarea, [contenteditable="true"]')) return;
    const dialog = target?.closest('[role="dialog"]');
    if (dialog && !(dialog as HTMLElement).hasAttribute('data-passport-root')) return;
    if (e.key === 'ArrowRight') { e.preventDefault(); flipNext(); }
    if (e.key === 'ArrowLeft')  { e.preventDefault(); flipPrev(); }
  };
  window.addEventListener('keydown', onKey);
  return () => window.removeEventListener('keydown', onKey);
}, [flipNext, flipPrev]);
```

- [ ] **Step 3: Run lint and smoke test**

```bash
npm run lint
npm run dev
```

In the browser at `http://localhost:3000/`:
- Open the passport.
- Press ArrowRight → booklet flips forward.
- Press ArrowLeft → booklet flips back.
- Open the help modal (click the `?` in the page indicator — still wired to old `PageIndicator`).
- Press ArrowRight while help modal is open → booklet does **not** flip (because help modal is a non-passport-root dialog).
- Close the help modal, press ArrowRight → booklet flips again.

- [ ] **Step 4: Commit**

```bash
git add components/passport/PassportModal.tsx components/passport/hooks/useBookletNav.ts
git commit -m "Allow arrow-key page nav inside passport dialog"
```

---

## Task 5: Wire close + help into `BookletShell`; remove close from `PassportModal`

This task moves the close button into `BookletShell`, adds the help mark, and updates the prop chain.

**Files:**
- Modify: `components/passport/PassportModal.tsx`
- Modify: `components/passport/BookletShell.tsx`
- Modify: `components/passport/CloseInkMark.tsx`
- Modify: `components/passport/PassportBooklet.tsx`

- [ ] **Step 1: Rewrite `PassportModal.tsx`**

The modal must continue to own its 180ms close animation, but the close button now lives inside `BookletShell` (a descendant). `PassportModal` exposes its `startClose` function to descendants via a small React context (`PassportModalContext`) so `CloseInkMark` can trigger the animated close without `PassportModal` needing to render the button itself.

Replace the contents of `components/passport/PassportModal.tsx` with the version below.

```tsx
'use client';

import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';

import { getPassportOrigin } from '@/lib/passport-origin';

const OPEN_MS = 220;
const CLOSE_MS = 180;

const PassportModalContext = createContext<(() => void) | null>(null);

export function usePassportModalClose(): () => void {
  const fn = useContext(PassportModalContext);
  if (!fn) throw new Error('usePassportModalClose must be used inside PassportModal');
  return fn;
}

export default function PassportModal({
  children,
  onClose,
}: {
  children: ReactNode;
  onClose: () => void;
}) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);
  const [closing, setClosing] = useState(false);

  const origin = typeof window === 'undefined' ? null : getPassportOrigin();
  const transformOrigin = origin ? `${origin.x}px ${origin.y}px` : 'top right';

  const reducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  useEffect(() => {
    previouslyFocused.current = document.activeElement as HTMLElement | null;
    return () => {
      previouslyFocused.current?.focus?.();
    };
  }, []);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.preventDefault();
        startClose();
      }
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function startClose() {
    if (closing) return;
    setClosing(true);
    window.setTimeout(onClose, reducedMotion ? 60 : CLOSE_MS);
  }

  function onBackdropClick(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === e.currentTarget) startClose();
  }

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
    <PassportModalContext.Provider value={startClose}>
      <div
        ref={overlayRef}
        role="dialog"
        aria-modal="true"
        aria-label="Passport"
        data-passport-root
        onKeyDown={onKeyDownTrap}
        onClick={onBackdropClick}
        className="fixed inset-0 z-[60] flex items-stretch sm:items-center justify-center"
      >
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-brown-dark/40 backdrop-blur-sm transition-opacity"
          style={{
            opacity,
            transitionDuration: `${baseDuration}ms`,
            transitionTimingFunction: 'ease-out',
          }}
        />

        <div
          className="passport-light relative w-full h-full overflow-y-auto bg-parchment sm:w-auto sm:h-auto sm:max-w-[95vw] sm:max-h-[95vh] sm:overflow-visible sm:bg-transparent"
          style={{
            opacity,
            transform: useTransform ? `scale(${closing ? scale : 1})` : undefined,
            transformOrigin,
            transition: useTransform
              ? `opacity ${baseDuration}ms ease-out, transform ${baseDuration}ms ease-out`
              : `opacity ${baseDuration}ms ease-out`,
            animation: closing
              ? undefined
              : useTransform
                ? `passport-open ${OPEN_MS}ms ease-out`
                : `passport-fade ${baseDuration}ms ease-out`,
          }}
        >
          <div className="px-4 sm:px-0 pt-4 sm:pt-0 pb-10 sm:pb-0">{children}</div>
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
    </PassportModalContext.Provider>
  );
}
```

Note the changes from the original file:
- New `PassportModalContext` + `usePassportModalClose` exported hook.
- `data-passport-root` attribute on the outer dialog div (carries forward Task 4's change — make sure it's preserved).
- Removed `closeButtonRef`, removed close button JSX, removed `X` import.
- Reduced `pt-16` to `pt-4` on mobile inner wrapper (the `pt-16` was needed to clear the now-removed close button).

- [ ] **Step 2: Update `BookletShell` to render the corner marks**

Replace `components/passport/BookletShell.tsx`:

```tsx
'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { MOBILE_BREAKPOINT } from '@/hooks/useIsMobile';
import CloseInkMark from './CloseInkMark';
import HelpInkMark from './HelpInkMark';
import PageTurnInkMark from './PageTurnInkMark';
import { usePassportModalClose } from './PassportModal';

interface Props {
  children: ReactNode;
  openState: 'open' | 'closed';
  canPrev: boolean;
  canNext: boolean;
  onPrev: () => void;
  onNext: () => void;
  navDisabled: boolean;
}

const OPEN_ASPECT = 1.4;
const MARGIN_PX = 24;
const NAVBAR_ALLOWANCE_PX = 96;
const INDICATOR_ALLOWANCE_PX = 64;
const COLS_PER_HALF = 3;
const MOBILE_PAGE_ASPECT = 0.72;

export default function BookletShell({
  children,
  openState,
  canPrev,
  canNext,
  onPrev,
  onNext,
  navDisabled,
}: Props) {
  const [size, setSize] = useState<{ w: number; h: number; mobile: boolean } | null>(null);
  const rafRef = useRef<number | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const onClose = usePassportModalClose();

  useEffect(() => {
    const compute = () => {
      const vw = window.innerWidth - MARGIN_PX * 2;
      const vh =
        window.innerHeight -
        NAVBAR_ALLOWANCE_PX -
        INDICATOR_ALLOWANCE_PX -
        MARGIN_PX * 2;

      const isMobile = window.innerWidth < MOBILE_BREAKPOINT;

      if (isMobile) {
        const w = vw;
        const h = Math.min(w / MOBILE_PAGE_ASPECT, vh);
        setSize({ w, h, mobile: true });
      } else {
        const byWidth = { w: vw, h: vw / OPEN_ASPECT };
        const byHeight = { w: vh * OPEN_ASPECT, h: vh };
        const open = byWidth.h <= vh ? byWidth : byHeight;
        setSize({ w: open.w, h: open.h, mobile: false });
      }
    };

    const onResize = () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(compute);
    };

    compute();
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // Focus the close mark on first mount (replaces PassportModal's old behavior).
  useEffect(() => {
    closeRef.current?.focus();
  }, []);

  if (!size) {
    return <div className="relative w-full max-w-5xl mx-auto aspect-[3/4] sm:aspect-[1.4/1]" />;
  }

  const { mobile } = size;
  const openWidth = size.w;
  const openHeight = size.h;
  const pageWidth = mobile ? openWidth : openWidth / 2;
  const visibleWidth = mobile ? openWidth : openState === 'open' ? openWidth : pageWidth;

  const gapPx = pageWidth * (mobile ? 0.05 : 0.067);
  const stampSize = (pageWidth - gapPx * (COLS_PER_HALF + 1)) / COLS_PER_HALF;

  return (
    <div
      className="relative mx-auto"
      style={
        {
          width: visibleWidth,
          height: openHeight,
          '--stamp-size': `${stampSize}px`,
          '--stamp-gap': `${gapPx}px`,
          '--half-width': `${pageWidth}px`,
        } as React.CSSProperties
      }
    >
      <div
        className="relative rounded-xl overflow-hidden shadow-[0_30px_60px_-20px_rgba(60,30,15,0.5)]"
        style={{ width: visibleWidth, height: openHeight }}
      >
        {children}
        {!mobile && openState === 'open' && (
          <div
            aria-hidden
            className="absolute top-[2%] bottom-[2%] left-1/2 -translate-x-1/2 w-[2px] bg-gradient-to-b from-brown-dark/10 via-brown-dark/40 to-brown-dark/10 pointer-events-none z-10"
          />
        )}

        {/* Corner ink marks — owned by BookletShell. */}
        <CloseInkMark
          onClose={onClose}
          className="absolute top-4 right-4 z-20"
        />
        <HelpInkMark className="absolute top-4 left-4 z-20" />
        <PageTurnInkMark
          direction="prev"
          onClick={onPrev}
          disabled={!canPrev || navDisabled}
          className="absolute bottom-4 left-4 z-20"
        />
        <PageTurnInkMark
          direction="next"
          onClick={onNext}
          disabled={!canNext || navDisabled}
          className="absolute bottom-4 right-4 z-20"
        />
      </div>
    </div>
  );
}
```

Note:
- The `closeRef` focus management is in place but `CloseInkMark` does not yet forward refs. Update `CloseInkMark.tsx` (Step 3) to forward the ref.
- The `chrome` prop is gone.
- The `usePassportModalClose` hook reads `startClose` from `PassportModal`'s context.

- [ ] **Step 3: Update `CloseInkMark` to forward ref**

Replace `components/passport/CloseInkMark.tsx`:

```tsx
'use client';

import { forwardRef } from 'react';
import { X } from 'lucide-react';
import InkMark from './InkMark';

interface Props {
  onClose: () => void;
  className?: string;
}

const CloseInkMark = forwardRef<HTMLButtonElement, Props>(function CloseInkMark(
  { onClose, className },
  ref,
) {
  return (
    <InkMark
      ref={ref}
      glyph={<X strokeWidth={1.25} size={16} />}
      label="Close passport"
      onClick={onClose}
      className={className}
      size={16}
    />
  );
});

export default CloseInkMark;
```

(`InkMark` already supports `forwardRef` from Task 1.)

Update the `BookletShell` import to attach the ref:

```tsx
<CloseInkMark
  ref={closeRef}
  onClose={onClose}
  className="absolute top-4 right-4 z-20"
/>
```

- [ ] **Step 4: Update `PassportBooklet` to pass the new props**

In `components/passport/PassportBooklet.tsx`, the `BookletShell` call site needs new props instead of the `chrome` slot. Replace the `<BookletShell …>` block (lines 76–102 in the current file) with:

```tsx
<BookletShell
  openState={isClosed ? 'closed' : 'open'}
  canPrev={nav.canPrev}
  canNext={nav.canNext}
  onPrev={nav.flipPrev}
  onNext={nav.flipNext}
  navDisabled={nav.isFlipping}
>
  <div className="absolute inset-0">
    {currentSpread && (
      <SpreadView
        spread={currentSpread}
        spreads={spreads}
        summary={summary}
        stampsPerCountry={summary.stampsPerCountry}
        recipes={recipes}
        recipesByCountry={recipesByCountry}
        onCooked={onCooked}
        onJump={nav.jumpTo}
      />
    )}
  </div>
</BookletShell>
```

Remove the `import NavChevrons from './NavChevrons';` line.

- [ ] **Step 5: Lint and smoke test**

```bash
npm run lint
npm run dev
```

At `http://localhost:3000/`:
- Open the passport.
- Verify a small × is at the top-right inside the booklet, a small ? at top-left.
- Click ×: booklet animates closed (CLOSE_MS) — same animation as before.
- Click ?: help modal opens.
- The original page indicator (with `?` and dots) is still at the bottom — it's replaced in Task 7.
- The original `NavChevrons` are gone; prev/next chevrons now show as small ink marks at the bottom corners.
- Tab order: close → help → prev → next → content → indicator.

- [ ] **Step 6: Commit**

```bash
git add components/passport/PassportModal.tsx components/passport/BookletShell.tsx components/passport/CloseInkMark.tsx components/passport/PassportBooklet.tsx
git commit -m "Move close + help + prev/next ink marks into BookletShell"
```

---

## Task 6: Delete `NavChevrons.tsx`

`NavChevrons` is now unused. The chevron marks live inside `BookletShell` directly.

**Files:**
- Delete: `components/passport/NavChevrons.tsx`

- [ ] **Step 1: Verify no imports remain**

```bash
grep -rn "NavChevrons" components/ app/ lib/ hooks/ 2>/dev/null
```

Expected: only the file itself (`components/passport/NavChevrons.tsx`) appears in output. If anything else does, fix that import first.

- [ ] **Step 2: Delete the file**

```bash
git rm components/passport/NavChevrons.tsx
```

- [ ] **Step 3: Lint and build sanity**

```bash
npm run lint
npm run build
```

Both must pass.

- [ ] **Step 4: Commit**

```bash
git commit -m "Remove unused NavChevrons.tsx"
```

---

## Task 7: Wire `RegionChipStrip`; delete `PageIndicator.tsx`

**Files:**
- Modify: `components/passport/PassportBooklet.tsx`
- Delete: `components/passport/PageIndicator.tsx`

- [ ] **Step 1: Replace the `PageIndicator` import + usage**

In `components/passport/PassportBooklet.tsx`:

Replace:

```tsx
import PageIndicator from './PageIndicator';
```

with:

```tsx
import RegionChipStrip from './RegionChipStrip';
```

And replace:

```tsx
<PageIndicator count={spreads.length} index={nav.index} onJump={nav.jumpTo} />
```

with:

```tsx
<RegionChipStrip spreads={spreads} index={nav.index} onJump={nav.jumpTo} />
```

- [ ] **Step 2: Verify nothing else imports `PageIndicator`**

```bash
grep -rn "PageIndicator" components/ app/ lib/ hooks/ 2>/dev/null
```

Expected: only `components/passport/PageIndicator.tsx` itself.

- [ ] **Step 3: Delete the file**

```bash
git rm components/passport/PageIndicator.tsx
```

- [ ] **Step 4: Lint and smoke test**

```bash
npm run lint
npm run dev
```

At `http://localhost:3000/`:
- Open the passport.
- Bottom now shows a chip strip (Cover · Profile · regions · Summary) instead of dots.
- Active chip has a terracotta under-stroke.
- Flip to a multi-spread region (e.g., Asia, if you've cooked enough Asian recipes that it spans more than one spread): a `2 / N` hint appears beside the active chip.
- Click another chip: booklet jumps to its first spread.
- On mobile (resize ≤640px), strip horizontally scrolls; active chip stays in view.
- Toggle theme to sepia (if there's a theme toggle UI; otherwise apply `data-theme="sepia"` on `<html>` via devtools): chip strip retains its full contrast (because `passport-light`).

- [ ] **Step 5: Commit**

```bash
git add components/passport/PassportBooklet.tsx
git commit -m "Replace PageIndicator with RegionChipStrip"
```

---

## Task 8: Full-booklet smoke test + accessibility audit

This task is verification only — no code changes. If it surfaces a bug, fix the bug in a follow-up commit.

- [ ] **Step 1: Cover state**

Open passport. Verify:
- × is at top-right inside the cover.
- ? is at top-left inside the cover.
- Prev chevron is at bottom-left, **disabled** (≈15% opacity, no cursor).
- Next chevron is at bottom-right, **enabled**.
- Chip strip's active chip is "Cover".

- [ ] **Step 2: Open spreads**

Press ArrowRight or click next. Verify:
- Booklet expands to two-page spread.
- Marks now sit on the open spread's outer container.
- Both prev and next are enabled (mid-booklet).
- Chip strip's active chip is "Profile" (then advances through regions as you flip).

- [ ] **Step 3: Multi-spread region progress**

Navigate to a multi-spread region. Verify:
- Active chip shows `2 / 3` (or similar) hint in `font-stamp` style.
- Flipping forward within the region updates the hint to `3 / 3`.
- Continuation flips do NOT advance the active chip — it stays on the region.

- [ ] **Step 4: Back cover**

Navigate to the back cover. Verify:
- Prev enabled, next **disabled**.
- Active chip is "Summary".

- [ ] **Step 5: Mobile (≤640px)**

Resize the browser narrow or use devtools mobile emulation. Verify:
- Booklet renders single portrait page.
- All four corner marks are visible at corners of that single page.
- Chip strip is horizontally scrollable.
- Tapping a far-right chip auto-scrolls it into view.

- [ ] **Step 6: Sepia theme**

Toggle to sepia (devtools: set `data-theme="sepia"` on `<html>`). Verify:
- Booklet content unchanged.
- Chip strip still has full contrast.
- Marks still legible at the same opacity steps.

- [ ] **Step 7: Keyboard navigation**

- ArrowLeft / ArrowRight flip pages inside the booklet (Task 4 fix).
- Tab order: close → help → prev → next → content → chip strip chips.
- Each focusable shows a terracotta focus ring.
- Esc closes the booklet (existing behavior).
- Open help modal (click ?). ArrowRight does **not** flip (the help modal is a non-passport-root dialog).

- [ ] **Step 8: Reduced motion**

In OS settings or browser devtools, force `prefers-reduced-motion: reduce`. Verify:
- Mark opacity changes are instant (no transition).
- Chip-strip auto-scroll jumps instead of smooth-scrolls.

- [ ] **Step 9: Build sanity**

```bash
npm run lint
npm run build
```

- [ ] **Step 10: Commit (only if you fix any issues found above)**

```bash
git add -A
git commit -m "Fix passport chrome smoke-test issues"
```

If no issues, skip this step.

---

## Task 9: Delete the dev route

**Files:**
- Delete: `app/_dev/passport-chrome/page.tsx` (and `app/_dev/passport-chrome/` if empty)

- [ ] **Step 1: Remove the dev route**

```bash
git rm -r app/_dev/passport-chrome
```

If `app/_dev/` is now empty, leave the directory if other dev routes exist; otherwise remove it:

```bash
[ -z "$(ls -A app/_dev 2>/dev/null)" ] && git rm -r app/_dev || true
```

- [ ] **Step 2: Lint and build**

```bash
npm run lint
npm run build
```

Both must pass.

- [ ] **Step 3: Commit**

```bash
git commit -m "Remove temporary passport-chrome dev route"
```

---

## Done

At this point:
- The four corner ink marks live inside the booklet.
- The bottom row is a region-level chip strip with within-section progress.
- Arrow keys work inside the passport booklet.
- The dev route is gone, and the prior chrome files (`PageIndicator.tsx`, `NavChevrons.tsx`) are deleted.

The implementation matches the spec at `docs/superpowers/specs/2026-05-03-passport-chrome-redesign-design.md`.
