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

**One per unique recipe.** Each unique recipe cooked from a country adds a
cancellation mark to that country's visa. Recooking the same recipe does
**not** add a new mark — the cancellation is a record of *what* you've
cooked from that country, not *how many times*.

*(Earlier model: one cancellation per `passport_stamps` row, which meant
cooking the same dish three times produced three identical-looking
postmarks stacked on the same country. At booklet-render sizes that
read as visual noise — "the page is messy" rather than "I cook from
here a lot". Deduplicating by recipe keeps the page reading as a
record of breadth, with repetition expressed elsewhere — total
`mealsCooked` on the inside-front profile, the §5 frequent-visitor
seal at 10 total cooks.)*

**Visual brief — fixed across all countries:**

- A **circular postmark**, ~46% of the visa's longest edge.
  *(Earlier drafts: 28% → 40% → 46%. At booklet-render sizes the
  smaller marks made the date and recipe title illegible; each bump
  was driven by visual review on the scratch route at `/dev/cancellation`.
  46% keeps the postmark legible at a glance while still respecting
  the visa's frame and leaving room for the rotation slots in §4. If
  this still doesn't read at the §9 stamp size, the fallback is a
  variable size: thumbnail in the booklet, larger popover on hover/tap.)*
- A thin outer ring of ink, with a slight gap or break (a real postmark
  is hand-pressed, not a perfect circle).
- A second concentric inner ring at ~35% of the outer diameter, also broken.
  *(Earlier drafts: 70% → 55% → 40% → 35%. Each step pulled the inner
  ring further down to a small concentric mark around the per-country
  glyph, so the title + date band is unambiguously the postmark's
  focal element. ~35% means the inner ring is small enough to read as
  a centre framing mark rather than a competing structural ring.)*
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

Each unique `(user_id, recipe_country, recipe_slug)` in
`public.passport_stamps` produces exactly one cancellation. Repeat
cooks of the same recipe are deduplicated at render time inside
`useCookedStamps`, keeping the **earliest** `cooked_at` (the date you
first earned that postmark — the passport-stamp metaphor). The schema
doesn't need to change for this system; everything the cancellation
needs is already there:

| Cancellation element | Source |
|---|---|
| Recipe title (top arc)       | `recipes.title` joined on `recipe_slug` |
| Cook date (bottom arc)       | Earliest `cooked_at` for that recipe, formatted `DD MMM YY` |
| Country (which visa to stack on) | `recipe_country` |
| Centre-mark glyph            | Per-country map in the cancellation component (see §8 step 7) |
| Postmark centre + rotation   | Seeded from `(recipe_country, recipe_slug)` — see §4 |
| Ink colour                   | Region of `recipe_country` → §6 table |

No ordinal index is needed — see §4. Placement is a pure function of
`(recipe_country, recipe_slug)`, computed in `useCookedStamps` from
the deduplicated set. The earliest `cooked_at` per slug is the cook
date shown on the postmark.

The `CookTier` (`new_country | new_recipe | repeat`) returned by
`useLogCook` is **not** used by the cancellation layer — it only powers
the live unlock animation in `CookedButton`. Cancellations look the same
regardless of tier. (If you ever want them to differ — e.g. bolder ink
on `new_recipe` — wire it through here, not via a new DB column.)

---

## 4. Layering flow (the "dumpling-lasagna")

Unique recipes from the same country stack. The visa is the dough,
cancellations are the fillings layered on top:

| Unique recipes cooked | What's drawn |
|------------|--------------|
| 0          | Empty slot — no visa, no cancellation. The slot is dim. |
| 1          | Visa visible at full opacity. One cancellation at its seeded perimeter position. |
| 2+         | Visa + N cancellations, each at its own seeded perimeter position. Each new recipe occupies its own spot; existing postmarks never move. |
| 6+         | Soft cap kicks in — see §5. |

**Seeded polar placement.** Each unique recipe's postmark position is
a deterministic function of `(country, recipe_slug)` — *not* of its
position in any list. Three independent FNV-1a hashes of the same
seed string yield three [0, 1) values:

- **Angle** — uniform in `[0°, 360°)`. The compass direction the
  postmark sits from the visa's centre.
- **Radius** — uniform in `[36%, 44%]` of the visa box. With a
  postmark half-width of ~23%, centres in this band put the postmark
  at the visa's perimeter with up to a third hanging off the edge,
  mimicking real over-edge postmarking. The centre of the visa
  (landmark + country name) stays clear.
- **Rotation** — `±12°` jitter applied to the postmark itself.

The seed is `country.toLowerCase():recipe_slug.toLowerCase()`, so the
positions are stable across casing drift and identical across
renders, refreshes, and re-mounts. They are also **independent across
recipes**: adding a new recipe, undoing a cook, or recooking an
existing recipe never shifts any other postmark.

Italy and Japan stamp Carbonara in different spots; Italy stamps
Carbonara in the same spot every time, forever. The page acquires a
fingerprint.

*(Why we replaced the earlier fixed-slot model: 5 hand-picked corner
slots looked geometric — three recipes formed a perfect right
triangle, four a perfect rectangle. That reads as designed, not
earned. The fifth slot was also an orphan (bottom-edge rather than a
corner) and broke the symmetry the other four set up. Seeded polar
placement removes the slot vocabulary entirely; the postmarks just
land where their seed puts them.)*

**Aspect ratio is handled implicitly.** Positions are in `%` of the
visa's bounding box, so a landscape visa (Hong Kong) gives postmarks
more horizontal spread than a portrait one (China) — the polar circle
maps onto the visa's actual ellipse for free. No explicit aspect
branch needed.

**Collision honesty.** Seeded placement *can* place two postmarks
close together by chance. With ~4–5 unique recipes per country in
practice and a 16%-wide radial band to spread across, the probability
is low; the brief explicitly accepts overlap. If a country routinely
hits 6+ unique recipes and collisions become a real visual problem,
the §5 soft-cap (fade older postmarks under newer ones) handles it
before any reseeding is needed.

