// js/pages/impact.js: Target > Achieved > Verified, stored in D1. Only admins can edit.
import { h } from '../core/dom.js';
import { Section } from '../components/common.js';
import { api } from '../data/api.js';
import { Metric } from '../components/metric.js';
export const Impact=()=>{let edit=false,can=false,data=null;const root=h('div'),note=h('p',{role:'status'});
 const draw=()=>{if(!data)return;root.replaceChildren(h('div',{class:'note'},h('b',{},'Phase 1 Impact Baseline. '),'Figures are targets until activities are documented and verified. Achieved numbers are updated from documented activities.'),
  can&&h('div',{class:'row',style:'margin:0 0 16px'},h('button',{class:'btn ghost sm',onclick:()=>{edit=!edit;draw()}},edit?'Done editing':'Edit figures')),note,
  h('div',{class:'grid'},data.map(m=>Metric(m,edit,(k,v)=>{m[k]=Math.max(0,v);if(k==='achieved'&&m.verified>m.achieved)m.verified=m.achieved;note.textContent='Saving\u2026';api.saveImpact({k:m.k,target:m.target,achieved:m.achieved,verified:m.verified}).then(()=>{note.textContent='Saved.';draw()}).catch(e=>note.textContent=e.message)}))))};
 root.append(h('p',{},'Loading\u2026'));
 api.impact().then(d=>{data=d;draw()},()=>root.replaceChildren(h('p',{},'Impact figures are unavailable right now.')));
 api.me().then(x=>{can=x.user.role==='admin';draw()},()=>{});
 return h('main',{},Section('Impact: target, achieved, verified',root))};
