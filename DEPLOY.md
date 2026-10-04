# L.I.G.O. SPACE: deploy (one Worker serves the website and the API)

Layout: `wrangler.toml` + `src/index.js` (API) + `public/` (the website). Same domain for both, so login cookies just
work.

1. In this folder: `npx wrangler deploy` (creates the Worker **ligo-space** at
   https://ligo-space.ligospace-ke.workers.dev). If you deploy from GitHub (Workers Builds), the Worker name in the
   dashboard must equal `name` in `wrangler.toml`.
2. Secrets (once): `npx wrangler secret put SUPABASE_SERVICE_KEY` and `npx wrangler secret put RESEND_API_KEY`. Check
   with `npx wrangler secret list`.
3. Founder profile (once, edit the email to your admin email):
   `npx wrangler d1 execute ligo --remote --command "INSERT INTO profiles(slug,user_id,founder,live) VALUES('samuel-mk',(SELECT id FROM users WHERE email='YOU@EXAMPLE.COM'),1,'{\"name\":\"Samuel M.K.\",\"headline\":\"Founder & President, L.I.G.O. SPACE\",\"bio\":\"...\",\"programs\":[],\"links\":{},\"photo\":\"\",\"video\":\"\"}')"`
4. Test: open the site > Sign in with your admin email > open the link from your email > Admin queue.

Notes

-  Resend: `onboarding@resend.dev` only delivers to the email of your own Resend account. To email members, verify a
   domain in Resend (needs a custom domain) and update `FROM_EMAIL`.
-  Open sign-up later: `SIGNUP = "open"` in `wrangler.toml`, then `npx wrangler deploy`; also set `SIGNUP:'open'` in
   `public/js/data/env.js`.
-  Add Cloudflare rate-limit rules for `/api/chat`, `/api/auth/login`, `/api/submissions` (the AI endpoint is public).
-  Supabase free projects pause after about a week of inactivity; photos go offline until resumed.
-  Demo mode: set `API:''` in `public/js/data/env.js` to run the site without a backend.