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
import { Portal } from './pages/portal.js';
import { Showcase } from './pages/showcase.js';
import { PostPage } from './pages/post.js';
import { Stories, Events } from './pages/feed.js';
import { mountChat } from './components/chat.js';

const routes={'':[Home,'/'],about:[About,'/about','About'],shs:[SHSPage,'/shs','Synchronized Human System'],future:[Future,'/future','Future Initiatives'],opportunities:[Opps,'/opportunities','Opportunities'],impact:[Impact,'/impact','Impact'],engage:[Engage,'/engage','Partner & Get Involved'],work:[Info('work'),'/work','Our Work'],education:[Info('education'),'/education','Education'],partners:[Info('partners'),'/partners','Partners'],stories:[Stories,'/stories','Stories'],events:[Events,'/events','Events'],contact:[Info('contact'),'/contact','Contact'],team:[Team,'/team','Team'],founder:[Founder,'/founder','Founder'],program:[Program,'/program','Programs'],account:[Portal('account'),'/account'],admin:[Portal('admin'),'/admin'],showcase:[Showcase,'/showcase','Showcase'],post:[PostPage,'/showcase']};
function render(){const [,seg,...rest]=(location.hash||'#/').split('/');const [Page,cur,title]=routes[seg||'']||routes[''];
 const portal=seg==='account'||seg==='admin';document.body.classList.toggle('portal',portal);document.body.classList.remove('nav-open');
 document.getElementById('app').replaceChildren(Header(cur,portal),...(title?[Banner(title)]:[]),Page(rest),...(portal?[]:[Footer()]));window.scrollTo(0,0);document.getElementById('app').setAttribute('data-ready','1')}
addEventListener('hashchange',render);render();
mountChat();