---

## 5. Patina rules

The page must keep reading well past the 5th cook. One mechanism only —
soft-cap fading.

**Soft cap at 5 visible cancellations.** Once a country has 6 or more
unique recipes cooked:

- The 5 most recently *first-cooked* recipes remain at full opacity.
- Older cancellations are *not removed* — they fade to ~40% opacity and
  slide partially under the visible ones. This is the patina: the ink
  builds up where many cancellations land but never erases the visa.
- The composite ink starts to look denser, like a much-used passport page.

**No corner seal.** Earlier drafts of this SPEC proposed a gold-foil
star seal at 10 total cooks. Built (commit log: step 6) and then
removed after visual review on 2026-05-13:

- It read as a video-game achievement badge — exactly the
  gamification §1 anti-goals.
- Gold doesn't fit the parchment / terracotta / sepia palette; it
  stuck out as visually foreign.
- Repetition is already expressed elsewhere — `mealsCooked` on the
  inside-front profile, plus the explorer tier titles in `lib/passport.ts`.
  A third channel for the same data was overkill.

If a future repetition indicator is wanted, **don't** revisit the gold
star. Editorial alternatives that stayed on the table: a thin warm
border accent on the visa frame, or a wax-seal-style mark in
wine/terracotta (distinct shape from the postmarks). Neither is shipped.

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
like (e.g. for Western Europe, use `france.webp`; for East Asia,
`china.webp` and `japan.webp`).

The cancellation ink colour, by contrast, is a hard rule — every
cancellation in a region uses the same ink, so a stack of cancellations
on India and Pakistan look like they came from one ink pad.

**Shared ink-impression grammar (most regions).** Visas authored from
2026-05-11 onward share an ink-impression-on-transparent grammar:
closed silhouette frame as an outline only (no interior fill or
substrate), flat ink line-art motifs, two ink colours only (primary +
sparing accent), explicit rubber-stamp imperfection (broken lines,
dry-press patches, ink bleed at corners, faint off-register
double-strike in the accent ink, edge wear on the frame), and pure
transparent background — generated against white outside *and inside*
the silhouette, keyed to alpha before staging. **Western Europe,
Eastern Europe, East Asia, and North America are anchor aesthetics**
that predate or sit outside this rule and stand as-is. All other
regions follow the cartouche + palette in the table below.

