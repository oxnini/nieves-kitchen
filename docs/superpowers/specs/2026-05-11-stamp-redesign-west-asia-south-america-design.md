# Stamp redesign — West Asia / Levant + South America (incl. Brazil)

**Status:** Design approved 2026-05-11.
**Companion files:** `docs/plans/2026-05-05-stamp-aesthetics-image-prompts.md` (original aesthetic spec), `docs/plans/2026-05-06-stamp-final-prompts.md` (where the rewritten prompts will land).

## Problem

The current stamps for regions 4 (West Asia / Levant) and 12 (South America) do not read as passport stamps. The West Asia prompts describe *"a single fragment of glazed Iznik ceramic tile"* — the model renders a literal tile object with glaze, crackle, and a painted scene. The South America prompts describe *"a rectangular fragment of warp-faced striped Andean woven cloth"* — the model renders a piece of fabric with a relief on top. Both regions render as **objects**, not as **ink impressions on paper**.

By contrast, the Western Europe stamps read unambiguously as passport stamps because their prompts describe an **ink impression** (engraved cartouche, rubber-stamp ink, postal grammar) — the regional flavor sits inside the stamp grammar, it does not replace it.

## Goal

Recast both regions as ink-stamp impressions with transparent backgrounds, matching the Western Europe grammar, while preserving regional distinctiveness through silhouette, palette, motif, and script. Convert Brazil from its Tropicália-poster exception into the same grammar so the booklet is fully cohesive.

## Shared stamp grammar (applies to all 23 stamps in scope)

The constant that makes a stamp read as a stamp:

1. **Form** — flat ink impression on transparent canvas. No substrate texture inside the silhouette (no glaze, no cloth, no paper-fiber, no plaster, no ceramic crackle). **The frame is an outline only — no interior fill, no card or paper surface inside the silhouette.** The negative space between ink lines is fully transparent on the rendered canvas; only the inked strokes (frame outline, border motifs, center line-art, text) are opaque. This is what makes the artifact read as a stamp pressed onto the booklet's parchment page, not a sticker glued onto it.
2. **Frame + grammar** — a closed silhouette frame *outline* in primary ink. Country name in display serif inside the top arc of the frame. "NIEVES' KITCHEN · 2026" inside the bottom arc or in a border band. All interior motifs drawn as **flat ink line-art** (no gradients, no shading volumes, no painterly fills).
3. **Two-tone ink** — primary ink does the heavy lifting (frame, script, dominant motifs). Secondary ink is used sparingly for accents (a flourish, an inner seal, a flower head). Never more than two ink colors per stamp.
4. **Rubber-stamp imperfection** — must be specified explicitly in every prompt:
   - Broken ink lines
   - Dry-press patches with mid-stroke dropouts
   - Slight ink bleed at corners and at stroke intersections
   - Faint off-register double-strike where the secondary color is laid down (offset 1–2px from the primary)
   - Edge wear on the silhouette frame
5. **Background** — pure transparent. Generated against pure white outside the silhouette; post-processed to alpha. **No parchment, no cream, no card, no paper backdrop.**
6. **Script handling** — country name in Latin serif is primary. Native script appears as **one short phrase only** (the country name in its own script) in a smaller weight. Never a full calligraphic band running the entire border (AI mangles long native script).

## West Asia / Levant — 11 countries

**Direction:** consular-cachet stamp grammar with ink-line Iznik motifs inside. Preserves the Iznik visual identity from the original spec but re-grounds it in mandate-era cachet form so the artifact reads as a stamp, not a tile.

**Palette:** cobalt blue (primary ink) + tomato red (secondary accent). Faded indigo permitted where cobalt is wrong tonally (Armenia, Georgia, Cyprus may lean deeper navy).

**Silhouette:** varies per country — preserves the Iznik tile-shape DNA, but now the silhouette is the *stamp frame*, not a tile shape.

**Border pattern:** ink-line Iznik motif strip — tulips, carnations, saz leaves, geometric arabesque — drawn flat, no fills.

**Center motif:** country landmark in flat ink silhouette + line-art (drawn as if hand-engraved on a rubber stamp).

