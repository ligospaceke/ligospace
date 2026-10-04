// js/pages/account.js: sign in + member dashboard
import { h } from '../core/dom.js';
import { Section, Link, Badge } from '../components/common.js';
import { SOC } from '../components/person.js';
import { api } from '../data/api.js';
import { ENV } from '../data/env.js';
import { PROGRAMS, RESTRICTED, slug } from '../data/content.js';
const F=(l,el)=>h('label',{},l,el);
export const Account=()=>{const root=h('main'),show=(...c)=>root.replaceChildren(Section(null,c));
 const login=msg=>{const em=h('input',{type:'email',required:true,autocomplete:'email'}),out=h('p',{role:'status'},msg||'');
  show(h('h2',{},'Sign in'),h('p',{},ENV.SIGNUP==='open'?'Enter your email to sign in or create an account. New accounts wait for admin approval.':'Accounts are by invitation. Use the email you applied with once the L.I.G.O. SPACE team has approved you.'),
   h('form',{onsubmit:e=>{e.preventDefault();out.textContent='Sending\u2026';api.login(em.value).then(()=>out.textContent='If this email is approved, a sign-in link is on its way. Check your inbox and spam folder.').catch(x=>out.textContent=x.message)}},F('Email',em),h('button',{class:'btn',type:'submit'},'Continue')),out,
   h('p',{style:'margin-top:18px'},'Not a member yet? ',Link('/engage/involve','Choose how you would like to get involved')));};
 const dash=({user,profile})=>{const cur=profile?(profile.pending||profile.live):null,v=cur||{programs:[],links:{}};let photo=v.photo||'';
  const name=h('input',{name:'name',required:true,maxlength:80,value:v.name||''}),head=h('input',{maxlength:120,value:v.headline||''}),bio=h('textarea',{rows:6,maxlength:1500},v.bio||''),video=h('input',{type:'url',placeholder:'https://youtube.com/...',value:v.video||''}),
   progs=PROGRAMS.map(([t])=>{const s=slug(t);return h('label',{style:'font-weight:400;display:flex;gap:8px;align-items:start'},h('input',{type:'checkbox',value:s,checked:v.programs.includes(s)||null}),t+(RESTRICTED.includes(s)?' (introductions go through L.I.G.O. SPACE)':''))}),
   links=SOC.map(([k,t])=>[k,F(t+' link',h('input',{type:'url',placeholder:'https://',value:v.links[k]||''}))]),
   file=h('input',{type:'file',accept:'image/png,image/jpeg,image/webp',onchange:()=>file.files[0]&&api.upload(file.files[0]).then(u=>{photo=u;msg.textContent='Photo ready. Save for review to submit it.'}).catch(x=>msg.textContent=x.message)}),
   consent=h('input',{type:'checkbox',required:true}),msg=h('p',{role:'status'});
  const st=profile?(profile.pending?'Waiting for admin review':profile.live?(profile.hidden?'Live but hidden':'Live on the Team page'):'Draft'):'Not submitted yet';
  show(h('h2',{},'My dashboard'),h('p',{},user.email+' \u00B7 Status: ',h('b',{},st)),profile&&profile.note&&h('div',{class:'note'},'Changes requested: '+profile.note),
   user.role==='admin'&&h('p',{},Link('/admin','Open the admin queue','btn sm')),
   profile&&profile.live&&h('p',{},h('button',{class:'btn ghost sm',onclick:()=>api.setHidden(!profile.hidden).then(init)},profile.hidden?'Show my profile publicly':'Hide my profile now'),' Hiding takes effect immediately. Showing changes still need approval.'),
   h('form',{onsubmit:e=>{e.preventDefault();api.saveProfile({name:name.value,headline:head.value,bio:bio.value,video:video.value,photo,programs:progs.map(l=>l.firstChild).filter(i=>i.checked).map(i=>i.value),links:Object.fromEntries(links.map(([k,l])=>[k,l.lastChild.value])),consent:consent.checked}).then(()=>{msg.textContent='Submitted. The admin will review it before it appears publicly.';init()}).catch(x=>msg.textContent=x.message)}},
    F('Full name',name),F('Headline (for example: Mentor in digital skills)',head),F('Short bio',bio),F('Photo (PNG, JPG or WebP, max 2 MB)',file),F('Video link (YouTube, optional)',video),h('fieldset',{},h('legend',{},'Programs I offer'),progs),h('fieldset',{},h('legend',{},'My links'),links.map(l=>l[1])),
    h('label',{style:'font-weight:400;display:flex;gap:8px;align-items:start'},consent,'I agree to show my profile publicly once approved, and I understand L.I.G.O. SPACE routes introductions to me.'),
    h('button',{class:'btn',type:'submit'},'Save for review')),msg,
   h('p',{style:'margin-top:18px'},h('button',{class:'btn ghost sm',onclick:()=>api.logout().then(init)},'Sign out')))};
 const init=()=>api.me().then(x=>{api.flag(true);dash(x)},()=>{api.flag(false);login()});init();return root};
