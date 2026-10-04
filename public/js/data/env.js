// js/data/env.js: the ONLY switches to flip when the Cloudflare backend is live
export const ENV={
 API:'/api',       // '/api' = live backend (same domain as the Worker). Use '' for browser-only demo mode.
 SIGNUP:'invite',   // 'invite' = only approved emails can sign in. 'open' = anyone can sign up and wait as pending (also set SIGNUP in worker/wrangler.toml).
 CHAT:true,         // show the AI chat widget
 FOUNDER:'samuel-mk'
};
