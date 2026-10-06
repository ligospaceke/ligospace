// js/components/ailab.js: admin-only. Compare Workers AI models on the real chat prompt (English + Kiswahili) and switch the live model.
import { h } from '../core/dom.js';
import { api } from '../data/api.js';
export const AiLab=()=>{
 const box=h('details',{class:'card',style:'margin-bottom:20px'},h('summary',{},'AI model lab: choose the chat model')),body=h('div'),sel=new Set();let info=null,last=null,msg='';box.append(body);
 const est=(m,r)=>m.rate&&r.tin&&r.tout?(r.tin*m.rate[0]+r.tout*m.rate[1])/1e6:null;
 const draw=()=>{const cur=info.models.find(m=>m.id===info.current)||{label:info.current},out=h('div');
  if(last)last.forEach(x=>{const m=info.models.find(y=>y.id===x.id),ok=x.runs.filter(r=>r.text),ms=ok.length?Math.round(ok.reduce((a,r)=>a+r.ms,0)/ok.length):null,ns=x.runs.map(r=>est(m,r)).filter(n=>n!=null),avg=ns.length?(ns.reduce((a,n)=>a+n,0)/ns.length).toFixed(1):null;
   out.append(h('div',{class:'card',style:'margin-top:12px'},h('h3',{},m.label),h('p',{style:'margin:0 0 6px'},(ms?'Average '+ms+' ms':'No answers')+' \u00B7 '+x.runs.filter(r=>r.empty||r.error).length+' empty or failed'+(avg?' \u00B7 about '+avg+' neurons per answer ('+Math.floor(10000/avg)+' a day on the free allowance)':'')),
    h('button',{class:'btn sm',disabled:info.current===x.id||null,onclick:()=>api.setModel(x.id).then(()=>{info.current=x.id;msg='The live chat now uses '+m.label+'.';draw()}).catch(e=>{msg=e.message;draw()})},info.current===x.id?'In use':'Use this model'),
    x.runs.map(r=>h('div',{style:'margin-top:10px;font-size:.92rem'},h('b',{},r.lang.toUpperCase()+': '+r.q),h('div',{style:'color:var(--mute)'},r.error?'Error: '+r.error:(r.empty?'(empty answer)':r.text)+(r.leaked?'  [thinking text was removed]':'')+(r.ms?'  ('+r.ms+' ms)':''))))))});
  body.replaceChildren(h('p',{},'Live chat model: ',h('b',{},cur.label),'. Pick up to 3 models and run 8 test questions (4 English, 4 Kiswahili) on each. Thinking models answer slower and cost more neurons.'),
   ...info.models.map(m=>h('label',{style:'display:flex;gap:8px;align-items:start;font-weight:400;margin:6px 0'},h('input',{type:'checkbox',checked:sel.has(m.id)||null,onchange:e=>{e.target.checked?sel.add(m.id):sel.delete(m.id);if(sel.size>3){sel.delete(m.id);e.target.checked=false}}}),h('span',{},h('b',{},m.label+(m.think?' (thinking)':'')),' \u2013 '+m.note))),
   h('div',{class:'row'},h('button',{class:'btn',onclick:e=>{if(!sel.size){msg='Choose at least one model.';draw();return}e.target.disabled=true;e.target.textContent='Running, this can take 30 seconds\u2026';api.aiLab([...sel]).then(r=>{if(r.error)throw new Error(r.error);last=r.results;msg='';draw()}).catch(x=>{msg=x.message;draw()})}},'Run test')),h('p',{role:'status'},msg),out)};
 box.addEventListener('toggle',()=>{if(box.open&&!info)api.aiInfo().then(i=>{info=i;sel.add(i.current);draw()},e=>body.replaceChildren(h('p',{},e.message)))});
 return box};
