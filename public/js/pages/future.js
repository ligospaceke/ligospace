// js/pages/future.js
import { h } from '../core/dom.js';
import { Section } from '../components/common.js';
import { Roadmap } from '../components/roadmap.js';

export const Future=()=>h('main',{},Section('Future initiatives',h('p',{},'We show our full ambition without claiming what does not yet exist. Every item carries its true status.'),Roadmap()));
