# Premium revamp · D Glazed Folio in teal + mist

**Date:** 2026-09-25
**Status:** approved 2026-09-25; executing via subagent-driven development
**Configurator (the visual source of truth):** `docs/design/explorations/2026-09-25-full-site.html`
**Earlier explorations:** `2026-09-24-premium-directions.html` (A/B/C/D), `2026-09-25-hero-variations.html`, `2026-09-25-journal-rank.html`

Open the configurator with this hash to see every pick at once:

```
#pal=given&weight=400&btn=r4&eyebrow=caps&plinth=warm&glyph=naskh&glyphsize=big&tile=light&tiles=bands&nav=paper&navlayout=left&hero=plate&himg=r4&divider=none&brk=diamond&cards=ruled&chip=night&search=row&mapfill=ramp&cooked=terra&spread=paper&dropcap=terra&stepnum=numeral&mnote=box&pri=hero&morder=title&plates=ruled&sunmark=word&jstamp=bare&jgrid=large&footer=night
```

## 1. Goal

Make Nieves's Kitchen look more premium and more professional while keeping its essence
(warm, considered, well-travelled; halal first; the journal and stamps as the soul). This is a
look-and-feel revamp. **No functionality is removed** (see section 13).

Direction D "Glazed Folio": A's calm palette and type, A's browse, B "Folio"'s two-page recipe
spread, pantry and journal, C's 3:2 landscape recipe photos three across. The user's own
colours (mist `#F4F7F6`, teal `#337677`) replace the Courtyard cobalt/cream.

## 2. The picks

| Area | Pick |
|---|---|
| Palette | Teal + mist (section 3) |
| Headline weight | Regular (400) |
| Button corners | Soft, 4px. Search, chips, filters and toggles stay pill-shaped on purpose |
| Small labels | Tracked capitals |
| Plinth | Warm paper `#F3EDE0` |
| ﷺ | Drawn in Noto Naskh Arabic, one size up (section 4.2) |
| Nav | Light paper band, wordmark left |
| Hero | Full-bleed painting (Render 4) with the headline on a paper plate (section 6) |
| Under the hero | Nothing |
| Section breaks | Hairline rule with a terracotta diamond |
| Recipe cards | Ruled: square-cornered 3:2 photo, ink rule above the meta line |
| Selected chip | Night fill |
| Search and filters | On their own row, under the heading |
| Atlas | Teal ramp by recipe count; cooked countries in terracotta hatch |
| Recipe spread | On a raised page |
| Drop cap | Terracotta |
| Step numbers | Serif numerals |
| Margin note | Tinted box |
| Start cooking button | Teal |
| Recipe photo on phones | After the title |
| Pantry plates | Ruled and open (**day only**, section 9) |
| Sunnah mark | A "Sunnah" label |
| Journal stamps | No plinth (**day only**, section 10), collected at the larger size |
| Footer | Night band |
| Tile colour / where tiles appear | Picked "light tile" and "hero and bands", but with this hero no drawn tiles remain on any page, so both are moot (section 12) |

## 3. Tokens

The token **names stay** (they have about 1,000 call sites). Only the values in
`app/globals.css` `@theme` and its `[data-theme="sepia"]` block are repointed, the same
keep-the-name trick as the Courtyard and Teal & Ember swaps. CLAUDE.md's "token names lie"
note gets updated to the new values.

### 3.1 Day

| Token | New value | Role |
|---|---|---|
| `parchment` | `#F4F7F6` | Mist. Page background |
| `parchment-dark` | `#E3ECEA` | Deep mist. Bands, insets, image placeholders, tinted margin note |
| `surface` | `#FAFCFB` | Raised page, paper plate, nav band, cards on paper |
| `surface-alt` | `#E3ECEA` | Inset panel |
| `teal` | `#337677` | Teal. Links, primary button fill, active ramp |
| `brown-dark` | `#1A2B2D` | Ink. Headings and body |
| `brown-medium` | `#4E6366` | Muted ink. Secondary text |
| `brown-light` | `#8BA19E` | Teal-grey. Borders (usually at alpha), tertiary text |
| `terracotta` | `#B4532E` | The one warm accent. Diamond, drop cap, active nav rule, hatch |
| `paprika` | `#9E4527` | Deeper terracotta for hover and error |
| `turmeric`, `brass` | `#B4532E` | **No yellow anywhere** (the user dislikes brass). Both repoint at terracotta |
| `sage` | `#B9CBC7` | Soft sea-grey tint (fill-safe) |
| `olive` | `#4E6366` | Muted ink (the olive eyebrow tone becomes muted ink) |
| `cobalt` | `#337677` | Light-only literal. Now teal |
| `cobalt-deep` | `#1B4345` | Night teal. The footer band |
| `cream` | `#F4F7F6` | Light-only literal. Now mist |
| `cream-deep` | `#E3ECEA` | Light-only literal |
| `ink` | `#1A2B2D` | Light-only literal |
| `map-base` | `#E3ECEA` | Atlas land with no recipes |
| `plinth` | `#F3EDE0` | Theme-stable warm paper. Never gets a night value |
| `scrim` | `#101A1C` | Unchanged, theme-stable |
| **new** `line` | `#CAD9D6` | Hairlines: card rules, spread gutter, section breaks |
| **new** `night` | `#1B4345` | Theme-stable night band (footer), same in both themes |
| **new** `terracotta-lit` | `#F0A988` | Light terracotta for accents on dark grounds |

