/* Runs before the page paints so there is no flash of the wrong theme. The theme module (js/core/theme.js) takes over afterwards. */
(function(){var t=null;try{t=localStorage.getItem('ligo:theme')}catch(e){}
var dark=t==='dark'||(t!=='light'&&window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches);
document.documentElement.setAttribute('data-theme',dark?'dark':'light');
var m=document.querySelector('meta[name="theme-color"]');if(m)m.setAttribute('content',dark?'#0f1a2b':'#14284b')})();
