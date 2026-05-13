# Final stamp prompts — ready to paste

Companion to `2026-05-05-stamp-aesthetics-image-prompts.md`. Each section below contains the country-specific core prompt only. **Append the universal boilerplate immediately below to every core prompt before sending to your image generator.**

**Skipped:** Southeast Asia (already done manually).
**Skipped:** Punted countries (Mongolia, North Korea, Madagascar, Cape Verde) and Israel (excluded).

---

## Universal boilerplate — append after every core prompt

Paste this block after the country-specific paragraph. It tells the generator to produce a transparent PNG (so the parchment wallpaper shows through on the site) and lists the universal things to avoid.

```
Output as a PNG with a native transparent background — alpha channel preserved, no white fill, no checkerboard texture, no opaque backdrop. The stamp must fill the canvas — its outer border touches the canvas edges. No surrounding page, no paper margin, no canvas frame around the stamp. Outside the stamp's silhouette is fully transparent. Inside the frame between the ink lines is also fully transparent — the interior must not be a card, paper, cream wash, halo, or any opaque shape behind the motifs. Only the inked strokes (frame outline, border motifs, center line-art, text) are opaque. No substrate texture inside the silhouette — no glaze, no ceramic crackle, no cloth weave, no paper fiber, no plaster, no bark. The result must read as a stamp pressed onto paper, not a sticker.

no human faces, no portrait sculpture, no ceremonial mask faces, no anthropomorphic deity faces, no religious figure faces painted on architecture, no neon colors, no pure black, no fluorescent saturation, no stock-photo realism, no AI-cliché smooth gradient, no text errors, no garbled native script, no woven cloth substrate, no fabric weave fill, no carved stone substrate, no parchment background, no cream background, no white background, no card fill inside the silhouette, no paper card inside the frame, no cream wash inside the silhouette, no opaque substrate behind the motifs, no sticker look, no die-cut card
```

**After saving the PNG to `public/stamps/<country>.png`:**
1. Verify alpha: `sips -g hasAlpha public/stamps/<country>.png` — must say `hasAlpha: yes`.
2. If it says `no`, key out the white: `magick public/stamps/<country>.png -fuzz 8% -transparent white public/stamps/<country>.png` (requires `brew install imagemagick`).
3. `git add` the PNG — the pre-commit hook converts it to WebP automatically.
4. After commit, verify the WebP: `sips -g hasAlpha public/stamps/<country>.webp` must also say `hasAlpha: yes`.

---

## 1. East Asia

### China
```
A passport stamp in the style of a literati album page. Tall rectangular seal-block silhouette with a thin vermilion border. Inside: a soft sumi-ink landscape of the Great Wall winding through misty mountains, brush-and-ink imperfection with bleeds and dry-brush texture, in warm-grey ink with muted turmeric/ochre wash accents. Overlaid in one corner: a carved vermilion seal in seal script (篆書) reading "中國", with characteristic ink-press breaks in the chop. Country name "CHINA" in display serif at top, "NIEVES' KITCHEN · 2026" in the vermilion border.

The stamp must fill the canvas — its outer border touches the canvas edges. No surrounding page, no paper margin, no canvas frame around the stamp. Render against a pure white background outside the stamp's border (no parchment, no cream, no wood, no any other background). Inside the stamp's border, the textural detail described (paper fiber, linen, cloth, plaster, bark, etc.) is desirable — this is the stamp's own surface, not the canvas.

no human faces, no portrait sculpture, no ceremonial mask faces, no anthropomorphic deity faces, no religious figure faces painted on architecture, no neon colors, no pure black, no fluorescent saturation, no stock-photo realism, no AI-cliché smooth gradient, no text errors, no garbled native script
```

### Japan
```
A passport stamp in the style of a literati album page. Circular hanko silhouette with a thin vermilion border. Inside: a soft sumi-ink landscape of Mt. Fuji with a cherry-blossom branch in foreground, brush-and-ink imperfection with bleeds and dry-brush texture, in warm-grey ink with muted turmeric/ochre wash on the rising sun behind Fuji. Overlaid in upper-right corner: a carved vermilion seal in seal script (篆書) reading "日本", with characteristic ink-press breaks in the chop. Country name "JAPAN" in display serif at top, "NIEVES' KITCHEN · 2026" in the thin vermilion border.

The stamp must fill the canvas — its outer border touches the canvas edges. No surrounding page, no paper margin, no canvas frame around the stamp. Render against a pure white background outside the stamp's border (no parchment, no cream, no wood, no any other background). Inside the stamp's border, the textural detail described (paper fiber, linen, cloth, plaster, bark, etc.) is desirable — this is the stamp's own surface, not the canvas.

no human faces, no portrait sculpture, no ceremonial mask faces, no anthropomorphic deity faces, no religious figure faces painted on architecture, no neon colors, no pure black, no fluorescent saturation, no stock-photo realism, no AI-cliché smooth gradient, no text errors, no garbled native script
```

### South Korea
```
A passport stamp in the style of a literati album page. Soft-edged square silhouette with a thin vermilion border. Inside: a soft sumi-ink landscape of Gyeongbokgung's Gwanghwamun gate with Bukchon Hanok rooftops layered behind, brush-and-ink imperfection with bleeds and dry-brush texture, in warm-grey ink with muted turmeric/ochre wash accents. Overlaid in one corner: a carved vermilion seal in seal script (篆書) reading "韓國", with characteristic ink-press breaks in the chop. Country name "SOUTH KOREA" in display serif at top, "한국" in Hangul below, "NIEVES' KITCHEN · 2026" in the vermilion border.

The stamp must fill the canvas — its outer border touches the canvas edges. No surrounding page, no paper margin, no canvas frame around the stamp. Render against a pure white background outside the stamp's border (no parchment, no cream, no wood, no any other background). Inside the stamp's border, the textural detail described (paper fiber, linen, cloth, plaster, bark, etc.) is desirable — this is the stamp's own surface, not the canvas.

no human faces, no portrait sculpture, no ceremonial mask faces, no anthropomorphic deity faces, no religious figure faces painted on architecture, no neon colors, no pure black, no fluorescent saturation, no stock-photo realism, no AI-cliché smooth gradient, no text errors, no garbled native script
```

### Taiwan
```
A passport stamp in the style of a literati album page. Vertical oval silhouette with a thin vermilion border. Inside: a soft sumi-ink landscape of Taipei 101 rising through mist (kept modern, sleek vertical profile), brush-and-ink imperfection with bleeds and dry-brush texture, in warm-grey ink with muted turmeric/ochre wash accents. Overlaid in one corner: a carved vermilion seal in seal script (篆書) reading "臺灣", with characteristic ink-press breaks in the chop. Country name "TAIWAN" in display serif at top, "NIEVES' KITCHEN · 2026" in the vermilion border.

The stamp must fill the canvas — its outer border touches the canvas edges. No surrounding page, no paper margin, no canvas frame around the stamp. Render against a pure white background outside the stamp's border (no parchment, no cream, no wood, no any other background). Inside the stamp's border, the textural detail described (paper fiber, linen, cloth, plaster, bark, etc.) is desirable — this is the stamp's own surface, not the canvas.

no human faces, no portrait sculpture, no ceremonial mask faces, no anthropomorphic deity faces, no religious figure faces painted on architecture, no neon colors, no pure black, no fluorescent saturation, no stock-photo realism, no AI-cliché smooth gradient, no text errors, no garbled native script
```

### Hong Kong
```
A passport stamp in the style of a literati album page. Horizontal banner silhouette with a thin vermilion border. Inside: a soft sumi-ink landscape of Victoria Harbour with a traditional junk-boat silhouetted against the skyline, brush-and-ink imperfection with bleeds and dry-brush texture, in warm-grey ink with muted turmeric/ochre wash accents. Overlaid in one corner: a carved vermilion seal in seal script (篆書) reading "香港", with characteristic ink-press breaks in the chop. Country name "HONG KONG" in display serif, "NIEVES' KITCHEN · 2026" in the vermilion border.

The stamp must fill the canvas — its outer border touches the canvas edges. No surrounding page, no paper margin, no canvas frame around the stamp. Render against a pure white background outside the stamp's border (no parchment, no cream, no wood, no any other background). Inside the stamp's border, the textural detail described (paper fiber, linen, cloth, plaster, bark, etc.) is desirable — this is the stamp's own surface, not the canvas.

no human faces, no portrait sculpture, no ceremonial mask faces, no anthropomorphic deity faces, no religious figure faces painted on architecture, no neon colors, no pure black, no fluorescent saturation, no stock-photo realism, no AI-cliché smooth gradient, no text errors, no garbled native script
```

---

## 3. South Asia + Central Asia

> Redesigned 2026-05-12 — see `docs/superpowers/specs/2026-05-12-stamp-redesign-asia-and-north-america-design.md`. These are ink-impression stamps on transparent backgrounds. The region splits into two visual subfamilies: South Asia (cusped temple-arch cartouche, madder-red + indigo ink) and Central Asia (Timurid pishtaq pointed-arch cartouche, Suzani indigo + saffron-ochre ink). Afghanistan is grouped with Central Asia. Append the universal canvas + negative-prompt boilerplate after each core prompt below before generating.

### 3a. South Asia (cusped temple-arch cartouche, madder-red + indigo)

### India
```
A passport stamp rendered as a flat ink impression on a transparent background. The frame is an outline only — no interior fill, no card or paper surface inside the silhouette. The negative space between ink lines is fully transparent; only the inked strokes are opaque. Cusped temple-arch rectangle cartouche frame in madder-red ink with rubber-stamp imperfection — broken lines, dry-press patches, slight ink bleed at corners, faint off-register double-strike in deep indigo, edge wear on the frame. Border: a thin strip of Ajrakh block-print geometry drawn as flat ink lines, no fills. Center: a Hawa Mahal facade silhouette in flat madder-red ink line-art with deep-indigo accent flourishes on the latticework. Country name "INDIA" in display serif inside the top arc of the frame; "भारत" in Devanagari in smaller weight below. "NIEVES' KITCHEN · 2026" in the lower border band.
```

### Pakistan
```
A passport stamp rendered as a flat ink impression on a transparent background. The frame is an outline only — no interior fill, no card or paper surface inside the silhouette. The negative space between ink lines is fully transparent; only the inked strokes are opaque. Cusped temple-arch rectangle cartouche frame in madder-red ink with rubber-stamp imperfection — broken lines, dry-press patches, slight ink bleed at corners, faint off-register double-strike in deep indigo, edge wear on the frame. Border: a thin strip of Phulkari embroidery geometry drawn as flat ink lines, no fills. Center: a Badshahi Mosque silhouette with three domes and a flanking minaret pair in flat madder-red ink line-art with deep-indigo accent on the dome finials. Country name "PAKISTAN" in display serif inside the top arc of the frame; "پاکستان" in Urdu nastaliq in smaller weight below. "NIEVES' KITCHEN · 2026" in the lower border band.
```

### Bangladesh
```
A passport stamp rendered as a flat ink impression on a transparent background. The frame is an outline only — no interior fill, no card or paper surface inside the silhouette. The negative space between ink lines is fully transparent; only the inked strokes are opaque. Cusped temple-arch rectangle cartouche frame in madder-red ink with rubber-stamp imperfection — broken lines, dry-press patches, slight ink bleed at corners, faint off-register double-strike in deep indigo, edge wear on the frame. Border: a thin strip of Nakshi Kantha running-stitch geometry drawn as flat ink lines, no fills. Center: a Sundarbans tiger silhouette in profile in flat madder-red ink line-art with deep-indigo accent on the stripes. Country name "BANGLADESH" in display serif inside the top arc of the frame; "বাংলাদেশ" in Bengali script in smaller weight below. "NIEVES' KITCHEN · 2026" in the lower border band.
```

### Sri Lanka
```
A passport stamp rendered as a flat ink impression on a transparent background. The frame is an outline only — no interior fill, no card or paper surface inside the silhouette. The negative space between ink lines is fully transparent; only the inked strokes are opaque. Cusped temple-arch rectangle cartouche frame in madder-red ink with rubber-stamp imperfection — broken lines, dry-press patches, slight ink bleed at corners, faint off-register double-strike in deep indigo, edge wear on the frame. Border: a thin strip of Sri Lankan batik geometry drawn as flat ink lines, no fills. Center: a Sigiriya Lion Rock silhouette in flat madder-red ink line-art with deep-indigo accent on the lion-paw entrance at the base. Country name "SRI LANKA" in display serif inside the top arc of the frame; "ශ්‍රී ලංකා" in Sinhala script in smaller weight below. "NIEVES' KITCHEN · 2026" in the lower border band.
```

### Nepal
```
A passport stamp rendered as a flat ink impression on a transparent background. The frame is an outline only — no interior fill, no card or paper surface inside the silhouette. The negative space between ink lines is fully transparent; only the inked strokes are opaque. Cusped temple-arch rectangle cartouche frame in madder-red ink with rubber-stamp imperfection — broken lines, dry-press patches, slight ink bleed at corners, faint off-register double-strike in deep indigo, edge wear on the frame. Border: a thin strip of Dhaka geometric weave drawn as flat ink lines, no fills. Center: an Annapurna ridge silhouette with a single prayer wheel in the foreground, all in flat madder-red ink line-art with deep-indigo accent on the prayer-wheel scrollwork — no Buddha eyes, no figurative content. Country name "NEPAL" in display serif inside the top arc of the frame; "नेपाल" in Devanagari in smaller weight below. "NIEVES' KITCHEN · 2026" in the lower border band.
```

### Bhutan
```
A passport stamp rendered as a flat ink impression on a transparent background. The frame is an outline only — no interior fill, no card or paper surface inside the silhouette. The negative space between ink lines is fully transparent; only the inked strokes are opaque. Cusped temple-arch rectangle cartouche frame in madder-red ink with rubber-stamp imperfection — broken lines, dry-press patches, slight ink bleed at corners, faint off-register double-strike in deep indigo, edge wear on the frame. Border: a thin strip of Bhutanese kira silk geometry drawn as flat ink lines, no fills. Center: a Tiger's Nest (Paro Taktsang) monastery silhouette clinging to a cliff in flat madder-red ink line-art with deep-indigo accent on the cliff face — no figurative content, no deity faces. Country name "BHUTAN" in display serif inside the top arc of the frame; "འབྲུག་ཡུལ་" in Tibetan script in smaller weight below. "NIEVES' KITCHEN · 2026" in the lower border band.
```

### 3b. Central Asia (Timurid pishtaq pointed-arch cartouche, Suzani indigo + saffron ochre)

