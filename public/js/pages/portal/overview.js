// js/pages/portal/overview.js: where I stand, what to do next
import { h } from '../../core/dom.js';
import { Link } from '../../components/common.js';
import { Avatar } from '../../components/person.js';
import { api } from '../../data/api.js';
import { completeness, Ring } from './profile.js';
const ST={new:['Not submitted','s-new','Fill in your profile and submit it. We review every profile before it appears on the Team page.'],review:['In review','s-review','Your profile is with the L.I.G.O. SPACE team and will appear on the Team page once approved. You can keep editing; saving again replaces the version in review.'],changes:['Changes requested','s-changes',''],live:['Live','s-live','Your profile is live on the Team page. Edits you submit are reviewed before they replace the live version.'],hidden:['Hidden','s-hidden','Your profile is hidden. Nobody can see it until you show it again.']};
export default{title:'Overview',sub:'',render:({user,profile,reload,badges})=>{
 const kind=!profile?'new':profile.note?'changes':profile.pending?'review':profile.live?(profile.hidden?'hidden':'live'):'new',S=ST[kind],idx={new:0,changes:0,review:1,live:2,hidden:2}[kind];
 const v=profile?(profile.pending||profile.live)||{}:{},c=completeness(v),first=((v.name)||user.email.split('@')[0]).split(' ')[0],ring=Ring();ring.querySelector('.rfg').setAttribute('stroke-dasharray',c.pct+' 100');
 const postsBox=h('div',{class:'card'},h('h3',{style:'font-size:1rem'},'Posts & products'),h('p',{},'Loading\u2026'));
 api.myPosts().then(d=>{const live=d.posts.filter(p=>p.live&&!p.pending).length,rev=d.posts.filter(p=>p.pending).length;postsBox.replaceChildren(h('h3',{style:'font-size:1rem'},'Posts & products'),h('p',{},d.posts.length?live+' live, '+rev+' in review ('+d.posts.length+' of '+d.limit+' used)':'Share something about yourself or what you offer.'),Link('/account/posts','Manage posts','btn sm'))},()=>postsBox.replaceChildren(h('h3',{style:'font-size:1rem'},'Posts & products'),h('p',{},'Could not load your posts.')));
 return h('div',{},
  h('div',{class:'dbhead'},Avatar({name:v.name||user.email,photo:v.photo||''},true),
   h('div',{class:'dbwho'},h('h2',{},'Welcome, '+first),h('p',{},user.email),h('span',{class:'spill '+S[1]},S[0]),h('ol',{class:'dsteps'},['Create','In review','Live'].map((t,i)=>h('li',{class:i<idx?'done':i===idx?'on':''},t))),h('p',{style:'margin:0;font-size:.92rem'},kind==='changes'?'Changes requested: '+profile.note:S[2])),
   h('div',{class:'dbact'},profile&&profile.live&&Link('/team/'+profile.slug,'View public profile','btn sm'),profile&&profile.live&&h('button',{class:'btn ghost sm',type:'button',onclick:()=>api.setHidden(!profile.hidden).then(reload)},profile.hidden?'Show my profile':'Hide my profile'))),
  h('div',{class:'grid'},
   h('div',{class:'card'},h('div',{class:'ring'},ring,h('div',{},h('div',{class:'pct'},c.pct+'%'),h('small',{style:'color:var(--mute)'},'profile complete'))),h('ul',{class:'chk'},c.items.map(([t,y])=>h('li',{class:y?'y':''},t))),Link('/account/profile',kind==='new'?'Create my profile':'Edit my profile','btn sm')),
   postsBox,
   user.role==='admin'&&h('div',{class:'card'},h('h3',{style:'font-size:1rem'},'Needs your review'),h('p',{},(badges&&badges.review||0)+' item(s) waiting'),Link('/admin/review','Open the review queue','btn sm'))))}};
