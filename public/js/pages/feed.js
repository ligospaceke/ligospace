// js/pages/feed.js: the Stories page and the Events page, filled from posts that admins publish (and members submit for review)
import { h } from '../core/dom.js';
import { Section, Link } from '../components/common.js';
import { PostCard } from '../components/postcard.js';
import { api } from '../data/api.js';
import { INFO } from '../data/content.js';
import { today } from '../core/date.js';
export const Stories=()=>{const list=h('div',{class:'grid'});
 api.posts({type:'story'}).then(l=>list.replaceChildren(...(l.length?l.map(p=>PostCard(p)):[h('div',{class:'card empty'},h('h3',{},'Stories are coming'),h('p',{},'Real people. Real journeys. Real opportunity. The first stories will be shared here.'))])),()=>list.replaceChildren(h('p',{},'Could not load stories right now.')));
 return h('main',{},Section(null,h('p',{style:'font-size:1.1rem'},INFO.stories.intro),h('div',{class:'note'},'Every story preserves dignity and is shared only with consent.'),list,h('div',{class:'row'},Link('/account/posts','Share a story','btn'),Link('/engage/involve','Get involved','btn ghost'))))};
export const Events=()=>{const up=h('div',{class:'grid'}),past=h('div',{class:'grid'}),pastHead=h('h2',{style:'margin-top:36px'},'Past events');pastHead.hidden=true;
 api.posts({type:'event'}).then(l=>{const t=today(),coming=l.filter(e=>e.date>=t).sort((a,b)=>a.date<b.date?-1:a.date>b.date?1:0),done=l.filter(e=>e.date<t).sort((a,b)=>a.date<b.date?1:a.date>b.date?-1:0);
  up.replaceChildren(...(coming.length?coming.map(e=>PostCard(e)):[h('p',{},'No upcoming events are listed yet. Check back soon.')]));past.replaceChildren(...done.map(e=>PostCard(e,{past:true})));pastHead.hidden=!done.length},()=>up.replaceChildren(h('p',{},'Could not load events right now.')));
 return h('main',{},Section(null,h('p',{style:'font-size:1.1rem'},INFO.events.intro),
  h('div',{class:'card launch'},h('span',{class:'tag'},'Official launch'),h('h2',{},'5 December 2026'),h('p',{},'The official L.I.G.O. SPACE launch brings together community, leadership, academia, partners, young people and supporters. Details and registration will be posted here.')),
  h('h2',{},'Upcoming events'),up,pastHead,past,h('div',{class:'row'},Link('/account/posts','Post an event','btn ghost'),Link('/engage/involve','Get involved','btn'))))};
