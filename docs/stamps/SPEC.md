# Passport stamps — visa + cancellation system

Canonical reference for how passport stamps work in Nieves Kitchen. Replaces the earlier
"one stamp per country, redraw on every aesthetic shift" model. Read this before
designing a new country stamp or touching the rendering code.

Audience: future-you, future-Claude, future contributors.
Source-of-truth precedence: this SPEC > region design docs > image prompts.

---

## 1. Philosophy

A passport stamp is not an icon — it's a record of having been somewhere. The page
should *fill in over time*, not snap into a finished state on the first cook.

So we treat each country as a two-layer composition, exactly like a real passport:

- **Visa** — the country's identity. One per country. Authored, expressive, full
  colour. Stays the same regardless of how many times you cook from there.
- **Cancellation** — a small dated postmark applied each time you cook a recipe
  from that country. Many per visa. Visually quiet, regionally tinted, dated.

This buys us three things the old model didn't have:

1. **A reason to cook again.** A second recipe from Italy now leaves a visible
   mark on the page instead of being indistinguishable from the first.
2. **A unified visual language across cooks.** Cancellations share a grammar
   (small dated postmarks) so the page reads as a passport, not a sticker album.
3. **A way to retire aesthetic experiments without losing them.** The flat-ink
   ink-impression work from the May 2026 redesign isn't thrown away — it
   becomes the cancellation seed (see §6).

Anti-goals worth naming:

- Not gamification — no XP bars, no level-up screens, no streak shaming. The
  passport feature elsewhere already handles tier titles and progress.
- Not commerce — cancellations are never bought, unlocked behind a paywall,
  or tied to a "premium" tier.
- Not novelty for its own sake — every visual element earns its place against
  the cookbook/passport/Nordic-restraint brief in `CLAUDE.md`.

---

## 2. The visa

**One per country.** Authored either as a custom WebP in `public/stamps/`
(registered in `lib/passport-stamps.ts#CUSTOM_STAMPS`) or rendered procedurally
from `lib/stamp-traits.ts` for countries without a custom asset.

**Visual brief.** Each visa is a small piece of editorial illustration:

- Full colour, with a dominant ink hue from the regional palette (see §6).
- Reads at a glance as "this country" — landmark, dish, motif, or pattern.
- Frame, border, country name, native script, "NIEVES' KITCHEN · 2026"
  footer. The frame shape is the region's signature cartouche (see §6).
- Slight rubber-stamp imperfection (broken edges, dry-press patches, faint
  off-register double-strike). It's a stamped impression, not a sticker.
- No human faces, no portraits, no deity faces — universal rule across the
  project. Silhouettes, landmarks, dishes, patterns, animals are fine.

**Aspect ratio is preserved at render time** via `CUSTOM_STAMPS[country].aspect`,
so a tall stamp (China) and a wide one (Hong Kong) cover roughly equal visual
area on the page. See `components/passport/CountryStampSlot.tsx` for the math
(constant `IMAGE_STAMP_SIDE`, width = side · √aspect).

**The visa never changes once shipped.** If you redesign it, the old one
becomes a separate file — don't quietly swap the WebP under an existing
country, because that retroactively rewrites every user's cooked history.

---

## 3. The cancellation

**One per cook.** Each time a user logs a cook (`useLogCook`), a cancellation
mark is composited on top of the visa.

**Visual brief — fixed across all countries:**

- A **circular postmark**, ~28% of the visa's longest edge.
- A thin outer ring of ink, with a slight gap or break (a real postmark
  is hand-pressed, not a perfect circle).
- A second concentric inner ring at ~70% of the outer diameter, also broken.
- Between the rings, in monospace small-caps:
  - **Top arc:** the recipe title, looked up via `recipe_slug` →
    `recipes.title` at render time. Truncated to 16 characters with an
    ellipsis if longer (so the curve reads cleanly). All caps.
  - **Bottom arc:** the cook date in `DD MMM YY` format
    (e.g. `13 MAY 26`).
