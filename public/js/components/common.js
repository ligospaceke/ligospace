// js/components/common.js
import { h } from '../core/dom.js';
import { STATUS } from '../data/config.js';
import { api } from '../data/api.js';
import { CONTACT } from '../data/contact.js';
export const svg=s=>{const d=document.createElement('div');d.innerHTML=s;return d.firstChild};
export const Badge=s=>h('span',{class:'badge b-'+s},STATUS[s]);
export const Link=(href,text,cls='')=>h('a',{href:'#'+href,class:cls},text);
export const Path=(...a)=>h('div',{class:'path'},a.flatMap((x,i)=>i?[h('span',{class:'arr','aria-hidden':'true'},'\u2192'),x]:[x]));
export const Logo=()=>svg('<svg viewBox="0 0 48 48" width="42" height="42" aria-hidden="true"><circle cx="24" cy="24" r="22" fill="none" stroke="#14284b" stroke-width="3"/><circle cx="24" cy="15" r="5" fill="#c8892b"/><path d="M11 35q13-16 26 0" fill="none" stroke="#c8892b" stroke-width="4" stroke-linecap="round"/><path d="M24 4v4M8 14l3 2M40 14l-3 2" stroke="#c8892b" stroke-width="2.5" stroke-linecap="round"/></svg>');
export const NAV=[['Home','/'],['About',null,[['Who we are','/about'],['Team','/team'],['Founder','/founder'],['Synchronized Human System','/shs'],['Future Initiatives','/future']]],['Programs',null,[['Our Work','/work'],['Education','/education'],['Opportunities','/opportunities']]],['Impact','/impact'],['Partners','/partners'],['Stories & Events',null,[['Stories','/stories'],['Events','/events']]],['Get Involved','/engage/involve'],['Contact','/contact']];
export const Header=cur=>{
 const act=p=>p===cur||(p!=='/'&&p.startsWith(cur+'/'));
 const item=([t,p,sub])=>sub?h('li',{class:'dd'+(sub.some(s=>act(s[1]))?' on':'')},h('button',{class:'dd-btn','aria-haspopup':'true'},t+' \u25BE'),h('ul',{class:'menu'},sub.map(([st,sp])=>h('li',{},Link(sp,st))))):h('li',{},h('a',{href:'#'+p,'aria-current':act(p)?'page':null},t));
 const burger=h('button',{class:'burger','aria-label':'Menu','aria-expanded':'false',onclick:()=>{const o=hd.classList.toggle('open');burger.setAttribute('aria-expanded',o)}},'\u2630');
 const hd=h('header',{class:'top'},h('div',{class:'wrap'},h('a',{href:'#/',class:'brand'},Logo(),h('span',{},'L.I.G.O.',h('br'),'SPACE')),
  h('nav',{'aria-label':'Main',onclick:e=>{if(e.target.closest('a'))hd.classList.remove('open')}},h('ul',{},NAV.map(item))),Link('/engage/partner','Partner with us','btn sm'),burger));
 const f=document.createDocumentFragment();
 f.append(h('div',{class:'topbar'},h('div',{class:'wrap'},h('div',{},h('span',{},h('a',{href:'tel:'+CONTACT.tel},'\u260E '+CONTACT.phone)),h('span',{},h('a',{href:'mailto:'+CONTACT.email},'\u2709 '+CONTACT.email)),h('span',{},'\u2316 '+CONTACT.base)),h('div',{},'Launch: 5 December 2026 \u00B7 ',Link('/account',api.signedIn()?'My dashboard':'Sign in')))),hd);return f};
export const Banner=t=>h('div',{class:'banner'},h('div',{class:'wrap'},h('h1',{},t),h('p',{class:'crumbs'},Link('/','Home'),' / '+t)));
export const Head=(tag,title,cls='')=>h('div',{class:cls},h('span',{class:'tag'},tag),h('h2',{},title));
export const Footer=()=>h('footer',{},h('div',{class:'wrap'},h('div',{class:'grid'},
 h('div',{},h('h3',{},'L.I.G.O. SPACE'),h('p',{},'Humanity First. Every Life Matters.'),h('p',{},'What Crowns Us: Love.')),
 h('div',{},h('h3',{},'Explore'),[['/about','About'],['/work','Our Work'],['/shs','Synchronized Human System'],['/education','Education'],['/opportunities','Opportunities'],['/impact','Impact'],['/future','Future Initiatives']].map(([p,t])=>Link(p,t))),
 h('div',{},h('h3',{},'Engage'),[['/engage/partner','Partner with us'],['/engage/involve','Get involved'],['/partners','Partners'],['/stories','Stories'],['/events','Events'],['/contact','Contact']].map(([p,t])=>Link(p,t))),
 h('div',{},h('h3',{},'Contact'),h('a',{href:'tel:'+CONTACT.tel},CONTACT.phone),h('a',{href:'mailto:'+CONTACT.email},CONTACT.email),h('p',{},CONTACT.base),h('p',{},'TikTok \u00b7 Facebook \u00b7 Instagram \u00b7 YouTube \u00b7 LinkedIn'))),
 h('p',{style:'font-size:.85rem;max-width:none'},'Future initiatives are shown by their actual status and are not available until legally established and authorized.')));
export const Section=(title,...c)=>h('section',{},h('div',{class:'wrap'},title&&h('h2',{},title),c));
