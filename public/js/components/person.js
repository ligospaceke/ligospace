// js/components/person.js: cards, socials, quick-view popup
import { h } from '../core/dom.js';
import { Link } from './common.js';
import { progName } from '../data/content.js';
export const SOC=[['website','Website'],['linkedin','LinkedIn'],['instagram','Instagram'],['tiktok','TikTok'],['youtube','YouTube'],['x','X'],['facebook','Facebook']];
export const safe=u=>/^https?:\/\//i.test(u||'');
const ix=k=>{const i=SOC.findIndex(x=>x[0]===k);return i<0?99:i};
const lab=k=>(SOC.find(x=>x[0]===k)||[k,k.charAt(0).toUpperCase()+k.slice(1)])[1];
export const Socials=(l,max)=>{const ks=Object.keys(l||{}).filter(k=>safe(l[k])).sort((a,b)=>ix(a)-ix(b)).slice(0,max||12);return h('div',{class:'row slinks',style:'margin:10px 0'},ks.map(k=>h('a',{class:'chip',href:l[k],target:'_blank',rel:'noopener noreferrer nofollow'},lab(k)+' \u2197')))};
export const Avatar=(p,big)=>p.photo?h('img',{class:'av'+(big?' big':''),src:p.photo,alt:p.name,loading:'lazy'}):h('div',{class:'av ph0'+(big?' big':''),'aria-hidden':'true'},p.name.split(' ').map(w=>w[0]).slice(0,2).join(''));
export const openModal=p=>{
 const close=()=>{ov.remove();document.removeEventListener('keydown',esc)},esc=e=>e.key==='Escape'&&close();
 const ov=h('div',{class:'modal',onclick:e=>e.target===ov&&close()},h('div',{class:'mbox',role:'dialog','aria-modal':'true','aria-label':p.name},
  h('button',{class:'mx','aria-label':'Close',onclick:close},'\u00D7'),Avatar(p,true),h('h3',{},p.name),h('p',{style:'color:var(--mute)'},p.headline||''),h('p',{},p.summary||''),h('div',{},(p.skills||[]).map(k=>h('span',{class:'chip sk'},k))),p.location&&h('p',{},'\u2316 '+p.location),
  h('div',{},(p.programs||[]).map(s=>h('span',{class:'chip'},progName(s)))),p.restricted?h('p',{class:'note'},'Introductions for this program are arranged by L.I.G.O. SPACE.'):Socials(p.links),
  h('div',{class:'row'},h('a',{class:'btn',href:'#/'+(p.founder?'founder':'team/'+p.slug),onclick:close},'Full profile'))));
 document.addEventListener('keydown',esc);document.body.append(ov);ov.querySelector('.mx').focus()};
const card=p=>h('button',{class:'pc',onclick:()=>openModal(p)},Avatar(p),h('h3',{},p.name),h('p',{},p.headline||''),h('div',{},(p.skills||[]).slice(0,3).map(k=>h('span',{class:'chip sk'},k))),p.location&&h('small',{},'\u2316 '+p.location));
export const PersonCard=p=>{const has=!p.restricted&&Object.values(p.links||{}).some(safe);return h('div',{class:'pcwrap'},card(p),has?Socials(p.links,4):p.restricted?h('small',{class:'note'},'Introductions arranged by L.I.G.O. SPACE'):null)};
