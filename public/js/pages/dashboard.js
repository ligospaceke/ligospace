// js/pages/dashboard.js: the member dashboard (edit profile, live preview, completeness, status)
import { h } from '../core/dom.js';
import { Link, svg } from '../components/common.js';
import { Avatar, SOC } from '../components/person.js';
import { api } from '../data/api.js';
import { PROGRAMS, RESTRICTED, slug, progName } from '../data/content.js';
const STATES={new:['Not submitted','s-new','Fill in your profile and submit it. We review every profile before it appears on the Team page.'],review:['In review','s-review','Your profile is with the L.I.G.O. SPACE team and will appear on the Team page once approved. You can keep editing; saving again replaces the version in review.'],changes:['Changes requested','s-changes',''],live:['Live','s-live','Your profile is live on the Team page. Edits you submit are reviewed before they replace the live version.'],hidden:['Hidden','s-hidden','Your profile is hidden. Nobody can see it until you show it again.']};
const shrink=f=>new Promise((ok,no)=>{const img=new Image(),u=URL.createObjectURL(f);img.onload=()=>{const s=Math.min(1,800/Math.max(img.width,img.height)),c=document.createElement('canvas');c.width=Math.round(img.width*s);c.height=Math.round(img.height*s);c.getContext('2d').drawImage(img,0,0,c.width,c.height);URL.revokeObjectURL(u);c.toBlob(b=>b?ok(b):no(new Error('Could not process the image')),'image/jpeg',.86)};img.onerror=()=>no(new Error('That file is not a readable image'));img.src=u});
const F=(l,el)=>h('label',{},l,el);
export const Dashboard=({user,profile},reload,pwForm)=>{
 const v=(profile&&(profile.pending||profile.live))||{},st={name:v.name||'',headline:v.headline||'',bio:v.bio||'',video:v.video||'',photo:v.photo||'',programs:[...(v.programs||[])],links:{...(v.links||{})},consent:!!profile};
 const kind=!profile?'new':profile.pending?'review':profile.note?'changes':profile.live?(profile.hidden?'hidden':'live'):'new',S=STATES[kind],idx={new:0,changes:0,review:1,live:2,hidden:2}[kind];
 let dirty=false;const msg=h('p',{role:'status'}),say=(t,bad)=>{msg.textContent=t;msg.className=bad?'bad':'ok'},touch=()=>{if(!dirty){dirty=true;say('You have unsaved changes.')}};
 const first=(st.name||user.email.split('@')[0]).split(' ')[0];
 /* header */
 const head=h('div',{class:'dbhead'},Avatar({name:st.name||user.email,photo:st.photo},true),
  h('div',{class:'dbwho'},h('h2',{},'Welcome, '+first),h('p',{},user.email),h('span',{class:'spill '+S[1]},S[0]),
   h('ol',{class:'dsteps'},['Create','In review','Live'].map((t,i)=>h('li',{class:i<idx?'done':i===idx?'on':''},t))),
   h('p',{style:'margin:0;font-size:.92rem'},kind==='changes'?'Changes requested: '+profile.note:S[2])),
  h('div',{class:'dbact'},profile&&profile.live&&Link('/team/'+profile.slug,'View public profile','btn sm'),profile&&profile.live&&h('button',{class:'btn ghost sm',onclick:()=>api.setHidden(!profile.hidden).then(reload)},profile.hidden?'Show my profile':'Hide my profile'),user.role==='admin'&&Link('/admin','Admin queue','btn sm'),h('button',{class:'btn ghost sm',onclick:()=>api.logout().then(reload)},'Sign out')));
 /* inputs */
 const inp=(k,o={})=>{const e=h('input',{value:st[k],maxlength:o.max,placeholder:o.ph||'',autocomplete:'off',type:o.type||'text',oninput:()=>{st[k]=e.value;touch();refresh()}});return e};
 const cnt=h('div',{class:'cnt'},st.bio.length+' / 1500'),bio=h('textarea',{rows:7,maxlength:1500,placeholder:'Who are you, what do you do, and how can you help people in the L.I.G.O. community?',oninput:()=>{st.bio=bio.value;cnt.textContent=st.bio.length+' / 1500';touch();refresh()}},st.bio);
 const prev=h('div'),fileIn=h('input',{type:'file',accept:'image/*',class:'sr',onchange:()=>pick(fileIn.files[0])});
 const drawPhoto=()=>prev.replaceChildren(Avatar({name:st.name||user.email,photo:st.photo}));
 const pick=f=>{if(!f)return;if(!/^image\//.test(f.type)){say('Please choose an image file.',true);return}say('Optimising your photo\u2026');shrink(f).then(b=>api.upload(b)).then(u=>{st.photo=u;drawPhoto();touch();refresh()}).catch(x=>say(x.message,true))};
 const dz=h('label',{class:'dz'},prev,h('div',{},'Add a photo',h('small',{},'Drag one here or tap to choose. A clear face photo works best. We shrink it for you.')),fileIn);
 dz.addEventListener('dragover',e=>{e.preventDefault();dz.classList.add('over')});dz.addEventListener('dragleave',()=>dz.classList.remove('over'));dz.addEventListener('drop',e=>{e.preventDefault();dz.classList.remove('over');pick(e.dataTransfer.files[0])});
 const chips=PROGRAMS.map(([t])=>{const s=slug(t),b=h('button',{type:'button',class:'pchip','aria-pressed':String(st.programs.includes(s)),onclick:()=>{if(st.programs.includes(s))st.programs=st.programs.filter(x=>x!==s);else if(st.programs.length>=6){say('You can choose up to 6 programs.',true);return}else st.programs.push(s);b.setAttribute('aria-pressed',String(st.programs.includes(s)));touch();refresh()}},t+(RESTRICTED.includes(s)?' \u24D8':''));return b});
 const links=SOC.map(([k,t])=>{const e=h('input',{type:'text',inputmode:'url',value:st.links[k]||'',placeholder:k==='website'?'yourwebsite.com':'link to your '+t+' page',oninput:()=>{st.links[k]=e.value;touch();refresh()},onblur:()=>{const x=e.value.trim();if(x&&!/^https?:\/\//i.test(x)){e.value='https://'+x;st.links[k]=e.value;refresh()}}});return F(t,e)});
 const consent=h('input',{type:'checkbox',checked:st.consent||null,onchange:e=>{st.consent=e.target.checked;touch();refresh()}});
 const sect=(n,t,hint,...c)=>h('div',{class:'sect'},h('h3',{},h('i',{},n),t),h('p',{class:'hint'},hint),c);
 const save=h('button',{class:'btn',type:'button',onclick:()=>{if(!st.name.trim()||!st.consent)return;save.disabled=true;say('Saving\u2026');
  const L=Object.fromEntries(Object.entries(st.links).filter(([,x])=>x&&x.trim()).map(([k,x])=>[k,/^https?:\/\//i.test(x.trim())?x.trim():'https://'+x.trim()]));
  api.saveProfile({...st,links:L}).then(()=>{say('Submitted for review. We will publish it once approved.');dirty=false;setTimeout(reload,900)}).catch(x=>{save.disabled=false;say(x.message,true)})}},'Save for review');
 /* side panel */
 const pv=h('div',{class:'card pvcard'}),ring=svg('<svg viewBox="0 0 36 36" width="68" height="68" aria-hidden="true"><circle cx="18" cy="18" r="15.9" fill="none" stroke="#e7dcc6" stroke-width="3.5"/><circle class="rfg" cx="18" cy="18" r="15.9" fill="none" stroke="#c8892b" stroke-width="3.5" stroke-linecap="round" stroke-dasharray="0 100" transform="rotate(-90 18 18)"/></svg>'),pct=h('div',{class:'pct'}),chk=h('ul',{class:'chk'});
 const refresh=()=>{
  pv.replaceChildren(Avatar({name:st.name||user.email,photo:st.photo},true),h('h3',{},st.name||'Your name'),h('p',{},st.headline||'Your headline'),h('div',{},st.programs.slice(0,3).map(s=>h('span',{class:'chip'},progName(s)))),h('p',{style:'font-size:.8rem'},Object.values(st.links).filter(x=>x&&x.trim()).length+' link(s) on your full profile'));
  const it=[['A photo',!!st.photo],['Your name',!!st.name.trim()],['A headline',!!st.headline.trim()],['A bio of 80+ characters',st.bio.trim().length>=80],['At least one program',st.programs.length>0],['At least one link',Object.values(st.links).some(x=>x&&x.trim())]],p=Math.round(it.filter(x=>x[1]).length/it.length*100);
  ring.querySelector('.rfg').setAttribute('stroke-dasharray',p+' 100');pct.textContent=p+'%';chk.replaceChildren(...it.map(([t,y])=>h('li',{class:y?'y':''},t)));save.disabled=!(st.name.trim()&&st.consent)};
 drawPhoto();refresh();
 return h('div',{},head,h('div',{class:'dash'},
  h('div',{},
   sect(1,'About you','This is the first thing people see.',F('Full name',inp('name',{max:80,ph:'Your full name'})),F('Headline',inp('headline',{max:120,ph:'For example: Career mentor in digital skills'})),F('Bio',bio),cnt),
   sect(2,'Your photo','Shown on the Team page. It stays private until the team approves it.',dz),
   sect(3,'Programs you offer','Pick up to 6. People browsing a program will find you there. \u24D8 means introductions go through L.I.G.O. SPACE.',h('div',{class:'pgrid'},chips)),
   sect(4,'Links and video','Add where people can find your work. Missing https:// is added for you.',h('div',{class:'lgrid'},links),F('Video (YouTube link, optional)',inp('video',{ph:'https://youtube.com/...',type:'text'}))),
   sect(5,'Publish','Your profile is reviewed before it goes public.',h('label',{class:'tog'},consent,h('span',{},'I agree to show my profile and the links I add publicly once approved. I understand L.I.G.O. SPACE routes introduction requests to me.'))),
   h('div',{class:'savebar'},msg,save)),
  h('aside',{class:'dside'},h('div',{},h('h3',{style:'font-size:1rem'},'How you will appear'),pv),
   h('div',{class:'card'},h('div',{class:'ring'},ring,h('div',{},pct,h('small',{style:'color:var(--mute)'},'profile complete'))),chk),
   h('details',{class:'card'},h('summary',{},'Change password'),pwForm(()=>say('Password changed.'))))))};
