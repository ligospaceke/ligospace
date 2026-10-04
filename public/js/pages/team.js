// js/pages/team.js: directory, person page, founder page, program pages. All data comes from api.
import { h } from '../core/dom.js';
import { Section, Link, Path } from '../components/common.js';
import { PersonCard, Avatar, Socials } from '../components/person.js';
import { api } from '../data/api.js';
import { ENV } from '../data/env.js';
import { PROGRAMS, RESTRICTED, slug, progName } from '../data/content.js';
const yt=u=>{const m=/(?:youtu\.be\/|v=)([\w-]{11})/.exec(u||'');return m?'https://www.youtube-nocookie.com/embed/'+m[1]:null};
const none=()=>h('p',{},'No one is listed here yet.');
export const PersonView=(s,founder)=>{const root=h('main');
 api.person(s).then(p=>{
  const f=h('form',{onsubmit:e=>{e.preventDefault();const d=Object.fromEntries(new FormData(f));api.intro({slug:p.slug,...d}).then(()=>f.replaceChildren(h('div',{class:'note',role:'status'},'Thank you. L.I.G.O. SPACE will pass your request on and follow up with you.'))).catch(x=>alert(x.message))}},
   h('label',{},'Your name',h('input',{name:'name',required:true})),h('label',{},'Your email',h('input',{name:'email',type:'email',required:true})),h('label',{},'What would you like to ask or discuss?',h('textarea',{name:'message',rows:3,required:true})),h('button',{class:'btn',type:'submit'},'Request an introduction'));
  const v=yt(p.video);
  root.append(Section(null,h('div',{class:'split',style:'align-items:start'},h('div',{style:'text-align:center'},Avatar(p,true)),h('div',{},h('h2',{},p.name),h('p',{style:'color:var(--mute)'},p.headline||''),
   h('div',{},(p.programs||[]).map(x=>Link('/program/'+x,progName(x),'chip'))),p.restricted?h('p',{class:'note'},'Introductions for this program are arranged by L.I.G.O. SPACE.'):Socials(p.links),
   (p.bio||'').split('\n').map(t=>h('p',{},t)),v&&h('iframe',{src:v,title:'Video',allowfullscreen:true,loading:'lazy',style:'width:100%;aspect-ratio:16/9;border:0;border-radius:12px'}))),
   founder&&h('div',{style:'margin-top:30px'},h('p',{class:'quote'},'\u201cMost people are not necessarily lost; many are simply unsynchronized.\u201d'),h('h3',{},'Our story'),Path('Vision','Community','L.I.G.O. SPACE','Human development','Synchronized Human System','Partnerships','Digital ecosystem','Future institutions')),
   h('div',{class:'card',style:'margin-top:30px;max-width:600px'},h('h3',{},'Get in touch via L.I.G.O. SPACE'),h('p',{style:'margin-bottom:12px'},'We connect people with members, who are independent providers.'),f),
   h('div',{class:'row'},Link('/team','Back to the team','btn ghost'))))},
  ()=>root.append(Section(null,h('p',{},'This profile is not available.'),Link('/team','Back to the team','btn'))));return root};
export const Founder=()=>PersonView(ENV.FOUNDER,true);
const directory=()=>{let prog='';const list=h('div',{class:'grid'}),bar=h('div',{class:'tabs'});
 const draw=()=>bar.replaceChildren(h('button',{class:'chip','aria-pressed':String(!prog),onclick:()=>{prog='';draw();load()}},'Everyone'),...PROGRAMS.map(([t])=>h('button',{class:'chip','aria-pressed':String(prog===slug(t)),onclick:()=>{prog=slug(t);draw();load()}},t)));
 const load=()=>api.team(prog).then(t=>list.replaceChildren(...(t.length?t.map(PersonCard):[none()])),()=>list.replaceChildren(none()));
 draw();load();
 return h('main',{},Section(null,h('p',{style:'font-size:1.1rem'},'The people who make L.I.G.O. SPACE happen. We connect you with them; each member is an independent provider. Click a person to learn more.'),bar,list,h('div',{class:'row'},Link('/engage/involve','Join the team','btn'))))};
export const Team=([s])=>s?PersonView(s):directory();
export const Program=([s])=>{const pr=PROGRAMS.find(p=>slug(p[0])===s);if(!pr)return h('main',{},Section(null,h('p',{},'Program not found.'),Link('/work','See all programs','btn')));
 const list=h('div',{class:'grid'});api.team(s).then(t=>list.replaceChildren(...(t.length?t.map(PersonCard):[none()])),()=>list.replaceChildren(none()));
 return h('main',{},Section(pr[0],h('p',{style:'font-size:1.1rem'},pr[1]),RESTRICTED.includes(s)&&h('div',{class:'note'},'For this program, introductions are arranged by L.I.G.O. SPACE. Members\u2019 direct contact details are not shown.'),h('h3',{},'Members offering this program'),list,
  h('div',{class:'row'},Link('/engage/involve','Offer this program','btn'),Link('/work','All programs','btn ghost'))))};
