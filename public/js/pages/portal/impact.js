// js/pages/portal/impact.js: edit the public impact figures (admin only)
import { h } from '../../core/dom.js';
import { Metric } from '../../components/metric.js';
import { api } from '../../data/api.js';
export default{title:'Impact figures',sub:'Targets, achieved and verified numbers shown on the public Impact page. Verified can never exceed achieved.',render:()=>{
 const root=h('div'),note=h('p',{role:'status'});let data=null;
 const draw=()=>root.replaceChildren(note,h('div',{class:'grid'},data.map(m=>Metric(m,true,(k,v)=>{m[k]=Math.max(0,v);if(k==='achieved'&&m.verified>m.achieved)m.verified=m.achieved;note.textContent='Saving\u2026';api.saveImpact({k:m.k,target:m.target,achieved:m.achieved,verified:m.verified}).then(()=>{note.textContent='Saved.';draw()}).catch(e=>note.textContent=e.message)}))));
 api.impact().then(d=>{data=d;draw()},e=>root.replaceChildren(h('p',{class:'bad'},e.message)));return root}};
