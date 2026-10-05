// js/pages/admin.js: one queue for everything members send in
import { h } from '../core/dom.js';
import { Section, Link } from '../components/common.js';
import { Socials } from '../components/person.js';
import { api } from '../data/api.js';
import { progName } from '../data/content.js';
const gen=()=>{const a='ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';return [...crypto.getRandomValues(new Uint8Array(10))].map(x=>a[x%a.length]).join('')};
export const Admin=()=>{const root=h('main'),creds=[];
 const load=()=>api.queue().then(view,e=>root.replaceChildren(Section(null,h('p',{},e.message),Link('/account','Sign in','btn'))));
 const invite=(email,after)=>{const pw=gen();return api.invite(email,pw).then(r=>{creds.unshift({email,pw,reset:r.reset});return after&&after()}).then(load).catch(x=>alert(x.message))};
 const view=q=>{const em=h('input',{type:'email',placeholder:'member@email.com',required:true});
  root.replaceChildren(Section(null,h('h2',{},'Admin queue'),
   creds.length>0&&h('div',{class:'note'},h('h3',{},'Share these sign-in details'),creds.map(c=>h('p',{style:'margin:0 0 8px'},(c.reset?'Password reset for ':'Account ready for ')+c.email+': ',h('b',{},c.pw),' ',h('button',{class:'chip',onclick:e=>{navigator.clipboard&&navigator.clipboard.writeText('Sign in at '+location.origin+'/#/account\nEmail: '+c.email+'\nTemporary password: '+c.pw+'\nYou will be asked to choose your own password.');e.target.textContent='Copied'}},'Copy message'))),h('p',{style:'margin:0;font-size:.9rem'},'Shown once and not stored in readable form. Send it privately, for example on WhatsApp.')),
   h('div',{class:'card',style:'margin-bottom:20px'},h('h3',{},'Create or reset a member account'),h('form',{style:'display:flex;gap:8px;max-width:520px',onsubmit:e=>{e.preventDefault();invite(em.value).then(()=>{em.value=''})}},em,h('button',{class:'btn',type:'submit'},'Create'))),
   h('h3',{},'Profiles waiting for review ('+q.profiles.length+')'),
   q.profiles.length?q.profiles.map(p=>{const r=h('input',{placeholder:'Reason if requesting changes'});return h('div',{class:'card',style:'margin-bottom:12px'},h('h3',{},p.pending.name),h('p',{},p.email+' \u00B7 '+(p.pending.headline||'')),h('p',{},p.pending.bio),h('p',{},(p.pending.programs||[]).map(progName).join(', ')||'No programs chosen'),Socials(p.pending.links),
    h('div',{class:'row'},h('button',{class:'btn sm',onclick:()=>api.decide(p.slug,true).then(load).catch(x=>alert(x.message))},'Approve and publish'),r,h('button',{class:'btn ghost sm',onclick:()=>api.decide(p.slug,false,r.value).then(load)},'Request changes')))}):h('p',{},'Nothing waiting.'),
   h('h3',{style:'margin-top:24px'},'Applications and introduction requests ('+q.subs.length+')'),
   q.subs.length?q.subs.map(s=>h('div',{class:'card',style:'margin-bottom:12px'},h('h3',{},s.type==='intro'?'Introduction request for '+s.payload.slug:(s.payload.group||'')+' / '+(s.payload.pathway||'')),h('p',{},Object.entries(s.payload).filter(([k])=>k!=='slug').map(([k,v])=>k+': '+v).join(' \u00B7 ')),
    h('div',{class:'row'},s.type!=='intro'&&s.payload.email&&h('button',{class:'btn sm',onclick:()=>invite(s.payload.email,()=>api.resolve(s.id))},'Approve and create account'),h('button',{class:'btn ghost sm',onclick:()=>api.resolve(s.id).then(load)},'Mark done')))):h('p',{},'Nothing new.')))};
 load();return root};
