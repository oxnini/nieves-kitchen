---
name: No em dashes in website text
description: Never use em dashes (—) in user-facing website text (JSX/TSX strings, mock recipe data, alt text, microcopy, UI labels). Em dashes ARE fine in chat replies, code comments, docs, commit messages
type: feedback
originSessionId: ce8dfe9d-ee18-4f92-a27c-a1db5ae8012a
---
No em dashes (—) in any text the user will see rendered in the Nieves Kitchen website. Em dashes are still fine in chat, code comments, markdown docs, commit messages, PR bodies, and any non-rendered text.

**Why:** User preference (clarified 2026-05-17). The rule is scoped to the *product* surface (what visitors read), not my working notes or developer-facing text.

**How to apply:**
- When writing or editing user-facing strings in JSX/TSX, mock recipe copy, alt text, button labels, empty states, error messages, microcopy: reach for commas, colons, parentheses, periods, or a sentence break.
- Examples of substitutes for "A collection of recipes — tried and tested.":
  - "A collection of recipes, tried and tested." (comma)
  - "A collection of recipes: tried and tested." (colon)
  - "A collection of recipes (tried and tested)." (parens)
- When auditing existing website text, search for both `—` (U+2014) and the HTML entity `&mdash;`.
- En dashes (–) for numeric ranges like "1–5 minutes" are fine.
- Hyphens (-) in compounds ("user-facing", "well-traveled") are fine.
- Do NOT touch em dashes in: chat output, .md docs, code comments, commit messages, PR descriptions, internal scripts.
