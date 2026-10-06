// js/pages/portal/posts.js: short posts and products. Each one is reviewed by the admin before it appears on the Showcase and on the member's profile.
import { h } from '../../core/dom.js';
import { icon } from '../../components/icons.js';
import { PostCard } from '../../components/postcard.js';
import { api } from '../../data/api.js';
import { shrink } from '../../core/image.js';
const F=(l,el)=>h('label',{},l,el);
export default{title:'My posts & products',sub:'Share a short post about yourself or something you offer. Each one is reviewed before it goes public.',render:({profile})=>{
 const root=h('div');let data=null;
 const load=()=>api.myPosts().then(d=>{data=d;list()},e=>root.replaceChildren(h('p',{class:'bad'},e.message)));
 const list=()=>{const n=data.posts.length;
  root.replaceChildren(
   h('div',{class:'row',style:'margin:0 0 16px;align-items:center;justify-content:space-between'},h('b',{},n+' of '+data.limit+' used'),h('button',{class:'btn',type:'button',disabled:n>=data.limit||null,onclick:()=>edit(null)},icon('plus',18),' New post')),
   !(profile&&profile.live)&&h('div',{class:'note'},'Your posts appear publicly once your profile is live on the Team page.'),
   n?h('div',{class:'grid'},data.posts.map(p=>{const cur=p.pending||p.live,k=p.note?['Changes requested','s-changes']:p.pending?['In review','s-review']:['Live','s-live'];if(!cur)return null;
    return h('div',{class:'pwrap'},PostCard(cur,{here:true}),h('div',{class:'pmeta'},h('span',{class:'spill '+k[1]},k[0]),p.note&&h('small',{},p.note)),
     h('div',{class:'row',style:'margin-top:8px'},h('button',{class:'btn sm ghost',type:'button',onclick:()=>edit(p)},'Edit'),h('button',{class:'btn sm ghost',type:'button',onclick:()=>{if(confirm('Delete this post?'))api.deletePost(p.id).then(load)}},'Delete')))})):h('div',{class:'card empty'},h('h3',{},'Nothing here yet'),h('p',{},'Add a short post about yourself, or a product or service you offer. We review it, then it appears on the Showcase and on your profile.')))};
 const edit=p=>{const v=p?(p.pending||p.live):{},st={id:p&&p.id,type:v.type||'post',title:v.title||'',body:v.body||'',price:v.price||'',link:v.link||'',image:v.image||''};
  const msg=h('p',{role:'status'}),say=(t,bad)=>{msg.textContent=t;msg.className=bad?'bad':'ok'},pv=h('div'),cnt=h('div',{class:'cnt'},st.body.length+' / 600');
  const refresh=()=>{pv.replaceChildren(PostCard({...st},{here:true}));price.hidden=st.type!=='product';types.forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.t===st.type)));save.disabled=!(st.title.trim()&&st.body.trim())};
  const types=[['post','Post'],['product','Product']].map(([k,t])=>h('button',{type:'button',class:'pchip','data-t':k,onclick:()=>{st.type=k;refresh()}},t));
  const title=h('input',{value:st.title,maxlength:80,placeholder:'A short title',oninput:()=>{st.title=title.value;refresh()}}),body=h('textarea',{rows:6,maxlength:600,placeholder:'Tell people about yourself, your work or your product.',oninput:()=>{st.body=body.value;cnt.textContent=st.body.length+' / 600';refresh()}},st.body);
  const priceIn=h('input',{value:st.price,maxlength:40,placeholder:'For example: KES 1,500',oninput:()=>{st.price=priceIn.value;refresh()}}),price=F('Price (optional)',priceIn);
  const link=h('input',{type:'text',inputmode:'url',value:st.link,placeholder:'https://your-link.com (optional)',oninput:()=>{st.link=link.value},onblur:()=>{const x=link.value.trim();if(x&&!/^https?:\/\//i.test(x)){link.value='https://'+x;st.link=link.value;refresh()}}});
  const fileIn=h('input',{type:'file',accept:'image/*',class:'sr',onchange:()=>{const f=fileIn.files[0];if(!f)return;say('Optimising your photo\u2026');shrink(f).then(b=>api.upload(b)).then(u=>{st.image=u;refresh();say('Image ready.')}).catch(x=>say(x.message,true))}});
  const dz=h('label',{class:'dz'},h('div',{},'Add an image (optional)',h('small',{},'It stays private until approved. We shrink it for you.')),fileIn);
  const save=h('button',{class:'btn',type:'button',onclick:()=>{save.disabled=true;say('Saving\u2026');const l=st.link.trim();api.savePost({...st,link:l&&!/^https?:\/\//i.test(l)?'https://'+l:l}).then(()=>{load()}).catch(x=>{save.disabled=false;say(x.message,true)})}},'Save for review');
  refresh();
  root.replaceChildren(h('div',{class:'dash'},h('div',{},h('div',{class:'sect'},h('h3',{},p?'Edit post':'New post'),h('p',{class:'hint'},'Reviewed by the L.I.G.O. SPACE team before it goes public. Editing a live post keeps the current version public until the change is approved.'),
    h('div',{class:'pgrid',style:'margin-bottom:12px'},types),F('Title',title),F('Text',body),cnt,price,F('Link',link),dz),
    h('div',{class:'savebar'},msg,h('div',{class:'row',style:'margin:0'},h('button',{class:'btn ghost',type:'button',onclick:load},'Cancel'),save))),
   h('aside',{class:'dside'},h('h3',{style:'font-size:1rem'},'Preview'),pv)))};
 load();return root}};
