---
name: SPEC edits before contradicting code
description: For nieves-kitchen, when about to write code that contradicts a documented design SPEC, propose the SPEC edit first as a separate PR
type: feedback
originSessionId: 89c88272-5249-4688-a697-8bab82438466
---
When a SPEC document (e.g. `docs/stamps/SPEC.md`) governs a feature and you
are about to write code that deviates from a numeric/structural rule in that
SPEC, propose the SPEC patch first — as a standalone change, separate from
the code — with rationale inline as a note in the SPEC body.

**Why:** The user values the SPEC as the source of truth that future-them /
future-Claude / future-contributors will read. Silently shipping code that
contradicts the SPEC leaves the SPEC stale and turns the codebase into the
authority, defeating the purpose. The user explicitly called this out in
the original step-1 brief: *"If you think a SPEC rule is wrong, propose a
SPEC edit before writing code that contradicts it."*

**How to apply:** When iterating on a SPEC-governed feature, the loop is:
(1) propose the SPEC edit with a short rationale, (2) wait for / confirm
approval, (3) implement the code change. For an iteration-heavy visual
feature like the passport stamps, also leave a one-line history note in
the SPEC (e.g. *"earlier drafts: 70% → 55% → 40%"*) so the reasoning
behind the current number survives.