### Afghanistan
```
A passport stamp rendered as a flat ink impression on a transparent background. The frame is an outline only — no interior fill, no card or paper surface inside the silhouette. The negative space between ink lines is fully transparent; only the inked strokes are opaque. Timurid pishtaq pointed-arch cartouche frame in Suzani indigo ink with rubber-stamp imperfection — broken lines, dry-press patches, slight ink bleed at corners, faint off-register double-strike in saffron ochre, edge wear on the frame. Border: a thin strip of Baluch carpet geometry drawn as flat ink lines, no fills. Center: a Band-e Amir lake silhouette reflected against limestone cliffs in flat Suzani-indigo ink line-art with saffron-ochre accent on the reflection line. Country name "AFGHANISTAN" in display serif inside the top arc of the frame; "افغانستان" in Persian/Pashto script in smaller weight below. "NIEVES' KITCHEN · 2026" in the lower border band.
```

### Kazakhstan
```
A passport stamp rendered as a flat ink impression on a transparent background. The frame is an outline only — no interior fill, no card or paper surface inside the silhouette. The negative space between ink lines is fully transparent; only the inked strokes are opaque. Timurid pishtaq pointed-arch cartouche frame in Suzani indigo ink with rubber-stamp imperfection — broken lines, dry-press patches, slight ink bleed at corners, faint off-register double-strike in saffron ochre, edge wear on the frame. Border: a thin strip of Shyrdak felt geometry drawn as flat ink lines, no fills. Center: a Charyn canyon silhouette with a single yurt in the foreground on the steppe, all in flat Suzani-indigo ink line-art with saffron-ochre accent on the yurt's smoke flap. Country name "KAZAKHSTAN" in display serif inside the top arc of the frame; "Қазақстан" in Cyrillic in smaller weight below. "NIEVES' KITCHEN · 2026" in the lower border band.
```

### Uzbekistan
```
A passport stamp rendered as a flat ink impression on a transparent background. The frame is an outline only — no interior fill, no card or paper surface inside the silhouette. The negative space between ink lines is fully transparent; only the inked strokes are opaque. Timurid pishtaq pointed-arch cartouche frame in Suzani indigo ink with rubber-stamp imperfection — broken lines, dry-press patches, slight ink bleed at corners, faint off-register double-strike in saffron ochre, edge wear on the frame. Border: a thin strip of Suzani embroidery geometry with a floral medallion motif drawn as flat ink lines, no fills. Center: a Registan Square portal with the central dome forward in flat Suzani-indigo ink line-art with saffron-ochre accent on the dome's tile pattern. Country name "UZBEKISTAN" in display serif inside the top arc of the frame; "Oʻzbekiston" in Latin script in smaller weight below. "NIEVES' KITCHEN · 2026" in the lower border band.
```

### Turkmenistan
```
A passport stamp rendered as a flat ink impression on a transparent background. The frame is an outline only — no interior fill, no card or paper surface inside the silhouette. The negative space between ink lines is fully transparent; only the inked strokes are opaque. Timurid pishtaq pointed-arch cartouche frame in Suzani indigo ink with rubber-stamp imperfection — broken lines, dry-press patches, slight ink bleed at corners, faint off-register double-strike in saffron ochre, edge wear on the frame. Border: a thin strip of Turkmen carpet gul-medallion geometry drawn as flat ink lines, no fills. Center: an Akhal-Teke horse silhouette in profile in flat Suzani-indigo ink line-art with saffron-ochre accent on mane and tail. Country name "TURKMENISTAN" in display serif inside the top arc of the frame; "Türkmenistan" in Latin script in smaller weight below. "NIEVES' KITCHEN · 2026" in the lower border band.
```

### Kyrgyzstan
```
A passport stamp rendered as a flat ink impression on a transparent background. The frame is an outline only — no interior fill, no card or paper surface inside the silhouette. The negative space between ink lines is fully transparent; only the inked strokes are opaque. Timurid pishtaq pointed-arch cartouche frame in Suzani indigo ink with rubber-stamp imperfection — broken lines, dry-press patches, slight ink bleed at corners, faint off-register double-strike in saffron ochre, edge wear on the frame. Border: a thin strip of Kyrgyz shyrdak felt geometry drawn as flat ink lines, no fills. Center: a single yurt silhouette against Tian Shan peaks in flat Suzani-indigo ink line-art with saffron-ochre accent on the yurt's tunduk (roof crown). Country name "KYRGYZSTAN" in display serif inside the top arc of the frame; "Кыргызстан" in Cyrillic in smaller weight below. "NIEVES' KITCHEN · 2026" in the lower border band.
```

### Tajikistan
```
A passport stamp rendered as a flat ink impression on a transparent background. The frame is an outline only — no interior fill, no card or paper surface inside the silhouette. The negative space between ink lines is fully transparent; only the inked strokes are opaque. Timurid pishtaq pointed-arch cartouche frame in Suzani indigo ink with rubber-stamp imperfection — broken lines, dry-press patches, slight ink bleed at corners, faint off-register double-strike in saffron ochre, edge wear on the frame. Border: a thin strip of Atlas silk ikat geometry drawn as flat ink lines, no fills. Center: Pamir mountain peaks in flat silhouette in Suzani-indigo ink line-art with saffron-ochre accent on a winding valley road. Country name "TAJIKISTAN" in display serif inside the top arc of the frame; "Тоҷикистон" in Cyrillic in smaller weight below. "NIEVES' KITCHEN · 2026" in the lower border band.
```

---

## 4. West Asia / Levant

> Redesigned 2026-05-11 — see `docs/superpowers/specs/2026-05-11-stamp-redesign-west-asia-south-america-design.md`. These are ink-impression stamps on transparent backgrounds (consular-cachet grammar with Iznik motifs), not glazed tiles. Append the universal canvas + negative-prompt boilerplate after each core prompt below before generating.

### Turkey
```
A passport stamp rendered as a flat ink impression on a transparent background. The frame is an outline only — no interior fill, no card or paper surface inside the silhouette. The negative space between ink lines is fully transparent; only the inked strokes are opaque. Square frame in cobalt-blue ink with rubber-stamp imperfection — broken lines, dry-press patches, slight ink bleed at corners, faint off-register double-strike in tomato-red, edge wear on the frame. Border: a thin strip of ink-line Iznik tulip-and-carnation chain motifs, drawn flat, no fills. Center: Hagia Sophia dome in flat cobalt ink silhouette and line-art with a tomato-red tulip flourish accent. Country name "TURKEY" in display serif inside the top arc of the frame; "Türkiye" in smaller weight near the bottom. "NIEVES' KITCHEN · 2026" in the lower border band.
```

### Lebanon
```
A passport stamp rendered as a flat ink impression on a transparent background. The frame is an outline only — no interior fill, no card or paper surface inside the silhouette. The negative space between ink lines is fully transparent; only the inked strokes are opaque. Octagonal frame in cobalt-blue ink with rubber-stamp imperfection — broken lines, dry-press patches, slight ink bleed at corners, faint off-register double-strike in tomato-red, edge wear on the frame. Border: a thin strip of ink-line cedar-cone and saz-leaf repeating motifs, drawn flat, no fills. Center: a Cedar of Lebanon between two Baalbek columns in flat cobalt ink silhouette and line-art with tomato-red accent details on the column capitals. Country name "LEBANON" in display serif inside the top arc of the frame; "لبنان" in smaller weight near the bottom. "NIEVES' KITCHEN · 2026" in the lower border band.
```

### Syria
```
A passport stamp rendered as a flat ink impression on a transparent background. The frame is an outline only — no interior fill, no card or paper surface inside the silhouette. The negative space between ink lines is fully transparent; only the inked strokes are opaque. Hexagonal frame in cobalt-blue ink with rubber-stamp imperfection — broken lines, dry-press patches, slight ink bleed at corners, faint off-register double-strike in tomato-red, edge wear on the frame. Border: a thin strip of ink-line Damascene arabesque scrollwork, drawn flat, no fills. Center: the Umayyad Mosque dome and its minaret in flat cobalt ink silhouette and line-art with a tomato-red star-accent at the dome's apex. Country name "SYRIA" in display serif inside the top arc of the frame; "سوريا" in smaller weight near the bottom. "NIEVES' KITCHEN · 2026" in the lower border band.
```

### Palestine
```
A passport stamp rendered as a flat ink impression on a transparent background. The frame is an outline only — no interior fill, no card or paper surface inside the silhouette. The negative space between ink lines is fully transparent; only the inked strokes are opaque. Square frame in cobalt-blue ink with rubber-stamp imperfection — broken lines, dry-press patches, slight ink bleed at corners, faint off-register double-strike in tomato-red, edge wear on the frame. Border: a thin strip of ink-line tatreez geometric embroidery motifs interleaved with olive-branch leaves, drawn flat, no fills. Center: the Dome of the Rock with an olive branch in the foreground, in flat cobalt ink silhouette and line-art with a tomato-red accent on the dome's crown. Country name "PALESTINE" in display serif inside the top arc of the frame; "فلسطين" in smaller weight near the bottom. "NIEVES' KITCHEN · 2026" in the lower border band.
```

### Jordan
```
A passport stamp rendered as a flat ink impression on a transparent background. The frame is an outline only — no interior fill, no card or paper surface inside the silhouette. The negative space between ink lines is fully transparent; only the inked strokes are opaque. Octagonal frame in cobalt-blue ink with rubber-stamp imperfection — broken lines, dry-press patches, slight ink bleed at corners, faint off-register double-strike in tomato-red, edge wear on the frame. Border: a thin strip of ink-line stepped-geometric Nabataean motifs, drawn flat, no fills. Center: the Petra Treasury facade carved into the rose-cliff in flat cobalt ink silhouette and line-art with tomato-red accent on the column flutes. Country name "JORDAN" in display serif inside the top arc of the frame; "الأردن" in smaller weight near the bottom. "NIEVES' KITCHEN · 2026" in the lower border band.
```

### Iran
```
A passport stamp rendered as a flat ink impression on a transparent background. The frame is an outline only — no interior fill, no card or paper surface inside the silhouette. The negative space between ink lines is fully transparent; only the inked strokes are opaque. Pointed-arch (mihrab) frame in cobalt-blue ink with rubber-stamp imperfection — broken lines, dry-press patches, slight ink bleed at corners, faint off-register double-strike in tomato-red, edge wear on the frame. Border: a thin strip of ink-line Safavid stylized-lotus-and-arabesque motifs, drawn flat, no fills. Center: the Naqsh-e Jahan dome silhouette in flat cobalt ink line-art with a tomato-red accent on the muqarnas tip. Country name "IRAN" in display serif inside the top arc of the frame; "ایران" in smaller weight near the bottom. "NIEVES' KITCHEN · 2026" in the lower border band.
```

### Iraq
```
A passport stamp rendered as a flat ink impression on a transparent background. The frame is an outline only — no interior fill, no card or paper surface inside the silhouette. The negative space between ink lines is fully transparent; only the inked strokes are opaque. Square frame in cobalt-blue ink with rubber-stamp imperfection — broken lines, dry-press patches, slight ink bleed at corners, faint off-register double-strike in tomato-red, edge wear on the frame. Border: a thin strip of ink-line Abbasid star-and-cross geometric motifs, drawn flat, no fills. Center: the Samarra spiral minaret in flat cobalt ink silhouette and line-art with a tomato-red accent at the summit. Country name "IRAQ" in display serif inside the top arc of the frame; "العراق" in smaller weight near the bottom. "NIEVES' KITCHEN · 2026" in the lower border band.
```

### Armenia
```
A passport stamp rendered as a flat ink impression on a transparent background. The frame is an outline only — no interior fill, no card or paper surface inside the silhouette. The negative space between ink lines is fully transparent; only the inked strokes are opaque. Khachkar (cross-shaped) frame in cobalt-blue ink with rubber-stamp imperfection — broken lines, dry-press patches, slight ink bleed at corners, faint off-register double-strike in tomato-red, edge wear on the frame. Border: a thin strip of ink-line interlaced eternity-knot khachkar motifs, drawn flat, no fills. Center: Khor Virap monastery with Mount Ararat rising behind it, in flat cobalt ink silhouette and line-art with a tomato-red accent on the monastery roof. Country name "ARMENIA" in display serif inside the top arc of the frame; "Հայաստան" in smaller weight near the bottom. "NIEVES' KITCHEN · 2026" in the lower border band.
```

### Azerbaijan
```
A passport stamp rendered as a flat ink impression on a transparent background. The frame is an outline only — no interior fill, no card or paper surface inside the silhouette. The negative space between ink lines is fully transparent; only the inked strokes are opaque. Diamond/lozenge frame in cobalt-blue ink with rubber-stamp imperfection — broken lines, dry-press patches, slight ink bleed at corners, faint off-register double-strike in tomato-red, edge wear on the frame. Border: a thin strip of ink-line buta (paisley) carpet motifs, drawn flat, no fills. Center: the Maiden Tower paired with a stylized flame motif beside it, in flat cobalt ink silhouette and line-art with the flame rendered in tomato-red accent. Country name "AZERBAIJAN" in display serif inside the top arc of the frame; "Azərbaycan" in smaller weight near the bottom. "NIEVES' KITCHEN · 2026" in the lower border band.
```

### Georgia
```
A passport stamp rendered as a flat ink impression on a transparent background. The frame is an outline only — no interior fill, no card or paper surface inside the silhouette. The negative space between ink lines is fully transparent; only the inked strokes are opaque. Bagrati (cross-shaped) frame in cobalt-blue ink with rubber-stamp imperfection — broken lines, dry-press patches, slight ink bleed at corners, faint off-register double-strike in tomato-red, edge wear on the frame. Border: a thin strip of ink-line grapevine-and-cross interlace motifs, drawn flat, no fills. Center: Gergeti Trinity Church with the Caucasus mountains behind it, in flat cobalt ink silhouette and line-art with a tomato-red accent on the church cupola. Country name "GEORGIA" in display serif inside the top arc of the frame; "საქართველო" in smaller weight near the bottom. "NIEVES' KITCHEN · 2026" in the lower border band.
```

### Cyprus
```
A passport stamp rendered as a flat ink impression on a transparent background. The frame is an outline only — no interior fill, no card or paper surface inside the silhouette. The negative space between ink lines is fully transparent; only the inked strokes are opaque. Byzantine octagonal frame in cobalt-blue ink with rubber-stamp imperfection — broken lines, dry-press patches, slight ink bleed at corners, faint off-register double-strike in tomato-red, edge wear on the frame. Border: a thin strip of ink-line Byzantine acanthus-scroll motifs, drawn flat, no fills. Center: the Kourion ruins — Greco-Roman columns and amphitheater stone — in flat cobalt ink silhouette and line-art with a tomato-red accent on a single column capital. Country name "CYPRUS" in display serif inside the top arc of the frame; "Κύπρος" in smaller weight near the bottom. "NIEVES' KITCHEN · 2026" in the lower border band.
```