### 3.2 Night (`data-theme="sepia"`; the key stays `sepia`)

| Token | Night value |
|---|---|
| `parchment` | `#122F31` |
| `parchment-dark` | `#183A3C` |
| `surface` | `#16373A` |
| `surface-alt` | `#183A3C` |
| `teal` | `#2A6364` (fills). The existing `.text-teal` sepia overrides lift teal **text** to `#8CC3C1` |
| `brown-dark` | `#E9F0EE` |
| `brown-medium` | `#A9BDBA` |
| `brown-light` | `#5F7C7B` |
| `terracotta` | `#F0A988` (light terracotta replaces terracotta at night) |
| `paprika` | `#E08F6C` |
| `turmeric` | `#F0A988` |
| `sage` | `#3E6664` |
| `line` | `#2C5153` |
| `map-base` | `var(--color-parchment-dark)` |

`cobalt`, `cream`, `ink` and friends stay light-only literals, exactly as today.

### 3.3 Retired from production

- Brass/yellow as a colour (repointed, above).
- The Courtyard cobalt navbar band, the terracotta hero block, colour-block tiles on the home
  page (`TileWall`, `WaysIn` colour blocks, `ThisWeek`'s cobalt caption panel).
- Drawn panot/zellige tile patterns in shipped pages (section 12).

## 4. Type

### 4.1 Families

| Role | Now | New |
|---|---|---|
| Display / headings (`--font-heading`) | Fraunces | **Newsreader**, variable with the `opsz` axis, normal + italic |
| Body / UI (`--font-body`) | Karla | **Hanken Grotesk**, 400/500/600/700 |
| Stamp (`--font-stamp`) | Cutive Mono | Unchanged |
| Cancellation (`--font-stamp-cancel`) | Courier Prime | Unchanged |

- Headline weight **400** everywhere a heading is display-size: hero, section heads, recipe
  title, journal masthead. Existing `font-semibold` on `h2`s in the recipe page drops to
  `font-normal`.
- The legacy aliases `--font-figtree` / `--font-literata` keep pointing at the body/heading
  families, so map labels and stamp components need no churn.
- Wordmark: `Nieves's` in Newsreader regular, `Kitchen` in Newsreader italic in muted ink (no
  brass).

### 4.2 The ﷺ glyph

Neither Newsreader nor Hanken Grotesk contains ﷺ (U+FDFA), so the browser falls back to a
system font and it renders inconsistently. At 14px any Arabic font turns this dense ligature
into a blob, so the user chose **Noto Naskh Arabic, one size up**.

Implementation: a self-hosted, single-glyph subset of Noto Naskh Arabic
(`public/fonts/pbuh-naskh.woff2`, a few KB, SIL Open Font License) declared as its own
`@font-face` with `unicode-range: U+FDFA` and `size-adjust: 135%`, placed **first** in both
font stacks. Because of `unicode-range` it only ever draws ﷺ and only downloads on pages that
contain it. This scales the glyph everywhere, including inside data strings
(`lib/collections.ts`, `lib/journal.ts`, `lib/types.ts`, pantry entries, `FilterPanel`),
with no wrapper span. `ascent-override`/`descent-override` keep the line box from growing. The
configurator does the same with a `.pbuh` span (`font-size: 1.35em; line-height: 0;
vertical-align: -.08em`). If the `@font-face` route shifts line height in practice, fall back
to that span.

## 5. Chrome and primitives

- **Button** (`components/courtyard/Button.tsx`): `rounded-sm` (4px in Tailwind v4).
  `primary` = teal fill, mist text. `secondary` = 1px ink inset ring (was 2px). `accent`
  stays terracotta, but only for rare single CTAs. Hover lifts 1px.
- **Eyebrow**: 12px Hanken 600, `tracking-[0.16em]`, uppercase. Tones map through the tokens
  (the `brass` tone now reads terracotta, `olive` reads muted ink).
- **Chip**: stays `rounded-full`. Selected = night fill (`bg-cobalt-deep text-cream` by day;
  at night inverted to `bg-brown-dark text-parchment`).
- **Navbar**: light paper band. `bg-surface` + 1px `line` hairline below, backdrop blur kept.
  Wordmark left, links to its right, utility pod at the far end. Active link = 2px terracotta
  underline. The pod loses its cream chip (it was only there to sit on cobalt). "Start
  cooking" stays, restyled as a small teal `Button`. `useHideOnScroll`, the focus-visible
  reveal, the `NavMenuDropdown` and the safe-area padding are untouched. Band height stays
  64px / 88px, so the `<main>` top padding constant does not change.
- **Footer**: night band, `bg-night text-cream`, links at 80% opacity, "Halal always" label in
  `terracotta-lit`. Still hidden on `/atlas`.
- **Section break** (new `components/courtyard/RuleDiamond.tsx`): a 1px `line` rule on both
  sides of a 9px terracotta diamond, used between long-page sections.

## 6. Home

### 6.1 The hero: full-bleed painting with a paper plate

- Image: **Render 4**, the user's own ChatGPT render of a painted tiled courtyard (arch,
  cypress, sea, tile wall, bowl of citrus and pomegranate). Source kept at
  `docs/design/explorations/hero-renders/courtyard-4.webp`. It ships as
  `public/home/hero-courtyard.webp`.
