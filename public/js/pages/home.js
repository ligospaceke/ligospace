// js/pages/home.js
import { h } from '../core/dom.js';
import { Section, Link, Head } from '../components/common.js';
import { PostCard } from '../components/postcard.js';
import { today } from '../core/date.js';
import { Carousel } from '../components/carousel.js';
import { MatchBar } from '../components/matchbar.js';
import { HowItWorks } from '../components/manifesto.js';
import { PersonCard } from '../components/person.js';
import { api } from '../data/api.js';
import { INDICATORS, SHS } from '../data/config.js';
import { slug, SLIDES, PROGRAMS, SERVE, PARTNER_WITH, GEO } from '../data/content.js';
const acti=([t,d],i)=>h('a',{class:'acti g'+(i%8+1),href:'#/program/'+slug(t)},h('div',{class:'cap2'},h('h3',{},t),h('p',{},d)),h('span',{class:'go','aria-hidden':'true'},'\u2192'));
const bar=m=>{const p=v=>m.target?Math.min(100,v/m.target*100):0;return h('div',{},h('div',{class:'bt'},m.l,h('span',{},m.target?m.achieved+' / '+m.target:'Target to be set')),h('div',{class:'bar'},h('i',{style:'width:'+p(m.achieved)+'%'}),h('u',{style:'width:'+p(m.verified)+'%'})))};
const chips=a=>a.map(([t,p])=>h('a',{class:'chip',href:'#'+p},t));
export const Home=()=>{const impactBox=h('div'),oppBox=h('div',{class:'grid',style:'margin-top:20px'},h('div',{class:'card empty'},h('h3',{},'Opportunities are coming'),h('p',{},'Verified jobs, training, scholarships and more will appear here.'))),talBox=h('div',{class:'grid',style:'margin-top:20px'},h('div',{class:'card empty'},h('h3',{},'Talent is being added'),h('p',{},'Members appear here once the team has verified their profiles.')));
 api.posts({type:'opportunity'}).then(l=>{const t=today(),o=l.filter(x=>!x.date||x.date>=t).slice(0,3);if(o.length)oppBox.replaceChildren(...o.map(x=>PostCard(x)))},()=>{});api.team().then(l=>{if(l.length)talBox.replaceChildren(...l.slice(0,6).map(PersonCard))},()=>{});const launch=h('div',{class:'card'},h('h3',{},'Official launch: 5 December 2026'),h('p',{},'Community, leadership, academia, partners and young people. Details and registration will be posted on the Events page.'),h('div',{class:'row'},Link('/events','Event details','btn sm')));
 const evBox=h('div',{class:'grid',style:'margin-top:20px'},launch,h('div',{class:'photo'},'Stories coming soon'));
 api.posts({type:'event,story'}).then(l=>{const t=today(),ev=l.filter(p=>p.type==='event'&&p.date>=t).sort((a,b)=>a.date<b.date?-1:a.date>b.date?1:0).slice(0,2),st=l.filter(p=>p.type==='story').slice(0,2),cards=[...ev,...st].map(p=>PostCard(p));if(cards.length)evBox.replaceChildren(launch,...cards)},()=>{});api.impact().then(d=>impactBox.replaceChildren(...['reached','youth','partners'].map(k=>d.find(m=>m.k===k)).filter(Boolean).map(bar)),()=>{});
 return h('main',{},Carousel(SLIDES),MatchBar(),
 h('section',{},h('div',{class:'wrap'},Head('How it works','Make talent seen. Make opportunity reachable.'),h('div',{style:'margin-top:20px'},HowItWorks()))),
 h('section',{class:'alt'},h('div',{class:'wrap'},Head('Talent & Opportunities','Open now'),h('h3',{style:'margin-top:20px'},'Opportunities'),oppBox,h('div',{class:'row'},Link('/opportunities','All opportunities','btn'),Link('/match','Match me','btn ghost')),h('h3',{style:'margin-top:28px'},'Talent'),talBox,h('div',{class:'row'},Link('/team','Meet all talent','btn'),Link('/engage/involve','Join as talent','btn ghost')))),
 h('section',{},h('div',{class:'wrap'},Head('What we do','Programs that connect people with opportunity'),h('div',{class:'grid',style:'margin-top:20px'},PROGRAMS.map(acti)))),
 h('section',{class:'alt'},h('div',{class:'wrap split'},
  h('div',{class:'collage'},h('div',{class:'ph a'}),h('div',{class:'ph b'}),h('div',{class:'float'},h('div',{},h('b',{},'5 Dec'),'2026 launch'))),
  h('div',{},Head('About L.I.G.O. SPACE','Restoring pathways from potential to opportunity'),h('p',{},'People often have potential without enough access to structure, knowledge, support or pathways. We bring together people, communities, educators, professionals, institutions and technology to restore them.'),
   h('div',{class:'row'},Link('/about','Learn more','btn'),Link('/shs','Our framework','btn ghost'))))),
 h('section',{class:'dark'},h('div',{class:'wrap'},Head('Measuring what we build','Impact you can verify'),h('p',{style:'color:#cdd6e3'},'Figures are targets until activities are documented and verified. We never invent numbers.'),impactBox,
  h('div',{class:'band2'},h('h3',{},'Ready to build together?'),h('div',{class:'row',style:'margin:0'},Link('/engage/partner','Partner with us','btn'),Link('/engage/involve','Get involved','btn ghost'),Link('/impact','Impact dashboard','btn ghost'))))),
 h('section',{},h('div',{class:'wrap'},Head('Events & stories','Latest from the L.I.G.O. community'),evBox,h('div',{class:'row'},Link('/events','All events','btn ghost'),Link('/stories','All stories','btn ghost')))));};
