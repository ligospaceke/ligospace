// js/pages/portal/settings.js: appearance (light / dark / auto), password, sign out
import { h } from '../../core/dom.js';
import { api } from '../../data/api.js';
import { setTheme, themeChoice } from '../../core/theme.js';
const F=(l,el)=>h('label',{},l,el);
export const PwForm=done=>{const mk=ac=>h('input',{type:'password',required:true,minlength:8,maxlength:100,autocomplete:ac}),cur=mk('current-password'),n1=mk('new-password'),n2=mk('new-password'),out=h('p',{role:'status'});
 return h('form',{onsubmit:e=>{e.preventDefault();if(n1.value!==n2.value){out.textContent='The new passwords do not match.';return}api.changePassword(cur.value,n1.value).then(()=>{out.textContent='Password updated.';done()}).catch(x=>out.textContent=x.message)}},F('Current (or temporary) password',cur),F('New password (8+ characters)',n1),F('Repeat the new password',n2),h('button',{class:'btn',type:'submit'},'Save password'),out)};
export default{title:'Settings',sub:'Appearance and security.',render:({user,reload})=>{
 const seg=h('div',{class:'seg',role:'group','aria-label':'Theme'}),paint=()=>seg.replaceChildren(...[['light','Light'],['dark','Dark'],['auto','Match my device']].map(([k,t])=>h('button',{type:'button',class:'chip','aria-pressed':String(themeChoice()===k),onclick:()=>{setTheme(k);paint()}},t)));paint();
 return h('div',{class:'dash'},h('div',{},
  h('div',{class:'sect'},h('h3',{},'Appearance'),h('p',{class:'hint'},'Choose how the site looks on this device. Your choice is remembered.'),seg),
  h('div',{class:'sect'},h('h3',{},'Change password'),h('p',{class:'hint'},'Changing it signs you out on your other devices.'),PwForm(()=>{}))),
 h('aside',{class:'dside'},h('div',{class:'card'},h('h3',{style:'font-size:1rem'},'Your account'),h('p',{},user.email),h('p',{},user.role==='admin'?'Administrator':'Member'),h('button',{class:'btn ghost sm',type:'button',onclick:()=>api.logout().then(reload)},'Sign out'))))}};
