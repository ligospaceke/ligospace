// js/main.js
import { Header, Footer, Banner } from './components/common.js';
import { Home } from './pages/home.js';
import { About } from './pages/about.js';
import { SHSPage } from './pages/shs.js';
import { Future } from './pages/future.js';
import { Opps } from './pages/opportunities.js';
import { Impact } from './pages/impact.js';
import { Engage } from './pages/engage.js';
import { Info } from './pages/info.js';
import { Team, Founder, Program } from './pages/team.js';
import { Account } from './pages/account.js';
import { Admin } from './pages/admin.js';
import { mountChat } from './components/chat.js';

const routes={'':[Home,'/'],about:[About,'/about','About'],shs:[SHSPage,'/shs','Synchronized Human System'],future:[Future,'/future','Future Initiatives'],opportunities:[Opps,'/opportunities','Opportunities'],impact:[Impact,'/impact','Impact'],engage:[Engage,'/engage','Partner & Get Involved'],work:[Info('work'),'/work','Our Work'],education:[Info('education'),'/education','Education'],partners:[Info('partners'),'/partners','Partners'],stories:[Info('stories'),'/stories','Stories'],events:[Info('events'),'/events','Events'],contact:[Info('contact'),'/contact','Contact'],team:[Team,'/team','Team'],founder:[Founder,'/founder','Founder'],program:[Program,'/program','Programs'],account:[Account,'/account','My account'],admin:[Admin,'/admin','Admin']};
function render(){const [,seg,...rest]=(location.hash||'#/').split('/');const [Page,cur,title]=routes[seg||'']||routes[''];
 document.getElementById('app').replaceChildren(Header(cur),...(title?[Banner(title)]:[]),Page(rest),Footer());window.scrollTo(0,0);document.getElementById('app').setAttribute('data-ready','1')}
addEventListener('hashchange',render);render();
mountChat();