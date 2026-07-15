# Nieves's Kitchen — "Courtyard" Design Language

Paste this whole file into Claude Design as context, or use it as the brief for new
prototypes. It is self-contained: brand, tokens, type, the two signatures, components,
motion, imagery, and voice. Everything below is derived from the working prototype at
`app/dev/redesign/v2/Courtyard.tsx`.

---

## 1. Brand in one breath

**Nieves's Kitchen** is a place to browse and cook global, always-halal home recipes —
part practical (find something to make), part imaginative (travel through food, and
collect a culinary journey). The audience is curious home cooks who explore as much as
they cook, usually on a laptop or tablet in a relaxed "what should I make tonight?" mood.

**Personality (three words): warm, considered, well-traveled.** The voice is a thoughtful
friend who collected recipes on trips and keeps them in a tiled, sunlit book. Confident,
never loud. Editorial in craft, personal in voice.

**One-liner:** Recipes from around the world, cooked at home.

---

## 2. The big idea: a Moorish courtyard

Everything hangs off one coherent world — the tiled Mediterranean/Moorish courtyard:
**horseshoe arches over glazed azulejo/zellige tilework** (think a Lisbon tiled façade,
an Alhambra hall, an Iznik-tiled kitchen). Two motifs carry it:

- **The arch** — the signature *frame*. Imagery lives inside a horseshoe arch with a small
  brass keystone at its apex. Used sparingly (hero + recipe photo) so it stays special.
- **The tile** — the *brand primitive*, used everywhere a unit of content or navigation
  appears. Destinations are glazed tiles. Method step-numbers are tiles. The atlas is a
  wall of tiles ("every country is a tile"), and the journal earns a **tile** for each
  country cooked (this replaces the old passport "stamp" — tiles, not stamps, going
  forward).

If you remember two shapes, remember the **arch** and the **tile**.

---

## 3. Color

Warm, sun-faded, two anchors (cream + cobalt) with terracotta/brass as the pops. Never
pure black or white. 60 cream / 30 cobalt / 10 terracotta-brass as a rough intent.

| Token | Hex | Role |
|---|---|---|
| `cream` | `#F4ECDC` | primary background ("unglazed tile / plaster") |
| `creamDeep` | `#EBE0C8` | alternate section background, chips, insets |
| `cobalt` | `#20406B` | primary ink, nav bar, headings, links, glazed tiles |
| `cobaltDeep` | `#16324F` | deepest panel, shadows, the journal tile |
| `terracotta` | `#C4623C` | primary accent / CTA / italic display word / link underline |
| `brass` | `#C69A4E` | secondary accent, keystone, active-nav underline, gold detail |
| `olive` | `#6F7A47` | tertiary / eyebrows / quiet captions |
| `ink` | `#2A2A2E` | body text on cream (warm near-black) |

```css
:root {
  --nk-cream: #F4ECDC;
  --nk-cream-deep: #EBE0C8;
  --nk-cobalt: #20406B;
  --nk-cobalt-deep: #16324F;
  --nk-terracotta: #C4623C;
  --nk-brass: #C69A4E;
  --nk-olive: #6F7A47;
  --nk-ink: #2A2A2E;
}
```

**Do:** cobalt text on cream; cream text on cobalt; terracotta for one CTA or one italic
word; brass for the keystone and active states. **Don't:** rainbow it (that was the
rejected "too many colours" direction). Two accents max in any one view.

---

## 4. Typography

Two families. A soft, optical serif for display; a humanist sans for everything else.

- **Display — Fraunces** (Google). Weights 400/500/600, and *italic* used only for a single
  emphasised word in a headline (set in terracotta). Headings, wordmark, card titles,
  drop caps, step numbers.
- **Body / UI — Karla** (Google). Weights 400/500/700. Body copy, buttons, chips, eyebrows,
  meta, captions.

**Scale (clamp = fluid):**

| Use | Font | Size | Notes |
|---|---|---|---|
| Hero H1 | Fraunces 400 | `clamp(2.6rem, 6vw, 4.2rem)` | line-height ~1; one italic terracotta word |
| Recipe title | Fraunces 400 | `clamp(2.4rem, 5vw, 3.4rem)` | |
| Section H2 | Fraunces 400 | `clamp(1.7rem, 4vw, 2.4rem)` | |
| Card / tile title | Fraunces 400 | 20px | |
| Drop cap | Fraunces 400 | 60px, `float:left`, terracotta | opens recipe intro |
| Body / prose | Karla 400 | 17–18px | line-height 1.7 for prose |
| Eyebrow | Karla 700 | 12px | `uppercase`, `letter-spacing:0.22em`, terracotta/olive/brass |
| Meta | Karla 400/700 | 14px | bold the label ("**Total** 25 min") |
| Chip / button | Karla 600/700 | 13–15px | |

Wordmark: `Nieves's` in Fraunces upright + *`Kitchen`* in Fraunces italic (brass or
terracotta on the accent word).