- In the centre, a tiny per-country mark: a 3- or 4-pointed asterisk,
  a fleuron, or a short crossbar — chosen once per country (see §8) and
  reused across every cancellation for that country, so a stack of
  cancellations on Italy all share the same centre mark.
- Drawn flat. No fills inside rings. Same rubber-stamp imperfection
  vocabulary as the visa (broken lines, faint off-register secondary ink).
- Rendered procedurally as SVG (no per-cancellation image generation) so
  the cook date and recipe title can be live and the count is unbounded.

**Ink colour is regionally tinted.** The cancellation uses the
*cancellation ink* colour from the country's regional palette (see §6 table).
This is chosen to read clearly over that region's visa style without
competing with it.

**Why circular, monoline, dated:** that's what real postal cancellation
marks look like. It reads as "stamped over the visa" rather than
"another sticker on the page". The grammar is universal because every
postal system in the world converged on roughly this shape — it carries
no specific national association and won't clash with any visa style.

### 3.1 Data model bridge

Each row in `public.passport_stamps` (`id`, `user_id`, `recipe_slug`,
`recipe_country`, `cooked_at`) produces exactly one cancellation. The
schema doesn't need to change for this system; everything the cancellation
needs is already there:

| Cancellation element | Source |
|---|---|
| Recipe title (top arc)       | `recipes.title` joined on `recipe_slug` |
| Cook date (bottom arc)       | `cooked_at` formatted `DD MMM YY` |
| Country (which visa to stack on) | `recipe_country` |
| Centre-mark glyph            | Per-country map in the cancellation component (see §8 step 7) |
| Rotation slot + angle        | Derived from `(recipe_country, cook_index)` — see §4 |
| Ink colour                   | Region of `recipe_country` → §6 table |

`cook_index` is the 0-based ordinal of this row among the user's stamps
for the same `recipe_country`, ordered by `cooked_at` ascending. It's
computed in `useCookedStamps` at render time, not stored.

The `CookTier` (`new_country | new_recipe | repeat`) returned by
`useLogCook` is **not** used by the cancellation layer — it only powers
the live unlock animation in `CookedButton`. Cancellations look the same
regardless of tier. (If you ever want them to differ — e.g. bolder ink
on `new_recipe` — wire it through here, not via a new DB column.)

---

## 4. Layering flow (the "dumpling-lasagna")

Cooks from the same country stack. The visa is the dough, cancellations are
the fillings layered on top:

| Cook count | What's drawn |
|------------|--------------|
| 0          | Empty slot — no visa, no cancellation. The slot is dim. |
| 1          | Visa visible at full opacity. One cancellation in a top-right rotation slot. |
| 2          | Visa + 2 cancellations, placed at predetermined non-overlapping rotation slots. |
| 3–5        | Visa + N cancellations. Each new cancellation lands in the next slot in the rotation order. |
| 6+         | Soft cap kicks in — see §5. |

**Rotation slots** — 5 fixed positions around the visa, chosen so two stacked
marks never fully overlap and never sit dead-centre over the country name or
landmark. The order is fixed per slot index (not random) so re-rendering after
a refresh gives the exact same composition.

Each cancellation rotates by a small randomized angle (`±12°`) seeded from
`(country, cook_index)` so the same cook always produces the same angle —
no flicker between renders.

**Positioning is computed from the visa's aspect ratio**, not from a fixed
grid. A landscape visa gets its cancellations spread along the long axis;
a square one gets them in a rough crescent across the top-right quadrant.

---

## 5. Patina rules

The page must keep reading well past the 5th cook. Two mechanisms:

**Soft cap at 5 visible cancellations.** Once a country has 6 or more cooks:

- The 5 most recent cancellations remain at full opacity.
- Older cancellations are *not removed* — they fade to ~40% opacity and
  slide partially under the visible ones. This is the patina: the ink
  builds up where many cancellations land but never erases the visa.
