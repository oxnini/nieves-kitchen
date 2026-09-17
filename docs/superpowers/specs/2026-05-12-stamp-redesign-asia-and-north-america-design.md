# Stamp redesign — South Asia + Central Asia + North America

**Status:** Design approved 2026-05-12.
**Companion files:** `docs/plans/2026-05-05-stamp-aesthetics-image-prompts.md` (original aesthetic spec), `docs/plans/2026-05-06-stamp-final-prompts.md` (where the rewritten prompts live), `docs/superpowers/specs/2026-05-11-stamp-redesign-west-asia-south-america-design.md` (precedent + shared grammar).

## Problem

Two more regions in the plan still render as physical objects rather than ink impressions:

- **Section 3 (South Asia + Central Asia, 12 countries)** prompts describe *"a torn handmade-cotton-paper rectangle"* with a *"flat folk-painting"* center. The model renders a painted paper object — paper fiber, watercolour-style fills, painterly perspective — not a stamp.
- **Section 10 (North America, 2 countries)** prompts describe a *"1930s commemorative engraved postage stamp"* with *"subtle paper yellowing and edge wear"*. The idiom is right but the substrate language pulls the render back into "piece of paper" territory.

Both were previously on the "already good" list. Section 3 was always ambiguous. Section 10 is escalated specifically because the cast-iron skillet motif for USA is too kitsch-Americana, and the paper-yellowing substrate now reads inconsistent next to the transparent-ink stamps elsewhere in the booklet.

## Goal

Recast all 14 stamps in the shared ink-impression-on-transparent grammar established in the West Asia / South America rewrite. Preserve country-distinctive iconography and the border-pattern vocabulary already drafted for each country — just promote them from "painted onto a paper substrate" to "drawn as flat ink-line motifs inside an ink-impression cartouche."

Also: move **Afghanistan** out of the South Asia subfamily and into Central Asia. Its visual DNA (Persianate architecture, Baluch carpet motifs, Band-e Amir landscape, Persian/Pashto script) sits closer to Central Asia's Timurid / Suzani family than to the temple-arch family of the Indian subcontinent.

## Shared stamp grammar

Identical to the W. Asia / S. America spec — see `2026-05-11-stamp-redesign-west-asia-south-america-design.md` for the full statement. Briefly:

1. Flat ink impression on transparent canvas. Frame is outline only, no interior fill, no paper/cloth/plaster substrate inside the silhouette.
2. Two ink colors only — primary does the heavy lifting (frame, script, dominant motifs); secondary is reserved for accents.
3. Rubber-stamp imperfection specified explicitly: broken lines, dry-press patches, slight ink bleed at corners, faint off-register double-strike in the secondary color, edge wear on the frame.
4. Country name in Latin display serif. Native script appears once, as one short phrase, in a smaller weight.
5. Boilerplate (canvas instructions + universal negative prompt) is stripped from each prompt — the user pastes that in manually before generating.

## 3a. South Asia — 6 countries

**Direction:** cusped temple-arch rectangle cartouche. The cusped/lobed arch silhouette references the gopuram, mandapa, and torana arches that recur across South Asian temple and palace architecture, without committing to any single religious tradition. Reads unambiguously as a stamp while keeping the region's architectural rhythm.

**Palette:** madder red (primary ink) + deep indigo (secondary accent). Two tones only. Madder echoes the block-print and embroidery palette the region's textiles share; indigo references Ajrakh resist-dye, batik, and Nakshi Kantha.

**Silhouette:** shared cusped temple-arch rectangle across all six countries.

**Border pattern:** ink-line strip of the country-specific textile already drafted in the original prompt — Ajrakh, Phulkari, Nakshi Kantha, Sri Lankan batik, Dhaka weave, Bhutanese kira silk — drawn flat, no fills.

**Center motif:** country landmark (or signature silhouette) in flat madder-red line-art, with sparing indigo accent on a single secondary detail. No folk-painting interiors, no perspective shading.

