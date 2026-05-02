# Nieves' Kitchen — Reminders

A running list of things to come back to. Check items off as they're done.

---

## About Page — Recipe Links

Once the recipe exists on the site, update the place name link to point to the actual recipe page (`/recipes/[slug]`) instead of the map coordinates.

| Dish mentioned | Location in text | Current link target | Recipe exists? | Recipe slug |
|---|---|---|---|---|
| Uyghur lamb dumplings | Intro paragraph | Map → Xinjiang | No | — |
| Seafood paella | Intro paragraph | Map → Spain | No | — |
| Korean street food | Intro paragraph | Map → South Korea | No | — |
| Bun cha | Intro paragraph | Map → Vietnam | No | — |
| Seafood salad | Intro paragraph | Map → Thailand | No | — |
| Uyghur lamb dumplings (Reddit story) | Full story dropdown | Not linked | No | — |
| Seafood paella (Costa Brava) | Full story dropdown | Not linked | No | — |
| Bun cha | Full story dropdown | Map → Vietnam | No | — |
| Seafood salad | Full story dropdown | Map → Thailand | No | — |
| Somali food with banana | Full story dropdown | Map → Somalia | No | — |
| Vietnamese coffee | Full story dropdown | Not linked | No | — |

---

## Other Reminders

- [ ] **Passport mobile layout**: Change the culinary passport on mobile to show one vertical page at a time instead of the current two-page spread. The two-page view is too cramped on small screens.
- [ ] **Recipe swipe/navigation**: Add prev/next navigation on recipe detail pages so users can browse through recipes without going back to the grid. Needs its own design pass — decide ordering (same region? filtered set? all?).
- [ ] **WorldMap "Maximum update depth exceeded" warning**: React circuit-breaker fires during programmatic zoom (continent click, search-result selection, breadcrumb click). Suspected loop: `tick()` rAF → `setControlledPos` → `<ZoomableGroup>` re-render → `onMoveEnd` → `handleMoveEnd` snap-back → new `tick()`. Investigate the snap-back guard in `handleMoveEnd` (~line 480) and the `isAnimatingRef.current` flag (~line 421) in `components/WorldMap.tsx`. Possible fixes: earlier `if (isAnimatingRef.current) return` in `handleMoveEnd`, or skip `setControlledPos` on the final tick frame. Risk: zoom logic is load-bearing for all map navigation — needs careful manual testing of continent zoom, search zoom, and breadcrumb zoom in both themes after any change. Payoff: clean console, lower CPU/battery on programmatic zoom, removes a latent infinite-loop bug. Last seen: 2026-05-02 explore-page audit (item 3, the path from 19/20 → 20/20).

---

## Recipe Page Improvements (brainstorming in progress)

- [ ] **Checkable ingredients & steps**: Let users check off ingredients and instruction steps as they cook. Visual strikethrough or dimming on checked items.
- [ ] **Unit conversion (metric/imperial)**: Toggle between metric and imperial units for ingredient quantities.
- [ ] **Structured substitutions**: Dedicated section or per-ingredient substitution suggestions (inspired by Minimalist Baker's approach).
- [ ] **Storage & reheating notes**: Section explaining how to store leftovers, shelf life, and reheating instructions.
- [ ] **"I Cooked This" button redesign**: Current button is buried and visually flat — needs to feel like a milestone moment, not a form submit.
- [ ] **Revisit: Sticky navigation for mobile**: Evaluate adding a sticky bar with Ingredients/Steps tabs for mobile, where the sidebar stacks vertically. Decide after other features are implemented.
