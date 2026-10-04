// js/components/roadmap.js
import { h } from '../core/dom.js';
import { STATUS, INITIATIVES } from '../data/config.js';
export const Roadmap=()=>h('div',{class:'flow'},['operational','developing','future'].map(s=>h('div',{},h('div',{class:'chev '+s},STATUS[s]),h('ul',{},INITIATIVES.filter(i=>i.s===s).map(i=>h('li',{},i.n,i.r&&h('small',{},i.r)))))));
