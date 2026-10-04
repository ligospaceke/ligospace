// js/data/api.js: talks to the Cloudflare Worker. Routes are defined in src/index.js.
import { disk } from '../core/dom.js';
import { ENV } from './env.js';
const call=async(m,p,b)=>{const r=await fetch(ENV.API+p,{method:m,credentials:'include',headers:b?{'content-type':'application/json'}:{},body:b?JSON.stringify(b):undefined});
 const j=await r.json().catch(()=>({}));if(!r.ok)throw new Error(j.error||'Request failed');return j};
export const api={
 saveSubmission:r=>call('POST','/submissions',r),
 impact:()=>call('GET','/impact'),saveImpact:m=>call('PUT','/admin/impact',m),
 team:g=>call('GET','/team'+(g?'?program='+encodeURIComponent(g):'')),person:s=>call('GET','/team/'+encodeURIComponent(s)),
 login:email=>call('POST','/auth/login',{email}),logout:()=>call('POST','/auth/logout',{}).finally(()=>disk.set('flag',false)),
 me:()=>call('GET','/me'),saveProfile:b=>call('PUT','/me/profile',b),setHidden:hidden=>call('PUT','/me/visibility',{hidden}),
 intro:b=>call('POST','/intro',b),chat:messages=>call('POST','/chat',{messages}),
 queue:()=>call('GET','/admin/queue'),decide:(slug,ok,reason)=>call('POST','/admin/decide',{slug,ok,reason}),invite:email=>call('POST','/admin/invite',{email}),resolve:id=>call('POST','/admin/resolve',{id}),
 flag:v=>disk.set('flag',v),signedIn:()=>!!disk.get('flag',false),
 upload:f=>fetch(ENV.API+'/media',{method:'POST',credentials:'include',headers:{'content-type':f.type},body:f}).then(r=>r.json()).then(j=>{if(!j.url)throw new Error(j.error||'Upload failed');return j.url})
};
