// js/data/env.js
export const ENV={
 API:'/api',        // the Cloudflare Worker, same domain as the site
 SIGNUP:'invite',   // 'invite' = only approved emails can sign in; 'open' = anyone can sign up and wait as pending (also set SIGNUP in wrangler.toml)
 CHAT:true,
 FOUNDER:'samuel-mk'
};
