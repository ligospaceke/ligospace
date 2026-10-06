// js/components/postcard.js: one post or product card (public pages, profile page, dashboard preview)
import { h } from '../core/dom.js';
import { Avatar, safe } from './person.js';
export const PostCard=(p,o={})=>{const a=p.author;
 return h('article',{class:'pcard2'},
  p.image?h('img',{class:'pimg',src:p.image,alt:'',loading:'lazy'}):h('div',{class:'pimg ph','aria-hidden':'true'},(p.title||'L')[0].toUpperCase()),
  h('div',{class:'pbody'},h('div',{class:'ptop2'},h('span',{class:'chip ptype'},p.type==='product'?'Product':'Post'),p.type==='product'&&p.price&&h('b',{class:'pprice'},p.price)),
   h('h3',{},p.title||'Your title'),h('p',{},p.body||'Your text will appear here.'),
   a&&!o.here&&h('a',{class:'pauth',href:'#/team/'+a.slug},Avatar({name:a.name,photo:a.photo}),h('span',{},a.name)),
   (safe(p.link)||(a&&!o.here))&&h('div',{class:'row',style:'margin-top:10px'},safe(p.link)&&h('a',{class:'btn sm ghost',href:p.link,target:'_blank',rel:'noopener noreferrer nofollow ugc'},'Visit link \u2197'),a&&!o.here&&h('a',{class:'btn sm',href:'#/team/'+a.slug},'Enquire'))))};
