# Stamp redesign — Africa (Sections 6, 7, 8, 9)

**Status:** Design approved 2026-05-11; prompts landed in `2026-05-06-stamp-final-prompts.md` 2026-05-11.
**Companion files:** `docs/plans/2026-05-06-stamp-final-prompts.md` (where the rewritten prompts will land), `docs/superpowers/specs/2026-05-11-stamp-redesign-west-asia-south-america-design.md` (precedent — shared grammar), `docs/superpowers/specs/2026-05-11-stamp-redesign-arabian-peninsula-design.md` (precedent — shared cartouche per region).

## Problem

Four African sections of `2026-05-06-stamp-final-prompts.md` still describe each stamp as a physical substrate the image model renders literally:

- **Section 6 (North Africa, 8 countries):** "rectangular fragment of a sun-bleached Saharan caravanserai wall" + fresco — generates plaster fragments.
- **Section 7 (West Africa, 14 countries):** "rectangular fragment of stamped artisan cloth" + block-print impression — generates cloth squares (closest to a stamp already, but still substrate-anchored).
- **Section 8 (East Africa, 10 countries):** "weathered-linen rectangle" + landscape wash + beaded medallion — generates linen swatches with beadwork.
- **Section 9 (Southern + Central Africa, 16 countries):** "square fragment of plastered painted house wall" + Ndebele pattern — generates wall fragments.

None of them read as ink stamps pressed onto the booklet's parchment page, breaking the anchor aesthetic established by Eastern + Western Europe, East Asia, North America, West Asia / Levant, Arabian Peninsula, and South America.

## Goal

Recast all 48 African stamps as ink impressions on transparent backgrounds, using the shared cross-region grammar, while preserving each region's distinct visual DNA through **palette pairing, cartouche silhouette, and per-country border-and-center motifs**. The four regions should read as a coherent continental family but be clearly distinguishable from each other at a glance.

## Shared grammar (applies to all 48 stamps in scope)

The five constants from the cross-region grammar:

