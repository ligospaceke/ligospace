// js/core/dom.js
export const h=(t,p={},...c)=>{const e=document.createElement(t);for(const k in p){const v=p[k];if(k.startsWith('on'))e.addEventListener(k.slice(2),v);else if(k==='class')e.className=v;else if(v!==false&&v!=null)e.setAttribute(k,v)}c.flat(Infinity).forEach(x=>x!=null&&x!==false&&e.append(x.nodeType?x:document.createTextNode(x)));return e};
export const store=(()=>{let s={},subs=[];return{get:k=>s[k],set(k,v){s[k]=v;subs.forEach(f=>f(k))},sub:f=>subs.push(f),init:o=>{s={...o}}}})();
export const disk={get(k,d){try{const v=localStorage.getItem('ligo:'+k);return v?JSON.parse(v):d}catch(e){return d}},set(k,v){try{localStorage.setItem('ligo:'+k,JSON.stringify(v))}catch(e){}}};