| Country | Frame silhouette | Center motif | Native script (small) |
|---|---|---|---|
| Turkey | Square | Hagia Sophia dome + tulip flourish | Türkiye |
| Lebanon | Octagonal | Cedar of Lebanon between two Baalbek columns | لبنان |
| Syria | Hexagonal | Umayyad Mosque dome | سوريا |
| Palestine | Square | Dome of the Rock + olive branch | فلسطين |
| Jordan | Octagonal | Petra Treasury facade | الأردن |
| Iran | Pointed-arch (mihrab) | Naqsh-e Jahan dome | ایران |
| Iraq | Square | Samarra spiral minaret | العراق |
| Armenia | Khachkar (cross-shaped) | Khor Virap + Mount Ararat behind | Հայաստան |
| Azerbaijan | Diamond/lozenge | Maiden Tower + flame motif | Azərbaycan |
| Georgia | Bagrati (cross-shaped) | Gergeti Trinity Church + Caucasus | საქართველო |
| Cyprus | Byzantine octagonal | Kourion ruins | Κύπρος |

## South America — 12 countries (incl. Brazil)

**Direction:** oval cartouche stamp grammar with ink-line Andean-textile motifs in the border. Preserves the per-country textile DNA from the original spec by promoting the textile pattern to the *border pattern of a stamp*, instead of treating cloth as the stamp's substrate.

**Palette:** terracotta (primary ink) + deep indigo (secondary accent). Two tones only.

**Silhouette:** **shared oval cartouche** across the region. Deliberate change from the original "shared rectangular cloth fragment." Reasoning:
- Oval cartouche reads more unambiguously as a stamp.
- Mirrors the Western Europe pattern, reinforcing booklet cohesion.
- The per-country differentiator was always the textile geometry, not the silhouette — promoting that geometry to the *border pattern* makes country distinctiveness more legible, not less.

**Border pattern:** ink-line Andean (or country-appropriate) textile-geometry strip wrapping the oval.

**Center motif:** country landmark or food-object in flat ink line-art.

| Country | Border textile pattern | Center motif | Local accent |
|---|---|---|---|
| Peru | Quechua manta stepped-fret | Machu Picchu + Nazca hummingbird inset | PERÚ |
| Argentina | Gaucho leather-tooled with silver studs | Mate gourd + bombilla | — |
| Colombia | Wayuu mochila zigzag | Burlap coffee sack + arabica branch | — |
| Chile | Mapuche stepped-diamond | Atacama dunes against horizon | — |
| Bolivia | Aymara aguayo diamond | Salar de Uyuni with reflected Andes peak | — |
| Venezuela | Wayuu + Andean combined | Angel Falls *or* arepa griddle | — |
| Ecuador | Otavalo geometric weave | Cotopaxi volcano | — |
| Paraguay | Ñandutí radial-spiderweb lace | Lapacho tree in bloom | — |
| Uruguay | Gaucho leather + Charrúa geometric | Mate gourd | — |
| Guyana | Hammock weave + Amerindian | Kaieteur Falls | — |
| Suriname | Maroon textile + Caribbean-creole | Jungle canopy with parrot silhouette | — |
| Brazil | Stylized banana-leaf + palm frond geometric strip (Tropicália nod, but as flat ink line-art, not poster fills) | Christ the Redeemer back-view silhouette + abstracted banana leaves flanking | BRASIL |

### Brazil — Tropicália exception retired

Brazil was previously a deliberate Tropicália-poster exception (banana yellow + hot pink + cobalt, modernist sans-serif, flat saturated fills). Under this redesign Brazil joins the South America grammar:
- Same shared oval cartouche.
- Same terracotta + indigo two-tone ink.
- Same flat-ink-line treatment.
- Iconography preserved: Christ the Redeemer back-view silhouette and banana leaves remain so the stamp is still identifiably Brazilian.
- Tropicália palette and modernist typography are dropped in favor of booklet cohesion.

## Reusable per-region prompt template

Each prompt follows this shape. Country-specific fields fill in `{silhouette}`, `{border_motif}`, `{center_motif}`, `{country_name}`, `{native_script}`.

### West Asia / Levant template

