---
name: Stamp generation workflow — transparency pipeline
description: When generating new passport-stamp WebPs for nieves-kitchen, the source PNG MUST have a real alpha channel before cwebp touches it. The pre-commit hook does not key out white — cwebp only preserves whatever alpha already exists.
type: feedback
originSessionId: 493ce70c-0919-4425-8577-b3b669c3c963
---
When generating or regenerating passport-stamp WebPs in `public/stamps/`, the source PNG must arrive with a real transparent background. The `cwebp` step in `scripts/convert-image.sh` only preserves alpha — it never adds it.

**Why:** Audit of `public/stamps/` on 2026-05-12 found that 5 stamps (India, Pakistan, Afghanistan, Argentina, Australia) had been generated against ink-impression prompts that promised "white will be removed to transparent in post" — but the keying step was skipped, so cwebp dutifully preserved the opaque white background. The stamps render as white cards on top of the parchment wallpaper instead of letting the parchment show through. By contrast, the W. Asia / S. America / Africa / Mexico / Jamaica batches all have real alpha because the user (or ChatGPT) keyed white → transparent before staging. The transparency wasn't a property of the prompt — it was a manual step that got forgotten.

**How to apply** (every time a new stamp WebP is generated):

1. **Use the canonical ink-impression grammar.** Each region's cartouche + 2-tone palette lives in `project_stamp_aesthetics_strategy.md` and `docs/plans/2026-05-06-stamp-final-prompts.md`. Don't reintroduce substrate language (paper, cloth, bark, tile, plaster).

2. **In the prompt to the image generator, explicitly ask for native transparent PNG output** — phrase as "output as PNG with transparent background, alpha channel preserved, no white fill, no checkerboard texture." This is more reliable than "white will be keyed out in post" because some generators (ChatGPT/Sora, Midjourney with `--no background`, Niji transparent flag) can produce transparent PNGs directly.

3. **Verify alpha on the source PNG** before staging: `sips -g hasAlpha public/stamps/<file>.png` — must say `hasAlpha: yes`. If `no`, key it out: `magick public/stamps/<file>.png -fuzz 8% -transparent white public/stamps/<file>.png`. Requires `brew install imagemagick`. The 8% fuzz threshold catches off-whites without eating into ink strokes (safe because all stamp inks are saturated colors, nowhere near white).

4. **Stage the PNG.** The pre-commit hook (`.husky/pre-commit` + `scripts/convert-image.sh`) auto-converts to WebP and stages it. Folders `public/stamps`, `public/passport-bg`, `public/passport-tiers` are opt-in.

5. **Verify alpha on the committed WebP**: `sips -g hasAlpha public/stamps/<file>.webp` — must also say `hasAlpha: yes`. If `no`, the source PNG was opaque — fix that, don't try to patch the WebP.

6. **If the country is new**, also add the filename to `CUSTOM_STAMPS` in `lib/passport-stamps.ts` and `STATIC_PASSPORT_ASSETS` in `components/passport/PassportAffordance.tsx` (per CLAUDE.md).

**Boilerplate to append after each core prompt** (preferred — asks generator for native transparency, which avoids the keying step entirely):

```
Output as a PNG with a native transparent background — alpha channel preserved, no white fill, no checkerboard texture, no opaque backdrop. The stamp must fill the canvas — its outer border touches the canvas edges. No surrounding page, no paper margin, no canvas frame around the stamp. Outside the stamp's silhouette is fully transparent. Inside the frame between the ink lines is also fully transparent — the interior must not be a card, paper, cream wash, halo, or any opaque shape behind the motifs. Only the inked strokes (frame outline, border motifs, center line-art, text) are opaque. No substrate texture inside the silhouette — no glaze, no ceramic crackle, no cloth weave, no paper fiber, no plaster, no bark. The result must read as a stamp pressed onto paper, not a sticker.

no human faces, no portrait sculpture, no ceremonial mask faces, no anthropomorphic deity faces, no religious figure faces painted on architecture, no neon colors, no pure black, no fluorescent saturation, no stock-photo realism, no AI-cliché smooth gradient, no text errors, no garbled native script, no woven cloth substrate, no fabric weave fill, no carved stone substrate, no parchment background, no cream background, no white background, no card fill inside the silhouette, no paper card inside the frame, no cream wash inside the silhouette, no opaque substrate behind the motifs, no sticker look, no die-cut card
```

The older boilerplate variant ("Render against a pure white background... this white will be removed to transparent in post") is the Path-B fallback and requires the manual key-out step in #3 above.
