// js/pages/account.js: sign in + member dashboard
import { h } from '../core/dom.js';
import { Section, Link, Badge } from '../components/common.js';
import { SOC } from '../components/person.js';
import { api } from '../data/api.js';
import { Dashboard } from './dashboard.js';
import { ENV } from '../data/env.js';
import { PROGRAMS, RESTRICTED, slug } from '../data/content.js';
const F=(l,el)=>h('label',{},l,el);
export const Account=()=>{const root=h('main'),show=(...c)=>root.replaceChildren(Section(null,c));
 const pwForm=done=>{const mk=(a,ac)=>h('input',{type:'password',required:true,minlength:8,maxlength:100,autocomplete:ac}),cur=mk(0,'current-password'),n1=mk(0,'new-password'),n2=mk(0,'new-password'),out=h('p',{role:'status'});
  return h('form',{onsubmit:e=>{e.preventDefault();if(n1.value!==n2.value){out.textContent='The new passwords do not match.';return}api.changePassword(cur.value,n1.value).then(()=>{out.textContent='Password updated.';done()}).catch(x=>out.textContent=x.message)}},F('Current (or temporary) password',cur),F('New password (8+ characters)',n1),F('Repeat the new password',n2),h('button',{class:'btn',type:'submit'},'Save password'),out)};
 const login=()=>{const em=h('input',{type:'email',required:true,autocomplete:'username'}),pw=h('input',{type:'password',required:true,minlength:8,maxlength:100,autocomplete:'current-password'}),out=h('p',{role:'status'}),
   eye=h('button',{type:'button',class:'chip',style:'margin:0',onclick:()=>{pw.type=pw.type==='password'?'text':'password';eye.textContent=pw.type==='password'?'Show':'Hide'}},'Show'),
   open=ENV.SIGNUP==='open',mode={reg:false},go=h('button',{class:'btn',type:'submit'},'Sign in');
  const sem=h('input',{type:'email',required:true}),spw=h('input',{type:'password',required:true,minlength:8,maxlength:100,autocomplete:'new-password'}),stk=h('input',{type:'password',required:true,autocomplete:'off'}),sout=h('p',{role:'status'});
  show(h('h2',{},'Sign in'),h('p',{},open?'Sign in, or create an account. New accounts wait for admin approval.':'Accounts are created by the L.I.G.O. SPACE team. Use the email and temporary password you were given.'),
   h('form',{onsubmit:e=>{e.preventDefault();out.textContent=mode.reg?'Creating account\u2026':'Signing in\u2026';(mode.reg?api.register(em.value,pw.value).then(()=>api.login(em.value,pw.value)):api.login(em.value,pw.value)).then(init).catch(x=>out.textContent=x.message)}},F('Email',em),F('Password',h('div',{style:'display:flex;gap:8px'},pw,eye)),go,
    open&&h('button',{type:'button',class:'btn ghost sm',onclick:e=>{mode.reg=!mode.reg;go.textContent=mode.reg?'Create account':'Sign in';e.target.textContent=mode.reg?'I already have an account':'Create an account'}},'Create an account')),out,
   h('details',{style:'margin-top:22px;max-width:560px'},h('summary',{},'First-time setup (administrator)'),h('p',{style:'margin:8px 0'},'Sets the first password for an existing account, using the setup token from your Cloudflare secrets.'),
    h('form',{onsubmit:e=>{e.preventDefault();api.setup(sem.value,spw.value,stk.value).then(()=>{sout.textContent='Password set. You can sign in now.'}).catch(x=>sout.textContent=x.message)}},F('Account email',sem),F('New password (8+ characters)',spw),F('Setup token',stk),h('button',{class:'btn ghost',type:'submit'},'Set password'),sout)),
   h('p',{style:'margin-top:18px'},'Not a member yet? ',Link('/engage/involve','Choose how you would like to get involved')));};
 const dash=x=>{if(x.user.mustChange)return show(h('h2',{},'Choose your own password'),h('p',{},'Your account was created with a temporary password. Set a new one to continue.'),pwForm(init));show(Dashboard(x,init,pwForm))};
 const init=()=>api.me().then(x=>{api.flag(true);dash(x)},()=>{api.flag(false);login()});init();return root};
