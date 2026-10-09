// js/pages/team.js: directory, person page, founder page, program pages. All data comes from api.
import { h } from '../core/dom.js';
import { Section, Link, Path } from '../components/common.js';
import { PersonCard, Avatar, Socials, safe } from '../components/person.js';
import { PostCard } from '../components/postcard.js';
import { api } from '../data/api.js';
import { ENV } from '../data/env.js';
import { PROGRAMS, RESTRICTED, NOTICES, AVAIL, slug, progName } from '../data/content.js';
const yt=u=>{const m=/(?:youtu\.be\/|v=)([\w-]{11})/.exec(u||'');return m?'https://www.youtube-nocookie.com/embed/'+m[1]:null};
const none=()=>h('p',{},'No one is listed here yet.');
export const PersonView=(s,founder)=>{const root=h('main');
 api.person(s).then(p=>{
  const f=h('form',{onsubmit:e=>{e.preventDefault();const d=Object.fromEntries(new FormData(f));api.intro({slug:p.slug,...d}).then(()=>f.replaceChildren(h('div',{class:'note',role:'status'},'Thank you. L.I.G.O. SPACE will pass your request on and follow up with you.'))).catch(x=>alert(x.message))}},
   h('label',{},'Your name',h('input',{name:'name',required:true})),h('label',{},'Your email',h('input',{name:'email',type:'email',required:true})),h('label',{},'What would you like to ask or discuss?',h('textarea',{name:'message',rows:3,required:true})),h('button',{class:'btn',type:'submit'},'Request an introduction'));
  const v=yt(p.video),pb=h('div');api.posts({member:p.slug}).then(l=>{if(l.length)pb.replaceChildren(h('h2',{style:'margin-top:30px'},'Posts & products'),h('div',{class:'grid'},l.map(x=>PostCard(x,{here:true}))))},()=>{});
  root.append(Section(null,h('div',{class:'split',style:'align-items:start'},h('div',{style:'text-align:center'},Avatar(p,true)),h('div',{},h('h2',{},p.name),h('p',{style:'color:var(--mute)'},p.headline||''),
   h('div',{},(p.programs||[]).map(x=>Link('/program/'+x,progName(x),'chip'))),h('div',{},(p.skills||[]).map(k=>h('span',{class:'chip sk'},k))),(p.location||p.availability)&&h('p',{},[p.location&&'\u2316 '+p.location,p.availability&&'Available: '+((AVAIL.find(a=>a[0]===p.availability)||[])[1]||'')].filter(Boolean).join(' \u00B7 ')),p.restricted?h('p',{class:'note'},'Introductions for this program are arranged by L.I.G.O. SPACE.'):h('div',{},Object.values(p.links||{}).some(safe)&&h('h4',{style:'margin:14px 0 0'},'Find '+(p.name||'them').split(' ')[0]+' online'),Socials(p.links)),
   p.founder&&p.phone&&h('p',{},'\u260E ',h('a',{href:'tel:'+p.phone.replace(/\s/g,'')},p.phone)),(p.bio||'').split('\n').map(t=>h('p',{},t)),v&&h('iframe',{src:v,title:'Video',allowfullscreen:true,loading:'lazy',style:'width:100%;aspect-ratio:16/9;border:0;border-radius:12px'}))),
   founder&&h('div',{style:'margin-top:30px'},h('p',{class:'quote'},'\u201cMost people are not necessarily lost; many are simply unsynchronized.\u201d'),h('h3',{},'Our story'),Path('Vision','Community','L.I.G.O. SPACE','Human development','Synchronized Human System','Partnerships','Digital ecosystem','Future institutions')),
   pb,h('div',{class:'card',style:'margin-top:30px;max-width:600px'},h('h3',{},'Get in touch via L.I.G.O. SPACE'),h('p',{style:'margin-bottom:12px'},'We connect people with members, who are independent providers.'),f),
   h('div',{class:'row'},Link('/team','Back to the team','btn ghost'))))},
  ()=>root.append(Section(null,h('p',{},'This profile is not available.'),Link('/team','Back to the team','btn'))));return root};
export const Founder=()=>PersonView(ENV.FOUNDER,true);
const directory=()=>{let prog='',all=[];const search=h('input',{type:'search',placeholder:'Search by name, skill or place','aria-label':'Search talent',oninput:()=>show()});const list=h('div',{class:'grid'}),bar=h('div',{class:'tabs'});
 const draw=()=>bar.replaceChildren(h('button',{class:'chip','aria-pressed':String(!prog),onclick:()=>{prog='';draw();load()}},'Everyone'),...PROGRAMS.map(([t])=>h('button',{class:'chip','aria-pressed':String(prog===slug(t)),onclick:()=>{prog=slug(t);draw();load()}},t)));
 const show=()=>{const q=search.value.trim().toLowerCase(),t=all.filter(p=>!q||[p.name,p.headline,p.location,(p.skills||[]).join(' ')].join(' ').toLowerCase().includes(q));list.replaceChildren(...(t.length?t.map(PersonCard):[none()]))};
 const load=()=>api.team(prog).then(t=>{all=t;show()},()=>list.replaceChildren(none()));
 draw();load();
 return h('main',{},Section(null,h('p',{style:'font-size:1.1rem'},'Talent in the L.I.G.O. community. We connect you with them; each member is an independent provider. Open a card for the brief view, then the full page.'),search,bar,list,h('div',{class:'row'},Link('/match','Find opportunities','btn ghost'),Link('/engage/involve','Join the team','btn'))))};
export const Team=([s])=>s?PersonView(s):directory();
export const Program=([s])=>{const pr=PROGRAMS.find(p=>slug(p[0])===s);if(!pr)return h('main',{},Section(null,h('p',{},'Program not found.'),Link('/work','See all programs','btn')));
 const list=h('div',{class:'grid'});api.team(s).then(t=>list.replaceChildren(...(t.length?t.map(PersonCard):[none()])),()=>list.replaceChildren(none()));
 return h('main',{},Section(pr[0],h('p',{style:'font-size:1.1rem'},pr[1]),RESTRICTED.includes(s)&&h('div',{class:'note'},'For this program, introductions are arranged by L.I.G.O. SPACE. Members\u2019 direct contact details are not shown.'),NOTICES[s]&&h('div',{class:'note'},NOTICES[s]),h('h3',{},'Members offering this program'),list,
  h('div',{class:'row'},Link('/engage/involve','Offer this program','btn'),Link('/work','All programs','btn ghost'))))};
