// worker/src/index.js: L.I.G.O. SPACE API (D1 + Supabase Storage + Workers AI). Same routes as js/data/api.js demo engine.
const RESTRICTED=['children-vulnerable-communities'];

// Security Headers including permissive CSP for local API & Cloudflare Workers AI/Challenges
const SECURITY_HEADERS = {
  'content-type': 'application/json',
  'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://static.cloudflareinsights.com https://challenges.cloudflare.com; connect-src 'self' https://www.ligospace.co.ke https://ligospace.co.ke https://lpnnntuelgaisoiimuka.supabase.co; img-src 'self' data: https:; style-src 'self' 'unsafe-inline';",
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin'
};

const J=(o,s=200,h={})=>new Response(JSON.stringify(o),{status:s,headers:{...SECURITY_HEADERS,...h}});
const hex=b=>[...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,'0')).join('');
const rnd=()=>hex(crypto.getRandomValues(new Uint8Array(24)));
const sha=async s=>hex(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(s)));
const url=u=>/^https?:\/\//i.test(u||'');
const slugify=t=>String(t).toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,40)||'member';
const okPhoto=(p,env)=>p.startsWith('/api/media/')||p.startsWith(env.SUPABASE_URL+'/storage/v1/object/public/ligo-public/');
const SB=env=>({authorization:'Bearer '+env.SUPABASE_SERVICE_KEY,apikey:env.SUPABASE_SERVICE_KEY});
const clean=(b,env)=>({name:String(b.name||'').slice(0,80),headline:String(b.headline||'').slice(0,120),bio:String(b.bio||'').slice(0,1500),
 programs:(Array.isArray(b.programs)?b.programs:[]).slice(0,6).map(String),photo:okPhoto(String(b.photo||''),env)?String(b.photo):'',video:url(b.video)?b.video:'',
 links:Object.fromEntries(Object.entries(b.links||{}).filter(([,v])=>url(v)).slice(0,8))});
const strip=o=>RESTRICTED.some(r=>o.programs.includes(r))?{...o,links:{},video:'',restricted:true}:o;   // children/vulnerable: no direct contact, ever
const full=r=>strip({slug:r.slug,founder:r.founder,...JSON.parse(r.live)});
const sum=r=>{const o=full(r);return{...o,bio:undefined,summary:o.bio.slice(0,160)}};
const SYS=`You are the assistant on the L.I.G.O. SPACE website. L.I.G.O. SPACE is a human-centered institution rooted in Kajiado South, Kenya, founded by Samuel M.K. Motto: Humanity First. Every Life Matters. What Crowns Us: Love. Official launch: 5 December 2026. It connects people with dignity, education, opportunity, skills, technology and enterprise. Members are independent providers; L.I.G.O. SPACE connects people and does not guarantee services. Visitors choose a pathway on the Partner with us or Get involved pages. Operational: community outreach, youth mentorship, talent and creativity. Developing: digital library, AI learning assistant, Opportunity Circle. Future and NOT available: vocational training center (subject to TVETA), SACCO (subject to SASRA, no financial products offered), university (long-term vision, subject to CUE), app, academy. Never claim future items exist. Never invent impact numbers, people, prices or dates. If unsure, say so and point to the Contact page (phone +254 791 236 179). Keep answers under 90 words, warm and plain. Do not ask for or store personal data.`;
const enc=new TextEncoder(),DUMMY=new Uint8Array(16);   // password hashing: PBKDF2-SHA256, salted, iteration count stored with each hash
const unhex=x=>Uint8Array.from(x.match(/../g).map(y=>parseInt(y,16)));
const pbk=async(pw,salt,iter)=>hex(await crypto.subtle.deriveBits({name:'PBKDF2',hash:'SHA-256',salt,iterations:iter},await crypto.subtle.importKey('raw',enc.encode(pw),'PBKDF2',false,['deriveBits']),256));
const hashPw=async(pw,env)=>{const it=parseInt(env.PW_ITER)||1e5,salt=crypto.getRandomValues(new Uint8Array(16));return it+':'+hex(salt)+':'+await pbk(pw,salt,it)};
const same=(a,b)=>{a=String(a);b=String(b);let r=a.length^b.length;for(let i=0;i<Math.max(a.length,b.length);i++)r|=(a.charCodeAt(i)||0)^(b.charCodeAt(i)||0);return r===0};
const verifyPw=async(pw,st)=>{const [it,sl,h]=String(st||'').split(':');return h?same(await pbk(pw,unhex(sl),parseInt(it)),h):false};
const okPw=p=>typeof p==='string'&&p.length>=8&&p.length<=100,okEmail=e=>/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e);
async function who(req,env){const sid=/(?:^|; )sid=([a-f0-9]+)/.exec(req.headers.get('cookie')||'')?.[1];if(!sid)return null;
 return env.DB.prepare('SELECT u.* FROM sessions s JOIN users u ON u.id=s.user_id WHERE s.hash=?1 AND s.exp>?2 AND u.status!=\'disabled\'').bind(await sha(sid),Date.now()).first()}
