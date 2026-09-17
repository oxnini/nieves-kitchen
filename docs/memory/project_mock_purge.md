---
name: project_mock_purge
description: 2026-09-02 mock cutover — all 33 fake recipes and 120 orphan stamps deleted from prod; catalogue is now 7 real recipes only
metadata: 
  node_type: memory
  type: project
  originSessionId: 3bf71f0f-fcd5-4b25-8567-45191f9d919b
  modified: 2026-09-02T21:07:41.378Z
---

**2026-09-02: the mock cutover happened.** The live Supabase `recipes` table now holds
**only the 7 real founder-cooked recipes** that have source files in `data/recipes/`:
chinese-prawn-spaghetti, classic-lasagna, dumpling-lasagna, gochujang-fried-chicken,
spaghetti-aglio-e-olio, turkish-eggs, xinjiang-lamb-dumplings.

Deleted: **33 fake rows** (21 prefixed `mock-` from `scripts/seed-mock.ts`, plus 12
unprefixed legacy rows that existed only in the DB with no source file: biscoff-dessert,
burrata-salad, garlic-prawn-spaghetti, grilled-halloumi, honey-garlic-salmon, jerk-chicken,
leek-miso, mango-sago, moroccan-couscous, shawarma-wraps, sichuan-spaghetti,
thai-green-curry). Also deleted **120 orphaned `passport_stamps`**; the 7 stamps on
surviving recipes were kept (dumpling-lasagna x5, xinjiang-lamb-dumplings, turkish-eggs).

**Backups** (40 recipes + 127 stamps as JSON, fully restorable):
`~/Documents/nieves-kitchen-db-backup-20260902/`, `~/nieves-kitchen-db-backup-20260902/`,
and `~/nieves-kitchen-db-backup-20260902.tar.gz`.

**Unexpected win:** deleting the mocks fixed the site's worst design problem by itself.
The stock photography was wildly inconsistent (a burger photo was captioned "Bobotie");
the 7 real photos hang together and the catalogue now reads as one person's kitchen.

**Re-contamination footgun, NOT yet removed:** `lib/mock-recipes.ts`,
`scripts/seed-mock.ts` and the `seed:mock` npm script still exist. Running
`npm run seed:mock` would re-insert 21 mock rows into production. Consider deleting all
three plus the `NEXT_PUBLIC_USE_MOCK_DATA` path (and the CLAUDE.md references) once the
real-recipe pipeline is the only one in use.

Catalogue skew to be aware of: 4 countries only (3x Italy, 2x China, South Korea, Turkey).
Supersedes the "only ~2 real recipes" claim in [[project_business_validation_strategy]].
Related: [[feedback_seed_for_the_cook]], [[project_site_refresh_2026_09]].
