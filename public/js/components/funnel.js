// js/components/funnel.js
import { h } from '../core/dom.js';
import { api } from '../data/api.js';
import { base, TA, NEXT } from '../data/config.js';
import { Link } from './common.js';

/* Smart funnel */
export const FunnelForm=(group,item)=>{const [id,label,blurb,extra]=item;const fields=[...base,...extra];const box=h('div');
 const form=h('form',{onsubmit:async ev=>{ev.preventDefault();const d=Object.fromEntries(new FormData(form));const btn=form.querySelector('button');btn.disabled=true;try{await api.saveSubmission({group,pathway:id,...d})}catch(e){btn.disabled=false;alert(e.message||'Could not send. Please try again.');return}box.replaceChildren(h('div',{class:'note',role:'status'},h('h3',{},'Thank you, '+d.name+'.'),h('p',{},'We have received your '+label+' request. Our team will review it and contact you at '+d.email+' about the next step.')),Link('/engage/'+group,'Choose another pathway','btn ghost'))}},
  fields.map(([n,l,t])=>h('label',{},l,Array.isArray(t)?h('select',{name:n,required:true},t.map(o=>h('option',{},o))):t===TA?h('textarea',{name:n,rows:3}):h('input',{name:n,type:t,required:n==='name'||n==='email'}))),
  h('button',{class:'btn',type:'submit'},'Send '+label+' request'));
 box.append(h('h2',{},label),h('p',{},blurb),h('h3',{},'What happens after you submit'),h('ol',{class:'steps'},NEXT.map(s=>h('li',{},s))),form);return box};
