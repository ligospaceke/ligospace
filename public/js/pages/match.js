// js/pages/match.js: MATCH -> PREPARE -> CONNECT. Tell us who you are; we show the nearest opportunities and people.
import { h } from '../core/dom.js';
import { Section, Link } from '../components/common.js';
import { PostCard } from '../components/postcard.js';
import { Avatar } from '../components/person.js';
import { HowItWorks } from '../components/manifesto.js';
import { api } from '../data/api.js';
import { OPP_KINDS, AVAIL, MOBILITY, PREPARE, kindName } from '../data/content.js';
const F=(l,el)=>h('label',{},l,el);
export const Match=rest=>{const q=(rest&&rest.query)||{};
 const sel=(opts,v,any)=>h('select',{},h('option',{value:''},any),opts.map(([a,b])=>h('option',{value:a,selected:a===v||null},b)));
 const kind=sel(OPP_KINDS,q.interest,'Anything'),skills=h('input',{value:q.skills||'',placeholder:'design, farming, music'}),loc=h('input',{value:q.location||'',placeholder:'Kajiado, Nairobi, remote'}),mob=sel(MOBILITY,q.mobility,'Not sure'),av=sel(AVAIL,q.availability,'Not sure');
 const out=h('div',{'aria-live':'polite'});
 const run=()=>{const o={interest:kind.value,skills:skills.value,location:loc.value,mobility:mob.value,availability:av.value};out.replaceChildren(h('p',{},'Looking…'));
  api.match(o).then(r=>{
   const opp=r.matches.length?h('div',{class:'grid'},r.matches.map(m=>h('div',{class:'pwrap'},PostCard(m),h('ul',{class:'why'},m.why.map(w=>h('li',{},w))),h('div',{class:'row',style:'margin:6px 0 0'},h('button',{class:'btn sm ghost',type:'button',onclick:()=>help(m,o)},'Help me reach this'))))):h('div',{class:'card empty'},h('h3',{},'No open opportunities yet'),h('p',{},'None are listed right now. Tell us what you need and we will look for one.'),Link('/engage/involve/opportunity','Share an opportunity','btn sm'));
   const ppl=r.people.length?h('div',{class:'grid'},r.people.map(p=>h('a',{class:'pc',href:'#/team/'+p.slug},Avatar(p),h('h3',{},p.name),h('p',{},p.headline),h('div',{},p.skills.slice(0,3).map(s=>h('span',{class:'chip'},s))),p.location&&h('small',{},'⌖ '+p.location)))):h('p',{},'No members match yet. The team grows every week.');
   const prep=PREPARE[kind.value];
   out.replaceChildren(h('h2',{},'Your closest opportunities'),opp,prep&&h('div',{class:'card'},h('h3',{},'Prepare: '+kindName(kind.value)),h('ul',{class:'chk'},prep.map(t=>h('li',{},t)))),h('h2',{style:'margin-top:30px'},'People who can help'),ppl,h('p',{class:'note'},'Members are independent providers. L.I.G.O. SPACE connects you and does not guarantee outcomes.'))},
  e=>out.replaceChildren(h('p',{class:'bad'},e.message)))};
 const help=(m,o)=>{const nm=prompt('Your name'),ct=nm&&prompt('Your email or phone, so we can reach you');if(!nm||!ct)return;
  api.saveSubmission({group:'match',pathway:'Help me reach: '+m.title,name:nm,contact:ct,opportunity:m.id,interest:o.interest,skills:o.skills,location:o.location,mobility:o.mobility,availability:o.availability}).then(()=>alert('Thank you. The L.I.G.O. SPACE team will contact you.')).catch(e=>alert(e.message))};
 const f=h('form',{class:'card mform',onsubmit:e=>{e.preventDefault();run()}},h('h3',{},'Tell us about you'),h('div',{class:'lgrid'},F('Interest',kind),F('Skills (comma separated)',skills),F('Location',loc),F('Mobility',mob),F('Availability',av)),h('button',{class:'btn',type:'submit'},'Show my matches'));
 if(Object.keys(q).length)setTimeout(run,0);
 return h('main',{},Section(null,h('p',{class:'promise'},'Tell us where you are and what you want. We will show what is close, what you need, and who can help.'),f,out),Section('How it works',HowItWorks()))};
