# L.I.G.O. SPACE: deploy (one Worker serves the website and the API)

Layout: `wrangler.toml` + `src/index.js` (API) + `public/` (the website). Same domain for both.

## Sign-in is email + password
- Accounts are created by the admin. Members get a temporary password and must choose their own at first sign-in.
- No emails are involved in signing in. (The email-sending code was removed. Brevo / Cloudflare Email can be added back later for notifications.)

## Deploy, in this order
1. Database (once): `npx wrangler d1 execute ligo --remote --file=migrate-password.sql`
   (If you have not run it yet, also run `migrate.sql` for the impact table and the founder profile.)
2. Secrets (once each): `npx wrangler secret put SUPABASE_SERVICE_KEY` and `npx wrangler secret put SETUP_TOKEN` (make SETUP_TOKEN a long random phrase).
3. `npx wrangler deploy`
4. First admin password: open the site > Sign in > **First-time setup (administrator)** > admin email, a new password, the setup token. Then sign in.
5. Remove the token: `npx wrangler secret delete SETUP_TOKEN`

## Day to day
- New member: Admin queue > **Approve and create account** (or "Create or reset a member account"). Copy the message and send it privately, for example on WhatsApp.
- Member forgot their password: create/reset with the same email; they get a new temporary password.
- Admin forgot their password: `npx wrangler d1 execute ligo --remote --command "UPDATE users SET pw=NULL WHERE role='admin'"`, set `SETUP_TOKEN` again, repeat step 4.
- 5 wrong passwords lock an account for 15 minutes. Changing a password signs out the other devices.

## Important: password hashing and the free Workers plan
Passwords are hashed with PBKDF2 (100,000 rounds, the maximum Workers allows). That costs roughly 45 ms of CPU per sign-in on my test machine. The free Workers plan allows about 10 ms of CPU per request, so sign-in may fail with error 1102 there.
- Best: the Workers Paid plan (about $5 a month).
- Demo-only workaround on the free plan: add `PW_ITER = "10000"` under `[vars]` in `wrangler.toml` (weaker hashing). Existing hashes keep working because each stores its own round count.

## Notes
- Open sign-up later: `SIGNUP = "open"` in `wrangler.toml` and `SIGNUP:'open'` in `public/js/data/env.js`. New accounts wait as "pending".
- Add Cloudflare rate-limit rules for `/api/auth/login`, `/api/chat`, `/api/submissions`.
- Supabase free projects pause after about a week of inactivity; photos go offline until resumed.
