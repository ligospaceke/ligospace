// js/components/shell.js: dashboard layout. Sidebar on the left for desktop, tab bar at the bottom for phones (CSS decides).
import { h } from '../core/dom.js';
import { Link } from './common.js';
import { Avatar } from './person.js';
import { icon } from './icons.js';
import { ThemeToggle } from './themetoggle.js';
import { api } from '../data/api.js';
export const Shell=({user,groups,active,title,sub,badges,reload},content)=>{
 const closeNav=()=>{document.body.classList.remove('nav-open');const b=document.querySelector('.burger');if(b){b.setAttribute('aria-expanded','false');b.textContent='\u2630'}};
 const item=([key,path,label,ic])=>h('a',{class:'nl',href:'#'+path,'aria-current':active===key?'page':null},icon(ic),h('span',{},label),(badges&&badges[key]>0)&&h('em',{class:'bd'},String(badges[key])));
 const nm=(user.name||user.email.split('@')[0]);
 return h('div',{class:'portal-wrap'},
  h('div',{class:'navscrim',onclick:closeNav}),
  h('nav',{class:'side','aria-label':'Dashboard',onclick:e=>{if(e.target.closest('a'))closeNav()},onkeydown:e=>{if(e.key==='Escape')closeNav()}},
   h('div',{class:'me'},Avatar({name:nm,photo:user.photo||''}),h('div',{},h('b',{},nm),h('small',{},user.role==='admin'?'Administrator':'Member'))),
   ...groups.flatMap(g=>[h('div',{class:'gl'},g.label),...g.items.map(item)]),
   h('div',{class:'sidefoot'},h('a',{class:'nl',href:'#/'},icon('globe'),h('span',{},'Back to the website')),ThemeToggle(),h('button',{class:'nl',type:'button',onclick:()=>api.logout().then(reload)},icon('out'),h('span',{},'Sign out')))),
  h('main',{class:'pmain'},h('div',{class:'ptop'},h('div',{},h('h1',{},title),sub&&h('p',{class:'psub'},sub))),content))};
