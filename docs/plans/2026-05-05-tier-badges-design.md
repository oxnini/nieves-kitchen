# Tier Badge Design — Nieves Kitchen Explorer Ranks

## Goal

Replace the five generic numbered slots in the passport's `TierLedger` with five generated, progressively prestigious badge artifacts that read as a collectible system.

## Tier ladder

| # | Title | Stamps | Regions | Artifact |
|---|---|---|---|---|
| I | New Explorer | 0 | 0 | Paper luggage tag |
| II | Curious Cook | 1 | 1 | Passport entry stamp |
| III | Wanderer | 5 | 2 | Layered postmark |
| IV | Globetrotter | 10 | 4 | Wax seal on parchment |
| V | Culinary Diplomat | 20 | 10 | Gold-foil diplomatic crest |

Visual weight roughly doubles per tier. Material progression: **paper → ink → ink + postmarks → wax → gold-foiled crest**.

## Shared system rules

1. **Silhouette.** All five badges fit a roughly circular footprint so they slot into the same UI position. Tier III breaks the perfect disc with a ticket-stub perforation along one edge; Tier IV adds a small ribbon trailing below the seal. The circular core remains.
2. **Center mark.** A small "NK" serif monogram sits dead-center of every badge. Same letterforms, different rendering per tier (printed → inked → embossed → wax-raised → gold-leafed).
3. **Top arch.** Roman numeral I–V matching the tier rank. No tier name on the badge — the UI label handles that.
4. **Bottom arch.** "NIEVES' KITCHEN" in serif caps, arched along the lower curve. Echoes the country-stamp template.
5. **Ornamental ring.** The space between the bottom arch and the center monogram is where each tier earns its identity. The ring is what the user is "earning" each tier — it grows in density and decoration as rank rises.
6. **Palette.** Brown ink + parchment cream throughout. Terracotta enters at Tier II as a small accent and grows through Tier III and IV. Gold ink/foil is exclusive to Tier V.
7. **Style.** Hand-drawn etching / vintage letterpress / postal-stamp aesthetic, matching the existing country stamps in `public/stamps/`. Distressed ink, ink bleed at edges, no glossy digital finishes, no gradients, no drop shadows.

## Per-tier specifications

### Tier I — New Explorer (luggage tag)
- **Form.** Round cream card-stock luggage tag, reinforced metal eyelet at top with a short twine loop, one slightly torn paper edge.
- **Color.** Brown ink only on cream card stock. No terracotta.
- **Top arch.** Roman "I" in small serif caps.
- **Center.** NK monogram, simple printed brown ink.
- **Bottom arch.** "NIEVES' KITCHEN."
- **Ornamental ring.** Compass rose: cardinal direction marks (N, E, S, W) at the four cardinal positions, with hairline radial tick marks between. Subtle, sparse.
- **Mood.** Humble, fresh, "departures."

### Tier II — Curious Cook (passport entry stamp)
- **Form.** Distressed circular ink stamp matching the country-stamp visual family (rough ink ring, bleed, slight off-register).
- **Color.** Brown ink + first hit of terracotta as small accents.
- **Top arch.** Roman "II."
- **Center.** NK monogram, inked.
- **Bottom arch.** "NIEVES' KITCHEN."
- **Ornamental ring.** Four small etching-style cooking objects orbiting the monogram at NSEW positions: wooden spoon (top), open recipe book (right), sprig of herbs (bottom), small whisk (left). Tiny terracotta dot ornaments between them.
- **Extra.** A small secondary dated postmark partially overlapping the bottom-right edge (vintage stamp impression).
- **Mood.** First real ink, "I cooked once."

### Tier III — Wanderer (layered postmark)
- **Form.** Circular badge built from overlapping postmark and cancellation impressions. A ticket-stub perforation runs along one edge of the circle.
- **Color.** Brown + heavier terracotta. Denser ink than Tier II.
- **Top arch.** Roman "III."
- **Center.** NK monogram.
- **Bottom arch.** "NIEVES' KITCHEN."
- **Ornamental ring.** Wavy cancellation lines, multiple smaller dated postmarks overlapping the main mark, fragments of "PAR AVION" and city names visible at the edges, a thin route-line arc curving across one quadrant with a small airplane silhouette.
- **Mood.** Well-traveled, slightly worn, layered history.

### Tier IV — Globetrotter (wax seal on parchment)
- **Form.** Round terracotta wax seal with raised/embossed detailing, scalloped/dripped wax edge, a small folded parchment ribbon trailing below the seal.
- **Color.** Terracotta wax body with brown ink shadow details. Subtle highlight on raised elements.
- **Top arch.** Roman "IV" — raised/embossed *in the wax*, not inked.
- **Center.** NK monogram, raised/embossed.
- **Bottom arch.** "NIEVES' KITCHEN," raised/embossed.
- **Ornamental ring.** A stylized globe with longitude and latitude lines forms the ring around the monogram. Two small route arcs thread through the globe. Three tiny pin dots mark destinations.
- **Mood.** Tactile, sealed, "officially noted."

### Tier V — Culinary Diplomat (gold-foil diplomatic crest)
- **Form.** Round medallion, full crest treatment.
- **Color.** Brown + terracotta + **gold ink/foil accents**. Gold is exclusive to this tier.
- **Top arch.** Roman "V" in gold.
- **Center.** NK monogram, fully gold-leafed — the most ornate rendering of the monogram in the system.
- **Bottom arch.** "NIEVES' KITCHEN," gold.
- **Ornamental ring.** A laurel wreath wraps the entire monogram. Fine sun rays radiate outward beyond the laurel. Four small star ornaments at NSEW. A horizontal ribbon banner cuts across the lower third of the medallion (left blank — language-agnostic). Subtle crossed-utensil flourishes (fork + spoon) tucked inside the laurel at the base.
- **Mood.** Unmistakably official. "Credential."

## Output format for generation

- Five separate 1024×1024 square PNGs with transparent backgrounds.
- One additional "lineup sheet" 2048×512 image showing all five in order for system validation.
- Filename convention: `public/passport-tiers/tier-{n}-{slug}.webp` after WebP conversion (matches existing `public/stamps/` pattern).

## Wiring (deferred, separate task)

- Add `TIER_BADGES` map in `lib/passport.ts` keyed by `ExplorerTitle`.
- Replace `TierSlot` in `components/passport/TierLedger.tsx` so completed/current tiers render the badge image (`<Image>` with `unoptimized` since each badge will be small) and locked tiers fall back to the existing parchment-dark placeholder.
- Preload tier badges from `STATIC_PASSPORT_ASSETS` in `components/passport/PassportAffordance.tsx`.
