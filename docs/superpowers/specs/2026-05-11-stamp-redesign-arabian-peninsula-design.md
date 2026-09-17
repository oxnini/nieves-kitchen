# Stamp redesign — Arabian Peninsula

**Status:** Design approved 2026-05-11.
**Companion files:** `docs/plans/2026-05-06-stamp-final-prompts.md` (where the rewritten prompts will land), `docs/superpowers/specs/2026-05-11-stamp-redesign-west-asia-south-america-design.md` (precedent — same grammar, applied to W. Asia / S. America).

## Problem

Section 5 (Arabian Peninsula) of `2026-05-06-stamp-final-prompts.md` currently describes each stamp as *"a rectangular fragment of woven Bedouin cloth"* containing *"a tooled brass / copper medallion engraved with…"*. The image model interprets this literally and renders a piece of cloth with a metal disc lying on top — a physical object photographed against white, not an ink impression on paper. The seven Arabian Peninsula stamps therefore do not read as passport stamps in the booklet, breaking the anchor aesthetic set by Western Europe, Eastern Europe, and (now) West Asia / Levant and South America.

## Goal

Recast all seven Arabian Peninsula stamps as ink impressions on transparent backgrounds, matching the shared grammar defined in `2026-05-11-stamp-redesign-west-asia-south-america-design.md`, while preserving the region's brass-and-textile DNA through palette, border vocabulary, and per-country center motifs.

## Shared grammar (applies to all 7 stamps in scope)

The five constants from the cross-region grammar:

1. **Form** — flat ink impression on transparent canvas. No cloth-fiber, no metal-tooling texture, no brass-medallion substrate inside the silhouette. **The frame is an outline only — no interior fill, no card or paper surface inside the silhouette.** The negative space between ink lines is fully transparent on the rendered canvas; only the inked strokes (frame outline, border motifs, center line-art, text) are opaque. This is what makes the artifact read as a stamp pressed onto the booklet's parchment page, not a sticker glued onto it.
2. **Two-tone ink** — **brass-ochre** (primary) + **oxblood** (secondary accent). Two tones only.
3. **Rubber-stamp imperfection** — broken lines, dry-press patches, slight ink bleed at corners, faint off-register double-strike in oxblood, edge wear on the silhouette frame. Specified explicitly in every prompt.
4. **Background** — pure transparent. Generated against pure white outside the silhouette; post-processed to alpha. No parchment, no cream, no cloth backdrop.
5. **Script handling** — Latin country name in display serif inside the top arc of the frame. One short Arabic phrase (the country name in Arabic) in smaller weight near the bottom. The original prompts' thuluth / Diwani calligraphic flourish is **dropped** — multi-line Arabic calligraphy is the single thing image models mangle most reliably, and the cross-region grammar restricts native script to one short phrase.

## Region-specific decisions

**Frame silhouette — shared across all 7 countries.** A multi-lobed cusped Islamic arch cartouche (the silhouette of a Najdi palace doorway or mashrabiya panel). Deliberate choice to share the silhouette, mirroring the South America playbook:

- The seven Gulf states share a tight visual ecosystem; per-country silhouettes would feel arbitrary.
- A shared Islamic arch reads unmistakably "Arabian" without colliding with W. Asia / Levant's per-country shapes (the cusped arch is distinct from Iran's pointed mihrab).
- Per-country distinctiveness lives in the **border motif strip + center motif**, not the frame.

**Border motif vocabulary — sadu textile geometry, varied per country.** Promotes the sadu pattern from the original prompts' substrate (Bedouin cloth) into the border ornament strip, drawn flat as ink line-art:

- Saudi Arabia → Najdi stepped-diamond bands
- Yemen → Yemeni triangle-and-lozenge weave
- Oman → Omani chevron bands
- UAE → Emirati al-sadu wide-stripe geometry
- Qatar → Qatari diamond-and-cross repeats
- Bahrain → Bahraini banded zigzag
- Kuwait → Kuwaiti stepped-triangle weave

**Center motifs.** Six of the seven are preserved from the original prompts; Kuwait's "pearl-diving dhow" duplicated the UAE dhow, so Kuwait moves to the Kuwait Towers (instantly Kuwaiti, no other Gulf country has them).