---

## 5. Arabian Peninsula

> Redesigned 2026-05-11 — see `docs/superpowers/specs/2026-05-11-stamp-redesign-arabian-peninsula-design.md`. These are ink-impression stamps on transparent backgrounds (shared multi-lobed cusped Islamic arch cartouche with sadu textile borders), not Bedouin-cloth fragments. Append the universal canvas + negative-prompt boilerplate after each core prompt below before generating.

### Saudi Arabia
```
A passport stamp rendered as a flat ink impression on a transparent background. The frame is an outline only — no interior fill, no card or paper surface inside the silhouette. The negative space between ink lines is fully transparent; only the inked strokes are opaque. Multi-lobed cusped Islamic arch cartouche frame in brass-ochre ink with rubber-stamp imperfection — broken lines, dry-press patches, slight ink bleed at corners, faint off-register double-strike in oxblood, edge wear on the frame. Border: a thin strip of ink-line Najdi sadu stepped-diamond banded motifs, drawn flat, no fills. Center: the At-Turaif Diriyah mud-tower beside a date palm, in flat brass-ochre ink silhouette and line-art with oxblood accent flourishes on the palm fronds. Country name "SAUDI ARABIA" in display serif inside the top arc of the frame; "السعودية" in smaller weight near the bottom. "NIEVES' KITCHEN · 2026" in the lower border band.
```

### Yemen
```
A passport stamp rendered as a flat ink impression on a transparent background. The frame is an outline only — no interior fill, no card or paper surface inside the silhouette. The negative space between ink lines is fully transparent; only the inked strokes are opaque. Multi-lobed cusped Islamic arch cartouche frame in brass-ochre ink with rubber-stamp imperfection — broken lines, dry-press patches, slight ink bleed at corners, faint off-register double-strike in oxblood, edge wear on the frame. Border: a thin strip of ink-line Yemeni sadu triangle-and-lozenge weave motifs, drawn flat, no fills. Center: a Socotra dragon-blood tree with its umbrella crown of branches, in flat brass-ochre ink silhouette and line-art with oxblood accent flourishes on the canopy edges. Country name "YEMEN" in display serif inside the top arc of the frame; "اليمن" in smaller weight near the bottom. "NIEVES' KITCHEN · 2026" in the lower border band.
```

### Oman
```
A passport stamp rendered as a flat ink impression on a transparent background. The frame is an outline only — no interior fill, no card or paper surface inside the silhouette. The negative space between ink lines is fully transparent; only the inked strokes are opaque. Multi-lobed cusped Islamic arch cartouche frame in brass-ochre ink with rubber-stamp imperfection — broken lines, dry-press patches, slight ink bleed at corners, faint off-register double-strike in oxblood, edge wear on the frame. Border: a thin strip of ink-line Omani sadu chevron-band motifs, drawn flat, no fills. Center: a khanjar dagger paired with a frankincense burner, in flat brass-ochre ink silhouette and line-art with oxblood accent flourishes on the dagger hilt and the burner's smoke curls. Country name "OMAN" in display serif inside the top arc of the frame; "عُمان" in smaller weight near the bottom. "NIEVES' KITCHEN · 2026" in the lower border band.
```

### UAE
```
A passport stamp rendered as a flat ink impression on a transparent background. The frame is an outline only — no interior fill, no card or paper surface inside the silhouette. The negative space between ink lines is fully transparent; only the inked strokes are opaque. Multi-lobed cusped Islamic arch cartouche frame in brass-ochre ink with rubber-stamp imperfection — broken lines, dry-press patches, slight ink bleed at corners, faint off-register double-strike in oxblood, edge wear on the frame. Border: a thin strip of ink-line Emirati al-sadu wide-stripe geometric motifs, drawn flat, no fills. Center: a traditional dhow under sail on a horizon line, in flat brass-ochre ink silhouette and line-art with oxblood accent flourishes on the sail rigging. Country name "UAE" in display serif inside the top arc of the frame; "الإمارات" in smaller weight near the bottom. "NIEVES' KITCHEN · 2026" in the lower border band.
```

### Qatar
```
A passport stamp rendered as a flat ink impression on a transparent background. The frame is an outline only — no interior fill, no card or paper surface inside the silhouette. The negative space between ink lines is fully transparent; only the inked strokes are opaque. Multi-lobed cusped Islamic arch cartouche frame in brass-ochre ink with rubber-stamp imperfection — broken lines, dry-press patches, slight ink bleed at corners, faint off-register double-strike in oxblood, edge wear on the frame. Border: a thin strip of ink-line Qatari sadu diamond-and-cross repeating motifs, drawn flat, no fills. Center: a falcon in profile silhouette perched on a gauntlet rest, in flat brass-ochre ink line-art with oxblood accent flourishes on the wing feathers and jesses. Country name "QATAR" in display serif inside the top arc of the frame; "قطر" in smaller weight near the bottom. "NIEVES' KITCHEN · 2026" in the lower border band.
```

### Bahrain
```
A passport stamp rendered as a flat ink impression on a transparent background. The frame is an outline only — no interior fill, no card or paper surface inside the silhouette. The negative space between ink lines is fully transparent; only the inked strokes are opaque. Multi-lobed cusped Islamic arch cartouche frame in brass-ochre ink with rubber-stamp imperfection — broken lines, dry-press patches, slight ink bleed at corners, faint off-register double-strike in oxblood, edge wear on the frame. Border: a thin strip of ink-line Bahraini sadu banded zigzag motifs, drawn flat, no fills. Center: the Tree of Life (the 400-year-old desert mesquite) standing alone on flat desert ground, in flat brass-ochre ink silhouette and line-art with oxblood accent flourishes on the canopy edges. Country name "BAHRAIN" in display serif inside the top arc of the frame; "البحرين" in smaller weight near the bottom. "NIEVES' KITCHEN · 2026" in the lower border band.
```

### Kuwait
```
A passport stamp rendered as a flat ink impression on a transparent background. The frame is an outline only — no interior fill, no card or paper surface inside the silhouette. The negative space between ink lines is fully transparent; only the inked strokes are opaque. Multi-lobed cusped Islamic arch cartouche frame in brass-ochre ink with rubber-stamp imperfection — broken lines, dry-press patches, slight ink bleed at corners, faint off-register double-strike in oxblood, edge wear on the frame. Border: a thin strip of ink-line Kuwaiti sadu stepped-triangle weave motifs, drawn flat, no fills. Center: the Kuwait Towers (the three tapered water towers, two crowned with spheres), in flat brass-ochre ink silhouette and line-art with oxblood accent flourishes on the sphere banding. Country name "KUWAIT" in display serif inside the top arc of the frame; "الكويت" in smaller weight near the bottom. "NIEVES' KITCHEN · 2026" in the lower border band.
```

---

## 6. North Africa

> Redesigned 2026-05-11 — see `docs/superpowers/specs/2026-05-11-stamp-redesign-africa-design.md`. These are ink-impression stamps on transparent backgrounds (Moorish horseshoe arch cartouche, Saharan ochre + Tuareg indigo ink), not plaster wall fragments. Append the universal canvas + negative-prompt boilerplate after each core prompt below before generating.

### Morocco
```
A passport stamp rendered as a flat ink impression on a transparent background. The frame is an outline only — no interior fill, no card or paper surface inside the silhouette. The negative space between ink lines is fully transparent; only the inked strokes are opaque. Moorish horseshoe arch (keyhole) cartouche frame in Saharan ochre ink with rubber-stamp imperfection — broken lines, dry-press patches, slight ink bleed at corners, faint off-register double-strike in Tuareg indigo, edge wear on the frame. Border: a thin strip of ink-line Beni Ourain rug diamond geometry interleaved with Khamsa-hand motifs, drawn flat, no fills. Center: a tajine pot with conical lid beside a sprig of mint, in flat Saharan ochre ink silhouette and line-art with Tuareg indigo accent flourishes on the lid's finial and the mint leaves. Country name "MOROCCO" in display serif inside the top arc of the frame; "المغرب" in smaller weight near the bottom. "NIEVES' KITCHEN · 2026" in the lower border band.
```

### Algeria
```
A passport stamp rendered as a flat ink impression on a transparent background. The frame is an outline only — no interior fill, no card or paper surface inside the silhouette. The negative space between ink lines is fully transparent; only the inked strokes are opaque. Moorish horseshoe arch (keyhole) cartouche frame in Saharan ochre ink with rubber-stamp imperfection — broken lines, dry-press patches, slight ink bleed at corners, faint off-register double-strike in Tuareg indigo, edge wear on the frame. Border: a thin strip of ink-line Kabyle pottery dot-and-zigzag bands, drawn flat, no fills. Center: the Casbah of Algiers — white stepped houses tumbling down a hillside — in flat Saharan ochre ink silhouette and line-art with Tuareg indigo accent flourishes on the doorways and shutters. Country name "ALGERIA" in display serif inside the top arc of the frame; "الجزائر" in smaller weight near the bottom. "NIEVES' KITCHEN · 2026" in the lower border band.
```

### Tunisia
```
A passport stamp rendered as a flat ink impression on a transparent background. The frame is an outline only — no interior fill, no card or paper surface inside the silhouette. The negative space between ink lines is fully transparent; only the inked strokes are opaque. Moorish horseshoe arch (keyhole) cartouche frame in Saharan ochre ink with rubber-stamp imperfection — broken lines, dry-press patches, slight ink bleed at corners, faint off-register double-strike in Tuareg indigo, edge wear on the frame. Border: a thin strip of ink-line Berber dotted-diamond and stylized fish motifs, drawn flat, no fills. Center: the Sidi Bou Said domed gate flanked by a single olive branch, in flat Saharan ochre ink silhouette and line-art with Tuareg indigo accent flourishes on the gate dome and olive leaves. Country name "TUNISIA" in display serif inside the top arc of the frame; "تونس" in smaller weight near the bottom. "NIEVES' KITCHEN · 2026" in the lower border band.
```

### Libya
```
A passport stamp rendered as a flat ink impression on a transparent background. The frame is an outline only — no interior fill, no card or paper surface inside the silhouette. The negative space between ink lines is fully transparent; only the inked strokes are opaque. Moorish horseshoe arch (keyhole) cartouche frame in Saharan ochre ink with rubber-stamp imperfection — broken lines, dry-press patches, slight ink bleed at corners, faint off-register double-strike in Tuareg indigo, edge wear on the frame. Border: a thin strip of ink-line Tuareg cross motifs interleaved with a tifinagh script band, drawn flat, no fills. Center: Leptis Magna Roman columns rising against the desert horizon, in flat Saharan ochre ink silhouette and line-art with Tuareg indigo accent flourishes on the column capitals. Country name "LIBYA" in display serif inside the top arc of the frame; "ليبيا" in smaller weight near the bottom. "NIEVES' KITCHEN · 2026" in the lower border band.
```

### Egypt
```
A passport stamp rendered as a flat ink impression on a transparent background. The frame is an outline only — no interior fill, no card or paper surface inside the silhouette. The negative space between ink lines is fully transparent; only the inked strokes are opaque. Moorish horseshoe arch (keyhole) cartouche frame in Saharan ochre ink with rubber-stamp imperfection — broken lines, dry-press patches, slight ink bleed at corners, faint off-register double-strike in Tuareg indigo, edge wear on the frame. Border: a thin strip of ink-line tifinagh script paired with hieroglyphic accent characters, drawn flat, no fills. Center: a pyramid silhouette beside a single obelisk (no Sphinx, no faces), in flat Saharan ochre ink silhouette and line-art with Tuareg indigo accent flourishes on the obelisk tip and the pyramid's apex. Country name "EGYPT" in display serif inside the top arc of the frame; "مصر" in smaller weight near the bottom. "NIEVES' KITCHEN · 2026" in the lower border band.
```

### Sudan
```
A passport stamp rendered as a flat ink impression on a transparent background. The frame is an outline only — no interior fill, no card or paper surface inside the silhouette. The negative space between ink lines is fully transparent; only the inked strokes are opaque. Moorish horseshoe arch (keyhole) cartouche frame in Saharan ochre ink with rubber-stamp imperfection — broken lines, dry-press patches, slight ink bleed at corners, faint off-register double-strike in Tuareg indigo, edge wear on the frame. Border: a thin strip of ink-line Nubian stepped-geometric bands, drawn flat, no fills. Center: the Meroë Nubian pyramids clustered on the desert floor, in flat Saharan ochre ink silhouette and line-art with Tuareg indigo accent flourishes on the pyramid tips. Country name "SUDAN" in display serif inside the top arc of the frame; "السودان" in smaller weight near the bottom. "NIEVES' KITCHEN · 2026" in the lower border band.
```

### Mauritania
```
A passport stamp rendered as a flat ink impression on a transparent background. The frame is an outline only — no interior fill, no card or paper surface inside the silhouette. The negative space between ink lines is fully transparent; only the inked strokes are opaque. Moorish horseshoe arch (keyhole) cartouche frame in Saharan ochre ink with rubber-stamp imperfection — broken lines, dry-press patches, slight ink bleed at corners, faint off-register double-strike in Tuareg indigo, edge wear on the frame. Border: a thin strip of ink-line Saharan caravan silhouette interlace, drawn flat, no fills. Center: the Chinguetti library towers in profile, in flat Saharan ochre ink silhouette and line-art with Tuareg indigo accent flourishes on the tower crenellations. Country name "MAURITANIA" in display serif inside the top arc of the frame; "موريتانيا" in smaller weight near the bottom. "NIEVES' KITCHEN · 2026" in the lower border band.
```

### Western Sahara
```
A passport stamp rendered as a flat ink impression on a transparent background. The frame is an outline only — no interior fill, no card or paper surface inside the silhouette. The negative space between ink lines is fully transparent; only the inked strokes are opaque. Moorish horseshoe arch (keyhole) cartouche frame in Saharan ochre ink with rubber-stamp imperfection — broken lines, dry-press patches, slight ink bleed at corners, faint off-register double-strike in Tuareg indigo, edge wear on the frame. Border: a thin strip of ink-line Sahrawi tent textile geometry, drawn flat, no fills. Center: a Saharan dune crest with a nomad tent silhouette pitched on the ridge, in flat Saharan ochre ink silhouette and line-art with Tuareg indigo accent flourishes on the tent peak and the ridge line. Country name "WESTERN SAHARA" in display serif inside the top arc of the frame; "الصحراء الغربية" in smaller weight near the bottom. "NIEVES' KITCHEN · 2026" in the lower border band.
```

