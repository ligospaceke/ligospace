// js/components/themetoggle.js: the sun / moon button
import { h } from '../core/dom.js';
import { currentTheme, toggleTheme, onTheme, offTheme } from '../core/theme.js';
const mk=s=>{const d=document.createElement('div');d.innerHTML=s;return d.firstChild};
const SUN='<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>';
const MOON='<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/></svg>';
export const ThemeToggle=(cls='')=>{const b=h('button',{class:'themebtn '+cls,type:'button',onclick:toggleTheme});
 const paint=()=>{const d=currentTheme()==='dark';b.replaceChildren(mk(d?SUN:MOON));b.setAttribute('aria-label',d?'Switch to light mode':'Switch to dark mode');b.title=d?'Light mode':'Dark mode'};
 const cb=()=>{if(!document.body.contains(b)){offTheme(cb);return}paint()};paint();onTheme(cb);return b};
