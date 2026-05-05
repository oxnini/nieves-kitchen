# Nieves — Next Steps for Security

Three things the security audit fixed in code but that need a human to finish before going live.

---

## 1. Run the rate-limit migration on Supabase

Caps each user at 5 stamps per recipe per 24h and 10 000 stamps lifetime. Stops the abuse vector that combines anonymous sign-up + unbounded `passport_stamps` inserts.

- Open Supabase dashboard → **SQL Editor** → New query.
- Paste the contents of [`scripts/migrations/2026-05-05-rate-limit-stamps.sql`](./scripts/migrations/2026-05-05-rate-limit-stamps.sql).
- Run. It's idempotent (safe to re-run).
- Verify: `select tgname from pg_trigger where tgrelid = 'public.passport_stamps'::regclass;` should include `passport_stamps_rate_limit_trg`.

---

## 2. Enable captcha on anonymous sign-ins

The code path already accepts a captcha token — it just needs Supabase configured and a widget on the page.

- Supabase dashboard → **Authentication → Settings → Bot and Abuse Protection**.
- Enable **hCaptcha** or **Cloudflare Turnstile**. Copy the site key.
- Add a captcha widget to the layout (Turnstile is the lighter option). Pass its token into `ensureAnonymousSession(supabase, token)` in `components/Providers.tsx` and remove the `TODO(H2)` comment.

Without this step, anyone can mint anonymous Supabase users at scale and burn your auth quota.

---

## 3. Replace the placeholder disclosure email

- Open `SECURITY.md`.
- Replace `security@nieveskitchen.example` with a real, rotatable address (not your personal Gmail).
- Remove the `<!-- TODO -->` line.

A rotatable address means: if it gets spammed or burned, you can change it without losing access to anything else.

---

## Optional, when you have time

- **Promote CSP from Report-Only to enforcing.** After 24-48h of clean reports in production, change `Content-Security-Policy-Report-Only` → `Content-Security-Policy` in `next.config.ts`. Then add a per-request nonce in middleware to drop the `'unsafe-inline'` script-src.
- **Scrub `docs/superpowers/` from git history** if you care about the planning docs not being recoverable from the public repo's history. They're already gitignored and removed from the index — but `git log` can still surface them. Use `git filter-repo` (destructive — coordinate first).
- **Decide on `react-simple-maps`.** The d3-color ReDoS chain is suppressed because no user input flows into color parsing in this app. If you migrate to the v1.x rewrite later, the audit cleans up.