---

## 7. West Africa

> Redesigned 2026-05-11 — see `docs/superpowers/specs/2026-05-11-stamp-redesign-africa-design.md`. These are ink-impression stamps on transparent backgrounds (rounded rectangle with stepped corners / calabash-band cartouche, kente gold + kola-red ink), not cloth fragments. Append the universal canvas + negative-prompt boilerplate after each core prompt below before generating.

### Nigeria
```
A passport stamp rendered as a flat ink impression on a transparent background. The frame is an outline only — no interior fill, no card or paper surface inside the silhouette. The negative space between ink lines is fully transparent; only the inked strokes are opaque. Rounded rectangle with stepped corners (calabash-band) cartouche frame in kente gold ink with rubber-stamp imperfection — broken lines, dry-press patches, slight ink bleed at corners, faint off-register double-strike in kola-red, edge wear on the frame. Border: a thin strip of ink-line Adire indigo resist-dye geometry, drawn flat, no fills. Center: an abstract geometric Yoruba beadwork medallion (no figurative content, no face), in flat kente gold ink line-art with kola-red accent flourishes on the central rosette and outer rim. Country name "NIGERIA" in display serif inside the top arc of the frame. "NIEVES' KITCHEN · 2026" in the lower border band.
```

### Ghana
```
A passport stamp rendered as a flat ink impression on a transparent background. The frame is an outline only — no interior fill, no card or paper surface inside the silhouette. The negative space between ink lines is fully transparent; only the inked strokes are opaque. Rounded rectangle with stepped corners (calabash-band) cartouche frame in kente gold ink with rubber-stamp imperfection — broken lines, dry-press patches, slight ink bleed at corners, faint off-register double-strike in kola-red, edge wear on the frame. Border: a thin strip of ink-line kente strip-weave bands, drawn flat, no fills. Center: the Adinkra Sankofa bird symbol (bird with head turned back, egg in beak), in flat kente gold ink silhouette and line-art with kola-red accent flourishes on the bird's tail-feather curl. Country name "GHANA" in display serif inside the top arc of the frame. "NIEVES' KITCHEN · 2026" in the lower border band.
```

### Senegal
```
A passport stamp rendered as a flat ink impression on a transparent background. The frame is an outline only — no interior fill, no card or paper surface inside the silhouette. The negative space between ink lines is fully transparent; only the inked strokes are opaque. Rounded rectangle with stepped corners (calabash-band) cartouche frame in kente gold ink with rubber-stamp imperfection — broken lines, dry-press patches, slight ink bleed at corners, faint off-register double-strike in kola-red, edge wear on the frame. Border: a thin strip of ink-line Senegalese wax-print boubou geometry, drawn flat, no fills. Center: a baobab tree silhouette with its broad crown, in flat kente gold ink line-art with kola-red accent flourishes on the trunk furrows. Country name "SENEGAL" in display serif inside the top arc of the frame. "NIEVES' KITCHEN · 2026" in the lower border band.
```

### Mali
```
A passport stamp rendered as a flat ink impression on a transparent background. The frame is an outline only — no interior fill, no card or paper surface inside the silhouette. The negative space between ink lines is fully transparent; only the inked strokes are opaque. Rounded rectangle with stepped corners (calabash-band) cartouche frame in kente gold ink with rubber-stamp imperfection — broken lines, dry-press patches, slight ink bleed at corners, faint off-register double-strike in kola-red, edge wear on the frame. Border: a thin strip of ink-line Bògòlanfini mud-cloth geometry, drawn flat, no fills. Center: the Djenné Great Mosque silhouette with its protruding toron beams, in flat kente gold ink silhouette and line-art with kola-red accent flourishes on the toron beam tips. Country name "MALI" in display serif inside the top arc of the frame. "NIEVES' KITCHEN · 2026" in the lower border band.
```

### Ivory Coast
```
A passport stamp rendered as a flat ink impression on a transparent background. The frame is an outline only — no interior fill, no card or paper surface inside the silhouette. The negative space between ink lines is fully transparent; only the inked strokes are opaque. Rounded rectangle with stepped corners (calabash-band) cartouche frame in kente gold ink with rubber-stamp imperfection — broken lines, dry-press patches, slight ink bleed at corners, faint off-register double-strike in kola-red, edge wear on the frame. Border: a thin strip of ink-line Korhogo painted-cloth motifs, drawn flat, no fills. Center: an Akan gold-weight (abstract geometric figurine in profile, no face), in flat kente gold ink silhouette and line-art with kola-red accent flourishes on the figurine's body markings. Country name "IVORY COAST" in display serif inside the top arc of the frame; "Côte d'Ivoire" in smaller italic near the bottom. "NIEVES' KITCHEN · 2026" in the lower border band.
```

### Benin
```
A passport stamp rendered as a flat ink impression on a transparent background. The frame is an outline only — no interior fill, no card or paper surface inside the silhouette. The negative space between ink lines is fully transparent; only the inked strokes are opaque. Rounded rectangle with stepped corners (calabash-band) cartouche frame in kente gold ink with rubber-stamp imperfection — broken lines, dry-press patches, slight ink bleed at corners, faint off-register double-strike in kola-red, edge wear on the frame. Border: a thin strip of ink-line Beninese appliqué royal tapestry motifs, drawn flat, no fills. Center: a Dahomey leopard totem silhouette in profile (no face detail emphasis), in flat kente gold ink line-art with kola-red accent flourishes on the leopard's spot pattern. Country name "BENIN" in display serif inside the top arc of the frame. "NIEVES' KITCHEN · 2026" in the lower border band.
```

### Burkina Faso
```
A passport stamp rendered as a flat ink impression on a transparent background. The frame is an outline only — no interior fill, no card or paper surface inside the silhouette. The negative space between ink lines is fully transparent; only the inked strokes are opaque. Rounded rectangle with stepped corners (calabash-band) cartouche frame in kente gold ink with rubber-stamp imperfection — broken lines, dry-press patches, slight ink bleed at corners, faint off-register double-strike in kola-red, edge wear on the frame. Border: a thin strip of ink-line Faso danfani woven bands, drawn flat, no fills. Center: a Bobo abstract geometric carved panel (no face elements, purely geometric), in flat kente gold ink line-art with kola-red accent flourishes on the carved diamond inlays. Country name "BURKINA FASO" in display serif inside the top arc of the frame. "NIEVES' KITCHEN · 2026" in the lower border band.
```

### Togo
```
A passport stamp rendered as a flat ink impression on a transparent background. The frame is an outline only — no interior fill, no card or paper surface inside the silhouette. The negative space between ink lines is fully transparent; only the inked strokes are opaque. Rounded rectangle with stepped corners (calabash-band) cartouche frame in kente gold ink with rubber-stamp imperfection — broken lines, dry-press patches, slight ink bleed at corners, faint off-register double-strike in kola-red, edge wear on the frame. Border: a thin strip of ink-line Togolese strip-weave kente bands, drawn flat, no fills. Center: a Lake Togo pirogue silhouette with a single paddler in profile, in flat kente gold ink line-art with kola-red accent flourishes on the paddle and prow. Country name "TOGO" in display serif inside the top arc of the frame. "NIEVES' KITCHEN · 2026" in the lower border band.
```

### Niger
```
A passport stamp rendered as a flat ink impression on a transparent background. The frame is an outline only — no interior fill, no card or paper surface inside the silhouette. The negative space between ink lines is fully transparent; only the inked strokes are opaque. Rounded rectangle with stepped corners (calabash-band) cartouche frame in kente gold ink with rubber-stamp imperfection — broken lines, dry-press patches, slight ink bleed at corners, faint off-register double-strike in kola-red, edge wear on the frame. Border: a thin strip of ink-line Hausa indigo embroidery scrollwork, drawn flat, no fills. Center: an Agadez Tuareg cross pendant (silver-style geometric cross with four outer points), in flat kente gold ink line-art with kola-red accent flourishes on the outer points. Country name "NIGER" in display serif inside the top arc of the frame. "NIEVES' KITCHEN · 2026" in the lower border band.
```

### Guinea
```
A passport stamp rendered as a flat ink impression on a transparent background. The frame is an outline only — no interior fill, no card or paper surface inside the silhouette. The negative space between ink lines is fully transparent; only the inked strokes are opaque. Rounded rectangle with stepped corners (calabash-band) cartouche frame in kente gold ink with rubber-stamp imperfection — broken lines, dry-press patches, slight ink bleed at corners, faint off-register double-strike in kola-red, edge wear on the frame. Border: a thin strip of ink-line Manding textile geometry, drawn flat, no fills. Center: a kora instrument with its calabash gourd body and long upright neck, in flat kente gold ink line-art with kola-red accent flourishes on the string lines. Country name "GUINEA" in display serif inside the top arc of the frame. "NIEVES' KITCHEN · 2026" in the lower border band.
```

### Sierra Leone
```
A passport stamp rendered as a flat ink impression on a transparent background. The frame is an outline only — no interior fill, no card or paper surface inside the silhouette. The negative space between ink lines is fully transparent; only the inked strokes are opaque. Rounded rectangle with stepped corners (calabash-band) cartouche frame in kente gold ink with rubber-stamp imperfection — broken lines, dry-press patches, slight ink bleed at corners, faint off-register double-strike in kola-red, edge wear on the frame. Border: a thin strip of ink-line Gara indigo tie-dye motifs, drawn flat, no fills. Center: the Cotton Tree of Freetown silhouette with its broad spreading canopy, in flat kente gold ink line-art with kola-red accent flourishes on the canopy leaves. Country name "SIERRA LEONE" in display serif inside the top arc of the frame. "NIEVES' KITCHEN · 2026" in the lower border band.
```

### Gambia
```
A passport stamp rendered as a flat ink impression on a transparent background. The frame is an outline only — no interior fill, no card or paper surface inside the silhouette. The negative space between ink lines is fully transparent; only the inked strokes are opaque. Rounded rectangle with stepped corners (calabash-band) cartouche frame in kente gold ink with rubber-stamp imperfection — broken lines, dry-press patches, slight ink bleed at corners, faint off-register double-strike in kola-red, edge wear on the frame. Border: a thin strip of ink-line Gambian wax-print geometry, drawn flat, no fills. Center: the Wassu stone circles standing on the savanna ground, in flat kente gold ink silhouette and line-art with kola-red accent flourishes on the standing-stone tops. Country name "GAMBIA" in display serif inside the top arc of the frame. "NIEVES' KITCHEN · 2026" in the lower border band.
```

### Liberia
```
A passport stamp rendered as a flat ink impression on a transparent background. The frame is an outline only — no interior fill, no card or paper surface inside the silhouette. The negative space between ink lines is fully transparent; only the inked strokes are opaque. Rounded rectangle with stepped corners (calabash-band) cartouche frame in kente gold ink with rubber-stamp imperfection — broken lines, dry-press patches, slight ink bleed at corners, faint off-register double-strike in kola-red, edge wear on the frame. Border: a thin strip of ink-line Liberian country-cloth woven bands, drawn flat, no fills. Center: a rice-pounding mortar with its pestle raised beside it, in flat kente gold ink silhouette and line-art with kola-red accent flourishes on the pestle's grip and a few scattered rice grains. Country name "LIBERIA" in display serif inside the top arc of the frame. "NIEVES' KITCHEN · 2026" in the lower border band.
```

### Guinea-Bissau
```
A passport stamp rendered as a flat ink impression on a transparent background. The frame is an outline only — no interior fill, no card or paper surface inside the silhouette. The negative space between ink lines is fully transparent; only the inked strokes are opaque. Rounded rectangle with stepped corners (calabash-band) cartouche frame in kente gold ink with rubber-stamp imperfection — broken lines, dry-press patches, slight ink bleed at corners, faint off-register double-strike in kola-red, edge wear on the frame. Border: a thin strip of ink-line Pano di pinte hand-woven bands, drawn flat, no fills. Center: a Bijagós pirogue silhouette under a single sail, in flat kente gold ink line-art with kola-red accent flourishes on the paddle and prow. Country name "GUINEA-BISSAU" in display serif inside the top arc of the frame. "NIEVES' KITCHEN · 2026" in the lower border band.
```

---

## 8. East Africa

> Redesigned 2026-05-11 — see `docs/superpowers/specs/2026-05-11-stamp-redesign-africa-design.md`. These are ink-impression stamps on transparent backgrounds (lobed Coptic-cross / shield cartouche, savanna terracotta + Coptic jade ink), not linen swatches. Append the universal canvas + negative-prompt boilerplate after each core prompt below before generating.

### Ethiopia
```
A passport stamp rendered as a flat ink impression on a transparent background. The frame is an outline only — no interior fill, no card or paper surface inside the silhouette. The negative space between ink lines is fully transparent; only the inked strokes are opaque. Lobed Coptic-cross shield cartouche frame in savanna terracotta ink with rubber-stamp imperfection — broken lines, dry-press patches, slight ink bleed at corners, faint off-register double-strike in Coptic jade, edge wear on the frame. Border: a thin strip of ink-line Coptic processional-cross interlace, drawn flat, no fills. Center: a jebena coffee pot beside an abstract geometric Coptic-cross medallion, in flat savanna terracotta ink silhouette and line-art with Coptic jade accent flourishes on the coffee pot's handle and the cross's central rosette. Country name "ETHIOPIA" in display serif inside the top arc of the frame; "ኢትዮጵያ" in smaller weight near the bottom. "NIEVES' KITCHEN · 2026" in the lower border band.
```

### Kenya
```
A passport stamp rendered as a flat ink impression on a transparent background. The frame is an outline only — no interior fill, no card or paper surface inside the silhouette. The negative space between ink lines is fully transparent; only the inked strokes are opaque. Lobed Coptic-cross shield cartouche frame in savanna terracotta ink with rubber-stamp imperfection — broken lines, dry-press patches, slight ink bleed at corners, faint off-register double-strike in Coptic jade, edge wear on the frame. Border: a thin strip of ink-line Maasai bead-grid lozenge geometry, drawn flat, no fills. Center: an acacia tree with a giraffe in profile silhouette grazing beneath it, in flat savanna terracotta ink line-art with Coptic jade accent flourishes on the acacia canopy and the giraffe's mane. Country name "KENYA" in display serif inside the top arc of the frame. "NIEVES' KITCHEN · 2026" in the lower border band.
```

