// js/pages/portal/journey.js: the "you are here" path from profile to impact
import { h } from '../../core/dom.js';
import { Link } from '../../components/common.js';
import { api } from '../../data/api.js';
import { progName, kindName, PREPARE } from '../../data/content.js';
const STEPS=['Profile','Pathway','Nearest opportunity','What stands in the way','What we can build','Who can help','Next action','Progress','Impact'];
export const Journey=({v,kind,pct,live})=>{
 const skills=v.skills||[],pathway=(v.programs||[]).map(progName)[0]||(skills[0]?'Talent: '+skills[0]:'Not chosen yet');
 const blockers=[];if(!v.name)blockers.push(['Your profile is not created','Create it so people can see you','/account/profile']);
 else{if(!v.photo)blockers.push(['No photo','Add a clear photo so people trust and remember you','/account/profile']);if(!skills.length)blockers.push(['No skills listed','List up to 8 skills so we can match you','/account/profile']);if(!v.location)blockers.push(['No location','Tell us where you are so we can find what is close','/account/profile']);if(!v.availability)blockers.push(['No availability','Say when you can take part','/account/profile']);if(!live)blockers.push(['Profile not live yet','It becomes public once the team verifies it',null])}
 const opp=h('div',{class:'jbody'},'Looking…'),who=h('div',{class:'jbody'},'Looking…'),own=h('div',{class:'jbody'});
 let next=blockers.length?['Fix: '+blockers[0][0],blockers[0][2]]:['Open your nearest opportunity','/opportunities'];
 api.match({skills:skills.join(','),location:v.location||'',availability:v.availability||''}).then(r=>{const m=r.matches[0];
  opp.replaceChildren(...(m?[h('b',{},m.title),h('p',{},[m.kind&&kindName(m.kind),m.place].filter(Boolean).join(' · ')),h('ul',{class:'why'},m.why.map(w=>h('li',{},w))),m.kind&&PREPARE[m.kind]&&h('p',{class:'hint'},'Prepare: '+PREPARE[m.kind][0]),Link('/post/'+m.id,'Open it','btn sm')]:[h('p',{},'No open opportunity yet. We will add one that fits you.'),Link('/match','Search by hand','btn sm ghost')]));
  if(m&&!blockers.length)next=['Apply to: '+m.title,'/post/'+m.id];nextEl.replaceChildren(h('b',{},next[0]),next[1]&&Link(next[1],'Go','btn sm'));
  const ppl=r.people.filter(p=>p.slug!==undefined).slice(0,3);who.replaceChildren(...(ppl.length?ppl.map(p=>h('a',{class:'chip',href:'#/team/'+p.slug},p.name)):[h('p',{},'We will introduce you to a mentor or member when there is a fit.')]))},
  ()=>{opp.replaceChildren(h('p',{},'Could not look for opportunities right now.'));who.replaceChildren(h('p',{},'Try again later.'))});
 api.myPosts().then(d=>{const n=d.posts.filter(p=>p.live).length;own.replaceChildren(h('p',{},n+' public post(s), '+d.posts.filter(p=>p.pending).length+' in review.'),h('p',{class:'hint'},'Your outcomes are recorded by L.I.G.O. SPACE and counted on the Impact page once verified.'),Link('/impact','See the impact baseline','btn sm ghost'))},()=>{});
 const nextEl=h('div',{class:'jbody'},h('b',{},next[0]),next[1]&&Link(next[1],'Go','btn sm'));
 const cell=(i,body,here)=>h('li',{class:'jstep'+(here?' here':'')},h('i',{},String(i+1)),h('div',{},h('h4',{},STEPS[i]+(here?'  ← you are here':'')),body));
 const here=!v.name?0:blockers.length?3:6;
 return h('section',{class:'journey','aria-label':'Your journey'},h('h2',{},'Your journey'),h('p',{class:'promise'},'We don’t just connect you to opportunities. We help make them reachable.'),
  h('ol',{class:'jlist'},
   cell(0,h('div',{class:'jbody'},h('p',{},v.name?(v.headline||'Profile saved'):'Not created yet'),h('p',{class:'hint'},pct+'% complete')),here===0),
   cell(1,h('div',{class:'jbody'},h('p',{},pathway)),false),
   cell(2,opp,false),
   cell(3,h('div',{class:'jbody'},blockers.length?h('ul',{class:'chk'},blockers.map(([t,d,l])=>h('li',{},h('b',{},t),' — '+d+' ',l&&Link(l,'Fix','chip')))):h('p',{},'Nothing in the way right now.')),here===3),
   cell(4,h('div',{class:'jbody'},h('p',{},'Ask us for help with the real gaps: a mentor, transport, data or tools.'),Link('/match','Request help','btn sm ghost')),false),
   cell(5,who,false),cell(6,nextEl,here===6),
   cell(7,h('div',{class:'jbody'},h('div',{class:'bar'},h('i',{style:'width:'+pct+'%'}))),false),cell(8,own,false)))};
