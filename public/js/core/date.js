// js/core/date.js: tiny date helpers for events (dates are plain YYYY-MM-DD, no time zones to get wrong)
const M=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const rx=/^(\d{4})-(\d{2})-(\d{2})/;
export const fmt=s=>{const m=rx.exec(s||'');return m?(+m[3])+' '+M[+m[2]-1]+' '+m[1]:''};
export const parts=s=>{const m=rx.exec(s||'');return m?{d:+m[3],mon:M[+m[2]-1]}:null};
export const today=()=>{const d=new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')};
