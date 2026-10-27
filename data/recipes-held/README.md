# Held recipes

Written, tested recipes the cook wants to cook again before they go on the site.
`scripts/seed-recipes.ts` only reads `data/recipes/`, so nothing here is ever published.

- **To publish one:** move `<slug>.ts` into `data/recipes/`, change its import back to
  `./_types`, convert any `substitutions` to numbered `notes` (see `_types.ts`), then seed.
- **While cooking:** every recipe here is also readable in full on the "Cook again" tab of
  the Shortlist artifact (https://claude.ai/artifact/1dRPpRb5A5vuykwmwANTFa), which has a
  notes box per recipe for tweaks. Read those notes back before publishing.
- `notes/<slug>.md` holds the author's and tester's notes for each recipe.

Nothing in this folder is deleted when a recipe is held: holding is a move, not a removal.
