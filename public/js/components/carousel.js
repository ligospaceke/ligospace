// js/components/carousel.js
import { h } from '../core/dom.js';
import { Link } from './common.js';
export const Carousel=slides=>{
 let i=0,timer;const root=h('section',{class:'car','aria-roledescription':'carousel','aria-label':'Highlights'});
 const els=slides.map((s,k)=>h('div',{class:'slide s'+k+(k?'':' on'),'aria-hidden':k?'true':'false'},h('div',{class:'wrap cap'},h('span',{class:'pill'},s.tag),h('h1',{},s.a,h('span',{class:'accent'},s.b),s.c),h('p',{},s.p),h('div',{class:'row'},s.btns.map(([p,t],j)=>Link(p,t,'btn'+(j?' ghost':'')))))));
 const dots=slides.map((_,k)=>h('button',{'aria-label':'Slide '+(k+1),onclick:()=>go(k)}));
 const go=n=>{i=(n+slides.length)%slides.length;els.forEach((e,k)=>{e.classList.toggle('on',k===i);e.setAttribute('aria-hidden',k!==i)});dots.forEach((d,k)=>d.setAttribute('aria-current',k===i))};
 root.append(...els,h('button',{class:'cbtn prev','aria-label':'Previous',onclick:()=>go(i-1)},'\u2039'),h('button',{class:'cbtn next','aria-label':'Next',onclick:()=>go(i+1)},'\u203A'),h('div',{class:'dots'},dots));
 go(0);
 if(!matchMedia('(prefers-reduced-motion: reduce)').matches)timer=setInterval(()=>{if(!root.isConnected&&root.dataset.seen)clearInterval(timer);else{root.dataset.seen=root.isConnected?1:'';go(i+1)}},6500);
 return root};
