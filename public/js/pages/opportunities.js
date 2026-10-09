// js/pages/opportunities.js: open opportunities, posted by admins and verified members
import { h } from '../core/dom.js';
import { Section, Link } from '../components/common.js';
import { PostCard } from '../components/postcard.js';
import { api } from '../data/api.js';
import { OPP_KINDS } from '../data/content.js';
import { today } from '../core/date.js';
export const Opps=()=>{let f='',all=[];const bar=h('div',{class:'tabs'}),list=h('div',{class:'grid'});
 const draw=()=>{bar.replaceChildren(h('button',{class:'chip',type:'button','aria-pressed':String(!f),onclick:()=>{f='';draw()}},'All'),...OPP_KINDS.map(([k,t])=>h('button',{class:'chip',type:'button','aria-pressed':String(f===k),onclick:()=>{f=f===k?'':k;draw()}},t)));
  const t=today(),l=all.filter(o=>(!f||o.kind===f)&&(!o.date||o.date>=t));list.replaceChildren(...(l.length?l.map(o=>PostCard(o)):[h('div',{class:'card empty'},h('h3',{},f?'No open '+f+' opportunities yet':'No open opportunities yet'),h('p',{},'Have one to share? We review it and publish it here.'))]))};
 api.posts({type:'opportunity'}).then(l=>{all=l;draw()},()=>{list.replaceChildren(h('p',{},'Could not load opportunities right now.'))});draw();
 return h('main',{},Section(null,h('p',{style:'font-size:1.1rem'},'Discover, create and access opportunities. L.I.G.O. SPACE is a platform for opportunity, not only a request for support.'),h('div',{class:'row',style:'margin-top:0'},Link('/match','Match me to one','btn'),Link('/engage/involve/opportunity','Share an opportunity','btn ghost')),bar,list))};
