# recipe-photos

Full-quality **source** photos for real recipes: the enhanced ChatGPT exports we
pick, kept at original resolution. This is the staging/originals layer, separate
from `public/`, which holds the optimized **WebP** images that actually ship via
`next/image`.

## Structure

One folder per recipe, named by its slug (matches `data/recipes/<slug>.ts`):

```
recipe-photos/
  <slug>/
    <slug>-hero.png        # the chosen hero shot (enhanced)
    <slug>-<beat>.png      # optional process/variation shots (e.g. -folding, -pan-fried, -steamed)
```

## Conventions

- **Enhanced look:** images are run through the canonical warm-editorial ChatGPT
  prompt before landing here (Editorial variant, lighter exposure). The prompt is
  recorded in agent memory (`project_recipe_photo_enhancement_prompt`).
- **Keep originals:** store the full-res export here, do not pre-shrink. We
  down-convert to WebP only when wiring an image into a recipe.
- **Shipping a hero:** when ready, convert the picked file to WebP into
  `public/` and set `imageIsStock: false` on the recipe so it leaves the
  "needs a real photo" list.
- **Process/variation shots** stay here until the recipe page supports a
  multi-photo gallery (currently each recipe stores a single `image_url`).

## Current contents

- `dumpling-lasagna/` — hero (enhanced, lighter editorial). Not yet wired into
  the recipe; still served from the Unsplash stock placeholder.
