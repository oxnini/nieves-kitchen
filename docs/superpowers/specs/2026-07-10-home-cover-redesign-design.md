# Home "Cover" Redesign + Pantry Plinths — Design

Date: 2026-07-10
Status: **Approved** (visually validated variant E in the mockup artifact;
user waived final spec review). Mockup reference:
https://claude.ai/code/artifact/58511ed2-9390-42e9-908a-821874d7e329
(pills A–E; E is the approved hero. D's frosted-glass panels were explicitly
rejected: glass is not this brand's material — paper is.)

## 1. Summary

Two pieces of work, one spec:

1. **Pantry plinths** — a theme-stable parchment chip behind every piece of
   pantry ink art, fixing the art-on-dark-background problem with zero new
   assets.
2. **Home page redesign** — the home becomes a "front page": a dominant
   photo hero for a rotating "on the table this month" cover recipe, with the
   cover story presented as a physical paper card laid on the photo, a
   utility rail beside it, and quieter department sections below. Vocabulary
   is deliberately softened from magazine jargon ("issue", "cover lines")
   to the cook's own voice ("on the table this month", "where next").

Design principles that shaped every decision here: text lives on paper, not
on photos; overlay objects are physical paper (passport logic), never glass;
utility beats theater; postal accents only at journey moments.

## 2. Pantry plinths

- New token in `@theme` (`app/globals.css`):
  `--color-plinth: #F5F0E4` — the original parchment hex, with **no**
  `[data-theme="sepia"]` override, exactly like `--color-scrim`. Paper stays
  paper when the room lights dim. Tailwind v4 gives us `bg-plinth` for free.
- Treatment: the art's existing container gains a wrapper —
  `bg-plinth rounded-xl ring-1 ring-brown-dark/8` with padding scaled per
  surface:
  - `components/home/PantryTeaser.tsx` grid: ~`p-2`
  - `components/pantry/PantryShelf.tsx` `EtchedCard`: ~`p-2.5`
  - `PantryShelf.tsx` `EntryOverlay` header art: ~`p-3`
- `PropheticSeal` keeps its top-right position, now overlapping the plinth
  corner (wax seal on a specimen card).
- Judgment call deferred to the visual pass: if `EtchedCard`'s hairline
  border reads as card-in-card once the plinth exists, drop the outer border
  and let the plinth be the card.

## 3. Hero (approved variant E: "the card on the table")

### Layout

- Grid `3.5fr : 1fr`, gap ~1.6rem, in a **wider container than the site
  default**: max-width ~84rem (hero only; departments below return to the
  72rem column). Stacks to one column below ~860px.
- Left cell: the photo stage. Right cell: the utility rail on parchment.

### Photo stage

- Rounded (`rounded-2xl`) crop; height `clamp(32rem, 100svh - 8.5rem, 46rem)`
  desktop, `clamp(22rem, 62svh, 32rem)` mobile. `next/image` `fill`,
  `priority`, `sizes="(max-width: 860px) 100vw, 75vw"`, blur placeholder.
  Image = the cover recipe's hero image.
- **Top scrim only** (gradient from `--color-scrim` ~58% to transparent by
  ~46% height). No bottom scrim — nothing textual sits on the lower photo.
- On-photo head, locked cream (`#F0EADA`), centered:
  - Skyline: `EST. MMXXVI · <MONTH YEAR>` in Cutive Mono, letter-spaced,
    flanked by hairline rules. Month/year derive from the active cover entry.
  - Nameplate: `Nieves' Kitchen`, Literata 700,
    `clamp(2.7rem, 5.8vw, 5rem)`, terracotta apostrophe. This is the page
    `h1`.
  - Tagline: *A well-travelled table, cooked with care* — Literata italic.

### The table card (signature element)

A paper card laid on the photo, overhanging its bottom edge:

- Position: absolute, left ~1.8rem, `bottom: -1.4rem`, max-width ~26rem,
  strong soft shadow. Mobile: static, pulled up over the photo with
  `margin: -3.4rem 1rem 0`, full width.
- **Locked physical paper**: background `--color-plinth`, ink `#1E4854`,
  terracotta `#CE6B39` — hex-locked like the passport paper; the card does
  not change in lagoon/sepia mode.
- Contents, top to bottom:
  1. Dateline: `On the table · <Month Year>` — Cutive Mono small caps over a
     3px double ledger rule. Auto-derived; no hand-written kicker copy.
  2. Dish title (`h2`, Literata 700, ~1.45–1.9rem) linking to the recipe.
  3. Annotation: `<total> min · <protein>g protein` — Cutive Mono,
     tabular numerals (protein only at/above `PROTEIN_CHIP_THRESHOLD`).
  4. Buttons: solid terracotta pill **Cook it tonight** → recipe page;
     ink-outline pill **Browse all recipes** → `/recipes`. The secondary
     must read as a real button (1.5px ink border at ~50%, hover fill) —
     visibility of this control was an explicit user requirement.

### Utility rail (parchment, right column)

Three blocks separated by hairline rules, each with a Cutive Mono small-caps
label:

1. **The Collections** — the four collections from `lib/collections.ts` as
   compact links, each with a small accent dot (terracotta / sage / teal /
   turmeric respectively). Links to each collection's `href`.
2. **More to cook** — the 2 most recent recipes *excluding the cover recipe*,
   derived (not hand-curated): ~4.6rem rounded thumbnail, serif title,
   mono `<time> min · <country>` line.
3. **From the Pantry** — 3 plinth chips (~5.4rem) linking to `/pantry`,
   prophetic seals shown where applicable. (The full pantry department below
   remains; the rail block is a shortcut, accepted redundancy.)

## 4. Cover rotation (`data/covers.ts`)

Replaces `data/table-spreads.ts`. Hand-curated, append-to-publish, same
convention as the file it replaces:

```ts
export interface Cover {
  /** ISO date this cover went up; dateline month derives from it. */
  publishedOn: string;
  /** Recipe slug of the cover dish. */
  recipe: string;
  /** Back-page pull, e.g. "the Levant, by way of a mezze table?" */
  whereNext: { line: string };
}

export const COVERS: Cover[] = [/* append to publish */];
export function currentCover(): Cover { return COVERS[COVERS.length - 1]; }
```

- No `kicker` / `coverLines` fields — the dateline is automatic and the rail
  is systematic. Publishing a new cover = one small object.
- Seed entry: `chinese-prawn-spaghetti` (Spring Onion Oil Prawn Spaghetti)
  with a Levant-flavoured `whereNext` line, `publishedOn: '2026-07-10'`.
- Copy rules for all strings: **no em dashes**, halal-confident voice, never
  fabricate citations.

## 5. Navbar (global change)

The floating pill (`components/Navbar.tsx`) becomes a **flush full-width
paper band** on all routes:

- `fixed top-0 inset-x-0`, parchment at ~88% opacity with `backdrop-blur`,
  single hairline bottom border, no rounded corners, no gaps — content
  scrolls underneath and ghosts through.
- Active link indicator: 2px terracotta underline (was 1px — visibility fix).
- Keep the existing hide-on-scroll-down / reveal-on-scroll-up behavior
  (`useHideOnScroll`), mobile menu, favorites count, `PassportAffordance`,
  `ThemeToggle` — only the shell styling changes.
- The wordmark stays in the band; on home it coexists with the on-photo
  nameplate (band reads as chrome, nameplate as artwork — approved).

## 6. Below the fold ("inside")

Order: promise line → From the Pantry → Latest from the Kitchen → Where Next.

- **Promise line** (from the retired `Masthead`): centered Literata italic —
  *Every recipe here is halal, kitchen-tested, and personally loved.* —
  "halal" links to `/promise`.
- **DepartmentHeader** (new `components/home/DepartmentHeader.tsx`): ruled
  header idiom — Cutive Mono small-caps label + hairline rule + optional
  right-side link. `PantryTeaser` and `LatestFromKitchen` adopt it.
- **The collections cards section is removed from home** — the rail carries
  the collections. `CollectionsRow` stays in the codebase only if another
  route uses it; otherwise delete.
- **Where Next** (new, small): ruled header, then one centered italic line
  from `currentCover().whereNext` linking to `/atlas`, then the end-mark
  `Nieves' Kitchen · <Month Year> · Until the next table` in Cutive Mono.
  This satisfies the journal principle: one rotating explore-pull, no
  scoreboard.

## 7. Retired

- `components/home/TableSpreadHero.tsx`, `components/home/Masthead.tsx`,
  `data/table-spreads.ts` — deleted after the new home ships.

## 8. States, a11y, motion

- Loading (recipes in flight): pulse skeletons shaped like the photo stage +
  rail; card and rail render skeleton rows.
- Cover recipe slug not found in fetched recipes → fall back to newest
  recipe. No recipes at all → render the head block on parchment (skyline /
  nameplate / tagline / promise) and departments that don't need recipes.
- `h1` = nameplate, `h2` = card dish title and department headings;
  focus-visible outlines per site convention; images get meaningful alt from
  recipe names; rail thumbnails `alt=""` (decorative next to titles).
- Motion: at most a single quiet entrance fade/rise on the card,
  `motion-reduce:` disabled. No parallax, no loops.
- Hero photo guidance: covers work best with photos that are darker toward
  the top (the scrim handles moderate cases). Not a hard constraint.

## 9. Build & verification workflow

1. Build everything first at **`/dev/home-cover`** (design sandbox, per the
   visual-iteration convention): full new home rendered with a theme toggle;
   compare against the approved artifact mockup.
2. Pantry plinths reviewed on `/dev/pantry` and `/pantry`.
3. After visual sign-off: promote to `app/page.tsx`, swap the navbar shell,
   delete retired files.
4. Gates: `npm run typecheck` and `npm run build` (CI parity). Verify the
   real flows: home → recipe modal via card button, rail links, theme flip
   in both modes, mobile viewport.

## 10. Out of scope

- Atlas/journal explore-pull work (phase 3), passport changes, recipe-page
  changes, any new pantry art. The Somalia stamp and other queued items are
  untouched.
