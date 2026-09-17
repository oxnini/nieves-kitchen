# Stamp redesign — Section 10 North America (from scratch)

**Status:** Design approved 2026-05-24.
**Companion files:**
- `docs/plans/2026-05-06-stamp-final-prompts.md` (where the rewritten prompts will live, section 10).
- `docs/stamps/SPEC.md` (source-of-truth precedence, region table).
- `docs/superpowers/specs/2026-05-11-stamp-redesign-west-asia-south-america-design.md` (precedent for the shared ink-impression grammar).
- Memory: `project_stamp_aesthetics_strategy.md`, `feedback_per_region_enrichment.md`, `feedback_no_material_language_in_stamp_prompts.md`, `feedback_stamp_generation_workflow.md`.

## Problem

Section 10 (USA + Canada) is one of three remaining stamps in the anchor aesthetic — engraved-postage rectangles with paper-yellowing inside the silhouette. Next to the ink-impression-on-transparent stamps in sections 2–9, 12, 13, they read as "pieces of paper pasted onto the booklet" rather than ink pressed onto the parchment page. The substrate inside the silhouette is opaque cream, so the passport's paper texture doesn't show through.

A second, smaller issue: neither current stamp carries the "NIEVES' KITCHEN · 2026" wordmark that has become a baked-in element of the ink-impression grammar elsewhere. The TODO already flagged this — Section 10 doesn't reference Nieves' Kitchen the way other sections do.

Mexico is excluded from this work — it moved into Section 11a (Mesoamerica) on 2026-05-17 and now uses the Cabinet etching grammar.

## Goal

Recast USA + Canada in the ink-impression-on-transparent grammar (boilerplate B), with per-country folk-Americana cartouches and the two-layer density enrichment used by the post-2026-05-16 regions (4 regional corner glyph panels + ecology horizon strip behind the centerpiece).

Preserve the existing food-first centerpieces (diner mug + pie wedge for USA; maple-syrup tap + bucket for Canada) and the documented Canada three-ink exception (sepia + indigo + butter-yellow).

## Shared stamp grammar

Identical to every other ink-impression region. See `docs/superpowers/specs/2026-05-11-stamp-redesign-west-asia-south-america-design.md` for the full statement. Briefly:

1. Flat ink impression on transparent canvas. Frame is outline only, no interior fill, no paper/cloth/plaster substrate inside the silhouette.
2. Two ink colors only — primary does the heavy lifting (frame, script, dominant motifs); secondary is reserved for accents. **Canada exception:** three inks (sepia + indigo + butter-yellow), preserved from the existing aesthetic.
3. Rubber-stamp imperfection specified explicitly: broken lines, dry-press patches, slight ink bleed at corners, faint off-register double-strike in the secondary color, edge wear on the frame.
4. Country name in Latin display serif. A bold sans-serif slab carries the country name beneath the centerpiece. "NIEVES' KITCHEN · 2026" tucked under the slab in a thin engraved line.
5. Heritage names the geometric vocabulary, never the substrate. No "blanket", "quilt fabric", "tin plate" — instead "barn-quilt-derived octagon drawn as flat ink lines", "Hudson-Bay-blanket-stripe-vocabulary geometric bands", etc.
6. Boilerplate (canvas instructions + universal negative prompt) is stripped from each prompt. Use **boilerplate B** from `docs/plans/2026-05-06-stamp-final-prompts.md`.

## 10. North America — 2 countries

**Direction:** Americana / folk-Americana ink vocabulary. Per-country cartouche silhouettes (the section has only two countries, so per-country shape is honest to each national folk tradition rather than averaged into a regional shape).

**Cancellation ink:** Barn red (`--stamp-ink-wine`), unchanged from the existing region table.

### Per-country dials

| Country | Cartouche silhouette | Primary ink | Secondary ink | Tertiary ink |
|---|---|---|---|---|
| USA | Barn-quilt octagon (8-sided with notched corners; inner double-rule with tin-punch dot pattern between the rules) | sepia | barn-red | — |
| Canada | Hudson-Bay-blanket-stripe vertical rectangle (tall portrait format with two narrow horizontal stripe-bands top and bottom, referencing point-blanket selvedge geometry; serrated postal-stamp outer edge) | sepia | indigo | butter-yellow |

### Center motifs (preserved from existing specs)

- **USA:** diner coffee mug beside a wedge of pie on a small plate; the pie's lattice top picked out in barn-red accent.
- **Canada:** maple-syrup tap and bucket on a sugar-maple trunk; butter-yellow on the bucket interior and a single sap-spill drop.

### Density layer A — 4 regional folk-art corner glyph panels per country

Following the per-region enrichment pattern: each glyph is region-specific within the country (NE / NW / SE / SW), drawn as flat ink-line geometric panels, no fills, no faces, no material language.

**USA corners:**
- NE (Mid-Atlantic / Pennsylvania) — Pennsylvania-Dutch-hex-rosette geometric block (6-point star inside a circle, fine concentric rings).
- NW (Pacific NW / Shaker descent) — Shaker round-box concentric-ring geometric (three nested rings with a small finial mark).
- SE (Southern preserves heritage) — Mason-jar-lid concentric crimped rosette (scalloped outer ring around a small flat boss).
- SW (Southwest desert) — Diné/Navajo step-geometric block (stepped diamond inside a square frame; strictly geometric, no figural motifs).