### Tanzania
```
A passport stamp rendered as a flat ink impression on a transparent background. The frame is an outline only — no interior fill, no card or paper surface inside the silhouette. The negative space between ink lines is fully transparent; only the inked strokes are opaque. Lobed Coptic-cross shield cartouche frame in savanna terracotta ink with rubber-stamp imperfection — broken lines, dry-press patches, slight ink bleed at corners, faint off-register double-strike in Coptic jade, edge wear on the frame. Border: a thin strip of ink-line Maasai bead-grid triangle geometry, drawn flat, no fills. Center: Mt Kilimanjaro rising above the savanna with a single acacia silhouette in the foreground, in flat savanna terracotta ink line-art with Coptic jade accent flourishes on the snow line and savanna grasses. Country name "TANZANIA" in display serif inside the top arc of the frame. "NIEVES' KITCHEN · 2026" in the lower border band.
```

### Uganda
```
A passport stamp rendered as a flat ink impression on a transparent background. The frame is an outline only — no interior fill, no card or paper surface inside the silhouette. The negative space between ink lines is fully transparent; only the inked strokes are opaque. Lobed Coptic-cross shield cartouche frame in savanna terracotta ink with rubber-stamp imperfection — broken lines, dry-press patches, slight ink bleed at corners, faint off-register double-strike in Coptic jade, edge wear on the frame. Border: a thin strip of ink-line Karamojong bead-zigzag paired with barkcloth dot rows, drawn flat, no fills. Center: a mountain gorilla silhouette in profile in mist (no facial detail emphasis), in flat savanna terracotta ink line-art with Coptic jade accent flourishes on the misty contour lines around the figure. Country name "UGANDA" in display serif inside the top arc of the frame. "NIEVES' KITCHEN · 2026" in the lower border band.
```

### Rwanda
```
A passport stamp rendered as a flat ink impression on a transparent background. The frame is an outline only — no interior fill, no card or paper surface inside the silhouette. The negative space between ink lines is fully transparent; only the inked strokes are opaque. Lobed Coptic-cross shield cartouche frame in savanna terracotta ink with rubber-stamp imperfection — broken lines, dry-press patches, slight ink bleed at corners, faint off-register double-strike in Coptic jade, edge wear on the frame. Border: a thin strip of ink-line Imigongo triangular-spiral panel geometry, drawn flat, no fills. Center: the Virunga volcanic peaks rising in profile, in flat savanna terracotta ink silhouette and line-art with Coptic jade accent flourishes on the ridges. Country name "RWANDA" in display serif inside the top arc of the frame; "U Rwanda" in smaller weight near the bottom. "NIEVES' KITCHEN · 2026" in the lower border band.
```

### Burundi
```
A passport stamp rendered as a flat ink impression on a transparent background. The frame is an outline only — no interior fill, no card or paper surface inside the silhouette. The negative space between ink lines is fully transparent; only the inked strokes are opaque. Lobed Coptic-cross shield cartouche frame in savanna terracotta ink with rubber-stamp imperfection — broken lines, dry-press patches, slight ink bleed at corners, faint off-register double-strike in Coptic jade, edge wear on the frame. Border: a thin strip of ink-line Imigongo-adjacent spiral interlace, drawn flat, no fills. Center: a royal Burundian drum on a low pedestal in profile, in flat savanna terracotta ink silhouette and line-art with Coptic jade accent flourishes on the drum's lashing and the pedestal carvings. Country name "BURUNDI" in display serif inside the top arc of the frame; "Uburundi" in smaller weight near the bottom. "NIEVES' KITCHEN · 2026" in the lower border band.
```

### Somalia
```
A passport stamp rendered as a flat ink impression on a transparent background. The frame is an outline only — no interior fill, no card or paper surface inside the silhouette. The negative space between ink lines is fully transparent; only the inked strokes are opaque. Lobed Coptic-cross shield cartouche frame in savanna terracotta ink with rubber-stamp imperfection — broken lines, dry-press patches, slight ink bleed at corners, faint off-register double-strike in Coptic jade, edge wear on the frame. Border: a thin strip of ink-line henna scrollwork paired with Somali nomadic geometry, drawn flat, no fills. Center: a camel caravan silhouette crossing a dune crest, in flat savanna terracotta ink line-art with Coptic jade accent flourishes on the camel-pack tassels. Country name "SOMALIA" in display serif inside the top arc of the frame; "الصومال" in smaller weight near the bottom. "NIEVES' KITCHEN · 2026" in the lower border band.
```

### Eritrea
```
A passport stamp rendered as a flat ink impression on a transparent background. The frame is an outline only — no interior fill, no card or paper surface inside the silhouette. The negative space between ink lines is fully transparent; only the inked strokes are opaque. Lobed Coptic-cross shield cartouche frame in savanna terracotta ink with rubber-stamp imperfection — broken lines, dry-press patches, slight ink bleed at corners, faint off-register double-strike in Coptic jade, edge wear on the frame. Border: a thin strip of ink-line Coptic-cross interlace paired with Tigrayan bead-row geometry, drawn flat, no fills. Center: a Massawa Red Sea dhow under sail against a coastal horizon, in flat savanna terracotta ink line-art with Coptic jade accent flourishes on the sail rigging. Country name "ERITREA" in display serif inside the top arc of the frame; "ኤርትራ" in smaller weight near the bottom. "NIEVES' KITCHEN · 2026" in the lower border band.
```

### Djibouti
```
A passport stamp rendered as a flat ink impression on a transparent background. The frame is an outline only — no interior fill, no card or paper surface inside the silhouette. The negative space between ink lines is fully transparent; only the inked strokes are opaque. Lobed Coptic-cross shield cartouche frame in savanna terracotta ink with rubber-stamp imperfection — broken lines, dry-press patches, slight ink bleed at corners, faint off-register double-strike in Coptic jade, edge wear on the frame. Border: a thin strip of ink-line Afar / Issa tribal bead-zigzag motifs, drawn flat, no fills. Center: the Lake Assal salt-flat horizon with a single mineral chimney-cone formation rising from the lakebed, in flat savanna terracotta ink line-art with Coptic jade accent flourishes on the salt-crust ripples. Country name "DJIBOUTI" in display serif inside the top arc of the frame; "جيبوتي" in smaller weight near the bottom. "NIEVES' KITCHEN · 2026" in the lower border band.
```

### South Sudan
```
A passport stamp rendered as a flat ink impression on a transparent background. The frame is an outline only — no interior fill, no card or paper surface inside the silhouette. The negative space between ink lines is fully transparent; only the inked strokes are opaque. Lobed Coptic-cross shield cartouche frame in savanna terracotta ink with rubber-stamp imperfection — broken lines, dry-press patches, slight ink bleed at corners, faint off-register double-strike in Coptic jade, edge wear on the frame. Border: a thin strip of ink-line Nuer / Dinka scarification-pattern geometry, drawn flat, no fills. Center: the Sudd wetlands with a cattle camp and a single thatched tukul on the bank, in flat savanna terracotta ink line-art with Coptic jade accent flourishes on the reeds and tukul thatch. Country name "SOUTH SUDAN" in display serif inside the top arc of the frame. "NIEVES' KITCHEN · 2026" in the lower border band.
```

---

## 9. Southern + Central Africa

> Redesigned 2026-05-11 — see `docs/superpowers/specs/2026-05-11-stamp-redesign-africa-design.md`. These are ink-impression stamps on transparent backgrounds (stepped-gable rectangle / Ndebele homestead silhouette cartouche, Kuba umber + Ndebele cobalt ink), not painted wall fragments. Append the universal canvas + negative-prompt boilerplate after each core prompt below before generating.

### South Africa
```
A passport stamp rendered as a flat ink impression on a transparent background. The frame is an outline only — no interior fill, no card or paper surface inside the silhouette. The negative space between ink lines is fully transparent; only the inked strokes are opaque. Stepped-gable rectangle (Ndebele homestead silhouette) cartouche frame in Kuba umber ink with rubber-stamp imperfection — broken lines, dry-press patches, slight ink bleed at corners, faint off-register double-strike in Ndebele cobalt, edge wear on the frame. Border: a thin strip of ink-line Ndebele wall stepped-geometric bands, drawn flat, no fills. Center: an abstract Zulu beaded medallion (geometric pattern, no face), in flat Kuba umber ink line-art with Ndebele cobalt accent flourishes on the medallion's outer ring. Country name "SOUTH AFRICA" in display serif inside the top arc of the frame. "NIEVES' KITCHEN · 2026" in the lower border band.
```

### Zimbabwe
```
A passport stamp rendered as a flat ink impression on a transparent background. The frame is an outline only — no interior fill, no card or paper surface inside the silhouette. The negative space between ink lines is fully transparent; only the inked strokes are opaque. Stepped-gable rectangle (Ndebele homestead silhouette) cartouche frame in Kuba umber ink with rubber-stamp imperfection — broken lines, dry-press patches, slight ink bleed at corners, faint off-register double-strike in Ndebele cobalt, edge wear on the frame. Border: a thin strip of ink-line Shona / Ndebele stepped-zigzag bands, drawn flat, no fills. Center: the Great Zimbabwe stone bird in profile silhouette, in flat Kuba umber ink line-art with Ndebele cobalt accent flourishes on the wing detail. Country name "ZIMBABWE" in display serif inside the top arc of the frame. "NIEVES' KITCHEN · 2026" in the lower border band.
```

### Mozambique
```
A passport stamp rendered as a flat ink impression on a transparent background. The frame is an outline only — no interior fill, no card or paper surface inside the silhouette. The negative space between ink lines is fully transparent; only the inked strokes are opaque. Stepped-gable rectangle (Ndebele homestead silhouette) cartouche frame in Kuba umber ink with rubber-stamp imperfection — broken lines, dry-press patches, slight ink bleed at corners, faint off-register double-strike in Ndebele cobalt, edge wear on the frame. Border: a thin strip of ink-line Capulana print bold-geometric bands, drawn flat, no fills. Center: a coastal dhow silhouette with a palm leaning over it on the shore, in flat Kuba umber ink line-art with Ndebele cobalt accent flourishes on the sail and palm fronds. Country name "MOZAMBIQUE" in display serif inside the top arc of the frame. "NIEVES' KITCHEN · 2026" in the lower border band.
```

### Cameroon
```
A passport stamp rendered as a flat ink impression on a transparent background. The frame is an outline only — no interior fill, no card or paper surface inside the silhouette. The negative space between ink lines is fully transparent; only the inked strokes are opaque. Stepped-gable rectangle (Ndebele homestead silhouette) cartouche frame in Kuba umber ink with rubber-stamp imperfection — broken lines, dry-press patches, slight ink bleed at corners, faint off-register double-strike in Ndebele cobalt, edge wear on the frame. Border: a thin strip of ink-line Tikar beaded-panel geometry, drawn flat, no fills. Center: a Bamileke juju hat (feathered ceremonial headdress only — no face, no wearer), in flat Kuba umber ink silhouette and line-art with Ndebele cobalt accent flourishes on the feather tips. Country name "CAMEROON" in display serif inside the top arc of the frame. "NIEVES' KITCHEN · 2026" in the lower border band.
```

### DRC (Democratic Republic of Congo)
```
A passport stamp rendered as a flat ink impression on a transparent background. The frame is an outline only — no interior fill, no card or paper surface inside the silhouette. The negative space between ink lines is fully transparent; only the inked strokes are opaque. Stepped-gable rectangle (Ndebele homestead silhouette) cartouche frame in Kuba umber ink with rubber-stamp imperfection — broken lines, dry-press patches, slight ink bleed at corners, faint off-register double-strike in Ndebele cobalt, edge wear on the frame. Border: a thin strip of ink-line Kuba cloth grid geometry, drawn flat, no fills. Center: a Kuba royal cup (carved wooden vessel with geometric pattern, no face), in flat Kuba umber ink silhouette and line-art with Ndebele cobalt accent flourishes on the cup's geometric inlay. Country name "DR CONGO" in display serif inside the top arc of the frame; "République Démocratique du Congo" in smaller small-caps near the bottom. "NIEVES' KITCHEN · 2026" in the lower border band.
```

### Angola
```
A passport stamp rendered as a flat ink impression on a transparent background. The frame is an outline only — no interior fill, no card or paper surface inside the silhouette. The negative space between ink lines is fully transparent; only the inked strokes are opaque. Stepped-gable rectangle (Ndebele homestead silhouette) cartouche frame in Kuba umber ink with rubber-stamp imperfection — broken lines, dry-press patches, slight ink bleed at corners, faint off-register double-strike in Ndebele cobalt, edge wear on the frame. Border: a thin strip of ink-line Tchokwe sand-drawing interlace, drawn flat, no fills. Center: the Kalandula Falls cascading silhouette, in flat Kuba umber ink line-art with Ndebele cobalt accent flourishes on the cascading water. Country name "ANGOLA" in display serif inside the top arc of the frame. "NIEVES' KITCHEN · 2026" in the lower border band.
```

### Lesotho
```
A passport stamp rendered as a flat ink impression on a transparent background. The frame is an outline only — no interior fill, no card or paper surface inside the silhouette. The negative space between ink lines is fully transparent; only the inked strokes are opaque. Stepped-gable rectangle (Ndebele homestead silhouette) cartouche frame in Kuba umber ink with rubber-stamp imperfection — broken lines, dry-press patches, slight ink bleed at corners, faint off-register double-strike in Ndebele cobalt, edge wear on the frame. Border: a thin strip of ink-line Basotho Seanamarena blanket geometry, drawn flat, no fills. Center: a Mokorotlo (Basotho conical straw hat) standing alone, in flat Kuba umber ink silhouette and line-art with Ndebele cobalt accent flourishes on the hat's woven coil bands. Country name "LESOTHO" in display serif inside the top arc of the frame. "NIEVES' KITCHEN · 2026" in the lower border band.
```

### Zambia
```
A passport stamp rendered as a flat ink impression on a transparent background. The frame is an outline only — no interior fill, no card or paper surface inside the silhouette. The negative space between ink lines is fully transparent; only the inked strokes are opaque. Stepped-gable rectangle (Ndebele homestead silhouette) cartouche frame in Kuba umber ink with rubber-stamp imperfection — broken lines, dry-press patches, slight ink bleed at corners, faint off-register double-strike in Ndebele cobalt, edge wear on the frame. Border: a thin strip of ink-line Tonga geometric bands, drawn flat, no fills. Center: the Victoria Falls cascading silhouette with rising mist, in flat Kuba umber ink line-art with Ndebele cobalt accent flourishes on the mist and falling water. Country name "ZAMBIA" in display serif inside the top arc of the frame. "NIEVES' KITCHEN · 2026" in the lower border band.
```