| Country | Border textile pattern | Center motif | Native script (small) |
|---|---|---|---|
| India | Ajrakh block-print geometry | Hawa Mahal facade silhouette | भारत |
| Pakistan | Phulkari embroidery geometry | Badshahi Mosque (three domes + minaret pair) silhouette | پاکستان |
| Bangladesh | Nakshi Kantha running-stitch geometry | Sundarbans tiger silhouette in profile | বাংলাদেশ |
| Sri Lanka | Sri Lankan batik geometry | Sigiriya Lion Rock silhouette | ශ්‍රී ලංකා |
| Nepal | Dhaka geometric weave | Annapurna ridge with single prayer wheel | नेपाल |
| Bhutan | Bhutanese kira silk geometry | Tiger's Nest (Paro Taktsang) on cliff | འབྲུག་ཡུལ་ |

## 3b. Central Asia — 6 countries (Afghanistan moved in)

**Direction:** Timurid *pishtaq* pointed-arch cartouche. The pointed iwan arch is the signature of Samarkand, Bukhara, and Herat architecture and reads instantly as Silk Road / Persianate without slipping into generic mosque shorthand. Distinct enough from the South Asian cusped arch to make the regional split visible at booklet scale.

**Palette:** Suzani indigo (primary ink) + saffron ochre (secondary accent). Two tones only. Indigo references Suzani embroidery; ochre references Atlas ikat, Turkmen carpet, and steppe sun.

**Silhouette:** shared Timurid pishtaq pointed-arch cartouche across all six countries.

**Border pattern:** ink-line strip of the country-specific textile already drafted in the original prompt — Baluch carpet (Afghanistan), Shyrdak felt, Suzani, Turkmen carpet gul-medallion, Kyrgyz shyrdak felt, Atlas silk ikat — drawn flat, no fills.

**Center motif:** country landmark or signature silhouette in flat Suzani-indigo line-art with sparing saffron-ochre accent.

| Country | Border textile pattern | Center motif | Native script (small) |
|---|---|---|---|
| Afghanistan | Baluch carpet geometry | Band-e Amir lake reflected against limestone cliffs | افغانستان |
| Kazakhstan | Shyrdak felt geometry | Charyn canyon with single yurt on the steppe | Қазақстан |
| Uzbekistan | Suzani embroidery with floral medallion | Registan Square portal with central dome forward | Oʻzbekiston |
| Turkmenistan | Turkmen carpet gul-medallion | Akhal-Teke horse silhouette in profile | Türkmenistan |
| Kyrgyzstan | Kyrgyz shyrdak felt geometry | Single yurt silhouette against Tian Shan peaks | Кыргызстан |
| Tajikistan | Atlas silk ikat geometry | Pamir mountain peaks with winding valley road | Тоҷикистон |

## 10. North America — 2 countries

**Direction:** the engraved-postage-stamp idiom is preserved (it's culturally correct for the US/Canadian postal heritage and visually distinct from the folk-craft grammar everywhere else) but is recast as an ink impression on transparent. Drop the "paper yellowing and edge wear" substrate language. Replace USA's cast-iron skillet with a diner coffee mug + pie wedge — same "iconic American food culture" register, less kitsch-Americana, reads cleanly as flat line-art.

**Palette:**
- USA: sepia (primary) + barn-red (secondary).
- Canada: sepia (primary) + indigo (secondary). Butter-yellow accent from the original prompt is dropped to keep the two-tone discipline of the rest of the booklet.

**Silhouette:**
- USA: horizontal commemorative-postage cartouche.
- Canada: tall vertical commemorative-postage cartouche.

**Border pattern:**
- USA: Beaux-Arts laurel-and-star engraving with "3¢" denomination corner, drawn as flat ink lines.
- Canada: King George VI-era maple-leaf scroll engraving with "POSTAGE / POSTES" wordmark and a denomination corner.

**Center motif:**
- USA: diner coffee mug beside a wedge of pie on a small plate, sepia line-art, barn-red accent on the pie's lattice top.
- Canada: maple-syrup tap and hanging bucket on a sugar-maple trunk, with one falling drop, sepia line-art, indigo accent on the drop and bucket band.

Both stamps retain "Restrained, editorial — not Victorian-ornate" as a tone instruction.

## Migration notes

- Image assets in `public/stamps/` for India, Pakistan, Bangladesh, Sri Lanka, and the six Central Asian countries (added in commits `274382f`, `e8e867b`) were generated against the old paper/folk-painting grammar and should be regenerated after these prompts are approved.
- `united-states.webp` likewise needs regeneration.
- `lib/passport-stamps.ts` `CUSTOM_STAMPS` and `PassportAffordance` `STATIC_PASSPORT_ASSETS` entries stay as-is — only the underlying WebP changes.
