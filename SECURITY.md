# Security Policy

## Reporting a vulnerability

If you've found a security issue in Nieves' Kitchen, please report it privately by emailing **security@nieveskitchen.com**. Please don't open a public GitHub issue or PR for security reports — write to the address above first so we can investigate before details are public.

## What to expect

- An acknowledgement within 72 hours of your report.
- A fix timeline scaled to severity: critical issues are patched as soon as possible; lower-severity issues are scheduled into the regular release cadence.
- Credit in the release notes for the fix, if you'd like to be named.

## Scope

In scope: the production app at the live domain (TBD) and the source code in this repository.

Out of scope: third-party services we depend on (Supabase, Vercel, Next.js, npm packages — please report those upstream), and local development environments.

## Out of scope / known issues

- We're aware of a transitive `d3-color` ReDoS via `react-simple-maps`; it's tracked but not exploitable in this app since no user input flows into color parsing.
