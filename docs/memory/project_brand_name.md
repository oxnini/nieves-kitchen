---
name: project_brand_name
description: "Brand name is \"Nieves's Kitchen\" (possessive), not \"Nieves Kitchen\""
metadata: 
  node_type: memory
  type: project
  originSessionId: 7ec7fe58-2501-483b-b17d-be38c35e52e9
---

The brand is **Nieves's Kitchen** (with the possessive `'s`), corrected by the user 2026-07-13. Wordmark = "Nieves's" upright + *"Kitchen"* italic.

Fixed in the redesign prototypes (`app/dev/redesign/v2/*`). **Production UI swept 2026-07-14 in Courtyard Phase 3** (branch `feat/courtyard-phase-3-nav-footer`, not yet merged): all metadata titles, page headings, aria-labels, and the Navbar/Footer/CoverHero/WhereNext/JournalMasthead/passport wordmarks now say "Nieves's Kitchen". Wordmark visual form (upright "Nieves's" + italic-brass "Kitchen") lives in `Navbar.tsx` + `Footer.tsx`; plain strings use plain text. **Still NOT swept (docs, out of UI scope):** README.md, SECURITY.md, TODO.md, CLAUDE.md still say "Nieves' Kitchen" — sweep if/when convenient. See [[project_courtyard_production_rollout]]. Related: [[project_home_cover_redesign]].
