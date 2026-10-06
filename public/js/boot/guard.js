/* Start-up guard. Shows a message only if the site itself fails to start. Blocked analytics, missing images etc. are ignored,
   and nothing is ever wiped once the page is showing (main.js sets data-ready on #app). */
(function(){
  var app=document.getElementById('app');
  function fail(msg){if(!app||app.getAttribute('data-ready'))return;
    app.innerHTML='<div style="margin:24px;padding:16px;border:2px solid #b4502c;border-radius:10px;background:#fff;font:15px/1.5 system-ui,sans-serif;color:#1d2433">'+
    '<b>L.I.G.O. SPACE could not start.</b><br>'+String(msg).replace(/</g,'&lt;')+
    '<br><br>Please refresh the page. If this keeps happening, contact the team on 0182809790.</div>'}
  window.addEventListener('error',function(e){
    var t=e.target;
    if(t&&t!==window){if(t.tagName==='SCRIPT'&&t.src&&t.src.indexOf(location.origin+'/js/')===0)fail('A site file could not be loaded ('+t.src.split('/').slice(-2).join('/')+').');return}
    if(e.filename&&e.filename.indexOf(location.origin)===0)fail((e.message||'Script error')+' ('+e.filename.split('/').slice(-2).join('/')+':'+e.lineno+')')
  },true);
  window.addEventListener('unhandledrejection',function(e){fail(e.reason&&e.reason.message||e.reason)});
})();
