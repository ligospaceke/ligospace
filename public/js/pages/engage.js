// js/pages/engage.js
import { h } from '../core/dom.js';
import { Section } from '../components/common.js';
import { PATHWAYS } from '../data/config.js';
import { FunnelForm } from '../components/funnel.js';

export const Engage=([group,id])=>{const g=PATHWAYS[group]||PATHWAYS.partner;const gk=PATHWAYS[group]?group:'partner';const item=g.items.find(i=>i[0]===id);
 return h('main',{},Section(item?null:'Find where you fit',
  h('div',{class:'tabs'},Object.entries(PATHWAYS).map(([k,v])=>h('a',{class:'chip',href:'#/engage/'+k,'aria-pressed':String(k===gk)},v.label))),
  item?FunnelForm(gk,item):h('div',{class:'grid'},g.items.map(([i,l,b])=>h('a',{class:'card pick',href:`#/engage/${gk}/${i}`,style:'text-decoration:none'},h('h3',{},l),h('p',{},b))))))};
