// src/chat.js: the chat brain. Order: safety check > curated FAQ (free, instant) > free Workers AI > plain fallback.
import { FAQ, PAGES, SAFE, FALL, C } from './faq.js';
const norm=s=>' '+String(s).toLowerCase().replace(/[^a-z0-9 ]+/g,' ').replace(/\s+/g,' ').trim()+' ';
const KW=FAQ.map(f=>({f,k:f.k.split(',').map(x=>x.trim())}));
const rank=text=>{const t=norm(text);return KW.map(({f,k})=>{let s=0;for(const w of k)if(t.includes(' '+w+' '))s+=w.split(' ').length;return{f,s}}).sort((a,b)=>b.s-a.s)};
const match=text=>{const r=rank(text)[0];return r&&r.s>0?r.f:null};
const CORE=['about','work','contact'].map(id=>FAQ.find(f=>f.id===id));
const SW=new Set('na ya wa kwa ni je nini jinsi habari asante tafadhali naweza ninawezaje unaweza mnaweza mimi sisi yenu yetu wenu kujiunga kujitolea mnafanya nyinyi ninataka nataka hujambo mambo sijui vipi wapi lini gani nani ndio hapana pia sana bure gharama msaada shirika mwanachama akaunti nenosiri ingia simu wasiliana uzinduzi tarehe kazi fursa ajira chuo watoto wanawake wanaume mko mnapatikana huduma programu ushauri kuhusu'.split(' '));
const EN=new Set('the is what how can i you are do to of and for where when who my your join a an it this that me we our about have does please'.split(' '));
export const detect=(t,prev)=>{let s=0,e=0;for(const w of norm(t).trim().split(' ')){if(SW.has(w))s++;if(EN.has(w))e++}return s>e?'sw':e>s?'en':(prev||'en')};
const RISK=/\b(suicid\w*|kill myself|killing myself|end my life|want to die|self ?harm|hurt myself|cut myself|rape\w*|raped|abus(e|ed|ing)|molest\w*|domestic violence|gbv|kujiua|najiua|nataka kufa|nijiue|kujidhuru|ubakaji|nimebakwa|unyanyasaji|nimenyanyaswa|ananipiga|anadhulumiwa)\b/i;
const hex=b=>[...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,'0')).join('');
const sha=async s=>hex(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(s)));
async function allow(env,ip){   // free-allowance protection: a daily cap for everyone and an hourly cap per visitor (hashed IP, nothing personal stored)
 try{const now=Date.now(),day=Math.floor(now/864e5),hr=Math.floor(now/36e5),k1='g:'+day,k2='i:'+(await sha(ip)).slice(0,24)+':'+hr,cap=parseInt(env.CHAT_DAILY_CAP)||300,per=parseInt(env.CHAT_HOURLY_PER_IP)||15;
  const g=await env.DB.prepare('SELECT n FROM chat_rate WHERE k=?1').bind(k1).first(),i=await env.DB.prepare('SELECT n FROM chat_rate WHERE k=?1').bind(k2).first();
  if((g&&g.n>=cap)||(i&&i.n>=per))return false;
  const up="INSERT INTO chat_rate(k,n,win) VALUES(?1,1,?2) ON CONFLICT(k) DO UPDATE SET n=n+1";await env.DB.prepare(up).bind(k1,day).run();await env.DB.prepare(up).bind(k2,day).run();await env.DB.prepare('DELETE FROM chat_rate WHERE win<?1').bind(day-1).run();return true}
 catch(e){console.log('CHAT_RATE_ERROR',String(e).slice(0,100));return false}}   // fail closed: never spend the allowance if we cannot count it
const SYS=`You are the assistant on the L.I.G.O. SPACE website (Kajiado South, Kenya; founded by Samuel M.K.; launch 5 December 2026). Answer ONLY from the FACTS below. If the answer is not in the FACTS, say you do not know and give the contact details. Never claim a future initiative (SACCO, vocational center, university, academy, app) exists. Never invent numbers, people, prices or dates. Be warm, plain and under 80 words. Contact: ${C.phone}, ${C.email}.`;
// Models available on Workers AI (ids and neuron rates [input, output per million tokens] from Cloudflare's catalogue). think = a reasoning model that needs more room.
export const MODELS=[
 {id:'@cf/meta/llama-3.1-8b-instruct-fast',label:'Llama 3.1 8B (fast)',note:'Cheapest. Kiswahili is not an officially supported language.',rate:null},
 {id:'@cf/meta/llama-3.3-70b-instruct-fp8-fast',label:'Llama 3.3 70B (fast)',note:'Strong in English. Output tokens are costly.',rate:[26668,204805]},
 {id:'@cf/mistralai/mistral-small-3.1-24b-instruct',label:'Mistral Small 3.1 24B',note:'Mid-size, balanced cost.',rate:[31876,50488]},
 {id:'@cf/aisingapore/gemma-sea-lion-v4-27b-it',label:'Gemma SEA-LION v4 27B',note:'Gemma-based multilingual model.',rate:[31876,50488]},
 {id:'@cf/qwen/qwen3-30b-a3b-fp8',label:'Qwen3 30B-A3B',note:'Multilingual. May think before answering.',think:true,rate:[4625,30475]},
 {id:'@cf/google/gemma-4-26b-a4b-it',label:'Gemma 4 26B-A4B',note:'Thinking model, cheap per token.',think:true,rate:[9091,27273]},
 {id:'@cf/zai-org/glm-4.7-flash',label:'GLM 4.7 Flash',note:'Claims 100+ languages. Thinking model.',think:true,rate:[5500,36400]},
 {id:'@cf/openai/gpt-oss-20b',label:'gpt-oss 20B',note:'Thinking model.',think:true,rate:[18182,27273]}];
