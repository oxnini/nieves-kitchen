---
name: feedback-magick-missing-python-key
description: ImageMagick magick not installed; key opaque-white stamp backgrounds in Python instead of stopping
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 14678636-40dd-4c08-913f-6619cae6bbfb
---

`magick` (ImageMagick) is NOT installed on this machine. The ingeststamp skill's step 2 says to stop if a source PNG has an opaque white background and magick is missing — but don't stop. Replicate `magick -fuzz X% -transparent white` in Python (PIL): for each pixel, compute euclidean distance from white `sqrt((255-r)²+(255-g)²+(255-b)²)`; if `<= fuzz*255`, set alpha 0.

**Why:** Some ChatGPT/Sora exports come out flattened (no alpha, baked near-white background, channel values 242–255 with noise). They still need ingesting.

**How to apply:** Start at 8% fuzz; if a corner stays opaque (the darkest off-white ~242 sits just outside the 8% radius and the bbox then grabs the whole canvas), bump to ~12%. Stamp ink is saturated blue/red, far from white, so 12% is safe. Verify all four corner alphas = 0 before cropping. See [[feedback_stamp_generation_workflow]] and [[feedback_stamp_crop_alpha_threshold]].
