// js/pages/about.js
import { h } from '../core/dom.js';
import { Section } from '../components/common.js';

export const About=()=>h('main',{},Section('About L.I.G.O. SPACE',h('p',{},'People often have potential without enough access to structure, opportunity, knowledge, support or pathways. L.I.G.O. SPACE helps restore those pathways.'),h('div',{class:'grid'},[['Vision','A world where every person can live with dignity, discover their potential, develop their capabilities and contribute meaningfully to society.'],['Mission','To restore opportunity, dignity and purposeful pathways by connecting people with knowledge, relationships, resources, technology, education and practical opportunities.']].map(([t,d])=>h('div',{class:'card'},h('h3',{},t),h('p',{},d))))),
 Section('Our values',h('div',{class:'grid'},['Humanity First','Every Life Matters','Love','Dignity','Opportunity','Integrity','Community','Purpose','Stewardship'].map(v=>h('div',{class:'card'},h('h3',{},v))))));