const read=r=>{if(!r)return '';if(typeof r==='string')return r;if(r.response)return String(r.response);const m=r.choices&&r.choices[0]&&r.choices[0].message;if(m&&m.content)return String(m.content);if(r.result&&r.result.response)return String(r.result.response);return ''};   // older models answer in .response, newer ones in choices[0].message.content
export async function runModel(env,model,messages,opt){const m=MODELS.find(x=>x.id===model),t0=Date.now();
 const r=await env.AI.run(model,{messages,max_tokens:m&&m.think?900:220,temperature:0.2},opt),raw=read(r);
 return{text:raw.replace(/<think>[\s\S]*?(<\/think>|$)/gi,'').trim(),ms:Date.now()-t0,usage:r&&r.usage,leaked:/<think>/i.test(raw)}}
export function prompt(text,L,msgs){const top=rank(text).filter(x=>x.s>0).slice(0,3).map(x=>x.f),use=top.length?top:CORE;   // only the most relevant facts, in the visitor's language, so the model paraphrases instead of translating
 return [{role:'system',content:SYS+(L==='sw'?' Reply in Kiswahili.':' Reply in English.')+'\nFACTS:\n'+use.map(f=>'- '+f[L]).join('\n')},...msgs]}
export async function chosen(env){try{const r=await env.DB.prepare("SELECT v FROM settings WHERE k='chat_model'").first();if(r&&MODELS.some(m=>m.id===r.v))return r.v}catch(e){}return MODELS.some(m=>m.id===env.CHAT_MODEL)?env.CHAT_MODEL:MODELS[0].id}
async function askAI(env,msgs,L,text){
 const messages=prompt(text,L,msgs),opt=env.AI_GATEWAY?{gateway:{id:env.AI_GATEWAY,cacheTtl:3600}}:undefined;
 for(const model of [...new Set([await chosen(env),'@cf/meta/llama-3.1-8b-instruct'])]){
  for(const o of opt?[opt,undefined]:[undefined]){try{const r=await runModel(env,model,messages,o);if(r.text)return r.text}catch(e){console.log('CHAT_AI_ERROR',model,String(e).slice(0,100))}}}
 return ''}
const LAB=[['en','How can I volunteer with L.I.G.O. SPACE?'],['en','Can I save money with your SACCO?'],['en','What is the difference between your wellness mentorship and therapy?'],['en','What is the weather like in Nairobi today?'],['sw','Ninawezaje kujitolea kwenye L.I.G.O. SPACE?'],['sw','Je, naweza kuweka akiba kwenye SACCO yenu?'],['sw','Mnatoa nini kwa vijana?'],['sw','Hali ya hewa ikoje Nairobi leo?']];
export async function lab(env,models){   // admin-only bake-off: the same questions, the same prompt as the live chat, up to 3 models
 const ids=[...new Set(Array.isArray(models)?models:[])].filter(m=>MODELS.some(x=>x.id===m)).slice(0,3);if(!ids.length)return{error:'Choose 1 to 3 models'};
 const day=Math.floor(Date.now()/864e5),k='lab:'+day,row=await env.DB.prepare('SELECT n FROM chat_rate WHERE k=?1').bind(k).first(),need=ids.length*LAB.length;
 if((row?row.n:0)+need>(parseInt(env.LAB_DAILY_CAP)||120))return{error:'The AI lab daily limit has been reached. Try again tomorrow.'};
 await env.DB.prepare('INSERT INTO chat_rate(k,n,win) VALUES(?1,?2,?3) ON CONFLICT(k) DO UPDATE SET n=n+?2').bind(k,need,day).run();
 return{results:await Promise.all(ids.map(async id=>{const runs=[];for(const [L,q] of LAB){try{const r=await runModel(env,id,prompt(q,L,[{role:'user',content:q}])),u=r.usage||{};runs.push({q,lang:L,ms:r.ms,text:r.text.slice(0,400),empty:!r.text,leaked:r.leaked,tin:u.prompt_tokens||null,tout:u.completion_tokens||null})}catch(e){runs.push({q,lang:L,error:String(e&&e.message||e).slice(0,120)})}}return{id,runs}}))}}
export async function chat(env,b,ip){
 const msgs=(Array.isArray(b.messages)?b.messages:[]).slice(-6).filter(x=>x&&(x.role==='user'||x.role==='assistant')&&typeof x.content==='string').map(x=>({role:x.role,content:x.content.slice(0,500)}));
 const us=msgs.filter(x=>x.role==='user'),last=us[us.length-1];if(!last)return null;
 const prev=us.length>1?detect(us[us.length-2].content,null):null,L=b.lang==='sw'||b.lang==='en'?b.lang:detect(last.content,prev);
 const out=(via,reply,go)=>({reply,via,lang:L,link:go?{path:go,label:PAGES[go][L==='sw'?1:0]}:null});
 if(RISK.test(last.content))return out('safe',SAFE[L],null);
 const f=match(last.content);if(f)return out('faq',f[L],f.go);
 if(env.AI&&typeof env.AI.run==='function'&&await allow(env,ip)){const r=await askAI(env,msgs,L,last.content);if(r)return out('ai',r,null)}
 return out('fallback',FALL[L],'/contact')}