| Region (`CulinaryRegion`) | Visa style — vocabulary for new countries | Cancellation ink (CSS var) |
|---|---|---|
| **Western Europe**       | *Anchor aesthetic — kept as-is.* Editorial brown-ink line-art with engraved-postage feel — shield/tablet frame, landmark vignette in fine line, fleurons & cancellation marks at edges. Reference: `france.webp`, `greece.webp`. | Terracotta (`--stamp-ink-terracotta`) |
| **Eastern Europe**       | *Anchor aesthetic — kept as-is.* Same as Western Europe — editorial brown-ink, slightly heavier border treatment. Reference: `croatia.webp`, `hungary.webp`, `poland.webp`. | Terracotta (`--stamp-ink-terracotta`) |
| **East Asia**            | *Anchor aesthetic — kept as-is.* Literati album page — per-country silhouette (tall / circular / square / oval / horizontal), sumi-ink landscape in warm grey with turmeric/ochre wash, carved vermilion seal-script chop in one corner. Reference: `china.webp`, `japan.webp`, `taiwan.webp`. | Vermilion (`--stamp-ink-wine`) |
| **Southeast Asia**       | Shared ink-impression grammar. Lotus-petal scalloped rectangle cartouche, jade-green primary + saffron-ochre accent, ink-line border of country-specific textile / scroll motif (Thai kanok / Đông Hồ / songket / batik *parang* / Yakan / Peranakan / Khmer apsara / Lao *sinh* / Burmese acanthus / Bruneian songket / Tais). **Density layers (2026-05-17 enrichment):** every Southeast Asia stamp adds (a) four small ink-line corner glyph panels at the cardinal corners of the lotus-petal cartouche, vocabulary drawn from a non-border-register of the country's own heritage so the corner layer never echoes the section's textile / scroll border (Yantra *sak yant* script-block geometric for Thailand; Dong Son bronze-drum concentric-ring rosette for Vietnam; Wau bulan moon-kite geometric ornament for Malaysia; Gunungan tree-of-life geometric for Indonesia; Baybayin script-block calligraphic for Philippines; stylised Merlion seal-glyph for Singapore; Khmer naga serpent-head geometric seal for Cambodia; Plain of Jars stone-vessel medallion geometric for Laos; Pyu coin *srivatsa* medallion geometric for Myanmar; Jawi calligraphic script-block for Brunei; Belak metal pectoral disc medallion geometric for Timor-Leste); (b) a thin fine-ink ecology horizon strip behind the central subject — northern karst mountain horizon with a sparse monsoon-forest silhouette for Thailand; Ha Long Bay karst-island horizon with a distant junk-boat silhouette for Vietnam; Cameron Highlands tea-terrace horizon with a sparse pine silhouette for Malaysia; Sumatran rainforest canopy horizon with a distant orangutan silhouette for Indonesia; Chocolate Hills horizon with sparse coconut palm silhouette for Philippines; Singapore harbour horizon with a distant tongkang lighter-boat silhouette and a row of mangrove palms for Singapore; Tonle Sap lake horizon with a distant floating-village stilt-house silhouette for Cambodia; Mekong river horizon with a distant longboat silhouette and a row of bamboo for Laos; Inle Lake horizon with a distant Intha leg-rower fisherman silhouette and a row of stilt-houses for Myanmar; South China Sea coastal mangrove horizon with a distant fishing-boat silhouette for Brunei; Atauro Island coastal horizon with a distant fishing-pirogue silhouette and a coral-reef shoal silhouette for Timor-Leste. Both layers render as flat ink line-art with transparent interior — the heritage vocabulary names the *shape*, never the material. | Warm sepia (`--stamp-ink-brown`) |
| **South Asia**           | Shared ink-impression grammar, split into two sub-region cartouches. **South Asia proper** (India, Pakistan, Bangladesh, Sri Lanka, Nepal, Bhutan): cusped temple-arch rectangle, madder-red primary + deep-indigo accent, ink-line border of Ajrakh / Phulkari / Nakshi Kantha / Sri-Lankan batik / Dhaka weave / Bhutanese kira silk. **Density layers (2026-05-17 enrichment) for South Asia proper:** every stamp adds (a) four small ink-line corner glyph panels at the cardinal corners of the cusped temple-arch, vocabulary drawn from a non-textile register of the country's own heritage so the corner layer never echoes the textile border (Indus Valley seal-glyph for India; Truck-art rosette geometric for Pakistan; Nakshi Pitha alpana floor-pattern geometric for Bangladesh; Polonnaruwa moonstone *sandakada pahana* concentric-band semi-circle for Sri Lanka; Newari mandala for Nepal; drukpa thunder-dragon stylised glyph for Bhutan); (b) a thin fine-ink ecology horizon strip behind the central subject — Thar Desert dune horizon with a lone camel-thorn acacia silhouette for India; Karakoram high-mountain horizon with K2 silhouette and lone juniper for Pakistan; Brahmaputra delta horizon with rice-paddy terraces and areca-palm fringe for Bangladesh (variant routed off the Sundarbans mangrove to avoid mangrove-on-tiger echo with the centerpiece); Sri Lankan coastal palm horizon with a distant stilt-fisherman silhouette for Sri Lanka; Kathmandu Valley terraced-hillside horizon with a distant chorten / stupa silhouette for Nepal (variant routed off the Annapurna ridge to avoid mountain-on-mountain echo with the centerpiece); Bumthang valley terraced-field horizon with a distant dzong tower silhouette for Bhutan (variant routed off Paro to avoid valley-on-cliff echo with the Tiger's Nest centerpiece). Both layers render as flat ink line-art with transparent interior — the heritage vocabulary names the *shape*, never the material. **Central Asia** (Afghanistan, Kazakhstan, Uzbekistan, Turkmenistan, Kyrgyzstan, Tajikistan): Timurid *pishtaq* pointed-arch, Suzani-indigo primary + saffron-ochre accent, ink-line border of Baluch carpet / Shyrdak felt / Suzani / Turkmen gul-medallion / Atlas ikat. Afghanistan sits in the Central Asia subfamily despite its `CulinaryRegion` value. **Density layers (2026-05-17 enrichment) for Central Asia:** every stamp adds (a) four small ink-line corner glyph panels at the cardinal corners of the Timurid *pishtaq* pointed-arch, vocabulary drawn from a non-textile register of the country's own heritage so the corner layer never echoes the textile border (Gandharan Buddhist stone-relief medallion geometric for Afghanistan; four Kazakh *tamga* tribal brand-marks — Argyn, Naiman, Kerey, Uysun — for Kazakhstan; Sogdian script-block calligraphic for Uzbekistan; Margiana / BMAC Bronze Age cylinder-seal geometric for Turkmenistan; Saimaluu-Tash petroglyph abstract-animal geometric for Kyrgyzstan; Pamiri *chid-khona* ceiling cosmogram geometric for Tajikistan); (b) a thin fine-ink ecology horizon strip behind the central subject — Helmand desert horizon with a Kuchi nomad caravan silhouette for Afghanistan; Mangystau chalk-cliff plateau horizon with sparse saxaul tree silhouette for Kazakhstan (variant routed off open steppe to avoid steppe-on-steppe echo with the yurt centerpiece); Kyzylkum desert horizon with a Silk Road camel caravan silhouette for Uzbekistan; Karakum desert horizon with a lone tamarisk silhouette and a distant oasis date-palm cluster for Turkmenistan; Issyk-Kul lake horizon with a distant alpine shoreline pine silhouette for Kyrgyzstan (variant routed off the Tian Shan to avoid mountain-on-mountain echo with the centerpiece); Fergana valley / Tajik Sughd horizon with apricot-orchard silhouette and a distant poplar windbreak for Tajikistan (variant routed off the Pamir to avoid mountain-on-mountain echo with the centerpiece). Both layers render as flat ink line-art with transparent interior — the heritage vocabulary names the *shape*, never the material. | Indigo (`--stamp-ink-navy`) |
| **Middle East**          | Shared ink-impression grammar, split into two sub-region cartouches. **West Asia / Levant** (Turkey, Lebanon, Syria, Palestine, Jordan, Iran, Iraq, Armenia, Azerbaijan, Georgia, Cyprus): per-country silhouette (square / octagonal / hexagonal / mihrab / khachkar / Bagrati / Byzantine octagonal / diamond), cobalt-blue primary + tomato-red accent, ink-line border of Iznik motifs (tulips, carnations, saz leaves, arabesque). **Density layers (2026-05-17 enrichment) for West Asia / Levant:** every stamp adds (a) four small ink-line corner glyph panels at the cardinal corners of each country's silhouette, vocabulary drawn from a non-Iznik register of the country's own heritage so the corner layer never echoes the Iznik border (Ottoman *tughra* calligraphic-seal for Turkey; Phoenician *abjad* letter-glyph block for Lebanon; Palmyrene Aramaic script-block for Syria; Tatreez cross-stitch geometric for Palestine; Nabataean Petra compass-rosette geometric for Jordan; Persepolis Achaemenid cuneiform script-block for Iran; Sumerian ziggurat stepped-tower geometric for Iraq; Arevakhach eternity-sign sun-spiral for Armenia; Sheki Shebeke window-lattice geometric for Azerbaijan; Bolnisi cross geometric for Georgia; Geometric-period Cypriot pottery concentric-band geometric for Cyprus); (b) a thin fine-ink ecology horizon strip behind the central subject — Anatolian plateau with a distant Cappadocian fairy-chimney silhouette and a lone juniper for Turkey; Eastern Mediterranean coast with olive grove and cypress sentinels for Lebanon (routed off the Mount-Lebanon cedar ridge to avoid cedar-on-cedar echo with the centerpiece), Syria, and Palestine; Wadi Rum / Jordan Rift sandstone with a lone acacia for Jordan; Persian plateau / Zagros mountain with sparse juniper for Iran; Tigris river with date-palm fringe and a distant Marsh-Arab mudhif silhouette for Iraq; Caspian coast with Absheron pomegranate and a lone juniper for Azerbaijan; South Caucasus alpine pasture with wildflower meadow and a distant stone-church silhouette for Armenia and Georgia (both routed off the named Mt Ararat / high Caucasus peaks behind their centerpieces — horizon kept lower-altitude to avoid mountain-on-mountain echo); Troodos pine ridge for Cyprus. Both layers render as flat ink line-art with transparent interior — the heritage vocabulary names the *shape*, never the material. **Arabian Peninsula** (Saudi Arabia, Yemen, Oman, UAE, Qatar, Bahrain, Kuwait): shared multi-lobed cusped Islamic arch cartouche, brass-ochre primary + oxblood accent, ink-line border of country-specific sadu textile geometry. **Density layers (2026-05-17 enrichment) for Arabian Peninsula:** every stamp adds (a) four small ink-line corner glyph panels at the cardinal corners of the cartouche, vocabulary drawn from the country's own heritage (Najdi carved-door stepped-geometric for Saudi Arabia; Hadhrami tower-house stepped-parapet for Yemen; Bahla pottery-stamp geometric for Oman; four Bedouin *wasm* tribal brand-marks — one per major Trucial tribe — for UAE; pearl-and-oyster medallion for Qatar; Dilmun cylinder-seal for Bahrain; old-Kuwait gypsum-fretwork window-screen geometric for Kuwait); (b) a thin fine-ink ecology horizon strip behind the central subject — Rub' al-Khali / Empty Quarter dune horizon with a distant date-palm oasis cluster for Saudi Arabia, UAE; Hajar / Yemeni-highland mountain horizon with terraced step-fields and sparse juniper silhouette for Oman, Yemen; Arabian / Persian Gulf coast horizon with a lateen-rigged dhow silhouette and a faint pearling-float line for Qatar, Bahrain, Kuwait. Both layers render as flat ink line-art with transparent interior — the heritage vocabulary names the *shape*, never the material. | Tomato red (`--stamp-ink-wine`) |
| **North Africa**         | Shared ink-impression grammar. Moorish horseshoe / keyhole arch cartouche, Saharan-ochre primary + Tuareg-indigo accent, ink-line border of Amazigh / Berber / Tifinagh / hieroglyphic / Nubian motifs. **Density layers (2026-05-16 enrichment):** every North Africa stamp adds (a) four small ink-line corner glyph panels at the cardinal corners of the cartouche, vocabulary drawn from the country's own heritage (Zellij eight-point star-rosette + Andalusian arabesque for Morocco; Kabyle silver-jewellery filigree rosette + Mzab geometric for Algeria; Kairouan tile star-rosette + Carthaginian Tanit sigil for Tunisia; Garamantian rock-engraving abstract-figure + Cyrenaican Greek-meander for Libya; Coptic interlace + Mamluk geometric-star for Egypt; Meroitic script-block + Beja kinship-mark for Sudan; Maghrebi-Kufic calligraphic seal + Moor tribal-mark for Mauritania; Sahrawi henna-tattoo geometric + Reguibat tribal-mark for Western Sahara); (b) a thin fine-ink ecology horizon strip behind the central subject — Atlas Mountains foothills with palmeraie and cypress for Morocco, Algeria, Tunisia; Mediterranean coast with olive grove and low cypress sentinels for Libya (Libya center edited 2026-05-16 — "against the desert horizon" stripped to clear the way for the Med-coast horizon since Leptis Magna is geographically Mediterranean); Nile river horizon with feluccas and date-palm fringe for Egypt, Sudan; Saharan dune horizon with a caravan silhouette and date-palm oasis for Mauritania; Atlantic-Saharan coast horizon (Saharan Atlantic shore with breaking-wave line, variant to avoid echoing the Sahrawi dune-and-tent centerpiece) for Western Sahara. Both layers render as flat ink line-art with transparent interior — the heritage vocabulary names the *shape*, never the material. | Tuareg indigo (`--stamp-ink-navy`) |
| **Sub-Saharan Africa**   | Shared ink-impression grammar, split into three sub-region cartouches. **West Africa**: rounded rectangle with stepped (calabash-band) corners, kente-gold primary + kola-red accent, ink-line border of Adire / Kente / Adinkra / Bògòlanfini / Korhogo / wax-print / mud-cloth. **Density layers (2026-05-16 enrichment):** every West Africa stamp adds (a) four small ink-line corner glyph panels at the cardinal corners of the rounded-rectangle cartouche, vocabulary drawn from the country's own heritage (Adinkra symbols for Ghana — Sankofa, Gye Nyame, Dwennimmen, Akoma — one per corner; Adire Eleko stencil-rosettes for Nigeria; Tukulor calabash-rosettes for Senegal; Bògòlanfini block glyphs for Mali; Senufo/Korhogo abstract-figurative glyphs for Côte d'Ivoire; Fon royal-appliqué stamps for Benin; Mossi/Bobo geometric glyphs for Burkina Faso; Ewe Adinkra-adjacent glyphs for Togo; four Tuareg-cross regional variants for Niger — Agadez, Iférouane, Tahoua, Zinder; Manding textile geometry for Guinea; Mende sowei geometric glyphs for Sierra Leone; Mandinka strip-weave blocks for Gambia; Vai-syllabary glyphs for Liberia; Bijagós / Pano di pinte abstract glyphs for Guinea-Bissau); (b) a thin fine-ink ecology horizon strip behind the central subject — Sahel dune-and-acacia horizon for Mali, Niger, Burkina Faso, and Atlantic-coast palm row with a breaking-wave line for Senegal, Gambia, Guinea-Bissau, Guinea, Sierra Leone, Liberia, Côte d'Ivoire, Ghana, Togo, Benin, Nigeria. Both layers render as flat ink line-art with transparent interior — the heritage vocabulary names the *shape*, never the material. **East Africa**: lobed Coptic-cross / shield, savanna-terracotta primary + Coptic-jade accent, ink-line border of Coptic interlace / Maasai bead-grid / Imigongo / barkcloth / Karamojong bead-zigzag. **Density layers (2026-05-16 enrichment):** every East Africa stamp adds (a) four small ink-line corner glyph panels at the cardinal corners of the cartouche, vocabulary drawn from the country's own heritage (four Coptic-cross variants — Lalibela, Axum, Gondar, Geez — for Ethiopia; Tigrayan bead-row + Saho geometric for Eritrea; Maasai bead-grid roundels for Kenya; Tinga-Tinga geometric / alt Maasai bead-grid for Tanzania; Karamojong bead-zigzag + Buganda barkcloth medallions for Uganda; Imigongo triangular-spiral panels for Rwanda; tighter Imigongo-adjacent spirals for Burundi; Somali aroos / henna-scroll medallions for Somalia; Afar / Issa bead-zigzag blocks for Djibouti; Nuer / Dinka scarification-pattern glyphs for South Sudan); (b) a thin fine-ink ecology horizon strip behind the central subject — highland horizon (jagged volcanic peaks + lone juniper silhouette) for Ethiopia, Burundi, Uganda; Albertine Rift ridge with a Lake Kivu glint for Rwanda (variant to avoid echoing the Virunga centerpiece); savanna / Rift-Valley escarpment with a lone acacia silhouette for Kenya, Tanzania, South Sudan; Red Sea / Indian Ocean coastal horizon with a single lateen-rigged dhow silhouette for Somalia, Djibouti, Eritrea. Both layers render as flat ink line-art with transparent interior — the heritage vocabulary names the *shape*, never the material. **Southern + Central Africa**: stepped-gable rectangle (Ndebele homestead silhouette), Kuba-umber primary + Ndebele-cobalt accent, ink-line border of Ndebele wall / Kuba cloth / Tchokwe / Basotho blanket / Capulana / Tikar. **Density layers (2026-05-16 enrichment):** every Southern + Central Africa stamp adds (a) four small ink-line corner glyph panels at the cardinal corners of the cartouche, vocabulary drawn from the country's own heritage (Ndebele stepped-chevron / Esther-Mahlangu rhombus glyphs for South Africa; Shona pottery-rosette + Ndebele stepped-rhombus glyphs for Zimbabwe; Capulana paisley-roundel + Makonde abstract-geometric glyphs for Mozambique; Bamileke royal-stamp geometric + Tikar bead-medallion glyphs for Cameroon; four Kuba royal-sigil monogram glyphs for DRC; Tchokwe *sona* closed-curve glyphs for Angola; Basotho Litema wall-pattern panels for Lesotho; Bemba *mphandwe* rosette + Tonga geometric glyphs for Zambia; Tswana basket coil-rosette glyphs for Botswana; Himba *erembe* headdress-geometry + San rock-art abstract-figure glyphs for Namibia; Chewa Gule-Wamkulu abstract-mask geometry + Yao tile-pattern glyphs for Malawi; Swazi shield-tassel geometric + Sibhaca stepped-band glyphs for Eswatini; Kongo cosmogram four-pointed glyphs + Téké geometric for Republic of Congo; Punu abstract-geometric + Fang reliquary geometric glyphs for Gabon; Toubou kinship-mark + Sara abstract-geometric panels for Chad; Mbuti barkcloth roundel + Zande linear-geometric glyphs for CAR); (b) a thin fine-ink ecology horizon strip behind the central subject — Highveld / Drakensberg escarpment with low veld grass for South Africa, Lesotho, Eswatini; Miombo woodland horizon (brachystegia / msasa silhouettes receding) for Zimbabwe, Mozambique, Angola, Zambia, Malawi; Congo Basin rainforest canopy (overlapping tree-crowns receding) for Cameroon, DRC, Republic of Congo, Gabon; Kalahari camelthorn savanna (low flat horizon, scattered camelthorns) for Botswana; Sahara dune + Tibesti ridge with lone acacia for Chad; Sangha river through canopy (variant to avoid echoing the rainforest-canopy centerpiece) for CAR; Skeleton Coast Atlantic horizon (Benguela cold-sea line + low coastal cliff, variant to avoid echoing the Sossusvlei centerpiece) for Namibia. Both layers render as flat ink line-art with transparent interior — the heritage vocabulary names the *shape*, never the material. | **Forest** (`--stamp-ink-forest`) — Coptic-jade tone. *Replaces previous Terracotta to avoid colliding with East Africa's terracotta primary.* |
| **North America**        | *Anchor aesthetic — kept as-is.* 1930s commemorative engraved postage — horizontal rectangle (USA) or tall vertical rectangle (Canada), dense engraved cross-hatch in two inks only (sepia + barn-red for USA; sepia + indigo for Canada), Beaux-Arts laurel border with denomination corner. Reference: `united-states.webp`, `canada.webp`. | Barn red (`--stamp-ink-wine`) |
| **South America**        | Split into three sub-regions across two grammars (see Cabinet etching addendum below the table for full grammar definition). **Mesoamerica** (Mexico, Guatemala, Belize, Honduras, El Salvador, Nicaragua, Costa Rica, Panama) — *Cabinet etching grammar (2026-05-17)*: single-ink Maya blue / deep indigo, no outer cartouche (the illustration itself bounds the stamp), full-bleed fine-line engraved vignette with cross-hatching for tonal depth, arched serif title text wrapping the top of the illustration, bold sans-serif country name block underneath. Honest to the Maya / Aztec codex tradition (Codex Borgia, Dresden Codex). Replaces the previous stepped-pyramid + cinnabar/jade cartouche spec. No 2-layer enrichment needed — density is baked into the hatching. **Caribbean** (Cuba, Jamaica, Puerto Rico, Trinidad & Tobago, Haiti, Dominican Republic, Bahamas, Barbados) — *Cabinet etching grammar (2026-05-17)*: single-ink colonial sepia, same grammar as Mesoamerica (full-bleed engraved vignette, no cartouche, arched serif title + bold sans-serif country block). Honest to the colonial-era rum-label / cigar-label engraving tradition. Replaces the previous scalloped-oval + colonial-teal/coral cartouche spec. No 2-layer enrichment needed. **Andean S. America incl. Brazil** (Peru, Argentina, Colombia, Chile, Bolivia, Venezuela, Ecuador, Paraguay, Uruguay, Guyana, Suriname, Brazil): shared oval cartouche, terracotta primary + deep-indigo accent, ink-line border of Quechua / Mapuche / Wayuu / Otavalo / Aymara / gaucho-leather / Ñandutí / hammock / Maroon-creole motifs. Brazil joins the Andean grammar (Tropicália exception retired). **Density layers (2026-05-16 enrichment):** every Andean stamp adds (a) four small ink-line corner glyph panels at the cardinal corners of the oval, vocabulary drawn from the country's own heritage (tocapu for Quechua-rooted countries, Wayuu kanas, Mapuche rhombus, Aymara/Tiwanaku, Otavalo, Ñandutí radial, Charrúa, Marajoara, Maroon Asafo, Amerindian geometric); (b) a thin fine-ink ridgeline behind the central subject (Andes for Andean countries, Serra do Mar / Atlantic coastal ridge for Brazil, Guiana Shield tepui ridge for Guyana / Suriname); (c) a small heritage seal flourish in the indigo double-strike near the bottom interior of the cartouche (chakana stepped-cross for Andean countries, Marajoara stepped-diamond medallion for Brazil, Maroon Asafo geometric seal for Guyana / Suriname). All three layers render as flat ink line-art with transparent interior — the heritage vocabulary names the *shape*, never the material. | Mesoamerica: **Cochineal red** (`--stamp-ink-wine`) — warm contrast against Maya-blue primary, honest Mesoamerican pigment (cochineal from Oaxaca); replaces previous indigo to avoid indigo-on-indigo cancellation. Caribbean: **Indigo** (`--stamp-ink-navy`) — cool indigo over warm sepia primary reads cleanly. Andean: **Indigo** (`--stamp-ink-navy`). |
| **Oceania**              | Shared ink-impression grammar. Notched-corner rectangle cartouche, ironbark-red primary + deep-ocean-blue accent, ink-line border of country-specific tapa / Aboriginal dot-painting / Māori Kowhaiwhai / Bilum + Sepik / siapo / ngatu / Vanuatu bark-painting / Solomon weave / Kanak basket geometry. **Density layers (2026-05-17 enrichment):** every Oceania stamp adds (a) four small ink-line corner glyph panels at the cardinal corners of the notched-corner rectangle, vocabulary drawn from a non-textile / non-border register of the country's own heritage so the corner layer never echoes the section's tapa / dot-painting / scroll / weave border (Aboriginal rock-engraving geometric — concentric waterhole rings, parallel-line songline marks, goanna-track, hand-stencil rectangle — for Australia; Māori non-scroll vocabulary — hei matau fishhook pendant, Tukutuku poutama stepped-lattice, kūmara mound concentric medallion, pātiki diamond — for New Zealand; tabua whale-tooth pendant + drua double-hull canoe + totokia war-club spike + sevusevu kava-root bundle for Fiji; kundu hourglass-drum + kina pearl-shell crescent pendant + Trobriand mwali armshell ring + Highland boar-tusk pendant for Papua New Guinea; Tatau pe'a-tattoo abstract motif + Lapita pottery stamped-triangle band + tanoa kava-bowl + 'ava tava'e ladle for Samoa; Lalava sennit-lashing braid + apa'apai war-club + kalia double-canoe + Ha'amonga 'a Maui trilithon for Tonga; sand-drawing continuous-line geometric + tamtam slit-gong + kava root-bundle + namele palm-frond for Vanuatu; Solomon barava clam-shell carved-fretwork medallion + tomoko war-canoe prow architectural form + bonito atu fish + frigatebird in flight for Solomon Islands; flèche faîtière hut-spire architectural form + Kanak petroglyph spiral + Notou imperial-pigeon + mangrove pneumatophore root-bundle for New Caledonia); (b) a thin fine-ink ecology horizon strip behind the central subject — Outback eucalyptus woodland horizon with sparse mulga / gum-tree silhouettes and a distant kangaroo silhouette for Australia (variant routed off the Red Centre desert to avoid desert-on-desert echo with the Uluru centerpiece); Aoraki / Mt Cook Southern Alps ridge horizon with a tussock-grass line and a distant kea bird silhouette for New Zealand; Yasawa coastal horizon with a coconut palm fringe and a distant mangrove silhouette for Fiji; Highland kunai grassland horizon with a sparse pandanus silhouette and a distant Owen Stanley Range ridgeline for Papua New Guinea (variant routed off the Sepik river to avoid river-on-river echo with the canoe centerpiece); Upolu coastal horizon with a coconut palm fringe and a distant 'alia outrigger silhouette for Samoa; Vava'u coastal horizon with a coconut palm fringe and a distant humpback-whale tail-fluke silhouette for Tonga; Tanna Island coastal horizon with a coconut palm fringe and a distant outrigger canoe silhouette for Vanuatu (variant routed off the volcanic interior to avoid volcano-on-volcano echo with the Yasur centerpiece); Marovo lagoon horizon with a coconut palm fringe and a distant barrier-reef breaking-wave line for Solomon Islands; araucaria column-pine forest horizon with a distant Grande Terre ridgeline for New Caledonia (variant routed off the lagoon to avoid reef-on-reef echo with the coral-reef centerpiece). Both layers render as flat ink line-art with transparent interior — the heritage vocabulary names the *shape*, never the material. | Deep ocean-blue (`--stamp-ink-navy`) |

