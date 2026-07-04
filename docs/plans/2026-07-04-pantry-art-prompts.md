# Pantry ink art — nine Sora prompts, ready to paste

Nine square ink drawings of pantry ingredients for the `/pantry` shelf cards (variant D "etched": hairline-outline card, art floating on parchment). They share the site's stamp ink grammar — flat two-tone ink impression on a natively transparent background — but they are **not** passport stamps: no cartouche, no frame, no border, no lettering. The ingredient line-art itself defines the extents, and the card sets the name in type. All nine must read as one hand drew them: one consistent stroke weight, one warm sepia-brown ink, one muted-terracotta accent used exactly once per drawing.

**Palette (both colours are named in every prompt):**
- Primary ink — warm dark sepia-brown, `#6b5744` territory (`--stamp-ink-brown`, oklch 0.40 0.05 50). Not black.
- Accent — muted terracotta / earthy red-brown, `#8a5a48` territory (`--stamp-ink-terracotta`, oklch 0.45 0.09 35). Used once, on the one element named in each prompt.
- Nothing else. No pure black, no bright colours.

## How to use

Per the house convention (see `docs/plans/2026-05-06-stamp-final-prompts.md`): paste one core prompt, then append the shared **Transparency boilerplate** block below it, and render. Each core prompt already carries the style anchor and palette, so the two blocks together are the complete Sora prompt.

## Ingest (when renders come back)

For each rendered PNG, before it ships:

1. **Verify alpha:** `sips -g hasAlpha <file>.png` must print `hasAlpha: yes`. If it prints `no`, the background is opaque white and must be keyed out.
2. **Key white → transparent** (ImageMagick is **not** installed on this machine): use the PIL euclidean-distance white-key at **8% fuzz**. If a corner stays opaque after keying, bump to **12%**.
3. **Crop:** if the render has a soft glow / halo / vignette, an `alpha > 0` bounding box grabs the whole canvas — recrop against an `alpha > 16` mask instead.
4. **Convert:** land the file as `public/pantry/<slug>.webp` via the pre-commit hook or `scripts/convert-image.sh`.
5. **First asset only:** the first pantry PNG to land also adds `public/pantry/` to `AUTO_CONVERT_DIRS` in `.husky/pre-commit` (so the hook auto-converts the rest). Not done here — this doc ships only the prompts.

Slugs (filenames): `barley`, `dates`, `honey`, `eggs`, `yoghurt`, `butter`, `garlic`, `olive-oil`, `lamb`.

---

## Transparency boilerplate — paste after each core prompt

```
Output as a PNG with a native transparent background — alpha channel preserved, no white fill, no checkerboard texture, no opaque backdrop. The drawing fills most of the square canvas with a small even margin on all sides; the inked ingredient line-art itself defines the extents. No surrounding page, no paper margin, no canvas frame, no border, no cartouche, no panel around the drawing. Outside the drawing's strokes is fully transparent. The space between and enclosed by the ink lines is also fully transparent — the interior must not be a card, paper, cream wash, halo, glow, or any opaque shape behind the lines. Only the inked strokes are opaque. No substrate texture anywhere — no glaze, no ceramic crackle, no cloth weave, no paper fiber, no plaster, no bark, no wood grain. The result must read as a drawing pressed onto paper, not a sticker.

no lettering, no labels, no words, no typography, no numbers, no signature, no frame, no border, no cartouche, no rectangular or oval or scalloped panel, no ribbon, no stamp perforations, no human faces, no animal faces, no living creature, no neon colors, no pure black, no fluorescent saturation, no stock-photo realism, no AI-cliché smooth gradient, no woven cloth substrate, no fabric weave fill, no carved stone substrate, no parchment background, no cream background, no white background, no card fill behind the lines, no cream wash behind the lines, no opaque substrate behind the strokes, no halo, no drop shadow, no sticker look, no die-cut card
```

---

## barley

