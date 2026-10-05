// js/pages/info.js: one generic page for all copy-driven sections
import { h } from '../core/dom.js';
import { Section, Link, Badge } from '../components/common.js';
import { INFO } from '../data/content.js';
import { CONTACT } from '../data/contact.js';
const RX=new RegExp('('+CONTACT.email.replace(/\./g,'\\.')+')|('+CONTACT.phone+')');
const lk=t=>{const m=RX.exec(t);if(!m)return t;return [t.slice(0,m.index),m[1]?h('a',{href:'mailto:'+m[1]},m[1]):h('a',{href:'tel:'+CONTACT.tel},m[2]),t.slice(m.index+m[0].length)]};
export const Info=key=>()=>{const d=INFO[key];return h('main',{},Section(null,h('p',{style:'font-size:1.1rem'},d.intro),
 h('div',{class:'grid'},d.groups.map(([t,items,s])=>h('div',{class:'card'},h('h3',{},t,s&&Badge(s)),h('ul',{},items.map(i=>h('li',{},lk(i))))))),
 d.cta&&h('div',{class:'row'},Link(d.cta[0],d.cta[1],'btn'))))};
