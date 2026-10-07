// src/portal.js: posts, products, stories and events (member content), the members list, and moderation.
// Members' items are reviewed first; items posted by an admin go live immediately. index.js calls portal(ctx) first; it returns a Response, or null if the route is not ours.
const RESTRICTED=['children-vulnerable-communities'],LIMIT=6,ADMIN_LIMIT=200;
const TYPES=['post','product','story','event'],MAXB={post:600,product:600,story:4000,event:1500};
const cleanPost=(b,h)=>{const t=TYPES.includes(b.type)?b.type:'post',d=/^\d{4}-\d{2}-\d{2}$/.test(String(b.date||''))?String(b.date):'';
 return{type:t,title:String(b.title||'').trim().slice(0,80),body:String(b.body||'').trim().slice(0,MAXB[t]),price:t==='product'?String(b.price||'').trim().slice(0,40):'',date:t==='event'?d:'',place:t==='event'?String(b.place||'').trim().slice(0,80):'',link:h.url(b.link)?String(b.link):'',image:h.okPhoto(String(b.image||''))?String(b.image):''}};
const pub=r=>{const p=JSON.parse(r.live),pr=r.prof?JSON.parse(r.prof):null,team=r.role==='admin'||!pr,hide=!team&&RESTRICTED.some(k=>(pr.programs||[]).includes(k));   // members in the children / vulnerable program never show direct links
 return{id:r.id,at:r.at,...p,link:hide?'':p.link,author:team?{slug:'',name:'L.I.G.O. SPACE',photo:''}:{slug:r.slug,name:pr.name,photo:pr.photo||''}}};
const SEL="SELECT p.id,p.live,p.updated AS at,u.role,pr.slug,pr.live AS prof FROM posts p JOIN users u ON u.id=p.user_id LEFT JOIN profiles pr ON pr.user_id=p.user_id WHERE p.live IS NOT NULL AND (u.role='admin' OR (pr.live IS NOT NULL AND pr.hidden=0))";
async function publish(env,h,img){const key=img.slice(11);   // private bucket -> public bucket, only when something is published
 const r=await fetch(env.SUPABASE_URL+'/storage/v1/object/copy',{method:'POST',headers:{...h.SB(),'content-type':'application/json'},body:JSON.stringify({bucketId:'ligo-pending',sourceKey:key,destinationBucket:'ligo-public',destinationKey:key})});
 if(!r.ok)return null;await env.DB.prepare("UPDATE media SET status='approved' WHERE key=?1").bind(key).run();return env.SUPABASE_URL+'/storage/v1/object/public/ligo-public/'+key}