---

## 5. The two signatures (with geometry)

### The arch (image frame)
A horseshoe arch: full-round top, gently rounded base, layered ring, brass keystone.

```
border-radius: 9999px 9999px 20px 20px;   /* rounded-t-full rounded-b-[20px] */
box-shadow:
  0 0 0 2px   #20406B,                     /* cobalt inner rule   */
  0 0 0 7px   #F4ECDC,                      /* cream mat           */
  0 0 0 8.5px #C69A4E,                      /* brass outer rule    */
  0 24px 46px -28px rgba(22,50,79,0.6);     /* soft drop shadow    */
```
Keystone: a 16px brass square rotated 45° (a diamond), centered on the top edge, with a
3px cream outline, pulled up ~9px so it straddles the arch apex. Image inside is
`object-cover`, ratio ~4:5 (hero) or 4:5 (recipe).

### The tile (brand primitive)
A glazed azulejo unit. As a repeating SVG pattern (46px cell): a central four-petal
quatrefoil with quarter-arcs at each corner that join into circles across neighbours.
Draw it in cream line over a cobalt fill for "glazed" tiles; use it at ~20–25% opacity
as texture behind panels and step-numbers.

```svg
<pattern id="nk-tile" width="46" height="46" patternUnits="userSpaceOnUse">
  <g fill="none" stroke="#F4ECDC" stroke-width="1.4" opacity="0.5">
    <path d="M0 11.5 A11.5 11.5 0 0 0 11.5 0"/>
    <path d="M46 11.5 A11.5 11.5 0 0 1 34.5 0"/>
    <path d="M0 34.5 A11.5 11.5 0 0 1 11.5 46"/>
    <path d="M46 34.5 A11.5 11.5 0 0 0 34.5 46"/>
    <ellipse cx="23" cy="13" rx="3.8" ry="7"/>
    <ellipse cx="23" cy="33" rx="3.8" ry="7"/>
    <ellipse cx="13" cy="23" rx="7" ry="3.8"/>
    <ellipse cx="33" cy="23" rx="7" ry="3.8"/>
  </g>
</pattern>
```

**Tile grid** (atlas / journal motif): a small grid of squares (`border-radius:3px`).
"Glazed/earned" cells are filled (rotating terracotta / brass / cream / olive); "raw"
cells are just a `1.5px` cream inset outline. This is how progress reads: cooking a
country glazes its tile.

---

## 6. Layout system

- **Radii:** chips `9999px`; nav buttons / step tiles `6px` (`rounded-md`); cards & tiles
  `12px` (`rounded-xl`); arch as above.
- **Section padding:** `px-6 sm:px-10`, `py-12`–`py-14`. Max content width ~ `max-w-5xl`
  for reading (recipe), full-bleed sections for bands.
- **Home = magazine index** (the chosen structure): bold nav → hero (title + Jump-in chips
  beside an arched feature) → "This week" filmstrip → a row of 4 destination tiles. Dense
  and explorable; several things to tap immediately, minimal dead space.
- **Elevation:** cards use a hairline cobalt ring + soft shadow
  `0 0 0 1.5px #20406B22, 0 16px 32px -24px rgba(22,50,79,0.5)`.

