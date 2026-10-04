// js/pages/impact.js
import { h } from '../core/dom.js';
import { Section } from '../components/common.js';
import { api } from '../data/api.js';
import { INDICATORS } from '../data/config.js';
import { Metric } from '../components/metric.js';

export const Impact=()=>{let admin=false;let data=api.impact()||INDICATORS;const root=h('div');
 const draw=()=>{root.replaceChildren(h('div',{class:'note'},h('b',{},'Phase 1 Impact Baseline. '),'Figures are targets until activities are documented and verified. Achieved numbers are updated from documented activities.'),
  h('div',{class:'row',style:'margin:0 0 16px'},h('button',{class:'btn ghost sm',onclick:()=>{admin=!admin;draw()}},admin?'Done editing':'Edit targets (admin demo)')),
  h('div',{class:'grid'},data.map(m=>Metric(m,admin,(k,v)=>{m[k]=v;api.saveImpact(data)}))))};draw();
 return h('main',{},Section('Impact: target, achieved, verified',root))};
