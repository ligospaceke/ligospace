// js/components/postcard.js: one post / product / story / event card. The card shows an excerpt and a "Read more" link to the full page (#/post/ID).
import { h } from '../core/dom.js';
import { Avatar, safe } from './person.js';
import { parts } from '../core/date.js';
export const KIND={post:'Post',product:'Product',story:'Story',event:'Event'};
export const PostCard=(p,o={})=>{const a=p.author,text=p.body||'',ex=!o.full&&text.length>170?text.slice(0,170).trim()+'\u2026':text,dt=p.type==='event'?parts(p.date):null,href=p.id?'#/post/'+p.id:null,who=a&&!o.here;
 return h('article',{class:'pcard2'+(o.past?' past':'')},
  h('div',{class:'pmedia'},p.image?h('img',{class:'pimg',src:p.image,alt:'',loading:'lazy'}):h('div',{class:'pimg ph','aria-hidden':'true'},(p.title||'L')[0].toUpperCase()),h('span',{class:'ptag'},KIND[p.type]||'Post'),dt&&h('div',{class:'pdate'},h('b',{},String(dt.d)),h('span',{},dt.mon))),
  h('div',{class:'pbody'},h('h3',{},href?h('a',{href},p.title):(p.title||'Your title')),
   p.type==='event'&&p.place&&h('div',{class:'pwhere'},'\u2316 '+p.place),
   p.type==='product'&&p.price&&h('div',{class:'pprice'},p.price),
   h('p',{class:o.full?'full':''},ex||'Your text will appear here.'),
   who&&h('a',{class:'pauth',href:a.slug?'#/team/'+a.slug:'#/about'},Avatar({name:a.name,photo:a.photo}),h('span',{},a.name)),
   (href||safe(p.link)||who)&&h('div',{class:'prow'},href&&h('a',{class:'more',href},'Read more \u2192'),safe(p.link)&&h('a',{class:'btn sm ghost',href:p.link,target:'_blank',rel:'noopener noreferrer nofollow ugc'},(p.type==='event'?'Register':'Visit link')+' \u2197'),who&&h('a',{class:'btn sm',href:a.slug?'#/team/'+a.slug:'#/contact'},'Enquire'))))};
