// js/components/metric.js
import { h } from '../core/dom.js';
import { EVIDENCE } from '../data/config.js';

/* Impact metric: Target -> Achieved -> Verified */
export const Metric=(m,admin,onChange)=>{const pct=v=>m.target?Math.min(100,v/m.target*100):0;
 const cell=(k,l)=>h('div',{},admin?h('input',{type:'number',min:0,value:m[k],'aria-label':m.l+' '+l,onchange:e=>onChange(k,+e.target.value||0)}):h('b',{},m[k]),h('small',{},l));
 return h('div',{class:'card metric'},h('h3',{},m.l),h('div',{class:'nums'},cell('target','Target'),cell('achieved','Achieved'),cell('verified','Verified')),
  h('div',{class:'bar',role:'img','aria-label':'Progress'},h('i',{style:`width:${pct(m.achieved)}%`}),h('u',{style:`width:${pct(m.verified)}%`})),
  h('details',{},h('summary',{},'Supporting evidence (0 records)'),h('p',{},'No documented activities linked yet. Each number will link to:'),h('p',{},EVIDENCE.join(' \u2192 '))))};