**Cabinet etching grammar (alternate to cartouche + two-tone, introduced 2026-05-17).** Most regions use the cartouche + two-tone grammar described in the table above. **Cabinet etching** is a documented alternate grammar adopted to introduce visual rhythm across the booklet so the 100+ stamps don't read as variations on a single frame. Inspired by real engraved-vignette passport stamps (e.g., the Peruvian Machu Picchu visa stamp).

Defining traits:
- **Single ink only** (not two-tone). Per-region ink chosen for cultural honesty + cancellation contrast.
- **No outer cartouche frame** — the illustration itself bounds the stamp; only the inked strokes are opaque, the rest is transparent.
- **Full-bleed fine-line engraved vignette** — the central subject is rendered as a fine-line illustration with cross-hatching for tonal depth (rather than as a flat silhouette inside a frame). The hatching acts as the density layer — no separate corner glyphs or horizon strip needed.
- **Arched serif title text** wraps the top of the illustration (e.g., a "PARQUE…" arc or a "NIEVES' KITCHEN · 2026" arc).
- **Bold sans-serif country / location name block** sits underneath the illustration as a slab title.
- **Optional native script** appears in smaller weight near the title block.
- Rubber-stamp imperfection clause still applies (broken lines, dry-press patches, ink bleed at extremes, edge wear on the strokes — but no off-register double-strike since this is a single-ink grammar).
- Per-country distinctiveness comes from the **illustration subject** (a unique landmark / cultural scene per country), not from a border textile.

