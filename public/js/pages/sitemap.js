// js/pages/sitemap.js: every page in one place, grouped by the five categories
import { h } from '../core/dom.js';
import { Section, Link } from '../components/common.js';
import { MENU } from '../data/content.js';
export const Sitemap=()=>h('main',{},Section(null,h('p',{},'Everything on the site, in the five places you will look for it.'),h('div',{class:'grid'},MENU.map(([c,items])=>h('div',{class:'card'},h('h3',{},c),h('div',{class:'stack'},items.map(([t,p])=>Link(p,t))))))));