| Country | Latin name | Arabic | Border (sadu sub-tradition) | Center motif |
|---|---|---|---|---|
| Saudi Arabia | SAUDI ARABIA | السعودية | Najdi stepped-diamond bands | At-Turaif Diriyah mud-tower beside a date palm |
| Yemen | YEMEN | اليمن | Yemeni triangle-and-lozenge weave | Socotra dragon-blood tree |
| Oman | OMAN | عُمان | Omani chevron bands | Khanjar dagger paired with a frankincense burner |
| UAE | UAE | الإمارات | Emirati al-sadu wide-stripe geometry | Dhow under sail |
| Qatar | QATAR | قطر | Qatari diamond-and-cross repeats | Falcon in profile silhouette |
| Bahrain | BAHRAIN | البحرين | Bahraini banded zigzag | Tree of Life (desert mesquite) |
| Kuwait | KUWAIT | الكويت | Kuwaiti stepped-triangle weave | Kuwait Towers (three water towers) |

UAE is rendered as **"UAE"** (not "UNITED ARAB EMIRATES") so it fits cleanly in the top arc of the cusped frame.

## Reusable per-country prompt template

Each prompt follows this shape. Country-specific fields fill in `{sadu_motif}`, `{center_motif}`, `{COUNTRY_LATIN}`, `{COUNTRY_ARABIC}`.

```
A passport stamp rendered as a flat ink impression on a transparent background. The frame is an outline only — no interior fill, no card or paper surface inside the silhouette. The negative space between ink lines is fully transparent; only the inked strokes are opaque. Multi-lobed cusped Islamic arch cartouche frame in brass-ochre ink with rubber-stamp imperfection — broken lines, dry-press patches, slight ink bleed at corners, faint off-register double-strike in oxblood, edge wear on the frame. Border: a thin strip of ink-line {sadu_motif}, drawn flat, no fills. Center: {center_motif} in flat brass-ochre ink silhouette and line-art with oxblood accent flourishes. Country name "{COUNTRY_LATIN}" in display serif inside the top arc of the frame; "{COUNTRY_ARABIC}" in smaller weight near the bottom. "NIEVES' KITCHEN · 2026" in the lower border band.

The stamp must fill the canvas — its outer border touches the canvas edges. No surrounding page, no paper margin, no canvas frame around the stamp. Render against a pure white background both outside the stamp's silhouette AND inside the frame between ink lines — this white will be removed to transparent in post on both sides. The interior of the frame must not be a card, paper, cream wash, halo, or any opaque shape behind the motifs; it is the same canvas white as the outside, so that only the ink strokes survive when the white is keyed out. No substrate texture inside the silhouette — no cloth weave, no paper fiber, no plaster, no leather, no metal sheet, no glaze. The result must read as a stamp pressed onto paper, not a sticker.

no human faces, no portrait sculpture, no ceremonial mask faces, no anthropomorphic deity faces, no religious figure faces painted on architecture, no neon colors, no pure black, no fluorescent saturation, no stock-photo realism, no AI-cliché smooth gradient, no text errors, no garbled native script, no woven cloth substrate, no brass medallion substrate, no parchment background, no cream background, no card fill inside the silhouette, no paper card inside the frame, no cream wash inside the silhouette, no opaque substrate behind the motifs, no sticker look, no die-cut card
```

The universal canvas + negative-prompt boilerplate is **not** written into the file — the user pastes it in manually before generating, same convention as Sections 4 and 12.

## Implementation scope

1. **Rewrite** Section 5 of `docs/plans/2026-05-06-stamp-final-prompts.md` using the template and per-country fields above. All seven country prompts are replaced.
2. **Add** a `> Redesigned 2026-05-11` callout at the top of Section 5 pointing to this spec, matching the pattern set by Sections 4 and 12.
3. **Check off** "Section 5 — Arabian Peninsula" under "Stamp redesign — remaining regions" in `TODO.md`.
4. **No code changes.** `lib/passport-stamps.ts` `CUSTOM_STAMPS` map remains as-is; only the underlying `public/stamps/*.webp` assets will be regenerated by the user from the new prompts.

## Out of scope

- Regenerating the actual WebP image assets (the user does this in their image generator with the prompts as input).
- Touching any other region's prompts (Section 3, 6, 7, 8, 9, 11, 13 remain on the redesign queue but are separate work items).
- Updating `docs/plans/2026-05-05-stamp-aesthetics-image-prompts.md` — the higher-level aesthetic spec — under this iteration. (The previous W. Asia / S. America iteration updated that file; this iteration leaves it for a single later sweep once all redesigns are landed.)
- Changing `CUSTOM_STAMPS`, `STATIC_PASSPORT_ASSETS`, or any TypeScript.
