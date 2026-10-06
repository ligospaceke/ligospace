// js/pages/portal.js: one entry for /account and /admin. Signed out: sign-in. Signed in: dashboard shell (sidebar on desktop, tab bar on phones).
import { h } from '../core/dom.js';
import { Link } from '../components/common.js';
import { Shell } from '../components/shell.js';
import { api } from '../data/api.js';
import { Login } from './portal/login.js';
import settings, { PwForm } from './portal/settings.js';
import overview from './portal/overview.js';
import profile from './portal/profile.js';
import posts from './portal/posts.js';
import review from './portal/review.js';
import members from './portal/members.js';
import impact from './portal/impact.js';
import ai from './portal/ai.js';
const SECTIONS={account:{overview,profile,posts,settings},admin:{review,members,impact,ai}};
const ME=[['account/overview','/account','Overview','home'],['account/profile','/account/profile','My profile','user'],['account/posts','/account/posts','Posts','post'],['account/settings','/account/settings','Settings','sliders']];
const AD=[['admin/review','/admin/review','Review','review'],['admin/members','/admin/members','Members','users'],['admin/impact','/admin/impact','Impact','chart'],['admin/ai','/admin/ai','AI lab','spark']];
const card=(...c)=>h('div',{class:'authwrap'},h('div',{class:'card authcard'},c));
export const Portal=area=>rest=>{const root=h('div',{class:'portal-root'}),sec=rest[0]||(area==='admin'?'review':'overview');
 const boot=()=>api.me().then(x=>{api.flag(true);show(x)},()=>{api.flag(false);root.replaceChildren(Login(boot))});
 const show=async x=>{
  if(x.user.mustChange){root.replaceChildren(card(h('h2',{},'Choose your own password'),h('p',{},'Your account was created with a temporary password. Set a new one to continue.'),PwForm(boot)));return}
  const admin=x.user.role==='admin';
  if(area==='admin'&&!admin){root.replaceChildren(card(h('h2',{},'Admins only'),h('p',{},'This area is for the L.I.G.O. SPACE team.'),Link('/account','Go to my dashboard','btn')));return}
  const mod=SECTIONS[area][sec];if(!mod){location.hash='#/'+area;return}
  let n=0;if(admin){try{const [q,pq]=await Promise.all([api.queue(),api.postQueue()]);n=q.profiles.length+q.subs.length+pq.length}catch(e){}}
  const pf=(x.profile&&(x.profile.pending||x.profile.live))||{},user={...x.user,name:pf.name||'',photo:pf.photo||''},body=h('div',{},h('p',{},'Loading\u2026'));
  root.replaceChildren(Shell({user,groups:[...(admin?[{label:'Admin',items:AD}]:[]),{label:'My account',items:ME}],active:area+'/'+sec,title:mod.title,sub:mod.sub,badges:{'admin/review':n},reload:boot},body));
  Promise.resolve(mod.render({user,profile:x.profile,reload:boot,area,badges:{review:n}})).then(c=>body.replaceChildren(c),e=>body.replaceChildren(h('p',{class:'bad'},e.message)))};
 boot();return root};
