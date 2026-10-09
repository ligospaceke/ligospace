// js/components/manifesto.js
import { h } from '../core/dom.js';
import { MANIFESTO, HOW, PROMISE } from '../data/content.js';
export const Manifesto=()=>h('div',{class:'grid'},MANIFESTO.map(([t,d])=>h('div',{class:'card'},h('h3',{},t),h('p',{},d))));
export const HowItWorks=()=>h('div',{},h('p',{class:'promise'},PROMISE),h('ol',{class:'how'},HOW.map(([t,d],i)=>h('li',{},h('b',{},String(i+1)),h('div',{},h('h4',{},t),h('p',{},d))))));
