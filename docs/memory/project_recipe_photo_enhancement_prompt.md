---
name: recipe-photo-enhancement-prompt-canonical
description: "The locked ChatGPT image prompt + agreed look for enhancing real recipe photos into the site's warm editorial style"
metadata: 
  node_type: memory
  type: project
  originSessionId: 6eec8802-50d4-4eec-96e9-8cd076d96d5e
---

**Decision (2026-06-24):** Real recipe photos (user's own iPhone shots) are enhanced through a generative ChatGPT image editor using one reusable prompt, to give every recipe a consistent warm-editorial-but-homey look while keeping the real dish. User tested a Subtle variant (too subtle, rejected) and an Editorial variant (chosen). The Editorial render was a touch dark, so the canonical prompt bakes in a brighter, shadow-lifted exposure and a gentler background quieting (not heavy darkening).

**Why:** Brand is warm, considered, well-traveled, editorial like a printed cookbook but still real/homey (showing it's a dish the user actually made builds trust). Food legibility beats pure mood on a recipe page, hence the lighter exposure.

**How to apply:** Paste this prompt into ChatGPT with one JPEG attached (ChatGPT rejects HEIC; convert with `sips -s format jpeg in.HEIC --out out.jpg`). It is a relight/color-grade pass, but the tool still regenerates and can drift, if the food/composition changes, reply "keep it closer to the original, only change lighting and color, do not redraw the food."

**Update (2026-06-24, current canonical):** Refined the prompt to lean *slightly* warm with a touch more depth than the earlier "never too dark" version: it now allows a very slight background darkening to focus the dish and "deep but not crushed shadows," while keeping the matte, film-grained, gently-vignetted editorial finish. This is THE prompt to reuse for every recipe image enhancement going forward.

Canonical prompt (plain text, no markdown):

Re-grade the lighting and color of this photo into a slightly warm editorial cookbook image while preserving the real dish. Treat this as a relight and color-grade pass: keep the same composition, crop, aspect ratio, camera angle, food, plating, garnish, number of pieces, and dishware. Do not add or remove food, props, people, or faces, and do not change the recipe. Apply: soft subtle directional light as if from a window, with subtle gentle believable shadows that add depth; a warm, parchment-leaning grade with soft golden warmth, creamy highlights, and deep but not crushed shadows like a printed cookbook spread; very slightly darken and quiet the background so the dish is the clear focus, letting the edges fall into soft warm shadow, relighting it rather than replacing it; rich but controlled color and contrast with appetizing food tones, kept matte rather than glossy or HDR; a subtle film-like finish with fine grain and a gentle vignette. Mood: warm, considered, well-traveled, magazine editorial. Refined and intentional, never garish, never stock-photo.

**Galleries shipped:** the single-`image_url` limitation is resolved. Recipes now support a hero `image` plus an `images[]` gallery (`RecipeImage`: url/caption/width/height) in `data/recipes/*.ts`, rendered in read mode by `RecipeDetail`. First applied to xinjiang-lamb-dumplings (2026-06-24): hero = the enhanced raw plated shot, gallery = the cooked steamed/pan-fried shot. No-faces rule still applies to any generative visual work ([[feedback_no_faces_in_prompts]]). See [[project_nutrition_convention]] for the per-serving fix done the same session.

**Update (2026-09-03) — aspect ratio is not the rule, composition is.** Hero surfaces are all wide and short: card 346x176 (1.97:1, `h-44` in a 3-col `max-w-6xl` grid), detail banner 960x380 (2.53:1, `max-w-5xl`), modal peek 880x300 (2.93:1). All three use `object-cover`, so **viewers never see a source aspect ratio** and the grid looks uniform no matter what you feed it. Shipped heroes are in fact a mix: classic-lasagna is 1.33 landscape, dumpling-lasagna / turkish-eggs / xinjiang-lamb-dumplings are 0.75-0.80 portrait.

What decides whether a photo survives the crop is **whether the subject sits in the middle third**, not its ratio. Turkish eggs is portrait 0.80 and works because the bowl is centred, so a centre band still shows bread, egg, sauce and both rims. The gochujang meatball plate was composed on a diagonal (rice top-left, peas bottom-left, meatballs right), so the same centre band gave a piece of everything and an anchor of nothing, which read as "too zoomed in". Fixed by cropping to 2:1 (`cropB`), not by changing the standard.

Two dead ends confirmed, do not repeat: (1) a crop can only remove, so "zoom out more" on a portrait source is impossible past the source width; (2) padding to landscape (cream ground or blurred extension) technically widens the view but >50% of the file becomes filler with hard seams, and it looks worse than any crop. If a genuinely wider hero is wanted, append to the canonical prompt: "Compose this as a 3:2 horizontal landscape image, wider than it is tall, with the whole plate in frame and a little breathing room around it."

Beware the false metric: "% of source surviving object-cover" ranks padded variants highest precisely because the padding survives. Judge by eye.

**Update (2026-09-10) — pre-crop the source, do not ask the model to recompose.** iPhone HEICs come off the phone stored landscape (e.g. 4032x3024) but carry EXIF rotation, so they are *portrait* as displayed. Always confirm with `ImageOps.exif_transpose` before judging composition; `sips -g pixelWidth/pixelHeight` alone will mislead you.

For a tall subject (a burger, a stacked dish) on a portrait source, the earlier remedy of appending the "compose this as 3:2 landscape" line makes the model invent background AND regrade in one pass, which is two generative changes and high drift. Better: **crop to 3:2 yourself with PIL first, centred on the subject's bounding box rather than on the frame**, then the prompt only has to grade (plus remove clutter if any). One generative change instead of two.

Judge a candidate by measuring what survives `object-cover` on each hero surface, not by eye: band height = source width / ratio, centred. Worked example (korean-smash-burger, IMG_4923 cropped to 4284x2856): card 1.97:1 keeps 93% of the burger, banner 2.53:1 keeps 73%, modal 2.93:1 keeps 63%. The card is the surface to optimise for since it is the grid. A tighter shot of the same dish (IMG_4921) had the subject filling ~58% of frame height and could not be saved by any crop.

To remove background clutter, the canonical prompt's "Do not add or remove food, props, people, or faces" clause must be edited (drop "props") and the removal named explicitly, otherwise the model obeys the prohibition.