### Botswana
```
A passport stamp rendered as a flat ink impression on a transparent background. The frame is an outline only — no interior fill, no card or paper surface inside the silhouette. The negative space between ink lines is fully transparent; only the inked strokes are opaque. Stepped-gable rectangle (Ndebele homestead silhouette) cartouche frame in Kuba umber ink with rubber-stamp imperfection — broken lines, dry-press patches, slight ink bleed at corners, faint off-register double-strike in Ndebele cobalt, edge wear on the frame. Border: a thin strip of ink-line Tswana basket coiled-geometric motifs, drawn flat, no fills. Center: the Okavango delta fan with channels branching through tall reeds, in flat Kuba umber ink line-art with Ndebele cobalt accent flourishes on the reed clusters. Country name "BOTSWANA" in display serif inside the top arc of the frame. "NIEVES' KITCHEN · 2026" in the lower border band.
```

### Namibia
```
A passport stamp rendered as a flat ink impression on a transparent background. The frame is an outline only — no interior fill, no card or paper surface inside the silhouette. The negative space between ink lines is fully transparent; only the inked strokes are opaque. Stepped-gable rectangle (Ndebele homestead silhouette) cartouche frame in Kuba umber ink with rubber-stamp imperfection — broken lines, dry-press patches, slight ink bleed at corners, faint off-register double-strike in Ndebele cobalt, edge wear on the frame. Border: a thin strip of ink-line Himba red-ochre zigzag bands, drawn flat, no fills. Center: the Sossusvlei red dunes with a lone camel-thorn tree on the crest, in flat Kuba umber ink line-art with Ndebele cobalt accent flourishes on the tree's outline and the dune crest. Country name "NAMIBIA" in display serif inside the top arc of the frame. "NIEVES' KITCHEN · 2026" in the lower border band.
```

### Malawi
```
A passport stamp rendered as a flat ink impression on a transparent background. The frame is an outline only — no interior fill, no card or paper surface inside the silhouette. The negative space between ink lines is fully transparent; only the inked strokes are opaque. Stepped-gable rectangle (Ndebele homestead silhouette) cartouche frame in Kuba umber ink with rubber-stamp imperfection — broken lines, dry-press patches, slight ink bleed at corners, faint off-register double-strike in Ndebele cobalt, edge wear on the frame. Border: a thin strip of ink-line Yao / Chewa geometric bands, drawn flat, no fills. Center: a Lake Malawi dhow silhouette under sail, in flat Kuba umber ink line-art with Ndebele cobalt accent flourishes on the sail rigging. Country name "MALAWI" in display serif inside the top arc of the frame. "NIEVES' KITCHEN · 2026" in the lower border band.
```

### Eswatini
```
A passport stamp rendered as a flat ink impression on a transparent background. The frame is an outline only — no interior fill, no card or paper surface inside the silhouette. The negative space between ink lines is fully transparent; only the inked strokes are opaque. Stepped-gable rectangle (Ndebele homestead silhouette) cartouche frame in Kuba umber ink with rubber-stamp imperfection — broken lines, dry-press patches, slight ink bleed at corners, faint off-register double-strike in Ndebele cobalt, edge wear on the frame. Border: a thin strip of ink-line Reed-dance stepped-band geometry, drawn flat, no fills. Center: an antelope and a zebra in profile beneath a sausage tree (no face detail emphasis), in flat Kuba umber ink line-art with Ndebele cobalt accent flourishes on the zebra's stripes and the sausage-tree fruits. Country name "ESWATINI" in display serif inside the top arc of the frame. "NIEVES' KITCHEN · 2026" in the lower border band.
```

### Republic of Congo
```
A passport stamp rendered as a flat ink impression on a transparent background. The frame is an outline only — no interior fill, no card or paper surface inside the silhouette. The negative space between ink lines is fully transparent; only the inked strokes are opaque. Stepped-gable rectangle (Ndebele homestead silhouette) cartouche frame in Kuba umber ink with rubber-stamp imperfection — broken lines, dry-press patches, slight ink bleed at corners, faint off-register double-strike in Ndebele cobalt, edge wear on the frame. Border: a thin strip of ink-line Kuba-adjacent grid geometry, drawn flat, no fills. Center: a river canoe silhouette with a single paddler in profile, in flat Kuba umber ink line-art with Ndebele cobalt accent flourishes on the paddle and prow. Country name "REPUBLIC OF CONGO" in display serif inside the top arc of the frame. "NIEVES' KITCHEN · 2026" in the lower border band.
```

### Gabon
```
A passport stamp rendered as a flat ink impression on a transparent background. The frame is an outline only — no interior fill, no card or paper surface inside the silhouette. The negative space between ink lines is fully transparent; only the inked strokes are opaque. Stepped-gable rectangle (Ndebele homestead silhouette) cartouche frame in Kuba umber ink with rubber-stamp imperfection — broken lines, dry-press patches, slight ink bleed at corners, faint off-register double-strike in Ndebele cobalt, edge wear on the frame. Border: a thin strip of ink-line Punu geometric weave bands, drawn flat, no fills. Center: an okoumé tree silhouette with its broad canopy, in flat Kuba umber ink line-art with Ndebele cobalt accent flourishes on the canopy edges. Country name "GABON" in display serif inside the top arc of the frame. "NIEVES' KITCHEN · 2026" in the lower border band.
```

### Chad
```
A passport stamp rendered as a flat ink impression on a transparent background. The frame is an outline only — no interior fill, no card or paper surface inside the silhouette. The negative space between ink lines is fully transparent; only the inked strokes are opaque. Stepped-gable rectangle (Ndebele homestead silhouette) cartouche frame in Kuba umber ink with rubber-stamp imperfection — broken lines, dry-press patches, slight ink bleed at corners, faint off-register double-strike in Ndebele cobalt, edge wear on the frame. Border: a thin strip of ink-line Toubou Sahel geometric bands, drawn flat, no fills. Center: the Ennedi rock-arch formations rising from the desert floor, in flat Kuba umber ink line-art with Ndebele cobalt accent flourishes on the arch's underside. Country name "CHAD" in display serif inside the top arc of the frame. "NIEVES' KITCHEN · 2026" in the lower border band.
```

### Central African Republic (CAR)
```
A passport stamp rendered as a flat ink impression on a transparent background. The frame is an outline only — no interior fill, no card or paper surface inside the silhouette. The negative space between ink lines is fully transparent; only the inked strokes are opaque. Stepped-gable rectangle (Ndebele homestead silhouette) cartouche frame in Kuba umber ink with rubber-stamp imperfection — broken lines, dry-press patches, slight ink bleed at corners, faint off-register double-strike in Ndebele cobalt, edge wear on the frame. Border: a thin strip of ink-line Mbuti barkcloth dot-and-line motifs, drawn flat, no fills. Center: a rainforest canopy of overlapping tree silhouettes, in flat Kuba umber ink line-art with Ndebele cobalt accent flourishes on the overlapping leaf edges. Country name "CENTRAL AFRICAN REPUBLIC" in display serif inside the top arc of the frame. "NIEVES' KITCHEN · 2026" in the lower border band.
```

---

## 10. North America

> Redesigned 2026-05-12 — see `docs/superpowers/specs/2026-05-12-stamp-redesign-asia-and-north-america-design.md`. The engraved commemorative-postage idiom is preserved, but recast as ink-impression on transparent (no paper yellowing, no edge wear of the paper kind). USA's cast-iron skillet is replaced with a diner coffee mug + pie wedge. Canada's third ink (butter-yellow) is dropped for two-tone discipline. Append the universal canvas + negative-prompt boilerplate after each core prompt below before generating.

### USA
```
A passport stamp rendered as a flat ink impression on a transparent background. The frame is an outline only — no interior fill, no card or paper surface inside the silhouette, no paper yellowing, no edge wear of the paper kind. The negative space between ink lines is fully transparent; only the inked strokes are opaque. Horizontal commemorative-postage cartouche frame in sepia ink with rubber-stamp imperfection — broken lines, dry-press patches, slight ink bleed at corners, faint off-register double-strike in barn-red, edge wear on the frame. Border: a Beaux-Arts laurel-and-star engraving drawn as flat ink lines, no fills, with a "3¢" denomination corner. Center: a diner coffee mug beside a wedge of pie on a small plate, rendered in flat sepia ink line-art with barn-red accent on the pie's lattice top. Country name "UNITED STATES OF AMERICA" in display serif inside the top of the frame. "NIEVES' KITCHEN · 2026" in the lower border band. Restrained, editorial — not Victorian-ornate.
```

### Canada
```
A passport stamp rendered as a flat ink impression on a transparent background. The frame is an outline only — no interior fill, no card or paper surface inside the silhouette, no paper yellowing, no edge wear of the paper kind. The negative space between ink lines is fully transparent; only the inked strokes are opaque. Tall vertical commemorative-postage cartouche frame in sepia ink with rubber-stamp imperfection — broken lines, dry-press patches, slight ink bleed at corners, faint off-register double-strike in indigo, edge wear on the frame. Border: a King George VI-era maple-leaf scroll engraving drawn as flat ink lines, no fills, with "POSTAGE / POSTES" wordmark and a small denomination corner. Center: a maple-syrup tap and hanging bucket on a sugar-maple trunk with one falling drop, rendered in flat sepia ink line-art with indigo accent on the drop and the bucket band. Bilingual country name "CANADA · POSTES" in display serif inside the top of the frame. "NIEVES' KITCHEN · 2026" in the lower border band. Restrained, editorial — not Victorian-ornate.
```

---

## 11. Mexico + Central America + Caribbean

> Redesigned 2026-05-12 — see `docs/superpowers/specs/2026-05-12-stamp-redesign-americas-and-oceania-design.md`. These are ink-impression stamps on transparent backgrounds, not papel-picado paper cards. The region splits into two visual subfamilies: Mesoamerica (stepped-pyramid cartouche, cinnabar vermilion + jade ink) and Caribbean (scalloped oval with rope-twist edge, colonial teal-blue + coral red). Append the universal canvas + negative-prompt boilerplate after each core prompt below before generating.

### 11a. Mesoamerica (stepped-pyramid cartouche, cinnabar vermilion + jade green)

### Mexico
```
A passport stamp rendered as a flat ink impression on a transparent background. The frame is an outline only — no interior fill, no card or paper surface inside the silhouette. The negative space between ink lines is fully transparent; only the inked strokes are opaque. Stepped-pyramid cartouche frame (tall rectangle with terraced/stepped shoulders evoking Mesoamerican temple silhouettes) in cinnabar-vermilion ink with rubber-stamp imperfection — broken lines, dry-press patches, slight ink bleed at corners, faint off-register double-strike in jade green, edge wear on the frame. Border: a thin strip of papel-picado cut-out motifs (floral and geometric silhouettes) drawn as flat ink lines, no fills. Center: a volcanic-stone molcajete with its tejolote pestle in flat cinnabar-vermilion ink line-art with jade-green accent on the molcajete's tripod feet. Country name "MEXICO" in display serif inside the top arc of the frame; "MÉXICO" in smaller italic below. "NIEVES' KITCHEN · 2026" in the lower border band.
```

### Guatemala
```
A passport stamp rendered as a flat ink impression on a transparent background. The frame is an outline only — no interior fill, no card or paper surface inside the silhouette. The negative space between ink lines is fully transparent; only the inked strokes are opaque. Stepped-pyramid cartouche frame (tall rectangle with terraced/stepped shoulders evoking Mesoamerican temple silhouettes) in cinnabar-vermilion ink with rubber-stamp imperfection — broken lines, dry-press patches, slight ink bleed at corners, faint off-register double-strike in jade green, edge wear on the frame. Border: a thin strip of Maya huipil weaving geometry drawn as flat ink lines, no fills. Center: a Tikal pyramid silhouette with a jungle-canopy line at its base, in flat cinnabar-vermilion ink line-art with jade-green accent on the canopy line. Country name "GUATEMALA" in display serif inside the top arc of the frame. "NIEVES' KITCHEN · 2026" in the lower border band.
```

### Belize
```
A passport stamp rendered as a flat ink impression on a transparent background. The frame is an outline only — no interior fill, no card or paper surface inside the silhouette. The negative space between ink lines is fully transparent; only the inked strokes are opaque. Stepped-pyramid cartouche frame (tall rectangle with terraced/stepped shoulders evoking Mesoamerican temple silhouettes) in cinnabar-vermilion ink with rubber-stamp imperfection — broken lines, dry-press patches, slight ink bleed at corners, faint off-register double-strike in jade green, edge wear on the frame. Border: a thin strip of Garifuna drum-rhythm geometric stripes drawn as flat ink lines, no fills. Center: a Mayan stela silhouette as geometric carved-relief abstraction (no face, no figurative content) in flat cinnabar-vermilion ink line-art with jade-green accent on the carved glyphs. Country name "BELIZE" in display serif inside the top arc of the frame. "NIEVES' KITCHEN · 2026" in the lower border band.
```

### Honduras
```
A passport stamp rendered as a flat ink impression on a transparent background. The frame is an outline only — no interior fill, no card or paper surface inside the silhouette. The negative space between ink lines is fully transparent; only the inked strokes are opaque. Stepped-pyramid cartouche frame (tall rectangle with terraced/stepped shoulders evoking Mesoamerican temple silhouettes) in cinnabar-vermilion ink with rubber-stamp imperfection — broken lines, dry-press patches, slight ink bleed at corners, faint off-register double-strike in jade green, edge wear on the frame. Border: a thin strip of Lenca black-on-cream pottery geometric drawn as flat ink lines, no fills. Center: a Copán stela cluster silhouette with a jungle-canopy line behind, in flat cinnabar-vermilion ink line-art with jade-green accent on the canopy line — geometric carved-relief abstraction, no faces, no figurative content. Country name "HONDURAS" in display serif inside the top arc of the frame. "NIEVES' KITCHEN · 2026" in the lower border band.
```

### El Salvador
```
A passport stamp rendered as a flat ink impression on a transparent background. The frame is an outline only — no interior fill, no card or paper surface inside the silhouette. The negative space between ink lines is fully transparent; only the inked strokes are opaque. Stepped-pyramid cartouche frame (tall rectangle with terraced/stepped shoulders evoking Mesoamerican temple silhouettes) in cinnabar-vermilion ink with rubber-stamp imperfection — broken lines, dry-press patches, slight ink bleed at corners, faint off-register double-strike in jade green, edge wear on the frame. Border: a thin strip of Salvadoran handloom textile geometric drawn as flat ink lines, no fills. Center: a pupusa griddle (round comal with stacked pupusas, food-object) in flat cinnabar-vermilion ink line-art with jade-green accent on a curl of steam. Country name "EL SALVADOR" in display serif inside the top arc of the frame. "NIEVES' KITCHEN · 2026" in the lower border band.
```

