// js/components/chat.js: floating assistant (English + Kiswahili). The Worker answers from curated FAQs first, then free Workers AI.
import { h } from '../core/dom.js';
import { api } from '../data/api.js';
import { ENV } from '../data/env.js';
import { svg } from './common.js';
const ICON='<svg viewBox="0 0 48 48" width="34" height="34" aria-hidden="true"><path d="M8 5h32a4 4 0 0 1 4 4v22a4 4 0 0 1-4 4H28l-8 8v-8H8a4 4 0 0 1-4-4V9a4 4 0 0 1 4-4z" fill="#fff"/><path d="M24 10v3M14 14l2 2M34 14l-2 2" stroke="#c8892b" stroke-width="2.4" stroke-linecap="round"/><circle cx="24" cy="21" r="5" fill="#c8892b"/><path d="M13 30q11-11 22 0" fill="none" stroke="#14284b" stroke-width="3.2" stroke-linecap="round"/></svg>';
const AVATAR='<svg viewBox="0 0 48 48" width="36" height="36" aria-hidden="true"><circle cx="24" cy="24" r="23" fill="#fbf5ea"/><path d="M24 6v3M10 14l3 2M38 14l-3 2" stroke="#c8892b" stroke-width="2.5" stroke-linecap="round"/><circle cx="24" cy="18" r="5" fill="#c8892b"/><path d="M11 37q13-17 26 0" fill="none" stroke="#14284b" stroke-width="4" stroke-linecap="round"/></svg>';
const SUG={en:['How can I join?','Is the SACCO open?','When is the launch?'],sw:['Ninawezaje kujiunga?','Je, SACCO imefunguliwa?','Uzinduzi ni lini?']};
const seen=()=>{try{return sessionStorage.getItem('ligo:tease')}catch(e){return '1'}},mark=()=>{try{sessionStorage.setItem('ligo:tease','1')}catch(e){}};
export const mountChat=()=>{if(!ENV.CHAT||document.getElementById('chat'))return;
 let lang='';const msgs=[],log=h('div',{class:'clog','aria-live':'polite'}),inp=h('input',{type:'text',placeholder:'Ask / Uliza\u2026','aria-label':'Your message',maxlength:'400'});
 const add=(r,t)=>{const e=h('div',{class:'cm '+r},t);log.append(e);log.scrollTop=log.scrollHeight;return e};
 const send=async t=>{t=t.trim();if(!t)return;inp.value='';add('u',t);msgs.push({role:'user',content:t});try{const r=await api.chat(msgs.slice(-8),lang||undefined);msgs.push({role:'assistant',content:r.reply});const b=add('a',r.reply);if(r.link)b.append(h('a',{class:'chip',href:'#'+r.link.path,onclick:toggle},r.link.label))}catch(e){add('a','Sorry, I could not answer just now. Samahani, siwezi kujibu sasa hivi. \u260E 0182809790')}};
 const hideT=()=>{teaser.hidden=true;mark()};
 const toggle=()=>{hideT();panel.hidden=!panel.hidden;fab.setAttribute('aria-expanded',String(!panel.hidden));if(!panel.hidden)inp.focus()};
 const sug=h('div',{class:'csug'}),drawSug=()=>sug.replaceChildren(...SUG[lang||'en'].map(t=>h('button',{class:'chip',onclick:()=>send(t)},t)));
 const pills=['en','sw'].map(l=>h('button',{class:'lang','aria-pressed':'false',onclick:()=>{lang=lang===l?'':l;pills.forEach((p,i)=>p.setAttribute('aria-pressed',String(lang===['en','sw'][i])));drawSug()}},l.toUpperCase()));
 const panel=h('div',{class:'cpanel',role:'dialog','aria-label':'L.I.G.O. assistant',onkeydown:e=>e.key==='Escape'&&toggle()},
  h('div',{class:'chead'},svg(AVATAR),h('div',{class:'ht'},h('b',{},'Ask L.I.G.O. / Uliza'),h('small',{},'AI assistant \u00B7 English & Kiswahili')),...pills,h('button',{'aria-label':'Close chat',onclick:toggle},'\u00D7')),log,sug,
  h('form',{class:'cform',onsubmit:e=>{e.preventDefault();send(inp.value)}},inp,h('button',{class:'btn sm',type:'submit'},'Send')),
  h('p',{class:'cnote'},'AI assistant, it can be wrong. Do not share sensitive personal information. / Usishiriki taarifa nyeti binafsi.'));
 panel.hidden=true;drawSug();
 const teaser=h('div',{class:'cteaser',onclick:e=>{if(!e.target.closest('.tx'))toggle()}},h('button',{class:'tx','aria-label':'Dismiss',onclick:hideT},'\u00D7'),h('b',{},'Hi! Habari! \uD83D\uDC4B'),' Ask me anything / Niulize chochote.');
 teaser.hidden=true;
 const fab=h('button',{class:'cfab','aria-expanded':'false','aria-label':'Ask the L.I.G.O. assistant',title:'Ask L.I.G.O.',onclick:toggle},svg(ICON),h('i',{class:'on','aria-hidden':'true'}));
 document.body.append(h('div',{id:'chat'},panel,teaser,fab));add('a','Hello! Habari! Ask me about L.I.G.O. SPACE in English or Kiswahili. Niulize kuhusu L.I.G.O. SPACE kwa Kiingereza au Kiswahili.');
 setTimeout(()=>{if(panel.hidden&&!seen())teaser.hidden=false},5000)};
