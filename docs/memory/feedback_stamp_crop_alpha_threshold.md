---
name: stamp-crop-alpha-threshold
description: "When ingesting a stamp PNG, alpha>0 bbox crop can fail if the render has a soft glow/vignette extending to the canvas — use a threshold crop (alpha>16) instead"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: af8990ec-01db-46ec-93b3-bb8a02635148
---

When cropping a stamp PNG to its artwork bbox during `/ingeststamp` step 3, `Image.split()[-1].getbbox()` returns the bbox of any pixel with `alpha > 0`. If the rendered stamp has a soft glow, vignette, or halo that fades to the canvas edges, the resulting bbox is near-full-canvas and the cropped image has huge empty margin around the actual art — causing the stamp to render *smaller* than its peers in the passport.

**Why:** First seen with the Thailand 2026-05-30 render — source PNG had a green vignette bleeding to all four edges; alpha>0 bbox was 1492×1022 of a 1536×1024 canvas, but the real artwork was only ~1301×863. Aspect was wrong and stamp rendered tiny.

**How to apply:** When a freshly-ingested stamp visually appears smaller than its peers, recrop with a threshold:

```python
a = im.split()[-1]
mask = a.point(lambda v: 255 if v > 16 else 0)
bbox = mask.getbbox()
```

Use `>16` (sometimes `>32`) — high enough to discard soft halos, low enough to keep frame fade. Compare bbox sizes at several thresholds first (16/32/64) to verify the bbox stabilises — that's the real artwork edge. Then re-encode webp and update `aspect` in [[passport-stamps]] `CUSTOM_STAMPS`.

**2026-06-17 Georgia/Iran (Gemini render):** Same symptom, different cause — distressed/grunge stamp frames scatter faint ink specks (alpha ~12-40) out to the canvas edges. `alpha>0` bbox grabbed the full 1536px height; the visible frame was only ~1290px tall. Needed a **higher threshold (`>80`)** to discard the specks; bbox stabilised from thr 40 onward, confirming ~80 is safe (solid frame/ink is alpha 255, well above). Add a small `pad=6` after thresholding so corners key back to alpha 0. So the threshold scales with the artifact: 16-32 for soft halos, ~80 for hard distress specks.

Related: [[stamp-generation-workflow]], [[ingeststamp-skill]].
