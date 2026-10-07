// js/pages/showcase.js: public page with posts and products shared by members (all reviewed first)
import { h } from '../core/dom.js';
import { Section, Link } from '../components/common.js';
import { PostCard } from '../components/postcard.js';
import { api } from '../data/api.js';
export const Showcase=()=>{let type='';const list=h('div',{class:'grid'}),bar=h('div',{class:'tabs'});
 const draw=()=>bar.replaceChildren(...[['','Everything'],['post','Posts'],['product','Products']].map(([k,t])=>h('button',{class:'chip',type:'button','aria-pressed':String(type===k),onclick:()=>{type=k;draw();load()}},t)));
 const load=()=>api.posts({type:type||'post,product'}).then(l=>list.replaceChildren(...(l.length?l.map(p=>PostCard(p)):[h('p',{},'Nothing has been shared here yet.')])),()=>list.replaceChildren(h('p',{},'Could not load the showcase right now.')));
 draw();load();
 return h('main',{},Section(null,h('p',{style:'font-size:1.1rem'},'Posts and products shared by L.I.G.O. SPACE members. Members are independent providers: L.I.G.O. SPACE introduces you but does not sell or guarantee their work.'),bar,list,h('div',{class:'row'},Link('/engage/involve','Share your own','btn'))))};
