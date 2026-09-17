# Stamp redesign — Mexico + Central America + Caribbean + Oceania

**Status:** Design approved 2026-05-12.
**Companion files:** `docs/plans/2026-05-05-stamp-aesthetics-image-prompts.md` (original aesthetic spec), `docs/plans/2026-05-06-stamp-final-prompts.md` (where the rewritten prompts live), `docs/superpowers/specs/2026-05-11-stamp-redesign-west-asia-south-america-design.md` (precedent + shared grammar), `docs/superpowers/specs/2026-05-12-stamp-redesign-asia-and-north-america-design.md` (most recent prior rewrite).

## Problem

Two more regions in the plan still render as physical objects rather than ink impressions:

- **Section 11 (Mexico + Central America + Caribbean, 16 countries)** prompts describe *"a rectangular paper card with hand-cut, torn papel-picado edges"* with a *"hand-painted folk-art illustration"* center. The model renders a painted papel-picado card — paper edges, brushstroke fills, naive perspective — not a stamp impression. The palette ("cobalt + magenta + marigold + jade + vermilion on cream") also violates the two-tone discipline shared across the rest of the booklet.
- **Section 13 (Oceania, 9 countries)** prompts describe *"a rectangular fragment of bark cloth (tapa) with frayed natural-fiber edges"*. The model renders a piece of bark cloth, not a stamp. Same five-tone palette violation ("bark-brown + cream + ochre + ironbark-red + deep ocean-blue").

## Goal

Recast all 25 stamps (8 Mesoamerica + 8 Caribbean + 9 Oceania) in the shared ink-impression-on-transparent grammar established in the W. Asia / S. America rewrite. Preserve the country-distinctive iconography and border vocabulary already drafted in the current prompts — just promote them from "painted onto a paper/bark substrate" to "drawn as flat ink-line motifs inside an ink-impression cartouche."

Section 11 splits into two subfamilies. Section 13 stays as a single shared family.

## Why Section 11 splits

Mesoamerica and the Caribbean have meaningfully different cultural roots:

- **Mesoamerica** sits in the pre-Columbian temple / codex / volcanic-stone lineage (Maya, Aztec, Mixtec, Lenca) overlaid with Spanish colonial form.
- **Caribbean** sits in the Afro-Creole + Taíno + colonial-maritime lineage, with much stronger British / French / Spanish postal-stamp heritage from the 19th century.

A single cartouche across all 16 (the old "papel-picado paper card" was effectively this) flattens both. Splitting matches the precedent set in Africa (W / E / S split three ways) and South Asia / Central Asia (split two ways).

## Why Section 13 does not split

Oceania is the smallest region in the booklet (9 countries). The unifying Pacific maritime + geometric-textile idiom can carry all nine — Australia's Aboriginal dot-painting and New Zealand's Māori Kowhaiwhai differentiate themselves through *border vocabulary* the same way each Pacific island differentiates by its specific tapa pattern. Further splitting AU/NZ off from the Pacific Islands would fragment a region that already reads as the booklet's smallest, without adding visual clarity.

## Shared stamp grammar

Identical to the W. Asia / S. America spec — see `2026-05-11-stamp-redesign-west-asia-south-america-design.md` for the full statement. Briefly:

1. Flat ink impression on transparent canvas. Frame is outline only, no interior fill, no paper/cloth/plaster/bark substrate inside the silhouette.
2. Two ink colors only — primary does the heavy lifting (frame, script, dominant motifs); secondary is reserved for accents.
3. Rubber-stamp imperfection specified explicitly: broken lines, dry-press patches, slight ink bleed at corners, faint off-register double-strike in the secondary color, edge wear on the frame.
4. Country name in Latin display serif. Native script (or accented local spelling) appears once, as one short phrase, in a smaller weight — only where the country uses a distinct script or spelling worth differentiating.
5. Boilerplate (canvas instructions + universal negative prompt) is stripped from each prompt — the user pastes that in manually before generating.

## 11a. Mesoamerica — 8 countries

**Direction:** stepped-pyramid cartouche. A tall rectangle with terraced / stepped shoulders, echoing Maya / Aztec / Mixtec temple silhouettes (Tikal, Teotihuacán, Copán) without committing to one tradition. Closed silhouette reads as a stamp; stepped shoulders read unmistakably Mesoamerican.

**Palette:** cinnabar vermilion (primary ink) + jade green (secondary accent). The Maya royal palette — cinnabar pigment in royal tombs and codices, jade as the supreme precious material. Collapses the old five-tone palette (cobalt + magenta + marigold + jade + vermilion) to its two most culturally rooted tones. Vermilion does the frame, script, and central motif; jade is reserved for accent flourishes on a single secondary detail.

