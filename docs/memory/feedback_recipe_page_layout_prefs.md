---
name: recipe-page-layout-prefs
description: "Recipe detail layout verdicts from the 2026-07-02 polish pass — nutrition tiles stay (ledger rejected), extra photos must fill the ingredients margin (shrink-to-fit beats band)"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 5a86dfec-c8e3-40e5-8d7a-f6f22ae20ce8
---

Two recipe-detail layout verdicts from the 2026-07-02 desktop polish pass:

1. Nutrition presentation: user REJECTED replacing the 2x2 boxed macro tiles in InfoStrip with dotted-leader ledger rows (it opened dead space next to the FlavorCompass). The tiles stay. Do not re-propose the ledger treatment.
2. Extra recipe photos (`images[]`): user wants them to fill the white space under the Ingredients column, not sit in a band below the steps. Implemented as `components/recipe/useGalleryPlacement.ts` — measures both columns, promotes photos greedily, and walks a size ladder (320→224px caps, ~120px overshoot allowed) so the FULL set fits in the margin at a smaller size rather than splitting into the band. Band is last resort only.

**Why:** User prioritizes a well-filled two-column spread over fixed placement rules; a complete margin gallery at smaller size beats stragglers at the bottom.

**How to apply:** When touching recipe-detail layout or adding gallery features, preserve the measured-placement behavior and never reintroduce count-based placement (1→margin, 2+→band) on desktop. Keep nutrition as tiles. See also [[reject-colour-illustration-stamps]] for the pattern of respecting rejected experiments.
