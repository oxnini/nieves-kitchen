# Per-region passport stamp aesthetics

**Author:** brainstormed with Claude · **Date:** 2026-05-05
**Status:** design locked, prompts to be generated

## Goal

Replace the existing "European brown-ink rubber-stamp" aesthetic that's currently applied uniformly to non-European countries (`public/stamps/*.webp`) with **per-region custom aesthetics** that feel authentic to each region's visual heritage while staying cohesive within a single passport booklet.

## Scope

**Out of scope (keep as-is):** all stamps under the **Western Europe** and **Eastern Europe** parent regions — the existing custom-engraved cartouche stamps are the booklet's anchor aesthetic.

**In scope:** 13 per-region aesthetics covering everything else.

## Cohesion rules

These hold across every stamp regardless of region.

### Format constants — always present

- Country name in **English** (Latin alphabet, display serif).
- Country name in **native script** where culturally meaningful (Han characters, Devanagari, Arabic, Ge'ez, Greek, Cyrillic, Tifinagh, Mkhedruli, Armenian, etc.).
- "**NIEVES' KITCHEN**" wordmark.
- Year ("**2026**" — update as needed when fresh stamps are minted).
- Real-paper / physical-artifact texture: imperfection, distress, ink-bleed, fiber, or stamp-press marks. Never a clean digital flat.

### Palette discipline

- **Default** = warm/earthy, parchment-friendly (sits comfortably on `#FDF6EC`).
- **Authenticity override** = signature regional colors (Chinese vermilion, Iznik cobalt, Caribbean turquoise, Ndebele saturated brights, Tropicalismo neon-leaning) are allowed when culturally non-negotiable.
- **Hard exclusions:**
  - No pure black (`#000`) — use warm-grey or dark-brown instead.
  - No neon / fluorescent.
  - No color combinations that fight the parchment background.

### Universal anti-prompts (apply to every stamp generation)

- **No human faces of any kind.**
- **No ceremonial mask faces** — even when traditionally face-shaped (Pende, Punu, Boruca, vejigante, hei-tiki, Bamileke). Replace with non-anthropomorphic alternatives.
- **No portrait sculpture or bronze head.** Replace with abstract artifact (stool, vessel, sun-disc, totem-pole-without-face).
- **No religious-icon faces painted on architecture** (Boudhanath stupa "Buddha eyes", Tiwanaku Sun-Gate deity face, Sphinx face, lamassu capitals, Moai face). Render landmark without those elements or swap landmark.
- **Animals in silhouette/profile are fine** (giraffe, gorilla, tiger, kangaroo, kiwi, falcon, oryx, etc.). Render in profile silhouette without facial detail emphasis.
- **Human figures, when unavoidable**, render as silhouette only, distant scale, no facial features (Christ the Redeemer = silhouette/back-view; Maasai/Bedouin/gaucho figures = silhouette).

---

## Region-by-region aesthetic spec

### 1. East Asia (China, Japan, South Korea, Taiwan, Hong Kong)

- **Direction:** Vermilion seal + sumi-ink landscape.
- **Silhouette:** Varied per country — China:tall rectangle (seal block); Japan:circle (hanko); Korea:soft-edged square; Taiwan:vertical oval; Hong Kong:horizontal banner.
- **Palette:** Vermilion (carved seal) + warm-grey sumi ink + muted turmeric/ochre accent.
- **Frame:** Thin vermilion border like a stamped frame; "NIEVES' KITCHEN · 2026" runs in this band.
- **Center:** Soft sumi-ink landscape illustration of country's iconic motif, with brush-and-ink imperfection (bleeds, dry-brush). A carved vermilion seal in **seal script (篆書)** bearing the country name overlays one corner.
- **Script:** Seal script for the chop; English for the prominent country line.

| Country | Landscape motif | Seal characters |
|---|---|---|
| China | Great Wall winding through misty mountains | 中國 |
| Japan | Mt. Fuji with cherry-blossom branch | 日本 |
| South Korea | Gyeongbokgung gate / Bukchon Hanok rooftops | 한국 / 韓國 |
| Taiwan | Taipei 101 with mist (kept modern per user) | 臺灣 |
| Hong Kong | Victoria Harbour junk-boat against skyline | 香港 |

**Punted:** Mongolia, North Korea — design only when recipes appear.

---

### 2. Southeast Asia (Thailand, Vietnam, Indonesia, Philippines, Malaysia, Singapore, Myanmar, Cambodia, Laos)

- **Direction:** Textile-bordered architectural relief.
- **Silhouette:** **Shared** — soft square with torn mulberry-paper / palm-leaf edges.
- **Palette:** Deep saffron + oxblood + indigo + palm-shadow green; each country pulls 2–3 of these depending on textile authenticity.
- **Frame:** Strip of country-specific textile pattern.
- **Center:** Carved-stone or wood-block silhouette of the country's iconic landmark in a single deep-ink color (stone-rubbing quality).
- **Script:** Latin + native script.

| Country | Textile (frame) | Architectural relief (center) |
|---|---|---|
| Thailand | Mudmee silk diamond | Wat Arun (Temple of Dawn) silhouette |
| Vietnam | Silk tassel / ikat stripe | Halong Bay junk against limestone karsts |
| Indonesia | Batik parang | Borobudur stupa profile |
| Philippines | Piña embroidery weave | Banaue rice terraces |
| Malaysia | Songket gold-thread | Kampung wood house |
| Singapore | Peranakan floral tile | Merlion + skyline silhouette |
| Myanmar | Acheik wave pattern | Bagan stupa field at dawn |
| Cambodia | Krama check | Angkor Wat towers |
| Laos | Lao silk weave | Pha That Luang stupa |

---

### 3. South Asia + Central Asia (India, Pakistan, Bangladesh, Sri Lanka, Nepal, Bhutan, Afghanistan, Kazakhstan, Uzbekistan, Turkmenistan, Kyrgyzstan, Tajikistan)

- **Direction:** Block-print textile border + flat folk-painting illustration.
- **Silhouette:** **Shared** — torn handmade-cotton-paper edge.
- **Palette:** Peacock blue + marigold + vermilion + henna-brown + cardamom-green, with **lapis cobalt** as Central Asia signature.
- **Frame:** Country-specific block-print or embroidery textile strip.
- **Center:** Country landmark rendered in **flat folk-art style** (Madhubani, Pattachitra, truck-art, thangka — applied to architecture/objects only, no figurative content with faces).
- **Script:** Latin + native script (Devanagari, Urdu nastaliq, Bengali, Sinhala, Cyrillic + Arabic).

| Country | Textile (frame) | Folk-art center |
|---|---|---|
| India | Ajrakh block-print (indigo + madder) | Hawa Mahal in Madhubani-folk style |
| Pakistan | Phulkari embroidery | Badshahi Mosque in truck-art folk style |
| Bangladesh | Nakshi Kantha embroidery | Sundarbans tiger silhouette in profile |
| Sri Lanka | Sri Lankan batik | Sigiriya Lion Rock in batik-painting style |
| Nepal | Dhaka geometric weave | **Annapurna ridge + prayer wheel** (Boudhanath swapped to avoid Buddha-eyes) |
| Bhutan | Kira silk pattern | Tiger's Nest monastery (architecture only, no thangka deities) |
| Afghanistan | Baluch carpet pattern | Band-e Amir lakes |
| Kazakhstan | Shyrdak felt pattern | Charyn canyon with a yurt + steppe |
| Uzbekistan | Suzani embroidery (floral medallion) | Registan Square, lapis-cobalt dome forward |
| Turkmenistan | Turkmen carpet (oxblood gul) | Akhal-Teke horse silhouette |
| Kyrgyzstan | Kyrgyz shyrdak felt | Yurt + Tian Shan mountains |
| Tajikistan | Atlas silk (rainbow ikat) | Pamir highlands |

---

### 4. West Asia / Levant (Turkey, Lebanon, Syria, Palestine, Jordan, Iran, Iraq, Armenia, Azerbaijan, Georgia, Cyprus)

- **Direction:** Iznik / Persian tile fragment.
- **Silhouette:** **Varied** per country (different tile-shape traditions).
- **Palette:** Cobalt blue + turquoise + cream + tomato red.
- **Frame:** Calligraphic band in native script wraps the tile edge.
- **Center:** Country's landmark/motif rendered in flat decorative tile-painting style.

| Country | Tile silhouette | Motif | Script |
|---|---|---|---|
| Turkey | Square Iznik | Hagia Sophia dome + tulip motifs | Ottoman Arabic |
| Lebanon | Octagonal | Cedar of Lebanon + Baalbek columns | Arabic |
| Syria | Hexagonal | Damascus Umayyad Mosque dome | Arabic |
| Palestine | Square | Dome of the Rock + olive branch | Arabic |
| Jordan | Octagonal | Petra Treasury facade | Arabic |
| Iran | Pointed-arch (mihrab) | **Naqsh-e Jahan dome** silhouette only (Persepolis lamassu omitted) | Persian nastaliq |
| Iraq | Square | Samarra spiral minaret | Arabic |
| Armenia | Cross-shaped (khachkar) | Khor Virap monastery + Mount Ararat | Armenian script |
| Azerbaijan | Diamond/lozenge | Maiden Tower + flame motif | Latin + Arabic accent |
| Georgia | Cross-shaped (Bagrati) | Gergeti Trinity Church + Caucasus | Mkhedruli script |
| Cyprus | Byzantine octagonal mosaic | Kourion ruins | Greek |

**Excluded from set:** Israel — out of scope per user's editorial decision.

---

### 5. Arabian Peninsula (Saudi Arabia, Yemen, Oman, UAE, Qatar, Bahrain, Kuwait)

- **Direction:** Sadu weaving + brass-tooled medallion.
- **Silhouette:** **Shared** — rectangular fragment of cloth with frayed-weave top/bottom edges.
- **Palette:** Oxblood + cream + brass-ochre + indigo + warm-grey (no pure black).
- **Frame:** Strip of Bedouin sadu weaving (bold geometric stripes).
- **Center:** Tooled brass/copper medallion in a single warm-ochre tone with deep engraving lines, no face.
- **Script:** Thuluth or Diwani calligraphic flourish (native + Latin).

| Country | Sadu pattern | Brass medallion center |
|---|---|---|
| Saudi Arabia | Najdi sadu | At-Turaif Diriyah mud-tower with date palm |
| Yemen | Yemeni geometric weave | Socotra dragon-blood tree |
| Oman | Omani sadu | Khanjar dagger + frankincense burner |
| UAE | Emirati sadu (red+green+black+white) | Dhow sail |
| Qatar | Qatari sadu | Falcon (silhouette, profile, no face detail) |
| Bahrain | Bahraini sadu | Tree of Life (400-year desert mesquite) |
| Kuwait | Kuwaiti sadu | Pearl-diving dhow at sunset |

**Religious-imagery rule:** no Mecca/Medina/Kaaba imagery for Saudi Arabia (cultural sensitivity).

---

### 6. North Africa (Egypt, Morocco, Tunisia, Algeria, Libya, Sudan, Mauritania, Western Sahara)

- **Direction:** Berber/Amazigh symbology + sun-bleached pigment fresco.
- **Silhouette:** **Varied** per country.
- **Palette:** Warm sand + Tuareg indigo + terracotta + faded saffron + ivory cream.
- **Frame:** Tribal Amazigh motifs (diamonds, fish, Khamsa hand, tifinagh script characters, dotted lines).
- **Center:** Country's icon rendered in flat sun-bleached pigment style — like a centuries-old fresco that's lost saturation to the desert sun.
- **Script:** Tifinagh + Arabic + Latin where appropriate.

| Country | Amazigh frame | Sun-bleached center |
|---|---|---|
| Morocco | Beni Ourain rug diamonds + Khamsa hand | **Tajine vessel** (food-object — hand-painted earthenware with conical lid) |
| Algeria | Kabyle pottery dot-and-zigzag | Casbah of Algiers (white stepped buildings) |
| Tunisia | Berber dotted diamond + fish | Sidi Bou Said (cobalt-and-white village) |
| Libya | Tuareg cross + tifinagh band | Leptis Magna Roman columns |
| Egypt | Tifinagh + hieroglyphic accent characters | **Pyramid + obelisk silhouette** (Sphinx omitted, no faces) |
| Sudan | Tifinagh + Nubian geometric | Meroë Nubian pyramids in desert |
| Mauritania | Moor blue-veil + Saharan caravan | Chinguetti library towers |
| Western Sahara | Sahrawi tent textile geometric | Saharan dune + nomad tent silhouette |

---

### 7. West Africa (Nigeria, Ghana, Senegal, Mali, Ivory Coast, Benin, Burkina Faso, Togo, Niger, Guinea, Sierra Leone, Gambia, Liberia, Guinea-Bissau)

- **Direction:** Adinkra-style stamped symbol + indigenous textile.
- **Silhouette:** **Shared** — rectangular fragment of stamped artisan cloth with frayed cotton edges + slightly off-register block-print impression.
- **Palette:** Indigo + ochre + mud-brown + kente gold + saturated red and green.
- **Frame:** Strip of country's signature textile.
- **Center:** Country-specific stamped/carved motif with carved-and-pressed quality — slightly off-register inks, hand-cut block textures.

| Country | Textile | Stamped center |
|---|---|---|
| Nigeria | Adire indigo resist-dye | **Abstract** geometric Yoruba beadwork medallion (no figurative content) |
| Ghana | Kente strip-weave (gold/red/green/black) | Adinkra Sankofa bird symbol |
| Senegal | Senegalese wax-print boubou | Baobab tree silhouette |
| Mali | Bògòlanfini mud-cloth | Djenné Great Mosque silhouette |
| Ivory Coast | Korhogo painted cloth | Akan gold-weight (abstract geometric figurine, no face) |
| Benin | Appliqué royal tapestry | **Royal Dahomey lion/leopard totem silhouette** *or* carved royal stool with geometric motif (bronze-head replaced) |
| Burkina Faso | Faso danfani | Carved Bobo abstract geometric motif (mask-as-face omitted) |
| Togo | Strip-weave kente | Lake Togo pirogue |
| Niger | Hausa indigo embroidery | Agadez Tuareg cross (silver pendant, geometric) |
| Guinea | Manding textile | Kora instrument |
| Sierra Leone | Gara indigo tie-dye | Cotton Tree of Freetown |
| Gambia | Wax print | Wassu stone circles |
| Liberia | Country cloth | Rice-pounding mortar |
| Guinea-Bissau | Pano di pinte | Bijagós pirogue |

**Punted:** Cape Verde (Portuguese-creole exception — design later if needed).

---

### 8. East Africa (Ethiopia, Kenya, Tanzania, Uganda, Rwanda, Burundi, Somalia, Eritrea, Djibouti, South Sudan)

- **Direction:** Beaded medallion + earth-pigment landscape.
- **Silhouette:** **Shared** — weathered-linen rectangle with subtly frayed corners (fabric scrap pinned to the page).
- **Palette:** Ochre + terracotta + savanna-gold + indigo, with disciplined beadwork brights (red, white, jade, sky-blue) used only inside the medallion.
- **Frame:** Subtle earth-pigment landscape backdrop, rough-textured.
- **Center:** Hand-beaded medallion in country's traditional beading style (geometric only, no faces). Backdrop = country's iconic landscape silhouette.

| Country | Beadwork medallion | Backdrop |
|---|---|---|
| Ethiopia | Coptic-cross beadwork (geometric) | **Jebena** coffee pot silhouette |
| Kenya | Maasai geometric beading (red/blue/white) | Maasai Mara acacia + giraffe in profile |
| Tanzania | Maasai beading (distinct pattern) | Mt Kilimanjaro |
| Uganda | Karamojong beadwork *or* stamped barkcloth | Mountain gorilla silhouette in mist |
| Rwanda | Imigongo geometric panel (black + cream + ochre) | Virunga volcanic peaks |
| Burundi | Imigongo-adjacent geometric | Royal Burundian drum |
| Somalia | Tribal beadwork + henna pattern | Laas Geel cave-painting silhouette *or* camel + dunes |
| Eritrea | Coptic-cross beadwork (geometric) | Massawa Red Sea dhow |
| Djibouti | Afar/Issa tribal beading | Lake Assal salt flats |
| South Sudan | Nuer/Dinka scarification-pattern beading | Sudd wetlands cattle camp + thatched tukul |

**Punted:** Madagascar (Austronesian outlier — design separately if recipes appear).

---

### 9. Southern + Central Africa (South Africa, Zimbabwe, Mozambique, Cameroon, DRC, Angola, Lesotho, Zambia, Botswana, Namibia, Malawi, Eswatini, Republic of Congo, Gabon, Chad, CAR)

- **Direction:** Bold geometric pattern + carved totem icon.
- **Silhouette:** **Shared** — square fragment with painted-wall texture (piece of plastered Ndebele house wall).
- **Palette:** Saturated cobalt + magenta + lemon-yellow + leaf-green + terracotta with strong black outlines (using warm-dark, not pure black) and cream backgrounds.
- **Frame/ground:** Country's signature geometric pattern.
- **Center:** Carved totem object (no mask faces — replaced with carved vessels, stools, animals in profile, or natural icons).

| Country | Geometric pattern | Carved totem / icon |
|---|---|---|
| South Africa | Ndebele wall geometry | Zulu beaded medallion (abstract) |
| Zimbabwe | Shona/Ndebele geometric | Great Zimbabwe stone bird |
| Mozambique | Capulana print | Coastal dhow |
| Cameroon | Tikar beaded panel | Bamileke juju hat (feathered headdress, no face) |
| DRC | Kuba cloth grid | **Kuba royal cup** (carved wooden vessel with geometric pattern) — Pende mask replaced |
| Angola | Tchokwe sand-drawing geometric | Kalandula Falls *or* Tchokwe carved geometric figure (no face) |
| Lesotho | Basotho blanket (Seanamarena pattern) | Mokorotlo conical hat |
| Zambia | Tonga geometric | Victoria Falls |
| Botswana | Tswana basket geometric | Okavango delta silhouette |
| Namibia | Himba red-ochre zigzag | Sossusvlei red dunes |
| Malawi | Yao/Chewa geometric | Lake Malawi dhow |
| Eswatini | Reed-dance pattern | Mlilwane wildlife (animal silhouettes only) |
| Republic of Congo | Kuba-adjacent geometric | River canoe |
| Gabon | Punu geometric weave | **Punu carved staff** *or* okoumé tree silhouette (mask replaced) |
| Chad | Toubou Sahel geometric | Ennedi rock formations |
| CAR | Mbuti barkcloth | Rainforest silhouette |

---

### 10. North America — USA + Canada

- **Direction:** Vintage engraved postage stamp aesthetic.
- **Silhouette:** **Varied** — historical stamp formats per country.
- **Discipline:** Engraved fine-line; two ink colors max per stamp.

| Country | Silhouette | Engraved center | Border ornament | Palette |
|---|---|---|---|---|
| USA | 1930s horizontal commemorative rectangle | **Cast-iron skillet** with fine-line engraving (possibly fried egg / biscuit inside) | Beaux-Arts laurel + star, "3¢" denomination corner | Sepia + barn-red |
| Canada | KGVI tall vertical rectangle | **Maple-syrup tap + bucket** on sugar-maple trunk, fine engraved bark/leaf | Maple-leaf scroll, "POSTAGE / POSTES" + denomination corner | Sepia + indigo + butter-yellow |

**Script:** USA = English ("UNITED STATES OF AMERICA"); Canada = bilingual ("CANADA · POSTES").

---

### 11. Mexico + Central America + Caribbean (Mexico, Guatemala, Belize, Honduras, El Salvador, Nicaragua, Costa Rica, Panama, Cuba, Jamaica, Haiti, Dominican Republic, Puerto Rico, Trinidad, Bahamas, Barbados)

- **Direction:** Papel picado / cut-textile frame + hand-painted folk illustration.
- **Silhouette:** **Shared** — rectangular paper card with hand-cut/torn papel-picado edges.
- **Palette:** Cobalt + magenta + marigold + jade + vermilion + cream + black outlines (using warm-dark).
- **Frame:** Cut-paper / woven / painted decorative strip in country tradition.
- **Center:** Hand-painted folk-art illustration with thick brushstrokes, naive flat perspective. Hand-lettered country name (Mexican rotulo / Cuban poster / Jamaican sign-painter typography).

| Country | Frame | Hand-painted center |
|---|---|---|
| Mexico | Papel picado | Molcajete (volcanic-stone mortar) |
| Guatemala | Maya huipil weaving | Tikal pyramid emerging from jungle mist |
| Cuba | Tropical-flora hand-painted | Havana street facade |
| Jamaica | Rasta-tricolor hand-painted band | Jerk-pit oil drum |
| Puerto Rico | **Mundillo lace + Taíno petroglyph** (vejigante mask replaced) | Old San Juan cobblestone facade |
| Trinidad & Tobago | Carnival mas-costume confetti | Steel pan drum |
| Haiti | Jacmel naïve floral | Voodoo veve symbol (geometric) + market scene (figures in silhouette only, no faces) |
| Panama | Kuna mola appliqué | Embera carved staff (geometric, no face) *or* Pacific reef |
| Belize | Garifuna pattern | Mayan stela (relief, no face) |
| Honduras | Lenca black-on-cream pottery | Copán ruins |
| El Salvador | Handloom textile | Pupusa griddle (food-object) |
| Nicaragua | Hammock weave | Granada cathedral |
| Costa Rica | **Carreta oxcart painted-wheel pattern** (Boruca mask replaced) | Painted carreta oxcart wheel |
| Dominican Republic | Taíno geometric | Zona Colonial casita |
| Bahamas | Junkanoo confetti | Conch shell (food-object) |
| Barbados | Sugarcane pattern | Rum still copper pot (food-object) |

---

### 12. South America (Peru, Argentina, Colombia, Chile, Bolivia, Brazil, Venezuela, Ecuador, Paraguay, Uruguay, Guyana, Suriname)

- **Direction:** Andean textile band + carved relief medallion.
- **Silhouette:** **Shared** — rectangular fragment of warp-faced striped Andean cloth (visually distinct from East Africa's plain linen).
- **Palette:** Terracotta + ochre + deep indigo + jade + magenta + gold.
- **Frame:** Country-specific indigenous textile geometry.
- **Center:** Pre-Columbian / landmark motif in carved-stone or embossed-gold relief (no face elements).

| Country | Textile frame | Carved/relief center |
|---|---|---|
| Peru | Quechua manta (saturated geometric) | Machu Picchu silhouette + Nazca-line motif |
| Argentina | Gaucho leather-tooled with silver studs | Mate gourd + bombilla straw (food-object) |
| Colombia | Wayuu mochila + coffee-region pattern | Burlap coffee sack + arabica branch |
| Chile | Mapuche geometric | **Atacama desert dunes** *or* copihue flower (Moai face omitted) |
| Bolivia | Aymara aguayo cloth | **Salar de Uyuni salt flat** with Andes peak reflection (Tiwanaku face omitted) |
| Venezuela | Wayuu + Andean | Angel Falls *or* arepa griddle |
| Ecuador | Otavalo textile | Cotopaxi volcano |
| Paraguay | Ñandutí lace | Lapacho tree |
| Uruguay | Gaucho leather + Charrúa geometric | Mate gourd |
| Guyana | Hammock weave + Amerindian pattern | Kaieteur Falls |
| Suriname | Marron textile + Caribbean-creole | Suriname jungle motif |

#### Brazil — deliberate exception

- **Aesthetic:** Tropicalismo poster.
- **Palette:** Banana yellow + hot pink + cobalt + mango orange + jade.
- **Style:** Bold flat saturated colors, modernist sans-serif typography, abstracted tropical flora (banana leaf, palm, hibiscus), late-60s/70s Tropicália movement vibe (Os Mutantes album cover energy, Cinema Novo poster).
- **Center:** Christ the Redeemer silhouette **back-view, no face**, distant skyline scale.
- **Frame:** Flat-color geometric blocks instead of textile band.
- **Reads as:** the booklet's one deliberate pop-art page among the woven-cloth pages.

---

### 13. Oceania (Australia, New Zealand, Fiji, PNG, Samoa, Tonga, Vanuatu, Solomon Islands, New Caledonia)

- **Direction:** Tapa cloth / earth-pigment painting + carved totem.
- **Silhouette:** **Shared** — rectangular fragment of bark cloth with frayed natural-fiber edges.
- **Palette:** Bark-brown + cream + ochre + ironbark-red + deep ocean-blue accent.
- **Frame:** Country's stamped/painted ground pattern (tapa, dot-painting, kowhaiwhai, bilum).
- **Center:** Country's iconic motif rendered as silhouette or abstract pattern (no faces).

| Country | Stamped/painted ground | Center motif |
|---|---|---|
| Australia | Aboriginal dot-painting (red ochre + white + charcoal) | Uluru silhouette *or* boomerang |
| New Zealand | Māori Kowhaiwhai scroll *or* taniko border | Koru fern unfurl *or* pounamu **abstract pendant** (NOT hei-tiki) |
| Fiji | Masi tapa cloth | Kava bowl |
| PNG | Bilum string-bag *or* Sepik geometric | Sepik river canoe |
| Samoa | Siapo tapa cloth | Ava (kava) bowl *or* umu earth oven |
| Tonga | Ngatu tapa cloth | Pandanus weaving *or* kava bowl |
| Vanuatu | Bark painting | Yasur volcano (Tanna island) |
| Solomon Islands | Tribal weave | Shell-money strand *or* canoe |
| New Caledonia | Kanak woven basket pattern | **Coral reef silhouette** (NOT Jeu de Tour totem — has face) |

---

## Image-generation prompt strategy

The most efficient approach: **one reusable prompt template per region**, with country-specific fields filled in. This keeps the aesthetic consistent within each region while making it trivial to add new countries.

### Universal negative prompt (append to every prompt)

```
no human faces, no portrait sculpture, no ceremonial mask faces, no anthropomorphic
deity faces, no religious figure faces painted on architecture, no neon colors, no
pure black, no fluorescent saturation, no stock-photo realism, no AI-cliché smooth
gradient, no text errors, no garbled native script
```

### Per-region prompt templates

**East Asia template:**
```
A passport stamp in the style of a literati album page. {SILHOUETTE} silhouette
with a thin vermilion border. Inside: a soft sumi-ink landscape of {LANDSCAPE},
brush-and-ink imperfection with bleeds and dry-brush texture, in warm-grey ink with
muted turmeric/ochre wash accents. Overlaid in one corner: a carved vermilion seal
in seal script (篆書) reading "{SEAL_CHARS}", with characteristic ink-press breaks
in the chop. Country name "{COUNTRY_LATIN}" in display serif at top, "NIEVES'
KITCHEN · 2026" in the vermilion border. Sits on warm parchment paper with subtle
fiber. {NEGATIVE_PROMPT}
```

**Southeast Asia template:**
```
A passport stamp shaped as a soft square with torn mulberry-paper edges. Border:
a strip of {TEXTILE_NAME} pattern in {2-3 PALETTE COLORS from saffron/oxblood/
indigo/palm-green}. Center: a carved-stone silhouette of {LANDMARK} in deep ink,
stone-rubbing quality. Country name "{COUNTRY_LATIN}" at top in display serif,
"{COUNTRY_NATIVE}" in native script below, "NIEVES' KITCHEN · 2026" in a thin
band. Real-paper texture, slight ink imperfection. {NEGATIVE_PROMPT}
```

**South + Central Asia template:**
```
A passport stamp shaped as a torn handmade-cotton-paper rectangle. Border: a
strip of {BLOCK-PRINT TEXTILE} pattern in {2-3 PALETTE: peacock-blue/marigold/
vermilion/henna-brown/cardamom-green/lapis-cobalt}. Center: a flat folk-painting
of {LANDMARK} rendered in {Madhubani / truck-art / Pattachitra / thangka} style,
applied to architecture only — no figurative content with faces. Hand-lettered
country name in display serif and {NATIVE SCRIPT}, "NIEVES' KITCHEN · 2026" in
a small band. Cotton-paper fiber texture. {NEGATIVE_PROMPT}
```

**West Asia / Levant template:**
```
A passport stamp rendered as a single fragment of glazed Iznik / Persian ceramic
tile. {TILE_SHAPE} silhouette. Calligraphic band running around the border in
{NATIVE SCRIPT (Arabic / nastaliq / Armenian / Mkhedruli / Greek)}. Center:
{LANDMARK_OR_MOTIF} painted in flat decorative tile style, in cobalt + turquoise
+ tomato-red on cream tile glaze. Country name "{COUNTRY_LATIN}" in display
serif. "NIEVES' KITCHEN · 2026" at the bottom. Subtle ceramic crackle and edge
chip for paper-artifact feel. {NEGATIVE_PROMPT}
```

**Arabian Peninsula template:**
```
A passport stamp shaped as a rectangular fragment of woven Bedouin cloth with
frayed-weave edges top and bottom. Border: a strip of {COUNTRY} sadu weaving in
oxblood + cream + warm-grey + indigo + brass-ochre. Center: a tooled brass /
copper medallion engraved with {MOTIF} — single warm-ochre tone with deep
engraving lines. Thuluth or Diwani calligraphic flourish in a corner with country
name in Arabic. "NIEVES' KITCHEN · 2026" in a small band. Cloth-fiber texture.
{NEGATIVE_PROMPT}
```

**North Africa template:**
```
A passport stamp shaped as {SILHOUETTE} — a fragment of a sun-bleached Saharan
caravanserai wall. Border: tribal Amazigh / Berber motifs ({DIAMONDS / FISH /
KHAMSA / TIFINAGH band}). Center: {MOTIF} rendered in flat sun-bleached pigment
style — like a centuries-old fresco that's lost saturation to the desert sun. In
warm sand + Tuareg indigo + terracotta + faded saffron + ivory cream. Tifinagh
+ Arabic + Latin scripts: country name and "NIEVES' KITCHEN · 2026". Weathered
plaster texture with crumbled edges. {NEGATIVE_PROMPT}
```

**West Africa template:**
```
A passport stamp shaped as a rectangular fragment of stamped artisan cloth, frayed
cotton edges, slightly off-register block-print impression on the surface. Border:
a strip of {COUNTRY_TEXTILE} weave / print. Center: {STAMPED_MOTIF} pressed into
the cloth in a single deep ink, with the imperfection of a hand-cut wood-block
print. Palette: indigo + ochre + mud-brown + kente gold + saturated red and green.
Country name in display serif and Latin script. "NIEVES' KITCHEN · 2026" in a
small band. Cotton-fiber texture. {NEGATIVE_PROMPT}
```

**East Africa template:**
```
A passport stamp shaped as a weathered-linen rectangle with subtly frayed corners,
like a fabric scrap pinned to the page. Backdrop: an earth-pigment landscape wash
of {LANDSCAPE} in ochre + terracotta + savanna-gold + indigo, rough-textured like
dried pigment on linen. Center: a hand-beaded medallion in {COUNTRY_BEADWORK}
style — abstract geometric beading in red/white/jade/sky-blue. Country name in
serif and {NATIVE SCRIPT}. "NIEVES' KITCHEN · 2026" small. Linen-fiber texture.
{NEGATIVE_PROMPT}
```

**Southern + Central Africa template:**
```
A passport stamp shaped as a square fragment of plastered painted house wall
(Ndebele homestead reference). Background: bold flat geometric pattern in
{COUNTRY_PATTERN} — saturated cobalt / magenta / lemon-yellow / leaf-green /
terracotta on cream, with strong warm-dark outlines (no pure black). Center:
{TOTEM_OBJECT} as a carved totem icon, no face elements. Country name in display
serif. "NIEVES' KITCHEN · 2026" in a small band. Plastered-wall texture.
{NEGATIVE_PROMPT}
```

**USA + Canada template:**
```
A passport stamp imitating a 1930s–50s engraved postage stamp. {SILHOUETTE}
format. Center: {FOOD_OBJECT} rendered in dense engraved fine-line cross-hatch.
Border: {ORNAMENT} engraving with denomination corner. Two ink colors only:
sepia + {ACCENT}. Country name in display serif: "{COUNTRY_LINE}". Subtle paper
yellowing and edge wear. Restrained, editorial — not Victorian-ornate.
{NEGATIVE_PROMPT}
```

**Mexico + Central America + Caribbean template:**
```
A passport stamp shaped as a rectangular paper card with hand-cut, torn
papel-picado edges. Border: a strip of {COUNTRY_FRAME} (papel picado / huipil
weaving / mola appliqué / Lenca pottery / tropical flora). Center: a
hand-painted folk-art illustration of {MOTIF}, thick brushstrokes, naive flat
perspective, in cobalt + magenta + marigold + jade + vermilion on cream with
warm-dark outlines (no pure black). Hand-lettered country name in
shop-sign-style display serif (Mexican rotulo / Cuban poster / Jamaican
sign-painter feel). "NIEVES' KITCHEN · 2026" in painted lettering.
{NEGATIVE_PROMPT}
```

**South America template:**
```
A passport stamp shaped as a rectangular fragment of warp-faced striped Andean
woven cloth. Border: a strip of {COUNTRY_TEXTILE} weave geometry. Center: a
carved-stone or embossed-gold relief silhouette of {MOTIF}. Palette: terracotta
+ ochre + deep indigo + jade + magenta + gold. Country name in serif and
native script. "NIEVES' KITCHEN · 2026" in a small band. Woven-cloth texture
visible through the relief.
{NEGATIVE_PROMPT}
```

**Brazil (exception) template:**
```
A passport stamp in Brazilian Tropicália / late-60s Cinema Novo poster style.
Bold flat saturated colors: banana yellow + hot pink + cobalt + mango orange +
jade. Modernist sans-serif typography for "BRASIL". Composition: Christ the
Redeemer silhouette (back view, no face, distant skyline scale) framed by
abstracted banana leaves and tropical flora in flat-color geometric blocks.
"NIEVES' KITCHEN · 2026" in modernist display lettering. Slightly grainy poster
print texture. Os Mutantes album cover energy.
{NEGATIVE_PROMPT}
```

**Oceania template:**
```
A passport stamp shaped as a rectangular fragment of bark cloth (tapa) with
frayed natural-fiber edges. Frame: a strip of {COUNTRY_PATTERN} (tapa stamp /
Aboriginal dot painting / Māori kowhaiwhai / bilum / Kanak weaving). Center:
{MOTIF} silhouette in single deep ink. Palette: bark-brown + cream + ochre +
ironbark-red + deep ocean-blue accent. Country name in serif and {NATIVE
SCRIPT}. "NIEVES' KITCHEN · 2026" in a small band. Bark-cloth fiber texture.
{NEGATIVE_PROMPT}
```

### Example fully-realized prompts

To validate the templates, here are fully-realized prompts for one country in each newly-defined region. These are the ones to test first — adjust the templates if these don't render as intended.

**Japan (East Asia):**
```
A passport stamp in the style of a literati album page. Circular hanko silhouette
with a thin vermilion border. Inside: a soft sumi-ink landscape of Mt. Fuji with
a cherry-blossom branch in foreground, brush-and-ink imperfection with bleeds and
dry-brush texture, in warm-grey ink with muted turmeric/ochre wash on the rising
sun behind Fuji. Overlaid in upper-right corner: a carved vermilion seal in seal
script (篆書) reading "日本", with characteristic ink-press breaks in the chop.
Country name "JAPAN" in display serif at top, "NIEVES' KITCHEN · 2026" in the
thin vermilion border. Sits on warm parchment paper with subtle fiber.
no human faces, no portrait sculpture, no ceremonial mask faces, no anthropomorphic
deity faces, no neon colors, no pure black, no fluorescent saturation, no AI-cliché
smooth gradient, no text errors, no garbled native script
```

**Thailand (Southeast Asia):**
```
A passport stamp shaped as a soft square with torn mulberry-paper edges. Border:
a strip of mudmee Thai silk diamond pattern in saffron and oxblood. Center: a
carved-stone silhouette of Wat Arun (Temple of Dawn) in deep ink, stone-rubbing
quality, with subtle suggestion of stupa relief. Country name "THAILAND" in
display serif at top, "ประเทศไทย" in Thai script below, "NIEVES' KITCHEN · 2026"
in a thin band at bottom. Real-paper texture, slight ink imperfection.
[+ universal negative prompt]
```

**Iran (West Asia / Levant):**
```
A passport stamp rendered as a single fragment of glazed Persian ceramic tile,
pointed-arch (mihrab) silhouette. Calligraphic band running around the border in
Persian nastaliq script. Center: Naqsh-e Jahan dome silhouette painted in flat
decorative tile style, in cobalt + turquoise + tomato-red on cream tile glaze.
Country name "IRAN" in display serif. "NIEVES' KITCHEN · 2026" at the bottom.
Subtle ceramic crackle and edge chip for paper-artifact feel.
[+ universal negative prompt]
```

**Morocco (North Africa):**
```
A passport stamp shaped as a fragment of a sun-bleached Saharan caravanserai wall
with crumbled edges. Border: Beni Ourain rug diamond patterns and Khamsa hand
motifs. Center: a hand-painted earthenware tajine with conical lid, decorated
with Moroccan zellige-tile pattern glaze, rendered in flat sun-bleached pigment
style — like a centuries-old fresco. In warm sand + Tuareg indigo + terracotta
+ faded saffron + ivory cream. Tifinagh + Arabic + Latin scripts: "MOROCCO" in
serif, "المغرب" in Arabic, "ⵍⵎⵖⵔⵉⴱ" in Tifinagh, and "NIEVES' KITCHEN · 2026"
small. Weathered plaster texture.
[+ universal negative prompt]
```

**Ghana (West Africa):**
```
A passport stamp shaped as a rectangular fragment of stamped artisan cloth with
frayed cotton edges and slightly off-register block-print impression. Border: a
strip of Ghanaian kente strip-weave pattern in gold, red, green, and warm-dark
(no pure black). Center: the Adinkra Sankofa bird symbol pressed into the cloth
in a single deep indigo ink, with the imperfection of a hand-cut wood-block print.
Country name "GHANA" in display serif, "NIEVES' KITCHEN · 2026" in a small band.
Cotton-fiber texture.
[+ universal negative prompt]
```

**Ethiopia (East Africa):**
```
A passport stamp shaped as a weathered-linen rectangle with subtly frayed corners,
like a fabric scrap pinned to the page. Backdrop: an earth-pigment landscape wash
of Ethiopian highlands in ochre + terracotta + savanna-gold + indigo, rough-
textured like dried pigment on linen. Center: a hand-beaded Coptic-cross medallion
in abstract geometric beading (red, white, jade, sky-blue) overlaid on a small
silhouette of a jebena coffee pot. Country name "ETHIOPIA" in display serif and
"ኢትዮጵያ" in Ge'ez script. "NIEVES' KITCHEN · 2026" small. Linen-fiber texture.
[+ universal negative prompt]
```

**South Africa (Southern + Central Africa):**
```
A passport stamp shaped as a square fragment of plastered painted house wall
(Ndebele homestead reference). Background: bold flat geometric Ndebele wall
pattern — saturated cobalt, magenta, lemon-yellow, leaf-green, terracotta on
cream, with strong warm-dark outlines (no pure black). Center: an abstract Zulu
beaded medallion in geometric pattern. Country name "SOUTH AFRICA" in display
serif. "NIEVES' KITCHEN · 2026" in a small band. Plastered-wall texture.
[+ universal negative prompt]
```

**USA (North America):**
```
A passport stamp imitating a 1930s commemorative engraved US postage stamp.
Horizontal rectangle format. Center: a cast-iron skillet with a fried egg inside,
rendered in dense engraved fine-line cross-hatch. Border: Beaux-Arts laurel and
star engraving with "3¢" denomination corner. Two ink colors only: sepia + barn-
red. Country name in display serif: "UNITED STATES OF AMERICA". Subtle paper
yellowing and edge wear. Restrained, editorial — not Victorian-ornate.
[+ universal negative prompt]
```

**Mexico (MX/CA/Caribbean):**
```
A passport stamp shaped as a rectangular paper card with hand-cut, torn papel-
picado edges. Border: a strip of papel picado pattern with cut-out floral and
geometric motifs. Center: a hand-painted folk-art illustration of a volcanic-
stone molcajete with tejolote (pestle), thick brushstrokes, naive flat
perspective, in cobalt + magenta + marigold + jade + vermilion on cream with
warm-dark outlines (no pure black). Hand-lettered country name "MÉXICO" in
shop-sign-style display serif (Mexican rotulo feel). "NIEVES' KITCHEN · 2026"
in painted lettering.
[+ universal negative prompt]
```

**Peru (South America):**
```
A passport stamp shaped as a rectangular fragment of warp-faced striped Andean
woven cloth. Border: a strip of Quechua manta weave geometry in saturated
terracotta, ochre, deep indigo, and jade. Center: a carved-stone relief silhouette
of Machu Picchu against a Nazca-line motif (hummingbird or condor). Palette:
terracotta + ochre + deep indigo + jade + magenta + gold. Country name "PERU" in
display serif at top, "PERÚ" with accent below. "NIEVES' KITCHEN · 2026" in
a small band. Woven-cloth texture visible through the relief.
[+ universal negative prompt]
```

**New Zealand (Oceania):**
```
A passport stamp shaped as a rectangular fragment of bark cloth (tapa) with
frayed natural-fiber edges. Frame: a strip of Māori Kowhaiwhai painted scroll
pattern (red, black-warm, white). Center: a koru fern unfurl silhouette in deep
indigo ink. Palette: bark-brown + cream + ochre + ironbark-red + deep ocean-
blue. Country name "NEW ZEALAND" in serif and "AOTEAROA" in Māori script.
"NIEVES' KITCHEN · 2026" in a small band. Bark-cloth fiber texture.
[+ universal negative prompt]
```

---

## Punted countries (design only when recipes appear)

- East Asia: Mongolia, North Korea
- East Africa: Madagascar
- West Africa: Cape Verde

When recipes for these appear, design a single-country exception aesthetic that respects the spirit of the closest region but honors the country's distinct heritage (Mongolian steppe = closer to Central Asia; Madagascar lamba = closer to SE Asia textile; Cape Verde = Portuguese-creole Atlantic island).

## Excluded from set

- **Israel** — out of scope per user's editorial decision; no stamp will be generated.

---

## Integration with codebase

When a stamp is generated and added:

1. Save as WebP at `public/stamps/<country-slug>.webp` (lowercase, hyphenated). The git pre-commit hook auto-converts staged PNG/JPG → WebP for files in `public/stamps/`.
2. Add the country → filename entry to `CUSTOM_STAMPS` in `lib/passport-stamps.ts`.
3. Add the asset path to `STATIC_PASSPORT_ASSETS` in `components/passport/PassportAffordance.tsx` so it gets prefetched on hover.
4. Source assets should be roughly 600×600 px to 800×800 px for the silhouette inscribed in a square — Next.js Image with `sizes` prop will handle responsive variants.

---

## Scope deliberately excluded from this design

- The **integration plan** (when to regenerate stamps, which to prioritize, batch order) — this lives in a separate writing-plans pass once the user has validated the example prompts.
- **Image generation tool choice** (Midjourney vs DALL-E vs Stable Diffusion vs Flux) — prompts above are tool-agnostic; the user will adapt syntax (`--ar`, `--no`, `--style raw`, etc.) to whichever tool they use.
- **Tier-progression visual variation** of stamps (the existing system in `lib/stamp-traits.ts` for procedurally-generated stamps) — the custom stamps replace the procedural ones for each country.
