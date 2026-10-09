// js/data/api.js: talks to the Cloudflare Worker. Routes are defined in src/index.js.
import { disk } from '../core/dom.js';
import { ENV } from './env.js';
const call=async(m,p,b)=>{const r=await fetch(ENV.API+p,{method:m,credentials:'include',headers:b?{'content-type':'application/json'}:{},body:b?JSON.stringify(b):undefined});
 const j=await r.json().catch(()=>({}));if(!r.ok)throw new Error(j.error||'Request failed');return j};
export const api={
 saveSubmission:r=>call('POST','/submissions',r),
 impact:()=>call('GET','/impact'),saveImpact:m=>call('PUT','/admin/impact',m),
 team:g=>call('GET','/team'+(g?'?program='+encodeURIComponent(g):'')),person:s=>call('GET','/team/'+encodeURIComponent(s)),
 login:(email,password)=>call('POST','/auth/login',{email,password}),register:(email,password)=>call('POST','/auth/register',{email,password}),setup:(email,password,token)=>call('POST','/auth/setup',{email,password,token}),changePassword:(current,next)=>call('PUT','/me/password',{current,next}),logout:()=>call('POST','/auth/logout',{}).finally(()=>disk.set('flag',false)),
 me:()=>call('GET','/me'),saveProfile:b=>call('PUT','/me/profile',b),setHidden:hidden=>call('PUT','/me/visibility',{hidden}),
 intro:b=>call('POST','/intro',b),chat:(messages,lang)=>call('POST','/chat',{messages,lang}),
 queue:()=>call('GET','/admin/queue'),post:id=>call('GET','/posts/'+encodeURIComponent(id)),removePost:id=>call('POST','/admin/post-remove',{id}),posts:(o={})=>call('GET','/posts'+((o.type||o.member)?'?'+new URLSearchParams({...(o.type?{type:o.type}:{}),...(o.member?{member:o.member}:{})}):'')),myPosts:()=>call('GET','/me/posts'),savePost:b=>call('PUT','/me/posts',b),deletePost:id=>call('DELETE','/me/posts/'+id),postQueue:()=>call('GET','/admin/post-queue'),decidePost:(id,ok,reason)=>call('POST','/admin/post-decide',{id,ok,reason}),members:()=>call('GET','/admin/members'),setMemberStatus:(email,status)=>call('POST','/admin/member-status',{email,status}),aiInfo:()=>call('GET','/admin/ai'),aiLab:models=>call('POST','/admin/ai-lab',{models}),setModel:model=>call('PUT','/admin/ai-model',{model}),decide:(slug,ok,reason)=>call('POST','/admin/decide',{slug,ok,reason}),invite:(email,password)=>call('POST','/admin/invite',{email,password}),resolve:id=>call('POST','/admin/resolve',{id}),
 match:o=>call('GET','/match?'+new URLSearchParams(Object.fromEntries(Object.entries(o).filter(([,v])=>v)))),
 flag:v=>disk.set('flag',v),signedIn:()=>!!disk.get('flag',false),
 upload:f=>fetch(ENV.API+'/media',{method:'POST',credentials:'include',headers:{'content-type':f.type},body:f}).then(r=>r.json()).then(j=>{if(!j.url)throw new Error(j.error||'Upload failed');return j.url})
};
