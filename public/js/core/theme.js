// js/core/theme.js: light / dark theme. The choice is remembered; with no choice it follows the device. Colours live in css/tokens.css.
const KEY='ligo:theme',subs=new Set();
const stored=()=>{try{const v=localStorage.getItem(KEY);return v==='light'||v==='dark'?v:null}catch(e){return null}};
const sys=()=>!!(window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches);
export const themeChoice=()=>stored()||'auto';
export const currentTheme=()=>document.documentElement.getAttribute('data-theme')||(sys()?'dark':'light');
const apply=()=>{const t=stored()||(sys()?'dark':'light');document.documentElement.setAttribute('data-theme',t);
 const m=document.querySelector('meta[name="theme-color"]');if(m)m.setAttribute('content',t==='dark'?'#0f1a2b':'#14284b');subs.forEach(f=>f(t))};
export const setTheme=c=>{try{c==='auto'?localStorage.removeItem(KEY):localStorage.setItem(KEY,c)}catch(e){}apply()};
export const toggleTheme=()=>setTheme(currentTheme()==='dark'?'light':'dark');
export const onTheme=f=>{subs.add(f);return f};
export const offTheme=f=>subs.delete(f);
try{const q=window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)');if(q&&q.addEventListener)q.addEventListener('change',()=>{if(!stored())apply()})}catch(e){}
apply();
