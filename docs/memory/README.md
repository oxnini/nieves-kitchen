# Working memory — conventions, rejections, and project state

These notes were accumulated over the life of the project as durable answers to
"how do we do this here?" and, more often, "why did we decide *not* to do that?".
They were previously held outside the repository; they are checked in here so the
reasoning survives independently of any one tool or session.

They are **notes, not specification**. Where one contradicts `CLAUDE.md`, the
running code, or a spec in `docs/superpowers/specs/`, those win. Each note records
what was true when it was written; the date on the decision is part of the content.

## How they are organised

| Prefix | What it holds |
|---|---|
| `feedback_*` | A working convention, usually born from a correction. Ships with the reasoning, so it can be re-judged rather than just obeyed. |
| `project_*` | The state of a workstream: what shipped, what was deferred, what is still open. |
| `reference_*` | Pointers to something else that holds the detail. |

`MEMORY.md` is the index: one line per note. Notes cross-reference each other with
`[[note-name]]`, matching the `name:` field in a note's frontmatter.

## The ones that carry the most weight

- `feedback_halal_no_alcohol.md` — every recipe is halal; no alcohol, ever. Non-negotiable.
- `feedback_halal_trust_voice.md` — never fabricate a ruling or a narration; cite the source.
- `feedback_journal_additive_not_scoreboard.md` — the Cook's Journal holds only what you
  actually cooked. No empty slots, no unearned badges. Repeatedly re-litigated and
  repeatedly rejected; `CLAUDE.md` encodes the same rule.
- `feedback_no_em_dashes.md` — no em dashes in user-facing site copy.
- `project_stamp_aesthetics_strategy.md` — the stamp grammar, with the per-region palette
  table. Read alongside `docs/stamps/SPEC.md` and the stamp specs in
  `docs/superpowers/specs/` before drawing a new country.
- `project_mock_purge.md` — why only `scripts/seed-recipes.ts` may write to the catalogue.
