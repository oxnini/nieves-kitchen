---
name: recipe-page-layout-prefs
description: "Recipe detail layout verdicts — nutrition is a bold per-serving line under the facts since 2026-10-09 (tiles, ledger, ruled row, band all rejected); extra photos must fill the ingredients margin (shrink-to-fit beats band)"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 5a86dfec-c8e3-40e5-8d7a-f6f22ae20ce8
---

Two recipe-detail layout verdicts from the 2026-07-02 desktop polish pass:

1. Nutrition presentation: on 2026-07-02 the user rejected dotted-leader ledger rows in favour of the boxed tiles. **Superseded 2026-10-09** (audit F2, /dev/recipe-header): the tiles went too. Nutrition now sits in the header under the facts row as `components/recipe/ServingFacts.tsx` (semibold "Per serving · approx." heading, four Newsreader figures, no boxes or rules). Rejected in that lab: white tiles ("took up a lot of space"), a ruled facts-style row ("too hidden", too many lines), a tinted band, calories-lead. The FlavorCompass was retired the same day. Do not re-propose the ledger or the tiles.
2. Extra recipe photos (`images[]`): user wants them to fill the white space under the Ingredients column, not sit in a band below the steps. Implemented as `components/recipe/useGalleryPlacement.ts` — measures both columns, promotes photos greedily, and walks a size ladder (320→224px caps, ~120px overshoot allowed) so the FULL set fits in the margin at a smaller size rather than splitting into the band. Band is last resort only.

**Why:** User prioritizes a well-filled two-column spread over fixed placement rules; a complete margin gallery at smaller size beats stragglers at the bottom.

**How to apply:** When touching recipe-detail layout or adding gallery features, preserve the measured-placement behavior and never reintroduce count-based placement (1→margin, 2+→band) on desktop. Keep nutrition as the ServingFacts line under the facts row. See also [[reject-colour-illustration-stamps]] for the pattern of respecting rejected experiments.
