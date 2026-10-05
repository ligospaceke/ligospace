// js/components/findbar.js: the smart funnel entry, shown over the hero
import { h } from '../core/dom.js';
import { PATHWAYS } from '../data/config.js';
export const FindBar=()=>{
 const g=h('select',{id:'fg','aria-label':'I would like to'},Object.entries(PATHWAYS).map(([k,v])=>h('option',{value:k},v.label)));
 const p=h('select',{id:'fp','aria-label':'Where do you fit'});
 const fill=()=>p.replaceChildren(...PATHWAYS[g.value].items.map(([id,l])=>h('option',{value:id},l)));
 g.addEventListener('change',fill);fill();
 return h('div',{class:'findwrap'},h('div',{class:'wrap'},h('div',{class:'find'},
  h('div',{},h('h4',{},'I would like to'),g),h('div',{},h('h4',{},'Where do I fit?'),p),
  h('button',{class:'btn',onclick:()=>{location.hash='#/engage/'+g.value+'/'+p.value}},'Continue \u2192'))))};
