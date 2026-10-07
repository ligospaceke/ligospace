// js/pages/home.js
import { h } from '../core/dom.js';
import { Section, Link, Head } from '../components/common.js';
import { PostCard } from '../components/postcard.js';
import { today } from '../core/date.js';
import { Carousel } from '../components/carousel.js';
import { FindBar } from '../components/findbar.js';
import { Roadmap } from '../components/roadmap.js';
import { HexDiagram } from '../components/diagrams.js';
import { api } from '../data/api.js';
import { INDICATORS, SHS } from '../data/config.js';
import { slug, SLIDES, PROGRAMS, SERVE, PARTNER_WITH, GEO } from '../data/content.js';
const acti=([t,d],i)=>h('a',{class:'acti g'+(i%8+1),href:'#/program/'+slug(t)},h('div',{class:'cap2'},h('h3',{},t),h('p',{},d)),h('span',{class:'go','aria-hidden':'true'},'\u2192'));
const bar=m=>{const p=v=>m.target?Math.min(100,v/m.target*100):0;return h('div',{},h('div',{class:'bt'},m.l,h('span',{},m.target?m.achieved+' / '+m.target:'Target to be set')),h('div',{class:'bar'},h('i',{style:'width:'+p(m.achieved)+'%'}),h('u',{style:'width:'+p(m.verified)+'%'})))};
const chips=a=>a.map(([t,p])=>h('a',{class:'chip',href:'#'+p},t));
export const Home=()=>{const impactBox=h('div');const launch=h('div',{class:'card'},h('h3',{},'Official launch: 5 December 2026'),h('p',{},'Community, leadership, academia, partners and young people. Details and registration will be posted on the Events page.'),h('div',{class:'row'},Link('/events','Event details','btn sm')));
 const evBox=h('div',{class:'grid',style:'margin-top:20px'},launch,h('div',{class:'photo'},'Stories coming soon'));
 api.posts({type:'event,story'}).then(l=>{const t=today(),ev=l.filter(p=>p.type==='event'&&p.date>=t).sort((a,b)=>a.date<b.date?-1:a.date>b.date?1:0).slice(0,2),st=l.filter(p=>p.type==='story').slice(0,2),cards=[...ev,...st].map(p=>PostCard(p));if(cards.length)evBox.replaceChildren(launch,...cards)},()=>{});api.impact().then(d=>impactBox.replaceChildren(...['reached','youth','partners'].map(k=>d.find(m=>m.k===k)).filter(Boolean).map(bar)),()=>{});
 return h('main',{},Carousel(SLIDES),FindBar(),
 h('section',{},h('div',{class:'wrap'},Head('What we do','Programs that connect people with opportunity'),h('div',{class:'grid',style:'margin-top:20px'},PROGRAMS.map(acti)))),
 h('section',{class:'alt'},h('div',{class:'wrap split'},
  h('div',{class:'collage'},h('div',{class:'ph a'}),h('div',{class:'ph b'}),h('div',{class:'float'},h('div',{},h('b',{},'5 Dec'),'2026 launch'))),
  h('div',{},Head('About L.I.G.O. SPACE','Restoring pathways from potential to opportunity'),h('p',{},'People often have potential without enough access to structure, knowledge, support or pathways. We bring together people, communities, educators, professionals, institutions and technology to restore them.'),
   [['\u2665','Dignity','Every life carries value, potential and purpose.'],['\u2726','Opportunity','Potential needs access, pathways and practical opportunity.'],['\u2691','Community','People become stronger when they build together.']].map(([i,t,d])=>h('div',{class:'fr'},h('div',{class:'ic','aria-hidden':'true'},i),h('div',{},h('h4',{},t),h('p',{},d)))),
   h('div',{class:'row'},Link('/about','Learn more','btn'),Link('/team','Meet the team','btn ghost'))))),
 h('section',{class:'dark'},h('div',{class:'wrap'},h('div',{class:'cols3'},
  h('div',{class:'lst'},SHS.map(([t])=>Link('/shs',t))),
  h('div',{},Head('Measuring what we build','Impact you can verify'),h('p',{style:'color:#cdd6e3'},'Figures are targets until activities are documented and verified. We never invent numbers.'),impactBox,h('div',{class:'row'},Link('/impact','Open the impact dashboard','btn'))),
  h('div',{style:'display:grid;place-items:center'},HexDiagram())),
  h('div',{class:'band2'},h('h3',{},'Ready to build together?'),h('div',{class:'row',style:'margin:0'},Link('/engage/partner','Partner with us','btn'),Link('/engage/involve','Get involved','btn ghost'))))),
 h('section',{},h('div',{class:'wrap'},Head('Ecosystem roadmap','What exists, what is being built, what is still a vision'),h('div',{style:'margin-top:20px'},Roadmap()),h('div',{class:'row'},Link('/future','See every initiative','btn')))),
 h('section',{class:'alt'},h('div',{class:'wrap'},Head('Who it is for','Who we serve and who we work with'),
  h('div',{class:'grid',style:'margin-top:20px'},h('div',{class:'card'},h('h3',{},'We serve'),chips(SERVE)),h('div',{class:'card'},h('h3',{},'We partner with'),chips(PARTNER_WITH))))),
 h('section',{class:'cta'},h('div',{class:'wrap split'},h('div',{},Head('Partner with us','We cannot build alone'),h('p',{},'Bring your expertise, technology, network, resources, knowledge and experience.'),h('div',{class:'row'},Link('/engage/partner','Choose your pathway','btn'))),
  h('div',{class:'grid',style:'grid-template-columns:1fr 1fr'},PARTNER_WITH.slice(0,4).map(([t,p],i)=>h('a',{class:'pcard g'+(i+1),href:'#'+p},h('div',{class:'cap2'},h('h3',{},t))))))),
 h('section',{},h('div',{class:'wrap'},Head('Our reach','From Kajiado South to Kenya, Africa and the world'),h('div',{class:'g3x',style:'margin-top:20px'},GEO.map(([s,t],i)=>h('div',{class:'geo g'+[1,2,4,3][i]},h('div',{class:'cap2'},h('small',{},s),h('h3',{},t))))))),
 h('section',{class:'alt'},h('div',{class:'wrap'},Head('Events & stories','Latest from the L.I.G.O. community'),evBox,h('div',{class:'row'},Link('/events','All events','btn ghost'),Link('/stories','All stories','btn ghost')))));};
