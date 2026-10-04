// js/pages/opportunities.js
import { h } from '../core/dom.js';
import { Section, Link } from '../components/common.js';
import { OPP_TYPES } from '../data/config.js';

export const Opps=()=>{let f=null;const list=h('div');const draw=()=>{list.replaceChildren(h('div',{class:'tabs'},OPP_TYPES.map(t=>h('button',{class:'chip','aria-pressed':String(f===t),onclick:()=>{f=f===t?null:t;draw()}},t))),h('div',{class:'card'},h('h3',{},f?f+' opportunities':'No opportunities listed yet'),h('p',{},'Opportunities will appear here once verified. Have one to share?'),h('div',{class:'row'},Link('/engage/involve/opportunity','Submit an opportunity','btn'))))};draw();
 return h('main',{},Section('Opportunities',h('p',{},'Discover, create and access opportunities. L.I.G.O. SPACE is a platform for opportunity, not only a request for support.'),list))};
