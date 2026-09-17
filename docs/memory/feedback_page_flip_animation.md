---
name: No 3D page flip animation
description: User tried and rejected framer-motion 3D rotateY page flip in passport booklet — didn't look good
type: feedback
originSessionId: 9a99fe35-3da5-47da-a054-9083d5655fec
---
Don't animate passport page-turn transitions. Two approaches tried and rejected:
1. 3D framer-motion rotateY flip (via `Page.tsx`) — looked cheap
2. Shadow sweep + crossfade (gradient overlay sweeping across during content swap) — buggy

**Why:** Both approaches created more problems than they solved. The instant page swap works fine.

**How to apply:** Leave passport page transitions as instant swaps. Don't attempt page-turn animations. `Page.tsx` is dead code (framer-motion 3D flip) — can be deleted as cleanup but don't replace it with another transition.
