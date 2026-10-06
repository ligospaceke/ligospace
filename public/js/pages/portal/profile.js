// js/pages/portal/profile.js: edit my profile (live preview, completeness, photo drop-zone)
import { h } from '../../core/dom.js';
import { svg } from '../../components/common.js';
import { Avatar, SOC } from '../../components/person.js';
import { api } from '../../data/api.js';
import { shrink } from '../../core/image.js';
import { PROGRAMS, RESTRICTED, slug, progName } from '../../data/content.js';
const F=(l,el)=>h('label',{},l,el);
export const completeness=v=>{v=v||{};const items=[['A photo',!!v.photo],['Your name',!!(v.name||'').trim()],['A headline',!!(v.headline||'').trim()],['A bio of 80+ characters',(v.bio||'').trim().length>=80],['At least one program',(v.programs||[]).length>0],['At least one link',Object.values(v.links||{}).some(x=>x&&x.trim())]];return{items,pct:Math.round(items.filter(x=>x[1]).length/items.length*100)}};
export const Ring=()=>svg('<svg viewBox="0 0 36 36" width="68" height="68" aria-hidden="true"><circle class="ringbg" cx="18" cy="18" r="15.9" fill="none" stroke-width="3.5"/><circle class="rfg" cx="18" cy="18" r="15.9" fill="none" stroke-width="3.5" stroke-linecap="round" stroke-dasharray="0 100" transform="rotate(-90 18 18)"/></svg>');
export default{title:'My profile',sub:'This is what people see on the Team page once it is approved.',render:({user,profile,reload})=>{
 const v=(profile&&(profile.pending||profile.live))||{},st={name:v.name||'',headline:v.headline||'',bio:v.bio||'',video:v.video||'',photo:v.photo||'',programs:[...(v.programs||[])],links:{...(v.links||{})},consent:!!profile};
 let dirty=false;const msg=h('p',{role:'status'}),say=(t,bad)=>{msg.textContent=t;msg.className=bad?'bad':'ok'},touch=()=>{if(!dirty){dirty=true;say('You have unsaved changes.')}};
 const inp=(k,o={})=>{const e=h('input',{value:st[k],maxlength:o.max,placeholder:o.ph||'',autocomplete:'off',type:'text',oninput:()=>{st[k]=e.value;touch();refresh()}});return e};
 const cnt=h('div',{class:'cnt'},st.bio.length+' / 1500'),bio=h('textarea',{rows:7,maxlength:1500,placeholder:'Who are you, what do you do, and how can you help people in the L.I.G.O. community?',oninput:()=>{st.bio=bio.value;cnt.textContent=st.bio.length+' / 1500';touch();refresh()}},st.bio);
 const prev=h('div'),fileIn=h('input',{type:'file',accept:'image/*',class:'sr',onchange:()=>pick(fileIn.files[0])}),drawPhoto=()=>prev.replaceChildren(Avatar({name:st.name||user.email,photo:st.photo}));
 const pick=f=>{if(!f)return;if(!/^image\//.test(f.type)){say('Please choose an image file.',true);return}say('Optimising your photo\u2026');shrink(f).then(b=>api.upload(b)).then(u=>{st.photo=u;drawPhoto();touch();refresh();say('Photo ready. Save for review to submit it.')}).catch(x=>say(x.message,true))};
 const dz=h('label',{class:'dz'},prev,h('div',{},'Add a photo',h('small',{},'Drag one here or tap to choose. A clear face photo works best. We shrink it for you.')),fileIn);
 dz.addEventListener('dragover',e=>{e.preventDefault();dz.classList.add('over')});dz.addEventListener('dragleave',()=>dz.classList.remove('over'));dz.addEventListener('drop',e=>{e.preventDefault();dz.classList.remove('over');pick(e.dataTransfer.files[0])});
 const chips=PROGRAMS.map(([t])=>{const s=slug(t),b=h('button',{type:'button',class:'pchip','aria-pressed':String(st.programs.includes(s)),onclick:()=>{if(st.programs.includes(s))st.programs=st.programs.filter(x=>x!==s);else if(st.programs.length>=6){say('You can choose up to 6 programs.',true);return}else st.programs.push(s);b.setAttribute('aria-pressed',String(st.programs.includes(s)));touch();refresh()}},t+(RESTRICTED.includes(s)?' \u24D8':''));return b});
 const links=SOC.map(([k,t])=>{const e=h('input',{type:'text',inputmode:'url',value:st.links[k]||'',placeholder:k==='website'?'yourwebsite.com':'link to your '+t+' page',oninput:()=>{st.links[k]=e.value;touch();refresh()},onblur:()=>{const x=e.value.trim();if(x&&!/^https?:\/\//i.test(x)){e.value='https://'+x;st.links[k]=e.value;refresh()}}});return F(t,e)});
 const consent=h('input',{type:'checkbox',checked:st.consent||null,onchange:e=>{st.consent=e.target.checked;touch();refresh()}});
 const sect=(n,t,hint,...c)=>h('div',{class:'sect'},h('h3',{},h('i',{},n),t),h('p',{class:'hint'},hint),c);
 const save=h('button',{class:'btn',type:'button',onclick:()=>{if(!st.name.trim()||!st.consent)return;save.disabled=true;say('Saving\u2026');
  const L=Object.fromEntries(Object.entries(st.links).filter(([,x])=>x&&x.trim()).map(([k,x])=>[k,/^https?:\/\//i.test(x.trim())?x.trim():'https://'+x.trim()]));
  api.saveProfile({...st,links:L}).then(()=>{say('Submitted for review. We will publish it once approved.');dirty=false;setTimeout(reload,900)}).catch(x=>{save.disabled=false;say(x.message,true)})}},'Save for review');
 const pv=h('div',{class:'card pvcard'}),ring=Ring(),pct=h('div',{class:'pct'}),chk=h('ul',{class:'chk'});
 const refresh=()=>{pv.replaceChildren(Avatar({name:st.name||user.email,photo:st.photo},true),h('h3',{},st.name||'Your name'),h('p',{},st.headline||'Your headline'),h('div',{},st.programs.slice(0,3).map(s=>h('span',{class:'chip'},progName(s)))),h('p',{style:'font-size:.8rem'},Object.values(st.links).filter(x=>x&&x.trim()).length+' link(s) on your full profile'));
  const c=completeness(st);ring.querySelector('.rfg').setAttribute('stroke-dasharray',c.pct+' 100');pct.textContent=c.pct+'%';chk.replaceChildren(...c.items.map(([t,y])=>h('li',{class:y?'y':''},t)));save.disabled=!(st.name.trim()&&st.consent)};
 drawPhoto();refresh();
 return h('div',{class:'dash'},h('div',{},
  sect(1,'About you','This is the first thing people see.',F('Full name',inp('name',{max:80,ph:'Your full name'})),F('Headline',inp('headline',{max:120,ph:'For example: Career mentor in digital skills'})),F('Bio',bio),cnt),
  sect(2,'Your photo','Shown on the Team page. It stays private until the team approves it.',dz),
  sect(3,'Programs you offer','Pick up to 6. People browsing a program will find you there. \u24D8 means introductions go through L.I.G.O. SPACE.',h('div',{class:'pgrid'},chips)),
  sect(4,'Links and video','Add where people can find your work. Missing https:// is added for you.',h('div',{class:'lgrid'},links),F('Video (YouTube link, optional)',inp('video',{ph:'https://youtube.com/...'}))),
  sect(5,'Publish','Your profile is reviewed before it goes public.',h('label',{class:'tog'},consent,h('span',{},'I agree to show my profile and the links I add publicly once approved. I understand L.I.G.O. SPACE routes introduction requests to me.'))),
  h('div',{class:'savebar'},msg,save)),
 h('aside',{class:'dside'},h('div',{},h('h3',{style:'font-size:1rem'},'How you will appear'),pv),h('div',{class:'card'},h('div',{class:'ring'},ring,h('div',{},pct,h('small',{style:'color:var(--mute)'},'profile complete'))),chk)))}};