**Canada corners:**
- NE (Atlantic) — lobster-trap lath silhouette grid (small rectangular crosshatch frame suggesting wooden trap laths).
- NW (Pacific NW) — Haida-formline ovoid geometric (rounded rectangle with inner curl; strictly geometric, no animal face).
- SE (Québec) — fleur-de-lys folk variant (geometric, flat ink-line; not heraldic-rendered).
- SW (Prairies) — wheat-sheaf rosette (radial spray of wheat heads bound at the base).

### Density layer B — ecology horizon strip behind the centerpiece

- **USA:** heartland rolling wheatfield with a single grain silo and a cottonwood tree to the right; thin engraved horizon line sits behind the mug-and-pie centerpiece without crowding it.
- **Canada:** boreal lake at first light with a single canoe silhouette and a coniferous treeline along the far shore; thin engraved horizon line sits behind the maple-tap centerpiece.

*No seal flourish layer — two-layer stack, matching the user preference established 2026-05-16 for every region after the Andean three-layer pilot.*

### Typography

- **USA:** "UNITED STATES OF AMERICA" in display serif arched across the top inside the cartouche. Bold sans-serif slab "U S A" under the centerpiece. "NIEVES' KITCHEN · 2026" in a thin engraved line tucked beneath the slab.
- **Canada:** "CANADA · POSTES" stacked in display serif across the top (bilingual line, single ink). Bold sans-serif slab "CANADA" at the bottom. "NIEVES' KITCHEN · 2026" in a thin engraved line tucked beneath the slab.

### Final prompts (paste-ready, before boilerplate B)

**USA**
```
A passport stamp in the ink-impression-on-transparent grammar — flat ink lines pressed onto the page, no substrate inside the silhouette, every pocket of negative space between strokes is transparent. Two ink colors only: sepia (primary) + barn-red (secondary accent). Cartouche silhouette: a barn-quilt-derived octagon (8-sided with notched corners), drawn in flat sepia outline; inner border is a thin double-rule with a tin-punch dot pattern running between the rules. Center motif: a diner coffee mug beside a wedge of pie on a small plate, drawn as flat ink line-art in sepia, the pie's lattice top picked out in barn-red accent. Behind the centerpiece, a thin engraved horizon line suggests a heartland rolling wheatfield with a single grain silo and a cottonwood tree to the right — drawn light so it does not crowd the centerpiece. Four regional folk-art corner glyph panels, each a small geometric ink block (no fills, no faces, no figural motifs): NE corner — Pennsylvania-Dutch-hex-rosette (six-point star inside a circle); NW corner — Shaker round-box concentric-ring geometric (three nested rings with a small finial mark); SE corner — Mason-jar-lid concentric crimped rosette (scalloped outer ring around a small flat boss); SW corner — Diné/Navajo step-geometric block (stepped diamond inside a square frame). Typography: "UNITED STATES OF AMERICA" in display serif arched across the top inside the cartouche; bold sans-serif slab "U S A" under the centerpiece; a thin engraved line beneath the slab reads "NIEVES' KITCHEN · 2026". Rubber-stamp imperfection on every stroke — broken lines, dry-press patches, slight ink bleed at corners, faint off-register double-strike in the barn-red accent, edge wear on the cartouche frame. Restrained, editorial, cookbook voice — not Victorian-ornate, not kitsch.
```

**Canada**
```
A passport stamp in the ink-impression-on-transparent grammar — flat ink lines pressed onto the page, no substrate inside the silhouette, every pocket of negative space between strokes is transparent. Three ink colors only (Canada exception): sepia (primary) + indigo (secondary) + butter-yellow (tertiary accent, used sparingly on the bucket interior and one sap-spill drop). Cartouche silhouette: a Hudson-Bay-blanket-stripe-vocabulary tall vertical rectangle in flat sepia outline, with two narrow horizontal stripe-bands at the top and bottom of the cartouche (referencing point-blanket selvedge geometry as flat ink lines, not as fabric texture); the outer edge is serrated like a vintage postage-stamp perforation. Center motif: a maple-syrup tap and bucket on a sugar-maple trunk, drawn as flat ink line-art in sepia with indigo bark-shading hatch on the trunk; the bucket interior is filled with a small wash of butter-yellow, and a single sap-spill drop falls below the tap in butter-yellow. Behind the centerpiece, a thin engraved horizon line suggests a boreal lake at first light with a single canoe silhouette and a coniferous treeline along the far shore — drawn light so it does not crowd the centerpiece. Four regional folk-art corner glyph panels, each a small geometric ink block (no fills, no faces, no figural motifs): NE corner (Atlantic) — lobster-trap-lath silhouette grid (small rectangular crosshatch frame suggesting wooden trap laths); NW corner (Pacific NW) — Haida-formline ovoid geometric (rounded rectangle with an inner curl, strictly geometric, no animal face); SE corner (Québec) — fleur-de-lys folk variant (geometric, flat ink-line, not heraldic-rendered); SW corner (Prairies) — wheat-sheaf rosette (radial spray of wheat heads bound at the base). Typography: "CANADA · POSTES" stacked in display serif across the top inside the cartouche; bold sans-serif slab "CANADA" at the bottom; a thin engraved line beneath the slab reads "NIEVES' KITCHEN · 2026". Rubber-stamp imperfection on every stroke — broken lines, dry-press patches, slight ink bleed at corners, faint off-register double-strike in the indigo accent, edge wear on the cartouche frame. Restrained, editorial, cookbook voice — not Victorian-ornate, not kitsch.
```