```
A passport stamp rendered as a flat ink impression on a transparent background. The frame is an outline only — no interior fill, no card or paper surface inside the silhouette. The negative space between ink lines is fully transparent; only the inked strokes are opaque. {silhouette} frame in cobalt-blue ink with rubber-stamp imperfection — broken lines, dry-press patches, slight ink bleed at corners, faint off-register double-strike in tomato-red, edge wear on the frame. Border: a thin strip of ink-line Iznik motifs ({border_motif}), drawn flat, no fills. Center: {center_motif} in flat cobalt ink silhouette and line-art with tomato-red accent flourishes. Country name "{COUNTRY_NAME}" in display serif inside the top arc of the frame; "{native_script}" in smaller weight near the bottom. "NIEVES' KITCHEN · 2026" in the lower border band.

The stamp must fill the canvas — its outer border touches the canvas edges. No surrounding page, no paper margin, no canvas frame around the stamp. Render against a pure white background both outside the stamp's silhouette AND inside the frame between ink lines — this white will be removed to transparent in post on both sides. The interior of the frame must not be a card, paper, cream wash, halo, or any opaque shape behind the motifs; it is the same canvas white as the outside, so that only the ink strokes survive when the white is keyed out. No substrate texture inside the silhouette — no glaze, no ceramic crackle, no cloth weave, no paper fiber, no plaster. The result must read as a stamp pressed onto paper, not a sticker.

no human faces, no portrait sculpture, no ceremonial mask faces, no anthropomorphic deity faces, no religious figure faces painted on architecture, no neon colors, no pure black, no fluorescent saturation, no stock-photo realism, no AI-cliché smooth gradient, no text errors, no garbled native script, no glaze, no ceramic crackle, no painted tile fill, no woven cloth substrate, no parchment background, no cream background, no card fill inside the silhouette, no paper card inside the frame, no cream wash inside the silhouette, no opaque substrate behind the motifs, no sticker look, no die-cut card
```

### South America template

```
A passport stamp rendered as a flat ink impression on a transparent background. The frame is an outline only — no interior fill, no card or paper surface inside the silhouette. The negative space between ink lines is fully transparent; only the inked strokes are opaque. Oval cartouche frame in terracotta ink with rubber-stamp imperfection — broken lines, dry-press patches, slight ink bleed at corners, faint off-register double-strike in deep indigo, edge wear on the frame. Border: a thin strip of ink-line {border_motif}, drawn flat, no fills. Center: {center_motif} in flat terracotta ink silhouette and line-art with deep-indigo accent flourishes. Country name "{COUNTRY_NAME}" in display serif inside the top arc of the frame{local_accent_clause}. "NIEVES' KITCHEN · 2026" in the lower border band.

The stamp must fill the canvas — its outer border touches the canvas edges. No surrounding page, no paper margin, no canvas frame around the stamp. Render against a pure white background both outside the stamp's silhouette AND inside the frame between ink lines — this white will be removed to transparent in post on both sides. The interior of the frame must not be a card, paper, cream wash, halo, or any opaque shape behind the motifs; it is the same canvas white as the outside, so that only the ink strokes survive when the white is keyed out. No substrate texture inside the silhouette — no woven cloth, no fabric weave, no paper fiber, no leather grain, no carved stone. The result must read as a stamp pressed onto paper, not a sticker.

no human faces, no portrait sculpture, no ceremonial mask faces, no anthropomorphic deity faces, no religious figure faces painted on architecture, no neon colors, no pure black, no fluorescent saturation, no stock-photo realism, no AI-cliché smooth gradient, no text errors, no garbled native script, no woven cloth substrate, no fabric weave fill, no carved stone substrate, no parchment background, no cream background, no card fill inside the silhouette, no paper card inside the frame, no cream wash inside the silhouette, no opaque substrate behind the motifs, no sticker look, no die-cut card
```

## Implementation scope

1. **Rewrite** sections **4. West Asia / Levant** and **12. South America** in `docs/plans/2026-05-06-stamp-final-prompts.md` using the templates and per-country fields above. All 23 country prompts (11 + 12) are replaced.
2. **Update** the `2026-05-05-stamp-aesthetics-image-prompts.md` aesthetic spec to reflect:
   - The new shared grammar (transparent background, two-tone ink, rubber-stamp imperfection)
   - West Asia / Levant direction changed from "Iznik tile fragment" to "consular cachet with Iznik motifs"
   - South America silhouette changed from per-country/shared-rectangular-cloth to shared-oval-cartouche
   - The Brazil deliberate-exception subsection retired (replaced with a note that Brazil joins the region grammar)
3. **No code changes.** `lib/passport-stamps.ts` `CUSTOM_STAMPS` map remains as-is; only the underlying `public/stamps/*.webp` assets will be regenerated by the user from the new prompts.

## Out of scope

- Regenerating the actual WebP image assets (the user does this in their image generator with the prompts as input).
- Touching any other region's prompts (East Asia, Southeast Asia, South + Central Asia, Arabian Peninsula, North Africa, West Africa, East Africa, Southern + Central Africa, North America, Mexico + Central America + Caribbean, Oceania, Western Europe, Eastern Europe).
- Changing `CUSTOM_STAMPS`, `STATIC_PASSPORT_ASSETS`, or any TypeScript.
- Re-rendering the existing tier badge prompts in `2026-05-05-tier-badges-image-prompts.md`.
