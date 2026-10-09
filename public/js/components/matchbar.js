// js/components/matchbar.js: "Tell us what you are looking for" (home page and match page entry)
import { h } from '../core/dom.js';
import { OPP_KINDS } from '../data/content.js';
export const MatchBar=()=>{
 const k=h('select',{'aria-label':'Interest'},h('option',{value:''},'Anything'),OPP_KINDS.map(([v,t])=>h('option',{value:v},t)));
 const s=h('input',{type:'text',placeholder:'Skills, e.g. design, farming',autocomplete:'off','aria-label':'Skills'});
 const l=h('input',{type:'text',placeholder:'Where are you? e.g. Kajiado',autocomplete:'off','aria-label':'Location'});
 const go=()=>{const q=new URLSearchParams({...(k.value?{interest:k.value}:{}),...(s.value.trim()?{skills:s.value.trim()}:{}),...(l.value.trim()?{location:l.value.trim()}:{})}).toString();location.hash='#/match'+(q?'?'+q:'')};
 return h('div',{class:'findwrap'},h('div',{class:'wrap'},h('form',{class:'find mb',onsubmit:e=>{e.preventDefault();go()}},
  h('div',{},h('h4',{},'I am looking for'),k),h('div',{},h('h4',{},'My skills'),s),h('div',{},h('h4',{},'My location'),l),h('button',{class:'btn',type:'submit'},'Find my match →'))))};