## File edits required when this design ships

1. **`docs/plans/2026-05-06-stamp-final-prompts.md`** — Section 10:
   - Header note: replace "Anchor aesthetic. Canada kept as-is. USA centre motif updated 2026-05-15 … Use boilerplate A." with "Ink-impression grammar (redesigned 2026-05-24). Per-country folk-Americana cartouches. Canada keeps its three-ink exception. Use boilerplate B."
   - Replace the USA and Canada prompt bodies with the two paste-ready prompts above.
2. **`docs/stamps/SPEC.md` §6 region table** — Section 10 row:
   - Cartouche column: "USA = barn-quilt octagon; Canada = Hudson-Bay-blanket-stripe vertical rectangle".
   - Notes column: drop "anchor — engraved postage"; mark as ink-impression grammar (boilerplate B) with the Canada three-ink exception called out explicitly.
3. **`docs/plans/2026-05-06-stamp-final-prompts.md` boilerplate header (line 20)** — "for Sections 1 (East Asia) and 10 (North America)" → "for Section 1 (East Asia)". Boilerplate A now applies to Section 1 only.
4. **Boilerplate B header (line 28)** — add "10" to the section list: "for Sections 2, 3a, 3b, 4, 5, 6, 7, 8, 9, **10**, 12, 13".
5. **Memory file `project_stamp_aesthetics_strategy.md`** — Section 10 row in the region table: update cartouche and grammar; add Section 10 to the density-enrichment table as "**Done 2026-05-24** — two-layer stack (regional folk-art corner glyphs + ecology horizon)." Update the opening paragraph's "four anchor aesthetics" wording — only three anchors remain (Western Europe, Eastern Europe, East Asia).

## Asset generation workflow

Per `feedback_stamp_generation_workflow.md`:

1. Append boilerplate B from `docs/plans/2026-05-06-stamp-final-prompts.md` to each prompt.
2. Append the "native transparent PNG" boilerplate clause and universal negative prompt to the generator request.
3. Verify `sips -g hasAlpha public/stamps/united-states.png` and `…/canada.png` both report `hasAlpha: yes`. If `no`, run `magick <file>.png -fuzz 8% -transparent white <file>.png` (the 8% fuzz threshold is safe — none of the stamp inks sit near white).
4. Stage the PNGs. The `.husky/pre-commit` hook converts to WebP via `scripts/convert-image.sh`; verify the resulting WebPs also report `hasAlpha: yes`.
5. **Canada is a new country** for the stamp asset library. Add `canada.webp` to:
   - `CUSTOM_STAMPS` in `lib/passport-stamps.ts`.
   - `STATIC_PASSPORT_ASSETS` in `components/passport/PassportAffordance.tsx`.
   USA (`united-states.webp`) already exists in both — overwrite the asset in place.

## Out of scope

- Mexico — stays in Section 11a (Cabinet etching).
- Any other country in any other region.
- Changes to the cancellation postmark for Section 10 — barn-red is preserved.
- Changes to the passport booklet, region chip strip, or affordance components beyond the two file updates listed above.
- Changes to `lib/regions.ts` — the country-to-region mapping is unaffected.

## Risks and decisions worth flagging

- **"NIEVES' KITCHEN · 2026" wordmark** is baked into both prompts because the TODO called it out. If the generator garbles the apostrophe it can be regenerated; if it consistently fails, fallback is "NIEVES KITCHEN · 2026" (drop the apostrophe).
- **Three-ink Canada exception** is preserved by user choice — the strategy doc's "no third accent color (Canada is the only documented exception)" rule continues unchanged.
- **Haida formline corner glyph** must be strictly geometric (ovoid + inner curl, no animal face, no totemic figure). If the generator pushes toward figural, the prompt's "strictly geometric, no animal face" clause is the lever; second fallback is to replace this corner with another Pacific-NW geometric (e.g. Coast-Salish-blanket-vocabulary geometric step-pattern, also flat ink-line).
- **Diné/Navajo step-geometric corner glyph** must stay generic geometric (stepped diamond inside a square frame). Avoid pictorial Yei figures, avoid any descriptive textile language in the prompt — the prompt already routes this through the "no material language" discipline.
- **Cartouche octagon vs. circle confusion** — generators sometimes render an octagon as a circle with stepped edges or as a true octagon. Either reads as a barn-quilt block; both are acceptable. The clause "8-sided with notched corners" is the lever if the generator drifts circular.