Currently assigned to: **Mesoamerica** (single ink: Maya blue / deep indigo) and **Caribbean** (single ink: colonial sepia). All other regions stay in the cartouche + two-tone grammar.

**Important honesty:** several existing visas on disk predate the
ink-impression grammar (cotton-paper / Iznik-tile / Bedouin-cloth /
caravanserai-wall / artisan-cloth / weathered-linen / plastered-wall /
papel-picado / Andean-cloth / bark-cloth / Tropicália-poster variants).
Treat those as placeholders. The style descriptions above are the
**authoring target** for new countries and for any future regeneration
of the placeholders. Don't quietly swap them out (see §2 — visas never
change once shipped); if a regeneration is wanted, ship the new file
alongside under a versioned name and update `CUSTOM_STAMPS`
deliberately.

**Cancellation ink CSS variables.** The variable names above
(`--stamp-ink-navy`, `--stamp-ink-wine`, `--stamp-ink-terracotta`,
`--stamp-ink-brown`, `--stamp-ink-forest`) are declared in
`app/globals.css` under the `@theme` block. If a region needs an ink
colour that doesn't have a variable yet, add the variable first; don't
hardcode the hex in the cancellation component.

---

## 7. Compositing & rendering

The visa is a raster (WebP) or SVG; the cancellation is always SVG. Layering
happens in the DOM, not in the source asset.

