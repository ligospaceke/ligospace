// js/pages/portal/members.js: create accounts, reset passwords, disable / enable
import { h } from '../../core/dom.js';
import { api } from '../../data/api.js';
import { CredsNote, invite } from './creds.js';
export default{title:'Members',sub:'Create accounts, reset passwords and manage access.',render:()=>{
 const root=h('div');let rows=null;
 const load=()=>api.members().then(r=>{rows=r;draw()},e=>root.replaceChildren(h('p',{class:'bad'},e.message)));
 const oops=x=>alert(x.message);
 const draw=()=>{const em=h('input',{type:'email',placeholder:'member@email.com',required:true});
  root.replaceChildren(CredsNote(),h('div',{class:'card',style:'margin-bottom:16px'},h('h3',{},'Create or reset a member account'),h('form',{class:'inline',onsubmit:e=>{e.preventDefault();invite(em.value).then(load).catch(oops)}},em,h('button',{class:'btn',type:'submit'},'Create'))),
   h('div',{class:'grid'},rows.map(m=>h('div',{class:'card mem'},h('h3',{style:'font-size:1rem;margin:0;word-break:break-all'},m.email),h('p',{style:'margin:4px 0'},(m.role==='admin'?'Administrator':'Member')+' \u00B7 '+m.status),h('p',{style:'margin:0'},(m.live?(m.hidden?'Profile hidden':'Profile live'):m.pending?'Profile in review':'No profile yet')+' \u00B7 '+m.posts+(m.posts===1?' post':' posts')),
    m.role!=='admin'&&h('div',{class:'row',style:'margin-top:8px'},h('button',{class:'btn sm ghost',type:'button',onclick:()=>invite(m.email).then(load).catch(oops)},'Reset password'),h('button',{class:'btn sm ghost',type:'button',onclick:()=>api.setMemberStatus(m.email,m.status==='disabled'?'active':'disabled').then(load).catch(oops)},m.status==='disabled'?'Enable':'Disable'))))))};
 load();return root}};
