// js/pages/admin.js: one queue for everything members send in
import { h } from '../core/dom.js';
import { Section, Link } from '../components/common.js';
import { Socials } from '../components/person.js';
import { api } from '../data/api.js';
import { progName } from '../data/content.js';
export const Admin=()=>{const root=h('main'),load=()=>api.queue().then(view,e=>root.replaceChildren(Section(null,h('p',{},e.message),Link('/account','Sign in','btn'))));
 const view=q=>{const em=h('input',{type:'email',placeholder:'approved@email.com'}),why=new Map();
  root.replaceChildren(Section(null,h('h2',{},'Admin queue'),
   h('div',{class:'card',style:'margin-bottom:20px'},h('h3',{},'Invite a member'),h('form',{style:'display:flex;gap:8px;max-width:520px',onsubmit:e=>{e.preventDefault();api.invite(em.value).then(()=>{em.value='';load()})}},em,h('button',{class:'btn',type:'submit'},'Invite'))),
   h('h3',{},'Profiles waiting for review ('+q.profiles.length+')'),
   q.profiles.length?q.profiles.map(p=>{const r=h('input',{placeholder:'Reason if requesting changes'});return h('div',{class:'card',style:'margin-bottom:12px'},h('h3',{},p.pending.name),h('p',{},p.email+' \u00B7 '+(p.pending.headline||'')),h('p',{},p.pending.bio),h('p',{},(p.pending.programs||[]).map(progName).join(', ')||'No programs chosen'),Socials(p.pending.links),
    h('div',{class:'row'},h('button',{class:'btn sm',onclick:()=>api.decide(p.slug,true).then(load)},'Approve and publish'),r,h('button',{class:'btn ghost sm',onclick:()=>api.decide(p.slug,false,r.value).then(load)},'Request changes')))}):h('p',{},'Nothing waiting.'),
   h('h3',{style:'margin-top:24px'},'Applications and introduction requests ('+q.subs.length+')'),
   q.subs.length?q.subs.map(s=>h('div',{class:'card',style:'margin-bottom:12px'},h('h3',{},s.type==='intro'?'Introduction request for '+s.payload.slug:(s.payload.group||'')+' / '+(s.payload.pathway||'')),h('p',{},Object.entries(s.payload).filter(([k])=>k!=='slug').map(([k,v])=>k+': '+v).join(' \u00B7 ')),
    h('div',{class:'row'},s.type!=='intro'&&s.payload.email&&h('button',{class:'btn sm',onclick:()=>api.invite(s.payload.email).then(()=>api.resolve(s.id)).then(load)},'Approve and invite'),h('button',{class:'btn ghost sm',onclick:()=>api.resolve(s.id).then(load)},'Mark done')))):h('p',{},'Nothing new.')))};
 load();return root};