- The visa is rendered at the slot's natural size (per §2).
- Cancellations are absolutely positioned over the visa, each sized as a
  fraction of the visa's longest edge (per §3, ~46%).
- The **visa** lives inside a `mix-blend-multiply` wrapper so its ink
  interacts with the parchment paper colour below — the same rule already
  used in `CountryStampSlot.tsx`. This is what makes the visa feel like
  part of the page rather than a sticker on it.
- **Cancellations** sit *on top* of the visa with normal blending at
  ~88% opacity, mimicking the opaque oil-based inks of real postal
  cancellations pressed onto already-printed stamps. This serves §3's
  stated goal — "reads as 'stamped over the visa' rather than 'another
  sticker on the page'" — and keeps cancellations legible regardless of
  how dark or saturated the underlying visa is. Earlier drafts of this
  SPEC put cancellations inside the visa's multiply wrapper too; that
  was a copy-paste of the visa-on-parchment rule onto the
  cancellation-on-visa case, and produced cancellations that disappeared
  into dark-coloured visas (East Asia literati, Madhubani South Asia,
  Iznik Middle East). The current rule is the corrected one.
- The `[filter:url(#stamp-ink)]` filter (paper-bleed + grain) is applied
  to the whole composite, so the visa and its cancellations share one
  paper surface and the cancellations still get the rubber-stamp texture
  even without multiply.
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