**Silhouette:** shared stepped-pyramid cartouche across all eight countries.

**Border pattern:** ink-line strip of country-specific textile / folk-craft pattern, drawn flat, no fills.

**Center motif:** country landmark or food-object in flat cinnabar-vermilion ink line-art with sparing jade-green accent. No folk-painting interiors, no perspective shading.

| Country | Border pattern | Center motif | Local accent (smaller) |
|---|---|---|---|
| Mexico | Papel-picado cut-out motif strip drawn as flat ink-line silhouettes | Volcanic-stone molcajete with tejolote pestle | MÉXICO |
| Guatemala | Maya huipil weaving geometry | Tikal pyramid silhouette with jungle canopy line at base | — |
| Belize | Garifuna drum-rhythm geometric stripes | Mayan stela (geometric carved relief, no face) | — |
| Honduras | Lenca black-on-cream pottery geometric | Copán stela cluster silhouette with jungle-canopy line | — |
| El Salvador | Salvadoran handloom textile geometric | Pupusa griddle (round comal with stacked pupusas) | — |
| Nicaragua | Nicaraguan hammock weave geometric | Granada cathedral silhouette (twin towers, central dome) | — |
| Costa Rica | Carreta oxcart painted-wheel radial geometric rosette | Painted carreta oxcart wheel front-on (rosette geometry) | — |
| Panama | Kuna mola reverse-applique geometric | Embera carved staff (geometric, no face) beside Pacific reef silhouette | PANAMÁ |

## 11b. Caribbean — 8 countries

**Direction:** scalloped oval with rope-twist outer edge. References the 19th-century colonial port-stamp / maritime customs idiom — historically correct for the islands' postal heritage and visually distinct from the Mesoamerican stepped-pyramid. The scallop + rope edge reads as maritime / official without sliding into kitsch-tropical.

**Palette:** colonial teal-blue (primary ink) + coral red (secondary accent). Deliberately inverts the Mesoamerican hot-primary / cool-secondary balance so the two subfamilies read as visually paired cousins, not duplicates. Teal-blue references British / French / Spanish colonial postage; coral-red brings tropical warmth as accent.

**Silhouette:** shared scalloped oval with rope-twist outer edge across all eight countries.

**Border pattern:** ink-line strip of country-specific motif, drawn flat, no fills.

**Center motif:** country landmark or food-object in flat colonial teal-blue ink line-art with sparing coral-red accent on a secondary detail.

| Country | Border pattern | Center motif | Local accent (smaller) |
|---|---|---|---|
| Cuba | Tropical-flora ink-line band (palm fronds, hibiscus, sugarcane stalks) | Havana street facade silhouette (colonial buildings, ironwork balconies) | — |
| Jamaica | Maroon textile geometric weave | Jerk-pit oil-drum silhouette with rising smoke wisp | — |
| Puerto Rico | Mundillo lace paired with Taíno petroglyph band | Old San Juan facade silhouette with wooden balconies | — |
| Trinidad & Tobago | Carnival mas-costume abstracted geometric (feather-fan rhythm and sequin-dot repeats) | Steel pan drum top-down (concentric playing surface) | — |
| Haiti | Jacmel naïve floral border | Vodou veve geometric ritual diagram | HAÏTI |
| Dominican Republic | Taíno geometric pattern | Zona Colonial casita silhouette (colonial townhouse with wrought-iron balcony) | REPÚBLICA DOMINICANA |
| Bahamas | Junkanoo confetti pattern (abstracted festival geometric shapes) | Conch shell (food-object) | — |
| Barbados | Sugarcane (stalks-and-leaves) repeated geometric strip | Rum still copper pot with coil | — |

## 13. Oceania — 9 countries

**Direction:** notched-corner rectangle cartouche. A rectangle whose four corners are cut into stepped notches, echoing the pan-Pacific geometric idiom found across tapa cloth (masi, siapo, ngatu), Aboriginal painting borders, Māori tāniko weaving, and Sepik carving. Reads as a stamp (closed rectangular silhouette); the notched corners read unmistakably Pacific. Distinct from the S. American oval, N. American horizontal / vertical postage, and Mesoamerican stepped-pyramid.

**Palette:** ironbark red (primary ink) + deep ocean-blue (secondary accent). Ironbark anchors the red-earth / Aboriginal-ochre / Pacific masi-cloth side; ocean-blue is the unifying Pacific maritime accent. Collapses the old five-tone palette (bark-brown + cream + ochre + ironbark-red + deep ocean-blue) to its two most regionally-grounded tones.

