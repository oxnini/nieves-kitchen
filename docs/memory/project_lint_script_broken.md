---
name: npm run lint is unusable
description: The `npm run lint` script runs `next lint` which is deprecated in Next 15 and prompts interactively; use `npx tsc --noEmit` for verification instead
type: project
originSessionId: 4b661d33-d2dd-403b-b73b-7299d4018928
---
`npm run lint` in this repo runs `next lint`. Next.js 15 deprecated `next lint` and replaced it with prompting the user to run `npx @next/codemod@canary next-lint-to-eslint-cli .` — so the script drops into an interactive ESLint setup wizard and hangs / fails non-interactively. There is no `eslint.config.*` file in the repo.

**Why:** Pre-existing project gap, surfaced when running CLAUDE.md's documented verification step during the 2026-05-23 cook-mode timer bell + mini stamp work.

**How to apply:** When verifying code changes in this repo, use `npx tsc --noEmit` instead of `npm run lint`. CLAUDE.md says `npm run lint` is a standard command but it has been non-functional since the Next 15 upgrade. If the user asks to fix it, the fix is to add an `eslint.config.mjs` and either keep the lint script as `next lint` (it'll then use the config) or change it to `eslint .`. Don't fix it as a side-effect of unrelated work.