### 9.1 Current state (shipped)

- Spreads are organised by region. `usePassportSpreads` produces:
  cover → inside-front → contents → one-or-more spreads per region
  (all 10 `CulinaryRegion` values always present, even empty ones) →
  back-cover.
- Within a region, countries are ordered by first `cooked_at` ascending,
  with country name as tiebreak (`usePassportSpreads`).
- Region packing into spreads is implemented in
  `lib/passport-pack.ts#packRegion` — overflow countries spill into
  continuation spreads automatically (slug `<region>-2`, `<region>-3`, …).
- **Grid is a hybrid flex-wrap layout, not a uniform CSS grid:**
  - `BookletShell.tsx` defines a 3-column *sizing reference*
    (`COLS_PER_HALF = 3`) used purely to derive the `--stamp-size` CSS
    variable: `(pageWidth − gap × (cols + 1)) / cols`. The rest of the
    booklet's typography is sized off this variable, so most layout
    scales automatically.
  - `CountryStampSlot.tsx` renders image visas at `IMAGE_STAMP_SIDE = 1.4`
    (the equivalent-square side length, in `--stamp-size` units) and
    procedural stamps at 1.0×.
  - `RegionHalf.tsx` lays the stamps out in `flex flex-wrap` with
    `justify-content: center`. Image visas at 1.4× wrap to **2 per
    row**; procedural stamps at 1.0× would wrap to **3 per row** if a
    half were procedural-only (vanishingly rare today). Center
    alignment is intentional: image visas are aspect-aware sized
    (landscape visas are wider than 1.4·stamp, portrait visas are
    narrower), so 2-per-row width varies — `center` keeps every row
    visually balanced regardless of which two visas land there. The
    trade-off is that a lone trailing stamp (e.g. the 3rd in a
    3-stamp half) sits in the middle of its row rather than anchored
    left; this is accepted as quieter than the left-shift it replaced.
  - `lib/passport-pack.ts` caps each half at `HALF_CAPACITY = 4`
    (`SPREAD_CAPACITY = 8`). This is what the flex wrap actually permits
    without overflowing the page edge: 2 rows of 2 image visas. A 5th
    cooked country flows to the right half; past 8, into a continuation
    spread (`<region>-2`, etc.).

