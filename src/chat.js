// src/chat.js: the chat brain. Order: safety check > curated FAQ (free, instant) > free Workers AI > plain fallback.
import { FAQ, PAGES, SAFE, FALL, C } from './faq.js';
const norm=s=>' '+String(s).toLowerCase().replace(/[^a-z0-9 ]+/g,' ').replace(/\s+/g,' ').trim()+' ';
const KW=FAQ.map(f=>({f,k:f.k.split(',').map(x=>x.trim())}));
const match=text=>{const t=norm(text);let best=null,bs=0;for(const {f,k} of KW){let s=0;for(const w of k)if(t.includes(' '+w+' '))s+=w.split(' ').length;if(s>bs){bs=s;best=f}}return best};
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
const KNOW=FAQ.map(f=>'- '+f.en).join('\n');
async function askAI(env,msgs,L){
 const messages=[{role:'system',content:SYS+(L==='sw'?' Reply in Kiswahili.':' Reply in English.')+'\nFACTS:\n'+KNOW},...msgs];
 const opt=env.AI_GATEWAY?{gateway:{id:env.AI_GATEWAY,cacheTtl:3600}}:undefined;
 for(const model of [env.CHAT_MODEL||'@cf/meta/llama-3.1-8b-instruct-fast','@cf/meta/llama-3.1-8b-instruct']){
  for(const o of opt?[opt,undefined]:[undefined]){try{const r=await env.AI.run(model,{messages,max_tokens:220,temperature:0.2},o);const t=(r&&r.response||'').trim();if(t)return t}catch(e){console.log('CHAT_AI_ERROR',model,String(e).slice(0,100))}}}
 return ''}
export async function chat(env,b,ip){
 const msgs=(Array.isArray(b.messages)?b.messages:[]).slice(-6).filter(x=>x&&(x.role==='user'||x.role==='assistant')&&typeof x.content==='string').map(x=>({role:x.role,content:x.content.slice(0,500)}));
 const us=msgs.filter(x=>x.role==='user'),last=us[us.length-1];if(!last)return null;
 const prev=us.length>1?detect(us[us.length-2].content,null):null,L=b.lang==='sw'||b.lang==='en'?b.lang:detect(last.content,prev);
 const out=(via,reply,go)=>({reply,via,lang:L,link:go?{path:go,label:PAGES[go][L==='sw'?1:0]}:null});
 if(RISK.test(last.content))return out('safe',SAFE[L],null);
 const f=match(last.content);if(f)return out('faq',f[L],f.go);
 if(env.AI&&typeof env.AI.run==='function'&&await allow(env,ip)){const r=await askAI(env,msgs,L);if(r)return out('ai',r,null)}
 return out('fallback',FALL[L],'/contact')}