- The image runs edge to edge under the nav, `object-cover`, 640px tall on desktop, 340px on
  phones.
- The copy sits on a **paper plate**: `bg-surface`, 1px `line` ring, soft drop shadow, 3px
  corners, max width 540px, anchored bottom-left inside the 1160px content column. **Text is
  always on paper, never on the image** (the home cover redesign rule). On phones the plate
  moves below the image and overlaps its bottom edge by 72px, with a 16px side gutter.
- Copy (sentence case, no em dashes):
  - label: "Every recipe is halal" (a small diamond before it)
  - h1: "Recipes from around the world, cooked at home."
  - sub: "Dishes I've eaten on the road and learned to make in my own kitchen. Pick a place,
    pick a dish, and start cooking tonight."
  - buttons: "Browse recipes" (primary, teal) → `/recipes`; "Open the atlas" (secondary) →
    `/atlas`
- `next/image` with `fill`, `priority`, `sizes="100vw"`. The alt text describes the painting.
- **No recipe photo in the hero.** The user decided the painting replaces it.
- Night: the painting is unchanged; the plate becomes the night `surface`.

**Asset rule.** The design language says photos are "contained, never full-bleed", because
recipe photos are only about 1,450px wide. That rule is about recipe photos. The hero is art
made for this slot, so full-bleed is allowed here and only here. Render 4 is 1536 × 1024:
sharp enough at laptop widths, soft on large monitors. **Before launch it must be replaced by
a version at least 2400px wide** (a larger re-render, or an upscale the user signs off
visually). The Pinterest pins in the configurator are stand-ins and must never ship.

### 6.2 Below the hero

"Under the hero: nothing" means no band or divider between the hero and the next section.
What follows the hero (confirmed by the user 2026-09-25):

1. **Cook something new**: the three newest recipes as ruled cards (section 7), a
   "Browse all N recipes" text link. This replaces `ThisWeek`.
2. Rule with a diamond.
3. **Ways in**: the three collections (`travels`, `high-protein`, `sunnah`) as a ruled
   three-column list (title, one-line description, live count), no colour blocks. This
   replaces `WaysIn`'s colour tiles.

`CourtyardHero`, `PromiseLine` (the hero carries "Every recipe is halal"), `TileWall` and the
"Jump in" chips leave the home page. The routes they linked to all stay reachable from the
nav, the ruled cards and Ways in.

## 7. Browse (`/recipes`, also `/favorites`)