### 9.2 Design intent

The hybrid layout is intentional, not a transitional state:

- **Image visas need detail room** — Iznik tile, Madhubani brush-work,
  literati ink landscapes collapse into mud at small sizes. Rendering
  them at 1.4× the column unit gives them roughly half the page width,
  which is the threshold where their authored detail reads clearly at
  desktop scale.
- **Procedural stamps don't** — abstract cartouche + monogram designs
  read fine at 1.0× and would feel oversized at 1.4×. Letting them
  pack 3-per-row keeps procedural-dominant halves dense.
- **Multiple stamps per row preserves "passport page" feel** — two
  image visas in conversation across a spread is the visual minimum
  for the metaphor to land. The §9.6 rule against a "one stamp per
  page" gallery view is enforced by the `IMAGE_STAMP_SIDE = 1.4`
  ceiling: any larger and image visas would wrap to 1-per-row, which
  is exactly the gallery layout the SPEC forbids.

| Cooked countries in a region | Spreads | Notes |
|---|---|---|
| 0 (empty region) | 1 placeholder spread | Empty-state spread, see §9.3 |
| 1–4              | 1 spread (left half filling) | First spread of the region |
| 5–8              | 1 spread | Spreads onto right half |
| 9–16             | 2 spreads | Continuation spread (slug `<region>-2`) |
| 17+              | More spreads as needed | `packRegion` handles this — no new logic |

A power user with 50 cooked countries lands at ~13 region spreads
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

The cancellation size in §3 (`~46% of visa's longest edge`) is a
**ratio**, not a fixed pixel value. When visas double in size,
cancellations double too. No separate sizing rule, no extra config.
The same applies to the 10-cook gold seal (§5) and the per-country
centre-mark glyph (§3).

### 9.5 Where the layout lives

If you need to change the grid, these are the knobs:

- `lib/passport-pack.ts`: `HALF_CAPACITY` (currently 4) caps how many
  countries fit per half before spilling. `SPREAD_CAPACITY` is derived.
  Raising this without changing `IMAGE_STAMP_SIDE` will cause overflow,
  because the wrap behaviour — not the cap — is what physically fits
  on the page.
- `components/passport/BookletShell.tsx`: `COLS_PER_HALF = 3` is the
  sizing reference that derives `--stamp-size`. Changing it rescales
  every stamp and most booklet typography (which is sized off
  `--stamp-size`). A 2-col reference would make stamps ~1.5× larger but
  also force `IMAGE_STAMP_SIDE` down to ≤1.0 to preserve 2-per-row image
  visas; 1.4× image visas would otherwise wrap to 1-per-row (violates
  §9.6).
- `components/passport/CountryStampSlot.tsx`: `IMAGE_STAMP_SIDE = 1.4`
  is the per-image-visa multiplier. The 0.4 difference vs procedural
  stamps is what makes image visas wrap to 2-per-row instead of
  procedurals' 3-per-row. The math for any change: 2 image visas + 1
  gap must fit inside one half-page, i.e. `2·side·stamp + gap ≤
  pageInner` — `RegionHalf` enforces this by padding the inner row to
  exactly that width.
- `components/passport/RegionHalf.tsx`: `justify-content: center` on
  the stamps flex container balances rows of varying total widths
  (landscape vs portrait vs square visa mixes). Switching back to
  `flex-start` will produce a visible left-shift on rows whose
  contents are narrower than the half's inner width — most commonly
  rows of two square visas.

Untouched on purpose:

- The booklet shell, page-turn animation, hinge logic, scale-from-origin
  open animation, `PassportOverlayProvider`.
- `usePassportSpreads`'s ordering rules (region order, first-cooked-at
  ordering within a region).
- The `RegionChipStrip` navigation along the booklet edge.
- Mobile layout — the same formula applies; stamps just end up smaller
  on narrow viewports.

### 9.6 What this is not

- Not a "one stamp per page" gallery view.
- Not chronological cook order across the whole booklet (still
  region-based; chronological order only applies within a region).
- Not a redesign of the cover, inside-front, contents, or back-cover
  spreads.
- Not a change to which `CulinaryRegion` values exist or their order.