```
┌ NAV (solid cobalt) · Nieves's Kitchen · Recipes Atlas Pantry About · [Start cooking] ┐
│  H1 + 1-line intro          ╭─ arch ─╮                                                │
│  [Browse recipes] [Atlas]   │ dish   │  ← keystone                                    │
│  Jump in:  chip chip chip   ╰────────╯                                                │
├── This week ──────────────────────────────────────────────  ‹ filmstrip of cards › ──┤
│  [ Atlas tile ] [ Pantry tile ] [ Collections tile ] [ Journal: 8 tiles earned ]      │
└───────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 7. Components

- **Bold nav bar.** Solid cobalt band. Cream wordmark left; text tabs (Recipes / Atlas /
  Pantry / About) in cream, the active one brass with a 3px brass underline; a terracotta
  "Start cooking" button right. Deliberately pronounced, never a thin quiet header.
- **Buttons.** Primary = cobalt fill, cream text, `rounded-md`, lifts `-2px` on hover.
  Secondary = cobalt text with a `2px` cobalt inset ring, transparent fill. Accent CTA =
  terracotta fill.
- **Chips ("Jump in").** `creamDeep` pill, cobalt text, faint cobalt inset ring. Places and
  quick filters as fast entry points.
- **Recipe card (filmstrip).** Cream card, hairline cobalt ring, `rounded-xl`; 4:3 photo
  top (zooms 1.05 on hover), then olive eyebrow (`country · time`), Fraunces title, 2-line
  blurb. The whole card lifts on hover.
- **Destination tile.** A glazed tile that navigates: cobalt (or terracotta / cobalt-deep)
  fill, faint tile-pattern texture, eyebrow + Fraunces title + a small proof (a tile-grid
  for Atlas/Journal, ink drawings for Pantry, collection chips for Collections).
- **Arch frame.** Section 5. Hero and recipe imagery only.
- **Filmstrip / carousel.** Horizontal snap-scroll shelf (`snap-x snap-mandatory`), 2–3
  cards visible, hidden scrollbar. Driven by drag/fling (pointer), round prev/next arrows
  (cobalt, cream glyph), and ← → keys when focused. Ends with a cobalt "All recipes →"
  card. Reduced-motion aware.
- **Inline-nav prose ("the writing is the map").** In recipe intro, steps, and ingredient
  lines, meaningful words are links: country → Atlas, ingredient → Pantry, tag →
  Collection. Style: cobalt semibold text, `2px` terracotta underline at 2px offset;
  hover fills a faint cobalt background. A small olive caption tells the reader underlined
  words are navigable.
- **Step number = tile.** Each method step is numbered by a small glazed cobalt tile
  (`rounded-md`, faint tile texture, Fraunces numeral in cream).
- **Eyebrow.** 12px Karla bold, uppercase, `0.22em` tracking; terracotta by default, olive
  or brass as needed.
- **Drop cap.** First letter of a recipe intro, Fraunces 60px terracotta, floated left.

---

## 8. Motion

Calm by default, delight only at milestones. Hover = a `-2px` to `-4px` lift plus a slow
(`500ms`) `1.05` image zoom. Filmstrip scrolls smoothly (arrows/keys) with native
momentum on touch. Respect `prefers-reduced-motion` (instant scroll, no transforms). The
"earn a tile" moment on the map/journal is the one place a flourish is welcome.

---

## 9. Imagery

- **Contained, never full-bleed.** Photos live inside arches or capped cards (~340–420px).
  This is deliberate: the real recipe photos are modest resolution, and giant full-bleed
  crops expose it. Frame, don't blow up.
- **Arch-framed** for hero and recipe; **4:3 in cards.** `object-cover`.
- **Ink drawings** (two-tone line art on cream) represent pantry ingredients — a warm,
  authored alternative to photography. Great for the Pantry tile and spot accents.
- Photography direction: warm natural light, top-down or 3/4, saturated but not
  oversharpened; tiled/ceramic surfaces on-brand.

---

## 10. Voice & copy

Plain, warm, direct. Say the useful thing; skip the poetry. Sentence case. Active voice.
Buttons name the action ("Browse recipes", "Open the atlas", "Start cooking").

**Hard rule: no em dashes (—) in any user-facing text.** Use a period, comma, or "and".

Before → after:
- "An Istanbul breakfast that eats like a quiet luxury." → "A fast Istanbul breakfast."
- "Cooked by the sea, seasoned by the world." → "Recipes from around the world, cooked at home."
- "Drawn in ink, kept in jars." (fine as a short tile line; keep it plain, not precious.)

Halal is a confident, matter-of-fact part of the brand ("Halal home cooking"), never
apologetic or hedged. Never invent a religious narration or ruling.

---

## 11. Where the tile theme goes next (for coherent prototypes)

- **Atlas** = a wall of tiles. Cooking a country **glazes** its tile (raw outline → filled).
  Prototypes of the map should read as tilework, not a generic choropleth.
- **Journal / passport** = a collection of **earned tiles**, one per country cooked. This
  supersedes the older "stamp/postmark" language. If you prototype the journey view, earn
  and display tiles, not stamps.
- Keep the arch for feature imagery and the tile for units/navigation. Don't add a third
  signature shape.

---

## 12. Anti-references (explicitly NOT this)

- Not SaaS/dashboard: no neutral grays, no card-grid monotony, no productivity feel.
- Not food-delivery: no coupon-bright colours, no aggressive commerce CTAs.
- Not rustic/kitsch: no chalkboard fonts, burlap, or country-kitchen clip-art.
- Not "postcard/postal everything": stamps, postmarks and airmail borders are retired in
  favour of the tile. (An earlier direction over-used them; don't bring them back.)
- Not loud: the rejected bold direction had too many colours and full-bleed low-res photos.
  Two accents, contained imagery.

---

## 13. Quick token block for tools (JSON)

```json
{
  "color": {
    "cream": "#F4ECDC", "creamDeep": "#EBE0C8",
    "cobalt": "#20406B", "cobaltDeep": "#16324F",
    "terracotta": "#C4623C", "brass": "#C69A4E",
    "olive": "#6F7A47", "ink": "#2A2A2E"
  },
  "font": { "display": "Fraunces", "body": "Karla" },
  "radius": { "chip": "9999px", "button": "6px", "card": "12px", "archBottom": "20px" },
  "signatures": ["horseshoe arch + brass keystone", "glazed azulejo tile"],
  "accentsPerView": 2,
  "voice": ["plain", "warm", "active", "no em dashes"]
}
```