1. **Form** — flat ink impression on transparent canvas. No plaster, no cloth, no linen, no wall fragment inside the silhouette. **The frame is an outline only — no interior fill, no card or paper surface inside the silhouette.** The negative space between ink lines is fully transparent; only the inked strokes (frame outline, border motifs, center line-art, text) are opaque.
2. **Two-tone ink** — primary + accent, varied per region (see below).
3. **Rubber-stamp imperfection** — broken lines, dry-press patches, slight ink bleed at corners, faint off-register double-strike in the accent ink, edge wear on the silhouette frame. Specified explicitly in every prompt.
4. **Background** — pure transparent. Generated against pure white outside *and inside* the silhouette; the white will be keyed out to alpha.
5. **Script handling** — Latin country name in display serif inside the top arc of the frame. One short native-script phrase (Arabic, Ge'ez, Tifinagh accent, etc.) in smaller weight near the bottom, where applicable. No multi-script stacks; pick the strongest single native script per country.

## Region-distinguishing decisions

Each of the four African sections gets a **distinct palette pair and cartouche silhouette**, chosen to evoke that region's strongest visual heritage while keeping all four legible as "African" at the continental scale.

| Section | Region | Primary ink | Accent ink | Cartouche silhouette | Border vocabulary source |
|---|---|---|---|---|---|
| 6 | North Africa | **Saharan ochre** | **Tuareg indigo** | Moorish horseshoe/keyhole arch | Amazigh / Berber / Tifinagh / hieroglyph |
| 7 | West Africa | **Kente gold** | **Kola-red** | Rounded rectangle with stepped corners (calabash-band) | Adire / Kente / Adinkra / Bògòlanfini |
| 8 | East Africa | **Savanna terracotta** | **Coptic jade** | Lobed Coptic-cross / shield cartouche | Coptic interlace / Maasai bead-grid / Imigongo |
| 9 | Southern + Central Africa | **Kuba umber** | **Ndebele cobalt** | Stepped-gable rectangle (Ndebele homestead silhouette) | Ndebele wall / Kuba cloth / Tchokwe / Basotho blanket |

**Why these pairings**

- **Continental family:** all four primaries are warm earth tones (ochre → gold → terracotta → umber) so the regions sit together on a passport spread without clashing.
- **Differentiation:** each accent introduces a *different* secondary hue — indigo (cool), kola-red (warm), jade (green), cobalt (saturated blue) — so each region has a visual signature.
- **Cartouche silhouettes** carry the load of "which region" at first glance: an arch reads Maghreb/Islamic, a stepped-corner rectangle reads West African textile, a lobed cross reads East African Christian/Maasai, a stepped-gable reads Southern African homestead.

## Section 6 — North Africa (8 countries)

**Cartouche:** Moorish horseshoe/keyhole arch.
**Ink:** Saharan ochre + Tuareg indigo accent.

| Country | Latin name | Native script | Border (motif source) | Center motif |
|---|---|---|---|---|
| Morocco | MOROCCO | المغرب | Beni Ourain rug diamonds + Khamsa-hand interlace | Tajine pot with conical lid, with a sprig of mint beside it |
| Algeria | ALGERIA | الجزائر | Kabyle pottery dot-and-zigzag bands | Casbah of Algiers — white stepped houses tumbling down a hillside |
| Tunisia | TUNISIA | تونس | Berber dotted-diamond and stylized fish motifs | Sidi Bou Said domed gate flanked by a single olive branch |
| Libya | LIBYA | ليبيا | Tuareg cross-and-tifinagh band | Leptis Magna Roman columns against the desert horizon |
| Egypt | EGYPT | مصر | Tifinagh band with hieroglyphic accent characters | Pyramid silhouette beside an obelisk (no Sphinx) |
| Sudan | SUDAN | السودان | Nubian stepped-geometric band | Meroë pyramids clustered on the desert floor |
| Mauritania | MAURITANIA | موريتانيا | Saharan caravan silhouette interlace | Chinguetti library towers |
| Western Sahara | WESTERN SAHARA | الصحراء الغربية | Sahrawi tent textile geometry | Saharan dune crest with a nomad tent silhouette |

## Section 7 — West Africa (14 countries)

**Cartouche:** rounded rectangle with stepped-corner (calabash-band) silhouette.
**Ink:** Kente gold + Kola-red accent.

| Country | Latin name | Secondary line | Border (motif source) | Center motif |
|---|---|---|---|---|
| Nigeria | NIGERIA | — | Adire indigo resist-dye geometry | Yoruba beaded medallion (abstract geometric, no face) |
| Ghana | GHANA | — | Kente strip-weave bands | Adinkra Sankofa bird symbol |
| Senegal | SENEGAL | — | Senegalese wax-print boubou geometry | Baobab tree silhouette |
| Mali | MALI | — | Bògòlanfini mud-cloth geometry | Djenné Great Mosque silhouette |
| Ivory Coast | IVORY COAST | Côte d'Ivoire | Korhogo painted-cloth motifs | Akan gold-weight (abstract geometric figurine) |
| Benin | BENIN | — | Beninese appliqué royal tapestry motifs | Dahomey leopard totem silhouette (in profile, no face) |
| Burkina Faso | BURKINA FASO | — | Faso danfani woven bands | Bobo abstract geometric carving (no face elements) |
| Togo | TOGO | — | Togolese strip-weave kente bands | Lake Togo pirogue silhouette |
| Niger | NIGER | — | Hausa indigo embroidery scrollwork | Agadez Tuareg cross pendant |
| Guinea | GUINEA | — | Manding textile geometry | Kora instrument (calabash and neck) |
| Sierra Leone | SIERRA LEONE | — | Gara indigo tie-dye motifs | Cotton Tree of Freetown silhouette |
| Gambia | GAMBIA | — | Gambian wax-print geometry | Wassu stone circles |
| Liberia | LIBERIA | — | Liberian country-cloth woven bands | Rice-pounding mortar with pestle |
| Guinea-Bissau | GUINEA-BISSAU | — | Pano di pinte hand-woven bands | Bijagós pirogue silhouette |

## Section 8 — East Africa (10 countries)

**Cartouche:** lobed Coptic-cross / shield cartouche (vertical lozenge with rounded shoulders and a slight cross-pointed top).
**Ink:** Savanna terracotta + Coptic jade accent.

| Country | Latin name | Native script | Border (motif source) | Center motif |
|---|---|---|---|---|
| Ethiopia | ETHIOPIA | ኢትዮጵያ | Coptic processional-cross interlace | Jebena coffee pot beside an abstract Coptic-cross medallion |
| Kenya | KENYA | — | Maasai bead-grid (red-white-jade lozenges) | Acacia tree with a giraffe in profile beneath it |
| Tanzania | TANZANIA | — | Maasai bead-grid (alternate triangle pattern) | Mt Kilimanjaro rising above the savanna |
| Uganda | UGANDA | — | Karamojong bead-zigzag + barkcloth dot rows | Mountain gorilla silhouette in mist (in profile, no facial detail) |
| Rwanda | RWANDA | U Rwanda | Imigongo triangular-spiral panels | Virunga volcanic peaks |
| Burundi | BURUNDI | Uburundi | Imigongo-adjacent spiral interlace | Royal drum silhouette on a low pedestal |
| Somalia | SOMALIA | الصومال | Henna scrollwork paired with Somali nomadic geometry | Camel caravan silhouette crossing a dune crest |
| Eritrea | ERITREA | ኤርትራ | Coptic-cross interlace paired with Tigrayan bead-rows | Massawa Red Sea dhow against a coastal horizon |
| Djibouti | DJIBOUTI | جيبوتي | Afar / Issa tribal bead-zigzag | Lake Assal salt-flat horizon with a single chimney-cone formation |
| South Sudan | SOUTH SUDAN | — | Nuer / Dinka scarification-pattern geometry | Sudd wetlands with a cattle camp and thatched tukul |

## Section 9 — Southern + Central Africa (16 countries)

**Cartouche:** stepped-gable rectangle (Ndebele homestead silhouette — a rectangle with a clear stepped triangulated top edge).
**Ink:** Kuba umber + Ndebele cobalt accent.

| Country | Latin name | Secondary line | Border (motif source) | Center motif |
|---|---|---|---|---|
| South Africa | SOUTH AFRICA | — | Ndebele wall stepped-geometric bands | Zulu beaded medallion (abstract geometric, no face) |
| Zimbabwe | ZIMBABWE | — | Shona/Ndebele stepped-zigzag bands | Great Zimbabwe stone bird |
| Mozambique | MOZAMBIQUE | — | Capulana print bold-geometric bands | Coastal dhow silhouette with palm leaning over it |
| Cameroon | CAMEROON | — | Tikar beaded-panel geometry | Bamileke juju hat (feathered headdress only — no face) |
| DRC | DR CONGO | République Démocratique du Congo | Kuba cloth grid geometry | Kuba royal cup (geometric-patterned wooden vessel) |
| Angola | ANGOLA | — | Tchokwe sand-drawing interlace | Kalandula Falls silhouette |
| Lesotho | LESOTHO | — | Basotho Seanamarena blanket geometry | Mokorotlo (Basotho conical straw hat) |
| Zambia | ZAMBIA | — | Tonga geometric bands | Victoria Falls silhouette |
| Botswana | BOTSWANA | — | Tswana basket coiled-geometric motifs | Okavango delta fan with reeds |
| Namibia | NAMIBIA | — | Himba red-ochre zigzag bands | Sossusvlei red dunes with a lone camel-thorn tree |
| Malawi | MALAWI | — | Yao / Chewa geometric bands | Lake Malawi dhow silhouette |
| Eswatini | ESWATINI | — | Reed-dance stepped-band geometry | Antelope and zebra in profile under a sausage tree (no face detail) |
| Republic of Congo | REPUBLIC OF CONGO | — | Kuba-adjacent grid geometry | River canoe silhouette |
| Gabon | GABON | — | Punu geometric weave bands | Okoumé tree silhouette |
| Chad | CHAD | — | Toubou Sahel geometric bands | Ennedi rock-arch formations |
| Central African Republic | CENTRAL AFRICAN REPUBLIC | — | Mbuti barkcloth dot-and-line motifs | Rainforest canopy (overlapping tree silhouettes) |

## Reusable per-country prompt template

Each prompt follows this shape. Country-specific fields fill in `{cartouche_shape}`, `{primary_ink}`, `{accent_ink}`, `{border_motif}`, `{center_motif}`, `{COUNTRY_LATIN}`, `{NATIVE_SCRIPT_OR_SECONDARY}`.

```
A passport stamp rendered as a flat ink impression on a transparent background. The frame is an outline only — no interior fill, no card or paper surface inside the silhouette. The negative space between ink lines is fully transparent; only the inked strokes are opaque. {cartouche_shape} frame in {primary_ink} ink with rubber-stamp imperfection — broken lines, dry-press patches, slight ink bleed at corners, faint off-register double-strike in {accent_ink}, edge wear on the frame. Border: a thin strip of ink-line {border_motif}, drawn flat, no fills. Center: {center_motif} in flat {primary_ink} ink silhouette and line-art with {accent_ink} accent flourishes. Country name "{COUNTRY_LATIN}" in display serif inside the top arc of the frame; "{NATIVE_SCRIPT_OR_SECONDARY}" in smaller weight near the bottom. "NIEVES' KITCHEN · 2026" in the lower border band.
```

The universal canvas + negative-prompt boilerplate is **not** written into the prompt file — the user pastes it in manually before generating, matching the convention set by Sections 4, 5, and 12.

## Implementation scope

1. **Rewrite** Sections 6, 7, 8, 9 of `docs/plans/2026-05-06-stamp-final-prompts.md` using the template and per-country fields above. All 48 country prompts are replaced.
2. **Add** a `> Redesigned 2026-05-11` callout at the top of each section pointing to this spec, matching the pattern set by Sections 4, 5, and 12.
3. **Check off** Sections 6, 7, 8, 9 under "Stamp redesign — remaining regions" in `TODO.md`.
4. **No code changes.** `lib/passport-stamps.ts` `CUSTOM_STAMPS` map remains as-is; only the underlying `public/stamps/*.webp` assets will be regenerated by the user from the new prompts.

## Out of scope

- Regenerating the actual WebP image assets (the user does this in their image generator).
- Touching any other region's prompts (Sections 3, 11, 13 remain on the redesign queue).
- Updating `docs/plans/2026-05-05-stamp-aesthetics-image-prompts.md` — left for a single sweep once all redesigns are landed.
- Changing `CUSTOM_STAMPS`, `STATIC_PASSPORT_ASSETS`, or any TypeScript.
