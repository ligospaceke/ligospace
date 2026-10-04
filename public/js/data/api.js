// js/data/api.js: one contract, two engines. Same routes as worker/src/index.js.
import { disk } from '../core/dom.js';
import { ENV } from './env.js';
import { RESTRICTED, slug } from './content.js';
const uid=()=>Math.random().toString(36).slice(2,10);
const seed=()=>({users:[{email:'admin@ligospace.demo',role:'admin',status:'active'}],subs:[],profiles:[{slug:ENV.FOUNDER,founder:1,hidden:0,email:'',pending:null,live:{name:'Samuel M.K.',headline:'Founder & President, L.I.G.O. SPACE',bio:'Samuel founded L.I.G.O. SPACE on a simple conviction: that people should not have to face life\u2019s challenges without pathways to opportunity, dignity, connection and purpose.\nThe full founder story is coming soon.',programs:[],links:{},photo:'',video:''}}]});
const db=()=>{let d=disk.get('db',null);if(!d){d=seed();disk.set('db',d)}return d};
const clean=b=>({name:String(b.name||'').slice(0,80),headline:String(b.headline||'').slice(0,120),bio:String(b.bio||'').slice(0,1500),programs:(b.programs||[]).slice(0,6),photo:b.photo||'',video:/^https?:\/\//i.test(b.video||'')?b.video:'',links:Object.fromEntries(Object.entries(b.links||{}).filter(([,v])=>/^https?:\/\//i.test(v)))});
const strip=o=>RESTRICTED.some(r=>o.programs.includes(r))?{...o,links:{},video:'',restricted:true}:o;
const full=p=>strip({slug:p.slug,founder:p.founder,...p.live});
const sum=p=>{const o=full(p);return{...o,bio:undefined,summary:(o.bio||'').slice(0,160)}};
const RULES=[[/sacco|deposit|loan|saving/,'The L.I.G.O. SACCO is a future initiative and is not operational. It is subject to SASRA registration and authorization, and no financial products are offered.'],[/universit|accredit|academy/,'L.I.G.O. University is a long-term vision only, and the Academy is a possible future institution. Both depend on Kenyan regulatory approval.'],[/vocational|tveta|skills cent/,'The Vocational Training Center is a future initiative, subject to TVET registration and licensing.'],[/volunteer|mentor|join|involved/,'You can pick your pathway on the Get Involved page, and a short form for that pathway will open.'],[/partner|sponsor|donor|school|corporate/,'Partnering starts on the Partner with us page, where you choose the pathway that fits you.'],[/launch|5 dec|event/,'The official launch is on 5 December 2026. Event details and registration will be published on the Events page.'],[/team|member|who is|founder/,'See the Team page for the people behind L.I.G.O. SPACE. We connect you with members, who are independent providers.'],[/contact|phone|email|reach/,'Phone: +254 791 236 179. Base: Kajiado South, Kenya.']];
const bot=m=>{const q=((m||[]).filter(x=>x.role==='user').pop()||{}).content?.toLowerCase()||'';return (RULES.find(([r])=>r.test(q))||[0,'I can help with where you fit (Partner or Get involved), our programs, opportunities, the 5 December 2026 launch and our future initiatives. What would you like to know?'])[1]};
const demo=async(m,path,b)=>{
 const d=db(),save=()=>disk.set('db',d),[p0,q]=path.split('?'),P=p0.split('/').slice(1),qs=new URLSearchParams(q||'');
 const email=disk.get('sess',null),user=email&&d.users.find(u=>u.email===email),mine=()=>d.profiles.find(p=>p.email===email);
 const need=r=>{if(!user)throw new Error('Please sign in');if(r&&user.role!==r)throw new Error('Admins only')};
 const pub=p=>p.live&&!p.hidden;
 if(m==='GET'&&P[0]==='team'){const l=d.profiles.filter(pub);if(P[1]){const p=l.find(x=>x.slug===P[1]);if(!p)throw new Error('Not found');return full(p)}
  const g=qs.get('program');return l.filter(p=>!g||p.live.programs.includes(g)).sort((a,c)=>(c.founder||0)-(a.founder||0)).map(sum)}
 if(P[0]==='auth'&&P[1]==='login'){const e=String(b.email||'').trim().toLowerCase();let u=d.users.find(x=>x.email===e);
  if(!u){if(ENV.SIGNUP!=='open')throw new Error('This email has not been approved yet. Apply through Get Involved or Partner with us first.');u={email:e,role:'member',status:'pending'};d.users.push(u);save()}
  disk.set('sess',u.email);return{ok:true,demo:true}}
 if(P[0]==='auth'&&P[1]==='logout'){disk.set('sess',null);return{ok:true}}
 if(P[0]==='me'&&!P[1]){need();return{user,profile:mine()||null}}
 if(P[0]==='me'&&P[1]==='profile'){need();if(!b.consent)throw new Error('Consent is required');let p=mine();if(!p){p={slug:slug(b.name||'member')+'-'+uid().slice(0,4),email,hidden:0,live:null,pending:null};d.profiles.push(p)}p.pending=clean(b);p.note='';save();return{ok:true}}
 if(P[0]==='me'&&P[1]==='visibility'){need();const p=mine();if(p){p.hidden=b.hidden?1:0;save()}return{ok:true}}
 if(P[0]==='submissions'||P[0]==='intro'){d.subs.push({id:uid(),type:P[0]==='intro'?'intro':'application',payload:b,status:'new',at:new Date().toISOString()});save();return{ok:true}}
 if(P[0]==='admin'){need('admin');
  if(P[1]==='queue')return{profiles:d.profiles.filter(p=>p.pending).map(p=>({slug:p.slug,email:p.email,pending:p.pending})),subs:d.subs.filter(s=>s.status==='new')};
  if(P[1]==='decide'){const p=d.profiles.find(x=>x.slug===b.slug);if(!p)throw new Error('Not found');if(b.ok){p.live=p.pending;const u=d.users.find(x=>x.email===p.email);if(u)u.status='active'}else p.note=b.reason||'Please revise and resubmit.';p.pending=null;save();return{ok:true}}
  if(P[1]==='invite'){const e=String(b.email||'').trim().toLowerCase();if(!e)throw new Error('Email required');if(!d.users.some(u=>u.email===e))d.users.push({email:e,role:'member',status:'active'});save();return{ok:true}}
  if(P[1]==='resolve'){const s=d.subs.find(x=>x.id===b.id);if(s)s.status='done';save();return{ok:true}}}
 if(P[0]==='chat')return{reply:bot(b.messages)};
 throw new Error('Not found')};
const real=async(m,path,b)=>{const r=await fetch(ENV.API+path,{method:m,credentials:'include',headers:b?{'content-type':'application/json'}:{},body:b?JSON.stringify(b):undefined});const j=await r.json().catch(()=>({}));if(!r.ok)throw new Error(j.error||'Request failed');return j};
const call=(m,p,b)=>ENV.API?real(m,p,b):demo(m,p,b);
export const api={
 demo:!ENV.API,
 saveSubmission:r=>call('POST','/submissions',r),
 impact:()=>disk.get('impact',null),saveImpact:v=>disk.set('impact',v),   // moves to D1 with the evidence system
 team:g=>call('GET','/team'+(g?'?program='+encodeURIComponent(g):'')),person:s=>call('GET','/team/'+encodeURIComponent(s)),
 login:email=>call('POST','/auth/login',{email}),logout:()=>call('POST','/auth/logout',{}).finally(()=>disk.set('flag',false)),
 me:()=>call('GET','/me'),saveProfile:b=>call('PUT','/me/profile',b),setHidden:hidden=>call('PUT','/me/visibility',{hidden}),
 intro:b=>call('POST','/intro',b),chat:messages=>call('POST','/chat',{messages}),
 queue:()=>call('GET','/admin/queue'),decide:(slug,ok,reason)=>call('POST','/admin/decide',{slug,ok,reason}),invite:email=>call('POST','/admin/invite',{email}),resolve:id=>call('POST','/admin/resolve',{id}),
 flag:v=>disk.set('flag',v),signedIn:()=>!!disk.get('flag',false),
 upload:f=>ENV.API?fetch(ENV.API+'/media',{method:'POST',credentials:'include',headers:{'content-type':f.type},body:f}).then(r=>r.json()).then(j=>{if(!j.url)throw new Error(j.error||'Upload failed');return j.url}):new Promise((ok,no)=>{if(f.size>300000)return no(new Error('Demo mode: image must be under 300 KB'));const r=new FileReader();r.onload=()=>ok(r.result);r.onerror=no;r.readAsDataURL(f)})
};
