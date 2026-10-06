// js/pages/portal/creds.js: temporary passwords the admin has just created (shown once, never stored in readable form)
import { h } from '../../core/dom.js';
import { api } from '../../data/api.js';
export const creds=[];
export const gen=()=>{const a='ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';return [...crypto.getRandomValues(new Uint8Array(10))].map(x=>a[x%a.length]).join('')};
export const invite=(email,after)=>{const pw=gen();return api.invite(email,pw).then(r=>{creds.unshift({email,pw,reset:r.reset});return after&&after()})};
export const CredsNote=()=>creds.length?h('div',{class:'note'},h('h3',{},'Share these sign-in details'),creds.map(c=>h('p',{style:'margin:0 0 8px'},(c.reset?'Password reset for ':'Account ready for ')+c.email+': ',h('b',{},c.pw),' ',h('button',{class:'chip',type:'button',onclick:e=>{navigator.clipboard&&navigator.clipboard.writeText('Sign in at '+location.origin+'/#/account\nEmail: '+c.email+'\nTemporary password: '+c.pw+'\nYou will be asked to choose your own password.');e.target.textContent='Copied'}},'Copy message'))),h('p',{style:'margin:0;font-size:.9rem'},'Shown once. Send it privately, for example on WhatsApp.')):null;
