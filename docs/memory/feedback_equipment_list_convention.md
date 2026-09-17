---
name: equipment-list-convention
description: "How to write a recipe's equipment list — only genuinely special tools, framed by function with alternatives, never a shopping list"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: d54de5f0-5080-44f8-b453-6f5265332144
---

**Convention (decided 2026-06-24, "approach A"):** A recipe's `equipment` list should only contain tools that are (a) NOT something nearly every kitchen has AND (b) genuinely shape the cook. Frame each item by *function* (what you need to be able to do) with the easy everyday alternative inline, never brand/gear names. If nothing special remains, omit the `equipment` field entirely (the `EquipmentList` component hides when empty).

**Cut these:** anything universal (bowls, mixing bowls, a bowl of water for sealing, spoons, forks, tongs); over-specific gear for a basic task (a "box grater" when the point is just "mince/grate it fine"); a sieve/slotted spoon for an obvious task. Move any minor caveat (e.g. "use a *heatproof* bowl") into the step where it's used, not the equipment list.

**Keep + reframe these:** a genuine special need like "a way to steam" or "an oven dish," written inclusively. Examples of the agreed voice:
- "Something to steam in (a basket, a colander or sieve over a pot, or a heatproof plate on a trivet)"
- "A large oven dish, roughly 9 by 13 inches (a baking dish or roasting tin both work)"
- "A lidded frying pan, if you want to crisp the bottoms"

**Why:** Brand is a thoughtful friend, not a product. An over-specific gear checklist makes a curious cook feel they lack what they need when alternatives abound. The list should reassure ("you probably already have something that works"), telling them what *matters* and being quiet about the rest. The `EquipmentList` component was always documented as "non-obvious tools"; the data had just drifted.

**How to apply:** Authoring rule lives in code at `data/recipes/_types.ts` (the `equipment` field doc) and `components/recipe/EquipmentList.tsx`. Remember [[feedback_no_em_dashes]] — these strings are user-facing, so no em dashes. Applied retroactively to all 5 recipes the same day: prawn-spaghetti and aglio-e-olio lost the section entirely; lasagna → 1 item; dumpling-lasagna → 3 (genuine steam setup); xinjiang-lamb-dumplings → 2. See [[feedback_seed_for_the_cook]] — reseed after editing.
