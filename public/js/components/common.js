// js/components/common.js
import { h } from '../core/dom.js';
import { STATUS } from '../data/config.js';
import { api } from '../data/api.js';
import { CONTACT } from '../data/contact.js';
import { ThemeToggle } from './themetoggle.js';
import { MENU, NAVMENU, KAELEN } from '../data/content.js';
export const svg=s=>{const d=document.createElement('div');d.innerHTML=s;return d.firstChild};
export const Badge=s=>h('span',{class:'badge b-'+s},STATUS[s]);
export const Link=(href,text,cls='')=>h('a',{href:'#'+href,class:cls},text);
export const Path=(...a)=>h('div',{class:'path'},a.flatMap((x,i)=>i?[h('span',{class:'arr','aria-hidden':'true'},'\u2192'),x]:[x]));
export const Logo=()=>svg('<svg viewBox="0 0 48 48" width="42" height="42" aria-hidden="true"><circle class="lg-ring" cx="24" cy="24" r="22" fill="none" stroke-width="3"/><circle cx="24" cy="15" r="5" fill="#c8892b"/><path d="M11 35q13-16 26 0" fill="none" stroke="#c8892b" stroke-width="4" stroke-linecap="round"/><path d="M24 4v4M8 14l3 2M40 14l-3 2" stroke="#c8892b" stroke-width="2.5" stroke-linecap="round"/></svg>');
export const NAV=NAVMENU.map(([t,items])=>[t,null,items]);
export const Header=(cur,portal)=>{
 const signed=api.signedIn();
 const act=p=>p===cur||(p!=='/'&&p.startsWith(cur+'/'));
 const item=([t,p,sub])=>{const li=h('li',{class:'dd'+(sub.some(s=>act(s[1]))?' on':'')}),btn=h('button',{class:'dd-btn','aria-haspopup':'true','aria-expanded':'false',onclick:()=>{const o=!li.classList.contains('open');nav.querySelectorAll('.dd.open').forEach(x=>{x.classList.remove('open');x.firstChild.setAttribute('aria-expanded','false')});li.classList.toggle('open',o);btn.setAttribute('aria-expanded',String(o))}},t,h('span',{class:'caret','aria-hidden':'true'},' \u25BE'));
  li.append(btn,h('ul',{class:'menu'},sub.map(([st,sp])=>h('li',{},Link(sp,st)))));return li};
 const burger=h('button',{class:'burger','aria-label':portal?'Dashboard menu':'Menu','aria-expanded':'false',onclick:()=>{const o=portal?document.body.classList.toggle('nav-open'):hd.classList.toggle('open');burger.setAttribute('aria-expanded',String(o));burger.textContent=o?'\u2715':'\u2630'}},'\u2630');
 const nav=h('nav',{'aria-label':'Main',onclick:e=>{if(e.target.closest('a'))hd.classList.remove('open')}},h('ul',{},NAV.map(item),h('li',{class:'mob-only'},Link('/account',signed?'My dashboard':'Sign in','btn sm'))));
 const hd=h('header',{class:'top'},h('div',{class:'wrap'},h('a',{href:'#/',class:'brand'},Logo(),h('span',{},'L.I.G.O.',h('br'),'SPACE')),nav,ThemeToggle(),Link('/account',signed?'My dashboard':'Sign in','btn sm ghost acct'),Link('/match','Find opportunities','btn sm'),burger));
 return hd};
export const Banner=t=>h('div',{class:'banner'},h('div',{class:'wrap'},h('h1',{},t),h('p',{class:'crumbs'},Link('/','Home'),' / '+t)));
export const Head=(tag,title,cls='')=>h('div',{class:cls},h('span',{class:'tag'},tag),h('h2',{},title));
export const Footer=()=>h('footer',{},h('div',{class:'wrap'},h('div',{class:'fgrid'},
 h('div',{},h('h3',{},'L.I.G.O. SPACE'),h('p',{},'Humanity First. Every Life Matters.'),h('p',{},'What Crowns Us: Love.')),
 h('div',{class:'flinks'},h('h3',{},'Explore'),[['/match','Find opportunities'],['/opportunities','Opportunities'],['/team','Talent'],['/stories','Stories'],['/events','Events'],['/impact','Impact'],['/engage/involve','Get involved'],['/engage/partner','Partner with us'],['/account','Sign in'],['/sitemap','Site map']].map(([p,t])=>Link(p,t))),
 h('div',{},h('h3',{},'Contact'),h('a',{href:'tel:'+CONTACT.tel},CONTACT.phone),h('a',{href:'mailto:'+CONTACT.email},CONTACT.email),h('p',{},CONTACT.base))),
 h('p',{class:'fine'},'Future initiatives are shown by their actual status and are not available until legally established and authorized.'),
 h('p',{class:'fine'},'\u00A9 L.I.G.O. SPACE \u00B7 Website by ',h('a',{href:KAELEN,target:'_blank',rel:'noopener'},'Kaelen Technologies \u2197'))));
export const Section=(title,...c)=>h('section',{},h('div',{class:'wrap'},title&&h('h2',{},title),c));