```
A small hand-drawn ink drawing of a single upright barley stalk, in the style of a flat two-tone rubber-stamp impression on a transparent background. Drawn with one consistent hairline-to-medium ink weight in warm dark sepia-brown ink (roughly #6b5744, a warm dark brown, never black), flat line-art only with no shading fills. A straight central stem rises up the middle of the canvas. Along the stem, three evenly spaced pairs of curved barley husks branch out symmetrically to the left and right, each husk a plump tapered leaf-shape curving back toward the stem. Exactly one element is picked out in muted terracotta (roughly #8a5a48, an earthy red-brown): the cluster of long thin awn spikes fanning straight up from the very top of the stalk. Everything else — stem and all husks — is the sepia-brown ink. Centered, gently imperfect hand-drawn line quality with slight ink-press breaks. No frame, no border, no lettering.
```

## dates

```
A small hand-drawn ink drawing of dates with palm fronds, in the style of a flat two-tone rubber-stamp impression on a transparent background. Drawn with one consistent hairline-to-medium ink weight in warm dark sepia-brown ink (roughly #6b5744, a warm dark brown, never black), flat line-art only with no shading fills. In the lower half, a cluster of three plump whole oval dates sits close together, each a rounded almond-shaped fruit drawn as a simple outline with a faint lengthwise seam. Above them, from a short central stem, two slender palm-frond sprays arc outward and up to the left and right, each frond a gentle curve with a few fine side-leaflets. Exactly one element is picked out in muted terracotta (roughly #8a5a48, an earthy red-brown): one single date of the three, the lowest one in front. Everything else — the other two dates, the stem and both fronds — is the sepia-brown ink. Centered, gently imperfect hand-drawn line quality with slight ink-press breaks. No frame, no border, no lettering.
```

## honey

```
A small hand-drawn ink drawing of a wooden honey dipper with a falling drop, in the style of a flat two-tone rubber-stamp impression on a transparent background. Drawn with one consistent hairline-to-medium ink weight in warm dark sepia-brown ink (roughly #6b5744, a warm dark brown, never black), flat line-art only with no shading fills. A honey dipper is held at a diagonal across the canvas, tilted from upper-right to lower-left: a straight slender rod with a small round knob handle at the top, and toward the lower end three stacked horizontal ellipse ridges forming the grooved dipping head. Exactly one element is picked out in muted terracotta (roughly #8a5a48, an earthy red-brown): a single teardrop of honey falling just below the dipper head. Everything else — rod, knob, and the three ridges — is the sepia-brown ink. Centered, gently imperfect hand-drawn line quality with slight ink-press breaks. No frame, no border, no lettering.
```

## eggs

```
A small hand-drawn ink drawing of two eggs, in the style of a flat two-tone rubber-stamp impression on a transparent background. Drawn with one consistent hairline-to-medium ink weight in warm dark sepia-brown ink (roughly #6b5744, a warm dark brown, never black), flat line-art only with no shading fills. One whole egg stands in front, drawn as a clean oval slightly narrower at the top; a second egg sits partly behind it to the upper-right, overlapped so only its far edge shows. Both are simple outlines. Exactly one element is picked out in muted terracotta (roughly #8a5a48, an earthy red-brown): a few tiny scattered speckles dotted across the front egg's shell. Everything else — both egg outlines — is the sepia-brown ink. Centered, gently imperfect hand-drawn line quality with slight ink-press breaks. No frame, no border, no lettering.
```

## yoghurt

```
A small hand-drawn ink drawing of a wide bowl of yoghurt with a spoon, in the style of a flat two-tone rubber-stamp impression on a transparent background. Drawn with one consistent hairline-to-medium ink weight in warm dark sepia-brown ink (roughly #6b5744, a warm dark brown, never black), flat line-art only with no shading fills. A wide, shallow rounded bowl sits centered low on the canvas, drawn as a simple open outline. A spoon rests diagonally, its handle rising out of the bowl to the upper-right and ending in a small oval bowl of the spoon. Exactly one element is picked out in muted terracotta (roughly #8a5a48, an earthy red-brown): a single looping swirl line drawn across the surface of the yoghurt inside the bowl's rim, suggesting a stirred spiral. Everything else — the bowl and the spoon — is the sepia-brown ink. Centered, gently imperfect hand-drawn line quality with slight ink-press breaks. No frame, no border, no lettering.
```