- Heading "Cook something new" (or the page's existing heading) with its lead line, then
  **search and the Filters button on their own full-width row**, then the collection chips,
  then the grid.
- Grid: 3 across from `lg`, 2 at `sm`, 1 on phones.
- **Ruled card** (`RecipeCard`): 3:2 photo with square corners and a `parchment-dark`
  placeholder; a 1px ink rule above the meta line (country · time, tracked capitals); title in
  Newsreader 23px regular; blurb in muted ink, two lines. Hover: the photo scales 1.03. The
  favourite heart, the cooked mark, `blurDataURL` and `sizes` all stay.
- Search input stays at 16px or larger on phones (iOS zoom rule). FilterPanel triggers and
  chips stay `rounded-full`.

## 8. Recipe (`/recipes/[slug]` and the `@modal` overlay)

- **Title on paper.** The bleed hero with the title over a scrim goes. The eyebrow
  (country · region), the title (Newsreader 400, `clamp(2.4rem, 4.4vw, 3.6rem)`), the
  attribution line and the facts row (Total, Active, Difficulty; ruled top in teal, bottom in
  `line`) sit on the page.
- **Raised page**: the spread sits on `bg-surface` with a 1px `line` ring and a soft shadow,
  3px corners. From `md` it is two pages: ingredients on the left, method on the right, a 1px
  `line` gutter between. The existing `ingredientsRef`/`instructionsRef` sections, their
  `md:self-start` (load-bearing for `useGalleryPlacement`) and the margin/band galleries are
  kept, only restyled.
- **Photo**: on desktop, the hero photo tops the right page with an italic caption. On phones
  it sits **after the title** (after the facts row, before the lede).
- **Drop cap** on the lede: terracotta, Newsreader 80px.
- **Step numbers**: serif numerals in teal (Newsreader 24px), no tiles or rings.
- **Margin note** (the cook's note): tinted box, `bg-parchment-dark`, 3px corners.
- **Start cooking** (`CookModeEntry`): teal primary button.
- Ingredient group headings: Newsreader italic in muted ink. Nutrition tiles stay (a ledger
  was rejected before).
- Everything else is unchanged in behaviour: servings stepper, unit toggle, copy buttons,
  favourite, inline timers and `PageTimerStrip`, cook mode (`CookModeHero`,
  `StickyStepCard`, wake lock), the lightbox, supplementary sections, "I cooked this".

## 9. Atlas (`/atlas`)

- Choropleth: `lib/regions.ts` constants move from cobalt to teal. Day: `CHOROPLETH_BASE`
  `#337677`, `CHOROPLETH_LIGHT` `#D6E6E3`, `CHOROPLETH_EMPTY` `#E3ECEA`. Night:
  `SEPIA_CHOROPLETH_BASE` `#8CC3C1`, `SEPIA_CHOROPLETH_LIGHT` `#183A3C`,
  `SEPIA_CHOROPLETH_EMPTY` `#122F31`. (These live outside `@theme`, which is why the
  Courtyard sweep had to fix them by hand.)
- Cooked countries: the existing `cooked-hatch` patterns (desktop and mobile) already stroke
  in `--stamp-ink-terracotta`, so the hatch is terracotta by day with no change. At night it
  must read on the `#122F31` ground: add a `[data-theme=sepia]` value for a lifted hatch ink
  (`#F0A988`) via a new `--hatch-ink` variable used by both patterns.
- Map chrome (legend, zoom buttons, `MapSearch`, sidebar, bottom sheet) moves to the new tokens
  only. Drill-down, keyboard zoom, zoom-band quantisation and search behaviour are untouched.

## 10. Pantry (`/pantry`)

- Ruled grid of plates: 1px `line` rules between cells, no card chrome.
- **Day: ruled and open.** The ink art sits directly on the mist page, no plinth.
- **Night: falls back to the plinth.** Ink art is dark line work on transparency and vanishes
  on the dark background, so at night every art slot gets the warm paper plinth
  (`bg-plinth`, 2-3px corners). Implemented as `bg-transparent` by day and
  `[data-theme=sepia]` → `bg-plinth`, so no JavaScript theme check is needed and nothing
  flashes on load.
- The entry reading panel and `PantryTeaser`-style small art keep their plinth in both themes
  (they are small and set on a surface).
- **Sunnah mark**: a "Sunnah" label in tracked capitals, terracotta (light terracotta at
  night), replacing the rosette `PropheticSeal` on cards. The prophetic passage keeps its
  night-band treatment and its verbatim citation (never reworded).
- Both modes stay: the shelf and "Cook from what I have", and the Sunnah filter.

## 11. Journal (`/journal`)

Sections, in order: masthead → **Titles as a contents page** → the log → **Stamps collected**
→ one "Where next?". The Cook's Journal rules still hold: nothing renders empty, no unearned
badge, no per-collection ladder, exactly one "Where next?".

- **Masthead**: "The Cook's Journal" in Newsreader 400, "Kept since" line, three stats.
- **Titles** (`JournalRank`, restyled): the five titles as a ruled list, the current one marked
  with a terracotta diamond, titles ahead showing their country + region needs, one
  "N more ... to <next>" line. No meters, no title trail.
- **The log**: month labels, one row per meal; "Cooked N times" lives in the row.
- **`JournalJourney` is cut** (its first/most-recent lines duplicated the log). Top region may
  appear as one line under "Kept since".
- **Stamps collected** (`JournalStamps`): one stamp per country, grouped by region, in the
  **larger** grid (cells about 190px, stamp up to 150px; 150px cells on phones).
  - **Day: no plinth.** The stamp sits on the mist page.
  - **Night: falls back to the plinth**, for the same reason as the pantry: the ink vanishes on
    dark. The grid sits on a warm-paper plinth panel (today's `passport-light` panel, now
    `bg-plinth`) only at night. Same CSS-only mechanism: the panel's background and its
    locked `passport-light` tokens apply under `[data-theme=sepia]` only, and by day the
    region labels use the ordinary theme tokens.
  - Tapping a stamp still opens `StampedRecipesModal`, the **only** path to remove a stamp.
- `PaperTexture` stays mounted (its `#stamp-ink` filter is load-bearing).

## 12. Tiles

With the full-bleed painting as the hero, "Under the hero: nothing", section breaks as a rule
with a diamond, serif step numbers and a plain night footer, **no drawn tile appears on any
production page**. The tile work is done by the painting, which answers the user's note that
the programmatic SVG tiles "look a bit fake and not very professional".

- `TilePattern`, `TileGrid`, `StepTile`, `Arch`, `DestinationTile` and `Filmstrip` stay in
  `components/courtyard/` if a live page still imports them after the revamp; any left with no
  importer outside `app/dev/` is deleted in the final phase (dev sandboxes that import them
  are left alone or trimmed).
- "Tile colour: light tile" and "Tiles in hero and bands" are recorded as the user's
  preference if drawn tiles ever come back.

## 13. Functionality that must survive

Every phase is checked against this list (by hand in the browser, plus `npm run typecheck`
and `npm run build`):

- Atlas: region → country drill-down, `MapSearch`, keyboard zoom, choropleth, cooked hatch,
  mobile bottom sheet and gestures, the atlas hiding the footer.
- Browse: search, `FilterPanel` (and its badge count), collection presets (`?collection=`,
  `?country=`), active-filter pills, favourites.
- Recipe: the `@modal` intercepting overlay and the full page on refresh, servings stepper,
  units, copy recipe / ingredients, favourite, gallery placement (margin then band),
  lightbox, nutrition tiles, inline timers and the page timer, cook mode with sticky step
  card and wake lock, "I cooked this" / undo, supplementary sections.
- Pantry: both modes, Sunnah filter, entry overlay, recipe links via `featuredIngredients`,
  verbatim citations.
- Journal: every section's render-only-when-earned rule, `StampedRecipesModal` as the only
  stamp-removal path.
- Global: theme toggle (with the no-FOUC head script), Turnstile + anonymous auth,
  `NavMenuDropdown`, hide-on-scroll nav, skip link, `/promise`, `/about`.

## 14. Rules carried over

- User-facing text: no em dashes (use "·" or a period), sentence case, "Nieves's Kitchen".
- Mobile text inputs at 16px or larger.
- Halal only. Never reword a citation.
- Images: WebP, `next/image`, `sizes` always, `priority` above the fold.
- Text on paper, never directly on a photo. Overlays are paper, never glass.
- Delight at milestones only; the rest is quiet.

## 15. Open questions

1. ~~What sits below the hero on the home page?~~ Resolved 2026-09-25: as in section 6.2.
2. **The 2400px hero asset.** Re-render at a larger size, or upscale Render 4? Needed before
   launch, not before phase 3 (which can ship on the 1536px file behind review).

## 16. Rejected along the way

- Programmatic panot/zellige tiles as the hero (fake-looking).
- Arch-cropped recipe card images; brass/yellow; frosted glass; text over photos.
- Per-collection completion meters in the journal; the "Journey so far" section.
- A 3D page flip anywhere.
