---
name: project-mobile-map-m5-skipped
description: "M5 of the C+ mobile world map overhaul was skipped — real-device perf measurement showed 60fps held under 4× CPU throttle, so no low-detail topology is needed for the wrap copies"
metadata: 
  node_type: memory
  type: project
  originSessionId: ea8dc1c5-e48a-48ae-a274-d8546e2f72cf
---

M5 (simplified topology for wrap copies, perf) from the mobile world map overhaul plan was **skipped** on 2026-05-26.

**Why:** The triple-render (centre + east wrap + west wrap) was the biggest perf risk in the C+ design. Real-device measurement (4× CPU throttle on Chrome DevTools, or mid-range Android) showed framerate stayed at 60fps during pan/pinch. Per the plan's M5 Step 1, that's the explicit skip condition.

**How to apply:** Do not bake `public/world-topo-low.json` or add a second fetch to `useMapTopology` unless a future change (e.g. adding more layers, more markers, denser hatch) introduces new jank. If perf regresses later, revisit M5 steps 2–7 in `docs/superpowers/plans/2026-05-24-mobile-world-map-overhaul.md`.

See also [[project-passport-audit]] for similar tracked work.