## butter

```
A small hand-drawn ink drawing of a block of butter, in the style of a flat two-tone rubber-stamp impression on a transparent background. Drawn with one consistent hairline-to-medium ink weight in warm dark sepia-brown ink (roughly #6b5744, a warm dark brown, never black), flat line-art only with no shading fills. A rectangular block of butter sits in three-quarter view, drawn as a simple angled box outline showing the front face and one short side, no interior fill. Exactly one element is picked out in muted terracotta (roughly #8a5a48, an earthy red-brown): a single small cut pat of butter, a thin angled slice, resting on top of the block. Everything else — the main block — is the sepia-brown ink. Centered, gently imperfect hand-drawn line quality with slight ink-press breaks. No frame, no border, no lettering.
```

## garlic

```
A small hand-drawn ink drawing of a whole garlic bulb, in the style of a flat two-tone rubber-stamp impression on a transparent background. Drawn with one consistent hairline-to-medium ink weight in warm dark sepia-brown ink (roughly #6b5744, a warm dark brown, never black), flat line-art only with no shading fills. A single round garlic bulb sits centered, its rounded body drawn as an outline with several vertical clove-division lines curving down its surface to suggest the separate cloves, and a fringe of fine wispy root hairs at the base. Exactly one element is picked out in muted terracotta (roughly #8a5a48, an earthy red-brown): a single curled green-sprout tendril curling up from the crown at the top of the bulb. Everything else — the bulb body, clove lines, and root fringe — is the sepia-brown ink. Centered, gently imperfect hand-drawn line quality with slight ink-press breaks. No frame, no border, no lettering.
```

## olive-oil

```
A small hand-drawn ink drawing of a bottle of olive oil, in the style of a flat two-tone rubber-stamp impression on a transparent background. Drawn with one consistent hairline-to-medium ink weight in warm dark sepia-brown ink (roughly #6b5744, a warm dark brown, never black), flat line-art only with no shading fills. A shouldered olive-oil bottle stands centered: a tall body with rounded shoulders, a narrow neck, and a small cap band at the top, drawn as a clean outline. Inside the bottle, two soft horizontal curve lines hint at the oil level, no fill. Exactly one element is picked out in muted terracotta (roughly #8a5a48, an earthy red-brown): two small whole olives resting on the ground at the base of the bottle, each a simple oval with a tiny stem. Everything else — the bottle, cap, and interior oil-lines — is the sepia-brown ink. Centered, gently imperfect hand-drawn line quality with slight ink-press breaks. No frame, no border, no lettering.
```

## lamb

```
A small hand-drawn ink drawing of a single frenched lamb chop (a cut of meat on the bone), in the style of a flat two-tone rubber-stamp impression on a transparent background. Drawn with one consistent hairline-to-medium ink weight in warm dark sepia-brown ink (roughly #6b5744, a warm dark brown, never black), flat line-art only with no shading fills. It is a butchered cut, not a living animal: two clean exposed rib bones angle up and apart from the top, and below them a single rounded eye of meat forms the body of the chop, all drawn as simple outlines. Exactly one element is picked out in muted terracotta (roughly #8a5a48, an earthy red-brown): the curved fat-cap line that runs along the outer edge of the meat. Everything else — the two rib bones and the eye of meat outline — is the sepia-brown ink. Centered, gently imperfect hand-drawn line quality with slight ink-press breaks. This is a cut of meat on the bone only — absolutely no living animal, no animal head or face, no whole carcass. No frame, no border, no lettering.
```