**Silhouette:** shared notched-corner rectangle across all nine countries.

**Border pattern:** ink-line strip of country-specific tapa / weaving / painting geometry, drawn flat, no fills.

**Center motif:** country landmark or food-object in flat ironbark-red ink line-art with sparing ocean-blue accent on a secondary detail.

| Country | Border pattern | Center motif | Local accent (smaller) |
|---|---|---|---|
| Australia | Aboriginal dot-painting geometric border (repeating dot-rhythm rows, no figurative content, no Dreamtime narrative imagery) | Uluru silhouette at horizon | — |
| New Zealand | Māori Kowhaiwhai scroll geometric pattern | Koru fern unfurl silhouette | AOTEAROA |
| Fiji | Fijian masi tapa cloth stamped geometric triangles | Kava bowl (tanoa, broad wooden bowl with legs) silhouette | Viti |
| Papua New Guinea | Bilum string-bag weave + Sepik geometric pattern | Sepik river canoe silhouette | — |
| Samoa | Samoan siapo tapa cloth stamped geometric repeats | Umu earth-oven cross-section (food-object) | — |
| Tonga | Tongan ngatu tapa cloth geometric pattern | Pandanus weaving silhouette | — |
| Vanuatu | Vanuatu bark-painting geometric island motifs | Yasur volcano silhouette with smoke wisp | — |
| Solomon Islands | Solomon Islands tribal weave geometric pattern | Shell-money strand silhouette | — |
| New Caledonia | Kanak woven basket geometric pattern | Coral reef silhouette (NOT Jeu de Tour totem — has face) | Nouvelle-Calédonie |

## Migration notes

### Image regeneration

WebPs in `public/stamps/` that need to be regenerated against the new grammar:

- `mexico.webp`, `jamaica.webp` — currently on the old papel-picado / folk-painting grammar.
- `australia.webp` — currently on the old bark-cloth grammar (and also lacks alpha — see below).
- Any other countries in Sections 11 and 13 not yet seeded inherit the new grammar by default.

### Transparency pipeline (root-caused this session)

`scripts/convert-image.sh` runs `cwebp` only — **it does not key out white**. It preserves whatever alpha channel exists in the source PNG. Audit of `public/stamps/*.webp` finds two distinct cohorts:

| Has alpha (transparent) ✓ | No alpha (opaque white background) ✗ |
|---|---|
| France, Italy, Spain, Portugal, China, Japan, Egypt, Morocco, Ethiopia, South Africa, Lebanon, Turkey, Mexico, Peru, Jamaica, and the W. Asia / Africa batches | **India, Pakistan, Afghanistan, Argentina, Australia** |

The "no alpha" cohort is exactly the most recent S/C Asia regenerations and the old physical-object stamps. The keying step (white → alpha) was done manually outside the repo for the W. Asia / S. America / Africa batches, but got skipped for the S/C Asia batch.

The prompt boilerplate clause *"this white will be removed to transparent in post on both sides"* is a promise that requires manual follow-through. Going forward:

- **Preferred:** ask the image generator for a native transparent PNG (no white fill, alpha channel preserved) before running the file through `cwebp`. This is what worked for the W. Asia / S. America / Africa batches.
- **Fallback:** if a generator returns a white-backed PNG, key white → alpha before staging with e.g. `magick input.png -fuzz 8% -transparent white output.png`, then let the pre-commit hook run `cwebp` as normal.
- **Verify after committing** with `sips -g hasAlpha public/stamps/<file>.webp` — output must read `hasAlpha: yes`.

The five existing no-alpha WebPs (`india.webp`, `pakistan.webp`, `afghanistan.webp`, `argentina.webp`, `australia.webp`) should be regenerated alongside this redesign so the booklet is alpha-consistent end-to-end. `argentina.webp` and `australia.webp` are also on old grammars and so were already on the regeneration list.

### Code changes

None. `lib/passport-stamps.ts` `CUSTOM_STAMPS` and `PassportAffordance` `STATIC_PASSPORT_ASSETS` entries stay as-is — only the underlying WebPs change.

## Out of scope

- Regenerating the actual WebP assets (the user does this in their image generator using the rewritten prompts).
- Touching any other region's prompts.
- Adding a keying step to `scripts/convert-image.sh` — flagged as a possible follow-up if Option B from the discussion above is needed, but not required if generator-side transparency works reliably.
- Re-rendering the tier badge prompts in `2026-05-05-tier-badges-image-prompts.md`.
