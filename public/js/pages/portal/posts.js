// js/pages/portal/posts.js: posts, products, stories and events. Members' items are reviewed first; an administrator's are published immediately.
import { h } from '../../core/dom.js';
import { icon } from '../../components/icons.js';
import { PostCard } from '../../components/postcard.js';
import { api } from '../../data/api.js';
import { shrink } from '../../core/image.js';
import { OPP_KINDS } from '../../data/content.js';
const F=(l,el)=>h('label',{},l,el);
const TYPES=[['post','Post'],['product','Product'],['story','Story'],['event','Event'],['opportunity','Opportunity']],MAX={post:600,product:600,story:4000,event:1500,opportunity:1500};
const HINT={post:'A short update about yourself or your work.',product:'Something you offer. Add a price if you like.',story:'A longer story: a journey, a lesson, a change that happened.',event:'Something happening on a date. Add a place and a registration link.',opportunity:'A job, training, scholarship, mentorship or other chance for others. Say what it is, who it is for, the place and how to apply.'};
export default{title:'Posts, stories & events',sub:'Share what you do, what you offer, your story or an event. Everything is shown on the site with a full page of its own.',render:({profile})=>{
 const root=h('div');let data=null;
 const load=()=>api.myPosts().then(d=>{data=d;list()},e=>root.replaceChildren(h('p',{class:'bad'},e.message)));
 const list=()=>{const n=data.posts.length;
  root.replaceChildren(
   h('div',{class:'row',style:'margin:0 0 16px;align-items:center;justify-content:space-between'},h('b',{},n+' of '+data.limit+' used'),h('button',{class:'btn',type:'button',disabled:n>=data.limit||null,onclick:()=>edit(null)},icon('plus',18),' New')),
   data.direct?h('div',{class:'note'},'As an administrator, what you publish here goes live immediately.'):!(profile&&profile.live)&&h('div',{class:'note'},'Your items appear publicly once your profile is live on the Team page.'),
   n?h('div',{class:'grid'},data.posts.map(p=>{const cur=p.pending||p.live;if(!cur)return null;const k=p.note?['Changes requested','s-changes']:p.pending?['In review','s-review']:['Live','s-live'];
    return h('div',{class:'pwrap'},PostCard({...cur,id:p.live&&!p.pending?p.id:undefined},{here:true}),h('div',{class:'pmeta'},h('span',{class:'spill '+k[1]},k[0]),p.note&&h('small',{},p.note)),
     h('div',{class:'row',style:'margin-top:8px'},h('button',{class:'btn sm ghost',type:'button',onclick:()=>edit(p)},'Edit'),h('button',{class:'btn sm ghost',type:'button',onclick:()=>{if(confirm('Delete this?'))api.deletePost(p.id).then(load)}},'Delete')))})):h('div',{class:'card empty'},h('h3',{},'Nothing here yet'),h('p',{},'Add a post, a product, a story or an event. Each one gets its own page on the site.')))};
 const edit=p=>{const v=p?(p.pending||p.live):{},st={id:p&&p.id,type:v.type||'post',title:v.title||'',body:v.body||'',price:v.price||'',date:v.date||'',place:v.place||'',kind:v.kind||'',link:v.link||'',image:v.image||''};
  const msg=h('p',{role:'status'}),say=(t,bad)=>{msg.textContent=t;msg.className=bad?'bad':'ok'},pv=h('div'),cnt=h('div',{class:'cnt'}),hint=h('p',{class:'hint'});
  const types=TYPES.map(([k,t])=>h('button',{type:'button',class:'pchip','data-t':k,onclick:()=>{st.type=k;st.body=st.body.slice(0,MAX[k]);body.value=st.body;refresh()}},t));
  const title=h('input',{value:st.title,maxlength:80,placeholder:'A short title',oninput:()=>{st.title=title.value;refresh()}}),body=h('textarea',{rows:8,placeholder:'Write here. Press Enter for a new paragraph.',oninput:()=>{st.body=body.value;refresh()}},st.body);
  const priceIn=h('input',{value:st.price,maxlength:40,placeholder:'For example: KES 1,500',oninput:()=>{st.price=priceIn.value;refresh()}}),price=F('Price (optional)',priceIn);
  const dateIn=h('input',{type:'date',value:st.date,oninput:()=>{st.date=dateIn.value;refresh()}}),placeIn=h('input',{value:st.place,maxlength:80,placeholder:'For example: Kajiado South',oninput:()=>{st.place=placeIn.value;refresh()}}),kindIn=h('select',{onchange:()=>{st.kind=kindIn.value;refresh()}},h('option',{value:''},'Choose a type'),OPP_KINDS.map(([k,t])=>h('option',{value:k,selected:st.kind===k||null},t))),ev=h('div',{class:'lgrid'},F('Date',dateIn),F('Place',placeIn)),kindF=F('Type of opportunity',kindIn);
  const linkLbl=h('span',{}),link=h('input',{type:'text',inputmode:'url',value:st.link,placeholder:'https://your-link.com (optional)',oninput:()=>{st.link=link.value},onblur:()=>{const x=link.value.trim();if(x&&!/^https?:\/\//i.test(x)){link.value='https://'+x;st.link=link.value;refresh()}}});
  const fileIn=h('input',{type:'file',accept:'image/*',class:'sr',onchange:()=>{const f=fileIn.files[0];if(!f)return;say('Optimising your photo\u2026');shrink(f).then(b=>api.upload(b)).then(u=>{st.image=u;refresh();say('Image ready.')}).catch(x=>say(x.message,true))}});
  const dz=h('label',{class:'dz'},h('div',{},'Add an image (optional)',h('small',{},'We shrink it for you. It stays private until published.')),fileIn);
  const save=h('button',{class:'btn',type:'button',onclick:()=>{save.disabled=true;say('Saving\u2026');const l=st.link.trim();api.savePost({...st,link:l&&!/^https?:\/\//i.test(l)?'https://'+l:l}).then(()=>load()).catch(x=>{save.disabled=false;say(x.message,true)})}},data.direct?'Publish':'Save for review');
  const refresh=()=>{const t=st.type;types.forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.t===t)));body.maxLength=MAX[t];cnt.textContent=st.body.length+' / '+MAX[t];price.hidden=t!=='product';ev.hidden=!(t==='event'||t==='opportunity');kindF.hidden=t!=='opportunity';dateIn.previousSibling.textContent=t==='opportunity'?'Apply by':'Date';linkLbl.textContent=t==='event'?'Registration link (optional)':t==='opportunity'?'Apply link (optional)':'Link (optional)';hint.textContent=HINT[t];
   pv.replaceChildren(PostCard({...st},{here:true,full:true}));save.disabled=!(st.title.trim()&&st.body.trim()&&(t!=='event'||st.date)&&(t!=='opportunity'||st.kind))};
  refresh();
  root.replaceChildren(h('div',{class:'dash'},h('div',{},h('div',{class:'sect'},h('h3',{},p?'Edit':'New'),
    h('div',{class:'pgrid',style:'margin-bottom:6px'},types),hint,F('Title',title),F('Text',body),cnt,price,kindF,ev,F(linkLbl,link),dz),
    h('div',{class:'savebar'},msg,h('div',{class:'row',style:'margin:0'},h('button',{class:'btn ghost',type:'button',onclick:load},'Cancel'),save))),
   h('aside',{class:'dside'},h('h3',{style:'font-size:1rem'},'Preview (full text)'),pv)))};
 load();return root}};
