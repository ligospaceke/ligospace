// js/components/person.js: cards, socials, quick-view popup
import { h } from '../core/dom.js';
import { Link } from './common.js';
import { progName } from '../data/content.js';
export const SOC=[['website','Website'],['linkedin','LinkedIn'],['instagram','Instagram'],['tiktok','TikTok'],['youtube','YouTube'],['x','X'],['facebook','Facebook']];
export const safe=u=>/^https?:\/\//i.test(u||'');
export const Socials=l=>h('div',{class:'row',style:'margin:10px 0'},SOC.filter(([k])=>safe((l||{})[k])).map(([k,t])=>h('a',{class:'chip',href:l[k],target:'_blank',rel:'noopener noreferrer'},t+' \u2197')));
export const Avatar=(p,big)=>p.photo?h('img',{class:'av'+(big?' big':''),src:p.photo,alt:p.name,loading:'lazy'}):h('div',{class:'av ph0'+(big?' big':''),'aria-hidden':'true'},p.name.split(' ').map(w=>w[0]).slice(0,2).join(''));
export const openModal=p=>{
 const close=()=>{ov.remove();document.removeEventListener('keydown',esc)},esc=e=>e.key==='Escape'&&close();
 const ov=h('div',{class:'modal',onclick:e=>e.target===ov&&close()},h('div',{class:'mbox',role:'dialog','aria-modal':'true','aria-label':p.name},
  h('button',{class:'mx','aria-label':'Close',onclick:close},'\u00D7'),Avatar(p,true),h('h3',{},p.name),h('p',{style:'color:var(--mute)'},p.headline||''),h('p',{},p.summary||''),
  h('div',{},(p.programs||[]).map(s=>h('span',{class:'chip'},progName(s)))),p.restricted?h('p',{class:'note'},'Introductions for this program are arranged by L.I.G.O. SPACE.'):Socials(p.links),
  h('div',{class:'row'},h('a',{class:'btn',href:'#/'+(p.founder?'founder':'team/'+p.slug),onclick:close},'Full profile'))));
 document.addEventListener('keydown',esc);document.body.append(ov);ov.querySelector('.mx').focus()};
export const PersonCard=p=>h('button',{class:'pc',onclick:()=>openModal(p)},Avatar(p),h('h3',{},p.name),h('p',{},p.headline||''));
