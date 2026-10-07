// js/pages/post.js: the full page for one post, product, story or event (shareable link: #/post/ID)
import { h } from '../core/dom.js';
import { Section, Link } from '../components/common.js';
import { Avatar, safe } from '../components/person.js';
import { KIND } from '../components/postcard.js';
import { api } from '../data/api.js';
import { fmt } from '../core/date.js';
const BACK={story:['/stories','All stories'],event:['/events','All events'],post:['/showcase','Back to the showcase'],product:['/showcase','Back to the showcase']};
export const PostPage=([id])=>{const root=h('main');
 api.post(id).then(p=>{const a=p.author,back=BACK[p.type]||BACK.post,adminRow=h('span'),share=h('button',{class:'btn sm ghost',type:'button',onclick:()=>{const u=location.href;if(navigator.share)navigator.share({title:p.title,url:u}).catch(()=>{});else if(navigator.clipboard)navigator.clipboard.writeText(u).then(()=>{share.textContent='Link copied'})}},'Share');
  api.me().then(x=>{if(x.user.role==='admin')adminRow.replaceChildren(h('button',{class:'btn sm ghost',type:'button',onclick:()=>{if(confirm('Remove this from the site?'))api.removePost(p.id).then(()=>{location.hash='#'+back[0]})}},'Remove (admin)'))},()=>{});
  root.append(Section(null,h('article',{class:'ppage'},h('a',{class:'back',href:'#'+back[0]},'\u2190 '+back[1]),
   h('div',{class:'row',style:'margin:12px 0 0;align-items:center'},h('span',{class:'chip ptype'},KIND[p.type]||'Post'),p.type==='event'&&p.date&&h('b',{},fmt(p.date)),p.type==='event'&&p.place&&h('span',{},'\u2316 '+p.place)),
   h('h1',{},p.title),
   h('div',{class:'pbyline'},Avatar({name:a.name,photo:a.photo}),h('span',{},'By ',a.slug?h('a',{href:'#/team/'+a.slug},a.name):a.name,p.at?' \u00B7 '+fmt(p.at):'')),
   p.image&&h('img',{class:'phero',src:p.image,alt:''}),p.type==='product'&&p.price&&h('div',{class:'pprice big'},p.price),
   h('div',{class:'ptext'},(p.body||'').split(/\n+/).map(t=>h('p',{},t))),
   h('div',{class:'row'},safe(p.link)&&h('a',{class:'btn',href:p.link,target:'_blank',rel:'noopener noreferrer nofollow ugc'},(p.type==='event'?'Register or learn more':'Visit link')+' \u2197'),h('a',{class:'btn ghost',href:a.slug?'#/team/'+a.slug:'#/contact'},a.slug?'Enquire via L.I.G.O. SPACE':'Contact the team'),share,adminRow))))},
  ()=>root.append(Section(null,h('p',{},'This post is not available.'),Link('/showcase','Back to the showcase','btn'))));
 return root};
