# L.I.G.O. SPACE: deploy (one Worker serves the website and the API at https://ligospace.co.ke)

Layout: `wrangler.toml` + `src/index.js` + `src/chat.js` + `src/faq.js` (API and chat) + `public/` (the website). Same domain for both, so sign-in cookies just work.
Tip: sign-in cookies belong to one host name. Add a Cloudflare Redirect Rule from www.ligospace.co.ke to ligospace.co.ke so people do not end up with two separate sessions.

## Sign-in is email + password
- Accounts are created by the admin. Members get a temporary password and must choose their own at first sign-in.
- No email is sent by the site (no Brevo, Resend or similar). New applications and introduction requests wait in the Admin queue; WhatsApp and other notification routes can be added later.

## Deploy, in this order
1. Database: already up to date on your live database (password columns, impact table, founder profile, chat counters and founder phone, AI settings, posts). The `.sql` files are only for a fresh database.
2. Secrets (once each): `npx wrangler secret put SUPABASE_SERVICE_KEY` and `npx wrangler secret put SETUP_TOKEN` (make SETUP_TOKEN a long random phrase).
3. `npx wrangler deploy`
4. First admin password: open the site > Sign in > **First-time setup (administrator)** > admin email, a new password, the setup token. Then sign in.
5. Remove the token: `npx wrangler secret delete SETUP_TOKEN`

## Chat (English + Kiswahili)
- Order of answers: safety check, then curated FAQs in `src/faq.js` (free, instant), then free Workers AI, then a plain message with the contact details.
- One-time database change: `npx wrangler d1 execute ligo --remote --file=migrate-v3.sql` (also puts the founder's phone on the founder page only). Until it runs, the FAQ answers still work but the AI tier stays off.
- Choosing the AI model: sign in as admin > Admin queue > **AI model lab**. Tick up to 3 models, run the test, read the English and Kiswahili answers, then press **Use this model**. It switches instantly (stored in the database, no redeploy). One-time: `npx wrangler d1 execute ligo --remote --file=migrate-v4.sql`.
- Optional AI Gateway: Cloudflare dashboard > AI > AI Gateway > create a gateway named `ligo`, then un-comment `AI_GATEWAY = "ligo"` in `wrangler.toml`. In the gateway settings, turn off or shorten log storage so visitors' questions are not kept.
- Free allowance guard: 300 AI answers a day in total and 15 an hour per visitor (`CHAT_DAILY_CAP`, `CHAT_HOURLY_PER_IP`). FAQ answers do not count.
- Before launch: have a Kiswahili speaker review the Swahili text in `src/faq.js`, and re-check the helpline numbers in `SAFE` (999/112, Red Cross 1199, Childline 116, GBV 1195).
- To add or change an answer: edit `src/faq.js` only, then `npx wrangler deploy`.

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

## Dashboard, posts and themes
- `/account` is the member dashboard and `/admin` the admin one. Both use a sidebar on the left (desktop) and a tab bar at the bottom (phones). Sections: Overview, My profile, Posts, Settings; admins also get Review, Members, Impact, AI lab.
- Members share up to 6 short posts or products. Each is reviewed in **Admin > Review > Posts & products** before it shows on `/showcase` and on the member's profile. A rejected item keeps its text and the admin's note so the member can fix and resubmit. Members of the children / vulnerable program never show direct links.
- Light / dark mode: the sun/moon button in the header and sidebar, or Settings > Appearance. All colours live in `public/css/tokens.css`. Rule for new work: use the tokens (`var(--surface)`, `var(--ink)`, `var(--head)`, ...), never raw hex colours, so text stays readable in both themes.
- Loader: `public/css/loader.css` (every rule scoped to `.ligo-boot`), the markup in `index.html`, and `public/js/boot/guard.js`. It cannot change the site's colours.