### Nicaragua
```
A passport stamp rendered as a flat ink impression on a transparent background. The frame is an outline only — no interior fill, no card or paper surface inside the silhouette. The negative space between ink lines is fully transparent; only the inked strokes are opaque. Stepped-pyramid cartouche frame (tall rectangle with terraced/stepped shoulders evoking Mesoamerican temple silhouettes) in cinnabar-vermilion ink with rubber-stamp imperfection — broken lines, dry-press patches, slight ink bleed at corners, faint off-register double-strike in jade green, edge wear on the frame. Border: a thin strip of Nicaraguan hammock weave geometric drawn as flat ink lines, no fills. Center: a Granada cathedral silhouette with twin towers and a central dome, in flat cinnabar-vermilion ink line-art with jade-green accent on the central dome cross. Country name "NICARAGUA" in display serif inside the top arc of the frame. "NIEVES' KITCHEN · 2026" in the lower border band.
```

### Costa Rica
```
A passport stamp rendered as a flat ink impression on a transparent background. The frame is an outline only — no interior fill, no card or paper surface inside the silhouette. The negative space between ink lines is fully transparent; only the inked strokes are opaque. Stepped-pyramid cartouche frame (tall rectangle with terraced/stepped shoulders evoking Mesoamerican temple silhouettes) in cinnabar-vermilion ink with rubber-stamp imperfection — broken lines, dry-press patches, slight ink bleed at corners, faint off-register double-strike in jade green, edge wear on the frame. Border: a thin strip of carreta oxcart painted-wheel radial-rosette geometric drawn as flat ink lines, no fills. Center: a painted carreta oxcart wheel front-on (radial rosette geometry, hub and spokes) in flat cinnabar-vermilion ink line-art with jade-green accent on alternating rosette petals. Country name "COSTA RICA" in display serif inside the top arc of the frame. "NIEVES' KITCHEN · 2026" in the lower border band.
```

### Panama
```
A passport stamp rendered as a flat ink impression on a transparent background. The frame is an outline only — no interior fill, no card or paper surface inside the silhouette. The negative space between ink lines is fully transparent; only the inked strokes are opaque. Stepped-pyramid cartouche frame (tall rectangle with terraced/stepped shoulders evoking Mesoamerican temple silhouettes) in cinnabar-vermilion ink with rubber-stamp imperfection — broken lines, dry-press patches, slight ink bleed at corners, faint off-register double-strike in jade green, edge wear on the frame. Border: a thin strip of Kuna mola reverse-applique geometric drawn as flat ink lines, no fills. Center: an Embera carved staff (geometric, no face) beside a Pacific reef silhouette, in flat cinnabar-vermilion ink line-art with jade-green accent on the reef. Country name "PANAMA" in display serif inside the top arc of the frame; "PANAMÁ" in smaller italic below. "NIEVES' KITCHEN · 2026" in the lower border band.
```

### 11b. Caribbean (scalloped oval with rope-twist edge, colonial teal-blue + coral red)

### Cuba
```
A passport stamp rendered as a flat ink impression on a transparent background. The frame is an outline only — no interior fill, no card or paper surface inside the silhouette. The negative space between ink lines is fully transparent; only the inked strokes are opaque. Scalloped oval cartouche with rope-twist outer edge in colonial teal-blue ink with rubber-stamp imperfection — broken lines, dry-press patches, slight ink bleed at corners, faint off-register double-strike in coral red, edge wear on the frame. Border: a thin strip of tropical-flora ink-line motifs (palm fronds, hibiscus blossoms, sugarcane stalks) drawn flat, no fills. Center: a Havana street facade silhouette (colonial buildings with ironwork balconies) in flat colonial teal-blue ink line-art with coral-red accent flourishes on the ironwork. Country name "CUBA" in display serif inside the top arc of the frame. "NIEVES' KITCHEN · 2026" in the lower border band.
```

### Jamaica
```
A passport stamp rendered as a flat ink impression on a transparent background. The frame is an outline only — no interior fill, no card or paper surface inside the silhouette. The negative space between ink lines is fully transparent; only the inked strokes are opaque. Scalloped oval cartouche with rope-twist outer edge in colonial teal-blue ink with rubber-stamp imperfection — broken lines, dry-press patches, slight ink bleed at corners, faint off-register double-strike in coral red, edge wear on the frame. Border: a thin strip of Maroon textile geometric weave drawn as flat ink lines, no fills. Center: a jerk-pit oil-drum silhouette with a rising smoke wisp (food-object) in flat colonial teal-blue ink line-art with coral-red accent on the smoke curl. Country name "JAMAICA" in display serif inside the top arc of the frame. "NIEVES' KITCHEN · 2026" in the lower border band.
```

### Puerto Rico
```
A passport stamp rendered as a flat ink impression on a transparent background. The frame is an outline only — no interior fill, no card or paper surface inside the silhouette. The negative space between ink lines is fully transparent; only the inked strokes are opaque. Scalloped oval cartouche with rope-twist outer edge in colonial teal-blue ink with rubber-stamp imperfection — broken lines, dry-press patches, slight ink bleed at corners, faint off-register double-strike in coral red, edge wear on the frame. Border: a thin strip of Mundillo lace paired with a Taíno petroglyph band, drawn as flat ink lines, no fills. Center: an Old San Juan facade silhouette with wooden balconies in flat colonial teal-blue ink line-art with coral-red accent flourishes on the balcony shutters. Country name "PUERTO RICO" in display serif inside the top arc of the frame. "NIEVES' KITCHEN · 2026" in the lower border band.
```

### Trinidad & Tobago
```
A passport stamp rendered as a flat ink impression on a transparent background. The frame is an outline only — no interior fill, no card or paper surface inside the silhouette. The negative space between ink lines is fully transparent; only the inked strokes are opaque. Scalloped oval cartouche with rope-twist outer edge in colonial teal-blue ink with rubber-stamp imperfection — broken lines, dry-press patches, slight ink bleed at corners, faint off-register double-strike in coral red, edge wear on the frame. Border: a thin strip of Carnival mas-costume abstracted geometric (feather-fan rhythm repeats and sequin-dot bands) drawn as flat ink lines, no fills. Center: a steel pan drum top-down (concentric playing surface, segmented note divisions) in flat colonial teal-blue ink line-art with coral-red accent on the inner note segments. Country name "TRINIDAD & TOBAGO" in display serif inside the top arc of the frame. "NIEVES' KITCHEN · 2026" in the lower border band.
```

### Haiti
```
A passport stamp rendered as a flat ink impression on a transparent background. The frame is an outline only — no interior fill, no card or paper surface inside the silhouette. The negative space between ink lines is fully transparent; only the inked strokes are opaque. Scalloped oval cartouche with rope-twist outer edge in colonial teal-blue ink with rubber-stamp imperfection — broken lines, dry-press patches, slight ink bleed at corners, faint off-register double-strike in coral red, edge wear on the frame. Border: a thin strip of Jacmel naïve floral motifs drawn as flat ink lines, no fills. Center: a Vodou veve geometric ritual diagram in flat colonial teal-blue ink line-art with coral-red accent on the diagram's central crossing — geometric ritual abstraction only, no figurative content, no faces. Country name "HAITI" in display serif inside the top arc of the frame; "HAÏTI" in smaller italic below. "NIEVES' KITCHEN · 2026" in the lower border band.
```

### Dominican Republic
```
A passport stamp rendered as a flat ink impression on a transparent background. The frame is an outline only — no interior fill, no card or paper surface inside the silhouette. The negative space between ink lines is fully transparent; only the inked strokes are opaque. Scalloped oval cartouche with rope-twist outer edge in colonial teal-blue ink with rubber-stamp imperfection — broken lines, dry-press patches, slight ink bleed at corners, faint off-register double-strike in coral red, edge wear on the frame. Border: a thin strip of Taíno geometric pattern drawn as flat ink lines, no fills. Center: a Zona Colonial casita silhouette (colonial townhouse with wrought-iron balcony) in flat colonial teal-blue ink line-art with coral-red accent flourishes on the balcony scrollwork. Country name "DOMINICAN REPUBLIC" in display serif inside the top arc of the frame; "REPÚBLICA DOMINICANA" in smaller italic below. "NIEVES' KITCHEN · 2026" in the lower border band.
```

### Bahamas
```
A passport stamp rendered as a flat ink impression on a transparent background. The frame is an outline only — no interior fill, no card or paper surface inside the silhouette. The negative space between ink lines is fully transparent; only the inked strokes are opaque. Scalloped oval cartouche with rope-twist outer edge in colonial teal-blue ink with rubber-stamp imperfection — broken lines, dry-press patches, slight ink bleed at corners, faint off-register double-strike in coral red, edge wear on the frame. Border: a thin strip of Junkanoo confetti pattern (abstracted festival geometric shapes) drawn as flat ink lines, no fills. Center: a conch shell silhouette (food-object) in flat colonial teal-blue ink line-art with coral-red accent flourishes on the shell's inner lip. Country name "BAHAMAS" in display serif inside the top arc of the frame. "NIEVES' KITCHEN · 2026" in the lower border band.
```

### Barbados
```
A passport stamp rendered as a flat ink impression on a transparent background. The frame is an outline only — no interior fill, no card or paper surface inside the silhouette. The negative space between ink lines is fully transparent; only the inked strokes are opaque. Scalloped oval cartouche with rope-twist outer edge in colonial teal-blue ink with rubber-stamp imperfection — broken lines, dry-press patches, slight ink bleed at corners, faint off-register double-strike in coral red, edge wear on the frame. Border: a thin strip of sugarcane stalks-and-leaves repeated geometric drawn as flat ink lines, no fills. Center: a rum still copper pot with its condenser coil (food-object) in flat colonial teal-blue ink line-art with coral-red accent on the coil. Country name "BARBADOS" in display serif inside the top arc of the frame. "NIEVES' KITCHEN · 2026" in the lower border band.
```

---

## 12. South America

> Redesigned 2026-05-11 — see `docs/superpowers/specs/2026-05-11-stamp-redesign-west-asia-south-america-design.md`. These are ink-impression stamps on transparent backgrounds (shared oval-cartouche grammar with Andean-textile borders), not woven-cloth fragments. Brazil's Tropicália exception is retired; Brazil now follows the same grammar. Append the universal canvas + negative-prompt boilerplate after each core prompt below before generating.

### Peru
```
A passport stamp rendered as a flat ink impression on a transparent background. The frame is an outline only — no interior fill, no card or paper surface inside the silhouette. The negative space between ink lines is fully transparent; only the inked strokes are opaque. Oval cartouche frame in terracotta ink with rubber-stamp imperfection — broken lines, dry-press patches, slight ink bleed at corners, faint off-register double-strike in deep indigo, edge wear on the frame. Border: a thin strip of ink-line Quechua manta stepped-fret geometry, drawn flat, no fills. Center: a Machu Picchu citadel silhouette with a Nazca-line hummingbird inset to one side, in flat terracotta ink line-art with deep-indigo accent flourishes on the hummingbird's wings. Country name "PERU" in display serif inside the top arc of the frame; "PERÚ" in smaller italic below. "NIEVES' KITCHEN · 2026" in the lower border band.
```

### Argentina
```
A passport stamp rendered as a flat ink impression on a transparent background. The frame is an outline only — no interior fill, no card or paper surface inside the silhouette. The negative space between ink lines is fully transparent; only the inked strokes are opaque. Oval cartouche frame in terracotta ink with rubber-stamp imperfection — broken lines, dry-press patches, slight ink bleed at corners, faint off-register double-strike in deep indigo, edge wear on the frame. Border: a thin strip of ink-line gaucho leather-tooled scroll motifs with silver-stud dots, drawn flat, no fills. Center: a mate gourd with its bombilla straw rising from the rim, in flat terracotta ink silhouette and line-art with deep-indigo accent flourishes on the gourd's banding. Country name "ARGENTINA" in display serif inside the top arc of the frame. "NIEVES' KITCHEN · 2026" in the lower border band.
```

### Colombia
```
A passport stamp rendered as a flat ink impression on a transparent background. The frame is an outline only — no interior fill, no card or paper surface inside the silhouette. The negative space between ink lines is fully transparent; only the inked strokes are opaque. Oval cartouche frame in terracotta ink with rubber-stamp imperfection — broken lines, dry-press patches, slight ink bleed at corners, faint off-register double-strike in deep indigo, edge wear on the frame. Border: a thin strip of ink-line Wayuu mochila zigzag motifs, drawn flat, no fills. Center: a burlap coffee sack with an arabica branch (leaves and cherries) draped beside it, in flat terracotta ink silhouette and line-art with deep-indigo accent flourishes on the coffee cherries. Country name "COLOMBIA" in display serif inside the top arc of the frame. "NIEVES' KITCHEN · 2026" in the lower border band.
```

### Chile
```
A passport stamp rendered as a flat ink impression on a transparent background. The frame is an outline only — no interior fill, no card or paper surface inside the silhouette. The negative space between ink lines is fully transparent; only the inked strokes are opaque. Oval cartouche frame in terracotta ink with rubber-stamp imperfection — broken lines, dry-press patches, slight ink bleed at corners, faint off-register double-strike in deep indigo, edge wear on the frame. Border: a thin strip of ink-line Mapuche stepped-diamond motifs, drawn flat, no fills. Center: rolling Atacama desert dunes against a horizon line, in flat terracotta ink silhouette and line-art with a deep-indigo accent on a distant Andean ridge. Country name "CHILE" in display serif inside the top arc of the frame. "NIEVES' KITCHEN · 2026" in the lower border band.
```

### Bolivia
```
A passport stamp rendered as a flat ink impression on a transparent background. The frame is an outline only — no interior fill, no card or paper surface inside the silhouette. The negative space between ink lines is fully transparent; only the inked strokes are opaque. Oval cartouche frame in terracotta ink with rubber-stamp imperfection — broken lines, dry-press patches, slight ink bleed at corners, faint off-register double-strike in deep indigo, edge wear on the frame. Border: a thin strip of ink-line Aymara aguayo diamond motifs, drawn flat, no fills. Center: the Salar de Uyuni salt flat with an Andean peak reflected across its mirror surface, in flat terracotta ink silhouette and line-art with deep-indigo accent on the water-reflection lines. Country name "BOLIVIA" in display serif inside the top arc of the frame. "NIEVES' KITCHEN · 2026" in the lower border band.
```

