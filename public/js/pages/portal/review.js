// js/pages/portal/review.js: everything members send in (profiles, posts, applications, introduction requests)
import { h } from '../../core/dom.js';
import { Socials, Avatar } from '../../components/person.js';
import { PostCard } from '../../components/postcard.js';
import { api } from '../../data/api.js';
import { progName } from '../../data/content.js';
import { CredsNote, invite } from './creds.js';
export default{title:'Review queue',sub:'Everything members send in waits here until you approve it.',render:()=>{
 const root=h('div');let tab='profiles',data=null;
 const load=()=>Promise.all([api.queue(),api.postQueue()]).then(([q,pq])=>{data={profiles:q.profiles,posts:pq,apps:q.subs.filter(s=>s.type!=='intro'),intros:q.subs.filter(s=>s.type==='intro')};draw()},e=>root.replaceChildren(h('p',{class:'bad'},e.message)));
 const act=p=>p.catch(x=>alert(x.message)).then(load);
 const fields=pl=>Object.entries(pl).filter(([k])=>k!=='slug').map(([k,v])=>k+': '+v).join(' \u00B7 ');
 const draw=()=>{const T=[['profiles','Profiles',data.profiles.length],['posts','Posts & products',data.posts.length],['apps','Applications',data.apps.length],['intros','Introductions',data.intros.length]];
  const none=h('p',{},'Nothing waiting.');
  const body={
   profiles:data.profiles.map(p=>{const r=h('input',{placeholder:'Reason if requesting changes'});return h('div',{class:'card rv'},h('div',{class:'row',style:'margin:0;align-items:center'},Avatar({name:p.pending.name,photo:p.pending.photo||''}),h('div',{},h('h3',{style:'margin:0'},p.pending.name),h('small',{},p.email+' \u00B7 '+(p.pending.headline||'')))),h('p',{},p.pending.bio),h('p',{},(p.pending.programs||[]).map(progName).join(', ')||'No programs chosen'),Socials(p.pending.links),
     h('div',{class:'row'},h('button',{class:'btn sm',type:'button',onclick:()=>act(api.decide(p.slug,true))},'Approve and publish'),r,h('button',{class:'btn ghost sm',type:'button',onclick:()=>act(api.decide(p.slug,false,r.value))},'Request changes')))}),
   posts:data.posts.map(p=>{const r=h('input',{placeholder:'Reason if requesting changes'});return h('div',{class:'pwrap'},PostCard(p.pending,{here:true}),h('small',{},'From '+p.email),h('div',{class:'row'},h('button',{class:'btn sm',type:'button',onclick:()=>act(api.decidePost(p.id,true))},'Approve and publish'),r,h('button',{class:'btn ghost sm',type:'button',onclick:()=>act(api.decidePost(p.id,false,r.value))},'Request changes')))}),
   apps:data.apps.map(s=>h('div',{class:'card rv'},h('h3',{},(s.payload.group||'')+' / '+(s.payload.pathway||'')),h('p',{},fields(s.payload)),h('div',{class:'row'},s.payload.email&&h('button',{class:'btn sm',type:'button',onclick:()=>act(invite(s.payload.email,()=>api.resolve(s.id)))},'Approve and create account'),h('button',{class:'btn ghost sm',type:'button',onclick:()=>act(api.resolve(s.id))},'Mark done')))),
   intros:data.intros.map(s=>h('div',{class:'card rv'},h('h3',{},'Introduction request for '+s.payload.slug),h('p',{},fields(s.payload)),h('div',{class:'row'},h('button',{class:'btn ghost sm',type:'button',onclick:()=>act(api.resolve(s.id))},'Mark done'))))}[tab];
  root.replaceChildren(CredsNote(),h('div',{class:'tabs'},T.map(([k,t,n])=>h('button',{class:'chip',type:'button','aria-pressed':String(tab===k),onclick:()=>{tab=k;draw()}},t+' ('+n+')'))),body.length?h('div',{class:tab==='posts'?'grid':'stack'},body):none)};
 load();return root}};
