// js/pages/info.js: one generic page for all copy-driven sections
import { h } from '../core/dom.js';
import { Section, Link, Badge } from '../components/common.js';
import { INFO } from '../data/content.js';
export const Info=key=>()=>{const d=INFO[key];return h('main',{},Section(null,h('p',{style:'font-size:1.1rem'},d.intro),
 h('div',{class:'grid'},d.groups.map(([t,items,s])=>h('div',{class:'card'},h('h3',{},t,s&&Badge(s)),h('ul',{},items.map(i=>h('li',{},i)))))),
 d.cta&&h('div',{class:'row'},Link(d.cta[0],d.cta[1],'btn'))))};