### Brazil
```
A passport stamp rendered as a flat ink impression on a transparent background. The frame is an outline only — no interior fill, no card or paper surface inside the silhouette. The negative space between ink lines is fully transparent; only the inked strokes are opaque. Oval cartouche frame in terracotta ink with rubber-stamp imperfection — broken lines, dry-press patches, slight ink bleed at corners, faint off-register double-strike in deep indigo, edge wear on the frame. Border: a thin strip of ink-line stylized banana-leaf and palm-frond geometric motifs (Tropicália-inspired but drawn as flat line-art, not poster fills), drawn flat, no fills. Center: Christ the Redeemer in back-view silhouette (no face) at the crest of Corcovado, flanked by abstracted banana leaves, in flat terracotta ink line-art with deep-indigo accent flourishes on the leaf veins. Country name "BRAZIL" in display serif inside the top arc of the frame; "BRASIL" in smaller italic below. "NIEVES' KITCHEN · 2026" in the lower border band.
```

### Venezuela
```
A passport stamp rendered as a flat ink impression on a transparent background. The frame is an outline only — no interior fill, no card or paper surface inside the silhouette. The negative space between ink lines is fully transparent; only the inked strokes are opaque. Oval cartouche frame in terracotta ink with rubber-stamp imperfection — broken lines, dry-press patches, slight ink bleed at corners, faint off-register double-strike in deep indigo, edge wear on the frame. Border: a thin strip of ink-line Wayuu and Andean geometric weave motifs combined, drawn flat, no fills. Center: Angel Falls cascading down a tepui cliff face, in flat terracotta ink silhouette and line-art with deep-indigo accent flourishes on the falling water. Country name "VENEZUELA" in display serif inside the top arc of the frame. "NIEVES' KITCHEN · 2026" in the lower border band.
```

### Ecuador
```
A passport stamp rendered as a flat ink impression on a transparent background. The frame is an outline only — no interior fill, no card or paper surface inside the silhouette. The negative space between ink lines is fully transparent; only the inked strokes are opaque. Oval cartouche frame in terracotta ink with rubber-stamp imperfection — broken lines, dry-press patches, slight ink bleed at corners, faint off-register double-strike in deep indigo, edge wear on the frame. Border: a thin strip of ink-line Otavalo textile geometric motifs, drawn flat, no fills. Center: Cotopaxi volcano with its snow-capped summit rising against the highland horizon, in flat terracotta ink silhouette and line-art with a deep-indigo accent on the snow line. Country name "ECUADOR" in display serif inside the top arc of the frame. "NIEVES' KITCHEN · 2026" in the lower border band.
```

### Paraguay
```
A passport stamp rendered as a flat ink impression on a transparent background. The frame is an outline only — no interior fill, no card or paper surface inside the silhouette. The negative space between ink lines is fully transparent; only the inked strokes are opaque. Oval cartouche frame in terracotta ink with rubber-stamp imperfection — broken lines, dry-press patches, slight ink bleed at corners, faint off-register double-strike in deep indigo, edge wear on the frame. Border: a thin strip of ink-line Ñandutí radial-spiderweb lace motifs, drawn flat, no fills. Center: a Lapacho tree in full bloom with its branching crown, in flat terracotta ink silhouette and line-art with deep-indigo accent flourishes on the blossom clusters. Country name "PARAGUAY" in display serif inside the top arc of the frame. "NIEVES' KITCHEN · 2026" in the lower border band.
```

### Uruguay
```
A passport stamp rendered as a flat ink impression on a transparent background. The frame is an outline only — no interior fill, no card or paper surface inside the silhouette. The negative space between ink lines is fully transparent; only the inked strokes are opaque. Oval cartouche frame in terracotta ink with rubber-stamp imperfection — broken lines, dry-press patches, slight ink bleed at corners, faint off-register double-strike in deep indigo, edge wear on the frame. Border: a thin strip of ink-line gaucho leather-tooled scroll paired with Charrúa stepped-geometric motifs, drawn flat, no fills. Center: a mate gourd with its bombilla straw rising from the rim, in flat terracotta ink silhouette and line-art with deep-indigo accent flourishes on the gourd's banding. Country name "URUGUAY" in display serif inside the top arc of the frame. "NIEVES' KITCHEN · 2026" in the lower border band.
```

### Guyana
```
A passport stamp rendered as a flat ink impression on a transparent background. The frame is an outline only — no interior fill, no card or paper surface inside the silhouette. The negative space between ink lines is fully transparent; only the inked strokes are opaque. Oval cartouche frame in terracotta ink with rubber-stamp imperfection — broken lines, dry-press patches, slight ink bleed at corners, faint off-register double-strike in deep indigo, edge wear on the frame. Border: a thin strip of ink-line hammock-weave geometry paired with Amerindian motifs, drawn flat, no fills. Center: Kaieteur Falls plunging from a single sandstone ledge, in flat terracotta ink silhouette and line-art with deep-indigo accent flourishes on the falling water. Country name "GUYANA" in display serif inside the top arc of the frame. "NIEVES' KITCHEN · 2026" in the lower border band.
```

### Suriname
```
A passport stamp rendered as a flat ink impression on a transparent background. The frame is an outline only — no interior fill, no card or paper surface inside the silhouette. The negative space between ink lines is fully transparent; only the inked strokes are opaque. Oval cartouche frame in terracotta ink with rubber-stamp imperfection — broken lines, dry-press patches, slight ink bleed at corners, faint off-register double-strike in deep indigo, edge wear on the frame. Border: a thin strip of ink-line Maroon textile geometry paired with Caribbean-creole motifs, drawn flat, no fills. Center: a jungle canopy with a parrot in profile silhouette perched on a branch (no face emphasis), in flat terracotta ink line-art with deep-indigo accent flourishes on the parrot's tail feathers. Country name "SURINAME" in display serif inside the top arc of the frame. "NIEVES' KITCHEN · 2026" in the lower border band.
```

---

## 13. Oceania

> Redesigned 2026-05-12 — see `docs/superpowers/specs/2026-05-12-stamp-redesign-americas-and-oceania-design.md`. These are ink-impression stamps on transparent backgrounds (shared notched-corner rectangle cartouche, ironbark-red + deep ocean-blue ink), not bark-cloth fragments. Append the universal canvas + negative-prompt boilerplate after each core prompt below before generating.

### Australia
```
A passport stamp rendered as a flat ink impression on a transparent background. The frame is an outline only — no interior fill, no card or paper surface inside the silhouette. The negative space between ink lines is fully transparent; only the inked strokes are opaque. Notched-corner rectangle cartouche frame (corners cut into stepped notches, echoing pan-Pacific geometric tapa / weaving repeats) in ironbark-red ink with rubber-stamp imperfection — broken lines, dry-press patches, slight ink bleed at corners, faint off-register double-strike in deep ocean-blue, edge wear on the frame. Border: a thin strip of Aboriginal dot-painting geometric (repeating dot-rhythm rows, no figurative content, no Dreamtime narrative imagery) drawn as flat ink dots in regular rhythm, no fills. Center: an Uluru silhouette at horizon in flat ironbark-red ink line-art with deep ocean-blue accent on the horizon line. Country name "AUSTRALIA" in display serif inside the top arc of the frame. "NIEVES' KITCHEN · 2026" in the lower border band.
```

### New Zealand
```
A passport stamp rendered as a flat ink impression on a transparent background. The frame is an outline only — no interior fill, no card or paper surface inside the silhouette. The negative space between ink lines is fully transparent; only the inked strokes are opaque. Notched-corner rectangle cartouche frame (corners cut into stepped notches, echoing pan-Pacific geometric tapa / weaving repeats) in ironbark-red ink with rubber-stamp imperfection — broken lines, dry-press patches, slight ink bleed at corners, faint off-register double-strike in deep ocean-blue, edge wear on the frame. Border: a thin strip of Māori Kowhaiwhai scroll geometry drawn as flat ink lines, no fills. Center: a koru fern unfurl silhouette in flat ironbark-red ink line-art with deep ocean-blue accent on the inner spiral. Country name "NEW ZEALAND" in display serif inside the top arc of the frame; "AOTEAROA" in smaller italic below. "NIEVES' KITCHEN · 2026" in the lower border band.
```

### Fiji
```
A passport stamp rendered as a flat ink impression on a transparent background. The frame is an outline only — no interior fill, no card or paper surface inside the silhouette. The negative space between ink lines is fully transparent; only the inked strokes are opaque. Notched-corner rectangle cartouche frame (corners cut into stepped notches, echoing pan-Pacific geometric tapa / weaving repeats) in ironbark-red ink with rubber-stamp imperfection — broken lines, dry-press patches, slight ink bleed at corners, faint off-register double-strike in deep ocean-blue, edge wear on the frame. Border: a thin strip of Fijian masi tapa cloth stamped geometric triangles drawn as flat ink lines, no fills. Center: a kava bowl (tanoa, broad wooden bowl with legs, food-object) silhouette in flat ironbark-red ink line-art with deep ocean-blue accent on the bowl's interior rim line. Country name "FIJI" in display serif inside the top arc of the frame; "Viti" in smaller italic below. "NIEVES' KITCHEN · 2026" in the lower border band.
```

### Papua New Guinea (PNG)
```
A passport stamp rendered as a flat ink impression on a transparent background. The frame is an outline only — no interior fill, no card or paper surface inside the silhouette. The negative space between ink lines is fully transparent; only the inked strokes are opaque. Notched-corner rectangle cartouche frame (corners cut into stepped notches, echoing pan-Pacific geometric tapa / weaving repeats) in ironbark-red ink with rubber-stamp imperfection — broken lines, dry-press patches, slight ink bleed at corners, faint off-register double-strike in deep ocean-blue, edge wear on the frame. Border: a thin strip of Bilum string-bag weave combined with Sepik geometric pattern, drawn as flat ink lines, no fills. Center: a Sepik river canoe silhouette in flat ironbark-red ink line-art with deep ocean-blue accent on the water line beneath the hull. Country name "PAPUA NEW GUINEA" in display serif inside the top arc of the frame. "NIEVES' KITCHEN · 2026" in the lower border band.
```

### Samoa
```
A passport stamp rendered as a flat ink impression on a transparent background. The frame is an outline only — no interior fill, no card or paper surface inside the silhouette. The negative space between ink lines is fully transparent; only the inked strokes are opaque. Notched-corner rectangle cartouche frame (corners cut into stepped notches, echoing pan-Pacific geometric tapa / weaving repeats) in ironbark-red ink with rubber-stamp imperfection — broken lines, dry-press patches, slight ink bleed at corners, faint off-register double-strike in deep ocean-blue, edge wear on the frame. Border: a thin strip of Samoan siapo tapa cloth stamped geometric repeats drawn as flat ink lines, no fills. Center: an umu earth-oven cross-section (food-object — pit with hot stones, packages of food on top) in flat ironbark-red ink line-art with deep ocean-blue accent on the heat-rising lines. Country name "SAMOA" in display serif inside the top arc of the frame. "NIEVES' KITCHEN · 2026" in the lower border band.
```

### Tonga
```
A passport stamp rendered as a flat ink impression on a transparent background. The frame is an outline only — no interior fill, no card or paper surface inside the silhouette. The negative space between ink lines is fully transparent; only the inked strokes are opaque. Notched-corner rectangle cartouche frame (corners cut into stepped notches, echoing pan-Pacific geometric tapa / weaving repeats) in ironbark-red ink with rubber-stamp imperfection — broken lines, dry-press patches, slight ink bleed at corners, faint off-register double-strike in deep ocean-blue, edge wear on the frame. Border: a thin strip of Tongan ngatu tapa cloth geometric drawn as flat ink lines, no fills. Center: a pandanus weaving silhouette (woven mat with frayed edge) in flat ironbark-red ink line-art with deep ocean-blue accent on the woven crosshatch. Country name "TONGA" in display serif inside the top arc of the frame. "NIEVES' KITCHEN · 2026" in the lower border band.
```

### Vanuatu
```
A passport stamp rendered as a flat ink impression on a transparent background. The frame is an outline only — no interior fill, no card or paper surface inside the silhouette. The negative space between ink lines is fully transparent; only the inked strokes are opaque. Notched-corner rectangle cartouche frame (corners cut into stepped notches, echoing pan-Pacific geometric tapa / weaving repeats) in ironbark-red ink with rubber-stamp imperfection — broken lines, dry-press patches, slight ink bleed at corners, faint off-register double-strike in deep ocean-blue, edge wear on the frame. Border: a thin strip of Vanuatu bark-painting geometric island motifs drawn as flat ink lines, no fills. Center: a Yasur volcano silhouette with a wisp of smoke rising from the cone, in flat ironbark-red ink line-art with deep ocean-blue accent on the smoke wisp. Country name "VANUATU" in display serif inside the top arc of the frame. "NIEVES' KITCHEN · 2026" in the lower border band.
```

### Solomon Islands
```
A passport stamp rendered as a flat ink impression on a transparent background. The frame is an outline only — no interior fill, no card or paper surface inside the silhouette. The negative space between ink lines is fully transparent; only the inked strokes are opaque. Notched-corner rectangle cartouche frame (corners cut into stepped notches, echoing pan-Pacific geometric tapa / weaving repeats) in ironbark-red ink with rubber-stamp imperfection — broken lines, dry-press patches, slight ink bleed at corners, faint off-register double-strike in deep ocean-blue, edge wear on the frame. Border: a thin strip of Solomon Islands tribal weave geometric drawn as flat ink lines, no fills. Center: a shell-money strand silhouette (rows of disc beads on cord) in flat ironbark-red ink line-art with deep ocean-blue accent on the cord knots. Country name "SOLOMON ISLANDS" in display serif inside the top arc of the frame. "NIEVES' KITCHEN · 2026" in the lower border band.
```

### New Caledonia
```
A passport stamp rendered as a flat ink impression on a transparent background. The frame is an outline only — no interior fill, no card or paper surface inside the silhouette. The negative space between ink lines is fully transparent; only the inked strokes are opaque. Notched-corner rectangle cartouche frame (corners cut into stepped notches, echoing pan-Pacific geometric tapa / weaving repeats) in ironbark-red ink with rubber-stamp imperfection — broken lines, dry-press patches, slight ink bleed at corners, faint off-register double-strike in deep ocean-blue, edge wear on the frame. Border: a thin strip of Kanak woven basket geometric drawn as flat ink lines, no fills. Center: a coral reef silhouette (branching coral structures, NOT Jeu de Tour totem — has face) in flat ironbark-red ink line-art with deep ocean-blue accent on the surrounding water line. Country name "NEW CALEDONIA" in display serif inside the top arc of the frame; "Nouvelle-Calédonie" in smaller italic below. "NIEVES' KITCHEN · 2026" in the lower border band.
```