export async function portal(c){const {env,req,P,M,me,body,J,need,h}=c;
 if(M==='GET'&&P[0]==='posts'){
  if(P[1]){const r=await env.DB.prepare(SEL+' AND p.id=?1').bind(parseInt(P[1])||0).first();return r?J(pub(r)):J({error:'Not found'},404)}
  const q=new URL(req.url).searchParams,ts=(q.get('type')||'').split(',').filter(t=>TYPES.includes(t)),T=ts.length?ts:TYPES,t4=[...T,...Array(4-T.length).fill(T[0])],mem=q.get('member')||'';
  const {results}=await env.DB.prepare(SEL+" AND (?1='' OR pr.slug=?1) AND json_extract(p.live,'$.type') IN (?2,?3,?4,?5) ORDER BY p.updated DESC LIMIT 60").bind(mem,...t4).all();
  return J(results.map(pub))}
 if(P[0]==='me'&&P[1]==='posts'){need();const adm=me.role==='admin',lim=adm?ADMIN_LIMIT:LIMIT;
  if(M==='GET'){const {results}=await env.DB.prepare('SELECT id,live,pending,note FROM posts WHERE user_id=?1 ORDER BY updated DESC').bind(me.id).all();
   return J({limit:lim,direct:adm,posts:results.map(r=>({id:r.id,note:r.note,live:r.live&&JSON.parse(r.live),pending:r.pending&&JSON.parse(r.pending)}))})}
  if(M==='PUT'){const b=await body(),d=cleanPost(b,h);if(!d.title||!d.body)return J({error:'A title and some text are required'},400);if(d.type==='event'&&!d.date)return J({error:'An event needs a date'},400);
   if(adm&&d.image.startsWith('/api/media/')){const u=await publish(env,h,d.image);if(!u)return J({error:'The image could not be published'},502);d.image=u}   // admin posts skip review
   const js=JSON.stringify(d);
   if(b.id){const r=await env.DB.prepare('SELECT id FROM posts WHERE id=?1 AND user_id=?2').bind(parseInt(b.id)||0,me.id).first();if(!r)return J({error:'Not found'},404);
    await env.DB.prepare(adm?"UPDATE posts SET live=?1,pending=NULL,note='',updated=CURRENT_TIMESTAMP WHERE id=?2":"UPDATE posts SET pending=?1,note='',updated=CURRENT_TIMESTAMP WHERE id=?2").bind(js,r.id).run();return J({ok:true,id:r.id,live:adm})}
   const n=await env.DB.prepare('SELECT count(*) AS n FROM posts WHERE user_id=?1').bind(me.id).first();if(n.n>=lim)return J({error:'You can keep up to '+lim+' posts. Delete one to add another.'},400);
   await env.DB.prepare(adm?'INSERT INTO posts(user_id,live) VALUES(?1,?2)':'INSERT INTO posts(user_id,pending) VALUES(?1,?2)').bind(me.id,js).run();return J({ok:true,live:adm})}
  if(M==='DELETE'){await env.DB.prepare('DELETE FROM posts WHERE id=?1 AND user_id=?2').bind(parseInt(P[2])||0,me.id).run();return J({ok:true})}}
 if(P[0]==='admin'&&['members','member-status','post-queue','post-decide','post-remove'].includes(P[1])){need('admin');
  if(M==='GET'&&P[1]==='members'){const {results}=await env.DB.prepare("SELECT u.email,u.role,u.status,pr.slug,CASE WHEN pr.live IS NOT NULL THEN 1 ELSE 0 END AS live,CASE WHEN pr.pending IS NOT NULL THEN 1 ELSE 0 END AS pending,COALESCE(pr.hidden,0) AS hidden,(SELECT count(*) FROM posts x WHERE x.user_id=u.id) AS posts FROM users u LEFT JOIN profiles pr ON pr.user_id=u.id ORDER BY u.id DESC LIMIT 300").all();return J(results)}
  if(M==='POST'&&P[1]==='member-status'){const b=await body(),e=String(b.email||'').toLowerCase();if(!['active','disabled'].includes(b.status))return J({error:'Invalid status'},400);
   const u=await env.DB.prepare('SELECT id,role FROM users WHERE email=?1').bind(e).first();if(!u)return J({error:'Not found'},404);if(u.role==='admin')return J({error:'Admin accounts cannot be disabled here'},400);
   await env.DB.prepare('UPDATE users SET status=?1 WHERE id=?2').bind(b.status,u.id).run();if(b.status==='disabled')await env.DB.prepare('DELETE FROM sessions WHERE user_id=?1').bind(u.id).run();return J({ok:true})}
  if(M==='GET'&&P[1]==='post-queue'){const {results}=await env.DB.prepare("SELECT p.id,u.email,p.pending FROM posts p JOIN users u ON u.id=p.user_id WHERE p.pending IS NOT NULL AND (p.note IS NULL OR length(p.note)=0) ORDER BY p.updated").all();return J(results.map(r=>({id:r.id,email:r.email,pending:JSON.parse(r.pending)})))}
  if(M==='POST'&&P[1]==='post-remove'){await env.DB.prepare('DELETE FROM posts WHERE id=?1').bind(parseInt((await body()).id)||0).run();return J({ok:true})}   // take down anything that should not be public
  if(M==='POST'&&P[1]==='post-decide'){const b=await body(),r=await env.DB.prepare('SELECT * FROM posts WHERE id=?1').bind(parseInt(b.id)||0).first();if(!r||!r.pending)return J({error:'Not found'},404);
   if(b.ok){const d=JSON.parse(r.pending);if(d.image.startsWith('/api/media/')){const u=await publish(env,h,d.image);if(!u)return J({error:'The image could not be published'},502);d.image=u}
    await env.DB.prepare("UPDATE posts SET live=?1,pending=NULL,note='',updated=CURRENT_TIMESTAMP WHERE id=?2").bind(JSON.stringify(d),r.id).run()}
   else await env.DB.prepare('UPDATE posts SET note=?1 WHERE id=?2').bind(String(b.reason||'Please revise and resubmit.').slice(0,300),r.id).run();
   return J({ok:true})}}
 return null}