export default{async fetch(req,env,ctx){
 const u=new URL(req.url),P=u.pathname.replace(/^\/api\//,'').split('/'),M=req.method;
 if(!u.pathname.startsWith('/api/')&&env.ASSETS)return env.ASSETS.fetch(req);   // the website itself
 try{
  const body=async()=>{const t=await req.text();if(t.length>12000)throw new Error('Too large');return t?JSON.parse(t):{}};
  const me=await who(req,env),need=r=>{if(!me)throw new Error('Please sign in');if(r&&me.role!==r)throw new Error('Admins only')};
  if(M==='GET'&&P[0]==='team'){
   if(P[1]){const r=await env.DB.prepare('SELECT * FROM profiles WHERE slug=?1 AND live IS NOT NULL AND hidden=0').bind(P[1]).first();return r?J(full(r)):J({error:'Not found'},404)}
   const g=u.searchParams.get('program')||'';
   const {results}=await env.DB.prepare("SELECT * FROM profiles WHERE live IS NOT NULL AND hidden=0 AND (?1='' OR EXISTS(SELECT 1 FROM json_each(json_extract(live,'$.programs')) WHERE value=?1)) ORDER BY founder DESC,updated DESC LIMIT 200").bind(g).all();
   return J(results.map(sum))}
  if(M==='POST'&&P[0]==='auth'&&P[1]==='login'){const b=await body(),e=String(b.email||'').trim().toLowerCase().slice(0,120),pw=String(b.password||'').slice(0,100),now=Date.now();
   const usr=await env.DB.prepare('SELECT * FROM users WHERE email=?1').bind(e).first();
   if(usr&&usr.locked_until>now)return J({error:'Too many attempts. Please try again in 15 minutes.'},429);
   let ok=false;if(usr&&usr.pw)ok=await verifyPw(pw,usr.pw);else await pbk(pw,DUMMY,1e5);   // same work whether or not the account exists
   if(!ok||usr.status==='disabled'){if(usr){const f=(usr.fails||0)+1;await env.DB.prepare('UPDATE users SET fails=?1,locked_until=?2 WHERE id=?3').bind(f>=5?0:f,f>=5?now+9e5:0,usr.id).run()}return J({error:'Incorrect email or password.'},401)}
   await env.DB.prepare('UPDATE users SET fails=0,locked_until=0 WHERE id=?1').bind(usr.id).run();await env.DB.prepare('DELETE FROM sessions WHERE exp<?1').bind(now).run();
   const sid=rnd();await env.DB.prepare('INSERT INTO sessions VALUES(?1,?2,?3)').bind(await sha(sid),usr.id,now+2592e6).run();
   return J({ok:true,mustChange:!!usr.must_change},200,{'set-cookie':`sid=${sid}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=2592000`})}
  if(M==='POST'&&P[0]==='auth'&&P[1]==='register'){if(env.SIGNUP!=='open')return J({error:'Sign-up is by invitation only'},403);const b=await body(),e=String(b.email||'').trim().toLowerCase().slice(0,120);
   if(!okEmail(e)||!okPw(b.password))return J({error:'Enter a valid email and a password of 8 to 100 characters'},400);
   if(await env.DB.prepare('SELECT 1 AS x FROM users WHERE email=?1').bind(e).first())return J({error:'An account with this email already exists'},409);
   await env.DB.prepare("INSERT INTO users(email,status,pw) VALUES(?1,'pending',?2)").bind(e,await hashPw(b.password,env)).run();return J({ok:true})}
  if(M==='POST'&&P[0]==='auth'&&P[1]==='setup'){const b=await body(),e=String(b.email||'').trim().toLowerCase();   // one-time first password for an existing account, protected by the SETUP_TOKEN secret
   if(!env.SETUP_TOKEN||!same(b.token||'',env.SETUP_TOKEN))return J({error:'Invalid setup token'},403);if(!okPw(b.password))return J({error:'Password must be 8 to 100 characters'},400);
   const usr=await env.DB.prepare('SELECT * FROM users WHERE email=?1').bind(e).first();if(!usr||usr.pw)return J({error:'No account is waiting for a password'},400);
   await env.DB.prepare('UPDATE users SET pw=?1,must_change=0 WHERE id=?2').bind(await hashPw(b.password,env),usr.id).run();return J({ok:true})}
  if(M==='POST'&&P[0]==='auth'&&P[1]==='logout'){if(me){const sid=/sid=([a-f0-9]+)/.exec(req.headers.get('cookie')||'')[1];await env.DB.prepare('DELETE FROM sessions WHERE hash=?1').bind(await sha(sid)).run()}return J({ok:true},200,{'set-cookie':'sid=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0'})}
  if(M==='GET'&&P[0]==='me'&&!P[1]){need();const p=await env.DB.prepare('SELECT slug,live,pending,hidden,note FROM profiles WHERE user_id=?1').bind(me.id).first();
   return J({user:{email:me.email,role:me.role,status:me.status,mustChange:!!me.must_change},profile:p?{slug:p.slug,hidden:p.hidden,note:p.note,live:p.live&&JSON.parse(p.live),pending:p.pending&&JSON.parse(p.pending)}:null})}
  if(M==='PUT'&&P[0]==='me'&&P[1]==='profile'){need();const b=await body();if(b.consent!==true)return J({error:'Consent is required'},400);const c=clean(b,env);if(!c.name)return J({error:'Name is required'},400);
   const ex=await env.DB.prepare('SELECT slug FROM profiles WHERE user_id=?1').bind(me.id).first();
   if(ex)await env.DB.prepare("UPDATE profiles SET pending=?1,note='',updated=CURRENT_TIMESTAMP WHERE user_id=?2").bind(JSON.stringify(c),me.id).run();
   else await env.DB.prepare('INSERT INTO profiles(slug,user_id,pending) VALUES(?1,?2,?3)').bind(slugify(c.name)+'-'+rnd().slice(0,4),me.id,JSON.stringify(c)).run();
   return J({ok:true})}
  if(M==='PUT'&&P[0]==='me'&&P[1]==='password'){need();const b=await body();if(!okPw(b.next))return J({error:'New password must be 8 to 100 characters'},400);
   const row=await env.DB.prepare('SELECT pw FROM users WHERE id=?1').bind(me.id).first();if(!(await verifyPw(String(b.current||''),row.pw)))return J({error:'Current password is incorrect'},400);
   const cur=await sha(/sid=([a-f0-9]+)/.exec(req.headers.get('cookie')||'')[1]);await env.DB.prepare('UPDATE users SET pw=?1,must_change=0 WHERE id=?2').bind(await hashPw(b.next,env),me.id).run();
   await env.DB.prepare('DELETE FROM sessions WHERE user_id=?1 AND hash!=?2').bind(me.id,cur).run();return J({ok:true})}   // other devices are signed out
  if(M==='PUT'&&P[0]==='me'&&P[1]==='visibility'){need();await env.DB.prepare('UPDATE profiles SET hidden=?1 WHERE user_id=?2').bind((await body()).hidden?1:0,me.id).run();return J({ok:true})}
  if(M==='POST'&&P[0]==='media'){need();const ct=req.headers.get('content-type')||'';if(!/^image\/(png|jpeg|webp)$/.test(ct))return J({error:'PNG, JPG or WebP only'},400);
   const buf=await req.arrayBuffer();if(buf.byteLength>2e6)return J({error:'Image must be under 2 MB'},400);
   const key=`u${me.id}/${rnd()}`;const up=await fetch(`${env.SUPABASE_URL}/storage/v1/object/ligo-pending/${key}`,{method:'POST',headers:{...SB(env),'content-type':ct},body:buf});
   if(!up.ok)return J({error:'Upload failed'},502);await env.DB.prepare('INSERT INTO media(key,user_id) VALUES(?1,?2)').bind(key,me.id).run();return J({url:'/api/media/'+key})}
  if(M==='GET'&&P[0]==='media'){const key=P.slice(1).join('/'),r=await env.DB.prepare('SELECT * FROM media WHERE key=?1').bind(key).first();
   if(!r)return new Response('Not found',{status:404});
   if(r.status==='approved')return Response.redirect(`${env.SUPABASE_URL}/storage/v1/object/public/ligo-public/${key}`,302);
   if(!me||!(me.id===r.user_id||me.role==='admin'))return new Response('Not found',{status:404});
   const o=await fetch(`${env.SUPABASE_URL}/storage/v1/object/ligo-pending/${key}`,{headers:SB(env)});if(!o.ok)return new Response('Not found',{status:404});
   return new Response(o.body,{headers:{'content-type':o.headers.get('content-type')||'image/jpeg','cache-control':'private, no-store'}})}
  if(M==='POST'&&(P[0]==='submissions'||P[0]==='intro')){const b=await body();
   if(P[0]==='intro'){const p=await env.DB.prepare('SELECT slug FROM profiles WHERE slug=?1 AND live IS NOT NULL AND hidden=0').bind(String(b.slug)).first();if(!p)return J({error:'Not found'},404)}
   await env.DB.prepare('INSERT INTO submissions(type,payload) VALUES(?1,?2)').bind(P[0]==='intro'?'intro':'application',JSON.stringify(b)).run();return J({ok:true})}
  if(M==='POST'&&P[0]==='chat'){const m=((await body()).messages||[]).slice(-8).filter(x=>x&&(x.role==='user'||x.role==='assistant')&&typeof x.content==='string').map(x=>({role:x.role,content:x.content.slice(0,600)}));
   if(!m.length)return J({error:'No message'},400);const r=await env.AI.run('@cf/meta/llama-3.1-8b-instruct',{messages:[{role:'system',content:SYS},...m],max_tokens:260});return J({reply:(r.response||'').trim()||'Please use the Contact page.'})}
  if(M==='GET'&&P[0]==='impact'){const {results}=await env.DB.prepare('SELECT k,label AS l,target,achieved,verified FROM impact ORDER BY sort').all();return J(results)}
  if(P[0]==='admin'){need('admin');
   if(M==='PUT'&&P[1]==='impact'){const b=await body(),n=v=>Math.max(0,Math.min(1e9,parseInt(v)||0)),ach=n(b.achieved);
    await env.DB.prepare('UPDATE impact SET target=?1,achieved=?2,verified=?3,updated=CURRENT_TIMESTAMP WHERE k=?4').bind(n(b.target),ach,Math.min(n(b.verified),ach),String(b.k)).run();return J({ok:true})}
   if(M==='GET'&&P[1]==='queue'){const a=await env.DB.prepare('SELECT p.slug,u.email,p.pending FROM profiles p JOIN users u ON u.id=p.user_id WHERE p.pending IS NOT NULL').all();
    const s=await env.DB.prepare("SELECT id,type,payload FROM submissions WHERE status='new' ORDER BY id DESC LIMIT 100").all();
    return J({profiles:a.results.map(r=>({slug:r.slug,email:r.email,pending:JSON.parse(r.pending)})),subs:s.results.map(r=>({id:r.id,type:r.type,payload:JSON.parse(r.payload)}))})}
   if(M==='POST'&&P[1]==='decide'){const b=await body(),p=await env.DB.prepare('SELECT * FROM profiles WHERE slug=?1').bind(String(b.slug)).first();if(!p||!p.pending)return J({error:'Not found'},404);
    if(b.ok){const pd=JSON.parse(p.pending);if(pd.photo.startsWith('/api/media/')){const key=pd.photo.slice(11);
     const r=await fetch(env.SUPABASE_URL+'/storage/v1/object/copy',{method:'POST',headers:{...SB(env),'content-type':'application/json'},body:JSON.stringify({bucketId:'ligo-pending',sourceKey:key,destinationBucket:'ligo-public',destinationKey:key})});
     if(!r.ok)return J({error:'Photo could not be published'},502);pd.photo=env.SUPABASE_URL+'/storage/v1/object/public/ligo-public/'+key;await env.DB.prepare("UPDATE media SET status='approved' WHERE key=?1").bind(key).run()}
     await env.DB.prepare("UPDATE profiles SET live=?1,pending=NULL,note='' WHERE slug=?2").bind(JSON.stringify(pd),p.slug).run();await env.DB.prepare("UPDATE users SET status='active' WHERE id=?1").bind(p.user_id).run()}
    else await env.DB.prepare('UPDATE profiles SET pending=NULL,note=?1 WHERE slug=?2').bind(String(b.reason||'Please revise and resubmit.').slice(0,300),p.slug).run();return J({ok:true})}
   if(M==='POST'&&P[1]==='invite'){const b=await body(),e=String(b.email||'').trim().toLowerCase().slice(0,120);   // creates the account, or resets its password, with a temporary password the admin passes on
    if(!okEmail(e)||!okPw(b.password))return J({error:'Enter a valid email and a temporary password of 8 or more characters'},400);
    const ex=await env.DB.prepare('SELECT * FROM users WHERE email=?1').bind(e).first();if(ex&&ex.role==='admin')return J({error:'Admin accounts change their own password from the dashboard'},400);const h=await hashPw(b.password,env);
    if(ex)await env.DB.prepare("UPDATE users SET pw=?1,must_change=1,fails=0,locked_until=0,status='active' WHERE id=?2").bind(h,ex.id).run();
    else await env.DB.prepare("INSERT INTO users(email,status,pw,must_change) VALUES(?1,'active',?2,1)").bind(e,h).run();return J({ok:true,reset:!!ex})}
   if(M==='POST'&&P[1]==='resolve'){await env.DB.prepare("UPDATE submissions SET status='done' WHERE id=?1").bind((await body()).id).run();return J({ok:true})}}
  return J({error:'Not found'},404);
 }catch(e){const m=String(e.message||'');return J({error:/sign in|Admins|Too large/.test(m)?m:'Server error'},/sign in/.test(m)?401:/Admins/.test(m)?403:/Too large/.test(m)?413:500)}}};