- The composite ink starts to look denser, like a much-used passport page.

**Frequent-visitor seal at 10 total cooks.** On the 10th cook from a country,
a single small gold-foil corner seal appears in the bottom-left of the visa
(or bottom-right if the visa's design occupies the left corner). It's a
star-shape, ~15% of the visa's longest edge, with a slight emboss. One per
country, ever — it doesn't level up further.

**Future-proof note.** A 20-cook tier could exist later (silver wax seal,
ribbon, etc.), but don't ship it until 10 feels too easy to hit. Don't
pre-build seal tiers that haven't earned their place.

---

## 6. Per-region grammars

Each region has a **signature visa style** (a vocabulary that new visas
in that region draw from) and a **cancellation ink colour** (used by
every cancellation stamped on a visa from that region). The 11 regions
below match `CulinaryRegion` in `lib/types.ts` exactly.

The visa style is a *guide for authoring new country visas*, not a
re-render mandate for existing ones. Some countries on disk today
predate the formalised grammar and won't be retouched — they stand as
they are. When in doubt, follow what an existing same-region visa looks
like (e.g. for South Asia, use `india.webp` and `pakistan.webp` as
visual references; for East Asia, `china.webp` and `japan.webp`).

The cancellation ink colour, by contrast, is a hard rule — every
cancellation in a region uses the same ink, so a stack of cancellations
on India and Pakistan look like they came from one ink pad.

| Region (`CulinaryRegion`) | Visa style — vocabulary for new countries | Cancellation ink (CSS var) |
|---|---|---|
| **Western Europe**       | Editorial brown-ink line-art with engraved-postage feel — shield/tablet frame, landmark vignette in fine line, fleurons & cancellation marks at edges. Reference: `france.webp`, `greece.webp`. | Terracotta (`--stamp-ink-terracotta`) |
| **Eastern Europe**       | Same as Western Europe — editorial brown-ink, slightly heavier border treatment. Reference: `croatia.webp`, `hungary.webp`, `poland.webp`. | Terracotta (`--stamp-ink-terracotta`) |
| **East Asia**            | Literati album page — tall/circular/square/oval/horizontal silhouette per country, sumi-ink landscape in warm grey with turmeric/ochre wash, carved vermilion seal-script chop in one corner. Reference: `china.webp`, `japan.webp`, `taiwan.webp`. | Vermilion (`--stamp-ink-wine`) |
| **Southeast Asia**       | Authored manually before the grammar was formalised — looser per-country. New countries should match the nearest existing one (e.g. `thailand.webp`, `vietnam.webp`, `malaysia.webp`). Avoid inventing a new aesthetic; choose the closest neighbour as template. | Warm sepia (`--stamp-ink-brown`) |
| **South Asia**           | Torn handmade cotton-paper rectangle with frayed edges; border of Ajrakh / Phulkari / Nakshi-Kantha block-print; centre a flat folk-painting of a landmark (Madhubani / truck-art style for Pakistan); cotton-paper fibre texture. Sub-grouping: Central Asian countries (Afghanistan onward) use Suzani-embroidery / felt fragment instead. References: `india.webp`, `pakistan.webp`. | Indigo (`--stamp-ink-navy`) |
| **Middle East**          | Two sub-styles. West Asia / Levant (Turkey, Lebanon, Syria, Iran, Iraq, etc.): glazed Iznik ceramic-tile fragment with calligraphic border in cobalt + turquoise + tomato-red on cream glaze. Arabian Peninsula (Saudi, UAE, Qatar, etc.): sun-bleached desert-pigment painting on Bedouin cloth fragment, brass-ochre + oxblood + ivory. References: `turkey.webp`, `iran.webp`, `lebanon.webp`. | Tomato red (`--stamp-ink-wine`) |
| **North Africa**         | Sun-bleached caravanserai / kasbah wall fragment with crumbled edges; border of Beni Ourain rug diamonds + Khamsa-hand motifs; centre a flat painted landmark in faded plaster pigment; warm sand + Tuareg indigo + terracotta + faded saffron. Reference: `morocco.webp`, `egypt.webp`. | Tuareg indigo (`--stamp-ink-navy`) |
| **Sub-Saharan Africa**   | Three sub-styles by sub-region. *West Africa*: kente-strip cloth fragment, kente-gold + kola-red palette. *East Africa*: savanna-painted Coptic-cross icon panel, terracotta + Coptic jade. *Southern + Central Africa*: Ndebele-painted plastered-wall fragment, bold flat geometric in cobalt + magenta + lemon-yellow + leaf-green + terracotta on cream. References: `south-africa.webp`, `ethiopia.webp`. | Terracotta (`--stamp-ink-terracotta`) |
| **North America**        | 1930s commemorative engraved postage — horizontal rectangle, dense engraved cross-hatch in two inks only (sepia + barn-red for USA; sepia + indigo for Canada), Beaux-Arts laurel border with denomination corner. Reference: `united-states.webp`. | Barn red (`--stamp-ink-wine`) |
| **South America**        | Two sub-styles. *Mesoamerica + Caribbean* (Mexico, Guatemala, Cuba, etc.): torn papel-picado paper card with hand-cut edges, folk-art illustration in cobalt + magenta + marigold + jade + vermilion on cream. *Andean S. America* (Peru, Argentina, Colombia, etc.): warp-faced Andean woven-cloth fragment, carved-stone relief silhouette, terracotta + ochre + indigo + jade + magenta + gold. References: `mexico.webp`, `peru.webp`. | Indigo (`--stamp-ink-navy`) |
| **Oceania**              | Tapa / bark-cloth fragment with stamped geometric repeats; ironbark-red + deep ocean-blue palette; centre a flat motif (kava bowl, koru, Uluru silhouette, etc.). No human / face content (universal rule applies). Reference: future visas — none authored at time of writing. | Deep ocean-blue (`--stamp-ink-navy`) |

**Important honesty:** some existing visas on disk are interim
brown-ink-line-art versions from a transitional redesign pass and don't
match the style described above (e.g. `mexico.webp`, `egypt.webp`,
`peru.webp`, `south-africa.webp`). Treat those as placeholders. The
style descriptions above are the **authoring target** for new countries
and for any future regeneration of the interim ones. Don't quietly swap
them out (see §2 — visas never change once shipped); if a regeneration
is wanted, ship the new file alongside under a versioned name and
update `CUSTOM_STAMPS` deliberately.

**Cancellation ink CSS variables.** The variable names above
(`--stamp-ink-navy`, `--stamp-ink-wine`, `--stamp-ink-terracotta`,
`--stamp-ink-brown`) are declared in `app/globals.css` under the
`@theme` block. If a region needs an ink colour that doesn't have a
variable yet, add the variable first; don't hardcode the hex in the
cancellation component.

---

## 7. Compositing & rendering

The visa is a raster (WebP) or SVG; the cancellation is always SVG. Layering
happens in the DOM, not in the source asset.

- The visa is rendered at the slot's natural size (per §2).
- Cancellations are absolutely positioned over the visa, each sized as a
  fraction of the visa's longest edge (per §3, ~28%).
- Both visa and cancellations live inside a `mix-blend-multiply` wrapper so
  the ink interacts with the parchment paper colour below — the same rule
  already used in `CountryStampSlot.tsx`.
- The existing `[filter:url(#stamp-ink)]` filter (paper-bleed + grain) is
  applied to the whole composite, not the cancellations individually, so
  the visa and its cancellations share one paper surface.
- All ink colours come from the existing CSS variables in
  `app/globals.css` (`--stamp-ink-*`) — do not hardcode hex values inside
  the cancellation component.
- Determinism: any randomness (rotation angle, centre-mark choice, slot
  index) must be seeded from `(country, cook_index)` so the same cook
  always renders the same.

Performance:

- Cancellation SVGs are inlined per slot, so a country with 10 cooks
  renders 10 small SVGs. That's fine — the booklet only shows ~16 slots
  per spread, and SVG cost is small. Don't pre-emptively memoise unless
  the React Profiler shows a real cost.
- Don't try to compose the visa + cancellations into a single rasterized
  image on the client. The DOM layering is simpler, scales for new
  cancellations without redraw, and respects the existing filter pipeline.

---

## 8. How to add a new country

Checklist when shipping a new country stamp:

1. **Decide if it gets a custom visa.** If it's a country we have multiple
   recipes for, yes. If it's a one-off, the procedural fallback in
   `lib/stamp-traits.ts` is fine.
2. **Look up its region's visa style** in the §6 table and pick the
   nearest existing same-region visa as your visual reference (those are
   named in §6).
3. **Author the visa prompt.** Use a sibling country's prompt in
   `docs/plans/2026-05-06-stamp-final-prompts.md` (committed, canonical)
   as the template; swap the landmark/dish/motif and the native script.
   The flat-ink archive at `docs/plans/2026-05-13-stamp-flat-ink-archive.md`
   is a secondary reference for cartouche-shape ideas only — do not copy
   its flat-ink rendering instructions into a visa prompt.
4. **Generate and verify transparency.** Save to
   `public/stamps/<country>.png`, then
   `sips -g hasAlpha public/stamps/<country>.png` must return `yes`.
   If not, key out the white background:
   `magick public/stamps/<country>.png -fuzz 8% -transparent white public/stamps/<country>.png`.
5. **Add the country to `CUSTOM_STAMPS`** in `lib/passport-stamps.ts`
   with the correct natural aspect ratio.
6. **Add it to `STATIC_PASSPORT_ASSETS`** in
   `components/passport/PassportAffordance.tsx` so it gets prefetched
   when the affordance is hovered.
7. **Pick a centre-mark glyph for cancellations** (asterisk, fleuron,
   crossbar) — record it in the cancellation component's per-country
   map. This is the only per-country cancellation customization;
   everything else (ring shape, recipe title text, date format, ink
   colour) comes from the region rules in §3 and §6.
8. **Commit the PNG.** The pre-commit hook converts it to WebP.
   After commit, verify the WebP also has alpha:
   `sips -g hasAlpha public/stamps/<country>.webp` → `yes`.
9. **Insert recipes** with `country` matching the
   `world-atlas` GeoJSON `properties.name`.

Stop adding things that aren't on this list. If the new country needs a
new cartouche or a new region palette, that's a SPEC change — open a PR
that updates §6 first, not the country's stamp file.

---

## 9. Passport layout & sizing

Visas are detailed — Madhubani folk-painting, glazed Iznik tile, literati
sumi-ink landscape, etc. At too-small render sizes that detail collapses
into mud and the authoring work is wasted. The booklet grid sizing
balances **density** (multiple visas visible per spread) against
**legibility** (each visa large enough to read).

### 9.1 Current state (what's already on disk)

- Spreads are already organised by region. `usePassportSpreads` produces:
  cover → inside-front → contents → one-or-more spreads per region
  (all 10 `CulinaryRegion` values always present, even empty ones) →
  back-cover.
- Within a region, countries are ordered by first `cooked_at` ascending,
  with country name as tiebreak (`usePassportSpreads`).
- Region packing into spreads is already implemented in
  `lib/passport-pack.ts#packRegion` — overflow countries spill into
  continuation spreads automatically (slug `<region>-2`, `<region>-3`, …).
- Grid: **3 columns × 4 rows per half** = 12 stamps per half, 24 per spread
  (`COLS_PER_HALF = 3`, `ROWS_PER_HALF = 4` in `lib/passport-pack.ts`;
  the same `COLS_PER_HALF = 3` is also declared in
  `components/passport/BookletShell.tsx` and used to compute
  `--stamp-size`).
- Stamp size is computed dynamically:
  `(pageWidth − gap × (cols + 1)) / cols` → exposed as the
  `--stamp-size` CSS variable, which the rest of the booklet typography
  is sized off (so most layout scales automatically when the grid changes).

### 9.2 Target

Reduce the per-half grid to **2 columns × 3 rows = 6 stamps per half,
12 per spread**. Effect: each stamp's visual area roughly doubles
(width scales ~1.5×, height ~1.33×), pages grow by ~2× for the same
cook volume, region grouping and the rest of the booklet shell are
unchanged.

| Cooked countries in a region | Spreads | Notes |
|---|---|---|
| 0 (empty region)             | 1 placeholder spread | Empty-state spread, see §9.3 |
| 1–6                          | 1 spread (left half filling) | First spread of the region |
| 7–12                         | 1 spread | Spreads onto right half |
| 13–24                        | 2 spreads | Continuation spread (slug `<region>-2`) |
| 25+                          | More spreads as needed | `packRegion` handles this — no new logic |

Rationale for these numbers:

- 6 stamps per half (2×3) keeps the spread *feeling* like a passport
  page (multiple stamps in conversation with each other), not a
  wall-calendar single-image page.
- Doubles the visual area, which is roughly the threshold where Iznik
  tile detail and Madhubani brush-work start reading clearly at desktop
  scale.
- Even a power user with 50 cooked countries lands at ~9 region spreads
  total — still flippable, still browsable via `RegionChipStrip`.

### 9.3 Empty-region spreads

Empty regions are **not hidden**. Each empty primary spread carries:

- A region label and a short editorial line ("Six countries of West
  Africa awaiting your first cook…").
- A faint region-map fragment or a decorative motif sourced from the
  region's visa vocabulary (see §6) — single colour, low contrast, so
  the spread reads as quiet anticipation rather than a missing feature.
- No CTAs, no "go cook" buttons. The empty-state is editorial.

This serves two goals: it preserves the booklet's symmetrical "one
region per chapter" structure, and it gives users a visible target
("there's still all of South America to fill in").

### 9.4 Cancellations scale with the visa

The cancellation size in §3 (`~28% of visa's longest edge`) is a
**ratio**, not a fixed pixel value. When visas double in size,
cancellations double too. No separate sizing rule, no extra config.
The same applies to the 10-cook gold seal (§5) and the per-country
centre-mark glyph (§3).

### 9.5 What changes vs. what stays

Changes needed:

- `lib/passport-pack.ts`: `COLS_PER_HALF = 3` → `2`,
  `ROWS_PER_HALF = 4` → `3`. `HALF_CAPACITY` and `SPREAD_CAPACITY`
  recompute automatically.
- `components/passport/BookletShell.tsx`: the local
  `const COLS_PER_HALF = 3` → `2`. (This is a second copy of the same
  constant — consider importing from `passport-pack.ts` instead of
  duplicating, while you're there.)
- Add an empty-region spread component (or extend `RegionHalf.tsx`)
  to render the editorial empty-state when both halves are empty.

Untouched on purpose:

- The booklet shell, page-turn animation, hinge logic, scale-from-origin
  open animation, `PassportOverlayProvider` — all stay.
- `usePassportSpreads`'s ordering rules (region order, first-cooked-at
  ordering within a region) — stay.
- The `RegionChipStrip` navigation along the booklet edge — stays;
  it'll just point at slightly different spread counts.
- Mobile layout — the same formula applies; stamps just end up smaller
  on narrow viewports. If mobile feels too sparse after the change,
  revisit then, not pre-emptively.

### 9.6 What this is not

- Not a "one stamp per page" gallery view.
- Not chronological cook order across the whole booklet (still
  region-based; chronological order only applies within a region).
- Not a redesign of the cover, inside-front, contents, or back-cover
  spreads.
- Not a change to which `CulinaryRegion` values exist or their order.
