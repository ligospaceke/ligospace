// js/pages/shs.js
import { h } from '../core/dom.js';
import { Section } from '../components/common.js';
import { SHS } from '../data/config.js';

export const SHSPage=()=>h('main',{},Section('The Synchronized Human System\u2122',h('p',{},'A developing human-development framework created through the work of L.I.G.O. SPACE. It is presented as a model open to research and critique, not as established science.'),h('div',{class:'shs'},SHS.map(([t,d])=>h('div',{class:'card'},h('h3',{},t),h('p',{},d)))),h('p',{style:'margin-top:14px'},'Coming: research, publications, learning materials, videos and downloads.')));
