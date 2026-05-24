---
name: ingeststamp
description: Use when adding or replacing a country stamp in the nieves-kitchen passport from a freshly-rendered PNG (typically a ChatGPT/Sora export in ~/Downloads). Triggered by phrases like "ingest this stamp", "add the X stamp", "I rendered a new stamp for X", or `/ingeststamp`.
---

# ingeststamp

## Overview

Pipeline for taking a freshly-rendered country-stamp PNG and getting it into the passport at the correct on-screen size. Every existing stamp in `public/stamps/` is tight-cropped to its artwork bounding box and registered in `CUSTOM_STAMPS` with a precise `aspect: w/h`. A new render that skips either step renders smaller than its peers (excess transparent margin) or as an opaque white card (no real alpha).

The pipeline is mechanical — follow it exactly, in order.

## When to use

Triggered by any of:
- `/ingeststamp` (with or without a country name)
- User says: "ingest this stamp", "add the <country> stamp", "I rendered a new stamp for <country>", "replace the <country> stamp"
- User drops a `ChatGPT Image …png` path and references a country

**Do NOT use for:**
- Generating the stamp prompt itself (that's in `docs/plans/2026-05-06-stamp-final-prompts.md` + the memory `feedback_stamp_generation_workflow.md`)
- Committing the result — never commit unless the user explicitly asks

## Inputs to clarify before starting

If the user did not specify, ask:
1. Source PNG path (default: most recent `ChatGPT Image *.png` in `~/Downloads`)
2. Country name (e.g. `ethiopia`, `india`, `south-korea`) — used for the filename and the `CUSTOM_STAMPS` key

If the user dropped multiple PNGs, ask which country maps to which file before running anything — use the `Read` tool on each image to identify them visually if needed.

## The pipeline (do all 7 steps, in order)

### 1. Locate and visually identify each PNG

Use `Read` on the PNG path to view the image. Confirm with the user which file is which country if there's any ambiguity (Read renders transparent areas as dark — that is NOT a missing alpha channel, it's the viewer).

### 2. Verify real alpha on the source PNG

```bash
sips -g hasAlpha "<path>"
```

`hasAlpha: yes` is necessary but not sufficient — a PNG can have an alpha channel that is fully opaque. Also check corner alpha:

```bash
python3 -c "
from PIL import Image
im = Image.open('<path>').convert('RGBA')
a = im.split()[-1]
w,h = im.size
corners = [(0,0),(w-1,0),(0,h-1),(w-1,h-1)]
print('alpha extrema:', a.getextrema())
print('corner alphas:', [a.getpixel(c) for c in corners])
"
```

Pass criteria: extrema includes `0` AND all four corner alphas are `0`. If not, the background is opaque — key it out:

```bash
# Requires: brew install imagemagick
magick "<path>" -fuzz 8% -transparent white "<path>"
```

If `magick` isn't installed and the background is opaque white, stop and tell the user.

### 3. Tight-crop to the alpha bounding box (CRITICAL)

This is the step that makes the stamp render at the same on-screen size as every other stamp. Every existing webp in `public/stamps/` has a 100% alpha-fill (no transparent margin). Skipping this step is the #1 reason a new stamp renders smaller than its peers.

```bash
python3 -c "
from PIL import Image
src = '<path>'
country = '<country>'  # lowercase, hyphenated (e.g. 'south-korea')
im = Image.open(src).convert('RGBA')
bbox = im.split()[-1].getbbox()
cropped = im.crop(bbox)
out = f'public/stamps/{country}.png'
cropped.save(out)
print(country, 'cropped to', cropped.size)
"
```

Record the cropped `(width, height)` — needed in step 6.

### 4. Convert to webp at q82 (matches the pre-commit hook)

```bash
cwebp -q 82 -quiet public/stamps/<country>.png -o public/stamps/<country>.webp
```

Then delete the PNG so it doesn't get staged:

```bash
rm public/stamps/<country>.png
```

### 5. Verify the webp has real alpha

```bash
sips -g hasAlpha -g pixelWidth -g pixelHeight public/stamps/<country>.webp
```

Must say `hasAlpha: yes`. Dimensions should match the cropped size from step 3. If `hasAlpha: no`, the source PNG was actually opaque (step 2 missed it) — fix the source, do not patch the webp.

### 6. Update `CUSTOM_STAMPS` aspect ratio in `lib/passport-stamps.ts`

The `aspect` value is consumed by `CountryStampSlot` (`components/passport/CountryStampSlot.tsx`) to size the stamp via `IMAGE_STAMP_SIDE * √aspect`, so all stamps cover the same visual area regardless of portrait/landscape. The aspect MUST be `<cropped_w> / <cropped_h>` from step 3, not the original canvas.

- If the country already exists in `CUSTOM_STAMPS` (most replacements): update its `aspect` to the new cropped dimensions.
- If the country is new: add an entry. Then also append the path to `STATIC_PASSPORT_ASSETS` in `components/passport/PassportAffordance.tsx` so the affordance prefetches it.

Format: `<country>: { file: '<country>', aspect: <w> / <h> },`

### 7. Report and stop

Tell the user what changed (file paths + new aspect), and that the working tree is staged but not committed. Do not run `git add` or `git commit` unless they ask.

## Quick reference

| Step | What | Verify |
|------|------|--------|
| 1 | Identify PNG ↔ country | Visual check via Read |
| 2 | Source alpha is real | `sips hasAlpha: yes` + corner alpha `= 0` |
| 3 | Crop to alpha bbox | Record cropped w/h |
| 4 | `cwebp -q 82` → webp, `rm` png | webp exists in `public/stamps/` |
| 5 | Webp alpha | `sips hasAlpha: yes`, dims match step 3 |
| 6 | Update `CUSTOM_STAMPS.aspect` | `aspect: <cropped_w>/<cropped_h>` |
| 7 | Report, do not commit | — |

## Common mistakes

| Mistake | Symptom | Fix |
|---------|---------|-----|
| Skipped step 3 (no bbox crop) | New stamp renders smaller than peers | Re-run from step 3 — never patch by bumping `IMAGE_STAMP_SIDE` |
| Used canvas dimensions for `aspect` | Stamp slightly off-aspect, sized wrong | `aspect` must match the cropped webp's actual pixel dims |
| Trusted `sips hasAlpha: yes` alone | Stamp renders as opaque white card on parchment | Always also check corner alphas — opaque alpha channels exist |
| Committed without being asked | — | Never `git add`/`commit` unless the user says so |
| Forgot `STATIC_PASSPORT_ASSETS` on new country | Stamp loads on-demand instead of being prefetched | Add to `components/passport/PassportAffordance.tsx` |
| Multi-country render in one PNG | Wrong country gets the file | Read each image first; ask the user if ambiguous |

## Related context

- Stamp prompt grammar + per-region palette: `docs/plans/2026-05-06-stamp-final-prompts.md`, `docs/stamps/SPEC.md`, and the auto-memory `project_stamp_aesthetics_strategy.md` / `feedback_stamp_generation_workflow.md`.
- Sizing logic: `components/passport/CountryStampSlot.tsx` (`IMAGE_STAMP_SIDE`).
- Registry: `lib/passport-stamps.ts` (`CUSTOM_STAMPS`).
- Prefetch list (for new countries only): `components/passport/PassportAffordance.tsx` (`STATIC_PASSPORT_ASSETS`).
